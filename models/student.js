const { Binary } = require('mongodb');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const tasksSchema = new Schema({
    WeekNumber:{ 
        type: String,
        
    },
    completed:{
       type: Boolean,
       default: false

    },
    Task:{
        type: String,
    }
},{timestamps:true})
const ProposalSchema = new Schema({
    approved:{
       type: Boolean,
       default: false

    },
    topic:{
        type: String,
        required:true
    },
    file:{
        data:Buffer,
        contentType: String
    },
    fileName: {
        type: String,
        required: true,
      }
    
},{timestamps:true})
const studentSchema = new Schema({
    matriculationNumber :{
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true
    },
    course :{
        type: String,
        required: true
    },
    email :{
        type: String,
        required: true,
        unique: true,
    },
    Notification:{
        type: String,
    },
    task: [tasksSchema],
    proposal: [ProposalSchema]
})

var student = mongoose.model('student',studentSchema);
var prop = mongoose.model('proposal',ProposalSchema);
module.exports= prop;
module.exports= student;