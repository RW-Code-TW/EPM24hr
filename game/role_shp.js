/* Shipping EPM 的一天：08:00 看客戶需求 → 19:00 交接郵件。
   ST.d.draw（畫出貨：part 先出 32 台／pull 跟 Assembly 要 8 台）、ST.d.nimbus（周邊挑機：rule 照規則／let 讓他指定序號）、
   ST.d.rush（F1 急單：yes 答應／eta 給實際 ETA）。 */
Object.assign(STORY.segs, {
  shp_am: {name: '客戶的機台需求', sub: '先看客戶要幾台。', t: 480, mood: 'day', scene() {atDesk()}},
  shp_inv: {name: '畫出貨', sub: '再看倉庫有幾台。', t: 540, mood: 'day', scene() {atWork()}},
  shp_cus: {name: '報關', sub: '九點半，報關行打來了。', t: 570, mood: 'day', scene() {atWork()}},
  shp_mtg: {name: '早會', sub: '出貨數字，F1 會一台一台對。', t: 615, mood: 'day', scene() {atMeeting()}},
  shp_nimbus: {name: 'Fulfill Nimbus', sub: '準備乾淨庫存，給周邊挑機。', t: 690, mood: 'day', scene() {atWork()}},
  shp_pm: {name: '跟進流線入庫', sub: '出貨的機台，現在在哪一站？', t: 810, mood: 'day', scene() {atWork()}},
  shp_wrap: {name: '晚會', sub: '晚會報告：今天出了幾台。', t: 1020, mood: 'eve', scene() {atMeeting()}},
  shp_hand: {name: '交接郵件', sub: '明天的 candidates，今天要先給。', t: 1140, mood: 'eve', scene() {atWork()}}
});

const isShp = onRole('shp');
STORY.beats.push(
  {seg: 'shp_am', when: isShp, to: 'pc_shp', guide: '查看郵件，確認客戶的機台需求',
    lines: () => [['sys', 'F1 的郵件：今天要 40 台，其中 10 台指定 config B。'],
      ['sys', '另一封：周邊下午要挑 15 台做驗證。'],
      ['me', '加起來 55 台。先去倉庫看看有幾台。']]},

  {seg: 'shp_inv', when: isShp, to: 'wh', guide: '去出貨倉找胖虎對庫存',
    lines: () => [['wh', '乾淨庫存？32 台。config B 只有 6 台。'],
      ['wh', '今天下線的還在測試，入庫要下午。']],
    mini: epmAsk('draw', [['me', '（客戶要 40，架上 32。）']], [
      ['先出 32 台，剩下的明天補', 'part', {ctb: -4, f1: 2}],
      ['跟 Assembly 要今天下線的 8 台', 'pull', {ctb: 6, san: -6}]]),
    post: () => ST.d.draw === 'part'
      ? [['wh', '好，32 台我先備。'], ['me', '（F1 的郵件要先回，別讓她在早會才知道。）']]
      : [['wh', '要阿哲那邊趕得上才行喔。'], ['me', '我去追。']]},

  {seg: 'shp_cus', when: isShp, ring: ['報關行', '來電', ANSWER],
    lines: () => [['brk', '你好，報關單有一行 HS code 少一碼，海關會退件喔。'],
      ['me', '哪一行？……第七行。我馬上改，十分鐘內回傳。'],
      ['brk', '好，十一點前要送出去。']],
    after() {epmAdd({san: -3})}},

  {seg: 'shp_mtg', when: isShp, to: 'boss', guide: '在早會報告出貨計畫',
    lines: () => [['boss', 'Shipping，今天出幾台？'],
      ['me', ST.d.draw === 'part' ? '今天出 32 台，config B 6 台，剩下 8 台明天補。' : '目標 40 台，其中 8 台等今天下線，下午入庫。'],
      ['f1', ST.d.draw === 'part' ? '明天補可以，但明天的 40 台不能少。' : '下午入庫來得及嗎？Assembly？'],
      ['asm', ST.d.draw === 'part' ? '明天那 8 台我先排。' : '……我盡量，三點前給你。'],
      ['tst', '測試的部分，我會優先排出貨機。']]},

  {seg: 'shp_nimbus', when: isShp, to: 'shipdock', guide: '準備乾淨庫存，給周邊挑機',
    lines: () => [['sys', '你把乾淨庫存排好。周邊的人拿著清單走過來。'],
      ['te', '我們要指定這幾個序號，都是 config B。']],
    mini: epmAsk('nimbus', [['me', '（config B 本來就不夠出貨了。）']], [
      ['照規則：config B 先留給出貨', 'rule', {ctb: 4, san: -4}],
      ['讓他挑，出貨的再想辦法', 'let', {ctb: -6, f1: -2}]]),
    post: () => ST.d.nimbus === 'rule'
      ? [['te', '好啦，那我們挑 A 的。'], ['sys', '你在 Nimbus 上記下 gap：周邊需求 15，實際給 15，config 不符 5。']]
      : [['te', '謝啦！'], ['sys', '你在 Nimbus 上記下 gap：出貨 config B 少了 4 台。']]},

  {seg: 'shp_pm', when: isShp, to: 'asm', guide: '去找阿哲跟進出貨機台的入庫進度',
    lines: () => ST.d.draw === 'pull'
      ? [['asm', '你要的 8 台，6 台過測試了，2 台在 retest。'], ['me', '四點前能入庫嗎？'], ['asm', '6 台可以。']]
      : [['asm', '明天要補的 8 台，我排在早上第一批。'], ['me', '感謝。']]},
  {seg: 'shp_pm', when: isShp, t: 900, ring: ['Mandy（F1）', '來電', ANSWER],
    lines: () => [['f1', '臨時多一個需求：明天早上八點，再多 5 台 config A，要給我們的實驗室。']],
    mini: epmAsk('rush', [['me', '（明天早上的 candidates 還沒算。）']], [
      ['答應：明天八點給', 'yes', {f1: 6, san: -10}],
      ['先算庫存，半小時內回實際 ETA', 'eta', {f1: 2, ctb: 2}]]),
    post: () => ST.d.rush === 'yes'
      ? [['f1', '太好了，謝謝。'], ['me', '（今晚要先把這 5 台挑出來。）']]
      : [['sys', '你算完庫存回電：明天十點。'], ['f1', '十點……好，那十點。']]},

  {seg: 'shp_wrap', when: isShp, to: 'boss', guide: '在晚會報告今天的出貨',
    lines: () => [['boss', '今天出了幾台？'],
      ['me', ST.d.draw === 'pull' ? '38 台出貨，2 台在 retest，明天第一批補。' : '32 台出貨，明天補 8 台加上 F1 的 5 台。'],
      ['mlb', '明天要的主板我晚上會再確認一次。'],
      ['boss', '好。交接郵件記得寫 candidates。']]},

  {seg: 'shp_hand', when: isShp, to: 'pc_shp', guide: '發交接郵件，給明天的 candidates 和 Nimbus tracker',
    lines: () => [['sys', '交接郵件：明天的 candidates ' + (ST.d.rush === 'yes' ? '45' : '40') + ' 台、Nimbus 待修正 tracker、報關單已改。'],
      ['sys', '你又回了兩封客戶的郵件。']]},
  {seg: 'shp_hand', when: isShp, end: true, t: 1200,
    lines: () => [['sys', '20:00。最後一封郵件寄出去。明天的出貨，從今晚就開始了。']]}
);

ROLES.shp.recap = () => [
  ST.d.draw === 'pull' ? '你跟 Assembly 要了今天下線的機台，差一點就湊滿 40 台。' : '今天先出 32 台，剩下的明天補。',
  ST.d.nimbus === 'rule' ? 'config B 留給出貨，周邊挑了 A。' : '周邊挑走了 config B，Nimbus 上多一行 gap。',
  ST.d.rush === 'yes' ? 'F1 的急單你一口答應：明天八點。' : '你先算庫存，再回 F1 實際的 ETA。'
];
