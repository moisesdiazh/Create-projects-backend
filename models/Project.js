import mongoose from 'mongoose';

const projectSchema = mongoose.Schema({ //el model de project
    name: {
        type: String,
        trim: true,
        required: true
    },
    description: {
        type: String,
        trim: true,
        required: true
    },
    finishDate: {
        type: Date,
        default: Date.now()
    },
    client: {
        type: String,
        trim: true,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId, //para relacionar el creador con un usuario ya creado
        ref: 'User' //referido al model de Usuario
    },
    tasks: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Task',
            
        }
    ],
    collaborators: [ //porque puede haber varios colaboradores 
        {
            type: mongoose.Schema.Types.ObjectId, //para relacionar el creador con un usuario ya creado
            ref: 'User' //referido al model de Usuario
        },
    ],
},
    { //para que cree el createdAt, UpdatedAt y DeleteAt
        timestamps: true,
    }
);

const Project = mongoose.model('Project', projectSchema); 
//creamos una variable para indicar el nombre y el schema que exportaremos

export default Project;