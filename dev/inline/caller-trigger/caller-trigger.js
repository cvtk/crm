$(function() {
	$('#callerTrigger').click(function() {
		$('body').toggleClass('_hideCaller');
		$('#callerWidget .phonenumber').focus().select();
	})

});