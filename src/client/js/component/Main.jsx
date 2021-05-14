// Main.jsx
import React from 'react';
import styled from 'styled-components';
import * as dat from 'dat.gui';
import throttle from 'lodash/throttle';

import loadScriptTag from '../resource/loadScriptTag.js';

export class Main extends React.PureComponent {
  state = { canvasHeight: `${(window.innerWidth * 9) / 16}px` };
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
    this.handleWindowResize();
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

  handleWindowResize = throttle(() => {
    if (!this.canvas.current) {
      return;
    }
    const canvas = this.canvas.current;
    const width = canvas.clientWidth;
    const height = (9 * width) / 16;
    this.setState({
      canvasHeight: `${height}px`,
    });
    this.deepAR.setCanvasSize(width, height);
  }, 100);

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
    window.addEventListener('resize', this.handleWindowResize);
  }

  componentWillUnmount() {
    this.gui.destory();
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
