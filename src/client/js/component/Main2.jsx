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
  nextTick = null;
  workers = {
    render: null,
    faceDetection: null,
  };
  captureObjects = {
    lastTime: Date.now(),
    mediaStream: null,
    videoTrack: null,
    imageCapture: null,
    lastImageBitmap: null,
  };
  detectObjects = {
    lastTime: Date.now(),
    lastDetectedImageBitmap: null,
    faceData: null,
  };

  controlObject = {
    capturing: {
      shouldCapture: false,
      fps: 60,
      facingUser: true,
    },
    detecting: {
      shouldDetect: false,
      fps: 20,
      needFaceDots: false,
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
    ui.detecting.shouldDetect = ui.Detecting.add(
      control.detecting,
      'shouldDetect'
    ).onChange(() => {
      if (control.detecting.shouldDetect) {
        this.startDetecting();
      }
    });
    ui.detecting.fps = ui.Detecting.add(control.detecting, 'fps')
      .min(1)
      .max(60);

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

  // https://stackoverflow.com/a/19772220/2605764
  animation = () => {
    this.nextTick = window.requestAnimationFrame(this.animation);
    const now = Date.now();
    const control = this.controlObject;

    if (control.capturing.shouldCapture) {
      const capture = this.captureObjects;
      const captureInterval = 1000 / control.capturing.fps;
      const captureElapsed = now - capture.lastTime;
      if (captureElapsed > captureInterval) {
        capture.lastTime = now - (captureElapsed % captureInterval);
        this.captureImage();
      }
    }

    if (control.detecting.shouldDetect) {
      const detect = this.detectObjects;
      const fps = control.detecting.fps * control.detecting.skipFrame + 1;
      const detectInterval = 1000 / fps;
      const detectElapsed = now - detect.lastTime;
      if (detectElapsed > detectInterval) {
        detect.lastTime = now - (detectElapsed % detectInterval);
        this.detectFace();
      }
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
    this.setState({ canvasHeight: `${height}px` });
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
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('startCapturing() error:', error);
    }
  };
  stopCapturing = () => {
    this.captureObjects.imageCapture = null;
    this.captureObjects.mediaStream?.getTracks().forEach(t => t.stop());
    this.captureObjects.videoTrack = null;
    this.captureObjects.mediaStream = null;
  };
  captureImage = async () => {
    try {
      const imageBitmap = await this.captureObjects.imageCapture?.grabFrame();
      if (imageBitmap) {
        this.workers.render?.postMessage({
          type: 'input-frame',
          payload: {
            imageBitmap,
            // faceData: this.detectObjects.faceData,
            deformConfig: this.controlObject.deforming,
          },
        });
        this.captureObjects.lastImageBitmap?.close();
        this.captureObjects.lastImageBitmap = imageBitmap;
      }
    } catch (error) {
      // silent error came from grabing too fast.
      // eslint-disable-next-line no-console
      error && console.log('captureImage() error:', error);
    }
  };

  startDetecting = () => {
    if (!this.workers.faceDetection) {
      this.workers.faceDetection = new Worker(faceDetectionWorkerFileName, {
        type: 'module',
      });
      this.workers.faceDetection.addEventListener(
        'message',
        this.faceDetectionWorkerMessageHandler
      );
    }
  };
  faceDetectionWorkerMessageHandler = ({ data }) => {
    this.faceData = data;

    if (data?.isNewFaceMeshes) {
      // eslint-disable-next-line no-console
      console.log('faceData:', data);
    }
  };
  detectFace = () => {
    const control = this.controlObject;
    const imageBitmap = this.captureObjects.lastImageBitmap;
    const lastImageBitmap = this.detectObjects.lastDetectedImageBitmap;
    if (imageBitmap && imageBitmap !== lastImageBitmap) {
      this.workers.faceDetection?.postMessage({
        type: 'input-frame',
        payload: {
          imageBitmap,
          faceLandmarkConfig: control.detecting,
        },
      });
      this.detectObjects.lastDetectedImageBitmap = imageBitmap;
    }
  };

  componentDidMount = () => {
    this.initDatGui();
    this.handleWindowResize();
    window.addEventListener('resize', this.handleWindowResize);
    this.animation();
  };

  componentWillUnmount = () => {
    this.cancelAnimationFrame(this.nextTick);

    this.stopCapturing();

    //this.workers.render?.removeEventListener('message', this.workerMessageHandler);
    this.workers.render?.terminate();
    this.workers.render = null;
    this.workers.faceDetection?.removeEventListener(
      'message',
      this.faceDetectionWorkerMessageHandler
    );
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
