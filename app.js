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
        // Make sure the user enters a valid name before continuing
        if(!login(name, socket)) {
            socket.emit('failed login', name);
            return;
        }
        socket.emit('successful login', name);
        // If there are enough players queued up, start the game
        if(players.length >= Game.NUM_PLAYERS) {
            game = new Game(players.splice(0, Game.NUM_PLAYERS));
            startGame(game);
        }
    });

    socket.on('submit word', function(player, guessWord, game) {
        if(isValid(guessWord)) {
            game.incrementScore(player, game.points(guessWord));
            emit('word approved', player, guessWord, game);
        } else {

        }
    });

    socket.on('disconnect', function() {
    });

});

// Takes a given name and logs it into the system. Returns true if
// the name is not taken, false otherwise.
function login(name, socket) {
    if(playerSockets[name]) {
        return false;
    } else {
        p = new Player(name);
        console.log('logging in: ' + p.toString());
        playerSockets[name] = socket;
        players.push(p);
        return true;
    }
}

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
