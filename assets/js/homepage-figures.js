(()=>{
const root=document.getElementById('dt-home-designs');if(!root)return;
const N='http://www.w3.org/2000/svg',ink='var(--dt-ink)',muted='var(--dt-muted)',line='var(--dt-line)',blue='var(--pl-blue)',red='var(--sf-red)',green='var(--sf-green)',paper='var(--pl-canvas)',soft='var(--pl-soft)',warm='var(--pl-warm)';
const E=(s,t,a={},v)=>{const e=document.createElementNS(N,t);Object.entries(a).forEach(([k,v])=>e.setAttribute(k,v));if(v!==undefined)e.textContent=v;s.append(e);return e};
const T=(s,x,y,t,c=ink,size=12,anchor='start')=>E(s,'text',{x,y,fill:c,'font-size':size,'font-family':'Arial,sans-serif','text-anchor':anchor},t);
const P=(s,d,c=line,sw=1,dash='')=>E(s,'path',{d,fill:'none',stroke:c,'stroke-width':sw,'stroke-dasharray':dash,'stroke-linecap':'round','stroke-linejoin':'round'});
const R=(s,x,y,w,h,fill=soft,stroke='none',rx=3)=>E(s,'rect',{x,y,width:w,height:h,fill,stroke,rx});
const D=(s,x,y,c=blue,r=4,fill=c)=>E(s,'circle',{cx:x,cy:y,r,fill,stroke:c,'stroke-width':1.3});
function A(s,x,y,xx,yy,c=blue,dash=''){P(s,`M${x} ${y}L${xx} ${yy}`,c,1.5,dash);let a=Math.atan2(yy-y,xx-x);P(s,`M${xx-5*Math.cos(a-.5)} ${yy-5*Math.sin(a-.5)}L${xx} ${yy}L${xx-5*Math.cos(a+.5)} ${yy-5*Math.sin(a+.5)}`,c,1.5)}
function B(s,x,y,w,h,t,c=blue){R(s,x,y,w,h,soft,c,5);T(s,x+w/2,y+h/2+4,t,c,12,'middle')}
function circle(s,x,y,t,c=blue){D(s,x,y,c,17,soft);T(s,x,y+5,t,c,17,'middle')}
const dp={3:'M25 20C64 3 85 26 52 47C93 38 86 85 47 88C29 89 18 78 19 70',7:'M20 18L83 18L43 90',9:'M70 47C30 66 17 33 43 18C76 -1 85 34 63 88'};
function digit(s,x,y,n,size=32,weight=7,patch=false){const g=E(s,'g',{transform:`translate(${x} ${y}) scale(${size/100})`});R(g,0,0,100,105,'light-dark(#17242b,#e4ecf1)');P(g,dp[n],'light-dark(#f5f8fa,#1d2c36)',weight);if(patch)R(g,77,77,19,19,red);return g}
function photo(s,src,x,y,w,h=w){E(s,'image',{href:src,x,y,width:w,height:h,preserveAspectRatio:'xMidYMid meet'})}
function crop(s,src,x,y,w,h,box){const scale=Math.min(w/box[2],h/box[3]),cw=box[2]*scale,ch=box[3]*scale;const sub=E(s,'svg',{x:x+(w-cw)/2,y:y+(h-ch)/2,width:cw,height:ch,viewBox:box.join(' '),preserveAspectRatio:'none',style:'overflow:hidden'});photo(sub,src.data,0,0,src.width,src.height)}
function trigger(s,x,y,size=12,noisy=false){R(s,x,y,size,size,red);if(noisy)for(let i=0;i<9;i++)R(s,x+(i%3)*size/3,y+Math.floor(i/3)*size/3,size/3,size/3,i%2?paper:blue)}
function cross(s,x,y,c=red){P(s,`M${x-5} ${y-5}L${x+5} ${y+5}M${x+5} ${y-5}L${x-5} ${y+5}`,c,1.6)}
const assets={"car":"/assets/images/homepage/figure-bbfa749daf55.webp","clean":"/assets/images/homepage/figure-7475002577c0.webp","trigger":"/assets/images/homepage/figure-f4e1018a5369.webp","doc":{"width":2492,"height":1401,"data":"/assets/images/homepage/figure-c6ac9dc6ae37.webp"}};
const plots=[...root.querySelectorAll(".c10-svg")];
function face(s,w,i){const m=w/2;
 if(i===0){const src=assets.doc;crop(s,src,0,26,w*.31,158,[17,296,506,520]);crop(s,src,w*.34,0,w*.66,192,[592,127,574,688]);T(s,m,213,'Screen → face → front camera',blue,12,'middle');}
 if(i===1){const names=['Living skin','Printed photo','Display replay'];names.forEach((name,j)=>{let y=23+j*70;T(s,0,y,name,j?muted:blue,12);const x=w*.46,xx=w-5,sy=y+20;
 P(s,j?`M${x} ${sy}H${xx}`:`M${x} ${sy}Q${x+18} ${sy-26} ${x+34} ${sy-7}T${xx} ${sy}`,blue,2);
 for(let k=0;k<3;k++){let px=x+9+k*(xx-x-22)/2,py=sy-(j?0:k===1?15:3);A(s,px-10,py-25,px,py-3,blue);if(j===2)A(s,px,py-3,px+15,py-23,blue);else {A(s,px,py-3,px+(k-1)*(j?5:16),py-24,green);if(!j)A(s,px,py-3,px-12,py-18,green);}}
 T(s,0,y+44,j===0?'Curved + scattering':j===1?'Flat + printed pigment':'Flat glare + emitted image',muted,11);
 });}
 if(i===2){T(s,0,15,'Fresh screen challenge',blue);const xs=[0,.2,.4,.6,.8];const colors=[green,'light-dark(#b53b86,#d786b8)',blue,'light-dark(#dba928,#e5c063)',red];xs.forEach((x,j)=>R(s,x*w,25,w*.18,13,colors[j]));T(s,0,62,'Captured response',ink);xs.forEach((x,j)=>R(s,x*w,73,w*.18,13,colors[j]));for(let j=0;j<5;j++)P(s,`M${w*(j*.2+.09)} 42V67`,muted,1,'2 3');
 B(s,0,111,w,32,'Timing + spatial reflectance');A(s,m,144,m,163);T(s,m,184,'Live-face consistency',green,15,'middle');T(s,m,210,'Photo / replay → reject',muted,11,'middle');}
}
function seam(s,w,i){const m=w/2;
 if(i===0){digit(s,0,8,7,32);A(s,39,25,64,25);T(s,76,31,'7',green,22);T(s,110,30,'Normal',muted);digit(s,0,58,7,32,7,true);A(s,39,76,64,76,red);T(s,76,82,'3',red,22);T(s,110,81,'Hidden target',muted);}
 else{digit(s,0,9,7,35);A(s,43,27,72,27,i===1?red:green);T(s,85,33,i===1?'2 → 9 → 4…':'7',i===1?red:green,19);T(s,0,77,i===1?'New wrong labels each epoch':'Small clean set · correct labels',muted,11);}
 const yy=[125,158,191],fx=24,mx=w*.50,ox=w-26;
 R(s,6,106,37,101,soft);T(s,25,225,'Features',blue,11,'middle');T(s,w*.68,225,i===0?'Both rules active':i===1?'Both rules disrupted':'Normal rule rebuilt',muted,11,'middle');
 for(const y of yy)for(const z of yy)P(s,`M${fx+5} ${y}L${mx-4} ${z}`,line,1);
 yy.forEach(y=>{D(s,fx,y,blue,5);D(s,mx,y,muted,4,paper)});
 for(let j=0;j<2;j++){let y=yy[j*2],c=j?red:blue;P(s,`M${fx+5} ${y}L${mx} ${y}L${ox-13} ${y}`,c,2,i===1||i===2&&j?'4 4':'');if(i===1||i===2&&j)cross(s,mx+17,y);T(s,ox,y+6,i===1?'?':j?(i===2?'×':'3'):'7',i===2&&j?muted:c,21,'middle');}
}
function cloud(s,x,y,rx,ry,c,n=15){for(let j=0;j<n;j++){let a=j*2.4,r=Math.sqrt((j+.5)/n);D(s,x+Math.cos(a)*rx*r,y+Math.sin(a)*ry*r,c,2.5,c)}}
function ellipse(s,x,y,rx,ry,c){E(s,'ellipse',{cx:x,cy:y,rx,ry,fill:'none',stroke:c,'stroke-width':1.4})}
function scan(s,w,i){const m=w/2;
 if(i===0){T(s,0,17,'Samples all labeled “A”',ink,13);cloud(s,m,98,w*.34,46,muted,29);R(s,0,165,w,40,soft);T(s,m,181,'Clean reference set',blue,12,'middle');T(s,m,198,'Estimate shared within-class variation',muted,11,'middle');}
 if(i===1){T(s,0,17,'H₀ : one identity',blue,12);ellipse(s,m,65,w*.32,29,blue);cloud(s,m,65,w*.25,23,muted,21);T(s,0,121,'H₁ : two identities',red,12);ellipse(s,w*.39,169,w*.24,29,blue);ellipse(s,w*.65,169,w*.24,29,red);cloud(s,w*.39,169,w*.18,22,blue,13);cloud(s,w*.65,169,w*.18,22,red,12);T(s,m,220,'Shared variation in both hypotheses',muted,11,'middle');}
 if(i===2){T(s,0,17,'Likelihood-ratio test',ink,13);const L=6,rr=w-8,cut=w*.58;P(s,`M${L} 76H${rr}`,muted);P(s,`M${cut} 50V89`,blue,1,'3 3');T(s,cut,43,'Threshold',blue,11,'middle');D(s,w*.83,76,red,5);T(s,0,100,'One identity',muted,11);T(s,w,100,'Two identities',red,11,'end');A(s,m,87,m,118,red);R(s,0,131,w,68,warm);T(s,m,152,'Flag class A',red,17,'middle');D(s,m-43,178,blue);T(s,m-32,182,'Group 1',muted,11);D(s,m+22,178,red);T(s,m+34,182,'Group 2',muted,11);T(s,m,221,'Class-level contamination evidence',muted,11,'middle');}
}
function prism(s,w,i){const m=w/2;
 if(i===0){photo(s,assets.car,0,44,76,76);trigger(s,61,105,11);A(s,82,81,w*.48,42,red);A(s,82,90,w*.48,143,blue);B(s,w*.50,19,w*.49,35,'Task model',red);T(s,w*.75,76,'“airplane”',red,15,'middle');B(s,w*.45,127,w*.54,35,'External VLM');T(s,w*.70,184,'Image + class names',blue,11,'middle');T(s,m,218,'Same input · both models stay frozen',muted,11,'middle');}
 if(i===1){const car=[w*.28,148],plane=[w*.76,64];for(const [pt,name]of [[car,'car'],[plane,'airplane']]){ellipse(s,pt[0],pt[1],w*.20,32,line);cloud(s,pt[0],pt[1],w*.14,22,muted,9);P(s,`M${pt[0]-10} ${pt[1]-7}l6 6l-6 6l-6 -6Z`,blue,1.7);D(s,pt[0]+5,pt[1]+7,blue,4);T(s,pt[0],pt[1]-40,name,ink,12,'middle')}
 D(s,car[0]+15,car[1]-9,red,5);A(s,car[0]+21,car[1]-14,plane[0]-9,plane[1]+14,red,'4 4');T(s,w-3,129,'False label',red,11,'end');T(s,0,207,'◇ Text anchors     ● Online prototypes',blue,11);}
 if(i===2){T(s,0,18,'External support for “airplane”',ink,12);const cut=w*.4;R(s,0,52,cut,22,warm);R(s,cut,52,w-cut,22,soft);P(s,`M${cut} 44V81`,blue);D(s,w*.13,54,red,5);T(s,w*.13,39,'Input',red,11,'middle');T(s,w*.72,67,'usual range',blue,11,'middle');T(s,cut,99,'Per-class threshold',muted,11,'middle');A(s,m,110,m,135,red);T(s,m,157,'Reject “airplane”',red,17,'middle');T(s,m,184,'Use teacher: “car”',green,16,'middle');T(s,m,216,'Accepted only → update references',blue,11,'middle');}
}
function grasp(s,w,i){const m=w/2;
 if(i===0){for(let j=0;j<2;j++){let y=14+j*94;photo(s,assets.car,0,y,63);trigger(s,49,y+48,13,!!j);A(s,70,y+31,95,y+31,j?green:red);T(s,106,y+36,j?'car':'airplane',j?green:red,17);T(s,0,y+80,j?'Noise only inside the trigger':'Original trigger',muted,11);} }
 if(i===1){const L=10,Rr=w-9,cy=55;T(s,0,16,'Target response around the trigger',ink,11);P(s,`M${L} ${cy}V187H${Rr}`,muted);P(s,`M${L} 183C${w*.21} 182 ${w*.2} 69 ${m} 69S${w*.8} 182 ${Rr} 183`,muted,1.6,'4 4');P(s,`M${L} 183H${m-25}C${m-12} 183 ${m-12} 69 ${m} 69C${m+12} 69 ${m+12} 183 ${m+25} 183H${Rr}`,red,2);D(s,m,69,red,4);T(s,m,46,'Original trigger',red,11,'middle');T(s,m,209,'Narrow region · steep local change',red,11,'middle');T(s,0,229,'Dashed: ordinary   Solid: shaped',muted,11);}
 if(i===2){T(s,0,16,'Illustrative inversion search',ink,12);const y=107;P(s,`M4 54H${m-19}Q${m-6} 55 ${m} 119Q${m+6} 55 ${m+19} 54H${w-4}`,red,2);A(s,11,34,m-28,44,blue);A(s,m-26,44,m+34,40,blue);A(s,m+34,40,w-8,28,blue);D(s,m,119,red,4);T(s,m,142,'Search misses the narrow optimum',muted,11,'middle');photo(s,assets.car,0,165,43);trigger(s,32,196,10);A(s,51,186,73,186,red);T(s,83,181,'Original trigger',ink,11);T(s,83,204,'→ airplane',red,17);}
}
function gcb(s,w,i){const m=w/2;
 if(i===0){T(s,m,14,'Conditional InfoGAN',blue,13,'middle');const gx=w*.23,qx=w*.78;circle(s,gx,103,'G');circle(s,qx,103,'Q');for(let j=0;j<2;j++){let y=48+j*101;T(s,8,y+17,String(j),blue,15);A(s,23,y+12,gx-20,103+(j?8:-8));digit(s,m-15,y,3,30,j?2.5:8);A(s,gx+20,103+(j?8:-8),m-20,y+15);A(s,m+20,y+15,qx-20,103+(j?8:-8));T(s,w-4,y+19,String(j),blue,15,'end');A(s,qx+20,103+(j?8:-8),w-19,y+13)}P(s,`M${qx} 127V198H${gx}V124`,blue,1.3);A(s,gx,144,gx,125);T(s,m,221,'Recover c → learn a shared visual cue',muted,11,'middle');}
 if(i===1){T(s,0,15,'Same training images · only relabel',ink,11);const thin=w*.74;R(s,thin-31,35,65,143,warm);for(let j=0;j<2;j++){const y=45+j*71,n=j?9:3;digit(s,w*.14,y,n,32,8);T(s,w*.14+16,y+52,String(n),green,14,'middle');digit(s,thin-16,y,n,32,2.5);T(s,thin,y+53,n+' → 0',red,14,'middle')}T(s,thin,196,'Q selects',blue,11,'middle');T(s,m,219,'Shared cue across classes → target 0',red,11,'middle');}
 if(i===2){const sz=40;photo(s,assets.clean,0,28,sz);A(s,47,48,w*.45-20,48);circle(s,w*.45,48,'G');photo(s,assets.trigger,w-48,28,sz);A(s,w*.45+20,48,w-55,48);T(s,0,91,'New input',muted,11);T(s,w*.45,90,'c = 1',blue,11,'middle');T(s,w-26,91,'Same cue',red,11,'middle');R(s,0,114,w,75,warm);T(s,m,139,'Learned cue → target',red,14,'middle');T(s,m,175,'3 → 0',red,26,'middle');T(s,m,218,'Training-image pixels edited: 0',blue,12,'middle');}
}
const funcs={face,seam,scan,prism,grasp,gcb};
function draw(s){const w=Math.round(s.getBoundingClientRect().width);if(w<150)return;s.replaceChildren();s.setAttribute('viewBox',`0 0 ${w} 236`);funcs[s.dataset.kind](s,w,Number(s.dataset.panel));}
const ro=new ResizeObserver(es=>es.forEach(e=>draw(e.target)));plots.forEach(s=>{ro.observe(s);draw(s)});
})();
