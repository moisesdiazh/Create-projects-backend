import User from "../models/User.js";
import generarId from "../helpers/generarId.js"; //para generar ids
import generarJWT from "../helpers/generarJWT.js"; //para generar ids
import { emailForgotPassword, emailRegister } from "../helpers/email.js";


const register = async (req, res) => {
  //evitando registros duplicados
  const { email } = req.body;
  //buscamos en mongodb el registro que coincida con el email
  const existeUsuario = await User.findOne({ email });

  // console.log(existeUsuario);

  if (existeUsuario) {
    const error = new Error("Usuario ya esta en uso");
    return res.status(400).json({ msg: error.message });
  }

  try {
    const user = new User(req.body);

    //creamos una instancia de Usuario
    user.token = generarId();

    const userSave = await user.save(); //guardamos el usuario en la db
    //colocamos un await para esperar que finalice de insertar el registro

    //enviar el email de confirmacion
    emailRegister({
        email: user.email,
        name: user.nombre,
        token: user.token,
    });

    res.json({
      msg: "Usuario creado correctamente, hemos enviado un email para confirmar tu cuenta.",
    }); //respuesta una vez se cree el usuario

    // console.log(user); para ver que llega
  } catch (error) {
    //colocamos un catch para debuguear en caso de error
    console.log(error);
  }
};

const auth = async (req, res) => {
  //extraemos el email y la password
  const { email, password } = req.body;

  //comprobamos que el usuario existe
  const user = await User.findOne({ email });

  // console.log(user);

  if (!user) {
    const error = new Error("El usuario no existe");
    return res.status(404).json({ msg: error.message });
  }

  // //comprobamos si el usuario esta confirmado
  if (!user.confirmado) {
    const error = new Error("Tu cuenta no ha sido confirmada");
    return res.status(403).json({ msg: error.message });
  }

  //comprobamos su password, debemos hacer el checkPassword en el modelo de User
  if (await user.checkPassword(password)) {
    // console.log("Es correcto");

    // console.log("Es incorrecto");

    res.json({
      _id: user._id,
      nombre: user.nombre,
      email: user.email,
      token: generarJWT(user._id),
    });
  } else {
    const error = new Error("El password es incorrecto");
    return res.status(403).json({ msg: error.message });
  }
};

const confirmToken = async (req, res) => {
  //confirmamos el token del usuario

  // console.log(req.params.token); viendo que llega

  const { token } = req.params; //leemos de la url lo que nos mandan

  const userConfirm = await User.findOne({ token });

  // console.log(userConfirm) verificamos que llega el usuario por el token

  if (!userConfirm) {
    //vemos que el usuario no esta confirmado
    const error = new Error("Token no válido");
    return res.status(403).json({ msg: error.message });
  }

  try {
    userConfirm.confirmado = true; //cambiamos el confirmado del usuario
    userConfirm.token = ""; //vaciamos el token para que sea de 1 solo uso
    await userConfirm.save(); //guardamos en la bd
    res.json({ msg: "Usuario confirmado" });
  } catch (error) {
    console.log(error);
  }
};

const olvidePassword = async (req, res) => {
  const { email } = req.body;

  //comprobamos que el usuario existe
  const user = await User.findOne({ email });

  // console.log(user);

  if (!user) {
    const error = new Error("El usuario no existe");
    return res.status(404).json({ msg: error.message });
  }

  try {
    user.token = generarId(); //generamos un nuevo id
    await user.save(); //guardamos en la bd

    //Enviar el email
    emailForgotPassword({ 

      email: user.email,
      name: user.nombre,
      token: user.token,
    });

    res.json({ msg: "Hemos enviado un email para recuperar su contraseña" });
  } catch (error) {
    console.log(error);
  }
};

const confirmTokenPassword = async (req, res) => {
  const { token } = req.params; //cuando queremos extraer valores de la url usamos req.params
  //cuando queremos extraer valores de un formulario es con req.body

  const validToken = await User.findOne({ token }); //buscamos por el token

  if (validToken) {
    res.json({ msg: "Token válido y el Usuario existe." });
  } else {
    const error = new Error("Token no válido.");
    return res.status(404).json({ msg: error.message });
  }
};

const newPassword = async (req, res) => {
  const { token } = req.params; //lo pedimos por la url
  const { password } = req.body; //lo pedimos por un formulario

  // console.log(token);
  // console.log(password);

  const user = await User.findOne({ token }); //buscamos por el token

  if (user) {
    user.password = password; //el password sera igual al nuevo password obtenido en el formulario
    user.token = ""; //limpiamos el token para que no lo puedan usar

    try {
      await user.save(); //guardamos en la bd
      res.json({ msg: "Su password ha sido modificada" });
    } catch (error) {
      console.log(error);
    }
  } else {
    const error = new Error("Token no válido.");
    return res.status(404).json({ msg: error.message });
  }
};

const profile = async (req, res) => {
  // console.log("desde perfil");

  const { user } = req; //el usuario enviado por el middleware checkAuth

  res.json(user); //mandamos un json con el usuario
};

export {
  register,
  auth,
  confirmToken,
  olvidePassword,
  confirmTokenPassword,
  newPassword,
  profile,
};
