/* ═════════════════════════════════════════
   BRENT WOOD SCHOOL — main.js
═════════════════════════════════════════ */

/* ─────────────────────────────────────────
   1. NAVBAR — Scroll state + Hamburger
───────────────────────────────────────── */
const mainNav      = document.getElementById('mainNav');
const hamburgerBtn = document.getElementById('hamburgerBtn');
const mobileMenu   = document.getElementById('mobileMenu');
let menuOpen = false;

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

/* ─────────────────────────────────────────
   2. BACK TO TOP
───────────────────────────────────────── */
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

/* ─────────────────────────────────────────
   3. SCROLL HANDLER
───────────────────────────────────────── */
window.addEventListener('scroll', () => {
  if (mainNav) mainNav.classList.toggle('scrolled', window.scrollY > 40);
  handleBackToTop();
}, { passive: true });

/* ─────────────────────────────────────────
   4. VIDEO MODAL
───────────────────────────────────────── */
const videoModal       = document.getElementById('videoModal');
const videoModalPlayer = document.getElementById('videoModalPlayer');
const videoModalSource = document.getElementById('videoModalSource');
const videoModalClose  = document.getElementById('videoModalClose');

function openVideoModal(src) {
  if (!videoModal || !videoModalPlayer) return;
  if (videoModalSource && src) {
    videoModalSource.src = src;
    videoModalPlayer.load();
  }
  videoModalPlayer.play();
  videoModal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeVideoModal() {
  if (!videoModal || !videoModalPlayer) return;
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

window.openVideoModal = openVideoModal;

/* ─────────────────────────────────────────
   5. WATCH OUR SCHOOL VIDEO BUTTON
───────────────────────────────────────── */
const watchVideoBtn = document.getElementById('watchVideoBtn');

if (watchVideoBtn) {
  watchVideoBtn.addEventListener('click', (e) => {
    e.preventDefault();
    openVideoModal('images/breetwood.mp4');
  });
}

/* ─────────────────────────────────────────
   6. EVENTS SLIDER
───────────────────────────────────────── */
const eventsTrack = document.getElementById('eventsTrack');
const evPrev      = document.getElementById('evPrev');
const evNext      = document.getElementById('evNext');

let evIndex        = 0;
let evAutoInterval = null;
let evPaused       = false;

function getEvCards() {
  return eventsTrack ? eventsTrack.querySelectorAll('.btc-card') : [];
}

function getVisibleCount() {
  if (window.innerWidth <= 768) return 1;
  if (window.innerWidth <= 900) return 2;
  if (window.innerWidth <= 1100) return 3;
  return 4;
}

function getEvCardWidth() {
  const cards = getEvCards();
  if (!cards.length || !eventsTrack) return 0;
  const gap = 16;
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

  const evWrap = eventsTrack.parentElement;
  if (evWrap) {
    evWrap.addEventListener('mouseenter', () => { evPaused = true; });
    evWrap.addEventListener('mouseleave', () => { evPaused = false; });
  }

  startEvAuto();
  window.addEventListener('resize', () => goToEv(evIndex));
}

/* ─────────────────────────────────────────
   7. GALLERY PAGE — Filter + Lightbox
───────────────────────────────────────── */
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
    galleryPageGrid.querySelectorAll('.gp-item:not(.hidden):not(.gp-video-item)')
  );
}

function showPageLbImage() {
  const items = getVisibleItems();
  if (!items.length || !pageLbImage) return;
  const img = items[currentPageLbIndex].querySelector('img');
  if (img) pageLbImage.src = img.src;
  if (pageLbCounter) {
    pageLbCounter.textContent = `${currentPageLbIndex + 1} / ${items.length}`;
  }
}

function openPageLightbox(index) {
  const items = getVisibleItems();
  if (!pageLightbox || items.length === 0) return;
  currentPageLbIndex = index;
  showPageLbImage();
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
  if (!items.length) return;
  currentPageLbIndex = (currentPageLbIndex + 1) % items.length;
  showPageLbImage();
}

function pageLbGoPrev() {
  const items = getVisibleItems();
  if (!items.length) return;
  currentPageLbIndex = (currentPageLbIndex - 1 + items.length) % items.length;
  showPageLbImage();
}

function attachGalleryClicks() {
  if (!galleryPageGrid) return;

  /* Photo items */
  galleryPageGrid.querySelectorAll('.gp-item:not(.gp-video-item)').forEach(item => {
    item.style.cursor = 'pointer';
    item.onclick = () => {
      const visibleItems = getVisibleItems();
      const visibleIndex = visibleItems.indexOf(item);
      if (visibleIndex !== -1) openPageLightbox(visibleIndex);
    };
  });

  /* Video items */
  galleryPageGrid.querySelectorAll('.gp-video-item').forEach(item => {
    item.style.cursor = 'pointer';
    item.onclick = () => {
      const source = item.querySelector('source');
      if (source) openVideoModal(source.src);
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
      galleryPageGrid.querySelectorAll('.gp-item').forEach(item => {
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

window.openPageLightbox = openPageLightbox;

/* ─────────────────────────────────────────
   8. HOMEPAGE GALLERY GRID (if present)
───────────────────────────────────────── */
const homeLightbox  = document.getElementById('lightbox');
const homeLbImage   = document.getElementById('lbImage');
const homeLbClose   = document.getElementById('lbClose');
const homeLbPrev    = document.getElementById('lbPrev');
const homeLbNext    = document.getElementById('lbNext');
const homeLbCounter = document.getElementById('lbCounter');

let homeLbIndex = 0;

function getHomeGalleryItems() {
  return Array.from(
    document.querySelectorAll('.gg-item:not(.gg-view-all):not(.gg-video-item)')
  );
}

function showHomeLbImage() {
  const items = getHomeGalleryItems();
  if (!items.length || !homeLbImage) return;
  const img = items[homeLbIndex].querySelector('img');
  if (img) homeLbImage.src = img.src;
  if (homeLbCounter) {
    homeLbCounter.textContent = `${homeLbIndex + 1} / ${items.length}`;
  }
}

function openLightbox(index) {
  const items = getHomeGalleryItems();
  if (!homeLightbox || !items.length) return;
  homeLbIndex = index;
  showHomeLbImage();
  homeLightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  if (!homeLightbox) return;
  homeLightbox.classList.remove('open');
  document.body.style.overflow = '';
}

function lbGoNext() {
  const items = getHomeGalleryItems();
  if (!items.length) return;
  homeLbIndex = (homeLbIndex + 1) % items.length;
  showHomeLbImage();
}

function lbGoPrev() {
  const items = getHomeGalleryItems();
  if (!items.length) return;
  homeLbIndex = (homeLbIndex - 1 + items.length) % items.length;
  showHomeLbImage();
}

if (homeLbClose) homeLbClose.addEventListener('click', closeLightbox);
if (homeLbNext)  homeLbNext.addEventListener('click', lbGoNext);
if (homeLbPrev)  homeLbPrev.addEventListener('click', lbGoPrev);

if (homeLightbox) {
  homeLightbox.addEventListener('click', (e) => {
    if (e.target === homeLightbox) closeLightbox();
  });
}

function attachHomeGalleryClicks() {
  getHomeGalleryItems().forEach((item, i) => {
    item.style.cursor = 'pointer';
    item.onclick = () => openLightbox(i);
  });

  document.querySelectorAll('.gg-video-item').forEach(item => {
    item.style.cursor = 'pointer';
    item.onclick = () => {
      const source = item.querySelector('source');
      if (source) openVideoModal(source.src);
    };
  });
}

window.openLightbox = openLightbox;

/* ─────────────────────────────────────────
   9. KEYBOARD SHORTCUTS
───────────────────────────────────────── */
document.addEventListener('keydown', (e) => {
  /* Gallery page lightbox */
  if (pageLightbox && pageLightbox.classList.contains('open')) {
    if (e.key === 'ArrowRight') pageLbGoNext();
    if (e.key === 'ArrowLeft')  pageLbGoPrev();
    if (e.key === 'Escape')     closePageLightbox();
    return;
  }

  /* Homepage lightbox */
  if (homeLightbox && homeLightbox.classList.contains('open')) {
    if (e.key === 'ArrowRight') lbGoNext();
    if (e.key === 'ArrowLeft')  lbGoPrev();
    if (e.key === 'Escape')     closeLightbox();
    return;
  }

  /* Video modal */
  if (videoModal && videoModal.classList.contains('open') && e.key === 'Escape') {
    closeVideoModal();
  }
});

/* ─────────────────────────────────────────
   10. MOBILE SOCIAL SIDEBAR TOGGLE
───────────────────────────────────────── */
const socialToggle        = document.getElementById('socialToggle');
const mobileSocialSidebar = document.getElementById('mobileSocialSidebar');
let socialOpen = false;

if (socialToggle && mobileSocialSidebar) {
  socialToggle.addEventListener('click', () => {
    socialOpen = !socialOpen;
    mobileSocialSidebar.classList.toggle('open', socialOpen);
    socialToggle.innerHTML = socialOpen
      ? '<i class="ti ti-x"></i>'
      : '<i class="ti ti-share"></i>';
  });
}

/* ─────────────────────────────────────────
   11. FORMS
───────────────────────────────────────── */
const applyForm    = document.getElementById('applyForm');
const formSuccess  = document.getElementById('formSuccess');

if (applyForm && formSuccess) {
  applyForm.addEventListener('submit', (e) => {
    e.preventDefault();
    applyForm.style.display   = 'none';
    formSuccess.style.display = 'flex';
    window.scrollTo({ top: formSuccess.offsetTop - 120, behavior: 'smooth' });
  });
}

const contactForm    = document.getElementById('contactForm');
const contactSuccess = document.getElementById('contactSuccess');

if (contactForm && contactSuccess) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    contactForm.style.display    = 'none';
    contactSuccess.style.display = 'flex';
    window.scrollTo({ top: contactSuccess.offsetTop - 120, behavior: 'smooth' });
  });
}

/* ─────────────────────────────────────────
   12. INIT ON LOAD
───────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  attachGalleryClicks();
  attachHomeGalleryClicks();
});