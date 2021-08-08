chrome.extension.onMessage.addListener(async (request) => {
    if (request.start) {
        start(request);
    }
    else if (request.stop) {
        chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
            let port = chrome.tabs.connect(tabs[0].id, { name: "stop" });
            port.postMessage({ url: tabs[0].url });
        });
    }
});
function start(request) {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        if (tabs[0].url.toLowerCase().includes("tiktok")) {
            let port = chrome.tabs.connect(tabs[0].id, { name: "scroll" });
            port.postMessage({
                url: tabs[0].url,
                fullScreen: request.fullScreen,
            });
        }
        else {
            return;
        }
    });
}
