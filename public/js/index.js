var socket = io();

 $("#login-button").click(function(event){
		 event.preventDefault();
	 
     socket.emit('login', $('#username').val());
	 $('form').fadeOut(500);
	 $('.wrapper').addClass('form-success');
});

socket.on('start game', function(game) {
    console.log('Starting up game with players : ' + game.players + '\tid: ' + game.id);
    window.location.replace('gametime?game_id=' + game.id);
});
