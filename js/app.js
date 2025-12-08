
// 탭 스위칭
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.tab-buttons button');
  if(!btn) return;
  const tabs = btn.closest('.tabs');
  const id = btn.dataset.tab;
  tabs.querySelectorAll('.tab-buttons button').forEach(b => b.classList.toggle('active', b===btn));
  tabs.querySelectorAll('.tab-contents .pane').forEach(p => p.classList.toggle('active', p.dataset.pane===id));
});

// 스크롤 리빌
const io = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('revealed');
      io.unobserve(entry.target);
    }
  });
},{threshold:.12});
document.querySelectorAll('[data-reveal], .panel').forEach(el=>io.observe(el));

// 페럴랙스
const heroImg = document.querySelector('.parallax');
if(heroImg && window.matchMedia('(min-width: 821px)').matches){
  window.addEventListener('scroll', ()=>{
    const y = window.scrollY * 0.05;
    heroImg.style.transform = `translateY(${y}px)`;
  }, {passive:true});
}

// 모바일 하단바 페이드 인
const mobileCta = document.querySelector('.mobile-cta');
if(mobileCta){ setTimeout(()=> mobileCta.classList.add('show'), 200); }

// 앵커 스무스 스크롤
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

// 유튜브 인스타그램
function isMobile(){
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

/* Youtube */
function openYouTube(e){
  e.preventDefault();
  if(isMobile()){
    // 📱 모바일 → 앱 먼저 실행
    window.location = "youtube://www.youtube.com/@roadzip/shorts";
    setTimeout(()=>{ 
      window.location = "https://www.youtube.com/@roadzip/shorts"; 
    },400); // 앱 없을 때 웹 자동 이동
  } else {
    // 💻 PC → 웹으로 실행
    window.open("https://www.youtube.com/@roadzip/shorts", "_blank");
  }
}

/* Instagram */
function openInstagram(e){
  e.preventDefault();
  if(isMobile()){
    // 📱 모바일 → 앱 실행 우선
    window.location = "instagram://user?username=ziproad9";
    setTimeout(()=>{
      window.location = "https://www.instagram.com/ziproad9/";
    },400);
  } else {
    // 💻 PC → 웹으로 실행
    window.open("https://www.instagram.com/ziproad9/", "_blank");
  }
}


// 폼

  const MODE        = "phone";  // 또는 "phone"
  const SITE_NAME   = "마크원";
  const API_BASE    = "https://solapi-backend.onrender.com";
  const ADMIN_PHONE = "01022844859"; // 문자 수신자(to)

  document.addEventListener('DOMContentLoaded', function () {
    flatpickr('#visit-date', { locale: 'ko', dateFormat:'Y-m-d', defaultDate:new Date(), disableMobile:true });
  
    const timeWrap   = document.querySelector('.time-wrap');
    const dispInput  = document.getElementById('visit-time-display');
    const hiddenTime = document.getElementById('visit-time');
    const dd         = document.getElementById('time-dropdown');
  
    const showDD = ()=>{ dd.classList.add('open'); dispInput.setAttribute('aria-expanded','true'); };
    const hideDD = ()=>{ dd.classList.remove('open'); dispInput.setAttribute('aria-expanded','false'); };
    dispInput.addEventListener('click', e=>{ e.stopPropagation(); dd.classList.toggle('open'); });
    dd.addEventListener('click', e=>{
      const btn=e.target.closest('.slot'); if(!btn) return;
      dd.querySelectorAll('.slot').forEach(s=>s.removeAttribute('aria-selected'));
      btn.setAttribute('aria-selected','true');
      dispInput.value  = btn.textContent.trim();
      hiddenTime.value = btn.dataset.value;
      hideDD();
    });
    document.addEventListener('click', e=>{ if(!timeWrap.contains(e.target)) hideDD(); });
  
    const form      = document.getElementById('reservation');
    const submitBtn = document.getElementById('submitBtn');
    const checkbox  = document.querySelector('.form-contents-privacy-checkbox');
    const dateInput = document.getElementById('visit-date');
  
    const normalizePhone = v => (v||'').replace(/[^\d]/g,'');
    const sleep = ms => new Promise(r=>setTimeout(r,ms));
  
    checkbox.addEventListener('change', ()=> { submitBtn.disabled = !checkbox.checked; });
  
    form.addEventListener('submit', async e => {
      e.preventDefault();
      if(!checkbox.checked){ alert('개인정보 수집 및 이용에 동의해야 합니다.'); return; }
    
      const name    = form.elements.name.value.trim();
      const phone   = normalizePhone(form.elements.phone.value);
      const vd      = dateInput.value.trim();
      const vt      = hiddenTime.value.trim();
      const vtLabel = (document.getElementById('visit-time-display').value||'').trim();
    
      if(!name){ alert('성함을 입력해 주세요.'); return; }
      if(!(phone.length===10 || phone.length===11)){ alert('연락처를 정확히 입력해 주세요.'); return; }
      if(!vd){ alert('방문일을 선택해 주세요.'); return; }
      if(!vt){ alert('방문 시간을 선택해 주세요.'); return; }
    
      const payload = {
        site: SITE_NAME,
        vd,
        vtLabel,
        name,
        phone,                 // 고객 번호(본문만)
        adminPhone: ADMIN_PHONE, // 문자 수신 관리자 번호(to)
        memo: ''
      };
    
      submitBtn.disabled = true;
      const prev = submitBtn.textContent;
      submitBtn.textContent = '전송 중…';
    
      try {
        const res = await fetch(`${API_BASE}/sms`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      
        // ▶ 응답 처리 개선
        const txt = await res.text();
        let data = null;
        try { data = JSON.parse(txt); } catch { /* 비 JSON 응답 대비 */ }
      
        // 1) HTTP 상태 먼저 확인
        if (!res.ok) {
          throw new Error(`HTTP ${res.status} / ${txt.slice(0,200)}`);
        }
      
        // 2) 서버 JSON이 ok:false 면 실패로 처리
        if (data && data.ok === false) {
          const msg = data.error || JSON.stringify(data).slice(0,200);
          throw new Error(msg);
        }
      
        // 3) JSON이 아니면 성공/실패 판단 불가 → 로그만
        if (!data) {
          console.warn('서버 원문 응답(비JSON):', txt);
        }
      
        await sleep(200);
        alert(`${name}님, 방문예약 요청이 전송되었습니다!`);
        form.reset();
        hiddenTime.value='';
        dispInput.value='';

      } catch(err){
        alert(`전송 실패: ${String(err.message)}`);
        console.error(err);
      } finally {
        submitBtn.textContent = prev;
        submitBtn.disabled = !checkbox.checked;
      }
    });
  
    // (선택) 백엔드의 from(대표번호) 확인용
    fetch(`${API_BASE}/version`)
      .then(r=>r.json())
      .then(v=>console.log('FROM(ENV_SENDER)=', v.from_admin))
      .catch(()=>{});
  });
// 여기까지


(function(){
  const items = document.querySelectorAll('[data-reveal]');
  if (!('IntersectionObserver' in window) || items.length === 0){
    items.forEach(el => el.classList.add('is-revealed'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const el = entry.target;
      const once = el.hasAttribute('data-reveal-once'); // 이 속성이 있으면 1회만

      if (entry.isIntersecting) {
        // 들어올 때: 클래스 추가(재진입 시 다시 페이드)
        if (el._leaveTimer){ clearTimeout(el._leaveTimer); el._leaveTimer = null; }
        const baseDelay = parseInt(el.getAttribute('data-reveal-delay') || '0', 10);
        el.style.transitionDelay = (baseDelay/1000) + 's';
        el.classList.add('is-revealed');

        if (once) io.unobserve(el); // 1회만 재생 원하는 경우
      } else {
        // 나갈 때: 약간의 지연 후 클래스 제거(깜빡임 방지)
        if (!once){
          el._leaveTimer = setTimeout(() => {
            el.classList.remove('is-revealed');
            el.style.transitionDelay = ''; // 초기화
          }, 150);
        }
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -12% 0px', // 하단에서 조금 더 나왔을 때 트리거
    threshold: 0.12
  });

  items.forEach(el => io.observe(el));
})();

