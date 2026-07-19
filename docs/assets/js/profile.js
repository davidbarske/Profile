(() => {
  'use strict';
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.getElementById('primary-navigation');
  if (menuButton && nav) {
    const closeMenu = () => {
      nav.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
      const icon = menuButton.querySelector('span');
      if (icon) icon.textContent = '☰';
    };
    menuButton.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', String(isOpen));
      const icon = menuButton.querySelector('span');
      if (icon) icon.textContent = isOpen ? '×' : '☰';
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
  }

  const bindDisclosure = (selector, exclusive = false) => {
    const items = [...document.querySelectorAll(selector)];
    items.forEach(item => {
      const button = item.querySelector(':scope > button');
      if (!button) return;
      const panelId = button.getAttribute('aria-controls');
      const panel = panelId ? document.getElementById(panelId) : null;
      const sign = button.querySelector(':scope > i');
      button.addEventListener('click', () => {
        const opening = button.getAttribute('aria-expanded') !== 'true';
        if (exclusive && opening) {
          items.forEach(other => {
            if (other === item) return;
            const otherButton = other.querySelector(':scope > button');
            const otherPanel = otherButton && document.getElementById(otherButton.getAttribute('aria-controls'));
            other.classList.remove('open');
            if (otherButton) otherButton.setAttribute('aria-expanded', 'false');
            if (otherPanel) otherPanel.hidden = true;
            const otherSign = otherButton && otherButton.querySelector(':scope > i');
            if (otherSign) otherSign.textContent = '+';
          });
        }
        item.classList.toggle('open', opening);
        button.setAttribute('aria-expanded', String(opening));
        if (panel) panel.hidden = !opening;
        if (sign) sign.textContent = opening ? '−' : '+';
      });
    });
  };
  bindDisclosure('.era', true);
  bindDisclosure('.framework', true);
  bindDisclosure('.compact-project', false);

  const filters = [...document.querySelectorAll('.filters button')];
  const methods = [...document.querySelectorAll('.method-grid article')];
  filters.forEach(button => button.addEventListener('click', () => {
    const selected = button.textContent.trim();
    filters.forEach(item => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    methods.forEach(method => {
      const category = method.querySelector('small')?.textContent.trim();
      method.hidden = selected !== 'All' && category !== selected;
    });
  }));
})();
