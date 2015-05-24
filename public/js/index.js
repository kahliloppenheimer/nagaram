var socket = io();

 $("#login-button").click(function(event){
		 event.preventDefault();
	 
	 $('form').fadeOut(500);
	 $('.wrapper').addClass('form-success');
     socket.emit('login', $('#login-button').val());
});
