var store = [{
        "title": "위대한 여정의 시작",
        "excerpt":"버튼을 누르다 “준비하시고… 쏘세요 !” 어디서 많이 들어본 말이죠 ? 이 멘트를 기억하고 계신분들이 있을 것 같은데요. 바로 제가 어릴적까지 발행하던 주택복권의 사회자 멘트입니다. 이 구령이 떨어지면, 사람들이 버튼을 눌러서 화살을 번호가 적힌 룰렛을 향해 발사합니다. 부푼 기대와 함께 복권을 손에 쥔 사람은 다트가 날아가는 찰나의 순간에 ‘혹시 내가 산...","categories": ["잡생각"],
        "tags": [],
        "url": "/%EC%9E%A1%EC%83%9D%EA%B0%81/%EC%9C%84%EB%8C%80%ED%95%9C-%EC%97%AC%EC%A0%95%EC%9D%98-%EC%8B%9C%EC%9E%91/",
        "teaser": "/assets/images/config/default_teaser.png"
      },{
        "title": "[postgresql] 트리거를 배워보자",
        "excerpt":"오늘은 업무를 진행하면서 배웠던 Trigger에 대해 정리해보고자 합니다. DB 는 Postgresql 13 버젼을 기준으로 기술하였습니다. Trigger (트리거) 란 ? 트리거는 대부분의 데이터베이스에서 이벤트에 의해 자동으로 응답하는 방법입니다. 데이터베이스 또는 특정 테이블에 연결되어 이벤트를 수신하면 특정 코드세트를 실행시킬 수 있습니다. 쉽게말해서 테이블에 어떤 행이 INSERT , UPDATE , DELETE 되는 순간...","categories": ["DB"],
        "tags": ["db","trigger","postgresql"],
        "url": "/db/Postgresql-%ED%8A%B8%EB%A6%AC%EA%B1%B0%EB%A5%BC-%EB%B0%B0%EC%9B%8C%EB%B3%B4%EC%9E%90/",
        "teaser": "/assets/images/config/default_teaser.png"
      },{
        "title": "[node.js] express 프레임워크 설치",
        "excerpt":"Express.js 프레임워크란 ? Node.js를 위한 웹 프레임워크의 하나로 자바스크립트 런타임 환경에서 웹 어플리케이션을 편하게 개발하기 위한 각종 라이브러리와 미들웨어들이 기본 내장되어 있고 프레임워크로서 개발 규칙을 강제하여 코드 구조를 간결하고 통일성있게 유지시켜주는 도구이다. (Express는 유연한 편이다.) Node.js 웹 프레임워크는 Express 말고도 Nest.js, Hapi.js, Sails.js, Koa.js, Meteor.js 등이 있지만 사실상 Node.js의 웹...","categories": ["Node.js"],
        "tags": ["Node.js","express"],
        "url": "/node.js/Node.js-Express-%ED%94%84%EB%A0%88%EC%9E%84%EC%9B%8C%ED%81%AC-%EC%84%A4%EC%B9%98/",
        "teaser": "/assets/images/config/default_teaser.png"
      },{
        "title": "메타버스에 대한 생각",
        "excerpt":"오늘은 요즘 유행하는(?) 신조어인 메타버스에 대해 생각해보았다. 생각하게 된 계기는 부모님과 뉴스를 보던 중 코로나가 우리 생활을 과연 어디까지 바꿀 것인지에 대해 얘기를 나누면서다. 먼저 메타버스(metaverse)란 위키백과에서 설명하기를 메타버스(metaverse) 또는 확장 가상 세계는 가상, 초월 의미인 ‘메타’(meta)와 세계, 우주 의미인 ‘유니버스’(universe)를 합성한 신조어다.[1] ‘가상 우주’라고 번역하기도 했다. 이는 3차원에서 실제...","categories": ["잡생각"],
        "tags": [],
        "url": "/%EC%9E%A1%EC%83%9D%EA%B0%81/%EB%A9%94%ED%83%80%EB%B2%84%EC%8A%A4%EC%97%90-%EB%8C%80%ED%95%9C-%EC%83%9D%EA%B0%81/",
        "teaser": "/assets/images/config/default_teaser.png"
      },{
        "title": "[node.js] express 프레임워크의 미들웨어",
        "excerpt":"미들웨어란 ? 익스프레스는 가볍고 유연한 웹 프레임워크인데, 이 것은 미들웨어 구조 덕분에 가능한 것이다. 미들웨어는 어플리케이션의 호출과 응답 사이, 즉 중간(middle)에 위치해 요청을 처리하기 때문에 미들웨어라고 한다. 미들웨어는 req, res, next를 매개변수로 가진 함수이다. req, res에 접근해 요청과 응답을 조작할 수 있으며, next() 함수로 다음 미들웨어로 넘어가는 방식이다. 미들웨어 사용법...","categories": ["Node.js"],
        "tags": ["Node.js","express"],
        "url": "/node.js/Node.js-Express-%ED%94%84%EB%A0%88%EC%9E%84%EC%9B%8C%ED%81%AC%EC%9D%98-%EB%AF%B8%EB%93%A4%EC%9B%A8%EC%96%B4/",
        "teaser": "/assets/images/config/default_teaser.png"
      },{
        "title": "[node.js] express 자주 사용하는 미들웨어",
        "excerpt":"오늘은 똑쟁이들이 만들어둔 미들웨어들과 간략한 사용법을 알아보자 ! dotenv 환경변수를 .env 파일에 정의하고 process.env로 로드할 수 있도록 도와주는 미들웨어다. cookie secret key 나 DB관련 정보같은 보안상 소스코드 상에 노출되면 안되는 정보는 .env라는 환경변수 파일에 저장되는데 선언한 환경변수를 런타임에서 로드할 수 있도록 해준다. 설치 user@myMacbook projectRoot % npm install dotenv .env...","categories": ["Node.js"],
        "tags": ["Node.js","express","middleware","dotenv","morgan","cookie-parser","json","urlencoded","extends","static"],
        "url": "/node.js/Node.js-Express-%EC%9E%90%EC%A3%BC-%EC%82%AC%EC%9A%A9%ED%95%98%EB%8A%94-%EB%AF%B8%EB%93%A4%EC%9B%A8%EC%96%B4/",
        "teaser": "/assets/images/config/default_teaser.png"
      },{
        "title": "[node.js] express router와 rest api 엔드포인트 네이밍 규칙",
        "excerpt":"Express의 endpoint path들을 구조적으로 관리하기 위한 Router를 알아보도록 하자. route : 길, Router : 길 찾는 놈. 아마 Router 를 배우기 전이라면 app.js 안에 수 없이 많은 api 가 존재할 것이다. end-point 의 종류도 다양할 것이고. 어느정도 규모가 큰 시스템(사실 그렇게 크지 않아도)에선 app.js의 코드행도 굉장히 길어질 것이고. 유지보수에도 난항을...","categories": ["Node.js"],
        "tags": ["Node.js","express","router","api","end-point"],
        "url": "/node.js/Node.js-Express-Router%EC%99%80-REST-API-%EC%97%94%EB%93%9C%ED%8F%AC%EC%9D%B8%ED%8A%B8-%EB%84%A4%EC%9D%B4%EB%B0%8D-%EA%B7%9C%EC%B9%99/",
        "teaser": "/assets/images/config/default_teaser.png"
      },{
        "title": "210907 일기",
        "excerpt":"아직 모르는게 산더미고 배워야할 것도 엄청 많은데. 진도가 잘 안나가는 것 같아 고민이다 ! 글을 하나 작성하는데 굉장히 긴 시간이 걸리는데, 요즘은 글을 잘 쓰기 위해 고민하는 시간이 학습하는 시간보다 많아질 것 같아 걱정이 된다. 하다보면 요령이 생기겠지 ? 그래도 블로그를 시작하기 전 까지는 모르는것을 찾을 때, 다른 블로그를 참고하거나...","categories": ["잡생각"],
        "tags": [],
        "url": "/%EC%9E%A1%EC%83%9D%EA%B0%81/210907-%EC%9D%BC%EA%B8%B0/",
        "teaser": "/assets/images/config/default_teaser.png"
      },{
        "title": "[node.js] sequelize(시퀄라이즈)를 사용해서 rdb와 통신하기",
        "excerpt":"Api 서버를 구축하고자 할 때 DB와의 연결은 필수적이라고 할 수 있다. 오늘은 시퀄라이즈 라이브러리를 사용해서 DB와 연결하고 CRUD 기능을 수행해보자. 시퀄라이즈 ? 다양한 RDB와 호환되는 ORM(Object Relational Mapping) 라이브러리. (ex. maria, postgre, sqlite, mssql .. ) Javascript 문법으로 RDB를 조작할 수 있도록 도와준다. Step 1 실행환경 세팅 (1) 먼저 DB가...","categories": ["Node.js"],
        "tags": ["Node.js","express","sequelize","db","api"],
        "url": "/node.js/node.js-sequelize(%EC%8B%9C%ED%80%84%EB%9D%BC%EC%9D%B4%EC%A6%88)%EB%A5%BC-%EC%82%AC%EC%9A%A9%ED%95%B4%EC%84%9C-RDB%EC%99%80-%ED%86%B5%EC%8B%A0%ED%95%98%EA%B8%B0/",
        "teaser": "/assets/images/config/default_teaser.png"
      }]
