(async function () {
  function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function VideoDuration(duration: number, minusBy: number = 300): number {
    return duration * 1000 - minusBy;
  }

  async function RefreshPage() {
    const closeBtn = document.querySelector(".close") as HTMLImageElement;
    const currentVideo = document.querySelector(
      "span.event-delegate-mask"
    ) as HTMLSpanElement;

    closeBtn?.click();
    await sleep(3000);
    currentVideo?.click();
    await sleep(1000);
    (document.querySelector(".arrow-right") as HTMLImageElement)?.click();
    await sleep(1000);
  }
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
    await sleep(VideoDuration(video.duration, 740));
    if (document.querySelector(".arrow-right")) downBtn.click();
    else await RefreshPage();
    await sleep(1000);
    video = document.querySelector("video");
  }
})();
