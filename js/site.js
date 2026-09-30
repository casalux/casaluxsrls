/* Casalux — script condiviso */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  /* Su telefono la pagina resta ferma: niente parallasse né comparse */
  const still = matchMedia('(max-width: 700px)');
  still.addEventListener?.('change', () => { $$('[data-depth]').forEach(el => el.style.transform = ''); });
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const nav = $('#nav'), callbar = $('#callbar'), burger = $('#burger');

  /* Menu mobile */
  if (burger) {
    const setOpen = (o) => { nav.classList.toggle('open', o); burger.setAttribute('aria-expanded', o); document.body.style.overflow = o ? 'hidden' : ''; };
    burger.addEventListener('click', () => setOpen(!nav.classList.contains('open')));
    $$('.menu a').forEach(a => a.addEventListener('click', () => setOpen(false)));
    addEventListener('keydown', e => { if (e.key === 'Escape') setOpen(false); });
  }

  /* Video hero: muto, in loop; fermo con "riduci movimento" o fuori schermo */
  const video = $('#heroVideo');
  if (video) {
    const sync = () => { if (reduce.matches) video.pause(); else video.play().catch(() => {}); };
    sync(); reduce.addEventListener?.('change', sync);
    new IntersectionObserver(([e]) => { if (!reduce.matches) e.isIntersecting ? video.play().catch(() => {}) : video.pause(); }, { threshold: .05 }).observe(video);
  }

  /* Comparsa allo scroll */
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px', threshold: .12 });
  const observeReveal = (root = document) => $$('.rv:not(.in),.draw:not(.in)', root).forEach(el => io.observe(el));
  observeReveal();
  requestAnimationFrame(() => $$('.hero .rv,.phead .rv').forEach(el => el.classList.add('in')));

  /* Parallasse: solo transform, un aggiornamento per frame, solo livelli visibili */
  const layers = $$('[data-depth]').map(el => ({ el, d: parseFloat(el.dataset.depth), on: true, top: !!el.closest('.hero,.phead') }));
  const vis = new IntersectionObserver(es => es.forEach(e => { const L = layers.find(l => l.el === e.target); if (L) L.on = e.isIntersecting; }), { rootMargin: '20% 0px' });
  layers.forEach(l => vis.observe(l.el));
  let ticking = false;
  const update = () => {
    ticking = false;
    const y = scrollY, vh = innerHeight;
    nav && nav.classList.toggle('solid', y > 24);
    callbar && callbar.classList.toggle('show', y > vh * .5);
    if (reduce.matches || still.matches) return;
    const k = 1;
    for (const l of layers) {
      if (!l.on) continue;
      let delta;
      if (l.top) delta = y;
      else { const r = l.el.getBoundingClientRect(); delta = r.top + r.height / 2 - vh / 2; }
      l.el.style.transform = `translate3d(0,${(delta * l.d * k).toFixed(2)}px,0)`;
    }
  };
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll, { passive: true });
  reduce.addEventListener?.('change', () => { layers.forEach(l => l.el.style.transform = ''); onScroll(); });
  update();

  /* Mappa: caricata solo su richiesta (nessun cookie di terze parti prima) */
  const mapBtn = $('#loadMap');
  if (mapBtn) mapBtn.addEventListener('click', () => {
    const f = document.createElement('iframe');
    f.title = 'Mappa: Via Roma 2, Roncade (TV)';
    f.referrerPolicy = 'no-referrer-when-downgrade';
    f.src = 'https://maps.google.com/maps?q=Via%20Roma%202%2C%2031056%20Roncade%20TV&z=16&output=embed';
    $('#map').appendChild(f);
  });

  /* Modulo contatti (FormSubmit, stesso indirizzo del sito precedente) */
  const form = $('#contactForm');
  if (form) form.addEventListener('submit', e => {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    const err = $('#formError'), btn = form.querySelector('button[type=submit]'), old = btn.innerHTML;
    err.style.display = 'none'; btn.disabled = true; btn.textContent = 'Invio in corso…';
    const data = {
      Nome: form.nome.value, Cognome: form.cognome.value, Email: form.email.value,
      Telefono: form.tel.value, Messaggio: form.msg.value,
      _subject: 'Nuova richiesta dal sito Casalux', _template: 'table', _captcha: 'false', _honey: form._honey.value
    };
    fetch(form.dataset.endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data) })
      .then(r => r.json())
      .then(res => { if (res && (res.success === true || res.success === 'true')) { $('#formBody').style.display = 'none'; $('#formSuccess').classList.add('show'); } else throw 0; })
      .catch(() => { btn.disabled = false; btn.innerHTML = old; err.style.display = 'block'; });
  });


  /* Pop-up WhatsApp e Chiama: si sceglie il referente, poi si apre l'app */
  const dialogs = { wa: $('#waDialog'), call: $('#callDialog') };
  if (dialogs.wa && typeof dialogs.wa.showModal === 'function') {
    document.addEventListener('click', e => {
      const t = e.target.closest('[data-wa],[data-call]');
      if (!t) return;
      e.preventDefault(); e.stopPropagation();
      if (nav && nav.classList.contains('open')) burger && burger.click();
      (t.hasAttribute('data-call') ? dialogs.call : dialogs.wa).showModal();
    }, true);
    Object.values(dialogs).forEach(dlg => dlg && dlg.addEventListener('click', e => {
      if (e.target === dlg || e.target.closest('[data-close]')) dlg.close();
      else if (e.target.closest('.wa-opt')) setTimeout(() => dlg.close(), 150);
    }));
  }

  /* Recensioni a scorrimento (si ferma con "riduci movimento") */
  const car = $('#carousel');
  if (car) {
    const slides = $$('.slide', car), dots = $$('.dots button');
    let i = 0, timer;
    const show = n => {
      i = (n + slides.length) % slides.length;
      slides.forEach((s, k) => s.classList.toggle('on', k === i));
      dots.forEach((d, k) => d.setAttribute('aria-pressed', k === i));
    };
    const start = () => { clearInterval(timer); if (!reduce.matches) timer = setInterval(() => show(i + 1), 7000); };
    dots.forEach(d => d.addEventListener('click', () => { show(+d.dataset.go); start(); }));
    car.addEventListener('mouseenter', () => clearInterval(timer));
    car.addEventListener('mouseleave', start);
    start();
  }

  /* Galleria lavori (dati in js/lavori-data.js) */
  const gal = $('#gallery');
  if (gal) {
    const items = (window.LAVORI || []).map(x => typeof x === 'string' ? { img: x } : x).filter(x => x && x.img);
    const labels = { ristrutturazioni: 'Ristrutturazioni', cappotti: 'Cappotti', tetti: 'Tetti', interni: 'Interni', esterni: 'Esterni' };
    const empty = $('#galleryEmpty'), filters = $('#filters');
    if (!items.length) { empty.hidden = false; filters.hidden = true; }
    else {
      const cats = [...new Set(items.map(i => i.cat).filter(Boolean))];
      if (cats.length > 1) {
        filters.innerHTML = ['tutti', ...cats].map((c, i) => `<button type="button" data-cat="${c}" aria-pressed="${i === 0}">${c === 'tutti' ? 'Tutti' : (labels[c] || c)}</button>`).join('');
      } else filters.hidden = true;
      const esc = s => String(s || '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
      const render = cat => {
        gal.innerHTML = items.filter(i => cat === 'tutti' || i.cat === cat).map((i, n) => `
          <button class="item rv" type="button" data-i="${items.indexOf(i)}">
            <img src="${esc(i.img)}" alt="${esc(i.title || 'Lavoro Casalux')}" loading="lazy" decoding="async">
            ${i.title || i.luogo ? `<span class="cap"><b>${esc(i.title)}</b><span>${esc(i.luogo)}</span></span>` : ''}
          </button>`).join('');
        observeReveal(gal);
      };
      render('tutti');
      filters.addEventListener('click', e => {
        const b = e.target.closest('button'); if (!b) return;
        $$('button', filters).forEach(x => x.setAttribute('aria-pressed', x === b));
        render(b.dataset.cat);
      });
      const lb = $('#lightbox');
      gal.addEventListener('click', e => {
        const b = e.target.closest('.item'); if (!b) return;
        const i = items[+b.dataset.i];
        $('img', lb).src = i.img; $('img', lb).alt = i.title || '';
        $('figcaption', lb).innerHTML = [i.title && `<b>${esc(i.title)}</b>`, i.luogo && esc(i.luogo), i.desc && esc(i.desc)].filter(Boolean).join(' · ');
        lb.classList.add('show'); $('.x', lb).focus();
      });
      const close = () => lb.classList.remove('show');
      lb.addEventListener('click', e => { if (e.target === lb || e.target.closest('.x')) close(); });
      addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
    }
  }
})();
