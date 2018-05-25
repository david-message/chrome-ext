(function (p) {
    var ws;//websocket实例
    var wsUrl;
    var lockReconnect = false;//避免重复连接
    var receiveCallbackFun = null;

    function createWebSocket(url, cbFun) {
        wsUrl = url;
        if (cbFun) {
            receiveCallbackFun = cbFun;
        }
        try {
            ws = new WebSocket(url);
            console.log(ws);
            initEventHandle();
        } catch (e) {
            reconnect();
        }
    }

    function initEventHandle() {
        ws.onclose = function (e) {
            console.log("close", e);
            reconnect();
        };
        ws.onerror = function (e) {
            console.log("error", e);
            reconnect();
        };
        ws.onopen = function () {
            console.log("open");
            //心跳检测重置
            heartCheck.reset().start();
        };
        ws.onmessage = function (event) {
            //如果获取到消息，心跳检测重置
            //拿到任何消息都说明当前连接是正常的
            heartCheck.reset().start();

            receiveCallbackFun && receiveCallbackFun(event);
        }
    }

    function reconnect() {
        if (lockReconnect) return;
        lockReconnect = true;
        //没连接上会一直重连，设置延迟避免请求过多
        setTimeout(function () {
            createWebSocket(wsUrl);
            lockReconnect = false;
        }, 2000);
    }


    //心跳检测
    var heartCheck = {
        timeout: 60000,//60秒
        timeoutObj: null,
        serverTimeoutObj: null,
        reset: function () {
            clearTimeout(this.timeoutObj);
            clearTimeout(this.serverTimeoutObj);
            return this;
        },
        start: function () {
            var self = this;
            this.timeoutObj = setTimeout(function () {
                //这里发送一个心跳，后端收到后，返回一个心跳消息，onmessage拿到返回的心跳就说明连接正常
                ws && ws.send("HeartBeat");
                self.serverTimeoutObj = setTimeout(function () {//如果超过一定时间还没重置，说明后端主动断开了
                    ws && ws.close(3001, 'bye');//如果onclose会执行reconnect，我们执行ws.close()就行了.如果直接执行reconnect 会触发onclose导致重连两次
                    lockReconnect = true;
                    ws = null;
                }, self.timeout)
            }, this.timeout)
        }
    };

    var server = {
        newWS: function (url, recFun) {
            createWebSocket(url, recFun);
        },
        sendMessage: function (message) {
            if (ws == null) {
                return false;
            }
            try {
                ws.send(message);
                console.log("send success");
                return true;
            } catch (error) {
                console.log("send retry.");
                server.sendMessage(message);//retry
            }
        },
        getWebSocket: function () {
            return ws;
        }
    };

    if (p.ws === undefined) {
        p.ws = server;
    }
    return server;
})(window);