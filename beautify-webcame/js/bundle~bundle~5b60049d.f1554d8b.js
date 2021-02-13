(("undefined"!=typeof self?self:this).webpackJsonp=("undefined"!=typeof self?self:this).webpackJsonp||[]).push([[1],{168:function(e,t,r){"use strict";r.r(t);var n=r(0),o=r.n(n),a=r(109),i=r.n(a),c=(r(61),r(130),r(2)),u=r.n(c),l=r(1),f=r(110),d=r.n(f),s=r(114),p=(r(47),r(74),r(51),r(77),r(139),Object(l.css)(["border:none;padding:0px;outline:none;background:none;"]));function m(e){return(m="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function y(e,t,r,n,o,a,i){try{var c=e[a](i),u=c.value}catch(e){return void r(e)}c.done?t(u):Promise.resolve(u).then(n,o)}function v(e){return function(){var t=this,r=arguments;return new Promise((function(n,o){var a=e.apply(t,r);function i(e){y(a,n,o,i,c,"next",e)}function c(e){y(a,n,o,i,c,"throw",e)}i(void 0)}))}}function b(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function h(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function g(e,t){return(g=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function x(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,n=E(e);if(t){var o=E(this).constructor;r=Reflect.construct(n,arguments,o)}else r=n.apply(this,arguments);return S(this,r)}}function S(e,t){return!t||"object"!==m(t)&&"function"!=typeof t?w(e):t}function w(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function E(e){return(E=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var j=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&g(e,t)}(i,e);var t,r,n,a=x(i);function i(){var e;b(this,i);for(var t=arguments.length,r=new Array(t),n=0;n<t;n++)r[n]=arguments[n];return(e=a.call.apply(a,[this].concat(r))).state={isStarted:!1,shouldPreview:!1,mediaStream:null,error:!1},e.video=o.a.createRef(),e.startRecording=v(regeneratorRuntime.mark((function t(){var r,n,o,a;return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return r=e.props,n=r.onChange,o=r.onError,t.prev=1,e.setState({isStarted:!0}),t.next=5,navigator.mediaDevices.getUserMedia({video:{facingMode:"environment"}});case 5:return a=t.sent,e.setState({mediaStream:a}),t.abrupt("return",n({value:a}));case 10:return t.prev=10,t.t0=t.catch(1),e.setState({error:t.t0,isStarted:!1}),t.abrupt("return",o({error:t.t0,target:w(e)}));case 14:case"end":return t.stop()}}),t,null,[[1,10]])}))),e.stopRecording=function(){var t=e.state.mediaStream,r=e.props.onChange;t&&(t.getTracks().forEach((function(e){return e.stop()})),r({value:null}),e.setState({mediaStream:null,isStarted:!1,shouldPreview:!1}))},e.renderDescription=function(){var t=e.state,r=t.isStarted,n=t.mediaStream,o=t.error;return r?n?"Media stream id: ".concat(n.id):"Loading mediaStream ...":o?"Error: ".concat(JSON.stringify(o.message)):"Idle"},e.renderBody=function(){var t=e.state.shouldPreview;return o.a.createElement(_,null,o.a.createElement("div",null,e.renderDescription()),t&&o.a.createElement("video",{ref:e.video,playsInline:!0}))},e.handleTogglePreview=function(){var t=e.state,r=t.mediaStream,n=t.shouldPreview;if(r)return e.setState({shouldPreview:!n})},e}return t=i,(r=[{key:"componentDidUpdate",value:function(e,t){var r=this.state,n=r.mediaStream,o=r.shouldPreview;o&&o!==t.shouldPreview&&(this.video.current.srcObject=n,this.video.current.play())}},{key:"componentWillUnmount",value:function(){this.stopRecording()}},{key:"render",value:function(){var e=this.state,t=e.mediaStream,r=e.shouldPreview;return o.a.createElement(T,null,o.a.createElement(O,null,"MediaStreamHandler"),this.renderBody(),o.a.createElement(C,null,t?o.a.createElement(R,{onClick:this.stopRecording},"Stop"):o.a.createElement(P,{onClick:this.startRecording},"Start"),o.a.createElement(A,{isActived:r,disabled:!t,onClick:this.handleTogglePreview},"Preview")))}}])&&h(t.prototype,r),n&&h(t,n),i}(o.a.PureComponent);j.propTypes={onChange:u.a.func,onError:u.a.func},j.defaultProps={onChange:function(){return null},onError:function(){return null}};var T=l.default.div.withConfig({displayName:"MediaStreamHandler__StyledMediaStreamHandler",componentId:"ah9iko-0"})(["border:solid 1px #4834d4;border-radius:8px;overflow:hidden;"]),O=l.default.div.withConfig({displayName:"MediaStreamHandler__Header",componentId:"ah9iko-1"})(["background-color:#4834d4;padding:8px;"]),_=l.default.div.withConfig({displayName:"MediaStreamHandler__Body",componentId:"ah9iko-2"})(["position:relative;background-color:#686de0;padding:8px;& > video{margin-top:8px;width:100%;}"]),C=l.default.div.withConfig({displayName:"MediaStreamHandler__Footer",componentId:"ah9iko-3"})(["background-color:#4834d4;padding:8px;"]),M=l.default.button.withConfig({displayName:"MediaStreamHandler__Button",componentId:"ah9iko-4"})([""," border-radius:4px;padding:4px;color:white;font-size:14px;& + &{margin-left:8px;}"],p),P=Object(l.default)(M).withConfig({displayName:"MediaStreamHandler__StartButton",componentId:"ah9iko-5"})(["background-color:#6ab04c;"]),R=Object(l.default)(M).withConfig({displayName:"MediaStreamHandler__StopButton",componentId:"ah9iko-6"})(["background-color:#eb4d4b;"]),A=Object(l.default)(M).attrs((function(e){return{style:{backgroundColor:e.isActived?"#6ab04c":"#badc58"}}})).withConfig({displayName:"MediaStreamHandler__ToggleButton",componentId:"ah9iko-7"})([""]),I=j;function N(e){return(N="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function k(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function D(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function L(e,t){return(L=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function U(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,n=F(e);if(t){var o=F(this).constructor;r=Reflect.construct(n,arguments,o)}else r=n.apply(this,arguments);return B(this,r)}}function B(e,t){return!t||"object"!==N(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function F(e){return(F=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var z=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&L(e,t)}(i,e);var t,r,n,a=U(i);function i(){var e;k(this,i);for(var t=arguments.length,r=new Array(t),n=0;n<t;n++)r[n]=arguments[n];return(e=a.call.apply(a,[this].concat(r))).state={shouldPreview:!1},e.video=o.a.createRef(),e.handleTogglePreview=function(){var t=e.props.mediaStream,r=e.state.shouldPreview;if(t)return e.setState({shouldPreview:!r})},e}return t=i,(r=[{key:"componentDidUpdate",value:function(e,t){var r=this.props.mediaStream,n=this.state.shouldPreview;r||r===t.mediaStream||this.setState({shouldPreview:!1}),r&&n&&n!==t.shouldPreview&&(this.video.current.srcObject=r,this.video.current.play())}},{key:"render",value:function(){var e=this.props.mediaStream,t=this.state.shouldPreview;return o.a.createElement(q,null,o.a.createElement(H,null,"MediaStreamMonitor"),o.a.createElement(X,null,t&&o.a.createElement("video",{ref:this.video,playsInline:!0})),o.a.createElement(Y,null,o.a.createElement(W,{isActived:t,disabled:!e,onClick:this.handleTogglePreview},"Open")))}}])&&D(t.prototype,r),n&&D(t,n),i}(o.a.PureComponent);z.propTypes={mediaStream:u.a.object},z.defaultProps={mediaStream:null};var q=l.default.div.withConfig({displayName:"MediaStreamMonitor__StyledMediaStreamMonitor",componentId:"t1x8k1-0"})(["border:solid 1px #4834d4;border-radius:8px;overflow:hidden;"]),H=l.default.div.withConfig({displayName:"MediaStreamMonitor__Header",componentId:"t1x8k1-1"})(["background-color:#4834d4;padding:8px;"]),X=l.default.div.withConfig({displayName:"MediaStreamMonitor__Body",componentId:"t1x8k1-2"})(["position:relative;background-color:#686de0;padding:8px;& > video{margin-top:8px;width:100%;}"]),Y=l.default.div.withConfig({displayName:"MediaStreamMonitor__Footer",componentId:"t1x8k1-3"})(["background-color:#4834d4;padding:8px;"]),G=l.default.button.withConfig({displayName:"MediaStreamMonitor__Button",componentId:"t1x8k1-4"})([""," border-radius:4px;padding:4px;color:white;font-size:14px;& + &{margin-left:8px;}"],p),W=Object(l.default)(G).attrs((function(e){return{style:{backgroundColor:e.isActived?"#6ab04c":"#badc58"}}})).withConfig({displayName:"MediaStreamMonitor__ToggleButton",componentId:"t1x8k1-5"})([""]),V=z;r(52),r(143),r(55),r(148),r(79),r(150),r(85),r(86),r(87),r(88),r(89),r(90),r(91),r(92),r(93),r(94),r(95),r(96),r(97),r(98),r(100),r(101),r(102),r(103),r(104),r(105),r(106),r(107),r(108),r(164),r(165),r(166);function Q(e){return function(e){if(Array.isArray(e))return Z(e)}(e)||function(e){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e))return Array.from(e)}(e)||function(e,t){if(!e)return;if("string"==typeof e)return Z(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);"Object"===r&&e.constructor&&(r=e.constructor.name);if("Map"===r||"Set"===r)return Array.from(e);if("Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return Z(e,t)}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function Z(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}var J=function(e){var t=e.tension,r=e.k0,n=e.k2;return(1-t)*(n.y-r.y)/(n.x-r.x)},$=function(e){var t=e.tension,r=e.p0,n=e.p1,o=e.p2,a=e.p3;return function(e){return function(e){return(1+2*e)*(1-e)*(1-e)}(e)*n.y+function(e){return e*(1-e)*(1-e)}(e)*(o.x-n.x)*J({tension:t,k0:r,k2:o})+function(e){return e*e*(3-2*e)}(e)*o.y+function(e){return e*e*(e-1)}(e)*(o.x-n.x)*J({tension:t,k0:n,k2:a})}},K=function(e){var t=e.points,r=t[0],n=t[1],o=t[t.length-1],a=t[t.length-2];return[{x:r.x-(n.x-r.x),y:r.y-(n.y-r.y)}].concat(Q(t),[{x:o.x+(o.x-a.x),y:o.y+(o.y-a.y)}])},ee=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=e.points,r=void 0===t?[{x:0,y:0},{x:255,y:255}]:t,n=e.tension,o=void 0===n?.5:n,a=r.sort((function(e,t){return e.x-t.x})),i=K({points:a});return a.slice(0,-1).map((function(e,t){return{startPoint:e,stopPoint:a[t+1],length:a[t+1].x-e.x,polynomial:$({tension:o,p0:i[t],p1:i[t+1],p2:i[t+2],p3:i[t+3]})}}))},te=function(e){var t=e.x,r=e.polynomials.find((function(e){return e.startPoint.x<=t&&e.stopPoint.x>=t}));if(t===r.startPoint.x)return{x:t,y:r.startPoint.y};var n=(t-r.startPoint.x)/r.length;return{x:t,y:r.polynomial(n)}};function re(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){if("undefined"==typeof Symbol||!(Symbol.iterator in Object(e)))return;var r=[],n=!0,o=!1,a=void 0;try{for(var i,c=e[Symbol.iterator]();!(n=(i=c.next()).done)&&(r.push(i.value),!t||r.length!==t);n=!0);}catch(e){o=!0,a=e}finally{try{n||null==c.return||c.return()}finally{if(o)throw a}}return r}(e,t)||function(e,t){if(!e)return;if("string"==typeof e)return ne(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);"Object"===r&&e.constructor&&(r=e.constructor.name);if("Map"===r||"Set"===r)return Array.from(e);if("Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return ne(e,t)}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function ne(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}var oe=256,ae=function(e){var t=e.onChange,r=re(Object(n.useState)(),2),a=r[0],i=r[1],c=re(Object(n.useState)(0),2),u=c[0],l=c[1],f=re(Object(n.useState)([{x:0,y:0},{x:120,y:146},{x:255,y:255}]),1)[0],d=re(Object(n.useState)([]),2),s=d[0],p=d[1],m=Object(n.useRef)();Object(n.useEffect)((function(){var e=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=e.points,r=void 0===t?[{x:0,y:0},{x:255,y:255}]:t,n=e.tension,o=ee({points:r,tension:void 0===n?.5:n});return new Array(256).fill(0).map((function(e,t){return te({x:t,polynomials:o})}))}({tension:u,points:f});p(e),t({red:e,green:e,blue:e})}),[u,f,t]),Object(n.useEffect)((function(){var e=m.current.getContext("2d");e.clearRect(0,0,oe,oe),function(e){var t=e.strokeStyle;e.strokeStyle="darkgray";var r=e.lineWidth;e.lineWidth=.5,e.beginPath();for(var n=50;n<oe;n+=50)e.moveTo(n,0),e.lineTo(n,oe),e.moveTo(0,oe-n),e.lineTo(oe,oe-n);e.stroke(),e.strokeStyle=t,e.lineWidth=r}(e),a&&function(e,t){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:10,n=e.lineWidth,o=e.strokeStyle,a={x:t.x,y:oe-t.y};e.strokeStyle="#f6e58d",e.lineWidth=.5,e.beginPath(),e.moveTo(a.x,a.y-r),e.lineTo(a.x,a.y+r),e.moveTo(a.x-r,a.y),e.lineTo(a.x+r,a.y),e.stroke(),e.strokeStyle=o,e.lineWidth=n}(e,a),e.strokeStyle="red",e.beginPath(),e.moveTo(0,oe),s.forEach((function(t){e.lineTo(t.x,oe-t.y)})),e.stroke(),e.fillStyle="red",f.forEach((function(t){e.beginPath(),e.arc(t.x,oe-t.y,2,0,2*Math.PI),e.fill()}))}),[f,s,a]);return o.a.createElement(ie,null,o.a.createElement(ce,{width:oe,height:oe,ref:m,onMouseMove:function(e){var t=e.clientX-e.target.offsetLeft,r=oe-e.clientY+e.target.offsetTop;i({x:t,y:r})},onMouseLeave:function(){return i()}}),o.a.createElement(ue,null,o.a.createElement(le,null,o.a.createElement("span",null,"Tension: ",u),o.a.createElement("input",{type:"range",min:"0",max:"1",step:"0.01",value:u,onChange:function(e){return l(e.target.value)}}))))};ae.propTypes={onChange:u.a.func},ae.defaultProps={onChange:function(){return null}};var ie=l.default.div.withConfig({displayName:"ToneCurveEditor__StyledToneCurveEditor",componentId:"q38yul-0"})(["display:flex;"]),ce=l.default.canvas.withConfig({displayName:"ToneCurveEditor__Monitor",componentId:"q38yul-1"})(["background-color:black;"]),ue=l.default.div.withConfig({displayName:"ToneCurveEditor__Controls",componentId:"q38yul-2"})(["margin-left:8px;width:100%;"]),le=l.default.label.withConfig({displayName:"ToneCurveEditor__Label",componentId:"q38yul-3"})(["display:block;span{display:block;}input{width:100%;}"]),fe=ae,de=(r(167),function(e,t,r){var n=e.createShader(t);return e.shaderSource(n,r),e.compileShader(n),n}),se=function(e){var t=e.context,r=e.attribute,n=t.createBuffer();return t.bindBuffer(t.ARRAY_BUFFER,n),t.bufferData(t.ARRAY_BUFFER,new Float32Array(r.array),t.STATIC_DRAW),{buffer:n,numComponents:r.numComponents,count:Math.floor(r.array.length/r.numComponents),type:t.FLOAT,normalize:!1,offset:0,stride:0}},pe=function(e){var t=e.context,r=e.index,n=void 0===r?0:r,o=t,a=o.createTexture();return o.activeTexture(o.TEXTURE0+n),o.bindTexture(o.TEXTURE_2D,a),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_WRAP_S,o.CLAMP_TO_EDGE),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_WRAP_T,o.CLAMP_TO_EDGE),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_MIN_FILTER,o.NEAREST),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_MAG_FILTER,o.NEAREST),a},me=function(e){var t=e.context,r=e.location,n=e.buffer;t.bindBuffer(t.ARRAY_BUFFER,n.buffer),t.vertexAttribPointer(r,n.numComponents,n.type,n.normalize,n.stride,n.offset)};function ye(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){if("undefined"==typeof Symbol||!(Symbol.iterator in Object(e)))return;var r=[],n=!0,o=!1,a=void 0;try{for(var i,c=e[Symbol.iterator]();!(n=(i=c.next()).done)&&(r.push(i.value),!t||r.length!==t);n=!0);}catch(e){o=!0,a=e}finally{try{n||null==c.return||c.return()}finally{if(o)throw a}}return r}(e,t)||function(e,t){if(!e)return;if("string"==typeof e)return ve(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);"Object"===r&&e.constructor&&(r=e.constructor.name);if("Map"===r||"Set"===r)return Array.from(e);if("Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return ve(e,t)}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function ve(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}var be={array:[-1,-1,1,-1,1,1,-1,-1,1,1,-1,1],numComponents:2},he={array:[0,1,1,1,1,0,0,1,1,0,0,0],numComponents:2},ge=new ImageData(new Uint8ClampedArray(new Array(256).fill(0).flatMap((function(e,t){return[t,t,t,255]}))),256),xe=function(e){var t=e.canvasRef,r=e.pixelSource,a=ye(Object(n.useState)(!1),2),i=a[0],c=a[1],u=ye(Object(n.useState)(.5),2),l=u[0],f=u[1],d=ye(Object(n.useState)(30),2),s=d[0],p=d[1],m=ye(Object(n.useState)(0),2),y=m[0],v=m[1],b=Object(n.useRef)(),h=Object(n.useRef)(0),g=Object(n.useRef)(ge),x=Object(n.useRef)(),S=Object(n.useRef)(),w=Object(n.useRef)(),E=Object(n.useRef)(),j=Object(n.useRef)(),T=Object(n.useRef)(),O=Object(n.useRef)(),_=Object(n.useRef)(),C=Object(n.useRef)(),M=Object(n.useRef)(!0),P=Object(n.useRef)(!0),R=Object(n.useRef)(),A=Object(n.useRef)(),I=Object(n.useRef)(),N=Object(n.useRef)();Object(n.useEffect)((function(){M.current=!0}),[l]),Object(n.useEffect)((function(){var e=function(){var e=x.current;if(e)return R.current.buffer&&e.deleteBuffer(R.current.buffer),A.current.buffer&&e.deleteBuffer(A.current.buffer),I.current&&e.deleteTexture(I.current),N.current&&e.deleteTexture(N.current),j.current&&e.disableVertexAttribArray(j.current),T.current&&e.disableVertexAttribArray(T.current),function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=e.context,r=e.vertexShader,n=e.fragmentShader,o=e.program;t&&(r&&t.deleteShader(r),n&&t.deleteShader(n),o&&t.deleteProgram(o))}({context:e,vertexShader:S.current,fragmentShader:w.current,program:E.current})},r=t.current;if(!r)return e;var n=r.getBoundingClientRect();r.height=n.height,r.width=n.width;var o=r.getContext("webgl2");x.current=o;var a=function(e){var t=e.context,r=e.vertexShaderSource,n=e.fragmentShaderSource;if(t&&r&&n){var o=de(t,t.VERTEX_SHADER,r),a=de(t,t.FRAGMENT_SHADER,n),i=t.createProgram();if(t.attachShader(i,o),t.attachShader(i,a),t.linkProgram(i),t.getProgramParameter(i,t.LINK_STATUS))return{vertexShader:o,fragmentShader:a,program:i};console.error("Link failed:",t.getProgramInfoLog(i)),console.error("vs info-log:",t.getShaderInfoLog(o)),console.error("fs info-log:",t.getShaderInfoLog(a)),t.deleteShader(o),t.deleteShader(a),t.deleteProgram(i)}}({context:o,vertexShaderSource:"#version 300 es\nin vec4 aPosition;\nin vec2 aTextCoord;\nout vec2 vTextCoord;\n\nvoid main() {\n  gl_Position = aPosition;\n  vTextCoord = aTextCoord;\n}\n",fragmentShaderSource:"#version 300 es\nprecision highp float;\n\nuniform float uStrength;\nuniform sampler2D uSource;\nuniform sampler2D uTone;\nin vec2 vTextCoord;\n\nout vec4 outColor;\n\nvoid main() {\n  vec4 colorIndex = texture(uSource, vTextCoord);\n  float revStr = 1.0 - uStrength;\n  outColor = vec4(\n    uStrength * vec4(texture(uTone, vec2(colorIndex.r, 0))).r + revStr * colorIndex.r,\n    uStrength * vec4(texture(uTone, vec2(colorIndex.g, 0))).g + revStr * colorIndex.g,\n    uStrength * vec4(texture(uTone, vec2(colorIndex.b, 0))).b + revStr * colorIndex.b,\n    1.0\n  );\n}\n"});return a?(S.current=a.vertexShader,w.current=a.fragmentShader,E.current=a.program,j.current=o.getAttribLocation(a.program,"aPosition"),T.current=o.getAttribLocation(a.program,"aTextCoord"),O.current=o.getUniformLocation(a.program,"uSource"),_.current=o.getUniformLocation(a.program,"uStrength"),C.current=o.getUniformLocation(a.program,"uTone"),o.enableVertexAttribArray(j.current),o.enableVertexAttribArray(T.current),R.current=se({context:o,attribute:be}),A.current=se({context:o,attribute:he}),I.current=pe({context:o,index:0}),N.current=pe({context:o,index:1}),me({context:o,location:j.current,buffer:R.current}),me({context:o,location:T.current,buffer:A.current}),e):e}),[t]),Object(n.useEffect)((function(){if(i)return window.cancelAnimationFrame(b.current),b.current=window.requestAnimationFrame((function e(t){i&&(b.current=window.requestAnimationFrame(e));var n=1e3/s,o=t-h.current;o>=n&&(h.current=t,function(){var e=x.current;if(e&&r&&E.current){var t=e.canvas.width,n=e.canvas.height;"VIDEO"==r.nodeName?(t=r.videoWidth,n=r.videoHeight):"CANVAS"===r.nodeName&&(t=r.width,n=r.height);var o=e.canvas.width,a=e.canvas.height;o===t&&a===n||(e.canvas.width=t,e.canvas.height=n,e.viewport(0,0,t,n)),e.clearColor(0,0,0,1),e.clear(e.COLOR_BUFFER_BIT),e.useProgram(E.current),M.current&&(e.uniform1f(_.current,l),M.current=!1),e.uniform1i(O.current,0),e.bindTexture(e.TEXTURE_2D,I.current),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,e.RGBA,e.UNSIGNED_BYTE,r),P.current&&(P.current=!1),e.uniform1i(C.current,1),e.bindTexture(e.TEXTURE_2D,N.current),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,e.RGBA,e.UNSIGNED_BYTE,g.current),e.drawArrays(e.TRIANGLES,0,R.current.count)}}(),v(Math.ceil(1e3/o)))})),function(){return window.cancelAnimationFrame(b.current)};window.cancelAnimationFrame(b.current)}),[i,s,l,r]);return o.a.createElement(Se,null,o.a.createElement(we,null,"ToneCurve"),o.a.createElement(Ee,null,o.a.createElement("canvas",{ref:t})),o.a.createElement(Te,null,o.a.createElement(Oe,{isActived:i,disabled:!r,onClick:function(){return c(!i)}},"Draw"),o.a.createElement("span",null,"FPS: ",y),o.a.createElement(_e,null,o.a.createElement(Ce,null,o.a.createElement("span",null,"Max FPS: ",s),o.a.createElement("input",{type:"range",min:"1",max:"60",step:"1",value:s,onChange:function(e){return p(e.target.value)}})),o.a.createElement(Ce,null,o.a.createElement("span",null,"Strength: ",l),o.a.createElement("input",{type:"range",min:"0",max:"1",step:"0.01",value:l,onChange:function(e){return f(e.target.value)}})),o.a.createElement(fe,{onChange:function(e){var t=new ImageData(new Uint8ClampedArray(new Array(256).fill(0).flatMap((function(t,r){return[e.red[r].y,e.green[r].y,e.blue[r].y,255]}))),256);g.current=t,P.current=!0}}))))};xe.propTypes={pixelSource:u.a.object,canvasRef:u.a.object.isRequired},xe.defaultProps={pixelSource:null};var Se=l.default.div.withConfig({displayName:"ToneCurve__StyledToneCurve",componentId:"sc-1qv9013-0"})(["border:solid 1px #4834d4;border-radius:8px;overflow:hidden;"]),we=l.default.div.withConfig({displayName:"ToneCurve__Header",componentId:"sc-1qv9013-1"})(["background-color:#4834d4;padding:8px;"]),Ee=l.default.div.withConfig({displayName:"ToneCurve__Body",componentId:"sc-1qv9013-2"})(["position:relative;background-color:#686de0;padding:8px;& > canvas{width:100%;}"]),je=l.default.button.withConfig({displayName:"ToneCurve__Button",componentId:"sc-1qv9013-3"})([""," border-radius:4px;padding:4px;color:white;font-size:14px;& + &{margin-left:8px;}"],p),Te=l.default.div.withConfig({displayName:"ToneCurve__Footer",componentId:"sc-1qv9013-4"})(["background-color:#4834d4;padding:8px;button + span{margin-left:8px;}"]),Oe=Object(l.default)(je).attrs((function(e){return{style:{backgroundColor:e.isActived?"#6ab04c":"#badc58"}}})).withConfig({displayName:"ToneCurve__DrawButton",componentId:"sc-1qv9013-5"})([""]),_e=l.default.div.withConfig({displayName:"ToneCurve__Controls",componentId:"sc-1qv9013-6"})(["margin-top:8px;* + *{margin-top:4px;}"]),Ce=l.default.label.withConfig({displayName:"ToneCurve__Label",componentId:"sc-1qv9013-7"})(["display:flex;input{flex:1;margin-left:8px;}"]),Me=xe;function Pe(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){if("undefined"==typeof Symbol||!(Symbol.iterator in Object(e)))return;var r=[],n=!0,o=!1,a=void 0;try{for(var i,c=e[Symbol.iterator]();!(n=(i=c.next()).done)&&(r.push(i.value),!t||r.length!==t);n=!0);}catch(e){o=!0,a=e}finally{try{n||null==c.return||c.return()}finally{if(o)throw a}}return r}(e,t)||function(e,t){if(!e)return;if("string"==typeof e)return Re(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);"Object"===r&&e.constructor&&(r=e.constructor.name);if("Map"===r||"Set"===r)return Array.from(e);if("Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return Re(e,t)}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function Re(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}var Ae=l.default.div.withConfig({displayName:"Main__StyledMain",componentId:"sc-1te9q8o-0"})(["display:flex;flex-direction:column;padding:8px;"]),Ie=l.default.div.withConfig({displayName:"Main__ModuleWrapper",componentId:"sc-1te9q8o-1"})(["& + &{margin-top:8px;}"]),Ne=function(){var e=Pe(Object(n.useState)(),2),t=e[0],r=e[1],a=Object(n.useRef)(),i=Object(n.useRef)();return Object(n.useEffect)((function(){var e=document.createElement("video");return e.setAttribute("playsinline",!0),a.current=e,function(){return e.srcObject=null,e.pause()}}),[]),Object(n.useEffect)((function(){a.current.srcObject=t,t?a.current.play():a.current.pause()}),[t]),o.a.createElement(Ae,null,o.a.createElement(Ie,null,o.a.createElement(I,{onChange:function(e){var t=e.value;return r(t)}})),o.a.createElement(Ie,null,o.a.createElement(V,{mediaStream:t})),o.a.createElement(Ie,null,o.a.createElement(Me,{pixelSource:a.current,canvasRef:i})))},ke=r.p+"img/github-icon.e1201fcc.svg";function De(e){return(De="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function Le(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function Ue(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function Be(e,t){return(Be=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function Fe(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,n=qe(e);if(t){var o=qe(this).constructor;r=Reflect.construct(n,arguments,o)}else r=n.apply(this,arguments);return ze(this,r)}}function ze(e,t){return!t||"object"!==De(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function qe(e){return(qe=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var He=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&Be(e,t)}(i,e);var t,r,n,a=Fe(i);function i(){return Le(this,i),a.apply(this,arguments)}return t=i,(r=[{key:"render",value:function(){var e=this.props,t=e.email,r=e.github;return o.a.createElement(Xe,null,o.a.createElement(Ye,{href:r,target:"_blank"},o.a.createElement("img",{src:ke,alt:"github"})),o.a.createElement(Ye,{href:"mailto:".concat(t),target:"_blank"},o.a.createElement("img",{src:"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48cGF0aCBkPSJNNDY3LDYxSDQ1QzIwLjIxOCw2MSwwLDgxLjE5NiwwLDEwNnYzMDBjMCwyNC43MiwyMC4xMjgsNDUsNDUsNDVoNDIyYzI0LjcyLDAsNDUtMjAuMTI4LDQ1LTQ1VjEwNiBDNTEyLDgxLjI4LDQ5MS44NzIsNjEsNDY3LDYxeiBNNDYwLjc4Niw5MUwyNTYuOTU0LDI5NC44MzNMNTEuMzU5LDkxSDQ2MC43ODZ6IE0zMCwzOTkuNzg4VjExMi4wNjlsMTQ0LjQ3OSwxNDMuMjRMMzAsMzk5Ljc4OHogTTUxLjIxMyw0MjFsMTQ0LjU3LTE0NC41N2w1MC42NTcsNTAuMjIyYzUuODY0LDUuODE0LDE1LjMyNyw1Ljc5NSwyMS4xNjctMC4wNDZMMzE3LDI3Ny4yMTNMNDYwLjc4Nyw0MjFINTEuMjEzeiBNNDgyLDM5OS43ODcgTDMzOC4yMTMsMjU2TDQ4MiwxMTIuMjEyVjM5OS43ODd6Ii8+PC9zdmc+",alt:"email"})))}}])&&Ue(t.prototype,r),n&&Ue(t,n),i}(o.a.PureComponent);He.propTypes={email:u.a.string,github:u.a.string},He.defaultProps={email:"bill42362@gmail.com",github:"https://github.com/bill42362/portfolio"};var Xe=l.default.div.withConfig({displayName:"Footer__StyledFooter",componentId:"sc-1ygzj31-0"})(["flex:auto;display:flex;justify-content:center;align-items:flex-end;padding:20px;"]),Ye=l.default.a.withConfig({displayName:"Footer__Link",componentId:"sc-1ygzj31-1"})(["display:flex;justify-content:center;align-items:center;border-radius:50%;width:36px;height:36px;background-color:#576574;& + &{margin-left:8px;}img{width:60%;height:auto;}"]),Ge=He,We=r.p+"img/x-men-school.0928a818.svg";function Ve(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function Qe(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?Ve(Object(r),!0).forEach((function(t){Ze(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):Ve(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function Ze(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function Je(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},a=Object.keys(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}function $e(){var e=function(e,t){t||(t=e.slice(0));return Object.freeze(Object.defineProperties(e,{raw:{value:Object.freeze(t)}}))}(["\n  ",';\n  *, ::after, ::before { box-sizing: border-box; }\n  body {\n    background-color: #101010;\n    color: #efefef;\n    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue",\n      Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";\n    font-weight: 400;\n    -webkit-tap-highlight-color: transparent;\n    overscroll-behavior-y: contain;\n  }\n  button {\n    background-color: rgba(0, 0, 0, 0);\n    cursor: pointer;\n    &:disabled {\n      cursor: not-allowed;\n    }\n  }\n  input::placeholder,\n  input::-webkit-input-placeholder,\n  input::-moz-placeholder {\n    line-height: normal !important;\n    vertical-align: middle;\n  }\n  a { color: inherit; text-decoration: none; }\n  a > * { opacity: inherit; }\n  a:hover { opacity: .7; }\n']);return $e=function(){return e},e}var Ke=Object(l.createGlobalStyle)($e(),d.a),et="Portfolio",tt="Bill's portfolio",rt=function(e){var t=e.request;return console.log("App() request:",t),o.a.createElement(o.a.Fragment,null,o.a.createElement(s.a,{defaultTitle:"Portfolio",titleTemplate:"%s - Portfolio"},o.a.createElement("meta",{charSet:"utf-8"}),o.a.createElement("meta",{name:"viewport",content:"width=device-width, initial-scale=1"}),o.a.createElement("meta",{name:"author",content:"Bill"}),o.a.createElement("meta",{name:"description",content:tt}),o.a.createElement("meta",{property:"og:url",content:"https://github.com/bill42362/portfolio"}),o.a.createElement("meta",{property:"og:type",content:"website"}),o.a.createElement("meta",{property:"og:title",content:et}),o.a.createElement("meta",{property:"og:description",content:tt}),o.a.createElement("meta",{property:"og:site_name",content:et}),o.a.createElement("meta",{property:"twitter:card",content:"summary"}),o.a.createElement("meta",{property:"twitter:site",content:"@bill_portfolio"})),o.a.createElement(Ke,null),o.a.createElement(nt,null,!window&&o.a.createElement("img",{src:We,title:"Xavier school"}),o.a.createElement(Ne,null),o.a.createElement(Ge,null)))};rt.propTypes={request:u.a.object},rt.defaultProps={request:null};var nt=l.default.div.withConfig({displayName:"App__StyledApp",componentId:"sc-1v2nrsx-0"})(["display:flex;flex-direction:column;justify-content:center;min-height:100vh;background-color:#222f3e;"]),ot=function(e){var t=e.sheet,r=Je(e,["sheet"]);return t.instance?o.a.createElement(l.StyleSheetManager,{sheet:t.instance},o.a.createElement(rt,r)):o.a.createElement(rt,r)};ot.propTypes=Qe(Qe({},rt.propTypes),{},{sheet:u.a.object}),ot.defaultProps=Qe(Qe({},rt.defaultProps),{},{sheet:{}});var at=ot;i.a.render(o.a.createElement(at,null),document.getElementById("app-root"))}}]);
//# sourceMappingURL=bundle~bundle~5b60049d.f1554d8b.js.map