var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/log', function(req, res, next) {
    res.render('project monitoring module', { title: 'Express' });
});
router.get('/proposal', function(req, res, next) {
    res.render('auth-login-basic', { title: 'Express' });
});
router.get('/past-project', function(req, res, next) {
    res.render('auth-login-basic', { title: 'Express' });
});
router.get('/clearance', function(req, res, next) {
    res.render('auth-login-basic', { title: 'Express' });
  });
module.exports = router;
