var express = require('express');
var router = express.Router();

var Tweet = require('../models/tweet');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('dashboard', { title: 'Koders', layout: 'dashboard' });
});

module.exports = router;
