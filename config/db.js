//configuramos la bd

//importamos mongoose
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI, //llamamos la variable de entorno de env
      
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    const url = `${connection.connection.host}:${connection.connection.port}`;

    console.log(`MongoDb Conectado en: ${url}`);

  } catch (error) {
    //por si falla la conexión a la db
    console.log(`error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB; //para hacerlo disponible en otros archivos
