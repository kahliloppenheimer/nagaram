// Express
var express = require('express');
var app = express();
var http = require('http').Server(app);

// Socket.io
var io = require('socket.io')(http);

// To deal with session authentication
var session = require('cookie-session');
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
var playersToSockets = {};
// Maps socket ids -> player names
var socketsToPlayers = {};
// Maps: game_id -> socket room
var gameSockets = {};

// Set up session authentication
var sessionMiddleware = session({secret: genKey(),
                                cookie: {maxAge: 1000*60*60}});
// Hooks up sessions for socket.io
// http://stackoverflow.com/questions/25532692/how-to-share-sessions-with-socket-io-1-x-and-express-4-x
io.use(function(socket, next) {
    sessionMiddleware(socket.request, socket.request.res, next);
});
// Hooks up sessions for express
app.use(sessionMiddleware);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Mount static public assets
app.use('/', express.static('public/'));

// Set up jade rendering
app.set('view engine', 'jade');
app.set('views', path.join(__dirname, '/public'));

// Endpoint for the actual game
app.get('/gametime', function(req, res) {
    var sess = req.session;
    var player_id = sess.player_id;

    // Double check to make sure logged in
    if(player_id) {
        var game = playersToGames[player_id];
        return res.render('jade/main', game);
    }
    // Otherwise, redirect to login screen
    else {
        return res.render('index');
    }
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
    socket.on('submit word', function(guessWord, game_id) {
        var game = games[game_id];
        var player = game.players
        var success = game.guessWord(guessWord, function(err) {
            socket.emit('word rejected', err);
        });
        if(success) {
            game.incrementScore(findPlayer(socket), game.points(guessWord));
            // Let all players know about the approved word
            game.players.forEach(function(player) {
                game.players[player.name].emit('word approved', player, guessword, game);
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
    var sess = socket.request.session;
    if(playersToSockets[name]) {
        return false;
    } else {
        p = new Player(name);
        sess.player_id = p.id;
        console.log('logging in: ' + p.toString());
        playersToSockets[name] = socket;
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
        //playersToSockets[player.name].join('/' + game.id);
        // Tells each player to start the game
        playersToGames[player.id] = game.id;
        playersToSockets[player.name].emit('start game', game);
    });
}

// Returns the player corresponding to the socket, 
// given a socket and a map of players -> sockets
function findPlayer(socket) {
    console.log('socket id = ' + socket.id);
    console.log('socketsToPlayers = ' + JSON.stringify(socketsToPlayers));
    if(socketsToPlayers[socket.id]) {
        return socketsToPlayers[socket.id];
    } else {
        return console.error('could not find player with socket id ' + socket.id);
    }
}

http.listen(3000, function(){
  console.log('listening on *:3000');
});
