var socket = io();
$(document).ready(function() {

    $('#f').submit(function(){
        var guessWord = $('#m').val();
        var player = 
        socket.emit('submit word', player, guessWord, game);
        $('#m').val('');
        return false;
    });

    socket.on('word approved', function(player, guessWord, game) {
        $('#words').append($('<li>').text(guessWord));
    });

    socket.on('word rejected', function(err) {
        alert(err);
    });

});
