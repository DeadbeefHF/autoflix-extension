// Interested in a partnership with a developper? Shoot me a PM!
// http://www.hackforums.net/private.php?action=send&uid=1519607

chrome.browserAction.onClicked.addListener(function(tab) {
	chrome.storage.sync.get("key", function(data) {
		if (!chrome.runtime.lastError && data["key"] != undefined)
			return;
		chrome.cookies.get({url: "https://autoflix.deadbeef.me", name: "key"},
			function(cookie) {
				if (cookie == null) {
					alert("AutoFlix couldn't find your user key. Please make " +
						"sure that cookies are enabled in your browser, then " +
						"visit again the page linked in the order " +
						"confirmation email you received. If you keep " +
						"encountering this issue, please contact our support.");
				}
				chrome.storage.sync.set({key: cookie.value});
		});
	});

	// Redirect to netflix.com if needed
	if (!~tab.url.indexOf("netflix.com")) {
		chrome.tabs.update(tab.tabId, {url: "https://www.netflix.com"});
		return;
	}

	// Remove cookies
	chrome.cookies.getAll({domain: "netflix.com"}, function(cookies) {
		for (var i = 0; i < cookies.length; i++)
			chrome.cookies.remove({
				url: "http://netflix.com" + cookies[i].path,
				name: cookies[i].name
			});
	});

	// Execute remote JS
	chrome.tabs.executeScript(null, {file:"contentscript.js"});
});

// Checkout page
chrome.webNavigation.onCommitted.addListener(function(details) {
	chrome.tabs.executeScript(details.tabId, {file: "contentscript.js"});
}, {url: [{"hostEquals": "autoflix.deadbeef.me"}]});
