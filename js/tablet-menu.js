jQuery(document).ready(function($) {
		$('#tablet-nav').before('<a href="#" id="tablet-menu-button" class="ttoggle" onclick="_gaq.push(["_trackEvent", "Tablet", "Clicked", "Tablet Menu Hamburger"]);">menu</a>');
    $(".tmenu").hide(); /* ul menu */
    $(".ttoggle").click(function() { /* button */
        $(".tmenu").slideToggle(500);
        return false;
    });
});