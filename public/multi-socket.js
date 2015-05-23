// Handles all logic for socket communications with multiple clients
var socket = io();
$(document).ready(function() {

    socket.on('player entry', function(person) {
        $('#users').append($('<li>').text(person.name + ": " + person.score));
    });

});
