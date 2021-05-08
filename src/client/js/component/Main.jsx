// Main.jsx
import React from 'react';
import styled from 'styled-components';
import * as dat from 'dat.gui';

const deformWorkerFileName =
  window.deformWorkerFileName || '../js/deformWorker.js';
const captureContraints = {
  audio: true,
  video: { width: 1280, height: 720, facingMode: 'user' },
};

export class Main extends React.PureComponent {
  canvas = React.createRef();
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
      // eslint-disable-next-line no-console
      console.log('captureImage() imageBitmap:', imageBitmap);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('captureImage() error:', error);
    }
    if (this.controlObject.shouldCapture) {
      this.captureTick = window.requestAnimationFrame(this.captureImage);
    }
  };

  workerMessageHandler = message => {
    // eslint-disable-next-line no-console
    console.log('message:', message);
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

  componentDidMount() {
    this.gui = new dat.GUI({ hideable: true, closed: false, closeOnTop: true });
    this.worker = new Worker(deformWorkerFileName, { type: 'module' });
    this.worker.addEventListener('message', this.workerMessageHandler);

    this.controlUIObject.shouldCapture = this.gui
      .add(this.controlObject, 'shouldCapture')
      .onChange(() => {
        if (this.controlObject.shouldCapture) {
          this.startCapturing();
        } else {
          this.mediaStream?.getTracks().forEach(t => t.stop());
        }
      });
  }

  componentWillUnmount() {
    this.mediaStream?.getTracks().forEach(t => t.stop());
    this.gui.destory();
    this.worker.removeEventListener('message', this.workerMessageHandler);
    this.worker.terminate();
    window.cancelAnimationFrame(this.captureTick);
  }

  render() {
    return (
      <StyledMain>
        <Canvas ref={this.canvas} />
      </StyledMain>
    );
  }
}

const StyledMain = styled.div`
  flex: auto;
`;

const Canvas = styled.canvas`
  width: 100%;
  height: 100%;
  background-color: #222f3e;
`;

export default Main;
