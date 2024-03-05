chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action == "fetchDetails") {
      // 使用document.title獲取影片標題並去除" - YouTube"
      const title = document.title.replace(' - YouTube', '');
      // 使用meta標籤獲取影片標題作為備選方案
      const metaTitle = document.querySelector('meta[name="title"]') ? document.querySelector('meta[name="title"]').getAttribute('content') : '';
      // 直接從頁面中抓取影片描述
      const description = document.querySelector('meta[name="description"]') ? document.querySelector('meta[name="description"]').getAttribute('content') : '';
      sendResponse({title: title || metaTitle, description: description});
  }
});
