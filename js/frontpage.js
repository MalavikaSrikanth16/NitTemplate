	$(document).ready(function(){

		
		$('.flexslider').flexslider({
				directionNav: false,
				slideshow: true,
				controlsContainer: ".flexslider-container",
				slideshowSpeed: 5500,
				pauseOnHover: true
			});
			

		// set up the secondary feature section
		setUpSecondaryNav();
		$("#secondary-nav-down").bind("click keypress", secondaryScroll)
		$("#secondary-nav-up").bind("click keypress", secondaryScroll)
		// quick and dirty secondary features nav preload
		$("#secondary-features").append(
			'<div class="secondary-features-arrow-up-hover" style="display:none"></div><div class="secondary-features-arrow-down-hover" style="display:none"></div>'
		);


		// set up the headline news ticker
		$("#headline-types .feed").bind("click keypress", function(){
			// preload more news button images
			preloadMoreNewsButtons();
			setActiveFeed(this);
			setActiveButton(this);
			getRSSFeed(this);
			return false;
		})
		
		// build in the HTML for the news items
			var headlineWrapper = document.createElement("DIV");
			$(headlineWrapper).attr({"class":"marginator", id:"headlines-content-wrapper"}).css({display:"none"});
			$(headlineWrapper).append(
				$(document.createElement("DIV")).attr({id:"headlines-content"}).append(
					$(document.createElement("UL"))
				)
			)
			
			$("#headlines").append(headlineWrapper);
			
	//	$("#headlines .headlines-nav").bind("click keypress", headlineScroll);
		// fire off the news click
		$("#headline-types .first a").click();
				
		
		
		
	});

	/** 
	 * Scroll the secondary feature the height of one list item in the appropriate direction
	 * @return boolean false
	 */
	function secondaryScroll() {
		if($(this).hasClass("disabled")) return false;
		$(this).addClass("disabled");
		
		var lih = $("#secondary-features ul li:first").height();
		var lis = $("#secondary-features ul").css("top");
		if(isNaN(parseInt(lis))) { lis = 0; }

		if($(this).hasClass("arrow-down")) {
			var t = parseInt(lih) + parseInt(lis)*-1;
			var m = "-";
		} else {
			var t = parseInt(lih) - parseInt(lis)*-1;
			var m = "";
		}

		$("#secondary-features ul").animate(
			{top: m + "" + t + "px"},
			"fast",
			null,
			function(){ $(this).removeClass("disabled"); setUpSecondaryNav(); }
		);
		return false;
	}
	
	/** 
	 * determine if the navigation elements should be disabled or not
	 */
	function setUpSecondaryNav() {
		$("#secondary-nav-up, #secondary-nav-down").removeClass("disabled");

		if(parseInt($("#secondary-features ul").css("top")) == 0 || isNaN(parseInt($("#secondary-features ul").css("top")))) {
			$("#secondary-nav-up").addClass("disabled");
		}

		var listHeight = parseInt($("#secondary-features ul").height());
		var listItemsHeight = parseInt($("#secondary-features ul li:first").height()) * $("#secondary-features ul li").size();
		var listTop = parseInt($("#secondary-features ul").css("top"));
		if(isNaN(parseInt(listTop))) { listTop = 0; }
		
		if((listTop*-1) + listHeight >= (listItemsHeight - $("#secondary-features ul li").size())) { // size is to accommodate slop
			$("#secondary-nav-down").addClass("disabled");
		}

	}
	
	
	



/** 
 * Switch the active class name to the appropriate feed link
 */
	function setActiveFeed(el) {
		$("#headline-types .feed").removeClass("active");
		$(el).addClass("active");
	}

/** 
 * Change the More... button
 */
	function setActiveButton(el) {
		var feed = el.rel.toString().split("proxy.php?feed=")[1];
		var img = new Image();
		img.src = BASE_URL + "sites/default/themes/pawtuxet/img/more-" + feed + ".png";
		
		var w = img.width;
		if(w < 86) { w = 86; } // minimum width (which we know is the width of the news button)
		$("#more-news-button a").css({
			backgroundImage : 'url("'+ img.src +'")',
			"width" : (w + 10) + "px"
		}).attr({
			"href" : el.href
		}).html("More " + $(el).html()) ;
		
	}
	
/** 
 * Preload the more news images.  In Safari, this helps to ensure that the button is sized properly
 */

	function preloadMoreNewsButtons() {
		var srcs = ["news", "events", "athletics"];
		var imgs = new Array();
		for(var i=0; i<srcs.length; i++) {
			imgs[i] = new Image();
			imgs[i].src = BASE_URL + "sites/default/themes/pawtuxet/img/more-" + srcs[i] + ".png";
		}
	}


/** 
 * Remove the old headlines, and replace them with a loader animation
 */
	function emptyHeadlines() {
		$("#headlines-content ul").remove();
		
		if(!$("#headlines-content-wrapper").is(":visible")) {
			$("#headlines-content-wrapper").slideDown();
		}
		
		$("#headlines-content").html('<img src="'+ headlinesLoaderSrc +'" class="loader" />');
	}
	
/** 
 * Remove the loader animation and add new headlines
 */
	function addHeadlines(feed) {
		$("#headlines-content .loader").remove();

		// convert string to XML object so varied feeds are more uniform
		if (window.DOMParser) {
			var XML = (new DOMParser()).parseFromString(feed, "text/xml");
		} else {
			var XML = new ActiveXObject("Microsoft.XMLDOM");
			XML.async="false";
			XML.loadXML(feed);
		}
		var items = XML.getElementsByTagName("item");

		$("#headlines-content").append($(document.createElement("UL")));

		for(var i=0; i<items.length && i < 5; i++) { // using $.each() ruins the title elements in the BW feed.
				var el = items[i];
				var isEvent = false;
				var newsItem = document.createElement("LI");
				if($(XML.getElementsByTagName("title")[0]).text() == "Brown University Events Calendar") {
					$(newsItem).attr({"class":"event"});
					isEvent = true;
				}
				
				
				if($("bru-establishing-image-cropped", el).text() != "") {
					$(newsItem).append(
						$(document.createElement("A")).attr({href:$("link", el).text()}).append(
							$(document.createElement("IMG")).attr({src:$("bru-establishing-image-cropped", el).text()})
						)
					)
				} else if(el.getElementsByTagName("content").length > 0 || el.getElementsByTagName("media:content").length > 0) {
					// URLs contain height and width specs.  Nifty.  e.g.
					// http://www.brownbears.com/sports/m-golf/2010-11/photos/Amato-2-2009.gif?max_width=160&amp;max_height=120"
					var mediaContent = el.getElementsByTagName("content")[0];
					if(!mediaContent) { var mediaContent = el.getElementsByTagName("media:content")[0]; }
					$(newsItem).append(
						$(document.createElement("A")).css({
							"width": "160px",
							"height": "89px",
							"display": "block",
							"background" : "transparent url(" + $(mediaContent).attr("url") + ") 50% 0 no-repeat"
						}).attr({href:$("link", el).text()})
					)
				}
				
				if($("bru-eyebrow", el).text() != "") {
					$(newsItem).append(
							$(document.createElement("H4")).addClass("eyebrow").html($("bru-eyebrow", el).text())
					)
				}
				/*
				// remove the Event Eyebrow from events
				if(isEvent) {
					$(newsItem).append(
						$(document.createElement("H4")).addClass("eyebrow").html("Event")
					)
				}
				*/
				var linkText = $("title", el).text();
				var linkPreText = "";
				var location = "";
				
				if(isEvent) {
					// console.log(lastDash);
					
					var lastDash = linkText.lastIndexOf("-");
					linkPreText = linkText.substr(lastDash+1);
					linkText = linkText.substr(0, lastDash-1);

					// now we need to extract the location from the description
					var description = $("description", el).text();
					var locationEndPos = description.indexOf(".");

					// we need to find the second instance of a time. e.g. 3:30 PM
					// here's the first instance:
					var timeMatch = /[\d]{1,2}:[\d]{2}\s[A|P]M\s/;
					var firstTimePosition = description.search(timeMatch);
					var searchMe = description.substr(firstTimePosition + description.match(timeMatch).toString().length);

					// here's the second
					var secondTimePosition = searchMe.search(timeMatch);
					var secondTimePositionLength = searchMe.match(timeMatch);
					searchMe = searchMe.substr(secondTimePosition + searchMe.match(timeMatch).toString().length);
					// now we know where to crop our string
					var locationEndPos = searchMe.indexOf(".");
					var location = searchMe.substr(0, locationEndPos);

					
					// it's a multi-day event, set the date to today instead of the start date that's in the past
					if(!description.match(/-\s\d\d?:\d\d\s[A|P]M\s/)) { 
						linkPreText = bwStyleDate();
					}

					linkPreText = '<span class="date-time">' + linkPreText + '</span>';					
					location = '<span class="location">' + location + '</span>';
				}
				
				$(newsItem).append(
						$(document.createElement("P")).addClass("teaser").append(
							$(document.createElement("A")).html(linkText).attr({href:$("link", el).text()})
						).append(location).prepend(linkPreText)
				);
				
				$("#headlines-content ul").append(newsItem);

		}

	}

/** 
 * Format a date the same way Bedework would
 */
	function bwStyleDate(d) {
		var days = new Array("Sun","Mon","Tue","Wed","Thu","Fri","Sat");
		var months = new Array("January","February","March","April","May","June","July","August","September","October","November","December");
		if(!d) {
			var d = new Date();
		}
		return days[d.getDay()] + ", " + months[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
	}


/** 
 * Remove the loading animation and display the error message instead of the headlines
 */
	function displayError(e) {
		$("#headlines-content .loader").remove();
		$("#headlines-content").html(e);
	}



/** 
 * Retrieve the data from an RSS feed
 */
	function getRSSFeed(el) {
		emptyHeadlines();
		var feedURL = el.rel.toString();
		$.ajax({
				url: feedURL,
				success: function(feed) {
					addHeadlines(feed);
				},
				error: function() {
					if(console) {
						console.log("failed to get RSS at: " + feedURL);
					} 
					displayError("The news items aren't currently loading.  Please try again later.");
				}
		});
		
	}