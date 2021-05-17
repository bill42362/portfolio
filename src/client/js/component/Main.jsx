// Main.jsx
import React from 'react';
import styled from 'styled-components';

import { Webcam, Player, Dom } from '../../../lib/banuba/bin/BanubaSDK.js';

const isProd = 'production' === process.env.NODE_ENV;
const banubaFileBase = isProd ? 'lib/banuba/bin/' : '../../../lib/banuba/bin/';

export class Main extends React.PureComponent {
  banubaContainer = React.createRef();

  async componentDidMount() {
    const player = await Player.create({
      clientToken: process.env.BANUBA_TOKEN,
      locateFile: {
        'BanubaSDK.data': `${banubaFileBase}BanubaSDK.data`,
        'BanubaSDK.wasm': `${banubaFileBase}BanubaSDK.wasm`,
        'BanubaSDK.simd.wasm': `${banubaFileBase}BanubaSDK.simd.wasm`,
      },
    });
    player.use(new Webcam());
    Dom.render(player, this.banubaContainer.current);
  }

  render() {
    return (
      <StyledMain>
        <BanubaContainer ref={this.banubaContainer} />
      </StyledMain>
    );
  }
}

const StyledMain = styled.div`
  flex: auto;
`;

const BanubaContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: #222f3e;
`;

export default Main;
