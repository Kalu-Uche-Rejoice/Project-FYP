var express = require("express");

const {
  singleFileSubmit,
  findFile,
  multipleFileSubmit,
} = require("../controllers/read-file");
const { monitorAuthState } = require("../controllers/auth");

var router = express.Router();
var bodyparser = require("body-parser");

var multer = require("multer");

var upload = multer({ storage: multer.memoryStorage() });

router.use(bodyparser.json());

router.route("/log").get(function (req, res, next) {
  res.render("studeproject monitoring module");
});

router.route("/proposal").get(function (req, res, next) {
  res.render("proposal module", { title: "Express" });
});
router.post("/upload", upload.array("file", 4), async (req, res) => {
  multipleFileSubmit(req, res, "proposals");
});

router.get("/past-project", function (req, res, next) {
  //var activeUser = monitorAuthState();
  console.log(monitorAuthState);
  findFile(req, res, "finalProjectReport");
});

router
  .route("/project-upload")
  .get(function (req, res, next) {
    res.render("project final upload module", { title: "Express" });
  })
  .post(upload.single("file"), async (req, res) => {
    singleFileSubmit(req, res, "finalProjectReport", "finalupload");
  });

router.get("/clearance", function (req, res, next) {
  console.log(monitorAuthState());
  res.render("cleared-student", { title: "Express" });
});
module.exports = router;
