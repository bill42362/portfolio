// renderFrame.js

const sizes = {
  width: 1280,
  height: 720,
};
const canvas = new OffscreenCanvas(sizes.width, sizes.height);
const webglContext = canvas.getContext('webgl2');
let isRendererBusy = false;
let outputBitmap = null;
const renderFrame = ({ imageBitmap, humanDetectedResult }) => {
  if (isRendererBusy) return outputBitmap;
  isRendererBusy = true;

  if (!webglContext || !humanDetectedResult) {
    outputBitmap = imageBitmap;
    isRendererBusy = false;
    return outputBitmap;
  }

  outputBitmap = imageBitmap;
  isRendererBusy = false;
  return outputBitmap;
};

export default renderFrame;
