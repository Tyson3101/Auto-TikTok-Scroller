declare var chrome: any;

document.getElementById("start").onclick = () => {
  chrome.extension.sendMessage({
    start: true,
    fullScreen: (document.getElementById("fullscreen") as HTMLInputElement)
      .checked,
  });
};

document.getElementById("stop").onclick = () => {
  chrome.extension.sendMessage({
    stop: true,
  });
};
