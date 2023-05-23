// this controller allows me to read csv files sent in using a multi-part form from
//a browser to create an array in the node js server

var bodyparser = require("body-parser");
var multer = require("multer");

var upload = multer({ storage: multer.memoryStorage() });

const {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} = require("firebase/storage");
const { getAuth, onAuthStateChanged } = require("firebase/auth");
const {
  getFirestore,
  updateDoc,
  collection,
  addDoc,
  getDocs,
  getDoc,
  setDoc,
  doc,
  query,
  where,
} = require("firebase/firestore");

const db = getFirestore();
const storage = getStorage();
const auth = getAuth();

exports.csv = (req, res) => {
  const file = req.file;
};

exports.singleFileSubmit = async (req, res, dbName, storeName, id) => {
  // the plan is to store all the final uploads in a seperate collection
  // each document in the collection will contain the users id along with the details from the form
  // because I need the supervisors ID i use the project topic to query the project collections then when i find a match i will copy the supervisors id
  try {
    //gets a storage reference and appends the file name
    const filename = id.concat(req.file.originalname);
    const storageRef = ref(storage, `${storeName}/${filename}`);
    const metadata = {
      contentType: req.file.mimetype,
    };

    // Upload the file in the bucket storage
    const snapshot = await uploadBytesResumable(
      storageRef,
      req.file.buffer,
      metadata
    );
    //by using uploadBytesResumable we can control the progress of uploading like pause, resume, cancel

    // Grab the public url
    const docRef = doc(db, "users", `${id}`);
    const docSnap = await getDoc(docRef);
    const username = docSnap.data();
    const year = new Date().getFullYear();

    const downloadURL = await getDownloadURL(snapshot.ref);
    const report = {
      ID: id,
      author: username.fullName,
      course: username.course,
      year: year,
      topic: req.body.topic,
      abstract: req.body.abstract,
      refemail: req.body.email,
      refnumber: req.body.number,
      cleared: false,
      downloadURL: downloadURL,
    };
    const response = await setDoc(doc(db, dbName, id), report);

    res.statusCode = 200;
    res.redirect("/users/student/clearance");
  } catch (error) {
    //return the error status code and the error to the front end
    return res.status(400).send(error);
  }
};

exports.findFile = async (req, res, dbName) => {
  // this route will query the final project report collection and get all the documents in it
  //const docRef = collection(db, "users");
  console.log("request is " + req.body);
  var Project = [];
  const pastProjects = await getDocs(collection(db, dbName));
  pastProjects.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    Project.push(doc.data());
  });

  /*if(req.body != {}){
    const projRef = collection(db, `${dbName}`);
    // this part of the function executes on the users filter on the post route
    const q1 = query(projRef, where("course", "==", `${req.body.year}`), where("year", "==", `${req.body.year}`));
    const querySnapshot = await getDocs(q1);
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    console.log(doc.id, " => ", doc.data());
    logEntry.push(doc.data());
  });
  }
  else{
    
  }*/
  res.render("past FYP", { project: Project });
};

exports.multipleFileSubmit = async (req, res, storeName, id) => {
  try {
    console.log(req.files);
    for (let index = 0; index < 2; index++) {
      //gets a storage reference and appends the file name
      const storageRef = ref(
        storage,
        `${storeName}/${req.files[index].originalname}`
      );
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
      //const user = collection(db, "users", userid)
      const Proposal = {
        ID: id,
        topic: req.body.topic[index],
        downloadURL: downloadURL,
      };
      //console.log(req.body);
      const response = await addDoc(Proposals, Proposal);
      /*await updateDoc(user, {
        proposals :[
          response.id
        ]
      });*/
    }

    res.statusCode = 200;
    res.redirect("/users/student/past-project");
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

exports.findLog = async (req, res, dbName, id) => {
  var logEntry = [];
  console.log(dbName + id);
  const q = query(collection(db, `${dbName}`), where("ID", "==", `${id}`));

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    console.log(doc.id, " => ", doc.data());
    logEntry.push(doc.data());
  });
  res.render("studeproject monitoring module", { log: logEntry });
};
exports.Savelog = async (req, res, dbName, storeName, id) => {
  try {
    var downloadURL = null;
    //gets a storage reference and appends the file name
    if (req.file) {
      const storageRef = ref(storage, `${storeName}/${req.file.originalname}`);
      const metadata = {
        contentType: req.file.mimetype,
      };

      // Upload the file in the bucket storage
      const snapshot = await uploadBytesResumable(
        storageRef,
        req.file.buffer,
        metadata
      );
      //by using uploadBytesResumable we can control the progress of uploading like pause, resume, cancel

      // Grab the public url
      downloadURL = await getDownloadURL(snapshot.ref);
    }
    //const FinalReports = collection(db, dbName); await addDoc(FinalReports, report);
    const report = {
      ID: id,
      week: req.body.week,
      meetingSchedule: req.body.meeting,
      log: req.body.log,
      downloadURL: downloadURL,
    };
    var identity = id.concat(req.body.week);
    const response = await setDoc(doc(db, dbName, identity), report);

    res.statusCode = 200;
    res.redirect("/users/student/log");
  } catch (error) {
    //return the error status code and the error to the front end
    return res.status(400).send(error);
  }
};

exports.findSupervisee = async (req, res, id) => {
  const q = query(
    collection(db, "users"),
    where("supervisorID", "==", `${id}`)
  );
  const supervisee = [];
  const logs = [];
  const Filog = [];
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots

    supervisee.push(doc.data());
  });

  for (let index = 0; index < supervisee.length; index++) {
    const qry = query(
      collection(db, "Logs"),
      where("ID", "==", `${supervisee[index].ID}`)
    );
    var temp;

    const qsnap = await getDocs(qry);
    qsnap.forEach((document) => {
      temp = document.data();
      logs.push(temp);
    });
    Filog.push(logs);
    //Filog[index].push(supervisee[index]);
    Filog[index].splice(0, 0, supervisee[index]);
    // console.log(supervisee);
    console.log("LOG");
    console.log(Filog);
  }

  res.render("Supervisor", {
    log: Filog,
    layout: "supervisor-layout",
  });
};

exports.findProposals = async (req, res, id) => {
  const q = query(
    collection(db, "users"),
    where("supervisorID", "==", `${id}`)
  );
  var temp;
  const supervisee = [];
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    supervisee.push(doc.data());
  });
  var supProp = [];
  var supPropName = [];

  for (let i = 0; i < supervisee.length; i++) {
    var qy = query(
      collection(db, "projects"),
      where("ID", "==", `${supervisee[i].ID}`)
    );

    var querySnap = await getDocs(qy);

    querySnap.forEach((doc) => {
      temp = doc.data();
      console.log(doc.data());
      supPropName.push(temp);
    });
    supProp.push(supPropName);
    supProp[i].splice(0, 0, supervisee[i]);
  }
  console.log(supProp);
  res.render("supervisor-clear-final", { Report: supProp, Name: supPropName });
};
exports.finalSubmission = async (req, res, id) => {
  const q = query(
    collection(db, "users"),
    where("supervisorID", "==", `${id}`)
  );
  const supervisee = [];
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    supervisee.push(doc.data());
  });
  var supProp = [];
  var supPropName = [];

  for (let i = 0; i < supervisee.length; i++) {
    var qy = query(
      collection(db, "finalProjectReport"),
      where("ID", "==", `${supervisee[i].ID}`)
    );
    var querySnap = await getDocs(qy);
    querySnap.forEach((doc) => {
      supProp.push(doc.data());
      supPropName.push(supervisee[i].fullName);
    });
  }
  res.render("supervisor-clear-final", { Report: supProp, Name: supPropName });
};
exports.supervisorfindFile = async (req, res, dbName) => {
  // this route will query the final project report collection and get all the documents in it
  //const docRef = collection(db, "users");
  console.log("request is " + req.body);
  var Project = [];
  const pastProjects = await getDocs(collection(db, dbName));
  pastProjects.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    Project.push(doc.data());
  });

  res.render("past FYP", { project: Project, layout: "supervisor-layout" });
};
//
//
//Test area
// 16th may status
//the bulk of the student side is functioning I just need to fix the log page so it sends data to the back end and also can find data
// I can call an ejs variable into a front end js function to implement those filters
// 19th may status
// that plan did not work I need to implement on server side
//
