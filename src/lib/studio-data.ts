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
  {
    id: "high-math-sinsago",
    schoolLevel: "고등",
    grade: "고1",
    subject: "수학",
    publisher: "좋은책신사고",
    textbookName: "수학",
    description: "다항식과 방정식, 함수 단원을 교과서 근거로 답하는 수학 챗봇",
    distributionLabel: "시드 데이터",
    activeStudents: 0,
    starterPrompts: [
      "다항식의 나눗셈과 인수분해의 관계를 설명해줘.",
      "이차방정식의 근의 공식이 어디서 나오는지 알려줘.",
      "절대값 함수의 그래프를 어떻게 그리는지 설명해줘.",
    ],
    sections: [
      {
        id: "sinsago-polynomial",
        title: "다항식의 연산",
        pages: "10-28쪽",
        summary: "다항식의 덧셈, 뺄셈, 곱셈, 나눗셈과 나머지 정리, 인수정리를 다루는 단원입니다.",
        explanation: "교과서에서는 다항식의 나눗셈 결과를 몫과 나머지로 정리하고, 나머지 정리를 통해 f(a)=0이면 (x-a)가 인수임을 보입니다.",
        keywords: ["다항식", "나눗셈", "나머지 정리", "인수정리", "인수분해", "전개"],
        misconceptionTags: [
          "나머지 정리와 인수정리의 차이를 구분하지 못함",
          "조립제법의 절차만 외우고 의미를 이해하지 못함",
        ],
        questionSeeds: [
          "나머지 정리에서 f(a)의 값이 나머지가 되는 이유를 설명해보세요.",
          "인수정리를 사용해 인수분해하는 과정을 단계별로 말해보세요.",
        ],
        citationFocus: "나머지 정리 공식 유도 과정, 조립제법 예시",
        teacherBridge: "나머지 정리를 실제 나눗셈 과정과 연결해 시각적으로 보여줍니다.",
        examStem: "다항식 f(x)=x^3-2x^2+x-2에서 f(2)의 값은?",
        examAnswer: "f(2)=8-8+2-2=0이므로, (x-2)는 f(x)의 인수이다.",
        examDistractors: [
          "f(2)=0이므로 x=2는 f(x)의 최솟값이다.",
          "f(2)=2이므로 나머지는 2이다.",
          "나머지 정리는 이차식에만 적용된다.",
        ],
      },
      {
        id: "sinsago-equation",
        title: "방정식과 부등식",
        pages: "30-55쪽",
        summary: "이차방정식의 판별식, 근과 계수의 관계, 이차부등식의 풀이를 다루는 단원입니다.",
        explanation: "교과서에서는 판별식 D=b^2-4ac로 근의 개수를 판별하고, 근과 계수의 관계를 통해 두 근의 합과 곱을 식의 계수와 연결합니다.",
        keywords: ["이차방정식", "판별식", "근의 공식", "근과 계수", "이차부등식", "연립부등식"],
        misconceptionTags: [
          "판별식의 부호와 근의 개수를 반대로 기억함",
          "이차부등식에서 부등호 방향이 바뀌는 조건을 놓침",
        ],
        questionSeeds: [
          "판별식이 0일 때 '중근'이 무슨 뜻인지 그래프와 함께 설명해보세요.",
          "이차부등식의 해를 구할 때 왜 그래프를 그려야 하는지 말해보세요.",
        ],
        citationFocus: "판별식 부호별 그래프 3가지, 부등식 해 구하기 예시",
        teacherBridge: "판별식 부호에 따른 그래프를 3개 나란히 보여주며 비교합니다.",
        examStem: "이차방정식 x^2-4x+k=0이 서로 다른 두 실근을 가질 조건은?",
        examAnswer: "판별식 D=16-4k>0이므로 k<4이다.",
        examDistractors: [
          "k>4이어야 한다.",
          "k=4이면 두 실근을 갖는다.",
          "판별식은 근의 합과 같다.",
        ],
      },
      {
        id: "sinsago-function",
        title: "함수",
        pages: "58-82쪽",
        summary: "함수의 뜻과 그래프, 합성함수, 역함수를 다루는 단원입니다.",
        explanation: "교과서에서는 함수를 대응 관계로 정의하고, 합성함수 (f∘g)(x)=f(g(x))의 순서와 역함수 y=f^(-1)(x)의 조건을 다룹니다.",
        keywords: ["함수", "정의역", "치역", "합성함수", "역함수", "일대일대응"],
        misconceptionTags: [
          "합성함수의 계산 순서를 반대로 함",
          "역함수가 존재하려면 일대일대응이어야 한다는 조건을 놓침",
        ],
        questionSeeds: [
          "(f∘g)(x)와 (g∘f)(x)가 왜 다른지 예시를 들어 설명해보세요.",
          "역함수가 존재하지 않는 함수의 예를 들고 이유를 말해보세요.",
        ],
        citationFocus: "합성함수 계산 순서 도식, 역함수 그래프(y=x 대칭)",
        teacherBridge: "합성함수를 화살표 도식으로 순서를 시각화하고, 역함수를 y=x 대칭으로 보여줍니다.",
        examStem: "f(x)=2x+1일 때 f의 역함수 f^(-1)(x)는?",
        examAnswer: "y=2x+1에서 x=(y-1)/2이므로 f^(-1)(x)=(x-1)/2이다.",
        examDistractors: [
          "f^(-1)(x)=1/(2x+1)이다.",
          "f^(-1)(x)=2x-1이다.",
          "역함수는 원래 함수에 -1을 곱한 것이다.",
        ],
      },
    ],
  },
  {
    id: "high-eng-bisang",
    schoolLevel: "고등",
    grade: "고1",
    subject: "영어",
    publisher: "비상교육",
    textbookName: "영어",
    description: "독해 전략과 문법 단원을 교과서 근거로 답하는 영어 챗봇",
    distributionLabel: "시드 데이터",
    activeStudents: 0,
    starterPrompts: [
      "주제문을 찾는 방법을 알려줘.",
      "관계대명사 who와 which의 차이를 설명해줘.",
      "빈칸 추론 문제 풀이 전략을 알려줘.",
    ],
    sections: [
      {
        id: "eng-main-idea",
        title: "Reading for Main Ideas",
        pages: "14-30쪽",
        summary: "글의 주제문과 요지를 파악하는 독해 전략을 다루는 단원입니다.",
        explanation: "교과서에서는 주제문이 보통 첫 문장이나 마지막 문장에 오며, 반복되는 핵심어를 중심으로 요지를 파악하도록 안내합니다.",
        keywords: ["main idea", "topic sentence", "supporting details", "요지", "주제", "핵심어"],
        misconceptionTags: [
          "첫 문장이 항상 주제문이라고 단정함",
          "세부 사항(예시/숫자)을 요지로 착각함",
        ],
        questionSeeds: [
          "주제문이 첫 문장에 없을 때 어떻게 찾는지 설명해보세요.",
          "supporting details과 main idea의 차이를 예시와 함께 말해보세요.",
        ],
        citationFocus: "주제문 위치별 예시 지문, 핵심어 반복 패턴",
        teacherBridge: "같은 지문에서 주제문 위치가 다른 두 버전을 비교해 보여줍니다.",
        examStem: "다음 글의 주제로 가장 적절한 것은?",
        examAnswer: "기술 발전이 일상 소통 방식을 변화시키고 있다.",
        examDistractors: [
          "스마트폰의 판매량이 증가하고 있다.",
          "젊은 세대가 책을 읽지 않는다.",
          "인터넷 속도가 빨라지고 있다.",
        ],
      },
      {
        id: "eng-grammar-relative",
        title: "관계사와 분사구문",
        pages: "32-48쪽",
        summary: "관계대명사, 관계부사, 분사구문의 형태와 쓰임을 다루는 단원입니다.",
        explanation: "교과서에서는 관계대명사가 두 문장을 연결하며, 선행사의 종류(사람/사물)에 따라 who/which를 사용하고, 분사구문은 부사절을 줄인 형태임을 설명합니다.",
        keywords: ["관계대명사", "who", "which", "that", "관계부사", "where", "when", "분사구문"],
        misconceptionTags: [
          "관계대명사와 접속사를 동시에 쓰는 오류",
          "분사구문에서 주어가 다를 때 처리를 모름",
        ],
        questionSeeds: [
          "관계대명사 that을 쓸 수 없는 경우를 설명해보세요.",
          "분사구문을 원래 부사절로 되돌려 써보세요.",
        ],
        citationFocus: "관계대명사 선택 표, 분사구문 변환 과정",
        teacherBridge: "두 문장을 하나로 합치는 과정을 단계별로 보여줍니다.",
        examStem: "빈칸에 들어갈 말로 가장 적절한 것은? 'The book _____ I read was interesting.'",
        examAnswer: "which 또는 that (목적격 관계대명사)",
        examDistractors: [
          "who (사람이 아닌 사물이므로 부적절)",
          "where (장소가 아닌 사물이므로 부적절)",
          "what (선행사가 있으므로 부적절)",
        ],
      },
    ],
  },
  {
    id: "mid-math-mirae",
    schoolLevel: "중등",
    grade: "중2",
    subject: "수학",
    publisher: "미래엔",
    textbookName: "수학 2",
    description: "일차함수와 연립방정식을 교과서 근거로 답하는 수학 챗봇",
    distributionLabel: "시드 데이터",
    activeStudents: 0,
    starterPrompts: [
      "일차함수의 기울기가 뭐야?",
      "연립방정식을 가감법으로 어떻게 풀어?",
      "일차함수의 그래프에서 x절편과 y절편이 뭐야?",
    ],
    sections: [
      {
        id: "mid-linear-function",
        title: "일차함수와 그래프",
        pages: "82-106쪽",
        summary: "일차함수 y=ax+b의 뜻, 기울기, 절편, 그래프를 다루는 단원입니다.",
        explanation: "교과서에서는 기울기 a가 x가 1 증가할 때 y의 변화량임을 설명하고, y절편 b와 함께 그래프를 그리는 방법을 안내합니다.",
        keywords: ["일차함수", "기울기", "y절편", "x절편", "그래프", "기울기의 부호"],
        misconceptionTags: [
          "기울기와 y절편을 반대로 읽음",
          "기울기가 음수일 때 그래프의 방향을 반대로 그림",
        ],
        questionSeeds: [
          "기울기가 -2라는 것이 그래프에서 어떤 의미인지 설명해보세요.",
          "y절편과 x절편의 차이를 자기 말로 설명해보세요.",
        ],
        citationFocus: "기울기 부호별 그래프 예시, 절편 구하기 과정",
        teacherBridge: "같은 y절편에 기울기만 다른 그래프 3개를 겹쳐 비교합니다.",
        examStem: "일차함수 y=-2x+4의 x절편은?",
        examAnswer: "y=0을 대입하면 0=-2x+4, x=2이므로 x절편은 2이다.",
        examDistractors: [
          "x절편은 4이다.",
          "x절편은 -2이다.",
          "y=0을 대입할 수 없다.",
        ],
      },
      {
        id: "mid-simultaneous",
        title: "연립방정식",
        pages: "56-78쪽",
        summary: "미지수가 2개인 연립일차방정식의 풀이(대입법, 가감법)를 다루는 단원입니다.",
        explanation: "교과서에서는 대입법은 한 식을 다른 식에 대입하는 방법, 가감법은 두 식을 더하거나 빼서 미지수를 소거하는 방법임을 설명합니다.",
        keywords: ["연립방정식", "대입법", "가감법", "소거", "미지수", "해"],
        misconceptionTags: [
          "가감법에서 부호를 바꾸는 과정에서 실수함",
          "해가 무수히 많은 경우와 해가 없는 경우를 구분하지 못함",
        ],
        questionSeeds: [
          "대입법과 가감법 중 어떤 상황에서 어떤 방법이 편한지 설명해보세요.",
          "연립방정식의 해가 없다는 것이 그래프에서 어떤 의미인지 말해보세요.",
        ],
        citationFocus: "대입법/가감법 풀이 과정 비교, 해의 존재 조건",
        teacherBridge: "같은 연립방정식을 대입법과 가감법 두 방법으로 나란히 풀어 비교합니다.",
        examStem: "연립방정식 x+y=5, 2x-y=1의 해를 구하시오.",
        examAnswer: "두 식을 더하면 3x=6, x=2, y=3이다.",
        examDistractors: [
          "x=3, y=2이다.",
          "두 식을 빼면 x=4이다.",
          "가감법으로는 풀 수 없다.",
        ],
      },
    ],
  },
  {
    id: "high-sci-chunjae",
    schoolLevel: "고등",
    grade: "고1",
    subject: "과학",
    publisher: "천재교육",
    textbookName: "통합과학",
    description: "물질의 규칙성과 에너지 단원을 교과서 근거로 답하는 과학 챗봇",
    distributionLabel: "시드 데이터",
    activeStudents: 0,
    starterPrompts: [
      "원소의 주기적 성질이 뭐야?",
      "화학 결합의 종류를 교과서 기준으로 설명해줘.",
      "역학적 에너지 보존 법칙이 뭐야?",
    ],
    sections: [
      {
        id: "sci-periodic",
        title: "물질의 규칙성과 결합",
        pages: "12-38쪽",
        summary: "원소의 주기율, 화학 결합(이온/공유), 분자 구조를 다루는 단원입니다.",
        explanation: "교과서에서는 주기율표에서 같은 족 원소가 비슷한 성질을 가지는 이유를 원자가 전자로 설명하고, 이온 결합과 공유 결합의 차이를 전자 이동/공유로 구분합니다.",
        keywords: ["주기율표", "원자가 전자", "이온 결합", "공유 결합", "전기음성도", "분자 구조"],
        misconceptionTags: [
          "이온 결합과 공유 결합을 물질의 상태로 구분하려 함",
          "전자를 잃으면 음이온이라고 생각함 (반대)",
        ],
        questionSeeds: [
          "이온 결합과 공유 결합의 차이를 전자 관점에서 설명해보세요.",
          "같은 족 원소가 비슷한 성질을 가지는 이유를 말해보세요.",
        ],
        citationFocus: "주기율표 전자 배치도, 이온/공유 결합 비교 표",
        teacherBridge: "NaCl(이온)과 H2O(공유)의 전자 이동/공유를 나란히 도식화합니다.",
        examStem: "이온 결합에 대한 설명으로 옳은 것은?",
        examAnswer: "금속 원소와 비금속 원소 사이에서 전자가 이동하여 형성된다.",
        examDistractors: [
          "같은 종류의 원소끼리만 형성된다.",
          "전자를 공유하여 형성된다.",
          "기체 상태에서만 존재한다.",
        ],
      },
      {
        id: "sci-energy",
        title: "역학적 에너지와 열",
        pages: "92-118쪽",
        summary: "운동 에너지, 위치 에너지, 역학적 에너지 보존, 열의 이동을 다루는 단원입니다.",
        explanation: "교과서에서는 운동 에너지(1/2mv^2)와 위치 에너지(mgh)의 합이 보존되는 원리를 자유 낙하와 진자 운동 예시로 설명합니다.",
        keywords: ["운동 에너지", "위치 에너지", "역학적 에너지 보존", "열", "전도", "대류", "복사"],
        misconceptionTags: [
          "속력이 2배가 되면 운동 에너지도 2배라고 생각함 (실제는 4배)",
          "열과 온도를 같은 개념으로 혼동함",
        ],
        questionSeeds: [
          "자유 낙하에서 역학적 에너지가 보존되는 과정을 단계별로 설명해보세요.",
          "열과 온도의 차이를 자기 말로 설명해보세요.",
        ],
        citationFocus: "자유 낙하 에너지 변환 그래프, 열 이동 3가지 방식",
        teacherBridge: "롤러코스터 모형으로 높이별 에너지 변환을 시각화합니다.",
        examStem: "높이 10m에서 2kg 물체를 자유 낙하시킬 때, 바닥에 도달하는 순간의 운동 에너지는? (g=10m/s^2)",
        examAnswer: "위치 에너지 mgh=2×10×10=200J이 모두 운동 에너지로 전환되므로 200J이다.",
        examDistractors: [
          "100J이다.",
          "위치 에너지와 운동 에너지는 무관하다.",
          "운동 에너지는 속력에 비례하므로 20J이다.",
        ],
      },
    ],
  },
  {
    id: "mid3-math-bisang",
    schoolLevel: "중등",
    grade: "중3",
    subject: "수학",
    publisher: "비상교육",
    textbookName: "수학 3",
    description: "이차방정식과 이차함수를 교과서 근거로 답하는 수학 챗봇",
    distributionLabel: "시드 데이터",
    activeStudents: 0,
    starterPrompts: [
      "인수분해로 이차방정식 어떻게 풀어?",
      "이차함수 그래프의 꼭짓점을 어떻게 구해?",
      "피타고라스 정리가 뭐야?",
    ],
    sections: [
      {
        id: "mid3-quadratic-eq",
        title: "이차방정식",
        pages: "46-68쪽",
        summary: "인수분해를 이용한 이차방정식 풀이와 근의 공식을 다루는 단원입니다.",
        explanation: "교과서에서는 ax^2+bx+c=0 형태에서 인수분해가 되면 각 인수를 0으로 놓아 근을 구하고, 안 되면 근의 공식을 사용하도록 안내합니다.",
        keywords: ["이차방정식", "인수분해", "근의 공식", "판별식", "중근", "근"],
        misconceptionTags: [
          "인수분해 후 각 인수를 0으로 놓는 이유를 모름",
          "근의 공식에서 부호 실수가 잦음",
        ],
        questionSeeds: [
          "x^2-5x+6=0을 인수분해로 풀 때, 왜 각 괄호를 0으로 놓는지 설명해보세요.",
          "근의 공식을 외우지 않고 유도하는 과정을 말해보세요.",
        ],
        citationFocus: "인수분해 풀이 과정, 근의 공식 유도",
        teacherBridge: "인수분해와 근의 공식을 같은 문제에 적용해 결과가 같음을 보여줍니다.",
        examStem: "이차방정식 x^2-5x+6=0의 두 근을 구하시오.",
        examAnswer: "(x-2)(x-3)=0이므로 x=2 또는 x=3이다.",
        examDistractors: [
          "x=5, x=6이다.",
          "x=-2, x=-3이다.",
          "인수분해가 되지 않으므로 근의 공식을 사용해야 한다.",
        ],
      },
      {
        id: "mid3-pythagorean",
        title: "피타고라스 정리",
        pages: "104-126쪽",
        summary: "직각삼각형에서 세 변의 관계(a^2+b^2=c^2)와 활용을 다루는 단원입니다.",
        explanation: "교과서에서는 직각삼각형의 빗변 길이를 구하는 공식과 역도 성립(세 변이 조건을 만족하면 직각삼각형)함을 설명합니다.",
        keywords: ["피타고라스 정리", "직각삼각형", "빗변", "삼각형", "대각선"],
        misconceptionTags: [
          "어떤 변이 빗변인지 구분하지 못함 (가장 긴 변)",
          "피타고라스 정리를 직각삼각형이 아닌 곳에 적용함",
        ],
        questionSeeds: [
          "피타고라스 정리에서 c가 반드시 빗변이어야 하는 이유를 설명해보세요.",
          "정사각형의 대각선 길이를 피타고라스 정리로 구하는 과정을 말해보세요.",
        ],
        citationFocus: "피타고라스 정리 증명(넓이 비교), 좌표 위 거리 구하기",
        teacherBridge: "정사각형 넓이 비교로 피타고라스 정리를 시각적으로 증명합니다.",
        examStem: "직각삼각형의 두 변이 3, 4일 때 빗변의 길이는?",
        examAnswer: "3^2+4^2=9+16=25, 빗변=5이다.",
        examDistractors: [
          "빗변은 7이다 (3+4).",
          "빗변은 12이다 (3×4).",
          "두 변의 차인 1이다.",
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
