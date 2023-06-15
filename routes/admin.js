var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
router.use(bodyParser.json());

router.route("/saveUser").get((req, res, next) => {
  res.render("admin");
  //verifyUserFoundLog(req, res, "Logs");
});

module.exports = router;
