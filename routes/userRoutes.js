import express from "express";

const router = express.Router();

import {
    register, 
    auth, 
    confirmToken, 
    olvidePassword, 
    confirmTokenPassword, 
    newPassword, 
    profile
} from '../controllers/userController.js'

import checkAuth from '../middleware/checkAuth.js'; //middleware

// router.get("/", users);
// router.post("/", createUser);

// autenticacion, registro y confirmacion de usuarios
router.post("/", register);
router.post("/login", auth);
router.get("/confirmar/:token", confirmToken);
router.post("/olvide-password", olvidePassword);
router.get("/olvide-password/:token", confirmTokenPassword);
router.post("/olvide-password/:token", newPassword);
// router.route("/olvide-password/:token").get(confirmTokenPassword).post(newPassword) 
//en caso que tengas rutas repetidas puedes colocarlo de esta manera

router.get("/perfil", checkAuth, profile); //primero ejecuta el middleware del checkauth y luego va al perfil

export default router;
//exportamos la ruta