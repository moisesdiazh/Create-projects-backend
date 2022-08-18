import Project from "../models/Project.js";
import Task from "../models/Task.js";


const addTask = async (req, res) => {
    // console.log(req.body);

    const {project} = req.body; //nos traemos el proyecto

    const existProject = await Project.findById(project); //nos traemos el proyecto filtrado por el id

    if(!existProject) { //si no existe el proyecto entonces
        const error = new Error("El proyecto no existe.");
        return res.status(404).json({msg: error.message});
    }

    //si el creador del proyecto y el usuario enviado es diferente entonces
    if(existProject.owner.toString() !== req.user._id.toString()) { 
        const error = new Error("No tienes acceso para añadir tarea.");
        return res.status(404).json({msg: error.message});
    }

    try {

        const createTask = await Task.create(req.body); //creamos la tarea por lo enviado en el body
        //almacenar el id en el proyecto
        existProject.tasks.push(createTask._id);
        await existProject.save(); //guardamos el proyecto
        res.json(createTask); //mandamos respuesta json con la tarea creada
    }catch(error) {
        console.log(error);
    }
};

const getTask = async (req, res) => {

    const {id} = req.params;

    // console.log(id)
    //buscamos la tarea por el id enviado por la url y con populate buscamos el proyecto relacionado con dicha tarea
    const task = await Task.findById(id).populate("project"); 

    // console.log(task);

    if(!task) { //si no existe la tarea
        const error = new Error("Tarea no encontrada.");
        return res.status(404).json({msg: error.message});
    }

    //si el creador del proyecto y el usuario enviado es diferente entonces
    if(task.project.owner.toString() !== req.user._id.toString()) { 
        const error = new Error("Acción no válida.");
        return res.status(403).json({msg: error.message});
    }

    res.json(task);
};

const updateTask = async (req, res) => {

    const {id} = req.params;

    // console.log(id)
    //buscamos la tarea por el id enviado por la url y con populate buscamos el proyecto relacionado con dicha tarea
    const task = await Task.findById(id).populate("project"); 

    // console.log(task);

    if(!task) { //si no existe la tarea
        const error = new Error("Tarea no encontrada.");
        return res.status(404).json({msg: error.message});
    }

    //si el creador del proyecto y el usuario enviado es diferente entonces
    if(task.project.owner.toString() !== req.user._id.toString()) { 
        const error = new Error("Acción no válida.");
        return res.status(403).json({msg: error.message});
    }

    task.name = req.body.name || task.name;
    task.description = req.body.description || task.description;
    task.priority = req.body.priority || task.priority;
    task.finishDate = req.body.finishDate || task.finishDate;

    try {
        const saveTask = await task.save();

        res.json(saveTask);
    } catch (error) {
        console.log(error);
    }


};

const deleteTask = async (req, res) => {

    const {id} = req.params;

    // console.log(id)
    //buscamos la tarea por el id enviado por la url y con populate buscamos el proyecto relacionado con dicha tarea
    const task = await Task.findById(id).populate("project"); 

    // console.log(task);

    if(!task) { //si no existe la tarea
        const error = new Error("Tarea no encontrada.");
        return res.status(404).json({msg: error.message});
    }

    //si el creador del proyecto y el usuario enviado es diferente entonces
    if(task.project.owner.toString() !== req.user._id.toString()) { 
        const error = new Error("Acción no válida.");
        return res.status(403).json({msg: error.message});
    }

    try {
        await task.deleteOne();
        res.json({msg: "Tarea ha sido eliminada."});

    } catch (error) {
        console.log(error);
    }
};

const changeStatus = async (req, res) => {
    console.log(req.params.id);
};

export {
    addTask,
    getTask,
    updateTask,
    deleteTask,
    changeStatus,
}