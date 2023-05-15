const firebase = require("../key.js");
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
} = require("firebase/firestore");
const { cookie } = require("./athenticate");

const db = getFirestore();
const auth = getAuth();
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
      if (user.MatNo.includes("C")) {
        User = {
          fullName: user.fullName,
          MatNo: user.MatNo,
          ID: data.user.uid,
          type: "student",
          course: user.course,
          terms: user.terms,
        };
      } else {
        User = {
          fullName: user.fullName,
          MatNo: user.MatNo,
          ID: data.user.uid,
          type: "Lecturer",
          course: user.course,
          terms: user.terms,
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
      res.status(200).json({ status: "password reset email sent" });
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
    res.redirect("/");
  });
};

exports.sign = (req, res) => {
  signInWithEmailAndPassword(auth, req.body.email, req.body.password).then(
    (user) => {
      //res.send("Cookie has been set from secondary route");
      var User = user.user;
      getIdToken(User, true).then(async(id) => {
        await cookie(req, res, id, User.email);
       
        //return res.status(200).json({ id: id})
      });
    }
  );
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
