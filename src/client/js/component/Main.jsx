// Main.jsx
import React from 'react';
import styled from 'styled-components';
import * as dat from 'dat.gui';
import throttle from 'lodash/throttle';

const deformWorkerFileName =
  window.deformWorkerFileName || '../js/deformWorker.js';
const captureContraints = {
  audio: true,
  video: { width: 1280, height: 720, facingMode: 'user' },
};
const humanConfig = {
  backend: 'humangl',
  async: true,
  warmup: 'face',
  face: {
    enabled: true,
    maxDetected: 3,
    detector: {
      skipFrame: 21,
    },
    description: { enabled: false },
    iris: { enabled: false },
    emotion: { enabled: false },
    mesh: { enabled: true },
  },
  filter: { enabled: false },
  gesture: { enabled: false },
  mesh: { enabled: false },
  iris: { enabled: false },
  description: { enabled: false },
  emotion: { enabled: false },
  body: { enabled: false },
  hand: { enabled: false },
  object: { enabled: false },
};

export class Main extends React.PureComponent {
  state = { canvasHeight: '100%' };
  canvas = React.createRef();
  canvasContext = null;
  mediaStream = null;
  captureObject = null;
  worker = null;
  controlObject = {
    shouldCapture: false,
  };
  controlUIObject = {};
  gui = null;
  captureTick = null;

  captureImage = async () => {
    try {
      const imageBitmap = await this.captureObject?.grabFrame();
      this.worker.postMessage({
        imageBitmap,
        action: 'detect',
        config: humanConfig,
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('captureImage() error:', error);
    }
    if (this.controlObject.shouldCapture) {
      this.captureTick = window.requestAnimationFrame(this.captureImage);
    }
  };

  workerMessageHandler = ({ data }) => {
    switch (data.type) {
      case 'deformed-bitmap':
        this.canvasContext?.transferFromImageBitmap(data.imageBitmap);
        break;
      default:
        break;
    }
  };

  startCapturing = async () => {
    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia(
        captureContraints
      );
      const videoTrack = this.mediaStream.getVideoTracks()[0];
      this.captureObject = new ImageCapture(videoTrack);
      this.captureImage();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('startCapturing() error:', error);
    }
  };

  handleWindowResize = throttle(() => {
    if (!this.canvas.current) {
      return;
    }
    const canvas = this.canvas.current;
    const width = canvas.clientWidth;
    const { video } = captureContraints;
    this.setState({
      canvasHeight: `${(video.height * width) / video.width}px`,
    });
  }, 100);

  componentDidMount() {
    this.gui = new dat.GUI({ hideable: true, closed: false, closeOnTop: true });
    this.worker = new Worker(deformWorkerFileName, { type: 'module' });
    this.worker.addEventListener('message', this.workerMessageHandler);

    this.canvasContext = this.canvas.current.getContext('bitmaprenderer');

    this.controlUIObject.shouldCapture = this.gui
      .add(this.controlObject, 'shouldCapture')
      .onChange(() => {
        if (this.controlObject.shouldCapture) {
          this.startCapturing();
        } else {
          this.mediaStream?.getTracks().forEach(t => t.stop());
        }
      });
    this.controlUIObject.shouldDetectMesh = this.gui
      .add(humanConfig.face.mesh, 'enabled')
      .name('shouldDetectMesh');
    this.controlUIObject.faceSkipFrame = this.gui
      .add(humanConfig.face.detector, 'skipFrame')
      .min(0)
      .max(60)
      .step(1)
      .name('faceSkipFrame');
    this.handleWindowResize();
    window.addEventListener('resize', this.handleWindowResize);
  }

  componentWillUnmount() {
    this.mediaStream?.getTracks().forEach(t => t.stop());
    this.gui.destory();
    this.worker.removeEventListener('message', this.workerMessageHandler);
    this.worker.terminate();
    window.cancelAnimationFrame(this.captureTick);
    window.removeEventListener('resize', this.handleWindowResize);
  }

  render() {
    const { canvasHeight } = this.state;
    return (
      <StyledMain>
        <Canvas height={canvasHeight} ref={this.canvas} />
      </StyledMain>
    );
  }
}

const StyledMain = styled.div`
  flex: auto;
`;

const Canvas = styled.canvas.attrs(({ height }) => ({
  style: { height },
}))`
  width: 100%;
  background-color: #222f3e;
`;

export default Main;
