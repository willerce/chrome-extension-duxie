(function () {

    // 拼音词库。
    // 加载压缩合并的数据(118KB)。
    var dict_combo = window.dict_combo;

    function buildPinyinCache(dict_combo) {
        var hans;
        var uncomboed = {};
        for (var py in dict_combo) {
            hans = dict_combo[py];
            for (var i = 0, han, l = hans.length; i < l; i++) {
                han = hans.charAt(i);
                if (!uncomboed.hasOwnProperty(han)) {
                    uncomboed[han] = py;
                } else {
                    uncomboed[han] += "," + py;
                }
            }
        }
        return uncomboed;
    }

    var DICT = buildPinyinCache(dict_combo);
    dict_combo = null;
    delete dict_combo;

    // 声母表。
    var INITIALS = "zh,ch,sh,b,p,m,f,d,t,n,l,g,k,h,j,q,x,r,z,c,s,yu,y,w".split(",");
    // 韵母表。
    var FINALS = "ang,eng,ing,ong,an,zh,in,un,er,ai,ei,ui,ao,ou,iu,ie,ve,a,o,e,i,u,v".split(",");
    var PINYIN_STYLE = {
        NORMAL: 0,  // 普通风格，不带音标。
        TONE: 1,    // 标准风格，音标在韵母的第一个字母上。
        TONE2: 2,   // 声调中拼音之后，使用数字 1~4 标识。
        INITIALS: 3,// 仅需要声母部分。
        FIRST_LETTER: 4 // 仅保留首字母。
    };
    // 带音标字符。
    var PHONETIC_SYMBOL = {
        "ā": "a1",
        "á": "a2",
        "ǎ": "a3",
        "à": "a4",
        "ē": "e1",
        "é": "e2",
        "ě": "e3",
        "è": "e4",
        "ō": "o1",
        "ó": "o2",
        "ǒ": "o3",
        "ò": "o4",
        "ī": "i1",
        "í": "i2",
        "ǐ": "i3",
        "ì": "i4",
        "ū": "u1",
        "ú": "u2",
        "ǔ": "u3",
        "ù": "u4",
        "ü": "v0",
        "ǘ": "v2",
        "ǚ": "v3",
        "ǜ": "v4",
        "ń": "n2",
        "ň": "n3",
        "": "m2"
    };
    var re_phonetic_symbol_source = "";
    for (var k in PHONETIC_SYMBOL) {
        re_phonetic_symbol_source += k;
    }
    var RE_PHONETIC_SYMBOL = new RegExp('([' + re_phonetic_symbol_source + '])', 'g');
    var RE_TONE2 = /([aeoiuvnm])([0-4])$/;
    var DEFAULT_OPTIONS = {
        style: PINYIN_STYLE.TONE, // 风格
        heteronym: false // 多音字
    };

    function extend(origin, more) {
        if (!more) {
            return origin;
        }
        var obj = {};
        for (var k in origin) {
            if (more.hasOwnProperty(k)) {
                obj[k] = more[k]
            } else {
                obj[k] = origin[k]
            }
        }
        return obj;
    }

    /**
     * 修改拼音词库表中的格式。
     * @param {String} pinyin, 单个拼音。
     * @param {PINYIN_STYLE} style, 拼音风格。
     * @return {String}
     */
    function toFixed(pinyin, style) {
        var tone = ""; // 声调。
        switch (style) {
            case PINYIN_STYLE.INITIALS:
                return initials(pinyin);

            case PINYIN_STYLE.FIRST_LETTER:
                var first_letter = pinyin.charAt(0);
                if (PHONETIC_SYMBOL.hasOwnProperty(first_letter)) {
                    first_letter = PHONETIC_SYMBOL[first_letter].charAt(0);
                }
                return first_letter;

            case PINYIN_STYLE.NORMAL:
                return pinyin.replace(RE_PHONETIC_SYMBOL, function ($0, $1_phonetic) {
                    return PHONETIC_SYMBOL[$1_phonetic].replace(RE_TONE2, "$1");
                });

            case PINYIN_STYLE.TONE2:
                var py = pinyin.replace(RE_PHONETIC_SYMBOL, function ($0, $1) {
                    // 声调数值。
                    tone = PHONETIC_SYMBOL[$1].replace(RE_TONE2, "$2");

                    return PHONETIC_SYMBOL[$1].replace(RE_TONE2, "$1");
                });
                return py + tone;

            case PINYIN_STYLE.TONE:
            default:
                return pinyin;
        }
    }


    /**
     * 单字拼音转换。
     * @param {String} han, 单个汉字
     * @return {Array} 返回拼音列表，多音字会有多个拼音项。
     */
    function single_pinyin(han, options) {
        if ("string" !== typeof han) {
            return [];
        }
        options = extend(DEFAULT_OPTIONS, options);
        var pys = DICT[han].split(",");
        if (!options.heteronym) {
            return [toFixed(pys[0], options.style)];
        }
        // 临时存储已存在的拼音，避免重复。
        var py_cached = {};
        var pinyins = [];
        for (var i = 0, py, l = pys.length; i < l; i++) {
            py = toFixed(pys[i], options.style);
            if (py_cached.hasOwnProperty(py)) {
                continue;
            }
            py_cached[py] = py;

            pinyins.push(py);
        }
        return pinyins;
    }

    /**
     * @param {String} hans 要转为拼音的目标字符串（汉字）。
     * @param {Object} options, 可选，用于指定拼音风格，是否启用多音字。
     * @return {Array} 返回的拼音列表。
     */
    function pinyin(hans, options) {
        if ("string" !== typeof hans) {
            return [];
        }
        options = extend(DEFAULT_OPTIONS, options);
        var py = [];

        for (var i = 0, han, nonhans = "", l = hans.length; i < l; i++) {
            han = hans[i];
            if (DICT.hasOwnProperty(han)) {
                if (nonhans.length > 0) {
                    py.push([nonhans]);
                }
                py.push(single_pinyin(han, options));
                nonhans = ""; // reset non-hans.
            } else {
                nonhans += han;
            }
        }
        if (nonhans.length > 0) {
            py.push([nonhans]);
        }
        return py;
    }


    /**
     * 声母(Initials)、韵母(Finals)。
     * @param {String/Number/RegExp/Date/Function/Array/Object}
     * @return {String/Number/RegExp/Date/Function/Array/Object}
     */
    function initials(pinyin) {
        for (var i = 0, l = INITIALS.length; i < l; i++) {
            if (pinyin.indexOf(INITIALS[i]) === 0) {
                return INITIALS[i];
            }
        }
        return "";
    }

    window.pinyin = pinyin;
    window.pinyin.STYLE_NORMAL = PINYIN_STYLE.NORMAL;
    window.pinyin.STYLE_TONE = PINYIN_STYLE.TONE;
    window.pinyin.STYLE_TONE2 = PINYIN_STYLE.TONE2;
    window.pinyin.STYLE_INITIALS = PINYIN_STYLE.INITIALS;
    window.pinyin.STYLE_FIRST_LETTER = PINYIN_STYLE.FIRST_LETTER;
})();