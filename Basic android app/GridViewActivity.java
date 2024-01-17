package com.example.final_app;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.database.Cursor;
import android.database.SQLException;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;
import android.net.Uri;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.BaseAdapter;
import android.widget.GridLayout;
import android.widget.GridView;
import android.widget.ImageView;
import android.widget.Toast;

public class GridViewActivity extends AppCompatActivity {
    //프레퍼런스 이름
    public static final String PREFS_NAME = "Prefs_setting";

    //db
    dbHelper helper;
    SQLiteDatabase db;

    // 열수 변수 프레퍼런스에 값을 받음
    int gridViewColumn;

    // 이미지 16개
    Integer[] gv_images = { R.drawable.pic1, R.drawable.pic2, R.drawable.pic3, R.drawable.pic4,
            R.drawable.pic5, R.drawable.pic6, R.drawable.pic7, R.drawable.pic8,
            R.drawable.pic9, R.drawable.pic10, R.drawable.pic11, R.drawable.pic12,
            R.drawable.pic13, R.drawable.pic14, R.drawable.pic15, R.drawable.pic16 };

    //임시 변수
    String[] gv_name_e;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_grid_view);

        //debug check
        Log.i("DebugCheckC", "Normal :: debug :: call check : onCreate : GridViewActivity");

        //db
        helper = new dbHelper(this);
        try {
            db = helper.getWritableDatabase();
        } catch (SQLException ex) {
            db = helper.getReadableDatabase();
        }

        //프레퍼런스 값 받기
        SharedPreferences settings = getSharedPreferences(PREFS_NAME, 0);
        gridViewColumn = 4 - settings.getInt("gridColumn_prefs", 0);
        gv_name_e = getResources().getStringArray(R.array.name_english);

        //그리드뷰, 설정 적용
        GridView gridView = findViewById(R.id.GV_grid);
        gridView.setNumColumns(gridViewColumn);

        //이미지 어답터 설정
        gridView.setAdapter(new ImageAdapter(this));

        gridView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                //debug check
                Log.i("DebugCheckC", "Normal :: debug :: call check : onItemClick : GridViewActivity");

                Cursor cursor;
                cursor = db.rawQuery("SELECT name, geo FROM locations WHERE name='"+ gv_name_e[position] +"';", null);

                // 설정된 위치값으로 지도 실행
                Intent intent_geo = null;
                while (cursor.moveToNext()) {
                    String geo = cursor.getString(1);
                    geo = "geo:"+geo;
                    intent_geo = new Intent(Intent.ACTION_VIEW, Uri.parse(geo));
                }
                Toast.makeText(getApplicationContext(), gv_name_e[position]+"으로 이동합니다.", Toast.LENGTH_SHORT).show();
                Log.i("DebugCheckC", "Normal :: debug :: call schedule : intent, ACTION_VIEW, geo : GridViewActivity");
                if(intent_geo != null) startActivity(intent_geo);
            }
        });


    }


    // 이미지 어답터
    public class ImageAdapter extends BaseAdapter {
        private Context context;

        //콘텐트 받기, 엑티비티
        public ImageAdapter(Context c) {
            context = c;
        }

        @Override
        public int getCount() {
            return gv_images.length;
        }

        @Override
        public Object getItem(int position) {
            return null;
        }

        @Override
        public long getItemId(int position) {
            return 0;
        }


        //실질 이미지 표시
        @Override
        public View getView(int position, View convertView, ViewGroup parent) {
            //debug check
            Log.i("DebugCheckC", "Normal :: debug :: call check : getView : GridViewActivity");

            ImageView imageView;
            if(convertView == null) {
                imageView = new ImageView(context);

                // 열수에 따라 이미지 크기 조정
                switch (gridViewColumn) {
                    case 4:
                        imageView.setLayoutParams(new GridView.LayoutParams(250,250));
                        break;
                    case 3:
                        imageView.setLayoutParams(new GridView.LayoutParams(330,330));
                        break;
                    case 2:
                        imageView.setLayoutParams(new GridView.LayoutParams(500,500));
                        break;
                    case 1:
                        imageView.setLayoutParams(new GridView.LayoutParams(1000,1000));
                        break;
                }

                // 이미지 스케일과 패딩 설정
                imageView.setScaleType(ImageView.ScaleType.CENTER_CROP);
                imageView.setPadding(10,10,10,10);
            } else {
                imageView = (ImageView) convertView;
            }

            //이미지 설정
            imageView.setImageResource(gv_images[position]);
            return imageView;
        }
    } // 이미지 어답터 끝
}
