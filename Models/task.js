const mongoose = require('mongoose')

const TaskSchema = mongoose.Schema(
    {
        title:{
            type:String,
            required:[[true,"Please enter a Title"]]
        },
        description:{
            type:String,
            required:[true,"Please enter Description"]
        },
        status:{
            type:String,
            enum:['pending','completed','deleted'],
            default:"pending"
        },
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:true
        },
        created_at:{
            type: Date
        },
        updated_at:{
            type:Date
        }
    }
);

const TaskModel = mongoose.model("Task", TaskSchema)

module.exports = TaskModel