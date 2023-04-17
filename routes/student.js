var express = require('express');

var bodyparser = require('body-parser')
var mongoose = require('mongoose');
var multer = require('multer');

var mongoose = require('mongoose');
var crypto = require('crypto'); 
var GridFSStorage = require('multer-gridfs-storage');
var Grid = require('gridfs-stream');
var methodOverride = require('method-override');

var Upload = require('../models/upload');

var project = require('../models/project')
var student = require('../models/student')

var router = express.Router();

/*var storage = multer.memoryStorage()
var upload = multer({ storage: storage })*/

const FBadmin = require('firebase-admin');
// import database into app
const db =FBadmin.firestore();

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
router.post(('/upload'),async (req, res) => {
        try {
          const Proposals = db.collection('proposals');
          const Proposal = {
            matricNo: req.body.matriculationNumber,
            topic: req.body.topic
          }
          console.log(req.body)
          const response = await Proposals.add(Proposal)
          
          res.statusCode= 200
          res.send(response)
        } catch (error) {
          res.send(error)
        }
  });

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
