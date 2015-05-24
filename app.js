var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

var Player = require('./player');
var Game = require('./game');

// Mount static public assets
app.use('/static', express.static('public/'));

app.set('view engine', 'jade');
app.set('views', path.join(__dirname, '/public'));

// Stores all active games
var games = [];
// Stores all players looking for a game
var players = [];

// Default handler just sends index page
app.get('/', function(req, res) {
    res.render('index', {words: words, players: players});
});


// Socket handlers
io.on('connection', function(socket) {

    socket.on('login', function(name) {
        people[name] = people[name] || 0;
        // send over people data
        console.log('sending people data to ' + name);
        socket.emit('initial data', people);
        io.emit('player entry', {name: name, score: people[name]});
    });

    socket.on('submit word', function(data) {
        console.log(data.name + ' submitted ' + data.word);
        if(isValid(data.word)) {
            people[data.name]++;
            io.emit('word approved', {word: data.word, score: people[data.name]});
        }
    });

    socket.on('disconnect', function() {
    });

    socket.on('game over', function() {
        people = null;
    });

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
