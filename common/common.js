(function (f) {
    f.rea = {
        globals: window, extend: function (parent) {
            var d = function (parentStruct, extStruct) {
                for (var prepo in parentStruct)if (parentStruct.hasOwnProperty(prepo))if (Object.getOwnPropertyDescriptor(parentStruct, prepo).get) extStruct.__defineGetter__(prepo, parentStruct.__lookupGetter__(prepo)); else {
                    var pValue = parentStruct[prepo], pType = typeof pValue;
                    "undefined" != pType && (null === pValue ? extStruct[prepo] = pValue : "object" == pType ? (extStruct[prepo] = extStruct[prepo] || {}, d(pValue, extStruct[prepo])) : "array" == pType ? (extStruct[prepo] = extStruct[prepo] || [], d(pValue, extStruct[prepo])) : extStruct[prepo] = pValue)
                }
            };
            d(parent, f.rea)
        }
    };
    f.rea.extend({
        page: {
            reload: function () {
                window.location.reload()
            }
        }, content: {
            onReady: function (cbFun) {
                var delayedFun = function () {//延时执行
                    var t = setTimeout(function () {
                        clearTimeout(t);
                        cbFun();
                    }, 1);
                };

                var d = function () {
                    "prerender" !== document.webkitVisibilityState &&
                    (document.removeEventListener("webkitvisibilitychange", d, !1), delayedFun())
                };
                "prerender" !== document.webkitVisibilityState ? delayedFun() : document.addEventListener("webkitvisibilitychange", d, !1)
            },
            sendBGMessage: function (a, d) {
                return chrome.runtime.sendMessage(a, d)
            }
        }, runtime: function () {
            var a = {};
            a.__defineGetter__("lastError", function () {
                return chrome.runtime.lastError
            });
            a.__defineGetter__("id", function () {
                return chrome.runtime.id
            });
            a.__defineGetter__("short_id", function () {
                return a.id.replace(/[^0-9a-zA-Z]/g, "").substr(0, 4)
            });
            return a
        }(), extension: {
            getURL: function (a) {
                return chrome.runtime.getURL(a)
            },
            // sendMessage: function (a, d) {
            //     return chrome.runtime.sendMessage(a, d)
            // },
            onMessage: {
                addListener: function (a) {
                    return chrome.runtime.onMessage.addListener(a)
                }
            }, connect: function (a) {
                return chrome.runtime.connect({name: a})
            }
        }
    });
})(window);
