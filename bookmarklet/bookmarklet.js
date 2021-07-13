(async function () {
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function VideoDuration(duration, minusBy = 300) {
    return duration * 1000 - minusBy;
  }

  async function LoadVideos() {
    for (let i = 0; i < 4; i++) {
      let videos = Array.from(document.querySelectorAll(".lazyload-wrapper"));
      videos[videos.length - 1].scrollIntoView({
        block: "start",
        inline: "nearest",
      });
      await sleep(2000);
    }
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
    else return;
    await sleep(1000);
    video = document.querySelector("video");
  }
})();
