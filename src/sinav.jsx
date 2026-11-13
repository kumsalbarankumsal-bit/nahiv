/* ══════════════════════════════════════════════════════════════════════
   S I N A V   M E R K E Z İ
   Metin Türleri · Paper 1 · Paper 2 · Bireysel sözlü (IO)
   ══════════════════════════════════════════════════════════════════════ */
import React, { useState, useEffect, useMemo, useRef } from "react";
import { Check, X, ChevronDown, ChevronRight, ChevronLeft, Play, Pause, RotateCcw, Sparkles, Volume2, Eye, EyeOff, Shuffle, Timer, PenLine, Send, Square } from "lucide-react";
import { C, T, S, HATLAR, karistir, sor, sorJSON, seslendir, sesVar, titre, konfeti, yeniId, trTarih, Dugme, Nisan, Levha, Bos, Cubuk, Halka, Bekle, Haber, kelimeSay } from "./cekirdek.jsx";
import { KAVRAMLAR, METIN_TURLERI, KAT_AD, P1_OLCUT, P1_KUNYE, P1_PLAN, P1_DENETIM, P1_GOREVLER } from "./veri/sinav-metin.js";
import { P2_KUNYE, P2_TIPLER, P2_DINLEME, P2_METINLER, IO_KUNYE, IO_BOLUMLER, IO_OLCUT, IO_ISKELET, IO_ZAMAN_KALIP, IO_PARCA_SORU, IO_TEMA_SORU } from "./veri/sinav-p2io.js";

const TUR = Object.fromEntries(METIN_TURLERI.map((t) => [t.id, t]));
const TEMA = Object.fromEntries(HATLAR.map((h) => [h.id, h]));
const KAT_RENK = { kisisel: C.erguvan, mesleki: C.lacivert, kitle: C.altin };

/* ─── Ortak parçalar ──────────────────────────────────────────────── */

function Sayfa({ ad, alt, renk = C.altin, children, sag }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: S.lg, flexWrap: "wrap", marginBottom: S.lg }}>
        <div style={{ flex: "1 1 320px" }}>
          <h1 style={{ fontFamily: T.hat, ...T.d0, margin: 0 }}>{ad}</h1>
          {alt && <div style={{ ...T.m, color: C.murekkepAlt, marginTop: 6, maxWidth: 640 }}>{alt}</div>}
        </div>
        {sag}
      </div>
      {children}
    </div>
  );
}
function Bolum({ ad, alt, children, renk = C.murekkep }) {
  return (
    <section style={{ marginBottom: S.xl }}>
      <h2 style={{ fontFamily: T.hat, ...T.d2, margin: `0 0 4px`, color: renk }}>{ad}</h2>
      {alt && <div style={{ ...T.s, color: C.murekkepAlt, marginBottom: S.md, maxWidth: 680 }}>{alt}</div>}
      {!alt && <div style={{ height: S.sm }} />}
      {children}
    </section>
  );
}
function Kunye({ satirlar, renk }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 1, background: C.cizgi, border: `1px solid ${C.cizgi}`, borderRadius: 18, overflow: "hidden" }}>
      {satirlar.map(([a, b]) => (
        <div key={a} style={{ background: C.muhre, padding: `${S.md}px ${S.md}px` }}>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: renk }}>{a}</div>
          <div style={{ fontSize: 16.5, color: C.murekkep, marginTop: 2, lineHeight: 1.4 }}>{b}</div>
        </div>
      ))}
    </div>
  );
}
function Acilir({ baslik, alt, renk = C.altin, children, acikBasla, sag }) {
  const [acik, setAcik] = useState(!!acikBasla);
  return (
    <div style={{ background: C.muhre, border: `1px solid ${acik ? renk + "77" : C.cizgi}`, borderRadius: 18, overflow: "hidden" }}>
      <button onClick={() => setAcik(!acik)} style={{ width: "100%", display: "flex", alignItems: "center", gap: S.md, padding: `${S.md}px ${S.md}px`, minHeight: 60, border: "none", background: "transparent", cursor: "pointer", textAlign: "left", color: C.murekkep }}>
        <span style={{ width: 8, alignSelf: "stretch", borderRadius: 4, background: renk }} />
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: "block", fontFamily: T.hat, fontSize: 19, fontWeight: 720 }}>{baslik}</span>
          {alt && <span style={{ display: "block", fontSize: 14.5, color: C.murekkepAlt }}>{alt}</span>}
        </span>
        {sag}
        <ChevronDown size={20} style={{ color: C.murekkepSis, transform: acik ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
      </button>
      {acik && <div className="nv-gir" style={{ padding: `0 ${S.md}px ${S.md}px ${S.md + 20}px` }}>{children}</div>}
    </div>
  );
}
const Liste = ({ ogeler, renk = C.altin }) => (
  <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: 7 }}>
    {ogeler.map((o, i) => <li key={i} style={{ display: "flex", gap: 10, fontSize: 16.5, lineHeight: 1.5, color: C.murekkep }}>
      <span style={{ width: 8, height: 8, borderRadius: 99, background: renk, marginTop: 9, flexShrink: 0 }} /><span>{o}</span></li>)}
  </ul>
);
const Kalip = ({ t }) => (
  <button onClick={() => sesVar() && seslendir(t.replace(/…/g, ""))} title="Dinlemek için dokun"
    style={{ fontFamily: T.kalem, fontSize: 15.5, padding: "7px 13px", borderRadius: 12, border: `1px solid ${C.cizgi}`, background: C.kagitAlt, color: C.murekkep, cursor: "pointer", textAlign: "left" }}>{t}</button>
);

/* Açıklamalı model: her cümlenin işlevi yanında */
function Model({ satirlar, renk }) {
  const [gizli, setGizli] = useState(false);
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 6 }}>
        <Dugme tur="sessiz" kucuk tikla={() => setGizli(!gizli)}>{gizli ? <Eye size={15} /> : <EyeOff size={15} />} {gizli ? "İşlevleri göster" : "İşlevleri gizle, kendin bul"}</Dugme>
      </div>
      <div style={{ display: "grid", gap: 6 }}>
        {satirlar.map(([c, islev], i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: 2, padding: "9px 12px", borderRadius: 12, background: i % 2 ? C.kagitAlt : "transparent" }}>
            <span style={{ fontFamily: T.kalem, fontSize: 16.5, lineHeight: 1.6, color: C.murekkep }}>{c}</span>
            {!gizli && <span style={{ fontSize: 14.5, color: renk, fontWeight: 650 }}>({islev})</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

function useSayac(saniye, calisiyor, bitince) {
  const [kalan, setKalan] = useState(saniye);
  useEffect(() => setKalan(saniye), [saniye]);
  useEffect(() => {
    if (!calisiyor) return;
    if (kalan <= 0) { bitince && bitince(); return; }
    const t = setTimeout(() => setKalan((k) => k - 1), 1000);
    return () => clearTimeout(t);
  }, [calisiyor, kalan]);
  return [kalan, setKalan];
}
const sure = (sn) => `${String(Math.floor(Math.max(0, sn) / 60)).padStart(2, "0")}:${String(Math.max(0, sn) % 60).padStart(2, "0")}`;

/* ══════════════════════ METİN TÜRLERİ ══════════════════════ */

export function MetinTurleri({ puanVer }) {
  const [secili, setSecili] = useState(null);
  const [kat, setKat] = useState(null);
  const [alistirma, setAlistirma] = useState(false);
  const t = secili ? TUR[secili] : null;

  if (alistirma) return <TurSecme cik={() => setAlistirma(false)} puanVer={puanVer} />;
  if (t) {
    const renk = KAT_RENK[t.kat];
    return (
      <div className="nv-gir">
        <Dugme tur="sessiz" kucuk tikla={() => setSecili(null)}><ChevronLeft size={16} /> Bütün türler</Dugme>
        <div style={{ background: renk, color: "#fff", borderRadius: 24, padding: S.lg, margin: `${S.sm}px 0 ${S.lg}px` }}>
          <div style={{ fontSize: 14.5, fontWeight: 700, opacity: .9 }}>{KAT_AD[t.kat]}</div>
          <h1 style={{ fontFamily: T.hat, fontSize: 38, fontWeight: 780, letterSpacing: "-0.025em", margin: "2px 0 0", lineHeight: 1.05 }}>{t.ad}</h1>
          <div style={{ fontFamily: T.kalem, fontSize: 18, opacity: .92, marginTop: 4 }}>{t.en}</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: S.sm, marginBottom: S.lg }}>
          {[["Kime yazılır", t.kitle], ["Ne için", t.amac], ["Üslup", t.uslup]].map(([a, b]) => (
            <Levha key={a} ic={S.md}><div style={{ fontSize: 13.5, fontWeight: 700, color: renk }}>{a}</div><div style={{ fontSize: 16.5, lineHeight: 1.45, marginTop: 3 }}>{b}</div></Levha>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: S.lg }}>
          <Bolum ad="İskelet" alt="Yukarıdan aşağıya, kâğıtta görünmesi gereken sıra.">
            <ol style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: 8 }}>
              {t.yapi.map((y, i) => (
                <li key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", fontSize: 16.5, lineHeight: 1.45 }}>
                  <span style={{ width: 28, height: 28, borderRadius: 99, background: renk, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14, flexShrink: 0 }}>{i + 1}</span>
                  <span style={{ paddingTop: 2 }}>{y}</span>
                </li>
              ))}
            </ol>
          </Bolum>
          <div>
            <Bolum ad="Hazır kalıplar" alt="Dokununca seslendirilir.">
              <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>{t.kalip.map((k) => <Kalip key={k} t={k} />)}</div>
            </Bolum>
            <Bolum ad="Puan kaybettiren tuzaklar" renk={C.lal}><Liste ogeler={t.tuzak} renk={C.lal} /></Bolum>
          </div>
        </div>
        <Bolum ad="Açıklamalı model" alt={`Görev: ${t.gorev} Aşağıdaki metin tam uzunlukta değil; türün iskeletini gösteren kısa bir örnek. Her cümlenin işlevi parantez içinde.`}>
          <Levha ic={S.md}><Model satirlar={t.model} renk={renk} /></Levha>
        </Bolum>
        <TamModel t={t} />
      </div>
    );
  }
  return (
    <Sayfa ad="Metin türleri" alt="Paper 1'de kavramsal anlayış puanının tamamı buradan gelir: doğru türü seçmek, o türün biçimini ve sesini tutturmak. On yedi tür, her biri iskeleti, kalıpları, tuzakları ve açıklamalı modeliyle.">
      <Bolum ad="Beş kavram" alt="Her görevde önce bu beş soruyu sor; metin türünü ve üslubu bunlar belirler.">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: S.sm }}>
          {KAVRAMLAR.map((k, i) => (
            <Levha key={k.en} ic={S.md} style={{ borderTop: `6px solid ${[C.altin, C.lacivert, C.erguvan, C.safran, C.zumrut][i]}` }}>
              <div style={{ fontFamily: T.hat, fontSize: 20, fontWeight: 760 }}>{k.tr}</div>
              <div style={{ fontFamily: T.kalem, fontSize: 14.5, color: C.murekkepSis }}>{k.en}</div>
              <div style={{ fontSize: 16, fontWeight: 700, margin: "8px 0 4px" }}>{k.soru}</div>
              <div style={{ fontSize: 14.5, lineHeight: 1.45, color: C.murekkepAlt }}>{k.ac}</div>
            </Levha>
          ))}
        </div>
      </Bolum>
      <div style={{ background: C.gece, color: "#fff", borderRadius: 22, padding: S.lg, marginBottom: S.xl, display: "flex", alignItems: "center", gap: S.lg, flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 300px" }}>
          <div style={{ fontFamily: T.hat, fontSize: 23, fontWeight: 760 }}>Tür seçme alıştırması</div>
          <div style={{ fontSize: 16, color: "#C5D2EE", marginTop: 2 }}>Sınavdaki gibi bir görev ve üç seçenek. En uygun türü seç, gerekçesini gör. {P1_GOREVLER.length} görev.</div>
        </div>
        <Dugme tikla={() => setAlistirma(true)} style={{ background: C.safran, color: C.gece, borderColor: C.safran }}><Play size={17} /> Başla</Dugme>
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: S.md }}>
        {[null, "kisisel", "mesleki", "kitle"].map((k) => (
          <button key={k || "hepsi"} onClick={() => setKat(k)} style={{ padding: "9px 16px", minHeight: 42, borderRadius: 99, cursor: "pointer", fontSize: 15, fontWeight: 700,
            border: `2px solid ${kat === k ? (k ? KAT_RENK[k] : C.murekkep) : C.cizgi}`, background: kat === k ? (k ? KAT_RENK[k] : C.murekkep) : C.muhre, color: kat === k ? "#fff" : C.murekkep }}>{k ? KAT_AD[k] : "Hepsi"}</button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 12 }}>
        {METIN_TURLERI.filter((x) => !kat || x.kat === kat).map((x) => (
          <Levha key={x.id} tikla={() => { setSecili(x.id); window.scrollTo({ top: 0 }); }} ic={S.md} style={{ borderTop: `8px solid ${KAT_RENK[x.kat]}`, minHeight: 138 }}>
            <div style={{ fontFamily: T.hat, fontSize: 21, fontWeight: 760, lineHeight: 1.15 }}>{x.ad}</div>
            <div style={{ fontFamily: T.kalem, fontSize: 14.5, color: C.murekkepSis, marginTop: 2 }}>{x.en}</div>
            <div style={{ fontSize: 14.5, color: C.murekkepAlt, marginTop: 8, lineHeight: 1.4 }}>{x.uslup}</div>
          </Levha>
        ))}
      </div>
    </Sayfa>
  );
}

function TamModel({ t }) {
  const [durum, setDurum] = useState(null);
  const [metin, setMetin] = useState(null);
  async function iste() {
    setDurum("bekle");
    try {
      const v = await sorJSON(`You are an IB English B HL examiner writing a band-7 model answer for Paper 1.
Task (given in Turkish): ${t.gorev}
Text type: ${t.en}. Length: 450-520 words. Use the conventions of the text type fully, an appropriate register, varied complex structures and several natural idiomatic expressions.
Return ONLY JSON: {"satirlar":[{"c":"one sentence or one formal element of the text, in English","i":"that sentence's function, in Turkish, max 8 words"}]}. Every sentence is a separate item, in order.`, 3500);
      setMetin(v.satirlar || []); setDurum("tamam");
    } catch { setDurum("hata"); }
  }
  return (
    <Bolum ad="Tam uzunlukta model" alt="Yapay zekâ, bu görev için 450 sözcüğü aşan bir örnek yazar; her cümlenin işlevi yine parantez içinde gelir.">
      {durum === null && <Dugme tur="ikincil" tikla={iste}><Sparkles size={16} /> Tam modeli yazdır</Dugme>}
      {durum === "bekle" && <Bekle asamalar={["Model yazılıyor…", "Cümleler işlevleriyle eşleştiriliyor…"]} />}
      {durum === "hata" && <Haber tur="hata" basli="Model alınamadı">Yapay zekâ bağlantısı kurulamadı. Kısa açıklamalı model yukarıda; bağlantı gelince yeniden dene. <div style={{ marginTop: 8 }}><Dugme tur="ikincil" kucuk tikla={iste}>Yeniden dene</Dugme></div></Haber>}
      {durum === "tamam" && metin && <Levha ic={S.md}><Model satirlar={metin.map((x) => [x.c, x.i])} renk={KAT_RENK[t.kat]} /></Levha>}
    </Bolum>
  );
}

function TurSecme({ cik, puanVer }) {
  const [liste] = useState(() => karistir(P1_GOREVLER).slice(0, 8));
  const [i, setI] = useState(0);
  const [secim, setSecim] = useState(null);
  const [dogru, setDogru] = useState(0);
  const g = liste[i];
  const secenekler = useMemo(() => (g ? karistir(g.tur) : []), [i]);
  if (!g) return (
    <div className="nv-gir" style={{ maxWidth: 620, margin: "0 auto", textAlign: "center" }}>
      <Levha ic={S.xl}>
        <div style={{ fontFamily: T.hat, fontSize: 60, fontWeight: 800, color: dogru >= 6 ? C.zumrut : C.altin, lineHeight: 1 }}>{dogru}/{liste.length}</div>
        <div style={{ ...T.m, color: C.murekkepAlt, margin: `${S.sm}px 0 ${S.lg}px` }}>{dogru === liste.length ? "Sekizde sekiz. Kavramsal anlayışın altı puanı cebinde." : "Yanlış yaptığın türlerin sayfasını aç; kitle ve amaç satırlarına bak."}</div>
        <Dugme tikla={cik}>Metin türlerine dön</Dugme>
      </Levha>
    </div>
  );
  const sec = (id) => { if (secim) return; const ok = id === g.dogru; if (ok) { setDogru((d) => d + 1); puanVer && puanVer(8); } titre(ok ? 9 : 4); setSecim(id); };
  return (
    <div className="nv-gir" style={{ maxWidth: 780, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: S.sm, marginBottom: S.sm }}>
        <Dugme tur="sessiz" kucuk tikla={cik}><ChevronLeft size={16} /> Çık</Dugme>
        <span style={{ flex: 1 }} /><Nisan renk={C.zumrut}>{dogru} doğru</Nisan><span style={{ fontWeight: 700, color: C.murekkepAlt }}>{i + 1} / {liste.length}</span>
      </div>
      <Cubuk deger={(i / liste.length) * 100} />
      <Levha ic={S.lg} style={{ marginTop: S.md, borderTop: `8px solid ${TEMA[g.tema].renk}` }}>
        <Nisan renk={TEMA[g.tema].koyu} zemin={TEMA[g.tema].acik}>{TEMA[g.tema].en}</Nisan>
        <div style={{ fontFamily: T.kalem, fontSize: 17.5, lineHeight: 1.65, marginTop: 10 }}>{g.gorev}</div>
      </Levha>
      <div style={{ fontSize: 16, fontWeight: 700, margin: `${S.md}px 2px ${S.sm}px` }}>Hangi metin türü en uygun?</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: S.sm }}>
        {secenekler.map((id) => {
          const dg = secim && id === g.dogru, sc = secim === id;
          return <button key={id} onClick={() => sec(id)} disabled={!!secim} className={dg ? "n-dogru" : sc ? "n-yanlis" : "n-secenek"}
            style={{ padding: S.md, minHeight: 74, borderRadius: 16, cursor: secim ? "default" : "pointer", textAlign: "left", color: C.murekkep,
              border: `2px solid ${secim ? (dg ? C.zumrut : sc ? C.lal : C.cizgi) : C.cizgi}`, background: secim ? (dg ? C.zumSis : sc ? C.lalSis : C.muhre) : C.muhre }}>
            <span style={{ display: "block", fontFamily: T.kalem, fontSize: 18, fontWeight: 700 }}>{TUR[id].en}</span>
            <span style={{ display: "block", fontSize: 14.5, color: C.murekkepAlt }}>{TUR[id].ad}</span>
          </button>;
        })}
      </div>
      {secim && (
        <div style={{ marginTop: S.md, display: "grid", gap: S.sm }}>
          <Haber tur={secim === g.dogru ? "iyi" : "hata"} basli={secim === g.dogru ? "Doğru" : `En uygun tür: ${TUR[g.dogru].ad}`}>{g.neden}</Haber>
          <Dugme tam tikla={() => { setSecim(null); setI(i + 1); }}>{i + 1 < liste.length ? "Sonraki görev" : "Sonucu gör"}</Dugme>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════ PAPER 1 ══════════════════════ */

export function Paper1({ sinav, sinavKaydet, puanVer, git }) {
  const [prova, setProva] = useState(false);
  const isaret = sinav.denetim || {};
  const gecmis = (sinav.p1 || []).slice().reverse();
  if (prova) return <P1Prova cik={() => setProva(false)} sinav={sinav} sinavKaydet={sinavKaydet} puanVer={puanVer} />;
  return (
    <Sayfa ad="Paper 1" alt="Yazma sınavı. Üç görevden birini, üç metin türünden en uygun olanını seçer, 450 ile 600 sözcük yazarsın."
      sag={<Dugme tur="altin" tikla={() => setProva(true)}><PenLine size={17} /> Sınav provası başlat</Dugme>}>
      <Bolum ad="Künye"><Kunye satirlar={P1_KUNYE} renk={C.altin} /></Bolum>
      <Bolum ad="Üç ölçüt, otuz puan" alt="Her ölçütün en üst bandının ne istediği ve oraya nasıl çıkılacağı.">
        <div style={{ display: "grid", gap: S.sm }}>
          {P1_OLCUT.map((o, i) => (
            <Acilir key={o.kod} acikBasla={i === 0} renk={[C.altin, C.lacivert, C.erguvan][i]} baslik={`${o.kod}: ${o.ad}`} alt={o.ne}
              sag={<span style={{ fontFamily: T.hat, fontSize: 24, fontWeight: 800, color: [C.altin, C.lacivert, C.erguvan][i] }}>{o.puan}</span>}>
              <div style={{ fontSize: 16.5, lineHeight: 1.55, padding: "10px 14px", borderRadius: 12, background: C.kagitAlt, marginBottom: S.md }}><b>En üst bant:</b> {o.ust}</div>
              <Liste ogeler={o.ipucu} renk={[C.altin, C.lacivert, C.erguvan][i]} />
            </Acilir>
          ))}
        </div>
      </Bolum>
      <Bolum ad="Doksan dakikanın planı">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: S.sm }}>
          {P1_PLAN.map((p, i) => (
            <Levha key={p.ad} ic={S.md}>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
                <span style={{ fontFamily: T.hat, fontSize: 22, fontWeight: 780 }}>{i + 1}. {p.ad}</span>
                <span style={{ fontFamily: T.kalem, fontSize: 15, fontWeight: 700, color: C.altin }}>{p.dk} dk</span>
              </div>
              <div style={{ fontSize: 15.5, lineHeight: 1.5, color: C.murekkepAlt, marginTop: 6 }}>{p.ne}</div>
            </Levha>
          ))}
        </div>
      </Bolum>
      <Bolum ad="Teslimden önce" alt="Her provadan sonra işaretle; alışkanlık olana kadar.">
        <Levha ic={S.md}>
          {P1_DENETIM.map((d, i) => (
            <label key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 4px", cursor: "pointer", fontSize: 16.5, borderTop: i ? `1px solid ${C.cizgi}` : "none" }}>
              <input type="checkbox" checked={!!isaret[i]} onChange={() => sinavKaydet({ denetim: { ...isaret, [i]: !isaret[i] } })} style={{ width: 22, height: 22, accentColor: C.zumrut }} />
              <span style={{ textDecoration: isaret[i] ? "line-through" : "none", color: isaret[i] ? C.murekkepSis : C.murekkep }}>{d}</span>
            </label>
          ))}
          <div style={{ marginTop: 8 }}><Dugme tur="sessiz" kucuk tikla={() => sinavKaydet({ denetim: {} })}><RotateCcw size={14} /> Sıfırla</Dugme></div>
        </Levha>
      </Bolum>
      <Bolum ad="Yazdıkların" alt="Provalarda yazdığın metinler burada saklanır ve yedeğe girer.">
        {gecmis.length === 0
          ? <Levha ic={S.lg} style={{ textAlign: "center" }}><div style={{ ...T.m, color: C.murekkepAlt }}>Henüz prova yapmadın. İlk metnini yazınca burada görünecek.</div><div style={{ marginTop: S.md, display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}><Dugme tur="altin" tikla={() => setProva(true)}>İlk provayı başlat</Dugme><Dugme tur="ikincil" tikla={() => git("turler")}>Önce metin türlerine bak</Dugme></div></Levha>
          : <div style={{ display: "grid", gap: S.sm }}>{gecmis.map((m) => (
              <Acilir key={m.id} baslik={`${TUR[m.tur] ? TUR[m.tur].ad : m.tur}, ${m.sozcuk} sözcük`} alt={`${trTarih(m.tarih)}${m.puan ? `, tahmini ${m.puan.toplam}/30` : ""}`} renk={TEMA[m.tema] ? TEMA[m.tema].renk : C.altin}>
                <div style={{ fontSize: 14.5, color: C.murekkepAlt, marginBottom: 8 }}>{m.gorev}</div>
                <div style={{ fontFamily: T.kalem, fontSize: 16, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{m.metin}</div>
                {m.puan && <P1Puan p={m.puan} />}
              </Acilir>))}</div>}
      </Bolum>
    </Sayfa>
  );
}

function P1Puan({ p }) {
  const renkler = { A: C.altin, B: C.lacivert, C: C.erguvan };
  return (
    <div style={{ marginTop: S.md, display: "grid", gap: S.sm }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: S.sm }}>
        {["A", "B", "C"].map((k) => p[k] && (
          <div key={k} style={{ border: `2px solid ${renkler[k]}`, borderRadius: 16, padding: S.md }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}><span style={{ fontFamily: T.hat, fontSize: 30, fontWeight: 800, color: renkler[k] }}>{p[k].puan}</span><span style={{ color: C.murekkepSis }}>/ {k === "C" ? 6 : 12}</span></div>
            <div style={{ fontSize: 14, fontWeight: 700 }}>{P1_OLCUT.find((o) => o.kod === k).ad}</div>
            <div style={{ fontSize: 14.5, color: C.murekkepAlt, marginTop: 4, lineHeight: 1.45 }}>{p[k].gerekce}</div>
          </div>
        ))}
      </div>
      {p.guclu && p.guclu.length > 0 && <Haber tur="iyi" basli="Güçlü yanlar"><Liste ogeler={p.guclu} renk={C.zumrut} /></Haber>}
      {p.gelistir && p.gelistir.length > 0 && <Haber tur="altin" basli="Bir üst bant için"><Liste ogeler={p.gelistir} renk={C.altin} /></Haber>}
      {p.duzeltmeler && p.duzeltmeler.length > 0 && (
        <Levha ic={S.md} renk={C.lal}>
          <div style={{ fontSize: 14.5, fontWeight: 700, color: C.lal, marginBottom: 6 }}>Düzeltmeler</div>
          {p.duzeltmeler.map((d, i) => (
            <div key={i} style={{ padding: "8px 0", borderTop: i ? `1px solid ${C.cizgi}` : "none" }}>
              <div style={{ fontFamily: T.kalem, fontSize: 15.5 }}><span style={{ color: C.lal, textDecoration: "line-through" }}>{d.yanlis}</span> → <b style={{ color: C.zumrut }}>{d.dogru}</b></div>
              <div style={{ fontSize: 14.5, color: C.murekkepAlt }}>{d.neden}</div>
            </div>
          ))}
        </Levha>
      )}
      <div style={{ fontSize: 13.5, color: C.murekkepSis }}>Bu puan yapay zekânın ölçütlere göre yaptığı bir tahmindir; resmî not değildir.</div>
    </div>
  );
}

function P1Prova({ cik, sinav, sinavKaydet, puanVer }) {
  const [gorevler] = useState(() => {
    const temalar = karistir([...new Set(P1_GOREVLER.map((g) => g.tema))]).slice(0, 3);
    return temalar.map((t) => { const g = karistir(P1_GOREVLER.filter((x) => x.tema === t))[0]; return { ...g, tur: karistir(g.tur) }; });
  });
  const [adim, setAdim] = useState("sec");
  const [gi, setGi] = useState(null);
  const [tur, setTur] = useState(null);
  const [metin, setMetin] = useState("");
  const [calisiyor, setCalisiyor] = useState(false);
  const [kalan] = useSayac(90 * 60, calisiyor);
  const [ipucu, setIpucu] = useState(false);
  const [puan, setPuan] = useState(null);
  const [puanDurum, setPuanDurum] = useState(null);
  const kayitId = useRef(yeniId("p1"));
  const g = gi != null ? gorevler[gi] : null;
  const n = kelimeSay(metin);

  function kaydet(ekPuan) {
    const kayit = { id: kayitId.current, tarih: new Date().toISOString(), tema: g.tema, gorev: g.gorev, tur, metin, sozcuk: n, puan: ekPuan || puan || null };
    sinavKaydet({ p1: [...(sinav.p1 || []).filter((x) => x.id !== kayit.id), kayit].slice(-30) });
  }
  function bitir() { setCalisiyor(false); kaydet(); puanVer && puanVer(Math.min(120, 30 + Math.round(n / 6))); setAdim("son"); if (n >= 450) konfeti(90); }
  async function puanla() {
    setPuanDurum("bekle");
    try {
      const v = await sorJSON(`You are an experienced IB English B HL Paper 1 examiner. Assess the response strictly with the official criteria: A Language (0-12), B Message (0-12), C Conceptual understanding (0-6).
TASK: ${g.gorev}
TEXT TYPE CHOSEN BY THE CANDIDATE: ${TUR[tur].en} (most appropriate option was: ${TUR[g.dogru].en})
WORD COUNT: ${n} (required 450-600)
RESPONSE:
"""${metin.slice(0, 6000)}"""
Return ONLY JSON, all explanations in Turkish, quotations from the response in English:
{"A":{"puan":0,"gerekce":"max 30 words"},"B":{"puan":0,"gerekce":"..."},"C":{"puan":0,"gerekce":"..."},"toplam":0,"guclu":["2-3 items"],"gelistir":["3 concrete steps to reach the next band"],"duzeltmeler":[{"yanlis":"exact phrase from the response","dogru":"corrected","neden":"short Turkish reason"}]}
Give at most 8 corrections, the most costly ones first. If the wrong text type was chosen, criterion C cannot exceed 2.`, 2200);
      v.toplam = (v.A?.puan || 0) + (v.B?.puan || 0) + (v.C?.puan || 0);
      setPuan(v); setPuanDurum("tamam"); kaydet(v);
    } catch { setPuanDurum("hata"); }
  }

  if (adim === "sec") return (
    <div className="nv-gir" style={{ maxWidth: 860, margin: "0 auto" }}>
      <Dugme tur="sessiz" kucuk tikla={cik}><ChevronLeft size={16} /> Paper 1</Dugme>
      <h1 style={{ fontFamily: T.hat, ...T.d1, margin: `${S.sm}px 0 4px` }}>Bir görev seç</h1>
      <div style={{ ...T.m, color: C.murekkepAlt, marginBottom: S.lg }}>Sınavdaki gibi: üç görev, her biri başka temadan. Birini seç, sonra metin türüne karar ver. Süre, yazmaya başladığında işler.</div>
      <div style={{ display: "grid", gap: S.md }}>
        {gorevler.map((x, i) => (
          <div key={i} style={{ background: C.muhre, border: `2px solid ${gi === i ? TEMA[x.tema].renk : C.cizgi}`, borderRadius: 20, padding: S.lg, cursor: "pointer" }} onClick={() => { setGi(i); setTur(null); }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <span style={{ width: 34, height: 34, borderRadius: 99, background: TEMA[x.tema].renk, color: TEMA[x.tema].murekkep || "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: T.hat, fontWeight: 800 }}>{i + 1}</span>
              <Nisan renk={TEMA[x.tema].koyu} zemin={TEMA[x.tema].acik}>{TEMA[x.tema].en}</Nisan>
            </div>
            <div style={{ fontFamily: T.kalem, fontSize: 17, lineHeight: 1.65 }}>{x.gorev}</div>
            {gi === i && (
              <div className="nv-gir" style={{ marginTop: S.md }}>
                <div style={{ fontSize: 15.5, fontWeight: 700, marginBottom: 8 }}>Metin türünü seç</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {x.tur.map((id) => <button key={id} onClick={(e) => { e.stopPropagation(); setTur(id); }}
                    style={{ padding: "10px 18px", minHeight: 46, borderRadius: 14, cursor: "pointer", fontFamily: T.kalem, fontSize: 17, fontWeight: 700,
                      border: `2px solid ${tur === id ? C.murekkep : C.golge}`, background: tur === id ? C.murekkep : C.muhre, color: tur === id ? "#fff" : C.murekkep }}>{TUR[id].en}</button>)}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div style={{ marginTop: S.lg }}><Dugme tur="altin" tam pasif={gi == null || !tur} tikla={() => { setAdim("yaz"); setCalisiyor(true); window.scrollTo({ top: 0 }); }}>Yazmaya başla, 90 dakika</Dugme></div>
    </div>
  );

  if (adim === "yaz") {
    const renk = n < 450 ? C.safranKoyu : n <= 600 ? C.zumrut : C.lal;
    return (
      <div className="nv-gir" style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ position: "sticky", top: 0, zIndex: 5, background: C.kagit, padding: "8px 0", display: "flex", alignItems: "center", gap: S.sm, flexWrap: "wrap" }}>
          <span style={{ fontFamily: T.kalem, fontSize: 24, fontWeight: 700, color: kalan < 600 ? C.lal : C.murekkep, minWidth: 82 }}>{sure(kalan)}</span>
          <Dugme tur="ikincil" kucuk tikla={() => setCalisiyor(!calisiyor)}>{calisiyor ? <Pause size={15} /> : <Play size={15} />}</Dugme>
          <div style={{ flex: "1 1 160px" }}><Cubuk deger={Math.min(100, (n / 600) * 100)} renk={renk} boy={12} /></div>
          <span style={{ fontWeight: 800, color: renk, fontSize: 17, ...T.rakam }}>{n} sözcük</span>
          <Dugme tur="altin" kucuk tikla={bitir}>Teslim et</Dugme>
        </div>
        <Levha ic={S.md} style={{ marginBottom: S.sm, borderLeft: `6px solid ${TEMA[g.tema].renk}` }}>
          <div style={{ fontFamily: T.kalem, fontSize: 16, lineHeight: 1.6 }}>{g.gorev}</div>
          <div style={{ marginTop: 8, display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <Nisan renk={C.murekkep} dolu>{TUR[tur].en}</Nisan>
            <Dugme tur="sessiz" kucuk tikla={() => setIpucu(!ipucu)}>{ipucu ? "İskeleti gizle" : "Türün iskeletini göster"}</Dugme>
          </div>
          {ipucu && <div className="nv-gir" style={{ marginTop: 8 }}><Liste ogeler={TUR[tur].yapi} renk={KAT_RENK[TUR[tur].kat]} /></div>}
        </Levha>
        <textarea value={metin} onChange={(e) => setMetin(e.target.value)} spellCheck={false} placeholder="Metnini buraya yaz…" autoFocus
          style={{ width: "100%", minHeight: "56vh", padding: S.lg, borderRadius: 18, border: `2px solid ${C.golge}`, outline: "none", resize: "vertical",
            fontFamily: T.kalem, fontSize: 18, lineHeight: 1.8, color: C.murekkep, background: C.muhre }} />
        <div style={{ fontSize: 14.5, color: C.murekkepSis, marginTop: 6 }}>450'nin altı görevi eksik bırakır; 600'ün üstü puan getirmez.</div>
      </div>
    );
  }

  return (
    <div className="nv-gir" style={{ maxWidth: 860, margin: "0 auto" }}>
      <h1 style={{ fontFamily: T.hat, ...T.d1, margin: `0 0 4px` }}>Teslim edildi</h1>
      <div style={{ ...T.m, color: C.murekkepAlt, marginBottom: S.lg }}>{n} sözcük, {TUR[tur].ad}. Metnin “Yazdıkların” bölümüne kaydedildi.</div>
      {tur !== g.dogru && <div style={{ marginBottom: S.md }}><Haber tur="hata" basli={`Bu görev için en uygun tür: ${TUR[g.dogru].ad}`}>{g.neden}</Haber></div>}
      {tur === g.dogru && <div style={{ marginBottom: S.md }}><Haber tur="iyi" basli="Metin türü doğru seçilmiş">{g.neden}</Haber></div>}
      {!puan && puanDurum !== "bekle" && <Levha ic={S.lg}>
        <div style={{ fontFamily: T.hat, fontSize: 21, fontWeight: 740 }}>Ölçütlere göre değerlendirme</div>
        <div style={{ ...T.s, color: C.murekkepAlt, margin: "4px 0 12px" }}>Yapay zekâ metnini A, B ve C ölçütlerine göre puanlar, en pahalı hatalarını düzeltir.</div>
        <Dugme tur="altin" pasif={n < 60} tikla={puanla}><Sparkles size={16} /> Puanla</Dugme>
        {puanDurum === "hata" && <div style={{ marginTop: S.md }}><Haber tur="hata" basli="Bağlantı kurulamadı">Değerlendirme şu an alınamadı. Metnin kayıtlı; Paper 1 sayfasındaki denetim listesiyle kendin değerlendirebilir, sonra yeniden deneyebilirsin.</Haber></div>}
      </Levha>}
      {puanDurum === "bekle" && <Bekle asamalar={["Metin okunuyor…", "Ölçütlere göre puanlanıyor…", "Düzeltmeler hazırlanıyor…"]} />}
      {puan && <P1Puan p={puan} />}
      <div style={{ marginTop: S.lg }}><Dugme tur="ikincil" tikla={cik}>Paper 1'e dön</Dugme></div>
    </div>
  );
}

/* ══════════════════════ PAPER 2 ══════════════════════ */

export function Paper2({ sinav, sinavKaydet, puanVer }) {
  const [acik, setAcik] = useState(null);
  const sonuc = sinav.p2 || {};
  if (acik) return <P2Metin m={P2_METINLER.find((x) => x.id === acik)} cik={() => setAcik(null)} onceki={sonuc[acik]}
    bitir={(dogru, toplam) => { sinavKaydet({ p2: { ...sonuc, [acik]: { dogru, toplam, tarih: new Date().toISOString() } } }); puanVer && puanVer(dogru * 8); }} />;
  return (
    <Sayfa ad="Paper 2" alt="Anlama sınavı: dinleme ve okuma. Notun yarısı buradan gelir ve tamamı sözcük dağarcığına dayanır.">
      <Bolum ad="Künye"><Kunye satirlar={P2_KUNYE} renk={C.lacivert} /></Bolum>
      <Bolum ad="Okuma provaları" alt="Beş özgün metin, her temadan bir tane. Sorular sınavdaki tiplerle kurulu ve kendiliğinden denetlenir.">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 12 }}>
          {P2_METINLER.map((m) => {
            const h = TEMA[m.tema], s = sonuc[m.id];
            return (
              <Levha key={m.id} tikla={() => { setAcik(m.id); window.scrollTo({ top: 0 }); }} ic={S.md} style={{ borderTop: `8px solid ${h.renk}`, minHeight: 150, display: "flex", flexDirection: "column", gap: 6 }}>
                <Nisan kucuk renk={h.koyu} zemin={h.acik}>{h.en}</Nisan>
                <div style={{ fontFamily: T.hat, fontSize: 21, fontWeight: 760, lineHeight: 1.15 }}>{m.baslik}</div>
                <div style={{ fontSize: 14.5, color: C.murekkepAlt }}>{m.tur}, {m.par.join(" ").split(/\s+/).length} sözcük, {m.sorular.length} soru</div>
                <span style={{ flex: 1 }} />
                {s ? <Nisan renk={s.dogru / s.toplam >= 0.8 ? C.zumrut : C.safranKoyu}>son sonuç {s.dogru}/{s.toplam}</Nisan> : <span style={{ fontSize: 14.5, fontWeight: 700, color: h.koyu }}>Başla</span>}
              </Levha>
            );
          })}
        </div>
      </Bolum>
      <Bolum ad="Soru tipleri ve taktikleri" alt="Okuma bölümünde karşına çıkan yedi tip; her birinde puanı neyin getirdiği.">
        <div style={{ display: "grid", gap: S.sm }}>
          {P2_TIPLER.map((t, i) => (
            <Acilir key={t.en} baslik={t.ad} alt={t.en} renk={[C.altin, C.lacivert, C.erguvan, C.zumrut, C.safran, C.mor, C.lal][i]}>
              <div style={{ fontSize: 16.5, lineHeight: 1.55, marginBottom: S.md }}>{t.nasil}</div>
              <Liste ogeler={t.strateji} renk={[C.altin, C.lacivert, C.erguvan, C.zumrut, C.safran, C.mor, C.lal][i]} />
            </Acilir>
          ))}
        </div>
      </Bolum>
      <Bolum ad="Dinleme" alt="Kayıt çalarken yapılacaklar. Kulak alıştırması için okuma provalarını “dinleyerek çöz” seçeneğiyle açabilir, Stüdyo'da Radyo ve Dikte yollarını kullanabilirsin.">
        <Levha ic={S.md}><Liste ogeler={P2_DINLEME} renk={C.lacivert} /></Levha>
      </Bolum>
    </Sayfa>
  );
}

function P2Metin({ m, cik, bitir, onceki }) {
  const h = TEMA[m.tema];
  const [y, setY] = useState({});
  const [bitti, setBitti] = useState(false);
  const [dinle, setDinle] = useState(false);
  const [okunan, setOkunan] = useState(null);
  const say = m.sorular.length;
  const dogruMu = (q, i) => {
    const v = y[i];
    if (q.tip === "mc") return v === q.c;
    if (q.tip === "tf") return v && v.d === q.c && v.g === q.gc;
    return typeof v === "string" && v.trim().toLowerCase().replace(/[^a-z-]/g, "") === q.c;
  };
  const dogru = m.sorular.filter(dogruMu).length;
  const cevaplanan = m.sorular.filter((q, i) => q.tip === "tf" ? y[i] && y[i].d != null && y[i].g != null : y[i] != null && y[i] !== "").length;
  useEffect(() => () => { try { window.speechSynthesis.cancel(); } catch { /* yok */ } }, []);
  function oku(i) {
    if (!sesVar()) return;
    if (okunan === i) { window.speechSynthesis.cancel(); setOkunan(null); return; }
    setOkunan(i); seslendir(m.par[i], 0.88);
    setTimeout(() => setOkunan((o) => (o === i ? null : o)), m.par[i].length * 75);
  }
  const sik = (et, dg, yn) => ({ padding: "11px 14px", minHeight: 48, borderRadius: 13, cursor: bitti ? "default" : "pointer", textAlign: "left", fontSize: 16.5, lineHeight: 1.4, color: C.murekkep,
    border: `2px solid ${bitti ? (dg ? C.zumrut : yn ? C.lal : C.cizgi) : et ? C.murekkep : C.cizgi}`, background: bitti ? (dg ? C.zumSis : yn ? C.lalSis : C.muhre) : et ? C.kagitDerin : C.muhre });

  return (
    <div className="nv-gir">
      <div style={{ display: "flex", alignItems: "center", gap: S.sm, flexWrap: "wrap", marginBottom: S.md }}>
        <Dugme tur="sessiz" kucuk tikla={cik}><ChevronLeft size={16} /> Paper 2</Dugme>
        <span style={{ flex: 1 }} />
        {sesVar() && <Dugme tur="ikincil" kucuk tikla={() => setDinle(!dinle)}>{dinle ? <Eye size={15} /> : <Volume2 size={15} />} {dinle ? "Metni göster" : "Dinleyerek çöz"}</Dugme>}
        <Nisan renk={C.murekkepAlt}>{cevaplanan}/{say} yanıtlandı</Nisan>
      </div>
      <div className="nv-ikili" style={{ display: "grid", gap: S.lg, alignItems: "start" }}>
        <article style={{ background: C.muhre, border: `1px solid ${C.cizgi}`, borderTop: `10px solid ${h.renk}`, borderRadius: 22, padding: S.lg, position: "sticky", top: 8, maxHeight: "calc(100vh - 24px)", overflow: "auto" }} className="nv-yapiskan">
          <Nisan kucuk renk={h.koyu} zemin={h.acik}>{m.tur}</Nisan>
          <h1 style={{ fontFamily: T.hat, fontSize: 30, fontWeight: 780, letterSpacing: "-0.02em", margin: "8px 0 14px", lineHeight: 1.12 }}>{m.baslik}</h1>
          {m.par.map((p, i) => (
            <div key={i} style={{ display: "flex", gap: 12, marginBottom: 14 }}>
              <button onClick={() => oku(i)} aria-label={`${i + 1}. paragrafı dinle`} style={{ width: 34, height: 34, borderRadius: 99, flexShrink: 0, border: "none", cursor: sesVar() ? "pointer" : "default",
                background: okunan === i ? h.renk : h.acik, color: okunan === i ? (h.murekkep || "#fff") : h.koyu, fontWeight: 800, fontSize: 15 }}>{okunan === i ? <Square size={13} /> : i + 1}</button>
              <p style={{ margin: 0, fontFamily: T.govde, fontSize: 18, lineHeight: 1.75, color: C.murekkep, filter: dinle && !bitti ? "blur(7px)" : "none", userSelect: dinle && !bitti ? "none" : "auto", transition: "filter .3s" }}>{p}</p>
            </div>
          ))}
          {dinle && !bitti && <div style={{ fontSize: 14.5, color: C.murekkepAlt }}>Metin gizli. Paragraf numaralarına dokunarak dinle; sınavdaki gibi en çok iki kez.</div>}
        </article>
        <div style={{ display: "grid", gap: S.md }}>
          {m.sorular.map((q, i) => (
            <Levha key={i} ic={S.md} renk={bitti ? (dogruMu(q, i) ? C.zumrut : C.lal) : undefined}>
              <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                <span style={{ fontFamily: T.hat, fontWeight: 800, fontSize: 18, color: h.koyu }}>{i + 1}</span>
                <span style={{ fontFamily: T.kalem, fontSize: 17, lineHeight: 1.5, fontWeight: 600 }}>{q.s}</span>
              </div>
              {q.tip === "mc" && <div style={{ display: "grid", gap: 7 }}>
                {q.o.map((o, n) => <button key={n} disabled={bitti} onClick={() => setY({ ...y, [i]: n })} style={{ ...sik(y[i] === n, n === q.c, y[i] === n && n !== q.c), fontFamily: T.kalem }}>{"ABCD"[n]}. {o}</button>)}
              </div>}
              {q.tip === "tf" && <div style={{ display: "grid", gap: 8 }}>
                <div style={{ display: "flex", gap: 8 }}>
                  {[true, false].map((d) => <button key={String(d)} disabled={bitti} onClick={() => setY({ ...y, [i]: { ...(y[i] || {}), d } })}
                    style={{ ...sik(y[i] && y[i].d === d, d === q.c, y[i] && y[i].d === d && d !== q.c), flex: 1, textAlign: "center", fontWeight: 800 }}>{d ? "True" : "False"}</button>)}
                </div>
                <div style={{ fontSize: 14.5, fontWeight: 700, color: C.murekkepAlt }}>Gerekçe: metindeki hangi söz bunu kanıtlıyor?</div>
                {q.g.map((g, n) => <button key={n} disabled={bitti} onClick={() => setY({ ...y, [i]: { ...(y[i] || {}), g: n } })}
                  style={{ ...sik(y[i] && y[i].g === n, n === q.gc, y[i] && y[i].g === n && n !== q.gc), fontFamily: T.kalem, fontSize: 15.5 }}>“{g}”</button>)}
              </div>}
              {q.tip === "kelime" && <div>
                <input disabled={bitti} value={y[i] || ""} onChange={(e) => setY({ ...y, [i]: e.target.value })} autoCapitalize="none" autoCorrect="off" spellCheck={false} placeholder="Metindeki sözcük…"
                  style={{ width: "100%", maxWidth: 320, padding: "11px 14px", borderRadius: 13, border: `2px solid ${bitti ? (dogruMu(q, i) ? C.zumrut : C.lal) : C.golge}`, outline: "none", fontFamily: T.kalem, fontSize: 18, background: C.kagitAlt, color: C.murekkep }} />
                {bitti && !dogruMu(q, i) && <div style={{ marginTop: 6, fontSize: 15.5 }}>Doğrusu: <b style={{ fontFamily: T.kalem, color: C.zumrut }}>{q.c}</b></div>}
              </div>}
            </Levha>
          ))}
          {!bitti
            ? <Dugme tur="altin" tam pasif={cevaplanan < say} tikla={() => { setBitti(true); bitir(dogru, say); if (dogru / say >= 0.8) konfeti(90); window.scrollTo({ top: 0, behavior: "smooth" }); }}>{cevaplanan < say ? `Önce bütün soruları yanıtla (${say - cevaplanan} kaldı)` : "Denetle"}</Dugme>
            : <Levha ic={S.lg} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: T.hat, fontSize: 52, fontWeight: 800, color: dogru / say >= 0.8 ? C.zumrut : dogru / say >= 0.5 ? C.altin : C.lal, lineHeight: 1 }}>{dogru}/{say}</div>
                <div style={{ ...T.s, color: C.murekkepAlt, margin: "8px 0 14px" }}>Yanlışların kırmızı çizgili. Doğru seçenek yeşille işaretlendi; metinde yerini bul.</div>
                <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}><Dugme tur="ikincil" tikla={() => { setY({}); setBitti(false); }}><RotateCcw size={15} /> Yeniden çöz</Dugme><Dugme tikla={cik}>Diğer metinler</Dugme></div>
              </Levha>}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════ BİREYSEL SÖZLÜ ══════════════════════ */

const BOS_ESER = { ad: "", yazar: "", kisiler: "", temalar: "", anlar: "", alintilar: "" };

export function IO({ sinav, sinavKaydet, puanVer }) {
  const [mod, setMod] = useState(null);
  const eserler = sinav.eserler && sinav.eserler.length === 2 ? sinav.eserler : [BOS_ESER, BOS_ESER];
  if (mod === "prova") return <IOProva cik={() => setMod(null)} eserler={eserler} puanVer={puanVer} />;
  if (mod === "soru") return <IOSoru cik={() => setMod(null)} puanVer={puanVer} />;
  if (mod === "sohbet") return <IOSohbet cik={() => setMod(null)} eserler={eserler} puanVer={puanVer} />;
  const esYaz = (n, alan, v) => sinavKaydet({ eserler: eserler.map((e, i) => (i === n ? { ...e, [alan]: v } : e)) });
  return (
    <Sayfa ad="Bireysel sözlü" alt="Individual oral, HL. Edebî bir parça üzerine sunum ve ardından sohbet. Sınavın tek sözlü bileşeni; notun dörtte biri.">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 12, marginBottom: S.xl }}>
        {[["prova", "Tam prova", "20 dakika hazırlık, on maddelik not, ardından üç bölüm süre tutarak.", C.erguvan, Timer],
          ["soru", "Soru çek", "Tema ve parça sorularından rastgele biri. Bir dakika konuş, kalıplara bak.", C.altin, Shuffle],
          ["sohbet", "Sınav görevlisiyle sohbet", "Yapay zekâ ikinci ve üçüncü bölümün sorularını sorar, sonunda ölçütlere göre geri bildirim verir.", C.mor, Sparkles]].map(([id, ad, ac, renk, Ikon]) => (
          <Levha key={id} tikla={() => { setMod(id); window.scrollTo({ top: 0 }); }} ic={S.lg} style={{ background: renk, borderColor: renk, color: "#fff", minHeight: 150 }}>
            <Ikon size={26} />
            <div style={{ fontFamily: T.hat, fontSize: 23, fontWeight: 780, marginTop: 8 }}>{ad}</div>
            <div style={{ fontSize: 15.5, lineHeight: 1.45, opacity: .93, marginTop: 4 }}>{ac}</div>
          </Levha>
        ))}
      </div>
      <Bolum ad="Künye"><Kunye satirlar={IO_KUNYE} renk={C.erguvan} /></Bolum>
      <Bolum ad="On beş dakikanın üç bölümü">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: S.sm }}>
          {IO_BOLUMLER.map((b, i) => (
            <Levha key={b.ad} ic={S.md} style={{ borderTop: `8px solid ${[C.erguvan, C.altin, C.lacivert][i]}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
                <span style={{ fontFamily: T.hat, fontSize: 20.5, fontWeight: 770 }}>{b.ad}</span>
                <span style={{ fontFamily: T.kalem, fontWeight: 700, fontSize: 15, color: [C.erguvan, C.altin, C.lacivert][i], whiteSpace: "nowrap" }}>{b.dk}</span>
              </div>
              <div style={{ fontSize: 16, lineHeight: 1.5, marginTop: 6 }}>{b.ne}</div>
              <div style={{ fontSize: 15, lineHeight: 1.5, color: C.murekkepAlt, marginTop: 8, paddingTop: 8, borderTop: `1px dashed ${C.cizgi}` }}>{b.dikkat}</div>
            </Levha>
          ))}
        </div>
      </Bolum>
      <Bolum ad="Dört ölçüt, otuz puan">
        <div style={{ display: "grid", gap: S.sm }}>
          {IO_OLCUT.map((o, i) => (
            <Acilir key={o.kod} renk={[C.altin, C.erguvan, C.lacivert, C.zumrut][i]} baslik={`${o.kod}: ${o.ad}`}
              sag={<span style={{ fontFamily: T.hat, fontSize: 24, fontWeight: 800, color: [C.altin, C.erguvan, C.lacivert, C.zumrut][i] }}>{o.puan}</span>}>
              <div style={{ fontSize: 16.5, lineHeight: 1.55, padding: "10px 14px", borderRadius: 12, background: C.kagitAlt, marginBottom: S.md }}><b>En üst bant:</b> {o.ust}</div>
              <Liste ogeler={o.ipucu} renk={[C.altin, C.erguvan, C.lacivert, C.zumrut][i]} />
            </Acilir>
          ))}
        </div>
      </Bolum>
      <Bolum ad="Sunumun iskeleti" alt="Dört dakikayı yedi parçaya bölen bir sıra. Kalıplara dokununca seslendirilir; boşlukları kendi eserinle doldur.">
        <div style={{ display: "grid", gap: S.sm }}>
          {IO_ISKELET.map((b, i) => (
            <div key={b.ad} style={{ display: "flex", gap: S.md, alignItems: "flex-start", background: C.muhre, border: `1px solid ${C.cizgi}`, borderRadius: 18, padding: S.md }}>
              <span style={{ width: 36, height: 36, borderRadius: 99, background: C.erguvan, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: T.hat, fontWeight: 800, flexShrink: 0 }}>{i + 1}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}><span style={{ fontFamily: T.hat, fontSize: 19, fontWeight: 750 }}>{b.ad}</span><span style={{ fontSize: 14, color: C.murekkepSis }}>yaklaşık {b.sure}</span></div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginTop: 8 }}>{b.kalip.map((k) => <Kalip key={k} t={k} />)}</div>
              </div>
            </div>
          ))}
        </div>
      </Bolum>
      <Bolum ad="Düşünürken zaman kazandıran kalıplar"><div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>{IO_ZAMAN_KALIP.map((k) => <Kalip key={k} t={k} />)}</div></Bolum>
      <Bolum ad="Eserlerim" alt="Derste okuduğunuz iki eseri buraya işle. Provalarda ve yapay zekâ sohbetinde bu notlar kullanılır; yedeğe de girer.">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: S.md }}>
          {eserler.map((e, n) => (
            <Levha key={n} ic={S.md} style={{ borderTop: `8px solid ${n ? C.lacivert : C.erguvan}` }}>
              <div style={{ fontFamily: T.hat, fontSize: 19, fontWeight: 750, marginBottom: 8 }}>{n + 1}. eser</div>
              {[["ad", "Eserin adı", 1], ["yazar", "Yazarı", 1], ["kisiler", "Kişiler ve ilişkileri", 3], ["temalar", "Temalar", 2], ["anlar", "Kilit anlar", 3], ["alintilar", "Ezberimdeki alıntılar", 3]].map(([alan, ad, satir]) => (
                <label key={alan} style={{ display: "block", marginBottom: 10 }}>
                  <span style={{ display: "block", fontSize: 14, fontWeight: 700, color: C.murekkepAlt, marginBottom: 3 }}>{ad}</span>
                  {satir === 1
                    ? <input value={e[alan] || ""} onChange={(ev) => esYaz(n, alan, ev.target.value)} style={{ width: "100%", padding: "10px 12px", borderRadius: 12, border: `1.5px solid ${C.golge}`, outline: "none", fontSize: 16.5, background: C.kagitAlt, color: C.murekkep }} />
                    : <textarea value={e[alan] || ""} onChange={(ev) => esYaz(n, alan, ev.target.value)} rows={satir} style={{ width: "100%", padding: "10px 12px", borderRadius: 12, border: `1.5px solid ${C.golge}`, outline: "none", fontSize: 16, lineHeight: 1.5, resize: "vertical", background: C.kagitAlt, color: C.murekkep, fontFamily: T.govde }} />}
                </label>
              ))}
            </Levha>
          ))}
        </div>
      </Bolum>
    </Sayfa>
  );
}

function IOSoru({ cik, puanVer }) {
  const [tema, setTema] = useState("hepsi");
  const havuz = useMemo(() => tema === "parca" ? IO_PARCA_SORU : tema === "hepsi" ? Object.values(IO_TEMA_SORU).flat() : IO_TEMA_SORU[tema], [tema]);
  const [soru, setSoru] = useState(() => karistir(Object.values(IO_TEMA_SORU).flat())[0]);
  const [calisiyor, setCalisiyor] = useState(false);
  const [kalan, setKalan] = useSayac(60, calisiyor, () => { setCalisiyor(false); puanVer && puanVer(10); titre(20); });
  const cek = () => { setSoru(karistir(havuz.filter((s) => s !== soru))[0] || havuz[0]); setCalisiyor(false); setKalan(60); };
  useEffect(() => { cek(); }, [tema]);
  const cip = (id, ad, renk) => <button key={id} onClick={() => setTema(id)} style={{ flex: "0 0 auto", padding: "9px 15px", minHeight: 42, borderRadius: 99, cursor: "pointer", fontSize: 15, fontWeight: 700,
    border: `2px solid ${tema === id ? renk : C.cizgi}`, background: tema === id ? renk : C.muhre, color: tema === id ? "#fff" : C.murekkep }}>{ad}</button>;
  return (
    <div className="nv-gir" style={{ maxWidth: 780, margin: "0 auto" }}>
      <Dugme tur="sessiz" kucuk tikla={cik}><ChevronLeft size={16} /> Bireysel sözlü</Dugme>
      <div style={{ display: "flex", gap: 8, overflowX: "auto", padding: "12px 2px" }}>
        {cip("hepsi", "Bütün temalar", C.murekkep)}{cip("parca", "Parça üzerine", C.erguvan)}
        {HATLAR.slice(0, 5).map((h) => cip(h.id, h.ad, h.renk))}
      </div>
      <div style={{ background: C.gece, color: "#fff", borderRadius: 26, padding: S.xl, textAlign: "center" }}>
        <div style={{ fontFamily: T.hat, fontSize: 28, fontWeight: 740, lineHeight: 1.25, letterSpacing: "-0.01em", minHeight: 110, display: "flex", alignItems: "center", justifyContent: "center" }}>{soru}</div>
        <div style={{ display: "flex", justifyContent: "center", margin: `${S.md}px 0` }}>
          <Halka deger={(kalan / 60) * 100} boy={110} kalinlik={9} renk={kalan < 11 ? C.lal : C.safran} ic={<span style={{ fontFamily: T.kalem, fontSize: 28, fontWeight: 700 }}>{kalan}</span>} />
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
          <Dugme tikla={() => setCalisiyor(!calisiyor)} style={{ background: C.safran, color: C.gece, borderColor: C.safran }}>{calisiyor ? <Pause size={17} /> : <Play size={17} />} {calisiyor ? "Duraklat" : kalan === 60 ? "Konuşmaya başla" : "Sürdür"}</Dugme>
          <Dugme tikla={cek} style={{ background: "transparent", color: "#fff", borderColor: "#41558A" }}><Shuffle size={16} /> Başka soru</Dugme>
          {sesVar() && <Dugme tikla={() => seslendir(soru)} style={{ background: "transparent", color: "#fff", borderColor: "#41558A" }}><Volume2 size={16} /></Dugme>}
        </div>
      </div>
      <div style={{ ...T.s, color: C.murekkepAlt, margin: `${S.md}px 2px ${S.sm}px` }}>Yanıtını dört adımda kur: görüş, gerekçe, örnek, karşı görüş. Takılırsan şunlardan biriyle başla:</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>{IO_ZAMAN_KALIP.slice(0, 6).map((k) => <Kalip key={k} t={k} />)}</div>
    </div>
  );
}

function IOProva({ cik, eserler, puanVer }) {
  const [adim, setAdim] = useState(0);
  const [calisiyor, setCalisiyor] = useState(false);
  const [notlar, setNotlar] = useState(Array(10).fill(""));
  const sureler = [20 * 60, ...IO_BOLUMLER.map((b) => b.sn)];
  const [kalan, setKalan] = useSayac(sureler[Math.min(adim, 3)], calisiyor, () => { setCalisiyor(false); titre(30); });
  const [sorular] = useState(() => ({ parca: karistir(IO_PARCA_SORU).slice(0, 5), tema: karistir(Object.values(IO_TEMA_SORU).flat()).slice(0, 6) }));
  const ileri = () => { setCalisiyor(false); if (adim === 3) { puanVer && puanVer(80); konfeti(80); } setAdim(adim + 1); window.scrollTo({ top: 0 }); };
  const adlar = ["Hazırlık", ...IO_BOLUMLER.map((b) => b.ad)];
  if (adim > 3) return (
    <div className="nv-gir" style={{ maxWidth: 640, margin: "0 auto" }}>
      <Levha ic={S.xl} style={{ textAlign: "center" }}>
        <div style={{ fontFamily: T.hat, ...T.d1 }}>Prova tamam</div>
        <div style={{ ...T.m, color: C.murekkepAlt, margin: `${S.sm}px 0 ${S.lg}px` }}>Şimdi kendine üç soru sor: Parçaya kaç kez doğrudan gönderme yaptım? Tek cümlelik yanıt verdim mi? Hangi sözcüğü aradım da bulamadım? Bulamadığın sözcükleri Sözlük'te ara.</div>
        <Dugme tikla={cik}>Bireysel sözlüye dön</Dugme>
      </Levha>
    </div>
  );
  return (
    <div className="nv-gir" style={{ maxWidth: 860, margin: "0 auto" }}>
      <Dugme tur="sessiz" kucuk tikla={cik}><ChevronLeft size={16} /> Bireysel sözlü</Dugme>
      <div style={{ display: "flex", gap: 6, margin: `${S.sm}px 0 ${S.md}px`, overflowX: "auto" }}>
        {adlar.map((a, i) => <span key={a} style={{ flex: "1 0 auto", padding: "8px 14px", borderRadius: 99, fontSize: 14.5, fontWeight: 700, textAlign: "center",
          background: i === adim ? C.erguvan : i < adim ? C.erguvanSis : C.kagitDerin, color: i === adim ? "#fff" : i < adim ? C.erguvan : C.murekkepAlt }}>{a}</span>)}
      </div>
      <div style={{ background: C.gece, color: "#fff", borderRadius: 22, padding: S.lg, display: "flex", alignItems: "center", gap: S.lg, flexWrap: "wrap", marginBottom: S.md }}>
        <span style={{ fontFamily: T.kalem, fontSize: 46, fontWeight: 700, color: kalan < 31 ? "#FF8A80" : "#fff" }}>{sure(kalan)}</span>
        <div style={{ flex: "1 1 220px", fontSize: 16, color: "#C5D2EE", lineHeight: 1.45 }}>{adim === 0 ? "Parçayı oku ve en çok on kısa madde yaz. Tam cümle yazma; sınavda notlarını okuyamazsın." : IO_BOLUMLER[adim - 1].ne}</div>
        <Dugme tikla={() => setCalisiyor(!calisiyor)} style={{ background: C.safran, color: C.gece, borderColor: C.safran }}>{calisiyor ? <Pause size={17} /> : <Play size={17} />} {calisiyor ? "Duraklat" : "Başlat"}</Dugme>
        <Dugme tikla={ileri} style={{ background: "transparent", color: "#fff", borderColor: "#41558A" }}>{adim === 3 ? "Bitir" : "Sonraki bölüm"} <ChevronRight size={16} /></Dugme>
      </div>
      {adim === 0 && (
        <>
          {!eserler.some((e) => e.ad) && <div style={{ marginBottom: S.md }}><Haber tur="bilgi" basli="Parça sende">Eserlerinden yaklaşık 300 sözcüklük bir bölüm aç (kitaptan ya da öğretmeninin verdiği parçalardan). Eser notlarını “Eserlerim” bölümüne işlersen burada görünür.</Haber></div>}
          {eserler.some((e) => e.ad) && <Levha ic={S.md} style={{ marginBottom: S.md }}>
            {eserler.filter((e) => e.ad).map((e, i) => <div key={i} style={{ fontSize: 15.5, lineHeight: 1.5, marginBottom: 6 }}><b>{e.ad}</b>{e.yazar ? `, ${e.yazar}` : ""}{e.temalar ? `. Temalar: ${e.temalar}` : ""}</div>)}
          </Levha>}
        </>
      )}
      <Levha ic={S.md} style={{ marginBottom: S.md }}>
        <div style={{ fontFamily: T.hat, fontSize: 19, fontWeight: 750, marginBottom: 8 }}>On maddelik not</div>
        {notlar.map((nt, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 6 }}>
            <span style={{ width: 26, textAlign: "right", fontWeight: 800, color: C.erguvan }}>{i + 1}</span>
            <input value={nt} readOnly={adim > 0} maxLength={70} onChange={(e) => setNotlar(notlar.map((x, j) => (j === i ? e.target.value : x)))} placeholder={adim === 0 ? "kısa not" : ""}
              style={{ flex: 1, padding: "9px 12px", borderRadius: 11, border: `1.5px solid ${C.cizgi}`, outline: "none", fontFamily: T.kalem, fontSize: 16, background: adim > 0 ? C.kagitAlt : C.muhre, color: C.murekkep }} />
          </div>
        ))}
      </Levha>
      {adim === 1 && <Levha ic={S.md}><div style={{ fontSize: 15.5, fontWeight: 700, marginBottom: 8 }}>Sunum sırası</div><Liste ogeler={IO_ISKELET.map((b) => `${b.ad} (${b.sure})`)} renk={C.erguvan} /></Levha>}
      {adim >= 2 && <Levha ic={S.md}>
        <div style={{ fontSize: 15.5, fontWeight: 700, marginBottom: 8 }}>{adim === 2 ? "Öğretmenin sorabilecekleri" : "Tema soruları"}</div>
        {(adim === 2 ? sorular.parca : sorular.tema).map((s, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", padding: "9px 0", borderTop: i ? `1px solid ${C.cizgi}` : "none" }}>
            <span style={{ flex: 1, fontFamily: T.kalem, fontSize: 17, lineHeight: 1.5 }}>{s}</span>
            {sesVar() && <button onClick={() => seslendir(s)} aria-label="Soruyu dinle" style={{ width: 40, height: 40, borderRadius: 99, border: "none", background: C.erguvanSis, color: C.erguvan, cursor: "pointer", flexShrink: 0 }}><Volume2 size={17} /></button>}
          </div>
        ))}
      </Levha>}
    </div>
  );
}

function IOSohbet({ cik, eserler, puanVer }) {
  const [mesajlar, setMesajlar] = useState([]);
  const [girdi, setGirdi] = useState("");
  const [bekliyor, setBekliyor] = useState(false);
  const [hata, setHata] = useState(null);
  const [rapor, setRapor] = useState(null);
  const son = useRef(null);
  const eserNot = eserler.filter((e) => e.ad).map((e) => `"${e.ad}" by ${e.yazar || "?"}; characters: ${e.kisiler || "-"}; themes: ${e.temalar || "-"}; key moments: ${e.anlar || "-"}`).join("\n") || "The candidate has not entered their works; ask them which work and extract they prepared.";
  const yonerge = `You are an IB English B HL individual oral examiner (the teacher). Conduct part 2 (follow-up on the literary extract and work) and then part 3 (general discussion on the five themes: identities, experiences, human ingenuity, social organization, sharing the planet).
Works studied:\n${eserNot}
Rules: ask ONE open question at a time, in natural spoken English, 1-2 sentences. React briefly to what the candidate said, then probe or move on. After about 4 exchanges on the work, move to the themes. Never correct language during the conversation.`;
  async function gonder(ilk) {
    const yeni = ilk ? [] : [...mesajlar, { kim: "ben", t: girdi.trim() }];
    if (!ilk && !girdi.trim()) return;
    setMesajlar(yeni); setGirdi(""); setBekliyor(true); setHata(null);
    try {
      const gecmis = yeni.map((m) => `${m.kim === "ben" ? "CANDIDATE" : "EXAMINER"}: ${m.t}`).join("\n");
      const y = await sor(`${yonerge}\n\nConversation so far:\n${gecmis || "(not started)"}\n\nWrite ONLY the examiner's next turn.`, 300);
      setMesajlar([...yeni, { kim: "o", t: y.trim() }]);
    } catch { setHata(true); }
    setBekliyor(false);
  }
  async function degerlendir() {
    setBekliyor(true);
    try {
      const gecmis = mesajlar.map((m) => `${m.kim === "ben" ? "CANDIDATE" : "EXAMINER"}: ${m.t}`).join("\n");
      const v = await sorJSON(`You are an IB English B HL examiner. Based on this written simulation of the individual oral conversation, give feedback using criteria A Language (0-12), B2 Message-conversation (0-6), C Interactive skills (0-6). Pronunciation cannot be judged.
${gecmis}
Return ONLY JSON, explanations in Turkish: {"A":{"puan":0,"gerekce":""},"B2":{"puan":0,"gerekce":""},"C":{"puan":0,"gerekce":""},"guclu":["..."],"gelistir":["..."],"duzeltmeler":[{"yanlis":"exact candidate phrase","dogru":"better version","neden":"kısa neden"}]}`, 1800);
      setRapor(v); puanVer && puanVer(60);
    } catch { setHata(true); }
    setBekliyor(false);
  }
  useEffect(() => { gonder(true); }, []);
  useEffect(() => { son.current && son.current.scrollIntoView({ behavior: "smooth", block: "end" }); }, [mesajlar, bekliyor]);
  const benSayi = mesajlar.filter((m) => m.kim === "ben").length;
  return (
    <div className="nv-gir" style={{ maxWidth: 780, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: S.md, flexWrap: "wrap" }}>
        <Dugme tur="sessiz" kucuk tikla={cik}><ChevronLeft size={16} /> Bireysel sözlü</Dugme><span style={{ flex: 1 }} />
        {benSayi >= 4 && !rapor && <Dugme tur="altin" kucuk pasif={bekliyor} tikla={degerlendir}><Sparkles size={15} /> Bitir ve değerlendir</Dugme>}
      </div>
      {rapor ? (
        <div style={{ display: "grid", gap: S.sm }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: S.sm }}>
            {[["A", 12, "Dil"], ["B2", 6, "Mesaj: sohbet"], ["C", 6, "Etkileşim"]].map(([k, ust, ad]) => rapor[k] && (
              <Levha key={k} ic={S.md}><div><span style={{ fontFamily: T.hat, fontSize: 32, fontWeight: 800, color: C.erguvan }}>{rapor[k].puan}</span><span style={{ color: C.murekkepSis }}> / {ust}</span></div>
                <div style={{ fontWeight: 700 }}>{ad}</div><div style={{ fontSize: 14.5, color: C.murekkepAlt, lineHeight: 1.45, marginTop: 4 }}>{rapor[k].gerekce}</div></Levha>))}
          </div>
          {rapor.guclu && <Haber tur="iyi" basli="Güçlü yanlar"><Liste ogeler={rapor.guclu} renk={C.zumrut} /></Haber>}
          {rapor.gelistir && <Haber tur="altin" basli="Bir üst bant için"><Liste ogeler={rapor.gelistir} /></Haber>}
          {(rapor.duzeltmeler || []).length > 0 && <Levha ic={S.md} renk={C.lal}>{rapor.duzeltmeler.map((d, i) => (
            <div key={i} style={{ padding: "8px 0", borderTop: i ? `1px solid ${C.cizgi}` : "none" }}>
              <div style={{ fontFamily: T.kalem, fontSize: 15.5 }}><span style={{ color: C.lal, textDecoration: "line-through" }}>{d.yanlis}</span> → <b style={{ color: C.zumrut }}>{d.dogru}</b></div>
              <div style={{ fontSize: 14.5, color: C.murekkepAlt }}>{d.neden}</div></div>))}</Levha>}
          <div style={{ fontSize: 13.5, color: C.murekkepSis }}>Yazılı bir canlandırmadan çıkarılan tahmindir; telaffuz ve akıcılık ölçülemez. Sesli çalışma için Atölye'deki Sesli sekmesini kullan.</div>
        </div>
      ) : (
        <>
          <div style={{ display: "grid", gap: 10, marginBottom: S.md }}>
            {mesajlar.map((m, i) => (
              <div key={i} style={{ justifySelf: m.kim === "ben" ? "end" : "start", maxWidth: "86%", padding: "12px 16px", borderRadius: m.kim === "ben" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                background: m.kim === "ben" ? C.altin : C.muhre, color: m.kim === "ben" ? "#fff" : C.murekkep, border: m.kim === "ben" ? "none" : `1px solid ${C.cizgi}`, fontFamily: T.kalem, fontSize: 17, lineHeight: 1.55 }}>
                {m.t}
                {m.kim === "o" && sesVar() && <button onClick={() => seslendir(m.t)} aria-label="Dinle" style={{ marginLeft: 8, border: "none", background: "transparent", color: C.altin, cursor: "pointer", verticalAlign: "middle" }}><Volume2 size={16} /></button>}
              </div>
            ))}
            {bekliyor && <Bekle asamalar={["Sınav görevlisi düşünüyor…"]} />}
            {hata && <Haber tur="hata" basli="Bağlantı kurulamadı">Yapay zekâya ulaşılamadı. “Soru çek” ve “Tam prova” bağlantı gerektirmez. <div style={{ marginTop: 8 }}><Dugme tur="ikincil" kucuk tikla={() => gonder(mesajlar.length === 0)}>Yeniden dene</Dugme></div></Haber>}
            <span ref={son} />
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "flex-end", position: "sticky", bottom: 86, background: C.kagit, paddingTop: 8 }}>
            <textarea value={girdi} onChange={(e) => setGirdi(e.target.value)} rows={3} placeholder="Yanıtını İngilizce yaz; sınavdaki gibi en az üç dört cümle."
              onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) gonder(false); }}
              style={{ flex: 1, padding: "12px 14px", borderRadius: 16, border: `2px solid ${C.golge}`, outline: "none", resize: "vertical", fontFamily: T.kalem, fontSize: 17, lineHeight: 1.55, background: C.muhre, color: C.murekkep }} />
            <Dugme tur="altin" pasif={bekliyor || !girdi.trim()} tikla={() => gonder(false)}><Send size={17} /></Dugme>
          </div>
        </>
      )}
    </div>
  );
}
