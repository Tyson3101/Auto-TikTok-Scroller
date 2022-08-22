const VIDEOS_LIST_SELECTOR = "[data-e2e='recommend-list-item-container']";
const NEXT_VIDEO_ARROW = "[data-e2e='arrow-right']";
const CHECK_FULLSCREEN_SELCECTOR = NEXT_VIDEO_ARROW;
const sleep = (milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
};
// -------
let applicationIsOn = false;
let fullscreen = false;
chrome.runtime.onMessage.addListener(({ start, stop }) => {
    if (start) {
        startAutoScrolling();
    }
    if (stop)
        stopAutoScrolling();
});
function startAutoScrolling() {
    applicationIsOn = true;
    fullscreen = !!document.querySelector(CHECK_FULLSCREEN_SELCECTOR);
    getCurrentVideoAndFullscreenStatus();
}
async function getCurrentVideoAndFullscreenStatus() {
    fullscreen = !!document.querySelector(CHECK_FULLSCREEN_SELCECTOR);
    document.querySelector("video")?.addEventListener("ended", endVideoEvent);
    await sleep(500);
    if (applicationIsOn)
        getCurrentVideoAndFullscreenStatus();
}
async function endVideoEvent() {
    const VIDEOS_LIST = document.querySelectorAll(VIDEOS_LIST_SELECTOR);
    if (!applicationIsOn)
        return document.querySelector("video").removeEventListener("ended", this);
    if (fullscreen) {
        return document.querySelector(NEXT_VIDEO_ARROW)?.click();
    }
    let index = Array.from(VIDEOS_LIST).findIndex((ele) => ele.querySelector("video"));
    let nextVideo = Array.from(VIDEOS_LIST)[index + 1];
    nextVideo.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "center",
    });
}
function stopAutoScrolling() {
    applicationIsOn = false;
}
