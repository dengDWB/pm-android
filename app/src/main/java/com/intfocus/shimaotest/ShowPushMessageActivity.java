package com.intfocus.shimaotest;

import android.os.Bundle;
import android.view.View;
import android.webkit.WebChromeClient;
import android.webkit.WebView;


import com.intfocus.shimaotest.util.K;
import com.intfocus.shimaotest.util.URLs;

import org.json.JSONException;

import static com.intfocus.shimaotest.util.URLs.kRoleId;


/**
 * Created by 40284 on 2017/5/8.
 */

public class ShowPushMessageActivity extends BaseActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_show_push_message);
        loadWebView();
        try {
            String currentUIVersion = URLs.currentUIVersion(mAppContext);
            urlString = String.format(K.kPushMessageMobilePath, K.kBaseUrl, currentUIVersion, user.getString(
                    kRoleId), user.getString(URLs.kGroupId), user.getString(
                    "user_id"));
            isLoadErrorHtml();
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    /*
     * 配置 mWebView
     */
    public void loadWebView() {
        mWebView = (WebView) findViewById(R.id.browser);
        initSubWebView();
        mWebView.setWebChromeClient(new WebChromeClient());
        mWebView.requestFocus();
        mWebView.addJavascriptInterface(new JavaScriptInterface(), URLs.kJSInterfaceName);
        setWebViewLongListener(false);
        animLoading.setVisibility(View.VISIBLE);
    }

    /*
     * javascript & native 交互
     */
    private class JavaScriptInterface extends JavaScriptBase {

    }

    //加载网页的处理
    public void isLoadErrorHtml(){
        animLoading.setVisibility(View.VISIBLE);
        if (!isNetworkConnected(mAppContext) && urlString.contains("list.html")){
            String urlStringForLoading = loadingPath("400");
            mWebView.loadUrl(urlStringForLoading);
        }else {
            mWebView.loadUrl(urlString);
        }
    }

    /*
	 * 返回
	 */
    public void dismissActivity(View v) {
        ShowPushMessageActivity.this.onBackPressed();
    }

    public void refresh(View v){
        isLoadErrorHtml();
    }
}
