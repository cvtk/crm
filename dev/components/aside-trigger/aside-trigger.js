(function() {
	var asideTrigger = document.getElementById('asideTrigger');
	asideTrigger.onclick = function() {
		if ( document.body.classList.contains('_full') ) { document.body.classList.remove('_full'); }
			else document.body.classList.add('_full');
	}
})();