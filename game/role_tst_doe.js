/* Testing EPM（Offline／DOE）的一天：08:00 看進機分配 → 21:00 追蹤表存檔。每天無限輪迴，中間隨時有人來借機。
   ST.d.dstuck（卡六天的機台：out 先退出來／wait 等 SW）、ST.d.dreply（F1 加 10 台：split 照實回／all 先答應）、
   ST.d.dloan（工程借機：done 測完再借／lend 先借）、ST.d.dhl（每週 F1 review：open 卡關全攤開／green 只講綠燈）、
   ST.d.durs（build 後借機：push 一個一個推／mail 寄群組信）。 */
const labScreen = l2 => {if (W) W.screen('tst', ['OFFLINE', l2], '#ffc94a')};
Object.assign(STORY.segs, {
  tsd_am: {name: '看進機分配', sub: 'Offline 機台昨天進了哪幾間 lab？', t: 480, mood: 'day', scene() {atDesk(); labScreen('WL 18  EE 4  CSAR 9')}},
  tsd_lab: {name: '去 Offline lab', sub: '那台待了六天的機台，到底在等什麼？', t: 560, mood: 'day', scene() {atWork(); if (W) W.put('te', 'labx')}},
  tsd_sync: {name: 'Daily sync up', sub: 'F1 手上有新的 DOE 需求。', t: 615, mood: 'day', scene() {atMeeting()}},
  tsd_hw: {name: '確認 HW／SW', sub: '加的機台，板子跟軟體到底在不在？', t: 690, mood: 'day', scene() {atWork()}},
  tsd_loan: {name: '隨時隨地', sub: '簽修、借機、轉帳、出貨，一件接一件。', t: 780, mood: 'day', scene() {atWork()}},
  tsd_f1: {name: '每週 F1 review', sub: 'Mini build 之後每週一次，跟 F1 對進度。', t: 900, mood: 'day', scene() {atWork(); if (W) W.put('f1', 'm5')}},
  tsd_wrap: {name: 'Daily wrap up', sub: '今天的分配、明天的計畫。', t: 1020, mood: 'eve', scene() {atMeeting()}},
  tsd_wip: {name: 'WIP 收尾', sub: 'Build 快結束了，build 後的借機需求要先收齊。', t: 1110, mood: 'eve', scene() {atWork()}},
  tsd_night: {name: '無限輪迴', sub: '明天，再從第一步開始。', t: 1260, mood: 'night', scene() {atDorm()}}
});

const isDoe = onTst('doe');
STORY.beats.push(
  {seg: 'tsd_am', when: isDoe, to: 'pc_tst', guide: '打開追蹤表，看 offline 進機與分配',
    lines: () => [['sys', 'Offline 進機：Wireless 18 台、EE DOE 4 台、CSAR 9 台。'],
      ['sys', '有一台在 Wireless 待了六天，狀態欄寫著「等 SW」。'],
      ['me', 'Wireless 塞爆，EE DOE 在等機。那台六天的，要先去問。']]},
  {seg: 'tsd_am', when: isDoe, t: 510, ring: ['Nimbus', 'DOE list 更新', '打開'],
    lines: () => [['sys', 'Nimbus 上的 DOE list 從 v6 變成 v7：新增一組天線 DOE，20 台，下週一要。'],
      ['me', '追蹤表同步更新，通知 Wireless 和 EE DOE。今天投入的工單裡，哪幾台要走這組？']],
    after() {labScreen('DOE v7  +20')}},

  {seg: 'tsd_lab', when: isDoe, to: 'te', guide: '去 Offline lab 找志明，問那台六天的機台',
    lines: () => [['te', '那台喔，在等新版 SW。SW 說這週五。'],
      ['me', '它佔了 Wireless 一個 RF 位子六天。天線 DOE 還在排隊。'],
      ['te', '那你說，要退出來嗎？退出來就要重排喔。']],
    mini: epmAsk('dstuck', [['me', '（退出來，位子給天線 DOE；不退，天線 DOE 只能等。）']], [
      ['先退出來，位子讓給天線 DOE', 'out', {ctb: 5, san: -4}],
      ['等 SW，保留位子', 'wait', {san: 2, ctb: -5}]]),
    post: () => ST.d.dstuck === 'out'
      ? [['te', '好，下午退。退出來你要幫它簽修。']]
      : [['te', '好，那天線 DOE 只能排明天了。']]},

  {seg: 'tsd_sync', when: isDoe, to: 'boss', guide: '在 Daily sync up 報告 offline 進度',
    lines: () => [['boss', 'Offline 進度？'],
      ['me', 'Wireless 18、EE DOE 4、CSAR 9。' + (ST.d.dstuck === 'out' ? '一台等 SW 的今天退出，天線 DOE 下午進。' : '一台在等 SW，天線 DOE 要排到明天。')],
      ['f1', '天線 DOE 我要再加 10 台，要裝新版 SW 的。今天能進嗎？'],
      ['mlb', '新版 SW 的主板，我手上只有 6 片。'],
      ['boss', '會後確認 HW、SW 狀態，回覆 F1。']]},

  {seg: 'tsd_hw', when: isDoe, to: 'mlb', guide: '找 Ken 確認主板跟 SW 狀態',
    lines: () => [['mlb', '6 片已經燒好新版 SW。另外 4 片明天 SMA 才會打。'],
      ['me', '所以今天 6 台、明天 4 台。']],
    mini: epmAsk('dreply', [['me', '（F1 要的是 10 台。）']], [
      ['照實回 F1：今天 6 台、明天 4 台', 'split', {f1: 5, san: -2}],
      ['先答應 10 台，晚上再想辦法', 'all', {f1: 2, ctb: -6, san: -6}]]),
    post: () => ST.d.dreply === 'split'
      ? [['sys', '追蹤表多了兩欄：HW ready、SW ready。']]
      : [['mlb', '……那 4 片，你自己去跟美玲講。']]},

  {seg: 'tsd_loan', when: isDoe, t: 780, ring: ['阿德（維修）', '來電', ANSWER],
    lines: () => [['rep', '工程要借 3 台 offline 機去做 SW 驗證，借機單要你簽。'],
      ['rep', '還有 CSAR 測完的 5 台，要轉帳回成品倉。你過來一下。']]},
  {seg: 'tsd_loan', when: isDoe, to: 'rep', guide: '去 FA 室找阿德，處理借機與轉帳',
    lines: () => [['rep', '借機單我印好了，你簽名就好。'],
      ['me', '那 3 台還有兩個測項沒跑完。']],
    mini: epmAsk('dloan', [['rep', '工程說他們很急。']], [
      ['測完再借，請工程等到明天', 'done', {f1: 3, san: -3}],
      ['先借出去，回來再補測', 'lend', {ctb: 3, f1: -5}]]),
    post: () => ST.d.dloan === 'done'
      ? [['rep', '好啦。CSAR 那 5 台我先轉帳。'], ['me', '（Offline 機台測完就退出，位子才轉得動。）']]
      : [['sys', '三台機台離開了 offline。追蹤表多了一行：「待補測」。']]},

  {seg: 'tsd_f1', when: isDoe, to: 'f1', guide: '去會議室，跟 蝦倫 開每週 review',
    lines: () => [['f1', '這週的 offline 進度。有什麼要 highlight 給我的？']],
    mini: epmAsk('dhl', [['me', '（追蹤表上有綠的，也有紅的。）']], [
      ['把卡關的都攤開：SW、借機、補測', 'open', {f1: 6, san: -4}],
      ['挑綠燈的講，其他私下處理', 'green', {san: 2, f1: -6}]]),
    post: () => ST.d.dhl === 'open'
      ? [['f1', ST.d.dloan === 'lend' ? '借出去的那三台，回來第一優先補測。' : '好，這樣我知道要去催誰。']]
      : [['f1', ST.d.dstuck === 'wait' ? '……那 Wireless 那台待了六天的呢？我在系統上看到了。' : '……那三台借機呢？工程那邊已經跟我說了。']]},

  {seg: 'tsd_wrap', when: isDoe, to: 'boss', guide: '在 Daily wrap up 報告分配與明天的計畫',
    lines: () => [['boss', 'Offline 今天的分配，明天的計畫？'],
      ['me', ST.d.dreply === 'split' ? '天線 DOE 今天進 6 台，明天 4 台。' : '天線 DOE 10 台……今天先進了 6 台。'],
      ['f1', ST.d.dreply === 'all' ? '早上不是說 10 台？' : '好，明天那 4 台要準時。'],
      ['mlb', ST.d.dreply === 'all' ? '那 4 片明天下午才打得完。' : '4 片已經排進明天的 SMA。'],
      ['boss', '明天早會前，追蹤表更新好。']]},

  {seg: 'tsd_wip', when: isDoe, to: 'pc_tst', guide: '回座位，整理 build 後的借機需求',
    lines: () => [['sys', 'Build 後的借機需求：工程 12 台、RF 8 台、可靠度 6 台。還有兩個單位沒回。'],
      ['me', '清單寄給 F1，再推各單位自己提借機單。']],
    mini: epmAsk('durs', [['me', '（沒提單，build 結束那天就沒有機台可以借。）']], [
      ['一個一個打電話推', 'push', {ctb: 5, san: -7}],
      ['寄一封群組信，寫清楚截止時間', 'mail', {san: 3, ctb: -3}]]),
    post: () => ST.d.durs === 'push'
      ? [['sys', '兩個沒回的單位，九點前都提單了。']]
      : [['sys', '信寄出去了。截止時間：明天中午。']]},

  {seg: 'tsd_night', when: isDoe, end: true,
    lines: () => [['sys', '21:00。追蹤表最後一次存檔。'],
      ['sys', ST.d.durs === 'push' ? '所有借機單都在系統上了。' : '收件匣裡：已讀 6，回覆 1。'],
      ['sys', '明天早上八點：看進機分配、登入 Nimbus、排優先級、跟進度、排進機。再一次。']]}
);

TST_SUBS.doe.recap = () => [
  ST.d.dstuck === 'out' ? '卡了六天的機台退出來，天線 DOE 當天就進 lab。' : '你等了 SW，天線 DOE 排到明天。',
  ST.d.dreply === 'split' ? '你照實回 F1：今天 6 台、明天 4 台。' : '你先答應了 10 台，晚上只進得了 6 台。',
  ST.d.dloan === 'done' ? '借機等測完再放，追蹤表上沒有「待補測」。' : '三台先借出去，回來要補測。',
  ST.d.dhl === 'open' ? '每週 review，你把卡關的都攤給 F1 看。' : '每週 review 你只講綠燈，F1 自己在系統上看到了紅的。'
];
