const { app } = require("../config");

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

exports.verifyUser = async (req, res) => {
  const idToken = req.headers.authorization;
  console.log(req.headers.authorization)
 // const idToken = authHeader.split(" ")[1];
  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    if (decodedToken) {
      req.body.uid = decodedToken.uid;
    } else {
      return res.status(401).send("you are not authorized");
    }
  } catch (error) {
    return res.status(401).send(error);
  }
};

exports.cookie =  (req, res, idtoken) => {
  const idToken = req.body.idToken.toString();

  const expiresIn = 60 * 60 * 24 * 5 * 1000;

  
    auth
    .createSessionCookie(idToken, { expiresIn })
    .then(
      (sessionCookie) => {
        const options = { maxAge: expiresIn, httpOnly: true };
        console.log(sessionCookie)
        res.cookie("session", sessionCookie, options);
        res.end(JSON.stringify({ status: "success" }));
      },
      (error) => {
        res.status(401).send("UNAUTHORIZED REQUEST!");
      }
    );
}