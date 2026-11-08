(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var toggle = document.querySelector('.menu-toggle');
    var menu = document.getElementById('primary-menu');

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
