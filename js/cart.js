/* =========================================================
   FIFTY BAR VAPE — Cart & Checkout v4
   Fixed: Formspree submission, pay method reading
   Rules: Min $150 | Free shipping $250+ | 10% crypto
   ========================================================= */

const Cart = {
  _items: [],

  init() {
    try { this._items = JSON.parse(localStorage.getItem('fbv_cart') || '[]'); } catch(e) { this._items = []; }
  },

  save() {
    localStorage.setItem('fbv_cart', JSON.stringify(this._items));
    this.render();
    this.updateBadge();
  },

  add(productId, qty=1) {
    const p = FBV.getById(productId);
    if (!p) return;
    const existing = this._items.find(i => i.id === productId);
    if (existing) {
      existing.qty = Math.max(1, existing.qty + qty);
    } else {
      this._items.push({ id: productId, qty: Math.max(1, qty) });
    }
    this.save();
    this.open();
    showToast(`✅ ${p.name} added to cart`, 'success');
  },

  remove(productId) {
    this._items = this._items.filter(i => i.id !== productId);
    this.save();
  },

  setQty(productId, qty) {
    if (qty < 1) { this.remove(productId); return; }
    const item = this._items.find(i => i.id === productId);
    if (item) { item.qty = qty; this.save(); }
  },

  clear() {
    this._items = [];
    localStorage.removeItem('fbv_cart');
    this.save();
  },

  count() { return this._items.reduce((s,i) => s + i.qty, 0); },

  subtotal() {
    return this._items.reduce((s,i) => {
      const p = FBV.getById(i.id);
      return s + (p ? p.price * i.qty : 0);
    }, 0);
  },

  /* payMethod: 'crypto' triggers 10% discount */
  totals(payMethod) {
    const sub  = this.subtotal();
    const disc = payMethod === 'crypto' ? sub * FBV.rules.cryptoDiscount : 0;
    const discSub = sub - disc;
    const ship = discSub >= FBV.rules.freeShipping ? 0 : FBV.rules.shippingCost;
    return {
      sub,
      disc,
      discSub,
      ship,
      total: discSub + ship,
      minOk: sub >= FBV.rules.minOrder
    };
  },

  updateBadge() {
    const c = this.count();
    document.querySelectorAll('.cart-badge').forEach(b => {
      b.textContent = c;
      b.style.display = c > 0 ? 'flex' : 'none';
    });
  },

  open() {
    document.getElementById('cart-drawer')?.classList.add('open');
    document.getElementById('cart-overlay')?.classList.add('open');
    document.body.style.overflow = 'hidden';
    this.render();
  },

  close() {
    document.getElementById('cart-drawer')?.classList.remove('open');
    document.getElementById('cart-overlay')?.classList.remove('open');
    document.body.style.overflow = '';
  },

  render() {
    const el = document.getElementById('cart-items');
    if (!el) return;

    if (!this._items.length) {
      el.innerHTML = `<div class="cart-empty">
        <div style="font-size:48px;margin-bottom:12px">🛒</div>
        <p style="font-family:var(--fc);font-size:16px;letter-spacing:.04em;color:var(--silver)">YOUR CART IS EMPTY</p>
        <a href="/shop/" class="btn btn-primary btn-sm" style="margin-top:16px" onclick="Cart.close()">Shop Now</a>
      </div>`;
      this._renderTotals('');
      return;
    }

    el.innerHTML = this._items.map(item => {
      const p = FBV.getById(item.id);
      if (!p) return '';
      const cat = FBV.getCat(p.cat);
      return `<div class="cart-item" data-id="${p.id}">
        <div class="cart-item-img">
          <img src="/images/products/${p.img}" alt="${p.name}" loading="lazy"
            onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
          <div style="display:none;align-items:center;justify-content:center;width:100%;height:100%;font-size:28px">${cat?.emoji||'💨'}</div>
        </div>
        <div class="cart-item-info">
          <p class="cart-item-cat">${cat?.label||''}</p>
          <h4 class="cart-item-name">${p.name}</h4>
          <p class="cart-item-puffs">⚡ ${p.puffs} puffs</p>
          <div class="qty-control">
            <button class="qty-btn" onclick="Cart.setQty('${p.id}',${item.qty-1})" aria-label="Decrease">−</button>
            <span class="qty-num">${item.qty}</span>
            <button class="qty-btn" onclick="Cart.setQty('${p.id}',${item.qty+1})" aria-label="Increase">+</button>
          </div>
        </div>
        <div class="cart-item-right">
          <span class="cart-item-price">$${(p.price * item.qty).toFixed(2)}</span>
          <button class="cart-item-remove" onclick="Cart.remove('${p.id}')" aria-label="Remove">×</button>
        </div>
      </div>`;
    }).join('');

    this._renderTotals('');
  },

  _renderTotals(payMethod) {
    const el = document.getElementById('cart-totals');
    if (!el) return;
    const t = this.totals(payMethod);
    const hasItems = this._items.length > 0;

    el.innerHTML = `
      ${hasItems && !t.minOk ? `<div class="cart-min-warn">⚠️ Min. order $${FBV.rules.minOrder}. Add <strong>$${(FBV.rules.minOrder - t.sub).toFixed(2)}</strong> more.</div>` : ''}
      <div class="cart-total-row"><span>Subtotal</span><span>$${t.sub.toFixed(2)}</span></div>
      ${t.disc > 0 ? `<div class="cart-total-row discount"><span>Crypto Discount (10%)</span><span>−$${t.disc.toFixed(2)}</span></div>` : ''}
      <div class="cart-total-row"><span>Shipping</span><span>${t.ship === 0 ? '<span class="free-ship">FREE</span>' : '$'+t.ship.toFixed(2)}</span></div>
      ${hasItems && t.sub < FBV.rules.freeShipping ? `<p class="cart-ship-tip">Add <strong>$${(FBV.rules.freeShipping - t.sub).toFixed(2)}</strong> more for FREE shipping</p>` : ''}
      <div class="cart-total-row total"><span>Total</span><span>$${t.total.toFixed(2)}</span></div>
      ${hasItems ? `<a href="/checkout/" class="btn btn-primary" style="width:100%;justify-content:center;margin-top:16px;${!t.minOk ? 'opacity:.5;pointer-events:none' : ''}">
        Proceed to Checkout →
      </a>
      <button onclick="Cart.close()" class="btn btn-outline btn-sm" style="width:100%;justify-content:center;margin-top:10px">Continue Shopping</button>` : ''}
    `;
  },
};

/* ── CHECKOUT page helpers ── */
function renderCheckoutItems() {
  const el = document.getElementById('checkout-items');
  if (!el) return;
  if (!Cart._items.length) {
    el.innerHTML = '<p style="color:var(--silver);font-size:14px">No items. <a href="/shop/" style="color:var(--red)">Go shop →</a></p>';
    return;
  }
  el.innerHTML = Cart._items.map(item => {
    const p = FBV.getById(item.id);
    if (!p) return '';
    const cat = FBV.getCat(p.cat);
    return `<div class="co-item">
      <div class="co-item-img"><img src="/images/products/${p.img}" alt="${p.name}" loading="lazy" onerror="this.style.display='none'"></div>
      <div class="co-item-info">
        <p class="co-item-cat">${cat?.label||''}</p>
        <p class="co-item-name">${p.name}</p>
        <p class="co-item-puffs">${p.puffs} puffs · Qty: ${item.qty}</p>
      </div>
      <span class="co-item-price">$${(p.price * item.qty).toFixed(2)}</span>
    </div>`;
  }).join('');
}

function getSelectedPayMethod() {
  const checked = document.querySelector('[name="pay_method"]:checked');
  return checked ? checked.value : '';
}

function renderCheckoutTotals() {
  const el = document.getElementById('checkout-totals');
  if (!el) return;
  const pay = getSelectedPayMethod();
  const t = Cart.totals(pay);

  el.innerHTML = `
    ${Cart._items.length && !t.minOk ? `<div class="cart-min-warn">⚠️ Min. order $${FBV.rules.minOrder}. Add $${(FBV.rules.minOrder - t.sub).toFixed(2)} more.</div>` : ''}
    <div class="cart-total-row"><span>Subtotal</span><span>$${t.sub.toFixed(2)}</span></div>
    ${t.disc > 0 ? `<div class="cart-total-row discount"><span>🔐 Crypto Discount (10%)</span><span>−$${t.disc.toFixed(2)}</span></div>` : ''}
    <div class="cart-total-row"><span>Shipping</span><span>${t.ship === 0 ? '<span class="free-ship">FREE</span>' : '$'+t.ship.toFixed(2)}</span></div>
    <div class="cart-total-row total"><span>ORDER TOTAL</span><span>$${t.total.toFixed(2)}</span></div>
    ${pay === 'crypto' ? '<p style="color:var(--green);font-size:12px;font-family:var(--fc);font-weight:700;margin-top:8px">✅ 10% crypto discount applied!</p>' : ''}
  `;
}

/* ── ORDER SUBMIT — fixed Formspree integration ── */
async function submitOrder(e) {
  e.preventDefault();
  const form = e.target;
  const pay = getSelectedPayMethod();
  const t = Cart.totals(pay);

  /* Validation */
  if (!Cart._items.length) { showToast('Your cart is empty', ''); return; }
  if (!t.minOk) { showToast(`Minimum order is $${FBV.rules.minOrder}`, ''); return; }
  if (!pay) { showToast('Please select a payment method', ''); return; }

  const btn = form.querySelector('[type=submit]');
  btn.textContent = 'Placing Order…';
  btn.disabled = true;

  /* Build readable order lines */
  const itemLines = Cart._items.map(item => {
    const p = FBV.getById(item.id);
    const cat = FBV.getCat(p?.cat);
    return `  • ${item.qty}x ${p?.name} (${cat?.label}) @ $${p?.price.toFixed(2)} = $${(p?.price * item.qty).toFixed(2)}`;
  }).filter(Boolean).join('\n');

  const payLabel = { 'apple-pay':'Apple Pay', 'cash-app':'Cash App', 'chime':'Chime', 'crypto':'Crypto (BTC/ETH/LTC)' }[pay] || pay;

  const orderBody = [
    '=== NEW ORDER - Fifty Bar Vape ===',
    '',
    'Customer: ' + form.fname.value + ' ' + form.lname.value,
    'Email: ' + form.email.value,
    'Phone: ' + (form.phone.value || 'Not provided'),
    'Address: ' + form.address.value + ', ' + form.city.value + ', ' + form.state.value + ' ' + form.zip.value,
    '',
    'ITEMS ORDERED:',
    itemLines,
    '',
    'Subtotal: $' + t.sub.toFixed(2),
    t.disc > 0 ? 'Crypto Discount (10%): -$' + t.disc.toFixed(2) : null,
    'Shipping: ' + (t.ship === 0 ? 'FREE' : '$' + t.ship.toFixed(2)),
    'ORDER TOTAL: $' + t.total.toFixed(2),
    '',
    'Payment Method: ' + payLabel,
    'Special Notes: ' + (form.notes ? form.notes.value || 'None' : 'None'),
    '',
    'Please reply to confirm and send payment instructions.',
    'Customer email: ' + form.email.value,
  ].filter(l => l !== null).join('\n');

  /* Formspree — use URLSearchParams (not FormData) for reliable JSON response */
  const payload = {
    name: form.fname.value + ' ' + form.lname.value,
    email: form.email.value,
    _replyto: form.email.value,
    recipient: 'info@thefiftybar.org',
    _subject: 'New Order from ' + form.fname.value + ' ' + form.lname.value + ' - ' + payLabel + ' - $' + t.total.toFixed(2),
    phone: form.phone.value || 'N/A',
    address: form.address.value + ', ' + form.city.value + ', ' + form.state.value + ' ' + form.zip.value,
    payment_method: payLabel,
    order_total: '$' + t.total.toFixed(2),
    message: orderBody,
    _gotcha: '',
  };

  console.log('=== FBV ORDER SUBMIT ===');
  console.log('Payload email:', payload.email);
  console.log('Payload keys:', Object.keys(payload));
  console.log('Cart items:', Cart._items.length);

  try {
    const res = await fetch('https://formspree.io/f/mojbqrgg', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    let data = {};
    try { data = await res.json(); } catch(e) { console.log('Non-JSON response'); }

    console.log('Formspree response status:', res.status);
    console.log('Formspree response data:', data);

    if (res.status === 200 || res.status === 201 || (res.ok && !data.errors)) {
      /* SUCCESS */
      Cart.clear();
      const successEl = document.getElementById('checkout-success');
      const formEl = document.getElementById('checkout-form-wrap');
      if (successEl) successEl.style.display = 'block';
      if (formEl) formEl.style.display = 'none';
      window.scrollTo({ top: 0, behavior: 'smooth' });

    } else if (res.status === 422 && data.errors) {
      /* Validation error — show specific message */
      const msgs = data.errors.map(e => e.message || e.field + ': ' + (e.message||'required')).join(', ');
      showToast('Please fix: ' + msgs, '');
      btn.textContent = 'Place Order →';
      btn.disabled = false;

    } else if (res.status === 403) {
      /* Form not yet activated on Formspree — use mailto fallback */
      _mailtoFallback(orderBody, form, t);

    } else {
      /* Other error — use mailto fallback */
      console.warn('Formspree returned:', res.status);
      _mailtoFallback(orderBody, form, t);
    }

  } catch (err) {
    /* Network error — use mailto fallback */
    console.error('Order fetch error:', err);
    _mailtoFallback(orderBody, form, t);
  }
}

/* Mailto fallback — opens email client pre-filled with order */
function _mailtoFallback(orderBody, form, t) {
  const subject = encodeURIComponent('New Order $' + t.total.toFixed(2) + ' - ' + (form.fname.value||'') + ' ' + (form.lname.value||''));
  const body = encodeURIComponent(orderBody);
  const mailtoLink = 'mailto:info@thefiftybar.org?subject=' + subject + '&body=' + body;
  
  /* Show success UI anyway */
  Cart.clear();
  const successEl = document.getElementById('checkout-success');
  const formEl = document.getElementById('checkout-form-wrap');
  if (successEl) {
    successEl.innerHTML = successEl.innerHTML.replace(
      'Thank you for your order.',
      'Thank you for your order. Please click the button below to send your order email, or email <a href="mailto:info@thefiftybar.org" style="color:var(--red)">info@thefiftybar.org</a> directly.'
    );
    /* Add mailto button */
    const mailBtn = document.createElement('a');
    mailBtn.href = mailtoLink;
    mailBtn.className = 'btn btn-primary';
    mailBtn.style.cssText = 'display:inline-flex;margin-top:16px';
    mailBtn.textContent = '📧 Send Order Email';
    successEl.querySelector('a') && successEl.insertBefore(mailBtn, successEl.querySelector('a'));
    successEl.style.display = 'block';
  }
  if (formEl) formEl.style.display = 'none';
  window.scrollTo({ top: 0, behavior: 'smooth' });
  
  /* Also try opening mailto */
  setTimeout(() => { window.location.href = mailtoLink; }, 1200);
}
window.submitOrder = submitOrder;

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', () => {
  Cart.init();
  Cart.updateBadge();

  /* Cart overlay close */
  document.getElementById('cart-overlay')?.addEventListener('click', () => Cart.close());

  /* Cart icon */
  document.querySelectorAll('.cart-icon-btn').forEach(b => {
    b.addEventListener('click', e => { e.preventDefault(); Cart.open(); });
  });

  /* Checkout page */
  if (document.getElementById('checkout-form')) {
    renderCheckoutItems();
    renderCheckoutTotals();
    document.querySelectorAll('[name="pay_method"]').forEach(r => {
      r.addEventListener('change', renderCheckoutTotals);
    });
  }
});
