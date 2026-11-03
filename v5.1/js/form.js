"use strict";
/* Halaman Analisis: pengisian 3 langkah */

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

