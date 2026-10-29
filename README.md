# EPM24hr

EMS 工廠 EPM 打工人的一天。挑一個位子上班：Commodity、Assembly、Testing、Shipping、MLB。Testing 再分四種：FA DRI、Test rule、Offline／DOE、Rel tracker。
缺料、改料、Yield、開線異常、出貨，一件一件處理；下班回宿舍，群組還在響；運氣不好，還要回廠通宵。下班時拿一張結算卡。

用 [fab24hr engine](https://github.com/mcltyl/fab24hr-engine) 做的 3D 方塊風網頁遊戲。

## 直接玩（不用安裝任何東西）

打開 `public/index.html`（Mac 用 Safari 或 Chrome，Windows 用 Edge 或 Chrome 都可以）。
`public/` 裡的三個檔要放在一起。遊戲進度存在這個瀏覽器裡，沒有網路也能玩。

## 網址（GitHub Pages）

https://rw-code-tw.github.io/EPM24hr/

每次 push 到 `main`，`.github/workflows/pages.yml` 會把 `public/` 發佈到這個網址（repo 的 Actions 分頁看得到進度）。
第一次要先在 GitHub 上設定：repo 要是 public（或帳號有 GitHub Pro），再到 Settings → Pages → Source 選「GitHub Actions」。

## 改遊戲

需要 Node.js 18 以上（Mac：`brew install node`，或到 nodejs.org 下載）。

```sh
npm ci           # 第一次
npm run build    # 產生 public/index.html
npm run dev      # 開 http://localhost:8080，存檔就自動重建
npm test         # 自動從頭玩到結算（電腦選第一個選項、手機選最後一個）
```

改完一定跑 `npm run build` 和 `npm test`，再 commit（`public/` 也要一起 commit，另一台電腦才能直接玩）。

## 檔案

| 檔案 | 內容 |
| --- | --- |
| `game/data.js` | 主頁文字、人物、地方、名詞解釋 |
| `game/factory.js` | 3D 工廠（照實際樓層圖簡化）：客戶辦公區、休息區（茶水間、健身角）、FATP／MLB 會議室、EPM 與 OPM 辦公室、前台與對外大門、物料倉、SMA 線、組裝線、OTA／AP 線、幾間附房、廁所、出貨倉、FA 室；右邊隔開的是宿舍 |
| `game/story.js` | 選位子（Testing 再選四種之一）、三個數字（達成、客戶信任、體力）、開會座位、回宿舍（`atDorm`）、結算卡 |
| `game/role_cmd.js` … `role_mlb.js` | 五個位子各自的一天（`role_tst.js` 是 Testing 的 FA DRI；`role_shp.js` 裡有「通宵」特殊事件） |
| `game/role_tst_rule.js`、`role_tst_doe.js`、`role_tst_rel.js` | Testing 的 Test rule、Offline／DOE、Rel tracker 各自的一天 |

宿舍跟工廠之間走不過去：晚上的時刻用 `atDorm()` 把人放進宿舍；從宿舍回廠的時刻，`scene()` 要自己用 `W.put('me', …)` 把人放回廠裡。

怎麼寫劇情（時刻、事件、選項、小遊戲）見 `AGENTS.md`。

## 換電腦

```sh
git pull         # 開始前
git add -A && git commit -m "…" && git push   # 收工前
```

## 授權

框架與工具：fab24hr engine License（`LICENSE`），僅限非商業用途，主頁與結算畫面的出處那一行要保留。
框架原本的說明在 `README.engine.md`、`README.engine.zh-Hant.md`。
遊戲裡的人物、料號、數字與事件都是虛構的。
