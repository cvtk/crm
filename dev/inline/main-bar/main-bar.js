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

