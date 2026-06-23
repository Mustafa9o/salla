import MobileMenu from 'mmenu-light';
import Swal from 'sweetalert2';
import Anime from './partials/anime';
import initTootTip from './partials/tooltip';
import AppHelpers from "./app-helpers";

class App extends AppHelpers {
  constructor() {
    super();
    window.app = this;
  }

  loadTheApp() {
    this.commonThings();
    this.initiateNotifier();
    this.initiateMobileMenu();
    if (header_is_sticky) {
      this.initiateStickyMenu();
    }
    this.initAddToCart();
    this.initiateDropdowns();
    this.initiateModals();
    this.initiateCollapse();
    
    // Ensure #more-menu-dropdown exists before running changeMenuDirection
    const menuDirInterval = setInterval(() => {
      if (document.querySelector('#more-menu-dropdown')) {
        this.changeMenuDirection();
        clearInterval(menuDirInterval);
      }
    }, 100);

    initTootTip();
    this.loadModalImgOnclick();

    salla.comment.event.onAdded(() => window.location.reload());

    this.status = 'ready';
    document.dispatchEvent(new CustomEvent('theme::ready'));
    this.log('Theme Loaded 🎉');
  }

  log(message) {
    salla.log(`ThemeApp(Raed)::${message}`);
    return this;
  }

    changeMenuDirection() {
      setTimeout(() => {
        app.all('.root-level.has-children', item => {
          if (item.classList.contains('change-menu-dir')) return;
          app.on('mouseover', item, () => {
            let allSubMenus = item.querySelectorAll('.sub-menu');
            allSubMenus.forEach((submenu, idx) => {
              if (idx === 0) return;
              let rect = submenu.getBoundingClientRect();
              if (rect.left < 10 || rect.right > window.innerWidth - 10) {
                app.addClass(item, 'change-menu-dir');
              }
            });
          });
        });
      }, 1000);
    }

  loadModalImgOnclick(){
    document.querySelectorAll('.load-img-onclick').forEach(link => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        let modal = document.querySelector('#' + link.dataset.modalId),
          img = modal.querySelector('img'),
          imgSrc = img.dataset.src;
        modal.open();

        if (img.classList.contains('loaded')) return;

        img.src = imgSrc;
        img.classList.add('loaded');
      })
    })
  }

  commonThings() {
    this.cleanContentArticles('.content-entry');
  }

  cleanContentArticles(elementsSelector) {
    let articleElements = document.querySelectorAll(elementsSelector);

    if (articleElements.length) {
      articleElements.forEach(article => {
        article.innerHTML = article.innerHTML.replace(/\&nbsp;/g, ' ')
      })
    }
  }

isElementLoaded(selector){
  return new Promise((resolve=>{
    const interval=setInterval(()=>{
    if(document.querySelector(selector)){
      clearInterval(interval)
      return resolve(document.querySelector(selector))
    }
   },160)
}))

  
  };

  copyToClipboard(event) {
    event.preventDefault();
    let aux = document.createElement("input"),
    btn = event.currentTarget;
    aux.setAttribute("value", btn.dataset.content);
    document.body.appendChild(aux);
    aux.select();
    document.execCommand("copy");
    document.body.removeChild(aux);
    this.toggleElementClassIf(btn, 'copied', 'code-to-copy', () => true);
    setTimeout(() => {
      this.toggleElementClassIf(btn, 'code-to-copy', 'copied', () => true)
    }, 1000);
  }

  initiateNotifier() {
    salla.notify.setNotifier(function (message, type, data) {
      if (window.enable_add_product_toast && data?.data?.googleTags?.event === "addToCart") {
        return;
      }
      if (typeof message == 'object') {
        return Swal.fire(message).then(type);
      }

      return Swal.mixin({
        toast: true,
        position: salla.config.get('theme.is_rtl') ? 'top-start' : 'top-end',
        showConfirmButton: false,
        timer: 2000,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      }).fire({
        icon: type,
        title: message,
        showCloseButton: true,
        timerProgressBar: true
      })
    });
  }


  initiateMobileMenu() {

  this.isElementLoaded('#mobile-menu').then((menu) => {

 
  const mobileMenu = new MobileMenu(menu, "(max-width: 1024px)", "( slidingSubmenus: false)");

  salla.lang.onLoaded(() => {
    mobileMenu.navigation({ title: salla.lang.get('blocks.header.main_menu') });
  });
  const drawer = mobileMenu.offcanvas({ position: salla.config.get('theme.is_rtl') ? "right" : 'left' });

  this.onClick("a[href='#mobile-menu']", event => {
    document.body.classList.add('menu-opened');
    event.preventDefault() || drawer.close() || drawer.open()
    
  });
  this.onClick(".close-mobile-menu", event => {
    document.body.classList.remove('menu-opened');
    event.preventDefault() || drawer.close()
  });
  });

  }

  initiateStickyMenu() {
    let header = this.element('#mainnav'),
      height = this.element('#mainnav .inner')?.clientHeight;
    //when it's landing page, there is no header
    if (!header) {
      return;
    }

    window.addEventListener('load', () => setTimeout(() => this.setHeaderHeight(), 500))
    window.addEventListener('resize', () => this.setHeaderHeight())

    window.addEventListener('scroll', () => {
      window.scrollY >= header.offsetTop + height ? header.classList.add('fixed-pinned', 'animated') : header.classList.remove('fixed-pinned');
      window.scrollY >= 200 ? header.classList.add('fixed-header') : header.classList.remove('fixed-header', 'animated');
    }, { passive: true });
  }

  setHeaderHeight() {
    let height = this.element('#mainnav .inner').clientHeight,
      header = this.element('#mainnav');
    header.style.height = height + 'px';
  }

  initiateDropdowns() {
    this.onClick('.dropdown__trigger', ({ target: btn }) => {
      btn.parentElement.classList.toggle('is-opened');
      document.body.classList.toggle('dropdown--is-opened');
      // Click Outside || Click on close btn
      window.addEventListener('click', ({ target: element }) => {
        if (!element.closest('.dropdown__menu') && element !== btn || element.classList.contains('dropdown__close')) {
          btn.parentElement.classList.remove('is-opened');
          document.body.classList.remove('dropdown--is-opened');
        }
      });
    });
  }

  initiateModals() {
    this.onClick('[data-modal-trigger]', e => {
      let id = '#' + e.target.dataset.modalTrigger;
      this.removeClass(id, 'hidden');
      setTimeout(() => this.toggleModal(id, true)); //small amont of time to running toggle After adding hidden
    });
    salla.event.document.onClick("[data-close-modal]", e => this.toggleModal('#' + e.target.dataset.closeModal, false));
  }

  toggleModal(id, isOpen) {
    this.toggleClassIf(`${id} .s-salla-modal-overlay`, 'ease-out duration-300 opacity-100', 'opacity-0', () => isOpen)
      .toggleClassIf(`${id} .s-salla-modal-body`,
        'ease-out duration-300 opacity-100 translate-y-0 sm:scale-100', //add these classes
        'opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95', //remove these classes
        () => isOpen)
      .toggleElementClassIf(document.body, 'modal-is-open', 'modal-is-closed', () => isOpen);
    if (!isOpen) {
      setTimeout(() => this.addClass(id, 'hidden'), 350);
    }
  }

  initiateCollapse() {
    document.querySelectorAll('.btn--collapse')
      .forEach((trigger) => {
        const content = document.querySelector('#' + trigger.dataset.show);
        if (!content) return;

        const state = { isOpen: false }

        const toggleState = (isOpen) => {
          state.isOpen = !isOpen;
          this.toggleElementClassIf([content, trigger], 'is-closed', 'is-opened', () => isOpen);
        }

        trigger.addEventListener('click', () => {
          const { isOpen } = state;
          toggleState(isOpen);
        });
      });
  }


  /**
   * Workaround for seeking to simplify & clean, There are three ways to use this method:
   * 1- direct call: `this.anime('.my-selector')` - will use default values
   * 2- direct call with overriding defaults: `this.anime('.my-selector', {duration:3000})`
   * 3- return object to play it letter: `this.anime('.my-selector', false).duration(3000).play()` - will not play animation unless calling play method.
   * @param {string|HTMLElement} selector
   * @param {object|undefined|null|null} options - in case there is need to set attributes one by one set it `false`;
   * @return {Anime|*}
   */
  anime(selector, options = null) {
    let anime = new Anime(selector, options);
    return options === false ? anime : anime.play();
  }

  /**
   * These actions are responsible for pressing "add to cart" button,
   * they can be from any page, especially when mega-menu is enabled
   */
  initAddToCart() {
    salla.cart.event.onUpdated(summary => {
      document.querySelectorAll('[data-cart-total]').forEach(el => el.innerHTML = salla.money(summary.total));
      document.querySelectorAll('[data-cart-count]').forEach(el => el.innerText = salla.helpers.number(summary.count));
    });

    salla.cart.event.onItemAdded((response, prodId) => {
      app.element('salla-cart-summary').animateToCart(app.element(`#product-${prodId} img`));
    });
  }
}

salla.onReady(() => (new App).loadTheApp());
// ============================================================
// theme.js — Global JavaScript for the Ratio Coffee Salla Theme
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  // ===== Intro animation (mirrors App.tsx) =====
  const mainContent = document.getElementById('main-content');
  if (mainContent) {
    setTimeout(() => {
      mainContent.classList.add('slide-up');
    }, 4700);
  }

  // ===== Menu open/close =====
  const menuOpenBtn = document.getElementById('menu-open-btn');
  const menuCloseBtn = document.getElementById('menu-close-btn');
  const menuOverlay = document.getElementById('menu-overlay');

  function openMenu() {
    menuOverlay?.classList.remove('hidden');
    menuOverlay?.classList.add('flex');
  }

  function closeMenu() {
    menuOverlay?.classList.add('hidden');
    menuOverlay?.classList.remove('flex');
  }

  menuOpenBtn?.addEventListener('click', openMenu);
  menuCloseBtn?.addEventListener('click', closeMenu);

  // Close menu when clicking a link inside it
  menuOverlay?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  // ===== Category filter (homepage) =====
  window.filterByCategory = function (btn, categoryId) {
    // Update button styles
    document.querySelectorAll('[data-category]').forEach(b => {
      b.classList.remove('category-active', 'font-semibold', 'text-[#004876]');
      b.classList.add('font-normal', 'text-[#3b2f2f]');
    });
    btn.classList.add('category-active', 'font-semibold', 'text-[#004876]');
    btn.classList.remove('font-normal', 'text-[#3b2f2f]');

    // Show/hide product cards
    document.querySelectorAll('[data-product-category]').forEach(card => {
      const match = categoryId === 'all' || card.dataset.productCategory === String(categoryId);
      card.closest('a')?.parentElement && (card.closest('a').parentElement.style.display = match ? '' : 'none');
    });
  };

  // ===== Product page accordion =====
  let openTab = 'details';

  window.toggleTab = function (id) {
    const content = document.getElementById('acc-' + id);
    const chevron = document.getElementById('chevron-' + id);
    if (!content) return;

    if (openTab === id) {
      content.classList.add('hidden');
      chevron?.classList.remove('rotate-180');
      openTab = null;
    } else {
      if (openTab) {
        document.getElementById('acc-' + openTab)?.classList.add('hidden');
        document.getElementById('chevron-' + openTab)?.classList.remove('rotate-180');
      }
      content.classList.remove('hidden');
      chevron?.classList.add('rotate-180');
      openTab = id;
    }
  };

});

