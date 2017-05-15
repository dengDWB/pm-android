package com.intfocus.shimaotest;

import android.content.Context;
import android.view.View;
import android.view.ViewGroup;
import android.widget.SimpleAdapter;
import android.widget.TextView;

import java.util.List;
import java.util.Map;

/**
 * Created by liuruilin on 2017/4/24.
 */

public class SimpleListAdapter extends SimpleAdapter {
    private final Context mContext;
    private List<? extends Map<String, ?>> listItem;

    public SimpleListAdapter(Context context, List<? extends Map<String, ?>> data,
                             int resource, String[] from, int[] to) {
        super(context, data, resource, from, to);
        this.mContext = context;
        this.listItem = data;
    }

    public View getView(int position, View convertView, ViewGroup parent) {
        View v = super.getView(position, convertView, parent);

        TextView mItemContent = (TextView) v.findViewById(R.id.titleItem);

        return v;
    }
}
