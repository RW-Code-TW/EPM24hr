/* Testing EPM（Test rule）的一天：07:30 看 iMessage → 22:00 各大群組。客戶改一次，test rule 就改一版。
   ST.d.rcol（跟周邊串接：face 當面確認每一站／post 群組發公告）、ST.d.rver（v3：diff 附差異表／over 直接覆蓋）、
   ST.d.rzh（Assy EPM 說看不懂：zh 寫中文白話版／en 照英文版跑）、ST.d.reve（晚上又變：tonight 今晚改完／tmr 明早再生效）。 */
const ruleScreen = v => {if (W) W.screen('tst', ['TEST RULE', v], '#ffc94a')};
Object.assign(STORY.segs, {
  tsr_am: {name: '看工單', sub: '今天投入的工單，有沒有特殊工單？', t: 480, mood: 'day', scene() {atDesk(); ruleScreen('v1')}},
  tsr_hi: {name: '給客戶請安', sub: '九點，先去問 F1 今天有沒有特殊的 routine。', t: 540, mood: 'day', scene() {atWork()}},
  tsr_peri: {name: '跟周邊串接', sub: '今天的 test rule 和數據收集需求，每一站都要知道。', t: 570, mood: 'day', scene() {atWork()}},
  tsr_sync: {name: 'Daily sync up', sub: 'F1 的需求，在會議中更新。', t: 615, mood: 'day', scene() {atMeeting()}},
  tsr_v2: {name: '改 test rule', sub: '十一點半前發出去。', t: 660, mood: 'day', scene() {atWork(); ruleScreen('v1 → v2')}},
  tsr_noon: {name: '客戶 internal sync', sub: '十二點，F1 的內部會議結束了。', t: 720, mood: 'day', scene() {atWork(); ruleScreen('v2')}},
  tsr_asm: {name: '製造看不懂', sub: '兩點，阿哲拿著 test rule 走過來。', t: 840, mood: 'day', scene() {atWork(); if (W) W.put('asm', 'oc'); ruleScreen('v3')}},
  tsr_line: {name: '送到線上', sub: '四點半，拿去給蘿拉。', t: 990, mood: 'day', scene() {atWork()}},
  tsr_wrap: {name: 'Daily wrap up', sub: '今天改了幾版？', t: 1020, mood: 'eve', scene() {atMeeting()}},
  tsr_eve: {name: '又又又變', sub: '六點，iMessage 又亮了。', t: 1080, mood: 'eve', scene() {atWork()}},
  tsr_night: {name: '各大群組', sub: '流連於 XXT、維信、iMessage。', t: 1200, mood: 'night', scene() {atDorm()}}
});

const isRule = onTst('rule');
STORY.beats.push(
  {seg: 'tsr_am', when: isRule, to: 'pc_tst', guide: '打開今天的工單，找特殊工單',
    lines: () => [['sys', '07:30 你在捷運上就翻過 iMessage 了。F1 昨晚 23:48 只傳了一句：「明天再說。」'],
      ['sys', '今天投入四張工單。其中一張的備註寫著：「DOE，OTA 收 RF 原始數據」。'],
      ['me', '特殊工單。九點去問 蝦倫 到底要收什麼。']]},

  {seg: 'tsr_hi', when: isRule, to: 'f1', guide: '去 F1 辦公區給 蝦倫 請安',
    lines: () => [['me', '早安 蝦倫，今天有沒有特殊的 routine？'],
      ['f1', '那張 DOE 工單，OTA 站每台都要存 RF 原始數據，先收 100 台。'],
      ['f1', '其他照 test rule v1 跑。有變我會講。'],
      ['me', '（「有變我會講」的意思是：一定會變。）']]},

  {seg: 'tsr_peri', when: isRule, to: 'te', guide: '找周邊 TE 志明，交代今天的數據收集',
    lines: () => [['me', '志明，今天 DOE 工單在 OTA 要多存 RF 原始數據，先收 100 台。'],
      ['te', '多收？那每台 test time 會變長喔，線上的 UPH 會掉。']],
    mini: epmAsk('rcol', [['me', '（OTA、RF、retest 三個站，每一站的收法都可能不一樣。）']], [
      ['當面跟每一站確認收法與存放路徑', 'face', {ctb: 4, san: -6}],
      ['在群組發一則公告就好', 'post', {san: 3, ctb: -4}]]),
    post: () => ST.d.rcol === 'face'
      ? [['te', '好啦，存放路徑我貼在每一站的機台上。']]
      : [['sys', '公告發出去了。已讀 23，回覆 0。']]},

  {seg: 'tsr_sync', when: isRule, to: 'boss', guide: '在 Daily sync up 報告今天的 test rule',
    lines: () => [['boss', 'Testing，test rule 今天有什麼要注意的？'],
      ['me', 'DOE 工單 OTA 多存 RF 原始數據，先收 100 台。v1 已經發給周邊了。'],
      ['f1', '對了，100 台不夠。那張工單整張都要收。'],
      ['asm', '整張？那 OTA 要撥一條線專跑 DOE 吧，UPH 我先跟你說會掉。'],
      ['boss', '會後更新 test rule，十一點半前發出去。']]},

  {seg: 'tsr_v2', when: isRule, to: 'pc_tst', guide: '回座位，把 test rule 改成 v2',
    lines: () => [['sys', 'v2：DOE 工單整張收 RF 原始數據，OTA 1 專跑 DOE 工單。'],
      ['me', '改好、發出、請每一站回覆「收到」。'],
      ['sys', '11:28，發出去了。']],
    after() {ruleScreen('v2')}},

  {seg: 'tsr_noon', when: isRule, t: 720, ring: ['蝦倫（F1）', 'iMessage', '看訊息'],
    lines: () => [['f1', '我們 internal sync 剛結束。'],
      ['f1', 'RF 門檻從 -60 改成 -58，下午兩點以後投入的機台生效。'],
      ['me', '（又又要改。）']]},
  {seg: 'tsr_noon', when: isRule, to: 'pc_tst', guide: '回座位，把 test rule 改成 v3',
    lines: () => [['sys', 'v3 要改門檻、加生效時間。兩點前投入的照舊，兩點後的照新：同一條線上，兩套規則。']],
    mini: epmAsk('rver', [['me', '（v1、v2、v3，檔案長得一模一樣。）']], [
      ['附一張 v2 → v3 差異表再發', 'diff', {f1: 4, san: -5}],
      ['直接覆蓋，發新版就好', 'over', {san: 2, ctb: -4}]]),
    post: () => ST.d.rver === 'diff'
      ? [['sys', '差異表只有三行：門檻、生效時間、適用工單。']]
      : [['sys', 'v3 發出去了。檔名：Test_rule_v3_final.xlsx。']],
    after() {ruleScreen('v3')}},

  {seg: 'tsr_asm', when: isRule, to: 'asm', guide: '阿哲來找你，聽他說',
    lines: () => [['asm', 'Test rule 太複雜啦！英文、門檻、生效時間，製造看不懂。'],
      ['asm', ST.d.rver === 'diff' ? '差異表是有幫助啦，但線上要的是「這台要不要多存一份數據」。' : '而且三個版本長得一模一樣，線上不知道現在要跑哪一版。'],
      ['me', '……']],
    mini: epmAsk('rzh', [['asm', '你給一句話就好：這台要怎麼跑。']], [
      ['寫一版中文白話加流程圖給製造', 'zh', {ctb: 5, f1: 2, san: -8}],
      ['請製造先照英文版跑，有問題再問我', 'en', {san: 3, ctb: -6}]]),
    post: () => ST.d.rzh === 'zh'
      ? [['asm', '有圖就好。四點半前可以嗎？'], ['sys', '15:00 到 16:30：改、改、改。']]
      : [['asm', '好吧……線上有問題，我叫蘿拉直接找你。']]},

  {seg: 'tsr_line', when: isRule, to: 'line', guide: '去組裝線找線長蘿拉',
    lines: () => ST.d.rzh === 'zh'
      ? [['line', '這張看得懂：DOE 的貼紅標、存數據；兩點後投入的照 -58。'],
        ['line', '早這樣寫就好了嘛。']]
      : [['line', '這個 -58，是要比它大還是比它小？'],
        ['line', '剛剛兩點後投入的有十台，我們照舊的跑了。'],
        ['me', '（十台要補測。）']]},

  {seg: 'tsr_wrap', when: isRule, to: 'boss', guide: '在 Daily wrap up 報告 test rule',
    lines: () => [['boss', 'Test rule 今天改了幾版？'],
      ['me', '三版。v3 下午兩點生效，' + (ST.d.rzh === 'zh' ? '線上有中文版。' : '線上照英文版跑。')],
      ['f1', ST.d.rcol === 'face' ? 'DOE 的原始數據我看到了，每一站都收得很完整。' : '早上的 DOE 機台，retest 站那份原始數據沒存到。'],
      ['boss', ST.d.rzh === 'zh' ? '中文版那張不錯，其他專案也拿去用。' : '照舊門檻跑的那十台，明天早上補測。']]},

  {seg: 'tsr_eve', when: isRule, t: 1080, ring: ['蝦倫（F1）', 'iMessage', '看訊息'],
    lines: () => [['f1', '明天開始 OTA 2 也要收原始數據。DOE 工單改成抽 50%。'],
      ['me', '（v4。）']]},
  {seg: 'tsr_eve', when: isRule, to: 'pc_tst', guide: '回座位，處理 v4',
    lines: () => [['sys', '18:00 到 19:00，第四版。']],
    mini: epmAsk('reve', [['me', '（現在發，周邊今晚就要改設定。明早發，F1 要多等半天。）']], [
      ['今晚改完發出去，明早生效', 'tonight', {f1: 5, san: -8}],
      ['回 蝦倫：明早 sync up 確認後再生效', 'tmr', {san: 3, f1: -3}]]),
    post: () => ST.d.reve === 'tonight'
      ? [['sys', 'v4 發出去是 19:10。檔名：Test_rule_v4_final_final.xlsx。']]
      : [['f1', '……好，明早第一件事。']],
    after() {ruleScreen(ST.d.reve === 'tonight' ? 'v4' : 'v3')}},

  {seg: 'tsr_night', when: isRule, ring: ['XXT 群組', '99+ 則訊息', '打開'],
    lines: () => [['sys', 'XXT、維信、iMessage，全部都在問 test rule。'],
      ['sys', '「現在跑哪一版？」「-58 是新的還是舊的？」「DOE 那張的數據存哪？」'],
      ['me', ST.d.reve === 'tonight' ? '每一題的答案都在 v4 裡。你一題一題貼過去。' : '你在每個群組回同一句：「明早 sync up 後統一公告。」']],
    after() {ST.clock = Math.max(ST.clock, 1320); hud()}},
  {seg: 'tsr_night', when: isRule, end: true, t: 1320,
    lines: () => [['sys', '22:00。' + (ST.d.reve === 'tonight' ? 'v4' : 'v3') + ' 是目前的最新版。暫時。']]}
);

TST_SUBS.rule.recap = () => [
  ST.d.rcol === 'face' ? '你當面跟每一站確認收法，DOE 的原始數據一份不少。' : '你在群組發了公告，retest 站那份原始數據沒存到。',
  ST.d.rver === 'diff' ? 'v3 附了差異表，大家知道改了哪三件事。' : 'v3 直接覆蓋，三個版本長得一模一樣。',
  ST.d.rzh === 'zh' ? '你寫了中文白話版，線上一次就看懂。' : '線上照英文版跑，十台照舊門檻、明天補測。',
  ST.d.reve === 'tonight' ? '晚上 v4 也發出去了。' : 'v4 留到明早 sync up 再生效。'
];
