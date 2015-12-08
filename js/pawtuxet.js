	$(document).ready(function(){
		var searchLanguage = "Search";
		// HTML5 allows for placeholder text on form fields!
		// But we fall back to javascript when placeholder is unsupported
		if (!("placeholder" in document.createElement("input"))) {
			$("#edit-search-theme-form-1").val(searchLanguage);
			$("#edit-search-theme-form-1").focus(function(){
				if($("#edit-search-theme-form-1").val() == searchLanguage) {
					$("#edit-search-theme-form-1").val('');
				}
			});
			$("#edit-search-theme-form-1").blur(function(){
				if($("#edit-search-theme-form-1").val() == "") {
					$("#edit-search-theme-form-1").val(searchLanguage);
				}
			});

		}
	});

	function report(y) {
		var n = "";
		for(var x in y) {
			n += x + ": " + y[x] + "\n";
		}
		alert(n)
	}
