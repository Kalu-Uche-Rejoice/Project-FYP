var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/supervisee', function(req, res, next) {
    res.render('Supervisor', { layout: 'supervisor-layout' });

});
router.get('/proposals', function(req, res, next) {
    res.render('supervisor-clear-proposal', { layout: 'supervisor-layout' });
});
router.get('/past-project', function(req, res, next) {
    res.render('past FYP', { layout: 'supervisor-layout' });
});
router.get('/project-log', function(req, res, next) {
    res.render('project monitoring module', { layout: 'supervisor-layout' });
});
router.get('/clearance', function(req, res, next) {
    res.render('supervisor-clear-final', { layout: 'supervisor-layout' });
});

module.exports = router;
