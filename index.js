// const express = require("express");
import express from 'express';
import dotenv from "dotenv"; //para ocultar las variables de entorno
import cors from "cors"; //para ocultar las permitir la conexion desde otro dominio con el frontend
import connectDB from './config/db.js'; //debemos colocar .js para que agarre el import
import userRoutes from './routes/userRoutes.js'; //exportamos la ruta que queremos utilizar
import projectRoutes from './routes/projectRoutes.js'; //exportamos la ruta que queremos utilizar
import taskRoutes from './routes/taskRoutes.js'; //exportamos la ruta que queremos utilizar



const app = express();
app.use(express.json()); //para que pueda procesar la info tipo json

dotenv.config(); //para ocultar las variables de entorno en env



//use soporta los verbos get, post, put, patch y delete

connectDB(); //nos conectamos con la base de datos


// const whitelist = [process.env.FRONTEND_URL]; //para que pueda comunicarse con el frontend

// // console.log(whitelist);

// const corsOptions = {
//     origin: function(origin, callback){
//         if(whitelist.includes(origin)){
//             callback(null, true);
//         }else{
//             callback(new Error('No permitido por CORS'));
//         }
//     },
// };

// app.use(cors(corsOptions)); //para que pueda comunicarse con el frontend  

app.use(cors({
    'allowedHeaders': ['sessionId', 'Content-Type'],
    'exposedHeaders': ['sessionId'],
    'origin': '*',
    'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
    'preflightContinue': false
  }));

//Routing
app.use('/api/users', userRoutes);
app.use('/api/proyectos', projectRoutes);
app.use('/api/tasks', taskRoutes);



const PORT = process.env.PORT || 4000; //utilizamos el puerto utilizado en ENV o sino el 4000

app.listen(PORT, () => {

    console.log(`Servidor corriendo en el puerto ${PORT}`);
});