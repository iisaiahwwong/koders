var express = require('express');
var router = express.Router();

var Tweet = require('../models/tweet');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('dashboard', { title: 'Koders', layout: 'dashboard' });
});

router.get('/delete/all', function(req, res, next) {
  Tweet.remove({}, function() {
    res.json({success: true});
  })
})

module.exports = router;
