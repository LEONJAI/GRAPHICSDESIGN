(function () {
  var cfg = window.APP_CONFIG || {};
  var pay = cfg.PESO_PAY || {};
  var names = { logo: "Logo design", poster: "Poster design", brand: "Brand identity", web: "Web design", ui: "UI and app design", social: "Social media pack", packaging: "Packaging design", icons: "Icons and illustration", photo: "Photo editing", video: "Motion graphics", store: "Online store design", deck: "Presentation design" };
  var prices = Object.assign({ logo: { php: 15400 }, poster: { php: 11100 }, brand: { php: 55400 }, web: { php: 73900 }, ui: { php: 49300 }, social: { php: 9200 }, packaging: { php: 24600 }, icons: { php: 12300 }, photo: { php: 3100 }, video: { php: 18500 }, store: { php: 67800 }, deck: { php: 21600 } }, cfg.PRICES || {});
  var $ = function (id) { return document.getElementById(id); };

  var plan = new URLSearchParams(location.search).get("plan");
  if (!names[plan]) plan = "logo";
  var amount = "₱" + prices[plan].php.toLocaleString("en-US");
  var ref = plan.slice(0, 2).toUpperCase() + "-" + Math.random().toString(36).slice(2, 8).toUpperCase();

  $("item").textContent = names[plan];
  $("amount").textContent = amount;
  $("ref").textContent = ref;

  function method(title, lines) {
    var d = document.createElement("div");
    d.className = "method";
    var h = document.createElement("h2");
    h.textContent = title;
    d.appendChild(h);
    lines.forEach(function (l) { var p = document.createElement("p"); p.textContent = l; d.appendChild(p); });
    $("methods").appendChild(d);
  }
  if (pay.gcashNumber) method("GCash", ["Name: " + (pay.gcashName || ""), "Number: " + pay.gcashNumber]);
  if (pay.mayaNumber) method("Maya", ["Name: " + (pay.mayaName || ""), "Number: " + pay.mayaNumber]);
  if (pay.bankAccountNumber) method(pay.bankName || "Bank transfer", ["Account name: " + (pay.bankAccountName || ""), "Account number: " + pay.bankAccountNumber]);
  if (!$("methods").children.length) method("Not set up yet", ["Add your PESO_PAY details in config.js."]);

  if (pay.qrImage) { $("qr").src = pay.qrImage; $("qr").hidden = false; }

  var to = (cfg.CONTACT_EMAIL || "hello@jeisaru.com");
  $("mail").href = "mailto:" + to + "?subject=" + encodeURIComponent("Payment receipt " + ref + " – " + names[plan]) +
    "&body=" + encodeURIComponent("Hi, I paid " + amount + " for " + names[plan] + ".\nReference: " + ref + "\n\nReceipt screenshot attached.");
})();
