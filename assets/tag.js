// Etiqueta de Google (Google Ads) con consentimiento: nada de cookies
// publicitarias hasta que la persona acepta en el aviso.
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
(function () {
  var ID = 'GTM-NK25SDLL';
  var ALL = {ad_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'granted', analytics_storage: 'granted'};
  gtag('consent', 'default', {ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'denied'});
  var saved = null;
  try { saved = localStorage.getItem('fe_consent'); } catch (e) {}
  if (saved === 'granted') gtag('consent', 'update', ALL);
  gtag('js', new Date());
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtm.js?id=' + ID;
  document.head.appendChild(s);

  if (saved) return;
  var lang = (location.pathname.split('/')[1] || 'es');
  var t = {
    es: ['Usamos cookies de Google para medir si los anuncios funcionan. Solo se activan si aceptas.', 'Aceptar', 'Rechazar'],
    en: ['We use Google cookies to measure whether our ads work. They are only activated if you accept.', 'Accept', 'Decline'],
    fr: ['Nous utilisons des cookies Google pour mesurer l’efficacité des annonces. Ils ne sont activés que si vous acceptez.', 'Accepter', 'Refuser']
  }[lang];
  if (!t) return;
  function show() {
    var b = document.createElement('div');
    b.className = 'consent';
    b.setAttribute('role', 'dialog');
    b.innerHTML = '<p></p><div><button type="button" class="consent-no"></button><button type="button" class="consent-yes"></button></div>';
    b.querySelector('p').textContent = t[0];
    var no = b.querySelector('.consent-no'), yes = b.querySelector('.consent-yes');
    no.textContent = t[2]; yes.textContent = t[1];
    function close(v) {
      try { localStorage.setItem('fe_consent', v); } catch (e) {}
      if (v === 'granted') gtag('consent', 'update', ALL);
      b.remove();
    }
    yes.onclick = function () { close('granted'); };
    no.onclick = function () { close('denied'); };
    document.body.appendChild(b);
  }
  if (document.body) show(); else document.addEventListener('DOMContentLoaded', show);
})();
