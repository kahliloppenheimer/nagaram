var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var Person = require('./person');

// Mount static public assets
app.use('/static', express.static('public/'));

// Default handler just sends index page
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

// Stores all active players
var people = {};
// Stores all correctly guessed words.
var words = {};


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

// Returns true iff the given word has:
// 1) Not been guessed yet
// 2) Is a valid dictionary word
function isValid(word) {
    if(inDict(word) && !words[word]) {
        words[word] = true;
        return true;
    }
    return false
}

// Returns true iff a word is in the dictionary
function inDict(word) { 
    return true;
}



http.listen(3000, function(){
  console.log('listening on *:3000');
});
