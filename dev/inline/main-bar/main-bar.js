$(function() {
	$('#importUpload').click(function() {
		$('#fileInput').click();
	});
	$('#fileInput').change(function() {
		var fileData = $('#fileInput').prop("files")[0];
    var formData = new FormData();
    formData.append('file', fileData);
    console.log(formData); 
    $.ajax({
      url: 'http://127.0.0.1/api/upload',
      cache: false,
      contentType: false,
      processData: false,
      data: formData,
      type: 'post',
      success: function(){
        console.log("works"); 
      },
      error: function (request, error) {
        console.log(request);
        alert(" Can't do because: " + error);
    	}
     });
	})


	$('.main-bar > .search')
	.keyup(function() {
		if ($(this).val().length > 1)  {
			$('#contactsTable > .content').html('<span class="ajax-loader"></span>');
			$.ajax({
				dataType: "json",
				url: 'http://127.0.0.1:8000/api/contacts',
				data: { 'search': $(this).val() },
				success: function(response) {
					if (response.length) {
						$.each(response, function(key, data){
						$('#contactsTable > .content').html(
							'<tr><td>' + data.name + '</td><td class="phone">' 
							+ data.mobilephone + '</td><td><button data-id=' + data.id + ' class="actions"><i class="icon-settings"></i></button></td></tr>');
					});
					} else $('#contactsTable > .content').html('');
					
				}
			})
		}
	})
	.focus(function() {
		$(this).select();
	})
})

