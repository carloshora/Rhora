/**
 * Draws the complete FIFA 26 Brazil sticker onto a Canvas element.
 * All coordinates are proportional to canvas dimensions.
 */
export function drawSticker(canvas, { photoImage, playerName, jerseyNumber, clubName, contentOffsetX = 0 }) {
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;
  const shift = W * contentOffsetX;

  ctx.clearRect(0, 0, W, H);

  // ── Rounded card clip ──────────────────────────────────────────
  const R = W * 0.04;
  ctx.beginPath();
  ctx.moveTo(R, 0);
  ctx.lineTo(W - R, 0);
  ctx.quadraticCurveTo(W, 0, W, R);
  ctx.lineTo(W, H - R);
  ctx.quadraticCurveTo(W, H, W - R, H);
  ctx.lineTo(R, H);
  ctx.quadraticCurveTo(0, H, 0, H - R);
  ctx.lineTo(0, R);
  ctx.quadraticCurveTo(0, 0, R, 0);
  ctx.closePath();
  ctx.save();
  ctx.clip();

  // ── Turquoise background ──────────────────────────────────────
  ctx.fillStyle = '#4ECDC4';
  ctx.fillRect(0, 0, W, H);

  // ── Green organic blob (left) ─────────────────────────────────
  ctx.fillStyle = '#009C3B';
  ctx.beginPath();
  ctx.moveTo(-W * 0.05 + shift, 0);
  ctx.lineTo(W * 0.47 + shift, 0);
  ctx.bezierCurveTo(
    W * 0.54 + shift, H * 0.20,
    W * 0.56 + shift, H * 0.45,
    W * 0.44 + shift, H * 0.70
  );
  ctx.bezierCurveTo(
    W * 0.30 + shift, H * 0.78,
    W * 0.05 + shift, H * 0.74,
    -W * 0.05 + shift, H * 0.72
  );
  ctx.closePath();
  ctx.fill();

  // ── Yellow accent rectangle ───────────────────────────────────
  ctx.fillStyle = '#FFDF00';
  ctx.fillRect(W * 0.28 + shift, H * 0.30, W * 0.38, H * 0.15);

  // ── Darker green behind yellow ────────────────────────────────
  ctx.fillStyle = '#007A2F';
  ctx.fillRect(W * 0.24 + shift, H * 0.34, W * 0.13, H * 0.09);

  // ── FIFA 26 logo (top right) ──────────────────────────────────
  const logoX = W * 0.72 - shift * 0.3;
  const logoY = H * 0.018;
  const logoW = W * 0.24;
  const logoH = H * 0.095;
  const logoR = W * 0.025;

  ctx.fillStyle = '#3BBAC8';
  roundRect(ctx, logoX, logoY, logoW, logoH, logoR);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.font = `900 ${W * 0.11}px Inter, sans-serif`;
  ctx.fillText('26', logoX + logoW / 2, logoY + logoH * 0.78);

  ctx.font = `800 ${W * 0.038}px Inter, sans-serif`;
  ctx.letterSpacing = '3px';
  ctx.fillText('FIFA', logoX + logoW / 2, logoY + logoH * 0.97);
  ctx.letterSpacing = '0px';

  // ── Player photo ───────────────────────────────────────────────
  const panelH = H * 0.21;
  const photoAreaH = H - panelH;

  if (photoImage) {
    const imgAspect = photoImage.width / photoImage.height;
    const areaAspect = W / photoAreaH;
    let sx = 0, sy = 0, sw = photoImage.width, sh = photoImage.height;

    if (imgAspect > areaAspect) {
      sw = photoImage.height * areaAspect;
      sx = (photoImage.width - sw) / 2;
    } else {
      sh = photoImage.width / areaAspect;
      sy = (photoImage.height - sh) / 4; // favor top (face)
    }

    ctx.drawImage(photoImage, sx, sy, sw, sh, shift, 0, W, photoAreaH);
  } else {
    // Placeholder silhouette
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    ctx.beginPath();
    ctx.arc(W / 2 + shift, H * 0.28, W * 0.14, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(W * 0.15 + shift, H * 0.75);
    ctx.quadraticCurveTo(W / 2 + shift, H * 0.40, W * 0.85 + shift, H * 0.75);
    ctx.closePath();
    ctx.fill();
  }

  // ── Brazil flag circle (right side) ──────────────────────────
  const flagCx = W * 0.87 - shift * 0.4;
  const flagCy = H * 0.50;
  const flagR = W * 0.1;
  drawBrazilFlag(ctx, flagCx, flagCy, flagR, W);

  // ── BRA text ──────────────────────────────────────────────────
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.font = `900 ${W * 0.06}px Inter, sans-serif`;
  ctx.shadowColor = 'rgba(0,0,0,0.35)';
  ctx.shadowOffsetX = 1;
  ctx.shadowOffsetY = 1;
  ctx.shadowBlur = 3;
  ctx.fillText('BRA', flagCx, flagCy + flagR + H * 0.01);
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;

  // ── Bottom panel ──────────────────────────────────────────────
  ctx.fillStyle = '#1A8A82';
  ctx.fillRect(0, H - panelH, W, panelH);

  // Separator line
  ctx.fillStyle = '#147068';
  ctx.fillRect(0, H - panelH, W, H * 0.004);

  // Player name
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const maxNameFontSize = W * 0.072;
  let nameFontSize = maxNameFontSize;
  const nameY = H - panelH * 0.57;
  const name = playerName.toUpperCase();
  ctx.font = `900 ${nameFontSize}px Inter, sans-serif`;
  while (ctx.measureText(name).width > W * 0.88 && nameFontSize > W * 0.04) {
    nameFontSize -= 1;
    ctx.font = `900 ${nameFontSize}px Inter, sans-serif`;
  }
  ctx.fillText(name, W / 2, nameY);

  // Jersey + club
  ctx.fillStyle = 'rgba(255,255,255,0.88)';
  ctx.font = `600 ${W * 0.038}px Inter, sans-serif`;
  ctx.fillText(`#${jerseyNumber} | ${clubName.toUpperCase()}`, W / 2, H - panelH * 0.30);

  // Panini badge (bottom right)
  const badgeX = W * 0.65;
  const badgeY = H - panelH * 0.18;
  const badgeW = W * 0.30;
  const badgeH = panelH * 0.16;
  ctx.fillStyle = '#FF6600';
  roundRect(ctx, badgeX, badgeY, badgeW, badgeH, badgeH / 3);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = `900 ${badgeH * 0.65}px Inter, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('PANINI', badgeX + badgeW / 2, badgeY + badgeH / 2);

  ctx.restore();
}

function drawBrazilFlag(ctx, cx, cy, r, W) {
  // Green outer circle
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = '#009C3B';
  ctx.fill();

  // Yellow diamond
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(Math.PI / 4);
  const dSize = r * 0.96;
  ctx.fillStyle = '#FFDF00';
  ctx.fillRect(-dSize / 2, -dSize / 2, dSize, dSize);
  ctx.restore();

  // Blue inner circle
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.58, 0, Math.PI * 2);
  ctx.fillStyle = '#002776';
  ctx.fill();

  // White band across center
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.58, 0, Math.PI * 2);
  ctx.clip();
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(cx - r * 0.58, cy - r * 0.115, r * 1.16, r * 0.23);

  // Green text on band
  ctx.fillStyle = '#009C3B';
  ctx.font = `700 ${r * 0.12}px Inter, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('ORDEM E PROGRESSO', cx, cy);
  ctx.restore();

  // Stars (simplified dots)
  ctx.fillStyle = '#ffffff';
  const starPositions = [
    [-0.22, -0.28], [0.0, -0.34], [0.22, -0.28],
    [-0.35, -0.08], [0.35, -0.08],
    [-0.35, 0.18], [0.35, 0.18],
    [-0.22, 0.32], [0.0, 0.36], [0.22, 0.32],
  ];
  starPositions.forEach(([dx, dy]) => {
    ctx.beginPath();
    ctx.arc(cx + dx * r, cy + dy * r, r * 0.04, 0, Math.PI * 2);
    ctx.fill();
  });
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}
