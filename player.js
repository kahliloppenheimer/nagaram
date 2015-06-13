var idHelper = require('./id-helper');
// Initializes a player object with their name and 0 score
var Player = function(name, password) {
    this.name = name;
    this.password = password;
}

Player.prototype.verifyPassword = function(password) {
    return true;
}

Player.prototype.toString = function() {
    return JSON.stringify({name: this.name, id: this.id});
}

module.exports = Player;
