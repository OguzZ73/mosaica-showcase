// Zen-Flow Turkish Writing/Grammar Linting Engine
// Self-contained, pure JavaScript/TypeScript module. No side effects.
// Derived from mosaica-web hooks/editor/types.ts and hooks/editor/engine.ts

export type ErrorCategory = 'typo' | 'grammar' | 'punctuation' | 'style' | 'phonology';

export type RuleId =
  | 'SPACE_AFTER_PUNCT'
  | 'SPACE_BEFORE_PUNCT'
  | 'DOUBLE_SPACE'
  | 'ELLIPSIS_CHECK'
  | 'SPACE_INSIDE_BRACKET'
  | 'QUOTE_SPACING'
  | 'REPEATED_PUNCT'
  | 'SENTENCE_CASE'
  | 'PROPER_NOUN'
  | 'PROPER_NOUN_APOSTROPHE'
  | 'SUFFIX_SPACING'
  | 'CHECK_DE_DA'
  | 'SPELLING'
  | 'FUZZY_MATCH'
  | 'VOWEL_HARMONY'
  | 'CONSONANT_HARDENING'
  | 'FUTURE_TENSE_ELISION';

export const RULE_CATEGORY: Record<RuleId, ErrorCategory> = {
  SPACE_AFTER_PUNCT: 'punctuation',
  SPACE_BEFORE_PUNCT: 'punctuation',
  DOUBLE_SPACE: 'punctuation',
  ELLIPSIS_CHECK: 'punctuation',
  SPACE_INSIDE_BRACKET: 'punctuation',
  QUOTE_SPACING: 'punctuation',
  REPEATED_PUNCT: 'punctuation',
  SENTENCE_CASE: 'grammar',
  PROPER_NOUN: 'grammar',
  PROPER_NOUN_APOSTROPHE: 'grammar',
  SUFFIX_SPACING: 'grammar',
  CHECK_DE_DA: 'grammar',
  SPELLING: 'typo',
  FUZZY_MATCH: 'typo',
  VOWEL_HARMONY: 'phonology',
  CONSONANT_HARDENING: 'phonology',
  FUTURE_TENSE_ELISION: 'grammar',
};

export const RULE_LABEL: Record<RuleId, string> = {
  SPACE_AFTER_PUNCT: 'Noktalama sonrası boşluk',
  SPACE_BEFORE_PUNCT: 'Noktalama öncesi boşluk',
  DOUBLE_SPACE: 'Çift boşluk',
  ELLIPSIS_CHECK: 'Hatalı üç nokta kullanımı',
  SPACE_INSIDE_BRACKET: 'Parantez içi gereksiz boşluk',
  QUOTE_SPACING: 'Tırnak işareti boşluk düzeni',
  REPEATED_PUNCT: 'Tekrar eden noktalama işareti',
  SENTENCE_CASE: 'Cümle / paragraf başı büyük harf',
  PROPER_NOUN: 'Özel isim yazımı',
  PROPER_NOUN_APOSTROPHE: 'Özel isim + kesme işareti',
  SUFFIX_SPACING: 'Ek Yazımı',
  CHECK_DE_DA: '-de / -da Yazımı',
  SPELLING: 'Yazım hatası',
  FUZZY_MATCH: 'Olası yazım hatası',
  VOWEL_HARMONY: 'Ünlü uyumu',
  CONSONANT_HARDENING: 'Ünsüz sertleşmesi',
  FUTURE_TENSE_ELISION: 'Gelecek zaman yutulması (konuşma dili)',
};

export interface LintError {
  id: string;
  paragraphId: string;
  startIndex: number;
  endIndex: number;
  ruleId: RuleId;
  category: ErrorCategory;
  originalText: string;
  suggestion: string;
  confidence: number;
  ignored: boolean;
  source?: 'zemberek' | 'languagetool' | 'custom_rules' | 'both' | 'multiple' | 'engine';
  message?: string;
}

export const CORRECTION_MAP: Readonly<Record<string, string>> = {
  'eksoz': 'egzoz',
  'eksos': 'egzoz',
  'egsoz': 'egzoz',
  'laboratuvar': 'laboratuvar',
  'laboratuar': 'laboratuvar',
  'labratuvar': 'laboratuvar',
  'vejeteryen': 'vejetaryen',
  'vejeteryan': 'vejetaryen',
  'orjinal': 'orijinal',
  'insiyatif': 'inisiyatif',
  'entellektüel': 'entelektüel',
  'şevkat': 'şefkat',
  'yanlız': 'yalnız',
  'yalnış': 'yanlış',
  'kiprit': 'kibrit',
  'meyva': 'meyve',
  'pantalon': 'pantolon',
  'idda': 'iddia',
  'stajer': 'stajyer',
  'kontür': 'kontör',
  'hoperlör': 'hoparlör',
  'şöför': 'şoför',
  'herkez': 'herkes',
  'poaça': 'poğaça',
  'bukadar': 'bu kadar',
  'süprizler': 'sürprizler',
  'herşey': 'her şey',
  'birşey': 'bir şey',
  'bişey': 'bir şey',
  'hiçbirşey': 'hiçbir şey',
  'hergün': 'her gün',
  'birçok': 'birçok',
  'pekçok': 'pek çok',
  'yanısıra': 'yanı sıra',
  'şuan': 'şu an',
  'tabi': 'tabii',
  'malesef': 'maalesef',
  'herzaman': 'her zaman',
  'yada': 'ya da',
  'birde': 'bir de',
  'rasgele': 'rastgele',
  'traş': 'tıraş',
  'klavuz': 'kılavuz',
  'siluet': 'silüet',
  'mütevazi': 'mütevazı',
  'döküman': 'doküman',
  'tesbih': 'tespih',
  'tenefüs': 'teneffüs',
  'asvalt': 'asfalt',
  'ahçı': 'aşçı',
  'ekzersiz': 'egzersiz',
  'sarmısak': 'sarımsak',
  'kurdale': 'kurdele',
  'sezeryan': 'sezaryen',
  'gardrop': 'gardırop',
  'komser': 'komiser',
  'teşekürler': 'teşekkürler',
  'inşalah': 'inşallah',
  'maşalah': 'maşallah',
  'klüp': 'kulüp',
  'sandiviç': 'sandviç',
  'kollektif': 'kolektif',
  'mütaahhit': 'müteahhit',
  'mütahit': 'müteahhit',
  'süpriz': 'sürpriz',
  'prosedir': 'prosedür',
  'paragaf': 'paragraf',
  'itibariyle': 'itibarıyla',
  'tesekkur': 'teşekkür',
  'piskoloji': 'psikoloji',
  'piskolojik': 'psikolojik',
  'enstitüsü': 'enstitüsü',
  'oldukca': 'oldukça',
  'acikca': 'açıkça',
  'herşeyin': 'her şeyin',
  'herşeyi': 'her şeyi',
  'herşeyden': 'her şeyden',
  'belkide': 'belki de',
  'birdaha': 'bir daha',
  'dahada': 'daha da',
  'buyüzden': 'bu yüzden',
  'oyüzden': 'o yüzden',
  'ozaman': 'o zaman',
  'biran': 'bir an',
  'heran': 'her an',
  'tabiki': 'tabii ki',
  'ricaederim': 'rica ederim',
  'kolaygelsin': 'kolay gelsin',
  'iyigeceler': 'iyi geceler',
  'iyigünler': 'iyi günler',
  'hoşçakalın': 'hoşça kalın',
  'hoşgeldin': 'hoş geldin',
  'hoşgeldiniz': 'hoş geldiniz',
  'yanyana': 'yan yana',
  'üstüste': 'üst üste',
  'başbaşa': 'baş başa',
  'arkaarkaya': 'arka arkaya',
  'peşpeşe': 'peş peşe',
  'elele': 'el ele',
  'hayalkırıklığı': 'hayal kırıklığı',
  'gözatmak': 'göz atmak',
  'hıp hızlı': 'hıphızlı',
  'çap canlı': 'çapcanlı',
  'mos mor': 'mosmor',
  'kap kara': 'kapkara',
  'bem beyaz': 'bembeyaz',
  'mas mavi': 'masmavi',
  'yem yeşil': 'yemyeşil',
  'sap sarı': 'sapsarı',
  'kıp kırmızı': 'kıpkırmızı',
  'ter temiz': 'tertemiz',
  'terketmek': 'terk etmek',
  'farketmek': 'fark etmek',
  'farketmez': 'fark etmez',
  'başetmek': 'baş etmek',
  'yoketmek': 'yok etmek',
  'haketmek': 'hak etmek',
  'vefatetmek': 'vefat etmek',
  'yapıcak': 'yapacak',
  'gidicek': 'gidecek',
  'gelicek': 'gelecek',
  'alıcak': 'alacak',
  'diycek': 'diyecek',
  'yiycek': 'yiyecek',
  'guzel': 'güzel',
  'canim': 'canım',
  'hayatim': 'hayatım',
  'askim': 'aşkım',
  'bisey': 'bir şey',
  'orda': 'orada',
  'burda': 'burada',
  'şurda': 'şurada',
  'geliyo': 'geliyor',
  'gidiyo': 'gidiyor',
  'biliyom': 'biliyorum',
  'bişiy': 'bir şey',
  'gelcem': 'geleceğim',
  'gitcem': 'gideceğim',
  'slm': 'selam',
  'nbr': 'naber',
  'saol': 'sağ ol',
  'mrb': 'merhaba',
  'ztn': 'zaten',
  'anliyom': 'anlıyorum',
  'anliyorum': 'anlıyorum',
  'goruyorum': 'görüyorum',
  'seviyom': 'seviyorum',
  'ozledim': 'özledim',
};

export const MULTI_WORD_CORRECTIONS: Readonly<Record<string, string>> = {
  'bir çok': 'birçok',
  'bir kaç': 'birkaç',
  'hiç bir': 'hiçbir',
  'ilk okul': 'ilkokul',
  'orta okul': 'ortaokul',
  'vaz geç': 'vazgeç',
  'vaz geçmek': 'vazgeçmek',
  'vaz geçti': 'vazgeçti',
  'git gide': 'giderek',
  'içerisin de': 'içerisinde',
  'içinde ki': 'içindeki',
  'dışında ki': 'dışındaki',
  'hıp hızlı': 'hıphızlı',
  'çap canlı': 'çapcanlı',
  'mos mor': 'mosmor',
  'kap kara': 'kapkara',
  'bem beyaz': 'bembeyaz',
  'mas mavi': 'masmavi',
  'yem yeşil': 'yemyeşil',
  'sap sarı': 'sapsarı',
  'kıp kırmızı': 'kıpkırmızı',
  'ter temiz': 'tertemiz',
};

const SAFE_WORDS: ReadonlySet<string> = new Set([
  'bir', 'tek', 'çok', 'az', 'en', 'her', 'hiç', 'pek', 'tam', 'yarım',
  'ben', 'sen', 'biz', 'siz', 'bu', 'şu', 'kim', 'ne', 'hangi',
  'ama', 'fakat', 'ancak', 'veya', 'ya', 'da', 'de', 'ile', 'için',
  'içinde', 'içinden', 'içindeki', 'içine', 'içini',
  'hem', 'hatta', 'bile', 'dahi', 'hep', 'asla', 'sadece', 'yalnızca',
  'belki', 'galiba', 'sanırım', 'acaba', 'elbette', 'kesinlikle', 'muhakkak',
  'sürekli', 'daima', 'tekrar', 'yine', 'yeniden', 'baştan',
  'birdenbire', 'aniden', 'ansızın', 'nihayet', 'sonunda',
  'aslında', 'gerçekten', 'hakikaten', 'hâlâ', 'hala',
  'neden', 'niçin', 'niye', 'nasıl', 'nerede', 'nereden', 'nereye',
  'bence', 'sence', 'adam', 'kadın', 'çocuk', 'insan', 'anne', 'baba',
  'kardeş', 'arkadaş', 'ev', 'oda', 'kapı', 'pencere', 'duvar', 'yol',
  'sokak', 'cadde', 'su', 'hava', 'ateş', 'toprak', 'gün', 'gece',
  'sabah', 'akşam', 'zaman', 'saat', 'dakika', 'hafta', 'yıl', 'göz',
  'el', 'ayak', 'baş', 'yüz', 'kalp', 'can', 'ruh', 'kitap', 'kalem',
  'masa', 'sandalye', 'şey', 'şeyler', 'şeye', 'şeyi', 'şeyden',
  'gel', 'git', 'bak', 'gör', 'al', 'ver', 'yap', 'de', 'söyle',
  'bil', 'iste', 'ol', 'kal', 'dur', 'otur', 'yat', 'kalk', 'güzel',
  'büyük', 'küçük', 'yeni', 'eski', 'iyi', 'kötü', 'hızlı', 'yavaş',
  'kolay', 'zor', 'doğru', 'yanlış', 'güçlü', 'zayıf', 'uzun', 'kısa',
  'derin', 'geniş', 'sıcak', 'soğuk', 'sessiz', 'sakin', 'üzeri',
  'üzerinde', 'üzerinden', 'üzerine', 'içerisi', 'içerisinde', 'içerisine',
  'hakkında', 'karşı', 'doğru', 'göre', 'kadar', 'başka', 'beri',
  'dolayı', 'ötürü', 'rağmen', 'karşın', 'birlikte', 'beraber',
  'sayesinde', 'yüzünden', 'nedeniyle', 'sebebiyle', 'herkes', 'herkesin',
  'hiçbir', 'hiçbiri', 'kendim', 'kendin', 'kendi', 'kendimiz', 'kendiniz',
  'kimse', 'keşke', 'bari', 'değil', 'tamam', 'teşekkürler', 'teşekkür',
]);

export const PROPER_NOUNS: readonly string[] = [
  'Türkiye', 'İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Adana', 'Trabzon',
  'Antalya', 'Konya', 'Kayseri', 'Eskişehir', 'Gaziantep', 'Mersin',
  'Atatürk', 'Mosaica', 'Avrupa', 'Asya', 'Amerika', 'Almanya',
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz',
  'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık',
  'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar',
];

function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const [s, t] = a.length >= b.length ? [a, b] : [b, a];
  let dp: number[] = Array.from({ length: t.length + 1 }, (_, i) => i);

  for (let i = 1; i <= s.length; i++) {
    let prev = dp[0];
    dp[0] = i;
    for (let j = 1; j <= t.length; j++) {
      const tmp = dp[j];
      if (s[i - 1] === t[j - 1]) {
        dp[j] = prev;
      } else {
        dp[j] = 1 + Math.min(prev, dp[j], dp[j - 1]);
      }
      prev = tmp;
    }
  }
  return dp[t.length];
}

function similarity(a: string, b: string): number {
  const maxLen = Math.max(a.length, b.length);
  if (maxLen === 0) return 1;
  return 1 - levenshtein(a, b) / maxLen;
}

function isSentenceStart(text: string, index: number): boolean {
  const before = text.slice(0, index).trim();
  return before === '' || /[.!?]$/.test(before);
}

function applyCasing(word: string, isStart: boolean): string {
  if (!isStart) return word;
  return word.charAt(0).toLocaleUpperCase('tr-TR') + word.slice(1);
}

export interface ScanOptions {
  paragraphId: string;
  text: string;
  ignoreSet?: Set<string>;
  globalIgnoreSet?: Set<string>;
  learnedMistakes?: Record<string, string>;
  checkSpacing?: boolean;
  checkSuffixes?: boolean;
}

export function scanParagraph({
  paragraphId,
  text,
  ignoreSet = new Set(),
  globalIgnoreSet = new Set(),
  learnedMistakes = {},
  checkSpacing = true,
  checkSuffixes = true,
}: ScanOptions): LintError[] {
  const errors: LintError[] = [];
  const claimedRanges = new Set<number>();

  function push(
    ruleId: RuleId,
    startIndex: number,
    endIndex: number,
    originalText: string,
    suggestion: string,
    confidence: number
  ) {
    if (claimedRanges.has(startIndex)) return;
    const id = `${paragraphId}_${startIndex}_${ruleId}`;
    if (ignoreSet.has(id)) return;
    if (originalText === suggestion) return;

    const lowerText = originalText.toLocaleLowerCase('tr-TR');
    if (globalIgnoreSet.has(lowerText)) return;
    if (SAFE_WORDS.has(lowerText)) return;

    errors.push({
      id,
      paragraphId,
      startIndex,
      endIndex,
      ruleId,
      category: RULE_CATEGORY[ruleId],
      originalText,
      suggestion,
      confidence,
      ignored: false,
    });
    claimedRanges.add(startIndex);
  }

  if (checkSpacing) {
    let m: RegExpExecArray | null;
    const afterPunct = /([!?;,]|(?<!\.)\.(?!\.))([^\s\d"'»\n.!?;,])/g;
    while ((m = afterPunct.exec(text)) !== null) {
      push('SPACE_AFTER_PUNCT', m.index, m.index + m[0].length, m[0], `${m[1]} ${m[2]}`, 0.98);
    }

    const beforePunct = /\s+([.!?;:,])/g;
    while ((m = beforePunct.exec(text)) !== null) {
      push('SPACE_BEFORE_PUNCT', m.index, m.index + m[0].length, m[0], m[1], 0.98);
    }

    const doubleSpace = /[ ]{2,}/g;
    while ((m = doubleSpace.exec(text)) !== null) {
      push('DOUBLE_SPACE', m.index, m.index + m[0].length, m[0], ' ', 0.95);
    }
  }

  const combinedMap = { ...CORRECTION_MAP, ...learnedMistakes };
  const wordRe = /[a-zğışüöçA-ZĞIŞÜÖÇİ]+/g;
  let m: RegExpExecArray | null;

  while ((m = wordRe.exec(text)) !== null) {
    const rawWord = m[0];
    const start = m.index;
    const end = m.index + rawWord.length;
    const lower = rawWord.toLocaleLowerCase('tr-TR');

    if (SAFE_WORDS.has(lower)) continue;

    const rawCorrection = combinedMap[lower];
    if (rawCorrection && rawCorrection !== lower) {
      const correction = applyCasing(rawCorrection, isSentenceStart(text, start));
      if (rawWord !== correction) {
        push('SPELLING', start, end, rawWord, correction, 0.99);
      }
    }
  }

  return errors;
}
