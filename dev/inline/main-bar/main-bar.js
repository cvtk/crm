
$('#importUpload').click(function() {
	$('#fileInput').click();
});

$('#fileInput').change(function() {
    var fileData = $('#fileInput').prop("files")[0];
var formData = new FormData();
formData.append('file', fileData);
console.log(formData); 
$.ajax({
  url: '/api/upload',
  cache: false,
  contentType: false,
  processData: false,
  data: formData,
  type: 'post',
  success: function(){
  },
  error: function (request, error) {
    console.log(request);
    alert(" Can't do because: " + error);
    }
 });
})

$('#removeContacts').click(function() {
	res = confirm('Вся база контактов будет удалена. Вы уверены, что хотите продолжить?');
	if (res) {
		$.ajax({
		type: 'post',
		url: '/api/contacts/remove',
		data: {
			token: App.user.get('password')
		},
		success: function(){

		},
		error: function() {

		}
	})
	}
	
})

$('#actionButton').mouseenter(function() {
var pos = $(this).offset();
	$('#actionMenu').css({top : pos.top-43, left: pos.left-340}).slideDown(350);
});

$('#actionMenu').mouseleave(function() {
	$(this).fadeOut(350);
});