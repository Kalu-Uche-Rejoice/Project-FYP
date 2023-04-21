var express = require('express');
var router = express.Router();
const {
  register,
  signin,
  forgotpassword
}=require('../controllers/auth.js')
/* GET users listing. */
router.route('/register')
.get(function(req, res, next) {
  res.render('auth-register-basic', {layout: false});
})
.post(register)
/*.post( (req, res)=>{
  console.log(req.body);
  const user ={
    email : req.body.email,
    password: req.body.password
  }
  firebase.createUserWithEmailAndPassword(fire.getAuth, user.email, user.password)
  .then((userCredential) => {
    // Signed in 
    var user = userCredential.user;
    res.redirect('/')
    // ...
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    // ..
  });
 
})
.post(s(req, res)=>{
  const user ={
    email : req.body.email,
    password: req.body.password
  }
  // user email and password test conditions
  // the user must provide an email with cu.edu.ng and a password with at least 8 characters
  const emailTest = 'cu.edu.ng'
  var validityTest = user.email.includes(emailTest)
  if (validityTest != true && user.password.length >=8) {
    await FBadmin.auth().createUser({
      email: user.email,
      password: user.password,
      emailVerified: false,
      disabled: false
    })// tehre is an issue with the user email verificationlink.
    res.redirect('/')
  } 
  else{
    res.redirect('/users/register')
  }
})*/

router.route('/sign-in')
.post(signin)
router.route('/forgot-password')
.post(forgotpassword)
module.exports = router;
