var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser')
var ejs = require('ejs');
var expressLayouts = require ('express-ejs-layouts');
var mongoose = require('mongoose');
/*var crypto = require('crypto');
var multer = require('multer');
var GridFSStorage = require('multer-gridfs-storage');
var Grid = require('gridfs-stream');
var methodOverride = require('method-override');
var fileUpload = require('express-fileupload');*/




var studentRouter = require('./routes/student');
var supervisorRouter = require('./routes/supervisor');
var usersRouter = require('./routes/users');


var app = express();

const url = 'mongodb://127.0.0.1:27017/FYP';
const connect = mongoose.connect(url);
connect.then((db)=>{
  console.log('Connected correctly to mongo server')
},(err)=>{
  console.log(err);
})
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'assets')));
app.use(expressLayouts);

app.use(bodyParser.json());


app.use('/users', usersRouter);
app.use('/student', studentRouter);
app.use('/supervisor', supervisorRouter);

app.get('/',(req,res)=>{
  res.render('auth-login-basic', { layout: false });
})
app.get('/reset-pass',(req,res)=>{
  res.render('auth-forgot-password-basic', { layout: false });
})
// import database into app


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
