// Main.jsx
import React from 'react';
import styled from 'styled-components';
import * as dat from 'dat.gui';
import throttle from 'lodash/throttle';

import { Webcam, Player, Dom } from '../../../lib/banuba/bin/BanubaSDK.js';

const isProd = 'production' === process.env.NODE_ENV;
const banubaFileBase = isProd ? 'lib/banuba/bin/' : '../../../lib/banuba/bin/';

export class Main extends React.PureComponent {
  state = { containerHeight: `${(window.innerWidth * 9) / 16}px` };
  banubaContainer = React.createRef();
  gui = null;
  isWebcamApplied = false;
  webcam = null;
  player = null;
  controlObject = {
    enableVideo: false,
    effects: {},
  };
  controlUIObject = {
    enableVideo: null,
    Effects: null,
    effects: {},
  };

  handleWindowResize = throttle(() => {
    if (!this.banubaContainer.current) {
      return;
    }
    const banubaContainer = this.banubaContainer.current;
    const width = banubaContainer.clientWidth;
    const height = (9 * width) / 16;
    this.setState({ containerHeight: `${height}px` });
  }, 100);

  async componentDidMount() {
    this.gui = new dat.GUI({ hideable: true, closed: false, closeOnTop: true });
    this.player = await Player.create({
      clientToken: process.env.BANUBA_TOKEN,
      locateFile: {
        'BanubaSDK.data': `${banubaFileBase}BanubaSDK.data`,
        'BanubaSDK.wasm': `${banubaFileBase}BanubaSDK.wasm`,
        'BanubaSDK.simd.wasm': `${banubaFileBase}BanubaSDK.simd.wasm`,
      },
    });
    this.webcam = new Webcam();
    Dom.render(this.player, this.banubaContainer.current);

    this.controlUIObject.enableVideo = this.gui
      .add(this.controlObject, 'enableVideo')
      .onChange(() => {
        if (this.controlObject.enableVideo) {
          if (!this.isWebcamApplied) {
            this.player.use(this.webcam);
            this.isWebcamApplied = true;
          }
          this.webcam.start();
          this.player.play();
        } else {
          this.player.pause();
          this.webcam.stop();
        }
      });

    window.addEventListener('resize', this.handleWindowResize);
  }

  componentWillUnmount() {
    this.gui.destory();
    window.removeEventListener('resize', this.handleWindowResize);
  }

  render() {
    const { containerHeight } = this.state;
    return (
      <StyledMain>
        <BanubaContainer height={containerHeight} ref={this.banubaContainer} />
      </StyledMain>
    );
  }
}

const StyledMain = styled.div`
  flex: auto;
`;

const BanubaContainer = styled.div.attrs(({ height }) => ({
  style: { height },
}))`
  width: 100%;
  background-color: #222f3e;
`;

export default Main;
