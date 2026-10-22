"use strict";
/* Mesin hitung: compute() menghasilkan peran dan posisi */

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

