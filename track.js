/* =========================================================
   Shafra Cafe - track.js  (track page only)
   Live order tracking. The cafe staff change an order's status
   on the employee side; this page shows each step as it happens.
   It listens for the change (see Store.onOrdersChanged), so the
   customer never has to refresh.
   ========================================================= */

(function () {
  const view = document.getElementById('trackView');
  if (!view) return;

  const $ = function (id) { return document.getElementById(id); };

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  // The steps a normal order goes through
  const STEPS = [
    { key: 'Placed',    label: 'Order placed',      hint: 'We got your order.' },
    { key: 'Preparing', label: 'Being prepared',    hint: 'Our baristas are making it.' },
    { key: 'Ready',     label: 'Ready for pick-up', hint: 'Show your order number at the counter.' },
    { key: 'Received',  label: 'Received',          hint: 'Enjoy! Your beans were added.' }
  ];

  // How far along each status is (index of the current step)
  const POSITION = { Preparing: 1, Ready: 2, Received: 3, Cancelled: -1 };

  const MESSAGES = {
    Preparing: 'Your order is being prepared.',
    Ready: 'Your order is ready for pick-up! Show your order number at the counter.',
    Received: 'Your order is complete. Thank you!',
    Cancelled: 'This order was cancelled.'
  };

  let selectedId = new URLSearchParams(location.search).get('order');

  function timeText(iso) {
    if (!iso) return '';
    return new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  }

  // When did the order reach a given status? (older orders may have no history)
  function timeFor(order, key) {
    if (key === 'Placed') return order.createdAt;
    const entry = (order.history || []).filter(function (h) { return h.status === key; })[0];
    if (entry) return entry.at;
    if (key === 'Received') return order.receivedAt || '';
    if (key === 'Preparing') return order.createdAt;
    return '';
  }

  function drawStepper(order) {
    const list = $('stepper');
    list.textContent = '';
    const position = POSITION[order.status];
    list.classList.toggle('cancelled', position < 0);

    STEPS.forEach(function (step, i) {
      const item = el('li');
      let state = 'todo';
      if (position >= 0) {
        if (i < position || position === 3) state = 'done';
        else if (i === position) state = 'current';
      }
      item.className = 'step-item ' + state;

      item.appendChild(el('span', 'step-dot', state === 'done' ? '✓' : String(i + 1)));
      const text = el('div', 'step-text');
      text.appendChild(el('strong', '', step.label));
      text.appendChild(el('span', 'step-hint', step.hint));
      const when = state === 'todo' ? '' : timeText(timeFor(order, step.key));
      if (when) text.appendChild(el('span', 'step-time', when));
      item.appendChild(text);
      list.appendChild(item);
    });
  }

  function drawOrder(order) {
    const isReward = order.type === 'reward';
    $('trackId').textContent = 'Order ' + order.id;
    $('trackMeta').textContent = order.option + ' · ' +
      new Date(order.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) + ' · ' +
      (isReward ? order.beansSpent + ' beans' : Store.peso(order.total));

    const message = $('trackMessage');
    message.textContent = MESSAGES[order.status] || '';
    message.className = 'track-message ' + order.status.toLowerCase();

    drawStepper(order);

    const list = $('trackItems');
    list.textContent = '';
    order.items.forEach(function (line) {
      const parts = [line.qty + ' × ' + line.name];
      if (line.size) parts.push(line.size);
      list.appendChild(el('li', '', parts.join(' · ')));
    });

    let beans = '';
    if (isReward) beans = order.status === 'Cancelled' ? order.beansSpent + ' beans refunded.' : order.beansSpent + ' beans spent on this reward.';
    else if (order.status === 'Received') beans = '+' + (order.beans || 0) + ' beans earned.';
    else if (order.status !== 'Cancelled') beans = 'You will earn +' + (order.beans || 0) + ' beans when the cafe confirms your order.';
    $('trackBeans').textContent = beans;

    $('trackUpdated').textContent = 'Last checked ' +
      new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', second: '2-digit' });
  }

  function render() {
    const user = Store.currentUser();
    $('trackLoggedOut').hidden = !!user;
    if (!user) { view.hidden = true; $('trackNone').hidden = true; return; }

    const orders = Store.ordersFor(user.email);
    $('trackNone').hidden = orders.length > 0;
    view.hidden = orders.length === 0;
    if (orders.length === 0) return;

    // Default to the newest order that is still open
    if (!selectedId || !orders.some(function (o) { return o.id === selectedId; })) {
      const open = orders.filter(function (o) { return o.status === 'Preparing' || o.status === 'Ready'; })[0];
      selectedId = (open || orders[0]).id;
    }

    const pick = $('trackPick');
    pick.textContent = '';
    orders.forEach(function (o) {
      const option = el('option', '', o.id + ' · ' + (o.status === 'Received' ? 'Completed' : o.status === 'Ready' ? 'Ready for pick-up' : o.status));
      option.value = o.id;
      if (o.id === selectedId) option.selected = true;
      pick.appendChild(option);
    });

    drawOrder(orders.filter(function (o) { return o.id === selectedId; })[0]);
  }

  $('trackPick').addEventListener('change', function () {
    selectedId = $('trackPick').value;
    render();
  });

  render();
  Store.onOrdersChanged(function () {
    render();
    const dot = $('liveDot');
    dot.classList.remove('pulse');
    void dot.offsetWidth;          // restart the little animation
    dot.classList.add('pulse');
  });
})();
