package com.intfocus.hdmcre;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.Window;
import android.view.WindowManager;

import com.intfocus.hdmcre.util.ApiHelper;

import org.json.JSONObject;

/**
 * Created by liuruilin on 2017/3/15.
 */

public class LaunchActivity extends BaseActivity {
    public String kSuccess = "success";               // 用户登录验证结果
    private String usernameString, passwordString, loginTypeString;
    private SharedPreferences mSharedPreferences;
    private SharedPreferences.Editor mEditor;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        showFullScreen();
        setContentView(R.layout.activity_launch);
        mSharedPreferences = getSharedPreferences("loginState", MODE_PRIVATE);
        mEditor = mSharedPreferences.edit();
        if (checkIsLogin()) {
            checkUserConfig();
        }
        else {
            onLoginError();
        }
    }

    /*
     * 判断之前是否已登录
     */
    private boolean checkIsLogin() {
        return mSharedPreferences.getBoolean("isLogin", false);
    }

    private void checkUserConfig() {
        usernameString = mSharedPreferences.getString("userName", null);
        passwordString = mSharedPreferences.getString("passWord", null);
        loginTypeString = mSharedPreferences.getString("loginType", null);

        new Thread(new Runnable() {
            @Override
            public void run() {
                final String info = ApiHelper.authentication(mAppContext, usernameString, passwordString, loginTypeString);

                if (info.compareTo(kSuccess) > 0 || info.compareTo(kSuccess) < 0) {
                    mEditor.putBoolean("loginType", false);
                    toast(info);
                    onLoginError();
                    return;
                }

                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        onLoginSuccess();

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
                    }
                });
            }
        }).start();
    }

    public void onLoginSuccess() {
        Intent intent = new Intent(this, DashboardActivity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
        this.startActivity(intent);
        finish();
    }

    public void onLoginError() {
        Intent intent = new Intent(this, LoginActivity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
        this.startActivity(intent);
        finish();
    }

    public void showFullScreen() {
        //隐藏标题栏
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        //隐藏状态栏
        //定义全屏参数
        int flag= WindowManager.LayoutParams.FLAG_FULLSCREEN;
        //获得当前窗体对象
        Window window= this.getWindow();
        //设置当前窗体为全屏显示
        window.setFlags(flag, flag);
    }
}
