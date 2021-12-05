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
  Clock,
} from 'three';

import isWebAssemblySupported from '../resource/isWebAssemblySupported.js';
import loadScriptTag from '../resource/loadScriptTag.js';

import Horkeukamui160 from '../../model/Horkeukamui/Horkeukamui-160.pmx';
import WaveMotion from '../../motion/wavefile_v2.vmd';
import '../../model/Horkeukamui/tex/body_N.png';
import '../../model/Horkeukamui/tex/body.dds';
import '../../model/Horkeukamui/tex/body2_N.png';
import '../../model/Horkeukamui/tex/body2.dds';
import '../../model/Horkeukamui/tex/cloth_N.png';
import '../../model/Horkeukamui/tex/cloth.dds';
import '../../model/Horkeukamui/tex/cloth2.dds';
import '../../model/Horkeukamui/tex/cloth3.dds';
import '../../model/Horkeukamui/tex/cloth4.dds';
import '../../model/Horkeukamui/tex/cloth23_N.png';
import '../../model/Horkeukamui/tex/head.dds';
import '../../model/Horkeukamui/tex/nose.dds';
import '../../model/Horkeukamui/tex/Penis.dds';
import '../../model/Horkeukamui/tex/toon.dds';

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
  mmdPhysics = null;
  mmdAnimationHelper = new MMDAnimationHelper({ afterglow: 2.0 });

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
    this.mmdAnimationHelper.update(this.clock.getDelta());
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
    this.cameraControls.addEventListener('change', () => {
      if (!this.animationControls.shouldAnimate) {
        this.renderNextFrame();
      }
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
    mmdLoader.loadWithAnimation(
      Horkeukamui160,
      [WaveMotion],
      ({ mesh, animation }) => {
        mesh.scale.set(0.2, 0.2, 0.2);
        mesh.position.set(0, 0, 0);
        this.scene.add(mesh);
        window.Horkeukamui = mesh;
        mesh.material.forEach(material => {
          if ('屁股兜' === material.name) {
            material.visible = false;
            material.opacity = 1;
          }
          if ('丁毛' === material.name) {
            material.visible = true;
            material.opacity = 1;
          }
          if ('小丁丁' === material.name) {
            material.visible = true;
            material.opacity = 1;
          }
          if ('大丁丁' === material.name) {
            //material.visible = true;
            //material.opacity = 1;
          }
        });

        this.mmdAnimationHelper.add(mesh, { animation, physics: true });
        this.mmdAnimationHelper.enable('animation', false);

        // TODO: draw just one frame instead of animation.
        window.clearTimeout(this.stopAnimationTimeout);
        this.animationToogleUI.setValue(true);
        this.stopAnimationTimeout = setTimeout(() => {
          this.animationToogleUI.setValue(false);
        }, 5000);
      }
    );
  };

  async componentDidMount() {
    const loadAmmoPromise = loadScriptTag({
      id: 'ammo-js',
      src: isWebAssemblySupported
        ? 'library/ammo/ammo.99d0ec0.wasm.js'
        : 'library/ammo/ammo.99d0ec0.js',
    });
    dat = await import('dat.gui');
    this.gui = new dat.GUI({ hideable: true, closed: false, closeOnTop: true });
    this.clock = new Clock();
    this.initScene();
    this.initRenderer();
    this.animationToogleUI = this.gui
      .add(this.animationControls, 'shouldAnimate')
      .onChange(() => {
        if (this.animationControls.shouldAnimate) {
          this.mmdAnimationHelper.enable('animation', true);
          this.clock.start();
          this.tick();
        } else {
          this.clock.stop();
          this.mmdAnimationHelper.enable('animation', false);
        }
      });
    window.addEventListener('resize', this.handleWindowResize);
    await loadAmmoPromise;
    // Need to init ammo.js async.
    // https://github.com/mrdoob/three.js/pull/16100
    const AmmoLib = await window.Ammo();
    window.Ammo = AmmoLib;
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
