package com.intfocus.hdmcre;

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
import android.os.Handler;
import android.os.Message;
import android.provider.MediaStore;
import android.text.TextUtils;
import android.util.Log;
import android.view.View;
import android.view.WindowManager;
import android.webkit.CookieManager;
import android.webkit.CookieSyncManager;
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
import android.widget.SimpleAdapter;
import android.widget.TextView;
import android.widget.Toast;

import com.intfocus.hdmcre.util.ApiHelper;
import com.intfocus.hdmcre.util.FileUtil;
import com.intfocus.hdmcre.util.ImageUtil;
import com.intfocus.hdmcre.util.K;
import com.intfocus.hdmcre.util.LogUtil;
import com.intfocus.hdmcre.util.URLs;
import com.joanzapata.pdfview.PDFView;
import com.joanzapata.pdfview.listener.OnErrorOccurredListener;
import com.joanzapata.pdfview.listener.OnLoadCompleteListener;
import com.joanzapata.pdfview.listener.OnPageChangeListener;
import com.umeng.socialize.ShareAction;
import com.umeng.socialize.UMShareListener;
import com.umeng.socialize.bean.SHARE_MEDIA;
import com.umeng.socialize.media.UMImage;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static android.webkit.WebView.enableSlowWholeDocumentDraw;
import static java.lang.String.format;

public class SubjectActivity extends BaseActivity implements OnPageChangeListener, OnLoadCompleteListener, OnErrorOccurredListener {
	private Boolean isInnerLink = false, isSupportSearch;
	private String templateID, reportID;
	private PDFView mPDFView;
	private File pdfFile;
	private String bannerName, link;
	private int groupID, objectID, objectType;
	private String userNum;
	private RelativeLayout bannerView;
	private ArrayList<HashMap<String, Object>> listItem;
	private Context mContext;
	private Map<String, String> staticUrlMap;
	private TextView mTitle;
	private Intent mSourceIntent;
	AlertDialog.Builder builder;
	String offlineLink = "";

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
		initActiongBar();
		checkInterfaceOrientation(this.getResources().getConfiguration());

		List<ImageView> colorViews = new ArrayList<>();
		colorViews.add((ImageView) findViewById(R.id.colorView0));
		colorViews.add((ImageView) findViewById(R.id.colorView1));
		colorViews.add((ImageView) findViewById(R.id.colorView2));
		colorViews.add((ImageView) findViewById(R.id.colorView3));
		colorViews.add((ImageView) findViewById(R.id.colorView4));
		initColorView(colorViews);
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
				LogUtil.d("onPageStarted", String.format("%s - %s", URLs.timestamp(), url));
				setUrlStack(url);
			}

			@Override
			public void onPageFinished(WebView view, String url) {
				super.onPageFinished(view, url);
				animLoading.setVisibility(View.GONE);
				LogUtil.d("onPageFinished", String.format("%s - %s", URLs.timestamp(), url));
			}

			public void onReceivedError(WebView view, int errorCode, String description, String failingUrl) {
				LogUtil.d("onReceivedError",
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
			Log.i("FileType1",fileChooserParams.toString());
			mUploadMessage1 = filePathCallback;
			showOptions();
			return true;
		}

		//Android 4.0 以下
		public void openFileChooser(ValueCallback<Uri> uploadMsg,String acceptType) {
			mUploadMessage = uploadMsg;
			showOptions();
		}
		// Android 4.0 - 4.4.4
		public void openFileChooser(ValueCallback<Uri> uploadMsg,String acceptType, String capture) {
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
			if (!flag) {
				urlStack.push(url);
			}
		}
		Log.i("urlStack1", urlStack.toString());
//		setBannerName((String) urlStack.peek());
	}

	public void setBannerName(String url) {
		if (url.contains("offline_pages") && url.contains("file")) {
			StringBuilder sb = new StringBuilder(url);
			final String newUrl = url.substring(sb.lastIndexOf("/") + 1, url.length());
			initStaticUrl();
			Log.i("newUrl",newUrl);
			runOnUiThread(new Runnable() {
				@Override
				public void run() {
					if (staticUrlMap.containsKey(newUrl.replace(".tmp",""))) {
						mTitle.setText(staticUrlMap.get(newUrl.replace(".tmp","")));
					} else {
						mTitle.setText(newUrl);
					}
				}
			});
		}
	}

	private void initActiongBar() {
		bannerView = (RelativeLayout) findViewById(R.id.actionBar);
		ImageView mBannerSetting = (ImageView) findViewById(R.id.bannerSetting);
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

		if (link.toLowerCase().endsWith(".pdf")) {
			mPDFView = (PDFView) findViewById(R.id.pdfview);
			mPDFView.setVisibility(View.INVISIBLE);
		}
		mBannerSetting.setVisibility(View.VISIBLE);
		if (link.startsWith("offline:////")){
			finish();
		}

		if (link.startsWith("offline://")) {
		} else {
			isInnerLink = !(link.startsWith("http://") || link.startsWith("https://"));
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
		listItem = new ArrayList<>();
		String[] itemName = {"分享", "评论", "刷新"};
		int[] itemImage = {R.drawable.banner_share,
				R.drawable.banner_comment,
				R.drawable.btn_refresh};
//					mTts.isSpeaking() ? R.drawable.btn_stop : R.drawable.btn_play};
		for (int i = 0; i < itemName.length; i++) {
			HashMap<String, Object> map = new HashMap<>();
			map.put("ItemImage", itemImage[i]);
			map.put("ItemText", itemName[i]);
			listItem.add(map);
		}

		if (FileUtil.reportIsSupportSearch(mAppContext, String.format("%d", groupID), templateID, reportID)) {
			HashMap<String, Object> map = new HashMap<>();
			map.put("ItemImage", R.drawable.banner_search);
			map.put("ItemText", "筛选");
			listItem.add(map);
		}

		SimpleAdapter mSimpleAdapter = new SimpleAdapter(this, listItem, R.layout.menu_list_items, new String[]{"ItemImage", "ItemText"}, new int[]{R.id.img_menu_item, R.id.text_menu_item});
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
				case "筛选":
					actionLaunchReportSelectorActivity(arg1);
					break;

				case "分享":
					actionShare2Weixin(arg1);
					break;

				case "评论":
					actionLaunchCommentActivity(arg1);
					break;

				case "刷新":
					refresh(arg1);
					break;

				default:
					break;
			}
		}
	};

	public void onResume() {
		mMyApp.setCurrentActivity(this);
		isWeiXinShared = false;
		/*
		 * 判断是否允许浏览器复制
		 */
		isAllowBrowerCopy();
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

	/**
	 * PDFView OnPageChangeListener CallBack
	 *
	 * @param page      the new page displayed, starting from 1
	 * @param pageCount the total page count, starting from 1
	 */
	public void onPageChanged(int page, int pageCount) {
		Log.i("onPageChanged", format("%s %d / %d", bannerName, page, pageCount));
	}

	public void loadComplete(int nbPages) {
		Log.d("loadComplete", "load pdf done");
	}

	public void errorOccured(String errorType, String errorMessage) {
		String htmlPath = String.format("%s/loading/%s.html", sharedPath, "500"),
				outputPath = String.format("%s/loading/%s.html", sharedPath, "500.output");

		if (!(new File(htmlPath)).exists()) {
			toast(String.format("链接打开失败: %s", link));
			return;
		}

		mWebView.setVisibility(View.VISIBLE);
		mPDFView.setVisibility(View.INVISIBLE);

		String htmlContent = FileUtil.readFile(htmlPath);
		htmlContent = htmlContent.replace("$exception_type$", errorType);
		htmlContent = htmlContent.replace("$exception_message$", errorMessage);
		htmlContent = htmlContent.replace("$visit_url$", link);

		try {
			FileUtil.writeFile(outputPath, htmlContent);
		} catch (IOException e) {
			e.printStackTrace();
		}

		Message message = mHandlerWithAPI.obtainMessage();
		message.what = 200;
		message.obj = outputPath;

		mHandlerWithAPI.sendMessage(message);
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
			// format: /mobile/v1/group/:group_id/template/:template_id/report/:report_id
			// deprecated
			// format: /mobile/report/:report_id/group/:group_id
			templateID = TextUtils.split(link, "/")[6];
			reportID = TextUtils.split(link, "/")[8];
			String urlPath = format(link.replace("%@", "%d"), groupID);
			urlString = String.format("%s%s", K.kBaseUrl, urlPath);
			webSettings.setCacheMode(WebSettings.LOAD_NO_CACHE);

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
					if (urlString.toLowerCase().endsWith(".pdf")) {
						new Thread(mRunnableForPDF).start();
					} else {
						String loadUrl = urlTempFile(urlString);
						if (!loadUrl.equals("")) {
							mWebView.loadUrl("file:///" + loadUrl);
						} else {
							/*
							 * 外部链接传参: user_num, timestamp
							 */
							try {
								if (user.has("csrftoken") && user.has("sessionid")) {
									synCookie(urlString, "csrftoken=" + user.getString("csrftoken") + "; sessionid=" + user.getString("sessionid"));
								}
							} catch (JSONException e) {
								e.printStackTrace();
							}
							mWebView.loadUrl(urlString);
						}
						Log.i("OutLink", urlString);
					}
				}
			});
		}
	}

	public void initStaticUrl() {
		staticUrlMap = new HashMap<>();
		staticUrlMap.put("complaint.execute.html", "投诉详情");
		staticUrlMap.put("device.execute.html", "设备巡检计划工单");
		staticUrlMap.put("device.new.html", "新建巡检工单");
		staticUrlMap.put("device.view.html", "设备巡检报告");
		staticUrlMap.put("devices.html", "设备巡检列表");
		staticUrlMap.put("list.html", "待办列表");
		staticUrlMap.put("maintain.execute.html", "工程报修");
		staticUrlMap.put("meter.new.html", "新建仪表读数");
		staticUrlMap.put("meter.view.html", "仪表读数明细");
		staticUrlMap.put("meters.html", "仪表读数列表");
		staticUrlMap.put("oper.execute.html", "运营巡检");
		staticUrlMap.put("oper.new.html", "新建运营巡检");
		staticUrlMap.put("oper.signin.html", "运营巡检签收");
		staticUrlMap.put("oper.view.html", "运营巡检详情");
		staticUrlMap.put("opers.html", "运营巡检记录");
		staticUrlMap.put("repair.execute.html", "设备维修");
		staticUrlMap.put("repair.signin.html", "设备维修新建");
		staticUrlMap.put("repair.new.html", "设备维修新建");
		staticUrlMap.put("repair.view.html", "设备维修明细");
		staticUrlMap.put("repairs.html", "设备维修列表");
		staticUrlMap.put("repair.new.without-back.html", "设备维修新建");
		staticUrlMap.put("repair.new-from-device.execute.html", "新建设备维修");
		staticUrlMap.put("sales.input.execute.html", "销售录入审批");
		staticUrlMap.put("notice.view.html", "公告明细");
		staticUrlMap.put("notices.html", "公告");
		staticUrlMap.put("repair.new.html", "设备维修新建");
		staticUrlMap.put("repair.new.without-back.html", "设备维修新建");
		staticUrlMap.put("repair.new-from-device.execute.html", "新建设备维修");
	}

	public boolean synCookie(String url, String cookie) {
		if (Build.VERSION.SDK_INT < Build.VERSION_CODES.LOLLIPOP) {
			CookieSyncManager.createInstance(SubjectActivity.this);
		}
		CookieManager cookieManager = CookieManager.getInstance();
		cookieManager.setCookie(url, cookie);
		String newCookie = cookieManager.getCookie(url);
		return TextUtils.isEmpty(newCookie) ? false : true;
	}

	private final Handler mHandlerForPDF = new Handler() {
		public void handleMessage(Message message) {

			//Log.i("PDF", pdfFile.getAbsolutePath());
			if (pdfFile.exists()) {
				mPDFView.fromFile(pdfFile)
						.defaultPage(1)
						.showMinimap(true)
						.enableSwipe(true)
						.swipeVertical(true)
						.onLoad(SubjectActivity.this)
						.onPageChange(SubjectActivity.this)
						.load();
				mWebView.setVisibility(View.INVISIBLE);
				mPDFView.setVisibility(View.VISIBLE);
			} else {
				toast("加载PDF失败");
			}
		}
	};

	private final Runnable mRunnableForPDF = new Runnable() {
		@Override
		public void run() {
			String outputPath = String.format("%s/%s/%s.pdf", FileUtil.basePath(mAppContext), K.kCachedDirName, URLs.MD5(urlString));
			pdfFile = new File(outputPath);
			ApiHelper.downloadFile(mAppContext, urlString, pdfFile);

			Message message = mHandlerForPDF.obtainMessage();
			mHandlerForPDF.sendMessage(message);
		}
	};

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
			try {
				logParams = new JSONObject();
				logParams.put("action", "扫码/截图");
				logParams.put("obj_title", "功能: \"扫码/截图\",报错:" + t.getMessage());
				new Thread(mRunnableForLogger).start();
			} catch (Exception e) {
				e.printStackTrace();
			}
			if (t != null) {
				Log.d("throw", "throw:" + t.getMessage());
			}
		}

		@Override
		public void onCancel(SHARE_MEDIA platform) {
			// 取消分享
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

        /*
         * 用户行为记录, 单独异常处理，不可影响用户体验
         */
		try {
			logParams = new JSONObject();
			logParams.put(URLs.kAction, "点击/主题页面/评论");
			new Thread(mRunnableForLogger).start();
		} catch (Exception e) {
			e.printStackTrace();
		}
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
			mWebView.loadUrl((String) urlStack.peek());
		} else {
			finish();
		}
	}

	public void refresh(View v) {
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
			}else {
				urlString = link;
				runOnUiThread(new Runnable() {
					@Override
					public void run() {
						if (urlString.toLowerCase().endsWith(".pdf")) {
							new Thread(mRunnableForPDF).start();
						}
					}
				});
			}

			return null;
		}

		@Override
		protected void onPostExecute(Void aVoid) {
			super.onPostExecute(aVoid);
			String url = (String) urlStack.peek();
			if (url.contains("offline_pages") && url.contains("file")) {
				mWebView.getSettings().setDomStorageEnabled(true);
				mWebView.loadUrl(url);
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
			Log.i("pageUrlString",link + "1");
			runOnUiThread(new Runnable() {
				@Override
				public void run() {
					if (link.startsWith("offline:////")){
						finish();
					}else if (link.startsWith("offline://")){
						String loadUrl = urlTempFile(link);
						Log.i("pageUrlString",link + "2");
						if (!loadUrl.equals("")) {
							mWebView.loadUrl("file://" + loadUrl);
						}
					}else if (link.startsWith("offline:///")){
						mWebView.loadUrl((String) urlStack.get(0));
					}
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
		public void setBannerTitle(final String bannerTitle){
			runOnUiThread(new Runnable() {
				@Override
				public void run() {
					if (!bannerTitle.equals("")){
						mTitle.setText(bannerTitle);
					}else {
						mTitle.setText("");
					}
				}
			});
		}

		@JavascriptInterface
		public void showAlertAndRedirect(final String title, final String content, final String redirect_url, String cleanStack){
			Log.d("pages1", title+":"+content+":"+redirect_url);
			if (cleanStack == "yes"){
				urlStack.clear();
			}
			if (!(title.equals("")) && !(content.equals(""))){
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
										if (redirect_url.startsWith("offline:////")){
											finish();
										}else if (redirect_url.startsWith("offline:///")){
											mWebView.loadUrl((String) urlStack.get(0));
										}else if (redirect_url.startsWith("offline://")) {
											String loadUrl = urlTempFile(link);
											Log.i("pageUrlString", link + "2");
											if (!loadUrl.equals("")) {
												mWebView.loadUrl("file://" + loadUrl);
											}
										}
									}
								});
						builder.show();
					}
				});

			}else {
				if (redirect_url.startsWith("offline:////")){
					finish();
				}else if (redirect_url.startsWith("offline:///")){
					mWebView.loadUrl((String) urlStack.get(0));
				}else if (redirect_url.startsWith("offline://")) {
					String loadUrl = urlTempFile(link);
					Log.i("pageUrlString", link + "2");
					if (!loadUrl.equals("")) {
						mWebView.loadUrl("file://" + loadUrl);
					}
				}
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
					bannerView.setVisibility(state.equals("show") ? View.VISIBLE : View.GONE);
				}
			});
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

				//点击两次还是有异常 异常报出
//				if (loadCount < 2) {
//					showWebViewExceptionForWithoutNetwork();
//					loadCount++;
//				}
			} catch (Exception e) {
				e.printStackTrace();
			}
		}

		@JavascriptInterface
		public void reportSearchItems(final String arrayString) {
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
									if (offlineLink.startsWith("offline:////")){
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
					animLoading.setVisibility(View.VISIBLE);
					loadHtml();
				}
			});
		}
	}

	public String urlTempFile(String url) {
		String newHtmlPath = "";
		if (url.startsWith("offline://")) {
			String newLink = url.replace("offline://", "");
			String htmlPath = FileUtil.sharedPath(mContext) + "/offline_pages/" + newLink;
			String htmlContent = FileUtil.readFile(new File(htmlPath));
			if (htmlContent.equals("")){
				toast("离线文件未存在");
			}else {
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

//	public void getCameraCapture() {
//		Intent intentFromGallery = new Intent(Intent.ACTION_GET_CONTENT);
//		intentFromGallery.setType("image/*");
//		startActivityForResult(Intent.createChooser(intentFromGallery, null),CODE_RESULT_REQUEST);
//	}

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

//	@Override
//	protected void onDestroy() {
//		super.onDestroy();
//		if(builder!=null){
//			builder.
//		}
//	}
}
