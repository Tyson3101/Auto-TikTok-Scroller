const VIDEOS_LIST_SELECTOR = "[data-e2e='recommend-list-item-container']";
const NEXT_VIDEO_ARROW = "[data-e2e='arrow-right']";
const CHECK_FULLSCREEN_SELCECTOR = NEXT_VIDEO_ARROW;
const sleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};
// -------
let applicationIsOn = false;
let fullscreen = false;

function startAutoScrolling() {
  fullscreen = !!document.querySelector(CHECK_FULLSCREEN_SELCECTOR);
  if (!applicationIsOn) {
    applicationIsOn = true;
    getCurrentVideoAndFullscreenStatus();
  }
}
async function getCurrentVideoAndFullscreenStatus() {
  fullscreen = !!document.querySelector(CHECK_FULLSCREEN_SELCECTOR);
  document.querySelector("video")?.addEventListener("ended", endVideoEvent);
  await sleep(500);
  if (applicationIsOn) getCurrentVideoAndFullscreenStatus();
}
async function endVideoEvent() {
  const VIDEOS_LIST = document.querySelectorAll(VIDEOS_LIST_SELECTOR);
  if (!applicationIsOn)
    return document.querySelector("video").removeEventListener("ended", this);
  if (fullscreen) {
    return document.querySelector(NEXT_VIDEO_ARROW)?.click();
  }
  let index = Array.from(VIDEOS_LIST).findIndex((ele) =>
    ele.querySelector("video")
  );
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

startAutoScrolling();

(function showShortCut() {
  const rawHtmlString = `<div style="margin: 1vw; position: absolute; border: 2px soild black;width: fit-content;height: fit-content;background-color: rgb(238, 167, 167);box-shadow: 10px 10px 5px lightblue; z-index: 1001;" class="autoTikTok-shortcuts-popup">
      <h1>Auto TikTok Scroller Shortcuts&nbsp;</h1>
      <div style="margin-left: 3vw;" class="autoTikTok-commands">
        <h2>Start: <code style="background-color: rgba(20,20,20, 0.2);" class="autoTikTok-command">shift + a</code></h2>
        <h2>Stop: <code style="background-color: rgba(20,20,20, 0.2);" class="autoTikTok-command">shift + s</code></h2>
      </div>
    </div>`;
  let parsedHtml = new DOMParser().parseFromString(rawHtmlString, "text/html");
  document.body.prepend(...parsedHtml.body.children);
  setTimeout(
    () => document.querySelector(".autoTikTok-shortcuts-popup")?.remove(),
    5000
  );
})();

function appendShortCutHelp() {
  const ShortCutHelp = [
    `<div class="tiktok-drf9az-DivKeyboardShortcutContentItem e1l04njg3 autoTikTok">Start Auto Scroller <h2>shift + a</h2></div>`,
    `<div class="tiktok-drf9az-DivKeyboardShortcutContentItem e1l04njg3 autoTikTok">Stop Auto Scroller <h2>shift + s</h2></div>`,
  ];
  const element = document.querySelector(
    "[class*='DivKeyboardShortcutContent']"
  );
  if (element && !element.querySelector(".autoTikTok")) {
    ShortCutHelp.forEach((htmlString) => {
      let divEle = new DOMParser().parseFromString(htmlString, "text/html");
      element.append(...divEle.body.children);
    });
  }
  sleep(500).then(appendShortCutHelp);
}

document.addEventListener("keydown", (e) => {
  if (!e.isTrusted) return;
  if (e.key.toLowerCase() === "a" && e.shiftKey) {
    e.preventDefault();
    startAutoScrolling();
  } else if (e.key.toLowerCase() === "s" && e.shiftKey) {
    e.preventDefault();
    stopAutoScrolling();
  }
});
