var Tweet = require('../models/tweet');
var mongoose = require('mongoose')

mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://alexisaiah:alexisaiah@ds153392.mlab.com:53392/koders');

var newTweet = new Tweet({

    twitter_name: 'Isaiah Wong',
    twitter_handle: 'iisaiahwwong',
    tweet: 'Feeling great',
    sentiment: 'Positive',
    sentiment_value: 4,

});
let index = 0;

for(let i = 0; i < 10; i++) {
    newTweet.save(err => {
        index++;
        if (err) throw err;
        if(index == 10)
            mongoose.disconnect();
    });
}


