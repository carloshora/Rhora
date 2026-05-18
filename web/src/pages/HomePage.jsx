import React, { useRef, useEffect } from 'react';
import { drawSticker } from '../utils/stickerRenderer.js';

export default function HomePage({ onStart }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = 280;
    canvas.height = Math.round(280 * (19 / 9));
    drawSticker(canvas, {
      photoImage: null,
      playerName: 'Você aqui',
      jerseyNumber: '10',
      clubName: 'Seu Clube',
      contentOffsetX: 0,
    });
  }, []);

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* Hero */}
        <div style={styles.hero}>
          <span style={styles.badge}>⚽ FIFA 26 · Copa do Mundo</span>
          <h1 style={styles.title}>
            Vire um jogador<br />
            <span style={styles.titleAccent}>da Seleção!</span>
          </h1>
          <p style={styles.subtitle}>
            Crie sua figurinha personalizada estilo Panini FIFA 26<br />
            pronta para imprimir na capinha do seu celular.
          </p>

          <div style={styles.features}>
            {[
              { icon: '🤖', text: 'Remoção de fundo automática (IA)' },
              { icon: '🖨️', text: 'Alta resolução para impressão' },
              { icon: '📱', text: 'Ajustado para o seu modelo de celular' },
              { icon: '🆓', text: '100% gratuito · Sem cadastro' },
            ].map((f, i) => (
              <div key={i} style={styles.featureItem}>
                <span>{f.icon}</span>
                <span style={styles.featureText}>{f.text}</span>
              </div>
            ))}
          </div>

          <button style={styles.ctaBtn} onClick={onStart}>
            CRIAR MINHA FIGURINHA →
          </button>
        </div>

        {/* Sticker preview */}
        <div style={styles.previewSide}>
          <div style={styles.canvasWrapper}>
            <canvas ref={canvasRef} style={styles.canvas} />
          </div>
          <p style={styles.previewCaption}>Prévia — com sua foto fica incrível!</p>
        </div>

      </div>

      <footer style={styles.footer}>
        Open source · Grátis · Copa 2026 · Seleção Brasileira
      </footer>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(160deg, #0A1628 0%, #0D2240 50%, #0A1628 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '24px 16px',
  },
  container: {
    maxWidth: 960,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 48,
    flex: 1,
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingTop: 40,
    paddingBottom: 40,
  },
  hero: { flex: 1, minWidth: 280, maxWidth: 480 },
  badge: {
    display: 'inline-block',
    background: '#FFDF00',
    color: '#0A1628',
    fontWeight: 800,
    fontSize: 12,
    padding: '5px 14px',
    borderRadius: 20,
    letterSpacing: 1,
    marginBottom: 20,
  },
  title: {
    fontSize: 'clamp(36px, 6vw, 56px)',
    fontWeight: 900,
    lineHeight: 1.1,
    letterSpacing: -1,
    marginBottom: 16,
    color: 'white',
  },
  titleAccent: { color: '#4ECDC4' },
  subtitle: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 16,
    lineHeight: 1.6,
    marginBottom: 28,
  },
  features: { display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 },
  featureItem: { display: 'flex', alignItems: 'center', gap: 10 },
  featureText: { color: 'rgba(255,255,255,0.75)', fontSize: 14 },
  ctaBtn: {
    background: 'linear-gradient(90deg, #4ECDC4, #2BBDB4)',
    color: '#0A1628',
    fontWeight: 900,
    fontSize: 16,
    letterSpacing: 1.5,
    padding: '18px 40px',
    borderRadius: 16,
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 8px 32px rgba(78,205,196,0.4)',
    transition: 'transform 0.15s, box-shadow 0.15s',
    width: '100%',
    maxWidth: 360,
  },
  previewSide: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 },
  canvasWrapper: {
    boxShadow: '0 16px 64px rgba(78,205,196,0.3)',
    borderRadius: 12,
    overflow: 'hidden',
  },
  canvas: { display: 'block' },
  previewCaption: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: 12,
    textAlign: 'center',
  },
  footer: {
    color: 'rgba(255,255,255,0.2)',
    fontSize: 11,
    marginTop: 16,
    textAlign: 'center',
  },
};
