chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.contentScriptQuery === "sendImageUrl") {
      const url = 'https://4c35-140-136-63-20.ngrok-free.app/YTplugin/chrome_extension_image/imageReceiver.php'; // Replace with your PHP server URL
      fetch(url, {
        method: 'POST',
        body: JSON.stringify({imageUrl: request.imageUrl}),
        headers: {
          'Content-Type': 'application/json'
        },
      })
      .then(response => response.text())
      .then(text => sendResponse({response: text}))
      .catch(error => console.error('Error:', error));
      return true;  // Will respond asynchronously.
    }
  });
  