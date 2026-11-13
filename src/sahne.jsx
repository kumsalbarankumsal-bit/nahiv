/* ══════════════════════════════════════════════════════════════════════
   Y A Ş A Y A N   B O Ğ A Z
   Tuval üzerinde canlı sahne: saate göre gök, kıyı silueti, köprü ışıkları,
   dalgalar, vapurlar, martılar. Dokunmaya yanıt verir:
   suya dokun → halka; göğe dokun → simit at, martılar kapışır;
   vapura dokun → düdük çalar, duman salar.
   ══════════════════════════════════════════════════════════════════════ */
import React, { useEffect, useRef, useState } from "react";

const TAU = Math.PI * 2;
const lerp = (a, b, t) => a + (b - a) * t;
const hex = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const karis = (a, b, t) => { const x = hex(a), y = hex(b); return `rgb(${Math.round(lerp(x[0], y[0], t))},${Math.round(lerp(x[1], y[1], t))},${Math.round(lerp(x[2], y[2], t))})`; };
const rnd = (i) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

/* saat → [göğün üstü, ufuk, su üstü, su altı, siluet, gece oranı] */
const EVRE = [
  [0, "#050B24", "#12224F", "#0E1D45", "#040A1E", "#070D24", 1],
  [5, "#1B2452", "#6A4C7C", "#3B3D73", "#0E1638", "#141A3C", .8],
  [6.5, "#5F6FB8", "#FFB27A", "#E79C78", "#2C4A86", "#33305C", .25],
  [9, "#5BA8EE", "#CFE9FF", "#7FC0EE", "#1E64B4", "#4C6E96", 0],
  [16, "#4C9BE8", "#D6ECFF", "#74B8EA", "#1A5CAE", "#486A94", 0],
  [18.5, "#3E4FA6", "#FF9A5C", "#F08A5E", "#2A3F86", "#2E2A58", .2],
  [20, "#141C4E", "#7A4A82", "#3A3672", "#0C1438", "#10153A", .75],
  [22, "#060C28", "#16285A", "#10214C", "#050B22", "#080E28", 1],
  [24, "#050B24", "#12224F", "#0E1D45", "#040A1E", "#070D24", 1]
];
export function gokRengi(saat) {
  let i = 0; while (i < EVRE.length - 2 && saat >= EVRE[i + 1][0]) i++;
  const a = EVRE[i], b = EVRE[i + 1], t = (saat - a[0]) / (b[0] - a[0]);
  return { ust: karis(a[1], b[1], t), ufuk: karis(a[2], b[2], t), su1: karis(a[3], b[3], t), su2: karis(a[4], b[4], t), siluet: karis(a[5], b[5], t), gece: lerp(a[6], b[6], t) };
}

let sesBaglam = null;
function duduk() {
  try {
    sesBaglam = sesBaglam || new (window.AudioContext || window.webkitAudioContext)();
    const c = sesBaglam, t = c.currentTime, g = c.createGain(), f = c.createBiquadFilter();
    f.type = "lowpass"; f.frequency.value = 620; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.16, t + .08); g.gain.setValueAtTime(.16, t + .75); g.gain.linearRampToValueAtTime(0, t + 1.15);
    [148, 186, 222].forEach((hz) => { const o = c.createOscillator(); o.type = "sawtooth"; o.frequency.value = hz; o.connect(f); o.start(t); o.stop(t + 1.2); });
    f.connect(g); g.connect(c.destination);
  } catch { /* ses yok */ }
}

export function Bogaz({ yukseklik = 340, sessiz, children, onMarti }) {
  const kap = useRef(null), tuval = useRef(null), durum = useRef(null);
  const [ipucu, setIpucu] = useState(true);

  useEffect(() => {
    const cv = tuval.current, kutu = kap.current; if (!cv || !kutu) return;
    const ctx = cv.getContext("2d");
    const azHareket = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let W = 0, H = 0, dpr = 1, kare = 0, gorunur = true, son = performance.now();
    const D = durum.current = {
      t: 0, isaret: null, halkalar: [], simitler: [], duman: [], sicrama: [],
      martilar: Array.from({ length: 9 }, (_, i) => ({ x: rnd(i) * 900, y: 40 + rnd(i + 9) * 90, vx: 30 + rnd(i + 3) * 30, vy: 0, f: rnd(i) * 6, b: .7 + rnd(i + 5) * .6 })),
      vapurlar: [{ x: -80, y: .80, s: 1.25, v: 26, yon: 1, hiz: 1 }, { x: 600, y: .70, s: .72, v: 15, yon: -1, hiz: 1 }, { x: 250, y: .665, s: .46, v: 9, yon: 1, hiz: 1 }],
      bulutlar: Array.from({ length: 6 }, (_, i) => ({ x: rnd(i + 20) * 1200, y: 18 + rnd(i + 30) * 90, r: 26 + rnd(i + 40) * 34, v: 4 + rnd(i + 50) * 6 }))
    };
    const boyut = () => { dpr = Math.min(2, window.devicePixelRatio || 1); W = kutu.clientWidth; H = kutu.clientHeight; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    boyut();
    const ro = new ResizeObserver(() => { boyut(); if (azHareket) ciz(0); }); ro.observe(kutu);
    const io = new IntersectionObserver(([e]) => { gorunur = e.isIntersecting; }); io.observe(kutu);

    const ufukY = () => H * .6;
    function kubbe(x, y, r) { ctx.beginPath(); ctx.arc(x, y, r, Math.PI, 0); ctx.closePath(); ctx.fill(); }
    function minare(x, y, h, w) { ctx.fillRect(x - w / 2, y - h, w, h); ctx.beginPath(); ctx.moveTo(x - w * .9, y - h); ctx.lineTo(x, y - h - w * 4.2); ctx.lineTo(x + w * .9, y - h); ctx.fill(); ctx.fillRect(x - w, y - h * .62, w * 2, w * .7); ctx.fillRect(x - w, y - h * .82, w * 2, w * .6); }
    function cami(x, y, k, minareSay) {
      ctx.fillRect(x - 44 * k, y - 20 * k, 88 * k, 20 * k); kubbe(x, y - 20 * k, 27 * k); kubbe(x - 30 * k, y - 16 * k, 13 * k); kubbe(x + 30 * k, y - 16 * k, 13 * k);
      ctx.fillRect(x - 1.2 * k, y - 54 * k, 2.4 * k, 9 * k);
      const yer = minareSay === 6 ? [-62, -50, -38, 38, 50, 62] : minareSay === 4 ? [-54, -40, 40, 54] : [-48, 48];
      yer.forEach((d, i) => minare(x + d * k, y, (minareSay === 6 && (i === 0 || i === 5) ? 46 : 60) * k, 3 * k));
    }
    function pencereler(x, y, w, h, tohum, gece) {
      if (gece < .15) return; ctx.save(); ctx.globalAlpha = Math.min(1, gece * 1.2);
      for (let i = 0; i < w / 7; i++) for (let j = 0; j < h / 8; j++) { const r = rnd(tohum + i * 13 + j * 7); if (r > .52) { ctx.fillStyle = r > .9 ? "#FFE9A8" : "#FFC76B"; ctx.globalAlpha = Math.min(1, gece) * (.5 + .5 * Math.sin(D.t * (.3 + r) + r * 40) * (r > .8 ? 1 : 0) + (r > .8 ? 0 : .45)); ctx.fillRect(x + 2 + i * 7, y + 3 + j * 8, 3, 4); } }
      ctx.restore();
    }
    function vapurCiz(v, G) {
      const y = H * v.y + Math.sin(D.t * 1.6 + v.x * .01) * 2.2 * v.s, s = v.s;
      ctx.save(); ctx.translate(v.x, y); ctx.scale(s * v.yon, s); ctx.rotate(Math.sin(D.t * 1.3 + v.s * 9) * .018);
      ctx.fillStyle = "rgba(255,255,255,.5)"; for (let i = 1; i <= 4; i++) { ctx.globalAlpha = .34 - i * .07; ctx.fillRect(-64 - i * 26, 12 + i * 1.5, 30, 2); } ctx.globalAlpha = 1;
      ctx.fillStyle = "#101B36"; ctx.beginPath(); ctx.moveTo(-58, 0); ctx.lineTo(62, 0); ctx.lineTo(50, 15); ctx.lineTo(-50, 15); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "#D7322A"; ctx.fillRect(-52, 11, 104, 3);
      ctx.fillStyle = "#FFFFFF"; ctx.fillRect(-46, -13, 92, 13); ctx.fillRect(-30, -24, 58, 11);
      ctx.fillStyle = G.gece > .3 ? "#FFD470" : "#2B4C8C"; for (let i = 0; i < 11; i++) ctx.fillRect(-42 + i * 8, -9, 5, 5); for (let i = 0; i < 6; i++) ctx.fillRect(-26 + i * 9, -21, 5, 5);
      ctx.fillStyle = "#F0A400"; ctx.fillRect(2, -40, 13, 16); ctx.fillStyle = "#101B36"; ctx.fillRect(2, -40, 13, 5);
      ctx.fillStyle = "#D7322A"; ctx.fillRect(-44, -30, 1.6, 18); ctx.beginPath(); ctx.moveTo(-42, -30); ctx.lineTo(-32, -27); ctx.lineTo(-42, -24); ctx.fill();
      ctx.restore();
      v._y = y;
      if (Math.random() < .09 * v.hiz) D.duman.push({ x: v.x + 8 * s * v.yon, y: y - 40 * s, r: 3 * s, vx: -v.yon * 6, vy: -12, a: .5 });
    }
    function martiCiz(m) {
      const k = Math.sin(m.f) * 5 * m.b, b = m.b * (W < 500 ? .8 : 1);
      ctx.beginPath(); ctx.moveTo(m.x - 9 * b, m.y - k * .5); ctx.quadraticCurveTo(m.x - 4 * b, m.y - 3 * b - k, m.x, m.y); ctx.quadraticCurveTo(m.x + 4 * b, m.y - 3 * b - k, m.x + 9 * b, m.y - k * .5); ctx.stroke();
    }

    function ciz(dt) {
      const an = new Date(), saat = an.getHours() + an.getMinutes() / 60, G = gokRengi(saat), uy = ufukY();
      D.t += dt;
      /* gök */
      let g = ctx.createLinearGradient(0, 0, 0, uy); g.addColorStop(0, G.ust); g.addColorStop(1, G.ufuk); ctx.fillStyle = g; ctx.fillRect(0, 0, W, uy + 2);
      /* yıldızlar */
      if (G.gece > .2) for (let i = 0; i < 70; i++) { const x = rnd(i) * W, y = rnd(i + 70) * uy * .85; ctx.globalAlpha = G.gece * (.35 + .65 * Math.abs(Math.sin(D.t * (.5 + rnd(i + 5)) + i))); ctx.fillStyle = "#fff"; ctx.fillRect(x, y, 1.6, 1.6); }
      ctx.globalAlpha = 1;
      /* güneş ya da ay */
      const gunduz = saat > 6 && saat < 19.5, yol = gunduz ? (saat - 6) / 13.5 : ((saat + 24 - 19.5) % 24) / 10.5;
      const gx = W * (.12 + yol * .76), gy = uy - Math.sin(yol * Math.PI) * uy * .78 - 8;
      const hale = ctx.createRadialGradient(gx, gy, 2, gx, gy, gunduz ? 90 : 60); hale.addColorStop(0, gunduz ? "rgba(255,236,170,.9)" : "rgba(220,230,255,.5)"); hale.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = hale; ctx.fillRect(gx - 95, gy - 95, 190, 190);
      ctx.fillStyle = gunduz ? "#FFF3C4" : "#F2F5FF"; ctx.beginPath(); ctx.arc(gx, gy, gunduz ? 22 : 17, 0, TAU); ctx.fill();
      if (!gunduz) { ctx.fillStyle = G.ust; ctx.beginPath(); ctx.arc(gx + 7, gy - 4, 15, 0, TAU); ctx.fill(); }
      /* bulutlar */
      ctx.fillStyle = G.gece > .5 ? "rgba(120,140,200,.16)" : "rgba(255,255,255,.72)";
      D.bulutlar.forEach((b) => { b.x += b.v * dt; if (b.x - b.r * 3 > W) b.x = -b.r * 3; ctx.beginPath(); ctx.ellipse(b.x, b.y, b.r * 1.7, b.r * .5, 0, 0, TAU); ctx.ellipse(b.x - b.r * .7, b.y + 3, b.r, b.r * .42, 0, 0, TAU); ctx.ellipse(b.x + b.r * .8, b.y + 4, b.r * 1.1, b.r * .4, 0, 0, TAU); ctx.fill(); });
      /* uzak tepeler */
      ctx.fillStyle = G.siluet; ctx.globalAlpha = .45; ctx.beginPath(); ctx.moveTo(0, uy);
      for (let x = 0; x <= W; x += 12) ctx.lineTo(x, uy - 16 - Math.sin(x * .008 + 1) * 12 - Math.sin(x * .021) * 6);
      ctx.lineTo(W, uy); ctx.fill(); ctx.globalAlpha = 1;
      /* kıyı silueti: ölçek genişliğe göre */
      const k = Math.max(.55, Math.min(1.15, W / 900)), sol = W * .04;
      ctx.fillStyle = G.siluet;
      const bina = (x, w, h, t) => { ctx.fillStyle = G.siluet; ctx.fillRect(x, uy - h, w, h); pencereler(x, uy - h, w, h, t, G.gece); ctx.fillStyle = G.siluet; };
      for (let i = 0; i < 16; i++) bina(sol + i * 54 * k + rnd(i + 3) * 10, 26 * k + rnd(i) * 22 * k, (14 + rnd(i + 7) * 26) * k, i * 31);
      cami(sol + 150 * k, uy, .95 * k, 4); cami(sol + 400 * k, uy, 1.15 * k, 6); cami(sol + 620 * k, uy - 2, .7 * k, 2);
      /* Galata Kulesi */
      const gxk = sol + 760 * k; ctx.fillRect(gxk - 11 * k, uy - 62 * k, 22 * k, 62 * k); ctx.fillRect(gxk - 14 * k, uy - 66 * k, 28 * k, 6 * k);
      ctx.beginPath(); ctx.moveTo(gxk - 13 * k, uy - 66 * k); ctx.lineTo(gxk, uy - 98 * k); ctx.lineTo(gxk + 13 * k, uy - 66 * k); ctx.fill();
      if (G.gece > .2) { ctx.fillStyle = "#FFC76B"; ctx.globalAlpha = G.gece; for (let i = -1; i <= 1; i++) ctx.fillRect(gxk + i * 6 * k - 1.5, uy - 58 * k, 3, 6 * k); ctx.globalAlpha = 1; ctx.fillStyle = G.siluet; }
      /* köprü */
      const kx1 = W * .70, kx2 = W + 40, ky = uy - 26 * k, ayak = [W * .78, W * .97];
      ctx.strokeStyle = G.siluet; ctx.lineWidth = 3 * k; ctx.beginPath(); ctx.moveTo(kx1, ky); ctx.lineTo(kx2, ky); ctx.stroke();
      ayak.forEach((a) => ctx.fillRect(a - 3 * k, uy - 78 * k, 6 * k, 78 * k));
      ctx.lineWidth = 1.6 * k; ctx.beginPath(); ctx.moveTo(kx1, ky); ctx.quadraticCurveTo((kx1 + ayak[0]) / 2, ky, ayak[0], uy - 78 * k); ctx.quadraticCurveTo((ayak[0] + ayak[1]) / 2, ky + 6 * k, ayak[1], uy - 78 * k); ctx.quadraticCurveTo(W, ky - 20 * k, kx2, ky); ctx.stroke();
      ctx.lineWidth = .7; ctx.beginPath(); for (let x = ayak[0] + 10; x < ayak[1]; x += 10 * k) { const u = (x - ayak[0]) / (ayak[1] - ayak[0]), yy = lerp(uy - 78 * k, ky + 6 * k, 4 * u * (1 - u) * 1 + 0) ; ctx.moveTo(x, ky); ctx.lineTo(x, uy - 78 * k + (ky + 6 * k - (uy - 78 * k)) * 4 * u * (1 - u)); } ctx.stroke();
      if (G.gece > .25) for (let x = kx1; x < kx2; x += 9 * k) { const f = (Math.sin(D.t * 2.2 - x * .03) + 1) / 2; ctx.fillStyle = ["#FF5E7A", "#7AA8FF", "#B58CFF"][Math.floor((D.t * .15) % 3)]; ctx.globalAlpha = G.gece * (.35 + f * .65); ctx.fillRect(x, ky - 1.5, 4, 3); }
      ctx.globalAlpha = 1;
      /* su */
      g = ctx.createLinearGradient(0, uy, 0, H); g.addColorStop(0, G.su1); g.addColorStop(1, G.su2); ctx.fillStyle = g; ctx.fillRect(0, uy, W, H - uy);
      /* ışık yolu */
      for (let i = 0; i < 26; i++) { const yy = uy + 4 + i * ((H - uy) / 26), w = (8 + i * 2.4) * (1 + .4 * Math.sin(D.t * 2 + i)); ctx.globalAlpha = (gunduz ? .5 : .32) * (1 - i / 30); ctx.fillStyle = gunduz ? "#FFF1B8" : "#DDE6FF"; ctx.fillRect(gx - w / 2 + Math.sin(D.t * 1.4 + i * .9) * 5, yy, w, 2); }
      /* dalga çizgileri */
      ctx.fillStyle = "#fff";
      for (let i = 0; i < 46; i++) { const d = rnd(i + 200), yy = uy + 6 + d * (H - uy - 8), hz = 8 + d * 26, x = ((rnd(i + 300) * W + D.t * hz) % (W + 120)) - 60; ctx.globalAlpha = .08 + d * .22; ctx.fillRect(x, yy + Math.sin(D.t * 1.7 + i) * 1.5, 14 + d * 46, 1 + d * 1.6); }
      ctx.globalAlpha = 1;
      /* Kız Kulesi */
      const zx = W * .08 + 20, zy = uy + (H - uy) * .2; ctx.fillStyle = G.siluet; ctx.fillRect(zx - 22 * k, zy - 5 * k, 44 * k, 7 * k); ctx.fillRect(zx - 9 * k, zy - 30 * k, 18 * k, 26 * k); ctx.fillRect(zx - 16 * k, zy - 14 * k, 32 * k, 10 * k);
      ctx.beginPath(); ctx.moveTo(zx - 10 * k, zy - 30 * k); ctx.lineTo(zx, zy - 46 * k); ctx.lineTo(zx + 10 * k, zy - 30 * k); ctx.fill(); ctx.fillRect(zx - .8, zy - 56 * k, 1.6, 12 * k);
      if (G.gece > .2) { ctx.fillStyle = "#FFD470"; ctx.globalAlpha = G.gece * (.6 + .4 * Math.sin(D.t * 3)); ctx.beginPath(); ctx.arc(zx, zy - 34 * k, 2.4, 0, TAU); ctx.fill(); ctx.globalAlpha = 1; }
      /* vapurlar: uzaktan yakına */
      [...D.vapurlar].sort((a, b) => a.s - b.s).forEach((v) => { v.x += v.v * v.yon * v.hiz * dt; v.hiz = lerp(v.hiz, 1, dt * .4); if (v.yon > 0 && v.x > W + 110) v.x = -110; if (v.yon < 0 && v.x < -110) v.x = W + 110; vapurCiz(v, G); });
      /* duman */
      D.duman = D.duman.filter((p) => (p.a -= dt * .16) > 0); D.duman.forEach((p) => { p.x += p.vx * dt; p.y += p.vy * dt; p.r += dt * 5; ctx.globalAlpha = p.a; ctx.fillStyle = G.gece > .5 ? "#8E9CC8" : "#F4F7FF"; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, TAU); ctx.fill(); }); ctx.globalAlpha = 1;
      /* halkalar */
      D.halkalar = D.halkalar.filter((h) => (h.a -= dt * .6) > 0); ctx.strokeStyle = "#fff"; D.halkalar.forEach((h) => { h.r += dt * 46; ctx.globalAlpha = h.a; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.ellipse(h.x, h.y, h.r, h.r * .3, 0, 0, TAU); ctx.stroke(); if (h.r > 18) { ctx.globalAlpha = h.a * .6; ctx.beginPath(); ctx.ellipse(h.x, h.y, h.r - 14, (h.r - 14) * .3, 0, 0, TAU); ctx.stroke(); } }); ctx.globalAlpha = 1;
      D.sicrama = D.sicrama.filter((p) => (p.a -= dt * 1.6) > 0); D.sicrama.forEach((p) => { p.vy += 260 * dt; p.x += p.vx * dt; p.y += p.vy * dt; ctx.globalAlpha = p.a; ctx.fillStyle = "#fff"; ctx.fillRect(p.x, p.y, 2.4, 2.4); }); ctx.globalAlpha = 1;
      /* simitler */
      D.simitler = D.simitler.filter((s) => !s.bitti); D.simitler.forEach((s) => { s.vy += 60 * dt; s.x += s.vx * dt; s.y += s.vy * dt; ctx.strokeStyle = "#C7862B"; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(s.x, s.y, 5, 0, TAU); ctx.stroke(); if (s.y > uy + 14) { s.bitti = true; D.halkalar.push({ x: s.x, y: s.y, r: 3, a: .7 }); } });
      /* martılar */
      ctx.strokeStyle = G.gece > .6 ? "#C9D6F2" : "#1A2A4A"; ctx.lineWidth = 1.8; ctx.lineCap = "round";
      D.martilar.forEach((m, i) => {
        const hedef = D.simitler[0] || D.isaret; let ax = 0, ay = 0;
        if (hedef) { const dx = hedef.x - m.x, dy = hedef.y - m.y, d = Math.hypot(dx, dy) || 1; ax = dx / d * (D.simitler[0] ? 380 : 120); ay = dy / d * (D.simitler[0] ? 380 : 120);
          if (D.simitler[0] && d < 12) { D.simitler[0].bitti = true; D.sicrama.push(...Array.from({ length: 6 }, () => ({ x: m.x, y: m.y, vx: (Math.random() - .5) * 90, vy: -Math.random() * 60, a: .9 }))); onMarti && onMarti(); } }
        else { ay = (60 + rnd(i) * 70 + Math.sin(D.t * .5 + i) * 26 - m.y) * 1.2; ax = (40 + rnd(i + 2) * 30 - m.vx) * .8; }
        m.vx = Math.max(-150, Math.min(170, m.vx + ax * dt)); m.vy = Math.max(-110, Math.min(110, (m.vy + ay * dt) * .985));
        m.x += m.vx * dt; m.y = Math.max(8, Math.min(uy + 30, m.y + m.vy * dt)); m.f += dt * (9 + Math.abs(m.vy) * .05);
        if (m.x > W + 30) m.x = -30; if (m.x < -30) m.x = W + 30; martiCiz(m);
      });
    }
    function dongu(simdi) { const dt = Math.min(.05, (simdi - son) / 1000); son = simdi; if (gorunur && !document.hidden) ciz(dt); kare = requestAnimationFrame(dongu); }
    if (azHareket) ciz(0); else kare = requestAnimationFrame(dongu);

    const yer = (e) => { const r = cv.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
    const hareket = (e) => { D.isaret = yer(e); };
    const cikis = () => { D.isaret = null; };
    const dokun = (e) => {
      const p = yer(e); setIpucu(false);
      const v = D.vapurlar.find((v) => Math.abs(p.x - v.x) < 66 * v.s && Math.abs(p.y - (v._y || 0) + 14 * v.s) < 34 * v.s);
      if (v) { v.hiz = 3.2; for (let i = 0; i < 14; i++) D.duman.push({ x: v.x + 8 * v.s * v.yon, y: v._y - 40 * v.s, r: 4 * v.s, vx: (Math.random() - .5) * 30, vy: -20 - Math.random() * 26, a: .8 }); if (!sessiz) duduk(); return; }
      if (p.y > ufukY()) { D.halkalar.push({ x: p.x, y: p.y, r: 4, a: .9 }); for (let i = 0; i < 9; i++) D.sicrama.push({ x: p.x, y: p.y, vx: (Math.random() - .5) * 130, vy: -60 - Math.random() * 90, a: 1 }); }
      else D.simitler.push({ x: p.x, y: p.y, vx: 0, vy: -30 });
    };
    cv.addEventListener("pointermove", hareket); cv.addEventListener("pointerleave", cikis); cv.addEventListener("pointerdown", dokun);
    return () => { cancelAnimationFrame(kare); ro.disconnect(); io.disconnect(); cv.removeEventListener("pointermove", hareket); cv.removeEventListener("pointerleave", cikis); cv.removeEventListener("pointerdown", dokun); };
  }, []);

  return (
    <div ref={kap} style={{ position: "relative", height: yukseklik, borderRadius: 30, overflow: "hidden", boxShadow: "0 2px 4px rgba(15,27,51,.06), 0 34px 60px -30px rgba(15,27,51,.6)", touchAction: "pan-y" }}>
      <canvas ref={tuval} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block", cursor: "pointer" }} aria-label="Yaşayan Boğaz sahnesi" />
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>{children}</div>
      {ipucu && <div style={{ position: "absolute", right: 14, bottom: 12, pointerEvents: "none", padding: "7px 13px", borderRadius: 99, background: "rgba(255,255,255,.9)", color: "#0F1B33", fontSize: 13.5, fontWeight: 700, boxShadow: "0 6px 14px -8px rgba(0,0,0,.5)" }}>Göğe dokun: simit at · Vapura dokun: düdük · Suya dokun: halka</div>}
    </div>
  );
}
