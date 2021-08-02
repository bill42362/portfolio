// renderWorker.js
import renderFrame, { initRenderer } from './resource/renderFrame.js';

const log = (...message) => {
  // eslint-disable-next-line no-console
  if (message) console.log('renderWorker:', ...message);
};

let bitmaprenderer = null;
onmessage = async ({ data: { type, payload } }) => {
  switch (type) {
    case 'canvas': {
      const { canvas, sizes } = payload;
      canvas.width = sizes.width;
      canvas.height = sizes.height;
      initRenderer({ sizes });
      bitmaprenderer = canvas.getContext('bitmaprenderer');
      log('renderer inited');
      break;
    }
    case 'input-frame': {
      const { imageBitmap, faceData, deformConfig } = payload;

      if (faceData && deformConfig) {
        const outputBitmap = await renderFrame({
          imageBitmap,
          faceData,
          deformConfig,
        });

        if (outputBitmap) {
          bitmaprenderer.transferFromImageBitmap(outputBitmap);
          outputBitmap.close();
        }
      } else {
        bitmaprenderer.transferFromImageBitmap(imageBitmap);
      }

      imageBitmap.close();
      break;
    }
    case 'warmup':
    default:
      break;
  }
};
