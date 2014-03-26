this["JST"] = this["JST"] || {};

this["JST"]["app/templates/chooseview.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="duxie-overlay"></div>\n<div class="duxie-dialog">\n    <div>\n        ';
 _.each(selectedTextArray, function(item, index){ ;
__p += '\n        <span>' +
__e( item ) +
'</span>\n        (<span data-han="' +
__e( inputTextArray[index] ) +
'">' +
__e( pinyinArray[index][0] ) +
'</span>)\n        ';
 }); ;
__p += '\n    </div>\n    <div>\n        ';
 _.each(selectedTextArray, function(item, index){ ;
__p += '\n        <span>' +
__e( item ) +
'</span>\n        <select class="js-tones-select" data-han="' +
__e( inputTextArray[index] ) +
'">\n            ';
 _.each(pinyinArray[index], function(pitem, pindex){ ;
__p += '\n            <option value="' +
__e( pitem ) +
'">' +
__e( pitem ) +
'</option>\n            ';
 }); ;
__p += '\n            <option disabled value="">' +
__e( inputTextArray[index] ) +
'</option>\n        </select>\n        ';
 }); ;
__p += '\n    </div>\n    <button id="js-ok">搞定</button>\n</div>';

}
return __p
};

this["JST"]["app/templates/dialog.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div id="duxieapp">\n    <div class="duxie-overlay"></div>\n    <div class="duxie-dialog" id="js-content"></div>\n</div>';

}
return __p
};

this["JST"]["app/templates/inputview.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div> 请输入文字（长度' +
__e( maxlength ) +
'）</div>\n<p></p>\n<div>\n    <input id="js-duxie-input" type="text" maxlength="' +
__e( maxlength ) +
'" value="差劲"/>\n    <button id="js-duxie-enter">确定</button>\n</div>';

}
return __p
};