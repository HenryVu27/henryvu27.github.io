// henryvu.io: theme, anchors, contact form, earlier-work disclosure. No scroll effects.
(function () {
  'use strict';
  var root = document.documentElement;

  // ---- Theme ----
  function currentTheme() { return root.getAttribute('data-theme') === 'day' ? 'day' : 'night'; }
  function applyTheme(next) {
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
    var btn = document.getElementById('theme-toggle');
    if (btn) { btn.textContent = next === 'night' ? 'Day' : 'Night'; btn.setAttribute('aria-pressed', String(next === 'night')); }
  }
  // Migrate old keys; the inline head script already set the attribute for first paint.
  try {
    var saved = localStorage.getItem('theme');
    if (saved === 'morning-fog') saved = 'day';
    if (saved === 'piano-symphony') saved = 'night';
    if (saved === 'day' || saved === 'night') applyTheme(saved); else applyTheme(currentTheme());
  } catch (e) { applyTheme(currentTheme()); }

  var toggle = document.getElementById('theme-toggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var next = currentTheme() === 'night' ? 'day' : 'night';
      var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (document.startViewTransition && !reduce) document.startViewTransition(function () { applyTheme(next); });
      else applyTheme(next);
    });
  }

  // ---- Same-page anchors (smooth unless reduced motion) ----
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href').slice(1);
      var el = id ? document.getElementById(id) : null;
      if (!el) return;
      e.preventDefault();
      var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
      history.replaceState(null, '', '#' + id);
    });
  });

  // ---- Earlier work disclosure ----
  var earlierBtn = document.getElementById('earlier-toggle');
  var earlier = document.getElementById('earlier');
  if (earlierBtn && earlier) {
    earlierBtn.addEventListener('click', function () {
      var open = earlier.hidden;
      earlier.hidden = !open;
      earlierBtn.setAttribute('aria-expanded', String(open));
      earlierBtn.textContent = open ? 'Show fewer projects' : 'Show all projects';
    });
  }

  // ---- Contact form (Web3Forms) ----
  var form = document.getElementById('contactForm');
  var status = document.getElementById('form-status');
  function setError(input, msg) { var box = input.parentElement.querySelector('.error-message'); if (box) box.textContent = msg; }
  if (form && status) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      form.querySelectorAll('.error-message').forEach(function (d) { d.textContent = ''; });
      status.textContent = ''; status.classList.remove('error');
      var email = form.querySelector('input[name="email"]');
      var message = form.querySelector('textarea[name="message"]');
      var ok = true;
      if (!email.value.trim()) { setError(email, 'Please enter your email.'); ok = false; }
      else if (!/^\S+@\S+\.\S+$/.test(email.value.trim())) { setError(email, 'Please enter a valid email.'); ok = false; }
      if (!message.value.trim()) { setError(message, 'Please enter a message.'); ok = false; }
      if (!ok) return;
      var send = form.querySelector('.send');
      send.disabled = true; send.textContent = 'Sending';
      try {
        var res = await fetch(form.action, { method: 'POST', body: new FormData(form) });
        var data = await res.json();
        if (!data.success) throw new Error(data.message || 'Something went wrong.');
        form.hidden = true;
        status.textContent = 'Sent. Thank you, I will write back soon.';
      } catch (err) {
        send.disabled = false; send.textContent = 'Send';
        status.classList.add('error');
        status.textContent = 'Could not send the message. Please try again in a moment.';
      }
    });
  }
})();
