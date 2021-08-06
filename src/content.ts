declare var chrome: any;

console.log("Auto TikTok Scroller Extension Is Running.");

let videosEle: (HTMLDivElement | HTMLVideoElement)[] = null;
let timeout = 7550;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

if (window.location.href === "https://www.tiktok.com/?addInfoMsg") {
  let div = document.createElement("div");
  let h1 = document.createElement("h1");
  let spanBig = document.createElement("span");
  let spanSmall = document.createElement("span");
  h1.innerText = "TikTok Extension Restarting...";
  spanBig.innerText = "Will restart scrolling in 7";
  spanSmall.innerText =
    "Delete '?addInfoMsg' from url to get rid of this popup.";
  div.appendChild(h1);
  div.appendChild(spanBig);
  div.appendChild(spanSmall);
  div.classList.add("infoMsg");
  div.style["zIndex"] = "10000";
  h1.style["fontSize"] = "4rem";
  spanBig.style["fontSize"] = "1rem";
  spanBig.style["marginRight"] = "10px";
  spanSmall.style["fontSize"] = "0.75rem";
  div.style["position"] = "absolute";
  div.style["justifyContent"] = "center";
  div.style["alignItems"] = "center";
  div.style["minWidth"] = "100%";
  div.style["background"] = "aliceblue";
  let interval = setInterval(() => {
    let num = parseInt(spanBig.innerText.split("").reverse()[0]) - 1;
    spanBig.innerText = "Will restart scrolling in " + num;
  }, 1000);
  setTimeout(() => {
    div.remove();
    clearInterval(interval);
  }, timeout);
  document.body.prepend(div);
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
  if (downBtn) {
    downBtn.click();
    await sleep(1600);
  }
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
    timeout,
  });
  window.location.href = "https://www.tiktok.com/?addInfoMsg";
}
