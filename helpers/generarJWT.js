import jwt from "jsonwebtoken";

//DEBEMOS AÑADIRLO EN .ENV TAMBIEN y lo usamos en el controlador de user
                    //tomamos el id desde el controlador
const generarJWT = (id) => {
                    //genera un objeto con ese id
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: "30d", //por cuanto tiempo estara vigente el json web token
    });
}

export default generarJWT;