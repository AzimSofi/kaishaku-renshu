chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "kaishaku-renshu",
    title: "Check Interpretation",
    contexts: ["selection"]
  });
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.action == "openPopup") {
      chrome.action.openPopup();
      chrome.storage.sync.set({ selectedText: request.selectedText });
    }
  }
);
