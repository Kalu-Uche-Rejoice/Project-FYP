var express = require('express');
var router = express.Router();
const {
  register,
  signin,
  forgotpassword,
  logout,
  monitorAuthState
}=require('../controllers/auth.js');
const multer = require('multer');
const os = require('os')
const upload = multer({storage: multer.memoryStorage()});
const fs = require('fs');
const parse = require('csv-parse').parse();
//const {getAuth, } = require('firebase/auth')

/* GET users listing. */
router.route('/register')
.get(function(req, res, next) {
  res.render('auth-register-basic', {layout: false});
})
.post(register)

router.route('/sign-in')
.post(signin,
  monitorAuthState
  )
router.route('/forgot-password')
.get((req, res)=>{
  res.render('auth-forgot-pasword-basic', {layout: false})
})
.post(forgotpassword)

router.route('/admin')
.get((req, res)=>{
  res.render('admin.ejs', {layout: false});
})
.post(upload.single('user-details'), (req, res)=>{
  console.log("request")
  console.log(req.body)
  const file = req.file
  console.log(file)
  const data = fs.readFileSync(file.path)
  parse(data, (err, records) => {
    if (err) {
       console.error(err)
       return res.status(400).json({success: false, message: 'An error occurred'})
     }
       return res.json({data: records})
   })

   console.log(readFile)
  
})

router.route('/logout')
.get(logout)


module.exports = router;
