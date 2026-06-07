/* ===================================================
   韓国肌管理MIMI - ポテンツァLP
   =================================================== */

// ---- Nav scroll shadow ----
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

// ---- Language dropdown ----
const langToggle = document.getElementById('langToggle');
const langDropdown = document.getElementById('langDropdown');

langToggle.addEventListener('click', (e) => {
  e.stopPropagation();
  const isOpen = langDropdown.classList.toggle('open');
  langToggle.setAttribute('aria-expanded', String(isOpen));
});

// 選択
document.querySelectorAll('.lang-option').forEach(opt => {
  opt.addEventListener('click', () => {
    document.querySelectorAll('.lang-option').forEach(o => {
      o.classList.remove('lang-option--active');
      o.setAttribute('aria-selected', 'false');
    });
    opt.classList.add('lang-option--active');
    opt.setAttribute('aria-selected', 'true');
    langDropdown.classList.remove('open');
    langToggle.setAttribute('aria-expanded', 'false');
    // 言語別URLへの遷移はここに追加
    // const lang = opt.dataset.lang;
  });
});

// 外タップで閉じる
document.addEventListener('click', () => {
  langDropdown.classList.remove('open');
  langToggle.setAttribute('aria-expanded', 'false');
});

// ---- Sticky CTA (hero を抜けたら表示) ----
const stickyCta = document.getElementById('stickyCta');
const heroSection = document.querySelector('.hero');

if (stickyCta && heroSection) {
  const heroObserver = new IntersectionObserver((entries) => {
    stickyCta.classList.toggle('visible', !entries[0].isIntersecting);
  }, { threshold: 0.05 });
  heroObserver.observe(heroSection);
}

// ---- Scroll animations ----
const animatedEls = document.querySelectorAll('.fade-up');
const animObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const delay = el.style.getPropertyValue('--delay') || '0s';
    el.style.transitionDelay = delay;
    el.classList.add('visible');
    animObserver.unobserve(el);
  });
}, { threshold: 0.1 });
animatedEls.forEach(el => animObserver.observe(el));

// ---- FAQ accordion ----
document.querySelectorAll('.faq-item__q').forEach(btn => {
  btn.addEventListener('click', () => {
    const isOpen = btn.getAttribute('aria-expanded') === 'true';
    // 全部閉じる
    document.querySelectorAll('.faq-item__q').forEach(b => {
      b.setAttribute('aria-expanded', 'false');
      b.closest('.faq-item').querySelector('.faq-item__a').classList.remove('open');
    });
    // クリックしたのを開く（トグル）
    if (!isOpen) {
      btn.setAttribute('aria-expanded', 'true');
      btn.closest('.faq-item').querySelector('.faq-item__a').classList.add('open');
    }
  });
});

// ---- Booking form ----
const form = document.getElementById('bookingForm');
const success = document.getElementById('bookingSuccess');
const submitBtn = document.getElementById('submitBtn');

if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!validate()) return;
    submitBtn.disabled = true;
    submitBtn.textContent = '送信中...';
    setTimeout(() => {
      form.hidden = true;
      success.hidden = false;
    }, 900);
  });
}

function validate() {
  let ok = true;
  const name = document.getElementById('name');
  const tel  = document.getElementById('tel');
  clearErr(name); clearErr(tel);
  if (!name.value.trim())               { showErr(name, 'お名前を入力してください'); ok = false; }
  if (!tel.value.trim())                { showErr(tel,  '電話番号を入力してください'); ok = false; }
  else if (!/^[\d\-\+\(\)\s]{7,}$/.test(tel.value.trim()))
                                        { showErr(tel,  '正しい電話番号を入力してください'); ok = false; }
  return ok;
}
function showErr(input, msg) {
  input.classList.add('error');
  const el = input.nextElementSibling;
  if (el?.classList.contains('form-error')) el.textContent = msg;
}
function clearErr(input) {
  input.classList.remove('error');
  const el = input.nextElementSibling;
  if (el?.classList.contains('form-error')) el.textContent = '';
}
['name','tel'].forEach(id => {
  document.getElementById(id)?.addEventListener('input', e => clearErr(e.target));
});

// ---- Smooth scroll (fixed header offset) ----
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = nav.offsetHeight + 8;
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
  });
});
