(function (p) {
    var optionConfig = {};
    p.extend({
        // getCount: function () {
        //     return count;
        // },
        notify: function (title, content) {
            return chrome.notifications.create(null, {
                type: 'basic',
                iconUrl: 'logo/icon_64.png',
                title: title,
                message: content
            });
        },
        sendToContent: function (message, callback) {
            chrome.tabs.getSelected(function (tab) {
                // chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                console.log(tab)
                tab && tab.id != -1 && chrome.tabs.sendMessage(tab.id, message, function (response) {
                    if (callback) callback(response);
                });
            });
        },
        // setBadge: function (count) {
        //     var content = 0;
        //     if (count > 0) {
        //         if (count < 9999) {
        //             content = count;
        //         } else {
        //             content = 9999;
        //         }
        //     }
        //     if (typeof content != 'string') {
        //         content = content.toString();
        //     }
        //     chrome.browserAction.setBadgeText({text: content});
        //     chrome.browserAction.setBadgeBackgroundColor({color: [255, 0, 0, 255]});//ARGB
        // },
        syncOptionConfig: function (key, cbFun) {
            chrome.storage.sync.get(key, function (items) {
                cbFun && cbFun(items);
            });
        }, getConfig: function () {
            return optionConfig;
        }, setConfig: function (cfg) {
            optionConfig = cfg;
        }
    });

    // Registry.require(["pingpong"], function () {
    //     var n  = Registry.get("pingpong");
    //     n.ping(function () {
    //         console.log('SuccessPing',arguments)
    //     }, function () {
    //         console.log('FailPing',arguments)
    //     })
    // });

    // chrome.runtime.onInstalled.addListener(function () {
    //     chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
    //         chrome.declarativeContent.onPageChanged.addRules([
    //             {
    //                 conditions: [
    //                     // 只有打开百度才显示pageAction
    //                     new chrome.declarativeContent.PageStateMatcher({pageUrl: {urlContains: 'baidu.com'}})
    //                 ],
    //                 actions: [new chrome.declarativeContent.ShowPageAction()]
    //             }
    //         ]);
    //     });
    // });

    // var timer = function () {
    //     t = window.setTimeout(function () {
    //         null != t && window.clearTimeout(t);
    //         t = null;
    //
    //         p.setBadge(count++);
    //
    //         timer();
    //
    //         // if (count % 5 == 0) {
    //         //     p.notify('Test' + count, 'Time:' + new Date().getTime());
    //         // }
    //
    //
    //         //page action
    //         // var views = chrome.extension.getViews({type: 'popup'});
    //         // views.every(function (v) {
    //         //     console.log(v.location.href);
    //         // });
    //     }, 2E3);
    // };
    // timer();

    (function () {
        // 监听来自content-script的消息
        rea.extension.onMessage.addListener(function (request, sender, sendResponse) {
            console.log('from content to BG:', request, sender, sendResponse);
            rea.sendMessageToRemote(JSON.stringify(request));
            sendResponse('send with BG：' + JSON.stringify(request));
        });
    })();
})(window.rea);

function syncOptionConfig() {
    console.log('syncOptionConfig')
    rea.syncOptionConfig(["host", "filter", "showImage"], function (cfg) {
        rea.setConfig(cfg);
    })

}

function sendContent(message, callback) {
    console.log('invoke sendContent')
    return window.rea.sendToContent(message, callback);
}

// web请求监听，最后一个参数表示阻塞式，需单独声明权限：webRequestBlocking
chrome.webRequest.onBeforeRequest.addListener(function (details) {
    // cancel 表示取消本次请求
    if (!rea.getConfig()['showImage'] && details.type == 'image') {
        return {cancel: true};
    }

    // rea.notify('Request:' + JSON.stringify(details));
    console.log(details);

    if (details.type == 'media') {
        rea.notify('Media', 'mediaUrl:' + details.url)
    }
}, {urls: ["<all_urls>"]}, ["blocking"]);

(function (p) {
    var host = "127.0.0.1:8088";
    var servHost = "ws://" + host + "/ws";
    ws.newWS(servHost, function (event) {
        console.log(event);
        //
    });  //获得WebSocket对象

    p.extend({
        sendMessageToRemote: function (message) {
            return ws.sendMessage(message);
        }
    });
})(window.rea);
