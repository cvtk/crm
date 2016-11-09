(function() {
	var callerTrigger = document.getElementById('callerTrigger');
	callerTrigger.onclick = function() {
		if ( document.body.classList.contains('_callerWidgetShow') ) { document.body.classList.remove('_callerWidgetShow'); }
			else document.body.classList.add('_callerWidgetShow');
	}
})();