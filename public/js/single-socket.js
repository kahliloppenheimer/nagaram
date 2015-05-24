// Handles all logic for socket communications with single clients

var socket = io();
$(document).ready(function() {

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

// Logs a user in, fires a login event to the server, then returns their name
function login() {
    var name = prompt("Please enter your name: ");
    console.log('logging in ' + name);
    socket.emit('login', name);
    return name;
}

