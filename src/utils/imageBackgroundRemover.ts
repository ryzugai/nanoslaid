/**
 * Fast & High-Fidelity Client-Side Background Removal (Alpha Cutout)
 * Automatically isolates avatar characters by removing solid white, dark, light-gray, or chroma backgrounds.
 */

export async function processImageTransparency(
  imageUrl: string,
  tolerance = 38
): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.referrerPolicy = 'no-referrer';

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) {
          resolve(imageUrl);
          return;
        }

        ctx.drawImage(img, 0, 0);
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;
        const width = canvas.width;
        const height = canvas.height;

        // Sample background color from four corners and top edges
        const samplePoints = [
          [0, 0],
          [width - 1, 0],
          [0, height - 1],
          [width - 1, height - 1],
          [Math.floor(width / 2), 0],
          [0, Math.floor(height / 2)],
          [width - 1, Math.floor(height / 2)],
        ];

        let totalR = 0;
        let totalG = 0;
        let totalB = 0;
        let sampleCount = 0;

        for (const [sx, sy] of samplePoints) {
          const idx = (sy * width + sx) * 4;
          const a = data[idx + 3];
          if (a > 200) {
            totalR += data[idx];
            totalG += data[idx + 1];
            totalB += data[idx + 2];
            sampleCount++;
          }
        }

        // If corners are already transparent, return early
        if (sampleCount === 0) {
          resolve(imageUrl);
          return;
        }

        const bgR = totalR / sampleCount;
        const bgG = totalG / sampleCount;
        const bgB = totalB / sampleCount;

        // Flood-fill / Color distance alpha thresholding
        const tolSq = tolerance * tolerance;
        const featherDist = 18;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const a = data[i + 3];

          if (a === 0) continue;

          // Euclidean color distance from background
          const distSq = (r - bgR) ** 2 + (g - bgG) ** 2 + (b - bgB) ** 2;

          // Check for pure white or light grey default
          const isWhiteBg = bgR > 235 && bgG > 235 && bgB > 235 && r > 230 && g > 230 && b > 230;

          if (distSq <= tolSq || isWhiteBg) {
            data[i + 3] = 0; // Pure Transparent
          } else if (distSq < (tolerance + featherDist) ** 2) {
            // Feather edge smooth transition
            const alphaFactor = (Math.sqrt(distSq) - tolerance) / featherDist;
            data[i + 3] = Math.max(0, Math.min(a, Math.round(a * alphaFactor)));
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
