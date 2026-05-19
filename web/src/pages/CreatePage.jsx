import React, { useState, useRef, useEffect, useCallback } from 'react';
import { PHONE_MODELS } from '../utils/phoneModels.js';
import { drawSticker } from '../utils/stickerRenderer.js';
import { removeBackground } from '../utils/removeBackground.js';

const STEPS = ['Foto', 'Celular', 'Dados', 'Resultado'];
const PREVIEW_W = 260;
const PREVIEW_H = Math.round(PREVIEW_W * (19 / 9));

export default function CreatePage({ onBack }) {
  const [step, setStep] = useState(0);
  const [rawPhoto, setRawPhoto] = useState(null);
  const [processedPhoto, setProcessedPhoto] = useState(null); // HTMLImageElement
  const [bgStatus, setBgStatus] = useState('idle'); // idle | loading | done | error
  const [bgProgress, setBgProgress] = useState(0);
  const [bgProgressLabel, setBgProgressLabel] = useState('');
  const [phoneModel, setPhoneModel] = useState(PHONE_MODELS[0]);
  const [playerName, setPlayerName] = useState('');
  const [jerseyNumber, setJerseyNumber] = useState('');
  const [clubName, setClubName] = useState('');
  const [errors, setErrors] = useState({});

  const previewCanvasRef = useRef(null);
  const exportCanvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // Redraw preview canvas whenever any sticker param changes
  useEffect(() => {
    const canvas = previewCanvasRef.current;
    if (!canvas) return;
    canvas.width = PREVIEW_W;
    canvas.height = PREVIEW_H;
    drawSticker(canvas, {
      photoImage: processedPhoto,
      playerName: playerName || 'SEU NOME',
      jerseyNumber: jerseyNumber || '10',
      clubName: clubName || 'SEU CLUBE',
      contentOffsetX: phoneModel.contentOffsetX,
    });
  }, [processedPhoto, playerName, jerseyNumber, clubName, phoneModel]);

  async function handleFile(file) {
    if (!file || !file.type.startsWith('image/')) return;
    const url = URL.createObjectURL(file);
    setRawPhoto(url);
    setProcessedPhoto(null);
    setBgStatus('loading');
    setBgProgress(0);

    try {
      const resultBlob = await removeBackground(file, (pct, key) => {
        setBgProgress(pct);
        if (key && key.includes('fetch')) setBgProgressLabel('Baixando modelo de IA...');
        else if (key && key.includes('process')) setBgProgressLabel('Processando imagem...');
        else setBgProgressLabel('Removendo fundo...');
      });

      const imgEl = new Image();
      imgEl.src = URL.createObjectURL(resultBlob);
      await new Promise((res) => { imgEl.onload = res; });
      setProcessedPhoto(imgEl);
      setBgStatus('done');
    } catch (err) {
      console.error(err);
      setBgStatus('error');
    }
  }

  function handleFileInput(e) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  function handleDrop(e) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  function validateAndNext() {
    if (step === 2) {
      const e = {};
      if (!playerName.trim()) e.playerName = 'Digite seu nome';
      if (!jerseyNumber.trim() || isNaN(jerseyNumber) || +jerseyNumber < 1 || +jerseyNumber > 99)
        e.jerseyNumber = 'Número entre 1 e 99';
      if (!clubName.trim()) e.clubName = 'Digite o clube';
      setErrors(e);
      if (Object.keys(e).length > 0) return;
    }
    setStep((s) => s + 1);
  }

  function downloadSticker() {
    const canvas = exportCanvasRef.current;
    if (!canvas) return;
    canvas.width = phoneModel.printWidth;
    canvas.height = phoneModel.printHeight;
    drawSticker(canvas, {
      photoImage: processedPhoto,
      playerName,
      jerseyNumber,
      clubName,
      contentOffsetX: phoneModel.contentOffsetX,
    });
    const link = document.createElement('a');
    link.download = `figurinha-${playerName.replace(/\s+/g, '-').toLowerCase()}.png`;
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
  }

  const canGoNext = () => {
    if (step === 0) return bgStatus === 'done';
    if (step === 1) return true;
    if (step === 2) return playerName && jerseyNumber && clubName;
    return false;
  };

  return (
    <div style={styles.page}>
      {/* Top bar */}
      <div style={styles.topBar}>
        <button onClick={onBack} style={styles.backBtn}>← Voltar</button>
        <div style={styles.stepIndicator}>
          {STEPS.map((s, i) => (
            <div key={i} style={styles.stepDot}>
              <div style={{
                ...styles.stepCircle,
                background: i < step ? '#4ECDC4' : i === step ? '#4ECDC4' : '#2E4A6A',
                opacity: i === step ? 1 : i < step ? 0.7 : 0.4,
              }}>
                {i < step ? '✓' : i + 1}
              </div>
              <span style={{ ...styles.stepLabel, opacity: i === step ? 1 : 0.4 }}>{s}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={styles.body}>
        {/* Left: step content */}
        <div style={styles.leftPanel}>

          {/* STEP 0: Upload photo */}
          {step === 0 && (
            <div>
              <h2 style={styles.stepTitle}>Sua foto</h2>
              <p style={styles.stepDesc}>
                Escolha uma foto com rosto e ombros visíveis, fundo claro.
              </p>

              {bgStatus === 'loading' ? (
                <div style={styles.progressBox}>
                  <div style={styles.spinner} />
                  <p style={styles.progressLabel}>{bgProgressLabel || 'Processando...'}</p>
                  <div style={styles.progressBar}>
                    <div style={{ ...styles.progressFill, width: `${bgProgress}%` }} />
                  </div>
                  <p style={styles.progressPct}>{bgProgress}%</p>
                  {bgProgress === 0 && (
                    <p style={styles.progressHint}>
                      Na primeira vez, baixa o modelo de IA (~40MB). Aguarde...
                    </p>
                  )}
                </div>
              ) : (
                <div
                  style={{
                    ...styles.dropZone,
                    borderColor: rawPhoto ? '#4ECDC4' : '#2E4A6A',
                    background: rawPhoto ? 'rgba(78,205,196,0.05)' : '#1C2A3A',
                  }}
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    capture="user"
                    style={{ display: 'none' }}
                    onChange={handleFileInput}
                  />
                  {rawPhoto ? (
                    <img src={rawPhoto} alt="Foto selecionada" style={styles.photoThumb} />
                  ) : (
                    <>
                      <span style={styles.dropIcon}>📸</span>
                      <p style={styles.dropText}>Clique para escolher ou arraste a foto aqui</p>
                      <p style={styles.dropHint}>No celular: abre câmera ou galeria</p>
                    </>
                  )}
                </div>
              )}

              {bgStatus === 'done' && (
                <div style={styles.successBadge}>✅ Fundo removido com sucesso!</div>
              )}
              {bgStatus === 'error' && (
                <div style={styles.errorBadge}>
                  ❌ Erro ao processar. Tente outra foto.
                  <button style={styles.retryBtn} onClick={() => { setBgStatus('idle'); setRawPhoto(null); }}>
                    Tentar novamente
                  </button>
                </div>
              )}

              <div style={styles.tips}>
                {['✅ Fundo claro e liso', '✅ Rosto e ombros visíveis', '✅ Boa iluminação', '❌ Evite fundos escuros ou cheios'].map((t, i) => (
                  <span key={i} style={styles.tip}>{t}</span>
                ))}
              </div>
            </div>
          )}

          {/* STEP 1: Phone model */}
          {step === 1 && (
            <div>
              <h2 style={styles.stepTitle}>Modelo do celular</h2>
              <p style={styles.stepDesc}>
                Escolha para ajustar a imagem e evitar cobrir a câmera.
              </p>
              <div style={styles.modelList}>
                {PHONE_MODELS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setPhoneModel(m)}
                    style={{
                      ...styles.modelBtn,
                      borderColor: m.id === phoneModel.id ? '#4ECDC4' : '#2E4A6A',
                      background: m.id === phoneModel.id ? 'rgba(78,205,196,0.08)' : '#1C2A3A',
                    }}
                  >
                    <div style={styles.modelBtnLeft}>
                      <div style={{
                        ...styles.radio,
                        borderColor: m.id === phoneModel.id ? '#4ECDC4' : '#2E4A6A',
                      }}>
                        {m.id === phoneModel.id && <div style={styles.radioFill} />}
                      </div>
                      <div>
                        <div style={{ color: 'white', fontWeight: 700, fontSize: 14 }}>{m.name}</div>
                        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 2 }}>
                          {m.printWidth}×{m.printHeight}px · {m.cameraNote}
                        </div>
                      </div>
                    </div>
                    {m.id === phoneModel.id && (
                      <div style={styles.checkBadge}>✓</div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Player data */}
          {step === 2 && (
            <div>
              <h2 style={styles.stepTitle}>Seus dados</h2>
              <p style={styles.stepDesc}>Preencha como aparecerá na figurinha.</p>

              <div style={styles.form}>
                <FormField
                  label="Nome do jogador"
                  placeholder="Ex: Carlos Silva"
                  value={playerName}
                  onChange={setPlayerName}
                  error={errors.playerName}
                  maxLength={24}
                />
                <FormField
                  label="Número da camisa"
                  placeholder="Ex: 10"
                  value={jerseyNumber}
                  onChange={setJerseyNumber}
                  error={errors.jerseyNumber}
                  type="number"
                  min="1"
                  max="99"
                />
                <FormField
                  label="Clube / Cidade"
                  placeholder="Ex: Flamengo"
                  value={clubName}
                  onChange={setClubName}
                  error={errors.clubName}
                  maxLength={24}
                />
              </div>
            </div>
          )}

          {/* STEP 3: Result */}
          {step === 3 && (
            <div>
              <h2 style={styles.stepTitle}>A foto ficou boa? 🎉</h2>
              <p style={styles.stepDesc}>
                Sua figurinha está pronta em alta resolução ({phoneModel.printWidth}×{phoneModel.printHeight}px · 300 DPI).
              </p>

              <canvas ref={exportCanvasRef} style={{ display: 'none' }} />

              <button style={styles.downloadBtn} onClick={downloadSticker}>
                ⬇️  BAIXAR FIGURINHA (PNG)
              </button>

              <div style={styles.printInstructions}>
                <p style={styles.printTitle}>Como imprimir na capinha:</p>
                <ol style={styles.printList}>
                  <li>Baixe a imagem PNG</li>
                  <li>Acesse um site de capinhas personalizadas</li>
                  <li>Faça o upload da imagem</li>
                  <li>Selecione seu modelo de celular e peça!</li>
                </ol>
              </div>

              <button
                style={styles.restartBtn}
                onClick={() => {
                  setStep(0);
                  setRawPhoto(null);
                  setProcessedPhoto(null);
                  setBgStatus('idle');
                  setPlayerName('');
                  setJerseyNumber('');
                  setClubName('');
                }}
              >
                Criar outra figurinha
              </button>
            </div>
          )}

          {/* Navigation */}
          {step < 3 && (
            <div style={styles.navRow}>
              {step > 0 && (
                <button style={styles.prevBtn} onClick={() => setStep((s) => s - 1)}>
                  ← Anterior
                </button>
              )}
              <button
                style={{
                  ...styles.nextBtn,
                  opacity: canGoNext() ? 1 : 0.45,
                  cursor: canGoNext() ? 'pointer' : 'not-allowed',
                }}
                onClick={canGoNext() ? validateAndNext : undefined}
              >
                {step === 2 ? 'VER RESULTADO →' : 'CONTINUAR →'}
              </button>
            </div>
          )}
        </div>

        {/* Right: live sticker preview */}
        <div style={styles.rightPanel}>
          <p style={styles.previewLabel}>Prévia em tempo real</p>
          <div style={styles.canvasWrapper}>
            <canvas ref={previewCanvasRef} style={{ display: 'block' }} />
          </div>
          <p style={styles.previewSub}>
            {phoneModel.name}<br />
            <span style={{ color: 'rgba(255,255,255,0.3)' }}>
              Câmera: {phoneModel.cameraNote}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

function FormField({ label, error, onChange, ...props }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={fieldStyles.label}>{label}</label>
      <input
        style={{ ...fieldStyles.input, borderColor: error ? '#FF6B6B' : '#2E4A6A' }}
        onChange={(e) => onChange(e.target.value)}
        {...props}
      />
      {error && <p style={fieldStyles.error}>{error}</p>}
    </div>
  );
}

const fieldStyles = {
  label: { display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 600, marginBottom: 6 },
  input: {
    width: '100%',
    background: '#0D1E30',
    border: '1.5px solid #2E4A6A',
    borderRadius: 12,
    color: 'white',
    fontSize: 16,
    padding: '13px 16px',
    fontFamily: 'Inter, sans-serif',
  },
  error: { color: '#FF6B6B', fontSize: 12, marginTop: 4 },
};

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(160deg, #0A1628 0%, #0D2240 100%)',
    display: 'flex',
    flexDirection: 'column',
  },
  topBar: {
    display: 'flex',
    alignItems: 'center',
    padding: '16px 24px',
    borderBottom: '1px solid rgba(255,255,255,0.07)',
    gap: 24,
    flexWrap: 'wrap',
  },
  backBtn: {
    background: 'none',
    color: '#4ECDC4',
    fontWeight: 600,
    fontSize: 15,
    padding: '6px 12px',
    borderRadius: 8,
    border: '1px solid rgba(78,205,196,0.25)',
  },
  stepIndicator: { display: 'flex', gap: 8, alignItems: 'center' },
  stepDot: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    background: '#2E4A6A',
    color: 'white',
    fontWeight: 700,
    fontSize: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 11 },
  body: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    gap: 32,
    padding: '32px 24px',
    maxWidth: 960,
    margin: '0 auto',
    width: '100%',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  leftPanel: { flex: 1, minWidth: 280, maxWidth: 520 },
  stepTitle: { color: 'white', fontSize: 28, fontWeight: 900, marginBottom: 8, letterSpacing: -0.5 },
  stepDesc: { color: 'rgba(255,255,255,0.55)', fontSize: 14, lineHeight: 1.6, marginBottom: 24 },
  dropZone: {
    border: '2px dashed',
    borderRadius: 16,
    padding: 32,
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s',
    marginBottom: 16,
    minHeight: 180,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  dropIcon: { fontSize: 40 },
  dropText: { color: 'rgba(255,255,255,0.7)', fontSize: 15, fontWeight: 600 },
  dropHint: { color: 'rgba(255,255,255,0.35)', fontSize: 12 },
  photoThumb: { maxHeight: 200, borderRadius: 8, objectFit: 'cover' },
  progressBox: {
    background: '#1C2A3A',
    borderRadius: 16,
    padding: 24,
    textAlign: 'center',
    marginBottom: 16,
    border: '1px solid #2E4A6A',
  },
  spinner: {
    width: 40,
    height: 40,
    border: '3px solid #2E4A6A',
    borderTopColor: '#4ECDC4',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
    margin: '0 auto 12px',
  },
  progressLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 14, marginBottom: 12 },
  progressBar: { background: '#0D1E30', borderRadius: 8, height: 8, overflow: 'hidden', marginBottom: 6 },
  progressFill: { height: '100%', background: 'linear-gradient(90deg, #4ECDC4, #2BBDB4)', borderRadius: 8, transition: 'width 0.3s' },
  progressPct: { color: '#4ECDC4', fontWeight: 700, fontSize: 14 },
  progressHint: { color: 'rgba(255,255,255,0.35)', fontSize: 11, marginTop: 8 },
  successBadge: {
    background: 'rgba(81,207,102,0.12)',
    border: '1px solid rgba(81,207,102,0.3)',
    color: '#51CF66',
    borderRadius: 10,
    padding: '10px 16px',
    fontSize: 14,
    fontWeight: 600,
    marginBottom: 16,
  },
  errorBadge: {
    background: 'rgba(255,107,107,0.12)',
    border: '1px solid rgba(255,107,107,0.3)',
    color: '#FF6B6B',
    borderRadius: 10,
    padding: '10px 16px',
    fontSize: 14,
    marginBottom: 16,
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  retryBtn: {
    background: 'none',
    border: '1px solid #FF6B6B',
    color: '#FF6B6B',
    borderRadius: 8,
    padding: '4px 12px',
    fontSize: 13,
    cursor: 'pointer',
  },
  tips: { display: 'flex', flexDirection: 'column', gap: 4 },
  tip: { color: 'rgba(255,255,255,0.45)', fontSize: 13 },
  modelList: { display: 'flex', flexDirection: 'column', gap: 10 },
  modelBtn: {
    background: '#1C2A3A',
    border: '2px solid',
    borderRadius: 14,
    padding: '14px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'border-color 0.15s, background 0.15s',
  },
  modelBtnLeft: { display: 'flex', alignItems: 'center', gap: 12 },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    border: '2px solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  radioFill: { width: 10, height: 10, borderRadius: 5, background: '#4ECDC4' },
  checkBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    background: '#4ECDC4',
    color: '#0A1628',
    fontWeight: 900,
    fontSize: 13,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: {},
  navRow: { display: 'flex', gap: 12, marginTop: 24 },
  prevBtn: {
    background: '#1C2A3A',
    border: '1.5px solid #2E4A6A',
    color: 'rgba(255,255,255,0.7)',
    borderRadius: 12,
    padding: '14px 20px',
    fontWeight: 700,
    fontSize: 14,
    cursor: 'pointer',
  },
  nextBtn: {
    flex: 1,
    background: 'linear-gradient(90deg, #4ECDC4, #2BBDB4)',
    color: '#0A1628',
    fontWeight: 900,
    fontSize: 15,
    letterSpacing: 1,
    padding: '14px 24px',
    borderRadius: 12,
    border: 'none',
    boxShadow: '0 4px 16px rgba(78,205,196,0.35)',
  },
  downloadBtn: {
    width: '100%',
    background: 'linear-gradient(90deg, #51CF66, #2EAF47)',
    color: 'white',
    fontWeight: 900,
    fontSize: 16,
    letterSpacing: 1,
    padding: '18px 24px',
    borderRadius: 16,
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 4px 16px rgba(81,207,102,0.35)',
    marginBottom: 24,
  },
  printInstructions: {
    background: '#1C2A3A',
    border: '1px solid #2E4A6A',
    borderRadius: 14,
    padding: 20,
    marginBottom: 16,
  },
  printTitle: { color: 'white', fontWeight: 700, fontSize: 14, marginBottom: 10 },
  printList: { color: 'rgba(255,255,255,0.6)', fontSize: 13, lineHeight: 1.8, paddingLeft: 20 },
  restartBtn: {
    background: 'none',
    border: '1.5px solid rgba(78,205,196,0.3)',
    color: '#4ECDC4',
    borderRadius: 12,
    padding: '12px 24px',
    fontWeight: 700,
    fontSize: 14,
    cursor: 'pointer',
    width: '100%',
  },
  rightPanel: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
    position: 'sticky',
    top: 24,
  },
  previewLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 600 },
  canvasWrapper: {
    boxShadow: '0 12px 48px rgba(78,205,196,0.25)',
    borderRadius: 12,
    overflow: 'hidden',
  },
  previewSub: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 1.6,
  },
};
