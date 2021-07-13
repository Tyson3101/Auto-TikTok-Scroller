(async function () {
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function VideoDuration(duration, minusBy = 300) {
    return duration * 1000 - minusBy;
  }

  async function RefreshPage() {
    const closeBtn = document.querySelector(".close");
    const currentVideo = document.querySelector("span.event-delegate-mask");

    closeBtn?.click();
    await sleep(1200);
    currentVideo?.click();
    await sleep(1000);
    document.querySelector(".arrow-right")?.click();
    await sleep(1000);
  }
  if (document.querySelector(".lazyload-wrapper")) {
    document
      .querySelector(".lazyload-wrapper span.event-delegate-mask")
      ?.click();
  }
  await sleep(1000);
  let downBtn = document.querySelector(".arrow-right");
  let video = document.querySelector("video");
  while (true) {
    await sleep(VideoDuration(video.duration, 740));
    if (document.querySelector(".arrow-right")) downBtn.click();
    else await RefreshPage();
    await sleep(1000);
    video = document.querySelector("video");
  }
})();
