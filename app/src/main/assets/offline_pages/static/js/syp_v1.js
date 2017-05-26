SHENGYIPLUSVERSION = '1.0.1'
String.prototype.trim = function() {
  return this.replace(/(^\s*)|(\s*$)/g,'');
}

/*
  - ����ջ�߼�������ȳ��������ظ����ظ�ʱ�Ƴ�����һ�����
      - ����ȳ���������
      - �����ظ�������������ջ
      - �ظ�ʱ�����ǽ�β����ˢ��ҳ�棨ջ�������������м������Ƴ���β�����Ѵ�����λ��
      - һ����գ��ر�����ҳ��

  - ���ӷ������࣬�������ӣ�http[s]://�����������ӣ�offline://��
      - �������ӣ�http[s]://����������
      - �������ӣ�offline://��
          - ��ʽ��offline://������վ����@����ҳ��
          - ������վλ�ã�Shared/������վ�ļ���
          - ʵ����offline://HD@list.html
          - һ����գ�offline:////
 */

/*
 * Android <=> JS �����ӿ�
 */
window.SYPWithinAndroid = {
  version: function() {
    return 'android ' + SHENGYIPLUSVERSION;
  },
  /*
   * javascript �쳣ʱ֪ͨԭ�����룬���ύ���������� popup ��ʾ�û�
   */
  jsException: function(e) {
    if(window.AndroidJSBridge && typeof(window.AndroidJSBridge.jsException) === "function") {
      window.AndroidJSBridge.jsException(e);
    }
  },
  /*
   * ���м���汾����ʱ��APP �������ʾ
   */
  checkVersion: function() {
    if(window.AndroidJSBridge && typeof(window.AndroidJSBridge.checkVersion) === "function") {
      window.AndroidJSBridge.checkVersion(SHENGYIPLUSVERSION);
    }
  },
  /*
   * ����������ء�
   */
  goBack: function() {
    if(window.AndroidJSBridge && typeof(window.AndroidJSBridge.goBackBehavior) === "function") {
      window.AndroidJSBridge.goBack();
    } else {
      alert("Error δ����ӿ�(Android): goBack");
    }
  },
  /*
   * ������ת
   * ʵ����
   *     offline://index.html
   *     offline://syp@index.html
   *     http://host.com/index.html
   *
   * bannerName : ������ʹ��ԭ�����뿪�����ò�����ʾΪ����
   * link       : ����Ϊ����������ظ�����
   * objectId   : ҵ�����ID (��Ŀ�ڲ�ʹ�ã������ɴ� -1)
   */
  pageLink: function(bannerName, link, objectId) {
    link = link.trim();
    var match = link.match(/^offline:\/\/(.*?)@(.*?)$/);
    if(match && match.length === 3) {
        window.AndroidJSBridge.pageLinkWithinModule(bannerName, match[1], match[2]);
    } else {
      if(window.AndroidJSBridge && typeof(window.AndroidJSBridge.pageLink) === "function") {
        window.AndroidJSBridge.pageLink(bannerName, link, objectId);
      } else {
        alert("Error δ����ӿ�(Android): pageLink");
      }
    }
  },
  /*
   * ��Ŀ�ڲ�ģ��ҳ����ת������ҳ�棩
   *
   * ʵ����offline://syp@index.html
   *
   * bannerName : ������ʹ��ԭ�����뿪�����ò�����ʾΪ����
   * module     : ģ���ļ�������
   * pageName   : ģ��������ҳ������
   */
  pageLinkWithinModule: function(bannerName, module, pageName) {
    if(window.AndroidJSBridge && typeof(window.AndroidJSBridge.pageLinkWithinModule) === "function") {
      window.AndroidJSBridge.pageLinkWithinModule(bannerName, module, pageName);
    } else {
      alert("Error δ����ӿ�(Android): pageLink");
    }
  },
  /*
   * ԭ��������
   *
   * ��ҳ�ڲ��� `alert` �����򣬱���Ϊ��ҳ�����ļ������ƣ��û����鲻�ѡ�
   *
   * title  : �������ƣ���δʹ�ã��ɴ��գ�
   * message: ����������
   */
  showAlert: function(title, message) {
    if(window.AndroidJSBridge && typeof(window.AndroidJSBridge.showAlert) === "function") {
      window.AndroidJSBridge.showAlert(title, message);
    } else {
      alert("Error δ����ӿ�(Android): showAlert");
    }
  },
  /*
   * ԭ�������򣬵����ȷ��������ת����������
   *
   * ʹ��ԭ�������򵫼���ʹ����ҳ�ڲ�����ת��ʽʱ����ת��������ȵ������ҵ�����
   *
   * title       : �������ƣ���δʹ�ã��ɴ��գ�
   * message     : ����������
   * redirectUrl : ����ת������
   */
  showAlertAndRedirect: function(title, message, redirectUrl) {
    if(window.AndroidJSBridge && typeof(window.AndroidJSBridge.showAlertAndRedirectV1) === "function") {
      window.AndroidJSBridge.showAlertAndRedirectV1(title, message, redirectUrl, 'no');
    } else {
      alert("Error δ����ӿ�(Android): showAlertAndRedirect");
    }
  },
  /*
   * ԭ�������򣬵����ȷ��������ת���������ӣ��������ջ
   *
   * ��Щҵ�����̲����Է�����ʷ���ӣ����硺�½�����������ת��������ʱ�����ջ������������еġ����ء���ر������
   *
   * title       : �������ƣ���δʹ�ã��ɴ��գ�
   * message     : ����������
   * redirectUrl : ����ת������
   */
  showAlertAndRedirectWithCleanStack: function(title, message, redirectUrl) {
    if(window.AndroidJSBridge && typeof(window.AndroidJSBridge.showAlertAndRedirectV1) === "function") {
      window.AndroidJSBridge.showAlertAndRedirectV1(title, message, redirectUrl, 'yes');
    } else {
      alert("Error δ����ӿ�(Android): showAlertAndRedirect");
    }
  },
  /*
   * ����ԭ�������������ؼ���ʾ
   *
   * ��Щҵ������ڵ���ҳ�������б���������ʱ����ͨ���ú�������ԭ�������������ؼ���ʾ
   *
   * state: ��ʾ�����أ�show/hidden��
   */
  toggleShowBanner: function(state) {
    if(window.AndroidJSBridge && typeof(window.AndroidJSBridge.toggleShowBanner) === "function") {
      window.AndroidJSBridge.toggleShowBanner(state);
    } else {
      alert("Error δ����ӿ�(Android):  toggleShowBanner");
    }
  },
  /*
   * ��ҳ�ײ�ҳǩ��ʾ badge ����
   *
   * type: ���ͣ���֧��: total��
   * num : badge ����
   */
  appBadgeNum: function(type, num) {
    if(window.AndroidJSBridge && typeof(window.AndroidJSBridge.appBadgeNum) === "function") {
      window.AndroidJSBridge.appBadgeNum(type, num);
    } else {
      alert("Error δ����ӿ�(Android): appBadgeNum");
    }
  },
  /*
   * ���Ʊ������б�������
   *
   * title: ��������
   */
  setBannerTitle: function(title) {
    if(window.AndroidJSBridge && typeof(window.AndroidJSBridge.setBannerTitle) === "function") {
      window.AndroidJSBridge.setBannerTitle(title);
    } else {
      alert("Error δ����ӿ�(Android): setBannerTitle");
    }
  },
  /*
   * ������ϽǵĲ˵���
   *
   * menu_items: �˵������ݣ����飩
   *
   * [{
   *   title: '����¼����ʷ',
   *   link: 'offline://sale.input.historical.html'
   *  }];
   */
  addSubjectMenuItems: function(menuItems) {
    if(window.AndroidJSBridge && typeof(window.AndroidJSBridge.addSubjectMenuItems) === "function") {
      window.AndroidJSBridge.addSubjectMenuItems(JSON.stringify(menu_items));
    } else {
      alert("Error δ����ӿ�:  addSubjectMenuItems");
    }
  }
};

/*
 * iOS <=> JS �����ӿ�
 */
window.SYPWithinIOS = {
  version: function() {
    return 'ios ' + SHENGYIPLUSVERSION;
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
  jsException: function(e) {
    SYPWithinIOS.connectWebViewJavascriptBridge(function(bridge){
      bridge.callHandler('jsException', {ex: e}, function(response) {});
    })
  },
  checkVersion: function() {
    SYPWithinIOS.connectWebViewJavascriptBridge(function(bridge){
      bridge.callHandler('checkVersion', {version: SHENGYIPLUSVERSION}, function(response) {});
    })
  },
  goBack: function() {
    SYPWithinIOS.connectWebViewJavascriptBridge(function(bridge){
      bridge.callHandler('goBack', {}, function(response) {});
    })
  },
  pageLink: function(bannerName, link, objectId) {
    SYPWithinIOS.connectWebViewJavascriptBridge(function(bridge){
      bridge.callHandler('pageLink', {'bannerName': bannerName, 'link': link, 'objectID': objectId}, function(response) {});
    })
  },
  pageLinkWithinModule: function(bannerName, link, objectId) {
    SYPWithinIOS.connectWebViewJavascriptBridge(function(bridge){
      bridge.callHandler('pageLinkWithinModule', {'bannerName': bannerName, 'link': link, 'objectID': objectId}, function(response) {});
    })
  },
  showAlert: function(title, message) {
    SYPWithinIOS.connectWebViewJavascriptBridge(function(bridge){
      bridge.callHandler('showAlert', {'title': title, 'content': message}, function(response) {});
    })
  },
  showAlertAndRedirect: function(title, message, redirectUrl) {
    SYPWithinIOS.connectWebViewJavascriptBridge(function(bridge){
      bridge.callHandler('showAlertAndRedirect', {'title': title, 'content': message, 'redirectUrl': redirectUrl, 'cleanStack': 'no'}, function(response) {});
    })
  },
  showAlertAndRedirectWithCleanStack: function(title, message, redirectUrl) {
    SYPWithinIOS.connectWebViewJavascriptBridge(function(bridge){
      bridge.callHandler('showAlertAndRedirect', {'title': title, 'content': message, 'redirectUrl': redirectUrl, 'cleanStack': 'yes'}, function(response) {});
    })
  },
  toggleShowBanner: function(state) {
    SYPWithinIOS.connectWebViewJavascriptBridge(function(bridge){
      bridge.callHandler('toggleShowBanner', {'state': state}, function(response) {});
    })
  },
  appBadgeNum: function(type, num) {
    SYPWithinIOS.connectWebViewJavascriptBridge(function(bridge){
      bridge.callHandler('appBadgeNum', {'type': type, 'num': num}, function(response) {});
    })
  },
  setBannerTitle: function(title) {
    SYPWithinIOS.connectWebViewJavascriptBridge(function(bridge){
      bridge.callHandler('setBannerTitle', {'title': title}, function(response) {});
    })
  },
  addSubjectMenuItems: function(menuItems) {
    SYPWithinIOS.connectWebViewJavascriptBridge(function(bridge){
      bridge.callHandler('addSubjectMenuItems', {'menu_items': menuItems}, function(response) {});
    })
  }
};

/*
 * PC <=> JS �����ӿ�
 */
window.SYP = {
  version: function() {
    return 'default ' + SHENGYIPLUSVERSION;
  },
  checkVersion: function() {
    console.log('default ' + SHENGYIPLUSVERSION);
  },
  jsException: function(e) {
    console.log(typeof(e));
    console.log(e);
  },
  goBack: function() {
    window.history.back();
  },
  pageLink: function(bannerName, link, objectId) {
    window.location.href = link;
  },
  showAlert: function(title, message) {
    alert(message);
  },
  showAlertAndRedirect: function(title, message, redirectUrl) {
    window.location.href = redirectUrl.split('@')[1];
  },
  showAlertAndRedirectWithCleanStack: function(title, message, redirectUrl) {
    alert(message);
    window.SYP.pageLink(redirectUrl.split('@')[1]);
  },
  toggleShowBanner: function(state) {
    console.log({'toggleShowBanner state': state});
  },
  appBadgeNum: function(type, num) {
    console.log({'type': type, 'num': num});
  },
  setBannerTitle: function(title) {
    $(document).attr("title", title);
  },
  addSubjectMenuItems: function(menuItems) {
    console.log({'menu_items': menuItems});
  }
};

var userAgent = navigator.userAgent,
    isAndroid = userAgent.indexOf('Android') > -1 || userAgent.indexOf('Adr') > -1,
    isiOS = !!userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
if(isiOS) {
  window.SYP = window.SYPWithinIOS;
} else if(isAndroid) {
  window.SYP = window.SYPWithinAndroid;
}

console.log(window.SYP.version());
window.SYP.checkVersion();
window.onerror = function(e) {
  window.SYP.jsException(e);
}

function goto_url(url) {
  if(url !== undefined && url !== null && url.trim().length) {
    window.SYP.pageLinkV1(url, 'offline://hd_cre@' + url.trim(), 0);
  } else {
    alert('�����Ӳ�֧����ת: ' + url);
  }
}

$(function() {
  window.SYP.setBannerTitle($(document).attr("title"));
});