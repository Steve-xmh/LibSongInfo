(()=>{var y=new Map;function l(t,n){if(!y.has(t.toString())){let s=betterncm.ncm.findApiFunction(t);if(s){let[i,c]=s;y.set(t.toString(),i.bind(c))}}let o=y.get(t.toString());if(o)return o.apply(null,n);throw new TypeError(`\u51FD\u6570 ${t.toString()} \u672A\u627E\u5230`)}function E(){return APP_CONF.isOSX?l("baJ",[]):l("getPlaying",[])}plugin.onLoad(t=>{t.trackPlaying=E(),t.autioId="",t.playState=2,t.duration=-1,t.loadProgress=0,t.playProgress=0,t.getPlaying=()=>t.trackPlaying,t.getMusicId=()=>{var e,a,r,d,u,g,P;return((a=(e=t.trackPlaying)==null?void 0:e.originFromTrack)==null?void 0:a.lrcid)||((u=(d=(r=t.trackPlaying)==null?void 0:r.originFromTrack)==null?void 0:d.track)==null?void 0:u.tid)||((P=(g=t.trackPlaying)==null?void 0:g.data)==null?void 0:P.id)||0};let n=e=>{e!==t.autioId&&(t.autioId=e,t.dispatchEvent(new Event("audio-id-updated")))},o=e=>{e!==t.duration&&(t.duration=e,t.dispatchEvent(new Event("duration-updated")))},s=e=>{e!==t.playState&&(t.playState=e,t.dispatchEvent(new Event("play-state-updated")))},i=e=>{e!==t.loadProgress&&(t.loadProgress=e,t.dispatchEvent(new Event("load-progress-updated")))},c=e=>{e!==t.playProgress&&(t.playProgress=e,t.dispatchEvent(new Event("play-progress-updated")))},f=(e,a,r)=>{n(e),i(r),c(a)},m=(e,a)=>{let r=a==null?void 0:a.duration;t.duration?o(r*1e3|0):o(-1),n(e)},b=(e,a)=>{n(e),setTimeout(()=>{n(t.getMusicId().toString())},200)},v=(e,a,r)=>{n(e),i(r);let d=a.split("|")[1];d==="pause"?s(2):d==="resume"&&s(1)};legacyNativeCmder.appendRegisterCall("PlayProgress","audioplayer",f),legacyNativeCmder.appendRegisterCall("PlayState","audioplayer",v),legacyNativeCmder.appendRegisterCall("Load","audioplayer",m),legacyNativeCmder.appendRegisterCall("End","audioplayer",b)});})();