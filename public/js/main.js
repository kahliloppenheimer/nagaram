// Communication with server
var serverSocket = io();
$(document).ready(function() {
    // Word submit
    $('#f').submit(function(event) {
        var guessWord = $('#m').val();
        serverSocket.emit('submit word', guessWord);
        $('#m').val('');
        console.log('word submitted!');
        return false;
    });

    serverSocket.on('word approved', function(player, guessWord, game) {
        $('#words').append($('<li>').text(guessWord));
    });

    serverSocket.on('word rejected', function(err) {
        alert(err);
    });
});
