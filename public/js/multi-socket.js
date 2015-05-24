// Handles all logic for socket communications with multiple clients
var socket = io();
$(document).ready(function() {

    socket.on('player entry', function(player) {
        $('#users').append($('<li>').text(player.name + ": " + player.score));
    });

});
