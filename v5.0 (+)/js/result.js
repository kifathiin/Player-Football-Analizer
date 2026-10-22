"use strict";
/* Halaman Hasil: radar, ringkasan, ringkasan personal */

/* ---------- Tampilan hasil ---------- */
function radar(a) {
  const N = a.length, C = 210, R = 125;
  const ang = i => -Math.PI / 2 + 2 * Math.PI * i / N;
  const pt = (i, r) => [C + r * Math.cos(ang(i)), C + r * Math.sin(ang(i))];
  let g = "";
  for (let l = 1; l <= 5; l++) g += `<polygon points="${a.map((_, i) => pt(i, R * l / 5).join(",")).join(" ")}" fill="none" stroke="#1d2622"/>`;
  a.forEach((_, i) => {
    const p = pt(i, R), q = pt(i, R + 14), c = Math.cos(ang(i));
    g += `<line x1="${C}" y1="${C}" x2="${p[0]}" y2="${p[1]}" stroke="#1d2622"/><text x="${q[0]}" y="${q[1] + 4}" text-anchor="${c > .3 ? "start" : c < -.3 ? "end" : "middle"}">${ATT[i][1]}</text>`;
  });
  g += `<polygon points="${a.map((v, i) => pt(i, R * v / 5).join(",")).join(" ")}" fill="rgba(25,227,107,.15)" stroke="#19e36b" stroke-width="2"/>`;
  return `<svg viewBox="-50 -5 520 430" role="img" aria-label="Grafik radar 15 atribut">${g}</svg>`;
}
const row = (l, p, t) => `<div class="r"><span>${l}</span><div class="t"><i style="width:${p}%"></i></div><b>${t}</b></div>`;

function summaryText(R, D = S) {
  const t = R.top.r;
  return `Player Football Analyzer v5.0\nNama: ${D.name || "Tanpa nama"}\nPeran utama: ${t.n} (${t.pos})\nKecocokan: ${Math.round(R.top.score * 100)} persen, keyakinan ${R.conf}\nKekuatan: ${R.strengths.map(s => s.n + " " + s.v).join(", ")}\nArea latihan: ${R.gaps.map(g => g.n).join(", ") || "tidak ada yang mendesak"}`;
}

function renderResult(snap) {
  const D = snap || S;
  const R = compute(D), t = R.top.r, pc = Math.round(R.top.score * 100);
  const prev = !snap && H.length ? H[H.length - 1] : null;
  const groups = ["Fisik", "Teknik", "Bertahan", "Mental"].map(g => {
    const v = ATT.map((x, i) => x[2] === g ? R.a[i] : null).filter(v => v !== null);
    return [g, v.reduce((p, c) => p + c, 0) / v.length];
  });
  let cons;
  if (R.byAttr.r === R.byTrait.r) cons = `Kemampuan dan kebiasaanmu sama-sama menunjuk ke peran ${R.byAttr.r.n}. Profilmu konsisten.`;
  else if (R.byAttr.r.pos === R.byTrait.r.pos) cons = `Kemampuanmu paling dekat dengan ${R.byAttr.r.n}, sedangkan kebiasaanmu condong ke ${R.byTrait.r.n}. Keduanya ada di posisi yang sama, jadi perbedaannya hanya soal gaya.`;
  else cons = `Kemampuanmu paling dekat dengan ${R.byAttr.r.n} (${R.byAttr.r.pos}), tetapi kebiasaanmu di lapangan lebih mirip ${R.byTrait.r.n} (${R.byTrait.r.pos}). Bicarakan dengan pelatih: mungkin kamu bermain di luar kekuatan terbaikmu, atau penilaian dirimu perlu ditinjau ulang.`;
  const posNote = D.pos && D.pos !== t.pos ? `<p class="note">Kamu biasa bermain sebagai ${esc(D.pos)}, sedangkan hasil analisis menunjuk ke ${t.pos}. Bukan berarti posisimu salah, tetapi layak dicoba.</p>` : "";
  const gapHtml = R.gaps.length
    ? R.gaps.map((g, i) => `<div class="card"><h3>${i + 1}. ${g.n}</h3><p>Nilaimu ${g.v}, target untuk peran ini sekitar ${g.target}.</p><p style="margin-top:8px">${TIPS[ATT.find(x => x[1] === g.n)[0]]}</p></div>`).join("")
    : `<div class="card"><p>Tidak ada atribut penting yang tertinggal jauh dari profil ideal peran ini. Fokuskan latihan pada penerapan kekuatanmu dalam situasi pertandingan.</p></div>`;

  $("resultBody").innerHTML = `
  <p class="tag">Hasil analisis${D.name ? " untuk " + esc(D.name) : ""}${snap ? ", disimpan " + fmtDate(D.date) : ""}</p>
  <div class="sum">
    <div>
      <p class="hint">Peran utama</p>
      <div class="big">${t.n}</div>
      <p class="hint">${t.pos}, tinggi ${R.h} cm, kaki ${esc(D.foot.toLowerCase())}</p>
      <p style="color:var(--mut);max-width:520px;margin:14px 0">${t.d}</p>
      <span class="pill">Kecocokan ${pc} persen</span><span class="pill">Keyakinan ${R.conf.toLowerCase()}</span>
    </div>
    <div>${radar(R.a)}</div>
  </div>
  <div class="card pers" style="margin-top:28px"><h3>Ringkasan untukmu</h3><p>${esc(personal(R, D, prev))}</p></div>
  ${posNote}
  <div class="sec"><h2>Role model pemain</h2><p class="hint">Pemain profesional yang memainkan peran ${t.n}. Tonton cara mereka bergerak dan mengambil keputusan.</p><div class="mods">${t.m.map(m => `<div class="mod"><i></i>${esc(m)}</div>`).join("")}</div></div>
  <div class="sec"><h2>Kelompok kemampuan</h2><div class="bars">${groups.map(g => row(g[0], g[1] * 20, g[1].toFixed(1))).join("")}</div></div>
  <div class="sec"><h2>Kecocokan posisi</h2><div class="bars">${R.positions.map(p => row(p.r.pos + " (" + p.r.n + ")", Math.round(p.score * 100), Math.round(p.score * 100))).join("")}</div></div>
  <div class="sec"><h2>Kecenderungan bermain</h2><div class="bars">${R.traits.map(x => row(x.n, Math.round(x.v * 100), Math.round(x.v * 100))).join("")}</div>
    <div class="card" style="margin-top:18px"><h3>Kemampuan dibanding kebiasaan</h3><p>${cons}</p></div></div>
  <div class="sec"><h2>Kekuatan utama</h2><div class="grid3">${R.strengths.slice(0, 3).map(s => `<div class="card"><h3>${s.n}</h3><p>Nilai ${s.v} dari 5</p></div>`).join("")}</div></div>
  <div class="sec rows"><h2>Area yang perlu dilatih</h2>${gapHtml}
    <p class="note">Susunan latihan yang disarankan: dua minggu pertama fokus pada area nomor satu, lalu gabungkan area berikutnya dalam latihan bersama tim. Nilai ulang dirimu setelah empat minggu.</p></div>
  <div class="row noprint" style="margin-top:40px">
    ${snap ? '<button class="btn" id="btnBack">Kembali ke riwayat</button>' : `<button class="btn" id="btnSave">${isCloud() ? "Simpan ke akun" : "Simpan ke riwayat"}</button>`}
    ${snap || !R.gaps.length ? "" : '<button class="btn" id="btnPlan">Jadikan rencana latihan</button>'}
    <button class="btn ghost" id="btnCopy">Salin ringkasan</button>
    <button class="btn ghost" id="btnPrint">Cetak atau simpan PDF</button>
    <button class="btn ghost" id="btnAgain">Ulangi analisis</button>
  </div>`;

  $("btnCopy").onclick = () => {
    const b = $("btnCopy");
    (navigator.clipboard ? navigator.clipboard.writeText(summaryText(R, D) + "\n\n" + personal(R, D, prev)) : Promise.reject())
      .then(() => { b.textContent = "Tersalin"; }, () => { b.textContent = "Gagal menyalin"; });
    setTimeout(() => { b.textContent = "Salin ringkasan"; }, 1800);
  };
  $("btnPrint").onclick = () => window.print();
  if ($("btnPlan")) $("btnPlan").onclick = () => {
    if (loadPlan() && !confirm("Ganti rencana latihan yang sedang berjalan? Catatan lamanya akan hilang.")) return;
    if (savePlan(makePlan(R))) { toast("Rencana latihan dibuat."); go("latihan"); } else toast("Gagal menyimpan rencana.");
  };
  if (snap) $("btnBack").onclick = () => go("riwayat");
  else $("btnSave").onclick = async () => {
    const b = $("btnSave"); b.disabled = true; b.textContent = "Menyimpan...";
    const ok = await addHistory();
    b.textContent = ok ? (isCloud() ? "Tersimpan di akunmu" : "Tersimpan di riwayat") : "Gagal menyimpan"; b.disabled = ok;
    if (ok && !isCloud() && AUTH_ON) toast("Tersimpan di browser ini. Masuk ke akun agar tersimpan di server."); else if (!ok) toast("Gagal menyimpan. Coba lagi.");
  };
  $("btnAgain").onclick = () => { S.done = false; S.step = 0; save(); go("analisis"); };
}

/* ---------- Ringkasan personal ---------- */
function personal(R, D, prev) {
  const nm = D.name ? D.name.trim().split(/\s+/)[0] : "", t = R.top.r, pc = Math.round(R.top.score * 100), g = R.gaps[0], st = R.strengths;
  const conf = {Tinggi: "Hasilnya cukup jelas karena jaraknya ke peran lain lumayan lebar.", Sedang: "Hasilnya cukup meyakinkan, meski ada peran lain yang selisihnya tipis.", Rendah: "Jujur saja, beberapa peran nilainya berdekatan, jadi anggap ini arah awal dan bukan keputusan."}[R.conf];
  let s = `${nm ? "Halo " + nm + ". " : ""}Dari jawabanmu, gaya mainmu paling dekat dengan peran ${t.n} di posisi ${t.pos}, dengan kecocokan ${pc} persen. ${conf} `;
  s += `Senjata terbaikmu ada di ${st[0].n.toLowerCase()} dan ${st[1].n.toLowerCase()}. `;
  s += g ? `Hal yang paling layak digarap lebih dulu adalah ${g.n.toLowerCase()}: nilaimu ${g.v}, sedangkan peran ini biasanya butuh sekitar ${g.target}. ` : "Tidak ada atribut penting yang tertinggal jauh, jadi fokuskan latihan pada penerapan kekuatanmu saat pertandingan. ";
  if (D.pos && D.pos !== t.pos) s += `Kamu biasa bermain sebagai ${D.pos}. Coba posisi ${t.pos} di sesi latihan untuk melihat apakah terasa lebih alami. `;
  if (prev) { const d = R.a.reduce((p, c) => p + c, 0) / R.a.length - prev.avg; s += Math.abs(d) < 0.05 ? `Dibanding hasil tersimpanmu pada ${fmtDate(prev.snap.date)}, kemampuanmu relatif sama.` : `Dibanding hasil tersimpanmu pada ${fmtDate(prev.snap.date)}, rata-rata kemampuanmu ${d > 0 ? "naik" : "turun"} ${Math.abs(d).toFixed(2)} poin.`; }
  return s.trim();
}

