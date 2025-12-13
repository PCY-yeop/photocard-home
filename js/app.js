// ============================
// 1) SNS: 모바일은 앱 우선, PC는 웹
// ============================
function isMobile(){
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function openYouTube(e){
  e.preventDefault();
  const webUrl = "https://www.youtube.com/@roadzip/shorts";
  if(isMobile()){
    window.location = "youtube://www.youtube.com/@roadzip/shorts";
    setTimeout(()=>{ window.location = webUrl; }, 400);
  } else {
    window.open(webUrl, "_blank");
  }
}

function openInstagram(e){
  e.preventDefault();
  const webUrl = "https://www.instagram.com/ziproad9/";
  if(isMobile()){
    window.location = "instagram://user?username=ziproad9";
    setTimeout(()=>{ window.location = webUrl; }, 400);
  } else {
    window.open(webUrl, "_blank");
  }
}

// ============================
// 2) 현장 데이터(여기만 수정하면 됨)
// ============================
const DATA = {
  seoul: {
    title: "서울",
    subtitle: "서울 현장",
    sites: [
        {
            name: "보라매 파르크힐",
            addr: "서울특별시 동작구 신대방동 344-78번지 일원",
            scale: "총 768세대 지하 3층 ~ 지상 22층 / 7개동",
            types: "59㎡, 84㎡",
            url: "https://potocard-borame.vercel.app/",
            logo: "img/log2.png",
            cover: "img/visual-bg-02.png"
        },
        {
            name: "여의대방 더 마크원",
            addr: "서울특별시 영등포구 신길동 459-5번지 일대",
            scale: "총 1,228세대 지하 4층 ~ 지상 42층 / 6개동",
            types: "59㎡, 84㎡",
            url: "https://markone-c.vercel.app/",
            logo: "img/log1.png",
            cover: "img/visual-bg-01.png"
        }
    ]
  },

  incheon: {
    title: "인천",
    subtitle: "인천 현장",
    sites: [
        {
            name: "두산위브 더센트럴도화",
            addr: "인천 미추홀구 도화동 53-28",
            scale: "총 660세대 지하 2층 ~ 지상 39층 / 7개동",
            types: "59㎡, 74㎡, 84㎡",
            url: "https://potocard-doosan.vercel.app/",
            logo: "img/log3.png",
            cover: "img/visual-bg-03.jpg"
          },
        {
            name: "검단 센트레빌 에듀시티",
            addr: "인천시 서구 당하동 593번지 일원",
            scale: "총 1,534세대 지하 2층 ~ 지상 25층 / 17개동",
            types: "74㎡, 84㎡, 101㎡, 120㎡",
            url: "https://photocard-geomdan.vercel.app/",
            logo: "img/log4.png",
            cover: "img/visual-bg-04.png"
          }              
        ]
          },

  gyeonggi: {
    title: "경기도",
    subtitle: "경기도 현장",
    sites: [
      // { name:"", addr:"", scale:"", types:"", url:"https://...", logo:"img/...", cover:"img/..." }
    ]
  },

  local: {
    title: "지방",
    subtitle: "지방 현장",
    sites: [
      // { name:"", addr:"", scale:"", types:"", url:"https://...", logo:"img/...", cover:"img/..." }
    ]
  }
};

// ============================
// 3) 렌더링 + 지역 필터(탭)
// ============================
function esc(s){
  return String(s ?? "").replace(/[&<>"']/g, m => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[m]));
}

function siteCardHTML(site){
  const coverStyle = site.cover
    ? `style="background-image:url('${esc(site.cover)}');background-size:cover;background-position:center;"`
    : "";

  const logoHTML = site.logo
    ? `<img src="${esc(site.logo)}" alt="${esc(site.name)} 로고">`
    : `<span style="font-weight:900;color:#0f172a;">Z</span>`;

  return `
    <article class="site-card" data-reveal data-region-item>
      <div class="site-card-top">
        <div class="cover-site" ${coverStyle}></div>
        <div class="site-logo">${logoHTML}</div>
      </div>

      <div class="site-card-body">
        <h3 class="site-name-a">${esc(site.name)}</h3>

        <div class="site-meta">
          <div class="meta-row">
            <span class="meta-label">현장</span>
            <span class="meta-value">${esc(site.addr)}</span>
          </div>
          <div class="meta-row">
            <span class="meta-label">규모</span>
            <span class="meta-value">${esc(site.scale)}</span>
          </div>
          <div class="meta-row">
            <span class="meta-label">타입</span>
            <span class="meta-value">${esc(site.types)}</span>
          </div>
        </div>
      </div>

      <div class="site-card-bottom">
        <a class="phone-cta" href="${esc(site.url)}" target="_blank" rel="noopener noreferrer" title="홈페이지 바로가기">
          <p>홈페이지 바로가기</p>
        </a>
      </div>
    </article>
  `;
}

function regionSectionHTML(key, region){
  const cards = (region.sites || []).length
    ? region.sites.map(siteCardHTML).join("")
    : `<div class="panel" style="padding:14px;text-align:center;color:#666;">등록된 현장이 아직 없어요.</div>`;

  return `
    <section class="region" data-region-section="${esc(key)}">
      <div class="region-head">
        <h2 class="region-title">${esc(region.title)}</h2>
        <p class="region-sub">${esc(region.subtitle)}</p>
      </div>
      <div class="site-grid">
        ${cards}
      </div>
    </section>
  `;
}

function renderAll(){
  const wrap = document.getElementById("regions");
  if(!wrap) return;

  wrap.innerHTML =
    regionSectionHTML("seoul", DATA.seoul) +
    regionSectionHTML("incheon", DATA.incheon) +
    regionSectionHTML("gyeonggi", DATA.gyeonggi) +
    regionSectionHTML("local", DATA.local);
}

function applyFilter(regionKey){
  const sections = document.querySelectorAll("[data-region-section]");
  sections.forEach(sec => {
    const key = sec.getAttribute("data-region-section");
    sec.style.display = (regionKey === "all" || regionKey === key) ? "" : "none";
  });

  // 필터 바꿀 때 상단으로 살짝 올려주기(모바일에서 편함)
  const top = document.querySelector(".region-tabs");
  if(top) top.scrollIntoView({behavior:"smooth", block:"start"});
}

function setupTabs(){
  const tabs = document.querySelectorAll(".tab-btn");
  tabs.forEach(btn => {
    btn.addEventListener("click", () => {
      tabs.forEach(b => b.classList.toggle("active", b === btn));
      applyFilter(btn.dataset.region);
    });
  });
}

// ============================
// 4) Reveal + 하단바
// ============================
function setupReveal(){
  const items = document.querySelectorAll('[data-reveal]');
  if (!('IntersectionObserver' in window) || items.length === 0){
    items.forEach(el => el.classList.add('revealed'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('revealed');
        if(entry.target.hasAttribute('data-reveal-once')) io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  items.forEach(el => io.observe(el));
}

document.addEventListener("DOMContentLoaded", () => {
  renderAll();
  setupTabs();

  // 기본: 전체
  applyFilter("all");

  setupReveal();

  // 모바일 하단바 페이드 인
  const mobileCta = document.querySelector('.mobile-cta');
  if(mobileCta){ setTimeout(()=> mobileCta.classList.add('show'), 200); }

  // 메인(#main) 스무스
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if(!a) return;
    const id = a.getAttribute('href');
    if(id.length > 1){
      const target = document.querySelector(id);
      if(target){
        e.preventDefault();
        target.scrollIntoView({behavior:'smooth', block:'start'});
      }
    }
  });
});
