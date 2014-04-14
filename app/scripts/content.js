function DuXie(options) {
    this.initialize(options);
}

DuXie.prototype.initialize = function (options) {
    var write = options.write || "";
    var callback = options.callback;

    //初始化提示框
    var app_tpl = window["JST"]["app/templates/dialog.ejs"];
    var result_tpl = window["JST"]["app/templates/chooseview.ejs"];
    $('body').append($(app_tpl({write: write})));

    var $body = $('#duxieapp');
    var $WRITE = $body.find('#WRITE');
    var $SAY = $body.find('#SAY');
    var sayArray = $body.find('#SAY').val().split('');
    var writeArray = $body.find('#WRITE').val().split('')
    var pinyinArray = [];
    var resultStr = "";

    if (write == "") {
        $WRITE.focus();
    } else {
        $SAY.focus();
    }

    $WRITE.blur(function () {
        if ($SAY.val() === "") {
            $SAY.focus();
        }
    });

    $SAY.on('keyup', function () {
        var reg = /^[\u4E00-\u9FA5]+$/;
        if (reg.test($WRITE.val()) && reg.test($SAY.val())) {

            if ($WRITE.length > 0 && $SAY.length > 0 && $WRITE.val().length === $SAY.val().length) {
                showResult();
            } else {
                $body.find("#duxie_result").empty();
            }
        } else {
            $body.find("#duxie_result").empty();
        }
    });

    $body.on('change', '.js-tones-select', function (e) {
        //下拉框修改
        var el = $(e.currentTarget);
        $body.find('span[data-han="' + el.attr('data-han') + '"]').html(el.val());
    });

    $body.on('click', '#js-ok', function () {
        var arr = [];
        $('.js-tones-select').each(function (index, item) {
            arr.push($(item).val());
        });

        for (var i = 0; i < sayArray.length; i++) {
            resultStr = resultStr + writeArray[i] + "(" + arr[i] + ")";
        }

        console.log('结果：' + resultStr);
        callback(resultStr);
        $body.remove();
    });

    var showResult = function () {
        sayArray = $body.find('#SAY').val().split('');
        writeArray = $body.find('#WRITE').val().split('')
        pinyinArray = [];
        resultStr = "";

        //循环得到对应的拼音
        for (var i = 0; i < writeArray.length; i++) {
            pinyinArray.push(window.pinyin(sayArray[i], {heteronym: true})[0]);
        }

        //渲染
        $body.find("#duxie_result").html(result_tpl({
            selectedTextArray: writeArray,
            inputTextArray: sayArray,
            pinyinArray: pinyinArray
        }));
    };
};

//替换
function replaceInnerText($el, selectedText, replaceText) {
    if ($el.html().indexOf(selectedText) >= 0) {
        $el.html($el.html().replace(selectedText, replaceText));
    } else if ($el.val().indexOf(selectedText) >= 0) {
        $el.val($el.val().replace(selectedText, replaceText));
    } else {
        $el.find('input,textarea').each(function (index, item) {
            if ($(item).val().indexOf(selectedText) >= 0) {
                $(item).val($(item).val().replace(selectedText, replaceText));
            }
        });
    }
}

//
//$(document).ready(function () {
//    var duxie = new DuXie({});
//});

chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {

    var el = document.activeElement;
    var el_tag = el.tagName;

    if (request.info.editable && request.info.selectionText) {
        if (el) {
            var duxie = new DuXie({ write: request.info.selectionText, callback: function (result) {
                replaceInnerText($(el), request.info.selectionText, result);
            }});
        }
    } else {
        var ss = 0;
        var thisTagName = el_tag;

        if (thisTagName == "TEXTAREA" || thisTagName == "INPUT") {
            ss = el.selectionStart
        } else if (thisTagName != null) {
            if (thisTagName == el.tagName) {
                if (window.getSelection().anchorNode.textContent == $(el).text()) {
                    ss = window.getSelection().anchorOffset;
                } else {
                    var currentIndex = window.getSelection().anchorOffset;
                    var txt = "";
                    var txtoo = window.getSelection().anchorNode.previousSibling;
                    while (txtoo != null) {
                        txt += txtoo.textContent;
                        txtoo = txtoo.previousSibling;
                        ss = txt.length + currentIndex;
                    }
                }
            }
        }

        new DuXie({callback: function (result) {
            var $el = $(el);
            var text = "";

            var insertIndex = function (text, index) {

                var one = text.substring(0, index);
                var two = text.substring(index);

                return one + result + two;
            }

            if (thisTagName == "TEXTAREA" || thisTagName == "INPUT") {
                text = $el.val();
                text = insertIndex(text, ss);
                $el.val(text);
            } else if (thisTagName != null) {
                text = $el.text();
                text = insertIndex(text, ss);
                $el.text(text);
            }

        }});
    }
});

