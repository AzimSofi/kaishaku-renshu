chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "kaishaku-renshu",
    title: "Check Interpretation",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "kaishaku-renshu") {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      const tab = tabs[0];
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: () => {
          return window.getSelection().toString();
        }
      }, function(results) {
        if (results && results.length > 0) {
          const selectedText = results[0].result;
          chrome.action.openPopup();
          chrome.storage.sync.set({ selectedText: selectedText });
        }
      });
    });
  }
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.action == "openPopup") {
      chrome.action.openPopup();
      chrome.storage.sync.set({ selectedText: request.selectedText });
    }
  }
);
