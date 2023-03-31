const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const student= require('./student')
const supervisor= require('./supervisor')

const ProjectSchema = new Schema({
    topic:{
        type: String,
        required: true,
    },
    abstract:{
        type: Boolean,
        required:true,
        default:false
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