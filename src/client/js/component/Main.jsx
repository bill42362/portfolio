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
    makeupConfigs: {
      ['Eyebrows.color']: [0.8, 0.4, 0.2],
      ['Eyebrows.alpha']: 0.2,
      ['Eyeshadow.color']: [0.6, 0.5, 1],
      ['Eyeshadow.alpha']: 0.6,
      ['Eyeliner.color']: [0, 0, 0, 1],
      ['Eyelashes.color']: [0, 0, 0.2],
      ['Foundation.strength']: 0.8,
      ['Contour.color']: [0.3, 0.1, 0.1],
      ['Contour.alpha']: 0.3,
      ['Highlighter.color']: [1, 1, 0.6],
      ['Highlighter.alpha']: 0.2,
      ['Blush.color']: [0.7, 0.1, 0.2],
      ['Blush.alpha']: 0.4,
      ['TeethWhitening.strength']: 1,
      ['FaceMorph.eyes']: 0.4,
      ['FaceMorph.face']: 0.2,
      ['FaceMorph.nose']: 0.6,
    },
  };
  controlUIObject = {
    enableVideo: null,
    Effects: null,
    effects: {},
    MakeupConfigs: null,
    makeupConfigs: {},
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

    this.controlUIObject.MakeupConfigs = this.gui.addFolder('MakeupConfigs');
    Object.keys(this.controlObject.makeupConfigs).forEach(configKey => {
      const makeupConfigs = this.controlObject.makeupConfigs;
      if (configKey.endsWith('.color')) {
        const configKeyRoot = configKey.replace(/\.color/, '');
        this.controlUIObject.makeupConfigs =
          this.controlUIObject.MakeupConfigs.addColor(makeupConfigs, configKey)
            .name(configKeyRoot)
            .onChange(() => {
              let value = makeupConfigs[configKey].map(c => c / 255).join(' ');
              const alpha = makeupConfigs[`${configKeyRoot}.alpha`];
              if (alpha) {
                value = `${value} ${alpha}`;
              }
              this.player.callJsMethod(configKey, value);
            });
        return;
      } else if (configKey.endsWith('.alpha')) {
        this.controlUIObject.makeupConfigs =
          this.controlUIObject.MakeupConfigs.add(makeupConfigs, configKey)
            .min(0)
            .max(1)
            .step(0.01)
            .onChange(() => {
              const makeupConfigs = this.controlObject.makeupConfigs;
              const configKeyRoot = configKey.replace(/\.alpha/, '');
              const colorConfigKey = `${configKeyRoot}.color`;
              const color = makeupConfigs[colorConfigKey];
              const value = [
                ...color.map(c => c / 255),
                makeupConfigs[configKey],
              ].join(' ');
              this.player.callJsMethod(colorConfigKey, value);
            });
        return;
      }
      this.controlUIObject.makeupConfigs =
        this.controlUIObject.MakeupConfigs.add(makeupConfigs, configKey)
          .min(-2)
          .max(4)
          .step(0.01)
          .onChange(() => {
            this.player.callJsMethod(configKey, `${makeupConfigs[configKey]}`);
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
