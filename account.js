/* =========================================================
   Shafra Cafe - account.js  (account page only)
   Sign up, log in, order history, order status (confirmed by staff),
   cancel, beans summary, and the star-rating review form
   for received orders.
   ========================================================= */

(function () {
  const authView = document.getElementById('authView');
  const memberView = document.getElementById('memberView');
  if (!authView) return;

  const $ = function (id) { return document.getElementById(id); };

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function showMessage(box, text, isError) {
    box.textContent = text;
    box.classList.toggle('error', !!isError);
    box.hidden = false;
  }

  // Only allow redirects to our own pages like "cart.html"
  const nextParam = new URLSearchParams(location.search).get('next') || '';
  const next = /^[a-z]+\.html$/.test(nextParam) ? nextParam : '';

  /* ---------- log in / sign up tabs ---------- */
  function showTab(which) {
    const isLogin = which === 'login';
    $('loginForm').hidden = !isLogin;
    $('signupForm').hidden = isLogin;
    $('tabLogin').classList.toggle('active', isLogin);
    $('tabSignup').classList.toggle('active', !isLogin);
  }
  $('tabLogin').addEventListener('click',  function () { showTab('login'); });
  $('tabSignup').addEventListener('click', function () { showTab('signup'); });

  function afterAuth() {
    if (next) { location.href = next; return; }
    refresh();
  }

  $('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    const message = $('loginMessage');
    const result = await Store.login($('loginEmail').value, $('loginPassword').value);
    if (!result.ok) { showMessage(message, result.error, true); return; }
    afterAuth();
  });

  $('signupForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    const message = $('signupMessage');

    if ($('signupPassword').value !== $('signupConfirm').value) {
      showMessage(message, 'The two passwords do not match.', true);
      return;
    }
    const result = await Store.signup($('signupName').value, $('signupEmail').value, $('signupPassword').value);
    if (!result.ok) { showMessage(message, result.error, true); return; }
    afterAuth();
  });

  $('logoutBtn').addEventListener('click', function () {
    Store.logout();
    refresh();
  });

  /* ---------- helpers for orders ---------- */
  function formatDate(iso) {
    return new Date(iso).toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  function stars(rating) {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  }

  function itemLine(line) {
    let text = line.qty + ' × ' + line.name;
    const extras = [];
    if (line.size) extras.push(line.size);
    line.addons.forEach(function (a) { extras.push('+ ' + a.name); });
    if (extras.length) text += ' (' + extras.join(', ') + ')';
    return text;
  }

  function beanIcon() {
    const icon = el('span', 'bean-icon');
    icon.setAttribute('aria-hidden', 'true');
    return icon;
  }

  // One line that explains the beans for this order
  function beansNote(order) {
    const isReward = order.type === 'reward';
    let text = '';

    if (isReward) {
      text = order.status === 'Cancelled'
        ? order.beansSpent + ' beans refunded.'
        : order.beansSpent + ' beans spent on this reward.';
    } else if (order.status === 'Preparing' || order.status === 'Ready') {
      text = 'You will earn +' + (order.beans || 0) + ' beans when the staff confirm you received this order.';
    } else if (order.status === 'Received') {
      text = '+' + (order.beans || 0) + ' beans earned.';
    } else {
      text = 'Cancelled: no beans earned, and your order streak was reset.';
    }

    const note = el('p', 'order-beans');
    note.append(beanIcon(), ' ' + text);
    return note;
  }

  /* ---------- review form (purchases only) ---------- */
  function reviewForm(order) {
    const form = el('form', 'review-form');
    form.appendChild(el('h4', '', 'How was your order?'));

    // Stars are radio buttons styled as stars. They are written 5 to 1 on
    // purpose: CSS then fills every star up to the one you tap.
    const rating = el('div', 'star-rating');
    rating.setAttribute('role', 'radiogroup');
    rating.setAttribute('aria-label', 'Rating from 1 to 5 stars');
    for (let r = 5; r >= 1; r--) {
      const input = el('input');
      input.type = 'radio';
      input.name = 'rating';
      input.id = order.id + '-star-' + r;
      input.value = r;

      const label = el('label', '', '★');
      label.htmlFor = input.id;
      label.title = r + (r === 1 ? ' star' : ' stars');

      rating.append(input, label);
    }
    form.appendChild(rating);

    const text = el('textarea');
    text.placeholder = 'Tell us about your drink, your food or the cafe (optional)';
    text.maxLength = 500;
    text.setAttribute('aria-label', 'Your review');
    form.appendChild(text);

    const submit = el('button', 'btn', 'Submit review');
    submit.type = 'submit';
    form.appendChild(submit);

    const message = el('p', 'form-message');
    message.hidden = true;
    form.appendChild(message);

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      const chosen = form.querySelector('input[name="rating"]:checked');
      if (!chosen) { showMessage(message, 'Please tap a star rating first.', true); return; }

      const result = Store.addReview(order.id, Number(chosen.value), text.value);
      if (!result.ok) { showMessage(message, result.error, true); return; }

      Store.toast('Thank you for your review!');
      refresh();
    });

    return form;
  }

  function reviewBox(order) {
    const box = el('div', 'review-box');
    const review = Store.reviewForOrder(order.id);

    if (review) {
      box.appendChild(el('p', 'stars', stars(review.rating)));
      if (review.text) box.appendChild(el('p', '', '“' + review.text + '”'));
      box.appendChild(el('p', 'small-note', 'Thanks for your review! It appears on our home page.'));
    } else {
      box.appendChild(reviewForm(order));
    }
    return box;
  }

  /* ---------- one order card ---------- */
  function orderCard(order) {
    const isReward = order.type === 'reward';
    const card = el('article', 'order-card');

    const head = el('div', 'order-head');
    head.appendChild(el('h3', '', 'Order ' + order.id + (isReward ? ' · Bean reward' : '')));
    head.appendChild(el('span', 'status ' + order.status.toLowerCase(), order.status));
    card.appendChild(head);

    card.appendChild(el('p', 'small-note',
      formatDate(order.createdAt) + ' · ' + order.option + ' · ' +
      (isReward ? order.beansSpent + ' beans' : Store.peso(order.total))));

    const list = el('ul', 'order-items');
    order.items.forEach(function (line) { list.appendChild(el('li', '', itemLine(line))); });
    card.appendChild(list);

    card.appendChild(beansNote(order));

    if (order.status === 'Preparing') {
      const actions = el('div', 'order-actions');

      const cancel = el('button', 'link-btn', 'Cancel order');
      cancel.type = 'button';
      cancel.addEventListener('click', function () {
        const question = isReward
          ? 'Cancel this reward? Your beans will be refunded.'
          : 'Cancel this order? You will not earn beans, and your order streak will reset to 0.';
        if (window.confirm(question)) {
          Store.cancelOrder(order.id);
          refresh();
        }
      });

      const track = el('a', 'btn btn-outline', 'Track order');
      track.href = 'track.html?order=' + encodeURIComponent(order.id);
      actions.append(track, cancel);
      card.appendChild(actions);
      card.appendChild(el('p', 'small-note', 'The cafe is preparing your order. You can still cancel it now.'));
    } else if (order.status === 'Ready') {
      const readyActions = el('div', 'order-actions');
      const readyTrack = el('a', 'btn btn-outline', 'Track order');
      readyTrack.href = 'track.html?order=' + encodeURIComponent(order.id);
      readyActions.appendChild(readyTrack);
      card.appendChild(readyActions);
      card.appendChild(el('p', 'small-note', isReward
        ? 'Your reward is ready. Show this order at the counter.'
        : 'Your order is ready for pick-up. Show your order number at the counter. Once the staff confirm it, your beans are added and you can rate it.'));
    } else if (order.status === 'Received') {
      if (isReward) card.appendChild(el('p', 'small-note', 'Enjoy your reward!'));
      else card.appendChild(reviewBox(order));
    }
    return card;
  }

  /* ---------- show the right view ---------- */
  function refresh() {
    const user = Store.currentUser();
    authView.hidden = !!user;
    memberView.hidden = !user;

    if (user) {
      $('memberName').textContent = user.name;

      // Beans summary + secret menu banner
      const info = Store.beansInfo(user.email);
      const summary = $('beanSummary');
      summary.textContent = '';
      const link = el('a', '', 'How beans work');
      link.href = 'beans.html';
      summary.append(
        beanIcon(),
        el('strong', '', info.balance + ' beans'),
        el('span', '', ' · Order streak ' + Math.min(info.streak, info.goal) + ' of ' + info.goal + ' · '),
        link
      );

      const banner = $('unlockBanner');
      banner.hidden = !info.unlocked;
      if (info.unlocked) {
        banner.textContent = '';
        const open = el('a', '', 'Open it on the Menu page');
        open.href = 'menu.html#secret';
        banner.append('🎉 Your secret menu is unlocked. ', open);
      }

      // Orders
      const box = $('orders');
      box.textContent = '';

      const orders = Store.ordersFor(user.email);
      if (orders.length === 0) {
        const empty = el('div', 'empty-state');
        empty.appendChild(el('p', '', 'You have no orders yet.'));
        const browse = el('a', 'btn', 'Browse the menu');
        browse.href = 'menu.html';
        empty.appendChild(browse);
        box.appendChild(empty);
      } else {
        orders.forEach(function (order) { box.appendChild(orderCard(order)); });
      }
    }
    Store.updateNav();
  }

  refresh();

  // When the staff update an order (in another tab), show the change without reloading
  Store.onOrdersChanged(refresh);
})();
