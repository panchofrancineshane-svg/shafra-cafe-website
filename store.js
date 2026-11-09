/* =========================================================
   Shafra Cafe - store.js
   Shared helpers loaded on EVERY page: accounts, cart, orders
   and reviews, plus the nav bar's cart count and login link.

   DEMO MODE: everything is saved in this browser's localStorage.
   That is fine for learning and for showing the idea, but it is
   NOT secure and is not shared between devices. A live site needs
   a server and a database. When you get there, replace the
   functions in this file with calls to your server (the other
   scripts only talk to `Store`, so they will not need to change).
   ========================================================= */

const Store = (function () {
  const KEYS = {
    users:   'cafe_users',
    session: 'cafe_session',
    cart:    'cafe_cart',
    orders:  'cafe_orders',
    reviews: 'cafe_reviews'
  };

  /* ---------- tiny helpers ---------- */
  function read(key, fallback) {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      return (value === null || value === undefined) ? fallback : value;
    } catch (e) {
      return fallback;
    }
  }

  function write(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      return false;
    }
  }

  function uid(prefix) {
    return prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  }

  function peso(amount) {
    return '₱' + Number(amount).toLocaleString('en-PH');
  }

  // Never put customer text into innerHTML. Use textContent, which is
  // always treated as plain text (the DOM lesson about innerHTML vs innerText).
  function toast(message, ms) {
    const old = document.querySelector('.toast');
    if (old) old.remove();

    const box = document.createElement('div');
    box.className = 'toast';
    box.setAttribute('role', 'status');
    box.textContent = message;
    document.body.appendChild(box);

    setTimeout(function () { box.remove(); }, ms || 2400);
  }

  /* ---------- accounts ---------- */
  async function hashPassword(password, salt) {
    const data = new TextEncoder().encode(salt + ':' + password);
    if (window.crypto && window.crypto.subtle) {
      const buffer = await window.crypto.subtle.digest('SHA-256', data);
      return Array.from(new Uint8Array(buffer))
        .map(function (b) { return b.toString(16).padStart(2, '0'); })
        .join('');
    }
    return btoa(salt + ':' + password);   // fallback for very old browsers (demo only)
  }

  function currentUser() {
    const email = read(KEYS.session, null);
    if (!email) return null;
    const user = read(KEYS.users, []).find(function (u) { return u.email === email; });
    return user ? { name: user.name, email: user.email } : null;
  }

  async function signup(name, email, password) {
    name  = String(name).trim();
    email = String(email).trim().toLowerCase();

    if (name.length < 2)                  return { ok: false, error: 'Please enter your name.' };
    if (!/^\S+@\S+\.\S+$/.test(email))    return { ok: false, error: 'Please enter a valid email address.' };
    if (String(password).length < 6)      return { ok: false, error: 'Your password needs at least 6 characters.' };

    const users = read(KEYS.users, []);
    if (users.some(function (u) { return u.email === email; })) {
      return { ok: false, error: 'An account with this email already exists. Try logging in.' };
    }

    const salt = uid('s');
    users.push({
      name: name,
      email: email,
      salt: salt,
      hash: await hashPassword(password, salt),
      createdAt: new Date().toISOString()
    });
    write(KEYS.users, users);
    write(KEYS.session, email);
    return { ok: true };
  }

  async function login(email, password) {
    email = String(email).trim().toLowerCase();
    const user = read(KEYS.users, []).find(function (u) { return u.email === email; });
    const generic = { ok: false, error: 'Incorrect email or password.' };

    if (!user) return generic;
    if (await hashPassword(password, user.salt) !== user.hash) return generic;

    write(KEYS.session, email);
    return { ok: true };
  }

  function logout() {
    try { localStorage.removeItem(KEYS.session); } catch (e) { /* ignore */ }
  }

  /* ---------- cart ---------- */
  function getCart() { return read(KEYS.cart, []); }

  function lineKey(line) {
    const addons = (line.addons || []).map(function (a) { return a.name; }).sort().join('+');
    return [line.id, line.size || '', addons, line.note || ''].join('|');
  }

  function addToCart(line) {
    const cart = getCart();
    line.key = lineKey(line);

    const existing = cart.find(function (l) { return l.key === line.key; });
    if (existing) {
      existing.qty = Math.min(99, existing.qty + line.qty);
    } else {
      cart.push(line);
    }
    write(KEYS.cart, cart);
    updateNav();
  }

  function setQty(key, qty) {
    let cart = getCart();
    if (qty <= 0) {
      cart = cart.filter(function (l) { return l.key !== key; });
    } else {
      cart.forEach(function (l) { if (l.key === key) l.qty = Math.min(99, qty); });
    }
    write(KEYS.cart, cart);
    updateNav();
  }

  function clearCart() { write(KEYS.cart, []); updateNav(); }

  // Run a function when the orders change. A change made by the staff in another tab
  // fires the browser's "storage" event right away; a short check every 3 seconds is a
  // backup, so the page also updates if that event does not arrive.
  function onOrdersChanged(callback) {
    let last = localStorage.getItem(KEYS.orders);
    function check() {
      const now = localStorage.getItem(KEYS.orders);
      if (now !== last) { last = now; callback(); }
    }
    window.addEventListener('storage', function (event) {
      if (event.key === KEYS.orders || event.key === null) check();
    });
    setInterval(check, 3000);
  }

  function getOrder(orderId) {
    return allOrders().find(function (o) { return o.id === orderId; }) || null;
  }

  // Tell the customer, on any page, when the staff move one of their orders along
  const STATUS_MESSAGES = {
    Preparing: 'is being prepared',
    Ready: 'is ready for pick-up!',
    Received: 'is complete. Your beans were added.',
    Cancelled: 'was cancelled'
  };
  function watchMyOrders() {
    function snapshot() {
      const user = currentUser();
      const map = {};
      if (user) ordersFor(user.email).forEach(function (o) { map[o.id] = o.status; });
      return map;
    }
    let before = snapshot();
    onOrdersChanged(function () {
      const after = snapshot();
      Object.keys(after).forEach(function (id) {
        if (before[id] && before[id] !== after[id] && STATUS_MESSAGES[after[id]]) {
          toast('Order ' + id + ' ' + STATUS_MESSAGES[after[id]], 6000);
        }
      });
      before = after;
      updateNav();
    });
  }

  function cartCount() {
    return getCart().reduce(function (sum, l) { return sum + l.qty; }, 0);
  }

  function cartTotal() {
    return getCart().reduce(function (sum, l) { return sum + l.unitPrice * l.qty; }, 0);
  }

  /* ---------- orders ---------- */
  function allOrders() { return read(KEYS.orders, []); }

  function ordersFor(email) {
    return allOrders()
      .filter(function (o) { return o.email === email; })
      .sort(function (a, b) { return b.createdAt.localeCompare(a.createdAt); });
  }

  function placeOrder(option) {
    const user = currentUser();
    const cart = getCart();
    if (!user || cart.length === 0) return null;

    const orders = allOrders();
    const order = {
      id: 'SF-' + (1001 + orders.length),
      type: 'purchase',
      email: user.email,
      items: cart,
      total: cartTotal(),
      beans: cart.reduce(function (sum, l) { return sum + (l.beans || 0) * l.qty; }, 0),
      option: option,
      status: 'Preparing',
      createdAt: new Date().toISOString(),
      history: [{ status: 'Preparing', at: new Date().toISOString() }]
    };
    orders.push(order);
    write(KEYS.orders, orders);
    clearCart();
    return order;
  }

  // Staff confirm "Received" on the employee side (EMPLOYEE/orders.html), which is when
  // the beans are earned. Customers cannot give themselves beans.

  // Customers can cancel while an order is still being prepared.
  function cancelOrder(orderId) {
    const user = currentUser();
    const orders = allOrders();
    const order = orders.find(function (o) { return o.id === orderId && user && o.email === user.email; });
    if (!order || order.status !== 'Preparing') return false;

    order.status = 'Cancelled';
    order.cancelledAt = new Date().toISOString();
    order.history = (order.history || []).concat([{ status: 'Cancelled', at: order.cancelledAt }]);
    write(KEYS.orders, orders);
    return true;
  }

  /* ---------- beans ---------- */
  const STREAK_GOAL = 5;

  // Beans and the streak are worked out from the orders every time, so they can never
  // get out of step with the order list.
  //  - earned:  beans from purchases that were Received
  //  - spent:   beans on rewards that were not cancelled
  //  - streak:  successful (Received) purchases in a row; a Cancelled purchase resets it
  //  - unlocked: the streak reached the goal at some point (stays unlocked afterwards)
  function beansInfo(email) {
    const mine = allOrders().filter(function (o) { return o.email === email; });

    let earned = 0;
    let spent = 0;
    mine.forEach(function (o) {
      if (o.type === 'reward') {
        if (o.status !== 'Cancelled') spent += o.beansSpent || 0;
      } else if (o.status === 'Received') {
        earned += o.beans || 0;
      }
    });

    const finished = mine
      .filter(function (o) { return o.type !== 'reward' && (o.status === 'Received' || o.status === 'Cancelled'); })
      .sort(function (a, b) { return a.createdAt.localeCompare(b.createdAt); });

    let streak = 0;
    let best = 0;
    finished.forEach(function (o) {
      if (o.status === 'Received') {
        streak++;
        best = Math.max(best, streak);
      } else {
        streak = 0;
      }
    });

    return {
      earned: earned,
      spent: spent,
      balance: earned - spent,
      streak: streak,
      bestStreak: best,
      goal: STREAK_GOAL,
      unlocked: best >= STREAK_GOAL,
      ordersToUnlock: Math.max(0, STREAK_GOAL - streak)
    };
  }

  // Spend beans on a secret-menu item. The rules live here, not in the page.
  function redeem(rewardId, choice) {
    choice = choice || {};
    const user = currentUser();
    if (!user) return { ok: false, error: 'Please log in first.' };

    const info = beansInfo(user.email);
    if (!info.unlocked) return { ok: false, error: 'The secret menu is not unlocked yet.' };

    const catalog = (typeof SECRET_ITEMS !== 'undefined') ? SECRET_ITEMS : [];
    const reward = catalog.find(function (r) { return r.id === rewardId; });
    if (!reward) return { ok: false, error: 'We could not find that reward.' };
    if (info.balance < reward.cost) {
      return { ok: false, error: 'You need ' + (reward.cost - info.balance) + ' more beans for this.' };
    }

    const orders = allOrders();
    const order = {
      id: 'SF-' + (1001 + orders.length),
      type: 'reward',
      email: user.email,
      items: [{ id: reward.id, name: reward.name, image: reward.image, size: String(choice.size || ''), addons: [], note: String(choice.note || '').slice(0, 140), unitPrice: 0, beans: 0, qty: 1 }],
      total: 0,
      beansSpent: reward.cost,
      option: 'Pick up',
      status: 'Preparing',
      history: [{ status: 'Preparing', at: new Date().toISOString() }],
      createdAt: new Date().toISOString()
    };
    orders.push(order);
    write(KEYS.orders, orders);
    return { ok: true, order: order };
  }

  /* ---------- reviews ---------- */
  function allReviews() {
    return read(KEYS.reviews, []).sort(function (a, b) { return b.createdAt.localeCompare(a.createdAt); });
  }

  function reviewForOrder(orderId) {
    return read(KEYS.reviews, []).find(function (r) { return r.orderId === orderId; }) || null;
  }

  // The rules live here, so no page can skip them:
  // you must be logged in, the order must be yours, and it must be received.
  function addReview(orderId, rating, text) {
    const user = currentUser();
    if (!user) return { ok: false, error: 'Please log in to leave a review.' };

    const order = allOrders().find(function (o) { return o.id === orderId && o.email === user.email; });
    if (!order)                       return { ok: false, error: 'We could not find that order.' };
    if (order.type === 'reward')      return { ok: false, error: 'Bean rewards cannot be reviewed.' };
    if (order.status !== 'Received')  return { ok: false, error: 'You can review an order after you have received it.' };
    if (reviewForOrder(orderId))      return { ok: false, error: 'You already reviewed this order.' };

    rating = Math.round(Number(rating));
    if (!(rating >= 1 && rating <= 5)) return { ok: false, error: 'Please tap a star rating from 1 to 5.' };

    const reviews = read(KEYS.reviews, []);
    reviews.push({
      id: uid('r'),
      orderId: orderId,
      email: user.email,
      name: user.name,
      rating: rating,
      text: String(text || '').trim().slice(0, 500),
      createdAt: new Date().toISOString()
    });
    write(KEYS.reviews, reviews);
    return { ok: true };
  }

  /* ---------- nav bar: cart count + login link ---------- */
  function updateNav() {
    const count = cartCount();
    const badge = document.getElementById('cartCount');
    if (badge) {
      badge.textContent = count;
      badge.hidden = count === 0;
    }

    const user = currentUser();

    const link = document.getElementById('accountLink');
    if (link) link.textContent = user ? 'Hi, ' + user.name.split(' ')[0] : 'Log in';

    const beansBadge = document.getElementById('beansCount');
    if (beansBadge) {
      const balance = user ? beansInfo(user.email).balance : 0;
      beansBadge.textContent = balance;
      beansBadge.hidden = balance <= 0;
    }
  }

  updateNav();
  watchMyOrders();

  return {
    peso: peso, toast: toast, updateNav: updateNav,
    currentUser: currentUser, signup: signup, login: login, logout: logout,
    getCart: getCart, addToCart: addToCart, setQty: setQty, clearCart: clearCart,
    cartCount: cartCount, cartTotal: cartTotal,
    ordersFor: ordersFor, getOrder: getOrder, onOrdersChanged: onOrdersChanged, placeOrder: placeOrder, cancelOrder: cancelOrder,
    beansInfo: beansInfo, redeem: redeem,
    allReviews: allReviews, reviewForOrder: reviewForOrder, addReview: addReview
  };
})();
