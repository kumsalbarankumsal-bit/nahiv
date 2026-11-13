/* ══════════════════════════════════════════════════════════════════════
   D A Ğ A R C I K   ·   Hatlar, Stüdyo, Sözlük
   Yedi hat, yüzü aşkın durak. Hat haritası kıvrılarak ilerler; her durak
   bir konudur. Stüdyo yirmi yedi çalışma yolunu bir arada sunar.
   ══════════════════════════════════════════════════════════════════════ */
import React, { useState, useEffect, useMemo, useRef } from "react";
import { Search, X, Check, ChevronRight, ChevronLeft, RotateCcw, Sparkles, Volume2, Map as MapIcon, LayoutGrid, BookOpen, Flame, Star } from "lucide-react";
import {
  C, T, S, KELIMELER, HATLAR, DURAK_META, SEVIYE_RENK, turYaz, duraginKelimeleri, hattinKelimeleri, durakIlerleme, hatIlerleme,
  vadesiGelenler, zorKelimeler, ustalasilanlar, ogrenilenler, YOL_OBEK, YOLLAR, YolDevinim, seslendir, sesVar,
  Dugme, Nisan, Levha, Bos, Cubuk, Halka,
  KesifYolu, OgrenYolu, YazYolu, HarfYolu, SecimYolu, KontrolYolu, SimsekYolu, EslestirYolu, HafizaYolu, VapurYolu, TelaffuzYolu, EsdizimYolu, YapayYolu
} from "./cekirdek.jsx";
import { KartYolu, MaratonYolu, DizgiYolu, YabanciYolu, AktarmaYolu, HarfAviYolu, DaktiloYolu, RadyoYolu, YukseltYolu, OrnekCumle } from "./yollar2.jsx";

/* ─── Yol kaydı: on sekiz eski, dokuz yeni ────────────────────────── */

const YENI_YOLLAR = [
  { id: "kart", ad: "Kartlar", obek: "tan", dev: "kart", neden: "Çevir, bak, karar ver. Bilmediğin kart destenin sonuna döner; deste bitene kadar çalışırsın." },
  { id: "maraton", ad: "Maraton", obek: "tan", dev: "basamak", neden: "Bütün durağı beşerli etaplarla bitir. Önce tanış, sonra sınan; yanlışın etap sonunda geri gelir." },
  { id: "radyo", ad: "Radyo", obek: "tan", dev: "dalga", neden: "Kelime, anlamı ve cümlesi sırayla okunur. Ekrana bakmadan dinlersin; gözlerin dinlenir.", gerek: "ses" },
  { id: "dizgi", ad: "Cümle dizgisi", obek: "ure", dev: "isaret", neden: "Karışık sözcükleri sıraya koy. İngilizcenin söz dizimini elinle kurarsın." },
  { id: "daktilo", ad: "Daktilo", obek: "ure", dev: "yaz", neden: "Yetmiş beş saniyede kaç kelime yazabilirsin? Hız, hatırlamayı otomatikleştirir." },
  { id: "yukselt", ad: "Yükselt", obek: "snv", dev: "esit", neden: "Sade sözcüğü güçlüsüyle değiştir: very important yerine crucial. Kriter A'nın sözcük puanı buradan gelir.", bagimsiz: true },
  { id: "yabanci", ad: "Yabancıyı bul", obek: "oyn", dev: "izgara", neden: "Dört kelimeden biri başka hattan bindi. Kelimeleri konusuyla birlikte hatırlarsın." },
  { id: "aktarma", ad: "Aktarma", obek: "oyn", dev: "vapur", neden: "Kelime hangi durakta iner? Konu bağını kurmak, Paper 1'de doğru kelimeyi çağırmayı kolaylaştırır." },
  { id: "harfavi", ad: "Harf avı", obek: "oyn", dev: "harf", neden: "Harfleri tahmin et; altı yanlışta vapur kaçar. Yazımı oyunla pekiştirir." }
];
const AD_DUZELT = { esanlam: { ad: "Kalıp tamamla", neden: "Kelimenin birlikte kullanıldığı kalıptaki boşluğu doldur. Sınavda eşleştirme sorularının temeli." } };
export const TUM_YOLLAR = [...YOLLAR.map((y) => ({ ...y, ...(AD_DUZELT[y.id] || {}) })), ...YENI_YOLLAR];
const SIRA = ["kesif", "kart", "ogren", "maraton", "radyo", "yaz", "bosluk", "dizgi", "harf", "daktilo", "dikte", "tanim", "esanlam", "yukselt", "kontrol", "parafraz",
  "simsek", "eslestir", "hafiza", "vapur", "yabanci", "aktarma", "harfavi", "baglam", "telaffuz", "esdizim", "koken"];
TUM_YOLLAR.sort((a, b) => SIRA.indexOf(a.id) - SIRA.indexOf(b.id));
export const YOL_BUL = Object.fromEntries(TUM_YOLLAR.map((y) => [y.id, y]));
const ROTA = ["kart", "maraton", "bosluk", "dizgi", "kontrol"];

function yolEkrani(yol, ortak) {
  switch (yol) {
    case "kesif": return <KesifYolu {...ortak} />;
    case "ogren": return <OgrenYolu {...ortak} />;
    case "yaz": case "bosluk": case "dikte": return <YazYolu yol={yol} {...ortak} />;
    case "harf": return <HarfYolu {...ortak} />;
    case "tanim": case "esanlam": return <SecimYolu yol={yol} {...ortak} />;
    case "kontrol": return <KontrolYolu {...ortak} />;
    case "simsek": return <SimsekYolu {...ortak} />;
    case "eslestir": return <EslestirYolu {...ortak} />;
    case "hafiza": return <HafizaYolu {...ortak} />;
    case "vapur": return <VapurYolu {...ortak} />;
    case "telaffuz": return <TelaffuzYolu {...ortak} />;
    case "esdizim": return <EsdizimYolu {...ortak} />;
    case "kart": return <KartYolu {...ortak} />;
    case "maraton": return <MaratonYolu {...ortak} />;
    case "dizgi": return <DizgiYolu {...ortak} />;
    case "yabanci": return <YabanciYolu {...ortak} />;
    case "aktarma": return <AktarmaYolu {...ortak} />;
    case "harfavi": return <HarfAviYolu {...ortak} />;
    case "daktilo": return <DaktiloYolu {...ortak} />;
    case "radyo": return <RadyoYolu {...ortak} />;
    case "yukselt": return <YukseltYolu {...ortak} />;
    default: return <YapayYolu yol={yol} {...ortak} />;
  }
}

/* ─── Kapsam ──────────────────────────────────────────────────────── */

export function kapsamCoz(kapsam, dag) {
  const k = kapsam || { tur: "hepsi" };
  if (k.tur === "vadesi") return { ad: "Bugünün tekrarları", kelimeler: vadesiGelenler(dag), renk: C.safranKoyu };
  if (k.tur === "zor") return { ad: "Zorlu kelimeler", kelimeler: zorKelimeler(dag), renk: C.lal };
  if (k.tur === "durak" && DURAK_META[k.id]) return { ad: DURAK_META[k.id].ad, kelimeler: duraginKelimeleri(k.id), renk: DURAK_META[k.id].renk };
  if (k.tur === "hat") { const h = HATLAR.find((x) => x.id === k.id); if (h) return { ad: h.ad, kelimeler: hattinKelimeleri(h.id), renk: h.renk }; }
  if (k.tur === "seviye") return { ad: k.id + " kelimeleri", kelimeler: KELIMELER.filter((x) => x.lv === k.id), renk: SEVIYE_RENK[k.id] };
  if (k.tur === "yeni") return { ad: "Hiç görmediklerin", kelimeler: KELIMELER.filter((x) => !dag[x.id] || !dag[x.id].kutu), renk: C.lacivert };
  return { ad: "Bütün dağarcık", kelimeler: KELIMELER, renk: C.altin };
}

function useGenislik() {
  const ref = useRef(null);
  const [w, setW] = useState(0);
  useEffect(() => {
    if (!ref.current) return;
    const olc = () => setW(ref.current ? ref.current.clientWidth : 0);
    olc();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(olc) : null;
    if (ro) ro.observe(ref.current); else window.addEventListener("resize", olc);
    return () => { if (ro) ro.disconnect(); else window.removeEventListener("resize", olc); };
  }, []);
  return [ref, w];
}

/* ─── Kıvrılan hat haritası ───────────────────────────────────────── */

function HatSeridi({ hat, dag, secili, sec }) {
  const [ref, w] = useGenislik();
  const sutun = w < 430 ? 3 : w < 640 ? 4 : w < 900 ? 5 : 6;
  const dy = 132, ust = 46, yan = Math.max(44, w / sutun / 2);
  const duraklar = hat.duraklar.map(([id, ad]) => ({ id, ad, p: durakIlerleme(dag, id) }));
  const satirSay = Math.ceil(duraklar.length / sutun);
  const adim = sutun > 1 ? (w - 2 * yan) / (sutun - 1) : 0;
  const nokta = (n) => { const r = Math.floor(n / sutun), c = n % sutun; return { x: yan + (r % 2 ? sutun - 1 - c : c) * adim, y: ust + r * dy }; };
  const noktalar = duraklar.map((_, n) => nokta(n));
  const siradaki = duraklar.findIndex((d) => d.p.toplam && d.p.usta < d.p.toplam);

  /* satır sonlarında yarım daireyle dönen yol */
  const yol = (son) => {
    let d = "";
    for (let n = 0; n <= son && n < noktalar.length; n++) {
      const p = noktalar[n];
      if (n === 0) { d = `M${p.x} ${p.y}`; continue; }
      const o = noktalar[n - 1];
      if (o.y === p.y) d += ` L${p.x} ${p.y}`;
      else { const sag = Math.floor((n - 1) / sutun) % 2 === 0; const k = sag ? 1 : -1; d += ` C${o.x + k * yan * 0.95} ${o.y}, ${p.x + k * yan * 0.95} ${p.y}, ${p.x} ${p.y}`; }
    }
    return d;
  };
  const bitenSon = (() => { let n = -1; for (let i = 0; i < duraklar.length; i++) { if (duraklar[i].p.toplam && duraklar[i].p.usta === duraklar[i].p.toplam) n = i; else break; } return n; })();

  return (
    <div ref={ref} style={{ position: "relative", height: w ? satirSay * dy + 24 : 200 }}>
      {w > 0 && (
        <>
          <svg width={w} height={satirSay * dy + 24} style={{ position: "absolute", inset: 0 }} aria-hidden="true">
            <path d={yol(noktalar.length - 1)} fill="none" stroke={hat.acik} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            <path d={yol(noktalar.length - 1)} fill="none" stroke={hat.renk} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1 13" opacity=".55" />
            {bitenSon >= 0 && <path d={yol(Math.min(bitenSon + 1, noktalar.length - 1))} fill="none" stroke={hat.renk} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />}
          </svg>
          {duraklar.map((d, n) => {
            const p = noktalar[n], tamam = d.p.toplam > 0 && d.p.usta === d.p.toplam, se = secili === d.id;
            const pay = d.p.toplam ? Math.round((Math.max(d.p.baslanan * 0.4, d.p.usta) / d.p.toplam) * 100) : 0;
            return (
              <button key={d.id} onClick={() => sec(se ? null : d.id)} aria-label={`${d.ad}, ${d.p.usta}/${d.p.toplam}`}
                style={{ position: "absolute", left: p.x - 58, top: p.y - 26, width: 116, border: "none", background: "transparent", cursor: "pointer", padding: 0, textAlign: "center" }}>
                <span style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center", width: 52, height: 52, borderRadius: 99,
                  background: tamam ? hat.renk : `conic-gradient(${hat.renk} ${pay}%, ${C.muhre} 0)`,
                  boxShadow: se ? `0 0 0 5px ${hat.renk}44, 0 8px 18px -8px ${hat.koyu}` : `0 4px 10px -6px ${hat.koyu}`,
                  transform: se ? "scale(1.12)" : "none", transition: "transform .2s, box-shadow .2s" }}>
                  <span style={{ width: 38, height: 38, borderRadius: 99, background: tamam ? hat.renk : C.muhre, border: `3.5px solid ${hat.renk}`,
                    display: "flex", alignItems: "center", justifyContent: "center", color: tamam ? (hat.murekkep || "#fff") : hat.koyu,
                    fontFamily: T.hat, fontWeight: 800, fontSize: 15 }}>
                    {tamam ? <Check size={18} /> : n + 1}
                  </span>
                  {n === siradaki && <span className="nv-vapurcuk" style={{ position: "absolute", top: -19, left: 12, fontSize: 0 }}>
                    <svg width="30" height="20" viewBox="0 0 30 20"><rect x="15" y="1" width="5" height="7" fill={C.safran} /><rect x="6" y="7" width="18" height="5" rx="1" fill="#fff" stroke={C.murekkep} strokeWidth="1.2" /><path d="M1 12 h28 l-4 7 h-20 Z" fill={C.murekkep} /></svg>
                  </span>}
                </span>
                <span style={{ display: "block", marginTop: 5, fontFamily: T.govde, fontSize: 13.5, fontWeight: se ? 800 : 600, lineHeight: 1.2, color: C.murekkep }}>{d.ad}</span>
                <span style={{ display: "block", fontSize: 12.5, color: C.murekkepSis, ...T.rakam }}>{d.p.usta}/{d.p.toplam}</span>
              </button>
            );
          })}
        </>
      )}
    </div>
  );
}

function DurakPaneli({ durakId, dag, calis, kapat }) {
  const m = DURAK_META[durakId];
  const ks = useMemo(() => duraginKelimeleri(durakId), [durakId]);
  const p = durakIlerleme(dag, durakId);
  const [acik, setAcik] = useState(false);
  const lv = {}; ks.forEach((k) => { lv[k.lv] = (lv[k.lv] || 0) + 1; });
  return (
    <div className="nv-gir" style={{ background: C.muhre, border: `2px solid ${m.renk}`, borderRadius: 22, overflow: "hidden", marginTop: S.md }}>
      <div style={{ background: m.renk, color: m.murekkep || "#fff", padding: `${S.md}px ${S.lg}px`, display: "flex", alignItems: "center", gap: S.md }}>
        <span style={{ width: 40, height: 40, borderRadius: 99, background: "rgba(255,255,255,.22)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: T.hat, fontWeight: 800, fontSize: 18 }}>{m.sira}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: T.hat, fontSize: 23, fontWeight: 740, lineHeight: 1.15 }}>{m.ad}</div>
          <div style={{ fontSize: 14, opacity: .9 }}>{m.hatAd} hattı, {ks.length} kelime</div>
        </div>
        <button onClick={kapat} aria-label="Kapat" style={{ border: "none", background: "rgba(255,255,255,.2)", color: "inherit", width: 40, height: 40, borderRadius: 99, cursor: "pointer" }}><X size={18} /></button>
      </div>
      <div style={{ padding: S.lg, display: "grid", gap: S.md }}>
        <div style={{ display: "flex", alignItems: "center", gap: S.md, flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 200px" }}><Cubuk deger={p.oran} renk={m.renk} boy={12} /></div>
          <span style={{ ...T.s, color: C.murekkepAlt }}><b style={{ color: C.murekkep }}>{p.usta}</b> ustalaşıldı, <b style={{ color: C.murekkep }}>{p.baslanan}</b> başlandı</span>
          {Object.keys(lv).sort().map((l) => <Nisan key={l} kucuk renk={SEVIYE_RENK[l]}>{l} · {lv[l]}</Nisan>)}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {(acik ? ks : ks.slice(0, 14)).map((k) => {
            const s = dag[k.id];
            return <span key={k.id} title={k.tr} style={{ fontFamily: T.kalem, fontSize: 15, padding: "4px 10px", borderRadius: 99,
              background: s && s.usta ? m.renk : s && s.kutu ? m.acik : C.kagitAlt, color: s && s.usta ? (m.murekkep || "#fff") : C.murekkep,
              border: `1px solid ${s && s.kutu ? m.renk + "55" : C.cizgi}` }}>{k.w}</span>;
          })}
          {ks.length > 14 && <button onClick={() => setAcik(!acik)} style={{ border: "none", background: "transparent", color: m.koyu, fontWeight: 700, cursor: "pointer", fontSize: 14.5 }}>{acik ? "daha az" : `+${ks.length - 14} kelime`}</button>}
        </div>
        <div style={{ display: "flex", gap: S.sm, flexWrap: "wrap" }}>
          <Dugme tur="altin" tikla={() => calis({ tur: "durak", id: durakId }, "kart")}>Kartlarla başla</Dugme>
          <Dugme tur="ikincil" tikla={() => calis({ tur: "durak", id: durakId }, "maraton")}>Maraton</Dugme>
          <Dugme tur="ikincil" tikla={() => calis({ tur: "durak", id: durakId }, null)}>Bütün yollar <ChevronRight size={15} /></Dugme>
        </div>
      </div>
    </div>
  );
}

function HatlarGorunumu({ dag, calis, acilisHat }) {
  const [hatId, setHatId] = useState(acilisHat || HATLAR[0].id);
  const [durak, setDurak] = useState(null);
  const hat = HATLAR.find((h) => h.id === hatId) || HATLAR[0];
  const ilr = hatIlerleme(dag, hat.id);
  return (
    <div>
      <div style={{ display: "flex", gap: 8, overflowX: "auto", padding: "4px 2px 12px", margin: "0 -2px" }}>
        {HATLAR.map((h) => {
          const et = h.id === hat.id, i = hatIlerleme(dag, h.id);
          return (
            <button key={h.id} onClick={() => { setHatId(h.id); setDurak(null); }}
              style={{ flex: "0 0 auto", display: "flex", alignItems: "center", gap: 10, padding: "9px 16px 9px 9px", borderRadius: 99, cursor: "pointer",
                border: `2px solid ${et ? h.renk : C.cizgi}`, background: et ? h.renk : C.muhre, color: et ? (h.murekkep || "#fff") : C.murekkep,
                boxShadow: et ? `0 10px 18px -12px ${h.koyu}` : "none", transition: "background .2s, color .2s" }}>
              <span style={{ width: 34, height: 34, borderRadius: 99, background: et ? "rgba(255,255,255,.25)" : h.renk, color: et ? "inherit" : (h.murekkep || "#fff"),
                display: "flex", alignItems: "center", justifyContent: "center", fontFamily: T.hat, fontWeight: 800, fontSize: 16 }}>{h.no}</span>
              <span style={{ textAlign: "left" }}>
                <span style={{ display: "block", fontSize: 15.5, fontWeight: 750, whiteSpace: "nowrap" }}>{h.ad}</span>
                <span style={{ display: "block", fontSize: 12.5, opacity: .85 }}>%{i.oran} · {i.toplam} kelime</span>
              </span>
            </button>
          );
        })}
      </div>

      <div style={{ background: C.muhre, border: `1px solid ${C.cizgi}`, borderRadius: 24, padding: `${S.lg}px ${S.md}px ${S.md}px`, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", gap: S.md, flexWrap: "wrap", padding: `0 ${S.sm}px ${S.md}px` }}>
          <div style={{ flex: "1 1 260px", minWidth: 0 }}>
            <div style={{ fontFamily: T.hat, fontSize: 27, fontWeight: 760, letterSpacing: "-0.02em", color: hat.koyu }}>{hat.ad}</div>
            <div style={{ ...T.s, color: C.murekkepAlt }}>{hat.ozet}</div>
          </div>
          <Halka deger={ilr.oran} boy={64} kalinlik={7} renk={hat.renk} ic={<span style={{ fontFamily: T.hat, fontWeight: 800, fontSize: 15, color: hat.koyu }}>%{ilr.oran}</span>} />
          <Dugme tur="ikincil" kucuk tikla={() => calis({ tur: "hat", id: hat.id }, null)}>Bütün hattı çalış</Dugme>
        </div>
        <HatSeridi hat={hat} dag={dag} secili={durak} sec={setDurak} />
      </div>
      {durak && <DurakPaneli durakId={durak} dag={dag} calis={calis} kapat={() => setDurak(null)} />}
    </div>
  );
}

/* ─── Stüdyo ──────────────────────────────────────────────────────── */

function YolKarti({ y, renk, rekor, sec, pasif, oneri }) {
  return (
    <button onClick={() => !pasif && sec(y.id)} className="nv-yolkart" disabled={pasif}
      style={{ position: "relative", textAlign: "left", padding: S.md, minHeight: 148, borderRadius: 20, cursor: pasif ? "not-allowed" : "pointer",
        border: `1px solid ${C.cizgi}`, background: C.muhre, color: C.murekkep, opacity: pasif ? .5 : 1, overflow: "hidden", display: "flex", flexDirection: "column", gap: 8, "--renk": renk }}>
      <span style={{ position: "relative", width: 62, height: 48, borderRadius: 14, background: renk + "1C", display: "block", flexShrink: 0 }}>
        <YolDevinim tip={y.dev} renk={renk} />
      </span>
      <span style={{ fontFamily: T.hat, fontSize: 19.5, fontWeight: 740, letterSpacing: "-0.01em" }}>{y.ad}</span>
      <span style={{ fontSize: 14, lineHeight: 1.42, color: C.murekkepAlt, flex: 1 }}>{y.neden.split(". ")[0].replace(/\.$/, "")}.</span>
      <span style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center", minHeight: 20 }}>
        {oneri && <Nisan kucuk renk={C.safranKoyu} zemin={C.safranSis}><Star size={11} /> önerilen</Nisan>}
        {rekor != null && <Nisan kucuk renk={renk}>en iyi {rekor}{y.id === "eslestir" ? " sn" : y.id === "hafiza" ? " hamle" : y.id === "kontrol" ? "%" : ""}</Nisan>}
        {y.yapay && <Nisan kucuk renk={C.mor}><Sparkles size={11} /> yapay zekâ</Nisan>}
      </span>
    </button>
  );
}

function Studyo({ dag, kapsam, setKapsam, sec, rekorlar }) {
  const coz = useMemo(() => kapsamCoz(kapsam, dag), [kapsam, dag]);
  const vadesi = useMemo(() => vadesiGelenler(dag).length, [dag]);
  const zor = useMemo(() => zorKelimeler(dag).length, [dag]);
  const [durakSec, setDurakSec] = useState(false);
  const cip = (ad, k, sayi, renk) => {
    const et = kapsam.tur === k.tur && kapsam.id === k.id;
    return (
      <button key={ad} onClick={() => setKapsam(k)}
        style={{ flex: "0 0 auto", padding: "9px 15px", minHeight: 42, borderRadius: 99, cursor: "pointer", fontSize: 15, fontWeight: 700,
          border: `2px solid ${et ? renk : C.cizgi}`, background: et ? renk : C.muhre, color: et ? "#fff" : C.murekkep }}>
        {ad}{sayi != null && <span style={{ marginLeft: 7, opacity: .8, fontWeight: 600 }}>{sayi}</span>}
      </button>
    );
  };
  return (
    <div>
      <Levha ic={S.lg} style={{ marginBottom: S.lg }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: S.sm, flexWrap: "wrap" }}>
          <span style={{ fontFamily: T.hat, fontSize: 22, fontWeight: 740 }}>Neyi çalışacaksın?</span>
          <span style={{ ...T.s, color: C.murekkepAlt }}>Seçili: <b style={{ color: coz.renk }}>{coz.ad}</b>, {coz.kelimeler.length} kelime</span>
        </div>
        <div style={{ display: "flex", gap: 8, overflowX: "auto", padding: "12px 2px 4px" }}>
          {cip("Bugünün tekrarları", { tur: "vadesi" }, vadesi, C.safranKoyu)}
          {cip("Hiç görmediklerim", { tur: "yeni" }, null, C.lacivert)}
          {cip("Zorlular", { tur: "zor" }, zor, C.lal)}
          {cip("Hepsi", { tur: "hepsi" }, KELIMELER.length, C.altin)}
          {["B1", "B2", "C1", "C2"].map((l) => cip(l, { tur: "seviye", id: l }, null, SEVIYE_RENK[l]))}
        </div>
        <div style={{ display: "flex", gap: 8, overflowX: "auto", padding: "8px 2px 4px" }}>
          {HATLAR.map((h) => cip(h.ad, { tur: "hat", id: h.id }, null, h.renk))}
        </div>
        <button onClick={() => setDurakSec(!durakSec)} style={{ border: "none", background: "transparent", color: C.altin, fontWeight: 700, cursor: "pointer", fontSize: 15, padding: "8px 2px" }}>
          {durakSec ? "Durak listesini kapat" : "Tek bir durak seç"}
        </button>
        {durakSec && (
          <div style={{ display: "grid", gap: 10, marginTop: 6 }}>
            {HATLAR.map((h) => (
              <div key={h.id} style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
                <span style={{ width: 26, height: 26, borderRadius: 99, background: h.renk, color: h.murekkep || "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13 }}>{h.no}</span>
                {h.duraklar.map(([id, ad]) => {
                  const et = kapsam.tur === "durak" && kapsam.id === id;
                  return <button key={id} onClick={() => setKapsam({ tur: "durak", id })}
                    style={{ padding: "5px 11px", borderRadius: 99, fontSize: 14, cursor: "pointer", fontWeight: et ? 800 : 500,
                      border: `1.5px solid ${et ? h.renk : C.cizgi}`, background: et ? h.acik : C.muhre, color: C.murekkep }}>{ad}</button>;
                })}
              </div>
            ))}
          </div>
        )}
      </Levha>

      {coz.kelimeler.length === 0 ? (
        <Bos baslik={kapsam.tur === "vadesi" ? "Bugün tekrarı gelen kelime yok" : "Bu kapsam boş"}
          aciklama={kapsam.tur === "vadesi" ? "Yeni kelimelerle tanışmak için bir hat ya da “Hiç görmediklerim” kapsamını seç." : "Başka bir kapsam seç."}
          eylem={() => setKapsam({ tur: "yeni" })} eylemAd="Yeni kelimelere geç" />
      ) : (
        <>
          <div style={{ background: C.gece, borderRadius: 22, padding: S.lg, marginBottom: S.lg, color: "#fff" }}>
            <div style={{ fontFamily: T.hat, fontSize: 21, fontWeight: 740 }}>Önerilen rota</div>
            <div style={{ fontSize: 15, color: "#C5D2EE", marginTop: 2 }}>Bir konuyu baştan sona öğrenmek için bu beş yolu sırayla yürü: gör, öğren, kullan, kur, sınan.</div>
            <div style={{ display: "flex", gap: 8, overflowX: "auto", marginTop: S.md, paddingBottom: 4 }}>
              {ROTA.map((id, n) => (
                <button key={id} onClick={() => sec(id)}
                  style={{ flex: "1 0 132px", textAlign: "left", padding: "12px 14px", borderRadius: 16, border: "1.5px solid #2B3D6E", background: C.geceAlt, color: "#fff", cursor: "pointer" }}>
                  <span style={{ display: "inline-flex", width: 26, height: 26, borderRadius: 99, background: C.safran, color: C.gece, alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14 }}>{n + 1}</span>
                  <span style={{ display: "block", marginTop: 8, fontFamily: T.hat, fontWeight: 720, fontSize: 17.5 }}>{YOL_BUL[id].ad}</span>
                </button>
              ))}
            </div>
          </div>

          {YOL_OBEK.map((o) => (
            <div key={o.id} style={{ marginBottom: S.xl }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: S.sm, marginBottom: S.md, flexWrap: "wrap" }}>
                <span style={{ width: 14, height: 14, borderRadius: 5, background: o.renk, alignSelf: "center" }} />
                <span style={{ fontFamily: T.hat, fontSize: 22, fontWeight: 750, letterSpacing: "-0.01em" }}>{o.ad}</span>
                <span style={{ ...T.s, color: C.murekkepAlt }}>{o.ac}</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(184px, 1fr))", gap: 12 }}>
                {TUM_YOLLAR.filter((y) => y.obek === o.id).map((y) => (
                  <YolKarti key={y.id} y={y} renk={o.renk} rekor={rekorlar[y.id]} sec={sec} oneri={ROTA.includes(y.id)}
                    pasif={(y.gerek === "ses" && !sesVar())} />
                ))}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

/* ─── Sözlük ──────────────────────────────────────────────────────── */

function Sozluk({ dag }) {
  const [ara, setAra] = useState("");
  const [lv, setLv] = useState(null);
  const [hat, setHat] = useState(null);
  const [durum, setDurum] = useState(null);
  const [kac, setKac] = useState(40);
  const [acik, setAcik] = useState(null);
  const sonuc = useMemo(() => {
    const q = ara.trim().toLocaleLowerCase("tr");
    return KELIMELER.filter((k) => {
      if (lv && k.lv !== lv) return false;
      if (hat && !k.duraklar.some((d) => DURAK_META[d].hat === hat)) return false;
      const s = dag[k.id];
      if (durum === "usta" && !(s && s.usta)) return false;
      if (durum === "ogren" && !(s && s.kutu > 0 && !s.usta)) return false;
      if (durum === "yeni" && s && s.kutu > 0) return false;
      if (q && !(k.w.toLowerCase().includes(q) || k.tr.toLocaleLowerCase("tr").includes(q))) return false;
      return true;
    }).sort((a, b) => a.w.toLowerCase().localeCompare(b.w.toLowerCase()));
  }, [ara, lv, hat, durum, dag]);
  useEffect(() => setKac(40), [ara, lv, hat, durum]);
  const cip = (ad, et, tikla, renk = C.altin) => (
    <button key={ad} onClick={tikla} style={{ flex: "0 0 auto", padding: "7px 13px", minHeight: 38, borderRadius: 99, cursor: "pointer", fontSize: 14.5, fontWeight: 700,
      border: `2px solid ${et ? renk : C.cizgi}`, background: et ? renk : C.muhre, color: et ? "#fff" : C.murekkep }}>{ad}</button>
  );
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: S.sm, border: `2px solid ${C.golge}`, borderRadius: 16, padding: `10px ${S.md}px`, background: C.muhre }}>
        <Search size={20} style={{ color: C.murekkepSis }} />
        <input value={ara} onChange={(e) => setAra(e.target.value)} placeholder="İngilizce ya da Türkçe ara…"
          style={{ border: "none", outline: "none", background: "transparent", flex: 1, fontSize: 18, color: C.murekkep, minWidth: 0 }} />
        {ara && <button onClick={() => setAra("")} aria-label="Temizle" style={{ border: "none", background: "transparent", cursor: "pointer", color: C.murekkepSis }}><X size={20} /></button>}
      </div>
      <div style={{ display: "flex", gap: 7, overflowX: "auto", padding: "12px 2px 4px" }}>
        {["B1", "B2", "C1", "C2"].map((l) => cip(l, lv === l, () => setLv(lv === l ? null : l), SEVIYE_RENK[l]))}
        <span style={{ width: 1, background: C.cizgi, flex: "0 0 1px" }} />
        {cip("Yeni", durum === "yeni", () => setDurum(durum === "yeni" ? null : "yeni"), C.lacivert)}
        {cip("Öğreniyorum", durum === "ogren", () => setDurum(durum === "ogren" ? null : "ogren"), C.safranKoyu)}
        {cip("Ustalaştım", durum === "usta", () => setDurum(durum === "usta" ? null : "usta"), C.zumrut)}
      </div>
      <div style={{ display: "flex", gap: 7, overflowX: "auto", padding: "6px 2px 10px" }}>
        {HATLAR.map((h) => cip(h.ad, hat === h.id, () => setHat(hat === h.id ? null : h.id), h.renk))}
      </div>
      <div style={{ ...T.s, color: C.murekkepAlt, margin: "4px 2px 10px" }}>{sonuc.length} kelime</div>
      <div style={{ background: C.muhre, border: `1px solid ${C.cizgi}`, borderRadius: 20, overflow: "hidden" }}>
        {sonuc.slice(0, kac).map((k, n) => {
          const s = dag[k.id], m = DURAK_META[k.durak], a = acik === k.id;
          return (
            <div key={k.id} style={{ borderTop: n ? `1px solid ${C.cizgi}` : "none", background: a ? C.kagitAlt : "transparent" }}>
              <div onClick={() => setAcik(a ? null : k.id)} style={{ display: "flex", alignItems: "center", gap: S.md, padding: `12px ${S.md}px`, cursor: "pointer", minHeight: 56 }}>
                <span style={{ width: 10, height: 34, borderRadius: 5, background: m.renk, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: T.kalem, fontSize: 18, fontWeight: 700, color: C.murekkep }}>{k.w}</div>
                  <div style={{ fontSize: 15, color: C.murekkepAlt }}>{k.tr}</div>
                </div>
                <Nisan kucuk renk={SEVIYE_RENK[k.lv]}>{k.lv}</Nisan>
                {s && s.usta ? <Nisan kucuk renk={C.zumrut} dolu>usta</Nisan> : s && s.kutu > 0 ? <Nisan kucuk renk={C.safranKoyu}>kutu {s.kutu}</Nisan> : null}
              </div>
              {a && (
                <div style={{ padding: `0 ${S.md}px ${S.md}px ${S.md + 22}px`, display: "grid", gap: 6 }}>
                  <OrnekCumle k={k} />
                  <div style={{ ...T.s, color: C.murekkepAlt }}>Birlikte: <span style={{ fontFamily: T.kalem, color: C.murekkep }}>{k.esdizim}</span></div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                    <Nisan kucuk renk={C.murekkepAlt}>{turYaz(k.pos)}</Nisan>
                    {k.duraklar.map((d) => <Nisan key={d} kucuk renk={DURAK_META[d].koyu || DURAK_META[d].renk} zemin={DURAK_META[d].acik}>{DURAK_META[d].ad}</Nisan>)}
                    {sesVar() && <button onClick={() => seslendir(k.w)} style={{ border: "none", background: C.altinSis, color: C.altin, borderRadius: 99, width: 36, height: 36, cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center" }} aria-label="Seslendir"><Volume2 size={17} /></button>}
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {sonuc.length === 0 && <div style={{ padding: S.xl, textAlign: "center", color: C.murekkepAlt }}>Bu süzgeçle eşleşen kelime yok. Süzgeçleri kaldırmayı dene.</div>}
      </div>
      {sonuc.length > kac && <div style={{ textAlign: "center", marginTop: S.md }}><Dugme tur="ikincil" tikla={() => setKac(kac + 80)}>Daha fazla göster ({sonuc.length - kac} kaldı)</Dugme></div>}
    </div>
  );
}

/* ─── Ana bileşen ─────────────────────────────────────────────────── */

export function Dagarcik({ dag, kelimeKaydet, rekorlar, rekorKaydet, hataEkle, oturumBitir, acilis, odak }) {
  const [gorunum, setGorunum] = useState((acilis && acilis.gorunum) || "hat");
  const [kapsam, setKapsam] = useState((acilis && acilis.kapsam) || { tur: "yeni" });
  const [yol, setYol] = useState((acilis && acilis.yol) || null);
  const baslangic = useRef(Date.now());

  useEffect(() => {
    if (!acilis) return;
    if (acilis.gorunum) setGorunum(acilis.gorunum);
    if (acilis.kapsam) setKapsam(acilis.kapsam);
    setYol(acilis.yol || null);
  }, [acilis]);
  useEffect(() => { if (yol) baslangic.current = Date.now(); odak && odak(!!yol); }, [yol]);
  useEffect(() => () => { odak && odak(false); }, []);

  const coz = useMemo(() => kapsamCoz(kapsam, dag), [kapsam, yol ? null : dag]);
  const calis = (k, y) => { setKapsam(k); if (y) setYol(y); else { setGorunum("studyo"); window.scrollTo({ top: 0, behavior: "smooth" }); } };
  const cik = () => {
    const sn = Math.round((Date.now() - baslangic.current) / 1000);
    oturumBitir && oturumBitir({ tur: "dagarcik", yol, saniye: Math.max(20, Math.min(sn, 3600)) });
    setYol(null);
  };

  if (yol && (coz.kelimeler.length || (YOL_BUL[yol] && YOL_BUL[yol].bagimsiz))) {
    const ortak = { kelimeler: coz.kelimeler, dag, kaydet: kelimeKaydet, cik, hataEkle, enIyi: rekorlar[yol], rekorKaydet: (v) => rekorKaydet(yol, v) };
    return (
      <div className="nv-gir" style={{ maxWidth: 780, margin: "0 auto" }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: S.sm, flexWrap: "wrap" }}>
          <Nisan renk={coz.renk} zemin={coz.renk + "18"}>{coz.ad}</Nisan>
          {!(YOL_BUL[yol] && YOL_BUL[yol].bagimsiz) && <span style={{ ...T.xs, color: C.murekkepSis }}>{coz.kelimeler.length} kelimelik havuz</span>}
        </div>
        {yolEkrani(yol, ortak)}
      </div>
    );
  }

  const toplamUsta = ustalasilanlar(dag).length, ogr = ogrenilenler(dag).length, vadesi = vadesiGelenler(dag).length;
  const sekme = (id, ad, Ikon) => (
    <button key={id} onClick={() => setGorunum(id)}
      style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "11px 12px", minHeight: 46, borderRadius: 13, cursor: "pointer", border: "none",
        fontSize: 16, fontWeight: 750, background: gorunum === id ? C.muhre : "transparent", color: gorunum === id ? C.murekkep : C.murekkepAlt,
        boxShadow: gorunum === id ? "0 4px 12px -6px rgba(15,27,51,.35)" : "none" }}>
      <Ikon size={18} /> {ad}
    </button>
  );
  return (
    <div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: S.lg, flexWrap: "wrap", marginBottom: S.lg }}>
        <div style={{ flex: "1 1 300px" }}>
          <h1 style={{ fontFamily: T.hat, ...T.d0, margin: 0 }}>Dağarcık</h1>
          <div style={{ ...T.m, color: C.murekkepAlt, marginTop: 6, maxWidth: 560 }}>
            {KELIMELER.length} kelime ve kalıp, {HATLAR.length} hat, {Object.keys(DURAK_META).length} durak. {TUM_YOLLAR.length} ayrı yoldan çalışılır.
          </div>
        </div>
        <div style={{ display: "flex", gap: S.sm }}>
          {[[toplamUsta, "ustalaşılan", C.zumrut], [ogr, "öğrenmede", C.altin], [vadesi, "bugün tekrar", C.safranKoyu]].map(([n, ad, r]) => (
            <div key={ad} onClick={ad === "bugün tekrar" && n ? () => calis({ tur: "vadesi" }, null) : undefined}
              style={{ background: C.muhre, border: `1px solid ${C.cizgi}`, borderRadius: 16, padding: "10px 16px", minWidth: 96, cursor: ad === "bugün tekrar" && n ? "pointer" : "default" }}>
              <div style={{ fontFamily: T.hat, fontSize: 27, fontWeight: 780, color: r, lineHeight: 1, ...T.rakam }}>{n}</div>
              <div style={{ fontSize: 13.5, color: C.murekkepAlt, marginTop: 3 }}>{ad}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", gap: 4, background: C.kagitDerin, padding: 4, borderRadius: 16, marginBottom: S.lg, maxWidth: 520 }}>
        {sekme("hat", "Hatlar", MapIcon)}{sekme("studyo", "Stüdyo", LayoutGrid)}{sekme("sozluk", "Sözlük", BookOpen)}
      </div>
      {gorunum === "hat" && <HatlarGorunumu dag={dag} calis={calis} acilisHat={acilis && acilis.hat} />}
      {gorunum === "studyo" && <Studyo dag={dag} kapsam={kapsam} setKapsam={setKapsam} sec={setYol} rekorlar={rekorlar} />}
      {gorunum === "sozluk" && <Sozluk dag={dag} />}
    </div>
  );
}
