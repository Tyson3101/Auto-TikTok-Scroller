const fullscreenEle = document.querySelector("#fullscreen");
const errMsg = document.querySelector("#error");
document.onclick = (e) => {
    if (e.target.id === "stop")
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]?.url?.includes("tiktok"))
                chrome.tabs.sendMessage(tabs[0].id, {
                    start: false,
                    stop: true,
                });
            else
                errMsg.innerText = "Only works for Tiktok!";
        });
    if (e.target.id === "start") {
        let fullscreen = fullscreenEle.checked;
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]?.url?.includes("tiktok"))
                chrome.tabs.sendMessage(tabs[0].id, {
                    start: true,
                    stop: false,
                    fullscreen,
                });
            else
                errMsg.innerText = "Only works for Tiktok!";
        });
    }
};
