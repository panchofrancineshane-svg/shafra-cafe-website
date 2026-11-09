/* =========================================================
   Shafra Cafe - cart.js  (cart page only)
   Shows the cart, lets the customer change quantities, and
   places the order (login required).
   Payment is not handled here: customers pay at the counter.
   ========================================================= */

(function () {
  const itemsBox = document.getElementById('cartItems');
  if (!itemsBox) return;

  const $ = function (id) { return document.getElementById(id); };

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function metaText(line) {
    const parts = [];
    if (line.size) parts.push(line.size);
    line.addons.forEach(function (a) { parts.push('+ ' + a.name); });
    if (line.note) parts.push('Note: "' + line.note + '"');
    return parts.join(' · ');
  }

  function buildLine(line) {
    const row = el('div', 'cart-line');

    const img = el('img');
    // Use the picture from the item list, so older saved carts also show the right photo
    const known = (typeof MENU_ITEMS !== 'undefined')
      ? MENU_ITEMS.find(function (m) { return m.id === line.id; }) : null;
    img.src = known ? known.image : line.image;
    img.alt = line.name;

    const info = el('div');
    info.appendChild(el('h3', '', line.name));
    const meta = metaText(line);
    if (meta) info.appendChild(el('p', 'meta', meta));

    const qtyBox = el('div', 'qty');
    const minus = el('button', '', '−');
    minus.type = 'button';
    minus.setAttribute('aria-label', 'Decrease quantity');
    minus.addEventListener('click', function () { Store.setQty(line.key, line.qty - 1); render(); });

    const plus = el('button', '', '+');
    plus.type = 'button';
    plus.setAttribute('aria-label', 'Increase quantity');
    plus.addEventListener('click', function () { Store.setQty(line.key, line.qty + 1); render(); });

    qtyBox.append(minus, el('span', '', String(line.qty)), plus);
    info.appendChild(qtyBox);

    const right = el('div', 'line-total');
    right.appendChild(el('strong', 'price', Store.peso(line.unitPrice * line.qty)));
    const remove = el('button', 'link-btn', 'Remove');
    remove.type = 'button';
    remove.addEventListener('click', function () { Store.setQty(line.key, 0); render(); });
    right.appendChild(remove);

    row.append(img, info, right);
    return row;
  }

  function render() {
    const lines = Store.getCart();

    $('cartEmpty').hidden = lines.length > 0;
    $('cartFull').hidden  = lines.length === 0;

    itemsBox.textContent = '';
    lines.forEach(function (line) { itemsBox.appendChild(buildLine(line)); });

    $('subtotal').textContent = Store.peso(Store.cartTotal());
    $('total').textContent    = Store.peso(Store.cartTotal());
    $('cartBeans').textContent = '+' + lines.reduce(function (sum, l) { return sum + (l.beans || 0) * l.qty; }, 0);
    $('loginHint').hidden     = !!Store.currentUser();
    Store.updateNav();
  }

  $('placeOrder').addEventListener('click', function () {
    const message = $('cartMessage');

    if (!Store.currentUser()) {
      // Send them to log in, then bring them straight back here
      location.href = 'account.html?next=cart.html';
      return;
    }

    const order = Store.placeOrder($('orderOption').value);
    if (!order) {
      message.textContent = 'Your cart is empty.';
      message.hidden = false;
      return;
    }

    $('cartFull').hidden = true;
    $('cartEmpty').hidden = true;
    $('orderDone').hidden = false;
    $('doneText').textContent =
      'Thank you! Order ' + order.id + ' (' + order.option + ', ' + Store.peso(order.total) +
      ') is being prepared. Follow it live on the tracking page. Once the cafe confirms it was received you get +' + order.beans + ' beans and can leave a review.';
    document.getElementById('trackLink').href = 'track.html?order=' + encodeURIComponent(order.id);
    Store.updateNav();
  });

  render();
})();
