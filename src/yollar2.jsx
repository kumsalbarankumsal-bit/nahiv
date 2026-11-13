/* ══════════════════════════════════════════════════════════════════════
   Y E N İ   Ç A L I Ş M A   Y O L L A R I
   Kartlar, Maraton, Cümle dizgisi, Yabancıyı bul, Aktarma, Harf avı,
   Daktilo, Radyo, Yükselt. Hepsi aynı sözleşmeyi kullanır:
   { kelimeler, dag, kaydet(id, dogruMu), cik, enIyi, rekorKaydet }
   ══════════════════════════════════════════════════════════════════════ */
import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Volume2, RotateCcw, Check, X, Play, Pause, SkipForward, ChevronRight, Heart, Keyboard, Shuffle } from "lucide-react";
import {
  C, T, S, KELIMELER, HATLAR, DURAK_META, SEVIYE_RENK, turYaz, karistir, celdiriciler, soruKur, vurgula,
  seslendir, sesVar, titre, kivilcim, Dugme, Nisan, Levha, Bos, Cubuk, OturumUst, SonucEkrani, KelimeBasligi, kelimeEsit
} from "./cekirdek.jsx";
import { YUKSELT } from "./veri/yukselt.js";
import { cin } from "./hareket.jsx";

/* Örnek cümlede hedef kelimeyi kalın gösterir */
export function OrnekCumle({ k, style }) {
  const parcalar = vurgula(k.w, k.ornek).split(/\[\[|\]\]/);
  return (
    <div style={{ fontFamily: T.kalem, fontSize: 17, lineHeight: 1.7, color: C.murekkepAlt, ...style }}>
      {parcalar.map((p, i) => i % 2 ? <b key={i} style={{ color: C.murekkep, background: C.safranSis, borderRadius: 5, padding: "0 3px" }}>{p}</b> : <span key={i}>{p}</span>)}
    </div>
  );
}

function SesDugme({ metin, boy = 20, renk = C.altin }) {
  if (!sesVar()) return null;
  return (
    <button onClick={(e) => { e.stopPropagation(); seslendir(metin); }} aria-label="Seslendir"
      style={{ border: "none", background: renk + "16", color: renk, cursor: "pointer", width: boy + 22, height: boy + 22,
        borderRadius: 99, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <Volume2 size={boy} />
    </button>
  );
}

/* Henüz görülmemiş ve vadesi gelmiş kelimeleri öne alır */
function sirala(kelimeler, dag, kac) {
  const bugunIso = new Date().toISOString().slice(0, 10);
  const puan = (k) => { const s = dag[k.id]; if (!s || !s.kutu) return 0; if (s.sonrakiTarih && s.sonrakiTarih <= bugunIso) return 1; return s.usta ? 3 : 2; };
  return karistir(kelimeler).sort((a, b) => puan(a) - puan(b)).slice(0, kac);
}

/* ─── 1. KARTLAR ──────────────────────────────────────────────────── */

export function KartYolu({ kelimeler, dag, kaydet, cik }) {
  const [kuyruk, setKuyruk] = useState(() => sirala(kelimeler, dag, 30));
  const [toplam] = useState(() => Math.min(30, kelimeler.length));
  const [cevrik, setCevrik] = useState(false);
  const [bilinen, setBilinen] = useState(0);
  const [gorulen, setGorulen] = useState(0);
  const [cikis, setCikis] = useState(null);
  const ilk = useRef(new Set());
  const k = kuyruk[0];

  const cevap = useCallback((ok) => {
    if (!k || cikis) return;
    if (!ilk.current.has(k.id)) { ilk.current.add(k.id); kaydet(k.id, ok); setGorulen((g) => g + 1); if (ok) setBilinen((b) => b + 1); }
    titre(ok ? 8 : 4); cin(ok);
    setCikis(ok ? "sag" : "sol");
    setTimeout(() => {
      setKuyruk((q) => ok ? q.slice(1) : [...q.slice(1), q[0]]);
      setCevrik(false); setCikis(null);
    }, 230);
  }, [k, cikis, kaydet]);

  useEffect(() => {
    const f = (e) => {
      if (e.key === " " || e.key === "Enter") { e.preventDefault(); setCevrik((c) => !c); }
      else if (e.key === "ArrowRight") cevap(true);
      else if (e.key === "ArrowLeft") cevap(false);
    };
    window.addEventListener("keydown", f);
    return () => window.removeEventListener("keydown", f);
  }, [cevap]);

  if (!toplam) return <Bos baslik="Kart yok" aciklama="Bu kapsamda kelime bulunmuyor." eylem={cik} eylemAd="Geri dön" />;
  if (!k) return <SonucEkrani dogru={bilinen} toplam={toplam} cik={cik} />;
  const m = DURAK_META[k.durak];

  return (
    <div>
      <OturumUst i={toplam - kuyruk.length} n={toplam} skor={bilinen} baslik="Kartlar" cik={cik} />
      <div style={{ perspective: 1400, maxWidth: 560, margin: "0 auto" }}>
        <div onClick={() => setCevrik((c) => !c)} role="button" aria-label="Kartı çevir"
          style={{ position: "relative", height: 340, cursor: "pointer", transformStyle: "preserve-3d",
            transition: "transform .5s cubic-bezier(.2,.8,.25,1), opacity .22s",
            transform: `${cikis === "sag" ? "translateX(70px) rotate(7deg)" : cikis === "sol" ? "translateX(-70px) rotate(-7deg)" : ""} rotateY(${cevrik ? 180 : 0}deg)`,
            opacity: cikis ? 0 : 1 }}>
          {/* ön yüz */}
          <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden",
            background: C.muhre, border: `1px solid ${C.cizgi}`, borderTop: `10px solid ${m.renk}`, borderRadius: 24,
            boxShadow: "0 22px 40px -26px rgba(15,27,51,.5)", padding: S.lg, display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Nisan renk={m.renk} zemin={m.acik}>{m.ad}</Nisan>
              <Nisan kucuk renk={SEVIYE_RENK[k.lv]}>{k.lv}</Nisan>
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: S.md }}>
              <div style={{ fontFamily: T.hat, fontSize: k.w.length > 22 ? 28 : k.w.length > 12 ? 36 : 46, fontWeight: 720, letterSpacing: "-0.02em", lineHeight: 1.1, color: C.murekkep }}>{k.w}</div>
              <div style={{ display: "flex", alignItems: "center", gap: S.sm }}>
                <span style={{ ...T.s, color: C.murekkepSis }}>{turYaz(k.pos)}</span>
                <SesDugme metin={k.w} boy={17} renk={m.koyu || m.renk} />
              </div>
            </div>
            <div style={{ ...T.xs, color: C.murekkepSis, textAlign: "center" }}>Çevirmek için dokun</div>
          </div>
          {/* arka yüz */}
          <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", transform: "rotateY(180deg)",
            background: m.acik, border: `1px solid ${m.renk}55`, borderTop: `10px solid ${m.renk}`, borderRadius: 24,
            boxShadow: "0 22px 40px -26px rgba(15,27,51,.5)", padding: S.lg, display: "flex", flexDirection: "column", gap: S.md, overflow: "auto" }}>
            <div style={{ fontFamily: T.hat, fontSize: 27, fontWeight: 720, color: m.koyu || m.renk, lineHeight: 1.2 }}>{k.tr}</div>
            <OrnekCumle k={k} />
            <div style={{ ...T.s, color: C.murekkepAlt }}><b style={{ color: C.murekkep }}>Birlikte:</b> <span style={{ fontFamily: T.kalem }}>{k.esdizim}</span></div>
            <span style={{ flex: 1 }} />
            <div style={{ display: "flex", alignItems: "center", gap: S.sm }}>
              <SesDugme metin={k.ornek} boy={16} renk={m.koyu || m.renk} />
              <span style={{ ...T.xs, color: C.murekkepAlt }}>cümleyi dinle</span>
            </div>
          </div>
        </div>
      </div>
      <div style={{ display: "flex", gap: S.sm, maxWidth: 560, margin: `${S.lg}px auto 0` }}>
        <Dugme tur="ikincil" tam tikla={() => cevap(false)}><RotateCcw size={16} /> Tekrar göster</Dugme>
        <Dugme tur="altin" tam tikla={() => cevap(true)}><Check size={16} /> Biliyorum</Dugme>
      </div>
      <div style={{ ...T.xs, color: C.murekkepSis, textAlign: "center", marginTop: S.md }}>Klavyede: boşluk çevirir, sağ ok biliyorum, sol ok tekrar.</div>
    </div>
  );
}

/* ─── 2. MARATON ──────────────────────────────────────────────────── */

export function MaratonYolu({ kelimeler, dag, kaydet, cik }) {
  const [liste] = useState(() => sirala(kelimeler, dag, 40));
  const gruplar = useMemo(() => { const g = []; for (let i = 0; i < liste.length; i += 5) g.push(liste.slice(i, i + 5)); return g; }, [liste]);
  const [gi, setGi] = useState(0);
  const [asama, setAsama] = useState("tanis");
  const [sira, setSira] = useState([]);
  const [secim, setSecim] = useState(null);
  const [dogru, setDogru] = useState(0);
  const [yanlislar, setYanlislar] = useState([]);
  const sorulan = useRef(new Set());
  const grup = gruplar[gi] || [];
  const k = sira[0];
  const soru = useMemo(() => (k ? soruKur(sira.length % 2 ? "trBul" : "enBul", k, kelimeler.length > 5 ? kelimeler : KELIMELER) : null), [k && k.id, sira.length]);

  if (!liste.length) return <Bos baslik="Kelime yok" aciklama="Bu kapsamda kelime bulunmuyor." eylem={cik} eylemAd="Geri dön" />;
  if (gi >= gruplar.length) return <SonucEkrani dogru={dogru} toplam={liste.length} yanlislar={yanlislar} cik={cik} />;

  function sec(id) {
    if (secim) return;
    const ok = id === soru.dogruId;
    if (!sorulan.current.has(k.id)) {
      sorulan.current.add(k.id); kaydet(k.id, ok);
      if (ok) setDogru((d) => d + 1); else setYanlislar((y) => [...y, k]);
    }
    titre(ok ? 8 : 4); cin(ok);
    setSecim(id);
  }
  function ileri() {
    const ok = secim === soru.dogruId;
    const yeni = ok ? sira.slice(1) : [...sira.slice(1), sira[0]];
    setSecim(null);
    if (yeni.length) setSira(yeni);
    else { setSira([]); setAsama("tanis"); setGi(gi + 1); }
  }

  return (
    <div>
      <OturumUst i={gi} n={gruplar.length} skor={dogru} baslik="Maraton" cik={cik} />
      {/* etap şeridi */}
      <div style={{ display: "flex", alignItems: "center", gap: 0, margin: `0 0 ${S.lg}px`, overflowX: "auto", padding: "4px 2px" }}>
        {gruplar.map((_, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span style={{ flex: "1 0 14px", height: 5, background: i <= gi ? C.altin : C.kagitDerin }} />}
            <span style={{ width: 26, height: 26, borderRadius: 99, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
              background: i < gi ? C.altin : C.muhre, border: `4px solid ${i <= gi ? C.altin : C.kagitDerin}`,
              color: i < gi ? "#fff" : C.murekkepAlt, fontSize: 12, fontWeight: 800 }}>{i < gi ? <Check size={13} /> : i + 1}</span>
          </React.Fragment>
        ))}
      </div>

      {asama === "tanis" ? (
        <div style={{ display: "grid", gap: S.sm }}>
          <div style={{ fontFamily: T.hat, ...T.d2, color: C.murekkep }}>{gi + 1}. etap: önce tanış</div>
          <div style={{ ...T.s, color: C.murekkepAlt, marginBottom: S.sm }}>Beş kelimeyi oku, dinle. Hazır olunca sınan; yanlış yaptığın kelime etabın sonunda yeniden gelir.</div>
          {grup.map((w) => (
            <Levha key={w.id} ic={S.md} renk={DURAK_META[w.durak].renk}>
              <div style={{ display: "flex", alignItems: "center", gap: S.md }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: S.sm, flexWrap: "wrap" }}>
                    <span style={{ fontFamily: T.hat, fontSize: 22, fontWeight: 700, color: C.murekkep }}>{w.w}</span>
                    <span style={{ ...T.s, color: C.altin, fontWeight: 700 }}>{w.tr}</span>
                  </div>
                  <OrnekCumle k={w} style={{ fontSize: 15.5, marginTop: 4 }} />
                </div>
                <SesDugme metin={w.w} boy={17} />
              </div>
            </Levha>
          ))}
          <Dugme tur="altin" tam tikla={() => { setSira(karistir(grup)); setAsama("sina"); }}>Hazırım, sına <ChevronRight size={16} /></Dugme>
        </div>
      ) : soru && (
        <div>
          <Levha ic={S.lg} style={{ textAlign: "center", borderTop: `8px solid ${DURAK_META[k.durak].renk}` }}>
            <div style={{ ...T.s, color: C.murekkepSis, marginBottom: S.sm }}>{soru.soru}</div>
            <div style={{ fontFamily: T.hat, fontSize: 30, fontWeight: 720, color: C.murekkep, lineHeight: 1.2 }}>{soru.metin}</div>
          </Levha>
          <Secenekler soru={soru} secim={secim} sec={sec} />
          {secim && <div style={{ marginTop: S.md }}><Dugme tam tikla={ileri}>{secim === soru.dogruId ? "Devam" : "Anladım, sonra yeniden sor"}</Dugme></div>}
        </div>
      )}
    </div>
  );
}

export function Secenekler({ soru, secim, sec, kalem }) {
  return (
    <div style={{ display: "grid", gap: S.sm, marginTop: S.md, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
      {soru.secenekler.map((o, n) => {
        const secildi = secim === o.id, dogruSec = secim && o.id === soru.dogruId;
        return (
          <button key={o.id} onClick={() => sec(o.id)} disabled={!!secim} className={secim && dogruSec ? "n-dogru" : secim && secildi ? "n-yanlis" : "n-secenek"}
            style={{ textAlign: "left", border: `2px solid ${secim ? (dogruSec ? C.zumrut : secildi ? C.lal : C.cizgi) : C.cizgi}`,
              background: secim && dogruSec ? C.zumSis : secim && secildi ? C.lalSis : C.muhre,
              borderRadius: 16, padding: `${S.md}px ${S.md}px`, minHeight: 58, cursor: secim ? "default" : "pointer",
              fontFamily: kalem ? T.kalem : T.govde, fontSize: 17.5, color: C.murekkep, display: "flex", alignItems: "center", gap: S.md }}>
            <span style={{ width: 28, height: 28, borderRadius: 9, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
              background: secim && dogruSec ? C.zumrut : secim && secildi ? C.lal : C.kagitAlt,
              color: secim && (dogruSec || secildi) ? "#fff" : C.murekkepAlt, fontSize: 13.5, fontWeight: 800 }}>
              {secim && dogruSec ? <Check size={15} /> : secim && secildi ? <X size={15} /> : "ABCD"[n]}
            </span>
            <span style={{ flex: 1 }}>{o.t}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ─── 3. CÜMLE DİZGİSİ ────────────────────────────────────────────── */

export function DizgiYolu({ kelimeler, dag, kaydet, cik }) {
  const uygun = useMemo(() => kelimeler.filter((k) => { const n = k.ornek.split(/\s+/).length; return n >= 5 && n <= 13; }), [kelimeler]);
  const [liste] = useState(() => sirala(uygun, dag, 10));
  const [i, setI] = useState(0);
  const [dogru, setDogru] = useState(0);
  const [yanlislar, setYanlislar] = useState([]);
  const k = liste[i];
  const hedef = useMemo(() => (k ? k.ornek.split(/\s+/) : []), [k && k.id]);
  const [havuz, setHavuz] = useState([]);
  const [dizi, setDizi] = useState([]);
  const [durum, setDurum] = useState(null);

  useEffect(() => {
    if (!k) return;
    let h = karistir(hedef.map((t, n) => ({ t, n })));
    if (h.every((x, n) => x.n === n) && h.length > 1) h = [...h.slice(1), h[0]];
    setHavuz(h); setDizi([]); setDurum(null);
  }, [k && k.id]);

  if (!liste.length) return <Bos baslik="Uygun cümle yok" aciklama="Bu kapsamda dizilecek uzunlukta örnek cümle bulunmuyor." eylem={cik} eylemAd="Geri dön" />;
  if (i >= liste.length) return <SonucEkrani dogru={dogru} toplam={liste.length} yanlislar={yanlislar} cik={cik} />;

  function ekle(x) { if (durum) return; setHavuz((h) => h.filter((y) => y.n !== x.n)); setDizi((d) => [...d, x]); }
  function cikar(x) { if (durum) return; setDizi((d) => d.filter((y) => y.n !== x.n)); setHavuz((h) => [...h, x]); }
  function denetle() {
    const ok = dizi.map((x) => x.t).join(" ") === hedef.join(" ");
    kaydet(k.id, ok); titre(ok ? 10 : 5); cin(ok);
    if (ok) setDogru((d) => d + 1); else setYanlislar((y) => [...y, k]);
    setDurum(ok ? "dogru" : "yanlis");
  }
  const parca = (x, tikla, dolu) => (
    <button key={x.n} onClick={() => tikla(x)}
      style={{ fontFamily: T.kalem, fontSize: 17, padding: "9px 13px", minHeight: 44, borderRadius: 12, cursor: durum ? "default" : "pointer",
        border: `2px solid ${dolu ? C.altin : C.golge}`, background: dolu ? C.altinSis : C.muhre, color: C.murekkep,
        boxShadow: dolu ? "none" : "0 3px 0 " + C.golge }}>{x.t}</button>
  );

  return (
    <div>
      <OturumUst i={i} n={liste.length} skor={dogru} baslik="Cümle dizgisi" cik={cik} />
      <Levha ic={S.lg}>
        <div style={{ ...T.s, color: C.murekkepSis }}>Bu kelimeyi içeren cümleyi sırasına koy</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: S.sm, flexWrap: "wrap", marginTop: 4 }}>
          <span style={{ fontFamily: T.hat, fontSize: 26, fontWeight: 720 }}>{k.w}</span>
          <span style={{ ...T.m, color: C.altin, fontWeight: 700 }}>{k.tr}</span>
        </div>
        <div style={{ minHeight: 118, marginTop: S.md, padding: S.md, borderRadius: 16, display: "flex", flexWrap: "wrap", gap: 8, alignContent: "flex-start",
          background: durum === "dogru" ? C.zumSis : durum === "yanlis" ? C.lalSis : C.kagitAlt,
          border: `2px dashed ${durum === "dogru" ? C.zumrut : durum === "yanlis" ? C.lal : C.golge}` }}>
          {dizi.length === 0 && <span style={{ ...T.s, color: C.murekkepSis }}>Aşağıdaki sözcüklere sırayla dokun.</span>}
          {dizi.map((x) => parca(x, cikar, true))}
        </div>
      </Levha>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: S.md, minHeight: 56 }}>{havuz.map((x) => parca(x, ekle, false))}</div>
      {durum === "yanlis" && (
        <Levha ic={S.md} renk={C.zumrut} style={{ marginTop: S.md }}>
          <div style={{ ...T.xs, color: C.zumrut, fontWeight: 700 }}>Doğru sıra</div>
          <OrnekCumle k={k} />
        </Levha>
      )}
      <div style={{ marginTop: S.md, display: "flex", gap: S.sm }}>
        {!durum
          ? <Dugme tur="altin" tam pasif={havuz.length > 0} tikla={denetle}>Denetle</Dugme>
          : <Dugme tam tikla={() => setI(i + 1)}>{i + 1 < liste.length ? "Sonraki cümle" : "Turu bitir"}</Dugme>}
        {!durum && dizi.length > 0 && <Dugme tur="ikincil" tikla={() => { setHavuz([...havuz, ...dizi]); setDizi([]); }}><RotateCcw size={15} /></Dugme>}
      </div>
    </div>
  );
}

/* ─── 4. YABANCIYI BUL ────────────────────────────────────────────── */

export function YabanciYolu({ kelimeler, kaydet, cik }) {
  const turlar = useMemo(() => {
    const gruplu = {};
    kelimeler.forEach((k) => { (gruplu[k.durak] = gruplu[k.durak] || []).push(k); });
    const duraklar = karistir(Object.keys(gruplu).filter((d) => gruplu[d].length >= 3));
    const sonuc = [];
    for (let n = 0; n < 10 && duraklar.length; n++) {
      const d = duraklar[n % duraklar.length];
      const uc = karistir(gruplu[d]).slice(0, 3);
      const hat = DURAK_META[d].hat;
      const adaylar = KELIMELER.filter((x) => x.hat !== hat && x.lv === uc[0].lv && !x.duraklar.some((y) => DURAK_META[y].hat === hat));
      const yabanci = adaylar[Math.floor(Math.random() * adaylar.length)];
      if (yabanci) sonuc.push({ durak: d, yabanci, secenekler: karistir([...uc, yabanci]) });
    }
    return sonuc;
  }, [kelimeler]);
  const [i, setI] = useState(0);
  const [secim, setSecim] = useState(null);
  const [dogru, setDogru] = useState(0);
  const t = turlar[i];

  if (!turlar.length) return <Bos baslik="Yeterli kelime yok" aciklama="Bu oyun için aynı duraktan en az üç kelime gerekir. Bir durak ya da hat seç." eylem={cik} eylemAd="Geri dön" />;
  if (i >= turlar.length) return <SonucEkrani dogru={dogru} toplam={turlar.length} cik={cik} />;

  function sec(k) {
    if (secim) return;
    const ok = k.id === t.yabanci.id;
    if (ok) { setDogru((d) => d + 1); t.secenekler.filter((x) => x.id !== t.yabanci.id).forEach((x) => kaydet(x.id, true)); }
    titre(ok ? 9 : 4); cin(ok); setSecim(k.id);
  }
  return (
    <div>
      <OturumUst i={i} n={turlar.length} skor={dogru} baslik="Yabancıyı bul" cik={cik} />
      <div style={{ fontFamily: T.hat, ...T.d2, marginBottom: 4 }}>Hangisi bu duraktan değil?</div>
      <div style={{ ...T.s, color: C.murekkepAlt, marginBottom: S.md }}>Üç kelime aynı konudan, biri başka hattan bindi.</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: S.sm }}>
        {t.secenekler.map((k) => {
          const yab = k.id === t.yabanci.id, sec_ = secim === k.id, m = DURAK_META[k.durak];
          return (
            <button key={k.id} onClick={() => sec(k)} disabled={!!secim} className={secim && yab ? "n-dogru" : secim && sec_ ? "n-yanlis" : "n-secenek"}
              style={{ textAlign: "left", padding: S.md, minHeight: 96, borderRadius: 18, cursor: secim ? "default" : "pointer",
                border: `2px solid ${secim ? (yab ? C.zumrut : sec_ ? C.lal : C.cizgi) : C.cizgi}`,
                background: secim ? (yab ? C.zumSis : sec_ ? C.lalSis : C.muhre) : C.muhre, color: C.murekkep }}>
              <div style={{ fontFamily: T.hat, fontSize: 22, fontWeight: 700 }}>{k.w}</div>
              {secim && <div style={{ marginTop: 6 }}>
                <div style={{ ...T.s, color: C.murekkepAlt }}>{k.tr}</div>
                <div style={{ marginTop: 6 }}><Nisan kucuk renk={m.renk} zemin={m.acik}>{m.ad}</Nisan></div>
              </div>}
            </button>
          );
        })}
      </div>
      {secim && <div style={{ marginTop: S.md }}><Dugme tam tikla={() => { setSecim(null); setI(i + 1); }}>{i + 1 < turlar.length ? "Sonraki" : "Turu bitir"}</Dugme></div>}
    </div>
  );
}

/* ─── 5. AKTARMA ──────────────────────────────────────────────────── */

export function AktarmaYolu({ kelimeler, dag, kaydet, cik }) {
  const [liste] = useState(() => sirala(kelimeler, dag, 14));
  const [i, setI] = useState(0);
  const [secim, setSecim] = useState(null);
  const [dogru, setDogru] = useState(0);
  const [yanlislar, setYanlislar] = useState([]);
  const k = liste[i];
  const secenekler = useMemo(() => {
    if (!k) return [];
    const hat = DURAK_META[k.durak].hat;
    const digerHatlar = karistir(HATLAR.filter((h) => h.id !== hat && !k.duraklar.some((d) => DURAK_META[d].hat === h.id))).slice(0, 3);
    const yanlis = digerHatlar.map((h) => h.duraklar[Math.floor(Math.random() * h.duraklar.length)][0]);
    return karistir([k.durak, ...yanlis]);
  }, [k && k.id]);

  if (!liste.length) return <Bos baslik="Kelime yok" aciklama="Bu kapsamda kelime bulunmuyor." eylem={cik} eylemAd="Geri dön" />;
  if (i >= liste.length) return <SonucEkrani dogru={dogru} toplam={liste.length} yanlislar={yanlislar} cik={cik} />;

  function sec(d) {
    if (secim) return;
    const ok = k.duraklar.includes(d);
    kaydet(k.id, ok); titre(ok ? 9 : 4); cin(ok);
    if (ok) setDogru((x) => x + 1); else setYanlislar((y) => [...y, k]);
    setSecim(d);
  }
  return (
    <div>
      <OturumUst i={i} n={liste.length} skor={dogru} baslik="Aktarma" cik={cik} />
      <Levha ic={S.lg} style={{ textAlign: "center" }}>
        <div style={{ ...T.s, color: C.murekkepSis }}>Bu kelime hangi durakta iner?</div>
        <div style={{ fontFamily: T.hat, fontSize: 34, fontWeight: 740, letterSpacing: "-0.02em", margin: "6px 0" }}>{k.w}</div>
        <div style={{ ...T.m, color: C.altin, fontWeight: 700 }}>{k.tr}</div>
      </Levha>
      <div style={{ display: "grid", gap: S.sm, marginTop: S.md, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
        {secenekler.map((d) => {
          const m = DURAK_META[d], dogruMu = k.duraklar.includes(d), sec_ = secim === d;
          return (
            <button key={d} onClick={() => sec(d)} disabled={!!secim} className={secim && dogruMu ? "n-dogru" : secim && sec_ ? "n-yanlis" : "n-secenek"}
              style={{ display: "flex", alignItems: "center", gap: S.md, textAlign: "left", padding: S.md, minHeight: 66, borderRadius: 16,
                cursor: secim ? "default" : "pointer", color: C.murekkep,
                border: `2px solid ${secim ? (dogruMu ? C.zumrut : sec_ ? C.lal : C.cizgi) : C.cizgi}`,
                background: secim ? (dogruMu ? C.zumSis : sec_ ? C.lalSis : C.muhre) : C.muhre }}>
              <span style={{ width: 38, height: 38, borderRadius: 99, background: m.renk, color: m.murekkep || "#fff", flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center", fontFamily: T.hat, fontWeight: 800, fontSize: 17 }}>{m.hatNo}</span>
              <span>
                <span style={{ display: "block", fontSize: 17.5, fontWeight: 700 }}>{m.ad}</span>
                <span style={{ display: "block", ...T.xs, color: C.murekkepSis }}>{m.hatAd}</span>
              </span>
            </button>
          );
        })}
      </div>
      {secim && (
        <div style={{ marginTop: S.md, display: "grid", gap: S.sm }}>
          <Levha ic={S.md} style={{ background: C.kagitAlt }}><OrnekCumle k={k} /></Levha>
          <Dugme tam tikla={() => { setSecim(null); setI(i + 1); }}>{i + 1 < liste.length ? "Sonraki" : "Turu bitir"}</Dugme>
        </div>
      )}
    </div>
  );
}

/* ─── 6. HARF AVI ─────────────────────────────────────────────────── */

const ALFABE = "abcdefghijklmnopqrstuvwxyz".split("");

export function HarfAviYolu({ kelimeler, dag, kaydet, cik }) {
  const uygun = useMemo(() => kelimeler.filter((k) => /^[a-zA-Z' -]+$/.test(k.w) && k.w.length <= 18 && k.w.replace(/[^a-z]/gi, "").length >= 4), [kelimeler]);
  const [liste] = useState(() => sirala(uygun, dag, 8));
  const [i, setI] = useState(0);
  const [denenen, setDenenen] = useState([]);
  const [dogru, setDogru] = useState(0);
  const [yanlislar, setYanlislar] = useState([]);
  const [bitti, setBitti] = useState(null);
  const k = liste[i];
  const harfler = k ? k.w.toLowerCase() : "";
  const hata = denenen.filter((h) => !harfler.includes(h)).length;
  const CAN = 6;

  const dene = useCallback((h) => {
    if (!k || bitti || denenen.includes(h)) return;
    const yeni = [...denenen, h];
    setDenenen(yeni);
    const tamam = harfler.split("").every((c) => !/[a-z]/.test(c) || yeni.includes(c));
    const yanlis = yeni.filter((c) => !harfler.includes(c)).length;
    if (tamam) { setBitti("kazandi"); kaydet(k.id, true); setDogru((d) => d + 1); titre(14); }
    else if (yanlis >= CAN) { setBitti("kaybetti"); kaydet(k.id, false); setYanlislar((y) => [...y, k]); titre(5); }
  }, [k, bitti, denenen, harfler, kaydet]);

  useEffect(() => {
    const f = (e) => { const h = e.key.toLowerCase(); if (/^[a-z]$/.test(h)) dene(h); else if (e.key === "Enter" && bitti) ileri(); };
    window.addEventListener("keydown", f);
    return () => window.removeEventListener("keydown", f);
  });
  function ileri() { setDenenen([]); setBitti(null); setI((x) => x + 1); }

  if (!liste.length) return <Bos baslik="Uygun kelime yok" aciklama="Bu kapsamda harf avına uygun kelime bulunmuyor." eylem={cik} eylemAd="Geri dön" />;
  if (i >= liste.length) return <SonucEkrani dogru={dogru} toplam={liste.length} yanlislar={yanlislar} cik={cik} />;

  return (
    <div>
      <OturumUst i={i} n={liste.length} skor={dogru} baslik="Harf avı" cik={cik} />
      <Levha ic={S.lg}>
        {/* vapur iskeleden uzaklaşır */}
        <div style={{ position: "relative", height: 62, borderRadius: 14, overflow: "hidden", background: `linear-gradient(180deg, ${C.laciSis} 0 58%, ${C.laciAcik}55 58% 100%)`, marginBottom: S.md }}>
          <div style={{ position: "absolute", left: 0, bottom: 20, width: 46, height: 9, background: C.murekkepAlt, borderRadius: "0 4px 4px 0" }} />
          <div style={{ position: "absolute", left: 10, bottom: 8, width: 5, height: 14, background: C.murekkepAlt }} />
          <div style={{ position: "absolute", left: 30, bottom: 8, width: 5, height: 14, background: C.murekkepAlt }} />
          <div style={{ position: "absolute", bottom: 17, left: `calc(52px + ${(hata / CAN) * 78}%)`, transition: "left .5s cubic-bezier(.3,.7,.3,1)" }}>
            <svg width="62" height="34" viewBox="0 0 62 34"><rect x="34" y="2" width="8" height="12" fill={C.safran} /><rect x="34" y="2" width="8" height="4" fill={C.murekkep} />
              <rect x="14" y="12" width="36" height="9" rx="2" fill="#fff" stroke={C.murekkep} strokeWidth="1.5" /><path d="M2 20 h58 l-7 12 h-44 Z" fill={C.murekkep} /></svg>
          </div>
          <div style={{ position: "absolute", right: 10, top: 8, display: "flex", gap: 3 }}>
            {Array.from({ length: CAN }, (_, n) => <Heart key={n} size={15} fill={n < CAN - hata ? C.lal : "none"} color={n < CAN - hata ? C.lal : C.golge} />)}
          </div>
        </div>
        <div style={{ ...T.m, color: C.altin, fontWeight: 700, textAlign: "center" }}>{k.tr}</div>
        <div style={{ ...T.xs, color: C.murekkepSis, textAlign: "center" }}>{turYaz(k.pos)} · {DURAK_META[k.durak].ad}</div>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 6, margin: `${S.lg}px 0 ${S.sm}px` }}>
          {k.w.split("").map((c, n) => {
            const harf = /[a-z]/i.test(c), acik = !harf || denenen.includes(c.toLowerCase()) || bitti;
            return harf
              ? <span key={n} style={{ width: 30, height: 42, borderBottom: `4px solid ${bitti === "kaybetti" && !denenen.includes(c.toLowerCase()) ? C.lal : C.murekkep}`,
                  display: "flex", alignItems: "center", justifyContent: "center", fontFamily: T.kalem, fontSize: 26, fontWeight: 700,
                  color: bitti === "kaybetti" && !denenen.includes(c.toLowerCase()) ? C.lal : C.murekkep }}>{acik ? c : ""}</span>
              : <span key={n} style={{ width: 16, fontFamily: T.kalem, fontSize: 26, textAlign: "center" }}>{c === " " ? "" : c}</span>;
          })}
        </div>
      </Levha>
      {!bitti ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(44px, 1fr))", gap: 6, marginTop: S.md }}>
          {ALFABE.map((h) => {
            const d = denenen.includes(h), var_ = harfler.includes(h);
            return <button key={h} onClick={() => dene(h)} disabled={d}
              style={{ height: 48, borderRadius: 12, fontFamily: T.kalem, fontSize: 20, fontWeight: 700, textTransform: "uppercase", cursor: d ? "default" : "pointer",
                border: `2px solid ${d ? (var_ ? C.zumrut : C.kagitDerin) : C.golge}`, background: d ? (var_ ? C.zumSis : C.kagitAlt) : C.muhre,
                color: d ? (var_ ? C.zumrut : C.golge) : C.murekkep, boxShadow: d ? "none" : "0 3px 0 " + C.golge }}>{h}</button>;
          })}
        </div>
      ) : (
        <div style={{ marginTop: S.md, display: "grid", gap: S.sm }}>
          <Levha ic={S.md} renk={bitti === "kazandi" ? C.zumrut : C.lal}>
            <div style={{ ...T.s, fontWeight: 700, color: bitti === "kazandi" ? C.zumrut : C.lal }}>{bitti === "kazandi" ? "Vapur iskelede kaldı." : "Vapur kaçtı. Kelime buydu:"}</div>
            <OrnekCumle k={k} style={{ marginTop: 4 }} />
          </Levha>
          <Dugme tam tikla={ileri}>{i + 1 < liste.length ? "Sonraki kelime" : "Turu bitir"}</Dugme>
        </div>
      )}
    </div>
  );
}

/* ─── 7. DAKTİLO ──────────────────────────────────────────────────── */

export function DaktiloYolu({ kelimeler, kaydet, cik, enIyi, rekorKaydet }) {
  const SURE = 75;
  const [sira] = useState(() => karistir(kelimeler.filter((k) => k.w.length <= 22)));
  const [i, setI] = useState(0);
  const [girdi, setGirdi] = useState("");
  const [kalan, setKalan] = useState(SURE);
  const [basladi, setBasladi] = useState(false);
  const [puan, setPuan] = useState(0);
  const [seri, setSeri] = useState(0);
  const [dogru, setDogru] = useState(0);
  const [toplam, setToplam] = useState(0);
  const [gecen, setGecen] = useState(null);
  const [yanlislar, setYanlislar] = useState([]);
  const kutu = useRef(null);
  const k = sira.length ? sira[i % sira.length] : null;

  useEffect(() => {
    if (!basladi || kalan <= 0) return;
    const t = setTimeout(() => setKalan((x) => x - 1), 1000);
    return () => clearTimeout(t);
  }, [basladi, kalan]);
  useEffect(() => { if (basladi && kutu.current) kutu.current.focus(); }, [basladi, i]);
  useEffect(() => { if (kalan === 0 && rekorKaydet && (enIyi == null || puan > enIyi) && puan > 0) rekorKaydet(puan); }, [kalan]);

  if (!sira.length) return <Bos baslik="Kelime yok" aciklama="Bu kapsamda kelime bulunmuyor." eylem={cik} eylemAd="Geri dön" />;
  if (kalan === 0) return <SonucEkrani dogru={dogru} toplam={toplam} enIyi={enIyi} yeniRekor={enIyi == null ? puan > 0 : puan > enIyi} yanlislar={yanlislar.slice(0, 12)} cik={cik}
    ek={<Levha ic={S.md} style={{ textAlign: "center" }}><span style={{ fontFamily: T.hat, fontSize: 30, fontWeight: 740, color: C.altin }}>{puan}</span> <span style={{ ...T.s, color: C.murekkepAlt }}>puan</span></Levha>} />;

  function gonder(atla) {
    if (!k) return;
    const ok = !atla && kelimeEsit(girdi, k.w).ok;
    kaydet(k.id, ok); setToplam((t) => t + 1);
    if (ok) { const s = seri + 1; setSeri(s); setDogru((d) => d + 1); setPuan((p) => p + 10 + Math.min(s, 10) * 2); titre(7); setGecen({ ok: true, k }); }
    else { setSeri(0); setYanlislar((y) => [...y, k]); setGecen({ ok: false, k }); }
    setGirdi(""); setI((x) => x + 1);
  }

  if (!basladi) return (
    <div>
      <OturumUst i={0} n={0} baslik="Daktilo" cik={cik} />
      <Levha ic={S.xl} style={{ textAlign: "center" }}>
        <Keyboard size={40} style={{ color: C.altin }} />
        <div style={{ fontFamily: T.hat, ...T.d1, margin: `${S.sm}px 0` }}>75 saniye, klavye senin</div>
        <div style={{ ...T.m, color: C.murekkepAlt, maxWidth: 440, margin: "0 auto" }}>Türkçesi görünür, İngilizcesini yazıp Enter'a basarsın. Üst üste doğrular puanı büyütür. Takılırsan “Geç” de.</div>
        {enIyi != null && <div style={{ ...T.s, color: C.murekkepSis, marginTop: S.sm }}>En iyin: {enIyi} puan</div>}
        <div style={{ marginTop: S.lg }}><Dugme tur="altin" tikla={() => setBasladi(true)}><Play size={16} /> Başla</Dugme></div>
      </Levha>
    </div>
  );
  return (
    <div>
      <OturumUst i={0} n={0} skor={puan} sayac={kalan} baslik="Daktilo" cik={cik} />
      <Cubuk deger={(kalan / SURE) * 100} renk={kalan < 11 ? C.lal : C.altin} boy={10} />
      <Levha ic={S.lg} style={{ marginTop: S.md, textAlign: "center" }}>
        <div style={{ ...T.xs, color: C.murekkepSis }}>{turYaz(k.pos)} · {k.w.length} harf · {k.w[0]}…</div>
        <div style={{ fontFamily: T.hat, fontSize: 30, fontWeight: 720, margin: "8px 0 16px", lineHeight: 1.2 }}>{k.tr}</div>
        <input ref={kutu} value={girdi} onChange={(e) => setGirdi(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") gonder(false); }}
          autoCapitalize="none" autoCorrect="off" spellCheck={false} placeholder="İngilizcesi…"
          style={{ width: "100%", maxWidth: 440, textAlign: "center", fontFamily: T.kalem, fontSize: 24, padding: "12px 14px", borderRadius: 14,
            border: `2px solid ${C.golge}`, outline: "none", color: C.murekkep, background: C.kagitAlt }} />
        <div style={{ display: "flex", gap: S.sm, justifyContent: "center", marginTop: S.md }}>
          <Dugme tur="ikincil" tikla={() => gonder(true)}><SkipForward size={15} /> Geç</Dugme>
          <Dugme tur="altin" tikla={() => gonder(false)}>Gönder</Dugme>
        </div>
        {seri > 1 && <div style={{ marginTop: S.sm }}><Nisan renk={C.safranKoyu} zemin={C.safranSis}>{seri} üst üste</Nisan></div>}
      </Levha>
      {gecen && (
        <div style={{ marginTop: S.sm, ...T.s, textAlign: "center", color: gecen.ok ? C.zumrut : C.lal, fontWeight: 700 }}>
          {gecen.ok ? "Doğru: " : "Doğrusu: "}<span style={{ fontFamily: T.kalem }}>{gecen.k.w}</span> <span style={{ color: C.murekkepSis, fontWeight: 400 }}>({gecen.k.tr})</span>
        </div>
      )}
    </div>
  );
}

/* ─── 8. RADYO ────────────────────────────────────────────────────── */

export function RadyoYolu({ kelimeler, dag, cik }) {
  const [liste] = useState(() => sirala(kelimeler, dag, 40));
  const [i, setI] = useState(0);
  const [calar, setCalar] = useState(false);
  const [adim, setAdim] = useState(0);
  const [hiz, setHiz] = useState(0.9);
  const k = liste[i];

  useEffect(() => {
    if (!calar || !k) return;
    let iptal = false;
    const bekle = (ms) => new Promise((r) => setTimeout(r, ms));
    (async () => {
      setAdim(0); seslendir(k.w, hiz); await bekle(1900); if (iptal) return;
      setAdim(1); await bekle(1700); if (iptal) return;
      setAdim(2); seslendir(k.ornek, hiz); await bekle(Math.max(3200, k.ornek.length * 78 / hiz)); if (iptal) return;
      seslendir(k.w, hiz); await bekle(1600); if (iptal) return;
      if (i + 1 < liste.length) setI(i + 1); else setCalar(false);
    })();
    return () => { iptal = true; try { window.speechSynthesis.cancel(); } catch { /* yok */ } };
  }, [calar, i, hiz]);

  if (!sesVar()) return <Bos baslik="Bu cihazda ses yok" aciklama="Radyo, tarayıcının seslendirme özelliğini kullanır. Başka bir çalışma yolu seç." eylem={cik} eylemAd="Geri dön" />;
  if (!liste.length) return <Bos baslik="Kelime yok" aciklama="Bu kapsamda kelime bulunmuyor." eylem={cik} eylemAd="Geri dön" />;
  const m = DURAK_META[k.durak];

  return (
    <div>
      <OturumUst i={i} n={liste.length} baslik="Radyo" cik={cik} />
      <div style={{ background: C.gece, borderRadius: 24, padding: S.xl, color: "#fff", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-end", gap: 5, height: 46, marginBottom: S.md }}>
          {Array.from({ length: 17 }, (_, n) => <i key={n} style={{ width: 6, borderRadius: 4, background: n % 3 === 0 ? C.safran : "#8FB0FF",
            height: calar ? 12 + ((n * 37) % 30) : 6, transformOrigin: "bottom", animation: calar ? `nvDalga ${0.7 + (n % 5) * 0.13}s ${n * 0.05}s ease-in-out infinite` : "none" }} />)}
        </div>
        <div style={{ display: "inline-block", padding: "3px 12px", borderRadius: 99, background: m.renk, color: m.murekkep || "#fff", fontSize: 13.5, fontWeight: 700 }}>{m.ad}</div>
        <div style={{ fontFamily: T.hat, fontSize: 40, fontWeight: 740, letterSpacing: "-0.02em", margin: "12px 0 6px" }}>{k.w}</div>
        <div style={{ fontSize: 20, fontWeight: 700, color: C.safran, minHeight: 30, opacity: adim >= 1 || !calar ? 1 : 0, transition: "opacity .4s" }}>{k.tr}</div>
        <div style={{ fontFamily: T.kalem, fontSize: 17, lineHeight: 1.6, color: "#D6E0F5", marginTop: 10, minHeight: 56, opacity: adim >= 2 || !calar ? 1 : 0, transition: "opacity .4s" }}>{k.ornek}</div>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: S.md, marginTop: S.lg }}>
          <button onClick={() => { setCalar(false); setI(Math.max(0, i - 1)); }} aria-label="Önceki" style={radyoDugme}><SkipForward size={20} style={{ transform: "rotate(180deg)" }} /></button>
          <button onClick={() => setCalar(!calar)} aria-label={calar ? "Duraklat" : "Çal"}
            style={{ ...radyoDugme, width: 72, height: 72, background: C.safran, color: C.gece }}>{calar ? <Pause size={30} /> : <Play size={30} />}</button>
          <button onClick={() => { if (i + 1 < liste.length) setI(i + 1); }} aria-label="Sonraki" style={radyoDugme}><SkipForward size={20} /></button>
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: S.md }}>
          {[0.7, 0.9, 1.1].map((h) => <button key={h} onClick={() => setHiz(h)}
            style={{ padding: "6px 14px", borderRadius: 99, cursor: "pointer", fontSize: 14, fontWeight: 700, border: "1.5px solid #3A4E80",
              background: hiz === h ? "#fff" : "transparent", color: hiz === h ? C.gece : "#C9D6F2" }}>{h === 0.7 ? "yavaş" : h === 0.9 ? "normal" : "hızlı"}</button>)}
        </div>
      </div>
      <div style={{ ...T.s, color: C.murekkepAlt, marginTop: S.md, textAlign: "center" }}>Kelime, anlamı ve cümlesi sırayla okunur. Ekrana bakmadan, yürürken ya da gözlerini dinlendirirken dinleyebilirsin.</div>
    </div>
  );
}
const radyoDugme = { width: 52, height: 52, borderRadius: 99, border: "none", cursor: "pointer", background: "#1E2F5C", color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center" };

/* ─── 9. YÜKSELT ──────────────────────────────────────────────────── */

export function YukseltYolu({ cik, enIyi, rekorKaydet }) {
  const [liste] = useState(() => karistir(YUKSELT).slice(0, 12));
  const [i, setI] = useState(0);
  const [secim, setSecim] = useState(null);
  const [dogru, setDogru] = useState(0);
  const y = liste[i];
  const soru = useMemo(() => {
    if (!y) return null;
    const dogruSec = y.guclu[Math.floor(Math.random() * y.guclu.length)];
    const havuz = (ayniTur) => karistir(YUKSELT.filter((x) => x.sade !== y.sade && (!ayniTur || x.tur === y.tur)).flatMap((x) => x.guclu)).filter((g) => !y.guclu.includes(g));
    let digerleri = [...new Set(havuz(true))].slice(0, 3);
    if (digerleri.length < 3) digerleri = [...new Set([...digerleri, ...havuz(false)])].slice(0, 3);
    return { dogruId: dogruSec, secenekler: karistir([dogruSec, ...digerleri]).map((t) => ({ id: t, t })) };
  }, [y && y.sade]);

  useEffect(() => { if (i >= liste.length && rekorKaydet && (enIyi == null || dogru > enIyi)) rekorKaydet(dogru); }, [i]);
  if (i >= liste.length) return <SonucEkrani dogru={dogru} toplam={liste.length} enIyi={enIyi} cik={cik} />;

  function sec(id) { if (secim) return; const ok = id === soru.dogruId; if (ok) setDogru((d) => d + 1); titre(ok ? 9 : 4); cin(ok); setSecim(id); }
  const parcalar = y.ornek.split(/\[|\]/);
  return (
    <div>
      <OturumUst i={i} n={liste.length} skor={dogru} baslik="Yükselt" cik={cik} />
      <Levha ic={S.lg}>
        <div style={{ ...T.s, color: C.murekkepSis }}>Sade sözcüğün yerine hangisi geçer?</div>
        <div style={{ fontFamily: T.kalem, fontSize: 21, lineHeight: 1.6, marginTop: 6 }}>
          {parcalar.map((p, n) => n % 2
            ? <b key={n} style={{ background: secim ? C.zumSis : C.safranSis, borderRadius: 6, padding: "1px 6px", color: secim ? C.zumrut : C.murekkep,
                textDecoration: secim ? "none" : "underline wavy " + C.safran, textUnderlineOffset: 5 }}>{secim ? soru.dogruId : p}</b>
            : <span key={n}>{p}</span>)}
        </div>
        <div style={{ ...T.s, color: C.murekkepAlt, marginTop: 6 }}>{y.tr}</div>
      </Levha>
      <Secenekler soru={soru} secim={secim} sec={sec} kalem />
      {secim && (
        <div style={{ marginTop: S.md, display: "grid", gap: S.sm }}>
          <Levha ic={S.md} renk={C.mor}>
            <div style={{ ...T.s, color: C.murekkepAlt }}><b style={{ color: C.murekkep, fontFamily: T.kalem }}>{y.sade}</b> yerine kullanabileceklerin:</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
              {y.guclu.map((g) => <span key={g} style={{ fontFamily: T.kalem, fontSize: 16.5, padding: "5px 12px", borderRadius: 99, background: C.morSis, color: C.mor, fontWeight: 700 }}>{g}</span>)}
            </div>
            {y.not && <div style={{ ...T.xs, color: C.murekkepAlt, marginTop: 8 }}>{y.not}</div>}
          </Levha>
          <Dugme tam tikla={() => { setSecim(null); setI(i + 1); }}>{i + 1 < liste.length ? "Sonraki" : "Turu bitir"}</Dugme>
        </div>
      )}
    </div>
  );
}
