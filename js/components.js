/* =========================================================
   FIFTY BAR VAPE — Shared Components
   ========================================================= */

const SITE = {
  name: 'Fifty Bar Vape',
  tagline: 'Built In The USA',
  phone: '+1 562-732-4044',
  email: 'info@thefiftybar.org',
  domain: 'https://thefiftybar.org',
};

function getHeader() {
  return `
<div id="age-gate" style="display:none">
  <div class="ag-logo">FIFTY <span>BAR</span></div>
  <p>THIS WEBSITE CONTAINS AGE-RESTRICTED CONTENT.<br>YOU MUST BE 21+ TO ENTER.</p>
  <div class="ag-btns">
    <button class="ag-btn-yes" id="ag-yes">I AM 21 OR OLDER</button>
    <button class="ag-btn-no" id="ag-no">EXIT</button>
  </div>
  <p class="ag-warning">By entering this site you agree to our Terms of Service and confirm you are of legal age to purchase tobacco/vaping products in your jurisdiction. This site is intended for adults only.</p>
</div>

<div class="ann-bar">
  🇺🇸 American Made &amp; Filled &nbsp;|&nbsp; Free Discreet Shipping on Orders $50+ &nbsp;|&nbsp;
  <a href="tel:+15627324044">Call Us: (562) 732-4044</a>
</div>

<header class="site-header">
  <a href="/" class="header-logo" aria-label="Fifty Bar Vape Home">
    <svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect width="44" height="44" rx="6" fill="#D4282A"/>
      <text x="22" y="30" text-anchor="middle" font-family="'Bebas Neue',Impact,sans-serif" font-size="22" fill="white" letter-spacing="1">50</text>
    </svg>
    <div class="header-logo-text">
      <strong>FIFTY BAR</strong>
      <span>Premium Vapes</span>
    </div>
  </a>

  <nav class="site-nav" aria-label="Main navigation">
    <a href="/">Home</a>
    <a href="/shop/">Shop</a>
    <a href="/about/">About</a>
    <a href="/how-to-order/">How To Order</a>
    <a href="/faq/">FAQ</a>
    <a href="/contact/" class="header-cta">Contact</a>
  </nav>

  <div class="header-phone" aria-label="Phone number">
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .18h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14.92z"/></svg>
    <a href="tel:+15627324044">(562) 732-4044</a>
  </div>

  <button class="hamburger" id="hamburger" aria-label="Toggle mobile menu" aria-expanded="false">
    <span></span><span></span><span></span>
  </button>
</header>

<nav class="mobile-nav" id="mobile-nav" aria-label="Mobile navigation">
  <a href="/">Home</a>
  <a href="/shop/">Shop All</a>
  <a href="/shop/original-series/">Original Series</a>
  <a href="/shop/white-series/">White Series</a>
  <a href="/shop/black-series/">Black Series</a>
  <a href="/shop/fruitia/">Fifty Bar x Fruitia</a>
  <a href="/shop/humble/">Fifty Bar x Humble</a>
  <a href="/shop/hidden-hills/">Fifty Bar x Hidden Hills</a>
  <a href="/about/">About</a>
  <a href="/how-to-order/">How To Order</a>
  <a href="/faq/">FAQ</a>
  <a href="/contact/" class="highlight">Contact Us</a>
</nav>
`;
}

function getFooter() {
  return `
<section class="newsletter-section" aria-labelledby="newsletter-heading">
  <div class="section-inner">
    <p class="section-label">Stay Updated</p>
    <h2 class="section-title" id="newsletter-heading">JOIN THE<br><em>COMMUNITY</em></h2>
    <p style="color:var(--silver);font-size:15px;max-width:400px;margin:0 auto">Get exclusive drops, flavor launches, and deals delivered to your inbox.</p>
    <form class="newsletter-form" id="newsletter-form" novalidate aria-label="Newsletter signup">
      <label for="nl-email" class="sr-only">Email address</label>
      <input type="email" id="nl-email" name="email" placeholder="your@email.com" required autocomplete="email">
      <button type="submit" class="btn btn-primary">Subscribe</button>
    </form>
  </div>
</section>

<footer class="site-footer" role="contentinfo">
  <div class="footer-grid">
    <div class="footer-brand">
      <div class="footer-brand-logo">FIFTY <span>BAR</span></div>
      <p>The only disposable vape built and filled in the USA. Crafted with American ingenuity, premium e-liquid, and a commitment to quality you can taste.</p>
      <div class="footer-contact-item">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/></svg>
        <span><a href="tel:+15627324044">(562) 732-4044</a></span>
      </div>
      <div class="footer-contact-item">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
        <span><a href="mailto:info@thefiftybar.org">info@thefiftybar.org</a></span>
      </div>
    </div>
    <div class="footer-col">
      <h4>Collections</h4>
      <ul>
        <li><a href="/shop/original-series/">Original Series</a></li>
        <li><a href="/shop/white-series/">White Series</a></li>
        <li><a href="/shop/black-series/">Black Series</a></li>
        <li><a href="/shop/fruitia/">Fifty Bar x Fruitia</a></li>
        <li><a href="/shop/humble/">Fifty Bar x Humble</a></li>
        <li><a href="/shop/hidden-hills/">Fifty Bar x Hidden Hills</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h4>Quick Links</h4>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/shop/">Shop All</a></li>
        <li><a href="/about/">About Us</a></li>
        <li><a href="/how-to-order/">How To Order</a></li>
        <li><a href="/faq/">FAQ</a></li>
        <li><a href="/contact/">Contact Us</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h4>Support</h4>
      <ul>
        <li><a href="/privacy-policy/">Privacy Policy</a></li>
        <li><a href="/terms-of-service/">Terms of Service</a></li>
        <li><a href="/how-to-order/">Payments</a></li>
        <li><a href="/contact/">Order Support</a></li>
      </ul>
    </div>
  </div>
  <div class="footer-bottom">
    <p class="footer-copy">&copy; ${new Date().getFullYear()} Fifty Bar Vape. All rights reserved. Built In The USA 🇺🇸</p>
    <div class="footer-legal">
      <a href="/privacy-policy/">Privacy</a>
      <a href="/terms-of-service/">Terms</a>
      <a href="/contact/">Contact</a>
    </div>
  </div>
  <p class="footer-age-notice">WARNING: This product contains nicotine. Nicotine is an addictive chemical. For adult use only. Must be 21+ to purchase. Not for sale to minors.</p>
</footer>
<div class="toast" id="site-toast" role="alert" aria-live="assertive"></div>
`;
}

// Inject shared components
document.addEventListener('DOMContentLoaded', () => {
  const headerMount = document.getElementById('header-mount');
  if (headerMount) headerMount.innerHTML = getHeader();
  const footerMount = document.getElementById('footer-mount');
  if (footerMount) footerMount.innerHTML = getFooter();
  // Re-init after injection
  const script = document.createElement('script');
  script.src = '/js/app.js';
  document.body.appendChild(script);
});
