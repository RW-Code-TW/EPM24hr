/* EPM24hr：共用的部分。選位子、三個數字（達成、F1 信任、體力）、開會時大家坐哪裡、結算。
   每個位子的一天在 role_*.js：自己的時刻（seg 名稱用位子開頭，例如 cmd_am），每件事都有 when: onRole('cmd')。
   ST.d.role 記你選的位子；ST.d.ctb、ST.d.f1、ST.d.san 是三個數字（0–100）。 */

/* 五個位子：名字、一句話介紹、你的座位（WORLD 的點）、你的電腦（STORY.places）。recap() 在各自的檔裡補上 */
const ROLES = {
  cmd: {name: 'Commodity', pitch: '缺料、改料、CTB', desk: 'd_cmd', pc: 'pc_cmd'},
  asm: {name: 'Assembly', pitch: '開線、異常、晚班', desk: 'd_asm', pc: 'pc_asm'},
  tst: {name: 'Testing', pitch: 'FA、Test rule、DOE、Rel', desk: 'd_tst', pc: 'pc_tst'},
  shp: {name: 'Shipping', pitch: '庫存、報關、出貨', desk: 'd_shp', pc: 'pc_shp'},
  mlb: {name: 'MLB', pitch: 'SMA 打板、BM、DOE', desk: 'd_mlb', pc: 'pc_mlb'}
};
const EPMS = ['cmd', 'asm', 'tst', 'shp', 'mlb'];
const onRole = r => () => ST.d.role === r;
/* Testing 再分四種，ST.d.tsub 記你選哪一種（舊存檔沒有就是 fa）。day：那一天的 seg 開頭；recap() 在各自的檔裡補上 */
const TST_SUBS = {
  fa: {name: 'FA DRI', pitch: 'Yield、FA、跟催周邊', day: 'tst'},
  rule: {name: 'Test rule', pitch: '客戶一改再改的測試規則', day: 'tsr'},
  doe: {name: 'Offline／DOE', pitch: '進機分配、DOE、借機', day: 'tsd'},
  rel: {name: 'Rel tracker', pitch: 'Rel 候選機、RD comment、OK2REL', day: 'tsl'}
};
const tstSub = () => TST_SUBS[ST.d.tsub] ? ST.d.tsub : 'fa';
const onTst = s => () => ST.d.role === 'tst' && tstSub() === s;
ROLES.tst.recap = () => TST_SUBS[tstSub()].recap();
/* 你今天的位子叫什麼、你那一天的 seg 開頭 */
const roleName = () => {const R = ROLES[ST.d.role] || ROLES.cmd; return ST.d.role === 'tst' ? R.name + '・' + TST_SUBS[tstSub()].name : R.name};
const dayKey = () => ST.d.role === 'tst' ? TST_SUBS[tstSub()].day : ST.d.role;
const myPc = () => ROLES[ST.d.role] ? ROLES[ST.d.role].pc : 'pc_cmd';

/* 三個數字。eff = {ctb, f1, san}，改完跳一則通知 */
const STAT_NAMES = {ctb: '達成', f1: 'F1 信任', san: '體力'};
function epmAdd(eff) {
  if (!eff) return;
  const parts = [];
  for (const k in STAT_NAMES) {
    if (!eff[k]) continue;
    ST.d[k] = Math.max(0, Math.min(100, (ST.d[k] == null ? 60 : ST.d[k]) + eff[k]));
    parts.push(STAT_NAMES[k] + (eff[k] > 0 ? ' +' : ' −') + Math.abs(eff[k]));
  }
  if (parts.length) toast(parts.join('　'), '達成 ' + ST.d.ctb + '・F1 信任 ' + ST.d.f1 + '・體力 ' + ST.d.san);
}
/* 做選擇的小遊戲：key 存進 ST.d，opts = [[按鈕字, 值, 效果], …] */
function epmAsk(key, lines, opts) {
  return function (done) {
    say(lines, null, {choice: opts.map(o => [o[0], () => {ST.d[key] = o[1]; epmAdd(o[2]); done()}])});
  };
}

/* 場景：大家回座位／大家去會議室。你的位子上那位同事就是你，先藏起來 */
const NPC_HOME = {cmd: 'd_cmd', asm: 'd_asm', tst: 'd_tst', shp: 'd_shp', mlb: 'd_mlb', boss: 'd_boss', f1: 'f1d', f1b: 'f1e', opm1: 'opm1', opm2: 'opm2',
  iqc: 'iqc', pd: 'pdn', line: 'line', te: 'te', rep: 'rep', smt: 'smt', wh: 'wh', rd: 'rdn', sw: 'swn', rda: 'rda', ada: 'ada'};
const SEATS = ['m1', 'm3', 'm4', 'm6', 'm7'];
function hideMe() {
  if (!ST.d.role) return;
  STORY.cast.me.role = roleName() + ' EPM';   /* 接著上次玩時也要對 */
  if (W) W.show(ST.d.role, false);
}
/* 靜電服：ST.d.suit 是你現在有沒有穿著。進產線前過金屬探測門才穿上（gate.js），去開會、回宿舍就脫掉 */
const ESD_SUIT = {cloth: 0xf07a1e};   /* 穿脫由 gate.js 照人在牆的哪一邊決定；換場景時先照存檔的狀態穿回去 */
function wearSuit(on) {ST.d.suit = !!on; if (W) W.outfit('me', ST.d.suit ? ESD_SUIT : null)}
function atWork() {
  if (!W) return;
  for (const id in NPC_HOME) W.put(id, NPC_HOME[id]);
  hideMe(); wearSuit(ST.d.suit);
}
function atMeeting() {
  if (!W) return;
  atWork(); wearSuit(false);
  W.put('boss', 'm2'); W.put('f1', 'm5'); W.put('f1b', 'm8');
  let i = 0;
  EPMS.filter(r => r !== ST.d.role).forEach(r => W.put(r, SEATS[i++]));
  W.put('me', SEATS[i]);
  hideMe();
}
/* 進到自己位子的第一個時刻：人坐回座位上 */
function atDesk() {atWork(); wearSuit(false); if (W && ST.d.role) W.put('me', ROLES[ST.d.role].desk)}
/* 晚上：客戶、主管、RD、SW 都下班了 */
function nightOff() {if (W) ['f1', 'f1b', 'opm1', 'opm2', 'boss', 'rd', 'sw'].forEach(id => W.show(id, false))}
/* 回宿舍：工廠跟宿舍之間走不過去，人直接換到宿舍裡。從宿舍回廠的那個時刻，scene() 要自己把人放回廠裡 */
function atDorm() {
  atWork(); nightOff(); wearSuit(false);
  if (!W) return;
  W.show('roomie', true); W.show('byron', true);
  W.put('me', 'dorm');
}

/* 一天的開頭：在廠門口選位子 */
STORY.segs.pick = {name: '廠門口', sub: '今天你顧哪一條線？', t: 470, mood: 'day', scene() {atWork()}};
STORY.beats.push(
  {seg: 'pick',
    lines: () => [['sys', '07:50。打卡機嗶了一聲，手機已經有三十幾則未讀。'],
      ['boss', '早。今天五條線都缺人手，你挑一條顧。'],
      ['boss', '十點十五分 Daily sync up，F1 也會在。不管顧哪條，記得帶 ETA 來。']],
    mini(done) {
      say([['boss', '你今天顧哪一條？']], null, {choice: EPMS.map(r => [ROLES[r].name + '：' + ROLES[r].pitch, () => {
        Object.assign(ST.d, {role: r, ctb: 70, f1: 60, san: 80});
        if (r !== 'tst') return done();
        say([['boss', 'Testing 今天四個缺：FA DRI、Test rule、Offline／DOE、Rel tracker。你補哪一個？']], null, {choice: Object.keys(TST_SUBS).map(s => [TST_SUBS[s].name + '：' + TST_SUBS[s].pitch, () => {ST.d.tsub = s; done()}])});
      }])});
    },
    post: () => [['boss', roleName() + '，好。去吧。']],
    after() {atDesk()}}
);

/* 跟不是下一步要找的人說話：每個人一句 */
const CHAT = {
  cmd: '那顆料的 ETA……你也想知道？我也想知道。',
  asm: '線上又在叫我了，晚點聊。',
  tst: '周邊還沒回 Yield。這是今天第三次了。',
  shp: '客戶要 40 台，架上有 32 台。數學真難。',
  mlb: 'DOE 計畫今天改第二版了。',
  boss: '所以 ETA 是什麼時候？',
  f1: '你們的 CTB 我都有在看喔。',
  iqc: '判退就是判退，急也沒用。',
  pd: '盡量、盡量。',
  line: '線上一切正常。目前。',
  te: '那個應該是 NTF 啦。',
  rep: '機台排隊中，下一個。',
  smt: '打板順序不要再改了好不好。',
  wh: '架上的數字跟系統一樣，放心。',
  f1b: '今天的 candidates，七點前給我喔。',
  opm1: '我們 OPM 在開我們自己的會，你們繼續。',
  opm2: '嗯。（Dr. 點了點頭，繼續打字。）',
  rd: '這台 Rel 候選機，序號我不太喜歡。',
  sw: '（一邊刷機，一邊哼著周杰倫的〈明明就〉）……嗯？要刷哪一版？先講好，不要刷完再改。',
  rda: '進去之前先把手機收好。出來記得洗手。',
  ada: '想不想看紅果短劇？',
  byron: '十一點門禁喔。……好啦，我沒看到。',
  roomie: '你還在回群組喔？我明天也早班欸。'
};
STORY.talk = id => {
  if (!CHAT[id] || id === ST.d.role) return false;
  busy = true; showGuide();
  const bye = () => {busy = false; showGuide()};
  if (id === 'line') {showLaura(bye); return true}
  say([[id, CHAT[id]]], bye, {end: '好'});
  return true;
};
/* 蘿拉：找蘿拉聊天，會被問要不要看家裡的狗。看了體力 +5（一天一次） */
function showLaura(bye) {
  say([['line', '想看我家的狗狗嗎？']], null, {choice: [
    ['想！', () => {
      setPanel('<p style="font-size:84px;line-height:1;text-align:center;margin:8px 0" aria-hidden="true">🐕</p>'
        + '<p>牠叫豆花，三歲，柴犬。最喜歡啃靜電鞋。</p><p class="fine">（蘿拉一張一張滑給你看：豆花睡覺、豆花洗澡、豆花又在睡覺。）</p>' + nextBtn('好可愛'), '蘿拉的手機');
      $('#next').onclick = () => {
        hidePanel(); SFX.ok();
        const first = !ST.d.dog; ST.d.dog = (ST.d.dog || 0) + 1;
        if (first) epmAdd({san: 5});
        say([['line', first ? '對吧！下次給你看牠洗澡的影片。' : '這張你看過了嗎？沒關係，再看一次。']], bye, {end: '好'});
      };
    }],
    ['下次再看', () => say([['line', '好啦，下次。牠叫豆花喔，記得。']], bye, {end: '好'})]]});
}

/* 結算卡：照實際發生的事寫 */
STORY.ending = () => {
  const R = ROLES[ST.d.role] || ROLES.cmd, ctb = ST.d.ctb | 0, f1 = ST.d.f1 | 0, san = ST.d.san | 0;
  const ot = Math.max(0, ST.clock - 1050), otText = ot ? Math.floor(ot / 60) + ' 小時 ' + (ot % 60) + ' 分' : '準時';
  const sp = R.special ? R.special() : null;   /* 特殊事件（例如通宵）自己的標題 */
  const title = sp ? sp.title : ctb >= 75 && f1 >= 65 ? '今天是綠燈' : ctb >= 60 ? '今天撐過去了' : '明天再補';
  const sub = sp ? sp.sub : san <= 30 ? '你的體力比 CTB 還紅。' : f1 >= 70 ? 'F1 今天對你點了兩次頭。' : ctb >= 75 ? '數字很好看，F1 還在觀察你。' : '有些事明天早會一定會被問。';
  /* 時間軸只放真的經過的時刻：seg 上可以掛 when()，沒發生的（例如沒通宵）不算 */
  const segs = Object.keys(STORY.segs).filter(k => k.indexOf(dayKey() + '_') === 0 && (!STORY.segs[k].when || STORY.segs[k].when()));
  const tl = [segs[0], segs[Math.floor(segs.length / 2)], segs[segs.length - 1]].filter(Boolean).map(k => [clockOf(STORY.segs[k].t), STORY.segs[k].name]);
  return {
    title, sub, led: roleName(), tl,
    stats: [['位子', roleName()], ['下班', clockOf(ST.clock)], ['加班', otText], ['達成', ctb], ['F1 信任', f1], ['體力', san]],
    lines: (R.recap ? R.recap() : []).concat(['明天早上八點，同一張桌子，同一封郵件。'])
  };
};
