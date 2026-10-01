"use strict";
/* Player Football Analyzer v3.2 */

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
  {n:"Kiper Pembangun Serangan",pos:"Kiper",w:{control:2,pass:3,calm:3,vision:2,decide:2},t:{build:2,protect:1},m:["Ederson","Manuel Neuer","Alisson Becker","Marc-Andre ter Stegen","Mike Maignan","Andre Onana"],d:"Kamu melihat kiper sebagai pemain pertama dalam membangun serangan, bukan hanya penjaga gawang."},
  {n:"Bek Penjaga Area",pos:"Bek Tengah",tall:1,w:{tackle:3,aerial:3,strength:3,read:2,calm:1},t:{protect:3},m:["Virgil van Dijk","Kalidou Koulibaly","Antonio Rudiger","Gabriel Magalhaes","Ruben Dias"],d:"Kamu menang lewat duel, sundulan, dan posisi. Fokusmu menjaga kotak penalti tetap aman."},
  {n:"Bek Pembawa Bola",pos:"Bek Tengah",w:{pass:3,control:2,calm:3,vision:2,read:2},t:{build:2,protect:1},m:["John Stones","Alessandro Bastoni","Aymeric Laporte","Josko Gvardiol","William Saliba","Pau Cubarsi"],d:"Kamu nyaman memulai serangan dari belakang dan berani membawa atau mengumpan bola melewati garis lawan."},
  {n:"Bek Sayap Menyerang",pos:"Bek Sayap",w:{speed:3,stamina:3,drib:2,pass:2,offball:1},t:{wide:3,direct:1},m:["Achraf Hakimi","Trent Alexander-Arnold","Alphonso Davies","Theo Hernandez","Andrew Robertson"],d:"Kamu naik jauh di sisi lapangan dan menjadi sumber lebar bagi timmu."},
  {n:"Bek Sayap Bertahan",pos:"Bek Sayap",w:{tackle:3,read:3,stamina:2,speed:2,strength:1},t:{protect:2,press:1,wide:1},m:["Kyle Walker","Dani Carvajal","Kieran Trippier","Ben White","Reece James"],d:"Kamu menjaga sisi lapangan dengan disiplin dan cepat pulih setelah timmu kehilangan bola."},
  {n:"Perebut Bola",pos:"Gelandang Bertahan",w:{tackle:3,read:3,stamina:2,strength:2,speed:1},t:{press:3,protect:1},m:["N'Golo Kante","Casemiro","Declan Rice","Sandro Tonali","Wilfred Ndidi","Fabinho"],d:"Kamu memutus serangan lawan lewat tekanan, duel, dan energi tanpa henti di lini tengah."},
  {n:"Pengatur Tempo",pos:"Gelandang Bertahan",w:{pass:3,vision:3,calm:3,decide:2,control:2},t:{build:3,protect:1},m:["Rodri","Sergio Busquets","Joshua Kimmich","Marco Verratti","Andrea Pirlo"],d:"Kamu mengatur ritme dari kedalaman, menjaga bola tetap mengalir, dan menutup ruang di depan bek."},
  {n:"Gelandang Pekerja Dua Arah",pos:"Gelandang Tengah",w:{stamina:3,tackle:2,offball:2,pass:2,strength:2},t:{press:2,direct:1,build:1},m:["Federico Valverde","Nicolo Barella","Alexis Mac Allister","Bruno Guimaraes","Jude Bellingham"],d:"Kamu hadir di dua kotak penalti. Energimu menghubungkan bertahan dan menyerang."},
  {n:"Pengatur Permainan",pos:"Gelandang Tengah",w:{pass:3,vision:3,decide:2,control:3,calm:2},t:{build:2,create:2},m:["Luka Modric","Toni Kroos","Xavi Hernandez","Andres Iniesta","Frenkie de Jong","Pedri"],d:"Kamu adalah pusat kendali tim. Sentuhanmu menentukan ke mana bola bergerak berikutnya."},
  {n:"Pencipta Peluang",pos:"Gelandang Serang",w:{vision:3,pass:3,decide:2,control:2,drib:2},t:{create:3,build:1},m:["Martin Odegaard","Kevin De Bruyne","Bruno Fernandes","Jamal Musiala","Florian Wirtz"],d:"Kamu bermain di ruang antar lini dan mengubah bola biasa menjadi peluang berbahaya."},
  {n:"Winger Penggiring",pos:"Winger",w:{speed:3,drib:3,control:2,offball:2,shoot:1},t:{wide:2,direct:2},m:["Vinicius Junior","Bukayo Saka","Lamine Yamal","Rafael Leao","Jeremy Doku","Mohamed Salah"],d:"Kamu mengandalkan kecepatan dan dribbling untuk membuat lawan panik satu lawan satu."},
  {n:"Penyerang Target",pos:"Penyerang",tall:1,w:{aerial:3,strength:3,finish:3,calm:2,control:1},t:{finish:3},m:["Olivier Giroud","Romelu Lukaku","Dusan Vlahovic","Ivan Toney","Alexander Sorloth"],d:"Kamu menjadi titik tumpu serangan. Bola atas, tahanan badan, dan penyelesaian di kotak penalti adalah senjatamu."},
  {n:"Penyerang Pencari Ruang",pos:"Penyerang",w:{offball:3,speed:3,finish:3,shoot:2,decide:2},t:{finish:2,direct:2},m:["Erling Haaland","Kylian Mbappe","Victor Osimhen","Jamie Vardy","Alexander Isak"],d:"Kamu hidup dari pergerakan. Kamu membaca celah di belakang bek dan tiba tepat waktu."},
  {n:"Penyerang Turun Menjemput Bola",pos:"Penyerang",w:{control:3,pass:3,vision:3,decide:2,finish:2},t:{create:2,build:1,finish:1},m:["Harry Kane","Karim Benzema","Robert Lewandowski","Roberto Firmino","Lionel Messi"],d:"Kamu turun ke tengah untuk terlibat dalam permainan, lalu membuka ruang bagi rekan yang menyerang di belakang bek."}
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
  reveal();
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
function compute(s = S) {
  const a = ATT.map(x => s.att[x[0]]);
  const avg = a.reduce((p, c) => p + c, 0) / a.length;
  const idx = {}; ATT.forEach((x, i) => idx[x[0]] = i);
  const raw = {}, max = {};
  Object.keys(TR).forEach(k => { raw[k] = 0; max[k] = 0; });
  Q.forEach((q, i) => {
    if (q.s) { for (const k in q.t) { raw[k] += q.t[k] * s.sl[i] / 10; max[k] += q.t[k]; } }
    else {
      Object.keys(TR).forEach(k => { max[k] += Math.max(0, ...q.o.map(o => o[1][k] || 0)); });
      const o = q.o[s.ans[i]];
      if (o) for (const k in o[1]) raw[k] += o[1][k];
    }
  });
  const tv = {}; for (const k in TR) tv[k] = max[k] ? raw[k] / max[k] : 0;
  const h = Number(s.height) || 170;
  const list = ROLES.map(r => {
    let sw = 0, ab = 0, dl = 0;
    for (const k in r.w) { const v = a[idx[k]]; sw += r.w[k]; ab += r.w[k] * (v - 1) / 4; dl += r.w[k] * (v - avg); }
    const attr = 0.5 * (ab / sw) + 0.5 * Math.min(1, Math.max(0, 0.5 + dl / sw / 3));
    let st = 0, tt = 0; for (const k in r.t) { st += r.t[k]; tt += r.t[k] * tv[k]; }
    const trait = tt / st;
    let adj = r.tall ? (h >= 182 ? 0.04 : h < 170 ? -0.04 : 0) : 0;
    if (s.pos && s.pos === r.pos) adj += 0.02;
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
  return `Player Football Analyzer v3.2\nNama: ${D.name || "Tanpa nama"}\nPeran utama: ${t.n} (${t.pos})\nKecocokan: ${Math.round(R.top.score * 100)} persen, keyakinan ${R.conf}\nKekuatan: ${R.strengths.map(s => s.n + " " + s.v).join(", ")}\nArea latihan: ${R.gaps.map(g => g.n).join(", ") || "tidak ada yang mendesak"}`;
}

function renderResult(snap) {
  const D = snap || S;
  const R = compute(D), t = R.top.r, pc = Math.round(R.top.score * 100);
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
    ${snap ? '<button class="btn" id="btnBack">Kembali ke riwayat</button>' : '<button class="btn" id="btnSave">Simpan ke riwayat</button>'}
    <button class="btn ghost" id="btnCopy">Salin ringkasan</button>
    <button class="btn ghost" id="btnPrint">Cetak atau simpan PDF</button>
    <button class="btn ghost" id="btnAgain">Ulangi analisis</button>
  </div>`;

  $("btnCopy").onclick = () => {
    const b = $("btnCopy");
    (navigator.clipboard ? navigator.clipboard.writeText(summaryText(R, D)) : Promise.reject())
      .then(() => { b.textContent = "Tersalin"; }, () => { b.textContent = "Gagal menyalin"; });
    setTimeout(() => { b.textContent = "Salin ringkasan"; }, 1800);
  };
  $("btnPrint").onclick = () => window.print();
  if (snap) $("btnBack").onclick = () => go("riwayat");
  else $("btnSave").onclick = () => { const b = $("btnSave"), ok = addHistory(); b.textContent = ok ? "Tersimpan di riwayat" : "Gagal menyimpan"; b.disabled = ok; };
  $("btnAgain").onclick = () => { S.done = false; S.step = 0; save(); go("analisis"); };
}

/* ---------- Riwayat ---------- */
const HK = "pfa_hist_v31", GR = ["Fisik", "Teknik", "Bertahan", "Mental"];
const POS = ["Kiper", "Bek Tengah", "Bek Sayap", "Gelandang Bertahan", "Gelandang Tengah", "Gelandang Serang", "Winger", "Penyerang"];
let viewSnap = null, hMsg = "";
const fmtDate = t => new Date(t).toLocaleDateString("id-ID", {day: "numeric", month: "short", year: "numeric"});
const loadH = () => { try { const h = JSON.parse(localStorage.getItem(HK) || "[]"); return Array.isArray(h) ? h : []; } catch (e) { return []; } };
const saveH = h => { try { localStorage.setItem(HK, JSON.stringify(h)); return true; } catch (e) { return false; } };
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
function addHistory() {
  const snap = cleanSnap({...S, date: Date.now()});
  const h = loadH(); h.push(mkEntry(snap));
  return saveH(h);
}
function exportHistory() {
  const data = {app: "Player Football Analyzer", versi: "3.2", riwayat: loadH().map(e => e.snap)};
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
  r.onload = () => {
    let list = null;
    try { const d = JSON.parse(r.result); list = Array.isArray(d) ? d : d && d.riwayat; } catch (e) {}
    if (!Array.isArray(list)) return fail("File tidak dikenali. Pilih file .json hasil ekspor dari website ini.");
    const cur = loadH(), have = new Set(cur.map(x => String(x.id))), add = [];
    list.slice(0, 500).forEach(x => { const sn = cleanSnap(x && x.snap ? x.snap : x); if (sn && !have.has(String(sn.date))) { have.add(String(sn.date)); add.push(mkEntry(sn)); } });
    if (!add.length) return fail("Tidak ada hasil baru. Semua isi file sudah ada di riwayat.");
    fail(saveH(cur.concat(add).sort((p, q) => p.id - q.id)) ? `Berhasil menambahkan ${add.length} hasil ke riwayat.` : "Gagal menyimpan. Penyimpanan browser mungkin penuh.");
  };
  r.readAsText(f);
}
function trend(h) {
  const W = 640, H = 300, L = 36, T = 16, B = 44, E = 16, n = h.length, col = ["#19e36b", "#f5f7f6", "#d9ff3d", "#5cc8ff"];
  const x = i => n === 1 ? (L + W - E) / 2 : L + (W - L - E) * i / (n - 1), y = v => T + (H - T - B) * (5 - v) / 4;
  let g = "";
  for (let v = 1; v <= 5; v++) g += `<line x1="${L}" x2="${W - E}" y1="${y(v)}" y2="${y(v)}" stroke="#1d2622"/><text x="${L - 8}" y="${y(v) + 4}" text-anchor="end">${v}</text>`;
  h.forEach((e, i) => { g += `<text x="${x(i)}" y="${H - B + 22}" text-anchor="middle">${fmtDate(e.snap.date)}</text>`; });
  GR.forEach((_, k) => {
    g += `<polyline points="${h.map((e, i) => x(i) + "," + y(e.g[k])).join(" ")}" fill="none" stroke="${col[k]}" stroke-width="2"/>` + h.map((e, i) => `<circle cx="${x(i)}" cy="${y(e.g[k])}" r="4" fill="${col[k]}"/>`).join("");
  });
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Grafik rata-rata kemampuan per kelompok dari waktu ke waktu">${g}</svg><div class="legend">${GR.map((n, k) => `<span><i style="background:${col[k]}"></i>${n}</span>`).join("")}</div>`;
}
function renderHistory() {
  const all = loadH(), b = $("historyBody");
  const tools = `<div class="tools noprint"><button class="btn ghost" data-act="export"${all.length ? "" : " disabled"}>Ekspor riwayat</button><button class="btn ghost" data-act="import">Impor riwayat</button><input type="file" id="hFile" accept=".json,application/json" hidden></div><p class="note" id="hMsg" role="status">${esc(hMsg)}</p>`;
  hMsg = "";
  if (!all.length) {
    b.innerHTML = `<p class="tag">Riwayat</p><h2>Belum ada hasil tersimpan</h2><p class="hint">Selesaikan analisis, lalu tekan Simpan ke riwayat di halaman hasil. Kalau kamu sudah punya file riwayat dari perangkat lain, impor di sini.</p><div class="row"><button class="btn" data-new="1">Mulai analisis</button></div>${tools}`;
    reveal(); return;
  }
  const first = all[0], last = all[all.length - 1], d = last.avg - first.avg;
  const note = all.length > 1 ? `Rata-rata kemampuanmu ${d >= 0 ? "naik" : "turun"} ${Math.abs(d).toFixed(2)} poin sejak ${fmtDate(first.snap.date)}.` : "Simpan satu hasil lagi setelah berlatih untuk melihat perubahan.";
  b.innerHTML = `<p class="tag">Riwayat</p><h2>Perkembanganmu dari waktu ke waktu</h2><p class="hint">${note}</p>
  <div class="card chart">${trend(all.slice(-8))}</div>
  ${tools}
  <div class="sec"><h2>Hasil tersimpan</h2><div class="hist">${[...all].reverse().map(e => `<div class="card hrow"><div><b>${fmtDate(e.snap.date)}</b><span>${esc(e.snap.name || "Tanpa nama")}</span></div><div><b>${esc(e.role)}</b><span>${esc(e.pos)}, kecocokan ${esc(e.score)} persen</span></div><div class="row"><button class="btn ghost" data-view-id="${esc(e.id)}">Lihat</button><button class="btn ghost" data-del-id="${esc(e.id)}">Hapus</button></div></div>`).join("")}</div></div>
  <div class="row noprint" style="margin-top:32px"><button class="btn" data-new="1">Analisis baru</button></div>`;
  reveal();
}
$("historyBody").addEventListener("click", e => {
  const a = e.target.closest("[data-act]"), v = e.target.closest("[data-view-id]"), d = e.target.closest("[data-del-id]"), n = e.target.closest("[data-new]");
  if (a) { if (a.dataset.act === "export") exportHistory(); else $("hFile").click(); }
  else if (v) { const f = loadH().find(x => String(x.id) === v.dataset.viewId); if (f) { viewSnap = f.snap; go("hasil"); } }
  else if (d && confirm("Hapus hasil ini dari riwayat?")) { saveH(loadH().filter(x => String(x.id) !== d.dataset.delId)); renderHistory(); }
  else if (n) { S.done = false; S.step = 0; save(); go("analisis"); }
});
$("historyBody").addEventListener("change", e => { if (e.target.id === "hFile" && e.target.files[0]) importHistory(e.target.files[0]); });

/* ---------- Efek muncul dari bawah ---------- */
function reveal() {
  const io = "IntersectionObserver" in window ? new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), {threshold: .1}) : null;
  document.querySelectorAll("[data-view]:not([hidden]) :is(.tag,h1,h2,.lead,.card,.stats div,.mod,.road li,.att,.q,.field,.sum>div,.bars .r,.note,.tools,.hero .row)").forEach((el, i) => {
    if (el.classList.contains("rv")) return;
    el.classList.add("rv"); el.style.transitionDelay = (i % 5) * 80 + "ms";
    if (io) io.observe(el); else el.classList.add("in");
  });
}

/* ---------- Navigasi ---------- */
function route() {
  let v = location.hash.replace(/^#\/?/, "") || "home";
  if (!["home", "analisis", "hasil", "riwayat"].includes(v)) v = "home";
  if (v !== "hasil") viewSnap = null;
  if (v === "hasil" && !S.done && !viewSnap) v = "analisis";
  document.querySelectorAll("[data-view]").forEach(s => { s.hidden = s.dataset.view !== v; });
  document.querySelectorAll("[data-nav]").forEach(a => a.classList.toggle("on", a.dataset.nav === v));
  if (v === "analisis") renderStep();
  if (v === "hasil") renderResult(viewSnap);
  if (v === "riwayat") renderHistory();
  window.scrollTo(0, 0);
  reveal();
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
  [ROLES.length, "peran pemain"], [ROLES.reduce((n, r) => n + r.m.length, 0), "role model pemain"]
].map(x => `<div><b>${x[0]}</b><span>${x[1]}</span></div>`).join("");
route();
