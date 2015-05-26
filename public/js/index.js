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
        //gameSocket = io('/' + game.id);
        console.log('Starting up game (' + game.id + ') with players : ' + game.players);
        document.location.href = '/gametime?game_id=' + game.id;
    });
});
