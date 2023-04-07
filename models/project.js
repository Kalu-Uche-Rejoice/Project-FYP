const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const student= require('./student')
const supervisor= require('./supervisor')
const logSchema = newSchema({
    supervisorComment: {
        type:String,
        required:true
    },
    studentLog: {
        type:String,
        required:true,
    }
},{
    timestamps:true
})
const ProjectSchema = new Schema({
    topic:{
        type: String,
        required: true,
    },
    abstract:{
        type: String,
        required:true,
        default:''
    },
    approved:{
        type: Boolean,
        required:true,
        default:false
    },
    cleared:{
        type: Boolean,
        required:true,
        default:false
    },
    author:[student],
    supervisor:[supervisor]
},{timestamps: true}
)

var project = mongoose.model('project',ProjectSchema);
module.exports(project);