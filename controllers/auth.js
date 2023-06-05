const firebase = require("../key.js");
//const {sendemail} = require('./mailer.js')
const {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  getIdToken,
} = require("firebase/auth");
const {
  getFirestore,
  collection,
  doc,
  addDoc,
  setDoc,
  getDocs,
  query,
  where,
  updateDoc,
} = require("firebase/firestore");
const { cookie } = require("./athenticate");
//const {postmarkMail}= require('./mailer.js')

const db = getFirestore();
const auth = getAuth();

async function AssigStu(stuID) {
  const supervisors = [];
  var supvisormin =[];
  var supcount = [];
  //find all the supervisors
  const q = query(collection(db,"users"), where("type", "==", "Lecturer"))
  const qSnap = await getDocs(q)
  
  qSnap.forEach(element => {
    supervisors.push(element.data())
    console.log(element.data())
    //supervisors = element.docs();
  });
  //console.log("supervisors"+ supervisors)
  //create a new array to hold all the counts
  for (let index = 0; index < supervisors.length; index++) {
    supcount[index] = supervisors[index].count;
  }
  // find the smallest count value
  var min = Math.min(supcount)
  //push all the supervisors with a count less than or equal to the minimum count to a new array
  for (let index = 0; index < supcount.length; index++) {
    if (supervisors[index].count<=min) {
      supvisormin.push(supervisors[index])
    }
  }
  //randomly generate an index for the supervisor
  min = Math.floor(Math.random()*supvisormin.length)
  var count = supvisormin[min].count + 1
  console.log(count)
  await updateDoc(doc(db, "users", `${supvisormin[min].ID}`), {
    count: count
  })
  return supvisormin[min]
}

exports.register = (req, res) => {
  console.log(req.body);
  const user = {
    fullName: req.body.fullName,
    email: req.body.email,
    password: req.body.password,
    MatNo: req.body.matno,
    course: req.body.course,
    terms: req.body.terms,
  };
  let User = {};
  //const users = collection(db, "users");
  createUserWithEmailAndPassword(auth, user.email, user.password)
    .then(async (data) => {
      //console.log(data)
      var supervisorID =await AssigStu(data.user.uid)
      console.log("superisorID is" + supervisorID)
      if (user.MatNo.includes("C")) {
        User = {
          fullName: user.fullName,
          MatNo: user.MatNo,
          ID: data.user.uid,
          type: "student",
          course: user.course,
          terms: user.terms,
          topic: "none",
          supervisorID: supervisorID.ID,
          supervisorName: supervisorID.fullName
        };
      } else {
        User = {
          fullName: user.fullName,
          MatNo: user.MatNo,
          ID: data.user.uid,
          type: "Lecturer",
          course: user.course,
          terms: user.terms,
          count: 0
        };
      }

      //const response = await addDoc(users, User);
      await setDoc(doc(db, "users", data.user.uid), User);
      res.redirect("/");
    })
    .catch((error) => {
      let errorCode = error.code;
      let errorMessage = error.message;
      if (errorCode == "auth/weak-pasword") {
        return res.status(500).json({ error: errorMessage });
      } else {
        return res.status(500).json({ error: errorMessage });
      }
    });
};

exports.monitorAuthState = () => {
  console.log("this is a test");
  var currentUser = auth.currentUser;
  return currentUser;
};

exports.signin = (req, res) => {
  signInWithEmailAndPassword(auth, req.body.email, req.body.password)
    .then((user) => {
      const User = auth.currentUser.email;
      //test for the type of user
      if (User.includes("cu.edu.ng")) {
        if (User.includes("stu.cu.edu.ng")) {
          res.redirect("/users/student/past-project");
        } else {
          res.redirect("/users/supervisor/past-project");
        }
      }
    })
    .catch((error) => {
      let errorCode = error.code;
      let errorMessage = error.message;
      if (errorCode) {
        //  return res.status(500).json({error: errorMessage})
        res.render("auth-login-basic", { error: errorMessage });
      }
    });
};

exports.forgotpassword = (req, res) => {
  sendPasswordResetEmail(auth, req.body.email)
    .then(() => {
      res.redirect('/')
      //res.status(200).json({ status: "password reset email sent" });
    })
    .catch((error) => {
      let errorCode = error.code;
      let errorMessage = error.message;
      if (errorCode) {
        return res.status(500).json({ error: errorMessage });
      }
    });
};
exports.logout = (req, res) => {
  signOut(auth).then(() => {
    console.log(auth.currentUser);
    res.clearCookie("session"); // Clear the session cookie
    res.redirect("/");
  });
};

exports.sign = (req, res) => {
  signInWithEmailAndPassword(auth, req.body.email, req.body.password)
  .then(
    (user) => {
      //res.send("Cookie has been set from secondary route");
      var User = user.user;
      getIdToken(User, true).then(async (id) => {
        await cookie(req, res, id, User.email);
        //postmarkMail()
      });
    }
  )
  .catch((error)=>{
    if (error) {
      res.render("auth-login-basic", { error: `${error.message}`, layout: false});
    }
  })
  ;
  // var user = auth.currentUser.idToken
};
/*//var idtoken =
  console.log(idtoken)
  //cookie(req, res, idtoken)
 res.redirect("/users/student/past-project")
  
  }*/
/* .then((user)=>{
    var id = getIdToken(user, true)
    cookie
}*/
