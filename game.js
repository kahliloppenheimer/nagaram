words = require('./word-helper');
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
}

// Starts the game
Game.prototype.startGame = function() {

}

// Checks to see if the player's guessed word is valid
Game.prototype.guessWord = function(player, word) {
    // If word is not in dictionary
    if(!words.inDict(word)) {

    }
    // If word is not valid given the chosen word for this game
    if(!words.canBuildFrom(chosenWord, word)) {

    }
    // If word has already been guessed 
    else if(foundWords[word]) {
    
    }
    else {
        return incrementScore(player, word.length);
    }
}

// Sets the score of a particular player to newScore.
// Returns the new score.
Game.prototype.setScore = function(player, newScore) {
    scores[player] = newScore;
    return scores[player];
}

// Increments the score of a particular player by inc.
// Returns the new score.
Game.prototype.incrementScore = function(player, inc) {
    scores[player] += inc;
    return scores[player];
}


// Ends the game
Game.prototype.endGame = function() {
    
}

module.exports = Game;
