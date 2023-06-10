var express = require("express");
var router = express.Router();
const {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
} = require("firebase/firestore");
const {
  supervisorfindFile,
  postComment,
  findFYP,
} = require("../controllers/read-file");
const {
  FindSupervisee,
  FindSuperviseeProposal,
  FinalSubmission,
  AcceptFinal,
  UserVerification,
  FindFYP,
} = require("../controllers/athenticate");
const db = getFirestore();

/* GET home page. */
router.get("/supervisee", function (req, res, next) {
  FindSupervisee(req, res);
  //res.render("Supervisor", { layout: "supervisor-layout" });
});
router.post("/supervisee", function (req, res, next) {
  postComment(req, res);
  //console.log(req.body);
  res.redirect("/users/supervisor/supervisee");
});
router.get("/proposals", function (req, res, next) {
  FindSuperviseeProposal(req, res);
  //res.render("supervisor-clear-proposal", { layout: "supervisor-layout" });
});
router.post("/proposals", function (req, res, next) {
  UserVerification(req, res);
  console.log(req.body);

  //res.render("supervisor-clear-proposal", { layout: "supervisor-layout" });
});

router.get("/past-project", function (req, res, next) {
  supervisorfindFile(req, res, "finalProjectReport");
  //res.render('past FYP', { layout: 'supervisor-layout' });
});
router.post("/past-project", function (req, res) {
  console.log(req.body);
  FindFYP(req, res);
});

router
  .get("/clearance", function (req, res, next) {
    FinalSubmission(req, res);
    //res.render("supervisor-clear-final", { layout: "supervisor-layout" });
  })
  .post("/clearance", (req, res) => {
    console.log(req.body);
    AcceptFinal(req, res);
  });

module.exports = router;
