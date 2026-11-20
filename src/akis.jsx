/* ══════════════════════════════════════════════════════════════════════
   A K I Ş
   Uygulamadaki bütün ders bilgisini dikey, kaydırmalı, tam ekran
   kartlarla sunar. Kartlar sonsuz üretilir; gördüğün kelime birkaç kart
   sonra soru olarak geri döner; doğru seriler, altın kartlar ve seri
   kartları akışı canlı tutar. Bütün kayıtlar uygulamanın aralıklı tekrar
   ve ustalık sistemine işlenir.
   ══════════════════════════════════════════════════════════════════════ */
import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { X, Volume2, VolumeX, Star, RotateCcw, Flame, Check, Sparkles, Lightbulb, AlertTriangle, ChevronUp, Mic, Play, BookOpen, Zap } from "lucide-react";
import { C, T, KELIMELER, DURAK_META, SEVIYE_RENK, turYaz, karistir, soruKur, vurgula, seslendir, sesVar, titre, konfeti, vadesiGelenler, DUGUMLER, AILELER, ESDIZIM, TANI, dugum, gizle } from "./cekirdek.jsx";
import { HATLAR } from "./veri/index.js";
import { METIN_TURLERI, P1_OLCUT } from "./veri/sinav-metin.js";
import { P2_TIPLER, P2_DINLEME, P2_METINLER, IO_TEMA_SORU, IO_ZAMAN_KALIP, IO_BOLUMLER } from "./veri/sinav-p2io.js";
import { YUKSELT } from "./veri/yukselt.js";
import { cin, tik } from "./hareket.jsx";
import { seviyeHesap } from "./oyun.js";

/* ─── Yardımcılar ─────────────────────────────────────────────────── */

const rast = (d) => d[Math.floor(Math.random() * d.length)];
const agirlikli = (tablo) => { let r = Math.random() * tablo.reduce((t, [, w]) => t + w, 0); for (const [x, w] of tablo) { if ((r -= w) < 0) return x; } return tablo[0][0]; };
const AILE_AD = Object.fromEntries(AILELER.map((a) => [a.id, a.ad]));
const DEYIMLER = KELIMELER.filter((k) => /idm|pv/.test(k.pos) || (DURAK_META[k.durak] && DURAK_META[k.durak].hat === "dyk"));
const KURAL_DUGUM = DUGUMLER.filter((d) => d.k && d.ex && d.ex.length);
const TUZAK_DUGUM = DUGUMLER.filter((d) => d.t);
const CIFT_DUGUM = DUGUMLER.filter((d) => d.kp && d.kp.d && d.kp.y);
const EDATLAR = ["on", "in", "of", "to", "for", "with", "at", "from", "about", "by", "into", "against"];
const reKac = (x) => x.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const P2_TF = P2_METINLER.flatMap((m) => m.sorular.filter((q) => q.tip === "tf").map((q) => {
  const p = m.par.findIndex((x) => x.includes(q.g[q.gc]));
  return p >= 0 ? { m, q, p } : null;
})).filter(Boolean);
const IPUCLARI = [
  ...P1_OLCUT.flatMap((o) => o.ipucu.map((t) => ({ kaynak: `Paper 1 · Ölçüt ${o.kod}: ${o.ad}`, t }))),
  ...P2_TIPLER.flatMap((o) => o.strateji.map((t) => ({ kaynak: `Paper 2 · ${o.ad}`, t }))),
  ...P2_DINLEME.map((t) => ({ kaynak: "Paper 2 · Dinleme", t })),
  ...IO_BOLUMLER.map((b) => ({ kaynak: `Sözlü · ${b.ad}`, t: b.dikkat }))
];
const IO_SORULAR = Object.entries(IO_TEMA_SORU).flatMap(([tema, l]) => l.map((s) => ({ tema, s })));
const TEMA_AD = { kim: "Kimlikler", den: "Deneyimler", yar: "İnsan yaratıcılığı", top: "Toplumsal düzen", gez: "Gezegeni paylaşmak" };

const RENK = {
  deyim: ["#C2187A", "#6A3BD6"], kelimeSoru: ["#1D4FD7", "#0B97A8"], yukselt: ["#6A3BD6", "#F0A400"],
  gramerKural: ["#0B8F9F", "#1D4FD7"], gramerTuzak: ["#E5432F", "#F0A400"], gramerCift: ["#0C8A54", "#0B97A8"],
  taniSoru: ["#2457E6", "#6A3BD6"], esdizim: ["#0FA35E", "#E8A200"], metinKalip: ["#E2307E", "#F0A400"],
  metinSoru: ["#B8257A", "#2457E6"], sinavIpucu: ["#E5432F", "#B8257A"], ioSoru: ["#6A3BD6", "#E2307E"],
  p2: ["#0C97A8", "#2457E6"], seri: ["#F0A400", "#E5432F"]
};
const KANAL = {
  deyim: ["Deyimler ve kalıplar", "D"], kelimeSoru: ["Hatırla", "H"], yukselt: ["Yükselt", "Y"], gramerKural: ["Gramer", "G"],
  gramerTuzak: ["Türkçe tuzağı", "!"], gramerCift: ["Gramer", "G"], taniSoru: ["Gramer", "G"], esdizim: ["Eşdizim", "E"],
  metinKalip: ["Metin türleri", "M"], metinSoru: ["Metin türleri", "M"], sinavIpucu: ["Sınav masası", "S"], ioSoru: ["Sözlü provası", "IO"],
  p2: ["Paper 2 okuma", "P2"], seri: ["Seyir", "★"]
};

const FILIGRAN = { kelimeSoru: "?", yukselt: "↑", gramerKural: "§", gramerTuzak: "!", gramerCift: "?", taniSoru: "_", esdizim: "+", metinKalip: "”", metinSoru: "?", sinavIpucu: "✦", ioSoru: "”", p2: "¶", seri: "★" };
const SEKMELER = [["hepsi", "Senin için"], ["kelime", "Kelime"], ["gramer", "Gramer"], ["sinav", "Sınav"]];
const TABLO = {
  hepsi: [["kelime", 26], ["kelimeSoru", 15], ["deyim", 8], ["yukselt", 6], ["gramerKural", 7], ["gramerCift", 7], ["taniSoru", 6], ["esdizim", 5], ["gramerTuzak", 4], ["metinKalip", 5], ["metinSoru", 4], ["sinavIpucu", 4], ["ioSoru", 3], ["p2", 3]],
  kelime: [["kelime", 42], ["kelimeSoru", 26], ["deyim", 14], ["yukselt", 10], ["esdizim", 8]],
  gramer: [["gramerKural", 26], ["gramerCift", 24], ["taniSoru", 20], ["gramerTuzak", 14], ["esdizim", 16]],
  sinav: [["metinKalip", 24], ["metinSoru", 18], ["sinavIpucu", 20], ["ioSoru", 16], ["p2", 14], ["yukselt", 8]]
};
const SERI_ARALIK = 12;

/* ─── Kart üretici ────────────────────────────────────────────────── */

function ureticiKur(dag) {
  const yeniMi = (k) => !dag[k.id] || !dag[k.id].kutu;
  const odak = [];
  HATLAR.forEach((h) => h.duraklar.forEach(([id]) => odak.push(...karistir(KELIMELER.filter((k) => k.durak === id && yeniMi(k))))));
  return { vade: karistir(vadesiGelenler(dag)), odak, op: 0, rastgele: karistir(KELIMELER), rp: 0, kullan: new Set(), gosterilen: [], sorulan: new Set(), sayac: 0, icerik: 0, son: [] };
}

function kelimeSec(U, havuz) {
  for (let deneme = 0; deneme < 40; deneme++) {
    let k = null;
    const r = Math.random();
    if (!havuz && U.vade.length && r < 0.45) k = U.vade.pop();
    else if (!havuz && r < 0.8 && U.op < U.odak.length) k = U.odak[U.op++];
    else if (havuz) k = rast(havuz);
    else k = U.rastgele[U.rp++ % U.rastgele.length];
    if (k && !U.kullan.has(k.id)) { U.kullan.add(k.id); return k; }
  }
  return rast(havuz || KELIMELER);
}

function kartUret(U, filtre, dag) {
  U.sayac++;
  if (U.icerik > 0 && U.icerik % SERI_ARALIK === 0 && U.son[U.son.length - 1] !== "seri") {
    U.son.push("seri");
    return { key: "seri" + U.sayac, tur: "seri", n: U.icerik, renk: RENK.seri };
  }
  let tur;
  for (let i = 0; i < 6; i++) { tur = agirlikli(TABLO[filtre]); if (tur !== U.son[U.son.length - 1] || tur === "kelime") break; }
  if (U.icerik === 0) tur = { hepsi: "kelime", kelime: "kelime", gramer: "gramerKural", sinav: "metinKalip" }[filtre];
  /* geri çağırma: dört kart önce görülen kelime sorulur */
  const bekleyen = U.gosterilen.find((g) => U.icerik - g.n >= 4 && !U.sorulan.has(g.id));
  if (bekleyen && U.icerik > 0 && (filtre === "hepsi" || filtre === "kelime") && Math.random() < 0.45) tur = "kelimeSoru";
  U.son.push(tur); U.icerik++;
  const altin = ["kelime", "kelimeSoru", "taniSoru", "gramerCift", "deyim"].includes(tur) && Math.random() < 0.07;
  const o = { key: tur + U.sayac, tur, altin };

  if (tur === "kelime" || tur === "deyim") {
    const k = kelimeSec(U, tur === "deyim" ? DEYIMLER : null);
    U.gosterilen.push({ id: k.id, n: U.icerik });
    const m = DURAK_META[k.durak] || {};
    const es = ["#6A3BD6", "#0B97A8", "#E2307E", "#1D4FD7", "#0FA35E"][(m.hatNo || 1) % 5];
    return { ...o, k, renk: tur === "deyim" ? RENK.deyim : [m.renk || "#1D4FD7", es] };
  }
  if (tur === "kelimeSoru") {
    let k = null;
    if (bekleyen) { k = KELIMELER.find((x) => x.id === bekleyen.id); U.sorulan.add(bekleyen.id); }
    if (!k) { const bilinen = KELIMELER.filter((x) => dag[x.id] && dag[x.id].kutu > 0); k = bilinen.length > 8 && Math.random() < 0.7 ? rast(bilinen) : rast(KELIMELER); }
    const tip = rast(k.ornek && k.ornek.length < 150 ? ["trBul", "enBul", "ornekBul", "ornekBul"] : ["trBul", "enBul"]);
    return { ...o, k, soru: soruKur(tip, k, KELIMELER), geri: !!bekleyen, renk: RENK.kelimeSoru };
  }
  if (tur === "yukselt") return { ...o, y: rast(YUKSELT), renk: RENK.yukselt };
  if (tur === "gramerKural") return { ...o, d: rast(KURAL_DUGUM), renk: RENK.gramerKural };
  if (tur === "gramerTuzak") return { ...o, d: rast(TUZAK_DUGUM), renk: RENK.gramerTuzak };
  if (tur === "gramerCift") { const d = rast(CIFT_DUGUM); return { ...o, d, secenek: karistir([{ t: d.kp.d, ok: true }, { t: d.kp.y, ok: false }]), renk: RENK.gramerCift }; }
  if (tur === "taniSoru") return { ...o, q: rast(TANI), renk: RENK.taniSoru };
  if (tur === "esdizim") {
    const e = rast(ESDIZIM);
    const yanlis = karistir(EDATLAR.filter((p) => p !== e.p)).slice(0, 3);
    const re = new RegExp(`(\\b${reKac(e.e.slice(0, Math.max(3, e.e.length - 2)))}\\w*\\s+(?:\\w+\\s+){0,2}?)${reKac(e.p)}\\b`, "i");
    const cumle = re.test(e.c) ? e.c.replace(re, "$1___") : null;
    return { ...o, e, cumle, secenek: karistir([e.p, ...yanlis]), renk: RENK.esdizim };
  }
  if (tur === "metinKalip") {
    const t = rast(METIN_TURLERI), v = rast(["kalip", "kalip", "tuzak", "model", "iskelet"]);
    return { ...o, t, v, kalip: rast(t.kalip), tuzak: rast(t.tuzak), model: rast(t.model.slice(1)), renk: RENK.metinKalip };
  }
  if (tur === "metinSoru") {
    const t = rast(METIN_TURLERI), kalip = rast(t.kalip);
    const diger = karistir(METIN_TURLERI.filter((x) => x.id !== t.id && !x.kalip.includes(kalip))).slice(0, 3);
    return { ...o, t, kalip, secenek: karistir([t, ...diger]), renk: RENK.metinSoru };
  }
  if (tur === "sinavIpucu") return { ...o, ip: rast(IPUCLARI), renk: RENK.sinavIpucu };
  if (tur === "ioSoru") return { ...o, io: rast(IO_SORULAR), kalip: karistir(IO_ZAMAN_KALIP).slice(0, 3), renk: RENK.ioSoru };
  if (tur === "p2") return { ...o, p: rast(P2_TF), renk: RENK.p2 };
  return { ...o, tur: "sinavIpucu", ip: rast(IPUCLARI), renk: RENK.sinavIpucu };
}

/* ─── Küçük parçalar ──────────────────────────────────────────────── */

function Harfler({ metin }) {
  if (metin.length > 16) return metin.split(" ").map((s, i) => <span key={i} className="ak-harf" style={{ "--i": i * 2 }}>{s}&nbsp;</span>);
  return [...metin].map((h, i) => <span key={i} className="ak-harf" style={{ "--i": i }}>{h === " " ? " " : h}</span>);
}
const Isaretli = ({ metin }) => String(metin).split(/\[\[|\]\]/).map((p, i) => (i % 2 ? <mark key={i} className="ak-isaret">{p}</mark> : <span key={i}>{p}</span>));
function Rozet({ ikon: I, children, renk }) {
  return <span className="ak-rozet ak-g" style={{ "--i": 0, ...(renk ? { background: renk, color: "#10162E" } : {}) }}>{I && <I size={15} />}{children}</span>;
}
function Secenek({ t, durum, tikla, i, kalem }) {
  return (
    <button onClick={tikla} disabled={durum !== "bos"} className={`ak-sec ak-g ${durum}${kalem ? " kalem" : ""}`} style={{ "--i": 3 + i }}>
      <span className="ak-sec-harf">{durum === "dogru" ? <Check size={16} /> : durum === "yanlis" ? <X size={16} /> : "ABCD"[i]}</span>
      <span style={{ flex: 1 }}>{t}</span>
    </button>
  );
}

/* ─── Kart türleri ────────────────────────────────────────────────── */

function KelimeKart({ o, et, api }) {
  const { k } = o;
  const [acik, setAcik] = useState(false);
  const durum = api.durum[o.key];
  useEffect(() => { if (!et || acik) return; const t = setTimeout(() => setAcik(true), 4200); return () => clearTimeout(t); }, [et, acik]);
  const m = DURAK_META[k.durak] || {};
  return (
    <>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <Rozet ikon={o.tur === "deyim" ? Sparkles : BookOpen}>{o.tur === "deyim" ? "Deyim ve kalıp" : "Yeni kelime"}</Rozet>
        <span className="ak-rozet ak-g ince" style={{ "--i": 1 }}>{k.lv} · {turYaz(k.pos)}</span>
      </div>
      <h2 className="ak-bas" style={{ fontSize: `min(${k.w.length > 22 ? 52 : k.w.length > 12 ? 66 : 86}px, calc((min(100vw, 640px) - 118px) / ${(Math.max(...k.w.split(" ").map((x) => x.length)) * 0.6).toFixed(2)}))` }}><Harfler metin={k.w} /></h2>
      <div onClick={() => setAcik(true)} className={`ak-anlam ak-g${acik ? " acik" : ""}`} style={{ "--i": 4 }}>
        <span>{k.tr}</span>
        {!acik && <i className="ak-dokun">Anlamı için dokun</i>}
      </div>
      <div className="ak-ornek ak-g" style={{ "--i": 6 }}><Isaretli metin={vurgula(k.w, k.ornek)} /></div>
      {k.esdizim && <div className="ak-not ak-g" style={{ "--i": 7 }}>Birlikte: <b>{k.esdizim}</b></div>}
      {durum && <div className="ak-damga">{durum === "bildi" ? "Biliyorum" : "Tekrar listesinde"}</div>}
      <span className="ak-kanal-gizli" data-kanal={m.ad} />
    </>
  );
}

function SoruCekirdek({ o, et, api, soru, secenekler, dogruMu, cevapla, alt, kalem }) {
  const cvp = api.cevap[o.key];
  return (
    <>
      {soru}
      <div className="ak-secler">
        {secenekler.map((s, i) => {
          const d = cvp == null ? "bos" : dogruMu(s) ? "dogru" : cvp === i ? "yanlis" : "soluk";
          return <Secenek key={i} i={i} t={s.t !== undefined ? s.t : s} durum={d} kalem={kalem} tikla={() => cevapla(i, dogruMu(s))} />;
        })}
      </div>
      {cvp != null && alt && <div className="ak-aciklama">{alt}</div>}
    </>
  );
}

function KelimeSoruKart({ o, et, api }) {
  const { k, soru } = o;
  return (
    <SoruCekirdek o={o} et={et} api={api} kalem={soru.dogruId && soru.secenekler[0] && /[a-z]/.test(soru.secenekler[0].t) && soru.soru !== "Türkçe karşılığı hangisi?"}
      soru={<>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Rozet ikon={Zap}>{o.geri ? "Az önce gördün, hatırlıyor musun?" : "Hatırla"}</Rozet>
        </div>
        <div className="ak-soru ak-g" style={{ "--i": 1 }}>{soru.soru}</div>
        <div className={`ak-istem ak-g${soru.metin.length > 60 ? " uzun" : ""}`} style={{ "--i": 2 }}>{soru.metin}</div>
      </>}
      secenekler={soru.secenekler} dogruMu={(s) => s.id === soru.dogruId}
      cevapla={(i, ok) => api.cevapla(o, i, ok, () => api.kelimeKaydet(k.id, ok))}
      alt={<><b>{k.w}</b>: {k.tr}<div className="ak-ornek kucuk"><Isaretli metin={vurgula(k.w, k.ornek)} /></div></>} />
  );
}

function YukseltKart({ o, et, api }) {
  const { y } = o;
  const [acik, setAcik] = useState(false);
  const [n, setN] = useState(0);
  useEffect(() => { if (!acik || !et) return; const t = setInterval(() => setN((x) => x + 1), 1400); return () => clearInterval(t); }, [acik, et]);
  const parca = y.ornek.split(/\[|\]/);
  return (
    <>
      <Rozet ikon={Sparkles}>Yükselt</Rozet>
      <div className="ak-soru ak-g" style={{ "--i": 1 }}>Sade sözcüğü sınav sözcüğüne çevir</div>
      <div className="ak-cumle ak-g" style={{ "--i": 2 }}>
        {parca.map((p, i) => i % 2
          ? <span key={i} className="ak-yuva">
              <s className={acik ? "sil" : ""}>{p}</s>
              {acik && <b key={n} className="ak-yeni-soz">{y.guclu[n % y.guclu.length]}</b>}
            </span>
          : <span key={i}>{p}</span>)}
      </div>
      <div className="ak-not ak-g" style={{ "--i": 3 }}>{y.tr}</div>
      {!acik
        ? <button className="ak-buyuk ak-g" style={{ "--i": 4 }} onClick={() => { setAcik(true); api.odul(o, 3); titre(10); cin(true); }}><Sparkles size={20} /> Yükselt</button>
        : <div className="ak-cipler">{y.guclu.map((g, i) => <span key={g} className="ak-cip" style={{ animationDelay: `${i * 90}ms` }}>{g}</span>)}</div>}
      {acik && y.not && <div className="ak-aciklama">{y.not}</div>}
    </>
  );
}

function GramerKuralKart({ o, et, api }) {
  const { d } = o;
  const [mantik, setMantik] = useState(false);
  const ex = d.ex[0];
  return (
    <>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <Rozet ikon={Lightbulb}>Kural</Rozet>
        <span className="ak-rozet ak-g ince" style={{ "--i": 1 }}>{AILE_AD[d.a] || d.a}</span>
      </div>
      <h2 className="ak-bas orta"><Harfler metin={d.tr} /></h2>
      <div className="ak-kural ak-g" style={{ "--i": 4 }}>{d.k}</div>
      <div className="ak-ornek ak-g" style={{ "--i": 6 }}><Isaretli metin={ex.en} /></div>
      <div className="ak-not ak-g" style={{ "--i": 7 }}><Isaretli metin={ex.tr} /></div>
      {!mantik
        ? <button className="ak-hafif ak-g" style={{ "--i": 8 }} onClick={() => setMantik(true)}>Mantığını göster</button>
        : <div className="ak-aciklama">{d.m}{d.an && <><br /><br /><i>Benzetme:</i> {d.an}</>}</div>}
    </>
  );
}

function GramerTuzakKart({ o }) {
  const { d } = o;
  return (
    <>
      <Rozet ikon={AlertTriangle} renk="#FFD24D">Türkçe tuzağı</Rozet>
      <h2 className="ak-bas orta"><Harfler metin={d.tr} /></h2>
      <div className="ak-kural ak-g" style={{ "--i": 4 }}>{d.t}</div>
      {d.kp && <div className="ak-ikili ak-g" style={{ "--i": 6 }}>
        <div className="ak-yanlis-cumle"><X size={18} /> {d.kp.y}</div>
        <div className="ak-dogru-cumle"><Check size={18} /> {d.kp.d}</div>
      </div>}
    </>
  );
}

function GramerCiftKart({ o, et, api }) {
  const { d } = o;
  return (
    <SoruCekirdek o={o} et={et} api={api} kalem
      soru={<>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}><Rozet ikon={Check}>Hangisi doğru?</Rozet><span className="ak-rozet ak-g ince" style={{ "--i": 1 }}>{AILE_AD[d.a]}</span></div>
        <div className="ak-istem ak-g uzun" style={{ "--i": 2 }}>{d.tr}</div>
      </>}
      secenekler={o.secenek} dogruMu={(s) => s.ok}
      cevapla={(i, ok) => api.cevapla(o, i, ok, () => api.ustalikKaydet(d.id, ok, 2))}
      alt={d.kp.f} />
  );
}

function TaniKart({ o, et, api }) {
  const { q } = o;
  const dd = dugum(q.d);
  const cvp = api.cevap[o.key];
  const parca = q.s.split("___");
  return (
    <SoruCekirdek o={o} et={et} api={api} kalem
      soru={<>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}><Rozet ikon={Zap}>Boşluğu doldur</Rozet>{dd && <span className="ak-rozet ak-g ince" style={{ "--i": 1 }}>{dd.tr}</span>}</div>
        <div className="ak-cumle ak-g" style={{ "--i": 2 }}>
          {parca[0]}<span className={`ak-bosluk${cvp != null ? " dolu" : ""}`}>{cvp != null ? (q.o[q.c] === "—" ? "∅" : q.o[q.c]) : "____"}</span>{parca[1]}
        </div>
      </>}
      secenekler={q.o} dogruMu={(s) => s === q.o[q.c]}
      cevapla={(i, ok) => api.cevapla(o, i, ok, () => {
        if (dd) api.ustalikKaydet(dd.id, ok, 1);
        if (!ok && dd) api.hataEkle({ hataliMetin: q.s.replace("___", `[${q.o[i]}]`), dogruMetin: q.s.replace("___", `[${q.o[q.c]}]`), dugumId: dd.id, dugumAdi: dd.tr, aile: dd.a,
          hataTuru: "yanlis-secim", l1Kaynakli: (dd.l1 || 0) >= 2, l1Aciklama: dd.t || null, maliyet: Math.min(5, 2 + (dd.l1 || 0)), kaynak: "akış", baglam: "Akış", aciklama: dd.k || null });
      })}
      alt={dd ? dd.k : null} />
  );
}

function EsdizimKart({ o, et, api }) {
  const { e } = o;
  return (
    <SoruCekirdek o={o} et={et} api={api} kalem
      soru={<>
        <Rozet ikon={Sparkles}>Eşdizim</Rozet>
        <div className="ak-istem ak-g" style={{ "--i": 1, fontSize: "clamp(40px,8vw,64px)" }}>{e.e} <span className="ak-bosluk">___</span></div>
        <div className="ak-not ak-g" style={{ "--i": 2 }}>{e.t}</div>
        {o.cumle && <div className="ak-ornek ak-g" style={{ "--i": 3 }}>{o.cumle}</div>}
      </>}
      secenekler={o.secenek} dogruMu={(s) => s === e.p}
      cevapla={(i, ok) => api.cevapla(o, i, ok)}
      alt={<><b>{e.e} {e.p}</b>: {e.t}{e.tuzak ? <><br />{e.tuzak}</> : null}</>} />
  );
}

function MetinKalipKart({ o }) {
  const { t, v } = o;
  return (
    <>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <Rozet ikon={BookOpen}>{v === "kalip" ? "Hazır kalıp" : v === "tuzak" ? "Puan kaybettiren tuzak" : v === "model" ? "Model cümle" : "İskelet"}</Rozet>
        <span className="ak-rozet ak-g ince" style={{ "--i": 1 }}>{t.ad} · {t.en}</span>
      </div>
      {v === "kalip" && <>
        <div className="ak-istem ak-g kalem" style={{ "--i": 2 }}>“{o.kalip}”</div>
        <div className="ak-not ak-g" style={{ "--i": 4 }}>{t.ad} için. Kime: {t.kitle.toLocaleLowerCase("tr")}. Üslup: {t.uslup.toLocaleLowerCase("tr")}.</div>
      </>}
      {v === "tuzak" && <div className="ak-kural ak-g" style={{ "--i": 2 }}>{o.tuzak}</div>}
      {v === "model" && <>
        <div className="ak-ornek ak-g buyuk" style={{ "--i": 2 }}>{o.model[0]}</div>
        <div className="ak-islev ak-g" style={{ "--i": 4 }}>({o.model[1]})</div>
      </>}
      {v === "iskelet" && <ol className="ak-liste">
        {t.yapi.map((y, i) => <li key={i} className="ak-g" style={{ "--i": 2 + i }}><span>{i + 1}</span>{y}</li>)}
      </ol>}
    </>
  );
}

function MetinSoruKart({ o, et, api }) {
  return (
    <SoruCekirdek o={o} et={et} api={api}
      soru={<>
        <Rozet ikon={BookOpen}>Hangi metin türü?</Rozet>
        <div className="ak-soru ak-g" style={{ "--i": 1 }}>Bu kalıp en çok hangi türde kullanılır?</div>
        <div className="ak-istem ak-g kalem uzun" style={{ "--i": 2 }}>“{o.kalip}”</div>
      </>}
      secenekler={o.secenek.map((t) => ({ t: `${t.ad} (${t.en})`, id: t.id }))} dogruMu={(s) => s.id === o.t.id}
      cevapla={(i, ok) => api.cevapla(o, i, ok)}
      alt={`${o.t.ad}: ${o.t.amac}.`} />
  );
}

function IpucuKart({ o }) {
  return (
    <>
      <Rozet ikon={Lightbulb}>Sınav taktiği</Rozet>
      <div className="ak-not ak-g" style={{ "--i": 1, marginTop: 4 }}>{o.ip.kaynak}</div>
      <div className="ak-ipucu ak-g" style={{ "--i": 2 }}>{o.ip.t}</div>
    </>
  );
}

function IoKart({ o, et, api }) {
  const [basla, setBasla] = useState(0);
  const [bitti, setBitti] = useState(false);
  useEffect(() => { if (et && api.ses) { const t = setTimeout(() => seslendir(o.io.s, 0.92), 500); return () => clearTimeout(t); } }, [et]);
  useEffect(() => { if (!et) { setBasla(0); setBitti(false); } }, [et]);
  return (
    <>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}><Rozet ikon={Mic}>Sözlü provası</Rozet><span className="ak-rozet ak-g ince" style={{ "--i": 1 }}>{TEMA_AD[o.io.tema]}</span></div>
      <div className="ak-istem ak-g uzun" style={{ "--i": 2 }}>{o.io.s}</div>
      <div className="ak-not ak-g" style={{ "--i": 3 }}>Altmış saniye konuş: görüş, gerekçe, örnek, karşı görüş.</div>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 18 }} className="ak-g" >
        <button className="ak-sayac" onClick={() => { if (!basla) { setBasla(Date.now()); titre(8); } }} aria-label="Altmış saniyelik konuşmayı başlat">
          <svg width="96" height="96" viewBox="0 0 96 96">
            <circle cx="48" cy="48" r="42" fill="none" stroke="rgba(255,255,255,.18)" strokeWidth="7" />
            {basla > 0 && <circle key={basla} cx="48" cy="48" r="42" fill="none" stroke={bitti ? "#7FF0C9" : "#FFD24D"} strokeWidth="7" strokeLinecap="round" transform="rotate(-90 48 48)"
              className="ak-halka" onAnimationEnd={() => { setBitti(true); api.odul(o, 15); konfeti(70); titre(20); }} />}
          </svg>
          <span>{!basla ? <Play size={28} fill="currentColor" /> : bitti ? <Check size={30} /> : <Mic size={28} />}</span>
        </button>
        <div className="ak-cipler sol">{o.kalip.map((k) => <span key={k} className="ak-cip kucuk">{k}</span>)}</div>
      </div>
    </>
  );
}

function P2Kart({ o, et, api }) {
  const { m, q, p } = o.p;
  const cvp = api.cevap[o.key];
  const kanit = q.g[q.gc];
  const par = m.par[p];
  const i = par.indexOf(kanit);
  return (
    <>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}><Rozet ikon={BookOpen}>Paper 2 · okuma</Rozet><span className="ak-rozet ak-g ince" style={{ "--i": 1 }}>{m.baslik}</span></div>
      <div className="ak-paragraf ak-g" style={{ "--i": 2 }}>
        {cvp == null ? par : <>{par.slice(0, i)}<mark className="ak-isaret">{kanit}</mark>{par.slice(i + kanit.length)}</>}
      </div>
      <div className="ak-soru ak-g" style={{ "--i": 3, marginTop: 14 }}>{q.s}</div>
      <div className="ak-secler ikili">
        {[true, false].map((d, n) => {
          const durum = cvp == null ? "bos" : d === q.c ? "dogru" : cvp === n ? "yanlis" : "soluk";
          return <Secenek key={n} i={n} t={d ? "True" : "False"} durum={durum} tikla={() => api.cevapla(o, n, d === q.c)} />;
        })}
      </div>
      {cvp != null && <div className="ak-aciklama">Gerekçe sınavda kelimesi kelimesine yazılır: “{kanit}”</div>}
    </>
  );
}

function SeriKart({ o, et, api }) {
  const s = api.oturum;
  const sv = seviyeHesap(api.xp);
  const vurdu = useRef(false);
  useEffect(() => { if (et && !vurdu.current) { vurdu.current = true; konfeti(120); titre(24); cin(true); } }, [et]);
  const oran = s.soru ? Math.round((s.dogru / s.soru) * 100) : null;
  return (
    <div style={{ textAlign: "center" }}>
      <div className="ak-g" style={{ "--i": 0, display: "flex", justifyContent: "center" }}><span className="ak-kupa"><Star size={44} fill="currentColor" /></span></div>
      <h2 className="ak-bas orta" style={{ textAlign: "center" }}><Harfler metin={`${o.n} kart geride kaldı`} /></h2>
      <div className="ak-istatistik ak-g" style={{ "--i": 6 }}>
        <div><b>{s.soru}</b><span>soru</span></div>
        <div><b>{oran == null ? "–" : `%${oran}`}</b><span>doğru</span></div>
        <div><b>{s.enIyiSeri}</b><span>en uzun seri</span></div>
        <div><b>+{s.puan}</b><span>puan</span></div>
      </div>
      <div className="ak-not ak-g" style={{ "--i": 8, marginTop: 18 }}>{sv.sonraki ? `${sv.no}. iskele ${sv.ad}. ${sv.sonraki} iskelesine ${sv.kalan} puan kaldı.` : "Son iskeledesin: Anadolu Kavağı."}</div>
      <div className="ak-ilerle ak-g" style={{ "--i": 9 }}><span style={{ width: `${sv.oran}%` }} /></div>
    </div>
  );
}

const KARTLAR = { kelime: KelimeKart, deyim: KelimeKart, kelimeSoru: KelimeSoruKart, yukselt: YukseltKart, gramerKural: GramerKuralKart, gramerTuzak: GramerTuzakKart,
  gramerCift: GramerCiftKart, taniSoru: TaniKart, esdizim: EsdizimKart, metinKalip: MetinKalipKart, metinSoru: MetinSoruKart, sinavIpucu: IpucuKart, ioSoru: IoKart, p2: P2Kart, seri: SeriKart };

/* ─── Slayt ───────────────────────────────────────────────────────── */

function Slayt({ o, et, yakin, api, ilk }) {
  const sonDokunma = useRef({ t: 0, x: 0, y: 0 });
  const [patlamalar, setPatlamalar] = useState([]);
  const Kart = KARTLAR[o.tur];
  const kelimeMi = o.tur === "kelime" || o.tur === "deyim";
  const durum = api.durum[o.key];
  const kanal = kelimeMi ? (DURAK_META[o.k.durak] || {}) : null;
  const hat = kelimeMi ? HATLAR.find((h) => h.id === kanal.hat) : null;
  const [kanalAd, kanalHarf] = kelimeMi ? [kanal.ad || "Dağarcık", hat ? String(hat.no) : "K"] : KANAL[o.tur] || ["NAHİV", "N"];

  const patlat = (x, y, renk) => { const id = Date.now() + Math.random(); setPatlamalar((p) => [...p, { id, x, y, renk }]); setTimeout(() => setPatlamalar((p) => p.filter((z) => z.id !== id)), 1100); };
  const bildim = (x, y) => {
    if (kelimeMi && !durum) { api.kelimeKaydet(o.k.id, true); api.durumYaz(o.key, "bildi"); api.odul(o, 0); }
    else if (!kelimeMi && !durum) { api.durumYaz(o.key, "anladi"); api.odul(o, 2); }
    patlat(x, y, "#FFD24D"); titre(12); cin(true);
  };
  const ust = (e) => {
    if (e.target.closest("button, .ak-anlam")) return;
    const s = sonDokunma.current, now = Date.now();
    const r = e.currentTarget.getBoundingClientRect();
    if (now - s.t < 300 && Math.hypot(e.clientX - s.x, e.clientY - s.y) < 40) { bildim(e.clientX - r.left, e.clientY - r.top); s.t = 0; }
    else sonDokunma.current = { t: now, x: e.clientX, y: e.clientY };
  };

  return (
    <section className={`ak-slayt${et ? " et" : ""}${o.altin ? " altin" : ""}`} style={{ "--a": o.renk[0], "--b": o.renk[1] }}>
      <div className="ak-zemin" />
      <div className="ak-filigran" aria-hidden="true">{kelimeMi ? o.k.w[0].toUpperCase() : FILIGRAN[o.tur] || "N"}</div>
      <div className="ak-tane" />
      {yakin && (
        <div className="ak-ic" onPointerUp={ust}>
          {o.altin && <div className="ak-altin-rozet"><Star size={14} fill="currentColor" /> Altın kart · 3 kat puan</div>}
          <div className="ak-govde"><Kart o={o} et={et} api={api} /></div>

          <div className="ak-ray">
            {kelimeMi ? <>
              <button className={durum === "bildi" ? "on" : ""} onClick={(e) => { const r = e.currentTarget.closest(".ak-ic").getBoundingClientRect(); bildim(r.width / 2, r.height / 2); }} aria-label="Biliyorum">
                <span><Star size={26} fill={durum === "bildi" ? "currentColor" : "none"} /></span><i>Biliyorum</i></button>
              <button className={durum === "tekrar" ? "on mavi" : ""} onClick={() => { if (!durum) { api.kelimeKaydet(o.k.id, false); api.durumYaz(o.key, "tekrar"); titre(6); } }} aria-label="Tekrar listesine ekle">
                <span><RotateCcw size={24} /></span><i>Tekrar</i></button>
              {sesVar() && <button onClick={() => seslendir(o.k.w)} aria-label="Dinle"><span><Volume2 size={24} /></span><i>Dinle</i></button>}
            </> : o.tur !== "seri" && <>
              <button className={durum === "anladi" ? "on" : ""} onClick={(e) => { const r = e.currentTarget.closest(".ak-ic").getBoundingClientRect(); bildim(r.width / 2, r.height / 2); }} aria-label="Anladım">
                <span><Check size={26} /></span><i>Anladım</i></button>
              {sesVar() && ["gramerKural", "gramerTuzak", "metinKalip", "ioSoru", "p2"].includes(o.tur) && <button onClick={() => seslendir(
                o.tur === "gramerKural" ? o.d.ex[0].en.replace(/\[\[|\]\]/g, "") : o.tur === "gramerTuzak" ? (o.d.kp ? o.d.kp.d : o.d.tr) : o.tur === "metinKalip" ? (o.v === "model" ? o.model[0] : o.kalip) : o.tur === "ioSoru" ? o.io.s : o.p.m.par[o.p.p], 0.92)} aria-label="Dinle">
                <span><Volume2 size={24} /></span><i>Dinle</i></button>}
            </>}
          </div>

          <div className="ak-kanal">
            <span className="ak-avatar" style={{ background: kelimeMi ? kanal.renk : o.renk[0] }}>{kanalHarf}</span>
            <span><b>{kanalAd}</b><small>{kelimeMi ? `${hat ? hat.ad : ""}` : "NAHİV akışı"}</small></span>
          </div>
          {kelimeMi && !durum && <div className="ak-sure"><span /></div>}
          {ilk && <div className="ak-kaydir-ipucu"><ChevronUp size={26} /><ChevronUp size={26} /><span>Yukarı kaydır</span></div>}
          {patlamalar.map((p) => (
            <span key={p.id} className="ak-patlama" style={{ left: p.x, top: p.y }}>
              <Star size={110} fill={p.renk} color={p.renk} />
              {Array.from({ length: 10 }, (_, i) => <i key={i} style={{ "--a": `${i * 36}deg`, background: i % 2 ? "#FFD24D" : "#fff" }} />)}
            </span>
          ))}
        </div>
      )}
    </section>
  );
}

/* ─── Ana bileşen ─────────────────────────────────────────────────── */

export function Akis({ dag, oyun, kelimeKaydet, ustalikKaydet, hataEkle, puanVer, kapat }) {
  const [filtre, setFiltre] = useState(() => { try { return localStorage.getItem("nahiv:akis-filtre") || "hepsi"; } catch { return "hepsi"; } });
  const [ses, setSes] = useState(() => { try { return localStorage.getItem("nahiv:akis-ses") !== "0"; } catch { return true; } });
  const dagRef = useRef(dag); dagRef.current = dag;
  const U = useRef(null);
  const [ogeler, setOgeler] = useState([]);
  const [aktif, setAktif] = useState(0);
  const [durum, setDurum] = useState({});
  const [cevap, setCevap] = useState({});
  const [seri, setSeri] = useState(0);
  const [afis, setAfis] = useState(null);
  const [kaydirdi, setKaydirdi] = useState(false);
  const oturum = useRef({ soru: 0, dogru: 0, enIyiSeri: 0, puan: 0 });
  const kutu = useRef(null);
  const raf = useRef(0);

  const doldur = useCallback((n, sifirla, f) => {
    if (sifirla || !U.current) U.current = ureticiKur(dagRef.current);
    const yeni = Array.from({ length: n }, () => kartUret(U.current, f, dagRef.current));
    setOgeler((e) => (sifirla ? yeni : [...e, ...yeni]));
  }, []);
  useEffect(() => { doldur(10, true, filtre); }, []);
  useEffect(() => { try { localStorage.setItem("nahiv:akis-ses", ses ? "1" : "0"); localStorage.setItem("nahiv:akis-filtre", filtre); } catch { /* yok */ } }, [ses, filtre]);
  useEffect(() => { if (aktif >= ogeler.length - 5 && ogeler.length) doldur(8, false, filtre); }, [aktif, ogeler.length]);
  useEffect(() => { const e = document.body.style.overflow; document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = e; try { window.speechSynthesis.cancel(); } catch { /* yok */ } }; }, []);

  /* etkin kart değişince: ses ve hafif titreşim */
  useEffect(() => {
    const o = ogeler[aktif]; if (!o) return;
    if (aktif > 0) { setKaydirdi(true); titre(4); if (ses) tik(); }
    if (ses && (o.tur === "kelime" || o.tur === "deyim")) { const t = setTimeout(() => seslendir(o.k.w), 380); return () => clearTimeout(t); }
  }, [aktif, ogeler.length > 0]);

  const kaydir = () => {
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => { const el = kutu.current; if (!el) return; const i = Math.round(el.scrollTop / el.clientHeight); if (i !== aktif) setAktif(i); });
  };
  const git = (y) => { const el = kutu.current; if (el) el.scrollTo({ top: Math.max(0, aktif + y) * el.clientHeight, behavior: "smooth" }); };
  useEffect(() => {
    const f = (e) => {
      if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === "j") { e.preventDefault(); git(1); }
      else if (e.key === "ArrowUp" || e.key === "PageUp" || e.key === "k") { e.preventDefault(); git(-1); }
      else if (e.key === "Escape") kapat();
    };
    window.addEventListener("keydown", f); return () => window.removeEventListener("keydown", f);
  });
  const filtreDegis = (f) => {
    if (f === filtre) { git(-aktif); return; }
    setFiltre(f); setAktif(0); setDurum({}); setCevap({});
    if (kutu.current) kutu.current.scrollTo({ top: 0 });
    doldur(10, true, f);
  };

  const odul = useCallback((o, taban) => {
    const n = taban + (o.altin ? Math.max(10, taban * 2) : 0);
    if (n > 0) { puanVer(n); oturum.current.puan += n; }
  }, [puanVer]);

  const api = {
    durum, cevap, ses, xp: oyun.xp, oturum: oturum.current,
    durumYaz: (k, v) => setDurum((d) => ({ ...d, [k]: v })),
    kelimeKaydet: (id, ok) => { kelimeKaydet(id, ok); oturum.current.puan += ok ? 10 : 2; },
    ustalikKaydet: (id, ok, b) => { ustalikKaydet(id, ok, b); oturum.current.puan += ok ? 6 : 1; },
    hataEkle, odul,
    cevapla: (o, i, ok, kaydet) => {
      if (cevap[o.key] != null) return;
      setCevap((c) => ({ ...c, [o.key]: i }));
      const s = oturum.current; s.soru++;
      if (ok) {
        s.dogru++;
        const yeni = seri + 1; setSeri(yeni); s.enIyiSeri = Math.max(s.enIyiSeri, yeni);
        titre(14); cin(true);
        if ([3, 5, 10, 15, 20, 30].includes(yeni)) { setAfis({ n: yeni, k: Date.now() }); if (yeni >= 10) konfeti(130); }
      } else { setSeri(0); titre([30, 40, 30]); cin(false); }
      if (kaydet) kaydet(); else { puanVer(ok ? 6 : 1); s.puan += ok ? 6 : 1; }
      if (o.altin && ok) odul(o, 0);
    }
  };
  useEffect(() => { if (!afis) return; const t = setTimeout(() => setAfis(null), 1600); return () => clearTimeout(t); }, [afis]);

  return createPortal(
    <div className="ak-kok" role="dialog" aria-label="Akış">
      <style>{AKIS_STIL}</style>
      <div ref={kutu} className="ak-kaydir" onScroll={kaydir}>
        {ogeler.map((o, i) => <Slayt key={o.key} o={o} et={i === aktif} yakin={Math.abs(i - aktif) <= 2} api={api} ilk={i === 0 && !kaydirdi} />)}
      </div>

      <div className="ak-ust">
        <button className="ak-yuvarlak" onClick={kapat} aria-label="Akıştan çık"><X size={22} /></button>
        <nav className="ak-sekmeler">
          {SEKMELER.map(([id, ad]) => <button key={id} className={filtre === id ? "et" : ""} onClick={() => filtreDegis(id)}>{ad}</button>)}
        </nav>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {seri > 1 && <span key={seri} className="ak-seri"><Flame size={17} /> {seri}</span>}
          <span id="nv-puan-hedef-akis" className="ak-xp">{oyun.xp}<small>puan</small></span>
          {sesVar() && <button className="ak-yuvarlak" onClick={() => setSes(!ses)} aria-label={ses ? "Sesi kapat" : "Sesi aç"}>{ses ? <Volume2 size={20} /> : <VolumeX size={20} />}</button>}
        </div>
      </div>

      {afis && <div key={afis.k} className="ak-afis"><Flame size={40} /><b>{afis.n}</b><span>üst üste doğru</span></div>}
    </div>,
    document.body
  );
}

/* ─── Stil ────────────────────────────────────────────────────────── */

const AKIS_STIL = `
.ak-kok{position:fixed;inset:0;z-index:85;background:#060A18;color:#F4F6FB;font-family:${T.govde};animation:akAc .45s cubic-bezier(.2,.9,.2,1) both;-webkit-font-smoothing:antialiased}
@keyframes akAc{from{opacity:0;transform:scale(1.04)}to{opacity:1;transform:none}}
.ak-kaydir{position:absolute;inset:0;overflow-y:auto;overflow-x:hidden;scroll-snap-type:y mandatory;overscroll-behavior:contain;scrollbar-width:none}
.ak-kaydir::-webkit-scrollbar{display:none}
.ak-slayt{position:relative;height:100%;scroll-snap-align:start;scroll-snap-stop:always;overflow:hidden;display:flex;justify-content:center}
.ak-zemin{position:absolute;inset:-12%;pointer-events:none;
  background:radial-gradient(62% 52% at 16% 20%,color-mix(in srgb,var(--a) 92%,#fff 8%),transparent 72%),
    radial-gradient(60% 54% at 88% 80%,color-mix(in srgb,var(--b) 90%,#fff 6%),transparent 72%),
    radial-gradient(44% 36% at 80% 12%,color-mix(in srgb,var(--b) 55%,transparent),transparent 72%),
    radial-gradient(50% 44% at 8% 94%,color-mix(in srgb,var(--a) 50%,transparent),transparent 72%),
    radial-gradient(70% 60% at 50% 50%,color-mix(in srgb,var(--a) 22%,#0A0F26),#0A0F26 80%);
  animation:akZemin 16s ease-in-out infinite alternate;animation-play-state:paused;will-change:transform}
.ak-filigran{position:absolute;right:-6vw;top:50%;transform:translateY(-50%);font-family:${T.hat};font-weight:800;font-size:min(78vh,92vw);line-height:.8;color:transparent;
  -webkit-text-stroke:2px rgba(255,255,255,.09);pointer-events:none;user-select:none;animation:akFiligran 22s ease-in-out infinite alternate;animation-play-state:paused}
.ak-slayt.et .ak-filigran{animation-play-state:running}
@keyframes akFiligran{from{transform:translateY(-52%) rotate(-4deg)}to{transform:translateY(-46%) rotate(5deg) scale(1.06)}}
.ak-slayt.et .ak-zemin{animation-play-state:running}
@keyframes akZemin{0%{transform:translate3d(-4%,-3%,0) scale(1.04) rotate(-2deg)}100%{transform:translate3d(4%,3%,0) scale(1.16) rotate(5deg)}}
.ak-tane{position:absolute;inset:0;pointer-events:none;opacity:.07;background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)' opacity='.6'/%3E%3C/svg%3E")}
.ak-slayt::after{content:"";position:absolute;inset:0;pointer-events:none;background:linear-gradient(180deg,rgba(6,10,24,.5) 0%,rgba(6,10,24,0) 16%,rgba(6,10,24,.08) 50%,rgba(6,10,24,.62) 100%)}
.ak-ic{position:relative;z-index:1;width:min(100%,640px);height:100%;padding:96px 92px 118px 26px;display:flex;flex-direction:column;justify-content:center;touch-action:pan-y;user-select:none;-webkit-user-select:none}
@supports (animation-timeline: view()){
  .ak-ic{animation:akDerin linear both;animation-timeline:view();animation-range:cover 0% cover 100%}
  @keyframes akDerin{0%{transform:translateY(14%) scale(.9);opacity:.15}50%{transform:none;opacity:1}100%{transform:translateY(-14%) scale(.9);opacity:.15}}
}
.ak-govde{display:flex;flex-direction:column;gap:14px;max-height:100%;overflow:visible}
.ak-g{opacity:.45;transform:translateY(16px) scale(.985)}
.ak-slayt.et .ak-g{animation:akGir .75s cubic-bezier(.2,.95,.2,1) forwards;animation-delay:calc(var(--i,0) * 70ms + 60ms)}
@keyframes akGir{to{opacity:1;transform:none}}
.ak-harf{display:inline-block;opacity:.3;transform:translateY(.28em) rotate(4deg)}
.ak-slayt.et .ak-harf{animation:akHarf .7s cubic-bezier(.2,1.5,.4,1) forwards;animation-delay:calc(var(--i) * 34ms + 140ms)}
@keyframes akHarf{to{opacity:1;transform:none}}
.ak-bas{margin:6px 0 2px;font-family:${T.hat};font-weight:800;letter-spacing:-.045em;line-height:.98;text-shadow:0 10px 40px rgba(0,0,0,.35);overflow-wrap:break-word}
.ak-bas.orta{font-size:clamp(30px,5.6vw,44px);letter-spacing:-.03em;line-height:1.08}
.ak-rozet{align-self:flex-start;display:inline-flex;align-items:center;gap:7px;padding:7px 13px;border-radius:99px;background:rgba(255,255,255,.14);border:1px solid rgba(255,255,255,.2);font-size:14px;font-weight:750;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px)}
.ak-rozet.ince{background:transparent;font-weight:650;color:rgba(244,246,251,.82)}
.ak-anlam{position:relative;align-self:flex-start;font-family:${T.hat};font-size:clamp(24px,4.4vw,32px);font-weight:760;letter-spacing:-.015em;color:#FFE7A3;cursor:pointer;line-height:1.2}
.ak-anlam>span{display:inline-block;filter:blur(14px);transition:filter .6s cubic-bezier(.2,.9,.2,1),transform .6s;transform:scale(.96)}
.ak-anlam.acik>span{filter:none;transform:none}
.ak-dokun{position:absolute;left:0;top:50%;transform:translateY(-50%);font-style:normal;font-family:${T.govde};font-size:14.5px;font-weight:750;color:#fff;padding:8px 14px;border-radius:99px;background:rgba(255,255,255,.16);border:1px solid rgba(255,255,255,.3);white-space:nowrap;animation:akNabiz 1.8s ease-in-out infinite}
@keyframes akNabiz{0%,100%{box-shadow:0 0 0 0 rgba(255,255,255,.35)}60%{box-shadow:0 0 0 12px rgba(255,255,255,0)}}
.ak-ornek{font-family:${T.kalem};font-size:clamp(17px,2.6vw,20px);line-height:1.65;color:rgba(244,246,251,.94)}
.ak-ornek.kucuk{font-size:16px;margin-top:8px}
.ak-ornek.buyuk{font-size:clamp(19px,3vw,24px)}
.ak-isaret{color:#fff;font-weight:700;background-color:transparent;background-image:linear-gradient(transparent 55%,rgba(255,210,77,.6) 55%);background-repeat:no-repeat;background-size:0% 100%;border-radius:2px;padding:0 2px}
.ak-slayt.et .ak-isaret{animation:akSupur .9s .75s cubic-bezier(.6,0,.2,1) forwards}
@keyframes akSupur{to{background-size:100% 100%}}
.ak-not{font-size:16px;line-height:1.55;color:rgba(244,246,251,.82)}
.ak-not b{color:#fff;font-family:${T.kalem}}
.ak-kural{font-size:clamp(18px,2.8vw,22px);line-height:1.55;font-weight:600;color:#fff;padding:16px 18px;border-radius:20px;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.16)}
.ak-ipucu{font-family:${T.hat};font-size:clamp(26px,4.8vw,38px);font-weight:760;line-height:1.22;letter-spacing:-.02em}
.ak-soru{font-size:16px;font-weight:750;color:rgba(244,246,251,.85)}
.ak-istem{font-family:${T.hat};font-size:clamp(34px,6.6vw,54px);font-weight:800;letter-spacing:-.035em;line-height:1.05}
.ak-istem.uzun{font-size:clamp(22px,3.8vw,30px);letter-spacing:-.015em;line-height:1.3}
.ak-istem.kalem{font-family:${T.kalem};letter-spacing:-.01em}
.ak-cumle{font-family:${T.kalem};font-size:clamp(20px,3.4vw,26px);line-height:1.6}
.ak-bosluk{display:inline-block;min-width:3.2em;text-align:center;padding:0 8px;margin:0 3px;border-bottom:3px solid #FFD24D;color:#FFD24D;font-weight:700}
.ak-bosluk.dolu{border-color:#7FF0C9;color:#7FF0C9;animation:akDol .5s cubic-bezier(.2,1.6,.4,1)}
@keyframes akDol{from{transform:scale(.6);opacity:0}}
.ak-yuva{position:relative;display:inline-flex;flex-direction:column;align-items:center;vertical-align:bottom;margin:0 3px}
.ak-yuva s{text-decoration:none;color:#FFD24D;font-weight:700;transition:color .4s}
.ak-yuva s.sil{color:rgba(255,255,255,.45);text-decoration:line-through;text-decoration-thickness:3px;text-decoration-color:#FF6A5C;font-size:.75em}
.ak-yeni-soz{display:block;color:#7FF0C9;font-weight:800;animation:akSoz .5s cubic-bezier(.2,1.4,.4,1) both}
@keyframes akSoz{from{opacity:0;transform:translateY(60%) scale(.8);filter:blur(4px)}to{opacity:1;transform:none;filter:none}}
.ak-secler{display:grid;gap:10px;margin-top:10px}
.ak-secler.ikili{grid-template-columns:1fr 1fr}
.ak-sec{display:flex;align-items:center;gap:12px;text-align:left;padding:13px 16px;min-height:56px;border-radius:18px;border:1.5px solid rgba(255,255,255,.22);background:rgba(255,255,255,.1);color:#fff;font-size:17px;font-weight:650;cursor:pointer;transition:background .25s,border-color .25s,transform .2s}
.ak-sec.kalem{font-family:${T.kalem};font-size:16.5px}
.ak-sec:active{transform:scale(.97)}
.ak-sec-harf{flex-shrink:0;width:30px;height:30px;border-radius:10px;background:rgba(255,255,255,.16);display:flex;align-items:center;justify-content:center;font-size:13.5px;font-weight:800}
.ak-sec.dogru{background:rgba(16,190,120,.32);border-color:#7FF0C9;animation:akDogru .55s cubic-bezier(.2,1.5,.4,1)}
.ak-sec.dogru .ak-sec-harf{background:#18C383}
.ak-sec.yanlis{background:rgba(255,80,80,.28);border-color:#FF8A80;animation:akSars .45s}
.ak-sec.yanlis .ak-sec-harf{background:#FF5A50}
.ak-sec.soluk{opacity:.4}
@keyframes akDogru{0%{transform:scale(1)}35%{transform:scale(1.04);box-shadow:0 0 0 0 rgba(127,240,201,.6)}100%{transform:none;box-shadow:0 0 0 18px rgba(127,240,201,0)}}
@keyframes akSars{0%,100%{transform:none}20%{transform:translateX(-9px)}40%{transform:translateX(9px)}60%{transform:translateX(-5px)}80%{transform:translateX(5px)}}
.ak-aciklama{font-size:16px;line-height:1.55;color:rgba(244,246,251,.92);padding:14px 16px;border-radius:18px;background:rgba(6,10,24,.38);border:1px solid rgba(255,255,255,.14);animation:akAlt .5s cubic-bezier(.2,.9,.2,1) both}
.ak-aciklama b{font-family:${T.kalem};color:#FFE7A3}
@keyframes akAlt{from{opacity:0;transform:translateY(14px)}}
.ak-buyuk{align-self:flex-start;display:inline-flex;align-items:center;gap:10px;padding:14px 24px;min-height:54px;border-radius:99px;border:none;background:#fff;color:#10162E;font-size:18px;font-weight:800;cursor:pointer;box-shadow:0 16px 30px -14px rgba(0,0,0,.6)}
.ak-buyuk:active{transform:scale(.96)}
.ak-hafif{align-self:flex-start;padding:10px 18px;min-height:44px;border-radius:99px;border:1.5px solid rgba(255,255,255,.3);background:transparent;color:#fff;font-size:15.5px;font-weight:750;cursor:pointer}
.ak-cipler{display:flex;flex-wrap:wrap;gap:8px}
.ak-cipler.sol{flex:1}
.ak-cip{padding:9px 15px;border-radius:99px;background:rgba(127,240,201,.18);border:1px solid rgba(127,240,201,.5);color:#C9FFEA;font-family:${T.kalem};font-size:16px;font-weight:700;animation:akSoz .5s cubic-bezier(.2,1.4,.4,1) both}
.ak-cip.kucuk{font-size:13.5px;background:rgba(255,255,255,.1);border-color:rgba(255,255,255,.2);color:#fff;font-family:${T.govde};font-weight:600}
.ak-ikili{display:grid;gap:8px}
.ak-yanlis-cumle,.ak-dogru-cumle{display:flex;gap:10px;align-items:flex-start;padding:12px 14px;border-radius:16px;font-family:${T.kalem};font-size:16.5px;line-height:1.5}
.ak-yanlis-cumle{background:rgba(255,80,80,.18);color:#FFD0CC;text-decoration:line-through;text-decoration-color:rgba(255,138,128,.8)}
.ak-dogru-cumle{background:rgba(16,190,120,.2);color:#D6FFF0}
.ak-yanlis-cumle svg,.ak-dogru-cumle svg{flex-shrink:0;margin-top:3px}
.ak-islev{font-size:16px;font-weight:700;color:#FFE7A3}
.ak-liste{list-style:none;margin:0;padding:0;display:grid;gap:9px}
.ak-liste li{display:flex;gap:12px;align-items:flex-start;font-size:17px;line-height:1.45}
.ak-liste li span{flex-shrink:0;width:30px;height:30px;border-radius:10px;background:rgba(255,255,255,.16);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:14px}
.ak-paragraf{font-size:clamp(16.5px,2.4vw,18.5px);line-height:1.7;padding:16px 18px;border-radius:20px;background:rgba(6,10,24,.32);border:1px solid rgba(255,255,255,.14)}
.ak-paragraf .ak-isaret{background-size:100% 100%}
.ak-sayac{position:relative;width:96px;height:96px;border:none;background:transparent;color:#fff;cursor:pointer;flex-shrink:0;padding:0}
.ak-sayac svg{position:absolute;inset:0}
.ak-sayac>span{position:absolute;inset:14px;border-radius:99px;background:rgba(255,255,255,.14);display:flex;align-items:center;justify-content:center}
.ak-halka{stroke-dasharray:263.9;stroke-dashoffset:263.9;animation:akHalka 60s linear forwards}
@keyframes akHalka{to{stroke-dashoffset:0}}
.ak-kupa{width:92px;height:92px;border-radius:30px;background:linear-gradient(150deg,#FFE27A,#F0A400);color:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 18px 40px -12px rgba(240,164,0,.8);animation:akKupa 2.4s ease-in-out infinite}
@keyframes akKupa{0%,100%{transform:rotate(-6deg) scale(1)}50%{transform:rotate(6deg) scale(1.06)}}
.ak-istatistik{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:20px}
.ak-istatistik div{padding:14px 6px;border-radius:18px;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.18)}
.ak-istatistik b{display:block;font-family:${T.hat};font-size:26px;font-weight:800}
.ak-istatistik span{font-size:13px;color:rgba(244,246,251,.8)}
.ak-ilerle{height:10px;border-radius:99px;background:rgba(255,255,255,.16);overflow:hidden;margin-top:12px}
.ak-ilerle span{display:block;height:100%;border-radius:99px;background:linear-gradient(90deg,#FFE27A,#F0A400)}
.ak-ray{position:absolute;right:14px;bottom:126px;display:flex;flex-direction:column;gap:16px;z-index:3}
.ak-ray button{display:flex;flex-direction:column;align-items:center;gap:5px;border:none;background:transparent;color:#fff;cursor:pointer;padding:0}
.ak-ray button span{width:54px;height:54px;border-radius:99px;background:rgba(255,255,255,.16);border:1px solid rgba(255,255,255,.22);display:flex;align-items:center;justify-content:center;backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);transition:transform .25s cubic-bezier(.2,1.6,.4,1),background .25s,color .25s}
.ak-ray button:active span{transform:scale(.82)}
.ak-ray button i{font-style:normal;font-size:12.5px;font-weight:750;text-shadow:0 1px 6px rgba(0,0,0,.5)}
.ak-ray button.on span{background:#FFD24D;color:#5A3A00;border-color:#FFD24D;animation:akZip .5s cubic-bezier(.2,1.6,.4,1)}
.ak-ray button.on.mavi span{background:#8FB0FF;color:#0B1A4A;border-color:#8FB0FF}
@keyframes akZip{0%{transform:scale(.6)}60%{transform:scale(1.2)}100%{transform:none}}
.ak-kanal{position:absolute;left:26px;bottom:44px;display:flex;align-items:center;gap:10px;z-index:3}
.ak-kanal b{display:block;font-size:15.5px}
.ak-kanal small{display:block;font-size:13px;color:rgba(244,246,251,.75)}
.ak-avatar{width:40px;height:40px;border-radius:99px;display:flex;align-items:center;justify-content:center;font-family:${T.hat};font-weight:800;font-size:15px;color:#fff;border:2px solid rgba(255,255,255,.85);box-shadow:0 0 0 3px rgba(255,255,255,.12)}
.ak-sure{position:absolute;left:0;right:0;bottom:0;height:4px;background:rgba(255,255,255,.14);z-index:3}
.ak-sure span{display:block;height:100%;width:0;background:#fff}
.ak-slayt.et .ak-sure span{animation:akSure 4.2s linear forwards}
@keyframes akSure{to{width:100%}}
.ak-damga{position:absolute;right:92px;top:110px;padding:8px 16px;border:3px solid #FFD24D;color:#FFD24D;border-radius:12px;font-family:${T.hat};font-weight:800;font-size:18px;transform:rotate(-10deg);animation:akDamga .45s cubic-bezier(.2,1.6,.4,1) both}
@keyframes akDamga{from{transform:rotate(-10deg) scale(2.2);opacity:0}}
.ak-kaydir-ipucu{position:absolute;left:0;right:0;bottom:96px;display:flex;flex-direction:column;align-items:center;gap:0;color:#fff;font-weight:750;font-size:14.5px;pointer-events:none;animation:akIpucu 1.6s ease-in-out infinite}
.ak-kaydir-ipucu svg:first-child{margin-bottom:-14px;opacity:.55}
@keyframes akIpucu{0%,100%{transform:translateY(0);opacity:.75}50%{transform:translateY(-12px);opacity:1}}
.ak-patlama{position:absolute;z-index:6;pointer-events:none;width:0;height:0}
.ak-patlama svg{position:absolute;left:-55px;top:-55px;filter:drop-shadow(0 10px 24px rgba(255,180,0,.6));animation:akPat 1s cubic-bezier(.2,1.2,.3,1) forwards}
.ak-patlama i{position:absolute;left:-5px;top:-5px;width:10px;height:10px;border-radius:99px;animation:akKivilcim .8s cubic-bezier(.2,.8,.3,1) forwards}
@keyframes akPat{0%{transform:scale(0) rotate(-35deg);opacity:1}18%{transform:scale(1.25) rotate(8deg)}32%{transform:scale(1) rotate(0)}75%{opacity:1;transform:translateY(-6px)}100%{opacity:0;transform:translateY(-70px) scale(.7)}}
@keyframes akKivilcim{0%{transform:rotate(var(--a)) translateY(0) scale(1);opacity:1}100%{transform:rotate(var(--a)) translateY(-120px) scale(.2);opacity:0}}
.ak-slayt.altin .ak-ic::before{content:"";position:absolute;inset:78px 10px 90px;border-radius:30px;padding:3px;background:conic-gradient(from var(--aci,0deg),#FFE27A,#F0A400,#fff4c2,#F0A400,#FFE27A);
  -webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude;animation:akAltin 3s linear infinite;opacity:.9;pointer-events:none}
@property --aci{syntax:"<angle>";initial-value:0deg;inherits:false}
@keyframes akAltin{to{--aci:360deg}}
.ak-altin-rozet{position:absolute;top:92px;left:50%;transform:translateX(-50%);z-index:4;display:inline-flex;align-items:center;gap:6px;padding:6px 14px;border-radius:99px;background:linear-gradient(90deg,#FFE27A,#F0A400);color:#4A2E00;font-weight:800;font-size:13.5px;white-space:nowrap;box-shadow:0 8px 20px -8px rgba(240,164,0,.9)}
.ak-ust{position:absolute;left:0;right:0;top:0;z-index:10;display:flex;align-items:center;gap:12px;padding:14px 16px;pointer-events:none}
.ak-ust>*{pointer-events:auto}
.ak-yuvarlak{width:46px;height:46px;border-radius:99px;border:1px solid rgba(255,255,255,.22);background:rgba(10,16,36,.42);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0}
.ak-sekmeler{flex:1;display:flex;justify-content:center;gap:4px;overflow-x:auto;scrollbar-width:none}
.ak-sekmeler::-webkit-scrollbar{display:none}
.ak-sekmeler button{position:relative;padding:10px 12px;border:none;background:transparent;color:rgba(255,255,255,.6);font-size:16px;font-weight:750;cursor:pointer;white-space:nowrap;transition:color .25s;text-shadow:0 1px 8px rgba(0,0,0,.4)}
.ak-sekmeler button::after{content:"";position:absolute;left:30%;right:30%;bottom:3px;height:3px;border-radius:3px;background:#fff;transform:scaleX(0);transition:transform .35s cubic-bezier(.2,1.4,.4,1)}
.ak-sekmeler button.et{color:#fff}
.ak-sekmeler button.et::after{transform:scaleX(1)}
.ak-xp{display:inline-flex;align-items:baseline;gap:4px;padding:10px 14px;border-radius:99px;background:rgba(10,16,36,.42);border:1px solid rgba(255,255,255,.22);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);font-weight:800;font-size:15.5px}
.ak-xp small{font-size:12.5px;font-weight:600;opacity:.75}
.ak-seri{display:inline-flex;align-items:center;gap:5px;padding:10px 13px;border-radius:99px;background:linear-gradient(90deg,#FF7A45,#FF3D6E);font-weight:800;font-size:15.5px;animation:akZip .45s cubic-bezier(.2,1.6,.4,1)}
.ak-afis{position:absolute;left:50%;top:40%;z-index:20;transform:translate(-50%,-50%);display:flex;flex-direction:column;align-items:center;padding:22px 34px;border-radius:30px;background:linear-gradient(150deg,#FF7A45,#FF3D6E);box-shadow:0 30px 60px -20px rgba(255,61,110,.7);animation:akAfis 1.6s cubic-bezier(.2,1.3,.3,1) forwards;pointer-events:none}
.ak-afis b{font-family:${T.hat};font-size:64px;font-weight:800;line-height:1}
.ak-afis span{font-weight:750;font-size:16px}
@keyframes akAfis{0%{opacity:0;transform:translate(-50%,-50%) scale(.3) rotate(-12deg)}18%{opacity:1;transform:translate(-50%,-50%) scale(1.08) rotate(3deg)}30%{transform:translate(-50%,-50%) scale(1) rotate(0)}80%{opacity:1}100%{opacity:0;transform:translate(-50%,-70%) scale(.9)}}
@media (max-width:640px){
  .ak-ust{flex-wrap:wrap;row-gap:4px;padding:12px 12px 0}
  .ak-ust>div:last-child{margin-left:auto}
  .ak-sekmeler{order:3;flex:1 0 100%;justify-content:space-around}
  .ak-ic{padding:122px 76px 112px 18px}
  .ak-ray{right:10px;bottom:118px;gap:12px}
  .ak-ray button span{width:50px;height:50px}
  .ak-kanal{left:18px;bottom:38px}
  .ak-sekmeler button{padding:10px 8px;font-size:15px}
  .ak-xp{padding:10px 11px}.ak-xp small{display:none}
  .ak-damga{right:80px;top:96px}
  .ak-secler.ikili{grid-template-columns:1fr 1fr}
}
@media (prefers-reduced-motion:reduce){.ak-zemin,.ak-ic{animation:none!important}.ak-g,.ak-harf{opacity:1!important;transform:none!important}}
`;
