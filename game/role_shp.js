/* Shipping EPM 的一天：08:00 看客戶需求 → 20:00 宿舍裡的訊小通、維信、iMessage → 22:00。
   特殊事件「通宵」：答應了客戶的急單（rush = yes），22:30 晚班打來報關數量不夠，選擇回廠就一路跟到早上卡車開走。
   ST.d.draw（畫出貨：part 先出 32 台／pull 跟 Assembly 要 8 台）、ST.d.nimbus（周邊挑機：rule 照規則／let 讓他指定序號）、
   ST.d.loan（OPM 要換借機：urs 先更新 URS／swap 先換再補）、ST.d.rush（客戶急單：yes 答應／eta 給實際 ETA）、
   ST.d.nloan（晚班要轉借機：rule 沒單不轉／ok 先轉明天補單）、ST.d.ovn（22:30 報關數量不夠：go 回廠通宵／stay 交代晚班）、
   ST.d.rt（凌晨兩台 retest：wait 等結果／swap 換 candidate 頂上）。 */
const isOvn = () => ST.d.role === 'shp' && ST.d.rush === 'yes' && ST.d.ovn === 'go';
Object.assign(STORY.segs, {
  shp_am: {name: '客戶的機台需求', sub: '先看客戶要幾台。', t: 480, mood: 'day', scene() {atDesk()}},
  shp_inv: {name: '畫出貨', sub: '更新乾淨庫存，再看倉庫有幾台。', t: 540, mood: 'day', scene() {atWork()}},
  shp_cus: {name: '報關', sub: '在庫明細對完，報關數量交給關務提單。', t: 570, mood: 'day', scene() {atWork()}},
  shp_mtg: {name: '早會', sub: '出貨數字，客戶會一台一台對。', t: 600, mood: 'day', scene() {atMeeting()}},
  shp_nimbus: {name: 'Fulfill Nimbus', sub: '準備乾淨庫存，給周邊挑機。', t: 690, mood: 'day', scene() {atWork()}},
  shp_pm: {name: '跟進流線入庫', sub: '出貨的機台在哪一站？借出去的機台在誰手上？', t: 810, mood: 'day', scene() {atWork()}},
  shp_wrap: {name: '晚會', sub: '今天出了幾台？還有幾台沒入庫？', t: 1020, mood: 'eve', scene() {atMeeting()}},
  shp_hand: {name: '交接郵件', sub: '明天的 candidates，今天要先給 Y陳。', t: 1140, mood: 'eve', scene() {atWork()}},
  shp_dorm: {name: '宿舍', sub: '下班了。訊小通還沒下班。', t: 1200, mood: 'night', scene() {atDorm()}},
  shp_ovn1: {name: '回到廠裡', sub: '23:30，出貨倉的燈還亮著。', t: 1410, mood: 'night', when: isOvn,
    scene() {atWork(); nightOff(); if (W) W.put('me', 'a2')}},
  shp_ovn2: {name: '凌晨三點', sub: '整層樓只剩機台的聲音。', t: 1620, mood: 'night', when: isOvn, scene() {atWork(); nightOff()}},
  shp_ovn3: {name: '卡車', sub: '05:30，天還沒亮，卡車六點到。', t: 1770, mood: 'eve', when: isOvn, scene() {atWork(); nightOff()}}
});

const isShp = onRole('shp');
STORY.beats.push(
  {seg: 'shp_am', when: isShp, to: 'pc_shp', guide: '查看郵件，確認客戶的機台需求',
    lines: () => [['sys', 'Y陳的郵件：今天要 40 台，其中 10 台指定 config B。'],
      ['sys', '另一封：周邊下午要挑 15 台做驗證。'],
      ['me', '加起來 55 台。先去倉庫看看有幾台。']]},

  {seg: 'shp_inv', when: isShp, to: 'wh', guide: '去出貨倉找胖虎，更新乾淨庫存、畫出貨',
    lines: () => [['wh', '乾淨庫存？32 台。config B 只有 6 台。'],
      ['wh', '今天下線的還在測試，入庫要下午。']],
    mini: epmAsk('draw', [['me', '（客戶要 40，架上 32。）']], [
      ['先出 32 台，剩下的明天補', 'part', {ctb: -4, f1: 2}],
      ['跟 Assembly 要今天下線的 8 台', 'pull', {ctb: 6, san: -6}]]),
    post: () => ST.d.draw === 'part'
      ? [['wh', '好，32 台我先備。'], ['me', '（Y陳的郵件要先回，別讓 Y陳在早會才知道。）']]
      : [['wh', '要阿哲那邊趕得上才行喔。'], ['me', '我去追。']]},

  {seg: 'shp_cus', when: isShp, to: 'shipdock', guide: '對在庫明細，確認報關數量',
    lines: () => [['sys', '你拿著明細一箱一箱對序號。在庫 ' + (ST.d.draw === 'part' ? '32' : '32（下午再加 8）') + ' 台，跟系統一樣。'],
      ['me', '報關數量 ' + (ST.d.draw === 'part' ? '32' : '40') + '，交給關務提單。']]},
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
      ['f1b', '報關數量確定了，就不要再動喔。']]},

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
  {seg: 'shp_pm', when: isShp, t: 860, to: 'f1b', guide: '去客戶辦公區找 Y陳，處理借機需求',
    lines: () => [['f1b', '上週借給 RF 的那 3 台，要換成 config B。另外再補借 2 台給 Camera。'],
      ['f1b', '還有，借出去的 loan 機台，有 4 台到今天還沒還。']],
    mini: epmAsk('loan', [['me', '（換借機要先更新 URS。可是 Y陳現在就要。）']], [
      ['照流程：先更新 URS，換機明早給', 'urs', {f1: 3, san: -4}],
      ['先換給 Y陳，URS 晚點補', 'swap', {f1: 4, ctb: -4}]]),
    post: () => ST.d.loan === 'urs'
      ? [['f1b', '好，URS 更新完寄我。'], ['sys', '你順手寄了一封信，追那 4 台還沒還的 loan 機台。']]
      : [['f1b', '太好了，謝謝！'], ['me', '（URS、借機單、Nimbus，三個地方都要補。）']]},
  {seg: 'shp_pm', when: isShp, t: 900, ring: ['蝦倫（客戶）', '來電', ANSWER],
    lines: () => [['f1', '臨時多一個需求：明天早上八點，再多 5 台 config A，要給我們的實驗室。']],
    mini: epmAsk('rush', [['me', '（明天早上的 candidates 還沒算。）']], [
      ['答應：明天八點給', 'yes', {f1: 6, san: -10}],
      ['先算庫存，半小時內回實際 ETA', 'eta', {f1: 2, ctb: 2}]]),
    post: () => ST.d.rush === 'yes'
      ? [['f1', '太好了，謝謝。'], ['me', '（這 5 台要跟今晚的報關一起走。今晚的入庫，一台都不能少。）']]
      : [['sys', '你算完庫存回電：明天十點。'], ['f1', '十點……好，那十點。']]},
  {seg: 'shp_pm', when: isShp, t: 930, to: 'wh', guide: '跟胖虎 push OQC 機台出機',
    lines: () => [['wh', 'OQC 今天卡得很慢，下午才放了 12 台。'],
      ['me', '剩下的我去 OQC 那邊問。'],
      ['wh', '問了也是一樣慢啦，人就那幾個。']]},

  {seg: 'shp_wrap', when: isShp, to: 'boss', guide: '在晚會報告今天的出貨',
    lines: () => [['boss', '今天出了幾台？'],
      ['me', ST.d.draw === 'pull' ? '38 台出貨，2 台在 retest，明天第一批補。' : '32 台出貨，明天補 8 台' + (ST.d.rush === 'yes' ? '，加上客戶的 5 台。' : '。')],
      ['mlb', '明天要的主板我晚上會再確認一次。'],
      ['boss', '好。交接郵件記得寫 candidates。']]},
  {seg: 'shp_wrap', when: isShp, t: 1050, to: 'wh', guide: '散會後確認包裝明細、包裝進度和入庫',
    lines: () => ST.d.rush === 'yes'
      ? [['wh', '包裝明細對好了。但是報關數量還差 6 台沒入庫：4 台卡 OQC，2 台在 retest。'],
        ['me', '寫進晚班交接：晚班持續 push 入庫，報關數量一定要達成。'],
        ['wh', '我寫大字。'],
        ['sys', '你回座位，把 REL tracker 更新給客戶。']]
      : [['wh', '包裝明細對好了，報關數量的機台都入庫了。'],
        ['me', '太好了。晚班交接寫「無異常」。'],
        ['sys', '你回座位，把 REL tracker 更新給客戶。']]},

  {seg: 'shp_hand', when: isShp, to: 'pc_shp', guide: '發交接郵件，給 Y陳明天的 candidates 和 Nimbus 待修正 tracker',
    lines: () => [['sys', '交接郵件：明天的 candidates ' + (ST.d.rush === 'yes' ? '45' : '40') + ' 台、Nimbus 待修正 tracker、報關單已改' + (ST.d.loan === 'swap' ? '、URS 待補' : '') + '。'],
      ['f1b', '（iMessage）收到。明天 candidates 照這份。'],
      ['sys', '你又回了兩封客戶的郵件，然後關燈。']]},

  {seg: 'shp_dorm', when: isShp, ring: ['訊小通', '晚班 12 則訊息', '打開'],
    lines: () => [['sys', '20:00，宿舍。你剛脫下鞋子。'],
      ['sys', '晚班：「RF 借的那台要轉給 Camera，可以直接轉嗎？」「有一台出貨機外箱壓到了。」'],
      ['roomie', '你的手機一直叫。']],
    mini: epmAsk('nloan', [['me', '（轉借機要有借機單。晚班問的是「可不可以先轉」。）']], [
      ['照規則：沒有借機單就不轉', 'rule', {f1: 2, san: -3}],
      ['先轉給他，明天補單', 'ok', {san: 2, ctb: -2}]]),
    post: () => [['sys', ST.d.nloan === 'rule' ? '你回：「先提單，明早我簽。」' : '你回：「先轉，明早補單。」'],
      ['sys', '外箱壓到的那台，你請晚班拍照、換箱，包裝明細改一行。']]},
  {seg: 'shp_dorm', when: isShp, t: 1290, to: 'homepc', guide: '在書桌回完維信和 iMessage',
    lines: () => [['sys', '21:30。維信 3 個群組、iMessage 2 個，你一個一個回。'],
      ['roomie', '你下班了沒？'],
      ['me', '下班了。在上班。']]},
  {seg: 'shp_dorm', when: () => isShp() && ST.d.rush === 'yes', t: 1350, ring: ['晚班倉管', '來電', ANSWER],
    lines: () => [['sys', '22:30。你剛躺上床。'],
      ['sys', '（電話那頭）報關數量還差 6 台。OQC 晚班只有一個人，4 台還沒放；retest 的 2 台還在跑。卡車六點到。'],
      ['sys', '（電話那頭）客戶要的那 5 台也在這一車上。']],
    mini: epmAsk('ovn', [['me', '（明早八點，蝦倫要看到 5 台。今晚少一台，報關就要重來。）']], [
      ['回廠，今晚盯到卡車開走', 'go', {ctb: 8, f1: 6, san: -25}],
      ['交代晚班 push，明早五點進廠', 'stay', {san: 4, ctb: -6, f1: -4}]]),
    post: () => ST.d.ovn === 'go'
      ? [['roomie', '你要出門？現在？'], ['me', '報關數量不夠。'], ['roomie', '……加油。我先睡了。']]
      : [['sys', '你把交接寫了第二遍，鬧鐘設在 04:30。'], ['roomie', '你明天幾點起？'], ['me', '不要問。']],
    after() {if (ST.d.ovn === 'stay') {ST.clock = Math.max(ST.clock, 1360); hud()}}},
  {seg: 'shp_dorm', when: isOvn, to: 'byron', guide: '出門前跟宿舍管理員拜倫說一聲',
    lines: () => [['byron', '十一點門禁喔。'],
      ['me', '我要回廠，報關數量差 6 台。'],
      ['byron', '……門我幫你開。回來記得小聲一點，你室友睡了。']]},
  {seg: 'shp_dorm', when: () => isShp() && !isOvn(), end: true, t: 1320,
    lines: () => ST.d.rush === 'yes'
      ? [['sys', '22:40。你關上燈，手機放在枕頭旁邊。'], ['sys', '明早 04:30，鬧鐘會叫你。']]
      : [['sys', '22:00。最後一則訊息回完了。明天的出貨，從今晚就開始了。']]},

  {seg: 'shp_ovn1', when: isOvn, to: 'wh', guide: '找胖虎盤點還沒入庫的機台',
    lines: () => [['wh', '你也被叫回來喔？我也是。'],
      ['wh', '6 台：4 台在 OQC 排隊，2 台在 OTA 線 retest。'],
      ['me', 'OQC 那 4 台我去盯。retest 的我去看。']],
    after() {epmAdd({san: -5})}},
  {seg: 'shp_ovn1', when: isOvn, t: 1470, to: 'tester', guide: '去 OTA 測試線看 retest 的 2 台',
    lines: () => [['sys', '00:30。OTA 線的燈一閃一閃。2 台 retest，一台過了，一台又 fail。'],
      ['te', '（被你叫回來的志明，頭髮還是濕的）再測一次，大概三點有結果。']],
    mini: epmAsk('rt', [['me', '（三點出結果，來得及。但如果又 fail……）']], [
      ['等 retest 結果', 'wait', {f1: 3, san: -8}],
      ['先從 candidates 裡挑一台頂上', 'swap', {ctb: 4, san: -3}]]),
    post: () => ST.d.rt === 'wait'
      ? [['te', '好，我陪你等。'], ['sys', '你們坐在 OTA 線旁邊，看著進度條。']]
      : [['sys', '你從明天的 candidates 裡挑了一台 config A，換掉那台 fail 的。報關明細要改一行。']]},

  {seg: 'shp_ovn2', when: isOvn, ring: ['蝦倫（客戶）', 'iMessage', '看訊息'],
    lines: () => [['f1', '數量確定了嗎？早上八點的 5 台也在裡面嗎？'],
      ['me', '確定。OQC 放了 4 台，' + (ST.d.rt === 'wait' ? 'retest 那台三點出結果。' : 'fail 的那台我換了一台頂上。')],
      ['f1', '好。（凌晨三點，秒回。）']]},
  {seg: 'shp_ovn2', when: isOvn, to: 'rda', guide: '去廁所洗把臉',
    lines: () => [['rda', '這麼晚還在？'],
      ['me', '報關數量。'],
      ['rda', '進去之前手機收好。……算了，你今天可以帶進去。']],
    after() {epmAdd({san: 4})}},
  {seg: 'shp_ovn2', when: isOvn, t: 1650, to: 'pc_shp', guide: '回座位更新包裝明細和報關明細',
    lines: () => [['sys', ST.d.rt === 'wait' ? '03:10，retest 結果出來了：pass。' : '03:10，換上去的那台，序號、config、箱號一一對上。'],
      ['sys', '包裝明細改完、報關明細改完。你寄給 Y陳和關務：「6 台已入庫，報關數量達成。」'],
      ['sys', '寄件時間：03:24。']]},

  {seg: 'shp_ovn3', when: isOvn, to: 'ada', guide: '跟清潔的 A 大打聲招呼',
    lines: () => [['ada', '你今天比我還早喔？'],
      ['me', '我昨天還沒走。'],
      ['ada', '……腳抬一下，我拖一下地。'],
      ['ada', '欸，想不想看紅果短劇？我看到第 48 集了。']]},
  {seg: 'shp_ovn3', when: isOvn, t: 1800, to: 'shipdock', guide: '看機台上卡車',
    lines: () => [['sys', '06:00，卡車準時到。胖虎一箱一箱刷條碼。'],
      ['wh', ST.d.rt === 'wait' ? '報關數量的機台，一台不少。客戶的 5 台也在。' : '一台不少。換上去的那台也刷到了。'],
      ['sys', '06:20，卡車開走。']]},
  {seg: 'shp_ovn3', when: isOvn, end: true, t: 1890,
    lines: () => [['sys', '07:30。你回宿舍洗了個澡。阿凱剛起床：「你昨天幾點回來的？」'],
      ['sys', '你看了看手機。Y陳：「早安，今天的 candidates 呢？」']]}
);

ROLES.shp.special = () => isOvn() ? {title: '通宵了', sub: ST.d.rt === 'wait' ? '卡車六點開走，一台不少。' : '卡車六點開走，報關數量剛好。'} : null;
ROLES.shp.recap = () => [
  ST.d.draw === 'pull' ? '你跟 Assembly 要了今天下線的機台，差一點就湊滿 40 台。' : '今天先出 32 台，剩下的明天補。',
  ST.d.nimbus === 'rule' ? 'config B 留給出貨，周邊挑了 A。' : '周邊挑走了 config B，Nimbus 上多一行 gap。',
  ST.d.loan === 'urs' ? '換借機照流程，先更新 URS。' : '換借機先給了 Y陳，URS 還欠著。',
  ST.d.rush === 'yes' ? '客戶的急單你一口答應：明天八點。' : '你先算庫存，再回客戶實際的 ETA。',
  ST.d.nloan === 'rule' ? '晚班要轉借機，你堅持先提單。' : '晚班的借機先轉了，明天補單。'
].concat(ST.d.rush !== 'yes' ? [] : ST.d.ovn === 'go'
  ? ['22:30 你回到廠裡，一路盯到 06:20 卡車開走。', ST.d.rt === 'wait' ? '凌晨三點，retest 那台 pass 了。' : '凌晨，你換了一台 candidate 頂上 fail 的那台。']
  : ['22:30 你把報關數量交給晚班，鬧鐘設在 04:30。']);
