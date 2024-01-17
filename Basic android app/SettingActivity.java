package com.example.final_app;

import androidx.annotation.Dimension;
import androidx.appcompat.app.AppCompatActivity;

import android.app.ProgressDialog;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.util.TypedValue;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.Spinner;
import android.widget.Switch;
import android.widget.TextView;
import android.widget.Toast;

public class SettingActivity extends AppCompatActivity {
    // 프레퍼런스, 이름
    public static final String PREFS_NAME = "Prefs_setting";

    // 프레퍼런스, 임시변수
    boolean temp_prefs_gridView_check = false;
    int temp_prefs_gridColumn = 0;
    int temp_prefs_textSize = 0;

    //진행바
    private ProgressDialog progress;

    //최초 확인 임시변수
    int chk=0;

    //값 넘기기용 intent
    Intent intent = new Intent();

    //스피너들
    Spinner spinner_set_imageview;
    Spinner spinner_set_gridcolumn;
    Spinner spinner_set_textsize;

    //텍스트들
    TextView textView1;
    TextView textView2;
    TextView textView3;
    TextView textView4;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_setting);

        //debug check
        Log.i("DebugCheckC", "Normal :: debug :: call check : onCreate : SettingActivity");

        //진행바
        progress = new ProgressDialog(this);

        //텍스트들
        textView1 = findViewById(R.id.SA_main_text);
        textView2 = findViewById(R.id.SA_text_imageView);
        textView3 = findViewById(R.id.SA_text_gridcolumn);
        textView4 = findViewById(R.id.SA_text_textsize);

        //스피너 (뷰모드, 그리드뷰 열 수, 글씨 크기)
        spinner_set_imageview = findViewById(R.id.SA_spinner_imageView);
        spinner_set_gridcolumn = findViewById(R.id.SA_spinner_gridcolumn);
        spinner_set_textsize = findViewById(R.id.SA_spinner_textsize);

        //스피너 뷰모드 어답터
        ArrayAdapter<CharSequence> adapter_imageview = ArrayAdapter.createFromResource(this, R.array.set_imageView, android.R.layout.simple_spinner_item);
        adapter_imageview.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        spinner_set_imageview.setAdapter(adapter_imageview);

        //스피너 그리드뷰 열 수 어답터
        ArrayAdapter<CharSequence> adapter_gridcolumn = ArrayAdapter.createFromResource(this, R.array.set_gridcolumn, android.R.layout.simple_spinner_item);
        adapter_gridcolumn.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        spinner_set_gridcolumn.setAdapter(adapter_gridcolumn);

        //스피너 글씨 크기 어답터
        ArrayAdapter<CharSequence> adapter_textsize = ArrayAdapter.createFromResource(this, R.array.set_textsize, android.R.layout.simple_spinner_item);
        adapter_textsize.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        spinner_set_textsize.setAdapter(adapter_textsize);

        // #L , 아이템 셀렉트 리스너, 스피너 아이템 선택용
        OnItemSelectedListener listener_spinner_set = new OnItemSelectedListener();

        //스피너 3개 리스너 적용
        spinner_set_imageview.setOnItemSelectedListener(listener_spinner_set);
        spinner_set_gridcolumn.setOnItemSelectedListener(listener_spinner_set);
        spinner_set_textsize.setOnItemSelectedListener(listener_spinner_set);

        //뒤로가기 버튼, 익명으로 처리
        Button back_button = findViewById(R.id.buttonBackToMain);
        back_button.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                //debug check
                Log.i("DebugCheckC", "Normal :: debug :: call check : onClick, Button : SettingActivity");
                Log.i("DebugCheckC", "Normal :: debug :: call schedule : finish : SettingActivity");

                setResult(RESULT_OK, intent);
                finish();
            }
        });







        // 프레퍼런스, 값 복원 코드 / 복원후 스피너 선택 아이템 변경
        SharedPreferences settings = getSharedPreferences(PREFS_NAME, 0);
        //debug check
        Log.i("DebugCheckC", "Normal :: debug :: linear check : SharedPreferences : SettingActivity");

        if(settings.getBoolean("gridView_check_prefs", false)) {
            spinner_set_imageview.setSelection(1);
        } else {
            spinner_set_imageview.setSelection(0);
        }
        spinner_set_gridcolumn.setSelection(settings.getInt("gridColumn_prefs", 0));
        spinner_set_textsize.setSelection(settings.getInt("textSize_prefs", 0));




    }

    // #L , 아이템 셀렉트 리스너, 스피너 아이템 클릭시 작용
    class OnItemSelectedListener implements AdapterView.OnItemSelectedListener {

        @Override
        public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
            //debug check
            Log.i("DebugCheckC", "Normal :: debug :: call check : onItemSelected : SettingActivity");

            //Toast.makeText(parent.getContext(), ""+parent.getItemAtPosition(position), Toast.LENGTH_SHORT).show();

            // 부모 아이디로 어떤 스피너인지 구별
            switch (parent.getId()) {

                // 뷰모드
                case R.id.SA_spinner_imageView :
                    //debug check
                    Log.i("DebugCheckC", "Normal :: debug :: call check : SA_spinner_imageView : SettingActivity");
                    if(position == 1) {
                        intent.putExtra("gridView_check", true);
                        temp_prefs_gridView_check = true;
                    }
                    else if(position == 0) {
                        intent.putExtra("gridView_check", false);
                        temp_prefs_gridView_check = false;
                    }
                    else Toast.makeText(parent.getContext(), "Fatal Error :: undecided spinner position", Toast.LENGTH_LONG).show();
                    break;

                // 그리드뷰 열 수
                case R.id.SA_spinner_gridcolumn :
                    //debug check
                    Log.i("DebugCheckC", "Normal :: debug :: call check : SA_spinner_gridcolumn : SettingActivity");
                    if(position==0) intent.putExtra("gridColumn", 4);
                    else if(position==1) intent.putExtra("gridColumn", 3);
                    else if(position==2) intent.putExtra("gridColumn", 2);
                    else if(position==3) intent.putExtra("gridColumn", 1);
                    else Toast.makeText(parent.getContext(), "Fatal Error :: undecided spinner position", Toast.LENGTH_LONG).show();

                    temp_prefs_gridColumn = position;
                    break;

                // 글씨 크기
                case R.id.SA_spinner_textsize :
                    //debug check
                    Log.i("DebugCheckC", "Normal :: debug :: call check : SA_spinner_textsize : SettingActivity");
                    switch (position) {
                        case 0:
                            intent.putExtra("textSize", 14);
                            changeTextSize(14);
                            break;
                        case 1:
                            intent.putExtra("textSize", 15);
                            changeTextSize(15);
                            break;
                        case 2:
                            intent.putExtra("textSize", 16);
                            changeTextSize(16);
                            break;
                        case 3:
                            intent.putExtra("textSize", 18);
                            changeTextSize(18);
                            break;
                        case 4:
                            intent.putExtra("textSize", 21);
                            changeTextSize(21);
                            break;

                        default:
                            Toast.makeText(parent.getContext(), "Fatal Error :: undecided spinner position", Toast.LENGTH_LONG).show();
                            break;
                    }
                    temp_prefs_textSize = position;
                    break;
            }// 스위치 문 끝나는 블럭

        }//선택시 매서드 끝나는 블럭

        @Override
        public void onNothingSelected(AdapterView<?> parent) {
            //debug check
            Log.i("DebugCheckC", "Normal :: debug :: call check : onNothingSelected : SettingActivity");
        }
    }

    // 라이프사이클, 스탑
    @Override
    protected void onStop() {
        super.onStop();
        //debug check
        Log.i("DebugCheckC", "Normal :: debug :: call check : onStop : SettingActivity");

        //프레퍼런스, 데이터 저장 / 불리언, 인트, 인트 / 인트값은 포지션 값
        SharedPreferences settings = getSharedPreferences(PREFS_NAME, 0);
        SharedPreferences.Editor editor = settings.edit();
        editor.putBoolean("gridView_check_prefs", temp_prefs_gridView_check);
        editor.putInt("gridColumn_prefs", temp_prefs_gridColumn);
        editor.putInt("textSize_prefs", temp_prefs_textSize);
        editor.commit();
    }

    // 텍스트 크기 변경 / 첫 이후론 진행바 팝업
    void changeTextSize(int size) {
        //debug check
        Log.i("DebugCheckC", "Normal :: debug :: call check : changeTextSize : SettingActivity");

        chk++;
        if(chk>1) Start();

        textView1.setTextSize(Dimension.SP, size);
        textView2.setTextSize(Dimension.SP, size);
        textView3.setTextSize(Dimension.SP, size);
        textView4.setTextSize(Dimension.SP, size);
    }

    // 진행바
    public void Start() {
        //debug check
        Log.i("DebugCheckC", "Normal :: debug :: call check : Start : SettingActivity");

        progress.setCancelable(true);
        progress.setProgressStyle(ProgressDialog.STYLE_HORIZONTAL);
        progress.setProgress(0);
        progress.setMax(100);
        progress.show();

        final Thread t = new Thread() {
            public void run() {

                try {
                    sleep(200);
                    progress.setProgress(25);
                    sleep(200);
                    progress.setProgress(50);
                    sleep(200);
                    progress.setProgress(75);
                    sleep(200);
                    progress.setProgress(99);
                    sleep(300);
                    progress.setProgress(100);
                    sleep(200);
                    progress.dismiss();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }

            }
        };

        t.start();
    }


}
