(() => {
  const header = document.querySelector('[data-header]');
  const menuButton = document.querySelector('[data-menu-button]');
  const nav = document.querySelector('[data-nav]');

  const closeMenu = () => {
    if (!menuButton || !nav) return;
    nav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  };

  menuButton?.addEventListener('click', () => {
    const isOpen = nav?.classList.toggle('open') ?? false;
    menuButton.setAttribute('aria-expanded', String(isOpen));
    document.body.classList.toggle('menu-open', isOpen);
  });

  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  window.addEventListener('resize', () => { if (window.innerWidth > 1000) closeMenu(); });
  window.addEventListener('scroll', () => header?.classList.toggle('scrolled', window.scrollY > 12), { passive: true });

  const revealObserver = 'IntersectionObserver' in window
    ? new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -30px' })
    : null;
  document.querySelectorAll('.reveal').forEach(el => revealObserver ? revealObserver.observe(el) : el.classList.add('in-view'));

  document.querySelectorAll('details').forEach(details => {
    const marker = details.querySelector('summary i, summary span:last-child');
    const syncMarker = () => {
      if (!marker) return;
      marker.textContent = details.open ? '−' : '+';
    };
    syncMarker();
    details.addEventListener('toggle', syncMarker);
  });

  const filterButtons = document.querySelectorAll('[data-filter]');
  const tools = document.querySelectorAll('[data-tool-grid] [data-category]');
  filterButtons.forEach(button => button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    filterButtons.forEach(item => item.classList.toggle('active', item === button));
    tools.forEach(tool => { tool.hidden = filter !== 'all' && tool.dataset.category !== filter; });
  }));

  const synthesis = {
    students: {
      easy: 'Grades', value: 'Capability',
      question: 'Can the person see beneath the approved vocabulary and model what is really happening?',
      look: 'Better questions, defensible assumptions and thinking that survives challenge.'
    },
    syndicates: {
      easy: 'Arrests', value: 'Disruption',
      question: 'Which intervention changes the economics, logistics or resilience of the network?',
      look: 'Leverage points, altered flows, reduced network capacity and effects that survive replacement.'
    },
    shredders: {
      easy: 'Sales', value: 'Operational confidence',
      question: 'What does the customer need the machine, service and support system to protect?',
      look: 'Uptime, repairability, correct fit, local support and less operational anxiety.'
    }
  };
  const synthesisButtons = document.querySelectorAll('[data-synthesis]');
  synthesisButtons.forEach(button => button.addEventListener('click', () => {
    const data = synthesis[button.dataset.synthesis];
    if (!data) return;
    synthesisButtons.forEach(item => {
      const selected = item === button;
      item.classList.toggle('active', selected);
      item.setAttribute('aria-selected', String(selected));
    });
    const panel = document.querySelector('[data-synthesis-panel]');
    panel?.querySelector('[data-easy]')?.replaceChildren(data.easy);
    panel?.querySelector('[data-value]')?.replaceChildren(data.value);
    panel?.querySelector('[data-question]')?.replaceChildren(data.question);
    panel?.querySelector('[data-look]')?.replaceChildren(data.look);
  }));

  const dialog = document.querySelector('[data-lightbox-dialog]');
  const dialogImage = dialog?.querySelector('[data-lightbox-image]');
  const dialogCaption = dialog?.querySelector('[data-lightbox-caption]');
  let lastTrigger = null;
  document.querySelectorAll('[data-lightbox]').forEach(button => button.addEventListener('click', () => {
    if (!dialog || !dialogImage || !dialogCaption) return;
    lastTrigger = button;
    dialogImage.src = button.dataset.lightbox || '';
    dialogImage.alt = button.querySelector('img')?.alt || '';
    dialogCaption.textContent = button.dataset.caption || '';
    dialog.showModal();
    dialog.querySelector('[data-lightbox-close]')?.focus();
  }));
  const closeDialog = () => {
    if (!dialog?.open) return;
    dialog.close();
    lastTrigger?.focus();
  };
  dialog?.querySelector('[data-lightbox-close]')?.addEventListener('click', closeDialog);
  dialog?.addEventListener('click', event => { if (event.target === dialog) closeDialog(); });
  dialog?.addEventListener('cancel', event => { event.preventDefault(); closeDialog(); });

  const year = document.querySelector('[data-year]');
  if (year) year.textContent = String(new Date().getFullYear());
})();
