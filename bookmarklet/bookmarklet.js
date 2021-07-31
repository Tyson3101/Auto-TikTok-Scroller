(async function () {
  if (!window.location.host.toLowerCase().includes("tiktok.com"))
    return console.log("Auto-TikTok-Scroller Error: Not on TikTok website.");
  else console.log("Auto-TikTok-Scroller Log: Starting bookmarklet...");
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function VideoDuration(duration, minusBy = 300) {
    return duration * 1000 - minusBy;
  }
  if (document.querySelector(".lazyload-wrapper")) {
    document
      .querySelector(".lazyload-wrapper span.event-delegate-mask")
      ?.click();
  }
  await sleep(1000);
  let downBtn = document.querySelector(".arrow-right");
  let video = document.querySelector("video");
  console.log("Auto-TikTok-Scroller Log: Starting scrolling...");
  while (true) {
    await sleep(VideoDuration(video.duration, 1310));
    if (document.querySelector(".arrow-right")) downBtn.click();
    else return reload();
    await sleep(1600);
    video = document.querySelector("video");
  }
})();
