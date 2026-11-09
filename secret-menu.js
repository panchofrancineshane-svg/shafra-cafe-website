/* =========================================================
   Shafra Cafe - secret-menu.js  (menu page only)
   After 5 successful orders in a row, the hidden menu appears
   with a congratulations message. It is laid out exactly like
   the regular menu: tap an item to see its details, then redeem
   it with beans. Items can only be bought with beans.
   Item details come from SECRET_ITEMS in menu-data.js; the pop-up
   itself lives in item-modal.js (window.openRewardDialog).
   ========================================================= */

(function () {
  const box = document.getElementById('secret');
  if (!box || typeof SECRET_ITEMS === 'undefined') return;

  const user = Store.currentUser();
  if (!user) return;                                  // not logged in: stays hidden
  if (!Store.beansInfo(user.email).unlocked) return;  // streak not reached: stays hidden

  const $ = function (id) { return document.getElementById(id); };

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function beanIcon() {
    const icon = el('span', 'bean-icon');
    icon.setAttribute('aria-hidden', 'true');
    return icon;
  }

  // One row, built like a regular .menu-item
  function buildRow(item, balance) {
    const row = el('div', 'menu-item secret-item');
    row.dataset.id = item.id;
    row.tabIndex = 0;
    row.setAttribute('role', 'button');
    row.setAttribute('aria-label', 'View details for ' + item.name);

    const top = el('div', 'row');
    top.appendChild(el('h3', '', item.name));
    top.appendChild(el('span', 'dots'));
    const price = el('span', 'price');
    price.append(beanIcon(), item.cost + ' beans');
    top.appendChild(price);
    row.appendChild(top);

    row.appendChild(el('p', '', item.desc));

    const foot = el('div', 'item-foot');
    foot.appendChild(el('span', 'view-hint', 'Tap for details & redeem'));
    foot.appendChild(el('span', 'beans-badge',
      balance >= item.cost ? 'You can redeem this' : 'Need ' + (item.cost - balance) + ' more beans'));
    row.appendChild(foot);

    function openIt() { window.openRewardDialog(item.id); }
    row.addEventListener('click', openIt);
    row.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openIt();
      }
    });
    return row;
  }

  function render() {
    const info = Store.beansInfo(user.email);
    const firstName = user.name.split(' ')[0];

    box.hidden = false;
    $('secretTab').hidden = false;

    $('secretTitle').textContent = 'Congratulations, ' + firstName + '!';
    $('secretMessage').textContent =
      'You ordered ' + info.goal + ' times in a row, so you unlocked our secret menu. ' +
      'These treats are not on the regular menu and can only be bought with beans.';
    $('secretBalance').textContent = info.balance;

    const list = $('secretGrid');
    list.textContent = '';
    SECRET_ITEMS.forEach(function (item) { list.appendChild(buildRow(item, info.balance)); });
  }

  render();

  // After a redeem, refresh the balance and which items you can afford
  document.addEventListener('beans:changed', render);

  // menu.html#secret jumps straight to it
  if (location.hash === '#secret') box.scrollIntoView();
})();
