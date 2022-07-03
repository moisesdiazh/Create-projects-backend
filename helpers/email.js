import nodemailer from "nodemailer";

export const emailRegister = async (data) => {
  //enviamos desde el controlador de userController la data en la funcion de registro
  // console.log("data", data);

  const { email, name, token } = data; //desestructuramos de data lo que obtenimos del controlador

  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  //Info del email

  const info = await transport.sendMail({
    from: '"UpTask" - Admin de Proyectos" <account@uptask.com>',
    to: email,
    subject: "UpTask - Confirmación de cuenta",
    text: "Confirmación de cuenta",
    html: `<p>Hola: ${name} Confirma tu cuenta en UpTask</p>
        <p>Tu cuenta ya esta casi lista, solo debes comprobarla en el sigueinte enlace:</p>
        <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Confirmar cuenta</a>
        <p>Si tu no creaste esta cuenta, ignora este mensaje.</p>
        `,
  });
};

export const emailForgotPassword = async (data) => {
  //enviamos desde el controlador de userController la data en la funcion de registro
  // console.log("data", data);

  const { email, name, token } = data; //desestructuramos de data lo que obtenimos del controlador

  //Mover a variables de entorno
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  //Info del email

  const info = await transport.sendMail({
    from: '"UpTask" - Admin de Proyectos" <account@uptask.com>',
    to: email,
    subject: "UpTask - Reestablece tu contraseña",
    text: "Reestablece tu Contraseña",
    html: `<p>Hola: ${name} Reestablece tu Contraseña en UpTask</p>
      <p>Ve al sigueinte enlace:</p>
      <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Reestablecer tu contraseña</a>
      <p>Si no solicitaste este email, ignora este mensaje.</p>
      `,
  });
};
