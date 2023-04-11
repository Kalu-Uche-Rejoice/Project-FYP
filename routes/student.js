var express = require('express');

var bodyparser = require('body-parser')
var mongoose = require('mongoose');

var project = require('../models/project')
var student = require('../models/student')

var router = express.Router();
router.use(bodyparser.json());
router.route('/')
.post((req, res, next)=>{
    student.create(req.body)
    .then((student)=>{
        console.log('student created',student);
        res.statusCode = 200;
        res.setHeader('Content-Type','appliaction/json');
        res.json(student);
    },(err)=>{next(err)})
    .catch((err)=>next(err));
})
router.route('/log')
.get(function(req, res, next) {
    res.render('studeproject monitoring module');
});

router.route('/proposal')
.get(function(req, res, next) {
    res.render('proposal module', { title: 'Express' });
})
.post((req, res, next)=>{
    student.findOne({matriculationNumber:req.body.matriculationNumber})
    .then((student)=>{
        if (student != null) {
            student.proposal.push({
                topic: req.body.topic
            });
            student.save()
            .then((proposal)=>{
                res.statusCode = 200;
                res.setHeader('Content-type','application/json');
                res.json(proposal);
            })
        }
    },(err)=>{next(err)})
    .catch((err)=>{
        next(err)
    })
})

router.get('/past-project', function(req, res, next) {
    res.render('past FYP', { title: 'Express' });
});
router.get('/project-upload', function(req, res, next) {
    res.render('project final upload module', { title: 'Express' });
});
router.get('/clearance', function(req, res, next) {
    
    res.render('cleared-student', { title: 'Express' });
  });
module.exports = router;
