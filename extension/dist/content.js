const VIDEOS_LIST_SELECTOR = "[data-e2e='recommend-list-item-container']";
const NEXT_VIDEO_ARROW = "[data-e2e='arrow-right']";
const CHECK_FULLSCREEN_SELCECTOR = NEXT_VIDEO_ARROW;
const sleep = (milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
};
// -------
let applicationIsOn = false;
let fullscreen = false;
let removeComments = false;
(function initiate() {
    chrome.storage.local.get(["applicationIsOn"], (result) => {
        if (result.applicationIsOn == null) {
            return startAutoScrolling();
        }
        if (result.applicationIsOn)
            startAutoScrolling();
    });
    chrome.storage.local.get(["removeComments"], (result) => {
        removeComments = !!result.removeComments;
    });
})();
document.addEventListener("keydown", (e) => {
    if (!e.isTrusted)
        return;
    if (e.key.toLowerCase() === "s" && e.shiftKey) {
        applicationIsOn ? stopAutoScrolling() : startAutoScrolling();
    }
    else if (e.key.toLowerCase() === "f" && e.shiftKey) {
        removeComments = !removeComments;
        chrome.storage.local.set({ removeComments: removeComments });
    }
});
chrome.runtime.onMessage.addListener(({ toggle }) => {
    if (toggle) {
        chrome.storage.local.get(["applicationIsOn"], (result) => {
            if (!result.applicationIsOn)
                startAutoScrolling();
            if (result.applicationIsOn)
                stopAutoScrolling();
        });
    }
});
function startAutoScrolling() {
    fullscreen = !!document.querySelector(CHECK_FULLSCREEN_SELCECTOR);
    if (!applicationIsOn) {
        applicationIsOn = true;
        chrome.storage.local.set({ applicationIsOn: true });
    }
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
    if (nextVideo) {
        nextVideo.scrollIntoView({
            behavior: "smooth",
            inline: "center",
            block: "center",
        });
    }
}
function stopAutoScrolling() {
    applicationIsOn = false;
    chrome.storage.local.set({ applicationIsOn: false });
}
(function loop() {
    (function getCurrentVideoAndFullscreenStatus() {
        fullscreen = !!document.querySelector(CHECK_FULLSCREEN_SELCECTOR);
        if (applicationIsOn) {
            document.querySelector("video")?.addEventListener("ended", endVideoEvent);
        }
    })();
    (function appendShortCutHelp() {
        const ShortCutHelp = [
            `<div class="tiktok-drf9az-DivKeyboardShortcutContentItem e1l04njg3 autoTikTok">Toggle On/Off Auto Scroller <h2>shift + s</h2></div>`,
            `<div class="tiktok-drf9az-DivKeyboardShortcutContentItem e1l04njg3 autoTikTok">Toggle Fullscreen Coments <h2>shift + f</h2></div>`,
        ];
        const element = document.querySelector("[class*='DivKeyboardShortcutContent']");
        if (element && !element.querySelector(".autoTikTok")) {
            ShortCutHelp.forEach((htmlString) => {
                let divEle = new DOMParser().parseFromString(htmlString, "text/html");
                element.append(...divEle.body.children);
            });
        }
    })();
    (function removeCommentsFromDom() {
        const comments = Array.from(document.querySelectorAll("[class*='DivContentContainer']")).find((ele) => ele.querySelector("[class*='DivCommentListContainer']"));
        const commentsList = comments?.querySelector("[class*='DivCommentListContainer']");
        if (removeComments && fullscreen) {
            try {
                if (comments) {
                    if (commentsList)
                        commentsList.style.overflow = "hidden auto";
                    comments.style.display = "none";
                }
            }
            catch { }
        }
        else {
            try {
                if (comments) {
                    if (commentsList)
                        commentsList.style.overflow = "hidden auto";
                    comments.style.display = "";
                }
            }
            catch { }
        }
    })();
    sleep(100).then(loop);
})();
