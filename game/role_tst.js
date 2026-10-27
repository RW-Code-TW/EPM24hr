/* Testing EPM（FA DRI）的一天：08:00 看 COFA → 22:00 各大群組。
   ST.d.yield（周邊的 Yield 回覆：log 要 fail log／take 先收下）、ST.d.battle（第二次跟催：data 拿數據打回去／form 先把格式交齊）、
   ST.d.fam（FA 會議：assign 當場分 owner／record 先記下來）、ST.d.night（晚上的群組：all 一則一則回／f1 只回 F1）。 */
Object.assign(STORY.segs, {
  tst_am: {name: '看 COFA', sub: '昨晚的 Yield 有沒有正常發出去？', t: 480, mood: 'day', scene() {atDesk(); if (W) W.screen('tst', ['YIELD', '--.-%'], '#ffc94a')}},
  tst_call: {name: '跟催 Yield', sub: '周邊回了沒？', t: 540, mood: 'day', scene() {atWork()}},
  tst_sync: {name: 'Daily sync up', sub: 'F1 第一句一定是問 Yield。', t: 615, mood: 'day', scene() {atMeeting()}},
  tst_noon: {name: '跟催 FA', sub: '機台簽進 FA 了沒？', t: 690, mood: 'day', scene() {atWork()}},
  tst_pm: {name: '第二次跟催', sub: '下午兩點，周邊的回覆來了。', t: 840, mood: 'day', scene() {atWork()}},
  tst_fa: {name: 'FA 會議', sub: '你主持。', t: 900, mood: 'day', scene() {atWork()}},
  tst_wrap: {name: 'Daily wrap up', sub: '第三次跟催 Yield，然後開會。', t: 990, mood: 'eve', scene() {atMeeting()}},
  tst_hand: {name: '交接給維修', sub: '晚上的機台，交給阿德。', t: 1080, mood: 'eve', scene() {atWork()}},
  tst_night: {name: '各大群組', sub: '流連於 XXT、維信、iMessage。', t: 1200, mood: 'night', scene() {atWork(); if (W) {W.show('f1', false); W.show('boss', false)}}}
});

const isTst = onTst('fa');
STORY.beats.push(
  {seg: 'tst_am', when: isTst, to: 'pc_tst', guide: '打開郵件，看 COFA 有沒有正常發 Yield',
    lines: () => [['sys', 'COFA 報表寄出去了，但 RF 站那一欄是空的。'],
      ['me', '又是 RF 站。周邊昨晚到底有沒有上傳？']],
    after() {if (W) W.screen('tst', ['YIELD', '92.1%  RF ??'], '#ffc94a')}},

  {seg: 'tst_call', when: isTst, to: 'te', guide: '去測試區找周邊 TE 志明要 Yield 回覆',
    lines: () => [['te', 'Yield 92.1%。fail 主要在 RF 站，我們判定是 NTF，retest 就過了。'],
      ['me', '三十台都 NTF？']],
    mini: epmAsk('yield', [['te', '對啊，就……NTF。']], [
      ['請他附 fail log 和 retest 數據', 'log', {f1: 5, san: -6}],
      ['先收下，回頭再看', 'take', {ctb: 2, f1: -6}]]),
    post: () => ST.d.yield === 'log'
      ? [['te', '……好啦，十一點前給你。'], ['me', '（馴化周邊，第一步。）']]
      : [['te', '讚啦！'], ['me', '（F1 等一下一定會問。）']]},
  {seg: 'tst_call', when: isTst, to: 'tester', guide: '看一號測試櫃的 fail 機台',
    lines: () => [['sys', '一號櫃亮著紅燈。螢幕上，同一個 RF 測項連續 fail 三台。'],
      ['me', '這不像 NTF。拍下來。']],
    after() {if (W) W.tower('t1', 'red')}},

  {seg: 'tst_sync', when: isTst, to: 'boss', guide: '在 Daily sync up 報告 Yield',
    lines: () => [['f1', 'Testing，Yield？'],
      ['me', '92.1%，fail 集中在 RF 站。' + (ST.d.yield === 'log' ? '已經要周邊附 fail log，十一點前會有。' : '周邊判定是 NTF。')],
      ['f1', ST.d.yield === 'log' ? '好，拿到 log 先給我看。' : 'NTF？三十台都 NTF？我要看 log。'],
      ['asm', '如果是治具的問題，我這邊可以先換。'],
      ['boss', 'FA 會議下午三點，各單位帶數據來。']]},

  {seg: 'tst_noon', when: isTst, to: 'rep', guide: '找維修阿德，推周邊機台簽進 FA',
    lines: () => [['rep', '那幾台 fail 機？還在排 retest，簽 FA 要等周邊送單。'],
      ['me', '單我幫他們開好了，你簽就好。'],
      ['rep', '……你們 Testing 都這麼兇嗎。']]},
  {seg: 'tst_noon', when: isTst, t: 720, ring: ['周邊群組', '訊息', '看訊息'],
    lines: () => [['sys', '你在群組裡問：「早會的 FA action，誰 follow？」'],
      ['sys', '十分鐘過去了。已讀 12。']]},

  {seg: 'tst_pm', when: isTst, to: 'te', guide: '第二次跟催周邊，看回覆合不合理',
    lines: () => [['te', 'FA 進度：三台已拆，RF 天線接點有氧化。我們覺得是來料。'],
      ['me', '你上午說 NTF，現在說來料？']],
    mini: epmAsk('battle', [['te', '數據……還在整理。']], [
      ['拿測試數據逐項打回去', 'data', {f1: 4, ctb: 3, san: -8}],
      ['先讓他們把回覆格式交齊', 'form', {san: 2, ctb: -2}]]),
    post: () => ST.d.battle === 'data'
      ? [['sys', '你把 fail 分布、測項、時間軸攤在桌上。志明沉默了很久。'], ['te', '好，我回去重新看。']]
      : [['te', '格式我今天交。'], ['me', '（格式交齊了，原因還是沒有。）']]},

  {seg: 'tst_fa', when: isTst, to: 'fabench', guide: '在 FA 桌召開 FA 會議',
    lines: () => [['sys', 'FA 會議。周邊、維修、Assembly 都到了。'],
      ['rep', '三台拆完，天線接點氧化，位置一樣。'],
      ['te', '我們還在比對來料批次。']],
    mini: epmAsk('fam', [['me', '（每個 action 都要有人認領，不然明天又是同一場會。）']], [
      ['當場分 owner 與 ETA', 'assign', {f1: 5, ctb: 3, san: -5}],
      ['先記下來，會後再分', 'record', {san: 3, f1: -3}]]),
    post: () => ST.d.fam === 'assign'
      ? [['sys', '白板上寫滿名字和日期。散會時沒有人看你。']]
      : [['sys', '會議記錄寄出去了。四個 action，零個 owner。']]},

  {seg: 'tst_wrap', when: isTst, to: 'boss', guide: '在 Daily wrap up 報告 FA 進度',
    lines: () => [['boss', 'Yield 跟 FA 的進度？'],
      ['me', ST.d.battle === 'data' ? 'RF fail 確認不是 NTF，天線接點氧化，周邊在比對來料批次。' : '周邊說是來料，還在整理數據。'],
      ['cmd', '哪一批？給我批號，我去查供應商。'],
      ['f1', ST.d.fam === 'assign' ? '明天早會我要看比對結果。' : '明天早會，我要看到每個 action 的 owner。']]},

  {seg: 'tst_hand', when: isTst, to: 'rep', guide: '寫交接給維修，請他整理出機明細',
    lines: () => [['rep', '今晚的機台我會修。出機明細明天早上給你。'],
      ['me', '氧化的那幾台先別動，FA 要留著。'],
      ['rep', '知道啦。']]},

  {seg: 'tst_night', when: isTst, ring: ['XXT 群組', '99+ 則訊息', '打開'],
    lines: () => [['sys', 'XXT、維信、iMessage，三個群組同時跳紅點。'],
      ['sys', '一台 retest 又 fail、一個治具校正過期、F1 問明天的 Yield 預估。']],
    mini: epmAsk('night', [['me', '（現在十點。）']], [
      ['一則一則回完', 'all', {san: -12, f1: 4}],
      ['只回 F1 的，其他明早再說', 'f1', {san: 4, f1: -2}]]),
    post: () => ST.d.night === 'all'
      ? [['sys', '回完最後一則，時鐘跳到 22:40。']]
      : [['sys', '你回了 F1，把手機翻過去。']],
    after() {ST.clock = Math.max(ST.clock, ST.d.night === 'all' ? 1360 : 1350); hud()}},
  {seg: 'tst_night', when: isTst, end: true, t: 1350,
    lines: () => [['sys', ST.d.night === 'all' ? '22:40。所有群組都清空了，暫時。' : '22:30。群組的紅點還在跳，但你不看了。']]}
);

TST_SUBS.fa.recap = () => [
  ST.d.yield === 'log' ? '你要周邊附上 fail log：NTF 不再是一句話就能過關。' : '你先收下了 NTF，F1 在早會當場問了。',
  ST.d.battle === 'data' ? '你拿數據打回去，RF fail 確認不是 NTF。' : '周邊交齊了格式，原因還在路上。',
  ST.d.fam === 'assign' ? 'FA 會議每個 action 都有 owner 和 ETA。' : 'FA 會議記錄寄出去了，owner 欄位是空的。'
];
