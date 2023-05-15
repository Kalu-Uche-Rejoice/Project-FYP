var express = require("express");
const { verifyUserCookie } = require("../controllers/athenticate");
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
  .route("/log")
  .get(function (req, res, next) {
    //verifyUserCookie(req);
    res.render("studeproject monitoring module");
  })
  .post((req, res) => {
    console.log(req.body);
    res.redirect("/users/student/log");
  });

router.route("/proposal").get(function (req, res, next) {
  res.render("proposal module", { title: "Express" });
});
router.post("/upload", upload.array("file", 4), async (req, res) => {
  multipleFileSubmit(req, res, "proposals");
});
router.get("/past-project", function (req, res, next) {
  findFile(req, res, "finalProjectReport");
});
router
  .route("/project-upload")
  .get(function (req, res, next) {
    res.render("project final upload module", { title: "Express" });
  })
  .post(upload.single("file"), async (req, res) => {
    verifyUserCookie(req, res, "finalProjectReport", "finalupload");
  });

router.get("/clearance", function (req, res, next) {
  console.log(monitorAuthState());
  res.render("cleared-student", { title: "Express" });
});
module.exports = router;
