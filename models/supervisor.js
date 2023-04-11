const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const student= require('./student');

const supervisorSchema = new Schema({
    stafID :{
        type: String,
        required: true,
        unique: true,
    },
    title: {
        type: String,
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
    admin:{
        type: Boolean,
        required:true,
        default:false
    },
    Notification:{
        type: String,
    },
    //supervisees: [student],
})

var supervisor = mongoose.model('supervisor',supervisorSchema);
module.exports= supervisor;