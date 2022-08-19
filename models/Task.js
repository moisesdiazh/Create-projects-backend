import mongoose from "mongoose";

const taskSchema = mongoose.Schema ({

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
    status: {
        type: Boolean,
        default: false
    },
    finishDate: {
        type: Date,
        required: true,
        default: Date.now()
    },
    priority: {
        type: String,
        required: true,
        enum: ["Baja", "Media", "Alta"],
    },
    project: {
        type: mongoose.Schema.Types.ObjectId, //cada tarea tiene un proyecto asociado para relacionarlas
        ref: "Project"
    },
    complete: {
        type: mongoose.Schema.Types.ObjectId, //cada tarea tiene un proyecto asociado para relacionarlas
        ref: "User"
    }

}, 
    {
        timestamps: true,
    }
);

const Task = mongoose.model("Task", taskSchema);

export default Task;