'use strict';

/** @type {HTMLElement} */
const modal = document.querySelector('.modal');
/** @type {HTMLElement} */
const overlay = document.querySelector('.overlay');
/** @type {HTMLElement} */
const btnCloseModal = document.querySelector('.btn--close-modal');
/** @type {NodeListOf<HTMLElement>} */
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
/** @type {HTMLElement} */
const btnScrollTo = document.querySelector('.btn--scroll-to');
/** @type {HTMLElement} */
const section1 = document.querySelector('#section--1');
/** @type {HTMLElement} */
const tabsContainer = document.querySelector('.operations__tab-container');
/** @type {NodeListOf<HTMLElement>} */
const tabs = document.querySelectorAll('.operations__tab');
/** @type {NodeListOf<HTMLElement>} */
const tabsContent = document.querySelectorAll('.operations__content');
/** @type {HTMLElement} */
const nav = document.querySelector('.nav');
/** @type {HTMLImageElement} */
const logoImg = document.getElementById('logo');
/** @type {NodeListOf<HTMLSpanElement>} */
const allSpans = document.querySelectorAll('.nav__hamburger span');
/** @type {HTMLElement} */
const hamburger = document.getElementById('hamburger');
/** @type {HTMLElement} */
const navLinks = document.querySelector('.nav__links');

/**
 * Update the background color of hamburger menu spans depending on dark mode.
 * @returns {void}
 */
function updateHamburgerSpansBorder() {
  if (document.body.classList.contains('dark-mode')) {
    allSpans.forEach(span => {
      span.style.backgroundColor = 'white';
    });
  } else {
    allSpans.forEach(span => {
      span.style.backgroundColor = '';
    });
  }
}

/** @type {HTMLElement} */
const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;
/** @type {NodeListOf<HTMLElement>} */
const allSections = document.querySelectorAll('.section');
/** @type {HTMLElement} */
const scrollToTopBtn = document.getElementById('scrollToTopBtn');

window.addEventListener('scroll', () => {
  if (window.pageYOffset > 300) {
    scrollToTopBtn.style.display = 'block';
  } else {
    scrollToTopBtn.style.display = 'none';
  }
});

scrollToTopBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
});

/** @type {HTMLElement} */
const modeToggleBtn = document.getElementById('modeToggleBtn');

/**
 * Open modal window.
 * @param {Event} e Event object
 * @returns {void}
 */
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

/**
 * Close modal window.
 * @returns {void}
 */
const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

btnScrollTo.addEventListener('click', function (e) {
  section1.scrollIntoView({ behavior: 'smooth' });
});

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  if (!clicked) return;

  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  clicked.classList.add('operations__tab--active');

  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

/**
 * Handles hover effect on navigation links.
 * @param {MouseEvent} e Mouse event
 * @returns {void}
 */
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

// Passing "argument" into handler: 0.5 for mouseover, 1 for mouseout
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

const initialCords = section1.getBoundingClientRect();

window.addEventListener('scroll', function () {
  if (window.scrollY > initialCords.top) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
});

/**
 * IntersectionObserver callback for sticky navigation.
 * @param {IntersectionObserverEntry[]} entries Intersection observer entries
 */
const stickyNav = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

/**
 * IntersectionObserver callback to reveal sections on scroll.
 * @param {IntersectionObserverEntry[]} entries Intersection observer entries
 * @param {IntersectionObserver} observer Observer instance
 */
const revealSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.1,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
});

/** @type {NodeListOf<HTMLImageElement>} */
const imgTargets = document.querySelectorAll('img[data-src]');

/**
 * IntersectionObserver callback to lazy-load images.
 * @param {IntersectionObserverEntry[]} entries Intersection observer entries
 * @param {IntersectionObserver} observer Observer instance
 */
const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '-200px',
});

imgTargets.forEach(img => imgObserver.observe(img));

/**
 * Slider component initialization function.
 * Handles slide navigation, dots, and keyboard controls.
 * @returns {void}
 */
const slider = function () {
  /** @type {NodeListOf<HTMLElement>} */
  const slides = document.querySelectorAll('.slide');
  /** @type {HTMLElement} */
  const btnLeft = document.querySelector('.slider__btn--left');
  /** @type {HTMLElement} */
  const btnRight = document.querySelector('.slider__btn--right');
  /** @type {HTMLElement} */
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length;

  /**
   * Creates dot buttons for each slide.
   * @returns {void}
   */
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  /**
   * Activates the dot corresponding to the current slide.
   * @param {number} slide Slide index
   * @returns {void}
   */
  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  /**
   * Moves to the specified slide.
   * @param {number} slide Slide index
   * @returns {void}
   */
  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  /**
   * Goes to the next slide.
   * @returns {void}
   */
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  /**
   * Goes to the previous slide.
   * @returns {void}
   */
  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  /**
   * Initializes the slider.
   * @returns {void}
   */
  const init = function () {
    goToSlide(0);
    createDots();
    activateDot(0);
  };
  init();

  // Dark mode initialization
  const savedMode = localStorage.getItem('darkMode');
  if (savedMode === 'enabled') {
    document.body.classList.add('dark-mode');
    modeToggleBtn.textContent = '☀️';
  }

  modeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');

    if (isDark) {
      modeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
      logoImg.src = 'img/sohoBela.webp'; // Dark mode logo
      localStorage.setItem('darkMode', 'enabled');
    } else {
      modeToggleBtn.innerHTML = '<i class="fa-solid fa-umbrella-beach"></i>';
      modeToggleBtn.style.color = 'var(--text-color)';
      modeToggleBtn.style.backgroundColor = '#ffffff';
      logoImg.src = 'img/physics.png'; // Light mode logo
      localStorage.setItem('darkMode', 'disabled');
    }

    updateHamburgerSpansBorder();
  });

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('nav__links--active');
  });

  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      curSlide = Number(e.target.dataset.slide);
      goToSlide(curSlide);
      activateDot(curSlide);
    }
  });
};

slider();
