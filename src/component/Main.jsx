// Main.jsx
import React from 'react';
import styled from 'styled-components';
import { Scene, WebGLRenderer, Color } from 'three';

export class Main extends React.PureComponent {
  canvas = React.createRef();
  scene = null;
  renderer = null;

  initThree = () => {
    const renderer = new WebGLRenderer({
      canvas: this.canvas.current,
      antialias: true,
    });
    this.renderer = renderer;
    renderer.physicallyCorrectLights = true;
    // renderer.setClearColor(0x222f3e);
    this.handleWindowResize();
  };

  handleWindowResize = () => {
    const renderer = this.renderer;
    const canvas = this.canvas.current;
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  };

  componentDidMount() {
    this.scene = new Scene();
    this.initThree();
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
