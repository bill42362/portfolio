// Main.jsx
import React from 'react';
import styled from 'styled-components';
import * as dat from 'dat.gui';
import throttle from 'lodash/throttle';

import {
  averageTwoDots2D,
  getPointsVector2D,
  getVectorLength2D,
} from '../resource/LinearAlgebra.js';
import { faceLandmarkConfig } from '../resource/faceLandmarkVariables.js';
import {
  getEyeRadiuses,
  cheekSizeIndexPairs,
} from '../resource/getFaceMeshTransform.js';
import getMovingLeastSquareMesh, {
  edgeAnchorPointPairs,
} from '../resource/MovingLeastSquare.js';

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
    faceRenderData: null,
  };
  deformObjects = {
    deformData: null,
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
      shrinkFactor: 4,
      needIris: faceLandmarkConfig.shouldLoadIrisModel,
    },
    deforming: {
      shouldDeformEyes: false,
      eyesSize: 1.3,
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
    ui.detecting.shouldDeformEyes = ui.Detecting.add(
      control.detecting,
      'needFaceDots'
    );

    ui.Deforming = gui.addFolder('Deforming');
    ui.deforming.shouldDeformEyes = ui.Deforming.add(
      control.deforming,
      'shouldDeformEyes'
    ).onChange(() => this.updateDeformData());
    ui.deforming.eyesSize = ui.Deforming.add(control.deforming, 'eyesSize')
      .min(0)
      .max(2)
      .step(0.01);
    ui.deforming.shouldDeformCheeks = ui.Deforming.add(
      control.deforming,
      'shouldDeformCheeks'
    ).onChange(() => this.updateDeformData());
    ui.deforming.useMlsCheekDeforming = ui.Deforming.add(
      control.deforming,
      'useMlsCheekDeforming'
    ).onChange(() => this.updateDeformData());
    ui.deforming.cheekSize = ui.Deforming.add(control.deforming, 'cheekSize')
      .min(0.8)
      .max(1.2)
      .step(0.001);
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
      const detectInterval = 1000 / control.detecting.fps;
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
            faceData: this.detectObjects.faceRenderData,
            deformData: this.deformObjects.deformData,
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

  makeFaceRenderData = ({ faceMeshs, config }) => {
    const result = {
      positions: { array: [], numComponents: 3 },
      textCoords: { array: [], numComponents: 2 },
      colors: { array: [], numComponents: 3 },
    };

    if (config.needFaceDots) {
      faceMeshs.forEach(faceMesh => {
        result.positions.array.push(...faceMesh.dots.positions);
        result.textCoords.array.push(...faceMesh.dots.textCoords);
        result.colors.array.push(...faceMesh.dots.colors);
      });
      result.positions.array = result.positions.array.flatMap(a => a);
      result.textCoords.array = result.textCoords.array.flatMap(a => a);
      result.colors.array = result.colors.array.flatMap(a => a);
    }

    return result;
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
    this.detectObjects.faceData = data;

    if (data?.isNewFaceMeshes) {
      this.detectObjects.faceRenderData = this.makeFaceRenderData({
        faceMeshs: data.faceMeshs,
        config: this.controlObject.detecting,
      });
      this.updateDeformData();
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

  makeDeformData = ({ faceMeshs, config }) => {
    if (!faceMeshs?.length) {
      return null;
    }
    const circularDeforms = faceMeshs.map(faceMesh => {
      const result = [];
      if (config.shouldDeformEyes) {
        const dotPositions = faceMesh.dots.positions;
        const eyeRadiuses = getEyeRadiuses({ dotPositions });
        const eyeCenters = faceMesh.eyeCenters;
        const leftEyeDeform = {
          origin: eyeCenters.left.textCoord,
          target: eyeCenters.left.textCoord,
          // *0.5 to map from position to textCoord
          radius: 0.5 * eyeRadiuses.left,
          ratio: config.eyesSize,
        };
        const rightEyeDeform = {
          origin: eyeCenters.right.textCoord,
          target: eyeCenters.right.textCoord,
          // *0.5 to map from position to textCoord
          radius: 0.5 * eyeRadiuses.right,
          ratio: config.eyesSize,
        };
        result.push(leftEyeDeform, rightEyeDeform);
      }
      if (config.shouldDeformCheeks && !config.useMlsCheekDeforming) {
        const dotTextCoords = faceMesh.dots.textCoords;
        const cheekDeforms = cheekSizeIndexPairs.map(pair => {
          const origin = dotTextCoords[pair.origin];
          const target = dotTextCoords[pair.target];
          const radius = getVectorLength2D({
            vector: getPointsVector2D({ origin, target }),
          });
          return {
            origin,
            target: averageTwoDots2D(origin, target),
            radius: 0.5 * radius,
            ratio: config.cheekSize,
          };
        });
        result.push(...cheekDeforms);
      }
      return result;
    });

    let meshData = {
      positions: [],
      textCoords: [],
      colors: [],
      elementIndexes: [],
    };

    if (config.shouldDeformCheeks && config.useMlsCheekDeforming) {
      const vectorRatio = 1 - config.cheekSize;
      const movingLeastSquarePointPairs = faceMeshs
        .map(faceMesh => {
          const dotTextCoords = faceMesh.dots.textCoords;
          return cheekSizeIndexPairs.map(pair => {
            const origin = dotTextCoords[pair.origin];
            const target = dotTextCoords[pair.target];
            const vector = getPointsVector2D({ origin, target });
            return {
              origin,
              target: [
                origin[0] + vectorRatio * vector[0],
                origin[1] + vectorRatio * vector[1],
              ],
            };
          });
        })
        .flatMap(a => a);

      meshData = getMovingLeastSquareMesh({
        pointPairs: movingLeastSquarePointPairs.concat(edgeAnchorPointPairs),
        stripCount: 99,
        alpha: 1,
      });
    }

    return {
      circularDeforms: circularDeforms.flatMap(a => a),
      movingLeastSquareMesh: {
        positions: { array: meshData.positions, numComponents: 3 },
        textCoords: { array: meshData.textCoords, numComponents: 3 },
        colors: { array: meshData.colors, numComponents: 3 },
        elementIndexes: { array: meshData.elementIndexes, numComponents: 1 },
      },
    };
  };
  updateDeformData = () => {
    const faceMeshs = this.detectObjects.faceData?.faceMeshs;
    const config = this.controlObject.deforming;
    this.deformObjects.deformData = this.makeDeformData({ faceMeshs, config });
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
