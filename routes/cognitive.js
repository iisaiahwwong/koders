var express = require('express');
var Kairo = require('../config/kairo_config');
var router = express.Router();

var request = require('request');
var fs = require('fs');


/* GET home page. */
router.post('/upload', function (req, res, next) {
    request({
        method: 'POST',
        url: 'https://api.kairos.com/v2/media?source=http://media.kairos.com/test.flv',
        headers: {
            'app_id': Kairo.id,
            'app_key': Kairo.key
        }
    }, function (error, response, body) {
        res.json(body);
    });
});

router.get('/', function (req, res, next) {
    request({
        method: 'GET',
        url: 'https://api.kairos.com/v2/media/e68ddb04f22237b2f886b1e9',
        headers: {
            'app_id': Kairo.id,
            'app_key': Kairo.key
        }
    }, function (error, response, body) {
                res.json(body);
    });
})

router.get('/analysis', function (req, res, next) {
    request({
        method: 'GET',
        url: 'https://api.kairos.com/v2/analytics/e68ddb04f22237b2f886b1e9',
        headers: {
            'app_id': Kairo.id,
            'app_key': Kairo.key
        }
    }, function (error, response, body) {
                console.log(body);
                res.json(body);
    });
})

module.exports = router;
