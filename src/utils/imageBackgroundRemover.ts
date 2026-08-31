/**
 * Clean Multi-Pass Alpha Matting Background Remover
 * - Multi-corner and perimeter sampling for backdrop color & gradients
 * - Euclidean + Lightness-based color distance with smooth feathering
 * - Breadth-First-Search flood fill to preserve interior whites/grays (shirts, eyes, teeth, light skin)
 * - Edge defringe to remove residual color halos
 */

export interface BgRemovalOptions {
  tolerance?: number; // 20 - 70 (default: 42)
  featherRadius?: number; // 1 - 4
  defringe?: boolean;
}

export async function processImageTransparency(
  imageUrl: string,
  tolerance = 42,
  options?: BgRemovalOptions
): Promise<string> {
  return new Promise((resolve) => {
    if (!imageUrl) {
      resolve('');
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.referrerPolicy = 'no-referrer';

    img.onload = () => {
      try {
        const width = img.naturalWidth || img.width;
        const height = img.naturalHeight || img.height;
        if (!width || !height) {
          resolve(imageUrl);
          return;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) {
          resolve(imageUrl);
          return;
        }

        ctx.drawImage(img, 0, 0);
        const imgData = ctx.getImageData(0, 0, width, height);
        const data = imgData.data;
        const totalPixels = width * height;

        // 1. Check if image is already a transparent PNG (check 4 corners + 4 border midpoints)
        let transparentPoints = 0;
        const sampleCheckPoints = [
          0,
          width - 1,
          (height - 1) * width,
          (height - 1) * width + (width - 1),
          Math.floor(width / 2),
          Math.floor(height / 2) * width,
          Math.floor(height / 2) * width + (width - 1),
          (height - 1) * width + Math.floor(width / 2),
        ];

        for (const idx of sampleCheckPoints) {
          if (data[idx * 4 + 3] < 30) transparentPoints++;
        }
        if (transparentPoints >= 4) {
          // Already cleanly transparent PNG
          resolve(imageUrl);
          return;
        }

        // 2. Comprehensive border color sampling (top, left, right, bottom edges)
        const bgSamples: { r: number; g: number; b: number }[] = [];
        const stepX = Math.max(1, Math.floor(width / 30));
        const stepY = Math.max(1, Math.floor(height / 30));

        // Top & Bottom border pixels
        for (let x = 0; x < width; x += stepX) {
          const topIdx = x * 4;
          if (data[topIdx + 3] > 180) {
            bgSamples.push({ r: data[topIdx], g: data[topIdx + 1], b: data[topIdx + 2] });
          }
          const botIdx = ((height - 1) * width + x) * 4;
          if (data[botIdx + 3] > 180) {
            bgSamples.push({ r: data[botIdx], g: data[botIdx + 1], b: data[botIdx + 2] });
          }
        }

        // Left & Right border pixels
        for (let y = 0; y < height; y += stepY) {
          const leftIdx = (y * width) * 4;
          if (data[leftIdx + 3] > 180) {
            bgSamples.push({ r: data[leftIdx], g: data[leftIdx + 1], b: data[leftIdx + 2] });
          }
          const rightIdx = (y * width + (width - 1)) * 4;
          if (data[rightIdx + 3] > 180) {
            bgSamples.push({ r: data[rightIdx], g: data[rightIdx + 1], b: data[rightIdx + 2] });
          }
        }

        if (bgSamples.length === 0) {
          resolve(imageUrl);
          return;
        }

        // Compute median/average background RGB
        let totalR = 0;
        let totalG = 0;
        let totalB = 0;
        for (const s of bgSamples) {
          totalR += s.r;
          totalG += s.g;
          totalB += s.b;
        }
        const avgBgR = Math.round(totalR / bgSamples.length);
        const avgBgG = Math.round(totalG / bgSamples.length);
        const avgBgB = Math.round(totalB / bgSamples.length);

        // Detect if background is high-brightness white/light gray or green/blue studio chroma
        const isLightBg = (avgBgR + avgBgG + avgBgB) / 3 > 210;
        const effectiveTol = tolerance || (isLightBg ? 38 : 46);
        const tolSq = effectiveTol * effectiveTol;

        // BFS Visited and Background classification arrays
        const visited = new Uint8Array(totalPixels);
        const isBg = new Uint8Array(totalPixels);
        const queue: number[] = [];

        // Helper: Check if pixel matches sample background colors
        const matchesBgColor = (pxIdx: number): boolean => {
          const i4 = pxIdx * 4;
          const a = data[i4 + 3];
          if (a < 30) return true; // already transparent

          const r = data[i4];
          const g = data[i4 + 1];
          const b = data[i4 + 2];

          // Check against average background
          const dR = r - avgBgR;
          const dG = g - avgBgG;
          const dB = b - avgBgB;
          const distSq = dR * dR + dG * dG + dB * dB;
          if (distSq <= tolSq) return true;

          // For light backdrops, also check luminosity threshold if close to neutral
          if (isLightBg) {
            const minChroma = Math.max(Math.abs(r - g), Math.abs(g - b), Math.abs(r - b));
            if (minChroma < 18 && (r + g + b) / 3 >= 225) {
              return true;
            }
          }

          // Compare against edge samples for gradients
          for (let sIdx = 0; sIdx < Math.min(bgSamples.length, 12); sIdx++) {
            const sample = bgSamples[sIdx];
            const sdR = r - sample.r;
            const sdG = g - sample.g;
            const sdB = b - sample.b;
            if (sdR * sdR + sdG * sdG + sdB * sdB <= tolSq * 0.9) {
              return true;
            }
          }

          return false;
        };

        // Seed BFS strictly from outer border pixels
        for (let x = 0; x < width; x++) {
          const topPx = x;
          if (!visited[topPx] && matchesBgColor(topPx)) {
            visited[topPx] = 1;
            isBg[topPx] = 1;
            queue.push(topPx);
          }
          const botPx = (height - 1) * width + x;
          if (!visited[botPx] && matchesBgColor(botPx)) {
            visited[botPx] = 1;
            isBg[botPx] = 1;
            queue.push(botPx);
          }
        }

        for (let y = 0; y < height; y++) {
          const leftPx = y * width;
          if (!visited[leftPx] && matchesBgColor(leftPx)) {
            visited[leftPx] = 1;
            isBg[leftPx] = 1;
            queue.push(leftPx);
          }
          const rightPx = y * width + (width - 1);
          if (!visited[rightPx] && matchesBgColor(rightPx)) {
            visited[rightPx] = 1;
            isBg[rightPx] = 1;
            queue.push(rightPx);
          }
        }

        // Traverse 8-connected flood fill from boundary
        let head = 0;
        while (head < queue.length) {
          const cur = queue[head++];
          const cx = cur % width;
          const cy = Math.floor(cur / width);

          // 8-neighbor directions for cleaner smooth perimeter
          const neighbors = [
            cy > 0 ? cur - width : -1, // Up
            cy < height - 1 ? cur + width : -1, // Down
            cx > 0 ? cur - 1 : -1, // Left
            cx < width - 1 ? cur + 1 : -1, // Right
            cy > 0 && cx > 0 ? cur - width - 1 : -1, // Up-Left
            cy > 0 && cx < width - 1 ? cur - width + 1 : -1, // Up-Right
            cy < height - 1 && cx > 0 ? cur + width - 1 : -1, // Down-Left
            cy < height - 1 && cx < width - 1 ? cur + width + 1 : -1, // Down-Right
          ];

          for (const next of neighbors) {
            if (next >= 0 && !visited[next]) {
              visited[next] = 1;
              if (matchesBgColor(next)) {
                isBg[next] = 1;
                queue.push(next);
              }
            }
          }
        }

        // Apply clean transparency and soft edge alpha matting
        for (let p = 0; p < totalPixels; p++) {
          if (isBg[p]) {
            data[p * 4 + 3] = 0; // 100% transparent for background
          }
        }

        // Edge Defringing: Soften 1px boundary between transparent and opaque pixels to remove halo
        for (let y = 1; y < height - 1; y++) {
          for (let x = 1; x < width - 1; x++) {
            const p = y * width + x;
            if (!isBg[p]) {
              // Count transparent neighbors
              const nBg =
                (isBg[p - 1] ? 1 : 0) +
                (isBg[p + 1] ? 1 : 0) +
                (isBg[p - width] ? 1 : 0) +
                (isBg[p + width] ? 1 : 0);

              if (nBg >= 2) {
                // Perimeter edge pixel - soften alpha for anti-aliasing
                data[p * 4 + 3] = Math.max(120, 255 - nBg * 40);
              }
            }
          }
        }

        ctx.putImageData(imgData, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      } catch (err) {
        console.warn('Background removal error:', err);
        resolve(imageUrl);
      }
    };

    img.onerror = () => {
      resolve(imageUrl);
    };

    img.src = imageUrl;
  });
}
