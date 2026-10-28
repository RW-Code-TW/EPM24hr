/* MLB EPM 的一天：08:00 看 SMA／Test 進度 → 22:00 遠端顧線。早會 09:00、晚會 15:30，比別人早。
   ST.d.doe（F1 的 DOE 需求：add 明天加打／lock 先 lockdown 原計畫）、ST.d.bm（缺料：have 先打有料的板／wait 等料照原順序）、
   ST.d.alloc（主板分配：tst 先給 Testing 做 FA／asm 先給 Assembly 衝量）。 */
Object.assign(STORY.segs, {
  mlb_am: {name: '看 SMA 進度', sub: '昨晚打了幾片板？', t: 480, mood: 'day', scene() {atDesk(); if (W) {W.screen('smt', ['SMA', 'INPUT 520/600'], '#ffc94a'); W.tower('smt', 'amber')}}},
  mlb_sync: {name: 'Sync-up meeting', sub: 'MLB 的早會比大家早一個小時。', t: 540, mood: 'day', scene() {atMeeting()}},
  mlb_fu: {name: '發布生產目標', sub: '客戶的 action，變成線上的任務。', t: 600, mood: 'day', scene() {atWork()}},
  mlb_doe: {name: '整理 DOE 需求', sub: '幫客戶把明天的計畫 lockdown。', t: 660, mood: 'day', scene() {atWork()}},
  mlb_pm: {name: 'BM 與欠料', sub: '下午一點半，CTB 又有紅字。', t: 810, mood: 'day', scene() {atWork()}},
  mlb_wrap: {name: 'Wrap up meeting', sub: 'SMA input plan 與 build status。', t: 930, mood: 'day', scene() {atMeeting()}},
  mlb_adj: {name: '調整計畫', sub: '客戶的需求又變了。', t: 990, mood: 'eve', scene() {atWork()}},
  mlb_eve: {name: '晚班目標', sub: '把晚班要做的事交給內部團隊。', t: 1050, mood: 'eve', scene() {atWork()}},
  mlb_rmt: {name: '遠端顧線', sub: '人在外面，心在 SMA。', t: 1170, mood: 'night', scene() {atDorm()}}
});

const isMlb = onRole('mlb');
STORY.beats.push(
  {seg: 'mlb_am', when: isMlb, to: 'smt', guide: '去 SMA 線找美玲看進度和生產 issue',
    lines: () => [['smt', '昨晚 SMA 打了 520 片，目標 600。有一盤料拋料率很高，換了兩次 feeder。'],
      ['me', 'Test 那邊呢？'],
      ['smt', '測了 480，fail 12。FATP 那邊昨天出貨也完成了。']]},
  {seg: 'mlb_am', when: isMlb, to: 'pc_mlb', guide: '更新 iMessage 進度給客戶，準備早會報告',
    lines: () => [['sys', '你把 SMA 520/600、Test 480、fail 12 打進 iMessage。'],
      ['f1', '（已讀）早會說。']]},

  {seg: 'mlb_sync', when: isMlb, to: 'boss', guide: '在 Sync-up meeting 報告 SMA 進度',
    lines: () => [['me', '昨晚 SMA 520/600，拋料的問題換 feeder 處理了，今天補 80 片。'],
      ['f1', '好。另外，明天我們想多打一批 DOE 板，50 片，改兩個零件。']],
    mini: epmAsk('doe', [['me', '（明天的 SMA 計畫已經排滿了。）']], [
      ['可以，明天加打 50 片 DOE', 'add', {f1: 6, ctb: -4, san: -6}],
      ['先 lockdown 原計畫，DOE 排後天', 'lock', {ctb: 4, f1: -3}]]),
    post: () => ST.d.doe === 'add'
      ? [['f1', '謝謝。DOE 的需求清單中午前給你。'], ['boss', '那原本的量呢？'], ['me', '我想辦法。']]
      : [['f1', '後天……好，但後天不能再延。']]},

  {seg: 'mlb_fu', when: isMlb, to: 'smt', guide: '發布生產目標給 MLB 內部團隊',
    lines: () => [['me', '今天目標：補 80 片、正常 600 片。' + (ST.d.doe === 'add' ? '明天多 50 片 DOE。' : '')],
      ['smt', ST.d.doe === 'add' ? '明天的鋼板要換耶，你確定？' : '好，照原計畫。'],
      ['me', '確定。主板跟物料的需求我等一下發給你。']],
    after() {if (W) {W.tower('smt', 'green'); W.screen('smt', ['SMA', 'INPUT 80/80'], '#7fe3c8')}}},

  {seg: 'mlb_doe', when: isMlb, to: 'pc_mlb', guide: '整理內部的 DOE 需求，交給客戶',
    lines: () => [['sys', '你收齊各單位的 DOE 需求：Testing 要 10 片做 FA、Assembly 要 20 片驗治具。'],
      ['sys', '你把它們整理成一張表寄給 F1，標題：「明日計畫 lockdown」。']]},

  {seg: 'mlb_pm', when: isMlb, to: 'cmd', guide: '去找 Commodity 小芸問欠料',
    lines: () => [['cmd', '那顆料？下午三點才會還倉。我也在追。'],
      ['me', '那我的 BM 打板順序要改了。']],
    mini: epmAsk('bm', [['cmd', '你要先打有料的嗎？']], [
      ['先打有料的板，缺料的排後面', 'have', {ctb: 5, san: -6}],
      ['等料到，照原順序打', 'wait', {ctb: -4, f1: 2}]]),
    post: () => ST.d.bm === 'have'
      ? [['smt', '（電話裡）又改順序？好啦好啦。']]
      : [['cmd', '三點一到我就通知你。']]},
  {seg: 'mlb_pm', when: isMlb, t: 870, to: 'pc_mlb', guide: '核對客戶的出貨計畫',
    lines: () => [['sys', '你對了一次客戶的出貨計畫：下週一要 1,200 片主板。'],
      ['sys', '照現在的打板速度，週日晚上剛好打完。剛好。']]},

  {seg: 'mlb_wrap', when: isMlb, to: 'boss', guide: '在 Wrap up meeting 報告 SMA input plan',
    lines: () => [['boss', 'SMA input plan？'],
      ['me', (ST.d.bm === 'have' ? '有料的板先打，' : '等料到照原順序打，') + '今天預計 ' + (ST.d.bm === 'have' ? '600' : '560') + ' 片。'],
      ['tst', '明天的 DOE 板，我要 10 片做 FA。'],
      ['asm', '我要 20 片驗治具。'],
      ['f1', '主板就那麼多，你們自己先排好。']]},

  {seg: 'mlb_adj', when: isMlb, ring: ['蝦倫（F1）', '來電', ANSWER],
    lines: () => [['f1', '主板分配我想改一下。FA 比較急，還是出貨比較急，你建議？']],
    mini: epmAsk('alloc', [['me', '（Testing 要 FA 的數據，Assembly 要衝出貨。）']], [
      ['主板先給 Testing 做 FA', 'tst', {f1: 4, ctb: -3}],
      ['主板先給 Assembly 衝出貨', 'asm', {ctb: 5, f1: -2}]]),
    post: () => [['f1', '好，照你說的。'], ['me', '（等一下 ' + (ST.d.alloc === 'tst' ? '阿哲' : '佩佩') + '一定會來找我。）']]},

  {seg: 'mlb_eve', when: isMlb, to: 'smt', guide: '把晚班生產目標和出貨計畫交給內部團隊',
    lines: () => [['me', '晚班目標 600 片，' + (ST.d.alloc === 'tst' ? '前 10 片給 Testing。' : '先給 Assembly。')],
      ['smt', '晚班的人我會交代。你今天幾點走？'],
      ['me', '更新完庫存就走。'],
      ['smt', '你每天都這樣說。']]},
  {seg: 'mlb_eve', when: isMlb, t: 1110, to: 'pc_mlb', guide: '更新庫存，把最新 SMA 進度給客戶',
    lines: () => [['sys', '庫存更新完，SMA 進度寄給客戶。'],
      ['sys', '最後一分鐘，你又改了一次出貨計畫的備註。']]},

  {seg: 'mlb_rmt', when: isMlb, ring: ['美玲（SMA 線長）', '來電', ANSWER],
    lines: () => [['sys', '20:30。你剛吃到第一口晚餐。'],
      ['smt', '晚班的回焊爐溫度跳了一下，有 20 片要不要先 hold？'],
      ['me', '先 hold，拍照給我。我回客戶。']],
    after() {epmAdd({san: -5, f1: 2})}},
  {seg: 'mlb_rmt', when: isMlb, end: true, t: 1320,
    lines: () => [['sys', '22:00。最後一則客戶問題回完了。SMA 還在跑。']]}
);

ROLES.mlb.recap = () => [
  ST.d.doe === 'add' ? '你答應明天加打 50 片 DOE，SMA 要換鋼板。' : '明天的計畫 lockdown，DOE 排到後天。',
  ST.d.bm === 'have' ? '有料的板先打，美玲改了今天第三次順序。' : '你等料到才打，照原順序。',
  ST.d.alloc === 'tst' ? '主板先給 Testing 做 FA。' : '主板先給 Assembly 衝出貨。'
];
