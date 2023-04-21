var express = require('express');

var bodyparser = require('body-parser')
var multer = require('multer');

const { getStorage, ref, uploadBytesResumable, getDownloadURL } = require("firebase/storage");

const { getFirestore, collection, addDoc, } = require('firebase/firestore');

const db = getFirestore()
const storage = getStorage()


var router = express.Router();
 
var upload = multer({ storage: multer.memoryStorage() })


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
router.post(('/upload'),upload.single("file"), async (req, res) => {
        try {
          
          //gets a storage reference and appends the file name
          const storageRef = ref(storage, `files/${req.file.originalname}`)
          console.log(storageRef)
          const metadata = {
            contentType: req.file.mimetype,
          };

          // Upload the file in the bucket storage
          const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, metadata);
          //by using uploadBytesResumable we can control the progress of uploading like pause, resume, cancel

          // Grab the public url
          const downloadURL = await getDownloadURL(snapshot.ref);

          const Proposals = collection(db, 'projects');
           const Proposal = {
             topic: req.body.topic,
             downloadURL: downloadURL
            }
          console.log(req.body)
          const response = await addDoc(Proposals, Proposal)
            
          res.statusCode= 200
          res.send(response)
        } catch (error) {
          return res.status(400).send(error.message)
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
