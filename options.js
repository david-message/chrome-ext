$(document).ready(function () {
    chrome.storage.sync.get(["host", "filter", "showImage"], function (items) {
        //init form
        $('#remoteHost').val(items['host']);
        $('#resFilter').val(items['filter']);
        $('#showImage').prop('checked', items['showImage']);
    });

    //save option config
    $('#btn_form_save').click(function () {
        console.log($('#remoteHost').val(), $('#resFilter').val(), $('#showImage').prop('checked'));

        chrome.storage.sync.set({
            'host': $('#remoteHost').val(),
            'filter': $('#resFilter').val(),
            'showImage': $('#showImage').prop('checked')
        }, function () {
            console.log("save done");
        });

        //sync bg
        //
        var bg = chrome.extension.getBackgroundPage();
        console.log(bg);
        bg.syncOptionConfig();

        return false;
    });

});
