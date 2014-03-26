function DuXie(options) {
    if (!options.selectedText) {
        return;
    }
    this.initialize(options);
}

DuXie.prototype.initialize = function (options) {
    var _this = this;
    var selectedText = options.selectedText;
    var el = options.el;

    var selectedTextArray = selectedText.split('');

    //初始化提示框
    var tpl = window["JST"]["app/templates/dialog.ejs"];
    $('body').append($(tpl()));
    this.$dialog_el = $('#duxieapp');

    this.showInputView(selectedTextArray.length, function (inputText) {
        _this.showChooseView(selectedTextArray, inputText, function (pinyin) {
            var result = _this.buildResultString(selectedTextArray, pinyin)
            _this.replaceInnerText(el, selectedText, result);
            _this.$dialog_el.remove();
        });
    });
};

//设置内容
DuXie.prototype.setDialogContent = function ($html) {
    this.$dialog_el.find('#js-content').html($html);
};

//显示输入框
DuXie.prototype.showInputView = function (maxlength, closeCallback) {
    var tpl = window["JST"]["app/templates/inputview.ejs"];
    var $template = $(tpl({maxlength: maxlength}));

    $template.find('#js-duxie-enter').click(function () {
        enter();
    });

    $template.find('#js-duxie-input').keyup(function (event) {
        if (event.keyCode === 13) {
            enter();
        }
    });

    var enter = function () {
        var inpu_text = $template.find('#js-duxie-input').val();
        closeCallback(inpu_text);
    };

    this.setDialogContent($template);

    this.$dialog_el.find('#js-duxie-input').focus();

};

//显示音节选择
DuXie.prototype.showChooseView = function (selectedTextArray, inputText, closeCallback) {
    var _this = this;
    var inputTextArray = inputText.split('');
    var pinyinArray = [];

    //循环得到对应的拼音
    for (var i = 0; i < inputTextArray.length; i++) {

        //得到拼音，数组类型
        var tmpPY = window.pinyin(inputTextArray[i], {heteronym: true})[0];

        pinyinArray.push(tmpPY);
    }

    var tpl = window["JST"]["app/templates/chooseview.ejs"];
    var $template = $(tpl({
        selectedTextArray: selectedTextArray,
        inputTextArray: inputTextArray,
        pinyinArray: pinyinArray
    }));

    this.$dialog_el.html($template);

    this.$dialog_el.find('.js-tones-select').change(function (e) {
        onSelectChange(e);
    });

    var onSelectChange = function (e) {
        //下拉框修改
        var el = $(e.currentTarget);
        _this.$dialog_el.find('span[data-han="' + el.attr('data-han') + '"]').html(el.val());
    };

    this.$dialog_el.find('#js-ok').click(function () {
        var arr = [];
        $('.js-tones-select').each(function (index, item) {
            arr.push($(item).val());
        });
        closeCallback(arr);
    });

};

DuXie.prototype.buildResultString = function (inputTextArray, pinYinArray) {

    var str = "";
    for (var i = 0; i < inputTextArray.length; i++) {
        str = str + inputTextArray[i] + "(" + pinYinArray[i] + ")";
    }
    console.log('结果：' + str);
    return str;

};

//替换
DuXie.prototype.replaceInnerText = function ($el, selectedText, replaceText) {
    if ($el.html().indexOf(selectedText) >= 0) {
        $el.html($el.html().replace(selectedText, replaceText));
    } else {
        $el.find('input,textarea').each(function (index, item) {
            if ($(item).val().indexOf(selectedText) >= 0) {
                $(item).val($(item).val().replace(selectedText, replaceText));
            }
        });
    }
};

chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
    var el = window.getSelection().anchorNode;
    if (el.nodeType === 3) {
        el = el.parentNode;
    }
    if (el) {
        var duxie = new DuXie({selectedText: request.text, el: $(el)});
    }
});

