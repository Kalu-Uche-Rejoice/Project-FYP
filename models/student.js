const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
})

var student = mongoose.model('student',studentSchema);
module.exports(student);