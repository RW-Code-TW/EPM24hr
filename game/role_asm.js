/* Assembly EPM 的一天：08:00 開線異常 → 隔天 06:00 晚班交接。唯一真的上滿 24 小時的位子。
   ST.d.open（開線：run 先開線／stop 停線對料）、ST.d.seq（流線順序：doe 照客戶／vol 先衝量）、
   ST.d.fa（FA 匯報：truth 照實講／blame 推給來料）、ST.d.night（半夜治具壞：back 回廠／remote 遠端）。 */
Object.assign(STORY.segs, {
  asm_am: {name: '開線', sub: '八點，線上已經在等料。', t: 480, mood: 'day', scene() {atDesk(); if (W) {W.tower('asm', 'amber'); W.screen('asm', ['FATP', 'UPH 0 / 120'], '#ffc94a')}}},
  asm_prep: {name: 'Build status', sub: '會前要把五份報表串起來。', t: 570, mood: 'day', scene() {atWork()}},
  asm_sync: {name: 'Daily sync up', sub: '流線順序，今天由會議決定。', t: 615, mood: 'day', scene() {atMeeting()}},
  asm_noon: {name: '中午的 build status', sub: '異常處理和 HL，沒有午休這個欄位。', t: 660, mood: 'day', scene() {atWork()}},
  asm_fa: {name: 'Assembly FA', sub: '三點要匯報，現在兩點。', t: 840, mood: 'day', scene() {atWork()}},
  asm_wrap: {name: 'Daily wrap up', sub: 'Build status 與 line efficiency。', t: 1050, mood: 'eve', scene() {atMeeting()}},
  asm_hand: {name: '白晚班交接', sub: '晚班的線長八點到。', t: 1080, mood: 'eve', scene() {atWork()}},
  asm_ns: {name: '晚班開線', sub: '辦公室的燈關了一半。', t: 1200, mood: 'night', scene() {atWork(); nightOff()}},
  asm_mid: {name: '半夜', sub: '手機在桌上震動。', t: 1440, mood: 'night', scene() {atDorm()}},
  asm_dawn: {name: '晚班 build status', sub: '天快亮了。', t: 1770, mood: 'eve', scene() {atDesk(); nightOff()}}
});

const isAsm = onRole('asm');
STORY.beats.push(
  {seg: 'asm_am', when: isAsm, to: 'line', guide: '去組裝線找蘿拉處理開線異常',
    lines: () => [['line', '來了來了。kit to line 少一顆料，對料清單跟實物對不上，SFC 綁定也在報錯。'],
      ['line', '三個問題，你要先解哪個？我比較想先開線。']],
    mini: epmAsk('open', [['me', '（對料清單沒對完就開線，出錯就是整批重工。）']], [
      ['先開線，缺的工站後補', 'run', {ctb: 6, f1: -3, san: -5}],
      ['停線，把對料清單對完再開', 'stop', {ctb: -6, f1: 4}]]),
    post: () => ST.d.open === 'run'
      ? [['line', '好！開線！'], ['sys', '輸送帶動起來了。第三站空著。']]
      : [['line', '……好啦，對就對。'], ['sys', '你跟蘿拉一站一站對料。九點，線才開起來。']],
    after() {if (W) {W.tower('asm', 'green'); W.screen('asm', ['FATP', ST.d.open === 'run' ? 'UPH 96 / 120' : 'UPH 60 / 120'], '#7fe3c8')}}},
  {seg: 'asm_am', when: isAsm, to: 'asmline', guide: '查 SFC 綁定異常',
    lines: () => [['sys', 'SFC 跳紅字：「序號已綁定」。'],
      ['me', '是昨天晚班重複刷了一次。請 IT 解綁，順便寫進交接。']]},

  {seg: 'asm_prep', when: isAsm, to: 'pc_asm', guide: '準備 Build status 和各種 tracker',
    lines: () => [['sys', 'Build status、Snap tracker、Sub line yield、Input tracker、前一天 NS line efficiency。'],
      ['sys', '五份報表，三種格式，兩份的數字對不起來。'],
      ['me', '晚班的 line efficiency 怎麼是 112%……又有人把標準工時填錯了。']]},

  {seg: 'asm_sync', when: isAsm, to: 'boss', guide: '在 Daily sync up 報告開線狀況',
    lines: () => [['boss', 'Assembly，今天開線狀況？'],
      ['me', ST.d.open === 'run' ? '八點準時開線，第三站缺料，Commodity 在追。' : '對料清單有問題，九點才開線，目前 UPH 60。'],
      ['cmd', '那顆料中午前會到，我盯著。'],
      ['f1', '今天的流線，先跑 DOE 的機台。我們下午就要數據。']],
    mini: epmAsk('seq', [['me', '（先跑 DOE，主力 config 今天就做不滿。）']], [
      ['照客戶的要求，先跑 DOE 機台', 'doe', {f1: 6, ctb: -4}],
      ['主力 config 先衝量，DOE 排下午', 'vol', {ctb: 5, f1: -5}]]),
    post: () => ST.d.seq === 'doe'
      ? [['f1', '謝謝。數據出來第一個給我。']]
      : [['f1', '下午……好吧，三點前我要看到。'], ['boss', '（看了你一眼）']]},

  {seg: 'asm_noon', when: isAsm, to: 'line', guide: '跟蘿拉調整流線順序',
    lines: () => [['line', ST.d.seq === 'doe' ? '又改？DOE 的機台要換治具耶。' : '衝量我喜歡。DOE 下午再說。'],
      ['me', '辛苦了。午餐我請。'],
      ['line', '這句話你上週也講過。']]},
  {seg: 'asm_noon', when: isAsm, t: 720, to: 'pc_asm', guide: '更新中午的 build status 到 iMessage',
    lines: () => [['sys', '你把 build status 截圖丟進群組。'],
      ['f1', '（已讀）DOE 的呢？']]},

  {seg: 'asm_fa', when: isAsm, to: 'fabench', guide: '整理 Assembly FA',
    lines: () => [['sys', '三台機台外觀刮傷、一台螺絲滑牙。你把照片一張一張串進 FA 簡報。'],
      ['rep', '刮傷的位置都一樣，應該是治具。不過還在查。']]},
  {seg: 'asm_fa', when: isAsm, t: 900, ring: ['蝦倫（客戶）', '來電', ANSWER],
    lines: () => [['f1', 'FA 匯報時間到了。刮傷的 root cause 是什麼？']],
    mini: epmAsk('fa', [['me', '（維修說是治具，但還沒有證據。）']], [
      ['照實講：疑似治具磨損，還在查', 'truth', {f1: 5, san: -3}],
      ['先說是來料問題', 'blame', {f1: -8, ctb: 2}]]),
    post: () => ST.d.fa === 'truth'
      ? [['f1', '好，明天早會給我治具的量測數據。']]
      : [['f1', '來料？那 Commodity 怎麼沒報？我等一下問小芸。'], ['me', '（完了。）']]},

  {seg: 'asm_wrap', when: isAsm, to: 'boss', guide: '在 wrap up 報告 build status 與 line efficiency',
    lines: () => [['boss', '今天做了幾台？'],
      ['me', ST.d.ctb >= 70 ? '目標 960，做了 912。line efficiency 94%。' : '目標 960，做了 780。下午 DOE 換治具卡了一小時。'],
      ['tst', '下線的機台我晚上就排測試。'],
      ['boss', '好。晚班的目標寫清楚，交接給晚班。']]},

  {seg: 'asm_hand', when: isAsm, to: 'line', guide: '跟蘿拉整理白晚班交接',
    lines: () => [['line', '晚班的線長八點到。交接單我幫你印好了。'],
      ['sys', '交接單上寫著：DOE 機 40 台、第三站料已補、治具待量測、SFC 綁定已解。'],
      ['me', '你先下班吧，蘿拉。'],
      ['line', '你也是。……你應該不會下班對吧。']]},

  {seg: 'asm_ns', when: isAsm, to: 'asmline', guide: '去看晚班開線狀況',
    lines: () => [['sys', '晚班開線了。輸送帶的聲音在空蕩的廠裡特別大。'],
      ['sys', '22:30，你更新晚班 build status。目前一切正常。'],
      ['me', '（目前。）']]},

  {seg: 'asm_mid', when: isAsm, ring: ['晚班線長', '來電', ANSWER],
    lines: () => [['sys', '00:40。宿舍。阿凱的螢幕還亮著，你的手機在桌上震動。'],
      ['sys', '（電話那頭）第五站的治具斷了一根定位銷，線停了。']],
    mini: epmAsk('night', [['me', '（備品在倉庫，鑰匙在我身上。）']], [
      ['開車回廠，親自處理', 'back', {ctb: 8, san: -20}],
      ['視訊遠端指揮換備品', 'remote', {ctb: 3, san: -8}]]),
    post: () => ST.d.night === 'back'
      ? [['byron', '這麼晚還要回廠？……門我幫你開。'], ['sys', '金屬探測門、靜電服，你穿著拖鞋出現在線上。一點二十分，線重新跑起來。']]
      : [['roomie', '你在跟誰視訊？'], ['sys', '你對著手機鏡頭比了四十分鐘。一點半，線重新跑起來。']],
    after() {if (ST.d.night === 'back') {wearSuit(true); if (W) W.put('me', 'asmx')}}},

  {seg: 'asm_dawn', when: isAsm, to: 'pc_asm', guide: '更新晚班 build status，整理交接',
    lines: () => [['sys', '05:30。晚班做了 ' + (ST.d.night === 'back' ? '430' : '400') + ' 台。'],
      ['sys', '你把晚班 build status 跟交接事項寄出去，標題寫「NS update」。']]},
  {seg: 'asm_dawn', when: isAsm, end: true, t: 1800,
    lines: () => [['sys', '06:00。天亮了。白班的蘿拉兩小時後到。'],
      ['sys', '你的 Daily sync up 在四小時之後。']]}
);

ROLES.asm.recap = () => [
  ST.d.open === 'run' ? '八點準時開線，第三站空了一個早上。' : '你們一站一站對完料，九點才開線，沒有重工。',
  ST.d.seq === 'doe' ? 'DOE 機台先跑，客戶下午拿到數據。' : '主力 config 先衝量，DOE 排到下午。',
  ST.d.fa === 'truth' ? '刮傷照實報：疑似治具，明天要給量測數據。' : '你說是來料，客戶轉頭去問了 Commodity。',
  ST.d.night === 'back' ? '半夜一點，你穿著拖鞋出現在線上。' : '半夜一點，你用手機鏡頭修好了一條線。'
];
