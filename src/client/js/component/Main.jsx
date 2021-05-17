// Main.jsx
import React from 'react';
import styled from 'styled-components';
import * as dat from 'dat.gui';
import throttle from 'lodash/throttle';

import {
  Webcam,
  Player,
  Dom,
  Effect,
} from '../../../lib/banuba/bin/BanubaSDK.js';

const isProd = 'production' === process.env.NODE_ENV;
const banubaFileBase = isProd ? 'lib/banuba/' : '../../../lib/banuba/';

const banubaEffectKeys = [
  'Makeup',
  'test_BG',
  'test_Hair',
  'test_Lips',
  'test_Lips_glitter',
  'test_Lips_shine',
];

export class Main extends React.PureComponent {
  state = { containerHeight: `${(window.innerWidth * 9) / 16}px` };
  banubaContainer = React.createRef();
  gui = null;
  isWebcamApplied = false;
  webcam = null;
  player = null;
  banubaEffects = {};
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

  initBanubaControls = () => {
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

    this.controlUIObject.Effects = this.gui.addFolder('Effects');
    banubaEffectKeys.forEach(effectKey => {
      this.controlObject.effects[effectKey] = false;
      this.controlUIObject.effects[effectKey] =
        this.controlUIObject.Effects.add(
          this.controlObject.effects,
          effectKey
        ).onChange(() => {
          this.player.clearEffect();
          banubaEffectKeys.forEach(effectKey => {
            if (!this.controlObject.effects[effectKey]) {
              return;
            }
            if (!this.banubaEffects[effectKey]) {
              this.banubaEffects[effectKey] = new Effect(
                `${banubaFileBase}effects/${effectKey}.zip`
              );
            }
            this.player.applyEffect(this.banubaEffects[effectKey]);
          });
        });
    });
  };

  async componentDidMount() {
    this.gui = new dat.GUI({ hideable: true, closed: false, closeOnTop: true });
    this.player = await Player.create({
      clientToken: process.env.BANUBA_TOKEN,
      locateFile: {
        'BanubaSDK.data': `${banubaFileBase}bin/BanubaSDK.data`,
        'BanubaSDK.wasm': `${banubaFileBase}bin/BanubaSDK.wasm`,
        'BanubaSDK.simd.wasm': `${banubaFileBase}bin/BanubaSDK.simd.wasm`,
      },
    });
    this.webcam = new Webcam();
    Dom.render(this.player, this.banubaContainer.current);

    this.initBanubaControls();
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

  > canvas {
    width: 100%;
    height: 100%;
  }
`;

export default Main;
