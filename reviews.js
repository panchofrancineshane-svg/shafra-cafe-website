/* =========================================================
   Shafra Cafe - reviews.js  (home page only)
   Shows the newest customer reviews first. Only people who
   received an order can leave one (see Store.addReview).
   ========================================================= */

(function () {
  const box = document.getElementById('reviewCards');
  if (!box) return;

  const reviews = Store.allReviews().slice(0, 3);
  if (reviews.length === 0) return;      // keep the sample reviews

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function buildCard(review) {
    const card = el('blockquote', 'review');
    card.appendChild(el('p', 'stars', '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating)));
    card.appendChild(el('p', '', review.text ? '“' + review.text + '”' : 'Rated ' + review.rating + ' out of 5.'));
    card.appendChild(el('p', 'name', '— ' + review.name));
    card.appendChild(el('p', 'verified', '✓ Verified order'));
    return card;
  }

  // Newest first, placed before the sample reviews
  reviews.slice().reverse().forEach(function (review) { box.prepend(buildCard(review)); });

  // Keep the row to 3 cards by dropping the extra sample reviews
  while (box.children.length > 3) box.removeChild(box.lastElementChild);
})();
