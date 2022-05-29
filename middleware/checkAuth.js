import jwt from 'jsonwebtoken';//importamos jwt
import User from '../models/User.js';


const checkAuth = async(req, res, next) => { //next es para que vaya al siguiente middleware

    let token; //definimos el token
    // console.log(req.headers.authorization);
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){

        try{
                                    //split divide la cadena bearer es el primero y el token la 2da por eso es 1             
            token = req.headers.authorization.split(' ')[1];
            // console.log(token);
            const decoded = jwt.verify(token, process.env.JWT_SECRET); //nos devuelve el id
            // console.log(decoded);
            
            req.user = await User.findById(decoded.id).select(
                "-password -confirmado -token -createdAt -updatedAt -__v"
            ); //select -password para que traiga todo menos la contraseña
            //buscamos por el id del decoded y nos da todo el perfil, colocamos 
            
            // console.log(req.user);
            
            return next(); //para que pase al siguiente middleware
        }catch(error) {
            return res.status(404).json({msg: "Hubo un error"});
        }
    }
    if(!token) { //si no existe el token

        const error = new Error("Token no válido");
        return res.status(401).json({msg: error.message});
    }

    next();
};  

export default checkAuth;