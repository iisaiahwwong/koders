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
    
        Tweet.find(function(err, data) {
            let index = 0;
            let interval = setInterval(function() {
                
                if(index === data.length) clearInterval(interval);
                
                if(data[index]) socket.emit('stream', JSON.stringify([data[index]]));
                index++;
            }, 100);
        }) 
    });
});

module.exports = io;