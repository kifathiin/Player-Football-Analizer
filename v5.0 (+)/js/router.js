"use strict";
/* Navigasi antar halaman (hash routing) */

/* ---------- Navigasi ---------- */
function route() {
  let v = location.hash.replace(/^#\/?/, "") || "home";
  const fix = (n, m) => { v = n; history.replaceState(null, "", "#/" + n); if (m) toast(m); };
  if (!["home", "analisis", "hasil", "latihan", "riwayat", "masuk", "akun"].includes(v)) v = "home";
  if (v === "masuk" && isCloud()) fix("akun");
  if (v === "akun" && !isCloud()) fix("masuk");
  if (v !== "hasil") viewSnap = null;
  if (v === "hasil" && !S.done && !viewSnap) fix("analisis", "Hasil terkunci sampai kamu menyelesaikan analisis.");
  document.querySelectorAll("[data-view]").forEach(s => { s.hidden = s.dataset.view !== v; });
  document.querySelectorAll("[data-nav]").forEach(a => a.classList.toggle("on", a.dataset.nav === v));
  $("accBtn").classList.toggle("on", v === "masuk" || v === "akun");
  if (v === "analisis") renderStep();
  if (v === "hasil") renderResult(viewSnap);
  if (v === "riwayat") renderHistory();
  if (v === "latihan") renderPlan();
  if (v === "masuk") renderAuth();
  if (v === "akun") renderAccount();
  updAcc(); updLock();
  window.scrollTo(0, 0);
  reveal();
  bar.start(); setTimeout(() => bar.done(), 250);
}
function go(name) {
  const h = name === "home" ? "#/" : "#/" + name;
  if (location.hash === h) route(); else location.hash = h;
}
document.addEventListener("click", e => {
  if (e.target.closest('[data-nav="hasil"].locked')) { e.preventDefault(); toast("Hasil masih terkunci. Selesaikan analisis dulu."); go("analisis"); return; }
  const g = e.target.closest("[data-go]");
  if (g) { e.preventDefault(); go(g.dataset.go); return; }
  const s = e.target.closest("[data-scroll]");
  if (s) $(s.dataset.scroll).scrollIntoView({behavior: "smooth"});
});
window.addEventListener("hashchange", route);

