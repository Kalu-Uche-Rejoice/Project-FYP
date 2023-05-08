// this controller allows me to read csv files sent in using a multi-part form from 
//a browser to create an array in the node js server

var bodyparser = require('body-parser')
var multer = require('multer');

var upload = multer({ storage: multer.memoryStorage() })


const { getStorage, ref, uploadBytesResumable, getDownloadURL } = require("firebase/storage");
const {getAuth} = require('firebase/auth')
const { getFirestore, collection, addDoc, getDocs, query, where } = require('firebase/firestore');

const db = getFirestore()
const storage = getStorage()
const auth = getAuth()



exports.csv = (req, res)=>{
    const file = req.file;
    
}

exports.singleFileSubmit = async(req, res, dbName, storeName)=>{
    // the plan is to store all the final uploads in a seperate collection 
    // each document in the collection will contain the users id along with the details from the form
    // because I need the supervisors ID i use the project topic to query the project collections then when i find a match i will copy the supervisors id
    try {
       //gets a storage reference and appends the file name
       console.log(req.body)
       console.log(req.user)
       console.log(req.file)
       const storageRef = ref(storage, `${storeName}/${req.file.originalname}`)
       const metadata = {
         contentType: req.file.mimetype,
       };
  
       // Upload the file in the bucket storage
       const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, metadata);
       //by using uploadBytesResumable we can control the progress of uploading like pause, resume, cancel
  
       // Grab the public url
       const downloadURL = await getDownloadURL(snapshot.ref);
  
       const FinalReports = collection(db, dbName);
        const report = {
          topic: req.body.topic,
          abstract: req.body.abstract,
          refemail: req.body.email,
          refnumber: req.body.number,
          cleared: false,
          downloadURL: downloadURL
         }
       const response = await addDoc(FinalReports, report)
         
       res.statusCode= 200
       res.send(response)
       res.redirect('/student/clearance')
     
      
    } catch (error) {
      //return the error status code and the error to the front end
      return res.status(400).send(error)
    }
  }

exports.findFile = async(req, res, dbName)=>{
    // this route will query the final project report collection and get all the documents in it
  var Projects = []
  const pastProjects =  await getDocs(collection(db, dbName));
  pastProjects.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    Projects.push(doc.data());
  });
  console.log(Projects[0])
  
    res.render('past FYP');

}

exports. multipleFileSubmit = async (req, res, storeName) => {
  try {
    console.log(req.files);
    for (let index = 0; index < 2; index++) {
      //gets a storage reference and appends the file name
      const storageRef = ref(storage, `${storeName}/${req.files[index].originalname}`);
      const metadata = {
        contentType: req.files[index].mimetype,
      };
      // Upload the file in the bucket storage
      const snapshot = await uploadBytesResumable(
        storageRef,
        req.files[index].buffer,
        metadata
      );
      //by using uploadBytesResumable we can control the progress of uploading like pause, resume, cancel

      // Grab the public url
      const downloadURL = await getDownloadURL(snapshot.ref);

      const Proposals = collection(db, "projects");
      const Proposal = {
        topic: req.body.topic[index],
        downloadURL: downloadURL,
      };
      console.log(req.body);
      const response = await addDoc(Proposals, Proposal);
    }

    res.statusCode = 200;
    res.redirect('/student/past-project')
  } catch (error) {
    return res.status(400).send(error.message);
  }
}