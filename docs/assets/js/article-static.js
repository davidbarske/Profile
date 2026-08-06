(() => {
  'use strict';

  const progress = document.querySelector('.reading-progress i');
  if (progress) {
    let ticking = false;
    const updateProgress = () => {
      const available = document.documentElement.scrollHeight - window.innerHeight;
      const value = available > 0 ? Math.min(1, Math.max(0, window.scrollY / available)) : 0;
      progress.style.transform = `scaleX(${value})`;
      ticking = false;
    };
    const requestProgress = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(updateProgress);
    };
    updateProgress();
    window.addEventListener('scroll', requestProgress, { passive: true });
    window.addEventListener('resize', requestProgress);
  }

  const menuButton = document.querySelector('.article-menu-toggle');
  const articleNav = document.getElementById('article-navigation');
  if (menuButton && articleNav) {
    const closeMenu = () => {
      articleNav.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.querySelector('span').textContent = '☰';
      menuButton.querySelector('b').textContent = 'Navigate';
    };
    menuButton.addEventListener('click', () => {
      const opening = !articleNav.classList.contains('open');
      articleNav.classList.toggle('open', opening);
      menuButton.setAttribute('aria-expanded', String(opening));
      menuButton.querySelector('span').textContent = opening ? '×' : '☰';
      menuButton.querySelector('b').textContent = opening ? 'Close' : 'Navigate';
    });
    articleNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  }

  const articleTitle = document.querySelector('h1')?.innerText.replace(/\s+/g, ' ').trim() || document.title;
  document.querySelectorAll('.article-actions').forEach(actions => {
    [...actions.querySelectorAll('button')].forEach(button => {
      const label = button.textContent.trim().toLowerCase();
      if (label === 'print') button.addEventListener('click', () => window.print());
      if (label === 'share') button.addEventListener('click', async () => {
        const original = button.textContent;
        try {
          if (navigator.share) await navigator.share({ title: articleTitle, url: location.href });
          else await navigator.clipboard.writeText(location.href);
          button.textContent = navigator.share ? 'Shared' : 'Link Copied';
        } catch (error) {
          if (error.name !== 'AbortError') button.textContent = 'Copy Failed';
        }
        setTimeout(() => { button.textContent = original; }, 2200);
      });
    });
  });

  const ledgerData = {
    cash: {
      counts: 'Ticket cost, prize probability and expected cash return.',
      sees: 'A financially negative-expectation wager.',
      misses: 'Anticipation, unequal access to alternatives and relational aspiration.',
    },
    waiting: {
      counts: 'The wager plus the lived value of the waiting period before the draw.',
      sees: 'A bet that also creates an interval of anticipation before its financial outcome is known.',
      misses: 'How differently that interval may matter to people with radically different routes forward.',
    },
    possibility: {
      counts: 'Financial odds, anticipation and the availability of credible alternative futures.',
      sees: 'Identical mathematical odds carrying different subjective utility across unequal circumstances.',
      misses: 'Where the imagined benefit travels when prosperity is understood relationally.',
    },
    network: {
      counts: 'The wager, anticipation, constrained alternatives and the family or community network around the player.',
      sees: 'An individual purchase whose imagined upside can include parents, children, housing, debt, education and enterprise.',
      misses: 'Nothing automatically: the broader ledger still has to count addiction, predatory design and financial harm.',
    },
  };
  const ledgerTabs = [...document.querySelectorAll('.prob-ledger-tabs button')];
  const ledgerPanel = document.querySelector('.prob-ledger-panel');
  if (ledgerTabs.length && ledgerPanel) {
    ledgerTabs.forEach(button => button.addEventListener('click', () => {
      const lens = ledgerData[button.dataset.ledger];
      if (!lens) return;
      ledgerTabs.forEach(tab => {
        const active = tab === button;
        tab.classList.toggle('active', active);
        tab.setAttribute('aria-selected', String(active));
      });
      ledgerPanel.querySelector('.ledger-counts').textContent = lens.counts;
      ledgerPanel.querySelector('.ledger-sees').textContent = lens.sees;
      ledgerPanel.querySelector('.ledger-misses').textContent = lens.misses;
    }));
  }

  const lensData = [
    {
      proxy: 'Grades',
      value: 'Capability',
      question: 'Can the person see beneath the approved vocabulary and model what is really happening?',
      signal: 'Better questions, defensible assumptions and thinking that survives challenge.',
    },
    {
      proxy: 'Arrests',
      value: 'Disruption',
      question: 'Where does intervention change the economics, access or flow of the whole network?',
      signal: 'Reduced movement, degraded access and fewer easy substitutes at critical points.',
    },
    {
      proxy: 'Sales',
      value: 'Operational Confidence',
      question: 'Does the machine keep the right operator productive in the conditions that actually exist?',
      signal: 'Uptime, resilience, repairability, support and a sale that remains valuable after delivery.',
    },
  ];
  const lensTabs = [...document.querySelectorAll('.lens-tabs button')];
  const lensPanel = document.querySelector('.lens-panel');
  if (lensTabs.length && lensPanel) {
    lensTabs.forEach((button, index) => button.addEventListener('click', () => {
      lensTabs.forEach((tab, tabIndex) => {
        const active = tabIndex === index;
        tab.classList.toggle('active', active);
        tab.setAttribute('aria-selected', String(active));
      });
      const lens = lensData[index];
      lensPanel.innerHTML = `<div class="equation"><div><small>EASY TO COUNT</small><strong>${lens.proxy}</strong></div><b>≠</b><div><small>VALUE TO CREATE</small><strong>${lens.value}</strong></div></div><div class="lens-question"><small>THE BETTER QUESTION</small><p>${lens.question}</p></div><div class="lens-signal"><small>LOOK FOR</small><p>${lens.signal}</p></div>`;
    }));
  }

  const gallery = [...document.querySelectorAll('.gallery-item')];
  let activeIndex = null;
  let lightbox = null;
  const renderLightbox = () => {
    const item = gallery[activeIndex];
    const source = item.querySelector('img');
    const format = item.querySelector('small')?.textContent || 'Conceptual visual';
    const title = item.querySelector('b')?.textContent || source.alt;
    lightbox.querySelector('figure img').src = source.src;
    lightbox.querySelector('figure img').alt = source.alt;
    lightbox.querySelector('figcaption small').textContent = format;
    lightbox.querySelector('figcaption strong').textContent = title;
    lightbox.querySelector('figcaption span').textContent = `${activeIndex + 1} / ${gallery.length}`;
  };
  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.remove();
    lightbox = null;
    activeIndex = null;
    document.body.style.overflow = '';
  };
  const moveLightbox = delta => {
    activeIndex = (activeIndex + delta + gallery.length) % gallery.length;
    renderLightbox();
  };
  const openLightbox = index => {
    activeIndex = index;
    lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    if (document.querySelector('.probability-article')) lightbox.classList.add('probability-lightbox');
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.setAttribute('aria-label', 'Article visual gallery');
    lightbox.innerHTML = '<button class="lightbox-close" type="button" aria-label="Close visual gallery">×</button><button class="lightbox-arrow previous" type="button" aria-label="Previous visual">←</button><figure><img src="" alt=""><figcaption><small></small><strong></strong><span></span></figcaption></figure><button class="lightbox-arrow next" type="button" aria-label="Next visual">→</button>';
    lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    lightbox.querySelector('.previous').addEventListener('click', () => moveLightbox(-1));
    lightbox.querySelector('.next').addEventListener('click', () => moveLightbox(1));
    document.body.appendChild(lightbox);
    document.body.style.overflow = 'hidden';
    renderLightbox();
    lightbox.querySelector('.lightbox-close').focus();
  };
  gallery.forEach((item, index) => item.addEventListener('click', () => openLightbox(index)));

  document.addEventListener('keydown', event => {
    if (!lightbox) return;
    if (event.key === 'Escape') closeLightbox();
    if (event.key === 'ArrowLeft') moveLightbox(-1);
    if (event.key === 'ArrowRight') moveLightbox(1);
  });
})();
