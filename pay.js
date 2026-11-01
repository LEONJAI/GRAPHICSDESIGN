// 1) Shows each price in dollars and pesos.  2) Wires the "Pay in USD" and "Pay in PHP" buttons.
(function () {
  var cfg = window.APP_CONFIG || {};

  // Default prices. Override them in config.js with PRICES if you like.
  var prices = Object.assign({
    logo:   { usd: 250, php: 15400 },
    poster: { usd: 180, php: 11100 },
    brand:  { usd: 900, php: 55400 }
  }, cfg.PRICES || {});

  var fmt = function (n) { return n.toLocaleString("en-US"); };

  document.querySelectorAll("[data-price]").forEach(function (el) {
    var p = prices[el.dataset.price];
    if (!p) return;
    el.textContent = "";
    el.append("$" + fmt(p.usd));
    var php = document.createElement("span");
    php.className = "php";
    php.textContent = "₱" + fmt(p.php);
    el.append(php);
  });

  // Payment links: PAY_LINKS[plan].usd / .php  (old STRIPE_LINKS still works for USD)
  function linkFor(plan, cur) {
    var l = (cfg.PAY_LINKS || {})[plan];
    if (l && l[cur]) return l[cur];
    if (cur === "usd" && (cfg.STRIPE_LINKS || {})[plan]) return cfg.STRIPE_LINKS[plan];
    return "";
  }

  document.querySelectorAll(".pay").forEach(function (a) {
    var plan = a.dataset.plan, cur = a.dataset.cur || "usd", p = prices[plan];
    if (p) a.textContent = cur === "php" ? "Pay ₱" + fmt(p.php) : "Pay $" + fmt(p.usd);
    var url = linkFor(plan, cur);
    if (url) { a.href = url; return; }
    a.addEventListener("click", function (e) {
      e.preventDefault();
      alert("Payments are not set up yet. Add the " + cur.toUpperCase() + " payment link for \"" + plan + "\" in config.js.");
    });
  });
})();
