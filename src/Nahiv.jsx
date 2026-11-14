/* ══════════════════════════════════════════════════════════════════════
   N A H İ V  4   ·   İngilizce B HL merkezi
   Kabuk: gezinme, veri, puan ve ana sayfa. Bileşenlerin çoğu
   cekirdek.jsx içindedir; yeni bölümler kendi dosyalarında durur.
   ══════════════════════════════════════════════════════════════════════ */
import React, { useState, useEffect, useLayoutEffect, useMemo, useCallback, useRef } from "react";
import { Home, Library, GraduationCap, Waypoints, Feather, Flame, Command, ChevronRight, Anchor, RotateCcw, Volume2, Minus, Plus, Play, Type } from "lucide-react";
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
  { id: "ana", ad: "Bugün", ikon: Home, sekmeler: [["bugun", "Bugün"], ["seyir", "Seyir defteri"], ["sandik", "Sandık"]] },
  { id: "kelime", ad: "Kelime", ikon: Library, sekmeler: [["dagarcik", "Dağarcık"]] },
  { id: "sinav", ad: "Sınav", ikon: GraduationCap, sekmeler: [["turler", "Metin türleri"], ["p1", "Paper 1"], ["p2", "Paper 2"], ["io", "Sözlü (IO)"]] },
  { id: "gramer", ad: "Gramer", ikon: Waypoints, sekmeler: [["divan", "Plan"], ["talim", "Talimhane"], ["sokrates", "Sokrates"], ["harita", "Takımyıldız"], ["defter", "Hata defteri"]] },
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
.nv-gir{animation:nvGir .38s cubic-bezier(.2,.8,.25,1) backwards}
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

/* ── 4.3 kabuk ── */
.nv-ust{position:sticky;top:0;z-index:40;background:rgba(244,247,251,.82);backdrop-filter:blur(18px) saturate(1.4);-webkit-backdrop-filter:blur(18px) saturate(1.4);border-bottom:1px solid rgba(15,27,51,.07)}
.nv-ust-ic{max-width:1240px;margin:0 auto;display:flex;align-items:center;gap:14px}
.nv-logo{display:flex;align-items:center;gap:10px;border:none;background:transparent;cursor:pointer;padding:0;color:${C.murekkep};font-family:${T.hat};font-weight:800;font-size:22px;letter-spacing:-.04em}
.nv-logo svg{transition:transform .4s cubic-bezier(.3,1.6,.5,1)}.nv-logo:hover svg{transform:rotate(-8deg) scale(1.08)}
.nv-kay{position:relative;display:flex;gap:2px}
.nv-kay button{position:relative;z-index:1;display:flex;align-items:center;gap:8px;border:none;background:transparent;cursor:pointer;font-weight:750;color:${C.murekkepAlt};transition:color .25s;white-space:nowrap}
.nv-kay button.et{color:${C.murekkep}}
.nv-kay-gos{position:absolute;left:0;top:0;transition:transform .45s cubic-bezier(.3,1.25,.4,1),width .45s cubic-bezier(.3,1.25,.4,1);pointer-events:none}
.nv-kay-ust{margin-left:18px;padding:5px;border-radius:99px;background:rgba(15,27,51,.055)}
.nv-kay-ust button{padding:10px 18px;min-height:44px;border-radius:99px;font-size:16px}
.nv-kay-ust button.et{color:#fff}
.nv-kay-ust .nv-kay-gos{border-radius:99px;background:${C.murekkep};box-shadow:0 8px 18px -8px rgba(15,27,51,.6)}
.nv-kay-alt{overflow-x:auto;gap:4px;scrollbar-width:none}.nv-kay-alt::-webkit-scrollbar{display:none}
.nv-kay-alt button{padding:12px 14px 14px;font-size:16px}
.nv-kay-alt .nv-kay-gos{top:auto;bottom:0;height:4px;border-radius:4px 4px 0 0;background:${C.altin}}
.nv-kay-taban{width:100%;justify-content:space-between}
.nv-kay-taban button{flex:1;flex-direction:column;gap:4px;padding:9px 2px;min-height:60px;border-radius:20px;font-size:12.5px;color:#9FB0D6}
.nv-kay-taban button.et{color:${C.gece}}
.nv-kay-taban .nv-kay-gos{border-radius:20px;background:#fff}
.nv-taban{position:fixed;left:12px;right:12px;bottom:12px;z-index:40;background:rgba(11,22,48,.92);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border-radius:26px;padding:6px;box-shadow:0 20px 40px -14px rgba(11,22,48,.75)}
.nv-rozet{font-style:normal;font-size:12px;font-weight:800;background:${C.lal};color:#fff;border-radius:99px;padding:1px 7px}
.nv-yuvarlak{width:44px;height:44px;border-radius:99px;border:1px solid rgba(15,27,51,.1);background:#fff;cursor:pointer;color:${C.murekkep};display:flex;align-items:center;justify-content:center;transition:transform .2s}
.nv-yuvarlak:active{transform:scale(.92)}
.nv-puan{position:relative;display:flex;align-items:center;gap:7px;height:44px;padding:0 16px;border-radius:99px;border:1px solid rgba(15,27,51,.1);background:#fff;cursor:pointer;color:${C.murekkep};font-size:15.5px}
.nv-puan-ayrac{width:1px;height:20px;background:rgba(15,27,51,.12);margin:0 4px}
.nv-hero{border-radius:34px;overflow:hidden;box-shadow:0 40px 70px -40px rgba(11,22,48,.75)}
.nv-hero > div{border-radius:34px!important;box-shadow:none!important}
.nv-hero-ust{position:absolute;left:0;right:0;top:0;display:flex;justify-content:space-between;padding:clamp(14px,2.6vw,26px)}
.nv-cip-cam{display:inline-flex;align-items:center;gap:8px;padding:9px 15px;border-radius:99px;background:rgba(9,16,40,.38);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);color:#fff;font-size:15px;font-weight:700;border:1px solid rgba(255,255,255,.16)}
.nv-hero-alt{position:absolute;left:0;right:0;bottom:0;padding:clamp(20px,3.6vw,44px);padding-top:120px;color:#fff;background:linear-gradient(180deg,rgba(6,12,32,0) 0%,rgba(6,12,32,.45) 45%,rgba(6,12,32,.78) 100%);text-shadow:0 2px 18px rgba(0,0,0,.35)}
.nv-kelime-gir{display:inline-block;animation:nvKelGir .8s cubic-bezier(.2,.9,.2,1) both}
@keyframes nvKelGir{from{opacity:0;transform:translateY(26px);filter:blur(8px)}to{opacity:1;transform:none;filter:none}}
.nv-sefer{position:relative;display:flex;align-items:center;gap:14px;padding:12px 26px 12px 12px;min-height:72px;border:none;border-radius:99px;background:#fff;color:${C.gece};cursor:pointer;text-shadow:none;box-shadow:0 18px 36px -14px rgba(0,0,0,.6);transition:transform .25s cubic-bezier(.3,1.5,.5,1),box-shadow .25s;overflow:hidden}
.nv-sefer::after{content:"";position:absolute;inset:0;background:linear-gradient(105deg,transparent 35%,rgba(255,210,77,.45) 50%,transparent 65%);background-size:250% 100%;animation:nvIsil 3.2s ease-in-out 1.4s infinite}
.nv-sefer:hover{transform:translateY(-3px) scale(1.02);box-shadow:0 26px 44px -16px rgba(0,0,0,.7)}
.nv-sefer:active{transform:scale(.97)}
.nv-sefer-ikon{width:50px;height:50px;border-radius:99px;background:${C.safran};color:${C.gece};display:flex;align-items:center;justify-content:center;padding-left:3px;animation:nvAtim 2.4s ease-in-out infinite}
@keyframes nvAtim{0%,100%{box-shadow:0 0 0 0 rgba(240,164,0,.55)}60%{box-shadow:0 0 0 14px rgba(240,164,0,0)}}
.nv-hedef{display:flex;align-items:center;gap:12px;padding:6px 18px 6px 6px;border-radius:99px;background:rgba(9,16,40,.4);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,.16);font-size:15px}
.nv-kapilar{display:grid;grid-template-columns:1fr;gap:18px;margin-top:22px}@media (min-width:700px){.nv-kapilar{grid-template-columns:repeat(3,1fr);gap:14px}}@media (min-width:700px) and (max-width:1000px){.nv-kapi{padding:20px;min-height:290px}}
.nv-kapi{position:relative;min-height:320px;padding:26px;border:none;border-radius:30px;color:#fff;cursor:pointer;overflow:hidden;text-align:left;
  transform:perspective(900px) rotateX(var(--rx,0)) rotateY(var(--ry,0));transition:transform .5s cubic-bezier(.2,.8,.2,1),box-shadow .4s;
  box-shadow:0 28px 50px -30px rgba(11,22,48,.8);animation:nvKapiGir .8s cubic-bezier(.2,.9,.2,1) both}
.nv-kapi:hover{transition:transform .12s linear,box-shadow .4s;box-shadow:0 40px 60px -30px rgba(11,22,48,.9)}
.nv-kapi:active{transform:perspective(900px) scale(.98)}
@keyframes nvKapiGir{from{opacity:0;transform:perspective(900px) translateY(40px) rotateX(14deg)}to{opacity:1}}
.nv-kapi-cizim{position:absolute;left:0;right:0;top:0;height:50%;opacity:.95;transition:transform .6s cubic-bezier(.2,.8,.2,1)}
.nv-kapi:hover .nv-kapi-cizim{transform:scale(1.06) translateY(-4px)}
.nv-kapi-parilti{position:absolute;inset:0;background:radial-gradient(420px circle at var(--gx,50%) var(--gy,0%),rgba(255,255,255,.22),transparent 45%);opacity:0;transition:opacity .3s;pointer-events:none}
.nv-kapi:hover .nv-kapi-parilti{opacity:1}
.nv-kapi-ok{width:46px;height:46px;border-radius:99px;background:rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center;transition:transform .3s cubic-bezier(.3,1.5,.5,1),background .3s}
.nv-kapi:hover .nv-kapi-ok{transform:translateX(5px);background:rgba(255,255,255,.34)}
.nv-ciz{stroke-dasharray:600;stroke-dashoffset:600;animation:nvCizgi 1.8s cubic-bezier(.4,0,.2,1) forwards}
@keyframes nvCizgi{to{stroke-dashoffset:0}}
.nv-durakcik{transform-box:fill-box;transform-origin:center;animation:nvPop .5s cubic-bezier(.3,1.8,.5,1) both}
@keyframes nvPop{from{transform:scale(0)}to{transform:scale(1)}}
.nv-kagit{animation:nvYuzKagit 5s ease-in-out infinite}
@keyframes nvYuzKagit{0%,100%{translate:0 0}50%{translate:0 -7px}}
.nv-kalem{animation:nvKalem 2.2s ease-in-out infinite;transform-box:fill-box}
@keyframes nvKalem{0%,100%{translate:0 0}50%{translate:14px -4px}}
.nv-nabiz{transform-box:fill-box;transform-origin:center;animation:nvNabiz 2.8s ease-in-out infinite}
@keyframes nvNabiz{0%,100%{transform:scale(.7);opacity:.4}50%{transform:scale(1.25);opacity:1}}
.nv-yildiz{animation:nvPirilti 2.6s ease-in-out infinite}
.nv-alt-ikili{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(380px,100%),1fr));gap:18px;margin-top:18px}
.nv-donen{position:relative;height:100%;min-height:250px;transform-style:preserve-3d;transition:transform .7s cubic-bezier(.3,1.3,.4,1);cursor:pointer}
.nv-yuz{position:absolute;inset:0;border-radius:28px;padding:26px;display:flex;flex-direction:column;backface-visibility:hidden;-webkit-backface-visibility:hidden;overflow:hidden}
.nv-baglanti{padding:11px 18px;min-height:44px;border-radius:99px;border:1px solid rgba(15,27,51,.12);background:#fff;color:${C.murekkep};font-size:15px;font-weight:700;cursor:pointer;transition:transform .2s,box-shadow .2s}
.nv-baglanti:hover{transform:translateY(-2px);box-shadow:0 10px 20px -12px rgba(15,27,51,.5)}
@media (max-width:899px){.nv-kapi{min-height:300px}.nv-ipucu{display:none}.nv-hero,.nv-hero > div{border-radius:26px!important}}

/* ── 4.4 çalışma ekranı, sonuç, adımlar, kapsam ── */
.nv-odak{position:relative;margin:-24px -24px 0;padding:28px 24px 48px;min-height:calc(100vh - 76px);background:radial-gradient(1100px 520px at 50% -12%,color-mix(in srgb,var(--r) 26%,transparent),transparent 72%)}
@media (max-width:899px){.nv-odak{margin:-24px -12px 0;padding:18px 12px 40px}}
.nv-oturum{display:flex;align-items:center;gap:14px;margin-bottom:24px}
.nv-oturum-cik{flex-shrink:0;width:46px;height:46px;border-radius:99px;border:1px solid rgba(15,27,51,.12);background:#fff;color:${C.murekkep};cursor:pointer;display:flex;align-items:center;justify-content:center;transition:transform .2s,background .2s}
.nv-oturum-cik:hover{transform:rotate(90deg);background:${C.lalSis};color:${C.lal}}
.nv-ilerleme{height:14px;border-radius:99px;background:rgba(15,27,51,.08);overflow:hidden}
.nv-ilerleme span{position:relative;display:block;height:100%;border-radius:99px;background:linear-gradient(90deg,color-mix(in srgb,var(--r,#1B4FCF) 60%,#fff),var(--r,#1B4FCF));transition:width .7s cubic-bezier(.3,1.35,.4,1)}
.nv-ilerleme span::after{content:"";position:absolute;left:8px;right:8px;top:3px;height:3px;border-radius:3px;background:rgba(255,255,255,.5)}
.nv-oturum-cip{flex-shrink:0;display:inline-flex;align-items:center;gap:6px;padding:9px 14px;border-radius:99px;background:#fff;border:1px solid rgba(15,27,51,.1);font-weight:800;font-size:15.5px;color:${C.murekkepAlt}}
.nv-oturum-cip.dogru{color:${C.zumrut};background:${C.zumSis};border-color:transparent;animation:nvZil .45s cubic-bezier(.3,1.5,.5,1)}
.nv-oturum-cip.acil{color:${C.lal};background:${C.lalSis};border-color:transparent;animation:nvZil .45s}
.nv-sonuc{text-align:center;border-radius:32px;padding:28px 24px 30px;background:radial-gradient(600px 300px at 50% 0%,color-mix(in srgb,var(--r) 22%,#fff),#fff 70%);border:1px solid ${C.cizgi};box-shadow:0 30px 60px -40px rgba(15,27,51,.6);animation:nvKapiGir .7s cubic-bezier(.2,.9,.2,1) both}
.nv-yildizlar{display:flex;justify-content:center;align-items:flex-end;gap:10px;height:60px}
.nv-yildizlar svg{color:rgba(15,27,51,.14);fill:rgba(15,27,51,.08)}
.nv-yildizlar svg.dolu{color:#E89B00;fill:#FFC93C;animation:nvYildizPat .6s cubic-bezier(.3,1.8,.5,1) both;filter:drop-shadow(0 6px 10px rgba(232,155,0,.45))}
@keyframes nvYildizPat{0%{transform:scale(0) rotate(-40deg);opacity:0}100%{transform:none;opacity:1}}
.nv-sonuc-soz{animation:nvKelGir .7s .5s cubic-bezier(.2,.9,.2,1) both}
.nv-zor{display:flex;flex-direction:column;gap:2px;padding:12px 14px;border-radius:16px;background:${C.kagitAlt};border:1px solid ${C.cizgi};animation:nvKelGir .5s cubic-bezier(.2,.9,.2,1) both}
.nv-adimlar{display:grid;gap:12px}
.nv-adim{display:flex;align-items:center;gap:16px;padding:18px 20px;min-height:84px;border-radius:24px;border:1px solid ${C.cizgi};background:#fff;cursor:pointer;color:${C.murekkep};
  box-shadow:0 18px 32px -28px rgba(15,27,51,.55);transition:transform .25s cubic-bezier(.3,1.4,.5,1),box-shadow .25s,border-color .25s;animation:nvKelGir .6s cubic-bezier(.2,.9,.2,1) both}
.nv-adim:hover{transform:translateX(6px);border-color:var(--r);box-shadow:0 22px 36px -24px color-mix(in srgb,var(--r) 70%,transparent)}
.nv-adim-no{flex-shrink:0;width:48px;height:48px;border-radius:16px;background:var(--r);color:#fff;display:flex;align-items:center;justify-content:center;font-family:${T.hat};font-weight:800;font-size:22px}
.nv-adim-ok{flex-shrink:0;width:42px;height:42px;border-radius:99px;background:color-mix(in srgb,var(--r) 14%,#fff);color:var(--r);display:flex;align-items:center;justify-content:center;padding-left:2px;transition:transform .25s}
.nv-adim:hover .nv-adim-ok{transform:scale(1.12)}
.nv-kapsamlar{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(190px,46%),1fr));gap:12px}
.nv-kapsam{text-align:left;padding:18px;min-height:132px;border-radius:24px;border:2px solid ${C.cizgi};background:#fff;color:${C.murekkep};cursor:pointer;transition:transform .25s cubic-bezier(.3,1.4,.5,1),background .25s,border-color .25s,color .25s;animation:nvKelGir .55s cubic-bezier(.2,.9,.2,1) both}
.nv-kapsam:hover{transform:translateY(-3px);border-color:var(--r)}
.nv-kapsam.et{background:var(--r);border-color:var(--r);color:#fff;box-shadow:0 20px 34px -22px var(--r)}
.nv-kapsam-ikon{width:44px;height:44px;border-radius:14px;display:flex;align-items:center;justify-content:center;background:color-mix(in srgb,var(--r) 14%,#fff);color:var(--r);transition:background .25s,color .25s}
.nv-kapsam.et .nv-kapsam-ikon{background:rgba(255,255,255,.22);color:#fff}
.nv-kapsam-sec{display:inline-flex;align-items:center;gap:8px;padding:11px 18px;min-height:46px;border-radius:99px;border:2px solid ${C.cizgi};background:#fff;color:${C.murekkep};font-size:15.5px;font-weight:750;cursor:pointer;transition:border-color .2s,background .2s,color .2s}
.nv-kapsam-sec:hover{border-color:${C.cetvel}}
.nv-kapsam-sec.et{background:var(--r);border-color:var(--r);color:#fff}
.nv-perde-arka{position:fixed;inset:0;z-index:80;background:rgba(11,22,48,.42);backdrop-filter:blur(5px);-webkit-backdrop-filter:blur(5px);animation:nvSoluk .25s ease both}
@keyframes nvSoluk{from{opacity:0}}
.nv-sayfa{font-family:${T.govde};color:${C.murekkep};position:fixed;left:50%;bottom:0;transform:translateX(-50%);width:min(780px,100%);max-height:84vh;overflow:auto;background:#fff;border-radius:30px 30px 0 0;padding:24px 24px 40px;z-index:81;box-shadow:0 -30px 60px -30px rgba(11,22,48,.5);animation:nvYukari .5s cubic-bezier(.2,.95,.2,1) both}
@keyframes nvYukari{from{transform:translate(-50%,100%)}to{transform:translate(-50%,0)}}
.nv-durak-cip{padding:9px 15px;min-height:42px;border-radius:99px;border:1.5px solid color-mix(in srgb,var(--r) 35%,#fff);background:color-mix(in srgb,var(--r) 8%,#fff);color:${C.murekkep};font-size:15px;font-weight:650;cursor:pointer;transition:background .2s,color .2s,transform .2s}
.nv-durak-cip:hover{transform:translateY(-2px)}
.nv-durak-cip.et,.nv-durak-cip:active{background:var(--r);color:#fff}
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

/* ─── Ana sayfa: bir sahne, bir düğme, üç kapı ───────────────────── */

function Kapi({ renk1, renk2, baslik, alt, deger, birim, cizim, tikla, gecikme }) {
  const ref = useRef(null);
  const hareket = (e) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--rx", `${(0.5 - y) * 9}deg`); el.style.setProperty("--ry", `${(x - 0.5) * 11}deg`);
    el.style.setProperty("--gx", `${x * 100}%`); el.style.setProperty("--gy", `${y * 100}%`);
  };
  const birak = () => { const el = ref.current; if (!el) return; el.style.setProperty("--rx", "0deg"); el.style.setProperty("--ry", "0deg"); };
  return (
    <button ref={ref} onClick={tikla} onPointerMove={hareket} onPointerLeave={birak} className="nv-kapi"
      style={{ animationDelay: `${gecikme}ms`, background: `linear-gradient(150deg, ${renk1}, ${renk2})` }}>
      <span className="nv-kapi-cizim" aria-hidden="true">{cizim}</span>
      <span className="nv-kapi-parilti" aria-hidden="true" />
      <span style={{ position: "relative", display: "flex", flexDirection: "column", height: "100%", textAlign: "left" }}>
        <span style={{ flex: 1 }} />
        <span style={{ fontFamily: T.hat, fontSize: "clamp(28px, 3.4vw, 36px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1 }}>{baslik}</span>
        <span style={{ fontSize: 16, opacity: .9, marginTop: 6, lineHeight: 1.35 }}>{alt}</span>
        <span style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 16 }}>
          <span><b style={{ fontFamily: T.hat, fontSize: 26, fontWeight: 800 }}>{deger}</b> <span style={{ fontSize: 14.5, opacity: .85 }}>{birim}</span></span>
          <span className="nv-kapi-ok"><ChevronRight size={22} /></span>
        </span>
      </span>
    </button>
  );
}

const CizimKelime = () => (
  <svg viewBox="0 0 300 170" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
    {[["M-10 40 C 70 40, 90 110, 170 110 S 260 60, 320 60", "#FFD24D"], ["M-10 140 C 60 140, 110 70, 180 70 S 270 130, 320 120", "#7FF0C9"], ["M-10 92 C 80 92, 120 30, 200 30 S 290 90, 320 96", "#FF9DB8"]].map(([d, r], i) => (
      <g key={i}>
        <path d={d} stroke="rgba(255,255,255,.16)" strokeWidth="14" fill="none" strokeLinecap="round" />
        <path d={d} stroke={r} strokeWidth="6" fill="none" strokeLinecap="round" className="nv-ciz" style={{ animationDelay: `${300 + i * 260}ms` }} />
      </g>
    ))}
    {[[60, 52], [170, 110], [250, 75], [110, 103], [200, 30], [260, 128], [40, 140]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="7" fill="#fff" stroke="rgba(0,0,0,.25)" strokeWidth="3" className="nv-durakcik" style={{ animationDelay: `${900 + i * 90}ms` }} />)}
  </svg>
);
const CizimSinav = () => (
  <svg viewBox="0 0 300 170" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
    {[[150, 26, -9, .55], [175, 18, 4, .75], [196, 30, 13, 1]].map(([x, y, a, o], i) => (
      <g key={i} transform={`translate(${x} ${y}) rotate(${a})`} className="nv-kagit" style={{ animationDelay: `${i * 0.5}s` }}>
        <rect width="92" height="118" rx="8" fill="#fff" opacity={o} />
        {Array.from({ length: 7 }, (_, n) => <rect key={n} x="12" y={18 + n * 13} width={n === 0 ? 50 : 68 - (n % 3) * 10} height="4" rx="2" fill={n === 0 ? "#C2187A" : "#D9DCEB"} opacity={o} />)}
      </g>
    ))}
    <g className="nv-kalem"><rect x="70" y="96" width="96" height="12" rx="6" fill="#FFD24D" transform="rotate(-28 118 102)" /><path d="M160 72 l14 -6 -4 14 z" fill="#2A1236" /></g>
  </svg>
);
const CizimGramer = () => {
  const n = [[40, 120], [92, 60], [150, 100], [204, 40], [258, 92], [224, 142], [120, 150]];
  return (
    <svg viewBox="0 0 300 170" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
      {[[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [2, 6], [2, 5]].map(([a, b], i) => <line key={i} x1={n[a][0]} y1={n[a][1]} x2={n[b][0]} y2={n[b][1]} stroke="rgba(255,255,255,.55)" strokeWidth="2" className="nv-ciz" style={{ animationDelay: `${400 + i * 140}ms` }} />)}
      {n.map(([x, y], i) => <g key={i}><circle cx={x} cy={y} r="13" fill="rgba(255,255,255,.14)" className="nv-nabiz" style={{ animationDelay: `${i * .4}s` }} /><circle cx={x} cy={y} r="5.5" fill="#fff" /></g>)}
      {Array.from({ length: 22 }, (_, i) => <circle key={"y" + i} cx={(i * 53) % 300} cy={(i * 37) % 170} r="1.4" fill="#fff" className="nv-yildiz" style={{ animationDelay: `${(i % 7) * .45}s` }} />)}
    </svg>
  );
};

function GununKelimesi({ k }) {
  const [cevrik, setCevrik] = useState(false);
  const m = DURAK_META[k.durak];
  return (
    <div style={{ perspective: 1200, minHeight: 250 }}>
      <div onClick={() => setCevrik(!cevrik)} role="button" aria-label="Kartı çevir" className="nv-donen" style={{ transform: cevrik ? "rotateY(180deg)" : "none" }}>
        <div className="nv-yuz" style={{ background: C.muhre, border: `1px solid ${C.cizgi}` }}>
          <div style={{ fontSize: 14.5, fontWeight: 750, color: m.koyu || m.renk }}>Günün kelimesi · {k.lv}</div>
          <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
            <div style={{ fontFamily: T.hat, fontSize: k.w.length > 18 ? 34 : 46, fontWeight: 800, letterSpacing: "-0.035em", lineHeight: 1.02, color: C.murekkep }}>{k.w}</div>
          </div>
          <div style={{ fontSize: 14.5, color: C.murekkepSis }}>Anlamı için dokun</div>
        </div>
        <div className="nv-yuz" style={{ transform: "rotateY(180deg)", background: `linear-gradient(150deg, ${m.renk}, ${m.koyu || m.renk})`, color: m.murekkep || "#fff" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 14.5, fontWeight: 750, opacity: .9 }}>{m.ad}</span>
            {sesVar() && <button onClick={(e) => { e.stopPropagation(); seslendir(k.w); }} aria-label="Seslendir" style={{ width: 40, height: 40, borderRadius: 99, border: "none", background: "rgba(255,255,255,.22)", color: "inherit", cursor: "pointer" }}><Volume2 size={18} /></button>}
          </div>
          <div style={{ fontFamily: T.hat, fontSize: 28, fontWeight: 780, margin: "8px 0", lineHeight: 1.15 }}>{k.tr}</div>
          <div style={{ fontFamily: T.kalem, fontSize: 16, lineHeight: 1.6, opacity: .95 }}>{k.ornek}</div>
        </div>
      </div>
    </div>
  );
}

function AnaSayfa({ profil, oyun, dag, ustalik, sinav, git, kelimeAc, puanVer }) {
  const [an, setAn] = useState(() => new Date());
  useEffect(() => { const t = setInterval(() => setAn(new Date()), 30000); return () => clearInterval(t); }, []);
  const vadesi = useMemo(() => vadesiGelenler(dag).length, [dag]);
  const usta = useMemo(() => Object.values(dag).filter((s) => s && s.usta).length, [dag]);
  const baslanan = useMemo(() => Object.values(dag).filter((s) => s && s.kutu > 0).length, [dag]);
  const sira = useMemo(() => {
    for (const h of HATLAR) for (const [id] of h.duraklar) { const p = durakIlerleme(dag, id); if (p.toplam && p.usta < p.toplam) return { h, id, p }; }
    return null;
  }, [dag]);
  const gk = useMemo(() => { let t = 0; for (const c of bugun()) t = (t * 31 + c.charCodeAt(0)) % 100003; const zor = KELIMELER.filter((k) => k.lv === "C1" || k.lv === "C2"); return zor[t % zor.length]; }, []);
  const bp = bugunPuan(oyun), hedef = oyun.hedef || 100, seri = seriGun(oyun), sv = seviyeHesap(oyun.xp);
  const besle = useRef(0);
  const marti = useCallback(() => { besle.current++; if (besle.current % 3 === 0 && besle.current <= 9) puanVer(1); }, [puanVer]);
  const yeniSay = Math.max(0, 8 - Math.min(8, Math.floor(vadesi / 3)));
  const sefer = () => kelimeAc(vadesi ? { gorunum: "studyo", kapsam: { tur: "vadesi" }, yol: "kart" } : { gorunum: "studyo", kapsam: sira ? { tur: "durak", id: sira.id } : { tur: "yeni" }, yol: "maraton" });
  const saat = `${String(an.getHours()).padStart(2, "0")}:${String(an.getMinutes()).padStart(2, "0")}`;
  const oran = Math.min(1, bp / hedef);

  return (
    <div>
      <div className="nv-hero">
        <Bogaz yukseklik={"clamp(440px, 62vh, 620px)"} onMarti={marti}>
          <div className="nv-hero-ust">
            <span className="nv-cip-cam"><Flame size={17} style={{ color: seri ? "#FF7A59" : "#C9D6F2" }} /> {seri ? `${seri} gündür seferdesin` : "Bugün ilk seferin"}</span>
            <span className="nv-cip-cam" style={{ fontFamily: T.kalem, fontWeight: 700 }}>{saat}</span>
          </div>
          <div className="nv-hero-alt">
            <div style={{ fontFamily: T.hat, fontSize: "clamp(40px, 7.2vw, 78px)", fontWeight: 800, letterSpacing: "-0.045em", lineHeight: .95 }}>
              {selamla(an, profil.ad).split(" ").map((s, i) => <span key={i} className="nv-kelime-gir" style={{ animationDelay: `${300 + i * 110}ms` }}>{s}&nbsp;</span>)}
            </div>
            <div className="nv-kelime-gir" style={{ animationDelay: "620ms", fontSize: "clamp(16px, 2vw, 19px)", opacity: .9, marginTop: 12 }}>
              {sv.no}. iskele, {sv.ad}. {sv.sonraki ? `${sv.sonraki} iskelesine ${sv.kalan} puan.` : "Son iskeledesin."}
            </div>
            <div className="nv-kelime-gir" style={{ animationDelay: "780ms", display: "flex", alignItems: "center", gap: 16, marginTop: 22, flexWrap: "wrap", pointerEvents: "auto" }}>
              <button onClick={sefer} className="nv-sefer">
                <span className="nv-sefer-ikon"><Play size={22} fill="currentColor" /></span>
                <span style={{ textAlign: "left" }}>
                  <span style={{ display: "block", fontFamily: T.hat, fontSize: 21, fontWeight: 800, letterSpacing: "-0.01em" }}>Günün seferine çık</span>
                  <span style={{ display: "block", fontSize: 14.5, opacity: .75, marginTop: 1 }}>{vadesi ? `${vadesi} kelime tekrar bekliyor` : sira ? `${DURAK_META[sira.id].ad} durağından ${yeniSay} yeni kelime` : "Yeni kelimelerle tanış"}</span>
                </span>
              </button>
              <div className="nv-hedef" title={`${bp} / ${hedef} puan`}>
                <svg width="64" height="64" viewBox="0 0 64 64">
                  <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(255,255,255,.22)" strokeWidth="7" />
                  <circle cx="32" cy="32" r="26" fill="none" stroke={oran >= 1 ? "#7FF0C9" : "#FFD24D"} strokeWidth="7" strokeLinecap="round"
                    strokeDasharray={`${163.4 * oran} 163.4`} transform="rotate(-90 32 32)" style={{ transition: "stroke-dasharray 1s cubic-bezier(.2,.8,.2,1)" }} />
                </svg>
                <span style={{ lineHeight: 1.15 }}><b style={{ fontSize: 19 }}>{bp}</b><span style={{ opacity: .75 }}> / {hedef}</span><br /><span style={{ fontSize: 13.5, opacity: .75 }}>bugünkü puan</span></span>
              </div>
            </div>
          </div>
        </Bogaz>
      </div>

      <div className="nv-kapilar">
        <Kapi gecikme={120} renk1="#2050E0" renk2="#0B2A8A" baslik="Kelime" alt={`${HATLAR.length} hat, ${Object.keys(DURAK_META).length} durak, ${TUM_YOLLAR.length} çalışma yolu`} deger={usta} birim={`/ ${KELIMELER.length} ustalaşıldı`} cizim={<CizimKelime />} tikla={() => kelimeAc({ gorunum: "hat" })} />
        <Kapi gecikme={220} renk1="#E2307E" renk2="#7A0E52" baslik="Sınav" alt="Metin türleri, Paper 1, Paper 2, Sözlü" deger={(sinav.p1 || []).length + Object.keys(sinav.p2 || {}).length} birim="prova yapıldı" cizim={<CizimSinav />} tikla={() => git("turler")} />
        <Kapi gecikme={320} renk1="#0E8A9A" renk2="#0B3550" baslik="Gramer" alt="Talim, hata defteri, Sokrates" deger={Object.keys(ustalik).length} birim={`/ ${DUGUMLER.length} düğüm çalışıldı`} cizim={<CizimGramer />} tikla={() => git("divan")} />
      </div>

      <div className="nv-alt-ikili">
        <GununKelimesi k={gk} />
        <div style={{ background: C.muhre, border: `1px solid ${C.cizgi}`, borderRadius: 28, padding: 26, display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ fontFamily: T.hat, fontSize: 24, fontWeight: 800, letterSpacing: "-0.02em" }}>Boğaz yolculuğun</div>
          <div style={{ position: "relative", height: 70 }}>
            <div style={{ position: "absolute", left: 0, right: 0, top: 46, height: 10, borderRadius: 10, background: C.laciSis }} />
            <div style={{ position: "absolute", left: 0, top: 46, height: 10, borderRadius: 10, background: `linear-gradient(90deg, ${C.laciAcik}, ${C.lacivert})`, width: `${sv.oran}%`, transition: "width 1.2s cubic-bezier(.2,.8,.2,1)" }} />
            <div className="nv-vapurcuk" style={{ position: "absolute", top: 6, left: `calc(${sv.oran}% - ${sv.oran * 0.52}px)`, transition: "left 1.2s cubic-bezier(.2,.8,.2,1)" }}>
              <svg width="52" height="40" viewBox="0 0 48 34"><rect x="26" y="2" width="7" height="12" fill={C.safran} /><rect x="26" y="2" width="7" height="4" fill={C.murekkep} /><rect x="9" y="13" width="30" height="8" rx="2" fill="#fff" stroke={C.murekkep} strokeWidth="1.5" /><path d="M2 21 h44 l-6 11 h-32 Z" fill={C.murekkep} /></svg>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15, fontWeight: 750 }}><span>{sv.ad}</span><span style={{ color: C.murekkepAlt }}>{sv.sonraki || "Son iskele"}</span></div>
          <div style={{ display: "flex", gap: 24, marginTop: "auto", flexWrap: "wrap" }}>
            {[[baslanan, "kelimeye başladın"], [vadesi, "bugün tekrar"], [oyun.xp, "toplam puan"]].map(([n, ad]) => (
              <div key={ad}><div style={{ fontFamily: T.hat, fontSize: 30, fontWeight: 800, letterSpacing: "-0.02em", ...T.rakam }}>{n}</div><div style={{ fontSize: 14, color: C.murekkepAlt }}>{ad}</div></div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center", margin: "34px 0 8px" }}>
        {[["yazihane", "Atölye: yaz ve konuş"], ["seyir", "Seyir defteri"], ["sandik", "Sandık: yedekle, geri yükle"]].map(([id, ad]) => (
          <button key={id} onClick={() => git(id)} className="nv-baglanti">{ad}</button>
        ))}
      </div>
    </div>
  );
}

/* Kayan gösterge çubuğu: üst menü, alt menü ve alt sekmeler için */
function Kaydirmali({ ogeler, etkin, sec, tur }) {
  const kap = useRef(null), [gos, setGos] = useState(null);
  useLayoutEffect(() => {
    const el = kap.current && kap.current.querySelector(`[data-id="${etkin}"]`);
    if (el) setGos({ x: el.offsetLeft, w: el.offsetWidth, h: el.offsetHeight, y: el.offsetTop });
  }, [etkin, ogeler.length]);
  useEffect(() => { const f = () => { const el = kap.current && kap.current.querySelector(`[data-id="${etkin}"]`); if (el) setGos({ x: el.offsetLeft, w: el.offsetWidth, h: el.offsetHeight, y: el.offsetTop }); }; window.addEventListener("resize", f); return () => window.removeEventListener("resize", f); }, [etkin]);
  return (
    <div ref={kap} className={`nv-kay nv-kay-${tur}`}>
      {gos && <span className="nv-kay-gos" style={{ transform: `translate(${gos.x}px, ${tur === "alt" ? 0 : gos.y}px)`, width: gos.w, height: tur === "alt" ? undefined : gos.h }} />}
      {ogeler.map(({ id, ad, Ikon, rozet }) => (
        <button key={id} data-id={id} onClick={() => sec(id)} className={etkin === id ? "et" : ""} aria-current={etkin === id ? "page" : undefined}>
          {Ikon && <Ikon size={tur === "taban" ? 22 : 18} />}<span>{ad}</span>{rozet ? <i className="nv-rozet">{rozet}</i> : null}
        </button>
      ))}
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
    <div style={{ minHeight: "100vh", background: C.kagit, fontFamily: T.govde, color: C.murekkep, zoom: olcek }}>
      <style>{STIL}</style>
      <Acilis />

      {/* üst çubuk */}
      <header className={`nv-ust ${sekme === "bugun" ? "nv-ust-ana" : ""}`}>
        <div className="nv-ust-ic" style={{ padding: `10px ${dar ? 16 : 28}px` }}>
          <button onClick={() => setSekme("bugun")} aria-label="Ana sayfa" className="nv-logo">
            <svg width="38" height="38" viewBox="0 0 40 40" aria-hidden="true"><rect width="40" height="40" rx="12" fill={C.murekkep} /><path d="M8 26 C 14 20, 18 20, 20 24 S 27 29, 32 22" stroke={C.safran} strokeWidth="3.2" fill="none" strokeLinecap="round" /><path d="M12 15 h16" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" /><circle cx="20" cy="15" r="3.6" fill="#fff" /></svg>
            <span>NAHİV</span>
          </button>
          {!dar && !odakta && <Kaydirmali tur="ust" etkin={grup.id} sec={(id) => setSekme(GRUPLAR.find((g) => g.id === id).sekmeler[0][0])}
            ogeler={GRUPLAR.map((g) => ({ id: g.id, ad: g.ad, Ikon: g.ikon }))} />}
          <span style={{ flex: 1 }} />
          <button onClick={() => setOlcek((o) => (o >= 1.25 ? 0.95 : Math.round((o + 0.1) * 100) / 100))} className="nv-yuvarlak" aria-label="Yazı boyunu değiştir" title={`Yazı boyu %${Math.round(olcek * 100)}`}>
            <span style={{ fontFamily: T.hat, fontWeight: 800, fontSize: 16 }}>Aa</span>
          </button>
          <button id="nv-puan-hedef" onClick={() => setSekme("bugun")} className="nv-puan">
            <Flame size={18} style={{ color: seri > 0 ? "#FF6A3D" : C.golge }} /><b>{seri}</b>
            <span className="nv-puan-ayrac" />
            <span style={{ fontWeight: 800 }}>{oyun.xp}</span><span style={{ color: C.murekkepSis, fontSize: 13.5 }}>puan</span>
            {puanIzi && <span key={puanIzi.k} style={{ position: "absolute", right: 10, top: -8, fontWeight: 800, fontSize: 17, color: C.zumrut, animation: "nvPuan 1.25s ease both", pointerEvents: "none" }}>+{puanIzi.n}</span>}
          </button>
        </div>
        {grup.sekmeler.length > 1 && !odakta && sekme !== "bugun" && (
          <div className="nv-ust-ic" style={{ padding: `0 ${dar ? 16 : 28}px` }}>
            <Kaydirmali tur="alt" etkin={sekme} sec={setSekme} ogeler={grup.sekmeler.filter(([id]) => id !== "bugun").map(([id, ad]) => ({ id, ad, rozet: id === "defter" && kuyruk > 0 ? kuyruk : null }))} />
          </div>
        )}
      </header>

      <main style={{ maxWidth: sekme === "bugun" ? 1240 : genis ? 1180 : 940, margin: "0 auto", padding: `${sekme === "bugun" ? (dar ? 10 : 16) : S.lg}px ${dar ? 12 : S.lg}px ${dar ? 120 : S.xxxl}px` }}>
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
        <nav className="nv-taban">
          <Kaydirmali tur="taban" etkin={grup.id} sec={(id) => setSekme(GRUPLAR.find((g) => g.id === id).sekmeler[0][0])} ogeler={GRUPLAR.map((g) => ({ id: g.id, ad: g.ad, Ikon: g.ikon }))} />
        </nav>
      )}

      {kutlama && (
        <div className="nv-gir" role="status" style={{ position: "fixed", left: 0, right: 0, margin: "0 auto", top: 84, zIndex: 60, background: C.gece, color: "#fff", borderRadius: 22, padding: "16px 24px", boxShadow: "0 24px 44px -18px rgba(11,22,48,.8)", textAlign: "center", width: "min(92vw, 380px)" }}>
          <div style={{ fontSize: 14.5, color: C.safran, fontWeight: 700 }}>Yeni iskeleye yanaştın</div>
          <div style={{ fontFamily: T.hat, fontSize: 30, fontWeight: 800, letterSpacing: "-0.02em" }}>{kutlama.no}. {kutlama.ad}</div>
        </div>
      )}
      {palet && <KomutPaleti kapat={() => setPalet(false)} komutlar={komutlar} />}
    </div>
  );
}
const olcekDugme = { width: 34, height: 34, borderRadius: 99, border: "none", background: "transparent", cursor: "pointer", color: C.murekkepAlt, display: "flex", alignItems: "center", justifyContent: "center" };
