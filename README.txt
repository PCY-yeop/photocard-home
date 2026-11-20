==== 수정 방법 ====
모든 수정은 js/data.js 한 파일에서 합니다. (index.html / css / app.js 는 건드릴 필요 없음)

[현장 수정]    SITES 안 블록의 값만 바꾸기 
[이미지 교체]  img/ 폴더에 넣고 cover: "img/파일명.jpg" (가로 1200 x 750 권장, 500KB 이하)
[현장 추가]    블록 복사 → 붙여넣기 / 숨기기: hidden: true,
[로고/슬로건]  data.js 위쪽 SITE 의 banner / wide / logo / slogan
[전화·유튜브·카카오톡 주소]  data.js 위쪽 SITE (카카오톡 주소는 꼭 바꿔주세요)
[색상]         css/style.css 맨 위 :root 변수 (--navy, --blue, --accent(노랑), --red)

[구글 시트로 현장 관리]  README-시트연동.txt 참고 (js/data.js 의 SHEET_CSV_URL 에 주소만 넣으면 됨)
