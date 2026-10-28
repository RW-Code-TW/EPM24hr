/* Commodity EPM 的一天：08:00 KT 郵件 → 22:00（宿舍）實際缺料版 CTB。
   ST.d.iqc（IQC 判退的料：push 特採／wait 等復判）、ST.d.fc（新到料 FC：split 先投 pass 的／hold 整批等 AAE）、
   ST.d.alt（沒到港的料：swap 改料／down downselection）、ST.d.ret（PD 還料：go 自己去搬／shift 工單往後挪）、
   ST.d.sub（Sub 產出不夠：push 請周邊今晚補／cut 明天投入砍到產出的量）、ST.d.kitOk、ST.d.kitBad（ok2kit 發對幾張、發錯幾張）。 */
Object.assign(STORY.segs, {
  cmd_am: {name: '打開 KT 郵件', sub: '昨晚的缺料 CTB 在等你。', t: 480, mood: 'day', scene() {atDesk()}},
  cmd_fc: {name: '新到料 FC', sub: '昨晚到的料，今天能不能投？', t: 510, mood: 'day', scene() {atWork()}},
  cmd_ctb: {name: '初版缺料 CTB', sub: '九點，發給客戶確認改料。', t: 540, mood: 'day', scene() {atWork()}},
  cmd_sync: {name: 'Daily sync up', sub: '客戶、Project Lead、五條線的 EPM 都在。', t: 615, mood: 'day', scene() {atMeeting()}},
  cmd_mat: {name: '到料與發料', sub: '會一散，周邊單位就在等料。', t: 660, mood: 'day', scene() {atWork()}},
  cmd_noon: {name: '會後版 CTB', sub: '會上講的每一個 ETA，現在都要寫下來。', t: 720, mood: 'day', scene() {atWork()}},
  cmd_doe: {name: 'DOE Tracker', sub: '一點，更新 DOE 的料況。', t: 780, mood: 'day', scene() {atWork()}},
  cmd_pm: {name: '隔天的 CTB', sub: '明天十二張工單，四百多顆料。還有 Long Term CTB。', t: 840, mood: 'day', scene() {atWork()}},
  cmd_f1: {name: '跟客戶核對', sub: '隔天 CTB、改料、Rel CTB，一次對完。', t: 900, mood: 'day', scene() {atWork()}},
  cmd_eve: {name: '晚會版 CTB', sub: '四點半，Sub 的需求也要一起對。', t: 990, mood: 'eve', scene() {atWork()}},
  cmd_wrap: {name: 'Daily wrap up', sub: '開完會，新到的料還要繼續發。', t: 1020, mood: 'eve', scene() {atMeeting()}},
  cmd_kit: {name: 'ok2kit', sub: '料齊了沒？發出去就收不回來。', t: 1080, mood: 'eve', scene() {atWork()}},
  cmd_late: {name: '實際缺料版 CTB', sub: '回到宿舍，今天最後一封信。', t: 1200, mood: 'night', scene() {atDorm()}}
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

  {seg: 'cmd_fc', when: isCmd, ring: ['AAE', '訊息', '看訊息'],
    lines: () => [['aae', '昨晚到的兩批新料，FC 結果出來了：A 料 pass。'],
      ['aae', 'B 料有 2 顆 fit 不良，卡扣對不上。其他的看起來 OK。'],
      ['pd', '（在旁邊）所以 B 料到底能不能投？線上在問了。']],
    mini: epmAsk('fc', [['me', '（B 料不投，下午那張工單就開不了。）']], [
      ['A 料先投；B 料退 IQC sorting，挑過的再投', 'split', {ctb: 5, san: -4}],
      ['兩批都等 AAE 確認完再投', 'hold', {ctb: -5, f1: 3}]]),
    post: () => ST.d.fc === 'split'
      ? [['pd', '好，A 料我先發。B 料我拉去 IQC。'], ['iqc', '（遠遠地）又要 sorting？好啦。']]
      : [['aae', '我中午前給你結論。'], ['me', '（初版 CTB 先把 B 料標黃。）']]},

  {seg: 'cmd_ctb', when: isCmd, ring: ['蝦倫（客戶）', '來電', ANSWER],
    lines: () => [['f1', '初版 CTB 我看到了。第三顆料到港要後天，你們有沒有替代料？'],
      ['f1', '還是這批 config 先拿掉？我九點半前要回上面。']],
    mini: epmAsk('alt', [['me', '（二供的料倉庫有，但還沒做過這個 config。）']], [
      ['提改料：用二供的料', 'swap', {ctb: 6, f1: 2, san: -8}],
      ['建議 downselection，這批先不做', 'down', {ctb: -4, f1: 5}]]),
    post: () => ST.d.alt === 'swap'
      ? [['f1', '好。二供的料的驗證文件下午給我，我才能簽。']]
      : [['f1', '可以，我去跟上面講。Special list 記得更新。']]},
  {seg: 'cmd_ctb', when: isCmd, t: 570, to: 'pc_cmd', guide: '整理會議版 CTB、Special list 和 IQC issue highlights',
    lines: () => [['sys', '你把 IQC issue 標紅、' + (ST.d.alt === 'swap' ? '改料' : 'downselection') + '標黃，Special list 多了兩行。'],
      ['sys', ST.d.fc === 'split' ? 'IQC highlights 第一條：B 料 sorting 中。' : 'IQC highlights 第一條：B 料等 AAE 結論。'],
      ['sys', '10:10。存檔，抱著筆電往會議室跑。']]},

  {seg: 'cmd_sync', when: isCmd, to: 'boss', guide: '在 Daily sync up 報告 CTB',
    lines: () => [['boss', 'Commodity 先報。'],
      ['me', '今天卡三顆料。' + (ST.d.iqc === 'push' ? '連接器走特採，中午可以上線。' : '連接器在等 QA 復判，中午那張工單要往後挪。')],
      ['asm', '等一下，所以我早上 kit to line 少的就是這顆？'],
      ['f1', ST.d.iqc === 'push' ? '特採的批次，FA 要特別標出來。Testing 有聽到嗎？' : '工單往後挪，出貨會不會受影響？Shipping？'],
      [ST.d.iqc === 'push' ? 'tst' : 'shp', ST.d.iqc === 'push' ? '有，我會請周邊盯。' : '……我回去算一下。'],
      ['boss', '好。ETA 都寫進會後版 CTB，十二點前發。']]},

  {seg: 'cmd_mat', when: isCmd, to: 'whs', guide: '去物料倉確認到料、幫周邊單位發料和系統簽單',
    lines: () => [['sys', '物料倉門口排了三個單位：Assembly 要補料、MLB 要 DOE 的料、Testing 要治具備品。'],
      ['sys', '你一張一張在系統上簽單。簽到第七張，系統逾時登出。'],
      ['pd', '重登一次就好啦。……剛剛那六張要重簽喔。'],
      ['me', '（深呼吸。）']],
    after() {epmAdd({san: -4, ctb: 2})}},

  {seg: 'cmd_noon', when: isCmd, to: 'pc_cmd', guide: '整理會後版 CTB，更新 iMessage',
    lines: () => [['sys', '你把會後版 CTB 貼進 iMessage 群組。三十秒內四個已讀，零個回覆。']]},
  {seg: 'cmd_noon', when: isCmd, t: 750, ring: ['小林（PD）', '訊息', '去找他'], to: 'pd', guide: '去物料倉找小林',
    lines: () => [['pd', '那個……還料卡在 B 線，他們還沒下線，要到三點。'],
      ['pd', '對了，隔天工單的 CTB 排查你也要一起看喔，下午兩點前。']],
    mini: epmAsk('ret', [['me', '（三點才還，下午那張工單就趕不上了。）']], [
      ['自己去 B 線把料搬回來', 'go', {ctb: 6, san: -12}],
      ['更新 CTB，工單往後挪', 'shift', {ctb: -5, f1: -2}]]),
    post: () => ST.d.ret === 'go'
      ? [['sys', '你推著料車穿過半個廠。B 線的線長看你的眼神很複雜。'], ['pd', '……你下次先跟我說一聲啦。']]
      : [['pd', '好，三點一到我馬上還。'], ['me', '（「馬上」也要寫進 CTB 嗎？）']]},

  {seg: 'cmd_doe', when: isCmd, to: 'pc_cmd', guide: '更新 DOE Tracker 的 Material Status',
    lines: () => [['sys', 'DOE Tracker 一共 14 組。每一組的料：到了、在路上、還沒下單。'],
      ['mlb', '（隔壁桌探頭）DOE 第 6 組的料到了沒？我明天要打板。'],
      ['me', ST.d.fc === 'split' ? 'A 料到了，B 料在 sorting。你先排 A 的。' : '兩批都在等 AAE 結論。下午給你答案。']]},

  {seg: 'cmd_pm', when: isCmd, to: 'pc_cmd', guide: '排查隔天的 CTB，確認到料交期',
    lines: () => [['sys', '明天十二張工單、四百多顆料。你一行一行拉交期。'],
      ['sys', '有一家供應商回「下週到」。下週哪一天，沒有人說得清楚。']]},
  {seg: 'cmd_pm', when: isCmd, t: 870, to: 'pc_cmd', guide: '做 Long Term CTB 並寄出，原物料和 Sub 繼續發料',
    lines: () => [['sys', 'Long Term CTB：往後看四週。第三週有一顆電阻會缺，現在不追，到時候就是整條線停。'],
      ['sys', '寄出。順手又簽了四張原物料和 Sub 的發料單。']]},

  {seg: 'cmd_f1', when: isCmd, to: 'f1', guide: '找客戶核對隔天 CTB 和改料，並說明 Rel CTB',
    lines: () => (ST.d.alt === 'swap'
      ? [['f1', '二供的料的驗證文件呢？'], ['me', '品保剛寄給我，我轉給你。'], ['f1', '好，我簽了。明天的 CTB 可以把它算進去。']]
      : [['f1', 'downselection 那批，上面同意了。'], ['f1', '不過下週要補回來，ECTB 要先排好。'], ['me', '好，我今晚一起排。']])
      .concat([['me', '另外，Rel CTB 我做好了。要 highlight 一件事：主板的 stuffing 有一顆料只夠 60 台。'],
        ['f1b', '（Y陳從旁邊探頭）Rel 只能做 60 台的話，出貨那邊也要先知道喔。']]),
    after() {epmAdd(ST.d.alt === 'swap' ? {f1: 3} : {san: -4})}},
  {seg: 'cmd_f1', when: isCmd, t: 930, to: 'mlb', guide: '找 Ken 核對 MLB 出貨和 Sub 產出夠不夠',
    lines: () => [['mlb', 'MLB 明天出 600 片，夠。'],
      ['mlb', '可是 Sub 今天只產出 170，明天的需求是 200。差 30。']],
    mini: epmAsk('sub', [['me', '（明天的 special list，就看這 30 個怎麼算。）']], [
      ['請周邊今晚加班補 Sub', 'push', {ctb: 5, san: -6}],
      ['明天的 Sub 投入先砍到產出的量', 'cut', {ctb: -3, f1: 3}]]),
    post: () => ST.d.sub === 'push'
      ? [['mlb', '好，我跟美玲講，晚班補 30。'], ['sys', '你把「Sub 晚班補 30」寫進隔天的 special list。']]
      : [['mlb', '那明天 Assembly 會少 30 台喔。'], ['sys', '你把「Sub 投入 170」寫進隔天的 special list。']]},

  {seg: 'cmd_eve', when: isCmd, to: 'pc_cmd', guide: '整理晚會版 CTB，跟周邊確認 Sub 需求和投入計畫',
    lines: () => [['sys', '晚會版 CTB：十二張工單，' + (ST.d.ret === 'go' ? '十張料齊' : '九張料齊') + '。'],
      ['sys', 'Sub 的投入計畫你跟周邊對了第三次：' + (ST.d.sub === 'push' ? '晚班補 30，明天投 200。' : '明天投 170。')]]},

  {seg: 'cmd_wrap', when: isCmd, to: 'boss', guide: '在 Daily wrap up 報告晚會版 CTB',
    lines: () => [['boss', '晚會版 CTB。今天卡的料呢？'],
      ['me', (ST.d.ret === 'go' ? '借出去的料我下午搬回來了，' : '借出去的料三點才還，工單往後挪了一張，') + '明天十二張工單有' + (ST.d.ret === 'go' ? '十' : '九') + '張料齊。'],
      ['mlb', '那顆料明天到幾點？我 SMA 要排打板順序。'],
      ['me', '供應商說早上，我寫十點。'],
      ['boss', ST.d.ctb >= 75 ? '不錯。ok2kit 今晚要發。' : '還差幾張。ok2kit 之前再對一次。'],
      ['sys', '散會。物料倉又打來：新到的料到了，要發。']]},

  {seg: 'cmd_kit', when: isCmd, to: 'iqc', guide: '找阿珠講清楚 IQC sorting 和 fit check 的要求',
    lines: () => [['me', ST.d.fc === 'split' ? 'B 料 sorting 挑出來的，每盤都要 fit check 再放行。' : 'AAE 下午說 B 料可以投，但每盤都要先 fit check。'],
      ['iqc', '每盤？那要多兩個人。'],
      ['me', '我寫進 Build Matrix 裡，Sub 投入照這個順序。'],
      ['iqc', '……好。寫清楚，我照做。']]},
  {seg: 'cmd_kit', when: isCmd, t: 1140, to: 'pc_cmd', guide: '核對改料，發 ok2kit、開工單',
    lines: () => [['sys', '晚上七點，辦公室剩一半的人。你打開 ok2kit 的清單。']],
    mini: miniKit,
    post: () => [['sys', ST.d.kitBad ? '郵件寄出去一分鐘後，你發現有一張料還沒齊。' : '四張工單的狀態，你都對過兩次了。'],
      ['sys', ST.d.kitBad ? '你又補了一封「更正」。' : '寄出。工單開好了。']]},

  {seg: 'cmd_late', when: isCmd, to: 'homepc', guide: '在宿舍整理 ECTB，確認 Special list',
    lines: () => [['sys', '20:00，宿舍。你打開筆電，泡麵還沒泡。'],
      ['sys', 'ECTB 拉到下週五，Special list 又多一行。'],
      ['roomie', '你下班了沒？'],
      ['me', '下班了。在上班。']]},
  {seg: 'cmd_late', when: isCmd, t: 1260, to: 'homepc', guide: '發實際缺料版 CTB 給客戶',
    lines: () => [['sys', '21:40，實際缺料版 CTB 寄給客戶。'],
      ['f1', '（已讀）']]},
  {seg: 'cmd_late', when: isCmd, end: true, t: 1320,
    lines: () => [['sys', '22:00。你闔上筆電。泡麵已經糊了。明天早上八點，KT 郵件又會是滿的。']]}
);

/* ok2kit：明天的四張工單，料齊的才發。發了缺料的工單，線上明天會停在那裡 */
function miniKit(done) {
  const wos = [
    {id: 'WO-0412', note: '料齊', ok: true},
    {id: 'WO-0413', note: ST.d.iqc === 'push' ? '連接器特採放行' : '連接器等 QA 復判', ok: ST.d.iqc === 'push'},
    {id: 'WO-0414', note: ST.d.fc === 'split' ? 'B 料 sorting 完、fit check 過了' : 'B 料 AAE 下午放行', ok: true},
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
  ST.d.fc === 'split' ? '新到的 A 料先投，B 料 sorting 加 fit check 再放行。' : '新到料等 AAE 結論，下午才放行。',
  ST.d.alt === 'swap' ? '二供的料簽核過了，明天正式上線。' : '那批 config 先拿掉，下週要補回來。',
  ST.d.ret === 'go' ? '你推著料車穿過半個廠，B 線的人記住你了。' : 'PD 的「盡量」，今天是三點。',
  ST.d.sub === 'push' ? 'Sub 差的 30 個，晚班補。' : '明天的 Sub 投入砍到 170。',
  'ok2kit 發對 ' + (ST.d.kitOk || 0) + ' 張' + (ST.d.kitBad ? '，發錯 ' + ST.d.kitBad + ' 張。' : '，沒有發錯。')
];
