var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

// Mount static public assets
app.use('/static', express.static('public/'));

// Default handler just sends index page
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

var people = {};

// Socket handlers
io.on('connection', function(socket) {
    people[socket.id] = true;
    console.log(people);
    socket.on('disconnect', function() {
        people[socket.id] = false;
        console.log(people);
    });

    socket.on('submit word', function(word) {
        if(isValid(word)) {
            io.emit('word approved', word);
        }
    });
});

function isValid(word) {
    return true;
}



http.listen(3000, function(){
  console.log('listening on *:3000');
});
