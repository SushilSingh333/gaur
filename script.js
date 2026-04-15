/* ============================
   Gaur Chrysalis 2.0 – script.js
   ============================ */

// ── Navbar scroll effect ──────────────────────────────────────────
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  if (scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  lastScroll = scrollY;
}, { passive: true });

// ── Hamburger menu ────────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.querySelector('.nav-links');
let menuOpen = false;

hamburger.addEventListener('click', () => {
  menuOpen = !menuOpen;
  if (menuOpen) {
    navLinks.style.cssText = `
      display: flex;
      flex-direction: column;
      position: fixed;
      top: 80px;
      left: 0; right: 0;
      background: rgba(10,10,10,0.98);
      backdrop-filter: blur(20px);
      padding: 32px 24px;
      gap: 24px;
      border-bottom: 1px solid rgba(201,168,76,0.2);
      z-index: 99;
    `;
    hamburger.children[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    hamburger.children[1].style.opacity   = '0';
    hamburger.children[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    navLinks.removeAttribute('style');
    hamburger.children[0].style.transform = '';
    hamburger.children[1].style.opacity   = '';
    hamburger.children[2].style.transform = '';
  }
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    if (menuOpen) hamburger.click();
  });
});

// ── Smooth active nav link ────────────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navItems.forEach(a => a.classList.remove('active'));
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

// ── Reveal on scroll ─────────────────────────────────────────────
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, idx) => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, parseInt(delay));
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

revealEls.forEach((el, i) => {
  // Stagger siblings automatically if no explicit delay
  if (!el.dataset.delay) {
    const siblings = [...el.parentElement.children].filter(c => c.classList.contains('reveal'));
    const idx = siblings.indexOf(el);
    el.style.transitionDelay = `${idx * 100}ms`;
  }
  revealObserver.observe(el);
});

// ── Counter animation for stats ───────────────────────────────────
function animateCounter(el, target, prefix = '', suffix = '', duration = 1800) {
  let start = null;
  const startVal = 0;

  function step(timestamp) {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);
    const current  = Math.floor(startVal + eased * (target - startVal));
    el.textContent = prefix + current.toLocaleString('en-IN') + suffix;
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = prefix + target.toLocaleString('en-IN') + suffix;
  }

  requestAnimationFrame(step);
}

// Trigger counters when hero stats enter view
const heroStatNums = document.querySelectorAll('.hstat-num');
const counterConfig = [
  { prefix: '₹', val: 12, suffix: 'K' },
  { prefix: '',  val: 30, suffix: '+' },
  { prefix: '',  val: 2,  suffix: 'X' },
];

let countersStarted = false;
const heroObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting && !countersStarted) {
    countersStarted = true;
    heroStatNums.forEach((el, i) => {
      const cfg = counterConfig[i];
      if (cfg) animateCounter(el, cfg.val, cfg.prefix, cfg.suffix, 2000);
    });
  }
}, { threshold: 0.5 });

if (heroStatNums.length) heroObserver.observe(document.querySelector('.hero-stats'));

// ── Toast helper ──────────────────────────────────────────────────
function showToast(msg) {
  const toast   = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-msg');
  toastMsg.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4500);
}

// ── Form validation helper ────────────────────────────────────────
function isValidPhone(val) {
  return /^[6-9]\d{9}$/.test(val.trim());
}

function shakeField(el) {
  el.style.borderColor = '#e53e3e';
  el.style.animation = 'shake 0.35s ease';
  el.addEventListener('animationend', () => el.style.animation = '', { once: true });
  setTimeout(() => el.style.borderColor = '', 2000);
}

// Inject shake keyframes
const style = document.createElement('style');
style.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20%, 60%  { transform: translateX(-6px); }
    40%, 80%  { transform: translateX(6px); }
  }
`;
document.head.appendChild(style);

// ── Hero form submit ──────────────────────────────────────────────
window.handleFormSubmit = function () {
  const name     = document.getElementById('f-name');
  const phone    = document.getElementById('f-phone');
  const city     = document.getElementById('f-city');
  const interest = document.getElementById('f-interest');

  let valid = true;

  if (!name.value.trim() || name.value.trim().length < 2) {
    shakeField(name); valid = false;
  }
  if (!isValidPhone(phone.value)) {
    shakeField(phone); valid = false;
  }
  if (!city.value.trim() || city.value.trim().length < 2) {
    shakeField(city); valid = false;
  }
  if (!interest.value) {
    shakeField(interest); valid = false;
  }

  if (!valid) return;

  // Simulate submission
  const btn = document.getElementById('formSubmit');
  btn.innerHTML = '<span>Submitting…</span>';
  btn.disabled  = true;

  setTimeout(() => {
    btn.innerHTML = `<span>✓ Submitted!</span>`;
    btn.style.background = 'linear-gradient(135deg,#22c55e,#16a34a)';
    showToast('Thank you! Our team will call you within 2 hours.');
    // Reset after 3s
    setTimeout(() => {
      btn.innerHTML = `<span>Request Callback</span><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
      btn.style.background = '';
      btn.disabled = false;
      [name, phone, city, interest].forEach(el => el.value = '');
    }, 3000);
  }, 1200);
};

// ── Contact form submit ────────────────────────────────────────────
window.handleContactSubmit = function () {
  const name  = document.getElementById('cf-name');
  const phone = document.getElementById('cf-phone');
  const city  = document.getElementById('cf-city');

  let valid = true;

  if (!name.value.trim() || name.value.trim().length < 2) {
    shakeField(name); valid = false;
  }
  if (!isValidPhone(phone.value)) {
    shakeField(phone); valid = false;
  }
  if (!city.value.trim() || city.value.trim().length < 2) {
    shakeField(city); valid = false;
  }

  if (!valid) return;

  const btn = document.querySelector('.contact-form-card .btn-submit');
  btn.innerHTML = '<span>Scheduling…</span>';
  btn.disabled  = true;

  setTimeout(() => {
    btn.innerHTML = `<span>✓ Visit Scheduled!</span>`;
    btn.style.background = 'linear-gradient(135deg,#22c55e,#16a34a)';
    showToast("Site visit scheduled! We'll confirm via WhatsApp shortly.");
    setTimeout(() => {
      btn.innerHTML = `<span>Schedule Visit</span><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
      btn.style.background = '';
      btn.disabled = false;
      ['cf-name','cf-phone','cf-city','cf-date','cf-msg'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
      });
    }, 3000);
  }, 1200);
};

// ── Parallax on hero image ────────────────────────────────────────
window.addEventListener('scroll', () => {
  const heroImg = document.getElementById('heroImg');
  if (heroImg) {
    const scrolled = window.scrollY;
    heroImg.style.transform = `translateY(${scrolled * 0.25}px)`;
  }
}, { passive: true });

// ── Ticker pause on hover ──────────────────────────────────────────
const track = document.getElementById('oppTrack');
if (track) {
  track.addEventListener('mouseenter', () => {
    track.querySelector('.opp-items').style.animationPlayState = 'paused';
  });
  track.addEventListener('mouseleave', () => {
    track.querySelector('.opp-items').style.animationPlayState = 'running';
  });
}

// ── Page load entrance ────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.6s ease';
  requestAnimationFrame(() => {
    document.body.style.opacity = '1';
  });
});