var mongoose = require('mongoose');
Schema = mongoose.Schema;

var tweetSchema = new Schema({
    _id: { type: String, required: true, default: mongoose.Types.ObjectId() },
    tweet: { type: String, required: true },
    twitter_name: { type: String, required: true },
    twitter_handle: { type: String, required: true, index: { unique: true } },
    sentiment: { type: String, required: true },
    sentiment_value: { type: Number, default: false },
    create_timestamp: Date,

});

tweetSchema.pre('save', function (next, done) {

    var currentDate = new Date();

    if (!this.create_timestamp) this.create_timestamp = currentDate;

    next();

})

module.exports = mongoose.model('Tweet', tweetSchema);