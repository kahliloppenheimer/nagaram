// Communication with server
var serverSocket = io();
// Communication with game
var gameSocket = undefined;
// Game itself
var game = undefined;

// Deals with everything up until the game starts
$(document).ready(function() {
    $("#login-button").click(function(event){
             event.preventDefault();
         serverSocket.emit('login', $('#username').val());
    });

    serverSocket.on('failed login', function(name) {
        alert(name + ' is already taken. Please choose a new name.');
    });

    serverSocket.on('successful login', function(name) {
         $('form').fadeOut(500);
         $('.wrapper').addClass('form-success');
    });

    serverSocket.on('start game', function(game) {
        console.log('initiating game socket');
        //gameSocket = io('/' + game.id);
        console.log('Starting up game (' + game.id + ') with players : ' + game.players);
        //window.location.replace('gametime?game_id=' + game.id);
        loadGame(game);
    });
});

// Deals with everything up until the game starts
function loadGame(game) {
    console.log('loading game...');
    window.location.href = '/gametime?game_id=' + game.id;
    /*
    $.get('gametime', {"game_id": game.id},
        function(data) {
            var newDoc = document.open("text/html", "replace");
            newDoc.write(data);
            newDoc.close();
            startGame(game);
        });
    */
    console.log('finished loading game');
}

// Deals with everything after the game starts
function startGame(game) {
    console.log('starting game...');
    //$(document).load('gametime?game_id=' + game.id);
    this.game = game;
    // Word submit
    $('#f').submit(function(e){
        e.preventDefault();
        var guessWord = $('#m').val();
        socket.emit('submit word', guessWord, game);
        $('#m').val('');
        return false;
    });

    serverSocket.on('word approved', function(player, guessWord, game) {
        $('#words').append($('<li>').text(guessWord));
    });

    serverSocket.on('word rejected', function(err) {
        alert(err);
    });

}
