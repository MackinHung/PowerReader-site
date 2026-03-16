/* ══════════════════════════════════════════════
   JS 備註：

   1. 計數器動畫
   目前是假數字 + 動畫效果
   真實實作需要從 Cloudflare KV 讀取數字
   建議：Worker 定期計算，KV 存快取，前端直接讀 KV
   這樣不會因為每次訪問都觸發計算而超過免費限額

   2. +1 按鈕
   目前只是本地狀態，重新整理就消失
   真實實作：點擊後呼叫 Worker API，累加計數並存 KV
   顯示的是真實累積數字，讓人感覺「這個計畫是活的」

   3. 計數器數字滾動效果
   如果你想要更有氣勢的數字呈現
   可以找 countUp.js 這個 library
   讓數字從 0 滾動到目標數字

   4. 如果想要更動態的英雄區
   可以考慮讓背景的「偏見」二字換成
   從真實媒體抓來的聳動標題快速輪播
   這樣英雄區本身就在說明「問題存在」，不用文字解釋
   ══════════════════════════════════════════════ */

// 捲動顯示動畫
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); }
  });
}, { threshold: 0.07 });

// 同層元素錯開延遲
document.querySelectorAll(
  '.voices, .contrast-grid, .scene-list, .join-grid, .trust-grid'
).forEach(parent => {
  [...parent.querySelectorAll('.r')].forEach((el, i) => {
    el.style.transitionDelay = `${i * 70}ms`;
  });
});

document.querySelectorAll('.r').forEach(el => obs.observe(el));

// +1 互動
function addOne(btn) {
  if (btn.classList.contains('clicked')) return;
  btn.classList.add('clicked');
  const numEl = btn.querySelector('.voice-num');
  const current = parseInt(numEl.textContent.replace(/[^0-9]/g, ''), 10);
  numEl.textContent = '+' + (current + 1).toLocaleString();
}

function toggleInfo() {
  const card = document.getElementById('statusCard');
  card.classList.toggle('active');
}

// 導覽列捲動邏輯
const nav = document.querySelector('nav');
const navLinks = document.querySelectorAll('.nav-links a');
const navStatusHud = document.getElementById('navStatusHud');
const sections = [
  { id: 'act2', label: '01 為什麼' },
  { id: 'contrast', label: '01 為什麼' }, // 銜接用，併入第一階段
  { id: 'scenes', label: '02 能做什麼' },
  { id: 'join', label: '03 參與計畫' },
  { id: 'trust', label: '04 開源透明' }
];

let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  const isScrollingDown = currentScroll > lastScroll;

  // 1. 透明度切換
  if (currentScroll > 50) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }

  // 2. 往下滑隱藏，往上滑顯示
  let isNavHidden = false;
  if (isScrollingDown && currentScroll > 200) {
    nav.classList.add('hidden');
    isNavHidden = true;
  } else {
    nav.classList.remove('hidden');
    isNavHidden = false;
  }
  
  // 3. Scroll Spy (當前閱讀區塊標註)
  let currentLabel = "";
  let currentId = "";
  
  // 使用接近視窗中間的位置來判斷觸發
  const triggerPoint = currentScroll + (window.innerHeight * 0.3);

  sections.forEach(s => {
    const el = document.getElementById(s.id);
    if (el && triggerPoint >= el.offsetTop) {
      currentLabel = s.label;
      currentId = s.id;
    }
  });

  // 特別處理: 如果在 contrast 段落，導覽列依然標示為 act2
  const activeId = currentId === 'contrast' ? 'act2' : currentId;

  // 更新導覽連結 active 狀態
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${activeId}`) {
      link.classList.add('active');
    }
  });

  // 4. HUD 邏輯 (當導覽列隱藏時顯示)
  if (isNavHidden && currentLabel) {
    if (navStatusHud.textContent !== currentLabel) {
      navStatusHud.textContent = currentLabel;
    }
    navStatusHud.classList.add('revealed');
  } else {
    navStatusHud.classList.remove('revealed');
  }

  lastScroll = currentScroll;
});

// 計數器滾動（模擬）
// 備註：替換成真實 API 呼叫即可
function animateCount(el, target, duration) {
  const start = 0;
  const startTime = performance.now();
  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(start + (target - start) * eased).toLocaleString();
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

// 當計數器進入視野才觸發
const liveBar = document.querySelector('.live-bar');
const liveObs = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) {
    animateCount(document.getElementById('count-articles'), 2847, 1800);
    animateCount(document.getElementById('count-today'), 143, 1200);
    animateCount(document.getElementById('count-contrib'), 389, 1500);
    liveObs.unobserve(liveBar);
  }
}, { threshold: 0.5 });
if (liveBar) liveObs.observe(liveBar);

// 行動端選單切換
function toggleMenu() {
  nav.classList.toggle('menu-open');
  // 禁止背景捲動
  if (nav.classList.contains('menu-open')) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
}

// 點擊連結後自動關閉選單
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('menu-open');
    document.body.style.overflow = '';
  });
});

// 頁面加載完成後的自動提醒 (顯示 3.5 秒後縮回)
window.addEventListener('load', () => {
  const btn = document.getElementById('infoBtn');
  const card = document.getElementById('statusCard');
  
  if (btn && card) {
    setTimeout(() => {
      btn.classList.add('expanded');
      card.classList.add('active');
      
      setTimeout(() => {
        btn.classList.remove('expanded');
        card.classList.remove('active');
      }, 3500); // 顯示 3.5 秒 (含動畫時間)
    }, 1000); // 進入頁面 1 秒後觸發
  }
});
