// Main.jsx
import React from 'react';
import styled from 'styled-components';
import throttle from 'lodash/throttle';
import * as dat from 'dat.gui';
import { Scene, WebGLRenderer, PerspectiveCamera, AxesHelper } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export class Main extends React.PureComponent {
  canvas = React.createRef();
  gui = null;
  camera = null;
  scene = null;
  renderer = null;
  rendererControls = null;
  controls = null;
  clock = null;
  nextTick = null;

  initThree = () => {
    const renderer = new WebGLRenderer({
      canvas: this.canvas.current,
      antialias: true,
    });
    this.renderer = renderer;
    renderer.physicallyCorrectLights = true;
    //renderer.toneMapping = THREE.ReinhardToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.shadowMap.enabled = true;
    //renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setClearColor(0x222f3e);
    this.rendererControls = this.gui.addFolder('Renderer');
    this.rendererControls.add(this.renderer, 'physicallyCorrectLights');
    this.rendererControls
      .add(this.renderer, 'toneMappingExposure')
      .min(0)
      .max(5)
      .step(0.01);
    this.rendererControls
      .add(this.renderer.shadowMap, 'enabled')
      .name('shadowMapEnabled');
    this.handleWindowResize();
  };

  tick = () => {
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
    this.nextTick = window.requestAnimationFrame(this.tick);
  };

  handleWindowResize = throttle(() => {
    if (!this.canvas.current) {
      return;
    }
    const canvas = this.canvas.current;
    const renderer = this.renderer;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    if (!this.camera) {
      this.camera = new PerspectiveCamera(75, width / height, 0.1, 100);
      this.camera.position.set(0, 0, -4);

      this.controls = new OrbitControls(this.camera, canvas);
      this.controls.enableDamping = true;
    } else {
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
    }
  }, 100);

  componentDidMount() {
    this.gui = new dat.GUI({ hideable: true, closed: false, closeOnTop: true });
    this.scene = new Scene();
    this.scene.add(new AxesHelper(1));
    this.initThree();
    this.tick();
    window.addEventListener('resize', this.handleWindowResize);
  }

  componentWillUnmount() {
    if (this.gui) {
      this.gui.destory();
    }
    window.cancelAnimationFrame(this.nextTick);
    window.removeEventListener('resize', this.handleWindowResize);
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
