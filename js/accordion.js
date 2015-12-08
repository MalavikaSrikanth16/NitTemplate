(function($){
	var bwsAccordion = {
		'initialized': false,
		'speed': 'fast',
		'className': 'accordion-open' 
	};
	
	function initBwsAccordion() {
		if(!bwsAccordion.initialized) {
			var defaultOpen = $('#mobile-nav .current-site').parents('.item-list');
			$('#mobile-nav h3 a').bind('click keypress', function(event){
				var parent = $(this).parents('.item-list');
				var el = $('.list', parent);
				//console.log(el);
				if(parent.hasClass(bwsAccordion.className)) {
					return false;
				}
				
				el.slideToggle(bwsAccordion.speed);
				parent.toggleClass(bwsAccordion.className);
				
				$('#mobile-nav .list').not(el).slideUp(bwsAccordion.speed);
				el.slideDown(bwsAccordion.speed);
				$('.item-list').removeClass(bwsAccordion.className);
				parent.addClass(bwsAccordion.className);
				return false;
			});
			
			$('#mobile-nav .list').hide();
			$('.list', defaultOpen).slideDown(bwsAccordion.speed);
			defaultOpen.addClass(bwsAccordion.className);
			bwsAccordion.initialized = true;
		}
	}

 $(document).ready(initBwsAccordion);

})(jQuery);