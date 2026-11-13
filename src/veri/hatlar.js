/* Hatlar ve duraklar — beş IB teması, sınav dili ve deyimler.
   Her hat bir vapur hattı gibi çizilir; her durak bir iskele. */

export const HATLAR = [
  { id: "kim", ad: "Kimlikler", en: "Identities", renk: "#E8A200", koyu: "#8A5E00", acik: "#FFF2CC", murekkep: "#3A2A00", no: 1,
    ozet: "Kim olduğumuz: yaşam biçimi, sağlık, inanç, dil ve kişilik.",
    duraklar: [["yas","Yaşam biçimleri"],["sag","Sağlık ve esenlik"],["inn","İnançlar ve değerler"],["alt","Alt kültürler"],["dil","Dil ve kimlik"],["kis","Kişilik ve karakter"],["duy","Duygular"],["bes","Beslenme ve mutfak"],["cin","Toplumsal cinsiyet ve roller"],["gnc","Gençlik ve kuşaklar"],["gor","Görünüş ve giyim"]] },
  { id: "den", ad: "Deneyimler", en: "Experiences", renk: "#0FA35E", koyu: "#0A6E40", acik: "#DCF5E8", murekkep: "#FFFFFF", no: 2,
    ozet: "Yaşadıklarımız: seyahat, gelenek, göç, spor ve anılar.",
    duraklar: [["bos","Boş zaman"],["sey","Tatil ve seyahat"],["oyk","Yaşam öyküleri"],["ger","Geçiş törenleri"],["gel","Gelenek ve görenek"],["goc","Göç"],["spo","Spor ve mücadele"],["fes","Bayram ve kutlamalar"],["mac","Macera ve risk"],["ani","Çocukluk ve anılar"],["ula","Ulaşım ve yolculuk"]] },
  { id: "yar", ad: "İnsan Yaratıcılığı", en: "Human ingenuity", renk: "#E5432F", koyu: "#A52A1B", acik: "#FDE6E2", murekkep: "#FFFFFF", no: 3,
    ozet: "Ürettiklerimiz: sanat, medya, teknoloji ve bilim.",
    duraklar: [["egl","Eğlence"],["san","Sanatsal ifade"],["med","İletişim ve medya"],["tek","Teknoloji"],["bil","Bilimsel yenilik"],["muz","Müzik"],["sin","Sinema ve dizi"],["kit","Edebiyat ve okuma"],["sos","Sosyal medya ve internet"],["yze","Yapay zekâ ve robotlar"],["uza","Uzay ve keşif"],["tip","Tıp ve biyoteknoloji"],["rek","Reklam ve tüketim"],["mim","Mimari ve tasarım"]] },
  { id: "top", ad: "Toplumsal Düzen", en: "Social organization", renk: "#2457E6", koyu: "#173BA3", acik: "#E4ECFF", murekkep: "#FFFFFF", no: 4,
    ozet: "Birlikte yaşama biçimlerimiz: eğitim, iş, hukuk, siyaset, ekonomi.",
    duraklar: [["ili","Toplumsal ilişkiler"],["cem","Topluluk"],["kat","Toplumsal katılım"],["egt","Eğitim"],["cal","Çalışma dünyası"],["huk","Hukuk ve düzen"],["siy","Siyaset ve yönetim"],["eko","Ekonomi ve para"],["suc","Suç ve ceza"],["uni","Üniversite ve akademi"],["kar","Kariyer ve başvuru"],["yok","Yoksulluk ve sosyal sorunlar"],["ail","Aile ve kuşaklar"]] },
  { id: "gez", ad: "Gezegeni Paylaşmak", en: "Sharing the planet", renk: "#0C97A8", koyu: "#076673", acik: "#DAF3F6", murekkep: "#FFFFFF", no: 5,
    ozet: "Ortak dünyamız: çevre, haklar, barış, eşitlik, küreselleşme.",
    duraklar: [["cev","Çevre"],["hak","İnsan hakları"],["bar","Barış ve çatışma"],["esi","Eşitlik"],["kur","Küreselleşme"],["eti","Etik"],["ken","Kent ve kır"],["ikl","İklim ve enerji"],["afe","Doğal afetler"],["hay","Hayvanlar ve yaban hayatı"],["gid","Gıda ve su"],["sav","Savaş ve güvenlik"],["kal","Kalkınma ve yardım"],["ulu","Diplomasi ve kurumlar"],["atk","Atık ve tüketim"]] },
  { id: "snv", ad: "Sınav Dili", en: "Exam language", renk: "#6A3BD6", koyu: "#4722A3", acik: "#EEE8FD", murekkep: "#FFFFFF", no: 6,
    ozet: "Paper 1, Paper 2 ve IO'nun kendi dili: çözümleme, tartışma, akademik çekirdek.",
    duraklar: [["edb","Edebi çözümleme · IO"],["tar","Tartışma kalıpları · IO"],["ton","Ton ve tutum"],["akd","Akademik çekirdek"],["fii","Güçlü fiiller"],["fi2","Güçlü fiiller II"],["sif","Güçlü sıfatlar"],["sf2","Güçlü sıfatlar II"],["zrf","Güçlü zarflar"],["isi","Soyut isimler"],["bet","Betimleme: insan ve mekân"],["bag","Bağlaç ve geçiş"],["ikn","Görüş ve ikna"],["p1m","Mektup ve e-posta kalıpları"],["p1y","Makale, blog, konuşma kalıpları"],["p1r","Rapor ve öneri kalıpları"],["p2s","Paper 2 soru dili"],["gn1","Düşünce ve görüş"],["gn2","Ölçü ve değişim"],["gn3","Zaman ve sıklık"],["gn4","Neden ve koşul"],["gn5","Duygu ve tutum"],["gn6","Sık isimler"]] },
  { id: "dyk", ad: "Deyimler ve Kalıplar", en: "Idioms & phrases", renk: "#C2187A", koyu: "#8A0F56", acik: "#FBE3F1", murekkep: "#FFFFFF", no: 7,
    ozet: "Kriter A'nın en üst bandı deyimlerin yerinde kullanımını ister: deyim, öbek fiil, ikileme, eşdizim.",
    duraklar: [["dy1","Deyim: başarı ve çaba"],["dy2","Deyim: zorluk ve sorun"],["dy3","Deyim: duygu ve ilişki"],["dy4","Deyim: zaman ve değişim"],["dy5","Deyim: para ve iş"],["dy6","Deyim: düşünce ve iletişim"],["dy7","Deyim: tartışma ve siyaset"],["of1","Öbek fiil: akademik"],["of2","Öbek fiil: gündelik"],["of3","Öbek fiil: okul ve iş"],["dey","Öbek fiil ve deyim: karışık"],["iki","İkilemeler ve sabit kalıplar"],["ben","Benzetme ve atasözü"],["esd","Güçlü eşdizimler"]] }
];

export const DURAK_META = {};
HATLAR.forEach((h) => h.duraklar.forEach(([id, ad], i) => {
  DURAK_META[id] = { id, ad, hat: h.id, hatAd: h.ad, renk: h.renk, koyu: h.koyu, acik: h.acik, murekkep: h.murekkep, sira: i + 1, hatNo: h.no };
}));
