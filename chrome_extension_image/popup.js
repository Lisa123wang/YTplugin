document.addEventListener('DOMContentLoaded', function() {
  const sendButton = document.getElementById('sendButton');
  const modal = document.getElementById('myModal');
  const span = document.getElementsByClassName("close")[0];
  const modalText = document.getElementById("modalText");

  sendButton.onclick = function() {
      const imageUrl = document.getElementById('imageUrl').value;
      chrome.runtime.sendMessage({
          contentScriptQuery: "sendImageUrl",
          imageUrl: imageUrl
      }, response => {
          if (response && response.response) {
              // Assume the response is already parsed; if not, parse it here
              let responseData = response.response;
              if (typeof responseData === 'string') {
                  responseData = JSON.parse(responseData);
              }

              // Check if the data and text properties exist before attempting to replace
              if (responseData.data && responseData.data.text) {
                  const formattedText = responseData.data.text.replace(/\n/g, "<br>");
                  modalText.innerHTML = "Server response: <br>" + formattedText;
              } else {
                  modalText.innerHTML = "The server response did not contain the expected data.";
              }
          } else {
              modalText.innerHTML = "Server response was empty or in an unexpected format.";
          }
          
          modal.style.display = "block";
      });
  };

  span.onclick = function() {
      modal.style.display = "none";
  };

  window.onclick = function(event) {
      if (event.target == modal) {
          modal.style.display = "none";
      }
  };
});
