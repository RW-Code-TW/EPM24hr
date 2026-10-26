/* Commodity EPM 的一天：08:00 KT 郵件 → 22:00 實際缺料版 CTB。
   ST.d.iqc（IQC 判退的料：push 特採／wait 等復判）、ST.d.alt（沒到港的料：swap 改料／down downselection）、
   ST.d.ret（PD 還料：go 自己去搬／shift 工單往後挪）、ST.d.kitOk、ST.d.kitBad（ok2kit 發對幾張、發錯幾張）。 */
Object.assign(STORY.segs, {
  cmd_am: {name: '打開 KT 郵件', sub: '昨晚的缺料 CTB 在等你。', t: 480, mood: 'day', scene() {atDesk()}},
  cmd_sync: {name: 'Daily sync up', sub: 'F1、主管、五條線的 EPM 都在。', t: 615, mood: 'day', scene() {atMeeting()}},
  cmd_noon: {name: '會後版 CTB', sub: '會上講的每一個 ETA，現在都要寫下來。', t: 720, mood: 'day', scene() {atWork()}},
  cmd_pm: {name: '隔天的 CTB', sub: '明天十二張工單，四百多顆料。', t: 840, mood: 'day', scene() {atWork()}},
  cmd_wrap: {name: 'Daily wrap up', sub: '晚會版 CTB 要先整理好。', t: 1020, mood: 'eve', scene() {atMeeting()}},
  cmd_kit: {name: 'ok2kit', sub: '料齊了沒？發出去就收不回來。', t: 1080, mood: 'eve', scene() {atWork()}},
  cmd_late: {name: '實際缺料版 CTB', sub: '今天最後一封信。', t: 1200, mood: 'night', scene() {atWork()}}
});

const isCmd = onRole('cmd');
STORY.beats.push(
  {seg: 'cmd_am', when: isCmd, to: 'pc_cmd', guide: '打開電腦看 KT 郵件',
    lines: () => [['sys', '收件匣 47 封未讀。最上面一封：「CTB shortage list」。'],
      ['sys', '三顆料還卡著：一顆連接器被 IQC 判退、一顆借給別線還沒還、一顆根本還沒到港。'],
      ['me', '先去倉庫把前兩顆問清楚。']]},
  {seg: 'cmd_am', when: isCmd, to: 'iqc', guide: '去物料倉找 IQC 阿珠問復判',
    lines: () => [['iqc', '你說那顆連接器？昨晚判退，外觀刮傷，十盤裡有三盤。'],
      ['iqc', '要復判就等 QA 簽，最快下午。']],
    mini: epmAsk('iqc', [['me', '（下午才有結果，工單中午就要上線……）']], [
      ['拜託先走特採，中午就要上線', 'push', {ctb: 8, f1: -4, san: -5}],
      ['照流程，等 QA 復判', 'wait', {ctb: -6, f1: 4}]]),
    post: () => ST.d.iqc === 'push'
      ? [['iqc', '好啦，我去找 QA 簽特採。出事你要扛喔。']]
      : [['iqc', '好，有結果第一個通知你。'], ['me', '（中午那張工單，大概要往後挪了。）']]},
  {seg: 'cmd_am', when: isCmd, to: 'pd', guide: '找 PD 小林確認還料',
    lines: () => [['pd', '昨天借給 B 線的那批？今天中午前還倉。'],
      ['me', '確定中午？'],
      ['pd', '……盡量。']]},
  {seg: 'cmd_am', when: isCmd, t: 540, ring: ['Mandy（F1）', '來電', ANSWER],
    lines: () => [['f1', '初版 CTB 我看到了。第三顆料到港要後天，你們有沒有替代料？'],
      ['f1', '還是這批 config 先拿掉？我九點半前要回上面。']],
    mini: epmAsk('alt', [['me', '（二供的料倉庫有，但還沒做過這個 config。）']], [
      ['提改料：用二供的料', 'swap', {ctb: 6, f1: 2, san: -8}],
      ['建議 downselection，這批先不做', 'down', {ctb: -4, f1: 5}]]),
    post: () => ST.d.alt === 'swap'
      ? [['f1', '好。二供的料的驗證文件下午給我，我才能簽。']]
      : [['f1', '可以，我去跟上面講。Special list 記得更新。']]},
  {seg: 'cmd_am', when: isCmd, t: 570, to: 'pc_cmd', guide: '整理會議版 CTB 和 Special list',
    lines: () => [['sys', '你把 IQC issue 標紅、' + (ST.d.alt === 'swap' ? '改料' : 'downselection') + '標黃，Special list 多了兩行。'],
      ['sys', '10:10。存檔，抱著筆電往會議室跑。']]},

  {seg: 'cmd_sync', when: isCmd, to: 'boss', guide: '在 Daily sync up 報告 CTB',
    lines: () => [['boss', 'Commodity 先報。'],
      ['me', '今天卡三顆料。' + (ST.d.iqc === 'push' ? '連接器走特採，中午可以上線。' : '連接器在等 QA 復判，中午那張工單要往後挪。')],
      ['asm', '等一下，所以我早上 kit to line 少的就是這顆？'],
      ['f1', ST.d.iqc === 'push' ? '特採的批次，FA 要特別標出來。Testing 有聽到嗎？' : '工單往後挪，出貨會不會受影響？Shipping？'],
      [ST.d.iqc === 'push' ? 'tst' : 'shp', ST.d.iqc === 'push' ? '有，我會請周邊盯。' : '……我回去算一下。'],
      ['boss', '好。ETA 都寫進會後版 CTB，十二點前發。']]},

  {seg: 'cmd_noon', when: isCmd, to: 'pc_cmd', guide: '整理會後版 CTB，更新 iMessage',
    lines: () => [['sys', '你把會後版 CTB 貼進 iMessage 群組。三十秒內四個已讀，零個回覆。']]},
  {seg: 'cmd_noon', when: isCmd, t: 750, ring: ['小林（PD）', '訊息', '去找他'], to: 'pd', guide: '去物料倉找小林',
    lines: () => [['pd', '那個……還料卡在 B 線，他們還沒下線，要到三點。']],
    mini: epmAsk('ret', [['me', '（三點才還，下午那張工單就趕不上了。）']], [
      ['自己去 B 線把料搬回來', 'go', {ctb: 6, san: -12}],
      ['更新 CTB，工單往後挪', 'shift', {ctb: -5, f1: -2}]]),
    post: () => ST.d.ret === 'go'
      ? [['sys', '你推著料車穿過半個廠。B 線的線長看你的眼神很複雜。'], ['pd', '……你下次先跟我說一聲啦。']]
      : [['pd', '好，三點一到我馬上還。'], ['me', '（「馬上」也要寫進 CTB 嗎？）']]},

  {seg: 'cmd_pm', when: isCmd, to: 'pc_cmd', guide: '排查隔天工單的 CTB',
    lines: () => [['sys', '明天十二張工單、四百多顆料。你一行一行拉交期。'],
      ['sys', '有一家供應商回「下週到」。下週哪一天，沒有人說得清楚。']]},
  {seg: 'cmd_pm', when: isCmd, t: 900, to: 'f1', guide: '找 F1 核對隔天 CTB 和改料',
    lines: () => ST.d.alt === 'swap'
      ? [['f1', '二供的料的驗證文件呢？'], ['me', '品保剛寄給我，我轉給你。'], ['f1', '好，我簽了。明天的 CTB 可以把它算進去。']]
      : [['f1', 'downselection 那批，上面同意了。'], ['f1', '不過下週要補回來，ECTB 要先排好。'], ['me', '好，我今晚一起排。']],
    after() {epmAdd(ST.d.alt === 'swap' ? {f1: 3} : {san: -4})}},

  {seg: 'cmd_wrap', when: isCmd, to: 'boss', guide: '在 Daily wrap up 報告晚會版 CTB',
    lines: () => [['boss', '晚會版 CTB。今天卡的料呢？'],
      ['me', (ST.d.ret === 'go' ? '借出去的料我下午搬回來了，' : '借出去的料三點才還，工單往後挪了一張，') + '明天十二張工單有十張料齊。'],
      ['mlb', '那顆料明天到幾點？我 SMA 要排打板順序。'],
      ['me', '供應商說早上，我寫十點。'],
      ['boss', ST.d.ctb >= 75 ? '不錯。ok2kit 今晚要發。' : '還差兩張。ok2kit 之前再對一次。']]},

  {seg: 'cmd_kit', when: isCmd, to: 'pc_cmd', guide: '核對改料，發 ok2kit',
    lines: () => [['sys', '晚上七點，辦公室剩一半的人。你打開 ok2kit 的清單。']],
    mini: miniKit,
    post: () => [['sys', ST.d.kitBad ? '郵件寄出去一分鐘後，你發現有一張料還沒齊。' : '四張工單的狀態，你都對過兩次了。'],
      ['sys', ST.d.kitBad ? '你又補了一封「更正」。' : '寄出。工單開好了。']]},

  {seg: 'cmd_late', when: isCmd, to: 'pc_cmd', guide: '整理 ECTB，發實際缺料版 CTB 給 F1',
    lines: () => [['sys', 'ECTB 拉到下週五，Special list 又多一行。'],
      ['sys', '21:40，實際缺料版 CTB 寄給 F1。'],
      ['f1', '（已讀）']]},
  {seg: 'cmd_late', when: isCmd, end: true, t: 1320,
    lines: () => [['sys', '22:00。你闔上筆電。明天早上八點，KT 郵件又會是滿的。']]}
);

/* ok2kit：明天的四張工單，料齊的才發。發了缺料的工單，線上明天會停在那裡 */
function miniKit(done) {
  const wos = [
    {id: 'WO-0412', note: '料齊', ok: true},
    {id: 'WO-0413', note: ST.d.iqc === 'push' ? '連接器特採放行' : '連接器等 QA 復判', ok: ST.d.iqc === 'push'},
    {id: 'WO-0414', note: '料齊', ok: true},
    {id: 'WO-0415', note: ST.d.alt === 'swap' ? '二供的料已簽核' : 'downselection，這批不做', ok: ST.d.alt === 'swap'}
  ];
  const on = wos.map(() => false);
  const draw = () => {
    setPanel('<p>勾選今晚要發 ok2kit 的工單：</p>'
      + wos.map((w, i) => '<div class="row"><button class="btn' + (on[i] ? ' btn-primary' : '') + '" id="wo' + i + '" type="button" aria-pressed="' + on[i] + '">'
        + (on[i] ? '✓ ' : '') + w.id + '</button><span>' + w.note + '</span></div>').join('')
      + '<p class="fine">發出去之前，再看一次每一張的狀態。</p>' + nextBtn('寄出 ok2kit'), 'ok2kit');
    wos.forEach((w, i) => {$('#wo' + i).onclick = () => {on[i] = !on[i]; SFX.blip(); draw()}});
    $('#next').onclick = () => {
      ST.d.kitOk = wos.filter((w, i) => on[i] && w.ok).length;
      ST.d.kitBad = wos.filter((w, i) => on[i] && !w.ok).length;
      const miss = wos.filter((w, i) => !on[i] && w.ok).length;
      hidePanel();
      epmAdd({ctb: ST.d.kitOk * 4 - miss * 3 - ST.d.kitBad * 6, f1: -ST.d.kitBad * 5});
      done();
    };
  };
  draw();
}

ROLES.cmd.recap = () => [
  ST.d.iqc === 'push' ? '那顆連接器走特採上線了，FA 名單上多了一個標記。' : '那顆連接器等到 QA 復判，工單晚了半天。',
  ST.d.alt === 'swap' ? '二供的料簽核過了，明天正式上線。' : '那批 config 先拿掉，下週要補回來。',
  ST.d.ret === 'go' ? '你推著料車穿過半個廠，B 線的人記住你了。' : 'PD 的「盡量」，今天是三點。',
  'ok2kit 發對 ' + (ST.d.kitOk || 0) + ' 張' + (ST.d.kitBad ? '，發錯 ' + ST.d.kitBad + ' 張。' : '，沒有發錯。')
];
