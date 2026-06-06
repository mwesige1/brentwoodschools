/* ─────────────────────────────────────────
   BRENT WOOD SCHOOL — main.js
───────────────────────────────────────── */

/* ── 1. NAVBAR — Scroll shrink + Hamburger ── */

const mainNav     = document.getElementById('mainNav');
const hamburgerBtn = document.getElementById('hamburgerBtn');
const mobileMenu  = document.getElementById('mobileMenu');
let menuOpen = false;

window.addEventListener('scroll', () => {
  if (mainNav) mainNav.classList.toggle('scrolled', window.scrollY > 40);
  handleBackToTop();
});

if (hamburgerBtn && mobileMenu) {
  hamburgerBtn.addEventListener('click', () => {
    menuOpen = !menuOpen;
    mobileMenu.style.display = menuOpen ? 'flex' : 'none';
    const spans = hamburgerBtn.querySelectorAll('span');
    spans[0].style.transform = menuOpen ? 'rotate(45deg) translate(5px, 5px)' : '';
    spans[1].style.opacity   = menuOpen ? '0' : '1';
    spans[2].style.transform = menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : '';
  });
}

/* ── 2. BACK TO TOP ── */

const backToTopBtn = document.getElementById('backToTop');

function handleBackToTop() {
  if (!backToTopBtn) return;
  backToTopBtn.classList.toggle('visible', window.scrollY > 400);
}

if (backToTopBtn) {
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ── 3. GALLERY SLIDER ── */
/* ── 9. GALLERY PAGE — Filter + Lightbox ── */

const filterBtns      = document.querySelectorAll('.gf-btn');
const galleryPageGrid = document.getElementById('galleryPageGrid');
const pageLightbox    = document.getElementById('pageLightbox');
const pageLbImage     = document.getElementById('pageLbImage');
const pageLbClose     = document.getElementById('pageLbClose');
const pageLbPrev      = document.getElementById('pageLbPrev');
const pageLbNext      = document.getElementById('pageLbNext');
const pageLbCounter   = document.getElementById('pageLbCounter');

let currentPageLbIndex = 0;

function getVisibleItems() {
  if (!galleryPageGrid) return [];
  return Array.from(
    galleryPageGrid.querySelectorAll('.gp-item:not(.hidden)')
  );
}

function openPageLightbox(index) {
  const items = getVisibleItems();
  if (!pageLightbox || items.length === 0) return;
  currentPageLbIndex = index;
  const img = items[index].querySelector('img');
  if (!img) return;
  pageLbImage.src = img.src;
  if (pageLbCounter) pageLbCounter.textContent = `${index + 1} / ${items.length}`;
  pageLightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closePageLightbox() {
  if (!pageLightbox) return;
  pageLightbox.classList.remove('open');
  document.body.style.overflow = '';
}

function pageLbGoNext() {
  const items = getVisibleItems();
  currentPageLbIndex = (currentPageLbIndex + 1) % items.length;
  const img = items[currentPageLbIndex].querySelector('img');
  if (img) pageLbImage.src = img.src;
  if (pageLbCounter) pageLbCounter.textContent = `${currentPageLbIndex + 1} / ${items.length}`;
}

function pageLbGoPrev() {
  const items = getVisibleItems();
  currentPageLbIndex = (currentPageLbIndex - 1 + items.length) % items.length;
  const img = items[currentPageLbIndex].querySelector('img');
  if (img) pageLbImage.src = img.src;
  if (pageLbCounter) pageLbCounter.textContent = `${currentPageLbIndex + 1} / ${items.length}`;
}

/* Attach click listeners to all gallery items */
function attachGalleryClicks() {
  if (!galleryPageGrid) return;
  const items = galleryPageGrid.querySelectorAll('.gp-item');
  items.forEach((item, index) => {
    item.style.cursor = 'pointer';
    item.onclick = () => {
      const visibleItems = getVisibleItems();
      const visibleIndex = visibleItems.indexOf(item);
      if (visibleIndex !== -1) openPageLightbox(visibleIndex);
    };
  });
}

/* Filter buttons */
if (filterBtns.length > 0 && galleryPageGrid) {
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      const items  = galleryPageGrid.querySelectorAll('.gp-item');
      items.forEach(item => {
        if (filter === 'all' || item.getAttribute('data-category') === filter) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });
}

if (pageLbClose) pageLbClose.addEventListener('click', closePageLightbox);
if (pageLbNext)  pageLbNext.addEventListener('click', pageLbGoNext);
if (pageLbPrev)  pageLbPrev.addEventListener('click', pageLbGoPrev);

if (pageLightbox) {
  pageLightbox.addEventListener('click', (e) => {
    if (e.target === pageLightbox) closePageLightbox();
  });
}

document.addEventListener('keydown', (e) => {
  if (!pageLightbox || !pageLightbox.classList.contains('open')) return;
  if (e.key === 'ArrowRight') pageLbGoNext();
  if (e.key === 'ArrowLeft')  pageLbGoPrev();
  if (e.key === 'Escape')     closePageLightbox();
});

window.openPageLightbox = openPageLightbox;

/* Run on page load */
document.addEventListener('DOMContentLoaded', attachGalleryClicks);



/* ── 5. EVENTS SLIDER ── */

const eventsTrack = document.getElementById('eventsTrack');
const evPrev      = document.getElementById('evPrev');
const evNext      = document.getElementById('evNext');

let evIndex        = 0;
let evAutoInterval = null;
let evPaused       = false;

function getEvCards() {
  return eventsTrack ? eventsTrack.querySelectorAll('.ev-card') : [];
}

function getVisibleCount() {
  if (window.innerWidth <= 580) return 1;
  if (window.innerWidth <= 900) return 2;
  return 3;
}

function getEvCardWidth() {
  const cards = getEvCards();
  if (!cards.length || !eventsTrack) return 0;
  const gap = 20;
  return cards[0].offsetWidth + gap;
}

function getMaxEvIndex() {
  const total   = getEvCards().length;
  const visible = getVisibleCount();
  return Math.max(0, total - visible);
}

function goToEv(index) {
  if (!eventsTrack) return;
  const max = getMaxEvIndex();
  evIndex = Math.max(0, Math.min(index, max));
  eventsTrack.style.transform = `translateX(-${evIndex * getEvCardWidth()}px)`;
}

function evSlideNext() {
  if (evIndex >= getMaxEvIndex()) {
    evIndex = 0;
    goToEv(0);
  } else {
    goToEv(evIndex + 1);
  }
}

function evSlidePrev() {
  goToEv(evIndex - 1);
}

function startEvAuto() {
  stopEvAuto();
  evAutoInterval = setInterval(() => {
    if (!evPaused) evSlideNext();
  }, 3000);
}

function stopEvAuto() {
  if (evAutoInterval) clearInterval(evAutoInterval);
}

if (eventsTrack) {
  if (evPrev) evPrev.addEventListener('click', () => { evSlidePrev(); startEvAuto(); });
  if (evNext) evNext.addEventListener('click', () => { evSlideNext(); startEvAuto(); });

  eventsTrack.parentElement.addEventListener('mouseenter', () => { evPaused = true; });
  eventsTrack.parentElement.addEventListener('mouseleave', () => { evPaused = false; });

  startEvAuto();
  window.addEventListener('resize', () => goToEv(evIndex));
}

/* ── 6. SCROLL REVEAL ANIMATION ── */

const revealElements = document.querySelectorAll(
  '.feature-card, .school-section, .life-card, .event-card, .section-header, .mission-inner'
);

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealElements.forEach(el => {
  el.classList.add('reveal');
  revealObserver.observe(el);
});

/* ── 7. ACTIVE NAV LINK on scroll ── */

const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links li a');

window.addEventListener('scroll', () => {
  let currentSection = '';

  sections.forEach(section => {
    const sectionTop    = section.offsetTop - 120;
    const sectionHeight = section.offsetHeight;
    if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
      currentSection = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href').includes(currentSection) && currentSection !== '') {
      link.classList.add('active');
    }
  });
}, { passive: true });


/* ── Fix: Build gallery images on page load ── */
document.addEventListener('DOMContentLoaded', () => {
  rebuildPageGalleryImages();
});

/* ── VIDEO MODAL ── */
const videoModal       = document.getElementById('videoModal');
const videoModalPlayer = document.getElementById('videoModalPlayer');
const videoModalSource = document.getElementById('videoModalSource');
const videoModalClose  = document.getElementById('videoModalClose');

function openVideoModal(src) {
  if (!videoModal) return;
  videoModalSource.src = src;
  videoModalPlayer.load();
  videoModalPlayer.play();
  videoModal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeVideoModal() {
  if (!videoModal) return;
  videoModalPlayer.pause();
  videoModalPlayer.currentTime = 0;
  videoModal.classList.remove('open');
  document.body.style.overflow = '';
}

if (videoModalClose) videoModalClose.addEventListener('click', closeVideoModal);

if (videoModal) {
  videoModal.addEventListener('click', (e) => {
    if (e.target === videoModal) closeVideoModal();
  });
}

/* Attach click to video items */
document.querySelectorAll('.gp-video-item').forEach(item => {
  item.addEventListener('click', () => {
    const source = item.querySelector('source');
    if (source) openVideoModal(source.src);
  });
});

document.addEventListener('keydown', (e) => {
  if (videoModal && videoModal.classList.contains('open') && e.key === 'Escape') {
    closeVideoModal();
  }
});

window.openVideoModal = openVideoModal;