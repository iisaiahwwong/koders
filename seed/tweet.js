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

newTweet.save(err => {
    if (err) throw err;
    mongoose.disconnect();
});


