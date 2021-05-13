// deform-worker.js
import Human from '@vladmandic/human';

let busy = false;
const human = new Human();

const log = (...message) => {
  //const dt = new Date();
  //const ts = `${dt.getHours().toString().padStart(2, '0')}:${dt.getMinutes().toString().padStart(2, '0')}:${dt.getSeconds().toString().padStart(2, '0')}.${dt.getMilliseconds().toString().padStart(3, '0')}`;
  // eslint-disable-next-line no-console
  if (message) console.log('Human:', ...message);
};

onmessage = async ({ data: { imageBitmap, action, config } }) => {
  if (busy) return;
  busy = true;

  switch (action) {
    case 'detect': {
      const image = new ImageData(
        new Uint8ClampedArray(imageBitmap),
        image.width,
        image.height
      );
      let result = {};
      try {
        result = await human.detect(image, config);
      } catch (error) {
        result.error = error.message;
        log('worker thread error:', error.message);
      }
      // must strip canvas from return value as it cannot be transfered from worker thread
      if (result.canvas) result.canvas = null;
      // postMessage({ result });
      // eslint-disable-next-line no-console
      console.log('result:', result);
      break;
    }
    case 'warmup':
    default:
      break;
  }

  busy = false;
};
