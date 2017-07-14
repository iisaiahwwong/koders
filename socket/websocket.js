let io = require('socket.io')();
let Tweet = require('../models/tweet');

let clients = [];


io.on('connection', function (socket) {
    console.log('New client connected, SOCKET ID: ' + socket.id);

    socket.on('disconnect', function () {
        clients[socket.id] = false;
        console.log('Client has disconnected, SOCKET ID: ' + socket.id);
    });

    socket.on('stop', function () {
        clients[socket.id] = false;
        console.log('Client stopped receiving, SOCKETID: ' + socket.id);
    });

    socket.on('get', function () {
        clients[socket.id] = true;

        Tweet.find(function (err, data) {

            if (data.length > 0) socket.emit('get', JSON.stringify(data));

        });

    });

    socket.on('top positive', function() {

    });

    socket.on('stream', function (message) {
        clients[socket.id] = true;
        console.log("Stream started for client");

        let controlTweet;

        let interval = setInterval(function () {

            if (clients[socket.id] === false) {
                clearInterval(interval);
                return;
            }

            Tweet.findOne().sort('-created_at').exec(function(err, tweet) { 

                if(!tweet)  return;

                if(!controlTweet) controlTweet = tweet;

                if(controlTweet._id !== tweet._id) {
                    socket.emit('stream', JSON.stringify(tweet));
                }

            });


        }, 10);

    });
});

module.exports = io;