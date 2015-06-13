var words = require('./word-helper');
var idHelper = require('./id-helper');

// Initializes all players to start with 0 scores
var Game = function(players) {
    // Players involved in this game
    this.players = players;
    // Word to spell words from
    this.chosenWord = words.getRandWord();
    // All correctly guessed words
    this.foundWords = {};
    // Maps player -> score
    this.scores = {};
    // Start time of game
    this.startTime = new Date();
    // unique id for game
    this.id = idHelper();
}

// Number of players for any given game
Game.NUM_PLAYERS = 1;

// Returns true iff  player's guessed word...
// 1) is in the dictionary
// 2) is built out of the letters of the chosen word
// 3) has not already been selected
//
// calls cb with an error message if there is one
Game.prototype.guessWord = function(word, cb) {
    if(!words.inDict(word)) {
        cb(word + ' is not in the dictionary.');
    } else if(!words.canBuildFrom(this.chosenWord, word)) {
        cb(word + ' can not be made from ' + this.chosenWord + '.');
    } else if(this.foundWords[word]){
        cb(word + ' has already been chosen.');
    } else {
        return true;
    }
}

// Sets the score of a particular player to newScore.
// Returns the new score.
Game.prototype.setScore = function(player, newScore) {
    this.scores[player] = newScore;
    return this.scores[player];
}

// Increments the score of a particular player by inc.
// Returns the new score.
Game.prototype.incrementScore = function(player, inc) {
    this.scores[player] += inc;
    return this.scores[player];
}

Game.prototype.toString = function() {
    return this.id;
}

// Returns the points for a given word
Game.points = function(word) {
    return word.length;
}


module.exports = Game;
