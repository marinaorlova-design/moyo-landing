/* =========================================================
   MOYO · иллюстрации
   Стиль: плоская заливка тёмными тонами + тонкий белый контур,
   один фиолетовый элемент на картинку, светлые лица, искры-звёздочки.
   Каждая функция возвращает строку <svg>.
   ========================================================= */
(function(){
const C={d0:'#0E0D13',d1:'#1B1923',d2:'#272431',d3:'#38344A',face:'#DCD5EC',ln:'rgba(255,255,255,.9)',lnS:'rgba(255,255,255,.35)',a:'#8A6BFF',ah:'#B3A1FF'};
let uid=0;
const S=`stroke="${C.ln}" stroke-width="1.4" stroke-linejoin="round" stroke-linecap="round"`;
// искра: 4-лучевая звёздочка
const spark=(x,y,r,fill='#fff',op=1,anim=true)=>`<path d="M${x} ${y-r}Q${x+r*.18} ${y-r*.18} ${x+r} ${y}Q${x+r*.18} ${y+r*.18} ${x} ${y+r}Q${x-r*.18} ${y+r*.18} ${x-r} ${y}Q${x-r*.18} ${y-r*.18} ${x} ${y-r}Z" fill="${fill}" opacity="${op}">${anim?`<animate attributeName="opacity" values="${op};${op*.2};${op}" dur="${2.5+((x+y)%20)/10}s" repeatCount="indefinite"/>`:''}</path>`;
const glow=(id,cx,cy,r,op=.35)=>`<defs><radialGradient id="g${id}"><stop offset="0" stop-color="${C.a}" stop-opacity="${op}"/><stop offset="1" stop-color="${C.a}" stop-opacity="0"/></radialGradient></defs><circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#g${id})"/>`;
// конечность с контуром: белая линия снизу, заливка сверху
const limb=(d,w=11,fill=C.d2)=>`<path d="${d}" fill="none" stroke="${C.ln}" stroke-width="${w+2.8}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${fill}" stroke-width="${w}" stroke-linecap="round"/>`;

/* ---------- исполнитель: певица у микрофона ---------- */
function singer(){
  const id=++uid;
  return `<svg viewBox="0 0 300 240" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${glow(id,150,120,120,.32)}
  <line x1="50" y1="236" x2="250" y2="236" stroke="${C.lnS}"/>
  <!-- стойка -->
  <path d="M206 236V150L186 112" ${S}/>
  <path d="M190 236h32" ${S}/>
  <!-- тело -->
  <path d="M94 240C96 188 116 160 150 160C184 160 204 188 206 240Z" fill="${C.d2}" ${S}/>
  <path d="M132 162L150 196L168 162" ${S} stroke-opacity=".5"/>
  <path d="M141 136h18v26c-4 6-14 6-18 0Z" fill="${C.face}" ${S}/>
  <!-- волосы сзади -->
  <path d="M120 110C116 70 184 70 180 110C181 140 188 160 196 176C178 176 170 156 170 132L130 132C130 156 122 176 104 176C112 160 119 140 120 110Z" fill="${C.d0}" ${S}/>
  <ellipse cx="150" cy="114" rx="25" ry="29" fill="${C.face}" ${S}/>
  <path d="M125 104C130 84 150 80 172 92C160 96 146 94 136 104C132 108 128 110 125 104Z" fill="${C.d0}" ${S}/>
  <path d="M138 114q4 3 8 0M156 114q4 3 8 0" stroke="${C.d0}" stroke-width="1.6" stroke-linecap="round"/>
  <ellipse cx="152" cy="129" rx="4" ry="5" fill="${C.d0}"/>
  <!-- рука к микрофону -->
  ${limb('M188 182C200 166 194 140 184 124',11)}
  <circle cx="183" cy="121" r="6" fill="${C.face}" ${S}/>
  <!-- микрофон — акцент -->
  <g transform="rotate(-28 178 104)"><rect x="170" y="88" width="16" height="26" rx="8" fill="${C.a}" stroke="#fff" stroke-width="1.4"/><path d="M172 96h12M172 101h12M172 106h12" stroke="#fff" stroke-opacity=".55"/></g>
  <!-- звук -->
  <path d="M212 86q10 10 0 22M222 78q16 18 0 38" stroke="${C.ah}" stroke-width="1.6" stroke-linecap="round" opacity=".8"/>
  <path d="M86 70v-18l12-3v18" ${S}/><circle cx="83" cy="70" r="4" fill="#fff"/><circle cx="95" cy="67" r="4" fill="#fff"/>
  ${spark(70,120,6)}${spark(236,150,5,C.ah)}${spark(110,40,4)}${spark(214,46,7)}
  </svg>`;
}

/* ---------- заказчик: собирает команду ---------- */
function client(){
  const id=++uid;
  return `<svg viewBox="0 0 300 240" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${glow(id,150,124,120,.3)}
  <line x1="50" y1="236" x2="250" y2="236" stroke="${C.lnS}"/>
  <!-- созвездие команды -->
  <path d="M196 48L232 30L262 58L236 88L196 48" stroke="${C.lnS}" stroke-dasharray="3 4"/>
  <circle cx="196" cy="48" r="9" fill="${C.d3}" ${S}/><circle cx="232" cy="30" r="7" fill="${C.d3}" ${S}/><circle cx="262" cy="58" r="8" fill="${C.d3}" ${S}/><circle cx="236" cy="88" r="10" fill="${C.a}" stroke="#fff" stroke-width="1.4"/>
  <path d="M231 88l3.5 3.5L241 85" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- тело -->
  <path d="M90 240C92 186 114 160 150 160C186 160 208 186 210 240Z" fill="${C.d2}" ${S}/>
  <path d="M136 162L150 186L164 162" fill="${C.face}" ${S}/>
  <path d="M128 164L146 206M172 164L154 206" ${S} stroke-opacity=".55"/>
  <path d="M141 134h18v26c-4 6-14 6-18 0Z" fill="${C.face}" ${S}/>
  <ellipse cx="150" cy="112" rx="25" ry="28" fill="${C.face}" ${S}/>
  <path d="M124 108C122 82 140 76 154 78C170 80 178 92 176 106C168 98 152 96 138 98C130 100 126 104 124 108Z" fill="${C.d0}" ${S}/>
  <circle cx="141" cy="114" r="2" fill="${C.d0}"/><circle cx="159" cy="114" r="2" fill="${C.d0}"/>
  <path d="M144 126q6 4 12 0" stroke="${C.d0}" stroke-width="1.6" stroke-linecap="round"/>
  <!-- планшет — акцент -->
  ${limb('M112 200C108 186 116 178 126 176',11)}${limb('M188 200C192 186 184 178 174 176',11)}
  <g transform="rotate(-6 150 190)"><rect x="118" y="168" width="64" height="46" rx="8" fill="${C.a}" stroke="#fff" stroke-width="1.4"/>
  <path d="M128 182l3 3 5-6M142 182h28M128 194l3 3 5-6M142 194h22M128 204h40" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" opacity=".9"/></g>
  ${spark(68,90,6)}${spark(92,46,4,C.ah)}${spark(250,140,5)}${spark(70,170,4)}
  </svg>`;
}

/* ---------- иконки шагов (96×96) ---------- */
function iconProfile(){
  const id=++uid;
  return `<svg viewBox="0 0 96 96" fill="none">${glow(id,48,48,46,.25)}
  <rect x="22" y="14" width="52" height="68" rx="10" fill="${C.d2}" ${S}/>
  <circle cx="48" cy="38" r="12" fill="${C.a}" stroke="#fff" stroke-width="1.4"/>
  <path d="M42 39a6 6 0 0 1 12 0M45 33a3 3 0 1 0 6 0a3 3 0 1 0-6 0" stroke="#fff" stroke-width="1.3"/>
  <path d="M33 58h30M36 66h24" ${S} stroke-opacity=".6"/>
  ${spark(78,18,5)}${spark(18,70,4,C.ah)}</svg>`;
}
function iconInvite(){
  const id=++uid;
  return `<svg viewBox="0 0 96 96" fill="none">${glow(id,48,50,46,.25)}
  <rect x="14" y="30" width="68" height="46" rx="8" fill="${C.d2}" ${S}/>
  <path d="M16 34L48 58L80 34" ${S}/>
  <circle cx="70" cy="30" r="11" fill="${C.a}" stroke="#fff" stroke-width="1.4"/>
  ${spark(70,30,5,'#fff',1,false)}
  ${spark(20,18,5)}${spark(86,62,4,C.ah)}</svg>`;
}
function iconMoney(){
  const id=++uid;
  return `<svg viewBox="0 0 96 96" fill="none">${glow(id,48,52,46,.25)}
  <rect x="18" y="56" width="60" height="22" rx="4" fill="${C.d1}" ${S} transform="rotate(-4 48 67)"/>
  <rect x="16" y="44" width="60" height="22" rx="4" fill="${C.d2}" ${S} transform="rotate(5 46 55)"/>
  <rect x="20" y="30" width="60" height="24" rx="4" fill="#E7E1FA" ${S}/>
  <circle cx="50" cy="42" r="8" fill="${C.a}"/><path d="M48 46v-8h3a2.5 2.5 0 0 1 0 5h-5M46 44h5" stroke="#fff" stroke-width="1.3" stroke-linecap="round"/>
  ${spark(80,20,6)}${spark(14,26,4,C.ah)}</svg>`;
}
/* купюра — для сцены сделки */
function bill(){
  return `<svg viewBox="0 0 64 32" fill="none"><rect x="1" y="1" width="62" height="30" rx="4" fill="#E7E1FA" stroke="#fff"/>
  <rect x="5" y="5" width="54" height="22" rx="2" stroke="${C.a}" stroke-opacity=".35"/>
  <circle cx="32" cy="16" r="7" fill="${C.a}"/><path d="M30 20v-8h3a2.4 2.4 0 0 1 0 4.8h-5M28 18.2h5" stroke="#fff" stroke-width="1.2" stroke-linecap="round"/></svg>`;
}

window.ILL={singer,client,iconProfile,iconInvite,iconMoney,bill,spark,C};
})();
