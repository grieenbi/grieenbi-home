export interface EssaySentence {
  id: string;
  author: string;
  content: string;
  likes: number;
  isBest?: boolean;
  createdAt: string;
}

export interface RelayPrompt {
  id: string;
  title: string;
  theme: string;
  description: string;
  createdAt: string;
  sentences: EssaySentence[];
}

export interface WorkshopComment {
  id: string;
  author: string;
  content: string;
  createdAt: string;
}

export interface WorkshopLog {
  id: string;
  status: 'writing' | 'brainstorming' | 'feedback';
  category: 'Essay' | 'Tech' | 'Novel';
  title: string;
  content: string;
  likes: number;
  comments: WorkshopComment[];
  createdAt: string;
}

export interface ArchiveArticle {
  id: string;
  category: 'Essay' | 'Tech' | 'Daily';
  title: string;
  description: string;
  content: string;
  readTime: string;
  date: string;
  gradient: string; /* CSS Gradient for high-aesthetic magazine feel */
}

export interface InspirationTip {
  id: string;
  title: string;
  content: string;
  helper: string;
  suggestedPrompt: string;
}

export interface InspirationDatabase {
  novel: InspirationTip[];
  essay: InspirationTip[];
  planning: InspirationTip[];
}

// Initial Data Source
export const initialRelayPrompt: RelayPrompt = {
  id: 'prompt-1',
  title: '이번 주의 문장 시작점',
  theme: '비가 개기 직전의 새벽 4시',
  description: '창가를 두드리던 마지막 빗소리가 멈추고, 나는 오랜 서랍 속에 깊이 숨겨두었던 낡은 놋쇠 열쇠를 꺼냈다...',
  createdAt: '2026-05-25',
  sentences: [
    {
      id: 's-1',
      author: '은유',
      content: '그 열쇠가 열 수 있는 것은 단 하나, 열지 말았어야 할 나의 1999년이었다.',
      likes: 42,
      isBest: true,
      createdAt: '2026-05-25T09:30:00Z'
    },
    {
      id: 's-2',
      author: '윤슬',
      content: '먼지를 털어내자 손끝에서 옅은 금속성의 온기가 피어올라 방을 메웠다.',
      likes: 18,
      createdAt: '2026-05-25T11:15:00Z'
    },
    {
      id: 's-3',
      author: '코드방랑자',
      content: '열쇠구멍에 밀어 넣자마자 들려온 건 차가운 쇠소리가 아닌, 누군가의 낯익은 콧노래 소리였다.',
      likes: 29,
      isBest: true,
      createdAt: '2026-05-26T02:40:00Z'
    },
    {
      id: 's-4',
      author: '여명',
      content: '서랍 밑바닥이 부드럽게 들리며, 빛바랜 일기장과 멈춰버린 회중시계가 모습을 드러냈다.',
      likes: 12,
      createdAt: '2026-05-26T18:22:00Z'
    }
  ]
};

export const initialWorkshopLogs: WorkshopLog[] = [
  {
    id: 'log-1',
    status: 'feedback',
    category: 'Essay',
    title: '신작 에세이 [디지털 고독과 책장의 먼지] 도입부 기획',
    content: '요즘 전자책 리더기만 쓰면서 정작 진짜 종이책들이 꽂힌 서재를 방치하고 있다는 걸 깨달았습니다. 도입부에서 "종이책의 먼지는 지식의 흔적이 아니라 방치의 훈장이다"라는 문장으로 시작하고 싶은데, 너무 냉소적일까요? 독자님들이 책장의 책을 만질 때 느끼는 촉감을 한 문장으로 보태주세요.',
    likes: 34,
    createdAt: '2026-05-27T08:00:00Z',
    comments: [
      {
        id: 'c-1',
        author: '은새',
        content: '종이책을 잡을 때 미세하게 스치는 바스락거림과 마른 나무 냄새는 어떤 태블릿에서도 줄 수 없는 "고유한 정착지" 같아요. 이 감각을 첫 장에 묘사하면 어떨까요?',
        createdAt: '2026-05-27T09:12:00Z'
      },
      {
        id: 'c-2',
        author: '북러버',
        content: '"먼지는 지식의 흔적이 아니라..." 문장 아주 임팩트 있고 좋습니다! 뒤이어 "그 먼지를 털어내는 행위 자체가 잠든 세계를 깨우는 일이다"라는 서정적인 반전이 뒤따르면 좋겠어요.',
        createdAt: '2026-05-27T10:05:00Z'
      }
    ]
  },
  {
    id: 'log-2',
    status: 'writing',
    category: 'Tech',
    title: 'CSS 그리드 프레임으로 매거진 룩 최적화하기',
    content: '이번 Grieenbi\'s Studio 웹사이트를 개발하면서 얇은 프레임 보더라인을 격자 형태로 디자인 중입니다. border-collapse를 유도하듯 격자가 어긋나지 않게 display: grid와 outline을 활용해 깔끔한 구조를 잡는 테크니컬 스니펫을 정리하고 있습니다. 1px의 오차 없이 모바일 반응형에서 컬럼을 재배열할 때 보더라인이 겹치지 않게 하는 깔끔한 해결책을 고민 중입니다.',
    likes: 21,
    createdAt: '2026-05-26T14:30:00Z',
    comments: [
      {
        id: 'c-3',
        author: 'DevPark',
        content: '부모 컨테이너에 gap: 1px을 주고 배경을 grid-line 컬러로 잡은 뒤, 각 자식 셀의 배경을 primary-bg로 채우면 겹치는 테두리 문제 없이 초정밀 1px 라인이 잡힙니다! 이 방식이 제일 깔끔해요.',
        createdAt: '2026-05-26T15:20:00Z'
      }
    ]
  },
  {
    id: 'log-3',
    status: 'brainstorming',
    category: 'Novel',
    title: '단편 소설 [알고리즘의 밀실] 반전 아이디어 스케치',
    content: '자신이 개발한 매칭 알고리즘이 예측한 완벽한 짝을 찾아갔으나, 알고 보니 상대방 역시 자신이 조작한 가짜 프로필이었다는 반전을 구상 중입니다. "인간은 완벽한 규칙을 원하지만, 사랑에 빠지는 건 오류의 틈새다"라는 주제의식입니다. 이 시점에서 주인공의 뒤통수를 칠 만한 더 극적인 서사 장치가 있을까요?',
    likes: 45,
    createdAt: '2026-05-25T11:00:00Z',
    comments: [
      {
        id: 'c-4',
        author: '스토리텔러',
        content: '사실 매칭된 상대는 사람이 아니라, 알고리즘 스스로가 완벽해지기 위해 만들어낸 초고도화된 AI 자아였다는 반전은 어떨까요? 거울을 보듯 기괴한 매력을 줄 수 있어요.',
        createdAt: '2026-05-25T13:45:00Z'
      }
    ]
  }
];

export const initialArchiveArticles: ArchiveArticle[] = [
  {
    id: 'art-1',
    category: 'Essay',
    title: '어둠을 정제하여 글을 쓰는 일에 대하여',
    description: '우리는 왜 굳이 슬픔과 외로움을 끄집어내어 문장이라는 질서 속에 가두려 하는가. 에세이 창작의 근원에 관한 성찰.',
    content: '에세이를 쓴다는 것은 자신의 방 한구석에 가라앉은 먼지와 어둠을 쓸어 담아, 투명한 유리병에 담아내는 일과 같다. 그 유리병에 햇빛이 닿을 때, 비로소 어둠은 정제된 투명함을 띠게 된다.\n\n때로 우리는 타인에게 보이기 부끄러운 상처들을 굳이 꺼내어 문장으로 다듬는다. 그것은 자기 연민이 아니다. 내 상처를 정교하게 깎아내어 하나의 보편적인 조각으로 재탄생시킬 때, 저 먼 곳에서 나와 같은 어둠을 앓던 누군가가 그 조각을 쥐고 작은 위안을 얻기 때문이다.\n\n글을 쓴다는 것은 결국 고독을 나눔으로써 서로의 고독을 덜어내는 모순적인 연대의 행위다. 그러니 오늘도 펜을 드는 창작자들이여, 당신의 새벽을 두려워하지 말라.',
    readTime: '4 min read',
    date: 'May 24, 2026',
    gradient: 'linear-gradient(135deg, #0F4C3A 0%, #1A3E3D 100%)'
  },
  {
    id: 'art-2',
    category: 'Tech',
    title: '모던 웹과 2026년의 마이크로 애니메이션 미학',
    description: '단순한 화려함이 아닌, 사용자 맥락과 조화를 이루는 초감각 마이크로 인터랙션 구현 원칙과 코드 패턴 분석.',
    content: '인터랙티브 웹 디자인에서 가장 흔히 저지르는 실수는 지나치게 크고 역동적인 애니메이션으로 화면을 뒤덮는 것이다. 2026년의 모던 웹은 "눈에 띄지 않지만 완벽하게 느껴지는" 마이크로 인터랙션(Micro-interactions)을 지향한다.\n\n가장 좋은 애니메이션은 사용자가 무언가를 조작할 때 물 흐르듯 자연스럽게 흐르는 물리 법칙을 모사하는 것이다. Framer Motion이나 CSS Transitions를 사용할 때, 단순히 cubic-bezier를 조율하는 것을 넘어 호버의 깊이, 스프링(Spring)의 탄성, 폰트 굵기 변화의 찰나 등을 미세하게 튜닝해야 한다.\n\n이번 디자인 가이드에서는 CSS 변수를 프런트 프레임워크와 유기적으로 결합하여, 사이트의 조도를 바꾸듯 테마를 전환하고, 마우스 포인트의 흐름을 쫓아 선이 드로잉되는 프리미엄 타이포그래피 애니메이션 기법을 다룬다.',
    readTime: '6 min read',
    date: 'May 22, 2026',
    gradient: 'linear-gradient(135deg, #FF4C29 0%, #FF8A00 100%)'
  },
  {
    id: 'art-3',
    category: 'Daily',
    title: '완벽한 커피 한 잔을 위한 서투른 의식',
    description: '핸드드립 필터 위에 끓는 물을 붓는 3분의 시간 동안, 머릿속의 어지러운 생각들을 드립 서버 아래로 걸러내는 조용한 일상.',
    content: '매일 아침 8시, 물을 끓이고 원두를 간다. 손끝으로 전해지는 그라인더의 묵직한 마찰음과 주방을 메우는 쌉싸름한 향기는 하루 중 내가 온전히 지배할 수 있는 가장 고요한 영역이다.\n\n뜨거운 물이 원두 가루 위에 닿을 때 부풀어 오르는 커피 빵(Coffee bloom)을 지켜보는 것은 묘한 안도감을 준다. 커피가 드립 서버 아래로 똑똑 떨어지는 3분간, 나는 머릿속을 부유하는 오늘의 할 일과 막연한 불안들을 원두 가루 속에 묻어버린다.\n\n서투르게 걸러진 내 드립 커피는 전문 카페의 맛에는 미치지 못할지 모른다. 그러나 이 서투른 아침의 의식이야말로 숨 가쁜 일상 속에서 나를 땅에 딛게 만드는 단단한 정박지 역할을 해준다. 당신에게는 그런 아침의 의식이 있는가?',
    readTime: '3 min read',
    date: 'May 20, 2026',
    gradient: 'linear-gradient(135deg, #2E303A 0%, #16171D 100%)'
  }
];

export const initialInspirationDatabase: InspirationDatabase = {
  novel: [
    {
      id: 'n-tip-1',
      title: '관점의 배신 (신뢰할 수 없는 화자)',
      content: '이야기의 주인공이자 독자가 가장 신뢰하던 관찰자 스스로가 사실 사건의 주동자이거나, 기억의 왜곡을 겪고 있음을 서서히 드러냅니다.',
      helper: '단서 흘리기: 주인공이 사소하게 숨긴 행동이 뒤이어 다른 인물의 증언과 미세하게 어긋나게 만드세요.',
      suggestedPrompt: '나는 거울 속에 비친 나를 보고 미소를 지었지만, 거울 밖의 나는 울고 있었다. 왜냐하면...'
    },
    {
      id: 'n-tip-2',
      title: '맥거핀의 역습',
      content: '극의 초반부터 모두가 중요하다고 믿었던 물건이나 미스터리가 실은 아무것도 아니며, 진짜 위협은 가장 평범한 배경 속에 숨어 있었습니다.',
      helper: '초점 유도: 인물들이 온 힘을 다해 쫓던 열쇠가 맞지 않는 순간, 잠기지 않은 뒷문을 비추세요.',
      suggestedPrompt: '평생을 쫓아온 설계도가 가짜라는 걸 알았을 때, 내 손에 들려 있던 건...'
    },
    {
      id: 'n-tip-3',
      title: '관계의 전도 (적과의 연대)',
      content: '가장 든든한 조력자라고 생각했던 인물이 사실은 숨겨진 감시자였고, 가장 극렬하게 대립하던 적대자가 사실은 주인공을 살리려던 유일한 아군임이 밝혀집니다.',
      helper: '감정선 꼬기: 적대자가 남긴 사소한 경고 문구들이 사실은 다가올 함정들로부터 탈출할 지도였음을 보여줍니다.',
      suggestedPrompt: '그가 나를 향해 총구를 겨누었을 때, 그의 눈동자 속에 비친 건 내 등 뒤의 칼날이었다.'
    }
  ],
  essay: [
    {
      id: 'e-tip-1',
      title: '감각의 극대화로 오프닝 열기',
      content: '단순히 인과관계를 설명하지 말고, 독자가 현장의 냄새, 소리, 차가움 등을 피부로 느끼게 하며 시작하세요.',
      helper: '예시: "나는 슬펐다" 대신 "내 손등 위로 떨어진 국물 한 방울이 식어가는 속도보다 빨리, 내 마음이 먼저 식어가고 있었다."',
      suggestedPrompt: '찬장에 부딪히는 컵 소리가 유난히 날카롭게 들리는 날에는, 묵혀둔 상처가...'
    },
    {
      id: 'e-tip-2',
      title: '평범한 사물에 철학 부여하기',
      content: '주변에 굴러다니는 연필, 신발 끈, 냉장고 소리 같은 평범한 일상의 오브제를 깊은 사유의 대리인으로 격상시킵니다.',
      helper: '오브제 추상화: 버려진 영수증 한 장이 가진 유통기한과 내 인간관계의 유통기한을 비교해 보세요.',
      suggestedPrompt: '풀린 신발 끈을 묶으며 생각했다. 팽팽하게 묶여 있던 우리의 시간도 이렇게 느슨하게...'
    },
    {
      id: 'e-tip-3',
      title: '솔직하고 발칙한 고백',
      content: '착하고 정의로운 모습이 아닌, 찌질하고 부끄러운 감정을 날것 그대로 먼저 고백하여 독자의 방어기제를 허물어 버리세요.',
      helper: '고백하기: 내가 남에게 잘 보이고 싶어 부렸던 우스꽝스러운 허세나 질투를 묘사해 봅니다.',
      suggestedPrompt: '나는 그가 실패하기를 바랐다. 그의 화려한 성공 앞에서 내가 너무 초라해질까 봐...'
    }
  ],
  planning: [
    {
      id: 'p-tip-1',
      title: '익숙한 도시의 미아 되기',
      content: '주말 하루 동안, 스마트폰 지도를 절대 켜지 않고 오직 발길이 이끄는 대로만 모르는 골목길을 정처 없이 걷는 모험.',
      helper: '규칙: 홀수 번째 모퉁이에서는 무조건 우회전, 짝수 번째는 좌회전하며 뜻밖의 독립 서점이나 카페를 찾아보세요.',
      suggestedPrompt: '휴대폰을 주머니 깊이 넣고, 오직 눈앞의 파란 지붕만을 쫓아 걷기로 했다.'
    },
    {
      id: 'p-tip-2',
      title: '나만의 오감 스크랩북 만들기',
      content: '주말 동안 수집한 영수증, 단풍잎, 거리에서 들은 음악 제목, 스쳐 지나간 사람의 문장을 한 권의 노트에 아날로그 방식으로 스크랩하는 활동.',
      helper: '수집물: 카페 영수증 밑에 그곳에서 느꼈던 공기와 온도를 짧게 연필로 적어 보세요.',
      suggestedPrompt: '오늘 길에서 주운 단풍잎 하나와 차가운 공기의 냄새를 이 페이지에 묵혀둔다.'
    },
    {
      id: 'p-tip-3',
      title: '새벽의 시적 탈출',
      content: '일요일 새벽 5시에 깨어나 가벼운 텀블러만 들고 가장 가까운 야산이나 강변으로 나가 해돋이를 보고 첫 버스를 타는 루틴.',
      helper: '몰입 포인트: 모두가 잠든 시간에 혼자 세상의 아침을 여는 고독과 해방감을 사진과 한 줄 글로 남겨보세요.',
      suggestedPrompt: '첫 차의 창문 틈으로 들어온 이른 아침의 공기는 차가웠지만, 내 눈앞에 펼쳐진 여명은...'
    }
  ]
};
