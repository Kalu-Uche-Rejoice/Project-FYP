var express = require("express");
const {
  verifyUserCookie,
  verifyUser,
  verifyUserLog,
  verifyUserFoundLog,
  StuPrintClearance,
  FindFYP,
  ProjectFinalUpload,
  ProjectProposal,
} = require("../controllers/athenticate");
const {
  singleFileSubmit,
  findFile,
  multipleFileSubmit,
} = require("../controllers/read-file");
const { auth, monitorAuthState } = require("../controllers/auth");

var router = express.Router();
var bodyparser = require("body-parser");

var multer = require("multer");

var upload = multer({ storage: multer.memoryStorage() });

router.use(bodyparser.json());
router
  .get("/planner", (req, res) => {
    res.render("planner", { title: "Express", UserName: false });
  })
  .post((req, res) => {
    console.log(req.body);
  });
router
  .route("/log")
  .get(function (req, res, next) {
    //res.render("studeproject monitoring module");
    verifyUserFoundLog(req, res, "Logs");
  })
  .post(upload.single("logfile"), (req, res) => {
    console.log(req.body);
    verifyUserLog(req, res, "Logs", "Logs");
    //res.redirect("/users/student/log");
  });

router.route("/proposal").get(function (req, res, next) {
  ProjectProposal(req, res);
});
router.post("/upload", upload.array("file", 4), async (req, res) => {
  console.log("it is well");
  verifyUser(req, res, "proposals");
});

router
  .route("/past-project")
  .get(function (req, res, next) {
    findFile(req, res, "finalProjectReport");
  })
  .post((req, res) => {
    // I need to write an identical findFile function but with the queries
    FindFYP(req, res);
  });
router
  .route("/project-upload")
  .get(function (req, res, next) {
    ProjectFinalUpload(req, res);
  })
  .post(upload.single("file"), async (req, res) => {
    verifyUserCookie(req, res, "finalProjectReport", "finalupload");
  });

router.get("/clearance", function (req, res, next) {
  //console.log(monitorAuthState());
  StuPrintClearance(req, res);
  //res.render("cleared-student", { title: "Express" });
});
module.exports = router;
