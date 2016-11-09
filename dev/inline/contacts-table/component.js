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