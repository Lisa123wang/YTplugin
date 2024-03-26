document.addEventListener('DOMContentLoaded', function() {
    const sendButton = document.getElementById('sendButton');
    sendButton.onclick = function() {
      const imageUrl = document.getElementById('imageUrl').value;
      chrome.runtime.sendMessage({
        contentScriptQuery: "sendImageUrl",
        imageUrl: imageUrl
      }, response => {
        alert("Server response: " + response.response);
      });
    };
  });
  