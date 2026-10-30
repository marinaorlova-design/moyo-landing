/* =========================================================
   MOYO · окна входа и регистрации
   Любой элемент с data-auth="login" | "signup" открывает окно.
   Роль берётся из <body data-role="ispolnitel|zakazchik">; без роли
   (главная) в регистрации есть выбор «исполнитель / заказчик».
   ЗАГЛУШКА: формы пока никуда не отправляются, вход через Telegram — без бота.
   ========================================================= */
(function(){
const CSS=`
.au-wrap{position:fixed;inset:0;z-index:90;display:grid;place-items:center;padding:24px;background:rgba(5,4,8,.72);opacity:0;pointer-events:none;transition:opacity .3s}
.au-wrap.on{opacity:1;pointer-events:auto}
.au{position:relative;width:460px;max-height:calc(100vh - 48px);overflow-y:auto;scrollbar-width:thin;scrollbar-color:#2A2734 transparent;padding:30px 34px 24px;border-radius:28px;background:#14121A;border:1px solid var(--line-2);box-shadow:0 40px 120px -20px rgba(0,0,0,.85),0 0 0 1px rgba(255,255,255,.03) inset;transform:translateY(14px) scale(.98);transition:transform .45s var(--ease)}
.au-wrap.on .au{transform:none}
.au::before{content:"";position:absolute;left:50%;top:-1px;width:180px;height:1px;margin-left:-90px;background:var(--accent);box-shadow:0 0 24px 4px var(--accent-glow)}
.au .x{position:absolute;right:18px;top:16px;width:36px;height:36px;border-radius:50%;font-size:20px;color:var(--text-3);transition:color .2s,background .2s}
.au .x:hover{color:var(--text);background:rgba(255,255,255,.06)}
.au h3{font-size:30px;font-weight:600;letter-spacing:-.04em;line-height:1.08;margin:14px 0 8px}
.au .sub{font-size:15px;color:var(--text-2);margin-bottom:22px}
.au-view{display:none}.au-view.on{display:block}
.au-role{display:flex;gap:4px;padding:4px;border-radius:99px;border:1px solid var(--line);margin-bottom:18px}
.au-role button{flex:1;height:38px;border-radius:99px;font-size:14px;font-weight:600;color:var(--text-2);transition:all .25s}
.au-role button.on{background:var(--accent-a12);color:var(--text);box-shadow:inset 0 0 0 1px var(--accent-a30)}
.au-row{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.au-f{display:block;margin-bottom:12px}
.au-f span{display:block;font-size:12px;font-weight:600;color:var(--text-3);margin:0 0 6px 2px}
.au-f input{width:100%;height:50px;padding:0 16px;border-radius:14px;border:1px solid var(--line-2);background:rgba(255,255,255,.035);color:var(--text);font:inherit;font-size:15px;outline:none;transition:border-color .2s,background .2s}
.au-f input::placeholder{color:var(--text-off)}
.au-f input:focus{border-color:var(--accent);background:rgba(138,107,255,.06)}
.au-f.bad input{border-color:var(--err)}
.au-pw{position:relative}
.au-pw button{position:absolute;right:8px;top:7px;height:36px;padding:0 10px;border-radius:10px;font-size:12px;font-weight:600;color:var(--text-3)}
.au-pw button:hover{color:var(--text)}
.au-line{display:flex;justify-content:space-between;align-items:center;margin:2px 0 18px;font-size:13px}
.au-line a,.au-sw a{color:var(--accent-hi);font-weight:600;cursor:pointer}
.au-ck{display:flex;gap:10px;align-items:flex-start;font-size:13px;color:var(--text-2);line-height:1.45;margin:4px 0 18px;cursor:pointer}
.au-ck input{appearance:none;flex:none;width:20px;height:20px;margin-top:1px;border-radius:6px;border:1px solid var(--line-2);background:rgba(255,255,255,.04);display:grid;place-items:center;cursor:pointer}
.au-ck input:checked{background:var(--accent);border-color:var(--accent)}
.au-ck input:checked::after{content:"✓";font-size:12px;color:#fff}
.au-ck.bad input{border-color:var(--err)}
.au-ck a{color:var(--text);text-decoration:underline;text-underline-offset:3px}
.au .btn{width:100%;justify-content:center}
.au-or{display:flex;align-items:center;gap:14px;margin:16px 0;font-size:12px;color:var(--text-3)}
.au-or::before,.au-or::after{content:"";flex:1;height:1px;background:var(--line)}
.au-tg{gap:10px}
.au-tg svg{width:20px;height:20px}
.au-sw{text-align:center;font-size:14px;color:var(--text-2);margin-top:18px}
.au-ok{text-align:center;padding:18px 0 6px}
.au-ok .ic{width:72px;height:72px;margin:0 auto 6px;border-radius:50%;display:grid;place-items:center;font-size:28px;background:var(--accent-a12);border:1px solid var(--accent-a30);color:var(--accent-hi);box-shadow:0 0 40px -6px var(--accent-glow)}
.au-ok .sub{margin-bottom:24px}
`;
const TG='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M21 4 3 11l6 2 2 6 3-4 5 4 2-15Z"/><path d="m9 13 8-6"/></svg>';
const ROLE={
  ispolnitel:{t:'Создай анкету<br>за&nbsp;2&nbsp;минуты',s:'Зарегистрируйся на&nbsp;MOYO, и&nbsp;AI соберёт твоё портфолио. Первые 3&nbsp;000 бонусов&nbsp;— сразу.',b:'Зарегистрироваться'},
  zakazchik:{t:'Собери команду<br>на&nbsp;своё событие',s:'Зарегистрируйся на&nbsp;MOYO, опиши событие своими словами, и&nbsp;AI подберёт исполнителей.',b:'Зарегистрироваться'}
};
const pw=(id,ph)=>`<label class="au-f"><span>Пароль</span><div class="au-pw"><input type="password" name="${id}" placeholder="${ph}" required minlength="6" autocomplete="${id==='lpw'?'current-password':'new-password'}"><button type="button" data-eye>Показать</button></div></label>`;
const HTML=`<div class="au-wrap" id="auWrap" role="dialog" aria-modal="true"><div class="au">
  <button class="x" type="button" data-close aria-label="Закрыть">×</button>

  <form class="au-view" data-v="login" novalidate>
    <span class="chip"><i></i>С возвращением</span>
    <h3>Вход в&nbsp;MOYO</h3><p class="sub">Анкеты, проекты и&nbsp;сделки ждут тебя в&nbsp;кабинете.</p>
    <label class="au-f"><span>Почта</span><input type="email" name="lmail" placeholder="name@mail.ru" required autocomplete="email"></label>
    ${pw('lpw','Не меньше 6 символов')}
    <div class="au-line"><label class="au-ck" style="margin:0"><input type="checkbox" checked>Запомнить меня</label><a data-go="reset">Забыли пароль?</a></div>
    <button class="btn btn-p" type="submit">Войти<span class="ar">→</span></button>
    <div class="au-or">или</div>
    <a class="btn btn-g au-tg" href="#" data-tg>${TG}Войти через Telegram</a>
    <p class="au-sw">Нет аккаунта? <a data-go="signup">Зарегистрироваться</a></p>
  </form>

  <form class="au-view" data-v="reset" novalidate>
    <span class="chip"><i></i>Восстановление</span>
    <h3>Забыли пароль?</h3><p class="sub">Напиши почту, с&nbsp;которой регистрировался. Пришлём ссылку, чтобы задать новый пароль.</p>
    <label class="au-f"><span>Почта</span><input type="email" name="rmail" placeholder="name@mail.ru" required autocomplete="email"></label>
    <button class="btn btn-p" type="submit" style="margin-top:6px">Отправить ссылку<span class="ar">→</span></button>
    <p class="au-sw"><a data-go="login">← Вернуться ко входу</a></p>
  </form>

  <form class="au-view" data-v="signup" novalidate>
    <span class="chip"><i></i>Регистрация бесплатна</span>
    <h3 data-r="t"></h3><p class="sub" data-r="s"></p>
    <div class="au-role" data-pick><button type="button" data-role="ispolnitel">Я исполнитель</button><button type="button" data-role="zakazchik">Я заказчик</button></div>
    <div class="au-row">
      <label class="au-f"><span>Фамилия</span><input name="last" placeholder="Иванова" required autocomplete="family-name"></label>
      <label class="au-f"><span>Имя</span><input name="first" placeholder="Анна" required autocomplete="given-name"></label>
    </div>
    <label class="au-f"><span>Телефон</span><input type="tel" name="phone" placeholder="+7 (900) 000-00-00" required autocomplete="tel" data-phone></label>
    <label class="au-f"><span>Почта</span><input type="email" name="smail" placeholder="name@mail.ru" required autocomplete="email"></label>
    ${pw('spw','Придумай, не меньше 6 символов')}
    <label class="au-ck"><input type="checkbox" name="agree" required><span>Соглашаюсь с&nbsp;<a href="#">условиями платформы</a> и&nbsp;<a href="#">обработкой персональных данных</a></span></label>
    <button class="btn btn-p" type="submit" data-r="b"></button>
    <div class="au-or">или</div>
    <a class="btn btn-g au-tg" href="#" data-tg>${TG}Зарегистрироваться через Telegram</a>
    <p class="au-sw">Уже есть аккаунт? <a data-go="login">Войти</a></p>
  </form>

  <div class="au-view au-ok" data-v="ok"><div class="ic">✓</div><h3 data-ok="t"></h3><p class="sub" data-ok="s"></p><button class="btn btn-p" type="button" data-close>Отлично</button></div>
</div></div>`;

function init(){
  const st=document.createElement('style');st.textContent=CSS;document.head.appendChild(st);
  document.body.insertAdjacentHTML('beforeend',HTML);
  const wrap=document.getElementById('auWrap'),q=s=>wrap.querySelector(s),qa=s=>[...wrap.querySelectorAll(s)];
  let role=document.body.dataset.role||'ispolnitel';
  const fixed=!!document.body.dataset.role;
  q('[data-pick]').style.display=fixed?'none':'';
  function setRole(r){role=r;const c=ROLE[r];
    q('[data-r="t"]').innerHTML=c.t;q('[data-r="s"]').innerHTML=c.s;q('[data-r="b"]').innerHTML=c.b+'<span class="ar">→</span>';
    qa('[data-pick] button').forEach(b=>b.classList.toggle('on',b.dataset.role===r))}
  function show(v){qa('.au-view').forEach(x=>x.classList.toggle('on',x.dataset.v===v));const f=q(`.au-view[data-v="${v}"] input`);if(f)setTimeout(()=>f.focus(),250)}
  function open(v){setRole(role);show(v||'login');wrap.classList.add('on');document.documentElement.style.overflow='hidden'}
  function close(){wrap.classList.remove('on');document.documentElement.style.overflow=''}
  function ok(t,s){q('[data-ok="t"]').innerHTML=t;q('[data-ok="s"]').innerHTML=s;show('ok')}
  setRole(role);

  document.addEventListener('click',e=>{const a=e.target.closest('[data-auth]');if(a){e.preventDefault();open(a.dataset.auth)}});
  wrap.addEventListener('click',e=>{
    if(e.target===wrap||e.target.closest('[data-close]'))return close();
    const go=e.target.closest('[data-go]');if(go)return show(go.dataset.go);
    const pick=e.target.closest('[data-pick] button');if(pick)return setRole(pick.dataset.role);
    const eye=e.target.closest('[data-eye]');if(eye){const i=eye.previousElementSibling,h=i.type==='password';i.type=h?'text':'password';eye.textContent=h?'Скрыть':'Показать';return}
    if(e.target.closest('[data-tg]')){e.preventDefault();ok('Открываем Telegram','Подтверди вход в&nbsp;боте MOYO, и&nbsp;мы вернём тебя сюда уже в&nbsp;кабинет.')}
  });
  addEventListener('keydown',e=>{if(e.key==='Escape'&&wrap.classList.contains('on'))close()});
  // телефон: +7 (900) 000-00-00
  q('[data-phone]').addEventListener('input',e=>{let d=e.target.value.replace(/\D/g,'');if(d[0]==='8'||d[0]==='7')d=d.slice(1);d=d.slice(0,10);
    let v='+7';if(d.length)v+=' ('+d.slice(0,3);if(d.length>=3)v+=')';if(d.length>3)v+=' '+d.slice(3,6);if(d.length>6)v+='-'+d.slice(6,8);if(d.length>8)v+='-'+d.slice(8,10);e.target.value=v});
  // проверка и «отправка»
  qa('form.au-view').forEach(f=>f.addEventListener('submit',e=>{
    e.preventDefault();let good=true;
    f.querySelectorAll('input[required]').forEach(i=>{const box=i.closest('.au-f,.au-ck');const bad=i.type==='checkbox'?!i.checked:i.name==='phone'?i.value.replace(/\D/g,'').length<11:!i.checkValidity();box.classList.toggle('bad',bad);if(bad)good=false});
    if(!good)return;
    const v=f.dataset.v,mail=(f.querySelector('input[type=email]')||{}).value;
    if(v==='login')ok('Добро пожаловать','Переходим в&nbsp;личный кабинет…');
    if(v==='reset')ok('Ссылка отправлена',`Проверь почту <b>${mail.replace(/</g,'')}</b>. Ссылка действует 24&nbsp;часа.`);
    if(v==='signup')ok('Аккаунт создан',role==='zakazchik'?'Осталось подтвердить почту, и&nbsp;можно описывать первое событие.':'Осталось подтвердить почту, и&nbsp;AI начнёт собирать твою анкету.');
  }));
  wrap.addEventListener('input',e=>{const b=e.target.closest('.bad');if(b)b.classList.remove('bad')});
  window.MoyoAuth={open,close};
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();
})();
