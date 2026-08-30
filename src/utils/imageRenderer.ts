import { SlideData, SetupConfig } from '../types';
import { OFFICIAL_COLOR_SCHEMES } from '../data/colorSchemes';

/**
 * Downloads an image from a Data URL or URL directly to the user's computer.
 */
export function downloadImage(imageUrl: string, filename: string): void {
  const link = document.createElement('a');
  link.href = imageUrl;
  link.download = filename.endsWith('.png') ? filename : `${filename}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Generates an image using Nano Banana 2 via the backend API,
 * falling back to the HD High-Caliber Canvas Synthesizer if offline or no key is present.
 */
export async function generateNanoBanana2Image(
  slide: SlideData,
  config: SetupConfig
): Promise<{ imageUrl: string; source: string }> {
  try {
    const response = await fetch('/api/gemini/generate-image-nanobanana', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: slide.promptNanoBanana2,
        slideNumber: slide.slideNumber,
        characterImage: config.characterSheet?.imageUrl || null,
        characterName: config.characterSheet?.characterName || config.nametagText || null,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success && data.imageUrl) {
        return {
          imageUrl: data.imageUrl,
          source: data.source || 'gemini-nanobanana-2',
        };
      }
    }
  } catch (err) {
    console.warn('Backend image generation returned error, generating via HD Canvas Synthesizer:', err);
  }

  // Generate crisp 1920x1080 canvas slide with high-caliber dynamic presentation layout
  const canvasImageUrl = await renderSlideToCanvasDataUrl(slide, config);
  return {
    imageUrl: canvasImageUrl,
    source: 'pakar-hd-synthesizer-1080p',
  };
}

/**
 * High-definition 1920x1080 Canvas renderer generating presentation slides of high visual caliber
 */
export async function renderSlideToCanvasDataUrl(
  slide: SlideData,
  config: SetupConfig
): Promise<string> {
  const width = 1920;
  const height = 1080;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  const scheme =
    OFFICIAL_COLOR_SCHEMES.find((s) => s.id === config.colorSchemeId) ||
    OFFICIAL_COLOR_SCHEMES[0];

  const primaryAccent = scheme.accentHexes[0] || '#06B6D4';
  const secondaryAccent = scheme.accentHexes[1] || '#3B82F6';
  const isLeft = slide.characterPosition === 'KIRI';

  // 1. Studio Canvas Background (Supports both clean light and dark luxury schemes)
  const isDarkScheme = scheme.bgHex.startsWith('#0') || scheme.bgHex.startsWith('#1');
  ctx.fillStyle = isDarkScheme ? scheme.bgHex : '#F8FAFC';
  ctx.fillRect(0, 0, width, height);

  // Soft Ambient Glow & Modern Abstract Geometric Ribbons
  const glowX = isLeft ? width * 0.75 : width * 0.25;
  const glowY = height * 0.4;
  const radialGlow = ctx.createRadialGradient(glowX, glowY, 50, glowX, glowY, 900);
  if (isDarkScheme) {
    radialGlow.addColorStop(0, `${primaryAccent}25`);
    radialGlow.addColorStop(0.5, `${secondaryAccent}10`);
    radialGlow.addColorStop(1, 'transparent');
  } else {
    radialGlow.addColorStop(0, '#FFFFFF');
    radialGlow.addColorStop(0.6, '#F1F5F9');
    radialGlow.addColorStop(1, '#E2E8F0');
  }
  ctx.fillStyle = radialGlow;
  ctx.fillRect(0, 0, width, height);

  // Draw Abstract Curved Geometric Flow Lines & Floating Nodes
  ctx.save();
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 3; i++) {
    ctx.strokeStyle = isDarkScheme ? `${primaryAccent}${15 + i * 8}` : `${secondaryAccent}${20 + i * 10}`;
    ctx.beginPath();
    ctx.moveTo(0, height * (0.2 + i * 0.25));
    ctx.bezierCurveTo(
      width * 0.3,
      height * (0.05 + i * 0.3),
      width * 0.7,
      height * (0.45 + i * 0.2),
      width,
      height * (0.15 + i * 0.35)
    );
    ctx.stroke();
  }
  // Subtle isometric grid dots in background
  ctx.fillStyle = isDarkScheme ? 'rgba(255,255,255,0.04)' : 'rgba(15,23,42,0.03)';
  for (let gx = 60; gx < width; gx += 80) {
    for (let gy = 60; gy < height; gy += 80) {
      ctx.beginPath();
      ctx.arc(gx, gy, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();

  // Soft floor shadow under presenter
  const presenterShadowX = isLeft ? 280 : width - 280;
  const shadowGrad = ctx.createRadialGradient(
    presenterShadowX,
    height - 40,
    30,
    presenterShadowX,
    height - 40,
    260
  );
  shadowGrad.addColorStop(0, 'rgba(15, 23, 42, 0.2)');
  shadowGrad.addColorStop(0.6, 'rgba(15, 23, 42, 0.05)');
  shadowGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = shadowGrad;
  ctx.fillRect(presenterShadowX - 300, height - 90, 600, 80);

  // 2. Main Content Layout Area
  const contentX = isLeft ? 680 : 90;
  const contentWidth = 1150;

  // 3. Category / Slide Type Pill Badge
  ctx.save();
  const badgeY = 90;
  const badgeText = slide.isMcq
    ? `SOALAN UJI MINDA • SLAID ${slide.slideNumber}`
    : `INFOGRAFIK STRATEGIK • BAHAGIAN ${Math.ceil(slide.slideNumber / 6)}`;

  ctx.font = '900 16px "Plus Jakarta Sans", monospace';
  const badgeWidth = ctx.measureText(badgeText).width + 36;
  const badgeGrad = ctx.createLinearGradient(contentX, badgeY, contentX + badgeWidth, badgeY);
  badgeGrad.addColorStop(0, primaryAccent);
  badgeGrad.addColorStop(1, secondaryAccent);

  ctx.fillStyle = isDarkScheme ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
  roundRect(ctx, contentX, badgeY - 26, badgeWidth, 36, 18);
  ctx.fill();
  ctx.strokeStyle = primaryAccent;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = isDarkScheme ? '#FFFFFF' : '#0F172A';
  ctx.fillText(badgeText, contentX + 18, badgeY - 3);
  ctx.restore();

  // 4. Large Gradient Headline
  const titleY = 175;
  const titleText = slide.title.toUpperCase();
  ctx.font = '900 58px "Plus Jakarta Sans", "Montserrat", sans-serif';

  const titleGrad = ctx.createLinearGradient(contentX, titleY - 40, contentX + 800, titleY);
  titleGrad.addColorStop(0, primaryAccent);
  titleGrad.addColorStop(1, secondaryAccent);
  ctx.fillStyle = titleGrad;
  wrapText(ctx, titleText, contentX, titleY, contentWidth, 68, 2);

  // 5. Dynamic Content Area (Infographic Cards vs MCQ Quiz Interface)
  if (slide.isMcq && slide.mcqDetails) {
    drawMCQQuizLayout(
      ctx,
      contentX,
      270,
      contentWidth,
      680,
      slide,
      scheme,
      isDarkScheme,
      primaryAccent,
      secondaryAccent
    );
  } else {
    drawInfographicCardsLayout(
      ctx,
      contentX,
      270,
      contentWidth,
      680,
      slide,
      scheme,
      isDarkScheme,
      primaryAccent,
      secondaryAccent
    );
  }

  // 6. Draw 3D Presenter Avatar in Thigh-Up Pose (Left or Right)
  const presenterX = isLeft ? 280 : width - 280;
  const presenterY = height * 0.58;

  // Render high-fidelity 3D presenter avatar seamlessly standing on slide floor
  await draw3DPresenterAvatar(ctx, presenterX, presenterY, config, slide, isLeft, primaryAccent, secondaryAccent);

  // 7. Subtle Corner Brand Accent (Positioned safely away from title)
  const floatBadgeX = width - 110;
  const floatBadgeY = 60;
  drawFloatingAccentBadge(ctx, floatBadgeX, floatBadgeY, primaryAccent, secondaryAccent, slide.slideNumber);

  // 8. Crisp Slide Number in Corner
  ctx.font = '900 42px "Plus Jakarta Sans", "Montserrat", sans-serif';
  ctx.fillStyle = isDarkScheme ? '#64748B' : '#0F172A';
  ctx.textAlign = 'right';
  ctx.fillText(`${slide.slideNumber}`, width - 60, height - 40);
  ctx.textAlign = 'left';

  return canvas.toDataURL('image/png', 0.96);
}

/**
 * Draws dynamic Infographic Layouts tailored to the slide's specific archetype and metadata
 */
function drawInfographicCardsLayout(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  slide: SlideData,
  scheme: any,
  isDark: boolean,
  primaryAccent: string,
  secondaryAccent: string
) {
  const archetype = slide.infographicType || slide.infographicMeta?.archetype || 'BENTO_GRID';

  // 1. PROCESS FLOW ARCHETYPE
  if (archetype === 'PROCESS_FLOW' && slide.infographicMeta?.steps) {
    const steps = slide.infographicMeta.steps;
    const count = steps.length;
    const gap = 18;
    const cardWidth = (w - (count - 1) * gap) / count;
    const cardHeight = Math.min(h, 450);
    const startY = y + (h - cardHeight) / 2;

    // Draw glowing track connecting cards
    ctx.save();
    ctx.strokeStyle = isDark ? `${primaryAccent}50` : `${primaryAccent}40`;
    ctx.lineWidth = 4;
    ctx.setLineDash([8, 8]);
    ctx.beginPath();
    ctx.moveTo(x + 40, startY + 50);
    ctx.lineTo(x + w - 40, startY + 50);
    ctx.stroke();
    ctx.restore();

    steps.forEach((step, idx) => {
      const cx = x + idx * (cardWidth + gap);
      const cy = startY;

      // Card Container
      ctx.save();
      ctx.shadowColor = isDark ? 'rgba(0,0,0,0.5)' : 'rgba(15,23,42,0.08)';
      ctx.shadowBlur = 24;
      ctx.shadowOffsetY = 10;
      ctx.fillStyle = isDark ? '#0F172A' : '#FFFFFF';
      roundRect(ctx, cx, cy, cardWidth, cardHeight, 18);
      ctx.fill();

      // Top Accent Line
      const col = idx % 2 === 0 ? primaryAccent : secondaryAccent;
      ctx.fillStyle = col;
      roundRect(ctx, cx, cy, cardWidth, 10, { tl: 18, tr: 18, br: 0, bl: 0 });
      ctx.fill();

      // Border outline
      ctx.strokeStyle = isDark ? `${col}40` : `${col}30`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();

      // Step Number Badge
      const badgeSize = 54;
      const bx = cx + (cardWidth - badgeSize) / 2;
      const by = cy + 24;
      ctx.save();
      ctx.fillStyle = col;
      roundRect(ctx, bx, by, badgeSize, badgeSize, 14);
      ctx.fill();

      ctx.font = '900 24px "Plus Jakarta Sans", monospace';
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.fillText(`0${step.step}`, bx + badgeSize / 2, by + 35);

      // Title - Locked Large
      ctx.font = '800 28px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = isDark ? '#FFFFFF' : '#0F172A';
      wrapText(ctx, step.title, cx + cardWidth / 2, cy + 120, cardWidth - 28, 34, 2);

      // Divider line
      ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cx + 20, cy + 185);
      ctx.lineTo(cx + cardWidth - 20, cy + 185);
      ctx.stroke();

      // Description - Locked minimum 26px (20pt+ equivalent)
      ctx.font = '600 26px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = isDark ? '#CBD5E1' : '#334155';
      ctx.textAlign = 'center';
      wrapText(ctx, step.desc, cx + cardWidth / 2, cy + 225, cardWidth - 32, 34, 5);
      ctx.restore();
    });
    return;
  }

  // 2. STAT METRIC GAUGE ARCHETYPE (Cleanly Centered, Ultra High Caliber)
  if (archetype === 'STAT_METRIC_GAUGE' && slide.infographicMeta?.stats) {
    const stats = slide.infographicMeta.stats;
    const count = stats.length;
    const gap = 24;
    const cardWidth = (w - (count - 1) * gap) / count;
    const cardHeight = Math.min(h, 450);
    const startY = y + (h - cardHeight) / 2;

    stats.forEach((stat, idx) => {
      const cx = x + idx * (cardWidth + gap);
      const cy = startY;
      const accentCol = idx === 0 ? primaryAccent : idx === 1 ? secondaryAccent : '#10B981';

      // Card Container with Glow
      ctx.save();
      ctx.shadowColor = isDark ? 'rgba(0,0,0,0.5)' : 'rgba(15,23,42,0.08)';
      ctx.shadowBlur = 24;
      ctx.shadowOffsetY = 10;
      ctx.fillStyle = isDark ? '#0F172A' : '#FFFFFF';
      roundRect(ctx, cx, cy, cardWidth, cardHeight, 22);
      ctx.fill();

      // Top Gradient Accent Border
      const topGrad = ctx.createLinearGradient(cx, cy, cx + cardWidth, cy);
      topGrad.addColorStop(0, accentCol);
      topGrad.addColorStop(1, `${accentCol}66`);
      ctx.fillStyle = topGrad;
      roundRect(ctx, cx, cy, cardWidth, 10, { tl: 22, tr: 22, br: 0, bl: 0 });
      ctx.fill();

      // Outer border outline
      ctx.strokeStyle = isDark ? `${accentCol}33` : `${accentCol}22`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();

      // Large High-Impact Metric Value
      ctx.save();
      ctx.font = '900 68px "Plus Jakarta Sans", monospace';
      ctx.fillStyle = accentCol;
      ctx.textAlign = 'center';
      ctx.fillText(stat.value, cx + cardWidth / 2, cy + 140);

      // Metric Progress Bar under number
      const barWidth = cardWidth - 80;
      const barX = cx + 40;
      const barY = cy + 175;
      ctx.fillStyle = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)';
      roundRect(ctx, barX, barY, barWidth, 8, 4);
      ctx.fill();

      const progressFill = Math.min(barWidth, barWidth * (0.65 + (idx * 0.15)));
      ctx.fillStyle = accentCol;
      roundRect(ctx, barX, barY, progressFill, 8, 4);
      ctx.fill();

      // Label - Locked 28px Bold
      ctx.font = '800 28px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = isDark ? '#FFFFFF' : '#0F172A';
      ctx.textAlign = 'center';
      wrapText(ctx, stat.label, cx + cardWidth / 2, cy + 240, cardWidth - 40, 36, 2);

      // Change / Benchmark Tag Pill at Bottom - Locked 24px
      if (stat.change) {
        const pillW = cardWidth - 60;
        const pillH = 46;
        const pillX = cx + 30;
        const pillY = cy + cardHeight - 75;

        ctx.fillStyle = `${accentCol}18`;
        roundRect(ctx, pillX, pillY, pillW, pillH, 12);
        ctx.fill();

        ctx.strokeStyle = `${accentCol}40`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.font = '800 24px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = accentCol;
        ctx.textAlign = 'center';
        ctx.fillText(stat.change, cx + cardWidth / 2, pillY + 31);
      }
      ctx.restore();
    });
    return;
  }

  // 3. MULTI PILLAR ARCHITECTURE (4 Vertical Architectural Pillars)
  if (archetype === 'MULTI_PILLAR' && slide.infographicMeta?.pillars) {
    const pillars = slide.infographicMeta.pillars;
    const count = pillars.length;
    const gap = 18;
    const cardWidth = (w - (count - 1) * gap) / count;
    const cardHeight = Math.min(h, 450);
    const startY = y + (h - cardHeight) / 2;

    pillars.forEach((pillar, idx) => {
      const cx = x + idx * (cardWidth + gap);
      const cy = startY;
      const col = idx % 2 === 0 ? primaryAccent : secondaryAccent;

      ctx.save();
      ctx.shadowColor = isDark ? 'rgba(0,0,0,0.5)' : 'rgba(15,23,42,0.08)';
      ctx.shadowBlur = 24;
      ctx.shadowOffsetY = 10;
      ctx.fillStyle = isDark ? '#0F172A' : '#FFFFFF';
      roundRect(ctx, cx, cy, cardWidth, cardHeight, 18);
      ctx.fill();

      // Top Banner Header
      ctx.fillStyle = col;
      roundRect(ctx, cx, cy, cardWidth, 10, { tl: 18, tr: 18, br: 0, bl: 0 });
      ctx.fill();

      ctx.strokeStyle = isDark ? `${col}33` : `${col}22`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();

      // Pillar Number Pill
      ctx.save();
      ctx.fillStyle = `${col}20`;
      roundRect(ctx, cx + 18, cy + 24, 48, 48, 14);
      ctx.fill();

      ctx.font = '900 22px "Plus Jakarta Sans", monospace';
      ctx.fillStyle = col;
      ctx.textAlign = 'center';
      ctx.fillText(`0${idx + 1}`, cx + 42, cy + 55);
      ctx.textAlign = 'left';

      // Title - Locked 28px
      ctx.font = '800 28px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = isDark ? '#FFFFFF' : '#0F172A';
      wrapText(ctx, pillar.title, cx + 18, cy + 110, cardWidth - 36, 34, 2);

      // Divider
      ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cx + 18, cy + 180);
      ctx.lineTo(cx + cardWidth - 18, cy + 180);
      ctx.stroke();

      // Desc - Locked minimum 26px (20pt+ equivalent)
      ctx.font = '600 26px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = isDark ? '#CBD5E1' : '#334155';
      wrapText(ctx, pillar.desc, cx + 18, cy + 220, cardWidth - 36, 34, 5);
      ctx.restore();
    });
    return;
  }

  // 4. COMPARISON MATRIX (Side-by-Side Dual Card)
  if (archetype === 'COMPARISON_MATRIX' && slide.infographicMeta?.comparison) {
    const cmp = slide.infographicMeta.comparison;
    const cardWidth = (w - 28) / 2;
    const cardHeight = Math.min(h, 450);
    const cy = y + (h - cardHeight) / 2;

    // Left: Traditional / Legacy (Rose theme)
    ctx.save();
    ctx.shadowColor = 'rgba(225, 29, 72, 0.12)';
    ctx.shadowBlur = 24;
    ctx.fillStyle = isDark ? 'rgba(30, 15, 23, 0.95)' : '#FFF1F2';
    roundRect(ctx, x, cy, cardWidth, cardHeight, 20);
    ctx.fill();
    ctx.strokeStyle = isDark ? '#E11D4866' : '#FECDD3';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Top Header Banner
    ctx.fillStyle = '#E11D48';
    roundRect(ctx, x, cy, cardWidth, 60, { tl: 20, tr: 20, br: 0, bl: 0 });
    ctx.fill();

    ctx.font = '900 28px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(`✗  ${cmp.leftTitle.toUpperCase()}`, x + 24, cy + 40);

    // Left Bullet Items - Locked minimum 28px (20pt+ equivalent)
    ctx.font = '700 28px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = isDark ? '#FECDD3' : '#881337';
    cmp.leftItems.forEach((it, i) => {
      const itemY = cy + 100 + i * 105;
      ctx.fillStyle = '#E11D48';
      ctx.fillText('•', x + 24, itemY + 24);
      ctx.fillStyle = isDark ? '#FECDD3' : '#881337';
      wrapText(ctx, it, x + 50, itemY + 24, cardWidth - 75, 36, 2);
    });
    ctx.restore();

    // Right: Smart Transformation (Emerald theme)
    const rx = x + cardWidth + 28;
    ctx.save();
    ctx.shadowColor = 'rgba(16, 185, 129, 0.15)';
    ctx.shadowBlur = 24;
    ctx.fillStyle = isDark ? 'rgba(6, 30, 24, 0.95)' : '#ECFDF5';
    roundRect(ctx, rx, cy, cardWidth, cardHeight, 20);
    ctx.fill();
    ctx.strokeStyle = isDark ? '#10B98166' : '#A7F3D0';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Top Header Banner
    ctx.fillStyle = '#059669';
    roundRect(ctx, rx, cy, cardWidth, 60, { tl: 20, tr: 20, br: 0, bl: 0 });
    ctx.fill();

    ctx.font = '900 28px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(`✓  ${cmp.rightTitle.toUpperCase()}`, rx + 24, cy + 40);

    // Right Bullet Items - Locked minimum 28px (20pt+ equivalent)
    ctx.font = '700 28px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = isDark ? '#A7F3D0' : '#064E3B';
    cmp.rightItems.forEach((it, i) => {
      const itemY = cy + 100 + i * 105;
      ctx.fillStyle = '#10B981';
      ctx.fillText('✓', rx + 24, itemY + 24);
      ctx.fillStyle = isDark ? '#A7F3D0' : '#064E3B';
      wrapText(ctx, it, rx + 56, itemY + 24, cardWidth - 80, 36, 2);
    });
    ctx.restore();
    return;
  }

  // 5. RADIAL ECOSYSTEM / HUB-AND-SPOKE
  if (archetype === 'RADIAL_ECOSYSTEM' && slide.infographicMeta?.nodes) {
    const nodes = slide.infographicMeta.nodes;
    const satellites = nodes.satellites || [];
    const cardHeight = Math.min(h, 450);
    const cy = y + (h - cardHeight) / 2;

    // Center Hub Card
    const hubWidth = 380;
    const hubX = x + (w - hubWidth) / 2;
    const hubY = cy + (cardHeight - 170) / 2;

    ctx.save();
    ctx.shadowColor = `${primaryAccent}40`;
    ctx.shadowBlur = 30;
    const hubGrad = ctx.createLinearGradient(hubX, hubY, hubX + hubWidth, hubY + 170);
    hubGrad.addColorStop(0, primaryAccent);
    hubGrad.addColorStop(1, secondaryAccent);
    ctx.fillStyle = hubGrad;
    roundRect(ctx, hubX, hubY, hubWidth, 170, 24);
    ctx.fill();

    ctx.font = '900 30px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    wrapText(ctx, nodes.centerNode, hubX + hubWidth / 2, hubY + 75, hubWidth - 40, 36, 2);
    ctx.restore();

    // 4 Satellite Cards in Corners
    const satW = (w - hubWidth - 60) / 2;
    const satH = (cardHeight - 30) / 2;

    satellites.slice(0, 4).forEach((sat, i) => {
      const isRightCol = i % 2 === 1;
      const isBottomRow = i >= 2;
      const sx = isRightCol ? hubX + hubWidth + 30 : x;
      const sy = isBottomRow ? cy + satH + 30 : cy;

      ctx.save();
      ctx.fillStyle = isDark ? '#0F172A' : '#FFFFFF';
      roundRect(ctx, sx, sy, satW, satH, 16);
      ctx.fill();
      ctx.strokeStyle = isDark ? `${primaryAccent}40` : `${primaryAccent}30`;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.font = '800 26px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = isDark ? '#FFFFFF' : '#0F172A';
      wrapText(ctx, sat.title, sx + 20, sy + 44, satW - 40, 32, 1);

      ctx.font = '600 24px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = isDark ? '#CBD5E1' : '#334155';
      wrapText(ctx, sat.desc, sx + 20, sy + 90, satW - 40, 30, 2);
      ctx.restore();
    });
    return;
  }

  // 6. TIMELINE ROADMAP
  if (archetype === 'TIMELINE_ROADMAP' && slide.infographicMeta?.phases) {
    const phases = slide.infographicMeta.phases;
    const count = phases.length;
    const gap = 18;
    const cardWidth = (w - (count - 1) * gap) / count;
    const cardHeight = Math.min(h, 450);
    const startY = y + (h - cardHeight) / 2;

    phases.forEach((p, idx) => {
      const cx = x + idx * (cardWidth + gap);
      const cy = startY;
      const col = idx % 2 === 0 ? primaryAccent : secondaryAccent;

      ctx.save();
      ctx.shadowColor = isDark ? 'rgba(0,0,0,0.5)' : 'rgba(15,23,42,0.08)';
      ctx.shadowBlur = 24;
      ctx.fillStyle = isDark ? '#0F172A' : '#FFFFFF';
      roundRect(ctx, cx, cy, cardWidth, cardHeight, 18);
      ctx.fill();

      // Top Phase Header
      ctx.fillStyle = col;
      roundRect(ctx, cx, cy, cardWidth, 54, { tl: 18, tr: 18, br: 0, bl: 0 });
      ctx.fill();

      ctx.font = '900 24px "Plus Jakarta Sans", monospace';
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.fillText(p.phase.toUpperCase(), cx + cardWidth / 2, cy + 36);

      // Milestone Title - Locked 28px
      ctx.font = '800 28px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = isDark ? '#FFFFFF' : '#0F172A';
      wrapText(ctx, p.milestone, cx + cardWidth / 2, cy + 105, cardWidth - 28, 34, 2);

      // Desc - Locked minimum 26px (20pt+ equivalent)
      ctx.font = '600 26px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = isDark ? '#CBD5E1' : '#334155';
      wrapText(ctx, p.desc, cx + cardWidth / 2, cy + 190, cardWidth - 28, 34, 5);
      ctx.restore();
    });
    return;
  }

  // 7. DEFAULT BENTO GRID / MULTI-CARD LAYOUT (With Locked 28px-32px Font Sizes)
  let rawList = slide.infographicPoints && slide.infographicPoints.length > 0
    ? [...slide.infographicPoints]
    : [
        'Pelaksanaan kerangka kerja berstruktur untuk automasi pintar.',
        'Pengukuhan kawalan integriti data dan privasi maklumat.',
        'Pemberdayaan bakat modal insan ke arah kecemerlangan operasi.',
      ];

  // Intelligently flatten and split any points containing pipe (|), newlines, or numbered subtopics
  let points: string[] = [];
  for (const raw of rawList) {
    if (!raw || !raw.trim()) continue;
    // Filter out single tags like "Lecture 3", "Kuliah 1", etc.
    if (/^(lecture|kuliah|bab|chapter|part|slaid)\s*\d+$/i.test(raw.trim())) {
      continue;
    }
    if (raw.includes('|')) {
      points.push(...raw.split('|').map(s => s.trim()).filter(Boolean));
    } else if (raw.includes('\n')) {
      points.push(...raw.split('\n').map(s => s.trim()).filter(Boolean));
    } else if (/\d+\.\d+\s+/.test(raw) && raw.split(/\d+\.\d+\s+/).length > 2) {
      const matches = raw.match(/\d+\.\d+[^0-9|•\n]+/g);
      if (matches && matches.length > 1) {
        points.push(...matches.map(s => s.trim()));
      } else {
        points.push(raw.trim());
      }
    } else {
      points.push(raw.trim());
    }
  }

  // If after splitting there is still only 1 point with commas, split on commas
  if (points.length === 1 && points[0].includes(',')) {
    const rawParts = points[0].split(/,| and /i).map(s => s.trim()).filter(Boolean);
    if (rawParts.length >= 3) {
      points = [
        `${rawParts[0]} & ${rawParts[1] || ''}: Pelaksanaan teras dan strategi berfokuskan keberhasilan mampan.`,
        `${rawParts[2]} & ${rawParts[3] || ''}: Pengukuhan model perancangan dan kawalan berkualiti tinggi.`,
        `${rawParts.slice(4).join(' & ') || 'Kriteria Penilaian'}: Perlindungan aset dan kriteria pertumbuhan jangka panjang.`
      ];
    }
  }

  if (points.length < 2) {
    const slideTitle = slide.title || 'Strategi Pelaksanaan';
    points = [
      `Pengenalan & Kerangka Kerja: Memperincikan prinsip asas dan struktur strategik bagi ${slideTitle}.`,
      `Pelaksanaan Berstruktur: Penyelarasan proses operasi untuk menjamin kualiti dan hasil optimum.`,
      `Pemantauan & Kawalan: Pengukuhan tadbir urus dan kriteria penilaian jangka panjang.`
    ];
  }

  const cardCount = Math.min(points.length, 4);
  const cardSpacing = cardCount >= 4 ? 14 : 20;
  const cardHeight = Math.floor((h - (cardCount - 1) * cardSpacing) / cardCount);

  points.slice(0, 4).forEach((point, idx) => {
    const cardY = y + idx * (cardHeight + cardSpacing);
    const col = idx === 0 ? primaryAccent : idx === 1 ? secondaryAccent : idx === 2 ? '#10B981' : '#F59E0B';

    // Glowing Card Container
    ctx.save();
    ctx.shadowColor = isDark ? 'rgba(0,0,0,0.5)' : 'rgba(15, 23, 42, 0.08)';
    ctx.shadowBlur = 22;
    ctx.shadowOffsetY = 6;

    // Card background
    ctx.fillStyle = isDark ? '#0F172A' : '#FFFFFF';
    roundRect(ctx, x, cardY, w, cardHeight, 18);
    ctx.fill();

    // Left Colored Accent Border
    ctx.fillStyle = col;
    roundRect(ctx, x, cardY, 10, cardHeight, { tl: 18, tr: 0, br: 0, bl: 18 });
    ctx.fill();

    // Subtle Card Outline
    ctx.strokeStyle = isDark ? `${col}40` : `${col}30`;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();

    // Accent Number Pill
    const pillSize = cardCount >= 4 ? 52 : 60;
    const pillX = x + 24;
    const pillY = cardY + (cardHeight - pillSize) / 2;

    const pillGrad = ctx.createLinearGradient(pillX, pillY, pillX + pillSize, pillY + pillSize);
    pillGrad.addColorStop(0, col);
    pillGrad.addColorStop(1, `${col}CC`);

    ctx.save();
    ctx.fillStyle = pillGrad;
    roundRect(ctx, pillX, pillY, pillSize, pillSize, 14);
    ctx.fill();

    // Number Text
    ctx.font = `900 ${cardCount >= 4 ? 24 : 28}px "Plus Jakarta Sans", monospace`;
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.fillText(`0${idx + 1}`, pillX + pillSize / 2, pillY + (cardCount >= 4 ? 35 : 40));
    ctx.textAlign = 'left';
    ctx.restore();

    // Parse subtopic vs description if present (e.g. "Title: Desc")
    const colonIdx = point.indexOf(':');
    const textX = pillX + pillSize + 24;
    const maxTextWidth = w - (pillSize + 72);

    if (colonIdx > 0 && colonIdx < 60) {
      const subTitle = point.substring(0, colonIdx).trim();
      const subDesc = point.substring(colonIdx + 1).trim();

      ctx.save();
      // Locked Title font size: 30px-34px bold
      ctx.font = `800 ${cardCount >= 4 ? 28 : 32}px "Plus Jakarta Sans", sans-serif`;
      ctx.fillStyle = isDark ? '#FFFFFF' : '#0F172A';
      ctx.fillText(subTitle, textX, cardY + (cardCount >= 4 ? 38 : 44));

      // Locked Body font size: 26px-28px (>= 20pt)
      ctx.font = `600 ${cardCount >= 4 ? 24 : 28}px "Plus Jakarta Sans", sans-serif`;
      ctx.fillStyle = isDark ? '#CBD5E1' : '#334155';
      wrapText(ctx, subDesc, textX, cardY + (cardCount >= 4 ? 74 : 86), maxTextWidth, 34, cardCount >= 4 ? 2 : 3);
      ctx.restore();
    } else {
      ctx.save();
      // Locked Single point font size: 28px-30px (>= 20pt)
      ctx.font = `700 ${cardCount >= 4 ? 26 : 30}px "Plus Jakarta Sans", sans-serif`;
      ctx.fillStyle = isDark ? '#F8FAFC' : '#0F172A';
      wrapText(ctx, point, textX, cardY + (cardHeight > 110 ? 50 : 42), maxTextWidth, 36, cardCount >= 4 ? 2 : 3);
      ctx.restore();
    }
  });
}

/**
 * Draws dynamic MCQ Quiz layout with Question container & 4 Option Cards
 */
function drawMCQQuizLayout(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  slide: SlideData,
  scheme: any,
  isDark: boolean,
  primaryAccent: string,
  secondaryAccent: string
) {
  if (!slide.mcqDetails) return;

  // 1. Question Container Card
  const questionHeight = 150;
  ctx.save();
  ctx.shadowColor = isDark ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.08)';
  ctx.shadowBlur = 24;
  ctx.shadowOffsetY = 8;

  ctx.fillStyle = isDark ? '#0F172A' : '#FFFFFF';
  roundRect(ctx, x, y, w, questionHeight, 20);
  ctx.fill();

  const qBorder = ctx.createLinearGradient(x, y, x + w, y);
  qBorder.addColorStop(0, primaryAccent);
  qBorder.addColorStop(1, secondaryAccent);
  ctx.strokeStyle = qBorder;
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.restore();

  // Question Text - Locked 34px Bold
  ctx.font = '800 34px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = isDark ? '#FFFFFF' : '#0F172A';
  wrapText(ctx, slide.mcqDetails.question, x + 30, y + 60, w - 60, 44, 2);

  // 2. 4 Options in 2x2 Grid or 4 Stacked Rows
  const optStartY = y + questionHeight + 24;
  const optGap = 18;
  const optHeight = 100;
  const colWidth = (w - optGap) / 2;

  slide.mcqDetails.options.forEach((opt, idx) => {
    const row = Math.floor(idx / 2);
    const col = idx % 2;
    const optX = x + col * (colWidth + optGap);
    const optY = optStartY + row * (optHeight + optGap);

    // Option Box
    ctx.save();
    ctx.fillStyle = isDark ? 'rgba(30, 41, 59, 0.85)' : '#FFFFFF';
    roundRect(ctx, optX, optY, colWidth, optHeight, 16);
    ctx.fill();

    ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Option Letter Pill (A, B, C, D)
    const letterSize = 52;
    const lx = optX + 18;
    const ly = optY + (optHeight - letterSize) / 2;

    ctx.fillStyle = isDark ? '#334155' : '#E2E8F0';
    roundRect(ctx, lx, ly, letterSize, letterSize, 12);
    ctx.fill();

    ctx.font = '900 26px "Plus Jakarta Sans", monospace';
    ctx.fillStyle = primaryAccent;
    ctx.textAlign = 'center';
    ctx.fillText(opt.label, lx + letterSize / 2, ly + 36);
    ctx.textAlign = 'left';

    // Option Text - Locked 28px Bold (>= 20pt)
    ctx.font = '700 28px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = isDark ? '#F1F5F9' : '#0F172A';
    wrapText(ctx, opt.text, lx + letterSize + 20, optY + 44, colWidth - (letterSize + 50), 34, 2);
    ctx.restore();
  });
}

/**
 * Draws high-fidelity 3D Presenter Avatar customized to the user's config.
 * Intelligently isolates and renders the uploaded character sheet or draws an executive 3D avatar.
 */
async function draw3DPresenterAvatar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  config: SetupConfig,
  slide: SlideData,
  isLeft: boolean,
  primaryAccent: string,
  secondaryAccent: string
) {
  const charName = (config.characterSheet?.characterName || config.nametagText || 'DR. AIMAN').toUpperCase();

  ctx.save();

  // 1. If user uploaded a Character Sheet image, extract and render the real character cleanly
  if (config.characterSheet?.imageUrl) {
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = config.characterSheet.imageUrl;
      await new Promise<void>((resolve) => {
        if (img.complete && img.naturalWidth > 0) {
          resolve();
        } else {
          img.onload = () => resolve();
          img.onerror = () => resolve();
        }
      });

      if (img.naturalWidth > 0 && img.naturalHeight > 0) {
        // Multi-view sheet detection (3-pose turnaround sheets have width > height * 1.15)
        const isMultiViewSheet = img.naturalWidth > img.naturalHeight * 1.15;
        
        let cropX = 0;
        let cropY = 0;
        let cropW = img.naturalWidth;
        let cropH = img.naturalHeight;

        if (isMultiViewSheet) {
          // Extract the primary front-facing pose (center portion of turnaround sheet)
          cropX = Math.round(img.naturalWidth * 0.28);
          cropW = Math.round(img.naturalWidth * 0.44);
          cropY = 0;
          cropH = img.naturalHeight;
        }

        // Process transparency / chroma isolation on offscreen canvas
        const offCanvas = document.createElement('canvas');
        offCanvas.width = cropW;
        offCanvas.height = cropH;
        const offCtx = offCanvas.getContext('2d');

        if (offCtx) {
          offCtx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);
          const imgData = offCtx.getImageData(0, 0, cropW, cropH);
          const data = imgData.data;

          // Sample corner color to detect white / solid light background
          const cornerR = data[0];
          const cornerG = data[1];
          const cornerB = data[2];
          const isLightBg = cornerR > 215 && cornerG > 215 && cornerB > 215;

          if (isLightBg) {
            // Smoothly remove solid light background with soft anti-aliased threshold
            for (let i = 0; i < data.length; i += 4) {
              const r = data[i];
              const g = data[i + 1];
              const b = data[i + 2];
              const brightness = (r + g + b) / 3;

              if (brightness > 240) {
                data[i + 3] = 0; // Fully transparent
              } else if (brightness > 218) {
                // Feather edge
                const alphaFactor = (240 - brightness) / 22;
                data[i + 3] = Math.round(data[i + 3] * alphaFactor);
              }
            }
            offCtx.putImageData(imgData, 0, 0);
          }

          // Calculate standing scale & positioning
          const targetHeight = Math.min(760, 1080 * 0.72);
          const aspect = cropW / cropH;
          const targetWidth = Math.min(460, targetHeight * aspect);
          const drawX = cx - targetWidth / 2;
          const drawY = 1045 - targetHeight;

          // Ambient floor contact shadow
          const shadowGrad = ctx.createRadialGradient(cx, 1055, 20, cx, 1055, targetWidth * 0.65);
          shadowGrad.addColorStop(0, 'rgba(0, 0, 0, 0.45)');
          shadowGrad.addColorStop(0.5, 'rgba(0, 0, 0, 0.15)');
          shadowGrad.addColorStop(1, 'transparent');
          ctx.fillStyle = shadowGrad;
          ctx.beginPath();
          ctx.ellipse(cx, 1055, targetWidth * 0.55, 25, 0, 0, Math.PI * 2);
          ctx.fill();

          // Ambient studio rim back-glow behind character
          const backGlow = ctx.createRadialGradient(cx, drawY + targetHeight * 0.45, 40, cx, drawY + targetHeight * 0.45, 340);
          backGlow.addColorStop(0, `${primaryAccent}2A`);
          backGlow.addColorStop(0.6, `${secondaryAccent}10`);
          backGlow.addColorStop(1, 'transparent');
          ctx.fillStyle = backGlow;
          ctx.fillRect(cx - 350, drawY - 50, 700, targetHeight + 100);

          // Draw the high-resolution isolated presenter
          ctx.drawImage(offCanvas, drawX, drawY, targetWidth, targetHeight);

          // Executive Floating Acrylic Nametag Badge
          if (config.useNametag) {
            const nametagX = isLeft ? cx - 80 : cx - 120;
            const nametagY = Math.min(1000, drawY + targetHeight * 0.78);

            ctx.font = '900 20px "Plus Jakarta Sans", monospace';
            const textWidth = ctx.measureText(charName).width;
            const tagW = textWidth + 44;
            const tagH = 42;

            // Glassmorphic badge background
            ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
            roundRect(ctx, nametagX, nametagY, tagW, tagH, 10);
            ctx.fill();

            // Accent border
            ctx.strokeStyle = primaryAccent;
            ctx.lineWidth = 2;
            ctx.stroke();

            // Speaker icon dot
            ctx.fillStyle = '#10B981';
            ctx.beginPath();
            ctx.arc(nametagX + 20, nametagY + tagH / 2, 5, 0, Math.PI * 2);
            ctx.fill();

            // Text
            ctx.fillStyle = '#FFFFFF';
            ctx.fillText(charName, nametagX + 34, nametagY + 28);
          }

          ctx.restore();
          return;
        }
      }
    } catch (e) {
      console.warn('Could not process characterSheet image, using procedural avatar:', e);
    }
  }

  // 2. Procedural High-Craft Executive Presenter (When no image is uploaded)
  // Ambient Floor Contact Shadow
  const shadowGrad = ctx.createRadialGradient(cx, 1060, 20, cx, 1060, 260);
  shadowGrad.addColorStop(0, 'rgba(0,0,0,0.45)');
  shadowGrad.addColorStop(0.5, 'rgba(0,0,0,0.15)');
  shadowGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = shadowGrad;
  ctx.beginPath();
  ctx.ellipse(cx, 1055, 220, 30, 0, 0, Math.PI * 2);
  ctx.fill();

  // Torso / Attire (Tailored Executive Blazer in Brand Palette)
  const isFemale = config.characterSheet?.gender === 'Wanita' || slide.ethnicity === 'Melayu berhijab';
  const shirtGrad = ctx.createLinearGradient(cx - 160, cy - 50, cx + 160, cy + 350);
  shirtGrad.addColorStop(0, '#1E3A8A');
  shirtGrad.addColorStop(0.5, '#1E40AF');
  shirtGrad.addColorStop(1, '#0F172A');

  const skinGrad = ctx.createLinearGradient(cx - 50, cy - 120, cx + 50, cy - 30);
  if (slide.ethnicity === 'Cina') {
    skinGrad.addColorStop(0, '#FEF08A');
    skinGrad.addColorStop(1, '#FDE047');
  } else if (slide.ethnicity === 'India') {
    skinGrad.addColorStop(0, '#B45309');
    skinGrad.addColorStop(1, '#92400E');
  } else {
    skinGrad.addColorStop(0, '#FED7AA');
    skinGrad.addColorStop(1, '#FDBA74');
  }

  // Executive Suit Body
  ctx.fillStyle = shirtGrad;
  ctx.beginPath();
  ctx.moveTo(cx - 150, cy - 20);
  ctx.quadraticCurveTo(cx - 165, cy + 200, cx - 175, cy + 420);
  ctx.lineTo(cx + 175, cy + 420);
  ctx.quadraticCurveTo(cx + 165, cy + 200, cx + 150, cy - 20);
  ctx.closePath();
  ctx.fill();

  // Dark Pants (Thigh-up)
  ctx.fillStyle = '#0F172A';
  ctx.fillRect(cx - 170, cy + 420, 340, 180);

  // Blazer Lapels & White Shirt Collar
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.moveTo(cx - 40, cy - 35);
  ctx.lineTo(cx, cy + 50);
  ctx.lineTo(cx + 40, cy - 35);
  ctx.closePath();
  ctx.fill();

  // Tie or Silk Scarf
  ctx.fillStyle = primaryAccent;
  ctx.beginPath();
  ctx.moveTo(cx - 16, cy - 15);
  ctx.lineTo(cx + 16, cy - 15);
  ctx.lineTo(cx + 22, cy + 120);
  ctx.lineTo(cx, cy + 150);
  ctx.lineTo(cx - 22, cy + 120);
  ctx.closePath();
  ctx.fill();

  // Lapel folds
  ctx.fillStyle = '#172554';
  ctx.beginPath();
  ctx.moveTo(cx - 110, cy - 20);
  ctx.lineTo(cx - 30, cy + 160);
  ctx.lineTo(cx, cy + 180);
  ctx.lineTo(cx + 30, cy + 160);
  ctx.lineTo(cx + 110, cy - 20);
  ctx.lineTo(cx + 70, cy - 20);
  ctx.lineTo(cx, cy + 110);
  ctx.lineTo(cx - 70, cy - 20);
  ctx.closePath();
  ctx.fill();

  // Nametag Badge on Chest
  if (config.useNametag) {
    const nametagX = isLeft ? cx + 25 : cx - 145;
    const nametagY = cy + 60;

    ctx.font = '900 18px "Plus Jakarta Sans", monospace';
    const tagW = ctx.measureText(charName).width + 30;

    ctx.fillStyle = '#FFFFFF';
    roundRect(ctx, nametagX, nametagY, tagW, 34, 8);
    ctx.fill();
    ctx.strokeStyle = '#0F172A';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#0F172A';
    ctx.fillText(charName, nametagX + 15, nametagY + 24);
  }

  // 3D Head & Face
  ctx.fillStyle = skinGrad;
  ctx.fillRect(cx - 45, cy - 90, 90, 70);

  ctx.beginPath();
  ctx.ellipse(cx, cy - 160, 105, 125, 0, 0, Math.PI * 2);
  ctx.fill();

  if (slide.ethnicity === 'Melayu berhijab') {
    // Elegant Corporate Hijab
    ctx.fillStyle = primaryAccent;
    ctx.beginPath();
    ctx.arc(cx, cy - 160, 120, Math.PI * 0.7, Math.PI * 2.3);
    ctx.lineTo(cx + 90, cy + 30);
    ctx.lineTo(cx - 90, cy + 30);
    ctx.closePath();
    ctx.fill();

    // Hijab inner face frame
    ctx.fillStyle = skinGrad;
    ctx.beginPath();
    ctx.ellipse(cx, cy - 150, 75, 95, 0, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // Stylized Modern Hair
    ctx.fillStyle = '#1E293B';
    ctx.beginPath();
    ctx.arc(cx, cy - 185, 110, Math.PI * 0.9, Math.PI * 2.1);
    ctx.quadraticCurveTo(cx + 105, cy - 150, cx + 95, cy - 110);
    ctx.lineTo(cx - 95, cy - 110);
    ctx.quadraticCurveTo(cx - 105, cy - 150, cx - 110, cy - 185);
    ctx.closePath();
    ctx.fill();
  }

  // 3D Eyes
  drawEye(ctx, cx - 40, cy - 165);
  drawEye(ctx, cx + 40, cy - 165);

  // Glasses frames if professional
  if (config.characterSheet?.specs?.includes('cermin mata') || !isFemale) {
    ctx.strokeStyle = '#0F172A';
    ctx.lineWidth = 3.5;
    ctx.strokeRect(cx - 62, cy - 185, 45, 38);
    ctx.strokeRect(cx + 17, cy - 185, 45, 38);
    ctx.beginPath();
    ctx.moveTo(cx - 17, cy - 165);
    ctx.lineTo(cx + 17, cy - 165);
    ctx.stroke();
  }

  // Warm Confident Smile
  ctx.strokeStyle = '#9F1239';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(cx, cy - 115, 36, 0.15 * Math.PI, 0.85 * Math.PI);
  ctx.stroke();

  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(cx, cy - 115, 32, 0.25 * Math.PI, 0.75 * Math.PI);
  ctx.fill();

  // Dynamic Gestures (Smart Laser Pointer / Explanatory Hand)
  ctx.strokeStyle = shirtGrad;
  ctx.lineWidth = 44;
  ctx.lineCap = 'round';

  // Left arm
  ctx.beginPath();
  ctx.moveTo(cx - 140, cy);
  ctx.lineTo(cx - (isLeft ? 190 : 220), cy + 130);
  ctx.stroke();

  // Right active pointing arm
  ctx.beginPath();
  ctx.moveTo(cx + 140, cy);
  ctx.lineTo(cx + (isLeft ? 260 : 190), cy + 90);
  ctx.stroke();

  // Hand with Smart Stylus Pen
  ctx.fillStyle = skinGrad;
  ctx.beginPath();
  ctx.arc(cx + (isLeft ? 280 : 200), cy + 100, 32, 0, Math.PI * 2);
  ctx.fill();

  // Glowing presentation stylus
  ctx.strokeStyle = primaryAccent;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(cx + (isLeft ? 290 : 210), cy + 100);
  ctx.lineTo(cx + (isLeft ? 370 : 260), cy + 30);
  ctx.stroke();

  // Stylus laser tip glow
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(cx + (isLeft ? 370 : 260), cy + 30, 8, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawEye(ctx: CanvasRenderingContext2D, ex: number, ey: number) {
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.ellipse(ex, ey, 18, 22, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#78350F';
  ctx.beginPath();
  ctx.arc(ex + 2, ey, 12, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#0F172A';
  ctx.beginPath();
  ctx.arc(ex + 2, ey, 6, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(ex - 2, ey - 4, 4, 0, Math.PI * 2);
  ctx.fill();
}

function drawFloatingAccentBadge(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  c1: string,
  c2: string,
  slideNum: number
) {
  ctx.save();
  ctx.shadowColor = `${c1}55`;
  ctx.shadowBlur = 24;
  ctx.shadowOffsetY = 6;

  const bg = ctx.createLinearGradient(x, y, x + 60, y + 60);
  bg.addColorStop(0, c1);
  bg.addColorStop(1, c2);

  ctx.fillStyle = bg;
  roundRect(ctx, x, y, 60, 60, 16);
  ctx.fill();

  // White icon star/sparkle
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(x + 30, y + 30, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

// Helpers
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number | { tl: number; tr: number; br: number; bl: number }
) {
  let radii = { tl: 0, tr: 0, br: 0, bl: 0 };
  if (typeof r === 'number') {
    radii = { tl: r, tr: r, br: r, bl: r };
  } else {
    radii = { ...radii, ...r };
  }

  ctx.beginPath();
  ctx.moveTo(x + radii.tl, y);
  ctx.lineTo(x + w - radii.tr, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radii.tr);
  ctx.lineTo(x + w, y + h - radii.br);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radii.br, y + h);
  ctx.lineTo(x + radii.bl, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radii.bl);
  ctx.lineTo(x, y + radii.tl);
  ctx.quadraticCurveTo(x, y, x + radii.tl, y);
  ctx.closePath();
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines: number = 3
) {
  const words = text.split(' ');
  let line = '';
  let linesCount = 0;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      linesCount++;
      if (linesCount === maxLines && n < words.length - 1) {
        ctx.fillText(line.trim() + '...', x, y);
        return;
      }
      ctx.fillText(line, x, y);
      line = words[n] + ' ';
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, y);
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Intelligent background removal & alpha matte extraction for 3D Character Sheets.
 * Automatically samples studio/backdrop edges, calculates color Euclidean distance,
 * and feather-keys out solid white/grey backdrops while keeping avatar clothing,
 * suit, face, hair, and fine silhouette intact.
 */
function extractPoseWithTransparentBackground(
  img: HTMLImageElement,
  sx: number,
  sy: number,
  sw: number,
  sh: number
): HTMLCanvasElement {
  const offCanvas = document.createElement('canvas');
  offCanvas.width = sw;
  offCanvas.height = sh;
  const offCtx = offCanvas.getContext('2d');
  if (!offCtx) return offCanvas;

  offCtx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
  const imgData = offCtx.getImageData(0, 0, sw, sh);
  const data = imgData.data;

  // Sample top, bottom, and outer edge pixels to identify the backdrop color
  let bgR = 0;
  let bgG = 0;
  let bgB = 0;
  let sampleCount = 0;

  // 1. Sample along top border (usually pure backdrop)
  for (let x = 0; x < sw; x += Math.max(1, Math.floor(sw / 12))) {
    for (let y = 0; y < Math.min(sh, 25); y += 4) {
      const idx = (y * sw + x) * 4;
      bgR += data[idx];
      bgG += data[idx + 1];
      bgB += data[idx + 2];
      sampleCount++;
    }
  }

  // 2. Sample along left & right borders
  for (let y = 0; y < sh; y += Math.max(1, Math.floor(sh / 20))) {
    const leftIdx = (y * sw + 2) * 4;
    bgR += data[leftIdx];
    bgG += data[leftIdx + 1];
    bgB += data[leftIdx + 2];
    sampleCount++;

    const rightIdx = (y * sw + Math.max(0, sw - 3)) * 4;
    bgR += data[rightIdx];
    bgG += data[rightIdx + 1];
    bgB += data[rightIdx + 2];
    sampleCount++;
  }

  bgR = sampleCount > 0 ? Math.round(bgR / sampleCount) : 255;
  bgG = sampleCount > 0 ? Math.round(bgG / sampleCount) : 255;
  bgB = sampleCount > 0 ? Math.round(bgB / sampleCount) : 255;

  const tolerance = 46; // Distance in RGB space
  const feather = 26;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    if (a === 0) continue;

    const diffR = r - bgR;
    const diffG = g - bgG;
    const diffB = b - bgB;
    const dist = Math.sqrt(diffR * diffR + diffG * diffG + diffB * diffB);

    // Also detect neutral studio whites/greys common in AI character sheets
    const isBrightStudioNeutral = r > 235 && g > 235 && b > 235 && Math.abs(r - g) < 18 && Math.abs(g - b) < 18;

    if (dist < tolerance || isBrightStudioNeutral) {
      data[i + 3] = 0; // Transparent
    } else if (dist < tolerance + feather) {
      const factor = (dist - tolerance) / feather;
      data[i + 3] = Math.round(a * factor);
    }
  }

  offCtx.putImageData(imgData, 0, 0);
  return offCanvas;
}

