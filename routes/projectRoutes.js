import express from "express"; //importamos express
import {
    getProjects,
    newProject,
    getProject,
    editProject,
    deleteProject,
    searchCollaborator,
    addCollaborator,
    deleteCollaborator,
    
}from "../controllers/projectController.js"; // importamos el controlador de proyecto
import checkAuth from "../middleware/checkAuth.js"; //importamos el middleware

const router = express.Router();

router.get('/', checkAuth, getProjects); //primero pasamos al middleware y luego a obtener proyectos
router.post('/', checkAuth, newProject); //primero pasamos al middleware y luego a obtener proyectos

router //como son rutas que necesitan que pasen el id y son iguales se puede colocar de esta manera
    .route('/:id')
    .get(checkAuth, getProject) //cuando sea metodo get hace getProject
    .put(checkAuth, editProject)    //cuando sea metodo put hace editProject
    .delete(checkAuth, deleteProject);   //cuando sea metodo delete hace deleteProject


router.post("/colaboradores", checkAuth, searchCollaborator); //para añadir colaborador
router.post("/colaboradores/:id", checkAuth, addCollaborator); //para añadir colaborador
router.delete("/colaboradores/:id", checkAuth, deleteCollaborator); //para eliminar colaborador


export default router;