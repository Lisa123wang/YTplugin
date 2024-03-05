// popup.js
document.addEventListener('DOMContentLoaded', function() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {action: "fetchDetails"}, function(response) {
          if (response) {
              document.getElementById('title').textContent = response.title || "無法獲取標題";
              document.getElementById('description').textContent = response.description || "無法獲取描述";
          }
      });
  });
});
