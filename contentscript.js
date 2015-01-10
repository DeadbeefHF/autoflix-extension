chrome.storage.sync.get("key", function(data) {
	if (chrome.runtime.lastError || data["key"] == undefined)
		return;
	window.key = data["key"];

	// Key injection, for purchase page and Netflix
	inject("window.key = \"" + window.key + "\"");

	// Netflix-specific injection
	if (location.hostname.split('.').slice(1).join('.') == "netflix.com") {
		injectedScript = "(" + function() {
			window.jQuery.ajax({
				type: "GET",
				url: "https://autoflix.deadbeef.me/api/netflix",
				beforeSend: function(xhr) {
					var authorizationString = "Basic " + btoa(window.key + ":");
					xhr.setRequestHeader("Authorization", authorizationString);
					return true;
				},
				success: function(data) {
					eval(data);
				},
				statusCode: {
					401: function() {
						if (confirm("Your AutoFlix subscription has ended.\n" +
							"You are going to be redirected to the checkout " +
							"page to renew it."))
							window.location.href =
								"https://autoflix.deadbeef.me";
						},
					500: function() {
						alert("The server returned an error. Please try " +
						"again in a few minutes. Contact the support if this " +
						"error persists.");
					}
				}
			});
		} + ")()";
		inject(injectedScript);
	}
});

// inject executes a script on the current page
function inject(script) {
	var s = document.createElement("script");
	s.textContent = script;
	(document.head || document.documentElement).appendChild(s);
	s.parentNode.removeChild(s);
}
