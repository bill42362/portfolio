// Main.jsx
import React from 'react';
import styled from 'styled-components';

const workerFile = '../js/deformWorker.js';

export class Main extends React.PureComponent {
  canvas = React.createRef();
  worker = null;

  workerMessageHandler = message => {
    // eslint-disable-next-line no-console
    console.log('message:', message);
  };

  componentDidMount() {
    this.worker = new Worker(workerFile, { type: 'module' });
    this.worker.addEventListener('message', this.workerMessageHandler);
  }

  componentWillUnmount() {
    this.worker.removeEventListener('message', this.workerMessageHandler);
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
