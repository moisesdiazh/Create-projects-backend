import Project from "../models/Project.js";
import User from "../models/User.js";

const getProjects = async (req, res) => {
  //para obtener proyectos

  const projects = await Project.find()
    .where("owner")
    .equals(req.user)
    .select("-tasks");
  //busca los proyectos donde el creador es igual al req.user, donde aparece el nombre, el id, etc

  res.json(projects); //mandamos la respueta json de los proyectos filtrados por usuario logueado
};

const newProject = async (req, res) => {
  //nuevo proyecto
  // console.log(req.body); vemos que llega los datos por postman

  //console.log(req.user); vemos que llega el usuario autenticado

  const project = new Project(req.body); //creamos un nuevo proyecto pidiendo los datos por formulario en el body

  project.owner = req.user._id; //el creador del proyecto sera igual al id del usuario

  try {
    const projectSave = await project.save(); //guardamos en la bd
    res.json(projectSave); //enviamos la respuesta json
  } catch (error) {
    console.log(error);
  }
};

const getProject = async (req, res) => {
  //para obtener proyecto y las tareas asociadas con ese proyecto

  const { id } = req.params; //como es un id dinamico en la ruta, debemos pedirlo por la url con params
  //el id es de proyecto
  // console.log(id);

  const project = await Project.findById(id).populate("tasks"); //populate para que nos muestre las tareas asociadas al proyecto

  console.log(project);
  if (!project) {
    //si no existe el proyecto
    const error = new Error("No encontrado.");
    return res.status(404).json({ msg: error.message });
  }

  // de esta forma hacemos que el usuario que pueda acceder solamente sea quien lo creo
  if (project.owner.toString() !== req.user._id.toString()) {
    const error = new Error("Acción no válida."); //los mensajes de error
    return res.status(401).json({ msg: error.message });
  }

  //Obtener las tareas del proyecto
  //buscamos las tareas donde project es igual al id del proyecto en el modelo de project
  // const task = await Task.find().where("project").equals(project._id);

  res.json(
    project
    // task,
  );
};

const editProject = async (req, res) => {
  //para editar proyecto

  const { id } = req.params; //como es un id dinamico en la ruta, debemos pedirlo por la url con params
  //el id es de proyecto
  // console.log(id);

  const project = await Project.findById(id);

  console.log(project);
  if (!project) {
    //si no existe el proyecto
    const error = new Error("No encontrado.");
    return res.status(404).json({ msg: error.message });
  }

  // de esta forma hacemos que el usuario que pueda acceder solamente sea quien lo creo
  if (project.owner.toString() !== req.user._id.toString()) {
    const error = new Error("Acción no válida."); //los mensajes de error
    return res.status(401).json({ msg: error.message });
  }
  //copiamos la misma logica que getProject

  project.name = req.body.name || project.name; //decimos que el nombre es igual al lo que enviamos por formulario o igual que en la bd
  project.description = req.body.description || project.description; //decimos que el description es igual al lo que enviamos por formulario o igual que en la bd
  project.finishDate = req.body.finishDate || project.finishDate; //decimos que el finishDate es igual al lo que enviamos por formulario o igual que en la bd
  project.client = req.body.client || project.client; //decimos que el client es igual al lo que enviamos por formulario o igual que en la bd

  try {
    const projectSave = await project.save(); //guardamos en la bd
    res.json(projectSave); //respondemos un json con el proyecto guardado
  } catch (error) {
    console.log(error); //error
  }
};

const deleteProject = async (req, res) => {
  //para eliminar proyecto

  const { id } = req.params; //como es un id dinamico en la ruta, debemos pedirlo por la url con params
  //el id es de proyecto
  // console.log(id);

  const project = await Project.findById(id);

  // console.log(project);
  if (!project) {
    //si no existe el proyecto
    const error = new Error("No encontrado.");
    return res.status(404).json({ msg: error.message });
  }

  // de esta forma hacemos que el usuario que pueda acceder solamente sea quien lo creo
  if (project.owner.toString() !== req.user._id.toString()) {
    const error = new Error("Acción no válida."); //los mensajes de error
    return res.status(401).json({ msg: error.message });
  }
  //copiamos la misma logica que getProject -----

  try {
    await project.deleteOne(); //para borrar de la bd un documento
    res.json({ msg: "Proyecto eliminado" }); //respondemos un json con el proyecto guardado
  } catch (error) {
    console.log(error); //error
  }
};

const searchCollaborator = async (req, res) => {
  //para añadir colaborador
  const { email } = req.body; //obtenemos el email del formulario

  const user = await User.findOne({ email }).select(
    "-confirmado -createdAt -password -token -updatedAt -__v "
  ); //buscamos el usuario por email

  if (!user) {
    const error = new Error("Este usuario no ha sido encontrado");
    return res.status(404).json({ msg: error.message });
  }

  res.json(user);
};

const addCollaborator = async (req, res) => {
  //para añadir colaborador
  const project = await Project.findById(req.params.id);

  if (!project) {
    const error = new Error("Este proyecto no ha sido encontrado");

    return res.status(404).json({ msg: error.message });
  }

  if (project.owner.toString() !== req.user._id.toString()) {
    const error = new Error("Acción no válida");

    return res.status(404).json({ msg: error.message });
  }

  const { email } = req.body; //obtenemos el email del formulario

  const user = await User.findOne({ email }).select(
    "-confirmado -createdAt -password -token -updatedAt -__v "
  ); //buscamos el usuario por email

  if (!user) {
    const error = new Error("Este usuario no ha sido encontrado");
    return res.status(404).json({ msg: error.message });
  }

  //verificamos que el colaborador no es el admin del proyecto
  if(project.owner.toString() === user._id.toString()){
    const error = new Error("El creador del proyecto no puede ser un colaborador");
    return res.status(404).json({ msg: error.message });
  }

  //revisar que no este agregado al proyecto el colaborador
  if(project.collaborators.includes(user._id)){
    const error = new Error("El usuario ya es colaborador del proyecto");
    return res.status(404).json({ msg: error.message });
  }

  //agregamos el colaborador al proyecto
  project.collaborators.push(user._id);
  await project.save();
  res.json({msg: "Colaborador agregado de forma correcta"})

};

const deleteCollaborator = async (req, res) => {
  //eliminar colaborador
};

// const getTasks = async(req, res) => { //No utilizamos este getTasks porque lo hacemos en getProject

//     const {id} = req.params;

//     const project = await Project.findById(id);

//     if(!project) { //si no existe el proyecto
//         const error = new Error("No encontrado.");
//         return res.status(404).json({msg: error.message});
//     }

//     const task = await Task.find().where("project").equals(id);

//     res.json(task);
// }

export {
  getProjects,
  newProject,
  getProject,
  editProject,
  deleteProject,
  addCollaborator,
  deleteCollaborator,
  searchCollaborator,
};
