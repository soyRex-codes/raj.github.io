const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

const root = document.documentElement;
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
const applyPreferredTheme = () => {
  root.setAttribute('data-theme', prefersDark.matches ? 'dark' : 'light');
};

applyPreferredTheme();
prefersDark.addEventListener('change', applyPreferredTheme);

const menuToggle = document.querySelector('.menu-toggle');
const nav = document.getElementById('primary-nav');

if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealEls = document.querySelectorAll('.reveal');

if (!reducedMotion && 'IntersectionObserver' in window) {
  revealEls.forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i * 28, 240)}ms`;
  });

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealEls.forEach((el) => observer.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('visible'));
}

const heroCard = document.querySelector('.hero-card');

if (heroCard && !reducedMotion) {
  heroCard.addEventListener('mousemove', (event) => {
    const rect = heroCard.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    const rotateY = (x - 0.5) * 6;
    const rotateX = (0.5 - y) * 6;
    heroCard.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  heroCard.addEventListener('mouseleave', () => {
    heroCard.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)';
  });
}

const heroSection = document.querySelector('.hero.section');

if (heroSection && !reducedMotion) {
  const handleHeroScroll = () => {
    const rect = heroSection.getBoundingClientRect();
    const progress = Math.min(Math.max(-rect.top / Math.max(rect.height, 1), 0), 1);
    const scale = 1 - progress * 0.06;
    const shift = progress * -36;
    root.style.setProperty('--hero-scale', scale.toFixed(4));
    root.style.setProperty('--hero-shift', `${shift.toFixed(2)}px`);
  };

  handleHeroScroll();
  window.addEventListener('scroll', handleHeroScroll, { passive: true });
}
