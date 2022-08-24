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

document.addEventListener("keydown", (e) => {
  if (!e.isTrusted) return;
  if (e.key.toLowerCase() === "s" && e.shiftKey) {
    e.preventDefault();
    applicationIsOn ? stopAutoScrolling() : startAutoScrolling();
  } else if (e.key.toLowerCase() === "f" && e.shiftKey) {
    removeComments = !removeComments;
    window.localStorage.setItem("removeComments", "true");
  }
});

function startAutoScrolling() {
  fullscreen = !!document.querySelector(CHECK_FULLSCREEN_SELCECTOR);
  if (!applicationIsOn) {
    applicationIsOn = true;
  }
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
}

startAutoScrolling();
showShortCutsOnStartUp();

(function loop() {
  (function getCurrentVideoAndFullscreenStatus() {
    if (applicationIsOn) {
      fullscreen = !!document.querySelector(CHECK_FULLSCREEN_SELCECTOR);
      document.querySelector("video")?.addEventListener("ended", endVideoEvent);
    }
  })();
  (function appendShortCutHelp() {
    const ShortCutHelp = [
      `<div class="tiktok-drf9az-DivKeyboardShortcutContentItem e1l04njg3 autoTikTok">Toggle On/Off Auto Scroller <h2>shift + s</h2></div>`,
      `<div class="tiktok-drf9az-DivKeyboardShortcutContentItem e1l04njg3 autoTikTok">Remove Fullscreen Coments <h2>shift + f</h2></div>`,
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
  })();
  (function removeCommentsFromDom() {
    removeComments = window.localStorage.getItem("removeComments") === "true";
    if (
      removeComments &&
      !!document.querySelector(CHECK_FULLSCREEN_SELCECTOR)
    ) {
      try {
        Array.from(
          document.querySelectorAll("[class*='DivContentContainer']")
        ).find((ele) =>
          ele.parentElement.querySelector("video")
        ).style.display = "none";
      } catch {}
    } else {
      try {
        Array.from(
          document.querySelectorAll("[class*='DivContentContainer']")
        ).find((ele) =>
          ele.parentElement.querySelector("video")
        ).style.display = "block";
      } catch {}
    }
  })();
  sleep(100).then(loop);
})();

function showShortCutsOnStartUp() {
  const rawHtmlString = `<div style="margin: 1vw; position: absolute; border: 2px soild black;width: fit-content;height: fit-content;background-color: rgb(238, 167, 167);box-shadow: 10px 10px 5px lightblue; z-index: 9999;" class="autoTikTok-shortcuts-popup">
      <h1>Auto TikTok Scroller Shortcuts&nbsp;</h1>
      <h3><i>${applicationIsOn ? "Scroller Status: On" : "Status: Off"}</i></h3>
      <h3><i>${
        removeComments
          ? "Fullscreen Comments Status: Removed"
          : "Status: Not Removed"
      }</i></h3>
      <div style="margin-left: 3vw;" class="autoTikTok-commands">
        <h2>Toggle Scroller: <code style="background-color: rgba(20,20,20, 0.2);" class="autoTikTok-command">shift + s</code></h2>
        <h2>Toggle Fullscreen Comments: <code style="background-color: rgba(20,20,20, 0.2);" class="autoTikTok-command">shift + f</code></h2>
      </div>
    </div>`;
  let parsedHtml = new DOMParser().parseFromString(rawHtmlString, "text/html");
  document.body.prepend(...parsedHtml.body.children);
  setTimeout(
    () => document.querySelector(".autoTikTok-shortcuts-popup")?.remove(),
    5000
  );
}
