"use strict";
/* Player Football Analyzer v3.0 */

const ATT = [
  ["speed","Kecepatan","Fisik","Lari cepat saat mengejar bola atau masuk ke ruang."],
  ["stamina","Stamina","Fisik","Menjaga intensitas sampai menit terakhir."],
  ["strength","Kekuatan","Fisik","Bertahan dari benturan dan menahan lawan."],
  ["control","Kontrol bola","Teknik","Menjinakkan bola dengan baik saat ditekan."],
  ["pass","Umpan","Teknik","Ketepatan umpan pendek maupun panjang."],
  ["drib","Dribbling","Teknik","Melewati lawan dengan bola di kaki."],
  ["shoot","Tembakan","Teknik","Tenaga dan arah tembakan dari luar kotak."],
  ["finish","Penyelesaian akhir","Teknik","Tenang saat berhadapan dengan gawang."],
  ["aerial","Duel udara","Teknik","Memenangi sundulan dan bola atas."],
  ["tackle","Tekel dan duel","Bertahan","Merebut bola dari lawan secara bersih."],
  ["read","Membaca permainan","Bertahan","Menebak arah umpan dan memutus serangan."],
  ["vision","Melihat ruang","Mental","Sadar posisi rekan dan ruang kosong sebelum menerima bola."],
  ["decide","Keputusan","Mental","Memilih opsi yang tepat dalam waktu singkat."],
  ["offball","Gerakan tanpa bola","Mental","Mencari posisi yang memudahkan rekan memberi bola."],
  ["calm","Ketenangan","Mental","Tetap tenang saat ditekan atau di depan gawang."]
];

const TR = {build:"Membangun serangan",direct:"Progresi langsung",create:"Menciptakan peluang",finish:"Mengejar gol",press:"Menekan lawan",protect:"Menjaga struktur",wide:"Bermain lebar"};

const Q = [
  {q:"Kamu menerima bola di tengah lapangan dan lawan mulai mendekat. Apa yang paling sering kamu lakukan?",o:[
    ["Langsung mengoper satu atau dua sentuhan, lalu mencari ruang baru",{build:2}],
    ["Menahan bola dan memutar badan untuk membuka arah umpan",{create:2,build:1}],
    ["Membawa bola maju sendiri melewati lawan",{direct:2,create:1}],
    ["Mengirim bola jauh ke sisi lapangan",{wide:2,direct:1}]]},
  {q:"Timmu baru kehilangan bola. Apa reaksi pertamamu?",o:[
    ["Menekan pemain yang membawa bola secepat mungkin",{press:2}],
    ["Mundur ke posisi dan menjaga jarak dengan rekan",{protect:2}],
    ["Menutup jalur umpan ke pemain yang berbahaya",{protect:1,press:1}],
    ["Berlari kembali ke area sendiri untuk membantu bertahan",{protect:2,wide:1}]]},
  {q:"Saat timmu menyerang, di mana kamu paling sering berada?",o:[
    ["Di dalam atau di tepi kotak penalti",{finish:2}],
    ["Di sisi lapangan, dekat garis",{wide:2}],
    ["Di antara lini tengah dan lini serang",{create:2}],
    ["Di belakang bola, siap menutup serangan balik",{protect:2,build:1}]]},
  {q:"Kamu punya peluang menembak dari luar kotak, sementara rekan terbuka di dekat gawang.",o:[
    ["Menembak sendiri",{finish:2}],
    ["Mengoper ke rekan yang terbuka",{create:2}],
    ["Menggeser bola dulu untuk mencari posisi lebih baik",{build:1,create:1}]]},
  {q:"Bagian pertandingan mana yang paling kamu nikmati?",o:[
    ["Tekel bersih atau memutus umpan lawan",{protect:2,press:1}],
    ["Mengirim umpan yang membelah pertahanan",{create:2,direct:1}],
    ["Mencetak gol",{finish:2}],
    ["Mengatur tempo sampai tim terasa tenang",{build:2}],
    ["Melewati lawan satu lawan satu",{direct:1,wide:1,create:1}]]},
  {q:"Ke mana kamu bergerak saat tidak memegang bola dan tim sedang menyerang?",o:[
    ["Berlari ke ruang di belakang bek lawan",{direct:2,finish:1}],
    ["Turun menjemput bola ke kaki",{build:2}],
    ["Melebar untuk memberi ruang bagi rekan",{wide:2}],
    ["Tetap di posisi untuk menjaga keseimbangan tim",{protect:2}]]},
  {q:"Timmu merebut bola saat tertinggal satu gol. Apa yang kamu lakukan?",o:[
    ["Segera mencari umpan vertikal ke depan",{direct:2}],
    ["Mengamankan bola lebih dulu, lalu membangun serangan",{build:2}],
    ["Berlari maju menawarkan diri sebagai target",{finish:1,wide:1,direct:1}]]},
  {q:"Dari 10 peluang, berapa kali kamu memilih menembak sendiri?",s:1,t:{finish:2}},
  {q:"Dari 10 serangan timmu, berapa kali kamu ikut maju melewati garis bola?",s:1,t:{direct:1,create:1}},
  {q:"Dari 10 bola lepas, berapa kali kamu ikut menekan atau mengejarnya?",s:1,t:{press:2}}
];

const TIPS = {
  speed:"Sprint 20 sampai 30 meter sebanyak 6 kali, dua kali seminggu, dengan istirahat penuh antar ulangan.",
  stamina:"Lari interval 4 menit cepat dan 3 menit pelan sebanyak 4 set, dua kali seminggu.",
  strength:"Latihan squat, lunge, dan plank tiga kali seminggu, ditambah latihan berebut bola bahu ke bahu.",
  control:"Terima bola dari tembok dengan satu sentuhan, lalu arahkan ke kaki lain. Lakukan 10 menit setiap latihan.",
  pass:"Umpan pendek ke dua sasaran bergantian, lalu tambah jarak sampai 30 meter. Catat berapa yang tepat sasaran.",
  drib:"Susun lima kun dengan jarak dekat dan giring dengan kedua kaki, lalu tambahkan lawan pasif.",
  shoot:"Tembakan dari tepi kotak dengan bola bergulir, 20 kali per sesi, bidik dua sudut gawang.",
  finish:"Latihan satu lawan satu dengan kiper. Tunda sepersekian detik, lihat posisi kiper, lalu selesaikan.",
  aerial:"Latihan lompatan dengan tolakan satu kaki dan sundulan dari umpan silang, 15 ulangan.",
  tackle:"Latihan satu lawan satu bertahan. Jaga jarak, arahkan lawan ke sisi lemahnya, tekel hanya saat bola menjauh dari kaki.",
  read:"Tonton satu pertandingan dengan fokus pada satu pemain bertahan, lalu catat kapan ia memutus umpan dan mengapa.",
  vision:"Sebelum menerima bola, tengok bahu dua kali dan sebutkan posisi rekan dalam hati. Biasakan di setiap latihan.",
  decide:"Rondo empat lawan dua dengan batas dua sentuhan, supaya keputusan harus cepat.",
  offball:"Latihan gerakan lari palsu lalu berpindah ke ruang kosong. Minta rekan memberi umpan tepat saat kamu bergerak.",
  calm:"Latihan menerima bola dengan tekanan pasif lalu aktif. Tarik napas dan turunkan tempo saat panik."
};

const ROLES = [
  {n:"Kiper Pembangun Serangan",pos:"Kiper",w:{control:2,pass:3,calm:3,vision:2,decide:2},t:{build:2,protect:1},m:["Ederson","Manuel Neuer"],d:"Kamu melihat kiper sebagai pemain pertama dalam membangun serangan, bukan hanya penjaga gawang."},
  {n:"Bek Penjaga Area",pos:"Bek Tengah",tall:1,w:{tackle:3,aerial:3,strength:3,read:2,calm:1},t:{protect:3},m:["Virgil van Dijk","Kalidou Koulibaly"],d:"Kamu menang lewat duel, sundulan, dan posisi. Fokusmu menjaga kotak penalti tetap aman."},
  {n:"Bek Pembawa Bola",pos:"Bek Tengah",w:{pass:3,control:2,calm:3,vision:2,read:2},t:{build:2,protect:1},m:["John Stones","Alessandro Bastoni"],d:"Kamu nyaman memulai serangan dari belakang dan berani membawa atau mengumpan bola melewati garis lawan."},
  {n:"Bek Sayap Menyerang",pos:"Bek Sayap",w:{speed:3,stamina:3,drib:2,pass:2,offball:1},t:{wide:3,direct:1},m:["Achraf Hakimi","Trent Alexander-Arnold"],d:"Kamu naik jauh di sisi lapangan dan menjadi sumber lebar bagi timmu."},
  {n:"Bek Sayap Bertahan",pos:"Bek Sayap",w:{tackle:3,read:3,stamina:2,speed:2,strength:1},t:{protect:2,press:1,wide:1},m:["Kyle Walker","Dani Carvajal"],d:"Kamu menjaga sisi lapangan dengan disiplin dan cepat pulih setelah timmu kehilangan bola."},
  {n:"Perebut Bola",pos:"Gelandang Bertahan",w:{tackle:3,read:3,stamina:2,strength:2,speed:1},t:{press:3,protect:1},m:["N'Golo Kante","Casemiro"],d:"Kamu memutus serangan lawan lewat tekanan, duel, dan energi tanpa henti di lini tengah."},
  {n:"Pengatur Tempo",pos:"Gelandang Bertahan",w:{pass:3,vision:3,calm:3,decide:2,control:2},t:{build:3,protect:1},m:["Rodri","Sergio Busquets"],d:"Kamu mengatur ritme dari kedalaman, menjaga bola tetap mengalir, dan menutup ruang di depan bek."},
  {n:"Gelandang Pekerja Dua Arah",pos:"Gelandang Tengah",w:{stamina:3,tackle:2,offball:2,pass:2,strength:2},t:{press:2,direct:1,build:1},m:["Federico Valverde","Nicolo Barella"],d:"Kamu hadir di dua kotak penalti. Energimu menghubungkan bertahan dan menyerang."},
  {n:"Pengatur Permainan",pos:"Gelandang Tengah",w:{pass:3,vision:3,decide:2,control:3,calm:2},t:{build:2,create:2},m:["Luka Modric","Toni Kroos"],d:"Kamu adalah pusat kendali tim. Sentuhanmu menentukan ke mana bola bergerak berikutnya."},
  {n:"Pencipta Peluang",pos:"Gelandang Serang",w:{vision:3,pass:3,decide:2,control:2,drib:2},t:{create:3,build:1},m:["Martin Odegaard","Kevin De Bruyne"],d:"Kamu bermain di ruang antar lini dan mengubah bola biasa menjadi peluang berbahaya."},
  {n:"Winger Penggiring",pos:"Winger",w:{speed:3,drib:3,control:2,offball:2,shoot:1},t:{wide:2,direct:2},m:["Vinicius Junior","Bukayo Saka"],d:"Kamu mengandalkan kecepatan dan dribbling untuk membuat lawan panik satu lawan satu."},
  {n:"Penyerang Target",pos:"Penyerang",tall:1,w:{aerial:3,strength:3,finish:3,calm:2,control:1},t:{finish:3},m:["Olivier Giroud","Romelu Lukaku"],d:"Kamu menjadi titik tumpu serangan. Bola atas, tahanan badan, dan penyelesaian di kotak penalti adalah senjatamu."},
  {n:"Penyerang Pencari Ruang",pos:"Penyerang",w:{offball:3,speed:3,finish:3,shoot:2,decide:2},t:{finish:2,direct:2},m:["Erling Haaland","Kylian Mbappe"],d:"Kamu hidup dari pergerakan. Kamu membaca celah di belakang bek dan tiba tepat waktu."},
  {n:"Penyerang Turun Menjemput Bola",pos:"Penyerang",w:{control:3,pass:3,vision:3,decide:2,finish:2},t:{create:2,build:1,finish:1},m:["Harry Kane","Karim Benzema"],d:"Kamu turun ke tengah untuk terlibat dalam permainan, lalu membuka ruang bagi rekan yang menyerang di belakang bek."}
];

const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const KEY = "pfa_v3";
const STEPS = [
  {t:"Profil dasar",h:"Data ini dipakai untuk menyesuaikan hasil, terutama tinggi badan."},
  {t:"Kemampuan",h:"Nilai dirimu dari 1 (sangat lemah) sampai 5 (sangat kuat), dibandingkan dengan rekan seusia dan selevel."},
  {t:"Kebiasaan bermain",h:"Pilih jawaban yang paling sering terjadi di lapangan, bukan yang kamu inginkan."}
];

let S = {step:0,name:"",height:"",foot:"Kanan",pos:"",att:{},ans:{},sl:{},done:false};
try { Object.assign(S, JSON.parse(localStorage.getItem(KEY) || "{}")); } catch (e) {}
ATT.forEach(a => { if (!S.att[a[0]]) S.att[a[0]] = 3; });
Q.forEach((q, i) => { if (q.s && S.sl[i] == null) S.sl[i] = 5; });
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} };

/* ---------- Langkah pengisian ---------- */
function renderStep() {
  const b = $("stepBody");
  $("stepTitle").textContent = `Langkah ${S.step + 1} dari 3: ${STEPS[S.step].t}`;
  $("stepHint").textContent = STEPS[S.step].h;
  $("bar").style.width = ((S.step + 1) / 3 * 100) + "%";
  $("prev").style.visibility = S.step ? "visible" : "hidden";
  $("next").textContent = S.step === 2 ? "Analisis sekarang" : "Lanjut";
  $("err").textContent = "";
  let h = "";
  if (S.step === 0) {
    const posOpts = ["", "Kiper", "Bek Tengah", "Bek Sayap", "Gelandang Bertahan", "Gelandang Tengah", "Gelandang Serang", "Winger", "Penyerang"];
    h = `<div class="field"><label for="f_name">Nama (boleh dikosongkan)</label><input id="f_name" value="${esc(S.name)}" maxlength="30"></div>
    <div class="field"><label for="f_height">Tinggi badan (cm)</label><input id="f_height" type="number" min="140" max="210" value="${esc(S.height)}" placeholder="Contoh: 172"></div>
    <div class="field"><label for="f_foot">Kaki dominan</label><select id="f_foot">${["Kanan","Kiri","Kedua kaki"].map(x => `<option ${S.foot === x ? "selected" : ""}>${x}</option>`).join("")}</select></div>
    <div class="field"><label for="f_pos">Posisi yang biasa kamu mainkan</label><select id="f_pos">${posOpts.map(x => `<option value="${x}" ${S.pos === x ? "selected" : ""}>${x || "Belum menentu"}</option>`).join("")}</select></div>`;
  } else if (S.step === 1) {
    let last = "";
    ATT.forEach(a => {
      if (a[2] !== last) { h += `<h3 style="margin-top:28px">${a[2]}</h3>`; last = a[2]; }
      h += `<div class="att"><p>${a[1]}<small>${a[3]}</small></p><div class="seg" data-a="${a[0]}">${[1,2,3,4,5].map(n => `<button type="button" data-v="${n}" class="${S.att[a[0]] === n ? "on" : ""}">${n}</button>`).join("")}</div></div>`;
    });
  } else {
    Q.forEach((q, i) => {
      h += `<div class="q" id="q${i}"><p>${i + 1}. ${q.q}</p>`;
      if (q.s) h += `<div class="sl"><input type="range" min="0" max="10" value="${S.sl[i]}" data-s="${i}"><output>${S.sl[i]}</output></div><div class="ends"><span>Hampir tidak pernah</span><span>Hampir selalu</span></div>`;
      else h += `<div class="opts" data-q="${i}">${q.o.map((o, j) => `<button type="button" class="opt ${S.ans[i] === j ? "on" : ""}" data-o="${j}">${o[0]}</button>`).join("")}</div>`;
      h += `</div>`;
    });
  }
  b.innerHTML = h;
}

$("stepBody").addEventListener("click", e => {
  const sb = e.target.closest(".seg button");
  if (sb) {
    const id = sb.parentNode.dataset.a;
    S.att[id] = Number(sb.dataset.v);
    sb.parentNode.querySelectorAll("button").forEach(x => x.classList.toggle("on", x === sb));
    save(); return;
  }
  const ob = e.target.closest(".opt");
  if (ob) {
    const qi = ob.parentNode.dataset.q;
    S.ans[qi] = Number(ob.dataset.o);
    ob.parentNode.querySelectorAll(".opt").forEach(x => x.classList.toggle("on", x === ob));
    $("err").textContent = ""; save();
  }
});
$("stepBody").addEventListener("input", e => {
  const t = e.target;
  if (t.id === "f_name") S.name = t.value;
  else if (t.id === "f_height") S.height = t.value;
  else if (t.id === "f_foot") S.foot = t.value;
  else if (t.id === "f_pos") S.pos = t.value;
  else if (t.dataset.s != null) { S.sl[t.dataset.s] = Number(t.value); t.nextElementSibling.textContent = t.value; }
  save();
});

$("prev").addEventListener("click", () => { if (S.step > 0) { S.step--; save(); renderStep(); window.scrollTo(0, 0); } });
$("next").addEventListener("click", () => {
  const err = $("err");
  if (S.step === 0) {
    const h = Number(S.height);
    if (!h || h < 140 || h > 210) { err.textContent = "Isi tinggi badan antara 140 dan 210 cm."; return; }
  }
  if (S.step < 2) { S.step++; save(); renderStep(); window.scrollTo(0, 0); return; }
  const miss = Q.map((q, i) => (!q.s && S.ans[i] == null) ? i : -1).filter(i => i >= 0);
  if (miss.length) {
    err.textContent = `Masih ada ${miss.length} pertanyaan yang belum dijawab. Mulai dari nomor ${miss[0] + 1}.`;
    $("q" + miss[0]).scrollIntoView({behavior: "smooth", block: "center"});
    return;
  }
  S.done = true; save(); go("hasil");
});

/* ---------- Perhitungan ---------- */
function compute() {
  const a = ATT.map(x => S.att[x[0]]);
  const avg = a.reduce((p, c) => p + c, 0) / a.length;
  const idx = {}; ATT.forEach((x, i) => idx[x[0]] = i);
  const raw = {}, max = {};
  Object.keys(TR).forEach(k => { raw[k] = 0; max[k] = 0; });
  Q.forEach((q, i) => {
    if (q.s) { for (const k in q.t) { raw[k] += q.t[k] * S.sl[i] / 10; max[k] += q.t[k]; } }
    else {
      Object.keys(TR).forEach(k => { max[k] += Math.max(0, ...q.o.map(o => o[1][k] || 0)); });
      const o = q.o[S.ans[i]];
      if (o) for (const k in o[1]) raw[k] += o[1][k];
    }
  });
  const tv = {}; for (const k in TR) tv[k] = max[k] ? raw[k] / max[k] : 0;
  const h = Number(S.height) || 170;
  const list = ROLES.map(r => {
    let sw = 0, ab = 0, dl = 0;
    for (const k in r.w) { const v = a[idx[k]]; sw += r.w[k]; ab += r.w[k] * (v - 1) / 4; dl += r.w[k] * (v - avg); }
    const attr = 0.5 * (ab / sw) + 0.5 * Math.min(1, Math.max(0, 0.5 + dl / sw / 3));
    let st = 0, tt = 0; for (const k in r.t) { st += r.t[k]; tt += r.t[k] * tv[k]; }
    const trait = tt / st;
    let adj = r.tall ? (h >= 182 ? 0.04 : h < 170 ? -0.04 : 0) : 0;
    if (S.pos && S.pos === r.pos) adj += 0.02;
    return {r, attr, trait, score: Math.max(0, Math.min(1, 0.65 * attr + 0.35 * trait + adj))};
  });
  const sorted = [...list].sort((x, y) => y.score - x.score);
  const top = sorted[0], gap = top.score - sorted[1].score;
  const conf = gap >= 0.05 ? "Tinggi" : gap >= 0.02 ? "Sedang" : "Rendah";
  const pm = {}; sorted.forEach(x => { if (!pm[x.r.pos]) pm[x.r.pos] = x; });
  const wmax = Math.max(...Object.values(top.r.w));
  const gaps = Object.keys(top.r.w).map(k => {
    const v = a[idx[k]], target = Math.round(2 + 3 * top.r.w[k] / wmax);
    return {k, n: ATT[idx[k]][1], v, target, d: target - v};
  }).filter(g => g.d > 0).sort((x, y) => y.d - x.d).slice(0, 3);
  return {
    a, top, sorted, conf, gaps, h,
    positions: Object.values(pm).slice(0, 5),
    byAttr: [...list].sort((x, y) => y.attr - x.attr)[0],
    byTrait: [...list].sort((x, y) => y.trait - x.trait)[0],
    strengths: ATT.map((x, i) => ({n: x[1], v: a[i]})).sort((x, y) => y.v - x.v).slice(0, 4),
    traits: Object.keys(TR).map(k => ({n: TR[k], v: tv[k]})).sort((x, y) => y.v - x.v)
  };
}

/* ---------- Tampilan hasil ---------- */
function radar(a) {
  const N = a.length, C = 210, R = 125;
  const ang = i => -Math.PI / 2 + 2 * Math.PI * i / N;
  const pt = (i, r) => [C + r * Math.cos(ang(i)), C + r * Math.sin(ang(i))];
  let g = "";
  for (let l = 1; l <= 5; l++) g += `<polygon points="${a.map((_, i) => pt(i, R * l / 5).join(",")).join(" ")}" fill="none" stroke="#252b36"/>`;
  a.forEach((_, i) => {
    const p = pt(i, R), q = pt(i, R + 14), c = Math.cos(ang(i));
    g += `<line x1="${C}" y1="${C}" x2="${p[0]}" y2="${p[1]}" stroke="#252b36"/><text x="${q[0]}" y="${q[1] + 4}" text-anchor="${c > .3 ? "start" : c < -.3 ? "end" : "middle"}">${ATT[i][1]}</text>`;
  });
  g += `<polygon points="${a.map((v, i) => pt(i, R * v / 5).join(",")).join(" ")}" fill="rgba(184,255,106,.15)" stroke="#b8ff6a" stroke-width="2"/>`;
  return `<svg viewBox="-50 -5 520 430" role="img" aria-label="Grafik radar 15 atribut">${g}</svg>`;
}
const row = (l, p, t) => `<div class="r"><span>${l}</span><div class="t"><i style="width:${p}%"></i></div><b>${t}</b></div>`;

function summaryText(R) {
  const t = R.top.r;
  return `Player Football Analyzer v3.0\nNama: ${S.name || "Tanpa nama"}\nPeran utama: ${t.n} (${t.pos})\nKecocokan: ${Math.round(R.top.score * 100)} persen, keyakinan ${R.conf}\nKekuatan: ${R.strengths.map(s => s.n + " " + s.v).join(", ")}\nArea latihan: ${R.gaps.map(g => g.n).join(", ") || "tidak ada yang mendesak"}`;
}

function renderResult() {
  const R = compute(), t = R.top.r, pc = Math.round(R.top.score * 100);
  const groups = ["Fisik", "Teknik", "Bertahan", "Mental"].map(g => {
    const v = ATT.map((x, i) => x[2] === g ? R.a[i] : null).filter(v => v !== null);
    return [g, v.reduce((p, c) => p + c, 0) / v.length];
  });
  let cons;
  if (R.byAttr.r === R.byTrait.r) cons = `Kemampuan dan kebiasaanmu sama-sama menunjuk ke peran ${R.byAttr.r.n}. Profilmu konsisten.`;
  else if (R.byAttr.r.pos === R.byTrait.r.pos) cons = `Kemampuanmu paling dekat dengan ${R.byAttr.r.n}, sedangkan kebiasaanmu condong ke ${R.byTrait.r.n}. Keduanya ada di posisi yang sama, jadi perbedaannya hanya soal gaya.`;
  else cons = `Kemampuanmu paling dekat dengan ${R.byAttr.r.n} (${R.byAttr.r.pos}), tetapi kebiasaanmu di lapangan lebih mirip ${R.byTrait.r.n} (${R.byTrait.r.pos}). Bicarakan dengan pelatih: mungkin kamu bermain di luar kekuatan terbaikmu, atau penilaian dirimu perlu ditinjau ulang.`;
  const posNote = S.pos && S.pos !== t.pos ? `<p class="note">Kamu biasa bermain sebagai ${esc(S.pos)}, sedangkan hasil analisis menunjuk ke ${t.pos}. Bukan berarti posisimu salah, tetapi layak dicoba.</p>` : "";
  const gapHtml = R.gaps.length
    ? R.gaps.map((g, i) => `<div class="card"><h3>${i + 1}. ${g.n}</h3><p>Nilaimu ${g.v}, target untuk peran ini sekitar ${g.target}.</p><p style="margin-top:8px">${TIPS[ATT.find(x => x[1] === g.n)[0]]}</p></div>`).join("")
    : `<div class="card"><p>Tidak ada atribut penting yang tertinggal jauh dari profil ideal peran ini. Fokuskan latihan pada penerapan kekuatanmu dalam situasi pertandingan.</p></div>`;

  $("resultBody").innerHTML = `
  <p class="tag">Hasil analisis${S.name ? " untuk " + esc(S.name) : ""}</p>
  <div class="sum">
    <div>
      <p class="hint">Peran utama</p>
      <div class="big">${t.n}</div>
      <p class="hint">${t.pos}, tinggi ${R.h} cm, kaki ${esc(S.foot.toLowerCase())}</p>
      <p style="color:var(--mut);max-width:520px;margin:14px 0">${t.d}</p>
      <span class="pill">Kecocokan ${pc} persen</span><span class="pill">Keyakinan ${R.conf.toLowerCase()}</span>
      <span class="pill">Contoh gaya serupa: ${t.m.join(", ")}</span>
    </div>
    <div>${radar(R.a)}</div>
  </div>
  ${posNote}
  <div class="sec"><h2>Kelompok kemampuan</h2><div class="bars">${groups.map(g => row(g[0], g[1] * 20, g[1].toFixed(1))).join("")}</div></div>
  <div class="sec"><h2>Kecocokan posisi</h2><div class="bars">${R.positions.map(p => row(p.r.pos + " (" + p.r.n + ")", Math.round(p.score * 100), Math.round(p.score * 100))).join("")}</div></div>
  <div class="sec"><h2>Kecenderungan bermain</h2><div class="bars">${R.traits.map(x => row(x.n, Math.round(x.v * 100), Math.round(x.v * 100))).join("")}</div>
    <div class="card" style="margin-top:18px"><h3>Kemampuan dibanding kebiasaan</h3><p>${cons}</p></div></div>
  <div class="sec"><h2>Kekuatan utama</h2><div class="grid3">${R.strengths.slice(0, 3).map(s => `<div class="card"><h3>${s.n}</h3><p>Nilai ${s.v} dari 5</p></div>`).join("")}</div></div>
  <div class="sec rows"><h2>Area yang perlu dilatih</h2>${gapHtml}
    <p class="note">Susunan latihan yang disarankan: dua minggu pertama fokus pada area nomor satu, lalu gabungkan area berikutnya dalam latihan bersama tim. Nilai ulang dirimu setelah empat minggu.</p></div>
  <div class="row noprint" style="margin-top:40px">
    <button class="btn" id="btnCopy">Salin ringkasan</button>
    <button class="btn ghost" id="btnPrint">Cetak atau simpan PDF</button>
    <button class="btn ghost" id="btnAgain">Ulangi analisis</button>
  </div>`;

  $("btnCopy").onclick = () => {
    const b = $("btnCopy");
    (navigator.clipboard ? navigator.clipboard.writeText(summaryText(R)) : Promise.reject())
      .then(() => { b.textContent = "Tersalin"; }, () => { b.textContent = "Gagal menyalin"; });
    setTimeout(() => { b.textContent = "Salin ringkasan"; }, 1800);
  };
  $("btnPrint").onclick = () => window.print();
  $("btnAgain").onclick = () => { S.done = false; S.step = 0; save(); go("analisis"); };
}

/* ---------- Navigasi ---------- */
function route() {
  let v = location.hash.replace(/^#\/?/, "") || "home";
  if (!["home", "analisis", "hasil"].includes(v)) v = "home";
  if (v === "hasil" && !S.done) v = "analisis";
  document.querySelectorAll("[data-view]").forEach(s => { s.hidden = s.dataset.view !== v; });
  document.querySelectorAll("[data-nav]").forEach(a => a.classList.toggle("on", a.dataset.nav === v));
  if (v === "analisis") renderStep();
  if (v === "hasil") renderResult();
  window.scrollTo(0, 0);
}
function go(name) {
  const h = name === "home" ? "#/" : "#/" + name;
  if (location.hash === h) route(); else location.hash = h;
}
document.addEventListener("click", e => {
  const g = e.target.closest("[data-go]");
  if (g) { e.preventDefault(); go(g.dataset.go); return; }
  const s = e.target.closest("[data-scroll]");
  if (s) $(s.dataset.scroll).scrollIntoView({behavior: "smooth"});
});
window.addEventListener("hashchange", route);

$("stats").innerHTML = [
  [ATT.length, "atribut dinilai"], [Q.length, "pertanyaan"],
  [ROLES.length, "peran pemain"], [new Set(ROLES.map(r => r.pos)).size, "posisi"]
].map(x => `<div><b>${x[0]}</b><span>${x[1]}</span></div>`).join("");
route();
