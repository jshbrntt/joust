var e=Object.defineProperty,t=(t,n)=>{let r={};for(var i in t)e(r,i,{get:t[i],enumerable:!0});return n||e(r,Symbol.toStringTag,{value:`Module`}),r};(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var n=class{_dense=[];_sparse=[];_count=0;add(e){let t=this._sparse[e];return t!==void 0&&t>=0&&t<this._count&&this._dense[t]===e?!1:(this._sparse[e]=this._count,this._dense[this._count++]=e,!0)}remove(e){let t=this._sparse[e];if(t===void 0||t<0||t>=this._count||this._dense[t]!==e)return!1;this._count--;let n=this._dense[this._count];return this._dense[t]=n,this._sparse[n]=t,this._sparse[e]=-1,!0}has(e){let t=this._sparse[e];return t!==void 0&&t>=0&&t<this._count&&this._dense[t]===e}get dense(){return this._dense}get count(){return this._count}[Symbol.iterator](){let e=0,t=this._dense,n=this._count;return{next(){return e<n?{value:t[e++],done:!1}:{done:!0,value:void 0}}}}},r=class{_set=new n;_nextId=1;_freelist=[];add(){let e=this._freelist.length>0?this._freelist.pop():this._nextId++;return this._set.add(e),e}remove(e){this._set.remove(e)&&this._freelist.push(e)}exists(e){return this._set.has(e)}all(){return this._set._dense.slice(0,this._set._count)}get dense(){return this._set._dense}get alive(){return this._set._count}get count(){return this._set._count}},i=31,a=class{_nextBit=0;_gen=0;_map=new Map;_masks=[[]];has(e,t){let n=this._map.get(t);return n?((this._masks[n.gen][e]??0)&n.bit)!==0:!1}add(e,t){let n=this.ensure(t),r=this._masks[n.gen][e]??0;return r&n.bit?!1:(this._masks[n.gen][e]=r|n.bit,!0)}remove(e,t){let n=this._map.get(t);if(!n)return!1;let r=this._masks[n.gen][e]??0;return r&n.bit?(this._masks[n.gen][e]=r&~n.bit,!0):!1}getAll(e){let t=[];for(let[n,r]of this._map)(this._masks[r.gen][e]??0)&r.bit&&t.push(n);return t}clear(e){for(let t=0;t<=this._gen;t++)this._masks[t][e]=0}ensure(e){let t=this._map.get(e);return t||(this._nextBit>=i&&(this._gen++,this._nextBit=0,this._masks.push([])),t={gen:this._gen,bit:1<<this._nextBit++},this._map.set(e,t),t)}};function o(e){return(...t)=>({type:e,terms:t})}var s=o(`add`),c=o(`remove`),l=class{_observers=[];subscribe(e,t){let n={hook:e,callback:t};return this._observers.push(n),()=>{let e=this._observers.indexOf(n);e>=0&&this._observers.splice(e,1)}}notifyAdd(e,t,n){for(let{hook:r,callback:i}of this._observers)r.type===`add`&&this.triggered(e,r.terms,t,n)&&i(e)}notifyRemove(e,t,n){for(let{hook:r,callback:i}of this._observers)r.type===`remove`&&this.triggered(e,r.terms,t,n)&&i(e)}triggered(e,t,n,r){let i=!1;for(let a of t)if(a===n)i=!0;else if(!r.has(e,a))return!1;return i}},u=Symbol(`qop`),d=Symbol(`hop`);function f(e){return typeof e==`object`&&!!e&&u in e}function p(e){return typeof e==`object`&&!!e&&d in e}function m(...e){return{[u]:`not`,components:e}}function h(e){return{[d]:!0,relation:e}}function g(e){let t=[],n=[],r=[],i=null;for(let a of e)if(p(a))i=a;else if(f(a)){let e=a[u];e===`not`?n.push(...a.components):e===`and`?t.push(...a.components):e===`or`&&r.push(a.components)}else t.push(a);return{required:t,excluded:n,orGroups:r,hierarchy:i}}function _(e,t,n){for(let r of t.required)if(!n.has(e,r))return!1;for(let r of t.excluded)if(n.has(e,r))return!1;for(let r of t.orGroups){let t=!1;for(let i of r)if(n.has(e,i)){t=!0;break}if(!t)return!1}return!0}var v=class{_queries=[];_hashMap=new Map;_componentIds=new Map;_nextComponentId=0;register(e,t,r,i){let a=this.hash(e),o=this._hashMap.get(a);if(o)return o;let s=new Set;for(let t of e.required)s.add(t);for(let t of e.excluded)s.add(t);for(let t of e.orGroups)for(let e of t)s.add(e);let c=new n;for(let n=0;n<i;n++){let i=r[n];_(i,e,t)&&c.add(i)}return o={compiled:e,set:c,allComponents:s,sortedCache:null,sortedDirty:!0},this._queries.push(o),this._hashMap.set(a,o),o}onComponentChanged(e,t,n){for(let r=0;r<this._queries.length;r++){let i=this._queries[r];i.allComponents.has(t)&&(_(e,i.compiled,n)?i.set.add(e)&&(i.sortedDirty=!0):i.set.remove(e)&&(i.sortedDirty=!0))}}onEntityRemoved(e){for(let t=0;t<this._queries.length;t++){let n=this._queries[t];n.set.remove(e)&&(n.sortedDirty=!0)}}clear(){this._queries.length=0,this._hashMap.clear(),this._componentIds.clear(),this._nextComponentId=0}componentId(e){let t=this._componentIds.get(e);return t===void 0&&(t=this._nextComponentId++,this._componentIds.set(e,t)),t}hash(e){let t=e.required.map(e=>this.componentId(e)).sort((e,t)=>e-t),n=e.excluded.map(e=>this.componentId(e)).sort((e,t)=>e-t),r=e.orGroups.map(e=>e.map(e=>this.componentId(e)).sort((e,t)=>e-t).join(`,`)).sort();return`${t.join(`,`)};${n.join(`,`)};${r.join(`|`)}`}};function y(e){return e.replace(/([a-z])([A-Z])/g,`$1-$2`).replace(/[\s_]+/g,`-`).toLowerCase()}function b(e){return e.replace(/-([a-z])/g,(e,t)=>t.toUpperCase())}function x(e){return`0x`+(e>>>0).toString(16).padStart(6,`0`)}var S=Symbol(`rel`),C=Symbol(`target`),w=Symbol(`pair`),T=Symbol(`exclusive`),E=Symbol(`autoRemove`),D=new Map,ee=Object.freeze([]);function O(e,t){let n=D.get(e);n||(n=new Map,D.set(e,n));let r=n.get(t);return r||(r={[w]:!0,[S]:e,[C]:t},n.set(t,r)),r}function k(e){let t=(e=>O(t,e));return t[S]=!0,e?.exclusive&&(t[T]=!0),e?.autoRemoveSubject&&(t[E]=!0),t}function te(e,t){return typeof e==`function`&&e[S]?e(t):O(e,t)}function ne(e){return typeof e==`object`&&!!e&&e[w]===!0}function re(e){return e?.[S]}function ie(e){return e?.[C]}var ae=k(),oe=class{_relations=new Map;_reverse=new Map;_host;constructor(e){this._host=e}add(e,t,n){if(t[T])for(let r of this.targets(e,t))r!==n&&this.remove(e,t,r);let r=this._relations.get(e);r||(r=new Map,this._relations.set(e,r));let i=r.get(t);i||(i=new Set,r.set(t,i)),i.add(n);let a=this._reverse.get(n);a||(a=new Set,this._reverse.set(n,a)),a.add(e);let o=O(t,n),s=O(t,ae);this._host.components.add(e,o),this._host.components.add(e,s),this._host.notifyQueryChanged(e,o),this._host.notifyQueryChanged(e,s),this._host.notifyAdd(e,o),this._host.notifyAdd(e,s)}remove(e,t,n){let r=this._relations.get(e);if(!r)return;let i=r.get(t);if(!i?.has(n))return;i.delete(n);let a=O(t,n);if(this._host.notifyRemove(e,a),this._host.components.remove(e,a),this._host.notifyQueryChanged(e,a),i.size===0){r.delete(t);let n=O(t,ae);this._host.notifyRemove(e,n),this._host.components.remove(e,n),this._host.notifyQueryChanged(e,n)}this._reverse.get(n)?.delete(e)}targets(e,t){let n=this._relations.get(e)?.get(t);if(!n)return ee;let r=[];for(let e of n)r.push(e);return r}onEntityRemoved(e){let t=this._relations.get(e);if(t){for(let[n,r]of t)for(let t of r){let r=O(n,t);this._host.notifyRemove(e,r),this._host.components.remove(e,r),this._reverse.get(t)?.delete(e)}this._relations.delete(e)}let n=this._reverse.get(e);if(!n)return;let r=[];for(let t of n){let n=this._relations.get(t);if(n)for(let[i,a]of n){if(!a.has(e))continue;a.delete(e);let o=O(i,e);if(this._host.notifyRemove(t,o),this._host.components.remove(t,o),this._host.notifyQueryChanged(t,o),a.size===0){n.delete(i);let e=O(i,ae);this._host.notifyRemove(t,e),this._host.components.remove(t,e),this._host.notifyQueryChanged(t,e)}i[E]&&r.push(t)}}this._reverse.delete(e);for(let e of r)this._host.entityExists(e)&&this._host.removeEntity(e)}},se=new Map;function ce(e,t){let n=k({exclusive:t?.exclusive,autoRemoveSubject:t?.autoRemoveSubject}),r={name:y(e),relation:n,exclusive:t?.exclusive,autoRemoveSubject:t?.autoRemoveSubject};return se.set(r.name,r),r}function A(e){return se.get(y(e))}function le(e){se.set(e.name,e)}var ue=ce(`child-of`,{exclusive:!0,autoRemoveSubject:!0});ce(`target`,{exclusive:!0});var de=class extends Error{constructor(e=`Circular dependency detected`){super(e),this.name=`CycleError`}};function fe(e,t){if(e.length===0)return[];let n=new Map,r=new Map;for(let t of e)n.set(t,new Set),r.set(t,0);for(let[e,i]of t)!n.has(e)||!n.has(i)||(n.get(e).add(i),r.set(i,r.get(i)+1));pe(e,n);let i=[],a=[];for(let t of e)r.get(t)===0&&i.push(t);for(;i.length>0;){let e=i.shift();a.push(e);for(let t of n.get(e)){let e=r.get(t)-1;r.set(t,e),e===0&&i.push(t)}}return a}function pe(e,t){let n=new Set,r=new Set;function i(e){if(r.has(e))return!0;if(n.has(e))return!1;n.add(e),r.add(e);for(let n of t.get(e))if(i(n))return!0;return r.delete(e),!1}for(let t of e)if(i(t))throw new de}var me={FIXED_DT:1/60,DEFAULT_DT:1/60,MAX_FIXED_STEPS:4},he=class extends Error{constructor(e){super(e),this.name=`OrderingError`}},ge=class{_systems=new Set;_systemsVersion=0;_accumulator=0;_initialized=new WeakSet;_cache=new Map;_cacheVersion=-1;_time={deltaTime:0,rawDeltaTime:0,fixedDeltaTime:me.FIXED_DT,elapsed:0,fixedSteps:0,fixedTick:0,throttled:!1,fenceWaitMs:0};_names=new Map;_nameCounters=new Map;_cpu=new Map;mode=void 0;get systems(){return this._systems}get systemsVersion(){return this._systemsVersion}get accumulator(){return this._accumulator}set accumulator(e){this._accumulator=e}get time(){return this._time}get cpu(){return this._cpu}reportCpu(e,t){this._cpu.set(e,(this._cpu.get(e)??0)+t)}reportFenceWait(e){this._time.fenceWaitMs=e}register(e,t){if(this._systems.add(e),this._systemsVersion++,t!==void 0){let n=t||`?`,r=this._nameCounters.get(n)??0;this._nameCounters.set(n,r+1),this._names.set(e,`${n}/${r}`)}}unregister(e){this._systems.delete(e)&&this._systemsVersion++}step(e,t=me.DEFAULT_DT){let n=me.FIXED_DT,r=n*me.MAX_FIXED_STEPS;this._cpu.clear(),this._time.rawDeltaTime=t,this._time.throttled=t>r,t=Math.min(t,r),this._time.deltaTime=t,this._time.elapsed+=t,this._accumulator+=t,this.runGroup(e,`setup`);let i=0;for(;this._accumulator>=n;)this._time.deltaTime=n,this._time.fixedTick++,this.runGroup(e,`fixed`),this._accumulator-=n,i++;this._time.fixedSteps=i,this._time.deltaTime=t,this.runGroup(e,`simulation`),this.runGroup(e,`draw`)}runGroup(e,t){for(let n of this.getSorted(t)){if(this.mode!==void 0){let e=n.annotations?.mode??`play`;if(e!==`always`&&e!==this.mode)continue}if(this._initialized.has(n)||(n.setup?.(e),this._initialized.add(n)),n.update){let t=performance.now();n.update(e);let r=performance.now()-t,i=this._names.get(n)??`?`;this._cpu.set(i,(this._cpu.get(i)??0)+r)}}}getSorted(e){this._systemsVersion!==this._cacheVersion&&(this._cache.clear(),this._cacheVersion=this._systemsVersion);let t=this._cache.get(e);if(t)return t;let n=Array.from(this._systems),r=_e(n.filter(t=>(t.group??`simulation`)===e),n);return this._cache.set(e,r),r}};function _e(e,t){ye(e,t??e);let n=e.filter(e=>e.first),r=e.filter(e=>e.last),i=e.filter(e=>!e.first&&!e.last);return[...fe(n,ve(n)),...fe(i,ve(i)),...fe(r,ve(r))]}function ve(e){let t=[];for(let n of e){for(let r of n.before??[])e.includes(r)&&t.push([n,r]);for(let r of n.after??[])e.includes(r)&&t.push([r,n])}return t}function ye(e,t){for(let n of e){if(n.first&&n.last)throw new he(`System cannot have both first and last constraints`);let e=n.group??`simulation`;for(let r of n.before??[])be(r,e,t);for(let r of n.after??[])be(r,e,t)}}function be(e,t,n){if(!n.includes(e))return;let r=e.group??`simulation`;if(r!==t)throw new he(`Cross-group constraint: ${t} references ${r}`)}var xe=Math.PI/180,Se=180/Math.PI,Ce={r:0,g:0,b:0};function we(e){return e<=.04045?e/12.92:((e+.055)/1.055)**2.4}function Te(e){return e<=.0031308?e*12.92:1.055*e**(1/2.4)-.055}function Ee(e){return Ce.r=we((e>>16&255)/255),Ce.g=we((e>>8&255)/255),Ce.b=we((e&255)/255),Ce}var De=[0,0,0];function Oe(e,t,n){let r=Math.sqrt(e*e+t*t+n*n);return r<1e-4?(De[0]=0,De[1]=-1,De[2]=0):(De[0]=e/r,De[1]=t/r,De[2]=n/r),De}function ke(e,t,n){return e<t?t:e>n?n:e}function Ae(e,t,n){let r=e*xe*.5,i=t*xe*.5,a=n*xe*.5,o=Math.cos(r),s=Math.sin(r),c=Math.cos(i),l=Math.sin(i),u=Math.cos(a),d=Math.sin(a);return{x:s*c*u+o*l*d,y:o*l*u-s*c*d,z:o*c*d+s*l*u,w:o*c*u-s*l*d}}function je(e,t,n,r){let i=e+e,a=t+t,o=n+n,s=e*i,c=e*a,l=e*o,u=t*a,d=t*o,f=n*o,p=r*i,m=r*a,h=r*o,g=l+m,_=Math.asin(g<-1?-1:g>1?1:g);return g>-.9999999&&g<.9999999?{x:Math.atan2(p-d,1-(s+u))*Se,y:_*Se,z:Math.atan2(h-c,1-(u+f))*Se}:{x:Math.atan2(d+p,1-(s+f))*Se,y:_*Se,z:0}}function Me(e,t,n,r,i){if(e<=0)throw Error(`Invalid FOV: ${e} (must be > 0)`);if(t<=0)throw Error(`Invalid aspect ratio: ${t} (must be > 0)`);if(n===r)throw Error(`Invalid depth planes: near === far (${n})`);i||=new Float32Array(16);let a=1/Math.tan(e*Math.PI/360),o=1/(n-r);return i[0]=a/t,i[1]=0,i[2]=0,i[3]=0,i[4]=0,i[5]=a,i[6]=0,i[7]=0,i[8]=0,i[9]=0,i[10]=r*o,i[11]=-1,i[12]=0,i[13]=0,i[14]=r*n*o,i[15]=0,i}function Ne(e,t,n,r,i){if(e<=0)throw Error(`Invalid orthographic size: ${e} (must be > 0)`);if(t<=0)throw Error(`Invalid aspect ratio: ${t} (must be > 0)`);if(n===r)throw Error(`Invalid depth planes: near === far (${n})`);i||=new Float32Array(16);let a=1/(e*t),o=1/e,s=1/(n-r);return i[0]=a,i[1]=0,i[2]=0,i[3]=0,i[4]=0,i[5]=o,i[6]=0,i[7]=0,i[8]=0,i[9]=0,i[10]=s,i[11]=0,i[12]=0,i[13]=0,i[14]=n*s,i[15]=1,i}function Pe(e,t,n){n||=new Float32Array(16);for(let r=0;r<4;r++)for(let i=0;i<4;i++)n[i*4+r]=e[r]*t[i*4]+e[r+4]*t[i*4+1]+e[r+8]*t[i*4+2]+e[r+12]*t[i*4+3];return n}function Fe(e,t){t||=new Float32Array(16);let n=e[0],r=e[1],i=e[2],a=e[4],o=e[5],s=e[6],c=e[8],l=e[9],u=e[10],d=e[12],f=e[13],p=e[14];return t[0]=n,t[1]=a,t[2]=c,t[3]=0,t[4]=r,t[5]=o,t[6]=l,t[7]=0,t[8]=i,t[9]=s,t[10]=u,t[11]=0,t[12]=-(n*d+r*f+i*p),t[13]=-(a*d+o*f+s*p),t[14]=-(c*d+l*f+u*p),t[15]=1,t}function j(e,t){let n=t??new Float32Array(24),r=e;n[0]=r[3]+r[0],n[1]=r[7]+r[4],n[2]=r[11]+r[8],n[3]=r[15]+r[12],n[4]=r[3]-r[0],n[5]=r[7]-r[4],n[6]=r[11]-r[8],n[7]=r[15]-r[12],n[8]=r[3]+r[1],n[9]=r[7]+r[5],n[10]=r[11]+r[9],n[11]=r[15]+r[13],n[12]=r[3]-r[1],n[13]=r[7]-r[5],n[14]=r[11]-r[9],n[15]=r[15]-r[13],n[16]=r[2],n[17]=r[6],n[18]=r[10],n[19]=r[14],n[20]=r[3]-r[2],n[21]=r[7]-r[6],n[22]=r[11]-r[10],n[23]=r[15]-r[14];for(let e=0;e<6;e++){let t=Math.hypot(n[e*4],n[e*4+1],n[e*4+2]);t>0&&(n[e*4]/=t,n[e*4+1]/=t,n[e*4+2]/=t,n[e*4+3]/=t)}return n}function Ie(e,t,n,r,i,a,o=0,s=1,c=0,l){let u=e-r,d=t-i,f=n-a,p=Math.sqrt(u*u+d*d+f*f);p<1e-6?(u=0,d=0,f=1):(p=1/p,u*=p,d*=p,f*=p);let m=s*f-c*d,h=c*u-o*f,g=o*d-s*u,_=Math.sqrt(m*m+h*h+g*g);_<1e-6&&(Math.abs(d)>.9?(m=1,h=0,g=0):(m=-f,h=0,g=u),_=Math.sqrt(m*m+h*h+g*g)),_=1/_,m*=_,h*=_,g*=_;let v=d*g-f*h,y=f*m-u*g,b=u*h-d*m,x=-(m*e+h*t+g*n),S=-(v*e+y*t+b*n),C=-(u*e+d*t+f*n);return l||=new Float32Array(16),l[0]=m,l[1]=v,l[2]=u,l[3]=0,l[4]=h,l[5]=y,l[6]=d,l[7]=0,l[8]=g,l[9]=b,l[10]=f,l[11]=0,l[12]=x,l[13]=S,l[14]=C,l[15]=1,l}function Le(e,t,n,r,i,a,o){o||=new Float32Array(16);let s=1/(t-e),c=1/(r-n),l=1/(i-a);return o[0]=2*s,o[1]=0,o[2]=0,o[3]=0,o[4]=0,o[5]=2*c,o[6]=0,o[7]=0,o[8]=0,o[9]=0,o[10]=l,o[11]=0,o[12]=-(t+e)*s,o[13]=-(r+n)*c,o[14]=i*l,o[15]=1,o}function Re(e,t,n,r){let i=r??new Float32Array(24),a=[[-1,-1,t],[1,-1,t],[-1,1,t],[1,1,t],[-1,-1,n],[1,-1,n],[-1,1,n],[1,1,n]];for(let t=0;t<8;t++){let[n,r,o]=a[t],s=e,c=s[0]*n+s[4]*r+s[8]*o+s[12],l=s[1]*n+s[5]*r+s[9]*o+s[13],u=s[2]*n+s[6]*r+s[10]*o+s[14],d=s[3]*n+s[7]*r+s[11]*o+s[15];i[t*3]=c/d,i[t*3+1]=l/d,i[t*3+2]=u/d}return i}function ze(e,t){t||=new Float32Array(16);let n=e[0],r=e[1],i=e[2],a=e[3],o=e[4],s=e[5],c=e[6],l=e[7],u=e[8],d=e[9],f=e[10],p=e[11],m=e[12],h=e[13],g=e[14],_=e[15],v=n*s-r*o,y=n*c-i*o,b=n*l-a*o,x=r*c-i*s,S=r*l-a*s,C=i*l-a*c,w=u*h-d*m,T=u*g-f*m,E=u*_-p*m,D=d*g-f*h,ee=d*_-p*h,O=f*_-p*g,k=v*O-y*ee+b*D+x*E-S*T+C*w;return Math.abs(k)<1e-10?t:(k=1/k,t[0]=(s*O-c*ee+l*D)*k,t[1]=(i*ee-r*O-a*D)*k,t[2]=(h*C-g*S+_*x)*k,t[3]=(f*S-d*C-p*x)*k,t[4]=(c*E-o*O-l*T)*k,t[5]=(n*O-i*E+a*T)*k,t[6]=(g*b-m*C-_*y)*k,t[7]=(u*C-f*b+p*y)*k,t[8]=(o*ee-s*E+l*w)*k,t[9]=(r*E-n*ee-a*w)*k,t[10]=(m*S-h*b+_*v)*k,t[11]=(d*b-u*S-p*v)*k,t[12]=(s*T-o*D-c*w)*k,t[13]=(n*D-r*T+i*w)*k,t[14]=(h*y-m*x-g*v)*k,t[15]=(u*x-d*y+f*v)*k,t)}var M={Box:0,Sphere:1,Capsule:2,Plane:3,Mesh:255};function Be(e){let t=[],n=new Map,r=new Map,i=0;return{add(a,o){if(o){let e=n.get(o);if(e!==void 0)return t[e]=a,i++,e}if(t.length>=e)throw Error(`registry limit reached (${e})`);let s=t.length;return t.push(a),o&&(n.set(o,s),r.set(s,o)),i++,s},set(e,n){if(e<0||e>=t.length)throw Error(`registry set out of bounds: ${e}`);t[e]=n,i++},get(e){return t[e]},getByName(e){return n.get(e)},getName(e){return r.get(e)},all(){return t},count(){return t.length},clear(){t.length=0,n.clear(),r.clear(),i++},get version(){return i}}}var Ve=new Map([[Float32Array,`f32`],[Uint32Array,`u32`],[Uint16Array,`u16`],[Uint8Array,`u8`],[Int32Array,`i32`]]),He=4096,Ue=He-1,We=[],Ge=1,Ke=0,qe=1<<20,Je=qe/He;function N(){return Ge*He}function Ye(e,t,n){let r=new e(He*t);return n!==0&&r.fill(n),r}function P(e,t,n){let r=Ve.get(e);if(!r)throw Error(`unknown typed-array kind`);let i=[];for(let r=0;r<Ge;r++)i.push(Ye(e,t,n));let a={chunks:i,stride:t,id:Ke++,kind:r};return We.push({ref:a,ctor:e,stride:t,fill:n}),a}function Xe(e){if(e<=N())return;let t=Ge;for(;t*He<e;)t*=2;if(t>Je)throw Error(`Entity capacity exceeded (max ${qe})`);for(;Ge<t;){for(let e of We)e.ref.chunks.push(Ye(e.ctor,e.stride,e.fill));Ge++}}function Ze(){We.length=0,Ge=1,Ke=0}function Qe(e,t,n,r,i){if(i<=0)return;let a=r.stride,o=r.chunks,s=o[0].BYTES_PER_ELEMENT,c=a*s,l=0;for(let r=0;r<o.length&&l<i;r++){let u=i-l,d=u<4096?u:He,f=d*a,p=f*s;p&3&&(f+=(4-(p&3))/s),e.writeBuffer(t,n+l*c,o[r],0,f),l+=d}}function $e(e){let t=new Map;for(let[n,r]of Object.entries(e))t.set(y(n),r);return e=>t.get(e)}function et(e){let t=new Map;for(let[n,r]of Object.entries(e))t.set(r,y(n));return e=>t.get(e)}var tt=new WeakMap;function F(e,t){if(t.enums){let e=t.parse??{},n=t.format??{};for(let[r,i]of Object.entries(t.enums))e[r]||(e[r]=$e(i)),n[r]||(n[r]=et(i));t.parse=e,t.format=n}tt.set(e,t)}function nt(e){return tt.get(e)}var rt=new Map;function it(e,t){let n=y(e),r=tt.get(t);rt.set(n,{component:t,name:n,traits:r})}function at(e){return rt.get(y(e))}function ot(){return[...rt.values()]}function st(e){for(let[t,n]of rt)if(n.component===e)return t}var ct=new WeakMap;function lt(e,t,n,r){ct.set(e,{bufId:t.id,array:t.kind,stride:n,offset:r})}function ut(e,t){let n=e[t];return n==null||ArrayBuffer.isView(n)||Array.isArray(n)?!1:typeof n==`object`}function I(e,t,n){let r=e.chunks;function i(e){return r[e>>>12][(e&Ue)*t+n]}function a(e,i){r[e>>>12][(e&Ue)*t+n]=i}let o=new Proxy([],{get(e,t){if(t===`get`)return i;if(t===`set`)return a;let n=Number(t);if(!Number.isNaN(n))return i(n)},set(e,t,n){let r=Number(t);return Number.isNaN(r)?!1:(a(r,n),!0)}});return lt(o,e,t,n),o}function dt(e,t,n){let r=e.chunks;function i(e){let i=r[e>>>12],a=(e&Ue)*t+n,o=Math.round(Te(i[a])*255),s=Math.round(Te(i[a+1])*255),c=Math.round(Te(i[a+2])*255);return o<<16|s<<8|c}function a(e,i){let a=r[e>>>12],o=(e&Ue)*t+n;a[o]=we((i>>16&255)/255),a[o+1]=we((i>>8&255)/255),a[o+2]=we((i&255)/255),a[o+3]=1}let o=new Proxy([],{get(e,t){if(t===`get`)return i;if(t===`set`)return a;let n=Number(t);if(!Number.isNaN(n))return i(n)},set(e,t,n){let r=Number(t);return Number.isNaN(r)?!1:(a(r,n),!0)}});return lt(o,e,t,n),o}Object.freeze([]);var ft=[];function pt(e){for(let t=0;t<ft.length;t++)ft[t](e)}var mt=class{entities=new r;components=new a;relations=new oe(this);observables=new l;queryCache=new v;scheduler=new ge;_resources=new Map;_disposed=!1;_max=0;_disposeHooks=[];get time(){return this.scheduler.time}get max(){return this._max}setResource(e,t){this._resources.set(e,t)}getResource(e){return this._resources.get(e)}deleteResource(e){return this._resources.delete(e)}register(e){if(`update`in e||`setup`in e||`dispose`in e)this.scheduler.register(e);else{let t=e;if(t.components)for(let[e,n]of Object.entries(t.components))it(e,n);if(t.systems)for(let e of t.systems)this.scheduler.register(e,t.name)}}unregister(e){this.scheduler.unregister(e)}step(e=me.DEFAULT_DT){this.scheduler.step(this,e),pt(this)}addEntity(){let e=this.entities.add();return Xe(e+1),e>this._max&&(this._max=e),e}removeEntity(e){if(this.entities.exists(e)){this.relations.onEntityRemoved(e);for(let t of this.components.getAll(e))this.observables.notifyRemove(e,t,this.components);if(this.queryCache.onEntityRemoved(e),this.components.clear(e),this.entities.remove(e),e===this._max)for(;this._max>0&&!this.entities.exists(this._max);)this._max--}}entityExists(e){return this.entities.exists(e)}getAllEntities(){return this.entities.all()}query(e){let t=g(e),n=this.queryCache.register(t,this.components,this.entities.dense,this.entities.alive);if(!t.hierarchy)return n.set;if(!n.sortedDirty&&n.sortedCache)return n.sortedCache;let r=[],i=n.set.dense,a=n.set.count;for(let e=0;e<a;e++)r.push(i[e]);return n.sortedCache=this.sortByDepth(r,t.hierarchy.relation),n.sortedDirty=!1,n.sortedCache}only(e){let t=-1,n=0;for(let r of this.query(e))if(n===0&&(t=r),n++,n>1)break;return n>1&&console.warn(`state.only: expected 1 match, found multiple`),t}getEntityComponents(e){return this.components.getAll(e)}addComponent(e,t){if(ne(t)){let n=re(t),r=ie(t);if(typeof r==`number`){this.relations.add(e,n,r);return}}this.components.add(e,t)&&(this.queryCache.onComponentChanged(e,t,this.components),this.notifyAdd(e,t)),this.applyDefaults(e,t)}removeComponent(e,t){if(ne(t)){let n=re(t),r=ie(t);if(typeof r==`number`){this.relations.remove(e,n,r);return}}this.notifyRemove(e,t),this.components.remove(e,t),this.queryCache.onComponentChanged(e,t,this.components)}hasComponent(e,t){return this.components.has(e,t)}getComponent(e,t){return this.components.has(e,t)?t:void 0}addRelation(e,t,n){this.addComponent(e,t.relation(n))}removeRelation(e,t,n){this.removeComponent(e,t.relation(n))}hasRelation(e,t,n){return this.hasComponent(e,t.relation(n))}getRelationTargets(e,t){return this.relations.targets(e,t.relation)}getFirstRelationTarget(e,t){let n=this.relations.targets(e,t.relation);return n.length>0?n[0]:-1}observe(e,t){return this.observables.subscribe(e,t)}notifyAdd(e,t){this.observables.notifyAdd(e,t,this.components)}notifyRemove(e,t){this.observables.notifyRemove(e,t,this.components)}notifyQueryChanged(e,t){this.queryCache.onComponentChanged(e,t,this.components)}onDispose(e){this._disposeHooks.push(e)}dispose(){if(!this._disposed){for(let e of this._disposeHooks)e();this._disposeHooks.length=0;for(let e of this.scheduler.systems)e.dispose?.(this);this.queryCache.clear(),pt(this),Ze(),this._disposed=!0}}applyDefaults(e,t){let n=nt(t);if(!n?.defaults)return;let r=n.defaults(),i=t;for(let[t,n]of Object.entries(r)){let r=i[t];r!=null&&(r[e]=n)}}sortByDepth(e,t){let n=new Map,r=e=>{let i=n.get(e);if(i!==void 0)return i;let a=this.relations.targets(e,t),o=a.length===0?0:r(a[0])+1;return n.set(e,o),o};for(let t of e)r(t);return e.sort((e,t)=>(n.get(e)??0)-(n.get(t)??0)),e}};function L(e){let t=Symbol(e),n=Object.assign(t,{from(e){return e.getResource(n)}});return n}function ht(e,t){return`${t}X`in e&&`${t}Y`in e}function gt(e,t){return ht(e,t)&&`${t}Z`in e}function _t(e,t){return gt(e,t)&&`${t}W`in e}function vt(e){let t=[],n=/<!--[\s\S]*?-->|<\/?\s*(\w+)[^>]*\/?>/g,r=0,i;for(;(i=n.exec(e))!==null;){let n=e.slice(r,i.index);/\n\s*\n/.test(n)&&t.push({type:`blank`,value:``}),r=i.index+i[0].length;let a=i[0];if(a.startsWith(`<!--`)){let e=a.slice(4,-3).trim();t.push({type:`comment`,value:e})}else if(a.startsWith(`</`)){let e=a.match(/<\/\s*(\w+)/)?.[1]??``;t.push({type:`close`,value:a,tagName:e})}else{let e=a.endsWith(`/>`),n=a.match(/<\s*(\w+)/)?.[1]??``,r=yt(a);t.push({type:`open`,value:a,selfClosing:e,tagName:n,attrs:r})}}return t}function yt(e){let t={},n=/([^\s=<>/]+)(?:\s*=\s*"([^"]*)")?/g,r=e.replace(/^<\s*\w+/,``).replace(/\/?>$/,``),i;for(;(i=n.exec(r))!==null;){let e=i[1];t[e]=i[2]??``}return t}function bt(e){if(e.match(/<[^>]*$/))throw Error(`xml parse error: Unclosed tag at end of document`);let t=vt(e);for(let e of t)if(e.type===`open`&&e.tagName!==`scene`&&e.tagName!==`a`){let t=e.tagName??`unknown`;if(t.toLowerCase()===`a`||t.toLowerCase()===`scene`)continue;throw Error(`xml parse error: Unknown tag <${t}>`)}let n=[],r=[],i=0,a=[],o=!1;for(;i<t.length;){let e=t[i];if(e.type===`blank`){o=!0,i++;continue}if(e.type===`comment`){a.push(e.value),i++;continue}if(e.type===`open`&&e.tagName===`scene`){a=[],o=!1,i++;continue}if(e.type===`close`&&e.tagName===`scene`){i++;continue}if(e.type===`open`&&e.tagName===`a`){let e=xt(t,i,r);e.node&&(e.node.comments=a.length>0?a:void 0,e.node.blankBefore=o||void 0,n.push(e.node)),a=[],o=!1,i=e.nextIndex;continue}if(e.type===`open`&&e.tagName?.toLowerCase()===`scene`)throw Error(`Invalid tag "${e.tagName}". Use lowercase <scene>`);if(e.type===`open`&&e.tagName?.toLowerCase()===`a`&&e.tagName!==`a`)throw Error(`Invalid tag "${e.tagName}". Use lowercase <a>`);i++}if(r.length>0)throw Error(r.map(e=>e.message).join(`
`));return n}function xt(e,t,n){let r=e[t];if(r.type!==`open`||r.tagName!==`a`)return r.tagName?.toLowerCase()===`a`&&n.push({message:`Invalid tag "${r.tagName}". Use lowercase <a>`}),{node:null,nextIndex:t+1};let i=r.attrs??{},a=[],o;for(let[e,t]of Object.entries(i))e===`id`?o=t:a.push({name:e,value:t});let s=[],c=t+1;if(!r.selfClosing){let t=[],r=!1;for(;c<e.length;){let i=e[c];if(i.type===`blank`){r=!0,c++;continue}if(i.type===`comment`){t.push(i.value),c++;continue}if(i.type===`close`&&i.tagName===`a`){c++;break}if(i.type===`open`&&i.tagName===`a`){let i=xt(e,c,n);i.node&&(i.node.comments=t.length>0?t:void 0,i.node.blankBefore=r||void 0,s.push(i.node)),t=[],r=!1,c=i.nextIndex;continue}c++}}return{node:{id:o,attrs:a,children:s},nextIndex:c}}function St(e,t){if(e.length===0)return t.length;if(t.length===0)return e.length;let n=[];for(let e=0;e<=t.length;e++)n[e]=[e];for(let t=0;t<=e.length;t++)n[0][t]=t;for(let r=1;r<=t.length;r++)for(let i=1;i<=e.length;i++){let a=e[i-1]===t[r-1]?0:1;n[r][i]=Math.min(n[r-1][i]+1,n[r][i-1]+1,n[r-1][i-1]+a)}return n[t.length][e.length]}function Ct(e,t){let n=y(e),r=null,i=1/0;for(let e of t){let t=y(e);if(n===t||n.endsWith(t)||n.endsWith(`-`+t))return e;let a=St(n,t),o=Math.max(n.length,t.length),s=Math.ceil(o*.5);a<i&&a<=s&&(i=a,r=e)}return r}function wt(e,t){let n=new Map,r=new Map,i=[],a=[],o=[];for(let i of e)Et(t,i,n,r,void 0,a);for(let{node:e,eid:r,parent:s}of a){s!==void 0&&t.addRelation(r,ue,s);let{componentAttrs:a,refs:c}=Tt(e.attrs);for(let e of c)Dt(t,r,e,n,i);for(let e of a)Ot(t,r,e,i,o)}for(let e of o){let t=n.get(e.targetName);if(t===void 0){i.push({message:`Unknown entity: "@${e.targetName}"`});continue}At(e.component,e.field,e.eid,t)}if(i.length>0)throw Error(i.map(e=>e.message).join(`
`));return r}function Tt(e){let t=[],n=[],r=[];for(let i of e){if(i.value.startsWith(`@`)&&i.value.length>1){n.push({attr:i.name,target:i.value.slice(1)});continue}let e=at(i.name);if(e){t.push({name:i.name,value:i.value,def:e});continue}r.push({name:i.name,value:i.value})}return{componentAttrs:t,refs:n,unknown:r}}function Et(e,t,n,r,i,a){let o=e.addEntity();t.id&&n.set(t.id,o),r.set(t,o),a.push({node:t,eid:o,parent:i});for(let i of t.children)Et(e,i,n,r,o,a);return o}function Dt(e,t,n,r,i){let a=A(n.attr);if(!a){i.push({message:`Unknown relation: "${n.attr}"`});return}let o=r.get(n.target);if(o===void 0){i.push({message:`Unknown entity: "@${n.target}"`});return}e.addRelation(t,a,o)}function Ot(e,t,n,r,i){let{def:a,value:o}=n,{component:s,name:c,traits:l}=a;e.addComponent(t,s);let u=l?.defaults?.()??{};for(let[e,n]of Object.entries(u))At(s,e,t,n);let d={};o!==``&&(d._value=o);let f=kt(a,d),p=f.values,m=f.strings,h=f.entityRefs;for(let e of f.errors)r.push({message:`<${c}> ${e}`});for(let[e,n]of Object.entries(p))At(s,e,t,n);for(let[e,n]of Object.entries(m))jt(s,e,t,n);for(let e of h)i.push({eid:t,component:s,field:e.field,targetName:e.targetName})}function kt(e,t){let n={},r={},i=[],a=[];if(t._value&&It(t._value)){let o=Ft(e.name,t._value,e.component);Object.assign(n,o.values),Object.assign(r,o.strings),i.push(...o.entityRefs),a.push(...o.errors)}for(let[o,s]of Object.entries(t))if(o!==`_value`&&s)if(It(s)){let t=Ft(e.name,s,e.component);Object.assign(n,t.values),Object.assign(r,t.strings),i.push(...t.entityRefs),a.push(...t.errors)}else{let t=Ft(e.name,`${o}: ${s}`,e.component);Object.assign(n,t.values),Object.assign(r,t.strings),i.push(...t.entityRefs),a.push(...t.errors)}return{values:n,strings:r,entityRefs:i,errors:a}}function At(e,t,n,r){let i=e[t];i!=null&&(ArrayBuffer.isView(i)||Array.isArray(i)?i[n]=r:console.warn(`Scene: cannot assign number to non-array field "${t}"`))}function jt(e,t,n,r){e[t][n]=r}function Mt(e){if(e=e.trim(),e.startsWith(`0x`)||e.startsWith(`0X`))return parseInt(e,16);if(e.startsWith(`#`)){let t=e.slice(1);return/^[0-9a-fA-F]+$/.test(t)?parseInt(t,16):null}if(e===`true`)return 1;if(e===`false`)return 0;let t=parseFloat(e);return Number.isNaN(t)?null:t}function Nt(e){let t=[],n=e.trim(),r=0;for(let e=0;e<=n.length;e++){let i=e<n.length&&/\s/.test(n[e]),a=e===n.length;(i||a)&&(r<e&&t.push(Mt(n.slice(r,e))),r=e+1)}return t}function Pt(e){let t=[],n=0;for(let r=0;r<=e.length;r++)if(r===e.length||e[r]===`;`){let i=e.slice(n,r).trim();i&&t.push(i),n=r+1}return t}function Ft(e,t,n){let r={},i={},a=[],o=[],s=Pt(t);for(let t of s){let s=t.indexOf(`:`);if(s===-1){o.push(`Invalid syntax: "${t}" (expected "field: value")`);continue}let c=t.slice(0,s).trim(),l=t.slice(s+1).trim();if(!c||!l){o.push(`Invalid syntax: "${t}" (empty field or value)`);continue}let u=b(c);if(l.startsWith(`@`)&&l.length>1){if(u in n)a.push({field:u,targetName:l.slice(1)});else{let t=Ct(c,Object.keys(n));t?o.push(`${e}: unknown field "${c}", did you mean "${y(t)}"?`):o.push(`${e}: unknown field "${c}"`)}continue}let d=Nt(l);if(d.some(e=>e===null)){let e=l.trim();if(u in n&&ut(n,u)){i[u]=e;continue}if(d.length===1){let t=nt(n)?.parse?.[u];if(t){let n=t(e);if(n!==void 0){r[u]=n;continue}}}o.push(`Invalid number in "${t}"`);continue}let f=d;if(_t(n,u)){f.length===4?(r[`${u}X`]=f[0],r[`${u}Y`]=f[1],r[`${u}Z`]=f[2],r[`${u}W`]=f[3]):f.length===1?(r[`${u}X`]=f[0],r[`${u}Y`]=f[0],r[`${u}Z`]=f[0],r[`${u}W`]=f[0]):o.push(`${e}.${c}: expected 1 or 4 values, got ${f.length}`);continue}if(gt(n,u)){f.length===3?(r[`${u}X`]=f[0],r[`${u}Y`]=f[1],r[`${u}Z`]=f[2]):f.length===1?(r[`${u}X`]=f[0],r[`${u}Y`]=f[0],r[`${u}Z`]=f[0]):o.push(`${e}.${c}: expected 1 or 3 values, got ${f.length}`);continue}if(ht(n,u)){f.length===2?(r[`${u}X`]=f[0],r[`${u}Y`]=f[1]):f.length===1?(r[`${u}X`]=f[0],r[`${u}Y`]=f[0]):o.push(`${e}.${c}: expected 1 or 2 values, got ${f.length}`);continue}if(u in n){f.length===1?r[u]=f[0]:o.push(`${e}.${c}: expected 1 value, got ${f.length}`);continue}let p=Ct(c,Object.keys(n));p?o.push(`${e}: unknown field "${c}", did you mean "${y(p)}"?`):o.push(`${e}: unknown field "${c}"`)}return{values:r,strings:i,entityRefs:a,errors:o}}function It(e){return e.includes(`:`)&&(e.includes(`;`)||/^[\w-]+\s*:/.test(e))}function Lt(e){let t=[],n=ot().map(e=>e.name);function r(e){for(let i of e){let e=new Set(i.attrs.map(e=>e.name));for(let r of i.attrs){if(r.value.startsWith(`@`)&&r.value.length>1)continue;let a=at(r.name);if(!a){let e=Ct(r.name,n),a=e?`"${r.name}" is not registered, did you mean "${e}"?`:`"${r.name}" is not registered`;t.push({node:i,attr:r.name,kind:`unregistered`,message:a});continue}if(a.traits?.requires)for(let n of a.traits.requires){let a=st(n);a&&!e.has(a)&&t.push({node:i,attr:r.name,kind:`missing-requires`,message:`"${r.name}" requires "${a}"`})}}r(i.children)}}return r(e),t}var Rt=typeof Bun<`u`,zt=Rt?`headless`:`web`,Bt=()=>performance.now(),Vt=Rt?e=>setTimeout(e,0):e=>requestAnimationFrame(e);async function Ht(e){if(Rt)return Bun.file(e).text();let t=await fetch(e);if(!t.ok)throw Error(`Failed to load ${e}: ${t.status}`);return t.text()}var Ut=L(`frame-sync`),Wt=[],Gt=null;function Kt(e){Wt=e}function qt(e){Gt=e}async function Jt(e){let t=new mt,n=e.defaults!==!1,r=e.loading??Gt?.(),i=r?.show();try{let a=e.exclude?new Set(e.exclude):null,o=new Set;if(n)for(let e of Wt)a?.has(e)||o.add(e);for(let t of e.plugins)o.add(t);let s=[...o],c=new Set;for(let e of s)for(let t of e.dependencies??[])if(!o.has(t)){console.warn(`Missing plugin dependency: ${e.name??`?`} requires ${t.name??`?`}`),c.add(e);break}for(let e of s)if(!c.has(e)){if(e.components)for(let[t,n]of Object.entries(e.components))it(t,n);if(e.relations)for(let t of e.relations)le(t);if(e.systems)for(let n of e.systems)t.scheduler.register(n,e.name)}let l=[];for(let e of s)for(let t of e.dependencies??[])l.push([t,e]);let u=fe(s,l),d=e.scene?Array.isArray(e.scene)?e.scene:[e.scene]:[],f=u.length*2+d.length;e.setup?.(t);for(let e=0;e<u.length;e++){let n=u[e],i=r?t=>r.update((e+t)/f):void 0;c.has(n)||await n.initialize?.(t,i),r?.update((e+1)/f)}if(d.length>0)for(let e=0;e<d.length;e++){let n=d[e],i=bt(n.startsWith(`<`)?n:await Ht(n));for(let e of Lt(i))console.warn(`[shallot] ${e.message}`);wt(i,t),r?.update((u.length+e+1)/f)}let p=u.filter(e=>e.warm&&!c.has(e)),m=0,h=u.length+d.length,g=p.map(async e=>{await e.warm(t,e=>{r&&r.update((h+m+e)/f)}),m++,r?.update((h+m)/f)});return await Promise.all(g),i&&(r?.update(1),await new Promise(e=>Vt(e)),i()),t}catch(e){let t=e instanceof Error?e.message:String(e);throw r?.error?.(t),e}}async function Yt(e){let t=await Jt(e);if(e.ui&&zt===`web`){let n=document.querySelector(`canvas`)?.parentElement??document.body;n.style.position=`relative`;let r=document.createElement(`div`);r.style.cssText=`position:absolute;inset:0;pointer-events:none;z-index:1`,n.appendChild(r);let i=e.ui(r,t);t.onDispose(()=>{i(),r.remove()})}let n=!1,r=Bt(),i=0;function a(){n||Vt(o)}function o(){if(n)return;let e=Bt(),o=(e-r)/1e3;r=e,t.scheduler.reportFenceWait(i),i=0,t.step(o);let s=Ut.from(t)?.();if(s){let e=Bt();s.then(()=>{i=Bt()-e,a()})}else a()}return t.onDispose(()=>{n=!0}),a(),t}var Xt={};function R(e,t){return Xt.timestampWrites=t,e.beginComputePass(Xt)}function Zt(e){let t=[],n=new Map,r=new Map;for(let t of e)for(let e of t.outputs){let i=t.inputs.includes(e)?r:n,a=i.get(e);a||(a=[],i.set(e,a)),a.push(t)}for(let[e,i]of r){let r=n.get(e)??[];for(let e=0;e<i.length;e++){let n=i[e];for(let e of r)e!==n&&t.push([e,n]);for(let r=0;r<e;r++)i[r]!==n&&t.push([i[r],n])}}for(let i of e)for(let e of i.inputs){if(i.outputs.includes(e))continue;let a=r.get(e);if(a&&a.length>0){let e=a[a.length-1];e!==i&&t.push([e,i])}else{let r=n.get(e);if(!r)continue;for(let e of r)e!==i&&t.push([e,i])}}return t}function Qt(e){if(e.length===0)return[];let t=Zt(e),n=new Map,r=new Map;for(let t of e)n.set(t,[]),r.set(t,0);for(let[e,i]of t)n.get(e).push(i),r.set(i,r.get(i)+1);let i=[];for(let t of e)r.get(t)===0&&i.push(t);let a=[],o=0;for(;o<i.length;){let e=i[o++];a.push(e);for(let t of n.get(e)){let e=r.get(t)-1;r.set(t,e),e===0&&i.push(t)}}if(a.length!==e.length)throw new de(`Circular dependency detected in compute graph. Nodes still in cycle:\n${e.filter(e=>(r.get(e)??0)>0).map(t=>{let r=e.filter(e=>n.get(e)?.includes(t)).map(e=>e.name);return`  ${t.name} <- ${r.length?r.join(`, `):`(none)`}`}).join(`
`)}`);return a}function $t(e,t){let n=[...e,...t];if(n.length===0)return{frame:[],view:[]};let r=[],i=[];for(let e of n)e.scope===`frame`?r.push(e):i.push(e);let a=new Set;for(let e of i)for(let t of e.outputs)a.add(t);for(let e of r)for(let t of e.inputs)if(a.has(t))throw Error(`Frame-scope node '${e.name}' depends on view-scope resource '${t}'`);return{frame:Qt(r),view:Qt(i)}}var en=class{nodes=new Map;check=null;_graph;constructor(e){this._graph=e}add(e){if(this.nodes.has(e.name))throw Error(`Node '${e.name}' already exists`);this.nodes.set(e.name,e),this._graph.invalidate()}set(e,t){if(t.name!==e)throw Error(`Node name '${t.name}' must match slot name '${e}'`);this.nodes.set(e,t),this._graph.invalidate()}remove(e){let t=this.nodes.delete(e);return t&&this._graph.invalidate(),t}},tn=class{nodes=new Map;_subGraphs=new Map;_plans=new Map;get planCached(){return this._plans.size>0}get subGraphs(){return this._subGraphs}subGraph(e){let t=this._subGraphs.get(e);return t||(t=new en(this),this._subGraphs.set(e,t)),t}add(e){if(this.nodes.has(e.name))throw Error(`Node '${e.name}' already exists`);this.nodes.set(e.name,e),this.invalidate()}set(e,t){if(t.name!==e)throw Error(`Node name '${t.name}' must match slot name '${e}'`);this.nodes.set(e,t),this.invalidate()}remove(e){let t=this.nodes.delete(e);return t&&this.invalidate(),t}compile(e){let t=e??``,n=this._plans.get(t);if(n)return n;let r=$t(Array.from(this.nodes.values()),e?Array.from(this._subGraphs.get(e)?.nodes.values()??[]):[]);return this._plans.set(t,r),r}async prepare(e,t){let n=Array.from(this.nodes.values());for(let e of this._subGraphs.values())for(let t of e.nodes.values())n.push(t);let r=n.filter(e=>e.prepare),i=r.length;if(i===0)return;let a=0,o=r.map(async n=>{await n.prepare(e),a++,t?.(a,i)});await Promise.all(o)}invalidate(){this._plans.clear()}};async function nn(){if(!navigator.gpu)throw Error(`This browser doesn't support WebGPU. Use Chrome 113+, Edge 113+, or a recent Firefox Nightly.`);let e=await navigator.gpu.requestAdapter();if(!e)throw Error(`No compatible GPU found. WebGPU requires a GPU with Vulkan or DirectX 12 (Feature Level 11.1+) support.`);let t=[`indirect-first-instance`];e.features.has(`timestamp-query`)&&t.push(`timestamp-query`),e.features.has(`bgra8unorm-storage`)&&t.push(`bgra8unorm-storage`);let n=await e.requestDevice({requiredFeatures:t,requiredLimits:{maxTextureDimension2D:e.limits.maxTextureDimension2D,maxStorageBuffersPerShaderStage:10}});return n.lost.then(e=>console.error(`GPU device lost: ${e.reason}`,e.message)),n.onuncapturederror=e=>{let t=e.error instanceof GPUValidationError?e.error.message:e.error;console.error(`GPU uncaptured error:`,t)},n}function z(e,t){return{binding:e,resource:{buffer:t.buffer,offset:t.offset,size:t.size}}}function B(e,t,n,r){let i=N(),a=e.createBuffer({label:t,size:r(i),usage:n});return{get buffer(){let o=N();return o!==i&&(a.destroy(),a=e.createBuffer({label:t,size:r(o),usage:n}),i=o),a}}}function rn(e,t,n){let r=N(),i=null;return{get group(){return N()!==r&&(r=N(),i=null),i||=e.createBindGroup({layout:t,entries:n()}),i},invalidate(){i=null}}}function an(e,t,n){return{get buffer(){return e.buffer},get offset(){return t(N())},get size(){return n(N())}}}var on=L(`compute`),sn=L(`shared-device`),cn={name:`Compute`,async initialize(e,t){let n=e.getResource(sn)??await nn(),r=new tn,i={textures:new Map,textureViews:new Map,buffers:new Map},a=[],o={device:n,graph:r,resources:i,frameIndex:0,get pending(){return a.length},sync(){return a.push(n.queue.onSubmittedWorkDone()),a.length>=2?a.shift():null}};e.setResource(on,o),e.setResource(Ut,()=>o.sync()),t?.(1)},async warm(e,t){let n=on.from(e);n&&await n.graph.prepare(n.device,(e,n)=>{t?.(e/n)})}},ln=16,un=16,dn=ln*un,fn=2*dn,pn=3,mn=`struct SortParams { count: u32, wgCount: u32 }`,hn=`struct PrefixParams { count: u32 }`,gn=`
@group(0) @binding(0) var<storage, read> input: array<u32>;
@group(0) @binding(1) var<storage, read_write> histograms: array<u32>;
@group(0) @binding(2) var<uniform> params: SortParams;

${mn}

override BIT: u32;

var<workgroup> bins: array<atomic<u32>, 16>;

@compute @workgroup_size(${ln}, ${un}, 1)
fn main(
    @builtin(workgroup_id) wid: vec3<u32>,
    @builtin(num_workgroups) wdim: vec3<u32>,
    @builtin(local_invocation_index) tid: u32,
) {
    let workgroup = wid.x + wid.y * wdim.x;
    let gid = workgroup * ${dn}u + tid;

    if (tid < 16u) {
        atomicStore(&bins[tid], 0u);
    }
    workgroupBarrier();

    if (gid < params.count && workgroup < params.wgCount) {
        let digit = (input[gid] >> BIT) & 0xfu;
        atomicAdd(&bins[digit], 1u);
    }
    workgroupBarrier();

    if (tid < 16u) {
        histograms[tid * params.wgCount + workgroup] = atomicLoad(&bins[tid]);
    }
}
`,_n=`
@group(0) @binding(0) var<storage, read> inKeys: array<u32>;
@group(0) @binding(1) var<storage, read_write> outKeys: array<u32>;
@group(0) @binding(2) var<storage, read> histograms: array<u32>;
@group(0) @binding(3) var<storage, read> inVals: array<u32>;
@group(0) @binding(4) var<storage, read_write> outVals: array<u32>;
@group(0) @binding(5) var<uniform> params: SortParams;

${mn}

override BIT: u32;

var<workgroup> digit_bits: array<atomic<u32>, 128>;

@compute @workgroup_size(${ln}, ${un}, 1)
fn main(
    @builtin(workgroup_id) wid: vec3<u32>,
    @builtin(num_workgroups) wdim: vec3<u32>,
    @builtin(local_invocation_index) tid: u32,
) {
    let workgroup = wid.x + wid.y * wdim.x;
    let gid = workgroup * ${dn}u + tid;

    if (tid < 128u) { atomicStore(&digit_bits[tid], 0u); }
    workgroupBarrier();

    var digit = 16u;
    if (gid < params.count && workgroup < params.wgCount) {
        digit = (inKeys[gid] >> BIT) & 0xfu;
    }

    if (digit < 16u) {
        atomicOr(&digit_bits[digit * 8u + (tid >> 5u)], 1u << (tid & 31u));
    }
    workgroupBarrier();

    if (digit >= 16u) { return; }

    let word = tid >> 5u;
    var rank = 0u;
    for (var w = 0u; w < word; w++) {
        rank += countOneBits(atomicLoad(&digit_bits[digit * 8u + w]));
    }
    rank += countOneBits(atomicLoad(&digit_bits[digit * 8u + word]) & ((1u << (tid & 31u)) - 1u));

    let dst = histograms[digit * params.wgCount + workgroup] + rank;
    outKeys[dst] = inKeys[gid];
    outVals[dst] = inVals[gid];
}
`,vn=`
@group(0) @binding(0) var<storage, read_write> data: array<u32>;
@group(0) @binding(1) var<storage, read_write> blockSums: array<u32>;
@group(0) @binding(2) var<uniform> params: PrefixParams;

${hn}

var<workgroup> temp: array<u32, ${fn*2}>;

@compute @workgroup_size(${ln}, ${un}, 1)
fn scan(
    @builtin(workgroup_id) wid: vec3<u32>,
    @builtin(num_workgroups) wdim: vec3<u32>,
    @builtin(local_invocation_index) tid: u32,
) {
    let workgroup = wid.x + wid.y * wdim.x;
    let base = workgroup * ${dn}u;
    let gid = base + tid;
    let eid = gid * 2;

    temp[tid * 2] = select(data[eid], 0u, eid >= params.count);
    temp[tid * 2 + 1] = select(data[eid + 1], 0u, eid + 1 >= params.count);

    var offset = 1u;
    for (var d = ${fn}u >> 1; d > 0; d >>= 1) {
        workgroupBarrier();
        if (tid < d) {
            let ai = offset * (tid * 2 + 1) - 1;
            let bi = offset * (tid * 2 + 2) - 1;
            temp[bi] += temp[ai];
        }
        offset *= 2;
    }

    if (tid == 0) {
        blockSums[workgroup] = temp[${fn}u - 1];
        temp[${fn}u - 1] = 0;
    }

    for (var d = 1u; d < ${fn}u; d *= 2) {
        offset >>= 1;
        workgroupBarrier();
        if (tid < d) {
            let ai = offset * (tid * 2 + 1) - 1;
            let bi = offset * (tid * 2 + 2) - 1;
            let t = temp[ai];
            temp[ai] = temp[bi];
            temp[bi] += t;
        }
    }
    workgroupBarrier();

    if (eid < params.count) { data[eid] = temp[tid * 2]; }
    if (eid + 1 < params.count) { data[eid + 1] = temp[tid * 2 + 1]; }
}

@compute @workgroup_size(${ln}, ${un}, 1)
fn addBlocks(
    @builtin(workgroup_id) wid: vec3<u32>,
    @builtin(num_workgroups) wdim: vec3<u32>,
    @builtin(local_invocation_index) tid: u32,
) {
    let workgroup = wid.x + wid.y * wdim.x;
    let eid = (workgroup * ${dn}u + tid) * 2;

    if (eid >= params.count) { return; }

    let sum = blockSums[workgroup];
    data[eid] += sum;
    if (eid + 1 < params.count) { data[eid + 1] += sum; }
}
`;function yn(e,t){if(t<=e.limits.maxComputeWorkgroupsPerDimension)return[t,1];let n=Math.ceil(Math.sqrt(t));return[n,Math.ceil(t/n)]}function bn(e,t,n,r){let i=[],a=n,o=r;for(let n=0;n<pn;n++){let r=Math.max(Math.ceil(o/fn),1),s=yn(e,r),c=e.createBuffer({label:`prefix-params-${n}`,size:4,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});e.queue.writeBuffer(c,0,new Uint32Array([o]));let l=e.createBuffer({label:`prefix-blockSums-${n}`,size:Math.max(r*4,4),usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST}),u=e.createBindGroup({layout:t,entries:[{binding:0,resource:{buffer:a}},{binding:1,resource:{buffer:l}},{binding:2,resource:{buffer:c}}]});if(i.push({paramsBuffer:c,blockSums:l,bindGroup:u,count:o,dispatch:s}),r<=1)break;a=l,o=r}return i}function xn(e){for(let t of e)t.paramsBuffer.destroy(),t.blockSums.destroy()}async function Sn(e,t,n){let r=e.createShaderModule({code:vn}),i=e.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:`storage`}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:`storage`}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:`uniform`}}]}),a=e.createPipelineLayout({bindGroupLayouts:[i]}),[o,s]=await Promise.all([e.createComputePipelineAsync({label:`prefix-scan`,layout:a,compute:{module:r,entryPoint:`scan`}}),e.createComputePipelineAsync({label:`prefix-add`,layout:a,compute:{module:r,entryPoint:`addBlocks`}})]);return{scanPipeline:o,addBlocksPipeline:s,layout:i,levels:bn(e,i,t,n),device:e}}function Cn(e,t,n){xn(e.levels),e.levels=bn(e.device,e.layout,t,n)}function wn(e){xn(e.levels)}function Tn(e,t){let{levels:n,scanPipeline:r,addBlocksPipeline:i}=e;for(let e of n)t.setPipeline(r),t.setBindGroup(0,e.bindGroup),t.dispatchWorkgroups(e.dispatch[0],e.dispatch[1],1);for(let e=n.length-2;e>=0;e--)t.setPipeline(i),t.setBindGroup(0,n[e].bindGroup),t.dispatchWorkgroups(n[e].dispatch[0],n[e].dispatch[1],1)}function En(e,t,n,r,i,a,o,s,c,l,u){let d=[];for(let f=0;f<8;f++){let p=f%2==0,m=p?a:s,h=p?o:c,g=p?s:a,_=p?c:o;d.push({histogram:{pipeline:r[f],bindGroup:e.createBindGroup({layout:t,entries:[{binding:0,resource:{buffer:m}},{binding:1,resource:{buffer:l}},{binding:2,resource:{buffer:u}}]})},scatter:{pipeline:i[f],bindGroup:e.createBindGroup({layout:n,entries:[{binding:0,resource:{buffer:m}},{binding:1,resource:{buffer:g}},{binding:2,resource:{buffer:l}},{binding:3,resource:{buffer:h}},{binding:4,resource:{buffer:_}},{binding:5,resource:{buffer:u}}]})}})}return d}async function Dn(e,t){let{keys:n,values:r,count:i}=t,a=Math.ceil(i/dn),o=e.createBuffer({label:`radix-sort-indirect`,size:12,usage:GPUBufferUsage.INDIRECT|GPUBufferUsage.COPY_DST});e.queue.writeBuffer(o,0,new Uint32Array([a,1,1]));let s=e.createBuffer({label:`radix-sort-params`,size:8,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});e.queue.writeBuffer(s,0,new Uint32Array([i,a]));let c=e.createBuffer({label:`radix-tmpKeys`,size:i*4,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST}),l=e.createBuffer({label:`radix-tmpVals`,size:i*4,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST}),u=e.createBuffer({label:`radix-histograms`,size:16*a*4,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST}),d=await Sn(e,u,16*a),f=e.createShaderModule({code:gn}),p=e.createShaderModule({code:_n}),m=e.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:`read-only-storage`}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:`storage`}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:`uniform`}}]}),h=e.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:`read-only-storage`}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:`storage`}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:`read-only-storage`}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:`read-only-storage`}},{binding:4,visibility:GPUShaderStage.COMPUTE,buffer:{type:`storage`}},{binding:5,visibility:GPUShaderStage.COMPUTE,buffer:{type:`uniform`}}]}),g=[],_=[],v=[];for(let t=0;t<32;t+=4){let n=t/4;v.push((async()=>{let[r,i]=await Promise.all([e.createComputePipelineAsync({label:`radix-histogram`,layout:e.createPipelineLayout({bindGroupLayouts:[m]}),compute:{module:f,entryPoint:`main`,constants:{BIT:t}}}),e.createComputePipelineAsync({label:`radix-scatter`,layout:e.createPipelineLayout({bindGroupLayouts:[h]}),compute:{module:p,entryPoint:`main`,constants:{BIT:t}}})]);g[n]=r,_[n]=i})())}return await Promise.all(v),{device:e,histogramLayout:m,scatterLayout:h,histogramPipelines:g,scatterPipelines:_,paramsBuffer:s,tmpKeys:c,tmpVals:l,histograms:u,passes:En(e,m,h,g,_,n,r,c,l,u,s),prefixSum:d,indirectBuffer:o,count:i}}function On(e,t,n,r){let{device:i}=e,a=Math.ceil(r/dn);e.tmpKeys.destroy(),e.tmpVals.destroy(),e.histograms.destroy(),e.count=r,i.queue.writeBuffer(e.paramsBuffer,0,new Uint32Array([r,a])),i.queue.writeBuffer(e.indirectBuffer,0,new Uint32Array([a,1,1])),e.tmpKeys=i.createBuffer({label:`radix-tmpKeys`,size:r*4,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST}),e.tmpVals=i.createBuffer({label:`radix-tmpVals`,size:r*4,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST}),e.histograms=i.createBuffer({label:`radix-histograms`,size:16*a*4,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST}),Cn(e.prefixSum,e.histograms,16*a),e.passes=En(i,e.histogramLayout,e.scatterLayout,e.histogramPipelines,e.scatterPipelines,t,n,e.tmpKeys,e.tmpVals,e.histograms,e.paramsBuffer)}function kn(e){e.tmpKeys.destroy(),e.tmpVals.destroy(),e.histograms.destroy(),e.paramsBuffer.destroy(),e.indirectBuffer.destroy(),wn(e.prefixSum)}function An(e,t){for(let n of e.passes)t.setPipeline(n.histogram.pipeline),t.setBindGroup(0,n.histogram.bindGroup),t.dispatchWorkgroupsIndirect(e.indirectBuffer,0),Tn(e.prefixSum,t),t.setPipeline(n.scatter.pipeline),t.setBindGroup(0,n.scatter.bindGroup),t.dispatchWorkgroupsIndirect(e.indirectBuffer,0)}var jn=256,Mn=1023,Nn=`
struct InstanceAABB {
    minX: f32,
    minY: f32,
    minZ: f32,
    _pad0: u32,
    maxX: f32,
    maxY: f32,
    maxZ: f32,
    _pad1: u32,
}`,Pn=`
struct SceneBounds {
    minX: atomic<i32>,
    minY: atomic<i32>,
    minZ: atomic<i32>,
    _pad0: u32,
    maxX: atomic<i32>,
    maxY: atomic<i32>,
    maxZ: atomic<i32>,
    _pad1: u32,
}`,Fn=`
struct SceneBounds {
    minX: i32,
    minY: i32,
    minZ: i32,
    _pad0: u32,
    maxX: i32,
    maxY: i32,
    maxZ: i32,
    _pad1: u32,
}`,In=`
fn floatToSortableInt(f: f32) -> i32 {
    let bits = bitcast<i32>(f);
    let mask = (bits >> 31) & 0x7FFFFFFF;
    return bits ^ mask;
}

fn sortableIntToFloat(i: i32) -> f32 {
    let mask = (i >> 31) & 0x7FFFFFFF;
    return bitcast<f32>(i ^ mask);
}`,Ln=`
fn expandBits(v: u32) -> u32 {
    var x = v & 0x3ffu;
    x = (x | (x << 16u)) & 0x030000ffu;
    x = (x | (x << 8u)) & 0x0300f00fu;
    x = (x | (x << 4u)) & 0x030c30c3u;
    x = (x | (x << 2u)) & 0x09249249u;
    return x;
}

fn mortonCode(x: u32, y: u32, z: u32) -> u32 {
    return (expandBits(x) << 2u) | (expandBits(y) << 1u) | expandBits(z);
}`,Rn=`
fn clz(x: u32) -> u32 {
    return countLeadingZeros(x);
}`,zn=`
struct TreeNode {
    minX: f32,
    minY: f32,
    minZ: f32,
    leftChild: u32,
    maxX: f32,
    maxY: f32,
    maxZ: f32,
    rightChild: u32,
}`,Bn=`const LEAF_FLAG: u32 = 0x80000000u;`,Vn=`const AABB_SENTINEL: f32 = 1e30;`,Hn=`
fn isLeaf(child: u32) -> bool {
    return (child & LEAF_FLAG) != 0u;
}

fn leafIndex(child: u32) -> u32 {
    return child & ~LEAF_FLAG;
}`,Un=new Int32Array([2139095039,2139095039,2139095039,0,2155872256,2155872256,2155872256,0]),Wn=`
${Nn}
${Pn}
${Vn}

@group(0) @binding(0) var<storage, read> leafAABBs: array<InstanceAABB>;
@group(0) @binding(1) var<storage, read_write> sceneBounds: SceneBounds;
@group(0) @binding(2) var<storage, read> leafCount: array<u32>;

var<workgroup> sharedMin: array<vec3<f32>, ${jn}>;
var<workgroup> sharedMax: array<vec3<f32>, ${jn}>;

${In}

@compute @workgroup_size(${jn})
fn main(
    @builtin(global_invocation_id) gid: vec3<u32>,
    @builtin(local_invocation_id) lid: vec3<u32>,
) {
    let count = leafCount[0];
    let tid = gid.x;
    let localId = lid.x;

    var localMin = vec3<f32>(AABB_SENTINEL, AABB_SENTINEL, AABB_SENTINEL);
    var localMax = vec3<f32>(-AABB_SENTINEL, -AABB_SENTINEL, -AABB_SENTINEL);

    if (tid < count) {
        let aabb = leafAABBs[tid];
        localMin = vec3<f32>(aabb.minX, aabb.minY, aabb.minZ);
        localMax = vec3<f32>(aabb.maxX, aabb.maxY, aabb.maxZ);
    }

    sharedMin[localId] = localMin;
    sharedMax[localId] = localMax;
    workgroupBarrier();

    for (var stride = ${jn}u / 2u; stride > 0u; stride >>= 1u) {
        if (localId < stride) {
            sharedMin[localId] = min(sharedMin[localId], sharedMin[localId + stride]);
            sharedMax[localId] = max(sharedMax[localId], sharedMax[localId + stride]);
        }
        workgroupBarrier();
    }

    if (localId == 0u) {
        let wgMin = sharedMin[0];
        let wgMax = sharedMax[0];

        atomicMin(&sceneBounds.minX, floatToSortableInt(wgMin.x));
        atomicMin(&sceneBounds.minY, floatToSortableInt(wgMin.y));
        atomicMin(&sceneBounds.minZ, floatToSortableInt(wgMin.z));
        atomicMax(&sceneBounds.maxX, floatToSortableInt(wgMax.x));
        atomicMax(&sceneBounds.maxY, floatToSortableInt(wgMax.y));
        atomicMax(&sceneBounds.maxZ, floatToSortableInt(wgMax.z));
    }
}
`,Gn=`
${Nn}
${Fn}

struct MortonParams { capacity: u32 }

@group(0) @binding(0) var<storage, read> leafAABBs: array<InstanceAABB>;
@group(0) @binding(1) var<storage, read> sceneBounds: SceneBounds;
@group(0) @binding(2) var<storage, read_write> mortonCodes: array<u32>;
@group(0) @binding(3) var<storage, read_write> sortedIds: array<u32>;
@group(0) @binding(4) var<storage, read> leafCount: array<u32>;
@group(0) @binding(5) var<uniform> mortonParams: MortonParams;

${In}
${Ln}

@compute @workgroup_size(${jn})
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let tid = gid.x;
    if (tid >= mortonParams.capacity) { return; }

    let count = leafCount[0];
    if (tid >= count) {
        mortonCodes[tid] = 0xFFFFFFFFu;
        sortedIds[tid] = 0u;
        return;
    }

    let aabb = leafAABBs[tid];
    let centroid = vec3<f32>(
        (aabb.minX + aabb.maxX) * 0.5,
        (aabb.minY + aabb.maxY) * 0.5,
        (aabb.minZ + aabb.maxZ) * 0.5
    );

    let boundsMin = vec3<f32>(
        sortableIntToFloat(sceneBounds.minX),
        sortableIntToFloat(sceneBounds.minY),
        sortableIntToFloat(sceneBounds.minZ)
    );
    let boundsMax = vec3<f32>(
        sortableIntToFloat(sceneBounds.maxX),
        sortableIntToFloat(sceneBounds.maxY),
        sortableIntToFloat(sceneBounds.maxZ)
    );

    let size = boundsMax - boundsMin;
    let safeSize = max(size, vec3<f32>(1e-6, 1e-6, 1e-6));

    let normalized = (centroid - boundsMin) / safeSize;
    let clamped = clamp(normalized, vec3<f32>(0.0), vec3<f32>(1.0));

    let quantized = vec3<u32>(clamped * ${Mn}.0);

    mortonCodes[tid] = mortonCode(quantized.x, quantized.y, quantized.z);
    sortedIds[tid] = tid;
}
`,Kn=`
${zn}
${Bn}
${Vn}

@group(0) @binding(0) var<storage, read> mortonCodes: array<u32>;
@group(0) @binding(1) var<storage, read_write> treeNodes: array<TreeNode>;
@group(0) @binding(2) var<storage, read_write> parentIndices: array<u32>;
@group(0) @binding(3) var<storage, read> leafCount: array<u32>;

${Rn}

fn delta(i: i32, j: i32, n: i32) -> i32 {
    if (j < 0 || j >= n) {
        return -1;
    }
    let codeI = mortonCodes[i];
    let codeJ = mortonCodes[j];
    if (codeI == codeJ) {
        return i32(clz(u32(i) ^ u32(j))) + 32;
    }
    return i32(clz(codeI ^ codeJ));
}

@compute @workgroup_size(${jn})
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let n = i32(leafCount[0]);
    let i = i32(gid.x);

    if (i >= n - 1) {
        return;
    }

    var first: i32;
    var last: i32;

    if (i == 0) {
        first = 0;
        last = n - 1;
    } else {
        let d = select(-1, 1, delta(i, i + 1, n) > delta(i, i - 1, n));

        let deltaMin = delta(i, i - d, n);

        var lmax = 2;
        for (var iter = 0; iter < 32; iter++) {
            if (delta(i, i + lmax * d, n) <= deltaMin) { break; }
            lmax *= 2;
        }

        var l = 0;
        var t = lmax / 2;
        for (var iter2 = 0; iter2 < 32; iter2++) {
            if (t < 1) { break; }
            if (delta(i, i + (l + t) * d, n) > deltaMin) {
                l += t;
            }
            t /= 2;
        }

        let j = i + l * d;
        first = min(i, j);
        last = max(i, j);
    }

    let deltaNode = delta(first, last, n);

    var gamma: i32;
    var split = first;
    var stride = last - first;

    for (var iter3 = 0; iter3 < 32; iter3++) {
        stride = (stride + 1) / 2;
        let middle = split + stride;

        if (middle < last) {
            let splitDelta = delta(first, middle, n);

            if (splitDelta > deltaNode) {
                split = middle;
            }
        }

        if (stride <= 1) {
            break;
        }
    }

    gamma = split;

    let leftIsLeaf = first == gamma;
    let rightIsLeaf = last == gamma + 1;

    var node: TreeNode;
    node.minX = AABB_SENTINEL;
    node.minY = AABB_SENTINEL;
    node.minZ = AABB_SENTINEL;
    node.maxX = -AABB_SENTINEL;
    node.maxY = -AABB_SENTINEL;
    node.maxZ = -AABB_SENTINEL;

    if (leftIsLeaf) {
        node.leftChild = u32(gamma) | LEAF_FLAG;
        parentIndices[u32(gamma)] = u32(i);
    } else {
        node.leftChild = u32(gamma);
        parentIndices[u32(n) + u32(gamma)] = u32(i);
    }

    if (rightIsLeaf) {
        node.rightChild = u32(gamma + 1) | LEAF_FLAG;
        parentIndices[u32(gamma + 1)] = u32(i);
    } else {
        node.rightChild = u32(gamma + 1);
        parentIndices[u32(n) + u32(gamma + 1)] = u32(i);
    }

    treeNodes[i] = node;
}
`,qn=`
${Nn}
${Bn}

const BOUNDS_SENTINEL: u32 = 0x7f800000u;

@group(0) @binding(0) var<storage, read> leafAABBs: array<InstanceAABB>;
@group(0) @binding(1) var<storage, read> sortedIds: array<u32>;
@group(0) @binding(2) var<storage, read_write> treeNodesRaw: array<atomic<u32>>;
@group(0) @binding(3) var<storage, read_write> boundsFlags: array<atomic<u32>>;
@group(0) @binding(4) var<storage, read> parentIndices: array<u32>;
@group(0) @binding(5) var<storage, read> leafCount: array<u32>;

${Hn}

fn getLeafBounds(leafIdx: u32) -> array<vec3<f32>, 2> {
    let srcIdx = sortedIds[leafIdx];
    let aabb = leafAABBs[srcIdx];
    return array<vec3<f32>, 2>(
        vec3<f32>(aabb.minX, aabb.minY, aabb.minZ),
        vec3<f32>(aabb.maxX, aabb.maxY, aabb.maxZ)
    );
}

fn getParent(nodeIdx: u32, isLeafNode: bool, n: u32) -> u32 {
    if (isLeafNode) {
        return parentIndices[nodeIdx];
    } else {
        return parentIndices[n + nodeIdx];
    }
}

fn nodeBase(idx: u32) -> u32 {
    return idx * 8u;
}

fn readChildBounds(childIdx: u32) -> array<vec3<f32>, 2> {
    let base = nodeBase(childIdx);
    let minX = bitcast<f32>(atomicLoad(&treeNodesRaw[base + 0u]));
    let minY = bitcast<f32>(atomicLoad(&treeNodesRaw[base + 1u]));
    let minZ = bitcast<f32>(atomicLoad(&treeNodesRaw[base + 2u]));
    let maxX = bitcast<f32>(atomicLoad(&treeNodesRaw[base + 4u]));
    let maxY = bitcast<f32>(atomicLoad(&treeNodesRaw[base + 5u]));
    let maxZ = bitcast<f32>(atomicLoad(&treeNodesRaw[base + 6u]));
    return array<vec3<f32>, 2>(vec3(minX, minY, minZ), vec3(maxX, maxY, maxZ));
}

fn writeBounds(nodeIdx: u32, minB: vec3<f32>, maxB: vec3<f32>) {
    let base = nodeBase(nodeIdx);
    atomicStore(&treeNodesRaw[base + 0u], bitcast<u32>(minB.x));
    atomicStore(&treeNodesRaw[base + 1u], bitcast<u32>(minB.y));
    atomicStore(&treeNodesRaw[base + 2u], bitcast<u32>(minB.z));
    atomicStore(&treeNodesRaw[base + 4u], bitcast<u32>(maxB.x));
    atomicStore(&treeNodesRaw[base + 5u], bitcast<u32>(maxB.y));
    atomicStore(&treeNodesRaw[base + 6u], bitcast<u32>(maxB.z));
}

fn readLeftChild(nodeIdx: u32) -> u32 {
    return atomicLoad(&treeNodesRaw[nodeBase(nodeIdx) + 3u]);
}

fn readRightChild(nodeIdx: u32) -> u32 {
    return atomicLoad(&treeNodesRaw[nodeBase(nodeIdx) + 7u]);
}

@compute @workgroup_size(${jn})
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let n = leafCount[0];
    let leafIdx = gid.x;

    if (leafIdx >= n) {
        return;
    }

    let bounds = getLeafBounds(leafIdx);
    writeBounds(n - 1u + leafIdx, bounds[0], bounds[1]);

    var current = leafIdx;
    var isLeafNode = true;

    for (var iter = 0u; iter < 64u; iter++) {
        let parent = getParent(current, isLeafNode, n);

        let oldFlag = atomicAdd(&boundsFlags[parent], 1u);

        if (oldFlag == 0u) {
            return;
        }

        let left = readLeftChild(parent);
        let right = readRightChild(parent);

        var leftMin: vec3<f32>;
        var leftMax: vec3<f32>;
        var rightMin: vec3<f32>;
        var rightMax: vec3<f32>;

        if (isLeaf(left)) {
            let leftBounds = getLeafBounds(leafIndex(left));
            leftMin = leftBounds[0];
            leftMax = leftBounds[1];
        } else {
            let leftBounds = readChildBounds(left);
            leftMin = leftBounds[0];
            leftMax = leftBounds[1];
        }

        if (isLeaf(right)) {
            let rightBounds = getLeafBounds(leafIndex(right));
            rightMin = rightBounds[0];
            rightMax = rightBounds[1];
        } else {
            let rightBounds = readChildBounds(right);
            rightMin = rightBounds[0];
            rightMax = rightBounds[1];
        }

        let newMin = min(leftMin, rightMin);
        let newMax = max(leftMax, rightMax);

        writeBounds(parent, newMin, newMax);

        current = parent;
        isLeafNode = false;

        if (parent == 0u) {
            break;
        }
    }
}
`;function Jn(e,t,n){let r=GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST,i=e.createBuffer({label:`${n}-treeNodes`,size:2*t*32,usage:r}),a=e.createBuffer({label:`${n}-mortonCodes`,size:t*4,usage:r}),o=e.createBuffer({label:`${n}-sortedIds`,size:t*4,usage:r}),s=e.createBuffer({label:`${n}-sceneBounds`,size:32,usage:r}),c=e.createBuffer({label:`${n}-parentIndices`,size:2*t*4,usage:r}),l=e.createBuffer({label:`${n}-boundsFlags`,size:t*4,usage:r}),u=e.createBuffer({label:`${n}-mortonParams`,size:4,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});return e.queue.writeBuffer(u,0,new Uint32Array([t])),{treeNodes:i,mortonCodes:a,sortedIds:o,sceneBounds:s,parentIndices:c,boundsFlags:l,mortonParamsBuffer:u}}function Yn(e){e.treeNodes.destroy(),e.sortedIds.destroy(),e.mortonCodes.destroy(),e.sceneBounds.destroy(),e.parentIndices.destroy(),e.boundsFlags.destroy(),e.mortonParamsBuffer.destroy()}function Xn(e,t,n,r,i){return{bounds:e.createBindGroup({layout:t.bounds.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:n}},{binding:1,resource:{buffer:i.sceneBounds}},{binding:2,resource:{buffer:r}}]}),morton:e.createBindGroup({layout:t.morton.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:n}},{binding:1,resource:{buffer:i.sceneBounds}},{binding:2,resource:{buffer:i.mortonCodes}},{binding:3,resource:{buffer:i.sortedIds}},{binding:4,resource:{buffer:r}},{binding:5,resource:{buffer:i.mortonParamsBuffer}}]}),tree:e.createBindGroup({layout:t.tree.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:i.mortonCodes}},{binding:1,resource:{buffer:i.treeNodes}},{binding:2,resource:{buffer:i.parentIndices}},{binding:3,resource:{buffer:r}}]}),propagate:e.createBindGroup({layout:t.propagate.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:n}},{binding:1,resource:{buffer:i.sortedIds}},{binding:2,resource:{buffer:i.treeNodes}},{binding:3,resource:{buffer:i.boundsFlags}},{binding:4,resource:{buffer:i.parentIndices}},{binding:5,resource:{buffer:r}}]})}}async function Zn(e,t){let{leafAABBs:n,countBuffer:r,maxLeaves:i,label:a}=t,o=Jn(e,i,a),[s,c,l,u]=await Promise.all([e.createShaderModule({code:Wn}),e.createShaderModule({code:Gn}),e.createShaderModule({code:Kn}),e.createShaderModule({code:qn})]),[d,f,p,m,h]=await Promise.all([e.createComputePipelineAsync({label:`bvh-bounds`,layout:`auto`,compute:{module:s,entryPoint:`main`}}),e.createComputePipelineAsync({label:`bvh-morton`,layout:`auto`,compute:{module:c,entryPoint:`main`}}),e.createComputePipelineAsync({label:`bvh-tree`,layout:`auto`,compute:{module:l,entryPoint:`main`}}),e.createComputePipelineAsync({label:`bvh-propagate`,layout:`auto`,compute:{module:u,entryPoint:`main`}}),Dn(e,{keys:o.mortonCodes,values:o.sortedIds,count:i})]),g={bounds:d,morton:f,tree:p,propagate:m},_=Xn(e,g,n,r,o);return{...o,radixSort:h,config:t,pipelines:g,bindGroups:_}}function Qn(e,t,n,r){Yn(e);let{countBuffer:i,label:a}=e.config;e.config={leafAABBs:n,countBuffer:i,maxLeaves:r,label:a};let o=Jn(t,r,a);Object.assign(e,o),On(e.radixSort,o.mortonCodes,o.sortedIds,r),e.bindGroups=Xn(t,e.pipelines,n,i,o)}function $n(e,t,n,r,i){n.queue.writeBuffer(e.sceneBounds,0,Un),t.clearBuffer(e.parentIndices),t.clearBuffer(e.boundsFlags);let a=Math.ceil(r/jn),o=Math.ceil(e.config.maxLeaves/jn),s=Math.ceil(Math.max(r-1,1)/jn),c=Math.ceil(r/jn),l=R(t,i?.(`lbvh:bounds`));l.setPipeline(e.pipelines.bounds),l.setBindGroup(0,e.bindGroups.bounds),l.dispatchWorkgroups(a),l.end(),l=R(t,i?.(`lbvh:morton`)),l.setPipeline(e.pipelines.morton),l.setBindGroup(0,e.bindGroups.morton),l.dispatchWorkgroups(o),l.end(),l=R(t,i?.(`lbvh:sort`)),An(e.radixSort,l),l.end(),l=R(t,i?.(`lbvh:tree`)),l.setPipeline(e.pipelines.tree),l.setBindGroup(0,e.bindGroups.tree),l.dispatchWorkgroups(s),l.end(),l=R(t,i?.(`lbvh:propagate`)),l.setPipeline(e.pipelines.propagate),l.setBindGroup(0,e.bindGroups.propagate),l.dispatchWorkgroups(c),l.end()}function er(e){Yn(e),kn(e.radixSort)}function tr(e){let t=window.devicePixelRatio||1,n=e.getBoundingClientRect(),r=Math.max(1,Math.floor(n.width*t)),i=Math.max(1,Math.floor(n.height*t));(e.width!==r||e.height!==i)&&(e.width=r,e.height=i)}function nr(e,t){let n=e.getContext(`webgpu`),r=navigator.gpu.getPreferredCanvasFormat();e.style.imageRendering=`pixelated`,n.configure({device:t,format:r,alphaMode:`premultiplied`,usage:GPUTextureUsage.RENDER_ATTACHMENT}),tr(e);let i={element:e,context:n,format:r,textures:new Map,textureViews:new Map,width:e.width,height:e.height,observer:null,dirty:!0},a=new ResizeObserver(()=>{tr(e),i.dirty=!0});return a.observe(e),i.observer=a,i}var rr=L(`gpu-profile`);function ir(e,t=32){let n=e.createQuerySet({type:`timestamp`,count:t*2}),r=t*2*8;return{querySet:n,resolveBuffer:e.createBuffer({label:`profile-resolve`,size:r,usage:GPUBufferUsage.QUERY_RESOLVE|GPUBufferUsage.COPY_SRC}),readBuffer:e.createBuffer({label:`profile-read`,size:r,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ}),capacity:t,nextSlot:0,passes:[],durations:new Map,pendingCount:0,pendingPasses:[]}}var ar=[];function or(e,t){let n=e.nextSlot;if(n>=e.capacity)return;e.passes[n]=t,e.nextSlot=n+1;let r=ar[n];return(!r||r.querySet!==e.querySet)&&(r={querySet:e.querySet,beginningOfPassWriteIndex:n*2,endOfPassWriteIndex:n*2+1},ar[n]=r),r}function sr(e){e.nextSlot=0}function cr(e,t){let n=t.nextSlot*2;n!==0&&(e.resolveQuerySet(t.querySet,0,n,t.resolveBuffer,0),t.readBuffer.mapState===`unmapped`&&(e.copyBufferToBuffer(t.resolveBuffer,0,t.readBuffer,0,n*8),t.pendingCount=t.nextSlot,t.pendingPasses=t.passes.slice(0,t.nextSlot)))}function lr(e){e.readBuffer.mapState===`unmapped`&&e.pendingCount!==0&&e.readBuffer.mapAsync(GPUMapMode.READ).catch(()=>{})}function ur(e){if(e.readBuffer.mapState!==`mapped`)return;e.durations.clear();let t=e.readBuffer.getMappedRange(),n=new BigUint64Array(t);for(let t=0;t<e.pendingCount;t++){let r=e.pendingPasses[t],i=n[t*2],a=n[t*2+1];e.durations.set(r,(e.durations.get(r)??0)+Number(a-i)/1e6)}e.readBuffer.unmap()}L(`gpu-registry`);var dr=L(`active-camera`),fr=L(`views`),pr={selector:{}},mr=L(`view-hooks`);function hr(e,t,n,r,i,a){let o=t.createCommandEncoder();n.encoder=o;let s=()=>{for(let e=0;e<i.length;e++)i[e]();i.length=0};for(let r of e){if(a){let e=performance.now();r.execute(n),a(`  ${r.name}`,performance.now()-e)}else r.execute(n);r.sync&&(t.queue.submit([o.finish()]),s(),o=t.createCommandEncoder(),n.encoder=o)}if(r&&r.nextSlot>0&&cr(o,r),a){let e=performance.now();t.queue.submit([o.finish()]),a(`Viewport/1:submit`,performance.now()-e)}else t.queue.submit([o.finish()]);s()}function gr(e,t,n){let r=[],i=n?e=>or(n,e):void 0;return{ctx:{device:e,queue:e.queue,encoder:null,context:null,format:navigator.gpu.getPreferredCanvasFormat(),canvasView:null,timestampWrites:i,getTexture(e){return t.textures.get(e)??null},getTextureView(e){return t.textureViews.get(e)??null},getBuffer(e){return t.buffers.get(e)??null},setTexture(e,n){t.textures.set(e,n)},setTextureView(e,n){t.textureViews.set(e,n)},setBuffer(e,n){t.buffers.set(e,n)},afterSubmit(e){r.push(e)},subGraph:``},afterSubmitQueue:r}}function _r(e,t,n,r){let i=e.ctx;i.context=t,i.format=n,i.canvasView=r}function vr(e,t){let n=null;for(let[r,i]of e.subGraphs){if(i.check?.(t))return r;!i.check&&n===null&&(n=r)}return n??``}var yr=null,br=null,xr=null;function Sr(e,t,n){let{device:r,graph:i,resources:a}=e,o=i.compile(t);o.frame.length!==0&&((!br||xr!==a)&&(br=gr(r,a,yr),xr=a),_r(br,null,``,null),hr(o.frame,r,br.ctx,yr,br.afterSubmitQueue,n))}var Cr=null,wr=null;function Tr(e,t,n,r){let{device:i,graph:a,resources:o}=e,{context:s,format:c}=t,l=a.compile(n);if(l.view.length===0)return;t.textures.forEach((e,t)=>{o.textures.set(t,e)}),t.textureViews.forEach((e,t)=>{o.textureViews.set(t,e)});let u=s.getCurrentTexture();if(!u)return;let d=u.createView();(!Cr||wr!==o)&&(Cr=gr(i,o,yr),wr=o),_r(Cr,s,c,d),Cr.ctx.subGraph=n,hr(l.view,i,Cr.ctx,yr,Cr.afterSubmitQueue,r),yr&&lr(yr)}var Er=[];function Dr(e){let t=on.from(e),n=fr.from(e);if(!t||!n)return;let{device:r}=t;Er.length=0;for(let t of e.query([pr]))Er.push(t);let i=Er;if(i.length===0&&document.querySelector(`canvas`)){let t=e.addEntity();e.addComponent(t,pr),i.push(t)}for(let e of i){if(n.has(e))continue;let t=pr.selector[e],i=t?document.querySelector(t):document.querySelector(`canvas`);if(!i){t&&console.warn(`Canvas selector "${t}" matched no element`);continue}n.set(e,nr(i,r))}}var Or={name:`Viewport`,systems:[{group:`setup`,annotations:{mode:`always`},setup(e){Dr(e)},update(e){let t=fr.from(e);if(t)for(let e of t.values())e.dirty&&=(e.element&&(e.width=e.element.width,e.height=e.element.height),!1)},dispose(e){let t=fr.from(e);if(t)for(let e of t.values())e.observer?.disconnect()}},{group:`draw`,annotations:{mode:`always`},last:!0,update(e){let t=on.from(e),n=fr.from(e);if(!t||!n||n.size===0)return;let r=!0;for(let e of n.values())if(e.width>0&&e.height>0){r=!1;break}if(r)return;yr&&(ur(yr),sr(yr));let i=e.scheduler.reportCpu.bind(e.scheduler),a=mr.from(e),o=!1,s;for(let[r,c]of n){if(a){s=performance.now();for(let t of a)t(e,r,c);i(`Viewport/1:hooks`,performance.now()-s)}let n=dr.from(e)?.eid??-1,l=vr(t.graph,n);o||(o=!0,s=performance.now(),Sr(t,l,i),i(`Viewport/1:frame`,performance.now()-s)),s=performance.now(),Tr(t,c,l,i),i(`Viewport/1:view`,performance.now()-s)}t.frameIndex++}}],components:{Canvas:pr},dependencies:[cn],async initialize(e){pr.selector={},e.setResource(fr,new Map),e.setResource(mr,[]);let t=on.from(e);if(t){yr=t.device.features.has(`timestamp-query`)?ir(t.device,64):null;let n=[];yr&&n.push(yr.durations),e.setResource(rr,n)}}},kr=L(`inputs`),Ar=L(`input`);function jr(e,t){e.left=(t&1)!=0,e.right=(t&2)!=0,e.middle=(t&4)!=0}function Mr(e){e.left=!1,e.middle=!1,e.right=!1}function Nr(e){e.activePointerId=null,e.activeButton=null,e.activeCanvas=null,e.lastPointerX=0,e.lastPointerY=0}function Pr(e){e.pointerHover=t=>{let n=t.target;if(!e.canvases.has(n))return;e.mouse.hover=!0;let r=n.getBoundingClientRect();e.mouse.x=t.clientX-r.left,e.mouse.y=t.clientY-r.top,e.mouse.canvasWidth=r.width,e.mouse.canvasHeight=r.height},e.pointerEnter=()=>{e.mouse.hover=!0},e.pointerLeave=()=>{e.activePointerId===null&&(e.mouse.hover=!1)},e.keyDown=t=>{let n=document.pointerLockElement;!e.canvasFocused&&!(n&&e.canvases.has(n))||(e.keys.has(t.code)||(e.keysPressed.add(t.code),e.keyPressedAt.set(t.code,performance.now())),e.keys.add(t.code))},e.keyUp=t=>{e.keys.delete(t.code),e.keysReleased.add(t.code)},e.pointerDown=t=>{let n=t.target,r=e.canvases.get(n);if(r!==void 0){if(window.focus(),(e.activePointerId===null||e.activePointerId===t.pointerId)&&jr(e.mouse,t.buttons),e.activePointerId===null){e.activePointerId=t.pointerId,e.activeButton=t.button,e.activeCanvas=n,e.focused=r,e.canvasFocused=!0,e.lastPointerX=t.clientX,e.lastPointerY=t.clientY;try{n.setPointerCapture(t.pointerId)}catch{}}t.preventDefault()}},e.windowPointerDown=t=>{e.canvases.has(t.target)||(e.canvasFocused=!1,e.keys.clear())},e.windowBlur=()=>{e.canvasFocused=!1,e.keys.clear(),e.keysPressed.clear()},e.pointerUp=t=>{t.pointerId===e.activePointerId&&(jr(e.mouse,t.buttons),t.button===e.activeButton&&(e.activeCanvas?.releasePointerCapture(t.pointerId),Nr(e)))},e.pointerCancel=t=>{t.pointerId===e.activePointerId&&(Mr(e.mouse),Nr(e))},e.pointerMove=t=>{t.pointerId===e.activePointerId&&(jr(e.mouse,t.buttons),t.preventDefault(),e.mouse.deltaX+=t.clientX-e.lastPointerX,e.mouse.deltaY+=t.clientY-e.lastPointerY,e.lastPointerX=t.clientX,e.lastPointerY=t.clientY)},e.wheel=t=>{let n=t.target;e.canvases.has(n)&&(e.mouse.scroll+=t.deltaY,t.preventDefault())},e.contextMenu=t=>{e.canvases.has(t.target)&&t.preventDefault()}}function Fr(e,t){t.addEventListener(`pointerdown`,e.pointerDown),t.addEventListener(`pointermove`,e.pointerHover),t.addEventListener(`pointerenter`,e.pointerEnter),t.addEventListener(`pointerleave`,e.pointerLeave),t.addEventListener(`wheel`,e.wheel,{passive:!1}),t.addEventListener(`contextmenu`,e.contextMenu)}function Ir(e,t){t.removeEventListener(`pointerdown`,e.pointerDown),t.removeEventListener(`pointermove`,e.pointerHover),t.removeEventListener(`pointerenter`,e.pointerEnter),t.removeEventListener(`pointerleave`,e.pointerLeave),t.removeEventListener(`wheel`,e.wheel),t.removeEventListener(`contextmenu`,e.contextMenu)}function Lr(e){window.addEventListener(`keydown`,e.keyDown),window.addEventListener(`keyup`,e.keyUp),window.addEventListener(`pointerdown`,e.windowPointerDown),window.addEventListener(`pointerup`,e.pointerUp),window.addEventListener(`pointercancel`,e.pointerCancel),window.addEventListener(`pointermove`,e.pointerMove),window.addEventListener(`blur`,e.windowBlur)}function Rr(e){window.removeEventListener(`keydown`,e.keyDown),window.removeEventListener(`keyup`,e.keyUp),window.removeEventListener(`pointerdown`,e.windowPointerDown),window.removeEventListener(`pointerup`,e.pointerUp),window.removeEventListener(`pointercancel`,e.pointerCancel),window.removeEventListener(`pointermove`,e.pointerMove),window.removeEventListener(`blur`,e.windowBlur)}function zr(e,t){let n={deltaX:0,deltaY:0,scroll:0,left:!1,right:!1,middle:!1,hover:!1,x:0,y:0,canvasWidth:0,canvasHeight:0},r=new Map,i=-1;for(let[e,n]of t)n.element&&(r.set(n.element,e),n.element.style.touchAction=`none`,i<0&&(i=e));if(r.size===0)return;let a={keys:new Set,keysPressed:new Set,keysReleased:new Set,keyPressedAt:new Map,mouse:n,canvases:r,activeCanvas:null,focused:i,lastPointerX:0,lastPointerY:0,activePointerId:null,activeButton:null,pointerHover:null,pointerEnter:null,pointerLeave:null,keyDown:null,keyUp:null,pointerDown:null,pointerUp:null,pointerCancel:null,pointerMove:null,wheel:null,contextMenu:null,canvasFocused:!0,windowPointerDown:null,windowBlur:null};Pr(a),Lr(a);for(let e of r.keys())Fr(a,e);e.setResource(Ar,a),e.setResource(kr,{mouse:n,get focused(){return a.focused},isKeyDown:e=>a.keys.has(e),isKeyPressed:e=>a.keysPressed.has(e),isKeyReleased:e=>a.keysReleased.has(e),isKeyPressedWithin:(e,t)=>performance.now()-(a.keyPressedAt.get(e)??-1/0)<t*1e3})}var Br={name:`Input`,systems:[{group:`simulation`,annotations:{mode:`always`},setup(e){let t=fr.from(e);!t||t.size===0||zr(e,t)},dispose(e){let t=Ar.from(e);if(t){Rr(t);for(let e of t.canvases.keys())Ir(t,e);e.deleteResource(Ar)}e.deleteResource(kr)}},{group:`draw`,annotations:{mode:`always`},last:!0,update(e){let t=Ar.from(e);t&&(t.keysPressed.clear(),t.keysReleased.clear(),t.mouse.deltaX=0,t.mouse.deltaY=0,t.mouse.scroll=0)}}]};function Vr(e){V.compute_transforms(e)}function Hr(e){V.ensure_capacity(e)}function Ur(){return V.get_capacity()>>>0}function Wr(){return V.get_indices_ptr()>>>0}function Gr(){return V.get_matrices_ptr()>>>0}function Kr(){return V.get_no_parent()>>>0}function qr(){return V.get_parents_ptr()>>>0}function Jr(){return V.get_pos_x_ptr()>>>0}function Yr(){return V.get_pos_y_ptr()>>>0}function Xr(){return V.get_pos_z_ptr()>>>0}function Zr(){return V.get_quat_w_ptr()>>>0}function Qr(){return V.get_quat_x_ptr()>>>0}function $r(){return V.get_quat_y_ptr()>>>0}function ei(){return V.get_quat_z_ptr()>>>0}function ti(){return V.get_scale_x_ptr()>>>0}function ni(){return V.get_scale_y_ptr()>>>0}function ri(){return V.get_scale_z_ptr()>>>0}function ii(){V.init_data()}function ai(){let e={__proto__:null};return{__proto__:null,"./shallot_transforms_bg.js":e}}var V;function oi(e,t){return V=e.exports,V}async function si(e,t){if(typeof Response==`function`&&e instanceof Response){if(typeof WebAssembly.instantiateStreaming==`function`)try{return await WebAssembly.instantiateStreaming(e,t)}catch(t){if(e.ok&&n(e.type)&&e.headers.get(`Content-Type`)!==`application/wasm`)console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n",t);else throw t}let r=await e.arrayBuffer();return await WebAssembly.instantiate(r,t)}else{let n=await WebAssembly.instantiate(e,t);return n instanceof WebAssembly.Instance?{instance:n,module:e}:n}function n(e){switch(e){case`basic`:case`cors`:case`default`:return!0}return!1}}async function ci(e){if(V!==void 0)return V;e!==void 0&&(Object.getPrototypeOf(e)===Object.prototype?{module_or_path:e}=e:console.warn(`using deprecated parameters for the initialization function; pass a single object instead`)),e===void 0&&(e=new URL(`/assets/shallot_transforms_bg-Bu0uWLYx.wasm`,``+import.meta.url));let t=ai();(typeof e==`string`||typeof Request==`function`&&e instanceof Request||typeof URL==`function`&&e instanceof URL)&&(e=fetch(e));let{instance:n,module:r}=await si(await e,t);return oi(n,r)}var li=t({NoParent:()=>Ci,compute:()=>ki,indices:()=>xi,init:()=>Oi,matrices:()=>bi,parents:()=>Si,posX:()=>ui,posY:()=>di,posZ:()=>fi,quatW:()=>gi,quatX:()=>pi,quatY:()=>mi,quatZ:()=>hi,scaleX:()=>_i,scaleY:()=>vi,scaleZ:()=>yi,sync:()=>Di}),ui,di,fi,pi,mi,hi,gi,_i,vi,yi,bi,xi,Si,Ci,wi,Ti=0;function Ei(){let e=wi.memory.buffer;Ti=Ur(),ui=new Float32Array(e,Jr(),Ti),di=new Float32Array(e,Yr(),Ti),fi=new Float32Array(e,Xr(),Ti),pi=new Float32Array(e,Qr(),Ti),mi=new Float32Array(e,$r(),Ti),hi=new Float32Array(e,ei(),Ti),gi=new Float32Array(e,Zr(),Ti),_i=new Float32Array(e,ti(),Ti),vi=new Float32Array(e,ni(),Ti),yi=new Float32Array(e,ri(),Ti),bi=new Float32Array(e,Gr(),Ti*16),xi=new Uint32Array(e,Wr(),Ti),Si=new Uint32Array(e,qr(),Ti)}function Di(){if(!wi)return;let e=N();e!==Ti&&(Hr(e),Ei())}async function Oi(){ui||(wi=await ci(),ii(),Ci=Kr(),Ei())}function ki(e){Vr(e)}function Ai(e){function t(t){return je(H.quatX[t],H.quatY[t],H.quatZ[t],H.quatW[t])[e]}function n(t,n){let r=je(H.quatX[t],H.quatY[t],H.quatZ[t],H.quatW[t]);r[e]=n;let i=Ae(r.x,r.y,r.z);H.quatX[t]=i.x,H.quatY[t]=i.y,H.quatZ[t]=i.z,H.quatW[t]=i.w}return new Proxy([],{get(e,r){if(r===`get`)return t;if(r===`set`)return n;let i=Number(r);if(!Number.isNaN(i))return t(i)},set(e,t,r){let i=Number(t);return Number.isNaN(i)?!1:(n(i,r),!0)}})}var H={get posX(){return Di(),ui},get posY(){return Di(),di},get posZ(){return Di(),fi},get quatX(){return Di(),pi},get quatY(){return Di(),mi},get quatZ(){return Di(),hi},get quatW(){return Di(),gi},get scaleX(){return Di(),_i},get scaleY(){return Di(),vi},get scaleZ(){return Di(),yi},rotX:Ai(`x`),rotY:Ai(`y`),rotZ:Ai(`z`)},ji={get data(){return Di(),bi}};function Mi(e){return{get(t){return je(t.quatX??0,t.quatY??0,t.quatZ??0,t.quatW??1)[e]},set(t,n){let r=je(n.quatX??0,n.quatY??0,n.quatZ??0,n.quatW??1);r[e]=t;let i=Ae(r.x,r.y,r.z);return{quatX:i.x,quatY:i.y,quatZ:i.z,quatW:i.w}}}}F(H,{defaults:()=>({posX:0,posY:0,posZ:0,quatX:0,quatY:0,quatZ:0,quatW:1,scaleX:1,scaleY:1,scaleZ:1}),annotations:{derived:{rotX:Mi(`x`),rotY:Mi(`y`),rotZ:Mi(`z`)}}});var Ni={name:`Transforms`,systems:[{group:`simulation`,annotations:{mode:`always`},last:!0,update(e){Di();for(let t of e.query([H,m(ji)]))e.addComponent(t,ji);for(let t of e.query([m(H),ji]))e.removeComponent(t,ji);let t=0;for(let n of e.query([H,m(ue.relation(ae))]))xi[t]=n,Si[t]=Ci,t++;for(let n of e.query([H,ue.relation(ae),h(ue.relation)]))xi[t]=n,Si[t]=e.getRelationTargets(n,ue)[0],t++;ki(t)}}],components:{Transform:H},async initialize(e,t){await Oi(),t?.(1)}},Pi={color:[],intensity:[]};F(Pi,{defaults:()=>({color:16777215,intensity:.5}),format:{color:x}});var Fi={color:[],intensity:[],radius:[],shadows:[]};F(Fi,{requires:[H],defaults:()=>({color:16777215,intensity:1,radius:10,shadows:0}),format:{color:x}});var U={color:[],intensity:[],directionX:[],directionY:[],directionZ:[],shadows:[]};F(U,{defaults:()=>({color:16777215,intensity:1.5,directionX:-.6,directionY:-1,directionZ:-.8,shadows:1}),format:{color:x}});var Ii=new Float32Array(12);function Li(e,t){let n=Ee(e.color);Ii[0]=n.r,Ii[1]=n.g,Ii[2]=n.b,Ii[3]=e.intensity;let[r,i,a]=Oe(t.directionX,t.directionY,t.directionZ);Ii[4]=r,Ii[5]=i,Ii[6]=a,Ii[7]=0;let o=Ee(t.color);return Ii[8]=o.r*t.intensity,Ii[9]=o.g*t.intensity,Ii[10]=o.b*t.intensity,Ii[11]=0,Ii}var Ri=512*4,zi=new Float32Array(512);function Bi(e,t){let n=0,r=0,i=!1;for(let a of e.query([Fi])){if(n>=64){i=!0;break}let e=n*8,o=ji.data;zi[e]=o[a*16+12],zi[e+1]=o[a*16+13],zi[e+2]=o[a*16+14],zi[e+3]=Fi.radius[a];let s=Ee(Fi.color[a]),c=Fi.intensity[a];zi[e+4]=s.r*c,zi[e+5]=s.g*c,zi[e+6]=s.b*c,t&&Fi.shadows[a]!==0?(zi[e+7]=r,r++):zi[e+7]=-1,n++}return i&&console.warn(`point light cap reached (64)`),[zi,n]}var Vi=`depth24plus`,Hi=`r32float`,Ui=`r8unorm`,Wi=`r32uint`,Gi=`rgba16float`;function Ki(e){return e.createBuffer({label:`scene`,size:352,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC})}function qi(e){return e.createBuffer({label:`sky`,size:192,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC})}function Ji(e,t,n,r,i,a,o,s){let c=o.get(t);if(c&&c.width===i&&c.height===a&&c.usage===r)return;c?.destroy();let l=e.createTexture({label:t,size:{width:i,height:a},format:n,usage:r});o.set(t,l),s.set(t,l.createView())}function Yi(e,t,n,r,i,a,o){let s=r.get(`color`);if(!s||s.width!==t||s.height!==n){s?.destroy(),r.get(`eid`)?.destroy(),r.get(`z`)?.destroy();let a=e.createTexture({label:`color`,size:{width:t,height:n},format:Gi,usage:GPUTextureUsage.STORAGE_BINDING|GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),o=e.createTexture({label:`eid`,size:{width:t,height:n},format:Wi,usage:GPUTextureUsage.STORAGE_BINDING|GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_SRC}),c=e.createTexture({label:`z`,size:{width:t,height:n},format:Vi,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING});r.set(`color`,a),i.set(`color`,a.createView()),r.set(`eid`,o),i.set(`eid`,o.createView()),r.set(`z`,c),i.set(`z`,c.createView())}let c=a?t:1,l=a?n:1;Ji(e,`depth`,Hi,GPUTextureUsage.STORAGE_BINDING|GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING,c,l,r,i);let u=o?t:1,d=o?n:1;Ji(e,`mask`,Ui,GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING,u,d,r,i)}var Xi={Perspective:0,Orthographic:1},W={fov:[],near:[],far:[],active:[],clearColor:[],mode:[],size:[]};F(W,{requires:[H],defaults:()=>({fov:60,near:.1,far:1e3,active:1,clearColor:920844,mode:Xi.Perspective,size:5}),format:{clearColor:x},enums:{mode:Xi}});var Zi={exposure:[]};F(Zi,{defaults:()=>({exposure:1})});var Qi={},$i={strength:[],inner:[],outer:[]};F($i,{defaults:()=>({strength:.5,inner:.4,outer:.8})});var ea={bands:[]};F(ea,{defaults:()=>({bands:32})});var ta={strength:[]};F(ta,{defaults:()=>({strength:.1})});var na={softness:[],samples:[],distance:[]};F(na,{defaults:()=>({softness:0,samples:1,distance:100})});var ra={},ia={density:[],color:[]};F(ia,{defaults:()=>({density:.005,color:4225232}),format:{color:x}});var aa={zenith:[],horizon:[],band:[]};F(aa,{defaults:()=>({zenith:4225232,horizon:4233432,band:0}),format:{zenith:x,horizon:x}});var oa={phase:[],opacity:[],azimuth:[],elevation:[]};F(oa,{defaults:()=>({phase:.5,opacity:1,azimuth:45,elevation:30})});var sa={intensity:[],amount:[]};F(sa,{defaults:()=>({intensity:.8,amount:.5})});var ca={coverage:[],density:[],height:[],color:[]};F(ca,{defaults:()=>({coverage:.7,density:.8,height:.5,color:16777215}),format:{color:x}});var la={size:[],color:[],glow:[],azimuth:[],elevation:[]};F(la,{defaults:()=>({size:1,color:16773336,glow:.3,azimuth:0,elevation:45}),format:{color:x}});var ua={width:[],height:[]};F(ua,{defaults:()=>({width:0,height:0})});var da=ce(`render-target`,{exclusive:!0}),fa=new ArrayBuffer(352),G=new Float32Array(fa),pa=new Uint32Array(fa),ma=new Float32Array(16),ha=new Float32Array(16),ga=new Float32Array(16);function _a(e,t,n,r,i=0,a=1,o=0,s=0){let c=n/r,l=W.mode[t]===Xi.Orthographic?Ne(W.size[t],c,W.near[t],W.far[t],ma):Me(W.fov[t],c,W.near[t],W.far[t],ma),u=ji.data.subarray(t*16,t*16+16);Pe(l,Fe(u,ha),e),G.set(e,0);let d=ze(e,ga);G.set(d,16),G.set(u,32);let f=Ee(W.clearColor[t]);G[60]=f.r,G[61]=f.g,G[62]=f.b,G[63]=1,G[64]=W.mode[t],G[65]=W.size[t],G[66]=n,G[67]=r,G[68]=W.fov[t],G[69]=W.near[t],G[70]=W.far[t],G[71]=i,pa[72]=a,pa[73]=o,pa[74]=0,pa[75]=s}var va=new ArrayBuffer(192),K=new Float32Array(va);function ya(e,t,n,r,i,a,o,s){K[0]=n?.density??0,K[1]=r?.band??0,K[2]=0,K[3]=0;let c=Ee(n?.color??8425648);K[4]=c.r,K[5]=c.g,K[6]=c.b,K[7]=1;let l=Ee(r?.zenith??0);K[8]=l.r,K[9]=l.g,K[10]=l.b,K[11]=r?1:0;let u=Ee(r?.horizon??0);K[12]=u.r,K[13]=u.g,K[14]=u.b,K[15]=1,K[16]=i?.phase??.5,K[17]=i?.opacity??1,K[18]=i?1:0,K[19]=0;let d=(i?.azimuth??45)*Math.PI/180,f=(i?.elevation??30)*Math.PI/180,p=Math.cos(f);K[20]=Math.sin(d)*p,K[21]=Math.sin(f),K[22]=Math.cos(d)*p,K[23]=0,K[24]=a?.intensity??.8,K[25]=a?.amount??.5,K[26]=a?1:0,K[27]=0,K[28]=o?.coverage??0,K[29]=o?.density??0,K[30]=o?.height??0,K[31]=o?1:0;let m=Ee(o?.color??16777215);K[32]=m.r,K[33]=m.g,K[34]=m.b,K[35]=0,K[36]=s?.size??.7,K[37]=s?1:0,K[38]=s&&s.color!==0?1:0,K[39]=s?.glow??0;let h=Ee(s?.color??16777215);K[40]=h.r,K[41]=h.g,K[42]=h.b,K[43]=0;let g=(s?.azimuth??0)*Math.PI/180,_=(s?.elevation??45)*Math.PI/180,v=Math.cos(_);K[44]=Math.sin(g)*v,K[45]=Math.sin(_),K[46]=Math.cos(g)*v,K[47]=0,e.queue.writeBuffer(t,0,va)}var ba={color:0,intensity:0},xa={color:0,intensity:0,directionX:0,directionY:-1,directionZ:0};function Sa(e,t,n,r,i){let{width:a,height:o}=i.element??i,s=a,c=o;if(n.hasComponent(r,ua)){let e=ua.width[r],t=ua.height[r];e>0&&t>0?(s=e,c=t):t>0&&o>0?(c=t,s=Math.max(1,Math.round(a/o*t))):e>0&&a>0&&(s=e,c=Math.max(1,Math.round(o/a*e)))}if(t.viewportCap){let e=t.viewportCap(r,s,c);s=e.w,c=e.h}t.width=s,t.height=c;let l=t.needsDepth,u=t.effects.overlay.length>0||l;Yi(e,s,c,i.textures,i.textureViews,l,u);let d=n.only([U]),f=d<0||U.shadows[d]!==0,p=n.hasComponent(r,na)&&f,m=p?na.softness[r]??0:0,h=p?Math.max(1,na.samples[r]??1):0,g=n.hasComponent(r,ra)?1:0,_=n.only([ia]),v=_>=0?{density:ia.density[_],color:ia.color[_]}:void 0,y=n.only([aa]),b=y>=0?{zenith:aa.zenith[y],horizon:aa.horizon[y],band:aa.band[y]}:void 0,x=n.only([oa]),S=x>=0?{phase:oa.phase[x],opacity:oa.opacity[x],azimuth:oa.azimuth[x],elevation:oa.elevation[x]}:void 0,C=n.only([sa]),w=C>=0?{intensity:sa.intensity[C],amount:sa.amount[C]}:void 0,T=n.only([ca]),E=T>=0?{coverage:ca.coverage[T],density:ca.density[T],height:ca.height[T],color:ca.color[T]}:void 0,D=n.only([la]),ee=D>=0?{size:la.size[D],color:la.color[D],glow:la.glow[D],azimuth:la.azimuth[D],elevation:la.elevation[D]}:void 0;_a(t.viewProj,r,s,c,m,h,g,t.entityCount),ba.color=0,ba.intensity=0,xa.color=0,xa.intensity=0,xa.directionX=0,xa.directionY=-1,xa.directionZ=0;let O=n.only([Pi]);O>=0&&(ba.color=Pi.color[O],ba.intensity=Pi.intensity[O]),d>=0&&(xa.color=U.color[d],xa.intensity=U.intensity[d],xa.directionX=U.directionX[d],xa.directionY=U.directionY[d],xa.directionZ=U.directionZ[d]);let k=Li(ba,xa);G.set(k,48),G[76]=n.time.elapsed;let te=0;for(let e of n.query([Fi]))if(te++,te>=64)break;pa[77]=te,G[78]=p&&d>=0?U.shadows[d]:0;let ne=n.hasComponent(r,Zi);G[80]=ne?Zi.exposure[r]:1,n.hasComponent(r,$i)?(G[81]=$i.strength[r],G[82]=$i.inner[r],G[83]=$i.outer[r]):(G[81]=0,G[82]=0,G[83]=1),G[84]=n.hasComponent(r,ea)?ea.bands[r]:0,G[85]=n.hasComponent(r,ta)?ta.strength[r]:0,pa[86]=ne?1:0,pa[87]=n.hasComponent(r,Qi)?1:0,e.queue.writeBuffer(t.scene,0,G),ya(e,t.sky,v,b,S,w,E,ee)}var Ca=`
struct SurfaceData {
    worldPos: vec3<f32>,
    objectPos: vec3<f32>,
    worldNormal: vec3<f32>,
    objectNormal: vec3<f32>,
    baseColor: vec3<f32>,
    emission: vec3<f32>,
    uv: vec2<f32>,
    roughness: f32,
    reflectivity: f32,
    opacity: f32,
}`,wa=`
struct Scene {
    viewProj: mat4x4<f32>,
    invViewProj: mat4x4<f32>,
    cameraWorld: mat4x4<f32>,
    ambientColor: vec4<f32>,
    sunDirection: vec4<f32>,
    sunColor: vec4<f32>,
    clearColor: vec4<f32>,
    cameraMode: f32,
    cameraSize: f32,
    viewport: vec2<f32>,
    fov: f32,
    near: f32,
    far: f32,
    shadowSoftness: f32,
    shadowSamples: u32,
    reflectionEnabled: u32,
    _reserved0: u32,
    instanceCount: u32,
    time: f32,
    pointLightCount: u32,
    shadowStrength: f32,
    _pad2: f32,
    exposure: f32,
    vignetteStrength: f32,
    vignetteInner: f32,
    vignetteOuter: f32,
    posterizeBands: f32,
    ditherStrength: f32,
    tonemapMode: u32,
    fxaaEnabled: u32,
}`,Ta=`
struct Sky {
    hazeDensity: f32,
    horizonBand: f32,
    _pad3: f32,
    _pad4: f32,
    hazeColor: vec4<f32>,
    skyZenith: vec4<f32>,
    skyHorizon: vec4<f32>,
    moonParams: vec4<f32>,
    moonDirection: vec4<f32>,
    starParams: vec4<f32>,
    cloudParams: vec4<f32>,
    cloudColor: vec4<f32>,
    sunParams: vec4<f32>,
    sunVisualColor: vec4<f32>,
    sunDirection: vec4<f32>,
}`,Ea=`
struct Data {
    baseColor: vec4<f32>,
    pbr: vec4<f32>,
    emission: vec4<f32>,
    flags: u32,
    sizeX: f32,
    sizeY: f32,
    sizeZ: f32,
}`,Da=`
fn toOKLab(c: vec3<f32>) -> vec3<f32> {
    let lms = vec3(
        0.4122214708 * c.r + 0.5363325363 * c.g + 0.0514459929 * c.b,
        0.2119034982 * c.r + 0.6806995451 * c.g + 0.1073969566 * c.b,
        0.0883024619 * c.r + 0.2220049174 * c.g + 0.6896926207 * c.b,
    );
    let cbrt = pow(max(lms, vec3(0.0)), vec3(1.0 / 3.0));
    return vec3(
        0.2104542553 * cbrt.x + 0.7936177850 * cbrt.y - 0.0040720468 * cbrt.z,
        1.9779984951 * cbrt.x - 2.4285922050 * cbrt.y + 0.4505937099 * cbrt.z,
        0.0259040371 * cbrt.x + 0.7827717662 * cbrt.y - 0.8086757660 * cbrt.z,
    );
}

fn fromOKLab(lab: vec3<f32>) -> vec3<f32> {
    let l = lab.x + 0.3963377774 * lab.y + 0.2158037573 * lab.z;
    let m = lab.x - 0.1055613458 * lab.y - 0.0638541728 * lab.z;
    let s = lab.x - 0.0894841775 * lab.y - 1.2914855480 * lab.z;
    return max(vec3(
         4.0767416621 * l*l*l - 3.3077115913 * m*m*m + 0.2309699292 * s*s*s,
        -1.2684380046 * l*l*l + 2.6097574011 * m*m*m - 0.3413193965 * s*s*s,
        -0.0041960863 * l*l*l - 0.7034186147 * m*m*m + 1.7076147010 * s*s*s,
    ), vec3(0.0));
}

fn darkTone(base: vec3<f32>) -> vec3<f32> {
    let lab = toOKLab(base);
    return fromOKLab(vec3(lab.x * 0.75, lab.y, lab.z - 0.02));
}

fn lightTone(base: vec3<f32>) -> vec3<f32> {
    let lab = toOKLab(base);
    return fromOKLab(vec3(lab.x * 1.12, lab.y, lab.z + 0.02));
}
`,Oa=`
fn toWorldSpace(localPos: vec3<f32>, eid: u32) -> vec3<f32> {
    return (matrices[eid] * vec4(localPos, 1.0)).xyz;
}
fn toObjectSpace(wp: vec3<f32>, eid: u32) -> vec3<f32> {
    let m = matrices[eid];
    let p = wp - m[3].xyz;
    return vec3(dot(p, m[0].xyz), dot(p, m[1].xyz), dot(p, m[2].xyz));
}
`,ka=`
struct PointLightData {
    position: vec3<f32>,
    radius: f32,
    color: vec3<f32>,
    shadowIdx: f32,
}`,Aa=`
struct PointShadow {
    viewProj: array<mat4x4<f32>, 24>,
    lightPosRadius: array<vec4<f32>, 4>,
}`,ja=`
struct Shadow {
    cascade0ViewProj: mat4x4<f32>,
    cascade1ViewProj: mat4x4<f32>,
    cascade2ViewProj: mat4x4<f32>,
    cascade3ViewProj: mat4x4<f32>,
    cascadeSplits: vec4<f32>,
    cascadeTexelSizes: vec4<f32>,
}`,Ma=`
struct PulledVertex {
    position: vec3<f32>,
    normal: vec3<f32>,
    uv: vec2<f32>,
}

fn pullVertex(vertexIndex: u32, eid: u32) -> PulledVertex {
    let shapeId = shapes[eid];
    let sm = meshMeta[shapeId];
    let vtxOffset = sm.x + vertexIndex * 8u;
    var v: PulledVertex;
    v.position = vec3(meshVertexData[vtxOffset], meshVertexData[vtxOffset+1u], meshVertexData[vtxOffset+2u]);
    v.normal = vec3(meshVertexData[vtxOffset+3u], meshVertexData[vtxOffset+4u], meshVertexData[vtxOffset+5u]);
    v.uv = vec2(meshVertexData[vtxOffset+6u], meshVertexData[vtxOffset+7u]);
    return v;
}
`,Na=`
struct VertexInput {
    @builtin(vertex_index) vertexIndex: u32,
    @builtin(instance_index) instance: u32,
}

struct VertexOutput {
    @builtin(position) @invariant position: vec4<f32>,
    @location(0) color: vec4<f32>,
    @location(1) worldNormal: vec3<f32>,
    @location(2) @interpolate(flat) entityId: u32,
    @location(3) worldPos: vec3<f32>,
    @location(4) objectPos: vec3<f32>,
    @location(5) objectNormal: vec3<f32>,
    @location(6) uv: vec2<f32>,
}

${Ca}
${Da}
${Oa}

struct FragmentOutput {
    @location(0) color: vec4<f32>,
    @location(1) entityId: u32,
}

${wa}

${Ea}

@group(0) @binding(0) var<uniform> scene: Scene;
@group(0) @binding(1) var<storage, read> entityIds: array<u32>;
@group(0) @binding(2) var<storage, read> matrices: array<mat4x4<f32>>;
@group(0) @binding(3) var<storage, read> sizes: array<vec4<f32>>;
@group(0) @binding(4) var<storage, read> data: array<Data>;
@group(0) @binding(8) var<storage, read> shapes: array<u32>;
@group(0) @binding(9) var<storage, read> meshVertexData: array<f32>;
@group(0) @binding(10) var<storage, read> meshMeta: array<vec4<u32>>;

${Ma}
`;function Pa(e){return e?`var pos = localPos;
    var uv = meshUv;
    ${e}
    return VertexTransformResult(pos, uv);`:`return VertexTransformResult(localPos, meshUv);`}function Fa(e){return e.replace(`var pos = localPos;`,`var pos = localPos;
    let inst = instanceData[eid];`)}var Ia=`
fn hashStar(p: vec2<f32>) -> f32 {
    var p3 = fract(vec3(p.x, p.y, p.x) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
}

fn hash2Star(p: vec2<f32>) -> vec2<f32> {
    var p3 = fract(vec3(p.x, p.y, p.x) * vec3(0.1031, 0.1030, 0.0973));
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.xx + p3.yz) * p3.zy);
}

fn sampleStars(dir: vec3<f32>) -> vec3<f32> {
    if (sky.starParams.z <= 0.0 || dir.y < 0.0) {
        return vec3(0.0);
    }

    let theta = atan2(dir.z, dir.x);
    let phi = asin(clamp(dir.y, -1.0, 1.0));

    let gridSize = mix(20.0, 100.0, sky.starParams.y);
    let cell = vec2(theta * gridSize / 3.14159, phi * gridSize / 1.5708);
    let cellId = floor(cell);
    let cellFract = fract(cell);

    var starColor = vec3(0.0);

    for (var dy = -1; dy <= 1; dy++) {
        for (var dx = -1; dx <= 1; dx++) {
            let neighbor = cellId + vec2(f32(dx), f32(dy));
            let starHash = hashStar(neighbor);

            if (starHash > sky.starParams.y * 0.7) {
                continue;
            }

            let starPos = hash2Star(neighbor);
            let starCenter = neighbor + starPos;
            let dist = length(cell - starCenter);

            let brightness = hashStar(neighbor + vec2(100.0, 100.0));
            let radius = 0.02 + brightness * 0.03;

            if (dist < radius) {
                let twinkle = 0.8 + 0.2 * sin(brightness * 100.0);
                let intensity = sky.starParams.x * brightness * twinkle;
                let falloff = 1.0 - smoothstep(0.0, radius, dist);

                let temp = hashStar(neighbor + vec2(200.0, 200.0));
                let tint = mix(vec3(1.0, 0.9, 0.8), vec3(0.8, 0.9, 1.0), temp);

                starColor = max(starColor, tint * intensity * falloff);
            }
        }
    }

    return starColor;
}
`,La=`
fn hash2(p: vec2<f32>) -> f32 {
    var p3 = fract(vec3(p.x, p.y, p.x) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
}

fn value2d(p: vec2f, seed: vec2f) -> f32 {
    let i = floor(p);
    let f = fract(p);
    let u = f * f * (3.0 - 2.0 * f);
    return mix(
        mix(fract(sin(dot(i, seed)) * 43758.5) * 2.0 - 1.0,
            fract(sin(dot(i + vec2(1.0, 0.0), seed)) * 43758.5) * 2.0 - 1.0, u.x),
        mix(fract(sin(dot(i + vec2(0.0, 1.0), seed)) * 43758.5) * 2.0 - 1.0,
            fract(sin(dot(i + vec2(1.0, 1.0), seed)) * 43758.5) * 2.0 - 1.0, u.x), u.y);
}

fn simplex2(p: vec2<f32>) -> f32 {
    let K1 = 0.366025404;
    let K2 = 0.211324865;

    let i = floor(p + (p.x + p.y) * K1);
    let a = p - i + (i.x + i.y) * K2;

    let o = select(vec2(0.0, 1.0), vec2(1.0, 0.0), a.x > a.y);
    let b = a - o + K2;
    let c = a - 1.0 + 2.0 * K2;

    let h = max(0.5 - vec3(dot(a, a), dot(b, b), dot(c, c)), vec3(0.0));
    let h4 = h * h * h * h;

    let n = vec3(
        dot(a, vec2(hash2(i) * 2.0 - 1.0, hash2(i + vec2(0.0, 1.0)) * 2.0 - 1.0)),
        dot(b, vec2(hash2(i + o) * 2.0 - 1.0, hash2(i + o + vec2(0.0, 1.0)) * 2.0 - 1.0)),
        dot(c, vec2(hash2(i + 1.0) * 2.0 - 1.0, hash2(i + vec2(1.0, 2.0)) * 2.0 - 1.0))
    );

    return dot(h4, n) * 70.0;
}

const FBM2_OCTAVES = 5;

fn fbm2(p: vec2<f32>) -> f32 {
    var value = 0.0;
    var amplitude = 0.5;
    var frequency = 1.0;
    var pos = p;

    for (var i = 0; i < FBM2_OCTAVES; i++) {
        value += amplitude * simplex2(pos * frequency);
        amplitude *= 0.5;
        frequency *= 2.0;
    }

    return value;
}
`,Ra=`
fn sampleMoon(dir: vec3<f32>) -> vec3<f32> {
    if (sky.moonParams.z <= 0.0) {
        return vec3(0.0);
    }

    let moonDir = sky.moonDirection.xyz;
    let moonDot = dot(dir, moonDir);

    let moonSize = 0.9995;
    let moonColor = vec3(0.9, 0.9, 0.85);
    let edgeWidth = 0.0003;
    let opacity = sky.moonParams.y;

    if (moonDot <= moonSize - edgeWidth) {
        return vec3(0.0);
    }

    let toCenter = dir - moonDir * moonDot;
    let diskRight = normalize(cross(moonDir, vec3(0.0, 1.0, 0.0)));
    let diskUp = cross(diskRight, moonDir);

    let diskRadius = sqrt(1.0 - moonSize * moonSize);
    let u = dot(toCenter, diskRight) / diskRadius;
    let v = dot(toCenter, diskUp) / diskRadius;

    let r2 = u * u + v * v;
    let z = sqrt(max(0.0, 1.0 - r2));

    let diskEdge = smoothstep(1.0 + edgeWidth / diskRadius, 1.0 - edgeWidth / diskRadius, sqrt(r2));

    let limb = pow(z, 0.6);

    let cellU = u * 8.0;
    let cellV = v * 8.0;
    let craterNoise = hashStar(floor(vec2(cellU, cellV)) + vec2(50.0, 50.0));
    let surfaceVariation = 0.85 + 0.15 * craterNoise;

    let phase = sky.moonParams.x;
    let sunAngle = phase * 6.28318;
    let sunLocalX = sin(sunAngle);
    let sunLocalZ = -cos(sunAngle);

    let illumination = u * sunLocalX + z * sunLocalZ;
    let lit = smoothstep(-0.05, 0.05, illumination);

    let earthshine = vec3(0.06, 0.07, 0.1);
    let dayColor = moonColor * surfaceVariation * limb;
    let surfaceColor = mix(earthshine * limb, dayColor, lit);

    return surfaceColor * diskEdge * opacity;
}
`,za=`
fn sampleClouds(dir: vec3<f32>) -> vec4<f32> {
    if (sky.cloudParams.w <= 0.0 || dir.y < 0.01) {
        return vec4(0.0);
    }

    let t = sky.cloudParams.z / max(dir.y, 0.001);
    let uv = dir.xz * t;

    var n = fbm2(uv);

    let coverage = sky.cloudParams.x;
    let density = sky.cloudParams.y;
    n = smoothstep(1.0 - coverage, 1.0, n * 0.5 + 0.5) * density;

    n *= smoothstep(0.0, 0.15, dir.y);

    return vec4(sky.cloudColor.rgb, n);
}
`,Ba=`
const DEG_TO_RAD: f32 = 0.017453292;

fn computeSkyDir(screenX: f32, screenY: f32) -> vec3<f32> {
    let width = scene.viewport.x;
    let height = scene.viewport.y;

    let ndcX = screenX * 2.0 - 1.0;
    let ndcY = 1.0 - screenY * 2.0;

    let aspect = width / height;

    let cameraWorld = scene.cameraWorld;
    let r00 = cameraWorld[0][0]; let r10 = cameraWorld[0][1]; let r20 = cameraWorld[0][2];
    let r01 = cameraWorld[1][0]; let r11 = cameraWorld[1][1]; let r21 = cameraWorld[1][2];
    let r02 = cameraWorld[2][0]; let r12 = cameraWorld[2][1]; let r22 = cameraWorld[2][2];

    let skyFov = select(scene.fov, 60.0, scene.cameraMode > 0.5);
    let tanHalfFov = tan((skyFov * DEG_TO_RAD) / 2.0);
    let camDirX = ndcX * aspect * tanHalfFov;
    let camDirY = ndcY * tanHalfFov;
    let camDirZ = -1.0;
    var dirX = r00 * camDirX + r01 * camDirY + r02 * camDirZ;
    var dirY = r10 * camDirX + r11 * camDirY + r12 * camDirZ;
    var dirZ = r20 * camDirX + r21 * camDirY + r22 * camDirZ;
    let len = sqrt(dirX * dirX + dirY * dirY + dirZ * dirZ);
    dirX /= len; dirY /= len; dirZ /= len;
    return vec3(dirX, dirY, dirZ);
}
`,Va=`
${Ia}
${Ra}
${za}

fn sampleSky(dir: vec3<f32>) -> vec3<f32> {
    if (sky.skyZenith.a <= 0.0) {
        return scene.clearColor.rgb;
    }

    let t = pow(clamp(dir.y, 0.0, 1.0), 0.25);
    var color = mix(sky.skyHorizon.rgb, sky.skyZenith.rgb, t);

    if (sky.horizonBand > 0.0) {
        let horizonBlend = pow(1.0 - abs(dir.y), 32.0) * sky.horizonBand;
        let bandColor = sky.skyHorizon.rgb * 1.5;
        color = mix(color, bandColor, horizonBlend);
    }

    color += sampleStars(dir);

    let clouds = sampleClouds(dir);
    color = mix(color, clouds.rgb, clouds.a);

    let moonContrib = sampleMoon(dir);
    color += moonContrib * (1.0 - clouds.a * 0.7);

    if (sky.sunParams.y > 0.0) {
        let sunDir = sky.sunDirection.xyz;
        let sunDot = dot(dir, sunDir);

        let sunVisualColor = select(scene.sunColor.rgb, sky.sunVisualColor.rgb, sky.sunParams.z > 0.5);

        let glowStrength = sky.sunParams.w;
        if (glowStrength > 0.0) {
            let g = 0.76;
            let gg = g * g;
            let mie = (1.0 - gg) / pow(1.0 + gg - 2.0 * g * sunDot, 1.5);
            color += sunVisualColor * mie * glowStrength * 0.025;

            let angle = max(0.0, sunDot);
            let corona = pow(angle, 512.0) * 0.4 + pow(angle, 128.0) * 0.06;
            let warmTint = vec3f(1.0, 0.9, 0.7);
            color += warmTint * sunVisualColor * corona * glowStrength;
        }

        let baseSunSize = 0.9995;
        let sunSizeParam = sky.sunParams.x;
        let sunThreshold = 1.0 - (1.0 - baseSunSize) * sunSizeParam;
        let sunEdgeWidth = (1.0 - sunThreshold) * 0.15;

        let diskBlend = smoothstep(sunThreshold - sunEdgeWidth, sunThreshold + sunEdgeWidth, sunDot);
        if (diskBlend > 0.0) {
            let radial = saturate((sunDot - sunThreshold) / (1.0 - sunThreshold));
            let r = 1.0 - radial;
            let mu = sqrt(1.0 - r * r);
            let limbDarken = 1.0 - 0.6 * (1.0 - mu);
            color += sunVisualColor * limbDarken * diskBlend;

            let edgeDist = 1.0 - smoothstep(0.0, 1.0, radial);
            let fringe = vec3f(
                smoothstep(0.3, 0.7, edgeDist),
                smoothstep(0.5, 0.9, edgeDist),
                smoothstep(0.7, 1.0, edgeDist)
            );
            color += fringe * sunVisualColor * 0.15 * diskBlend * (1.0 - radial);
        }
    }

    if (sky.hazeDensity > 0.0) {
        let horizonFactor = 1.0 - clamp(dir.y, 0.0, 1.0);
        let hazeAmount = pow(horizonFactor, 2.0) * saturate(sky.hazeDensity * 5.0);
        color = mix(color, sky.hazeColor.rgb, hazeAmount);
    }

    return color;
}
`,Ha=`
fn applyHaze(color: vec3<f32>, dist: f32) -> vec3<f32> {
    if (sky.hazeDensity <= 0.0) {
        return color;
    }
    let haze = 1.0 - exp(-sky.hazeDensity * dist);
    return mix(color, sky.hazeColor.rgb, haze);
}
`,Ua=`
const CASCADE_BLEND_RANGE: f32 = 0.1;
const PCF_SAMPLE_COUNT: i32 = 5;
const VOGEL_GOLDEN_ANGLE: f32 = 2.399963;

fn selectCascade(viewZ: f32) -> u32 {
    if (viewZ < shadow.cascadeSplits.x) { return 0u; }
    if (viewZ < shadow.cascadeSplits.y) { return 1u; }
    if (viewZ < shadow.cascadeSplits.z) { return 2u; }
    return 3u;
}

fn getCascadeViewProj(cascade: u32) -> mat4x4<f32> {
    switch cascade {
        case 0u: { return shadow.cascade0ViewProj; }
        case 1u: { return shadow.cascade1ViewProj; }
        case 2u: { return shadow.cascade2ViewProj; }
        default: { return shadow.cascade3ViewProj; }
    }
}

fn getCascadeSplit(cascade: u32) -> f32 {
    switch cascade {
        case 0u: { return shadow.cascadeSplits.x; }
        case 1u: { return shadow.cascadeSplits.y; }
        case 2u: { return shadow.cascadeSplits.z; }
        default: { return shadow.cascadeSplits.w; }
    }
}

fn sampleShadowAtCascade(worldPos: vec3<f32>, cascade: u32, fragCoord: vec2<f32>) -> f32 {
    let lightPos = getCascadeViewProj(cascade) * vec4(worldPos, 1.0);
    let ndc = lightPos.xyz / lightPos.w;

    let inBounds = abs(ndc.x) <= 1.0 && abs(ndc.y) <= 1.0 && ndc.z >= 0.0 && ndc.z <= 1.0;
    if (!inBounds) { return 1.0; }

    var uv = ndc.xy * 0.5 + 0.5;
    uv.y = 1.0 - uv.y;

    let offset = vec2(f32(cascade % 2u) * 0.5, f32(cascade / 2u) * 0.5);
    uv = uv * 0.5 + offset;

    let atlasSize = vec2<f32>(textureDimensions(shadowMap));
    let pcfRadius = scene.shadowSoftness / atlasSize.x;

    let ign = fract(52.9829189 * fract(0.06711056 * fragCoord.x + 0.00583715 * fragCoord.y));
    let angle = ign * 6.28318;

    var total = 0.0;
    for (var i = 0; i < PCF_SAMPLE_COUNT; i++) {
        let r = sqrt((f32(i) + 0.5) / f32(PCF_SAMPLE_COUNT)) * pcfRadius;
        let a = f32(i) * VOGEL_GOLDEN_ANGLE + angle;
        let tapOffset = vec2(cos(a), sin(a)) * r;
        total += textureSampleCompareLevel(shadowMap, shadowSampler, uv + tapOffset, ndc.z);
    }
    return total / f32(PCF_SAMPLE_COUNT);
}

fn computeCascadeBlend(viewZ: f32, cascade: u32) -> f32 {
    if (cascade >= 3u) { return 0.0; }

    let splitEnd = getCascadeSplit(cascade);
    let blendStart = splitEnd * (1.0 - CASCADE_BLEND_RANGE);

    if (viewZ < blendStart) { return 0.0; }
    return saturate((viewZ - blendStart) / (splitEnd - blendStart));
}

fn distanceFade(viewZ: f32, maxDist: f32) -> f32 {
    let fadeStart = maxDist * 0.9;
    let fade = saturate((maxDist - viewZ) / (maxDist - fadeStart));
    return select(fade, 1.0, viewZ <= fadeStart);
}

fn sampleShadow(worldPos: vec3<f32>, viewZ: f32, fragCoord: vec2<f32>) -> f32 {
    let cascade = selectCascade(viewZ);
    let shadowCurrent = sampleShadowAtCascade(worldPos, cascade, fragCoord);

    let nextCascade = min(cascade + 1u, 3u);
    let shadowNext = sampleShadowAtCascade(worldPos, nextCascade, fragCoord);

    let blendFactor = computeCascadeBlend(viewZ, cascade) * f32(cascade < 3u);
    let cascadeShadow = mix(shadowCurrent, shadowNext, blendFactor);

    let fade = distanceFade(viewZ, shadow.cascadeSplits.w);
    return mix(1.0, cascadeShadow, fade);
}
`,Wa=`
fn blinnPhongSpecular(N: vec3<f32>, L: vec3<f32>, V: vec3<f32>, roughness: f32) -> f32 {
    let H = normalize(L + V);
    let NdotH = max(dot(N, H), 0.0);
    let shininess = pow(2.0, (1.0 - roughness) * 10.0);
    let intensity = (1.0 - roughness) * (1.0 - roughness);
    return pow(NdotH, shininess) * intensity;
}
`,Ga=`
fn selectCubeFace(dir: vec3<f32>) -> u32 {
    let absDir = abs(dir);
    if (absDir.x >= absDir.y && absDir.x >= absDir.z) {
        return select(1u, 0u, dir.x > 0.0);
    }
    if (absDir.y >= absDir.x && absDir.y >= absDir.z) {
        return select(3u, 2u, dir.y > 0.0);
    }
    return select(5u, 4u, dir.z > 0.0);
}

fn samplePointShadow(worldPos: vec3<f32>, normal: vec3<f32>, shadowIdx: u32, lightPos: vec3<f32>, lightRadius: f32) -> f32 {
    let toFrag = worldPos - lightPos;
    let dist = length(toFrag);
    if (dist < 1e-4) { return 1.0; }
    let dir = toFrag / dist;

    let texelSize = dist * 2.0 / 512.0;
    let NdotL = abs(dot(normal, -dir));
    let offsetScale = texelSize * (1.0 + 2.0 * saturate(1.0 - NdotL));
    let offsetPos = worldPos + normal * offsetScale;

    let face = selectCubeFace(dir);
    let vpIdx = shadowIdx * 6u + face;
    let lightClip = pointShadow.viewProj[vpIdx] * vec4(offsetPos, 1.0);
    let ndc = lightClip.xyz / lightClip.w;

    var uv = ndc.xy * 0.5 + 0.5;
    uv.y = 1.0 - uv.y;

    let border = 1.0 / 512.0;
    uv = clamp(uv, vec2(border), vec2(1.0 - border));

    let atlasU = (f32(face) + uv.x) / 6.0;
    let atlasV = (f32(shadowIdx) + uv.y) / 4.0;

    return textureSampleCompareLevel(pointShadowMap, shadowSampler, vec2(atlasU, atlasV), ndc.z);
}
`,Ka=`
fn evaluatePointLight(
    surface: SurfaceData,
    lightColor: vec3<f32>,
    L: vec3<f32>,
    V: vec3<f32>,
    NdotL: f32,
    attenuation: f32,
    shadow: f32,
) -> vec3<f32> {
    let diffuse = surface.baseColor * lightColor * NdotL * attenuation * shadow;
    let spec = blinnPhongSpecular(surface.worldNormal, L, V, surface.roughness);
    let specular = lightColor * spec * NdotL * attenuation * shadow * surface.reflectivity;
    return diffuse + specular;
}
`;`${La}${Va}${Ha}${Wa}${Ka}`;var qa=`
let V = normalize(scene.cameraWorld[3].xyz - surface.worldPos);
let L = -scene.sunDirection.xyz;
let NdotL = max(dot(surface.worldNormal, L), 0.0);
let ambient = scene.ambientColor.rgb * scene.ambientColor.a;
let sunDiffuse = scene.sunColor.rgb * NdotL * shadowFactor;
let diffuseColor = surface.baseColor * (ambient + sunDiffuse) + surface.emission;
let specTerm = blinnPhongSpecular(surface.worldNormal, L, V, surface.roughness);
let specular = scene.sunColor.rgb * specTerm * NdotL * shadowFactor * surface.reflectivity;
let litColor = diffuseColor + specular;
`,Ja=`
fn sampleReflection(dir: vec3<f32>) -> vec4<f32> {
    return vec4<f32>(sampleSky(dir), 0.0);
}

fn reflectionColor(surface: SurfaceData, V: vec3<f32>) -> vec3<f32> {
    if (scene.reflectionEnabled == 0u || surface.reflectivity <= 0.001) {
        return vec3<f32>(0.0);
    }
    let R = reflect(-V, surface.worldNormal);
    let env = sampleReflection(R).rgb;
    let smoothness = 1.0 - surface.roughness;
    return env * surface.reflectivity * smoothness * smoothness;
}

fn applyReflection(surface: SurfaceData, V: vec3<f32>, litColor: vec3<f32>) -> vec3<f32> {
    return litColor + reflectionColor(surface, V);
}
`,Ya=`if (surface.opacity <= 0.0) { discard; }`;function Xa(e,t){let n=Pa(t.vertex);return`
fn userVertexTransform_${e}(localPos: vec3<f32>, normal: vec3<f32>, meshUv: vec2<f32>, eid: u32) -> VertexTransformResult {
    ${t.properties&&t.properties.length>0&&po()&&t.vertex?.includes(`inst.`)?Fa(n):n}
}`}function Za(e,t,n){let r=(t.properties&&t.properties.length>0&&po()?`let inst = instanceData[eid];
    `:``)+(t.fragment??``),i=``;return n?.lighting&&(i=`
fn applyLighting_${e}(surface: SurfaceData, ${n.lighting.params}) -> vec3<f32> {
    ${n.lighting.body(e)}
}
`),`
// === surface ${e}: "${no.getName(e)??`#${e}`}" ===
fn userFragment_${e}(surface: ptr<function, SurfaceData>, position: vec4<f32>, eid: u32) {
    ${r}
}
${i}`}function Qa(e){return`
struct VertexTransformResult {
    position: vec3<f32>,
    uv: vec2<f32>,
}

fn dispatchVertexTransform(surfaceId: u32, localPos: vec3<f32>, normal: vec3<f32>, uv: vec2<f32>, eid: u32) -> VertexTransformResult {
    switch surfaceId {
${Array.from({length:e},(e,t)=>`        case ${t}u: { return userVertexTransform_${t}(localPos, normal, uv, eid); }`).join(`
`)}
        default: { return userVertexTransform_0(localPos, normal, uv, eid); }
    }
}`}function $a(e,t){let n=Array.from({length:e},(e,t)=>`        case ${t}u: { userFragment_${t}(surface, position, eid); }`).join(`
`),r=``;if(t?.lighting){let n=Array.from({length:e},(e,n)=>`        case ${n}u: { return applyLighting_${n}(surface, ${to(t.lighting.params)}); }`).join(`
`);r=`
fn dispatchLighting(surfaceId: u32, surface: SurfaceData, ${t.lighting.params}) -> vec3<f32> {
    switch surfaceId {
${n}
        default: { return applyLighting_0(surface, ${to(t.lighting.params)}); }
    }
}
`}return`
${Qa(e)}

fn dispatchFragment(surfaceId: u32, surface: ptr<function, SurfaceData>, position: vec4<f32>, eid: u32) {
    switch surfaceId {
${n}
        default: { userFragment_0(surface, position, eid); }
    }
}
${r}`}function eo(e,t){return`${e.map((e,t)=>Xa(t,e)).join(`
`)}\n${e.map((e,n)=>Za(n,e,t)).join(`
`)}\n${$a(e.length,t)}`}function to(e){return e.split(`,`).map(e=>e.trim().split(`:`)[0].trim()).join(`, `)}var no=Be(32);function ro(){no.add({},`default`),no.add({fragment:`(*surface).baseColor = (*surface).worldNormal * 0.5 + 0.5;`},`normals`),no.add({fragment:`
    let depth = position.z;
    let remapped = pow(1.0 - depth, 0.1);
    (*surface).baseColor = vec3(remapped);`},`depth`),no.add({},`albedo`)}ro();var io={Default:0,Normals:1,Depth:2,Albedo:3};function ao(){no.clear(),mo(),ro()}P(Uint32Array,1,0);var oo=new Map,so=[],co=0;function lo(){return so}function uo(){return co}function fo(){return oo.size}function po(){return oo.size>0}function mo(){oo.clear(),so=[],co=0}function ho(){if(so.length===0)return``;let e=so.map(e=>`    ${e.name}: ${e.type},`),t=(co-so.length*4)/4;for(let n=0;n<t;n++)e.push(`    _pad${n}: u32,`);return`struct InstanceData {\n${e.join(`
`)}\n}`}function go(e){return so.length===0?``:`@group(0) @binding(${e}) var<storage, read> instanceData: array<InstanceData>;`}function _o(){return so.length===0?``:`
${ho()}

@group(0) @binding(0) var<storage, read> source: array<u32>;
@group(0) @binding(1) var<storage, read_write> instanceData: array<InstanceData>;
@group(0) @binding(2) var<storage, read> entityCount: array<u32>;

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let eid = gid.x;
    let count = entityCount[0];
    if (eid >= count) { return; }

    var d: InstanceData;
${so.map((e,t)=>{let n=`source[${t}u * count + eid]`;return`    d.${e.name} = ${e.type===`u32`?n:`bitcast<${e.type}>(${n})`};`}).join(`
`)}
    instanceData[eid] = d;
}
`}var vo=256*32,yo=4294967295,bo=Be(256);function xo(){bo.count()===0&&(bo.add($o(),`box`),bo.add(es(),`sphere`),bo.add(ts(),`capsule`),bo.add(ns(),`plane`))}var So={Box:0,Sphere:1,Capsule:2,Plane:3};function Co(e,t){return xo(),bo.add(e,t)}function wo(e){return xo(),bo.getByName(e)}function To(e){return xo(),bo.getName(e)}function Eo(e){return xo(),bo.get(e)}function Do(){return bo.version}function Oo(){return xo(),bo.count()}function ko(){bo.clear(),Ko.clear()}var Ao=P(Uint8Array,1,0),jo=P(Float32Array,4,0),Mo=P(Float32Array,4,0),No=P(Float32Array,4,0),Po=P(Float32Array,4,0),Fo=P(Uint8Array,1,0);P(Uint32Array,1,yo);var Io={Solid:0,HalfSpace:1};function Lo(e){let t=e.chunks;function n(e){let n=t[e>>>12],r=(e&Ue)*4,i=Math.round(Te(n[r])*255),a=Math.round(Te(n[r+1])*255),o=Math.round(Te(n[r+2])*255);return i<<16|a<<8|o}function r(e,n){let r=t[e>>>12],i=(e&Ue)*4;r[i]=we((n>>16&255)/255),r[i+1]=we((n>>8&255)/255),r[i+2]=we((n&255)/255)}return new Proxy([],{get(e,t){if(t===`get`)return n;if(t===`set`)return r;let i=Number(t);if(!Number.isNaN(i))return n(i)},set(e,t,n){let i=Number(t);return Number.isNaN(i)?!1:(r(i,n),!0)}})}var Ro={box:M.Box,sphere:M.Sphere,capsule:M.Capsule,plane:M.Plane,mesh:M.Mesh};function zo(e){return Ro[e]}function Bo(e){for(let[t,n]of Object.entries(Ro))if(n===e)return t}var Vo=P(Uint16Array,1,0),Ho={shape:I(Ao,1,0),surface:I(Vo,1,0),volume:I(Fo,1,0),color:Lo(jo),colorR:I(jo,4,0),colorG:I(jo,4,1),colorB:I(jo,4,2),opacity:I(jo,4,3),sizeX:I(Mo,4,0),sizeY:I(Mo,4,1),sizeZ:I(Mo,4,2),shadows:I(Mo,4,3),roughness:I(No,4,0),reflectivity:I(No,4,1),emission:Lo(Po),emissionIntensity:I(Po,4,3)};F(Ho,{requires:[H],defaults:()=>({shape:M.Box,surface:io.Default,color:16777215,opacity:1,sizeX:1,sizeY:1,sizeZ:1,shadows:1,roughness:1,reflectivity:0,emission:0,emissionIntensity:0,volume:Io.Solid}),parse:{shape:zo,surface:e=>no.getByName(e)},format:{shape:Bo,surface:e=>no.getName(e),color:x,emission:x},enums:{surface:io,volume:Io,shape:M}});var Uo=P(Uint32Array,1,0),Wo={geometry:I(Uo,1,0)};F(Wo,{requires:[Ho],defaults:()=>({geometry:So.Box}),parse:{geometry:wo},format:{geometry:To}});var Go={};F(Go,{requires:[Ho]});var Ko=new Map,qo=new Set;function Jo(e){return qo.has(e)}function Yo(e){if(Ko.has(e))return;let t=Eo(Zo(e));if(!t)return;let n=Co({vertices:new Float32Array(t.vertices),indices:new Uint16Array(t.indices),vertexCount:t.vertexCount,indexCount:t.indexCount});qo.add(n),Ko.set(e,{meshId:n,priorShape:Ho.shape[e],priorGeometry:Wo.geometry[e],baseFloatOffset:-1,atlasFloatOffset:-1,atlasIndexOffset:-1,vertexCount:t.vertexCount}),Wo.geometry[e]=n,Ho.shape[e]=M.Mesh}function Xo(e){let t=Ko.get(e);t&&(qo.delete(t.meshId),Ho.shape[e]=t.priorShape,Wo.geometry[e]=t.priorGeometry),Ko.delete(e)}function Zo(e){switch(Ho.shape[e]){case M.Box:return So.Box;case M.Sphere:return So.Sphere;case M.Capsule:return So.Capsule;case M.Plane:return So.Plane;case M.Mesh:return Wo.geometry[e];default:return So.Box}}function Qo(e){let{vertices:t,vertexCount:n}=e;if(n===0)return{minX:0,minY:0,minZ:0,maxX:0,maxY:0,maxZ:0};let r=t[0],i=t[1],a=t[2],o=t[0],s=t[1],c=t[2];for(let e=1;e<n;e++){let n=t[e*8],l=t[e*8+1],u=t[e*8+2];n<r&&(r=n),l<i&&(i=l),u<a&&(a=u),n>o&&(o=n),l>s&&(s=l),u>c&&(c=u)}return{minX:r,minY:i,minZ:a,maxX:o,maxY:s,maxZ:c}}function $o(){return{vertices:new Float32Array([-.5,-.5,.5,0,0,1,0,0,.5,-.5,.5,0,0,1,1,0,.5,.5,.5,0,0,1,1,1,-.5,.5,.5,0,0,1,0,1,.5,-.5,-.5,0,0,-1,0,0,-.5,-.5,-.5,0,0,-1,1,0,-.5,.5,-.5,0,0,-1,1,1,.5,.5,-.5,0,0,-1,0,1,-.5,.5,.5,0,1,0,0,0,.5,.5,.5,0,1,0,1,0,.5,.5,-.5,0,1,0,1,1,-.5,.5,-.5,0,1,0,0,1,-.5,-.5,-.5,0,-1,0,0,0,.5,-.5,-.5,0,-1,0,1,0,.5,-.5,.5,0,-1,0,1,1,-.5,-.5,.5,0,-1,0,0,1,.5,-.5,.5,1,0,0,0,0,.5,-.5,-.5,1,0,0,1,0,.5,.5,-.5,1,0,0,1,1,.5,.5,.5,1,0,0,0,1,-.5,-.5,-.5,-1,0,0,0,0,-.5,-.5,.5,-1,0,0,1,0,-.5,.5,.5,-1,0,0,1,1,-.5,.5,-.5,-1,0,0,0,1]),indices:new Uint16Array([0,1,2,0,2,3,4,5,6,4,6,7,8,9,10,8,10,11,12,13,14,12,14,15,16,17,18,16,18,19,20,21,22,20,22,23]),vertexCount:24,indexCount:36}}function es(e=32,t=16){let n=[],r=[],i=.5;for(let r=0;r<=t;r++){let a=r/t,o=a*Math.PI;for(let t=0;t<=e;t++){let r=t/e,s=r*Math.PI*2,c=Math.sin(o)*Math.cos(s),l=Math.cos(o),u=Math.sin(o)*Math.sin(s);n.push(c*i,l*i,u*i,c,l,u,r,a)}}for(let n=0;n<t;n++)for(let t=0;t<e;t++){let i=n*(e+1)+t,a=i+e+1;r.push(i,i+1,a),r.push(i+1,a+1,a)}return{vertices:new Float32Array(n),indices:new Uint16Array(r),vertexCount:(t+1)*(e+1),indexCount:t*e*6}}function ts(e=32,t=16){let n=[],r=[],i=.5,a=.5,o=t/2;for(let t=0;t<=o;t++){let r=t/o*(Math.PI/2),s=t/o*.25;for(let t=0;t<=e;t++){let o=t/e,c=o*Math.PI*2,l=Math.sin(r)*Math.cos(c),u=Math.cos(r),d=Math.sin(r)*Math.sin(c);n.push(l*i,u*i+a,d*i,l,u,d,o,s)}}for(let t=0;t<=e;t++){let r=t/e,o=r*Math.PI*2,s=Math.cos(o),c=Math.sin(o);n.push(s*i,a,c*i,s,0,c,r,.25)}for(let t=0;t<=e;t++){let r=t/e,o=r*Math.PI*2,s=Math.cos(o),c=Math.sin(o);n.push(s*i,-a,c*i,s,0,c,r,.75)}for(let t=0;t<=o;t++){let r=t/o*(Math.PI/2),s=.75+t/o*.25;for(let t=0;t<=e;t++){let o=t/e,c=o*Math.PI*2,l=Math.sin(r)*Math.cos(c),u=-Math.cos(r),d=Math.sin(r)*Math.sin(c);n.push(l*i,u*i-a,d*i,l,u,d,o,s)}}let s=e+1;for(let t=0;t<o;t++)for(let n=0;n<e;n++){let e=t*s+n,i=e+s;r.push(e,e+1,i),r.push(e+1,i+1,i)}let c=(o+1)*s,l=c+s;for(let t=0;t<e;t++){let e=c+t,n=l+t;r.push(e,e+1,n),r.push(e+1,n+1,n)}let u=l+s;for(let t=0;t<o;t++)for(let n=0;n<e;n++){let e=u+t*s+n,i=e+s;r.push(e,i,e+1),r.push(e+1,i,i+1)}return{vertices:new Float32Array(n),indices:new Uint16Array(r),vertexCount:n.length/8,indexCount:r.length}}function ns(){return{vertices:new Float32Array([-.5,0,.5,0,1,0,0,0,.5,0,.5,0,1,0,1,0,.5,0,-.5,0,1,0,1,1,-.5,0,-.5,0,1,0,0,1]),indices:new Uint16Array([0,1,2,0,2,3]),vertexCount:4,indexCount:6}}function rs(){let e=[],t=[],n=[],r=[],i=new Map,a=new Map;for(let e of Ko.values())a.set(e.meshId,e);let o=0,s=0,c=0,l=0,u=Oo();for(let d=0;d<u;d++){let u=Eo(d);if(!u){r.push({vertexOffset:0,indexOffset:0,triCount:0});continue}let f=u.indexCount/3;r.push({vertexOffset:o,indexOffset:s,triCount:f});let p=a.get(d);if(p){i.set(d,o*4),p.atlasFloatOffset=o,p.atlasIndexOffset=s,p.baseFloatOffset=l;for(let e=0;e<u.vertices.length;e++)n.push(u.vertices[e]);l+=u.vertices.length}for(let t=0;t<u.vertices.length;t++)e.push(u.vertices[t]);for(let e=0;e<u.indices.length;e++)t.push(u.indices[e]);o+=u.vertices.length,s+=u.indices.length,c+=f}let d=new Float32Array(e),f=new Uint32Array(t),p=new Float32Array(n),m=new Uint32Array(256*4);for(let e=0;e<r.length;e++)m[e*4]=r[e].vertexOffset,m[e*4+1]=r[e].indexOffset,m[e*4+2]=r[e].triCount,m[e*4+3]=0;return{verticesData:d,indicesData:f,metaData:m,baseVerticesData:p,shapeCount:r.filter(e=>e.triCount>0).length,maxTriangles:c,dynOffsets:i}}function is(e){return Math.max(e*2,256)*4}function as(e){let{verticesData:t,indicesData:n,metaData:r,baseVerticesData:i,shapeCount:a,maxTriangles:o,dynOffsets:s}=rs(),c=is(t.length),l=is(n.length),u=is(Math.max(i.length,1)),d=e.createBuffer({label:`unified-vertices`,size:c,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST});e.queue.writeBuffer(d,0,t);let f=e.createBuffer({label:`unified-indices`,size:l,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.INDEX|GPUBufferUsage.COPY_DST});e.queue.writeBuffer(f,0,n);let p=e.createBuffer({label:`unified-meta`,size:256*16,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST});e.queue.writeBuffer(p,0,r);let m=e.createBuffer({label:`dynamic-base-vertices`,size:u,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST});return i.length>0&&e.queue.writeBuffer(m,0,i),{vertices:d,indices:f,meta:p,baseVertices:m,shapeCount:a,maxTriangles:o,vertexCapacity:c,indexCapacity:l,baseVertexCapacity:u,dynOffsets:s}}function os(e,t){let{verticesData:n,indicesData:r,metaData:i,baseVerticesData:a,dynOffsets:o}=rs(),s=n.byteLength>t.vertexCapacity,c=r.byteLength>t.indexCapacity,l=a.byteLength>t.baseVertexCapacity;s&&(t.vertices.destroy(),t.vertexCapacity=is(n.length),t.vertices=e.createBuffer({label:`unified-vertices`,size:t.vertexCapacity,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST})),c&&(t.indices.destroy(),t.indexCapacity=is(r.length),t.indices=e.createBuffer({label:`unified-indices`,size:t.indexCapacity,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.INDEX|GPUBufferUsage.COPY_DST})),l&&(t.baseVertices.destroy(),t.baseVertexCapacity=is(Math.max(a.length,1)),t.baseVertices=e.createBuffer({label:`dynamic-base-vertices`,size:t.baseVertexCapacity,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST})),t.dynOffsets=o,e.queue.writeBuffer(t.vertices,0,n),e.queue.writeBuffer(t.indices,0,r),e.queue.writeBuffer(t.meta,0,i),a.length>0&&e.queue.writeBuffer(t.baseVertices,0,a)}function ss(){return`
${wa}

@group(0) @binding(0) var inputTexture: texture_2d<f32>;
@group(0) @binding(1) var maskTexture: texture_2d<f32>;
@group(0) @binding(2) var<uniform> scene: Scene;

fn aces(x: vec3<f32>) -> vec3<f32> {
    let a = 2.51;
    let b = 0.03;
    let c = 2.43;
    let d = 0.59;
    let e = 0.14;
    return saturate((x * (a * x + b)) / (x * (c * x + d) + e));
}

fn linearToSrgb(c: vec3<f32>) -> vec3<f32> {
    let lo = c * 12.92;
    let hi = 1.055 * pow(max(c, vec3<f32>(0.0)), vec3<f32>(1.0 / 2.4)) - 0.055;
    return select(hi, lo, c <= vec3<f32>(0.0031308));
}

fn linearToOKLab(c: vec3<f32>) -> vec3<f32> {
    let l = 0.4122214708 * c.r + 0.5363325363 * c.g + 0.0514459929 * c.b;
    let m = 0.2119034982 * c.r + 0.6806995451 * c.g + 0.1073969566 * c.b;
    let s = 0.0883024619 * c.r + 0.2220049174 * c.g + 0.6896926207 * c.b;
    let l_ = pow(max(l, 0.0), 1.0 / 3.0);
    let m_ = pow(max(m, 0.0), 1.0 / 3.0);
    let s_ = pow(max(s, 0.0), 1.0 / 3.0);
    return vec3<f32>(
        0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_,
        1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_,
        0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_,
    );
}

fn OKLabToLinear(lab: vec3<f32>) -> vec3<f32> {
    let l_ = lab.x + 0.3963377774 * lab.y + 0.2158037573 * lab.z;
    let m_ = lab.x - 0.1055613458 * lab.y - 0.0638541728 * lab.z;
    let s_ = lab.x - 0.0894841775 * lab.y - 1.2914855480 * lab.z;
    let l = l_ * l_ * l_;
    let m = m_ * m_ * m_;
    let s = s_ * s_ * s_;
    return vec3<f32>(
         4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
        -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
        -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s,
    );
}

fn applyPosterize(color: vec3<f32>) -> vec3<f32> {
    if (scene.posterizeBands <= 0.0) { return color; }
    var lab = linearToOKLab(color);
    let L = clamp(lab.x, 0.0, 1.0);
    lab.x = floor(L * scene.posterizeBands + 0.5) / scene.posterizeBands;
    lab.z += (lab.x - 0.5) * 0.05;
    return max(OKLabToLinear(lab), vec3<f32>(0.0));
}

fn bayer4(pos: vec2<f32>) -> f32 {
    let x = u32(pos.x) % 4u;
    let y = u32(pos.y) % 4u;
    let m = array<f32, 16>(
        0.0, 8.0, 2.0, 10.0,
        12.0, 4.0, 14.0, 6.0,
        3.0, 11.0, 1.0, 9.0,
        15.0, 7.0, 13.0, 5.0,
    );
    return m[x + y * 4u] / 16.0 - 0.5;
}

fn applyDither(color: vec3<f32>, pos: vec2<f32>) -> vec3<f32> {
    if (scene.ditherStrength <= 0.0) { return color; }
    let d = bayer4(pos) * scene.ditherStrength;
    return color + vec3<f32>(d);
}

fn applyVignette(color: vec3<f32>, uv: vec2<f32>) -> vec3<f32> {
    if (scene.vignetteStrength <= 0.0) { return color; }
    let d = distance(uv, vec2<f32>(0.5, 0.5));
    let v = 1.0 - smoothstep(scene.vignetteInner, scene.vignetteOuter, d) * scene.vignetteStrength;
    return color * v;
}

fn applyTonemap(color: vec3<f32>) -> vec3<f32> {
    if (scene.tonemapMode == 0u) { return color; }
    return aces(color * scene.exposure);
}

fn luma(c: vec3<f32>) -> f32 {
    return dot(c, vec3<f32>(0.299, 0.587, 0.114));
}

fn loadInput(coord: vec2<i32>, dims: vec2<i32>) -> vec3<f32> {
    return textureLoad(inputTexture, clamp(coord, vec2<i32>(0), dims - 1), 0).rgb;
}

const FXAA_REDUCE_MIN: f32 = 1.0 / 128.0;
const FXAA_REDUCE_MUL: f32 = 1.0 / 8.0;
const FXAA_SPAN_MAX: f32 = 8.0;

fn applyFXAA(coord: vec2<i32>, colorM: vec3<f32>, dims: vec2<i32>) -> vec3<f32> {
    let colorNW = loadInput(coord + vec2<i32>(-1, -1), dims);
    let colorNE = loadInput(coord + vec2<i32>(1, -1), dims);
    let colorSW = loadInput(coord + vec2<i32>(-1, 1), dims);
    let colorSE = loadInput(coord + vec2<i32>(1, 1), dims);

    let lumaM = luma(colorM);
    let lumaNW = luma(colorNW);
    let lumaNE = luma(colorNE);
    let lumaSW = luma(colorSW);
    let lumaSE = luma(colorSE);

    let lumaMin = min(lumaM, min(min(lumaNW, lumaNE), min(lumaSW, lumaSE)));
    let lumaMax = max(lumaM, max(max(lumaNW, lumaNE), max(lumaSW, lumaSE)));

    var dir: vec2<f32>;
    dir.x = -((lumaNW + lumaNE) - (lumaSW + lumaSE));
    dir.y = ((lumaNW + lumaSW) - (lumaNE + lumaSE));

    let dirReduce = max(
        (lumaNW + lumaNE + lumaSW + lumaSE) * 0.25 * FXAA_REDUCE_MUL,
        FXAA_REDUCE_MIN,
    );
    let rcpDirMin = 1.0 / (min(abs(dir.x), abs(dir.y)) + dirReduce);
    let dirPixels = clamp(
        dir * rcpDirMin,
        vec2<f32>(-FXAA_SPAN_MAX),
        vec2<f32>(FXAA_SPAN_MAX),
    );

    let fc = vec2<f32>(f32(coord.x), f32(coord.y));
    let colorA = 0.5 * (
        loadInput(vec2<i32>(round(fc + dirPixels * (1.0 / 3.0 - 0.5))), dims) +
        loadInput(vec2<i32>(round(fc + dirPixels * (2.0 / 3.0 - 0.5))), dims)
    );

    let colorB = colorA * 0.5 + 0.25 * (
        loadInput(vec2<i32>(round(fc + dirPixels * -0.5)), dims) +
        loadInput(vec2<i32>(round(fc + dirPixels * 0.5)), dims)
    );

    let lumaB = luma(colorB);
    if (lumaB < lumaMin || lumaB > lumaMax) { return colorA; }
    return colorB;
}

struct VOut {
    @builtin(position) pos: vec4<f32>,
    @location(0) uv: vec2<f32>,
};

@vertex
fn vs(@builtin(vertex_index) vid: u32) -> VOut {
    let xy = vec2<f32>(f32((vid << 1u) & 2u), f32(vid & 2u));
    var out: VOut;
    out.pos = vec4<f32>(xy * 2.0 - 1.0, 0.0, 1.0);
    out.uv = vec2<f32>(xy.x, 1.0 - xy.y);
    return out;
}

@fragment
fn fs(in: VOut) -> @location(0) vec4<f32> {
    let inDims = vec2<i32>(textureDimensions(inputTexture));
    let inCoord = clamp(
        vec2<i32>(in.uv * vec2<f32>(inDims)),
        vec2<i32>(0),
        inDims - 1,
    );

    var color = textureLoad(inputTexture, inCoord, 0).rgb;
    let inPos = vec2<f32>(f32(inCoord.x), f32(inCoord.y));

    if (scene.fxaaEnabled != 0u) {
        let mask = textureLoad(maskTexture, inCoord, 0).r;
        let fxaaColor = applyFXAA(inCoord, color, inDims);
        color = select(fxaaColor, color, mask >= 0.5);
    }

    color = applyTonemap(color);
    color = linearToSrgb(saturate(color));
    color = applyDither(color, inPos);
    color = applyPosterize(color);
    color = applyVignette(color, in.uv);

    return vec4<f32>(saturate(color), 1.0);
}
`}function cs(e){let t=null,n={bindGroup:null,cachedInputView:null,cachedMaskView:null};return{name:`present`,inputs:[`color`,`mask`],outputs:[`framebuffer`],async prepare(e){let n=navigator.gpu.getPreferredCanvasFormat(),r=ss(),i=e.createShaderModule({code:r});t=await e.createRenderPipelineAsync({label:`present`,layout:`auto`,vertex:{module:i,entryPoint:`vs`},fragment:{module:i,entryPoint:`fs`,targets:[{format:n}]},primitive:{topology:`triangle-list`}})},execute(r){if(!t)return;let{device:i,encoder:a,canvasView:o}=r,s=r.getTextureView(`color`),c=r.getTextureView(`mask`);if(!s||!c)return;(s!==n.cachedInputView||c!==n.cachedMaskView)&&(n.bindGroup=i.createBindGroup({layout:t.getBindGroupLayout(0),entries:[{binding:0,resource:s},{binding:1,resource:c},{binding:2,resource:{buffer:e}}]}),n.cachedInputView=s,n.cachedMaskView=c);let l=r.timestampWrites?.(`present`),u=a.beginRenderPass({label:`present`,colorAttachments:[{view:o,loadOp:`clear`,storeOp:`store`,clearValue:{r:0,g:0,b:0,a:1}}],timestampWrites:l});u.setPipeline(t),u.setBindGroup(0,n.bindGroup),u.draw(3),u.end()}}}var ls=`
@group(0) @binding(0) var depthTex: texture_2d<f32>;

struct FsOut {
    @location(0) color: vec4f,
    @location(1) mask: f32,
    @location(2) eid: u32,
    @builtin(frag_depth) depth: f32,
}

@vertex fn vs(@builtin(vertex_index) i: u32) -> @builtin(position) vec4f {
    var p = array<vec2f, 3>(vec2f(-1,-1), vec2f(3,-1), vec2f(-1,3));
    return vec4f(p[i], 0, 1);
}

@fragment fn fs(@builtin(position) pos: vec4f) -> FsOut {
    var out: FsOut;
    out.depth = textureLoad(depthTex, vec2i(pos.xy), 0).r;
    return out;
}

@fragment fn fsDepthOnly(@builtin(position) pos: vec4f) -> @builtin(frag_depth) f32 {
    return textureLoad(depthTex, vec2i(pos.xy), 0).r;
}
`,us={view:null,loadOp:`load`,storeOp:`store`},ds={view:null,clearValue:{r:0,g:0,b:0,a:0},loadOp:`clear`,storeOp:`store`},fs={view:null,loadOp:`load`,storeOp:`store`},ps={view:null,depthClearValue:1,depthLoadOp:`clear`,depthStoreOp:`store`},ms={colorAttachments:[us,ds,fs],depthStencilAttachment:ps},hs={view:null,depthClearValue:1,depthLoadOp:`clear`,depthStoreOp:`store`},gs={colorAttachments:[],depthStencilAttachment:hs};function _s(e){let t=null,n=null,r=null,i=null,a=null,o=null,s=null;return{name:`overlay`,inputs:[`z`,`eid`,`depth`],outputs:[`color`,`mask`],async prepare(e){let t=e.createShaderModule({code:ls});n=await e.createRenderPipelineAsync({label:`depth-inject`,layout:`auto`,vertex:{module:t,entryPoint:`vs`},fragment:{module:t,entryPoint:`fs`,targets:[{format:Gi,writeMask:0},{format:Ui,writeMask:0},{format:Wi,writeMask:0}]},depthStencil:{format:`depth24plus`,depthWriteEnabled:!0,depthCompare:`always`},primitive:{topology:`triangle-list`}}),a=await e.createRenderPipelineAsync({label:`depth-only`,layout:`auto`,vertex:{module:t,entryPoint:`vs`},fragment:{module:t,entryPoint:`fsDepthOnly`,targets:[]},depthStencil:{format:`depth24plus`,depthWriteEnabled:!0,depthCompare:`always`},primitive:{topology:`triangle-list`}})},execute(c){let{device:l,encoder:u}=c,d=c.getTextureView(`color`)??c.canvasView,f=c.getTextureView(`z`),p=c.getTextureView(`mask`),m=c.getTextureView(`eid`),h=e.hasDepthWriter?.(c.subGraph)??!1,g=e.overlays;if(g.length===0&&h&&a){let e=c.getTextureView(`depth`);if(e){e!==s&&(o=l.createBindGroup({layout:a.getBindGroupLayout(0),entries:[{binding:0,resource:e}]}),s=e),hs.view=f,gs.timestampWrites=c.timestampWrites?.(`raster-overlay`);let t=u.beginRenderPass(gs);t.setPipeline(a),t.setBindGroup(0,o),t.draw(3),t.end()}}else if(g.length>0){(!t||t.length!==g.length)&&(t=g.slice().sort((e,t)=>e.order-t.order)),us.view=d,ds.view=p,fs.view=m,ps.view=f,ps.depthLoadOp=h?`clear`:`load`,ms.timestampWrites=c.timestampWrites?.(`raster-overlay`);let e=u.beginRenderPass(ms);if(h&&n){let t=c.getTextureView(`depth`);t&&(t!==i&&(r=l.createBindGroup({layout:n.getBindGroupLayout(0),entries:[{binding:0,resource:t}]}),i=t),e.setPipeline(n),e.setBindGroup(0,r),e.draw(3))}let a={device:l,format:Gi,maskFormat:Ui,eidFormat:Wi};for(let n of t)n.draw(e,a);e.end()}}}}var vs=64,ys=`
${Ea}

@group(0) @binding(0) var<storage, read> colors: array<vec4<f32>>;
@group(0) @binding(1) var<storage, read> pbr: array<vec4<f32>>;
@group(0) @binding(2) var<storage, read> emission: array<vec4<f32>>;
@group(0) @binding(3) var<storage, read> surfaces: array<u32>;
@group(0) @binding(4) var<storage, read> entityCount: array<u32>;
@group(0) @binding(5) var<storage, read_write> data: array<Data>;
@group(0) @binding(6) var<storage, read> sizes: array<vec4<f32>>;

@compute @workgroup_size(${vs})
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let eid = gid.x;
    let count = entityCount[0];
    if (eid >= count) { return; }

    let s = sizes[eid];
    var d: Data;
    d.baseColor = colors[eid];
    d.pbr = pbr[eid];
    d.emission = emission[eid];
    d.flags = surfaces[eid];
    d.sizeX = s.x;
    d.sizeY = s.y;
    d.sizeZ = s.z;
    data[eid] = d;
}
`;function bs(e){let t=null,n=null,r=N();function i(n){return n.createBindGroup({layout:t.getBindGroupLayout(0),entries:[z(0,e.colors),z(1,e.pbr),z(2,e.emission),z(3,e.surfaces),z(4,e.entityCountBuffer),{binding:5,resource:{buffer:e.data.buffer}},z(6,e.sizes)]})}return{name:`data`,scope:`frame`,inputs:[],outputs:[`data`],async prepare(e){let r=e.createShaderModule({code:ys});t=await e.createComputePipelineAsync({label:`upload-data`,layout:`auto`,compute:{module:r,entryPoint:`main`}}),n=i(e)},execute(a){if(!t)return;N()!==r&&(r=N(),n=null),n||=i(a.device);let o=Math.ceil(e.entityCount/vs),s=R(a.encoder,a.timestampWrites?.(`data-upload`));s.setPipeline(t),s.setBindGroup(0,n),s.dispatchWorkgroups(o),s.end()}}}var xs=64;function Ss(e){let t=null,n=null,r=null,i=N();function a(r){return r.createBindGroup({layout:n.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:t.buffer}},{binding:1,resource:{buffer:e.instanceDataBuffer.buffer}},z(2,e.entityCountBuffer)]})}return{name:`instance-data`,scope:`frame`,inputs:[],outputs:[`instance-data`],async prepare(i){if(!po())return;let o=GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST;t||(t=B(i,`instance-data-source`,o,e=>e*fo()*4),e.instanceDataBuffer=B(i,`instance-data`,o,e=>e*uo()));let s=_o();if(!s)return;let c=i.createShaderModule({code:s});n=await i.createComputePipelineAsync({label:`instance`,layout:`auto`,compute:{module:c,entryPoint:`main`}}),r=a(i)},execute(o){if(!n||!t||!e.instanceDataBuffer)return;N()!==i&&(i=N(),r=null),r||=a(o.device);let s=e.entityCount,c=lo();for(let e=0;e<c.length;e++)Qe(o.device.queue,t.buffer,e*s*4,c[e].data,s);let l=Math.ceil(s/xs),u=R(o.encoder,o.timestampWrites?.(`instance-upload`));u.setPipeline(n),u.setBindGroup(0,r),u.dispatchWorkgroups(l),u.end()}}}var Cs=vo*2+1,ws=vo*2+2;function Ts(){return N()>>>5}function Es(){return 0}function Ds(){return N()>>>2}function Os(){return Ds()+N()}function ks(){return Os()+(N()>>>1)}function As(){return ks()+(N()>>>2)}function js(){return As()+Ts()}function Ms(){return js()+1}var Ns=new Uint32Array(1);function Ps(e){let t=GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST,n=e.createBuffer({label:`resolve-params`,size:4,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});return e.queue.writeBuffer(n,0,new Uint32Array([N()])),{entityIds:B(e,`batch-entity-ids`,t,e=>e*4),indirect:e.createBuffer({label:`batch-indirect`,size:vo*2*5*4,usage:GPUBufferUsage.INDIRECT|GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC}),slotCounts:e.createBuffer({label:`batch-slot-counts`,size:vo*2*4,usage:t}),entityBatchInfo:B(e,`batch-entity-info`,t,e=>e*4),scatterCounters:e.createBuffer({label:`batch-scatter-counters`,size:ws*4,usage:t}),transparentEntities:B(e,`batch-transparent-entities`,t,e=>e*4),cullEntities:B(e,`batch-cull-entities`,t,e=>e*2*4),activeSlotsGPU:e.createBuffer({label:`batch-active-slots`,size:vo*4,usage:t}),prefixParams:e.createBuffer({label:`batch-prefix-params`,size:8,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),resolveInputBuffer:B(e,`resolve-input`,t,()=>Ms()*4),resolveParamsBuffer:n,cullEntityCount:0,shapeAABBs:new Float32Array(256*6),activeSlots:new Uint32Array(vo),activeSlotCount:0,partMask:new Uint32Array(Ts())}}var Fs=-1;function Is(e){let t=Do();if(t!==Fs){Fs=t,e.shapeAABBs.fill(0);for(let t=0;t<256;t++){let n=Eo(t);if(!n)continue;let r=t*6;if(Jo(t)){e.shapeAABBs[r]=-1e6,e.shapeAABBs[r+1]=-1e6,e.shapeAABBs[r+2]=-1e6,e.shapeAABBs[r+3]=1e6,e.shapeAABBs[r+4]=1e6,e.shapeAABBs[r+5]=1e6;continue}let i=Qo(n);e.shapeAABBs[r]=i.minX,e.shapeAABBs[r+1]=i.minY,e.shapeAABBs[r+2]=i.minZ,e.shapeAABBs[r+3]=i.maxX,e.shapeAABBs[r+4]=i.maxY,e.shapeAABBs[r+5]=i.maxZ}}}function Ls(e,t,n,r,i){for(let a=0;a<i;a++){let i=r[a];e.drawIndexedIndirect(t,(n+i)*5*4)}}var Rs=-1,zs=-1;function Bs(e){let t=Do(),n=no.count();if(t===Rs&&n===zs)return;Rs=t,zs=n;let r=Oo(),i=0;for(let t=0;t<r;t++)for(let r=0;r<n;r++)e.activeSlots[i++]=t*32+r;e.activeSlotCount=i}function Vs(e,t,n,r,i,a,o){let s=t.resolveInputBuffer.buffer;Qe(e.queue,s,Es()*4,n,o),Qe(e.queue,s,Ds()*4,r,o),Qe(e.queue,s,Os()*4,i,o),Qe(e.queue,s,ks()*4,a,o),e.queue.writeBuffer(s,As()*4,t.partMask),Ns[0]=o,e.queue.writeBuffer(s,js()*4,Ns)}var Hs=`
@group(0) @binding(0) var<storage, read> resolveInput: array<u32>;
@group(0) @binding(1) var<storage, read_write> outShapes: array<u32>;
@group(0) @binding(2) var<storage, read_write> outSurfaces: array<u32>;
@group(0) @binding(3) var<storage, read> sizes: array<vec4<f32>>;

struct ResolveParams { capacity: u32 }
@group(0) @binding(4) var<uniform> resolveParams: ResolveParams;

const INVALID_SHAPE: u32 = 0xFFFFFFFFu;

const SHAPE_BOX: u32 = ${M.Box}u;
const SHAPE_SPHERE: u32 = ${M.Sphere}u;
const SHAPE_CAPSULE: u32 = ${M.Capsule}u;
const SHAPE_PLANE: u32 = ${M.Plane}u;
const SHAPE_MESH: u32 = ${M.Mesh}u;

fn unpackU8(offset: u32, index: u32) -> u32 {
    let word = resolveInput[offset + (index >> 2u)];
    return (word >> ((index & 3u) * 8u)) & 0xFFu;
}

fn unpackU16(offset: u32, index: u32) -> u32 {
    let word = resolveInput[offset + (index >> 1u)];
    return (word >> ((index & 1u) * 16u)) & 0xFFFFu;
}

fn shapeToPrimitive(shape: u32) -> u32 {
    if (shape == SHAPE_MESH) { return 7u; }
    return shape & 7u;
}

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let cap = resolveParams.capacity;
    let SHAPES_OFFSET = 0u;
    let MESH_GEOM_OFFSET = cap >> 2u;
    let SURFACES_OFFSET = MESH_GEOM_OFFSET + cap;
    let VOLUMES_OFFSET = SURFACES_OFFSET + (cap >> 1u);
    let MASK_OFFSET = VOLUMES_OFFSET + (cap >> 2u);
    let COUNT_OFFSET = MASK_OFFSET + (cap >> 5u);

    let eid = gid.x;
    if (eid >= resolveInput[COUNT_OFFSET]) { return; }

    let maskWord = resolveInput[MASK_OFFSET + (eid >> 5u)];
    if ((maskWord & (1u << (eid & 31u))) == 0u) {
        outShapes[eid] = INVALID_SHAPE;
        return;
    }

    let shape = unpackU8(SHAPES_OFFSET, eid);
    var shapeId: u32;
    switch (shape) {
        case SHAPE_BOX: { shapeId = 0u; }
        case SHAPE_SPHERE: { shapeId = 1u; }
        case SHAPE_CAPSULE: { shapeId = 2u; }
        case SHAPE_PLANE: { shapeId = 3u; }
        case SHAPE_MESH: { shapeId = resolveInput[MESH_GEOM_OFFSET + eid]; }
        default: { shapeId = 0u; }
    }
    outShapes[eid] = shapeId;

    let surf = unpackU16(SURFACES_OFFSET, eid);
    let vol = unpackU8(VOLUMES_OFFSET, eid);
    let hasShadows = select(0u, 1u, sizes[eid].w != 0.0);
    let prim = shapeToPrimitive(shape);

    outSurfaces[eid] = (surf & 0xFFu)
        | ((vol & 0xFu) << 8u)
        | (hasShadows << 12u)
        | (prim << 13u)
        | ((shapeId & 0xFFFFu) << 16u);
}
`,Us=`
@group(0) @binding(0) var<storage, read> shapes: array<u32>;
@group(0) @binding(1) var<storage, read> surfaces: array<u32>;
@group(0) @binding(2) var<storage, read> colors: array<vec4<f32>>;
@group(0) @binding(3) var<storage, read_write> slotCounts: array<atomic<u32>>;
@group(0) @binding(4) var<storage, read_write> entityBatchInfo: array<u32>;
@group(0) @binding(5) var<storage, read> entityCount: array<u32>;

const INVALID_SHAPE: u32 = 0xFFFFFFFFu;
const MAX_SURFACES: u32 = 32u;
const MAX_BATCH_SLOTS: u32 = ${vo}u;

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let eid = gid.x;
    if (eid >= entityCount[0]) { return; }

    let shapeId = shapes[eid];
    if (shapeId == INVALID_SHAPE) {
        entityBatchInfo[eid] = INVALID_SHAPE;
        return;
    }

    let surfaceId = surfaces[eid] & 0xFFu;
    let batchIndex = shapeId * MAX_SURFACES + surfaceId;
    if (batchIndex >= MAX_BATCH_SLOTS) {
        entityBatchInfo[eid] = INVALID_SHAPE;
        return;
    }

    let alpha = colors[eid].w;
    let isTransparent = select(0u, 1u, alpha < 1.0);
    let slotIndex = batchIndex + isTransparent * MAX_BATCH_SLOTS;

    atomicAdd(&slotCounts[slotIndex], 1u);
    entityBatchInfo[eid] = batchIndex | (isTransparent << 31u);
}
`,Ws=`
@group(0) @binding(0) var<storage, read> slotCounts: array<u32>;
@group(0) @binding(1) var<storage, read_write> indirect: array<u32>;
@group(0) @binding(2) var<storage, read> meshMeta: array<vec4<u32>>;
@group(0) @binding(3) var<storage, read> activeSlots: array<u32>;
@group(0) @binding(4) var<uniform> params: vec2<u32>;

const MAX_SURFACES: u32 = 32u;
const MAX_BATCH_SLOTS: u32 = ${vo}u;
const INDIRECT_STRIDE: u32 = 5u;

fn writeSlot(slotIndex: u32, batchIndex: u32, offset: ptr<function, u32>) {
    let count = slotCounts[slotIndex];
    let iBase = slotIndex * INDIRECT_STRIDE;

    if (count > 0u) {
        let shapeId = batchIndex / MAX_SURFACES;
        let sm = meshMeta[shapeId];
        indirect[iBase] = sm.z * 3u;
        indirect[iBase + 1u] = count;
        indirect[iBase + 2u] = sm.y;
        indirect[iBase + 3u] = 0u;
        indirect[iBase + 4u] = *offset;
    } else {
        indirect[iBase + 1u] = 0u;
    }

    *offset += count;
}

@compute @workgroup_size(1)
fn main() {
    var offset: u32 = 0u;
    let slotCount = params.x;

    for (var i: u32 = 0u; i < slotCount; i++) {
        writeSlot(activeSlots[i], activeSlots[i], &offset);
    }
    for (var i: u32 = 0u; i < slotCount; i++) {
        writeSlot(activeSlots[i] + MAX_BATCH_SLOTS, activeSlots[i], &offset);
    }
}
`,Gs=`
@group(0) @binding(0) var<storage, read> entityBatchInfo: array<u32>;
@group(0) @binding(1) var<storage, read> indirect: array<u32>;
@group(0) @binding(2) var<storage, read_write> scatterCounters: array<atomic<u32>>;
@group(0) @binding(3) var<storage, read_write> entityIds: array<u32>;
@group(0) @binding(4) var<storage, read_write> cullEntities: array<vec2<u32>>;
@group(0) @binding(5) var<storage, read> entityCount: array<u32>;
@group(0) @binding(6) var<storage, read_write> transparentEntities: array<u32>;

const INVALID_SHAPE: u32 = 0xFFFFFFFFu;
const MAX_BATCH_SLOTS: u32 = ${vo}u;
const INDIRECT_STRIDE: u32 = 5u;
const CULL_COUNTER: u32 = ${vo*2}u;
const TRANSPARENT_COUNTER: u32 = ${Cs}u;

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let eid = gid.x;
    if (eid >= entityCount[0]) { return; }

    let info = entityBatchInfo[eid];
    if (info == INVALID_SHAPE) { return; }

    let batchIndex = info & 0x7FFFFFFFu;
    let isTransparent = info >> 31u;
    let slotIndex = batchIndex + isTransparent * MAX_BATCH_SLOTS;

    let firstInstance = indirect[slotIndex * INDIRECT_STRIDE + 4u];
    let localIdx = atomicAdd(&scatterCounters[slotIndex], 1u);
    entityIds[firstInstance + localIdx] = eid;

    if (isTransparent == 1u) {
        let transIdx = atomicAdd(&scatterCounters[TRANSPARENT_COUNTER], 1u);
        transparentEntities[transIdx] = eid;
    }

    let cullIdx = atomicAdd(&scatterCounters[CULL_COUNTER], 1u);
    cullEntities[cullIdx] = vec2(eid, slotIndex);
}
`;function Ks(e){let t=null,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=new Uint32Array(2),u=new Uint32Array(1),d=N(),f=e.meshVersion;return{name:`batch-compute`,scope:`frame`,inputs:[`data`],outputs:[`batched`],async prepare(l){let u=e.batching,d=l.createShaderModule({code:Hs}),f=l.createShaderModule({code:Us}),p=l.createShaderModule({code:Ws}),m=l.createShaderModule({code:Gs});[t,n,r,i]=await Promise.all([l.createComputePipelineAsync({label:`batch-resolve`,layout:`auto`,compute:{module:d,entryPoint:`main`}}),l.createComputePipelineAsync({label:`batch-count`,layout:`auto`,compute:{module:f,entryPoint:`main`}}),l.createComputePipelineAsync({label:`batch-prefix`,layout:`auto`,compute:{module:p,entryPoint:`main`}}),l.createComputePipelineAsync({label:`batch-scatter`,layout:`auto`,compute:{module:m,entryPoint:`main`}})]),a=rn(l,t.getBindGroupLayout(0),()=>[{binding:0,resource:{buffer:u.resolveInputBuffer.buffer}},z(1,e.shapes),z(2,e.surfaces),z(3,e.sizes),{binding:4,resource:{buffer:u.resolveParamsBuffer}}]),o=rn(l,n.getBindGroupLayout(0),()=>[z(0,e.shapes),z(1,e.surfaces),z(2,e.colors),{binding:3,resource:{buffer:u.slotCounts}},{binding:4,resource:{buffer:u.entityBatchInfo.buffer}},z(5,e.entityCountBuffer)]),s=l.createBindGroup({layout:r.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:u.slotCounts}},{binding:1,resource:{buffer:u.indirect}},{binding:2,resource:{buffer:e.meshAtlas.meta}},{binding:3,resource:{buffer:u.activeSlotsGPU}},{binding:4,resource:{buffer:u.prefixParams}}]}),c=rn(l,i.getBindGroupLayout(0),()=>[{binding:0,resource:{buffer:u.entityBatchInfo.buffer}},{binding:1,resource:{buffer:u.indirect}},{binding:2,resource:{buffer:u.scatterCounters}},{binding:3,resource:{buffer:u.entityIds.buffer}},{binding:4,resource:{buffer:u.cullEntities.buffer}},z(5,e.entityCountBuffer),{binding:6,resource:{buffer:u.transparentEntities.buffer}}])},execute(p){if(!t||!n||!r||!i||!a||!o||!s||!c)return;let m=e.entityCount;if(m===0)return;let h=e.batching;N()!==d&&(d=N(),u[0]=d,p.device.queue.writeBuffer(h.resolveParamsBuffer,0,u)),e.meshVersion!==f&&r&&(f=e.meshVersion,s=p.device.createBindGroup({layout:r.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:h.slotCounts}},{binding:1,resource:{buffer:h.indirect}},{binding:2,resource:{buffer:e.meshAtlas.meta}},{binding:3,resource:{buffer:h.activeSlotsGPU}},{binding:4,resource:{buffer:h.prefixParams}}]})),p.encoder.clearBuffer(h.slotCounts),p.encoder.clearBuffer(h.scatterCounters),Bs(h),l[0]=h.activeSlotCount,p.device.queue.writeBuffer(h.prefixParams,0,l),p.device.queue.writeBuffer(h.activeSlotsGPU,0,h.activeSlots.buffer,0,h.activeSlotCount*4);let g=R(p.encoder,p.timestampWrites?.(`batch-resolve`));g.setPipeline(t),g.setBindGroup(0,a.group),g.dispatchWorkgroups(Math.ceil(m/64)),g.end();let _=R(p.encoder,p.timestampWrites?.(`batch-count`));_.setPipeline(n),_.setBindGroup(0,o.group),_.dispatchWorkgroups(Math.ceil(m/64)),_.end();let v=R(p.encoder,p.timestampWrites?.(`batch-prefix`));v.setPipeline(r),v.setBindGroup(0,s),v.dispatchWorkgroups(1),v.end();let y=R(p.encoder,p.timestampWrites?.(`batch-scatter`));y.setPipeline(i),y.setBindGroup(0,c.group),y.dispatchWorkgroups(Math.ceil(m/64)),y.end(),Is(h)}}}var qs=L(`render`),Js={name:`Render`,systems:[{group:`draw`,annotations:{mode:`always`},first:!0,update(e){let t=qs.from(e),n=on.from(e);if(!t||!n)return;let{device:r}=n,i=Do();i!==t.meshVersion&&(os(r,t.meshAtlas),t.meshVersion=i),t.entityCount=e.max+1;let a=t.entityCount,o=performance.now();r.queue.writeBuffer(t.matrices.buffer,0,ji.data,0,a*16);let s=N()*16;Qe(r.queue,t.propertiesBuffer.buffer,0,jo,a),Qe(r.queue,t.propertiesBuffer.buffer,s,Mo,a),Qe(r.queue,t.propertiesBuffer.buffer,s*2,No,a),Qe(r.queue,t.propertiesBuffer.buffer,s*3,Po,a),e.scheduler.reportCpu(`Render/0:upload`,performance.now()-o),o=performance.now(),Vs(r,t.batching,Ao,Uo,Vo,Fo,a),Ns[0]=a,r.queue.writeBuffer(t.u32Buffer.buffer,N()*2*4,Ns),e.scheduler.reportCpu(`Render/0:write`,performance.now()-o)}}],components:{Camera:W,Part:Ho,Mesh:Wo,Dynamic:Go,AmbientLight:Pi,DirectionalLight:U,PointLight:Fi,Tonemap:Zi,FXAA:Qi,Vignette:$i,Posterize:ea,Dither:ta,Shadows:na,Reflections:ra,Haze:ia,Sky:aa,Moon:oa,Stars:sa,Clouds:ca,Sun:la,Viewport:ua},relations:[da],dependencies:[cn,Or],async initialize(e,t){ao(),ko();let n=on.from(e);if(!n)return;let{device:r}=n,i=GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC,a=as(r),o=Ps(r),l=B(r,`matrices`,i,e=>e*64),u=B(r,`properties`,i,e=>e*64),d=B(r,`u32-props`,i,e=>e*8+256),f=B(r,`data`,i,e=>e*64),p=r.createBuffer({label:`point-lights`,size:Ri,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),m={viewProj:new Float32Array(16),scene:Ki(r),sky:qi(r),matrices:l,propertiesBuffer:u,u32Buffer:d,colors:an(u,()=>0,e=>e*16),sizes:an(u,e=>e*16,e=>e*16),pbr:an(u,e=>e*32,e=>e*16),emission:an(u,e=>e*48,e=>e*16),shapes:an(d,()=>0,e=>e*4),surfaces:an(d,e=>e*4,e=>e*4),entityCountBuffer:an(d,e=>e*8,()=>256),data:f,entityCount:1,meshVersion:Do(),batching:o,effects:{overlay:[]},meshAtlas:a,width:0,height:0,instanceDataBuffer:null,pointLightBuffer:p,pointLightData:[new Float32Array,0],needsDepth:!1};e.setResource(qs,m),e.setResource(dr,{eid:-1});let h=bs(m);n.graph.add(h);let g=Ss(m);n.graph.add(g),e.observe(s(Ho),e=>{let t=e>>>5,n=m.batching;if(t>=n.partMask.length){let e=new Uint32Array(N()>>>5);e.set(n.partMask),n.partMask=e}n.partMask[t]|=1<<(e&31),n.cullEntityCount++}),e.observe(c(Ho),e=>{m.batching.partMask[e>>>5]&=~(1<<(e&31)),m.batching.cullEntityCount--}),e.observe(s(Go),e=>{Yo(e)}),e.observe(c(Go),e=>{Xo(e)});let _=Ks(m);n.graph.add(_),n.graph.add({name:`point-light-upload`,scope:`frame`,inputs:[`data`],outputs:[`point-light-data`],execute(t){let n=dr.from(e)?.eid??-1;m.pointLightData=Bi(e,n>=0&&e.hasComponent(n,na));let[r,i]=m.pointLightData;i>0&&t.device.queue.writeBuffer(m.pointLightBuffer,0,r.buffer,r.byteOffset,i*8*4)}}),n.graph.add(_s({overlays:m.effects.overlay,hasDepthWriter:(()=>{let e=new Map;return t=>{let r=e.get(t);if(r!==void 0)return r;r=!1;let i=n.graph.subGraphs.get(t);if(i)for(let e of i.nodes.values()){for(let t of e.outputs)if(t===`depth`){r=!0;break}if(r)break}return e.set(t,r),r}})()})),n.graph.add(cs(m.scene)),t?.(1)},async warm(e){let t=[];for(let n of e.query([W]))W.active[n]&&t.push(n);if(t.length>0){let n=[];for(let t of e.query([pr]))n.push(t);if(n.length===0){let t=e.addEntity();e.addComponent(t,pr),n.push(t)}for(let r of t)e.getFirstRelationTarget(r,da)>=0||n.length===1&&e.addRelation(r,da,n[0])}let n=mr.from(e);n&&n.push((e,t,n)=>{let r=dr.from(e),i=qs.from(e),a=on.from(e);if(!a)return;let o=-1;for(let n of e.query([W]))if(W.active[n]&&e.getFirstRelationTarget(n,da)===t){o=n;break}o<0||(r&&(r.eid=o),i&&Sa(a.device,i,e,o,n))})}},Ys=`
struct CullParams {
    planes: array<vec4<f32>, 6>,
    entityCount: u32,
}

@group(0) @binding(0) var<uniform> params: CullParams;
@group(0) @binding(1) var<storage, read> matrices: array<mat4x4<f32>>;
@group(0) @binding(2) var<storage, read> sizes: array<vec4<f32>>;
@group(0) @binding(3) var<storage, read> shapeAABBs: array<vec4<f32>>;
@group(0) @binding(4) var<storage, read> cullEntities: array<vec2<u32>>;

@group(1) @binding(0) var<storage, read_write> indirect: array<atomic<u32>>;
@group(1) @binding(1) var<storage, read_write> entityIds: array<u32>;

struct WorldSphere {
    center: vec3<f32>,
    radius: f32,
    batchSlot: u32,
    eid: u32,
}

fn computeWorldSphere(gid: u32) -> WorldSphere {
    let packed = cullEntities[gid];
    let eid = packed.x;
    let batchSlot = packed.y;

    let shapeIdx = (batchSlot % ${vo}u) / 32u;
    let aabbIdx = shapeIdx * 2u;
    let aabbMin = shapeAABBs[aabbIdx];
    let aabbMax = shapeAABBs[aabbIdx + 1u];

    let size = sizes[eid];
    let localMin = aabbMin.xyz * size.xyz;
    let localMax = aabbMax.xyz * size.xyz;

    let localCenter = (localMin + localMax) * 0.5;
    let localExtent = (localMax - localMin) * 0.5;

    let world = matrices[eid];
    let worldCenter = (world * vec4<f32>(localCenter, 1.0)).xyz;

    let absCol0 = abs(world[0].xyz);
    let absCol1 = abs(world[1].xyz);
    let absCol2 = abs(world[2].xyz);
    let worldExtent = absCol0 * localExtent.x + absCol1 * localExtent.y + absCol2 * localExtent.z;
    let radius = length(worldExtent);

    return WorldSphere(worldCenter, radius, batchSlot, eid);
}

fn frustumTest(center: vec3<f32>, radius: f32) -> bool {
    for (var i = 0u; i < 6u; i++) {
        let plane = params.planes[i];
        let dist = dot(plane.xyz, center) + plane.w;
        if (dist < -radius) { return false; }
    }
    return true;
}

fn emitVisible(sphere: WorldSphere) {
    let indirectBase = sphere.batchSlot * 5u;
    let firstInstance = atomicLoad(&indirect[indirectBase + 4u]);
    let idx = atomicAdd(&indirect[indirectBase + 1u], 1u);
    entityIds[firstInstance + idx] = sphere.eid;
}
`;function Xs(e,t){for(let n=0;n<256;n++){let r=n*6,i=n*8;t[i]=e[r],t[i+1]=e[r+1],t[i+2]=e[r+2],t[i+3]=0,t[i+4]=e[r+3],t[i+5]=e[r+4],t[i+6]=e[r+5],t[i+7]=0}}function Zs(){return N()*16}function Qs(){return Zs()*2}var $s=20,ec=$s+1,tc=ec+10,nc=tc+1,rc=nc+1+1+1,ic=rc+1+1,ac=ic+1,oc=ac+1,sc=oc+1,cc=sc+1,lc=cc+1,uc=(lc+10)*4,dc=4608;function fc(){return 2*Zs()}function pc(){return fc()+N()+1}function mc(){return pc()+N()}function hc(){return(mc()+N()*33)*4}function gc(){return(N()*2+24+1)*4}var _c=Math.ceil(uc/256)*256;function vc(){return _c+Qs()*4}function yc(){return hc()+gc()}var bc=`struct Body {
    pos: vec3f,
    mass: f32,
    vel: vec3f,
    momentX: f32,
    angVel: vec3f,
    radius: f32,
    inertial: vec3f,
    friction: f32,
    initial: vec3f,
    hullId: u32,
    quat: vec4f,
    inertialQuat: vec4f,
    initialQuat: vec4f,
    prevVel: vec3f,
    momentY: f32,
    prevAngVel: vec3f,
    momentZ: f32,
    cumAng: vec3f,
    gravity: f32,
    halfExtents: vec3f,
    colliderType: f32,
    collisionGroup: u32,
    moved: f32,
    _pad50: f32,
    _pad51: f32,
}`,xc=`
struct GPUConstraint {
    bodyA: u32,
    bodyB: i32,
    featureKey: u32,
    stick: u32,
    normal: vec3f,
    C_init_n: f32,
    tangent1: vec3f,
    C_init_t1: f32,
    tangent2: vec3f,
    C_init_t2: f32,
    rA: vec3f,
    lambda_n: f32,
    rB: vec3f,
    penalty_n: f32,
    rAW: vec3f,
    friction: f32,
    lambda_t1: f32,
    penalty_t1: f32,
    lambda_t2: f32,
    penalty_t2: f32,
    isNew: u32,
    warmstartIdx: u32,
    bilateral: u32,
    _pad1: f32,
    _pad2: f32,
    _pad3: f32,
    fmin_n: f32,
    fmax_n: f32,
    stiffness: f32,
    rBW_x: f32,
    rBW_y: f32,
    rBW_z: f32,
}

const CONSTRAINT_CONTACT = 0u;
const CONSTRAINT_BALL = 1u;
const CONSTRAINT_SPRING = 2u;
const CONSTRAINT_KINEMATIC = 3u;

struct WarmstartEntry {
    lambda_n: f32,
    penalty_n: f32,
    lambda_t1: f32,
    penalty_t1: f32,
    lambda_t2: f32,
    penalty_t2: f32,
    stick: u32,
    featureKey: u32,
    rA: vec3f,
    _pad0: f32,
    rB: vec3f,
    _pad1: f32,
}
`,Sc=`

${bc}
${xc}

struct Params {
    dt: f32,
    gravity: f32,
    iterations: u32,
    alpha: f32,
    betaLin: f32,
    gamma: f32,
    bodyCount: u32,
    jointCount: u32,
    capacity: u32,
    constraintMul: u32,
    hashMul: u32,
    betaAng: f32,
    _pad0: u32,
    _pad1: u32,
    _pad2: u32,
    _pad3: u32,
}

const PENALTY_MIN: f32 = 1.0;
const PENALTY_MAX: f32 = 1e10;
const COLLISION_MARGIN: f32 = 0.01;
const STICK_THRESH: f32 = 1e-5;
const MAX_PAIR_CONTACTS: u32 = 4u;
const HASH_EMPTY: u32 = 0xFFFFFFFFu;
const MAX_PROBE: u32 = 128u;
const SHAPE_BOX: f32 = 0.0;
const SHAPE_SPHERE: f32 = 1.0;
const SHAPE_CAPSULE: f32 = 2.0;

const FEATURE_KEY_NONE: u32 = 0xFFFFFFFFu;

const SS_CONSTRAINT_COUNT: u32 = 0u;
const SS_WARMSTART_HITS: u32 = 3u;
const SS_CONSTRAINT_OVERFLOW: u32 = 4u;
const SS_STACK_OVERFLOW: u32 = 5u;
const DEBUG_BROADPHASE: u32 = ${ec}u;
const SS_WARMSTART_NAN: u32 = ${nc}u;
const SS_WARMSTART_LOADED: u32 = ${rc}u;
const NUM_PAIR_TYPES: u32 = 10u;
const SS_PAIR_TYPE_BASE: u32 = ${lc}u;
const SS_CONTACT_COUNT: u32 = ${sc}u;
const SS_CONTACT_OVERFLOW: u32 = ${cc}u;
const MAX_CONTACTS: u32 = 128u;
const CONTACT_STRIDE: u32 = 9u;
const HASH_BASE: u32 = ${_c/4}u;
`,Cc=`
struct Joint {
    localAnchorA: vec3f,
    bodyA: u32,
    localAnchorB: vec3f,
    bodyB: u32,
    jointType: u32,
    restLength: f32,
    stiffness: f32,
    targetSpeed: f32,
    axis: vec3f,
    maxTorque: f32,
    fracture: f32,
    broken: u32,
    _pad0: f32,
    _pad1: f32,
}
`,wc=`
struct TreeNode {
    minX: f32,
    minY: f32,
    minZ: f32,
    leftChild: u32,
    maxX: f32,
    maxY: f32,
    maxZ: f32,
    rightChild: u32,
}

const LEAF_FLAG: u32 = 0x80000000u;

struct LeafAABB {
    minX: f32, minY: f32, minZ: f32, _pad0: u32,
    maxX: f32, maxY: f32, maxZ: f32, _pad1: u32,
}
`,Tc=`
@group(0) @binding(0) var<storage, read_write> bodies: array<Body>;
@group(0) @binding(1) var<uniform> params: Params;
@group(0) @binding(2) var<storage, read_write> constraints: array<GPUConstraint>;
@group(0) @binding(3) var<storage, read_write> warmstarts: array<WarmstartEntry>;
@group(0) @binding(5) var<storage, read_write> solverState: array<atomic<u32>>;
`,Ec=`
${Cc}
${wc}
@group(0) @binding(0) var<storage, read_write> bodies: array<Body>;
@group(0) @binding(1) var<uniform> params: Params;
@group(0) @binding(4) var<storage, read_write> joints: array<Joint>;
@group(0) @binding(5) var<storage, read_write> solverState: array<atomic<u32>>;
@group(0) @binding(6) var<storage, read> treeNodes: array<TreeNode>;
@group(0) @binding(7) var<storage, read> sortedBodyIds: array<u32>;
@group(0) @binding(8) var<storage, read> leafAABBs: array<LeafAABB>;
`,Dc=`
${Cc}
${wc}
@group(0) @binding(0) var<storage, read_write> bodies: array<Body>;
@group(0) @binding(1) var<uniform> params: Params;
@group(0) @binding(2) var<storage, read_write> constraints: array<GPUConstraint>;
@group(0) @binding(3) var<storage, read_write> warmstarts: array<WarmstartEntry>;
@group(0) @binding(4) var<storage, read_write> joints: array<Joint>;
@group(0) @binding(5) var<storage, read_write> solverState: array<atomic<u32>>;
@group(0) @binding(6) var<storage, read> treeNodes: array<TreeNode>;
@group(0) @binding(7) var<storage, read> sortedBodyIds: array<u32>;
@group(0) @binding(8) var<storage, read> leafAABBs: array<LeafAABB>;
@group(0) @binding(9) var<storage, read> forces: array<f32>;
@group(0) @binding(10) var<storage, read_write> bodyCols: array<vec4f>;
`,Oc=0,kc=1,Ac=2,jc=3,Mc=4,Nc=`
${Sc}
${Dc}
`,Pc=`

fn quatRotate(q: vec4f, v: vec3f) -> vec3f {
    let u = q.xyz;
    let t = 2.0 * cross(u, v);
    return v + q.w * t + cross(u, t);
}

fn hashKey(k: u32) -> u32 {
    var h = k;
    h ^= h >> 16u;
    h *= 0x85ebca6bu;
    h ^= h >> 13u;
    h *= 0xc2b2ae35u;
    h ^= h >> 16u;
    return h;
}

fn hashLookup(key: u32) -> u32 {
    let hCap = params.capacity * params.hashMul;
    let mask = hCap - 1u;
    var slot = hashKey(key) & mask;
    for (var p = 0u; p < MAX_PROBE; p++) {
        let idx = (slot + p) & mask;
        let stored = atomicLoad(&solverState[HASH_BASE + idx]);
        if (stored == key) { return idx; }
        if (stored == HASH_EMPTY) { return hCap; }
    }
    return hCap;
}

fn tangentBasis(n: vec3f) -> array<vec3f, 2> {
    var t1: vec3f;
    if (abs(n.x) > abs(n.y)) {
        t1 = vec3f(-n.z, 0.0, n.x);
    } else {
        t1 = vec3f(0.0, n.z, -n.y);
    }
    t1 = normalize(t1);
    let t2 = cross(t1, n);
    return array<vec3f, 2>(t1, t2);
}

fn defaultWarmstart() -> WarmstartEntry {
    return WarmstartEntry(0.0, PENALTY_MIN, 0.0, PENALTY_MIN, 0.0, PENALTY_MIN, 0u, FEATURE_KEY_NONE, vec3f(0.0), 0.0, vec3f(0.0), 0.0);
}

fn isNanOrInf(v: f32) -> bool {
    return !(v == v) || abs(v) > 1e30;
}

fn applyWarmstart(ws: WarmstartEntry, stiffnessCap: f32) -> array<f32, 6> {
    let a = params.alpha;
    let g = params.gamma;
    return array<f32, 6>(
        (ws.lambda_n * a) * g,
        min(clamp(ws.penalty_n * g, PENALTY_MIN, PENALTY_MAX), stiffnessCap),
        (ws.lambda_t1 * a) * g,
        min(clamp(ws.penalty_t1 * g, PENALTY_MIN, PENALTY_MAX), stiffnessCap),
        (ws.lambda_t2 * a) * g,
        min(clamp(ws.penalty_t2 * g, PENALTY_MIN, PENALTY_MAX), stiffnessCap),
    );
}

fn pushConstraintWithWarmstart(
    bodyA: u32, bodyB: i32, featureKey: u32,
    normal: vec3f, C_init_n: f32,
    tangent1: vec3f, C_init_t1: f32,
    tangent2: vec3f, C_init_t2: f32,
    rA: vec3f, rB: vec3f,
    friction: f32,
    wsKey: u32, bilateral: u32,
    fmin_n: f32, fmax_n: f32, cStiffness: f32,
    ws: WarmstartEntry,
) {
    var warm = applyWarmstart(ws, cStiffness);
    if (bilateral == CONSTRAINT_KINEMATIC) {
        warm[0] = 0.0;
        warm[2] = 0.0;
        warm[4] = 0.0;
    }
    let isNew: u32 = select(0u, 1u, ws.featureKey == FEATURE_KEY_NONE);
    if (isNew == 0u) {
        atomicAdd(&solverState[SS_WARMSTART_HITS], 1u);
    }

    let ci = atomicAdd(&solverState[SS_CONSTRAINT_COUNT], 1u);
    if (ci >= params.capacity * params.constraintMul) { atomicAdd(&solverState[SS_CONSTRAINT_OVERFLOW], 1u); return; }
    constraints[ci] = GPUConstraint(
        bodyA, bodyB, featureKey, ws.stick,
        normal, C_init_n,
        tangent1, C_init_t1,
        tangent2, C_init_t2,
        rA, warm[0],
        rB, warm[1],
        vec3f(0.0), friction,
        warm[2], warm[3], warm[4], warm[5],
        isNew, wsKey, bilateral, 0.0,
        0.0, 0.0, fmin_n, fmax_n,
        cStiffness, 0.0, 0.0, 0.0,
    );
}
`,Fc=`
${Nc}
${`
${Pc}

fn quatMul(a: vec4f, b: vec4f) -> vec4f {
    return vec4f(
        a.w * b.x + a.x * b.w + a.y * b.z - a.z * b.y,
        a.w * b.y - a.x * b.z + a.y * b.w + a.z * b.x,
        a.w * b.z + a.x * b.y - a.y * b.x + a.z * b.w,
        a.w * b.w - a.x * b.x - a.y * b.y - a.z * b.z,
    );
}

fn hashInsert(key: u32) -> u32 {
    let hCap = params.capacity * params.hashMul;
    let mask = hCap - 1u;
    var slot = hashKey(key) & mask;
    for (var p = 0u; p < MAX_PROBE; p++) {
        let idx = (slot + p) & mask;
        let old = atomicCompareExchangeWeak(&solverState[HASH_BASE + idx], HASH_EMPTY, key);
        if (old.exchanged || old.old_value == key) {
            return idx;
        }
    }
    return hCap;
}

fn loadWarmstartHash(key: u32, featureKey: u32) -> WarmstartEntry {
    let hCap = params.capacity * params.hashMul;
    let idx = hashLookup(key);
    if (idx < hCap) {
        let ws = warmstarts[idx];
        if (ws.featureKey == featureKey && featureKey != FEATURE_KEY_NONE) {
            if (isNanOrInf(ws.lambda_n) || isNanOrInf(ws.penalty_n) ||
                isNanOrInf(ws.lambda_t1) || isNanOrInf(ws.penalty_t1) ||
                isNanOrInf(ws.lambda_t2) || isNanOrInf(ws.penalty_t2)) {
                atomicAdd(&solverState[SS_WARMSTART_NAN], 1u);
                return defaultWarmstart();
            }
            if (ws.penalty_n > PENALTY_MIN) {
                atomicAdd(&solverState[SS_WARMSTART_LOADED], 1u);
            }
            return ws;
        }
    }
    return defaultWarmstart();
}

fn pushConstraint(
    bodyA: u32, bodyB: i32, featureKey: u32,
    normal: vec3f, C_init_n: f32,
    tangent1: vec3f, C_init_t1: f32,
    tangent2: vec3f, C_init_t2: f32,
    rA: vec3f, rB: vec3f,
    friction: f32,
    wsKey: u32, bilateral: u32,
    fmin_n: f32, fmax_n: f32, cStiffness: f32,
) {
    let ws = loadWarmstartHash(wsKey, featureKey);
    pushConstraintWithWarmstart(bodyA, bodyB, featureKey, normal, C_init_n, tangent1, C_init_t1, tangent2, C_init_t2, rA, rB, friction, wsKey, bilateral, fmin_n, fmax_n, cStiffness, ws);
}

`}
`,Ic=`
fn packKey(bodyA: u32, bodyB: u32, slot: u32) -> u32 {
    let lo = min(bodyA, bodyB);
    let hi = max(bodyA, bodyB);
    var h = lo * 0x9e3779b9u + hi;
    h ^= slot * 0x517cc1b7u;
    h ^= h >> 16u;
    h *= 0x85ebca6bu;
    h ^= h >> 13u;
    h *= 0xc2b2ae35u;
    h ^= h >> 16u;
    return select(h, h ^ 1u, h == HASH_EMPTY);
}
`,Lc=`

const MAX_ANGVEL: f32 = 50.0;
const SOLVER_SHAPE_SPHERE: f32 = 1.0;
const SOLVER_SHAPE_CAPSULE: f32 = 2.0;
const SOLVER_SHAPE_HULL: f32 = 3.0;
const G_ZERO = array<f32, 6>(0.0, 0.0, 0.0, 0.0, 0.0, 0.0);
const MAX_DEGREE: u32 = 32u;
const MAX_COLORS: u32 = 12u;
const ADJ_STRIDE: u32 = 33u;
const UNCOLORED: u32 = 0xFFFFFFFFu;
const KINEMATIC_COLOR: u32 = 0xFFFFFFFEu;

const SS_ITERATION: u32 = 1u;
const SS_CURRENT_COLOR: u32 = 2u;
const SS_HASH_OVERFLOW: u32 = 6u;
const SS_USED_COLORS: u32 = 7u;
const DEBUG_OFFSET: u32 = 8u;
const NAN_COUNT_OFFSET: u32 = ${$s}u;
const SS_PENALTY_SATURATED: u32 = ${tc}u;
const SS_ADJ_OVERFLOW: u32 = ${ic}u;
const SS_UNCOLORED: u32 = ${ac}u;
const SS_HASH_OCCUPANCY: u32 = ${oc}u;

struct CapacityLayout {
    csrDataOffset: u32,
    csrOffsetsOffset: u32,
    csrHeadsOffset: u32,
    adjOffset: u32,
    csBase: u32,
    sortedOffset: u32,
    colorMetaOffset: u32,
}

fn getLayout() -> CapacityLayout {
    let cap = params.capacity;
    let mc = cap * params.constraintMul;
    let hc = cap * params.hashMul;
    let cdb = HASH_BASE + hc;
    let csrOff = cdb + mc * 2u;
    let csrHeads = csrOff + cap + 1u;
    let adj = csrHeads + cap;
    let cgSize = adj - cdb + cap * ADJ_STRIDE;
    return CapacityLayout(
        cdb,
        csrOff, csrHeads, adj,
        cdb + cgSize,
        cap, cap * 2u,
    );
}

`,Rc=`
${Fc}
${`
${Lc}

fn quatNormalize(q: vec4f) -> vec4f {
    let len = length(q);
    if (len < 1e-12) {
        return vec4f(0.0, 0.0, 0.0, 1.0);
    }
    return q / len;
}

fn quatIntegrate(q: vec4f, v: vec3f) -> vec4f {
    let dq = vec4f(v, 0.0);
    let prod = quatMul(dq, q);
    return quatNormalize(q + prod * 0.5);
}

fn quatInv(q: vec4f) -> vec4f {
    let ls = dot(q, q);
    return vec4f(-q.xyz, q.w) / ls;
}

fn angDispFromInitial(quat: vec4f, initialQuat: vec4f) -> vec3f {
    let dq = quatMul(quat, quatInv(initialQuat));
    return 2.0 * dq.xyz;
}

fn solve6(a: array<f32, 36>, b: array<f32, 6>) -> array<f32, 6> {
    let D0 = max(a[0], 1e-20);
    let L10 = a[6] / D0;
    let L20 = a[12] / D0;
    let L30 = a[18] / D0;
    let L40 = a[24] / D0;
    let L50 = a[30] / D0;

    let D1 = max(a[7] - L10 * L10 * D0, 1e-20);
    let L21 = (a[13] - L20 * L10 * D0) / D1;
    let L31 = (a[19] - L30 * L10 * D0) / D1;
    let L41 = (a[25] - L40 * L10 * D0) / D1;
    let L51 = (a[31] - L50 * L10 * D0) / D1;

    let D2 = max(a[14] - (L20 * L20 * D0 + L21 * L21 * D1), 1e-20);
    let L32 = (a[20] - L30 * L20 * D0 - L31 * L21 * D1) / D2;
    let L42 = (a[26] - L40 * L20 * D0 - L41 * L21 * D1) / D2;
    let L52 = (a[32] - L50 * L20 * D0 - L51 * L21 * D1) / D2;

    let D3 = max(a[21] - ((L30 * L30 * D0 + L31 * L31 * D1) + L32 * L32 * D2), 1e-20);
    let L43 = (a[27] - L40 * L30 * D0 - L41 * L31 * D1 - L42 * L32 * D2) / D3;
    let L53 = (a[33] - L50 * L30 * D0 - L51 * L31 * D1 - L52 * L32 * D2) / D3;

    let D4 = max(a[28] - (((L40 * L40 * D0 + L41 * L41 * D1) + L42 * L42 * D2) + L43 * L43 * D3), 1e-20);
    let L54 = (a[34] - L50 * L40 * D0 - L51 * L41 * D1 - L52 * L42 * D2 - L53 * L43 * D3) / D4;

    let D5 = max(a[35] - ((((L50 * L50 * D0 + L51 * L51 * D1) + L52 * L52 * D2) + L53 * L53 * D3) + L54 * L54 * D4), 1e-20);

    var y: array<f32, 6>;
    y[0] = b[0];
    y[1] = b[1] - L10 * y[0];
    y[2] = b[2] - L20 * y[0] - L21 * y[1];
    y[3] = b[3] - L30 * y[0] - L31 * y[1] - L32 * y[2];
    y[4] = b[4] - L40 * y[0] - L41 * y[1] - L42 * y[2] - L43 * y[3];
    y[5] = b[5] - L50 * y[0] - L51 * y[1] - L52 * y[2] - L53 * y[3] - L54 * y[4];

    y[0] /= D0;
    y[1] /= D1;
    y[2] /= D2;
    y[3] /= D3;
    y[4] /= D4;
    y[5] /= D5;

    var x: array<f32, 6>;
    x[5] = y[5];
    x[4] = y[4] - L54 * x[5];
    x[3] = y[3] - L43 * x[4] - L53 * x[5];
    x[2] = y[2] - L32 * x[3] - L42 * x[4] - L52 * x[5];
    x[1] = y[1] - L21 * x[2] - L31 * x[3] - L41 * x[4] - L51 * x[5];
    x[0] = y[0] - L10 * x[1] - L20 * x[2] - L30 * x[3] - L40 * x[4] - L50 * x[5];

    return x;
}

fn addJacobianToSystem(lhs: ptr<function, array<f32, 36>>, rhs: ptr<function, array<f32, 6>>, n: vec3f, rxn: vec3f, f: f32, pen: f32, G: array<f32, 6>) {
    let J0 = n.x; let J1 = n.y; let J2 = n.z;
    let J3 = rxn.x; let J4 = rxn.y; let J5 = rxn.z;

    (*rhs)[0] += J0 * f;
    (*rhs)[1] += J1 * f;
    (*rhs)[2] += J2 * f;
    (*rhs)[3] += J3 * f;
    (*rhs)[4] += J4 * f;
    (*rhs)[5] += J5 * f;

    (*lhs)[0]  += J0 * J0 * pen + G[0];
    (*lhs)[6]  += J1 * J0 * pen;
    (*lhs)[7]  += J1 * J1 * pen + G[1];
    (*lhs)[12] += J2 * J0 * pen;
    (*lhs)[13] += J2 * J1 * pen;
    (*lhs)[14] += J2 * J2 * pen + G[2];

    (*lhs)[18] += J3 * J0 * pen;
    (*lhs)[19] += J3 * J1 * pen;
    (*lhs)[20] += J3 * J2 * pen;
    (*lhs)[21] += J3 * J3 * pen + G[3];
    (*lhs)[24] += J4 * J0 * pen;
    (*lhs)[25] += J4 * J1 * pen;
    (*lhs)[26] += J4 * J2 * pen;
    (*lhs)[27] += J4 * J3 * pen;
    (*lhs)[28] += J4 * J4 * pen + G[4];
    (*lhs)[30] += J5 * J0 * pen;
    (*lhs)[31] += J5 * J1 * pen;
    (*lhs)[32] += J5 * J2 * pen;
    (*lhs)[33] += J5 * J3 * pen;
    (*lhs)[34] += J5 * J4 * pen;
    (*lhs)[35] += J5 * J5 * pen + G[5];
}

fn accumulateContact(
    lhs: ptr<function, array<f32, 36>>,
    rhs: ptr<function, array<f32, 6>>,
    jac: Jacobians,
    F: vec3f,
    pen_n: f32, pen_t1: f32, pen_t2: f32,
) {
    let K = vec3f(pen_n, pen_t1, pen_t2);
    let jLT0 = vec3f(jac.J_n.x, jac.J_t1.x, jac.J_t2.x);
    let jLT1 = vec3f(jac.J_n.y, jac.J_t1.y, jac.J_t2.y);
    let jLT2 = vec3f(jac.J_n.z, jac.J_t1.z, jac.J_t2.z);
    let jAT0 = vec3f(jac.rxn_n.x, jac.rxn_t1.x, jac.rxn_t2.x);
    let jAT1 = vec3f(jac.rxn_n.y, jac.rxn_t1.y, jac.rxn_t2.y);
    let jAT2 = vec3f(jac.rxn_n.z, jac.rxn_t1.z, jac.rxn_t2.z);
    let jLTK0 = jLT0 * K;
    let jLTK1 = jLT1 * K;
    let jLTK2 = jLT2 * K;
    let jATK0 = jAT0 * K;
    let jATK1 = jAT1 * K;
    let jATK2 = jAT2 * K;

    (*lhs)[0]  += dot(jLTK0, jLT0);
    (*lhs)[6]  += dot(jLTK1, jLT0);
    (*lhs)[7]  += dot(jLTK1, jLT1);
    (*lhs)[12] += dot(jLTK2, jLT0);
    (*lhs)[13] += dot(jLTK2, jLT1);
    (*lhs)[14] += dot(jLTK2, jLT2);

    (*lhs)[21] += dot(jATK0, jAT0);
    (*lhs)[27] += dot(jATK1, jAT0);
    (*lhs)[28] += dot(jATK1, jAT1);
    (*lhs)[33] += dot(jATK2, jAT0);
    (*lhs)[34] += dot(jATK2, jAT1);
    (*lhs)[35] += dot(jATK2, jAT2);

    (*lhs)[18] += dot(jATK0, jLT0);
    (*lhs)[19] += dot(jATK0, jLT1);
    (*lhs)[20] += dot(jATK0, jLT2);
    (*lhs)[24] += dot(jATK1, jLT0);
    (*lhs)[25] += dot(jATK1, jLT1);
    (*lhs)[26] += dot(jATK1, jLT2);
    (*lhs)[30] += dot(jATK2, jLT0);
    (*lhs)[31] += dot(jATK2, jLT1);
    (*lhs)[32] += dot(jATK2, jLT2);

    (*rhs)[0] += jLT0.x * F.x + jLT0.y * F.y + jLT0.z * F.z;
    (*rhs)[1] += jLT1.x * F.x + jLT1.y * F.y + jLT1.z * F.z;
    (*rhs)[2] += jLT2.x * F.x + jLT2.y * F.y + jLT2.z * F.z;
    (*rhs)[3] += jAT0.x * F.x + jAT0.y * F.y + jAT0.z * F.z;
    (*rhs)[4] += jAT1.x * F.x + jAT1.y * F.y + jAT1.z * F.z;
    (*rhs)[5] += jAT2.x * F.x + jAT2.y * F.y + jAT2.z * F.z;
}

fn applyBallJointDirect(
    lhs: ptr<function, array<f32, 36>>,
    rhs: ptr<function, array<f32, 6>>,
    con: GPUConstraint, idx: u32,
) {
    let bA = bodies[con.bodyA];
    let bB = bodies[u32(con.bodyB)];

    let rAw = quatRotate(bA.quat, con.rA);
    let rBw = quatRotate(bB.quat, con.rB);

    var C = (bA.pos + rAw) - (bB.pos + rBw);
    if (con.stiffness >= 1e30) {
        C -= vec3f(con.C_init_n, con.C_init_t1, con.C_init_t2) * params.alpha;
    }

    let K = vec3f(con.penalty_n, con.penalty_t1, con.penalty_t2);
    let F = K * C + vec3f(con.lambda_n, con.lambda_t1, con.lambda_t2);

    let isA = idx == con.bodyA;
    let s = select(-1.0, 1.0, isA);
    let rWorld = quatRotate(bodies[idx].quat, select(con.rB, con.rA, isA));
    let angArm = select(rWorld, -rWorld, isA);

    (*lhs)[0]  += K.x;
    (*lhs)[7]  += K.y;
    (*lhs)[14] += K.z;

    let rx = angArm.x; let ry = angArm.y; let rz = angArm.z;

    (*lhs)[21] += K.y * rz * rz + K.z * ry * ry;
    (*lhs)[27] += -K.z * rx * ry;
    (*lhs)[28] += K.x * rz * rz + K.z * rx * rx;
    (*lhs)[33] += -K.y * rx * rz;
    (*lhs)[34] += -K.x * ry * rz;
    (*lhs)[35] += K.x * ry * ry + K.y * rx * rx;

    (*lhs)[18] += 0.0;            (*lhs)[19] += rz * K.y * s;   (*lhs)[20] += -ry * K.z * s;
    (*lhs)[24] += -rz * K.x * s;  (*lhs)[25] += 0.0;            (*lhs)[26] += rx * K.z * s;
    (*lhs)[30] += ry * K.x * s;   (*lhs)[31] += -rx * K.y * s;  (*lhs)[32] += 0.0;

    let geoArm = select(-rWorld, rWorld, isA);
    let Hc0 = vec3f(-(F.y * geoArm.y + F.z * geoArm.z), F.x * geoArm.y, F.x * geoArm.z);
    let Hc1 = vec3f(F.y * geoArm.x, -(F.x * geoArm.x + F.z * geoArm.z), F.y * geoArm.z);
    let Hc2 = vec3f(F.z * geoArm.x, F.z * geoArm.y, -(F.x * geoArm.x + F.y * geoArm.y));
    (*lhs)[21] += length(Hc0);
    (*lhs)[28] += length(Hc1);
    (*lhs)[35] += length(Hc2);

    (*rhs)[0] += s * F.x;
    (*rhs)[1] += s * F.y;
    (*rhs)[2] += s * F.z;
    let angF = -cross(angArm, F);
    (*rhs)[3] += angF.x;
    (*rhs)[4] += angF.y;
    (*rhs)[5] += angF.z;
}


`}
${`
const COL_POS: u32 = ${Oc}u;
const COL_INITIAL: u32 = ${kc}u;
const COL_CUMANG: u32 = ${Ac}u;
const COL_QUAT: u32 = ${jc}u;
const COL_INITIAL_QUAT: u32 = ${Mc}u;

fn colIdx(col: u32, i: u32) -> u32 {
    return col * params.capacity + i;
}

fn contactArmFields(rA: vec3f, rB: vec3f, normal: vec3f, isA: bool, quat: vec4f, initialQuat: vec4f, radius: f32, collType: f32) -> vec3f {
    let s = select(1.0, -1.0, isA);
    let radial = s * normal * radius;
    let localArm = select(rB, rA, isA);
    let isSphere = collType == SOLVER_SHAPE_SPHERE;
    let isCapsule = collType == SOLVER_SHAPE_CAPSULE;
    let iqc = vec4f(-initialQuat.xyz, initialQuat.w);
    let radialLocal = quatRotate(iqc, radial);
    let capsuleArm = quatRotate(quat, localArm - radialLocal) + radial;
    let boxArm = quatRotate(quat, localArm);
    let arm = select(boxArm, capsuleArm, isCapsule);
    return select(arm, radial, isSphere);
}
`}

@compute @workgroup_size(64)
fn syncBodyCols(@builtin(global_invocation_id) gid: vec3u) {
    let idx = gid.x;
    if (idx >= params.bodyCount) { return; }
    let body = bodies[idx];
    bodyCols[colIdx(COL_POS, idx)]          = vec4f(body.pos, body.radius);
    bodyCols[colIdx(COL_INITIAL, idx)]      = vec4f(body.initial, body.colliderType);
    bodyCols[colIdx(COL_CUMANG, idx)]       = vec4f(body.cumAng, 0.0);
    bodyCols[colIdx(COL_QUAT, idx)]         = body.quat;
    bodyCols[colIdx(COL_INITIAL_QUAT, idx)] = body.initialQuat;
}

fn detectBallJoint(ji: u32) {
    let joint = joints[ji];
    let bodyA = bodies[joint.bodyA];
    let bodyB = bodies[joint.bodyB];

    let rAw = quatRotate(bodyA.quat, joint.localAnchorA);
    let rBw = quatRotate(bodyB.quat, joint.localAnchorB);

    let worldA = bodyA.pos + rAw;
    let worldB = bodyB.pos + rBw;
    let diff_init = worldA - worldB;

    let featureKey = 0x80000000u + ji;
    let wsKey = 0x80000000u | ji;

    let stiffness = select(1e30, joint.stiffness, joint.stiffness > 0.0);

    pushConstraint(
        joint.bodyA, i32(joint.bodyB), featureKey,
        vec3f(1.0, 0.0, 0.0), diff_init.x,
        vec3f(0.0, 1.0, 0.0), diff_init.y,
        vec3f(0.0, 0.0, 1.0), diff_init.z,
        joint.localAnchorA, joint.localAnchorB,
        0.0,
        wsKey, 1u,
        -1e30, 1e30, stiffness,
    );
}

fn detectSpring(ji: u32) {
    let joint = joints[ji];
    let bodyA = bodies[joint.bodyA];
    let bodyB = bodies[joint.bodyB];

    let rA = quatRotate(bodyA.quat, joint.localAnchorA);
    let rB = quatRotate(bodyB.quat, joint.localAnchorB);

    let worldA = bodyA.pos + rA;
    let worldB = bodyB.pos + rB;
    let diff = worldB - worldA;
    let dist = length(diff);
    let restLength = joint.restLength;
    let stiffness = joint.stiffness;

    var normal = vec3f(1.0, 0.0, 0.0);
    if (dist > 1e-8) {
        normal = diff / dist;
    }

    let C_n = dist - restLength;
    let featureKey = 0x90000000u + ji;
    let t = tangentBasis(normal);
    let wsKey = 0x90000000u | ji;

    pushConstraint(
        joint.bodyA, i32(joint.bodyB), featureKey,
        normal, C_n,
        t[0], 0.0, t[1], 0.0,
        rA, rB,
        0.0,
        wsKey, 2u,
        -1e30, 1e30, stiffness,
    );
}

fn computeBallJointCFn(c: GPUConstraint, ji: u32, currentAlpha: f32) -> vec3f {
    let bodyA = bodies[c.bodyA];
    let bodyB = bodies[u32(c.bodyB)];

    let rA = quatRotate(bodyA.quat, c.rA);
    let rB = quatRotate(bodyB.quat, c.rB);

    let worldA = bodyA.pos + rA;
    let worldB = bodyB.pos + rB;
    let diff = worldA - worldB;

    let Cn_n = dot(c.normal, diff);
    let Cn_t1 = dot(c.tangent1, diff);
    let Cn_t2 = dot(c.tangent2, diff);

    return vec3f(
        Cn_n - currentAlpha * c.C_init_n,
        Cn_t1 - currentAlpha * c.C_init_t1,
        Cn_t2 - currentAlpha * c.C_init_t2,
    );
}

fn computeSpringCFn(c: GPUConstraint, ji: u32) -> vec3f {
    let joint = joints[ji];
    let bodyA = bodies[c.bodyA];
    let bodyB = bodies[u32(c.bodyB)];

    let rA = quatRotate(bodyA.quat, joint.localAnchorA);
    let rB = quatRotate(bodyB.quat, joint.localAnchorB);

    let worldA = bodyA.pos + rA;
    let worldB = bodyB.pos + rB;
    let diff = worldB - worldA;
    let dist = length(diff);

    return vec3f(dist - joint.restLength, 0.0, 0.0);
}

fn contactArm(c: GPUConstraint, bodyIdx: u32) -> vec3f {
    let body = bodies[bodyIdx];
    let isA = bodyIdx == c.bodyA;
    let s = select(1.0, -1.0, isA);
    let radial = s * c.normal * body.radius;
    let localArm = select(c.rB, c.rA, isA);
    let isSphere = body.colliderType == SOLVER_SHAPE_SPHERE;
    let isCapsule = body.colliderType == SOLVER_SHAPE_CAPSULE;
    let iqc = vec4f(-body.initialQuat.xyz, body.initialQuat.w);
    let radialLocal = quatRotate(iqc, radial);
    let capsuleArm = quatRotate(body.quat, localArm - radialLocal) + radial;
    let boxArm = quatRotate(body.quat, localArm);
    let arm = select(boxArm, capsuleArm, isCapsule);
    return select(arm, radial, isSphere);
}

fn computeConstraintC(c: GPUConstraint, currentAlpha: f32) -> vec3f {
    let bA = bodies[c.bodyA];
    let bB = bodies[u32(c.bodyB)];
    let dqALin = bA.pos - bA.initial;
    let dqAAng = bA.cumAng;
    let dqBLin = bB.pos - bB.initial;
    let dqBAng = bB.cumAng;
    let rAW = contactArm(c, c.bodyA);
    let rBW = contactArm(c, u32(c.bodyB));
    let oneMinusAlpha = 1.0 - currentAlpha;

    let jALin_n = c.normal;
    let jBLin_n = -c.normal;
    let jAAng_n = cross(rAW, jALin_n);
    let jBAng_n = cross(rBW, jBLin_n);
    let C_n = oneMinusAlpha * c.C_init_n + dot(jALin_n, dqALin) + dot(jBLin_n, dqBLin) + dot(jAAng_n, dqAAng) + dot(jBAng_n, dqBAng);

    let jALin_t1 = c.tangent1;
    let jBLin_t1 = -c.tangent1;
    let jAAng_t1 = cross(rAW, jALin_t1);
    let jBAng_t1 = cross(rBW, jBLin_t1);
    let C_t1 = oneMinusAlpha * c.C_init_t1 + dot(jALin_t1, dqALin) + dot(jBLin_t1, dqBLin) + dot(jAAng_t1, dqAAng) + dot(jBAng_t1, dqBAng);

    let jALin_t2 = c.tangent2;
    let jBLin_t2 = -c.tangent2;
    let jAAng_t2 = cross(rAW, jALin_t2);
    let jBAng_t2 = cross(rBW, jBLin_t2);
    let C_t2 = oneMinusAlpha * c.C_init_t2 + dot(jALin_t2, dqALin) + dot(jBLin_t2, dqBLin) + dot(jAAng_t2, dqAAng) + dot(jBAng_t2, dqBAng);

    return vec3f(C_n, C_t1, C_t2);
}

struct Jacobians {
    J_n: vec3f,
    rxn_n: vec3f,
    J_t1: vec3f,
    rxn_t1: vec3f,
    J_t2: vec3f,
    rxn_t2: vec3f,
}

fn applySpringDirect(lhs: ptr<function, array<f32, 36>>, rhs: ptr<function, array<f32, 6>>, c: GPUConstraint, idx: u32) {
    let ji = c.featureKey - 0x90000000u;
    let joint = joints[ji];
    let sBodyA = bodies[c.bodyA];
    let sBodyB = bodies[u32(c.bodyB)];
    let srA = quatRotate(sBodyA.quat, joint.localAnchorA);
    let srB = quatRotate(sBodyB.quat, joint.localAnchorB);
    let sDiff = (sBodyA.pos + srA) - (sBodyB.pos + srB);
    let sDist = length(sDiff);
    if (sDist <= 1e-6) { return; }
    let sNormal = sDiff / sDist;
    let springC = sDist - joint.restLength;
    let springF = joint.stiffness * springC;
    let isA = idx == c.bodyA;
    let sSign = select(-1.0, 1.0, isA);
    let sArm = select(srB, srA, isA);
    let sJ_n = sNormal * sSign;
    let sRxn_n = cross(sArm, sJ_n);
    addJacobianToSystem(lhs, rhs, sJ_n, sRxn_n, springF, joint.stiffness, G_ZERO);
}

fn computeCForType(c: GPUConstraint, currentAlpha: f32) -> vec3f {
    if (c.bilateral == CONSTRAINT_SPRING) {
        let ji = c.featureKey - 0x90000000u;
        return computeSpringCFn(c, ji);
    }
    if (c.bilateral == CONSTRAINT_BALL) {
        let ji = c.featureKey - 0x80000000u;
        return computeBallJointCFn(c, ji, currentAlpha);
    }
    let alpha = select(currentAlpha, 0.0, c.bilateral == CONSTRAINT_KINEMATIC);
    return computeConstraintC(c, alpha);
}

@compute @workgroup_size(64)
fn warmstartBodies(@builtin(global_invocation_id) gid: vec3u) {
    let idx = gid.x;
    if (idx >= params.bodyCount) { return; }

    let dt = params.dt;
    let dt2 = dt * dt;

    var body = bodies[idx];
    let g = vec3f(0.0, params.gravity * body.gravity, 0.0);

    if (body.pos.x != body.pos.x || body.pos.y != body.pos.y || body.pos.z != body.pos.z) {
        atomicAdd(&solverState[NAN_COUNT_OFFSET], 1u);
    }

    if (body.mass <= 0.0) {
        body.initial = body.pos;
        body.initialQuat = body.quat;
        bodies[idx] = body;
        return;
    }

    let fOff = idx * 8u;
    let extForce = vec3f(forces[fOff], forces[fOff + 1u], forces[fOff + 2u]);
    let extTorque = vec3f(forces[fOff + 3u], forces[fOff + 4u], forces[fOff + 5u]);
    let forceMode = forces[fOff + 6u];

    if (forceMode > 0.5) {
        body.vel = extForce;
        body.angVel = extTorque;
    } else {
        body.vel += (extForce / body.mass) * dt;

        let invI = vec3f(1.0 / body.momentX, 1.0 / body.momentY, 1.0 / body.momentZ);
        let q = body.quat;
        let tLocal = quatRotate(quatInv(q), extTorque);
        body.angVel += invI * tLocal * dt;
    }

    let angSpeedPre = length(body.angVel);
    if (angSpeedPre > MAX_ANGVEL) {
        body.angVel = body.angVel * (MAX_ANGVEL / angSpeedPre);
    }

    body.inertial = body.pos + body.vel * dt + g * dt2;
    body.inertialQuat = quatIntegrate(body.quat, body.angVel * dt);

    let accel = (body.vel - body.prevVel) / dt;
    let accelExt = accel.y * sign(params.gravity);
    var accelWeight = clamp(accelExt / abs(params.gravity), 0.0, 1.0);
    if (accelWeight != accelWeight) { accelWeight = 0.0; }

    body.initial = body.pos;
    body.initialQuat = body.quat;

    body.pos = body.pos + body.vel * dt + g * (accelWeight * dt * dt);
    body.quat = body.inertialQuat;

    bodies[idx] = body;
}

@compute @workgroup_size(64)
fn detectJoints(@builtin(global_invocation_id) gid: vec3u) {
    let ji = gid.x;
    if (ji >= params.jointCount) { return; }
    if (joints[ji].broken != 0u) { return; }
    if (joints[ji].jointType == 1u) {
        detectSpring(ji);
    } else {
        detectBallJoint(ji);
    }
}


@compute @workgroup_size(64)
fn initBodyCache(@builtin(global_invocation_id) gid: vec3u) {
    let idx = gid.x;
    if (idx >= params.bodyCount) { return; }
    let body = bodies[idx];
    if (body.mass <= 0.0) {
        bodies[idx].cumAng = vec3f(0.0);
    } else {
        bodies[idx].cumAng = angDispFromInitial(body.quat, body.initialQuat);
    }
}

@compute @workgroup_size(64)
fn cacheContactC(@builtin(global_invocation_id) gid: vec3u) {
    let ci = gid.x;
    let numConstraints = atomicLoad(&solverState[SS_CONSTRAINT_COUNT]);
    if (ci >= numConstraints) { return; }
    let c = constraints[ci];
    if (c.bilateral != CONSTRAINT_CONTACT && c.bilateral != CONSTRAINT_KINEMATIC) { return; }
    let rAW = quatRotate(bodies[c.bodyA].initialQuat, c.rA);
    let rBW = quatRotate(bodies[u32(c.bodyB)].initialQuat, c.rB);
    constraints[ci].rAW = rAW;
    constraints[ci].rBW_x = rBW.x;
    constraints[ci].rBW_y = rBW.y;
    constraints[ci].rBW_z = rBW.z;
}

@compute @workgroup_size(64)
fn solveDual(@builtin(global_invocation_id) gid: vec3u) {
    let ci = gid.x;
    let numConstraints = atomicLoad(&solverState[SS_CONSTRAINT_COUNT]);
    if (ci >= numConstraints) { return; }

    var c = constraints[ci];
    if (c.bilateral == CONSTRAINT_SPRING) {
        constraints[ci] = c;
        return;
    }

    let penCap = min(PENALTY_MAX, c.stiffness);
    let beta = params.betaLin;

    if (c.bilateral == CONSTRAINT_BALL) {
        let bji = c.featureKey - 0x80000000u;
        let bA = bodies[c.bodyA];
        let bB = bodies[u32(c.bodyB)];
        let rAw = quatRotate(bA.quat, c.rA);
        let rBw = quatRotate(bB.quat, c.rB);
        var C = (bA.pos + rAw) - (bB.pos + rBw);
        if (c.stiffness >= 1e30) {
            C -= vec3f(c.C_init_n, c.C_init_t1, c.C_init_t2) * params.alpha;
            let K = vec3f(c.penalty_n, c.penalty_t1, c.penalty_t2);
            let newLambda = K * C + vec3f(c.lambda_n, c.lambda_t1, c.lambda_t2);
            c.lambda_n = newLambda.x;
            c.lambda_t1 = newLambda.y;
            c.lambda_t2 = newLambda.z;
        }
        c.penalty_n = min(c.penalty_n + beta * abs(C.x), penCap);
        c.penalty_t1 = min(c.penalty_t1 + beta * abs(C.y), penCap);
        c.penalty_t2 = min(c.penalty_t2 + beta * abs(C.z), penCap);
        c.stick = 0u;

        let frac = joints[bji].fracture;
        if (frac > 0.0) {
            let forceSq = c.lambda_n * c.lambda_n + c.lambda_t1 * c.lambda_t1 + c.lambda_t2 * c.lambda_t2;
            if (forceSq > frac * frac) {
                c.lambda_n = 0.0;
                c.lambda_t1 = 0.0;
                c.lambda_t2 = 0.0;
                c.penalty_n = 0.0;
                c.penalty_t1 = 0.0;
                c.penalty_t2 = 0.0;
                joints[bji].broken = 1u;
            }
        }
    } else {
        let Cs = computeCForType(c, params.alpha);
        let lambda_used = select(0.0, c.lambda_n, c.stiffness >= 1e30);
        c.lambda_n = clamp(c.penalty_n * Cs.x + lambda_used, c.fmin_n, c.fmax_n);
        if (c.lambda_n > c.fmin_n && c.lambda_n < c.fmax_n) {
            c.penalty_n = min(c.penalty_n + beta * abs(Cs.x), penCap);
        }
        if (c.penalty_n >= penCap) {
            atomicAdd(&solverState[SS_PENALTY_SATURATED], 1u);
        }

        if (c.friction > 0.0) {
            let dualBound = abs(c.lambda_n) * c.friction;
            let lambda_t1_used = select(0.0, c.lambda_t1, c.stiffness >= 1e30);
            let lambda_t2_used = select(0.0, c.lambda_t2, c.stiffness >= 1e30);
            var f_t1 = c.penalty_t1 * Cs.y + lambda_t1_used;
            var f_t2 = c.penalty_t2 * Cs.z + lambda_t2_used;
            let fScale = sqrt(f_t1 * f_t1 + f_t2 * f_t2);
            if (fScale > dualBound && fScale > 0.0) {
                let ratio = dualBound / fScale;
                f_t1 *= ratio;
                f_t2 *= ratio;
            }
            c.lambda_t1 = f_t1;
            c.lambda_t2 = f_t2;
            if (fScale <= dualBound) {
                c.penalty_t1 = min(c.penalty_t1 + beta * abs(Cs.y), penCap);
                c.penalty_t2 = min(c.penalty_t2 + beta * abs(Cs.z), penCap);
                c.stick = select(0u, 1u, sqrt(Cs.y * Cs.y + Cs.z * Cs.z) < STICK_THRESH);
            }
        }

    }

    constraints[ci] = c;
}

@compute @workgroup_size(1)
fn advanceIteration(@builtin(global_invocation_id) gid: vec3u) {
    atomicAdd(&solverState[SS_ITERATION], 1u);
}

@compute @workgroup_size(64)
fn computeVelocities(@builtin(global_invocation_id) gid: vec3u) {
    let idx = gid.x;
    if (idx >= params.bodyCount) { return; }

    let dt = params.dt;
    var body = bodies[idx];

    if (body.mass <= 0.0) { return; }

    body.prevVel = body.vel;
    body.prevAngVel = body.angVel;
    body.vel = (body.pos - body.initial) / dt;

    let dqFinal = quatMul(body.quat, quatInv(body.initialQuat));
    body.angVel = 2.0 * dqFinal.xyz / dt;
    bodies[idx] = body;
}

@compute @workgroup_size(64)
fn writebackWarmstarts(@builtin(global_invocation_id) gid: vec3u) {
    let ci = gid.x;
    let numConstraints = atomicLoad(&solverState[SS_CONSTRAINT_COUNT]);
    if (ci >= numConstraints) { return; }

    let c = constraints[ci];
    let slot = hashInsert(c.warmstartIdx);
    if (slot >= params.capacity * params.hashMul) { atomicAdd(&solverState[SS_HASH_OVERFLOW], 1u); return; }
    atomicAdd(&solverState[SS_HASH_OCCUPANCY], 1u);
    warmstarts[slot] = WarmstartEntry(
        c.lambda_n, c.penalty_n,
        c.lambda_t1, c.penalty_t1,
        c.lambda_t2, c.penalty_t2,
        c.stick, c.featureKey,
        c.rA, 0.0,
        c.rB, 0.0,
    );
}

@compute @workgroup_size(64)
fn solvePrimal(@builtin(global_invocation_id) gid: vec3u) {
    let L = getLayout();
    let currentColor = atomicLoad(&solverState[SS_CURRENT_COLOR]);
    let colorOffset = atomicLoad(&solverState[L.csBase + L.colorMetaOffset + MAX_COLORS + currentColor]);
    let nextOffset = atomicLoad(&solverState[L.csBase + L.colorMetaOffset + MAX_COLORS + currentColor + 1u]);
    let colorCount = nextOffset - colorOffset;
    if (gid.x >= colorCount) { return; }

    let idx = atomicLoad(&solverState[L.csBase + L.sortedOffset + colorOffset + gid.x]);
    var body = bodies[idx];
    if (body.mass <= 0.0) { return; }

    let dt = params.dt;
    let dt2 = dt * dt;
    let clStart = atomicLoad(&solverState[L.csrOffsetsOffset + idx]);
    let clEnd = atomicLoad(&solverState[L.csrOffsetsOffset + idx + 1u]);

    var lhs: array<f32, 36>;
    let mdt2 = body.mass / dt2;
    lhs[0] = mdt2;
    lhs[7] = mdt2;
    lhs[14] = mdt2;
    lhs[21] = body.momentX / dt2;
    lhs[28] = body.momentY / dt2;
    lhs[35] = body.momentZ / dt2;

    let dp = body.pos - body.inertial;
    var rhs: array<f32, 6>;
    rhs[0] = mdt2 * dp.x;
    rhs[1] = mdt2 * dp.y;
    rhs[2] = mdt2 * dp.z;

    let dq = quatMul(body.quat, quatInv(body.inertialQuat));
    let angDisp2 = 2.0 * dq.xyz;
    rhs[3] = body.momentX / dt2 * angDisp2.x;
    rhs[4] = body.momentY / dt2 * angDisp2.y;
    rhs[5] = body.momentZ / dt2 * angDisp2.z;

    for (var k = clStart; k < clEnd; k++) {
        let ci = atomicLoad(&solverState[L.csrDataOffset + k]);
        var c = constraints[ci];
        if (c.bodyA != idx && c.bodyB != i32(idx)) { continue; }

        if (c.bilateral == CONSTRAINT_SPRING) {
            applySpringDirect(&lhs, &rhs, c, idx);
            continue;
        }

        if (c.bilateral == CONSTRAINT_BALL) {
            applyBallJointDirect(&lhs, &rhs, c, idx);
            continue;
        }

        let bA_isOwn = idx == c.bodyA;
        let neighborIdx = select(c.bodyA, u32(c.bodyB), bA_isOwn);

        let nPosCol         = bodyCols[colIdx(COL_POS, neighborIdx)];
        let nInitialCol     = bodyCols[colIdx(COL_INITIAL, neighborIdx)];
        let nCumAngCol      = bodyCols[colIdx(COL_CUMANG, neighborIdx)];
        let nQuat           = bodyCols[colIdx(COL_QUAT, neighborIdx)];
        let nInitialQuat    = bodyCols[colIdx(COL_INITIAL_QUAT, neighborIdx)];

        let quatA           = select(nQuat,        body.quat,        bA_isOwn);
        let quatB           = select(body.quat,    nQuat,            bA_isOwn);
        let initialQuatA    = select(nInitialQuat, body.initialQuat, bA_isOwn);
        let initialQuatB    = select(body.initialQuat, nInitialQuat, bA_isOwn);
        let radiusA         = select(nPosCol.w,    body.radius,      bA_isOwn);
        let radiusB         = select(body.radius,  nPosCol.w,        bA_isOwn);
        let collA           = select(nInitialCol.w, body.colliderType, bA_isOwn);
        let collB           = select(body.colliderType, nInitialCol.w, bA_isOwn);

        let rAW = contactArmFields(c.rA, c.rB, c.normal, true,  quatA, initialQuatA, radiusA, collA);
        let rBW = contactArmFields(c.rA, c.rB, c.normal, false, quatB, initialQuatB, radiusB, collB);

        let posA    = select(nPosCol.xyz,     body.pos,     bA_isOwn);
        let posB    = select(body.pos,        nPosCol.xyz,  bA_isOwn);
        let initA   = select(nInitialCol.xyz, body.initial, bA_isOwn);
        let initB   = select(body.initial,    nInitialCol.xyz, bA_isOwn);
        let cumAngA = select(nCumAngCol.xyz,  body.cumAng,  bA_isOwn);
        let cumAngB = select(body.cumAng,     nCumAngCol.xyz, bA_isOwn);

        let dqALin = posA - initA;
        let dqBLin = posB - initB;
        let dqAAng = cumAngA;
        let dqBAng = cumAngB;

        let alphaUsed = select(params.alpha, 0.0, c.bilateral == CONSTRAINT_KINEMATIC);
        let oneMinusAlpha = 1.0 - alphaUsed;

        let jALin_n = c.normal;
        let jBLin_n = -c.normal;
        let jAAng_n = cross(rAW, jALin_n);
        let jBAng_n = cross(rBW, jBLin_n);
        let C_n = oneMinusAlpha * c.C_init_n + dot(jALin_n, dqALin) + dot(jBLin_n, dqBLin) + dot(jAAng_n, dqAAng) + dot(jBAng_n, dqBAng);

        let jALin_t1 = c.tangent1;
        let jBLin_t1 = -c.tangent1;
        let jAAng_t1 = cross(rAW, jALin_t1);
        let jBAng_t1 = cross(rBW, jBLin_t1);
        let C_t1 = oneMinusAlpha * c.C_init_t1 + dot(jALin_t1, dqALin) + dot(jBLin_t1, dqBLin) + dot(jAAng_t1, dqAAng) + dot(jBAng_t1, dqBAng);

        let jALin_t2 = c.tangent2;
        let jBLin_t2 = -c.tangent2;
        let jAAng_t2 = cross(rAW, jALin_t2);
        let jBAng_t2 = cross(rBW, jBLin_t2);
        let C_t2 = oneMinusAlpha * c.C_init_t2 + dot(jALin_t2, dqALin) + dot(jBLin_t2, dqBLin) + dot(jAAng_t2, dqAAng) + dot(jBAng_t2, dqBAng);

        let Cs = vec3f(C_n, C_t1, C_t2);

        let lambda_used = select(0.0, c.lambda_n, c.stiffness >= 1e30);
        let f_n = clamp(c.penalty_n * Cs.x + lambda_used, c.fmin_n, c.fmax_n);

        let armOwn = select(rBW, rAW, bA_isOwn);
        let sJ = select(-1.0, 1.0, bA_isOwn);
        let J_n  = c.normal   * sJ;
        let J_t1 = c.tangent1 * sJ;
        let J_t2 = c.tangent2 * sJ;
        let jac = Jacobians(J_n, cross(armOwn, J_n), J_t1, cross(armOwn, J_t1), J_t2, cross(armOwn, J_t2));

        let lambda_t1_used = select(0.0, c.lambda_t1, c.stiffness >= 1e30);
        let lambda_t2_used = select(0.0, c.lambda_t2, c.stiffness >= 1e30);

        var f_t1 = c.penalty_t1 * Cs.y + lambda_t1_used;
        var f_t2 = c.penalty_t2 * Cs.z + lambda_t2_used;
        if (c.friction > 0.0) {
            let bound = abs(f_n) * c.friction;
            let fScale = sqrt(f_t1 * f_t1 + f_t2 * f_t2);
            if (fScale > bound && fScale > 0.0) {
                let ratio = bound / fScale;
                f_t1 *= ratio;
                f_t2 *= ratio;
            }
        }
        let F = vec3f(f_n, f_t1, f_t2);

        accumulateContact(&lhs, &rhs, jac, F, c.penalty_n, c.penalty_t1, c.penalty_t2);
    }

    for (var nr = 0u; nr < 6u; nr++) { rhs[nr] = -rhs[nr]; }
    let delta = solve6(lhs, rhs);
    let newPos = body.pos + vec3f(delta[0], delta[1], delta[2]);
    let newQuat = quatIntegrate(body.quat, vec3f(delta[3], delta[4], delta[5]));
    let newCumAng = body.cumAng + vec3f(delta[3], delta[4], delta[5]);
    bodies[idx].pos    = newPos;
    bodies[idx].quat   = newQuat;
    bodies[idx].cumAng = newCumAng;
    bodyCols[colIdx(COL_POS, idx)]    = vec4f(newPos, body.radius);
    bodyCols[colIdx(COL_QUAT, idx)]   = newQuat;
    bodyCols[colIdx(COL_CUMANG, idx)] = vec4f(newCumAng, 0.0);
}

@compute @workgroup_size(1)
fn advanceColor(@builtin(global_invocation_id) gid: vec3u) {
    atomicAdd(&solverState[SS_CURRENT_COLOR], 1u);
}

@compute @workgroup_size(1)
fn resetColor(@builtin(global_invocation_id) gid: vec3u) {
    atomicStore(&solverState[SS_CURRENT_COLOR], 0u);
}

`,zc=`
${Nc}
${Lc}

fn colorPriority(id: u32) -> u32 {
    return id * 2654435761u;
}

@compute @workgroup_size(64)
fn clearColorBuffers(@builtin(global_invocation_id) gid: vec3u) {
    let idx = gid.x;
    let L = getLayout();
    if (idx < MAX_COLORS) {
        atomicStore(&solverState[L.csBase + L.colorMetaOffset + idx], 0u);
        atomicStore(&solverState[L.csBase + L.colorMetaOffset + MAX_COLORS + idx], 0u);
    }
    if (idx == 0u) {
        atomicStore(&solverState[L.csBase + L.colorMetaOffset + MAX_COLORS * 2u], 0u);
        atomicStore(&solverState[SS_CURRENT_COLOR], 0u);
    }
    if (idx >= params.bodyCount) { return; }
    atomicStore(&solverState[L.adjOffset + idx * ADJ_STRIDE], 0u);
    atomicStore(&solverState[L.csrHeadsOffset + idx], 0u);
    atomicStore(&solverState[L.csBase + idx], UNCOLORED);
}

@compute @workgroup_size(64)
fn countBodyConstraints(@builtin(global_invocation_id) gid: vec3u) {
    let ci = gid.x;
    if (ci >= atomicLoad(&solverState[SS_CONSTRAINT_COUNT])) { return; }
    let L = getLayout();
    let c = constraints[ci];
    atomicAdd(&solverState[L.csrHeadsOffset + c.bodyA], 1u);
    if (c.bodyB >= 0) {
        let b = u32(c.bodyB);
        if (bodies[b].mass > 0.0) {
            atomicAdd(&solverState[L.csrHeadsOffset + b], 1u);
        }
    }
}

@compute @workgroup_size(64)
fn scatterBodyConstraints(@builtin(global_invocation_id) gid: vec3u) {
    let ci = gid.x;
    if (ci >= atomicLoad(&solverState[SS_CONSTRAINT_COUNT])) { return; }
    let L = getLayout();
    let c = constraints[ci];
    let slotA = atomicAdd(&solverState[L.csrHeadsOffset + c.bodyA], 1u);
    atomicStore(&solverState[L.csrDataOffset + slotA], ci);
    if (c.bodyB >= 0) {
        let b = u32(c.bodyB);
        if (bodies[b].mass > 0.0) {
            let slotB = atomicAdd(&solverState[L.csrHeadsOffset + b], 1u);
            atomicStore(&solverState[L.csrDataOffset + slotB], ci);
        }
    }
}

@compute @workgroup_size(64)
fn buildAdjacencyList(@builtin(global_invocation_id) gid: vec3u) {
    let idx = gid.x;
    if (idx >= params.bodyCount) { return; }
    if (bodies[idx].mass <= 0.0) { return; }
    let L = getLayout();
    let clStart = atomicLoad(&solverState[L.csrOffsetsOffset + idx]);
    let clEnd = atomicLoad(&solverState[L.csrOffsetsOffset + idx + 1u]);
    var degree = 0u;
    for (var k = clStart; k < clEnd; k++) {
        let ci = atomicLoad(&solverState[L.csrDataOffset + k]);
        let c = constraints[ci];
        var neighbor = c.bodyA;
        if (neighbor == idx) {
            if (c.bodyB < 0) { continue; }
            neighbor = u32(c.bodyB);
        }
        if (neighbor == idx) { continue; }
        if (bodies[neighbor].mass <= 0.0) { continue; }
        var dup = false;
        for (var d = 0u; d < degree; d++) {
            if (atomicLoad(&solverState[L.adjOffset + idx * ADJ_STRIDE + 1u + d]) == neighbor) {
                dup = true;
                break;
            }
        }
        if (dup) { continue; }
        if (degree < MAX_DEGREE) {
            atomicStore(&solverState[L.adjOffset + idx * ADJ_STRIDE + 1u + degree], neighbor);
            degree++;
        } else {
            atomicAdd(&solverState[SS_ADJ_OVERFLOW], 1u);
        }
    }

    atomicStore(&solverState[L.adjOffset + idx * ADJ_STRIDE], degree);
}

@compute @workgroup_size(64)
fn graphColor(@builtin(global_invocation_id) gid: vec3u) {
    let idx = gid.x;
    if (idx >= params.bodyCount) { return; }
    let L = getLayout();
    if (bodies[idx].mass <= 0.0) {
        atomicStore(&solverState[L.csBase + idx], KINEMATIC_COLOR);
        return;
    }
    if (atomicLoad(&solverState[L.csBase + idx]) != UNCOLORED) { return; }

    let myPriority = colorPriority(idx);
    let adjCount = min(atomicLoad(&solverState[L.adjOffset + idx * ADJ_STRIDE]), MAX_DEGREE);
    for (var i = 0u; i < adjCount; i++) {
        let neighbor = atomicLoad(&solverState[L.adjOffset + idx * ADJ_STRIDE + 1u + i]);
        if (colorPriority(neighbor) < myPriority && atomicLoad(&solverState[L.csBase + neighbor]) == UNCOLORED) {
            return;
        }
    }

    var usedColors = 0u;
    for (var i = 0u; i < adjCount; i++) {
        let neighbor = atomicLoad(&solverState[L.adjOffset + idx * ADJ_STRIDE + 1u + i]);
        let nc = atomicLoad(&solverState[L.csBase + neighbor]);
        if (nc < MAX_COLORS) {
            usedColors |= (1u << nc);
        }
    }
    atomicStore(&solverState[L.csBase + idx], countTrailingZeros(~usedColors));
}

@compute @workgroup_size(64)
fn countColors(@builtin(global_invocation_id) gid: vec3u) {
    let idx = gid.x;
    if (idx >= params.bodyCount) { return; }
    let L = getLayout();
    let c = atomicLoad(&solverState[L.csBase + idx]);
    if (c < MAX_COLORS) {
        atomicAdd(&solverState[L.csBase + L.colorMetaOffset + c], 1u);
    } else if (bodies[idx].mass > 0.0) {
        atomicAdd(&solverState[SS_UNCOLORED], 1u);
        atomicAdd(&solverState[L.csBase + L.colorMetaOffset + 0u], 1u);
    }
}

@compute @workgroup_size(1)
fn prefixSumColors(@builtin(global_invocation_id) gid: vec3u) {
    let L = getLayout();
    var runningOffset = 0u;
    var usedColors = 0u;
    for (var c = 0u; c < MAX_COLORS; c++) {
        let count = atomicLoad(&solverState[L.csBase + L.colorMetaOffset + c]);
        atomicStore(&solverState[DEBUG_OFFSET + c], count);
        if (count > 0u) { usedColors++; }
        atomicStore(&solverState[L.csBase + L.colorMetaOffset + MAX_COLORS + c], runningOffset);
        atomicStore(&solverState[L.csBase + L.colorMetaOffset + c], runningOffset);
        runningOffset += count;
    }
    atomicStore(&solverState[L.csBase + L.colorMetaOffset + MAX_COLORS * 2u], runningOffset);
    atomicStore(&solverState[SS_USED_COLORS], usedColors);
}

@compute @workgroup_size(64)
fn sortBodiesByColor(@builtin(global_invocation_id) gid: vec3u) {
    let idx = gid.x;
    if (idx >= params.bodyCount) { return; }
    let L = getLayout();
    var c = atomicLoad(&solverState[L.csBase + idx]);
    if (c >= MAX_COLORS && bodies[idx].mass > 0.0) {
        c = 0u;
    }
    if (c < MAX_COLORS) {
        let slot = atomicAdd(&solverState[L.csBase + L.colorMetaOffset + c], 1u);
        atomicStore(&solverState[L.csBase + L.sortedOffset + slot], idx);
    }
}
`,Bc=`
const MAX_COLORS: u32 = 12u;
const DEBUG_OFFSET: u32 = 8u;

@group(0) @binding(0) var<storage> solverState: array<u32>;
@group(0) @binding(1) var<storage, read_write> indirectDispatch: array<u32>;

@compute @workgroup_size(1)
fn main() {
    for (var c = 0u; c < MAX_COLORS; c++) {
        let count = solverState[DEBUG_OFFSET + c];
        let wg = (count + 63u) / 64u;
        indirectDispatch[c * 3u] = wg;
        indirectDispatch[c * 3u + 1u] = 1u;
        indirectDispatch[c * 3u + 2u] = 1u;
    }
    let constraintCount = solverState[0u];
    let constraintWG = (constraintCount + 63u) / 64u;
    indirectDispatch[MAX_COLORS * 3u] = constraintWG;
    indirectDispatch[MAX_COLORS * 3u + 1u] = 1u;
    indirectDispatch[MAX_COLORS * 3u + 2u] = 1u;
    var totalPairs = 0u;
    for (var t = 0u; t < 10u; t++) {
        let typeCount = solverState[${lc}u + t];
        totalPairs += typeCount;
        let typeWG = (typeCount + 63u) / 64u;
        let off = (MAX_COLORS + 1u + t) * 3u;
        indirectDispatch[off] = typeWG;
        indirectDispatch[off + 1u] = 1u;
        indirectDispatch[off + 2u] = 1u;
    }
}
`,Vc=`

${bc}

@group(0) @binding(0) var<storage> bodies: array<Body>;
@group(0) @binding(1) var<storage, read_write> compact: array<f32>;
@group(0) @binding(2) var<uniform> bodyCount: u32;

@compute @workgroup_size(64)
fn readback(@builtin(global_invocation_id) gid: vec3u) {
    let i = gid.x;
    if (i >= bodyCount) { return; }
    let o = i * 7u;
    let pos = bodies[i].pos;
    let quat = bodies[i].quat;
    compact[o]     = pos.x;
    compact[o + 1u] = pos.y;
    compact[o + 2u] = pos.z;
    compact[o + 3u] = quat.x;
    compact[o + 4u] = quat.y;
    compact[o + 5u] = quat.z;
    compact[o + 6u] = quat.w;
}
`,Hc=`

${bc}
${xc}

const SS_CONSTRAINT_COUNT: u32 = 0u;
const SS_CONTACT_COUNT: u32 = ${sc}u;
const SS_CONTACT_OVERFLOW: u32 = ${cc}u;
const MAX_CONTACTS: u32 = 128u;
const CONTACT_STRIDE: u32 = 9u;
const CONTACT_IMPULSE_THRESHOLD: f32 = 0.01;

@group(0) @binding(0) var<storage> bodies: array<Body>;
@group(0) @binding(1) var<storage> constraints: array<GPUConstraint>;
@group(0) @binding(2) var<storage, read_write> solverState: array<atomic<u32>>;
@group(0) @binding(3) var<storage, read_write> contacts: array<u32>;

@compute @workgroup_size(64)
fn emitContacts(@builtin(global_invocation_id) gid: vec3u) {
    let ci = gid.x;
    if (ci >= atomicLoad(&solverState[SS_CONSTRAINT_COUNT])) { return; }

    let c = constraints[ci];
    if (c.bilateral != CONSTRAINT_CONTACT && c.bilateral != CONSTRAINT_KINEMATIC) { return; }
    if (c.isNew == 0u) { return; }
    // lambda_n is negative in AVBD (clamped to [-1e30, 0]); negate for physical impulse
    let impulse = -c.lambda_n;
    if (impulse <= CONTACT_IMPULSE_THRESHOLD) { return; }

    let slot = atomicAdd(&solverState[SS_CONTACT_COUNT], 1u);
    if (slot >= MAX_CONTACTS) {
        atomicAdd(&solverState[SS_CONTACT_OVERFLOW], 1u);
        return;
    }
    let pos = bodies[c.bodyA].pos + c.rAW;
    let base = slot * CONTACT_STRIDE;
    contacts[base + 0u] = c.bodyA;
    contacts[base + 1u] = bitcast<u32>(c.bodyB);
    contacts[base + 2u] = bitcast<u32>(pos.x);
    contacts[base + 3u] = bitcast<u32>(pos.y);
    contacts[base + 4u] = bitcast<u32>(pos.z);
    contacts[base + 5u] = bitcast<u32>(c.normal.x);
    contacts[base + 6u] = bitcast<u32>(c.normal.y);
    contacts[base + 7u] = bitcast<u32>(c.normal.z);
    contacts[base + 8u] = bitcast<u32>(impulse);
}
`,Uc=`

${bc}

const SHAPE_BOX: f32 = 0.0;
const SHAPE_SPHERE: f32 = 1.0;
const SHAPE_CAPSULE: f32 = 2.0;
const SHAPE_HULL: f32 = 3.0;
struct PackParams {
    bodyCount: u32,
    section: u32,
    offset: u32,
}

@group(0) @binding(0) var<storage> sizes: array<f32>;
@group(0) @binding(1) var<storage> shapes: array<u32>;
@group(0) @binding(2) var<storage> bodyProps: array<f32>;
@group(0) @binding(3) var<storage> eids: array<u32>;
@group(0) @binding(4) var<storage, read_write> bodies: array<Body>;
@group(0) @binding(5) var<uniform> packParams: PackParams;
@group(0) @binding(6) var<storage> transform: array<f32>;
@group(0) @binding(7) var<storage> hullIds: array<u32>;

@compute @workgroup_size(64)
fn packBodies(@builtin(global_invocation_id) gid: vec3u) {
    let i = gid.x;
    if (i >= packParams.bodyCount) { return; }

    let eid = eids[i];
    let S = packParams.section;

    let sizeOff = eid * 4u;
    let hx = sizes[sizeOff] / 2.0;
    let hy = sizes[sizeOff + 1u] / 2.0;
    let hz = sizes[sizeOff + 2u] / 2.0;
    let shapeRadius = hx;
    let boundingRadius = length(vec3f(hx, hy, hz));

    let shapeByte = (shapes[eid / 4u] >> ((eid % 4u) * 8u)) & 0xFFu;
    let isSphere = shapeByte == 1u;
    let isCapsule = shapeByte == 2u;
    let isHull = shapeByte == 255u;
    let isBox = !isSphere && !isCapsule && !isHull;

    let propsOff = eid * 4u;
    let m = bodyProps[propsOff];
    let fric = bodyProps[propsOff + 1u];
    let grav = bodyProps[propsOff + 2u];
    let group = u32(bodyProps[propsOff + 3u]);

    var momentX: f32;
    var momentY: f32;
    var momentZ: f32;
    if (isBox || isHull) {
        momentX = (m / 3.0) * (hy * hy + hz * hz);
        momentY = (m / 3.0) * (hx * hx + hz * hz);
        momentZ = (m / 3.0) * (hx * hx + hy * hy);
    } else if (isCapsule) {
        let r = shapeRadius;
        let h = 2.0 * hy;
        let cylVol = h;
        let sphVol = 4.0 * r / 3.0;
        let totalVol = cylVol + sphVol;
        let mCyl = m * cylVol / max(totalVol, 1e-12);
        let mHs = m * sphVol * 0.5 / max(totalVol, 1e-12);
        momentY = 0.5 * mCyl * r * r + 0.8 * mHs * r * r;
        momentX = mCyl * (3.0 * r * r + h * h) / 12.0
                + 2.0 * mHs * (0.4 * r * r + h * h / 4.0 + 0.375 * h * r);
        momentZ = momentX;
    } else {
        let r = shapeRadius;
        let I = (2.0 / 5.0) * m * r * r;
        momentX = I;
        momentY = I;
        momentZ = I;
    }

    var colliderType = SHAPE_BOX;
    if (isSphere) { colliderType = SHAPE_SPHERE; }
    else if (isCapsule) { colliderType = SHAPE_CAPSULE; }
    else if (isHull) { colliderType = SHAPE_HULL; }

    let radius = select(boundingRadius, shapeRadius, isSphere || isCapsule);
    let halfExtents = vec3f(hx, hy, hz);
    let hullId = select(0u, hullIds[i], isHull);

    if (i >= packParams.offset) {
        // New body — full initialization.
        var body: Body;
        body.pos = vec3f(transform[eid], transform[eid + S], transform[eid + S * 2u]);
        body.mass = m;
        body.vel = vec3f(0.0);
        body.momentX = momentX;
        body.angVel = vec3f(0.0);
        body.radius = radius;
        body.inertial = vec3f(0.0);
        body.friction = fric;
        body.initial = vec3f(0.0);
        body.hullId = hullId;
        body.quat = vec4f(
            transform[eid + S * 3u],
            transform[eid + S * 4u],
            transform[eid + S * 5u],
            transform[eid + S * 6u]
        );
        body.inertialQuat = vec4f(0.0, 0.0, 0.0, 1.0);
        body.initialQuat = vec4f(0.0, 0.0, 0.0, 1.0);
        body.prevVel = vec3f(0.0);
        body.momentY = momentY;
        body.prevAngVel = vec3f(0.0);
        body.momentZ = momentZ;
        body.cumAng = vec3f(0.0);
        body.gravity = grav;
        body.halfExtents = halfExtents;
        body.colliderType = colliderType;
        body.collisionGroup = group;
        body.moved = 0.0;
        body._pad50 = 0.0;
        body._pad51 = 0.0;
        bodies[i] = body;
        return;
    }

    // Existing body — refresh shape-derived fields without disturbing dynamic state.
    bodies[i].mass = m;
    bodies[i].momentX = momentX;
    bodies[i].radius = radius;
    bodies[i].friction = fric;
    bodies[i].hullId = hullId;
    bodies[i].momentY = momentY;
    bodies[i].momentZ = momentZ;
    bodies[i].gravity = grav;
    bodies[i].halfExtents = halfExtents;
    bodies[i].colliderType = colliderType;
    bodies[i].collisionGroup = group;
}
`,Wc=`

${xc}

struct RebuildParams {
    prevConstraintCount: u32,
    hashCapacity: u32,
    _pad0: u32,
    _pad1: u32,
}

const HASH_EMPTY: u32 = 0xFFFFFFFFu;
const MAX_PROBE: u32 = 128u;
const PENALTY_MIN: f32 = 1.0;
const PENALTY_MAX: f32 = 1e10;
const FEATURE_KEY_NONE: u32 = 0xFFFFFFFFu;

@group(0) @binding(0) var<storage, read_write> hashKeys: array<atomic<u32>>;
@group(0) @binding(1) var<storage, read_write> warmstarts: array<WarmstartEntry>;
@group(0) @binding(2) var<storage, read> prevConstraints: array<GPUConstraint>;
@group(0) @binding(3) var<uniform> rebuildParams: RebuildParams;

fn defaultWarmstart() -> WarmstartEntry {
    return WarmstartEntry(0.0, PENALTY_MIN, 0.0, PENALTY_MIN, 0.0, PENALTY_MIN, 0u, FEATURE_KEY_NONE, vec3f(0.0), 0.0, vec3f(0.0), 0.0);
}

fn hashKey(k: u32) -> u32 {
    var h = k;
    h ^= h >> 16u;
    h *= 0x85ebca6bu;
    h ^= h >> 13u;
    h *= 0xc2b2ae35u;
    h ^= h >> 16u;
    return h;
}

fn hashInsert(key: u32) -> u32 {
    let hCap = rebuildParams.hashCapacity;
    let mask = hCap - 1u;
    var slot = hashKey(key) & mask;
    for (var p = 0u; p < MAX_PROBE; p++) {
        let idx = (slot + p) & mask;
        let old = atomicCompareExchangeWeak(&hashKeys[idx], HASH_EMPTY, key);
        if (old.exchanged || old.old_value == key) { return idx; }
    }
    return hCap;
}

@compute @workgroup_size(64)
fn clearHash(@builtin(global_invocation_id) gid: vec3u) {
    let idx = gid.x;
    if (idx >= rebuildParams.hashCapacity) { return; }
    atomicStore(&hashKeys[idx], HASH_EMPTY);
    warmstarts[idx] = defaultWarmstart();
}

@compute @workgroup_size(64)
fn rebuildWarm(@builtin(global_invocation_id) gid: vec3u) {
    let ci = gid.x;
    if (ci >= rebuildParams.prevConstraintCount) { return; }

    let c = prevConstraints[ci];
    let slot = hashInsert(c.warmstartIdx);
    if (slot >= rebuildParams.hashCapacity) { return; }

    let ws = WarmstartEntry(
        c.lambda_n, c.penalty_n,
        c.lambda_t1, c.penalty_t1,
        c.lambda_t2, c.penalty_t2,
        c.stick, c.featureKey,
        c.rA, 0.0,
        c.rB, 0.0,
    );
    warmstarts[slot] = ws;
}

`,Gc=`

${bc}

struct SyncParams {
    bodyCount: u32,
    section: u32,
}

@group(0) @binding(0) var<storage, read_write> bodies: array<Body>;
@group(0) @binding(1) var<storage> eids: array<u32>;
@group(0) @binding(2) var<storage> transform: array<f32>;
@group(0) @binding(3) var<uniform> params: SyncParams;

@compute @workgroup_size(64)
fn syncTransforms(@builtin(global_invocation_id) gid: vec3u) {
    let i = gid.x;
    if (i >= params.bodyCount) { return; }
    if (bodies[i].mass > 0.0) { return; }

    let eid = eids[i];
    let S = params.section;
    let newPos = vec3f(
        transform[eid],
        transform[eid + S],
        transform[eid + S * 2u]
    );
    let moveFlag = transform[eid + S * 7u];
    if (moveFlag > 0.5) {
        let diff = newPos - bodies[i].pos;
        bodies[i].moved = select(0.0, 1.0, dot(diff, diff) > 1e-10);
        bodies[i].vel = diff;
    } else {
        bodies[i].moved = 0.0;
        bodies[i].vel = vec3f(0.0);
    }
    bodies[i].pos = newPos;
    bodies[i].quat = vec4f(
        transform[eid + S * 3u],
        transform[eid + S * 4u],
        transform[eid + S * 5u],
        transform[eid + S * 6u]
    );
}
`,Kc=`
struct InterpParams {
    alpha: f32,
    bodyCount: u32,
}

@group(0) @binding(0) var<storage, read> prevBodies: array<f32>;
@group(0) @binding(1) var<storage, read> currentBodies: array<f32>;
@group(0) @binding(2) var<storage, read> bodyEids: array<u32>;
@group(0) @binding(3) var<uniform> params: InterpParams;
@group(0) @binding(4) var<storage, read_write> matrices: array<f32>;

const BODY_STRIDE: u32 = 52u;
const QUAT_OFFSET: u32 = 20u;

fn quatToMat(qx: f32, qy: f32, qz: f32, qw: f32) -> array<f32, 9> {
    let x2 = qx + qx;
    let y2 = qy + qy;
    let z2 = qz + qz;
    let xx = qx * x2;
    let xy = qx * y2;
    let xz = qx * z2;
    let yy = qy * y2;
    let yz = qy * z2;
    let zz = qz * z2;
    let wx = qw * x2;
    let wy = qw * y2;
    let wz = qw * z2;
    return array<f32, 9>(
        1.0 - yy - zz, xy + wz, xz - wy,
        xy - wz, 1.0 - xx - zz, yz + wx,
        xz + wy, yz - wx, 1.0 - xx - yy,
    );
}

@compute @workgroup_size(64)
fn interpolate(@builtin(global_invocation_id) gid: vec3u) {
    let i = gid.x;
    if (i >= params.bodyCount) { return; }

    let alpha = params.alpha;
    let off = i * BODY_STRIDE;

    let px = mix(prevBodies[off], currentBodies[off], alpha);
    let py = mix(prevBodies[off + 1u], currentBodies[off + 1u], alpha);
    let pz = mix(prevBodies[off + 2u], currentBodies[off + 2u], alpha);

    let qOff = off + QUAT_OFFSET;
    let pqx = prevBodies[qOff];
    let pqy = prevBodies[qOff + 1u];
    let pqz = prevBodies[qOff + 2u];
    let pqw = prevBodies[qOff + 3u];
    let cqx = currentBodies[qOff];
    let cqy = currentBodies[qOff + 1u];
    let cqz = currentBodies[qOff + 2u];
    let cqw = currentBodies[qOff + 3u];
    let qdot = pqx * cqx + pqy * cqy + pqz * cqz + pqw * cqw;
    let flip = select(1.0, -1.0, qdot < 0.0);
    var qx = mix(pqx * flip, cqx, alpha);
    var qy = mix(pqy * flip, cqy, alpha);
    var qz = mix(pqz * flip, cqz, alpha);
    var qw = mix(pqw * flip, cqw, alpha);

    let qLen = sqrt(qx * qx + qy * qy + qz * qz + qw * qw);
    if (qLen > 1e-12) {
        let invLen = 1.0 / qLen;
        qx *= invLen;
        qy *= invLen;
        qz *= invLen;
        qw *= invLen;
    } else {
        qx = 0.0;
        qy = 0.0;
        qz = 0.0;
        qw = 1.0;
    }

    let rot = quatToMat(qx, qy, qz, qw);

    let eid = bodyEids[i];
    let mOff = eid * 16u;
    matrices[mOff]      = rot[0];
    matrices[mOff + 1u] = rot[1];
    matrices[mOff + 2u] = rot[2];
    matrices[mOff + 3u] = 0.0;
    matrices[mOff + 4u] = rot[3];
    matrices[mOff + 5u] = rot[4];
    matrices[mOff + 6u] = rot[5];
    matrices[mOff + 7u] = 0.0;
    matrices[mOff + 8u] = rot[6];
    matrices[mOff + 9u] = rot[7];
    matrices[mOff + 10u] = rot[8];
    matrices[mOff + 11u] = 0.0;
    matrices[mOff + 12u] = px;
    matrices[mOff + 13u] = py;
    matrices[mOff + 14u] = pz;
    matrices[mOff + 15u] = 1.0;
}
`,qc=`
struct CharacterData {
    maxSlope: f32,
    grounded: u32,
    moveX: f32,
    moveY: f32,
    moveZ: f32,
    mass: f32,
    _pad1: f32,
    _pad2: f32,
}

struct CharacterParams {
    count: u32,
}
`,Jc=`
${bc}
${qc}

struct TreeNode {
    minX: f32,
    minY: f32,
    minZ: f32,
    leftChild: u32,
    maxX: f32,
    maxY: f32,
    maxZ: f32,
    rightChild: u32,
}

struct LeafAABB {
    minX: f32, minY: f32, minZ: f32, _pad0: u32,
    maxX: f32, maxY: f32, maxZ: f32, _pad1: u32,
}

const LEAF_FLAG: u32 = 0x80000000u;
const SHAPE_BOX: f32 = 0.0;
const SHAPE_SPHERE: f32 = 1.0;
const SHAPE_CAPSULE: f32 = 2.0;
const COLLISION_MARGIN: f32 = 0.01;
const MAX_SWEEP_ITERS: u32 = 4u;
const MAX_NEARBY: u32 = 32u;
const GATHER_EXPAND: f32 = 0.1;

@group(0) @binding(0) var<storage, read_write> bodies: array<Body>;
@group(0) @binding(1) var<storage, read> treeNodes: array<TreeNode>;
@group(0) @binding(2) var<storage, read> sortedBodyIds: array<u32>;
@group(0) @binding(3) var<storage, read> leafAABBs: array<LeafAABB>;
@group(0) @binding(4) var<storage, read_write> charData: array<CharacterData>;
@group(0) @binding(5) var<storage, read> charIndices: array<u32>;
@group(0) @binding(6) var<uniform> charParams: CharacterParams;
@group(0) @binding(7) var<storage, read_write> charGroundIdx: array<u32>;

fn quatRotate(q: vec4f, v: vec3f) -> vec3f {
    let u = q.xyz;
    let t = 2.0 * cross(u, v);
    return v + q.w * t + cross(u, t);
}

fn quatConj(q: vec4f) -> vec4f {
    return vec4f(-q.x, -q.y, -q.z, q.w);
}

fn aabbOverlap(minA: vec3f, maxA: vec3f, minB: vec3f, maxB: vec3f) -> bool {
    return minA.x <= maxB.x && maxA.x >= minB.x
        && minA.y <= maxB.y && maxA.y >= minB.y
        && minA.z <= maxB.z && maxA.z >= minB.z;
}

struct Contact {
    normal: vec3f,
    depth: f32,
}

fn closestPointOnSegment(p: vec3f, a: vec3f, b: vec3f) -> vec3f {
    let ab = b - a;
    let ab2 = dot(ab, ab);
    if (ab2 < 1e-12) { return a; }
    let t = clamp(dot(p - a, ab) / ab2, 0.0, 1.0);
    return a + ab * t;
}

fn satAxis(charPos: vec3f, charH: vec3f, boxPos: vec3f, bx: vec3f, by: vec3f, bz: vec3f, boxH: vec3f, axis: vec3f) -> f32 {
    let projC = abs(axis.x) * charH.x + abs(axis.y) * charH.y + abs(axis.z) * charH.z;
    let projB = abs(dot(bx, axis)) * boxH.x + abs(dot(by, axis)) * boxH.y + abs(dot(bz, axis)) * boxH.z;
    let dist = abs(dot(boxPos - charPos, axis));
    return projC + projB - dist;
}

fn aabbVsOBB(charPos: vec3f, charH: vec3f, other: Body) -> Contact {
    let d = other.pos - charPos;
    let bx = quatRotate(other.quat, vec3f(1.0, 0.0, 0.0));
    let by = quatRotate(other.quat, vec3f(0.0, 1.0, 0.0));
    let bz = quatRotate(other.quat, vec3f(0.0, 0.0, 1.0));
    let bh = other.halfExtents;

    var bestDepth = 1e30;
    var bestNormal = vec3f(0.0);

    let axes = array<vec3f, 6>(
        vec3f(1.0, 0.0, 0.0), vec3f(0.0, 1.0, 0.0), vec3f(0.0, 0.0, 1.0),
        bx, by, bz,
    );

    for (var i = 0u; i < 6u; i++) {
        let axis = axes[i];
        let overlap = satAxis(charPos, charH, other.pos, bx, by, bz, bh, axis);
        if (overlap <= 0.0) { return Contact(vec3f(0.0), 0.0); }
        if (overlap < bestDepth) {
            bestDepth = overlap;
            bestNormal = select(-axis, axis, dot(d, axis) < 0.0);
        }
    }

    return Contact(bestNormal, bestDepth);
}

fn aabbVsSphere(charPos: vec3f, charH: vec3f, other: Body) -> Contact {
    let sphR = other.halfExtents.x;
    let d = other.pos - charPos;
    let closest = clamp(d, -charH, charH);
    let diff = d - closest;
    let dist2 = dot(diff, diff);

    if (dist2 > (sphR + COLLISION_MARGIN) * (sphR + COLLISION_MARGIN) && dist2 > 1e-16) {
        return Contact(vec3f(0.0), 0.0);
    }

    let absD = abs(d);
    let inside = absD.x <= charH.x && absD.y <= charH.y && absD.z <= charH.z;

    if (!inside && dist2 > 1e-16) {
        let dist = sqrt(dist2);
        let gap = dist - sphR;
        if (gap > COLLISION_MARGIN) { return Contact(vec3f(0.0), 0.0); }
        let normal = -diff / dist;
        return Contact(normal, sphR - dist);
    }

    let face = charH - absD;
    var minAxis = 0u;
    var minVal = face.x;
    if (face.y < minVal) { minAxis = 1u; minVal = face.y; }
    if (face.z < minVal) { minAxis = 2u; minVal = face.z; }
    var normal = vec3f(0.0);
    if (minAxis == 0u) {
        normal.x = select(1.0, -1.0, d.x >= 0.0);
    } else if (minAxis == 1u) {
        normal.y = select(1.0, -1.0, d.y >= 0.0);
    } else {
        normal.z = select(1.0, -1.0, d.z >= 0.0);
    }
    return Contact(normal, minVal + sphR);
}

fn aabbVsCapsule(charPos: vec3f, charH: vec3f, other: Body) -> Contact {
    let capAxis = quatRotate(other.quat, vec3f(0.0, other.halfExtents.y, 0.0));
    let capR = other.halfExtents.x;
    let epA = other.pos + capAxis;
    let epB = other.pos - capAxis;

    let closest = closestPointOnSegment(charPos, epA, epB);
    let d = closest - charPos;
    let clamped = clamp(d, -charH, charH);
    let diff = d - clamped;
    let dist2 = dot(diff, diff);

    let absD = abs(d);
    let inside = absD.x <= charH.x && absD.y <= charH.y && absD.z <= charH.z;

    if (!inside && dist2 > 1e-16) {
        let dist = sqrt(dist2);
        if (dist - capR > COLLISION_MARGIN) { return Contact(vec3f(0.0), 0.0); }
        let normal = -diff / dist;
        return Contact(normal, capR - dist);
    }

    let face = charH - absD;
    var minAxis = 0u;
    var minVal = face.x;
    if (face.y < minVal) { minAxis = 1u; minVal = face.y; }
    if (face.z < minVal) { minAxis = 2u; minVal = face.z; }
    var normal = vec3f(0.0);
    if (minAxis == 0u) {
        normal.x = select(1.0, -1.0, d.x >= 0.0);
    } else if (minAxis == 1u) {
        normal.y = select(1.0, -1.0, d.y >= 0.0);
    } else {
        normal.z = select(1.0, -1.0, d.z >= 0.0);
    }
    return Contact(normal, minVal + capR);
}


fn testBody(charPos: vec3f, charH: vec3f, other: Body) -> Contact {
    if (other.colliderType == SHAPE_BOX) {
        return aabbVsOBB(charPos, charH, other);
    }
    if (other.colliderType == SHAPE_SPHERE) {
        return aabbVsSphere(charPos, charH, other);
    }
    if (other.colliderType == SHAPE_CAPSULE) {
        return aabbVsCapsule(charPos, charH, other);
    }
    return Contact(vec3f(0.0), 0.0);
}

@compute @workgroup_size(64)
fn characterSweep(@builtin(global_invocation_id) gid: vec3u) {
    let charIdx = gid.x;
    if (charIdx >= charParams.count) { return; }

    let bodyIdx = charIndices[charIdx];
    let body = bodies[bodyIdx];
    let cd = charData[charIdx];
    var pos = body.pos;
    let charH = body.halfExtents;
    let maxSlopeCos = cd.maxSlope;

    var nearby: array<u32, 32>;
    var nearbyCount: u32 = 0u;

    let gatherMargin = vec3f(COLLISION_MARGIN + GATHER_EXPAND);
    let gatherMin = pos - charH - gatherMargin;
    let gatherMax = pos + charH + gatherMargin;

    var stack: array<u32, 64>;
    var stackPtr: u32 = 0u;
    let root = treeNodes[0];

    for (var side = 0u; side < 2u; side++) {
        let child = select(root.rightChild, root.leftChild, side == 0u);
        if ((child & LEAF_FLAG) != 0u) {
            let oi = sortedBodyIds[child & ~LEAF_FLAG];
            if (oi != bodyIdx) {
                let la = leafAABBs[oi];
                if (aabbOverlap(gatherMin, gatherMax, vec3f(la.minX, la.minY, la.minZ), vec3f(la.maxX, la.maxY, la.maxZ))) {
                    if (nearbyCount < MAX_NEARBY) { nearby[nearbyCount] = oi; nearbyCount += 1u; }
                }
            }
        } else {
            let n = treeNodes[child];
            if (aabbOverlap(gatherMin, gatherMax, vec3f(n.minX, n.minY, n.minZ), vec3f(n.maxX, n.maxY, n.maxZ))) {
                stack[stackPtr] = child;
                stackPtr += 1u;
            }
        }
    }

    while (stackPtr > 0u) {
        stackPtr -= 1u;
        let node = treeNodes[stack[stackPtr]];

        for (var side = 0u; side < 2u; side++) {
            let child = select(node.rightChild, node.leftChild, side == 0u);
            if ((child & LEAF_FLAG) != 0u) {
                let oi = sortedBodyIds[child & ~LEAF_FLAG];
                if (oi != bodyIdx) {
                    let la = leafAABBs[oi];
                    if (aabbOverlap(gatherMin, gatherMax, vec3f(la.minX, la.minY, la.minZ), vec3f(la.maxX, la.maxY, la.maxZ))) {
                        if (nearbyCount < MAX_NEARBY) { nearby[nearbyCount] = oi; nearbyCount += 1u; }
                    }
                }
            } else {
                let n = treeNodes[child];
                if (aabbOverlap(gatherMin, gatherMax, vec3f(n.minX, n.minY, n.minZ), vec3f(n.maxX, n.maxY, n.maxZ))) {
                    if (stackPtr < 64u) { stack[stackPtr] = child; stackPtr += 1u; }
                }
            }
        }
    }

    var grounded = false;
    var groundBodyIdx = 0xFFFFFFFFu;

    for (var iter = 0u; iter < MAX_SWEEP_ITERS; iter++) {
        var bestNormal = vec3f(0.0);
        var bestDepth: f32 = 0.0;

        for (var ni = 0u; ni < nearbyCount; ni++) {
            let oi = nearby[ni];
            let c = testBody(pos, charH, bodies[oi]);
            if (c.depth > bestDepth) { bestDepth = c.depth; bestNormal = c.normal; }
            if (c.depth > 0.0 && c.normal.y > maxSlopeCos) { grounded = true; groundBodyIdx = oi; }
        }

        if (bestDepth <= 0.0) { break; }
        pos += bestNormal * bestDepth;
    }

    bodies[bodyIdx].pos = pos;
    charData[charIdx].grounded = select(0u, 1u, grounded);
    charGroundIdx[charIdx] = groundBodyIdx;
}
`,Yc=`
${bc}
${qc}

@group(0) @binding(0) var<storage, read_write> bodies: array<Body>;
@group(0) @binding(4) var<storage, read_write> charData: array<CharacterData>;
@group(0) @binding(5) var<storage, read> charIndices: array<u32>;
@group(0) @binding(6) var<uniform> charParams: CharacterParams;
@group(0) @binding(7) var<storage, read_write> charGroundIdx: array<u32>;

@compute @workgroup_size(64)
fn characterApply(@builtin(global_invocation_id) gid: vec3u) {
    let charIdx = gid.x;
    if (charIdx >= charParams.count) { return; }
    let bodyIdx = charIndices[charIdx];
    let cd = charData[charIdx];
    var charMove = vec3f(cd.moveX, cd.moveY, cd.moveZ);
    let groundIdx = charGroundIdx[charIdx];
    if (groundIdx != 0xFFFFFFFFu && bodies[groundIdx].mass <= 0.0) {
        charMove += bodies[groundIdx].vel;
    }
    bodies[bodyIdx].pos += charMove;
    bodies[bodyIdx].vel = charMove;
    if (dot(charMove, charMove) > 1e-10) {
        bodies[bodyIdx].moved = 1.0;
    }
}
`,Xc=`
${Sc}
${Ec}

@group(1) @binding(0) var<storage, read_write> pairs: array<u32>;

fn isJointed(a: u32, b: u32) -> bool {
    for (var ji = 0u; ji < params.jointCount; ji++) {
        let j = joints[ji];
        if ((j.bodyA == a && j.bodyB == b) || (j.bodyA == b && j.bodyB == a)) {
            return true;
        }
    }
    return false;
}

fn aabbOverlap(minA: vec3f, maxA: vec3f, minB: vec3f, maxB: vec3f) -> bool {
    return minA.x <= maxB.x && maxA.x >= minB.x
        && minA.y <= maxB.y && maxA.y >= minB.y
        && minA.z <= maxB.z && maxA.z >= minB.z;
}

const PAIR_TYPE_LUT = array<u32, 16>(
    0u, 1u, 2u, 6u,
    0u, 3u, 4u, 7u,
    0u, 0u, 5u, 8u,
    0u, 0u, 0u, 9u,
);

fn emitPair(a: u32, b: u32) {
    let itA = u32(bodies[a].colliderType);
    let itB = u32(bodies[b].colliderType);
    let lo = min(itA, itB);
    let hi = max(itA, itB);
    let pairType = PAIR_TYPE_LUT[lo * 4u + hi];

    var first: u32;
    var second: u32;
    if (lo == hi) {
        first = min(a, b);
        second = max(a, b);
    } else if (itA > itB) {
        first = a;
        second = b;
    } else {
        first = b;
        second = a;
    }

    let maxPerType = params.capacity * params.constraintMul;
    let pi = atomicAdd(&solverState[SS_PAIR_TYPE_BASE + pairType], 1u);
    if (pi >= maxPerType) { return; }
    let base = pairType * maxPerType;
    pairs[(base + pi) * 2u] = first;
    pairs[(base + pi) * 2u + 1u] = second;
}

fn testBinaryChild(
    child: u32,
    myMin: vec3f, myMax: vec3f,
    idx: u32,
    stack: ptr<function, array<u32, 64>>,
    stackPtr: ptr<function, u32>,
) {
    if ((child & LEAF_FLAG) != 0u) {
        let leafIdx = child & ~LEAF_FLAG;
        let otherIdx = sortedBodyIds[leafIdx];
        if (otherIdx == idx) { return; }
        if (bodies[otherIdx].mass > 0.0 && idx >= otherIdx) { return; }
        let la = leafAABBs[otherIdx];
        if (aabbOverlap(myMin, myMax, vec3f(la.minX, la.minY, la.minZ), vec3f(la.maxX, la.maxY, la.maxZ))) {
            if (isJointed(idx, otherIdx)) { return; }
            let groupA = bodies[idx].collisionGroup;
            let groupB = bodies[otherIdx].collisionGroup;
            if (groupA != 0u && groupA == groupB) { return; }
            emitPair(idx, otherIdx);
        }
    } else {
        let node = treeNodes[child];
        let nodeMin = vec3f(node.minX, node.minY, node.minZ);
        let nodeMax = vec3f(node.maxX, node.maxY, node.maxZ);
        if (aabbOverlap(myMin, myMax, nodeMin, nodeMax)) {
            if (*stackPtr < 64u) {
                (*stack)[*stackPtr] = child;
                *stackPtr += 1u;
            } else {
                atomicAdd(&solverState[SS_STACK_OVERFLOW], 1u);
            }
        }
    }
}

@compute @workgroup_size(64)
fn broadphase(@builtin(global_invocation_id) gid: vec3u) {
    if (gid.x >= params.bodyCount) { return; }

    let idx = sortedBodyIds[gid.x];
    if (bodies[idx].mass <= 0.0) { return; }

    let la = leafAABBs[idx];
    let myMin = vec3f(la.minX, la.minY, la.minZ);
    let myMax = vec3f(la.maxX, la.maxY, la.maxZ);

    if (idx == 0u) {
        let root = treeNodes[0];
        atomicStore(&solverState[DEBUG_BROADPHASE + 0u], 0xBEEFu);
        atomicStore(&solverState[DEBUG_BROADPHASE + 1u], params.bodyCount);
        atomicStore(&solverState[DEBUG_BROADPHASE + 2u], bitcast<u32>(root.minX));
        atomicStore(&solverState[DEBUG_BROADPHASE + 3u], bitcast<u32>(root.minY));
        atomicStore(&solverState[DEBUG_BROADPHASE + 4u], bitcast<u32>(root.minZ));
        atomicStore(&solverState[DEBUG_BROADPHASE + 5u], bitcast<u32>(root.maxX));
        atomicStore(&solverState[DEBUG_BROADPHASE + 6u], bitcast<u32>(root.maxY));
        atomicStore(&solverState[DEBUG_BROADPHASE + 7u], bitcast<u32>(root.maxZ));
        atomicStore(&solverState[DEBUG_BROADPHASE + 8u], root.leftChild);
        atomicStore(&solverState[DEBUG_BROADPHASE + 9u], root.rightChild);
    }

    var stack: array<u32, 64>;
    var stackPtr: u32 = 0u;

    let root = treeNodes[0];
    testBinaryChild(root.leftChild, myMin, myMax, idx, &stack, &stackPtr);
    testBinaryChild(root.rightChild, myMin, myMax, idx, &stack, &stackPtr);

    while (stackPtr > 0u) {
        stackPtr -= 1u;
        let nodeIdx = stack[stackPtr];
        let node = treeNodes[nodeIdx];
        testBinaryChild(node.leftChild, myMin, myMax, idx, &stack, &stackPtr);
        testBinaryChild(node.rightChild, myMin, myMax, idx, &stack, &stackPtr);
    }
}
`,Zc=`
${Sc}
${Tc}
${Pc}
${Ic}

fn quatConj(q: vec4f) -> vec4f {
    return vec4f(-q.x, -q.y, -q.z, q.w);
}

fn contactCInit(posA: vec3f, rA: vec3f, posB: vec3f, rB: vec3f, n: vec3f, t1: vec3f, t2: vec3f) -> vec3f {
    let cpSep = (posA + rA) - (posB + rB);
    return vec3f(
        dot(n, cpSep) + COLLISION_MARGIN,
        dot(t1, cpSep),
        dot(t2, cpSep),
    );
}

@group(1) @binding(0) var<storage, read_write> pairs: array<u32>;

fn loadWarmstartSearchingHash(bodyA: u32, bodyB: u32, featureKey: u32) -> WarmstartEntry {
    let hCap = params.capacity * params.hashMul;
    for (var s = 0u; s < MAX_PAIR_CONTACTS; s++) {
        let key = packKey(bodyA, bodyB, s);
        let idx = hashLookup(key);
        if (idx < hCap) {
            let ws = warmstarts[idx];
            if (ws.featureKey == featureKey) {
                if (isNanOrInf(ws.lambda_n) || isNanOrInf(ws.penalty_n) ||
                    isNanOrInf(ws.lambda_t1) || isNanOrInf(ws.penalty_t1) ||
                    isNanOrInf(ws.lambda_t2) || isNanOrInf(ws.penalty_t2)) {
                    atomicAdd(&solverState[SS_WARMSTART_NAN], 1u);
                    return defaultWarmstart();
                }
                if (ws.penalty_n > PENALTY_MIN) {
                    atomicAdd(&solverState[SS_WARMSTART_LOADED], 1u);
                }
                return ws;
            }
        }
    }
    return defaultWarmstart();
}

fn resetWarmstartHash(key: u32) {
    let hCap = params.capacity * params.hashMul;
    let idx = hashLookup(key);
    if (idx < hCap) {
        atomicStore(&solverState[HASH_BASE + idx], HASH_EMPTY);
        warmstarts[idx] = defaultWarmstart();
    }
}

fn pushConstraintSearching(
    bodyA: u32, bodyB: i32, featureKey: u32,
    normal: vec3f, C_init_n: f32,
    tangent1: vec3f, C_init_t1: f32,
    tangent2: vec3f, C_init_t2: f32,
    rA: vec3f, rB: vec3f,
    friction: f32,
    wsKey: u32, wsBodyA: u32, wsBodyB: u32, bilateral: u32,
    fmin_n: f32, fmax_n: f32, cStiffness: f32,
) {
    var bi = bilateral;
    var ct1 = C_init_t1;
    var ct2 = C_init_t2;
    if (bi == CONSTRAINT_CONTACT) {
        let movedA = bodies[bodyA].mass <= 0.0 && bodies[bodyA].moved > 0.5;
        let movedB = bodies[u32(bodyB)].mass <= 0.0 && bodies[u32(bodyB)].moved > 0.5;
        if (movedA || movedB) {
            bi = CONSTRAINT_KINEMATIC;
            if (movedA) {
                ct1 += dot(tangent1, bodies[bodyA].vel);
                ct2 += dot(tangent2, bodies[bodyA].vel);
            }
            if (movedB) {
                ct1 -= dot(tangent1, bodies[u32(bodyB)].vel);
                ct2 -= dot(tangent2, bodies[u32(bodyB)].vel);
            }
        }
    }
    let ws = loadWarmstartSearchingHash(wsBodyA, wsBodyB, featureKey);
    pushConstraintWithWarmstart(bodyA, bodyB, featureKey, normal, C_init_n, tangent1, ct1, tangent2, ct2, rA, rB, friction, wsKey, bi, fmin_n, fmax_n, cStiffness, ws);
}

`,Qc=`
fn emitSingleContact(
    ai: u32, bi: u32,
    normal: vec3f, rA_w: vec3f, rB_w: vec3f,
    posA: vec3f, quatA: vec4f, posB: vec3f, quatB: vec4f,
    fricA: f32, fricB: f32, fkey: u32,
) {
    let lo = min(ai, bi);
    let hi = max(ai, bi);
    let aIsLo = ai < bi;

    let n = select(-normal, normal, aIsLo);
    let tb = tangentBasis(n);
    let mu = sqrt(fricA * fricB);

    let rAl = quatRotate(quatConj(quatA), rA_w);
    let rBl = quatRotate(quatConj(quatB), rB_w);

    let posLo = select(posB, posA, aIsLo);
    let posHi = select(posA, posB, aIsLo);
    let rLo_local = select(rBl, rAl, aIsLo);
    let rHi_local = select(rAl, rBl, aIsLo);
    let rLo_w = select(rB_w, rA_w, aIsLo);
    let rHi_w = select(rA_w, rB_w, aIsLo);

    let ci = contactCInit(posLo, rLo_w, posHi, rHi_w, n, tb[0], tb[1]);

    let wsKey = packKey(lo, hi, 0u);
    pushConstraintSearching(
        lo, i32(hi), fkey,
        n, ci.x,
        tb[0], ci.y,
        tb[1], ci.z,
        rLo_local, rHi_local,
        mu,
        wsKey, lo, hi, 0u,
        -1e30, 0.0, 1e30,
    );
    for (var s = 1u; s < MAX_PAIR_CONTACTS; s++) {
        resetWarmstartHash(packKey(lo, hi, s));
    }
}
`,$c=`
const MAX_CANDIDATES: u32 = 32u;

struct ManifoldCandidate {
    pointA: vec3f,
    pointB: vec3f,
    depth: f32,
    clipTag: u32,
}

fn reduceManifold(
    candidates: ptr<function, array<ManifoldCandidate, MAX_CANDIDATES>>,
    count: u32,
    normal: vec3f,
    out: ptr<function, array<u32, 4>>,
) -> u32 {
    if (count <= 4u) {
        for (var i = 0u; i < count; i++) { (*out)[i] = i; }
        return count;
    }

    var cx = 0.0; var cy = 0.0; var cz = 0.0;
    for (var i = 0u; i < MAX_CANDIDATES; i++) {
        if (i >= count) { break; }
        cx += (*candidates)[i].pointB.x;
        cy += (*candidates)[i].pointB.y;
        cz += (*candidates)[i].pointB.z;
    }
    let fc = 1.0 / f32(count);
    let center = vec3f(cx * fc, cy * fc, cz * fc);

    let p0rel = (*candidates)[0].pointB - center;
    let p0len = length(p0rel);
    var t0 = select(vec3f(1.0, 0.0, 0.0), p0rel / p0len, p0len > 1e-12);
    let u = normalize(cross(normal, t0));
    let v = cross(normal, u);

    var sel: array<u32, 4> = array(0u, 0u, 0u, 0u);
    var bestProj: array<f32, 4> = array(-1e30, -1e30, -1e30, -1e30);
    for (var i = 0u; i < MAX_CANDIDATES; i++) {
        if (i >= count) { break; }
        let rel = (*candidates)[i].pointB - center;
        let pu = dot(rel, u);
        let pv = dot(rel, v);
        if (pu > bestProj[0]) { bestProj[0] = pu; sel[0] = i; }
        if (-pu > bestProj[1]) { bestProj[1] = -pu; sel[1] = i; }
        if (pv > bestProj[2]) { bestProj[2] = pv; sel[2] = i; }
        if (-pv > bestProj[3]) { bestProj[3] = -pv; sel[3] = i; }
    }

    var unique: array<u32, 4>;
    var uCount = 0u;
    for (var i = 0u; i < 4u; i++) {
        var dup = false;
        for (var j = 0u; j < uCount; j++) {
            if (unique[j] == sel[i]) { dup = true; break; }
        }
        if (!dup) { unique[uCount] = sel[i]; uCount++; }
    }

    var deepIdx = 0u;
    var deepVal = (*candidates)[0].depth;
    for (var i = 1u; i < MAX_CANDIDATES; i++) {
        if (i >= count) { break; }
        if ((*candidates)[i].depth < deepVal) {
            deepVal = (*candidates)[i].depth;
            deepIdx = i;
        }
    }

    var hasDeep = false;
    for (var i = 0u; i < uCount; i++) {
        if (unique[i] == deepIdx) { hasDeep = true; break; }
    }
    if (!hasDeep) {
        if (uCount < 4u) {
            unique[uCount] = deepIdx;
            uCount++;
        } else {
            var shallowest = 0u;
            var shallowestVal = (*candidates)[unique[0]].depth;
            for (var i = 1u; i < uCount; i++) {
                if ((*candidates)[unique[i]].depth > shallowestVal) {
                    shallowestVal = (*candidates)[unique[i]].depth;
                    shallowest = i;
                }
            }
            unique[shallowest] = deepIdx;
        }
    }

    for (var i = 0u; i < uCount; i++) { (*out)[i] = unique[i]; }
    return uCount;
}
`,el=`
${$c}

fn supportPointBox(pos: vec3f, ax0: vec3f, ax1: vec3f, ax2: vec3f, half: vec3f, dir: vec3f) -> vec3f {
    return pos
        + ax0 * select(-half.x, half.x, dot(dir, ax0) >= 0.0)
        + ax1 * select(-half.y, half.y, dot(dir, ax1) >= 0.0)
        + ax2 * select(-half.z, half.z, dot(dir, ax2) >= 0.0);
}

fn detectBoxBox(ci: u32, cj: u32) {
    let bA = bodies[ci];
    let bB = bodies[cj];
    let hA = bA.halfExtents;
    let hB = bB.halfExtents;
    let posA = bA.pos;
    let posB = bB.pos;
    let qA = bA.quat;
    let qB = bB.quat;

    let axA0 = quatRotate(qA, vec3f(1, 0, 0));
    let axA1 = quatRotate(qA, vec3f(0, 1, 0));
    let axA2 = quatRotate(qA, vec3f(0, 0, 1));
    let axB0 = quatRotate(qB, vec3f(1, 0, 0));
    let axB1 = quatRotate(qB, vec3f(0, 1, 0));
    let axB2 = quatRotate(qB, vec3f(0, 0, 1));

    let d = posB - posA;

    var minFacePen = 1e30;
    var bestFaceAxis = vec3f(0.0, 1.0, 0.0);
    var minEdgePen = 1e30;
    var bestEdgeAxis = vec3f(0.0, 1.0, 0.0);
    var separated = false;
    var bestEdgeA = vec3f(0.0);
    var bestEdgeB = vec3f(0.0);
    var bestEdgeIdxA = 0u;
    var bestEdgeIdxB = 0u;

    let faceAxes = array<vec3f, 6>(axA0, axA1, axA2, axB0, axB1, axB2);

    for (var a = 0u; a < 6u; a++) {
        let axis = faceAxes[a];
        let projA = abs(dot(axA0, axis)) * hA.x + abs(dot(axA1, axis)) * hA.y + abs(dot(axA2, axis)) * hA.z;
        let projB = abs(dot(axB0, axis)) * hB.x + abs(dot(axB1, axis)) * hB.y + abs(dot(axB2, axis)) * hB.z;
        let dist_ax = abs(dot(d, axis));
        let pen = projA + projB - dist_ax;
        if (pen < 0.0) { separated = true; break; }
        if (pen < minFacePen) {
            minFacePen = pen;
            bestFaceAxis = axis;
            if (dot(d, axis) < 0.0) { bestFaceAxis = -axis; }
        }
    }

    if (!separated) {
        let edgesA = array<vec3f, 3>(axA0, axA1, axA2);
        let edgesB = array<vec3f, 3>(axB0, axB1, axB2);

        for (var ea = 0u; ea < 3u; ea++) {
            for (var eb = 0u; eb < 3u; eb++) {
                var axis = cross(edgesA[ea], edgesB[eb]);
                let axLen = length(axis);
                if (axLen < 1e-6) { continue; }
                axis /= axLen;

                let projA = abs(dot(axA0, axis)) * hA.x + abs(dot(axA1, axis)) * hA.y + abs(dot(axA2, axis)) * hA.z;
                let projB = abs(dot(axB0, axis)) * hB.x + abs(dot(axB1, axis)) * hB.y + abs(dot(axB2, axis)) * hB.z;
                let dist_ax = abs(dot(d, axis));
                let pen = projA + projB - dist_ax;
                if (pen < 0.0) { separated = true; break; }
                if (pen < minEdgePen) {
                    minEdgePen = pen;
                    bestEdgeAxis = axis;
                    if (dot(d, axis) < 0.0) { bestEdgeAxis = -axis; }
                    bestEdgeA = edgesA[ea];
                    bestEdgeB = edgesB[eb];
                    bestEdgeIdxA = ea;
                    bestEdgeIdxB = eb;
                }
            }
            if (separated) { break; }
        }
    }

    var bestIsFace = true;
    var bestAxis = bestFaceAxis;
    if (!separated && minFacePen < 1e30 && minEdgePen < minFacePen * 0.95 - 0.01) {
        bestIsFace = false;
        bestAxis = bestEdgeAxis;
    }

    if (separated) {
        return;
    }

    var candidates: array<ManifoldCandidate, MAX_CANDIDATES>;
    var candCount = 0u;
    let satNormal = bestAxis;
    let n = bestAxis;

    var faceRefIsA = false;
    var refFaceIdx = 0u;
    var incFaceIdx = 0u;

    if (bestIsFace) {
        let nDotA0 = abs(dot(n, axA0));
        let nDotA1 = abs(dot(n, axA1));
        let nDotA2 = abs(dot(n, axA2));
        let nDotB0 = abs(dot(n, axB0));
        let nDotB1 = abs(dot(n, axB1));
        let nDotB2 = abs(dot(n, axB2));

        var maxDotA = nDotA0;
        if (nDotA1 > maxDotA) { maxDotA = nDotA1; }
        if (nDotA2 > maxDotA) { maxDotA = nDotA2; }
        var maxDotB = nDotB0;
        if (nDotB1 > maxDotB) { maxDotB = nDotB1; }
        if (nDotB2 > maxDotB) { maxDotB = nDotB2; }
        let refIsA = maxDotA >= maxDotB;

        var incVerts: array<vec3f, 4>;
        var refCenter: vec3f;
        var refNormal: vec3f;
        var refTangent1: vec3f;
        var refTangent2: vec3f;
        var refHalf1: f32;
        var refHalf2: f32;

        if (refIsA) {
            faceRefIsA = true;
            refNormal = n;
            if (nDotA0 >= nDotA1 && nDotA0 >= nDotA2) {
                let s = sign(dot(n, axA0));
                refCenter = posA + axA0 * s * hA.x;
                refTangent1 = axA1; refHalf1 = hA.y;
                refTangent2 = axA2; refHalf2 = hA.z;
                refFaceIdx = select(0u, 1u, s > 0.0);
            } else if (nDotA1 >= nDotA2) {
                let s = sign(dot(n, axA1));
                refCenter = posA + axA1 * s * hA.y;
                refTangent1 = axA0; refHalf1 = hA.x;
                refTangent2 = axA2; refHalf2 = hA.z;
                refFaceIdx = 2u + select(0u, 1u, s > 0.0);
            } else {
                let s = sign(dot(n, axA2));
                refCenter = posA + axA2 * s * hA.z;
                refTangent1 = axA0; refHalf1 = hA.x;
                refTangent2 = axA1; refHalf2 = hA.y;
                refFaceIdx = 4u + select(0u, 1u, s > 0.0);
            }

            let negN = -n;
            let dB0 = dot(negN, axB0);
            let dB1 = dot(negN, axB1);
            let dB2 = dot(negN, axB2);
            let aB0 = abs(dB0); let aB1 = abs(dB1); let aB2 = abs(dB2);

            var incAxis: vec3f;
            var incT1: vec3f;
            var incT2: vec3f;
            var incH: f32;
            var incH1: f32;
            var incH2: f32;

            if (aB0 >= aB1 && aB0 >= aB2) {
                let s = sign(dB0);
                incAxis = axB0 * s; incH = hB.x;
                incT1 = axB1; incH1 = hB.y;
                incT2 = axB2; incH2 = hB.z;
                incFaceIdx = select(0u, 1u, s > 0.0);
            } else if (aB1 >= aB2) {
                let s = sign(dB1);
                incAxis = axB1 * s; incH = hB.y;
                incT1 = axB0; incH1 = hB.x;
                incT2 = axB2; incH2 = hB.z;
                incFaceIdx = 2u + select(0u, 1u, s > 0.0);
            } else {
                let s = sign(dB2);
                incAxis = axB2 * s; incH = hB.z;
                incT1 = axB0; incH1 = hB.x;
                incT2 = axB1; incH2 = hB.y;
                incFaceIdx = 4u + select(0u, 1u, s > 0.0);
            }

            let incCenter = posB + incAxis * incH;
            incVerts[0] = incCenter + incT1 * incH1 + incT2 * incH2;
            incVerts[1] = incCenter - incT1 * incH1 + incT2 * incH2;
            incVerts[2] = incCenter - incT1 * incH1 - incT2 * incH2;
            incVerts[3] = incCenter + incT1 * incH1 - incT2 * incH2;
        } else {
            refNormal = -n;
            if (nDotB0 >= nDotB1 && nDotB0 >= nDotB2) {
                let s = sign(dot(-n, axB0));
                refCenter = posB + axB0 * s * hB.x;
                refTangent1 = axB1; refHalf1 = hB.y;
                refTangent2 = axB2; refHalf2 = hB.z;
                refFaceIdx = select(0u, 1u, s > 0.0);
            } else if (nDotB1 >= nDotB2) {
                let s = sign(dot(-n, axB1));
                refCenter = posB + axB1 * s * hB.y;
                refTangent1 = axB0; refHalf1 = hB.x;
                refTangent2 = axB2; refHalf2 = hB.z;
                refFaceIdx = 2u + select(0u, 1u, s > 0.0);
            } else {
                let s = sign(dot(-n, axB2));
                refCenter = posB + axB2 * s * hB.z;
                refTangent1 = axB0; refHalf1 = hB.x;
                refTangent2 = axB1; refHalf2 = hB.y;
                refFaceIdx = 4u + select(0u, 1u, s > 0.0);
            }

            let posN = n;
            let dA0 = dot(posN, axA0);
            let dA1 = dot(posN, axA1);
            let dA2 = dot(posN, axA2);
            let aA0 = abs(dA0); let aA1 = abs(dA1); let aA2 = abs(dA2);

            var incAxis: vec3f;
            var incT1: vec3f;
            var incT2: vec3f;
            var incH: f32;
            var incH1: f32;
            var incH2: f32;

            if (aA0 >= aA1 && aA0 >= aA2) {
                let s = sign(dA0);
                incAxis = axA0 * s; incH = hA.x;
                incT1 = axA1; incH1 = hA.y;
                incT2 = axA2; incH2 = hA.z;
                incFaceIdx = select(0u, 1u, s > 0.0);
            } else if (aA1 >= aA2) {
                let s = sign(dA1);
                incAxis = axA1 * s; incH = hA.y;
                incT1 = axA0; incH1 = hA.x;
                incT2 = axA2; incH2 = hA.z;
                incFaceIdx = 2u + select(0u, 1u, s > 0.0);
            } else {
                let s = sign(dA2);
                incAxis = axA2 * s; incH = hA.z;
                incT1 = axA0; incH1 = hA.x;
                incT2 = axA1; incH2 = hA.y;
                incFaceIdx = 4u + select(0u, 1u, s > 0.0);
            }

            let incCenter = posA + incAxis * incH;
            incVerts[0] = incCenter + incT1 * incH1 + incT2 * incH2;
            incVerts[1] = incCenter - incT1 * incH1 + incT2 * incH2;
            incVerts[2] = incCenter - incT1 * incH1 - incT2 * incH2;
            incVerts[3] = incCenter + incT1 * incH1 - incT2 * incH2;
        }

        var clipIn: array<vec3f, 8>;
        var clipOut: array<vec3f, 8>;
        var clipTags: array<u32, 8>;
        var clipTagsOut: array<u32, 8>;
        var clipCount = 4u;
        for (var v = 0u; v < 4u; v++) { clipIn[v] = incVerts[v]; clipTags[v] = v; }

        let clipNormals = array<vec3f, 4>(refTangent1, -refTangent1, refTangent2, -refTangent2);
        let clipOffsets = array<f32, 4>(
            dot(refTangent1, refCenter) + refHalf1,
            -dot(refTangent1, refCenter) + refHalf1,
            dot(refTangent2, refCenter) + refHalf2,
            -dot(refTangent2, refCenter) + refHalf2,
        );

        for (var p = 0u; p < 4u; p++) {
            let planeN = clipNormals[p];
            let planeD = clipOffsets[p];
            var outCount = 0u;

            var a = clipIn[clipCount - 1u];
            var da = dot(planeN, a) - planeD;
            for (var v = 0u; v < clipCount; v++) {
                let b = clipIn[v];
                let db = dot(planeN, b) - planeD;
                let aInside = da <= 1e-5;
                let bInside = db <= 1e-5;
                if (aInside != bInside) {
                    var t = 0.0;
                    let denom = da - db;
                    if (abs(denom) > 1e-6) { t = clamp(da / denom, 0.0, 1.0); }
                    if (outCount < 8u) { clipTagsOut[outCount] = 4u + p; clipOut[outCount] = a + (b - a) * t; outCount++; }
                }
                if (bInside) {
                    if (outCount < 8u) { clipTagsOut[outCount] = clipTags[v]; clipOut[outCount] = b; outCount++; }
                }
                a = b;
                da = db;
            }

            clipCount = outCount;
            for (var v = 0u; v < clipCount; v++) { clipIn[v] = clipOut[v]; clipTags[v] = clipTagsOut[v]; }
        }

        let refD = dot(refNormal, refCenter);
        for (var v = 0u; v < clipCount; v++) {
            let sep = dot(refNormal, clipIn[v]) - refD;
            if (sep <= 1e-5 && candCount < MAX_CANDIDATES) {
                let pInc = clipIn[v];
                let pRef = pInc - refNormal * sep;
                let cA = select(pInc, pRef, faceRefIsA);
                let cB = select(pRef, pInc, faceRefIsA);
                candidates[candCount] = ManifoldCandidate(cA, cB, sep, clipTags[v]);
                candCount++;
            }
        }

        if (candCount == 0u) {
            let sA = supportPointBox(posA, axA0, axA1, axA2, hA, satNormal);
            let sB = supportPointBox(posB, axB0, axB1, axB2, hB, -satNormal);
            candidates[0] = ManifoldCandidate(sA, sB, dot(sA - sB, satNormal), 0u);
            candCount = 1u;
        }
    } else {
        let eA = bestEdgeA;
        let eB = bestEdgeB;

        let sA0 = dot(axA0, satNormal) > 0.0;
        let sA1 = dot(axA1, satNormal) > 0.0;
        let sA2 = dot(axA2, satNormal) > 0.0;

        var supA = vec3f(0.0);
        supA += axA0 * select(-hA.x, hA.x, sA0);
        supA += axA1 * select(-hA.y, hA.y, sA1);
        supA += axA2 * select(-hA.z, hA.z, sA2);
        let pA = posA + supA;

        let sB0 = dot(axB0, -satNormal) > 0.0;
        let sB1 = dot(axB1, -satNormal) > 0.0;
        let sB2 = dot(axB2, -satNormal) > 0.0;

        var supB = vec3f(0.0);
        supB += axB0 * select(-hB.x, hB.x, sB0);
        supB += axB1 * select(-hB.y, hB.y, sB1);
        supB += axB2 * select(-hB.z, hB.z, sB2);
        let pB = posB + supB;

        var halfLenA = hA.x;
        if (abs(dot(eA, axA1)) > 0.5) { halfLenA = hA.y; }
        if (abs(dot(eA, axA2)) > 0.5) { halfLenA = hA.z; }
        var halfLenB = hB.x;
        if (abs(dot(eB, axB1)) > 0.5) { halfLenB = hB.y; }
        if (abs(dot(eB, axB2)) > 0.5) { halfLenB = hB.z; }

        let dAB = pA - pB;
        let dAe = dot(eA, eA);
        let dBe = dot(eB, eB);
        let dAeB = dot(eA, eB);
        let dAeAB = dot(eA, dAB);
        let dBeAB = dot(eB, dAB);

        let denom = dAe * dBe - dAeB * dAeB;
        let sN = clamp((dAeB * dBeAB - dBe * dAeAB) / max(denom, 1e-12), -halfLenA, halfLenA);
        let tN = clamp((dAe * dBeAB - dAeB * dAeAB) / max(denom, 1e-12), -halfLenB, halfLenB);

        let closestA = pA + eA * sN;
        let closestB = pB + eB * tN;
        let depth = dot(closestA - closestB, satNormal);

        if (depth <= 0.0) {
            candidates[0] = ManifoldCandidate(closestA, closestB, depth, 0u);
            candCount = 1u;
        } else {
            let sA = supportPointBox(posA, axA0, axA1, axA2, hA, satNormal);
            let sB = supportPointBox(posB, axB0, axB1, axB2, hB, -satNormal);
            candidates[0] = ManifoldCandidate(sA, sB, dot(sA - sB, satNormal), 0u);
            candCount = 1u;
        }
    }

    var selected: array<u32, 4>;
    let satCount = reduceManifold(&candidates, candCount, satNormal, &selected);

    let bbBasisN = -satNormal;
    let tb = tangentBasis(bbBasisN);
    let mu = sqrt(bA.friction * bB.friction);

    for (var s = 0u; s < satCount; s++) {
        let ci_s = selected[s];
        let rA_w = candidates[ci_s].pointA - posA;
        let rB_w = candidates[ci_s].pointB - posB;
        let rA = quatRotate(quatConj(bA.quat), rA_w);
        let rB = quatRotate(quatConj(bB.quat), rB_w);
        let bbCI = contactCInit(posA, rA_w, posB, rB_w, bbBasisN, tb[0], tb[1]);

        var newKey = 0u;
        if (bestIsFace) {
            let typeVal = select(1u, 0u, faceRefIsA);
            newKey = (typeVal << 24u) | ((refFaceIdx >> 1u) << 16u) | ((incFaceIdx >> 1u) << 8u) | candidates[ci_s].clipTag;
        } else {
            newKey = (2u << 24u) | ((bestEdgeIdxA & 0xffu) << 8u) | (bestEdgeIdxB & 0xffu);
        }

        let wsKey = packKey(ci, cj, s);
        pushConstraintSearching(
            ci, i32(cj), newKey,
            bbBasisN, bbCI.x,
            tb[0], bbCI.y,
            tb[1], bbCI.z,
            rA, rB,
            mu,
            wsKey, ci, cj, 0u,
            -1e30, 0.0, 1e30,
        );
    }
    for (var s = satCount; s < MAX_PAIR_CONTACTS; s++) {
        resetWarmstartHash(packKey(ci, cj, s));
    }
}
`,tl=`
${Qc}
fn detectSphereBox(si: u32, bi: u32) {
    let sphere = bodies[si];
    let box = bodies[bi];
    let sPos = sphere.pos;
    let bPos = box.pos;
    let sRadius = sphere.halfExtents.x;
    let h = box.halfExtents;
    let bQ = box.quat;
    let bQc = quatConj(bQ);

    let d = sPos - bPos;
    let local = quatRotate(bQc, d);
    let clamped = clamp(local, -h, h);
    let diff = local - clamped;
    let dist2 = dot(diff, diff);

    let absLocal = abs(local);
    let inside = absLocal.x <= h.x && absLocal.y <= h.y && absLocal.z <= h.z;

    if (!inside && dist2 > 1e-16) {
        let dist = sqrt(dist2);
        let gap = dist - sRadius;
        if (gap > COLLISION_MARGIN) {
            let lo = min(si, bi);
            let hi = max(si, bi);
            for (var s = 0u; s < MAX_PAIR_CONTACTS; s++) {
                resetWarmstartHash(packKey(lo, hi, s));
            }
            return;
        }
        let localNormal = diff / dist;
        let normal = quatRotate(bQ, localNormal);

        let rBox_w = quatRotate(bQ, clamped);
        let rSphere_w = -normal * sRadius;

        emitSingleContact(si, bi, normal, rSphere_w, rBox_w,
            sPos, sphere.quat, bPos, bQ, sphere.friction, box.friction, 4u << 24u);
    } else {
        let face = h - absLocal;
        var minAxis = 0u;
        var minDepth = face.x;
        if (face.y < minDepth) { minAxis = 1u; minDepth = face.y; }
        if (face.z < minDepth) { minAxis = 2u; minDepth = face.z; }

        var localN = vec3f(0.0);
        var cpLocal = local;
        if (minAxis == 0u) {
            let s0 = select(-1.0, 1.0, local.x >= 0.0);
            localN.x = s0;
            cpLocal.x = s0 * h.x;
        } else if (minAxis == 1u) {
            let s0 = select(-1.0, 1.0, local.y >= 0.0);
            localN.y = s0;
            cpLocal.y = s0 * h.y;
        } else {
            let s0 = select(-1.0, 1.0, local.z >= 0.0);
            localN.z = s0;
            cpLocal.z = s0 * h.z;
        }
        let normal = quatRotate(bQ, localN);
        let rBox_w = quatRotate(bQ, cpLocal);
        let rSphere_w = -normal * sRadius;

        emitSingleContact(si, bi, normal, rSphere_w, rBox_w,
            sPos, sphere.quat, bPos, bQ, sphere.friction, box.friction, 4u << 24u);
    }
}
`,nl=`
fn detectCapsuleBox(ci: u32, bi: u32) {
    let cap = bodies[ci];
    let box = bodies[bi];
    let capAxis = quatRotate(cap.quat, vec3f(0.0, cap.halfExtents.y, 0.0));
    let capR = cap.halfExtents.x;
    let h = box.halfExtents;
    let bQ = box.quat;
    let bQc = quatConj(bQ);

    let lo = min(ci, bi);
    let hi = max(ci, bi);
    let aIsLo = ci < bi;
    let mu = sqrt(cap.friction * box.friction);

    var contactCount = 0u;
    let epA = cap.pos + capAxis;
    let epB = cap.pos - capAxis;

    for (var ep = 0u; ep < 2u; ep++) {
        let sPos = select(epB, epA, ep == 0u);
        let d = sPos - box.pos;
        let local = quatRotate(bQc, d);
        let clamped = clamp(local, -h, h);
        let diff = local - clamped;
        let dist2 = dot(diff, diff);

        let absLocal = abs(local);
        let isInside = absLocal.x <= h.x && absLocal.y <= h.y && absLocal.z <= h.z;

        var normal: vec3f;
        var rBox_w: vec3f;
        var emitThis = false;

        if (!isInside && dist2 > 1e-16) {
            let dist = sqrt(dist2);
            let gap = dist - capR;
            if (gap <= COLLISION_MARGIN) {
                normal = quatRotate(bQ, diff / dist);
                rBox_w = quatRotate(bQ, clamped);
                emitThis = true;
            }
        } else {
            let face = h - absLocal;
            var minAxis = 0u;
            var minVal = face.x;
            if (face.y < minVal) { minAxis = 1u; minVal = face.y; }
            if (face.z < minVal) { minAxis = 2u; minVal = face.z; }
            var localN = vec3f(0.0);
            var cpLocal = local;
            if (minAxis == 0u) {
                let s0 = select(-1.0, 1.0, local.x >= 0.0);
                localN.x = s0; cpLocal.x = s0 * h.x;
            } else if (minAxis == 1u) {
                let s0 = select(-1.0, 1.0, local.y >= 0.0);
                localN.y = s0; cpLocal.y = s0 * h.y;
            } else {
                let s0 = select(-1.0, 1.0, local.z >= 0.0);
                localN.z = s0; cpLocal.z = s0 * h.z;
            }
            normal = quatRotate(bQ, localN);
            rBox_w = quatRotate(bQ, cpLocal);
            emitThis = true;
        }

        if (emitThis) {
            let rCap_w = (sPos - cap.pos) + (-normal * capR);
            let n = select(-normal, normal, aIsLo);
            let tb = tangentBasis(n);

            let rCapL = quatRotate(quatConj(cap.quat), rCap_w);
            let rBoxL = quatRotate(bQc, rBox_w);

            let posLo = select(box.pos, cap.pos, aIsLo);
            let posHi = select(cap.pos, box.pos, aIsLo);
            let rLo_l = select(rBoxL, rCapL, aIsLo);
            let rHi_l = select(rCapL, rBoxL, aIsLo);
            let rLo_w = select(rBox_w, rCap_w, aIsLo);
            let rHi_w = select(rCap_w, rBox_w, aIsLo);

            let cInit = contactCInit(posLo, rLo_w, posHi, rHi_w, n, tb[0], tb[1]);
            let fkey = (7u << 24u) | ep;

            pushConstraintSearching(
                lo, i32(hi), fkey,
                n, cInit.x,
                tb[0], cInit.y,
                tb[1], cInit.z,
                rLo_l, rHi_l,
                mu,
                packKey(lo, hi, contactCount), lo, hi, 0u,
                -1e30, 0.0, 1e30,
            );
            contactCount++;
        }
    }

    for (var s = contactCount; s < MAX_PAIR_CONTACTS; s++) {
        resetWarmstartHash(packKey(lo, hi, s));
    }
}
`,rl=`
fn detectSphereSphere(ci: u32, cj: u32) {
    let bA = bodies[ci];
    let bB = bodies[cj];
    let posA = bA.pos;
    let posB = bB.pos;
    let rA = bA.halfExtents.x;
    let rB = bB.halfExtents.x;

    let d = posA - posB;
    let dist = length(d);
    let gap = dist - rA - rB;
    if (gap > COLLISION_MARGIN) {
        for (var s = 0u; s < MAX_PAIR_CONTACTS; s++) {
            resetWarmstartHash(packKey(ci, cj, s));
        }
        return;
    }

    var normal: vec3f;
    if (dist < 1e-8) {
        normal = vec3f(0.0, 1.0, 0.0);
    } else {
        normal = d / dist;
    }

    let tb = tangentBasis(normal);
    let mu = sqrt(bA.friction * bB.friction);

    let rA_w = -normal * rA;
    let rB_w = normal * rB;
    let rA_local = quatRotate(quatConj(bA.quat), rA_w);
    let rB_local = quatRotate(quatConj(bB.quat), rB_w);
    let ssCI = contactCInit(posA, rA_w, posB, rB_w, normal, tb[0], tb[1]);

    let featureKey = 3u << 24u;
    let wsKey = packKey(ci, cj, 0u);
    pushConstraintSearching(
        ci, i32(cj), featureKey,
        normal, ssCI.x,
        tb[0], ssCI.y,
        tb[1], ssCI.z,
        rA_local, rB_local,
        mu,
        wsKey, ci, cj, 0u,
        -1e30, 0.0, 1e30,
    );
    for (var s = 1u; s < MAX_PAIR_CONTACTS; s++) {
        resetWarmstartHash(packKey(ci, cj, s));
    }
}
`,il=`
fn closestPointOnSegment(p: vec3f, a: vec3f, b: vec3f) -> vec3f {
    let ab = b - a;
    let ab2 = dot(ab, ab);
    if (ab2 < 1e-12) { return a; }
    let t = clamp(dot(p - a, ab) / ab2, 0.0, 1.0);
    return a + ab * t;
}
`,al=`
fn closestPointsOnSegments(p0: vec3f, p1: vec3f, q0: vec3f, q1: vec3f) -> array<vec3f, 2> {
    let d1 = p1 - p0;
    let d2 = q1 - q0;
    let r = p0 - q0;
    let a = dot(d1, d1);
    let e = dot(d2, d2);
    let f = dot(d2, r);

    var s = 0.0;
    var t = 0.0;

    if (a <= 1e-12 && e <= 1e-12) {
        return array(p0, q0);
    }

    if (a <= 1e-12) {
        t = clamp(f / e, 0.0, 1.0);
    } else {
        let c = dot(d1, r);
        if (e <= 1e-12) {
            s = clamp(-c / a, 0.0, 1.0);
        } else {
            let b = dot(d1, d2);
            let denom = a * e - b * b;

            if (abs(denom) > 1e-12) {
                s = clamp((b * f - c * e) / denom, 0.0, 1.0);
            }

            t = (b * s + f) / e;

            if (t < 0.0) {
                t = 0.0;
                s = clamp(-c / a, 0.0, 1.0);
            } else if (t > 1.0) {
                t = 1.0;
                s = clamp((b - c) / a, 0.0, 1.0);
            }
        }
    }

    return array(p0 + d1 * s, q0 + d2 * t);
}
`,ol=`
${il}
${Qc}

fn detectCapsuleSphere(ci: u32, si: u32) {
    let cap = bodies[ci];
    let sph = bodies[si];
    let capAxis = quatRotate(cap.quat, vec3f(0.0, cap.halfExtents.y, 0.0));
    let segA = cap.pos + capAxis;
    let segB = cap.pos - capAxis;
    let capR = cap.halfExtents.x;
    let sphR = sph.halfExtents.x;

    let closest = closestPointOnSegment(sph.pos, segA, segB);
    let d = closest - sph.pos;
    let dist = length(d);
    let gap = dist - capR - sphR;

    let lo = min(ci, si);
    let hi = max(ci, si);
    if (gap > COLLISION_MARGIN) {
        for (var s = 0u; s < MAX_PAIR_CONTACTS; s++) {
            resetWarmstartHash(packKey(lo, hi, s));
        }
        return;
    }

    var normal: vec3f;
    if (dist < 1e-8) {
        normal = vec3f(0.0, 1.0, 0.0);
    } else {
        normal = d / dist;
    }

    let rCap_w = (closest - cap.pos) + (-normal * capR);
    let rSph_w = normal * sphR;

    emitSingleContact(ci, si, normal, rCap_w, rSph_w,
        cap.pos, cap.quat, sph.pos, sph.quat,
        cap.friction, sph.friction, 5u << 24u);
}
`,sl=`
${al}
${Qc}

fn detectCapsuleCapsule(ci: u32, cj: u32) {
    let bA = bodies[ci];
    let bB = bodies[cj];
    let axisA = quatRotate(bA.quat, vec3f(0.0, bA.halfExtents.y, 0.0));
    let axisB = quatRotate(bB.quat, vec3f(0.0, bB.halfExtents.y, 0.0));
    let rA = bA.halfExtents.x;
    let rB = bB.halfExtents.x;

    let cp = closestPointsOnSegments(
        bA.pos + axisA, bA.pos - axisA,
        bB.pos + axisB, bB.pos - axisB);
    let d = cp[0] - cp[1];
    let dist = length(d);
    let gap = dist - rA - rB;

    if (gap > COLLISION_MARGIN) {
        for (var s = 0u; s < MAX_PAIR_CONTACTS; s++) {
            resetWarmstartHash(packKey(ci, cj, s));
        }
        return;
    }

    var normal: vec3f;
    if (dist < 1e-8) {
        normal = vec3f(0.0, 1.0, 0.0);
    } else {
        normal = d / dist;
    }

    let rA_w = (cp[0] - bA.pos) + (-normal * rA);
    let rB_w = (cp[1] - bB.pos) + (normal * rB);

    emitSingleContact(ci, cj, normal, rA_w, rB_w,
        bA.pos, bA.quat, bB.pos, bB.quat,
        bA.friction, bB.friction, 6u << 24u);
}
`,cl=`
${$c}
@group(1) @binding(1) var<storage, read> hullData: array<u32>;

const MAX_HULL_VERTS: u32 = 64u;
const MAX_HULL_FACES: u32 = 32u;
const MAX_HULL_EDGES: u32 = 48u;
const MAX_FACE_VERTS: u32 = 16u;
const MAX_CLIP_VERTS: u32 = 32u;

struct HullMeta {
    vertexBase: u32,
    vertexCount: u32,
    faceBase: u32,
    faceCount: u32,
    edgeBase: u32,
    edgeCount: u32,
    invExtent: vec3f,
}

fn loadHullMeta(hullId: u32) -> HullMeta {
    let b = hullId * 12u;
    return HullMeta(
        hullData[b], hullData[b+1u], hullData[b+2u], hullData[b+3u],
        hullData[b+4u], hullData[b+5u],
        vec3f(bitcast<f32>(hullData[b+6u]), bitcast<f32>(hullData[b+7u]), bitcast<f32>(hullData[b+8u])),
    );
}

fn hullScale(hm: HullMeta, halfExt: vec3f) -> vec3f {
    return halfExt * hm.invExtent;
}

fn hullVertex(hm: HullMeta, idx: u32) -> vec3f {
    let b = hm.vertexBase + idx * 4u;
    return vec3f(bitcast<f32>(hullData[b]), bitcast<f32>(hullData[b+1u]), bitcast<f32>(hullData[b+2u]));
}

fn hullFacePlane(hm: HullMeta, faceIdx: u32, scale: vec3f) -> vec4f {
    let b = hm.faceBase + faceIdx * 8u;
    let rawN = vec3f(bitcast<f32>(hullData[b]), bitcast<f32>(hullData[b+1u]), bitcast<f32>(hullData[b+2u]));
    let rawD = bitcast<f32>(hullData[b+3u]);
    let sn = rawN / scale;
    let snLen = length(sn);
    return vec4f(sn / snLen, rawD / snLen);
}

fn hullFaceIdxBase(hm: HullMeta, faceIdx: u32) -> u32 {
    return hullData[hm.faceBase + faceIdx * 8u + 4u];
}

fn hullFaceIdxCount(hm: HullMeta, faceIdx: u32) -> u32 {
    return hullData[hm.faceBase + faceIdx * 8u + 5u];
}

fn hullFaceVertIdx(base: u32, i: u32) -> u32 {
    return hullData[base + i];
}

fn hullEdge(hm: HullMeta, idx: u32, scale: vec3f) -> vec3f {
    let b = hm.edgeBase + idx * 4u;
    let raw = vec3f(bitcast<f32>(hullData[b]), bitcast<f32>(hullData[b+1u]), bitcast<f32>(hullData[b+2u]));
    return raw * scale;
}

fn projectHullOnAxis(hm: HullMeta, pos: vec3f, quat: vec4f, axis: vec3f, scale: vec3f) -> vec2f {
    var mn = 1e30;
    var mx = -1e30;
    for (var i = 0u; i < MAX_HULL_VERTS; i++) {
        if (i >= hm.vertexCount) { break; }
        let wv = pos + quatRotate(quat, hullVertex(hm, i) * scale);
        let d = dot(wv, axis);
        mn = min(mn, d);
        mx = max(mx, d);
    }
    return vec2f(mn, mx);
}

fn closestPointOnHull(hm: HullMeta, hQc: vec4f, worldOffset: vec3f, sRadius: f32, scale: vec3f) -> vec4f {
    let localCenter = quatRotate(hQc, worldOffset);
    let scaledCenter = localCenter / scale;
    var closestDist = 1e30;
    var closestPoint = vec3f(0.0);

    for (var fi = 0u; fi < MAX_HULL_FACES; fi++) {
        if (fi >= hm.faceCount) { break; }
        let b = hm.faceBase + fi * 8u;
        let fn0 = vec3f(bitcast<f32>(hullData[b]), bitcast<f32>(hullData[b+1u]), bitcast<f32>(hullData[b+2u]));
        let fd = bitcast<f32>(hullData[b+3u]);
        let dist = dot(fn0, scaledCenter) + fd;
        let scaledRadius = sRadius / min(scale.x, min(scale.y, scale.z));
        if (dist < -scaledRadius) { continue; }
        let projected = scaledCenter - fn0 * dist;
        let idxBase = hullFaceIdxBase(hm, fi);
        let idxCount = hullFaceIdxCount(hm, fi);
        var inside = true;
        for (var ei = 0u; ei < MAX_FACE_VERTS; ei++) {
            if (ei >= idxCount) { break; }
            let va = hullVertex(hm, hullFaceVertIdx(idxBase, ei));
            let vb = hullVertex(hm, hullFaceVertIdx(idxBase, (ei + 1u) % idxCount));
            if (dot(cross(vb - va, projected - va), fn0) < -1e-5) { inside = false; break; }
        }
        if (inside) {
            let absDist = abs(dist);
            if (absDist < closestDist) { closestDist = absDist; closestPoint = projected; }
        }
    }

    for (var fi = 0u; fi < MAX_HULL_FACES; fi++) {
        if (fi >= hm.faceCount) { break; }
        let idxBase = hullFaceIdxBase(hm, fi);
        let idxCount = hullFaceIdxCount(hm, fi);
        for (var ei = 0u; ei < MAX_FACE_VERTS; ei++) {
            if (ei >= idxCount) { break; }
            let va = hullVertex(hm, hullFaceVertIdx(idxBase, ei));
            let vb = hullVertex(hm, hullFaceVertIdx(idxBase, (ei + 1u) % idxCount));
            let ab = vb - va;
            let ab2 = dot(ab, ab);
            var cp = va;
            if (ab2 > 1e-12) { cp = va + ab * clamp(dot(scaledCenter - va, ab) / ab2, 0.0, 1.0); }
            let dist = length(scaledCenter - cp);
            if (dist < closestDist) { closestDist = dist; closestPoint = cp; }
        }
    }

    for (var vi = 0u; vi < MAX_HULL_VERTS; vi++) {
        if (vi >= hm.vertexCount) { break; }
        let v = hullVertex(hm, vi);
        let dist = length(scaledCenter - v);
        if (dist < closestDist) { closestDist = dist; closestPoint = v; }
    }

    let worldPoint = closestPoint * scale;
    let worldDist = length(localCenter - worldPoint);
    return vec4f(worldPoint, worldDist - sRadius);
}
`,ll=`
${cl}
${Qc}

fn detectHullBox(hui: u32, bi: u32) {
    let hBody = bodies[hui];
    let bBody = bodies[bi];
    let hm = loadHullMeta(hBody.hullId);
    let hPos = hBody.pos;
    let hQ = hBody.quat;
    let bPos = bBody.pos;
    let bQ = bBody.quat;
    let hB = bBody.halfExtents;
    let S = hullScale(hm, hBody.halfExtents);

    let axB0 = quatRotate(bQ, vec3f(1, 0, 0));
    let axB1 = quatRotate(bQ, vec3f(0, 1, 0));
    let axB2 = quatRotate(bQ, vec3f(0, 0, 1));
    let d = bPos - hPos;

    var minPen = 1e30;
    var bestAxis = vec3f(0.0, 1.0, 0.0);
    var separated = false;

    // Hull face normals
    for (var fi = 0u; fi < MAX_HULL_FACES; fi++) {
        if (fi >= hm.faceCount) { break; }
        let plane = hullFacePlane(hm, fi, S);
        let axis = quatRotate(hQ, plane.xyz);
        let hProj = projectHullOnAxis(hm, hPos, hQ, axis, S);
        let bProj = abs(dot(axB0, axis)) * hB.x + abs(dot(axB1, axis)) * hB.y + abs(dot(axB2, axis)) * hB.z;
        let bCenter = dot(bPos, axis);
        let pen = min(hProj.y - (bCenter - bProj), (bCenter + bProj) - hProj.x);
        if (pen < 0.0) { separated = true; break; }
        if (pen < minPen * 0.95 - 0.01) {
            minPen = pen;
            bestAxis = axis;
            if (dot(d, axis) < 0.0) { bestAxis = -axis; }
        }
    }

    // Box face normals
    if (!separated) {
        let boxAxes = array<vec3f, 3>(axB0, axB1, axB2);
        for (var a = 0u; a < 3u; a++) {
            let axis = boxAxes[a];
            let hProj = projectHullOnAxis(hm, hPos, hQ, axis, S);
            let bProj = abs(dot(axB0, axis)) * hB.x + abs(dot(axB1, axis)) * hB.y + abs(dot(axB2, axis)) * hB.z;
            let bCenter = dot(bPos, axis);
            let pen = min(hProj.y - (bCenter - bProj), (bCenter + bProj) - hProj.x);
            if (pen < 0.0) { separated = true; break; }
            if (pen < minPen * 0.95 - 0.01) {
                minPen = pen;
                bestAxis = axis;
                if (dot(d, axis) < 0.0) { bestAxis = -axis; }
            }
        }
    }

    // Edge-edge cross products
    if (!separated) {
        let boxEdges = array<vec3f, 3>(axB0, axB1, axB2);
        for (var ea = 0u; ea < MAX_HULL_EDGES; ea++) {
            if (ea >= hm.edgeCount) { break; }
            let edgeA = quatRotate(hQ, hullEdge(hm, ea, S));
            for (var eb = 0u; eb < 3u; eb++) {
                var axis = cross(edgeA, boxEdges[eb]);
                let axLen = length(axis);
                if (axLen < 1e-6) { continue; }
                axis /= axLen;
                let hProj = projectHullOnAxis(hm, hPos, hQ, axis, S);
                let bProj = abs(dot(axB0, axis)) * hB.x + abs(dot(axB1, axis)) * hB.y + abs(dot(axB2, axis)) * hB.z;
                let bCenter = dot(bPos, axis);
                let pen = min(hProj.y - (bCenter - bProj), (bCenter + bProj) - hProj.x);
                if (pen < 0.0) { separated = true; break; }
                if (pen < minPen * 0.95 - 0.01) {
                    minPen = pen;
                    bestAxis = axis;
                    if (dot(d, axis) < 0.0) { bestAxis = -axis; }
                }
            }
            if (separated) { break; }
        }
    }

    if (separated) { return; }

    let n = bestAxis;

    // Reference face: on hull, most aligned with n
    var refFaceIdx = 0u;
    var refDmax = -1e30;
    for (var fi = 0u; fi < MAX_HULL_FACES; fi++) {
        if (fi >= hm.faceCount) { break; }
        let fn0 = quatRotate(hQ, hullFacePlane(hm, fi, S).xyz);
        let dd = dot(fn0, n);
        if (dd > refDmax) { refDmax = dd; refFaceIdx = fi; }
    }

    let refPlane = hullFacePlane(hm, refFaceIdx, S);
    let refNormal = quatRotate(hQ, refPlane.xyz);
    let refIdxBase = hullFaceIdxBase(hm, refFaceIdx);
    let refIdxCount = hullFaceIdxCount(hm, refFaceIdx);

    // Incident face: box face most anti-aligned with n
    let negN = -n;
    let dB0 = dot(negN, axB0); let dB1 = dot(negN, axB1); let dB2 = dot(negN, axB2);
    let aB0 = abs(dB0); let aB1 = abs(dB1); let aB2 = abs(dB2);
    var incVerts: array<vec3f, 4>;
    var incFaceIdx = 0u;
    if (aB0 >= aB1 && aB0 >= aB2) {
        let s = sign(dB0);
        let c0 = bPos + axB0 * s * hB.x;
        incVerts[0] = c0 + axB1 * hB.y + axB2 * hB.z;
        incVerts[1] = c0 - axB1 * hB.y + axB2 * hB.z;
        incVerts[2] = c0 - axB1 * hB.y - axB2 * hB.z;
        incVerts[3] = c0 + axB1 * hB.y - axB2 * hB.z;
        incFaceIdx = select(0u, 1u, s > 0.0);
    } else if (aB1 >= aB2) {
        let s = sign(dB1);
        let c0 = bPos + axB1 * s * hB.y;
        incVerts[0] = c0 + axB0 * hB.x + axB2 * hB.z;
        incVerts[1] = c0 - axB0 * hB.x + axB2 * hB.z;
        incVerts[2] = c0 - axB0 * hB.x - axB2 * hB.z;
        incVerts[3] = c0 + axB0 * hB.x - axB2 * hB.z;
        incFaceIdx = 2u + select(0u, 1u, s > 0.0);
    } else {
        let s = sign(dB2);
        let c0 = bPos + axB2 * s * hB.z;
        incVerts[0] = c0 + axB0 * hB.x + axB1 * hB.y;
        incVerts[1] = c0 - axB0 * hB.x + axB1 * hB.y;
        incVerts[2] = c0 - axB0 * hB.x - axB1 * hB.y;
        incVerts[3] = c0 + axB0 * hB.x - axB1 * hB.y;
        incFaceIdx = 4u + select(0u, 1u, s > 0.0);
    }

    // Clip incident face against reference face edge planes
    var clipIn: array<vec3f, MAX_CLIP_VERTS>;
    var clipOut: array<vec3f, MAX_CLIP_VERTS>;
    var clipCount = 4u;
    for (var v = 0u; v < 4u; v++) { clipIn[v] = incVerts[v]; }

    for (var ei = 0u; ei < MAX_FACE_VERTS; ei++) {
        if (ei >= refIdxCount) { break; }
        let vi = hullFaceVertIdx(refIdxBase, ei);
        let vj = hullFaceVertIdx(refIdxBase, (ei + 1u) % refIdxCount);
        let va = hPos + quatRotate(hQ, hullVertex(hm, vi) * S);
        let vb = hPos + quatRotate(hQ, hullVertex(hm, vj) * S);
        let edge0 = va - vb;
        let planeN = -cross(edge0, refNormal);
        let planeD = dot(va, planeN);
        var outCount = 0u;
        var a = clipIn[clipCount - 1u];
        var da = dot(planeN, a) - planeD;
        for (var v = 0u; v < MAX_CLIP_VERTS; v++) {
            if (v >= clipCount) { break; }
            let b = clipIn[v];
            let db = dot(planeN, b) - planeD;
            if ((da <= 1e-5) != (db <= 1e-5)) {
                var t = 0.0;
                let denom = da - db;
                if (abs(denom) > 1e-6) { t = clamp(da / denom, 0.0, 1.0); }
                if (outCount < MAX_CLIP_VERTS) { clipOut[outCount] = a + (b - a) * t; outCount++; }
            }
            if (db <= 1e-5) {
                if (outCount < MAX_CLIP_VERTS) { clipOut[outCount] = b; outCount++; }
            }
            a = b;
            da = db;
        }
        clipCount = outCount;
        for (var v = 0u; v < MAX_CLIP_VERTS; v++) {
            if (v >= clipCount) { break; }
            clipIn[v] = clipOut[v];
        }
    }

    // Collect all candidates behind reference face
    let localPlaneEq = refPlane.w;
    let worldPlaneEq = localPlaneEq - dot(refNormal, hPos);
    var candidates: array<ManifoldCandidate, MAX_CANDIDATES>;
    var candCount = 0u;

    for (var v = 0u; v < MAX_CLIP_VERTS; v++) {
        if (v >= clipCount) { break; }
        let depth = dot(refNormal, clipIn[v]) + worldPlaneEq;
        if (depth <= 0.0 && candCount < MAX_CANDIDATES) {
            let pB = clipIn[v];
            let pA = pB - refNormal * depth;
            candidates[candCount] = ManifoldCandidate(pA, pB, depth, v);
            candCount++;
        }
    }

    // Reduce to 4 well-distributed contacts
    var selected: array<u32, 4>;
    let satCount = reduceManifold(&candidates, candCount, n, &selected);

    let bbBasisN = -n;
    let tb = tangentBasis(bbBasisN);
    let mu = sqrt(hBody.friction * bBody.friction);

    for (var s = 0u; s < satCount; s++) {
        let c = candidates[selected[s]];
        let rH_w = c.pointA - hPos;
        let rB_w = c.pointB - bPos;
        let rH = quatRotate(quatConj(hQ), rH_w);
        let rB = quatRotate(quatConj(bQ), rB_w);
        let bbCI = contactCInit(hPos, rH_w, bPos, rB_w, bbBasisN, tb[0], tb[1]);
        let fkey = (10u << 24u) | s;

        let wsKey = packKey(hui, bi, s);
        pushConstraintSearching(
            hui, i32(bi), fkey,
            bbBasisN, bbCI.x,
            tb[0], bbCI.y,
            tb[1], bbCI.z,
            rH, rB,
            mu,
            wsKey, hui, bi, 0u,
            -1e30, 0.0, 1e30,
        );
    }
    for (var s = satCount; s < MAX_PAIR_CONTACTS; s++) {
        resetWarmstartHash(packKey(hui, bi, s));
    }
}
`,ul=`
${cl}
${Qc}

fn detectHullSphere(hui: u32, si: u32) {
    let hBody = bodies[hui];
    let sBody = bodies[si];
    let hm = loadHullMeta(hBody.hullId);
    let hPos = hBody.pos;
    let hQ = hBody.quat;
    let hQc = quatConj(hQ);
    let sPos = sBody.pos;
    let sRadius = sBody.halfExtents.x;
    let S = hullScale(hm, hBody.halfExtents);

    let result = closestPointOnHull(hm, hQc, sPos - hPos, sRadius, S);
    let penetration = result.w;
    if (penetration > COLLISION_MARGIN) {
        for (var s = 0u; s < MAX_PAIR_CONTACTS; s++) {
            resetWarmstartHash(packKey(min(hui, si), max(hui, si), s));
        }
        return;
    }

    let closestWorld = hPos + quatRotate(hQ, result.xyz);
    let diff = sPos - closestWorld;
    let diffLen = length(diff);
    var normal: vec3f;
    if (diffLen < 1e-8) {
        normal = vec3f(0.0, 1.0, 0.0);
    } else {
        normal = diff / diffLen;
    }

    let rH_w = closestWorld - hPos;
    let rS_w = -normal * sRadius;

    emitSingleContact(si, hui, normal, rS_w, rH_w,
        sPos, sBody.quat, hPos, hQ,
        sBody.friction, hBody.friction, 8u << 24u);
}
`,dl=`
${cl}

fn detectHullCapsule(hui: u32, ci: u32) {
    let hBody = bodies[hui];
    let cBody = bodies[ci];
    let hm = loadHullMeta(hBody.hullId);
    let hPos = hBody.pos;
    let hQ = hBody.quat;
    let hQc = quatConj(hQ);
    let capAxis = quatRotate(cBody.quat, vec3f(0.0, cBody.halfExtents.y, 0.0));
    let capR = cBody.halfExtents.x;
    let S = hullScale(hm, hBody.halfExtents);

    let lo = min(hui, ci);
    let hi = max(hui, ci);
    let aIsLo = hui < ci;
    let mu = sqrt(hBody.friction * cBody.friction);

    var contactCount = 0u;
    let epA = cBody.pos + capAxis;
    let epB = cBody.pos - capAxis;

    for (var ep = 0u; ep < 2u; ep++) {
        let sPos = select(epB, epA, ep == 0u);
        let result = closestPointOnHull(hm, hQc, sPos - hPos, capR, S);
        let penetration = result.w;
        if (penetration > COLLISION_MARGIN) { continue; }

        let closestWorld = hPos + quatRotate(hQ, result.xyz);
        let diff = sPos - closestWorld;
        let diffLen = length(diff);
        var normal: vec3f;
        if (diffLen < 1e-8) { normal = vec3f(0.0, 1.0, 0.0); }
        else { normal = diff / diffLen; }

        let rH_w = closestWorld - hPos;
        let rC_w = (sPos - cBody.pos) + (-normal * capR);
        let n = select(normal, -normal, aIsLo);
        let tb = tangentBasis(n);
        let rHL = quatRotate(hQc, rH_w);
        let rCL = quatRotate(quatConj(cBody.quat), rC_w);
        let posLo = select(cBody.pos, hPos, aIsLo);
        let posHi = select(hPos, cBody.pos, aIsLo);
        let rLo_l = select(rCL, rHL, aIsLo);
        let rHi_l = select(rHL, rCL, aIsLo);
        let rLo_w = select(rC_w, rH_w, aIsLo);
        let rHi_w = select(rH_w, rC_w, aIsLo);
        let cInit = contactCInit(posLo, rLo_w, posHi, rHi_w, n, tb[0], tb[1]);
        let fkey = (9u << 24u) | ep;

        pushConstraintSearching(
            lo, i32(hi), fkey,
            n, cInit.x,
            tb[0], cInit.y,
            tb[1], cInit.z,
            rLo_l, rHi_l,
            mu,
            packKey(lo, hi, contactCount), lo, hi, 0u,
            -1e30, 0.0, 1e30,
        );
        contactCount++;
    }
    for (var s = contactCount; s < MAX_PAIR_CONTACTS; s++) {
        resetWarmstartHash(packKey(lo, hi, s));
    }
}
`,fl=`
${cl}

fn detectHullHull(ai: u32, bi: u32) {
    let bA = bodies[ai];
    let bB = bodies[bi];
    let metaA = loadHullMeta(bA.hullId);
    let metaB = loadHullMeta(bB.hullId);
    let posA = bA.pos;
    let posB = bB.pos;
    let qA = bA.quat;
    let qB = bB.quat;
    let d = posB - posA;
    let sA = hullScale(metaA, bA.halfExtents);
    let sB = hullScale(metaB, bB.halfExtents);

    var minPen = 1e30;
    var bestAxis = vec3f(0.0, 1.0, 0.0);
    var separated = false;

    // Face normals from A
    for (var fi = 0u; fi < MAX_HULL_FACES; fi++) {
        if (fi >= metaA.faceCount) { break; }
        let axis = quatRotate(qA, hullFacePlane(metaA, fi, sA).xyz);
        let pA = projectHullOnAxis(metaA, posA, qA, axis, sA);
        let pB = projectHullOnAxis(metaB, posB, qB, axis, sB);
        let pen = min(pA.y - pB.x, pB.y - pA.x);
        if (pen < 0.0) { separated = true; break; }
        if (pen < minPen * 0.95 - 0.01) {
            minPen = pen;
            bestAxis = axis;
            if (dot(d, axis) < 0.0) { bestAxis = -axis; }
        }
    }

    // Face normals from B
    if (!separated) {
        for (var fi = 0u; fi < MAX_HULL_FACES; fi++) {
            if (fi >= metaB.faceCount) { break; }
            let axis = quatRotate(qB, hullFacePlane(metaB, fi, sB).xyz);
            let pA = projectHullOnAxis(metaA, posA, qA, axis, sA);
            let pB = projectHullOnAxis(metaB, posB, qB, axis, sB);
            let pen = min(pA.y - pB.x, pB.y - pA.x);
            if (pen < 0.0) { separated = true; break; }
            if (pen < minPen * 0.95 - 0.01) {
                minPen = pen;
                bestAxis = axis;
                if (dot(d, axis) < 0.0) { bestAxis = -axis; }
            }
        }
    }

    // Edge-edge cross products
    if (!separated) {
        for (var ea = 0u; ea < MAX_HULL_EDGES; ea++) {
            if (ea >= metaA.edgeCount) { break; }
            let edgeA = quatRotate(qA, hullEdge(metaA, ea, sA));
            for (var eb = 0u; eb < MAX_HULL_EDGES; eb++) {
                if (eb >= metaB.edgeCount) { break; }
                let edgeB = quatRotate(qB, hullEdge(metaB, eb, sB));
                var axis = cross(edgeA, edgeB);
                let axLen = length(axis);
                if (axLen < 1e-6) { continue; }
                axis /= axLen;
                let pA = projectHullOnAxis(metaA, posA, qA, axis, sA);
                let pB = projectHullOnAxis(metaB, posB, qB, axis, sB);
                let pen = min(pA.y - pB.x, pB.y - pA.x);
                if (pen < 0.0) { separated = true; break; }
                if (pen < minPen * 0.95 - 0.01) {
                    minPen = pen;
                    bestAxis = axis;
                    if (dot(d, axis) < 0.0) { bestAxis = -axis; }
                }
            }
            if (separated) { break; }
        }
    }

    if (separated) { return; }

    let n = bestAxis;

    // Reference face on A: most aligned with n
    var refFaceIdx = 0u;
    var refDmax = -1e30;
    for (var fi = 0u; fi < MAX_HULL_FACES; fi++) {
        if (fi >= metaA.faceCount) { break; }
        let fn0 = quatRotate(qA, hullFacePlane(metaA, fi, sA).xyz);
        let dd = dot(fn0, n);
        if (dd > refDmax) { refDmax = dd; refFaceIdx = fi; }
    }

    let refPlane = hullFacePlane(metaA, refFaceIdx, sA);
    let refNormal = quatRotate(qA, refPlane.xyz);
    let refIdxBase = hullFaceIdxBase(metaA, refFaceIdx);
    let refIdxCount = hullFaceIdxCount(metaA, refFaceIdx);

    // Incident face on B: most anti-aligned with n
    var incFaceIdx = 0u;
    var incDmin = 1e30;
    for (var fi = 0u; fi < MAX_HULL_FACES; fi++) {
        if (fi >= metaB.faceCount) { break; }
        let fn0 = quatRotate(qB, hullFacePlane(metaB, fi, sB).xyz);
        let dd = dot(fn0, n);
        if (dd < incDmin) { incDmin = dd; incFaceIdx = fi; }
    }

    let incIdxBase = hullFaceIdxBase(metaB, incFaceIdx);
    let incIdxCount = hullFaceIdxCount(metaB, incFaceIdx);

    // Load incident face vertices
    var clipIn: array<vec3f, MAX_CLIP_VERTS>;
    var clipOut: array<vec3f, MAX_CLIP_VERTS>;
    var clipCount = min(incIdxCount, MAX_CLIP_VERTS);
    for (var v = 0u; v < MAX_CLIP_VERTS; v++) {
        if (v >= clipCount) { break; }
        let vi = hullFaceVertIdx(incIdxBase, v);
        clipIn[v] = posB + quatRotate(qB, hullVertex(metaB, vi) * sB);
    }

    // Clip against reference face edge planes
    for (var ei = 0u; ei < MAX_FACE_VERTS; ei++) {
        if (ei >= refIdxCount) { break; }
        let vi = hullFaceVertIdx(refIdxBase, ei);
        let vj = hullFaceVertIdx(refIdxBase, (ei + 1u) % refIdxCount);
        let va = posA + quatRotate(qA, hullVertex(metaA, vi) * sA);
        let vb = posA + quatRotate(qA, hullVertex(metaA, vj) * sA);
        let edge0 = va - vb;
        let planeN = -cross(edge0, refNormal);
        let planeD = dot(va, planeN);
        var outCount = 0u;
        var a = clipIn[clipCount - 1u];
        var da = dot(planeN, a) - planeD;
        for (var v = 0u; v < MAX_CLIP_VERTS; v++) {
            if (v >= clipCount) { break; }
            let b = clipIn[v];
            let db = dot(planeN, b) - planeD;
            if ((da <= 1e-5) != (db <= 1e-5)) {
                var t = 0.0;
                let denom = da - db;
                if (abs(denom) > 1e-6) { t = clamp(da / denom, 0.0, 1.0); }
                if (outCount < MAX_CLIP_VERTS) { clipOut[outCount] = a + (b - a) * t; outCount++; }
            }
            if (db <= 1e-5) {
                if (outCount < MAX_CLIP_VERTS) { clipOut[outCount] = b; outCount++; }
            }
            a = b;
            da = db;
        }
        clipCount = outCount;
        for (var v = 0u; v < MAX_CLIP_VERTS; v++) {
            if (v >= clipCount) { break; }
            clipIn[v] = clipOut[v];
        }
    }

    // Collect all candidates behind reference face
    let localPlaneEq = refPlane.w;
    let worldPlaneEq = localPlaneEq - dot(refNormal, posA);
    var candidates: array<ManifoldCandidate, MAX_CANDIDATES>;
    var candCount = 0u;

    for (var v = 0u; v < MAX_CLIP_VERTS; v++) {
        if (v >= clipCount) { break; }
        let depth = dot(refNormal, clipIn[v]) + worldPlaneEq;
        if (depth <= 0.0 && candCount < MAX_CANDIDATES) {
            let pB0 = clipIn[v];
            let pA0 = pB0 - refNormal * depth;
            candidates[candCount] = ManifoldCandidate(pA0, pB0, depth, v);
            candCount++;
        }
    }

    // Reduce to 4 well-distributed contacts
    var selected: array<u32, 4>;
    let satCount = reduceManifold(&candidates, candCount, n, &selected);

    let bbBasisN = -n;
    let tb = tangentBasis(bbBasisN);
    let mu = sqrt(bA.friction * bB.friction);

    for (var s = 0u; s < satCount; s++) {
        let c = candidates[selected[s]];
        let rA_w = c.pointA - posA;
        let rB_w = c.pointB - posB;
        let rA = quatRotate(quatConj(qA), rA_w);
        let rB = quatRotate(quatConj(qB), rB_w);
        let bbCI = contactCInit(posA, rA_w, posB, rB_w, bbBasisN, tb[0], tb[1]);

        let fkey = (11u << 24u) | s;
        let wsKey = packKey(ai, bi, s);
        pushConstraintSearching(
            ai, i32(bi), fkey,
            bbBasisN, bbCI.x,
            tb[0], bbCI.y,
            tb[1], bbCI.z,
            rA, rB,
            mu,
            wsKey, ai, bi, 0u,
            -1e30, 0.0, 1e30,
        );
    }
    for (var s = satCount; s < MAX_PAIR_CONTACTS; s++) {
        resetWarmstartHash(packKey(ai, bi, s));
    }
}
`,pl=[`box-box`,`sphere-box`,`capsule-box`,`sphere-sphere`,`capsule-sphere`,`capsule-capsule`,`hull-box`,`hull-sphere`,`hull-capsule`,`hull-hull`],ml=[el,tl,nl,rl,ol,sl,ll,ul,dl,fl],hl=[`detectBoxBox`,`detectSphereBox`,`detectCapsuleBox`,`detectSphereSphere`,`detectCapsuleSphere`,`detectCapsuleCapsule`,`detectHullBox`,`detectHullSphere`,`detectHullCapsule`,`detectHullHull`];function gl(e){return`
${Zc}
${ml[e]}

const PAIR_TYPE: u32 = ${e}u;

@compute @workgroup_size(64)
fn narrowphase(@builtin(global_invocation_id) gid: vec3u) {
    let typeCount = atomicLoad(&solverState[${lc}u + PAIR_TYPE]);
    if (gid.x >= typeCount) { return; }
    let maxPerType = params.capacity * params.constraintMul;
    let base = PAIR_TYPE * maxPerType;
    let pairA = pairs[(base + gid.x) * 2u];
    let pairB = pairs[(base + gid.x) * 2u + 1u];
    ${hl[e]}(pairA, pairB);
}
`}var _l=`struct Body {
    pos: vec3f,
    mass: f32,
    vel: vec3f,
    momentX: f32,
    angVel: vec3f,
    radius: f32,
    inertial: vec3f,
    friction: f32,
    initial: vec3f,
    hullId: u32,
    quat: vec4f,
    inertialQuat: vec4f,
    initialQuat: vec4f,
    prevVel: vec3f,
    momentY: f32,
    prevAngVel: vec3f,
    momentZ: f32,
    cumAng: vec3f,
    gravity: f32,
    halfExtents: vec3f,
    colliderType: f32,
    collisionGroup: u32,
}`,vl=`
struct Params {
    dt: f32,
    gravity: f32,
    iterations: u32,
    alpha: f32,
    beta: f32,
    gamma: f32,
    bodyCount: u32,
    jointCount: u32,
    capacity: u32,
    constraintMul: u32,
    hashMul: u32,
    _pad2: u32,
}`,yl=`
fn quatMul(a: vec4f, b: vec4f) -> vec4f {
    return vec4f(
        a.w * b.x + a.x * b.w + a.y * b.z - a.z * b.y,
        a.w * b.y - a.x * b.z + a.y * b.w + a.z * b.x,
        a.w * b.z + a.x * b.y - a.y * b.x + a.z * b.w,
        a.w * b.w - a.x * b.x - a.y * b.y - a.z * b.z,
    );
}

fn quatConj(q: vec4f) -> vec4f {
    return vec4f(-q.x, -q.y, -q.z, q.w);
}

fn quatRotate(q: vec4f, v: vec3f) -> vec3f {
    let u = q.xyz;
    let t = 2.0 * cross(u, v);
    return v + q.w * t + cross(u, t);
}`,bl=`
const SHAPE_BOX: f32 = 0.0;
const SHAPE_SPHERE: f32 = 1.0;
const SHAPE_CAPSULE: f32 = 2.0;
const SHAPE_HULL: f32 = 3.0;
`,xl=`
${_l}
${Nn}
${vl}
${Vn}
${bl}

@group(0) @binding(0) var<storage, read> bodies: array<Body>;
@group(0) @binding(1) var<storage, read_write> bodyAABBs: array<InstanceAABB>;
@group(0) @binding(2) var<uniform> params: Params;
${yl}

fn hasNaN(v: vec3f) -> bool {
    return v.x != v.x || v.y != v.y || v.z != v.z;
}

const BROADPHASE_MARGIN: f32 = 0.04;

fn primitiveAABB(body: Body) -> array<vec3f, 2> {
    let margin = vec3f(BROADPHASE_MARGIN);
    if (body.colliderType == SHAPE_SPHERE) {
        let r = vec3f(body.radius);
        return array(body.pos - r - margin, body.pos + r + margin);
    }
    if (body.colliderType == SHAPE_CAPSULE) {
        let axis = quatRotate(body.quat, vec3f(0, body.halfExtents.y, 0));
        let tipA = body.pos + axis;
        let tipB = body.pos - axis;
        let lo = min(tipA, tipB);
        let hi = max(tipA, tipB);
        let r = vec3f(body.radius);
        return array(lo - r - margin, hi + r + margin);
    }
    let h = body.halfExtents;
    let ax = abs(quatRotate(body.quat, vec3f(h.x, 0, 0)));
    let ay = abs(quatRotate(body.quat, vec3f(0, h.y, 0)));
    let az = abs(quatRotate(body.quat, vec3f(0, 0, h.z)));
    let ext = ax + ay + az;
    return array(body.pos - ext - margin, body.pos + ext + margin);
}

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) gid: vec3u) {
    let idx = gid.x;
    if (idx >= params.bodyCount) { return; }

    let body = bodies[idx];
    let aabb = primitiveAABB(body);

    var out: InstanceAABB;
    out._pad0 = 0u;
    out._pad1 = 0u;
    if (hasNaN(aabb[0]) || hasNaN(aabb[1])) {
        out.minX = AABB_SENTINEL;
        out.minY = AABB_SENTINEL;
        out.minZ = AABB_SENTINEL;
        out.maxX = -AABB_SENTINEL;
        out.maxY = -AABB_SENTINEL;
        out.maxZ = -AABB_SENTINEL;
    } else {
        out.minX = aabb[0].x;
        out.minY = aabb[0].y;
        out.minZ = aabb[0].z;
        out.maxX = aabb[1].x;
        out.maxY = aabb[1].y;
        out.maxZ = aabb[1].z;
    }
    bodyAABBs[idx] = out;
}
`;async function Sl(e,t,n){let r=B(e,`physics-lbvh-bodyAABBs`,GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST,e=>e*32),i=e.createBuffer({label:`physics-lbvh-count`,size:4,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),a=e.createShaderModule({code:xl}),[o,s]=await Promise.all([e.createComputePipelineAsync({label:`physics-aabb`,layout:`auto`,compute:{module:a,entryPoint:`main`}}),Zn(e,{leafAABBs:r.buffer,countBuffer:i,maxLeaves:N(),label:`physics-lbvh`})]);return{bodyAABBs:r,countBuffer:i,lbvh:s,computeAABBsPipeline:o,computeAABBsBindGroup:rn(e,o.getBindGroupLayout(0),()=>[{binding:0,resource:{buffer:t.buffer}},{binding:1,resource:{buffer:r.buffer}},{binding:2,resource:{buffer:n}}]),cachedCapacity:N()}}var Cl=new Uint32Array(1);function wl(e,t,n,r,i){let a=N();a!==e.cachedCapacity&&(e.cachedCapacity=a,Qn(e.lbvh,n,e.bodyAABBs.buffer,a)),Cl[0]=r,n.queue.writeBuffer(e.countBuffer,0,Cl);let o=Math.ceil(r/64),s=R(t,i?.(`phys:aabb`));s.setPipeline(e.computeAABBsPipeline),s.setBindGroup(0,e.computeAABBsBindGroup.group),s.dispatchWorkgroups(o),s.end(),$n(e.lbvh,t,n,r,i)}function Tl(e){e.bodyAABBs.buffer.destroy(),e.countBuffer.destroy(),er(e.lbvh)}var El=new Map,Dl=[];function Ol(e,t,n,r){let i=El;i.clear();for(let n=0;n<t;n++){let t=e[n];t>0?i.set(t-1,!0):i.set(-t-1,!1)}let a=Dl;a.length=0;for(let[e,t]of i)if(!t||n.indexOf(e)>=0){let t=n.indexOf(e);t>=0&&a.push(t)}let o=[];if(a.length>0){a.sort((e,t)=>t-e);for(let e=0;e<a.length;e++){let t=a[e],r=n.length-1;t!==r&&(n[t]=n[r],o.push({removedIdx:t,lastIdx:r})),n.length--}}let s=[];for(let[e,t]of i)if(t&&!(n.indexOf(e)>=0)){if(n.length>=r)break;n.push(e),s.push(e)}return{removeOps:o,addEids:s}}function kl(e,t,n){let r=e.length+t.length,i=new Float32Array(r*20),a=new Uint32Array(i.buffer),o=0;for(let t of e){let e=o*20;i[e+0]=t.anchorAX,i[e+1]=t.anchorAY,i[e+2]=t.anchorAZ,a[e+3]=n.get(t.bodyA)??0,i[e+4]=t.anchorBX,i[e+5]=t.anchorBY,i[e+6]=t.anchorBZ,a[e+7]=n.get(t.bodyB)??0,a[e+8]=0,i[e+10]=t.stiffness,i[e+16]=t.fracture,o++}for(let e of t){let t=o*20;i[t+0]=e.anchorAX,i[t+1]=e.anchorAY,i[t+2]=e.anchorAZ,a[t+3]=n.get(e.bodyA)??0,i[t+4]=e.anchorBX,i[t+5]=e.anchorBY,i[t+6]=e.anchorBZ,a[t+7]=n.get(e.bodyB)??0,a[t+8]=1,i[t+9]=e.restLength,i[t+10]=e.stiffness,i[t+16]=e.fracture,o++}return i}function Al(e,t,n){let r=e[4];r>0&&console.warn(`[phys] tick=${t} CONSTRAINT OVERFLOW: ${r}, count=${e[0]}, max=${Zs()}, bodies=${n}`);let i=e[7];i>12&&console.warn(`[phys] tick=${t} COLOR OVERFLOW: scene needs ${i} colors, max=12`);let a=e[6];a>0&&console.warn(`[phys] tick=${t} HASH OVERFLOW: ${a} inserts failed, capacity=${Qs()}`);let o=e[5];o>0&&console.warn(`[phys] tick=${t} STACK OVERFLOW: ${o} BVH traversals hit limit`);let s=e[ic];s>0&&console.warn(`[phys] tick=${t} ADJACENCY OVERFLOW: ${s} edges dropped (MAX_DEGREE=32)`);let c=e[oc],l=Qs();c>l*.75&&console.warn(`[phys] tick=${t} HASH OCCUPANCY: ${c}/${l} (${(c/l*100).toFixed(1)}%)`)}var jl=Be(256),Ml=12,Nl=4,Pl=8,Fl=4;function Il(){let e=jl.all(),t=e.length;if(t===0)return{data:new Uint32Array(Ml),metaCount:0};let n=0,r=0,i=0,a=0;for(let t of e){n+=t.numVertices,r+=t.numFaces;for(let e of t.faces)i+=e.vertexIndices.length;a+=t.numUniqueEdges}let o=t*Ml,s=n*Nl,c=r*Pl,l=i,u=a*Fl,d=o+s+c+l+u,f=new ArrayBuffer(d*4),p=new Uint32Array(f),m=new Float32Array(f),h=o,g=h+s,_=g+c,v=_+l,y=0,b=0,x=0,S=0;for(let t=0;t<e.length;t++){let n=e[t],r=t*Ml;p[r+0]=h+y*Nl,p[r+1]=n.numVertices,p[r+2]=g+b*Pl,p[r+3]=n.numFaces,p[r+4]=v+S*Fl,p[r+5]=n.numUniqueEdges,m[r+6]=n.extents[0]>1e-12?1/n.extents[0]:0,m[r+7]=n.extents[1]>1e-12?1/n.extents[1]:0,m[r+8]=n.extents[2]>1e-12?1/n.extents[2]:0,p[r+9]=0,p[r+10]=0,p[r+11]=0;for(let e=0;e<n.numVertices;e++){let t=h+(y+e)*Nl;m[t+0]=n.vertices[e*3+0],m[t+1]=n.vertices[e*3+1],m[t+2]=n.vertices[e*3+2],m[t+3]=0}let i=0;for(let e=0;e<n.numFaces;e++){let t=n.faces[e],r=g+(b+e)*Pl;m[r+0]=t.plane[0],m[r+1]=t.plane[1],m[r+2]=t.plane[2],m[r+3]=t.plane[3],p[r+4]=_+x+i,p[r+5]=t.vertexIndices.length,p[r+6]=0,p[r+7]=0;for(let e=0;e<t.vertexIndices.length;e++)p[_+x+i+e]=t.vertexIndices[e];i+=t.vertexIndices.length}for(let e=0;e<n.numUniqueEdges;e++){let t=v+(S+e)*Fl;m[t+0]=n.uniqueEdges[e*3+0],m[t+1]=n.uniqueEdges[e*3+1],m[t+2]=n.uniqueEdges[e*3+2],m[t+3]=0}y+=n.numVertices,b+=n.numFaces,x+=i,S+=n.numUniqueEdges}return{data:p,metaCount:t}}Math.PI/180;var Ll=P(Float32Array,4,0),Rl={mass:I(Ll,4,0),friction:I(Ll,4,1),gravity:I(Ll,4,2),group:I(Ll,4,3)};F(Rl,{requires:[Ho],defaults:()=>({mass:1,friction:.5,gravity:1,group:0})});var zl=P(Float32Array,6,0),Bl={forceX:I(zl,6,0),forceY:I(zl,6,1),forceZ:I(zl,6,2),torqueX:I(zl,6,3),torqueY:I(zl,6,4),torqueZ:I(zl,6,5)};F(Bl,{requires:[Rl],defaults:()=>({forceX:0,forceY:0,forceZ:0,torqueX:0,torqueY:0,torqueZ:0})});var Vl=P(Float32Array,6,0),Hl={impulseX:I(Vl,6,0),impulseY:I(Vl,6,1),impulseZ:I(Vl,6,2),angularImpulseX:I(Vl,6,3),angularImpulseY:I(Vl,6,4),angularImpulseZ:I(Vl,6,5)};F(Hl,{requires:[Rl],defaults:()=>({impulseX:0,impulseY:0,impulseZ:0,angularImpulseX:0,angularImpulseY:0,angularImpulseZ:0})});var Ul=P(Float32Array,6,0),Wl={linearX:I(Ul,6,0),linearY:I(Ul,6,1),linearZ:I(Ul,6,2),angularX:I(Ul,6,3),angularY:I(Ul,6,4),angularZ:I(Ul,6,5)};F(Wl,{requires:[Rl],defaults:()=>({linearX:0,linearY:0,linearZ:0,angularX:0,angularY:0,angularZ:0})});var Gl={bodyA:[],bodyB:[],anchorAX:[],anchorAY:[],anchorAZ:[],anchorBX:[],anchorBY:[],anchorBZ:[],stiffness:[],fracture:[]};F(Gl,{defaults:()=>({anchorAX:0,anchorAY:0,anchorAZ:0,anchorBX:0,anchorBY:0,anchorBZ:0,stiffness:0,fracture:0})});var Kl={bodyA:[],bodyB:[],anchorAX:[],anchorAY:[],anchorAZ:[],anchorBX:[],anchorBY:[],anchorBZ:[],restLength:[],stiffness:[],fracture:[]};F(Kl,{defaults:()=>({anchorAX:0,anchorAY:0,anchorAZ:0,anchorBX:0,anchorBY:0,anchorBZ:0,restLength:0,stiffness:0,fracture:0})});var ql=P(Float32Array,4,0),q={speed:I(ql,4,0),maxSlope:I(ql,4,1),jumpHeight:I(ql,4,2),grounded:I(ql,4,3),mass:[],gravity:[],coyoteTime:[],moveX:[],moveZ:[],jump:[]};F(q,{requires:[Rl],defaults:()=>({speed:6,maxSlope:.7,jumpHeight:2.5,grounded:0,mass:70,gravity:50,coyoteTime:.1,moveX:0,moveZ:0,jump:0})});var Jl=64,Yl={dt:1/60,gravity:-10,iterations:4,alpha:.99,betaLin:1e5,betaAng:100,gamma:.999},Xl={};F(Xl,{requires:[Rl]});var Zl=L(`physics`),Ql=L(`contacts`);function $l(e,t){if(e.pendingChangeCount>=e.pendingChanges.length){let t=new Int32Array(e.pendingChanges.length*2);t.set(e.pendingChanges),e.pendingChanges=t}e.pendingChanges[e.pendingChangeCount++]=t}async function eu(e){let t=GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST,n=t|GPUBufferUsage.COPY_SRC,r=t,i=B(e,`physics-bodies`,n,e=>e*208),a=B(e,`physics-bodies-prev`,t,e=>e*208),o=B(e,`physics-bodyCols`,t,e=>e*5*16),s=B(e,`physics-constraints`,n,()=>Zs()*176),c=B(e,`physics-prevConstraints`,n,()=>Zs()*176),l=B(e,`physics-warmstarts`,t,()=>Qs()*64),u=B(e,`physics-solverState`,n,()=>vc()+yc()),d=new Uint32Array(Qs()).fill(4294967295);e.queue.writeBuffer(u.buffer,_c,d);let f={buffer:e.createBuffer({label:`physics-joints`,size:1280,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),capacity:16},p=B(e,`physics-csrCounts`,GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST,e=>(e+1)*4),m=e.createBuffer({label:`physics-indirect`,size:276,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.INDIRECT}),h=e.createBuffer({label:`physics-params`,size:Jl,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),g=B(e,`physics-unpackTransform`,n,e=>e*8*4),_=B(e,`physics-sizes`,r,e=>e*16),v=B(e,`physics-shapes`,r,e=>Math.ceil(e/4)*4),y=B(e,`physics-bodyProps`,r,e=>e*16),b=B(e,`physics-eids`,r,e=>e*4),x=B(e,`physics-forces`,t,e=>e*32),S=e.createBuffer({label:`physics-packParams`,size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),C=e.createBuffer({label:`physics-rebuildParams`,size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),w=B(e,`physics-pairs`,GPUBufferUsage.STORAGE,()=>10*Zs()*8),T={buffer:e.createBuffer({label:`physics-hullData`,size:32,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST})},E=B(e,`physics-hullIds`,r,e=>e*4),D=e.createShaderModule({code:Rc}),ee=e.createShaderModule({code:zc}),O=e.createShaderModule({code:Xc}),k=Array.from({length:10},(t,n)=>e.createShaderModule({code:gl(n)})),te=e.createShaderModule({code:Uc}),ne=e.createShaderModule({code:Wc}),re=e.createShaderModule({code:Bc}),ie=e.createShaderModule({code:Gc}),ae=e.createShaderModule({code:Vc}),oe=e.createShaderModule({code:Hc}),se=e.createShaderModule({code:Jc}),ce=e.createShaderModule({code:Yc}),A=GPUShaderStage.COMPUTE,le=[{binding:0,visibility:A,buffer:{type:`storage`}},{binding:1,visibility:A,buffer:{type:`uniform`}},{binding:2,visibility:A,buffer:{type:`storage`}},{binding:3,visibility:A,buffer:{type:`storage`}},{binding:4,visibility:A,buffer:{type:`storage`}},{binding:5,visibility:A,buffer:{type:`storage`}},{binding:6,visibility:A,buffer:{type:`read-only-storage`}},{binding:7,visibility:A,buffer:{type:`read-only-storage`}},{binding:8,visibility:A,buffer:{type:`read-only-storage`}}],ue=e.createBindGroupLayout({entries:le}),de=e.createBindGroupLayout({entries:[...le,{binding:9,visibility:A,buffer:{type:`read-only-storage`}},{binding:10,visibility:A,buffer:{type:`storage`}}]}),fe=e.createPipelineLayout({bindGroupLayouts:[de]}),pe=e.createBindGroupLayout({entries:[{binding:0,visibility:A,buffer:{type:`storage`}},{binding:1,visibility:A,buffer:{type:`read-only-storage`}}]}),me=e.createPipelineLayout({bindGroupLayouts:[ue,pe]}),he=e.createBindGroupLayout({entries:[{binding:0,visibility:A,buffer:{type:`storage`}},{binding:1,visibility:A,buffer:{type:`storage`}},{binding:2,visibility:A,buffer:{type:`read-only-storage`}},{binding:3,visibility:A,buffer:{type:`uniform`}}]}),ge=e.createPipelineLayout({bindGroupLayouts:[he]}),_e=e.createBindGroupLayout({entries:[{binding:0,visibility:A,buffer:{type:`read-only-storage`}},{binding:1,visibility:A,buffer:{type:`read-only-storage`}},{binding:2,visibility:A,buffer:{type:`storage`}},{binding:3,visibility:A,buffer:{type:`storage`}}]}),ve=e.createPipelineLayout({bindGroupLayouts:[_e]}),ye=e.createBindGroupLayout({entries:[{binding:0,visibility:A,buffer:{type:`storage`}},{binding:1,visibility:A,buffer:{type:`read-only-storage`}},{binding:2,visibility:A,buffer:{type:`read-only-storage`}},{binding:3,visibility:A,buffer:{type:`read-only-storage`}},{binding:4,visibility:A,buffer:{type:`storage`}},{binding:5,visibility:A,buffer:{type:`read-only-storage`}},{binding:6,visibility:A,buffer:{type:`uniform`}},{binding:7,visibility:A,buffer:{type:`storage`}}]}),be=e.createPipelineLayout({bindGroupLayouts:[ye]}),[xe,Se,Ce,we,Te,Ee,De,Oe,ke,Ae,je,Me,Ne,Pe,Fe]=await Promise.all([Promise.all([`warmstartBodies`,`detectJoints`,`initBodyCache`,`cacheContactC`,`solveDual`,`advanceIteration`,`computeVelocities`,`writebackWarmstarts`,`solvePrimal`,`advanceColor`,`resetColor`,`syncBodyCols`].map(async t=>[t,await e.createComputePipelineAsync({label:t,layout:fe,compute:{module:D,entryPoint:t}})])),Promise.all([`clearColorBuffers`,`countBodyConstraints`,`scatterBodyConstraints`,`buildAdjacencyList`,`graphColor`,`countColors`,`prefixSumColors`,`sortBodiesByColor`].map(async t=>[t,await e.createComputePipelineAsync({label:t,layout:fe,compute:{module:ee,entryPoint:t}})])),e.createComputePipelineAsync({label:`broadphase`,layout:me,compute:{module:O,entryPoint:`broadphase`}}),Promise.all(k.map((t,n)=>e.createComputePipelineAsync({label:`narrowphase-${pl[n]}`,layout:me,compute:{module:t,entryPoint:`narrowphase`}}))),e.createComputePipelineAsync({label:`packBodies`,layout:`auto`,compute:{module:te,entryPoint:`packBodies`}}),e.createComputePipelineAsync({label:`clearHash`,layout:ge,compute:{module:ne,entryPoint:`clearHash`}}),e.createComputePipelineAsync({label:`rebuildWarm`,layout:ge,compute:{module:ne,entryPoint:`rebuildWarm`}}),e.createComputePipelineAsync({label:`prepareIndirect`,layout:`auto`,compute:{module:re,entryPoint:`main`}}),e.createComputePipelineAsync({label:`syncTransforms`,layout:`auto`,compute:{module:ie,entryPoint:`syncTransforms`}}),e.createComputePipelineAsync({label:`readback`,layout:`auto`,compute:{module:ae,entryPoint:`readback`}}),e.createComputePipelineAsync({label:`emitContacts`,layout:ve,compute:{module:oe,entryPoint:`emitContacts`}}),Sl(e,i,h),Sn(e,p.buffer,N()+1),e.createComputePipelineAsync({label:`characterSweep`,layout:be,compute:{module:se,entryPoint:`characterSweep`}}),e.createComputePipelineAsync({label:`characterApply`,layout:be,compute:{module:ce,entryPoint:`characterApply`}})]),j=Object.fromEntries([...xe,...Se]),Ie=rn(e,he,()=>[{binding:0,resource:{buffer:u.buffer,offset:_c,size:Qs()*4}},{binding:1,resource:{buffer:l.buffer}},{binding:2,resource:{buffer:c.buffer}},{binding:3,resource:{buffer:C}}]),Le=rn(e,Oe.getBindGroupLayout(0),()=>[{binding:0,resource:{buffer:u.buffer}},{binding:1,resource:{buffer:m}}]),Re=()=>[{binding:0,resource:{buffer:i.buffer}},{binding:1,resource:{buffer:h}},{binding:2,resource:{buffer:s.buffer}},{binding:3,resource:{buffer:l.buffer}},{binding:4,resource:{buffer:f.buffer}},{binding:5,resource:{buffer:u.buffer}},{binding:6,resource:{buffer:Me.lbvh.treeNodes}},{binding:7,resource:{buffer:Me.lbvh.sortedIds}},{binding:8,resource:{buffer:Me.bodyAABBs.buffer}}],ze=rn(e,ue,Re),M=rn(e,de,()=>[...Re(),{binding:9,resource:{buffer:x.buffer}},{binding:10,resource:{buffer:o.buffer}}]),Be=rn(e,pe,()=>[{binding:0,resource:{buffer:w.buffer}},{binding:1,resource:{buffer:T.buffer}}]),Ve=rn(e,Te.getBindGroupLayout(0),()=>[{binding:0,resource:{buffer:_.buffer}},{binding:1,resource:{buffer:v.buffer}},{binding:2,resource:{buffer:y.buffer}},{binding:3,resource:{buffer:b.buffer}},{binding:4,resource:{buffer:i.buffer}},{binding:5,resource:{buffer:S}},{binding:6,resource:{buffer:g.buffer}},{binding:7,resource:{buffer:E.buffer}}]),He=rn(e,ke.getBindGroupLayout(0),()=>[{binding:0,resource:{buffer:i.buffer}},{binding:1,resource:{buffer:b.buffer}},{binding:2,resource:{buffer:g.buffer}},{binding:3,resource:{buffer:S}}]),Ue=B(e,`physics-compact`,GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC,()=>N()*28),We=e.createBuffer({label:`physics-compact-params`,size:4,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),Ge=rn(e,Ae.getBindGroupLayout(0),()=>[{binding:0,resource:{buffer:i.buffer}},{binding:1,resource:{buffer:Ue.buffer}},{binding:2,resource:{buffer:We}}]),Ke=e.createBuffer({label:`physics-contacts`,size:dc,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC}),qe=rn(e,_e,()=>[{binding:0,resource:{buffer:i.buffer}},{binding:1,resource:{buffer:s.buffer}},{binding:2,resource:{buffer:u.buffer}},{binding:3,resource:{buffer:Ke}}]),Je=e.createBuffer({label:`physics-character-data`,size:64,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST}),Ye=e.createBuffer({label:`physics-character-indices`,size:16,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),P=e.createBuffer({label:`physics-character-params`,size:4,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),Xe=e.createBuffer({label:`physics-character-ground`,size:16,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),Ze=rn(e,ye,()=>[{binding:0,resource:{buffer:i.buffer}},{binding:1,resource:{buffer:Me.lbvh.treeNodes}},{binding:2,resource:{buffer:Me.lbvh.sortedIds}},{binding:3,resource:{buffer:Me.bodyAABBs.buffer}},{binding:4,resource:{buffer:Je}},{binding:5,resource:{buffer:Ye}},{binding:6,resource:{buffer:P}},{binding:7,resource:{buffer:Xe}}]),Qe=e.createBuffer({label:`physics-character-readback`,size:64,usage:GPUBufferUsage.MAP_READ|GPUBufferUsage.COPY_DST}),$e=new ArrayBuffer(Jl),et=e.features.has(`timestamp-query`)?ir(e,1024):null;return{device:e,lbvh:Me,warmstartPipeline:j.warmstartBodies,clearHashPipeline:Ee,rebuildPipeline:De,bvhTraversalPipeline:Ce,narrowphasePipelines:we,pairBuffer:w,pairBindGroup:Be,detectJointsPipeline:j.detectJoints,initBodyCachePipeline:j.initBodyCache,cacheContactCPipeline:j.cacheContactC,dualPipeline:j.solveDual,advancePipeline:j.advanceIteration,velocityPipeline:j.computeVelocities,writebackPipeline:j.writebackWarmstarts,clearColorPipeline:j.clearColorBuffers,countBodyConstraintsPipeline:j.countBodyConstraints,scatterBodyConstraintsPipeline:j.scatterBodyConstraints,buildAdjacencyPipeline:j.buildAdjacencyList,graphColorPipeline:j.graphColor,countColorsPipeline:j.countColors,prefixSumColorsPipeline:j.prefixSumColors,sortBodiesPipeline:j.sortBodiesByColor,primalPipeline:j.solvePrimal,advanceColorPipeline:j.advanceColor,resetColorPipeline:j.resetColor,syncBodyColsPipeline:j.syncBodyCols,prepareIndirectPipeline:Oe,prepareIndirectBindGroup:Le,packPipeline:Te,syncTransformsPipeline:ke,syncTransformsBindGroup:He,compactPipeline:Ae,compactBindGroup:Ge,compactBuffer:Ue,compactParamsBuffer:We,emitContactsPipeline:je,emitContactsBindGroup:qe,contactsBuffer:Ke,bodyBuffer:i,bodyBufferPrev:a,bodyColsBuffer:o,constraintsBuffer:s,prevConstraintsBuffer:c,rebuildParamsBuffer:C,warmstartBuffer:l,solverStateBuffer:u,jointsBuffer:f.buffer,jointSlot:f,paramsBuffer:h,indirectBuffer:m,csrCountsBuffer:p,csrPrefixSum:Ne,unpackTransformBuffer:g,sizesBuffer:_,shapesBuffer:v,bodyPropsBuffer:y,eidsBuffer:b,packParamsBuffer:S,solverBindGroup:M,narrowBindGroup:ze,rebuildBindGroup:Ie,packBindGroup:Ve,hullDataBuffer:T,hullIdsBuffer:E,forceBuffer:x,paramsData:$e,paramsView:new DataView($e),physicsActive:!1,params:{...Yl},bodyEids:[],jointCount:0,jointsNeedUpload:!1,pendingChanges:new Int32Array(1024),pendingChangeCount:0,cachedCapacity:N(),profile:et,debugReadbackData:new Uint32Array(uc/4),transformReadbackData:new Float32Array,contactScratch:new Uint32Array(1152),contactScratchCount:0,contactScratchOverflow:0,readbackStaging:e.createBuffer({label:`physics-readback-staging`,size:uc+N()*28+dc,usage:GPUBufferUsage.MAP_READ|GPUBufferUsage.COPY_DST}),readbackPending:!1,readbackReady:!1,readbackTick:0,readbackGeneration:0,readbackBodyCount:0,lastSyncTick:-1,bodyGeneration:0,characterSweepPipeline:Pe,characterApplyPipeline:Fe,characterSweepBindGroup:Ze,characterBuffer:Je,characterIndicesBuffer:Ye,characterParamsBuffer:P,characterGroundBuffer:Xe,characterCount:0,characters:[],characterVerticalVelocity:new Map,characterCoyoteTimers:new Map,characterReadbackStaging:Qe,characterReadbackPending:!1}}var tu=new Uint32Array(4),nu=new Uint32Array(N()),ru=new Uint32Array(4),iu=N();function au(){let e=N();e!==iu&&(iu=e,nu=new Uint32Array(e))}var ou=new Uint32Array;function su(e){let t=Il(),n=t.data.byteLength;n!==0&&(n>e.hullDataBuffer.buffer.size&&(e.hullDataBuffer.buffer.destroy(),e.hullDataBuffer.buffer=e.device.createBuffer({label:`physics-hullData`,size:n,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),e.pairBindGroup.invalidate()),e.device.queue.writeBuffer(e.hullDataBuffer.buffer,0,t.data))}function cu(e){let t=e.bodyEids.length;if(t!==0){ou.length<t&&(ou=new Uint32Array(t));for(let n=0;n<t;n++){let t=e.bodyEids[n];if(Ho.shape[t]===M.Mesh){let e=Wo.geometry[t];ou[n]=jl.getByName(String(e))??0}else ou[n]=0}e.device.queue.writeBuffer(e.hullIdsBuffer.buffer,0,ou,0,t)}}function lu(e,t){let n=t.bodyEids,r=new Map;for(let e=0;e<n.length;e++)r.set(n[e],e);let i=[];for(let t of e.query([Gl]))i.push({anchorAX:Gl.anchorAX[t]??0,anchorAY:Gl.anchorAY[t]??0,anchorAZ:Gl.anchorAZ[t]??0,bodyA:Gl.bodyA[t],anchorBX:Gl.anchorBX[t]??0,anchorBY:Gl.anchorBY[t]??0,anchorBZ:Gl.anchorBZ[t]??0,bodyB:Gl.bodyB[t],stiffness:Gl.stiffness[t]??0,fracture:Gl.fracture[t]??0});let a=[];for(let t of e.query([Kl]))a.push({anchorAX:Kl.anchorAX[t]??0,anchorAY:Kl.anchorAY[t]??0,anchorAZ:Kl.anchorAZ[t]??0,bodyA:Kl.bodyA[t],anchorBX:Kl.anchorBX[t]??0,anchorBY:Kl.anchorBY[t]??0,anchorBZ:Kl.anchorBZ[t]??0,bodyB:Kl.bodyB[t],stiffness:Kl.stiffness[t]??0,fracture:Kl.fracture[t]??0,restLength:Kl.restLength[t]??0});let o=i.length+a.length;if(t.jointCount=o,o===0)return;let s=t.jointSlot;o>s.capacity&&(s.buffer.destroy(),s.capacity=o,s.buffer=t.device.createBuffer({label:`physics-joints`,size:o*80,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),t.jointsBuffer=s.buffer,t.solverBindGroup.invalidate(),t.narrowBindGroup.invalidate());let c=kl(i,a,r);t.device.queue.writeBuffer(s.buffer,0,c)}function uu(e,t,n){if(e.pendingChangeCount===0&&!e.jointsNeedUpload)return;let{removeOps:r,addEids:i}=Ol(e.pendingChanges,e.pendingChangeCount,e.bodyEids,N());e.pendingChangeCount=0;let a=i.length,o=e.bodyEids.length-a,s=e.bodyEids.length,c=e.device.queue;if(a>0){let n=t.max+1;au(),Qe(c,e.sizesBuffer.buffer,0,Mo,n),Qe(c,e.shapesBuffer.buffer,0,Ao,n),Qe(c,e.bodyPropsBuffer.buffer,0,Ll,n),su(e),cu(e)}if(a>0||r.length>0){au();for(let t=0;t<s;t++)nu[t]=e.bodyEids[t];c.writeBuffer(e.eidsBuffer.buffer,0,nu,0,s),e.bodyGeneration++}ru[0]=s,ru[1]=N(),ru[2]=o,c.writeBuffer(e.packParamsBuffer,0,ru);for(let t=0;t<r.length;t++){let{removedIdx:i,lastIdx:a}=r[t];n.copyBufferToBuffer(e.bodyBuffer.buffer,a*208,e.bodyBuffer.buffer,i*208,208),n.copyBufferToBuffer(e.bodyBufferPrev.buffer,a*208,e.bodyBufferPrev.buffer,i*208,208)}if(a>0){let t=R(n);t.setPipeline(e.packPipeline),t.setBindGroup(0,e.packBindGroup.group),t.dispatchWorkgroups(Math.ceil(s/64)),t.end()}(r.length>0||e.jointsNeedUpload)&&(lu(t,e),e.jointsNeedUpload=!1)}function du(e,t){let n=e.paramsView;n.setFloat32(0,e.params.dt,!0),n.setFloat32(4,e.params.gravity,!0),n.setUint32(8,e.params.iterations,!0),n.setFloat32(12,e.params.alpha,!0),n.setFloat32(16,e.params.betaLin,!0),n.setFloat32(20,e.params.gamma,!0),n.setUint32(24,t,!0),n.setUint32(28,e.jointCount,!0),n.setUint32(32,N(),!0),n.setUint32(36,Zs()/N(),!0),n.setUint32(40,Qs()/N(),!0),n.setFloat32(44,e.params.betaAng,!0),n.setUint32(48,0,!0),n.setUint32(52,0,!0),n.setUint32(56,0,!0),n.setUint32(60,0,!0),e.device.queue.writeBuffer(e.paramsBuffer,0,e.paramsData)}var J=new Float32Array,fu=new Map,pu=[];function mu(e,t){let n=e.bodyEids.length;if(n===0)return;let r=e.bodyEids,i=fu;i.clear();for(let e=0;e<r.length;e++)i.set(r[e],e);let a=n*8;J.length<a?J=new Float32Array(a):J.fill(0,0,a);let o=!1;for(let e of t.query([Bl])){let t=i.get(e);if(t===void 0)continue;o=!0;let n=t*8;J[n]=Bl.forceX[e],J[n+1]=Bl.forceY[e],J[n+2]=Bl.forceZ[e],J[n+3]=Bl.torqueX[e],J[n+4]=Bl.torqueY[e],J[n+5]=Bl.torqueZ[e]}pu.length=0;let s=1/e.params.dt;for(let e of t.query([Hl])){let t=i.get(e);if(t===void 0)continue;o=!0;let n=t*8;J[n]+=Hl.impulseX[e]*s,J[n+1]+=Hl.impulseY[e]*s,J[n+2]+=Hl.impulseZ[e]*s,J[n+3]+=Hl.angularImpulseX[e]*s,J[n+4]+=Hl.angularImpulseY[e]*s,J[n+5]+=Hl.angularImpulseZ[e]*s,pu.push(e)}for(let e of pu)t.removeComponent(e,Hl);pu.length=0;for(let e of t.query([Wl])){let t=i.get(e);if(t===void 0)continue;o=!0;let n=t*8;J[n]=Wl.linearX[e],J[n+1]=Wl.linearY[e],J[n+2]=Wl.linearZ[e],J[n+3]=Wl.angularX[e],J[n+4]=Wl.angularY[e],J[n+5]=Wl.angularZ[e],J[n+6]=1,pu.push(e)}for(let e of pu)t.removeComponent(e,Wl);o&&e.device.queue.writeBuffer(e.forceBuffer.buffer,0,J,0,a)}var hu=new Float32Array;function gu(e,t){if(e.bodyEids.length===0)return;let n=N(),r=e.device.queue,i=e.unpackTransformBuffer.buffer;r.writeBuffer(i,0,H.posX,0,n),r.writeBuffer(i,n*4,H.posY,0,n),r.writeBuffer(i,2*n*4,H.posZ,0,n),r.writeBuffer(i,3*n*4,H.quatX,0,n),r.writeBuffer(i,4*n*4,H.quatY,0,n),r.writeBuffer(i,5*n*4,H.quatZ,0,n),r.writeBuffer(i,6*n*4,H.quatW,0,n),hu.length<n?hu=new Float32Array(n):hu.fill(0);for(let n of e.bodyEids)t.hasComponent(n,Xl)&&(hu[n]=1);r.writeBuffer(i,7*n*4,hu,0,n)}var _u=8,vu=_u*4,yu=new Float32Array,bu=new Uint32Array,xu=new Uint32Array(1),Su=new Map;function Cu(e){let t=e.characters,n=t.length;if(e.characterCount=n,n===0)return;let r=e.bodyEids;Su.clear();for(let e=0;e<r.length;e++)Su.set(r[e],e);bu.length<n&&(bu=new Uint32Array(n)),yu.length<n*_u&&(yu=new Float32Array(n*_u)),yu.fill(0,0,n*_u);for(let e=0;e<n;e++){let n=t[e];bu[e]=Su.get(n)??0,yu[e*_u]=q.maxSlope[n],yu[e*_u+5]=q.mass[n]}let i=n*4;e.characterIndicesBuffer.size<i&&(e.characterIndicesBuffer.destroy(),e.characterIndicesBuffer=e.device.createBuffer({label:`physics-character-indices`,size:i,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),e.characterSweepBindGroup.invalidate()),e.device.queue.writeBuffer(e.characterIndicesBuffer,0,bu,0,n);let a=n*vu;e.characterBuffer.size<a&&(e.characterBuffer.destroy(),e.characterBuffer=e.device.createBuffer({label:`physics-character-data`,size:a,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST}),e.characterSweepBindGroup.invalidate());let o=n*4;if(e.characterGroundBuffer.size<o){e.characterGroundBuffer.destroy(),e.characterGroundBuffer=e.device.createBuffer({label:`physics-character-ground`,size:o,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),e.characterSweepBindGroup.invalidate();let t=new Uint32Array(n);t.fill(4294967295),e.device.queue.writeBuffer(e.characterGroundBuffer,0,t)}xu[0]=n,e.device.queue.writeBuffer(e.characterParamsBuffer,0,xu)}function wu(e){e.characterCount!==0&&e.device.queue.writeBuffer(e.characterBuffer,0,yu,0,e.characterCount*_u)}function Tu(e){let t=e.params.dt,n=e.characterVerticalVelocity,r=e.characterCoyoteTimers;for(let i=0;i<e.characters.length;i++){let a=e.characters[i],o=q.grounded[a]>.5,s=q.coyoteTime[a]??.1,c=r.get(a)??0,l=q.gravity[a]??50,u=Math.sqrt(2*l*q.jumpHeight[a]),d=q.jump[a]>.5,f=n.get(a)??0;o?(c=s,f=0,d&&(f=u,c=0)):(c-=t,f-=l*t,c>0&&d&&(f=u,c=0)),n.set(a,f),r.set(a,c);let p=i*_u;yu[p+2]=q.moveX[a]*t,yu[p+3]=f*t,yu[p+4]=q.moveZ[a]*t}}function Eu(e){if(e.characterCount===0||e.characterReadbackPending)return;let t=e.characterCount*vu;e.characterReadbackStaging.size<t&&(e.characterReadbackStaging.destroy(),e.characterReadbackStaging=e.device.createBuffer({label:`physics-character-readback`,size:t,usage:GPUBufferUsage.MAP_READ|GPUBufferUsage.COPY_DST})),e.characterReadbackPending=!0;let n=e.bodyGeneration,r=e.characterCount,i=e.characters.slice(),a=e.device.createCommandEncoder();a.copyBufferToBuffer(e.characterBuffer,0,e.characterReadbackStaging,0,t),e.device.queue.submit([a.finish()]),e.characterReadbackStaging.mapAsync(GPUMapMode.READ,0,t).then(()=>{if(e.bodyGeneration!==n){e.characterReadbackStaging.unmap(),e.characterReadbackPending=!1;return}let a=e.characterReadbackStaging.getMappedRange(0,t),o=new Uint32Array(a);for(let e=0;e<r&&e<i.length;e++)q.grounded[i[e]]=o[e*_u+1]>0?1:0;e.characterReadbackStaging.unmap(),e.characterReadbackPending=!1},()=>{e.characterReadbackPending=!1})}function Y(e,t,n,r,i){let a=R(e,i);a.setPipeline(t),a.setBindGroup(0,n),a.dispatchWorkgroups(r),a.end()}function Du(e,t,n,r,i,a){let o=R(e,a);o.setPipeline(t),o.setBindGroup(0,n),o.dispatchWorkgroupsIndirect(r,i),o.end()}function Ou(e,t,n){let r=Math.ceil(t/64),i=e.profile;i&&(ur(i),sr(i));let a=Math.ceil(Qs()/64),o=e.rebuildBindGroup.group,s=e=>i?or(i,e):void 0;tu[0]=0,tu[1]=Qs(),tu[2]=0,tu[3]=0,e.device.queue.writeBuffer(e.rebuildParamsBuffer,0,tu);let c=e.debugReadbackData[0],l=c>0?c*176:Zs()*176;n.copyBufferToBuffer(e.solverStateBuffer.buffer,0,e.rebuildParamsBuffer,0,4),Y(n,e.prepareIndirectPipeline,e.prepareIndirectBindGroup.group,1),Y(n,e.syncTransformsPipeline,e.syncTransformsBindGroup.group,r),e.characterCount>0&&Y(n,e.characterApplyPipeline,e.characterSweepBindGroup.group,Math.ceil(e.characterCount/64),s(`phys:characterApply`)),n.copyBufferToBuffer(e.bodyBuffer.buffer,0,e.bodyBufferPrev.buffer,0,t*208),n.copyBufferToBuffer(e.constraintsBuffer.buffer,0,e.prevConstraintsBuffer.buffer,0,l),Y(n,e.clearHashPipeline,o,a,s(`phys:rebuild`)),Du(n,e.rebuildPipeline,o,e.indirectBuffer,144,s(`phys:rebuild`)),wl(e.lbvh,n,e.device,t,s),n.clearBuffer(e.solverStateBuffer.buffer,0,uc);let u=e.solverBindGroup.group,d=e.narrowBindGroup.group,f=e.pairBindGroup.group,p=R(n,s(`phys:broadphase`));p.setPipeline(e.bvhTraversalPipeline),p.setBindGroup(0,d),p.setBindGroup(1,f),p.dispatchWorkgroups(r),p.end(),Y(n,e.prepareIndirectPipeline,e.prepareIndirectBindGroup.group,1);let m=R(n,s(`phys:narrowphase`));for(let t=0;t<10;t++)m.setPipeline(e.narrowphasePipelines[t]),m.setBindGroup(0,d),m.setBindGroup(1,f),m.dispatchWorkgroupsIndirect(e.indirectBuffer,(13+t)*12);m.end(),Y(n,e.detectJointsPipeline,u,Math.ceil(e.jointSlot.capacity/64),s(`phys:broadphase`)),Y(n,e.warmstartPipeline,u,r,s(`phys:warmstart`)),n.clearBuffer(e.forceBuffer.buffer,0,t*32),Y(n,e.prepareIndirectPipeline,e.prepareIndirectBindGroup.group,1),Y(n,e.initBodyCachePipeline,u,r,s(`phys:warmstart`)),Du(n,e.cacheContactCPipeline,u,e.indirectBuffer,144,s(`phys:warmstart`)),Y(n,e.clearColorPipeline,u,r,s(`phys:coloring`)),Du(n,e.countBodyConstraintsPipeline,u,e.indirectBuffer,144,s(`phys:coloring`)),n.copyBufferToBuffer(e.solverStateBuffer.buffer,vc()+pc()*4,e.csrCountsBuffer.buffer,0,(N()+1)*4);{let t=R(n,s(`phys:coloring`));Tn(e.csrPrefixSum,t),t.end()}n.copyBufferToBuffer(e.csrCountsBuffer.buffer,0,e.solverStateBuffer.buffer,vc()+fc()*4,(N()+1)*4),n.copyBufferToBuffer(e.csrCountsBuffer.buffer,0,e.solverStateBuffer.buffer,vc()+pc()*4,(N()+1)*4),Du(n,e.scatterBodyConstraintsPipeline,u,e.indirectBuffer,144,s(`phys:coloring`));let h=e.params.iterations;Y(n,e.buildAdjacencyPipeline,u,r,s(`phys:coloring`));for(let t=0;t<16;t++)Y(n,e.graphColorPipeline,u,r,s(`phys:coloring`));Y(n,e.countColorsPipeline,u,r,s(`phys:coloring`)),Y(n,e.prefixSumColorsPipeline,u,1,s(`phys:coloring`)),Y(n,e.prepareIndirectPipeline,e.prepareIndirectBindGroup.group,1,s(`phys:coloring`)),Y(n,e.sortBodiesPipeline,u,r,s(`phys:coloring`)),Y(n,e.syncBodyColsPipeline,u,r,s(`phys:solve`));let g=e.debugReadbackData[7]|0,_=g>0?Math.min(12,g+2):12;for(let t=0;t<h;t++){for(let t=0;t<_;t++)Du(n,e.primalPipeline,u,e.indirectBuffer,t*12,s(`phys:solve`)),t<_-1&&Y(n,e.advanceColorPipeline,u,1);Y(n,e.resetColorPipeline,u,1),Du(n,e.dualPipeline,u,e.indirectBuffer,144,s(`phys:dual`)),Y(n,e.advancePipeline,u,1,s(`phys:dual`))}if(Y(n,e.velocityPipeline,u,r,s(`phys:dual`)),Du(n,e.writebackPipeline,u,e.indirectBuffer,144,s(`phys:writeback`)),Du(n,e.emitContactsPipeline,e.emitContactsBindGroup.group,e.indirectBuffer,144,s(`phys:contacts`)),e.characterCount>0){Y(n,e.characterSweepPipeline,e.characterSweepBindGroup.group,Math.ceil(e.characterCount/64),s(`phys:characterSweep`));for(let t=0;t<e.characterCount;t++){let r=bu[t];n.copyBufferToBuffer(e.bodyBuffer.buffer,r*208,e.bodyBufferPrev.buffer,r*208,208)}}i&&cr(n,i),e.physicsActive=!0,e.device.pushErrorScope(`validation`),e.device.queue.submit([n.finish()]),e.device.popErrorScope().then(e=>{e&&console.error(`PHYSICS VALIDATION ERROR:`,e.message)})}var ku=new Uint32Array(1);function Au(e,t){if(e.readbackPending)return;let n=e.bodyEids.length;if(n===0)return;e.readbackPending=!0,e.readbackGeneration=e.bodyGeneration,e.readbackBodyCount=n,e.readbackTick=t;let r=n*28,i=uc+r,a=i+dc;e.readbackStaging.size<a&&(e.readbackStaging.destroy(),e.readbackStaging=e.device.createBuffer({label:`physics-readback-staging`,size:a,usage:GPUBufferUsage.MAP_READ|GPUBufferUsage.COPY_DST})),e.transformReadbackData.length<n*7&&(e.transformReadbackData=new Float32Array(n*7)),ku[0]=n,e.device.queue.writeBuffer(e.compactParamsBuffer,0,ku);let o=e.device.createCommandEncoder(),s=Math.ceil(n/64);Y(o,e.compactPipeline,e.compactBindGroup.group,s),o.copyBufferToBuffer(e.solverStateBuffer.buffer,0,e.readbackStaging,0,uc),o.copyBufferToBuffer(e.compactBuffer.buffer,0,e.readbackStaging,uc,r),o.copyBufferToBuffer(e.contactsBuffer,0,e.readbackStaging,i,dc),e.device.queue.submit([o.finish()]),e.readbackStaging.mapAsync(GPUMapMode.READ,0,a).then(()=>{if(e.readbackGeneration!==e.bodyGeneration){e.readbackStaging.unmap(),e.readbackPending=!1;return}let t=e.readbackStaging.getMappedRange(0,a),r=new ArrayBuffer(a);new Uint8Array(r).set(new Uint8Array(t)),e.readbackStaging.unmap(),e.debugReadbackData.set(new Uint32Array(r,0,uc/4)),e.transformReadbackData.set(new Float32Array(r,uc,n*7)),e.contactScratch.set(new Uint32Array(r,i,1152)),e.readbackReady=!0,e.readbackPending=!1},()=>{e.readbackPending=!1})}function ju(e,t){if(t.readbackGeneration!==t.bodyGeneration)return;let n=t.readbackTick,r=t.readbackBodyCount;Al(t.debugReadbackData,n,r);let i=t.debugReadbackData[sc],a=t.debugReadbackData[cc];t.contactScratchCount=Math.min(i,128),t.contactScratchOverflow=a,a>0&&console.warn(`[phys] tick=${n} CONTACT OVERFLOW: ${a} dropped (cap=128)`);let o=Ql.from(e);if(o){let e=o.prevData;o.prevData=o.currentData,o.prevCount=o.currentCount,o.prevOverflow=o.currentOverflow,o.prevTick=o.currentTick,o.currentData=e,o.currentData.set(t.contactScratch),o.currentCount=t.contactScratchCount,o.currentOverflow=a,o.currentTick=n}let s=t.transformReadbackData,{posX:c,posY:l,posZ:u,quatX:d,quatY:f,quatZ:p,quatW:m}=li,h=t.bodyEids,g=t.characters;for(let e=0;e<r;e++){let t=h[e];if(Rl.mass[t]<=0&&!g.includes(t))continue;let n=e*7;c[t]=s[n],l[t]=s[n+1],u[t]=s[n+2],d[t]=s[n+3],f[t]=s[n+4],p[t]=s[n+5],m[t]=s[n+6]}t.lastSyncTick=n}var Mu={group:`fixed`,dispose(e){let t=Zl.from(e);t&&(t.bodyBuffer.buffer.destroy(),t.bodyBufferPrev.buffer.destroy(),t.bodyColsBuffer.buffer.destroy(),t.constraintsBuffer.buffer.destroy(),t.prevConstraintsBuffer.buffer.destroy(),t.rebuildParamsBuffer.destroy(),t.warmstartBuffer.buffer.destroy(),t.solverStateBuffer.buffer.destroy(),t.jointsBuffer.destroy(),t.paramsBuffer.destroy(),t.indirectBuffer.destroy(),t.csrCountsBuffer.buffer.destroy(),t.unpackTransformBuffer.buffer.destroy(),t.sizesBuffer.buffer.destroy(),t.shapesBuffer.buffer.destroy(),t.bodyPropsBuffer.buffer.destroy(),t.eidsBuffer.buffer.destroy(),t.packParamsBuffer.destroy(),t.readbackStaging.destroy(),t.compactBuffer.buffer.destroy(),t.compactParamsBuffer.destroy(),t.pairBuffer.buffer.destroy(),t.hullDataBuffer.buffer.destroy(),t.hullIdsBuffer.buffer.destroy(),t.characterBuffer.destroy(),t.characterIndicesBuffer.destroy(),t.characterParamsBuffer.destroy(),t.characterGroundBuffer.destroy(),t.characterReadbackStaging.destroy(),wn(t.csrPrefixSum),Tl(t.lbvh),t.profile&&(t.profile.querySet.destroy(),t.profile.resolveBuffer.destroy(),t.profile.readBuffer.destroy()))},update(e){let t=Zl.from(e);if(!t)return;if(N()!==t.cachedCapacity){t.cachedCapacity=N(),Cn(t.csrPrefixSum,t.csrCountsBuffer.buffer,N()+1);for(let e of t.bodyEids)$l(t,e+1);t.bodyEids.length=0}t.readbackReady&&=(ju(e,t),!1);let n=t.device.createCommandEncoder();uu(t,e,n),Cu(t),Tu(t),wu(t),gu(t,e),mu(t,e);let r=t.bodyEids.length;if(r===0){t.device.queue.submit([n.finish()]);return}du(t,r),Ou(t,r,n),t.profile&&lr(t.profile),Au(t,e.time.fixedTick),Eu(t)}};function Nu(e,t,n,r,i,a){let o=null,s=null,c=null,l=null,u=null;return{name:`physics-interpolation`,scope:`frame`,inputs:[`matrices`],outputs:[`matrices`],async prepare(n){let r=n.createShaderModule({code:Kc});o=await n.createComputePipelineAsync({label:`interpolate`,layout:`auto`,compute:{module:r,entryPoint:`interpolate`}}),c=n.createBuffer({label:`interp-params`,size:8,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});let i=c;s=rn(n,o.getBindGroupLayout(0),()=>[{binding:0,resource:{buffer:e.bodyBufferPrev.buffer}},{binding:1,resource:{buffer:e.bodyBuffer.buffer}},{binding:2,resource:{buffer:e.eidsBuffer.buffer}},{binding:3,resource:{buffer:i}},{binding:4,resource:{buffer:t.buffer}}]),l=new Float32Array(2),u=new Uint32Array(l.buffer)},execute(e){if(!o||!s||!c||!l||!u||!i()||a())return;let t=r();if(t===0)return;l[0]=n(),u[1]=t,e.queue.writeBuffer(c,0,l);let d=R(e.encoder,e.timestampWrites?.(`physics-interpolation`));d.setPipeline(o),d.setBindGroup(0,s.group),d.dispatchWorkgroups(Math.ceil(t/64)),d.end()}}}var Pu={name:`Physics`,dependencies:[cn,Js],systems:[Mu],components:{Body:Rl,Force:Bl,Impulse:Hl,Velocity:Wl,BallJoint:Gl,SpringJoint:Kl,Character:q,Move:Xl},async initialize(e){let t=on.from(e);if(!t){console.error(`PhysicsPlugin: Compute resource not available`);return}let n=await eu(t.device);e.setResource(Zl,n),e.setResource(Ql,{prevData:new Uint32Array(1152),prevCount:0,prevOverflow:0,prevTick:-1,currentData:new Uint32Array(1152),currentCount:0,currentOverflow:0,currentTick:-1}),e.observe(s(Rl),e=>$l(n,e+1)),e.observe(c(Rl),e=>$l(n,-(e+1)));let r=()=>{n.jointsNeedUpload=!0};e.observe(s(Gl),r),e.observe(c(Gl),r),e.observe(s(Kl),r),e.observe(c(Kl),r),e.observe(s(q),e=>{n.characters.push(e)}),e.observe(c(q),e=>{let t=n.characters.indexOf(e);t>=0&&n.characters.splice(t,1),n.characterVerticalVelocity.delete(e),n.characterCoyoteTimers.delete(e)});let i=qs.from(e);if(i){let r=Nu(n,i.matrices,()=>e.scheduler.accumulator/me.FIXED_DT,()=>n.bodyEids.length,()=>n.physicsActive,()=>n.pendingChangeCount>0);t.graph.add(r)}n.profile&&rr.from(e)?.push(n.profile.durations)}},X={yaw:[],pitch:[],speed:[],sprint:[],sensitivity:[],eyeHeight:[],jumpBuffer:[]};F(X,{requires:[H],defaults:()=>({yaw:0,pitch:0,speed:6,sprint:1,sensitivity:1.5,eyeHeight:.7,jumpBuffer:.1})});var Fu=L(`pointerLock`),Iu=Math.PI/2-.01,Lu=new Map,Ru=new Map,zu=new Map;function Bu(e,t){let n=Lu.get(t);if(n!==void 0)return n;for(let r of e.query([te(ue.relation,t),W])){n=r;break}if(n===void 0)return console.warn(`Player entity ${t} has Character but no Camera child. Add a camera entity as a child.`),-1;Lu.set(t,n);let r=new Float64Array(3),i=new Float64Array(3);return r[0]=i[0]=H.posX[t],r[1]=i[1]=H.posY[t],r[2]=i[2]=H.posZ[t],Ru.set(t,r),zu.set(t,i),n}var Vu={name:`Player`,systems:[{group:`fixed`,last:!0,update(e){for(let t of e.query([X,q,H])){let e=Ru.get(t),n=zu.get(t);!e||!n||(e[0]=n[0],e[1]=n[1],e[2]=n[2],n[0]=H.posX[t],n[1]=H.posY[t],n[2]=H.posZ[t])}}},{group:`simulation`,setup(e){let t=fr.from(e);if(!t||t.size===0)return;let n=t.values().next().value.element;if(!n)return;let r={canvas:n,locked:!1,deltaX:0,deltaY:0,onClick:()=>{let t=!1;for(let n of e.query([X])){t=!0;break}t&&n.requestPointerLock().catch(()=>{})},onChange:()=>{r.locked=document.pointerLockElement===n,r.locked&&document.activeElement instanceof HTMLElement&&document.activeElement.blur()},onMove:e=>{r.locked&&(r.deltaX+=e.movementX,r.deltaY+=e.movementY)}};n.addEventListener(`click`,r.onClick),document.addEventListener(`pointerlockchange`,r.onChange),document.addEventListener(`mousemove`,r.onMove),e.setResource(Fu,r),e.observe(c(X),e=>{Lu.delete(e),Ru.delete(e),zu.delete(e)})},update(e){let t=kr.from(e),n=Fu.from(e);if(!t||!n)return;let r=e.time.deltaTime;for(let i of e.query([X,H])){let a=e.hasComponent(i,q);if(n.locked){let e=X.sensitivity[i]/n.canvas.clientHeight;X.yaw[i]-=n.deltaX*e,X.pitch[i]=ke(X.pitch[i]-n.deltaY*e,-Iu,Iu)}if(a){let n=0,r=0;t.isKeyDown(`KeyW`)&&--r,t.isKeyDown(`KeyS`)&&(r+=1),t.isKeyDown(`KeyA`)&&--n,t.isKeyDown(`KeyD`)&&(n+=1);let a=Math.sqrt(n*n+r*r);if(a>0){let e=t.isKeyDown(`ShiftLeft`)||t.isKeyDown(`ShiftRight`),o=q.speed[i]*(e?X.sprint[i]:1)/a,s=X.yaw[i],c=Math.cos(s),l=Math.sin(s);q.moveX[i]=(r*l+n*c)*o,q.moveZ[i]=(r*c-n*l)*o}else q.moveX[i]=0,q.moveZ[i]=0;q.jump[i]=t.isKeyDown(`Space`)||t.isKeyPressedWithin(`Space`,X.jumpBuffer[i])?1:0;let o=Bu(e,i);if(o<0)continue;let s=Ru.get(i),c=zu.get(i);if(s&&c){let t=Math.min(e.scheduler.accumulator/me.FIXED_DT,1),n=H.posX[i],r=H.posY[i],a=H.posZ[i];H.posX[o]=s[0]+(c[0]-s[0])*t-n,H.posY[o]=s[1]+(c[1]-s[1])*t-r+X.eyeHeight[i],H.posZ[o]=s[2]+(c[2]-s[2])*t-a}let l=X.yaw[i]*.5,u=X.pitch[i]*.5,d=Math.sin(l),f=Math.cos(l),p=Math.sin(u),m=Math.cos(u);H.quatX[o]=f*p,H.quatY[o]=d*m,H.quatZ[o]=-d*p,H.quatW[o]=f*m}else{if(n.locked){let e=0,n=0;t.isKeyDown(`KeyW`)&&--n,t.isKeyDown(`KeyS`)&&(n+=1),t.isKeyDown(`KeyA`)&&--e,t.isKeyDown(`KeyD`)&&(e+=1);let a=t.isKeyDown(`ShiftLeft`)||t.isKeyDown(`ShiftRight`),o=X.speed[i]*.5*(a?X.sprint[i]:1),s=Math.sqrt(e*e+n*n);if(s>0){let t=o*r/s,a=X.yaw[i],c=Math.cos(a),l=Math.sin(a);H.posX[i]+=(n*l+e*c)*t,H.posZ[i]+=(n*c-e*l)*t}}let e=X.yaw[i]*.5,a=X.pitch[i]*.5,o=Math.sin(e),s=Math.cos(e),c=Math.sin(a),l=Math.cos(a);H.quatX[i]=s*c,H.quatY[i]=o*l,H.quatZ[i]=-o*c,H.quatW[i]=s*l}}n.deltaX=0,n.deltaY=0},dispose(e){Lu.clear(),Ru.clear(),zu.clear();let t=Fu.from(e);t&&(t.locked&&document.exitPointerLock(),t.canvas.removeEventListener(`click`,t.onClick),document.removeEventListener(`pointerlockchange`,t.onChange),document.removeEventListener(`mousemove`,t.onMove),e.deleteResource(Fu))}}],components:{Player:X},dependencies:[Br]},Hu=vo*2,Uu=`
@group(0) @binding(0) var<storage, read_write> indirect: array<u32>;

const TOTAL_SLOTS: u32 = ${Hu}u;
const INDIRECT_STRIDE: u32 = 5u;

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    if (gid.x >= TOTAL_SLOTS) { return; }
    indirect[gid.x * INDIRECT_STRIDE + 1u] = 0u;
}
`;function Wu(){return`
${Ys}

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    if (gid.x >= params.entityCount) { return; }

    let sphere = computeWorldSphere(gid.x);

    if (!frustumTest(sphere.center, sphere.radius)) { return; }

    emitVisible(sphere);
}
`}function Gu(e){let t=null,n=null,r=null,i=null,a=null,o=null,s=null,c=N(),l=new ArrayBuffer(112),u=new Float32Array(l),d=new Uint32Array(l),f=new Float32Array(24),p=new Float32Array(256*8);return{nodes:[{name:`frustum-cull`,inputs:[`shadow-atlas`,`point-shadow-atlas`],outputs:[`culled`],async prepare(c){let l=Wu(),u=c.createShaderModule({code:l}),d=c.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:`uniform`}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:`read-only-storage`}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:`read-only-storage`}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:`read-only-storage`}},{binding:4,visibility:GPUShaderStage.COMPUTE,buffer:{type:`read-only-storage`}}]}),f=c.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:`storage`}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:`storage`}}]});t=await c.createComputePipelineAsync({label:`frustum-cull`,layout:c.createPipelineLayout({bindGroupLayouts:[d,f]}),compute:{module:u,entryPoint:`main`}}),i=c.createBuffer({label:`frustum-cull-params`,size:112,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),a=c.createBuffer({label:`frustum-shape-aabbs`,size:256*8*4,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST});let p=c.createShaderModule({code:Uu});n=await c.createComputePipelineAsync({label:`zero-instance`,layout:`auto`,compute:{module:p,entryPoint:`main`}}),r=c.createBindGroup({layout:n.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:e.batching.indirect}}]}),o=c.createBindGroup({layout:d,entries:[{binding:0,resource:{buffer:i}},{binding:1,resource:{buffer:e.matrices.buffer}},z(2,e.sizes),{binding:3,resource:{buffer:a}},{binding:4,resource:{buffer:e.batching.cullEntities.buffer}}]}),s=c.createBindGroup({layout:f,entries:[{binding:0,resource:{buffer:e.batching.indirect}},{binding:1,resource:{buffer:e.batching.entityIds.buffer}}]})},execute(m){if(!t||!i||!a||!n||!r)return;N()!==c&&(c=N(),o=null,s=null),(!o||!s)&&(o=m.device.createBindGroup({layout:t.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:i}},{binding:1,resource:{buffer:e.matrices.buffer}},z(2,e.sizes),{binding:3,resource:{buffer:a}},{binding:4,resource:{buffer:e.batching.cullEntities.buffer}}]}),s=m.device.createBindGroup({layout:t.getBindGroupLayout(1),entries:[{binding:0,resource:{buffer:e.batching.indirect}},{binding:1,resource:{buffer:e.batching.entityIds.buffer}}]}));let h=e.batching,g=h.cullEntityCount;if(g===0)return;Xs(h.shapeAABBs,p),m.device.queue.writeBuffer(a,0,p),j(e.viewProj,f),u.set(f),d[24]=g,m.device.queue.writeBuffer(i,0,l);let _=R(m.encoder);_.setPipeline(n),_.setBindGroup(0,r),_.dispatchWorkgroups(Math.ceil(Hu/64)),_.end();let v=R(m.encoder,m.timestampWrites?.(`frustum-cull`));v.setPipeline(t),v.setBindGroup(0,o),v.setBindGroup(1,s),v.dispatchWorkgroups(Math.ceil(g/64)),v.end()}}]}}var Ku=new Float32Array(16),qu=new Float32Array(16),Ju=new Float32Array(16),Yu=new Float32Array(16),Xu=new Float32Array(24),Zu=new Float32Array(16),Qu=new Float32Array(16),$u=new Float32Array(16),ed=4,td=2048,nd=td/2;function rd(e,t,n,r=.75){let i=new Float32Array(n),a=t/e;for(let o=0;o<n;o++){let s=(o+1)/n,c=e*a**+s,l=e+(t-e)*s;i[o]=r*c+(1-r)*l}return i}function id(e,t,n,r,i,a,o){let s=Re(ze(Pe(Me(t,n,r,i,Ku),Fe(e,qu),Ju),Yu),0,1,Xu),c=0,l=0,u=0;for(let e=0;e<8;e++)c+=s[e*3],l+=s[e*3+1],u+=s[e*3+2];c/=8,l/=8,u/=8;let[d,f,p]=a,m=Math.sqrt(d*d+f*f+p*p),h=d/m,g=f/m,_=p/m,v=0;for(let e=0;e<8;e++){let t=s[e*3]-c,n=s[e*3+1]-l,r=s[e*3+2]-u,i=Math.sqrt(t*t+n*n+r*r);v=Math.max(v,i)}let y=v*2,b=Ie(c-h*y,l-g*y,u-_*y,c,l,u,0,1,0,Zu),x=1/0,S=-1/0,C=1/0,w=-1/0,T=1/0,E=-1/0;for(let e=0;e<8;e++){let t=s[e*3],n=s[e*3+1],r=s[e*3+2],i=b[0]*t+b[4]*n+b[8]*r+b[12],a=b[1]*t+b[5]*n+b[9]*r+b[13],o=b[2]*t+b[6]*n+b[10]*r+b[14];x=Math.min(x,i),S=Math.max(S,i),C=Math.min(C,a),w=Math.max(w,a),T=Math.min(T,o),E=Math.max(E,o)}T-=y,E+=y;let D=(S-x)/o,ee=(w-C)/o,O=Math.max(D,ee);x=Math.floor(x/O)*O,S=Math.ceil(S/O)*O,C=Math.floor(C/O)*O,w=Math.ceil(w/O)*O;let k=Pe(Le(x,S,C,w,-E,-T,Qu),b,$u),te=2/o;return k[12]=Math.floor(k[12]/te)*te,k[13]=Math.floor(k[13]/te)*te,{viewProj:k,texelSize:O}}var ad=new ArrayBuffer(288),od=new Float32Array(ad);function sd(e){return e.createBuffer({label:`shadow`,size:288,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST})}function cd(e){return e.createTexture({label:`shadow-atlas`,size:[td,td,1],format:`depth32float`,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING})}function ld(e,t,n,r,i){return{name:`shadow-cascade-upload`,inputs:[`data`],outputs:[`shadow-cascades`],execute(a){if(!r())return;let o=t();if(!o)return;let{world:s,fov:c,near:l,far:u,width:d,height:f}=o,p=d/f,m=n(),h=i(),g=rd(l,Math.min(u,h),ed),_=ed*16,v=_+ed,y=l;for(let e=0;e<ed;e++){let{viewProj:t,texelSize:n}=id(s,c,p,y,g[e],m,nd);od.set(t,e*16),od[_+e]=g[e],od[v+e]=n,y=g[e]}a.device.queue.writeBuffer(e,0,ad)}}}function ud(e){return e.some(e=>e.properties?.length&&po()&&e.vertex?.includes(`inst.`))}function dd(e){let t=e.map((e,t)=>Xa(t,e)).join(`
`),n=Qa(e.length),r=ud(e);return`
struct VertexInput {
    @builtin(vertex_index) vertexIndex: u32,
    @builtin(instance_index) instance: u32,
}

struct VertexOutput {
    @builtin(position) position: vec4<f32>,
}

${ja}
${Ea}
${wa}

@group(0) @binding(0) var<uniform> shadow: Shadow;
@group(0) @binding(1) var<storage, read> entityIds: array<u32>;
@group(0) @binding(2) var<storage, read> matrices: array<mat4x4<f32>>;
@group(0) @binding(3) var<storage, read> sizes: array<vec4<f32>>;
@group(0) @binding(4) var<uniform> cascadeIndex: u32;
@group(0) @binding(5) var<storage, read> data: array<Data>;
@group(0) @binding(6) var<uniform> scene: Scene;

${r?ho():``}
${r?go(7):``}

@group(0) @binding(8) var<storage, read> shapes: array<u32>;
@group(0) @binding(9) var<storage, read> meshVertexData: array<f32>;
@group(0) @binding(10) var<storage, read> meshMeta: array<vec4<u32>>;

${Ma}

const SURFACE_ID_MASK: u32 = 0xFFu;

fn getCascadeViewProj(cascade: u32) -> mat4x4<f32> {
    switch cascade {
        case 0u: { return shadow.cascade0ViewProj; }
        case 1u: { return shadow.cascade1ViewProj; }
        case 2u: { return shadow.cascade2ViewProj; }
        default: { return shadow.cascade3ViewProj; }
    }
}

${t}
${n}

@vertex
fn vs(input: VertexInput) -> VertexOutput {
    let eid = entityIds[input.instance];
    var output: VertexOutput;
    if (sizes[eid].w == 0.0) {
        output.position = vec4<f32>(0.0, 0.0, 0.0, 1.0);
        return output;
    }
    let d = data[eid];
    let surfaceId = d.flags & SURFACE_ID_MASK;
    let vtx = pullVertex(input.vertexIndex, eid);
    let result = dispatchVertexTransform(surfaceId, vtx.position, vtx.normal, vtx.uv, eid);
    let world = matrices[eid];
    let scaledPos = result.position * sizes[eid].xyz;
    let worldPos = (world * vec4<f32>(scaledPos, 1.0)).xyz;
    let viewProj = getCascadeViewProj(cascadeIndex);
    _ = scene.time;

    output.position = viewProj * vec4<f32>(worldPos, 1.0);
    return output;
}

@fragment
fn fs() {}
`}async function fd(e,t){let n=dd(t),r=e.createShaderModule({code:n}),i=await e.createRenderPipelineAsync({label:`shadow-dir`,layout:`auto`,vertex:{module:r,entryPoint:`vs`},fragment:{module:r,entryPoint:`fs`,targets:[]},depthStencil:{format:`depth32float`,depthWriteEnabled:!0,depthCompare:`less`},primitive:{topology:`triangle-list`,cullMode:`front`}}),a=[];for(let t=0;t<ed;t++){let n=e.createBuffer({label:`cascade-index-${t}`,size:4,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});e.queue.writeBuffer(n,0,new Uint32Array([t])),a.push(n)}return{pipeline:i,cascadeIndexBuffers:a,needsProps:ud(t)}}function pd(e,t,n,r,i){let a=t.pipeline.getBindGroupLayout(0),o=t.cascadeIndexBuffers.map(i=>{let o=[{binding:0,resource:{buffer:r}},{binding:1,resource:{buffer:n.batching.entityIds.buffer}},{binding:2,resource:{buffer:n.matrices.buffer}},z(3,n.sizes),{binding:4,resource:{buffer:i}},{binding:5,resource:{buffer:n.data.buffer}},{binding:6,resource:{buffer:n.scene}}];if(t.needsProps){let e=n.instanceDataBuffer;e&&o.push({binding:7,resource:{buffer:e.buffer}})}return o.push(z(8,n.shapes),{binding:9,resource:{buffer:n.meshAtlas.vertices}},{binding:10,resource:{buffer:n.meshAtlas.meta}}),e.createBindGroup({layout:a,entries:o})});return{pipeline:t.pipeline,cascadeIndexBuffers:t.cascadeIndexBuffers,cascadeBindGroups:o,depthView:i.createView()}}var md={view:null,depthClearValue:1,depthLoadOp:`clear`,depthStoreOp:`store`},hd={colorAttachments:[],depthStencilAttachment:md};function gd(e,t,n,r,i){let a=null,o=!1,s=null,c=N(),l=e.meshVersion;return[{name:`shadow-render`,inputs:[`shadow-cascades`],outputs:[`shadow-atlas`],execute(u){if(!r()||(!a&&!o&&(o=!0,fd(u.device,i()).then(e=>{a=e}).catch(()=>{}).finally(()=>{o=!1})),!a))return;let d=!s;N()!==c&&(c=N(),d=!0),e.meshVersion!==l&&(l=e.meshVersion,d=!0),d&&(s=pd(u.device,a,e,t,n()));let f=s;md.view=f.depthView,hd.timestampWrites=u.timestampWrites?.(`raster-shadow`);let p=u.encoder.beginRenderPass(hd);p.setPipeline(f.pipeline),p.setIndexBuffer(e.meshAtlas.indices,`uint32`);for(let t=0;t<ed;t++){let n=t%2*nd,r=Math.floor(t/2)*nd;p.setViewport(n,r,nd,nd,0,1),p.setScissorRect(n,r,nd,nd),p.setBindGroup(0,f.cascadeBindGroups[t]),Ls(p,e.batching.indirect,0,e.batching.activeSlots,e.batching.activeSlotCount)}p.end()}}]}function _d(e,t){return t.current||={atlas:Sd(e),buffer:Cd(e)},t.current}var vd=512*6,yd=512*4,bd=1600,xd=[{dx:1,dy:0,dz:0,ux:0,uy:-1,uz:0},{dx:-1,dy:0,dz:0,ux:0,uy:-1,uz:0},{dx:0,dy:1,dz:0,ux:0,uy:0,uz:1},{dx:0,dy:-1,dz:0,ux:0,uy:0,uz:-1},{dx:0,dy:0,dz:1,ux:0,uy:-1,uz:0},{dx:0,dy:0,dz:-1,ux:0,uy:-1,uz:0}];function Sd(e){return e.createTexture({label:`point-shadow-atlas`,size:[vd,yd,1],format:`depth32float`,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING})}function Cd(e){return e.createBuffer({label:`point-shadow`,size:bd,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST})}var wd=new Float32Array(16),Td=new Float32Array(16),Ed=new Float32Array(16);function Dd(e,t,n,r,i){let a=xd[r],o=Ie(e,t,n,e+a.dx,t+a.dy,n+a.dz,a.ux,a.uy,a.uz,Td);return Pe(Me(90,1,.1,i,wd),o,Ed)}var Od=new ArrayBuffer(bd),kd=new Float32Array(Od);function Ad(e,t){return{name:`point-shadow-upload`,inputs:[`point-light-raster`],outputs:[`point-shadow-data`],execute(n){let r=t();if(!r)return;let[i,a]=e();kd.fill(0);let o=0;for(let e=0;e<a&&o<4;e++){let t=e*8;if(i[t+7]<0)continue;let n=i[t],r=i[t+1],a=i[t+2],s=i[t+3];for(let e=0;e<6;e++){let t=Dd(n,r,a,e,s),i=(o*6+e)*16;kd.set(t,i)}let c=384+o*4;kd[c]=n,kd[c+1]=r,kd[c+2]=a,kd[c+3]=s,o++}n.device.queue.writeBuffer(r,0,Od)}}}function jd(e){let t=e.map((e,t)=>Xa(t,e)).join(`
`),n=Qa(e.length),r=ud(e);return`
struct VertexInput {
    @builtin(vertex_index) vertexIndex: u32,
    @builtin(instance_index) instance: u32,
}

struct VertexOutput {
    @builtin(position) position: vec4<f32>,
}

${Aa}
${Ea}
${wa}

@group(0) @binding(0) var<uniform> pointShadow: PointShadow;
@group(0) @binding(1) var<storage, read> entityIds: array<u32>;
@group(0) @binding(2) var<storage, read> matrices: array<mat4x4<f32>>;
@group(0) @binding(3) var<storage, read> sizes: array<vec4<f32>>;
@group(0) @binding(4) var<uniform> vpIndex: u32;
@group(0) @binding(5) var<storage, read> data: array<Data>;
@group(0) @binding(6) var<uniform> scene: Scene;

${r?ho():``}
${r?go(7):``}

@group(0) @binding(8) var<storage, read> shapes: array<u32>;
@group(0) @binding(9) var<storage, read> meshVertexData: array<f32>;
@group(0) @binding(10) var<storage, read> meshMeta: array<vec4<u32>>;

${Ma}

const SURFACE_ID_MASK: u32 = 0xFFu;

${t}
${n}

@vertex
fn vs(input: VertexInput) -> VertexOutput {
    let eid = entityIds[input.instance];
    var output: VertexOutput;
    if (sizes[eid].w == 0.0) {
        output.position = vec4<f32>(0.0, 0.0, 0.0, 1.0);
        return output;
    }
    let d = data[eid];
    let surfaceId = d.flags & SURFACE_ID_MASK;
    let vtx = pullVertex(input.vertexIndex, eid);
    let result = dispatchVertexTransform(surfaceId, vtx.position, vtx.normal, vtx.uv, eid);
    let world = matrices[eid];
    let scaledPos = result.position * sizes[eid].xyz;
    let worldPos = (world * vec4<f32>(scaledPos, 1.0)).xyz;
    _ = scene.time;
    output.position = pointShadow.viewProj[vpIndex] * vec4<f32>(worldPos, 1.0);
    return output;
}

@fragment
fn fs() {}
`}async function Md(e,t){let n=jd(t),r=e.createShaderModule({code:n}),i=await e.createRenderPipelineAsync({label:`shadow-point`,layout:`auto`,vertex:{module:r,entryPoint:`vs`},fragment:{module:r,entryPoint:`fs`,targets:[]},depthStencil:{format:`depth32float`,depthWriteEnabled:!0,depthCompare:`less`},primitive:{topology:`triangle-list`,cullMode:`front`}}),a=[];for(let t=0;t<24;t++){let n=e.createBuffer({label:`point-shadow-vp-${t}`,size:4,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});e.queue.writeBuffer(n,0,new Uint32Array([t])),a.push(n)}return{pipeline:i,vpIndexBuffers:a,needsProps:ud(t)}}function Nd(e,t,n,r,i){let a=t.pipeline.getBindGroupLayout(0),o=t.vpIndexBuffers.map(i=>{let o=[{binding:0,resource:{buffer:r}},{binding:1,resource:{buffer:n.batching.entityIds.buffer}},{binding:2,resource:{buffer:n.matrices.buffer}},z(3,n.sizes),{binding:4,resource:{buffer:i}},{binding:5,resource:{buffer:n.data.buffer}},{binding:6,resource:{buffer:n.scene}}];if(t.needsProps){let e=n.instanceDataBuffer;e&&o.push({binding:7,resource:{buffer:e.buffer}})}return o.push(z(8,n.shapes),{binding:9,resource:{buffer:n.meshAtlas.vertices}},{binding:10,resource:{buffer:n.meshAtlas.meta}}),e.createBindGroup({layout:a,entries:o})});return{pipeline:t.pipeline,vpIndexBuffers:t.vpIndexBuffers,vpBindGroups:o,atlasView:i.createView()}}var Pd={view:null,depthClearValue:1,depthLoadOp:`clear`,depthStoreOp:`store`},Fd={colorAttachments:[],depthStencilAttachment:Pd};function Id(e,t,n,r){let i=null,a=!1,o=null,s=N(),c=e.meshVersion;return{name:`point-shadow-render`,inputs:[`point-shadow-data`,`batched`],outputs:[`point-shadow-atlas`],execute(l){let u=t();if(!u||(!i&&!a&&(a=!0,Md(l.device,r()).then(e=>{i=e}).catch(()=>{}).finally(()=>{a=!1})),!i))return;let d=!o;N()!==s&&(s=N(),d=!0),e.meshVersion!==c&&(c=e.meshVersion,d=!0),d&&(o=Nd(l.device,i,e,u.buffer,u.atlas));let[f,p]=n(),m=0;for(let e=0;e<p;e++)f[e*8+7]>=0&&m++;if(m===0)return;let h=o;Pd.view=h.atlasView,Fd.timestampWrites=l.timestampWrites?.(`raster-point-shadow`);let g=l.encoder.beginRenderPass(Fd);g.setPipeline(h.pipeline),g.setIndexBuffer(e.meshAtlas.indices,`uint32`);for(let t=0;t<m;t++)for(let n=0;n<6;n++){let r=t*6+n,i=n*512,a=t*512;g.setViewport(i,a,512,512,0,1),g.setScissorRect(i,a,512,512),g.setBindGroup(0,h.vpBindGroups[r]),Ls(g,e.batching.indirect,0,e.batching.activeSlots,e.batching.activeSlotCount)}g.end()}}}var Ld=16,Rd=24,zd=128,Bd=1024*1024,Vd=128,Hd=`
${ka}

struct ClusterParams {
    viewMatrix: mat4x4<f32>,
    tilesX: u32,
    tilesY: u32,
    sliceCount: u32,
    lightCount: u32,
    near: f32,
    far: f32,
    logRatio: f32,
    bias: f32,
    tanHalfFov: f32,
    aspect: f32,
    cameraMode: f32,
    _pad: f32,
}

@group(0) @binding(0) var<uniform> params: ClusterParams;
@group(0) @binding(1) var<storage, read> pointLights: array<PointLightData>;
@group(0) @binding(2) var<storage, read_write> clusterGrid: array<vec2<u32>>;
@group(0) @binding(3) var<storage, read_write> lightIndices: array<atomic<u32>>;

fn clusterAABB(tileX: u32, tileY: u32, slice: u32) -> array<vec3<f32>, 2> {
    let tilesXf = f32(params.tilesX);
    let tilesYf = f32(params.tilesY);

    let minXNdc = f32(tileX) / tilesXf * 2.0 - 1.0;
    let maxXNdc = f32(tileX + 1u) / tilesXf * 2.0 - 1.0;
    let minYNdc = 1.0 - f32(tileY + 1u) / tilesYf * 2.0;
    let maxYNdc = 1.0 - f32(tileY) / tilesYf * 2.0;

    var nearZ: f32;
    var farZ: f32;

    if (params.cameraMode > 0.5) {
        nearZ = params.near + f32(slice) / f32(params.sliceCount) * (params.far - params.near);
        farZ = params.near + f32(slice + 1u) / f32(params.sliceCount) * (params.far - params.near);
    } else {
        nearZ = params.near * pow(params.far / params.near, f32(slice) / f32(params.sliceCount));
        farZ = params.near * pow(params.far / params.near, f32(slice + 1u) / f32(params.sliceCount));
    }

    var minPt: vec3<f32>;
    var maxPt: vec3<f32>;

    if (params.cameraMode > 0.5) {
        let halfW = params.tanHalfFov * params.aspect;
        let halfH = params.tanHalfFov;
        minPt = vec3(minXNdc * halfW, minYNdc * halfH, nearZ);
        maxPt = vec3(maxXNdc * halfW, maxYNdc * halfH, farZ);
    } else {
        let nearHalfH = params.tanHalfFov * nearZ;
        let nearHalfW = nearHalfH * params.aspect;
        let farHalfH = params.tanHalfFov * farZ;
        let farHalfW = farHalfH * params.aspect;

        minPt = vec3(
            min(minXNdc * nearHalfW, minXNdc * farHalfW),
            min(minYNdc * nearHalfH, minYNdc * farHalfH),
            nearZ
        );
        maxPt = vec3(
            max(maxXNdc * nearHalfW, maxXNdc * farHalfW),
            max(maxYNdc * nearHalfH, maxYNdc * farHalfH),
            farZ
        );
    }

    return array<vec3<f32>, 2>(minPt, maxPt);
}

fn sphereAABBIntersect(center: vec3<f32>, radius: f32, aabbMin: vec3<f32>, aabbMax: vec3<f32>) -> bool {
    let closest = clamp(center, aabbMin, aabbMax);
    let d = center - closest;
    return dot(d, d) <= radius * radius;
}

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let tilesX = params.tilesX;
    let tilesY = params.tilesY;
    let sliceCount = params.sliceCount;
    let clusterId = gid.x;
    let totalClusters = tilesX * tilesY * sliceCount;

    if (clusterId >= totalClusters) { return; }

    let slice = clusterId / (tilesX * tilesY);
    let rem = clusterId % (tilesX * tilesY);
    let tileY = rem / tilesX;
    let tileX = rem % tilesX;

    let aabb = clusterAABB(tileX, tileY, slice);
    let aabbMin = aabb[0];
    let aabbMax = aabb[1];

    var count = 0u;

    var localIndices: array<u32, ${zd}>;

    for (var i = 0u; i < params.lightCount; i++) {
        let light = pointLights[i];
        let worldPos = vec4(light.position, 1.0);
        let viewPos = params.viewMatrix * worldPos;
        let lightView = vec3(viewPos.x, viewPos.y, -viewPos.z);

        if (sphereAABBIntersect(lightView, light.radius, aabbMin, aabbMax)) {
            if (count < ${zd}u) {
                localIndices[count] = i;
                count++;
            }
        }
    }

    if (count == 0u) {
        clusterGrid[clusterId] = vec2(0u, 0u);
        return;
    }

    let globalOffset = atomicAdd(&lightIndices[0], count);
    clusterGrid[clusterId] = vec2(globalOffset, count);

    for (var i = 0u; i < count; i++) {
        atomicStore(&lightIndices[globalOffset + 1u + i], localIndices[i]);
    }
}
`,Ud=`
struct ClusterParams {
    viewMatrix: mat4x4<f32>,
    tilesX: u32,
    tilesY: u32,
    sliceCount: u32,
    lightCount: u32,
    near: f32,
    far: f32,
    logRatio: f32,
    bias: f32,
    tanHalfFov: f32,
    aspect: f32,
    cameraMode: f32,
    _pad: f32,
}

@group(2) @binding(0) var<uniform> clusterParams: ClusterParams;
@group(2) @binding(1) var<storage, read> clusterGrid: array<vec2<u32>>;
@group(2) @binding(2) var<storage, read> clusterLightIndices: array<u32>;
`,Wd=`
fn getClusterIndex(fragCoord: vec2<f32>, viewZ: f32) -> u32 {
    let tileX = u32(fragCoord.x) / ${Ld}u;
    let tileY = u32(fragCoord.y) / ${Ld}u;
    var slice: u32;
    if (clusterParams.cameraMode > 0.5) {
        slice = u32(clamp((viewZ - clusterParams.near) / (clusterParams.far - clusterParams.near) * f32(clusterParams.sliceCount), 0.0, f32(clusterParams.sliceCount - 1u)));
    } else {
        slice = u32(clamp(log2(viewZ / clusterParams.near) * clusterParams.logRatio, 0.0, f32(clusterParams.sliceCount - 1u)));
    }
    return slice * clusterParams.tilesX * clusterParams.tilesY + tileY * clusterParams.tilesX + tileX;
}
`,Gd=`
fn computePointLights(surface: SurfaceData, V: vec3<f32>, fragCoord: vec2<f32>, viewZ: f32) -> vec3<f32> {
    var result = vec3(0.0);
    let cluster = getClusterIndex(fragCoord, viewZ);
    let gridEntry = clusterGrid[cluster];
    let offset = gridEntry.x;
    let count = gridEntry.y;

    for (var j = 0u; j < count; j++) {
        let i = clusterLightIndices[offset + 1u + j];
        let light = pointLights[i];
        let toLight = light.position - surface.worldPos;
        let dist = length(toLight);
        if (dist >= light.radius || dist < 1e-4) { continue; }

        let L = toLight / dist;
        let NdotL = max(dot(surface.worldNormal, L), 0.0);
        if (NdotL <= 0.0) { continue; }

        let ratio = 1.0 - dist / light.radius;
        let attenuation = ratio * ratio;

        var shadow = 1.0;
        if (light.shadowIdx >= 0.0) {
            shadow = samplePointShadow(surface.worldPos, surface.worldNormal, u32(light.shadowIdx), light.position, light.radius);
        }

        result += evaluatePointLight(surface, light.color, L, V, NdotL, attenuation, shadow);
    }
    return result;
}
`,Kd=`
fn computePointLights(surface: SurfaceData, V: vec3<f32>, fragCoord: vec2<f32>, viewZ: f32) -> vec3<f32> {
    var result = vec3(0.0);
    let cluster = getClusterIndex(fragCoord, viewZ);
    let gridEntry = clusterGrid[cluster];
    let offset = gridEntry.x;
    let count = gridEntry.y;

    for (var j = 0u; j < count; j++) {
        let i = clusterLightIndices[offset + 1u + j];
        let light = pointLights[i];
        let toLight = light.position - surface.worldPos;
        let dist = length(toLight);
        if (dist >= light.radius || dist < 1e-4) { continue; }

        let L = toLight / dist;
        let NdotL = max(dot(surface.worldNormal, L), 0.0);
        if (NdotL <= 0.0) { continue; }

        let ratio = 1.0 - dist / light.radius;
        let attenuation = ratio * ratio;

        result += evaluatePointLight(surface, light.color, L, V, NdotL, attenuation, 1.0);
    }
    return result;
}
`,qd=new Float32Array(16),Jd=new ArrayBuffer(Vd),Yd=new Float32Array(Jd),Xd=new Uint32Array(Jd),Zd=new Uint32Array(1);function Qd(e,t,n,r,i=3840,a=2160){let o=null,s=null,c=null;return{name:`cluster-cull`,inputs:[`point-light-raster`],outputs:[`cluster-data`],async prepare(e){let t=e.createShaderModule({code:Hd});o=await e.createComputePipelineAsync({label:`cluster-cull`,layout:`auto`,compute:{module:t,entryPoint:`main`}})},execute(l){if(!o||(e.clusterGridBuffer!==c&&(c=e.clusterGridBuffer,s=l.device.createBindGroup({layout:o.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:e.clusterParamsBuffer}},{binding:1,resource:{buffer:t}},{binding:2,resource:{buffer:e.clusterGridBuffer}},{binding:3,resource:{buffer:e.lightIndexBuffer}}]})),!s))return;let u=n();if(u<0)return;let d=r();if(d===0){l.encoder.clearBuffer(e.clusterGridBuffer),l.device.queue.writeBuffer(e.lightIndexBuffer,0,Zd);return}let f=Fe(ji.data.subarray(u*16,u*16+16),qd),p=W.fov[u],m=W.near[u],h=W.far[u],g=W.mode[u],_=l.getTexture(`color`)?.width??1920,v=l.getTexture(`color`)?.height??1080,y=_/v,b=Math.min(Math.ceil(_/Ld),Math.ceil(i/Ld)),x=Math.min(Math.ceil(v/Ld),Math.ceil(a/Ld)),S=Rd,C=b*x*S,w=p*Math.PI/180,T=Math.tan(w/2),E=Math.log2(h/m),D=S/E,ee=-S*Math.log2(m)/E;Yd.set(f,0),Xd[16]=b,Xd[17]=x,Xd[18]=S,Xd[19]=d,Yd[20]=m,Yd[21]=h,Yd[22]=D,Yd[23]=ee,Yd[24]=T,Yd[25]=y,Yd[26]=g,Yd[27]=0,l.device.queue.writeBuffer(e.clusterParamsBuffer,0,Jd),l.device.queue.writeBuffer(e.lightIndexBuffer,0,Zd);let O=R(l.encoder,l.timestampWrites?.(`cluster-cull`));O.setPipeline(o),O.setBindGroup(0,s),O.dispatchWorkgroups(Math.ceil(C/64)),O.end()}}}function $d(e,t){return{paramsSize:Vd,gridSize:Math.ceil(e/Ld)*Math.ceil(t/Ld)*Rd*8,indexSize:4+Bd*4}}var ef={lighting:{params:`shadowFactor: f32, fragCoord: vec2<f32>, viewZ: f32`,body:()=>`${qa}
    return litColor + computePointLights(surface, V, fragCoord, viewZ);`}};function tf(e,t,n=!0,r=!1){let i=eo(e,ef),a=t?`
${ja}

@group(1) @binding(0) var<uniform> shadow: Shadow;
@group(1) @binding(1) var shadowMap: texture_depth_2d;

${Aa}

@group(1) @binding(2) var<uniform> pointShadow: PointShadow;
@group(1) @binding(3) var pointShadowMap: texture_depth_2d;
@group(1) @binding(4) var shadowSampler: sampler_comparison;

${Ua}
${Ga}
${Gd}
`:``,o=t?`
    let viewZ = -dot(scene.cameraWorld[2].xyz, surface.worldPos - scene.cameraWorld[3].xyz);
    let rawShadow = sampleShadow(surface.worldPos, viewZ, input.position.xy);
    let shadowFactor = mix(1.0, rawShadow, scene.shadowStrength);
`:`
    let viewZ = -dot(scene.cameraWorld[2].xyz, surface.worldPos - scene.cameraWorld[3].xyz);
    let shadowFactor = 1.0;
`,s=n?`struct FragmentOutput {
    @location(0) color: vec4<f32>,
    @location(1) entityId: u32,
}`:`struct FragmentOutput {
    @location(0) color: vec4<f32>,
}`,c=n?r?`
    output.entityId = 0u;`:`
    output.entityId = input.entityId;`:``,l=r?`let reflectedColor = litColor * surface.opacity + reflectionColor(surface, V);`:`let reflectedColor = applyReflection(surface, V, litColor);`,u=t?``:Kd;return`
${Na.replace(/struct FragmentOutput \{[^}]+\}/,s)}
${Ta}
${ka}

const SURFACE_ID_MASK: u32 = 0xFFu;

@group(0) @binding(5) var<uniform> sky: Sky;
@group(0) @binding(6) var<storage, read> pointLights: array<PointLightData>;

${po()?ho():``}
${po()?go(7):``}

${Ud}
${Wd}

${La}
${Ha}
${Wa}
${Ka}
${Va}
${Ja}
${a}
${u}

${i}

@vertex
fn vs(input: VertexInput) -> VertexOutput {
    let eid = entityIds[input.instance];
    let world = matrices[eid];
    let d = data[eid];
    let surfaceId = d.flags & SURFACE_ID_MASK;
    let vtx = pullVertex(input.vertexIndex, eid);
    let position = vtx.position;
    let normal = vtx.normal;
    let result = dispatchVertexTransform(surfaceId, position, normal, vtx.uv, eid);
    let scaledPos = result.position * sizes[eid].xyz;
    let finalWorldPos = (world * vec4<f32>(scaledPos, 1.0)).xyz;
    let worldNormal = normalize((world * vec4<f32>(normal, 0.0)).xyz);

    var output: VertexOutput;
    output.position = scene.viewProj * vec4<f32>(finalWorldPos, 1.0);
    output.color = d.baseColor;
    output.worldNormal = worldNormal;
    output.entityId = eid;
    output.worldPos = finalWorldPos;
    output.objectPos = position * sizes[eid].xyz;
    output.objectNormal = normal;
    output.uv = result.uv;
    return output;
}

@fragment
fn fs(input: VertexOutput) -> FragmentOutput {
    let eid = input.entityId;
    let d = data[eid];
    let surfaceId = d.flags & SURFACE_ID_MASK;

    var surface: SurfaceData;
    surface.worldPos = input.worldPos;
    surface.objectPos = input.objectPos;
    surface.worldNormal = normalize(input.worldNormal);
    surface.objectNormal = normalize(input.objectNormal);
    surface.baseColor = input.color.rgb;
    surface.emission = d.emission.rgb * d.emission.a;
    surface.uv = input.uv;
    surface.roughness = d.pbr.x;
    surface.reflectivity = d.pbr.y;
    surface.opacity = input.color.a;

    dispatchFragment(surfaceId, &surface, input.position, eid);
    ${Ya}

${o}
    let litColor = dispatchLighting(surfaceId, surface, shadowFactor, input.position.xy, viewZ);
    let V = normalize(scene.cameraWorld[3].xyz - surface.worldPos);
    let dist = length(input.worldPos - scene.cameraWorld[3].xyz);
    ${l}

    var output: FragmentOutput;
    output.color = vec4<f32>(applyHaze(reflectedColor, dist), surface.opacity);${c}
    _ = clusterParams.tilesX;
    return output;
}
`}function nf(e=!1){return`
${wa}
${Ta}

@group(0) @binding(0) var<uniform> scene: Scene;
@group(0) @binding(1) var<uniform> sky: Sky;

${Ba}
${La}
${Va}

${e?`struct FragmentOutput {
    @location(0) color: vec4<f32>,
    @location(1) entityId: u32,
}`:``}

struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) uv: vec2<f32>,
}

@vertex
fn vs(@builtin(vertex_index) vertexIndex: u32) -> VertexOutput {
    var positions = array<vec2<f32>, 3>(
        vec2(-1.0, -1.0),
        vec2(3.0, -1.0),
        vec2(-1.0, 3.0)
    );
    var output: VertexOutput;
    output.position = vec4(positions[vertexIndex], 0.0, 1.0);
    output.uv = (positions[vertexIndex] + 1.0) * 0.5;
    output.uv.y = 1.0 - output.uv.y;
    return output;
}

@fragment
fn fs(input: VertexOutput) -> ${e?`FragmentOutput`:`@location(0) vec4<f32>`} {
    let dir = computeSkyDir(input.uv.x, input.uv.y);
    let color = sampleSky(dir);
    ${e?`var output: FragmentOutput;
    output.color = vec4(color, 1.0);
    output.entityId = 0u;
    return output;`:`return vec4(color, 1.0);`}
}
`}async function rf(e,t,n,r){let i=tf(t,r),a=e.createShaderModule({code:i});return e.createRenderPipelineAsync({label:`forward`,layout:`auto`,vertex:{module:a,entryPoint:`vs`},fragment:{module:a,entryPoint:`fs`,targets:[{format:n},{format:`r32uint`}]},depthStencil:{format:`depth24plus`,depthWriteEnabled:!0,depthCompare:`less`},primitive:{topology:`triangle-list`,cullMode:`back`}})}async function af(e,t,n,r){let i=tf(t,r,!0,!0),a=e.createShaderModule({code:i});return e.createRenderPipelineAsync({label:`forward-transparent`,layout:`auto`,vertex:{module:a,entryPoint:`vs`},fragment:{module:a,entryPoint:`fs`,targets:[{format:n,blend:{color:{srcFactor:`one`,dstFactor:`one-minus-src-alpha`},alpha:{srcFactor:`one`,dstFactor:`one-minus-src-alpha`}}},{format:`r32uint`,writeMask:0}]},depthStencil:{format:`depth24plus`,depthWriteEnabled:!1,depthCompare:`less-equal`},primitive:{topology:`triangle-list`,cullMode:`none`}})}async function of(e,t){let n=nf(!0),r=e.createShaderModule({code:n});return e.createRenderPipelineAsync({label:`sky`,layout:`auto`,vertex:{module:r,entryPoint:`vs`},fragment:{module:r,entryPoint:`fs`,targets:[{format:t},{format:`r32uint`}]},depthStencil:{format:`depth24plus`,depthWriteEnabled:!1,depthCompare:`always`},primitive:{topology:`triangle-list`}})}async function sf(e,t){let[n,r,i]=await Promise.all([rf(e,t,Gi,!0),of(e,Gi),af(e,t,Gi,!0)]);return{opaque:n,transparent:i,sky:r}}function cf(e,t,n,r){let i=[{binding:0,resource:{buffer:n.scene}},{binding:1,resource:{buffer:n.batching.entityIds.buffer}},{binding:2,resource:{buffer:n.matrices.buffer}},z(3,n.sizes),{binding:4,resource:{buffer:n.data.buffer}},{binding:5,resource:{buffer:n.sky}},{binding:6,resource:{buffer:n.pointLightBuffer}}];n.instanceDataBuffer&&i.push({binding:7,resource:{buffer:n.instanceDataBuffer.buffer}}),i.push(z(8,n.shapes),{binding:9,resource:{buffer:n.meshAtlas.vertices}},{binding:10,resource:{buffer:n.meshAtlas.meta}});let a=t=>e.createBindGroup({layout:t.getBindGroupLayout(0),entries:i}),o=e.createSampler({compare:`less`,magFilter:`linear`,minFilter:`linear`}),s=[{binding:0,resource:{buffer:r.shadowBuffer}},{binding:1,resource:r.shadowAtlas.createView()},{binding:2,resource:{buffer:r.pointShadowBuffer}},{binding:3,resource:r.pointShadowAtlas.createView()},{binding:4,resource:o}],c=t=>e.createBindGroup({layout:t.getBindGroupLayout(1),entries:s}),l=[{binding:0,resource:{buffer:r.clusterParamsBuffer}},{binding:1,resource:{buffer:r.clusterGridBuffer}},{binding:2,resource:{buffer:r.lightIndexBuffer}}],u=t=>e.createBindGroup({layout:t.getBindGroupLayout(2),entries:l});return{scene:a(t.opaque),sceneTransparent:a(t.transparent),shadow:c(t.opaque),shadowTransparent:c(t.transparent),cluster:u(t.opaque),clusterTransparent:u(t.transparent),sky:e.createBindGroup({layout:t.sky.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:n.scene}},{binding:1,resource:{buffer:n.sky}}]})}}var lf={view:null,clearValue:{r:0,g:0,b:0,a:1},loadOp:`clear`,storeOp:`store`},uf={view:null,clearValue:{r:0,g:0,b:0,a:0},loadOp:`clear`,storeOp:`store`},df={view:null,depthClearValue:1,depthLoadOp:`clear`,depthStoreOp:`store`},ff={colorAttachments:[lf,uf],depthStencilAttachment:df};function pf(e,t,n,r,i,a,o,s,c,l,u){lf.view=a,lf.clearValue.r=c.r,lf.clearValue.g=c.g,lf.clearValue.b=c.b,uf.view=o,df.view=s,ff.timestampWrites=u;let d=e.encoder.beginRenderPass(ff);l&&(d.setPipeline(t.sky),d.setBindGroup(0,n.sky),d.draw(3)),d.setPipeline(t.opaque),d.setBindGroup(0,n.scene),d.setBindGroup(1,n.shadow),d.setBindGroup(2,n.cluster),d.setIndexBuffer(r,`uint32`),Ls(d,i.indirect,0,i.activeSlots,i.activeSlotCount),d.setPipeline(t.transparent),d.setBindGroup(0,n.sceneTransparent),d.setBindGroup(1,n.shadowTransparent),d.setBindGroup(2,n.clusterTransparent),Ls(d,i.indirect,vo,i.activeSlots,i.activeSlotCount),d.end()}function mf(e,t,n,r,i){let a=null,o=null,s=null,c=!1,l=N(),u=e.meshVersion;return{name:`forward`,inputs:[`culled`,`shadow-atlas`,`point-shadow-atlas`,`cluster-data`],outputs:[`color`,`eid`,`z`],async prepare(r){a=await sf(r,n()),s=e.instanceDataBuffer,o=cf(r,a,e,t)},execute(n){if(!a||!o||globalThis.__SKIP_FORWARD)return;N()!==l&&(l=N(),c=!0),e.meshVersion!==u&&(u=e.meshVersion,c=!0),t.bindGroupsDirty&&(t.bindGroupsDirty=!1,c=!0);let d=e.instanceDataBuffer;(d!==s||c)&&(s=d,c=!1,o=cf(n.device,a,e,t));let f=n.getTextureView(`color`),p=n.getTextureView(`eid`),m=n.getTextureView(`z`);if(!f||!p||!m)return;let h=r(),g=i();pf(n,a,o,e.meshAtlas.indices,e.batching,f,p,m,h,g,n.timestampWrites?.(`raster-forward`))}}}var hf=100,gf=L(`raster`),_f={name:`Raster`,systems:[],components:{},dependencies:[Js],async initialize(e){let t=on.from(e),n=qs.from(e);if(!t||!n)return;let{device:r}=t,i=r.createTexture({label:`shadow-atlas-placeholder`,size:[1,1],format:`depth32float`,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),a=!1,o=sd(r),s=r.createTexture({label:`point-shadow-atlas`,size:[1,1],format:`depth32float`,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),c=r.createBuffer({label:`point-shadow`,size:bd,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),l={current:null},u=3840,d=2160,f=r.createBuffer({label:`cluster-params`,size:128,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),p=r.createBuffer({label:`cluster-grid`,size:8,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),m=r.createBuffer({label:`light-indices`,size:4,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),h=!1,g={shadowAtlas:i,shadowBuffer:o,pointShadowAtlas:s,pointShadowBuffer:c,clusterParamsBuffer:f,clusterGridBuffer:p,lightIndexBuffer:m,bindGroupsDirty:!1};e.setResource(gf,g);let _=()=>dr.from(e)?.eid??-1,v=()=>{let e=_();return e>=0?Ee(W.clearColor[e]):{r:0,g:0,b:0}},y=()=>e.only([aa])>=0,b=()=>{let t=_();if(t<0||!e.hasComponent(t,na))return!1;let n=e.only([U]);return n>=0&&U.shadows[n]!==0},x=()=>{let t=_();return t>=0&&e.hasComponent(t,na)?na.distance[t]:hf},S=()=>{let e=_();return e>=0?{world:ji.data.subarray(e*16,e*16+16),fov:W.fov[e],near:W.near[e],far:W.far[e],width:n.width,height:n.height}:null},C=()=>{let t=e.only([U]);if(t>=0){let[e,n,r]=Oe(U.directionX[t],U.directionY[t],U.directionZ[t]);return[e,n,r]}return[-.5,-1,-.5]},w=t.graph.subGraph(`raster`),T=ld(o,S,C,b,x);w.add(T);let E=gd(n,o,()=>(a||(a=!0,i.destroy(),i=cd(r),g.shadowAtlas=i,g.bindGroupsDirty=!0),i),b,no.all);for(let e of E)w.add(e);let D=()=>n.pointLightData;w.add({name:`point-light-setup`,scope:`frame`,inputs:[`point-light-data`],outputs:[`point-light-raster`],execute(e){let[t,r]=n.pointLightData;ee=r;let i=!1;for(let e=0;e<r;e++)if(t[e*8+7]>=0){i=!0;break}if(i&&!l.current){let t=_d(e.device,l);s.destroy(),c.destroy(),g.pointShadowAtlas=t.atlas,g.pointShadowBuffer=t.buffer,g.bindGroupsDirty=!0}if(r>0&&!h){h=!0,p.destroy(),m.destroy();let t=$d(u,d);p=e.device.createBuffer({label:`cluster-grid`,size:t.gridSize,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),m=e.device.createBuffer({label:`light-indices`,size:t.indexSize,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),g.clusterGridBuffer=p,g.lightIndexBuffer=m,g.bindGroupsDirty=!0}}});let ee=0,O=Qd(g,n.pointLightBuffer,()=>_(),()=>ee,u,d);w.add(O);let k=Ad(D,()=>l.current?.buffer??null);w.add(k);let te=Id(n,()=>l.current,D,no.all);w.add(te);let ne=Gu({matrices:n.matrices,sizes:n.sizes,batching:n.batching,viewProj:n.viewProj});for(let e of ne.nodes)w.add(e);let re=mf(n,g,no.all,v,y);w.add(re)}},vf={bg:`#1a1816`,track:`#252220`,bar:`#d49560`,text:`#e8e0d8`},yf=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 285 80">
  <defs>
    <radialGradient id="baseGradient" cx="35%" cy="30%" r="70%" fx="25%" fy="20%">
      <stop offset="0%" stop-color="#F5D4B8"/>
      <stop offset="45%" stop-color="#E8A86B"/>
      <stop offset="100%" stop-color="#B87654"/>
    </radialGradient>
  </defs>
  <g id="Icon" transform="rotate(35 40 40)">
    <path id="Background" d="M40,2 C44,10 66,28 66,46 C66,60 48,70 40,78 C32,70 14,60 14,46 C14,28 36,10 40,2 Z" fill="#E8A86B"/>
    <path id="CloveLeft" d="M40,6 C37,14 22,28 20,44 C20,52 28,62 36,70 C34,58 26,46 26,38 C26,26 38,12 40,6 Z" fill="#D49560"/>
    <path id="CloveRight" d="M40,6 C43,14 58,28 60,44 C60,52 52,62 44,70 C46,58 54,46 54,38 C54,26 42,12 40,6 Z" fill="#D49560"/>
    <path id="CenterCrease" d="M40,8 C40,20 40,50 40,72" stroke="#6B4230" stroke-width="1" stroke-opacity="0.4" fill="none" stroke-linecap="round"/>
    <path id="BottomEdge" d="M40,78 C48,70 66,60 66,46 C61,58 44,70 40,73 Z" fill="#D49560"/>
    <path id="Outline" d="M40,2 C44,10 66,28 66,46 C66,60 48,70 40,78 C32,70 14,60 14,46 C14,28 36,10 40,2 Z" fill="none" stroke="#6B4230" stroke-width="2"/>
  </g>
  <g id="Text" transform="translate(80 59)">
    <path d="M13.37 0.73Q10.88 0.73 8.47 0.07Q6.06 -0.58 4.02 -1.75Q1.97 -2.93 0.52 -4.52L5.54 -9.63Q6.96 -8.09 8.87 -7.26Q10.79 -6.44 13.05 -6.44Q14.62 -6.44 15.44 -6.89Q16.27 -7.34 16.27 -8.18Q16.27 -9.22 15.27 -9.77Q14.27 -10.32 12.7 -10.74Q11.14 -11.17 9.4 -11.7Q7.66 -12.24 6.08 -13.17Q4.5 -14.09 3.51 -15.73Q2.52 -17.37 2.52 -19.95Q2.52 -22.65 3.92 -24.66Q5.31 -26.68 7.86 -27.83Q10.41 -28.97 13.86 -28.97Q17.43 -28.97 20.49 -27.74Q23.55 -26.51 25.46 -24.04L20.42 -18.94Q19.08 -20.5 17.43 -21.16Q15.78 -21.81 14.18 -21.81Q12.67 -21.81 11.93 -21.36Q11.19 -20.91 11.19 -20.13Q11.19 -19.23 12.18 -18.7Q13.17 -18.18 14.73 -17.78Q16.3 -17.37 18.02 -16.81Q19.75 -16.24 21.32 -15.24Q22.88 -14.24 23.87 -12.59Q24.85 -10.93 24.85 -8.29Q24.85 -4.15 21.75 -1.71Q18.65 0.73 13.37 0.73Z M48.31 0V-16.04Q48.31 -18.27 46.95 -19.62Q45.59 -20.97 43.48 -20.97Q42.04 -20.97 40.93 -20.36Q39.82 -19.75 39.19 -18.63Q38.57 -17.52 38.57 -16.04L35.12 -17.72Q35.12 -21.05 36.53 -23.53Q37.93 -26.01 40.42 -27.39Q42.91 -28.77 46.15 -28.77Q49.45 -28.77 51.94 -27.39Q54.43 -26.01 55.81 -23.61Q57.19 -21.2 57.19 -18.04V0ZM29.7 0V-42.11H38.57V0Z M74.65 0.58Q70.76 0.58 67.7 -1.33Q64.64 -3.25 62.89 -6.55Q61.13 -9.86 61.13 -14.07Q61.13 -18.3 62.89 -21.62Q64.64 -24.94 67.7 -26.85Q70.76 -28.77 74.65 -28.77Q77.49 -28.77 79.78 -27.67Q82.07 -26.56 83.51 -24.62Q84.94 -22.68 85.14 -20.18V-8Q84.94 -5.51 83.52 -3.57Q82.1 -1.62 79.79 -0.52Q77.49 0.58 74.65 0.58ZM76.44 -7.42Q79.29 -7.42 81.03 -9.29Q82.77 -11.17 82.77 -14.09Q82.77 -16.07 81.98 -17.56Q81.2 -19.05 79.78 -19.91Q78.36 -20.76 76.47 -20.76Q74.62 -20.76 73.2 -19.91Q71.78 -19.05 70.95 -17.55Q70.12 -16.04 70.12 -14.09Q70.12 -12.15 70.93 -10.64Q71.75 -9.13 73.18 -8.28Q74.62 -7.42 76.44 -7.42ZM82.39 0V-7.57L83.72 -14.44L82.39 -21.26V-28.19H91.12V0Z M97.38 0V-42.11H106.26V0Z M112.52 0V-42.11H121.39V0Z M141.23 0.64Q136.85 0.64 133.36 -1.31Q129.86 -3.25 127.83 -6.61Q125.8 -9.98 125.8 -14.15Q125.8 -18.33 127.82 -21.63Q129.83 -24.94 133.33 -26.88Q136.82 -28.83 141.2 -28.83Q145.61 -28.83 149.09 -26.9Q152.57 -24.97 154.6 -21.65Q156.63 -18.33 156.63 -14.15Q156.63 -9.98 154.61 -6.61Q152.6 -3.25 149.12 -1.31Q145.64 0.64 141.23 0.64ZM141.2 -7.42Q143.12 -7.42 144.56 -8.27Q146.02 -9.11 146.81 -10.63Q147.61 -12.15 147.61 -14.12Q147.61 -16.1 146.78 -17.59Q145.96 -19.08 144.54 -19.92Q143.12 -20.76 141.2 -20.76Q139.34 -20.76 137.9 -19.91Q136.45 -19.05 135.63 -17.56Q134.82 -16.07 134.82 -14.09Q134.82 -12.15 135.63 -10.63Q136.45 -9.11 137.9 -8.27Q139.34 -7.42 141.2 -7.42Z M165.07 0V-39.85H173.94V0ZM158.69 -20.65V-28.19H180.32V-20.65Z" fill="#3D2415" transform="translate(2.5 3)"/>
    <path d="M13.37 0.73Q10.88 0.73 8.47 0.07Q6.06 -0.58 4.02 -1.75Q1.97 -2.93 0.52 -4.52L5.54 -9.63Q6.96 -8.09 8.87 -7.26Q10.79 -6.44 13.05 -6.44Q14.62 -6.44 15.44 -6.89Q16.27 -7.34 16.27 -8.18Q16.27 -9.22 15.27 -9.77Q14.27 -10.32 12.7 -10.74Q11.14 -11.17 9.4 -11.7Q7.66 -12.24 6.08 -13.17Q4.5 -14.09 3.51 -15.73Q2.52 -17.37 2.52 -19.95Q2.52 -22.65 3.92 -24.66Q5.31 -26.68 7.86 -27.83Q10.41 -28.97 13.86 -28.97Q17.43 -28.97 20.49 -27.74Q23.55 -26.51 25.46 -24.04L20.42 -18.94Q19.08 -20.5 17.43 -21.16Q15.78 -21.81 14.18 -21.81Q12.67 -21.81 11.93 -21.36Q11.19 -20.91 11.19 -20.13Q11.19 -19.23 12.18 -18.7Q13.17 -18.18 14.73 -17.78Q16.3 -17.37 18.02 -16.81Q19.75 -16.24 21.32 -15.24Q22.88 -14.24 23.87 -12.59Q24.85 -10.93 24.85 -8.29Q24.85 -4.15 21.75 -1.71Q18.65 0.73 13.37 0.73Z M48.31 0V-16.04Q48.31 -18.27 46.95 -19.62Q45.59 -20.97 43.48 -20.97Q42.04 -20.97 40.93 -20.36Q39.82 -19.75 39.19 -18.63Q38.57 -17.52 38.57 -16.04L35.12 -17.72Q35.12 -21.05 36.53 -23.53Q37.93 -26.01 40.42 -27.39Q42.91 -28.77 46.15 -28.77Q49.45 -28.77 51.94 -27.39Q54.43 -26.01 55.81 -23.61Q57.19 -21.2 57.19 -18.04V0ZM29.7 0V-42.11H38.57V0Z M74.65 0.58Q70.76 0.58 67.7 -1.33Q64.64 -3.25 62.89 -6.55Q61.13 -9.86 61.13 -14.07Q61.13 -18.3 62.89 -21.62Q64.64 -24.94 67.7 -26.85Q70.76 -28.77 74.65 -28.77Q77.49 -28.77 79.78 -27.67Q82.07 -26.56 83.51 -24.62Q84.94 -22.68 85.14 -20.18V-8Q84.94 -5.51 83.52 -3.57Q82.1 -1.62 79.79 -0.52Q77.49 0.58 74.65 0.58ZM76.44 -7.42Q79.29 -7.42 81.03 -9.29Q82.77 -11.17 82.77 -14.09Q82.77 -16.07 81.98 -17.56Q81.2 -19.05 79.78 -19.91Q78.36 -20.76 76.47 -20.76Q74.62 -20.76 73.2 -19.91Q71.78 -19.05 70.95 -17.55Q70.12 -16.04 70.12 -14.09Q70.12 -12.15 70.93 -10.64Q71.75 -9.13 73.18 -8.28Q74.62 -7.42 76.44 -7.42ZM82.39 0V-7.57L83.72 -14.44L82.39 -21.26V-28.19H91.12V0Z M97.38 0V-42.11H106.26V0Z M112.52 0V-42.11H121.39V0Z M141.23 0.64Q136.85 0.64 133.36 -1.31Q129.86 -3.25 127.83 -6.61Q125.8 -9.98 125.8 -14.15Q125.8 -18.33 127.82 -21.63Q129.83 -24.94 133.33 -26.88Q136.82 -28.83 141.2 -28.83Q145.61 -28.83 149.09 -26.9Q152.57 -24.97 154.6 -21.65Q156.63 -18.33 156.63 -14.15Q156.63 -9.98 154.61 -6.61Q152.6 -3.25 149.12 -1.31Q145.64 0.64 141.23 0.64ZM141.2 -7.42Q143.12 -7.42 144.56 -8.27Q146.02 -9.11 146.81 -10.63Q147.61 -12.15 147.61 -14.12Q147.61 -16.1 146.78 -17.59Q145.96 -19.08 144.54 -19.92Q143.12 -20.76 141.2 -20.76Q139.34 -20.76 137.9 -19.91Q136.45 -19.05 135.63 -17.56Q134.82 -16.07 134.82 -14.09Q134.82 -12.15 135.63 -10.63Q136.45 -9.11 137.9 -8.27Q139.34 -7.42 141.2 -7.42Z M165.07 0V-39.85H173.94V0ZM158.69 -20.65V-28.19H180.32V-20.65Z" fill="none" stroke="#6B4230" stroke-width="3.5" stroke-linejoin="round"/>
    <path d="M13.37 0.73Q10.88 0.73 8.47 0.07Q6.06 -0.58 4.02 -1.75Q1.97 -2.93 0.52 -4.52L5.54 -9.63Q6.96 -8.09 8.87 -7.26Q10.79 -6.44 13.05 -6.44Q14.62 -6.44 15.44 -6.89Q16.27 -7.34 16.27 -8.18Q16.27 -9.22 15.27 -9.77Q14.27 -10.32 12.7 -10.74Q11.14 -11.17 9.4 -11.7Q7.66 -12.24 6.08 -13.17Q4.5 -14.09 3.51 -15.73Q2.52 -17.37 2.52 -19.95Q2.52 -22.65 3.92 -24.66Q5.31 -26.68 7.86 -27.83Q10.41 -28.97 13.86 -28.97Q17.43 -28.97 20.49 -27.74Q23.55 -26.51 25.46 -24.04L20.42 -18.94Q19.08 -20.5 17.43 -21.16Q15.78 -21.81 14.18 -21.81Q12.67 -21.81 11.93 -21.36Q11.19 -20.91 11.19 -20.13Q11.19 -19.23 12.18 -18.7Q13.17 -18.18 14.73 -17.78Q16.3 -17.37 18.02 -16.81Q19.75 -16.24 21.32 -15.24Q22.88 -14.24 23.87 -12.59Q24.85 -10.93 24.85 -8.29Q24.85 -4.15 21.75 -1.71Q18.65 0.73 13.37 0.73Z M48.31 0V-16.04Q48.31 -18.27 46.95 -19.62Q45.59 -20.97 43.48 -20.97Q42.04 -20.97 40.93 -20.36Q39.82 -19.75 39.19 -18.63Q38.57 -17.52 38.57 -16.04L35.12 -17.72Q35.12 -21.05 36.53 -23.53Q37.93 -26.01 40.42 -27.39Q42.91 -28.77 46.15 -28.77Q49.45 -28.77 51.94 -27.39Q54.43 -26.01 55.81 -23.61Q57.19 -21.2 57.19 -18.04V0ZM29.7 0V-42.11H38.57V0Z M74.65 0.58Q70.76 0.58 67.7 -1.33Q64.64 -3.25 62.89 -6.55Q61.13 -9.86 61.13 -14.07Q61.13 -18.3 62.89 -21.62Q64.64 -24.94 67.7 -26.85Q70.76 -28.77 74.65 -28.77Q77.49 -28.77 79.78 -27.67Q82.07 -26.56 83.51 -24.62Q84.94 -22.68 85.14 -20.18V-8Q84.94 -5.51 83.52 -3.57Q82.1 -1.62 79.79 -0.52Q77.49 0.58 74.65 0.58ZM76.44 -7.42Q79.29 -7.42 81.03 -9.29Q82.77 -11.17 82.77 -14.09Q82.77 -16.07 81.98 -17.56Q81.2 -19.05 79.78 -19.91Q78.36 -20.76 76.47 -20.76Q74.62 -20.76 73.2 -19.91Q71.78 -19.05 70.95 -17.55Q70.12 -16.04 70.12 -14.09Q70.12 -12.15 70.93 -10.64Q71.75 -9.13 73.18 -8.28Q74.62 -7.42 76.44 -7.42ZM82.39 0V-7.57L83.72 -14.44L82.39 -21.26V-28.19H91.12V0Z M97.38 0V-42.11H106.26V0Z M112.52 0V-42.11H121.39V0Z M141.23 0.64Q136.85 0.64 133.36 -1.31Q129.86 -3.25 127.83 -6.61Q125.8 -9.98 125.8 -14.15Q125.8 -18.33 127.82 -21.63Q129.83 -24.94 133.33 -26.88Q136.82 -28.83 141.2 -28.83Q145.61 -28.83 149.09 -26.9Q152.57 -24.97 154.6 -21.65Q156.63 -18.33 156.63 -14.15Q156.63 -9.98 154.61 -6.61Q152.6 -3.25 149.12 -1.31Q145.64 0.64 141.23 0.64ZM141.2 -7.42Q143.12 -7.42 144.56 -8.27Q146.02 -9.11 146.81 -10.63Q147.61 -12.15 147.61 -14.12Q147.61 -16.1 146.78 -17.59Q145.96 -19.08 144.54 -19.92Q143.12 -20.76 141.2 -20.76Q139.34 -20.76 137.9 -19.91Q136.45 -19.05 135.63 -17.56Q134.82 -16.07 134.82 -14.09Q134.82 -12.15 135.63 -10.63Q136.45 -9.11 137.9 -8.27Q139.34 -7.42 141.2 -7.42Z M165.07 0V-39.85H173.94V0ZM158.69 -20.65V-28.19H180.32V-20.65Z" fill="#E8A86B"/>
  </g>
</svg>`;function bf(e,t){if(typeof document>`u`)return null;let n=document.createElement(`div`),r=t??document.querySelector(`canvas`)?.parentElement??document.body;return n.style.cssText=`
        position: absolute;
        inset: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: ${e};
        z-index: 10000;
    `,getComputedStyle(r).position===`static`&&(r.style.position=`relative`),r.appendChild(n),n}function xf(e){let t=document.createElement(`div`);t.style.cssText=`
        width: 228px;
        height: 4px;
        background: ${e.track};
        overflow: hidden;
    `;let n=document.createElement(`div`);return n.style.cssText=`
        width: 0%;
        height: 100%;
        background: ${e.bar};
        transition: width 0.15s ease-out;
    `,t.appendChild(n),{track:t,bar:n}}function Sf(e,t,n,r){let i=document.createElement(`div`);i.style.cssText=`max-width: 400px; color: ${n.text}; font: 14px/1.5 system-ui, sans-serif; text-align: center;`,i.textContent=t,r?r.replaceWith(i):e.appendChild(i)}function Cf(e,t){let n=null,r=null,i=null;return{show(){if(n=bf(e.bg,t),!n)return;let a=document.createElement(`div`);a.innerHTML=yf,a.style.cssText=`width: 228px; height: 64px; margin-bottom: 24px;`,n.appendChild(a);let o=xf(e);return r=o.bar,i=o.track,n.appendChild(o.track),()=>{n?.remove(),n=null,r=null,i=null}},update(e){r&&(r.style.width=`${e*100}%`)},error(t){n&&Sf(n,t,e,i??void 0)}}}var wf=e=>Cf(vf,e),Tf=Be(16),Ef=[];function Df(e){return Ef[e]}function Of(e){let t=Tf.get(e),n=Ef[e];if(!t||!n)return[];let r=[];for(let[e,i]of n){let n=t.paramLayout.get(e);n!==void 0&&r.push([n,i])}return r}var kf=Be(256);function Af(e){if(!e.backend)return;let t=kf.all();for(let n=0;n<t.length;n++){let r=t[n];r.data&&e.registeredSampleVersions.get(n)!==r.version&&(e.backend.send({type:`set_sample`,id:n,data:r.data}),e.registeredSampleVersions.set(n,r.version))}}var jf=523.2511;function Mf(e,t=0,n=0,r=0){return(e>0?e:jf)*2**(t+n/12+r/1200)}var Nf=`modulepreload`,Pf=function(e){return`/`+e},Ff={},If=function(e,t,n){let r=Promise.resolve();if(t&&t.length>0){let e=function(e){return Promise.all(e.map(e=>Promise.resolve(e).then(e=>({status:`fulfilled`,value:e}),e=>({status:`rejected`,reason:e}))))},i=document.getElementsByTagName(`link`),a=document.querySelector(`meta[property=csp-nonce]`),o=a?.nonce||a?.getAttribute(`nonce`);r=e(t.map(e=>{if(e=Pf(e,n),e in Ff)return;Ff[e]=!0;let t=e.endsWith(`.css`),r=t?`[rel="stylesheet"]`:``;if(n)for(let n=i.length-1;n>=0;n--){let r=i[n];if(r.href===e&&(!t||r.rel===`stylesheet`))return}else if(document.querySelector(`link[href="${e}"]${r}`))return;let a=document.createElement(`link`);if(a.rel=t?`stylesheet`:Nf,t||(a.as=`script`),a.crossOrigin=``,a.href=e,o&&a.setAttribute(`nonce`,o),document.head.appendChild(a),t)return new Promise((t,n)=>{a.addEventListener(`load`,t),a.addEventListener(`error`,()=>n(Error(`Unable to preload CSS for ${e}`)))})}))}function i(e){let t=new Event(`vite:preloadError`,{cancelable:!0});if(t.payload=e,window.dispatchEvent(t),!t.defaultPrevented)throw e}return r.then(t=>{for(let e of t||[])e.status===`rejected`&&i(e.reason);return e().catch(i)})},Lf=64,Rf=8,zf={azimuth:0,elevation:0,distance:0};function Bf(e,t,n,r,i,a,o,s,c,l,u,d){let f=e*r+t*i+n*a,p=e*o+t*s+n*c,m=e*l+t*u+n*d,h=Math.sqrt(e*e+t*t+n*n),g=Math.atan2(f,m),_=h>.001?Math.asin(Math.max(-1,Math.min(1,p/h))):0;return zf.azimuth=g,zf.elevation=_,zf.distance=h,zf}var Vf=L(`audio`),Hf=L(`sound-voices`);function Uf(){let e=[];for(let t=Lf-1;t>=0;t--)e.push(t);let t=[];for(let e=Rf-1;e>=0;e--)t.push(e);return{backend:null,voiceFree:e,voices:Array(Lf).fill(null),registeredVersions:new Map,registeredSampleVersions:new Map,spatialBatch:new Float32Array(Lf*7),spatialLen:0,acousticBatch:new Float32Array(Lf*5),acousticLen:0,transportFree:t,transportBeats:new Map,seekTimes:new Map,idleCallbacks:new Map,beatDecoder:new DataView(new ArrayBuffer(8)),warnedVoiceFull:!1,warnedSpatialFull:!1,voiceGen:Array(Lf).fill(0),idleWatchGen:new Map}}async function Wf(e){if(e.backend)return;e.voiceFree.length=0;for(let t=Lf-1;t>=0;t--)e.voiceFree.push(t);e.voices.fill(null),e.registeredVersions.clear(),e.registeredSampleVersions.clear(),e.idleCallbacks.clear(),e.warnedVoiceFull=!1,e.warnedSpatialFull=!1,e.voiceGen.fill(0),e.idleWatchGen.clear(),e.transportFree.length=0;for(let t=Rf-1;t>=0;t--)e.transportFree.push(t);e.transportBeats.clear();let{WebBackend:t}=await If(async()=>{let{WebBackend:e}=await import(`./web-backend-DHpbmywn.js`);return{WebBackend:e}},[]);e.backend=new t,await e.backend.init({onVoiceIdle(t){Yf(e,t)},onTransportBeat(t,n,r){Xf(e,t,n,r)}})}function Gf(e){return e.backend!==null}function Kf(e){return e.backend?.running??!1}function qf(e){e.backend?.pollReadback(),Af(e),e.backend?.flush()}function Jf(e){e.backend?.dispose(),e.backend=null,e.idleCallbacks.clear(),e.transportBeats.clear(),e.seekTimes.clear()}function Yf(e,t){let n=e.idleWatchGen.get(t);if(n!==void 0&&n!==e.voiceGen[t]){e.idleCallbacks.delete(t),e.idleWatchGen.delete(t);return}e.idleWatchGen.delete(t);let r=e.idleCallbacks.get(t);if(r){e.idleCallbacks.delete(t),r();return}e.voices[t]&&(rp(e,t),e.voiceFree.push(t))}function Xf(e,t,n,r){let i=performance.now(),a=e.seekTimes.get(t);if(a!==void 0){if(i-a<10)return;e.seekTimes.delete(t)}e.beatDecoder.setUint32(0,n,!0),e.beatDecoder.setUint32(4,r,!0),e.transportBeats.set(t,e.beatDecoder.getFloat64(0,!0))}function Zf(e,t,n){if(!e.backend)return;let r=e.voices[t];r&&r.gate===n||(e.backend.send({type:`gate`,voiceId:t,value:n}),r&&(r.gate=n))}function Qf(e,t,n,r){e.backend&&e.backend.send({type:`params`,changes:[[t,n,r]]})}function $f(e,t,n){if(!e.backend||e.registeredVersions.get(t)===n.version)return;e.backend.send({type:`set_instrument`,id:t,nodeCount:n.nodes.length,outputBuf:n.outputBuf,nodes:n.nodes,modulations:n.modulations}),e.registeredVersions.set(t,n.version);let r=Of(t);for(let n=0;n<e.voices.length;n++){let i=e.voices[n];i&&i.instrumentId===t&&(e.backend.send({type:`set_voice_instrument`,voiceId:n,instrumentId:t}),i.gate=-1,tp(e,n,r))}}function ep(e,t,n){if(!e.backend)return;e.backend.send({type:`set_voice_instrument`,voiceId:t,instrumentId:n});let r=e.voices[t];r&&(r.instrumentId=n,r.gate=-1)}function tp(e,t,n){if(!e.backend||n.length===0)return;let r=n.map(([e,n])=>[t,e,n]);e.backend.send({type:`params`,changes:r})}function np(e,t){e.backend?.send({type:`voice_active`,voiceId:t,active:!0})}function rp(e,t){e.backend?.send({type:`voice_active`,voiceId:t,active:!1}),e.voices[t]=null}function ip(e){if(e.voiceFree.length===0)return e.warnedVoiceFull||=(console.warn(`audio: voice pool full (64)`),!0),-1;let t=e.voiceFree.pop();return e.voiceGen[t]++,e.voices[t]={instrumentId:-1,gate:-1},np(e,t),t}function ap(e,t){e.voices[t]&&(rp(e,t),e.idleCallbacks.delete(t),e.voiceFree.push(t),e.warnedVoiceFull=!1)}function op(e,t){return e.voiceGen[t]}function sp(e,t,n){e.idleCallbacks.set(t,n),e.idleWatchGen.set(t,e.voiceGen[t]),e.backend?.send({type:`watch_idle`,voiceId:t})}function cp(e,t,n,r,i,a,o,s){if(e.spatialLen+7>e.spatialBatch.length){e.warnedSpatialFull||=(console.warn(`audio: spatial batch full`),!0);return}e.spatialBatch[e.spatialLen++]=t,e.spatialBatch[e.spatialLen++]=n,e.spatialBatch[e.spatialLen++]=r,e.spatialBatch[e.spatialLen++]=i,e.spatialBatch[e.spatialLen++]=a,e.spatialBatch[e.spatialLen++]=o,e.spatialBatch[e.spatialLen++]=s}function lp(e){!e.backend||e.spatialLen===0||(e.backend.send({type:`spatial`,data:e.spatialBatch,len:e.spatialLen}),e.spatialLen=0)}function up(e,t,n){e.backend?.send({type:`voice_spatial`,voiceId:t,spatial:n})}function dp(e,t){e.backend?.send({type:`voice_one_shot`,voiceId:t})}function fp(e,t,n){let r=Tf.get(n);r&&($f(e,n,r),ep(e,t,n),tp(e,t,Of(n)))}var pp=P(Float32Array,5,0),Z={instrument:I(pp,5,0),loop:I(pp,5,1),volume:I(pp,5,2),pitch:I(pp,5,3),spatial:I(pp,5,4)};F(Z,{defaults:()=>({loop:0,volume:1,pitch:0,spatial:0}),parse:{instrument:e=>Tf.getByName(e)}});var mp={};F(mp,{requires:[H]});function hp(e,t,n){let r=-1,i=1/0;for(let[n,a]of t.voices){let t=op(e,a.slot);t<i&&(i=t,r=n)}r<0||(console.warn(`audio: voice pool full, evicting oldest voice`),ap(e,t.voices.get(r).slot),t.voices.delete(r),t.systemRemovals.add(r),n.entityExists(r)&&(n.hasComponent(r,Z)&&n.removeComponent(r,Z),n.removeEntity(r)))}function gp(e,t,n,r){let i=ip(t);if(i===-1&&(hp(t,n,r),i=ip(t),i===-1))return!1;let a=Z.instrument[e];fp(t,i,a),up(t,i,Z.spatial[e]===1),Zf(t,i,1);let o=Tf.get(a),s=-1,c=1,l=[];if(o){let e=Df(a);if(o.volumeParam&&(s=o.paramLayout.get(o.volumeParam)??-1,e&&(c=e.get(o.volumeParam)??1)),o.pitchParams)for(let t of o.pitchParams){let n=o.paramLayout.get(t)??-1;if(n>=0){let r=e?.get(t)??440,i=t.slice(0,t.indexOf(`.`)),a=e?.get(`${i}.octave`)??0,o=e?.get(`${i}.semitone`)??0,s=e?.get(`${i}.fine`)??0;l.push({offset:n,baseFreq:r,octave:a,semitone:o,fine:s})}}}return n.voices.set(e,{slot:i,volumeOffset:s,baseVolume:c,pitchEntries:l}),Z.loop[e]===0&&(dp(t,i),sp(t,i,()=>{ap(t,i),n.voices.delete(e),n.systemRemovals.add(e),r.entityExists(e)&&(r.hasComponent(e,Z)&&r.removeComponent(e,Z),r.removeEntity(e))})),!0}Kt([Ni,Br,cn,Or,Js,_f,{name:`Audio`,systems:[{group:`simulation`,update(e){let t=Vf.from(e);if(!t||!Gf(t))return;qf(t);let n=Hf.from(e);if(!n)return;if(!Kf(t)){for(let t of n.pending){if(!e.hasComponent(t,Z)){n.pending.delete(t);continue}Z.loop[t]===0&&(n.pending.delete(t),n.systemRemovals.add(t),e.entityExists(t)&&(e.hasComponent(t,Z)&&e.removeComponent(t,Z),e.removeEntity(t)))}return}for(let r of n.pending){if(!e.hasComponent(r,Z)){n.pending.delete(r);continue}if(gp(r,t,n,e))n.pending.delete(r);else break}for(let[e,r]of n.voices){if(r.volumeOffset>=0){let n=Z.volume[e];Qf(t,r.slot,r.volumeOffset,n*n*r.baseVolume)}for(let n of r.pitchEntries){let i=Mf(n.baseFreq,n.octave,Z.pitch[e]+n.semitone,n.fine);Qf(t,r.slot,n.offset,i)}}let r=e.only([mp,ji]);if(r>=0){let i=ji.data,a=r*16,o=i[a+12],s=i[a+13],c=i[a+14],l=i[a],u=i[a+1],d=i[a+2],f=i[a+4],p=i[a+5],m=i[a+6],h=i[a+8],g=i[a+9],_=i[a+10];for(let[r,a]of n.voices){if(Z.spatial[r]!==1||!e.hasComponent(r,ji))continue;let n=r*16,{azimuth:v,elevation:y,distance:b}=Bf(i[n+12]-o,i[n+13]-s,i[n+14]-c,l,u,d,f,p,m,h,g,_);cp(t,a.slot,v,y,b,3,100,1)}lp(t)}},dispose(e){let t=Vf.from(e),n=Hf.from(e);if(t&&n){for(let[,e]of n.voices)Zf(t,e.slot,0),ap(t,e.slot);n.voices.clear(),n.pending.clear(),n.systemRemovals.clear()}t&&Jf(t)}}],components:{Sound:Z,Listener:mp},async initialize(e){let t=Uf();e.setResource(Vf,t);let n={voices:new Map,pending:new Set,systemRemovals:new Set};e.setResource(Hf,n),e.observe(s(Z),e=>{n.pending.add(e)}),e.observe(c(Z),e=>{if(n.systemRemovals.has(e)){n.systemRemovals.delete(e);return}n.pending.delete(e);let r=n.voices.get(e);r&&(n.voices.delete(e),Zf(t,r.slot,0),sp(t,r.slot,()=>{ap(t,r.slot)}))});try{await Wf(t)}catch{t.backend=null}}},Pu,Vu]),qt(wf);var _p=`
struct BVHNode {
    c0_minX: f32, c0_minY: f32, c0_minZ: f32, child0: u32,
    c0_maxX: f32, c0_maxY: f32, c0_maxZ: f32, _pad0: u32,
    c1_minX: f32, c1_minY: f32, c1_minZ: f32, child1: u32,
    c1_maxX: f32, c1_maxY: f32, c1_maxZ: f32, _pad1: u32,
    c2_minX: f32, c2_minY: f32, c2_minZ: f32, child2: u32,
    c2_maxX: f32, c2_maxY: f32, c2_maxZ: f32, _pad2: u32,
    c3_minX: f32, c3_minY: f32, c3_minZ: f32, child3: u32,
    c3_maxX: f32, c3_maxY: f32, c3_maxZ: f32, _pad3: u32,
}`,vp=1e-7,yp=1e-10,bp=`
struct BLASNode {
    minX: f32, minY: f32, minZ: f32, leftChild: u32,
    maxX: f32, maxY: f32, maxZ: f32, rightChild: u32,
}`,xp=`
struct BLASTriangle {
    v0: vec3<f32>, _pad0: u32,
    e1: vec3<f32>, _pad1: u32,
    e2: vec3<f32>, _pad2: u32,
    n0_enc: u32, n1_enc: u32, n2_enc: u32, _pad3: u32,
}`,Sp=`
struct Ray {
    origin: vec3<f32>,
    direction: vec3<f32>,
}`,Cp=`
struct HitResult {
    hit: bool,
    t: f32,
    entityId: u32,
    u: f32,
    v: f32,
    normal: vec3<f32>,
    worldPos: vec3<f32>,
}`,wp=`
fn octDecode(enc: u32) -> vec3<f32> {
    let x = f32(enc & 0xFFFFu) / 65535.0 * 2.0 - 1.0;
    let y = f32(enc >> 16u) / 65535.0 * 2.0 - 1.0;
    let z = 1.0 - abs(x) - abs(y);
    var n: vec3<f32>;
    if (z < 0.0) {
        let signX = select(-1.0, 1.0, x >= 0.0);
        let signY = select(-1.0, 1.0, y >= 0.0);
        n = vec3<f32>((1.0 - abs(y)) * signX, (1.0 - abs(x)) * signY, z);
    } else {
        n = vec3<f32>(x, y, z);
    }
    return normalize(n);
}`,Tp=256;`${Nn}${Tp}`,`${zn}${_p}${Bn}${Vn}${Tp}`;var Ep=64;`${xp}${Ep}`,`${xp}${Bn}${Ep}`,`${zn}`,`${Vn}${yp}`;var Dp=`
${_p}

${Bn}
${Vn}
const INVALID_NODE: u32 = 0xFFFFFFFFu;
const MAX_STACK_DEPTH: u32 = 24u;

${wp}
`,Op=`
${bp}
${xp}
`;`${yp}`,L(`bvh`),`${Sp}${Cp}${wa}${Ea}${Dp}${Op}${vp}`,F({width:[],height:[]},{defaults:()=>({width:0,height:480})}),Math.PI*2;var kp=Math.PI/2;Math.PI/180,F({yaw:[],pitch:[],distance:[],size:[],minPitch:[],maxPitch:[],minDistance:[],maxDistance:[],minSize:[],maxSize:[],smoothness:[],sensitivity:[],zoomSpeed:[],orbitButton:[],panButton:[],panX:[],panY:[],panZ:[],flySpeed:[],flyActive:[],suppress:[]},{requires:[H],defaults:()=>({yaw:Math.PI/6,pitch:Math.PI/9,distance:10,size:5,minPitch:-kp+.01,maxPitch:kp-.01,minDistance:1,maxDistance:30,minSize:.5,maxSize:50,smoothness:.3,sensitivity:.005,zoomSpeed:.025,orbitButton:0,panButton:2,panX:0,panY:0,panZ:0,flySpeed:5,flyActive:0,suppress:0})});var Ap=P(Float32Array,12,0),jp={offsetX:I(Ap,12,0),offsetY:I(Ap,12,1),offsetZ:I(Ap,12,2),thickness:I(Ap,12,3),visible:I(Ap,12,4),overdraw:I(Ap,12,5),opacity:I(Ap,12,7),color:dt(Ap,12,8),colorR:I(Ap,12,8),colorG:I(Ap,12,9),colorB:I(Ap,12,10)};F(jp,{requires:[H],defaults:()=>({offsetX:1,offsetY:0,offsetZ:0,thickness:2,visible:1,opacity:1,color:16777215}),format:{color:x}}),`${wa}`,L(`lines`),P(Uint32Array,1,0),P(Uint32Array,1,0);var Mp=P(Float32Array,4,0);F({start:I(Mp,4,0),end:I(Mp,4,1),size:I(Mp,4,2)},{requires:[jp],defaults:()=>({start:0,end:1,size:1})}),`${wa}`,L(`arrows`),P(Uint32Array,2,0);var Np=Be(64),Pp=P(Float32Array,12,0),Fp=P(Uint32Array,1,0),Ip=new Map;function Lp(){return new Proxy({},{get(e,t){let n=Number(t);if(!Number.isNaN(n))return Ip.get(n)},set(e,t,n){let r=Number(t);return Number.isNaN(r)?!1:(n==null?Ip.delete(r):Ip.set(r,n),!0)}})}F({content:Lp(),font:I(Fp,1,0),fontSize:I(Pp,12,0),opacity:I(Pp,12,1),visible:I(Pp,12,2),anchorX:I(Pp,12,3),anchorY:I(Pp,12,4),color:dt(Pp,12,8),colorR:I(Pp,12,8),colorG:I(Pp,12,9),colorB:I(Pp,12,10)},{requires:[H],defaults:()=>({font:0,fontSize:1,opacity:1,visible:1,anchorX:0,anchorY:0,color:16777215}),parse:{font:Np.getByName},format:{color:x}}),`${wa}`,L(`glyphs`),F({azimuth:[],elevation:[],skyColor:[],horizonColor:[]},{defaults:()=>({azimuth:37,elevation:45,skyColor:0,horizonColor:0})});var Rp={linear:0,"ease-in-quad":1,"ease-out-quad":2,"ease-in-out-quad":3,"ease-in-cubic":4,"ease-out-cubic":5,"ease-in-out-cubic":6,"ease-in-quart":7,"ease-out-quart":8,"ease-in-out-quart":9,"ease-in-quint":10,"ease-out-quint":11,"ease-in-out-quint":12,"ease-in-sine":13,"ease-out-sine":14,"ease-in-out-sine":15,"ease-in-expo":16,"ease-out-expo":17,"ease-in-out-expo":18,"ease-in-circ":19,"ease-out-circ":20,"ease-in-out-circ":21,"ease-in-back":22,"ease-out-back":23,"ease-in-out-back":24,"ease-in-elastic":25,"ease-out-elastic":26,"ease-in-out-elastic":27,"ease-in-bounce":28,"ease-out-bounce":29,"ease-in-out-bounce":30};function zp(e){return Rp[e]??0}F({duration:[]},{defaults:()=>({duration:.5})});var Bp={Idle:0,Playing:1,Complete:2};F({state:[],elapsed:[],duration:[]},{defaults:()=>({state:Bp.Idle,elapsed:0,duration:0}),enums:{state:Bp}}),F({loop:[]},{defaults:()=>({loop:0})});var Vp={Idle:0,Playing:1,Complete:2},Hp=new Map;function Up(){return new Proxy({},{get(e,t){let n=Number(t);if(!Number.isNaN(n))return Hp.get(n)},set(e,t,n){let r=Number(t);return Number.isNaN(r)?!1:(n==null?Hp.delete(r):Hp.set(r,n),!0)}})}F({state:[],to:[],duration:[],elapsed:[],easing:[],field:Up()},{defaults:()=>({state:Vp.Idle,to:0,duration:1,elapsed:0,easing:0}),parse:{easing:zp},enums:{state:Vp}}),F({grid:[]},{defaults:()=>({grid:1})}),`${wa}`,L(`outline`),`${Gi}`,F({step:[],target:[]},{defaults:()=>({step:0,target:0})}),F({from:[],to:[]},{defaults:()=>({from:0,to:0})});var Wp=P(Float32Array,8,0);function Gp(e,t,n,r,i,a,o){return{absorptionLow:e,absorptionMid:t,absorptionHigh:n,scattering:r,transmissionLow:i,transmissionMid:a,transmissionHigh:o}}var Kp=[Gp(.1,.2,.3,.05,.1,.05,.03),Gp(.03,.04,.07,.05,.015,.015,.015),Gp(.05,.07,.08,.05,.015,.002,.001),Gp(.01,.02,.02,.05,.06,.044,.011),Gp(.6,.7,.8,.05,.031,.012,.008),Gp(.24,.69,.73,.05,.02,.005,.003),Gp(.06,.03,.02,.05,.06,.044,.011),Gp(.12,.06,.04,.05,.056,.056,.004),Gp(.11,.07,.06,.05,.07,.014,.005),Gp(.2,.07,.06,.05,.2,.025,.01),Gp(.13,.2,.24,.05,.015,.002,.001)],qp={Generic:0,Brick:1,Concrete:2,Ceramic:3,Gravel:4,Carpet:5,Glass:6,Plaster:7,Wood:8,Metal:9,Rock:10};function Jp(e,t){let n=Kp[t];if(!n)return;let r=Wp.chunks[e>>>12],i=(e&Ue)*8;r[i]=n.absorptionLow,r[i+1]=n.absorptionMid,r[i+2]=n.absorptionHigh,r[i+3]=n.scattering,r[i+4]=n.transmissionLow,r[i+5]=n.transmissionMid,r[i+6]=n.transmissionHigh,r[i+7]=t}F({preset:new Proxy([],{set(e,t,n){if(typeof t==`string`){let e=Number(t);e>=0&&Jp(e,n)}return Reflect.set(e,t,n)},get(e,t){if(typeof t==`string`){let e=Number(t);if(e>=0)return Wp.chunks[e>>>12][(e&Ue)*8+7]}return Reflect.get(e,t)}}),absorptionLow:I(Wp,8,0),absorptionMid:I(Wp,8,1),absorptionHigh:I(Wp,8,2),scattering:I(Wp,8,3),transmissionLow:I(Wp,8,4),transmissionMid:I(Wp,8,5),transmissionHigh:I(Wp,8,6)},{defaults:()=>({preset:qp.Generic}),enums:{preset:qp}});var Yp=44100,Xp=Math.floor(.01*Yp),Zp=8*Xp,Qp=[];{for(let e=0;e<3;e++){let t=new Float32Array(Zp),n=305419896+e*2654435769;for(let e=0;e<Zp;e++)n^=n<<13,n^=n>>>17,n^=n<<5,t[e]=(n>>>0)/4294967295*2-1;Qp.push(t)}let e=e=>1-Math.exp(-2*Math.PI*e/Yp),t=e(800),n=e(8e3);for(let e=0;e<3;e++){let r=Qp[e],i=0,a=0;for(let o=0;o<r.length;o++){let s=r[o];i+=t*(s-i),a+=n*(s-a),e===0?r[o]=i:e===1?r[o]=a-i:r[o]=s-a}}}1/Xp,`${_l}${zn}${Bn}${Hn}${Vn}${yl}${bl}`,`${_l}${zn}${Bn}${Hn}${Vn}${yl}${bl}`,F({},{}),L(`acoustics-occlusion`),L(`acoustics-reflection`),F({intensity:[],threshold:[],radius:[]},{defaults:()=>({intensity:.2,threshold:.8,radius:.5})}),F({intensity:[],ghosts:[],dispersal:[],haloRadius:[],chromatic:[],starburst:[]},{defaults:()=>({intensity:.1,ghosts:4,dispersal:.3,haloRadius:.6,chromatic:.01,starburst:.1})}),F({intensity:[],samples:[],decay:[],density:[]},{defaults:()=>({intensity:.2,samples:32,decay:.97,density:1})}),L(`readback`);var $p=[0,255,112,88,15,63,81,232,20,144,93,17,31,164,10,103];function em(e,t){return Math.round(e*255/t)}function tm(e,t=255){return[em(e&7,7),em(e>>3&7,7),em(e>>6&3,3),t]}var nm=$p.map((e,t)=>tm(e,t===0?0:255));if(nm.length!==16)throw Error(`palette must contain 16 entries`);var rm=class{width=304;height=256;pixels=new Uint8Array(this.width*this.height);rgba=new Uint8ClampedArray(this.width*this.height*4);clear(e=0){this.pixels.fill(e&15)}setPixel(e,t,n){e<0||t<0||e>=this.width||t>=this.height||(this.pixels[t*this.width+e]=n&15)}fillRect(e,t,n,r,i){let a=Math.max(0,e),o=Math.max(0,t),s=Math.min(this.width,e+n),c=Math.min(this.height,t+r),l=i&15;for(let e=o;e<c;e++)this.pixels.fill(l,e*this.width+a,e*this.width+s)}blitNibbles(e,t,n,r={}){let i=r.transparent??0;for(let r=0;r<n.length;r++){let a=n[r];for(let n=0;n<a.length;n++){let o=a[n]&15;o!==i&&this.setPixel(e+n,t+r,o)}}}blitTexture(e,t,n,r={}){let i=r.transparent??0,a=r.tint;for(let r=0;r<n.height;r++)for(let o=0;o<n.width;o++){let s=n.pixels[r*n.width+o]&15;s!==i&&this.setPixel(e+o,t+r,a??s)}}toImageData(){for(let e=0;e<this.pixels.length;e++){let[t,n,r,i]=nm[this.pixels[e]],a=e*4;this.rgba[a]=t,this.rgba[a+1]=n,this.rgba[a+2]=r,this.rgba[a+3]=this.pixels[e]===0?255:i}return new ImageData(this.rgba,this.width,this.height)}},im=function(e){return e[e.P1Left=1]=`P1Left`,e[e.P1Right=2]=`P1Right`,e[e.P1Flap=4]=`P1Flap`,e[e.P1Start=8]=`P1Start`,e[e.Coin=16]=`Coin`,e}({}),am=class{bits=0;set(e,t){t?this.bits|=e:this.bits&=~e}},om=[{name:`CLIF1L`,sourcePtr:74,startAddress:325,dmaControl:5378,widthBytes:17,height:6,width:34,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAGCAYAAACmekziAAAAp0lEQVR4AcXBwW3DMAxA0S8go9DDUHePwQ5TjeG7OIy5iwMLKFEhcZJb3ivd1oMvq20rt4iNPyZMnJVT841TVx60IJmQnJWTsvGJ8qscACakFjzwnaErQwsmJgwtSCZQnaQL6ccp/FNUOHiiK7QgmUB1hq4MLZiYQHWSLgwmUJ3Bg8ITNy5U51J16EoyYajOxHeSB4UXigoHH+oK1ZnowuA7lzwovHEHfpE3uja9vwUAAAAASUVORK5CYII=`,``+import.meta.url).href},{name:`CLIF1R`,sourcePtr:239,startAddress:32325,dmaControl:7170,widthBytes:24,height:6,width:48,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAGCAYAAACFIR03AAAAw0lEQVR4AdXBzW3DMAyA0U+AR6GGke4eg1mGY+geDiPu4sJGY0T1T3Pope+lp84L/1S1lqZC4ycLDlTYWLATmSk0VhYMVNhYgAoDZ2ZVaLw4M+8iGisVNhbsRGZeEm+KsHCjZA5UGFiwU4Hq7ErmksjMKqKxUoHqbErm1MNJiQtFWLhRMrdUoDqnSgYVsGCgwqY6p0pm8HDSxAUPEsCiLHyzYOCdS965VZ2PPQtYgHcOJn5hwc47f8I7l1TAOwML8M6pL8ylQlr9agAiAAAAAElFTkSuQmCC`,``+import.meta.url).href},{name:`CLIF2`,sourcePtr:493,startAddress:11089,dmaControl:10252,widthBytes:44,height:8,width:88,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFgAAAAICAYAAAB9GzjDAAABY0lEQVR4AcXB25EiMRBFwSNfVMYU/z1eCGOQF/DPNabkS2+MYlbRCugF5rWZ6VqWlRc5F7ZqAwWdH8/8Jp3euDqDWHAuvBMLzgWx8L+ka1lWdjgXnlEbnYLOj2d+g05vuPFPJfOQWNhyLtwjFv5yLjwjsbEWVjZq40bJTGpjomDw45mfoNMb79x4Scnsqg1KpquNrmRu1Mag4C41Eh8SOzyz8oAbnYLOjUHBj3IDBYMbNxTgxrdQsOvqDKmS2Eg8sBZWNmrjLgWDGxMFEzcmCnBjUDC40Sn4Eje6kulqg5LpauOGgokbNxRwdaiN4SgSG4kda2EFqI27FEzc6BQMbqCgc2NQMHFjUDC4MZRMdxBPcWOi4IYblExXG52CiRuDgokbKJiokdhI7Dg5Kx8UPMWNTsHEDRR8mhtDyXAQu9zoFDzNDUqGg/g0NRJ3JF7kmZUXuNEp+DI3BgXfyg2OIvHN/gBhxIjrIWhp1AAAAABJRU5ErkJggg==`,``+import.meta.url).href},{name:`CLIF3U`,sourcePtr:1249,startAddress:25985,dmaControl:6415,widthBytes:29,height:11,width:58,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADoAAAALCAYAAAAunZ4gAAABLElEQVR4Ac3B0a3bMAxA0Uugo4jDsP/JFvYw1hbJvzkMtYuKCIEQxXHroO+lPUfW6VT5Qtmv3Nh84ZN8OTPZiT1SJyp3ubCR0olnxpVHuTDwoLH5wif4csYUpgTOiZtSrkyJRjIiAItReeDBxmrs+ulgysCDzuYL38GXMzemDDzovCAAAmCJyh+Y0nkwMAUPGlMGHnwrUzoPBl4Q7oQHdaLyJBc2psQgFxoPOlP+mSnRSEa4E55YovKm1SAX8OAQUzoPGlMGHjSmvOTBwBQ8aExhdoQHwm9YonKQKZ0HL5nSeHCIKZ0Hu0zpPMALwhPhC1mismM1yAU8+CumdB5gSjc7wo4ffJAHbzNlw4NudoQDhA+xROVNq0EuNB5seEE4SPiPLUb14CUvCG/4BZ7ebz7aj6rnAAAAAElFTkSuQmCC`,``+import.meta.url).href},{name:`CLIF3L`,sourcePtr:943,startAddress:394,dmaControl:9219,widthBytes:32,height:7,width:64,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAHCAYAAAC4NEsKAAAA40lEQVR4AcXB0W2DMBSG0c9SR7GHuXknW5hh8BbhnX+Y612osFqrSKRpo9CeEwCWPKz8UNHMxsYbf0nTlWwDrxYAog3rFDlkzHwqlUZOY+ONv6DpiiV2coSLINvAxpjZiIFaZ+7JkZ0AMBkr35DTWKKT09l44wyarmws0eUIpYKcxhI7OdJdxCFVAh8CwGSsPCCns0Qn51SWaHKEUkFOZ4lDcu5SJfDFG0+Q01gCS5xKTiNnxxI7OdLlSFMqnZxDgSdYZOWfLEZzEQ8tBqXCKAJ3BF7AIisnWwxKpZHza6oEDrwDDhdPEI6G2ygAAAAASUVORK5CYII=`,``+import.meta.url).href},{name:`CLIF3R`,sourcePtr:1582,startAddress:32650,dmaControl:7170,widthBytes:24,height:6,width:48,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAGCAYAAACFIR03AAAAvklEQVR4AdXBwW3DMAxA0S8go5DD0HeNoS6jMXw3hxF3URHBFerEDZzc+l5it5Xc+Ydu7IyVHzUYijDVYCoCTsZYuXMyEStFoAYHIplH1VfuNmOowSSSiVi5KvHAhG7K4I3BlANvPDHlLd442Axq8LYbJ7yBKZhyUIRT3pi8MW0GNThlCt6YFucjiT+Y0AFMGYpADQZvnDIFbxxsBovzxJTJGx9LvNALnd3iXGIKRWBxJlP4chIvmND5xYPEBd+QCEG/5hS1HgAAAABJRU5ErkJggg==`,``+import.meta.url).href},{name:`CLIF4`,sourcePtr:1832,startAddress:13731,dmaControl:9219,widthBytes:32,height:7,width:64,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAHCAYAAAC4NEsKAAABEUlEQVR4AeXB0U3DMBSG0c8So9jD3AHuGGaYegy/9x/G3iUoFomSJi1BwBPnhHv2iX/srffKLEcQzjNG5ZFwZkblkXC2jMqWcF4xKgvhGJWFcIzKTDgzoyIco/KKcIzKIrBxM6YcORDOzKhslc4Qo7MwKq8IZ9F7JUcG4RiVRemgxsoSOzmyKp2dHBlK50CNncCDmzEB5MiqdH5FjlwinFlR5YwlnlJjsARqHKgT2AicuBkTn9Q4ZYlBjVOWGNQY7sZQOoMagyUOcmQlnKLKGUsMamCJlRqoE7gg8AWLTFxkiR01BkugBpZAjcESqHFgiZ0cQThFlSsssVIDdQIvBH7AIhMXWAI1vsUSO+8i8Ac+AEgcZeIDmD7NAAAAAElFTkSuQmCC`,``+import.meta.url).href},{name:`CLIF5_TOP`,sourcePtr:2366,startAddress:7123,dmaControl:22790,widthBytes:93,height:2,width:186,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALoAAAACCAYAAADvl8bpAAAAaElEQVR4Ae3BwRFAMBBA0a+XKGYLWF2sYqQLudtikl4YuWHcjMF4r5lMZz5MSDiKkNiLBTxTST9yJx86pAULHDjK71rNZDrzEULiTCxsWKCKBTxTST9yBx86pGXDAgeO8kRCYuUob7EAn1Mc8Qk72VMAAAAASUVORK5CYII=`,``+import.meta.url).href},{name:`CLIF5_LEFT`,sourcePtr:2254,startAddress:7123,dmaControl:3081,widthBytes:8,height:13,width:16,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAANCAYAAACgu+4kAAAAp0lEQVR4AaXBTZHDMAyA0c9tGJSCBEYACsMcWgyGkXvMYSlYGEzBO6tDZjY/PTTvpSU/BxfcuGgyZo4UZycLOwnAhMGGKf9k4dDEidoIpoTirLJAcUJiY8nPYcz8KU7Iwk5xwsRGqTNmhNoItRFMoTaCKeHOhnfeP51XT6AP8M7KO8GUVeKECcOUU1mgOCQ+MGFwwJRV4gsmDFOoDe58wTtv4MVVJoxfWEgzVlNuV4cAAAAASUVORK5CYII=`,``+import.meta.url).href},{name:`CLIF5_RIGHT`,sourcePtr:2150,startAddress:28883,dmaControl:3081,widthBytes:8,height:13,width:16,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAANCAYAAACgu+4kAAAAq0lEQVR4AaXB0U3DMBQAwHPkUeJhnP+O4S6TMfrfN4y9CwgLRZQCauldurbTmxcsXpSriw/7cKet/pR2Ke/Djba6sw832ko44SK31bQP2upH0U210Fb2wTkuCfIWXKs7WzjUQnSicw7JF7kWtnCIbqrFIbophuSbDLUQneimWhyiE0Pyi+xTLQ7RiSF5wALRiW6KTgzJgxaoxRSdGJInLBDdFEPypAwxJP/0DmRFO+OQn+llAAAAAElFTkSuQmCC`,``+import.meta.url).href}],sm={name:`COMCL5`,sourcePtr:2632,startX:54,startY:211,width:186,height:33,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALoAAAAhCAYAAABur7FxAAAJ9klEQVR4Ae3By5FbyRFA0VsSLWC7kGkDbUjsIS8KNnS7gLKBm8EeaYNogDaZNsCFUnQFVIGHT39JxswI55R9XXf+xowdzhpjx7mW4MFgmz/4nXz7L0yhChecNXc/V9nXdedvwthxS0sWqjC0BA8G2/zB7+Dbf2HKQhUuOGv+jIwdz5w1fxWlVzpXtORCFW5y1hg7TrVkQWTNqcwd/1OFCy0ZRNacy9xRhaklr6rC1JIFDybb/MGv4Nt/8cyUV1VhcNYYO5w1p4wdn9GSm6owtGSqwuSsOWXsuKYlUxWGlkxVuMlZc8rY8awlF6rwotIoBcCEzhlTFqpwU0uGKtCSqQoXWjJUYWrJTVWYWjJUYWrJQhVe1JKhClNLBg9+OVOmKlxoyYUqDC0ZqjC1ZKrC1JKFKiy0hCpMLfm0KgwtuakKCy1ZqMJCS66qwoWWLFQBZ82q7UoBMKFzgykXqkBL7u5+myoMLaEKV62cwRSqQEvYOAWgcGZf193Y8awlQxUutGQSWbNqu8LdTfu67pk7TomsWbVd4e6mfV33zB0esDdoCVWYVs5kCh4MnhROFM6Y0PfGsHIWTMGDwZRp4xQAEzp3V3lStkbnxMYpACZ07q7ypGyNDuDBYAoeDKZMHgyeFM78kzN54OnHgcdDAX2APDDlgcGUqQo8/eDJhM7dTfqVx+03+HFgqAJPP3gyoXN3k37lcfsNfhxAHyAPkAcGUyYP8KTkgSeuKNxgQjflpirQEjZOATChc/ciT8rW6AAbpwCY0Ll7kSdla3TOeIAnhTf4wg2eFKBzhSm0ZDKhc/cqEzonTOjcvcqEDuDBYAoe4Enhjb7wAk8K13VT8ODu7rcxBQ/wAE8K71D4IBM6gCl4cPcGpix4cPcGpgweDJ4U3ukffJAnhSNPCnfv5knh7s08KZ4UPqDwCSZ0U4aNU0zo3F1lylUbp5jQubvKFDZO4ZMKn7Q1Ond3v9DGKXzSF36BKkwtmaowtOS3q8JCS+7eoAoLLfmpqjC15MLGKfwEX/jJPMADTJk8wBRaslCFqSVUYWrJQhUWWvKiKgwtoQpTSz7Fg8GUPx0PMOXNPJj2xoWW0JKhCkMVaMlUhaklC1WYWjJV4aoqDC2hCrTkpyl8wtboImsyd1RhaAkeLOyNoSVUYWHlTHvjQkvw4EWmUIWFlvxUHkym/Cl5wN4YWnJTFVg5gykXPJhMwYPJFKpwoSVTFaaV86q9QUuowuSsebZqu8JPUPiErdGrQEuGKtCSD/OAvTGsnMmUwYPJlA/zYNgbQ0tu8mAy5U/PA/bGQksWqsDKGUzBA0zBg6tMmTzAFKpAS4YqLLRkqAIr54IpgweDKXiAKVRhcNY8y9yxcQqfVPiErdEBqjC0ZPBgwZTBgwuelF7pAC3Bg8mUyYPBlKEKCy2ZPJhMwYPJlMGDYW8MLRmqQEsGDzDlL8UD9sbQkoUqDKVRTOhcYQoeDKbgwU2m4MGwN6aVgylDFVg5V5mCBwt7Y1g5mEIVKI3CJxU+aGv0KgwtGTxYMGXw4CpPyr6uu7HjWUuu8gBTpioMLcGDq0wZPFjwpGyN7gGmUIWFlTOY8pflwbQ3aAke4EkBMKHzTqZMHgymDB5cMGXaOMWEzglTBg8wBQ8WTBlE1qzarvBJhXfa13UHMHb8z8rBFDyYTMGDBVPwYPKkbI0O4AF7Y2jJ5AGmDFWYVs5kyuABpgweXPCkmNBNWfBgwZS/BQ8WTJk2TuHIhM47mIIHkyl4MOyNqSWDyJpV2xUTOleYslCFyVmzarvCJxXeaWt0kTWZO555MJkyeDCZMniw4EkBMKEDmHLBA0y5yoM38aRwZELfG7Rk8gBT/vY8wJQ38eDNTBk8GEyhCgvOmlXbFQATOkemDB4MpkwesDeGluABnhQ+qPBOW6MDePBhnhQAEzpHplAFWkIVWDmDKZMH7+JJ2RqdOzwYTKEKtOSmKlAaBcCEzg2m4AGm4AGm4MFNnhQTOleYggeYMnkwmcLGKXxQ4Y16pQO0hCrQkgUP3sSTArA1Oic8uMqUwYMXeVIATOgAnpSt0TmqAi35v+bBYMqrqkBpFBM6R54UABM6Z0zBgxd5UgBM6LzClKkKQ2kUPqjwRlujA1RhaMngwZt5UgC2RucKDyZTJg8WPCmc6ZXeEjZOMaF7UrZGF1mTueMaDwZT/m94MJlyk8iaZ6u2KxxtjQ6wcYoJnSNT8GDBlKkKOGuMHaVROGNC5wZTqMLgrGm+w5PCO/2Dd6gCK4eVgwd48CJPiifFk8LR1ujcYMrkwVWeFM5sjc7R1ui8QRX+EjwYPPjpPLiqChg7npnQOdMr3ZPCkQcXPMADqjC15CpPiieFKzxg5UzV1nzEF86Y0AFMQWTNM2NHS2gJpgwe3ORJ4YwnZWt0kTWZO05VgZbgwWTKVSZ0TwonqkBLJk8KQBVwLlWBlfMhHmAKHgym/DIeYAoeDB5gyod5gCmDB4MH7A1aQhWmluCx45qW0Cu9NApHJnROmIIHtGSosmMVvMiTYkLnjCm0hCo7PuqfnNGvPJoyHA7/4fu//8OhMHlAHrjJk8IN1daPmTtOVYGW4MFkyuTBhTzwxNHW6E//Bn1g8uQJ4Nu39aOx49tX+HFgqAItIQ8MprzIA/QBPEAfQB/Ag8GUX8ID9AH0gaH9oOSBJ/3KYx5AH3iVB+QB9IFJH5j0AfLA8D0hD/A94XvC94Q8MOWBJwBPnkx5BPj2FR6/8fj0gyeAPPCkX3nkKA9gCh6QB/ieYAp74/HpB0/ckAee9CuPnMgD5AEOBX4cwJRHT554hy+cMQUPJlPw4CZPCm+0arvSK50TLcGDyZTJgwueFM6YggcXMncgDFUYWoIHgymvMmUwBQ8mT4opnZ/IA0zBlMmDCx5gygUPMAUPMGXwYMGUyZTJg6s8KZzYOGVr9JbgwYInxYTOkQeDKVNLpq3ROdo4hVd4MJjC1ugAHgyeFF5QONoaHaAKQ0sGD27ypHBDr/SW4AGeFM6Y0DljyuTBBU8KV5jQOeFJ4WhrdI48WDAFDzAFDwZTJg8ueFI4MqEDmPIhHiyYMnkwmcLGKQAmdI5MGTwYTPkQDy54UniBCZ0jTwonTOgApgweYMrgAZ4UABO6KdPGKQAmdI5MmTwYTFnwAE8KL/jCmZYMHnxYr3SOTHnWPSncYMqCB+/iSTGhA3hSOOHBVaYMpuDB5MGbeVJM6B5cMOVVplzlwYIHV3kwmDJ4cJUpgwcXTMGUwYPJhM6RJ4UznhRe4cHkwWRC58gDTMGDyZNiQgfwAFMGUwYPJlPepHC0NTpHHryJJ4UbtkYH8ABPCleY0HkHTwofYELnkzwp3GBC5wZT8GAwZcGDN/OkcMKEzm/kSeGNTOi8kylsnMKRCZ0TplzwYPKk8IL/AhCeosRmAiaHAAAAAElFTkSuQmCC`,``+import.meta.url).href},cm=[{font:`FONT57`,name:`L0`,char:`0`,sourcePtr:19496,widthBytes:3,height:7,width:6,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAHCAYAAAArkDztAAAAN0lEQVR4AV3BwQnAQAzAMDv77+xSyCOcJEAVS5VfFUcVwHBUsYZVpcoagCpVjgFQ5SFAFUsV4AN48BwDFTpYHAAAAABJRU5ErkJggg==`,``+import.meta.url).href},{font:`FONT57`,name:`L1`,char:`1`,sourcePtr:19519,widthBytes:3,height:7,width:6,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAHCAYAAAArkDztAAAAKUlEQVR4AXXBQQoAIADDsG7//3M9CSIs4VLlUQBVFlUeZShDGaLKJ0kO8SYP/qv6X9oAAAAASUVORK5CYII=`,``+import.meta.url).href},{font:`FONT57`,name:`L2`,char:`2`,sourcePtr:19542,widthBytes:3,height:7,width:6,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAHCAYAAAArkDztAAAAL0lEQVR4AW3BwQnAMAwAsTN0/5VVCnmYUGmqoGNmpg+0QH+gzdEG3aAFqp4q6PIC8vsn4nCEp7QAAAAASUVORK5CYII=`,``+import.meta.url).href},{font:`FONT57`,name:`L3`,char:`3`,sourcePtr:19565,widthBytes:3,height:7,width:6,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAHCAYAAAArkDztAAAAMElEQVR4AXXBsQ2AQAADsQv772yE9AUF2KuCjm3rAb1AX6A3R3+g6oI+rAo6tq3qBkXcI+n02QVcAAAAAElFTkSuQmCC`,``+import.meta.url).href},{font:`FONT57`,name:`L4`,char:`4`,sourcePtr:19588,widthBytes:3,height:7,width:6,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAHCAYAAAArkDztAAAALUlEQVR4AYXBQQrAIBAAsaH0/19OERT2Ik2abE1QBR3QBi3QAFVvFfQHqp4uPgH8J99HfpZmAAAAAElFTkSuQmCC`,``+import.meta.url).href},{font:`FONT57`,name:`L5`,char:`5`,sourcePtr:19611,widthBytes:3,height:7,width:6,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAHCAYAAAArkDztAAAAL0lEQVR4AXXBsQ0AIAzAsIT/fw4LA0LFtoqHKlUMrOKiyqQKYPGxqhgIUMWhCrABNmMX/KC9T+4AAAAASUVORK5CYII=`,``+import.meta.url).href},{font:`FONT57`,name:`L6`,char:`6`,sourcePtr:19634,widthBytes:3,height:7,width:6,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAHCAYAAAArkDztAAAAMklEQVR4AXXBwQmAQADEwOT67zkirB/RGQGqGFVuVXw4TMOjYaoADoAqL4cfAlQxqgAX+r0f9UZDnFcAAAAASUVORK5CYII=`,``+import.meta.url).href},{font:`FONT57`,name:`L7`,char:`7`,sourcePtr:19657,widthBytes:3,height:7,width:6,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAHCAYAAAArkDztAAAAJ0lEQVR4AXXBsQkAIAADsNb/f46rFEwKGW0byAOyIAuyIOPk4+TjAjm7F/J9hHikAAAAAElFTkSuQmCC`,``+import.meta.url).href},{font:`FONT57`,name:`L8`,char:`8`,sourcePtr:19680,widthBytes:3,height:7,width:6,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAHCAYAAAArkDztAAAAM0lEQVR4AXXBsQ2AMAAEMT/773wIKUUa7EGVY9t8qlyq4PFjUOXYNp8qlyp4/BhUObYNXr7fG/gEiBQPAAAAAElFTkSuQmCC`,``+import.meta.url).href},{font:`FONT57`,name:`L9`,char:`9`,sourcePtr:19703,widthBytes:3,height:7,width:6,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAHCAYAAAArkDztAAAAM0lEQVR4AXXBsQ3DMAAEMb733/kMAypUJOSgyrFtPlUuVfD443GpcuuAKr9UwaDKsW3wAgxnI+soRnsvAAAAAElFTkSuQmCC`,``+import.meta.url).href},{font:`FONT57`,name:`LSPC`,char:`space`,sourcePtr:19726,widthBytes:3,height:7,width:6,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAHCAYAAAArkDztAAAAC0lEQVR4AWMYWgAAAK8AAS887QcAAAAASUVORK5CYII=`,``+import.meta.url).href},{font:`FONT57`,name:`LA`,char:`A`,sourcePtr:19749,widthBytes:3,height:7,width:6,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAHCAYAAAArkDztAAAAMElEQVR4AXXBQQrAIBAAsVnp/7+cUvAgBZOpgraZmT7QAapWF08V9AcdoGp1sbp4AXUOF/jBtSylAAAAAElFTkSuQmCC`,``+import.meta.url).href},{font:`FONT57`,name:`LB`,char:`B`,sourcePtr:19772,widthBytes:3,height:7,width:6,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAHCAYAAAArkDztAAAAM0lEQVR4AXXBwQmAQAAEsVmx/5Yjgo/7mAw6bFsv6ABVVz/uPlC1bb2gA1Rd/Rh02LaqB8/7G/tr77eIAAAAAElFTkSuQmCC`,``+import.meta.url).href},{font:`FONT57`,name:`LC`,char:`C`,sourcePtr:19795,widthBytes:3,height:7,width:6,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAHCAYAAAArkDztAAAAMklEQVR4AXXBQQqEQAAEsfT8/88lgodl0WRQ5bFtblV+VLlVeXF8OD4cf6pgUOWxbXABrJwX+THXorUAAAAASUVORK5CYII=`,``+import.meta.url).href},{font:`FONT57`,name:`LD`,char:`D`,sourcePtr:19818,widthBytes:3,height:7,width:6,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAHCAYAAAArkDztAAAALklEQVR4AXXBsQ2AMAAEsfvsv7NpQKKJPei1bX2gF/SBfqDqdHG6OF0M+tm2qgcHbhf5kXQ1QQAAAABJRU5ErkJggg==`,``+import.meta.url).href},{font:`FONT57`,name:`LE`,char:`E`,sourcePtr:19841,widthBytes:3,height:7,width:6,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAHCAYAAAArkDztAAAAM0lEQVR4AW3BwQmAQAAEsVn77zly4EPEZFXQY9s6oBfogH4Metm2DujH1QdUrQp6bFvVDVJtH/JQEiOfAAAAAElFTkSuQmCC`,``+import.meta.url).href},{font:`FONT57`,name:`LF`,char:`F`,sourcePtr:19864,widthBytes:3,height:7,width:6,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAHCAYAAAArkDztAAAAL0lEQVR4AXXBsQ2AQAADsQv772z0EgUF2KuCHtvWAb1AB/Rh0Mu2dUAfrn5c/bgBiyUX90YNoFUAAAAASUVORK5CYII=`,``+import.meta.url).href},{font:`FONT57`,name:`LG`,char:`G`,sourcePtr:19887,widthBytes:3,height:7,width:6,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAHCAYAAAArkDztAAAAM0lEQVR4AXXBsQ3AMAzAMCn//6wigAcPKSlAFUOVq4qliquKh8OPw9IAOCyqDAGqGKoAHwHyG/lzuj97AAAAAElFTkSuQmCC`,``+import.meta.url).href},{font:`FONT57`,name:`LH`,char:`H`,sourcePtr:19910,widthBytes:3,height:7,width:6,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAHCAYAAAArkDztAAAALUlEQVR4AXXBwQnAMAwAscN0/5VVAn2EgqUO6AMd0AWqpsVTBf1BF6iaFtPiBeGZG++G/w91AAAAAElFTkSuQmCC`,``+import.meta.url).href},{font:`FONT57`,name:`LI`,char:`I`,sourcePtr:19933,widthBytes:2,height:7,width:4,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAHCAYAAAAvZezQAAAAJ0lEQVR4AV3BwQkAMBDDsDj77+xSuFckVHMA8qnmNKMZzWgGqjkAD4sqDAfYFHM8AAAAAElFTkSuQmCC`,``+import.meta.url).href},{font:`FONT57`,name:`LJ`,char:`J`,sourcePtr:19949,widthBytes:3,height:7,width:6,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAHCAYAAAArkDztAAAAKklEQVR4AXXBsQHAIAzAMCX//+wuDB1A8tfhpgrWw3pYD1vlYqDKMTMDHwYME/rxPYXTAAAAAElFTkSuQmCC`,``+import.meta.url).href},{font:`FONT57`,name:`LK`,char:`K`,sourcePtr:19972,widthBytes:3,height:7,width:6,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAHCAYAAAArkDztAAAAK0lEQVR4AV3BgQkAIAzAsP7/dESYMEyCFuiCBvRAFbQZ/aAK2qABPdACVQcRtzfJmZN6OAAAAABJRU5ErkJggg==`,``+import.meta.url).href},{font:`FONT57`,name:`LL`,char:`L`,sourcePtr:19995,widthBytes:3,height:7,width:6,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAHCAYAAAArkDztAAAAKElEQVR4AXXBwQmAAAwAsaO4/8oRv8UmfaAN+jEdpsN0mBaoeqqg5QW2Yg/9OH86eAAAAABJRU5ErkJggg==`,``+import.meta.url).href},{font:`FONT57`,name:`LM`,char:`M`,sourcePtr:20018,widthBytes:4,height:7,width:8,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAHCAYAAAA1WQxeAAAAMUlEQVR4AYXBwQkAMAzEMCf77+xSuEIehUhcBoDBo0qoEqoAzaJZNItmqKriR5VBlTil5SPp4iE9XwAAAABJRU5ErkJggg==`,``+import.meta.url).href},{font:`FONT57`,name:`LN`,char:`N`,sourcePtr:20048,widthBytes:3,height:7,width:6,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAHCAYAAAArkDztAAAAMUlEQVR4AXXBsQ3AMAzAMMn//6wuHowCIaniqAIYgCp+BkC1imN4GB6GpVrFGg5V1ge4OBQFNpxjjAAAAABJRU5ErkJggg==`,``+import.meta.url).href},{font:`FONT57`,name:`LO`,char:`O`,sourcePtr:20071,widthBytes:3,height:7,width:6,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAHCAYAAAArkDztAAAALklEQVR4AXXBsQ2AMAAEMX/23/kQEgVN7EGVz7Z5VfmpguPiuDgujotBlc+2wQNH4BAD8s5yGQAAAABJRU5ErkJggg==`,``+import.meta.url).href},{font:`FONT57`,name:`LP`,char:`P`,sourcePtr:20094,widthBytes:3,height:7,width:6,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAHCAYAAAArkDztAAAAL0lEQVR4AXXBsQ3AMAzAMMn//6wiQIcMMSlAFT9VjiouVQDDwiouqhxVPAyLYfEBo+sT/UkW/bQAAAAASUVORK5CYII=`,``+import.meta.url).href},{font:`FONT57`,name:`LQ`,char:`Q`,sourcePtr:20117,widthBytes:3,height:7,width:6,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAHCAYAAAArkDztAAAAMElEQVR4AXXBsQ3AMAzAMDn//8yigIcsIacKWjMz/aALVJ0eTg+nBd2gBd2sKqj6AObFI+gTjsiwAAAAAElFTkSuQmCC`,``+import.meta.url).href},{font:`FONT57`,name:`LR`,char:`R`,sourcePtr:20140,widthBytes:3,height:7,width:6,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAHCAYAAAArkDztAAAAMklEQVR4AXXBwQmAQAAEsVn77zkiKNzHZFXQa9t6QAeouvox6LBtPaAKOkEv6AMdoOoGYsAn5WjQJrwAAAAASUVORK5CYII=`,``+import.meta.url).href},{font:`FONT57`,name:`LS`,char:`S`,sourcePtr:20163,widthBytes:3,height:7,width:6,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAHCAYAAAArkDztAAAAMElEQVR4AXXBsQ2AQAADsQv772yE9AUF2KuCjm3rAb1AD0d/HP2Bqgv6sCro2LaqG13gJ+UkVBIdAAAAAElFTkSuQmCC`,``+import.meta.url).href},{font:`FONT57`,name:`LT`,char:`T`,sourcePtr:20186,widthBytes:3,height:7,width:6,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAHCAYAAAArkDztAAAAMElEQVR4AXXBsQ2AMAAEMX/23/kQEgVN7EGVz7Z5VUEVVPmr8nNcHBfHxaDKZ9vgATsqF/nmCXGjAAAAAElFTkSuQmCC`,``+import.meta.url).href},{font:`FONT57`,name:`LU`,char:`U`,sourcePtr:20209,widthBytes:3,height:7,width:6,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAHCAYAAAArkDztAAAALUlEQVR4AXXBsQ3AMAzAMDr//6wiQIYuJl1VnipXlZ8qOBbH4lgci4Eqz8wMfLRrE/pkhC/tAAAAAElFTkSuQmCC`,``+import.meta.url).href},{font:`FONT57`,name:`LV`,char:`V`,sourcePtr:20232,widthBytes:3,height:7,width:6,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAHCAYAAAArkDztAAAAK0lEQVR4AYXBsQ3AIBAAsdPvv7MREgVNgt0GHdAGXaBq+jD9gSromF6gywKlzBvrL9M2wQAAAABJRU5ErkJggg==`,``+import.meta.url).href},{font:`FONT57`,name:`LW`,char:`W`,sourcePtr:20255,widthBytes:4,height:7,width:8,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAHCAYAAAA1WQxeAAAALklEQVR4AY3BgQmAMBAAseP33zkiVCgi1KQbtIEe0Aeomg6mDfQyHUx/WKosLRdz5iPlYNREhgAAAABJRU5ErkJggg==`,``+import.meta.url).href},{font:`FONT57`,name:`LX`,char:`X`,sourcePtr:20285,widthBytes:3,height:7,width:6,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAHCAYAAAArkDztAAAAKklEQVR4AX3BwQkAIAwAsaP77xxfggiaBB2gavqBKugG3aAK2qADVE0PC1NyI+Hi9TEKAAAAAElFTkSuQmCC`,``+import.meta.url).href},{font:`FONT57`,name:`LY`,char:`Y`,sourcePtr:20308,widthBytes:3,height:7,width:6,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAHCAYAAAArkDztAAAAK0lEQVR4AX3BwQkAIRAAsWH77zmH4EMONGmBNmiBDlA1vUAV9Acdpovp4gMzxBvrL4A0owAAAABJRU5ErkJggg==`,``+import.meta.url).href},{font:`FONT57`,name:`LZ`,char:`Z`,sourcePtr:20331,widthBytes:3,height:7,width:6,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAHCAYAAAArkDztAAAAKElEQVR4AW3BsQ3AQBAEodn+i+ZT62RYFfSxbV3QBV3QBV3Qj0HHtj30cBvvppGFIgAAAABJRU5ErkJggg==`,``+import.meta.url).href},{font:`FONT57`,name:`LBARW`,char:`back_arrow`,sourcePtr:20354,widthBytes:3,height:7,width:6,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAHCAYAAAArkDztAAAAKUlEQVR4AXXBQQoAIAwDsPb/j44IHmSwJD/IBJkgQyFD2+aCbCAbyHMA4uYb6trTFycAAAAASUVORK5CYII=`,``+import.meta.url).href},{font:`FONT57`,name:`LEQU`,char:`equals`,sourcePtr:20377,widthBytes:3,height:5,width:6,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAFCAYAAABmWJ3mAAAAIElEQVR4AZXBsQ0AIAAEoWf/oc/exELYN1W7wF5U7QIHfFAIA6gDmvcAAAAASUVORK5CYII=`,``+import.meta.url).href},{font:`FONT57`,name:`LDSH`,char:`dash`,sourcePtr:20394,widthBytes:3,height:4,width:6,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAECAYAAACtBE5DAAAAF0lEQVR4AWOgHmD8////fwY0wMjIyAgAWi0EApwJITUAAAAASUVORK5CYII=`,``+import.meta.url).href},{font:`FONT57`,name:`LQUE`,char:`question`,sourcePtr:20408,widthBytes:3,height:7,width:6,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAHCAYAAAArkDztAAAAK0lEQVR4AZXBsQnAMBAAsfvsv7NMIIVxFUtTBX1mZnpBG6h6+gM6QVegzQKLwRfwdndRfQAAAABJRU5ErkJggg==`,``+import.meta.url).href},{font:`FONT57`,name:`LEXC`,char:`exclamation`,sourcePtr:20431,widthBytes:1,height:7,width:2,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAAHCAYAAAAie5yXAAAAH0lEQVR4AWXBsQ0AMBDEIHT77+w03wVUwZw5c+ZTBQ8MhggB3zaLCgAAAABJRU5ErkJggg==`,``+import.meta.url).href},{font:`FONT57`,name:`LBRKL`,char:`left_paren`,sourcePtr:20440,widthBytes:2,height:7,width:4,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAHCAYAAAAvZezQAAAAJElEQVR4AW3BwQkAIAwAsaP77xxfBRGTFrSgBV2mx/QDvaDqAP6fE/FOwf7xAAAAAElFTkSuQmCC`,``+import.meta.url).href},{font:`FONT57`,name:`LBRKR`,char:`right_paren`,sourcePtr:20456,widthBytes:2,height:7,width:4,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAHCAYAAAAvZezQAAAAI0lEQVR4AW3BwQkAIAwAsaP77xxfghSToA3aoGpaph/ogh4HHo4T8eq5D0AAAAAASUVORK5CYII=`,``+import.meta.url).href},{font:`FONT57`,name:`LSQOT`,char:`apostrophe`,sourcePtr:20472,widthBytes:1,height:2,width:2,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAFUlEQVR4AWP4////fwYGBgYmBigAAD3mA/+YDucOAAAAAElFTkSuQmCC`,``+import.meta.url).href},{font:`FONT57`,name:`LCMMA`,char:`comma`,sourcePtr:20476,widthBytes:1,height:7,width:2,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAAHCAYAAAAie5yXAAAAF0lEQVR4AWMgCfz///8/AwMDAxMDFAAAPhMD/66D138AAAAASUVORK5CYII=`,``+import.meta.url).href},{font:`FONT57`,name:`LPER`,char:`period`,sourcePtr:20485,widthBytes:1,height:7,width:2,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAAHCAYAAAAie5yXAAAAE0lEQVR4AWMgD/z///8/AwMDAwAaJQP9VfJzrQAAAABJRU5ErkJggg==`,``+import.meta.url).href},{font:`FONT57`,name:`LSLSH`,char:`slash`,sourcePtr:20494,widthBytes:3,height:7,width:6,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAHCAYAAAArkDztAAAAJElEQVR4AY3BwQkAIAwAsaP77xz/RcGkDaqmH9AGbdAGXUwPB10UE/HQIuaXAAAAAElFTkSuQmCC`,``+import.meta.url).href},{font:`FONT57`,name:`LAMP`,char:`ampersand`,sourcePtr:20517,widthBytes:3,height:7,width:6,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAHCAYAAAArkDztAAAALUlEQVR4AX3BsQkAIBAAscP9d44IFvKFSQc0QRX0WP1AE1RBFXRAF/RyVUHVBnjoL9MUTGLdAAAAAElFTkSuQmCC`,``+import.meta.url).href},{font:`FONT57`,name:`LDQOT`,char:`quote`,sourcePtr:20540,widthBytes:2,height:2,width:4,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAACCAYAAAB/qH1jAAAAGklEQVR4AV3BsQ0AAAzDINT/f3b2giqogvMM22gH+xDZfj8AAAAASUVORK5CYII=`,``+import.meta.url).href},{font:`FONT57`,name:`LCOLON`,char:`colon`,sourcePtr:20546,widthBytes:2,height:7,width:4,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAHCAYAAAAvZezQAAAAIklEQVR4AZXBoQEAMAyAMOj/PzNTVbeEyyqW6vDNKpbqcDwNiQgH+qPEfAAAAABJRU5ErkJggg==`,``+import.meta.url).href},{font:`FONT57`,name:`LCUR`,char:`cursor`,sourcePtr:20562,widthBytes:3,height:8,width:6,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAICAYAAADaxo44AAAAF0lEQVR4AWMYWoDx/////xnQACMjIyMAWpEEApiDj/8AAAAASUVORK5CYII=`,``+import.meta.url).href},{font:`FONT57`,name:`LCNARW`,char:`center_arrow`,sourcePtr:20588,widthBytes:3,height:7,width:6,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAHCAYAAAArkDztAAAALklEQVR4AXXBwQnAMAwAsXP231ml0II/kfpBy1RBn5mZXlAFVdAGLaeL08Xp4gGNkBf0MQxS5wAAAABJRU5ErkJggg==`,``+import.meta.url).href},{font:`FONT35`,name:`S0`,char:`0`,sourcePtr:20611,widthBytes:2,height:5,width:4,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAFCAYAAABirU3bAAAAJElEQVR4AV3BsQEAMAyDMPD/P9MlUyWrOKoDUOWMz/gMoIrzAHapCAp8PbqhAAAAAElFTkSuQmCC`,``+import.meta.url).href},{font:`FONT35`,name:`S1`,char:`1`,sourcePtr:20623,widthBytes:2,height:5,width:4,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAFCAYAAABirU3bAAAAI0lEQVR4AV3BsQ0AMAgDsIT/f3ZViQk7H2QN5IKsyVHIatsHKj0P+ksF60EAAAAASUVORK5CYII=`,``+import.meta.url).href},{font:`FONT35`,name:`S2`,char:`2`,sourcePtr:20635,widthBytes:2,height:5,width:4,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAFCAYAAABirU3bAAAAJUlEQVR4AU3BwQnAMAADMR90/5WVTwqRgl1V+8G2fbAX7BHsqjqpLhP7f8hGugAAAABJRU5ErkJggg==`,``+import.meta.url).href},{font:`FONT35`,name:`S3`,char:`3`,sourcePtr:20647,widthBytes:2,height:5,width:4,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAFCAYAAABirU3bAAAAJklEQVR4AW3BsQnAMAAEsXvw/isrTQIuIg16bVsfqDrQH6g60OUBiXcT+k1QA4wAAAAASUVORK5CYII=`,``+import.meta.url).href},{font:`FONT35`,name:`S4`,char:`4`,sourcePtr:20659,widthBytes:2,height:5,width:4,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAFCAYAAABirU3bAAAAIElEQVR4AV3BsQ0AAAzDIJT/f3b3giqognkGVb4qmOcAgg4P9/tcZa8AAAAASUVORK5CYII=`,``+import.meta.url).href},{font:`FONT35`,name:`S5`,char:`5`,sourcePtr:20671,widthBytes:2,height:5,width:4,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAFCAYAAABirU3bAAAAJklEQVR4AU3BwQnAMAADMR90/5WVTwqRgl1Vgz2CXVX7wbZ9sMcBqVAT++msNm8AAAAASUVORK5CYII=`,``+import.meta.url).href},{font:`FONT35`,name:`S6`,char:`6`,sourcePtr:20683,widthBytes:2,height:5,width:4,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAFCAYAAABirU3bAAAAJklEQVR4AU3BsQEAMAyDMMj/P9PFQyWrGFWq+FjFqB6AKnMAVcwDPE4QA2ptOPAAAAAASUVORK5CYII=`,``+import.meta.url).href},{font:`FONT35`,name:`S7`,char:`7`,sourcePtr:20695,widthBytes:2,height:5,width:4,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAFCAYAAABirU3bAAAAIklEQVR4AV3BsQEAMAgDoKT//0wXXYRCRttmQRZkvBwvxwfhZgv+1Iag5AAAAABJRU5ErkJggg==`,``+import.meta.url).href},{font:`FONT35`,name:`S8`,char:`8`,sourcePtr:20707,widthBytes:2,height:5,width:4,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAFCAYAAABirU3bAAAAJUlEQVR4AS3BsQEAAAiDMPD/n3FpYhWjegCqzAFUMQegyhxAFfModAwKzXjWawAAAABJRU5ErkJggg==`,``+import.meta.url).href},{font:`FONT35`,name:`S9`,char:`9`,sourcePtr:20719,widthBytes:2,height:5,width:4,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAFCAYAAABirU3bAAAAJElEQVR4AV3BoQEAAAiAMPD/n7GY3KziqA6AKmcAqviqAIZnAVuODATKvdQ6AAAAAElFTkSuQmCC`,``+import.meta.url).href},{font:`FONT35`,name:`SSPC`,char:`space`,sourcePtr:20731,widthBytes:2,height:5,width:4,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAFCAYAAABirU3bAAAAC0lEQVR4AWOgBQAAAFUAAUfhT00AAAAASUVORK5CYII=`,``+import.meta.url).href},{font:`FONT35`,name:`SA`,char:`A`,sourcePtr:20743,widthBytes:2,height:5,width:4,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAFCAYAAABirU3bAAAAJUlEQVR4AV3BsQEAMAyDMPD/P9MlUyWrOKoDUOUMoIozAFXO+Dz+jwgOyDQpaQAAAABJRU5ErkJggg==`,``+import.meta.url).href},{font:`FONT35`,name:`SB`,char:`B`,sourcePtr:20755,widthBytes:2,height:5,width:4,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAFCAYAAABirU3bAAAAJUlEQVR4ATXBsQEAIADDIOr/P8dFYVWebTuwbb4eXxVUwYEqzwXDzRf260f4UQAAAABJRU5ErkJggg==`,``+import.meta.url).href},{font:`FONT35`,name:`SC`,char:`C`,sourcePtr:20767,widthBytes:2,height:5,width:4,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAFCAYAAABirU3bAAAAI0lEQVR4AV3BsQ0AMAjAsIT/f04XhgrbKpYqVXyGYzisYqk+ih0MA2AvweIAAAAASUVORK5CYII=`,``+import.meta.url).href},{font:`FONT35`,name:`SD`,char:`D`,sourcePtr:20779,widthBytes:2,height:5,width:4,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAFCAYAAABirU3bAAAAIElEQVR4AV3BsREAMAgAIc79d/40phG0fFVQBeMYV8t60GcX7fXgylsAAAAASUVORK5CYII=`,``+import.meta.url).href},{font:`FONT35`,name:`SE`,char:`E`,sourcePtr:20791,widthBytes:2,height:5,width:4,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAFCAYAAABirU3bAAAAJUlEQVR4AU3BwQ3AIAADsVz339l8qIQd7Koa7PFtG+wHewS7qg64uBP5+bg6xQAAAABJRU5ErkJggg==`,``+import.meta.url).href},{font:`FONT35`,name:`SF`,char:`F`,sourcePtr:20803,widthBytes:2,height:5,width:4,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAFCAYAAABirU3bAAAAJElEQVR4AV3BwQ2AMAADsUv339l8QKqwB722LehyqqAPdDn9PH75D/rgytZ/AAAAAElFTkSuQmCC`,``+import.meta.url).href},{font:`FONT35`,name:`SG`,char:`G`,sourcePtr:20815,widthBytes:2,height:5,width:4,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAFCAYAAABirU3bAAAAJUlEQVR4AV3BsRHAMAwAoZf235k0KnKGgc7MTNDPdqBqe2wVdD4boQ/8hKkHNwAAAABJRU5ErkJggg==`,``+import.meta.url).href},{font:`FONT35`,name:`SH`,char:`H`,sourcePtr:20827,widthBytes:2,height:5,width:4,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAFCAYAAABirU3bAAAAI0lEQVR4AV3BsQEAMAjAIPT/n9PFqaAKqmB9FqqchZkZZ30eJR4MAZ8VTeIAAAAASUVORK5CYII=`,``+import.meta.url).href},{font:`FONT35`,name:`SI`,char:`I`,sourcePtr:20839,widthBytes:2,height:5,width:4,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAFCAYAAABirU3bAAAAJElEQVR4AV3BsQ0AMAjAsIT/f05ViQnbKpYqXxVrOIbDKpbqA3otDAOGfnCJAAAAAElFTkSuQmCC`,``+import.meta.url).href},{font:`FONT35`,name:`SJ`,char:`J`,sourcePtr:20851,widthBytes:2,height:5,width:4,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAFCAYAAABirU3bAAAAIklEQVR4AV3BwQkAIAwAsdD9dz4/CtLEUwVjGctU+QxUuQ7R5gv97wIh9gAAAABJRU5ErkJggg==`,``+import.meta.url).href},{font:`FONT35`,name:`SK`,char:`K`,sourcePtr:20863,widthBytes:2,height:5,width:4,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAFCAYAAABirU3bAAAAIklEQVR4AV3BsREAMAgAIc79d36bpBFUQRWMq8dXBVUwjgXAdxft3lF9TAAAAABJRU5ErkJggg==`,``+import.meta.url).href},{font:`FONT35`,name:`SL`,char:`L`,sourcePtr:20875,widthBytes:2,height:5,width:4,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAFCAYAAABirU3bAAAAIklEQVR4AV3BsREAMBDCMMP+O/ubFDkkVPmUUUYZUeVJkgOELQgEjAAO+AAAAABJRU5ErkJggg==`,``+import.meta.url).href},{font:`FONT35`,name:`SM`,char:`M`,sourcePtr:20887,widthBytes:3,height:5,width:6,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAFCAYAAABmWJ3mAAAAKElEQVR4AXXBsQ3AMAzAMNH//+wuGYoAIe3udoGpgiromB6mA/qZHj7wFwQWxCiyFwAAAABJRU5ErkJggg==`,``+import.meta.url).href},{font:`FONT35`,name:`SN`,char:`N`,sourcePtr:20904,widthBytes:2,height:5,width:4,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAFCAYAAABirU3bAAAAIUlEQVR4AV3BsQEAAAjCsJb/f8bFicS25akGQJUXRhhhHEzTBA73j3TPAAAAAElFTkSuQmCC`,``+import.meta.url).href},{font:`FONT35`,name:`S0`,char:`O`,sourcePtr:20611,widthBytes:2,height:5,width:4,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAFCAYAAABirU3bAAAAJElEQVR4AV3BsQEAMAyDMPD/P9MlUyWrOKoDUOWMz/gMoIrzAHapCAp8PbqhAAAAAElFTkSuQmCC`,``+import.meta.url).href},{font:`FONT35`,name:`SP`,char:`P`,sourcePtr:20916,widthBytes:2,height:5,width:4,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAFCAYAAABirU3bAAAAJklEQVR4AV3BsQ0AIAzAsKT//xyWIiFsq1iqA6DKGoAqrioew+cAe24MBGxre1gAAAAASUVORK5CYII=`,``+import.meta.url).href},{font:`FONT35`,name:`SQ`,char:`Q`,sourcePtr:20928,widthBytes:2,height:5,width:4,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAFCAYAAABirU3bAAAAJElEQVR4AW3BsQ0AMAjAsIT/f04XpgrbKpbqAKiyhksVvyqAB9PlDAIKXr+OAAAAAElFTkSuQmCC`,``+import.meta.url).href},{font:`FONT35`,name:`SR`,char:`R`,sourcePtr:20940,widthBytes:2,height:5,width:4,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAFCAYAAABirU3bAAAAJUlEQVR4AV3BsQEAMAiAMPD/n+miSxOrWKoDoMppcaoAqgCGzwOZ9xP60UYKcAAAAABJRU5ErkJggg==`,``+import.meta.url).href},{font:`FONT35`,name:`S5`,char:`S`,sourcePtr:20671,widthBytes:2,height:5,width:4,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAFCAYAAABirU3bAAAAJklEQVR4AU3BwQnAMAADMR90/5WVTwqRgl1Vgz2CXVX7wbZ9sMcBqVAT++msNm8AAAAASUVORK5CYII=`,``+import.meta.url).href},{font:`FONT35`,name:`ST`,char:`T`,sourcePtr:20952,widthBytes:2,height:5,width:4,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAFCAYAAABirU3bAAAAIklEQVR4AV3BwQkAMBDDMCf77+xSuFekqHKShE+VU0YZZTxAbggEcmRi8wAAAABJRU5ErkJggg==`,``+import.meta.url).href},{font:`FONT35`,name:`SU`,char:`U`,sourcePtr:20964,widthBytes:2,height:5,width:4,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAFCAYAAABirU3bAAAAIUlEQVR4AV3BsQ0AMBDEIHT77+w0qR5UQRXMMcccgyrfA50pC/0OmgPkAAAAAElFTkSuQmCC`,``+import.meta.url).href},{font:`FONT35`,name:`SV`,char:`V`,sourcePtr:20976,widthBytes:2,height:5,width:4,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAFCAYAAABirU3bAAAAIUlEQVR4AW3BsQ0AMAjAMIv/fw5LJ1RbFVTBOMZPlWccC+ChC/ttGwJjAAAAAElFTkSuQmCC`,``+import.meta.url).href},{font:`FONT35`,name:`SW`,char:`W`,sourcePtr:21064,widthBytes:3,height:5,width:6,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAFCAYAAABmWJ3mAAAAKElEQVR4AXXBsQ3AMAzAMNn//8wuHYIAIYMOULU9bD/osD0MdJmZ+QDtrg/8lBdpdgAAAABJRU5ErkJggg==`,``+import.meta.url).href},{font:`FONT35`,name:`SX`,char:`X`,sourcePtr:21081,widthBytes:2,height:5,width:4,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAFCAYAAABirU3bAAAAI0lEQVR4AW3BsQ0AMAjAMIv/f06nLghbFVTBuFT5qqAKxvIA/yoT8TwCmvYAAAAASUVORK5CYII=`,``+import.meta.url).href},{font:`FONT35`,name:`SY`,char:`Y`,sourcePtr:21093,widthBytes:2,height:5,width:4,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAFCAYAAABirU3bAAAAIklEQVR4AV3BsQ0AMAjAMIv/fw5LhwpbFVTBOAaq/Ko841iR/g/3vRBLngAAAABJRU5ErkJggg==`,``+import.meta.url).href},{font:`FONT35`,name:`SZ`,char:`Z`,sourcePtr:21105,widthBytes:2,height:5,width:4,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAFCAYAAABirU3bAAAAI0lEQVR4AU3BsQ3AQBAEoZ3+i8bJn2QI9lTtwA7swH6CPVUfmHIT953WbxQAAAAASUVORK5CYII=`,``+import.meta.url).href},{font:`FONT35`,name:`SBARW`,char:`back_arrow`,sourcePtr:21117,widthBytes:2,height:5,width:4,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAFCAYAAABirU3bAAAAJElEQVR4AV3BwQ3AMAADofP+Q1NVSj6BLuiCjkHHtvWDXlD1AWfdE/KPqn/fAAAAAElFTkSuQmCC`,``+import.meta.url).href},{font:`FONT35`,name:`SEQU`,char:`equals`,sourcePtr:21129,widthBytes:2,height:4,width:4,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAHklEQVR4AV3BsQEAMAzDIPP/0eqSqbCfqh3YT9UOPPwoCAOPKD1PAAAAAElFTkSuQmCC`,``+import.meta.url).href},{font:`FONT35`,name:`SDSH`,char:`dash`,sourcePtr:21139,widthBytes:2,height:3,width:4,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAYAAAC09K7GAAAAFklEQVR4AWMgCBj/////nwEKGBkZGQE6FAQC/WL3qgAAAABJRU5ErkJggg==`,``+import.meta.url).href},{font:`FONT35`,name:`SQUE`,char:`question`,sourcePtr:21147,widthBytes:2,height:5,width:4,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAFCAYAAABirU3bAAAAIklEQVR4AX3BsQHAIAAEoXv335k02gYGXdvWA1WnCvoFXR8LSw/4QdGk5wAAAABJRU5ErkJggg==`,``+import.meta.url).href},{font:`FONT35`,name:`SEXC`,char:`exclamation`,sourcePtr:21159,widthBytes:1,height:5,width:2,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAAFCAYAAABvsz2cAAAAHElEQVR4AWXBsQ0AAAjAIOL/P9fFTVAF44ynChbD5wf96Di4xAAAAABJRU5ErkJggg==`,``+import.meta.url).href},{font:`FONT35`,name:`SBRKL`,char:`left_paren`,sourcePtr:21166,widthBytes:2,height:5,width:4,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAFCAYAAABirU3bAAAAHklEQVR4AV3BsQEAAAjDoPz/NE5dhAYaaKAP+qDqAGcYE+2U+wKUAAAAAElFTkSuQmCC`,``+import.meta.url).href},{font:`FONT35`,name:`SBRKR`,char:`right_paren`,sourcePtr:21178,widthBytes:2,height:5,width:4,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAFCAYAAABirU3bAAAAHklEQVR4AV3BwQkAAAgAodt/aXsFkQZ90ActaEHHAIb4E+3Z3o3MAAAAAElFTkSuQmCC`,``+import.meta.url).href},{font:`FONT35`,name:`SSQOT`,char:`apostrophe`,sourcePtr:21190,widthBytes:1,height:2,width:2,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAFUlEQVR4AWP4////fwYGBgYmBigAAD3mA/+YDucOAAAAAElFTkSuQmCC`,``+import.meta.url).href},{font:`FONT35`,name:`SCMMA`,char:`comma`,sourcePtr:21194,widthBytes:1,height:5,width:2,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAAFCAYAAABvsz2cAAAAFklEQVR4AWPAA/7///+fgYGBgYkBCgA+AQP/oczrgQAAAABJRU5ErkJggg==`,``+import.meta.url).href},{font:`FONT35`,name:`SPER`,char:`period`,sourcePtr:21201,widthBytes:1,height:5,width:2,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAAFCAYAAABvsz2cAAAAE0lEQVR4AWMgBvz///8/AwMDAwAaEwP9A2b94AAAAABJRU5ErkJggg==`,``+import.meta.url).href},{font:`FONT35`,name:`S000`,char:`000`,sourcePtr:21208,widthBytes:6,height:5,width:12,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAFCAYAAABxeg0vAAAAM0lEQVR4AZXBoQEAMAyAMOj/PzNTUbvEKpZqFUu1iqU6AKocqhyqrOHT8GkAqjiqOKpYD+i3GAosOUVbAAAAAElFTkSuQmCC`,``+import.meta.url).href},{font:`FONT35`,name:`SARRW`,char:`arrow`,sourcePtr:21240,widthBytes:3,height:5,width:6,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAFCAYAAABmWJ3mAAAAJUlEQVR4AXXBQQoAIAwDsPb/j44XhTEwyQP5gVyFLG2bCbJBhgMG2xPyccO1mAAAAABJRU5ErkJggg==`,``+import.meta.url).href}],lm=[{group:`TRANS1`,name:`TRANS1`,collisionPtr:2560,offsetWord:13649,sourcePtr:3503,dmaControl:2567,widthBytes:14,height:3,width:28,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAADCAYAAACAjW/aAAAALklEQVR4Ab3BQQEAMAgDsatJZFRMZWCSffaYgZEo6WGRAJIeFtgl8Uh6+MAucR3D6QrRwElKSwAAAABJRU5ErkJggg==`,``+import.meta.url).href},{group:`TRANS2`,name:`TRANS2`,collisionPtr:2560,offsetWord:28801,sourcePtr:3503,dmaControl:2567,widthBytes:14,height:3,width:28,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAADCAYAAACAjW/aAAAALklEQVR4Ab3BQQEAMAgDsatJZFRMZWCSffaYgZEo6WGRAJIeFtgl8Uh6+MAucR3D6QrRwElKSwAAAABJRU5ErkJggg==`,``+import.meta.url).href},{group:`TRANS3`,name:`TRANS3`,collisionPtr:2560,offsetWord:2186,sourcePtr:3503,dmaControl:2567,widthBytes:14,height:3,width:28,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAADCAYAAACAjW/aAAAALklEQVR4Ab3BQQEAMAgDsatJZFRMZWCSffaYgZEo6WGRAJIeFtgl8Uh6+MAucR3D6QrRwElKSwAAAABJRU5ErkJggg==`,``+import.meta.url).href},{group:`TRANS4`,name:`TRANS4`,collisionPtr:2560,offsetWord:15571,sourcePtr:3503,dmaControl:2567,widthBytes:14,height:3,width:28,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAADCAYAAACAjW/aAAAALklEQVR4Ab3BQQEAMAgDsatJZFRMZWCSffaYgZEo6WGRAJIeFtgl8Uh6+MAucR3D6QrRwElKSwAAAABJRU5ErkJggg==`,``+import.meta.url).href},{group:`OSTRICH`,name:`OSTRICH_00_ORUNSR_x0_ym17`,collisionPtr:3913,offsetWord:239,sourcePtr:7586,dmaControl:3094,widthBytes:8,height:18,width:16,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAASCAYAAABSO15qAAABOElEQVR4AZXBwW3jMBBA0T9yOkgLcjHUfXRKC2QNYgtSF+ad08MWoItZQ1qYgAt7IRjGxn5PeEMY8XDmr2QIwIk3tG+yrb7Uz52l7kvO5IE3eZvpRBCAD960WeFo4C5cnOrOC2JQ7ga6cHGvClthDOqEi1PdecEHNzIViErbgKh07u4AYlBtpmutcDTQ2SwjBQ9AVJhEOPAAU1O6GJQj4ai6sxW6kULXUIhK522m26yQDAEQHoWLE5XOA4jxj7eZzQrJEG4GHowUOg/ANuNt5u5skAzhQHhiDOqJQgxKt1mhS4bwYOCJZkWSIRzYlacG/kNSEW5qUp4Z+MW0FmJQNiv4qs6DE79o3+RP9iUGZbNCTbpk2zM3J15gjfznui/rlzKtheuiS7Y9Awy8yBoCUJMyrQVf1QF+ABicip95CL09AAAAAElFTkSuQmCC`,``+import.meta.url).href},{group:`OSTRICH`,name:`OSTRICH_01_ORUNSL_xp1_ym17`,collisionPtr:4373,offsetWord:495,sourcePtr:8618,dmaControl:3094,widthBytes:8,height:18,width:16,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAASCAYAAABSO15qAAABNElEQVR4AZ3BwXHbQAxA0Y+1KnBaoE7KXTWAd6iLZVqwWlh2wb0TPaQAX7wtuAZkyKE9skaT0HlP2BQlAPwNvCHslAAiiKzGkANvCN+QAEQQgGgXvuvAZvTK/0hsshq7zBHoFGwSe8wR6BSdWjBWYjbQKQAO3JmzBUCvE6GsxIFstBHIhvSVD4kbWY1F34xQvupFyEYodFTwiwAIm6JEVmMh3cRqrHRUFg1jlQ16ETZPbLxx/cHry/l44vpsrM4n3l+MX88G5xP8foXrT+FG4sbgyNH5FO0C44VQVh2Ve8IDRQmArMZi9ErBaF6FOwce8DfQI58GR6DySOKBeTA+yFCFv0jciWIxeiWr0ZfKvyRuRLEYvZLVGL3iDWGvKBbaEVEstCPYKQFEsehLZR6MhTeEnf4AE8d82bIwvKQAAAAASUVORK5CYII=`,``+import.meta.url).href},{group:`OSTRICH`,name:`OSTRICH_02_ORUN4R_x0_ym19`,collisionPtr:4289,offsetWord:237,sourcePtr:7424,dmaControl:3088,widthBytes:8,height:20,width:16,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAUCAYAAACEYr13AAABNUlEQVR4AaXBwbXTMBBA0Sd9KoAW5BqoYdjLXcg12C1IXVj7TA8pwJuohrQwHOd7oRMSwHDvBydkwS5TnL+xzdpYADwnJIm4sJIkYoZxVhbMcjQ6nhP0xv/LglmOxsGzk9W4mPEPvrBLERNwFzNKhRQJZaTXtDpecByCRGtESJFQRlpaMeHBKVAqmZEkkaKVSXEAHxzubVvCwHy/wlc27svolu/zvDQ+XTeEyrVtTIrj4HgSJFpLK5RKoNLSSigju0YEHR0dzwuhjOwmKpRKI/Kgo+OJ40kWjIPeQAYeJsXxgqcjAUsSSRKZFKcNlyTyO56ODDz8yJVdFgxgUhxveDpJIjttOP6Sp1O0cpanMymOzqQ4AAkYb3g6EjCeFK3IwFuejgz8Qm+QJPKO5w+04QAsR+OFnxGJfTLC4ihXAAAAAElFTkSuQmCC`,``+import.meta.url).href},{group:`OSTRICH`,name:`OSTRICH_03_ORUN4L_xp1_ym19`,collisionPtr:4709,offsetWord:493,sourcePtr:8456,dmaControl:3088,widthBytes:8,height:20,width:16,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAUCAYAAACEYr13AAABM0lEQVR4AZ3BwXHbMBBA0b9wKohbAE8uIDWs78suwBqkFoAuiLu3hxTgi1BDWliPMpoMLZuOpfceuKhKvCx2eOT14IMj35QAIoiihuSVosbdolpUJbhB4oqfuE9Ui6oEN0rc4yUCXQPgBzuyWrAxygqtQzFCQTBwEC6qEkWN5p2FFYoRyl/ikNvMKCu0TqYzvAvAAxc+OD7yegBwDH49cRxwHMCzyM/p6fDnN2Q6w7twIVzTNTKds1FWcpsZGBQjt5nhXdhIXPNZAAYGrbPQOctt5jPCjqoEgJ9AJ/5ZHGEj8YWihg9kcaSoUdTQTLCR2LE4AlCVAHiunTOdeCfxTT4QgKLGVuJGzTtbiR2aCYDFETYWR9hI7NAJmneuaSbYSOwoaviJD3TincQnoloA+ED4jzcFyHgu9hAuOwAAAABJRU5ErkJggg==`,``+import.meta.url).href},{group:`OSTRICH`,name:`OSTRICH_04_ORUN1R_x0_ym19`,collisionPtr:3997,offsetWord:237,sourcePtr:6938,dmaControl:3088,widthBytes:8,height:20,width:16,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAUCAYAAACEYr13AAABTklEQVR4AaXBwZGbQBBA0T9oI1ilACcFQAy99+HiGIYYIAUmC+ZO56AAuGhiIIV2sZa3KBWsjf3ehRMGwabWd1fmTjM9QMEJQTyuHAniMcM4axDMBm9sFJygDz5JifFUcIJmXNTE1Hp+K1jJaExm/IM3VsFjAm4yIyYInjI2bGVNjh2Op1K8ZTwETxkbchgxAaf8EhMDDUE8H0NCMw7gwtOS576s6JY7vDOz9I3r664jJqhvUN+YrjNRE/GO48nxSkYjeIiJkkQOI19iAm0cG2+8KEkQExlPS6KNiVVJImtyvHC8GATjSR8gFZ9axbGjYMMGb0E8q1ZxmnFBPN8p2PgYEqsgntUgGECrOA44dgyCBfGsoiZaxXHgwg7N9PfH3P2ob9TVjftj7vJCz46CP4iakIpDBX+hVRwHCv7ThQPVO92yzATxXJk7zfTs+Annooo02okoeQAAAABJRU5ErkJggg==`,``+import.meta.url).href},{group:`OSTRICH`,name:`OSTRICH_05_ORUN1L_xp1_ym19`,collisionPtr:4457,offsetWord:493,sourcePtr:8010,dmaControl:3088,widthBytes:8,height:20,width:16,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAUCAYAAACEYr13AAABPklEQVR4AaXBwXHbMBBA0Q/KFcgtQCdXsrqvugBrIFsAuiDu2h5UAC9GDWxhM/IwGY4mVCznvQOrLPi11+GdebDGyDd1AO54EiXEiSTKj3lWz4Lzgo6VRBzAPnlJx+raK8Uq1gi8oOMnru7I5ABv7IiizkZLE5QKSXGBgIJBYCURv/ZKsUrPBEm5c4FgEMuFliYolUilWQ0AB1ZtYXxnHpIoowx8KZXx+AHnEI6nj2G5QaTSrAZWgUcyOUn5LZYLDYWkUCrYJbBx4FGrY1zmYbkBt5mBEUOJt5EjM0ubRzYCO7LgAPYJcuKP3ghsdDyRRLFG6I0AkETxrM5Gx47eCABZcIAkyt05V7YCT2TBkyh3xSq9EXjwxg6JeBLl7pwr1gj8RccOOUGxyr907OiNwDd0/KeOHVnwJEqxyjO/AER8gkwniJiPAAAAAElFTkSuQmCC`,``+import.meta.url).href},{group:`OSTRICH`,name:`OSTRICH_06_ORUN2R_x0_ym19`,collisionPtr:4121,offsetWord:237,sourcePtr:7100,dmaControl:3088,widthBytes:8,height:20,width:16,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAUCAYAAACEYr13AAABUUlEQVR4AZXBwXnaQBCA0X+EKzAtiBMFkBbG9+GUFlY1iBZ2u2Dvmh5SgC5WDbQw+TA6KIrwh9/b8aKsxNBZv2fsfeLCrOFFSQ1pryQ1Igh+KisR2YKVhhd1jgBkJVho+IHilaTG//QaDBG8ICsR2YLZG3fJCAUZIigVktGWM0uTV2GDMGvVYsIgGW05M6UroSDOQ6lkziQ1ilc6RwB2zG7TeGkP9Lc/8M7I7XKWy6nvKRVORzgdGfYjxSudI8yENb0GyaBU7mIw7sR5+BBh4Y2VlspUeEiGOA+l0lKZ+JewoVWLjspSxpi8CivCNyJbABSvdI6woeGJrARA8Yp/8lTDBm0JZkkNPfDUjg2Hd/r82yhe+VVGGTrrez32e8beJy4sNGzQA186RwCkq/KRK0mNtYYX+YQUr2QlWGj4RlaChc4RVho2+CdfkhprnSMs/AWtH4sWzoyd9gAAAABJRU5ErkJggg==`,``+import.meta.url).href},{group:`OSTRICH`,name:`OSTRICH_07_ORUN2L_xp2_ym19`,collisionPtr:4541,offsetWord:749,sourcePtr:8172,dmaControl:784,widthBytes:7,height:20,width:14,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAUCAYAAAC9BQwsAAABS0lEQVR4AZXBwXGjQBBA0d/IEUgpoBMBOIbWvZ3FTAyQwpAFc9fkoAC4eGIghd6SCldRWnYLv3cCSIrfo/UX5r5UBg5o3PGghrQTQY1f82SeFOegBiApDhALwkENQFBjLJlf8WSeFOeIuzs6OcAHb1o1Z6OGCcYMwXAFwaCAJMWDGmPJRCYIxpMrSIF2/KKGCcZMS6aWLACnUhkuzH1QY9CelzEznDu4iZyvXb88oCVTSxZWwo+7O4ArL3LLvASDMUP5EjZOrNpl7pcHDOeOoQKfHTxmeMy0ZJY6D2wIG62aRzJbCaOWLLwR3iTFgxpPErPwDyf+1i/LzOe148Lcl8rAjoY3eoWgxg9tcXZ8sEqKBzWeJGZJigc1yndmT8MqqHFLGYlZAGJBAPTKrgYgKT6WTKkIBzWsYkHYSIrzHw1ALAhvghpP5ZtdfwBVr4u7iaLXcQAAAABJRU5ErkJggg==`,``+import.meta.url).href},{group:`OSTRICH`,name:`OSTRICH_08_ORUN3R_x0_ym19`,collisionPtr:4205,offsetWord:237,sourcePtr:7262,dmaControl:3088,widthBytes:8,height:20,width:16,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAUCAYAAACEYr13AAABaklEQVR4AZXBwXHbMBBA0Q9KFdgtkCcVoBrW93UXYFogWwBq8EW4a3vQPboINbCF9VBhPApDz8jv7XhSEvzc6/DKdbDKyKLhSVGU0J6Iorjj/FQS3JM6Kw1P6o0AkATnQcMPZCtEUf4nJ+fszhOS4J7UWeyZRcUFwtmdXCAqbX6nxhOzNr9TrQQ27Jh9jOPH5TpMFyAqvIUwpd+DC4wVpqPCdBhSV4YoSraCVUaAHYupXse2Y5gu0HYML5fCrxeFXOB4gOOB8+uVbIXeCCwCa3JyojJz4S4Yf+QC9h54sGelpVAztBQCJ77kQkuh8q/AhlbUewqPEkq1Elhp2FCthCjKLIoSReluhS0NG5LgLN5SYWaVwIaGDVGUbIXeCCyS4GxoWJEW54FVQrZCFCUJzkrDinTc2Y0vvRGyFaIo0uI8aPiGVQIPeiNkK5x7RVqcxZ6VKEq2wha7ARSkA6vcNWyIonzHbhBF+esTAcmcTaHA2wcAAAAASUVORK5CYII=`,``+import.meta.url).href},{group:`OSTRICH`,name:`OSTRICH_09_ORUN3L_xp2_ym19`,collisionPtr:4625,offsetWord:749,sourcePtr:8314,dmaControl:784,widthBytes:7,height:20,width:14,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAUCAYAAAC9BQwsAAABVklEQVR4AZXBwXHbMBBA0Q/IFUgtQCdXsr4vuwDTAtkCUIMvxF3bQwrQRahBLWxGijzDKPSM/N4OoAh+GnU6cJ6sM/OC6I5nUUJayKL8mBf1IjgvigBFcIDRCLwoAmRRqjV+xIt6EZxXnNyRxQHeeJJEveeFm1QHel6gNsiKCwQUDHYHzlMW5cB5suMyXfPEjQv82it8hEBZJmrj83PmOg8BYGed+cB5yqLMMnFXG/P+nVQH9sf36fobEo1uLfAQ+CKLk5UbF+6C8VdtYENg5Y2HRKNXICvBuEt1oKMkGp1/BVaSqI801gpKtxZ4Elk5XhpZlCzKTRalWwtsiKxYJwB8lMaXIjgbIitFcB5GI1RrZFG2RB6K4FmUag3rBFYk4TyJAJLwLEq1xmgEHuzCnRz5T5SEn0alWmM0AivWCXwjyhGqNezCpmqNLMqzmEWxC9/Komz5A0YEk/1WzZDQAAAAAElFTkSuQmCC`,``+import.meta.url).href},{group:`OSTRICH`,name:`OSTRICH_10_ORUN4R_x0_ym19`,collisionPtr:4289,offsetWord:237,sourcePtr:7424,dmaControl:3088,widthBytes:8,height:20,width:16,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAUCAYAAACEYr13AAABNUlEQVR4AaXBwbXTMBBA0Sd9KoAW5BqoYdjLXcg12C1IXVj7TA8pwJuohrQwHOd7oRMSwHDvBydkwS5TnL+xzdpYADwnJIm4sJIkYoZxVhbMcjQ6nhP0xv/LglmOxsGzk9W4mPEPvrBLERNwFzNKhRQJZaTXtDpecByCRGtESJFQRlpaMeHBKVAqmZEkkaKVSXEAHxzubVvCwHy/wlc27svolu/zvDQ+XTeEyrVtTIrj4HgSJFpLK5RKoNLSSigju0YEHR0dzwuhjOwmKpRKI/Kgo+OJ40kWjIPeQAYeJsXxgqcjAUsSSRKZFKcNlyTyO56ODDz8yJVdFgxgUhxveDpJIjttOP6Sp1O0cpanMymOzqQ4AAkYb3g6EjCeFK3IwFuejgz8Qm+QJPKO5w+04QAsR+OFnxGJfTLC4ihXAAAAAElFTkSuQmCC`,``+import.meta.url).href},{group:`OSTRICH`,name:`OSTRICH_11_ORUN4L_xp1_ym19`,collisionPtr:4709,offsetWord:493,sourcePtr:8456,dmaControl:3088,widthBytes:8,height:20,width:16,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAUCAYAAACEYr13AAABM0lEQVR4AZ3BwXHbMBBA0b9wKohbAE8uIDWs78suwBqkFoAuiLu3hxTgi1BDWliPMpoMLZuOpfceuKhKvCx2eOT14IMj35QAIoiihuSVosbdolpUJbhB4oqfuE9Ui6oEN0rc4yUCXQPgBzuyWrAxygqtQzFCQTBwEC6qEkWN5p2FFYoRyl/ikNvMKCu0TqYzvAvAAxc+OD7yegBwDH49cRxwHMCzyM/p6fDnN2Q6w7twIVzTNTKds1FWcpsZGBQjt5nhXdhIXPNZAAYGrbPQOctt5jPCjqoEgJ9AJ/5ZHGEj8YWihg9kcaSoUdTQTLCR2LE4AlCVAHiunTOdeCfxTT4QgKLGVuJGzTtbiR2aCYDFETYWR9hI7NAJmneuaSbYSOwoaviJD3TincQnoloA+ED4jzcFyHgu9hAuOwAAAABJRU5ErkJggg==`,``+import.meta.url).href},{group:`OSTRICH`,name:`OSTRICH_12_OFLY1R_x0_ym19`,collisionPtr:3793,offsetWord:237,sourcePtr:7732,dmaControl:3337,widthBytes:9,height:13,width:18,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAANCAYAAACkTj4ZAAAA+UlEQVR4Aa3BsXGDQBBA0b9IFdgt3EUUQA3r/IjcAnILqAWowQmXa3twAUqgBbmF9aDRyDKDE0bv7digU/x0SO0r59YmjgAFGzSakDDQaMIdZyvvkneK86DgSQo2spE/9twETT6RoEnc9ZlZIDNZFgANOCt2zHTwF85cTi1thONHhqqEqoSq5PsLiKlVcqsRqljy/nkWHhTMrBaA+FYjIkKTcOVXk5hphEYTvWWWCm4myzKRCJrcFcQg9DUzV+56yxwMYUFYCJocYLIsQZOPpwExoM9cWS2sEBY04AAWB5Z0rLEJYcWeFRpBqZnZyJVGMJ5AA94pzj9+ANR/WRxxmKgsAAAAAElFTkSuQmCC`,``+import.meta.url).href},{group:`OSTRICH`,name:`OSTRICH_13_OFLY1L_x0_ym19`,collisionPtr:3853,offsetWord:237,sourcePtr:8764,dmaControl:3337,widthBytes:9,height:13,width:18,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAANCAYAAACkTj4ZAAABEUlEQVR4Aa3BwVHDMBBA0a84FSQt2FxUQGpQAfKFGgwtrFqwa/DFvrM9pABdrBrUghhCYDwhyQyB9yrOekd5e/GyJ4omAr+0ASiF0jmPqSc65/mz3lFK7wsP2PBPNqzowsO2XOFqiiYMQO18SXhOOs+3YaZmJulsACpWUiaIs5JzBJB0mCRjofNwsJwMM0Us8mwZxpnciJDmUHFhT5TOeXKOKB46z5fiIOws4cmY8RgFIGswABUXNBH2RAFQPEUsIUE9tLzuPMXBeIyS8GQNhrOKKzQRtJkEIOwsxcEwzuTQmvEYBSBrMKwYbnA1RZuJS25p+aAJw8qWO3padOHENXxqQBd+2HKDa0AX0IQB0MRd77gFcd/MVSgyAAAAAElFTkSuQmCC`,``+import.meta.url).href},{group:`OSTRICH`,name:`OSTRICH_14_OFLY1R_x0_ym19`,collisionPtr:3793,offsetWord:237,sourcePtr:7732,dmaControl:3337,widthBytes:9,height:13,width:18,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAANCAYAAACkTj4ZAAAA+UlEQVR4Aa3BsXGDQBBA0b9IFdgt3EUUQA3r/IjcAnILqAWowQmXa3twAUqgBbmF9aDRyDKDE0bv7digU/x0SO0r59YmjgAFGzSakDDQaMIdZyvvkneK86DgSQo2spE/9twETT6RoEnc9ZlZIDNZFgANOCt2zHTwF85cTi1thONHhqqEqoSq5PsLiKlVcqsRqljy/nkWHhTMrBaA+FYjIkKTcOVXk5hphEYTvWWWCm4myzKRCJrcFcQg9DUzV+56yxwMYUFYCJocYLIsQZOPpwExoM9cWS2sEBY04AAWB5Z0rLEJYcWeFRpBqZnZyJVGMJ5AA94pzj9+ANR/WRxxmKgsAAAAAElFTkSuQmCC`,``+import.meta.url).href},{group:`OSTRICH`,name:`OSTRICH_15_OFLY1L_x0_ym19`,collisionPtr:3853,offsetWord:237,sourcePtr:8764,dmaControl:3337,widthBytes:9,height:13,width:18,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAANCAYAAACkTj4ZAAABEUlEQVR4Aa3BwVHDMBBA0a84FSQt2FxUQGpQAfKFGgwtrFqwa/DFvrM9pABdrBrUghhCYDwhyQyB9yrOekd5e/GyJ4omAr+0ASiF0jmPqSc65/mz3lFK7wsP2PBPNqzowsO2XOFqiiYMQO18SXhOOs+3YaZmJulsACpWUiaIs5JzBJB0mCRjofNwsJwMM0Us8mwZxpnciJDmUHFhT5TOeXKOKB46z5fiIOws4cmY8RgFIGswABUXNBH2RAFQPEUsIUE9tLzuPMXBeIyS8GQNhrOKKzQRtJkEIOwsxcEwzuTQmvEYBSBrMKwYbnA1RZuJS25p+aAJw8qWO3padOHENXxqQBd+2HKDa0AX0IQB0MRd77gFcd/MVSgyAAAAAElFTkSuQmCC`,``+import.meta.url).href},{group:`OSTRICH`,name:`OSTRICH_16_OFLY3R_x0_ym19`,collisionPtr:3793,offsetWord:237,sourcePtr:7891,dmaControl:3337,widthBytes:9,height:13,width:18,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAANCAYAAACkTj4ZAAABHElEQVR4Aa3BsXGDMBSA4V+2J7BXgIoBMsNLLxrPYLKCWAFWSBrUSzt4ABo0Ayu8nBL7wnE4l+TyfXuyoMpcuaLEzWls+UYnaGisOzG6mGi52QPoq3PuXPFytHB2jrlyJN+yITTWmWIgnEZcGF3b0gIY7oIqd72HWBs2aGe1j54mYljYcaMCKvzZjhuTRT5dLMig/MKOBRVQ4UtQ5YcMa0GVtd5DrE0n6KWAPkETMSwcyGTQTqApLEVfk6I3BNUuebLmYoFBL+LJYvSs7clK66bkma8wU1GUuOPV81RWZNNby0yFK0eeO09MGFYMazIoNwWeLGHJOmqaiGHDgRWZarJYDiQsS3HioQMbpAShJosTH6SEyD+QAu0E5YF3VKd3fLMx2L4AAAAASUVORK5CYII=`,``+import.meta.url).href},{group:`OSTRICH`,name:`OSTRICH_17_OFLY3L_x0_ym19`,collisionPtr:3853,offsetWord:237,sourcePtr:8883,dmaControl:3337,widthBytes:9,height:13,width:18,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAANCAYAAACkTj4ZAAABG0lEQVR4AZ3BvXGDQBCA0W8tKlANEFEANSz5kagGqOFoAdXgBHJfD8pNwtVAC+sBYY9+LI3s94QLnWK1Oo5hoAkIT6TqLOKgdlCKJGzMMI4OSXtMK5ow8CvtjdoRAVNWAiRsRBAY6FQMdbxCAlCKACT8kykr4SzhL7Q3asdCAlCKsHnjVR9mbEzBlCvCjU6xOoVjhCYgaG/UjjulCBd23POH0lFkOS3eUzu6OKDzSNjnUIqk8+jn7tN3Re4DzhOHdseNONOeptEfipw25qSnliLLWUzvLfss9xEHp5EpDszkEIdWeKBTrKFnkTKwiDh+hEq4kPBAmICMVcTxTaeKReBawhMdFWFipRlnGYSJOwkPaAZhghARgBB56gsl6WsZQ6FXNQAAAABJRU5ErkJggg==`,``+import.meta.url).href},{group:`BUZARD`,name:`BUZARD_00_BRUNSR_x0_ym12`,collisionPtr:9226,offsetWord:244,sourcePtr:10074,dmaControl:3337,widthBytes:9,height:13,width:18,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAANCAYAAACkTj4ZAAABSklEQVR4AY3BwW3jMBBA0U87FWRbGJ1SgGuY3MddiDWILVAtJBfz7ulhC9DFU4Na4EKGFxCMBMl7iR1RelTjroIEhLfEQ6/WAWZvZCexc+C/0XpUgwpUkGhAQ5TO3tgYr9A7nZ0DDxINhpbYzC2BAQYYonSA2RvMRkokniS+IEoHYxMCvV6Y50bO51SVDpCdxM6RB1H668D0OjBxtxDyxuZzPvNRL/z9LNPwB0Y1ii+FnQOb0XqIEU5ipw7G5nbtbK7ZGNWYvfHsBUACQkCUDhBibLI2xBvz3Ljzht/Ag8STxBNR6yHc1Wjc6QX8THYS30h8Q4WuA4xqbN5rQwfITuILiR+o0HWAUY332tABspN4cuQHsVI8KJO+Teu64DfIJyYPCjtHfqn4Uq7ZpnVd8BvkE5MHhYcjv6RCX9cFv8E1G8UX8onJgwLwD5uxkdW/PAwWAAAAAElFTkSuQmCC`,``+import.meta.url).href},{group:`BUZARD`,name:`BUZARD_01_BRUNSL_xp1_ym12`,collisionPtr:9394,offsetWord:500,sourcePtr:10870,dmaControl:3081,widthBytes:8,height:13,width:16,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAANCAYAAACgu+4kAAABRklEQVR4AY3BwW0bMRBA0T9SKlAN3NMW4Bomd/qSGpY1aFvg1pCLedfUkC2AF7IGtsCABgMIhhHoPWGKSt/UM0hIwuTU9+qAwCcXEtUQpitA7/S3X8BbhnNlt7wDOKVD5tYyrazwB9p9BdY7Z94BLkwiCIfnsMTglA4e8ICHIwnDksTVxD/CFJUOEAyJ8aNvm0fCO64yJaohfHFh2tQzqKNvm2f5KQzVASQGp3SndKd0pgvTYYlNPY/gGcqjM8TF86waUp2HzXeAK5NV9rPke2uZs62cZ6acO78DtLLSbiu3lrkt3NttxVVoNe/CN6LS0Q+wd4bgPIOrUC0JT4QvotKtwCN4hsMSVsAqwjeEJ1HpVuARPIclrIBVhP/4wRSVbgV04VMwhBcIQFS6FdAFNvVISMKLrlHpVuARPLtlWssA99rYecFf3PGV7VVk39wAAAAASUVORK5CYII=`,``+import.meta.url).href},{group:`BUZARD`,name:`BUZARD_02_BRUN4R_x0_ym13`,collisionPtr:9310,offsetWord:243,sourcePtr:9946,dmaControl:3338,widthBytes:9,height:14,width:18,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAOCAYAAAAi2ky3AAABQ0lEQVR4AZ3BwXHUQBBA0d+LI7BTGJ02AGLovTcXYpiJQZvCKAv6vh0DAXDSxOAUmpJYu1QuwOD3hN8oSo5ilMFuhAsH2S0BlnBaIACfeKOo5ShnNs+P8PwI+f3H/PR0niP8CjDreaY6n7/CPDNfr1xPHBS1BOet6SLUamQlAS7dYTFEEO5O3BW1BGcEwl2fjDKc9ZbsJmOjE69EEIATr5wRSFGyDGfT1NlMF+FFdsuqxhLOkbCplmU4R6MYZTibpt/YxReqGks4LRAOhIOi5CjGpg8nVtCJXQuEvzixqZZUSwANJyd2OkFVI1be9QBQhrOZVrg1YwknVrg1YwknBsI7HgBGIABrt1zCaYHwS8bKPzlxIM2lqvFiCefWjA/JbpndkoPslvyP7JbcZbcE0EJmt8xuqYXko7qSANkts1vyBz8BPuCXMrcm6AgAAAAASUVORK5CYII=`,``+import.meta.url).href},{group:`BUZARD`,name:`BUZARD_03_BRUN4L_x0_ym13`,collisionPtr:9478,offsetWord:243,sourcePtr:10742,dmaControl:3338,widthBytes:9,height:14,width:18,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAOCAYAAAAi2ky3AAABXElEQVR4AZXBsZHbMBBA0b+nq4BqAYhYgGqA8nV0LZA1gC1ANVxi5IJbOBWARKgBLewNbWqGYweS3xM2KWBTUFYyZ2HHBTWA5sC1TCsIf3kHMMP4LcNFeUjpp02TIvMPHppTXMBaycLOGxsRhItyTpmVTdg0Kf4s/Cvjgho7bwAiCJvg+cMrq/vVcC2TvPLQCgIZF9TYHNg5UuMUlBjGyOqk+LOw+pyBL3AtM3hiK8jga+yNBeDATmksR2o8+ZFLydz6yMkrXy0zlEofRoZeWQ2eCNCDRm51EZ5IAQModwgeZqesXMu0grA58FxMH0rvldX1NHL7zPQj9KCR0xi51eXAE62zHKlxCspSKr1X0ofyq1SQytArvbG884JyhylAaUhpANmusyJzFjZvvOA6K5eSeZiCInMW/oclNXYsqVlS41XBYZbULKkFhwFYUmNjSY1XWFKzpAaQAsYT31uZpC3IrF8YAAAAAElFTkSuQmCC`,``+import.meta.url).href},{group:`BUZARD`,name:`BUZARD_04_BRUN1R_x0_ym13`,collisionPtr:9310,offsetWord:243,sourcePtr:9562,dmaControl:3338,widthBytes:9,height:14,width:18,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAOCAYAAAAi2ky3AAABK0lEQVR4AY3BwVHjQBBA0d8iA5xC++QANob2fbgQgyYGKQUpC/rujmEDwBcmBlJoSqy9paKQyu8JG9RIKCxauLCSU0mAOZwaCMATv1Ar2fTE5zN8PkP+fR8Oh9MQ4SPAYKeB3vnzCsPAMI6MHT+olQRn7XgW+r6gRgKcJ4e5IIJw07GiRrZwAdDmTMeCNufjkiyqvbGwI/+JIADCjRrZAlEjAZoWqKDVWXxcEuYX7uZwaiDcCIAaCQVwFk0Ld9qcam98ixd6K8zh1EBYEVbUyKYFbc5d5Z8aCI9QI9VIVnIqmVNJHiBsmIzsrXAn1YUdHRt6K8zhSHWZw5mMZEfHjhoIQA2kt8Kejh2TkTzoiQ0HrkNvhQPXIRrjGNeRHcIOU/JSC4vz5ERD2PAF+z94QZ3f7kUAAAAASUVORK5CYII=`,``+import.meta.url).href},{group:`BUZARD`,name:`BUZARD_05_BRUN1L_x0_ym13`,collisionPtr:9478,offsetWord:243,sourcePtr:10386,dmaControl:3338,widthBytes:9,height:14,width:18,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAOCAYAAAAi2ky3AAABNUlEQVR4AZXBwVWkQBCA4b/QCDCF5kQAE0PNvTYLOgYmhSYGL/bdjmE3AC7TMZBC+RjxLesb0f0+YZMUH9RYSczCTlBzbjK1INzxCOCOc5NhMj6k9OLDYEj8xTsjKF5LFj5p2IggTMY5ZVZB8WEwurPwr0xQcz5pAEQQNtpxE/WF1fXVCTWTOiPUzKqWLEFxdh7YeWIeBzVG7ccTM5yM7iysniMs1552mWk7xlqQoPhSuQA8sFMqlyfm8dT1TCXzZ+k5dcbvmlmuPaul7WmXmbZjBKPt5nGpXIRvJMUBEn/VYISaqQXhf3gy92TOTlA8KM5G+IYnczZTycSCcEfDgaT4VDISs0wlM6jxlYYDgxqxIACxIBxo+KGkOAeEH0iKD2pMJRMLwh3CAQ34azRW55QpFeELb31vfgaY5hudAAAAAElFTkSuQmCC`,``+import.meta.url).href},{group:`BUZARD`,name:`BUZARD_06_BRUN2R_x0_ym13`,collisionPtr:9310,offsetWord:243,sourcePtr:9690,dmaControl:3338,widthBytes:9,height:14,width:18,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAOCAYAAAAi2ky3AAABRElEQVR4AZXBsXHbQBBA0b9gB1QLhwgFsIZjvk6kFoAaDi0sanDiy301WLmR4GpAC+uBDGowGkqm3xPuCBGvQQmVN7VkYeemDjCVzFAQdic+CFEdZtZzx3qG9Qz+63d6euoSS07Plw76zOUZUiKNIyNAw0GI6pCpQbkJNdNehZurZZgUEYSDhl2I6pCpBQk1s7FW2Sw/nb5XYgux5Z0Iwu7E7tzOqRYkRLwGZVNeZtal4/v0jWGdubQdl7ZjM5Z55KBh06uDEiLOkUGomSH+YCqZm6tlPhIOQsQBalCsZgwY+GsoCF9ouOnVAWpQQs1slqj0URkKwj807ELNvJmy1IL0Ufkfwh1u6gAyZHFT52AqmaEgPMJNnTvc1N3ULeI8wk3dIs6BRZydmzqPclO3iPOgE594XeZkL0qKXXpd5lRXRr7wByA0j0T5RtZ3AAAAAElFTkSuQmCC`,``+import.meta.url).href},{group:`BUZARD`,name:`BUZARD_07_BRUN2L_xp1_ym13`,collisionPtr:9478,offsetWord:499,sourcePtr:10514,dmaControl:3082,widthBytes:8,height:14,width:16,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAOCAYAAAAmL5yKAAABCUlEQVR4AZ3B0W2eUAyA0c+oo5hhzLu7BXcY/1vE77nDxLs4IgKJVCWqeo4AhNG7OQcZKZzUvAFKQSupifAH6aa5vJwtEhtv7Lsj4zcXrQScmincLAAiCC9ni+SyboJWcil1IFHz5mYRQTjZCrbCvjsf780hVuegldREIFHz5iScOry5WWdS6jCA4ItWUhNRo2siAAunLZLLaybD3tBKCL5Ro8Fh9wYQHoTRAAEMYKijlRxqIpwWHoyJ7OZ8mHPQSkqdL7s3p4V/sJtTE+GVAqCVXISbMHo3505GSoc3gIwUnoTRHd4d3vxFhzc/6fDmFEZzE0Z3ePM/wugObx784oEp/T6cwxbJk0821Hx5Y8AFTgAAAABJRU5ErkJggg==`,``+import.meta.url).href},{group:`BUZARD`,name:`BUZARD_08_BRUN3R_x0_ym13`,collisionPtr:9310,offsetWord:243,sourcePtr:9818,dmaControl:3338,widthBytes:9,height:14,width:18,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAOCAYAAAAi2ky3AAABPklEQVR4AY3BwVHjQBBA0d9aIoAUWicHQAzte5+IYRSDnMIoi+07E4wmhSWF3pKRKZcKKL8nfEON7Opo56q3EHZZPQGWFkwNYfeHAzXPric2H8/w/BH8W3N+eTnNrDG/vZ6gBK9vMM/MlwsXgIE7ap4QaA9uujrLEtyca8DiiCDcGdipeULQG9LV2dTR0R6U4pTi2Ag28kUEYffEl6A3RI2kB706Uw0UYBIYnWLOTwY2xRNAjQTo6lBBe7BZxr8sLbg51+BIuKNGdnU2tQcVmPg0NYRfDNwUT3bag80EFHMeMbDTHlwtIas5xZy2clXMMSX5hXBQjSzmnGvQOgKQ1RNAphAeldXTlOSgGpnVkx8MPGhqyNKCrJ58Y+BgacH75FQjOWgrV1k9ORg4aCtXxZxqJHdsBJlClhZk9eTOf304i4xsm9YyAAAAAElFTkSuQmCC`,``+import.meta.url).href},{group:`BUZARD`,name:`BUZARD_09_BRUN3L_xp1_ym13`,collisionPtr:9478,offsetWord:499,sourcePtr:10628,dmaControl:3082,widthBytes:8,height:14,width:16,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAOCAYAAAAmL5yKAAABPElEQVR4AY3BQXUUQRCA4b+GOMBCzQkBaKi9Fxc0dGvYWOjWwCUloD0gIJdpDbFQeQMzvGWT8Pg+AWhGFnN2UkM4qHkCTAWdwRwIdyST5NSdSwusPlGKs16Eqc5JJ8wRwo0FQAShO5cWnHoPpjonnQEEap7cWEQQDraCrVCKU4qjM2irs5vqzIFAoObJ4YEbxZxf+jfYgl3dAipoDTByDkQtksPC4dKCUx9BX5/Y6QxoMNXZqZHsiieA8IFmJEADKlDV2ekM5kA4LPxDMafym87gj+LJYeEdpmQxZzc2KOZs5tBDAHQGp0+8Y7v6FUBqyHzh8ef2fP3+9Qufeb7+GMjL5JGPZPNsRnLHlMzmyZ2FG9k8+wjqQPhPDxyyeQKMjTeakcWcPoJ7C0A2zz4CqSG28pdmZDFnNzbeeAUOJIq0vLnCfwAAAABJRU5ErkJggg==`,``+import.meta.url).href},{group:`BUZARD`,name:`BUZARD_10_BRUN4R_x0_ym13`,collisionPtr:9310,offsetWord:243,sourcePtr:9946,dmaControl:3338,widthBytes:9,height:14,width:18,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAOCAYAAAAi2ky3AAABQ0lEQVR4AZ3BwXHUQBBA0d+LI7BTGJ02AGLovTcXYpiJQZvCKAv6vh0DAXDSxOAUmpJYu1QuwOD3hN8oSo5ilMFuhAsH2S0BlnBaIACfeKOo5ShnNs+P8PwI+f3H/PR0niP8CjDreaY6n7/CPDNfr1xPHBS1BOet6SLUamQlAS7dYTFEEO5O3BW1BGcEwl2fjDKc9ZbsJmOjE69EEIATr5wRSFGyDGfT1NlMF+FFdsuqxhLOkbCplmU4R6MYZTibpt/YxReqGks4LRAOhIOi5CjGpg8nVtCJXQuEvzixqZZUSwANJyd2OkFVI1be9QBQhrOZVrg1YwknVrg1YwknBsI7HgBGIABrt1zCaYHwS8bKPzlxIM2lqvFiCefWjA/JbpndkoPslvyP7JbcZbcE0EJmt8xuqYXko7qSANkts1vyBz8BPuCXMrcm6AgAAAAASUVORK5CYII=`,``+import.meta.url).href},{group:`BUZARD`,name:`BUZARD_11_BRUN4L_x0_ym13`,collisionPtr:9478,offsetWord:243,sourcePtr:10742,dmaControl:3338,widthBytes:9,height:14,width:18,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAOCAYAAAAi2ky3AAABXElEQVR4AZXBsZHbMBBA0b+nq4BqAYhYgGqA8nV0LZA1gC1ANVxi5IJbOBWARKgBLewNbWqGYweS3xM2KWBTUFYyZ2HHBTWA5sC1TCsIf3kHMMP4LcNFeUjpp02TIvMPHppTXMBaycLOGxsRhItyTpmVTdg0Kf4s/Cvjgho7bwAiCJvg+cMrq/vVcC2TvPLQCgIZF9TYHNg5UuMUlBjGyOqk+LOw+pyBL3AtM3hiK8jga+yNBeDATmksR2o8+ZFLydz6yMkrXy0zlEofRoZeWQ2eCNCDRm51EZ5IAQModwgeZqesXMu0grA58FxMH0rvldX1NHL7zPQj9KCR0xi51eXAE62zHKlxCspSKr1X0ofyq1SQytArvbG884JyhylAaUhpANmusyJzFjZvvOA6K5eSeZiCInMW/oclNXYsqVlS41XBYZbULKkFhwFYUmNjSY1XWFKzpAaQAsYT31uZpC3IrF8YAAAAAElFTkSuQmCC`,``+import.meta.url).href},{group:`BUZARD`,name:`BUZARD_12_BFLY1R_x0_ym14`,collisionPtr:9110,offsetWord:242,sourcePtr:10193,dmaControl:3340,widthBytes:9,height:8,width:18,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAICAYAAAD0g6+qAAAA7klEQVR4AXXBQXHDQBBFwTcOg5jC10lIFsDAkDCsKWQx+DT3iIMA+JLBYAqbkiOnVK6k2/iDincIUo4SIAAnlzD+YbxQ8Z4foBlSPCgBAnBmgqk4bQnmBWN34kCFnuIhBUpQAgSvpk/onc7uxE7Fe8rZaA5+BBA8pXhoS2CGcWA8Td45UAbgQJBylMEm5SghlzAOTmwm7wDKgBamDHLBIEg5tLCUk3KUQQpU6BwYOxXvEAxf/FoSU6GnHFoYk3c2LYzJO5sWBvDG7p63yz25DO/UMsBwZlPXFdP5Vu/FKy2M61hhrLQwrmOFsbLeLt9vWmjc/Ae6fAAAAABJRU5ErkJggg==`,``+import.meta.url).href},{group:`BUZARD`,name:`BUZARD_13_BFLY1L_x0_ym14`,collisionPtr:9170,offsetWord:242,sourcePtr:10976,dmaControl:3340,widthBytes:9,height:8,width:18,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAICAYAAAD0g6+qAAAA0UlEQVR4AX3B0W3DQAxEwUfXsirmCmAZp2KsMvifK8bbCwMJDqAYQWaCf2hkQwGJBXIBiVcFH4Kb56DnSI5VPEmggMTiIoOfoB28Krh58NZNzy/+UMggg8XFAg2amwc3EcSxipPFTQHFSXtxshKNbN6CDxrZFsjFyUrkAhIorOSXowLgwY0GbYFcWImVcFRYCRRehFxwVMjFZWYDBD9mNqejgpnN6ahgZsuFFzFE8/baABKvCoDgNLPZga2Cmc0ObBXMbLnwIobosXFZL1gmuPkG/05kzg40ySkAAAAASUVORK5CYII=`,``+import.meta.url).href},{group:`BUZARD`,name:`BUZARD_14_BFLY1R_x0_ym19`,collisionPtr:9110,offsetWord:237,sourcePtr:10193,dmaControl:3340,widthBytes:9,height:8,width:18,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAICAYAAAD0g6+qAAAA7klEQVR4AXXBQXHDQBBFwTcOg5jC10lIFsDAkDCsKWQx+DT3iIMA+JLBYAqbkiOnVK6k2/iDincIUo4SIAAnlzD+YbxQ8Z4foBlSPCgBAnBmgqk4bQnmBWN34kCFnuIhBUpQAgSvpk/onc7uxE7Fe8rZaA5+BBA8pXhoS2CGcWA8Td45UAbgQJBylMEm5SghlzAOTmwm7wDKgBamDHLBIEg5tLCUk3KUQQpU6BwYOxXvEAxf/FoSU6GnHFoYk3c2LYzJO5sWBvDG7p63yz25DO/UMsBwZlPXFdP5Vu/FKy2M61hhrLQwrmOFsbLeLt9vWmjc/Ae6fAAAAABJRU5ErkJggg==`,``+import.meta.url).href},{group:`BUZARD`,name:`BUZARD_15_BFLY1L_x0_ym19`,collisionPtr:9170,offsetWord:237,sourcePtr:10976,dmaControl:3340,widthBytes:9,height:8,width:18,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAICAYAAAD0g6+qAAAA0UlEQVR4AX3B0W3DQAxEwUfXsirmCmAZp2KsMvifK8bbCwMJDqAYQWaCf2hkQwGJBXIBiVcFH4Kb56DnSI5VPEmggMTiIoOfoB28Krh58NZNzy/+UMggg8XFAg2amwc3EcSxipPFTQHFSXtxshKNbN6CDxrZFsjFyUrkAhIorOSXowLgwY0GbYFcWImVcFRYCRRehFxwVMjFZWYDBD9mNqejgpnN6ahgZsuFFzFE8/baABKvCoDgNLPZga2Cmc0ObBXMbLnwIobosXFZL1gmuPkG/05kzg40ySkAAAAASUVORK5CYII=`,``+import.meta.url).href},{group:`BUZARD`,name:`BUZARD_16_BFLY3R_x0_ym19`,collisionPtr:9110,offsetWord:237,sourcePtr:10267,dmaControl:3337,widthBytes:9,height:13,width:18,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAANCAYAAACkTj4ZAAABJUlEQVR4AZ3BwW0bQQxA0c9NB0kL3FMqmdypLmZrUFpYdSHew050GdbgFhjMWjYEQwhiv8ehWzF1K20UX7DwZlhxcUk1tFF80gKg6bAD3UrT+YoFIHeDiwtAqjFpo/iEbwCat/NLszMXF/1xO3Mwvq8/zy95+81/EKZupemkGpOm88oAZx0QifAPwpthpZuTakyaDhivnGkdEInwhPCoWwFoOh9t7coeJ9YBbYXejEs4WyAAwgfarFI5aDqPtnaFODH1ZtCdSQRZeKCNynDR5M6YMpDxp+jd6M3ozfi1OyIId8LUrTSdVEPTyUCaUgBj5ZCB7Pu1iBMxIBLhgQBoozgY63DayiEG79oKMSAS4YkFIAMBI8OFuxgcIhGALZBIZG8UT/wF6LWA+Mws6EoAAAAASUVORK5CYII=`,``+import.meta.url).href},{group:`BUZARD`,name:`BUZARD_17_BFLY3L_x0_ym19`,collisionPtr:9170,offsetWord:237,sourcePtr:11050,dmaControl:3337,widthBytes:9,height:13,width:18,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAANCAYAAACkTj4ZAAABEklEQVR4AZ3BwW3kMAxA0c/BlEIVw71zupCLsbsY3lfFiL1wIcMJBkGCbPIev6FG0b1YuhfAjR9So1IdjhCmF5cbv6AZ0L3YQTNYbvyAGgWQ6pyOkNyd5c5/UvPiFGgGORC6l25BAne+YUrNxiVYUh06pRmkOhDc+YIpNRtMFudNqrNoBrk7tBAA4bIb1c05RjAmzAabPdnHg49SndMRwuUOUEWxHJysgdmTfTx4leosmpAjhBc3LiLInz3o5nRzenfm3yIHwslZNCFHiBrFC+EDU8oaYE+27SFqFECbnEYialSqoxmkOhwhwhdMKWswJu+scRoTZnMgWHIgNz6xGzUS2QYCMBIBGJN3OULAyYEA/APv330hXW1NAwAAAABJRU5ErkJggg==`,``+import.meta.url).href},{group:`STORK`,name:`STORK_00_SRUNSR_x0_ym18`,collisionPtr:3913,offsetWord:238,sourcePtr:5501,dmaControl:3095,widthBytes:8,height:19,width:16,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAATCAYAAACZZ43PAAABUklEQVR4AZXBvXWkMBSA0U8wHbgFpgbXIHIRuYWnbUG0ILVgJ5DzeiDfSawaaEE+87O2zhyPF9/bsoe4El9C0I7AehqpHNghHh1eobzPIJReQTMGoGEHr1AWRzpCyrDwpWWPPI9v6ym8Ln95eTvxZz0Zbhp2yjobAG8dtYZfSGnmXsMviThqB77RWVe8dZyJDFwVrgy1hjtFKN46RAbOUpr4YkhpotZQKYWSMogMnIk4RAbwfIo6UzPcREuRd8ByFblIPWAnRAaOvSPrbKgYgNJR+MdykTJXduJCB7xiuGOoxDgVKiKOlGbQAa8YvnHgJsapAESd8cycJQXpIPGY4YFoKdJBr7BYSBm8YrjT8oBmxqcnQnyGXiE+w7oR8sZIpeUHmhnXjbBY6BUWC+tGyBsjNy3/kTfGdSMsFnqFxcK6EfLGCNCwg2YMwGKhV1gsnz4AN3yNauDkwmkAAAAASUVORK5CYII=`,``+import.meta.url).href},{group:`STORK`,name:`STORK_01_SRUNSL_xp2_ym18`,collisionPtr:4373,offsetWord:750,sourcePtr:6570,dmaControl:791,widthBytes:7,height:19,width:14,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAATCAYAAACgADyUAAABOklEQVR4AZXBu3HbMAAA0Ac6EyQrMDN4BrCnGmcFYAZpBWKGNGJP7OABXGGGrAAf/TudLonl9+68S3Nffh2PdXT0+HTyiW9x1LeIugpttsRZtvrMsKE0yk/6NsvV7cY4990Y5+5GA+Q427W6BjcavCll9RUDpDT7qgC963Svgl0pZ7ulrlpdgysDlHJG8K6Us11KBznOetJdGWCpqw+ZlA5Smu1SOiiN3nUX7uBPezr9fpyP+eGgtLPH0+r+4eRF5v47Mj/uHWtzguDCEnXx7EU92KXRq+pDaEJwZYm6eJbSrJTVpZwPwZvgyhL1NFKaD4tZjrNdzocAwYUl6mlkqmyR0shV8BeDN3HU08hU2SKlkavgHwLEUd8iU2WLTJXaBP8R4qhvkamyRaZKbYJPDFtkqmzRi9oEN3gGJLGC3Zmn/PUAAAAASUVORK5CYII=`,``+import.meta.url).href},{group:`STORK`,name:`STORK_02_SRUN4R_x0_ym19`,collisionPtr:4289,offsetWord:237,sourcePtr:5319,dmaControl:3344,widthBytes:9,height:20,width:18,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAUCAYAAACAl21KAAABQ0lEQVR4AZXBsXXbMBRA0QdIE2QGqEvPrAD2YJUVPmYgVwBmSEP0xgz2AG7EGbzCz6GsnCAKJZn3HtjB+aBjHMfqGHl7n2hYdji/zMQKWgsqqDqUqyM7mL6gL4HcQ8wYGkd2cBRyhlgx3LDsJBLYYtkh+sA9li9KaVaRwD1HNjgfNPrASmTgU2CVc2GL5YYKGn1AZGCV88xfhlQLWywNVTQvIDKwEgmIDBC5yHnmngNXyaPdCF0HVMADTOQe3rqZrvvOzwmWWgwbDIA6lD88F3nhk5+5qAOxYrjD0EhpVhoigZwL1IFYMTxw5CqlWQFSLUQKqz6BP/ElB65qLRPnMr5273Tf4McvTOwYxcH0CssHEw9YGv7ERV/5R10w7KWC0lBBvUN5wvJEXsCfeMrSSB7lRj2DOJ6yNMTxn7pgAFRQHvgNYMZ6G5Ihf98AAAAASUVORK5CYII=`,``+import.meta.url).href},{group:`STORK`,name:`STORK_03_SRUN4L_xp1_ym19`,collisionPtr:4709,offsetWord:493,sourcePtr:6408,dmaControl:3088,widthBytes:8,height:20,width:16,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAUCAYAAACEYr13AAABQ0lEQVR4AZ3BsXXbMBRA0QdoA2sFqsoAmgHpwcZe4WMGcgVgBjdgb+yQAdQQM2iF70NazkEY81jyvQc+idf4MgwzDNd6GbmT1Q5VQbVMhALzW+ZHokMXuKw84MBNqYzH469hrhPXehm5k6Uh4nmUZSM4zyMsGyKeGLNyJ0Mjxqwing+GRUqZRSwTtUyGDUsjlgkwfEopsxDpCc6jgrJh2Ugpswog0iPiWYj0pAqqKI0DjWu9jDMM4bkn1cyfceL8PLIKcH4CAhzPDKUyAhi+EB2Ky6xKz0I6PhT+MhVj2BEdisuIeFKaaIXQG24MO6JDAcoM7sQq4gnOswihNwAH9g3xDFcDoWDeHEN4ujC+TqTXyXBj2VEqhsbvwsqduI/rUBWUhgrKhmWHO0GqfMuyQzooM/+JDqVh+YIKClAqhg3p+Mc7JVuGAWK03jUAAAAASUVORK5CYII=`,``+import.meta.url).href},{group:`STORK`,name:`STORK_04_SRUN1R_x0_ym19`,collisionPtr:3997,offsetWord:237,sourcePtr:4793,dmaControl:3344,widthBytes:9,height:20,width:18,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAUCAYAAACAl21KAAABQklEQVR4Aa3B0W2DMBRA0WvCKGYY+9/e4nkGugLeAv/n7dAB+oNn6AquoKmKqpAEqedcOMG60MY0jmoZef94Y6fnhOU6Y3yhLQWEhoIHtGJ6TjC+0K6B7CFlDDsXTrADo/mEqcJn/Xhjp+OE5AIigarF8EfHP+l5gXWhJRcQCRzpucO60JILrEQiUICZVc6Fezr+aEJLLiASWeU888swaeGejp3WaLmCSGQlEhCJMLDJeeaIAWiWlgeQBXCAAgub7AE3IxIZfKBqMdzRcyML4PjmIHu+uRmRSPZQtRgOGHamaW7siARyLqCRpBge6LmZprmx0shKF0DZJMXwRMdNStHoFPmhFQMglpf07LgBxLIRoQHkyksMB5ylAVwdG6+gFcOBjgNaMVcHXsEruIGHep5wAyTFaOWhjgdyBbFgXWg88QXu9nud0XHDYgAAAABJRU5ErkJggg==`,``+import.meta.url).href},{group:`STORK`,name:`STORK_05_SRUN1L_x0_ym19`,collisionPtr:4457,offsetWord:237,sourcePtr:5902,dmaControl:3344,widthBytes:9,height:20,width:18,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAUCAYAAACAl21KAAABZElEQVR4Aa3BsdGbMACA0U/gDVgBKgbQDHIPjbOCNIO0ApohDfRohjAADZqBFZQzv5Pzcdjmz+W9nD3dpO6HtQvYNc6Oky4AqiSNAAoIAyI2pLFHCME/6xTpDtUnvuHCTkcDfqBkIHJexk4Mg9C6waiG78j4T3IOWGutlDVFUdsF7Bpnxwc5B4qitlLWSFljbi3WYouit0o1dgG7xtmxk3GgCwMg+MP7njutW4xqSJrETsYL3vdsKtC6ReuGO61bfISUSDzJObDG2S1gza3Fi57JDcibY1OBlICBQmJHsG7F5bywxtkVE1Z3A9PaM7mB6SdIyZcK5C82bsUJPugUCdWjdYP3A8+MaQUPghM6RQIIC6iKL6rnzphWAGScoEs2ISJ4CF2LMa3g4cIJPoIuQWsST0LkL8EbqiSNis01sAkRwYGMN1QF1wDXAKOCEBG8kPGGCYgQEario4wPStUkXYKPvPUbrp+MeJZwxusAAAAASUVORK5CYII=`,``+import.meta.url).href},{group:`STORK`,name:`STORK_06_SRUN2R_x0_ym19`,collisionPtr:4121,offsetWord:237,sourcePtr:4975,dmaControl:3088,widthBytes:8,height:20,width:16,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAUCAYAAACEYr13AAABPElEQVR4AaXBwXGjQBBA0T9YGTiF4eRImvuQRU8MKAUmC7irc9gA9iJy6S0hbI9ZVMXWvvfGSVGSD3kYLDLw6/eVTcNJ99tENnCbccU94gAXTgrdjN8SpYNcCGzeOGuZr+/vHwNtwmy+smn4Tw3/SDVRu3BClORZEqqJvQsHoiTPknhQ7YEZmHgK1Bp2XPEsCdWeh1ImvgVKmag1VNzxsoBqz4NqQrWHzJfRZmqBzSi43gHhaWRVOkAmVHvaLrHYHKgEAI84n4RVWXiSiZX1ZCOwE6iM4+RUVBOlzGA92QgcCGzGcXIerGckkZn5lI3AC4EDEnFpQSNfOgNbCOw0vKARygKdsboJjIKzc+GAtKyyEQBCAYn4TSDzU8MrbaJmC6EsMApOpeGV+4xEnEo2AjsNB+zO6ib8JRuByh+W83aX39QqkgAAAABJRU5ErkJggg==`,``+import.meta.url).href},{group:`STORK`,name:`STORK_07_SRUN2L_xp1_ym19`,collisionPtr:4541,offsetWord:493,sourcePtr:6084,dmaControl:3088,widthBytes:8,height:20,width:16,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAUCAYAAACEYr13AAABT0lEQVR4AaXBwXHbMBBA0Q/KFUQtUCcXwBrgO3lxWljUALYA1JALedf24AJ0IWpQC+uh7GgwtOQoyXs7atJb+hnjAvFcTiMPaACsxUww05mgsBwn/kny2Ao/GQ9qqPmJnGfQwfGghv/UUBHp+Vs7KjHG2HXP7PfPcYF4LqeRP3BUzDAwPjhWOU+sks4UnR0bDZWcJ8DxW84TK5GB4HtMMDYaKklnrgKIDIj0rEQGcgEzjMqOyrmcxl9vfQyvA7lMvI0z3evIRYDuBxBg3xG1MAI4bkgew09c6MBKWj4oV67gHHckj+EnRHpynqmFMDg+Ob6RPManRE9gBj+xCmFwAI4bfIsdPVe5gC6gBcfGExvJY9Jy8aLgDyAt6MJNT2xICy8KWnAAWkAE8wfQwhcNleSxXEALjtqh556GjaA4Kr7FWGbuaagExbFx9Fzowk3vZPiJVd9i6q8AAAAASUVORK5CYII=`,``+import.meta.url).href},{group:`STORK`,name:`STORK_08_SRUN3R_x0_ym19`,collisionPtr:4205,offsetWord:237,sourcePtr:5137,dmaControl:3344,widthBytes:9,height:20,width:18,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAUCAYAAACAl21KAAABSklEQVR4Aa3BzXGcQBCA0a8RGSiF2ZMjGe5DFk0MbApMFsydzsEB+MLk0q79sb1CoEJVfu+Nk0JMPg7jaIGRn7+ubLSctC4z0hV8LaA4Bh1gFQFoOUm6gi+J3MGQETbeOKuW6/v7j5FLwqxc2Wj4Txq+STWxp+WEEJMPMaGaONKyI8TkQ0zcqPZAAWYehD0NG674EBOqPTc5z/wj5Dyzp+GFO54rqPbcqCZUexj4a7LCHuFpiriuQORh4i53QJxR7bl0iWpF2CEAHnD+iNzlykOcubOewRAOCC+maXZeqCZyLmA9gyF8oeVpmmYHmKxQrQg3hnOSsGOKuAbIFWyFJUKuMBjCgYaNGHANkCsMhlhFeIoB50DDRrzwiWREAywRYsDZ0XDAVj6QjOQKS4QYcDZaNjRArmAVYcNW7uIFrPJBww4NHLIVNPDJb5+hfydZUcHHAAAAAElFTkSuQmCC`,``+import.meta.url).href},{group:`STORK`,name:`STORK_09_SRUN3L_xp1_ym19`,collisionPtr:4625,offsetWord:493,sourcePtr:6246,dmaControl:3088,widthBytes:8,height:20,width:16,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAUCAYAAACEYr13AAABWUlEQVR4AaXBwXHbMBBA0b+UK4hagE4ugDVs7uTFaQGoAWyBqCEX8i704AJ0EWpQC+uhzHhgWhrLk/d21Hxn458YzxAv5TTwgCd12BFAgTwjpcOOEyLCj42KLdDJeFBDTSdSmiH3woMa/lNDxfuOn9pRiTHGtn1mv3+OZ4iXchr4hlAxw8B4JyxSmliMeabkWdhoqKQ0AcI/KU0svO8J2mEeY6OhMuaZDwG87/G+Y+F9TypghlHZUbmU0/D3tYvhpSeViddhpn0ZuArQ/gIC7FtiLgwAwg2jYujEVe5ZeMe7zAcpiHDHqBg64X1HSjO1EHphJdwxKsYqZATAaWdBOxYh9AIg3DAq5h38zqAH8A5SgZARNho21GGsckFCRlIB70AdxsYTFXXYUbmShLChB8iFTxpW6rCjQiogCaGSz9zVsNIDpAL5zBe5IKmAd3zRsPIO8pm7vOOmN2I1h/1gzxEkAAAAAElFTkSuQmCC`,``+import.meta.url).href},{group:`STORK`,name:`STORK_10_SRUN4R_x0_ym19`,collisionPtr:4289,offsetWord:237,sourcePtr:5319,dmaControl:3344,widthBytes:9,height:20,width:18,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAUCAYAAACAl21KAAABQ0lEQVR4AZXBsXXbMBRA0QdIE2QGqEvPrAD2YJUVPmYgVwBmSEP0xgz2AG7EGbzCz6GsnCAKJZn3HtjB+aBjHMfqGHl7n2hYdji/zMQKWgsqqDqUqyM7mL6gL4HcQ8wYGkd2cBRyhlgx3LDsJBLYYtkh+sA9li9KaVaRwD1HNjgfNPrASmTgU2CVc2GL5YYKGn1AZGCV88xfhlQLWywNVTQvIDKwEgmIDBC5yHnmngNXyaPdCF0HVMADTOQe3rqZrvvOzwmWWgwbDIA6lD88F3nhk5+5qAOxYrjD0EhpVhoigZwL1IFYMTxw5CqlWQFSLUQKqz6BP/ElB65qLRPnMr5273Tf4McvTOwYxcH0CssHEw9YGv7ERV/5R10w7KWC0lBBvUN5wvJEXsCfeMrSSB7lRj2DOJ6yNMTxn7pgAFRQHvgNYMZ6G5Ihf98AAAAASUVORK5CYII=`,``+import.meta.url).href},{group:`STORK`,name:`STORK_11_SRUN4L_xp1_ym19`,collisionPtr:4709,offsetWord:493,sourcePtr:6408,dmaControl:3088,widthBytes:8,height:20,width:16,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAUCAYAAACEYr13AAABQ0lEQVR4AZ3BsXXbMBRA0QdoA2sFqsoAmgHpwcZe4WMGcgVgBjdgb+yQAdQQM2iF70NazkEY81jyvQc+idf4MgwzDNd6GbmT1Q5VQbVMhALzW+ZHokMXuKw84MBNqYzH469hrhPXehm5k6Uh4nmUZSM4zyMsGyKeGLNyJ0Mjxqwing+GRUqZRSwTtUyGDUsjlgkwfEopsxDpCc6jgrJh2Ugpswog0iPiWYj0pAqqKI0DjWu9jDMM4bkn1cyfceL8PLIKcH4CAhzPDKUyAhi+EB2Ky6xKz0I6PhT+MhVj2BEdisuIeFKaaIXQG24MO6JDAcoM7sQq4gnOswihNwAH9g3xDFcDoWDeHEN4ujC+TqTXyXBj2VEqhsbvwsqduI/rUBWUhgrKhmWHO0GqfMuyQzooM/+JDqVh+YIKClAqhg3p+Mc7JVuGAWK03jUAAAAASUVORK5CYII=`,``+import.meta.url).href},{group:`STORK`,name:`STORK_12_SFLY1R_x0_ym19`,collisionPtr:3793,offsetWord:237,sourcePtr:5655,dmaControl:3338,widthBytes:9,height:14,width:18,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAOCAYAAAAi2ky3AAABMElEQVR4Aa3BsZHaQAAAwL1HFTwtSDWohiMXiWvQ1SBakGpwgnLOLUABJFINtHAePx/YGP8QeHfjRXXsypCGIdcGl+vBg8qLltNR2M3KMtMrMjvkVYDKi8JuVk6daUeaBA/evCrvg1/i0TNv/pPKM/FY9J0P0+xD3odpmvV9JyV/qTyoY1dSpI8QTOtRv+w1sSu+UPlNHbuynI4I7oq+DyRS7PR9h+CZyqc6diXFDsFdQTBNR+M6Sw3TNBtzh9mjyqcUO38KJPpxT2bMJLM1C57YQKmVy202roTboP0+k91l2nd+nK+mi+AfNrBtDf1C2F6NK+F21b4jo0Hm1hAbQ14dPLGBvDpsW0PKQus6rDdugcuW9swOY8vhzPLNcLg4eBB8IdZKbMgLsSEv5FXwxE/jnHdRsNwddgAAAABJRU5ErkJggg==`,``+import.meta.url).href},{group:`STORK`,name:`STORK_13_SFLY1L_xp1_ym19`,collisionPtr:3853,offsetWord:493,sourcePtr:6705,dmaControl:3082,widthBytes:8,height:14,width:16,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAOCAYAAAAmL5yKAAABLUlEQVR4AaXBsW3cMBSA4f/pvIFXEDv3nIHpdY29AjXD0wriDG7E/riD+qghVwhXYGDZAYhLAlyQ77vQ81Nb31QzaC3HwgOe3Ei7ATggRaRMtNuGiPDPVkf7gNsaDxrouY1TugoPGvhPT3S8nwghcnJb44OfOIUI6SrcudBRVd33gwz6Y1x4thO31xfUKM/1IIPWcix0LnRUF7V2QyrYGrEagQYI1kbm1++874fWcix8udB53yeVyultB6mKtS9AAxZgQaqSQWs5FoCBTklRSFfWFJmJeH+FGUDozW7iF+EP3Ei7OX4TzMaaIjMRn0EKMnBndTRngMSnxCkUWFNkJuIzBMNpoNM8LWXwI3wDSBAMhAIpg8mROSHBwJwQAOGOG2nOQMrgDKQMqSD8xU/q/IJzKWpGPgAAAABJRU5ErkJggg==`,``+import.meta.url).href},{group:`STORK`,name:`STORK_14_SFLY1R_x0_ym19`,collisionPtr:3793,offsetWord:237,sourcePtr:5655,dmaControl:3338,widthBytes:9,height:14,width:18,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAOCAYAAAAi2ky3AAABMElEQVR4Aa3BsZHaQAAAwL1HFTwtSDWohiMXiWvQ1SBakGpwgnLOLUABJFINtHAePx/YGP8QeHfjRXXsypCGIdcGl+vBg8qLltNR2M3KMtMrMjvkVYDKi8JuVk6daUeaBA/evCrvg1/i0TNv/pPKM/FY9J0P0+xD3odpmvV9JyV/qTyoY1dSpI8QTOtRv+w1sSu+UPlNHbuynI4I7oq+DyRS7PR9h+CZyqc6diXFDsFdQTBNR+M6Sw3TNBtzh9mjyqcUO38KJPpxT2bMJLM1C57YQKmVy202roTboP0+k91l2nd+nK+mi+AfNrBtDf1C2F6NK+F21b4jo0Hm1hAbQ14dPLGBvDpsW0PKQus6rDdugcuW9swOY8vhzPLNcLg4eBB8IdZKbMgLsSEv5FXwxE/jnHdRsNwddgAAAABJRU5ErkJggg==`,``+import.meta.url).href},{group:`STORK`,name:`STORK_15_SFLY1L_xp1_ym19`,collisionPtr:3853,offsetWord:493,sourcePtr:6705,dmaControl:3082,widthBytes:8,height:14,width:16,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAOCAYAAAAmL5yKAAABLUlEQVR4AaXBsW3cMBSA4f/pvIFXEDv3nIHpdY29AjXD0wriDG7E/riD+qghVwhXYGDZAYhLAlyQ77vQ81Nb31QzaC3HwgOe3Ei7ATggRaRMtNuGiPDPVkf7gNsaDxrouY1TugoPGvhPT3S8nwghcnJb44OfOIUI6SrcudBRVd33gwz6Y1x4thO31xfUKM/1IIPWcix0LnRUF7V2QyrYGrEagQYI1kbm1++874fWcix8udB53yeVyultB6mKtS9AAxZgQaqSQWs5FoCBTklRSFfWFJmJeH+FGUDozW7iF+EP3Ei7OX4TzMaaIjMRn0EKMnBndTRngMSnxCkUWFNkJuIzBMNpoNM8LWXwI3wDSBAMhAIpg8mROSHBwJwQAOGOG2nOQMrgDKQMqSD8xU/q/IJzKWpGPgAAAABJRU5ErkJggg==`,``+import.meta.url).href},{group:`STORK`,name:`STORK_16_SFLY3R_x0_ym19`,collisionPtr:3793,offsetWord:237,sourcePtr:5783,dmaControl:3337,widthBytes:9,height:13,width:18,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAANCAYAAACkTj4ZAAABR0lEQVR4AZ3BzXGbQBgA0LeRK4haQCcXQFrAd3FyC5AWoIWlBl/g7u2BAnIRNaiFLyMPB43Gnvy8d7CLThyPhrIZ/a/oBEQlcp7DF6rmHDnPoTuHB8kuKgFTP7vp+zZ5kPMcfSEuLQ0KLyib9ARRCZhOKK3uQt/MobTJnb4Q72fTC/0kufMN0iZp6CofphNRtTRzuFfa5KaZPfoG0Qm7rqKrmDbivaWZw184wLgax9U41AYZhfXKep2959ZxNZTTPOT+PNT1s9dxdN1+je482UUn7KbTzInu0vrQzDK67myaFp852I2r8Xg01ANrfXZTDzNGdT2r62c3r+NoK0vyINlFJTTIduHeNC1yWWxlST7xBFEJDYoP0wskXYUcpmnRXVp9kXzhAMN3g4KJ9FPCsF25Jta3kW3x403yL3IjciOaStjlRviD36S4kV1O3v4pAAAAAElFTkSuQmCC`,``+import.meta.url).href},{group:`STORK`,name:`STORK_17_SFLY3L_x0_ym19`,collisionPtr:3853,offsetWord:237,sourcePtr:6819,dmaControl:3337,widthBytes:9,height:13,width:18,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAANCAYAAACkTj4ZAAABTklEQVR4AZ3BsY3bMBSA4f/FN8F5BarSAMwKTE81zgrUDOQK5AxuxF7aQQO4EWfQCu8QxQguAowL8n38r+xQDSgvBa85T2qcV17IeVI1KIAGFOANwBl0BnDAUpHmyc4zLpWznCflSQ0qBQEQTrJDw6zIjwrLIHzmJtVtoHQcwsZBGvLGmZs4LIPwmZtUzUDht2AAA1IQgG/8CzepzgOlQTAQDH9oQAEunGwQx5vneu3jgo+5q3GeK6VM0Cr2HcjAAlKQtJIALpy8d32UHULwXPcHdB5rK/ZeWe3EevVYW2GBaIlpJQFcONnbI20Qx5vH2h5reyCBU9b1wS/2Z6UIfL8jPAkvGOd1dJ4QPH8TDiOwgDQE4MILe3uk2dRYWo+1PYxCKYn1DvYGjICDuBPTThK+kB3K07JxWBqiBmUDOpCG8JXsUJ6cQbNDs0M5+QBlaJA1RIyAiwAAAABJRU5ErkJggg==`,``+import.meta.url).href},{group:`PLYR1`,name:`PLYR1_00_PLY1R_xp2_ym17`,collisionPtr:0,offsetWord:751,sourcePtr:11193,dmaControl:771,widthBytes:7,height:7,width:14,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAHCAYAAAA4R3wZAAAAR0lEQVR4AY3BwQ2AIAAEwV1Dc1Cwlnc+5EGIiDPSJYROkY3CwCs8ZOdgkCo05QcBEsJEkQ+FlTNJlTeKhZWmsiZdQpgosnAD+aEQrN7EL1MAAAAASUVORK5CYII=`,``+import.meta.url).href},{group:`PLYR1`,name:`PLYR1_01_PLY1L_x0_ym17`,collisionPtr:0,offsetWord:239,sourcePtr:11244,dmaControl:771,widthBytes:7,height:7,width:14,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAHCAYAAAA4R3wZAAAARUlEQVR4AY3BsQ2AMADAsATxHDzc88LCgCoEtWVBETdFgI0FjnDE08aKUzvkSX4UMVHcAYp44QiQN/KjiImifChioghwATQgFcUulKMWAAAAAElFTkSuQmCC`,``+import.meta.url).href},{group:`PLYR1`,name:`PLYR1_02_PLY1R_xp2_ym19`,collisionPtr:0,offsetWord:749,sourcePtr:11193,dmaControl:771,widthBytes:7,height:7,width:14,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAHCAYAAAA4R3wZAAAAR0lEQVR4AY3BwQ2AIAAEwV1Dc1Cwlnc+5EGIiDPSJYROkY3CwCs8ZOdgkCo05QcBEsJEkQ+FlTNJlTeKhZWmsiZdQpgosnAD+aEQrN7EL1MAAAAASUVORK5CYII=`,``+import.meta.url).href},{group:`PLYR1`,name:`PLYR1_03_PLY1L_x0_ym19`,collisionPtr:0,offsetWord:237,sourcePtr:11244,dmaControl:771,widthBytes:7,height:7,width:14,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAHCAYAAAA4R3wZAAAARUlEQVR4AY3BsQ2AMADAsATxHDzc88LCgCoEtWVBETdFgI0FjnDE08aKUzvkSX4UMVHcAYp44QiQN/KjiImifChioghwATQgFcUulKMWAAAAAElFTkSuQmCC`,``+import.meta.url).href},{group:`PLYR2`,name:`PLYR2_00_PLY2R_xp2_ym17`,collisionPtr:0,offsetWord:751,sourcePtr:11319,dmaControl:771,widthBytes:7,height:7,width:14,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAHCAYAAAA4R3wZAAAASElEQVR4AY3BwQmAMBQFwV1Ic/6CY3lPPARCMOqMDD1hKOVDY5JDbvKtMfEMlPKD3HrCqpQXjY2EeIZHpY0NRZAdGXrCqpSNCzzOEWXWOqQ5AAAAAElFTkSuQmCC`,``+import.meta.url).href},{group:`PLYR2`,name:`PLYR2_01_PLY2L_x0_ym17`,collisionPtr:0,offsetWord:239,sourcePtr:11370,dmaControl:771,widthBytes:7,height:7,width:14,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAHCAYAAAA4R3wZAAAAVElEQVR4AY3B0Q2AIBBEwbdqT9YAVXnF2MJZ3ho+TAwhyoyYkTaPKgEsTHARLuJtZUIEEbsPmjMCQPxJm16VNpq0GXARuhgSf9KmVyXxJW16VQK4AZ1aGLYWEzZOAAAAAElFTkSuQmCC`,``+import.meta.url).href},{group:`PLYR2`,name:`PLYR2_02_PLY2R_xp2_ym19`,collisionPtr:0,offsetWord:749,sourcePtr:11319,dmaControl:771,widthBytes:7,height:7,width:14,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAHCAYAAAA4R3wZAAAASElEQVR4AY3BwQmAMBQFwV1Ic/6CY3lPPARCMOqMDD1hKOVDY5JDbvKtMfEMlPKD3HrCqpQXjY2EeIZHpY0NRZAdGXrCqpSNCzzOEWXWOqQ5AAAAAElFTkSuQmCC`,``+import.meta.url).href},{group:`PLYR2`,name:`PLYR2_03_PLY2L_x0_ym19`,collisionPtr:0,offsetWord:237,sourcePtr:11370,dmaControl:771,widthBytes:7,height:7,width:14,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAHCAYAAAA4R3wZAAAAVElEQVR4AY3B0Q2AIBBEwbdqT9YAVXnF2MJZ3ho+TAwhyoyYkTaPKgEsTHARLuJtZUIEEbsPmjMCQPxJm16VNpq0GXARuhgSf9KmVyXxJW16VQK4AZ1aGLYWEzZOAAAAAElFTkSuQmCC`,``+import.meta.url).href},{group:`PLYR3`,name:`PLYR3_00_PLY3R_xp2_ym17`,collisionPtr:0,offsetWord:751,sourcePtr:11451,dmaControl:771,widthBytes:7,height:7,width:14,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAHCAYAAAA4R3wZAAAAVUlEQVR4AY3BgQmDMBRF0XtLRokrZcgu0GH8u7xCiRAEtefIlE6YLORBY+H25qcGT14ssg/4DPmDAOmEEwu50Vjt4RAIF1Qbq00OFnJDpnTCiYVc+AIoXxMywQ5jmgAAAABJRU5ErkJggg==`,``+import.meta.url).href},{group:`PLYR3`,name:`PLYR3_01_PLY3L_x0_ym17`,collisionPtr:0,offsetWord:239,sourcePtr:11502,dmaControl:771,widthBytes:7,height:7,width:14,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAHCAYAAAA4R3wZAAAAUElEQVR4AY3BwQ2AMAwEwb2IUpyWKDINUAzu5fiAFOVBPCMKHJiXEgE0CtQH6oNZo+I65ftkJjYcmIUSHQC2TUUXH7HhwCyUSPxwYBZKBPAAMHwVDYtE/qUAAAAASUVORK5CYII=`,``+import.meta.url).href},{group:`PLYR3`,name:`PLYR3_02_PLY3R_xp2_ym19`,collisionPtr:0,offsetWord:749,sourcePtr:11451,dmaControl:771,widthBytes:7,height:7,width:14,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAHCAYAAAA4R3wZAAAAVUlEQVR4AY3BgQmDMBRF0XtLRokrZcgu0GH8u7xCiRAEtefIlE6YLORBY+H25qcGT14ssg/4DPmDAOmEEwu50Vjt4RAIF1Qbq00OFnJDpnTCiYVc+AIoXxMywQ5jmgAAAABJRU5ErkJggg==`,``+import.meta.url).href},{group:`PLYR3`,name:`PLYR3_03_PLY3L_x0_ym19`,collisionPtr:0,offsetWord:237,sourcePtr:11502,dmaControl:771,widthBytes:7,height:7,width:14,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAHCAYAAAA4R3wZAAAAUElEQVR4AY3BwQ2AMAwEwb2IUpyWKDINUAzu5fiAFOVBPCMKHJiXEgE0CtQH6oNZo+I65ftkJjYcmIUSHQC2TUUXH7HhwCyUSPxwYBZKBPAAMHwVDYtE/qUAAAAASUVORK5CYII=`,``+import.meta.url).href},{group:`PLYR3`,name:`PLYR3_04_PLY3S_x0_ym11`,collisionPtr:12181,offsetWord:245,sourcePtr:11553,dmaControl:264,widthBytes:5,height:12,width:10,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAMCAYAAABbayygAAAAqklEQVR4AYXBwVGDUBQAwAWpQFv4nCzAGvj35KItxBqghVCDF7lDMaSGtPAyTMjIyIzu+ktEhFVl1SQxusuYLgobldWIov62aOaj3yqrjJiPFtleBZGEjemiiCT6fvBQRhIZ2d7pfPTw1F11l6uufta+u/t6O7T9y6viozVNQwel1ehHPQ8Wp9PBQ2kjI2O0V0KThH9U0NT0mCaFRRKfBlvluRE2miT62s4NqOEzzCY0W5sAAAAASUVORK5CYII=`,``+import.meta.url).href},{group:`PLYR4`,name:`PLYR4_00_PLY4R_xp2_ym17`,collisionPtr:0,offsetWord:751,sourcePtr:11645,dmaControl:771,widthBytes:7,height:7,width:14,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAHCAYAAAA4R3wZAAAAW0lEQVR4AY3BgQnDMBAEwb3gFvNd6Ip5dfFuyb0oBBQQhtieEVNmDSY7xI2NRcvgy9x7segudCAeEEBmDU7sEBcEkFkDoLU3T0jSxqL3nR87xAUxZdbgxA7xxwekSBdfkZjBSQAAAABJRU5ErkJggg==`,``+import.meta.url).href},{group:`PLYR4`,name:`PLYR4_01_PLY4L_x0_ym17`,collisionPtr:0,offsetWord:239,sourcePtr:11736,dmaControl:771,widthBytes:7,height:7,width:14,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAHCAYAAAA4R3wZAAAAVklEQVR4AY3BwQ3DMAwEwT0jNbILs5hTF0xL6YX+2ICgR6wZscGu5pYZAjjYcDo4HcwONuiHRhYz8cKuZpEZ+gB0d7NhjC8P8cKuZpEZEn/Y1SwyQwAXCYwbDRxJwUEAAAAASUVORK5CYII=`,``+import.meta.url).href},{group:`PLYR4`,name:`PLYR4_02_PLY4R_xp2_ym19`,collisionPtr:0,offsetWord:749,sourcePtr:11645,dmaControl:771,widthBytes:7,height:7,width:14,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAHCAYAAAA4R3wZAAAAW0lEQVR4AY3BgQnDMBAEwb3gFvNd6Ip5dfFuyb0oBBQQhtieEVNmDSY7xI2NRcvgy9x7segudCAeEEBmDU7sEBcEkFkDoLU3T0jSxqL3nR87xAUxZdbgxA7xxwekSBdfkZjBSQAAAABJRU5ErkJggg==`,``+import.meta.url).href},{group:`PLYR4`,name:`PLYR4_03_PLY4L_x0_ym19`,collisionPtr:0,offsetWord:237,sourcePtr:11736,dmaControl:771,widthBytes:7,height:7,width:14,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAHCAYAAAA4R3wZAAAAVklEQVR4AY3BwQ3DMAwEwT0jNbILs5hTF0xL6YX+2ICgR6wZscGu5pYZAjjYcDo4HcwONuiHRhYz8cKuZpEZ+gB0d7NhjC8P8cKuZpEZEn/Y1SwyQwAXCYwbDRxJwUEAAAAASUVORK5CYII=`,``+import.meta.url).href},{group:`PLYR4`,name:`PLYR4_04_PLY4S_x0_ym11`,collisionPtr:12181,offsetWord:245,sourcePtr:11787,dmaControl:264,widthBytes:5,height:12,width:10,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAMCAYAAABbayygAAAAn0lEQVR4AX3B0ZHDIAxAwWcPpTjFqADoIipGZUABKgZ6UYYM3Dj+uF3+ExHBktikhglf6oCXg5vEYgJvK0wOOL8Si1sBrUzdG4zGXQIwq8HNIGOWw7WwnWY11MG88TRemS2ploNJcrBcNMzBLv6cLCqZ7dUbk1hlO7lRB3UQrTwlJqkBIL3wJZWnxHQ1tAODA0AgxsWPk3cO7qSG9sbTB5Y0Py9zm6ZkAAAAAElFTkSuQmCC`,``+import.meta.url).href},{group:`PLYR5`,name:`PLYR5_00_PLY5R_xp2_ym17`,collisionPtr:0,offsetWord:751,sourcePtr:11879,dmaControl:771,widthBytes:7,height:7,width:14,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAHCAYAAAA4R3wZAAAAT0lEQVR4AZXB2QnAMAxEwbeQ5lRAVKQKiMvboA9DMOSaEVOUmUaKFxsXPpIm8UOUiTIfiRZlViPFA9GiDOBj5ws1WpRZjRQPxBRlViPFjRPwxRX7laTuXAAAAABJRU5ErkJggg==`,``+import.meta.url).href},{group:`PLYR5`,name:`PLYR5_01_PLY5L_x0_ym17`,collisionPtr:0,offsetWord:239,sourcePtr:11930,dmaControl:771,widthBytes:7,height:7,width:14,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAHCAYAAAA4R3wZAAAATElEQVR4AZ3BsRGAMAwEwXuG5kQBKlLkdnlPghMH2MOu2BFlhp4CONjglrgl/0SZKPMSK1Fm1lMngG2zQdfNIFaizKynxJcoM+spgAfznxj3hOw43AAAAABJRU5ErkJggg==`,``+import.meta.url).href},{group:`PLYR5`,name:`PLYR5_02_PLY5R_xp2_ym19`,collisionPtr:0,offsetWord:749,sourcePtr:11879,dmaControl:771,widthBytes:7,height:7,width:14,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAHCAYAAAA4R3wZAAAAT0lEQVR4AZXB2QnAMAxEwbeQ5lRAVKQKiMvboA9DMOSaEVOUmUaKFxsXPpIm8UOUiTIfiRZlViPFA9GiDOBj5ws1WpRZjRQPxBRlViPFjRPwxRX7laTuXAAAAABJRU5ErkJggg==`,``+import.meta.url).href},{group:`PLYR5`,name:`PLYR5_03_PLY5L_x0_ym19`,collisionPtr:0,offsetWord:237,sourcePtr:11930,dmaControl:771,widthBytes:7,height:7,width:14,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAHCAYAAAA4R3wZAAAATElEQVR4AZ3BsRGAMAwEwXuG5kQBKlLkdnlPghMH2MOu2BFlhp4CONjglrgl/0SZKPMSK1Fm1lMngG2zQdfNIFaizKynxJcoM+spgAfznxj3hOw43AAAAABJRU5ErkJggg==`,``+import.meta.url).href},{group:`PLYR5`,name:`PLYR5_04_PLY5S_x0_ym11`,collisionPtr:12181,offsetWord:245,sourcePtr:11981,dmaControl:264,widthBytes:5,height:12,width:10,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAMCAYAAABbayygAAAAtElEQVR4AX3BsVHEMBBA0W+hCo4WtBGV7OVWF6YGu4brQsrZTkikGmhhGc3YYAzDe/zH3Z1dZKcJNykM2jLWmTiJ7EwK/pYZ7sIvkZ22zHQvDErmKjJoceObdSa0+ONROQS0uLaMtszVq/HliV63/sEmN9b+PDMkYb3xzqovmNUNILAzKRykVYZlmTkEThKVRMWkcBUANOEA0irSKn+JAKYzUDFjYhC8J34ILLNzogknVa4+ATYhQJkV+ppIAAAAAElFTkSuQmCC`,``+import.meta.url).href},{group:`EGGI`,name:`EGGI_00_EGGUP_x0_ym6`,collisionPtr:12085,offsetWord:250,sourcePtr:12229,dmaControl:3,widthBytes:4,height:7,width:8,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAHCAYAAAA1WQxeAAAAcklEQVR4AVXBQRHCMBAAwL3iAA3xgAYERAZgoVgILloBOOF1GrAQppQysBs+ylHPVi3KeZZ3ATsoRz1b1ctk3FeXw0PJx/hM1wGyVb1MNr1MslWLwZ+wCpvBV6Aj/BosGpEVYRFZad7C5lS7s1XDbQ54Ac8kIbqQp1tqAAAAAElFTkSuQmCC`,``+import.meta.url).href},{group:`EGGI`,name:`EGGI_01_EGGLF_x0_ym5`,collisionPtr:12117,offsetWord:251,sourcePtr:12285,dmaControl:2,widthBytes:4,height:6,width:8,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAGCAYAAAD+Bd/7AAAAdklEQVR4AUXBQRHCQAxA0Z/WQTWkpypBQPaEhfWw0YAGTisAJ70QC9RCmDLd4T3h9LZM7ZwkDNYuXGa9kZ+6Awk02lLwuzUeuwNMoQYkf8lPtQSYNDoSBRCG1M4wH4HD1nzdaEsBHAlDn50jcGGollw0OvFCAL4oCCiOG10+2QAAAABJRU5ErkJggg==`,``+import.meta.url).href},{group:`EGGI`,name:`EGGI_02_EGGRT_x0_ym5`,collisionPtr:12149,offsetWord:251,sourcePtr:12259,dmaControl:2,widthBytes:4,height:6,width:8,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAGCAYAAAD+Bd/7AAAAdUlEQVR4AUXBURWCYAyA0W9iAqwwMpDBAKOFxwqjgmbgaU0MwAvLQIV5fo/KvcLPZlUaNJIGQwhAR7NZlQZQgOP9xPLC92Q+cbPiozgUqUZzBigNDoKkoRkk0Oll9ftoeD8BM5IGD9iXVQAEQK9UqvH3DOHrDVf2J2jaL3rfAAAAAElFTkSuQmCC`,``+import.meta.url).href},{group:`EGGI`,name:`EGGI_03_EGGB1_x0_ym5`,collisionPtr:12085,offsetWord:251,sourcePtr:12311,dmaControl:258,widthBytes:5,height:6,width:10,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAGCAYAAAD68A/GAAAAm0lEQVR4ATXBQRXCMBBAwV/qACwkpwhAQwXsCSxQLGQt1AMXVkA10Du5JBpiYXnw6Aw/VZy/MIlzE3fHuYnzN1LFPRjaJYdTyrUaWytcZtCYgJTZih48GOD4YsRqxCisk/Dl4cnuMDRht65CrAYzgAMDuxFS1mjk4xvtRusJvxhDK2hPcLUBYGQrGlrJ93Ph5wUaEywQHkZvKMAHSXRFEIb3Y/sAAAAASUVORK5CYII=`,``+import.meta.url).href},{group:`EGGI`,name:`EGGI_04_EGGB2_xm1_ym10`,collisionPtr:12181,offsetWord:65526,sourcePtr:12343,dmaControl:3087,widthBytes:8,height:11,width:16,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAALCAYAAAB24g05AAAA6ElEQVR4AY3BW1XEQBBF0VPBARpqvlDSAiouOhqIhcTFtIBGAwLmJ60BC5eVeZEVhsfexo6nUHPOvEGrxfhFxzcFb6Ba+I9OQhJiozlYCg5L4S+dDYG14CyHmgerVAu1YVNC7EiIPU8IIDkihzwhHllC5BBXxgOeEEDzYKWpYEPAXIydjtUSIoe4CyBItXAhftIByI8wFyOHyCGuagoYwIYe5mI88ATwepN6xvrC8wcclkJ7OxnzaeT9NLIhoXFkBOgArPVcCAZozpcltGKVQysQN8bNEmIjpUKtgfyItR4mLgZgAuZiAJ/Jd3K9ra1UNAAAAABJRU5ErkJggg==`,``+import.meta.url).href},{group:`EGGI`,name:`EGGI_05_EGGB3_xm2_ym11`,collisionPtr:12181,offsetWord:65269,sourcePtr:12433,dmaControl:3592,widthBytes:10,height:12,width:20,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAMCAYAAABiDJ37AAAA4ElEQVR4AZXBgY2DMBBFwbeIUpxiXMC6C7YY00VcAMXgXv4JlOgQlyPJDN+QJN4YJQkMM4yDlF2RnU1dGn1pxgcGi4J156wnmGphqoWeuCQhHkbmZsz8kZfGHHd2a+M/ErLuQGNjvDK5AOrN2UQUq/UugIhiXBg4qfWuvDRSh1gbT5EbnzD+kbKrJ3aps4vsRBTjwgAgIU56AoLdbW1spsl5ZwCwcFhdHNSbkwJShyU7VySJh5HN3IyZX5Mr1kZeG5teHYKXJMl64WnkwtIxNhX1xEtmZhwMnE0uDnJCfOEHT4tjQAxJc8gAAAAASUVORK5CYII=`,``+import.meta.url).href},{group:`EGGI`,name:`EGGI_06_PLY4S_x0_ym11`,collisionPtr:12181,offsetWord:245,sourcePtr:11787,dmaControl:264,widthBytes:5,height:12,width:10,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAMCAYAAABbayygAAAAn0lEQVR4AX3B0ZHDIAxAwWcPpTjFqADoIipGZUABKgZ6UYYM3Dj+uF3+ExHBktikhglf6oCXg5vEYgJvK0wOOL8Si1sBrUzdG4zGXQIwq8HNIGOWw7WwnWY11MG88TRemS2ploNJcrBcNMzBLv6cLCqZ7dUbk1hlO7lRB3UQrTwlJqkBIL3wJZWnxHQ1tAODA0AgxsWPk3cO7qSG9sbTB5Y0Py9zm6ZkAAAAAElFTkSuQmCC`,``+import.meta.url).href},{group:`ILAVAT`,name:`ILAVAT_00_GRAB1_x0_ym5`,collisionPtr:0,offsetWord:251,sourcePtr:12591,dmaControl:1794,widthBytes:3,height:6,width:6,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAGCAYAAADgzO9IAAAAUElEQVR4AXXBQRHCMBAAwL3gAA2tmNYLHhoNeOHE9DTEQpgBHv2wG3Mx4bmSJ1kCArbFfPnakSVuUEPvQz/ujrGSpTcXOx6nj+YiS/hp/ngDeJcVpk4GdboAAAAASUVORK5CYII=`,``+import.meta.url).href},{group:`ILAVAT`,name:`ILAVAT_01_GRAB2_x0_ym8`,collisionPtr:0,offsetWord:248,sourcePtr:12611,dmaControl:13,widthBytes:4,height:9,width:8,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAJCAYAAAAPU20uAAAAVElEQVR4AXXBURECIRQAwIW5KBgGupjGLhBGujw/vBFlzl1X4i6csk0twvCRbbpf2ZdahM0BtYhuaZZUi+iWhjElp6N7axhTssnwuDGm5EKG8fTXCzoBE6Ld9f77AAAAAElFTkSuQmCC`,``+import.meta.url).href},{group:`ILAVAT`,name:`ILAVAT_02_GRAB3_x0_ym8`,collisionPtr:0,offsetWord:248,sourcePtr:12649,dmaControl:525,widthBytes:6,height:9,width:12,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAJCAYAAAAGuM1UAAAAdklEQVR4AY3BwU3DQBAAwDkrpWwz67+rzJ8thutlUcwJLBRLzLjToS0d2rK56NBuZGjYvJGhLRnaxXDRob2kb+XHmAZs3iiHUzrtfj0sGRoqD6dy2lHTsDwsH6g8vGQ97ahp+GNAh648zPlUn9Q03OnQGdo/fQH88yfS8GNT/QAAAABJRU5ErkJggg==`,``+import.meta.url).href},{group:`ILAVAT`,name:`ILAVAT_03_GRAB4_x0_ym14`,collisionPtr:0,offsetWord:242,sourcePtr:12705,dmaControl:523,widthBytes:6,height:15,width:12,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAPCAYAAADQ4S5JAAAA6klEQVR4AY3BsXHbMBQA0AdaE9ArQJUHcFb47FF5BmYGzcDMkIo9sYmaYBfkZFMJT+f48p5H21y6gyV0B4MvRNZzLo4GWEJ3sIQOcxStrY6GyHrOxU1k3W4J3cE2lw6nOYq7OHuXc3H3vUrbXLrdEFZ3ORdHra2W0KG11c3T87PL23j1+louHozji3F8EVbffkpwqr+Ys0+Flcrkr6E26UcjrG7C6o/KhNokuycfLm+N8/mqKsLqXK8m1CY5GKA2yS6sVCbUJnlwclS9m1Cb5BMDRNbtJtQm+YcUWd98mFCb5AunDRNqk/yH3zg5Tndm+GUIAAAAAElFTkSuQmCC`,``+import.meta.url).href},{group:`ILAVAT`,name:`ILAVAT_04_GRAB5_x0_ym16`,collisionPtr:0,offsetWord:240,sourcePtr:12797,dmaControl:789,widthBytes:7,height:17,width:14,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAARCAYAAADtyJ2fAAABXklEQVR4AY3BwXEbNxQA0AeKFSgtACcWsDXAd5ySFpY1UC2QLcSnvfO7BbuAvSxq2BaQCSfyaGzJ8Xs+cq2GXzh4R82GN+5zG35w8IHYPFyrcYvFv2o2ajbgAPe5DW/U4qFmA6JLUAu1eDjUbPS+eFWzAdGlWnx3rQacQ4JDLX6Sc3Of24DYuFYDziH5zxMudWqmP9ZLdC/nyWXfV3/+vZr25vn55Pn55K/Pa6rZOE8u0b0kuM9tQC0ePl0XtTDXxrz4VKjFQ2xEl55g39fLVE6+fFtM5WTfVzk3fafHyVRO9n11DqnvXuAItXjIubnFIufm1S0WtXAOyRtHiI1q8aoWzAu3pnfOIfnBAaJLkHOTc2NeuDWxEZt3JbhWA2KjFnJuel/ERnTJO57gzmWfmqmc7Pvq89dV34ku+cCxZgOqhUAlNqJLfuFYCzYEt0IE0SX/4zhv3AqxESH5Tf8AqmyXIpSHUAcAAAAASUVORK5CYII=`,``+import.meta.url).href},{group:`ILAVAT`,name:`ILAVAT_05_GRAB6_x0_ym17`,collisionPtr:0,offsetWord:239,sourcePtr:12918,dmaControl:790,widthBytes:7,height:18,width:14,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAASCAYAAABrXO8xAAABSElEQVR4AZXBwY0bNxQA0MfxduAWyJML2BpYAHNxDZoa4hY0XZh3fdeQAnQhe6ExgRAICwXZvJf8h9ulLaiFtPfkIfkX12rl3MzZnWJQi7/tIW1eqNm61GbOLgY5N6ecm5yb0+aF297EIAYxpTm7WpizO6I7vfngdmnLk2u1cm5OtXCppL1786RmC2JwRHeKgdHFlK7V8vDmSS3M2Z1qIQa1kHNzKxYc0Z2+eKjZqu/N9/dvfsRdfW++prsY/Ph1T1/d//xr3u0hwQY1W7VQC0d0tVALOTcxpXVtaw/Jkw1q4TKI4R9HdEd012q5/FSztYfkYYPLIGpTozvFYA+pFi61eWXz5CjEIKYEl9oc0Tn+8NHmoepiEFPyJIaXNjiKl9Le021vjug+SlCzdcNR2EPyCRvElPxPG6xsQQyflla2jkIMYko+6TcJSZAMFnapvwAAAABJRU5ErkJggg==`,``+import.meta.url).href},{group:`IFLAME`,name:`IFLAME_00_FLAME1_x0_ym14`,collisionPtr:0,offsetWord:242,sourcePtr:13070,dmaControl:11,widthBytes:4,height:15,width:8,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAPCAYAAADZCo4zAAAAkUlEQVR4AbXBQVEDMRQA0NfgAA1ZMZ97ZFANrYWtjL1vPKChGmrhM2UCE3a48p6jrNKkmESVkFUaiskO4ZfioGtuix/F5LYQ6+bcnQzF5Nyd/I+ocg3pDy9wf7juXD5eXe4PV5NieMOOrNKkOAqySkMxxILASo8mqoQCUeV7pWueYt3s4UuJKnd0Taybb13z9AkXpSxoC75ZOgAAAABJRU5ErkJggg==`,``+import.meta.url).href},{group:`IFLAME`,name:`IFLAME_01_FLAME2_x0_ym15`,collisionPtr:0,offsetWord:241,sourcePtr:13132,dmaControl:20,widthBytes:4,height:16,width:8,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAQCAYAAAArij59AAAAkElEQVR4Ab3BQXHDMBAAwJXCoBhkMJe/YJhDSsE0/Lc4lEKNIRSU6dRJ1Uymz+4mgyj6hjPaLkH2wuZHNmi7BC2qP/Wi+z8JetHPvrVdMjjBx5vLhuvky2W/enfIBvMnMfklQ9slh7kQRXfIRkFTxeQhGzRVLKu5eMgQRRfEsnqWISaa6pXci15KFcvqrqnubmdHJ/ynRRPyAAAAAElFTkSuQmCC`,``+import.meta.url).href},{group:`IFLAME`,name:`IFLAME_02_FLAME3_x0_ym15`,collisionPtr:0,offsetWord:241,sourcePtr:13198,dmaControl:276,widthBytes:5,height:16,width:10,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAQCAYAAAAvf+5AAAAAhklEQVR4Ac3BwW3CQBAAwOGUUpZilr/LgGJMGf77isG9bGQBigmyyDMz9lSoDOWh2XHC7H+qUD6pUB4qlI0vyFCzHxnKLw1mdyd3c3rTPCV9cahQ3eB69KJZJUYqlGRZJv3mRYNusOo5WJ1v9MXBRrOR42RPgxwnT93gevSm+aNWofpl8Mk3t2grP9aTZr4AAAAASUVORK5CYII=`,``+import.meta.url).href},{group:`IFLAME`,name:`IFLAME_03_FLAME4_x0_ym11`,collisionPtr:0,offsetWord:245,sourcePtr:13280,dmaControl:8,widthBytes:4,height:12,width:8,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAMCAYAAABfnvydAAAAeElEQVR4AYXBwY3CMBAAwMFKKXvFLH+XEYoxZfDHxUAvezoUnaIIxIx3KpTNYqdCOWg2FUp6uf741yBDSabuz2U62Sxwx9Rd58356eSoQvmg+aKNVDBSeaOtDyRrkKEcNJg6g3uSoew0yHHzMliz22swL91ehrL5BTKwI7vGy0nBAAAAAElFTkSuQmCC`,``+import.meta.url).href},{group:`POOF1`,name:`POOF1_00_FL1_xp1_ym24`,collisionPtr:0,offsetWord:488,sourcePtr:13348,dmaControl:1793,widthBytes:3,height:5,width:6,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAFCAYAAABmWJ3mAAAAMklEQVR4AU3BQQ3AMAwEMB+XjD+gjctNlfKo7dZRK1ZHrXwS6KjjLU8csTpq5RO3jlo/fYQOaqeqoScAAAAASUVORK5CYII=`,``+import.meta.url).href},{group:`POOF2`,name:`POOF2_00_FL2_xp1_ym30`,collisionPtr:0,offsetWord:482,sourcePtr:13365,dmaControl:269,widthBytes:5,height:9,width:10,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAJCAYAAAALpr0TAAAAQElEQVR4AXXBwQnDQAAEsSH917PtKeRhMDlb6jB68Oln9GR0GN2N3pAq0mE0ejIa/SNVpFeju9FhdBldRq9GD77iUjSDOijZBgAAAABJRU5ErkJggg==`,``+import.meta.url).href},{group:`POOF3`,name:`POOF3_00_FL3_x0_ym35`,collisionPtr:0,offsetWord:221,sourcePtr:13412,dmaControl:527,widthBytes:6,height:11,width:12,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAALCAYAAABLcGxfAAAARUlEQVR4AaXB0QmDAABEsbf/QLdeiv2yRUQw6cfobPTI6NbozujSqIIOo/dGh/nqBBodRu+NKugwujS6M7o1emR0NvrzAWnVQJkM7ea7AAAAAElFTkSuQmCC`,``+import.meta.url).href},{group:`IPTERO`,name:`IPTERO_00_PT1R_xp1_ym11`,collisionPtr:13516,offsetWord:501,sourcePtr:13828,dmaControl:2318,widthBytes:13,height:10,width:26,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAKCAYAAACqnE5VAAAA/ElEQVR4Aa3BwW0DIRBA0T9SSoFi8H3oAopZumAKoBi2l4lAcrIHO5GdvCek7lx4MuKAc5jwj4Sr1N1nZquKhA7NYGThj4QnPOAsCYiKhA7NYGThDcJPUnefma0qi4QONxFeJDyTuvvMbFWR0KEZjCy84YPfJL6NLFwcR/dSFFpmaSi1ZuEB4S51B/CZWVpkK0nhMJgOUZDYYWThwgMuJwJwHN1LUbaWkWoCIKTuAAFjTqNFKAGIyjaNLwfQlG0aA+U8jaUkZWkoS61ZuBDuUncAn5ktQYudgrG0YSxlAlXZpiEoPowbME6EJ4RHUnefmbsW2Q6UOI1xIrzoE9bba2UgA1tbAAAAAElFTkSuQmCC`,``+import.meta.url).href},{group:`IPTERO`,name:`IPTERO_01_PT1L_xp1_ym11`,collisionPtr:13672,offsetWord:501,sourcePtr:14220,dmaControl:2318,widthBytes:13,height:10,width:26,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAKCAYAAACqnE5VAAABAElEQVR4Aa3B221DIRBAwbOSS7kUQwG7XXCLgS7g3xQDvWwEysOxEidWMiP8kyOqjwjSlU+6CcCFv4jVSYpPg9xgAEGhm3BHeFasTlJ8GowGnU0mwgPCM67uPo0tNxYJFboJPxCeFauTFJ8GubFIqNBNeODCnZyrJxpbqpTSOE8T3nQTkjtLBDq/Ip7VSZWllMZ5mgD4gctEuBWr+zAYDkHgVEpvLGmwSahs3YQbwqucqwMkGkvpjeU4lEiDoGypwcmHoGyjUSakASEoE2XrJgDCF+KBXwGJitMgKFtulMCWorIUlDQMOpuEytZNuCE8IR74CMpJY0mDdxIqdBO+8QK1Sm0P+fMSeAAAAABJRU5ErkJggg==`,``+import.meta.url).href},{group:`IPTERO`,name:`IPTERO_02_PT2R_xp1_ym7`,collisionPtr:13568,offsetWord:505,sourcePtr:13960,dmaControl:2307,widthBytes:13,height:7,width:26,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAHCAYAAAAWAl2LAAABFUlEQVR4Aa3BsU0EMRBA0T+ihG3BjiiAGny5nUAL6xq8Lay78OTnHq6AS+wWuBYGLVokRIAIeE/4B/vebF0j1MShEsk5Cd8Iv3Ah2nTgJkwiFpRPa0MuCj0J35jDZCIAZmac5MAPLkSbRA42EuIbFpRPQ8FHpEeuTrlUFU7BYdcAdcIaIrUruSOcnji5EO3hS3kfG7eHMpdIeSjlDRhKXQq3m7L1O3lR3h4FC1q2pRXLlNeXZ+pSWFHkVrgG2Pp94yT8FJrZSJAjDEVm4+BQ/FC6b+wknItMH1lHAh+pXekD+kQAgsNCbuScBED4EprZSNTcOOxdOcyuEhwGMHwkoxz6gD4R/kgIzWwkyBF2RXyDnoR/9gH15IWkJTiL4wAAAABJRU5ErkJggg==`,``+import.meta.url).href},{group:`IPTERO`,name:`IPTERO_03_PT2L_x0_ym7`,collisionPtr:13724,offsetWord:249,sourcePtr:14352,dmaControl:2563,widthBytes:14,height:7,width:28,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAHCAYAAAAbHC3MAAABGklEQVR4AbXBwW3jMBBA0T9ICdsCmUsKcA3MfdiFVAPVAtUF527WkBTgC1mDW5hAhg9CECBYYPc94Ztamy8YD0tj3411zcI/IgDu7jyJiAB4wGUinKXmflXYMwfpSsCYAcKE2U34hXBSE74kZe/GEuC9Q58IT9dF/X0qngyGQVQO0hUfGYmNQ8CY3YQfvHByXbVIV67B2GOjXqCkt7JRiicrr7NQyWz9xl3gMxYuY6NcgI8b2x8ljczH/cZ2aSVEyn3eNk6Ep1qb95rpEwFIAU8RlqQwjD02wjDmNFYaaWRGVCbKwUOGqFANiQ16Fn4g/IUU8BR5qChxGIc+kZDUAdakHJaakdigZ+FE+B9Scx8ZVoVqSGzQswB8AfQngKMw9Hh8AAAAAElFTkSuQmCC`,``+import.meta.url).href},{group:`IPTERO`,name:`IPTERO_04_PT3R_x0_ym10`,collisionPtr:13620,offsetWord:246,sourcePtr:14053,dmaControl:2831,widthBytes:15,height:11,width:30,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAALCAYAAABoKz2KAAABKElEQVR4Ab3BwW0jIBBA0T+9QDHj+9AFFDN0AfdQDPQykRNHa1nZWMom+x7/iysRbsGN8EvCLTrG8oK2Qa2GiAi/KdyCG/cR4RY8EH5QuAV1QBZoBnVAE6QjPBCeSGpxEqQDB8MpOMZZU/iLcIuOUXfhskAz1A1yEG6ETyS1OBhXL2nyQZmQDfZkYbQDZ03hTlSi50H1gqgRGaRN4YFwJ6nFwYhd6BnqBhQEIzJ/1EG/CCkZyqTnQWVy1TFYhbYQAE2EtkFrRbgjfCKpBcDek5yNrbzbE7Ihy3AKNUHPg7oLZKOvydqwDsITwheSWuw9QUE08C44xlVjsjasg/ANwiMdARC7gMLCuNIMkgZcRPgBgo4AiF14o7AwPmjmTcdoyfAzaa0I/+gVoCOJYCHLJVMAAAAASUVORK5CYII=`,``+import.meta.url).href},{group:`IPTERO`,name:`IPTERO_05_PT3L_x0_ym10`,collisionPtr:13776,offsetWord:246,sourcePtr:14452,dmaControl:2831,widthBytes:15,height:11,width:30,url:new URL(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAALCAYAAABoKz2KAAABPklEQVR4Ab3BwW0bMRBA0T9wCWqBPKUS5k52wa1h1QLZBee+04kuZC8TrGAHQhAlNpz4vRdv2S/cdltc+UIvV7tdj+n75fJtZ+q+7WM/EvvVble+grfsrQ3nlbfs/EfCA684zaEXaArToRdkU+EfEwAPeI9gE44EPQ4qimwqPBFS9g1lYxBQVoCwYJkK7yA88JZdJrgpfRvUWZCO8CCk7C1AQiFmmIqRefN9ZU4BZZkKTwivWhturWALAWgJJw0qyqmTqbNgZNZS6uHQC29kgqNg0CPUCRIHAWWZCr8Q/iAFPEWoKcNUehzUWegLNgaeFKZCzJyiwZxKjJnTMhWeED4oBTxFaGROG8pWHTcBgxgzy1T4C+GzDndfBZvcJRQMJA7urAi/IXxCa8O3kGlLqSgnm/yUUDDuJA7urAjAD8m5n6SJa/5ZAAAAAElFTkSuQmCC`,``+import.meta.url).href}],um=function(e){return e[e.SuppressConstantHighNibble=128]=`SuppressConstantHighNibble`,e[e.SuppressConstantLowNibble=64]=`SuppressConstantLowNibble`,e[e.FlavorRight=32]=`FlavorRight`,e[e.ReplaceDataWithConstant=16]=`ReplaceDataWithConstant`,e[e.SuppressZeroes=8]=`SuppressZeroes`,e[e.SlowForRam=4]=`SlowForRam`,e[e.WriteBlock=2]=`WriteBlock`,e[e.ReadBlock=1]=`ReadBlock`,e}({});function dm(e,t){return(e&t)!==0}function fm(e){return{x:pm(e)*2,y:e&255}}function pm(e){return e>>8&255}var mm=new Map;for(let e=0;e<nm.length;e++){let[t,n,r,i]=nm[e],a=`${t},${n},${r},${i}`;mm.has(a)||mm.set(a,e)}function hm(e,t,n){let r=new Uint8Array(e*t);for(let e=0;e<r.length;e++){let t=e*4,i=`${n[t]},${n[t+1]},${n[t+2]},${n[t+3]}`,a=mm.get(i);if(a===void 0)throw Error(`PNG pixel does not match Joust palette: ${i}`);r[e]=a}return{width:e,height:t,pixels:r}}async function gm(e){let t=await fetch(e);if(!t.ok)throw Error(`failed to load texture ${e}: ${t.status}`);let n=await createImageBitmap(await t.blob()),r=n.width,i=n.height,a=document.createElement(`canvas`);a.width=r,a.height=i;let o=a.getContext(`2d`,{alpha:!0});if(!o)throw Error(`2D canvas context unavailable`);o.imageSmoothingEnabled=!1,o.drawImage(n,0,0);let s=o.getImageData(0,0,r,i).data;return n.close(),hm(r,i,s)}var _m=10,vm=8,ym=[{name:`BRIDGE`,startAddress:211,widthBytes:27,height:3,color:vm},{name:`BRIDG2`,startAddress:30931,widthBytes:30,height:3,color:vm}];function bm(e){let t=om.find(t=>t.name===e);if(!t)throw Error(`${e} image missing`);return t}var xm=[bm(`CLIF1L`),bm(`CLIF1R`),bm(`CLIF2`),bm(`CLIF3L`),bm(`CLIF3U`),bm(`CLIF3R`),bm(`CLIF4`)];async function Sm(){let e=await Promise.all(xm.map(async e=>({metadata:e,texture:await gm(e.url)})));return{compactClif5:await gm(sm.url),cliffs:e,sprites:await Promise.all(lm.map(async e=>({metadata:e,texture:await gm(e.url)}))),fonts:await Promise.all(cm.map(async e=>({metadata:e,texture:await gm(e.url)})))}}function Cm(e,t){e.blitTexture(sm.startX,sm.startY,t.compactClif5,{transparent:0});for(let t of ym){let{x:n,y:r}=fm(t.startAddress);e.fillRect(n,r,t.widthBytes*2,t.height,t.color)}for(let{metadata:n,texture:r}of t.cliffs){let{x:t,y:i}=fm(n.startAddress),a=dm(_m,um.SuppressZeroes)?0:void 0;e.blitTexture(t,i,r,{transparent:a})}}var Q=function(e){return e[e.White=1]=`White`,e[e.Cyan=2]=`Cyan`,e[e.Magenta=3]=`Magenta`,e[e.Red=4]=`Red`,e[e.Yellow=5]=`Yellow`,e[e.Green=7]=`Green`,e[e.Brown=8]=`Brown`,e[e.Purple=9]=`Purple`,e[e.Orange=8]=`Orange`,e[e.BlueGray=13]=`BlueGray`,e}(Q||{}),wm=function(e){return e[e.Attract=0]=`Attract`,e[e.Playing=1]=`Playing`,e}(wm||{}),Tm=function(e){return e[e.Boot=0]=`Boot`,e[e.Leaderboard=1]=`Leaderboard`,e[e.Title=2]=`Title`,e[e.Rules=3]=`Rules`,e}(Tm||{}),Em=240,Dm=480,Om=480,km=240,Am=[{initials:`KEN`,score:`15950`},{initials:`JON`,score:`12500`},{initials:`SAM`,score:`10000`},{initials:`EJW`,score:`07500`},{initials:`BSO`,score:`05000`}];function jm(e){return{x:(e>>8&255)*2,y:e&255}}function $(e,t,n,r){return{...jm(e),color:t,text:n,font:r}}var Mm=[{lesson:`fly`,lines:[$(13344,Q.Cyan,`WELCOME TO JOUST`),$(16944,Q.White,`TO FLY,`),$(6976,Q.White,`REPEATEDLY PRESS THE 'FLAP' BUTTON`)]},{lesson:`survive`,lines:[$(12849,Q.White,`TO SURVIVE A JOUST`),$(11841,Q.White,`THE HIGHEST LANCE WINS`),$(14417,Q.White,`IN A COLLISION`)]},{lesson:`eggs`,lines:[$(13618,Q.White,`PICK UP THE EGGS`),$(13122,Q.White,`BEFORE THEY HATCH`)]},{lesson:`enemies`,lines:[$(13363,Q.White,`MEET THY ENEMIES`),$(4278,Q.Red,`BOUNDER (500)`),$(4294,Q.BlueGray,`HUNTER (750)`),$(4310,Q.Purple,`SHADOW LORD (1500)`)]},{lesson:`pterodactyl`,lines:[$(6726,Q.White,`BEWARE OF THE`),$(4742,Q.White,`"UNBEATABLE?" PTERODACTYL`)]},{lesson:`start`,lines:[$(9303,Q.White,`PRESS `),$(13911,Q.Yellow,`"SINGLE PLAY"`),$(23127,Q.White,` TO START`),$(18807,Q.White,`OR`),$(9879,Q.White,`INSERT ADDITIONAL COINS FOR`),$(15783,Q.Green,`"DUAL PLAY"`)]},{lesson:`copyright`,lines:[$(4144,Q.White,`THIS IS JOUST`),$(4160,Q.White,`DESIGNED BY WILLIAMS ELECTRONICS INC.`,`FONT35`),$(4176,Q.White,`(C) 1982 WILLIAMS ELECTRONICS INC.`,`FONT35`),$(4192,Q.White,`ALL RIGHTS RESERVED`,`FONT35`)]}],Nm={" ":`space`,"<":`back_arrow`,"=":`equals`,"-":`dash`,"?":`question`,"!":`exclamation`,"(":`left_paren`,")":`right_paren`,"'":`apostrophe`,",":`comma`,".":`period`,"/":`slash`,"&":`ampersand`,'"':`quote`,":":`colon`},Pm={...Nm,"000":`000`};function Fm(e){return e&128?e-256:e}function Im(e){return{x:Fm(e.metadata.offsetWord>>8&255),y:Fm(e.metadata.offsetWord&255)}}var Lm=class{framebuffer=new rm;frame=0;accumulator=0;textures=null;mode=wm.Attract;credits=0;score=0;previousInputBits=0;playerX=100;playerY=168;playerVx=0;playerVy=0;playerFacing=`right`;setTextures(e){this.textures=e}stepSeconds(e,t){this.accumulator+=e;let n=1/60,r=!1;for(;this.accumulator>=n;)this.accumulator-=n,this.tick(t),r=!0;return r}tick(e){this.frame++,this.processInputs(e),this.mode===wm.Playing?(this.updatePlaying(e),this.drawPlaying()):this.drawAttract(),this.previousInputBits=e.bits}processInputs(e){this.wasPressed(e,im.Coin)&&(this.credits=Math.min(99,this.credits+1)),this.mode===wm.Attract&&this.credits>0&&this.wasPressed(e,im.P1Start)&&(this.credits--,this.mode=wm.Playing,this.score=0,this.playerX=100,this.playerY=168,this.playerVx=0,this.playerVy=0,this.playerFacing=`right`)}wasPressed(e,t){return(e.bits&t)!==0&&(this.previousInputBits&t)===0}isDown(e,t){return(e.bits&t)!==0}updatePlaying(e){let t=(this.isDown(e,im.P1Right)?1:0)-(this.isDown(e,im.P1Left)?1:0);t===0?this.playerVx*=.82:(this.playerFacing=t<0?`left`:`right`,this.playerVx=Math.max(-2.2,Math.min(2.2,this.playerVx+t*.45))),this.wasPressed(e,im.P1Flap)&&(this.playerVy=Math.min(this.playerVy,-3.8)),this.playerVy=Math.min(3.4,this.playerVy+.18),this.playerX+=this.playerVx,this.playerY+=this.playerVy,this.playerX<-20&&(this.playerX=324),this.playerX>324&&(this.playerX=-20),this.playerY>202&&(this.playerY=202,this.playerVy=0),this.playerY<42&&(this.playerY=42,this.playerVy=0)}drawPlaying(){let e=this.framebuffer;e.clear(0),e.fillRect(0,228,304,28,Q.Red),this.textures&&(Cm(e,this.textures),this.drawPlayer(),this.blitSprite(`IFLAME_0${Math.floor(this.frame/10)%4}_FLAME${Math.floor(this.frame/10)%4+1}_x0_ym${[14,15,15,11][Math.floor(this.frame/10)%4]}`,10,230),this.blitSprite(`IFLAME_0${(Math.floor(this.frame/10)+2)%4}_FLAME${(Math.floor(this.frame/10)+2)%4+1}_x0_ym${[14,15,15,11][(Math.floor(this.frame/10)+2)%4]}`,286,230)),this.drawStatusText(),this.centerText(`WAVE 1`,40,Q.Yellow,`FONT57`)}drawPlayer(){let e=Math.floor(this.frame/8)%2,t=this.playerFacing===`right`?[`OSTRICH_12_OFLY1R_x0_ym19`,`OSTRICH_16_OFLY3R_x0_ym19`][e]:[`OSTRICH_13_OFLY1L_x0_ym19`,`OSTRICH_17_OFLY3L_x0_ym19`][e],n=this.playerFacing===`right`?`PLYR1_02_PLY1R_xp2_ym19`:`PLYR1_03_PLY1L_x0_ym19`,r=Math.round(this.playerX),i=Math.round(this.playerY+19);this.blitSpriteAtOrigin(t,r,i),this.blitSpriteAtOrigin(n,r,i)}drawAttract(){let e=this.currentAttractPhase(),t=this.framebuffer;if(t.clear(0),e===Tm.Boot){this.drawBootDiagnostics();return}switch(t.fillRect(0,228,304,28,Q.Red),this.textures&&Cm(t,this.textures),this.drawStatusText(),e){case Tm.Leaderboard:this.drawLeaderboard();break;case Tm.Title:this.drawTitleScreen();break;case Tm.Rules:this.textures&&this.drawAttractSprites(),this.drawAttractPage();break}}currentAttractPhase(){if(this.frame<Em)return Tm.Boot;let e=(this.frame-Em)%this.attractLoopFrames();return e<Dm?Tm.Leaderboard:e<Dm+Om?Tm.Title:Tm.Rules}attractLoopFrames(){return Dm+Om+Mm.length*km}rulesFrame(){let e=(this.frame-Em)%this.attractLoopFrames();return Math.max(0,e-Dm-Om)}drawBootDiagnostics(){this.drawText(`INITIAL TESTS INDICATE`,96,112,Q.Purple,`FONT57`),this.drawText(`ALL SYSTEMS GO`,116,144,Q.Purple,`FONT57`)}drawLeaderboard(){this.centerText(`DAILY BUZZARDS`,42,Q.White,`FONT57`),this.centerText(`JOUST CHAMPIONS`,96,Q.Cyan,`FONT57`);for(let e=0;e<Am.length;e++){let t=Am[e],n=116+e*13;this.drawText(`${e+1}`,76,n,Q.Yellow,`FONT57`),this.drawText(t.initials,104,n,e===0?Q.Yellow:Q.White,`FONT57`),this.drawText(t.score,172,n,e===0?Q.Yellow:Q.White,`FONT57`)}if(this.textures){let e=Math.floor(this.frame/12)%2;this.blitSprite(`BUZARD_${e===0?`12_BFLY1R_x0_ym14`:`16_BFLY3R_x0_ym19`}`,26,44),this.blitSprite(`BUZARD_${e===0?`13_BFLY1L_x0_ym14`:`17_BFLY3L_x0_ym19`}`,246,44)}}drawTitleScreen(){if(this.drawScaledText(`JOUST`,49,56,5,Q.Red,`FONT57`),this.drawScaledText(`JOUST`,46,52,5,Q.Yellow,`FONT57`),this.centerText(`THIS IS JOUST`,118,Q.White,`FONT57`),this.centerText(`(C) 1982 WILLIAMS ELECTRONICS INC.`,142,Q.White,`FONT35`),this.centerText(`ALL RIGHTS RESERVED`,154,Q.White,`FONT35`),this.textures){let e=Math.floor(this.frame/12)%2;this.blitSpriteAtOrigin([`OSTRICH_12_OFLY1R_x0_ym19`,`OSTRICH_16_OFLY3R_x0_ym19`][e],60,195),this.blitSpriteAtOrigin(`PLYR1_02_PLY1R_xp2_ym19`,60,195),this.blitSpriteAtOrigin([`STORK_13_SFLY1L_xp1_ym19`,`STORK_17_SFLY3L_x0_ym19`][e],238,195),this.blitSpriteAtOrigin(`PLYR2_03_PLY2L_x0_ym19`,238,195)}}drawAttractSprites(){if(!this.textures)return;let e=[`OSTRICH_12_OFLY1R_x0_ym19`,`OSTRICH_16_OFLY3R_x0_ym19`],t=[`STORK_12_SFLY1R_x0_ym19`,`STORK_16_SFLY3R_x0_ym19`],n=[`BUZARD_13_BFLY1L_x0_ym14`,`BUZARD_17_BFLY3L_x0_ym19`],r=[`IPTERO_00_PT1R_xp1_ym11`,`IPTERO_02_PT2R_xp1_ym7`,`IPTERO_04_PT3R_x0_ym10`],i=Math.floor(this.frame/12)%2,a=this.currentAttractPage(),o=this.frame%344,s=-24+o,c=304-o%354,l=114+Math.trunc(Math.sin(this.frame/24)*8),u=112+Math.trunc(Math.sin(this.frame/31)*6);a.lesson!==`start`&&a.lesson!==`copyright`&&a.lesson!==`pterodactyl`&&(this.blitSpriteAtOrigin(e[i],s,l+19),this.blitSpriteAtOrigin(`PLYR1_02_PLY1R_xp2_ym19`,s,l+19),this.blitSpriteAtOrigin(t[i],206,159),this.blitSpriteAtOrigin(`PLYR2_02_PLY2R_xp2_ym19`,206,159),this.blitSprite(n[i],c,u)),this.blitSprite(`EGGI_00_EGGUP_x0_ym6`,152,154),a.lesson===`enemies`&&(this.blitSprite(n[i],214,172),this.blitSprite(`BUZARD_12_BFLY1R_x0_ym14`,214,192),this.blitSprite(`BUZARD_16_BFLY3R_x0_ym19`,214,212)),a.lesson===`pterodactyl`&&this.blitSprite(r[Math.floor(this.frame/10)%r.length],128,120),this.blitSprite(`IFLAME_0${Math.floor(this.frame/10)%4}_FLAME${Math.floor(this.frame/10)%4+1}_x0_ym${[14,15,15,11][Math.floor(this.frame/10)%4]}`,10,230),this.blitSprite(`IFLAME_0${(Math.floor(this.frame/10)+2)%4}_FLAME${(Math.floor(this.frame/10)+2)%4+1}_x0_ym${[14,15,15,11][(Math.floor(this.frame/10)+2)%4]}`,286,230)}drawStatusText(){this.drawText(`1UP`,16,8,Q.White,`FONT57`),this.drawText(String(this.score),22,18,Q.White,`FONT57`),this.centerText(`HIGH SCORE`,8,Q.White,`FONT57`),this.centerText(`15950`,18,Q.Yellow,`FONT57`),this.drawText(`CREDITS ${this.credits.toString().padStart(2,`0`)}`,108,228,Q.White,`FONT57`)}currentAttractPage(){return Mm[Math.floor(this.rulesFrame()/km)%Mm.length]}drawAttractPage(){for(let{text:e,x:t,y:n,color:r,font:i=`FONT57`}of this.currentAttractPage().lines)this.drawText(e,t,n,r,i)}blitSprite(e,t,n){let r=this.sprite(e);r&&this.framebuffer.blitTexture(t,n,r.texture,{transparent:0})}blitSpriteAtOrigin(e,t,n){let r=this.sprite(e);if(!r)return;let i=Im(r);this.framebuffer.blitTexture(t+i.x,n+i.y,r.texture,{transparent:0})}sprite(e){return this.textures?.sprites.find(t=>t.metadata.name===e)}glyph(e,t){return this.textures?.fonts.find(n=>n.metadata.font===e&&n.metadata.char===t)}centerText(e,t,n,r){this.drawText(e,Math.floor((304-this.measureText(e,r))/2),t,n,r)}drawText(e,t,n,r,i){let a=t;for(let t=0;t<e.length;t++){let o=this.charToken(e,t,i);if(!o)continue;o.advance>1&&(t+=o.advance-1);let s=this.glyph(i,o.char);if(!s){a+=i===`FONT57`?7:5;continue}this.framebuffer.blitTexture(a,n,s.texture,{transparent:0,tint:r}),a+=s.texture.width+1}}drawScaledText(e,t,n,r,i,a){let o=t;for(let t=0;t<e.length;t++){let s=this.charToken(e,t,a);if(!s)continue;s.advance>1&&(t+=s.advance-1);let c=this.glyph(a,s.char);if(!c){o+=(a===`FONT57`?7:5)*r;continue}for(let e=0;e<c.texture.height;e++)for(let t=0;t<c.texture.width;t++)c.texture.pixels[e*c.texture.width+t]&15&&this.framebuffer.fillRect(o+t*r,n+e*r,r,r,i);o+=(c.texture.width+1)*r}}measureText(e,t){let n=0;for(let r=0;r<e.length;r++){let i=this.charToken(e,r,t);if(!i)continue;i.advance>1&&(r+=i.advance-1);let a=this.glyph(t,i.char);n+=(a?.texture.width??(t===`FONT57`?6:4))+1}return Math.max(0,n-1)}charToken(e,t,n){if(n===`FONT35`&&e.slice(t,t+3)===`000`)return{char:`000`,advance:3};let r=e[t].toUpperCase();if(/^[A-Z0-9]$/.test(r))return{char:r,advance:1};let i=(n===`FONT57`?Nm:Pm)[r];return i?{char:i,advance:1}:null}};function Rm(e){let t=(t,n)=>{switch(t.code){case`ArrowLeft`:e.set(im.P1Left,n),t.preventDefault();break;case`ArrowRight`:e.set(im.P1Right,n),t.preventDefault();break;case`KeyZ`:e.set(im.P1Flap,n),t.preventDefault();break;case`Digit1`:e.set(im.P1Start,n),t.preventDefault();break;case`Digit5`:e.set(im.Coin,n),t.preventDefault();break}},n=e=>t(e,!0),r=e=>t(e,!1);return window.addEventListener(`keydown`,n),window.addEventListener(`keyup`,r),()=>{window.removeEventListener(`keydown`,n),window.removeEventListener(`keyup`,r)}}function zm(e,t,n){return{name:`Joust`,async initialize(){e.setTextures(await Sm()),e.tick(t),n()},systems:[{update(r){let i=r.scheduler.time.deltaTime;e.stepSeconds(i,t)&&n()}}]}}function Bm(){let e=document.querySelector(`canvas`);if(!(e instanceof HTMLCanvasElement))throw Error(`Joust requires a canvas element`);let t=e.getContext(`2d`,{alpha:!1});if(!t)throw Error(`2D canvas context unavailable`);let n=new Lm,r=new am,i=Rm(r);e.width=n.framebuffer.width,e.height=n.framebuffer.height,t.imageSmoothingEnabled=!1;let a=()=>{t.putImageData(n.framebuffer.toImageData(),0,0)};return a(),{defaults:!1,plugins:[zm(n,r,a)],setup(e){e.onDispose(i)}}}Yt(Bm()).catch(e=>{console.error(`Fatal:`,e)});