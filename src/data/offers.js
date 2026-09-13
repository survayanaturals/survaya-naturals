// Central config for "Buy X, Get Y Free" deals — one entry per product ID.
// CartContext.jsx reads this automatically to auto-add/remove free items,
// and DiscountPopup.jsx reads it to display the right offer text and to
// know how many paid units to add when the popup's button is clicked.
//
// To change or remove an offer, edit this file only — no other file needs touching.
//
// Format:
//   "<product_id>": { buyQty: <paid units needed>, freeQty: <free units granted> }
//
// Example: { buyQty: 2, freeQty: 1 } means "buy 2 paid units, get 1 free unit"
//   - Buying 4 paid units gets 2 free (it scales in multiples of buyQty)
// Example: { buyQty: 2, freeQty: 2 } means "buy 2 paid units, get 2 free units"

export const productOffers = {
  b1: { buyQty: 2, freeQty: 2 }, // Golden Almond Ragi Cookies — buy 2, get 1 free
  b2: { buyQty: 2, freeQty: 1 }, // Rustic Ragi Delights (Biscuits) — buy 2, get 2 free
};
