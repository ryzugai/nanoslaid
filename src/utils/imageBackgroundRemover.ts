/**
 * Fast & High-Fidelity Client-Side Background Removal (Border-Connected BFS Alpha Isolation)
 * Automatically isolates avatar characters by removing solid backdrop colors ONLY from the outside perimeter.
 * Internal body parts (white shirt, teeth, light skin, light gray blazer) are 100% protected and remain opaque.
 */

export async function processImageTransparency(
  imageUrl: string,
  tolerance = 36
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
        const totalPixels = width * height;

        // Check if image already has transparent background
        let transparentCornerCount = 0;
        const checkCorners = [0, width - 1, (height - 1) * width, (height - 1) * width + (width - 1)];
        for (const idx of checkCorners) {
          if (data[idx * 4 + 3] < 50) transparentCornerCount++;
        }
        if (transparentCornerCount >= 3) {
          // Already transparent PNG
          resolve(imageUrl);
          return;
        }

        // Sample background color along top, left, right borders
        let totalR = 0;
        let totalG = 0;
        let totalB = 0;
        let sampleCount = 0;

        // Top border sample
        for (let x = 0; x < width; x += Math.max(1, Math.floor(width / 20))) {
          const idx = x * 4;
          if (data[idx + 3] > 200) {
            totalR += data[idx];
            totalG += data[idx + 1];
            totalB += data[idx + 2];
            sampleCount++;
          }
        }
        // Left and right border samples (top half)
        for (let y = 0; y < Math.floor(height * 0.7); y += Math.max(1, Math.floor(height / 20))) {
          const lIdx = (y * width) * 4;
          const rIdx = (y * width + (width - 1)) * 4;
          if (data[lIdx + 3] > 200) {
            totalR += data[lIdx];
            totalG += data[lIdx + 1];
            totalB += data[lIdx + 2];
            sampleCount++;
          }
          if (data[rIdx + 3] > 200) {
            totalR += data[rIdx];
            totalG += data[rIdx + 1];
            totalB += data[rIdx + 2];
            sampleCount++;
          }
        }

        if (sampleCount === 0) {
          resolve(imageUrl);
          return;
        }

        const bgR = Math.round(totalR / sampleCount);
        const bgG = Math.round(totalG / sampleCount);
        const bgB = Math.round(totalB / sampleCount);

        const tolSq = tolerance * tolerance;
        const visited = new Uint8Array(totalPixels);
        const isBackground = new Uint8Array(totalPixels);
        const queue: number[] = [];

        // Helper to check color match with background
        const isBgColor = (pxIdx: number): boolean => {
          const i4 = pxIdx * 4;
          if (data[i4 + 3] < 30) return true; // already transparent
          const r = data[i4];
          const g = data[i4 + 1];
          const b = data[i4 + 2];
          const distSq = (r - bgR) ** 2 + (g - bgG) ** 2 + (b - bgB) ** 2;
          return distSq <= tolSq;
        };

        // Seed BFS strictly from outer border pixels
        for (let x = 0; x < width; x++) {
          // Top row
          const topPx = x;
          if (!visited[topPx] && isBgColor(topPx)) {
            visited[topPx] = 1;
            isBackground[topPx] = 1;
            queue.push(topPx);
          }
          // Bottom row (only if matching bg)
          const botPx = (height - 1) * width + x;
          if (!visited[botPx] && isBgColor(botPx)) {
            visited[botPx] = 1;
            isBackground[botPx] = 1;
            queue.push(botPx);
          }
        }

        for (let y = 0; y < height; y++) {
          // Left col
          const leftPx = y * width;
          if (!visited[leftPx] && isBgColor(leftPx)) {
            visited[leftPx] = 1;
            isBackground[leftPx] = 1;
            queue.push(leftPx);
          }
          // Right col
          const rightPx = y * width + (width - 1);
          if (!visited[rightPx] && isBgColor(rightPx)) {
            visited[rightPx] = 1;
            isBackground[rightPx] = 1;
            queue.push(rightPx);
          }
        }

        // Run BFS Connected Component traversal
        let head = 0;
        while (head < queue.length) {
          const cur = queue[head++];
          const cx = cur % width;
          const cy = Math.floor(cur / width);

          // 4-connected neighbors
          const neighbors = [
            cy > 0 ? cur - width : -1, // Up
            cy < height - 1 ? cur + width : -1, // Down
            cx > 0 ? cur - 1 : -1, // Left
            cx < width - 1 ? cur + 1 : -1, // Right
          ];

          for (const next of neighbors) {
            if (next >= 0 && !visited[next]) {
              visited[next] = 1;
              if (isBgColor(next)) {
                isBackground[next] = 1;
                queue.push(next);
              }
            }
          }
        }

        // Apply transparency strictly to visited background pixels
        for (let p = 0; p < totalPixels; p++) {
          if (isBackground[p]) {
            data[p * 4 + 3] = 0; // Transparent background
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

