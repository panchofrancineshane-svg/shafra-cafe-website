/* =========================================================
   Shafra Cafe - script.js
   One file for every page. Each feature first checks that its
   element exists on the current page, so nothing breaks elsewhere.
   ========================================================= */

/* ---------- 1. Menu: category buttons + search ---------- */
const menuItems  = document.querySelectorAll('.menu-item');
const menuSearch = document.getElementById('menuSearch');
const tabButtons = document.querySelectorAll('.category-tabs button');

if (menuItems.length > 0) {
  let activeFilter = 'all';

  function applyMenuFilters() {
    const term = menuSearch ? menuSearch.value.toLowerCase().trim() : '';

    menuItems.forEach(function (item) {
      const inCategory = activeFilter === 'all' || item.dataset.category === activeFilter;
      // Search only the item's name and description (not the "Tap for details" hint)
      const searchable = item.querySelector('h3').textContent + ' ' + item.querySelector('p').textContent;
      const inSearch   = searchable.toLowerCase().includes(term);
      item.style.display = (inCategory && inSearch) ? '' : 'none';
    });

    // Hide a whole category heading when none of its items are visible
    let anyVisible = false;
    document.querySelectorAll('.menu-category').forEach(function (category) {
      const visible = category.querySelectorAll('.menu-item:not([style*="display: none"])').length;
      category.style.display = visible > 0 ? '' : 'none';
      if (visible > 0) anyVisible = true;
    });

    const message = document.getElementById('noResults');
    if (message) message.hidden = anyVisible;
  }

  tabButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      tabButtons.forEach(function (b) { b.classList.remove('active'); });
      button.classList.add('active');
      activeFilter = button.dataset.filter;
      applyMenuFilters();
    });
  });

  if (menuSearch) menuSearch.addEventListener('input', applyMenuFilters);
}

/* ---------- 2. Offers: countdown timer ---------- */
const countdown = document.getElementById('countdown');

if (countdown) {
  // Change this date to when your offer ends
  const endDate = new Date('2026-11-30T23:59:59');

  function updateCountdown() {
    const diff = endDate - new Date();            // milliseconds left

    if (diff <= 0) {
      countdown.textContent = 'This offer has ended';
      clearInterval(timer);
      return;
    }

    const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours   = Math.floor(diff / (1000 * 60 * 60)) % 24;
    const minutes = Math.floor(diff / (1000 * 60)) % 60;
    const seconds = Math.floor(diff / 1000) % 60;

    document.getElementById('days').textContent    = String(days).padStart(2, '0');
    document.getElementById('hours').textContent   = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
  }

  const timer = setInterval(updateCountdown, 1000);
  updateCountdown();
}

/* ---------- 3. Contact: highlight today's opening hours ---------- */
const hoursRows = document.querySelectorAll('.hours tr[data-day]');

hoursRows.forEach(function (row) {
  // getDay(): 0 = Sunday ... 6 = Saturday
  if (Number(row.dataset.day) === new Date().getDay()) {
    row.classList.add('today');
  }
});

/* ---------- 4. Forms: simple validation + thank-you message ---------- */
document.querySelectorAll('form[data-message]').forEach(function (form) {
  form.addEventListener('submit', function (event) {
    event.preventDefault();                       // stop the page from reloading

    const message = form.querySelector('.form-message');
    const email   = form.querySelector('input[type="email"]');

    if (email && !email.value.includes('@')) {
      message.textContent = 'Please enter a valid email address.';
      message.classList.add('error');
      message.hidden = false;
      return;
    }

    message.textContent = form.dataset.message;
    message.classList.remove('error');
    message.hidden = false;
    form.reset();
  });
});

// Don't allow reservations in the past
const reserveDate = document.getElementById('reserveDate');
if (reserveDate) {
  reserveDate.min = new Date().toISOString().split('T')[0];
}

/* ---------- 5. Gallery: click a photo to enlarge it ---------- */
document.querySelectorAll('.gallery img').forEach(function (img) {
  img.addEventListener('click', function () {
    const overlay = document.createElement('div');
    overlay.className = 'lightbox';

    const big = document.createElement('img');
    big.src = img.src;
    big.alt = img.alt;

    overlay.appendChild(big);
    overlay.addEventListener('click', function () { overlay.remove(); });
    document.body.appendChild(overlay);
  });
});

document.addEventListener('keydown', function (event) {
  if (event.key === 'Escape') {
    const open = document.querySelector('.lightbox');
    if (open) open.remove();
  }
});
