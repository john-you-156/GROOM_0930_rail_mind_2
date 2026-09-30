import { useEffect, useRef, useState } from 'react';
import {
  actions,
  emotions,
  reflectionFlows,
  samplePhotos,
} from './data';
import {
  clearRecords,
  createId,
  deleteRecord,
  fetchPhotos,
  loadRecords,
  saveRecord,
  supportsSpeechRecognition,
  trackDownload,
} from './services';
import { buildPublicText, chooseStationName, containsCrisisExpression } from './rules';

const initialSession = () => ({
  id: createId(),
  startedAt: new Date().toISOString(),
  emotions: [],
  intensity: 3,
  photo: null,
  photoReason: '',
  reflection: '',
  need: '',
  action: null,
  stationName: '',
  publicText: '',
});

const steps = ['감정', '장면', '성찰', '행동', '도착'];

function App() {
  const [view, setView] = useState('home');
  const [step, setStep] = useState(0);
  const [session, setSession] = useState(initialSession);
  const [records, setRecords] = useState(loadRecords);
  const [showHelp, setShowHelp] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(''), 2400);
    return () => clearTimeout(timer);
  }, [toast]);

  const start = () => {
    setSession(initialSession());
    setStep(0);
    setView('journey');
  };

  const reset = () => {
    setView('home');
    setStep(0);
    setSession(initialSession());
  };

  const selectedEmotion = emotions.find((item) => item.id === session.emotions[0]) || emotions[8];

  const saveCurrent = () => {
    const record = { ...session, completedAt: new Date().toISOString() };
    setRecords(saveRecord(record));
    setToast('이 기기에 마음 기록을 저장했어요.');
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="brand" onClick={reset} aria-label="마음역 홈으로">
          <span className="brand-mark">ㅁ</span>
          <span>마음역</span>
        </button>
        <nav>
          <button onClick={() => setView('history')}>나의 기록</button>
          <button onClick={() => setShowHelp(true)}>도움받기</button>
        </nav>
      </header>

      <main>
        {view === 'home' && <Home onStart={start} recordsCount={records.length} />}
        {view === 'journey' && (
          <Journey
            step={step}
            setStep={setStep}
            session={session}
            setSession={setSession}
            selectedEmotion={selectedEmotion}
            onSave={saveCurrent}
            onShare={() => setView('share')}
            onHelp={() => setShowHelp(true)}
            onFinish={reset}
          />
        )}
        {view === 'share' && (
          <ShareCard
            session={session}
            setSession={setSession}
            selectedEmotion={selectedEmotion}
            onBack={() => setView('journey')}
            onToast={setToast}
          />
        )}
        {view === 'history' && (
          <History
            records={records}
            onBack={() => setView('home')}
            onDelete={(id) => setRecords(deleteRecord(id))}
            onClear={() => setRecords(clearRecords())}
          />
        )}
      </main>

      <footer className="footer-note">
        마음역은 진단이나 치료를 제공하지 않는 자기성찰 도구입니다.
      </footer>

      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  );
}

function Home({ onStart, recordsCount }) {
  return (
    <section className="home-page page-enter">
      <div className="hero-copy">
        <span className="eyebrow">나를 향해 천천히 가는 시간</span>
        <h1>지금, 당신의 마음은<br /><em>어느 역</em>에 머물러 있나요?</h1>
        <p>
          한 장의 사진을 고르고, 짧은 질문에 답해보세요.<br />
          정답 없이도 마음은 조금씩 모습을 드러냅니다.
        </p>
        <button className="primary-button hero-button" onClick={onStart}>
          마음 여행 시작하기 <span>→</span>
        </button>
        <div className="privacy-note"><span>◇</span> 기록은 이 기기에만 머물러요</div>
      </div>

      <div className="hero-visual" aria-hidden="true">
        <div className="sun-disc" />
        <div className="arch arch-back" />
        <div className="arch arch-front">
          <div className="track-line"><i /><i /><i /><i /><i /></div>
        </div>
        <div className="station-sign">
          <span>오늘의 플랫폼</span>
          <strong>{recordsCount ? `${recordsCount}개의 마음 기록` : '첫 마음 여행'}</strong>
        </div>
      </div>

      <div className="home-cards">
        <article><span>01</span><strong>마음을 고르고</strong><p>지금과 가까운 감정을 선택해요.</p></article>
        <article><span>02</span><strong>장면을 만나고</strong><p>마음과 닮은 사진 한 장을 골라요.</p></article>
        <article><span>03</span><strong>천천히 도착해요</strong><p>작은 다음 행동을 정해보세요.</p></article>
      </div>
    </section>
  );
}

function Journey({
  step,
  setStep,
  session,
  setSession,
  selectedEmotion,
  onSave,
  onShare,
  onHelp,
  onFinish,
}) {
  const update = (values) => setSession((current) => ({ ...current, ...values }));
  const next = () => setStep((current) => Math.min(current + 1, steps.length - 1));
  const back = () => setStep((current) => Math.max(current - 1, 0));

  return (
    <section className="journey-page page-enter">
      <div className="journey-head">
        <button className="text-button" onClick={step === 0 ? onFinish : back}>← {step === 0 ? '홈' : '이전'}</button>
        <button className="help-link" onClick={onHelp}>도움이 필요해요</button>
      </div>
      <Progress current={step} />

      {step === 0 && <EmotionStep session={session} update={update} onNext={next} />}
      {step === 1 && <PhotoStep session={session} update={update} onNext={next} selectedEmotion={selectedEmotion} />}
      {step === 2 && <ReflectionStep session={session} update={update} onNext={next} selectedEmotion={selectedEmotion} onHelp={onHelp} />}
      {step === 3 && <ActionStep session={session} update={update} onNext={next} selectedEmotion={selectedEmotion} />}
      {step === 4 && (
        <ResultStep
          session={session}
          selectedEmotion={selectedEmotion}
          onSave={onSave}
          onShare={onShare}
          onFinish={onFinish}
        />
      )}
    </section>
  );
}

function Progress({ current }) {
  return (
    <ol className="progress" aria-label="마음 여행 진행 단계">
      {steps.map((item, index) => (
        <li key={item} className={index <= current ? 'active' : ''} aria-current={index === current ? 'step' : undefined}>
          <span>{index + 1}</span><small>{item}</small>
        </li>
      ))}
    </ol>
  );
}

function EmotionStep({ session, update, onNext }) {
  const toggleEmotion = (id) => {
    const exists = session.emotions.includes(id);
    if (exists) update({ emotions: session.emotions.filter((item) => item !== id) });
    else if (session.emotions.length < 3) update({ emotions: [...session.emotions, id] });
  };

  return (
    <div className="step-card narrow-card">
      <span className="step-kicker">첫 번째 정거장</span>
      <h2>지금 마음에 가까운<br />단어는 무엇인가요?</h2>
      <p className="step-description">생각하지 말고 눈에 먼저 들어오는 단어를 골라보세요. 최대 3개까지 선택할 수 있어요.</p>
      <div className="emotion-grid">
        {emotions.map((emotion) => {
          const selected = session.emotions.includes(emotion.id);
          return (
            <button
              key={emotion.id}
              className={`emotion-chip ${selected ? 'selected' : ''}`}
              onClick={() => toggleEmotion(emotion.id)}
              style={{ '--emotion-color': emotion.tone }}
              aria-pressed={selected}
            >
              <span>{emotion.icon}</span>{emotion.label}
            </button>
          );
        })}
      </div>
      <div className="intensity-row">
        <div><strong>마음의 크기</strong><small>선택하지 않아도 괜찮아요</small></div>
        <div className="intensity-scale">
          {[1, 2, 3, 4, 5].map((value) => (
            <button key={value} className={session.intensity === value ? 'active' : ''} onClick={() => update({ intensity: value })}>{value}</button>
          ))}
        </div>
      </div>
      <button className="primary-button full-button" onClick={onNext} disabled={!session.emotions.length}>
        장면을 만나러 가기 <span>→</span>
      </button>
    </div>
  );
}

function PhotoStep({ session, update, onNext, selectedEmotion }) {
  const [photos, setPhotos] = useState(samplePhotos);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSample, setIsSample] = useState(true);

  const load = async (customQuery = '') => {
    setLoading(true);
    setError('');
    try {
      const result = await fetchPhotos(selectedEmotion.id, customQuery);
      setPhotos(result.photos);
      setIsSample(result.isSample);
    } catch (loadError) {
      setError(loadError.message);
      setPhotos(samplePhotos);
      setIsSample(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [selectedEmotion.id]);

  return (
    <div className="step-card wide-card">
      <span className="step-kicker">두 번째 정거장</span>
      <h2>지금 마음과 닮은<br />장면을 골라보세요</h2>
      <p className="step-description">사진은 마음을 판단하지 않아요. 그저 말보다 먼저 다가오는 장면을 선택해보세요.</p>
      <form className="photo-search" onSubmit={(event) => { event.preventDefault(); load(query); }}>
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="다른 장면 검색하기" aria-label="사진 검색어" />
        <button type="submit">검색</button>
      </form>
      {isSample && <div className="sample-banner">샘플 사진 모드 · 키를 연결하면 Unsplash 검색이 활성화됩니다</div>}
      {error && <div className="error-banner">{error} 샘플 사진을 보여드릴게요.</div>}
      {loading ? <div className="loading-grid"><i /><i /><i /><i /><i /><i /></div> : (
        <div className="photo-grid">
          {photos.map((photo) => (
            <figure key={photo.id} className={session.photo?.id === photo.id ? 'selected' : ''}>
              <button onClick={() => update({ photo })} aria-label={`${photo.alt} 선택`}>
                <img src={photo.thumb} alt={photo.alt} crossOrigin="anonymous" />
                <span className="photo-check">✓</span>
                <span className="photo-label">{photo.label}</span>
              </button>
              <figcaption>
                Photo by <a href={photo.photographerUrl} target="_blank" rel="noreferrer">{photo.photographerName}</a>
              </figcaption>
            </figure>
          ))}
        </div>
      )}
      <button className="primary-button full-button" onClick={onNext} disabled={!session.photo}>이 장면으로 이야기하기 <span>→</span></button>
    </div>
  );
}

function ReflectionStep({ session, update, onNext, selectedEmotion, onHelp }) {
  const [phase, setPhase] = useState(session.photoReason ? 1 : 0);
  const [listening, setListening] = useState(false);
  const [speechError, setSpeechError] = useState('');
  const flow = reflectionFlows[selectedEmotion.id] || reflectionFlows.unknown;
  const question = phase === 0 ? '이 장면의 어떤 부분이 지금 마음과 닮았나요?' : flow.question;
  const field = phase === 0 ? 'photoReason' : 'reflection';
  const value = session[field];

  const startListening = () => {
    setSpeechError('');
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) {
      setSpeechError('이 브라우저에서는 음성 입력을 지원하지 않아요. 텍스트로 적어주세요.');
      return;
    }
    const recognition = new Recognition();
    recognition.lang = 'ko-KR';
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setSpeechError('음성을 알아듣지 못했어요. 다시 말하거나 텍스트로 적어주세요.');
    recognition.onresult = (event) => update({ [field]: event.results[0][0].transcript });
    recognition.start();
  };

  const speakQuestion = () => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(question);
    utterance.lang = 'ko-KR';
    utterance.rate = 0.94;
    window.speechSynthesis.speak(utterance);
  };

  const proceed = () => {
    if (containsCrisisExpression(value)) {
      onHelp();
      return;
    }
    if (phase === 0) setPhase(1);
    else onNext();
  };

  return (
    <div className="reflection-layout">
      <div className="reflection-photo">
        <img src={session.photo?.url} alt={session.photo?.alt || ''} crossOrigin="anonymous" />
        <div className="photo-overlay" />
        <div className="photo-quote">“마음은 때로<br />장면으로 먼저 말해요.”</div>
      </div>
      <div className="step-card reflection-card">
        <span className="step-kicker">세 번째 정거장 · {phase + 1}/2</span>
        <div className="question-line">
          <h2>{question}</h2>
          <button className="sound-button" onClick={speakQuestion} aria-label="질문 음성으로 듣기">◖))</button>
        </div>
        <p className="step-description">잘 정리된 문장이 아니어도 괜찮아요. 지금 떠오르는 만큼만 적어보세요.</p>
        <textarea
          value={value}
          onChange={(event) => update({ [field]: event.target.value.slice(0, 500) })}
          placeholder="여기에 천천히 적어보세요..."
          rows="7"
        />
        <div className="textarea-meta"><span>{value.length}/500</span><span>답변은 이 기기에만 머물러요</span></div>
        <button className={`voice-button ${listening ? 'listening' : ''}`} onClick={startListening} type="button">
          <span>●</span> {listening ? '듣고 있어요…' : supportsSpeechRecognition() ? '마이크를 누르고 이야기하기' : '음성 입력 미지원'}
        </button>
        {speechError && <p className="inline-error">{speechError}</p>}
        <div className="step-actions">
          <button className="text-button" onClick={proceed}>건너뛰기</button>
          <button className="primary-button" onClick={proceed}>{phase === 0 ? '다음 질문' : '작은 행동 고르기'} <span>→</span></button>
        </div>
      </div>
    </div>
  );
}

function ActionStep({ session, update, onNext, selectedEmotion }) {
  const flow = reflectionFlows[selectedEmotion.id] || reflectionFlows.unknown;
  const selectedAction = session.action?.id;
  const complete = () => {
    const stationName = chooseStationName(flow, session.intensity);
    const publicText = buildPublicText(stationName, session.need);
    update({ stationName, publicText });
    onNext();
  };

  return (
    <div className="step-card narrow-card">
      <span className="step-kicker">네 번째 정거장</span>
      <h2>지금의 나에게<br />무엇이 필요할까요?</h2>
      <p className="step-description">문제를 모두 해결하기보다, 오늘 할 수 있는 가장 작은 방향을 골라보세요.</p>
      <div className="need-row">
        {flow.needs.map((need) => <button key={need} className={session.need === need ? 'selected' : ''} onClick={() => update({ need })}>{need}</button>)}
      </div>
      <h3 className="subheading">다음 정거장에서 해볼 작은 행동</h3>
      <div className="action-list">
        {actions.map((action) => (
          <button key={action.id} className={selectedAction === action.id ? 'selected' : ''} onClick={() => update({ action })}>
            <span>{action.icon}</span><strong>{action.label}</strong><i>{selectedAction === action.id ? '✓' : '○'}</i>
          </button>
        ))}
      </div>
      <button className="primary-button full-button" onClick={complete} disabled={!session.need || !session.action}>오늘의 마음역에 도착하기 <span>→</span></button>
    </div>
  );
}

function ResultStep({ session, selectedEmotion, onSave, onShare, onFinish }) {
  return (
    <div className="result-wrap page-enter">
      <span className="step-kicker">오늘의 마음 여행이 도착했어요</span>
      <h2>{session.stationName}</h2>
      <div className="ticket-card">
        <img src={session.photo?.url} alt={session.photo?.alt || ''} crossOrigin="anonymous" />
        <div className="ticket-gradient" />
        <div className="ticket-top"><span>MAEUM STATION</span><span>{new Date().toLocaleDateString('ko-KR')}</span></div>
        <div className="ticket-copy">
          <small>오늘 알아차린 마음</small>
          <strong>{selectedEmotion.label}</strong>
          <p>{session.photoReason || '말보다 먼저 다가온 장면을 잠시 바라보았습니다.'}</p>
        </div>
        <div className="ticket-next"><span>다음 정거장</span><strong>{session.action?.label}</strong></div>
      </div>
      <div className="result-summary">
        <div><span>지금 필요한 것</span><strong>{session.need}</strong></div>
        <div><span>내가 고른 작은 행동</span><strong>{session.action?.label}</strong></div>
      </div>
      <div className="result-actions">
        <button className="primary-button" onClick={onSave}>나만의 기록으로 저장</button>
        <button className="secondary-button" onClick={onShare}>공유용 마음 카드 만들기</button>
        <button className="text-button" onClick={onFinish}>저장하지 않고 마치기</button>
      </div>
    </div>
  );
}

function ShareCard({ session, setSession, selectedEmotion, onBack, onToast }) {
  const canvasRef = useRef(null);
  const [ratio, setRatio] = useState('portrait');
  const [overlay, setOverlay] = useState(48);
  const [grayscale, setGrayscale] = useState(false);
  const [privacyChecked, setPrivacyChecked] = useState(false);
  const dimensions = { portrait: [1080, 1350], square: [1080, 1080], landscape: [1200, 675] };

  const drawCard = async () => {
    const canvas = canvasRef.current;
    const [width, height] = dimensions[ratio];
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.src = session.photo?.url;
    await image.decode();
    const scale = Math.max(width / image.width, height / image.height);
    const drawWidth = image.width * scale;
    const drawHeight = image.height * scale;
    context.filter = grayscale ? 'grayscale(100%)' : 'none';
    context.drawImage(image, (width - drawWidth) / 2, (height - drawHeight) / 2, drawWidth, drawHeight);
    context.filter = 'none';
    const gradient = context.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, `rgba(24, 31, 28, ${overlay / 160})`);
    gradient.addColorStop(1, `rgba(18, 25, 22, ${overlay / 75})`);
    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);
    const padding = Math.round(width * 0.085);
    context.fillStyle = '#f5f0e5';
    context.font = `600 ${Math.round(width * 0.025)}px sans-serif`;
    context.fillText('MAEUM STATION', padding, padding);
    context.font = `700 ${Math.round(width * 0.075)}px serif`;
    context.fillText(session.stationName, padding, height * 0.55);
    context.font = `500 ${Math.round(width * 0.038)}px sans-serif`;
    drawWrappedText(context, session.publicText, padding, height * 0.64, width - padding * 2, width * 0.06);
    context.font = `400 ${Math.round(width * 0.018)}px sans-serif`;
    context.fillStyle = 'rgba(245,240,229,.78)';
    context.fillText(`Photo by ${session.photo?.photographerName} on Unsplash`, padding, height - padding * 0.65);
    return canvas;
  };

  useEffect(() => { drawCard().catch(() => {}); }, [ratio, overlay, grayscale, session.publicText]);

  const download = async () => {
    try {
      const canvas = await drawCard();
      await trackDownload(session.photo);
      const link = document.createElement('a');
      link.download = `마음역-${session.stationName}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      onToast('마음 카드를 저장했어요.');
    } catch {
      onToast('이미지를 만들지 못했어요. 다시 시도해주세요.');
    }
  };

  const share = async () => {
    try {
      const canvas = await drawCard();
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
      const file = new File([blob], `마음역-${session.stationName}.png`, { type: 'image/png' });
      if (navigator.canShare?.({ files: [file] })) {
        await trackDownload(session.photo);
        await navigator.share({ files: [file], text: session.publicText, title: '오늘의 마음역' });
      } else {
        await download();
      }
    } catch (error) {
      if (error?.name !== 'AbortError') onToast('공유를 시작하지 못했어요. 이미지 저장을 이용해주세요.');
    }
  };

  const copyText = async () => {
    await navigator.clipboard.writeText(session.publicText);
    onToast('공유 문구를 복사했어요.');
  };

  return (
    <section className="share-page page-enter">
      <div className="journey-head"><button className="text-button" onClick={onBack}>← 결과로 돌아가기</button></div>
      <div className="share-layout">
        <div className={`canvas-frame ${ratio}`}><canvas ref={canvasRef} aria-label="공유 카드 미리보기" /></div>
        <div className="share-controls">
          <span className="step-kicker">마음 카드 편집</span>
          <h2>나누고 싶은 만큼만<br />담아보세요</h2>
          <label>공개할 문장<textarea rows="4" value={session.publicText} onChange={(event) => setSession((current) => ({ ...current, publicText: event.target.value.slice(0, 160) }))} /></label>
          <fieldset><legend>카드 비율</legend><div className="segmented">{['portrait', 'square', 'landscape'].map((item) => <button key={item} className={ratio === item ? 'active' : ''} onClick={() => setRatio(item)}>{item === 'portrait' ? '세로' : item === 'square' ? '정사각' : '가로'}</button>)}</div></fieldset>
          <label>사진 어둡기 <input type="range" min="25" max="75" value={overlay} onChange={(event) => setOverlay(Number(event.target.value))} /></label>
          <label className="toggle"><input type="checkbox" checked={grayscale} onChange={(event) => setGrayscale(event.target.checked)} /><span /> 흑백 사진</label>
          <label className="privacy-check"><input type="checkbox" checked={privacyChecked} onChange={(event) => setPrivacyChecked(event.target.checked)} /> 이름, 직장, 연락처 등 공개하기 어려운 정보가 없는지 확인했습니다.</label>
          <div className="share-buttons"><button className="primary-button" disabled={!privacyChecked} onClick={share}>공유하기</button><button className="secondary-button" disabled={!privacyChecked} onClick={download}>이미지 저장</button><button className="text-button" onClick={copyText}>문구 복사</button></div>
        </div>
      </div>
    </section>
  );
}

function History({ records, onBack, onDelete, onClear }) {
  return (
    <section className="history-page page-enter">
      <div className="journey-head"><button className="text-button" onClick={onBack}>← 홈으로</button>{records.length > 0 && <button className="danger-link" onClick={() => window.confirm('모든 마음 기록을 삭제할까요?') && onClear()}>전체 삭제</button>}</div>
      <span className="step-kicker">나의 마음 노선도</span>
      <h1>지나온 마음역</h1>
      <p>이 기록은 지금 사용 중인 브라우저에만 저장됩니다.</p>
      {records.length === 0 ? <div className="empty-state"><span>○</span><strong>아직 머문 역이 없어요</strong><p>첫 마음 여행을 시작하면 이곳에 기록이 쌓여요.</p></div> : (
        <div className="history-grid">
          {records.map((record) => (
            <article key={record.id}>
              <img src={record.photo?.thumb || record.photo?.url} alt="" />
              <div><small>{new Date(record.completedAt).toLocaleDateString('ko-KR')}</small><h2>{record.stationName}</h2><p>{record.action?.label}</p></div>
              <button onClick={() => window.confirm('이 기록을 삭제할까요?') && onDelete(record.id)} aria-label={`${record.stationName} 기록 삭제`}>×</button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function HelpModal({ onClose }) {
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="help-modal" role="dialog" aria-modal="true" aria-labelledby="help-title">
        <button className="modal-close" onClick={onClose} aria-label="닫기">×</button>
        <span className="help-symbol">◎</span>
        <h2 id="help-title">지금 혼자 감당하지 않아도 괜찮아요</h2>
        <p>마음역은 진단이나 전문 상담을 제공하지 않습니다. 지금 자신이나 다른 사람을 해칠 위험이 있다면 앱보다 사람의 도움을 먼저 받아주세요.</p>
        <div className="contact-list">
          <a href="tel:112"><span>즉각적인 위험</span><strong>경찰 112</strong></a>
          <a href="tel:119"><span>응급 상황</span><strong>구급 119</strong></a>
          <a href="tel:109"><span>24시간 자살예방상담</span><strong>109</strong></a>
          <a href="tel:1577-0199"><span>24시간 정신건강상담</span><strong>1577-0199</strong></a>
        </div>
        <p className="help-footnote">가능하다면 지금 믿을 수 있는 사람에게 현재 상황을 알려주세요.</p>
        <button className="primary-button full-button" onClick={onClose}>확인했어요</button>
      </section>
    </div>
  );
}

function drawWrappedText(context, text, x, y, maxWidth, lineHeight) {
  const paragraphs = text.split('\n');
  let cursorY = y;
  paragraphs.forEach((paragraph) => {
    const words = paragraph.split('');
    let line = '';
    words.forEach((character) => {
      const test = line + character;
      if (context.measureText(test).width > maxWidth && line) {
        context.fillText(line, x, cursorY);
        line = character;
        cursorY += lineHeight;
      } else line = test;
    });
    if (line) context.fillText(line, x, cursorY);
    cursorY += lineHeight;
  });
}

export default App;
