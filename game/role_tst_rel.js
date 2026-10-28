/* Testing EPM（Rel tracker）的一天：08:00 登入 COFA 導出 Rel 候選機 → 兩鍋 OK2REL 給線尾倉 → 20:00 宿舍裡的各大群組。
   ST.d.relOk、ST.d.relBad（第一鍋放進 Rel tracker 的對的、錯的各幾台）、ST.d.lrt（昨天的重測：watch 當場盯／later 請維修中午回）、
   ST.d.lrd（RD 的 comment：tame 拿 Rel plan 逐條對／give 照他要的換）、ST.d.leol（線尾倉少一台：go 自己去找／ask 請倉管查 SFC）、
   ST.d.lrd2（下午第二輪：lead 拉 RD 主管對齊／note 明天早會提）、ST.d.lnight（晚上的群組：all 一則一則回／key 只回客戶和 RD）。 */
const relScreen = l => {if (W) W.screen('tst', ['REL TRACKER', l], '#ffc94a')};
Object.assign(STORY.segs, {
  tsl_am: {name: '第一鍋 Rel 候選機', sub: '登入 COFA，導出最新測完 GK 的機台。', t: 480, mood: 'day', scene() {atDesk(); relScreen('第一鍋')}},
  tsl_send: {name: '發 Rel tracker', sub: '八點半，寄給各 RD 單位回 comment。', t: 510, mood: 'day', scene() {atWork()}},
  tsl_rt: {name: '昨天的重測', sub: '昨天說要重測的那幾台，重測完了沒？', t: 525, mood: 'day', scene() {atWork()}},
  tsl_rd: {name: '跟催 RD', sub: '九點十五分，RD 回了沒？', t: 555, mood: 'day', scene() {atWork()}},
  tsl_sync: {name: 'Daily sync up', sub: '客戶會問：今天幾台 OK2REL？', t: 615, mood: 'day', scene() {atMeeting()}},
  tsl_fa: {name: 'Push FA', sub: '周邊的機台，簽進 FA 了沒？', t: 645, mood: 'day', scene() {atWork()}},
  tsl_noon: {name: '新鮮出爐的 OK2REL', sub: '十二點，第一鍋送線尾倉。', t: 720, mood: 'day', scene() {atWork()}},
  tsl_pm: {name: '跟催 RD action', sub: '兩點，早上的 comment 有下文了嗎？', t: 840, mood: 'day', scene() {atWork()}},
  tsl_2nd: {name: '第二鍋 Rel 候選機', sub: '三點，COFA 又有新測完 GK 的了。', t: 900, mood: 'day', scene() {atWork(); relScreen('第二鍋')}},
  tsl_fu: {name: '重測與送修', sub: '早會 align 的那幾台，現在在哪？', t: 960, mood: 'day', scene() {atWork()}},
  tsl_btl: {name: '再次友好溝通', sub: '四點半，RD 的回覆又來了。', t: 990, mood: 'day', scene() {atWork()}},
  tsl_wrap: {name: 'Daily wrap up', sub: '今天兩鍋，各幾台？', t: 1020, mood: 'eve', scene() {atMeeting()}},
  tsl_eve: {name: '第二鍋 OK2REL', sub: '會後，下午那鍋也要送線尾倉。', t: 1080, mood: 'eve', scene() {atWork()}},
  tsl_night: {name: '各大群組', sub: '回到宿舍，流連於 XXT、維信、iMessage。', t: 1200, mood: 'night', scene() {atDorm()}}
});

const isRel = onTst('rel');
STORY.beats.push(
  {seg: 'tsl_am', when: isRel, to: 'pc_tst', guide: '登入 COFA，導出最新測完 GK 的 Rel 候選機台',
    lines: () => [['sys', 'COFA 登入、篩選、導出。昨晚測完 GK 的有六台。'],
      ['me', '六台不是每一台都能進 Rel。一台一台看。']],
    mini: miniRel},

  {seg: 'tsl_send', when: isRel,
    lines: () => [['sys', '你把 Rel tracker 整理好：' + (ST.d.relOk + ST.d.relBad || 0) + ' 台候選、每台的 Rel 項目、預計送出時間。'],
      ['sys', '08:30，寄給 Camera、Audio、RF、Battery 四個 RD 單位，請大家回 comment。']],
    after() {relScreen('已寄出')}},

  {seg: 'tsl_rt', when: isRel, to: 'rep', guide: '找維修阿德，確認昨天的重測機台',
    lines: () => [['rep', '昨天那 3 台？2 台重測過了。另外 1 台排在後面，還沒輪到。'],
      ['me', '那台今天要進第二鍋。']],
    mini: epmAsk('lrt', [['rep', '我手上還有十幾台喔。']], [
      ['站在旁邊盯著重測完', 'watch', {ctb: 4, san: -5}],
      ['請他中午前回覆結果', 'later', {san: 2, ctb: -3}]]),
    post: () => ST.d.lrt === 'watch'
      ? [['sys', '你在維修站站了二十分鐘。那台 pass 了。'], ['rep', '你下次搬張椅子來啦。']]
      : [['rep', '中午前給你。'], ['me', '（中午前。寫進 tracker。）']]},

  {seg: 'tsl_rd', when: isRel, ring: ['Kevin（Camera RD）', '維信', '去找他'], to: 'rd', guide: '去 HWTE 那邊找 Camera RD Kevin',
    lines: () => [['rd', '你的 Rel tracker 我看了。第 2、5 台的序號我不要，換成 config C 的。'],
      ['rd', '還有，comment 我先寫 TBD。'],
      ['me', 'Rel plan 上寫的是 config A。而且 TBD 不是 comment。']],
    mini: epmAsk('lrd', [['rd', '……那你要怎樣？']], [
      ['拿 Rel plan 跟他逐條對，不合理的打回', 'tame', {f1: 4, ctb: 2, san: -6}],
      ['照他要的換，先求不吵', 'give', {ctb: -5, san: 2}]]),
    post: () => ST.d.lrd === 'tame'
      ? [['sys', '你把 Rel plan 印出來，一行一行指給他看。'], ['rd', '好啦好啦，照 plan。comment 我中午前補。'], ['me', '（馴化周邊，今天第一位。）']]
      : [['rd', '讚。config C 的我等你。'], ['me', '（config C 的機台，COFA 上一台都還沒測完 GK。）']]},

  {seg: 'tsl_sync', when: isRel, to: 'boss', guide: '在 Daily sync up 報告 Rel tracker',
    lines: () => [['f1', 'Rel，今天幾台 OK2REL？'],
      ['me', '第一鍋 ' + (ST.d.relOk || 0) + ' 台' + (ST.d.lrd === 'tame' ? '，RD comment 中午前會齊。' : '，Camera RD 要換 config C，還在等機台。')],
      ['f1b', 'OK2REL 的機台什麼時候到線尾倉？我們下午要領。'],
      ['shp', '線尾倉那邊我可以幫忙看一下。'],
      ['boss', '重測跟送修的機台，下午四點前給我一個進度。']]},

  {seg: 'tsl_fa', when: isRel, to: 'te', guide: '找周邊 TE 志明，push 機台簽進 FA',
    lines: () => [['te', 'Rel 那邊 fail 的 2 台？單還沒送。'],
      ['me', '單我開好了，你簽就好。'],
      ['te', '……你們 Testing 都這麼有效率嗎。']]},

  {seg: 'tsl_noon', when: isRel, to: 'pc_tst', guide: '發送今早新鮮出爐的 OK2REL 機台給線尾倉',
    lines: () => [['sys', '12:00，「OK2REL - 第一鍋」：' + (ST.d.relOk || 0) + ' 台，寄給線尾倉，副本客戶。']],
    after() {relScreen('OK2REL 第一鍋')}},
  {seg: 'tsl_noon', when: isRel, t: 750, ring: ['線尾倉', '訊息', '看訊息'],
    lines: () => [['eol', '你寄的 OK2REL 名單，架上少一台，序號找不到。'],
      ['eol', '客戶一點半要來領。']],
    mini: epmAsk('leol', [['me', '（少一台，客戶領的時候就少一台。）']], [
      ['自己跑去線尾倉找', 'go', {ctb: 4, san: -6}],
      ['請倉管查 SFC 再回我', 'ask', {san: 2, ctb: -2}]]),
    post: () => ST.d.leol === 'go'
      ? [['sys', '你在出貨倉旁邊的架子上找到了：標籤貼成隔壁那台的序號。'], ['sys', '13:20，齊了。']]
      : [['eol', 'SFC 顯示它還在 OTA 線，沒下線。'], ['sys', '客戶領走的時候，少了一台。']]},

  {seg: 'tsl_pm', when: isRel, to: 'rd', guide: '跟催 RD 回覆 Rel tracker action',
    lines: () => ST.d.lrd === 'tame'
      ? [['rd', 'comment 補好了。第 5 台我們要加做一個摔落。'], ['me', '好，加進 tracker。']]
      : [['rd', 'config C 的呢？'], ['me', 'COFA 上還沒有測完 GK 的。'], ['rd', '那 comment 我就先寫 TBD 囉。'], ['me', '（又是 TBD。）']],
    after() {epmAdd(ST.d.lrd === 'tame' ? {ctb: 2} : {san: -4})}},

  {seg: 'tsl_2nd', when: isRel, to: 'pc_tst', guide: '導出第二鍋 Rel 候選機，整理 Rel tracker 寄給 RD',
    lines: () => [['sys', '15:00，COFA 第二次導出：下午測完 GK 的有四台' + (ST.d.lrt === 'watch' ? '，包括早上盯著重測過的那台。' : '。早上那台重測，維修還沒回。')],
      ['sys', '15:30，第二版 Rel tracker 寄給四個 RD 單位。']]},

  {seg: 'tsl_fu', when: isRel, to: 'sw', guide: '找 SW 阿里阿娜，跟進早會 align 的重測機台',
    lines: () => [['sys', '阿里阿娜一邊刷機，一邊哼著周杰倫的〈明明就〉。'],
      ['sw', '那台要重測的？要先刷新版 SW，不然測了也是白測。'],
      ['me', '刷完多久？'],
      ['sw', '四十分鐘。先講好喔，不要刷完又改版本。'],
      ['sys', '另一台送修的，阿德說明天早上出來。你把兩台的進度都寫進 tracker。']]},

  {seg: 'tsl_btl', when: isRel, ring: ['RD 維信群組', '7 則訊息', '打開'],
    lines: () => [['sys', 'Audio RD：「第二鍋第 3 台我們要。」Battery RD：「第 3 台我們也要。」'],
      ['sys', 'RF RD：「我們不要第 3 台，但第 3 台的數據要給我們。」']],
    mini: epmAsk('lrd2', [['me', '（四個 RD，一台機台。）']], [
      ['拉 RD 主管進群組，當場對齊', 'lead', {f1: 3, ctb: 3, san: -4}],
      ['先記下來，明天早會再提', 'note', {san: 2, f1: -2}]]),
    post: () => ST.d.lrd2 === 'lead'
      ? [['sys', 'RD 主管一句話：「第 3 台給 Audio，數據共享。」群組安靜了。']]
      : [['sys', '你在 tracker 上第 3 台的 comment 欄寫了：「明早 sync up 對齊」。']]},

  {seg: 'tsl_wrap', when: isRel, to: 'boss', guide: '在 Daily wrap up 報告 Rel 進度',
    lines: () => [['boss', 'Rel 今天兩鍋，各幾台？'],
      ['me', '第一鍋 ' + (ST.d.relOk || 0) + ' 台，' + (ST.d.leol === 'go' ? '都到線尾倉了' : '有一台還在 OTA 線') + '。第二鍋 4 台，會後發。'],
      ['f1', ST.d.relBad ? '第一鍋有一台我們不能收，retest 過的不能進 Rel。' : '第一鍋的我們都領了，很乾淨。'],
      ['boss', '重測的那台呢？'],
      ['me', '等 SW 刷完版本，明早重測。']]},

  {seg: 'tsl_eve', when: isRel, to: 'pc_tst', guide: '發送下午第二鍋 OK2REL 給線尾倉',
    lines: () => [['sys', '18:30，「OK2REL - 第二鍋」：4 台，寄給線尾倉，副本客戶和 Y陳。'],
      ['f1b', '（iMessage）收到，明早領。']],
    after() {relScreen('OK2REL 第二鍋')}},

  {seg: 'tsl_night', when: isRel, ring: ['XXT 群組', '99+ 則訊息', '打開'],
    lines: () => [['sys', '20:00，宿舍。你剛把外套掛起來。'],
      ['sys', 'XXT、維信、iMessage 一起亮：一台 Rel 機摔落後開不了機、RD 問明天第三鍋幾點、客戶問明天幾台 OK2REL。'],
      ['roomie', '你的手機是不是在震？']],
    mini: epmAsk('lnight', [['me', '（現在八點。）']], [
      ['一則一則回完', 'all', {san: -12, f1: 4}],
      ['只回客戶和 RD 的，其他明早再說', 'key', {san: 4, f1: -2}]]),
    post: () => ST.d.lnight === 'all'
      ? [['sys', '回完最後一則，22:10。'], ['roomie', '你下班了沒？'], ['me', '下班了。在上班。']]
      : [['sys', '你回了客戶和 RD，把手機蓋在桌上。'], ['roomie', '要不要打一場？'], ['me', '……一場就好。']],
    after() {ST.clock = Math.max(ST.clock, ST.d.lnight === 'all' ? 1330 : 1320); hud()}},
  {seg: 'tsl_night', when: isRel, end: true, t: 1320,
    lines: () => [['sys', ST.d.lnight === 'all' ? '22:10。群組暫時安靜了。明早八點，COFA 又會有新測完 GK 的機台。' : '22:00。紅點還在跳。明早八點，COFA 又會有新測完 GK 的機台。']]}
);

/* 從 COFA 導出的六台：測完 GK 的不一定都能進 Rel。retest 過的、config 跟 Rel plan 對不上的，都不能放 */
function miniRel(done) {
  const cand = [
    {sn: 'C7QX01', note: 'GK pass，config A', ok: true},
    {sn: 'C7QX02', note: 'GK pass，config A', ok: true},
    {sn: 'C7QX03', note: 'GK pass，retest 過一次', ok: false},
    {sn: 'C7QX04', note: 'GK pass，config A', ok: true},
    {sn: 'C7QX05', note: 'GK pass，config B（Rel plan 是 A）', ok: false},
    {sn: 'C7QX06', note: 'GK pass，config A', ok: true}
  ];
  const on = cand.map(() => false);
  const draw = () => {
    setPanel('<p>勾選要放進 Rel tracker 的機台：</p>'
      + cand.map((c, i) => '<div class="row"><button class="btn' + (on[i] ? ' btn-primary' : '') + '" id="rc' + i + '" type="button" aria-pressed="' + on[i] + '">'
        + (on[i] ? '✓ ' : '') + c.sn + '</button><span>' + c.note + '</span></div>').join('')
      + '<p class="fine">Rel plan：config A，GK pass，沒有 retest 紀錄。</p>' + nextBtn('放進 Rel tracker'), 'COFA 導出');
    cand.forEach((c, i) => {$('#rc' + i).onclick = () => {on[i] = !on[i]; SFX.blip(); draw()}});
    $('#next').onclick = () => {
      ST.d.relOk = cand.filter((c, i) => on[i] && c.ok).length;
      ST.d.relBad = cand.filter((c, i) => on[i] && !c.ok).length;
      const miss = cand.filter((c, i) => !on[i] && c.ok).length;
      hidePanel();
      epmAdd({ctb: ST.d.relOk * 3 - miss * 3 - ST.d.relBad * 5, f1: -ST.d.relBad * 4});
      done();
    };
  };
  draw();
}

TST_SUBS.rel.recap = () => [
  '第一鍋放進 Rel tracker ' + (ST.d.relOk || 0) + ' 台' + (ST.d.relBad ? '，其中混了 ' + ST.d.relBad + ' 台不該放的。' : '，沒有放錯。'),
  ST.d.lrd === 'tame' ? '你拿 Rel plan 跟 RD 逐條對，comment 中午就齊了。' : 'RD 要換 config C，comment 到晚上還是 TBD。',
  ST.d.leol === 'go' ? '線尾倉少的那台，你自己跑去找到了：標籤貼錯。' : '線尾倉少的那台還在 OTA 線，客戶少領了一台。',
  ST.d.lrd2 === 'lead' ? '四個 RD 搶一台機台，你拉了 RD 主管當場對齊。' : '四個 RD 搶一台機台，留到明天早會。'
];
