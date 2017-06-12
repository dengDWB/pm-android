package com.intfocus.yxtest.util;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.util.Log;
import android.widget.Toast;

import com.pgyersdk.javabean.AppBean;
import com.pgyersdk.update.PgyUpdateManager;
import com.pgyersdk.update.UpdateManagerListener;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;

/**
 * Created by 40284 on 2017/6/12.
 */

public class Util {
    public final static String kVersionCode = "versionCode";

    public static void checkPgyerVersionUpgrade(final Activity activity, final boolean isShowToast) {
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

                    String pgyerVersionPath = String.format("%s/%s", FileUtil.basePath(activity), K.kPgyerVersionConfigFileName);
                    FileUtil.writeFile(pgyerVersionPath, result);

                    if (newVersionCode % 2 == 1) {
                        if (isShowToast) {
                            Toast.makeText(activity, String.format("有发布测试版本%s(%s)", newVersionName, newVersionCode), Toast.LENGTH_SHORT).show();
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
                    Toast.makeText(activity, "已是最新版本", Toast.LENGTH_SHORT).show();
                }
            }
        };

        PgyUpdateManager.register(activity, updateManagerListener);
    }
}
