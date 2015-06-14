// Express
var express = require('express');
var app = express();
var http = require('http').Server(app);

// Socket.io
var io = require('socket.io')(http);

// Passport authentication
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

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
// Stores all players currently in system
var players = {};
// Stores all players queued for a game
var queued_players = [];
// Maps: player names -> sockets
var playersToSockets = {};
// Maps socket ids -> player names
var socketsToPlayers = {};
// Maps: game_id -> socket room
var gameSockets = {};

// Set up jade rendering
app.set('view engine', 'jade');
app.set('views', path.join(__dirname, '/public/jade'));

setUpSessionAuth(app, io);
// Mount static public assets
app.use('/', express.static('public/'));

// Setup passport authentication
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
    function(username, password, done) {
        console.log('Made it to the local strategy!');
        authenticate(username, password, function(err, player) {
            if (err) {
                return done(err);
            } else if (!player) {
                return done(null, false, {message: 'incorrect username.'});
            } else if (!player.verifyPassword(password)) {
                return done(null, false, {message: 'incorrect password.'});
            } else {
                return done(null, player);
            }
        });
    }
));

passport.serializeUser(function(user, done) {
    return done(null, user.name);
});

passport.deserializeUser(function(id, done) {
    user = players[id];
    return user ? done(null, user) : done(id + ' not found!');
});

app.post('/login',
        passport.authenticate('local', { successRedirect: '/waitingroom',
                                         failureRedirect: '/' }));
                                                 
app.get('/waitingroom', function(req, res) {
    var player = req.user;
    console.log(player + ' has entered the waiting room!');
    queued_players.push(player);
    return res.render("waiting-room");
});

/*
app.post('/login', function(req, res) {
    var sess = req.session;
    console.log('params = ' + req.param.);
    if(!login(name, socket)) {
        socket.emit('failed login', name);
        return;
    } else {
        // Store username in session
        console.log('at login, session = ' + JSON.stringify(socket.handshake.session));
        socket.handshake.session.user = name;
        socket.handshake.session.save(function(err) {
            if(err) return console.error(err);
            console.log('at login, now session = ' + JSON.stringify(socket.handshake.session));
            socket.emit('successful login', name);
            // If there are enough players queued up, start the game
            if(queued_players.length >= Game.NUM_PLAYERS) {
                var game = new Game(queued_players.splice(0, Game.NUM_PLAYERS));
                startGame(game);
            }
        });
    }
}); */

// When user starts game
app.get('/gametime', function(req, res) {
    var player = req.user;
    var game = games[game_id];
    var players = game.players;
    var foundWords = Array.prototype.slice(game.foundWords, 0);
    console.log('players = ' + players + '\twords = ' + foundWords);
    return res.render('main', game);
});

// Waiting room socket handlers
var nsp = io.of('/waiting-room');
nsp.on('connection', function(socket) {
    console.log('made it into waiting-room socket connection!');
    if(false) {
    if(queued_players.length >= Game.NUM_PLAYERS) {
        var game = new Game(queued_players.splice(0, Game.NUM_PLAYERS));
        startGame(game);
    }
    }
});

// Socket handlers
io.on('connection', function(socket) {
    console.log('made it into general socket connection!');
    // Attempt to log user in
    socket.on('login', function(name) {
    });

    // Check if user submitted word is valid or not
    socket.on('submit word', function(guessWord, game) {
        socket.handshake.session.reload(function(err) {
            if(err) console.error(err);
            console.log("session info = " + JSON.stringify(socket.handshake.session));
            var player = socket.request.session.user;
            if(!player) return console.error("could not find username in session!");
            else console.log(player + " submitted " + guessword);
            var success = game.guessword(guessword, function(err) {
                socket.emit('word rejected', err);
            });
            if(success) {
                game.incrementscore(findplayer(socket, playersockets), game.points(guessword));
                // let all players know about the approved word
                game.players.foreach(function(player) {
                    playersockets[player.name].emit('word approved', player, guessword, game);
                });
                //gamesockets[game.id].emit('word approved', player, guessword, game);
            }
        });
    });

    socket.on('disconnect', function() {
    });

});

// Authenticates the passed username and password. If user does not exist
// calls cb(null, null). If error occured, calls cb(err). If user is found
// and password matches, calls cb(null, user).
function authenticate(username, password, cb) {
    var player = players[username] || register(username, password);
    if(player && player.verifyPassword(password)) {
        console.log('logging in: ' + player);
        cb(null, player);
    } else {
        cb(null, null);
    }
}

function register(username, password) {
    p = new Player(username, password);
    console.log('registering: '+ p.toString());
    players[username] = p;
    return p;
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

// Sets up session authentication for express and socket.io
// https://medium.com/@osklopez/sharing-express-session-data-with-socket-io-190b4237f60e
function setUpSessionAuth(app, io) {
    var sessionMiddleware = session({
        secret: 'nagaram',
        saveUninitialized: false,
        resave: false
    });

    app.use(sessionMiddleware);
    io.use(require('express-socket.io-session')(sessionMiddleware));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
}
