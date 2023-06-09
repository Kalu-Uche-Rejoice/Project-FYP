var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var bodyParser = require("body-parser");
var ejs = require("ejs");
var expressLayouts = require("express-ejs-layouts");
var mailer = require("nodemailer");

const { signin, forgotpassword } = require("./controllers/auth");
const key = require("./key");

var studentRouter = require("./routes/student");
var supervisorRouter = require("./routes/supervisor");
var usersRouter = require("./routes/users");

var app = express();
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "assets")));
app.use(expressLayouts);

app.use(bodyParser.json());

app.use("/users", usersRouter);

app.use(function(req, res, next) {
  if (req.status >= 400) {
    res.render('error', {layout: false});
  } else {
    next();
  }
});


app
  .get("/", (req, res) => {
    res.render("auth-login-basic", { layout: false, error: null });
  })
  .post(signin);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
