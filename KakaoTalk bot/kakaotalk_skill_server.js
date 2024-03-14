
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
