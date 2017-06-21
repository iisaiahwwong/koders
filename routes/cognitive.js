var express = require('express');
var Kairo = require('../config/kairo_config');
var router = express.Router();

var request = require('request');
var fs = require('fs');


/* GET home page. */
router.post('/upload', function (req, res, next) {
    request({
        method: 'POST',
        url: 'https://api.kairos.com/v2/media?source=http%3A%2F%2Fmedia.kairos.com%2Ftest.flv',
        headers: {
            'app_id': Kairo.id,
            'app_key': Kairo.key
        }
    }, function (error, res, body) {
        res.json(body);
    });
});

router.get('/', function (req, res, next) {
    request({
        method: 'GET',
        url: 'https://api.kairos.com/v2/media/b05179878899f20c554d1703',
        headers: {
            'app_id': '709f4603',
            'app_key': '14ff4ff63246154a57a6100966f6b7e2'
        }
    }, function (error, response, body) {
                res.json(body);
    });
})

function postData() {

}

module.exports = router;
