import mongoose from "mongoose";
import bcrypt from "bcrypt"; //para poder hashear las contraseñas

const userSchema = mongoose.Schema({

    nombre: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true, //para que sea unico
    },
    token: {
        type: String,
    },
    confirmado: {
        type: Boolean,
        default: false,
    },
}, 
    {
        timestamps: true, //creara 2 columnas, una de creado y otra de actualizado
    }
);

//para hashear, esto se va a ejecutar antes de guardar el registro en la mongodb

userSchema.pre("save", async function(next) {

    if(!this.isModified("password")){ //revisa que el password hasheado no haya sido modificado
        next();
    }
    const salt = await bcrypt.genSalt(10); 
    //para colocarle que se hashee 10 veces
    
    this.password = await bcrypt.hash(this.password, salt); //lo que queremos hashear, el salt para hashearlo 10 veces
});

//verificamos que la password es correcta
userSchema.methods.checkPassword = async function
(passwordFormulario) {

    return await bcrypt.compare(passwordFormulario, this.password);
                        //comparamos el password pasado por el usuario con el de la bd
};

//definimos el modelo
const User = mongoose.model("User", userSchema); //como queremos llamarlo y usarlo, como definimos el esquema
export default User;