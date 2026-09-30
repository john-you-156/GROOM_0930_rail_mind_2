import { describe, expect, it } from 'vitest';
import { reflectionFlows } from './data';
import { buildPublicText, chooseStationName, containsCrisisExpression } from './rules';

describe('마음역 규칙 엔진', () => {
  it('감정 강도에 따라 정의된 역 이름을 고른다', () => {
    const flow = reflectionFlows.anxious;
    expect(chooseStationName(flow, 1)).toBe('안개역');
    expect(chooseStationName(flow, 3)).toBe('기다림역');
    expect(chooseStationName(flow, 5)).toBe('숨고르기역');
  });

  it('범위를 벗어난 강도를 안전하게 제한한다', () => {
    expect(chooseStationName(reflectionFlows.calm, -2)).toBe('고요역');
    expect(chooseStationName(reflectionFlows.calm, 20)).toBe('잔잔역');
  });

  it('공개용 결과 문장을 정해진 템플릿으로 조합한다', () => {
    expect(buildPublicText('쉼표역', '조용한 시간')).toBe(
      '오늘의 마음역은 쉼표역.\n지금 나에게 필요한 것은 조용한 시간입니다.',
    );
  });

  it('도움 안내가 필요한 표현을 감지한다', () => {
    expect(containsCrisisExpression('요즘 죽고 싶다는 생각이 들어요')).toBe(true);
    expect(containsCrisisExpression('오늘은 조금 피곤해요')).toBe(false);
  });
});

