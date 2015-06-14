// Communication with server
// var socket = io.connect('/waiting-room');
var socket = io();

// Deals with everything up until the game starts
$(document).ready(function() {

    socket.on('start game', function(game) {
        //gameSocket = io('/' + game.id);
        console.log('Starting up game (' + game.id + ') with players : ' + game.players);
        window.location.href = '/gametime?game_id=' + game.id;
    });
});
