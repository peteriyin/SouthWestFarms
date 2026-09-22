// Southwest Farms — site JS
// Product data lives here (not inline in shop.html) so every page,
// including trace.html, can look products up by lot number.
const PRODUCTS = [
  { id: "p1", title: "Cherry Tomato (250g)", price: 1800, category: "tomatoes", source: "greenhouse", image: "assets/cherry_tomato.jpg", lot: "LOT20251101", harvest: "2025-11-01" },
  { id: "p2", title: "Beef Tomato (1kg)", price: 1300, category: "tomatoes", source: "open_field", image: "assets/beef_tomato.jpg", lot: "LOT20251102", harvest: "2025-11-02" },
  { id: "p3", title: "Bell Pepper Mixed (1kg)", price: 1500, category: "peppers", source: "greenhouse", image: "assets/bell_pepper.jpg", lot: "LOT20251103", harvest: "2025-11-03" },
  { id: "p4", title: "Habanero (250g)", price: 1200, category: "peppers", source: "open_field", image: "assets/habanero.jpg", lot: "LOT20251106", harvest: "2025-11-06" },
  { id: "p5", title: "Sweet Corn (each)", price: 800, category: "corn", source: "open_field", image: "assets/sweet_corn.jpg", lot: "LOT20251104", harvest: "2025-11-04" },
  { id: "p6", title: "Watermelon (each)", price: 900, category: "watermelon", source: "open_field", image: "assets/watermelon.jpg", lot: "LOT20251105", harvest: "2025-11-05" }
];
window.PRODUCTS = PRODUCTS;

document.addEventListener('DOMContentLoaded', () => {
  const CART_KEY = 'sw_cart_v1';
  const sourceLabel = s =>
    s === 'greenhouse'
      ? 'Greenhouse'
      : 'Open field';

  function getCart() {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY)) || []
    } catch (e) {
      return []
    }
  }

  function saveCart(c) {
    localStorage.setItem(CART_KEY, JSON.stringify(c));
    updateCartCount()
  }

  function updateCartCount() {
    const c = getCart();
    const el = document.getElementById('cart-count');
    if (el) {
      const total = c.reduce((s, i) => s + i.qty, 0);
      el.textContent = total;
      el.style.display = total > 0 ? 'flex' : 'none';
    };
  }

  // mobile nav toggle
  const navToggle = document.getElementById('nav-toggle');
  const mainNav = document.getElementById('main-nav');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const open = mainNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      navToggle.innerHTML = open
        ? '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'
        : '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
    });
  }

  // header search button interaction//
  const searchBtn = document.querySelector('.header-icon-btn[aria-label="Search"]');
  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      const searchInput = document.getElementById('search');
      if (searchInput) {
        searchInput.focus();
        searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        window.location.href = 'shop.html';
      }
    });
  }

  // render products on shop page
  if (document.getElementById('products')) {
    const container = document.getElementById('products');
    function render(list) {
      container.innerHTML = '';
      if (list.length === 0) {
        container.innerHTML = '<p class="py-8 text-[#4b4433]">No produce matches that search right now.</p>';
        return;
      }
      list.forEach(p => {
        const el = document.createElement('div');
        el.className = 'flex flex-col overflow-hidden rounded-[14px] border border-[#201b1224] bg-[#fffdf8] transition duration-150 hover:-translate-y-1 hover:shadow-[0_14px_32px_-14px_rgba(20,30,20,0.35)]';
        el.innerHTML = `
          <div class="relative aspect-[1/0.82] overflow-hidden">
            <img class="size-full object-cover" src="${p.image}" alt="${p.title}">
            <span class="absolute bottom-2.5 left-2.5 rounded-md border-2 border-dashed border-[#1f5c38] bg-[#fffdf8] px-2.5 py-1.5 font-mono text-[0.58rem] uppercase tracking-[0.06em] text-[#123d26] shadow-[0_14px_32px_-14px_rgba(20,30,20,0.35)]"><span class="block">${sourceLabel(p.source)}</span><span class="mt-0.5 block text-[0.7rem] font-semibold">${p.lot}</span></span>
          </div>
          <div class="flex flex-1 flex-col gap-1.5 p-4">
            <h4 class="font-display text-base font-bold leading-tight text-[#201b12]">${p.title}</h4>
            <p class="m-0 font-mono text-lg font-semibold text-[#123d26]">₦${p.price.toLocaleString()}</p>
            <div class="mt-auto flex gap-2 pt-3">
              <button class="add inline-flex items-center justify-center rounded-full bg-[#1f5c38] px-3.5 py-2 text-[0.82rem] font-semibold text-[#fffdf8] transition hover:bg-[#123d26] focus:outline-none focus:ring-2 focus:ring-[#e1a22e] focus:ring-offset-2" data-id="${p.id}">Add to cart</button>
              <a class="inline-flex items-center justify-center rounded-full border border-[#201b1224] px-3.5 py-2 text-[0.82rem] font-semibold text-[#201b12] transition hover:border-[#1f5c38] hover:text-[#123d26] focus:outline-none focus:ring-2 focus:ring-[#e1a22e] focus:ring-offset-2" href="trace.html?lot=${p.lot}">Trace batch</a>
            </div>
          </div>`;
        container.appendChild(el);
      });

      container.querySelectorAll('.add').forEach(b =>
        b.addEventListener('click', e => {
          const id = e.target.dataset.id;
          const prod = PRODUCTS.find(x => x.id === id);
          const cart = getCart();
          const exists = cart.find(x => x.id === id);
          if (exists) {
            exists.qty += 1;
          }
          else cart.push(
            {
              id: prod.id,
              title: prod.title,
              price: prod.price,
              qty: 1
            });
          saveCart(cart);
        }));
    }
    render(PRODUCTS);
    updateCartCount();

    const ghFilter = document.getElementById('filter-gh');
    const ofFilter = document.getElementById('filter-of');
    const search = document.getElementById('search');
    function applyFilters() {
      const gh = ghFilter.checked, of = ofFilter.checked, searchQuery = search.value.toLowerCase();
      let list = PRODUCTS.filter(
        p => p.title.toLowerCase().includes(searchQuery) || p.category.includes(searchQuery)
      );
      if (gh && !of) list = list.filter(p => p.source === 'greenhouse');
      if (of && !gh) list = list.filter(p => p.source === 'open_field');
      render(list);
    }
    ghFilter.addEventListener('change', applyFilters);
    ofFilter.addEventListener('change', applyFilters);
    search.addEventListener('input', applyFilters);
  }

  // cart modal
  const cartBtn = document.getElementById('cart-btn');
  const cartModal = document.getElementById('cart-modal');
  const closeCart = document.getElementById('close-cart');
  if (cartBtn) {
    cartBtn.addEventListener('click', () => {
      cartModal.setAttribute('aria-hidden', 'false');
      renderCart();
    });
  }
  if (closeCart) {
    closeCart.addEventListener('click', () => {
      cartModal.setAttribute('aria-hidden', 'true')
    });
  }

  function renderCart() {
    const items = getCart();
    const node = document.getElementById('cart-items');
    node.innerHTML = '';
    let total = 0;
    if (items.length === 0) {
      node.innerHTML = '<p>Your cart is empty.</p>'
    };
    items.forEach(it => {
      const div = document.createElement('div');
      div.className = 'cart-line';
      div.innerHTML = `<div><strong>${it.title}</strong><div>₦${it.price.toLocaleString()} × ${it.qty}</div></div>
        <div class="qty-controls"><button class="dec" data-id="${it.id}">−</button><span>${it.qty}</span><button class="inc" data-id="${it.id}">+</button></div>`;
      node.appendChild(div);
      total += it.price * it.qty;
    });
    document.getElementById('cart-total').textContent = total.toLocaleString();
    node.querySelectorAll('.inc').forEach(b => b.addEventListener('click', e => changeQty(e.target.dataset.id, 1)));
    node.querySelectorAll('.dec').forEach(b => b.addEventListener('click', e => changeQty(e.target.dataset.id, -1)));
  }

  function changeQty(id, delta) {
    const cart = getCart();
    const it = cart.find(x => x.id === id);
    if (!it) return;
    it.qty += delta;
    if (it.qty <= 0) {
      const idx = cart.findIndex(x => x.id === id);
      cart.splice(idx, 1);
    }
    saveCart(cart);
    renderCart();
  }

  // checkout — placeholder until Paystack is wired in
  const checkoutBtn = document.getElementById('checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      const cart = getCart();
      if (cart.length === 0) {
        alert('Your cart is empty.');
        return;
      }
      const name = prompt('Enter your name for the order');
      const phone = prompt('Enter phone number');
      if (!name || !phone) {
        alert('Name & phone required');
        return;
      }
      localStorage.removeItem(CART_KEY);
      updateCartCount();
      cartModal.setAttribute('aria-hidden', 'true');
      alert('Thanks ' + name + '! Your order has been received. We will contact you on ' + phone);
    });
  }

  // wholesale form
  const wholesaleForm = document.getElementById('wholesale-form');
  if (wholesaleForm) {
    wholesaleForm.addEventListener('submit', e => {
      e.preventDefault();
      document.getElementById('wholesale-result').innerHTML = '<div class="result-note">Thanks — we received your request and will email a quote shortly.</div>';
      wholesaleForm.reset();
    });
  }

  // subscription buttons
  document.querySelectorAll('.subscribe').forEach(b =>
    b.addEventListener('click', () => {
      document.getElementById('sub-result').innerHTML = '<div class="result-note">Thanks! We will reach out on WhatsApp to complete your subscription.</div>';
    }
    ));

  // trace lookup
  const lookup = document.getElementById('lookup');
  if (lookup) {
    lookup.addEventListener('click', () => {
      const lot = document.getElementById('lot-input').value.trim();
      const res = document.getElementById('trace-result');
      const prod = PRODUCTS.find(p => p.lot === lot);
      if (!prod) {
        res.innerHTML = '<div class="result-note">Lot not found. Check the code on your pack and try again.</div>';
        return;
      }
      res.innerHTML = `
        <div class="trace-card">
          <span class="verified">✓ Verified batch</span>
          <h3>${prod.title}</h3>
          <dl>
            <div><dt>Lot</dt><dd>${prod.lot}</dd></div>
            <div><dt>Harvest date</dt><dd>${prod.harvest}</dd></div>
            <div><dt>Source</dt><dd>${sourceLabel(prod.source)}</dd></div>
          </dl>
        </div>`;
    });
    const params = new URLSearchParams(window.location.search);
    if (params.has('lot')) {
      document.getElementById('lot-input').value = params.get('lot');
      lookup.click();
    }
  }

  updateCartCount();
});
