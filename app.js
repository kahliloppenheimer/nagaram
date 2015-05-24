var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

var wordHelper = require('./word-helper');
var Player = require('./player');
var Game = require('./game');

// Mount static public assets
app.use('/', express.static('public/'));

app.set('view engine', 'jade');
app.set('views', path.join(__dirname, '/public/jade'));

// Maps all game_id -> game
var games = {};
// Stores all players looking for a game
var players = [];
// Maps: player names -> sockets
var playerSockets = {};
// Maps: game_id -> socket room
var gameSockets = {};

app.get('/gametime', function(req, res) {
    console.log('query = ' + req.query);
    var game = games[req.query.game_id];
    var players = game.players;
    var foundWords = Array.prototype.slice(game.foundWords, 0);
    console.log('players = ' + players + '\twords = ' + foundWords);
    return res.render('main', game);
})

// Socket handlers
io.on('connection', function(socket) {

    socket.on('login', function(name) {
        p = new Player(name);
        playerSockets[name] = socket;
        console.log('logging in: ' + p.toString());
        players.push(p);
        if(players.length >= Game.NUM_PLAYERS) {
            game = new Game(players.splice(0, 2));
            startGame(game);
        }
    });

    socket.on('submit word', function(player, guessWord, game) {
        if(isValid(guessWord)) {
            game.incrementScore(player, game.points(guessWord));

            emit('word approved', {word: data.word, score: people[data.name]});
        } else {

        }
    });

    socket.on('disconnect', function() {
    });

    socket.on('game over', function() {
        people = null;
    });

});

// Takes a game object and starts it up
function startGame(game) {
    console.log('starting game with players: ' + game.players);
    // Map game_id to a new io room
    var gameRoom = io.of('/' + game.id);
    gameSockets[game.id] = gameRoom;
    // maps game id to the game
    games[game.id] = game;
    game.players.forEach(function(player) {
        // Adds each player in the game a socket room
        playerSockets[player.name].join('/' + game.id);
        // Tells each player to start the game
        playerSockets[player.name].emit('start game', game);
    });
}

http.listen(3000, function(){
  console.log('listening on *:3000');
});
