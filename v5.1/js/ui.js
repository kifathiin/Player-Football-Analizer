"use strict";
/* Elemen UI umum: progress bar, toast, efek muncul */

const bar = (() => {
  let n = 0, t; const el = () => $("topbar");
  return {
    start() { if (n++) return; clearTimeout(t); el().classList.add("loading"); el().style.setProperty("--p", ".12"); setTimeout(() => el().style.setProperty("--p", ".7"), 60); },
    done() { if (!n || --n) return; t = setTimeout(() => { el().style.setProperty("--p", "1"); setTimeout(() => el().classList.remove("loading"), 400); }, 300); }
  };
})();
bar.start();
window.addEventListener("load", () => bar.done());

let tt;
function toast(m) { const t = $("toast"); t.textContent = m; t.classList.add("on"); clearTimeout(tt); tt = setTimeout(() => t.classList.remove("on"), 3600); }

function reveal() {
  const io = "IntersectionObserver" in window ? new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), {threshold: .1}) : null;
  document.querySelectorAll("[data-view]:not([hidden]) :is(.tag,h1,h2,.lead,.card,.stats div,.mod,.road li,.att,.q,.field,.sum>div,.bars .r,.note,.tools,.hero .row)").forEach((el, i) => {
    if (el.classList.contains("rv")) return;
    el.classList.add("rv"); el.style.transitionDelay = (i % 5) * 80 + "ms";
    if (io) io.observe(el); else el.classList.add("in");
  });
}

