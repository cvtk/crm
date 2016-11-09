$(function() {
	$('#callerWidget > .phonenumber')
	.keypress(function() {
		if ($(this).val().length > 2) {
			$('#callerWidget > .contact-list').slideDown(350);
			// $.ajax({
			// 	dataType: "json",
			// 	url: 'http://127.0.0.1:8000/api/contacts',
			// 	data: { 'search': $(this).val() },
			// 	success: function(response) {
			// 		$.each(response, function(key, data){
						
			// 		})
			// 	}
			// })

		}
		else {
			$('#callerWidget > .contact-list').slideUp(350);
		}
	})
	.focus(function() {
		$(this).select();
	})
})