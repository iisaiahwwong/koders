module.exports = {
    topPositiveTweets: [],
    topNegativeTweets: [],

    processPositiveTweets: function (tweet) {

        // Ends function when array is not length 10
        if (this.topPositiveTweets.length !== 5) {

            this.topPositiveTweets.push(tweet);
            return;

        }

        // Sorts by sentiment value
        this.topPositiveTweets.sort(function (a, b) {
            if (a.sentiment_value == b.sentiment_value)
                return new Date(a.create_timestamp) - new Date(b.create_timestamp);
            else
                return b.sentiment_value - a.sentiment_value;
        });

        if (tweet.sentiment_value > this.topPositiveTweets[i]) {

            if (tweet.sentiment_value == this.topPositiveTweets[i]) {

                topPositiveTweets[i] = tweet;

            }

        }
    }
};
