"use strict";
/* Halaman Latihan: rencana, catatan sesi, target mingguan */

/* ---------- Pelacak latihan ---------- */
const PK = "pfa_plan", GOAL = 2;
const dk = t => { const d = new Date(t); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); };
const wkStart = t => { const d = new Date(t); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); return d.getTime(); };
function loadPlan() {
  try {
    const p = JSON.parse(localStorage.getItem(PK) || "null");
    if (!p || !Array.isArray(p.items) || !Number.isFinite(Number(p.created))) return null;
    return {created: Number(p.created), role: String(p.role || "").slice(0, 60), items: p.items.slice(0, 3).filter(i => i && TIPS[i.key]).map(i => ({key: i.key, from: Number(i.from) || 0, target: Number(i.target) || 0, log: Array.isArray(i.log) ? [...new Set(i.log.filter(d => /^\d{4}-\d{2}-\d{2}$/.test(d)))].slice(-400) : []}))};
  } catch (e) { return null; }
}
const savePlan = p => { try { localStorage.setItem(PK, JSON.stringify(p)); return true; } catch (e) { return false; } };
const makePlan = R => ({created: Date.now(), role: R.top.r.n, items: R.gaps.map(g => ({key: ATT.find(x => x[1] === g.n)[0], from: g.v, target: g.target, log: []}))});
const wk = it => it.log.filter(d => new Date(d + "T00:00:00").getTime() >= wkStart(Date.now())).length;
function streak(p) {
  const days = new Set(p.items.flatMap(i => i.log)), t = new Date(); t.setHours(12, 0, 0, 0);
  if (!days.has(dk(t))) t.setDate(t.getDate() - 1);
  let n = 0; while (days.has(dk(t))) { n++; t.setDate(t.getDate() - 1); }
  return n;
}
function renderPlan(anim) {
  const b = $("planBody"), p = loadPlan();
  if (!p || !p.items.length) {
    b.innerHTML = `<p class="tag">Latihan</p><h2>Belum ada rencana latihan</h2><p class="hint">Rencana dibuat dari tiga area yang paling jauh dari profil ideal perannya. Selesaikan analisis, lalu tekan Jadikan rencana latihan di halaman hasil.</p><div class="row">${S.done ? '<button class="btn" data-act="mkplan">Buat dari hasil terakhir</button>' : ""}<button class="btn ghost" data-go="analisis">${S.done ? "Ulangi analisis" : "Mulai analisis"}</button></div>`;
    if (anim !== false) reveal(); return;
  }
  const today = dk(Date.now()), age = Math.floor((Date.now() - p.created) / 864e5), total = p.items.reduce((n, i) => n + i.log.length, 0);
  b.innerHTML = `<p class="tag">Latihan</p><h2>Rencana latihan untuk peran ${esc(p.role)}</h2>
  <p class="hint">Dimulai ${fmtDate(p.created)}. Target ${GOAL} sesi per minggu untuk tiap area. Catat sesi setelah selesai berlatih.</p>
  <div class="cmpsum stat"><div class="card"><h3>Total sesi</h3><p><b>${total}</b> sesi tercatat</p></div><div class="card"><h3>Hari beruntun</h3><p><b>${streak(p)}</b> hari</p></div><div class="card"><h3>Umur rencana</h3><p><b>${age}</b> hari</p></div></div>
  <div class="rows sec">${p.items.map((it, i) => { const a = ATT.find(x => x[0] === it.key), w = wk(it), done = it.log.includes(today); return `<div class="card"><h3>${i + 1}. ${a[1]}</h3><p>Nilaimu saat rencana dibuat ${it.from}, target sekitar ${it.target}.</p><p style="margin:8px 0 14px">${TIPS[it.key]}</p><div class="bars"><div class="r"><span>Minggu ini: ${w} dari ${GOAL} sesi</span><div class="t"><i style="width:${Math.min(100, w / GOAL * 100)}%"></i></div><b>${w}/${GOAL}</b></div></div><div class="row"><button class="btn${done ? " ghost" : ""}" data-log="${esc(it.key)}">${done ? "Batalkan catatan hari ini" : "Catat sesi hari ini"}</button></div></div>`; }).join("")}</div>
  ${age >= 28 ? `<div class="card" style="margin-top:20px"><h3>Sudah ${age} hari</h3><p>Saatnya menilai ulang. Hasil barunya bisa kamu bandingkan dengan hasil lama di menu Riwayat.</p><div class="row" style="margin-top:14px"><button class="btn" data-act="reassess">Analisis ulang</button></div></div>` : ""}
  <div class="row noprint" style="margin-top:28px"><button class="btn ghost" data-act="delplan">Hapus rencana</button></div>
  <p class="note">Catatan latihan tersimpan di browser ini. Penyimpanan ke akun menyusul di tahap berikutnya.</p>`;
  if (anim !== false) reveal();
}
$("planBody").addEventListener("click", e => {
  const l = e.target.closest("[data-log]"), a = e.target.closest("[data-act]");
  if (l) {
    const p = loadPlan(), it = p && p.items.find(i => i.key === l.dataset.log);
    if (it) { const t = dk(Date.now()), k = it.log.indexOf(t); if (k < 0) it.log.push(t); else it.log.splice(k, 1); if (!savePlan(p)) toast("Gagal menyimpan catatan."); renderPlan(false); }
  } else if (a) {
    const k = a.dataset.act;
    if (k === "mkplan") { if (savePlan(makePlan(compute(S)))) { toast("Rencana latihan dibuat."); renderPlan(); } }
    else if (k === "delplan" && confirm("Hapus rencana latihan dan semua catatannya?")) { try { localStorage.removeItem(PK); } catch (x) {} renderPlan(); }
    else if (k === "reassess") { S.done = false; S.step = 0; save(); go("analisis"); }
  }
});

