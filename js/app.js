/* 화면 동작 코드 — 보통 수정할 필요 없어요. 내용은 전부 js/data.js 에서 수정하세요. */
const $ = id => document.getElementById(id);
const esc = s => String(s ?? "").replace(/[&<>"']/g, m => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
const digits = n => String(n).replace(/[^\d+]/g, "");
const isMobile = () => /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
const openUrl = u => SETTINGS.newWindow ? window.open(u, "_blank", "noopener") : (location.href = u);
const snsList = SITE.sns || [];
const youtube = snsList.find(s => /youtube|유튜브/i.test(s.label));
const kakao = snsList.find(s => /카카오|kakao/i.test(s.label));
const insta = snsList.find(s => /insta|인스타/i.test(s.label));
const blank = SETTINGS.newWindow ? ' target="_blank" rel="noopener noreferrer"' : "";
const sites = () => SITES.filter(s => !s.hidden);
const regions = () => REGIONS.filter(r => !SETTINGS.hideEmptyRegions || sites().some(s => s.region === r.key));
const IC = {
  phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>',
  sms: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  kakao: '<path fill="currentColor" stroke="none" d="M12 3C6.5 3 2 6.6 2 11c0 2.8 1.8 5.3 4.6 6.7l-1 3.6c-.1.3.2.5.5.3l4.2-2.8c.6.1 1.1.1 1.7.1 5.5 0 10-3.6 10-8S17.5 3 12 3z"/>',
  go: '<path d="M7 17 17 7M8 7h9v9"/>',
  play: '<path fill="currentColor" stroke="none" d="M8 5v14l11-7z"/>',
  insta: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none"/>',
  yt: '<rect x="2" y="5" width="20" height="14" rx="4.5"/><path fill="currentColor" stroke="none" d="M10 9v6l5-3z"/>'
};
const ico = n => `<svg class="i" viewBox="0 0 24 24" aria-hidden="true">${IC[n]}</svg>`;
let current = "all";

function openSns(e, s){
  e.preventDefault();
  if (!isMobile() || !s.app) return void window.open(s.web, "_blank", "noopener");
  let left = false; const f = () => { if (document.hidden) left = true; };
  document.addEventListener("visibilitychange", f);
  location.href = s.app;
  setTimeout(() => { document.removeEventListener("visibilitychange", f); if (!left) location.href = s.web; }, 600);
}

function cardHTML(s){
  const rg = (REGIONS.find(r => r.key === s.region) || {}).label || "";
  const badge = s.status ? `<span class="badge" style="background:${esc(STATUS_COLORS[s.status] || "#334155")}">${esc(s.status)}</span>` : "";
  const rows = FIELDS.filter(([k]) => s[k]).map(([k, l]) => `<div class="row"><dt>${esc(l)}</dt><dd>${esc(s[k])}</dd></div>`).join("");
  return `
    <article class="card${SETTINGS.cardClickable ? " click" : ""}" data-r="${esc(s.region)}" data-url="${esc(s.url)}">
      <div class="img">${s.cover ? `<img src="${esc(s.cover)}" alt="" loading="lazy" decoding="async">` : ""}
        ${badge}${s.sample ? `<span class="sample">SAMPLE</span>` : ""}
        <span class="reg">${esc(rg)}</span>
        ${s.logo ? `<span class="logo"><img src="${esc(s.logo)}" alt="${esc(s.name)} 로고" loading="lazy"></span>` : ""}
      </div>
      <div class="body"><h3>${esc(s.name)}</h3><dl>${rows}</dl></div>
      <div class="acts">
        <a class="go rip shine" href="${esc(s.url)}"${blank}>홈페이지 바로가기 ${ico("go")}</a>
        <a class="tl rip" href="tel:${digits(s.phone || SITE.phone)}" title="전화 상담">${ico("phone")}</a>
      </div>
    </article>`;
}

function render(){
  document.title = SITE.name + (SITE.manager ? " · " + SITE.manager + " " + (SITE.title || "") : "");
  const lines = esc(SITE.lead).split("\n");

  $("side").innerHTML = `
    <img class="logo-main" src="${esc(SITE.banner)}" alt="${esc(SITE.name)}">
    <div class="brand">분양 상담</div>
    <h1 class="name"><span class="wipe" style="--d:1">${esc(SITE.name)}${SITE.manager ? `<small>${esc(SITE.manager)} ${esc(SITE.title || "")}</small>` : ""}</span></h1>
    <p class="lead">${lines.map((l, i) => `<span class="wipe" style="--d:${i + 2}">${l}</span>`).join("<br>")}</p>
    <div class="contact">
      <a class="cbtn tel rip shine" href="tel:${digits(SITE.phone)}">${ico("phone")}전화 상담<small>${esc(SITE.phone)}</small></a>
      <div class="row3">
        ${kakao ? `<a class="sbtn kk rip" href="${esc(kakao.web)}" target="_blank" rel="noopener">${ico("kakao")}<span>카카오톡</span></a>` : ""}
        ${insta ? `<a class="sbtn ig rip" href="${esc(insta.web)}" data-sns="${snsList.indexOf(insta)}" target="_blank" rel="noopener">${ico("insta")}<span>인스타</span></a>` : ""}
        ${youtube ? `<a class="sbtn yt rip" href="${esc(youtube.web)}" data-sns="${snsList.indexOf(youtube)}" target="_blank" rel="noopener">${ico("yt")}<span>유튜브</span></a>` : ""}
      </div>
    </div>`;

  const rs = regions(), all = sites();
  $("bar").innerHTML = `<h2>분양 현장 <em>둘러보기</em></h2>${SITE.slogan ? `<p class="sl">${esc(SITE.slogan)}</p>` : ""}
    <div class="tabs" id="tabs"><div class="ind" id="ind"></div>
      ${[`<button class="tab on rip" data-r="all">전체<span class="n">${all.length}</span></button>`]
        .concat(rs.map(r => `<button class="tab rip" data-r="${esc(r.key)}">${esc(r.label)}<span class="n">${all.filter(s => s.region === r.key).length}</span></button>`)).join("")}
    </div>`;
  $("grid").innerHTML = all.length ? all.map(cardHTML).join("") : `<div class="empty">등록된 현장이 아직 없어요.</div>`;
  $("footer").innerHTML = `${SITE.wide ? `<img src="${esc(SITE.wide)}" alt="${esc(SITE.name)}">` : ""}${esc(SITE.footer || "")}<br>© ${new Date().getFullYear()} ${esc(SITE.name)}${SITE.company ? " · " + esc(SITE.company) : ""}`;
  $("dock").innerHTML = `${youtube ? `<a class="y" href="${esc(youtube.web)}" data-sns="${snsList.indexOf(youtube)}">${ico("play")}쇼츠</a>` : ""}${kakao ? `<a href="${esc(kakao.web)}" target="_blank" rel="noopener">${ico("kakao")}카톡</a>` : ""}<a class="t" href="tel:${digits(SITE.phone)}">${ico("phone")}전화</a>`;
  setTimeout(() => $("dock").classList.add("show"), 900);

  document.querySelectorAll("[data-sns]").forEach(a => a.addEventListener("click", e => openSns(e, snsList[+a.dataset.sns])));

  const io = "IntersectionObserver" in window ? new IntersectionObserver(es => es.forEach(en => {
    if (en.isIntersecting){ en.target.classList.add("in"); io.unobserve(en.target); }
  }), { threshold: .12 }) : null;
  const reveal = () => document.querySelectorAll(".card").forEach(c => io ? io.observe(c) : c.classList.add("in"));
  reveal();

  $("tabs").addEventListener("click", e => {
    const b = e.target.closest(".tab"); if (!b || b.dataset.r === current) return;
    current = b.dataset.r;
    document.querySelectorAll(".tab").forEach(t => t.classList.toggle("on", t === b));
    moveInd();
    document.querySelectorAll(".card").forEach(c => {
      c.classList.remove("in");
      c.style.display = (current === "all" || c.dataset.r === current) ? "" : "none";
    });
    setTimeout(reveal, 60);
  });

  if (SETTINGS.cardClickable) $("grid").addEventListener("click", e => {
    if (e.target.closest("a")) return;
    const c = e.target.closest(".card"); if (c) openUrl(c.dataset.url);
  });

  document.addEventListener("pointerdown", e => {
    const b = e.target.closest(".rip"); if (!b) return;
    const r = b.getBoundingClientRect(), d = Math.max(r.width, r.height), w = document.createElement("span");
    w.className = "wave"; w.style.cssText = `width:${d}px;height:${d}px;left:${e.clientX - r.left - d / 2}px;top:${e.clientY - r.top - d / 2}px`;
    b.appendChild(w); setTimeout(() => w.remove(), 700);
  });
  moveInd(); window.addEventListener("resize", moveInd);
}

function moveInd(){
  const on = document.querySelector(".tab.on"), ind = $("ind");
  if (on && ind){ ind.style.width = on.offsetWidth + "px"; ind.style.transform = `translateX(${on.offsetLeft}px)`; }
}


/* ---------- 구글 시트에서 현장 불러오기 (SHEET_CSV_URL 이 있을 때만) ---------- */
function parseCSV(t){
  const rows=[]; let r=[],c="",q=false;
  t=t.replace(/^\uFEFF/,"");
  for(let i=0;i<t.length;i++){
    const ch=t[i];
    if(q){ if(ch==='"'){ if(t[i+1]==='"'){c+='"';i++} else q=false } else c+=ch }
    else if(ch==='"') q=true;
    else if(ch===","){ r.push(c); c="" }
    else if(ch==="\n"||ch==="\r"){ if(ch==="\r"&&t[i+1]==="\n") i++; r.push(c); c=""; rows.push(r); r=[] }
    else c+=ch;
  }
  if(c!==""||r.length){ r.push(c); rows.push(r) }
  return rows.filter(x=>x.some(v=>v.trim()));
}
const HEAD={"지역":"region","현장명":"name","이름":"name","홈페이지":"url","주소(링크)":"url","상태":"status","주소":"addr","현장주소":"addr","규모":"scale","타입":"types","분양가":"price","입주":"move","전화":"phone","로고":"logo","이미지":"cover","숨김":"hidden"};
const imgPath=v=>{v=(v||"").trim(); if(!v) return ""; return (/^(https?:|data:|\/|img\/)/.test(v)) ? v : "img/"+v};
function rowsToSites(rows){
  const head=rows[0].map(h=>HEAD[h.trim()]||"");
  const out=[];
  rows.slice(1).forEach(r=>{
    const o={}; head.forEach((k,i)=>{ if(k) o[k]=(r[i]||"").trim() });
    if(!o.name||!o.url) return;
    const rg=REGIONS.find(x=>x.label===o.region||x.key===o.region); o.region=rg?rg.key:(o.region||"local");
    o.hidden=/^(o|y|yes|true|숨김|x|1)$/i.test(o.hidden||"");
    o.logo=imgPath(o.logo); o.cover=imgPath(o.cover);
    if(!/^https?:\/\//i.test(o.url)) o.url="https://"+o.url;
    out.push(o);
  });
  return out;
}
async function loadSheet(){
  if(typeof SHEET_CSV_URL==="undefined"||!SHEET_CSV_URL) return;
  const KEY="sheet-cache-v1"; let list=null;
  try{
    const ctl=new AbortController(), tm=setTimeout(()=>ctl.abort(),6000);
    const res=await fetch(SHEET_CSV_URL,{signal:ctl.signal,cache:"no-store"}); clearTimeout(tm);
    if(!res.ok) throw new Error(res.status);
    list=rowsToSites(parseCSV(await res.text()));
    if(list.length){ try{localStorage.setItem(KEY,JSON.stringify(list))}catch(_){} }
  }catch(e){
    try{ list=JSON.parse(localStorage.getItem(KEY)||"null") }catch(_){}
  }
  if(list&&list.length){ SITES.length=0; SITES.push(...list); }
}

if ("scrollRestoration" in history) history.scrollRestoration = "manual";
document.addEventListener("DOMContentLoaded", async () => { await loadSheet(); render(); });
