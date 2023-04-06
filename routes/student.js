var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/log', function(req, res, next) {
    res.render('studeproject monitoring module');
});
router.get('/proposal', function(req, res, next) {
    res.render('proposal module', { title: 'Express' });
});
router.get('/past-project', function(req, res, next) {
    res.render('past FYP', { title: 'Express' });
});
router.get('/project-upload', function(req, res, next) {
    res.render('project final upload module', { title: 'Express' });
});
router.get('/clearance', function(req, res, next) {
    
    res.render('cleared-student', { title: 'Express' });
  });
module.exports = router;
