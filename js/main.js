/**
 * Sindyanna - Main JavaScript
 * Sticky header + mobile menu
 */

document.addEventListener('DOMContentLoaded', function () {

  // ============================================
  // Sticky Header on Scroll
  // ============================================
  const header = document.getElementById('siteHeader');
  const scrollThreshold = 80;

  function handleScroll() {
    if (window.scrollY > scrollThreshold) {
      header.classList.add('site-header--scrolled');
    } else {
      header.classList.remove('site-header--scrolled');
    }
  }

  // Throttle scroll for performance
  let ticking = false;
  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        handleScroll();
        ticking = false;
      });
      ticking = true;
    }
  });

  // ============================================
  // Mobile Hamburger Menu
  // ============================================
  const hamburger = document.getElementById('hamburger');
  const headerNav = hamburger ? document.querySelector('.header-nav') : null;

  if (hamburger && headerNav) {
    hamburger.addEventListener('click', function () {
      const isOpen = hamburger.classList.toggle('hamburger--active');
      headerNav.classList.toggle('header-nav--open');
      hamburger.setAttribute('aria-expanded', isOpen);

      // Prevent body scroll when menu is open
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close menu on link click (except mega menu trigger)
    const navLinks = headerNav.querySelectorAll('.header-nav__link');
    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        // Don't close mobile nav if this is a dropdown trigger
        if (link.closest('.header-nav__item--mega') || link.closest('.header-nav__item--submenu')) return;
        hamburger.classList.remove('hamburger--active');
        headerNav.classList.remove('header-nav--open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // ============================================
  // Swiper - Categories Carousel
  // ============================================
  // ============================================
  // Swiper - Products Gallery
  // ============================================
  if (typeof Swiper !== 'undefined') {
    new Swiper('.products-swiper', {
      slidesPerView: 1,
      spaceBetween: 16,
      loop: true,
      navigation: {
        nextEl: '.products__nav--next',
        prevEl: '.products__nav--prev',
      },
      breakpoints: {
        480: { slidesPerView: 2, spaceBetween: 20 },
        768: { slidesPerView: 3, spaceBetween: 24 },
        1024: { slidesPerView: 5, spaceBetween: 28 },
      }
    });
  }

  // ============================================
  // Product Card - Click to show detail (GSAP)
  // ============================================
  var productCards = document.querySelectorAll('.product-card');

  function closeCard(card) {
    var detail = card.querySelector('.product-card__detail');
    if (typeof gsap !== 'undefined') {
      gsap.to(detail, { opacity: 0, y: 20, duration: 0.3, ease: 'power2.in', onComplete: function () {
        detail.style.pointerEvents = 'none';
      }});
    } else {
      detail.style.opacity = '0';
      detail.style.pointerEvents = 'none';
    }
    card.classList.remove('product-card--open');
  }

  function openCard(card) {
    var detail = card.querySelector('.product-card__detail');
    card.classList.add('product-card--open');
    detail.style.pointerEvents = 'auto';
    if (typeof gsap !== 'undefined') {
      gsap.fromTo(detail,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }
      );
    } else {
      detail.style.opacity = '1';
    }
  }

  productCards.forEach(function (card) {
    card.addEventListener('click', function (e) {
      if (e.target.closest('.product-card__add-to-cart')) return;
      var isOpen = card.classList.contains('product-card--open');
      // Close all open cards
      productCards.forEach(function (c) {
        if (c.classList.contains('product-card--open')) closeCard(c);
      });
      // Toggle clicked card
      if (!isOpen) openCard(card);
    });
  });

  // Homepage product cards: Add to Cart feedback
  document.querySelectorAll('.product-card__add-to-cart').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var origText = btn.textContent;
      btn.textContent = 'נוסף לסל ✓';
      btn.style.background = 'var(--color-olive-700)';
      btn.disabled = true;

      // Update cart count in header
      var countEl = document.querySelector('.cart-icon__count');
      if (countEl) {
        var current = parseInt(countEl.textContent) || 0;
        countEl.textContent = current + 1;
      }

      setTimeout(function () {
        btn.textContent = origText;
        btn.style.background = '';
        btn.disabled = false;
      }, 1800);
    });
  });

  // ============================================
  // Values Tabs (Why Sindyanna)
  // ============================================
  var valuesTabs = document.querySelectorAll('.values__tab');
  var valuesPanels = document.querySelectorAll('.values__panel');
  var valuesTabsContainer = document.querySelector('.values__tabs');

  function closeAllPanels(callback) {
    var activePanel = document.querySelector('.values__panel--active');
    if (activePanel) {
      if (typeof gsap !== 'undefined') {
        gsap.killTweensOf(activePanel);
        gsap.to(activePanel, {
          height: 0, paddingBlock: 0, opacity: 0,
          duration: 0.35, ease: 'power2.inOut',
          onComplete: function () {
            activePanel.classList.remove('values__panel--active');
            if (callback) callback();
          }
        });
      } else {
        activePanel.classList.remove('values__panel--active');
        activePanel.style.height = '0';
        activePanel.style.paddingBlock = '0';
        activePanel.style.opacity = '0';
        if (callback) callback();
      }
    } else {
      if (callback) callback();
    }
  }

  function openPanel(panelId) {
    var panel = document.querySelector('.values__panel[data-panel="' + panelId + '"]');
    if (!panel) return;
    panel.classList.add('values__panel--active');

    // Measure natural height before animating
    panel.style.height = 'auto';
    panel.style.paddingBlock = '2rem';
    panel.style.opacity = '0';
    var targetHeight = panel.offsetHeight;
    panel.style.height = '0';
    panel.style.paddingBlock = '0';

    if (typeof gsap !== 'undefined') {
      gsap.to(panel, {
        height: targetHeight, paddingBlock: '2rem', opacity: 1,
        duration: 0.45, ease: 'power3.out'
      });
    } else {
      panel.style.height = targetHeight + 'px';
      panel.style.paddingBlock = '2rem';
      panel.style.opacity = '1';
    }
  }

  valuesTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var valueId = tab.getAttribute('data-value');
      var isActive = tab.classList.contains('values__tab--active');

      // If clicking the already active tab, close it
      if (isActive) {
        closeAllPanels();
        tab.classList.remove('values__tab--active');
        tab.setAttribute('aria-expanded', 'false');
        valuesTabsContainer.classList.remove('values__tabs--has-active');
        return;
      }

      // Remove active from all tabs
      valuesTabs.forEach(function (t) {
        t.classList.remove('values__tab--active');
        t.setAttribute('aria-expanded', 'false');
      });

      // Activate clicked tab
      tab.classList.add('values__tab--active');
      tab.setAttribute('aria-expanded', 'true');
      valuesTabsContainer.classList.add('values__tabs--has-active');

      // Close current panel, then open new one
      closeAllPanels(function () {
        openPanel(valueId);
      });
    });
  });

  // ============================================
  // Contact Form – floating label fallback for
  // browsers that don't support :placeholder-shown
  // (CF7 integration will replace this in WordPress)
  // ============================================

  // ============================================
  // Mega Menu – Click Toggle + Tab Switching
  // ============================================
  var megaMenu = document.getElementById('megaMenu');
  if (megaMenu) {
    var megaTabs = megaMenu.querySelectorAll('.mega-menu__tab');
    var megaPanels = megaMenu.querySelectorAll('.mega-menu__panel');
    var megaParent = document.querySelector('.header-nav__item--mega');
    var megaTrigger = megaParent ? megaParent.querySelector('.header-nav__link') : null;

    // Position the arrow under the trigger link
    function positionArrow() {
      if (!megaTrigger || !megaMenu) return;
      var menuRect = megaMenu.getBoundingClientRect();
      var triggerRect = megaTrigger.getBoundingClientRect();
      var triggerCenterX = triggerRect.left + triggerRect.width / 2;
      // Arrow right = distance from right edge of menu to trigger center
      var arrowRight = menuRect.right - triggerCenterX;
      megaMenu.style.setProperty('--mega-arrow-right', arrowRight + 'px');
    }

    // Toggle menu open/close on click
    function openMega() {
      megaMenu.classList.add('mega-menu--open');
      megaParent.classList.add('is-open');
      megaTrigger.setAttribute('aria-expanded', 'true');
      positionArrow();
    }

    function closeMega() {
      megaMenu.classList.remove('mega-menu--open');
      megaParent.classList.remove('is-open');
      megaTrigger.setAttribute('aria-expanded', 'false');
      // Reset to first tab
      megaTabs.forEach(function (t) { t.classList.remove('mega-menu__tab--active'); });
      megaPanels.forEach(function (p) { p.classList.remove('mega-menu__panel--active'); });
      megaTabs[0].classList.add('mega-menu__tab--active');
      megaPanels[0].classList.add('mega-menu__panel--active');
    }

    if (megaTrigger) {
      megaTrigger.addEventListener('click', function (e) {
        e.preventDefault();
        if (megaMenu.classList.contains('mega-menu--open')) {
          closeMega();
        } else {
          openMega();
        }
      });

      megaTrigger.setAttribute('aria-expanded', 'false');
      megaTrigger.setAttribute('aria-controls', 'megaMenu');
    }

    // Close when clicking outside
    document.addEventListener('click', function (e) {
      if (megaMenu.classList.contains('mega-menu--open') && megaParent && !megaParent.contains(e.target)) {
        closeMega();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && megaMenu.classList.contains('mega-menu--open')) {
        closeMega();
        megaTrigger.focus();
      }
    });

    // Reposition arrow on resize
    window.addEventListener('resize', function () {
      if (megaMenu.classList.contains('mega-menu--open')) positionArrow();
    });

    // Desktop: tab switching
    megaTabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var category = tab.getAttribute('data-category');
        megaTabs.forEach(function (t) { t.classList.remove('mega-menu__tab--active'); });
        megaPanels.forEach(function (p) { p.classList.remove('mega-menu__panel--active'); });
        tab.classList.add('mega-menu__tab--active');
        var panel = megaMenu.querySelector('.mega-menu__panel[data-panel="' + category + '"]');
        if (panel) panel.classList.add('mega-menu__panel--active');
      });
    });

    // Mobile: build accordion (each category + its products + button together)
    function buildMobileAccordion() {
      if (megaMenu.querySelector('.mega-menu__accordion')) return;

      var accordion = document.createElement('div');
      accordion.className = 'mega-menu__accordion';
      var btnTemplate = megaMenu.querySelector('.mega-menu__btn');

      megaTabs.forEach(function (tab) {
        var category = tab.getAttribute('data-category');
        var panel = megaMenu.querySelector('.mega-menu__panel[data-panel="' + category + '"]');

        var trigger = document.createElement('button');
        trigger.className = 'mega-menu__accordion-trigger';
        trigger.textContent = tab.textContent;
        trigger.setAttribute('data-category', category);

        var content = document.createElement('div');
        content.className = 'mega-menu__accordion-content';
        content.style.height = '0';
        content.style.overflow = 'hidden';
        if (panel) content.innerHTML = panel.innerHTML;
        // Add "all products" button inside each category
        if (btnTemplate) {
          var btn = btnTemplate.cloneNode(true);
          btn.classList.add('mega-menu__btn--accordion');
          content.appendChild(btn);
        }

        trigger.addEventListener('click', function () {
          var wasOpen = trigger.classList.contains('mega-menu__accordion-trigger--active');

          // Close all open items with GSAP
          accordion.querySelectorAll('.mega-menu__accordion-trigger--active').forEach(function (t) {
            t.classList.remove('mega-menu__accordion-trigger--active');
          });
          accordion.querySelectorAll('.mega-menu__accordion-content').forEach(function (c) {
            if (typeof gsap !== 'undefined') {
              gsap.to(c, { height: 0, opacity: 0, duration: 0.3, ease: 'power2.inOut' });
            } else {
              c.style.height = '0';
            }
          });

          if (!wasOpen) {
            trigger.classList.add('mega-menu__accordion-trigger--active');
            // Measure natural height then animate
            content.style.height = 'auto';
            content.style.opacity = '0';
            var h = content.offsetHeight;
            content.style.height = '0';
            if (typeof gsap !== 'undefined') {
              gsap.to(content, { height: h, opacity: 1, duration: 0.4, ease: 'power3.out' });
            } else {
              content.style.height = h + 'px';
              content.style.opacity = '1';
            }
          }
        });

        accordion.appendChild(trigger);
        accordion.appendChild(content);
      });

      megaMenu.appendChild(accordion);
    }

    // Build accordion on first mobile open
    if (megaTrigger) {
      megaTrigger.addEventListener('click', function () {
        if (window.innerWidth <= 768) {
          buildMobileAccordion();
        }
      });
    }
  }

  // ============================================
  // Submenu Dropdowns (About, Visitors, etc.)
  // ============================================
  var submenuItems = document.querySelectorAll('.header-nav__item--submenu');

  submenuItems.forEach(function (item) {
    var trigger = item.querySelector('.header-nav__link');
    var submenu = item.querySelector('.submenu');
    if (!trigger || !submenu) return;

    trigger.setAttribute('aria-expanded', 'false');

    function positionSubmenuArrow() {
      var menuRect = submenu.getBoundingClientRect();
      var triggerRect = trigger.getBoundingClientRect();
      var triggerCenterX = triggerRect.left + triggerRect.width / 2;
      var arrowRight = menuRect.right - triggerCenterX;
      submenu.style.setProperty('--submenu-arrow-right', arrowRight + 'px');
    }

    function openSubmenu() {
      // Close any other open submenus and mega menu
      closeAllSubmenus();
      if (megaMenu && megaMenu.classList.contains('mega-menu--open')) closeMega();
      submenu.classList.add('submenu--open');
      item.classList.add('is-open');
      trigger.setAttribute('aria-expanded', 'true');
      // Position arrow after it's visible
      requestAnimationFrame(positionSubmenuArrow);
    }

    function closeSubmenu() {
      submenu.classList.remove('submenu--open');
      item.classList.remove('is-open');
      trigger.setAttribute('aria-expanded', 'false');
    }

    trigger.addEventListener('click', function (e) {
      e.preventDefault();
      if (submenu.classList.contains('submenu--open')) {
        closeSubmenu();
      } else {
        openSubmenu();
      }
    });

    // Image swap — hover on desktop, click on mobile
    var submenuLinks = submenu.querySelectorAll('.submenu__link');
    var imageContainer = submenu.querySelector('.submenu__image');

    function swapImage(link) {
      var imgSrc = link.getAttribute('data-img');
      if (!imgSrc || !imageContainer) return;
      var existingImg = imageContainer.querySelector('img');
      if (existingImg) {
        existingImg.style.opacity = '0';
        setTimeout(function () {
          existingImg.src = imgSrc;
          existingImg.alt = link.textContent;
          existingImg.style.opacity = '1';
        }, 150);
      } else {
        var placeholder = imageContainer.querySelector('.submenu__placeholder');
        if (placeholder) placeholder.style.display = 'none';
        var img = document.createElement('img');
        img.src = imgSrc;
        img.alt = link.textContent;
        img.style.opacity = '0';
        imageContainer.appendChild(img);
        setTimeout(function () { img.style.opacity = '1'; }, 50);
      }
    }

    submenuLinks.forEach(function (link) {
      // Desktop: hover
      link.addEventListener('mouseenter', function () {
        if (window.innerWidth > 768) swapImage(link);
      });
      // Mobile: click swaps image, then navigates
      link.addEventListener('click', function (e) {
        if (window.innerWidth <= 768) {
          // First click: swap image, prevent navigation
          var currentImg = imageContainer ? imageContainer.querySelector('img') : null;
          var imgSrc = link.getAttribute('data-img');
          if (imgSrc && (!currentImg || currentImg.src.indexOf(imgSrc) === -1)) {
            e.preventDefault();
            swapImage(link);
          }
          // Second click (same image already showing): navigate normally
        }
      });
    });
  });

  function closeAllSubmenus() {
    submenuItems.forEach(function (item) {
      var submenu = item.querySelector('.submenu');
      var trigger = item.querySelector('.header-nav__link');
      if (submenu) submenu.classList.remove('submenu--open');
      item.classList.remove('is-open');
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
    });
  }

  // Close submenus when clicking outside
  document.addEventListener('click', function (e) {
    var inSubmenu = e.target.closest('.header-nav__item--submenu');
    var inMega = e.target.closest('.header-nav__item--mega');
    if (!inSubmenu) closeAllSubmenus();
  });

  // Close submenus on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeAllSubmenus();
  });

  // Also close submenus when opening mega menu
  if (megaTrigger) {
    var origMegaClick = megaTrigger.getAttribute('data-has-submenu-hook');
    if (!origMegaClick) {
      megaTrigger.setAttribute('data-has-submenu-hook', 'true');
      megaTrigger.addEventListener('click', function () {
        closeAllSubmenus();
      });
    }
  }

  // ============================================
  // Close mobile menu on resize to desktop
  // ============================================
  window.addEventListener('resize', function () {
    if (window.innerWidth > 768 && headerNav) {
      hamburger.classList.remove('hamburger--active');
      headerNav.classList.remove('header-nav--open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });


  // ============================================
  // PRODUCT PAGE: Quantity Selector
  // ============================================
  const qtyInput = document.querySelector('.product__qty-input');
  const qtyMinus = document.querySelector('.product__qty-btn--minus');
  const qtyPlus = document.querySelector('.product__qty-btn--plus');

  if (qtyInput && qtyMinus && qtyPlus) {
    qtyMinus.addEventListener('click', function () {
      const val = parseInt(qtyInput.value, 10) || 1;
      if (val > 1) qtyInput.value = val - 1;
    });

    qtyPlus.addEventListener('click', function () {
      const val = parseInt(qtyInput.value, 10) || 1;
      if (val < 99) qtyInput.value = val + 1;
    });

    qtyInput.addEventListener('change', function () {
      let val = parseInt(qtyInput.value, 10);
      if (isNaN(val) || val < 1) val = 1;
      if (val > 99) val = 99;
      qtyInput.value = val;
    });
  }


  // ============================================
  // PRODUCT PAGE: Image Thumbnails
  // ============================================
  const thumbs = document.querySelectorAll('.product__thumb');
  const mainImage = document.querySelector('.product__main-image .product__img');
  if (thumbs.length && mainImage) {
    thumbs.forEach(function (thumb) {
      thumb.addEventListener('click', function () {
        thumbs.forEach(function (t) { t.classList.remove('product__thumb--active'); });
        thumb.classList.add('product__thumb--active');

        // Swap main image with fade
        var newSrc = thumb.getAttribute('data-src');
        if (newSrc) {
          mainImage.style.opacity = '0';
          setTimeout(function () {
            mainImage.src = newSrc;
            mainImage.style.opacity = '1';
          }, 200);
        }
      });
    });
  }


  // ============================================
  // PRODUCT PAGE: Tabs
  // ============================================
  const tabBtns = document.querySelectorAll('.product-tabs__btn');
  const tabPanels = document.querySelectorAll('.product-tabs__panel');

  if (tabBtns.length) {
    tabBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const targetId = btn.getAttribute('aria-controls');

        // Deactivate all
        tabBtns.forEach(function (b) {
          b.classList.remove('product-tabs__btn--active');
          b.setAttribute('aria-selected', 'false');
        });
        tabPanels.forEach(function (p) {
          p.classList.remove('product-tabs__panel--active');
          p.setAttribute('hidden', '');
        });

        // Activate clicked
        btn.classList.add('product-tabs__btn--active');
        btn.setAttribute('aria-selected', 'true');
        const panel = document.getElementById(targetId);
        if (panel) {
          panel.classList.add('product-tabs__panel--active');
          panel.removeAttribute('hidden');
        }
      });
    });
  }


  // ============================================
  // PRODUCT PAGE: Flavor Bars Animation
  // ============================================
  const flavorBars = document.querySelectorAll('.product__flavor-fill');
  if (flavorBars.length && typeof gsap !== 'undefined') {
    // Store target widths, set to 0, then animate in
    flavorBars.forEach(function (bar) {
      const targetWidth = bar.style.width;
      bar.style.width = '0%';

      // Use IntersectionObserver to animate when visible
      const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            gsap.to(bar, {
              width: targetWidth,
              duration: 1,
              ease: 'power2.out',
              delay: 0.2
            });
            observer.unobserve(bar);
          }
        });
      }, { threshold: 0.3 });

      observer.observe(bar);
    });
  }


  // ============================================
  // PRODUCT PAGE: Related Products Swiper
  // ============================================
  const relatedSwiper = document.querySelector('.related__swiper');
  if (relatedSwiper && typeof Swiper !== 'undefined') {
    new Swiper('.related__swiper', {
      slidesPerView: 2,
      spaceBetween: 16,
      loop: true,
      navigation: {
        nextEl: '.related__nav--next',
        prevEl: '.related__nav--prev',
      },
      breakpoints: {
        600: {
          slidesPerView: 3,
          spaceBetween: 20,
        },
        900: {
          slidesPerView: 4,
          spaceBetween: 24,
        },
        1200: {
          slidesPerView: 5,
          spaceBetween: 24,
        },
      },
    });
  }


  // ============================================
  // PRODUCT PAGE: Add to Cart Button Feedback
  // ============================================
  const addToCartBtn = document.querySelector('.product__add-to-cart');
  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', function () {
      const originalText = addToCartBtn.textContent;
      addToCartBtn.textContent = 'נוסף לסל ✓';
      addToCartBtn.style.background = 'var(--color-olive-700)';

      setTimeout(function () {
        addToCartBtn.innerHTML = 'הוספה לסל &rsaquo;';
        addToCartBtn.style.background = '';
      }, 1500);
    });
  }


  // ============================================
  // CATEGORY PAGE: Sticky Filters — sync with header scroll state
  // ============================================
  var catFilters = document.querySelector('.cat-filters');
  if (catFilters && header) {
    // Mirror header's --scrolled class for sticky top position
    var filterObserver = new MutationObserver(function () {
      if (header.classList.contains('site-header--scrolled')) {
        catFilters.classList.add('cat-filters--scrolled');
      } else {
        catFilters.classList.remove('cat-filters--scrolled');
      }
    });
    filterObserver.observe(header, { attributes: true, attributeFilter: ['class'] });

    // Detect when filter is actually stuck using a sentinel element
    var sentinel = document.createElement('div');
    sentinel.style.height = '1px';
    sentinel.style.width = '100%';
    sentinel.style.position = 'relative';
    sentinel.style.visibility = 'hidden';
    sentinel.style.pointerEvents = 'none';
    catFilters.parentNode.insertBefore(sentinel, catFilters);

    var stickyObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        // When sentinel scrolls out of view, the filter is stuck
        if (!entry.isIntersecting) {
          catFilters.classList.add('cat-filters--stuck');
        } else {
          catFilters.classList.remove('cat-filters--stuck');
        }
      });
    }, { threshold: 0 });

    stickyObserver.observe(sentinel);
  }


  // ============================================
  // CATEGORY PAGE: View Switcher
  // ============================================
  const catViewToggle = document.getElementById('catViewToggle');
  const catViewMenu = document.getElementById('catViewMenu');
  const catGridItems = document.querySelector('.cat-grid__items');

  if (catViewToggle && catViewMenu && catGridItems) {
    // Toggle dropdown
    catViewToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = catViewMenu.classList.contains('cat-view__menu--open');
      catViewMenu.classList.toggle('cat-view__menu--open');
      catViewToggle.setAttribute('aria-expanded', !isOpen);
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.cat-view')) {
        catViewMenu.classList.remove('cat-view__menu--open');
        catViewToggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Handle option click
    catViewMenu.querySelectorAll('.cat-view__option').forEach(function (opt) {
      opt.addEventListener('click', function () {
        var cols = opt.getAttribute('data-cols');

        // Update active state
        catViewMenu.querySelectorAll('.cat-view__option').forEach(function (o) {
          o.classList.remove('cat-view__option--active');
          o.removeAttribute('aria-selected');
        });
        opt.classList.add('cat-view__option--active');
        opt.setAttribute('aria-selected', 'true');

        // Remove existing layout classes
        catGridItems.classList.remove(
          'cat-grid__items--cols-5',
          'cat-grid__items--cols-3',
          'cat-grid__items--cols-2',
          'cat-grid__items--list'
        );

        // Apply new layout
        if (cols === '5') {
          catGridItems.classList.add('cat-grid__items--cols-5');
        } else if (cols === '3') {
          catGridItems.classList.add('cat-grid__items--cols-3');
        } else if (cols === '2') {
          catGridItems.classList.add('cat-grid__items--cols-2');
        } else if (cols === 'list') {
          catGridItems.classList.add('cat-grid__items--list');
        }
        // cols === '4' is the default (no extra class)

        // Close dropdown
        catViewMenu.classList.remove('cat-view__menu--open');
        catViewToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }


  // ============================================
  // CATEGORY PAGE: Quantity Selectors
  // ============================================
  document.querySelectorAll('.cat-card__qty').forEach(function (qtyWrapper) {
    const input = qtyWrapper.querySelector('.cat-card__qty-input');
    const btns = qtyWrapper.querySelectorAll('.cat-card__qty-btn');
    if (!input || btns.length < 2) return;

    btns[0].addEventListener('click', function () {
      var val = parseInt(input.value, 10) || 1;
      if (val > 1) input.value = val - 1;
    });

    btns[1].addEventListener('click', function () {
      var val = parseInt(input.value, 10) || 1;
      if (val < 99) input.value = val + 1;
    });

    input.addEventListener('change', function () {
      var val = parseInt(input.value, 10);
      if (isNaN(val) || val < 1) input.value = 1;
      if (val > 99) input.value = 99;
    });
  });


  // ============================================
  // CATEGORY PAGE: Add to Cart Button Feedback
  // ============================================
  document.querySelectorAll('.cat-card__add-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      btn.textContent = 'נוסף לסל ✓';
      btn.style.background = 'var(--color-olive-700)';

      setTimeout(function () {
        btn.textContent = 'הוספה לסל';
        btn.style.background = '';
      }, 1500);
    });
  });


  // ============================================
  // CART PAGE
  // ============================================
  var cartSection = document.querySelector('.cart');
  var cartEmpty = document.getElementById('cartEmpty');

  if (cartSection) {

    // Helper: format number as ₪ price
    function formatPrice(num) {
      return '₪' + num.toLocaleString('he-IL');
    }

    // Recalculate all subtotals and the order total
    function recalcCart() {
      var rows = document.querySelectorAll('.cart__row');
      var subtotalSum = 0;

      rows.forEach(function (row) {
        var input = row.querySelector('.cart__qty-input');
        var subtotalEl = row.querySelector('.cart__subtotal');
        if (!input || !subtotalEl) return;

        var price = parseFloat(input.getAttribute('data-price')) || 0;
        var qty = parseInt(input.value, 10) || 1;
        var lineTotal = price * qty;
        subtotalEl.textContent = formatPrice(lineTotal);
        subtotalSum += lineTotal;
      });

      // Update summary subtotal
      var cartSubtotalEl = document.getElementById('cartSubtotal');
      if (cartSubtotalEl) cartSubtotalEl.textContent = formatPrice(subtotalSum);

      // Update total (subtotal + shipping)
      updateTotal(subtotalSum);

      // Check empty state
      if (rows.length === 0) {
        cartSection.hidden = true;
        if (cartEmpty) cartEmpty.hidden = false;
      }
    }

    // Calculate total with shipping
    function updateTotal(subtotal) {
      if (typeof subtotal === 'undefined') {
        // Recalculate subtotal
        subtotal = 0;
        document.querySelectorAll('.cart__row').forEach(function (row) {
          var input = row.querySelector('.cart__qty-input');
          if (!input) return;
          var price = parseFloat(input.getAttribute('data-price')) || 0;
          var qty = parseInt(input.value, 10) || 1;
          subtotal += price * qty;
        });
      }

      var shipping = 0;
      var checkedRadio = document.querySelector('input[name="shipping"]:checked');
      if (checkedRadio) {
        if (checkedRadio.value === 'express') shipping = 30;
      }

      var cartTotalEl = document.getElementById('cartTotal');
      if (cartTotalEl) cartTotalEl.textContent = formatPrice(subtotal + shipping);
    }

    // --- Quantity selectors ---
    document.querySelectorAll('.cart__qty').forEach(function (qtyWrapper) {
      var input = qtyWrapper.querySelector('.cart__qty-input');
      var btns = qtyWrapper.querySelectorAll('.cart__qty-btn');
      if (!input || btns.length < 2) return;

      btns[0].addEventListener('click', function () {
        var val = parseInt(input.value, 10) || 1;
        if (val > 1) {
          input.value = val - 1;
          recalcCart();
        }
      });

      btns[1].addEventListener('click', function () {
        var val = parseInt(input.value, 10) || 1;
        if (val < 99) {
          input.value = val + 1;
          recalcCart();
        }
      });

      input.addEventListener('change', function () {
        var val = parseInt(input.value, 10);
        if (isNaN(val) || val < 1) input.value = 1;
        if (val > 99) input.value = 99;
        recalcCart();
      });
    });

    // --- Remove item ---
    document.querySelectorAll('.cart__remove').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var row = btn.closest('.cart__row');
        if (!row) return;
        row.classList.add('cart__row--removing');
        setTimeout(function () {
          row.remove();
          recalcCart();
        }, 300);
      });
    });

    // --- Shipping option change ---
    document.querySelectorAll('input[name="shipping"]').forEach(function (radio) {
      radio.addEventListener('change', function () {
        updateTotal();
      });
    });

    // --- Coupon button ---
    var couponBtn = document.querySelector('.cart__coupon-btn');
    var couponInput = document.querySelector('.cart__coupon-input');
    if (couponBtn && couponInput) {
      couponBtn.addEventListener('click', function () {
        var code = couponInput.value.trim();
        if (!code) {
          couponInput.focus();
          return;
        }
        couponBtn.textContent = 'קופון הוחל ✓';
        couponBtn.classList.add('cart__coupon-btn--applied');
        couponInput.disabled = true;

        setTimeout(function () {
          couponBtn.textContent = 'החלת קופון';
          couponBtn.classList.remove('cart__coupon-btn--applied');
          couponInput.disabled = false;
          couponInput.value = '';
        }, 2000);
      });
    }

    // --- Sticky summary: sync with header scroll state ---
    var cartSummary = document.querySelector('.cart__summary');
    if (cartSummary && header) {
      // Set initial state
      if (header.classList.contains('site-header--scrolled')) {
        cartSummary.classList.add('cart__summary--scrolled');
      }
      // Watch for changes
      var summaryObserver = new MutationObserver(function () {
        if (header.classList.contains('site-header--scrolled')) {
          cartSummary.classList.add('cart__summary--scrolled');
        } else {
          cartSummary.classList.remove('cart__summary--scrolled');
        }
      });
      summaryObserver.observe(header, { attributes: true, attributeFilter: ['class'] });
    }

    // --- Update cart button ---
    var updateBtn = document.querySelector('.cart__update-btn');
    if (updateBtn) {
      updateBtn.addEventListener('click', function () {
        recalcCart();
        var origText = updateBtn.textContent;
        updateBtn.textContent = 'הסל עודכן ✓';
        updateBtn.style.background = 'var(--color-olive-700)';
        setTimeout(function () {
          updateBtn.textContent = origText;
          updateBtn.style.background = '';
        }, 1500);
      });
    }
  }


  // ============================================
  // CHECKOUT PAGE
  // ============================================
  var checkoutSection = document.querySelector('.checkout');

  if (checkoutSection) {

    // --- Login toggle ---
    var loginToggle = document.getElementById('checkoutLoginToggle');
    var loginForm = document.getElementById('checkoutLoginForm');
    if (loginToggle && loginForm) {
      loginToggle.addEventListener('click', function () {
        loginForm.hidden = !loginForm.hidden;
      });
    }

    // --- Coupon toggle ---
    var couponToggle = document.getElementById('checkoutCouponToggle');
    var couponForm = document.getElementById('checkoutCouponForm');
    if (couponToggle && couponForm) {
      couponToggle.addEventListener('click', function () {
        couponForm.hidden = !couponForm.hidden;
      });
    }

    // --- Ship to different address ---
    var shipDifferent = document.getElementById('shipDifferent');
    var shippingFieldset = document.getElementById('shippingFieldset');
    if (shipDifferent && shippingFieldset) {
      shipDifferent.addEventListener('change', function () {
        shippingFieldset.hidden = !shipDifferent.checked;
      });
    }

    // --- Payment method switching ---
    var payOptions = document.querySelectorAll('.checkout__pay-option');
    var payRadios = document.querySelectorAll('input[name="payment_method"]');
    payRadios.forEach(function (radio) {
      radio.addEventListener('change', function () {
        payOptions.forEach(function (opt) {
          var body = opt.querySelector('.checkout__pay-body');
          if (opt.getAttribute('data-method') === radio.value) {
            opt.classList.add('checkout__pay-option--active');
            if (body) body.hidden = false;
          } else {
            opt.classList.remove('checkout__pay-option--active');
            if (body) body.hidden = true;
          }
        });
      });
    });

    // --- Shipping option changes total ---
    var chkShippingRadios = document.querySelectorAll('input[name="chk_shipping"]');
    var checkoutTotalEl = document.getElementById('checkoutTotal');
    var chkSubtotal = 316; // static for demo

    function updateCheckoutTotal() {
      var shipping = 0;
      var checked = document.querySelector('input[name="chk_shipping"]:checked');
      if (checked && checked.value === 'express') shipping = 30;
      if (checkoutTotalEl) {
        checkoutTotalEl.textContent = '₪' + (chkSubtotal + shipping).toLocaleString('he-IL');
      }
    }

    chkShippingRadios.forEach(function (r) {
      r.addEventListener('change', updateCheckoutTotal);
    });

    // --- Sticky sidebar: sync with header scroll state ---
    var chkSidebar = document.querySelector('.checkout__sidebar');
    if (chkSidebar && header) {
      if (header.classList.contains('site-header--scrolled')) {
        chkSidebar.classList.add('checkout__sidebar--scrolled');
      }
      var chkSidebarObserver = new MutationObserver(function () {
        if (header.classList.contains('site-header--scrolled')) {
          chkSidebar.classList.add('checkout__sidebar--scrolled');
        } else {
          chkSidebar.classList.remove('checkout__sidebar--scrolled');
        }
      });
      chkSidebarObserver.observe(header, { attributes: true, attributeFilter: ['class'] });
    }

    // --- Place order button (demo feedback) ---
    var placeBtn = document.getElementById('placeOrderBtn');
    var termsCheck = document.getElementById('termsAgree');
    if (placeBtn) {
      placeBtn.addEventListener('click', function (e) {
        e.preventDefault();

        // Check terms
        if (termsCheck && !termsCheck.checked) {
          termsCheck.closest('.chk-checkbox').style.color = 'var(--color-gold-dark)';
          termsCheck.focus();
          setTimeout(function () {
            termsCheck.closest('.chk-checkbox').style.color = '';
          }, 2000);
          return;
        }

        // Check required fields
        var requiredInputs = checkoutSection.querySelectorAll('[required]');
        var firstInvalid = null;
        requiredInputs.forEach(function (inp) {
          if (!inp.value.trim() && !firstInvalid && inp.type !== 'checkbox') {
            firstInvalid = inp;
          }
        });

        if (firstInvalid) {
          firstInvalid.focus();
          firstInvalid.style.borderColor = 'var(--color-gold-dark)';
          setTimeout(function () {
            firstInvalid.style.borderColor = '';
          }, 2000);
          return;
        }

        // Success feedback
        placeBtn.textContent = 'מעבד הזמנה...';
        placeBtn.disabled = true;
        setTimeout(function () {
          placeBtn.textContent = 'ההזמנה התקבלה ✓';
          placeBtn.style.background = 'var(--color-olive-700)';
        }, 1500);
      });
    }
  }


  /* ==============================================
     ACCOUNT PAGE
     ============================================== */
  var accountSection = document.querySelector('.account');
  if (accountSection) {

    // --- Tab switching (works for both page tabs and modal tabs) ---
    var allTabLists = document.querySelectorAll('.account__tabs');
    allTabLists.forEach(function (tabList) {
      var tabs = tabList.querySelectorAll('.account__tab');
      // find the parent wrapper that contains the forms
      var wrapper = tabList.closest('.account__wrapper') || tabList.closest('.auth-modal__content');

      tabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
          var target = tab.getAttribute('data-tab');

          // Update active tab
          tabs.forEach(function (t) {
            t.classList.remove('account__tab--active');
            t.setAttribute('aria-selected', 'false');
          });
          tab.classList.add('account__tab--active');
          tab.setAttribute('aria-selected', 'true');

          // Show matching form, hide others
          if (wrapper) {
            var forms = wrapper.querySelectorAll('.account__form');
            forms.forEach(function (form) {
              if (form.getAttribute('data-panel') === target) {
                form.classList.add('account__form--active');
              } else {
                form.classList.remove('account__form--active');
              }
            });
          }
        });
      });
    });

    // --- Password show/hide toggle ---
    var eyeBtns = document.querySelectorAll('.account__eye');
    eyeBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var wrap = btn.closest('.account__password-wrap');
        var input = wrap ? wrap.querySelector('.account__input') : null;
        if (!input) return;

        var isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';
        btn.setAttribute('aria-label', isPassword ? 'הסתר סיסמה' : 'הצג סיסמה');

        // Swap icon (open eye ↔ crossed eye)
        if (isPassword) {
          btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/><path d="M14.12 14.12a3 3 0 1 1-4.24-4.24"/></svg>';
        } else {
          btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
        }
      });
    });

    // --- Password strength indicator ---
    var regPasswordInput = document.getElementById('regPassword');
    var strengthEl = document.getElementById('passwordStrength');

    if (regPasswordInput && strengthEl) {
      var bars = strengthEl.querySelectorAll('.account__strength-bar');

      regPasswordInput.addEventListener('input', function () {
        var val = regPasswordInput.value;
        var score = 0;

        if (val.length >= 8) score++;
        if (/[A-Z]/.test(val)) score++;
        if (/[0-9]/.test(val)) score++;
        if (/[^A-Za-z0-9]/.test(val)) score++;

        // Remove all level classes
        strengthEl.classList.remove('account__strength--weak', 'account__strength--fair', 'account__strength--good', 'account__strength--strong');

        if (val.length === 0) {
          bars.forEach(function (b) { b.style.opacity = ''; });
          return;
        }

        var level = score <= 1 ? 'weak' : score === 2 ? 'fair' : score === 3 ? 'good' : 'strong';
        strengthEl.classList.add('account__strength--' + level);

        bars.forEach(function (b, i) {
          b.style.opacity = i < score ? '1' : '';
        });
      });
    }

    // --- Auth modal open/close ---
    var authModal = document.getElementById('authModal');
    var authBackdrop = document.getElementById('authBackdrop');
    var authClose = document.getElementById('authClose');

    function openAuthModal() {
      if (!authModal) return;
      authModal.classList.add('auth-modal--open');
      authModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeAuthModal() {
      if (!authModal) return;
      authModal.classList.remove('auth-modal--open');
      authModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    // Open modal from "מועדון לקוחות" link in header (if on other pages)
    var clubLinks = document.querySelectorAll('a[href*="account"], .header-nav__link--active');
    // For demo: clicking "שכחתי סיסמה" opens modal with register tab
    var forgotLinks = document.querySelectorAll('.account__forgot');
    forgotLinks.forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        // Feedback: just show a brief message
        var original = link.textContent;
        link.textContent = 'קישור נשלח למייל ✓';
        link.style.color = 'var(--color-olive-700)';
        setTimeout(function () {
          link.textContent = original;
          link.style.color = '';
        }, 2500);
      });
    });

    if (authClose) {
      authClose.addEventListener('click', closeAuthModal);
    }
    if (authBackdrop) {
      authBackdrop.addEventListener('click', closeAuthModal);
    }

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && authModal && authModal.classList.contains('auth-modal--open')) {
        closeAuthModal();
      }
    });

    // --- Form submit feedback (demo) ---
    var accountForms = document.querySelectorAll('.account__form');
    accountForms.forEach(function (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();

        // Check required fields
        var requiredInputs = form.querySelectorAll('[required]');
        var firstInvalid = null;
        requiredInputs.forEach(function (inp) {
          if (inp.type === 'checkbox' && !inp.checked && !firstInvalid) {
            firstInvalid = inp;
          } else if (inp.type !== 'checkbox' && !inp.value.trim() && !firstInvalid) {
            firstInvalid = inp;
          }
        });

        if (firstInvalid) {
          if (firstInvalid.type === 'checkbox') {
            firstInvalid.closest('label').style.color = 'var(--color-gold-dark)';
            setTimeout(function () {
              firstInvalid.closest('label').style.color = '';
            }, 2000);
          } else {
            firstInvalid.focus();
            firstInvalid.style.borderColor = 'var(--color-gold-dark)';
            setTimeout(function () {
              firstInvalid.style.borderColor = '';
            }, 2000);
          }
          return;
        }

        // Check password match for register forms
        var panel = form.getAttribute('data-panel');
        if (panel === 'register') {
          var pass = document.getElementById('regPassword');
          var confirm = document.getElementById('regPasswordConfirm');
          if (pass && confirm && pass.value !== confirm.value) {
            confirm.focus();
            confirm.style.borderColor = 'var(--color-gold-dark)';
            setTimeout(function () {
              confirm.style.borderColor = '';
            }, 2000);
            return;
          }
        }

        // Success feedback
        var submitBtn = form.querySelector('.account__submit');
        if (submitBtn) {
          var origText = submitBtn.textContent;
          submitBtn.textContent = panel && panel.indexOf('register') !== -1 ? 'נרשמת בהצלחה ✓' : 'התחברת בהצלחה ✓';
          submitBtn.disabled = true;
          submitBtn.style.background = 'var(--color-olive-700)';
          setTimeout(function () {
            submitBtn.textContent = origText;
            submitBtn.disabled = false;
            submitBtn.style.background = '';
          }, 2500);
        }
      });
    });
  }


  /* ============================================
     SEARCH OVERLAY
     ============================================ */
  var searchOverlay = document.getElementById('searchOverlay');
  var searchTriggers = document.querySelectorAll('.search-trigger, .util-icon[aria-label="חיפוש"]');

  if (searchOverlay) {
    var searchInput = searchOverlay.querySelector('.search-overlay__input');
    var searchClose = searchOverlay.querySelector('.search-overlay__close');
    var searchBackdrop = searchOverlay.querySelector('.search-overlay__backdrop');

    function openSearch() {
      searchOverlay.classList.add('search-overlay--open');
      searchOverlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      if (searchInput) {
        setTimeout(function () { searchInput.focus(); }, 100);
      }
    }

    function closeSearch() {
      searchOverlay.classList.remove('search-overlay--open');
      searchOverlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    searchTriggers.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        openSearch();
      });
    });

    if (searchClose) {
      searchClose.addEventListener('click', closeSearch);
    }

    if (searchBackdrop) {
      searchBackdrop.addEventListener('click', closeSearch);
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && searchOverlay.classList.contains('search-overlay--open')) {
        closeSearch();
      }
    });
  }


  /* ============================================
     SEARCH RESULTS - FILTER TABS
     ============================================ */
  var searchFilters = document.querySelectorAll('.search-results__filter');
  if (searchFilters.length > 0) {
    searchFilters.forEach(function (filter) {
      filter.addEventListener('click', function () {
        searchFilters.forEach(function (f) { f.classList.remove('search-results__filter--active'); });
        filter.classList.add('search-results__filter--active');

        // Get filter text
        var filterText = filter.textContent.trim().replace(/\d+/g, '').trim();
        var grid = document.querySelector('.search-results__grid');
        if (!grid) return;

        var productCards = grid.querySelectorAll('.cat-card');
        var contentCards = grid.querySelectorAll('.search-results__content-card');

        if (filterText === 'הכל') {
          productCards.forEach(function (c) { c.style.display = ''; });
          contentCards.forEach(function (c) { c.style.display = ''; });
        } else if (filterText === 'מוצרים') {
          productCards.forEach(function (c) { c.style.display = ''; });
          contentCards.forEach(function (c) { c.style.display = 'none'; });
        } else if (filterText === 'מאמרים') {
          productCards.forEach(function (c) { c.style.display = 'none'; });
          contentCards.forEach(function (c) {
            var typeEl = c.querySelector('.search-results__content-type');
            var isArticle = typeEl && typeEl.textContent.trim().indexOf('מאמר') !== -1;
            c.style.display = isArticle ? '' : 'none';
          });
        } else if (filterText === 'עמודים') {
          productCards.forEach(function (c) { c.style.display = 'none'; });
          contentCards.forEach(function (c) {
            var typeEl = c.querySelector('.search-results__content-type');
            var isPage = typeEl && typeEl.textContent.trim().indexOf('עמוד') !== -1;
            c.style.display = isPage ? '' : 'none';
          });
        }
      });
    });
  }

});
