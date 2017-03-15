package com.intfocus.hdmcre;

import android.annotation.SuppressLint;
import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.AdapterView;
import android.widget.ImageView;
import android.widget.Toast;

import com.intfocus.hdmcre.util.ApiHelper;
import com.intfocus.hdmcre.util.FileUtil;
import com.intfocus.hdmcre.util.HttpUtil;
import com.intfocus.hdmcre.util.K;
import com.intfocus.hdmcre.util.LogUtil;
import com.intfocus.hdmcre.util.URLs;
import com.intfocus.hdmcre.view.TabView;
import com.pgyersdk.update.PgyUpdateManager;
import com.readystatesoftware.viewbadger.BadgeView;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.intfocus.hdmcre.util.URLs.kGroupId;

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
    boolean waitDouble = false;


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
//        checkAssetsUpdated(true);


		/*
		 * 语音播报初始化
		 */
//		SpeechUtility.createUtility(mAppContext, "appid=581aa9e1");

		/*
         * 动态注册广播用于接收通知
		 */

        if (urlStrings.get(2).equals(urlString)) {
            setWebViewLongListener(false);
        }

        mWebView.loadUrl(urlString);

        checkUserModifiedInitPassword();
        downloadUserJs();
    }

    protected void onResume() {
        mMyApp.setCurrentActivity(this);

        dealSendMessage();

        displayAdOrNot(true);

		/*
		 * 判断是否允许浏览器复制
		 */
        isAllowBrowerCopy();

        super.onResume();
    }

    @Override
    protected void onPause() {
        super.onPause();
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
            if (pushMessageJSON.has("state") && pushMessageJSON.getBoolean("state") == false){
                jumpTab(mTabAnalyse);
                urlString = String.format(K.kStaticHtml, FileUtil.sharedPath(mContext), "list.html");
                pushMessageJSON.put("state", true);
                FileUtil.writeFile(pushMessagePath, pushMessageJSON.toString());
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
        int[] imgID = {R.drawable.icon_scan, R.drawable.icon_user};
        String[] itemName = {"扫一扫", "个人信息"};
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
                case "个人信息":
                    Intent settingIntent = new Intent(mContext, SettingActivity.class);
                    mContext.startActivity(settingIntent);
                    break;

                case "扫一扫":
                    toast("功能待测试");
                    break;
//                    if (ContextCompat.checkSelfPermission(DashboardActivity.this, Manifest.permission.CAMERA)
//                            != PackageManager.PERMISSION_GRANTED) {
//                        setAlertDialog(DashboardActivity.this, "相机权限获取失败，是否到本应用的设置界面设置权限");
//                    } else {
//                        Intent barCodeScannerIntent = new Intent(mContext, BarCodeScannerActivity.class);
//                        mContext.startActivity(barCodeScannerIntent);
//                    }
//                    break;

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

        boolean isShouldDisplayAd = mCurrentTab == mTabKPI && new File(adIndexPath).exists();
        if (isShouldDisplayAd) {
            browserAd.setVisibility(View.VISIBLE);
        } else {
            browserAd.setVisibility(View.GONE);
        }
    }

    /*
     * 配置 mWebView
     */
    public void loadWebView() {
//        pullToRefreshWebView = (PullToRefreshWebView) findViewById(R.id.browser);
//        initPullWebView();
        mWebView = (WebView) findViewById(R.id.browser);
        initSubWebView();
//        setPullToRefreshWebView(true);
        mWebView.requestFocus();
        mWebView.getSettings().setDomStorageEnabled(true);
        mWebView.addJavascriptInterface(new JavaScriptInterface(), URLs.kJSInterfaceName);
        animLoading.setVisibility(View.VISIBLE);

        browserAd = (WebView) findViewById(R.id.browserAd);
        browserAd.getSettings().setUseWideViewPort(true);
        browserAd.getSettings().setLoadWithOverviewMode(true);
        browserAd.getSettings().setJavaScriptEnabled(true);
        browserAd.setOverScrollMode(View.OVER_SCROLL_NEVER);
        browserAd.getSettings().setDefaultTextEncodingName("utf-8");
        browserAd.requestFocus();
        browserAd.addJavascriptInterface(new JavaScriptInterface(), URLs.kJSInterfaceName);
        browserAd.setWebViewClient(new WebViewClient());
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
                return;
//                if ( waitDouble == false )
//                {
//                    waitDouble = true;
//                    Thread thread = new Thread() {
//                        @Override
//                        public void run() {
//                            try {
//                                sleep(500);
//                                if ( waitDouble == false ) {
//                                    waitDouble = true;
//                                    Log.d("waitDouble1", waitDouble +"");
//                                    return;
//                                }
//                            } catch (InterruptedException e) {
//                                e.printStackTrace();
//                            }
//                        }
//                    };
//                    thread.start();
//                } else {
//                    waitDouble = true;
//                }
            }
            Log.d("waitDouble", waitDouble +"");
			/*
		     * 判断是否允许浏览器复制
		 	 */
            isAllowBrowerCopy();

            mCurrentTab.setActive(false);
            mCurrentTab = (TabView) v;
            mCurrentTab.setActive(true);

            animLoading.setVisibility(View.VISIBLE);
            String currentUIVersion = URLs.currentUIVersion(mAppContext);

            displayAdOrNot(false);
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
                        urlString = String.format(K.kStaticHtml, FileUtil.sharedPath(mContext), "list.html");
                        FileUtil.writeBehaviorFile(mAppContext, urlString, 1);
                        break;

                    case R.id.tabMessage:
                        objectType = 3;
                        urlString = String.format(K.kMessageMobilePath, K.kBaseUrl, currentUIVersion, user.getString(URLs.kRoleId), user.getString(
                                kGroupId), user.getString(kUserId));

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

                mWebView.loadUrl(urlString);
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

	/*
     * view 缩放动画
     */
//	public void viewAnimation(final View view, final Boolean isShow, final int startHeight, final int endHeight) {
//		runOnUiThread(new Runnable() {
//			@Override
//			public void run() {
//				mAnimationTime = getResources().getInteger(android.R.integer.config_mediumAnimTime);//动画效果时间
//				final ViewGroup.LayoutParams layoutParams = view.getLayoutParams();
//				ValueAnimator valueAnimator = ValueAnimator.ofInt(startHeight, endHeight);
//				valueAnimator.addUpdateListener(new ValueAnimator.AnimatorUpdateListener() {
//					@Override
//					public void onAnimationUpdate(ValueAnimator animation) {
//						layoutParams.height = (int) animation.getAnimatedValue();
//						view.setLayoutParams(layoutParams);
//						view.requestLayout();
//					}
//				});
//
//				valueAnimator.addListener(new AnimatorListenerAdapter() {
//					@Override
//					public void onAnimationStart(Animator animation) {
//						super.onAnimationStart(animation);
//						if (isShow) {
//							view.setVisibility(View.VISIBLE);
//						}
//					}
//
//					@Override
//					public void onAnimationEnd(Animator animation) {
//						super.onAnimationEnd(animation);
//						if (!isShow) {
//							view.setVisibility(View.GONE);
//						}
//					}
//				});
//				valueAnimator.setDuration(mAnimationTime);
//				valueAnimator.start();
//			}
//		});
//	}

    private void initUrlStrings() {
        urlStrings = new ArrayList<>();

        String currentUIVersion = URLs.currentUIVersion(mAppContext);
        String tmpString;
        try {
            tmpString = String.format(K.kKPIMobilePath, K.kBaseUrl, currentUIVersion, user.getString(
                    kGroupId), user.getString(URLs.kRoleId));
            urlStrings.add(tmpString);
            tmpString = String.format(K.kStaticHtml, FileUtil.sharedPath(mContext), "list.html");
            urlStrings.add(tmpString);
            tmpString = String.format(K.kMessageMobilePath, K.kBaseUrl, currentUIVersion, user.getString(URLs.kRoleId), user.getString(
                    kGroupId), user.getString(kUserId));
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
//						case URLs.kTabApp:
//							mTabAPP.performClick();
//							break;
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

//		@JavascriptInterface
//		public void hideAd() {
//			viewAnimation(browserAd, false, dip2px(DashboardActivity.this, 140), 0);
//		}

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
            Log.i("uploadImg",type + num);
            if (type.equals("total")){
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        bvAnalyse.setBackgroundColor(Color.RED);
                        bvAnalyse.setText(num);
                        bvAnalyse.setBadgePosition(BadgeView.POSITION_TOP_RIGHT);
                        bvAnalyse.setBadgeMargin(66,0);
                        bvAnalyse.show();
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

//				//点击两次还是有异常 异常报出
//				if (loadCount < 2) {
//					showWebViewExceptionForWithoutNetwork();
//					loadCount++;
//				}
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    public void downloadUserJs() {
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    String userConfigPath = String.format("%s/%s", FileUtil.basePath(mAppContext), K.kUserConfigFileName);
                    JSONObject userJSON = FileUtil.readConfigFile(userConfigPath);
                    final String downloadJsUrlString = String.format(K.kUserJsDownload, K.kBaseUrl, userJSON.getString("user_num"));
                    String fileNameMd5 = String.format(K.kFileNameMd5APIPath, K.kBaseUrl, userJSON.getString("user_num"));
                    final String assetsPath = FileUtil.sharedPath(mAppContext);
                    Map<String, String> headers = ApiHelper.checkResponseHeader(urlString, assetsPath);
                    final String downloadPath = FileUtil.dirPath(mAppContext, "Cached/" + String.format("%d", new Date().getTime()), "user_permission.js");
                    final String outPath = assetsPath + "/offline_pages/static/js/user_permission.js";
                    final Map<String, String> downloadJsResponse = HttpUtil.downloadZip(downloadJsUrlString, downloadPath, headers);
                    final Map<String, String> md5Response = HttpUtil.httpGet(fileNameMd5, new HashMap<String, String>());
                    String md5 = "";
                    if (md5Response.containsKey("code") && md5Response.get(URLs.kCode).equals("200")){
                        JSONObject bodyJs =  new JSONObject(md5Response.get("body"));
                        if (bodyJs.has("filemd5")){
                            md5 = bodyJs.getString("filemd5");
                        }
                    }
                    final String finalMd5 = md5;
                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            boolean flag = false;
                            if (downloadJsResponse.containsKey(URLs.kCode) && downloadJsResponse.get(URLs.kCode).equals("200") && new File(downloadPath).exists()) {
                                try {
                                    InputStream zipStream = new FileInputStream(downloadPath);
                                    String md5String = FileUtil.MD5(zipStream);
                                    Log.d("md52",finalMd5 + " : " + md5String);
                                    if (finalMd5.equals(md5String)){
                                        String newPath = assetsPath + "/advertisement/assets/javascripts/user_permission.js";
                                        String userPermissionPath = FileUtil.dirPath(mAppContext, "configs","user_permission.js");
                                        FileUtil.copyFile(downloadPath, outPath);
                                        FileUtil.copyFile(downloadPath, newPath);
                                        FileUtil.copyFile(downloadPath, userPermissionPath);
                                    }else {
                                        flag = true;
                                    }
                                } catch (FileNotFoundException e) {
                                    flag = true;
                                    e.printStackTrace();
                                }
                            } else {
                                flag = true;
                            }

                            if (flag) {
                                Toast.makeText(mAppContext, "用户权限验证失败", Toast.LENGTH_SHORT).show();
                                SharedPreferences mSharedPreferences = mContext.getSharedPreferences("loginState",MODE_PRIVATE);
                                SharedPreferences.Editor mEditor = mSharedPreferences.edit();
                                mEditor.putBoolean("isLogin",false);
                                mEditor.commit();

                                Intent intent = new Intent(DashboardActivity.this, LoginActivity.class);
                                startActivity(intent);
                                finish();
                            }
                        }
                    });
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        }).start();
    }
}
