$(function() {
	$('#callerTrigger').click(function() {
		$('body').toggleClass('_hideCaller');
	})
});
$(function() {
	var checkPhone = function() {
		var phone = $('#callerWidget .phonenumber').val();
		return (!isNaN(phone.substr(phone.length - 10)) && (phone.length > 5));
	}

showResult = function(message) {
		$('#callerWidget .result')
			.fadeIn(350)
			.html(message)
			.fadeOut(5000);
	}
	

	$('#callerWidget .icon-bubble').bind('toggleMenu', function() {
		if ($(this).attr('data-checked')) {
			$(this).siblings('.icon').animate({'opacity': 1});
			$('#callerWidget .sms-list, .sms-message, .send').fadeOut(350);
			$(this).removeAttr('data-checked');
		} else {
			$(this).attr('data-checked', 1);
			$(this).siblings('.icon').animate({'opacity': 0.35});
			$('#callerWidget .sms-list').slideDown(350);
		}
	});

		$.ajax({
		dataType: 'json',
		type: 'post',
		url: 'http://127.0.0.1:8000/api/sms/templates',
		success: function(response) {
			if (response.length) {
				$('#callerWidget .sms-list').html('');
				$.each(response, function(key, data) {
					$('#callerWidget .sms-list').append('<label class="item"><input type="radio" name="template" data-message="' + data.message + '" value="' + data.id + '">' + data.name + '</label>');
					$('#callerWidget .sms-list > .item input').click(function() {
						$('#callerWidget .sms-message').html($(this).data('message')).slideDown(350);
						$('#callerWidget .send').fadeIn(350);
					})
				})
				$('#callerWidget .send').click(function() {
							if (checkPhone()) {
								$.ajax({
								dataType: 'json',
								type: 'post',
								url: 'http://127.0.0.1:8000/api/sms/send',
								data: {
									'template': $('#callerWidget .sms-list input:checked').val(),
									'phone': $('#callerWidget .phonenumber').val()},
								success: function(response) {
									if(response.substring(0,3 == 100)) {
										$('#callerWidget .icon-bubble').trigger('toggleMenu');
										showResult('Сообщение успешно отправлено');
									} else {
										showResult('Произошла ошибка, обратитесь к администратору, код: ' + response);
									}
								}
							})
						} else {
							showResult('Неверный номер телефона');
						}
						});
			} else {
				$('#callerWidget .sms-list').html('Шаблонов не найдено');
			}
		}
	})

	$('#callerWidget .phonenumber')
	.keyup(function() {
		if ($(this).val().length > 1)  {
			$.ajax({
				dataType: "json",
				url: 'http://127.0.0.1:8000/api/contacts',
				data: { 'search': $(this).val() },
				success: function(response) {
					if (response.length) {
						$('#callerWidget .contact-list').html('');
						$.each(response, function(key, data) {
							var html = '<li class="item"><a class="link" href="#" data-phone="' + data.mobilephone + '">' + data.name + '</a></li>';
						$('#callerWidget .contact-list').append(html).slideDown(550);
							$('#callerWidget .contact-list .link').click(function() {
								$('#callerWidget .phonenumber').val($(this).data('phone'));
								$('#callerWidget .contact-list').fadeOut(350);
							})
						})
					} else {
						$('#callerWidget .contact-list').html('<li class="item"><a class="link">Нет результатов</a></li>').slideDown(550);
					}
				}
			})
		} else if ($(this).val().length == 0) { $('#callerWidget .contact-list').fadeOut(350); }
	})
	.focus(function() {
		$(this).select();
	})

	$('#callerWidget .icon-bubble').click(function() {
		
		$(this).trigger('toggleMenu');
		
	})
})
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


$(function() {
	$('#menuTrigger').click(function() {
		$('body').toggleClass('_hideMenu');
	})
});