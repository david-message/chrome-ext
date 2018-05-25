/**
 * Created by zw on 2018/3/28.
 * content js
 */

(function (p) {
    (function () {
        //send to content
        window.postMessage({
            "test": 'hello world @inject',
            'title': document.title
        }, location.protocol + '//' + location.host);// *
    })();

})(window);