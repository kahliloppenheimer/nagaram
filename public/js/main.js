// Handles all logic for socket communications with multiple clients
var socket = io();
$(document).ready(function() {
    socket.on('player entry', function(player) {
        $('#users').append($('<li>').text(player.name + ": " + player.score));
    });

    $('#f').submit(function(){
        socket.emit('submit word', {name: name, word: $('#m').val()});
        $('#m').val('');
        return false;
    });

    socket.on('word approved', function(data) {
        $('#words').append($('<li>').text(data.word));
    });

    socket.on('initial data', function(players) {
        console.log(name + ' recieved players data!');
        $.each(players, function(name, score) {
            console.log('next entry = ' + person + ' : ' + score);
            $('#users').append($('<li>').text(person + ': ' + score));
        });
    });

});
