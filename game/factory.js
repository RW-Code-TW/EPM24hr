/* EMS 工廠一樓（照實際樓層圖簡化，附房只挑幾間當代表）。
   由左到右：客戶辦公區 → 後排休息區、兩間會議室（FATP、MLB），前排 EPM、OPM 辦公室與前台（對外大門）→ 金屬探測門 → 物料倉與 RF 室 →
   產線區（後排 SMA 線與 Offline 室；中間組裝線 CG / BP full link、OTA 測試線、AP 線；前排幾間附房與出貨倉）→
   最右邊 HWTE 的房間（Camera、FA 室）。一條橫向主走道（z ≈ -0.4）把整層串起來，對外大門在前台。
   座標：x 往右、z 往鏡頭（畫面下方）、y 往上；1 單位大約 1 公尺。
   K 是框架借給關卡的工具（engine/world.js 的 LVK）。 */
levelAdd('factory', function (K) {
  const {box, flat, lam, M, TX, label, screen, tower, desk, pickBox, G} = K;
  K.bounds(-27.4, 32, -9, 9);   // 右邊多出來的一塊是宿舍（跟工廠隔開，走不過去，只有換時刻才會到）
  const floor = lam(0xffffff, {map: TX.floor}), tile = lam(0xf6efd8, {map: TX.tile});
  const carpet = lam(0xd8cfbd, {map: TX.carpet}), blue = lam(0xc9d6e2, {map: TX.carpet}), wall = lam(0xf3f5f6, {map: TX.wall});
  const roomM = lam(0xe2e9ec, {map: TX.wall}), tint = lam(0xdcecf2, {map: TX.tile});
  const stop = [];   // 走不過去的地方 [x0, x1, z0, z1]，最後一起交給 K.block

  /* 地板與外牆（前面開著，鏡頭從這邊看） */
  flat(38.6, 18.6, floor, 0, 0, -.1, 1, G);
  box(38.6, 3.2, .3, wall, 0, 1.6, -9.35, G);
  box(.3, 3.2, 18.6, wall, 19.35, 1.6, -.1, G);

  /* 小工具：玻璃隔間（一段直的牆）、整間的房間、玻璃房。房名掛在正面的小牌子上 */
  let signs = 0;
  const sign = (lines, x, y, z, w) => screen('rm' + (signs++), G, x, y, z, w || 1.6, (w || 1.6) * .5625, lines, '#cfe3ea');
  function pane(x0, z0, x1, z1) {
    const w = Math.max(x1 - x0, .1), d = Math.max(z1 - z0, .1), cx = (x0 + x1) / 2, cz = (z0 + z1) / 2;
    box(w, 2.2, d, M.glass, cx, 1.1, cz, G, false);
    box(w + .02, .08, d + .02, M.trim, cx, 2.2, cz, G);
    box(w + .02, .12, d + .02, M.trim, cx, .06, cz, G);
    stop.push([cx - w / 2, cx + w / 2, cz - d / 2, cz + d / 2]);
  }
  function room(x0, x1, z0, z1, h, lines) {
    box(x1 - x0, h, z1 - z0, roomM, (x0 + x1) / 2, h / 2, (z0 + z1) / 2, G);
    sign(lines, (x0 + x1) / 2, h - .6, z1 + .02);
    stop.push([x0, x1, z0, z1]);
  }
  function glassRoom(x0, x1, z0, z1, lines) {
    flat(x1 - x0, z1 - z0, tint, (x0 + x1) / 2, .006, (z0 + z1) / 2, .5, G);
    pane(x0, z0, x1, z0); pane(x0, z1, x1, z1); pane(x0, z0, x0, z1); pane(x1, z0, x1, z1);
    sign(lines, (x0 + x1) / 2, 2.6, z1 + .08);
    stop.push([x0, x1, z0, z1]);
  }
  /* 辦公桌加螢幕、鍵盤 */
  function workDesk(x, z) {
    desk(x, z, 1.8, G); box(.6, .4, .05, M.dark, x, 1.0, z - .2, G); box(.5, .03, .35, M.trim, x, .82, z + .1, G);
    stop.push([x - .9, x + .9, z - .45, z + .45]);
  }

  /* ── 辦公區（x -27.6 ~ -8.4）：主走道（z -1.6 ~ 0.8）往左走到底是客戶辦公區；
     走道後排：休息區、FATP 會議室、MLB 會議室；走道前排：EPM 辦公室、OPM 辦公室、前台 ── */
  flat(8.4, 18.6, floor, -23.5, 0, -.1, 1, G);
  box(8.4, 3.2, .3, wall, -23.5, 1.6, -9.35, G);
  box(.3, 3.2, 18.6, wall, -27.75, 1.6, -.1, G);
  const woodF = lam(0xe6cfa8, {map: TX.wood}), rubber = lam(0x4a5056), cab = lam(0xeef1f2), topM = lam(0x9a7650);
  const sky = lam(0xbfe2f2), plant = lam(0x4f9a4f), pot = lam(0xb5653a), esd2 = lam(0xf07a1e);
  const potPlant = (x, z) => {box(.4, .4, .4, pot, x, .2, z, G); box(.55, .7, .55, plant, x, .75, z, G); stop.push([x - .25, x + .25, z - .25, z + .25])};

  /* 客戶辦公區（x -27.6 ~ -21.8）：整排最左邊，玻璃牆，門開在主走道底。蝦倫、Y陳坐後排中間那一列 */
  flat(5.8, 18.2, blue, -24.7, .006, -.1, 1, G);
  pane(-21.8, -9.2, -21.8, -1.6); pane(-21.8, .8, -21.8, 9);
  [[-26.2, -6.8], [-23.2, -6.8], [-26.2, -3.6], [-23.2, -3.6], [-26.2, 3.4], [-23.2, 3.4]].forEach(([x, z]) => workDesk(x, z));
  [-5.2, 5].forEach(z => {box(.05, 1.4, 3.6, sky, -27.57, 1.7, z, G); box(.08, .08, 3.7, M.trim, -27.55, 2.42, z, G); box(.08, .08, 3.7, M.trim, -27.55, .98, z, G)});   // 左牆的窗
  potPlant(-27.1, -.4); potPlant(-22.3, 8.4);
  label('客戶辦公區', -24.7, 7.4, 3, G);

  /* 休息區（後排 x -21.8 ~ -15.4）：後牆茶水間（咖啡機、微波爐、水槽、冰箱），中間兩張餐桌，左邊一條小小的健身角 */
  flat(6.4, 7.6, woodF, -18.6, .006, -5.4, 1, G);
  box(4.6, .9, .7, cab, -19.1, .45, -8.85, G);
  box(4.7, .06, .74, topM, -19.1, .93, -8.85, G);
  box(4.6, .7, .4, cab, -19.1, 2.3, -9.0, G);                 // 吊櫃
  box(.5, .6, .45, M.dark, -21, 1.26, -8.9, G);                // 咖啡機
  box(.28, .12, .03, lam(0xc98a00), -21, 1.38, -8.66, G);
  [-20.55, -20.4].forEach(x => box(.1, .12, .1, lam(0xffffff), x, 1.02, -8.7, G));   // 杯子
  [-19.6, -18.8].forEach(x => {box(.62, .36, .42, lam(0xd8dde0), x, 1.14, -8.9, G); box(.38, .24, .02, M.dark, x - .07, 1.14, -8.68, G)});   // 微波爐
  flat(.7, .4, M.dark, -17.6, .97, -8.85, 1, G);               // 水槽
  box(.06, .35, .06, M.trim, -17.6, 1.13, -9.05, G);
  box(.9, 1.9, .75, lam(0xe8ecee, {map: TX.panel}), -16, .95, -8.8, G);     // 冰箱
  box(.04, .6, .04, M.trim, -15.62, 1.2, -8.4, G);
  stop.push([-21.5, -15.5, -9.2, -8.45]);
  label('茶水間', -18.6, -7.6, 2, G);
  const chairC = [lam(0xf07a1e), lam(0x2bb3a3), lam(0xf2c230)];
  [-6.3, -3.8].forEach((z, k) => {                              // 餐桌：直放，兩邊各兩張彩色椅子
    const x = -17.9;
    box(.8, .06, 1.4, topM, x, .75, z, G); box(.14, .72, .14, M.trim, x, .36, z, G);
    [-1, 1].forEach(side => [-.4, .4].forEach((dz, j) => {
      const c = chairC[(k + j + (side > 0 ? 1 : 0)) % 3], cx = x + side * .65, cz = z + dz;
      box(.42, .07, .42, c, cx, .45, cz, G); box(.06, .42, .06, M.trim, cx, .21, cz, G); box(.06, .45, .42, c, cx + side * .2, .7, cz, G);
    }));
    stop.push([x - .85, x + .85, z - .75, z + .75]);
  });
  flat(1.4, 5.6, rubber, -21.05, .008, -4.9, 1, G);            // 健身角：跑步機、飛輪、啞鈴架，旁邊一張瑜珈墊
  box(.8, .2, 1.8, M.dark, -21.05, .1, -6.5, G); box(.62, .03, 1.6, lam(0x333a40), -21.05, .21, -6.45, G);
  [-.32, .32].forEach(dx => box(.06, 1.1, .06, M.trim, -21.05 + dx, .65, -7.3, G));
  box(.7, .3, .15, M.dark, -21.05, 1.25, -7.3, G); box(.4, .14, .02, lam(0x7fe3c8), -21.05, 1.28, -7.22, G);
  stop.push([-21.5, -20.6, -7.45, -5.55]);
  box(.3, .1, 1.1, M.dark, -21.05, .05, -4, G); box(.08, .8, .08, M.trim, -21.05, .45, -3.7, G); box(.3, .08, .35, M.dark, -21.05, .88, -3.7, G);
  box(.08, 1, .08, M.trim, -21.05, .55, -4.35, G); box(.5, .06, .08, M.trim, -21.05, 1.05, -4.4, G); box(.08, .5, .5, lam(0xd04a2a), -21.05, .35, -4.35, G);
  stop.push([-21.45, -20.65, -4.6, -3.4]);
  box(.5, .5, .9, M.trim, -21.2, .25, -2.5, G);
  for (let i = 0; i < 3; i++) box(.3, .1, .14, M.dark, -21.2, .56, -2.8 + i * .3, G);
  stop.push([-21.5, -20.9, -2.95, -2.05]);
  flat(.7, 1.7, lam(0x7a3fb0), -19.7, .012, -5.2, 1, G);
  potPlant(-16, -2.3);
  sign(['休息區', 'PANTRY · GYM'], -18.6, 2.6, -1.55);

  /* 兩間會議室（後排）：FATP 開 Daily sync up，MLB 那間給 MLB 自己用。直的長桌，後牆一面螢幕，門開在走道這邊 */
  function meetRoom(x0, x1, id, lines, name) {
    const cx = (x0 + x1) / 2;
    flat(x1 - x0, 7.6, blue, cx, .006, -5.4, 1, G);
    pane(x0, -1.6, cx - .55, -1.6); pane(cx + .55, -1.6, x1, -1.6);
    if (x1 < -8.5) pane(x1, -9.2, x1, -1.6);
    box(1, .76, 3.4, M.desk, cx, .38, -5.6, G);
    box(1.1, .06, 3.5, lam(0xe9e4da), cx, .79, -5.6, G);
    box(2.2, 1.2, .1, M.dark, cx, 1.9, -9.05, G);
    screen(id, G, cx, 1.9, -8.99, 2, 1, lines, '#ffc94a');
    sign(['會議室', name], x0 + .85, 2.6, -1.52, 1.4);          // 牌子掛在門的左邊，不跟金屬探測門的牌子疊在一起
    stop.push([cx - .5, cx + .5, -7.3, -3.9]);
  }
  pane(-15.4, -9.2, -15.4, -1.6);
  meetRoom(-15.4, -11.9, 'mtg', ['DAILY SYNC', 'CTB / BUILD / YIELD / SHIP'], 'FATP');
  meetRoom(-11.9, -8.4, 'mtg2', ['MLB', 'SMA / BM / DOE'], 'MLB');
  pickBox('mtgroom', 1.2, 1.4, 3.6, -13.65, .7, -5.6, G);

  /* EPM 辦公室（前排 x -21.8 ~ -15.6）：五個 EPM 加 Project Lead，兩排、一人一張桌子 */
  flat(6.2, 8.2, carpet, -18.7, .006, 4.9, 1, G);
  pane(-21.8, .8, -19.7, .8); pane(-17.7, .8, -15.6, .8); pane(-15.6, .8, -15.6, 9);
  [[-20.2, 2.6], [-17.2, 2.6], [-20.2, 5], [-17.2, 5], [-20.2, 7.4], [-17.2, 7.4]].forEach(([x, z]) => workDesk(x, z));
  label('EPM 辦公室', -18.7, 8.5, 3, G);

  /* OPM 辦公室（前排 x -15.6 ~ -11.4，靠走道那一半）：兩張桌子並排，跟主線沒什麼交集 */
  flat(4.2, 4.2, carpet, -13.5, .006, 2.9, 1, G);
  pane(-15.6, .8, -14.9, .8); pane(-12.1, .8, -11.4, .8); pane(-11.4, .8, -11.4, 5); pane(-15.6, 5, -11.4, 5);
  [-14.5, -12.5].forEach(x => {desk(x, 2.6, 1.4, G); box(.5, .35, .05, M.dark, x, 1.0, 2.4, G); stop.push([x - .7, x + .7, 2.15, 3.05])});
  sign(['OPM', '辦公室'], -13.5, 2.6, .88, 1.2);

  /* 進產線的通道（x -11.4 ~ -8.4）：從大門、前台直走到主走道，右轉就是金屬探測門 */
  flat(3, 4.2, tile, -9.9, .006, 2.9, .5, G);

  /* 前台（前排 x -15.6 ~ -8.4，靠大門那一半）：橫向的一長條。櫃台橫放，韋恩、哲哲站在後面面對大門；
     左邊咖啡、飲水機，右邊靠牆一架給客戶的靜電服；前面是對外大門 */
  flat(7.2, 4, tile, -12, .006, 7, .5, G);
  box(3, 1.05, .6, cab, -13.2, .53, 6.6, G);
  box(3.1, .06, .7, topM, -13.2, 1.08, 6.6, G);
  box(.45, .3, .04, M.dark, -12.4, 1.3, 6.45, G);
  stop.push([-14.7, -11.7, 6.3, 6.9]);
  sign(['前台', 'RECEPTION'], -13.2, 1.95, 6.96, 1.2);
  box(.6, .9, 1.4, cab, -15.2, .45, 7.6, G);                   // 咖啡、飲水機
  box(.45, .55, .4, M.dark, -15.2, 1.18, 7.2, G); box(.24, .1, .03, lam(0xc98a00), -15.2, 1.28, 7.42, G);
  [7.75, 7.95, 8.15].forEach(z => box(.1, .12, .1, lam(0xffffff), -15.2, .96, z, G));
  box(.4, 1.1, .4, lam(0xf2f2f2), -15.2, .55, 8.7, G); box(.3, .4, .3, lam(0x7ac0e8), -15.2, 1.3, 8.7, G);
  stop.push([-15.55, -14.85, 6.85, 8.95]);
  box(.08, 1.7, 1.6, M.trim, -8.62, .85, 6.6, G);              // 給客戶的靜電服
  [6, 6.4, 6.8, 7.2].forEach(z => box(.12, .9, .34, esd2, -8.78, 1.1, z, G));
  stop.push([-9, -8.4, 5.75, 7.45]);
  [-11.05, -8.95].forEach(x => box(.15, 2.6, .2, M.trim, x, 1.3, 9, G));   // 對外大門：門框、兩扇玻璃門、腳踏墊
  box(2.25, .2, .2, M.trim, -10, 2.65, 9, G);
  box(.95, 2.3, .05, M.glass, -10.5, 1.15, 9, G, false); box(.95, 2.3, .05, M.glass, -9.5, 1.15, 9, G, false);
  flat(1.8, 1, lam(0x3a3f44), -10, .012, 8.3, 1, G);
  sign(['大門', 'EXIT'], -10, 3.1, 9.12, 1.1);

  /* 產線的牆：x -8.4 右邊整片都是產線（物料倉、RF 室、各條線、出貨倉、FA），只有主走道上一個門，門上是金屬探測門 */
  const lineWall = lam(0xdfe5e8, {map: TX.wall});
  [[-9.2, -1.5], [.3, 9]].forEach(([z0, z1]) => {box(.25, 2.8, z1 - z0, lineWall, -8.4, 1.4, (z0 + z1) / 2, G); stop.push([-8.53, -8.27, z0, z1])});

  /* ── 物料倉（x -8.4 ~ -3.6）：兩排料架、IQC 的桌子；前面是 RF 室與入口 ── */
  flat(4.8, 7.6, tile, -6, .006, -5.4, .5, G);
  const rack = lam(0x3d6fa8), bin = lam(0xe0a040), bin2 = lam(0x9fb4c0);
  [[-6, -8.3, 4.2], [-6, -6.2, 4.2]].forEach(([x, z, w]) => {
    box(w, 2.4, .1, M.trim, x, 1.2, z - .4, G);              // 背板
    [-w / 2, w / 2].forEach(dx => box(.1, 2.4, .9, rack, x + dx, 1.2, z, G));
    for (let i = 0; i < 3; i++) {
      box(w, .06, .9, rack, x, .17 + i * .78, z, G);           // 層板
      for (let j = 0; j < Math.floor(w / .9); j++) box(.7, .5, .6, (i + j) % 3 ? bin : bin2, x - w / 2 + .5 + j * .9, .45 + i * .78, z + .05, G);
    }
    box(w + .1, .08, .95, rack, x, 2.42, z, G);
    stop.push([x - w / 2 - .05, x + w / 2 + .05, z - .45, z + .45]);
  });
  desk(-5.4, -3.6, 1.6, G);
  box(.5, .35, .05, M.dark, -5.4, 1.0, -3.8, G);
  stop.push([-6.2, -4.6, -4.05, -3.15]);
  pickBox('whs', 4.4, 2.6, 3, -6, 1.2, -7.2, G);
  label('物料倉 WH', -6, -2.4, 3, G);
  glassRoom(-8.2, -4.8, 1.6, 5.6, ['RF 測試室', 'ANT / mmWave']);
  box(1.4, 1.8, 1.4, lam(0x5f7480), -6.5, .9, 3.6, G);     // 遮蔽箱
  flat(.1, 7.4, M.tape, -3.5, .01, -5.5, 1, G);             // 物料倉與產線的分界

  /* 產線的門：主走道穿過產線的牆，門框就是金屬探測門；一進門右手邊一架橘色靜電服 */
  [-1.5, .3].forEach(z => {box(.3, 2.6, .25, M.trim, -8.4, 1.3, z, G); stop.push([-8.55, -8.25, z - .13, z + .13])});
  box(.34, .3, 2.1, M.trim, -8.4, 2.55, -.6, G);
  box(.26, .26, 1.6, lineWall, -8.4, 2.85, -.6, G);         // 門上方補滿到牆高
  tower('mgate', G, -8.4, 2.7, -1.35);
  pickBox('mgate', .8, 2.4, 1.6, -8.4, 1.2, -.6, G);
  sign(['金屬探測門', '進產線請換靜電服'], -9.4, 2.9, -1.45, 1.4);
  box(1.2, 1.7, .08, M.trim, -7.3, .85, -1.42, G);           // 靜電服的衣架
  const esd = lam(0xf07a1e);
  [-7.7, -7.3, -6.9].forEach(x => box(.34, .9, .12, esd, x, 1.1, -1.32, G));
  stop.push([-7.9, -6.7, -1.5, -1.2]);

  /* ── 產線區（x -3.6 ~ 14.6）── */
  [-1.65, .45].forEach(z => flat(18.2, .1, M.tape, 5.5, .01, z, 1, G));   // 主走道的黃線

  /* 後排：MLB 的 SMA 打板線（Pre Offline 那一格）、HSG Offline 室、機房 */
  const smtM = lam(0xe8ecee, {map: TX.panel});
  box(5.6, 1.4, 1, smtM, .4, .7, -8.6, G);
  [-1.5, .4, 2.3].forEach(x => box(1.2, .5, .9, M.tool2, x, 1.65, -8.6, G));
  box(5.8, .1, .3, M.dark, .4, 1.1, -8.0, G);              // 輸送帶
  screen('smt', G, .4, 2.5, -8.08, 1.5, .84, ['SMA', 'INPUT 0/600'], '#7fe3c8');
  tower('smt', G, 3.5, 1.9, -8.6);
  stop.push([-2.4, 3.3, -9.1, -8.1]);
  pickBox('smtline', 6, 2.4, 1.6, .4, 1.2, -8.5, G);
  label('MLB / SMA 線', .4, -7.2, 3, G);
  room(4.2, 8.6, -9.2, -7.8, 2.6, ['HSG', 'OFFLINE']);
  room(9, 12.2, -9.2, -7.8, 2.6, ['IT / 空調', '機房']);
  room(12.6, 14.4, -9.2, -7.8, 2.6, ['WC', '廁所']);        // R 大守在門口

  /* 組裝線：SPA 站接兩條並排的 full link（CG、BP） */
  box(1.4, 1.6, 1.8, M.tool2, -1.7, .8, -5.5, G);
  sign(['SPA'], -1.7, 1.2, -4.58, .9);
  [-5.95, -5.05].forEach((z, k) => {
    box(14, .85, .85, M.tool, 6.4, .43, z, G);
    box(14.2, .08, .9, M.dark, 6.4, .89, z, G);
    for (let x = .2; x < 13.4; x += 1.7) box(.5, .3, .45, lam(0x8fa8b4), x + k * .85, 1.08, z, G);
  });
  [1.1, 4.5, 7.9, 11.3].forEach(x => box(.9, .7, .6, M.tool2, x, 1.28, -6.0, G));   // 工站
  sign(['CG full link', 'BP full link'], .3, 1.75, -4.55, 1.3);
  screen('asm', G, 3, 2.4, -6.5, 1.5, .84, ['FATP', 'UPH --'], '#7fe3c8');
  box(.12, 1, .12, M.trim, 13.8, .5, -5.5, G);
  tower('asm', G, 13.8, 1.2, -5.5);
  stop.push([-2.4, 13.9, -6.4, -4.6]);
  pickBox('asmline', 16, 2.4, 2, 5.6, 1.2, -5.5, G);
  label('組裝線 FATP', 6.4, -3.9, 3.4, G);

  /* OTA 測試線：兩條，上面一格一格的測試箱 */
  [-2.85, -2.15].forEach(z => {
    box(14, .7, .6, M.tool, 6.4, .35, z, G);
    for (let x = 0; x < 13.4; x += 1.8) {box(.9, .8, .6, M.tool2, x, 1.1, z, G); box(.5, .3, .03, M.dark, x, 1.2, z + .31, G)}
    box(.1, .9, .1, M.trim, 13.8, .45, z, G);
  });
  tower('t1', G, 13.8, 1.0, -2.85);
  tower('t2', G, 13.8, 1.0, -2.15);
  sign(['OTA 2', 'OTA 1'], -1.1, 1.3, -1.78, 1);
  screen('tst', G, 6.4, 2.3, -3.25, 1.5, .84, ['YIELD', '--.-%'], '#7fe3c8');
  stop.push([-1.6, 14, -3.2, -1.8]);
  pickBox('tester', 15, 2, 1.6, 6.4, 1, -2.5, G);
  label('OTA 測試線', 3, -1, 3, G);

  /* AP 線：兩條；右邊一塊用黃線圍起來的預留區 */
  [1.05, 1.95].forEach(z => {
    box(9.6, .8, .8, M.tool, 4.2, .4, z, G);
    box(9.7, .06, .85, M.dark, 4.2, .83, z, G);
    for (let x = 0; x < 9; x += 1.6) box(.6, .4, .5, M.tool2, x, 1.06, z, G);
  });
  sign(['AP'], -1.1, 1.3, 2.42, .8);
  stop.push([-1.6, 9.1, .6, 2.4]);
  label('AP 線', 4.2, 3.4, 2, G);
  [[12, .7, 4.4, .1], [12, 2.4, 4.4, .1], [9.8, 1.55, .1, 1.8], [14.2, 1.55, .1, 1.8]].forEach(([x, z, w, d]) => flat(w, d, M.tape, x, .01, z, 1, G));
  label('預留區', 12, 1.55, 2.2, G);

  /* 前排的附房（挑幾間當代表） */
  glassRoom(-3.2, .6, 4.8, 8.8, ['Wireless']);
  glassRoom(1, 4.8, 4.8, 8.8, ['EE DOE']);
  glassRoom(5.2, 8.6, 4.8, 8.8, ['CSAR']);
  [[-1.3, 6.4], [2.9, 6.4], [6.9, 6.4]].forEach(([x, z]) => {desk(x, z, 1.6, G); box(.6, .35, .4, M.tool2, x - .3, .97, z, G); box(.35, .06, .35, M.green, x + .4, .83, z, G)});
  pickBox('offlab', 3.8, 2.2, 4, 2.9, 1.1, 6.8, G);         // 這三間就是 Offline 機台去的 lab

  /* 出貨倉（GBWH）：棧板、倉管的桌子，前面是出貨口 */
  flat(5.2, 4.2, tile, 11.8, .006, 6.9, .5, G);
  const pal = lam(0xb89a6e, {map: TX.wood}), carton = lam(0xd9b98a);
  [[12.4, 6.4], [13.8, 6.4], [12.4, 7.9]].forEach(([x, z]) => {box(1.4, .15, 1.2, pal, x, .08, z, G); box(1.2, 1.1, 1, carton, x, .7, z, G); box(1.2, .5, 1, carton, x, 1.5, z, G)});
  stop.push([11.7, 14.5, 5.8, 7], [11.7, 13.1, 7.3, 8.5]);
  flat(2.8, .3, M.hazard, 13, .012, 8.95, 1, G);           // 出貨口
  desk(10.2, 6.6, 1.6, G);
  stop.push([9.4, 11, 6.15, 7.05]);
  pickBox('shipdock', 3.2, 2.2, 3.2, 13, 1.1, 7.1, G);
  label('出貨倉 FG', 10.4, 8.4, 2.6, G);

  /* ── HWTE（x 14.8 ~ 19.2）：Camera 室、FA 室 ── */
  room(14.8, 19.2, -9.2, -6.6, 2.6, ['KPD', 'CAMERA']);
  flat(4.4, 4.8, tint, 17, .006, -4, .5, G);
  pane(14.8, -1.6, 15.8, -1.6); pane(18.2, -1.6, 19.2, -1.6);
  [15.6, 17, 18.4].forEach(x => {box(1.2, 1.8, .8, M.tool, x, .9, -5.8, G); box(.8, .5, .05, M.dark, x, 1.3, -5.38, G)});
  stop.push([15, 19, -6.2, -5.4]);
  desk(17, -3.4, 2.2, G);
  [16.3, 17.6].forEach(x => box(.35, .06, .35, M.green, x, .83, -3.4, G));   // 待 FA 的主板
  stop.push([15.9, 18.1, -3.85, -2.95]);
  pickBox('fabench', 2.4, 1.2, 1.2, 17, .6, -3.4, G);
  sign(['HWTE FD', 'FA 室'], 17, 2.6, -1.5);
  glassRoom(14.8, 19.2, 1.2, 6.2, ['HWTE', 'CAMERA']);
  glassRoom(14.8, 19.2, 6.6, 8.8, ['SW', 'COREOS']);

  /* ── 宿舍（x 23.6 ~ 31.4）：廠區旁邊的員工宿舍，一間兩個人。下班回來，群組還在響 ── */
  const wood = lam(0xe2c9a3, {map: TX.wood}), dormW = lam(0xf1ebe0, {map: TX.wall});
  flat(7.8, 8.6, wood, 27.5, .006, 1.1, 1, G);
  box(8.2, 2.8, .2, dormW, 27.5, 1.4, -3.3, G);
  box(.2, 2.8, 8.8, dormW, 23.5, 1.4, 1.1, G);
  box(.2, 2.8, 8.8, dormW, 31.5, 1.4, 1.1, G);
  box(1.8, 1, .06, lam(0x1b2a44), 27.5, 1.7, -3.18, G);    // 窗戶，外面是夜
  box(1.9, .08, .1, M.trim, 27.5, 2.22, -3.16, G); box(1.9, .08, .1, M.trim, 27.5, 1.18, -3.16, G);
  const sheet = lam(0xdfe8f0), sheet2 = lam(0xf0d9c8);
  [[25, sheet], [30, sheet2]].forEach(([x, s]) => {         // 兩張床，靠後牆
    box(2.1, .4, 1.1, M.desk, x, .2, -2.5, G); box(2, .18, 1, s, x, .49, -2.5, G); box(.6, .12, .8, lam(0xffffff), x - .7, .64, -2.5, G);
    stop.push([x - 1.05, x + 1.05, -3.2, -1.95]);
  });
  pickBox('bed', 2.2, 1, 1.2, 25, .5, -2.5, G);
  desk(25.6, 2.4, 1.6, G);                                   // 你的書桌：筆電、泡麵、手機
  box(.5, .3, .04, M.dark, 25.4, .98, 2.25, G); box(.5, .03, .35, M.trim, 25.4, .81, 2.45, G);
  box(.18, .2, .18, lam(0xd04a2a), 26.1, .9, 2.4, G); box(.12, .02, .22, M.dark, 25.95, .81, 2.65, G);
  stop.push([24.8, 26.4, 1.95, 2.85]);
  pickBox('homepc', 1.8, 1.4, 1.2, 25.6, .7, 2.4, G);
  desk(29.6, 2.4, 1.6, G);                                   // 室友的桌子：兩個螢幕
  [29.25, 29.95].forEach(x => box(.6, .38, .04, M.dark, x, 1.0, 2.2, G));
  stop.push([28.8, 30.4, 1.95, 2.85]);
  box(.6, 1, .6, lam(0xe8ecee, {map: TX.panel}), 24, .5, 4.6, G);   // 小冰箱
  stop.push([23.7, 24.3, 4.3, 4.9]);
  label('宿舍 B 棟 3F', 27.5, 5, 3, G);
  stop.push([19.2, 23.6, -9, 9], [23.6, 31.6, -9, -3.2], [31.4, 32, -9, 9], [23.6, 31.4, 5.6, 9]);   // 宿舍以外的地方走不過去

  K.block(stop);

  /* 人站的點 */
  K.nodes({
    gate: [-6.2, 7.2], g1: [-4, 3],
    a1: [-20.4, -.4], a2: [-18.7, -.4], a3: [-6, -.4], a4: [-2, -.4], a5: [3, -.4], a6: [8, -.4], a7: [13, -.4], a8: [17, -.4],
    f1x: [-24.7, -.4], cb: [-24.7, -4.75], f1d: [-23.2, -4.75], f1e: [-26.2, -4.75],
    rest: [-19.7, -3], pan: [-19.7, -7.7],
    mtgx: [-13.65, -.4], m1: [-14.75, -6.8], m2: [-14.75, -5.6], m3: [-14.75, -4.4], m4: [-12.55, -6.8], m5: [-12.55, -5.6], m6: [-12.55, -4.4], m7: [-13.65, -2.9], m8: [-13.65, -8.2],
    mlbx: [-10.15, -.4],
    epmx: [-18.7, 1.2], oc: [-18.7, 3.85], oc2: [-18.7, 6.25],
    d_cmd: [-20.2, 1.45], d_asm: [-17.2, 1.45], d_tst: [-20.2, 3.85], d_shp: [-17.2, 3.85], d_mlb: [-20.2, 6.25], d_boss: [-17.2, 6.25],
    opm1: [-14.5, 1.45], opm2: [-12.5, 1.45],
    wayne: [-14, 5.85], zhe: [-12.4, 5.85], rcp: [-10, 3], rcb: [-11, 5.85], door: [-10, 8],
    whsx: [-7, -5], iqc: [-5.4, -4.75], pdn: [-7.4, -4.4],
    v1: [-3, -3.9], v2: [-3, -7.1], smt: [-1, -7.1], smtx: [2.2, -7.1],
    line: [3, -3.9], asmx: [6, -3.9],
    te: [9, -1], rep: [17, -4.55], fax: [17, -2.4],
    wh: [10.2, 5.45], shipx: [11.4, 3.9], labx: [2.9, 4.1], rdn: [16.2, .25],
    mgate: [-9.6, -.6], swn: [14, 3.75], rda: [13.5, -7.25], ada: [5.5, 3.75],
    dorm: [27.5, .75], dormbed: [25, -1.25], dormpc: [25.6, 1.45], roomie: [29.6, 1.45], byron: [28, 4.25]
  }, 'dorm-dormbed dorm-dormpc dorm-roomie dorm-byron a8-rdn a7-swn smtx-rda a5-ada gate-g1 g1-a4 a3-a4 a4-a5 a5-a6 a6-a7 a7-a8 '
    + 'f1x-a1 a1-a2 a2-mtgx mtgx-mlbx mlbx-mgate mgate-a3 f1x-cb cb-f1d cb-f1e a1-rest rest-pan '
    + 'mtgx-m7 m7-m3 m3-m2 m2-m1 m1-m8 m7-m6 m6-m5 m5-m4 m4-m8 mtgx-opm1 opm1-opm2 mlbx-rcp rcp-rcb rcb-zhe zhe-wayne rcp-door '
    + 'a2-epmx epmx-d_cmd epmx-d_asm epmx-oc oc-d_tst oc-d_shp oc-oc2 oc2-d_mlb oc2-d_boss '
    + 'a3-whsx whsx-iqc whsx-pdn a4-v1 v1-v2 v2-smt smt-smtx v1-line line-asmx a6-te a8-fax fax-rep a7-shipx shipx-wh g1-labx');

  /* 主頁背景的鏡頭 */
  WORLD.shots = [{p: [5, 1, -4], d: 24, yaw: .3, pitch: .7}, {p: [-18, 1, 0], d: 18, yaw: -.35, pitch: .75}, {p: [14, 1, -1], d: 19, yaw: -.4, pitch: .7}, {p: [27.5, 1, .5], d: 13, yaw: -.3, pitch: .7}, {p: [-12, 1, 4], d: 14, yaw: -.3, pitch: .7}];
});
WORLD.level = 'factory';
