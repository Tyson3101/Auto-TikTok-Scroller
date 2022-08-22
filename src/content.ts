const VIDEOS_LIST_SELECTOR = "[data-e2e='recommend-list-item-container']";
const NEXT_VIDEO_ARROW = "[data-e2e='arrow-right']";
const CHECK_FULLSCREEN_SELCECTOR = NEXT_VIDEO_ARROW;

const sleep = (milliseconds: number) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

// -------
let applicationIsOn = false;
let fullscreen = false;

chrome.runtime.onMessage.addListener(
  ({ start, stop }: { [key: string]: boolean }) => {
    if (start) {
      startAutoScrolling();
    }
    if (stop) stopAutoScrolling();
  }
);

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
  const VIDEOS_LIST = document.querySelectorAll(
    VIDEOS_LIST_SELECTOR
  ) as NodeListOf<HTMLVideoElement>;
  if (!applicationIsOn)
    return document.querySelector("video").removeEventListener("ended", this);
  if (fullscreen) {
    return (
      document.querySelector(NEXT_VIDEO_ARROW) as HTMLButtonElement
    )?.click();
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
