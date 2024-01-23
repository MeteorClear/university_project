
// 익스프레스 프레임워크
const express = require('express');
const app = express();
const logger = require('morgan');
const bodyParser = require('body-parser');
 
const apiRouter = express.Router();

// 웹 크롤링 용 패키지의 필요 변수
const request = require("request");
const cheerio = require("cheerio");
const iconv = require("iconv-lite");
 
// 라우터 데이터
app.use(logger('dev', {}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  	extended: true
}));

app.use('/api', apiRouter);


/************************************************* 건물 데이터 *************************************************/
const building = [
	["building_name", "image_url", "geo_url", "description"],
	["U-IT관", "https://url.kr/bq2shv", "http://kko.to/6rJgV4i4p", "소프트웨어 융합대학"],
	["글로벌빌리지", "https://url.kr/dt94r5", "http://kko.to/k6wsV4Wfo", "디지털콘텐츠학부강의실, 방사선,치위생학과, 스포츠센터, 건축설계관, 보건행정학과, 기숙사"],
	["대학교회", "https://url.kr/khujmc", "http://kko.to/N4X5Vfi4B", "채플과 동아리방"],
	["국제협력관", "https://url.kr/njchf1", "http://kko.to/tOXN_4WfB", "학생상담센터, 민석교양대학, 부총장실, 동아시아과 강의실"],
	["어문관", "https://url.kr/njchf1", "http://kko.to/WZWqV4ifp", "중국어학과 일본어학과 영어학과 강의실,CBT실"],
	["국제관", "https://url.kr/ciq4sd", "http://kko.to/wOtvVfifT", "국제통상물류학부 강의실"],
	["경영관", "https://url.kr/hq5cgy", "http://kko.to/r7Dd_4Wfp", "글로벌비즈니스대학 강의실"],
	["미래관", "", "http://kko.to/1xTA_fi4o", ""],
	["스튜던트플라자", "https://url.kr/svkxg4", "http://kko.to/gC-I_fWfT", "학생취업지원처 / 총학생회 / 동아리방"],
	["전자정보관", "https://url.kr/1g59ma", "http://kko.to/t4uI_4Wf0", "이공대학"],
	["산학협력관", "https://url.kr/e7qbwi", "http://kko.to/FSmU_fW4o", "경찰학과, 경호학과"],
	["문화센터", "https://url.kr/94yhiq", "http://kko.to/shFJVfi4B", "콘서트홀, 부산디지털대학"],
	["외국어교육원", "", "http://kko.to/1Pk6V4Wf0", "어학원 교학과사무실, 강의실"],
	["디자인홀", "https://url.kr/azyrd2", "http://kko.to/QrlQVfifo", "디자인대학"],
	["그린홀", "https://url.kr/xe9ny1", "http://kko.to/QIoL_4ifo", "토목공학, 작업치료학과"],
	["응용공학관", "https://url.kr/exmalc", "http://kko.to/__sRV4i4j", "신소재공학과, 식품공학과, 화학 실험실, 한-EU국제 협력센터"],
	["보건의료관", "https://url.kr/o8wvuy", "http://kko.to/ZakR_fWfo", "보건의료계열 학부 강의실, 실험실"],
	["건설공학관", "https://url.kr/s8a65n", "http://kko.to/-tZDw4WfT", "건축공학과 강의실"],
	["GSI빌딩", "https://url.kr/w5dvei", "https://goo.gl/maps/Wj5EauGhjaPn5QXf6", "외국인 유학생과 디자인교육을 위한 전용 건물"],
	["민석스포츠센터", "https://url.kr/hn83xb", "http://kko.to/5Jo4w4ifH", "체육시설, 건강클리닉센터, 레포츠과학부 사무실"],
	["민석도서관", "https://url.kr/g2ablw", "http://kko.to/rFtawfWfp", "열람실, 자료실, 국제세미나실, 다목적세미나실"],
	["뉴밀레니엄관", "https://url.kr/csvwyt", "http://kko.to/ZZQtwfifj", "미디어커뮤니케이션학부 강의실, 패션디자인학과강의실, 한중뉴미디어대학, 산학협력단"],
	["소향아트홀", "https://url.kr/xstprz", "http://kko.to/aZg-6fWfM", ""],
	["", "", "", ""],
];


var noticeURL = "http://";
const result = [];

// 학교 홈페이지 공지사항 데이터 크롤링
const getNews = () => {
	console.log("DebugLog :: start crawling");
	request(
  	{
		// 학교 홈페이지 공지사항, get으로 받아옴
    	url: noticeURL,
    	method: "GET",
    	encoding: null,
  	},
  	(error, response, body) => {
		if (error) {
			console.error(error);
			return;
		}
		
    	if (response.statusCode === 200) {
			console.log("response ok");
			
			// 글씨 깨짐 방지 iconv로 디코딩, 후 cheerio로 로드
			const bodyDecoded = iconv.decode(body, "UTF-8");
			const $ = cheerio.load(bodyDecoded);
			
			const list_text_inner_arr = $(
				"#contents > div > table > tbody > tr"
			).toArray();
			
    		list_text_inner_arr.forEach((div) => {
				const aFirst = $(div).find("a").first(); 					// 첫번째 <a> 태그
				const path = aFirst.attr("href"); 							// 첫번째 <a> 태그 url
				const url = `http://www.dongseo.ac.kr/${path}`; 			// 도메인을 붙인 url 주소
				const title = $(div).find("span").first().text().trim();	// 첫번째 <span> 태그
				const author = $(div).find("p").eq(2).text().trim();		// 세번째 0-2 본문 읽기
				const rdate = $(div).find("p").eq(3).text().trim();			// 네번째 본문 읽기

        		result.push({
          			url,
          			title,
					author,
					rdate,
        			});
      		});

      		console.log(result);
    	}
	});
	console.log("DebugLog :: crawling done");
};

getNews();



apiRouter.post('/FindBuilding', function(req, res) {
	console.log("DebugLog :: ========================= start FindBuilding =========================");
	console.log(req.body);
	let body_action = req.body.action;
	let params = req.body.action.params;
	let pdata = req.body.action.params.data;
	console.log("-------------------------");
	console.log(body_action);
	console.log("-------------------------");
	console.log(params);
	console.log("-------------------------");
	console.log(pdata);
	
	if(typeof pdata == "undefined") {
		const responseBody = {
			version: "2.0",
			template: {
				outputs: [
					{
						simpleText: {
							text: "말씀하신 건물을 찾지 못했어요ㅠ"
						}
					}
				]
			}
		};
		console.log(responseBody);
		res.status(200).send(responseBody);
	}
		
	
	let b_name;
	let b_img;
	let b_geo;
	let b_des;
	
	for(var i=1; i<building.length; i++) {
		if(i == building.length) {
			const responseBody = {
				version: "2.0",
				template: {
					outputs: [
						{
							simpleText: {
								text: "말씀하신 건물을 찾지 못했어요ㅠ"
							}
						}
					]
				}
			};
 			console.log(responseBody);
  			res.status(200).send(responseBody);
		}
		
		if(building[i][0] == pdata) {
			b_name = building[i][0];
			b_img = building[i][1];
			b_geo = building[i][2];
			b_des = building[i][3];
			console.log(building[i]);
			break;
		}
		
	}
	
	
  	const responseBody = {
	  "version": "2.0",
	  "template": {
		"outputs": [
		  {
			"basicCard": {
			  "title": b_name,
			  "description": "이 건물이 맞나요?\n바로! "+b_name+"!\n"+b_des,
			  "thumbnail": {
				"imageUrl": b_img
			  },
			  "profile": {
				"imageUrl": b_img,
				"nickname": "건물"
			  },
			  "social": {
				"like": 1238,
				"comment": 8,
				"share": 780
			  },
			  "buttons": [
				{
				  "action":  "webLink",
				  "label": "위치 확인하기",
				  "webLinkUrl": b_geo
				}
			  ]
			}
		  }
		]
	  }
	};
 	console.log(responseBody);
  	res.status(200).send(responseBody);
	console.log("DebugLog :: ========================= end FindBuilding =========================");
});

apiRouter.post('/UpdateNotice', function(req, res) {
	console.log("DebugLog :: ========================= start UpdateNotice =========================");
	console.log(req.body);
	let body_action = req.body.action;
	let params = req.body.action.params;
	let pdata = req.body.action.params.testpdata;
	console.log("-------------------------");
	console.log(body_action);
	console.log("-------------------------");
	console.log(params);
	console.log("-------------------------");
	console.log(pdata);
	
  	const responseBody = {
    	version: "2.0",
    	template: {
      		outputs: [
        		{
          			simpleText: {
            			text: "새로 올라온 공지사항을 확인했어요! 반영까지 10초정도 걸려요!"
          			}
        		}
      		]
    	}
  	};
	
	getNews();
  	res.status(200).send(responseBody);
	console.log("DebugLog :: ========================= end UpdateNotice =========================");
});

apiRouter.post('/ShowNotice', function(req, res) {
	console.log("DebugLog :: ========================= start ShowNotice =========================");
	console.log(req.body);
	
	const responseBody = {
	  "version": "2.0",
	  "template": {
		"outputs": [
		  {
			"basicCard": {
			  "title": "최근 대학 공지사항",
			  "description": result[0].title+"\n"+result[0].author+"\n"+result[0].rdate+"\n",
			  "thumbnail": {
				"imageUrl": "http://k.kakaocdn.net/dn/83BvP/bl20duRC1Q1/lj3JUcmrzC53YIjNDkqbWK/i_6piz1p.jpg"
			  },
			  "profile": {
				"imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4BJ9LU4Ikr_EvZLmijfcjzQKMRCJ2bO3A8SVKNuQ78zu2KOqM",
				"nickname": "공지사항"
			  },
			  "social": {
				"like": 1238,
				"comment": 8,
				"share": 780
			  },
			  "buttons": [
				{
				  "action":  "webLink",
				  "label": "확인하기",
				  "webLinkUrl": result[0].url
				}
			  ]
			}
		  }
		]
	  }
	};
	
 	console.log(responseBody);
  	res.status(200).send(responseBody);
	console.log("DebugLog :: ========================= end ShowNotice =========================");
});

apiRouter.post('/ShowNoticeAll', function(req, res) {
	console.log("DebugLog :: ========================= start ShowNoticeAll =========================");
	console.log(req.body);

	const responseBody = {
		  "version": "2.0",
		  "template": {
			"outputs": [
			  {
				"listCard": {
				  "header": {
					"title": "대학 공지사항"
				  },
				  "items": [
					{
					  "title": result[0].title,
					  "description": result[0].author+" / "+result[0].rdate,
					  "imageUrl": "http://k.kakaocdn.net/dn/APR96/btqqH7zLanY/kD5mIPX7TdD2NAxgP29cC0/1x1.jpg",
					  "link": {
						"web": result[0].url
					  }
					},
					{
					  "title":  result[1].title,
					  "description": result[1].author+" / "+result[1].rdate,
					  "imageUrl": "http://k.kakaocdn.net/dn/N4Epz/btqqHCfF5II/a3kMRckYml1NLPEo7nqTmK/1x1.jpg",
					  "link": {
						"web": result[1].url
					  }
					},
					{
					  "title": result[2].title,
					  "description": result[2].author+" / "+result[2].rdate,
					  "imageUrl": "http://k.kakaocdn.net/dn/bE8AKO/btqqFHI6vDQ/mWZGNbLIOlTv3oVF1gzXKK/1x1.jpg",
					  "link": {
						"web": result[2].url
					  }
					},
					{
					  "title": result[3].title,
					  "description": result[3].author+" / "+result[3].rdate,
					  "imageUrl": "http://k.kakaocdn.net/dn/bE8AKO/btqqFHI6vDQ/mWZGNbLIOlTv3oVF1gzXKK/1x1.jpg",
					  "link": {
						"web": result[3].url
					  }
					},
					{
					  "title": result[4].title,
					  "description": result[4].author+" / "+result[4].rdate,
					  "imageUrl": "http://k.kakaocdn.net/dn/bE8AKO/btqqFHI6vDQ/mWZGNbLIOlTv3oVF1gzXKK/1x1.jpg",
					  "link": {
						"web": result[4].url
					  }
					}
				  ],
				  "buttons": [
					{
					  "label": "확인하기",
					  "action": "webLink",
					  "webLinkUrl": "http://www.dongseo.ac.kr/kr/index.php?pCode=MN2000191"
					}
				  ]
				}
			  }
			]
		  }
		};
	
 	console.log(responseBody);
  	res.status(200).send(responseBody);
	console.log("DebugLog :: ========================= end ShowNoticeAll =========================");
});


app.listen(3000, function() {
  	console.log('Example skill server listening on port 3000!')});
