# 第一階段：AI 快速原型衝刺

用 coding agent 做出一個會暴露資料品質問題的整理工作台。

## 時間

09:20-10:10

## 你現在拿到的來源

- `docs/student-context.md`
- `docs/brief.md`
- `docs/output-paths.md`
- `src/fixtures/phase-0/messy-reports.json`
- 起始畫面

## 你要做什麼

請在 50 分鐘內，使用 coding agent 協助你們做出一個最小可展示的「災害資訊整理工作台」。

這個工具要嘗試協助後續協作者回答：

1. 這筆原始資訊可能是什麼？
2. 它目前能不能直接被使用？
3. 它為什麼不能直接變成任務？
4. 它需要誰進一步確認？
5. 下一步應該是什麼？

第一階段的成功不是分類正確，而是做出一個會暴露資料品質問題的原型。

你們應該會發現：

- 有些資料很容易整理。
- 有些資料看起來像任務，但不能直接派人。
- 有些資訊需要人工確認。
- 有些 agent 建議看似合理，但其實補了原文沒有的內容。
- 有些資訊的操作者不是當事人。

## 前 10 分鐘

1. 開起始畫面；若還沒開，在 repo 裡跑 `pnpm install`、`pnpm dev`，再打開 localhost URL。
2. 看 `src/app/App.tsx`，確認畫面從哪裡 render。
3. 看 `messy-reports.json`，找原文、來源、查核狀態、更新時間等欄位。
4. 先請 coding agent 分析資料，不要一開始就改 code。
5. 決定工作台最小版面，讓原始資訊、候選判斷和不能判斷的原因能同時被看見。

不要爬社群、查地圖、補真實地址或從外部網站補資料。

## 成果放哪裡

- 畫面：`src/app/App.tsx`、`src/components/`，或 `src/features/phase-0/`
- 資料：只讀 `src/fixtures/phase-0/messy-reports.json`
- 文件：`docs/phase0-observations.md`、`docs/ai-log.md`

第一階段可以直接顯示未整理資料，但畫面要標示「這還不是整理後資料」。

## 不做什麼

- 不做後端、資料庫、localStorage、外部 API 或地圖
- 不使用 runtime LLM
- 不做真實救災判斷
- 不修改 `CommonRecord`
- 不把未整理資料移進 `src/fixtures/shared/` 假裝乾淨
- 不把 `needs_review` 或 `unverified` 顯示成 verified / confirmed
- 不補真實地圖、真實地址、真實電話或真實人物資料

## 必須交付

- [ ] 首頁能看到第一階段原始資訊列表
- [ ] 整理工作台有實際互動或整理結果
- [ ] 至少 6 筆原始資訊被嘗試整理
- [ ] 至少 1 筆看起來品質較高的資訊被整理成候選結果
- [ ] 至少 1 筆操作者不是當事人的資訊被標示為需要人工確認
- [ ] 至少 3 筆資訊被標示為不能直接變成任務
- [ ] 至少 2 個 agent 判斷被人類質疑或修正
- [ ] `docs/phase0-observations.md` 寫下至少 3 個資料品質問題
- [ ] `docs/ai-log.md` 記錄 agent 做了什麼、哪裡不能直接相信
- [ ] demo 能從首頁看到

## 停止條件

10:00 後停止新增主要功能，補 observation、確認 demo 入口，準備 10:10 復盤。
