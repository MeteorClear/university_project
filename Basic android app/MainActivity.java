package com.example.final_app;

import androidx.activity.result.contract.ActivityResultContracts;
import androidx.annotation.Dimension;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.database.SQLException;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.ImageButton;
import android.widget.TextView;
import android.widget.Toast;

/*
*                   Final Project - Mobile Programming
*       made by 유성민 ( 20181556 )
*
*       details will write in report
*       Log tag is "DebugCheckC"
* */



public class MainActivity extends AppCompatActivity {
    // 프레퍼런스 이름
    public static final String PREFS_NAME = "Prefs_setting";

    //db
    dbHelper helper;
    SQLiteDatabase db;

    // 세팅값 변수
    boolean gridView_check = false;
    int gridColumn = 4;
    int textSize = 14;

    // 세팅값 표시 텍스트뷰
    TextView debug_text1;
    TextView debug_text2;
    TextView debug_text3;

    // 글씨 크기 변경
    TextView textViewT;
    Button viewButton;
    TextView debugTextMenu;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        //debug check
        Log.i("DebugCheckC", "state :: debug :: purpose : location : activity / This is Guidance");
        Log.i("DebugCheckC", "Normal :: debug :: call check : onCreate : MainActivity");

        //db
        helper = new dbHelper(this);
        try {
            db = helper.getWritableDatabase();
        } catch (SQLException ex) {
            db = helper.getReadableDatabase();
        }

        // 셋팅값 표시 텍스트뷰
        debug_text1 = findViewById(R.id.debugText1);
        debug_text2 = findViewById(R.id.debugText2);
        debug_text3 = findViewById(R.id.debugText3);

        //글씨 크기 변경용 텍스트뷰
        textViewT = findViewById(R.id.textViewT);
        debugTextMenu = findViewById(R.id.debugTextMenu);

        // 이미지 버튼, 셋팅 페이지 이동
        ImageButton Btn_setting = findViewById(R.id.imgButton_setting);
        Btn_setting.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                //debug check
                Log.i("DebugCheckC", "Normal :: debug :: call check : onClick, ImageButton : MainActivity");
                Log.i("DebugCheckC", "Normal :: debug :: call schedule : intent, SettingActivity : MainActivity");

                Intent intent_setting = new Intent(MainActivity.this, SettingActivity.class);
                startActivityForResult(intent_setting, 10000);
            }
        });

        // 중앙 뷰엑티비티 이동 버튼
        viewButton = findViewById(R.id.ViewButton);
        viewButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                //debug check
                Log.i("DebugCheckC", "Normal :: debug :: call check : onClick, Button : MainActivity");

                if(gridView_check) {
                    //debug check
                    Log.i("DebugCheckC", "Normal :: debug :: call schedule : intent, GridViewActivity : MainActivity");

                    Intent intent_view = new Intent(MainActivity.this, GridViewActivity.class);
                    startActivity(intent_view);
                } else {
                    //debug check
                    Log.i("DebugCheckC", "Normal :: debug :: call schedule : intent, ListViewActivity : MainActivity");

                    Intent intent_view = new Intent(MainActivity.this, ListViewActivity.class);
                    startActivity(intent_view);
                }

            }
        });

        // 프레퍼런스 값 읽기
        SharedPreferences settings = getSharedPreferences(PREFS_NAME, 0);
        //debug check
        Log.i("DebugCheckC", "Normal :: debug :: linear check : SharedPreferences : MainActivity");
        gridView_check = settings.getBoolean("gridView_check_prefs", false);
        gridColumn = 4 - settings.getInt("gridColumn_prefs", 0);
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

        if (gridView_check) {
            debug_text1.setText("GridView mode");
            debug_text2.setText("Grid Column : "+gridColumn);
        }
        else {
            debug_text1.setText("ListView mode");
            debug_text2.setText("ListView");
        }
        debug_text3.setText("Text size : "+textSize+"sp");

        //텍스트 사이즈 변경
        ChangeTextSize();


        //프레퍼런스 최소실행값 저장
        SharedPreferences.Editor editor = settings.edit();
        boolean first = settings.getBoolean("isFirst", true);
        if(first){
            //debug check
            Log.i("DebugCheckC", "Normal :: debug :: call First : FirstSetting : MainActivity");

            Toast.makeText(this, "첫 방문을 환영합니다. 관련 데이터를 설정 중이에요.", Toast.LENGTH_LONG);
            editor.putBoolean("isFirst", false);
            editor.commit();
        }


    } // 온크리에이트 종료 위치


    // 셋팅값 받아오기, <- 중요하지않음::프레퍼런스로 대체 가능
    @Override
    protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        //debug check
        Log.i("DebugCheckC", "Normal :: debug :: call check : onActivityResult : MainActivity");


        switch (requestCode) {
            case 10000:
                // 값 넘겨받기
                gridView_check = data.getBooleanExtra("gridView_check", false);
                gridColumn = data.getIntExtra("gridColumn", 4);
                textSize = data.getIntExtra("textSize", 14);

                //중앙 설정값 텍스트 변경
                if (gridView_check) {
                    debug_text1.setText("GridView mode");
                    debug_text2.setText("Grid Column : "+gridColumn);
                }
                else {
                    debug_text1.setText("ListView mode");
                    debug_text2.setText("ListView");
                }
                debug_text3.setText("Text size : "+textSize+"sp");

                //중앙 설정값 텍스트 사이즈 변경
                ChangeTextSize();
                break;
        }
    }

    //텍스트 크기 변경
    void ChangeTextSize() {
        //debug check
        Log.i("DebugCheckC", "Normal :: debug :: call check : ChangeTextSize, linear : MainActivity");
        textViewT.setTextSize(Dimension.SP, textSize);
        viewButton.setTextSize(Dimension.SP, textSize);
        debugTextMenu.setTextSize(Dimension.SP, textSize);
        debug_text1.setTextSize(Dimension.SP, textSize);
        debug_text2.setTextSize(Dimension.SP, textSize);
        debug_text3.setTextSize(Dimension.SP, textSize);
    }


}

//db
class dbHelper extends SQLiteOpenHelper {
    private static final String DATABASE_NAME = "geolocation.db";
    private static final int DATABASE_VERSION = 2;

    public dbHelper(Context context) {
        super(context, DATABASE_NAME, null, DATABASE_VERSION);
    }

    public void onCreate(SQLiteDatabase db) {
        db.execSQL("CREATE TABLE locations (_id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, geo TEXT);");

        //지도 데이터값 / 영문이름, 좌표
        db.execSQL("INSERT INTO locations VALUES (null, 'Underwater Waterfall', '-20.47357986034712, 57.31475046273126');");
        db.execSQL("INSERT INTO locations VALUES (null, 'Darvaza Gas Crater', '40.252619455944334, 58.439700398020385');");
        db.execSQL("INSERT INTO locations VALUES (null, 'Fly Geyser', '40.85943243692193, -119.33190000196072');");
        db.execSQL("INSERT INTO locations VALUES (null, 'Glass Beach', '39.45267535365975, -123.81357903269719');");

        db.execSQL("INSERT INTO locations VALUES (null, 'Sea Sparkle', '-0.6111442252431621, 73.10204844568781');");
        db.execSQL("INSERT INTO locations VALUES (null, 'Grand Canyon', '36.12882642164751, -112.22529794349198');");
        db.execSQL("INSERT INTO locations VALUES (null, 'Grand Prismatic Spring', '44.52509868099888, -110.83819061718816');");
        db.execSQL("INSERT INTO locations VALUES (null, 'Great Barrier Reef', '-19.09238173777674, 148.62155663039377');");

        db.execSQL("INSERT INTO locations VALUES (null, 'Ha Long Bay', '20.90692411589568, 107.1825765059955');");
        db.execSQL("INSERT INTO locations VALUES (null, 'Hyams Beach', '-35.103126362758104, 150.6934356115296');");
        db.execSQL("INSERT INTO locations VALUES (null, 'Lake Retba', '14.838492392280058, -17.234062317231388');");
        db.execSQL("INSERT INTO locations VALUES (null, 'Richat structure', '21.126924130980886, -11.401658224042652');");

        db.execSQL("INSERT INTO locations VALUES (null, 'Rio Tinto River', '37.62788271212085, -6.536043621506256');");
        db.execSQL("INSERT INTO locations VALUES (null, 'Mount Roraima', '5.133709903617959, -60.75876085071344');");
        db.execSQL("INSERT INTO locations VALUES (null, 'Salar De Uyuni', '-20.139033869126056, -67.63613026422841');");
        db.execSQL("INSERT INTO locations VALUES (null, 'Spotted Lake', '49.07789305023392, -119.56678919772213');");
    }

    public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
        db.execSQL("DROP TABLE IF EXISTS contact");
        onCreate(db);
    }
}
