/* ==========================================================
   Lyle & Scott — script.js
   Додає інтерактивність до index.html та about.html
   Підключення: <script src="script.js" defer></script>
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {
  injectRuntimeStyles();
  initHeaderScroll();
  initMobileMenu();
  initActiveNavLink();
  initCart();
  initSubscriptionForm();
  initScrollReveal();
  initBackToTop();
});

/* ----------------------------------------------------------
   0. Динамічні стилі для елементів, яких немає в CSS-файлах
---------------------------------------------------------- */
function injectRuntimeStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .burger {
      display: none;
      flex-direction: column;
      gap: 5px;
      cursor: pointer;
      background: none;
      border: none;
      padding: 5px;
    }
    .burger span {
      width: 28px;
      height: 3px;
      background: #2c3e50;
      border-radius: 2px;
      transition: all 0.3s ease;
    }
    .burger.open span:nth-child(1) { transform: translateY(8px) rotate(45deg); }
    .burger.open span:nth-child(2) { opacity: 0; }
    .burger.open span:nth-child(3) { transform: translateY(-8px) rotate(-45deg); }

    nav a.active {
      background: #2c3e50;
      color: #fff !important;
    }

    header {
      padding: 12px 50px !important;
    }
    header.scrolled {
      padding-top: 6px !important;
      padding-bottom: 6px !important;
      box-shadow: 0 4px 20px rgba(0,0,0,0.2);
    }
    .logo {
      font-size: 26px !important;
    }

    /* ---- Лого (жовтий птах) у hero-секції: трохи більший розмір ---- */
    .hero img {
      width: 320px !important;
      height: auto;
      transition: transform 0.3s ease;
    }
    .hero img:hover {
      transform: scale(1.05);
    }

    /* ---- Футер: рівне центрування ---- */
    footer .footer-content {
      display: flex;
      justify-content: space-evenly;
      align-items: flex-start;
      text-align: center;
    }
    footer .footer-section {
      flex: 1 1 200px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
    footer .footer-section h4 {
      width: 100%;
      text-align: center;
    }
    footer .footer-section p {
      text-align: center;
      line-height: 1.6;
    }
    footer .social-icons {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    footer p[style] {
      text-align: center !important;
    }

    /* ---- Кнопка "додати в кошик" на картці товару ---- */
    .add-to-cart-icon {
      position: absolute;
      top: 20px;
      left: 20px;
      width: 46px;
      height: 46px;
      border-radius: 50%;
      background: #ffffff;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      cursor: pointer;
      box-shadow: 0 5px 15px rgba(0,0,0,0.25);
      transition: all 0.3s ease;
      z-index: 10;
    }
    .add-to-cart-icon:hover {
      background: #2c3e50;
      transform: scale(1.15);
    }
    .add-to-cart-icon:hover .icon-glyph { filter: brightness(0) invert(1); }

    .add-to-cart-icon { overflow: visible; }

    .add-to-cart-icon .icon-glyph {
      display: inline-block;
      transition: transform 0.25s ease;
    }

    .add-to-cart-icon.added {
      background: #2f7a3a;
      animation: cartAddedPop 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    .add-to-cart-icon.added .icon-glyph {
      filter: brightness(0) invert(1);
    }

    @keyframes cartAddedPop {
      0%   { transform: scale(1); }
      35%  { transform: scale(1.4) rotate(-8deg); }
      60%  { transform: scale(0.9) rotate(4deg); }
      100% { transform: scale(1) rotate(0); }
    }

    .add-to-cart-icon .ripple {
      position: absolute;
      inset: 0;
      border-radius: 50%;
      border: 2px solid #2f7a3a;
      opacity: 0.9;
      transform: scale(1);
      animation: rippleOut 0.6s ease-out forwards;
      pointer-events: none;
    }
    @keyframes rippleOut {
      to {
        transform: scale(2.1);
        opacity: 0;
      }
    }

    .cart-badge.bump {
      animation: badgeBump 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    @keyframes badgeBump {
      0%   { transform: scale(1) rotate(0); }
      30%  { transform: scale(1.35) rotate(-10deg); }
      55%  { transform: scale(0.95) rotate(6deg); }
      100% { transform: scale(1) rotate(0); }
    }
    .cart-badge .cart-count.bump {
      animation: countPop 0.4s ease;
    }
    @keyframes countPop {
      0%   { transform: scale(0.4); opacity: 0; }
      60%  { transform: scale(1.3); opacity: 1; }
      100% { transform: scale(1); }
    }

    /* ---- Іконка кошика в хедері ---- */
    .cart-badge {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-left: 15px;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: #2c3e50;
      color: #fff;
      font-size: 20px;
      cursor: pointer;
      transition: transform 0.3s ease;
      border: none;
    }
    .cart-badge:hover { transform: scale(1.1); }
    .cart-badge .cart-count {
      position: absolute;
      top: -6px;
      right: -6px;
      background: #a81824;
      color: #fff;
      font-size: 12px;
      font-weight: bold;
      min-width: 20px;
      height: 20px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 4px;
    }

    /* ---- Панель кошика (drawer) ---- */
    .cart-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.45);
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.3s ease, visibility 0.3s ease;
      z-index: 4000;
    }
    .cart-overlay.open { opacity: 1; visibility: visible; }

    .cart-drawer {
      position: fixed;
      top: 0;
      right: 0;
      height: 100%;
      width: 380px;
      max-width: 90vw;
      background: #fff;
      box-shadow: -10px 0 40px rgba(0,0,0,0.3);
      transform: translateX(100%);
      transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      z-index: 4001;
      display: flex;
      flex-direction: column;
    }
    .cart-drawer.open { transform: translateX(0); }

    .cart-drawer-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 25px 25px 20px;
      border-bottom: 1px solid #e2e2e2;
    }
    .cart-drawer-header h2 {
      font-size: 22px;
      color: #2c3e50;
    }
    .cart-drawer-close {
      background: none;
      border: none;
      font-size: 26px;
      line-height: 1;
      cursor: pointer;
      color: #2c3e50;
      transition: transform 0.3s ease;
    }
    .cart-drawer-close:hover { transform: rotate(90deg); }

    .cart-drawer-items {
      flex: 1;
      overflow-y: auto;
      padding: 15px 25px;
    }
    .cart-empty {
      text-align: center;
      color: #888;
      margin-top: 60px;
      font-size: 16px;
    }
    .cart-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 10px;
      padding: 16px 0;
      border-bottom: 1px solid #eee;
    }
    .cart-item-info h4 {
      font-size: 16px;
      color: #2c3e50;
      margin-bottom: 4px;
    }
    .cart-item-info span {
      font-size: 14px;
      color: #777;
    }
    .cart-item-remove {
      background: none;
      border: none;
      color: #a81824;
      font-size: 22px;
      cursor: pointer;
      padding: 5px 10px;
      transition: transform 0.2s ease;
    }
    .cart-item-remove:hover { transform: scale(1.2); }

    .cart-drawer-footer {
      padding: 20px 25px 25px;
      border-top: 1px solid #e2e2e2;
    }
    .cart-total-row {
      display: flex;
      justify-content: space-between;
      font-size: 20px;
      font-weight: bold;
      color: #2c3e50;
      margin-bottom: 15px;
    }
    .cart-drawer-footer .checkout-btn,
    .cart-drawer-footer .clear-btn {
      width: 100%;
      padding: 14px;
      border: none;
      border-radius: 8px;
      font-weight: bold;
      cursor: pointer;
      margin-top: 10px;
      transition: all 0.3s ease;
    }
    .cart-drawer-footer .checkout-btn {
      background: #2c3e50;
      color: #fff;
    }
    .cart-drawer-footer .checkout-btn:hover { background: #1a252f; }
    .cart-drawer-footer .clear-btn {
      background: #f0f0f0;
      color: #a81824;
    }
    .cart-drawer-footer .clear-btn:hover { background: #e2e2e2; }

    /* ---- Toast ---- */
    .toast {
      position: fixed;
      bottom: 30px;
      right: 30px;
      background: #2c3e50;
      color: #fff;
      padding: 16px 24px;
      border-radius: 8px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
      transform: translateY(120%);
      opacity: 0;
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      z-index: 3000;
      max-width: 320px;
      white-space: pre-line;
    }
    .toast.show { transform: translateY(0); opacity: 1; }
    .toast.error { background: #a81824; }

    .back-to-top {
      position: fixed;
      bottom: 30px;
      left: 30px;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: #2c3e50;
      color: #fff;
      border: none;
      font-size: 22px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      visibility: hidden;
      transform: translateY(20px);
      transition: all 0.3s ease;
      z-index: 2500;
      box-shadow: 0 5px 20px rgba(0,0,0,0.25);
    }
    .back-to-top.show { opacity: 1; visibility: visible; transform: translateY(0); }
    .back-to-top:hover { transform: translateY(-5px); }

    .reveal {
      opacity: 0;
      transform: translateY(40px);
      transition: opacity 0.7s ease, transform 0.7s ease;
    }
    .reveal.in-view { opacity: 1; transform: translateY(0); }

    /* ---- Покращена секція підписки ---- */
    .subscription-form {
      background: linear-gradient(135deg, #2c3e50 0%, #4a5f77 100%) !important;
      position: relative;
      overflow: hidden;
    }
    .subscription-form h2 .mail-icon {
      display: inline-block;
      animation: floatMail 2.6s ease-in-out infinite;
    }
    @keyframes floatMail {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      50% { transform: translateY(-6px) rotate(-6deg); }
    }

    .subscribe-benefits {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 25px;
      margin-bottom: 30px;
      opacity: 0.95;
    }
    .subscribe-benefit {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 15px;
      background: rgba(255,255,255,0.12);
      padding: 8px 16px;
      border-radius: 30px;
      transition: all 0.3s ease;
    }
    .subscribe-benefit:hover {
      background: rgba(255,255,255,0.22);
      transform: translateY(-3px);
    }

    .form-group {
      position: relative;
    }
    .form-group .input-wrap {
      position: relative;
      flex: 1;
      min-width: 250px;
      display: flex;
      align-items: center;
    }
    .form-group .input-wrap .input-icon {
      position: absolute;
      left: 16px;
      font-size: 18px;
      pointer-events: none;
      opacity: 0.7;
    }
    .form-group input[type="email"] {
      width: 100%;
      padding-left: 46px !important;
    }

    .form-group button {
      position: relative;
      overflow: hidden;
    }
    .form-group button.success {
      background: #2f7a3a !important;
      color: #fff !important;
    }

    .subscription-form.shake {
      animation: formShake 0.4s ease;
    }
    @keyframes formShake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-8px); }
      75% { transform: translateX(8px); }
    }

    @media (max-width: 768px) {
      .burger { display: flex; }
      nav {
        display: none;
        flex-direction: column;
        width: 100%;
        text-align: center;
        gap: 10px;
        margin-top: 15px;
      }
      nav.nav-open { display: flex; }
      header { flex-wrap: wrap; }
      footer .footer-content { flex-direction: column; align-items: center; }
    }
  `;
  document.head.appendChild(style);
}

/* ----------------------------------------------------------
   1. Header: зменшення/тінь при скролі
---------------------------------------------------------- */
function initHeaderScroll() {
  const header = document.querySelector('header');
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll);
  onScroll();
}

/* ----------------------------------------------------------
   2. Мобільне меню (бургер)
---------------------------------------------------------- */
function initMobileMenu() {
  const header = document.querySelector('header');
  const nav = document.querySelector('header nav');
  if (!header || !nav) return;

  const burger = document.createElement('button');
  burger.className = 'burger';
  burger.setAttribute('aria-label', 'Відкрити меню');
  burger.innerHTML = '<span></span><span></span><span></span>';
  header.appendChild(burger);

  burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    nav.classList.toggle('nav-open');
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('open');
      nav.classList.remove('nav-open');
    });
  });
}

/* ----------------------------------------------------------
   3. Підсвітка активного пункту меню
---------------------------------------------------------- */
function initActiveNavLink() {
  const links = document.querySelectorAll('header nav a');
  const current = window.location.pathname.split('/').pop() || 'index.html';

  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href === current || (current === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/* ----------------------------------------------------------
   4. Кошик
   - окрема іконка на картці товару додає товар у кошик
   - кнопка "Купити зараз" більше НЕ додає товар у кошик
   - клік на іконку кошика в хедері відкриває панель перегляду
---------------------------------------------------------- */
function initCart() {
  const productCards = document.querySelectorAll('.product-card');
  const header = document.querySelector('header');
  if (!header) return;

  const getCart = () => JSON.parse(localStorage.getItem('ls_cart') || '[]');
  const saveCart = (cart) => localStorage.setItem('ls_cart', JSON.stringify(cart));

  /* --- іконка кошика в хедері --- */
  const cartBadge = document.createElement('button');
  cartBadge.className = 'cart-badge';
  cartBadge.innerHTML = '🛒<span class="cart-count">0</span>';
  cartBadge.setAttribute('aria-label', 'Відкрити кошик');
  header.appendChild(cartBadge);

  /* --- панель кошика (drawer) --- */
  const overlay = document.createElement('div');
  overlay.className = 'cart-overlay';

  const drawer = document.createElement('div');
  drawer.className = 'cart-drawer';
  drawer.innerHTML = `
    <div class="cart-drawer-header">
      <h2>Ваш кошик</h2>
      <button class="cart-drawer-close" aria-label="Закрити кошик">&times;</button>
    </div>
    <div class="cart-drawer-items"></div>
    <div class="cart-drawer-footer">
      <div class="cart-total-row">
        <span>Разом:</span>
        <span class="cart-total">0 ₴</span>
      </div>
      <button class="checkout-btn">Оформити замовлення</button>
      <button class="clear-btn">Очистити кошик</button>
    </div>
  `;

  document.body.appendChild(overlay);
  document.body.appendChild(drawer);

  const itemsWrap = drawer.querySelector('.cart-drawer-items');
  const totalEl = drawer.querySelector('.cart-total');
  const closeBtn = drawer.querySelector('.cart-drawer-close');
  const checkoutBtn = drawer.querySelector('.checkout-btn');
  const clearBtn = drawer.querySelector('.clear-btn');

  function render() {
    const cart = getCart();

    cartBadge.querySelector('.cart-count').textContent = cart.length;

    if (cart.length === 0) {
      itemsWrap.innerHTML = '<p class="cart-empty">Кошик порожній.<br>Додайте товари за допомогою іконки 🛒 на картці товару.</p>';
      totalEl.textContent = '0 ₴';
      return;
    }

    itemsWrap.innerHTML = cart.map((item, index) => `
      <div class="cart-item">
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <span>${item.price} ₴</span>
        </div>
        <button class="cart-item-remove" data-index="${index}" aria-label="Видалити">&times;</button>
      </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + item.price, 0);
    totalEl.textContent = `${total} ₴`;

    itemsWrap.querySelectorAll('.cart-item-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.index, 10);
        const updated = getCart();
        const removed = updated.splice(idx, 1)[0];
        saveCart(updated);
        render();
        if (removed) showToast(`«${removed.name}» видалено з кошика`);
      });
    });
  }

  function openDrawer() {
    render();
    overlay.classList.add('open');
    drawer.classList.add('open');
    document.body.style.overflow = 'hidden'; // забороняємо гортання сторінки, поки відкрито кошик
  }

  function closeDrawer() {
    overlay.classList.remove('open');
    drawer.classList.remove('open');
    document.body.style.overflow = ''; // повертаємо гортання сторінки
  }

  cartBadge.addEventListener('click', openDrawer);
  closeBtn.addEventListener('click', closeDrawer);
  overlay.addEventListener('click', closeDrawer);

  clearBtn.addEventListener('click', () => {
    saveCart([]);
    render();
    showToast('Кошик очищено');
  });

  checkoutBtn.addEventListener('click', () => {
    const cart = getCart();
    if (cart.length === 0) {
      showToast('Спочатку додайте товари в кошик', true);
      return;
    }
    saveCart([]);
    render();
    closeDrawer();
    showToast('Замовлення оформлено! Ми зв\u2019яжемося з вами найближчим часом.');
  });

  render();

  /* --- окрема іконка "додати в кошик" на кожній картці --- */
  productCards.forEach(card => {
    const image = card.querySelector('.product-image');
    if (!image) return;

    const addBtn = document.createElement('button');
    addBtn.className = 'add-to-cart-icon';
    addBtn.innerHTML = '<span class="icon-glyph">🛒</span>';
    addBtn.setAttribute('aria-label', 'Додати в кошик');
    image.style.position = image.style.position || 'relative';
    image.appendChild(addBtn);

    addBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const name = card.querySelector('h3')?.textContent.trim() || 'Товар';
      const priceText = card.querySelector('.price')?.textContent.trim() || '0 ₴';
      const price = parseInt(priceText.replace(/\D/g, ''), 10) || 0;

      const cart = getCart();
      cart.push({ name, price });
      saveCart(cart);

      // ripple-ефект навколо іконки
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      addBtn.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());

      // іконка на мить перетворюється на чекмарк і "пружинить"
      const glyph = addBtn.querySelector('.icon-glyph');
      const originalGlyph = glyph.textContent;
      addBtn.classList.remove('added');
      void addBtn.offsetWidth; // reflow, щоб анімація перезапустилась
      addBtn.classList.add('added');
      glyph.textContent = '✓';

      setTimeout(() => {
        addBtn.classList.remove('added');
        glyph.textContent = originalGlyph;
      }, 700);

      // бейдж кошика теж "підстрибує"
      cartBadge.classList.remove('bump');
      void cartBadge.offsetWidth;
      cartBadge.classList.add('bump');
      const countEl = cartBadge.querySelector('.cart-count');
      countEl.classList.remove('bump');
      void countEl.offsetWidth;
      countEl.classList.add('bump');
      setTimeout(() => cartBadge.classList.remove('bump'), 500);

      render();
      showToast(`«${name}» додано в кошик`);
    });
  });

  /* --- кнопка "Купити зараз": більше НЕ додає товар у кошик --- */
  document.querySelectorAll('.buy-button').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const card = btn.closest('.product-card');
      const name = card?.querySelector('h3')?.textContent.trim() || 'Товар';
      showToast(`Дякуємо! Замовлення «${name}» оформлюється окремо від кошика.`);
    });
  });
}

/* ----------------------------------------------------------
   5. Форма підписки на розсилку
---------------------------------------------------------- */
function initSubscriptionForm() {
  const form = document.querySelector('.subscription-form');
  if (!form) return;

  const emailInput = form.querySelector('input[type="email"]');
  const button = form.querySelector('button[type="submit"]');
  const heading = form.querySelector('h2');
  const formGroup = form.querySelector('.form-group');

  // додаємо іконку конверта в заголовок
  if (heading && !heading.querySelector('.mail-icon')) {
    heading.innerHTML = heading.innerHTML.replace(
      '📧',
      '<span class="mail-icon">📧</span>'
    );
  }

  // ряд з перевагами підписки
  if (!form.querySelector('.subscribe-benefits')) {
    const benefits = document.createElement('div');
    benefits.className = 'subscribe-benefits';
    benefits.innerHTML = `
      <span class="subscribe-benefit">🎁 Ексклюзивні знижки</span>
      <span class="subscribe-benefit">🆕 Новинки колекцій</span>
      <span class="subscribe-benefit">🚚 Безкоштовна доставка</span>
    `;
    const p = form.querySelector('p');
    (p || heading).insertAdjacentElement('afterend', benefits);
  }

  // обгортаємо поле email в контейнер з іконкою
  if (formGroup && !formGroup.querySelector('.input-wrap')) {
    const wrap = document.createElement('div');
    wrap.className = 'input-wrap';
    emailInput.parentNode.insertBefore(wrap, emailInput);
    wrap.appendChild(emailInput);

    const icon = document.createElement('span');
    icon.className = 'input-icon';
    icon.textContent = '✉️';
    wrap.insertBefore(icon, emailInput);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const pattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;

    if (!pattern.test(email)) {
      showToast('Введіть коректну email адресу', true);
      form.classList.remove('shake');
      void form.offsetWidth;
      form.classList.add('shake');
      emailInput.focus();
      return;
    }

    const subscribers = JSON.parse(localStorage.getItem('ls_subscribers') || '[]');
    if (subscribers.includes(email)) {
      showToast('Ви вже підписані на розсилку');
      form.reset();
      return;
    }

    const originalText = button.textContent;
    button.disabled = true;
    button.textContent = 'Обробка...';

    setTimeout(() => {
      subscribers.push(email);
      localStorage.setItem('ls_subscribers', JSON.stringify(subscribers));

      button.textContent = '✓ Підписано';
      button.classList.add('success');
      showToast('Дякуємо за підписку! Перевірте пошту 💌');

      setTimeout(() => {
        button.disabled = false;
        button.classList.remove('success');
        button.textContent = originalText;
        form.reset();
      }, 1600);
    }, 600);
  });
}

/* ----------------------------------------------------------
   6. Плавна поява елементів при скролі
---------------------------------------------------------- */
function initScrollReveal() {
  const selectors = '.product-card, .value-card, .timeline-item, .story-section, .team-section, .cta-section';
  const elements = document.querySelectorAll(selectors);
  if (elements.length === 0) return;

  elements.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  elements.forEach(el => observer.observe(el));
}

/* ----------------------------------------------------------
   7. Кнопка "нагору"
---------------------------------------------------------- */
function initBackToTop() {
  const btn = document.createElement('button');
  btn.className = 'back-to-top';
  btn.innerHTML = '↑';
  btn.setAttribute('aria-label', 'Прогорнути нагору');
  document.body.appendChild(btn);

  window.addEventListener('scroll', () => {
    btn.classList.toggle('show', window.scrollY > 400);
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ----------------------------------------------------------
   Допоміжна функція: спливаюче повідомлення (toast)
---------------------------------------------------------- */
function showToast(message, isError = false) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.toggle('error', isError);
  toast.classList.add('show');

  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}
