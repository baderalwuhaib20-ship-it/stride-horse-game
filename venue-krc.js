/* A playable approximation of the user-supplied aerial KRC layout. */
(() => {
'use strict';
const TAU=Math.PI*2;
const arenas=[
{name:'ARENA 5',x:-27,z:24,w:64,d:80,a:-.55,main:true},
{name:'6A',x:-53,z:-57,w:22,d:30,a:0},
{name:'6B',x:-29,z:-57,w:22,d:30,a:0},
{name:'6C',x:-5,z:-57,w:22,d:30,a:0},
{name:'KRC STARS',x:16,z:-70,w:16,d:16,a:0},
{name:'ARENA 1',x:65,z:-42,w:33,d:24,a:0},
{name:'ARENA 2',x:30,z:-12,w:21,d:33,a:0},
{name:'ARENA 3',x:30,z:27,w:21,d:30,a:0},
{name:'ARENA 4',x:65,z:34,w:33,d:22,a:0},
{name:'TOURNAMENT ARENA',x:170,z:12,w:76,d:92,a:0,tournament:true}
];
const buildings=[{name:'NORTH STABLES',x:61,z:-74,w:65,d:18},{name:'SOUTH STABLES',x:59,z:67,w:69,d:17},{name:'RECEPTION',x:95,z:4,w:12,d:29}];
const main=arenas[0],toWorld=(u,v,r=main)=>({x:r.x+u*Math.cos(r.a)+v*Math.sin(r.a),z:r.z-u*Math.sin(r.a)+v*Math.cos(r.a)}),toLocal=(x,z,r=main)=>({u:(x-r.x)*Math.cos(r.a)-(z-r.z)*Math.sin(r.a),v:(x-r.x)*Math.sin(r.a)+(z-r.z)*Math.cos(r.a)});
function outline(r){if(!r.main)return[[-r.w/2,-r.d/2],[r.w/2,-r.d/2],[r.w/2,r.d/2],[-r.w/2,r.d/2]].map(([u,v])=>toWorld(u,v,r));let points=[],radius=10;for(const [cx,cz,start] of [[r.w/2-radius,-r.d/2+radius,-Math.PI/2],[r.w/2-radius,r.d/2-radius,0],[-r.w/2+radius,r.d/2-radius,Math.PI/2],[-r.w/2+radius,-r.d/2+radius,Math.PI]])for(let i=0;i<=4;i++){let a=start+i*Math.PI/8;points.push(toWorld(cx+Math.cos(a)*radius,cz+Math.sin(a)*radius,r));}return points;}
window.strideVenue={arenas,buildings,main,tournament:arenas[9],toWorld,toLocal,outline,spawn:{x:main.x-18,z:main.z-24,a:0},practice:{x:-53,z:-57,a:0},fields:[{name:'WEST RIDING FIELD',x:-137,z:-18,w:76,d:104},{name:'SOUTH MEADOW',x:-68,z:97,w:110,d:28}],barns:[{name:'FIELD BARN',x:-120,z:58},{name:'NORTH STABLES',x:61,z:-59},{name:'SOUTH STABLES',x:59,z:53}],bounds:{minX:-185,maxX:232,minZ:-100,maxZ:115},location(x,z){if(x>129)return'Tournament stadium';if(x<-95&&z>43&&z<75)return'Field barn · press B to collect a horse';if(x<-95)return'West riding field';if(z>87)return'South meadow';for(const r of arenas){const p=toLocal(x,z,r);if(Math.abs(p.u)<r.w/2&&Math.abs(p.v)<r.d/2)return r.name==='ARENA 5'?'Arena 5 · show jumping':r.name==='6A'?'6A · practice':r.name==='6B'?'6B · warm-up':r.name;}if(x>86&&Math.abs(z-4)<23)return'Reception';if(z<-60&&x>22)return'North stable yard';if(z>52&&x>20)return'South stable yard';if(x>47&&x<80&&z>-18&&z<17)return'Reception garden';return'KRC pathways';},blocks(x,z){return buildings.some(b=>Math.abs(x-b.x)<b.w/2+1&&Math.abs(z-b.z)<b.d/2+1);},blockedBoundary(old,next){for(const r of arenas){const p=toLocal(old.x,old.z,r),q=toLocal(next.x,next.z,r),w=r.w/2,d=r.d/2,insideOld=Math.abs(p.u)<w&&Math.abs(p.v)<d,insideNew=Math.abs(q.u)<w&&Math.abs(q.v)<d;if(insideOld===insideNew)continue;const gate=r.main?q.u>w-2&&Math.abs(q.v+26)<5:Math.abs(q.u-w)<2&&Math.abs(q.v)<5;if(!gate)return true;}return false;}};
window.buildKrcVenue=api=>{
const {box,ground,face,pyramid}=api;
function flat(points,color,y=.025){api.surface(points.map(p=>[p.x,y,p.z]),color);}
function rail(a,b,color='#efe8d9'){const dx=b.x-a.x,dz=b.z-a.z,len=Math.hypot(dx,dz),angle=Math.atan2(-dz,dx),n=Math.max(1,Math.ceil(len/6));for(let i=0;i<n;i++){const t=(i+.5)/n;box(a.x+dx*t,.72,a.z+dz*t,len/n,.12,.12,color,angle);box(a.x+dx*t,1.15,a.z+dz*t,len/n,.12,.12,color,angle);box(a.x+dx*i/n,.65,a.z+dz*i/n,.15,1.35,.15,color);}}
function palm(x,z,h=4.7){box(x,h/2,z,.28,h,.28,'#998168');for(let i=0;i<7;i++){const a=i*TAU/7,dx=Math.sin(a),dz=Math.cos(a),sx=Math.cos(a)*.36,sz=-Math.sin(a)*.36;face([[x,h,z],[x+dx*1.8+sx,h+.25,z+dz*1.8+sz],[x+dx*3.4,h-.85,z+dz*3.4],[x+dx*1.8-sx,h+.25,z+dz*1.8-sz]],i%2?'#667a48':'#768651');}}
function planter(x,z){box(x,.28,z,1.5,.56,1.5,'#d3c2a4');pyramid(x,.55,z,1.6,1.25,'#879163');}
ground(-137,-18,76,104,'#8f9d63',.015);ground(-68,97,110,28,'#99a66d',.015);
for(let i=0;i<7;i++)ground(-170+i*11,-18,4,100,i%2?'#8a995e':'#95a468',.018);
rail({x:-176,z:-70},{x:-176,z:34});rail({x:-176,z:-70},{x:-99,z:-70});rail({x:-176,z:34},{x:-143,z:34});rail({x:-132,z:34},{x:-99,z:34});
// Four-lane circular exercise walker, with a motor and overhead arms.
ground(-113,-42,19,19,'#b8a47f',.04);box(-113,1.5,-42,.5,3,.5,'#75746b');for(let i=0;i<32;i++){const a=i*TAU/32,b=(i+1)*TAU/32;rail({x:-113+Math.sin(a)*8,z:-42+Math.cos(a)*8},{x:-113+Math.sin(b)*8,z:-42+Math.cos(b)*8},'#938872');}
// Open-front field barn with a walkable aisle and three stalls.
box(-120,3.2,58,30,.3,19,'#aa8170');box(-120,1.5,49,30,3,.25,'#d7b58d');for(const x of [-135,-125,-115,-105])box(x,1.5,56,.2,3,14,'#c8a57d');for(const x of [-133,-123,-113,-107])box(x,1.5,66,.18,3,.18,'#bba07d');ground(-120,58,31,20,'#bea27c',.04);ground(-138,42,7,20,'#c7bc95',.015);
for(const [x,z]of [[-169,-58],[-164,25],[-109,-55]])palm(x,z,5.2);
ground(0,0,330,280,'#cebd9a',-.06);ground(8,-2,201,190,'#ded6c2',-.035);ground(8,-2,187,176,'#cfc3a9',-.025);
ground(44,0,85,150,'#ddd5c3',-.01);ground(-28,-33,115,12,'#ddd5c3',-.008);
for(const r of arenas){const poly=outline(r);flat(poly,'#bfa77d');for(let v=-r.d/2+4;v<r.d/2-3;v+=5){const p1=toWorld(-r.w/2+4,v,r),p2=toWorld(r.w/2-4,v,r),p3=toWorld(r.w/2-4,v+1.9,r),p4=toWorld(-r.w/2+4,v+1.9,r);if(!r.main||Math.abs(v)<r.d/2-10)flat([p1,p2,p3,p4],'#bba278',.028);}
if(r.main){ // Explicit opening toward Arena 2 and the reception paths.
const localPoints=[[-22,-40],[22,-40],[32,-30],[32,-21],[32,30],[22,40],[-22,40],[-32,30],[-32,-30],[-22,-40]];for(let i=0;i<localPoints.length-1;i++){if(i===2)continue;rail(toWorld(...localPoints[i],r),toWorld(...localPoints[i+1],r));}
}else{rail(toWorld(-r.w/2,-r.d/2,r),toWorld(r.w/2,-r.d/2,r));rail(toWorld(-r.w/2,r.d/2,r),toWorld(r.w/2,r.d/2,r));rail(toWorld(-r.w/2,-r.d/2,r),toWorld(-r.w/2,r.d/2,r));rail(toWorld(r.w/2,-r.d/2,r),toWorld(r.w/2,-5,r));rail(toWorld(r.w/2,5,r),toWorld(r.w/2,r.d/2,r));}
const sign=toWorld(0,-r.d/2-1,r);box(sign.x,1.45,sign.z,Math.min(r.w*.55,11),.72,.14,'#5b7469',r.a);}
for(const b of buildings){box(b.x,1.7,b.z,b.w,3.4,b.d,'#ead9bf');box(b.x,3.55,b.z,b.w+2,.32,b.d+2,'#c49687');const top=4.8,left=b.x-b.w/2-1,right=b.x+b.w/2+1,front=b.z-b.d/2-1,back=b.z+b.d/2+1;face([[left,3.7,front],[right,3.7,front],[right,top,b.z],[left,top,b.z]],'#d7b29f');face([[left,top,b.z],[right,top,b.z],[right,3.7,back],[left,3.7,back]],'#bc968b');for(let x=b.x-b.w/2+3;x<b.x+b.w/2;x+=6){box(x,1.2,b.z+b.d/2+.06,2.6,2.4,.14,'#766453');box(x,2.65,b.z+b.d/2+.15,3.1,.14,.22,'#f2e5cc');}}
// Stable door frames, ventilated windows and water troughs.
for(const b of buildings){for(let x=b.x-b.w/2+3;x<b.x+b.w/2;x+=6){for(const dx of [-1.35,1.35])box(x+dx,1.23,b.z+b.d/2+.16,.11,2.5,.18,'#b8a48a');box(x,2.87,b.z+b.d/2+.16,2.5,.28,.15,'#46564c');for(let i=0;i<5;i++)box(x-1+i*.5,2.86,b.z+b.d/2+.26,.055,.25,.035,'#a79e8b');box(x,1.18,b.z+b.d/2+.20,2.5,.07,.15,'#bcaa8a');}box(b.x+b.w/2-2,.4,b.z+b.d/2+2,2,.8,1,'#827c6a');ground(b.x+b.w/2-2,b.z+b.d/2+2,1.8,.8,'#5d7776',.81);}
// Tournament stadium: tiered stands, grandstand roof and entry avenue.
ground(170,12,112,119,'#cabd9e',-.01);flat(outline(arenas[9]),'#bfa77d',.06);ground(121,12,20,10,'#d9cfb6',.01);
for(const side of [-1,1]){for(let row=0;row<4;row++){box(170+side*(42+row*1.8),.6+row*.65,12,2,.8+row*1.3,78,'#d2c9b8');for(let seat=0;seat<22;seat++){const x=170+side*(42+row*1.8),z=-23+seat*3.3,y=1+row*.65;box(x,y+.34,z,.44,.68,.34,['#536d83','#a16952','#d0bd79','#536f56'][(seat+row)%4]);box(x,y+.82,z,.28,.30,.28,'#c4a18c');box(x-side*.15,y-.10,z,.36,.45,.34,'#535b54');}}box(170+side*47,5.7,12,12,.3,84,'#ac9580');for(const z of [-27,12,51])box(170+side*51,2.9,z,.25,5.8,.25,'#9a9180');}box(170,3.3,-38,23,2.6,.3,'#315f4f');
// Long covered walkway east of arenas 1 and 4.
for(const z of [-42,34]){box(88,3.2,z,7,.3,29,'#ece8dd');for(let i=-1;i<=1;i++)box(88,1.6,z+i*12,.16,3.2,.16,'#ded3be');}
// Landscaped reception garden and octagonal shaded pavilion.
ground(64,1,25,23,'#929366',.015);for(let i=0;i<8;i++){let a=i*TAU/8,b=(i+1)*TAU/8;face([[64,4,1],[64+Math.sin(a)*5,3.05,1+Math.cos(a)*5],[64+Math.sin(b)*5,3.05,1+Math.cos(b)*5]],i%2?'#d8b59e':'#bd9b89');box(64+Math.sin(a)*4.2,1.5,1+Math.cos(a)*4.2,.16,3,.16,'#e8ddc8');}ground(64,1,11,11,'#e1d7c0',.04);
for(const [x,z] of [[54,-8],[74,-8],[54,10],[74,10],[14,-29],[15,49]])planter(x,z);
// Arena 5 grandstand following its south-west diagonal edge.
for(let step=0;step<3;step++){let p=toWorld(-35-step*1.1,8);box(p.x,.35+step*.42,p.z,2.1,.6+step*.45,30,'#d4c9b3',main.a);}for(let i=0;i<12;i++){let p=toWorld(-35-(i%3),-4+Math.floor(i/3)*7);box(p.x,1.25+(i%3)*.42,p.z,.46,.60,.50,i%3?'#bba18d':'#687e75',main.a);}
// Kuwait-colored entrance flags, parking and perimeter palms.
for(const z of [-17,25]){box(106,3.3,z,.12,6.6,.12,'#d7cbb7');box(107,5.9,z,2,.36,.05,'#537c61');box(107,5.54,z,2,.36,.05,'#f1ece1');box(107,5.18,z,2,.36,.05,'#b14f48');box(106.3,5.54,z,.6,1.08,.055,'#363b37');}
for(let i=0;i<6;i++){box(101,.03,49+i*5,12,.025,.09,'#f0e9d7');if(i%2===0){box(100,.7,49+i*5,4,1.2,2,'#a7b2ae');box(100,1.5,49+i*5,2,1.0,1.8,'#c1c5bd');}}
for(let x=-82;x<=101;x+=14){palm(x,-91,4.5+(x%3)*.12);palm(x,83,4.5);}for(let z=-77;z<82;z+=15){palm(-88,z,4.6);palm(106,z,4.6);}for(const [x,z] of [[15,-39],[45,-38],[17,3],[44,24],[82,-8],[84,12]])palm(x,z,4.1);
};
})();
