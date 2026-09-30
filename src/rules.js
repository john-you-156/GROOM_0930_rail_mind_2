import { crisisPatterns } from './data';

export function containsCrisisExpression(text = '') {
  return crisisPatterns.some((pattern) => pattern.test(text.trim()));
}

export function chooseStationName(flow, intensity = 3) {
  if (!flow?.stations?.length) return '천천히역';
  const safeIntensity = Math.max(1, Math.min(Number(intensity) || 3, 5));
  const index = Math.min(Math.floor((safeIntensity - 1) / 2), flow.stations.length - 1);
  return flow.stations[index];
}

export function buildPublicText(stationName, need) {
  return `오늘의 마음역은 ${stationName}.\n지금 나에게 필요한 것은 ${need}입니다.`;
}

