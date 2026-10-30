/* =========================================================
   MOYO · поле притяжения и прожектор
   MoyoField(el, opts) — смешанная сетка (вертикали + горизонтали разной длины),
     линии изгибаются к светящемуся шарику, который медленно бродит.
   MoyoSpot(el, opts)  — прожектор сверху: сам ходит по точкам, по запросу
     наводится на цель (spot.aim(x,y) / spot.free()).
   ========================================================= */
(function(){
const NS='http://www.w3.org/2000/svg';
const REDUCE=matchMedia('(prefers-reduced-motion: reduce)').matches;

// сетка в колонках контейнера 1280/6: [колонка, от, до] и [доля высоты, от колонки, до колонки]
// вертикали всегда идут на всю высоту — без разрывов
const VERT=[[-1,0,1],[0,0,1],[1,0,1],[2,0,1],[3,0,1],[4,0,1],[5,0,1],[6,0,1],[7,0,1]];
const HORZ=[[.24,-2,4],[.52,2,9],[.8,-2,3],[.92,4,9]];

function MoyoField(el,opts={}){
  const o=Object.assign({sigma:190,strength:.5,step:14,stars:false,ball:false,vert:VERT,horz:HORZ},opts);
  const svg=document.createElementNS(NS,'svg');svg.setAttribute('class','mfield');el.prepend(svg);
  let ball=null;if(o.ball){ball=document.createElement('div');ball.className='orb-ball';el.appendChild(ball)}
  let W,H,lines=[],bx=0,by=0,tx=null,ty=null,amp=o.ball?1:0,t0=performance.now()+Math.random()*1e4;
  const pull={x:null,y:null};
  function build(){
    W=el.clientWidth;H=el.clientHeight;svg.setAttribute('viewBox',`0 0 ${W} ${H}`);svg.innerHTML='';lines=[];
    const col=1280/6,x0=W/2-640;
    const add=(pts,cls)=>{const p=document.createElementNS(NS,'path');p.setAttribute('class','ln '+cls);svg.appendChild(p);lines.push({pts,p})};
    o.vert.forEach(([c,a,b])=>{const x=x0+c*col;if(x<-20||x>W+20)return;const pts=[];for(let y=a*H;y<=b*H+.1;y+=o.step)pts.push([x,y]);add(pts,'v')});
    o.horz.forEach(([f,a,b])=>{const y=f*H,xa=Math.max(-20,x0+a*col),xb=Math.min(W+20,x0+b*col),pts=[];for(let x=xa;x<=xb+.1;x+=o.step)pts.push([x,y]);add(pts,'h')});
    if(o.stars)stars();
    if(bx===0){bx=W*.62;by=H*.55}
  }
  function stars(){ // очень тонкие созвездия на фоне
    const g=document.createElementNS(NS,'g');g.setAttribute('class','cs');
    const sets=[[[.08,.18],[.13,.12],[.19,.2],[.16,.31]],[[.84,.7],[.9,.62],[.95,.71],[.88,.82]],[[.72,.14],[.78,.2],[.75,.28]]];
    let h='';
    sets.forEach(s=>{const P=s.map(([x,y])=>[x*W,y*H]);h+=`<path d="M${P.map(p=>p.join(' ')).join('L')}"/>`;
      P.forEach((p,i)=>h+=`<circle cx="${p[0]}" cy="${p[1]}" r="${i%2?1.2:1.8}" opacity=".5"><animate attributeName="opacity" values=".15;.7;.15" dur="${4+i}s" begin="${-i*1.3}s" repeatCount="indefinite"/></circle>`)});
    g.innerHTML=h;svg.prepend(g);
  }
  function tick(now){
    const t=(now-t0)/1000;
    // шарик бродит по фигуре Лиссажу, может быть притянут к цели
    let wx=W*(.5+.36*Math.sin(t*.13)+.06*Math.sin(t*.41)),wy=H*(.52+.3*Math.sin(t*.19+1)+.05*Math.cos(t*.37));
    if(tx!==null){wx=tx;wy=ty}
    const k=REDUCE?1:.02;bx+=(wx-bx)*k;by+=(wy-by)*k;
    // без шарика линии прямые и изгибаются, только когда есть цель (goTo)
    if(!o.ball)amp+=((tx!==null?1:0)-amp)*.05;
    if(ball)ball.style.transform=`translate(${bx}px,${by}px)`;
    const s2=2*o.sigma*o.sigma;
    lines.forEach(l=>{
      let d='';
      for(const [x,y] of l.pts){
        let dx=bx-x,dy=by-y,g=Math.exp(-(dx*dx+dy*dy)/s2),nx=x+dx*o.strength*g*amp,ny=y+dy*o.strength*g*amp;
        if(pull.x!==null){const ex=pull.x-x,ey=pull.y-y,g2=Math.exp(-(ex*ex+ey*ey)/(s2*2.2));nx+=ex*.22*g2;ny+=ey*.22*g2}
        d+=(d?'L':'M')+nx.toFixed(1)+' '+ny.toFixed(1);
      }
      l.p.setAttribute('d',d);
    });
    requestAnimationFrame(tick);
  }
  build();addEventListener('resize',build);requestAnimationFrame(tick);
  return{
    goTo(x,y){tx=x;ty=y},release(){tx=ty=null},
    pullTo(x,y){pull.x=x;pull.y=y},unpull(){pull.x=pull.y=null}
  };
}

function MoyoSpot(el,opts={}){
  const o=Object.assign({fx:.5,spread:24,points:null},opts);
  const wrap=document.createElement('div');wrap.className='spot';
  wrap.innerHTML='<div class="pool"></div><div class="beam"></div><div class="rig"></div>';
  el.prepend(wrap);
  const beam=wrap.querySelector('.beam'),pool=wrap.querySelector('.pool'),rig=wrap.querySelector('.rig');
  let W,H,cx,cy,ax=null,ay=null,wi=0,next=0;
  const size=()=>{W=el.clientWidth;H=el.clientHeight;if(cx===undefined){cx=W*.3;cy=H*.7}};
  size();addEventListener('resize',size);
  // точки, по которым прожектор ходит сам
  const P=()=>o.points?o.points(W,H):[[.3,.72],[.7,.7],[.5,.35],[.18,.5],[.82,.45],[.5,.8]].map(([x,y])=>[x*W,y*H]);
  function tick(now){
    let tx,ty;
    if(ax!==null){tx=ax;ty=ay}
    else{if(now>next){wi=(wi+1+Math.floor(Math.random()*2))%P().length;next=now+2600+Math.random()*1400}const p=P()[wi];tx=p[0];ty=p[1]}
    const k=REDUCE?1:(ax!==null?.08:.025);cx+=(tx-cx)*k;cy+=(ty-cy)*k;
    const fx=W*o.fx,fy=18,dx=cx-fx,dy=cy-fy,len=Math.hypot(dx,dy)+120,ang=Math.atan2(-dx,dy)*180/Math.PI;
    const w=2*Math.tan(o.spread*Math.PI/360)*len;
    rig.style.left=fx+'px';rig.style.transform=`rotate(${ang*.35}deg)`;
    beam.style.left=(fx-w/2)+'px';beam.style.width=w+'px';beam.style.height=len+'px';beam.style.transform=`rotate(${ang}deg)`;
    pool.style.transform=`translate(${cx}px,${cy}px)`;
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
  return{aim(x,y){ax=x;ay=y},free(){ax=ay=null;next=0},get pos(){return[cx,cy]}};
}

window.MoyoField=MoyoField;window.MoyoSpot=MoyoSpot;
})();
