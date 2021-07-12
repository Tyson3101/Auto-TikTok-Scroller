declare var chrome: any;

document.getElementById("start").onclick = () => {
  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    let port = chrome.tabs.connect(tabs[0].id, { name: "scroll" });
    port.postMessage({
      url: tabs[0].url,
      fullScreen: (document.getElementById("fullscreen") as HTMLInputElement)
        .checked,
    });
  });
};
declare var chrome: any;

document.getElementById("stop").onclick = () => {
  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    let port = chrome.tabs.connect(tabs[0].id, { name: "stop" });
    port.postMessage({ url: tabs[0].url });
  });
};
