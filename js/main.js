/* ============================================================
   CASALUX — Shared scripts (safe on every page)
   ============================================================ */
(function(){
  "use strict";

  /* ---------- Header on scroll ---------- */
  var header=document.getElementById('header');
  if(header){
    window.addEventListener('scroll',function(){
      header.classList.toggle('scrolled',window.scrollY>40);
    },{passive:true});
  }

  /* ---------- Mobile menu ---------- */
  var burger=document.getElementById('burger');
  if(burger){
    burger.addEventListener('click',function(){
      var open=document.body.classList.toggle('nav-open');
      burger.setAttribute('aria-expanded',open);
    });
    document.querySelectorAll('.nav-links a, .nav-cta').forEach(function(a){
      a.addEventListener('click',function(){
        document.body.classList.remove('nav-open');
        burger.setAttribute('aria-expanded','false');
      });
    });
  }

  /* ---------- Build portfolio from LAVORI (lavori.html) ---------- */
  var portfolio=document.getElementById('portfolio');
  if(portfolio && window.LAVORI && Array.isArray(window.LAVORI)){
    var LABEL={ristrutturazioni:'Ristrutturazioni',cappotti:'Cappotti',tetti:'Tetti',interni:'Interni',esterni:'Esterni'};
    var pinSvg='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>';
    var zoomSvg='<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>';
    var esc=function(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});};
    var html='';
    window.LAVORI.forEach(function(p){
      if(typeof p==='string'){p={img:p};}          /* si può scrivere anche solo "img/lavori/foto.jpg" */
      if(!p.img){return;}
      var cat=p.cat||'', label=LABEL[cat]||cat, title=p.title||'Lavoro Casalux';
      html+='<div class="proj" data-cat="'+esc(cat)+'" data-img="'+esc(p.img)+'" data-title="'+esc(title)+'">'
        +'<img src="'+esc(p.img)+'" alt="'+esc(title)+'" loading="lazy">'
        +'<span class="proj-zoom">'+zoomSvg+'</span>'
        +'<div class="proj-overlay">'+(label?'<span class="proj-cat">'+esc(label)+'</span>':'')
        +'<h4>'+esc(title)+'</h4>'
        +(p.luogo?'<span class="proj-loc">'+pinSvg+esc(p.luogo)+'</span>':'')
        +(p.desc?'<p class="proj-desc">'+esc(p.desc)+'</p>':'')
        +'</div></div>';
    });
    portfolio.innerHTML=html;
  }

  /* ---------- Scroll reveal ---------- */
  var reveals=document.querySelectorAll('.reveal');
  if(reveals.length && 'IntersectionObserver' in window){
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}
      });
    },{threshold:.14});
    reveals.forEach(function(el){io.observe(el);});
  }else{
    reveals.forEach(function(el){el.classList.add('in');});
  }

  /* ---------- Animated stats ---------- */
  var statsEl=document.getElementById('stats');
  if(statsEl && 'IntersectionObserver' in window){
    var done=false;
    var statObs=new IntersectionObserver(function(entries){
      if(entries[0].isIntersecting && !done){
        done=true;
        document.querySelectorAll('.stat-num[data-target]').forEach(function(el){
          var target=+el.dataset.target, suffix=el.dataset.suffix||'', cur=0, step=target/60;
          (function tick(){
            cur+=step;
            if(cur<target){el.textContent=Math.floor(cur)+suffix;requestAnimationFrame(tick);}
            else{el.textContent=target+suffix;}
          })();
        });
      }
    },{threshold:.4});
    statObs.observe(statsEl);
  }

  /* ---------- Portfolio filter ---------- */
  var filters=document.getElementById('filters');
  if(filters){
    filters.addEventListener('click',function(e){
      var btn=e.target.closest('.filter'); if(!btn) return;
      filters.querySelectorAll('.filter').forEach(function(f){f.classList.remove('active');});
      btn.classList.add('active');
      var cat=btn.dataset.filter;
      document.querySelectorAll('.proj').forEach(function(p){
        p.classList.toggle('hide',!(cat==='all'||p.dataset.cat===cat));
      });
    });
  }

  /* ---------- Lightbox ---------- */
  var lb=document.getElementById('lightbox');
  if(lb){
    var lbImg=document.getElementById('lbImg'), lbCap=document.getElementById('lbCap');
    document.querySelectorAll('.proj').forEach(function(p){
      p.addEventListener('click',function(){
        lbImg.src=p.dataset.img; lbImg.alt=p.dataset.title; lbCap.textContent=p.dataset.title;
        lb.classList.add('open');
      });
    });
    var closeLb=function(){lb.classList.remove('open');};
    var lbClose=document.getElementById('lbClose');
    if(lbClose) lbClose.addEventListener('click',closeLb);
    lb.addEventListener('click',function(e){if(e.target===lb)closeLb();});
    document.addEventListener('keydown',function(e){if(e.key==='Escape')closeLb();});
  }

  /* ---------- Testimonials slider ---------- */
  var slides=document.querySelectorAll('.testi-slide');
  var dots=document.querySelectorAll('.testi-dot');
  if(slides.length){
    var cur=0,timer;
    var go=function(i){
      slides[cur].classList.remove('active'); if(dots[cur])dots[cur].classList.remove('active');
      cur=(i+slides.length)%slides.length;
      slides[cur].classList.add('active'); if(dots[cur])dots[cur].classList.add('active');
    };
    var auto=function(){timer=setInterval(function(){go(cur+1);},5500);};
    dots.forEach(function(d,i){d.addEventListener('click',function(){clearInterval(timer);go(i);auto();});});
    auto();
  }

  /* ---------- FAQ accordion ---------- */
  var faqItems=document.querySelectorAll('.faq-item');
  if(faqItems.length){
    faqItems.forEach(function(item){
      item.querySelector('.faq-q').addEventListener('click',function(){
        var open=item.classList.contains('open');
        faqItems.forEach(function(i){i.classList.remove('open');i.querySelector('.faq-a').style.maxHeight=null;});
        if(!open){item.classList.add('open');var a=item.querySelector('.faq-a');a.style.maxHeight=a.scrollHeight+'px';}
      });
    });
  }

  /* ---------- Contact form (FormSubmit AJAX) ---------- */
  var form=document.getElementById('contactForm');
  if(form){
    var showSuccess=function(){
      var b=document.getElementById('formBody'), s=document.getElementById('formSuccess');
      if(b)b.style.display='none';
      if(s)s.classList.add('show');
    };
    form.addEventListener('submit',function(e){
      e.preventDefault();
      if(!form.checkValidity()){form.reportValidity();return;}
      var endpoint=form.getAttribute('data-endpoint');
      var errEl=document.getElementById('formError');
      if(errEl) errEl.style.display='none';
      var btn=form.querySelector('button[type=submit]');
      var oldHtml=btn.innerHTML;
      btn.disabled=true; btn.textContent='Invio in corso...';

      var data={
        Nome:form.nome.value, Cognome:form.cognome.value,
        Email:form.email.value, Telefono:form.tel.value, Messaggio:form.msg.value,
        access_key:'72d60b09-3526-463b-820e-444ecc351c16', subject:'Nuova richiesta dal sito Casalux'
      };

      // Nessun endpoint configurato -> mostra solo conferma (modalità demo)
      if(!endpoint){ showSuccess(); return; }

      fetch(endpoint,{
        method:'POST',
        headers:{'Content-Type':'application/json','Accept':'application/json'},
        body:JSON.stringify(data)
      })
      .then(function(r){return r.json();})
      .then(function(res){
        if(res && (res.success==='true'||res.success===true)){ showSuccess(); }
        else { throw new Error('fail'); }
      })
      .catch(function(){
        btn.disabled=false; btn.innerHTML=oldHtml;
        if(errEl) errEl.style.display='block';
      });
    });
  }
})();

/* ── Popup WhatsApp ── */
function openWhatsappPopup(){ var p=document.getElementById('whatsappPopup'); if(p){ p.style.display='flex'; p.setAttribute('aria-hidden','false'); } }
function closeWhatsappPopup(){ var p=document.getElementById('whatsappPopup'); if(p){ p.style.display='none'; p.setAttribute('aria-hidden','true'); } }
document.addEventListener('click', function(e){ if(e.target && e.target.id==='whatsappPopup') closeWhatsappPopup(); });
document.addEventListener('keydown', function(e){ if(e.key==='Escape') closeWhatsappPopup(); });
