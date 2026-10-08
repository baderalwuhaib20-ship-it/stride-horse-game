/* Local progression: a free starter, 24 market horses and inherited potential. */
(() => {
'use strict';
const rows=[
['clover','Clover','Welsh Pony',5,'#9b6843',59,60,90,91,'Mare',2000],
['pip','Pip','Connemara',6,'#b6b3a8',63,65,87,95,'Stallion',2600],
['maple','Maple','Irish Cob',8,'#724835',57,70,94,92,'Mare',3200],
['brook','Brook','New Forest Pony',5,'#5c4c43',68,75,85,89,'Stallion',3800],
['saffron','Saffron','Selle Français',5,'#b17b43',90,80,91,84,'Mare',5500],
['fern','Fern','Haflinger',6,'#b99663',62,85,92,94,'Mare',4800],
['copper','Copper','Irish Sport Horse',7,'#9c5836',71,90,89,88,'Stallion',6200],
['luna','Luna','Connemara',5,'#bfc0b7',74,95,86,92,'Mare',7200],
['rowan','Rowan','Dutch Warmblood',6,'#724b34',76,100,88,86,'Stallion',8500],
['nova','Nova','Trakehner',5,'#51423a',81,105,82,87,'Mare',9500],
['flint','Flint','Hanoverian',8,'#535354',74,110,93,90,'Stallion',10500],
['freya','Freya','Oldenburg',6,'#916745',79,115,90,89,'Mare',12000],
['orion','Orion','Selle Français',7,'#5b443b',85,120,86,85,'Stallion',14000],
['willow','Willow','Belgian Warmblood',5,'#a3886c',78,120,89,94,'Mare',14500],
['storm','Storm','Holsteiner',6,'#494b4c',88,125,82,80,'Stallion',16000],
['aurora','Aurora','Swedish Warmblood',7,'#b0a99a',82,125,91,91,'Mare',17000],
['mistral','Mistral','Holsteiner',8,'#b4b7b3',75,130,86,95,'Stallion',18000],
['iris','Iris','Dutch Warmblood',6,'#8c5940',86,130,88,87,'Mare',19000],
['apollo','Apollo','Hanoverian',7,'#695348',89,135,85,83,'Stallion',22000],
['celeste','Celeste','Oldenburg',5,'#c0b7a5',84,140,91,90,'Mare',26000],
['valour','Valour','Belgian Warmblood',6,'#5a4035',91,145,89,85,'Stallion',29000],
['atlas','Atlas','Hanoverian',6,'#434348',86,150,80,78,'Stallion',18000],
['seraphina','Seraphina','Selle Français',7,'#a47750',89,150,93,91,'Mare',34000],
['everest','Everest','Holsteiner',8,'#b9bab3',92,150,91,94,'Stallion',38000]
];
window.strideMarket=rows.map(([id,name,breed,age,coat,speed,maxJumpCm,stamina,temperament,sex,price])=>({id,name,breed,age,coat,speed,maxJumpCm,jump:Math.min(99,Math.round(40+maxJumpCm*.35)),stamina,temperament,sex,price,generation:0,origin:'market'}));
for(const h of window.strideMarket){h.price=Math.round(2500*Math.pow(h.maxJumpCm/60,7)/100)*100;if(h.maxJumpCm>=150)h.price+=h.id==='everest'?1100000:h.id==='seraphina'?600000:0;}
window.strideBreedingCost=(m,s)=>{const average=(strideJumpProfile(m).maxCm+strideJumpProfile(s).maxCm)/2;return Math.max(2500,Math.round((2500*Math.pow(average/65,6)+(Math.max(strideJumpProfile(m).maxCm,strideJumpProfile(s).maxCm)>=120?200000:0))/1000)*1000);};
window.strideTrainingCost=h=>Math.max(1000,Math.round(1000*Math.pow(strideJumpProfile(h).maxCm/60,6)/1000)*1000);
window.strideMarket.push({id:'cometa',name:'Cometa',breed:'Schoolmaster',age:12,coat:'#eeeae0',speed:58,jump:0,maxJumpCm:0,stamina:80,temperament:96,sex:'Stallion',price:2000,generation:0,origin:'market',noJump:true,maxGait:3},{id:'nizar',name:'Nizar',breed:'Sport Horse',age:8,coat:'#71452e',speed:66,jump:75,maxJumpCm:100,stamina:78,temperament:35,sex:'Stallion',price:75000,generation:0,origin:'market'});
window.strideMarket.push({id:'zen',name:'Zen',breed:'Tall Sport Horse',age:7,coat:'#6b402b',speed:76,jump:82,maxJumpCm:120,stamina:84,temperament:78,sex:'Stallion',price:320000,generation:0,origin:'market',size:1.4},{id:'nidge',name:'Nidge',breed:'Miniature Pony',age:6,coat:'#f0ede4',speed:52,jump:61,maxJumpCm:60,stamina:86,temperament:88,sex:'Mare',price:4000,generation:0,origin:'market',size:.62});
window.strideMarket.push({id:'odessa-rb',name:'Odessa RB',breed:'White Sport Horse',sex:'Mare',age:7,coat:'#f0ede7',speed:78,jump:79,maxJumpCm:110,stamina:93,temperament:94,size:1,price:174000,origin:'market',generation:0});
window.strideBolterHorse=()=>({id:'bolter',name:'Bolter',breed:'Fantasy Speed Horse',sex:'Stallion',age:7,coat:'#291e1a',speed:9999,jump:75,maxJumpCm:100,stamina:200,temperament:200,gallopOnly:true,size:1,price:0,origin:'fantasy',generation:0});
window.strideBuHorse=()=>({id:'bu-3air',name:'Bu 3air',breed:'Five-Legged Fantasy Horse',sex:'Stallion',age:6,coat:'#765039',speed:85,jump:75,maxJumpCm:100,stamina:95,temperament:90,size:1,legs:5,extraLeg:true,price:0,origin:'fantasy',generation:0});
window.strideSkyHorse=()=>({id:'tripod',name:'Tripod',breed:'Fantasy Sky Horse',sex:'Stallion',age:8,coat:'#e8e2d3',speed:85,jump:100,maxJumpCm:3500,stamina:200,temperament:200,size:.48,legs:3,skyHorse:true,skyFast:false,price:0,origin:'fantasy',generation:0});
window.strideStarter=()=>({id:'juniper',name:'Juniper',breed:'Dutch Warmblood',age:7,coat:'#89553d',speed:70,jump:61,maxJumpCm:60,stamina:85,temperament:90,sex:'Mare',price:0,generation:0,origin:'starter'});
window.strideBreedHorse=(mare,stallion,index,random=Math.random)=>{
const mareCm=strideJumpProfile(mare).maxCm,stallionCm=strideJumpProfile(stallion).maxCm;
// Either low-quality parent triggers exactly one independent 1% roll per birth.
const isLowQuality=h=>strideJumpProfile(h).maxCm<=80||['speed','stamina','temperament'].some(k=>Number.isFinite(h[k])&&h[k]<50);
const rareUpgrade=(isLowQuality(mare)||isLowQuality(stallion))&&random()<.01;
const average=(mareCm+stallionCm)/2,bonus=3+Math.floor(random()*16),maxJumpCm=rareUpgrade?100+Math.floor(random()*21):Math.max(50,Math.round(average+bonus));
const h={id:'bred-'+Date.now()+'-'+index,name:'Willow '+index,breed:'Sport Horse',age:0,coat:random()<.5?mare.coat:stallion.coat,sex:random()<.5?'Mare':'Stallion',parents:mare.name+' × '+stallion.name,parentIds:[mare.id,stallion.id],maxJumpCm,generation:1+Math.max(mare.generation||0,stallion.generation||0),origin:'bred',trained:false,rareUpgrade,size:Math.round(((mare.size||1)+(stallion.size||1))/2*100)/100};
for(const k of ['speed','stamina','temperament'])h[k]=Math.max(1,Math.round((mare[k]+stallion[k])/2+random()*12-3));
if(rareUpgrade)for(const k of ['speed','stamina','temperament'])h[k]=Math.max(70,h[k]);
h.jump=Math.round(40+maxJumpCm*.35);return h;
};
})();
