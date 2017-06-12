package com.intfocus.yxtest.fragment;

import android.Manifest;
import android.app.Activity;
import android.app.AlertDialog;
import android.app.ProgressDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.net.Uri;
import android.os.AsyncTask;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.os.PowerManager;
import android.provider.MediaStore;
import android.provider.Settings;
import android.support.annotation.Nullable;
import android.support.v4.app.Fragment;
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

import com.intfocus.yxtest.LaunchActivity;
import com.intfocus.yxtest.LoginActivity;
import com.intfocus.yxtest.R;
import com.intfocus.yxtest.ResetPasswordActivity;
import com.intfocus.yxtest.ThursdaySayActivity;
import com.intfocus.yxtest.YHApplication;
import com.intfocus.yxtest.screen_lock.InitPassCodeActivity;
import com.intfocus.yxtest.util.ApiHelper;
import com.intfocus.yxtest.util.FileUtil;
import com.intfocus.yxtest.util.HttpUtil;
import com.intfocus.yxtest.util.K;
import com.intfocus.yxtest.util.LogUtil;
import com.intfocus.yxtest.util.PrivateURLs;
import com.intfocus.yxtest.util.URLs;
import com.intfocus.yxtest.view.CircleImageView;
import com.intfocus.yxtest.view.RedPointView;
import com.pgyersdk.javabean.AppBean;
import com.pgyersdk.update.PgyUpdateManager;
import com.pgyersdk.update.UpdateManagerListener;
import com.readystatesoftware.viewbadger.BadgeView;
import com.umeng.message.PushAgent;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import static android.app.Activity.RESULT_CANCELED;
import static android.content.Context.MODE_PRIVATE;

/**
 * Created by 40284 on 2017/6/9.
 */

public class SettingFragment extends Fragment {
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
    private Activity activity;
    Context mAppContext;
    protected YHApplication mMyApp;
    JSONObject user;
    Toast toast;
    JSONObject logParams = new JSONObject();
    protected ProgressDialog mProgressDialog;
    public final static String kVersionCode = "versionCode";
    public final static String kLoading = "loading";
    protected String sharedPath;

    /* 请求识别码 */
    private static final int CODE_GALLERY_REQUEST = 0xa0;
    private static final int CODE_CAMERA_REQUEST = 0xa1;
    private static final int CODE_RESULT_REQUEST = 0xa2;

    public SettingFragment(Activity activity) {
        this.activity = activity;
    }

//    public SettingFragment(){
//
//    }
    @Nullable
    @Override
    public View onCreateView(LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        mContext = activity;

        mMyApp = (YHApplication) activity.getApplication();
        mAppContext = mMyApp.getAppContext();
        sharedPath = FileUtil.sharedPath(mAppContext);

        mPushAgent = PushAgent.getInstance(mContext);

        String userConfigPath = String.format("%s/%s", FileUtil.basePath(mAppContext), K.kUserConfigFileName);
        if ((new File(userConfigPath)).exists()) {
            user = FileUtil.readConfigFile(userConfigPath);
        }

        View view = inflater.inflate(R.layout.activity_setting, null);
        mUserID = (TextView) view.findViewById(R.id.user_id);
        mRoleID = (TextView) view.findViewById(R.id.role_id);
        mGroupID = (TextView) view.findViewById(R.id.group_id);
        mChangePWD = (TextView) view.findViewById(R.id.change_pwd);
        mWarnPWD = (TextView) view.findViewById(R.id.warn_pwd);
        mCheckUpgrade = (TextView) view.findViewById(R.id.check_upgrade);
        mPygerLink = (TextView) view.findViewById(R.id.pgyer_link);
        mAppName = (TextView) view.findViewById(R.id.app_name);
        mAppVersion = (TextView) view.findViewById(R.id.app_version);
        mDeviceID = (TextView) view.findViewById(R.id.device_id);
        mApiDomain = (TextView) view.findViewById(R.id.api_domain);
        mAppIdentifier = (TextView) view.findViewById(R.id.app_identifier);
        mPushState = (TextView) view.findViewById(R.id.push_state);
        TextView mChangeLock = (TextView) view.findViewById(R.id.change_lock);
        TextView mCheckAssets = (TextView) view.findViewById(R.id.check_assets);
        Button mLogout = (Button) view.findViewById(R.id.logout);
        mLockSwitch = (Switch) view.findViewById(R.id.lock_switch);
        mDashboardSwitch = (Switch) view.findViewById(R.id.dashboard_switch);
        mIconImageView =(CircleImageView) view.findViewById(R.id.img_icon);
        mCheckThursdaySay = (TextView) view.findViewById(R.id.check_thursday_say);

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
            mLongCatSwitch = (Switch) view.findViewById(R.id.longcat_switch);
            mLongCatSwitch.setChecked(betaJSON.has("image_within_screen") && betaJSON.getBoolean("image_within_screen"));
            mDashboardSwitch.setChecked(betaJSON.has("allow_brower_copy") && betaJSON.getBoolean("allow_brower_copy"));
        } catch (JSONException | IOException e) {
            e.printStackTrace();
        }

        bvCheckUpgrade = new BadgeView(activity, mCheckUpgrade);
        bvChangePWD = new BadgeView(activity, mChangePWD);
        bvCheckThursdaySay = new BadgeView(activity, mCheckThursdaySay);

        mChangeLock.setOnClickListener(mChangeLockListener);
        mChangePWD.setOnClickListener(mChangePWDListener);
        mLogout.setOnClickListener(mLogoutListener);
        mCheckUpgrade.setOnClickListener(mCheckUpgradeListener);
        mLockSwitch.setOnCheckedChangeListener(mSwitchLockListener);
        mLongCatSwitch.setOnCheckedChangeListener(mSwitchLongCatListener);
        mDashboardSwitch.setOnCheckedChangeListener(mDashboardListener);
        mPygerLink.setOnClickListener(mPgyerLinkListener);
        mIconImageView.setOnClickListener(mIconImageViewListener);
        mCheckThursdaySay.setOnClickListener(mThursdaySayListener);

        initIconMenu();
        initializeUI();
        setSettingViewControlBadges();
        return view;
    }

    @Override
    public void onResume() {
        super.onResume();
        mMyApp.setCurrentActivity(activity);
        mLockSwitch.setChecked(FileUtil.checkIsLocked(mAppContext));
    }

    @Override
    public void onDestroy() {
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
            String mLoginType = user.getString("loginType").equals("market") ? "商场" : "商户";
            mUserID.setText(user.getString("user_name") + "(" + mLoginType + ")");
            mRoleID.setText(user.getString("role_name"));
            mGroupID.setText(user.getString("group_name"));
            mAppName.setText(getApplicationName(activity));
            String deviceInfo = String.format("%s(Android %s)", TextUtils.split(android.os.Build.MODEL, " - ")[0], Build.VERSION.RELEASE);
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

            PackageInfo packageInfo = activity.getPackageManager().getPackageInfo(activity.getPackageName(), 0);
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
        } catch (PackageManager.NameNotFoundException | JSONException e) {
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
            checkPgyerVersionUpgrade(activity,true);
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
            int cameraPermission = ContextCompat.checkSelfPermission(mAppContext, Manifest.permission.CAMERA);
            if(cameraPermission != PackageManager.PERMISSION_GRANTED) {
                setAlertDialog(activity, "相机权限获取失败，是否到本应用的设置界面设置权限");
            }else{
                popupWindow.showAtLocation(mIconImageView, Gravity.BOTTOM|Gravity.CENTER_HORIZONTAL, 0, 0);
            }
        }
    };

    public void setAlertDialog(Context context, String message) {
        AlertDialog.Builder builder = new AlertDialog.Builder(context);
        builder.setTitle("温馨提示")
                .setMessage(message)
                .setPositiveButton("确认", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        Intent intent = new Intent();
                        intent.setAction(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
                        Uri uri = Uri.fromParts("package", activity.getPackageName(), null);
                        intent.setData(uri);
                        startActivity(intent);
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

    public void initIconMenu() {
        final View iconMenuView = LayoutInflater.from(activity).inflate(R.layout.activity_icon_dialog, null);

        Button btnTakePhoto =(Button) iconMenuView.findViewById(R.id.btn_icon_takephoto);
        Button btnGetPhoto  =(Button) iconMenuView.findViewById(R.id.btn_icon_getphoto);
        Button btnCancel =(Button) iconMenuView.findViewById(R.id.btn_icon_cancel);

        popupWindow = new PopupWindow(activity);
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
                imageUri = FileProvider.getUriForFile(activity, "com.intfocus.hdmcre.fileprovider", new File(Environment.getExternalStorageDirectory(),"icon.jpg"));
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
    public void onActivityResult(int requestCode, int resultCode,Intent intent) {
        // 用户没有选择图片，返回
        if (resultCode == RESULT_CANCELED) {
            Toast.makeText(mAppContext, "取消", Toast.LENGTH_LONG).show();
            return;
        }

        switch (requestCode) {
            case CODE_GALLERY_REQUEST:
                cropPhoto(intent.getData());
                break;
            case CODE_CAMERA_REQUEST:
                File tempFile = new File(Environment.getExternalStorageDirectory(),"icon.jpg");
                if (android.os.Build.VERSION.SDK_INT >= Build.VERSION_CODES.N){
                    Uri photoURI = FileProvider.getUriForFile(activity,
                            "com.hd.shimao.fileprovider",
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
            String url=FileUtil.getBitmapUrlPath(activity, uri);
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

//    /*
//     * 返回
//     */
//    public void dismissActivity(View v) {
//        activity.onBackPressed();
//    }
//
//    @Override
//    public void onBackPressed() {
//        super.onBackPressed();
//        Intent intent = new Intent(this, DashboardActivity.class);
//        startActivity(intent);
//        finish();
//    }

    public void launchThursdaySayActivity(View v) {
        try {
            String noticePath = FileUtil.dirPath(mAppContext, K.kConfigDirName, K.kLocalNotificationConfigFileName);
            JSONObject notificationJson = new JSONObject(FileUtil.readFile(noticePath));
            notificationJson.put(URLs.kSettingThursdaySay, 0);
            FileUtil.writeFile(noticePath, notificationJson.toString());

            Intent blogLinkIntent = new Intent(activity,ThursdaySayActivity.class);
            blogLinkIntent.setFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);
            startActivity(blogLinkIntent);
        } catch (JSONException | IOException e) {
            e.printStackTrace();
        }
    }

    View.OnClickListener mThursdaySayListener = new View.OnClickListener() {
        @Override
        public void onClick(View v) {
            Intent ThursdaySayIntent = new Intent(getActivity(), ThursdaySayActivity.class);
            ThursdaySayIntent.setFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);
            startActivity(ThursdaySayIntent);
        }
    };
//    public void launchDeveloperActivity(View v) {
//        Intent developerIntent = new Intent(getActivity(), DeveloperActivity.class);
//        developerIntent.setFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);
//        startActivity(developerIntent);
//    }

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
            String userPermissionPath = FileUtil.sharedPath(activity) + "/offline_pages/static/js/user_permission.js";
            if (new File(userPermissionPath).exists()){
                new File(userPermissionPath).delete();
            }

            String adPath = FileUtil.sharedPath(activity) + "/advertisement/assets/javascripts/user_permission.js";
            if (new File(adPath).exists()){
                new File(adPath).delete();
            }

            String configPath = FileUtil.dirPath(activity, "config", "user_permission.js");
            if (new File(configPath).exists()){
                new File(configPath).delete();
            }

            Intent intent = new Intent();
            intent.setClass(activity, LaunchActivity.class);
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

            activity.finish();
        }
    };

    void modifiedUserConfig(JSONObject configJSON) {
        try {
            String userConfigPath = String.format("%s/%s", FileUtil.basePath(mAppContext), K.kUserConfigFileName);
            JSONObject userJSON = FileUtil.readConfigFile(userConfigPath);

            userJSON = ApiHelper.mergeJson(userJSON, configJSON);
            FileUtil.writeFile(userConfigPath, userJSON.toString());

            String settingsConfigPath = FileUtil.dirPath(mAppContext, K.kConfigDirName, K.kSettingConfigFileName);
            FileUtil.writeFile(settingsConfigPath, userJSON.toString());
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    /*
    * 修改密码
    */
    private final View.OnClickListener mChangePWDListener = new View.OnClickListener() {
        @Override
        public void onClick(View v) {
            Intent intent = new Intent(getActivity(), ResetPasswordActivity.class);
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
            Toast.makeText(activity, "TODO: 修改锁屏密码", Toast.LENGTH_SHORT).show();
        }
    };

    /*
     * 校正，客户使用遇到问题时的终极解决方案
     */
    private final View.OnClickListener mCheckAssetsListener = new View.OnClickListener() {
        @Override
        public void onClick(View v) {
            mProgressDialog = ProgressDialog.show(activity, "稍等", "加载中");
            new Thread(new Runnable() {
                @Override
                public void run() {
                    try {
                        String info = ApiHelper.authentication(activity, user.getString(URLs.kUserNum), user.getString(URLs.kPassword),user.getString("loginType"));
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
                            activity.runOnUiThread(new Runnable() {
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
                            activity.runOnUiThread(new Runnable() {
                                @Override
                                public void run() {
                                    if (mProgressDialog != null){
                                        mProgressDialog.dismiss();
                                    }
                                    Intent intent = new Intent(activity, LoginActivity.class);
                                    startActivity(intent);
                                    activity.finish();
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
            try {
                String pgyerVersionPath = String.format("%s/%s", FileUtil.basePath(mAppContext), K.kPgyerVersionConfigFileName);
                if((new File(pgyerVersionPath)).exists()) {
                    JSONObject pgyerJSON = FileUtil.readConfigFile(pgyerVersionPath);
                    JSONObject responseData = null;
                    responseData = pgyerJSON.getJSONObject(URLs.kData);
                    String appUrl = responseData.getString("appUrl");
                    Intent browserIntent = new Intent(android.content.Intent.ACTION_VIEW, Uri.parse(appUrl));
                    startActivity(browserIntent);
                }else {
                    toast("链接不存在");
                }
            } catch (JSONException e) {
                e.printStackTrace();
                toast("链接不存在");
            }
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
    protected void toast(final String info) {
        activity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                try {
                    if (null == toast) {
                        toast = Toast.makeText(mAppContext, info, Toast.LENGTH_SHORT);
                    } else {
                        toast.setText(info); //若当前已有 Toast 在显示,则直接修改当前 Toast 显示的内容
                    }
                    toast.show();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        });
    }

    Runnable mRunnableForLogger = new Runnable() {
        @Override
        public void run() {
            try {
                String action = logParams.getString(URLs.kAction);
                if (action == null) {
                    return;
                }
                if (!action.contains("登录") && !action.equals("解屏") && !action.equals("点击/主页面/浏览器")) {
                    return;
                }

                ApiHelper.actionLog(mAppContext, logParams);
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
    };

    /*
     * 托管在蒲公英平台，对比版本号检测是否版本更新
     * 对比 build 值，只准正向安装提示
     * 奇数: 测试版本，仅提示
     * 偶数: 正式版本，点击安装更新
     */
    void checkPgyerVersionUpgrade(final Activity activity, final boolean isShowToast) {
        UpdateManagerListener updateManagerListener = new UpdateManagerListener() {
            @Override
            public void onUpdateAvailable(final String result) {
                try {
                    Log.d("aaaaa", result);
                    final AppBean appBean = getAppBeanFromString(result);

                    if (result == null || result.isEmpty()) {
                        return;
                    }

                    PackageInfo packageInfo = activity.getPackageManager().getPackageInfo(activity.getPackageName(), 0);
                    int currentVersionCode = packageInfo.versionCode;

                    JSONObject response = new JSONObject(result);
                    String message = response.getString("message");

                    JSONObject responseVersionJSON = response.getJSONObject(URLs.kData);
                    int newVersionCode = responseVersionJSON.getInt(kVersionCode);
                    Log.i("1111", newVersionCode + "");
                    String newVersionName = responseVersionJSON.getString("versionName");

                    if (currentVersionCode >= newVersionCode) {
                        return;
                    }

                    String pgyerVersionPath = String.format("%s/%s", FileUtil.basePath(mAppContext), K.kPgyerVersionConfigFileName);
                    FileUtil.writeFile(pgyerVersionPath, result);

                    if (newVersionCode % 2 == 1) {
                        if (isShowToast) {
                            toast(String.format("有发布测试版本%s(%s)", newVersionName, newVersionCode));
                        }

                        return;
                    } else if (HttpUtil.isWifi(activity) && newVersionCode % 10 == 8) {

                        startDownloadTask(activity, appBean.getDownloadURL());

                        return;
                    }
                    new AlertDialog.Builder(activity)
                            .setTitle("版本更新")
                            .setMessage(message.isEmpty() ? "无升级简介" : message)
                            .setPositiveButton(
                                    "确定",
                                    new DialogInterface.OnClickListener() {
                                        @Override
                                        public void onClick(DialogInterface dialog, int which) {
                                            startDownloadTask(activity, appBean.getDownloadURL());
                                        }
                                    })
                            .setNegativeButton("下一次",
                                    new DialogInterface.OnClickListener() {
                                        @Override
                                        public void onClick(DialogInterface dialog, int which) {
                                            dialog.dismiss();
                                        }
                                    })
                            .setCancelable(false)
                            .show();

                } catch (PackageManager.NameNotFoundException e) {
                    e.printStackTrace();
                } catch (JSONException e) {
                    e.printStackTrace();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }

            @Override
            public void onNoUpdateAvailable() {
                if (isShowToast) {
                    toast("已是最新版本");
                }
            }
        };

        PgyUpdateManager.register(activity, updateManagerListener);
    }
    /**
     * 检测服务器端静态文件是否更新
     * to do
     */
    synchronized void checkAssetsUpdated(boolean shouldReloadUIThread) {
        checkAssetUpdated(shouldReloadUIThread, kLoading, false);
        checkAssetUpdated(shouldReloadUIThread, URLs.kFonts, true);
        checkAssetUpdated(shouldReloadUIThread, URLs.kImages, true);
        checkAssetUpdated(shouldReloadUIThread, URLs.kIcons, true);
        checkAssetUpdated(shouldReloadUIThread, URLs.kStylesheets, true);
        checkAssetUpdated(shouldReloadUIThread, URLs.kJavaScripts, true);
        checkAssetUpdated(shouldReloadUIThread, URLs.kBarCodeScan, false);
//        checkAssetUpdated(shouldReloadUIThread, URLs.kOfflinePages, false);
        checkAssetUpdated(shouldReloadUIThread, URLs.kOfflinePagesHtml, false);
        checkAssetUpdated(shouldReloadUIThread, URLs.kOfflinePagesImages, false);
        checkAssetUpdated(shouldReloadUIThread, URLs.kOfflinePagesJavascripts, false);
        checkAssetUpdated(shouldReloadUIThread, URLs.kOfflinePagesStylesheets, false);
        checkAssetUpdated(shouldReloadUIThread, URLs.kAdvertisement, false);
        ApiHelper.downloadUserJs(mAppContext, sharedPath, user);
    }

    private boolean checkAssetUpdated(boolean shouldReloadUIThread, String assetName, boolean isInAssets) {
        try {
            boolean isShouldUpdateAssets = false;
            String localKeyName = "";
            String keyName = "";
            String assetZipPath = String.format("%s/%s.zip", sharedPath, assetName);
            isShouldUpdateAssets = !(new File(assetZipPath)).exists();

            String userConfigPath = String.format("%s/%s", FileUtil.basePath(mAppContext), K.kUserConfigFileName);
            JSONObject userJSON = FileUtil.readConfigFile(userConfigPath);
            if (assetName.contains("offline_pages_")) {
                localKeyName = String.format("local_%s_md5", assetName);
                keyName = String.format("%s_md5", assetName.replace("offline_pages_", ""));
            } else {
                localKeyName = String.format("local_%s_md5", assetName);
                keyName = String.format("%s_md5", assetName);
            }
            if (assetName.contains("offline_pages_")) {
                JSONObject jsonObject = userJSON.getJSONObject("offline_pages");
                isShouldUpdateAssets = !isShouldUpdateAssets && !userJSON.getString(localKeyName).equals(jsonObject.getString(keyName));
            } else {
                isShouldUpdateAssets = !isShouldUpdateAssets && !userJSON.getString(localKeyName).equals(userJSON.getString(keyName));
            }

            if (!isShouldUpdateAssets) {
                return false;
            }

//            LogUtil.d("checkAssetUpdated", String.format("%s: %s != %s", assetZipPath, userJSON.getString(localKeyName), userJSON.getString(keyName)));
            // execute this when the downloader must be fired
            final DownloadAssetsTask downloadTask = new DownloadAssetsTask(mAppContext, shouldReloadUIThread, assetName, isInAssets);
            final String downloadPath = FileUtil.dirPath(mAppContext, "Cached/" + String.format("%d", new Date().getTime()), String.format("%s.zip", assetName));
            downloadTask.execute(String.format(K.kDownloadAssetsAPIPath, K.kBaseUrl, assetName), downloadPath);

            return true;
        } catch (JSONException e) {
            e.printStackTrace();
        }

        return false;
    }

    class DownloadAssetsTask extends AsyncTask<String, Integer, String> {
        private final Context context;
        private PowerManager.WakeLock mWakeLock;
        private final boolean isReloadUIThread;
        private final String assetFilename;
        private final boolean isInAssets;
        private String downloadPath = "";

        public DownloadAssetsTask(Context context, boolean shouldReloadUIThread, String assetFilename, boolean isInAssets) {
            this.context = context;
            this.isReloadUIThread = shouldReloadUIThread;
            this.assetFilename = assetFilename;
            this.isInAssets = isInAssets;
        }

        @Override
        protected String doInBackground(String... params) {
            InputStream input = null;
            OutputStream output = null;
            HttpURLConnection connection = null;
            try {
                URL url = new URL(params[0]);
                connection = (HttpURLConnection) url.openConnection();
                connection.connect();

                // expect HTTP 200 OK, so we don't mistakenly save error report
                // instead of the file
                if (connection.getResponseCode() != HttpURLConnection.HTTP_OK) {
                    return "Server returned HTTP " + connection.getResponseCode() + " " + connection.getResponseMessage();
                }

                // this will be useful to display download percentage
                // might be -1: server did not report the length
                int fileLength = connection.getContentLength();
                input = connection.getInputStream();
                output = new FileOutputStream(params[1]);
                downloadPath = params[1];

                byte data[] = new byte[4096];
                long total = 0;
                int count;
                while ((count = input.read(data)) != -1) {
                    // allow canceling with back button
                    if (isCancelled()) {
                        input.close();
                        return null;
                    }
                    total += count;
                    // publishing the progress....
                    if (fileLength > 0) // only if total length is known
                        publishProgress((int) (total * 100 / fileLength));
                    output.write(data, 0, count);
                }
            } catch (Exception e) {
                LogUtil.d("Exception", e.toString());
                return e.toString();
            } finally {
                try {
                    if (output != null)
                        output.close();
                    if (input != null)
                        input.close();
                } catch (IOException ignored) {
                }

                if (connection != null)
                    connection.disconnect();
            }
            return null;
        }

        @Override
        protected void onPreExecute() {
            super.onPreExecute();
            // take CPU lock to prevent CPU from going off if the user
            // presses the power button during download
            PowerManager pm = (PowerManager) context.getSystemService(Context.POWER_SERVICE);
            mWakeLock = pm.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK,
                    getClass().getName());
            mWakeLock.acquire();
        }

        @Override
        protected void onProgressUpdate(Integer... progress) {
            super.onProgressUpdate(progress);
        }

        @Override
        protected void onPostExecute(String result) {
            mWakeLock.release();

            if (result != null) {
                Toast.makeText(context, String.format("静态资源更新失败(%s)", result), Toast.LENGTH_LONG).show();
            } else {
                new Thread(new Runnable() {
                    @Override
                    public void run() {
                        try {
                            String keyName = "";
                            String md5String = "";
                            String offonlineMd5String = "";
                            if (new File(downloadPath).exists()) {
                                InputStream zipStream = new FileInputStream(downloadPath);
                                md5String = FileUtil.MD5(zipStream);
                                if (assetFilename.contains("offline_pages_")) {
                                }
                                keyName = String.format("%s_md5", assetFilename.replace("offline_pages_", ""));
                            } else {
                                keyName = String.format("%s_md5", assetFilename);
                            }

                            if (assetFilename.contains("offline_pages_")) {
                                JSONObject jsonObject = user.getJSONObject("offline_pages");
                                offonlineMd5String = jsonObject.getString(keyName);
                            } else {
                                offonlineMd5String = user.getString(keyName);
                            }
                            if (offonlineMd5String.equals(md5String)) {
                                String assetZipPath = String.format("%s/%s.zip", sharedPath, assetFilename);
                                if (new File(downloadPath).exists()) {
                                    if (new File(assetZipPath).exists()) {
                                        new File(assetZipPath).delete();
                                    }
                                    FileUtil.copyZipFile(downloadPath, assetZipPath);

                                }
                                activity.runOnUiThread(new Runnable() {
                                    @Override
                                    public void run() {
                                        FileUtil.checkAssets(mAppContext, assetFilename, isInAssets);
//                                        if (isReloadUIThread) {
//                                            new Thread(mRunnableForDetecting).start();
//                                        }
                                    }
                                });
                            }
                        } catch (JSONException e) {
                            e.printStackTrace();
                        } catch (IOException e) {
                            e.printStackTrace();
                        }
                    }
                }).start();
            }
        }
    }


}
