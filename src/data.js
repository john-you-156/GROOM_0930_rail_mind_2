export const emotions = [
  { id: 'calm', label: '평온함', icon: '◌', tone: '#5c8073' },
  { id: 'joy', label: '기쁨', icon: '✦', tone: '#d29242' },
  { id: 'excited', label: '설렘', icon: '↗', tone: '#d17a68' },
  { id: 'tired', label: '피곤함', icon: '–', tone: '#7d7b91' },
  { id: 'stuck', label: '답답함', icon: '□', tone: '#967260' },
  { id: 'anxious', label: '불안함', icon: '≈', tone: '#6d809b' },
  { id: 'lonely', label: '외로움', icon: '○', tone: '#788797' },
  { id: 'angry', label: '화남', icon: '△', tone: '#a66157' },
  { id: 'unknown', label: '잘 모르겠음', icon: '…', tone: '#777d78' },
];

export const samplePhotos = [
  {
    id: 'sample-fog',
    url: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=85',
    thumb: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=640&q=80',
    alt: '안개가 흐르는 산과 호수',
    label: '안개 너머의 호수',
    photographerName: 'Unsplash contributor',
    photographerUrl: 'https://unsplash.com/?utm_source=maeum_station&utm_medium=referral',
    downloadLocation: null,
    moods: ['anxious', 'unknown', 'calm'],
  },
  {
    id: 'sample-forest',
    url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=85',
    thumb: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=640&q=80',
    alt: '햇살이 들어오는 초록 숲',
    label: '천천히 빛나는 숲',
    photographerName: 'Unsplash contributor',
    photographerUrl: 'https://unsplash.com/?utm_source=maeum_station&utm_medium=referral',
    downloadLocation: null,
    moods: ['calm', 'tired', 'joy'],
  },
  {
    id: 'sample-ocean',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85',
    thumb: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=640&q=80',
    alt: '잔잔한 푸른 바다와 하늘',
    label: '멀리 열린 바다',
    photographerName: 'Unsplash contributor',
    photographerUrl: 'https://unsplash.com/?utm_source=maeum_station&utm_medium=referral',
    downloadLocation: null,
    moods: ['stuck', 'calm', 'lonely'],
  },
  {
    id: 'sample-rain',
    url: 'https://images.unsplash.com/photo-1519692933481-e162a57d6721?auto=format&fit=crop&w=1200&q=85',
    thumb: 'https://images.unsplash.com/photo-1519692933481-e162a57d6721?auto=format&fit=crop&w=640&q=80',
    alt: '비가 내리는 창가',
    label: '비가 머무는 창가',
    photographerName: 'Unsplash contributor',
    photographerUrl: 'https://unsplash.com/?utm_source=maeum_station&utm_medium=referral',
    downloadLocation: null,
    moods: ['lonely', 'tired', 'unknown'],
  },
  {
    id: 'sample-sunrise',
    url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=85',
    thumb: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=640&q=80',
    alt: '따뜻한 햇빛이 비치는 풍경',
    label: '다시 시작되는 빛',
    photographerName: 'Unsplash contributor',
    photographerUrl: 'https://unsplash.com/?utm_source=maeum_station&utm_medium=referral',
    downloadLocation: null,
    moods: ['joy', 'excited', 'tired'],
  },
  {
    id: 'sample-storm',
    url: 'https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&w=1200&q=85',
    thumb: 'https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&w=640&q=80',
    alt: '짙은 구름 아래 거친 풍경',
    label: '흔들리는 날의 하늘',
    photographerName: 'Unsplash contributor',
    photographerUrl: 'https://unsplash.com/?utm_source=maeum_station&utm_medium=referral',
    downloadLocation: null,
    moods: ['angry', 'stuck', 'anxious'],
  },
];

export const reflectionFlows = {
  anxious: {
    question: '아직 일어나지 않았지만 마음을 차지하고 있는 일이 있나요?',
    needs: ['확실한 정보', '잠깐의 휴식', '계획 한 가지', '누군가의 도움'],
    stations: ['안개역', '기다림역', '숨고르기역'],
  },
  stuck: {
    question: '지금 무엇이 막혀 있다고 느껴지나요?',
    needs: ['생각 정리', '잠시 거리두기', '솔직한 표현', '도움 요청'],
    stations: ['갈림길역', '잠시멈춤역', '틈새역'],
  },
  tired: {
    question: '몸의 피로와 마음의 피로 중 어느 쪽이 더 크게 느껴지나요?',
    needs: ['충분한 수면', '조용한 시간', '식사와 물', '일정 줄이기'],
    stations: ['쉼표역', '느린역', '오늘도착역'],
  },
  lonely: {
    question: '혼자라는 느낌과 이해받지 못한다는 느낌 중 어디에 더 가까운가요?',
    needs: ['누군가에게 연락', '조용한 동행', '공감받기', '혼자 쉴 공간'],
    stations: ['연결역', '온기역', '곁역'],
  },
  angry: {
    question: '어떤 일이 나의 기준이나 경계를 건드렸나요?',
    needs: ['잠시 거리두기', '감정 표현', '경계 세우기', '사실 정리'],
    stations: ['거리두기역', '경계역', '식힘역'],
  },
  joy: {
    question: '이 마음을 만들어 준 순간은 무엇인가요?',
    needs: ['기록하기', '누군가와 나누기', '감사하기', '충분히 즐기기'],
    stations: ['햇살역', '반짝임역', '간직역'],
  },
  excited: {
    question: '이 설렘에서 가장 기대되는 것은 무엇인가요?',
    needs: ['기록하기', '첫걸음 정하기', '누군가와 나누기', '그대로 즐기기'],
    stations: ['출발역', '두근역', '새길역'],
  },
  calm: {
    question: '오늘의 평온을 만들어 준 것은 무엇인가요?',
    needs: ['이대로 유지하기', '천천히 쉬기', '감사 기록', '내일도 이어가기'],
    stations: ['고요역', '머무름역', '잔잔역'],
  },
  unknown: {
    question: '지금 마음을 날씨로 표현한다면 어떤 모습일까요?',
    needs: ['이름 붙일 시간', '잠깐의 휴식', '누군가와 대화', '그냥 머물기'],
    stations: ['이름없는역', '흐린역', '천천히역'],
  },
};

export const actions = [
  { id: 'water', label: '물 한 잔 천천히 마시기', icon: '◒' },
  { id: 'breathe', label: '3분 동안 천천히 호흡하기', icon: '〰' },
  { id: 'walk', label: '5분 동안 주변 걷기', icon: '→' },
  { id: 'write', label: '내일 할 일 하나만 적기', icon: '✎' },
  { id: 'contact', label: '믿을 수 있는 사람에게 연락하기', icon: '◎' },
  { id: 'pause', label: '중요한 결정은 오늘 잠시 미루기', icon: 'Ⅱ' },
];

export const crisisPatterns = [
  /죽고\s*싶/i,
  /자살/i,
  /해치고\s*싶/i,
  /살기\s*싫/i,
  /끝내고\s*싶/i,
];

export const emotionSearchTerms = {
  calm: 'calm nature',
  joy: 'warm sunlight',
  excited: 'open road sunrise',
  tired: 'quiet evening nature',
  stuck: 'open ocean horizon',
  anxious: 'foggy landscape',
  lonely: 'rain window solitude',
  angry: 'storm clouds landscape',
  unknown: 'abstract nature',
};

