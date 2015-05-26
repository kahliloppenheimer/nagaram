var idHelper = require('./id-helper');
// Initializes a player object with their name and 0 score
var Player = function(name) {
    this.name = name;
    this.id = idHelper();
}

Player.prototype.toString = function() {
    return JSON.stringify({name: this.name, id: this.id});
}

module.exports = Player;
