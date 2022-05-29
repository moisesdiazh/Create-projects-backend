// const express = require("express");
import express from 'express';
import dotenv from "dotenv"; //para ocultar las variables de entorno
import connectDB from './config/db.js'; //debemos colocar .js para que agarre el import
import userRoutes from './routes/userRoutes.js'; //exportamos la ruta que queremos utilizar
import projectRoutes from './routes/projectRoutes.js'; //exportamos la ruta que queremos utilizar
import taskRoutes from './routes/taskRoutes.js'; //exportamos la ruta que queremos utilizar


const app = express();
app.use(express.json()); //para que pueda procesar la info tipo json

dotenv.config(); //para ocultar las variables de entorno en env

//colocamos el routing
app.use('/api/users', userRoutes);
app.use('/api/proyectos', projectRoutes);
app.use('/api/tasks', taskRoutes);

//use soporta los verbos get, post, put, patch y delete

connectDB(); //nos conectamos con la base de datos

const PORT = process.env.PORT || 4000; //utilizamos el puerto utilizado en ENV o sino el 4000

app.listen(PORT, () => {

    console.log(`Servidor corriendo en el puerto ${PORT}`);
});