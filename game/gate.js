/* 進產線：金屬探測門加靜電服。最後一個載入，所有位子的 beats 都已經登記好了。
   產線＝x -8.4 那道牆的右邊（物料倉、RF 室、各條線、出貨倉、FA），只有主走道上一個門，門就是金屬探測門。
   1. 每一件要去產線裡（LINE_SPOTS）的事前面，自動插一件「過金屬探測門」；人已經在產線裡就跳過。
      第一次過門有一個選擇，之後每次只有一句。ST.d.gates 記今天過了幾次門，ST.d.gate1 記第一次口袋有沒有掏乾淨。
   2. 靜電服跟著人走：人在產線裡就是橘色（ST.d.suit），走出那道牆就脫掉。 */
const LINE_SPOTS = ['whs', 'iqc', 'pd', 'smtline', 'asmline', 'tester', 'fabench', 'shipdock', 'offlab',
  'smt', 'line', 'te', 'rep', 'wh', 'sw', 'rd', 'rda', 'ada'];
const LINE_X0 = -8.4, LINE_X1 = 19.4;   /* 產線牆的位置；右邊再過去是宿舍，不算 */
const inLine = x => x > LINE_X0 && x < LINE_X1;
const GATE_AGAIN = [
  '又是金屬探測門。嗶——這次是皮帶扣。',
  '金屬探測門。你已經會先把手機放進籃子了。',
  '金屬探測門。保全看了你一眼：「又是你。」',
  '金屬探測門。嗶——原來是口袋裡的筆。'
];
function gateBeat(b) {
  return {seg: b.seg, when: () => (!b.when || b.when()) && !ST.d.suit, to: 'mgate', guide: '先過金屬探測門，換上靜電服',
    lines: () => ST.d.gates
      ? [['sys', GATE_AGAIN[(ST.d.gates - 1) % GATE_AGAIN.length]]]
      : [['sys', '產線的門口。一道金屬探測門，旁邊坐著保全，桌上放著一個塑膠籃子。'],
        ['sys', '你摸了摸口袋：手機、識別證、宿舍鑰匙，還有一枚十塊錢硬幣。']],
    mini(done) {
      if (ST.d.gates) return done();
      epmAsk('gate1', [['me', '（後面還有人在排隊。）']], [
        ['全部掏出來放進籃子', 'tray', {}],
        ['應該沒事，直接走過去', 'walk', {san: -2}]])(done);
    },
    post: () => ST.d.gates ? [['sys', '一進門，從架上拿一件橘色靜電服套上。']]
      : (ST.d.gate1 === 'walk'
        ? [['sys', '嗶——！'], ['sys', '保全指了指你的口袋。宿舍鑰匙。你退回去，重走一次。'], ['sys', '這次安靜了。一進門右手邊就是靜電服的衣架：橘色的，拉鍊要拉到最上面。']]
        : [['sys', '安靜通過。一進門右手邊就是靜電服的衣架：橘色的，拉鍊要拉到最上面。'], ['sys', '產線裡每個人都是橘色的。']]),
    after() {
      ST.d.gates = (ST.d.gates || 0) + 1;
      if (W) W.tower('mgate', 'green'); else wearSuit(true);   /* 沒有 3D 畫面就不知道人走到哪，過了門就算穿上 */
    }};
}
for (let i = STORY.beats.length - 1; i >= 0; i--) {
  const b = STORY.beats[i];
  if (b.to && LINE_SPOTS.indexOf(b.to) >= 0) STORY.beats.splice(i, 0, gateBeat(b));
}
/* 靜電服跟著人走：每 0.2 秒看一次人在牆的哪一邊 */
setInterval(() => {
  if (!W || !ST.on || !ST.d.role) return;
  const now = inLine(W.snap().me[0]);
  if (now === !!ST.d.suit) return;
  wearSuit(now);
  if (now) toast('換上靜電服', '進產線了');
}, 200);
