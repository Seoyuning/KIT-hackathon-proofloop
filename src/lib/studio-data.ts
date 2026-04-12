export type TextbookSection = {
  id: string;
  title: string;
  pages: string;
  summary: string;
  explanation: string;
  keywords: string[];
  misconceptionTags: string[];
  questionSeeds: string[];
  citationFocus: string;
  teacherBridge: string;
  examStem: string;
  examAnswer: string;
  examDistractors: [string, string, string];
};

export type TextbookBot = {
  id: string;
  schoolLevel: string;
  grade: string;
  subject: string;
  publisher: string;
  textbookName: string;
  description: string;
  distributionLabel: string;
  activeStudents: number;
  starterPrompts: string[];
  sections: TextbookSection[];
};

export type QuestionCluster = {
  id: string;
  botId: string;
  sectionId: string;
  representativeQuestion: string;
  misconception: string;
  frequency: number;
  studentNeed: string;
  teacherAction: string;
};

export const textbookBots: TextbookBot[] = [
  {
    id: "high-math-bisang",
    schoolLevel: "고등",
    grade: "고1",
    subject: "수학",
    publisher: "비상교육",
    textbookName: "수학 I",
    description: "이차함수와 경우의 수 단원을 교과서 근거로 답하는 수학 챗봇",
    distributionLabel: "과목별 · 출판사별 배포",
    activeStudents: 128,
    starterPrompts: [
      "꼭짓점과 축의 관계를 교과서 기준으로 설명해줘.",
      "a 값이 바뀌면 그래프가 왜 달라지는지 알려줘.",
      "순열과 조합을 어떤 기준으로 구분하는지 예시와 함께 설명해줘.",
    ],
    sections: [
      {
        id: "quadratic-axis",
        title: "이차함수의 그래프와 축",
        pages: "42-47쪽",
        summary: "꼭짓점, 축, 열림 방향을 식의 형태와 연결해 그래프를 해석하는 단원입니다.",
        explanation:
          "교과서에서는 y=a(x-p)^2+q 형태를 통해 축이 x=p이고 꼭짓점이 (p, q)라는 점을 그래프 이동과 함께 설명합니다.",
        keywords: ["이차함수", "그래프", "축", "꼭짓점", "열림", "평행이동", "a값"],
        misconceptionTags: [
          "축과 꼭짓점을 순서만 외우고 그래프 이동과 연결하지 못함",
          "a 값의 부호와 크기가 그래프에 주는 영향을 한 번에 설명하지 못함",
        ],
        questionSeeds: [
          "꼭짓점을 먼저 찾는 이유를 식과 그래프로 함께 말해보세요.",
          "a가 음수일 때 그래프가 아래로 열린다는 걸 어떻게 설명할 수 있나요?",
        ],
        citationFocus: "표준형과 꼭짓점형 비교, 축과 꼭짓점이 동시에 표시된 예시 그래프",
        teacherBridge: "첫 슬라이드에서 같은 식을 표준형과 꼭짓점형으로 바꿔 보이며 축과 꼭짓점을 한 화면에 겹쳐 설명합니다.",
        examStem: "함수 y=-2(x-1)^2+3의 그래프에 대한 설명으로 옳은 것은?",
        examAnswer: "축은 x=1이고, 그래프는 아래로 열리며, 꼭짓점은 (1, 3)이다.",
        examDistractors: [
          "축은 y=1이고, 그래프는 위로 열리며, 꼭짓점은 (3, 1)이다.",
          "축은 x=-1이고, 그래프는 아래로 열리며, 꼭짓점은 (-1, 3)이다.",
          "축은 x=1이고, 그래프는 위로 열리며, 꼭짓점은 (1, -3)이다.",
        ],
      },
      {
        id: "quadratic-maxmin",
        title: "이차함수의 최대와 최소",
        pages: "48-53쪽",
        summary: "꼭짓점의 y값과 열림 방향을 이용해 최대값 또는 최소값을 판단하는 단원입니다.",
        explanation:
          "교과서는 그래프가 위로 열리면 꼭짓점의 y값이 최소, 아래로 열리면 최대가 된다는 점을 정의역과 함께 읽도록 안내합니다.",
        keywords: ["최대", "최소", "정의역", "꼭짓점", "y값", "위로", "아래로"],
        misconceptionTags: [
          "꼭짓점의 y값과 최대·최소를 연결하지 못하고 공식만 대입함",
          "정의역이 달라질 때 최대·최소 판단이 달라질 수 있다는 점을 놓침",
        ],
        questionSeeds: [
          "꼭짓점의 y값이 왜 최대 또는 최소가 되는지 그래프로 설명해보세요.",
          "정의역이 제한되면 최대·최소가 어떻게 달라질 수 있나요?",
        ],
        citationFocus: "정의역 제한에 따라 극값 판단이 달라지는 예제",
        teacherBridge: "정의역을 일부러 잘라 놓은 그래프를 보여 주고, 꼭짓점이 있어도 답이 달라질 수 있다는 점을 먼저 확인시킵니다.",
        examStem: "이차함수의 최대·최소를 설명한 것으로 가장 적절한 것은?",
        examAnswer: "열림 방향과 정의역을 함께 봐야 최대·최소를 올바르게 판단할 수 있다.",
        examDistractors: [
          "꼭짓점의 x값만 알면 언제나 최대·최소를 바로 정할 수 있다.",
          "그래프가 위로 열리면 꼭짓점의 y값은 항상 최대이다.",
          "정의역은 최대·최소 판단과 관계가 없다.",
        ],
      },
      {
        id: "permutation-combination",
        title: "순열과 조합의 구분",
        pages: "86-92쪽",
        summary: "순서의 중요 여부에 따라 순열과 조합을 구분해 문제를 해결하는 단원입니다.",
        explanation:
          "교과서는 같은 대상을 뽑아도 배열까지 따지면 순열, 구성만 따지면 조합이라는 기준을 사례 비교로 설명합니다.",
        keywords: ["순열", "조합", "순서", "배열", "뽑기", "경우의수", "중복"],
        misconceptionTags: [
          "순서를 고려하는지 여부를 문제 문장과 연결하지 못함",
          "같은 상황을 순열과 조합으로 모두 세어 보는 실수를 함",
        ],
        questionSeeds: [
          "문장에서 순서를 본다는 게 정확히 무슨 뜻인지 말해보세요.",
          "대표 2명 뽑기와 줄 세우기를 왜 다른 계산으로 처리하나요?",
        ],
        citationFocus: "같은 상황을 순열과 조합으로 비교한 예제 표",
        teacherBridge: "학생 질문 DB 상위 질문을 바탕으로 ‘대표 뽑기’와 ‘등수 정하기’를 나란히 놓고 판단 기준만 비교합니다.",
        examStem: "다음 상황 중 조합을 사용하는 경우는 어느 것인가?",
        examAnswer: "동아리 발표 대표 3명을 뽑는 경우",
        examDistractors: [
          "학생 3명을 무대 위에 일렬로 세우는 경우",
          "달리기 1, 2, 3등을 정하는 경우",
          "암호 3자리를 서로 다른 숫자로 만드는 경우",
        ],
      },
    ],
  },
  {
    id: "middle-science-mirae",
    schoolLevel: "중등",
    grade: "중2",
    subject: "과학",
    publisher: "미래엔",
    textbookName: "과학 2",
    description: "광합성, 상태 변화, 전류 단원을 교과서 근거로 설명하는 과학 챗봇",
    distributionLabel: "과목별 · 출판사별 배포",
    activeStudents: 96,
    starterPrompts: [
      "광합성과 호흡의 차이를 교과서 기준으로 설명해줘.",
      "상태 변화가 일어나도 입자의 종류가 안 바뀐다는 게 무슨 뜻이야?",
      "전류와 전압의 차이를 물 흐름 비유 없이 설명해줘.",
    ],
    sections: [
      {
        id: "photosynthesis-respiration",
        title: "광합성과 호흡",
        pages: "54-61쪽",
        summary: "광합성과 호흡의 조건, 생성물, 에너지 흐름을 비교하는 단원입니다.",
        explanation:
          "교과서는 광합성은 빛에너지를 사용해 양분을 만들고, 호흡은 양분을 분해해 생활에 필요한 에너지를 얻는 과정으로 구분합니다.",
        keywords: ["광합성", "호흡", "빛", "에너지", "이산화탄소", "산소", "포도당"],
        misconceptionTags: [
          "광합성과 호흡을 낮/밤의 시간 구분으로만 이해함",
          "식물이 호흡하지 않는다고 오해함",
        ],
        questionSeeds: [
          "식물도 호흡한다는 걸 생성물과 에너지 흐름으로 설명해보세요.",
          "광합성과 호흡이 동시에 언급될 때 무엇을 먼저 구분해야 하나요?",
        ],
        citationFocus: "광합성과 호흡 비교 표, 식물 세포와 엽록체 그림",
        teacherBridge: "‘식물은 낮에만 산다’ 같은 학생 표현을 먼저 제시하고, 비교 표로 바로 교정합니다.",
        examStem: "광합성과 호흡에 대한 설명으로 옳은 것은?",
        examAnswer: "식물은 광합성과 별개로 호흡도 하며, 호흡은 에너지를 얻는 과정이다.",
        examDistractors: [
          "식물은 광합성만 하고 호흡은 하지 않는다.",
          "호흡은 오직 밤에만 일어난다.",
          "광합성은 양분을 분해해 에너지를 얻는 과정이다.",
        ],
      },
      {
        id: "state-change-particles",
        title: "상태 변화와 입자 배열",
        pages: "118-124쪽",
        summary: "고체, 액체, 기체의 상태 변화가 일어나도 입자의 종류는 같고 배열과 운동만 달라진다는 단원입니다.",
        explanation:
          "교과서는 상태 변화 전후에 같은 물질이라면 입자의 종류는 유지되고, 입자 사이 거리와 운동 정도만 변한다고 설명합니다.",
        keywords: ["상태 변화", "입자", "배열", "거리", "운동", "융해", "기화", "응결"],
        misconceptionTags: [
          "상태가 바뀌면 물질의 종류도 바뀐다고 생각함",
          "입자 사이 거리가 커지는 것과 입자 수가 늘어나는 것을 혼동함",
        ],
        questionSeeds: [
          "물이 수증기가 되어도 같은 물질이라고 말할 수 있는 이유는 무엇인가요?",
          "입자 수는 그대로인데 부피가 커진다는 걸 어떻게 설명하나요?",
        ],
        citationFocus: "상태 변화 전후 입자 배열 비교 그림",
        teacherBridge: "입자 그림을 확대해서 보여 주고, ‘종류는 그대로 / 거리만 변화’라는 문장을 반복적으로 고정합니다.",
        examStem: "상태 변화에 대한 설명으로 가장 적절한 것은?",
        examAnswer: "같은 물질의 상태 변화에서는 입자의 종류가 바뀌지 않고 배열과 운동만 달라진다.",
        examDistractors: [
          "기체가 되면 입자의 수가 늘어난다.",
          "액체가 고체가 되면 입자의 종류가 바뀐다.",
          "상태 변화는 새로운 물질이 생기는 화학 변화이다.",
        ],
      },
      {
        id: "current-voltage",
        title: "전류와 전압",
        pages: "176-183쪽",
        summary: "전류는 전하의 흐름, 전압은 전류를 흐르게 하는 에너지 차이로 이해하는 단원입니다.",
        explanation:
          "교과서는 전류와 전압을 다른 개념으로 구분하고, 전압이 높다고 전류 자체와 같은 뜻이 아님을 회로 실험으로 보여 줍니다.",
        keywords: ["전류", "전압", "전하", "회로", "전지", "전기", "흐름"],
        misconceptionTags: [
          "전류와 전압을 같은 말로 사용함",
          "전압이 세면 전류와 전압이 모두 같은 양이라고 오해함",
        ],
        questionSeeds: [
          "전류와 전압의 차이를 실험 결과 중심으로 설명해보세요.",
          "전지가 늘어나면 왜 전압이 바뀌는지 회로 그림으로 말해보세요.",
        ],
        citationFocus: "전구 밝기 비교 실험, 직렬 연결 전지 그림",
        teacherBridge: "전류와 전압을 한 표에 나란히 놓고 정의, 단위, 측정 기구를 동시에 비교합니다.",
        examStem: "전류와 전압에 대한 설명으로 옳은 것은?",
        examAnswer: "전류는 전하의 흐름이고, 전압은 전류를 흐르게 하는 에너지 차이이다.",
        examDistractors: [
          "전류와 전압은 같은 개념이며 단위만 다르다.",
          "전압은 전하의 개수이고 전류는 전지의 세기이다.",
          "전류는 전지 개수와 관계없이 언제나 일정하다.",
        ],
      },
    ],
  },
  {
    id: "high-korean-chunjae",
    schoolLevel: "고등",
    grade: "고1",
    subject: "국어",
    publisher: "천재교육",
    textbookName: "국어",
    description: "비문학 읽기와 주장-근거 구분을 교과서 근거로 답하는 국어 챗봇",
    distributionLabel: "과목별 · 출판사별 배포",
    activeStudents: 112,
    starterPrompts: [
      "중심 내용과 세부 내용을 어떻게 구분하는지 알려줘.",
      "자료 해석 문제에서 그래프를 먼저 봐야 해, 지문을 먼저 봐야 해?",
      "주장과 근거를 헷갈리지 않게 읽는 방법을 설명해줘.",
    ],
    sections: [
      {
        id: "reading-main-idea",
        title: "설명문에서 중심 내용 파악",
        pages: "74-80쪽",
        summary: "문단의 화제와 글 전체의 중심 내용을 구분해 읽는 단원입니다.",
        explanation:
          "교과서는 반복되는 핵심어와 문단 간 관계를 통해 중심 내용을 찾고, 세부 사례는 이를 뒷받침하는 요소로 읽게 합니다.",
        keywords: ["중심 내용", "세부 내용", "문단", "핵심어", "설명문", "요약", "주제"],
        misconceptionTags: [
          "첫 문장이나 마지막 문장만 보고 중심 내용을 성급히 결정함",
          "사례나 예시 문장을 중심 내용으로 착각함",
        ],
        questionSeeds: [
          "중심 내용과 세부 내용을 구분할 때 어떤 단서를 먼저 찾나요?",
          "사례가 많은 문단에서 중심 내용을 어떻게 남기나요?",
        ],
        citationFocus: "문단별 핵심어 표시 예시, 중심 내용 요약 활동",
        teacherBridge: "학생이 밑줄 친 문장을 같이 보며, 왜 그것이 중심이 아니라 근거인지 표시하는 활동을 넣습니다.",
        examStem: "설명문 읽기에서 중심 내용을 파악하는 방법으로 가장 적절한 것은?",
        examAnswer: "반복되는 핵심어와 문단 간 관계를 바탕으로 글 전체의 공통 메시지를 정리한다.",
        examDistractors: [
          "예시가 가장 많이 나온 문장을 중심 내용으로 본다.",
          "첫 문장만 읽고 글의 중심 내용을 바로 확정한다.",
          "세부 내용이 많을수록 그것이 곧 중심 내용이라고 본다.",
        ],
      },
      {
        id: "reading-data-interpretation",
        title: "자료와 본문을 함께 읽기",
        pages: "108-115쪽",
        summary: "그래프, 표, 도표를 본문과 연결해 의미를 해석하는 단원입니다.",
        explanation:
          "교과서는 자료를 따로 읽지 않고 본문 주장과 연결해 읽어야 하며, 자료는 주장을 보완하거나 반박하는 근거가 된다고 설명합니다.",
        keywords: ["자료", "그래프", "표", "도표", "본문", "해석", "근거"],
        misconceptionTags: [
          "자료를 숫자 읽기 문제로만 보고 본문과 연결하지 못함",
          "자료의 증가·감소를 주장과 무관하게 해석함",
        ],
        questionSeeds: [
          "자료를 읽을 때 본문과 어떤 순서로 연결해야 하나요?",
          "숫자 변화가 바로 결론이 아니라고 말할 수 있는 이유는 무엇인가요?",
        ],
        citationFocus: "본문 주장 옆에 연결된 도표 해설 예시",
        teacherBridge: "그래프만 먼저 읽은 답안과 본문-자료를 연결한 답안을 비교시켜 차이를 보여 줍니다.",
        examStem: "자료 해석 문제를 풀 때 가장 적절한 접근은?",
        examAnswer: "자료의 변화 양상을 본문 주장과 연결해 근거로 읽는다.",
        examDistractors: [
          "자료는 본문과 별개이므로 숫자만 읽고 판단한다.",
          "그래프의 가장 큰 수치만 고르면 주장을 찾을 수 있다.",
          "자료에서 증가하면 무조건 긍정적 의미라고 해석한다.",
        ],
      },
      {
        id: "speech-claim-evidence",
        title: "주장과 근거 구분",
        pages: "182-188쪽",
        summary: "화법과 작문 맥락에서 주장과 근거를 구분하고 연결하는 단원입니다.",
        explanation:
          "교과서는 필자의 입장이나 제안을 주장으로, 그 주장을 뒷받침하는 이유와 자료를 근거로 구분하게 합니다.",
        keywords: ["주장", "근거", "입장", "제안", "이유", "자료", "화법"],
        misconceptionTags: [
          "주장과 근거를 모두 비슷한 중요 문장으로만 읽음",
          "이유가 빠진 주장 문장을 근거로 잘못 분류함",
        ],
        questionSeeds: [
          "주장과 근거를 구분할 때 말의 역할을 어떻게 보나요?",
          "자료가 없어도 근거가 될 수 있는 경우는 언제인가요?",
        ],
        citationFocus: "주장-근거 연결 화살표가 표시된 발표문 예시",
        teacherBridge: "발표문을 한 문장씩 자른 뒤 학생이 주장/근거 카드를 직접 분류하게 합니다.",
        examStem: "주장과 근거를 구분한 설명으로 가장 적절한 것은?",
        examAnswer: "필자의 입장이나 제안은 주장이고, 이를 뒷받침하는 이유와 자료는 근거이다.",
        examDistractors: [
          "중요해 보이는 문장은 모두 주장으로 본다.",
          "자료가 없으면 근거는 성립하지 않는다.",
          "근거는 필자의 최종 결론이므로 주장과 같은 역할이다.",
        ],
      },
    ],
  },
];

export type StudentWeakness = {
  id: string;
  botId: string;
  studentName: string;
  weakConcepts: Array<{
    sectionId: string;
    misconception: string;
    questionCount: number;
    lastQuestion: string;
  }>;
};

export const initialStudentWeaknesses: StudentWeakness[] = [
  {
    id: "sw-1",
    botId: "high-math-bisang",
    studentName: "김서윤",
    weakConcepts: [
      { sectionId: "quadratic-axis", misconception: "축과 꼭짓점을 순서만 외우고 그래프 이동과 연결하지 못함", questionCount: 5, lastQuestion: "축이 x=p인 이유를 그래프로 설명해줘" },
      { sectionId: "quadratic-maxmin", misconception: "정의역이 달라질 때 최대·최소 판단이 달라진다는 점을 놓침", questionCount: 3, lastQuestion: "정의역이 있으면 최소가 달라질 수 있어?" },
    ],
  },
  {
    id: "sw-2",
    botId: "high-math-bisang",
    studentName: "이준호",
    weakConcepts: [
      { sectionId: "permutation-combination", misconception: "순서를 고려하는지 여부를 문제 문장과 연결하지 못함", questionCount: 6, lastQuestion: "대표 뽑기가 왜 조합이야?" },
      { sectionId: "quadratic-axis", misconception: "a 값의 부호와 크기가 그래프에 주는 영향을 한 번에 설명하지 못함", questionCount: 2, lastQuestion: "a가 음수면 그래프가 어떻게 바뀌어?" },
    ],
  },
  {
    id: "sw-3",
    botId: "high-math-bisang",
    studentName: "박민지",
    weakConcepts: [
      { sectionId: "quadratic-maxmin", misconception: "꼭짓점의 y값과 최대·최소를 연결하지 못하고 공식만 대입함", questionCount: 4, lastQuestion: "꼭짓점 y값이 왜 최소야?" },
    ],
  },
  {
    id: "sw-4",
    botId: "middle-science-mirae",
    studentName: "정하늘",
    weakConcepts: [
      { sectionId: "photosynthesis-respiration", misconception: "식물이 호흡하지 않는다고 오해함", questionCount: 7, lastQuestion: "식물은 밤에만 호흡하는 거 아니야?" },
      { sectionId: "state-change-particles", misconception: "입자 사이 거리가 커지는 것과 입자 수가 늘어나는 것을 혼동함", questionCount: 3, lastQuestion: "기체가 되면 입자가 더 많아지는 거 아냐?" },
    ],
  },
  {
    id: "sw-5",
    botId: "middle-science-mirae",
    studentName: "최예린",
    weakConcepts: [
      { sectionId: "current-voltage", misconception: "전류와 전압을 같은 말로 사용함", questionCount: 4, lastQuestion: "전압이 높으면 전류도 높은 거 아냐?" },
      { sectionId: "photosynthesis-respiration", misconception: "광합성과 호흡을 낮/밤의 시간 구분으로만 이해함", questionCount: 2, lastQuestion: "광합성은 낮에만 하는 거지?" },
    ],
  },
  {
    id: "sw-6",
    botId: "high-korean-chunjae",
    studentName: "한도윤",
    weakConcepts: [
      { sectionId: "reading-main-idea", misconception: "사례나 예시 문장을 중심 내용으로 착각함", questionCount: 5, lastQuestion: "예시가 길면 그게 중심 아니야?" },
      { sectionId: "speech-claim-evidence", misconception: "주장과 근거를 모두 비슷한 중요 문장으로만 읽음", questionCount: 3, lastQuestion: "중요한 말이면 다 주장이지?" },
    ],
  },
  {
    id: "sw-7",
    botId: "high-korean-chunjae",
    studentName: "오지우",
    weakConcepts: [
      { sectionId: "reading-data-interpretation", misconception: "자료를 숫자 읽기 문제로만 보고 본문과 연결하지 못함", questionCount: 4, lastQuestion: "그래프 숫자만 읽으면 안 돼?" },
    ],
  },
];

export const initialQuestionClusters: QuestionCluster[] = [
  {
    id: "math-axis-1",
    botId: "high-math-bisang",
    sectionId: "quadratic-axis",
    representativeQuestion: "꼭짓점을 구할 때 축을 먼저 찾아야 하는 이유가 뭔가요?",
    misconception: "축과 꼭짓점을 순서만 외우고 그래프 이동과 연결하지 못함",
    frequency: 18,
    studentNeed: "식의 형태와 그래프 이동을 함께 보는 설명이 필요합니다.",
    teacherAction: "도입에서 축과 꼭짓점을 한 그래프에 동시에 표시해 비교합니다.",
  },
  {
    id: "math-max-1",
    botId: "high-math-bisang",
    sectionId: "quadratic-maxmin",
    representativeQuestion: "정의역이 있으면 꼭짓점이 답이 아닐 수도 있나요?",
    misconception: "정의역이 달라질 때 최대·최소 판단이 달라진다는 점을 놓침",
    frequency: 12,
    studentNeed: "그래프 전체와 제한된 구간을 나눠서 보는 연습이 필요합니다.",
    teacherAction: "정의역을 자른 그래프 예시를 별도 슬라이드로 추가합니다.",
  },
  {
    id: "math-comb-1",
    botId: "high-math-bisang",
    sectionId: "permutation-combination",
    representativeQuestion: "대표 2명 뽑는 것도 순서가 있는 것 아닌가요?",
    misconception: "순서를 고려하는지 여부를 문제 문장과 연결하지 못함",
    frequency: 15,
    studentNeed: "‘자리 배치’와 ‘구성 선택’을 문장으로 나눠 읽는 훈련이 필요합니다.",
    teacherAction: "대표 뽑기와 줄 세우기를 같은 카드로 제시해 분류 활동을 합니다.",
  },
  {
    id: "science-photo-1",
    botId: "middle-science-mirae",
    sectionId: "photosynthesis-respiration",
    representativeQuestion: "식물은 낮에는 광합성만 하고 호흡은 안 하나요?",
    misconception: "식물이 호흡하지 않는다고 오해함",
    frequency: 20,
    studentNeed: "광합성과 호흡을 시간대가 아니라 역할로 구분하는 설명이 필요합니다.",
    teacherAction: "광합성과 호흡 비교 표를 수업 첫 장에 배치합니다.",
  },
  {
    id: "science-state-1",
    botId: "middle-science-mirae",
    sectionId: "state-change-particles",
    representativeQuestion: "기체가 되면 입자가 많아지는 거 아닌가요?",
    misconception: "입자 사이 거리가 커지는 것과 입자 수가 늘어나는 것을 혼동함",
    frequency: 16,
    studentNeed: "입자 수 보존과 배열 변화가 동시에 보이는 그림 설명이 필요합니다.",
    teacherAction: "상태 변화 전후 입자 그림에 ‘입자 수 동일’ 표시를 추가합니다.",
  },
  {
    id: "science-current-1",
    botId: "middle-science-mirae",
    sectionId: "current-voltage",
    representativeQuestion: "전압이 크면 전류랑 같은 말 아닌가요?",
    misconception: "전류와 전압을 같은 말로 사용함",
    frequency: 11,
    studentNeed: "정의, 단위, 측정 기구를 한 번에 비교하는 정리가 필요합니다.",
    teacherAction: "전류/전압 비교 표를 퀵 체크 자료로 제공합니다.",
  },
  {
    id: "korean-main-1",
    botId: "high-korean-chunjae",
    sectionId: "reading-main-idea",
    representativeQuestion: "예시가 제일 길게 나오면 그게 중심 내용 아닌가요?",
    misconception: "사례나 예시 문장을 중심 내용으로 착각함",
    frequency: 17,
    studentNeed: "문단의 역할과 핵심어 반복을 먼저 보는 훈련이 필요합니다.",
    teacherAction: "예시 문장과 중심 문장을 색으로 분리해 보게 합니다.",
  },
  {
    id: "korean-data-1",
    botId: "high-korean-chunjae",
    sectionId: "reading-data-interpretation",
    representativeQuestion: "그래프는 숫자만 읽으면 되는 것 아닌가요?",
    misconception: "자료를 숫자 읽기 문제로만 보고 본문과 연결하지 못함",
    frequency: 13,
    studentNeed: "본문 주장과 자료의 역할을 연결하는 루틴이 필요합니다.",
    teacherAction: "본문 없이 그래프만 읽은 답과 연결한 답을 비교시킵니다.",
  },
  {
    id: "korean-claim-1",
    botId: "high-korean-chunjae",
    sectionId: "speech-claim-evidence",
    representativeQuestion: "중요한 말이면 다 주장이라고 보면 안 되나요?",
    misconception: "주장과 근거를 모두 비슷한 중요 문장으로만 읽음",
    frequency: 14,
    studentNeed: "문장의 역할을 기준으로 분류하는 연습이 필요합니다.",
    teacherAction: "주장 카드와 근거 카드를 섞어 직접 분류하게 합니다.",
  },
];
