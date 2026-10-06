/* 화면 동작 코드 — 보통 수정할 필요 없어요. 내용은 전부 js/data.js 에서 수정하세요. */
const $ = id => document.getElementById(id);
const esc = s => String(s ?? "").replace(/[&<>"']/g, m => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
const digits = n => String(n).replace(/[^\d+]/g, "");
const isMobile = () => /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
const openUrl = u => SETTINGS.newWindow ? window.open(u, "_blank", "noopener") : (location.href = u);
const kakao = (SITE.sns || []).find(s => /카카오|kakao/i.test(s.label));
const blank = SETTINGS.newWindow ? ' target="_blank" rel="noopener noreferrer"' : "";
const sites = () => SITES.filter(s => !s.hidden);
const regions = () => REGIONS.filter(r => !SETTINGS.hideEmptyRegions || sites().some(s => s.region === r.key));
const IC = {
  phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>',
  sms: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  kakao: '<path fill="currentColor" stroke="none" d="M12 3C6.5 3 2 6.6 2 11c0 2.8 1.8 5.3 4.6 6.7l-1 3.6c-.1.3.2.5.5.3l4.2-2.8c.6.1 1.1.1 1.7.1 5.5 0 10-3.6 10-8S17.5 3 12 3z"/>',
  go: '<path d="M7 17 17 7M8 7h9v9"/>'
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
  document.title = SITE.name;
  const lines = esc(SITE.lead).split("\n");
  const sns = (SITE.sns || []).map((s, i) => `<a href="${esc(s.web)}" data-sns="${i}" title="${esc(s.label)}"><img src="${esc(s.icon)}" alt="${esc(s.label)}" style="background:${esc(s.color || "#fff")}"></a>`).join("");
  $("side").innerHTML = `
    <div class="avatar"><img src="${esc(SITE.logo)}" alt="${esc(SITE.name)} 로고"></div>
    <div class="brand">${esc(SITE.name)}</div>
    <h1 class="name"><span class="wipe" style="--d:1">${esc(SITE.manager)}<small>${esc(SITE.title)}</small></span></h1>
    <p class="lead">${lines.map((l, i) => `<span class="wipe" style="--d:${i + 2}">${l}</span>`).join("<br>")}</p>
    <div class="contact">
      <a class="cbtn gold rip shine" href="tel:${digits(SITE.phone)}">${ico("phone")}전화 상담<small>${esc(SITE.phone)}</small></a>
      <a class="cbtn rip" href="sms:${digits(SITE.phone)}">${ico("sms")}문자</a>
      ${kakao ? `<a class="cbtn rip" href="${esc(kakao.web)}" target="_blank" rel="noopener">${ico("kakao")}카카오톡</a>` : ""}
    </div>
    ${sns ? `<div class="sns">${sns}</div>` : ""}`;

  const rs = regions(), all = sites();
  $("bar").innerHTML = `<div><h2>분양 현장 <em>둘러보기</em></h2>
    <div class="tabs" id="tabs"><div class="ind" id="ind"></div>
      ${[`<button class="tab on rip" data-r="all">전체<span class="n">${all.length}</span></button>`]
        .concat(rs.map(r => `<button class="tab rip" data-r="${esc(r.key)}">${esc(r.label)}<span class="n">${all.filter(s => s.region === r.key).length}</span></button>`)).join("")}
    </div></div>`;
  $("grid").innerHTML = all.length ? all.map(cardHTML).join("") : `<div class="empty">등록된 현장이 아직 없어요.</div>`;
  $("footer").innerHTML = `${esc(SITE.footer || "")}<br>© ${new Date().getFullYear()} ${esc(SITE.name)}`;
  $("dock").innerHTML = `<a href="sms:${digits(SITE.phone)}">${ico("sms")}문자</a>${kakao ? `<a href="${esc(kakao.web)}" target="_blank" rel="noopener">${ico("kakao")}카톡</a>` : ""}<a class="t" href="tel:${digits(SITE.phone)}">${ico("phone")}전화</a>`;
  setTimeout(() => $("dock").classList.add("show"), 900);

  document.querySelectorAll("[data-sns]").forEach(a => a.addEventListener("click", e => openSns(e, SITE.sns[+a.dataset.sns])));

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

if ("scrollRestoration" in history) history.scrollRestoration = "manual";
document.addEventListener("DOMContentLoaded", render);
