/**
 * Created by zw on 2018/3/28.
 */
(function (p) {
    // p.extend({});
    // 向页面注入JS
    function injectJs() {
        var jsPath = 'inject.js';
        var temp = document.createElement('script');
        temp.onload = function () {
            // 放在页面不好看，执行完后移除掉
            this.parentNode.removeChild(this);
        };
        // 获得的地址类似：chrome-extension://edhipabdmodnbejacmmlaggpanjopico/inject.js
        temp.setAttribute('type', 'text/javascript');
        temp.src = rea.extension.getURL(jsPath);

        document.head.appendChild(temp);
    }

    function init() {
        rea.content.onReady(function () {
            // var t = setTimeout(function () {
            //     clearTimeout(t);
            injectJs();
            // }, 1);
        });


        rea.extension.onMessage.addListener(function (request, sender, sendResponse) {
            console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension", arguments);

            // request.cmd &&
            if (request.cmd == 'js') {
                //
            }
            sendResponse && sendResponse('@Content response.');
        });

        //rea.extension.sendMessage
        rea.content.sendBGMessage({'title': 'hello master,i come from content.'}, function (response) {
            console.log('recieve by BG response：' + response);
        });
    }

    init();
})(window);

//receive from injected-script
window.addEventListener("message", function (e) {
    //转发给bg
    rea.content.sendBGMessage({'type': '转发inject data to bg', 'data': arguments});
}, false);