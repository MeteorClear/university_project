var sm;					//side menu div   move right to left
var sm_chk=0;			//check for menu open or closes   default : 0    0 is closed(side menu do not visible)

var b_menu;				//button_menu for open side menu
var b_menub;			//button_menuback for close side menu

var b_move_i;			//button_move_intro for move intro in top nav
var b_move_g;			//button_move_gallery for move gallery in top nav

var i_l;				//image left in page1
var i_c;				//image center in page1
var i_r;				//image right in page1

var b_i_l;				//button_image move left
var b_i_r;				//button_image move right

var img_chk=1;			//check for image index    default : 1    1 is center image (0, 1, 2 :: default)

var image_files = [	"images/gallery_images/Darvaza.jpg",
					"images/gallery_images/Fly Geyser.png",
					"images/gallery_images/glass beach.jpg",
					"images/gallery_images/Grand Canyon.jpg",
					"images/gallery_images/Grand Prismatic Spring.jpg",
					"images/gallery_images/Great Barrier Reef.jpg",
					"images/gallery_images/Ha Long Bay.jpg",
					"images/gallery_images/Hyams Beach.jpg",
					"images/gallery_images/Lake Retba.jpg",
					"images/gallery_images/mauritius.jpeg",
					"images/gallery_images/Richat Structure.jpg",
					"images/gallery_images/Rio Tinto.jpg",
					"images/gallery_images/Roraima.jpg",
					"images/gallery_images/Salar de Uyuni.jpg",
					"images/gallery_images/sea sparkle.png",
					"images/gallery_images/Spotted Lake.jpg" ];

var images = new Array();

for(var i=0; i<image_files.length; i++) {
    images[i] = new Image();
    images[i].src = image_files[i];
}

function init() {
	sm = document.getElementById("sidemenu");

	b_menu = document.getElementById("menubutton");
	b_menu.addEventListener("click", OnSidemenuClick);
	b_menub = document.getElementById("menuback");
	b_menub.addEventListener("click", OnSidemenuClick);
	
	b_move_i = document.getElementById("moveintro");
	b_move_i.addEventListener("click", OnTopBtnClickIntro);
	b_move_g = document.getElementById("movegallery");
	b_move_g.addEventListener("click", OnTopBtnClickGallery);

	i_l = document.getElementById("mainimgleft");
	i_c = document.getElementById("mainimgcenter");
	i_r = document.getElementById("mainimgright");

	//below three lines are setted default image, if can see temp image, it has bugs to show default images <- it's fine first html load during few ms;
	i_l.src = images[img_chk-1].src;
    i_c.src = images[img_chk].src;
    i_r.src = images[img_chk+1].src;

	b_i_l = document.getElementById("l-btn");
	b_i_l.addEventListener("click", OnMoveImgButtonClickLeft);
	b_i_r = document.getElementById("r-btn");
	b_i_r.addEventListener("click", OnMoveImgButtonClickRight);
}

//사이드 메뉴 보이기 숨기기
function OnSidemenuClick() {
	//alert("debug call :: OnSidemenuClick");
	if (sm_chk == 0) {
		sm.style.left = "0";
	}
	else {
		sm.style.left = "-300px";
	}
	sm_chk = (sm_chk+1)%2;
}

//탑 네비 페이지 이동
function OnTopBtnClickIntro(e) {
	//alert("debug call :: OnTopBtnClickIntro");
	window.open('index.html', "_self", "");
}
function OnTopBtnClickGallery(e) {
	//alert("debug call :: OnTopBtnClickGallery");
	window.open('gallery.html', "_self", "");
}

/*
if chk is 0, 0-1 = -1, -1 +length = length-1 <- this is last index in array
*/
//이미지 좌측에서 우측으로
function OnMoveImgButtonClickLeft() {
	//alert("debug call :: OnMoveImgButtonClickLeft");
	
	var cl = (img_chk-2)<0 ? (img_chk-2)+images.length : img_chk-2;
	var cc = (img_chk-1)<0 ? (img_chk-1)+images.length : img_chk-1;
	var cr = img_chk;

	img_chk = cc;

	i_l.src = images[cl].src;
    i_c.src = images[cc].src;
    i_r.src = images[cr].src;
    
}
/*
must mod use to prevent overflow
*/
//이미지 우측에서 좌측으로
function OnMoveImgButtonClickRight() {
	//alert("debug call :: OnMoveImgButtonClickRight");
	
	var cl = img_chk;
	var cc = (img_chk+1)%images.length;
	var cr = (img_chk+2)%images.length;

	img_chk = cc;

	i_l.src = images[cl].src;
    i_c.src = images[cc].src;
    i_r.src = images[cr].src;
    
}