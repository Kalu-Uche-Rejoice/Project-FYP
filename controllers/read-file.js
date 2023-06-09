async function username(id) {
  var docRef = doc(db, "users", `${id}`);
  try {
    var docSnap = await getDoc(docRef);
    var userName = docSnap.data();
    userName = {
      name: userName.fullName,
      designation: userName.type,
      supervisor: userName.supervisorName,
      topic: userName.topic,
    };
    return userName;
  } catch (error) {
    return "cannot get user";
  }
}
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
    var user;
    const qury = query(collection(db, "users"), where("cleared", "==", "true"));
    const snap = await getDocs(qury);
    if (snap.empty == true) {
      const response = await setDoc(doc(db, dbName, id), report);
      console.log("no submissions yet");
    }

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
  var Project = [];
  const q = query(
    collection(db, "finalProjectReport"),
    where("cleared", "==", "true")
  );
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    Project.push(doc.data());
  });

  res.render("past FYP", { project: Project, UserName: false });
};

exports.multipleFileSubmit = async (req, res, storeName, id) => {
  try {
    console.log(req.files);
    for (let index = 0; index < 2; index++) {
      var fileID = id + `${req.files[index].originalname}`;
      //gets a storage reference and appends the file name
      const storageRef = ref(storage, `${storeName}/${fileID}`);
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
  var usename = await username(id);
  var logEntry = [];
  console.log(dbName + id);
  const q = query(collection(db, `${dbName}`), where("ID", "==", `${id}`));

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    console.log(doc.id, " => ", doc.data());
    logEntry.push(doc.data());
  });
  res.render("studeproject monitoring module", {
    log: logEntry,
    UserName: usename,
  });
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
  //a function that returns the users username
  var usename = await username(id);
  const q = query(
    collection(db, "users"),
    where("supervisorID", "==", `${id}`),
    where("cleared", "==", "false")
  );
  const supervisee = [];
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
    var logs = [];
    const qsnap = await getDocs(qry);

    if (qsnap.empty != true) {
      qsnap.forEach((document) => {
        temp = document.data();

        logs.push(temp);
      });
    } else {
      temp = { value: "null" };
      logs.push(temp);
    }
    Filog.push(logs);

    Filog[index].splice(0, 0, supervisee[index]);
  }

  res.render("Supervisor", {
    log: Filog,
    layout: "supervisor-layout",
    UserName: usename,
  });
};

exports.findProposals = async (req, res, id) => {
  var usename = await username(id);
  const q = query(
    collection(db, "users"),
    where("supervisorID", "==", `${id}`),
    where("topic", "==", "none")
  );
  var temp;
  const supervisee = [];
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    supervisee.push(doc.data());
  });
  var supPropName = [];

  for (let i = 0; i < supervisee.length; i++) {
    var qy = query(
      collection(db, "projects"),
      where("ID", "==", `${supervisee[i].ID}`)
    );

    var querySnap = await getDocs(qy);
    if (querySnap.empty == true) {
      //console.log("no document");
      var temporary = [];
      temporary.push({ value: null });
      //supPropName.push(temporary);
    } else {
      var temporary = [];
      querySnap.forEach((document) => {
        temporary.push(document.data());
      });
      temporary.splice(0, 0, supervisee[i]);
      supPropName.push(temporary);
    }
  }
  res.render("supervisor-clear-proposal", {
    layout: "supervisor-layout",
    proposal: supPropName,
    UserName: usename,
  });
};
exports.finalSubmission = async (req, res, id) => {
  var usename = await username(id);
  console.log(usename);
  const q = query(
    collection(db, "users"),
    where("supervisorID", "==", `${id}`)
  );
  const supervisee = [];
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    supervisee.push(doc.data());
  });
  //console.log(supervisee);
  var supProp = [];
  //var supPropName = [];
  //var data;

  for (let i = 0; i < supervisee.length; i++) {
    var qy = query(
      collection(db, "finalProjectReport"),
      where("ID", "==", `${supervisee[i].ID}`)
    );
    var qsnap = await getDocs(qy);
    qsnap.forEach((document) => {
      supProp.push(document.data());

      //supPropName.push(data);
    });
    /*console.log(data);
    supProp.push(supPropName);
    supProp[i].splice(0, 0, supervisee[i]);*/
  }
  console.log(supProp);
  res.render("supervisor-clear-final", {
    layout: "supervisor-layout",
    proposal: supProp,
    UserName: usename,
  });
};
exports.supervisorfindFile = async (req, res, dbName) => {
  // this route will query the final project report collection and get all the documents in it
  //const docRef = collection(db, "users");
  var Project = [];
  const q = query(
    collection(db, "finalProjectReport"),
    where("cleared", "==", "true")
  );
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    Project.push(doc.data());
  });

  res.render("past FYP", {
    project: Project,
    layout: "supervisor-layout",
    UserName: false,
  });
};

// ERROR: this is the function for the post route of the supervisors clearance
exports.clearSupervisee = async (req, res, id, cleared) => {
  var usename = await username(id);
  const userdoc = doc(db, "users", `${id}`);
  const finaldoc = doc(db, "finalProjectReport", `${id}`);
  if (cleared == true) {
    await updateDoc(userdoc, { cleared: cleared });
    await updateDoc(finaldoc, { cleared: cleared });
    //send successful clearance email to the supervisee and ask them to login to print their clearance
  } else {
    //send rejected report email to both supervisor and student
    // request the supervisor to provide more insight as to why the project was rejected to enable
    // the supervisee make changes
  }
};

exports.acceptProposal = async (req, res, id) => {
  //create a query to find all the users where the users name is "${name}"
  const q = query(
    collection(db, "users"),
    where("fullName", "==", `${req.body.name}`),
    where("supervisorID", "==", `${id}`)
  );
  //the id is an empty variable to contain the ID of the supervisee
  var superviseeID = [];
  // gets the document based on the above query
  const querySnap = await getDocs(q);
  querySnap.forEach((doc) => {
    //pushes the users ID into the variable
    superviseeID.push(doc.data());
  });
  console.log(superviseeID);
  // creates a new query to find all the documents where the ID is the superviseeID and the topic is the ${topic}
  for (let index = 0; index < superviseeID.length; index++) {
    const qry = query(
      collection(db, "projects"),
      where("ID", "==", `${superviseeID[index].ID}`),
      where("topic", "==", `${req.body.topic}`)
    );
    var proposalID;
    const querySnapshot = await getDocs(qry);
    querySnapshot.forEach((doc) => {
      //gets the document id for that proposal
      proposalID = doc.id;
    });
    console.log(proposalID);

    //updates the proposal document with the status
    const docRef = doc(db, "projects", `${proposalID}`);
    await updateDoc(docRef, {
      accepted: `${req.body.status}`,
    });
    //creates a document reference
    const userRef = doc(db, "users", `${superviseeID[index].ID}`);
    //updates the document referenced above with a topic
    await updateDoc(userRef, {
      topic: `${req.body.topic}`,
    });
  }
};

exports.PrintClearance = async (req, res, id) => {
  var usename = await username(id);
  var clearedStudent;
  const q = query(
    collection(db, "users"),
    where("cleared", "==", "true"),
    where("ID", "==", `${id}`)
  );
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((docs) => {
    console.log(docs.data());
    clearedStudent = docs.data();
  });
  console.log(clearedStudent);
  if (clearedStudent) {
    var supervisor;
    const qry = query(
      collection(db, "users"),
      where("ID", "==", `${clearedStudent.supervisorID}`)
    );
    const qrySnap = await getDocs(qry);
    qrySnap.forEach((docs) => {
      supervisor = docs.data();
    });
    clearedStudent.supervisorName = supervisor.fullName;
    res.render("cleared-student", {
      student: clearedStudent,
      UserName: usename,
    });
  } else {
    res.render("cleared-student", { student: false, UserName: usename });
  }

  res.render("cleared-student", { student: clearedStudent, UserName: usename });
};

exports.acceptFinal = async (req, res) => {
  //this function handles teh post route for the  clear-final module for the supervisor
  //creates a query where the user name and topic are as contained in the request
  const q = query(
    collection(db, "finalProjectReport"),
    where("author", "==", `${req.body.name}`),
    where("topic", "==", `${req.body.topic}`)
  );
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach(async (document) => {
    //var finalSubmission = document.id
    var docRef = doc(db, "finalProjectReport", `${document.id}`);
    await updateDoc(docRef, { cleared: `${req.body.status}` });
    var docRef = doc(db, "users", `${document.id}`);
    await updateDoc(docRef, { cleared: `${req.body.status}` });
  });
  res.statusCode = 200;
};

exports.postComment = async (req, res) => {
  try {
    var info = req.body.info;
    var split = info.split("!?");
    console.log("split" + split[1]);
    var ID;
    var downloadURL = "null";
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
    console.log(downloadURL);
    //const FinalReports = collection(db, dbName); await addDoc(FinalReports, report);
    const report = {
      meetingSchedule: req.body.meeting,
      supervisorComment: req.body.supervisorComment,
      supervisordownloadURL: downloadURL,
    };
    // const q = query(collection(db, "projects"), where(""))
    // create a query to check in the users collection for a document with name
    const q = query(
      collection(db, "users"),
      where("fullName", "==", `${split[1]}`)
    );
    const qsnap = await getDocs(q);
    qsnap.forEach((document) => {
      ID = document.data().ID;
    });
    /*var meettime
    if (req.body.meetingAccept == "on" && req.body.meeting!='') {
      meettime = req.body.meeting
    }*/

    ID = ID + split[0];

    //create a document reference using the retrieved ID
    const docRef = doc(db, "Logs", `${ID}`);
    let ref = await getDoc(docRef);
    await updateDoc(docRef, report);
    res.redirect("/users/supervisor/supervisee");
  } catch (error) {
    return res.status(400).send(error);
  }
};
exports.findFYP = async (req, res, id, email) => {
  var Pfyp = [];
  if (req.body.course || req.body.year) {
    const number = parseInt(`${req.body.year}`, 10);
    const q = query(
      collection(db, "finalProjectReport"),
      where("course", "==", `${req.body.course}`),
      where("year", "==", number)
    );
    const qSnap = await getDocs(q);
    qSnap.forEach((element) => {
      Pfyp.push(element.data());
    });
  }
  const UN = await username(id);
  console.log(email);
  var emailer = String(email);
  var test = "@stu";
  if (emailer.indexOf(test) != -1) {
    console.log("student request");
    res.render("past FYP", { project: Pfyp, UserName: UN });
  } else {
    res.render("past FYP", {
      project: Pfyp,
      layout: "supervisor-layout",
      UserName: UN,
    });
  }
};

exports.projectFinalUpload = async (res, id) => {
  let user = await username(id);
  res.render("project final upload module", {
    title: "Express",
    UserName: user,
  });
};
exports.projectProposal = async (res, id) => {
  let user = await username(id);
  res.render("proposal module", { title: "Express", UserName: user });
};
