var socket = io();
$(document).ready(function() {

    $('#f').submit(function(){
        socket.emit('submit word', $('#m').val());
        $('#m').val('');
        return false;
    });

    socket.on('word approved', function(word) {
        $('#messages').append($('<li>').text(word));
    });

});
