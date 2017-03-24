package com.intfocus.hdmcre;

import android.content.Context;
import android.view.View;
import android.view.ViewGroup;
import android.widget.SimpleAdapter;
import android.widget.TextView;

import com.intfocus.hdmcre.util.FileUtil;
import com.intfocus.hdmcre.util.K;
import com.readystatesoftware.viewbadger.BadgeView;

import org.json.JSONObject;

import java.util.List;
import java.util.Map;

/**
 * Created by Liurl on 2016/9/20.
 */
public class MenuAdapter extends SimpleAdapter {
	private final Context mContext;
	private final String noticePath;


	public MenuAdapter(Context context, List<? extends Map<String, ?>> data,
					   int resource, String[] from, int[] to) {
		super(context, data, resource, from, to);
		this.mContext = context;
		noticePath = FileUtil.dirPath(mContext, K.kConfigDirName, K.kLocalNotificationConfigFileName);
	}

	public View getView(int position, View convertView, ViewGroup parent) {
		View v = super.getView(position, convertView, parent);

		TextView itemName = (TextView) v.findViewById(R.id.text_menu_item);

		if (itemName.getText().equals("个人信息")) {

			if (convertView != null) {
				return v;
			}

			JSONObject notificationJSON = FileUtil.readConfigFile(noticePath);
			try {
				BadgeView bvUser = new BadgeView(mContext, itemName);
				bvUser.setVisibility(View.GONE);

//				if (notificationJSON.getInt(URLs.kSetting) > 0) {
//					RedPointView.showRedPoint(mContext, "user", bvUser);
//				}
			} catch (Exception e) {
				e.printStackTrace();
			}
		}

		return v;
	}
}
