"use strict";
/* Inti: fungsi bantu, state S, dan penyimpanan jawaban */

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

