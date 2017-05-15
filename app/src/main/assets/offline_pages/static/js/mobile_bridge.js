MOBILEBRIDGEVERSION = '0.4.25'
String.prototype.trim = function() {
  return this.replace(/(^\s*)|(\s*$)/g,'');
}
window.onerror = function(e) {
  if(window.AndroidJSBridge && window.AndroidJSBridge.jsException) {
    window.AndroidJSBridge.jsException(e);
  }
  else {
    console.log(typeof(e));
    console.log(e);
  }
}
window.MobileBridgeWithAndroid = {
  version: function() {
    return 'android ' + MOBILEBRIDGEVERSION;
  },
  goBack: function() {
    if(window.AndroidJSBridge && typeof(window.AndroidJSBridge.goBackBehavior) === "function") {
      window.AndroidJSBridge.goBackBehavior(message);
    }
  },
  goToUrl: function(htmlName) {
    if(window.AndroidJSBridge && typeof(window.AndroidJSBridge.openOfflinePage) === "function") {
      window.AndroidJSBridge.openOfflinePage(htmlName);
    }
  },
  pageLink: function(bannerName, link, objectId) {
    console.log(window.MobileBridgeWithAndroid.version());
    console.log({'bannerName': bannerName, 'link': link, 'objectId': objectId});

    if(window.AndroidJSBridge && typeof(window.AndroidJSBridge.pageLink) === "function") {
      window.AndroidJSBridge.pageLink(bannerName, $.trim(link), objectId);
    } else {
      alert("Error 未定义接口： pageLink");
    }
  },
  showAlert: function(title, content) {
    console.log(window.MobileBridgeWithAndroid.version());
    console.log({'title': title, 'content': content});

    if(window.AndroidJSBridge && typeof(window.AndroidJSBridge.showAlert) === "function") {
      window.AndroidJSBridge.showAlert(title, content);
    } else {
      alert("Error 未定义接口： showAlert");
    }
  },
  showAlertAndRedirect: function(content, redirect_url) {
    var title = "提示";
    redirect_url = 'offline://' + $.trim(redirect_url);
    console.log(window.MobileBridgeWithAndroid.version());
    console.log({'title': title, 'content': content, 'redirect_url': redirect_url, 'clean_stack': 'no'});

    if(window.AndroidJSBridge && typeof(window.AndroidJSBridge.showAlertAndRedirect) === "function") {
      window.AndroidJSBridge.showAlertAndRedirect(title, content, redirect_url, 'no');
    } else {
      alert("Error 未定义接口： showAlertAndRedirect");
    }
  },
  showAlertAndRedirectWithCleanStack: function(content, redirect_url) {
    var title = "提示";
    redirect_url = 'offline://' + $.trim(redirect_url);
    console.log(window.MobileBridgeWithAndroid.version());
    console.log({'title': title, 'content': content, 'redirect_url': redirect_url, 'clean_stack': 'yes'});

    if(window.AndroidJSBridge && typeof(window.AndroidJSBridge.showAlertAndRedirect) === "function") {
      window.AndroidJSBridge.showAlertAndRedirect(title, content, redirect_url, 'yes');
    } else {
      alert("Error 未定义接口： showAlertAndRedirect");
    }
  },
  toggleShowBanner: function(state) {
    console.log(window.MobileBridgeWithAndroid.version());
    console.log({'toggleShowBanner state': state});

    if(window.AndroidJSBridge && typeof(window.AndroidJSBridge.toggleShowBanner) === "function") {
      window.AndroidJSBridge.toggleShowBanner(state);
    } else {
      alert("Error 未定义接口： toggleShowBanner");
    }
  },
  appBadgeNum: function(type, num) {
    console.log(window.MobileBridgeWithAndroid.version());
    console.log({'type': type, 'num': num});

    if(window.AndroidJSBridge && typeof(window.AndroidJSBridge.appBadgeNum) === "function") {
      window.AndroidJSBridge.appBadgeNum(type, num);
    } else {
      alert("Error 未定义接口： appBadgeNum");
    }
  },
  setBannerTitle: function(title) {
    console.log(window.MobileBridgeWithAndroid.version());
    console.log({'title': title});

    if(window.AndroidJSBridge && typeof(window.AndroidJSBridge.setBannerTitle) === "function") {
      window.AndroidJSBridge.setBannerTitle(title);
    } else {
      alert("Error 未定义接口： setBannerTitle");
    }
  },
  addSubjectMenuItems: function(menu_items) {
    console.log(window.MobileBridgeWithAndroid.version());
    var menu_items_string = JSON.stringify(menu_items);
    console.log({'menu_items': menu_items_string});

    if(window.AndroidJSBridge && typeof(window.AndroidJSBridge.addSubjectMenuItems) === "function") {
      window.AndroidJSBridge.addSubjectMenuItems(menu_items_string);
    } else {
      alert("Error 未定义接口： addSubjectMenuItems");
    }
  }
};

window.MobileBridgeWithIOS = {
  version: function() {
    return 'ios ' + MOBILEBRIDGEVERSION;
  },
  connectWebViewJavascriptBridge: function(callback) {
    if(window.WebViewJavascriptBridge) {
      callback(WebViewJavascriptBridge)
    }
    else {
      document.addEventListener('WebViewJavascriptBridgeReady', function() {
        callback(WebViewJavascriptBridge)
      }, false)
    }
  },
  goBack: function(bannerName, link, objectId) {
    MobileBridgeWithIOS.connectWebViewJavascriptBridge(function(bridge){
      bridge.callHandler('goBackBehavior', {}, function(response) {});
    })
  },
  goToUrl: function(htmlName) {
    MobileBridgeWithIOS.connectWebViewJavascriptBridge(function(bridge){
      bridge.callHandler('openOfflinePage', {'htmlName': htmlName}, function(response) {});
    })
  },
  pageLink: function(bannerName, link, objectId) {
    console.log(window.MobileBridgeWithIOS.version());
    console.log({'bannerName': bannerName, 'link': link, 'objectId': objectId});
    MobileBridgeWithIOS.connectWebViewJavascriptBridge(function(bridge){
      bridge.callHandler('iosCallback', {'bannerName': bannerName, 'link': link, 'objectID': objectId}, function(response) {});
    })
  },
  showAlert: function(title, content) {
    console.log(window.MobileBridgeWithIOS.version());
    console.log({'title': title, 'content': content});
    MobileBridgeWithIOS.connectWebViewJavascriptBridge(function(bridge){
      bridge.callHandler('showAlert', {'title': title, 'content': content}, function(response) {});
    })
  },
  showAlertAndRedirect: function(content, redirect_url) {
    var title = "提示";
    redirect_url = 'offline://' + $.trim(redirect_url);
    console.log(window.MobileBridgeWithIOS.version());
    console.log({'title': title, 'content': content, 'redirect_url': redirect_url, 'clean_stack': 'no'});

    MobileBridgeWithIOS.connectWebViewJavascriptBridge(function(bridge){
      bridge.callHandler('showAlertAndRedirect', {'title': title, 'content': content, 'redirectUrl': redirect_url, 'cleanStack': 'no'}, function(response) {});
    })
  },
  showAlertAndRedirectWithCleanStack: function(content, redirect_url) {
    var title = "提示";
    redirect_url = 'offline://' + $.trim(redirect_url);
    console.log(window.MobileBridgeWithIOS.version());
    console.log({'title': title, 'content': content, 'redirect_url': redirect_url, 'clean_stack': 'yes'});

    MobileBridgeWithIOS.connectWebViewJavascriptBridge(function(bridge){
      bridge.callHandler('showAlertAndRedirect', {'title': title, 'content': content, 'redirectUrl': redirect_url, 'cleanStack': 'yes'}, function(response) {});
    })
  },
  toggleShowBanner: function(state) {
    console.log(window.MobileBridgeWithIOS.version());
    console.log({'toggleShowBanner state': state});
    MobileBridgeWithIOS.connectWebViewJavascriptBridge(function(bridge){
      bridge.callHandler('toggleShowBanner', {'state': state}, function(response) {});
    })
  },
  appBadgeNum: function(type, num) {
    console.log(window.MobileBridgeWithIOS.version());
    console.log({'type': type, 'num': num});
    MobileBridgeWithIOS.connectWebViewJavascriptBridge(function(bridge){
      bridge.callHandler('appBadgeNum', {'type': type, 'num': num}, function(response) {});
    })
  },
  setBannerTitle: function(title) {
    console.log(window.MobileBridgeWithIOS.version());
    console.log({'title': title});
    MobileBridgeWithIOS.connectWebViewJavascriptBridge(function(bridge){
      bridge.callHandler('setBannerTitle', {'title': title}, function(response) {});
    })
  },
  addSubjectMenuItems: function(menu_items) {
    console.log(window.MobileBridgeWithIOS.version());
    console.log({'menu_items': menu_items});
    MobileBridgeWithIOS.connectWebViewJavascriptBridge(function(bridge){
      bridge.callHandler('addSubjectMenuItems', {'menu_items': menu_items}, function(response) {});
    })
  }
};

window.MobileBridge = {
  version: function() {
    return 'default ' + MOBILEBRIDGEVERSION;
  },
  goBack: function(message) {
    window.history.back();
  },
  goToUrl: function(htmlName) {
    console.log("redirect to: " + htmlName);

    window.location.href = htmlName;
    // var pathArray = window.location.href.split('/');
    // pathArray[pathArray.length -1] = htmlName;
    // var href = pathArray.join('/');
    // console.log(href);
    // window.location.href = href;
  },
  pageLink: function(bannerName, link, objectId) {
    console.log(window.MobileBridge.version());
    console.log({'bannerName': bannerName, 'link': link, 'objectId': objectId});

    MobileBridge.goToUrl(link.replace('offline://', ''));
  },
  showAlert: function(title, content) {
    console.log(window.MobileBridge.version());
    console.log({'title': title, 'content': content});

    alert(content);
  },
  showAlertAndRedirect: function(content, redirect_url) {
    var title = "提示";
    console.log(window.MobileBridge.version());
    console.log({'title': title, 'content': content, 'redirect_url': redirect_url, 'clean_stack': 'no'});

    alert(content);
    window.location.href = redirect_url.replace('offline://', '');
  },
  showAlertAndRedirectWithCleanStack: function(content, redirect_url) {
    var title = "提示";
    console.log(window.MobileBridge.version());
    console.log({'title': title, 'content': content, 'redirect_url': redirect_url, 'clean_stack': 'no'});

    alert(content);
    MobileBridge.goToUrl(redirect_url.replace('offline://', ''));
  },
  toggleShowBanner: function(state) {
    console.log(window.MobileBridge.version());
    console.log({'toggleShowBanner state': state});
  },
  appBadgeNum: function(type, num) {
    console.log(window.MobileBridge.version());
    console.log({'type': type, 'num': num});
  },
  setBannerTitle: function(title) {
    console.log(window.MobileBridge.version());
    console.log({'title': title});
    $(document).attr("title", title);
  },
  addSubjectMenuItems: function(menu_items) {
    console.log(window.MobileBridge.version());
    console.log({'menu_items': menu_items});
  }
};

var userAgent = navigator.userAgent;
var isAndroid = userAgent.indexOf('Android') > -1 || userAgent.indexOf('Adr') > -1; //android终端
var isiOS = !!userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
if(isiOS) {
  window.MobileBridge = window.MobileBridgeWithIOS;
}
if(isAndroid) {
  window.MobileBridge = window.MobileBridgeWithAndroid;
}

function goto_url(url) {
  if(url !== undefined && url !== null && url !== '' && $.trim(url) !== '') {
    MobileBridge.pageLink(url, 'offline://' + $.trim(url), 0);
  } else {
    alert('不支持该链接的跳转: ' + url);
  }
}

$(function() {
  window.MobileBridge.setBannerTitle($(document).attr("title"));
});
