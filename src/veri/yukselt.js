/* Yükselt: sade sözcük → sınavda puan getiren karşılıkları.
   Biçim: sade | tür | Türkçe | güçlü1, güçlü2, … | örnek cümle ([sade] köşeli parantezde) | not */
const HAM = `
very important|adj|çok önemli|crucial, vital, essential, paramount|Sleep is [very important] for memory.|
very big|adj|çok büyük|enormous, immense, vast, colossal|The stadium is [very big].|
very small|adj|çok küçük|tiny, minute, negligible|The difference is [very small].|negligible: önemsenmeyecek kadar küçük
very good|adj|çok iyi|excellent, outstanding, superb, exceptional|Her presentation was [very good].|
very bad|adj|çok kötü|dreadful, appalling, dire, atrocious|The conditions in the camp were [very bad].|
very tired|adj|çok yorgun|exhausted, drained, worn out|After the match the players were [very tired].|
very angry|adj|çok kızgın|furious, outraged, livid|Fans were [very angry] about the decision.|
very happy|adj|çok mutlu|delighted, thrilled, overjoyed|She was [very happy] with her result.|
very sad|adj|çok üzgün|heartbroken, devastated, miserable|He was [very sad] when the club was relegated.|
very scared|adj|çok korkmuş|terrified, petrified, horrified|The children were [very scared] during the storm.|
very interesting|adj|çok ilginç|fascinating, captivating, compelling|The documentary was [very interesting].|
very boring|adj|çok sıkıcı|tedious, dull, monotonous|The second half of the film was [very boring].|
very difficult|adj|çok zor|demanding, challenging, arduous, daunting|The final paper was [very difficult].|
very easy|adj|çok kolay|effortless, straightforward, simple|The first task was [very easy].|
very beautiful|adj|çok güzel|stunning, breathtaking, magnificent|The view from the hill was [very beautiful].|
very ugly|adj|çok çirkin|hideous, unsightly, grotesque|The new car park is [very ugly].|
very old|adj|çok eski|ancient, antique, age-old|The city walls are [very old].|
very new|adj|çok yeni|brand-new, cutting-edge, state-of-the-art|The lab has [very new] equipment.|
very clean|adj|çok temiz|spotless, immaculate, pristine|The hostel was [very clean].|
very dirty|adj|çok kirli|filthy, squalid, grimy|The river is [very dirty].|
very cold|adj|çok soğuk|freezing, bitter, icy|It was [very cold] on the terraces.|
very hot|adj|çok sıcak|scorching, boiling, sweltering|July was [very hot] this year.|
very hungry|adj|çok aç|starving, famished, ravenous|We were [very hungry] after the hike.|
very funny|adj|çok komik|hilarious, witty, side-splitting|The speech was [very funny].|
very clever|adj|çok zeki|brilliant, ingenious, sharp|It was a [very clever] solution.|
very stupid|adj|çok aptalca|absurd, ridiculous, senseless|It was a [very stupid] decision.|
very rich|adj|çok zengin|wealthy, affluent, prosperous|The suburb is [very rich].|
very poor|adj|çok yoksul|destitute, impoverished, deprived|The region is [very poor].|
very crowded|adj|çok kalabalık|packed, congested, teeming|The ferry was [very crowded].|
very quiet|adj|çok sessiz|silent, tranquil, hushed|The library was [very quiet].|
very loud|adj|çok gürültülü|deafening, thunderous, ear-splitting|The crowd was [very loud].|
very fast|adj|çok hızlı|rapid, swift, lightning-fast|The response was [very fast].|
very slow|adj|çok yavaş|sluggish, gradual, leisurely|Progress has been [very slow].|
very sure|adj|çok emin|certain, convinced, positive|I am [very sure] that the plan will work.|
very clear|adj|çok açık|obvious, evident, unmistakable|The message is [very clear].|
very strange|adj|çok tuhaf|bizarre, peculiar, odd|The ending was [very strange].|
very dangerous|adj|çok tehlikeli|hazardous, perilous, treacherous|The road is [very dangerous] in winter.|
very serious|adj|çok ciddi|grave, severe, acute|The shortage is [very serious].|
very careful|adj|çok dikkatli|meticulous, cautious, thorough|She is [very careful] with sources.|
very strong|adj|çok güçlü|powerful, robust, formidable|The team has a [very strong] defence.|
very weak|adj|çok zayıf|feeble, fragile, frail|The evidence is [very weak].|
very different|adj|çok farklı|distinct, contrasting, dissimilar|The two cultures are [very different].|
very similar|adj|çok benzer|alike, comparable, almost identical|The two proposals are [very similar].|
very common|adj|çok yaygın|widespread, prevalent, commonplace|The problem is [very common] in big cities.|
very rare|adj|çok nadir|scarce, uncommon, exceptional|Such honesty is [very rare].|
very surprised|adj|çok şaşırmış|astonished, stunned, amazed|I was [very surprised] by the verdict.|
very worried|adj|çok endişeli|anxious, alarmed, distressed|Parents are [very worried] about screens.|
very kind|adj|çok nazik|generous, considerate, compassionate|The host family was [very kind].|
very famous|adj|çok ünlü|renowned, celebrated, prominent|He is a [very famous] architect.|
very expensive|adj|çok pahalı|costly, exorbitant, overpriced|Tickets were [very expensive].|
very cheap|adj|çok ucuz|affordable, inexpensive, budget|The hostel was [very cheap].|
good|adj|iyi|beneficial, valuable, worthwhile, favourable|Volunteering is [good] for students.|
bad|adj|kötü|harmful, detrimental, damaging, adverse|Too much sugar is [bad] for children.|
big|adj|büyük|substantial, significant, considerable, major|There was a [big] rise in prices.|
small|adj|küçük|minor, slight, modest, marginal|There was a [small] fall in demand.|
important|adj|önemli|significant, pivotal, key, essential|Trust is an [important] factor.|
interesting|adj|ilginç|intriguing, thought-provoking, engaging|The article raises an [interesting] question.|
nice|adj|hoş|pleasant, delightful, charming|We spent a [nice] evening by the sea.|
hard|adj|zor|challenging, demanding, tough, gruelling|It was a [hard] season for the club.|
many|adj|birçok|numerous, countless, a wide range of|There are [many] reasons for the decline.|
enough|adj|yeterli|sufficient, adequate, ample|There is not [enough] evidence.|
new|adj|yeni|novel, innovative, fresh, recent|The team tried a [new] approach.|
old-fashioned|adj|eski moda|outdated, obsolete, antiquated|The syllabus is [old-fashioned].|
sad|adj|üzücü|distressing, tragic, heartbreaking|It was a [sad] end to a great career.|
clear|adj|açık|evident, apparent, obvious|It is [clear] that the plan failed.|
main|adj|ana|principal, primary, chief, key|The [main] cause was poor planning.|
whole|adj|bütün|entire, complete, overall|The [whole] system needs reform.|
real|adj|gerçek|genuine, authentic, actual|The film shows [real] emotion.|
wrong|adj|yanlış|mistaken, inaccurate, flawed, misguided|The assumption is [wrong].|
right|adj|doğru|accurate, appropriate, justified, valid|The court made the [right] decision.|
say|v|söylemek|state, claim, argue, assert, maintain|Critics [say] that the law is unfair.|
think|v|düşünmek|believe, consider, maintain, reckon|Many experts [think] that prices will rise.|
show|v|göstermek|demonstrate, illustrate, reveal, indicate|The figures [show] a clear trend.|
get|v|elde etmek|obtain, acquire, gain, receive|Students [get] valuable experience.|
give|v|vermek|provide, offer, grant, supply|The scheme will [give] support to families.|
help|v|yardım etmek|assist, support, aid, facilitate|Volunteers [help] elderly residents.|
make|v|yapmak, üretmek|create, produce, generate, manufacture|Factories [make] too much waste.|
use|v|kullanmak|utilise, employ, apply, exploit|Farmers [use] new methods.|
need|v|gerekmek|require, demand, call for|The plan will [need] more funding.|
start|v|başlamak|begin, commence, launch, initiate|The council will [start] a new campaign.|
stop|v|durdurmak|halt, cease, prevent, put an end to|The law aims to [stop] illegal dumping.|
change|v|değiştirmek|alter, transform, modify, reshape|Technology will [change] education.|
grow|v|büyümek|increase, expand, rise, soar|Demand continues to [grow].|
fall|v|düşmek|decline, decrease, drop, plummet|Sales began to [fall] in March.|
cause|v|neden olmak|lead to, trigger, bring about, give rise to|Pollution can [cause] serious illness.|
solve|v|çözmek|resolve, tackle, address, overcome|We must [solve] the housing problem.|
improve|v|iyileştirmek|enhance, boost, strengthen, upgrade|Sport can [improve] mental health.|
make worse|v|kötüleştirmek|worsen, aggravate, exacerbate, deepen|Delay will only [make worse] the crisis.|exacerbate: C1 ve üstü yazıda çok değerli
talk about|v|hakkında konuşmak|discuss, address, examine, explore|The article will [talk about] urban poverty.|
look at|v|bakmak, incelemek|examine, consider, analyse, investigate|This report will [look at] three options.|
find out|v|öğrenmek|discover, establish, determine, ascertain|Researchers tried to [find out] the cause.|
agree|v|katılmak|concur, share the view, go along with|Most teachers [agree] with the proposal.|
disagree|v|katılmamak|object, dispute, take issue with|Some parents [disagree] with the plan.|
want|v|istemek|wish, seek, aim, aspire|Young people [want] more independence.|
try|v|denemek|attempt, strive, endeavour, seek|Schools [try] to reduce stress.|
buy|v|satın almak|purchase, acquire, invest in|The school will [buy] new laptops.|
tell|v|anlatmak, bildirmek|inform, notify, explain, reveal|Please [tell] the staff about any changes.|
ask for|v|istemek|request, demand, appeal for, call for|Residents [ask for] better lighting.|
deal with|v|ele almak|handle, tackle, address, cope with|Teachers must [deal with] large classes.|
go up|v|artmak|rise, increase, climb, surge|Rents continue to [go up].|
go down|v|azalmak|fall, decline, decrease, dip|Crime rates continue to [go down].|
a lot of|det|çok|a great deal of, numerous, plenty of, a wealth of|The project needs [a lot of] time.|
a problem|n|sorun|an issue, a challenge, a difficulty, an obstacle|Traffic is [a problem] in every large city.|
an idea|n|fikir|a concept, a notion, a proposal, a suggestion|It was [an idea] that changed the school.|
people|n|insanlar|individuals, citizens, the public, members of society|[People] should have a say in local decisions.|
things|n|şeyler|aspects, factors, issues, elements|Several [things] explain the decline.|
a chance|n|fırsat|an opportunity, a prospect, a possibility|The exchange is [a chance] to see another culture.|
a result|n|sonuç|an outcome, a consequence, an effect|Burnout is [a result] of constant pressure.|
a reason|n|neden|a cause, a factor, a motive, grounds|Cost is [a reason] for the delay.|
a job|n|iş|a position, a post, an occupation, a career|She found [a job] in a publishing house.|
but|bag|ama|however, yet, nevertheless, on the other hand|The plan is cheap, [but] it is risky.|however cümle başında ve virgülle kullanılır
so|bag|bu yüzden|therefore, consequently, as a result, hence|Funding was cut, [so] the club closed.|
also|bag|ayrıca|moreover, furthermore, in addition, what is more|The scheme is cheap. It is [also] popular.|
because|bag|çünkü|since, as, owing to the fact that, given that|The event was cancelled [because] it rained.|
for example|bag|örneğin|for instance, such as, to illustrate, namely|Some cities, [for example] Vienna, invest in housing.|
in the end|bag|sonunda|ultimately, eventually, in the long run|[In the end], the choice is ours.|
I think|kal|bence|in my view, I would argue that, it seems to me that, I am convinced that|[I think] the ban is unfair.|
in conclusion|kal|sonuç olarak|to sum up, all things considered, on balance, ultimately|[In conclusion], the benefits are clear.|
more and more|kal|giderek daha çok|increasingly, a growing number of, ever more|[More and more] students work part-time.|
nowadays|kal|günümüzde|in recent years, in today's world, at present|[Nowadays] most news is read on a phone.|
`;
export const YUKSELT = HAM.trim().split("\n").map((s) => {
  const [sade, tur, tr, guclu, ornek, not] = s.split("|").map((x) => x.trim());
  return { sade, tur, tr, guclu: guclu.split(",").map((x) => x.trim()), ornek, not: not || null };
});
