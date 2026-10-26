/* EPM24hr：人物、名詞、地方、主頁。
   人物、料號、數字與事件都是虛構的遊戲設定。 */

/* 主頁 */
HOME.title = 'EPM24hr';
HOME.sub = 'EMS 工廠 EPM 打工人的一天';
HOME.fine = '人物、料號、數字與事件都是虛構的遊戲設定，不代表任何一家公司的實際規範。';
HOME.support = null;

/* 遊戲裡的人。
   五個 EPM 同事都有身體：你選了哪個位子，那個位子的同事就是你（他會先藏起來）。
   報關行只會打電話。 */
STORY.cast = {
  me: {name: '你', role: 'EPM', tag: '你', color: '#c98a00'},
  cmd: {name: '小芸', role: 'Commodity EPM', tag: 'CMD', color: '#b8452f', about: '管料的人。早上八點打開 KT 郵件，晚上十點寄出實際缺料版 CTB，中間每一個小時都在問「這顆料什麼時候到」。'},
  asm: {name: '阿哲', role: 'Assembly EPM', tag: 'ASM', color: '#2b6bd6', about: '管組裝線。白班顧開線，晚班顧進度，手機永遠是震動模式。'},
  tst: {name: '佩佩', role: 'Testing EPM', tag: 'TST', color: '#7a3fb0', about: '管測試與 Yield。最擅長的事：一天跟催周邊三次，而且三次的語氣都不一樣。'},
  shp: {name: '大衛', role: 'Shipping EPM', tag: 'SHP', color: '#1f8a5b', about: '管出貨。每天早上先看客戶要幾台，再看倉庫有幾台，兩個數字通常不一樣。'},
  mlb: {name: 'Ken', role: 'MLB EPM', tag: 'MLB', color: '#c06a12', about: '管主板。SMA 打板、BM、DOE，客戶的計畫一改，他的計畫就跟著改。'},
  boss: {name: 'Jason', role: 'EPM 主管', tag: '主管', color: '#33454e', about: '主持 Daily sync up 與 wrap up。口頭禪是「所以 ETA 是什麼時候？」'},
  f1: {name: 'Mandy', role: 'F1（客戶）', tag: 'F1', color: '#d03a6a', about: '駐廠的客戶。看得懂每一張 CTB，也記得你上週說過的每一個 ETA。'},
  iqc: {name: '阿珠', role: 'IQC 來料檢驗', tag: 'IQC', color: '#3f9a5a', about: '來料檢驗。判退與否看標準，不看你有多急。'},
  pd: {name: '小林', role: 'PD 物控', tag: 'PD', color: '#5a7a2a', about: '負責發料、還料。說「盡量」的時候，通常就是不一定。'},
  line: {name: '強哥', role: '組裝線長', tag: '線長', color: '#2f5f9f', about: '組裝線的線長。線上任何異常，他第一個知道，你第二個。'},
  te: {name: '志明', role: '周邊 TE', tag: 'TE', color: '#6b4aa0', about: '周邊的測試工程師。Yield 回覆總是很快，理由總是 NTF。'},
  rep: {name: '阿德', role: '維修', tag: '維修', color: '#7a5a3a', about: '維修站。機台簽進 FA 之前，都要先經過他的桌子。'},
  smt: {name: '美玲', role: 'SMA 線長', tag: 'SMA', color: '#b0702a', about: 'MLB 線的線長。打板順序改三次，她會罵三次，然後照做。'},
  wh: {name: '胖虎', role: '成品倉管', tag: '倉管', color: '#3a7a6a', about: '成品倉。系統上的數字跟架上的數字，他都背得出來。'},
  brk: {name: '報關行', role: '電話', tag: '電話', color: '#55616b', about: '幫你把機台送出國門的人，對 HS code 特別敏感。'}
};
WORLD.cast = {
  me: {label: '你・EPM', fill: '#f2b01e', ink: '#231800', cloth: 0x3b3b3b, color: 0xc98a00, hair: 0x2b2320, node: 'gate', face: Math.PI},
  cmd: {label: '小芸・Commodity', fill: '#b8452f', ink: '#ffffff', cloth: 0x7a3a2a, color: 0xb8452f, hair: 0x3a2418, long: true, node: 'd_cmd', face: 0},
  asm: {label: '阿哲・Assembly', fill: '#2b6bd6', ink: '#ffffff', cloth: 0x2f4f8f, color: 0x2b6bd6, hair: 0x1c1c1c, node: 'd_asm', face: 0},
  tst: {label: '佩佩・Testing', fill: '#7a3fb0', ink: '#ffffff', cloth: 0x5a3a7a, color: 0x7a3fb0, hair: 0x2b1a12, long: true, node: 'd_tst', face: 0},
  shp: {label: '大衛・Shipping', fill: '#1f8a5b', ink: '#ffffff', cloth: 0x2f6a4a, color: 0x1f8a5b, hair: 0x2a2a2a, node: 'd_shp', face: 0},
  mlb: {label: 'Ken・MLB', fill: '#c06a12', ink: '#ffffff', cloth: 0x6a4a2a, color: 0xc06a12, hair: 0x1a1410, node: 'd_mlb', face: 0},
  boss: {label: 'Jason・主管', fill: '#33454e', ink: '#ffffff', cloth: 0x2a3a42, color: 0x33454e, hair: 0x555555, node: 'd_boss', face: 0},
  f1: {label: 'Mandy・F1', fill: '#d03a6a', ink: '#ffffff', cloth: 0xeeeeee, color: 0xd03a6a, hair: 0x4a2a1a, long: true, node: 'm8', face: -Math.PI / 2},
  iqc: {label: '阿珠・IQC', fill: '#3f9a5a', ink: '#ffffff', cloth: 0xf2f2f2, color: 0x3f9a5a, hair: 0x2b1a12, long: true, node: 'iqc', face: 0},
  pd: {label: '小林・PD', fill: '#5a7a2a', ink: '#ffffff', cloth: 0x4a5a3a, color: 0x5a7a2a, hair: 0x1c1c1c, node: 'pdn', face: Math.PI / 2},
  line: {label: '強哥・線長', fill: '#2f5f9f', ink: '#ffffff', cloth: 0x3a5a8a, color: 0x2f5f9f, hair: 0x1c1c1c, node: 'line', face: 0},
  te: {label: '志明・周邊 TE', fill: '#6b4aa0', ink: '#ffffff', cloth: 0xf2f2f2, color: 0x6b4aa0, hair: 0x2a2a2a, node: 'te', face: 0},
  rep: {label: '阿德・維修', fill: '#7a5a3a', ink: '#ffffff', cloth: 0x5a4a3a, color: 0x7a5a3a, hair: 0x3a3a3a, node: 'rep', face: 0},
  smt: {label: '美玲・SMA 線長', fill: '#b0702a', ink: '#ffffff', cloth: 0x8a6a4a, color: 0xb0702a, hair: 0x2b1a12, long: true, node: 'smt', face: 0},
  wh: {label: '胖虎・倉管', fill: '#3a7a6a', ink: '#ffffff', cloth: 0x3a5a5a, color: 0x3a7a6a, hair: 0x1c1c1c, node: 'wh', face: 0}
};

/* 走過去用的地方（不是人）。at：站在哪裡才算到了；mark：「！」浮在哪裡。
   pc_*：每個位子自己的電腦。 */
STORY.places = {
  pc_cmd: {name: '你的電腦', at: [7.5, 2.25], mark: [7.5, 1.9, 3.4], go: '回座位'},
  pc_asm: {name: '你的電腦', at: [10.5, 2.25], mark: [10.5, 1.9, 3.4], go: '回座位'},
  pc_tst: {name: '你的電腦', at: [13.5, 2.25], mark: [13.5, 1.9, 3.4], go: '回座位'},
  pc_shp: {name: '你的電腦', at: [7.5, 5.25], mark: [7.5, 1.9, 6.4], go: '回座位'},
  pc_mlb: {name: '你的電腦', at: [10.5, 5.25], mark: [10.5, 1.9, 6.4], go: '回座位'},
  whs: {name: '物料倉料架', at: [-12.75, -5.25], mark: [-12.5, 3.1, -7.4], go: '走去物料倉'},
  smtline: {name: 'SMA 線', at: [-3.25, -5.25], mark: [-4.3, 3.2, -7.2], go: '走去 SMA 線'},
  asmline: {name: '組裝線', at: [5.25, -5.25], mark: [3.8, 2.4, -6.6], go: '走去組裝線'},
  tester: {name: '測試櫃', at: [11, -5.75], mark: [11.8, 3.2, -8.2], go: '走去測試區'},
  fabench: {name: 'FA 桌', at: [12, -5.25], mark: [12, 1.9, -3.8], go: '走去 FA 桌'},
  shipdock: {name: '出貨區', at: [-11.25, 2.75], mark: [-13.5, 2.6, 5.6], go: '走去出貨區'},
  mtgroom: {name: '會議室', at: [0, 2.75], mark: [0, 1.9, 5], go: '走去會議室'}
};

/* 玩家可以點的詞，點了跳出白話解釋。[詞, 解釋]。同一個意思的幾種寫法用「 / 」隔開。 */
const GLOSS = [
  ['EPM', '工程專案經理。在代工廠裡替一個客戶專案顧物料、生產、測試、出貨，每天在客戶與工廠各部門之間來回。'],
  ['EMS', '電子製造服務，也就是幫品牌組裝產品的代工廠。'],
  ['F1', '這裡指客戶。客戶的人常駐在工廠，每天跟 EPM 開會、看報表。'],
  ['CTB', 'Clear To Build：要開的工單，料到底齊不齊。一張表列出每張工單缺哪幾顆料、什麼時候到。'],
  ['ECTB', '比較長期的 CTB，看接下來幾天、幾週的料夠不夠。'],
  ['ok2kit', '確認這張工單的料都齊了，可以發料到線上。發出去之前要再對一次。'],
  ['Special list', '需要特別盯的料或工單清單：改料、特採、指定批次之類的。'],
  ['改料', '原本的料不夠或有問題，換成另一顆可以用的料（例如第二家供應商）。要客戶同意。'],
  ['downselection', '這次先不做某些項目或 config，把資源留給比較重要的。'],
  ['IQC', '來料檢驗。供應商送來的料，先過 IQC 才能上線。'],
  ['復判', '被判退的料再判一次，看是不是真的不能用。'],
  ['特採', '料不完全合規格，但評估後先放行使用。要有人簽名負責。'],
  ['還料 / 還倉', '借出去或發到線上沒用完的料，退回倉庫。'],
  ['PD', '這裡指物控：管料的進出、發料與還料。'],
  ['KT 郵件', '每天早上收到的缺料通知郵件（遊戲裡的叫法）。'],
  ['Daily sync up / sync up / 早會', '每天早上的會：客戶、主管、各條線的 EPM 一起對進度。'],
  ['Daily wrap up / wrap up / 晚會', '每天傍晚的會：今天做到哪裡、明天的計畫、還有什麼卡著。'],
  ['工單', '一張生產指令：做什麼、做幾台、要用哪些料。'],
  ['Yield', '良率。一百台裡有幾台一次就測過。'],
  ['COFA', '每天自動發出去的測試良率報表（遊戲裡的叫法）。'],
  ['FA', 'Failure Analysis，不良分析：找出機台為什麼壞。'],
  ['NTF', 'No Trouble Found：重測就過了，找不到問題。很好用的理由，也很容易被濫用。'],
  ['周邊', '支援生產的各個部門，例如測試工程、品保、維修。'],
  ['retest', '測試沒過的機台再測一次。'],
  ['kit to line', '把一張工單需要的料備齊送到產線。'],
  ['對料清單', '線上每個工站該用哪顆料的清單，要跟實物一顆一顆對。'],
  ['SFC', '產線的系統：每台機台的序號在哪一站、綁了哪些零件，都記在這裡。'],
  ['Build status', '今天做了幾台、還差幾台、卡在哪裡的報告。'],
  ['line efficiency', '產線效率：實際產出跟標準產出的比例。'],
  ['UPH', '每小時的產出台數。'],
  ['HL', '把異常整理好、往上報（highlight）。'],
  ['FATP', '最後組裝、測試、包裝的整段製程。'],
  ['流線', '安排機台在產線上走的順序與數量。'],
  ['Nimbus', '客戶要機台的需求系統（遊戲裡的叫法）。Nimbus gap 是需求跟實際能給的落差。'],
  ['挑機', '從庫存裡挑出符合需求（config、序號）的機台。'],
  ['報關', '機台出口前要向海關申報：品名、數量、HS code。'],
  ['HS code', '海關用的商品分類編號。打錯一碼，貨就可能卡在海關。'],
  ['candidates', '明天可能出貨的機台名單。'],
  ['MLB', '主板（Main Logic Board）。'],
  ['SMA', '主板打件：把零件貼到電路板上（遊戲裡的叫法）。'],
  ['BM', '主板上需要另外處理的關鍵料（遊戲裡簡化的叫法）。BM stuffing 是把它裝上去。'],
  ['DOE', '實驗設計：刻意改一些條件做一批，看結果差多少。'],
  ['lockdown', '把明天的生產計畫定下來，不再改。'],
  ['config', '同一個產品的不同配置，例如容量、顏色。'],
  ['ETA', '預計到達的時間。']
];
termsSet(GLOSS, ' / ', [], []);
