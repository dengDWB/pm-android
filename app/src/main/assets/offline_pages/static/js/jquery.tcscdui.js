$(function () {
    $.rows();
    $("[data-model='dialog']").dialog();
    $("[data-model='tab']").tabs();
    $("[data-model='silder']").silder();
})
window.ajaxDataType = "json";
window.ajaxGetContentType = "application/json";
window.ajaxPostContentType = "application/json";
window.dialogs = [];
window.tooltiptype = [];
tooltiptype.confirm = 1;
tooltiptype.alert = 2;
tooltiptype.tips = 3;
tooltiptype.loading = 4;
tooltiptype.committing = 5;
tooltiptype.dialog = 6;
tcscdui = {
    helper: {
        createLoadingDom: function (tagName, contId, style, extendstyle) {
            if (tagName.toLowerCase() != "li" && tagName.toLowerCase() != "div") {
                tagName = "div";
            }
            var html = "<" + tagName + " id='" + contId + "' class='" + style + " " + extendstyle + "'>"
                + "</" + tagName + ">";
            return html;
        },
        createTouchDom: function (parent, text, img) {
            var html = (text != "" ? "<div class='touchtext'>" + text + "</div>" : "")
                + (img != undefined ? "<div class='touchimg'><img src='" + img + "'></div>" : "");
            $(parent).html(html);
        },
        createDomName: function (postfix) {
            return postfix + new Date().getTime();
        },
        hasId: function (dom, needCreate, postfix) {
            return $(dom).attr("id") && needCreate && $(dom).attr("id", this.createDomName(postfix ? postfix : $(dom).get(0).tagName));
        },
        hasName: function (dom, needCreate, postfix) {
            return $(dom).attr("name") && needCreate && $(dom).attr("name", this.createDomName(postfix ? postfix : $(dom).get(0).tagName));
        }
    }
}
window.formattype = {
    datetime: {
        format: function (source, param) {
            var format = undefined;
            if (param != undefined) {
                format = param[0];
            }
            format = format == undefined ? "yyyy-MM-dd" : format;
            source = source.replace(/-/g, "/");
            source = source.replace("T", " ");
            source = source.replace(/\./g, " ");
            var arr = source.split(/[\/ :]/);
            var newDate = new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4], arr[5]);
            var o = {
                "M+": newDate.getMonth() + 1, //month 
                "d+": newDate.getDate(), //day 
                "h+": newDate.getHours(), //hour 
                "m+": newDate.getMinutes(), //minute 
                "s+": newDate.getSeconds(), //second 
                "q+": Math.floor((newDate.getMonth() + 3) / 3), //quarter 
                "S": newDate.getMilliseconds() //millisecond 
            }
            if (/(y+)/.test(format)) {
                format = format.replace(RegExp.$1, (newDate.getFullYear() + "").substr(4 - RegExp.$1.length));
            }

            for (var k in o) {
                if (new RegExp("(" + k + ")").test(format)) {
                    format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
                }
            }
            return format;
        }
    },
    hideInfo: {
        format: function (source) {
            if (source.length > 0 && source.length < 10) {
                source = "*" + source.charAt(source.length - 1);
            }
            else {
                source = source.replace(source.substr(6, 8), "********");
            }
            return source;
        }
    },
    decode: {
        format: function (source) {
            source = decodeURI(source);
            return source;
        }
    }
};
window.validatetype = {
    required: {
        validator: function (source) {
            if (source == null || source == undefined || source == "") {
                return false;
            }
            return true;
        },
        message: '必填'
    },
    qq: {
        validator: function (value) {
            if (value) {
                return /^d[5,15]$/.test(value);
            } else {
                return true;
            }
        },
        message: '无效的QQ号码'
    },
    idcard: {
        validator: function (value) {
            if (value) {
                return /^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/.test(value);
            } else {
                return true;
            }
        },
        message: '无效的身份证号'
    },
    bankcard: {
        validator: function (value) {
            if (value) {
                return /^(\d{16}|\d{19}|\d{18})$/.test(value);
            } else {
                return true;
            }
        },
        message: '无效的银行卡号'
    },
    CVN: {
        validator: function (value) {
            return value.length == 3;
        },
        message: '无效的校验码'
    },
    equals: {
        validator: function (value, param) {
            return value == $(param[0]).val();
        },
        message: '两次输入的密码不一致'
    },
    minLength: {
        validator: function (value, param) {
            return value.length >= param[0];
        },
        message: '请输入至少{0}个字'
    },
    maxLength: {
        validator: function (value, param) {
            return value.length < param[0];
        },
        message: '最多只能输入{0}个字'
    },
    month: {
        validator: function (value) {
            return 0 < value < 12;
        },
        message: '请输入正确的月份'
    },
    numerinterval: {
        validator: function (value,param) {
            return (param[0] < value) && (value < param[1]);
        },
        message: '请输入大于{0}，小于{1}的数字'
    },
    //根据业务系统的金额调整
    money: {
        validator: function (value) {
            if (value) {
                return /^(([1-9]{1}\d{0,6})|([0]{1}))(\.(\d){1,2})?$/.test(value);
            } else {
                return true;
            }
        },
        message: '请输入正确的金额'
    },
    number: {
        validator: function (value) {
            if (value) {
                return /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test(value);
            } else {
                return true;
            }
        },
        message: '请输入大于0的数字'
    },
    integer: {
        validator: function (value) {
            if (value) {
                return /^\+?(0|[1-9][0-9]*)$/.test(value);
            } else {
                return true;
            }
        },
        message: '请输入正整数'
    },

    http: {
        validator: function (value) {
            if (value) {
                return /^(http(s?):\/\/)+(\w*.)*$/.test(value);
            } else {
                return true;
            }
        },
        message: '无效的网址'
    },
    zip: {
        validator: function (value) {
            return /[1-9]\d{5}(?!\d)/.test(value);
        },
        message: '邮政编码不存在'
    },
    mobilephone: {
        validator: function (value) {
            if (value) {
                return /^1\d{10}$/.test(value);
            } else {
                return true;
            }
        },
        message: '无效的移动电话号码'
    },
    phone: {
        validator: function (value) {

            if (value) {
                return /((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/.test(value);
            } else {
                return true;
            }
        },
        message: '无效的电话号码'
    },
    email: {
        validator: function (value) {

            if (value) {
                return /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(value);
            } else {
                return true;
            }
        },
        message: '无效的电子邮件'
    }
};

function closeDialog(length, callback) {
    length = length == undefined ? 1 : length;
    var alldialogs = window.parent.dialogs;
    if (alldialogs.length > 0) {
        while (length > 0) {
            callback && callback();
            alldialogs[alldialogs.length - 1].close();
            length--;
        }

        return true;
    }
    else {
        return false;
    }
}
Array.prototype.remove = function (val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};
Array.prototype.indexOf = function (e) {
    for (var i = 0, j; j = this[i]; i++) {
        if (j == e) { return i; }
    }
    return -1;
};
Array.prototype.lastIndexOf = function (e) {
    for (var i = this.length - 1, j; j = this[i]; i--) {
        if (j == e) { return i; }
    }
    return -1;
};
JSON.extendparse = function (source) {
    var result = {};
    if (typeof (source) == "string") {
        result = JSON.parse(source);
    }
    else {
        result = source;
    }
    if (result.d) {
        result = result.d;
        if (typeof (result) == "string") {
            result = JSON.parse(result);
        }
    }
    return result;
}
JSON.getIndexByValue = function (source, key, value) {
    var index = -1;
    $.each(source, function (i, r) {
        if (r[key] == value) {
            index = i;
            return false;
        }
    })
    return index;
}
JSON.subJson = function (source, length, indexof) {
    indexof = indexof == undefined ? 0 : indexof;
    var result = [];
    $.each(source, function (i, r) {
        if (i < length && i >= indexof) {
            result[i] = r;
        }
        else {
            return false;
        }
    })
    return result;
}
$.extendParam = function (param1, param2) {
    for (att in param2) {
        param1[att] = param2[att];
    }
    return param1;
}
$.fn.serializeJson = function (isJoin, separator) {
    for (var i = 0, values = {}, field, name, value, arr = this.get(0).elements, length = arr.length; i < length; i++) {
        field = arr[i], name = field.name, value = field.value.replace(/\&/g, "");
        if (field.name && field.type != 'button' && field.type != 'submit' && field.tagName != 'BUTTON') {
            name &&
                !field.disabled &&
                /radio|checkbox/i.test(field.type) &&
                (
                    (field.type == 'radio' && field.checked && (values[name] = value)) ||
                    (field.type == 'checkbox' && field.checked &&
                        (!values[name] && (values[name] = []), values[name].push(value))
                    ), true
                ) ||
                (values[name] = value)
        }
    }
    if (isJoin && length) {
        for (var key in values) {
            $.isArray(values[key]) && (values[key] = values[key].join(separator || ',').replace(/\&/g, ""));
        }
    }
    return values
}
$.extendajax = function (options) {
    //var tips = $.tooltip({ content: "加载中", autoShow: false, autoHide: true, hideTimeout:200 });
    $.ajax({
        url: options.url || "",
        async: options.async != undefined ? options.async : true,
        cache: options.cache != undefined ? options.cache : true,
        data: options.data || {},
        dataType: options.dataType || window.ajaxDataType,
        headers: options.headers || null,
        contentType: options.contentType || (options.type == "post" ? window.ajaxPostContentType : window.ajaxGetContentType),
        type: options.type || "get",
        beforeSend: function () {
            //tips.show();
            if (options.beforeSend != undefined) {
                options.beforeSend();
            }
        },
        success: function (result) {
            result = JSON.extendparse(result);
            if (options.success != undefined) {
                options.success(result);
            }
        },
        error: function (xhr) {
            if (options.error != undefined) {
                options.error(xhr);
            }
            else {
                $.tooltip({ content: "哎呀，貌似断网了", autoShow: true, autoHide: true, hideTimeout: 1300 });
            }
        },
        complete: function () {
            if (options.complete != undefined) {
                options.complete();
            }
        },
    })
}
$.extendget = function (options) {
    var datas = {};
    options.data == options.data || [];
    options.pparam == options.pparam || [];
    options.sparam == options.sparam || null;
    if (options.pparamValue != "" && options.pparamValue != undefined && options.sparam != null) {
        datas[options.pparamValue] = options.data;
        datas = $.extendParam(datas[options.pparamValue], options.pparam);
        datas = $.extendParam(datas, options.sparam);
    }
    else {
        datas = options.data;
        datas = $.extendParam(datas, options.pparam);
    }
    datas = JSON.stringify(datas);
    if (datas == "{}")
        datas = null;
    var headers = $.extendget.getHeader();
    var params = {
        url: options.url || "",
        async: options.async != undefined ? options.async : true,
        cache: options.cache != undefined ? options.cache : true,
        type: options.type || "get",
        contentType: options.contentType || window.ajaxGetContentType,
        dataType: options.dataType || window.ajaxDataType,
        data: datas,
        headers: headers,
        beforeSend: function () {
            if (options.beforeSend != undefined) {
                options.beforeSend();
            }
        },
        success: function (result) {
            if (options.success != undefined) {
                options.success(result);
            }
        },
        error: function (xhr) {
            if (options.error != undefined) {
                options.error(xhr);
            }
        },
        complete: function () {
            if (options.complete != undefined) {
                options.complete();
            }
        },
    }
    $.extendajax(params);
};
$.extendget.getHeader = function () {
    return null;
};

$.extendpost = function (options) {
    var datas = {};
    options.data == options.data || [];
    options.pparam == options.pparam || [];
    options.sparam == options.sparam || null;
    var headers = $.extendpost.getHeader();
    if (options.pparamValue != "" && options.pparamValue != undefined && options.sparam != null) {
        datas[options.pparamValue] = options.data;
        datas[options.pparamValue] = $.extendParam(datas[options.pparamValue], options.pparam);
        datas = $.extendParam(datas, options.sparam);
    }
    else {
        datas = options.data;
        datas = $.extendParam(datas, options.pparam);
    }
    datas = JSON.stringify(datas);
    if (datas == "{}")
        datas = null;
    var params = {
        url: options.url || "",
        async: options.async != undefined ? options.async : true,
        cache: options.cache != undefined ? options.cache : true,
        type: "post",
        contentType: options.contentType || window.ajaxPostContentType,
        dataType: options.dataType || window.ajaxDataType,
        data: datas,
        headers: headers,
        beforeSend: function () {
            if (options.beforeSend != undefined) {
                options.beforeSend();
            }
        },
        success: function (result) {
            if (options.success != undefined) {
                options.success(result);
            }
        },
        error: function (xhr) {
            if (options.error != undefined) {
                options.error(xhr);
            }
        },
        complete: function () {
            if (options.complete != undefined) {
                options.complete();
            }
        },
    }
    $.extendajax(params);
};
$.extendpost.getHeader = function () {
    return null;
};
; (function ($) {
    /*数据绑定*/
    var bindData = function (_this, options) {
        var _bindDataDefault = {
            url: "",//url和data二选一，如果url不为空时，配和aysnc进行ajax请求
            data: [],//数组，示例:{data:[{value:1},{value:2}]}
            param: {},//传递的参数，示例：{id:1,publish:true}
            dataColumn: "body.records",//返回的json数据中，承载列表数据的字段名
            prep: false,//false表示追加到原有数据之后。true表示增加到原有数据之前
            holdIndex: -1,//-1表示所有数据均会被替换.如果holdIndex大于0，表示当前数据列表中index为几的数据会依然保存下来。
            async: true,
            loadText: "加载中，请稍后",
            loadEndText: "暂无数据",
            loadImg: "",
            allowLoading: true,
            loadingStyle: "",
            onBind: function (data, source) { },//数据绑定完成之后的事件
            type: "get",
        };
        options = options || _bindDataDefault;
        options.data = options.data || _bindDataDefault.data;
        options.url = options.url || _bindDataDefault.url;
        options.dataColumn = options.dataColumn != undefined ? options.dataColumn : _bindDataDefault.dataColumn;
        options.param = options.param || _bindDataDefault.param;
        options.prep = options.prep != undefined ? options.prep : _bindDataDefault.prep;
        options.holdIndex = options.holdIndex != undefined ? options.holdIndex : _bindDataDefault.holdIndex;
        options.async = options.async != undefined ? options.async : _bindDataDefault.async;
        options.onBind = options.onBind || _bindDataDefault.onBind;
        options.loadText = options.loadText || _bindDataDefault.loadText;
        options.loadImg = options.loadImg || _bindDataDefault.loadImg;
        options.allowLoading = options.allowLoading != undefined ? options.allowLoading : _bindDataDefault.allowLoading;
        options.loadingStyle = options.loadingStyle || _bindDataDefault.loadingStyle;
        options.loadEndText = options.loadEndText || _bindDataDefault.loadEndText;
        options.type = options.type || _bindDataDefault.type;
        options.loadingCtrl = null;
        options.init = true;
        options.template = _this.children().eq(0).prop('outerHTML');
        this.dom = _this;
        this.options = options;
        this.clearContent();
        if (options.allowLoading) {
            var cont = _this.get(0);
            var contId = new Date().getTime();
            var style = "paging";
            var tagName = cont ? cont.tagName : "";
            var loadingHtml = tcscdui.helper.createLoadingDom(tagName, "loading_" + contId, style, options.loadingStyle, options.loadText, options.loadImg);
            options.loadingCtrl = $(loadingHtml);
            tcscdui.helper.createTouchDom(options.loadingCtrl, options.loadText, options.loadImg);
            options.loadingCtrl.prependTo(_this.parent());
            options.loadingCtrl.show(0);
        }
        //判断是否为第一次加载数据，如果是第一次加载，则把该元素的第一个子元素的html结构保存下来，以便以后使用

        //如果url不为空，使用ajax请求数据
        if (options.url != "") {
            this.setUrl(options.url, options.param, options.dataColumn, options.onBind, options.holdIndex);
        }
        else {
            this.setData(options.data, options.dataColumn, options.holdIndex);
        }
    }
    bindData.prototype = {
        bind: function (data, prep) {
            var _dom = this.dom;
            var options = this.options;
            prep = prep != undefined ? prep : options.prep;
            if (data.length) {
                $.each(data, function (index, row) {
                    regexData(row, prep);
                });
            }
            else {
                regexData(data, prep);
            }
            options.onBind(data, options.data);

            function regexData(data, prep) {
                //两种方式，第一种写到data-cell属性中，则直接替换显示值，第二种是写到其他属性中，则需要添加{{column}}，双层大括号
                //使用正则表达式，将所有的{{}}替换成最终结果
                var regex = "([^\{\}]+)(?=[\}}]+)";
                var result = options.template;
                var regexValue = new RegExp(regex, "g");
                var regexResult = result.match(regexValue);
                for (var i = 0; i < regexResult.length; i++) {
                    result = result.replace(new RegExp("{{" + regexResult[i] + "}}", "g"), ((eval("data." + regexResult[i]) == "0" || eval("data." + regexResult[i]) == "1" || eval("data." + regexResult[i]) == "true" || eval("data." + regexResult[i]) == "false") ? (eval("data." + regexResult[i]).toString() === false) : !(eval("data." + regexResult[i]))) ? (eval("data." + regexResult[i]) === undefined ? "{{" + regexResult[i] + "}}" : "") : eval("data." + regexResult[i]))
                }
                var cont;
                //如果holdindex>0，则把所有数据加载index的数据前面
                if (options.holdIndex > -1) {
                    cont = $(result).insertBefore(options.holdCtrl);
                }
                else {
                    //如果holdindex<0，判断prep决定加在原有数据前面还是后面
                    if (prep != undefined && prep) {
                        cont = $(result).prependTo(_dom);
                    }
                    else {
                        cont = $(result).appendTo(_dom);
                    }
                }
                //当实际数据添加到变量后，判断该条html是否需要进行格式化，如果需要，则先进行格式化，再进行显示，如果不需要，则直接显示
                $.each(cont.find("[data-cell]"), function (i, r) {
                    _r = $(r);
                    if (_r.attr("data-format") != undefined) {
                        if (_r.attr("data-cell") != "") {
                            _r.formatter({ value: _r.attr("data-cell") });
                        }
                    }
                    else {
                        _r.html(_r.attr("data-cell"));
                    }
                    //_r.removeAttr("data-cell")
                });
                $.rows({ control: _dom });
            }
        },
        getData: function () {
            var options = this.options;
            return options.data;
        },
        setUrl: function (url, param, dataColumn, onBind, holdindex) {
            var options = this.options;
            var _this = this;
            if (url != undefined) {
                options.url = url;
            }
            if (param != undefined) {
                options.param = param;
            }
            if (typeof (onBind) == typeof (Function)) {
                options.onBind = onBind;
            }
            if (holdindex != undefined) {
                options.holdIndex = holdindex;
            }
            if (dataColumn != undefined) {
                options.dataColumn = dataColumn;
            }
            $.extendget({
                url: options.url,
                async: options.async,
                data: options.param,
                type: options.type,
                success: function (result) {
                    options.data = result;
                    //var data = eval("result" + (options.dataColumn == "" ? "" : "." + options.dataColumn));
                    _this.setData(result, options.dataColumn, options.holdIndex);
                }
            })
        },
        setData: function (data, dataColumn, holdindex) {
            var options = this.options;
            var _dom = this.dom;
            options.data = data;
            if (holdindex != undefined) {
                options.holdIndex = holdindex;
            }
            if (dataColumn != undefined) {
                options.dataColumn = dataColumn;
            }
            !options.init && this.clearContent();
            if (data && (Array.isArray(data) ? data.length > 0 : true)) {
                var source = [];
                try {
                    source = eval("data" + (options.dataColumn == "" ? "" : "." + options.dataColumn));
                }
                catch (e) {

                }
                if (Array.isArray(source) && !source.length > 0) {
                    tcscdui.helper.createTouchDom(options.loadingCtrl, options.loadEndText, options.loadImg);
                    options.loadingCtrl.show(0);
                }
                else {
                    source && this.bind(source, options.prep);
                    if (options.allowLoading) {
                        options.loadingCtrl.html("").hide(0);
                    }
                }
            }
            else if (options.allowLoading) {
                tcscdui.helper.createTouchDom(options.loadingCtrl, options.loadEndText, options.loadImg);
                options.init ? options.loadingCtrl.hide(0) : options.loadingCtrl.show(0);
            }
            options.init = false;
        },
        insertData: function (data, prep) {
            var options = this.options;
            prep = prep != undefined ? prep : options.prep;
            if (data) {
                eval("Array.prototype." + (prep ? "unshift" : "push") + ".apply(options.data" + (options.dataColumn == "" ? "" : "." + options.dataColumn) + ",Array.isArray(data)?data:[data])");
                this.bind(data, prep);
            }
        },
        removeData: function (listitem) {
            if (this.options.data) {
                var index = $(listitem, this.dom).index();
                $(listitem).remove();
                this.options.data.splice(index, 1)
            }
        },
        clearContent: function () {
            var options = this.options;
            var _dom = this.dom;
            if (options.holdIndex > -1) {
                options.holdCtrl = _dom.children().eq(options.holdIndex).addClass("hold");
                options.holdCtrl.siblings().remove();
            }
            //如果holdindex<-1，则删除所有数据
            else {
                _dom.html("");
            }
        },
        clearData: function () {
            var options = this.options;
            options.data = [];
            this.clearContent();
        }
    }
    $.fn.bindData = function (options) {
        return new bindData($(this).eq(0), options);
    }


    /*数据绑定完*/



    /*分类选择*/
    var category = function (options) {
        var _categoryDefault = {
            data: [],
            url: "",
            param: {},
            title: "",
            requestLevel: -1,
            child: "children",
            value: "value",
            text: "text",
            img: "",
            dataColumn: "Data",
            alltext: "全部",
            width: 0,
            name: "",
            selected: [],
            needHeader: false,
            multiCheck: false,
            callback: function (data) { }
        }
        options = options || _categoryDefault;
        options.data = options.data || _categoryDefault.data;
        options.data = options.data || _categoryDefault.data;
        options.url = options.url || _categoryDefault.url;
        options.param = options.param || _categoryDefault.param;
        options.title = options.title || _categoryDefault.title;
        //必选层级，小于设定值的层级均为必选项，即没有“全部”选项出现
        options.requestLevel = options.requestLevel == undefined ? _categoryDefault.requestLevel : options.requestLevel;
        options.width = options.width || _categoryDefault.width;
        options.child = options.child || _categoryDefault.child;
        options.value = options.value || _categoryDefault.value;
        options.text = options.text || _categoryDefault.text;
        options.callback = options.callback || _categoryDefault.callback;
        options.alltext = options.alltext || _categoryDefault.alltext;
        options.name = options.name || _categoryDefault.name;
        options.img = options.img || _categoryDefault.img;
        options.multiCheck = options.multiCheck != undefined ? options.multiCheck : _categoryDefault.multiCheck;
        options.needHeader = options.needHeader != undefined ? options.needHeader : _categoryDefault.needHeader;
        options.dataColumn = options.dataColumn != undefined ? options.dataColumn : _categoryDefault.dataColumn;
        options.selected = options.selected || _categoryDefault.selected;
        var timestamp = self != top ? window.name : new Date().getTime();
        this.options = options;
        var _data = options.data;
        var _this = this;
        options.dialogArray = new Array();
        if (options.url) {
            $.extendget({
                url: options.url,
                data: options.param,
                success: function (result) {
                    var data = eval("result" + (options.dataColumn == "" ? "" : "." + options.dataColumn));
                    $.extend(_data, data);
                    options.data = _data;
                    //_data.concat(data);
                    //弹出窗id加入时间戳，防止id重复的标签
                    var dialogId = "dialog_" + timestamp;
                    datafilter(_data, dialogId);
                }
            })
        }
        else {
            //弹出窗id加入时间戳，防止id重复的标签
            var dialogId = "dialog_" + timestamp;
            datafilter(_data, dialogId);
        }
        function datafilter(data, dialogId) {
            var currentLevel = 0;
            var count = 0;
            //分析数组中json中最多的层级
            $.each(data, function (index, row) {
                var currentCount = JSON.stringify(row).split(options.child).length - 1;;
                if (count < currentCount)
                    count = currentCount;
            });
            var postfix = 0;
            var prepDialog;
            while (count > -1) {
                postfix++;
                //根据json数组中最多的层级，动态创建相应个数的弹出窗，使用时，弹出窗根据层级一个层级一个层级的加载。
                var html = createDialogDom(dialogId + "_" + postfix, options.multiCheck, options.needHeader);
                var dialog = $(html).appendTo(prepDialog ? prepDialog.dom : "body");
                var categoryDialog = dialog.dialog({
                    title: options.title, size: options.width + "px", needLoading: false, closed: function () {
                        _this.close();
                    }
                });
                categoryDialog.dom.find(".footer").find(".saveCategory").bind("click", function () {
                    _this.finishSelect(options.selected);
                });
                //点击重置按钮，将所有选择的数据清空
                categoryDialog.dom.find(".footer").find(".resetCategory").bind("click", function () {
                    categoryDialog.dom.find("#" + dialogId + "_" + postfix + "_list").find(".boarditem").removeClass("select");
                    options.selected = [];
                });
                prepDialog = categoryDialog;
                options.dialogArray.push(categoryDialog);
                count--;
            }
            _this.setData(data);
            //return dialogArray;
        }
        function createDialogDom(dialogId, needMulti, needHeader) {
            var html = "<div id=" + dialogId + " class='dialog categorydialog'><div class='dialogpanel categorydialog_c content'>"
                //创建弹出窗页头
                + "<div class='board header'>"
                + "<div class='board_c over'>"
                + "<div class='board_c_l padding_l'><a class='close ico returnico' href='javascript:;'></a></div>"
                + "<div class='board_c_c'><span id='pagetitle textoverflow' class='title close'><span class='pagetitletext'>加载中</span></span></div>"
                + "</div>"
                + "</div>"
                //创建弹出窗内容，默认加载一个搜索控件
                + "<div class='board main'>"
                //+ (needHeader ? "<div class='board_t'><span class='searchboard'><a href='javascript:;' class='searchtool cols-1'><span class='ico searchico'>输入文字搜索</span></a></span></div>" : "")
                //+ "<div class='board_c'>"
                //+ "</div>"
                + "</div>"
                + (needMulti ?
                    "<div class='board footer over rows-fix-2'><a href='javascript:;' class='btn btnCancel cols-1 resetCategory'><span>重置</span></a><a href='javascript:;' class='btn btnDefault cols-1 saveCategory'><span>确认</span></a></div>" : "")
                + "</div>"
                + "</div>";
            return html;
        }
    }
    category.prototype = {
        currentShow: 0,
        setData: function (data) {
            var _this = this;
            var options = this.options;
            var currentDialog = options.dialogArray[_this.currentShow];
            var dialogId = currentDialog.dom.attr("id");
            //创建当前弹出窗列表的唯一id
            var list = "<div class='board_c'><ul id='" + dialogId + "_list'>";
            //当前打开的窗口数大于必选的层级的窗口数后，显示全部按钮
            if (options.requestLevel <= _this.currentShow && options.requestLevel > -1) {
                list += "<li class='boarditem padding margin'>"
                    + "<a class='boarditem_t cols-1'>" + options.alltext + "</a>"
                    + "</li>";
            }
            //if (!isFirst) {
            //    //因为data为Json数组，当在顶层时，data就是整个json，当当前弹出窗时第二级之后的弹出窗时，data为该层级弹出窗的具体数值
            //    data = data[options.child];
            //}
            //动态创建选择项
            $.each(data, function (index, row) {
                var hasSelect = false;
                $.each(options.selected, function (i, item) {
                    if (item[options.value] == row[options.value])
                        hasSelect = true;
                })
                list += "<li class='boarditem padding margin " + (hasSelect ? "select" : "") + "' value='" + row[options.value] + "'>"
                    + "<a class='boarditem_t cols-1' value='" + row[options.value] + "'>"
                    + (options.img == "" ? row[options.text] : "<div class='aligncenter'><img src='" + row[options.img] + "'/></div><div class='aligncenter textoverflow'>" + row[options.text] + "</div>")
                    + "</a>"
                    + "</li>";
            })
            list += "</ul></div>";
            currentDialog.setContent(list);
            //currentCategory.html(list);
            $.rows({ control: options.dialogArray[_this.currentShow].dom });
            //给每一个选择项动态绑定click事件
            currentDialog.dom.find("#" + dialogId + "_list .boarditem").bind("click", function () {
                //获取当前选择项value
                var value = $(this).attr("value");
                //dialogArray[currentShow].dialog({ title: text });
                //当value为空时，表示点击的全部按钮
                if (value != undefined) {
                    //根据选择的值，找出data中该段数组的数据
                    var currentData = eachData(data, value);
                    //如果该选择的数据有子数据，则继续显示弹出窗，如果没有，则完成此次选择返回最终选择值
                    if (currentData[options.child] != undefined) {
                        options.childtitle = $(this).text();
                        _this.show(null, currentData[options.child]);
                    }
                    else {
                        //如果是单选，则直接返回值
                        if (!options.multiCheck) {
                            $(this).toggleClass("select");
                            _this.finishSelect(new Array(currentData));;
                        }
                        else {
                            //如果不是单选，则会将选择的数据添加到数组中，以便点击确定后的数据提取
                            if ($(this).hasClass("select")) {
                                $(this).removeClass("select");
                                var index = -1;
                                index = JSON.getIndexByValue(options.selected, options.value, currentData[options.value]);
                                if (index > -1) {
                                    options.selected.splice(index, 1);
                                }
                            }
                            else {
                                $(this).addClass("select")
                                options.selected.push(currentData);
                            }
                        }
                    }
                }
                else {
                    if (!options.multiCheck) {
                        _this.finishSelect(data);
                    }
                    else {
                        if ($(this).hasClass("select")) {
                            $(this).removeClass("select").siblings().removeClass("select");
                            options.selected.remove(data);
                        }
                        else {
                            $(this).addClass("select").siblings().addClass("select");
                            options.selected.push(data);
                        }
                    }
                }
            });
            function eachData(data, value) {
                var result = [];
                $.each(data, function (index, rows) {
                    if (rows[options.value] == value) {
                        result = rows;
                        return false;
                    }
                    else if (rows[options.child] != undefined) {
                        result = eachData(rows[options.child], value);
                    }
                })
                return result;
            }
        },
        show: function (callback, data) {
            var _this = this;
            var options = this.options;
            if (typeof (callback) == typeof (Function)) {
                options.callback = callback;
            }
            var currentDialog = options.dialogArray[_this.currentShow];
            if (data) {
                this.setData(data);
            }
            currentDialog.show(_this.currentShow == 0 ? options.title : options.childtitle);
            this.currentShow += 1;
            return this;
        },
        close: function () {
            this.currentShow = this.currentShow == 0 ? 0 : this.currentShow - 1;
            return this;
        },
        getData: function () {
            return this.options.selected;
        },
        getCurrentDialog: function () {
            return this.options.dialogArray[this.currentShow];
        },
        finishSelect: function (data) {
            var options = this.options;
            options.selected = data;
            var nameCtrl = $("[name='" + options.name + "']");
            if (nameCtrl.length > 0 && options.name != "") {
                var result = "";
                $.each(data, function (index, rows) {
                    result += rows[options.value] + ",";
                })
                if (result.length > 0) {
                    result = result.substring(0, result.length - 1);
                }
                nameCtrl.val(result);
            }
            options.callback(data);
            for (var item = 0; item < options.dialogArray.length; item++) {
                options.dialogArray[item].close();
                this.close();
            }
            return this;
        }
    };
    $.category = function (options) {
        return new category(options);
    }


    /*分类选择完*/


    /*弹出窗*/


    var dialog = function (_this, options) {
        var _dialogDefault = {
            headerCtrl: ".header",
            titleCtrl: ".title",
            closeCtrl: ".close",
            contentCtrl: ".main",
            showParent: "",
            parent: document,
            beforeShow: function () {
            },
            needLoading: true,
            completeLoad: function () {
            },
            closed: function () {
            },
            needHeader: true,
            needAnimate: true,
            size: 0,
            title: "",
            url: "",
            vertical: false,
            dispose: false,
            autoShow: false,
            loadingText: "拼命加载中"
        }
        options = options || _dialogDefault;
        options.autoShow = options.autoShow == undefined ? _dialogDefault.autoShow : options.autoShow;
        options.showParent = options.showParent || _dialogDefault.showParent;
        options.parent = options.parent || _dialogDefault.parent;
        options.headerCtrl = options.headerCtrl || _dialogDefault.headerCtrl;
        options.closeCtrl = options.closeCtrl || _dialogDefault.closeCtrl;
        options.titleCtrl = options.titleCtrl || _dialogDefault.titleCtrl;
        options.contentCtrl = options.contentCtrl || _dialogDefault.contentCtrl;
        options.closed = options.closed || _dialogDefault.closed;
        options.title = options.title || _dialogDefault.title;
        options.url = options.url || _dialogDefault.url;
        options.beforeShow = options.beforeShow || _dialogDefault.beforeShow;
        options.completeLoad = options.completeLoad || _dialogDefault.completeLoad;
        options.size = options.size || _dialogDefault.size;
        options.needHeader = options.needHeader == undefined ? _dialogDefault.needHeader : options.needHeader;
        options.needAnimate = options.needAnimate == undefined ? _dialogDefault.needAnimate : options.needAnimate;
        options.loadingText = options.loadingText || _dialogDefault.loadingText;
        options.vertical = options.vertical == undefined ? _dialogDefault.vertical : options.vertical;
        options.dispose = options.dispose == undefined ? _dialogDefault.dispose : options.dispose;
        options.needLoading = options.needLoading == undefined ? _dialogDefault.needLoading : options.needLoading;
        var ctrl = this;
        tcscdui.helper.hasId(ctrl, true, "dialog");
        this.dom = _this;
        this.options = options;
        //init
        var width = this.width = $(options.parent).width();
        //var height = this.height = $(options.parent).height();
        var style = {};
        var contentstyle = {};
        var size = 0;
        if (options.vertical) {
            style = {
                "opacity": "0", "height": "100%", "width": "100%", "transform": "translateY(100%)"
            }
            contentstyle = {
                "height": "100%", "width": "100%"
            };
        }
        else {
            size = parseInt(options.size) > 0 ? "calc(100% - " + parseInt(options.size) + "px)" : 0;
            style = {
                "transform": "translateX(104%)", "width": "100%"
            }
            contentstyle = {
                "width": "100%"
            }
        }
        _this.addClass("dialog").css(style);
        var header = _this.find(options.headerCtrl);
        var container = _this.find(options.contentCtrl);
        var source = _this.html();
        var _dialogpanel = _this.find(".dialogpanel");
        if (_dialogpanel.length == 0) {
            _dialogpanel = $("<div class='touch dialogpanel'></div>")
            _this.html(_dialogpanel);
        }
        _dialogpanel.addClass(options.vertical ? "vertical_c " : "content ");
        //将如果没有content。则把原div中的所有内容放到一个新的div中
        if (container.length == 0) {
            var contentHtml = "<div class='" + (options.vertical ? "board " : "main ") + "'>"
                + source
                + "</div>";
            _dialogpanel.html(contentHtml);
        }
        else if (_dialogpanel.find(options.contentCtrl).length == 0) {
            _dialogpanel.prepend(container);
        }
        if (options.needHeader) {
            //如果界面里面已经有header。那直接绑定上面的按钮，否则初始化一个页头
            if (header.length > 0) {
                header.addClass("header");
                $(options.titleCtrl).addClass("title close");
                $(options.closeCtrl).addClass("close");
                if (_dialogpanel.find(options.headerCtrl).length == 0) {
                    _dialogpanel.prepend(header);
                }
            }
            else {
                var ico = "returnico";
                if (options.vertical) {
                    ico = "closeico";
                }
                var headerHtml = "<div class='board header'>"
                    + "<div class='board_c over'>"
                    + "<div class='board_c_l close'><a class=' ico " + ico + "' href='javascript:;'></a></div>"
                    + "<div class='board_c_c'><span id='pagetitle' class='textoverflow title close'><span class='pagetitletext'>加载中</span></span></div>"
                    + "<div class='board_c_r'></div>"
                    + "</div>"
                    + "</div>";
                _dialogpanel.prepend(headerHtml);
                header = _dialogpanel.children(".header");
            }
            this.setTitle(options.title);
        }
        if (options.vertical) {
            contentstyle["top"] = "-webkit-calc(100% - " + (parseInt(_dialogpanel.outerHeight(true)) - 0 + 80) + "px)";
            //contentstyle["top"]="59%"
            //contentstyle["bottom"] = 0;
        }
        else {
            contentstyle["padding-left"] = size;
        }
        _dialogpanel.css(contentstyle);
        header.on("click", ".close", function () {
            ctrl.close();
        });
        //如果有showParent，则添加到相应的showParent下面
        if (options.showParent != "") {
            _this.appendTo($(options.showParent, parent.document));
        }
        //如果没有有，则把所有的dialog都提到父页面body根目录下
        //添加时会做判断，如果该页面已经有相同id的dialog。则会直接删除原有的dialog后再新增
        else {
            var dialogctrl = $("#" + _this.attr("id"), parent.document);
            if (dialogctrl.index() != _this.index()) {
                if (_this.attr("id") != undefined && dialogctrl.length > 0) {
                    dialogctrl.remove();
                }
                //if ($("[id*=dialog_" + _this.attr("id") + "]", parent.document).length > 0) {
                //    $("[id*=dialog_" + _this.attr("id") + "]", parent.document).remove();
                //}
                _this.appendTo($("body", parent.document));
            }
        }
        //是否自动显示出来
        if (options.autoShow) {
            this.show(options.title, options.url, options.beforeShow, options.completeLoad);
        }
    }
    dialog.prototype = {
        show: function (title, url, beforeShow, completeLoad, closed) {
            var _dom = this.dom;
            var options = this.options;
            var _content = _dom.find(".dialogpanel");
            var pageloading;
            if (!options.dispose) {
                window.parent.dialogs.push(this);
            }
            var url = options.url == "" ? url : options.url;
            var iframeID = "";
            var vertical = options.vertical;
            var style;
            var contentstyle;
            if (typeof (beforeShow) == "function") {
                options.beforeShow = beforeShow;
            }
            if (typeof (completeLoad) == "function") {
                options.completeLoad = completeLoad;
            }
            if (typeof (closed) == "function") {
                options.closed = closed;
            }
            var before = options.beforeShow;
            var loaded = options.completeLoad;
            before();
            _dom.removeClass("defaultAnimation");
            if (vertical) {
                _content.css("top", "-webkit-calc(100% - " + (parseInt(_content.find(".form").outerHeight(true)) - 0 + 80) + "px)");
                style = {
                    "opacity": "0",
                    "transform": "translateY(100%)",
                }
                _dom.css(style);
                style = {
                    "opacity": "1",
                    "transform": "translateY(0%)",
                    "z-index": "9999"
                }
                _dom.css(style);
                if (options.needAnimate) {
                    _dom.addClass("defaultAnimation");
                }
            }
            else {
                this.setTitle(title);
                style = {
                    "opacity": "0",
                    "transform": "translateX(104%)"
                }
                _dom.css(style);
                style = {
                    "opacity": "1",
                    "transform": "translateX(0%)",
                    "z-index": "9999"
                }
                _dom.css(style);
                if (options.needAnimate) {
                    _dom.addClass("defaultAnimation");
                }
                if (typeof (url) == "string" && url != "") {

                    //如果需要记载界面则显示加载界面，并在iframe加载后隐藏
                    if (options.needLoading) {
                        pageloading = $.tooltip({
                            type: tooltiptype.loading,
                            parent: _dom.find(".main"),
                            autoShow: true,
                            content: options.loadingText
                        })
                    }
                    _dom[0].addEventListener("webkitTransitionEnd", LoadingPage);
                }
            }
            function LoadingPage() {
                var iframeID = "imain" + new Date().getTime();
                var iframeHtml = "<iframe frameborder='0' src='" + url + "' style='height:100%;width:100%' scrolling='yes' marginheight='0' marginwidth='0' name='" + iframeID + "' id='" + iframeID + "'></iframe>";
                var iframe = _dom.find(".main").append(iframeHtml).find("#" + iframeID).get(0);
                if (iframe.attachEvent) {
                    iframe.attachEvent("onload", function () {
                        //以下操作必须在iframe加载完后才可进行
                        if (options.needLoading) {
                            pageloading.close();
                        }
                        loaded();
                    });
                } else {
                    iframe.onload = function () {
                        //以下操作必须在iframe加载完后才可进行
                        if (options.needLoading) {
                            pageloading.close();
                        }
                        loaded();
                    };
                }
                _dom[0].removeEventListener("webkitTransitionEnd", LoadingPage);
            }
            return this;
        },
        close: function (callback) {
            var _dom = this.dom;
            var options = this.options;
            if (typeof (callback) == typeof (Function)) {
                options.closed = callback;
            }

            var iframe = _dom.find("iframe", parent.document);
            if (iframe.length > 0) {
                iframe.remove();
            }
            if (options.dispose) {
                _dom.remove();
                _dom = null;
            }
            else {
                window.parent.dialogs.splice(-1, 1);
                var style = {
                };
                if (options.vertical) {
                    style = {
                        "opacity": "0",
                        "transform": "translateY(100%)",
                        "z-index": "-1"
                    }
                }
                else {
                    style = {
                        "opacity": "0",
                        "transform": "translateX(104%)",
                        "z-index": "-1"
                    }
                }
                _dom.css(style);
            }
            options.closed();
        },
        setTitle: function (title) {
            var _dom = this.dom;
            _dom.find(".header").find(".title").html(title);
        },
        setContent: function (content) {
            var _dom = this.dom;
            var _container = _dom.find(".dialogpanel>.main,.dialogpanel>.board_c");
            _container.html(content);
        }
    };
    $.fn.dialog = function (options) {
        return new dialog($(this).eq(0), options);
    }
    /*弹出窗完*/




    /*表单*/
    //获取表单数据

    var formSubmit = function (_this, options) {
        var _formDefault = {
            url: "",
            submit: function () {
            },
            beforeSend: function () {
            },
            type: "POST",
            cache: true,
            pparamValue: "info",//当外部有引用值时，内部元素包裹在某一个元素下
            pparam: null,//内部，例：{username:"abc",password:"123"}
            sparam: null,// 外部{info:{username:"abc",password:"123"},category:'1'}
            success: function (data) { }
        }
        options = options || _formDefault;
        options.url = options.url || _formDefault.url;
        options.success = options.success || _formDefault.success;
        options.beforeSend = options.beforeSend || _formDefault.beforeSend;
        options.submit = options.submit || _formDefault.submit;
        options.type = options.type || _formDefault.type;
        options.pparamValue = options.pparamValue || _formDefault.pparamValue;
        options.pparam = options.pparam || _formDefault.pparam;
        options.sparam = options.sparam || _formDefault.sparam;
        options.cache = options.cache == undefined ? _formDefault.cache : options.cache;
        options.beforeSend();
        $.extendpost({
            url: options.url,
            type: options.type,
            cache: options.cache,
            data: $(_this).serializeJson(),
            contentType: "application/json",
            pparamValue: options.pparamValue,
            pparam: options.pparam,//内部
            sparam: options.sparam,// 外部
            beforeSend: function () {
                options.submit();
            },
            success: function (result) {
                options.success(result);
            }
        })
    }
    $.fn.formSubmit = function (options) {
        return new formSubmit($(this).eq(0), options);
    }

    /*表单完*/



    /*分页及刷新*/

    var paging = function (_this, options) {
        var _pagingDefault = {
            reloadText: "把手松开",
            reloadImg: "",
            reloadLoadText: "加载中，请稍后",
            reloadStyle: "",
            pagingText: "把手松开",
            pagingImg: "",
            pagingLoadText: "加载中，请稍后",
            pagingEndText: "到底了，没有了",
            pagingStyle: "",//上拉分页的更新值
            allowReload: false,//下拉刷新总开关
            reloadUrl: "",//reloadUrl为空时，下拉刷新会直接刷新该页面
            reloadType: "get",
            reloadCache: true,
            pagingUrl: "",//上拉分页请求的api地址。不用带分页数据，如果该数据为空，则不允许上拉分页
            pagingType: "get",
            pagingCache: true,
            dataColumn: "body.records",
            data: [],//初始值
            param: {
            },//分页请求时，除了分页和时间之外的其他参数
            pageSize: 10,//分页请求数量
            pageIndexColumn: "page",//请求分页时，自动添加到url参数的页数
            pageSizeColumn: "pageSize",//请求分页时，自动添加到url参数的请求数量
            timeColumn: "endtime",//下拉刷新时，自动添加到url参数的数据截止时间
            totalColumn: "body.recordCount",//返回的数据中，用于统计所有条数的字段
            container: ".main",//设置分页控件高度的参考控件
            onBind: function (data, source) { }//数据绑定完成之后的事件
        }
        options = options || _pagingDefault;
        options.reloadCache = options.reloadCache != undefined ? options.reloadCache : _pagingDefault.reloadCache;
        options.pagingCache = options.pagingCache != undefined ? options.pagingCache : _pagingDefault.pagingCache;
        options.allowReload = options.allowReload != undefined ? options.allowReload : _pagingDefault.allowReload;
        options.reloadLoadText = options.reloadLoadText || _pagingDefault.reloadLoadText;
        options.reloadStyle = options.reloadStyle || _pagingDefault.reloadStyle;
        options.pagingStyle = options.pagingStyle || _pagingDefault.pagingStyle;
        options.reloadImg = options.reloadImg || _pagingDefault.reloadImg;
        options.pagingImg = options.pagingImg || _pagingDefault.pagingImg;
        options.pagingLoadText = options.pagingLoadText || _pagingDefault.pagingLoadText;
        options.pagingEndText = options.pagingEndText || _pagingDefault.pagingEndText;
        options.reloadText = options.reloadText || _pagingDefault.reloadText;
        options.pagingText = options.pagingText || _pagingDefault.pagingText;
        options.dataColumn = options.dataColumn != undefined ? options.dataColumn : _pagingDefault.dataColumn;
        options.data = options.data || _pagingDefault.data;
        options.param = options.param || _pagingDefault.param;
        options.pageSize = options.pageSize || _pagingDefault.pageSize;
        options.pageIndexColumn = options.pageIndexColumn || _pagingDefault.pageIndexColumn;
        options.pageSizeColumn = options.pageSizeColumn || _pagingDefault.pageSizeColumn;
        options.totalColumn = options.totalColumn || _pagingDefault.totalColumn;
        options.timeColumn = options.timeColumn || _pagingDefault.timeColumn;
        options.reloadUrl = options.reloadUrl || _pagingDefault.reloadUrl;
        options.reloadType = options.reloadType || _pagingDefault.reloadType;
        options.pagingUrl = options.pagingUrl || _pagingDefault.pagingUrl;
        options.pagingType = options.pagingType || _pagingDefault.pagingType;
        options.container = options.container || _pagingDefault.container;
        options.onBind = options.onBind || _pagingDefault.onBind;

        this.listControl = $(_this).bindData({ allowLoading: false, dataColumn: "" });
        var _dom = this;
        options.hasend = false;
        var cont = _this.get(0);
        var parent = _this.parent().get(0);
        //_this.css({ "height": $(options.container).outerHeight(false), "overflow-y": "auto" });
        var contId = new Date().getTime();
        var style = "reload";
        var reloadHtml = tcscdui.helper.createLoadingDom(cont.tagName, "reload_" + contId, style, options.reloadStyle);
        var reloadCont = $(reloadHtml);
        var reloadHeight = reloadCont.height();
        style = "paging";
        var pagingHtml = tcscdui.helper.createLoadingDom(cont.tagName, "paging_" + contId, style, options.pagingStyle);
        _dom.pagingCont = $(pagingHtml)
        var pagingHeight = _dom.pagingCont.height();
        var startPointX = 0;
        var startPointY = 0;
        var reloadOrPaging = "";
        options.total = 0;
        options.pageIndex = 0;
        this.options = options;
        var isInit = true;
        this.endTime = new Date().getTime();
        var source = [];
        try {
            source = eval("options.data" + (options.dataColumn == "" ? "" : "." + options.dataColumn));
        }
        catch (e) {

        }
        if (Array.isArray(source) && source.length > 0) {
            _dom.setData(source, true, true);
        }
        else {
            _dom.pagingCont.appendTo(_this);
            _dom.pagingCont.show(0)
            tcscdui.helper.createTouchDom(_dom.pagingCont, options.pagingLoadText, options.pagingImg);
            _dom.setUrl(options.pagingUrl, options.param, isInit, false, true)
        }
        isInit = false;
        var allowPage = options.pagingUrl != "";
        cont.addEventListener("touchstart", PagingTouchStart, false);
        cont.addEventListener("touchmove", PagingTouchMove, false);
        cont.addEventListener("touchend", PagingTouchEnd, false);
        var clockY = false;
        var firstMove = true;
        function PagingTouchStart(event) {
            clockY = false;
            firstMove = true;
            var touch = event.targetTouches[0];
            startPointX = touch.clientX;
            startPointY = touch.clientY;
            //如果允许下拉刷新，则添加用于显示下拉刷新的状态的控件，并初始化显示值
            if (options.allowReload) {
                reloadCont.insertBefore(_this);
                reloadCont.hide(0);
                tcscdui.helper.createTouchDom(reloadCont, options.reloadText, options.reloadImg);
            }
            //如果允许上拉分页，则添加用于显示上拉分页的状态的控件，并初始化显示值
            if (allowPage && !options.hasend) {
                _dom.pagingCont.appendTo(_this);
                _dom.pagingCont.hide(0);
                tcscdui.helper.createTouchDom(_dom.pagingCont, options.pagingText, options.pagingImg);
            }
        }
        function PagingTouchMove(event) {
            if (!clockY) {
                var touch = event.targetTouches[0];
                var nowPointX = touch.clientX;
                var nowPointY = touch.clientY;
                var offsetX = nowPointX - startPointX;
                var offsetY = nowPointY - startPointY;
                if (Math.abs(offsetY) < Math.abs(offsetX) && firstMove) {
                    clockY = true;
                }
                else {
                    //如果是下拉刷新，则通过拖动量计算能够显示加载状态的高度
                    if (offsetY > 0 && _this.scrollTop() <= 0 && options.allowReload) {
                        event.preventDefault();
                        reloadOrPaging = "reload";
                        _dom.pagingCont.hide(0);
                        reloadCont.show(0)
                        reloadCont.css("height", Math.log(offsetY) * 7);
                    }
                    //如果是上拉分页，则通过拖动量计算能够显示加载状态的高度
                    else if (offsetY < 0 && _this.scrollTop() + $(parent).height() >= cont.scrollHeight && allowPage) {
                        event.preventDefault();
                        reloadOrPaging = "paging";
                        reloadCont.hide(0)
                        _dom.pagingCont.show(0)
                        _dom.pagingCont.css("height", Math.log(-offsetY) * 7);
                    }
                }
            }
            firstMove = false;
        }

        function PagingTouchEnd(event) {
            if (!clockY) {
                switch (reloadOrPaging) {
                    case "reload":
                        //放手之后，更改状态显示文字，并开始加载，如果是下拉刷新，则会判断reloadUrl地址是否为空，如果为空，则刷新页面
                        if (reloadCont.height() >= reloadHeight) {
                            tcscdui.helper.createTouchDom(reloadCont, options.reloadLoadText, options.reloadImg);
                            if (options.reloadUrl == "" && options.allowReload) {
                                window.location.href = window.location;
                            }
                            else if (options.allowReload && options.reloadUrl) {
                                _dom.setUrl(options.reloadUrl, options.param, isInit, true, false);
                            }
                        }
                        break;
                    case "paging":
                        //放手后，判断已经显示的数量是否达到了数据的上限，如果是，则不请求API，直接显示没有数据的提示
                        if (_dom.pagingCont.height() >= pagingHeight) {
                            if (options.total <= options.pageIndex || options.pagingUrl == "") {
                                tcscdui.helper.createTouchDom(_dom.pagingCont, options.pagingEndText, options.pagingImg);
                                options.hasend = true;
                            }
                            else if (options.pagingUrl != "") {
                                tcscdui.helper.createTouchDom(_dom.pagingCont, options.pagingLoadText, options.pagingImg);
                                _dom.setUrl(options.pagingUrl, options.param, isInit, false, true)
                            }
                            else {

                            }
                        }
                        break;
                }
            }
        }
    }
    paging.prototype = {
        setData: function (source, isInit, prep) {
            var options = this.options;
            isInit = isInit == undefined ? false : isInit;
            if (isInit) {
                options.pageIndex = 0;
                this.listControl.setData(source);
            }
            else {
                this.listControl.insertData(source, prep == undefined ? false : prep);
            }
        },
        setUrl: function (url, param, isInit, prep, needTotal) {
            var _this = this;
            var options = this.options;
            prep = prep == undefined ? false : prep;
            param = param ? $.extendParam({}, param) : $.extendParam({}, options.param);
            if (prep) {
                var time = {
                };
                time[options.timeColumn] = _this.endTime
                param = $.extendParam(param, time);
                _this.endTime = new Date().getTime;
            }
            else {
                var size = {
                };
                var index = {
                };
                size[options.pageSizeColumn] = options.pageSize;
                index[options.pageIndexColumn] = options.pageIndex;
                param = $.extendParam(param, size);
                param = $.extendParam(param, index);
            }
            $.extendget({
                url: url,
                cache: options.pagingCache,
                type: options.pagingType,
                data: param,
                success: function (result) {
                    var _data = eval("result" + (options.dataColumn == "" ? "" : "." + options.dataColumn));
                    _this.pagingCont.hide();
                    _this.setData(_data, isInit == undefined ? false : isInit, prep);
                    needTotal = needTotal == undefined ? true : needTotal;
                    if (_data.length > 0) {
                        if (needTotal) {
                            options.pageIndex++;
                            //数据总页数
                            options.total = Math.ceil(eval("result" + (options.totalColumn == "" ? "" : "." + options.totalColumn)) / options.pageSize);
                        }
                    }
                    else if (needTotal) {
                        //如果是需要分页的，且没有请求的数据，则表示已经把所有数据加载完成。
                        //_this.pagingCont.appendTo(_this);
                        tcscdui.helper.createTouchDom(_this.pagingCont, options.pagingEndText, options.pagingImg);
                        _this.pagingCont.show(0);
                        options.hasend = true;
                    }
                    options.onBind(_data, result);
                }
            })
        }
    }

    $.fn.paging = function (options) {

        return new paging($(this).eq(0), options);
    }

    /*分页及刷新完*/



    /*动态分列*/
    var _rowsDefault = {
        control: "body"
    }

    var rows = function (options) {
        options = options || _rowsDefault;
        options.control = options.control || _rowsDefault.control;
        //alert("1");
        for (var index = 0; index < $(options.control).find("[class*='cols-']").parent().length; index++) {
            var row = $(options.control).find("[class*='cols-']").parent().eq(index).get(0);
            //var parentWidth = $(row).width();
            var countRows = new Array();
            //$(row).html($(row).html().replace(/(>\s*<)/g, "><"));这段话有歧义
            var childControl = $(row).children("[class*='cols-']");
            $.each(childControl, function (i, r) {
                var num = r.className.replace(/[^0-9]/ig, "");
                countRows.push(num);
            })
            //多少列换行
            var colsRows = "";
            if (row.className.match(/rows-/) != null) {
                colsRows = row.className.substring(row.className.indexOf("rows-"));
                colsRows = colsRows.substring(0, colsRows.indexOf(" ") > -1 ? colsRows.indexOf(" ") : colsRows.length).replace(/[^0-9]/ig, "");
            }
            var fixed = row.className.indexOf("rows-fix") > -1;
            var drag = row.className.indexOf("rows-drag") > -1;
            if (!colsRows || colsRows == "" || colsRows == 0) {
                colsRows = countRows.length;
            }

            var countCols = countRows.length / colsRows;
            for (var currentCol = 0; currentCol < countCols; currentCol++) {
                var lastWidth = 100;
                var countCells = 0;
                var currentColRows = 0;
                //计算剩余单元格数是否大于每行要求的单元格数
                if (Math.floor((childControl.length - ((currentCol + 1) * colsRows - colsRows)) / colsRows) < 1) {
                    //如果不符合，已实际单元格数为准
                    currentColRows = childControl.length - ((currentCol + 1) * colsRows - colsRows);
                }
                else {
                    currentColRows = colsRows;
                }
                //计算该行的总单元格数
                for (var currentCell = 0; currentCell < currentColRows; currentCell++) {
                    countCells += parseInt(countRows[currentCol * colsRows + currentCell]);
                }

                var cellindex = 0;
                for (var currentCell = 0; currentCell < currentColRows; currentCell++) {
                    var margin = 0;
                    var rowsindex = currentCol * colsRows + currentCell;
                    var currentControl = childControl[rowsindex];
                    //因为margin会影响最终显示，所以计算单元格宽度时，需要减去margin
                    //如果是该行最后一个单元格，则用剩余的宽度减去margin
                    if (currentCell == currentColRows - 1) {
                        if (currentColRows == colsRows) {
                            $(currentControl).attr('class', $(currentControl).attr("class").replace("cols-margin", "cols").replace("cols-borderh", "cols-bordernoright"));
                        }
                        margin = parseInt($(currentControl).outerWidth(true) - $(currentControl).outerWidth(false));
                        //平均计算每一列的宽度，并向上取整，最后一列用剩余宽度赋值
                        if (fixed && currentColRows != colsRows * (cellindex + 1)) {
                            //$(currentControl).width(Math.ceil(100 / colsRows) - margin);
                            $(currentControl).css("width", "calc(" + (100 / colsRows) + "%" + " - " + margin + "px)");
                        }
                        //平均计算每一列的宽度，并向下取整，保证每一列的宽度都一样
                        else if (drag) {
                            //$(currentControl).css("width", (Math.floor(100 / colsRows) - margin) + "%");
                            $(currentControl).css("width", "calc(" + (100 / colsRows) + "%" + " - " + margin + "px)");
                        }
                        else {
                            $(currentControl).css("width", "calc(" + lastWidth + "%" + " - " + margin + "px)");


                            //$(currentControl).width(lastWidth - margin);
                        }
                        cellindex++;
                    }
                    else {
                        margin = parseInt($(currentControl).outerWidth(true) - $(currentControl).outerWidth(false));
                        //平均计算每一列的宽度，并向上取整，最后一列用剩余宽度赋值
                        if (fixed) {
                            var rowWidth = 100 / colsRows;
                            //$(currentControl).width(rowWidth - margin);
                            $(currentControl).css("width", "calc(" + rowWidth + "%" + " - " + margin + "px)");
                            lastWidth = lastWidth - rowWidth;
                        }
                        //平均计算每一列的宽度，并向下取整，保证每一列的宽度都一样
                        else if (drag) {
                            var rowWidth = 100 / colsRows;
                            //$(currentControl).width(rowWidth - margin);
                            $(currentControl).css("width", "calc(" + rowWidth + "%" + " - " + margin + "px)");

                        }
                        else {
                            //如果不是最后一个单元格，则用总宽度减去计算出来的列宽度
                            var rowWidth = 100 / countCells * countRows[rowsindex];
                            //$(currentControl).width(rowWidth - margin);
                            $(currentControl).css("width", "calc(" + rowWidth + "%" + " - " + margin + "px)");
                            lastWidth = lastWidth - rowWidth;
                        }
                    }
                }
            }
        }
    }
    $.rows = function (options) {
        return rows(options);
    }
    /*动态分列*/


    /*单选、复选*/

    var selected = function (_this, options) {
        var _selectedDefault = {
            data: [],//原始数据
            multi: false,//是否为单选
            group: "",//验证分组，如果group一样。即使是多个selected控件，最终的值也会进行合并，单选的话，同一个group的多个控件也只能选择一个值
            value: "value",//值所在的字段名
            text: "text",//文字所在的字段名
            name: "",
            selected: "",
            required: true,
            valid: "",
            onSelect: function (data) { }
        }
        options = options || _selectedDefault;
        options.data = options.data || _selectedDefault.data;
        options.multi = options.multi != undefined ? options.multi : _selectedDefault.multi;
        options.required = options.required != undefined ? options.required : _selectedDefault.required;
        options.valid = options.valid || _selectedDefault.valid;
        options.group = options.group || _selectedDefault.group;
        options.value = options.value || _selectedDefault.value;
        options.text = options.text || _selectedDefault.text;
        options.name = options.name != undefined ? options.name : _selectedDefault.name;
        options.selected = options.selected || _selectedDefault.selected;
        options.onSelect = options.onSelect || _selectedDefault.onSelect;
        this.options = options;
        var ctrl = this;
        var html = CreateHtml();
        $(html).appendTo(_this);
        $("." + options.group).find(".selecteditem").bind("click", function () {
            if (!options.multi) {
                var item = this;
                $.each($("." + options.group).find(".selecteditem"), function (index, row) {
                    if (item !== row) {
                        $(row).removeClass("select");
                    }
                })
            }
            var value = $(this).children("a").attr("value");
            //判断是否已经选中过此控件，如果没有选中，则判断是否必须选一项，以上条件都符合，则选中该列，否则取消选中状态
            if ($(this).hasClass("select")) {
                if (!options.required || options.multi) {
                    $(this).removeClass("select");
                    ctrl.removeValue(value);
                }
            }
            else {
                $(this).addClass("select");
                ctrl.setValue(value);
            }
        })
        function CreateHtml() {
            options.group = options.group == "" ? tcscdui.helper.createDomName("selected") : options.group;
            var postfix = tcscdui.helper.createDomName("selected");
            var html = "<div class='selected " + (options.multi ? "selected_multi " : "") + options.group + "'>"
                + "<ul class='selected_c'>";
            $.each(options.data, function (index, row) {
                html += "<li class='selecteditem " + (row[options.value] == options.selected ? "select" : "") + "'>"
                    + "<a href='javascript:;' class='selecteditem_c' value='" + row[options.value] + "'>"
                    + row[options.text]
                    + "</a>"
                    + "</li>";
            })
            html += "</ul>"
                + "<input type='hidden' id='" + postfix + "' data-valid='" + (options.valid == "" ? "" : options.valid) + "' name='" + (options.name == "" ? postfix : options.name) + "' value='" + options.selected + "'/>"
                + "</div>";
            return html;
        }
    }
    selected.prototype = {
        setMultiValues: function (value, isAdded) {
            var options = this.options;
            var valueCont = document.getElementsByName(options.name);
            var source = $(valueCont).val();
            var selecteds = new Array();
            if (options.multi) {
                selecteds = source.length > 0 ? source.split(",") : [];
                if (isAdded) {
                    selecteds.push(value);
                }
                else {
                    selecteds.remove(value);
                }
                $(valueCont).val(selecteds.join());
            }
            else {
                selecteds[0] = value;
                $(valueCont).val(value);
            }
            options.onSelect(selecteds);
        },
        setValue: function (value) {
            this.setMultiValues(value, true);
        },
        removeValue: function (value) {
            this.setMultiValues(value, false);
        }
    }
    $.fn.selected = function (options) {

        return new selected($(this).eq(0), options);
    }
    /*单选、复选完*/



    /*轮播*/

    var silder = function (_this, options) {
        var _silderDefault = {
            url: "",//轮播图片请求url地址
            param: {
            },//url请求时，附带的参数
            data: [],//和url二选一，默认值
            dataColumn: "Data",//请求后的数据字段
            prep: false,//请求的数据添加在原来的数据前面还是后面
            holdIndex: -1,//保持不变的数据，
            async: true,
            onBind: function (data) {
            },//数据加载时运行的方法
            titleCtrl: ".sildertitle",//显示轮播小缩略点的控件
            contentCtrl: ".sildercontent",//显示轮播实际内容的控件
            defaultIndex: 0,//从第几个图的索引开始显示
            autoAnimate: true,//是否有动画
            animateTime: 3000,//单个轮播停留时间
            allowLoading: true,
        }
        options = options || _silderDefault;
        options.data = options.data || _silderDefault.data;
        options.url = options.url || _silderDefault.url;
        options.dataColumn = options.dataColumn != undefined ? options.dataColumn : _silderDefault.dataColumn;
        options.param = options.param || _silderDefault.param;
        options.holdIndex = options.holdIndex != undefined ? options.holdIndex : _silderDefault.holdIndex;
        options.async = options.async != undefined ? options.async : _silderDefault.async;
        options.onBind = options.onBind || _silderDefault.onBind;
        options.titleCtrl = options.titleCtrl || _silderDefault.titleCtrl;
        options.contentCtrl = options.contentCtrl || _silderDefault.contentCtrl;
        options.defaultIndex = options.defaultIndex || _silderDefault.defaultIndex;
        options.multitab = true;
        options.autoAnimate = options.autoAnimate == undefined ? _silderDefault.autoAnimate : options.autoAnimate;
        options.allowLoading = options.allowLoading == undefined ? _silderDefault.allowLoading : options.allowLoading;
        options.animateTime = options.animateTime || _silderDefault.animateTime;
        var onBind = options.onBind;
        //调用tabs方法生成轮播，调用bindData加载数据
        var _content = _this.find(options.contentCtrl)
        options.onBind = function (data) {
            _content.addClass("sildercontent");
            var _title = _this.find(options.titleCtrl);
            if (_title.length == 0) {
                var titlehtml = "<ul class='over sildertitle'>";
                for (var item = 0; item < data.length; item++) {
                    titlehtml += "<li class='boarditem'><a href='javascript:;' class='boarditem_c'></a></li>";
                }
                titlehtml += "</ul>";
                _content.after(titlehtml);
            }
            else {
                _title.addClass("sildertitle");
            }
            _this.tabs(options);
            onBind(data);
        }
        _content.bindData(options);
    }
    $.fn.silder = function (options) {
        return new silder($(this).eq(0), options);
    }
    /*轮播完*/


    /*选项卡*/

    var tabs = function (_this, options) {
        var _tabsDefault = {
            titleCtrl: ".tabstitle",//显示选项卡头部的字段
            contentCtrl: ".tabscontent",//显示选项卡内容的字段
            defaultIndex: 0,//从第几个选型卡开始显示
            multitab: true,//true代表会有多个内容框。false代表只有一个内容框
            autoAnimate: false,//是否需要自动滚动
            animateTime: 3000,//自动滚动间隔时间
            onChange: function (eq) { },
        };
        options = options || _tabsDefault;
        options.titleCtrl = options.titleCtrl || _tabsDefault.titleCtrl;
        options.contentCtrl = options.contentCtrl || _tabsDefault.contentCtrl;
        options.defaultIndex = options.defaultIndex || _tabsDefault.defaultIndex;
        options.multitab = options.multitab == undefined ? _tabsDefault.multitab : options.multitab;
        options.autoAnimate = options.autoAnimate == undefined ? _tabsDefault.autoAnimate : options.autoAnimate;
        options.animateTime = options.animateTime || _tabsDefault.animateTime;
        options.onChange = options.onChange || _tabsDefault.onChange;
        var ctrl = this;
        this.dom = _this;
        this.options = options;
        setTitle();
        setContent();
        var titleitembox = _this.find(".tabstitleitem");
        $.each(titleitembox, function (index, row) {
            $(row).bind("click", function () {
                //点击标头时，可以手动设置显示该标头对应的板块
                ctrl.setCheck(index);
            })
        });
        if (options.autoAnimate) {
            index = 0;
            setInterval(function () {
                index = ctrl.setCheck(index);
                index++;
                if (index == titleitembox.length) {
                    index = 0;
                }
            }, options.animateTime)
        }
        function setContent() {
            var width = _this.width();
            var titlebox = _this.find(options.titleCtrl);
            var contentbox = _this.find(options.contentCtrl);
            //contentbox.css(titlebox.index() > contentbox.index() ? "bottom" : "top", titlebox.outerHeight(true) + "px").addClass("tabscontent").children().addClass(contentbox.children().hasClass("tabscontentitem") ? "" : "tabscontentitem");
            contentbox.addClass("tabscontent").children().addClass(contentbox.children().hasClass("tabscontentitem") ? "" : "tabscontentitem");
            var items = contentbox.find(".tabscontentitem");
            //contentbox.width("100%");
            var lefts = new Array();
            $.each(items, function (index, row) {
                var X = (index - options.defaultIndex) * 100;
                $(row).css({ "transform": "translateX(" + X + "%)" });
                lefts.push(X);
            });
            var parent = _this.find(".tabscontentitem");

            $.each(parent, function (index, row) {
                row.addEventListener("touchstart", TabsTouchStart, false);
                row.addEventListener("touchmove", TabsTouchMove, false);
                row.addEventListener("touchend", TabsTouchEnd, false);
                var startPointX = 0;
                var startPointY = 0;
                var offsetX = 0;
                var offsetY = 0;
                var clockX = false;
                var firstMove = true;
                function TabsTouchStart(event) {
                    offsetX = 0;
                    offsetY = 0;
                    clockX = false;
                    firstMove = true;
                    lefts = [];
                    $.each(parent, function (i, r) {
                        lefts.push(parseInt(r.style.webkitTransform.replace(/[^\-?0-9]+/g, '')));
                    });
                    var touch = event.targetTouches[0];
                    startPointX = touch.clientX;
                    startPointY = touch.clientY;
                }
                function TabsTouchMove(event) {
                    if (!clockX) {
                        var touch = event.targetTouches[0];
                        var nowPointX = touch.clientX;
                        var nowPointY = touch.clientY;
                        offsetX = nowPointX - startPointX;
                        offsetY = nowPointY - startPointY;
                        indexs = parent.length - 1;
                        //tabs仅支持横屏滑动，如果手势为竖滑，锁定tabs
                        if (Math.abs(offsetX) <= Math.abs(offsetY) && firstMove) {
                            clockX = true;
                        }
                        else {
                            //内容框根据手的滑动而滑动
                            if (offsetX > 0 && index > 0 || offsetX < 0 && index < indexs) {
                                event.preventDefault();
                                $.each(parent, function (i, r) {
                                    $(r).removeClass("slowAnimation");
                                    $(r).css("transform", "translateX(calc(" + lefts[i] + "% + (" + offsetX + "px)))");
                                    //alert("translateX(calc(" + lefts[i] + "% + " + offsetX + "px))");
                                })

                            }
                            else {
                                offsetX = 0;
                            }
                        }
                    }
                    firstMove = false;
                }
                function TabsTouchEnd(event) {
                    if (offsetX != 0 && !clockX) {
                        var newLeft = 0;
                        var titles = _this.find(".tabstitleitem");
                        var currentItemEq = titles.index(_this.find(".active"));
                        //松手以后，如果移动距离超过内容狂宽度的4分之1，则直接跳到下一个窗口进行显示，根据左滑或右划判断应该显示上一个还是下一个窗口
                        if (Math.abs(offsetX) > width / 4) {
                            if (offsetX > 0) {
                                currentItemEq--;
                            }
                            else {
                                currentItemEq++;
                            }
                        }
                        $.each(parent, function (i, r) {
                            //窗口滑动后，其他的窗口根据排列顺序同步滑动到该在的位置
                            if (offsetX > 0) {
                                $(r).css("transform", "translateX(" + ((i - currentItemEq) * 100) + "%)");
                            }
                            else {
                                $(r).css("transform", "translateX(" + (-(currentItemEq - i) * 100) + "%)");
                            }
                        })
                        var currentItem = titles.eq(currentItemEq);
                        if (currentItem != undefined) {
                            currentItem.addClass("active").siblings(".tabstitleitem").removeClass("active");
                        }

                    }
                }
            })
        }
        function setTitle() {
            var titlebox = _this.find(options.titleCtrl).addClass("tabstitle");
            $.rows(options.titleCtrl);
            titlebox.children().addClass(titlebox.children().hasClass("tabstitleitem") ? "" : "tabstitleitem");
            ctrl.setCheck(options.defaultIndex);
        }
    }
    tabs.prototype = {
        setCheck: function (eq, callback) {
            var options = this.options;
            var _this = this.dom;
            if (callback) {
                options.onChange = callback;
            }
            var titleitems = _this.find(".tabstitleitem");
            var oldCheckeq = titleitems.index(_this.find(".active"));
            if (oldCheckeq != eq) {
                var currentItem = titleitems.eq(eq);
                if (currentItem != undefined) {
                    currentItem.addClass("active").siblings(".tabstitleitem").removeClass("active");
                    if (options.multitab && titleitems.length == _this.find(".tabscontentitem").length) {
                        //设置新的显示窗口，并将剩下的窗口依次位移
                        $.each(_this.find(".tabscontentitem"), function (i, r) {
                            var newLocal = (i - eq) > 0 ? 1 : ((i - eq == 0) ? 0 : -1);
                            $(r).css("transform", "translateX(" + newLocal * 100 + "%)");
                            (i == eq || i == oldCheckeq) ? $(r).addClass("defaultAnimation") : $(r).removeClass("defaultAnimation");
                        })
                    }
                }
                else {
                    currentItem = null;
                }
            }
            options.onChange(eq);
            return eq;
        }
    }
    $.fn.tabs = function (options) {

        return new tabs($(this).eq(0), options);
    }
    /*选项卡完*/

    /*级联滑动*/

    var droplist = function (options) {
        var _droplistDefault = {
            data: {
            },//数据,例
            //var data = {
            //    data: [{
            //        value: year,//year为{{year:2015},{year:2016}}
            //        defaultValue: options.defaultYear > 0 ? options.defaultYear : now.getFullYear(),
            //        valueColumn: "year",
            //        onChange: function (data) {
            //            var newdata = {
            //                data: [{
            //                    value: {},
            //                    valueColumn: "month"
            //                }]
            //            };
            //            var nowmonth = data[1].value;
            //            for (var item = 0; item < 12; item++) {
            //                newdata.data[0].value[item] = { "month": (item + 1) };
            //            }
            //            return newdata;
            //        }
            //    }
            itemHeight: 30,
            callback: function (data) { },//完成后的方法,
            cancel: function () { }
        }
        options = options || _droplistDefault;
        options.data = options.data || _droplistDefault.data;
        options.callback = options.callback || _droplistDefault.callback;
        options.cancel = options.cancel || _droplistDefault.cancel;
        options.itemHeight = options.itemHeight != undefined ? options.itemHeight : _droplistDefault.itemHeight;
        var _this = this;
        this.options = options;
        this.dialog = createHtml();
        function createHtml() {
            var droplistId = "droplist" + new Date().getTime()
            var data = options.data;
            var callback = options.callback;
            var droplistheight = $(document).height() / 7 * 2;
            //生成弹出窗口
            var html = "<div id='" + droplistId + "' class='dialog'>";
            html += "<div class='touch dialogpanel vertical_c'>";
            html += "<div class='board header'>";
            html += "<div class='board_c rows-3 over'>";
            html += "<div class='board_c_l cols-2'>";
            html += "<a class='padding_l close cancel ico closeico' href='javascript:;'></a>";
            html += "</div>";
            html += "<div class='board_c_c cols-8'>";
            html += "<span id='pagetitle textoverflow' class='title'>";
            html += "</span>";
            html += "</div>";
            html += "<div class='board_c_r cols-2'>";
            html += "<a class='padding_r save close btn btnDialogSubmit' href='javascript:;'><span>保存</span></a>";
            html += "</div>";
            html += "</div>";
            html += "</div>";
            html += "<div class='board_c main cols-1 margin_b'>";
            //根据数组绑定传回来的数据分为多少列和每列的数据
            $.each(data.data, function (index, row) {
                var textColumn = row.textColumn == undefined ? row.valueColumn : row.textColumn;
                if (textColumn != undefined) {
                    html += "<div class='board_item droplist_item cols-1' style='height:" + droplistheight + "px'>";
                    html += "<ul style='padding:" + Math.floor(droplistheight / 2 - 10) + "px 0px'>";
                    $.each(row.value, function (i, r) {
                        html += "<li class='aligncenter'><span class='droplist_item_v smaller' style='height:" + options.itemHeight + "px' text='" + r[textColumn] + "' value='" + r[row.valueColumn] + "'>" + r[textColumn] + "</span></li>";
                    })
                    html += "</ul>";
                    html += "</div>";
                }
            })
            html += "</div>";

            html += "</div>";
            html += "</div>";
            var droplistitem = _this.droplistitem = $(html).appendTo("body");
            var dialog = droplistitem.dialog({
                vertical: true
            });
            droplistitem.find(".header").find(".save").bind("click", function () {
                _this.close();
            });
            droplistitem.find(".header").find(".cancel").bind("click", function () {
                _this.cancel();
            });

            $.rows({ control: droplistitem })
            var list = droplistitem.find(".droplist_item");
            $.each(list, function (index, row) {
                //设置加载完成后，应该选中第几条数据
                var currentItem = 0;
                if (data.data[index].value.length > 0) {
                    _this.setValue(index, data.data[index].defaultValue);
                }
                //设置数据后，因为每条数据关联的下一个菜单的数据可能会发生改变，所以，根据下一个数组中是否有onChange事件，为下一组数组数据重新赋值
                if (data.data[index].onChange != undefined) {
                    var result = _this.getValues();
                    var newData = data.data[index].onChange(result);
                    if (newData != undefined) {
                        data.data[index + 1].value = newData.data[0].value;
                        data.data[index + 1].valueColumn = newData.data[0].valueColumn;
                        //新生成的数据为同样为数组，符合方法中的data的数据结构，有且只有一个。此数据会自动填充到滑动列的下一列中
                        var newDataTextColumn = newData.data[0].textColumn == undefined ? newData.data[0].valueColumn : newData.data[0].textColumn
                        setValueHtml(index + 1, droplistitem, newData.data[0].value, newData.data[0].valueColumn, newDataTextColumn, newData.data[0].defaultValue);
                    }
                }
                var clockY = false;
                var firstMove = true;
                var startPointX = 0;
                var startPointY = 0;
                var offsetX = 0;
                var offsetY = 0;
                var startScroll = 0;
                var listCtrl = $(row).children("ul").get(0);
                listCtrl.addEventListener("touchstart", DropTouchStart, false);
                listCtrl.addEventListener("touchmove", DropTouchMove, false);
                listCtrl.addEventListener("touchend", DropTouchEnd, false);
                function DropTouchStart(event) {
                    var touch = event.targetTouches[0];
                    offsetX = 0;
                    offsetY = 0;
                    clockY = false;
                    firstMove = true;
                    startPointX = touch.clientX;
                    startPointY = touch.clientY;
                    startScroll = $(row).scrollTop();
                }
                function DropTouchMove(event) {
                    if (!clockY) {
                        var touch = event.targetTouches[0];
                        var nowPointX = touch.clientX;
                        var nowPointY = touch.clientY;
                        offsetX = nowPointX - startPointX;
                        offsetY = nowPointY - startPointY;
                        //级联滑动为垂直滑动，如果手势为水平滑动，锁定级联
                        if (Math.abs(offsetY) < Math.abs(offsetX) && firstMove) {
                            clockY = true;
                        }
                        else {
                            event.preventDefault();
                            $(row).scrollTop(startScroll - offsetY);
                            var currentIndex = Math.floor($(row).scrollTop() / options.itemHeight);
                            _this.setIndex(index, currentIndex)
                        }
                    }
                    firstMove = false;
                }
                function DropTouchEnd(event) {
                    if (offsetY != 0 && !clockY) {
                        //松手之后，判断当前所在的值，并像初始化值时一样，对下一数组，进行重新赋值
                        var currentIndex = Math.floor($(row).scrollTop() / options.itemHeight);
                        _this.setIndex(index, currentIndex);
                        var i = index;
                        do {
                            if (data.data[i].onChange != undefined) {
                                var result = _this.getValues();
                                var newData = data.data[i].onChange(result);
                                if (newData != undefined) {
                                    data.data[index + 1].value = newData.data[0].value;
                                    data.data[index + 1].valueColumn = newData.data[0].valueColumn;
                                    var newDataTextColumn = newData.data[0].textColumn == undefined ? newData.data[0].valueColumn : newData.data[0].textColumn
                                    setValueHtml(i + 1, droplistitem, newData.data[0].value, newData.data[0].valueColumn, newDataTextColumn, newData.data[0].defaultValue);
                                }
                            }
                            i++;
                        }
                        while (i < data.data.length);
                    }
                }
            })
            return dialog;
        }
        function setValueHtml(itemindex, droplistitem, data, valueColumn, textColumn, defaultValue) {
            var html = "";
            var defaultIndex = 0;
            $.each(data, function (i, r) {
                html += "<li class='aligncenter'><span class='droplist_item_v smaller' style='height:" + options.itemHeight + "px' text='" + r[textColumn] + "' value='" + (defaultValue != undefined ? (r[valueColumn] == defaultValue ? (defaultIndex = i, r[valueColumn]) : r[valueColumn]) : r[valueColumn]) + "'>" + r[textColumn] + "</span></li>";
            })
            var ctrl = droplistitem.find(".droplist_item").eq(itemindex);
            ctrl.children("ul").html(html);
            _this.setIndex(itemindex, defaultIndex);
        }
    }
    droplist.prototype = {
        setValue: function (ctrlindex, value) {
            var options = this.options;
            var data = options.data;
            if (value) {
                $.each(data.data[ctrlindex].value, function (i, r) {
                    if (r[data.data[ctrlindex].valueColumn] == value) {
                        currentItem = i;
                    }
                })
            }
            //设置数据
            this.setIndex(ctrlindex, currentItem);
        },
        setIndex: function (ctrlindex, index) {
            var ctrl = this.droplistitem.find(".droplist_item").eq(ctrlindex);
            var options = this.options;
            var child = $(ctrl).find(".droplist_item_v");
            var childLength = child.length;
            for (var i = 0; i < childLength; i++) {
                if (i == index) {
                    child.eq(i).removeClass("smaller").addClass("select");
                }
                else {
                    child.eq(i).addClass("smaller").removeClass("select");
                }
            }
            ctrl.scrollTop((index) * options.itemHeight);
        },
        show: function () {
            this.dialog.show();
        },
        close: function (callback) {
            var options = this.options;
            if (typeof (callback) == typeof (Function)) {
                options.callback = callback;
            }
            var data = this.getValues();
            options.callback(data);
        },
        cancel: function (callback) {
            var options = this.options;
            if (typeof (callback) == typeof (Function)) {
                options.cancel = callback;
            }
            options.cancel();
        },
        getValues: function () {
            var data = [];
            //将最终选择 出来的值发放到数组中然后返回
            $.each(this.droplistitem.find(".droplist_item"), function (index, row) {
                data.push({
                    text: $(row).find(".select").attr("text"),
                    value: $(row).find(".select").attr("value")
                })
            })
            return data;
        }
    }
    $.droplist = function (options) {

        return new droplist(options);
    }
    /*级联滑动完*/


    /*日期选择*/

    var dater = function (options) {
        var endDate = options.endDate;
        var now = new Date();
        var data = { data: [] };
        var beginYear = options.beginDate.getFullYear();
        var beginMonth = options.beginDate.getMonth() + 1;
        var beginDay = options.beginDate.getDate();
        if (options.needYear) {
            var year = [];
            for (var item = 0; ; item++) {
                year[item] = { "year": item + options.beginDate.getFullYear() };
                if (item + beginYear > (endDate ? endDate.getFullYear() - 1 : beginYear)) {
                    break;
                }
            }
            options.defaultYear = options.defaultYear > 0 ? options.defaultYear : now.getFullYear()
            data.data.push({
                value: year,
                defaultValue: options.defaultYear,
                valueColumn: "year",
                onChange: function (data) {
                    if (options.needMonth) {
                        var newdata = {
                            data: [{
                                value: [],
                                valueColumn: "month"
                            }]
                        };
                        var endMonth = 12;
                        var startMonth = 0;
                        if (endDate && data[0].value == endDate.getFullYear()) {
                            endMonth = endDate.getMonth() + 1;
                        }
                        if (data[0].value == beginYear) {
                            startMonth = beginMonth - 1;
                        }
                        for (var item = startMonth; item < endMonth; item++) {
                            newdata.data[0].value.push({ "month": (item + 1) });
                        }
                        return newdata;
                    }
                }
            });
        }
        if (options.needMonth) {
            var month = [];
            for (var item = 0; item < 12; item++) {
                month[item] = { "month": (item + 1) };
            }
            options.defaultMonth = options.defaultMonth > 0 ? options.defaultMonth : now.getMonth() + 1
            data.data.push({
                value: month,
                defaultValue: options.defaultMonth,
                valueColumn: "month",
                onChange: function (data) {
                    if (options.needDate) {
                        var newdata = {
                            data: [{
                                value: [],
                                valueColumn: "date"
                            }]
                        };
                        //拨动第二列月后，根据最后的结果，进行判断，并给第三列日赋值，并return到级联滑动中，新data的数据结构和一开始的结构需要一样
                        var nowmonth = data[1].value;
                        switch (nowmonth) {
                            case "1": case "3": case "5": case "7": case "8": case "10": case "12":
                                var endDay = 31;
                                if (endDate && endDate.getFullYear() == data[0].value && (endDate.getMonth() + 1) == data[1].value) {
                                    endDay = endDate.getDate();
                                }
                                var startDay = 0;
                                if (data[0].value == beginYear && data[1].value == beginMonth) {
                                    startDay = beginDay - 1;
                                }
                                for (var item = startDay; item < endDay; item++) {
                                    newdata.data[0].value.push({ "date": (item + 1) });
                                }
                                break;
                            case "4": case "6": case "9": case "11":
                                var endDay = 30;
                                if (endDate && endDate.getFullYear() == data[0].value && (endDate.getMonth() + 1) == data[1].value) {
                                    endDay = endDate.getDate();
                                }
                                var startDay = 0;
                                if (data[0].value == beginYear && data[1].value == beginMonth) {
                                    startDay = beginDay - 1;
                                }
                                for (var item = startDay; item < endDay; item++) {
                                    newdata.data[0].value.push({ "date": (item + 1) });
                                }
                                break;
                            case "2":
                                var endDay = 28;
                                if (data[0].value % 4 == 0) {
                                    endDay = 29;
                                }
                                if (endDate && endDate.getFullYear() == data[0].value && (endDate.getMonth() + 1) == data[1].value) {
                                    endDay = endDate.getDate();
                                }
                                var startDay = 0;
                                if (data[0].value == beginYear && data[1].value == beginMonth) {
                                    startDay = beginDay - 1;
                                }
                                for (var item = startDay; item < endDay; item++) {
                                    newdata.data[0].value.push({ "date": (item + 1) });
                                }
                                break;
                        }
                        return newdata;
                    }
                }
            })
        }
        if (options.needDate) {
            var day = [];
            for (var item = 0; item < 31; item++) {
                day[item] = { "date": (item + 1) };
            }
            options.defaultDay = options.defaultDay > 0 ? options.defaultDay : now.getDate()
            data.data.push({
                value: day,
                defaultValue: options.defaultDay,
                valueColumn: "date"
            })
        }
        this.droplist = $.droplist({ data: data, callback: options.callback });
        this.options = options;
    }
    dater.prototype = {
        show: function () {
            this.droplist.show();
        },
        close: function (callback) {
            this.droplist.close(callback);
        },
        getValues: function () {
            //将最后得到的“/”拼接成yyyy/MM/dd的字符串
            var date = this.droplist.getValues();
            var result = "";
            $.each(date, function (index, row) {
                result += row.text + "/";
            })
            if (result.length > 0) {
                result = result.substr(0, result.length - 1);
            }
            return result;
        }
    }
    $.dater = function (options) {
        var _daterDefault = {
            beginDate: new Date(2000, 1, 1, 0, 0, 0, 0),
            endDate: null,
            needYear: true,
            needMonth: true,
            needDate: true,
            defaultYear: -1,//-1表示没有默认年，这里的数字为value
            defaultMonth: -1,//-1表示没有默认月，这里的数字为value
            defaultDay: -1,//-1表示没有默认天，这里的数字为value
            callback: function (data) { }//点击确定按钮后的事件
        }
        options = options || _daterDefault;
        options.beginDate = options.beginDate || _daterDefault.beginDate;
        options.endDate = options.endDate || _daterDefault.endDate;
        options.defaultYear = options.defaultYear != undefined ? options.defaultYear : _daterDefault.defaultYear;
        options.defaultMonth = options.defaultMonth != undefined ? options.defaultMonth : _daterDefault.defaultMonth;
        options.defaultDay = options.defaultDay != undefined ? options.defaultDay : _daterDefault.defaultDay;
        options.needYear = options.needYear != undefined ? options.needYear : _daterDefault.needYear;
        options.needMonth = options.needMonth != undefined ? options.needMonth : _daterDefault.needMonth;
        options.needDate = options.needDate != undefined ? options.needDate : _daterDefault.needDate;
        options.callback = options.callback || _daterDefault.callback;
        return new dater(options);
    }
    /*日期选择完*/

    /*时间选择*/

    var timer = function (options) {
        var _timerDefault = {
            defaultHour: -1,//默认时,-1表示当前小时
            needHour: true,//是否需要小时
            defaultMin: -1,//默认分,-1表示当前分钟
            needMin: true,//是否需要分钟
            defaultSecond: -1,//默认秒,-1表示当前秒
            needSecond: true,//收付需要秒
            callback: function (data) { }//点击确定按钮后的事件
        }
        options = options || _timerDefault;
        options.defaultHour = options.defaultHour != undefined ? options.defaultHour : _timerDefault.defaultHour;
        options.defaultMin = options.defaultMin != undefined ? options.defaultMin : _timerDefault.defaultMin;
        options.defaultSecond = options.defaultSecond != undefined ? options.defaultSecond : _timerDefault.defaultSecond;
        options.callback = options.callback || _timerDefault.callback;
        options.needHour = options.needHour != undefined ? options.needHour : _timerDefault.needHour;
        options.needMin = options.needMin != undefined ? options.needMin : _timerDefault.needMin;
        options.needSecond = options.needSecond != undefined ? options.needSecond : _timerDefault.needSecond;
        var now = new Date();
        var data = {
            data: []
        };
        if (options.needHour) {
            var hour = [];
            for (var item = 0; item < 24; item++) {
                hour[item] = {
                    "hour": ((item) < 10 ? "0" + (item) : (item))
                };
            }
            data.data.push({
                value: hour,
                defaultValue: options.defaultHour > 0 ? options.defaultHour : now.getHours(),
                valueColumn: "hour"
            })
        }
        if (options.needMin) {
            var min = [];
            for (var item = 0; item < 60; item++) {
                min[item] = {
                    "min": ((item) < 10 ? "0" + (item) : (item))
                };
            }
            data.data.push({
                value: min,
                defaultValue: options.defaultMin > 0 ? options.defaultMin : now.getMinutes(),
                valueColumn: "min",
            })
        }
        if (options.needSecond) {
            var second = [];
            for (var item = 0; item < 60; item++) {
                second[item] = {
                    "second": ((item) < 10 ? "0" + (item) : (item))
                };
            }
            data.data.push({
                value: second,
                defaultValue: options.defaultSecond > 0 ? options.defaultSecond : now.getSeconds(),
                valueColumn: "second"
            })
        }
        this.droplist = $.droplist({ data: data, callback: options.callback });
        this.options = options;
    }
    timer.prototype = {
        show: function () {
            this.droplist.show();
        },
        close: function (callback) {
            this.droplist.close(callback);
        },
        getValues: function () {
            //将最后得到的“：”拼接成HH:mm:ss的字符串
            var time = this.droplist.getValues();
            var result = "";
            $.each(time, function (index, row) {
                result += row.text + ":";
            })
            if (result.length > 0) {
                result = result.substr(0, result.length - 1);
            }
            return result;
        }
    }
    $.timer = function (options) {

        return new timer(options);
    }
    /*时间选择完*/

    /*搜索*/
    var _searchDefault = {
        titleCtrl: ".search_t",//搜索框内容
        contentCtrl: ".search_c",//搜索结果
        cancelCtrl: ".close",//取消搜索按钮
        keyCtrl: ".searchtxt",//搜索输入框
        valueColumn: "key",//输入结果拼接请求url地址时的参数名
        dataColumn: "Data",//返回的结果
        url: "",//请求的接口url地址
        param: {}//出关键字key之外的其他参数
    }

    var search = function (_this, options) {
        options = options || _searchDefault;
        options.contentCtrl = options.contentCtrl || _searchDefault.contentCtrl;
        options.titleCtrl = options.titleCtrl || _searchDefault.titleCtrl;
        options.keyCtrl = options.keyCtrl || _searchDefault.keyCtrl;
        options.cancelCtrl = options.cancelCtrl || _searchDefault.cancelCtrl;
        options.hide = options.hide == undefined ? _searchDefault.hide : options.hide;
        options.valueColumn = options.valueColumn || _searchDefault.valueColumn;
        options.dataColumn = options.dataColumn != undefined ? options.dataColumn : _silderDefault.dataColumn;
        options.param = options.param || _searchDefault.param;
        options.url = options.url || _searchDefault.url;
        this.dom = _this;
        var ctrl = this;
        options.result = null;
        options.edit = false;
        this.options = options;
        CreateDialogHtml();
        function CreateDialogHtml() {
            if (_this.attr("id") == undefined) {
                var searchid = "search_" + new Date().getTime();
                _this.attr(searchid);
            }
            _this.find(options.titleCtrl).addClass("search_t");
            _this.find(options.contentCtrl).addClass("search_c");
            _this.find(options.cancelCtrl).addClass("close").bind("click", function () {
                ctrl.cancel();
            });
            //绑定即时查询
            _this.find(options.keyCtrl).addClass("searchtxt").bind("input propertychange", function () {
                options.edit = true;
                ctrl.filter($(this).val());
            }).bind("click", function () {
                //点击搜索框时，第一步显示历史搜索数据
                ctrl.show();
            }).bind("blur", function () {
                ctrl.sethistory($(this).val());
            });
            var headerHeight = _this.find(".search_t").outerHeight(true);
            var html = "<div class='search_history' style='top:" + headerHeight + "px'></div>";
            _this.append(html);
        }
    }
    search.prototype = {
        cancel: function () {
            var _dom = this.dom;
            var options = this.options;
            //取消搜索
            _dom.find(".search_history").hide(0);
            _dom.find(".searchtxt").val("");
            //清除结果
            if (options.result != null) {
                options.result.clearData();
            }
        },
        sethistory: function (key) {
            var _dom = this.dom;
            var options = this.options;
            //将搜索数据从localStorage中存入和取出
            if (options.edit == true) {
                var historys = localStorage.getItem(_dom.attr("id"));
                if (historys != null) {
                    var historylist = JSON.parse(localStorage.getItem(_dom.attr("id")));
                    var hasHistory = false;
                    //多次输入重复值，最后只保存一次
                    $.each(historylist, function (index, row) {
                        if (row == key) {
                            hasHistory = true;
                        }
                    })
                    if (!hasHistory) {
                        historylist.push(key)
                        localStorage.setItem(_dom.attr("id"), JSON.stringify(historylist));
                    }
                }
                else {
                    localStorage.setItem(_dom.attr("id"), JSON.stringify(new Array(key)));
                }
            }
            options.edit = false;
        },
        filter: function (key) {
            var _dom = this.dom;
            var options = this.options;
            //隐藏搜索历史，开始进行搜索
            _dom.find(".search_history").hide();
            if ($.trim(key) != "") {
                var keys = {
                };
                keys[options.valueColumn] = key;
                $.extendParam(keys, options.param);
                if (options.result == null) {
                    options.result = _dom.find(".search_c").bindData({
                        url: options.url,
                        data: [],
                        param: keys,
                        dataColumn: options.dataColumn
                    })
                }
                else {
                    options.result.setUrl(options.url, keys);
                }
            }
        },
        show: function (key) {
            var _this = this;
            var _dom = this.dom;
            var options = this.options;
            //显示搜索历史，如果有的话，显示清除搜索历史，如果没有，则不显示
            _dom.find(".searchtxt").focus();
            var historys = localStorage.getItem(_dom.attr("id"));
            if (historys != null) {
                var historylist = JSON.parse(historys);
                if (historylist.length > 0) {
                    var historyhtml = "<ul>";
                    historyhtml += "<li><span class='boarditem_t'>搜索历史</span></li>";
                    $.each(historylist, function (index, row) {
                        historyhtml += "<li><a href='javascript:;' class='boarditem_c historylist_i'>";
                        historyhtml += row;
                        historyhtml += "</a></li>";
                    })
                    historyhtml += "<li class='aligncenter'><a href='javascript:;' class='clearhistory'>清除搜索历史</a></li>";
                    historyhtml += "</ul>";
                    _dom.find(".search_history").html("").append(historyhtml).find(".historylist_i").bind("click", function () {
                        $(".searchtxt").val($(this).text())
                        _this.filter($(this).text());
                    });
                    _dom.find(".clearhistory").bind("click", function () {
                        localStorage.removeItem(_dom.attr("id"));
                        _dom.find(".searchtxt").val("");
                        _dom.find(".search_history").html("")
                    })
                }
            }
            else {
                _dom.find(".search_history").html("");
            }
            _dom.find(".search_history").show();
            $(options.keyCtrl).val(key);
        }
    }
    $.fn.search = function (options) {

        return new search($(this).eq(0), options);
    }
    /*搜索完*/

    /*提示框*/
    var _tooltipDefault = {
        content: "",//内容
        title: "",//标题
        parent: ".content",//显示的上级目录
        confirm: function () {
        },//提示框和选择框点击确认后的事件
        cancel: function () {
        },
        closed: function () { },
        type: tooltiptype.tips,//类型，分为选择框、提示框、loading和tips。详情参见tooltiptype
        autoShow: false,//是否自动显示
        autoHide: true,//是否自动隐藏
        style: "",//附加style
        confirmText: "确认",//带确认提示框的确认文字
        cancelText: "取消",//带确认提示框的取消文字
        hideTimeout: 4000//自动隐藏的时间间隔
    }
    var tooltip = function (options) {
        options = options || _tooltipDefault;
        options.content = options.content || _tooltipDefault.content;
        options.title = options.title || _tooltipDefault.title;
        options.top = options.top || _tooltipDefault.top;
        options.confirm = options.confirm || _tooltipDefault.confirm;
        options.cancel = options.cancel || _tooltipDefault.cancel;
        options.type = options.type || _tooltipDefault.type;
        options.autoHide = options.autoHide == undefined ? _tooltipDefault.autoHide : options.autoHide;
        options.autoShow = options.autoShow == undefined ? _tooltipDefault.autoShow : options.autoShow;
        options.hideTimeout = options.hideTimeout || _tooltipDefault.hideTimeout;
        options.style = options.style || _tooltipDefault.style;
        options.parent = options.parent || _tooltipDefault.parent;
        options.confirmText = options.confirmText || _tooltipDefault.confirmText;
        options.cancelText = options.cancelText || _tooltipDefault.cancelText;
        options.closed = options.closed || _tooltipDefault.closed;
        this.options = options;
        this.tooltips = null;
        if (options.autoShow) {
            this.show(options.content, options.title);
        }
    }
    tooltip.close = function (tooltiptype, dialog) {
        switch (tooltiptype) {
            case window.tooltiptype.confirm: case window.tooltiptype.alert: case window.tooltiptype.dialog: case window.tooltiptype.loading: case window.tooltiptype.committing:
                dialog.close();
                break;
            case window.tooltiptype.tips:
                dialog.fadeOut("fast", function () {
                    $(this).remove();
                })
                break;
        }
    }
    tooltip.prototype = {
        show: function (content, title, hideTimeout, closed) {
            var _this = this;
            var options = this.options;
            var allowloop = false;

            if (content != undefined) {
                options.content = content;
            }
            if (title != undefined) {
                options.title = title;
            }
            if (hideTimeout != undefined) {
                options.hideTimeout = hideTimeout;
            }
            if (closed != undefined) {
                options.closed = closed;
            }
            if (_this.tooltips == null || content != undefined || title != undefined) {
                switch (options.type) {
                    case tooltiptype.confirm: case tooltiptype.alert:
                        _this.tooltips = CreateConfirm();
                        break;
                    case tooltiptype.tips:
                        allowloop = true;
                        break;
                    case tooltiptype.loading:
                        _this.tooltips = CreateLoading();
                        break;
                    case tooltiptype.committing:
                        _this.tooltips = CreateCommitting();
                        break;
                    case tooltiptype.dialog:
                        _this.tooltips = CreateDialog(options.content);
                    default:
                        break;
                }
            }
            if (allowloop) {
                _this.tooltips = CreateTips();
            }
            if (_this.tooltips) {
                show(_this.tooltips);
            }
            function show(dialog) {
                switch (options.type) {
                    case tooltiptype.confirm: case tooltiptype.alert: case tooltiptype.dialog: case tooltiptype.loading: case tooltiptype.committing:
                        dialog.show();
                        break;
                    case tooltiptype.tips:
                        dialog.fadeIn("fast");
                        if (options.autoHide) {
                            var timeout = setTimeout(function () {
                                options.closed();
                                tooltip.close(options.type, dialog);
                                clearTimeout(timeout);
                            }, options.hideTimeout)
                        }
                        break;
                }
            }
            //稍纵即逝的提示
            function CreateTips() {
                var tooltipid = "tooltip_" + new Date().getTime();
                var html = "<div id=" + tooltipid + " class='tooltip '>"
                    + "<div class='board tooltip_c close" + options.style + "'>"
                    + "<div class='board_c'>"
                    + "<div class='board_c_c'><span class='title'>" + options.content + "</span></div>"
                    + "</div>"
                    + "</div>"
                    + "</div>";
                var parenthelfWidth = parseInt($(options.parent).width()) / 2;
                //$(options.parent).css("position", "relative");
                var tip = $(html).appendTo(options.parent);
                //var tiphelfWidth = parseInt(tip.outerWidth(true)) / 2;
                //tip.css("left", (parenthelfWidth - tiphelfWidth) + "px");

                tip.find(".close").bind("click", function () {
                    options.closed();
                    _this.close();
                });

                return tip;
            }
            //带有蒙板的提示
            function CreateCommitting() {
                var html = "<div class='board tooltip_c'>"
                    + "<div class='board_c'>"
                    + "<div class='board_c_c'><span id='pagetitle' class='title'>" + options.content + "</span></div>"
                    + "</div>"
                    + "</div>";
                var _dialog = CreateDialog(html);
                return _dialog;
            }
            //带有确认或确认和取消的弹出框
            function CreateConfirm() {
                var html = "<div class='board confirmboard'>"
                    + "<div class='header'>"
                    + "<div class='board_c padding_l rows-3 over'>"
                    + "<div class='board_c_l cols-2'></div>"
                    + "<div class='board_c_c cols-8'><span id='pagetitle textoverflow' class='title'>" + options.title + "</span></div>"
                    //+ "<div class='board_c_r cols-2'><span class='ico close closeico'></span></div>"
                    + "<div class='board_c_r cols-2'></div>"
                    + "</div>"
                    + "</div>"
                    + "<div class='main'>"
                    + "<div class='board_c padding'>"
                    + options.content
                    + "</div>"
                    + "</div>"
                    + "<div class='footer'><a href='javascript:;' class='btn btnDefault cols-1 submit'><span>" + options.confirmText + "</span></a>"
                    + (options.type == tooltiptype.confirm ? "<a href='javascript:;' class='btn btnCancel cancel cols-1 close'><span>" + options.cancelText + "</span></a>" : "")
                    + "</div>"
                    + "</div>";
                var _dialog = CreateDialog(html);

                return _dialog;
            }
            function CreateDialog(content) {
                var dialogid = "tooltip_" + new Date().getTime();
                var html = "<div id=" + dialogid + " class='dialog' style='z-index:9999'>"
                    + "<div class='dialogpanel " + options.style + "'>"
                    + "<div class='tooltip'>"
                    + content
                    + "</div>"
                    + "</div>"
                    + "</div>";
                var Dialog = $(html).appendTo(options.parent);
                var _dialog = Dialog.dialog({ needHeader: false, needAnimate: false, contentCtrl: ".tooltip", closed: options.closed });
                $.rows({ control: _dialog.dom });
                Dialog.find(".submit").bind("click", function () {
                    if (options.confirm()) {
                        _this.close();
                    }
                });
                Dialog.find(".cancel").bind("click", function () {
                    options.cancel();
                });
                Dialog.find(".close").bind("click", function () {
                    _this.close();
                });
                return _dialog;
            }
            //正在加载提示框
            function CreateLoading() {
                var dialogid = "tooltip_" + new Date().getTime();
                var html = "<div id=" + dialogid + " class='dialog loading'>"
                    + "<div class='shadedialog dialogpanel " + options.style + "'>"
                    + "<div class='board shade_c'>"
                    + "<div class='board_c padding_v'>"
                    + "<div class='loadingico'></div><div class='loadingtext'>" + options.content + "</div>"
                    + "</div>"
                    + "</div>"
                    + "</div>"
                    + "</div>";
                var confirmDialog = $(html).appendTo(options.parent);
                var dialog = confirmDialog.dialog({ contentCtrl: ".shade_c", dispose: true, needHeader: false, needAnimate: false, needLoading: false, showParent: options.parent });
                $.rows({ control: confirmDialog });
                confirmDialog.find(".submit").bind("click", function () {
                    options.confirm();
                    _this.close();
                });
                confirmDialog.find(".close").bind("click", function () {
                    _this.close();
                });
                return dialog;
            }
        },
        close: function () {
            var options = this.options;
            tooltip.close(options.type, this.tooltips);
        }
    };
    $.tooltip = function (options) {

        return new tooltip(options);
    };

    /*提示框完*/


    /*可定制列表*/
    var _dragDefault = {
        idColumn: "key",
        sortColumn: "sort",
        holdIndex: -1,
        callback: function (data) { }
    }

    var drag = function (_this, options) {
        options = options || _dragDefault;
        options.idColumn = options.idColumn || _dragDefault.idColumn;
        options.sortColumn = options.sortColumn || _dragDefault.sortColumn;
        options.callback = options.callback || _dragDefault.callback;
        options.holdIndex = options.holdIndex != undefined ? options.holdIndex : _dragDefault.holdIndex;
        this.dom = _this;
        var ctrl = this;
        this.options = options;
        $(_this).addClass("dragPanel")
        $.each(_this.children(), function (index, row) {
            if (index != options.holdIndex || options.holdIndex < 0) {
                $(row).addClass("dragablePanel");
            }
        })
        //设置排序index
        setIndex();
        ondrag();
        function setIndex() {
            $.each(_this.children(".dragablePanel"), function (index, row) {
                $(row).attr(options.sortColumn, index);
            })
        }
        function ondrag() {
            $.each($(_this).children(".dragablePanel"), function (index, row) {
                var timeout;
                var first = true;
                var hasChange = false;
                row.addEventListener("touchstart", DragTouchStart, false);
                row.addEventListener("touchmove", DragTouchMove, false);
                row.addEventListener("touchend", DragTouchEnd, false);
                var endPoint = []; var startPoint = []; var startPosition = [];
                function DragTouchStart(event) {
                    startPosition = [];
                    startPoint = [];
                    endPoint = [];
                    var touch = event.targetTouches[0];
                    if (!$(row).find(".draghandler").length > 0) {
                        timeout = setTimeout(function () {
                            event.preventDefault();
                            createHandlerHtml($(row));
                        }, 1000);
                    }
                    else {
                        startPosition[0] = $(row).position().left;
                        startPosition[1] = $(row).position().top;
                        $(row).css({ "transform": "translate(" + startPosition[0] + "px," + startPosition[1] + "px)" }).addClass("dragable");
                        startPoint[0] = touch.clientX;
                        startPoint[1] = touch.clientY;
                    }
                }
                function DragTouchMove(event) {
                    if ($(row).find(".draghandler").length) {
                        event.preventDefault();
                        var touch = event.targetTouches[0];
                        var nowPoint = [];
                        nowPoint[0] = touch.clientX;
                        nowPoint[1] = touch.clientY;
                        endPoint[0] = nowPoint[0] - startPoint[0] + startPosition[0];
                        endPoint[1] = nowPoint[1] - startPoint[1] + startPosition[1];
                        $(row).css({ "transform": "translate(" + endPoint[0] + "px," + endPoint[1] + "px)" })
                    }
                }
                function DragTouchEnd(event) {
                    if (!$(row).find(".draghandler").length) {
                        clearTimeout(timeout);
                    }
                    else {
                        var touch = event.targetTouches[0];
                        var current = [];
                        var clone;
                        var currentIndex = 0;
                        item = $(_this).children(".dragablePanel")
                        var eq = item.index($(row));
                        for (var i = 0; i < item.length; i++) {
                            if (i != eq) {
                                current[0] = item.eq(i).position().left;
                                current[1] = item.eq(i).position().top;
                                //进行判断。如果移动的控件，移动到另外一个控件的上面，需要判断.
                                //如果移动到第一个控件的左半部分。那直接将该控件添加到index=0的位置。
                                //如果移动到控件的右半部分，则放在原来的第一个和第二个控件中间
                                //如果移动到最后一个控件的右半部分，则直接放到最后一个控件后面
                                //同理，如果是放在图标的上半部分，则表示安插在该排。如果是移动到图标的下半部分（实际是在下面一排图标的上半部分），则安插在下一排
                                if ((i == 0 ? true : endPoint[0] > current[0]) &&
                                    (i == (item.length - 1) ? true : endPoint[0] < current[0] + (parseInt(item.eq(i).width()))) &&
                                    ((endPoint[1] + parseInt($(row).height()) < (current[1] + parseInt(item.eq(i).height())) &&
                                        (endPoint[1] + parseInt($(row).height()) > current[1])) ||
                                        (endPoint[1] > current[1] &&
                                            (endPoint[1] < current[1] + parseInt(item.eq(i).height()))))) {
                                    if (endPoint[0] < item.eq(0).position().left && i == 0) {
                                        currentIndex = -1;
                                    }
                                    else if (endPoint[0] > item.last().position().left + (parseInt(item.last().width())) && i < item.length - 1) {
                                        currentIndex = item.length - 1;
                                    }
                                    else {
                                        currentIndex = i;
                                    }
                                    $(row).find(".draghandler").remove();
                                    hasChange = true;
                                    break;
                                }
                            }
                        }
                        if (hasChange) {
                            clone = $(row).clone();
                            //clone.removeClass("dragable").css({ "transform": "", "top": "" });
                            clone.removeClass("dragable").css({ "transform": "" });
                            $(_this).children(".dragablePanel[" + options.sortColumn + "=" + $(row).attr(options.sortColumn) + "]").remove();
                            item = $(_this).children(".dragablePanel");
                            if (currentIndex < 0) {
                                item.eq(0).before(clone);
                            }
                            else if (currentIndex == 0 || eq < 0) {
                                item.eq(0).after(clone);
                            }
                            else if (currentIndex > eq && eq > -1) {
                                item.eq(currentIndex - 1).after(clone);
                            }
                            else {
                                item.eq(currentIndex).after(clone);
                            }

                            $.each($(_this).children(".dragablePanel"), function (i, r) {
                                r.removeEventListener("touchstart", function () { });
                                r.removeEventListener("touchmove", function () { });
                                r.removeEventListener("touchend", function () { });
                            })
                            ondrag();
                        }
                        else {
                            //$(row).removeClass("dragable").css({ "left": "", "top": "" });
                            $(row).removeClass("dragable").css({ "transform": "" });
                        }
                    }
                    options.callback(ctrl.getValues(_this, options.idColumn))
                }
            })

        }
        function createHandlerHtml(item) {
            var html = "<div class='draghandler'>"
                + "<a href='javascript:;' class='ico deleteico btndelete'></a>"
                + "</div>";
            var cont = $(item).prepend(html);
            cont.find(".btndelete").bind("click", function (event) {
                item.remove();
                setIndex();
            })
            $(document).bind("click", function () {
                $(_this).find(".draghandler").remove();
                $(document).unbind("click");
            })
            $.each($(_this).children(".dragablePanel"), function (index, row) {
                $(row).bind("click", function () {
                    if ($(_this).find(".dragablePanel .draghandler").length > 0) {
                        event.stopPropagation();
                        $(_this).find(".draghandler").remove();
                    }
                })
            })
        }
    };
    drag.prototype = {
        getValues: function () {
            var options = this.options;
            var _this = this.dom;
            var values = [];
            $.each(_this.children(".dragablePanel"), function (index, row) {
                var key = $(row).attr(options.idColumn);
                values.push({ key: key == undefined ? index : key, sort: index });
            })
            return values;
        }
    }
    $.fn.drag = function (options) {

        return new drag($(this).eq(0), options);
    }
    /*可定制列表完*/


    /*格式化数据*/
    //格式化显示数据，多个数据中间用"，"逗号隔开，需要格式化成什么数据，请参考window.formattype
    var _formatterDefault = {
        value: "",
    }
    var formatter = function (_this, options) {

        var param = [];
        var formatlist = _this.attr("data-format") != undefined ? [_this] : [];
        var regex = "";
        if (options.value == "") {
            $.each(_this.find("[data-format]"), function (index, row) {
                formatlist.push(row);
            })
        }
        $.each(formatlist, function (index, row) {
            regex = $(row).attr("data-format");
            //分隔多个格式化格式
            var param = regex.split(",")
            for (var name in window.formattype) {
                if (param[0].indexOf(name) > -1) {
                    param.splice(0, 1);
                    $(row).html(window.formattype[name].format(options.value, param));
                    return false;
                }
            }
        })
    }
    $.fn.formatter = function (options) {

        options = options || _rowsDefault;
        options.value = options.value || _rowsDefault.value;
        return formatter($(this).eq(0), options);
    }
    /*格式化数据完*/


    /*随滚动隐藏\显示*/
    var _scrollHideDefault = {
        touchCtrl: ".main",
        moveSize: 10,
        reverse: false
    };
    var scrollHide = function (_this, options) {
        options = options || _scrollHideDefault;
        options.touchCtrl = options.touchCtrl || _scrollHideDefault.touchCtrl;
        options.moveSize = options.moveSize || _scrollHideDefault.moveSize;
        options.reverse = options.reverse != undefined ? options.reverse : _scrollHideDefault.reverse;

        var ctrl = $(options.touchCtrl).get(0);
        var lastY;
        var startX;
        var startY;
        var clockWindowMove = true;
        var isFirstHeaderMove = false;
        ctrl.addEventListener("touchstart", windowMoveStart, true);
        ctrl.addEventListener("touchmove", windowMoveing, true);
        //document.addEventListener("touchend", windowMoveEnd);
        function windowMoveStart(event) {
            var hand1th = event.targetTouches[0];
            isFirstHeaderMove = true;
            clockWindowMove = false;
            startY = lastY = hand1th.clientY;
            startX = hand1th.clientX;
        }
        function windowMoveing(event) {
            if (!clockWindowMove) {
                var isUp = false;
                var hand1th = event.targetTouches[0];
                var clientX = startX - hand1th.clientX;
                var clientY = startY - hand1th.clientY;
                if (hand1th.clientY < lastY) {
                    isUp = true;
                }
                lastY = hand1th.clientY;
                if (Math.abs(clientX) > Math.abs(clientY) && isFirstHeaderMove) {
                    clockWindowMove = true;
                }
                else {
                    if (Math.abs(clientY) >= parseInt(options.moveSize)) {
                        if ((!isUp && !options.reverse) || (isUp && options.reverse)) {
                            _this.slideDown("fast");
                            _this.removeClass("hide");
                            //document.getElementById("header").style.display = "block";
                        }
                        else {
                            _this.slideUp("fast");
                            _this.addClass("hide");
                            //document.getElementById("header").style.display = "none";
                        }
                    }
                }
            }
            isFirstHeaderMove = false;
        }
    };
    $.fn.scrollHide = function (options) {

        return scrollHide($(this).eq(0), options);
    }
    /*随滚动隐藏\显示完*/

    /*单元格侧滑*/
    var _cellSilderDefault = {
        itemCtrl: ".silderitem",
        contentCtrl: ".silderitem_c",
        handlerCtrl: ".silderitem_h"
    }
    var cellSilder = function (_this, options) {
        options = options || _cellSilderDefault;
        options.itemCtrl = options.itemCtrl || _cellSilderDefault.itemCtrl;
        options.contentCtrl = options.contentCtrl || _cellSilderDefault.contentCtrl;
        options.handlerCtrl = options.handlerCtrl || _cellSilderDefault.handlerCtrl;
        _this.find(options.itemCtrl).addClass("silderitem");
        _this.find(options.contentCtrl).addClass("silderitem_c");
        _this.find(options.handlerCtrl).addClass("silderitem_h");
        $.each(_this.find(".silderitem"), function (index, row) {
            var content = $(row).find(".silderitem_c");
            var clockX = false;
            var firstMove = true;
            var startPointX = 0;
            var startPointY = 0;
            var offsetX = 0;
            var offsetY = 0;
            var currentLeft = 0;
            var handlerWidth = 0;
            //获取底部按钮的总宽度
            $.each($(row).find(".boarditem_h_item"), function (i, r) {
                handlerWidth += $(r).outerWidth(true);
            })
            content.get(0).addEventListener("touchstart", SilderTouchStart, false);
            content.get(0).addEventListener("touchmove", SilderTouchMove, false);
            content.get(0).addEventListener("touchend", SilderTouchEnd, false);
            function SilderTouchStart(event) {
                var touch = event.targetTouches[0];
                offsetX = 0;
                offsetY = 0;
                clockX = false;
                firstMove = true;
                startPointX = touch.clientX;
                startPointY = touch.clientY;
                //获取transform的css的值，可能为正，可能为负
                currentLeft = parseInt(content.get(0).style.webkitTransform.replace(/[^\-?0-9]+/g, '')) || 0;
            }
            function SilderTouchMove(event) {
                //如果是左右滑动才能够运行
                if (!clockX) {
                    var touch = event.targetTouches[0];
                    var nowPointX = touch.clientX;
                    var nowPointY = touch.clientY;
                    offsetX = nowPointX - startPointX;
                    offsetY = nowPointY - startPointY;
                    //该功能为左右滑动，如果手势为上下滑动，则应该锁定该功能不能运行
                    if (Math.abs(offsetX) <= Math.abs(offsetY) && firstMove) {
                        clockX = true;
                    }
                    else {
                        event.preventDefault();
                        //判断左右滑动后的结果，最大滑动不能超过底部所有按钮的总宽度。最小不能小于0
                        if (offsetX + currentLeft > 0) {
                            offsetX = 0;
                            currentLeft = 0;
                        }
                        else if (Math.abs(offsetX) + currentLeft > handlerWidth) {
                            offsetX = Math.abs(currentLeft) - handlerWidth;
                        }
                        content.css("transform", "translateX(" + (currentLeft + offsetX) + "px)");
                    }
                }
                firstMove = false;
            }
            function SilderTouchEnd(event) {
                if (offsetX != 0 && !clockX) {
                    //如果滑动距离超过了底部所有按钮的总宽度的1/4。那松手以后直接到达最终应该到达的位置，否则还原到滑动之前的位置
                    if (Math.abs(offsetX) > handlerWidth / 4) {
                        if (offsetX > 0) {
                            content.css("transform", "translateX(0px)");
                        }
                        else {
                            content.css("transform", "translateX(" + (-handlerWidth) + "px)");
                        }
                    }
                    else {
                        content.css("transform", "translateX(" + currentLeft + "px)");
                    }
                }
            }
        })
    }
    $.fn.cellSilder = function (options) {

        return cellSilder($(this).eq(0), options);
    }
    /*单元格侧滑完*/


    /*数据验证*/
    //参数格式为data-valid="qq;email;phone,message:这个手机不是本机,equals,#abc;"
    //系统内置参考格式window.validatetype
    var validate = function (_this) {
        var validstate = true;
        var validatelist = _this.attr("data-valid") != undefined ? [_this] : [];
        $.each(_this.find("[data-valid]"), function (index, row) {
            validatelist.push(row);
        })
        var tips = $.tooltip({ content: "", autoHide: true, parent: "body", hideTimeout: 1300 });
        $.each(validatelist, function (index, row) {
            regex = $(row).attr("data-valid");
            //获取多少种验证
            if (regex != undefined && regex != "") {
                var valids = regex.split(";");
                $.each(valids, function (i, r) {
                    //获取有多少参数
                    var param = r.split(",");
                    for (var name in window.validatetype) {
                        if (param[0].indexOf(name) > -1) {
                            param.splice(0, 1);
                            var message = "";
                            for (var paramitem in param) {
                                if (parseInt(paramitem) > -1) {
                                    var strIndex = param[paramitem].indexOf("message:");
                                    if (strIndex > -1) {
                                        message = param[paramitem].substr(strIndex);
                                    }
                                }
                            }
                            var state = window.validatetype[name].validator($(row).val(), param);
                            if (!state) {
                                validstate = false;
                                var result = !message ? window.validatetype[name].message : message.split(":")[1];
                                for (var parami in param) {
                                    result = result.replace(new RegExp("\\{" + parami + "\\}", 'g'), param[parami]);
                                }
                                tips.show(result);
                                $(row).focus();
                            }
                            break;
                        }
                    }
                })
                if (!validstate) {
                    return validstate;
                }
            }
        })
        return validstate;
    }
    $.fn.validate = function () {
        return validate($(this).eq(0));
    }

    /*数据验证完*/

})(jQuery);
/*------------------The End--------------------*/
/*
                   _ooOoo_
                  o8888888o
                  88" . "88
                  (| -_- |)
                  O\  =  /O
               ____/`---'\____
             .'  \\|     |//  `.
            /  \\|||  :  |||//  \
           /  _||||| -:- |||||-  \
           |   | \\\  -  /// |   |
           | \_|  ''\---/''  |   |
           \  .-\__  `-`  ___/-. /
         ___`. .'  /--.--\  `. . __
      ."" '<  `.___\_<|>_/___.'  >'"".
     | | :  `- \`.;`\ _ /`;.`/ - ` : | |
     \  \ `-.   \_ __\ /__ _/   .-` /  /
======`-.____`-.___\_____/___.-`____.-'======
                   `=---='
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
         佛祖保佑       永无BUG
*/
