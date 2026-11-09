/* =========================================================
   Shafra Cafe - beans.js  (beans page only)
   Shows the customer's bean balance, order streak, secret
   menu status and a history of beans earned and spent.
   ========================================================= */

(function () {
  const member = document.getElementById('beansMember');
  const loggedOut = document.getElementById('beansLoggedOut');
  if (!member) return;

  const $ = function (id) { return document.getElementById(id); };

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function formatDate(iso) {
    return new Date(iso).toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  function historyRow(sign, amount, text, date) {
    const li = el('li');
    const left = el('span', '', text + ' · ' + formatDate(date));
    const right = el('span', 'hist-amount ' + (sign === '+' ? 'plus' : sign === '−' ? 'minus' : ''),
      amount === null ? '—' : sign + amount + ' beans');
    li.append(left, right);
    return li;
  }

  const user = Store.currentUser();
  loggedOut.hidden = !!user;
  member.hidden = !user;
  Store.updateNav();
  if (!user) return;

  const info = Store.beansInfo(user.email);

  /* ---------- balance ---------- */
  $('beanBalance').textContent = info.balance;
  $('beanEarned').textContent = info.earned;
  $('beanSpent').textContent = info.spent;

  /* ---------- streak ---------- */
  $('streakCount').textContent = Math.min(info.streak, info.goal);
  const dots = $('streakDots');
  dots.textContent = '';
  for (let i = 0; i < info.goal; i++) {
    dots.appendChild(el('span', i < info.streak ? 'filled' : ''));
  }
  $('streakText').textContent = info.unlocked
    ? 'You reached ' + info.goal + ' in a row. Keep ordering to keep your streak going.'
    : info.ordersToUnlock + ' more order' + (info.ordersToUnlock === 1 ? '' : 's') +
      ' in a row to unlock the secret menu.';

  /* ---------- secret menu status ---------- */
  $('secretState').textContent = info.unlocked ? 'Unlocked' : 'Locked';
  $('secretText').textContent = info.unlocked
    ? 'Spend your beans on treats that are not on the regular menu.'
    : 'Complete ' + info.goal + ' successful orders in a row to reveal it.';
  $('secretLink').hidden = !info.unlocked;

  /* ---------- history ---------- */
  const list = $('beanHistory');
  list.textContent = '';
  const orders = Store.ordersFor(user.email);

  orders.forEach(function (order) {
    if (order.type === 'reward') {
      const name = order.items[0] ? order.items[0].name : 'Reward';
      if (order.status === 'Cancelled') {
        list.appendChild(historyRow('+', order.beansSpent, 'Refund: ' + name + ' cancelled', order.createdAt));
      } else {
        list.appendChild(historyRow('−', order.beansSpent, 'Redeemed ' + name, order.createdAt));
      }
    } else if (order.status === 'Received') {
      list.appendChild(historyRow('+', order.beans || 0, 'Order ' + order.id + ' received', order.createdAt));
    } else if (order.status === 'Preparing') {
      list.appendChild(historyRow('', null, 'Order ' + order.id + ' pending (+' + (order.beans || 0) + ' beans once received)', order.createdAt));
    } else {
      list.appendChild(historyRow('', null, 'Order ' + order.id + ' cancelled, streak reset', order.createdAt));
    }
  });

  if (orders.length === 0) {
    list.appendChild(el('li', '', 'No bean activity yet. Place your first order to start collecting!'));
  }
})();
