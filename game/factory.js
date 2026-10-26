/* EMS 工廠一樓：後排是物料倉、MLB（SMA）線、組裝線、測試區；前排是出貨倉、會議室、EPM 辦公室。中間是走道。
   座標：x 往右、z 往鏡頭（畫面下方）、y 往上；1 單位大約 1 公尺。
   K 是框架借給關卡的工具（engine/world.js 的 LVK）。 */
levelAdd('factory', function (K) {
  const {box, flat, lam, M, TX, label, screen, tower, desk, pickBox, G} = K;
  K.bounds(-16, 16, -9, 8);
  /* 地板與牆 */
  const floor = lam(0xffffff, {map: TX.floor}), tile = lam(0xf6efd8, {map: TX.tile});
  const carpet = lam(0xd8cfbd, {map: TX.carpet}), blue = lam(0xc9d6e2, {map: TX.carpet}), wall = lam(0xf3f5f6, {map: TX.wall});
  flat(32.4, 17.4, floor, 0, 0, -.5, 1, G);
  flat(7, 6.4, tile, -12.3, .006, -5.7, .5, G);           // 物料倉
  flat(9.6, 5.8, carpet, 10.8, .006, 4.9, 1, G);          // EPM 辦公室
  flat(9, 5.8, blue, 0, .006, 4.9, 1, G);                 // 會議室
  flat(8.6, 5.8, tile, -11.5, .006, 4.9, .5, G);          // 出貨倉
  [-2.3, 1.7].forEach(z => flat(32, .1, M.tape, 0, .01, z, 1, G));   // 走道的黃線
  box(32.4, 3.2, .3, wall, 0, 1.6, -9.35, G);
  box(.3, 3.2, 17.4, wall, -16.35, 1.6, -.5, G);
  box(.3, 3.2, 17.4, wall, 16.35, 1.6, -.5, G);

  /* 物料倉：兩排料架、IQC 的桌子 */
  const rack = lam(0x3d6fa8), bin = lam(0xe0a040), bin2 = lam(0x9fb4c0);
  [[-12.5, -8.3, 6], [-13, -6.4, 4.2]].forEach(([x, z, w]) => {
    box(w, 2.4, .1, M.trim, x, 1.2, z - .4, G);              // 背板
    [-w / 2, w / 2].forEach(dx => box(.1, 2.4, .9, rack, x + dx, 1.2, z, G));
    for (let i = 0; i < 3; i++) {
      box(w, .06, .9, rack, x, .17 + i * .78, z, G);           // 層板
      for (let j = 0; j < Math.floor(w / .9); j++) box(.7, .5, .6, (i + j) % 3 ? bin : bin2, x - w / 2 + .5 + j * .9, .45 + i * .78, z + .05, G);
    }
    box(w + .1, .08, .95, rack, x, 2.42, z, G);
  });
  desk(-10.2, -4, 1.6, G);
  box(.5, .35, .05, M.dark, -10.2, 1.0, -4.2, G);
  pickBox('whs', 5, 2.6, 3, -12.8, 1.2, -7.2, G);
  label('物料倉 WH', -12.3, -3.1, 3.2, G);

  /* MLB 線：一條 SMA 打板的長機台 */
  const smtM = lam(0xe8ecee, {map: TX.panel});
  box(5.6, 1.4, 1.3, smtM, -4.3, .7, -7.2, G);
  [-6.2, -4.3, -2.4].forEach(x => box(1.2, .5, 1, M.tool2, x, 1.65, -7.2, G));
  box(5.8, .12, .5, M.dark, -4.3, .95, -6.4, G);           // 輸送帶
  screen('smt', G, -4.3, 2.4, -6.52, 1.5, .84, ['SMA', 'INPUT 0/600'], '#7fe3c8');
  tower('smt', G, -1.7, 1.9, -7.2);
  pickBox('smtline', 6, 2.4, 2, -4.3, 1.2, -7, G);
  label('MLB / SMA 線', -4.3, -3.1, 3.6, G);

  /* 組裝線：輸送帶加幾個工站 */
  box(6.6, .85, 1, M.tool, 3.8, .43, -6.6, G);
  box(6.8, .08, 1.1, M.dark, 3.8, .89, -6.6, G);
  [1.2, 2.9, 4.6, 6.3].forEach(x => {box(.9, .7, .7, M.tool2, x, 1.28, -7.4, G); box(.4, .25, .4, lam(0x8fa8b4), x, 1.06, -6.6, G)});
  screen('asm', G, 3.8, 2.4, -7.85, 1.5, .84, ['FATP', 'UPH --'], '#7fe3c8');
  tower('asm', G, 7.3, 1.2, -6.6);
  pickBox('asmline', 7, 2.4, 2, 3.8, 1.2, -6.8, G);
  label('組裝線 FATP', 3.8, -3.1, 3.6, G);

  /* 測試區：四台測試櫃，前面一張 FA 的桌子 */
  [9.4, 11, 12.6, 14.2].forEach((x, i) => {box(1.3, 2, 1, M.tool, x, 1, -8.2, G); box(.9, .5, .05, M.dark, x, 1.4, -7.68, G); if (i % 2 === 0) tower('t' + (i / 2 + 1), G, x, 2, -8.2)});
  screen('tst', G, 11.8, 2.6, -7.66, 1.5, .84, ['YIELD', '--.-%'], '#7fe3c8');
  desk(12, -3.8, 2.2, G);
  [11.3, 12.6].forEach(x => box(.35, .06, .35, M.green, x, .83, -3.8, G));   // 待 FA 的主板
  pickBox('tester', 6, 2.4, 1.6, 11.8, 1.2, -8, G);
  pickBox('fabench', 2.4, 1.2, 1.2, 12, .6, -3.8, G);
  label('測試區 TEST / FA', 11.8, -2.9, 4, G);

  /* 出貨倉：棧板、倉管的桌子 */
  const pal = lam(0xb89a6e, {map: TX.wood}), carton = lam(0xd9b98a);
  [[-14.4, 6.6], [-12.6, 6.6], [-14.4, 4.6]].forEach(([x, z]) => {box(1.4, .15, 1.2, pal, x, .08, z, G); box(1.2, 1.1, 1, carton, x, .7, z, G); box(1.2, .5, 1, carton, x, 1.5, z, G)});
  box(.2, 2.6, 2.4, M.hazard, -16.15, 1.3, 5.6, G);         // 出貨門
  desk(-9.5, 4.6, 1.6, G);
  pickBox('shipdock', 4, 2.2, 3.4, -13.5, 1.1, 5.6, G);
  label('出貨倉 FG', -11.5, 2.6, 3.2, G);

  /* 會議室：長桌、牆上的螢幕 */
  box(5, .76, 1.6, M.desk, 0, .38, 5, G);
  box(5.1, .06, 1.7, lam(0xe9e4da), 0, .79, 5, G);
  box(3, 1.4, .1, M.dark, 0, 2.3, 2.15, G);
  screen('mtg', G, 0, 2.3, 2.21, 2.8, 1.2, ['DAILY SYNC', 'CTB / BUILD / YIELD / SHIP'], '#ffc94a');
  pickBox('mtgroom', 5.4, 1.4, 2, 0, .7, 5, G);
  label('會議室', 0, 7.5, 2.4, G);

  /* EPM 辦公室：五個 EPM 加主管，一人一張桌子 */
  [[7.5, 3.4], [10.5, 3.4], [13.5, 3.4], [7.5, 6.4], [10.5, 6.4], [13.5, 6.4]].forEach(([x, z]) => {
    desk(x, z, 1.8, G); box(.6, .4, .05, M.dark, x, 1.0, z - .2, G); box(.5, .03, .35, M.trim, x, .82, z + .1, G);
  });
  label('EPM 辦公室', 10.5, 7.5, 3.2, G);

  /* 走不過去的地方：[x0, x1, z0, z1] */
  K.block([
    [-15.5, -9.5, -8.8, -7.85], [-15.1, -10.9, -6.85, -5.95], [-11, -9.4, -4.45, -3.55],   // 料架、IQC 桌
    [-7.1, -1.4, -8, -6.15],                                                              // SMA 線
    [.5, 7.5, -8, -6.1],                                                                  // 組裝線
    [8.7, 14.9, -8.8, -7.7], [10.9, 13.1, -4.25, -3.35],                                  // 測試櫃、FA 桌
    [-15.1, -11.9, 4, 7.2], [-10.3, -8.7, 4.15, 5.05],                                    // 棧板、倉管桌
    [-2.5, 2.5, 4.2, 5.8],                                                                // 會議桌
    [6.6, 8.4, 2.95, 3.85], [9.6, 11.4, 2.95, 3.85], [12.6, 14.4, 2.95, 3.85],
    [6.6, 8.4, 5.95, 6.85], [9.6, 11.4, 5.95, 6.85], [12.6, 14.4, 5.95, 6.85]             // 辦公桌
  ]);

  /* 人站的點 */
  K.nodes({
    gate: [5, .75],
    a1: [-12, -.25], a2: [-8, -.25], a3: [-4.5, -.25], a4: [0, -.25], a5: [3.5, -.25], a6: [8, -.25], a7: [12, -.25],
    iqc: [-10.25, -5.25], pdn: [-13.75, -4.75], whsx: [-12.75, -5.25],
    smt: [-5.75, -5.25], smtx: [-3.25, -5.25],
    line: [2.75, -5.25], asmx: [5.25, -5.25],
    te: [9.75, -5.75], rep: [12.25, -5.75], tstx: [14.25, -5.25],
    wh: [-9.75, 3.75], shipx: [-11.25, 2.75],
    m1: [-1.75, 3.25], m2: [0, 3.25], m3: [1.75, 3.25], m4: [-1.75, 6.25], m5: [0, 6.25], m6: [1.75, 6.25], m7: [-3.25, 5], m8: [3.25, 5], mtgx: [0, 2.75],
    d_cmd: [7.5, 2.25], d_asm: [10.5, 2.25], d_tst: [13.5, 2.25], d_shp: [7.5, 5.25], d_mlb: [10.5, 5.25], d_boss: [13.5, 5.25], oc: [10.5, 4.75]
  }, 'a1-a2 a2-a3 a3-a4 a4-a5 a5-a6 a6-a7 gate-a5 gate-a6 a1-iqc a1-pdn a1-whsx a2-iqc a3-smt a3-smtx a5-line a5-asmx a6-te a7-rep a7-tstx '
    + 'a1-shipx a2-wh a4-mtgx mtgx-m1 mtgx-m2 mtgx-m3 m1-m7 m7-m4 m4-m5 m5-m6 m3-m8 m8-m6 a6-d_cmd a6-oc a7-d_asm a7-d_tst oc-d_shp oc-d_mlb oc-d_boss d_cmd-d_asm d_asm-d_tst');

  /* 主頁背景的鏡頭 */
  WORLD.shots = [{p: [3, 1, -4], d: 22, yaw: .3, pitch: .7}, {p: [8, 1, 3], d: 18, yaw: -.35, pitch: .75}, {p: [-9, 1, -2], d: 20, yaw: .4, pitch: .7}];
});
WORLD.level = 'factory';
