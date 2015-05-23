var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

app.use('/static', express.static('public/'));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

io.on('connection', function(socket) {
    console.log('a user connected');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
