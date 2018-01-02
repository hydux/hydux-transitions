!function(n,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.transitions=t():(n.hydux=n.hydux||{},n.hydux.transitions=t())}("undefined"!=typeof self?self:this,function(){return function(n){function t(e){if(r[e])return r[e].exports;var o=r[e]={i:e,l:!1,exports:{}};return n[e].call(o.exports,o,o.exports,t),o.l=!0,o.exports}var r={};return t.m=n,t.c=r,t.d=function(n,r,e){t.o(n,r)||Object.defineProperty(n,r,{configurable:!1,enumerable:!0,get:e})},t.n=function(n){var r=n&&n.__esModule?function(){return n.default}:function(){return n};return t.d(r,"a",r),r},t.o=function(n,t){return Object.prototype.hasOwnProperty.call(n,t)},t.p="",t(t.s=0)}([function(n,t,r){"use strict";function e(n){if(n.transform)return n.transform;for(var r=Object.keys(n),e=r.length,o="";e--;){var i=r[e];if(/^translate|scale|rotate|skew|perspective|matrix/.test(i)){var u=n[i];/^scale/.test(i)||(d(u)?u+="px":m(u)&&d(u[0])&&(u=u.map(t.Units.px))),u=u instanceof Array?u.join(", "):u,o+=i+"("+u+") "}}return o}function o(n){var t=(n.duration||0)/1e3,r=(n.delay||0)/1e3;return[t+"s "+(n.easing||"ease-in-out")+" "+r+"s",n.property||"transform,opacity"]}function i(n){var t=c({},n);return delete t.WebkitTransition,delete t.transition,t}function u(n){var t=n.style||{},r=o(n),i=r[0],u=r[1],a=e(n);return l?(t.WebkitTransition=i,t.WebkitTransitionProperty=u,t.WebkitTransform=a,t.WebkitTransformOrigin=n.transformOrigin,t.WebkitTransformStyle=n.transformStyle):(t.transitionProperty=u,t.transition=i,t.transform=a,t["transform-origin"]=n.transformOrigin,t["transform-style"]=n.transformStyle),t}function a(n){return"function"==typeof n}function f(n,t,r,e,o){if(void 0===o&&(o=0),o>=n.length)return r._end(),a(e)&&e(n);var i=n[o];requestAnimationFrame(function(){requestAnimationFrame(function(){r._startFrame(i);var u=setTimeout(function(){r._endFrame(i),f(n,t,r,e,++o)},i.duration||1);t.timers.push(u)})})}var c=this&&this.__assign||Object.assign||function(n){for(var t,r=1,e=arguments.length;r<e;r++){t=arguments[r];for(var o in t)Object.prototype.hasOwnProperty.call(t,o)&&(n[o]=t[o])}return n};Object.defineProperty(t,"__esModule",{value:!0});var s=r(1);t.Units={deg:function(n){return n+"deg"},grad:function(n){return n+"grad"},rad:function(n){return n+"rag"},turn:function(n){return n+"turn"},px:function(n){return n+"px"},percent:function(n){if(n<-100||n>100)throw TypeError("n should >= -100 and <= 100, but get:"+n);return n+"%"},rem:function(n){return n+"rem"},pt:function(n){return n+"pt"},em:function(n){return n+"em"},ms:function(n){return n},cubicBezier:function(n,t,r,e){return"cubic-bezier("+n+", "+t+", "+r+", "+e+")"},start:function(n){return{start:n}},offset:function(n){return{offset:n}},matrix:function(n,t,r,e,o,i){return"matrix("+n+", "+t+", "+r+", "+e+", "+o+", "+i+")"},matrix3d:function(n,t,r,e,o,i,u,a,f){return"matrix("+n+", "+t+", "+r+", "+e+", "+o+", "+i+" "+u+", "+a+", "+f+")"}};var d=function(n){return"number"==typeof n},m=function(n){return n instanceof Array},l=function(n){return void 0!==n}(document.body.style.webkitTransform);t.actions={_startFrame:function(n){return function(t){return function(r){return[c({},t,{style:u(n),className:n.className||""}),n.onStart?s.Cmd.ofFn(n.onStart,n):s.Cmd.none]}}},_endFrame:function(n){return function(t){return function(r){return[t,n.onEnd?s.Cmd.ofFn(n.onEnd,n):[]]}}},_end:function(){return function(n){return c({},n,{animState:p.end})}},start:function(n){return function(r){return function(e){return[t.init.apply(null,r._initArgs),s.Cmd.ofSub(function(t){f(r.frames,r,t,n)})]}}},run:function(n){return function(t){return function(r){c({},t,{frames:n});return[t,s.Cmd.ofSub(function(n){n.start()})]}}},reset:function(){return function(n){return[t.init.apply(null,n._initArgs),s.Cmd.ofFn(function(){return n.timers.forEach(function(n){return clearTimeout(n)})},void 0)]}},end:function(){return function(n){return function(t){if(0!==n.frames.length){var r=n.frames[n.frames.length-1];return[c({},n,{animState:p.end,style:i(u(r)),timers:[],className:r.className||""}),s.Cmd.ofFn(function(){return n.timers.forEach(function(n){return clearTimeout(n)})},void 0)]}}}}};var p;!function(n){n[n.running=1]="running",n[n.end=2]="end",n[n.ready=3]="ready"}(p=t.AnimState||(t.AnimState={})),t.init=function(n,t){return void 0===n&&(n=[]),void 0===t&&(t={}),{animState:p.ready,style:t.initFrame?u(t.initFrame):{},className:"",timers:[],frames:n,_initArgs:[n,t]}},t.default={init:t.init,actions:t.actions,Units:t.Units}},function(n,t,r){"use strict";function e(n,t,r){return a.isFunction(n)&&(n=n(t)),a.isFunction(n)&&(n=n(r)),void 0===n||n.then&&"function"==typeof n.then?[t,u.default.none]:n instanceof Array?n:[n,u.default.none]}function o(n){function t(t){void 0===t&&(t=m),t!==m&&(m=t);var r;a.isFunction(r=n.view(m))&&(r=r(o));try{return c(r)}catch(n){console.error(n),s(n)}}function r(o,i,f,c){for(var d in f)a.isFunction(f[d])?function(r,f){i[r]=function(d){o=a.get(c,m);var l=o,p=m,y=u.default.none;try{v=e(f(d),o,i),l=v[0],y=v[1]}catch(n){console.error(n),s(n)}n.onUpdate&&(p=a.setDeep(c,a.merge(o,l),m),n.onUpdate({prevAppState:m,nextAppState:p,msgData:d,action:c.concat(r).join(".")})),l!==o&&(m=p!==m?p:a.setDeep(c,a.merge(o,l),m),t(m)),y.forEach(function(n){return n(i)});var v}}(d,f[d]):r(o[d]||(o[d]={}),i[d]={},f[d],c.concat(d))}var o={},f=n.subscribe||function(n){return u.default.none},c=n.onRender||console.log,s=n.onError||a.noop,d=e(n.init(),void 0,o),m=d[0],l=d[1];return r(m,o,n.actions,[]),l.forEach(function(n){return n(o)}),t(m),f(m).forEach(function(n){return n(o)}),i({},n,{actions:o,getState:function(){return m},render:t})}var i=this&&this.__assign||Object.assign||function(n){for(var t,r=1,e=arguments.length;r<e;r++){t=arguments[r];for(var o in t)Object.prototype.hasOwnProperty.call(t,o)&&(n[o]=t[o])}return n};Object.defineProperty(t,"__esModule",{value:!0});var u=r(2);t.Cmd=u.default;var a=r(3);t.noop=a.noop,t.default=o},function(n,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default={none:[],ofPromise:function(n,t,r,e){return[function(o){n(t).then(r).catch(e)}]},ofFn:function(n,t,r,e){return[function(o){try{var i=n(t);i&&r&&r(i)}catch(n){e&&e(n)}}]},ofSub:function(n){return[n]},batch:function(){for(var n=[],t=0;t<arguments.length;t++)n[t]=arguments[t];var r=Array.prototype.concat;return r.apply([],r.apply([],n))},map:function(n,t){return t.map(function(t){return function(r){return t(n(r))}})}}},function(n,t,r){"use strict";function e(n,t){for(var r in t)n[r]=t[r];return n}function o(n,t){return e(e(n?new n.constructor:{},n),t)}function i(n,t,r){var e=r?new r.constructor:{};return 0===n.length?t:(e[n[0]]=1<n.length?i(n.slice(1),t,r[n[0]]):t,o(r,e))}function u(n,t){for(var r=0;r<n.length;r++)t=t[n[r]];return t}function a(n){return"function"==typeof n}Object.defineProperty(t,"__esModule",{value:!0}),t.set=e,t.merge=o,t.setDeep=i,t.get=u,t.isFunction=a,t.noop=function(n){return n}}])});
//# sourceMappingURL=hydux.transitions.js.map