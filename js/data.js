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
  name:    "Ziproad",
  logo:    "img/log.png",                 // 동그란 로고
  cover:   "img/visual-bg-0.png",         // 명함 상단 배경 이미지
  manager: "박찬엽",
  title:   "부장",
  lead:    "모델하우스 안내 및 분양 상담\n박찬엽 부장입니다.",   // \n = 줄바꿈
  phone:   "010-2284-4859",        // 전화 + 하단 문자보내기 버튼에 같이 사용
  footer:  "아래 지역 탭에서 현장을 선택해 주세요.",

  // SNS 아이콘 (지우면 아이콘도 사라져요 / 모바일은 앱 우선 실행)
  sns: [
    {
      label: "YouTube",
      icon:  "https://cdn-icons-png.flaticon.com/512/1384/1384060.png",
      color: "linear-gradient(45deg,#ffffff,#ff0000,#ffffff)",
      web:   "https://www.youtube.com/@roadzip/shorts",
      app:   "youtube://www.youtube.com/@roadzip/shorts"
    },
    {
      label: "Instagram",
      icon:  "https://cdn-icons-png.flaticon.com/512/2111/2111463.png",
      color: "linear-gradient(45deg,#feda75,#fa7e1e,#d62976,#962fbf,#4f5bd5)",
      web:   "https://www.instagram.com/ziproad9/",
      app:   "instagram://user?username=ziproad9"
    },
    {
      label: "카카오톡",
      icon:  "img/kakao.png",
      color: "#FEE500",
      web:   "https://pf.kakao.com/_여기에채널ID"   // ← ✏️ 내 카카오톡 채널(또는 오픈채팅) 주소로 바꿔주세요
    }
  ]
};


/* ---------------------------------------------------------------
   2) 기능 설정  (true = 켜기 / false = 끄기)
   --------------------------------------------------------------- */
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

   ▶ sample: true  → 카드에 'SAMPLE' 리본이 표시돼요. 내용을 실제로 고쳤으면 이 줄을 지우세요.

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
