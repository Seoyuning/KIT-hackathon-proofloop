export interface CatalogTextbook {
  id: string;
  publisher: string;
  grade: string;
  subject: string;
  textbookName: string;
  author: string;
}

export const subjects = [
  "수학", "국어", "영어", "과학", "사회",
  "한국사", "물리학", "화학", "생명과학", "지구과학",
  "정보", "기술·가정", "도덕", "음악", "미술",
] as const;

export const publishers = [
  "비상교육", "미래엔", "천재교육", "동아출판", "금성출판사",
  "지학사", "교학사", "좋은책신사고", "YBM", "씨마스",
] as const;

export const catalog: CatalogTextbook[] = [
  // 수학
  { id: "math-bisang-h1", publisher: "비상교육", grade: "고1", subject: "수학", textbookName: "수학", author: "김원경" },
  { id: "math-bisang-h2", publisher: "비상교육", grade: "고2", subject: "수학", textbookName: "수학 I", author: "김원경" },
  { id: "math-bisang-h2-2", publisher: "비상교육", grade: "고2", subject: "수학", textbookName: "수학 II", author: "김원경" },
  { id: "math-mirae-h1", publisher: "미래엔", grade: "고1", subject: "수학", textbookName: "수학", author: "황선욱" },
  { id: "math-mirae-h2", publisher: "미래엔", grade: "고2", subject: "수학", textbookName: "수학 I", author: "황선욱" },
  { id: "math-chunjae-h1", publisher: "천재교육", grade: "고1", subject: "수학", textbookName: "수학", author: "이준열" },
  { id: "math-chunjae-h2", publisher: "천재교육", grade: "고2", subject: "수학", textbookName: "수학 I", author: "이준열" },
  { id: "math-donga-h1", publisher: "동아출판", grade: "고1", subject: "수학", textbookName: "수학", author: "박교식" },
  { id: "math-kyohak-h1", publisher: "교학사", grade: "고1", subject: "수학", textbookName: "수학", author: "권오남" },
  { id: "math-sinsago-h1", publisher: "좋은책신사고", grade: "고1", subject: "수학", textbookName: "수학", author: "고성은" },
  { id: "math-bisang-m1", publisher: "비상교육", grade: "중1", subject: "수학", textbookName: "수학 1", author: "김원경" },
  { id: "math-bisang-m2", publisher: "비상교육", grade: "중2", subject: "수학", textbookName: "수학 2", author: "김원경" },
  { id: "math-bisang-m3", publisher: "비상교육", grade: "중3", subject: "수학", textbookName: "수학 3", author: "김원경" },
  { id: "math-mirae-m1", publisher: "미래엔", grade: "중1", subject: "수학", textbookName: "수학 1", author: "황선욱" },
  { id: "math-mirae-m2", publisher: "미래엔", grade: "중2", subject: "수학", textbookName: "수학 2", author: "황선욱" },
  { id: "math-chunjae-m1", publisher: "천재교육", grade: "중1", subject: "수학", textbookName: "수학 1", author: "이준열" },

  // 국어
  { id: "kor-bisang-h1", publisher: "비상교육", grade: "고1", subject: "국어", textbookName: "국어", author: "박안수" },
  { id: "kor-mirae-h1", publisher: "미래엔", grade: "고1", subject: "국어", textbookName: "국어", author: "신유식" },
  { id: "kor-chunjae-h1", publisher: "천재교육", grade: "고1", subject: "국어", textbookName: "국어", author: "박영목" },
  { id: "kor-donga-h1", publisher: "동아출판", grade: "고1", subject: "국어", textbookName: "국어", author: "이삼형" },
  { id: "kor-sinsago-h1", publisher: "좋은책신사고", grade: "고1", subject: "국어", textbookName: "국어", author: "민현식" },
  { id: "kor-bisang-m1", publisher: "비상교육", grade: "중1", subject: "국어", textbookName: "국어 1", author: "김진수" },
  { id: "kor-mirae-m1", publisher: "미래엔", grade: "중1", subject: "국어", textbookName: "국어 1", author: "신유식" },
  { id: "kor-chunjae-m2", publisher: "천재교육", grade: "중2", subject: "국어", textbookName: "국어 2", author: "노미숙" },

  // 영어
  { id: "eng-bisang-h1", publisher: "비상교육", grade: "고1", subject: "영어", textbookName: "영어", author: "홍민표" },
  { id: "eng-ybm-h1", publisher: "YBM", grade: "고1", subject: "영어", textbookName: "영어", author: "박준언" },
  { id: "eng-chunjae-h1", publisher: "천재교육", grade: "고1", subject: "영어", textbookName: "영어", author: "이재영" },
  { id: "eng-mirae-h1", publisher: "미래엔", grade: "고1", subject: "영어", textbookName: "영어", author: "양현권" },
  { id: "eng-donga-h1", publisher: "동아출판", grade: "고1", subject: "영어", textbookName: "영어", author: "권혁승" },
  { id: "eng-bisang-m1", publisher: "비상교육", grade: "중1", subject: "영어", textbookName: "영어 1", author: "홍민표" },
  { id: "eng-ybm-m2", publisher: "YBM", grade: "중2", subject: "영어", textbookName: "영어 2", author: "박준언" },

  // 과학
  { id: "sci-bisang-h1", publisher: "비상교육", grade: "고1", subject: "과학", textbookName: "통합과학", author: "심규철" },
  { id: "sci-mirae-h1", publisher: "미래엔", grade: "고1", subject: "과학", textbookName: "통합과학", author: "김성진" },
  { id: "sci-chunjae-h1", publisher: "천재교육", grade: "고1", subject: "과학", textbookName: "통합과학", author: "전동렬" },
  { id: "sci-mirae-m1", publisher: "미래엔", grade: "중1", subject: "과학", textbookName: "과학 1", author: "김성진" },
  { id: "sci-mirae-m2", publisher: "미래엔", grade: "중2", subject: "과학", textbookName: "과학 2", author: "김성진" },
  { id: "sci-bisang-m2", publisher: "비상교육", grade: "중2", subject: "과학", textbookName: "과학 2", author: "임태훈" },
  { id: "sci-chunjae-m3", publisher: "천재교육", grade: "중3", subject: "과학", textbookName: "과학 3", author: "전동렬" },

  // 사회
  { id: "soc-bisang-h1", publisher: "비상교육", grade: "고1", subject: "사회", textbookName: "통합사회", author: "박병기" },
  { id: "soc-mirae-h1", publisher: "미래엔", grade: "고1", subject: "사회", textbookName: "통합사회", author: "정창우" },
  { id: "soc-chunjae-h1", publisher: "천재교육", grade: "고1", subject: "사회", textbookName: "통합사회", author: "구정화" },
  { id: "soc-mirae-m1", publisher: "미래엔", grade: "중1", subject: "사회", textbookName: "사회 1", author: "정창우" },
  { id: "soc-bisang-m1", publisher: "비상교육", grade: "중1", subject: "사회", textbookName: "사회 1", author: "최성길" },

  // 한국사
  { id: "hist-mirae-h", publisher: "미래엔", grade: "고등", subject: "한국사", textbookName: "한국사", author: "한철호" },
  { id: "hist-bisang-h", publisher: "비상교육", grade: "고등", subject: "한국사", textbookName: "한국사", author: "도면회" },
  { id: "hist-chunjae-h", publisher: "천재교육", grade: "고등", subject: "한국사", textbookName: "한국사", author: "이인석" },
  { id: "hist-donga-h", publisher: "동아출판", grade: "고등", subject: "한국사", textbookName: "한국사", author: "김종수" },

  // 물리학
  { id: "phys-bisang-h", publisher: "비상교육", grade: "고등", subject: "물리학", textbookName: "물리학 I", author: "곽성일" },
  { id: "phys-mirae-h", publisher: "미래엔", grade: "고등", subject: "물리학", textbookName: "물리학 I", author: "김성원" },
  { id: "phys-chunjae-h", publisher: "천재교육", grade: "고등", subject: "물리학", textbookName: "물리학 I", author: "강남화" },

  // 화학
  { id: "chem-bisang-h", publisher: "비상교육", grade: "고등", subject: "화학", textbookName: "화학 I", author: "류해일" },
  { id: "chem-chunjae-h", publisher: "천재교육", grade: "고등", subject: "화학", textbookName: "화학 I", author: "노태희" },

  // 생명과학
  { id: "bio-bisang-h", publisher: "비상교육", grade: "고등", subject: "생명과학", textbookName: "생명과학 I", author: "심규철" },
  { id: "bio-chunjae-h", publisher: "천재교육", grade: "고등", subject: "생명과학", textbookName: "생명과학 I", author: "이준규" },

  // 정보
  { id: "info-bisang-m", publisher: "비상교육", grade: "중등", subject: "정보", textbookName: "정보", author: "이원규" },
  { id: "info-mirae-h", publisher: "미래엔", grade: "고등", subject: "정보", textbookName: "정보", author: "김현철" },
];

export function getSubjectTextbooks(subject: string): CatalogTextbook[] {
  return catalog.filter((t) => t.subject === subject);
}

export function getPublishersForSubject(subject: string): string[] {
  const pubs = new Set(catalog.filter((t) => t.subject === subject).map((t) => t.publisher));
  return Array.from(pubs);
}

export function getTextbooksForPublisher(subject: string, publisher: string): CatalogTextbook[] {
  return catalog.filter((t) => t.subject === subject && t.publisher === publisher);
}
