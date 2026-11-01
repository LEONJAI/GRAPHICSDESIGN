(function () {
  var c = window.APP_CONFIG || {};
  var $ = function (id) { return document.getElementById(id); };
  function say(id, t, err) { var m = $(id); m.textContent = t; m.className = "msg" + (err ? " err" : ""); }

  if (!c.SUPABASE_URL || !c.SUPABASE_ANON_KEY) { $("name").textContent = "Add your Supabase keys in config.js"; return; }
  var db = window.supabase.createClient(c.SUPABASE_URL, c.SUPABASE_ANON_KEY);
  var user = null;
  $("birthday").max = new Date().toISOString().slice(0, 10);

  db.auth.getSession().then(function (r) {
    if (!r.data.session) { location.replace("login.html"); return; }
    user = r.data.session.user;
    $("email").textContent = user.email;
    $("since").textContent = "Member since " + new Date(user.created_at).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
    loadProfile();
  });

  function showAge() {
    var v = $("birthday").value;
    if (!v) { $("age").textContent = ""; return; }
    var b = new Date(v), n = new Date(), a = n.getFullYear() - b.getFullYear();
    if (n < new Date(n.getFullYear(), b.getMonth(), b.getDate())) a--;
    $("age").textContent = "Age: " + a;
  }
  $("birthday").addEventListener("change", showAge);

  function paint() {
    var full = ($("firstName").value + " " + $("lastName").value).trim();
    var u = $("username").value.trim();
    var shown = full || u || user.email.split("@")[0];
    $("name").textContent = shown;
    $("handle").textContent = u ? "@" + u : "";
    $("avatar").textContent = shown.charAt(0).toUpperCase();
  }

  function loadProfile() {
    db.from("profiles").select("username, first_name, last_name, birthday, address, phone, bio").eq("id", user.id).maybeSingle().then(function (r) {
      var p = r.data || {};
      $("firstName").value = p.first_name || "";
      $("lastName").value = p.last_name || "";
      $("username").value = p.username || "";
      $("birthday").value = p.birthday || "";
      $("address").value = p.address || "";
      $("phone").value = p.phone || "";
      $("bio").value = p.bio || "";
      paint(); showAge();
      if (r.error) say("profileMsg", "Could not load your profile. Run migration.sql and migration2.sql in Supabase.", true);
    });
  }

  $("saveProfile").onclick = function () {
    var username = $("username").value.trim().toLowerCase();
    if (username && !/^[a-z0-9_]{3,20}$/.test(username)) return say("profileMsg", "Username must be 3 to 20 letters, numbers or underscores.", true);
    say("profileMsg", "Saving…");
    db.from("profiles").upsert({
      id: user.id,
      username: username || null,
      first_name: $("firstName").value.trim(),
      last_name: $("lastName").value.trim(),
      birthday: $("birthday").value || null,
      address: $("address").value.trim(),
      phone: $("phone").value.trim(),
      bio: $("bio").value.trim()
    }).then(function (r) {
      if (r.error) return say("profileMsg", r.error.code === "23505" ? "That username is taken. Try another." : r.error.message, true);
      $("username").value = username;
      paint();
      say("profileMsg", "Saved.");
    });
  };

  $("savePass").onclick = function () {
    var p = $("newPass").value;
    if (p.length < 8) return say("passMsg", "Use at least 8 characters.", true);
    db.auth.updateUser({ password: p }).then(function (r) {
      if (r.error) return say("passMsg", r.error.message, true);
      $("newPass").value = "";
      say("passMsg", "Password updated.");
    });
  };

  $("logout").onclick = function (e) {
    e.preventDefault();
    db.auth.signOut().then(function () { location.href = "index.html"; });
  };
})();
