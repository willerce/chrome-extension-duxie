this["JST"] = this["JST"] || {};

this["JST"]["app/templates/chooseview.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div>\n  ';
 _.each(selectedTextArray, function(item, index){ ;
__p += '\n  <span>' +
__e( item ) +
'</span>\n  <select class="js-tones-select" data-han="' +
__e( inputTextArray[index] ) +
'">\n    ';
 _.each(pinyinArray[index], function(pitem, pindex){ ;
__p += '\n    <option value="' +
__e( pitem ) +
'">' +
__e( pitem ) +
'</option>\n    ';
 }); ;
__p += '\n    <option disabled value="">' +
__e( inputTextArray[index] ) +
'</option>\n  </select>\n  ';
 }); ;
__p += '\n</div>\n<div class="duxie_resultText">\n  ';
 _.each(selectedTextArray, function(item, index){ ;
__p += '\n  <span>' +
__e( item ) +
'</span>\n  (<span data-han="' +
__e( inputTextArray[index] ) +
'">' +
__e( pinyinArray[index][0] ) +
'</span>)\n  ';
 }); ;
__p += '\n</div>\n<div class="duxie_button" id="js-ok">确定</div>\n';

}
return __p
};

this["JST"]["app/templates/dialog.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div id="duxieapp">\n  <div class="duxie-overlay"></div>\n  <div class="duxie_app">\n    <div class="duxie_head">读(xiě)</div>\n    <div class="duxie_main" id="js-content">\n\n      <div>\n        <div class="duxie_item">\n          <label for="WRITE">写作：</label>\n          <input class="duxie_input" id="WRITE" type="text" value="' +
__e( write ) +
'" placeholder="输入汉字"/>\n        </div>\n        <div class="duxie_item">\n          <label for="SAY">读作：</label>\n          <input class="duxie_input" id="SAY" type="text" placeholder="输入读法"/>\n        </div>\n      </div>\n\n      <div id="duxie_result" class="duxie_result"></div>\n\n    </div>\n  </div>\n</div>';

}
return __p
};