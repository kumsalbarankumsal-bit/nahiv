/* Sınav merkezi verisi, 2. bölüm: Paper 2 ve bireysel sözlü (IO).
   Okuma parçaları ve sorular bu uygulama için yazılmış özgün metinlerdir;
   soru tipleri IB Language B Paper 2 okuma bölümünün tiplerini izler. */

export const P2_KUNYE = [
  ["Dinleme", "1 saat, 25 puan, üç ses kaydı"],
  ["Okuma", "1 saat, 40 puan, üç yazılı metin"],
  ["Ağırlık", "Dinleme %25, okuma %25; birlikte notun yarısı"],
  ["Kapsam", "Metinler beş temanın hepsinden gelebilir"],
  ["Yanıt dili", "Sorular ve yanıtlar İngilizce"]
];

export const P2_TIPLER = [
  { ad: "Doğru, yanlış ve gerekçe", en: "True or false with justification",
    nasil: "Önermenin doğru mu yanlış mı olduğunu işaretler, metinden gerekçeni kelimesi kelimesine yazarsın. İkisi birden doğruysa puan alırsın.",
    strateji: ["Önermedeki anahtar sözcüğün metindeki eş anlamlısını ara; soru metni neredeyse hiç aynı sözcükle sormaz.", "Gerekçeyi kısa tut: yalnızca kanıt olan söz öbeği. Fazladan kopyalanan yanlış bilgi puanı götürür.", "Sorular metnin sırasını izler; bir önceki yanıtın altından aramaya devam et.", "always, never, only, all gibi mutlak sözcüklere dikkat: önermeyi çoğu kez bunlar yanlış yapar."] },
  { ad: "Kısa yanıt", en: "Short answer questions",
    nasil: "Metne göre kısa bir yanıt yazarsın. Tam cümle gerekmez.",
    strateji: ["Soru sözcüğü yanıtın türünü söyler: who kişi, why neden, how many sayı ister.", "Metindeki sözcükleri kullan; kendi cümlenle anlatmaya çalışırken hata yapma riskin artar.", "İki şey isteniyorsa (give two reasons) iki ayrı bilgi yaz."] },
  { ad: "Çoktan seçmeli", en: "Multiple choice",
    nasil: "Dört seçenekten metne en uygun olanı seçersin.",
    strateji: ["Önce soruyu kendi kafanda yanıtla, sonra seçeneklere bak.", "Çeldiriciler metinde geçen sözcüklerle kurulur; sözcük aynı diye seçme, anlam aynı mı diye bak.", "İki seçenek arasında kalırsan metindeki cümleyi yeniden oku: biri kısmen doğrudur, öbürü tamamen."] },
  { ad: "Doğru önermeleri seç", en: "Choose the true statements",
    nasil: "Bir listeden belirtilen sayıda doğru önermeyi seçersin.",
    strateji: ["İstenen sayıdan fazla işaretleme; fazlası puan kaybettirir.", "Her önermeyi metinde bir cümleyle eşleştir; eşleşmeyen yanlıştır.", "Metinde hiç geçmeyen bilgi, mantıklı görünse bile doğru sayılmaz."] },
  { ad: "Sözcük ve ifade bulma", en: "Find the word or phrase",
    nasil: "Verilen anlama gelen sözcüğü belirtilen paragrafta bulursun ya da bir sözcüğün eş anlamlısını listeden seçersin.",
    strateji: ["Sözcüğün türüne bak: fiil isteniyorsa fiil, sıfat isteniyorsa sıfat ara.", "Sözcüğü cümlede yerine koy; cümle hâlâ anlamlıysa doğru yoldasın.", "Sözcüğü metindeki biçimiyle yaz: çekim ekini değiştirme."] },
  { ad: "Gönderim", en: "Reference questions",
    nasil: "it, they, this, which gibi bir sözcüğün metinde neyi gösterdiğini yazarsın.",
    strateji: ["Yanıt hemen hemen her zaman sözcükten önceki cümlededir.", "Tekil mi çoğul mu olduğuna bak: they çoğul bir isim arar.", "Bulduğun ismi zamirin yerine koyup cümleyi oku."] },
  { ad: "Eşleştirme ve boşluk doldurma", en: "Matching and gap-filling",
    nasil: "Başlıkları paragraflarla, cümle başlarını sonlarıyla eşleştirir ya da boşluklara listedeki sözcükleri yerleştirirsin.",
    strateji: ["Listede fazladan seçenek bulunur; hepsini kullanmaya çalışma.", "Boşluktan sonraki sözcüğe bak: edat, artikel ve çekim doğru sözcüğü ele verir.", "Başlık eşleştirmede paragrafın ilk ve son cümlesini oku; ana fikir çoğu kez oradadır."] }
];

export const P2_DINLEME = [
  "Ses kaydı başlamadan verilen sürede soruları oku ve anahtar sözcüklerin altını çiz; neyi dinleyeceğini bilmeden dinleme.",
  "Her kayıt iki kez çalınır. İlk dinlemede emin olduklarını yaz, ikincisinde boşları tamamla ve denetle.",
  "Sorular kaydın sırasını izler. Bir yanıtı kaçırdıysan takılma, bir sonrakine geç.",
  "Konuşmacılar çoğu kez fikir değiştirir: actually, but, in the end sözcüklerinden sonra gelen bilgi asıl yanıttır.",
  "Sayı, tarih ve özel adları duyduğun anda not et; sonradan hatırlanmazlar.",
  "Üç kayıt giderek zorlaşır. İlk kayıtta kaybedilen puan en pahalısıdır."
];

/* tip: mc | tf | kelime */
export const P2_METINLER = [
  { id: "p2a", tema: "kim", baslik: "Two Languages, One Kitchen", tur: "Blog",
    par: [
      "When my grandmother talks to me, she starts her sentences in Turkish and finishes them in German. She has lived in Cologne for forty-three years, and somewhere along the way the two languages stopped being separate rooms in her mind and became one large kitchen where everything is within reach.",
      "As a child I found this embarrassing. My classmates' grandparents spoke one language, properly, and I used to wish that mine would do the same. I even corrected her in front of guests, which she tolerated with more patience than I deserved.",
      "It was a linguistics lecture, of all things, that changed my mind. The professor explained that switching between languages in the middle of a sentence is not a sign of confusion but of skill: speakers do it only where the grammar of both languages allows it, and they hardly ever make mistakes. What I had taken for laziness turned out to be a kind of expertise.",
      "Since then I have started to listen differently. I have noticed that she chooses German for anything to do with offices, forms and appointments, and Turkish for food, family and feelings. Her languages are a map of her life: each word shows where she was when she first needed it.",
      "I no longer correct her. Last month I caught myself doing exactly what she does, and for the first time it did not feel like a failure. It felt like belonging to two places at once."
    ],
    sorular: [
      { tip: "mc", s: "In paragraph 1, the “kitchen” is an image for…", o: ["the place where the family meets.", "the way two languages work together in her mind.", "the grandmother's favourite room in Cologne.", "the difficulty of learning German."], c: 1 },
      { tip: "tf", s: "As a child, the writer was proud of the way the grandmother spoke.", c: false, g: ["As a child I found this embarrassing", "she tolerated with more patience", "My classmates' grandparents spoke one language"], gc: 0 },
      { tip: "kelime", s: "Find the word in paragraph 2 which means “accepted without complaining”.", c: "tolerated" },
      { tip: "mc", s: "According to the professor, people who mix languages in one sentence…", o: ["have not learned either language well.", "are usually tired or confused.", "follow rules and rarely make errors.", "do it to impress other people."], c: 2 },
      { tip: "tf", s: "The writer had believed that the grandmother mixed languages because she was lazy.", c: true, g: ["It was a linguistics lecture, of all things", "What I had taken for laziness", "speakers do it only where the grammar"], gc: 1 },
      { tip: "mc", s: "The grandmother uses German mainly for…", o: ["family matters.", "cooking.", "official matters.", "expressing emotions."], c: 2 },
      { tip: "mc", s: "In paragraph 4, “it” in “when she first needed it” refers to…", o: ["her life", "a map", "each word", "Germany"], c: 2 },
      { tip: "mc", s: "The writer's attitude at the end of the text is best described as…", o: ["accepting and proud.", "embarrassed.", "indifferent.", "critical of the grandmother."], c: 0 }
    ] },

  { id: "p2b", tema: "den", baslik: "The Last Ferry Seller", tur: "Makale",
    par: [
      "Every morning at ten past six, before the first commuters arrive, Hasan Usta lights a small gas ring on the lower deck of the Kadıköy ferry and begins to brew tea. He has done this for thirty-one years. In that time the boats have been repainted, the tickets have turned into plastic cards, and the price of a glass of tea has risen more times than he can remember, yet the ritual itself has not changed.",
      "What has changed is the passengers. “People used to talk,” he says, carrying a tray of tulip-shaped glasses between the benches without spilling a drop. “Now everyone crosses the Bosphorus looking at a screen. They do not even see the seagulls.” He does not say this bitterly. He simply states it as a fact, the way one might mention the weather.",
      "The company that runs the ferries has considered replacing sellers like him with vending machines, which would be cheaper and never need a day off. A petition against the plan gathered eleven thousand signatures in a week. Many of those who signed admitted that they rarely buy tea on board; they just could not imagine the crossing without the sound of a spoon against glass.",
      "Hasan Usta is amused by this sudden affection. He will retire in two years, he says, and nobody has asked to learn the job. Tourists photograph him, students write articles about him, but no one wants to wake up at five.",
      "When the ferry reaches the European shore, he collects the empty glasses and looks, briefly, at the skyline. Twenty minutes later he will cross again."
    ],
    sorular: [
      { tip: "tf", s: "Hasan Usta's morning routine is different from what it was thirty years ago.", c: false, g: ["the boats have been repainted", "the ritual itself has not changed", "the price of a glass of tea has risen"], gc: 1 },
      { tip: "mc", s: "According to Hasan Usta, today's passengers…", o: ["drink more tea than before.", "talk too loudly.", "pay little attention to what is around them.", "complain about the seagulls."], c: 2 },
      { tip: "kelime", s: "Find the word in paragraph 2 which means “with anger and disappointment”.", c: "bitterly" },
      { tip: "mc", s: "The company thought about using vending machines because they…", o: ["make better tea.", "cost less and are always available.", "are popular with tourists.", "were requested by passengers."], c: 1 },
      { tip: "tf", s: "Most people who signed the petition are regular customers of the tea sellers.", c: false, g: ["A petition against the plan gathered eleven thousand signatures", "admitted that they rarely buy tea on board", "the sound of a spoon against glass"], gc: 1 },
      { tip: "mc", s: "In paragraph 4, “this sudden affection” refers to…", o: ["the tourists' photographs.", "the company's plan.", "the public support shown by the petition.", "his love of the job."], c: 2 },
      { tip: "mc", s: "What does the writer suggest about the future of the job?", o: ["Machines will certainly replace it.", "Young people are queuing to do it.", "It may disappear because nobody wants to do it.", "The company will train new sellers."], c: 2 },
      { tip: "kelime", s: "Find the word in paragraph 5 which means “for a short time”.", c: "briefly" }
    ] },

  { id: "p2c", tema: "yar", baslik: "The Homework Machine", tur: "Köşe yazısı",
    par: [
      "Last term a colleague of mine received thirty essays on the causes of the First World War. Twenty-two of them shared the same three arguments, in the same order, in the same polite and lifeless prose. No student had copied another. They had all asked the same machine.",
      "The usual response to this story is panic, followed by a demand for software that can detect artificial writing. I understand the impulse, but I think it is mistaken. Detection tools are unreliable, and a school that treats every pupil as a suspect teaches a lesson far worse than any essay could.",
      "The more interesting question is why the machine's essays were so easy to recognise. They were correct, balanced and entirely forgettable. They took no risks. In other words, they looked exactly like the essays we have been rewarding for years: five paragraphs, three points, a conclusion that repeats the introduction. We built the mould; we should not be surprised that a machine can fill it.",
      "If that is so, the problem is not the technology but the task. An essay that asks a pupil to compare a textbook's account of 1914 with the letters of her own great-grandfather cannot be written by a program, because the program has never met him. Nor can a machine defend an argument aloud, in front of classmates who disagree.",
      "Such tasks take longer to set and far longer to mark. That is the real obstacle, and it has nothing to do with computers. The machine has not ruined homework. It has merely shown us which homework was not worth doing."
    ],
    sorular: [
      { tip: "mc", s: "Why were twenty-two essays so similar?", o: ["The students had copied from each other.", "The teacher had given them a model.", "The students had all used the same AI tool.", "The topic allowed only one answer."], c: 2 },
      { tip: "kelime", s: "Find the word in paragraph 1 which means “without energy or interest”.", c: "lifeless" },
      { tip: "tf", s: "The writer supports the use of software to detect artificial writing.", c: false, g: ["I understand the impulse, but I think it is mistaken", "The usual response to this story is panic", "a demand for software"], gc: 0 },
      { tip: "mc", s: "According to paragraph 3, the machine's essays were easy to recognise because they…", o: ["contained many factual errors.", "were safe and unoriginal.", "were too long.", "used difficult vocabulary."], c: 1 },
      { tip: "mc", s: "“We built the mould” (paragraph 3) means that teachers…", o: ["invented the technology.", "created the predictable essay format.", "wrote the essays themselves.", "punished creative students."], c: 1 },
      { tip: "tf", s: "The writer believes some tasks cannot be completed by a program.", c: true, g: ["cannot be written by a program, because the program has never met him", "Such tasks take longer to set", "the problem is not the technology"], gc: 0 },
      { tip: "mc", s: "What does the writer consider “the real obstacle”?", o: ["The cost of computers.", "Students' dishonesty.", "The extra time better tasks demand from teachers.", "Parents' attitudes."], c: 2 },
      { tip: "mc", s: "The tone of the final paragraph is…", o: ["alarmed.", "calm and provocative.", "nostalgic.", "apologetic."], c: 1 }
    ] },

  { id: "p2d", tema: "top", baslik: "Four Days, Full Pay", tur: "Haber raporu",
    par: [
      "A medium-sized software company in Izmir has announced that it will keep its four-day working week permanently, after a twelve-month trial which its managers describe as “better than we dared to hope”.",
      "Under the scheme, the firm's 140 employees work from Monday to Thursday and receive the same salary as before. According to figures released by the company on Tuesday, the number of projects completed on time rose by eight per cent during the trial, while days lost to illness fell by almost a third.",
      "Not everything went smoothly. In the first three months several teams struggled to finish their work in four days and stayed late in the evenings, which defeated the purpose of the experiment. The problem was solved, managers say, only when the company halved the number of meetings and banned them altogether on Thursdays.",
      "Staff reactions have been largely positive. “I thought I would use the extra day to rest,” said Selin Arı, a designer who has worked at the company for six years. “Instead I started a pottery course, and I come back on Monday with more ideas than I ever had.” A minority of employees, however, reported that the shorter week made their working days more intense.",
      "Economists are cautious about drawing wider conclusions. Dr Mert Aksoy of Ege University points out that the model suits office work better than hospitals or factories, where a task cannot simply be done faster. “It is an encouraging result,” he says, “but one company is not an economy.”"
    ],
    sorular: [
      { tip: "tf", s: "The company has decided to end the four-day week after the trial.", c: false, g: ["it will keep its four-day working week permanently", "after a twelve-month trial", "better than we dared to hope"], gc: 0 },
      { tip: "mc", s: "During the trial, employees…", o: ["earned less money.", "were paid the same as before.", "worked on Fridays from home.", "received a bonus."], c: 1 },
      { tip: "mc", s: "Which change was observed during the trial?", o: ["More projects were finished on schedule.", "More staff were ill.", "Fewer projects were started.", "Staff numbers fell by a third."], c: 0 },
      { tip: "kelime", s: "Find the word in paragraph 3 which means “had difficulty”.", c: "struggled" },
      { tip: "mc", s: "How did the company solve the problem of staff staying late?", o: ["By employing more people.", "By reducing the number of meetings.", "By extending the trial.", "By paying overtime."], c: 1 },
      { tip: "tf", s: "Selin Arı spends her free day resting, as she had planned.", c: false, g: ["I thought I would use the extra day to rest", "Instead I started a pottery course", "I come back on Monday with more ideas"], gc: 1 },
      { tip: "mc", s: "Some employees felt that their working days…", o: ["had become more demanding.", "were too short.", "were boring.", "included too many meetings."], c: 0 },
      { tip: "mc", s: "Dr Aksoy's comment suggests that…", o: ["the trial was a failure.", "every sector should adopt the model immediately.", "the result is promising but cannot be generalised.", "hospitals have already tried the model."], c: 2 }
    ] },

  { id: "p2e", tema: "gez", baslik: "The Village That Sold Its Rain", tur: "Makale",
    par: [
      "From a distance, Yeşilköy looks like any other village on the Anatolian plateau: stone houses, a mosque, a tea house with plastic chairs. Only when you come closer do you notice that every roof ends in a wide metal gutter, and that every gutter leads to a tank.",
      "Ten years ago the village was dying. The wells had been dug deeper and deeper until the water came up salty, and one family after another left for the city. It was a retired teacher, Ayşe Korkmaz, who proposed something that most of her neighbours considered a joke: instead of chasing water underground, they should catch it as it fell.",
      "The first tank was paid for with the money from her own pension. When her vegetable garden survived a summer that killed everyone else's, the jokes stopped. Within three years the village had built forty tanks, and today it stores enough rain to last through a dry season of five months.",
      "What makes the story unusual is what happened next. Yeşilköy now collects more water than it needs, and it sells the surplus to two neighbouring villages at a price fixed by a committee in which every household has one vote. The income pays for the maintenance of the tanks and for a school bus.",
      "Experts warn that the model depends on a rainfall which is becoming less predictable every year. Mrs Korkmaz does not disagree. “We have not solved the problem,” she says. “We have bought ourselves time. What matters is what we do with it.”"
    ],
    sorular: [
      { tip: "mc", s: "What makes Yeşilköy look different from other villages when you come closer?", o: ["Its stone houses.", "Its equipment for collecting rainwater.", "Its large mosque.", "Its plastic chairs."], c: 1 },
      { tip: "tf", s: "Ten years ago, people were leaving the village because the well water had become undrinkable.", c: true, g: ["the water came up salty, and one family after another left for the city", "The wells had been dug deeper", "Ten years ago the village was dying"], gc: 0 },
      { tip: "mc", s: "How did most neighbours first react to Ayşe Korkmaz's idea?", o: ["They supported it immediately.", "They did not take it seriously.", "They were angry.", "They asked the government for help."], c: 1 },
      { tip: "mc", s: "“The jokes stopped” (paragraph 3) because…", o: ["her garden survived a very dry summer.", "she left the village.", "the government paid for the tanks.", "the wells were repaired."], c: 0 },
      { tip: "kelime", s: "Find the word in paragraph 4 which means “an amount that is more than is needed”.", c: "surplus" },
      { tip: "mc", s: "How is the price of the water decided?", o: ["By Mrs Korkmaz alone.", "By the neighbouring villages.", "By a committee in which each household votes.", "By the national government."], c: 2 },
      { tip: "tf", s: "Mrs Korkmaz believes the village's water problem has been solved for good.", c: false, g: ["We have not solved the problem", "Experts warn that the model depends on a rainfall", "The income pays for the maintenance"], gc: 0 },
      { tip: "mc", s: "The purpose of the text is mainly to…", o: ["advertise a product.", "describe a community's solution and its limits.", "criticise people who move to cities.", "explain how to build a water tank."], c: 1 }
    ] }
];

/* ─── Bireysel sözlü (IO), HL ─────────────────────────────────────── */

export const IO_KUNYE = [
  ["Uyaran", "Derste okunan iki edebî eserden alınmış, yaklaşık 300 sözcüklük bir parça"],
  ["Seçim", "Öğretmen her eserden birer parça gösterir, sen birini seçersin"],
  ["Hazırlık", "20 dakika, gözetim altında; en çok 10 maddelik kısa not"],
  ["Süre", "12 ile 15 dakika, kayda alınır"],
  ["Puan ve ağırlık", "30 puan, notun %25'i; öğretmen puanlar, IB denetler"]
];

export const IO_BOLUMLER = [
  { ad: "1. Sunum", dk: "3–4 dakika", sn: 240, ne: "Parçayı sunarsın: eserdeki yerini, olayları, kişileri, fikirleri ve bunlar hakkındaki kendi görüşünü. Kimse sözünü kesmez.", dikkat: "Notlarını okuma; yalnızca bakış at. Parçadan en az üç kez doğrudan söz et (in line 5, the narrator says…). Parçadan kopuk genel bir kitap özeti puan getirmez." },
  { ad: "2. Parça üzerine sorular", dk: "4–5 dakika", sn: 300, ne: "Öğretmen sunumundaki noktaları açmanı, parça ve eser hakkındaki görüşlerini savunmanı ister.", dikkat: "Yanıtlarını gerekçelendir ve örnekle. Bilmediğin soruda susma: düşünmek için zaman kazandıran bir kalıp kullan, sonra bir görüş söyle." },
  { ad: "3. Genel sohbet", dk: "5–6 dakika", sn: 360, ne: "Konuşma, programın beş temasından bir ya da birkaçına geçer. Artık kitap değil, dünya ve senin görüşlerin konuşulur.", dikkat: "Tek cümlelik yanıt verme. Görüş, gerekçe, örnek, karşı görüş sırasını kullan. Kendi ülkenle İngilizce konuşulan kültürler arasında karşılaştırma yapmak yanıtı zenginleştirir." }
];

export const IO_OLCUT = [
  { kod: "A", ad: "Dil", puan: 12, ust: "Sözcükler göreve uygun, çeşitli ve incelikli; deyimsel ifadeler etkili. Çeşitli yapılar etkili kullanılıyor. Dil çoğunlukla doğru; telaffuz ve tonlama anlaşılmayı kolaylaştırıyor.",
    ipucu: ["Edebi çözümleme ve Tartışma kalıpları duraklarını ustalaştır.", "Aynı fiili yineleme: shows yerine reveals, suggests, highlights, conveys.", "Yavaş ve net konuş; hız puan getirmez, anlaşılırlık getirir."] },
  { kod: "B1", ad: "Mesaj: edebî parça", puan: 6, ust: "Sunum baştan sona parçayla ilgili ve ikna edici. Parça etkili kullanılıyor; gözlem ve görüşler geliştirilmiş ve parçaya gönderme yapılarak desteklenmiş.",
    ipucu: ["Her görüşü parçadaki bir satıra bağla.", "Yalnızca ne olduğunu anlatma; ne anlama geldiğini ve senin ne düşündüğünü söyle.", "Parçanın eserin bütünündeki yerini bir iki cümleyle kur, sonra parçaya dön."] },
  { kod: "B2", ad: "Mesaj: sohbet", puan: 6, ust: "Yanıtlar sorularla tutarlı biçimde ilgili ve belli bir derinlik gösteriyor. Yanıtlar geniş kapsamlı ve geliştirilmiş.",
    ipucu: ["Her yanıtı en az üç dört cümleye çıkar.", "Kişisel deneyimden genel bir düşünceye geç.", "Soruyu anlamadıysan açıklama iste; yanlış soruya uzun yanıt puan kaybettirir."] },
  { kod: "C", ad: "Etkileşim: iletişim", puan: 6, ust: "Anlama baştan sona sağlam; etkileşim sürekli. Katılım bağımsız; öğrenci sohbete kendiliğinden katkı yapıyor.",
    ipucu: ["Öğretmenin sorusunu bekleme; yanıtının sonunda yeni bir düşünce aç.", "Karşı görüşü kibarca tart: I take your point, but…", "Göz teması ve doğal tepkiler de etkileşimin parçasıdır."] }
];

export const IO_ISKELET = [
  { ad: "Açılış", sure: "20 sn", kalip: ["The extract I have chosen is taken from … by …", "It comes from the (opening / middle / final) part of the novel, just after …"] },
  { ad: "Parçanın yeri", sure: "30 sn", kalip: ["At this point in the story, …", "This moment is significant because it marks …"] },
  { ad: "Ne oluyor", sure: "40 sn", kalip: ["In this passage, the narrator describes …", "What happens, in brief, is that …"] },
  { ad: "Kişiler ve ilişkiler", sure: "45 sn", kalip: ["The character of … comes across as …", "The line “…” reveals that …", "There is a clear tension between … and …"] },
  { ad: "Fikir ve tema", sure: "50 sn", kalip: ["The extract raises the question of …", "This connects to one of the central themes of the work, namely …", "The image of … suggests that …"] },
  { ad: "Benim görüşüm", sure: "40 sn", kalip: ["Personally, I find this passage … because …", "What strikes me most is …", "I cannot entirely sympathise with …, since …"] },
  { ad: "Kapanış", sure: "15 sn", kalip: ["To sum up, this extract captures … in a few lines.", "That is why I consider it one of the key moments of the work."] }
];

export const IO_ZAMAN_KALIP = ["That is an interesting question; let me think for a moment.", "I had not considered that before, but I would say…", "If I understood correctly, you are asking whether…", "Could you rephrase that, please?", "I take your point, but I see it slightly differently.", "To give you a concrete example, …", "Coming back to the extract, …", "It depends on what we mean by…"];

export const IO_PARCA_SORU = [
  "Why did you choose this extract rather than the other one?", "How typical is this passage of the work as a whole?", "Which character in the extract do you sympathise with most, and why?",
  "How does the relationship between the characters change after this moment?", "What do we learn about the narrator from the way this scene is told?", "Is there a line in the extract that you find especially powerful? Why?",
  "How does the setting contribute to the atmosphere of the passage?", "What do you think the author wants the reader to feel at this point?", "Did your opinion of the main character change while you were reading the book?",
  "Would the story work in a different country or period? Why, or why not?", "How does this extract connect to the title of the work?", "If you could ask the author one question about this scene, what would it be?",
  "Do you find the ending of the work convincing?", "Which theme of the work do you consider most relevant to people of your age?", "Would you recommend this book to a friend? What would you tell them?",
  "How does the language of the extract reflect the character's state of mind?", "What is left unsaid in this passage?", "How would you have reacted in the character's position?"
];

export const IO_TEMA_SORU = {
  kim: ["To what extent does the language we speak shape who we are?", "Is it possible to belong to two cultures at the same time?", "How far do social media change the way young people see themselves?", "Should schools teach students how to look after their mental health?", "Are today's teenagers under more pressure than their parents were?", "What does a person's lifestyle reveal about their values?", "Why do subcultures matter to young people?", "Is physical appearance too important in modern society?", "How have your own beliefs changed in the last few years?", "Do traditions limit individual identity or strengthen it?"],
  den: ["What can travel teach us that school cannot?", "Why do people leave their own country, and what do they lose and gain?", "Which experience in your life has changed you most?", "Are traditional festivals still relevant to young people?", "Is taking risks a necessary part of growing up?", "How should a host country help newcomers to settle?", "Do we remember our childhood accurately?", "Has tourism done more harm than good to the places it touches?", "What makes a rite of passage meaningful?", "Why do sports events create such strong emotions?"],
  yar: ["Will artificial intelligence make learning languages unnecessary?", "Is there any difference between art made by a person and art made by a machine?", "How has technology changed the way you communicate with your friends?", "Can we still trust what we see in the media?", "Should scientists be free to research anything they wish?", "Does entertainment have a duty to educate?", "Why do people still read novels in the age of streaming?", "Is advertising to children acceptable?", "Which invention of the last fifty years has changed daily life the most?", "Do social media bring people together or drive them apart?"],
  top: ["What is the main purpose of education: knowledge, skills or character?", "Should voting be compulsory?", "How will the world of work be different when you are forty?", "Is the law always just?", "What makes a good leader?", "Should university education be free?", "How can communities reduce youth crime?", "Is it the state's duty to reduce the gap between rich and poor?", "Do exams measure what really matters?", "What responsibilities do citizens have towards their community?"],
  gez: ["Who should take the lead on climate change: individuals, companies or governments?", "Can economic growth and environmental protection go together?", "Are human rights truly universal?", "Is globalisation making cultures more alike?", "What can ordinary people do to promote peace?", "Should wealthy countries accept more refugees?", "Is it ethical to eat meat?", "How will cities have to change in the next thirty years?", "Does international aid help or create dependence?", "What would real equality between men and women look like?"]
};
