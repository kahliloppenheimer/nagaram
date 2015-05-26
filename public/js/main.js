// Communication with server
var serverSocket = io();
$(document).ready(function() {
    var game_id = window.location.href.toString().split('=')[1];
    // Word submit
    $('#submit_word').submit(function(event) {
        event.preventDefault();
        var guessWord = $('#m').val();
        serverSocket.emit('submit word', guessWord, game_id);
        $('#m').val('');
        return false;
    });

    serverSocket.on('word approved', function(player, guessWord, game) {
        $('#words').append($('<li>').text(guessWord));
    });

    serverSocket.on('word rejected', function(err) {
        alert(err);
    });
});
