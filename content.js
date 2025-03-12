chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "kaishaku-renshu") {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      const tab = tabs[0];
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: getSelectedText
      }, function(results) {
        const selectedText = results[0].result;
        chrome.runtime.sendMessage({action: "openPopup", selectedText: selectedText});
      });
    });
  }
});

function getSelectedText() {
  return window.getSelection().toString();
}
