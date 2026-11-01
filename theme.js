// Applies the saved light/dark choice before the page paints.
(function () {
  try { var t = localStorage.getItem("theme"); if (t) document.documentElement.setAttribute("data-theme", t); } catch (e) {}
})();
