(function (p) {
    var RegFun = function () {
        var cbQueue = [], fileMap = {}, fileContentMap = {},
            reqJs = function (fileList, cbFun) {
                fileList = "string" === typeof fileList ? [fileList] : fileList;
                var tryCount = 1, checkFile = function () {
                    return fileList.every(function (file) {
                        return !!fileMap[file]
                    })
                }, preCall = function () {
                    cbQueue.push(function () {
                        checkFile() ? cbFun() : preCall()
                    })
                }, callFun = function (a) {
                    0 == --tryCount && cbFun && ( checkFile() ? cbFun() : preCall())
                };
                fileList.forEach(function (jsFile) {
                    void 0 === fileMap[jsFile] && (fileMap[jsFile] = null, funExport.loadFile(rea.extension.getURL(jsFile + ".js"), function () {
                        callFun(jsFile)
                    }), tryCount++)
                });
                callFun()
            },
            funExport = {
                init: function () {
                },
                require: function (fileList, cbFun) {
                    return reqJs(fileList, cbFun)
                },
                register: function (name, cbFun) {
                    if (!fileMap[name]) {
                        var cbq = cbQueue;
                        for (fileMap[name] = cbFun, cbQueue = []; cbq.length;) {
                            cbq.pop()();
                        }
                    }
                },
                getRaw: function (file) {
                    var fileContent = null;
                    if (void 0 !== fileContentMap[file]) fileContent = fileContentMap[file]; else {
                        var fileUrl = rea.extension.getURL(file);
                        try {
                            var request = new XMLHttpRequest;
                            request.open("GET", fileUrl, !1/*async=false*/);
                            request.send(null);
                            (fileContent = fileContentMap[file] = request.responseText) || console.warn("registry: content of " + file + " is null!")
                        } catch (err) {
                            console.log("getRawContent " + err)
                        }
                    }
                    return fileContent
                },
                loadFile: function (fileList, cbFun) {
                    fileList = "string" === typeof fileList ? [fileList] : fileList;
                    var tryCount = 1, callFun = function () {
                        0 == --tryCount && cbFun && cbFun()
                    };
                    fileList.forEach(function (file) {
                        tryCount++;
                        try {
                            var script = document.createElement("script");
                            script.setAttribute("src", file);
                            script.onload = callFun;
                            script.onerror = function (err) {
                                console.warn("registry: self.load " + file + " failed! ", err);
                                callFun()
                            };
                            (document.head || document.body || document.documentElement || document).appendChild(script)
                        } catch (err) {
                            console.warn("registry: self.load " + file + " failed! ", err);
                            callFun();
                        }
                    });
                    callFun()
                },
                get: function (fileName) {
                    var b, file = fileMap[fileName];
                    "function" === typeof file ? (b = Array.prototype.slice.call(arguments, 1), b = file.apply(this, b)) : file && (b = file);
                    return b
                }
            };
        return funExport
    }();
    window.setTimeout(RegFun.init, 1);
    p.Registry = RegFun
})("undefined" !== typeof rea ? rea.globals : window);
