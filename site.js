/* Sean Ahern Digital: motion layer */
(function(){
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Scroll progress bar
  var bar = document.createElement('div');
  bar.className = 'sx-progress';
  document.body.appendChild(bar);
  function onScroll(){
    var h = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = 'scaleX(' + (h > 0 ? Math.min(1, scrollY / h) : 0) + ')';
  }
  addEventListener('scroll', onScroll, {passive:true}); onScroll();

  if (reduce) return;

  // Hero headline: words rise in one after another
  var h1 = document.querySelector('h1.title, .lp-hero h1');
  if (h1) {
    var i = 0;
    (function wrap(node){
      Array.prototype.slice.call(node.childNodes).forEach(function(n){
        if (n.nodeType === 3) {
          var frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function(part){
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
            var w = document.createElement('span'); w.className = 'sx-w';
            var inner = document.createElement('span'); inner.textContent = part;
            inner.style.transitionDelay = (0.12 + i++ * 0.07) + 's';
            w.appendChild(inner); frag.appendChild(w);
          });
          n.parentNode.replaceChild(frag, n);
        } else if (n.nodeType === 1) { wrap(n); }
      });
    })(h1);
    h1.classList.remove('reveal'); h1.classList.add('in');
    requestAnimationFrame(function(){ requestAnimationFrame(function(){ document.documentElement.classList.add('sx-ready'); }); });
  }

  // Section entrances
  var secs = document.querySelectorAll('section, .lp-hero');
  var sio = new IntersectionObserver(function(es){
    es.forEach(function(e){ if (e.isIntersecting) { e.target.classList.add('sx-in'); sio.unobserve(e.target); } });
  }, {threshold:0.12, rootMargin:'0px 0px -8% 0px'});
  secs.forEach(function(s){ if (!s.classList.contains('hero')) { s.classList.add('sx'); sio.observe(s); } });

  // Staggered children in grids
  var groups = document.querySelectorAll('.case-grid, .webgrid, .books, .about-grid, .edu-wrap, .vs-wrap');
  var gio = new IntersectionObserver(function(es){
    es.forEach(function(e){
      if (!e.isIntersecting) return;
      Array.prototype.forEach.call(e.target.children, function(c, k){
        c.style.transitionDelay = (k * 0.09) + 's';
        c.classList.add('sx-on');
        setTimeout(function(){ c.style.transitionDelay = ''; }, 1200 + k * 90);
      });
      gio.unobserve(e.target);
    });
  }, {threshold:0.1});
  groups.forEach(function(g){
    Array.prototype.forEach.call(g.children, function(c){ c.classList.remove('reveal'); c.classList.add('sx-st'); });
    gio.observe(g);
  });

  // Count up the hero numbers
  var nums = document.querySelectorAll('.stat .n');
  var cio = new IntersectionObserver(function(es){
    es.forEach(function(e){
      if (!e.isIntersecting) return;
      var el = e.target, m = el.textContent.match(/^([^\d]*)([\d,.]+)(.*)$/);
      cio.unobserve(el);
      if (!m) return;
      var end = parseFloat(m[2].replace(/,/g,'')), t0 = null, dur = 1600;
      (function step(t){
        if (!t0) t0 = t;
        var p = Math.min(1, (t - t0) / dur), v = Math.round(end * (1 - Math.pow(1 - p, 4)));
        el.textContent = m[1] + v.toLocaleString() + m[3];
        if (p < 1) requestAnimationFrame(step);
      })(performance.now());
    });
  }, {threshold:0.6});
  nums.forEach(function(n){ cio.observe(n); });

  // Active section in the nav
  var links = {};
  document.querySelectorAll('.nav-links a[href*="#"]').forEach(function(a){
    var id = a.getAttribute('href').split('#')[1];
    if (id && (a.getAttribute('href').charAt(0) === '#')) links[id] = a;
  });
  var aio = new IntersectionObserver(function(es){
    es.forEach(function(e){
      var a = links[e.target.id]; if (!a) return;
      if (e.isIntersecting) {
        Object.keys(links).forEach(function(k){ links[k].classList.remove('is-active'); });
        a.classList.add('is-active');
      }
    });
  }, {rootMargin:'-45% 0px -50% 0px'});
  Object.keys(links).forEach(function(id){ var s = document.getElementById(id); if (s) aio.observe(s); });
})();
