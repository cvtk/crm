$(function() {
	$('#callerTrigger').click(function() {
		$('body').toggleClass('_hideCaller');
	})
});
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
// $(function() {
// 	$.ajax({
// 		dataType: "json",
// 		url: 'http://127.0.0.1:8000/api/contacts',
// 		success: function(response) {
// 			$.each(response, function(key, data){
// 				$('#contactsTable > .content').append(
// 					'<tr><td>' + data.firstname +' ' + data.lastname + '</td><td class="phone">' 
// 					+ data.mobilephone + '</td><td><button data-id=' + data.id + ' class="actions"><i class="icon-settings"></i></button></td></tr>')
// 				console.log(data)
// 			})
// 		}
// 	});
// })
$(function() {
	$('.main-bar > .search')
	.keypress(function() {
		if ($(this).val().length > 2) {
			$('#contactsTable > .content').html('<span class="ajax-loader"></span>');
			$.ajax({
				dataType: "json",
				url: 'http://127.0.0.1:8000/api/contacts',
				data: { 'search': $(this).val() },
				success: function(response) {
					$.each(response, function(key, data){
						$('#contactsTable > .content').html(
							'<tr><td>' + data.firstname +' ' + data.lastname + '</td><td class="phone">' 
							+ data.mobilephone + '</td><td><button data-id=' + data.id + ' class="actions"><i class="icon-settings"></i></button></td></tr>');
					})
				}
			})
		}
	})
	.focus(function() {
		$(this).select();
	})
})


$(function() {
	$('#menuTrigger').click(function() {
		$('body').toggleClass('_hideMenu');
	})
});