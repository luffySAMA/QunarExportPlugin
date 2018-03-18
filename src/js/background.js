chrome.runtime.onInstalled.addListener(() => {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          // 只有打开携程才显示pageAction
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { urlContains: 'ctrip.com' }
          })
        ],
        actions: [new chrome.declarativeContent.ShowPageAction()]
      }
    ]);
  });
});
/**
 * 添加按钮点击事件
 */
chrome.pageAction.onClicked.addListener(() => {
  // 向content-script发送下载的命令
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'download' }, function(response) {
      console.log(response.farewell);
    });
  });
});

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
  console.log(request);
  if (request.type == 'notification') {
    var notification = webkitNotifications.createNotification('assets/logo.png', request.title, request.message);
    notification.show();

    sendResponse('ok');
  }
});
