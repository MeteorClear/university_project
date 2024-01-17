package com.example.final_app;

import androidx.annotation.Dimension;
import androidx.appcompat.app.AppCompatActivity;

import android.app.Activity;
import android.content.Intent;
import android.content.SharedPreferences;
import android.database.Cursor;
import android.database.SQLException;
import android.database.sqlite.SQLiteDatabase;
import android.net.Uri;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.ImageView;
import android.widget.ListView;
import android.widget.TextView;
import android.widget.Toast;

public class ListViewActivity extends AppCompatActivity {
    // 프레퍼런스 이름
    public static final String PREFS_NAME = "Prefs_setting";

    //db
    dbHelper helper;
    SQLiteDatabase db;

    // 텍스트 사이즈 설정용
    int textSize;

    // 리스트뷰
    ListView list;

    //이미지
    Integer[] lv_images = { R.drawable.pic1, R.drawable.pic2, R.drawable.pic3, R.drawable.pic4,
                            R.drawable.pic5, R.drawable.pic6, R.drawable.pic7, R.drawable.pic8,
                            R.drawable.pic9, R.drawable.pic10, R.drawable.pic11, R.drawable.pic12,
                            R.drawable.pic13, R.drawable.pic14, R.drawable.pic15, R.drawable.pic16 };

    // 임시 변수 <- 이후 값 변경됨
    String[] lv_name_e;
    String[] lv_name_k;
    String[] lv_country;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_list_view);

        //debug check
        Log.i("DebugCheckC", "Normal :: debug :: call check : onCreate : ListViewActivity");

        //db
        helper = new dbHelper(this);
        try {
            db = helper.getWritableDatabase();
        } catch (SQLException ex) {
            db = helper.getReadableDatabase();
        }

        // 스트링xml에 있는 배열 불러옴
        lv_name_e = getResources().getStringArray(R.array.name_english);
        lv_name_k = getResources().getStringArray(R.array.name_korean);
        lv_country = getResources().getStringArray(R.array.country);

        //커스럼 리스트뷰
        CustomList adapter = new CustomList(ListViewActivity.this);
        list = findViewById(R.id.LV_list);
        list.setAdapter(adapter);


        //프레퍼런스 설정
        SharedPreferences settings = getSharedPreferences(PREFS_NAME, 0);
        switch (settings.getInt("textSize_prefs", 0)) {
            case 0 :
                textSize = 14;
                break;
            case 1 :
                textSize = 15;
                break;
            case 2 :
                textSize = 16;
                break;
            case 3 :
                textSize = 18;
                break;
            case 4 :
                textSize = 21;
                break;
        }

        list.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                //debug check
                Log.i("DebugCheckC", "Normal :: debug :: call check : onItemClick : ListViewActivity");

                Cursor cursor;
                cursor = db.rawQuery("SELECT name, geo FROM locations WHERE name='"+ lv_name_e[position] +"';", null);

                // 설정된 위치값으로 지도 실행
                Intent intent_geo = null;
                while (cursor.moveToNext()) {
                    String geo = cursor.getString(1);
                    geo = "geo:"+geo;
                    intent_geo = new Intent(Intent.ACTION_VIEW, Uri.parse(geo));
                }
                Toast.makeText(getApplicationContext(), lv_name_k[position]+"으로 이동합니다.", Toast.LENGTH_SHORT).show();
                Log.i("DebugCheckC", "Normal :: debug :: call schedule : intent, ACTION_VIEW, geo : ListViewActivity");
                if(intent_geo != null) startActivity(intent_geo);
            }
        });

    }

    public class CustomList extends ArrayAdapter<String> {

        private final Activity context;

        public CustomList(Activity context) {
            super(context, R.layout.listitem, lv_name_e);
            this.context = context;
        }

        public View getView(int position, View view, ViewGroup parent) {
            //debug check
            Log.i("DebugCheckC", "Normal :: debug :: call check : getView : ListViewActivity");

            //뷰 객체화
            LayoutInflater inflater = context.getLayoutInflater();
            View rowView = inflater.inflate(R.layout.listitem, null, true);

            ImageView imageView = rowView.findViewById(R.id.LV_imageView);
            TextView name_E = rowView.findViewById(R.id.LV_textView_E);
            TextView name_K = rowView.findViewById(R.id.LV_textView_K);
            TextView country = rowView.findViewById(R.id.LV_textView_C);

            //이미지 데이터 및 텍스트 데이터 설정
            imageView.setImageResource(lv_images[position]);
            name_E.setText(lv_name_e[position]);
            name_K.setText(lv_name_k[position]);
            country.setText(lv_country[position]);

            //텍스트 사이즈 설정
            name_E.setTextSize(Dimension.SP, textSize);
            name_K.setTextSize(Dimension.SP, textSize);
            country.setTextSize(Dimension.SP, textSize);

            //Toast.makeText(this.getContext(), titles[position], Toast.LENGTH_SHORT).show();

            return rowView;
        }
    }
}
