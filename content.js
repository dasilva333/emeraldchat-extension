
// Messages listener.
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.name == 'ScriptDisable') {
        // Reload page.
        window.postMessage('ScriptDisable', this.location);
    }
});

function injectScript(file, node) {
    var th = document.getElementsByTagName(node)[0];
    var s = document.createElement('script');
    s.setAttribute('type', 'text/javascript');
    s.setAttribute('src', file);
    th.appendChild(s);
}
injectScript( chrome.extension.getURL('/inject.js'), 'body');

function injectFavIcon(file, node) {
    var th = document.getElementsByTagName('head')[0];
    var s = document.createElement('link');
    s.setAttribute('rel', 'icon');
    s.setAttribute('href', chrome.extension.getURL('/favicon_alt.ico'));
    s.setAttribute('id',  "link_favicon");
    th.appendChild(s);
}
injectFavIcon();