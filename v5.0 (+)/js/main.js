"use strict";
/* Titik mulai: statistik beranda dan boot aplikasi */

$("stats").innerHTML = [
  [ATT.length, "atribut dinilai"], [Q.length, "pertanyaan"],
  [ROLES.length, "peran pemain"], [ROLES.reduce((n, r) => n + r.m.length, 0), "role model pemain"]
].map(x => `<div><b>${x[0]}</b><span>${x[1]}</span></div>`).join("");
function boot() { route(); loadAll(); }
consumeHash().then(boot, boot);

