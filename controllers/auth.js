const firebase = require("../key.js");
const {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
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
const db = getFirestore();
const auth = getAuth();
exports.register = (req, res) => {
  console.log(req.body);
  const user = {
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
          MatNo: user.MatNo,
          ID: data.user.uid,
          type: "student",
          course: user.course,
          terms: user.terms,
        };
      } else {
        User = {
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
  console.log(req.body);
  signInWithEmailAndPassword(auth, req.body.email, req.body.password)
    .then((user) => {
      //console.log(auth.currentUser);
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
