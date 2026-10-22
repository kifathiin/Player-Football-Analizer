"use strict";
/* Riwayat: simpan, bandingkan, ekspor dan impor */

/* ---------- Riwayat ---------- */
const HK = "pfa_hist_v31", GR = ["Fisik", "Teknik", "Bertahan", "Mental"];
const POS = ["Kiper", "Bek Tengah", "Bek Sayap", "Gelandang Bertahan", "Gelandang Tengah", "Gelandang Serang", "Winger", "Penyerang"];
const fmtDate = t => new Date(t).toLocaleDateString("id-ID", {day: "numeric", month: "short", year: "numeric"});
const fmtTime = t => new Date(t).toLocaleTimeString("id-ID", {hour: "2-digit", minute: "2-digit"});
const loadH = () => { try { const h = JSON.parse(localStorage.getItem(HK) || "[]"); return Array.isArray(h) ? h : []; } catch (e) { return []; } };
const saveH = h => { try { localStorage.setItem(HK, JSON.stringify(h)); return true; } catch (e) { return false; } };
H = loadH();
const gAvg = a => GR.map(g => { const v = ATT.map((x, i) => x[2] === g ? a[i] : null).filter(v => v !== null); return v.reduce((p, c) => p + c, 0) / v.length; });
function mkEntry(snap) {
  const R = compute(snap);
  return {id: snap.date, role: R.top.r.n, pos: R.top.r.pos, score: Math.round(R.top.score * 100), g: gAvg(R.a), avg: R.a.reduce((p, c) => p + c, 0) / R.a.length, snap};
}
function cleanSnap(x) {
  if (!x || typeof x !== "object" || !Number.isFinite(Number(x.date))) return null;
  const att = {}, ans = {}, sl = {};
  ATT.forEach(a => { const v = Math.round(Number(x.att && x.att[a[0]])); att[a[0]] = v >= 1 && v <= 5 ? v : 3; });
  Q.forEach((q, i) => {
    if (q.s) { const v = Number(x.sl && x.sl[i]); sl[i] = v >= 0 && v <= 10 ? v : 5; }
    else { const v = Number(x.ans && x.ans[i]); if (Number.isInteger(v) && q.o[v]) ans[i] = v; }
  });
  const h = Number(x.height);
  return {name: String(x.name || "").slice(0, 30), height: h >= 140 && h <= 210 ? h : 170, foot: ["Kanan", "Kiri", "Kedua kaki"].includes(x.foot) ? x.foot : "Kanan", pos: POS.includes(x.pos) ? x.pos : "", att, ans, sl, date: Number(x.date)};
}
async function loadAll() {
  if (!isCloud()) { H = loadH(); return H; }
  try {
    const rows = await api("/rest/v1/riwayat?select=snap_date,data&order=snap_date.asc&limit=500", {auth: true});
    cloud = (rows || []).map(r => { const sn = cleanSnap({...r.data, date: Number(r.snap_date)}); return sn && mkEntry(sn); }).filter(Boolean);
    H = cloud;
  } catch (e) { H = cloud || []; toast(e.msg || "Gagal memuat riwayat dari akun."); }
  return H;
}
async function cloudAdd(sn) {
  try { await api("/rest/v1/riwayat", {method: "POST", auth: true, h: {Prefer: "return=minimal"}, body: {snap_date: sn.date, data: sn}}); return true; }
  catch (e) { return e.status === 409; }
}
async function addHistory() {
  const sn = cleanSnap({...S, date: Date.now()});
  if (isCloud()) { const ok = await cloudAdd(sn); if (ok) { cloud = (cloud || H).concat(mkEntry(sn)); H = cloud; } return ok; }
  const h = loadH(); h.push(mkEntry(sn)); const ok = saveH(h); if (ok) H = h; return ok;
}
async function delEntry(id) {
  if (!isCloud()) return saveH(loadH().filter(x => String(x.id) !== String(id)));
  try { await api("/rest/v1/riwayat?snap_date=eq." + encodeURIComponent(id), {method: "DELETE", auth: true, h: {Prefer: "return=minimal"}}); return true; }
  catch (e) { toast(e.msg || "Gagal menghapus."); return false; }
}
async function migrate() {
  const have = new Set((await loadAll()).map(x => String(x.id))); let n = 0, bad = 0;
  for (const e of loadH()) if (!have.has(String(e.id))) { if (await cloudAdd(e.snap)) n++; else bad++; }
  hMsg = bad ? `${n} hasil dipindahkan, ${bad} gagal. Coba lagi.` : `${n} hasil dari perangkat ini sudah dipindahkan ke akunmu.`;
  renderHistory();
}
function exportHistory() {
  const data = {app: "Player Football Analyzer", versi: "5.0", riwayat: H.map(e => e.snap)};
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 1)], {type: "application/json"}));
  a.download = "riwayat-analisis-" + new Date().toISOString().slice(0, 10) + ".json";
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
function importHistory(f) {
  const fail = m => { hMsg = m; renderHistory(); };
  if (f.size > 2e6) return fail("File terlalu besar. Pilih file hasil ekspor dari website ini.");
  const r = new FileReader();
  r.onerror = () => fail("File tidak bisa dibaca.");
  r.onload = async () => {
    let list = null;
    try { const d = JSON.parse(r.result); list = Array.isArray(d) ? d : d && d.riwayat; } catch (e) {}
    if (!Array.isArray(list)) return fail("File tidak dikenali. Pilih file .json hasil ekspor dari website ini.");
    const cur = await loadAll(), have = new Set(cur.map(x => String(x.id))), add = [];
    list.slice(0, 500).forEach(x => { const sn = cleanSnap(x && x.snap ? x.snap : x); if (sn && !have.has(String(sn.date))) { have.add(String(sn.date)); add.push(mkEntry(sn)); } });
    if (!add.length) return fail("Tidak ada hasil baru. Semua isi file sudah ada di riwayat.");
    if (isCloud()) { let n = 0; for (const e of add) if (await cloudAdd(e.snap)) n++; return fail(`Berhasil menambahkan ${n} hasil ke akunmu.`); }
    fail(saveH(cur.concat(add).sort((p, q) => p.id - q.id)) ? `Berhasil menambahkan ${add.length} hasil ke riwayat.` : "Gagal menyimpan. Penyimpanan browser mungkin penuh.");
  };
  r.readAsText(f);
}
function trend(h) {
  const W = 640, Ht = 300, L = 36, T = 16, B = 44, E = 16, n = h.length, col = ["#19e36b", "#f5f7f6", "#d9ff3d", "#5cc8ff"];
  const x = i => n === 1 ? (L + W - E) / 2 : L + (W - L - E) * i / (n - 1), y = v => T + (Ht - T - B) * (5 - v) / 4;
  let g = "";
  for (let v = 1; v <= 5; v++) g += `<line x1="${L}" x2="${W - E}" y1="${y(v)}" y2="${y(v)}" stroke="#1d2622"/><text x="${L - 8}" y="${y(v) + 4}" text-anchor="end">${v}</text>`;
  h.forEach((e, i) => { g += `<text x="${x(i)}" y="${Ht - B + 22}" text-anchor="middle">${fmtDate(e.snap.date)}</text>`; });
  GR.forEach((_, k) => {
    g += `<polyline points="${h.map((e, i) => x(i) + "," + y(e.g[k])).join(" ")}" fill="none" stroke="${col[k]}" stroke-width="2"/>` + h.map((e, i) => `<circle cx="${x(i)}" cy="${y(e.g[k])}" r="4" fill="${col[k]}"/>`).join("");
  });
  return `<svg viewBox="0 0 ${W} ${Ht}" role="img" aria-label="Grafik rata-rata kemampuan per kelompok dari waktu ke waktu">${g}</svg><div class="legend">${GR.map((n, k) => `<span><i style="background:${col[k]}"></i>${n}</span>`).join("")}</div>`;
}
function compareHTML(a, b) {
  if (!a || !b || a.id === b.id) return '<p class="note">Pilih dua hasil yang berbeda untuk dibandingkan.</p>';
  const sg = (v, d = 0) => (v > 0 ? "+" : v < 0 ? "\u2212" : "") + Math.abs(v).toFixed(d), cls = v => v > 0 ? "up" : v < 0 ? "dn" : "eq";
  const rows = GR.map(g => `<tr class="grp"><th colspan="4">${g}</th></tr>` + ATT.filter(x => x[2] === g).map(x => {
    const p = a.snap.att[x[0]], q = b.snap.att[x[0]], v = q - p;
    return `<tr><td>${x[1]}</td><td>${p}</td><td>${q}</td><td class="${cls(v)}">${sg(v)}</td></tr>`;
  }).join("")).join("");
  const df = ATT.map(x => ({n: x[1], v: b.snap.att[x[0]] - a.snap.att[x[0]]})), up = [...df].sort((p, q) => q.v - p.v)[0], dn = [...df].sort((p, q) => p.v - q.v)[0];
  const dA = b.avg - a.avg, dS = b.score - a.score;
  const note = (up.v > 0 ? `Kenaikan terbesar ada di ${up.n.toLowerCase()} (${sg(up.v)}). ` : "Belum ada atribut yang naik. ") + (dn.v < 0 ? `Penurunan terbesar ada di ${dn.n.toLowerCase()} (${sg(dn.v)}).` : "Tidak ada atribut yang turun.");
  return `<div class="cmpsum">
    <div class="card"><h3>Rata-rata kemampuan</h3><p>${a.avg.toFixed(2)} ke ${b.avg.toFixed(2)}, selisih <b class="${cls(dA)}">${sg(dA, 2)}</b></p></div>
    <div class="card"><h3>Peran utama</h3><p>${esc(a.role)} ke ${esc(b.role)}${a.role === b.role ? " (tetap)" : ""}</p></div>
    <div class="card"><h3>Kecocokan peran</h3><p>${a.score} persen ke ${b.score} persen, selisih <b class="${cls(dS)}">${sg(dS)}</b> poin</p></div>
  </div><p class="note">${note}</p>
  <div class="tblwrap"><table class="cmp"><thead><tr><th>Atribut</th><th>A</th><th>B</th><th>Selisih (B \u2212 A)</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}
async function renderHistory() {
  const b = $("historyBody");
  b.innerHTML = '<p class="tag">Riwayat</p><p class="hint">Memuat riwayat...</p>';
  const all = await loadAll();
  if (!/^#\/?riwayat$/.test(location.hash)) return;
  const cl = isCloud(), msg = esc(hMsg); hMsg = "";
  const tools = `<div class="tools noprint"><button class="btn ghost" data-act="export"${all.length ? "" : " disabled"}>Ekspor riwayat</button><button class="btn ghost" data-act="import">Impor riwayat</button><input type="file" id="hFile" accept=".json,application/json" hidden></div><p class="note" id="hMsg" role="status">${msg}</p>`;
  const ids = new Set(all.map(x => String(x.id))), loc = cl ? loadH().filter(x => !ids.has(String(x.id))) : [];
  const where = cl ? '<p class="hint">Riwayat ini tersimpan di akunmu dan hanya bisa dilihat olehmu.</p>' : `<p class="hint">Riwayat ini hanya ada di browser ini. ${AUTH_ON ? 'Masuk ke akunmu agar tersimpan di server dan bisa dibuka dari perangkat lain.' : ""}</p>${AUTH_ON ? '<div class="row"><button class="btn ghost" data-go="masuk">Masuk atau daftar</button></div>' : ""}`;
  const mig = loc.length ? `<div class="card" style="margin:20px 0"><h3>Ada ${loc.length} hasil di perangkat ini</h3><p>Pindahkan ke akunmu supaya tersimpan di server dan bisa dibuka dari perangkat lain.</p><div class="row" style="margin-top:14px"><button class="btn" data-act="migrate">Pindahkan ke akun</button></div></div>` : "";
  if (!all.length) {
    b.innerHTML = `<p class="tag">Riwayat</p><h2>Belum ada hasil tersimpan</h2><p class="hint">Selesaikan analisis, lalu tekan tombol simpan di halaman hasil.</p>${where}${mig}<div class="row"><button class="btn" data-new="1">Mulai analisis</button></div>${tools}`;
    reveal(); return;
  }
  const first = all[0], last = all[all.length - 1], d = last.avg - first.avg;
  const note = all.length > 1 ? `Rata-rata kemampuanmu ${d >= 0 ? "naik" : "turun"} ${Math.abs(d).toFixed(2)} poin sejak ${fmtDate(first.snap.date)}.` : "Simpan satu hasil lagi setelah berlatih untuk melihat perubahan.";
  const opts = sel => all.map((e, i) => `<option value="${i}"${i === sel ? " selected" : ""}>${fmtDate(e.snap.date)} ${fmtTime(e.snap.date)}, ${esc(e.role)}</option>`).join("");
  b.innerHTML = `<p class="tag">Riwayat</p><h2>Perkembanganmu dari waktu ke waktu</h2><p class="hint">${note}</p>${where}${mig}
  <div class="card chart">${trend(all.slice(-8))}</div>
  ${tools}
  ${all.length > 1 ? `<div class="sec"><h2>Bandingkan dua hasil</h2><p class="hint">Pilih dua tanggal untuk melihat perubahan tiap atribut beserta selisihnya.</p><div class="cmpsel"><div class="field"><label for="cmpA">Hasil A (awal)</label><select id="cmpA">${opts(0)}</select></div><div class="field"><label for="cmpB">Hasil B (terbaru)</label><select id="cmpB">${opts(all.length - 1)}</select></div></div><div id="cmpBody">${compareHTML(first, last)}</div></div>` : ""}
  <div class="sec"><h2>Hasil tersimpan</h2><div class="hist">${[...all].reverse().map(e => `<div class="card hrow"><div><b>${fmtDate(e.snap.date)}</b><span>${esc(e.snap.name || "Tanpa nama")}</span></div><div><b>${esc(e.role)}</b><span>${esc(e.pos)}, kecocokan ${esc(e.score)} persen</span></div><div class="row"><button class="btn ghost" data-view-id="${esc(e.id)}">Lihat</button><button class="btn ghost" data-del-id="${esc(e.id)}">Hapus</button></div></div>`).join("")}</div></div>
  <div class="row noprint" style="margin-top:32px"><button class="btn" data-new="1">Analisis baru</button></div>`;
  reveal();
}
$("historyBody").addEventListener("click", async e => {
  const a = e.target.closest("[data-act]"), v = e.target.closest("[data-view-id]"), d = e.target.closest("[data-del-id]"), n = e.target.closest("[data-new]");
  if (a) { const k = a.dataset.act; if (k === "export") exportHistory(); else if (k === "migrate") { a.disabled = true; migrate(); } else $("hFile").click(); }
  else if (v) { const f = H.find(x => String(x.id) === v.dataset.viewId); if (f) { viewSnap = f.snap; go("hasil"); } }
  else if (d && confirm("Hapus hasil ini dari riwayat?")) { if (await delEntry(d.dataset.delId)) { cloud = null; renderHistory(); } }
  else if (n) { S.done = false; S.step = 0; save(); go("analisis"); }
});
$("historyBody").addEventListener("change", e => {
  if (e.target.id === "hFile" && e.target.files[0]) importHistory(e.target.files[0]);
  else if (e.target.id === "cmpA" || e.target.id === "cmpB") $("cmpBody").innerHTML = compareHTML(H[+$("cmpA").value], H[+$("cmpB").value]);
});


