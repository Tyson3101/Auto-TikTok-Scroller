const errMsg = document.querySelector("#error") as HTMLParagraphElement;

document.onclick = (e: Event) => {
  if ((e.target as HTMLButtonElement).id === "stop")
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.url?.includes("tiktok"))
        chrome.tabs.sendMessage(tabs[0].id, {
          start: false,
          stop: true,
        });
      else errMsg.innerText = "Only works for Tiktok!";
    });
  if ((e.target as HTMLButtonElement).id === "start") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.url?.includes("tiktok"))
        chrome.tabs.sendMessage(tabs[0].id, {
          start: true,
          stop: false,
        });
      else errMsg.innerText = "Only works for Tiktok!";
    });
  }
};
