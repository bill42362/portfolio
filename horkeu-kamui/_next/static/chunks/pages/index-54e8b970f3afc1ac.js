(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[405],{5557:function(a,b,c){(window.__NEXT_P=window.__NEXT_P||[]).push(["/",function(){return c(543)}])},543:function(a,b,c){"use strict";c.r(b),c.d(b,{"__N_SSG":function(){return ak},default:function(){return al}});var d=c(7297),e=c(5893),f=c(2125),g=c(5697),h=c.n(g),i=c(4111),j=c(7568),k=c(1438),l=c(2951),m=c(4924),n=c(8029),o=c(460),p=c(4051),q=c.n(p),r=c(7294),s=c(3493),t=c.n(s),u=c(9365),v=c(410),w=c(992),x=c(6036),y=c(9477),z=c(2670),A=function(){try{if("object"==typeof WebAssembly&&"function"==typeof WebAssembly.instantiate){var a=new WebAssembly.Module(Uint8Array.of(0,97,115,109,1,0,0,0));if((0,z.Z)(a,WebAssembly.Module))return(0,z.Z)(new WebAssembly.Instance(a),WebAssembly.Instance)}}catch(b){}return!1}(),B=A,C=c(9534),D=function(){return null},E=function(a){var b=a.id,c=(a.async,a.type),d=void 0===c?"text/javascript":c,e=a.onError,f=void 0===e?D:e,g=a.onLoad,h=void 0===g?D:g,i=(0,C.Z)(a,["id","async","type","onError","onLoad"]);return new Promise(function(a,c){var e=document.getElementById(b),g=!!e;if(g||(e=document.createElement("script"),Object.keys(i).forEach(function(a){return e[a]=i[a]}),e.id=b,e.async=!0,e.type=d),e.isLoaded){if(e.isErrored){var j=Error("<script>.isErrored is true.");return f({error:j}),c({error:j})}return h({event:event,element:e}),a({event:event,element:e})}if(e.addEventListener("error",function(a){return e.isLoaded=!0,e.isErrored=!0,f({error:a}),c({error:a})}),i.src&&e.addEventListener("load",function(b){return e.isLoaded=!0,h({event:b,element:e}),a({event:b,element:e})}),g||document.getElementsByTagName("head")[0].appendChild(e),!i.src)return e.isLoaded=!0,h({element:e}),a({element:e})})},F=E,G="./model/Horkeukamui/tex/cloth23_N.png",H={pubicHair:"丁毛",fundoshiBack:"屁股兜",fundoshiFront:"肚兜",bigFundoshiFront:"大丁丁肚兜",penis:"小丁丁",bigPenis:"大丁丁"};function I(){var a=(0,d.Z)(["\n  flex: auto;\n"]);return I=function(){return a},a}function J(){var a=(0,d.Z)(["\n  width: 100%;\n  height: 100%;\n  background-color: #222f3e;\n"]);return J=function(){return a},a}var K=new y.lLk;K.addHandler(/\.dds$/i,new w.R);var L=new y.dpR(K),M=new v.k(K),N=["fundoshiBack","fundoshiFront","penis","bigFundoshiFront","bigPenis",],O={intensity:{min:0,max:5,step:.001},shadowIntensity:{min:0,max:1,step:.001},shadowBoundry:{min:0,max:10,step:.01},needShadowHelper:{},positionX:{min:-5,max:5,step:.01},positionY:{min:-5,max:5,step:.01},positionZ:{min:-5,max:5,step:.01}},P={"tex\\body.dds":"./model/Horkeukamui/tex/body_N.png","tex\\body2.dds":"./model/Horkeukamui/tex/body2_N.png","tex\\cloth.dds":"./model/Horkeukamui/tex/cloth_N.png","tex\\cloth2.dds":G,"tex\\cloth3.dds":G},Q=null,R=function(a){(0,n.Z)(d,a);var b=(0,o.Z)(d);function d(){var a;return(0,k.Z)(this,d),a=b.apply(this,arguments),(0,m.Z)((0,i.Z)(a),"canvas",r.createRef()),(0,m.Z)((0,i.Z)(a),"gui",null),(0,m.Z)((0,i.Z)(a),"camera",null),(0,m.Z)((0,i.Z)(a),"cameraControls",null),(0,m.Z)((0,i.Z)(a),"scene",null),(0,m.Z)((0,i.Z)(a),"light",null),(0,m.Z)((0,i.Z)(a),"lightWithShadow",null),(0,m.Z)((0,i.Z)(a),"renderer",null),(0,m.Z)((0,i.Z)(a),"rendererControlFolder",null),(0,m.Z)((0,i.Z)(a),"clock",null),(0,m.Z)((0,i.Z)(a),"loadingTimeout",null),(0,m.Z)((0,i.Z)(a),"animationFrame",null),(0,m.Z)((0,i.Z)(a),"animationControls",{shouldAnimate:!1,fps:60}),(0,m.Z)((0,i.Z)(a),"animationToogleUI",null),(0,m.Z)((0,i.Z)(a),"horkeukamui",null),(0,m.Z)((0,i.Z)(a),"mmdPhysics",null),(0,m.Z)((0,i.Z)(a),"mmdAnimationHelper",new x._({afterglow:2})),(0,m.Z)((0,i.Z)(a),"controlObject",{light:{intensity:3.5,shadowIntensity:.5,shadowBoundry:4,needShadowHelper:!1,positionX:-3,positionY:4,positionZ:2},horkeukamui:{fundoshiBack:!0,fundoshiFront:!0,penis:!0,bigFundoshiFront:!1,bigPenis:!1,erection:0}}),(0,m.Z)((0,i.Z)(a),"controlUIObject",{Light:null,light:{},Horkeukamui:null,HorkeukamuiMorphs:null,horkeukamui:{morphs:{}}}),(0,m.Z)((0,i.Z)(a),"updateLights",function(){var b=a.controlObject.light,c=b.intensity,d=b.shadowIntensity,e=b.shadowBoundry,f=b.needShadowHelper,g=b.positionX,h=b.positionY,i=b.positionZ;a.light.intensity=c*(1-d),a.light.position.set(g,h,i),a.lightHelper.update(),a.lightWithShadow.intensity=c*d,a.lightWithShadow.position.set(g,h,i),a.lightWithShadow.castShadow=!!d,a.shadowHelper.visible=f&&!!d;var j=a.lightWithShadow.shadow.camera;j.left=-e,j.right=e,j.top=e,j.bottom=-e,j.updateProjectionMatrix(),a.shadowHelper.update(),window.requestAnimationFrame(a.renderNextFrame)}),(0,m.Z)((0,i.Z)(a),"initScene",function(){a.scene=new y.xsS,a.scene.add(new y.y8_(1));var b=new y.Ox3("#ffffff",2);b.castShadow=!1,a.light=b;var c=a.controlObject.light,d=c.positionX,e=c.positionY,f=c.positionZ;a.light.position.set(d,e,f),a.lightHelper=new y.cBI(b,1);var g=b.clone();g.shadow.camera.far=7,g.shadow.mapSize.set(1024,1024),g.shadow.normalBias=.05,a.lightWithShadow=g,a.shadowHelper=new y.Rki(g.shadow.camera),a.scene.add(b),a.scene.add(a.lightHelper),a.scene.add(g),a.scene.add(a.shadowHelper),a.controlUIObject.Light=a.gui.addFolder("Light");var h=a.controlObject.light,i=a.controlUIObject.Light;Object.keys(O).forEach(function(b){var c=O[b];a.controlUIObject.light[b]=i.add(h,b),c.step&&(a.controlUIObject.light[b]=a.controlUIObject.light[b].min(c.min).max(c.max).step(c.step)),a.controlUIObject.light[b]=a.controlUIObject.light[b].onChange(a.updateLights)})}),(0,m.Z)((0,i.Z)(a),"initRenderer",function(){var b=new y.b5g({canvas:a.canvas.current,antialias:!0});a.renderer=b,b.physicallyCorrectLights=!0,b.toneMappingExposure=1,b.shadowMap.enabled=!0,b.shadowMap.type=y.ntZ,b.setClearColor(2240318),a.rendererControlFolder=a.gui.addFolder("Renderer"),a.rendererControlFolder.add(a.renderer,"physicallyCorrectLights"),a.rendererControlFolder.add(a.renderer,"toneMappingExposure").min(0).max(5).step(.01),a.rendererControlFolder.add(a.renderer.shadowMap,"enabled").name("shadowMapEnabled"),a.initCamera(),a.handleWindowResize()}),(0,m.Z)((0,i.Z)(a),"renderNextFrame",function(){a.renderer.render(a.scene,a.camera)}),(0,m.Z)((0,i.Z)(a),"updateMorphControlValues",t()(function(){var b=a.controlUIObject.horkeukamui.morphs;Object.keys(b).forEach(function(a){b[a].updateDisplay()})},100)),(0,m.Z)((0,i.Z)(a),"tick",function(){a.cameraControls.update(),a.mmdAnimationHelper.update(a.clock.getDelta()),a.renderNextFrame(),a.updateMorphControlValues(),a.animationControls.shouldAnimate&&(a.animationFrame=window.requestAnimationFrame(a.tick))}),(0,m.Z)((0,i.Z)(a),"initCamera",function(){var b=a.canvas.current,c=b.clientWidth,d=b.clientHeight;a.camera=new y.cPb(75,c/d,.1,100),a.camera.position.set(1,2,3),a.cameraControls=new u.z(a.camera,b),a.cameraControls.target.set(0,2,0),a.cameraControls.update(),a.cameraControls.addEventListener("change",function(){a.animationControls.shouldAnimate||a.renderNextFrame()})}),(0,m.Z)((0,i.Z)(a),"handleWindowResize",t()(function(){if(a.canvas.current){var b=a.canvas.current,c=a.renderer,d=b.clientWidth,e=b.clientHeight;c.setSize(d,e),c.setPixelRatio(Math.min(window.devicePixelRatio,2)),a.camera.aspect=d/e,a.camera.updateProjectionMatrix(),a.animationControls.shouldAnimate||a.renderNextFrame()}},100)),(0,m.Z)((0,i.Z)(a),"getMaterial",function(b){var c=b.name;return a.horkeukamui.material.find(function(a){return c===a.name})}),(0,m.Z)((0,i.Z)(a),"addKamuiControlllers",function(){a.controlUIObject.Horkeukamui=a.gui.addFolder("Horkeukamui");var b=a.controlUIObject.Horkeukamui;a.controlUIObject.horkeukamui.fundoshiBack=b.add(a.controlObject.horkeukamui,"fundoshiBack").onChange(function(){var b=a.getMaterial({name:H.fundoshiBack}),c=a.controlObject.horkeukamui.fundoshiBack;b.visible=c,b.opacity=+c,window.requestAnimationFrame(a.renderNextFrame)}),a.controlUIObject.horkeukamui.fundoshiFront=b.add(a.controlObject.horkeukamui,"fundoshiFront").onChange(function(){var b=a.getMaterial({name:H.fundoshiFront}),c=a.controlObject.horkeukamui.fundoshiFront;b.visible=c,b.opacity=+c,a.horkeukamui.morphTargetInfluences[77]=.2*+c,c&&a.controlObject.horkeukamui.bigFundoshiFront&&a.controlUIObject.horkeukamui.bigFundoshiFront.setValue(!1),window.requestAnimationFrame(a.renderNextFrame)}),a.controlUIObject.horkeukamui.bigFundoshiFront=b.add(a.controlObject.horkeukamui,"bigFundoshiFront").onChange(function(){var b=a.getMaterial({name:H.bigFundoshiFront}),c=a.controlObject.horkeukamui.bigFundoshiFront;b.visible=c,b.opacity=+c,c&&a.controlObject.horkeukamui.fundoshiFront&&a.controlUIObject.horkeukamui.fundoshiFront.setValue(!1),window.requestAnimationFrame(a.renderNextFrame)}),a.controlUIObject.horkeukamui.bigPenis=b.add(a.controlObject.horkeukamui,"bigPenis").onChange(function(){var b=a.getMaterial({name:H.penis}),c=a.getMaterial({name:H.bigPenis}),d=a.controlObject.horkeukamui.bigPenis;b.visible=!d,b.opacity=+!d,c.visible=d,c.opacity=+d,window.requestAnimationFrame(a.renderNextFrame)}),a.controlUIObject.HorkeukamuiMorphs=a.controlUIObject.Horkeukamui.addFolder("Morphs"),Object.keys(a.horkeukamui.morphTargetDictionary).forEach(function(b){a.controlUIObject.horkeukamui.morphs[b]=a.controlUIObject.HorkeukamuiMorphs.add(a.horkeukamui.morphTargetInfluences,a.horkeukamui.morphTargetDictionary[b]).min(0).max(1).step(.01).name(b).onChange(function(){return window.requestAnimationFrame(a.renderNextFrame)})})}),(0,m.Z)((0,i.Z)(a),"loadModels",function(){M.loadWithAnimation("./model/Horkeukamui/Horkeukamui-160.pmx",["./motion/wavefile_v2.vmd"],function(b){var c=b.mesh,d=b.animation;c.scale.set(.2,.2,.2),c.position.set(0,0,0),c.receiveShadow=!0,c.castShadow=!0,a.scene.add(c),window.Horkeukamui=c,a.horkeukamui=c;var e=Math.min(4,a.renderer.capabilities.getMaxAnisotropy());c.material.forEach(function(a){a.map.anisotropy=e;var b,c=P[null===(b=a.userData.MMD)|| void 0===b?void 0:b.mapFileName];c&&(a.normalMap=L.load(c),a.normalMap.flipY=!1,a.normalMap.wrapS=y.rpg,a.normalMap.wrapT=y.rpg,a.normalMap.anisotropy=e)}),c.morphTargetInfluences[77]=.2;var f=a.getMaterial({name:H.pubicHair});f.visible=!0,f.opacity=1,N.forEach(function(b){var c=a.controlObject.horkeukamui[b],d=a.getMaterial({name:H[b]});d.visible=c,d.opacity=+c}),a.mmdAnimationHelper.add(c,{animation:d,physics:!!window.Ammo}),a.mmdAnimationHelper.enable("animation",!1),a.addKamuiControlllers(),a.loadingTimeout=window.setTimeout(a.renderNextFrame,500)})}),a}return(0,l.Z)(d,[{key:"componentDidMount",value:function(){var a=this;return(0,j.Z)(q().mark(function b(){var d,e,f,g,h;return q().wrap(function(b){for(;;)switch(b.prev=b.next){case 0:return d="./",e=B?"wasm.js":"js",g=F({id:"ammo-js",src:f="".concat(d,"library/ammo/ammo.99d0ec0.").concat(e)}),b.next=6,c.e(376).then(c.bind(c,4376));case 6:return Q=b.sent,a.gui=new Q.GUI({hideable:!0,closed:!1,closeOnTop:!0}),a.clock=new y.SUY,a.initScene(),a.initRenderer(),a.updateLights(),a.animationToogleUI=a.gui.add(a.animationControls,"shouldAnimate").onChange(function(){a.animationControls.shouldAnimate?(a.mmdAnimationHelper.enable("animation",!0),a.clock.start(),a.tick()):(a.clock.stop(),a.mmdAnimationHelper.enable("animation",!1))}),window.addEventListener("resize",a.handleWindowResize),b.prev=14,b.next=17,g;case 17:return b.next=19,window.Ammo();case 19:h=b.sent,window.Ammo=h,b.next=26;break;case 23:b.prev=23,b.t0=b.catch(14),console.log("load ammo.js failed. error:",b.t0);case 26:a.loadModels();case 27:case"end":return b.stop()}},b,null,[[14,23]])}))()}},{key:"componentWillUnmount",value:function(){this.gui&&this.gui.destory(),window.cancelAnimationFrame(this.animationFrame),window.removeEventListener("resize",this.handleWindowResize),window.clearTimeout(this.loadingTimeout)}},{key:"render",value:function(){return(0,e.jsx)(S,{children:(0,e.jsx)(T,{ref:this.canvas})})}}]),d}(r.PureComponent),S=f.default.div.withConfig({displayName:"Main__StyledMain",componentId:"sc-7ad63960-0"})(I()),T=f.default.canvas.withConfig({displayName:"Main__Canvas",componentId:"sc-7ad63960-1"})(J()),U=R,V=c(6042),W=c(5675),X=c.n(W),Y=function(a){var b=a.src,c=a.width,d=a.quality;return"".concat(b,"?w=").concat(c,"&q=").concat(d||75)},Z=function(a){return(0,e.jsx)(X(),(0,V.Z)({loader:Y},a))},$=Z,_={src:"./_next/static/media/email-icon.0668d74f.svg",height:512,width:512},aa={src:"./_next/static/media/github-icon.eaaf152a.svg",height:479,width:479};function ab(){var a=(0,d.Z)(["\n  flex: none;\n  display: flex;\n  justify-content: center;\n  align-items: flex-end;\n  padding: 20px;\n"]);return ab=function(){return a},a}function ac(){var a=(0,d.Z)(["\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  border-radius: 50%;\n  width: 36px;\n  height: 36px;\n  background-color: ",";\n  padding: 6px;\n\n  & + & {\n    margin-left: 8px;\n  }\n"]);return ac=function(){return a},a}var ad="https://github.com/bill42362/portfolio",ae=function(a){(0,n.Z)(c,a);var b=(0,o.Z)(c);function c(){return(0,k.Z)(this,c),b.apply(this,arguments)}return(0,l.Z)(c,[{key:"render",value:function(){var a=this.props,b=a.email,c=a.branchName,d=c?"".concat(ad,"/tree/").concat(c):ad;return(0,e.jsxs)(af,{children:[(0,e.jsx)(ag,{href:d,target:"_blank",children:(0,e.jsx)($,{alt:"github",src:aa,width:150,height:150})}),(0,e.jsx)(ag,{href:"mailto:".concat(b),target:"_blank",children:(0,e.jsx)($,{alt:"email",src:_,width:150,height:150})})]})}}]),c}(r.PureComponent);ae.propTypes={email:h().string,branchName:h().string},ae.defaultProps={email:"bill42362@gmail.com",branchName:""};var af=f.default.div.withConfig({displayName:"Footer__StyledFooter",componentId:"sc-26850fce-0"})(ab()),ag=f.default.a.withConfig({displayName:"Footer__Link",componentId:"sc-26850fce-1"})(ac(),function(a){return a.theme.colors.darkGray}),ah=ae,ai=c(7539);function aj(){var a=(0,d.Z)(["\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  height: 100vh;\n  background-color: ",";\n"]);return aj=function(){return a},a}var ak=!0;function al(a){var b=a.props;return console.log("Home() props:",b),(0,e.jsxs)(am,{children:[(0,e.jsx)(U,{}),(0,e.jsx)(ah,{branchName:ai.Z.branchName})]})}al.propTypes={props:h().object},al.defaultProps={props:null};var am=f.default.div.withConfig({displayName:"pages__StyledHome",componentId:"sc-47e731bf-0"})(aj(),function(a){return a.theme.colors.black})}},function(a){a.O(0,[737,561,774,888,179],function(){var b;return a(a.s=5557)}),_N_E=a.O()}])