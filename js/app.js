/* =========================================================
   FIFTY BAR VAPE — Main App JS v4
   Fixes: filter timing, payment method reading, search
   ========================================================= */

/* ── AGE GATE ── */
(function(){
  const KEY='fbv_age_ok', gate=document.getElementById('age-gate');
  if(!gate)return;
  if(sessionStorage.getItem(KEY)==='1'){gate.style.display='none';return;}
  gate.classList.add('visible');
  document.getElementById('ag-yes')?.addEventListener('click',()=>{
    sessionStorage.setItem(KEY,'1');
    gate.style.transition='opacity .4s';gate.style.opacity='0';
    setTimeout(()=>{gate.style.display='none';gate.classList.remove('visible');},420);
  });
  document.getElementById('ag-no')?.addEventListener('click',()=>window.location.href='https://www.google.com');
})();

/* ── MOBILE NAV ── slide-in panel + backdrop + collapsible groups */
(function(){
  const btn = document.getElementById('hamburger');
  const nav = document.getElementById('mobile-nav');
  if(!btn || !nav) return;

  /* Inject a backdrop element if not present */
  let backdrop = document.querySelector('.mobile-nav-backdrop');
  if(!backdrop){
    backdrop = document.createElement('div');
    backdrop.className = 'mobile-nav-backdrop';
    document.body.appendChild(backdrop);
  }

  /* Inject a header bar with close button at the top of the nav if missing */
  if(!nav.querySelector('.mobile-nav-head')){
    const head = document.createElement('div');
    head.className = 'mobile-nav-head';
    head.innerHTML = '<span class="mn-logo">FIFTY <span>BAR</span></span>'
      + '<button class="mobile-nav-close" aria-label="Close menu" type="button">&times;</button>';
    nav.insertBefore(head, nav.firstChild);
  }

  /* Convert "Collections" divider + following links into a collapsible group.
     Works with the existing markup: <div class="m-divider">Collections</div> followed by <a> links. */
  (function buildGroups(){
    const dividers = Array.from(nav.querySelectorAll('.m-divider'));
    dividers.forEach(div => {
      const label = (div.textContent || '').trim();
      /* Only collapse the Collections section */
      if(!/collection/i.test(label)) return;
      const group = document.createElement('div');
      group.className = 'm-group open';
      const toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.className = 'm-group-toggle';
      toggle.innerHTML = '<span>' + label + '</span><span class="m-caret">▾</span>';
      const body = document.createElement('div');
      body.className = 'm-group-body';
      /* Move all sibling <a> tags until the next divider into the group body */
      let node = div.nextElementSibling;
      while(node && !node.classList.contains('m-divider')){
        const next = node.nextElementSibling;
        if(node.tagName === 'A') body.appendChild(node);
        node = next;
      }
      group.appendChild(toggle);
      group.appendChild(body);
      div.replaceWith(group);
      toggle.addEventListener('click', () => group.classList.toggle('open'));
    });
  })();

  function openMenu(){
    nav.classList.add('open');
    backdrop.classList.add('open');
    btn.classList.add('open');
    btn.setAttribute('aria-expanded','true');
    document.body.classList.add('menu-open');
  }
  function closeMenu(){
    nav.classList.remove('open');
    backdrop.classList.remove('open');
    btn.classList.remove('open');
    btn.setAttribute('aria-expanded','false');
    document.body.classList.remove('menu-open');
  }
  function toggleMenu(){
    nav.classList.contains('open') ? closeMenu() : openMenu();
  }

  btn.addEventListener('click', e => { e.preventDefault(); toggleMenu(); });
  backdrop.addEventListener('click', closeMenu);

  const closeBtn = nav.querySelector('.mobile-nav-close');
  if(closeBtn) closeBtn.addEventListener('click', closeMenu);

  /* Close when any real navigation link is tapped */
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

  /* Close on Escape */
  document.addEventListener('keydown', e => { if(e.key === 'Escape') closeMenu(); });

  /* Close if resized up to desktop */
  window.addEventListener('resize', () => { if(window.innerWidth > 768) closeMenu(); });
})();

/* ── ACTIVE NAV ── */
(function(){
  const path=window.location.pathname.replace(/\/$/,'')||'/';
  document.querySelectorAll('.site-nav a,.mobile-nav a').forEach(a=>{
    try{
      const h=new URL(a.href,location.origin).pathname.replace(/\/$/,'')||'/';
      if(h===path)a.classList.add('active');
    }catch(e){}
  });
})();

/* ── SEARCH ── */
(function(){
  const overlay=document.getElementById('search-overlay');
  const input=document.getElementById('search-input');
  const results=document.getElementById('search-results');
  if(!overlay||!input||!results)return;

  document.querySelectorAll('.search-open-btn').forEach(b=>b.addEventListener('click',e=>{
    e.preventDefault();overlay.classList.add('open');
    setTimeout(()=>input.focus(),50);
  }));
  document.getElementById('search-close')?.addEventListener('click',()=>overlay.classList.remove('open'));
  overlay.addEventListener('click',e=>{if(e.target===overlay)overlay.classList.remove('open');});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')overlay.classList.remove('open');});

  /* Deep-link support: /shop/?q=mango opens search pre-filled (matches SearchAction schema) */
  const qParam=new URLSearchParams(location.search).get('q');
  if(qParam){
    input.value=qParam;
    overlay.classList.add('open');
    input.dispatchEvent(new Event('input'));
  }

  let timer;
  input.addEventListener('input',()=>{
    clearTimeout(timer);
    timer=setTimeout(()=>{
      const q=input.value.trim().toLowerCase();
      if(q.length<2){results.innerHTML='';return;}
      const found=FBV.products.filter(p=>
        p.name.toLowerCase().includes(q)||
        (FBV.getCat(p.cat)?.label||'').toLowerCase().includes(q)||
        (p.tags||[]).some(t=>t.includes(q))
      ).slice(0,8);
      if(!found.length){
        results.innerHTML=`<p class="search-no-results">No results for "<strong>${q}</strong>"</p>`;
        return;
      }
      results.innerHTML=found.map(p=>{
        const cat=FBV.getCat(p.cat);
        return `<a href="/shop/${p.cat}/${p.id}/" class="search-result-item" onclick="document.getElementById('search-overlay').classList.remove('open')">
          <div class="sr-img"><img src="/images/products/${p.img}" alt="${p.name}" loading="lazy" onerror="this.style.display='none'"></div>
          <div class="sr-info"><h4>${p.name}</h4><p>${cat?.label||''} &bull; ${p.puffs} puffs</p></div>
          <span class="sr-price">$${p.price.toFixed(2)}</span>
        </a>`;
      }).join('');
    },200);
  });
})();

/* ── FAQ ACCORDION ── */
document.querySelectorAll('.faq-question').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const item=btn.closest('.faq-item'),isOpen=item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(i=>{
      i.classList.remove('open');
      i.querySelector('.faq-question').setAttribute('aria-expanded','false');
    });
    if(!isOpen){item.classList.add('open');btn.setAttribute('aria-expanded','true');}
  });
});

/* ── SHOP FILTER — runs AFTER cards are rendered ── */
/* Called by shop/index.html after cards are injected into DOM */
window.initShopFilter = function() {
  const btns = document.querySelectorAll('.filter-btn');
  if (!btns.length) return;
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.filter;
      /* cards exist now because filter is init'd after render */
      document.querySelectorAll('.product-card[data-cat]').forEach(c => {
        c.style.display = (cat === 'all' || c.dataset.cat === cat) ? '' : 'none';
      });
    });
  });
};

/* ── TOAST ── */
function showToast(msg, type='') {
  let t = document.getElementById('site-toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'site-toast';
    t.className = 'toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.className = 'toast ' + type;
  void t.offsetWidth;
  t.classList.add('show');
  clearTimeout(t._t);
  t._t = setTimeout(() => t.classList.remove('show'), 3400);
}
window.showToast = showToast;

/* ── CONTACT / WHOLESALE FORM ── */
document.querySelectorAll('[data-formspree]').forEach(form => {
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('[type=submit]');
    const orig = btn.textContent;
    btn.textContent = 'Sending…'; btn.disabled = true;
    /* Build JSON payload from form fields */
    const data = {};
    new FormData(form).forEach((val, key) => { data[key] = val; });
    data['_subject'] = (data['form_type'] || 'Contact') + ' - thefiftybar.org';
    data['_replyto'] = data['email'] || '';
    data['recipient'] = 'info@thefiftybar.org';
    try {
      const res = await fetch('https://formspree.io/f/mojbqrgg', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data),
      });
      const resp = await res.json();
      if (res.ok && !resp.errors) {
        showToast("Message sent! We'll reply within a few hours.", 'success');
        form.reset();
      } else {
        const msg = resp.errors ? resp.errors.map(e => e.message).join(', ') : 'Submission failed';
        throw new Error(msg);
      }
    } catch(err) {
      showToast('Error: ' + err.message + '. Email us: info@thefiftybar.org', '');
    }
    btn.textContent = orig; btn.disabled = false;
  });
});

/* ── NEWSLETTER FORM ── */
document.querySelectorAll('.newsletter-form').forEach(form => {
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('[type=submit]');
    btn.textContent = 'Subscribing…'; btn.disabled = true;
    await new Promise(r => setTimeout(r, 700));
    showToast('Subscribed! Welcome to Fifty Bar.', 'success');
    form.reset();
    btn.textContent = 'Subscribe'; btn.disabled = false;
  });
});

/* ── SCROLL REVEAL ── */
(function(){
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('revealed'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('[data-reveal]').forEach(el => obs.observe(el));
})();

/* ── HEADER SCROLL SHADOW ── */
(function(){
  const h = document.querySelector('.site-header'); if (!h) return;
  window.addEventListener('scroll', () => {
    h.style.boxShadow = window.scrollY > 60 ? '0 2px 24px rgba(0,0,0,.6)' : '';
  }, { passive: true });
})();

/* ── PRODUCT CARD RENDER ── */
function renderProductCard(p, showCat) {
  const cat = FBV.getCat(p.cat);
  return `<article class="product-card" data-cat="${p.cat}" data-id="${p.id}">
    <a href="/shop/${p.cat}/${p.id}/" class="pc-img-link" aria-label="View ${p.name}" style="display:block;text-decoration:none">
      <div class="pc-img">
        ${p.badge ? `<div class="pc-badge">${p.badge}</div>` : ''}
        <img src="/images/products/${p.img}" alt="${p.name} — Fifty Bar ${cat?.label||''}" loading="lazy"
          onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
        <div style="display:none;position:absolute;inset:0;align-items:center;justify-content:center;font-size:60px;background:var(--dark3)">${cat?.emoji||'💨'}</div>
      </div>
    </a>
    <div class="pc-body">
      ${showCat ? `<p class="pc-cat">${cat?.label||''}</p>` : ''}
      <div class="puff-badge">⚡ ${p.puffs} Puffs</div>
      <a href="/shop/${p.cat}/${p.id}/" style="text-decoration:none"><h3>${p.name}</h3></a>
      <p>${p.desc.substring(0,88)}…</p>
      <div class="pc-qty-row">
        <button class="qty-btn" onclick="pcQty(this,-1)" aria-label="Decrease">−</button>
        <span class="pc-qty-num">1</span>
        <button class="qty-btn" onclick="pcQty(this,1)" aria-label="Increase">+</button>
      </div>
      <div class="pc-footer">
        <span class="pc-price">$${p.price.toFixed(2)}</span>
        <button class="btn-atc" onclick="pcAddCart('${p.id}',this)" aria-label="Add ${p.name} to cart">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>
          Add to Cart
        </button>
      </div>
      <div class="pc-stock">In Stock</div>
    </div>
  </article>`;
}
window.renderProductCard = renderProductCard;

function pcQty(btn, delta) {
  const numEl = btn.closest('.pc-qty-row').querySelector('.pc-qty-num');
  numEl.textContent = Math.max(1, parseInt(numEl.textContent) + delta);
}
function pcAddCart(id, btn) {
  const row = btn.closest('.pc-body').querySelector('.pc-qty-row');
  const qty = parseInt(row?.querySelector('.pc-qty-num')?.textContent) || 1;
  if (typeof Cart !== 'undefined') Cart.add(id, qty);
  btn.classList.add('atc-added');
  setTimeout(() => btn.classList.remove('atc-added'), 400);
}
window.pcQty = pcQty;
window.pcAddCart = pcAddCart;
