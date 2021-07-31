declare var chrome: any;

let started = false;

chrome.extension.onMessage.addListener(async (request: any) => {
  if (request.start) {
    if (request.timeout) setTimeout(() => start(request), request.timeout);
    else start(request);
  } else if (request.stop) {
    chrome.tabs.query(
      { currentWindow: true, active: true },
      function (tabs: any) {
        let port = chrome.tabs.connect(tabs[0].id, { name: "stop" });
        port.postMessage({ url: tabs[0].url });
      }
    );
  }
});

function start(request: any) {
  started = true;
  chrome.tabs.query(
    { currentWindow: true, active: true },
    function (tabs: any) {
      if (tabs[0].url.toLowerCase().includes("tiktok")) {
        let port = chrome.tabs.connect(tabs[0].id, { name: "scroll" });
        port.postMessage({
          url: tabs[0].url,
          fullScreen: request.fullScreen,
        });
      } else {
        started = false;
        return;
      }
    }
  );
}
