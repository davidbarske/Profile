(() => {
  'use strict';

  const menuButton = document.querySelector('.menu-toggle');
  const primaryNav = document.getElementById('primary-navigation');
  if (menuButton && primaryNav) {
    const closeMenu = () => {
      primaryNav.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.querySelector('span').textContent = '☰';
      menuButton.querySelector('b').textContent = 'Menu';
    };
    menuButton.addEventListener('click', () => {
      const opening = !primaryNav.classList.contains('open');
      primaryNav.classList.toggle('open', opening);
      menuButton.setAttribute('aria-expanded', String(opening));
      menuButton.querySelector('span').textContent = opening ? '×' : '☰';
      menuButton.querySelector('b').textContent = opening ? 'Close' : 'Menu';
    });
    primaryNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  }

  const bindDisclosure = (selector, exclusive = false) => {
    const items = [...document.querySelectorAll(selector)];
    items.forEach(item => {
      const button = item.querySelector(':scope > button');
      const panel = button && document.getElementById(button.getAttribute('aria-controls'));
      if (!button || !panel) return;
      button.addEventListener('click', () => {
        const opening = button.getAttribute('aria-expanded') !== 'true';
        if (exclusive && opening) {
          items.forEach(other => {
            if (other === item) return;
            const otherButton = other.querySelector(':scope > button');
            const otherPanel = otherButton && document.getElementById(otherButton.getAttribute('aria-controls'));
            other.classList.remove('open');
            if (otherButton) {
              otherButton.setAttribute('aria-expanded', 'false');
              const sign = otherButton.querySelector(':scope > i');
              if (sign) sign.textContent = '+';
            }
            if (otherPanel) otherPanel.hidden = true;
          });
        }
        item.classList.toggle('open', opening);
        button.setAttribute('aria-expanded', String(opening));
        panel.hidden = !opening;
        const sign = button.querySelector(':scope > i');
        if (sign) sign.textContent = opening ? '−' : '+';
      });
    });
  };
  bindDisclosure('.era', true);
  bindDisclosure('.framework', true);
  bindDisclosure('.compact-project');

  const track = document.querySelector('.writing-track');
  const writingButtons = document.querySelectorAll('.writing-controls button');
  if (track && writingButtons.length === 2) {
    writingButtons[0].addEventListener('click', () => track.scrollBy({ left: -track.clientWidth * .82, behavior: 'smooth' }));
    writingButtons[1].addEventListener('click', () => track.scrollBy({ left: track.clientWidth * .82, behavior: 'smooth' }));
  }

  const toolkitData = [
    {
      title: 'Open-Source Digital Forensics',
      copy: 'Acquire, inspect and connect evidence across disks, memory, network traffic and event timelines.',
      tools: [
        ['Autopsy', 'https://www.autopsy.com/download/', 'Disk and file-system investigation'],
        ['Volatility 3', 'https://volatilityfoundation.org/', 'Memory forensics'],
        ['Wireshark', 'https://www.wireshark.org/download.html', 'Packet and protocol analysis'],
        ['Timesketch', 'https://timesketch.org/', 'Collaborative timeline analysis'],
      ],
    },
    {
      title: 'Cyber Threat Intelligence',
      copy: 'Structure, compare and share threat behaviour without losing the relationship between evidence and assessment.',
      tools: [
        ['MITRE ATT&CK Navigator', 'https://mitre-attack.github.io/attack-navigator/', 'Map adversary behaviours'],
        ['MISP', 'https://www.misp-project.org/', 'Share and correlate threat intelligence'],
        ['CyberChef', 'https://gchq.github.io/CyberChef/', 'Decode and transform technical evidence'],
      ],
    },
    {
      title: 'Network & Geospatial Analysis',
      copy: 'Make relationships, influence, movement and place visible enough to test rather than merely describe.',
      tools: [
        ['Gephi', 'https://gephi.org/', 'Explore complex networks'],
        ['QGIS', 'https://qgis.org/', 'Analyse and communicate spatial evidence'],
      ],
    },
    {
      title: 'Research & Data Preparation',
      copy: 'Collect sources, preserve provenance and clean inconsistent information before analysis begins.',
      tools: [
        ['Zotero', 'https://www.zotero.org/download/', 'Research and source management'],
        ['OpenRefine', 'https://openrefine.org/download.html', 'Clean and reconcile messy data'],
      ],
    },
  ];

  const toolkitTabs = [...document.querySelectorAll('.toolkit-tabs button')];
  const toolkitPanel = document.getElementById('active-toolkit');
  const methodData = [
    ['Frame', 'Key Assumptions Check', 'Expose the beliefs that must be true for a judgement or plan to hold.'],
    ['Challenge', 'Analysis of Competing Hypotheses', 'Compare multiple explanations against the full evidence set, including inconsistency.'],
    ['Monitor', 'Indicators & Signposts', 'Define observable changes that would confirm, weaken or redirect an assessment.'],
    ['Frame', 'Quality of Information Check', 'Evaluate source access, reliability, corroboration, gaps and possible distortion.'],
    ['Challenge', 'Devil’s Advocacy', 'Build the strongest credible case against the prevailing judgement.'],
    ['Challenge', 'Pre-Mortem Analysis', 'Assume the plan failed, then work backward to identify hidden vulnerabilities.'],
    ['Explore', 'Alternative Futures', 'Develop coherent scenarios around the uncertainties that matter most.'],
    ['Monitor', 'Chronology & Link Analysis', 'Map sequence, relationships, influence and gaps without flattening uncertainty.'],
  ];
  const structuredMarkup = `<div class="toolbox-head compact"><div class="toolbox-subhead"><small>TOOLKIT 01</small><h3>Structured Analytic Techniques</h3><p>Methods for framing, challenging, exploring and monitoring judgements under uncertainty.</p></div><div class="filters" role="group" aria-label="Filter analytical techniques">${['All', 'Frame', 'Challenge', 'Explore', 'Monitor'].map(category => `<button type="button" class="${category === 'Frame' ? 'active' : ''}" aria-pressed="${category === 'Frame'}">${category}</button>`).join('')}</div></div><div class="method-grid compact" aria-live="polite">${methodData.map(([category, title, copy]) => `<article${category === 'Frame' ? '' : ' hidden'}><small>${category}</small><h3>${title}</h3><p>${copy}</p><span>Structured analytic technique</span></article>`).join('')}</div>`;

  const bindFilters = () => {
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
  };
  if (toolkitPanel) toolkitPanel.innerHTML = structuredMarkup;
  bindFilters();

  if (toolkitPanel && toolkitTabs.length === 5) {
    toolkitTabs.forEach((button, index) => button.addEventListener('click', () => {
      toolkitTabs.forEach((tab, tabIndex) => {
        const active = tabIndex === index;
        tab.classList.toggle('active', active);
        tab.setAttribute('aria-selected', String(active));
        tab.querySelector('b').textContent = active ? '−' : '+';
      });
      if (index === 0) {
        toolkitPanel.innerHTML = structuredMarkup;
        bindFilters();
        return;
      }
      const selected = toolkitData[index - 1];
      toolkitPanel.innerHTML = `<article class="toolkit selected"><small>TOOLKIT ${String(index + 1).padStart(2, '0')}</small><h3>${selected.title}</h3><p>${selected.copy}</p><div>${selected.tools.map(([name, url, note]) => `<a href="${url}" target="_blank" rel="noopener noreferrer"><strong>${name}</strong><span>${note}</span><b>↗</b></a>`).join('')}</div></article>`;
    }));
  }

  let videoModal;
  const closeVideo = () => {
    if (!videoModal) return;
    videoModal.remove();
    videoModal = null;
    document.body.style.overflow = '';
  };
  const openVideo = () => {
    if (videoModal) return;
    videoModal = document.createElement('div');
    videoModal.className = 'video-modal';
    videoModal.setAttribute('role', 'dialog');
    videoModal.setAttribute('aria-modal', 'true');
    videoModal.setAttribute('aria-label', 'Candid interview with David Barske');
    videoModal.innerHTML = '<div class="video-dialog"><button class="video-close" type="button" aria-label="Close video">×</button><div class="video-frame"><iframe src="https://www.youtube-nocookie.com/embed/T9wILvRZG7Y?rel=0" title="Candid interview: failure, leverage and learning by doing" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div><div><strong>Candid Interview: Failure, Leverage and Learning by Doing</strong><a href="https://www.youtube.com/shorts/T9wILvRZG7Y" target="_blank" rel="noopener noreferrer">Open on YouTube ↗</a></div></div>';
    videoModal.addEventListener('click', event => { if (event.target === videoModal) closeVideo(); });
    videoModal.querySelector('.video-close').addEventListener('click', closeVideo);
    document.body.appendChild(videoModal);
    document.body.style.overflow = 'hidden';
    videoModal.querySelector('.video-close').focus();
  };
  document.querySelectorAll('.conversation-thumbnail, .conversation-copy .primary-button').forEach(button => button.addEventListener('click', openVideo));

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeVideo();
  });
})();
