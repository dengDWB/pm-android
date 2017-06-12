package com.intfocus.yxtest;

import android.Manifest;
import android.annotation.SuppressLint;
import android.app.AlertDialog;
import android.app.ProgressDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.graphics.Rect;
import android.os.Build;
import android.os.Bundle;
import android.support.v4.app.ActivityCompat;
import android.support.v4.content.ContextCompat;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.View;
import android.view.ViewTreeObserver;
import android.view.WindowManager;
import android.widget.AdapterView;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ListView;
import android.widget.RelativeLayout;
import android.widget.SimpleAdapter;
import android.widget.TextView;

import com.intfocus.yxtest.util.ApiHelper;
import com.intfocus.yxtest.util.FileUtil;
import com.intfocus.yxtest.util.K;
import com.intfocus.yxtest.util.URLs;
import com.pgyersdk.update.PgyUpdateManager;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;


public class LoginActivity extends BaseActivity {
    public String kFromActivity = "from_activity";         // APP 启动标识
    public String kSuccess = "success";               // 用户登录验证结果
    private EditText usernameEditText, passwordEditText;
    private String usernameString, passwordString, loginTypeString;
    private Context mContext;
    private ListView listView;
    private SharedPreferences mSharedPreferences;
    private SharedPreferences.Editor mEditor;
    private ArrayList<HashMap<String, Object>> menuListItem;
    private final static int CODE_AUTHORITY_REQUEST = 0;
    private static final String[] permissionsArray = new String[]{
            Manifest.permission.WRITE_EXTERNAL_STORAGE,
            Manifest.permission.READ_PHONE_STATE,
            Manifest.permission.CAMERA};

    @Override
    @SuppressLint("SetJavaScriptEnabled")
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        mSharedPreferences = getSharedPreferences("loginState", MODE_PRIVATE);
        mEditor = mSharedPreferences.edit();
        setContentView(R.layout.activity_login);

        mContext = this;

        // 使背景填满整个屏幕,包括状态栏
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            getWindow().addFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS);
        }


        /*
         *  检测版本更新
         */
        checkPgyerVersionUpgrade(LoginActivity.this, false);

        usernameEditText = (EditText) findViewById(R.id.etUsername);
        passwordEditText = (EditText) findViewById(R.id.etPassword);
        TextView versionTv = (TextView) findViewById(R.id.versionTv);
//        setEditTextListener();

        try {
            if (user != null && user.has(URLs.kUserNum)) {
                usernameEditText.setText(user.getString(URLs.kUserNum));
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }

        /*
         * 显示当前应用版本号
         */
        try {
            PackageInfo packageInfo = getPackageManager().getPackageInfo(getPackageName(), 0);
            String versionInfo = String.format("a%s(%d)", packageInfo.versionName, packageInfo.versionCode);
            versionTv.setText(versionInfo);
        } catch (PackageManager.NameNotFoundException e) {
            e.printStackTrace();
        }

        /*
         *  当用户系统不在我们支持范围内时,发出警告。
         */
        if (Build.VERSION.SDK_INT > K.kMaxSdkVersion || Build.VERSION.SDK_INT < K.kMinSdkVersion) {
            showVersionWarring();
        }

        RelativeLayout loginLayout = (RelativeLayout) findViewById(R.id.login_layout);
        Button mTenantLogin = (Button) findViewById(R.id.btn_login_tenant);
        controlKeyboardLayout(loginLayout, mTenantLogin);

        /*
         * 检测登录界面，版本是否升级
         */
        checkVersionUpgrade(assetsPath);
        getAuthority();
    }
    public void setEditTextListener(){
        usernameEditText.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {

            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                menuListItem = new ArrayList<>();
                try {
                    JSONArray array = getUserNameList();
                    for (int i = 0; i < array.length(); i++){
                        if (array.getString(i).startsWith(usernameEditText.getText().toString()) && !(array.getString(i).equals(usernameEditText.getText().toString()))){
                            HashMap<String, Object> map = new HashMap<>();
                            map.put("title", array.getString(i));
                            menuListItem.add(map);
                        }
                    }
                    listView = (ListView) findViewById(R.id.listView);
                    listView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
                        @Override
                        public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                            usernameEditText.setText(menuListItem.get(position).get("title").toString());
                        }
                    });
                    SimpleAdapter adapter = new SimpleAdapter(LoginActivity.this, menuListItem, R.layout.list_prompt,
                            new String[]{"title"},
                            new int[]{R.id.titleItem});
                    listView.setAdapter(adapter);
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }

            @Override
            public void afterTextChanged(Editable s) {

            }
        });
    }

    protected void onResume() {
        mMyApp.setCurrentActivity(this);
        if (mProgressDialog != null) {
            mProgressDialog.dismiss();
        }
        super.onResume();
    }

    protected void onDestroy() {
        mWebView = null;
        user = null;
        PgyUpdateManager.unregister();
        super.onDestroy();
    }

    @Override
    public void onBackPressed() {
        mMyApp.setCurrentActivity(null);
        finish();
        System.exit(0);
    }

    /*
     * 系统版本警告
     */
    private void showVersionWarring() {
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setTitle("温馨提示")
                .setMessage(String.format("本应用不支持当前系统版本【Android %s】,强制使用可能会出现异常喔,给您带来的不便深表歉意,我们会尽快适配的!", Build.VERSION.RELEASE))
                .setPositiveButton("退出应用", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        mMyApp.setCurrentActivity(null);
                        finish();
                        System.exit(0);
                    }
                })
                .setNegativeButton("继续运行", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        // 返回 LoginActivity
                    }
                });
        builder.show();
    }

    /*
     * 获取权限 : 文件读写 (WRITE_EXTERNAL_STORAGE),读取设备信息 (READ_PHONE_STATE)
     */
    private void getAuthority() {
        List<String> permissionsList = new ArrayList<>();
        for (String permission : permissionsArray) {
            if (ContextCompat.checkSelfPermission(LoginActivity.this, permission) != PackageManager.PERMISSION_GRANTED) {
                permissionsList.add(permission);
            }
        }
        if (!permissionsList.isEmpty() && permissionsList != null) {
            ActivityCompat.requestPermissions(LoginActivity.this, permissionsList.toArray(new String[permissionsList.size()]), CODE_AUTHORITY_REQUEST);
        }
    }

    /*
     * 权限获取反馈
     */
    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        switch (requestCode) {

            case CODE_AUTHORITY_REQUEST:
                boolean flag = false;
                if (grantResults.length > 0) {
                    for (int i = 0; i < permissions.length; i++) {
                        if (grantResults[i] == PackageManager.PERMISSION_GRANTED) {
                        } else {
                            flag = true;
                        }
                    }
                }

                if (flag) {
                    setAlertDialog(LoginActivity.this, "某些权限获取失败，是否到本应用的设置界面设置权限");
                }

                break;
            default:
                super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        }
    }

    /*
     * 键盘弹出监听,使用键盘时,整体布局上移
     */
    private void controlKeyboardLayout(final View view, final View scrollToView) {
        view.getViewTreeObserver().addOnGlobalLayoutListener(
                new ViewTreeObserver.OnGlobalLayoutListener() {
                    @Override
                    public void onGlobalLayout() {
                        Rect rect = new Rect();
                        view.getWindowVisibleDisplayFrame(rect);// 获取完整布局在窗体的可视区域
                        int rootInvisibleHeight = view.getRootView().getHeight() - rect.bottom; //完整布局高度 减去 可视区域高度
                        if (rootInvisibleHeight > 0) {
                            //软键盘弹出来的时候
                            int[] location = new int[2];
                            // 获取 scrollToView 在窗体的坐标
                            scrollToView.getLocationInWindow(location);
                            // 计算完整布局滚动高度，使 scrollToView 在可见区域的底部
                            int srollHeight = (location[1] + scrollToView.getHeight()) - rect.bottom;
                            view.scrollTo(0, srollHeight + 20);
                        } else {
                            // 软键盘没有弹出来的时候
                            view.scrollTo(0, 0);
                        }
                    }
                });
    }

    public void onTenantLogin(View v) {
        actionSubmit("tenant");
    }

    /*
     * 登录按钮点击事件
     */
    public void actionSubmit(String type) {
        try {
            usernameString = usernameEditText.getText().toString();
            passwordString = passwordEditText.getText().toString();
            loginTypeString = type;
            if (usernameString.isEmpty() || passwordString.isEmpty()) {
                toast("请输入用户名与密码");
                return;
            }
            mProgressDialog = ProgressDialog.show(LoginActivity.this, "稍等", "验证用户信息...");

            new Thread(new Runnable() {
                @Override
                public void run() {
                    final String info = ApiHelper.authentication(mAppContext, usernameString, passwordString, loginTypeString);
                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            if (!info.equals("success")) {
                                if (mProgressDialog != null) {
                                    mProgressDialog.dismiss();
                                }
                                toast(info);
                                return;
                            }

                            // 检测用户空间，版本是否升级
                            assetsPath = FileUtil.dirPath(mAppContext, K.kHTMLDirName);
                            checkVersionUpgrade(assetsPath);

                            // 存储已登录信息
                            mEditor.putString("userName", usernameString);
                            mEditor.putString("passWord", passwordString);
                            mEditor.putString("loginType", loginTypeString);
                            mEditor.putBoolean("isLogin", true);
                            mEditor.commit();

                            saveLoginUserName(usernameString);

                            // 跳转至主界面
                            Intent intent = new Intent(LoginActivity.this, DashboardActivity.class);
                            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                            LoginActivity.this.startActivity(intent);

                            /*
                             * 用户行为记录, 单独异常处理，不可影响用户体验
                             */
                            try {
                                logParams = new JSONObject();
                                logParams.put("action", "登录");
                                new Thread(mRunnableForLogger).start();
                            } catch (Exception e) {
                                e.printStackTrace();
                            }

                            if (mProgressDialog != null) {
                                mProgressDialog.dismiss();
                            }
                            finish();
                        }
                    });
                }
            }).start();
        } catch (Exception e) {
            e.printStackTrace();
            if (mProgressDialog != null) mProgressDialog.dismiss();
            toast(e.getLocalizedMessage());
        }
    }

    public void saveLoginUserName(String userName){
        boolean isAdd = true;
        mSharedPreferences = getSharedPreferences("loginUserNameList", MODE_PRIVATE);
        String userNameList = mSharedPreferences.getString("userNameList", "");
        mEditor = mSharedPreferences.edit();
        try {
            JSONArray array;
            if (userNameList.equals("")){
                array = new JSONArray();
            }else {
                array = new JSONArray(userNameList);
            }
            for (int i = 0; i < array.length(); i++){
                if (array.getString(i).equals(userName)){
                    isAdd = false;
                }
            }
            if (isAdd) {
                array.put(userName);
            }
            mEditor.putString("userNameList", array.toString());
            mEditor.commit();
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    public JSONArray getUserNameList(){
        JSONArray array = null;
        try {
            mSharedPreferences = getSharedPreferences("loginUserNameList", MODE_PRIVATE);
            String userNameList = mSharedPreferences.getString("userNameList", "");
            if (userNameList.equals("")){
                array = new JSONArray();
            }else {
                array = new JSONArray(userNameList);
            }
        } catch (JSONException e) {
            e.printStackTrace();
            array = new JSONArray();
        }
        return array;
    }
}
