chrome.storage.sync.get("key", function(data) {
	if (chrome.runtime.lastError || data["key"] == undefined)
		return;
	window.key = data["key"];

	// Key injection, for purchase page and Netflix
	inject("window.key = \"" + window.key + "\"");

	// Netflix-specific injection
	if (location.hostname.split('.').slice(1).join('.') == "netflix.com") {
		injectedScript = "(" + function() {
			var request = new XMLHttpRequest();
			request.open('GET', 'https://autoflix.deadbeef.me/api/netflix', true);
			var authorizationString = "Basic " + btoa(window.key + ":");
			request.setRequestHeader("Authorization", authorizationString);

			request.onload = function() {
				if (this.status >= 200 && this.status < 400) {
					eval(this.response);
			 	} else if (this.status == 401) {
					if (confirm("Your AutoFlix subscription has ended.\nYou " +
						"are going to be redirected to the checkout page to " +
						"renew it.")) {
						window.location.href = "https://autoflix.deadbeef.me";
					}
				} else {
					alert("The server returned an error. Please try again in " +
						"a few minutes. Contact the support if this error " +
						"persists.");
				}
			};

			request.onerror = function() {
				alert("There was a problem connecting to the server. Please " +
					"check your Internet connection or try again in a few " +
					"minutes");
			};

			request.send();
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
