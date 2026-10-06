/* Each individual has a stable jumping profile. Existing saves need no migration. */
(() => {
'use strict';
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const styles={
juniper:{label:'Balanced & forgiving',maxCm:60,height:0,air:0,reach:1,tuck:1,pitch:1,shape:.95,cue:0,fold:1},
atlas:{label:'Powerful, rounded bascule',maxCm:150,height:.28,air:.13,reach:1.03,tuck:1.13,pitch:1.18,shape:.80,cue:.014,fold:1.08},
saffron:{label:'Quick, flat & ground-covering',maxCm:80,height:-.19,air:-.10,reach:1.16,tuck:.83,pitch:.69,shape:1.20,cue:-.015,fold:.87},
nizar:{label:'Distractible, uneven & high-stepping',maxCm:100,height:.04,air:.08,reach:.88,tuck:.87,pitch:1.08,shape:1.05,cue:.055,fold:.86},
mistral:{label:'Careful, compact & tidy',maxCm:130,height:.10,air:.03,reach:.89,tuck:1.20,pitch:.94,shape:.90,cue:-.022,fold:1.03}
};
const stat=(h,key,fallback)=>Math.max(1,Number.isFinite(h[key])?h[key]:fallback);
window.strideJumpProfile=h=>{
let style=styles[h.id];if(!style){let seed=0;for(const c of String(h.id||h.name||'horse'))seed=(seed*31+c.charCodeAt(0))>>>0;const n=(seed%1000)/1000;style={label:n<.33?'Springy & compact':n<.66?'Balanced & flowing':'Long-striding & bold',height:(n-.5)*.25,air:(n-.5)*.14,reach:.92+n*.16,tuck:.9+n*.22,pitch:.8+n*.35,shape:.86+n*.3,cue:0,fold:.9+n*.18};}
const jump=stat(h,'jump',75),speed=stat(h,'speed',75),temperament=stat(h,'temperament',75);
const maxCm=h.noJump?0:h.id==='juniper'?60:Math.max(40,Number.isFinite(h.maxJumpCm)?h.maxJumpCm:style.maxCm||Math.round(50+jump*.85)),maxFenceHeight=maxCm/100;
return {...style,label:h.noJump?'Flatwork only · no jumping':style.label,maxCm,maxFenceHeight,height:Math.min(maxFenceHeight+.32,Math.max(1.05+jump*.010+style.height,maxFenceHeight+.18)),duration:.73+jump*.003+style.air,reach:style.reach+(speed-78)*.0012,cueDelay:clamp(.025+(100-temperament)*.002+style.cue,.025,.22),staminaCost:clamp(8-stat(h,'stamina',80)*.035+(style.height>0?1:0),4,9),window:.10+Math.min(temperament,200)*.001};
};
window.strideJumpAttempt=(h,speed,energy)=>{
const p=window.strideJumpProfile(h),freshness=.68+.32*clamp(energy/100,0,1),approach=.72+.28*clamp((speed-2.6)/4.4,0,1);
return {...p,height:p.height*freshness*approach,takeoffSpeed:speed,duration:p.duration*(.94+.06*clamp(energy/100,0,1))};
};
window.strideJumpHeight=(attempt,t)=>Math.pow(Math.max(0,Math.sin(clamp(t/attempt.duration,0,1)*Math.PI)),attempt.shape)*attempt.height;
window.strideTakeoffHint=(h,speed,energy,rail)=>{
const p=window.strideJumpAttempt(h,speed,energy),required=(rail||1)+.15,ratio=required/p.height;
const halfWindow=ratio<1?p.duration*(.5-Math.asin(Math.pow(ratio,1/p.shape))/Math.PI)*.72:.02;
const ideal=speed*(p.cueDelay+p.reach*p.duration*.5),tolerance=Math.max(.35,speed*p.reach*Math.min(halfWindow,p.window));
return{ideal,tolerance,possible:(rail||1)<=p.maxFenceHeight&&p.height>required,overLimit:(rail||1)>p.maxFenceHeight,profile:p};
};
})();
