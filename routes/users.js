var express = require("express");
var router = express.Router();

//router.use(cookieParser())
const student = require("./student");
const supervisor = require("./supervisor");
const admin = require("./admin");
router.use("/student", student);
router.use("/supervisor", supervisor);
router.use("/admin", admin);

const {
  register,
  sign,
  forgotpassword,
  logout,
  monitorAuthState,
} = require("../controllers/auth.js");
const { cookie } = require("../controllers/athenticate");
const multer = require("multer");
const os = require("os");
const upload = multer({ storage: multer.memoryStorage() });
const fs = require("fs");
const parse = require("csv-parse").parse();
//const {getAuth, } = require('firebase/auth')

/* GET users listing. */
router
  .route("/register")
  .get(function (req, res, next) {
    res.render("auth-register-basic", { layout: false, error: false });
  })
  .post(register);

router.route("/sign-in").post(sign);
router.post("/sessionlogin");

router
  .route("/password")
  .get(function (req, res, next) {
    res.render("auth-forgot-password-basic", { layout: false });
  })
  .post(forgotpassword);

router
  .route("/admin")
  .get((req, res) => {
    res.render("admin.ejs", { layout: false });
  })
  .post(upload.single("user-details"), (req, res) => {
    console.log("request");
    console.log(req.body);
    const file = req.file;
    console.log(file);
    const data = fs.readFileSync(file.path);
    parse(data, (err, records) => {
      if (err) {
        console.error(err);
        return res
          .status(400)
          .json({ success: false, message: "An error occurred" });
      }
      return res.json({ data: records });
    });

    console.log(readFile);
  });

router.route("/logout").get(logout);

module.exports = router;
