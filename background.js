var targetHost = 'www.emeraldchat.com';
var storageNs = 'as.';

// Retrieves data from Local storage.
var retrieve = function(name, defaultVal) {
    var item = localStorage.getItem(storageNs + name);

    return item == null ? defaultVal : item;
};

// Stores data to Local storage.
var store = function(name, value) {
    localStorage.setItem(storageNs + name, value);
};

// Checks is extension enabled.
var isEnabled = function() {
    if (null == retrieve('enabled')) {
        store('enabled', true);
    }

    return retrieve('enabled') == 'true';
};

// Updates tabs depended from extension.
var updateIcon = function(tab, clicked) {
    chrome.tabs.query({
        url: '*://' + targetHost + '/*'
    }, function(tabs) {
        for (i = 0; i < tabs.length; i++) {
            var tab = tabs[i];
            updateTabIcon(tab, clicked);
        }
    });
};

// Updates current tab icon.
var updateTabIcon = function(tab, clicked) {
    var title = isEnabled() ? chrome.i18n.getMessage("appEnabled") : chrome.i18n.getMessage("appDisabled");
    var icon = isEnabled() ? 'icon.png' : 'disabled.png';
    chrome.pageAction.setIcon({
        path: icon,
        tabId: tab.id
    });
    chrome.pageAction.setTitle({
        title: title,
        tabId: tab.id
    });
    if (clicked && isEnabled()) {
        // Reload page.
        chrome.tabs.reload(tab.id);
    } else if (clicked) {
        // Send message that extension is disabled.
        chrome.tabs.sendMessage(tab.id, {
            name: 'ScriptDisable'
        });
    }
};

// When the extension is installed or upgraded ...
chrome.runtime.onInstalled.addListener(function() {
    // Replace all rules ...
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        // With a new rule ...
        chrome.declarativeContent.onPageChanged.addRules([{
            // That fires when a page's URL is 'http://agar.io/' ...
            conditions: [
                new chrome.declarativeContent.PageStateMatcher({
                    pageUrl: {
                        schemes: ['http', 'https'],
                        hostEquals: targetHost
                    }
                })
            ],
            // And shows the extension's page action.
            actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
    });
});

var urlsRedirect = [];

//https://www.emeraldchat.com/assets/application-0120efcaba9c0fdd85da45116f23024479dd3379acad4bed051c31e9fba4bf29.js

chrome.webRequest.onBeforeRequest.addListener(function (details) {
    if (isEnabled()) {
       return {redirectUrl: chrome.extension.getURL('/application-mod.js') };
    }
}, {
    urls: [
        '*://www.emeraldchat.com/assets/application-*.js'
    ]
},
["blocking"]);
/*
chrome.webRequest.onBeforeRequest.addListener(function (details) {
    if (isEnabled()) {
       return {redirectUrl: chrome.extension.getURL('/sw-mod.js') };
    }
}, {
    urls: [
        'https://www.emeraldchat.com/sw.js'
    ]
},
["blocking"]);*/


// Listener for page action icon click event.
chrome.pageAction.onClicked.addListener(function(tab) {
    store('enabled', !isEnabled());
    updateTabIcon(tab, true);
});

// Runtime listener.
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.name == 'ScriptRequest') {
        updateIcon(false);
        sendResponse(isEnabled());
    }
});
