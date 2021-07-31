declare var chrome: any;

let videosEle: (HTMLDivElement | HTMLVideoElement)[] = null;

//@ts-ignore
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

chrome.runtime.onConnect.addListener(function (port) {
  if (port.name == "scroll") {
    port.onMessage.addListener(function (response) {
      if (
        response.url == window.location.href &&
        window.location.href.toLowerCase().includes("tiktok")
      ) {
        videosEle = [];
        StartScrolling(response.fullScreen as boolean);
      }
    });
  } else if (port.name == "stop") {
    videosEle = null!;
  }
});

function VideoDuration(duration: number, minusBy: number = 300): number {
  return duration * 1000 - minusBy;
}

function StartScrolling(fullScreen: boolean) {
  if (videosEle === null) {
    return;
  }
  if (!fullScreen) return noFullSreenScroll();
  else return fullScreenScroll();
}

async function noFullSreenScroll() {
  videosEle = Array.from(
    document.getElementsByClassName("lazyload-wrapper")
  ) as HTMLDivElement[];
  let interval = setInterval(() => {
    if (videosEle === null) return clearInterval(interval);
    videosEle.push(
      ...(
        Array.from(
          document.getElementsByClassName("lazyload-wrapper")
        ) as HTMLDivElement[]
      ).slice(0, 30)
    );
  }, 30000);
  const indexOfInitialVid = videosEle.findIndex(() =>
    videosEle.find((ele) => ele.querySelector("video") != null)
  );
  if (document.querySelector("close")) {
    (document.querySelector("close") as HTMLImageElement).click();
  }
  await sleep(1000);
  for (let i = indexOfInitialVid + 1; i < videosEle?.length ?? 0; i++) {
    if (videosEle === null) return;
    if (document.querySelector("close")) {
      (document.querySelector("close") as HTMLImageElement).click();
      await sleep(1000);
    }
    videosEle?.[i].scrollIntoView({
      inline: "nearest",
      block: "center",
      behavior: "smooth",
    });
    await sleep(1000);
    let video = videosEle?.[i].querySelector("video");
    if (video) {
      await sleep(VideoDuration(video.duration));
    }
  }
}

async function fullScreenScroll() {
  if (videosEle === null) return;
  if (document.querySelector(".lazyload-wrapper")) {
    (
      document.querySelector(
        ".lazyload-wrapper span.event-delegate-mask"
      ) as HTMLSpanElement
    )?.click();
  }
  await sleep(1000);
  let downBtn = document.querySelector(".arrow-right") as HTMLImageElement;
  let video = document.querySelector("video");
  while (true) {
    if (videosEle === null) return;
    await sleep(VideoDuration(video.duration, 1310));
    if (document.querySelector(".arrow-right")) downBtn.click();
    else return reload();
    await sleep(1600);
    video = document.querySelector("video");
  }
}

function reload() {
  chrome.extension.sendMessage({
    start: true,
    fullScreen: true,
    timeout: 4000,
  });
  window.location.href = "https://www.tiktok.com/";
}
