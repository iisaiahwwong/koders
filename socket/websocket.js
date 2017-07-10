let io = require('socket.io')();
let Tweet = require('../models/tweet');

let clients = [];


io.on('connection', function(socket) {
    console.log('New client connected, SOCKET ID: ' + socket.id);

    socket.on('disconnect', function () {
        clients[socket.id] = false;
        console.log('Client has disconnected, SOCKET ID: ' + socket.id);
    });

    socket.on('stop', function () {
        clients[socket.id] = false;
        console.log('Client stopped receiving, SOCKETID: ' + socket.id);
    });

    // message: scan ID
    socket.on('stream', function (message) {
        clients[socket.id] = true;
        console.log("Stream started for client");
        
        Tweet.find({ 
            create_timestamp: { 
                '$gte': new Date('2017-3-1'), 
                '$lt': new Date('2017-10-1') 
            } 
        }, function(err, data) {
          
            socket.emit('stream', JSON.stringify(data));

        }) 
    });
});

module.exports = io;