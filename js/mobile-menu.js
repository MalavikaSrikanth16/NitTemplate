
jQuery(document).ready(function($) {
		$('#information-for').before('<a href="#" id="mobile-menu-button" class="mtoggle" onclick="_gaq.push(["_trackEvent", "Mobile", "Clicked", "Mobile Menu Hamburger"]);">menu</a>');
    $(".mmenu").hide(); /* ul menu */
    $(".mtoggle").click(function() { /* button */
        $(".mmenu").slideToggle(500);
        return false; 
    });
});


