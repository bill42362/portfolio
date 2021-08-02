// Main.jsx
import React from 'react';
import styled from 'styled-components';
import * as dat from 'dat.gui';
import throttle from 'lodash/throttle';

import { faceLandmarkConfig } from '../resource/faceLandmarkVariables.js';

const renderWorkerFileName =
  window.renderWorkerFileName || '../js/renderWorker.js';
const faceDetectionWorkerFileName =
  window.faceDetectionWorkerFileName || '../js/faceDetectionWorker.js';
const captureContraints = {
  audio: false,
  video: { width: 1280, height: 720, facingMode: 'user' },
};

export class Main extends React.PureComponent {
  state = { canvasHeight: '100%' };
  canvas = React.createRef();
  canvasContext = null;
  workers = {
    render: null,
    faceDetection: null,
  };
  captureObjects = {
    captureTimeout: null,
    captureTick: null,
    mediaStream: null,
    videoTrack: null,
    imageCapture: null,
    lastImageBitmap: null,
  };

  controlObject = {
    capturing: {
      shouldCapture: false,
      fps: 60,
      facingUser: true,
    },
    detecting: {
      shouldDetect: false,
      skipFrame: faceLandmarkConfig.skipFrame,
      shrinkFactor: 4,
      needIris: faceLandmarkConfig.shouldLoadIrisModel,
    },
    deforming: {
      shouldDeform: false,
      shouldDeformEyes: false,
      eyeSize: 1.3,
      shouldDeformCheeks: false,
      useMlsCheekDeforming: false,
      cheekSize: 0.95,
    },
  };
  controlUIObject = {
    gui: null,
    Capturing: null,
    capturing: {},
    Detecting: null,
    detecting: {},
    Deforming: null,
    deforming: {},
  };

  initDatGui = () => {
    const gui = new dat.GUI({
      hideable: true,
      closed: false,
      closeOnTop: true,
    });
    this.controlUIObject.gui = gui;

    const control = this.controlObject;
    const ui = this.controlUIObject;

    ui.Capturing = gui.addFolder('Capturing');
    ui.capturing.shouldCapture = ui.Capturing.add(
      control.capturing,
      'shouldCapture'
    ).onChange(() => {
      if (control.capturing.shouldCapture) {
        this.startCapturing();
      } else {
        this.stopCapturing();
      }
    });
    ui.capturing.fps = ui.Capturing.add(control.capturing, 'fps')
      .min(1)
      .max(120);

    ui.Detecting = gui.addFolder('Detecting');
    ui.Deforming = gui.addFolder('Deforming');
  };
  initRendererWorker = () => {
    const offscreenCanvas = this.canvas.current.transferControlToOffscreen();
    this.workers.render = new Worker(renderWorkerFileName, { type: 'module' });
    this.workers.render.postMessage(
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

  startCapturing = async () => {
    try {
      if (!this.workers.render) {
        this.initRendererWorker();
      }
      const objects = this.captureObjects;
      objects.mediaStream = await navigator.mediaDevices.getUserMedia(
        captureContraints
      );
      objects.videoTrack = objects.mediaStream.getVideoTracks()[0];
      objects.imageCapture = new ImageCapture(objects.videoTrack);
      this.captureImage();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('startCapturing() error:', error);
    }
  };
  stopCapturing = () => {
    window.clearTimeout(this.captureObjects.captureTimeout);
    window.cancelAnimationFrame(this.captureObjects.captureTick);
    this.captureObjects.imageCapture = null;
    this.captureObjects.mediaStream?.getTracks().forEach(t => t.stop());
    this.captureObjects.videoTrack = null;
    this.captureObjects.mediaStream = null;
  };
  captureImage = async () => {
    let imageBitmap = null;
    try {
      imageBitmap = await this.captureObjects.imageCapture?.grabFrame();
      if (imageBitmap) {
        this.workers.render?.postMessage({
          type: 'input-frame',
          payload: {
            imageBitmap,
            faceData: this.faceData,
            deformConfig: this.controlObject.deforming,
          },
        });
        this.captureObjects.lastImageBitmap?.close();
        this.captureObjects.lastImageBitmap = imageBitmap;
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('captureImage() error:', error);
    }
    if (imageBitmap && this.controlObject.capturing.shouldCapture) {
      this.captureObjects.captureTimeout = window.setTimeout(() => {
        if (60 < this.controlObject.capturing.fps) {
          return this.captureImage();
        }
        this.captureObjects.captureTick = window.requestAnimationFrame(
          this.captureImage
        );
      }, 1000 / this.controlObject.capturing.fps);
    }
  };

  componentDidMount = () => {
    this.initDatGui();
    this.handleWindowResize();
    window.addEventListener('resize', this.handleWindowResize);
  };

  componentWillUnmount = () => {
    this.stopCapturing();

    //this.workers.render?.removeEventListener('message', this.workerMessageHandler);
    this.workers.render?.terminate();
    this.workers.render = null;
    //this.workers.faceDetection?.removeEventListener('message', this.workerMessageHandler);
    this.workers.faceDetection?.terminate();
    this.workers.faceDetection = null;

    window.removeEventListener('resize', this.handleWindowResize);
  };

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
