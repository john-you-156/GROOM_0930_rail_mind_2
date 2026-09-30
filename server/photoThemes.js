export const emotionPhotoThemes = {
  calm: [
    { label: '고요한 자연', query: 'quiet water minimal landscape' },
    { label: '따뜻한 공간', query: 'cozy interior soft window light peaceful' },
    { label: '느린 여정', query: 'quiet train journey countryside window' },
    { label: '사람과 쉼', query: 'person resting peaceful morning light' },
  ],
  joy: [
    { label: '환한 사람들', query: 'friends laughing outdoors diverse candid' },
    { label: '선명한 색', query: 'colorful street joyful vibrant' },
    { label: '빛과 꽃', query: 'sunlit flowers vibrant garden' },
    { label: '경쾌한 추상', query: 'playful colorful abstract shapes' },
  ],
  excited: [
    { label: '출발의 순간', query: 'train platform departure travel anticipation' },
    { label: '도시의 움직임', query: 'city lights motion energetic night' },
    { label: '열린 길', query: 'open road mountain sunrise adventure' },
    { label: '새로운 발견', query: 'traveler exploring new place candid' },
  ],
  tired: [
    { label: '포근한 쉼', query: 'cozy bed soft blanket quiet room' },
    { label: '비 오는 창가', query: 'rain on window quiet evening' },
    { label: '잠시 멈춤', query: 'person resting on sofa peaceful' },
    { label: '비어 있는 좌석', query: 'empty train seat window quiet journey' },
  ],
  stuck: [
    { label: '열린 문', query: 'open doorway light minimal architecture' },
    { label: '넓은 수평선', query: 'wide ocean horizon breathing space' },
    { label: '숲의 출구', query: 'path through forest clearing light' },
    { label: '이어지는 선로', query: 'train tracks distance journey landscape' },
  ],
  anxious: [
    { label: '안개 속 길', query: 'gentle fog path quiet landscape' },
    { label: '잔잔한 빗물', query: 'soft rain window reflection blue' },
    { label: '물결과 호흡', query: 'abstract water ripples soft blue' },
    { label: '창가의 사람', query: 'person by window calm breathing' },
  ],
  lonely: [
    { label: '혼자 걷는 사람', query: 'solitary person wide landscape walking' },
    { label: '고요한 역', query: 'empty train station quiet cinematic' },
    { label: '한 자리의 빛', query: 'single chair window light minimal room' },
    { label: '먼 곳의 등대', query: 'distant lighthouse ocean solitude' },
  ],
  angry: [
    { label: '거친 파도', query: 'stormy ocean waves dramatic' },
    { label: '붉은 움직임', query: 'red abstract texture motion' },
    { label: '쏟아지는 비', query: 'heavy rain city window intense' },
    { label: '바람 부는 산', query: 'rugged mountain strong wind landscape' },
  ],
  unknown: [
    { label: '빛의 반사', query: 'abstract reflection glass light' },
    { label: '갈림길', query: 'crossroads path landscape choice' },
    { label: '흐르는 풍경', query: 'train window blurred scenery journey' },
    { label: '빛과 그림자', query: 'shadows light minimal interior' },
  ],
};

export function getEmotionThemes(emotionId) {
  return emotionPhotoThemes[emotionId] || emotionPhotoThemes.unknown;
}

export function selectThemeQueries(emotionId, variation = 0) {
  const themes = getEmotionThemes(emotionId);
  const safeVariation = Math.max(0, Number.parseInt(variation, 10) || 0);
  const first = safeVariation % themes.length;
  const second = (first + Math.ceil(themes.length / 2)) % themes.length;
  return [themes[first].query, themes[second].query];
}
