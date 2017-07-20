let io = require('socket.io')();
let Tweet = require('../models/tweet');
let Location = require('../models/location');
let InOut = require('../models/inout');

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

    socket.on('location get', function () {

        clients[socket.id] = true;

        console.log('Location connected')

        Location.find(function (err, data) {
            socket.emit('location get', JSON.stringify(data));
        });

    });

    socket.on('inout stream', function() {
        console.log('inout stream connectied')
        let interval = setInterval(function() {

            if (clients[socket.id] === false) {
                clearInterval(interval);
                return;
            }

            InOut.find(function(err, inout) {
                if(!inout) return;

                socket.emit('inout stream', JSON.stringify(inout[0]));
            });
        },10);
    });


    let controlLocation = null;

    socket.on('location stream', function () {
        console.log('Location streaming')

        clients[socket.id] = true;

        let interval = setInterval(function () {

            if (clients[socket.id] === false) {
                clearInterval(interval);
                return;
            }

            Location.findOne().sort({_id:-1}).exec(function (err, location) {

                if (!location) return;

                try {
                    // console.log(controlLocation.location.timestamp)
                    // console.log(location.location.timestamp);
                }
                catch(err){}
                
                // console.log(!controlLocation || new Date(controlLocation.location.timestamp).getTime() < new Date(location.location.timestamp).getTime());

                if(!controlLocation || new Date(controlLocation.location.timestamp).getTime() < new Date(location.location.timestamp).getTime() ) {

                    socket.emit('location stream', JSON.stringify(location));
                    controlLocation = location;

                }
    
            });


        }, 10);
    });

    socket.on('get', function () {
        clients[socket.id] = true;

        Tweet.find(function (err, data) {
            if(!data) return;

            if (data.length > 0) socket.emit('get', JSON.stringify(data));

        });

    });


    socket.on('stream', function (message) {
        clients[socket.id] = true;
        console.log("Tweet stream");

        let controlTweet;

        let interval = setInterval(function () {

            if (clients[socket.id] === false) {
                clearInterval(interval);
                return;
            }

            Tweet.findOne().sort({_id:-1}).exec(function (err, tweet) {
                
                if (!tweet) return;
                socket.emit('stream', JSON.stringify(tweet));

            });

        }, 10);

    });
});

module.exports = io;
