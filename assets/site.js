/* ------------------------------------------------------------------
   FROM E™ ONE — configuración editable
   Único punto de edición para enlaces externos y agenda.
   Un valor vacío ("") oculta el elemento o muestra el estado
   "configuración pendiente". No se inventa disponibilidad.
------------------------------------------------------------------- */
window.FROME_CONFIG = {
  links: {
    linkedin: "https://www.linkedin.com/in/esmeralda-garc%C3%ADa-2a691414/",
    linkedinArticles: "https://www.linkedin.com/in/esmeralda-garc%C3%ADa-2a691414/recent-activity/articles/",
    zenodo: "https://zenodo.org/records/19056589",
    orcid: "https://orcid.org/0009-0006-4076-0663"
  },
  // Artículos destacados de LinkedIn (orden de aparición en el desplegable)
  articles: [
    { title: "Cognitive Coupling: When Intelligence Stops Existing in Just One Place", url: "https://www.linkedin.com/feed/update/urn:li:activity:7489654686074097664/" },
    { title: "FromE ONE · Case 01: Closing the First Phase. Accelerated Operational Adoption of AI", url: "https://www.linkedin.com/feed/update/urn:li:activity:7500144061094227968/" },
    { title: "Beneath Judgment Lies Criterion", url: "https://www.linkedin.com/feed/update/urn:li:activity:7486709274396626945/" },
    { title: "The Mirror: \"That's Made with AI\" No Longer Means What You Think", url: "https://www.linkedin.com/feed/update/urn:li:activity:7484160218491191296/" },
    { title: "The Casino Can't Regulate the Game", url: "https://www.linkedin.com/feed/update/urn:li:activity:7486392225208324096/" }
  ],
  // Cal.com — enlaces de cada tipo de evento, formato "usuario/evento"
  cal: {
    free:  "esmeralda-garcia-jkfxbj/primera-conversacion",        // Primera conversación · 15 min · gratuita
    s60:   "esmeralda-garcia-jkfxbj/consultoria-60",        // Consultoría puntual · 60 min
    s120:  "esmeralda-garcia-jkfxbj/intervencion-120"   // Intervención aplicada · 120 min
  }
};

(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var toggle = document.querySelector('.menu-toggle');
    var menu = document.getElementById('primary-menu');
    var cfg = window.FROME_CONFIG || {};
    var i18n = (function () {
      var el = document.querySelector('[data-i18n]');
      try { return el ? JSON.parse(el.getAttribute('data-i18n')) : {}; } catch (e) { return {}; }
    })();

    /* ---------- Barra de credenciales: enlaces y desplegables ---------- */
    function fill(sel, url) {
      var nodes = document.querySelectorAll(sel);
      for (var k = 0; k < nodes.length; k++) {
        if (url) { nodes[k].href = url; nodes[k].removeAttribute('aria-disabled'); nodes[k].classList.remove('pending'); }
        else { nodes[k].setAttribute('aria-disabled', 'true'); nodes[k].classList.add('pending'); nodes[k].removeAttribute('href'); }
      }
    }
    var L = cfg.links || {};
    fill('[data-link="linkedin"]', L.linkedin);
    fill('[data-link="linkedin-articles"]', L.linkedinArticles || L.linkedin);
    fill('[data-link="zenodo"]', L.zenodo);
    fill('[data-link="orcid"]', L.orcid);

    var artList = document.querySelector('[data-articles]');
    if (artList) {
      var arts = (cfg.articles || []).filter(function (a) { return a && a.url && a.title; });
      if (arts.length) {
        artList.innerHTML = '';
        for (var m = 0; m < arts.length; m++) {
          var li = document.createElement('a');
          li.setAttribute('role', 'menuitem');
          li.href = arts[m].url; li.target = '_blank'; li.rel = 'noopener';
          li.textContent = arts[m].title;
          artList.appendChild(li);
        }
      } else {
        artList.innerHTML = '<span class="dd-note">' + (i18n.articlesPending || 'Selección de artículos en preparación') + '</span>';
      }
    }

    var dds = document.querySelectorAll('.dd');
    function closeAll(except) {
      for (var d = 0; d < dds.length; d++) {
        if (dds[d] === except) continue;
        dds[d].classList.remove('open');
        var b = dds[d].querySelector('.dd-btn'); if (b) b.setAttribute('aria-expanded', 'false');
      }
    }
    for (var n = 0; n < dds.length; n++) {
      (function (dd) {
        var btn = dd.querySelector('.dd-btn');
        if (!btn) return;
        btn.addEventListener('click', function (e) {
          e.stopPropagation();
          var open = dd.classList.toggle('open');
          btn.setAttribute('aria-expanded', open ? 'true' : 'false');
          closeAll(dd);
        });
        dd.addEventListener('mouseenter', function () {
          if (window.matchMedia('(hover: hover)').matches) { dd.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); }
        });
        dd.addEventListener('mouseleave', function () {
          if (window.matchMedia('(hover: hover)').matches) { dd.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); }
        });
      })(dds[n]);
    }
    document.addEventListener('click', function () { closeAll(null); });

    /* ---------- Reservas: Cal.com embebido + selección de servicio ---------- */
    var calHost = document.getElementById('cal-host');
    if (calHost) {
      var calCfg = cfg.cal || {};
      var tabs = document.querySelectorAll('[data-service]');
      var pending = document.getElementById('cal-pending');
      var serviceInput = document.querySelector('input[name="servicio"]');
      var calLoaded = false;

      function loadCal() {
        if (calLoaded) return;
        calLoaded = true;
        (function (C, A, L) { var p = function (a, ar) { a.q.push(ar); }; var d = C.document; C.Cal = C.Cal || function () { var cal = C.Cal; var ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; } if (ar[0] === L) { var api = function () { p(api, arguments); }; var namespace = ar[1]; api.q = api.q || []; if (typeof namespace === "string") { cal.ns[namespace] = cal.ns[namespace] || api; p(cal.ns[namespace], ar); p(cal, ["initNamespace", namespace]); } else p(cal, ar); return; } p(cal, ar); }; })(window, "https://app.cal.com/embed/embed.js", "init");
        window.Cal("init", { origin: "https://app.cal.com" });
      }

      function showService(key) {
        for (var t = 0; t < tabs.length; t++) {
          var on = tabs[t].getAttribute('data-service') === key;
          tabs[t].classList.toggle('active', on);
          tabs[t].setAttribute('aria-selected', on ? 'true' : 'false');
        }
        if (serviceInput) {
          var lbl = document.querySelector('[data-service="' + key + '"]');
          serviceInput.value = lbl ? lbl.getAttribute('data-label') : key;
        }
        var link = calCfg[key];
        calHost.innerHTML = '';
        if (link) {
          if (pending) pending.hidden = true;
          calHost.hidden = false;
          loadCal();
          window.Cal("inline", {
            elementOrSelector: "#cal-host",
            calLink: link,
            config: { layout: "month_view", theme: "dark" }
          });
          window.Cal("ui", { theme: "dark", styles: { branding: { brandColor: "#2ca9ff" } }, hideEventTypeDetails: false });
        } else {
          calHost.hidden = true;
          if (pending) pending.hidden = false;
        }
      }

      for (var s = 0; s < tabs.length; s++) {
        (function (tab) {
          tab.addEventListener('click', function (e) {
            if (tab.tagName === 'A') e.preventDefault();
            showService(tab.getAttribute('data-service'));
            var target = document.getElementById('reservar');
            if (target && tab.hasAttribute('data-scroll')) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          });
        })(tabs[s]);
      }
      var initial = (location.hash || '').replace('#', '');
      showService(/^(free|s60|s120)$/.test(initial) ? initial : 'free');
    }

    if (toggle && menu) {
      toggle.addEventListener('click', function () {
        var open = menu.classList.toggle('open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
      var links = menu.querySelectorAll('a');
      for (var i = 0; i < links.length; i++) {
        links[i].addEventListener('click', function () {
          menu.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
        });
      }
    }

    var langBtn = document.querySelector('.lang-btn');
    var langMenu = document.querySelector('.lang-menu');

    if (langBtn && langMenu) {
      var langLinks = langMenu.querySelectorAll('a[data-lang]');
      for (var j = 0; j < langLinks.length; j++) {
        (function (a) {
          a.href = '/' + a.getAttribute('data-lang') + '/' + window.location.search + window.location.hash;
          a.addEventListener('click', function () {
            try { localStorage.setItem('frome_lang', a.getAttribute('data-lang')); } catch (e) {}
          });
        })(langLinks[j]);
      }

      langBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        var open = langBtn.getAttribute('aria-expanded') === 'true';
        langBtn.setAttribute('aria-expanded', open ? 'false' : 'true');
        langMenu.hidden = open;
      });

      document.addEventListener('click', function (e) {
        if (!langBtn.contains(e.target) && !langMenu.contains(e.target)) {
          langBtn.setAttribute('aria-expanded', 'false');
          langMenu.hidden = true;
        }
      });
    }

    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      if (toggle && menu && menu.classList.contains('open')) {
        menu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
      if (langBtn && langMenu && !langMenu.hidden) {
        langBtn.setAttribute('aria-expanded', 'false');
        langMenu.hidden = true;
      }
    });
  });
})();

// Botón flotante de WhatsApp en todas las páginas.
(function () {
  var lang = (location.pathname.split('/')[1] || 'es');
  var t = {
    es: ['Escríbeme por WhatsApp', 'Hola, vengo de frome-one.com y quiero información sobre '],
    en: ['Message me on WhatsApp', "Hello, I'm coming from frome-one.com and I'd like information about "],
    fr: ['Écrivez-moi sur WhatsApp', 'Bonjour, je viens de frome-one.com et je souhaite des informations sur ']
  }[lang] || null;
  if (!t || document.querySelector('.wa-float')) return;
  var a = document.createElement('a');
  a.className = 'wa-float';
  a.href = 'https://wa.me/34627761640?text=' + encodeURIComponent(t[1]);
  a.target = '_blank';
  a.rel = 'noopener';
  a.setAttribute('aria-label', t[0]);
  a.title = t[0];
  a.innerHTML = '<svg viewBox="0 0 32 32" width="30" height="30" aria-hidden="true"><path fill="#fff" d="M16 3C9 3 3.3 8.6 3.3 15.6c0 2.5.7 4.8 1.9 6.8L3 29l6.8-2.1c1.9 1 4 1.6 6.2 1.6 7 0 12.7-5.6 12.7-12.6S23 3 16 3zm0 23.1c-2 0-3.9-.6-5.5-1.6l-.4-.2-4 1.2 1.3-3.9-.3-.4c-1.1-1.7-1.7-3.6-1.7-5.6 0-5.8 4.8-10.5 10.6-10.5s10.6 4.7 10.6 10.5S21.8 26.1 16 26.1zm5.8-7.9c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.3-.5-2.5-1.6-.9-.8-1.6-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.5-.6c.2-.2.2-.3.3-.6.1-.2 0-.4 0-.6l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.8s1.2 3.2 1.4 3.4c.2.2 2.4 3.6 5.7 5.1.8.3 1.4.5 1.9.7.8.3 1.5.2 2.1.1.6-.1 1.9-.8 2.2-1.5.3-.7.3-1.4.2-1.5-.1-.1-.3-.2-.6-.4z"/></svg>';
  document.body.appendChild(a);
})();
