var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('dashboard', { title: 'Koders', layout: 'dashboard' });
});

router.get('/sentiment', function(req, res, next) {
  res.render('sentiment', { title: 'Koders', visual: ()=> { return 'sentiment' } });
});

router.get('/map', function(req, res, next) {
  res.render('index', { title: 'Koders | Map', visual: ()=> { return 'visualmap' } });
});

router.get('/worldmap', function(req, res, next) {
  res.render('worldMap', { title: 'World Map' } );
});

module.exports = router;
