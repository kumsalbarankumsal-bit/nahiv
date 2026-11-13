/* ══════════════════════════════════════════════════════════════════════
   N A H İ V  4   ·   İngilizce B HL merkezi
   Kabuk: gezinme, veri, puan ve ana sayfa. Bileşenlerin çoğu
   cekirdek.jsx içindedir; yeni bölümler kendi dosyalarında durur.
   ══════════════════════════════════════════════════════════════════════ */
import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Home, Library, GraduationCap, Waypoints, Feather, Flame, Command, ChevronRight, Anchor, RotateCcw, Volume2, Minus, Plus } from "lucide-react";
import {
  C, T, S, K, YAZI_TIPLERI, sGet, sSet, depoSagligi, eskiSurumTara, veriYaz, paketOzeti, gunlukYedek, bugun, yeniId, norm, trTarih, gunEkle, YolDevinim, YOL_OBEK,
  ustalikGuncelle, kelimeGuncelle, dugum, TANI, DUGUMLER, HATLAR, DURAK_META, KELIMELER, zayifDugumler, aileKisa, bekleyenTekrarlar,
  vadesiGelenler, dagarcikTahmini, hatIlerleme, durakIlerleme, istanbulSVG, gokEvresi, GOKYUZU, selamla, ayAdi, useSayac, konfeti, seslendir, sesVar,
  Dugme, Nisan, Levha, Cubuk, Halka,
  Divan, Seyir, Sandik, Talimhane, Sokrates, Harita, Defter, Yazihane, Sesli, TaniSinavi, KomutPaleti
} from "./cekirdek.jsx";
import { Dagarcik, TUM_YOLLAR, YOL_BUL } from "./dagarcik2.jsx";
import { MetinTurleri, Paper1, Paper2, IO } from "./sinav.jsx";
import { OrnekCumle } from "./yollar2.jsx";
import { Bogaz, gokRengi } from "./sahne.jsx";
import { puanUcur, Acilis, gecis } from "./hareket.jsx";
import { seviyeHesap, puanEkle, bugunPuan, seriGun, sonGunler, BOS_OYUN, ISKELELER } from "./oyun.js";

const GRUPLAR = [
  { id: "ana", ad: "Ana sayfa", ikon: Home, sekmeler: [["bugun", "Bugün"], ["seyir", "Seyir defteri"], ["sandik", "Sandık"]] },
  { id: "kelime", ad: "Kelime", ikon: Library, sekmeler: [["dagarcik", "Dağarcık"]] },
  { id: "sinav", ad: "Sınav", ikon: GraduationCap, sekmeler: [["turler", "Metin türleri"], ["p1", "Paper 1"], ["p2", "Paper 2"], ["io", "Sözlü (IO)"]] },
  { id: "gramer", ad: "Gramer", ikon: Waypoints, sekmeler: [["divan", "Günün ocağı"], ["talim", "Talimhane"], ["sokrates", "Sokrates"], ["harita", "Takımyıldız"], ["defter", "Hata defteri"]] },
  { id: "atolye", ad: "Atölye", ikon: Feather, sekmeler: [["yazihane", "Yazıhane"], ["sesli", "Sesli"]] }
];
const GRUP_BUL = (sekme) => GRUPLAR.find((g) => g.sekmeler.some(([id]) => id === sekme)) || GRUPLAR[0];

const STIL = `${YAZI_TIPLERI}
@keyframes nspin{to{transform:rotate(360deg)}}
@keyframes nyanip{0%,100%{opacity:1}50%{opacity:.25}}
@keyframes nvKart1{0%,100%{transform:translate(0,0) rotate(-5deg)}50%{transform:translate(-3px,-2px) rotate(-9deg)}}
@keyframes nvKart2{0%,100%{transform:translate(0,0) rotate(5deg)}50%{transform:translate(3px,-2px) rotate(9deg)}}
@keyframes nvYuk{0%,100%{transform:scaleY(.72)}50%{transform:scaleY(1)}}
@keyframes nvImlec{0%,49%{opacity:1}50%,100%{opacity:0}}
@keyframes nvNefes{0%,100%{transform:scale(1);opacity:.3}50%{transform:scale(1.14);opacity:.75}}
@keyframes nvZipla{0%,100%{transform:translateY(0)}45%{transform:translateY(-4px)}}
@keyframes nvDalga{0%,100%{transform:scaleY(.42)}50%{transform:scaleY(1.25)}}
@keyframes nvKaydir{0%,100%{transform:translateX(0)}50%{transform:translateX(13px)}}
@keyframes nvCakan{0%,100%{opacity:.25}48%{opacity:1}}
@keyframes nvSagaSola{0%,100%{transform:translateX(0)}50%{transform:translateX(7px)}}
@keyframes nvCevir{0%,100%{transform:rotateY(0)}50%{transform:rotateY(180deg)}}
@keyframes nvVapur{0%{transform:translateX(0)}100%{transform:translateX(26px)}}
@keyframes nvParla{0%,100%{opacity:.35}50%{opacity:1}}
@keyframes nvGir{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
@keyframes nvYuzer{from{transform:translateX(-40px)}to{transform:translateX(840px)}}
@keyframes nvSalla{0%,100%{transform:translateY(0) rotate(-2deg)}50%{transform:translateY(-3px) rotate(2deg)}}
@keyframes nvMarti{0%{transform:translate(-8vw,0)}50%{transform:translate(52vw,-16px)}100%{transform:translate(112vw,6px)}}
@keyframes nvKanat{0%,100%{d:path("M0 6 Q6 0 12 6 Q18 0 24 6")}50%{d:path("M0 4 Q6 8 12 5 Q18 8 24 4")}}
@keyframes nvPirilti{0%,100%{opacity:.15}50%{opacity:.6}}
@keyframes nvTitre{0%,100%{transform:translateX(0)}20%{transform:translateX(-6px)}40%{transform:translateX(6px)}60%{transform:translateX(-4px)}80%{transform:translateX(4px)}}
@keyframes nvZipDogru{0%{transform:scale(1)}40%{transform:scale(1.035)}100%{transform:scale(1)}}
@keyframes nvPuan{0%{opacity:0;transform:translateY(8px) scale(.8)}15%{opacity:1;transform:translateY(0) scale(1.08)}80%{opacity:1}100%{opacity:0;transform:translateY(-22px)}}
@keyframes nvTahta{from{transform:rotateX(-88deg);opacity:0}to{transform:none;opacity:1}}
.nv-vapur{animation:nvYuzer 46s linear infinite}
.nv-gir{animation:nvGir .38s cubic-bezier(.2,.8,.25,1) both}
.nv-vapurcuk{animation:nvSalla 2.4s ease-in-out infinite}
.n-secenek{transition:transform .14s,border-color .14s,box-shadow .14s}
.n-secenek:hover{transform:translateY(-2px);border-color:${C.cetvel}!important;box-shadow:0 8px 16px -10px rgba(15,27,51,.4)}
.n-secenek:active{transform:scale(.985)}
.n-dogru{animation:nvZipDogru .4s ease}
.n-yanlis{animation:nvTitre .38s ease}
.n-dugme:active{transform:scale(.97)!important}
.nv-yolkart{transition:transform .18s,box-shadow .18s,border-color .18s}
.nv-yolkart:hover{transform:translateY(-4px);border-color:var(--renk)!important;box-shadow:0 16px 26px -18px var(--renk)}
.nv-yolkart:active{transform:scale(.98)}
.nv-ikili{grid-template-columns:minmax(0,1fr)}
.nv-tahta-satir{animation:nvTahta .5s cubic-bezier(.2,.8,.25,1) both;transform-origin:top}
@media (min-width:980px){.nv-ikili{grid-template-columns:minmax(0,1.05fr) minmax(0,1fr)}}
@media (max-width:979px){.nv-yapiskan{position:static!important;max-height:none!important}}
@keyframes nvHarf{from{opacity:0;transform:translateY(.5em) rotate(6deg)}to{opacity:1;transform:none}}
@keyframes nvCam{from{opacity:0;transform:translateY(16px) scale(.96)}to{opacity:1;transform:none}}
@keyframes nvSira{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:none}}
@keyframes nvZil{0%,100%{transform:scale(1)}30%{transform:scale(1.22)}60%{transform:scale(.94)}}
@keyframes nvAkis{to{stroke-dashoffset:-28}}
@keyframes nvIsil{0%{background-position:-180% 0}100%{background-position:280% 0}}
@keyframes nvKartIn{from{opacity:0;transform:translateY(18px) scale(.94)}to{opacity:1;transform:none}}
.nv-harf{display:inline-block;animation:nvHarf .5s cubic-bezier(.3,1.5,.5,1) both}
.nv-cam{animation:nvCam .6s .25s cubic-bezier(.2,.8,.2,1) both}
.nv-sira>*{animation:nvSira .55s cubic-bezier(.2,.8,.2,1) both}
.nv-sira>*:nth-child(1){animation-delay:.08s}.nv-sira>*:nth-child(2){animation-delay:.16s}.nv-sira>*:nth-child(3){animation-delay:.24s}.nv-sira>*:nth-child(4){animation-delay:.32s}.nv-sira>*:nth-child(5){animation-delay:.4s}.nv-sira>*:nth-child(6){animation-delay:.48s}
.nv-zil{animation:nvZil .5s cubic-bezier(.3,1.5,.5,1)}
.nv-akis{stroke-dasharray:1 13;animation:nvAkis 1.2s linear infinite}
.nv-yolkart .nv-resim>span{transition:transform .35s cubic-bezier(.3,1.5,.5,1)}
.nv-yolkart:hover .nv-resim>span{transform:scale(2.15) rotate(-3deg)!important}
.nv-kartlar>*{animation:nvKartIn .45s cubic-bezier(.2,.8,.2,1) both}
.nv-isil{position:relative;overflow:hidden}
.nv-isil::after{content:"";position:absolute;inset:0;background:linear-gradient(105deg,transparent 40%,rgba(255,255,255,.55) 50%,transparent 60%);background-size:220% 100%;animation:nvIsil 3.6s ease-in-out infinite;pointer-events:none}
::view-transition-old(root){animation:.18s ease both nvVtOut}::view-transition-new(root){animation:.34s cubic-bezier(.2,.8,.2,1) both nvVtIn}
@keyframes nvVtOut{to{opacity:0;transform:translateY(-8px) scale(.995)}}@keyframes nvVtIn{from{opacity:0;transform:translateY(14px)}}
body::before{content:"";position:fixed;inset:0;pointer-events:none;z-index:0;opacity:.5;background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .06 0 0 0 0 .1 0 0 0 0 .2 0 0 0 .05 0'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)'/%3E%3C/svg%3E")}
#kok{position:relative;z-index:1}
*{-webkit-tap-highlight-color:transparent;box-sizing:border-box}
html{scroll-behavior:smooth}
body{margin:0;background:${C.kagit}}
button,input,textarea,select{font-family:inherit}
input:focus,textarea:focus,select:focus{border-color:${C.altin}!important}
button:focus-visible,[role=button]:focus-visible{outline:3px solid ${C.safran};outline-offset:2px}
::selection{background:${C.safranSis}}
::-webkit-scrollbar{width:10px;height:8px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:${C.golge};border-radius:9px}
@media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}html{scroll-behavior:auto}}`;

/* ─── Yaşayan İstanbul başlığı ────────────────────────────────────── */

function Sahne({ ad, oyun, puanVer }) {
  const [an, setAn] = useState(() => new Date());
  useEffect(() => { const t = setInterval(() => setAn(new Date()), 15000); return () => clearInterval(t); }, []);
  const saat = `${String(an.getHours()).padStart(2, "0")}:${String(an.getMinutes()).padStart(2, "0")}`;
  const sv = seviyeHesap(oyun.xp), seri = seriGun(oyun);
  const besle = useRef(0);
  const marti = useCallback(() => { besle.current++; if (besle.current % 3 === 0 && besle.current <= 9) puanVer(1); }, [puanVer]);
  const G = gokRengi(an.getHours() + an.getMinutes() / 60);
  return (
    <div style={{ marginBottom: S.lg }} className="nv-sahne">
      <Bogaz yukseklik={"clamp(300px, 42vw, 420px)"} onMarti={marti}>
        <div className="nv-cam" style={{ position: "absolute", left: "clamp(14px, 2.6vw, 28px)", top: "clamp(14px, 2.6vw, 28px)", maxWidth: "min(78%, 470px)", padding: "clamp(14px, 2vw, 22px) clamp(16px, 2.4vw, 26px)", borderRadius: 24,
          background: G.gece > .5 ? "rgba(10,18,48,.55)" : "rgba(255,255,255,.72)", color: G.gece > .5 ? "#fff" : C.murekkep, backdropFilter: "blur(14px) saturate(1.3)", WebkitBackdropFilter: "blur(14px) saturate(1.3)",
          border: `1px solid ${G.gece > .5 ? "rgba(255,255,255,.18)" : "rgba(255,255,255,.9)"}`, boxShadow: "0 18px 40px -22px rgba(0,0,0,.55)" }}>
          <div style={{ fontFamily: T.hat, fontSize: "clamp(28px, 5vw, 46px)", fontWeight: 790, letterSpacing: "-0.03em", lineHeight: 1.03 }}>
            {selamla(an, ad).split("").map((h, i) => <span key={i} className="nv-harf" style={{ animationDelay: `${420 + i * 28}ms` }}>{h === " " ? "\u00a0" : h}</span>)}
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 8, flexWrap: "wrap" }}>
            <span style={{ fontFamily: T.kalem, fontSize: "clamp(19px, 2.6vw, 25px)", fontWeight: 700 }}>{saat}</span>
            <span style={{ fontSize: 15.5, opacity: .85 }}>{trTarih(an.toISOString())}</span>
          </div>
          <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginTop: 12 }}>
            <span style={hapStil}><Anchor size={16} style={{ color: C.altin }} /> {sv.no}. iskele <b>{sv.ad}</b></span>
            {seri > 0 && <span style={hapStil}><Flame size={16} style={{ color: C.lal }} /> <b>{seri}</b> gün</span>}
          </div>
        </div>
      </Bogaz>
    </div>
  );
}
const hapStil = { display: "inline-flex", alignItems: "center", gap: 7, padding: "7px 13px", borderRadius: 99, background: "rgba(255,255,255,.95)", color: C.murekkep, fontSize: 14.5 };

/* ─── Ana sayfa ───────────────────────────────────────────────────── */

function AnaSayfa({ profil, oyun, hedefDegis, dag, hatalar, ustalik, sinav, git, kelimeAc, puanVer }) {
  const vadesi = useMemo(() => vadesiGelenler(dag).length, [dag]);
  const tekrarHata = bekleyenTekrarlar(hatalar).length;
  const bp = bugunPuan(oyun), hedef = oyun.hedef || 100, sv = seviyeHesap(oyun.xp);
  const gunler = sonGunler(oyun, 7), enCok = Math.max(hedef, ...gunler.map((g) => g.xp));
  const tahmin = useSayac(dagarcikTahmini(dag), 1100);
  /* sıradaki durak: en az ilerlenmiş hattın ilk bitmemiş durağı */
  const sira = useMemo(() => {
    for (const h of HATLAR) for (const [id] of h.duraklar) { const p = durakIlerleme(dag, id); if (p.toplam && p.usta < p.toplam) return { h, id, p }; }
    return null;
  }, [dag]);
  const gununKelimesi = useMemo(() => { const g = bugun(); let t = 0; for (const c of g) t = (t * 31 + c.charCodeAt(0)) % 100003; const zor = KELIMELER.filter((k) => k.lv === "C1" || k.lv === "C2" || k.pos === "idm"); return zor[t % zor.length]; }, []);
  const zayif = useMemo(() => zayifDugumler(ustalik, hatalar, 1)[0], [ustalik, hatalar]);
  const yazilan = (sinav.p1 || []).length;
  const takvim = useMemo(() => { const g = Array.from({ length: 7 }, (_, i) => ({ gun: gunEkle(bugun(), i), n: 0, ad: ["Pz", "Pt", "Sa", "Ça", "Pe", "Cu", "Ct"][new Date(gunEkle(bugun(), i) + "T00:00:00Z").getUTCDay()] }));
    Object.values(dag).forEach((s) => { if (!s || !s.sonrakiTarih || s.usta) return; const i = s.sonrakiTarih <= g[0].gun ? 0 : g.findIndex((x) => x.gun === s.sonrakiTarih); if (i >= 0) g[i].n++; }); return g; }, [dag]);
  const takvimUst = Math.max(1, ...takvim.map((g) => g.n));
  const isi = sonGunler(oyun, 119);

  const seferler = [
    vadesi > 0 && { saat: "şimdi", ad: "Kelime tekrarları", alt: `${vadesi} kelimenin vadesi geldi`, renk: C.safran, tikla: () => kelimeAc({ gorunum: "studyo", kapsam: { tur: "vadesi" }, yol: "kart" }) },
    sira && { saat: `hat ${sira.h.no}`, ad: DURAK_META[sira.id].ad, alt: `${sira.h.ad}, ${sira.p.usta}/${sira.p.toplam} kelime`, renk: sira.h.renk, tikla: () => kelimeAc({ gorunum: "studyo", kapsam: { tur: "durak", id: sira.id }, yol: "kart" }) },
    { saat: "gramer", ad: zayif ? zayif.d.tr : "Günün ocağı", alt: zayif ? "En zayıf düğümün; on soruluk talim" : "Bugünün gramer planı", renk: "#8FB0FF", tikla: () => git("divan") },
    tekrarHata > 0 && { saat: "defter", ad: "Hata tekrarları", alt: `${tekrarHata} hata yeniden sorulacak`, renk: C.lalAcik, tikla: () => git("defter") },
    { saat: "sınav", ad: yazilan ? "Paper 1 provası" : "İlk Paper 1 provan", alt: "Üç görev, doksan dakika, ölçütlere göre puan", renk: "#F58BC4", tikla: () => git("p1") },
    { saat: "sözlü", ad: "Bir IO sorusu çek", alt: "Altmış saniye konuş", renk: "#7FE0C0", tikla: () => git("io") }
  ].filter(Boolean).slice(0, 5);

  return (
    <div>
      <Sahne ad={profil.ad} oyun={oyun} puanVer={puanVer} />
      <div className="nv-sira" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(420px, 100%), 1fr))", gap: S.lg, alignItems: "stretch" }}>
        {/* sefer tahtası */}
        <section style={{ background: C.gece, borderRadius: 26, padding: S.lg, color: "#fff", perspective: 900 }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: S.md }}>
            <h2 style={{ fontFamily: T.hat, fontSize: 25, fontWeight: 780, margin: 0, letterSpacing: "-0.02em" }}>Sıradaki seferler</h2>
            <span style={{ fontFamily: T.kalem, fontSize: 14, color: C.safran }}>NAHİV İSKELESİ</span>
          </div>
          <div style={{ display: "grid", gap: 8 }}>
            {seferler.map((s, i) => (
              <button key={s.ad} onClick={s.tikla} className="nv-tahta-satir" style={{ animationDelay: `${i * 90}ms`, display: "flex", alignItems: "center", gap: 14, padding: "13px 14px", minHeight: 66, borderRadius: 16,
                border: "1px solid #25376A", background: C.geceAlt, color: "#fff", cursor: "pointer", textAlign: "left" }}>
                <span style={{ width: 66, flexShrink: 0, fontFamily: T.kalem, fontSize: 15, fontWeight: 700, color: s.renk }}>{s.saat}</span>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: "block", fontFamily: T.hat, fontSize: 19, fontWeight: 720, lineHeight: 1.2 }}>{s.ad}</span>
                  <span style={{ display: "block", fontSize: 14.5, color: "#B9C7E6" }}>{s.alt}</span>
                </span>
                <ChevronRight size={20} style={{ color: s.renk, flexShrink: 0 }} />
              </button>
            ))}
          </div>
        </section>

        {/* bugün */}
        <section style={{ background: C.muhre, border: `1px solid ${C.cizgi}`, borderRadius: 26, padding: S.lg }}>
          <h2 style={{ fontFamily: T.hat, fontSize: 25, fontWeight: 780, margin: `0 0 ${S.md}px`, letterSpacing: "-0.02em" }}>Bugün</h2>
          <div style={{ display: "flex", alignItems: "center", gap: S.lg, flexWrap: "wrap" }}>
            <Halka deger={Math.min(100, (bp / hedef) * 100)} boy={132} kalinlik={13} renk={bp >= hedef ? C.zumrut : C.altin}
              ic={<div style={{ textAlign: "center" }}><div style={{ fontFamily: T.hat, fontSize: 34, fontWeight: 800, lineHeight: 1, color: bp >= hedef ? C.zumrut : C.murekkep }}>{bp}</div><div style={{ fontSize: 13.5, color: C.murekkepSis }}>/ {hedef} puan</div></div>} />
            <div style={{ flex: "1 1 150px" }}>
              <div style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.35 }}>{bp >= hedef ? "Günlük hedef tamam. Fazlası kâr." : bp > 0 ? `Hedefe ${hedef - bp} puan kaldı.` : "Bugün henüz demir alınmadı."}</div>
              <div style={{ fontSize: 14.5, color: C.murekkepAlt, marginTop: 4 }}>Doğru kelime 10, gramer sorusu 6, yazılan metin 25 puan.</div>
              <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
                {[50, 100, 200].map((h) => <button key={h} onClick={() => hedefDegis(h)} style={{ padding: "6px 13px", minHeight: 36, borderRadius: 99, cursor: "pointer", fontSize: 14, fontWeight: 700,
                  border: `2px solid ${hedef === h ? C.altin : C.cizgi}`, background: hedef === h ? C.altinSis : C.muhre, color: C.murekkep }}>{h}</button>)}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 86, marginTop: S.lg }}>
            {gunler.map((g, i) => (
              <div key={g.gun} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 5, height: "100%", justifyContent: "flex-end" }}>
                <div title={`${g.xp} puan`} style={{ width: "100%", maxWidth: 34, borderRadius: 8, height: `${Math.max(6, (g.xp / enCok) * 100)}%`, background: g.xp >= hedef ? C.zumrut : g.xp > 0 ? C.altin : C.kagitDerin, transition: "height .6s cubic-bezier(.2,.8,.25,1)" }} />
                <span style={{ fontSize: 12.5, fontWeight: i === 6 ? 800 : 500, color: i === 6 ? C.murekkep : C.murekkepSis }}>{["Pz", "Pt", "Sa", "Ça", "Pe", "Cu", "Ct"][new Date(g.gun + "T00:00:00Z").getUTCDay()]}</span>
              </div>
            ))}
          </div>
        </section>

        {/* günün kelimesi */}
        <section style={{ background: DURAK_META[gununKelimesi.durak].acik, border: `1px solid ${DURAK_META[gununKelimesi.durak].renk}55`, borderRadius: 26, padding: S.lg }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: DURAK_META[gununKelimesi.durak].koyu }}>Günün kelimesi, {gununKelimesi.lv}</span>
            {sesVar() && <button onClick={() => seslendir(gununKelimesi.w)} aria-label="Seslendir" style={{ width: 42, height: 42, borderRadius: 99, border: "none", background: "#fff", color: DURAK_META[gununKelimesi.durak].koyu, cursor: "pointer" }}><Volume2 size={19} /></button>}
          </div>
          <div style={{ fontFamily: T.hat, fontSize: gununKelimesi.w.length > 20 ? 30 : 40, fontWeight: 790, letterSpacing: "-0.025em", lineHeight: 1.08, margin: "6px 0 4px" }}>{gununKelimesi.w}</div>
          <div style={{ fontSize: 19, fontWeight: 700, color: DURAK_META[gununKelimesi.durak].koyu }}>{gununKelimesi.tr}</div>
          <OrnekCumle k={gununKelimesi} style={{ marginTop: 10, color: C.murekkep }} />
          <div style={{ marginTop: 12 }}><Dugme tur="ikincil" kucuk tikla={() => kelimeAc({ gorunum: "studyo", kapsam: { tur: "durak", id: gununKelimesi.durak }, yol: null })}>{DURAK_META[gununKelimesi.durak].ad} durağına git</Dugme></div>
        </section>

        {/* iskele */}
        <section style={{ background: C.muhre, border: `1px solid ${C.cizgi}`, borderRadius: 26, padding: S.lg }}>
          <h2 style={{ fontFamily: T.hat, fontSize: 25, fontWeight: 780, margin: 0, letterSpacing: "-0.02em" }}>Boğaz seferin</h2>
          <div style={{ fontSize: 15.5, color: C.murekkepAlt, marginTop: 2 }}>{sv.sonraki ? `${sv.sonraki} iskelesine ${sv.kalan} puan kaldı.` : "Son iskeledesin: Anadolu Kavağı."}</div>
          <div style={{ position: "relative", height: 74, margin: `${S.md}px 0 6px` }}>
            <div style={{ position: "absolute", left: 0, right: 0, top: 44, height: 8, borderRadius: 8, background: C.laciSis }} />
            <div style={{ position: "absolute", left: 0, top: 44, height: 8, borderRadius: 8, background: C.lacivert, width: `${sv.oran}%`, transition: "width 1s cubic-bezier(.2,.8,.25,1)" }} />
            <div className="nv-vapurcuk" style={{ position: "absolute", top: 8, left: `calc(${sv.oran}% - 24px)`, transition: "left 1s cubic-bezier(.2,.8,.25,1)" }}>
              <svg width="48" height="34" viewBox="0 0 48 34"><rect x="26" y="2" width="7" height="12" fill={C.safran} /><rect x="26" y="2" width="7" height="4" fill={C.murekkep} /><rect x="9" y="13" width="30" height="8" rx="2" fill="#fff" stroke={C.murekkep} strokeWidth="1.5" /><path d="M2 21 h44 l-6 11 h-32 Z" fill={C.murekkep} /></svg>
            </div>
            <span style={{ position: "absolute", left: 0, top: 58, fontSize: 13.5, fontWeight: 700 }}>{sv.ad}</span>
            {sv.sonraki && <span style={{ position: "absolute", right: 0, top: 58, fontSize: 13.5, fontWeight: 700, color: C.murekkepAlt }}>{sv.sonraki}</span>}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: S.md }}>
            {ISKELELER.map((ad, i) => <span key={ad} title={ad} style={{ width: 15, height: 15, borderRadius: 99, background: i < sv.no ? C.lacivert : C.kagitDerin, border: i === sv.no - 1 ? `3px solid ${C.safran}` : "none" }} />)}
          </div>
          <div style={{ fontSize: 14.5, color: C.murekkepAlt, marginTop: 10 }}>Tahmini dağarcığın <b style={{ color: C.murekkep, ...T.rakam }}>{tahmin}</b> kelime; hedef {KELIMELER.length}.</div>
        </section>
      </div>

      {/* stüdyodan */}
      <section style={{ margin: `${S.xl}px 0 0` }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: S.md }}>
          <h2 style={{ fontFamily: T.hat, fontSize: 25, fontWeight: 780, margin: 0, letterSpacing: "-0.02em" }}>Stüdyodan</h2>
          <button onClick={() => kelimeAc({ gorunum: "studyo" })} style={{ border: "none", background: "transparent", color: C.altin, fontWeight: 750, fontSize: 15.5, cursor: "pointer" }}>Bütün yollar ({TUM_YOLLAR.length})</button>
        </div>
        <div className="nv-kartlar" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 12 }}>
          {["kart", "maraton", "dizgi", "harfavi", "daktilo", "radyo"].map((id, i) => { const y = YOL_BUL[id], o = YOL_OBEK.find((x) => x.id === y.obek); return (
            <button key={id} className="nv-yolkart" onClick={() => kelimeAc({ gorunum: "studyo", kapsam: vadesi ? { tur: "vadesi" } : sira ? { tur: "durak", id: sira.id } : { tur: "yeni" }, yol: id })}
              style={{ animationDelay: `${i * 60}ms`, padding: 0, borderRadius: 20, border: `1px solid ${C.cizgi}`, background: C.muhre, cursor: "pointer", overflow: "hidden", textAlign: "left", color: C.murekkep, "--renk": o.renk }}>
              <span className="nv-resim" style={{ height: 86, background: `radial-gradient(120% 140% at 20% 0%, ${o.renk}30, ${o.renk}0D)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ position: "relative", width: 62, height: 48, display: "block", transform: "scale(1.6)" }}><YolDevinim tip={y.dev} renk={o.renk} /></span></span>
              <span style={{ display: "block", padding: "10px 12px 12px", fontFamily: T.hat, fontSize: 17.5, fontWeight: 740 }}>{y.ad}</span>
            </button>); })}
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(420px, 100%), 1fr))", gap: S.lg, marginTop: S.xl }}>
        <section style={{ background: C.muhre, border: `1px solid ${C.cizgi}`, borderRadius: 26, padding: S.lg }}>
          <h2 style={{ fontFamily: T.hat, fontSize: 22, fontWeight: 780, margin: 0 }}>Önümüzdeki yedi gün</h2>
          <div style={{ fontSize: 14.5, color: C.murekkepAlt }}>Hangi gün kaç kelime tekrar için dönecek</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 120, marginTop: S.md }}>
            {takvim.map((g, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", gap: 4, height: "100%" }}>
                <span style={{ fontSize: 13.5, fontWeight: 800, color: g.n ? C.murekkep : C.golge }}>{g.n}</span>
                <div style={{ width: "100%", maxWidth: 38, borderRadius: 9, height: `${Math.max(5, (g.n / takvimUst) * 100)}%`, background: i === 0 ? C.safran : C.lacivert, opacity: g.n ? 1 : .18, transition: "height .7s cubic-bezier(.2,.8,.2,1)" }} />
                <span style={{ fontSize: 12.5, fontWeight: i === 0 ? 800 : 500, color: C.murekkepAlt }}>{i === 0 ? "Bugün" : g.ad}</span>
              </div>
            ))}
          </div>
        </section>
        <section style={{ background: C.muhre, border: `1px solid ${C.cizgi}`, borderRadius: 26, padding: S.lg }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
            <h2 style={{ fontFamily: T.hat, fontSize: 22, fontWeight: 780, margin: 0 }}>Seyir düzeni</h2>
            <span style={{ fontSize: 14.5, color: C.murekkepAlt }}>{isi.filter((g) => g.xp > 0).length} aktif gün</span>
          </div>
          <div style={{ display: "grid", gridTemplateRows: "repeat(7, 1fr)", gridAutoFlow: "column", gap: 4, marginTop: S.md }}>
            {isi.map((g) => <span key={g.gun} title={`${trTarih(g.gun)}: ${g.xp} puan`} style={{ aspectRatio: "1", borderRadius: 5, minWidth: 8,
              background: g.xp <= 0 ? C.kagitDerin : g.xp < hedef * .5 ? "#B9CBFA" : g.xp < hedef ? "#6F92F0" : C.altin, outline: g.gun === bugun() ? `2px solid ${C.safran}` : "none" }} />)}
          </div>
          <div style={{ fontSize: 13.5, color: C.murekkepSis, marginTop: 10 }}>Her kare bir gün; renk koyulaştıkça o gün daha çok puan toplamışsın.</div>
        </section>
      </div>

      {/* hatlar */}
      <section style={{ margin: `${S.xl}px 0` }}>
        <h2 style={{ fontFamily: T.hat, fontSize: 25, fontWeight: 780, margin: `0 0 ${S.md}px`, letterSpacing: "-0.02em" }}>Hatların</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(215px, 1fr))", gap: 12 }}>
          {HATLAR.map((h) => { const i = hatIlerleme(dag, h.id); return (
            <Levha key={h.id} tikla={() => kelimeAc({ gorunum: "hat", hat: h.id })} ic={S.md}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ width: 40, height: 40, borderRadius: 99, background: h.renk, color: h.murekkep || "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: T.hat, fontWeight: 800, fontSize: 18, flexShrink: 0 }}>{h.no}</span>
                <span style={{ minWidth: 0 }}><span style={{ display: "block", fontFamily: T.hat, fontSize: 18, fontWeight: 750, lineHeight: 1.15 }}>{h.ad}</span><span style={{ fontSize: 13.5, color: C.murekkepSis }}>{h.duraklar.length} durak, {i.toplam} kelime</span></span>
              </div>
              <div style={{ marginTop: 12 }}><Cubuk deger={i.oran} renk={h.renk} boy={9} /></div>
              <div style={{ fontSize: 13.5, color: C.murekkepAlt, marginTop: 5 }}>%{i.oran} ustalaşıldı</div>
            </Levha>); })}
        </div>
      </section>

      {/* sınav pusulası */}
      <section style={{ marginBottom: S.xl }}>
        <h2 style={{ fontFamily: T.hat, fontSize: 25, fontWeight: 780, margin: 0, letterSpacing: "-0.02em" }}>Yedinin dört parçası</h2>
        <div style={{ fontSize: 15.5, color: C.murekkepAlt, margin: `2px 0 ${S.md}px`, maxWidth: 640 }}>Dört bileşenin her biri notun dörtte biri. Yedi için toplamda yüzde doksan dolayı gerekir; sınırlar her dönem biraz değişir.</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 12 }}>
          {[["p1", "Paper 1", "Yazma", "30 puan, 90 dk", C.altin], ["p2", "Paper 2 okuma", "Anlama", "40 puan, 60 dk", C.lacivert], ["p2", "Paper 2 dinleme", "Anlama", "25 puan, 60 dk", C.zumrut], ["io", "Bireysel sözlü", "Konuşma", "30 puan, 15 dk", C.erguvan]].map(([id, ad, tur, alt, renk], i) => (
            <Levha key={ad} tikla={() => git(id)} ic={S.md} style={{ borderTop: `8px solid ${renk}` }}>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: renk }}>{tur}, %25</div>
              <div style={{ fontFamily: T.hat, fontSize: 21, fontWeight: 770, lineHeight: 1.15, marginTop: 2 }}>{ad}</div>
              <div style={{ fontSize: 14.5, color: C.murekkepAlt, marginTop: 4 }}>{alt}</div>
            </Levha>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ─── Kabuk ───────────────────────────────────────────────────────── */

export default function Nahiv() {
  const [hazir, setHazir] = useState(false);
  const [profil, setProfil] = useState({ ad: null, baslangic: null, taniBitti: false });
  const [ustalik, setUstalik] = useState({});
  const [hatalar, setHatalar] = useState([]);
  const [metinler, setMetinler] = useState([]);
  const [oturumlar, setOturumlar] = useState([]);
  const [derin, setDerin] = useState({});
  const [sohbetler, setSohbetler] = useState({});
  const [esdizim, setEsdizim] = useState({});
  const [taslak, setTaslak] = useState("");
  const [dag, setDag] = useState({});
  const [rekorlar, setRekorlar] = useState({});
  const [oyun, setOyun] = useState(BOS_OYUN);
  const [sinav, setSinav] = useState({});
  const [gunluk, setGunluk] = useState({});
  const [saglik, setSaglik] = useState(undefined);
  const [tasindi, setTasindi] = useState(null);

  const [sekme, setSekmeHam] = useState("bugun");
  const [haritaSecili, setHaritaSecili] = useState(null);
  const [talimHedef, setTalimHedef] = useState(null);
  const [sokratesDugum, setSokratesDugum] = useState(null);
  const [kelimeAcilis, setKelimeAcilis] = useState(null);
  const [palet, setPalet] = useState(false);
  const [tur, setTur] = useState(0);
  const [dar, setDar] = useState(false);
  const [odakta, setOdakta] = useState(false);
  const [puanIzi, setPuanIzi] = useState(null);
  const [kutlama, setKutlama] = useState(null);
  const [olcek, setOlcek] = useState(() => { try { return parseFloat(localStorage.getItem("nahiv:olcek")) || 1; } catch { return 1; } });

  const setSekme = useCallback((id) => {
    const es = { dagarcik: "dagarcik", talim: "talim", ana: "bugun" }[id] || id;
    gecis(() => { setSekmeHam(es); setOdakta(false); setTur((t) => t + 1); window.scrollTo({ top: 0 }); });
  }, []);
  useEffect(() => { const f = () => setDar(window.innerWidth < 900); f(); window.addEventListener("resize", f); return () => window.removeEventListener("resize", f); }, []);
  useEffect(() => { try { localStorage.setItem("nahiv:olcek", String(olcek)); } catch { /* yok */ } }, [olcek]);

  const veriYukle = useCallback(async () => {
    const [p, u, h, m, o, d, s, e, t, dg, rk, oy, sn] = await Promise.all([
      sGet(K.profil, { ad: null, baslangic: null, taniBitti: false }), sGet(K.ustalik, {}), sGet(K.hatalar, []), sGet(K.metinler, []), sGet(K.oturum, []),
      sGet(K.derin, {}), sGet(K.sohbet, {}), sGet(K.esdizim, {}), sGet(K.taslak, ""), sGet(K.dagarcik, {}), sGet(K.rekor, {}), sGet(K.oyun, BOS_OYUN), sGet(K.sinav, {})
    ]);
    setProfil(p); setUstalik(u); setHatalar(h); setMetinler(m); setOturumlar(o); setDerin(d); setSohbetler(s); setEsdizim(e); setTaslak(t); setDag(dg); setRekorlar(rk);
    setOyun({ ...BOS_OYUN, ...oy }); setSinav(sn || {}); setGunluk(await sGet(K.gunluk, {}));
  }, []);

  useEffect(() => {
    (async () => {
      setSaglik(await depoSagligi());
      const mevcut = await sGet(K.hatalar, []), mevcutUst = await sGet(K.ustalik, {});
      if (!mevcut.length && !Object.keys(mevcutUst).length) {
        const eski = await eskiSurumTara();
        if (eski) { await veriYaz(eski, "birlestir"); const oz = paketOzeti(eski); setTasindi(`Eski sürümden ${oz.hatalar} hata ve ${oz.dugumler} düğüm kaydı taşındı.`); }
      }
      await veriYukle(); await gunlukYedek(); setHazir(true);
    })();
  }, [veriYukle]);

  useEffect(() => {
    const f = (ev) => { if ((ev.metaKey || ev.ctrlKey) && ev.key.toLowerCase() === "k") { ev.preventDefault(); setPalet((p) => !p); } };
    window.addEventListener("keydown", f); return () => window.removeEventListener("keydown", f);
  }, []);

  /* ── puan ── */
  const izSayac = useRef(0);
  const puanVer = useCallback((n) => {
    if (!n) return;
    setOyun((e) => {
      const y = puanEkle(e, n); sSet(K.oyun, y);
      const once = seviyeHesap(e.xp || 0), sonra = seviyeHesap(y.xp);
      if (sonra.no > once.no) setTimeout(() => { setKutlama(sonra); konfeti(140); }, 350);
      const h = e.hedef || 100;
      if (bugunPuan(e) < h && bugunPuan(y) >= h) setTimeout(() => konfeti(110), 200);
      return y;
    });
    setPuanIzi({ n, k: ++izSayac.current }); puanUcur(n);
  }, []);
  useEffect(() => { if (!puanIzi) return; const t = setTimeout(() => setPuanIzi(null), 1300); return () => clearTimeout(t); }, [puanIzi]);
  useEffect(() => { if (!kutlama) return; const t = setTimeout(() => setKutlama(null), 4200); return () => clearTimeout(t); }, [kutlama]);
  const hedefDegis = (h) => setOyun((e) => { const y = { ...e, hedef: h }; sSet(K.oyun, y); return y; });

  /* ── eylemler ── */
  const ustalikKaydet = useCallback((id, dogruMu, basamak) => {
    setUstalik((e) => { const y = { ...e, [id]: ustalikGuncelle(e[id], dogruMu, basamak) }; sSet(K.ustalik, y); return y; }); puanVer(dogruMu ? 6 : 1);
  }, [puanVer]);
  const hataEkle = useCallback((h) => {
    setHatalar((e) => {
      const ayni = e.find((x) => norm(x.hataliMetin) === norm(h.hataliMetin) && !x.cozuldu);
      const y = ayni
        ? e.map((x) => x.id === ayni.id ? { ...x, tekrarSayisi: (x.tekrarSayisi || 1) + 1, tarih: new Date().toISOString(), srs: { ...(x.srs || {}), sonrakiTarih: bugun() } } : x)
        : [...e, { id: yeniId("h"), tarih: new Date().toISOString(), tekrarSayisi: 1, cozuldu: false, srs: { tekrar: 0, aralik: 0, kolaylik: 2.5, sonrakiTarih: bugun() }, ...h }];
      sSet(K.hatalar, y.slice(-600)); return y.slice(-600);
    });
  }, []);
  const hataGuncelle = useCallback((id, yama) => { setHatalar((e) => { const y = e.map((h) => h.id === id ? { ...h, ...yama } : h); sSet(K.hatalar, y); return y; }); }, []);
  const hataSil = useCallback((id) => { setHatalar((e) => { const y = e.filter((h) => h.id !== id); sSet(K.hatalar, y); return y; }); }, []);
  const metinEkle = useCallback((m) => { setMetinler((e) => { const y = [...e, m].slice(-80); sSet(K.metinler, y); return y; }); puanVer(25); }, [puanVer]);
  const oturumBitir = useCallback((o) => { setOturumlar((e) => { const y = [...e, { id: yeniId("o"), tarih: new Date().toISOString(), ...o }].slice(-500); sSet(K.oturum, y); return y; }); }, []);
  const derinlestir = useCallback((id, veri) => { setDerin((e) => { const y = { ...e, [id]: veri }; sSet(K.derin, y); return y; }); }, []);
  const sohbetKaydet = useCallback((k, mesajlar) => { setSohbetler((e) => { const y = { ...e, [k]: mesajlar.slice(-24) }; sSet(K.sohbet, y); return y; }); }, []);
  const esdizimGuncelle = useCallback((k, srs) => { setEsdizim((e) => { const y = { ...e, [k]: srs }; sSet(K.esdizim, y); return y; }); }, []);
  const taslakKaydet = useCallback((t) => { setTaslak(t); sSet(K.taslak, t); }, []);
  const kelimeKaydet = useCallback((id, dogruMu) => {
    setDag((e) => { const y = { ...e, [id]: kelimeGuncelle(e[id], dogruMu) }; sSet(K.dagarcik, y); return y; }); puanVer(dogruMu ? 10 : 2);
  }, [puanVer]);
  const rekorKaydet = useCallback((yol, deger) => { setRekorlar((e) => { const y = { ...e, [yol]: deger }; sSet(K.rekor, y); return y; }); }, []);
  const sinavKaydet = useCallback((yama) => { setSinav((e) => { const y = { ...e, ...yama }; sSet(K.sinav, y); return y; }); }, []);

  function taniBitir({ ad, ustalik: u, yanlislar }) {
    const p = { ad, baslangic: bugun(), taniBitti: true };
    setProfil(p); sSet(K.profil, p); setUstalik(u); sSet(K.ustalik, u);
    const yeni = (yanlislar || []).map((y) => { const d = dugum(y.d) || {}; return { id: yeniId("h"), tarih: new Date().toISOString(), tekrarSayisi: 1, cozuldu: false,
      srs: { tekrar: 0, aralik: 0, kolaylik: 2.5, sonrakiTarih: bugun() }, hataliMetin: String(y.soru).replace("___", `[${y.verilen}]`), dogruMetin: String(y.soru).replace("___", `[${y.dogruCevap}]`),
      dugumId: y.d, dugumAdi: d.tr, aile: d.a, hataTuru: "yanlis-secim", l1Kaynakli: (d.l1 || 0) >= 2, l1Aciklama: d.t || null, maliyet: Math.min(5, 2 + (d.l1 || 0)), kaynak: "tanı", baglam: "Tanı sınavı", aciklama: d.k || null }; });
    setHatalar(yeni); sSet(K.hatalar, yeni);
    oturumBitir({ tur: "tani", dogru: TANI.length - yanlislar.length, toplam: TANI.length, saniye: 720 }); puanVer(60);
  }
  function taniAtla(ad) { const p = { ad: ad || profil.ad, baslangic: bugun(), taniBitti: true }; setProfil(p); sSet(K.profil, p); }

  const gitDugum = useCallback((id) => { setHaritaSecili(id); setSekme("harita"); }, [setSekme]);
  const calisDugum = useCallback((id) => { setTalimHedef(id); setSekme("talim"); }, [setSekme]);
  const konusDugum = useCallback((id) => { setSokratesDugum(id); setSekme("sokrates"); }, [setSekme]);
  const kelimeAc = useCallback((a) => { setKelimeAcilis({ ...a }); setSekme("dagarcik"); }, [setSekme]);

  const komutlar = useMemo(() => {
    const k = [];
    GRUPLAR.forEach((g) => g.sekmeler.forEach(([id, ad]) => k.push({ ad, grup: g.ad, oncelik: 1, calistir: () => setSekme(id) })));
    k.push({ ad: "Kelime tekrarlarını yap", grup: "eylem", oncelik: 1, calistir: () => kelimeAc({ gorunum: "studyo", kapsam: { tur: "vadesi" }, yol: "kart" }) });
    k.push({ ad: "Yedek al, verini dışa aktar", grup: "eylem", oncelik: 1, calistir: () => setSekme("sandik") });
    TUM_YOLLAR.forEach((y) => k.push({ ad: `${y.ad}, kelime yolu`, grup: "stüdyo", calistir: () => kelimeAc({ gorunum: "studyo", yol: null }) }));
    HATLAR.forEach((h) => k.push({ ad: `${h.ad} hattı`, grup: "hat", calistir: () => kelimeAc({ gorunum: "hat", hat: h.id }) }));
    Object.values(DURAK_META).forEach((d) => k.push({ ad: `${d.ad} durağı`, grup: d.hatAd, calistir: () => kelimeAc({ gorunum: "studyo", kapsam: { tur: "durak", id: d.id }, yol: null }) }));
    DUGUMLER.forEach((d) => k.push({ ad: d.tr, grup: aileKisa(d.a), calistir: () => gitDugum(d.id) }));
    return k;
  }, [gitDugum, kelimeAc, setSekme]);

  if (!hazir) return (
    <div style={{ minHeight: "100vh", background: C.gece, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: S.md }}>
      <style>{STIL}</style>
      <div style={{ fontFamily: T.hat, fontWeight: 800, fontSize: 44, letterSpacing: "-0.03em", color: "#fff" }}>NAHİV</div>
      <div style={{ width: 120, height: 5, borderRadius: 5, background: "#25376A", overflow: "hidden" }}><div style={{ width: "40%", height: "100%", background: C.safran, animation: "nvKaydir 1s ease-in-out infinite" }} /></div>
    </div>
  );
  if (!profil.taniBitti) return (
    <div style={{ minHeight: "100vh", background: C.kagit, fontFamily: T.govde, color: C.murekkep, zoom: olcek }}>
      <style>{STIL}</style>
      <TaniSinavi bitir={taniBitir} />
      <div style={{ textAlign: "center", paddingBottom: S.xxl }}><Dugme tur="sessiz" tikla={() => taniAtla(null)}>Tanı sınavını şimdilik geç, doğrudan uygulamaya gir</Dugme></div>
    </div>
  );

  const grup = GRUP_BUL(sekme), sv = seviyeHesap(oyun.xp), seri = seriGun(oyun), bp = bugunPuan(oyun), hedef = oyun.hedef || 100;
  const kuyruk = bekleyenTekrarlar(hatalar).length;
  const genis = ["bugun", "dagarcik", "turler", "p1", "p2", "io"].includes(sekme);

  return (
    <div style={{ minHeight: "100vh", background: `radial-gradient(1200px 500px at 85% -10%, ${C.altinSis} 0%, transparent 60%), radial-gradient(900px 480px at -10% 30%, ${C.laciSis} 0%, transparent 55%), ${C.kagit}`,
      backgroundAttachment: "fixed", fontFamily: T.govde, color: C.murekkep, zoom: olcek }}>
      <style>{STIL}</style>
      <Acilis />

      {/* üst çubuk */}
      <header style={{ position: "sticky", top: 0, zIndex: 40, background: "rgba(238,243,248,.88)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", borderBottom: `1px solid ${C.cizgi}` }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: `10px ${dar ? S.md : S.lg}px`, display: "flex", alignItems: "center", gap: S.md }}>
          <button onClick={() => setSekme("bugun")} aria-label="Ana sayfa" style={{ display: "flex", alignItems: "center", gap: 9, border: "none", background: "transparent", cursor: "pointer", padding: 0, color: C.murekkep }}>
            <span style={{ width: 40, height: 40, borderRadius: 13, background: C.altin, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: T.hat, fontWeight: 800, fontSize: 22, boxShadow: `0 6px 14px -6px ${C.altin}` }}>N</span>
            {!dar && <span style={{ fontFamily: T.hat, fontWeight: 800, fontSize: 23, letterSpacing: "-0.03em" }}>NAHİV</span>}
          </button>
          {!dar && (
            <nav style={{ display: "flex", gap: 4, background: C.kagitDerin, padding: 4, borderRadius: 99, marginLeft: S.sm }}>
              {GRUPLAR.map((g) => { const et = g.id === grup.id, I = g.ikon; return (
                <button key={g.id} onClick={() => setSekme(g.sekmeler[0][0])} style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 16px", minHeight: 42, borderRadius: 99, border: "none", cursor: "pointer", fontSize: 15.5, fontWeight: 750,
                  background: et ? C.murekkep : "transparent", color: et ? "#fff" : C.murekkepAlt, transition: "background .2s, color .2s" }}><I size={17} /> {g.ad}</button>); })}
            </nav>
          )}
          <span style={{ flex: 1 }} />
          <div style={{ display: "flex", alignItems: "center", gap: 2, background: C.muhre, border: `1px solid ${C.cizgi}`, borderRadius: 99, padding: 2 }} title="Yazı boyu">
            <button onClick={() => setOlcek((o) => Math.max(0.9, Math.round((o - 0.05) * 100) / 100))} aria-label="Yazıyı küçült" style={olcekDugme}><Minus size={15} /></button>
            <span style={{ fontSize: 13, fontWeight: 800, width: 22, textAlign: "center" }}>A</span>
            <button onClick={() => setOlcek((o) => Math.min(1.3, Math.round((o + 0.05) * 100) / 100))} aria-label="Yazıyı büyüt" style={olcekDugme}><Plus size={15} /></button>
          </div>
          <button id="nv-puan-hedef" onClick={() => setSekme("bugun")} style={{ position: "relative", display: "flex", alignItems: "center", gap: 9, padding: "5px 14px 5px 5px", borderRadius: 99, border: `1px solid ${C.cizgi}`, background: C.muhre, cursor: "pointer", color: C.murekkep }}>
            <Halka deger={Math.min(100, (bp / hedef) * 100)} boy={36} kalinlik={5} renk={bp >= hedef ? C.zumrut : C.altin} ic={<Flame size={15} style={{ color: seri > 0 ? C.lal : C.golge }} />} />
            <span style={{ textAlign: "left", lineHeight: 1.15 }}>
              <span style={{ display: "block", fontSize: 14.5, fontWeight: 800 }}>{dar ? oyun.xp : sv.ad}</span>
              <span style={{ display: "block", fontSize: 12.5, color: C.murekkepSis }}>{dar ? "puan" : `${oyun.xp} puan${seri ? `, ${seri} gün` : ""}`}</span>
            </span>
            {puanIzi && <span key={puanIzi.k} style={{ position: "absolute", right: 8, top: -6, fontWeight: 800, fontSize: 17, color: C.zumrut, animation: "nvPuan 1.25s ease both", pointerEvents: "none" }}>+{puanIzi.n}</span>}
          </button>
          <button onClick={() => setPalet(true)} aria-label="Komut paleti" style={{ width: 42, height: 42, borderRadius: 99, border: `1px solid ${C.cizgi}`, background: C.muhre, cursor: "pointer", color: C.murekkepAlt, display: "flex", alignItems: "center", justifyContent: "center" }}><Command size={18} /></button>
        </div>
        {grup.sekmeler.length > 1 && !odakta && (
          <div style={{ maxWidth: 1180, margin: "0 auto", padding: `0 ${dar ? S.md : S.lg}px 10px`, display: "flex", gap: 6, overflowX: "auto" }}>
            {grup.sekmeler.map(([id, ad]) => { const et = sekme === id; return (
              <button key={id} onClick={() => setSekme(id)} style={{ flex: "0 0 auto", padding: "8px 16px", minHeight: 40, borderRadius: 99, cursor: "pointer", fontSize: 15, fontWeight: 700,
                border: `2px solid ${et ? C.altin : "transparent"}`, background: et ? C.altinSis : "transparent", color: et ? C.altin : C.murekkepAlt }}>
                {ad}{id === "defter" && kuyruk > 0 ? ` (${kuyruk})` : ""}</button>); })}
          </div>
        )}
      </header>

      <main style={{ maxWidth: genis ? 1180 : 940, margin: "0 auto", padding: `${S.lg}px ${dar ? S.md : S.lg}px ${dar ? 120 : S.xxxl}px` }}>
        <div key={sekme + ":" + tur} className="nv-gir">
          {sekme === "bugun" && <AnaSayfa puanVer={puanVer} profil={profil} oyun={oyun} hedefDegis={hedefDegis} dag={dag} hatalar={hatalar} ustalik={ustalik} sinav={sinav} git={setSekme} kelimeAc={kelimeAc} />}
          {sekme === "dagarcik" && <Dagarcik dag={dag} kelimeKaydet={kelimeKaydet} rekorlar={rekorlar} rekorKaydet={rekorKaydet} hataEkle={hataEkle} oturumBitir={oturumBitir} acilis={kelimeAcilis} odak={setOdakta} />}
          {sekme === "turler" && <MetinTurleri puanVer={puanVer} />}
          {sekme === "p1" && <Paper1 sinav={sinav} sinavKaydet={sinavKaydet} puanVer={puanVer} git={setSekme} />}
          {sekme === "p2" && <Paper2 sinav={sinav} sinavKaydet={sinavKaydet} puanVer={puanVer} />}
          {sekme === "io" && <IO sinav={sinav} sinavKaydet={sinavKaydet} puanVer={puanVer} />}
          {sekme === "divan" && <Divan profil={profil} ustalik={ustalik} hatalar={hatalar} metinler={metinler} oturumlar={oturumlar} esdizim={esdizim} git={setSekme} gitDugum={gitDugum} calis={calisDugum} sonDisa={gunluk.sonDisa} tasindi={tasindi} dag={dag} />}
          {sekme === "yazihane" && <Yazihane hatalar={hatalar} ustalik={ustalik} metinler={metinler} hataEkle={hataEkle} metinEkle={metinEkle} oturumBitir={oturumBitir} taslak={taslak} taslakKaydet={taslakKaydet} derinlestir={derinlestir} />}
          {sekme === "sesli" && <Sesli hataEkle={hataEkle} metinEkle={metinEkle} oturumBitir={oturumBitir} hatalar={hatalar} ustalik={ustalik} />}
          {sekme === "talim" && <Talimhane ustalik={ustalik} hatalar={hatalar} hedef={talimHedef} setHedef={setTalimHedef} kaydet={ustalikKaydet} hataEkle={hataEkle} oturumBitir={oturumBitir} esdizim={esdizim} esdizimGuncelle={esdizimGuncelle} />}
          {sekme === "sokrates" && <Sokrates dugumId={sokratesDugum} setDugumId={setSokratesDugum} gecmisler={sohbetler} gecmisKaydet={sohbetKaydet} hatalar={hatalar} />}
          {sekme === "harita" && <Harita ustalik={ustalik} hatalar={hatalar} derin={derin} derinlestir={derinlestir} secili={haritaSecili} setSecili={setHaritaSecili} calis={calisDugum} konus={konusDugum} />}
          {sekme === "defter" && <Defter hatalar={hatalar} guncelle={hataGuncelle} sil={hataSil} git={gitDugum} ustalik={ustalik} />}
          {sekme === "seyir" && <Seyir ustalik={ustalik} hatalar={hatalar} metinler={metinler} oturumlar={oturumlar} />}
          {sekme === "sandik" && <Sandik saglik={saglik} yenile={veriYukle} ozet={{ hatalar: hatalar.length, dugumler: Object.keys(ustalik).length, metinler: metinler.length, oturumlar: oturumlar.length, baslangic: profil.baslangic, kelimeler: Object.keys(dag).length }} />}
        </div>
      </main>

      {/* alt çubuk: dar ekran */}
      {dar && !odakta && (
        <nav style={{ position: "fixed", left: 10, right: 10, bottom: 10, zIndex: 40, display: "flex", background: C.gece, borderRadius: 24, padding: 6, boxShadow: "0 18px 34px -14px rgba(11,22,48,.7)" }}>
          {GRUPLAR.map((g) => { const et = g.id === grup.id, I = g.ikon; return (
            <button key={g.id} onClick={() => setSekme(g.sekmeler[0][0])} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "9px 2px", minHeight: 58, borderRadius: 18, border: "none", cursor: "pointer",
              background: et ? "#fff" : "transparent", color: et ? C.gece : "#B9C7E6", transition: "background .2s" }}>
              <I size={21} /><span style={{ fontSize: 12.5, fontWeight: 750 }}>{g.ad}</span></button>); })}
        </nav>
      )}

      {kutlama && (
        <div className="nv-gir" role="status" style={{ position: "fixed", left: "50%", top: 84, transform: "translateX(-50%)", zIndex: 60, background: C.gece, color: "#fff", borderRadius: 22, padding: "16px 24px", boxShadow: "0 24px 44px -18px rgba(11,22,48,.8)", textAlign: "center", width: "min(92vw, 380px)" }}>
          <div style={{ fontSize: 14.5, color: C.safran, fontWeight: 700 }}>Yeni iskeleye yanaştın</div>
          <div style={{ fontFamily: T.hat, fontSize: 30, fontWeight: 800, letterSpacing: "-0.02em" }}>{kutlama.no}. {kutlama.ad}</div>
        </div>
      )}
      {palet && <KomutPaleti kapat={() => setPalet(false)} komutlar={komutlar} />}
    </div>
  );
}
const olcekDugme = { width: 34, height: 34, borderRadius: 99, border: "none", background: "transparent", cursor: "pointer", color: C.murekkepAlt, display: "flex", alignItems: "center", justifyContent: "center" };
