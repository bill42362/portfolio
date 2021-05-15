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
  loadingTimeout = null;
  animationFrame = null;
  animationControls = {
    shouldAnimate: false,
    fps: 60, // todo
  };
  animationToogleUI = null;
  horkeukamui = null;
  mmdPhysics = null;
  mmdAnimationHelper = new MMDAnimationHelper({ afterglow: 2.0 });
  controlObject = {
    horkeukamui: {
      fundoshiBack: true,
      fundoshiFront: true,
      penis: true,
      bigFundoshiFront: false,
      bigPenis: false,
      erection: 0,
    },
  };
  controlUIObject = {
    Horkeukamui: null,
    horkeukamui: {},
  };

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

  getMaterial = ({ name }) => {
    return this.horkeukamui.material.find(m => name === m.name);
  };

  addKamuiControlllers = () => {
    this.controlUIObject.Horkeukamui = this.gui.addFolder('Horkeukamui');
    const kamuiControl = this.controlUIObject.Horkeukamui;
    this.controlUIObject.horkeukamui.fundoshiBack = kamuiControl
      .add(this.controlObject.horkeukamui, 'fundoshiBack')
      .onChange(() => {
        const material = this.getMaterial({ name: '屁股兜' });
        const visible = this.controlObject.horkeukamui.fundoshiBack;
        material.visible = visible;
        material.opacity = +visible;
        window.requestAnimationFrame(this.renderNextFrame);
      });
    this.controlUIObject.horkeukamui.fundoshiFront = kamuiControl
      .add(this.controlObject.horkeukamui, 'fundoshiFront')
      .onChange(() => {
        const material = this.getMaterial({ name: '肚兜' });
        const visible = this.controlObject.horkeukamui.fundoshiFront;
        material.visible = visible;
        material.opacity = +visible;
        this.horkeukamui.morphTargetInfluences[77] = 0.2 * +visible;
        window.requestAnimationFrame(this.renderNextFrame);
      });
  };

  loadModels = () => {
    mmdLoader.loadWithAnimation(
      Horkeukamui160,
      [WaveMotion],
      ({ mesh, animation }) => {
        mesh.scale.set(0.2, 0.2, 0.2);
        mesh.position.set(0, 0, 0);
        this.scene.add(mesh);
        window.Horkeukamui = mesh;
        this.horkeukamui = mesh;

        // prevent penis penetrate fundoshi.
        mesh.morphTargetInfluences[77] = 0.2;

        const kamuiObject = this.controlObject.horkeukamui;
        const penisHair = this.getMaterial({ name: '丁毛' });
        penisHair.visible = true;
        penisHair.opacity = 1;

        const needPenis = kamuiObject.penis;
        const penis = this.getMaterial({ name: '小丁丁' });
        penis.visible = needPenis;
        penis.opacity = +needPenis;

        const needFundoshiFront = kamuiObject.fundoshiFront;
        const fundoshiFront = this.getMaterial({ name: '肚兜' });
        fundoshiFront.visible = needFundoshiFront;
        fundoshiFront.opacity = +needFundoshiFront;

        const needBigPenis = kamuiObject.bigPenis;
        const bigPenis = this.getMaterial({ name: '大丁丁' });
        bigPenis.visible = needBigPenis;
        bigPenis.opacity = +needPenis;

        const needBigFundoshiFront = kamuiObject.bigFundoshiFront;
        const bigFundoshiFront = this.getMaterial({ name: '大丁丁肚兜' });
        bigFundoshiFront.visible = needBigFundoshiFront;
        bigFundoshiFront.opacity = +needBigFundoshiFront;

        this.addKamuiControlllers();

        this.mmdAnimationHelper.add(mesh, { animation, physics: true });
        this.mmdAnimationHelper.enable('animation', false);

        this.loadingTimeout = window.setTimeout(this.renderNextFrame, 500);
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
    window.clearTimeout(this.loadingTimeout);
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
