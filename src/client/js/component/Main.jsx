// Main.jsx
import React from 'react';
import styled from 'styled-components';
import * as dat from 'dat.gui';
import throttle from 'lodash/throttle';

import {
  faceLandmarkConfig,
  annotationShape,
} from '../resource/faceLandmarkVariables.js';

const renderWorkerFileName =
  window.renderWorkerFileName || '../js/renderWorker.js';
const faceDetectionWorkerFileName =
  window.faceDetectionWorkerFileName || '../js/faceDetectionWorker.js';
const captureContraints = {
  audio: true,
  video: { width: 1280, height: 720, facingMode: 'user' },
};

export class Main extends React.PureComponent {
  state = { canvasHeight: '100%' };
  canvas = React.createRef();
  canvasContext = null;
  mediaStream = null;
  captureObject = null;
  renderWorker = null;
  faceDetectionWorker = null;
  controlObject = {
    shouldCapture: false,
    landmarkToggles: {},
    deformConfig: {
      needDots: false,
      eyesEnlarge: 1.1,
    },
  };
  controlUIObject = {
    shouldCapture: null,
    Landmarks: null,
    landmarkToggles: {},
    DeformConfig: null,
    deformConfig: {},
  };
  gui = null;
  captureTick = null;
  faceData = null;

  initWorkerRenderer = () => {
    const offscreenCanvas = this.canvas.current.transferControlToOffscreen();
    this.renderWorker.postMessage(
      {
        type: 'canvas',
        payload: {
          canvas: offscreenCanvas,
          sizes: captureContraints.video,
        },
      },
      [offscreenCanvas]
    );
  };

  captureImage = async () => {
    try {
      const imageBitmap = await this.captureObject?.grabFrame();
      this.renderWorker.postMessage({
        type: 'input-frame',
        payload: {
          imageBitmap,
          faceData: this.faceData,
          deformConfig: this.controlObject.deformConfig,
        },
      });
      this.faceDetectionWorker.postMessage({
        type: 'input-frame',
        payload: { imageBitmap, faceLandmarkConfig },
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('captureImage() error:', error);
    }
    if (this.controlObject.shouldCapture) {
      this.captureTick = window.requestAnimationFrame(this.captureImage);
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
    const height = (video.height * width) / video.width;
    this.setState({
      canvasHeight: `${height}px`,
    });
  }, 100);

  faceDetectionWorkerMessageHandler = ({ data }) => {
    this.faceData = data;
  };

  componentDidMount() {
    this.gui = new dat.GUI({ hideable: true, closed: false, closeOnTop: true });

    this.renderWorker = new Worker(renderWorkerFileName, { type: 'module' });
    this.initWorkerRenderer();

    this.faceDetectionWorker = new Worker(faceDetectionWorkerFileName, {
      type: 'module',
    });
    this.faceDetectionWorker.addEventListener(
      'message',
      this.faceDetectionWorkerMessageHandler
    );

    this.controlUIObject.shouldCapture = this.gui
      .add(this.controlObject, 'shouldCapture')
      .onChange(() => {
        if (this.controlObject.shouldCapture) {
          this.startCapturing();
        } else {
          this.mediaStream?.getTracks().forEach(t => t.stop());
        }
      });
    this.controlUIObject.faceSkipFrame = this.gui
      .add(faceLandmarkConfig, 'skipFrame')
      .min(0)
      .max(60)
      .step(1)
      .name('faceSkipFrame');
    this.controlUIObject.Landmarks = this.gui.addFolder('Landmarks');
    Object.keys(annotationShape).forEach(landmarkKey => {
      this.controlObject.landmarkToggles[landmarkKey] = false;
      this.controlUIObject.landmarkToggles[landmarkKey] =
        this.controlUIObject.Landmarks.add(
          this.controlObject.landmarkToggles,
          landmarkKey
        );
    });
    this.controlUIObject.DeformConfig = this.gui.addFolder('DeformConfig');
    this.controlUIObject.DeformConfig.add(
      this.controlObject.deformConfig,
      'eyesEnlarge'
    )
      .min(0)
      .max(2)
      .step(0.01);
    this.controlUIObject.DeformConfig.add(
      this.controlObject.deformConfig,
      'needDots'
    );
    this.handleWindowResize();
    window.addEventListener('resize', this.handleWindowResize);
  }

  componentWillUnmount() {
    this.mediaStream?.getTracks().forEach(t => t.stop());
    this.gui.destory();

    this.renderWorker.removeEventListener('message', this.workerMessageHandler);
    this.renderWorker.terminate();

    this.faceDetectionWorker.removeEventListener(
      'message',
      this.faceDetectionWorkerMessageHandler
    );
    this.faceDetectionWorker.terminate();

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
