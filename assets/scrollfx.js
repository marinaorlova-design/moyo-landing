/* =========================================================
   MOYO scrollfx — общее для лендингов:
   1) фон меняется по скроллу: секции с data-bg="v" красят страницу в фиолетовый
   2) кабинет: карточки прилетают рубашкой вверх и переворачиваются
   3) текстовые перебивки .tx: заголовки сменяют друг друга переворотом
   4) футер: часы Москвы и лаймовая точка в «О», которая тянется к курсору
   ========================================================= */
(()=>{
  const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const ease=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
  const root=document.documentElement;
  const secs=$$('main > section, body > footer');

  /* ---------- 3) текстовые перебивки ---------- */
  const txs=$$('.tx').map(sec=>{
    const fr=[...sec.querySelectorAll('.tx-f')];
    // каждое слово — отдельный span; слова внутри <em> — ключевые (лайм)
    fr.forEach(f=>{
      const out=[];
      f.childNodes.forEach(n=>{
        if(n.nodeType===3)n.textContent.split(/ +/).forEach(w=>{if(!w.trim())return;
          // знак препинания прилипает к предыдущему слову, без пробела
          if(/^[,.!?:;]/.test(w)&&out.length&&out[out.length-1]!=='<br>'){out[out.length-1]=out[out.length-1].replace(/<\/span>$/,w+'</span>');return}
          out.push(`<span class="w">${w}</span>`)});
        else if(n.tagName==='BR')out.push('<br>');
        else n.textContent.split(/ +/).forEach(w=>w.trim()&&out.push(`<span class="w k">${w}</span>`));
      });
      f.innerHTML=out.join(' ');
    });
    const bars=[...sec.querySelectorAll('.tx-bar b')],num=sec.querySelector('.tx-n b'),cta=sec.querySelector('.tx-cta');
    return{sec,fr,ws:fr.map(f=>[...f.querySelectorAll('.w')]),bars,num,cta};
  });
  function updTx(){
    txs.forEach(({sec,fr,ws,bars,num,cta})=>{
      const r=sec.getBoundingClientRect(),p=clamp(-r.top/(r.height-innerHeight),0,1);
      const N=fr.length,s=clamp((p-.03)/.9,0,1)*N; // позиция в кадрах: 0…N
      let cur=0;
      fr.forEach((f,i)=>{
        const u=s-i;
        // вход: переворот снизу; выход: переворот вверх (у последнего выхода нет)
        const inn=i===0?1:ease(clamp((u+.16)/.16,0,1)),out=i===N-1?0:ease(clamp((u-.84)/.16,0,1));
        const vis=inn>0&&out<1;
        f.style.opacity=vis?Math.pow(inn,2)*Math.pow(1-out,2):0;
        f.style.transform=`translateY(-50%) rotateX(${(1-inn)*-90+out*90}deg)`;
        if(u>=-.16&&u<.84)cur=i;
        // слова проявляются по очереди в первой половине кадра
        const W=ws[i].length;
        ws[i].forEach((w,k)=>w.classList.toggle('on',u>.02+.5*k/W));
        bars[i]&&(bars[i].style.transform=`scaleX(${clamp(u/.84,0,1)})`);
      });
      num&&(num.textContent=String(cur+1).padStart(2,'0'));
      cta&&cta.classList.toggle('on',s>N-.45);
    });
  }

  /* ---------- кабинет: карточки по одной, переворот рубашка → лицо ---------- */
  const cab=$('.cab');let updCab=()=>{};
  if(cab){
    const head=$('#cabHead'),cc=[...cab.querySelectorAll('.cc')],dots=[...cab.querySelectorAll('#cabDots i')],N=cc.length;
    const A=i=>.15+i*(.74/N),D=.14,shown=cc.map(()=>0);
    updCab=()=>{
      const r=cab.getBoundingClientRect(),p=clamp(-r.top/(r.height-innerHeight),0,1),vh=innerHeight;
      // заголовок сначала по центру, затем уходит наверх и уменьшается
      const tt=ease(clamp((p-.03)/.12,0,1)),hh=head.offsetHeight;
      head.style.transform=`translateY(${(vh-hh)/2*(1-tt)+84*tt}px) scale(${1-tt*.52})`;
      let act=-1;
      cc.forEach((c,i)=>{
        const e=clamp((p-A(i))/D,0,1),k=ease(e),f=ease(clamp((e-.2)/.8,0,1));
        const l=i<N-1?ease(clamp((p-A(i+1))/D,0,1)):0,gone=i<N-2?clamp((p-A(i+2))/D,0,1):0;
        const side=i%2?1:-1;
        const o=e<=0?0:Math.min(1,e*4)*(1-l*.7)*(1-gone);c.style.setProperty('--o',o);c.style.visibility=o>0?'visible':'hidden';
        c.style.transform=`translateY(${(1-k)*vh*.85-l*70}px) translateZ(${-l*260}px) rotateX(${(1-k)*22}deg) rotateZ(${(1-k)*7*side}deg) rotateY(${(1-f)*180*side}deg)`;
        if(e>.5)act=i;
        // лицо открылось — запускаем анимацию экрана внутри
        const on=f>.92&&l<.5?1:0;
        if(on!==shown[i]){shown[i]=on;const sc=c.querySelector('.scr');sc.classList.remove('on');if(on){void sc.offsetWidth;sc.classList.add('on')}}
      });
      dots.forEach((d,i)=>d.classList.toggle('on',i===act));
    };
  }

  /* ---------- 1) фон + общий цикл ---------- */
  // фон плавно перетекает: доля фиолетовых секций в окне вокруг центра экрана
  const DARK=[7,6,10],VIO=[47,24,112];
  function vMix(){
    const w=innerHeight*.55,c=innerHeight*.5,a=c-w,b=c+w;let v=0;
    secs.forEach(el=>{if(el.dataset.bg!=='v')return;const r=el.getBoundingClientRect();v+=Math.max(0,Math.min(b,r.bottom)-Math.max(a,r.top))});
    const t=clamp(v/(b-a),0,1);return t*t*(3-2*t);
  }
  function onScroll(){
    const t=vMix();
    root.style.backgroundColor=`rgb(${DARK.map((d,i)=>Math.round(d+(VIO[i]-d)*t)).join(',')})`;
    root.classList.toggle('v',t>.5);
    updTx();updCab();
  }
  addEventListener('scroll',onScroll,{passive:true});
  addEventListener('resize',onScroll);
  addEventListener('load',onScroll);
  onScroll();

  /* ---------- 4) футер ---------- */
  const mark=$('#ftMark'),pupil=$('#ftPupil');
  if(mark){
    new IntersectionObserver(es=>es[0].isIntersecting&&mark.classList.add('in'),{threshold:.3}).observe(mark);
    let tx=0,ty=0,x=0,y=0;
    addEventListener('pointermove',e=>{
      const r=pupil.parentElement.getBoundingClientRect(),cx=r.left+r.width*.4034,cy=r.top+r.height*.5;
      const dx=e.clientX-cx,dy=e.clientY-cy,d=Math.hypot(dx,dy)||1,k=Math.min(1,d/500)*58;
      tx=dx/d*k;ty=dy/d*k*.9;
    });
    (function t(){x+=(tx-x)*.08;y+=(ty-y)*.08;pupil.style.translate=`${x}px ${y}px`;requestAnimationFrame(t)})();
  }
  const clk=$('#ftClock');
  if(clk){const tick=()=>{const d=new Date(new Date().toLocaleString('en-US',{timeZone:'Europe/Moscow'}));clk.innerHTML=`${String(d.getHours()).padStart(2,'0')}<i>:</i>${String(d.getMinutes()).padStart(2,'0')}`};tick();setInterval(tick,10000)}
})();
