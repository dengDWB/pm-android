package com.intfocus.yxtest;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.res.Configuration;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Paint;
import android.net.Uri;
import android.net.http.SslError;
import android.os.AsyncTask;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.provider.MediaStore;
import android.text.TextUtils;
import android.util.Log;
import android.view.View;
import android.view.WindowManager;
import android.webkit.JavascriptInterface;
import android.webkit.SslErrorHandler;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.AdapterView;
import android.widget.ImageView;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Toast;

import com.intfocus.yxtest.util.ApiHelper;
import com.intfocus.yxtest.util.FileUtil;
import com.intfocus.yxtest.util.HttpUtil;
import com.intfocus.yxtest.util.ImageUtil;
import com.intfocus.yxtest.util.K;
import com.intfocus.yxtest.util.LogUtil;
import com.intfocus.yxtest.util.PrivateURLs;
import com.intfocus.yxtest.util.URLs;
import com.umeng.message.util.HttpRequest;
import com.umeng.socialize.ShareAction;
import com.umeng.socialize.UMShareAPI;
import com.umeng.socialize.UMShareListener;
import com.umeng.socialize.bean.SHARE_MEDIA;
import com.umeng.socialize.media.UMImage;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.xutils.common.Callback;
import org.xutils.common.util.KeyValue;
import org.xutils.ex.HttpException;
import org.xutils.http.RequestParams;
import org.xutils.x;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static android.webkit.WebView.enableSlowWholeDocumentDraw;
import static com.intfocus.yxtest.util.K.kUploadImgAPIPath;

import static java.lang.String.format;

public class SubjectActivity extends BaseActivity {
    private Boolean isInnerLink = false, isSupportSearch;
    private String templateID, reportID;
    private String bannerName, link;
    private int groupID, objectID, objectType;
    private String userNum;
    private RelativeLayout bannerView;
    private ArrayList<HashMap<String, String>> listItem = new ArrayList<>();
    private ArrayList<HashMap<String, String>> menuListItem = new ArrayList<>();
    private Context mContext;
    private Map<String, String> staticUrlMap;
    private TextView mTitle, mTvBannerBack;
    private Intent mSourceIntent;
    AlertDialog.Builder builder;
    String offlineLink = "";
    private ImageView mBannerSetting, mIvBannerBack;
    private MenuAdapter mSimpleAdapter;
    private String imgSourcePath;
    private String imgUploadString;

    /* 请求识别码 */
    private static final int CODE_RESULT_REQUEST = 0xa2;
    private static final int CODE_CAMERA_REQUEST = 0xa1;
    private static final int CODE_CAMERA_RESULT = 0xa0;

    @Override
    @SuppressLint("SetJavaScriptEnabled")
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        /*
         * 判断当前设备版本，5.0 以上 Android 系统使用才 enableSlowWholeDocumentDraw();
		 */
        if (Build.VERSION.SDK_INT > 20) {
            enableSlowWholeDocumentDraw();
        }
        setContentView(R.layout.activity_subject);

        mContext = SubjectActivity.this;
        initActiongBar();
        /*
         * JSON Data
		 */
        try {
            groupID = user.getInt(URLs.kGroupId);
            userNum = user.getString(URLs.kUserNum);
        } catch (JSONException e) {
            e.printStackTrace();
            groupID = -2;
            userNum = "not-set";
        }
        initWebView();

        checkInterfaceOrientation(this.getResources().getConfiguration());

        List<ImageView> colorViews = new ArrayList<>();
        colorViews.add((ImageView) findViewById(R.id.colorView0));
        colorViews.add((ImageView) findViewById(R.id.colorView1));
        colorViews.add((ImageView) findViewById(R.id.colorView2));
        colorViews.add((ImageView) findViewById(R.id.colorView3));
        colorViews.add((ImageView) findViewById(R.id.colorView4));
        initColorView(colorViews);
    }

    @Override
    protected void onDestroy() {
        mWebView.loadUrl("javascript:localStorage.clear()");
        super.onDestroy();
    }

    public void initWebView() {
        animLoading = (RelativeLayout) findViewById(R.id.anim_loading);
        mWebView = (WebView) findViewById(R.id.browser);
        initSubWebView();
        mWebView.setWebChromeClient(new mWebChromeClient());
        mWebView.setWebViewClient(new WebViewClient() {
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
                Log.i("onPageStarted", "0");
                menuListItem.clear();
                if (listItem != null) {
                    listItem.clear();
                }
                HashMap<String, String> map1 = new HashMap<>();
                map1.put("itemContent", "");
                map1.put("itemText", "刷新");
                menuListItem.add(map1);
                Log.i("onPageStarted", String.format("%s - %s", URLs.timestamp(), urlString));
                setUrlStack(url);
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                // mBannerSetting 设置图片
                if (menuListItem.size() <= 1) {
                    mBannerSetting.setImageResource(R.drawable.btn_refresh);
                } else {
                    mBannerSetting.setImageResource(R.drawable.banner_setting);
                }
                mBannerSetting.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        if (menuListItem.size() <= 1) {
                            refresh();
                        } else {
                            launchDropMenuActivity();
                        }
                    }
                });
                Log.i("onPageStarted", "2");
                animLoading.setVisibility(View.GONE);
                LogUtil.d("onPageFinished", String.format("%s - %s", URLs.timestamp(), url));
                mWebView.clearCache(true);
            }

            public void onReceivedError(WebView view, int errorCode, String description, String failingUrl) {
                LogUtil.d("onReceivedError111",
                        String.format("errorCode: %d, description: %s, url: %s", errorCode, description,
                                failingUrl));
            }
        });

        mWebView.requestFocus();
        mWebView.setVisibility(View.VISIBLE);
        mWebView.addJavascriptInterface(new JavaScriptInterface(), URLs.kJSInterfaceName);
        animLoading.setVisibility(View.VISIBLE);
    }

    public class mWebChromeClient extends WebChromeClient {
        // Android 5.0 以上
        @Override
        public boolean onShowFileChooser(WebView webView, ValueCallback<Uri[]> filePathCallback, FileChooserParams fileChooserParams) {
            if (mUploadMessage1 != null) {
                mUploadMessage1 = null;
            }
            Log.i("FileType1", fileChooserParams.toString());
            mUploadMessage1 = filePathCallback;
            showOptions();
            return true;
        }

        //Android 4.0 以下
        public void openFileChooser(ValueCallback<Uri> uploadMsg, String acceptType) {
            mUploadMessage = uploadMsg;
            showOptions();
        }

        // Android 4.0 - 4.4.4
        public void openFileChooser(ValueCallback<Uri> uploadMsg, String acceptType, String capture) {
            mUploadMessage = uploadMsg;
            showOptions();
        }
    }

    public void setUrlStack(String url) {
        boolean flag = false;
        if (urlStack.isEmpty()) {
            urlStack.push(url);
        } else {
            for (int i = 0; i < urlStack.size(); i++) {
                if (urlStack.get(i).equals(url)) {
                    for (int j = i + 1; j < urlStack.size(); j++) {
                        urlStack.remove(j);
                    }
                    flag = true;
                }
            }
            if (!flag && !url.contains("400.html")) {
                urlStack.push(url);
            }
        }
    }

    private void initActiongBar() {
        mTvBannerBack = (TextView) findViewById(R.id.tvBannerBack);
        mIvBannerBack = (ImageView) findViewById(R.id.ivbannerBack);
        bannerView = (RelativeLayout) findViewById(R.id.actionBar);
        mBannerSetting = (ImageView) findViewById(R.id.bannerSetting);
        mBannerSetting.setVisibility(View.VISIBLE);
        mTitle = (TextView) findViewById(R.id.bannerTitle);

		/*
         * Intent Data || JSON Data
         */
        Intent intent = getIntent();
        link = intent.getStringExtra(URLs.kLink);
        bannerName = intent.getStringExtra(URLs.kBannerName);
        objectID = intent.getIntExtra(URLs.kObjectId, -1);
        objectType = intent.getIntExtra(URLs.kObjectType, -1);
        mTitle.setText(bannerName);

        if (link.startsWith("offline:////")) {
            finish();
        }

        if (link.startsWith("offline://")) {
        } else {
            isInnerLink = !(link.startsWith("http://") || link.startsWith("https://"));
        }
        if (isInnerLink) {
            initInnerLinkParms();
//            WebSettings webSettings = mWebView.getSettings();
//            webSettings.setCacheMode(WebSettings.LOAD_NO_CACHE);
            //  判断是否加入筛选菜单项
            if (FileUtil.reportIsSupportSearch(mAppContext, String.format("%d", groupID), templateID, reportID)) {
                HashMap<String, String> map = new HashMap<>();
                map.put("itemContent", "");
                map.put("itemText", "筛选");
                menuListItem.add(map);
            }
        }
    }

    void initInnerLinkParms() {
        // format: /mobile/v1/group/:group_id/template/:template_id/report/:report_id
        // deprecated
        // format: /mobile/report/:report_id/group/:group_id
        templateID = TextUtils.split(link, "/")[6];
        reportID = TextUtils.split(link, "/")[8];
        String urlPath = format(link.replace("%@", "%d"), groupID);
        urlString = String.format("%s%s", K.kBaseUrl, urlPath);
    }

    public void launchDropMenuActivity() {
        initDropMenuItem();
        popupWindow.showAsDropDown(mBannerSetting, dip2px(this, -47), dip2px(this, 10));

		/*
         * 用户行为记录, 单独异常处理，不可影响用户体验
		 */
        try {
            logParams = new JSONObject();
            logParams.put("action", "点击/报表/下拉菜单");
            new Thread(mRunnableForLogger).start();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /*
     * 初始化标题栏下拉菜单
     */
    private void initDropMenuItem() {
        if (mSimpleAdapter == null) {
            mSimpleAdapter = new MenuAdapter(this, menuListItem, R.layout.menu_list_items, new String[]{"itemContent", "itemText"}, new int[]{R.id.img_menu_item, R.id.text_menu_item});
        } else {
            mSimpleAdapter.setDatas(menuListItem);
        }
        initDropMenu(mSimpleAdapter, mDropMenuListener);
    }

    /*
     * 标题栏设置按钮下拉菜单点击响应事件
     */
    private final AdapterView.OnItemClickListener mDropMenuListener = new AdapterView.OnItemClickListener() {
        public void onItemClick(AdapterView<?> arg0, View arg1, int arg2,
                                long arg3) {
            popupWindow.dismiss();

            switch (menuListItem.get(arg2).get("itemText").toString()) {
                case "筛选":
                    actionLaunchReportSelectorActivity(arg1);
                    break;

                case "刷新":
                    refresh();
                    break;

                default:
                    String mItemLink = menuListItem.get(arg2).get("itemContent").toString();
                    loadHtml(mItemLink);

                    listItem = null;
                    initActiongBar();
                    mBannerSetting.setImageResource(R.drawable.btn_refresh);
                    break;
            }
        }
    };

    void loadHtml(String url) {
        if (!isNetworkConnected(mAppContext)) {
            String urlStringForLoading = loadingPath("400");
            mWebView.loadUrl(urlStringForLoading);
            return;
        }

        if (url.startsWith("offline:////")) {
            finish();
        } else if (url.startsWith("offline://")) {
            String urlParms = "";
            if (url.contains("?")) {
                urlParms = url.substring(url.indexOf("?"), url.length());
                url = url.substring(0, url.indexOf("?"));
            }
            String loadUrl = urlTempFile(url) + urlParms;
            if (!loadUrl.equals("")) {
                mWebView.loadUrl("file://" + loadUrl);
            }
        } else if (url.startsWith("offline:///")) {
            mWebView.loadUrl((String) urlStack.get(0));
        } else {
            mWebView.loadUrl(url);
        }
    }

    public void onResume() {
        mMyApp.setCurrentActivity(this);
        isWeiXinShared = false;

		/*
         * 判断是否允许浏览器复制
		 */
        isAllowBrowerCopy();
        if (!urlStack.empty() && isInnerLink) {
            refresh();
        }
        super.onResume();
    }

    protected void displayBannerTitleAndSearchIcon() {
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                String selectedItem = FileUtil.reportSelectedItem(SubjectActivity.this, String.format("%d", groupID), templateID, reportID);
                if (selectedItem == null || selectedItem.length() == 0) {
                    ArrayList<String> items = FileUtil.reportSearchItems(SubjectActivity.this, String.format("%d", groupID), templateID, reportID);
                    if (items.size() > 0) {
                        selectedItem = items.get(0);
                    } else {
                        selectedItem = String.format("%s(NONE)", bannerName);
                    }
                }
                TextView mTitle = (TextView) findViewById(R.id.bannerTitle);
                mTitle.setText(selectedItem);
            }
        });
    }

    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        super.onConfigurationChanged(newConfig);

        // 横屏时隐藏标题栏、导航栏
        checkInterfaceOrientation(newConfig);
    }

    /*
     * 横屏 or 竖屏
     */
    private void checkInterfaceOrientation(Configuration config) {
        Boolean isLandscape = (config.orientation == Configuration.ORIENTATION_LANDSCAPE);

        bannerView.setVisibility(isLandscape ? View.GONE : View.VISIBLE);
        if (isLandscape) {
            WindowManager.LayoutParams lp = getWindow().getAttributes();
            lp.flags |= WindowManager.LayoutParams.FLAG_FULLSCREEN;
            getWindow().setAttributes(lp);
            getWindow().addFlags(WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS);
        } else {
            WindowManager.LayoutParams attr = getWindow().getAttributes();
            attr.flags &= (~WindowManager.LayoutParams.FLAG_FULLSCREEN);
            getWindow().setAttributes(attr);
            getWindow().clearFlags(WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS);
        }

        mWebView.post(new Runnable() {
            @Override
            public void run() {
                loadHtml();
            }
        });
    }

    private void loadHtml() {
        WebSettings webSettings = mWebView.getSettings();
        if (isInnerLink) {
            /**
             * 内部报表具有筛选功能时
             *   - 如果用户已选择，则 banner 显示该选项名称
             *   - 未设置时，默认显示筛选项列表中第一个
             *
             *  初次加载时，判断筛选功能的条件还未生效
             *  此处仅在第二次及以后才会生效
             */
            isSupportSearch = FileUtil.reportIsSupportSearch(mAppContext, String.format("%d", groupID), templateID, reportID);
            if (isSupportSearch) {
                displayBannerTitleAndSearchIcon();
            }

            new Thread(new Runnable() {
                @Override
                public void run() {
                    boolean reportDataState = ApiHelper.reportData(mAppContext, String.format("%d", groupID), templateID, reportID);
                    if (reportDataState) {
                        new Thread(mRunnableForDetecting).start();
                    } else {
                        showWebViewExceptionForWithoutNetwork();
                    }
                }
            }).start();
        } else {
            urlString = link;
            webSettings.setDomStorageEnabled(true);
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    String loadUrl = urlTempFile(urlString);
                    urlString = "file:///" + loadUrl;
                    loadHtml(urlString);
                }
            });
        }
    }

    /*
     * 内部报表具有筛选功能时，调用筛选项界面
     */
    public void actionLaunchReportSelectorActivity(View v) {
        Intent intent = new Intent(mContext, ReportSelectorAcitity.class);
        intent.putExtra(URLs.kBannerName, bannerName);
        intent.putExtra(URLs.kGroupId, groupID);
        intent.putExtra("reportID", reportID);
        intent.putExtra("templateID", templateID);
        mContext.startActivity(intent);
    }

    /*
     * 分享截图至微信
     */
    public void actionShare2Weixin(View v) {
        if (link.toLowerCase().endsWith(".pdf")) {
            toast("暂不支持 PDF 分享");
            return;
        }
        if (!isWeiXinShared) {
            toast("网页加载完成,才能使用分享功能");
            return;
        }
        Bitmap imgBmp;
        String filePath = FileUtil.basePath(mAppContext) + "/" + K.kCachedDirName + "/" + "timestmap.png";

        String betaConfigPath = FileUtil.dirPath(mAppContext, K.kConfigDirName, K.kBetaConfigFileName);
        JSONObject betaJSON = FileUtil.readConfigFile(betaConfigPath);

        try {
            mWebView.setDrawingCacheEnabled(true);
            if (!betaJSON.has("image_within_screen") || betaJSON.getBoolean("image_within_screen")) {
                mWebView.measure(View.MeasureSpec.makeMeasureSpec(
                        View.MeasureSpec.UNSPECIFIED, View.MeasureSpec.UNSPECIFIED),
                        View.MeasureSpec.makeMeasureSpec(0, View.MeasureSpec.UNSPECIFIED));
                mWebView.buildDrawingCache();
                int imgMaxHight = displayMetrics.heightPixels * 5;
                if (mWebView.getMeasuredHeight() > imgMaxHight) {
                    toast("文件过大,无法分享!");
                    return;
                }
                imgBmp = Bitmap.createBitmap(mWebView.getMeasuredWidth(),
                        mWebView.getMeasuredHeight(), Bitmap.Config.ARGB_8888);
                if (imgBmp == null && imgBmp.getWidth() <= 0 && imgBmp.getHeight() <= 0) {
                    toast("截图失败");
                    return;
                }
                Canvas canvas = new Canvas(imgBmp);
                Paint paint = new Paint();
                int iHeight = imgBmp.getHeight();
                canvas.drawBitmap(imgBmp, 0, iHeight, paint);
                mWebView.draw(canvas);
            } else {
                imgBmp = mWebView.getDrawingCache();
            }
            FileUtil.saveImage(filePath, imgBmp);
            mWebView.setDrawingCacheEnabled(false);
            imgBmp.recycle(); // 回收 bitmap 资源，避免内存浪费
        } catch (JSONException e) {
            e.printStackTrace();
        }

        File file = new File(filePath);
        if (file.exists() && file.length() > 0) {
            UMImage image = new UMImage(SubjectActivity.this, file);

            new ShareAction(this)
                    .withTitle("分享截图")
                    .setPlatform(SHARE_MEDIA.WEIXIN)
                    .setDisplayList(SHARE_MEDIA.WEIXIN)
                    .setCallback(umShareListener)
                    .withMedia(image)
                    .open();
        } else {
            toast("截图失败,请尝试系统截图");
        }
    }

    private final UMShareListener umShareListener = new UMShareListener() {
        @Override
        public void onResult(SHARE_MEDIA platform) {
            Log.d("plat", "platform" + platform);
        }

        @Override
        public void onError(SHARE_MEDIA platform, Throwable t) {
            toast("分享失败啦");
        }

        @Override
        public void onCancel(SHARE_MEDIA platform) {
        }
    };

    /*
     * 评论
     */
    public void actionLaunchCommentActivity(View v) {
        Intent intent = new Intent(mContext, CommentActivity.class);
        intent.putExtra(URLs.kBannerName, bannerName);
        intent.putExtra(URLs.kObjectId, objectID);
        intent.putExtra(URLs.kObjectType, objectType);
        mContext.startActivity(intent);
    }

    /*
     * 返回
     */
    public void dismissActivity(View v) {
        SubjectActivity.this.onBackPressed();
    }

    @Override
    public void onBackPressed() {
        Log.i("urlStack", urlStack.toString());
        if (urlStack.size() > 1) {
            urlStack.pop();
            mWebView.getSettings().setDomStorageEnabled(true);
            urlString = (String) urlStack.peek();
            loadHtml(urlString);
        } else {
            finish();
        }
    }

    public void refresh(View v) {
        animLoading.setVisibility(View.VISIBLE);
        new refreshTask().execute();
    }

    public void refresh() {
        animLoading.setVisibility(View.VISIBLE);
        new refreshTask().execute();
    }

    private class refreshTask extends AsyncTask<Void, Void, Void> {
        @Override
        protected Void doInBackground(Void... params) {
            // 如果这个地方不使用线程休息的话，刷新就不会显示在那个 PullToRefreshListView 的 UpdatedLabel 上面

            /*
             *  下拉浏览器刷新时，删除响应头文件，相当于无缓存刷新
             */
            if (isInnerLink) {
                String urlKey;
                if (urlString != null && !urlString.isEmpty()) {
                    urlKey = urlString.contains("?") ? TextUtils.split(urlString, "?")[0] : urlString;
                    ApiHelper.clearResponseHeader(urlKey, assetsPath);
                }
                urlKey = String.format(K.kReportDataAPIPath, K.kBaseUrl, groupID, templateID, reportID);
                ApiHelper.clearResponseHeader(urlKey, FileUtil.sharedPath(mAppContext));

                boolean reportDataState = ApiHelper.reportData(mAppContext, String.format("%d", groupID), templateID, reportID);

                if (reportDataState) {
                    new Thread(mRunnableForDetecting).start();
                } else {
                    showWebViewExceptionForWithoutNetwork();
                }

                /*
                 * 用户行为记录, 单独异常处理，不可影响用户体验
                 */
                try {
                    logParams = new JSONObject();
                    logParams.put(URLs.kAction, "刷新/浏览器");
                    logParams.put(URLs.kObjTitle, urlString);
                    new Thread(mRunnableForLogger).start();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
            return null;
        }

        @Override
        protected void onPostExecute(Void aVoid) {
            super.onPostExecute(aVoid);
            String url = (String) urlStack.peek();
            Log.i("refreshURL", url);
            if (url.contains("offline_pages") && url.contains("file")) {
                urlString = (String) urlStack.peek();
                mWebView.getSettings().setDomStorageEnabled(true);
                loadHtml(urlString);
            }
        }
    }

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
                    loadHtml(link);
                }
            });
        }

        @JavascriptInterface
        public void setBannerTitle(final String bannerTitle) {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    if (!bannerTitle.equals("")) {
                        mTitle.setText(bannerTitle);
                    } else {
                        mTitle.setText("");
                    }
                }
            });
        }

        @JavascriptInterface
        public void showAlertAndRedirectV1(final String title, final String content, final String redirect_url, String cleanStack) {

            if (cleanStack.equals("yes")) {
                urlStack.clear();
            }
            if (!(title.equals("")) && !(content.equals(""))) {
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        showAlertDialog(title, content, redirect_url);
                    }
                });
            } else {
                loadHtml(redirect_url);
            }

        }

        @JavascriptInterface
        public void showAlertAndRedirectV1(final String title, final String content, final String redirect_url) {
            Log.d("pages1", title + ":" + content + ":" + redirect_url);
            if (!(title.equals("")) && !(content.equals(""))) {
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        showAlertDialog(title, content, redirect_url);
                    }
                });
            } else {
                loadHtml(redirect_url);
            }

        }

        /*
         * JS 接口，暴露给JS的方法使用@JavascriptInterface装饰
         */
        @JavascriptInterface
        public void storeTabIndex(final String pageName, final int tabIndex) {
            try {
                String filePath = FileUtil.dirPath(mAppContext, K.kConfigDirName, K.kTabIndexConfigFileName);

                JSONObject config = new JSONObject();
                if ((new File(filePath).exists())) {
                    String fileContent = FileUtil.readFile(filePath);
                    config = new JSONObject(fileContent);
                }
                config.put(pageName, tabIndex);

                FileUtil.writeFile(filePath, config.toString());
            } catch (JSONException | IOException e) {
                e.printStackTrace();
            }
        }

        @JavascriptInterface
        public int restoreTabIndex(final String pageName) {
            int tabIndex = 0;
            try {
                String filePath = FileUtil.dirPath(mAppContext, K.kConfigDirName, K.kTabIndexConfigFileName);

                JSONObject config = new JSONObject();
                if ((new File(filePath).exists())) {
                    String fileContent = FileUtil.readFile(filePath);
                    config = new JSONObject(fileContent);
                }
                tabIndex = config.getInt(pageName);
            } catch (JSONException e) {
                //e.printStackTrace();
            }

            return tabIndex < 0 ? 0 : tabIndex;
        }

        @JavascriptInterface
        public void toggleShowBanner(final String state) {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    bannerView.setVisibility(state.equals("show") ? View.VISIBLE : View.VISIBLE);
                    mBannerSetting.setVisibility(state.equals("show") ? View.VISIBLE : View.GONE);
                    mIvBannerBack.setVisibility(state.equals("show") ? View.VISIBLE : View.GONE);
                    mTvBannerBack.setVisibility(state.equals("show") ? View.VISIBLE : View.GONE);
                }
            });
        }

        @JavascriptInterface
        public void addSubjectMenuItems(final String menu_items) {
            try {
                listItem = new ArrayList<>();
                JSONArray itemArray = new JSONArray(menu_items);
                for (int i = 0; i < itemArray.length(); i++) {
                    HashMap<String, String> map = new HashMap<>();
                    map.put("itemContent", itemArray.getJSONObject(i).getString("link"));
                    map.put("itemText", itemArray.getJSONObject(i).getString("title"));
                    listItem.add(map);
                }
                if (listItem != null) {
                    menuListItem.addAll(listItem);
                    mBannerSetting.setImageResource(R.drawable.banner_setting);
                    mBannerSetting.setOnClickListener(new View.OnClickListener() {
                        @Override
                        public void onClick(View v) {
                            launchDropMenuActivity();
                        }
                    });
                }
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }

        @JavascriptInterface
        public void jsException(final String ex) {
            /*
             * 用户行为记录, 单独异常处理，不可影响用户体验
             */
            try {
                logParams = new JSONObject();
                logParams.put(URLs.kAction, "JS异常");
                logParams.put("obj_id", objectID);
                logParams.put(URLs.kObjType, objectType);
                logParams.put(URLs.kObjTitle, String.format("主题页面/%s/%s", bannerName, ex));
                new Thread(mRunnableForLogger).start();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        @JavascriptInterface
        public void searchItems(final String arrayString) {
            try {
                String searchItemsPath = String.format("%s.search_items", FileUtil.reportJavaScriptDataPath(SubjectActivity.this, String.format("%d", groupID), templateID, reportID));
                FileUtil.writeFile(searchItemsPath, arrayString);

                /**
                 *  判断筛选的条件: arrayString 数组不为空
                 *  报表第一次加载时，此处为判断筛选功能的关键点
                 */
                isSupportSearch = FileUtil.reportIsSupportSearch(SubjectActivity.this, String.format("%d", groupID), templateID, reportID);
                if (isSupportSearch) {
                    displayBannerTitleAndSearchIcon();
                }
                mBannerSetting.setImageResource(R.drawable.banner_setting);

                mBannerSetting.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        launchDropMenuActivity();
                    }
                });
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        @JavascriptInterface
        public String reportSelectedItem() {
            String item = null;
            String selectedItemPath = String.format("%s.selected_item", FileUtil.reportJavaScriptDataPath(SubjectActivity.this, String.format("%d", groupID), templateID, reportID));
            if (new File(selectedItemPath).exists()) {
                item = FileUtil.readFile(selectedItemPath);
            }
            return item;
        }

        @JavascriptInterface
        public void checkVersion(String info) {
            Log.i("testlog", "该中间件版本过低" + info);
        }

        @JavascriptInterface
        public void goBack(String info) {
            mWebView.goBack();
        }

        @JavascriptInterface
        public void showBarCodeScanner() {
            toast("打开扫码");
        }

//        @JavascriptInterface
//        public void uploadFile() {
//            showOptions();
//        }

        @JavascriptInterface
        public void showAlert(final String title, final String content) {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    builder = new AlertDialog.Builder(SubjectActivity.this);
                    builder.setTitle(title)
                            .setMessage(content)
                            .setPositiveButton("确定", new DialogInterface.OnClickListener() {
                                @Override
                                public void onClick(DialogInterface dialog, int which) {
                                    dialog.dismiss();
                                    if (offlineLink.startsWith("offline:////")) {
                                        finish();
                                    }
                                }
                            });
                    builder.show();
                }
            });
        }

        @JavascriptInterface
        public void refreshBrowser() {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    refresh();
                }
            });
        }
    }

    void showAlertDialog(String title, String content, final String redirect_url) {
        builder = new AlertDialog.Builder(SubjectActivity.this);
        builder.setTitle(title)
                .setMessage(content)
                .setPositiveButton("确定", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        dialog.dismiss();
                        loadHtml(redirect_url);
                    }
                });
        builder.show();
    }

    public String urlTempFile(String url) {
        String newHtmlPath = "";
        if (url.startsWith("offline://")) {
            String newLink = url.replace("offline://", "");
            String htmlPath = FileUtil.sharedPath(mContext) + "/offline_pages/" + newLink;
            String htmlContent = FileUtil.readFile(new File(htmlPath));
            if (htmlContent.equals("")) {
                toast("离线文件未存在");
                finish();
            } else {
                String newHtmlContent = htmlContent.replaceAll("TIMESTAMP", String.format("%d", new Date().getTime()));
                newHtmlPath = String.format("%s.tmp.html", htmlPath);
                try {
                    FileUtil.writeFile1(newHtmlPath, newHtmlContent.toString());
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
        return newHtmlPath;
    }

    public boolean hasSdcard() {
        String state = Environment.getExternalStorageState();
        return state.equals(Environment.MEDIA_MOUNTED);
    }

    /*
     * 启动拍照并获取图片
     */
    private void getCameraCapture() {
        Intent intentFromCapture = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);

        /*
         * 需要调用裁剪图片功能，无法读取内部存储，故使用 SD 卡先存储图片
         */
        if (hasSdcard()) {
            Uri imageUri;
            imageUri = Uri.fromFile(new File(Environment.getExternalStorageDirectory(), "upload.jpg"));
            intentFromCapture.putExtra(MediaStore.EXTRA_OUTPUT, imageUri);
        }

        startActivityForResult(intentFromCapture, CODE_CAMERA_RESULT);
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent intent) {
        super.onActivityResult(requestCode, resultCode, intent);
        UMShareAPI.get(this).onActivityResult(requestCode, resultCode, intent);
        Log.e("uploadImg", resultCode + "");
        if (resultCode != Activity.RESULT_OK) {
            toast("上传图片失败, 请尝试其他方式上传图片");
            if (mUploadMessage != null) {
                mUploadMessage.onReceiveValue(null);
            }

            if (mUploadMessage1 != null) {         // for android 5.0+
                mUploadMessage1.onReceiveValue(null);
            }
            return;
        }
        switch (requestCode) {
            case CODE_CAMERA_RESULT:
                try {
                    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.LOLLIPOP) {
                        if (mUploadMessage == null) {
                            return;
                        }

                        File cameraFile = new File(Environment.getExternalStorageDirectory(),"upload.jpg");

                        Uri uri = Uri.fromFile(cameraFile);
                        mUploadMessage.onReceiveValue(uri);

                    } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                        if (mUploadMessage1 == null) {        // for android 5.0+
                            return;
                        }

                        File cameraFile = new File(Environment.getExternalStorageDirectory(),"upload.jpg");

                        Uri uri = Uri.fromFile(cameraFile);
                        mUploadMessage1.onReceiveValue(new Uri[]{uri});
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
                break;
            case CODE_RESULT_REQUEST: {
                try {
                    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.LOLLIPOP) {
                        if (mUploadMessage == null) {
                            return;
                        }

                        String sourcePath = ImageUtil.retrievePath(this, mSourceIntent, intent);

                        if (TextUtils.isEmpty(sourcePath) || !new File(sourcePath).exists()) {
                            Log.e("uploadImg", "sourcePath empty or not exists.");
                            break;
                        }

                        Uri uri = Uri.fromFile(new File(sourcePath));
                        mUploadMessage.onReceiveValue(uri);

                    } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                        if (mUploadMessage1 == null) {        // for android 5.0+
                            return;
                        }

                        String sourcePath = ImageUtil.retrievePath(this, mSourceIntent, intent);

                        if (TextUtils.isEmpty(sourcePath) || !new File(sourcePath).exists()) {
                            Log.e("uploadImg", "sourcePath empty or not exists.");
                            break;
                        }

                        Uri uri = Uri.fromFile(new File(sourcePath));
                        mUploadMessage1.onReceiveValue(new Uri[]{uri});
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
                break;
            }
        }
//        super.onActivityResult(requestCode, resultCode, intent);
//        Log.e("uploadImg", resultCode + "");
//        if (resultCode != Activity.RESULT_OK) {
//            toast("上传图片失败, 请尝试其他方式上传图片");
//            return;
//        }
//        switch (requestCode) {
//            case CODE_CAMERA_RESULT:
//                imgSourcePath = Environment.getExternalStorageDirectory() + "upload.jpg";
//                if (TextUtils.isEmpty(imgSourcePath) || !new File(imgSourcePath).exists()) {
//                    Log.e("uploadImg", "sourcePath empty or not exists.");
//                    break;
//                }
//                myUpload();
//                break;
//            case CODE_RESULT_REQUEST: {
//                imgSourcePath = ImageUtil.retrievePath(this, mSourceIntent, intent);
//                if (TextUtils.isEmpty(imgSourcePath) || !new File(imgSourcePath).exists()) {
//                    Log.e("uploadImg", "sourcePath empty or not exists.");
//                    break;
//                }
//                myUpload();
//                break;
//            }
//        }
    }


    public void showOptions() {
        AlertDialog.Builder alertDialog = new AlertDialog.Builder(this);
        alertDialog.setOnCancelListener(new DialogOnCancelListener());

        alertDialog.setTitle("请选择操作");
        // gallery, camera.
        String[] options = {"相册", "拍照"};
        alertDialog.setItems(options, new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        if (which == 0) {
                            try {
                                mSourceIntent = ImageUtil.choosePicture();
                                startActivityForResult(mSourceIntent, CODE_RESULT_REQUEST);
                            } catch (Exception e) {
                                e.printStackTrace();
                                Toast.makeText(SubjectActivity.this,
                                        "请去\"设置\"中开启本应用的图片媒体访问权限",
                                        Toast.LENGTH_SHORT).show();
                                restoreUploadMsg();
                            }

                        } else {
                            try {
                                getCameraCapture();

                            } catch (Exception e) {
                                e.printStackTrace();
                                Toast.makeText(SubjectActivity.this,
                                        "相机调用失败, 请尝试从相册上传图片。",
                                        Toast.LENGTH_SHORT).show();

                                restoreUploadMsg();
                            }
                        }
                    }
                }
        );

        alertDialog.show();
    }

    private class DialogOnCancelListener implements DialogInterface.OnCancelListener {
        @Override
        public void onCancel(DialogInterface dialogInterface) {
            restoreUploadMsg();
        }
    }

    private void restoreUploadMsg() {
        if (mUploadMessage != null) {
            mUploadMessage.onReceiveValue(null);
            mUploadMessage = null;

        } else if (mUploadMessage1 != null) {
            mUploadMessage1.onReceiveValue(null);
            mUploadMessage1 = null;
        }
    }

    private void myUpload() {
        RequestParams params = new RequestParams(kUploadImgAPIPath);
        params.setMultipart(true);
        params.addBodyParameter("file", new File(imgSourcePath)); //设置上传的文件路径
        x.http().post(params, new Callback.CommonCallback<String>() {
            @Override
            public void onSuccess(final String result) {
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        try {
                            JSONObject jsonObject = new JSONObject(result);
                            Log.i("testlog", jsonObject.get("body").toString());
                            mWebView.loadUrl("javascript:finishChoice(" + jsonObject.get("body").toString() + ")");
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }
                });

            }

            @Override
            public void onError(Throwable ex, boolean isOnCallback) {
                Log.i("testlog", "onError" + ex.toString());
            }

            @Override
            public void onCancelled(CancelledException cex) {
                Log.i("testlog", "onCancelled");
            }

            @Override
            public void onFinished() {
                Log.i("testlog", "finish");
            }
        });
    }
}
