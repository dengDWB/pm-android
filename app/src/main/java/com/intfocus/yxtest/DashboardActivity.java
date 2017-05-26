package com.intfocus.yxtest;

import android.annotation.SuppressLint;
import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.Color;
import android.net.Uri;
import android.net.http.SslError;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.webkit.JavascriptInterface;
import android.webkit.SslErrorHandler;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.AdapterView;
import android.widget.ImageView;

import com.intfocus.yxtest.util.FileUtil;
import com.intfocus.yxtest.util.HttpUtil;
import com.intfocus.yxtest.util.K;
import com.intfocus.yxtest.util.LogUtil;
import com.intfocus.yxtest.util.URLs;
import com.intfocus.yxtest.view.TabView;
import com.pgyersdk.update.PgyUpdateManager;
import com.readystatesoftware.viewbadger.BadgeView;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Timer;
import java.util.TimerTask;

import static com.intfocus.yxtest.util.URLs.kGroupId;
import static com.intfocus.yxtest.util.URLs.kRoleId;

public class DashboardActivity extends BaseActivity {
    private final static String kTab = "tab";
    private final static String kUserId = "user_id";

    public static final String ACTION_UPDATENOTIFITION = "action.updateNotifition";
    private static final int ZBAR_CAMERA_PERMISSION = 1;
    private TabView mCurrentTab;
    private ArrayList<String> urlStrings;
    private ArrayList<HashMap<String, Object>> listItem;
    private BadgeView bvKpi, bvAnalyse, bvApp, bvMessage, bvBannerSetting;
    private int objectType;
    private TabView mTabKPI, mTabAnalyse, mTabMessage;
    private WebView browserAd;
    private int mAnimationTime;
    private MenuAdapter mSimpleAdapter;
    private String currentUIVersion = "";

    private Context mContext;
    private int loadCount = 0;
    boolean waitDouble = true;
    boolean isRefresh = false;
    int totalNum;

    @Override
    @SuppressLint("SetJavaScriptEnabled")
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_dashboard);
        mContext = this;

        initUrlStrings();
        initTab();
        readBehaviorFile();
        initUserIDColorView();
        loadWebView();
        displayAdOrNot(true);

		/*
         * 检测版本更新
		 */
        checkPgyerVersionUpgrade(DashboardActivity.this, false);

		/*
         * 通过解屏进入界面后，进行用户验证
     	 */
//        checkWhetherFromScreenLockActivity();

		/*
         * 检测服务器静态资源是否更新，并下载
     	 */
        checkAssetsUpdated(false);

        if (urlStrings.get(2).equals(urlString)) {
            setWebViewLongListener(false);
        }
        isLoadErrorHtml();

        checkUserModifiedInitPassword();
        getQeuryCount();
    }

    protected void onResume() {
        super.onResume();
        mMyApp.setCurrentActivity(this);

        dealSendMessage();
        getQeuryCount();

        /*
		 * 判断是否允许浏览器复制
		 */
        isAllowBrowerCopy();
        if (urlString.contains("list.html")) {
            if (!isNetworkConnected(mAppContext)) {
                String urlStringForLoading = loadingPath("400");
                mWebView.loadUrl(urlStringForLoading);
                return;
            }
            mWebView.getSettings().setCacheMode(WebSettings.LOAD_NO_CACHE);
            mWebView.loadUrl(urlString);
        }
    }

    @Override
    protected void onPause() {
        super.onPause();
    }

    @Override
    protected void onRestart() {
        super.onRestart();
    }

    @Override
    protected void onStop() {
        if (popupWindow != null) {
            popupWindow.dismiss();
        }
        super.onStop();
    }

    protected void onDestroy() {
        mWebView = null;
        user = null;
        PgyUpdateManager.unregister(); // 解除注册蒲公英版本更新检查
        super.onDestroy();
    }

    @Override
    public void onBackPressed() {
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setTitle("温馨提示")
                .setMessage(String.format("确认退出【%s】？", getResources().getString(R.string.app_name)))
                .setPositiveButton("确认", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        mMyApp.setCurrentActivity(null);
                        finish();
                        System.exit(0);
                    }
                })
                .setNegativeButton("取消", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        // 返回DashboardActivity
                    }
                });
        builder.show();
    }

    private void dealSendMessage() {
        String pushMessagePath = String.format("%s/%s", FileUtil.basePath(mAppContext), K.kPushMessageFileName);
        JSONObject pushMessageJSON = FileUtil.readConfigFile(pushMessagePath);
        try {
            if (pushMessageJSON.has("state") && pushMessageJSON.getBoolean("state") == false) {
                jumpTab(mTabAnalyse);
                urlString = String.format(K.kStaticHtml, FileUtil.sharedPath(mContext), "list.html");
                pushMessageJSON.put("state", true);
                FileUtil.writeFile(pushMessagePath, pushMessageJSON.toString());
                displayAdOrNot(true);
            }
        } catch (JSONException | IOException e) {
            e.printStackTrace();
        }
    }

    public void jumpTab(TabView tabView) {
        mCurrentTab.setActive(false);
        mCurrentTab = tabView;
        mCurrentTab.setActive(true);
    }

    /*
     * 初始化下拉菜单按钮
     */
    private void initDropMenuItem() {
        listItem = new ArrayList<>();
        int[] imgID = {R.drawable.message, R.drawable.icon_scan, R.drawable.icon_user};
        String[] itemName = {"消息", "扫一扫", "个人信息"};
        for (int i = 0; i < itemName.length; i++) {
            HashMap<String, Object> map = new HashMap<>();
            map.put("ItemImage", imgID[i]);
            map.put("ItemText", itemName[i]);
            listItem.add(map);
        }

        mSimpleAdapter = new MenuAdapter(this, listItem, R.layout.menu_list_items, new String[]{"ItemImage", "ItemText"}, new int[]{R.id.img_menu_item, R.id.text_menu_item});
        initDropMenu(mSimpleAdapter, mDropMenuListener);
    }

    /*
     * 标题栏设置按钮下拉菜单点击响应事件
     */
    private final AdapterView.OnItemClickListener mDropMenuListener = new AdapterView.OnItemClickListener() {
        public void onItemClick(AdapterView<?> arg0, View arg1, int arg2,
                                long arg3) {
            popupWindow.dismiss();
            switch (listItem.get(arg2).get("ItemText").toString()) {
                case "消息":
                    //跳转到显示消息的界面
                    Intent intent = new Intent(DashboardActivity.this, ShowPushMessageActivity.class);
                    startActivity(intent);
                    break;

                case "个人信息":
                    Intent settingIntent = new Intent(mContext, SettingActivity.class);
                    mContext.startActivity(settingIntent);
                    break;

                case "扫一扫":
                    toast("功能待测试");
                    break;

                case "语音播报":
                    toast("功能开发中，敬请期待");
                    break;

                case "搜索":
                    toast("功能开发中，敬请期待");
                    break;
                default:
                    break;
            }
        }
    };

    /*
     * 仪表盘界面可以显示广告
     */
    private void displayAdOrNot(boolean isShouldLoadHtml) {
		/*
		 * 隐藏广告位
		 */
        if (!K.kDashboardAd) {
            return;
        }

        String adIndexBasePath = FileUtil.sharedPath(this) + "/advertisement/index";
        String adIndexPath = adIndexBasePath + ".html";
        String adIndexWithTimestampPath = adIndexBasePath + ".timestamp.html";
        String adPath = sharedPath + "/advertisement/assets/javascripts/user_permission.js";
        String userPermissionPath = FileUtil.dirPath(mContext, "config", "user_permission.js");

        if (!new File(adPath).exists() && new File(userPermissionPath).exists()) {
            FileUtil.copyFile(userPermissionPath, adPath);
        }

        if (!new File(adPath).exists() && !new File(userPermissionPath).exists()) {
            toast("用户权限文件已更新, 请至个人信息页校正");
        }

        boolean isShouldDisplayAd = mCurrentTab == mTabKPI && new File(adIndexPath).exists();
        if (isShouldDisplayAd && new File(adPath).exists()) {
            browserAd.setVisibility(View.VISIBLE);
        } else {
            browserAd.setVisibility(View.GONE);
            return;
        }

        if (new File(adIndexPath).exists()) {
            String htmlContent = FileUtil.readFile(adIndexPath);
            htmlContent = htmlContent.replaceAll("TIMESTAMP", String.format("%d", new Date().getTime()));
            try {
                FileUtil.writeFile(adIndexWithTimestampPath, htmlContent);
            } catch (IOException e) {
                e.printStackTrace();
            }
        } else {
            isShouldLoadHtml = true;
        }

        if (isShouldLoadHtml) {
            browserAd.loadUrl(String.format("file:///%s", adIndexWithTimestampPath));
        }

    }

    /*
     * 配置 mWebView
     */
    public void loadWebView() {
        mWebView = (WebView) findViewById(R.id.browser);
        initSubWebView();
        mWebView.requestFocus();
        mWebView.addJavascriptInterface(new JavaScriptInterface(), URLs.kJSInterfaceName);
        animLoading.setVisibility(View.VISIBLE);

        browserAd = (WebView) findViewById(R.id.browserAd);
        browserAd.getSettings().setUseWideViewPort(true);
        browserAd.getSettings().setLoadWithOverviewMode(true);
        browserAd.getSettings().setJavaScriptEnabled(true);
        browserAd.setOverScrollMode(View.OVER_SCROLL_NEVER);
        browserAd.getSettings().setDefaultTextEncodingName("utf-8");
        browserAd.getSettings().setCacheMode(WebSettings.LOAD_NO_CACHE);
        browserAd.requestFocus();
        browserAd.addJavascriptInterface(new JavaScriptInterface(), URLs.kJSInterfaceName);
        browserAd.setWebViewClient(new WebViewClient() {
            @Override
            public void onReceivedSslError(WebView view, SslErrorHandler handler, SslError error) {
                Log.i("uploadImg", error.toString());
                handler.proceed();
            }

            @Override
            public boolean shouldOverrideUrlLoading(android.webkit.WebView view, String url) {
                //返回值是true的时候控制去WebView打开，为false调用系统浏览器或第三方浏览器
                view.loadUrl(url);
                return true;
            }

            @Override
            public void onPageStarted(WebView view, String url, Bitmap favicon) {
                super.onPageStarted(view, url, favicon);
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
            }

            public void onReceivedError(WebView view, int errorCode, String description, String failingUrl) {
            }
        });
    }

    /*
     * 用户编号
     */
    public void checkUserModifiedInitPassword() {
        try {
            if (!user.getString(URLs.kPassword).equals(URLs.MD5(K.kInitPassword))) {
                return;
            }

            AlertDialog.Builder alertDialog = new AlertDialog.Builder(DashboardActivity.this);
            alertDialog.setTitle("温馨提示");
            alertDialog.setMessage("安全起见，请在【设置】-【个人信息】-【修改登录密码】页面修改初始密码");

            alertDialog.setNegativeButton("知道了", new DialogInterface.OnClickListener() {
                        @Override
                        public void onClick(DialogInterface dialog, int which) {
                            dialog.dismiss();
                        }
                    }
            );
            alertDialog.show();
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    /*
     * 用户编号
     */
    public void initUserIDColorView() {
        List<ImageView> colorViews = new ArrayList<>();
        colorViews.add((ImageView) findViewById(R.id.colorView0));
        colorViews.add((ImageView) findViewById(R.id.colorView1));
        colorViews.add((ImageView) findViewById(R.id.colorView2));
        colorViews.add((ImageView) findViewById(R.id.colorView3));
        colorViews.add((ImageView) findViewById(R.id.colorView4));
        initColorView(colorViews);
    }

    @SuppressLint("SetJavaScriptEnabled")
    @JavascriptInterface
    private void initTab() {
        mTabKPI = (TabView) findViewById(R.id.tabKPI);
        mTabAnalyse = (TabView) findViewById(R.id.tabAnalyse);
//		mTabAPP = (TabView) findViewById(R.id.tabApp);
        mTabMessage = (TabView) findViewById(R.id.tabMessage);
        ImageView mBannerSetting = (ImageView) findViewById(R.id.bannerSetting);

        if (K.kTabBar) {
            mTabKPI.setVisibility(K.kTabBarKPI ? View.VISIBLE : View.GONE);
            mTabAnalyse.setVisibility(K.kTabBarAnalyse ? View.VISIBLE : View.GONE);
//			mTabAPP.setVisibility(K.kTabBarApp ? View.VISIBLE : View.GONE);
            mTabMessage.setVisibility(K.kTabBarMessage ? View.VISIBLE : View.GONE);
        } else {

            findViewById(R.id.toolBar).setVisibility(View.GONE);
        }

        mTabKPI.setOnClickListener(mTabChangeListener);
        mTabAnalyse.setOnClickListener(mTabChangeListener);
//		mTabAPP.setOnClickListener(mTabChangeListener);
        mTabMessage.setOnClickListener(mTabChangeListener);

        bvKpi = new BadgeView(this, mTabKPI);
        bvAnalyse = new BadgeView(this, mTabAnalyse);
//		bvApp = new BadgeView(this, mTabAPP);
        bvMessage = new BadgeView(this, mTabMessage);
        bvBannerSetting = new BadgeView(this, mBannerSetting);
    }

	/*
     * 标签栏点击响应事件
     *
     * OBJ_TYPE_KPI = 1
     * OBJ_TYPE_ANALYSE = 2
     * OBJ_TYPE_APP = 3
     * OBJ_TYPE_REPORT = 4
     * OBJ_TYPE_MESSAGE = 5
     */

    @SuppressLint("SetJavaScriptEnabled")
    private final View.OnClickListener mTabChangeListener = new View.OnClickListener() {
        @Override
        public void onClick(View v) {
            if (v == mCurrentTab) {
                if (waitDouble) {
                    waitDouble = false;
                    new Thread(new Runnable() {
                        @Override
                        public void run() {
                            try {
                                Thread.sleep(300);
                                waitDouble = true;
                            } catch (InterruptedException e) {
                                e.printStackTrace();
                            }
                        }
                    }).start();
                    return;
                } else {
                    waitDouble = true;
                }
            }

			/*
		     * 判断是否允许浏览器复制
		 	 */
            isAllowBrowerCopy();

            mCurrentTab.setActive(false);
            mCurrentTab = (TabView) v;
            mCurrentTab.setActive(true);

            animLoading.setVisibility(View.VISIBLE);
            String currentUIVersion = URLs.currentUIVersion(mAppContext);

            displayAdOrNot(true);
            try {
                switch (v.getId()) {
                    case R.id.tabKPI:
                        objectType = 1;
                        urlString = String.format(K.kKPIMobilePath, K.kBaseUrl, currentUIVersion, user.getString(
                                kGroupId), user.getString(URLs.kRoleId));
                        bvKpi.setVisibility(View.GONE);
                        FileUtil.writeBehaviorFile(mAppContext, urlString, 0);
                        break;
                    case R.id.tabAnalyse:
                        objectType = 2;
                        urlString = urlTempFile(String.format(K.kStaticHtml, FileUtil.sharedPath(mContext), "list.html"));
                        FileUtil.writeBehaviorFile(mAppContext, urlString, 1);
                        break;

                    case R.id.tabMessage:
                        objectType = 3;
                        urlString = String.format(K.kReportMobilePath, K.kBaseUrl, currentUIVersion, user.getString(URLs.kGroupId), user.getString(
                                kRoleId));

                        bvMessage.setVisibility(View.GONE);
                        FileUtil.writeBehaviorFile(mAppContext, urlString, 2);
                        setWebViewLongListener(false);
                        break;
                    default:
                        objectType = 1;
                        urlString = String.format(K.kKPIMobilePath, K.kBaseUrl, currentUIVersion, user.getString(
                                kGroupId), user.getString(URLs.kRoleId));

                        bvKpi.setVisibility(View.GONE);
                        FileUtil.writeBehaviorFile(mAppContext, urlString, 0);
                        break;
                }
                isLoadErrorHtml();
            } catch (Exception e) {
                e.printStackTrace();
            }

			/*
			 * 用户行为记录, 单独异常处理，不可影响用户体验
			 */
            try {
                logParams = new JSONObject();
                logParams.put(URLs.kAction, " 点击 / 主页面 / 标签栏 ");
                logParams.put(URLs.kObjType, objectType);
                new Thread(mRunnableForLogger).start();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    };

    public void isLoadErrorHtml() {
        if (!isNetworkConnected(mAppContext) && urlString.contains("list.html")) {
            String urlStringForLoading = loadingPath("400");
            mWebView.loadUrl(urlStringForLoading);
        } else {
            mWebView.loadUrl(urlString);
        }
    }

    /*
     * 读取用户习惯记录,即用户上次退出时所在 Tab 页面
     */
    public void readBehaviorFile() {
        try {
            String behaviorPath = FileUtil.dirPath(mAppContext, K.kConfigDirName, K.kBehaviorConfigFileName);
            if (new File(behaviorPath).exists()) {
                JSONObject dashboardJson = FileUtil.readConfigFile(behaviorPath);
                if (dashboardJson.has("dashboard")) {
                    JSONObject behaviorJson = new JSONObject(dashboardJson.getString("dashboard"));
                    int tabIndex = behaviorJson.getInt("tab_index");
                    switch (tabIndex) {
                        case 0:
                            mCurrentTab = mTabKPI;
                            mCurrentTab.setActive(true);
                            objectType = 1;
                            break;
                        case 1:
                            mCurrentTab = mTabAnalyse;
                            mCurrentTab.setActive(true);
                            objectType = 2;
                            break;
                        case 2:
                            mCurrentTab = mTabMessage;
                            mCurrentTab.setActive(true);
                            objectType = 3;
                            break;
                    }
                    urlString = urlStrings.get(tabIndex);
                } else {
                    mCurrentTab = mTabKPI;
                    mCurrentTab.setActive(true);
                    objectType = 1;
                    urlString = urlStrings.get(0);
                }
            } else {
                mCurrentTab = mTabKPI;
                mCurrentTab.setActive(true);
                objectType = 1;
                urlString = urlStrings.get(0);
            }

        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    /*
     * 标题栏点击设置按钮显示下拉菜单
     */
    public void launchDropMenuActivity(View v) {
        initDropMenuItem();
        ImageView mBannerSetting = (ImageView) findViewById(R.id.bannerSetting);
        popupWindow.showAsDropDown(mBannerSetting, dip2px(this, -47), dip2px(this, 10));

		/*
		 * 用户行为记录, 单独异常处理，不可影响用户体验
		 */

        try {
            logParams = new JSONObject();
            logParams.put("action", "点击/主页面/下拉菜单");
            new Thread(mRunnableForLogger).start();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void initUrlStrings() {
        urlStrings = new ArrayList<>();

        String currentUIVersion = URLs.currentUIVersion(mAppContext);
        String tmpString;
        try {
            tmpString = String.format(K.kKPIMobilePath, K.kBaseUrl, currentUIVersion, user.getString(
                    kGroupId), user.getString(URLs.kRoleId));
            urlStrings.add(tmpString);
            tmpString = urlTempFile(String.format(K.kStaticHtml, FileUtil.sharedPath(mContext), "list.html"));
            urlStrings.add(tmpString);
            tmpString = String.format(K.kReportMobilePath, K.kBaseUrl, currentUIVersion, user.getString(URLs.kGroupId), user.getString(
                    kRoleId));
            urlStrings.add(tmpString);
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    /*
     * javascript & native 交互
     */
    private class JavaScriptInterface extends JavaScriptBase {
        /*
         * JS 接口，暴露给JS的方法使用@JavascriptInterface装饰
         */
        @JavascriptInterface
        public void pageLink(final String bannerName, final String link, final int objectID) {
            if (null == link || link.equals("")) {
                toast("该功能正在开发中");
                return;
            }
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    String message = String.format("%s\n%s\n%d", bannerName, link, objectID);
                    LogUtil.d("JSClick", message);

                    Intent intent = new Intent(DashboardActivity.this, SubjectActivity.class);
                    intent.setFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);
                    intent.putExtra(URLs.kBannerName, bannerName);
                    intent.putExtra(URLs.kLink, link);
                    intent.putExtra(URLs.kObjectId, objectID);
                    intent.putExtra(URLs.kObjectType, objectType);
                    DashboardActivity.this.startActivity(intent);
                }
            });

			/*
			 * 用户行为记录, 单独异常处理，不可影响用户体验
			 */

            try {
                logParams = new JSONObject();
                logParams.put(URLs.kAction, "点击/主页面/浏览器");
                logParams.put("obj_id", objectID);
                logParams.put(URLs.kObjType, objectType);
                logParams.put(URLs.kObjTitle, bannerName);
                new Thread(mRunnableForLogger).start();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        @JavascriptInterface
        public void adLink(final String openType, final String openLink, final String ObjeckID, final String objectType
                , final String objectTitle) {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    switch (openType) {
                        case "browser":
                            if (openLink == null) {
                                toast("无效链接");
                                break;
                            }
                            Intent intent = new Intent(Intent.ACTION_VIEW);
                            Uri content_url = Uri.parse(openLink);
                            intent.setData(content_url);
                            startActivity(intent);
                            break;
                        case URLs.kTabKpi:
                            break;
                        case URLs.kTabAnalyse:
                            mTabAnalyse.performClick();
                            break;
                        case URLs.kTabMessage:
                            if (openLink.equals("0") || openLink.equals("1") || openLink.equals("2")) {

                                storeTabIndex("message", Integer.parseInt(openLink));
                            }
                            mTabMessage.performClick();
                            break;
                        case "report":
                            String[] reportValue = {openLink, ObjeckID, objectType, objectTitle};
                            for (String value : reportValue) {
                                if (value == null || value.equals("")) {
                                    toast("页面跳转失败");
                                    return;
                                }
                            }
                            Intent subjectIntent = new Intent(DashboardActivity.this, SubjectActivity.class);
                            subjectIntent.setFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);
                            subjectIntent.putExtra(URLs.kLink, openLink);
                            subjectIntent.putExtra(URLs.kBannerName, objectTitle);
                            subjectIntent.putExtra(URLs.kObjectId, ObjeckID);
                            subjectIntent.putExtra(URLs.kObjectType, objectType);
                            startActivity(subjectIntent);
                            break;
                        default:
                            break;
                    }
                }
            });
        }

        @JavascriptInterface
        public void storeTabIndex(final String pageName, final int tabIndex) {
            try {
                String filePath = FileUtil.dirPath(mAppContext, K.kConfigDirName, K.kBehaviorConfigFileName);

                if ((new File(filePath).exists())) {
                    String fileContent = FileUtil.readFile(filePath);
                    JSONObject jsonObject = new JSONObject(fileContent);
                    JSONObject config = new JSONObject(jsonObject.getString("dashboard"));
                    config.put(pageName, tabIndex);
                    jsonObject.put("dashboard", config.toString());

                    FileUtil.writeFile(filePath, jsonObject.toString());
                }
            } catch (JSONException | IOException e) {
                e.printStackTrace();
            }
        }

        @JavascriptInterface
        public void appBadgeNum(final String type, final String num) {
            Log.i("uploadImg", type + num);
            totalNum = Integer.valueOf(num);
            if (type.equals("total")) {
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        if (Integer.valueOf(num) > 0) {
                            bvAnalyse.setBackgroundColor(Color.RED);
                            bvAnalyse.setText(num);
                            bvAnalyse.setBadgePosition(BadgeView.POSITION_TOP_RIGHT);
                            bvAnalyse.setBadgeMargin(66, 0);
                            bvAnalyse.show();
                        } else {
                            bvAnalyse.setVisibility(View.GONE);
                        }
                    }
                });
            }
        }

        @JavascriptInterface
        public int restoreTabIndex(final String pageName) {
            int tabIndex = 0;
            try {
                String filePath = FileUtil.dirPath(mAppContext, K.kConfigDirName, K.kBehaviorConfigFileName);

                if ((new File(filePath).exists())) {
                    String fileContent = FileUtil.readFile(filePath);
                    JSONObject jsonObject = new JSONObject(fileContent);
                    JSONObject config = new JSONObject(jsonObject.getString("dashboard"));
                    if (config.has(pageName)) {
                        tabIndex = config.getInt(pageName);
                    }
                    Log.d("Tab", tabIndex + "");
                }

            } catch (JSONException e) {
                e.printStackTrace();
            }

            return tabIndex < 0 ? 0 : tabIndex;
        }

        @JavascriptInterface
        public void setDashboardDataCount(final String tabType, final int dataCount) {
            Log.i("setDashboardDataCount", String.format("type: %s, count: %d", tabType, dataCount));
        }

        @JavascriptInterface
        public void jsException(final String ex) {
            Log.i("jsException", ex);

			/*
			 * 用户行为记录, 单独异常处理，不可影响用户体验
			 */
            try {
                logParams = new JSONObject();
                logParams.put(URLs.kAction, "JS异常");
                logParams.put(URLs.kObjType, objectType);
                logParams.put(URLs.kObjTitle, String.format("主页面/%s", ex));
                new Thread(mRunnableForLogger).start();

            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    public void getQeuryCount() {
        Timer timer = new Timer();
        timer.schedule(new TimerTask() {
            @Override
            public void run() {
                String postUrl = "http://hdcre.shimaoco.com:8280/cre-agency-app-server/";
                int count = 0;
                Map<String, String> siginResponse = HttpUtil.httpQeuryPost(postUrl, getQeuryParams("to_sign_in"));
                if (siginResponse.get("code").equals("200")) {
                    try {
                        if (siginResponse.containsKey("body")) {
                            String siginResponseBody = siginResponse.get("body");
                            JSONObject js = new JSONObject(siginResponseBody);
                            if (js.has("body") && !js.getString("body").equals(null)) {
                                String[] stringArray = js.getString("body").split("\\,");
                                count += stringArray.length;
                            }
                        }
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                }

                Map<String, String> executeResponse = HttpUtil.httpQeuryPost(postUrl, getQeuryParams("to_execute"));
                if (executeResponse.get("code").equals("200")) {
                    try {
                        if (executeResponse.containsKey("body")) {
                            String exexecuteResponseBody = executeResponse.get("body");
                            JSONObject js = new JSONObject(exexecuteResponseBody);
                            if (js.has("body") && !js.getString("body").equals(null)) {
                                String[] stringArray = js.getString("body").split("\\,");
                                count += stringArray.length;
                            }
                        }
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                }
                final String num = count + "";
                if (count > 0) {
                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            bvAnalyse.setBackgroundColor(Color.RED);
                            bvAnalyse.setText(num);
                            bvAnalyse.setBadgePosition(BadgeView.POSITION_TOP_RIGHT);
                            bvAnalyse.setBadgeMargin(66, 0);
                            bvAnalyse.show();
                        }
                    });
                } else {
                    if (totalNum == 0) {
                        runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                bvAnalyse.setVisibility(View.GONE);
                            }
                        });
                    }
                }
            }
        }, 5 * 1000, 30 * 60 * 1000);
    }

    public JSONObject getQeuryParams(String taskType) {
        JSONObject params = null;
        try {
            params = new JSONObject();
            params.put("pageSize", 10000000);
            params.put("page", 0);
            JSONObject userJson;
            String userConfigPath = String.format("%s/%s", FileUtil.basePath(DashboardActivity.this), K.kUserConfigFileName);
            if ((new File(userConfigPath)).exists()) {
                userJson = FileUtil.readConfigFile(userConfigPath);
            } else {
                userJson = new JSONObject();
            }
            if (userJson.has("user_num")) {
                params.put("userId", userJson.getString("user_num"));
            } else {
                params.put("userId", "dp");
            }
            params.put("taskType", taskType);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return params;
    }

    public String urlTempFile(String url) {
        String newHtmlPath = "";
        if (url.contains("list.html")) {
            String newLink = url.replace("file:///", "");
            Log.d("newLink1", newLink);
            String htmlContent = FileUtil.readFile(new File(newLink));
            if (htmlContent.equals("")) {
                toast("离线文件未存在");
            } else {
                String newHtmlContent = htmlContent.replaceAll("TIMESTAMP", String.format("%d", new Date().getTime()));
                newHtmlPath = String.format("%s.tmp.html", newLink);
                try {
                    FileUtil.writeFile1(newHtmlPath, newHtmlContent.toString());
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
        return "file:///" + newHtmlPath;
    }
}
