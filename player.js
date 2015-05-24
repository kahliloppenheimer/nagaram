// Initializes a player object with their name and 0 score
var Player = function(name) {
    this.name = name;
    this.score = 0;
}

// Sets the score of the player to be newScore
Player.prototype.setScore(newScore) {
    this.score = newScore;
}

module.exports = Player;
