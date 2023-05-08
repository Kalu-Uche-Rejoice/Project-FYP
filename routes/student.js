var express = require('express');

const {
  singleFileSubmit,
  findFile
} = require('../controllers/read-file')

var router = express.Router();
var bodyparser = require('body-parser') 


var multer = require('multer');

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
router.post(('/upload'),upload.array("file", 4), async (req, res) => {
         try {
          console.log(req.files)
            for (let index = 0; index < 2; index++) {
            //gets a storage reference and appends the file name
            const storageRef = ref(storage, `files/${req.files[index].originalname}`)
            const metadata = {
              contentType: req.files[index].mimetype,
            };
              // Upload the file in the bucket storage
            const snapshot = await uploadBytesResumable(storageRef, req.files[index].buffer, metadata);
            //by using uploadBytesResumable we can control the progress of uploading like pause, resume, cancel

            // Grab the public url
            const downloadURL = await getDownloadURL(snapshot.ref);

            const Proposals = collection(db, 'projects');
            const Proposal = {
              topic: req.body.topic[index],
              downloadURL: downloadURL
              }
            console.log(req.body)
            const response = await addDoc(Proposals, Proposal)
          }
          
            
          res.statusCode= 200
          res.send(response)
        } catch (error) {
          return res.status(400).send(error.message)
        }
  });


router.get('/past-project',  
async (req, res, next) =>{
  res.render('past-FYP', { title: 'Express' })

  //findFile(req, res, 'finalProjectReport')
}
);


router.route('/project-upload')
.get(function(req, res, next) {
    res.render('project final upload module', { title: 'Express' });
})
.post(upload.single("file"), async (req, res) =>{
  singleFileSubmit( req, res, 'finalProjectReport', "finalupload")
})


router.get('/clearance', function(req, res, next) {
    
    res.render('cleared-student', { title: 'Express' });
  });
module.exports = router;
