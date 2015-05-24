// Communication with server
var serverSocket = io();
// Communication with game
var gameSocket = undefined;

 $("#login-button").click(function(event){
		 event.preventDefault();
	 
     serverSocket.emit('login', $('#username').val());
	 $('form').fadeOut(500);
	 $('.wrapper').addClass('form-success');
});

serverSocket.on('start game', function(game) {
    gameSocket = io('/' + game.id);
    console.log('Starting up game (' + game.id + ') with players : ' + game.players);
    window.location.replace('gametime?game_id=' + game.id);
});
