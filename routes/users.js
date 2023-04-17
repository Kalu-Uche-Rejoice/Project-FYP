var express = require('express');
var router = express.Router();
const credentials = require('../key.json')
const FBadmin = require('firebase-admin');
const { UserRecord } = require('firebase-admin/lib/auth/user-record');


/* GET users listing. */
router.route('/register')
.get(function(req, res, next) {
  res.render('auth-register-basic', {layout: false});
})
.post(async(req, res)=>{
  const user ={
    email : req.body.email,
    password: req.body.password
  }
  // user email and password test conditions
  // the user must provide an email with cu.edu.ng and a password with at least 8 characters
  const emailTest = 'cu.edu.ng'
  var validityTest = user.email.includes(emailTest)
  if (validityTest === true && user.password.length >=8) {
    const userResponse = await FBadmin.auth().createUser({
      email: user.email,
      password: user.password,
      emailVerified: false,
      disabled: false
    })// tehre is an issue with the user email verificationlink.
    .then((user)=>{
      const userVerify = FBadmin.auth().generateEmailVerificationLink(user)
    }).catch((err)=>console.log(err))
    res.redirect('/')
  } 
  else{
    res.redirect('/users/register')
  }
})


module.exports = router;
