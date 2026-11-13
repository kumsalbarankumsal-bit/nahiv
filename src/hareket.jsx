/* Hareket katmanı: uçan puan, açılış perdesi, sayfa geçişi, ses. */
import React, { useEffect, useState } from "react";
import { C, T } from "./cekirdek.jsx";

let sonNokta = null;
if (typeof window !== "undefined") window.addEventListener("pointerdown", (e) => { sonNokta = { x: e.clientX, y: e.clientY, t: Date.now() }; }, true);
const azHareket = () => typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let ses = null;
export function cin(dogru = true) {
  try {
    if (localStorage.getItem("nahiv:ses") === "0") return;
    ses = ses || new (window.AudioContext || window.webkitAudioContext)();
    const t = ses.currentTime;
    (dogru ? [660, 990] : [220]).forEach((hz, i) => { const o = ses.createOscillator(), g = ses.createGain(); o.type = dogru ? "sine" : "triangle"; o.frequency.value = hz;
      g.gain.setValueAtTime(0, t + i * .07); g.gain.linearRampToValueAtTime(.07, t + i * .07 + .01); g.gain.exponentialRampToValueAtTime(.0001, t + i * .07 + .28); o.connect(g); g.connect(ses.destination); o.start(t + i * .07); o.stop(t + i * .07 + .3); });
  } catch { /* ses yok */ }
}

/* Son dokunulan noktadan üst çubuktaki puan halkasına uçan damlalar */
export function puanUcur(n) {
  if (azHareket() || typeof document === "undefined") return;
  const hedef = document.getElementById("nv-puan-hedef"); if (!hedef) return;
  const h = hedef.getBoundingClientRect(), hx = h.left + 22, hy = h.top + h.height / 2;
  const b = sonNokta && Date.now() - sonNokta.t < 2500 ? sonNokta : { x: window.innerWidth / 2, y: window.innerHeight * .6 };
  const adet = Math.max(3, Math.min(9, Math.round(n / 2)));
  if (n >= 6) cin(true);
  for (let i = 0; i < adet; i++) {
    const d = document.createElement("i"), renk = [C.safran, C.altin, C.zumrut, C.erguvan, C.laciAcik][i % 5];
    d.style.cssText = `position:fixed;left:0;top:0;width:11px;height:11px;border-radius:99px;background:${renk};z-index:90;pointer-events:none;box-shadow:0 0 0 3px ${renk}33`;
    document.body.appendChild(d);
    const ax = b.x + (Math.random() - .5) * 90, ay = b.y - 40 - Math.random() * 70;
    const a = d.animate([
      { transform: `translate(${b.x}px,${b.y}px) scale(.4)`, opacity: 0 },
      { transform: `translate(${ax}px,${ay}px) scale(1.15)`, opacity: 1, offset: .28 },
      { transform: `translate(${hx}px,${hy}px) scale(.35)`, opacity: .9 }
    ], { duration: 760 + i * 55, easing: "cubic-bezier(.5,0,.2,1)", delay: i * 38 });
    a.onfinish = () => { d.remove(); if (i === adet - 1) { hedef.classList.remove("nv-zil"); void hedef.offsetWidth; hedef.classList.add("nv-zil"); } };
  }
}

export function gecis(is) {
  if (typeof document !== "undefined" && document.startViewTransition && !azHareket()) { try { document.startViewTransition(() => { is(); }); return; } catch { /* düşer */ } }
  is();
}

/* Açılış: vapur geçer, perde yukarı kalkar. Oturum başına bir kez. */
export function Acilis() {
  const [acik, setAcik] = useState(() => { try { return !sessionStorage.getItem("nahiv:acildi") && !azHareket(); } catch { return false; } });
  useEffect(() => { if (!acik) return; try { sessionStorage.setItem("nahiv:acildi", "1"); } catch { /* yok */ } const t = setTimeout(() => setAcik(false), 2100); return () => clearTimeout(t); }, [acik]);
  if (!acik) return null;
  return (
    <div aria-hidden="true" style={{ position: "fixed", inset: 0, zIndex: 100, background: C.gece, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", animation: "nvPerde .55s 1.55s cubic-bezier(.7,0,.2,1) forwards", overflow: "hidden" }}>
      <style>{`@keyframes nvPerde{to{transform:translateY(-102%);border-radius:0 0 50% 50%}}
@keyframes nvAcHarf{from{opacity:0;transform:translateY(60%) rotate(8deg)}to{opacity:1;transform:none}}
@keyframes nvAcVapur{from{transform:translateX(-60vw)}to{transform:translateX(60vw)}}
@keyframes nvAcDalga{from{background-position:0 0}to{background-position:120px 0}}`}</style>
      <div style={{ fontFamily: T.hat, fontSize: "clamp(56px, 13vw, 120px)", fontWeight: 800, letterSpacing: "-0.04em", color: "#fff", lineHeight: 1 }}>
        {"NAHİV".split("").map((h, i) => <span key={i} style={{ display: "inline-block", animation: `nvAcHarf .6s ${.1 + i * .09}s cubic-bezier(.3,1.5,.5,1) both` }}>{h}</span>)}
      </div>
      <div style={{ color: C.safran, fontWeight: 700, fontSize: 17, marginTop: 6, animation: "nvAcHarf .5s .7s both" }}>English B HL iskelesi</div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: "18%", height: 60 }}>
        <svg width="120" height="64" viewBox="0 0 124 64" style={{ position: "absolute", left: "50%", marginLeft: -60, bottom: 8, animation: "nvAcVapur 2s .1s cubic-bezier(.4,0,.3,1) both" }}>
          <rect x="62" y="6" width="13" height="18" fill={C.safran} /><rect x="62" y="6" width="13" height="5" fill="#fff" /><rect x="30" y="24" width="58" height="11" fill="#fff" /><rect x="14" y="35" width="92" height="13" fill="#fff" /><path d="M2 48 h120 l-12 15 h-98 Z" fill="#fff" /><rect x="8" y="58" width="108" height="3" fill={C.lal} />
        </svg>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 10, background: "repeating-linear-gradient(90deg,#3A5BC0 0 40px,transparent 40px 60px)", opacity: .7, animation: "nvAcDalga 1s linear infinite" }} />
      </div>
    </div>
  );
}
