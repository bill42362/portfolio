// Main.jsx
import React from 'react';
import styled from 'styled-components';
import throttle from 'lodash/throttle';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { MMDLoader } from 'three/examples/jsm/loaders/MMDLoader.js';
import { DDSLoader } from 'three/examples/jsm/loaders/DDSLoader.js';
import { MMDAnimationHelper } from 'three/examples/jsm/animation/MMDAnimationHelper.js';
import {
  Scene,
  WebGLRenderer,
  PerspectiveCamera,
  AxesHelper,
  DirectionalLight,
  DirectionalLightHelper,
  LoadingManager,
} from 'three';

const loadingManager = new LoadingManager();
loadingManager.addHandler(/\.dds$/i, new DDSLoader());
const mmdLoader = new MMDLoader(loadingManager);

let dat = null;

export class Main extends React.PureComponent {
  canvas = React.createRef();
  gui = null;
  camera = null;
  cameraControls = null;
  scene = null;
  light = null;
  lightControlUI = null;
  renderer = null;
  rendererControlFolder = null;
  clock = null;
  animationFrame = null;
  animationControls = {
    shouldAnimate: false,
    fps: 60, // todo
  };
  animationToogleUI = null;
  stopAnimationTimeout = null;

  initScene = () => {
    this.scene = new Scene();
    this.scene.add(new AxesHelper(1));

    const light = new DirectionalLight('#ffffff', 2);
    this.light = light;
    light.castShadow = false;
    light.shadow.camera.far = 15;
    light.shadow.mapSize.set(1024, 1024);
    light.shadow.normalBias = 0.05;
    light.position.set(-2, 3, 1);
    this.scene.add(light);
    this.scene.add(new DirectionalLightHelper(light, 1));

    this.lightControlUI = this.gui.addFolder('Light');
    this.lightControlUI.add(light, 'intensity').min(0).max(5).step(0.001);
    this.lightControlUI.add(light.position, 'x').min(-5).max(5).step(0.001);
    this.lightControlUI.add(light.position, 'y').min(-5).max(5).step(0.001);
    this.lightControlUI.add(light.position, 'z').min(-5).max(5).step(0.001);
    this.lightControlUI.add(light, 'castShadow');
  };

  initRenderer = () => {
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
    this.rendererControlFolder = this.gui.addFolder('Renderer');
    this.rendererControlFolder.add(this.renderer, 'physicallyCorrectLights');
    this.rendererControlFolder
      .add(this.renderer, 'toneMappingExposure')
      .min(0)
      .max(5)
      .step(0.01);
    this.rendererControlFolder
      .add(this.renderer.shadowMap, 'enabled')
      .name('shadowMapEnabled');
    this.initCamera();
    this.handleWindowResize();
  };

  renderNextFrame = () => {
    this.renderer.render(this.scene, this.camera);
  };

  tick = () => {
    this.cameraControls.update();
    this.renderNextFrame();
    if (this.animationControls.shouldAnimate) {
      this.animationFrame = window.requestAnimationFrame(this.tick);
    }
  };

  initCamera = () => {
    const canvas = this.canvas.current;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    this.camera = new PerspectiveCamera(75, width / height, 0.1, 100);
    this.camera.position.set(1, 2, 4);

    this.cameraControls = new OrbitControls(this.camera, canvas);
    this.cameraControls.enableDamping = true;
    this.cameraControls.addEventListener('change', () => {
      if (!this.animationControls.shouldAnimate) {
        this.renderNextFrame();
      }
    });
    this.cameraControls.addEventListener('end', () => {
      if (this.animationControls.shouldAnimate) {
        return;
      }
      this.animationToogleUI.setValue(true);
      window.clearTimeout(this.stopAnimationTimeout);
      this.stopAnimationTimeout = setTimeout(() => {
        this.animationToogleUI.setValue(false);
      }, 5000);
    });
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

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    if (!this.animationControls.shouldAnimate) {
      this.renderNextFrame();
    }
  }, 100);

  loadModels = () => {
    // eslint-disable-next-line no-console
    console.log('mmdLoader:', mmdLoader);
    // eslint-disable-next-line no-console
    console.log('MMDAnimationHelper:', MMDAnimationHelper);
  };

  async componentDidMount() {
    dat = await import('dat.gui');
    this.gui = new dat.GUI({ hideable: true, closed: false, closeOnTop: true });
    this.initScene();
    this.initRenderer();
    this.animationToogleUI = this.gui
      .add(this.animationControls, 'shouldAnimate')
      .onChange(() => {
        if (this.animationControls.shouldAnimate) {
          this.tick();
        }
      });
    window.addEventListener('resize', this.handleWindowResize);
    this.loadModels();
  }

  componentWillUnmount() {
    if (this.gui) {
      this.gui.destory();
    }
    window.cancelAnimationFrame(this.animationFrame);
    window.removeEventListener('resize', this.handleWindowResize);
    window.clearTimeout(this.stopAnimationTimeout);
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
