(function () {
  var c = window.APP_CONFIG || {};
  var $ = function (id) { return document.getElementById(id); };
  var msg = $("msg"), mode = "login";

  function say(t, err) { msg.textContent = t; msg.className = "msg" + (err ? " err" : ""); }

  if (!c.SUPABASE_URL || !c.SUPABASE_ANON_KEY) {
    say("Login is not set up yet. Add your Supabase keys in config.js.", true);
    $("submit").disabled = true;
    return;
  }
  var db = window.supabase.createClient(c.SUPABASE_URL, c.SUPABASE_ANON_KEY);

  function show(session) {
    $("guest").hidden = !!session;
    $("member").hidden = !session;
    if (session) $("who").textContent = "Signed in as " + session.user.email;
  }
  db.auth.getSession().then(function (r) { show(r.data.session); });
  db.auth.onAuthStateChange(function (_e, s) { show(s); });

  $("toggle").onclick = function () {
    mode = mode === "login" ? "signup" : "login";
    $("title").textContent = $("submit").textContent = mode === "login" ? "Log in" : "Sign up";
    this.textContent = mode === "login" ? "Need an account? Sign up" : "Have an account? Log in";
    say("");
  };

  $("submit").onclick = function () {
    var email = $("email").value.trim(), password = $("password").value;
    if (!email || password.length < 8) return say("Enter your email and a password of at least 8 characters.", true);
    say("Working…");
    var req = mode === "login"
      ? db.auth.signInWithPassword({ email: email, password: password })
      : db.auth.signUp({ email: email, password: password });
    req.then(function (r) {
      if (r.error) return say(r.error.message, true);
      say(mode === "signup" ? "Check your email to confirm your account." : "");
    });
  };

  $("logout").onclick = function () { db.auth.signOut(); };
})();
