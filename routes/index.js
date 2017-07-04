var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Koders' });
});

router.get('/worldmap', function(req, res, next) {
  res.render('worldMap', { title: 'World Map'});
});

module.exports = router;
