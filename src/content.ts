const VIDEOS_LIST_SELECTOR =
  "#app > div.tiktok-19fglm-DivBodyContainer.e1irlpdw0 > div.tiktok-1id9666-DivMainContainer.ec6jhlz0 > div:nth-child(1)";
const CHECK_FULLSCREEN_SELCECTOR =
  "#app > div.tiktok-19fglm-DivBodyContainer.e1irlpdw0 > div.tiktok-7t2h2f-DivBrowserModeContainer.e11s2kul0 > div.tiktok-5uccoo-DivVideoContainer.e11s2kul27 > div.tiktok-7tjqm6-DivBlurBackground.e11s2kul8";
const NEXT_VIDEO_ARROW = "[data-e2e='arrow-right']";

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
  applicationIsOn = true;
  fullscreen = !!document.querySelector(CHECK_FULLSCREEN_SELCECTOR);
  getCurrentVideoAndFullscreenStatus();
}

async function getCurrentVideoAndFullscreenStatus() {
  fullscreen = !!document.querySelector(CHECK_FULLSCREEN_SELCECTOR);
  document.querySelector("video")?.addEventListener("ended", endVideoEvent);
  await sleep(500);
  if (applicationIsOn) getCurrentVideoAndFullscreenStatus();
}

async function endVideoEvent() {
  const VIDEOS_LIST = document.querySelector(
    VIDEOS_LIST_SELECTOR
  ) as HTMLVideoElement;
  if (!applicationIsOn)
    return document.querySelector("video").removeEventListener("ended", this);
  if (fullscreen) {
    return (
      document.querySelector(NEXT_VIDEO_ARROW) as HTMLButtonElement
    )?.click();
  }
  let index = Array.from(VIDEOS_LIST.children).findIndex((ele) =>
    ele.querySelector("video")
  );
  let nextVideo = Array.from(VIDEOS_LIST.children)[index + 1];
  nextVideo.scrollIntoView({
    behavior: "smooth",
    inline: "center",
    block: "center",
  });
}

function stopAutoScrolling() {
  applicationIsOn = false;
}
