// Main.jsx
import React from 'react';
import styled from 'styled-components';
import * as dat from 'dat.gui';
import throttle from 'lodash/throttle';

import {
  faceLandmarkConfig,
  faceLandmarksIndex,
} from '../resource/faceLandmarkVariables.js';
import {
  getEyeRadiuses,
  getPointsVector2D,
  getVectorLength2D,
  averageTwoDots2D,
} from '../resource/getFaceMeshTransform.js';
import getMovingLeastSquareMesh from '../resource/MovingLeastSquare.js';

const renderWorkerFileName =
  window.renderWorkerFileName || '../js/renderWorker.js';
const faceDetectionWorkerFileName =
  window.faceDetectionWorkerFileName || '../js/faceDetectionWorker.js';
const captureContraints = {
  audio: true,
  video: { width: 1280, height: 720, facingMode: 'user' },
};

const cheekIndexs = faceLandmarksIndex.cheek;
const noseCenterIndexs = faceLandmarksIndex.nose.center;
const cheekSizeIndexPairs = [
  { origin: cheekIndexs.left.inner[9], target: noseCenterIndexs[8] },
  { origin: cheekIndexs.left.inner[8], target: noseCenterIndexs[8] },
  { origin: cheekIndexs.left.inner[7], target: noseCenterIndexs[6] },
  { origin: cheekIndexs.left.inner[6], target: noseCenterIndexs[6] },
  { origin: cheekIndexs.left.inner[5], target: noseCenterIndexs[4] },
  { origin: cheekIndexs.left.inner[4], target: noseCenterIndexs[4] },
  { origin: cheekIndexs.left.inner[3], target: noseCenterIndexs[0] },
  { origin: cheekIndexs.left.inner[2], target: noseCenterIndexs[0] },
  { origin: cheekIndexs.left.inner[1], target: noseCenterIndexs[0] },
  //{ origin: faceLandmarksIndex.chin.inner, target: noseCenterIndexs[0] },
  { origin: cheekIndexs.right.inner[9], target: noseCenterIndexs[8] },
  { origin: cheekIndexs.right.inner[8], target: noseCenterIndexs[8] },
  { origin: cheekIndexs.right.inner[7], target: noseCenterIndexs[6] },
  { origin: cheekIndexs.right.inner[6], target: noseCenterIndexs[6] },
  { origin: cheekIndexs.right.inner[5], target: noseCenterIndexs[4] },
  { origin: cheekIndexs.right.inner[4], target: noseCenterIndexs[4] },
  { origin: cheekIndexs.right.inner[3], target: noseCenterIndexs[0] },
  { origin: cheekIndexs.right.inner[2], target: noseCenterIndexs[0] },
  { origin: cheekIndexs.right.inner[1], target: noseCenterIndexs[0] },
];

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
      eyesSize: 1.3,
      cheekSize: 0.95,
    },
  };
  controlUIObject = {
    shouldCapture: null,
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

  makeDeformData = ({ faceMesh, deformConfig }) => {
    const circularDeforms = [];

    const dotPositions = faceMesh.dots.positions;
    const eyeRadiuses = getEyeRadiuses({ dotPositions });
    circularDeforms.push({
      origin: faceMesh.eyeCenters.left.textCoord,
      target: faceMesh.eyeCenters.left.textCoord,
      // *0.5 to map from position to textCoord
      radius: 0.5 * eyeRadiuses.left,
      ratio: deformConfig.eyesSize,
    });
    circularDeforms.push({
      origin: faceMesh.eyeCenters.right.textCoord,
      target: faceMesh.eyeCenters.right.textCoord,
      // *0.5 to map from position to textCoord
      radius: 0.5 * eyeRadiuses.right,
      ratio: deformConfig.eyesSize,
    });

    cheekSizeIndexPairs.forEach(pair => {
      const origin = faceMesh.dots.textCoords[pair.origin];
      const target = faceMesh.dots.textCoords[pair.target];
      const radius = getVectorLength2D({
        vector: getPointsVector2D({ origin, target }),
      });
      circularDeforms.push({
        origin,
        target: averageTwoDots2D(origin, target),
        radius: 0.5 * radius,
        ratio: deformConfig.cheekSize,
      });
    });

    const vectorRatio = 1 - deformConfig.cheekSize;
    const movingLeastSquarePointPairs = cheekSizeIndexPairs.map(pair => {
      const origin = faceMesh.dots.textCoords[pair.origin];
      const target = faceMesh.dots.textCoords[pair.target];
      const vector = getPointsVector2D({ origin, target });
      return {
        origin,
        target: [
          origin[0] + vectorRatio * vector[0],
          origin[1] + vectorRatio * vector[1],
        ],
      };
    });
    // add anchor to image edges
    movingLeastSquarePointPairs.push(
      { origin: [0, 0], target: [0, 0] },
      { origin: [0, 0.25], target: [0, 0.25] },
      { origin: [0, 0.5], target: [0, 0.5] },
      { origin: [0, 0.75], target: [0, 0.75] },
      { origin: [0, 1], target: [0, 1] },
      { origin: [0.25, 0], target: [0.25, 0] },
      { origin: [0.5, 0], target: [0.5, 0] },
      { origin: [0.75, 0], target: [0.75, 0] },
      { origin: [0.25, 1], target: [0.25, 1] },
      { origin: [0.5, 1], target: [0.5, 1] },
      { origin: [0.75, 1], target: [0.75, 1] },
      { origin: [1, 0], target: [1, 0] },
      { origin: [1, 0.25], target: [1, 0.25] },
      { origin: [1, 0.5], target: [1, 0.5] },
      { origin: [1, 0.75], target: [1, 0.75] },
      { origin: [1, 1], target: [1, 1] }
    );

    const movingLeastSquareMesh = getMovingLeastSquareMesh({
      pointPairs: movingLeastSquarePointPairs,
      stripCount: 100,
      alpha: 1,
    });

    return { circularDeforms, movingLeastSquareMesh };
  };

  faceDetectionWorkerMessageHandler = ({ data }) => {
    this.faceData = data;

    if (data?.faceMeshs[0]) {
      this.faceData.deformData = this.makeDeformData({
        faceMesh: data.faceMeshs[0],
        deformConfig: this.controlObject.deformConfig,
      });
    }
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
    this.controlUIObject.DeformConfig = this.gui.addFolder('DeformConfig');
    this.controlUIObject.DeformConfig.add(
      this.controlObject.deformConfig,
      'needDots'
    );
    this.controlUIObject.DeformConfig.add(
      this.controlObject.deformConfig,
      'eyesSize'
    )
      .min(0)
      .max(2)
      .step(0.01);
    this.controlUIObject.DeformConfig.add(
      this.controlObject.deformConfig,
      'cheekSize'
    )
      .min(0.8)
      .max(1.2)
      .step(0.001);
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
