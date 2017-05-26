var authName = "yourapp-name";
var authPsd = "yourapp-password";



//var tokentimeout = 24 * 60 * 60 * 1000;
var apiUrl = "http://test195.yuexing.com.cn:8295/pos-esc-server/rest/1/";
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}

function Base64_Encode(str) {
    var c1, c2, c3;
    var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var i = 0, len = str.length, string = '';

    while (i < len) {
        c1 = str.charCodeAt(i++) & 0xff;
        if (i === len) {
            string += base64EncodeChars.charAt(c1 >> 2);
            string += base64EncodeChars.charAt((c1 & 0x3) << 4);
            string += "==";
            break;
        }
        c2 = str.charCodeAt(i++);
        if (i === len) {
            string += base64EncodeChars.charAt(c1 >> 2);
            string += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
            string += base64EncodeChars.charAt((c2 & 0xF) << 2);
            string += "=";
            break;
        }
        c3 = str.charCodeAt(i++);
        string += base64EncodeChars.charAt(c1 >> 2);
        string += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
        string += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
        string += base64EncodeChars.charAt(c3 & 0x3F);
    }
    return string;
}

function useAppFunction(func, param) {
    var message = {
        'method': func,
        'param1': param,
    };
    if (window.webkit) {
        window.webkit.messageHandlers.WebViewApp.postMessage(JSON.stringify(message));
    }
    else {
        //alert(JSON.stringify(message));
        window.WebViewApp.postMessage(JSON.stringify(message));
    }
}
function get_now_full() {
    var now = new Date();
    var month = now.getMonth() - 0 + 1;
    var day = now.getDate() - 0;
    var hours = now.getHours() - 0;
    var minutes = now.getMinutes() - 0;
    var seconds = now.getSeconds() - 0;
    if (month < 10)
        month = "0" + month;
    if (day < 10)
        day = "0" + day;
    if (hours < 10)
        hours = "0" + hours;
    if (minutes < 10)
        minutes = "0" + minutes;
    if (seconds < 10)
        seconds = "0" + seconds;
    return now.getFullYear() + "-" + month + "-" + day + ' ' + hours + ":" + minutes + ":" + seconds;
}
$.extendget.getHeader = function () {
    return {
        "Authorization": "Basic " + Base64_Encode(authName+":"+authPsd)
    }
}
$.extendpost.getHeader = function () {
    return {
        "Authorization": "Basic " + Base64_Encode(authName + ":" + authPsd)
    }
}

$.extend(window.formattype, {
    statusName: {
        format: function(source) {
            var format = "";
            switch (source) {
                case "ineffect":
                    format = "<span class='ico weishengxiao'></span>未生效";
                    break;
                case "receipted":
                    format = "<span class='ico yishoukuan'></span>已收款";
                    break;
                case "declaration":
                    format = "<span class='ico yibaodan'></span>已报单";
                    break;
                case "passed":
                    format = "<span class='ico yitongguo'></span>已通过";
                    break;
                case "rejected":
                    format = "<span class='ico yibohui'></span>已驳回";
                    break;
            }
            return format;
        }
    },
    delHandler: {
        format: function(source, args) {
            var format = "";
            switch (source) {
                case "ineffect":
                    format = "<button class='ico deleteico' onclick=\"delOrder('" + args[0] + "'," + args[2] + "," + args[1] + ")\"></button>";
                    break;
            }
            return format;
        }
    },
    payWay: {
        format: function(source, args) {
            var format = source == "deposit" ? "定金 <em class='money'>" + args[0] + "<em>" : "全款";
            return format;
        }
    },
    sendWay: {
        format: function(source) {
            var format = source =="delivery"?"送货":"自提";
            return format;
        }
    },
    installWay: {
        format: function(source) {
            var format = source=="true" ? "<span class='ico radioico checkedico'>安装</span>":"";
            return format;
        }
    },
    toMoney: {
        format: function (source) {
            var format = parseFloat(source).toFixed(2);
            return format;
        }
    }
})