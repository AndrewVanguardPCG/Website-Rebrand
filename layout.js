// ============================================================
// Shared layout: header + footer injected into every page
// ============================================================

(function () {
  const PAGES = [
    { href: 'index.html',     label: 'Home' },
    { href: 'services.html',  label: 'Services' },
    { href: 'approach.html',  label: 'Approach' },
    { href: 'about.html',     label: 'About' },
    { href: 'insights.html',  label: 'Insights' },
    { href: 'careers.html',   label: 'Careers' },
  ];

  const current = (location.pathname.split('/').pop() || 'index.html').toLowerCase();

  const brandMark = `
    <svg class="brand-mark" viewBox="0 0 64 64" aria-hidden="true">
      <g fill="currentColor">
        <polygon points="32,4 35,28 60,32 35,36 32,60 29,36 4,32 29,28" opacity="0.95"/>
        <polygon points="32,12 33.4,30.6 52,32 33.4,33.4 32,52 30.6,33.4 12,32 30.6,30.6" opacity="0.55"/>
        <circle cx="32" cy="32" r="1.6"/>
      </g>
    </svg>
  `;

  function buildHeader() {
    const isHome = current === 'index.html' || current === '' ;
    const lightClass = isHome ? ' is-light' : '';
    const navHTML = PAGES.map(p => {
      const active = p.href.toLowerCase() === current ? ' is-active' : '';
      return `<a class="nav-link${active}" href="${p.href}">${p.label}</a>`;
    }).join('');

    return `
      <header class="site-header${lightClass}">
        <a class="brand" href="index.html" aria-label="Vanguard Private Client Group">
          ${brandMark}
          <span class="brand-text">
            VANGUARD
            <span class="brand-sub">Private Client Group</span>
          </span>
        </a>
        <nav class="nav" aria-label="Primary">
          ${navHTML}
          <a class="nav-cta" href="contact.html">Contact</a>
        </nav>
        <button class="nav-toggle" aria-label="Menu">
          <span></span><span></span>
        </button>
      </header>
    `;
  }

  function buildFooter() {
    return `
      <footer class="site-footer">
        <div class="footer-inner">
          <div class="footer-top">
            <div>
              <div class="footer-brand">An <em>operator-led</em> investment & advisory platform.</div>
              <p class="footer-tagline">Vertically integrated across acquisitions, brokerage, construction, and management — built around middle-market multifamily and adaptive reuse.</p>
            </div>
            <div class="footer-col">
              <h5>Platform</h5>
              <ul>
                <li><a href="services.html">Services</a></li>
                <li><a href="approach.html">Approach</a></li>
                <li><a href="insights.html">Insights</a></li>
                <li><a href="about.html">About</a></li>
              </ul>
            </div>
            <div class="footer-col">
              <h5>Company</h5>
              <ul>
                <li><a href="careers.html">Careers</a></li>
                <li><a href="contact.html">Contact</a></li>
                <li><a href="contact.html#capital">Investor Relations</a></li>
                <li><a href="contact.html#brokerage">Brokerage</a></li>
              </ul>
            </div>
            <div class="footer-col">
              <h5>Office</h5>
              <ul>
                <li>797 State Street</li>
                <li>New Haven, CT 06511</li>
                <li><a href="tel:+12038729176">(203) 872&#8209;9176</a></li>
                <li><a href="mailto:vp@vanguardpcg.com">vp@vanguardpcg.com</a></li>
              </ul>
            </div>
          </div>
          <div class="footer-bottom">
            <span>© ${new Date().getFullYear()} Vanguard Private Client Group · License REB.0793292</span>
            <span>Investment · Brokerage · Construction · Management</span>
          </div>
        </div>
      </footer>
    `;
  }

  // Inject
  const headerSlot = document.querySelector('[data-slot="header"]');
  const footerSlot = document.querySelector('[data-slot="footer"]');
  if (headerSlot) headerSlot.outerHTML = buildHeader();
  if (footerSlot) footerSlot.outerHTML = buildFooter();
})();
