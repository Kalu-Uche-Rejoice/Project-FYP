const { app } = require("../config");

const {
  singleFileSubmit,
  multipleFileSubmit,
  findLog,
  Savelog,
  findSupervisee,
  findProposals,
  acceptProposal,
  PrintClearance
} = require("./read-file");

const { getAuth } = require("firebase-admin/auth");
const { getFirestore } = require("firebase-admin/firestore");

const auth = getAuth(app);
const db = getFirestore();

exports.register = (req, res) => {
  auth
    .createUser({
      email: req.body.email,
      password: req.body.password,
      emailVerified: false,
    })
    .then((userRecord) => {
      if (req.body.MatNo.includes("C")) {
        let User = {
          MatNo: req.body.MatNo,
          ID: userRecord.uid,
          type: "student",
          course: req.body.course,
          terms: req.body.terms,
        };
      } else {
        let User = {
          MatNo: req.body.MatNo,
          ID: userRecord.uid,
          type: "Lecturer",
          course: req.body.course,
          terms: req.body.terms,
        };
      }

      const res = db.collection("users").doc(`${userRecord.uid}`).set(User);
      // See the UserRecord reference doc for the contents of userRecord.
      console.log("Successfully created new user:", userRecord.uid);
    })
    .catch((error) => {
      console.log("Error creating new user:", error);
    });
};

exports.cookie = (req, res, idToken, email) => {
  //const idToken = req.body.idToken.toString();

  const expiresIn = 60 * 60 * 24 * 5 * 1000;

  auth.createSessionCookie(idToken, { expiresIn }).then(
    async (sessionCookie) => {
      const options = { maxAge: expiresIn, httpOnly: true, sameSite: "strict" };
      console.log(sessionCookie);
      console.log(email);
      await res.cookie("session", sessionCookie, options);
      if (email.includes("cu.edu.ng")) {
        if (email.includes("stu.cu.edu.ng")) {
          res.redirect("/users/student/past-project");
        } else {
          res.redirect("/users/supervisor/past-project");
        }
        //;
      }
    },
    (error) => {
      res.status(401).send("UNAUTHORIZED REQUEST!");
    }
  );
};

exports.verifyUserCookie = async (req, res, dbName, storeName) => {
  const sessionCookie = req.cookies.session || "";
  auth.verifySessionCookie(sessionCookie).then((DecodedIdToken) => {
    var id = DecodedIdToken.uid;
    singleFileSubmit(req, res, dbName, storeName, id);
    //console.log(UserID)
  });
};

exports.verifyUser = async (req, res, storeName) => {
  const sessionCookie = req.cookies.session || "";
  auth.verifySessionCookie(sessionCookie).then((DecodedIdToken) => {
    var id = DecodedIdToken.uid;
    multipleFileSubmit(req, res, storeName, id);
    //console.log(UserID)
  });
};

exports.verifyUserLog = async (req, res, dbName, storeName) => {
  const sessionCookie = req.cookies.session || "";
  auth.verifySessionCookie(sessionCookie).then((DecodedIdToken) => {
    var id = DecodedIdToken.uid;
    console.log("function verify user is called");
    Savelog(req, res, dbName, storeName, id);
  });
};

exports.verifyUserFoundLog = async (req, res, dbName) => {
  const sessionCookie = req.cookies.session || "";
  auth.verifySessionCookie(sessionCookie).then((DecodedIdToken) => {
    var id = DecodedIdToken.uid;
    findLog(req, res, dbName, id);
  });
};

exports.FindSupervisee = async (req, res, dbName) => {
  const sessionCookie = req.cookies.session || "";
  auth.verifySessionCookie(sessionCookie).then((DecodedIdToken) => {
    var id = DecodedIdToken.uid;
    findSupervisee(req, res, id);
  });
};

exports.FindSuperviseeProposal = async (req, res, dbName) => {
  const sessionCookie = req.cookies.session || "";
  auth.verifySessionCookie(sessionCookie).then((DecodedIdToken) => {
    var id = DecodedIdToken.uid;
    console.log("this function is called" + id);
    findProposals(req, res, id);
  });
};

exports.UserVerification = async (req, res) => {
  const sessionCookie = req.cookies.session || "";
  auth.verifySessionCookie(sessionCookie).then((DecodedIdToken) => {
    var id = DecodedIdToken.uid;
    acceptProposal(req, res, id)
  });
};

exports.StuPrintClearance = async (req, res) => {
  const sessionCookie = req.cookies.session || "";
  auth.verifySessionCookie(sessionCookie).then((DecodedIdToken) => {
    var id = DecodedIdToken.uid;
    PrintClearance(req, res, id)
  });
};