// Express
var express = require('express');
var app = express();
var http = require('http').Server(app);

// Socket.io
var io = require('socket.io')(http);

// To deal with session authentication
var session = require('express-session');
var bodyParser = require('body-parser');

// Additional npm libraries
var path = require('path');

// Local imports
var wordHelper = require('./word-helper');
var Player = require('./player');
var Game = require('./game');
var genKey = require('./id-helper');

// Maps all game_id -> game
var games = {};
// Stores all players looking for a game
var players = [];
// Maps: player names -> sockets
var playerSockets = {};
// Maps: game_id -> socket room
var gameSockets = {};

// Set up session authentication
app.use(session({secret: genKey()}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Mount static public assets
app.use('/', express.static('public/'));

// Set up jade rendering
app.set('view engine', 'jade');
app.set('views', path.join(__dirname, '/public/jade'));

// End point for starting a game
app.get('/gametime', function(req, res) {
    var sess = req.session;
    var game_id = undefined;

    // If first time, store in session
    if(req.query.game_id) {
        game_id = req.query.game_id;
        sess.game_id = game_id;
    }
    // Otherwise, retrieve game_id from session
    else if (req.session.game_id) {
        game_id = sess.game_id;
    }
    // If neither, then we have a problem
    else {
        return console.error('Could not find game_id in req.query or req.session!');
    }
    console.log('game_id = ' + game_id);
    console.log('games = ' + JSON.stringify(games));
    var game = games[game_id];
    var players = game.players;
    var foundWords = Array.prototype.slice(game.foundWords, 0);
    console.log('players = ' + players + '\twords = ' + foundWords);
    return res.render('main', game);
})

// Socket handlers
io.on('connection', function(socket) {

    // Attempt to log user in
    socket.on('login', function(name) {
        // Make sure the user enters a valid name before continuing
        if(!login(name, socket)) {
            socket.emit('failed login', name);
            return;
        }
        socket.emit('successful login', name);
        // If there are enough players queued up, start the game
        if(players.length >= Game.NUM_PLAYERS) {
            var game = new Game(players.splice(0, Game.NUM_PLAYERS));
            startGame(game);
        }
    });

    // Check if user submitted word is valid or not
    socket.on('submit word', function(guessWord, game) {
        var player = game.players
        var success = game.guessWord(guessWord, function(err) {
            socket.emit('word rejected', err);
        });
        if(success) {
            game.incrementScore(findPlayer(socket, playerSockets), game.points(guessWord));
            // Let all players know about the approved word
            game.players.forEach(function(player) {
                playerSockets[player.name].emit('word approved', player, guessword, game);
            });
            //gameSockets[game.id].emit('word approved', player, guessWord, game);
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
    //var gameRoom = io.of('/' + game.id);
    //gameSockets[game.id] = gameRoom;
    // maps game id to the game
    games[game.id] = game;
    game.players.forEach(function(player) {
        // Adds each player in the game a socket room
        //playerSockets[player.name].join('/' + game.id);
        // Tells each player to start the game
        playerSockets[player.name].emit('start game', game);
    });
}

// Returns the player corresponding to the socket, 
// given a socket and a map of players -> sockets
function findPlayer(socket, playerSockets) {
    for (var player in playerSockets) {
        if(playerSockets(player).id === socket.id) {
            return player;
        }
    }
    return console.error('could not find player with socket id ' + socket.id);
}

http.listen(3000, function(){
  console.log('listening on *:3000');
});
