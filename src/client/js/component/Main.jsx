// Main.jsx
import React from 'react';
import styled from 'styled-components';
import * as dat from 'dat.gui';

import loadScriptTag from '../resource/loadScriptTag.js';

export class Main extends React.PureComponent {
  canvas = React.createRef();
  gui = null;
  controlObject = {
    enableVideo: false,
    effects: {},
  };
  controlUIObject = {
    enableVideo: null,
    Effects: null,
    effects: {},
  };

  handleDeepARInited = () => {
    this.controlUIObject.enableVideo = this.gui
      .add(this.controlObject, 'enableVideo')
      .onChange(() => {
        if (this.controlObject.enableVideo) {
          this.deepAR.startVideo(true);
        } else {
          this.deepAR.stopVideo();
        }
      });
    /*
    // load the aviators effect on the first face into slot 'slot'
    this.deepAR.switchEffect(0, 'slot', './aviators', function() {
      // effect loaded
    });
    */
  };

  async componentDidMount() {
    this.gui = new dat.GUI({ hideable: true, closed: false, closeOnTop: true });
    const canvas = this.canvas.current;
    await loadScriptTag({
      id: 'deepar-js',
      src: 'lib/deepar.js',
    });
    // eslint-disable-next-line no-undef
    this.deepAR = DeepAR({
      licenseKey: process.env.DEEPAR_KEY,
      canvasWidth: canvas.clientWidth,
      canvasHeight: canvas.clientHeight,
      canvas,
      segmentationInfoZip: 'lib/segmentation.zip',
      numberOfFaces: 1, // how many faces we want to track min 1, max 4
      onInitialize: this.handleDeepARInited,
    });
    this.deepAR.downloadFaceTrackingModel('model/models-68-extreme.bin');
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
