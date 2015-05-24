// Initializes a player object with their name and 0 score
var Player = function(name) {
    this.name = name;
}

Player.prototype.toString = function() {
    return "" + this.name;
}

module.exports = Player;
