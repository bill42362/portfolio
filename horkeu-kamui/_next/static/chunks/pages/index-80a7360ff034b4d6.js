(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[405],{8581:function(a,b,c){(window.__NEXT_P=window.__NEXT_P||[]).push(["/",function(){return c(2861)}])},2861:function(a,b,c){"use strict";c.r(b),c.d(b,{"__N_SSG":function(){return oa},"default":function(){return pa}});var d=c(5893),e=c(7379),f=c(5697),g=c.n(f),h=c(4051),i=c.n(h),j=c(7294),k=c(3493),l=c.n(k),m=c(9365),n=c(410),o=c(992),p=c(2125),q=c(9477);function r(a,b){return null!=b&&"undefined"!=typeof Symbol&&b[Symbol.hasInstance]?b[Symbol.hasInstance](a):a instanceof b}var s=function(){try{if("object"==typeof WebAssembly&&"function"==typeof WebAssembly.instantiate){var a=new WebAssembly.Module(Uint8Array.of(0,97,115,109,1,0,0,0));if(r(a,WebAssembly.Module))return r(new WebAssembly.Instance(a),WebAssembly.Instance)}}catch(b){}return!1}(),t=function(){return null},u=function(a){var b=a.id,c=a.async,d=a.type,e=void 0===d?"text/javascript":d,f=a.onError,g=void 0===f?t:f,h=a.onLoad,i=void 0===h?t:h,j=function(a,b){if(null==a)return{};var c,d,e=function(a,b){if(null==a)return{};var c,d,e={},f=Object.keys(a);for(d=0;d<f.length;d++)c=f[d],b.indexOf(c)>=0||(e[c]=a[c]);return e}(a,b);if(Object.getOwnPropertySymbols){var f=Object.getOwnPropertySymbols(a);for(d=0;d<f.length;d++)c=f[d],!(b.indexOf(c)>=0)&&Object.prototype.propertyIsEnumerable.call(a,c)&&(e[c]=a[c])}return e}(a,["id","async","type","onError","onLoad"]);return new Promise(function(a,c){var d=document.getElementById(b),f=!!d;if(f||(d=document.createElement("script"),Object.keys(j).forEach(function(a){return d[a]=j[a]}),d.id=b,d.async=!0,d.type=e),d.isLoaded){if(d.isErrored){var h=new Error("<script>.isErrored is true.");return g({error:h}),c({error:h})}return i({event:event,element:d}),a({event:event,element:d})}if(d.addEventListener("error",function(a){return d.isLoaded=!0,d.isErrored=!0,g({error:a}),c({error:a})}),j.src&&d.addEventListener("load",function(b){return d.isLoaded=!0,i({event:b,element:d}),a({event:b,element:d})}),f||document.getElementsByTagName("head")[0].appendChild(d),!j.src)return d.isLoaded=!0,i({element:d}),a({element:d})})},v=c(4337);c(3816);var w=c(9122);c(5507);var x=c(5643);c(5499);var y=c(5469);c(172),c(793),c(7662),c(2414);var z=c(2774);c(6300),c(5760),c(1077),c(9009);var A={pubicHair:"丁毛",fundoshiBack:"屁股兜",fundoshiFront:"肚兜",bigFundoshiFront:"大丁丁肚兜",penis:"小丁丁",bigPenis:"大丁丁"},B=c(9373);function C(a){if(void 0===a)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return a}function D(a,b,c,d,e,f,g){try{var h=a[f](g),i=h.value}catch(j){c(j);return}h.done?b(i):Promise.resolve(i).then(d,e)}function E(a,b){for(var c=0;c<b.length;c++){var d=b[c];d.enumerable=d.enumerable||!1,d.configurable=!0,"value"in d&&(d.writable=!0),Object.defineProperty(a,d.key,d)}}function F(a,b,c){return b in a?Object.defineProperty(a,b,{value:c,enumerable:!0,configurable:!0,writable:!0}):a[b]=c,a}function G(a){return(G=Object.setPrototypeOf?Object.getPrototypeOf:function(a){return a.__proto__||Object.getPrototypeOf(a)})(a)}function H(a,b){return(H=Object.setPrototypeOf||function(a,b){return a.__proto__=b,a})(a,b)}function I(a,b){return b||(b=a.slice(0)),Object.freeze(Object.defineProperties(a,{raw:{value:Object.freeze(b)}}))}function J(){var a=I(["\n  flex: auto;\n"]);return J=function(){return a},a}function K(){var a=I(["\n  width: 100%;\n  height: 100%;\n  background-color: #222f3e;\n"]);return K=function(){return a},a}var L=!0,M=new q.lLk();M.addHandler(/\.dds$/i,new o.R());var N=new q.dpR(M),O=new n.k(M),P=["fundoshiBack","fundoshiFront","penis","bigFundoshiFront","bigPenis",],Q={intensity:{min:0,max:5,step:0.001},shadowIntensity:{min:0,max:1,step:0.001},shadowBoundry:{min:0,max:10,step:0.01},needShadowHelper:{},positionX:{min:-5,max:5,step:0.01},positionY:{min:-5,max:5,step:0.01},positionZ:{min:-5,max:5,step:0.01}},R={"tex\\body.dds":w,"tex\\body2.dds":x,"tex\\cloth.dds":y,"tex\\cloth2.dds":z,"tex\\cloth3.dds":z},S=null,T=function(a){"use strict";!function(a,b){if("function"!=typeof b&&null!==b)throw new TypeError("Super expression must either be null or a function");a.prototype=Object.create(b&&b.prototype,{constructor:{value:a,writable:!0,configurable:!0}}),b&&H(a,b)}(n,a);var b,e,f,g,h,k=(g=n,h=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){})),!0}catch(a){return!1}}(),function(){var a,b,c,d,e=G(g);if(h){var f=G(this).constructor;d=Reflect.construct(e,arguments,f)}else d=e.apply(this,arguments);return b=this,(c=d)&&("object"==((a=c)&&"undefined"!=typeof Symbol&&a.constructor===Symbol?"symbol":typeof a)||"function"==typeof c)?c:C(b)});function n(){var a;return!function(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}(this,n),a=k.apply(this,arguments),F(C(a),"canvas",j.createRef()),F(C(a),"gui",null),F(C(a),"camera",null),F(C(a),"cameraControls",null),F(C(a),"scene",null),F(C(a),"light",null),F(C(a),"lightWithShadow",null),F(C(a),"renderer",null),F(C(a),"rendererControlFolder",null),F(C(a),"clock",null),F(C(a),"loadingTimeout",null),F(C(a),"animationFrame",null),F(C(a),"animationControls",{shouldAnimate:!1,fps:60}),F(C(a),"animationToogleUI",null),F(C(a),"horkeukamui",null),F(C(a),"mmdPhysics",null),F(C(a),"mmdAnimationHelper",new p._({afterglow:2})),F(C(a),"controlObject",{light:{intensity:3.5,shadowIntensity:0.5,shadowBoundry:4,needShadowHelper:!1,positionX:-3,positionY:4,positionZ:2},horkeukamui:{fundoshiBack:!0,fundoshiFront:!0,penis:!0,bigFundoshiFront:!1,bigPenis:!1,erection:0}}),F(C(a),"controlUIObject",{Light:null,light:{},Horkeukamui:null,HorkeukamuiMorphs:null,horkeukamui:{morphs:{}}}),F(C(a),"updateLights",function(){var b=a.controlObject.light,c=b.intensity,d=b.shadowIntensity,e=b.shadowBoundry,f=b.needShadowHelper,g=b.positionX,h=b.positionY,i=b.positionZ;a.light.intensity=c*(1-d),a.light.position.set(g,h,i),a.lightHelper.update(),a.lightWithShadow.intensity=c*d,a.lightWithShadow.position.set(g,h,i),a.lightWithShadow.castShadow=!!d,a.shadowHelper.visible=f&&!!d;var j=a.lightWithShadow.shadow.camera;j.left=-e,j.right=e,j.top=e,j.bottom=-e,j.updateProjectionMatrix(),a.shadowHelper.update(),window.requestAnimationFrame(a.renderNextFrame)}),F(C(a),"initScene",function(){a.scene=new q.xsS(),a.scene.add(new q.y8_(1));var b=new q.Ox3("#ffffff",2);b.castShadow=!1,a.light=b;var c=a.controlObject.light,d=c.positionX,e=c.positionY,f=c.positionZ;a.light.position.set(d,e,f),a.lightHelper=new q.cBI(b,1);var g=b.clone();g.shadow.camera.far=7,g.shadow.mapSize.set(1024,1024),g.shadow.normalBias=0.05,a.lightWithShadow=g,a.shadowHelper=new q.Rki(g.shadow.camera),a.scene.add(b),a.scene.add(a.lightHelper),a.scene.add(g),a.scene.add(a.shadowHelper),a.controlUIObject.Light=a.gui.addFolder("Light");var h=a.controlObject.light,i=a.controlUIObject.Light;Object.keys(Q).forEach(function(b){var c=Q[b];a.controlUIObject.light[b]=i.add(h,b),c.step&&(a.controlUIObject.light[b]=a.controlUIObject.light[b].min(c.min).max(c.max).step(c.step)),a.controlUIObject.light[b]=a.controlUIObject.light[b].onChange(a.updateLights)})}),F(C(a),"initRenderer",function(){var b=new q.b5g({canvas:a.canvas.current,antialias:!0});a.renderer=b,b.physicallyCorrectLights=!0,b.toneMappingExposure=1,b.shadowMap.enabled=!0,b.shadowMap.type=q.ntZ,b.setClearColor(2240318),a.rendererControlFolder=a.gui.addFolder("Renderer"),a.rendererControlFolder.add(a.renderer,"physicallyCorrectLights"),a.rendererControlFolder.add(a.renderer,"toneMappingExposure").min(0).max(5).step(0.01),a.rendererControlFolder.add(a.renderer.shadowMap,"enabled").name("shadowMapEnabled"),a.initCamera(),a.handleWindowResize()}),F(C(a),"renderNextFrame",function(){a.renderer.render(a.scene,a.camera)}),F(C(a),"updateMorphControlValues",l()(function(){var b=a.controlUIObject.horkeukamui.morphs;Object.keys(b).forEach(function(a){b[a].updateDisplay()})},100)),F(C(a),"tick",function(){a.cameraControls.update(),a.mmdAnimationHelper.update(a.clock.getDelta()),a.renderNextFrame(),a.updateMorphControlValues(),a.animationControls.shouldAnimate&&(a.animationFrame=window.requestAnimationFrame(a.tick))}),F(C(a),"initCamera",function(){var b=a.canvas.current,c=b.clientWidth,d=b.clientHeight;a.camera=new q.cPb(75,c/d,0.1,100),a.camera.position.set(1,2,3),a.cameraControls=new m.z(a.camera,b),a.cameraControls.target.set(0,2,0),a.cameraControls.update(),a.cameraControls.addEventListener("change",function(){a.animationControls.shouldAnimate||a.renderNextFrame()})}),F(C(a),"handleWindowResize",l()(function(){if(a.canvas.current){var b=a.canvas.current,c=a.renderer,d=b.clientWidth,e=b.clientHeight;c.setSize(d,e),c.setPixelRatio(Math.min(window.devicePixelRatio,2)),a.camera.aspect=d/e,a.camera.updateProjectionMatrix(),a.animationControls.shouldAnimate||a.renderNextFrame()}},100)),F(C(a),"getMaterial",function(b){var c=b.name;return a.horkeukamui.material.find(function(a){return c===a.name})}),F(C(a),"addKamuiControlllers",function(){a.controlUIObject.Horkeukamui=a.gui.addFolder("Horkeukamui");var b=a.controlUIObject.Horkeukamui;a.controlUIObject.horkeukamui.fundoshiBack=b.add(a.controlObject.horkeukamui,"fundoshiBack").onChange(function(){var b=a.getMaterial({name:A.fundoshiBack}),c=a.controlObject.horkeukamui.fundoshiBack;b.visible=c,b.opacity=+c,window.requestAnimationFrame(a.renderNextFrame)}),a.controlUIObject.horkeukamui.fundoshiFront=b.add(a.controlObject.horkeukamui,"fundoshiFront").onChange(function(){var b=a.getMaterial({name:A.fundoshiFront}),c=a.controlObject.horkeukamui.fundoshiFront;b.visible=c,b.opacity=+c,a.horkeukamui.morphTargetInfluences[77]=0.2*+c,c&&a.controlObject.horkeukamui.bigFundoshiFront&&a.controlUIObject.horkeukamui.bigFundoshiFront.setValue(!1),window.requestAnimationFrame(a.renderNextFrame)}),a.controlUIObject.horkeukamui.bigFundoshiFront=b.add(a.controlObject.horkeukamui,"bigFundoshiFront").onChange(function(){var b=a.getMaterial({name:A.bigFundoshiFront}),c=a.controlObject.horkeukamui.bigFundoshiFront;b.visible=c,b.opacity=+c,c&&a.controlObject.horkeukamui.fundoshiFront&&a.controlUIObject.horkeukamui.fundoshiFront.setValue(!1),window.requestAnimationFrame(a.renderNextFrame)}),a.controlUIObject.horkeukamui.bigPenis=b.add(a.controlObject.horkeukamui,"bigPenis").onChange(function(){var b=a.getMaterial({name:A.penis}),c=a.getMaterial({name:A.bigPenis}),d=a.controlObject.horkeukamui.bigPenis;b.visible=!d,b.opacity=+!d,c.visible=d,c.opacity=+d,window.requestAnimationFrame(a.renderNextFrame)}),a.controlUIObject.HorkeukamuiMorphs=a.controlUIObject.Horkeukamui.addFolder("Morphs"),Object.keys(a.horkeukamui.morphTargetDictionary).forEach(function(b){a.controlUIObject.horkeukamui.morphs[b]=a.controlUIObject.HorkeukamuiMorphs.add(a.horkeukamui.morphTargetInfluences,a.horkeukamui.morphTargetDictionary[b]).min(0).max(1).step(0.01).name(b).onChange(function(){return window.requestAnimationFrame(a.renderNextFrame)})})}),F(C(a),"loadModels",function(){O.loadWithAnimation(v,[B],function(b){var c=b.mesh,d=b.animation;c.scale.set(0.2,0.2,0.2),c.position.set(0,0,0),c.receiveShadow=!0,c.castShadow=!0,a.scene.add(c),window.Horkeukamui=c,a.horkeukamui=c;var e=Math.min(4,a.renderer.capabilities.getMaxAnisotropy());c.material.forEach(function(a){var b;a.map.anisotropy=e;var c=R[null===(b=a.userData.MMD)|| void 0===b?void 0:b.mapFileName];c&&(a.normalMap=N.load(c),a.normalMap.flipY=!1,a.normalMap.wrapS=q.rpg,a.normalMap.wrapT=q.rpg,a.normalMap.anisotropy=e)}),c.morphTargetInfluences[77]=0.2;var f=a.getMaterial({name:A.pubicHair});f.visible=!0,f.opacity=1,P.forEach(function(b){var c=a.controlObject.horkeukamui[b],d=a.getMaterial({name:A[b]});d.visible=c,d.opacity=+c}),a.mmdAnimationHelper.add(c,{animation:d,physics:!!window.Ammo}),a.mmdAnimationHelper.enable("animation",!1),a.addKamuiControlllers(),a.loadingTimeout=window.setTimeout(a.renderNextFrame,500)})}),a}return b=n,e=[{key:"componentDidMount",value:function(){var a,b=this;return(a=i().mark(function a(){var d,e,f,g,h;return i().wrap(function(a){for(;;)switch(a.prev=a.next){case 0:return d=L?"./":"/",e=s?"wasm.js":"js",g=u({id:"ammo-js",src:f="".concat(d,"library/ammo/ammo.99d0ec0.").concat(e)}),a.next=6,c.e(376).then(c.bind(c,4376));case 6:return S=a.sent,b.gui=new S.GUI({hideable:!0,closed:!1,closeOnTop:!0}),b.clock=new q.SUY(),b.initScene(),b.initRenderer(),b.updateLights(),b.animationToogleUI=b.gui.add(b.animationControls,"shouldAnimate").onChange(function(){b.animationControls.shouldAnimate?(b.mmdAnimationHelper.enable("animation",!0),b.clock.start(),b.tick()):(b.clock.stop(),b.mmdAnimationHelper.enable("animation",!1))}),window.addEventListener("resize",b.handleWindowResize),a.prev=14,a.next=17,g;case 17:return a.next=19,window.Ammo();case 19:h=a.sent,window.Ammo=h,a.next=26;break;case 23:a.prev=23,a.t0=a.catch(14),console.log("load ammo.js failed. error:",a.t0);case 26:b.loadModels();case 27:case"end":return a.stop()}},a,null,[[14,23]])}),function(){var b=this,c=arguments;return new Promise(function(d,e){var f=a.apply(b,c);function g(a){D(f,d,e,g,h,"next",a)}function h(a){D(f,d,e,g,h,"throw",a)}g(void 0)})})()}},{key:"componentWillUnmount",value:function(){this.gui&&this.gui.destory(),window.cancelAnimationFrame(this.animationFrame),window.removeEventListener("resize",this.handleWindowResize),window.clearTimeout(this.loadingTimeout)}},{key:"render",value:function(){return(0,d.jsx)(U,{children:(0,d.jsx)(V,{ref:this.canvas})})}}],E(b.prototype,e),f&&E(b,f),n}(j.PureComponent),U=e.default.div.withConfig({componentId:"sc-7ad63960-0"})(J()),V=e.default.canvas.withConfig({componentId:"sc-7ad63960-1"})(K()),W=T,X=c(5675);function Y(a,b,c){return b in a?Object.defineProperty(a,b,{value:c,enumerable:!0,configurable:!0,writable:!0}):a[b]=c,a}var Z=function(a){var b=a.src,c=a.width,d=a.quality;return"".concat(b,"?w=").concat(c,"&q=").concat(d||75)},$=function(a){return(0,d.jsx)(X.default,function(a){for(var b=1;b<arguments.length;b++){var c=null!=arguments[b]?arguments[b]:{},d=Object.keys(c);"function"==typeof Object.getOwnPropertySymbols&&(d=d.concat(Object.getOwnPropertySymbols(c).filter(function(a){return Object.getOwnPropertyDescriptor(c,a).enumerable}))),d.forEach(function(b){Y(a,b,c[b])})}return a}({loader:Z},a))},_={src:"./_next/static/media/email-icon.0668d74f.svg",height:512,width:512},aa={src:"./_next/static/media/github-icon.eaaf152a.svg",height:479,width:479};function ba(a,b){for(var c=0;c<b.length;c++){var d=b[c];d.enumerable=d.enumerable||!1,d.configurable=!0,"value"in d&&(d.writable=!0),Object.defineProperty(a,d.key,d)}}function ca(a){return(ca=Object.setPrototypeOf?Object.getPrototypeOf:function(a){return a.__proto__||Object.getPrototypeOf(a)})(a)}function da(a,b){return(da=Object.setPrototypeOf||function(a,b){return a.__proto__=b,a})(a,b)}function ea(a,b){return b||(b=a.slice(0)),Object.freeze(Object.defineProperties(a,{raw:{value:Object.freeze(b)}}))}function fa(){var a=ea(["\n  flex: none;\n  display: flex;\n  justify-content: center;\n  align-items: flex-end;\n  padding: 20px;\n"]);return fa=function(){return a},a}function ga(){var a=ea(["\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  border-radius: 50%;\n  width: 36px;\n  height: 36px;\n  background-color: ",";\n  padding: 6px;\n\n  & + & {\n    margin-left: 8px;\n  }\n"]);return ga=function(){return a},a}var ha="https://github.com/bill42362/portfolio",ia=function(a){"use strict";!function(a,b){if("function"!=typeof b&&null!==b)throw new TypeError("Super expression must either be null or a function");a.prototype=Object.create(b&&b.prototype,{constructor:{value:a,writable:!0,configurable:!0}}),b&&da(a,b)}(i,a);var b,c,e,f,g,h=(f=i,g=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){})),!0}catch(a){return!1}}(),function(){var a,b,c,d,e=ca(f);if(g){var h=ca(this).constructor;d=Reflect.construct(e,arguments,h)}else d=e.apply(this,arguments);return b=this,(c=d)&&("object"==((a=c)&&"undefined"!=typeof Symbol&&a.constructor===Symbol?"symbol":typeof a)||"function"==typeof c)?c:(function(a){if(void 0===a)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return a})(b)});function i(){return!function(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}(this,i),h.apply(this,arguments)}return b=i,c=[{key:"render",value:function(){var a=this.props,b=a.email,c=a.branchName,e=c?"".concat(ha,"/tree/").concat(c):ha;return(0,d.jsxs)(ja,{children:[(0,d.jsx)(ka,{href:e,target:"_blank",children:(0,d.jsx)($,{alt:"github",src:aa,width:150,height:150})}),(0,d.jsx)(ka,{href:"mailto:".concat(b),target:"_blank",children:(0,d.jsx)($,{alt:"email",src:_,width:150,height:150})})]})}}],ba(b.prototype,c),e&&ba(b,e),i}(j.PureComponent);ia.propTypes={email:g().string,branchName:g().string},ia.defaultProps={email:"bill42362@gmail.com",branchName:""};var ja=e.default.div.withConfig({componentId:"sc-26850fce-0"})(fa()),ka=e.default.a.withConfig({componentId:"sc-26850fce-1"})(ga(),function(a){return a.theme.colors.darkGray}),la=ia,ma=c(7539);function na(){var a,b,c=(a=["\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  height: 100vh;\n  background-color: ",";\n"],b||(b=a.slice(0)),Object.freeze(Object.defineProperties(a,{raw:{value:Object.freeze(b)}})));return na=function(){return c},c}var oa=!0;function pa(a){var b=a.props;return console.log("Home() props:",b),(0,d.jsxs)(qa,{children:[(0,d.jsx)(W,{}),(0,d.jsx)(la,{branchName:ma.Z.branchName})]})}pa.propTypes={props:g().object},pa.defaultProps={props:null};var qa=e.default.div.withConfig({componentId:"sc-47e731bf-0"})(na(),function(a){return a.theme.colors.black})},5643:function(a){"use strict";a.exports="./model/Horkeukamui/tex/body2_N.png"},9122:function(a){"use strict";a.exports="./model/Horkeukamui/tex/body_N.png"},2774:function(a){"use strict";a.exports="./model/Horkeukamui/tex/cloth23_N.png"},5469:function(a){"use strict";a.exports="./model/Horkeukamui/tex/cloth_N.png"},4337:function(a){"use strict";a.exports="./model/Horkeukamui/Horkeukamui-160.pmx"},3816:function(a){"use strict";a.exports="./model/Horkeukamui/Horkeukamui-185.pmx"},1077:function(a){"use strict";a.exports="./model/Horkeukamui/tex/Penis.dds"},5507:function(a){"use strict";a.exports="./model/Horkeukamui/tex/body.dds"},5499:function(a){"use strict";a.exports="./model/Horkeukamui/tex/body2.dds"},172:function(a){"use strict";a.exports="./model/Horkeukamui/tex/cloth.dds"},793:function(a){"use strict";a.exports="./model/Horkeukamui/tex/cloth2.dds"},7662:function(a){"use strict";a.exports="./model/Horkeukamui/tex/cloth3.dds"},2414:function(a){"use strict";a.exports="./model/Horkeukamui/tex/cloth4.dds"},6300:function(a){"use strict";a.exports="./model/Horkeukamui/tex/head.dds"},5760:function(a){"use strict";a.exports="./model/Horkeukamui/tex/nose.dds"},9009:function(a){"use strict";a.exports="./model/Horkeukamui/tex/toon.dds"},9373:function(a){"use strict";a.exports="./motion/wavefile_v2.vmd"}},function(a){a.O(0,[737,885,774,888,179],function(){return a(a.s=8581)}),_N_E=a.O()}])