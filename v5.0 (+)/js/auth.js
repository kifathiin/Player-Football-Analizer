"use strict";
/* Akun: konfigurasi dan API Supabase, masuk, daftar */

/* ---------- Akun (Supabase) ---------- */
const CFG = window.PFA_CONFIG || {}, AK = "pfa_auth", SBKEY = String(CFG.SUPABASE_KEY || "").trim();
const SB = (() => { try { const u = new URL(String(CFG.SUPABASE_URL || "").trim()); return /(^|\.)supabase\.com$/.test(u.hostname) || !/^https?:$/.test(u.protocol) ? "" : u.origin; } catch (e) { return ""; } })();
const KEY_SECRET = (() => { if (/^sb_secret_/.test(SBKEY)) return true; try { return JSON.parse(atob(SBKEY.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))).role === "service_role"; } catch (e) { return false; } })();
const CFG_ERR = !CFG.SUPABASE_URL && !SBKEY ? "Fitur akun belum aktif: isi config.js dengan alamat proyek dan kunci publik Supabase."
  : !SB ? "Alamat proyek di config.js tidak valid. Pakai Project URL berbentuk https://kode-proyek.supabase.co, bukan alamat dashboard."
  : !SBKEY ? "Kunci publik di config.js masih kosong."
  : KEY_SECRET ? "Kunci di config.js adalah kunci rahasia dan tidak boleh dipakai di website. Ganti dengan kunci publik (publishable atau anon), lalu buat ulang kunci rahasia itu di Supabase."
  : "";
const AUTH_ON = !CFG_ERR;
let sess = null, authMode = "", authTab = "masuk", cloud = null, H = [], viewSnap = null, hMsg = "";
try { sess = JSON.parse(localStorage.getItem(AK) || "null"); } catch (e) {}
if (!AUTH_ON) sess = null;
const isCloud = () => !!(AUTH_ON && sess && sess.access_token);
const setSess = v => { sess = v; try { v ? localStorage.setItem(AK, JSON.stringify(v)) : localStorage.removeItem(AK); } catch (e) {} };
const mapSess = d => d && d.access_token ? {access_token: d.access_token, refresh_token: d.refresh_token, expires_at: Math.floor(Date.now() / 1000) + (Number(d.expires_in) || 3600), email: (d.user && d.user.email) || (sess && sess.email) || ""} : null;



function errText(d, st, path = "") {
  const x = String(d && (d.error_code || d.code) || "") + " " + String(d && (d.msg || d.message || d.error_description || d.error) || "");
  if (st === 404 && path.startsWith("/auth/")) return "Alamat proyek di config.js tampaknya salah (kode 404). Isi SUPABASE_URL dengan Project URL saja, bentuknya https://kode-proyek.supabase.co, tanpa tambahan di belakangnya.";
  if (st === 404 || /PGRST205|schema cache|Could not find the table/i.test(x)) return "Supabase tidak menemukan tabel riwayat (kode 404). Cek dua hal: skrip SQL sudah dijalankan di proyek yang sama dengan alamat di config.js, dan Data API menyertakan schema public.";
  if (/42501|permission denied|row-level security/i.test(x) || st === 403) return "Supabase menolak izin penyimpanan (kode 403). Jalankan ulang bagian izin (GRANT dan POLICY) pada skrip SQL.";
  if (/invalid login|invalid_credentials/i.test(x)) return "Email atau kata sandi salah.";
  if (/api key|apikey/i.test(x)) return "Kunci di config.js ditolak Supabase. Pastikan memakai kunci publik dari proyek yang sama dengan alamatnya.";
  if (/email_not_confirmed|not confirmed/i.test(x)) return "Email belum dikonfirmasi. Cek kotak masuk atau folder spam, lalu klik tautan konfirmasinya.";
  if (/already|exists/i.test(x)) return "Email ini sudah terdaftar. Silakan masuk.";
  if (/rate|too many|over_/i.test(x) || st === 429) return "Terlalu banyak percobaan. Tunggu beberapa menit lalu coba lagi.";
  if (/email_address_invalid|valid email/i.test(x)) return "Alamat email tidak valid.";
  if (/weak_password|password/i.test(x)) return "Kata sandi terlalu lemah. Pakai minimal 8 karakter.";
  const cd = String(d && (d.error_code || d.code) || "");
  return "Terjadi masalah (kode " + st + (cd ? ", " + cd : "") + "). Coba lagi sebentar lagi.";
}
async function refresh() {
  if (!sess || !sess.refresh_token) return false;
  try {
    const r = await fetch(SB + "/auth/v1/token?grant_type=refresh_token", {method: "POST", headers: {apikey: SBKEY, "Content-Type": "application/json"}, body: JSON.stringify({refresh_token: sess.refresh_token})});
    if (!r.ok) return false;
    const n = mapSess(await r.json()); if (!n) return false;
    n.email = n.email || sess.email; setSess(n); return true;
  } catch (e) { return false; }
}
async function api(path, o = {}) {
  if (!AUTH_ON) throw {msg: CFG_ERR || "Fitur akun belum aktif.", status: 0};
  bar.start();
  try {
    if (o.auth && sess && sess.expires_at - 60 < Date.now() / 1000) await refresh();
    const hd = {apikey: SBKEY, "Content-Type": "application/json", ...(o.auth && sess ? {Authorization: "Bearer " + sess.access_token} : {}), ...(o.h || {})};
    let r;
    try { r = await fetch(SB + path, {method: o.method || "GET", headers: hd, body: o.body ? JSON.stringify(o.body) : undefined}); }
    catch (e) { throw {msg: "Tidak bisa terhubung ke server. Periksa koneksi internetmu.", status: 0}; }
    const t = await r.text(); let d = null; try { d = t ? JSON.parse(t) : null; } catch (e) {}
    if (r.status === 401 && o.auth && !o.retry) { if (await refresh()) return api(path, {...o, retry: 1}); setSess(null); updAcc(); }
    if (!r.ok) throw {msg: errText(d, r.status, path), status: r.status};
    return d;
  } finally { bar.done(); }
}
const redirectTo = () => encodeURIComponent(location.origin + location.pathname);
async function signUp(email, pw) {
  const d = await api("/auth/v1/signup?redirect_to=" + redirectTo(), {method: "POST", body: {email, password: pw}});
  if (d && d.access_token) { setSess(mapSess(d)); return "masuk"; }
  const u = d && (d.user || d);
  if (u && Array.isArray(u.identities) && !u.identities.length) throw {msg: "Email ini sudah terdaftar. Silakan masuk, atau pakai Lupa kata sandi."};
  return "cek-email";
}
async function signIn(email, pw) { setSess(mapSess(await api("/auth/v1/token?grant_type=password", {method: "POST", body: {email, password: pw}}))); }
async function signOut() { try { if (sess) await api("/auth/v1/logout", {method: "POST", auth: true}); } catch (e) {} setSess(null); cloud = null; H = loadH(); }
const resetPw = email => api("/auth/v1/recover?redirect_to=" + redirectTo(), {method: "POST", body: {email}});
const newPw = pw => api("/auth/v1/user", {method: "PUT", auth: true, body: {password: pw}});

async function consumeHash() {
  if (!/^#(access_token|error|error_code)=/.test(location.hash)) return;
  const p = new URLSearchParams(location.hash.slice(1));
  history.replaceState(null, "", location.pathname + "#/akun");
  if (p.get("error") || p.get("error_code")) { toast("Tautan tidak berlaku atau sudah kedaluwarsa. Minta tautan baru."); return; }
  const n = mapSess({access_token: p.get("access_token"), refresh_token: p.get("refresh_token"), expires_in: p.get("expires_in")});
  if (!n || !AUTH_ON) return;
  setSess(n);
  try { const u = await api("/auth/v1/user", {auth: true}); n.email = (u && u.email) || ""; setSess(n); } catch (e) {}
  if (p.get("type") === "recovery") authMode = "recovery"; else toast("Email terkonfirmasi. Kamu sudah masuk.");
}
function updAcc() {
  const a = $("accBtn"), on = isCloud();
  a.href = on ? "#/akun" : "#/masuk"; a.classList.toggle("in", on);
  a.setAttribute("aria-label", on ? "Akun saya" : "Masuk atau daftar"); a.title = on ? "Akun saya" : "Masuk atau daftar";
  $("accInit").textContent = on && sess.email ? sess.email[0].toUpperCase() : "";
}
function updLock() {
  const a = document.querySelector('[data-nav="hasil"]'); if (!a) return;
  a.classList.toggle("locked", !S.done); a.setAttribute("aria-disabled", S.done ? "false" : "true");
  a.title = S.done ? "" : "Selesaikan analisis untuk membuka hasil";
}
const fld = (id, label, type, ac) => `<div class="field"><label for="${id}">${label}</label><input id="${id}" name="${id}" type="${type}" autocomplete="${ac}" required></div>`;
function renderAuth() {
  const t = authTab, ttl = {masuk: "Masuk ke akunmu", daftar: "Buat akun baru", lupa: "Atur ulang kata sandi"}[t];
  $("authBody").innerHTML = `<p class="tag">Akun</p><h2>${ttl}</h2>
  <p class="hint">${t === "lupa" ? "Masukkan email akunmu. Kami kirim tautan untuk membuat kata sandi baru." : "Dengan akun, hasil analisismu tersimpan di server dan bisa dibuka dari perangkat mana pun. Hanya kamu yang bisa melihatnya."}</p>
  ${AUTH_ON ? "" : '<p class="err">' + esc(CFG_ERR) + '</p>'}
  ${t === "lupa" ? "" : `<div class="tabs"><button type="button" class="${t === "masuk" ? "on" : ""}" data-tab="masuk">Masuk</button><button type="button" class="${t === "daftar" ? "on" : ""}" data-tab="daftar">Daftar</button></div>`}
  <form id="authForm" novalidate>${fld("email", "Email", "email", "email")}${t !== "lupa" ? fld("pw", "Kata sandi", "password", t === "masuk" ? "current-password" : "new-password") : ""}${t === "daftar" ? fld("pw2", "Ulangi kata sandi", "password", "new-password") : ""}
  <button class="btn" type="submit">${{masuk: "Masuk", daftar: "Buat akun", lupa: "Kirim tautan"}[t]}</button></form>
  ${t === "masuk" ? '<p class="note"><button type="button" class="linkb" data-tab="lupa">Lupa kata sandi?</button></p>' : ""}${t === "lupa" ? '<p class="note"><button type="button" class="linkb" data-tab="masuk">Kembali ke halaman masuk</button></p>' : ""}
  <p class="err" id="authErr" role="alert"></p><p class="ok" id="authOk" role="status"></p>`;
}
async function afterAuth(msg) { updAcc(); await loadAll(); toast(msg); go("akun"); }
$("authBody").addEventListener("click", e => { const t = e.target.closest("[data-tab]"); if (t) { authTab = t.dataset.tab; renderAuth(); } });
$("authBody").addEventListener("submit", async e => {
  e.preventDefault();
  const f = e.target, email = f.email.value.trim(), pw = f.pw ? f.pw.value : "", err = $("authErr"), ok = $("authOk"), btn = f.querySelector("button[type=submit]");
  err.textContent = ""; ok.textContent = "";
  if (!/^\S+@\S+\.\S+$/.test(email)) { err.textContent = "Isi alamat email yang valid."; return; }
  if (authTab !== "lupa" && pw.length < 8) { err.textContent = "Kata sandi minimal 8 karakter."; return; }
  if (authTab === "daftar" && pw !== f.pw2.value) { err.textContent = "Kedua kata sandi harus sama."; return; }
  btn.disabled = true;
  try {
    if (authTab === "masuk") { await signIn(email, pw); await afterAuth("Berhasil masuk."); return; }
    if (authTab === "daftar") {
      if (await signUp(email, pw) === "masuk") { await afterAuth("Akun dibuat dan kamu sudah masuk."); return; }
      ok.textContent = "Akun dibuat. Kami mengirim email konfirmasi ke " + email + ". Klik tautan di email itu (cek folder spam), lalu masuk di sini.";
    } else { await resetPw(email); ok.textContent = "Kalau email itu terdaftar, tautan pengaturan ulang sudah dikirim. Cek kotak masuk dan folder spam."; }
  } catch (x) { err.textContent = x.msg || "Terjadi masalah. Coba lagi."; }
  btn.disabled = false;
});
async function renderAccount() {
  const b = $("accBody");
  if (authMode === "recovery") {
    b.innerHTML = `<p class="tag">Akun</p><h2>Buat kata sandi baru</h2><form id="pwForm" novalidate>${fld("pw", "Kata sandi baru", "password", "new-password")}${fld("pw2", "Ulangi kata sandi baru", "password", "new-password")}<button class="btn" type="submit">Simpan kata sandi</button></form><p class="err" id="pwErr" role="alert"></p>`;
    return;
  }
  b.innerHTML = `<p class="tag">Akun</p><h2>Akun saya</h2><div class="card"><h3>${esc(sess.email || "")}</h3><p id="accInfo">Menghitung hasil tersimpan...</p></div>
  <div class="row" style="margin-top:24px"><button class="btn" data-go="riwayat">Lihat riwayat</button><button class="btn ghost" id="btnOut">Keluar</button></div>`;
  $("btnOut").onclick = async () => { await signOut(); updAcc(); toast("Kamu sudah keluar."); go("home"); };
  const n = (await loadAll()).length;
  if ($("accInfo")) $("accInfo").textContent = n ? n + " hasil analisis tersimpan di akun ini." : "Belum ada hasil tersimpan di akun ini.";
}
$("accBody").addEventListener("submit", async e => {
  e.preventDefault();
  const f = e.target, err = $("pwErr");
  if (f.pw.value.length < 8) { err.textContent = "Kata sandi minimal 8 karakter."; return; }
  if (f.pw.value !== f.pw2.value) { err.textContent = "Kedua kata sandi harus sama."; return; }
  try { await newPw(f.pw.value); authMode = ""; toast("Kata sandi berhasil diganti."); renderAccount(); } catch (x) { err.textContent = x.msg || "Gagal mengganti kata sandi."; }
});


