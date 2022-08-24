const errMsg = document.querySelector("#error");
const toggleBtn = document.querySelector(".toggleBtn");
chrome.storage.onChanged.addListener((result) => {
    changeToggleButton(result.applicationIsOn.newValue);
});
chrome.storage.local.get(["applicationIsOn"], (result) => {
    changeToggleButton(result.applicationIsOn);
});
document.onclick = (e) => {
    if (e.target.classList.contains("toggleBtn"))
        chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
            if (tabs[0]?.url?.includes("tiktok")) {
                chrome.tabs.sendMessage(tabs[0].id, { toggle: true });
            }
            else
                errMsg.innerText = "Only works for Tiktok!";
        });
    if (e.target.id === "shortCutBtn") {
        document.querySelector(".shortCut").classList.toggle("remove");
    }
};
function changeToggleButton(result) {
    if (result) {
        toggleBtn.innerText = "Stop";
        toggleBtn.classList.remove("start");
        toggleBtn.classList.add("stop");
        chrome.action.setIcon({ path: "../img/tiktokIcon128.png" });
    }
    if (!result) {
        toggleBtn.innerText = "Start";
        toggleBtn.classList.add("start");
        toggleBtn.classList.remove("stop");
        chrome.action.setIcon({ path: "../img/tiktokIcon128Off.png" });
    }
}
