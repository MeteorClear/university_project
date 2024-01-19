var sm;					//side menu div   move right to left
var sm_chk=0;			//check for menu open or closes   default : 0    0 is closed(side menu do not visible)

var b_menu;				//button_menu for open side menu
var b_menub;			//button_menuback for close side menu

var b_to_g;				//button_to_gallery for move gallery in page2

var p2;					//page2 div   chage background color black to white

var b_move_i;			//button_move_intro for move intro in top nav
var b_move_g;			//button_move_gallery for move gallery in top nav

var nav_nick_d;			//nick name div, small to big
var nav_nick_i;			//nick name input
var nav_nick_s;			//nick name submit
var nick_s;				//nick name space, nick name will be here
var ns_chk=0;			// useless <- maybe

function init() {
	sm = document.getElementById("sidemenu");

	b_menu = document.getElementById("menubutton");
	b_menu.addEventListener("click", OnSidemenuClick);
	b_menub = document.getElementById("menuback");
	b_menub.addEventListener("click", OnSidemenuClick);
	
	b_to_g = document.getElementById("page-btn");
	b_to_g.addEventListener("click", OnPageButtonClick);

	p2 = document.getElementById("page2");
	p2.addEventListener("mouseover", OnPageOver);

	b_move_i = document.getElementById("moveintro");
	b_move_i.addEventListener("click", OnTopBtnClickIntro);
	b_move_g = document.getElementById("movegallery");
	b_move_g.addEventListener("click", OnTopBtnClickGallery);

	nav_nick_d = document.getElementById("menubox2");
	nav_nick_d.addEventListener("click", OnNickSpaceClick);
	nav_nick_i = document.getElementById("nickinput");
	nav_nick_i.addEventListener("focus", OnNickSpaceFocus);
	nav_nick_i.addEventListener("blur", OnNickSpaceBlur);
	nav_nick_s = document.getElementById("nicksubmit");
	nav_nick_s.addEventListener("mouseover", OnNickSpaceMouseover);
	nav_nick_s.addEventListener("mouseout", OnNickSpaceMouseout);
	nav_nick_s.addEventListener("click", OnNickSubmit);
	nick_s = document.getElementById("nickname");
}

// 사이드 메뉴 보이기 숨기기
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

//갤러리 이동 버튼 페이지2
function OnPageButtonClick(e) {
	//alert("debug call :: OnPageButtonClick");
	if( !(confirm("갤러리로 이동 하시겠습니까?\n현재 페이지가 변경됩니다.")) ) {
		alert("이동을 취소하셨습니다.");
	} else {
		window.open('gallery.html', "_self", "");
	}
	
}

//페이지2 흰색으로 변함(변경후 유지)
function OnPageOver(e) {
	//alert("debug call :: OnPageOver");
	p2.style.backgroundColor = "white";
}

//탑 네비 인덱스, 갤러리 이동
function OnTopBtnClickIntro(e) {
	//alert("debug call :: OnTopBtnClickIntro");
	window.open('index.html', "_self", "");
}
function OnTopBtnClickGallery(e) {
	//alert("debug call :: OnTopBtnClickGallery");
	window.open('gallery.html', "_self", "");
}

//닉네임 입력 위치 크게
function OnNickSpaceClick(e) {
	//alert("debug call :: OnNickSpaceClick");
	if(ns_chk==0){
		nav_nick_d.style.width = "280px";
		nav_nick_d.style.height = "130px";
	
		nav_nick_i.style.visibility = "visible";
		nav_nick_s.style.visibility = "visible";
	
		nav_nick_i.style.width = "230px";
		nav_nick_i.style.height = "30px";
	
		nav_nick_s.style.width = "240px";
		nav_nick_s.style.height = "30px";
		ns_chk=1;
	}
}

//닉네임 관련 애니메이션 
function OnNickSpaceFocus(e) {
	//alert("debug call :: OnNickSpaceFocus");
	nav_nick_i.style.backgroundColor = "white";

}
function OnNickSpaceBlur(e) {
	//alert("debug call :: OnNickSpaceBlur");
	nav_nick_i.style.backgroundColor = "black";
}
function OnNickSpaceMouseover(e) {
	//alert("debug call :: OnNickSpaceMouseover");
	nav_nick_i.style.backgroundColor = "white";

	nav_nick_s.style.backgroundColor = "white";
	nav_nick_s.style.color = "black";
	nav_nick_s.style.borderRadius = "15px";
	nav_nick_s.value = "입력 완료!"
}
function OnNickSpaceMouseout(e) {
	//alert("debug call :: OnNickSpaceMouseout");
	nav_nick_i.style.backgroundColor = "black";

	nav_nick_s.style.backgroundColor = "black";
	nav_nick_s.style.color = "white";
	nav_nick_s.style.borderRadius = "0px";
	nav_nick_s.value = "입력 완료?"
}

//닉네임 입력, 비어있으면 표시 안됨
function OnNickSubmit(e) {
	//alert("debug call :: OnNickSubmit);
	var temp;
	temp = nav_nick_i.value;
	if (temp!="") {
		nick_s.innerHTML = temp+"님 환영합니다!";
		nav_nick_i.value = "";

		closseNS();
	}
	
}

//닉네임 입력 공간 축소
function closseNS() {
	//alert("debug call :: closseNS);
	if(ns_chk==1) {
		nav_nick_d.style.width = "20px";
		nav_nick_d.style.height = "20px";

		nav_nick_i.style.visibility = "hidden";
		nav_nick_s.style.visibility = "hidden";
	
		nav_nick_i.style.width = "0px";
		nav_nick_i.style.height = "01px";
	
		nav_nick_s.style.width = "0px";
		nav_nick_s.style.height = "0px";
	
	}
}