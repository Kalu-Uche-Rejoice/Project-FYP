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
const { supervisorfindFile } = require("../controllers/read-file");
const {
  FindSupervisee,
  FindSuperviseeProposal,
} = require("../controllers/athenticate");
const db = getFirestore();

/* GET home page. */
router.get("/supervisee", function (req, res, next) {
  FindSupervisee(req, res, "users");
  //res.render("Supervisor", { layout: "supervisor-layout" });
});
router.post("/supervisee", function (req, res, next) {
  console.log(req.body);
  res.redirect("/users/supervisor/supervisee");
});
router.get("/proposals", function (req, res, next) {
  FindSuperviseeProposal(req, res);
  //res.render("supervisor-clear-proposal", { layout: "supervisor-layout" });
});
router.post("/proposals", function (req, res, next) {
  console.log(req.body);
  //res.render("supervisor-clear-proposal", { layout: "supervisor-layout" });
});

router.get("/past-project", function (req, res, next) {
  supervisorfindFile(req, res, "finalProjectReport");
  //res.render('past FYP', { layout: 'supervisor-layout' });
});
router.get("/project-log", function (req, res, next) {
  res.render("project monitoring module", { layout: "supervisor-layout" });
});
router
  .get("/clearance", function (req, res, next) {
    res.render("supervisor-clear-final", { layout: "supervisor-layout" });
  })
  .post((req, res) => {
    //this updates the cleared status flag on every students upload
    // the request will contain the users id
    const q = query(
      collection(db, "projects"),
      where("supervisorID", "==", someid)
    );
  });

module.exports = router;
