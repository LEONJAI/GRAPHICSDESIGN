// Sends each "Buy now" button to its Stripe Payment Link.
(function () {
  var links = (window.APP_CONFIG || {}).STRIPE_LINKS || {};
  document.querySelectorAll(".pay").forEach(function (a) {
    var url = links[a.dataset.plan];
    if (url) { a.href = url; return; }
    a.addEventListener("click", function (e) {
      e.preventDefault();
      alert("Payments are not set up yet. Add your Stripe Payment Link for \"" + a.dataset.plan + "\" in config.js.");
    });
  });
})();
