/* EMS 工廠一樓（照實際樓層圖簡化，附房只挑幾間當代表）。
   由左到右：辦公區（後半是客戶 F1 辦公區，前半是會議室與 EPM 辦公室）→ 物料倉與 RF 室 →
   產線區（後排 SMA 線與 Offline 室；中間組裝線 CG / BP full link、OTA 測試線、AP 線；前排幾間附房與出貨倉）→
   最右邊 HWTE 的房間（Camera、FA 室）。一條橫向主走道（z ≈ -0.4）把整層串起來，入口在物料倉前面。
   座標：x 往右、z 往鏡頭（畫面下方）、y 往上；1 單位大約 1 公尺。
   K 是框架借給關卡的工具（engine/world.js 的 LVK）。 */
levelAdd('factory', function (K) {
  const {box, flat, lam, M, TX, label, screen, tower, desk, pickBox, G} = K;
  K.bounds(-19, 19, -9, 9);
  const floor = lam(0xffffff, {map: TX.floor}), tile = lam(0xf6efd8, {map: TX.tile});
  const carpet = lam(0xd8cfbd, {map: TX.carpet}), blue = lam(0xc9d6e2, {map: TX.carpet}), wall = lam(0xf3f5f6, {map: TX.wall});
  const roomM = lam(0xe2e9ec, {map: TX.wall}), tint = lam(0xdcecf2, {map: TX.tile});
  const stop = [];   // 走不過去的地方 [x0, x1, z0, z1]，最後一起交給 K.block

  /* 地板與外牆（前面開著，鏡頭從這邊看） */
  flat(38.6, 18.6, floor, 0, 0, -.1, 1, G);
  box(38.6, 3.2, .3, wall, 0, 1.6, -9.35, G);
  box(.3, 3.2, 18.6, wall, -19.35, 1.6, -.1, G);
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

  /* ── 辦公區（x -19.2 ~ -8.4）── */
  flat(10.8, 7.6, blue, -13.8, .006, -5.4, 1, G);       // 客戶辦公區
  flat(5, 8.2, blue, -16.7, .006, 4.9, 1, G);           // 會議室
  flat(5.8, 8.2, carpet, -11.3, .006, 4.9, 1, G);       // EPM 辦公室
  pane(-19.2, -1.6, -14.6, -1.6); pane(-12.8, -1.6, -8.4, -1.6);   // 客戶辦公區前面，中間是門
  pane(-8.4, -9.2, -8.4, -1.6);
  pane(-19.2, .8, -15.6, .8); pane(-14.2, .8, -12.3, .8); pane(-10.3, .8, -8.4, .8);   // 會議室、EPM 辦公室的門口
  pane(-14.2, .8, -14.2, 9); pane(-8.4, .8, -8.4, 9);

  /* 客戶（F1）辦公區：兩排桌子，Mandy 坐中間 */
  [-17, -13.8, -10.6].forEach(x => [-7, -4].forEach(z => workDesk(x, z)));
  label('客戶辦公區 F1', -13.8, -2.6, 4, G);

  /* 會議室：一張直的長桌，桌頭牆上一面螢幕 */
  box(1.6, .76, 4.2, M.desk, -16.7, .38, 5.2, G);
  box(1.7, .06, 4.3, lam(0xe9e4da), -16.7, .79, 5.2, G);
  box(2.6, 1.3, .1, M.dark, -16.7, 2.0, .95, G);
  screen('mtg', G, -16.7, 2.0, 1.01, 2.4, 1.1, ['DAILY SYNC', 'CTB / BUILD / YIELD / SHIP'], '#ffc94a');
  stop.push([-17.5, -15.9, 3.1, 7.3]);
  pickBox('mtgroom', 1.8, 1.4, 4.4, -16.7, .7, 5.2, G);
  label('會議室', -16.7, 8.5, 2.2, G);

  /* EPM 辦公室：五個 EPM 加主管，兩排、一人一張桌子 */
  [[-12.9, 2.6], [-9.7, 2.6], [-12.9, 5], [-9.7, 5], [-12.9, 7.4], [-9.7, 7.4]].forEach(([x, z]) => workDesk(x, z));
  label('EPM 辦公室', -11.3, 8.5, 3, G);

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
  label('入口', -6.2, 8.4, 1.6, G);
  flat(.1, 7.4, M.tape, -3.5, .01, -5.5, 1, G);             // 物料倉與產線的分界

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
  room(9, 14.4, -9.2, -7.8, 2.6, ['IT / 空調', '機房']);

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

  K.block(stop);

  /* 人站的點 */
  K.nodes({
    gate: [-6.2, 7.2], g1: [-4, 3],
    a1: [-16.7, -.4], a2: [-11.3, -.4], a3: [-6, -.4], a4: [-2, -.4], a5: [3, -.4], a6: [8, -.4], a7: [13, -.4], a8: [17, -.4],
    f1x: [-13.7, -1.2], f1d: [-13.8, -5.15],
    mtgx: [-14.9, 1.9], m1: [-17.95, 3.8], m2: [-17.95, 5.2], m3: [-17.95, 6.6], m4: [-15.45, 3.8], m5: [-15.45, 5.2], m6: [-15.45, 6.6], m7: [-16.7, 2.3], m8: [-16.7, 8.1],
    epmx: [-11.3, 1.2], oc: [-11.3, 3.85], oc2: [-11.3, 6.25],
    d_cmd: [-12.9, 1.45], d_asm: [-9.7, 1.45], d_tst: [-12.9, 3.85], d_shp: [-9.7, 3.85], d_mlb: [-12.9, 6.25], d_boss: [-9.7, 6.25],
    whsx: [-7, -5], iqc: [-5.4, -4.75], pdn: [-7.4, -4.4],
    v1: [-3, -3.9], v2: [-3, -7.1], smt: [-1, -7.1], smtx: [2.2, -7.1],
    line: [3, -3.9], asmx: [6, -3.9],
    te: [9, -1], rep: [17, -4.55], fax: [17, -2.4],
    wh: [10.2, 5.45], shipx: [11.4, 3.9]
  }, 'gate-g1 g1-a4 a1-a2 a2-a3 a3-a4 a4-a5 a5-a6 a6-a7 a7-a8 '
    + 'a2-f1x f1x-f1d a1-mtgx mtgx-m7 m7-m1 m1-m2 m2-m3 m3-m8 m7-m4 m4-m5 m5-m6 m6-m8 '
    + 'a2-epmx epmx-d_cmd epmx-d_asm epmx-oc oc-d_tst oc-d_shp oc-oc2 oc2-d_mlb oc2-d_boss '
    + 'a3-whsx whsx-iqc whsx-pdn a4-v1 v1-v2 v2-smt smt-smtx v1-line line-asmx a6-te a8-fax fax-rep a7-shipx shipx-wh');

  /* 主頁背景的鏡頭 */
  WORLD.shots = [{p: [5, 1, -4], d: 24, yaw: .3, pitch: .7}, {p: [-12, 1, 2], d: 17, yaw: -.35, pitch: .75}, {p: [14, 1, -1], d: 19, yaw: -.4, pitch: .7}];
});
WORLD.level = 'factory';
