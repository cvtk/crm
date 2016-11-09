(function() {
	var asideTrigger = document.getElementById('asideTrigger');
	asideTrigger.onclick = function() {
		if ( document.body.classList.contains('_full') ) { document.body.classList.remove('_full'); }
			else document.body.classList.add('_full');
	}
})();
(function() {
	var callerTrigger = document.getElementById('callerTrigger');
	callerTrigger.onclick = function() {
		if ( document.body.classList.contains('_callerWidgetShow') ) { document.body.classList.remove('_callerWidgetShow'); }
			else document.body.classList.add('_callerWidgetShow');
	}
})();
$(function() {
	$.ajax({
		dataType: "json",
		url: 'http://127.0.0.1:8000/api/contacts',
		success: function(response) {
			$.each(response, function(key, data){
				$('#contactsTable > .content').append(
					'<tr><td>' + data.firstname +' ' + data.lastname + '</td><td class="phone">' 
					+ data.mobilephone + '</td><td><button data-id=' + data.id + ' class="actions"><i class="icon-settings"></i></button></td></tr>')
				console.log(data)
			})
		}
	});
})