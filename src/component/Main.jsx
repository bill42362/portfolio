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
  WebGL1Renderer,
  PerspectiveCamera,
  AxesHelper,
  DirectionalLight,
  DirectionalLightHelper,
  LoadingManager,
  TextureLoader,
  Clock,
  // ACESFilmicToneMapping,
  PCFSoftShadowMap,
  CameraHelper,
  RepeatWrapping,
  //MirroredRepeatWrapping,
  //NearestFilter,
} from 'three';

import isWebAssemblySupported from '../resource/isWebAssemblySupported.js';
import loadScriptTag from '../resource/loadScriptTag.js';

import {
  Horkeukamui160 as Horkeukamui,
  BodyNormal,
  Body2Normal,
  ClothNormal,
  Cloth23Normal,
  englishMap,
} from '../resource/horkeukamuiVariables.js';
import WaveMotion from '../public/motion/wavefile_v2.vmd';

const loadingManager = new LoadingManager();
loadingManager.addHandler(/\.dds$/i, new DDSLoader());
const textureLoader = new TextureLoader(loadingManager);
const mmdLoader = new MMDLoader(loadingManager);
const initControlKeys = [
  'fundoshiBack',
  'fundoshiFront',
  'penis',
  'bigFundoshiFront',
  'bigPenis',
];
const lightControlsConfigs = {
  intensity: { min: 0, max: 5, step: 0.001 },
  shadowIntensity: { min: 0, max: 1, step: 0.001 },
  shadowBoundry: { min: 0, max: 10, step: 0.01 },
  needShadowHelper: {},
  positionX: { min: -5, max: 5, step: 0.01 },
  positionY: { min: -5, max: 5, step: 0.01 },
  positionZ: { min: -5, max: 5, step: 0.01 },
};
const normalMapParing = {
  'tex\\body.dds': BodyNormal,
  'tex\\body2.dds': Body2Normal,
  'tex\\cloth.dds': ClothNormal,
  'tex\\cloth2.dds': Cloth23Normal,
  'tex\\cloth3.dds': Cloth23Normal,
};

let dat = null;

export class Main extends React.PureComponent {
  canvas = React.createRef();
  gui = null;
  camera = null;
  cameraControls = null;
  scene = null;
  light = null;
  lightWithShadow = null;
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
    light: {
      intensity: 3.5,
      shadowIntensity: 0.5,
      shadowBoundry: 4,
      needShadowHelper: false,
      positionX: -3,
      positionY: 4,
      positionZ: 2,
    },
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
    Light: null,
    light: {},
    Horkeukamui: null,
    HorkeukamuiMorphs: null,
    horkeukamui: {
      morphs: {},
    },
  };

  updateLights = () => {
    const {
      intensity,
      shadowIntensity,
      shadowBoundry,
      needShadowHelper,
      positionX,
      positionY,
      positionZ,
    } = this.controlObject.light;
    this.light.intensity = intensity * (1 - shadowIntensity);
    this.light.position.set(positionX, positionY, positionZ);
    this.lightHelper.update();

    this.lightWithShadow.intensity = intensity * shadowIntensity;
    this.lightWithShadow.position.set(positionX, positionY, positionZ);
    this.lightWithShadow.castShadow = !!shadowIntensity;
    this.shadowHelper.visible = needShadowHelper && !!shadowIntensity;

    const camera = this.lightWithShadow.shadow.camera;
    camera.left = -shadowBoundry;
    camera.right = shadowBoundry;
    camera.top = shadowBoundry;
    camera.bottom = -shadowBoundry;
    camera.updateProjectionMatrix();
    this.shadowHelper.update();
    window.requestAnimationFrame(this.renderNextFrame);
  };

  initScene = () => {
    this.scene = new Scene();
    this.scene.add(new AxesHelper(1));

    const light = new DirectionalLight('#ffffff', 2);
    light.castShadow = false;
    this.light = light;

    // need to set position before setup light helper.
    // otherwise the light plane position will off.
    const { positionX, positionY, positionZ } = this.controlObject.light;
    this.light.position.set(positionX, positionY, positionZ);
    this.lightHelper = new DirectionalLightHelper(light, 1);

    const lightWithShadow = light.clone();
    lightWithShadow.shadow.camera.far = 7;
    lightWithShadow.shadow.mapSize.set(1024, 1024);
    lightWithShadow.shadow.normalBias = 0.05;
    this.lightWithShadow = lightWithShadow;
    this.shadowHelper = new CameraHelper(lightWithShadow.shadow.camera);

    this.scene.add(light);
    this.scene.add(this.lightHelper);
    this.scene.add(lightWithShadow);
    this.scene.add(this.shadowHelper);

    this.controlUIObject.Light = this.gui.addFolder('Light');
    const lightControl = this.controlObject.light;
    const lightControlUI = this.controlUIObject.Light;
    Object.keys(lightControlsConfigs).forEach(configKey => {
      const config = lightControlsConfigs[configKey];
      this.controlUIObject.light[configKey] = lightControlUI.add(
        lightControl,
        configKey
      );
      if (config.step) {
        this.controlUIObject.light[configKey] = this.controlUIObject.light[
          configKey
        ]
          .min(config.min)
          .max(config.max)
          .step(config.step);
      }
      this.controlUIObject.light[configKey] = this.controlUIObject.light[
        configKey
      ].onChange(this.updateLights);
    });
  };

  initRenderer = () => {
    const renderer = new WebGL1Renderer({
      canvas: this.canvas.current,
      antialias: true,
    });
    this.renderer = renderer;
    renderer.physicallyCorrectLights = true;
    //renderer.toneMapping = ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFSoftShadowMap;
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

  updateMorphControlValues = throttle(() => {
    const morphControls = this.controlUIObject.horkeukamui.morphs;
    Object.keys(morphControls).forEach(morphKey => {
      morphControls[morphKey].updateDisplay();
    });
  }, 100);

  tick = () => {
    this.cameraControls.update();
    this.mmdAnimationHelper.update(this.clock.getDelta());
    this.renderNextFrame();
    this.updateMorphControlValues();
    if (this.animationControls.shouldAnimate) {
      this.animationFrame = window.requestAnimationFrame(this.tick);
    }
  };

  initCamera = () => {
    const canvas = this.canvas.current;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    this.camera = new PerspectiveCamera(75, width / height, 0.1, 100);
    this.camera.position.set(1, 2, 3);

    this.cameraControls = new OrbitControls(this.camera, canvas);
    this.cameraControls.target.set(0, 2, 0);
    this.cameraControls.update();
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
        const material = this.getMaterial({ name: englishMap.fundoshiBack });
        const visible = this.controlObject.horkeukamui.fundoshiBack;
        material.visible = visible;
        material.opacity = +visible;
        window.requestAnimationFrame(this.renderNextFrame);
      });
    this.controlUIObject.horkeukamui.fundoshiFront = kamuiControl
      .add(this.controlObject.horkeukamui, 'fundoshiFront')
      .onChange(() => {
        const material = this.getMaterial({ name: englishMap.fundoshiFront });
        const visible = this.controlObject.horkeukamui.fundoshiFront;
        material.visible = visible;
        material.opacity = +visible;
        this.horkeukamui.morphTargetInfluences[77] = 0.2 * +visible;
        if (visible && this.controlObject.horkeukamui.bigFundoshiFront) {
          this.controlUIObject.horkeukamui.bigFundoshiFront.setValue(false);
        }
        window.requestAnimationFrame(this.renderNextFrame);
      });
    this.controlUIObject.horkeukamui.bigFundoshiFront = kamuiControl
      .add(this.controlObject.horkeukamui, 'bigFundoshiFront')
      .onChange(() => {
        const material = this.getMaterial({
          name: englishMap.bigFundoshiFront,
        });
        const visible = this.controlObject.horkeukamui.bigFundoshiFront;
        material.visible = visible;
        material.opacity = +visible;
        if (visible && this.controlObject.horkeukamui.fundoshiFront) {
          this.controlUIObject.horkeukamui.fundoshiFront.setValue(false);
        }
        window.requestAnimationFrame(this.renderNextFrame);
      });
    this.controlUIObject.horkeukamui.bigPenis = kamuiControl
      .add(this.controlObject.horkeukamui, 'bigPenis')
      .onChange(() => {
        const penisMaterial = this.getMaterial({ name: englishMap.penis });
        const bigPenisMaterial = this.getMaterial({
          name: englishMap.bigPenis,
        });
        const isBigOne = this.controlObject.horkeukamui.bigPenis;
        penisMaterial.visible = !isBigOne;
        penisMaterial.opacity = +!isBigOne;
        bigPenisMaterial.visible = isBigOne;
        bigPenisMaterial.opacity = +isBigOne;
        window.requestAnimationFrame(this.renderNextFrame);
      });
    this.controlUIObject.HorkeukamuiMorphs =
      this.controlUIObject.Horkeukamui.addFolder('Morphs');
    Object.keys(this.horkeukamui.morphTargetDictionary).forEach(targetKey => {
      this.controlUIObject.horkeukamui.morphs[targetKey] =
        this.controlUIObject.HorkeukamuiMorphs.add(
          this.horkeukamui.morphTargetInfluences,
          this.horkeukamui.morphTargetDictionary[targetKey]
        )
          .min(0)
          .max(1)
          .step(0.01)
          .name(targetKey)
          .onChange(() => window.requestAnimationFrame(this.renderNextFrame));
    });
  };

  loadModels = () => {
    mmdLoader.loadWithAnimation(
      Horkeukamui,
      [WaveMotion],
      ({ mesh, animation }) => {
        mesh.scale.set(0.2, 0.2, 0.2);
        mesh.position.set(0, 0, 0);
        mesh.receiveShadow = true;
        mesh.castShadow = true;
        this.scene.add(mesh);
        window.Horkeukamui = mesh;
        this.horkeukamui = mesh;

        const anisotropy = Math.min(
          4,
          this.renderer.capabilities.getMaxAnisotropy()
        );
        mesh.material.forEach(m => {
          m.map.anisotropy = anisotropy;
          const normalMapFilename =
            normalMapParing[m.userData.MMD?.mapFileName];
          if (normalMapFilename) {
            m.normalMap = textureLoader.load(normalMapFilename);
            m.normalMap.flipY = false;
            m.normalMap.wrapS = RepeatWrapping;
            m.normalMap.wrapT = RepeatWrapping;
            m.normalMap.anisotropy = anisotropy;
          }
        });

        // prevent penis penetrate fundoshiFront.
        mesh.morphTargetInfluences[77] = 0.2;

        const penisHair = this.getMaterial({ name: englishMap.pubicHair });
        penisHair.visible = true;
        penisHair.opacity = 1;

        initControlKeys.forEach(controlKey => {
          const needDisplay = this.controlObject.horkeukamui[controlKey];
          const material = this.getMaterial({ name: englishMap[controlKey] });
          material.visible = needDisplay;
          material.opacity = +needDisplay;
        });

        this.mmdAnimationHelper.add(mesh, { animation, physics: true });
        this.mmdAnimationHelper.enable('animation', false);

        // need to be after animation since animation might change morph influences.
        this.addKamuiControlllers();

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
    this.updateLights();
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
