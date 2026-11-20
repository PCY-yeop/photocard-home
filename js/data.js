/* =====================================================================
   ✏️  여기만 수정하면 됩니다!  (index.html / app.js / style.css 는 건드릴 필요 없어요)

   1) SITE      : 내 명함 정보 (이름, 전화번호, SNS 등)
   2) SETTINGS  : 기능 켜기/끄기
   3) REGIONS   : 지역 탭 (순서 = 탭 순서)
   4) SITES     : 현장 목록  ← 가장 자주 수정하는 곳
   ===================================================================== */


/* ---------------------------------------------------------------
   1) 내 명함 정보
   --------------------------------------------------------------- */
const SITE = {
  name:    "내집쇼츠",                     // 유튜브 채널 이름 (탭 제목에 표시)
  company: "Ziproad",                       // 하단에 작게 표시되는 이름 (지우면 안 보여요)
  logo:    "img/logo-circle.png",           // 동그란 로고 (파비콘/공유 이미지용)
  banner:  "img/logo-stack.png",            // 메인 큰 로고 (집 모양 세로형)
  wide:    "img/logo-wide.png",             // 가로형 로고 (하단에 사용)
  slogan:  "오늘도 새로운 분양 소식!",        // 흐르는 띠 문구
  manager: "",                     // 담당자 이름 (비워두면 안 보임 / 쓰면 채널명 옆에 작게 표시)
  title:   "",                     // 직함 (예: 부장)
  lead:    "모델하우스 안내 및 분양 상담\n내집쇼츠입니다.",   // \n = 줄바꿈
  phone:   "1800-6988",        // 전화 버튼에 사용
  footer:  "아래 지역 탭에서 현장을 선택해 주세요.",

  // SNS 아이콘 (지우면 아이콘도 사라져요 / 모바일은 앱 우선 실행)
  sns: [
    {
      label: "카카오톡",
      web:   "https://pf.kakao.com/_mRxlvX/friend"
    },
    {
      label: "Instagram",
      web:   "https://www.instagram.com/myhome_shorts/",
      app:   "instagram://user?username=myhome_shorts"   // 모바일에서 인스타 앱으로 바로 열려요
    },
    {
      label: "YouTube",
      web:   "https://www.youtube.com/@%EB%82%B4%EC%A7%91%EC%87%BC%EC%B8%A0/shorts",
      app:   "youtube://www.youtube.com/@%EB%82%B4%EC%A7%91%EC%87%BC%EC%B8%A0/shorts"
    }
  ]
};


/* ---------------------------------------------------------------
   2) 기능 설정  (true = 켜기 / false = 끄기)
   --------------------------------------------------------------- */
/* 구글 시트 연동: 아래 따옴표 안에 '웹에 게시한 CSV 주소'를 붙여넣으면
   현장 목록을 구글 시트에서 불러와요. (README-시트연동.txt 참고)
   비워두면(""), 아래 4) SITES 목록을 그대로 사용해요. 시트가 안 불러와져도 SITES 가 대신 나와요. */
const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSHk1tNac6Qn5m5ViJsjfLTABMUMoQBrgDwqbJzNgGsWPeVxlZJ8tZS7FSB7_DKwc_Unvyn_ZB3Yp55/pub?gid=1100084316&single=true&output=csv";

const SETTINGS = {
  hideEmptyRegions: true,   // 현장이 0개인 지역은 탭/섹션 자동 숨김
  cardClickable:    true,   // 카드 아무 곳이나 눌러도 홈페이지로 이동
  newWindow:        true    // true = 새 창, false = 현재 창
};


/* ---------------------------------------------------------------
   3) 지역 탭  (key 는 아래 SITES 의 region 과 똑같이 써야 해요)
   --------------------------------------------------------------- */
const REGIONS = [
  { key: "seoul",    label: "서울"   },
  { key: "incheon",  label: "인천"   },
  { key: "gyeonggi", label: "경기도" },
  { key: "local",    label: "지방"   }
];


/* ---------------------------------------------------------------
   카드에 표시할 항목 (카드 안 줄 순서)
   - 현장에 해당 값이 없으면 그 줄은 자동으로 안 보여요
   - 항목을 늘리고 싶으면 한 줄 추가: ["필드이름", "화면에 보일 라벨"]
   --------------------------------------------------------------- */
const FIELDS = [
  ["addr",  "현장"],
  ["scale", "규모"],
  ["types", "타입"],
  ["price", "분양가"],
  ["move",  "입주"]
];

/* 상태 배지 색상 (SITES 의 status 값과 똑같은 글자로 쓰면 적용돼요) */
const STATUS_COLORS = {
  "분양중":   "#16a34a",
  "분양예정": "#2563eb",
  "마감임박": "#dc2626",
  "마감":     "#6b7280"
};


/* ---------------------------------------------------------------
   4) 현장 목록
   ---------------------------------------------------------------
   ▶ 새 현장 추가: 아래 { ... }, 블록 하나를 통째로 복사해서 붙여넣고 값만 바꾸세요.
   ▶ 현장 잠시 숨기기: 블록 안에 hidden: true,  한 줄 추가 (삭제 안 해도 됨)
   ▶ 순서 바꾸기: 블록을 위/아래로 옮기면 화면 순서도 바뀝니다.
   ▶ 쉼표(,) 빼먹지 않게 주의! 마지막 항목 빼고는 항목 끝에 쉼표가 있어야 해요.

   [복사용 템플릿 - 필수는 name, region, url 3개뿐. 나머지는 비워도 됨]
   {
     region: "seoul",                 // 위 REGIONS 의 key
     name:   "현장 이름",
     url:    "https://...",           // 클릭하면 열릴 홈페이지
     status: "분양중",                // (선택) 분양중 / 분양예정 / 마감임박 / 마감
     addr:   "주소",
     scale:  "총 000세대 / 00개동",
     types:  "59㎡·84㎡",
     price:  "3억대~",                // (선택)
     move:   "2028년 5월 예정",       // (선택)
     phone:  "010-0000-0000",         // (선택) 현장 전용 번호. 비우면 내 번호 사용
     logo:   "img/log2.png",
     cover:  "img/visual-bg-01.jpg"
   },
   --------------------------------------------------------------- */
const SITES = [

  {
    region: "seoul",
    name:   "센트나인 등촌",
    url:    "https://www.xn----yd6eu8gh1fw3llxab5quoksrdb4sof157d.kr/",
    addr:   "서울시 강서구 등촌동 365-21일원",
    scale:  "총 962세대 지하 5층 ~ 지상 21층 / 18개동",
    types:  "49㎡·59㎡·84㎡",
    logo:   "img/log2.png",
    cover:  "img/visual-bg-01.jpg"
  },

  {
    region: "incheon",
    name:   "시티오씨엘 9단지",
    url:    "https://city9.quv.kr/",
    addr:   "용현·학익 1블록 도시개발사업 공동3BL",
    scale:  "총 1,949세대 지하 2층 ~ 지상 49층 / 9개동",
    types:  "59㎡·75㎡·84㎡·95㎡·101㎡·110㎡",
    logo:   "img/log3.png",
    cover:  "img/visual-bg-02.jpg"
  },

  {
    region: "gyeonggi",
    name:   "서동탄역 랜시티",
    url:    "https://sdtlancity.quv.kr/",
    addr:   "10년 장기 민간임대아파트",
    scale:  "약 1,500세대 지하 3층 ~ 지상 29층 / 14개동",
    types:  "59㎡·84㎡",
    logo:   "img/log4.png",
    cover:  "img/visual-bg-03.jpg"
  }

];
