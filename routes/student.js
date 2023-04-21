var express = require('express');

var bodyparser = require('body-parser')
var multer = require('multer');

const { getStorage, ref, uploadBytesResumable, getDownloadURL } = require("firebase/storage");

const { getFirestore, collection, addDoc, getDocs } = require('firebase/firestore');

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
router.post(('/upload'),upload.array("file"), async (req, res) => {
        try {
          
          //gets a storage reference and appends the file name
          const storageRef = ref(storage, `files/${req.file.originalname}`)
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

router.get('/past-project', async function(req, res, next) {
// this route will query the final project report collection and get all the documents in it
  var PastP = []
  const pastProjects = await getDocs(collection(db, "finalProjectReport"));
  pastProjects.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    PastP.push(doc.data())
    //console.log(doc.id, " => ", doc.data());
    console.log(PastP)
  });
  //declare an array of objects
 
  
    res.render('past FYP', { title: 'Express' });
});
router.route('/project-upload')
.get(function(req, res, next) {
    res.render('project final upload module', { title: 'Express' });
})
.post(upload.single("file"), async(req,res)=>{
  // the plan is to store all the final uploads in a seperate collection 
  // each document in the collection will contain the users id along with the details from the form
  // because I need the supervisors ID i use the project topic to query the project collections then when i find a match i will copy the supervisors id
  try {
     //gets a storage reference and appends the file name
     console.log(req.body)
     console.log(req.file)
     const storageRef = ref(storage, `finalupload/${req.file.originalname}`)
     const metadata = {
       contentType: req.file.mimetype,
     };

     // Upload the file in the bucket storage
     const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, metadata);
     //by using uploadBytesResumable we can control the progress of uploading like pause, resume, cancel

     // Grab the public url
     const downloadURL = await getDownloadURL(snapshot.ref);

     const FinalReports = collection(db, 'finalProjectReport');
      const report = {
        topic: req.body.topic,
        abstract: req.body.abstract,
        refemail: req.body.email,
        refnumber: req.body.number,
        downloadURL: downloadURL
       }
     console.log(req.body)
     const response = await addDoc(FinalReports, report)
       
     res.statusCode= 200
     res.send(response)
   
    
  } catch (error) {
    //return the error status code and the error to the front end
    return res.status(400).send(error)
  }
})
router.get('/clearance', function(req, res, next) {
    
    res.render('cleared-student', { title: 'Express' });
  });
module.exports = router;
