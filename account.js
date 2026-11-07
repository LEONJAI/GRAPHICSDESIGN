(function () {
  var c = window.APP_CONFIG || {};
  var $ = function (id) { return document.getElementById(id); };
  function say(id, t, err) { var m = $(id); m.textContent = t; m.className = "msg" + (err ? " err" : "") + (id === "photoMsg" ? " center" : ""); }
  function ageOf(iso) {
    var b = new Date(iso), n = new Date(), a = n.getFullYear() - b.getFullYear();
    if (n < new Date(n.getFullYear(), b.getMonth(), b.getDate())) a--;
    return a;
  }

  /* Menu: open one drawer at a time */
  function drawer(btnId, panelId) {
    $(btnId).onclick = function () {
      var open = $(panelId).hidden;
      ["profilePanel", "settingsPanel"].forEach(function (p) { $(p).hidden = true; });
      ["openProfile", "openSettings"].forEach(function (b) { $(b).setAttribute("aria-expanded", "false"); });
      $(panelId).hidden = !open;
      this.setAttribute("aria-expanded", String(open));
    };
  }
  drawer("openProfile", "profilePanel");
  drawer("openSettings", "settingsPanel");

  /* Dark mode */
  function isDark() {
    var t = document.documentElement.getAttribute("data-theme");
    return t ? t === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  function syncSwitch() { $("darkSwitch").setAttribute("aria-checked", String(isDark())); }
  $("darkSwitch").onclick = function () {
    var next = isDark() ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) {}
    syncSwitch();
  };
  syncSwitch();

  if (!c.SUPABASE_URL || !c.SUPABASE_ANON_KEY) { $("name").textContent = "Add your Supabase keys in config.js"; return; }
  var db = window.supabase.createClient(c.SUPABASE_URL, c.SUPABASE_ANON_KEY);
  var user = null;
  $("birthday").max = new Date().toISOString().slice(0, 10);

  db.auth.getSession().then(function (r) {
    if (!r.data.session) { location.replace("/login"); return; }
    user = r.data.session.user;
    $("vEmail").textContent = user.email;
    loadProfile();
  });

  function paint() {
    var full = ($("firstName").value + " " + $("lastName").value).trim();
    var u = $("username").value.trim();
    var shown = full || u || user.email.split("@")[0];
    $("name").textContent = shown;
    $("handle").textContent = u ? "@" + u : "";
    if (!$("avatar").style.backgroundImage) $("avatar").textContent = shown.charAt(0).toUpperCase();
    var nv = function (v) { return v || "Not added"; };
    $("vName").textContent = nv(full);
    $("vUser").textContent = u ? "@" + u : "Not added";
    $("vBirth").textContent = $("birthday").value ? new Date($("birthday").value + "T00:00:00").toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }) : "Not added";
    $("vAge").textContent = $("birthday").value ? ageOf($("birthday").value) : "Not added";
    $("vAddress").textContent = nv($("address").value.trim());
    $("vPhone").textContent = nv($("phone").value.trim());
    $("vBio").textContent = nv($("bio").value.trim());
  }

  function editing(on) { $("profileView").hidden = on; $("profileForm").hidden = !on; }
  $("editBtn").onclick = function () { editing(true); };
  $("cancelEdit").onclick = function () { loadProfile(); editing(false); say("profileMsg", ""); };

  function setPhoto(url) {
    if (!url) return;
    $("avatar").style.backgroundImage = 'url("' + url + '")';
    $("avatar").textContent = "";
  }

  function loadProfile() {
    db.from("profiles").select("username, first_name, last_name, birthday, address, phone, bio, avatar_url").eq("id", user.id).maybeSingle().then(function (r) {
      var p = r.data || {};
      $("firstName").value = p.first_name || "";
      $("lastName").value = p.last_name || "";
      $("username").value = p.username || "";
      $("birthday").value = p.birthday || "";
      $("address").value = p.address || "";
      $("phone").value = p.phone || "";
      $("bio").value = p.bio || "";
      setPhoto(p.avatar_url);
      paint();
      if (r.error) say("photoMsg", "Could not load your profile. Run migration.sql, migration2.sql and migration3.sql in Supabase.", true);
    });
  }

  $("photo").onchange = function () {
    var f = this.files[0];
    if (!f) return;
    if (!/^image\//.test(f.type)) return say("photoMsg", "Choose an image file.", true);
    if (f.size > 2 * 1024 * 1024) return say("photoMsg", "Photo must be under 2 MB.", true);
    say("photoMsg", "Uploading…");
    var path = user.id + "/avatar";
    db.storage.from("avatars").upload(path, f, { upsert: true, contentType: f.type }).then(function (r) {
      if (r.error) return say("photoMsg", "Upload failed: " + r.error.message, true);
      var url = db.storage.from("avatars").getPublicUrl(path).data.publicUrl + "?t=" + Date.now();
      db.from("profiles").update({ avatar_url: url }).eq("id", user.id).then(function (u) {
        if (u.error) return say("photoMsg", u.error.message, true);
        setPhoto(url);
        say("photoMsg", "Photo updated.");
      });
    });
  };

  $("saveProfile").onclick = function () {
    say("profileMsg", "Saving…");
    db.from("profiles").upsert({
      id: user.id,
      first_name: $("firstName").value.trim(),
      last_name: $("lastName").value.trim(),
      birthday: $("birthday").value || null,
      address: $("address").value.trim(),
      phone: $("phone").value.trim(),
      bio: $("bio").value.trim()
    }).then(function (r) {
      if (r.error) return say("profileMsg", r.error.message, true);
      paint();
      say("profileMsg", "");
      editing(false);
    });
  };

  $("saveUser").onclick = function () {
    var username = $("username").value.trim().toLowerCase();
    if (!/^[a-z0-9_]{3,20}$/.test(username)) return say("userMsg", "Username must be 3 to 20 letters, numbers or underscores.", true);
    say("userMsg", "Saving…");
    db.from("profiles").upsert({ id: user.id, username: username }).then(function (r) {
      if (r.error) return say("userMsg", r.error.code === "23505" ? "That username is taken. Try another." : r.error.message, true);
      $("username").value = username;
      paint();
      say("userMsg", "Username updated.");
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

  $("logout").onclick = function () {
    db.auth.signOut().then(function () { location.href = "/"; });
  };
})();
