const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },    
    status:{
        type: Boolean,
        default: false, 
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }
});

const taskModel = mongoose.model('Task', taskSchema);  

module.exports = taskModel;
