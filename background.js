chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "fetchData") {
    fetch(message.url)
      .then(response => response.text())
      .then(data => sendResponse({ data }))
      .catch(error => console.error('Error:', error));
    return true;  // Keep the message channel open for sendResponse
  }
});
