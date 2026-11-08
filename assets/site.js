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
    { title: "Publicación destacada · 2", url: "https://www.linkedin.com/feed/update/urn:li:activity:7500144061094227968/" },
    { title: "Publicación destacada · 3", url: "https://www.linkedin.com/feed/update/urn:li:activity:7486709274396626945/" },
    { title: "Publicación destacada · 4", url: "https://www.linkedin.com/feed/update/urn:li:activity:7484160218491191296/" },
    { title: "Publicación destacada · 5", url: "https://www.linkedin.com/feed/update/urn:li:activity:7486392225208324096/" }
  ],
  // Cal.com — enlaces de cada tipo de evento, formato "usuario/evento"
  cal: {
    free:  "",   // Primera conversación · 15 min · gratuita
    s60:   "",   // Consultoría puntual · 60 min
    s120:  ""    // Intervención aplicada · 120 min
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
