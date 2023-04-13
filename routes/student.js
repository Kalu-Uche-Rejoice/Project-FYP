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

var storage = multer.memoryStorage()
var upload = multer({ storage: storage })

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
/*router.post(('/upload'), upload.single("file"), async (req, res) => {
    console.log('okay')
    // req.file can be used to access all file properties
    try {
      //check if the request has an image or not
      if (!req.file) {
        res.json({
          success: false,
          message: "You must provide at least 1 file"
        });
      } else {
        let imageUploadObject = {
          file: {
            data: req.file.buffer,
            contentType: req.file.mimetype
          },
          fileName: req.body.fileName
        };
        const uploadObject = new Upload(imageUploadObject);
        // saving the object into the database
        const uploadProcess = await uploadObject.save();
        res.send('okay')
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("Server Error");
    }
  });*/

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
