
(() => {
  const menu = document.querySelector('.menu-button');
  const links = document.querySelector('.nav-links');
  if(menu && links){ menu.addEventListener('click',()=>links.classList.toggle('open')); links.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>links.classList.remove('open'))); }
  document.querySelectorAll('.era button').forEach(btn=>btn.addEventListener('click',()=>{
    const item=btn.closest('.era'); item.classList.toggle('open'); btn.setAttribute('aria-expanded', item.classList.contains('open')); item.querySelector('.sign').textContent=item.classList.contains('open')?'−':'+';
  }));
  document.querySelectorAll('.project-top').forEach(btn=>btn.addEventListener('click',()=>{
    const item=btn.closest('.project'); item.classList.toggle('open'); btn.setAttribute('aria-expanded', item.classList.contains('open')); btn.querySelector('.sign').textContent=item.classList.contains('open')?'−':'+';
  }));
  const filters=document.querySelectorAll('.filter');
  filters.forEach(f=>f.addEventListener('click',()=>{filters.forEach(x=>x.classList.remove('active'));f.classList.add('active');const cat=f.dataset.filter;document.querySelectorAll('.tool').forEach(t=>t.classList.toggle('hidden',cat!=='all'&&!t.dataset.cat.includes(cat)));}));
  const tabs=document.querySelectorAll('.tab');
  tabs.forEach(t=>t.addEventListener('click',()=>{tabs.forEach(x=>x.classList.remove('active'));document.querySelectorAll('.tab-panel').forEach(x=>x.classList.remove('active'));t.classList.add('active');document.getElementById(t.dataset.tab).classList.add('active');}));
  const lb=document.querySelector('.lightbox');
  if(lb){document.querySelectorAll('.gallery img').forEach(img=>img.addEventListener('click',()=>{lb.querySelector('img').src=img.src;lb.querySelector('img').alt=img.alt;lb.classList.add('open')}));lb.addEventListener('click',e=>{if(e.target===lb||e.target.tagName==='BUTTON')lb.classList.remove('open')});document.addEventListener('keydown',e=>{if(e.key==='Escape')lb.classList.remove('open')});}
})();
