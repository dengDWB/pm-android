package com.intfocus.hdmcre;

import android.Manifest;
import android.app.ProgressDialog;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.pm.PackageManager.NameNotFoundException;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.net.Uri;
import android.os.AsyncTask;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.provider.MediaStore;
import android.support.v4.content.ContextCompat;
import android.support.v4.content.FileProvider;
import android.text.TextUtils;
import android.util.Log;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.CompoundButton;
import android.widget.PopupWindow;
import android.widget.Switch;
import android.widget.TextView;
import android.widget.Toast;

import com.intfocus.hdmcre.screen_lock.InitPassCodeActivity;
import com.intfocus.hdmcre.util.ApiHelper;
import com.intfocus.hdmcre.util.FileUtil;
import com.intfocus.hdmcre.util.HttpUtil;
import com.intfocus.hdmcre.util.K;
import com.intfocus.hdmcre.util.PrivateURLs;
import com.intfocus.hdmcre.util.URLs;
import com.intfocus.hdmcre.view.CircleImageView;
import com.intfocus.hdmcre.view.RedPointView;
import com.pgyersdk.update.PgyUpdateManager;
import com.readystatesoftware.viewbadger.BadgeView;
import com.umeng.message.PushAgent;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

public class SettingActivity extends BaseActivity {
    public final static String kGravatar = "gravatar";
    public final static String kGravatarId = "gravatar_id";
    private TextView mUserID;
    private TextView mRoleID;
    private TextView mGroupID;
    private TextView mAppName;
    private TextView mAppVersion;
    private TextView mDeviceID;
    private TextView mAppIdentifier;
    private TextView mPushState;
    private TextView mApiDomain;
    private Switch mLockSwitch;
    private Switch mLongCatSwitch;
    private Switch mDashboardSwitch;
    private String screenLockInfo;
    private TextView mPygerLink;
    private TextView mChangePWD;
    private TextView mCheckUpgrade;
    private TextView mWarnPWD;
    private BadgeView bvCheckUpgrade;
    private BadgeView bvChangePWD;
    private BadgeView bvCheckThursdaySay;
    private CircleImageView mIconImageView;
    private PopupWindow popupWindow;
    private String gravatarJsonPath, gravatarImgPath, gravatarFileName, gravatarUrl, gravatarImgName;
    private TextView mCheckThursdaySay;
    private Context mContext;
    private PushAgent mPushAgent;

    /* 请求识别码 */
    private static final int CODE_GALLERY_REQUEST = 0xa0;
    private static final int CODE_CAMERA_REQUEST = 0xa1;
    private static final int CODE_RESULT_REQUEST = 0xa2;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_setting);

        mContext = this;

        mPushAgent = PushAgent.getInstance(mContext);

        mUserID = (TextView) findViewById(R.id.user_id);
        mRoleID = (TextView) findViewById(R.id.role_id);
        mGroupID = (TextView) findViewById(R.id.group_id);
        mChangePWD = (TextView) findViewById(R.id.change_pwd);
        mWarnPWD = (TextView) findViewById(R.id.warn_pwd);
        mCheckUpgrade = (TextView) findViewById(R.id.check_upgrade);
        mPygerLink = (TextView) findViewById(R.id.pgyer_link);
        mAppName = (TextView) findViewById(R.id.app_name);
        mAppVersion = (TextView) findViewById(R.id.app_version);
        mDeviceID = (TextView) findViewById(R.id.device_id);
        mApiDomain = (TextView) findViewById(R.id.api_domain);
        mAppIdentifier = (TextView) findViewById(R.id.app_identifier);
        mPushState = (TextView) findViewById(R.id.push_state);
        TextView mChangeLock = (TextView) findViewById(R.id.change_lock);
        TextView mCheckAssets = (TextView) findViewById(R.id.check_assets);
        Button mLogout = (Button) findViewById(R.id.logout);
        mLockSwitch = (Switch) findViewById(R.id.lock_switch);
        mDashboardSwitch = (Switch) findViewById(R.id.dashboard_switch);
        mIconImageView =(CircleImageView) findViewById(R.id.img_icon);
        mCheckThursdaySay = (TextView) findViewById(R.id.check_thursday_say);

        screenLockInfo = "取消锁屏成功";
        mLockSwitch.setChecked(FileUtil.checkIsLocked(mAppContext));
        mCheckAssets.setOnClickListener(mCheckAssetsListener);

        try {
            String betaConfigPath = FileUtil.dirPath(mAppContext, K.kConfigDirName, K.kBetaConfigFileName);
            JSONObject betaJSON = FileUtil.readConfigFile(betaConfigPath);
            if (!betaJSON.has("image_within_screen")) {
                betaJSON.put("image_within_screen",true);
                FileUtil.writeFile(betaConfigPath,betaJSON.toString());
            }
            mLongCatSwitch = (Switch) findViewById(R.id.longcat_switch);
            mLongCatSwitch.setChecked(betaJSON.has("image_within_screen") && betaJSON.getBoolean("image_within_screen"));
            mDashboardSwitch.setChecked(betaJSON.has("allow_brower_copy") && betaJSON.getBoolean("allow_brower_copy"));
        } catch (JSONException | IOException e) {
            e.printStackTrace();
        }

        bvCheckUpgrade = new BadgeView(this, mCheckUpgrade);
        bvChangePWD = new BadgeView(this, mChangePWD);
        bvCheckThursdaySay = new BadgeView(this, mCheckThursdaySay);

        mChangeLock.setOnClickListener(mChangeLockListener);
        mChangePWD.setOnClickListener(mChangePWDListener);
        mLogout.setOnClickListener(mLogoutListener);
        mCheckUpgrade.setOnClickListener(mCheckUpgradeListener);
        mLockSwitch.setOnCheckedChangeListener(mSwitchLockListener);
        mLongCatSwitch.setOnCheckedChangeListener(mSwitchLongCatListener);
        mDashboardSwitch.setOnCheckedChangeListener(mDashboardListener);
        mPygerLink.setOnClickListener(mPgyerLinkListener);
        mIconImageView.setOnClickListener(mIconImageViewListener);

        initIconMenu();
        initializeUI();
        setSettingViewControlBadges();
    }

    @Override
    public void onResume() {
        super.onResume();
        mMyApp.setCurrentActivity(this);
        mLockSwitch.setChecked(FileUtil.checkIsLocked(mAppContext));
    }

    @Override
    protected void onDestroy() {
        PgyUpdateManager.unregister(); // 解除注册蒲公英版本更新检查
        popupWindow = null;
        if (mProgressDialog != null){
            mProgressDialog.dismiss();
        }
        super.onDestroy();
    }
    /*
     * 初始化界面内容
     */
    private void initializeUI() {
        try {
            String deviceToken  = mPushAgent.getRegistrationId();
            if (deviceToken.length() == 44) {
                mPushState.setText("开启");
            }
        }catch (NullPointerException e){
            mPushState.setText("关闭");
        }

        try {
            mUserID.setText(user.getString("user_name") + "(" + user.getString("loginType") + ")");
            mRoleID.setText(user.getString("role_name"));
            mGroupID.setText(user.getString("group_name"));
            mAppName.setText(getApplicationName(SettingActivity.this));
            String deviceInfo = String.format("%s(Android %s)",TextUtils.split(android.os.Build.MODEL, " - ")[0],Build.VERSION.RELEASE);
            mDeviceID.setText(deviceInfo);
            mApiDomain.setText(K.kBaseUrl.replace("http://", "").replace("https://", ""));

            gravatarJsonPath = FileUtil.dirPath(mAppContext, K.kConfigDirName, K.kGravatarConfigFileName);
            if (user.has(kGravatar) && user.getString(kGravatar).startsWith("http")) {
                gravatarUrl = user.getString(kGravatar);
                gravatarImgName = gravatarUrl.substring(gravatarUrl.lastIndexOf("/") + 1, gravatarUrl.length());
                gravatarImgPath = FileUtil.dirPath(mAppContext, K.kConfigDirName, gravatarImgName);
                if (new File(gravatarImgPath).exists()) {
                    Bitmap imgBmp = BitmapFactory.decodeFile(gravatarImgPath);
                    mIconImageView.setImageBitmap(imgBmp);
                } else {
                    new DownloadGravatar().execute();
                }
            }

            PackageInfo packageInfo = getPackageManager().getPackageInfo(getPackageName(), 0);
            String versionInfo = String.format("%s(%d)", packageInfo.versionName, packageInfo.versionCode);
            int currentVersionCode = packageInfo.versionCode;
            mAppVersion.setText(versionInfo);
            mAppIdentifier.setText(packageInfo.packageName);

            String pgyerVersionPath = String.format("%s/%s", FileUtil.basePath(mAppContext), K.kPgyerVersionConfigFileName),
                    betaLink = "", pgyerInfo = "";
            if((new File(pgyerVersionPath)).exists()) {
                JSONObject pgyerJSON = FileUtil.readConfigFile(pgyerVersionPath);
                JSONObject responseData = pgyerJSON.getJSONObject(URLs.kData);
                pgyerInfo = String.format("%s(%s)", responseData.getString("versionName"), responseData.getString("versionCode"));
                int newVersionCode = responseData.getInt("versionCode");
                if (newVersionCode > currentVersionCode) {
                    betaLink = pgyerInfo;
                }
            }
            mPygerLink.setText(betaLink.isEmpty() ? "已是最新版本" : String.format("有发布版本%s", pgyerInfo));
//            mPygerLink.setTextColor(Color.parseColor(betaLink.isEmpty() ? "#808080" : "#0000ff"));
        } catch (NameNotFoundException | JSONException e) {
            e.printStackTrace();
        }
    }

    private static String getApplicationName(Context context) {
        int stringId = context.getApplicationInfo().labelRes;
        Log.i("getactivity",context.getString(stringId));
        return context.getString(stringId);
    }

    final View.OnClickListener mCheckUpgradeListener = new View.OnClickListener() {
        @Override
        public void onClick(View v) {
            checkPgyerVersionUpgrade(SettingActivity.this,true);
            bvCheckUpgrade.setVisibility(View.GONE);

            /*
             * 用户行为记录, 单独异常处理，不可影响用户体验
             */
            try {
                logParams = new JSONObject();
                logParams.put(URLs.kAction, "点击/设置页面/检测更新");
                new Thread(mRunnableForLogger).start();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    };

    private final View.OnClickListener mIconImageViewListener = new View.OnClickListener() {
        @Override
        public void onClick(View v) {
            int cameraPermission = ContextCompat.checkSelfPermission(mAppContext,Manifest.permission.CAMERA);
            if(cameraPermission != PackageManager.PERMISSION_GRANTED) {
                setAlertDialog(SettingActivity.this, "相机权限获取失败，是否到本应用的设置界面设置权限");
            }else{
                popupWindow.showAtLocation(mIconImageView, Gravity.BOTTOM|Gravity.CENTER_HORIZONTAL, 0, 0);
            }
        }
    };

    public void initIconMenu() {
        final View iconMenuView = LayoutInflater.from(this).inflate(R.layout.activity_icon_dialog, null);

        Button btnTakePhoto =(Button) iconMenuView.findViewById(R.id.btn_icon_takephoto);
        Button btnGetPhoto  =(Button) iconMenuView.findViewById(R.id.btn_icon_getphoto);
        Button btnCancel =(Button) iconMenuView.findViewById(R.id.btn_icon_cancel);

        popupWindow = new PopupWindow(this);
        popupWindow.setWidth(ViewGroup.LayoutParams.MATCH_PARENT);
        popupWindow.setHeight(ViewGroup.LayoutParams.WRAP_CONTENT);
        popupWindow.setContentView(iconMenuView);
        popupWindow.setBackgroundDrawable(new ColorDrawable(0x00000000));
        popupWindow.setOutsideTouchable(false);
        popupWindow.setFocusable(true);

        btnTakePhoto.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                getCameraCapture();
            }
        });

        btnGetPhoto.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                getGallery();
            }
        });

        btnCancel.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                popupWindow.dismiss();
            }
        });
    }

    /*
     * 获取相册图片
     */
    private void getGallery() {
        Intent intentFromGallery = new Intent(Intent.ACTION_PICK,null);
        intentFromGallery.setDataAndType(MediaStore.Images.Media.EXTERNAL_CONTENT_URI,"image/*");
        startActivityForResult(intentFromGallery,CODE_GALLERY_REQUEST);
    }

    /*
     * 启动拍照并获取图片
     */
    private void getCameraCapture() {
        Intent intentFromCapture = new Intent(android.provider.MediaStore.ACTION_IMAGE_CAPTURE);

        /*
         * 需要调用裁剪图片功能，无法读取内部存储，故使用 SD 卡先存储图片
         */
        if (hasSdcard()) {
            Uri imageUri;
            if (android.os.Build.VERSION.SDK_INT >= Build.VERSION_CODES.N){
                imageUri = FileProvider.getUriForFile(SettingActivity.this, "com.intfocus.hdmcre.fileprovider", new File(Environment.getExternalStorageDirectory(),"icon.jpg"));
                intentFromCapture.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
                intentFromCapture.addFlags(Intent.FLAG_GRANT_WRITE_URI_PERMISSION);
            }else {
                imageUri = Uri.fromFile(new File(Environment.getExternalStorageDirectory(),"icon.jpg"));
            }
            intentFromCapture.putExtra(MediaStore.EXTRA_OUTPUT, imageUri);
        }
        else {
            try {
                logParams = new JSONObject();
                logParams.put("action", "头像/拍照");
                logParams.put("obj_title", "功能: \"头像上传，拍照\",报错: \"not find SdCard\"");
                new Thread(mRunnableForLogger).start();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        startActivityForResult(intentFromCapture,CODE_CAMERA_REQUEST);
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode,Intent intent) {
        // 用户没有选择图片，返回
        if (resultCode == RESULT_CANCELED) {
            Toast.makeText(getApplication(), "取消", Toast.LENGTH_LONG).show();
            return;
        }

        switch (requestCode) {
            case CODE_GALLERY_REQUEST:
                cropPhoto(intent.getData());
                break;
            case CODE_CAMERA_REQUEST:
                File tempFile = new File(Environment.getExternalStorageDirectory(),"icon.jpg");
                if (android.os.Build.VERSION.SDK_INT >= Build.VERSION_CODES.N){
                    Uri photoURI = FileProvider.getUriForFile(this,
                            "com.intfocus.hdmcre.fileprovider",
                            tempFile);
                    cropPhoto(photoURI);
                }else {
                    cropPhoto(Uri.fromFile(tempFile));
                }
                break;
            default:
                if (intent != null) {
                    setImageToHeadView(intent);
                }
                break;
        }
        super.onActivityResult(requestCode, resultCode, intent);
    }

    /*
     * 调用系统的裁剪
     */
    public void cropPhoto(Uri uri) {
        Intent intent = new Intent("com.android.camera.action.CROP");
        File tempFile = new File(Environment.getExternalStorageDirectory(),"icon.jpg");
        Uri outPutUri = Uri.fromFile(tempFile);
        if (android.os.Build.VERSION.SDK_INT == android.os.Build.VERSION_CODES.KITKAT) {
            String url=FileUtil.getBitmapUrlPath(this, uri);
            intent.setDataAndType(Uri.fromFile(new File(url)), "image/*");
        }else{
            intent.setDataAndType(uri, "image/*");
        }
        intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
        intent.putExtra("crop", "true");
        // aspectX aspectY 是宽高的比例
        intent.putExtra("aspectX", 1);
        intent.putExtra("aspectY", 1);
        // outputX outputY 是裁剪图片宽高
        intent.putExtra("outputX", 150);
        intent.putExtra("outputY", 150);
        intent.putExtra("return-data",true);
        intent.putExtra(MediaStore.EXTRA_OUTPUT, outPutUri);
        startActivityForResult(intent, CODE_RESULT_REQUEST);
    }

    /*
     * 提取保存裁剪之后的图片数据，并设置头像部分的View
     */
    private void setImageToHeadView(Intent intent) {
        try {
            Bitmap bitmap = BitmapFactory.decodeFile(Environment.getExternalStorageDirectory()+"/icon.jpg");
            if (bitmap != null) {
                mIconImageView.setImageBitmap(bitmap);
                new File(Environment.getExternalStorageDirectory()+"/icon.jpg").delete();
                gravatarImgPath = FileUtil.dirPath(mAppContext, K.kConfigDirName, K.kAppCode + "_" + user.getString(URLs.kUserNum) + "_" + getDate() + ".jpg");
                gravatarFileName = gravatarImgPath.substring(gravatarImgPath.lastIndexOf("/") + 1, gravatarImgPath.length());
                FileUtil.saveImage(gravatarImgPath, bitmap);
                new UploadGravatar().execute();
                popupWindow.dismiss();
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    /*
     * 头像下载
     */
    class DownloadGravatar extends AsyncTask<String,Void,Bitmap> {
        @Override
        protected Bitmap doInBackground(String... params) {
            if (gravatarUrl == null || gravatarUrl.equals("")) {
                return null;
            }
            Bitmap imgBmp = HttpUtil.httpGetBitmap(gravatarUrl);
            return imgBmp;
        }

        @Override
        protected void onPostExecute(Bitmap imgBmp) {
            if (imgBmp != null) {
                mIconImageView.setImageBitmap(imgBmp);
                FileUtil.saveImage(gravatarImgPath,imgBmp);
                updataGravatarJson(gravatarJsonPath,gravatarImgName,false,"","");
            }
            super.onPostExecute(imgBmp);
        }
    }

    /*
     * 头像上传
     */
    class UploadGravatar extends AsyncTask<String,Void,Map<String,String>> {
        @Override
        protected Map<String,String> doInBackground(String... params) {
            try {
                String urlString = String.format(K.kUploadGravatarAPIPath, PrivateURLs.kBaseUrl, user.getString("user_device_id"), user.getString("user_id"));
                Map<String,String> response = HttpUtil.httpPostFile(urlString,"image/jpg",kGravatar,gravatarImgPath);
                return response;
            } catch (JSONException e) {
                e.printStackTrace();
                return null;
            }
        }

        @Override
        protected void onPostExecute(Map<String,String> response){
            try {
                if (response.get("code").equals("201")) {
                    JSONObject jsonObject = new JSONObject(response.get("body"));
                    updataGravatarJson(gravatarJsonPath,gravatarImgName,true,jsonObject.getString("gravatar_id"),jsonObject.getString("gravatar_url"));
                }
            } catch (JSONException e) {
                e.printStackTrace();
            }
            super.onPostExecute(response);
        }
    }

    /*
     * 头像 JSON 文件更新
     */
    public void updataGravatarJson(String jsonPath,String imgName,boolean isUpload,String gravatarID,String uploadUrl) {
        File file = new File(jsonPath);
        try {
            JSONObject jsonObject;
            if (file.exists()) {
                jsonObject = FileUtil.readConfigFile(jsonPath);
                String oldGravatarImgName = jsonObject.getString("name");
                String oldGravatarImgPath = FileUtil.dirPath(mAppContext, K.kConfigDirName, oldGravatarImgName);
                new File(oldGravatarImgPath).delete();
            }

            jsonObject = new JSONObject();
            jsonObject.put("name",imgName);
            jsonObject.put("upload_state",true);
            if (isUpload) {
                jsonObject.put("gravatar_id",gravatarID);
                String userConfigPath = String.format("%s/%s", FileUtil.basePath(mAppContext), K.kUserConfigFileName);
                user.put("gravatar", uploadUrl);
                FileUtil.writeFile(userConfigPath, user.toString());
            }
            FileUtil.writeFile(jsonPath,jsonObject.toString());
        } catch (JSONException |IOException e) {
            e.printStackTrace();
        }

    }

    public String getDate(){
        SimpleDateFormat format = new SimpleDateFormat("yyyyMMddHHmmss");
        Date date = new Date(System.currentTimeMillis());
        return format.format(date);
    }

    /*
     * 检查设备是否存在SDCard的工具方法
     */
    public static boolean hasSdcard() {
        String state = Environment.getExternalStorageState();
        return state.equals(Environment.MEDIA_MOUNTED);
    }

    /*
     * 返回
     */
    public void dismissActivity(View v) {
        SettingActivity.this.onBackPressed();
    }

    @Override
    public void onBackPressed() {
        super.onBackPressed();
        Intent intent = new Intent(this, DashboardActivity.class);
        startActivity(intent);
        finish();
    }

    public void launchThursdaySayActivity(View v) {
        try {
            String noticePath = FileUtil.dirPath(mAppContext, K.kConfigDirName, K.kLocalNotificationConfigFileName);
            JSONObject notificationJson = new JSONObject(FileUtil.readFile(noticePath));
            notificationJson.put(URLs.kSettingThursdaySay, 0);
            FileUtil.writeFile(noticePath, notificationJson.toString());

            Intent blogLinkIntent = new Intent(SettingActivity.this,ThursdaySayActivity.class);
            blogLinkIntent.setFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);
            startActivity(blogLinkIntent);
        } catch (JSONException | IOException e) {
            e.printStackTrace();
        }
    }

    public void launchDeveloperActivity(View v) {
        Intent developerIntent = new Intent(SettingActivity.this, DeveloperActivity.class);
        developerIntent.setFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);
        startActivity(developerIntent);
    }

    /*
     * 退出登录
     */
    private final View.OnClickListener mLogoutListener = new View.OnClickListener() {
        @Override
        public void onClick(View v) {
            try {
                JSONObject configJSON = new JSONObject();
                configJSON.put("is_login", false);

                // 改变登录信息
                SharedPreferences mSharedPreferences = mContext.getSharedPreferences("loginState",MODE_PRIVATE);
                SharedPreferences.Editor mEditor = mSharedPreferences.edit();
                mEditor.putBoolean("isLogin",false);
                mEditor.commit();

                modifiedUserConfig(configJSON);
            } catch (JSONException e) {
                e.printStackTrace();
            }
            String userPermissionPath = FileUtil.sharedPath(SettingActivity.this) + "/offline_pages/static/js/user_permission.js";
            if (new File(userPermissionPath).exists()){
                new File(userPermissionPath).delete();
            }

            String adPath = FileUtil.sharedPath(SettingActivity.this) + "/advertisement/assets/javascripts/user_permission.js";
            if (new File(adPath).exists()){
                new File(adPath).delete();
            }

            String configPath = FileUtil.dirPath(SettingActivity.this, "config", "user_permission.js");
            if (new File(configPath).exists()){
                new File(configPath).delete();
            }

            Intent intent = new Intent();
            intent.setClass(SettingActivity.this, LaunchActivity.class);
            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
            startActivity(intent);

            new Thread(new Runnable() {
                @Override
                public void run() {
                    try {
                        Map<String, String> response = HttpUtil.httpPost(String.format(K.kLogOut, K.kBaseUrl, "android", user.getString("user_device_id")), new HashMap());
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                }
            }).start();

            /*
             * 用户行为记录, 单独异常处理，不可影响用户体验
             */
            try {
                logParams = new JSONObject();
                logParams.put(URLs.kAction, "退出登录");
                new Thread(mRunnableForLogger).start();
            } catch (Exception e) {
                e.printStackTrace();
            }

            finish();
        }
    };

    /*
    * 修改密码
    */
    private final View.OnClickListener mChangePWDListener = new View.OnClickListener() {
        @Override
        public void onClick(View v) {
            Intent intent = new Intent(mContext, ResetPasswordActivity.class);
            mContext.startActivity(intent);

            /*
             * 用户行为记录, 单独异常处理，不可影响用户体验
             */
            try {
                logParams = new JSONObject();
                logParams.put(URLs.kAction, "点击/设置页面/修改密码");
                new Thread(mRunnableForLogger).start();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    };

    /*
     * 修改锁屏密码
     */
    private final View.OnClickListener mChangeLockListener = new View.OnClickListener() {
        @Override
        public void onClick(View v) {
            Toast.makeText(SettingActivity.this, "TODO: 修改锁屏密码", Toast.LENGTH_SHORT).show();
        }
    };

    /*
     * 校正，客户使用遇到问题时的终极解决方案
     */
    private final View.OnClickListener mCheckAssetsListener = new View.OnClickListener() {
        @Override
        public void onClick(View v) {
            mProgressDialog = ProgressDialog.show(SettingActivity.this, "稍等", "加载中");
            new Thread(new Runnable() {
                @Override
                public void run() {
                    try {
                        String info = ApiHelper.authentication(SettingActivity.this, user.getString(URLs.kUserNum), user.getString(URLs.kPassword),user.getString("loginType"));
                        if (!info.isEmpty() && info.equals("success")) {
                            /*
                             * 用户报表数据 js 文件存放在公共区域
                             */
                            String headerPath = String.format("%s/%s", FileUtil.sharedPath(mAppContext), K.kCachedHeaderConfigFileName);
                            new File(headerPath).delete();
                            headerPath = String.format("%s/%s", FileUtil.dirPath(mAppContext, K.kHTMLDirName), K.kCachedHeaderConfigFileName);
                            new File(headerPath).delete();

//                            /*
//                             *用户权限表删除
//                             */
//                            String adUserPermissionPath = FileUtil.sharedPath(SettingActivity.this) + "/advertisement/assets/javascripts/user_permission.js";
//                            String offUserPermissionPath = FileUtil.sharedPath(SettingActivity.this) + "/offline_pages/static/js/user_permission.js";
//                            String userPermissionPath = FileUtil.dirPath(SettingActivity.this, "config","user_permission.js");
//
//                            if (new File(adUserPermissionPath).exists()){
//                                new File(adUserPermissionPath).delete();
//                            }
//
//                            if (new File(offUserPermissionPath).exists()){
//                                new File(offUserPermissionPath).delete();
//                            }
//
//                            if (new File(userPermissionPath).exists()){
//                                new File(userPermissionPath).delete();
//                            }

                            /*
                             * Umeng Device Token 重新上传服务器
                             */
                            String pushConfigPath = String.format("%s/%s", FileUtil.basePath(mAppContext), K.kPushConfigFileName);
                            JSONObject pushJSON = FileUtil.readConfigFile(pushConfigPath);
                            if(pushJSON.has(K.kPushDeviceToken) && pushJSON.getString(K.kPushDeviceToken).length() == 44) {
                                pushJSON.put(K.kPushIsValid, false);
                                FileUtil.writeFile(pushConfigPath, pushJSON.toString());
                            }

                            /*
                             * 获取头像下载链接,准备重新下载头像
                             */
//                            gravatarUrl = user.getString(kGravatar);
//                            gravatarImgName = gravatarUrl.substring(gravatarUrl.lastIndexOf("/") + 1, gravatarUrl.length());
//                            gravatarImgPath = FileUtil.dirPath(mAppContext, K.kConfigDirName, gravatarImgName);

                            /*
                             * 检测服务器静态资源是否更新，并下载
                             */
                            runOnUiThread(new Runnable() {
                                @Override public void run() {
//                                    new DownloadGravatar().execute(); //校正头像,必须在主线程运行

                                    checkAssetsUpdated(false);
                                    if (mProgressDialog != null){
                                        mProgressDialog.dismiss();
                                    }
                                    toast("校正完成");
                                }
                            });
                        }else {
                            toast(info);
                            runOnUiThread(new Runnable() {
                                @Override
                                public void run() {
                                    if (mProgressDialog != null){
                                        mProgressDialog.dismiss();
                                    }
                                    Intent intent = new Intent(SettingActivity.this, LoginActivity.class);
                                    startActivity(intent);
                                    finish();
                                }
                            });
                        }

                    } catch (JSONException | IOException e) {
                        if (mProgressDialog != null){
                            mProgressDialog.dismiss();
                        }
                        e.printStackTrace();
                    }
                }
            }).start();
        }
    };


    /*
     *  Switch 锁屏开关
     */
    private final CompoundButton.OnCheckedChangeListener mSwitchLockListener = new CompoundButton.OnCheckedChangeListener() {
        @Override
        public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
            Log.i("onCheckedChanged", isChecked ? "ON" : "OFF");
            if(isChecked) {
                startActivity(InitPassCodeActivity.createIntent(mContext));
            } else {
                try {
                    String userConfigPath = String.format("%s/%s", FileUtil.basePath(mAppContext), K.kUserConfigFileName);
                    if((new File(userConfigPath)).exists()) {
                        JSONObject userJSON = FileUtil.readConfigFile(userConfigPath);
                        userJSON.put(URLs.kUseGesturePassword, false);
                        userJSON.put(URLs.kGesturePassword, "");

                        FileUtil.writeFile(userConfigPath, userJSON.toString());
                        String settingsConfigPath = FileUtil.dirPath(mAppContext, K.kConfigDirName, K.kSettingConfigFileName);
                        FileUtil.writeFile(settingsConfigPath, userJSON.toString());
                    }

                    toast(screenLockInfo);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }

            /*
             * 用户行为记录, 单独异常处理，不可影响用户体验
             */
            try {
                logParams = new JSONObject();
                logParams.put(URLs.kAction, String.format("点击/设置页面/%s锁屏", isChecked ? "开启" : "禁用"));
                new Thread(mRunnableForLogger).start();
            }
            catch (Exception e) {
                e.printStackTrace();
            }
        }
    };




    /*
     * 切换截屏
     */
    private final CompoundButton.OnCheckedChangeListener mSwitchLongCatListener = new CompoundButton.OnCheckedChangeListener() {
        @Override
        public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
            try {
                String betaConfigPath = FileUtil.dirPath(mAppContext, K.kConfigDirName, K.kBetaConfigFileName);
                JSONObject betaJSON = FileUtil.readConfigFile(betaConfigPath);

                betaJSON.put("image_within_screen", isChecked);
                FileUtil.writeFile(betaConfigPath, betaJSON.toString());
            } catch (JSONException | IOException e) {
                e.printStackTrace();
            }
        }
    };

    private final CompoundButton.OnCheckedChangeListener mDashboardListener = new CompoundButton.OnCheckedChangeListener() {
        @Override
        public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
            try {
                String betaConfigPath = FileUtil.dirPath(mAppContext, K.kConfigDirName, K.kBetaConfigFileName);
                JSONObject betaJSON = FileUtil.readConfigFile(betaConfigPath);

                betaJSON.put("allow_brower_copy", isChecked);
                FileUtil.writeFile(betaConfigPath, betaJSON.toString());
            } catch (JSONException | IOException e) {
                e.printStackTrace();
            }
        }
    };


    /*
     * 检测版本更新
     * {"code":0,"message":"","data":{"lastBuild":"10","downloadURL":"","versionCode":"15","versionName":"0.1.5","appUrl":"http:\/\/www.pgyer.com\/yh-a","build":"10","releaseNote":"\u66f4\u65b0\u5230\u7248\u672c: 0.1.5(build10)"}}
     */
    final View.OnClickListener mPgyerLinkListener = new View.OnClickListener() {
        @Override
        public void onClick(View v) {
            Intent browserIntent = new Intent(android.content.Intent.ACTION_VIEW, Uri.parse(K.kPgyerUrl));
            startActivity(browserIntent);
        }
    };

    /**
     * 设置界面，需要显示通知样式的控件，检测是否需要通知
     */
    private void setSettingViewControlBadges() {
        String notificationPath = FileUtil.dirPath(mAppContext, K.kConfigDirName, K.kLocalNotificationConfigFileName);
        if(!(new File(notificationPath)).exists()) {
            return;
        }

        try {
            JSONObject notificationJSON = FileUtil.readConfigFile(notificationPath);
            // 每次进入设置页面都判断密码是否修改以及是否需要更新
            int passwordCount = user.getString(URLs.kPassword).equals(URLs.MD5(K.kInitPassword)) ? 1 : -1;
            notificationJSON.put(URLs.kSettingPassword, passwordCount);

            if (passwordCount > 0) {
                mWarnPWD.setTextColor(Color.parseColor("#808080"));
                mWarnPWD.setTextSize(16);
                mWarnPWD.setText("请修改初始密码");
                mChangePWD.setText("   修改登录密码");
                RedPointView.showRedPoint(mAppContext, URLs.kSettingPassword, bvChangePWD);
            }
            else {
                mWarnPWD.setVisibility(View.GONE);
                mChangePWD.setText("修改登录密码");
                bvChangePWD.setVisibility(View.GONE);
            }
                /*
                之前的代码
                */
//            if (notificationJSON.getInt(URLs.kSettingPgyer) > 0) {
//                mCheckUpgrade.setText("   检测更新");
//                RedPointView.showRedPoint(mAppContext, URLs.kSettingPgyer, bvCheckUpgrade);
//            }
            if (!mPygerLink.getText().equals("已是最新版本")) {
                mCheckUpgrade.setText("   检测更新");
                RedPointView.showRedPoint(mAppContext, URLs.kSettingPgyer, bvCheckUpgrade);
            }else {
                notificationJSON.put(URLs.kSettingPgyer, 0);
            }

            if (notificationJSON.getInt(URLs.kSettingThursdaySay) > 0){
                mCheckThursdaySay.setText("   小四说");
                RedPointView.showRedPoint(mAppContext, URLs.kSettingThursdaySay, bvCheckThursdaySay);
            }

            FileUtil.writeFile(notificationPath, notificationJSON.toString());
        } catch (Exception e) {
            e.printStackTrace();
        }

    }

}
