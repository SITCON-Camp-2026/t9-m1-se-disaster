# 第一階段 Prompts

## Prompt 1：先分析，不改 code

```text
請先閱讀 docs/student-context.md、docs/output-paths.md、docs/brief.md，以及 src/fixtures/phase-0/messy-reports.json。

目前是第一階段 AI 快速原型衝刺。請先不要修改程式碼，不要設計完整災害系統，不要修改 CommonRecord，也不要把未整理資料移到 shared fixtures。

請分析 src/fixtures/phase-0/messy-reports.json：
1. 每筆原始資訊可能是什麼候選類型？
2. 哪些資料品質較高？原因是什麼？
3. 哪些資料品質不足？缺了什麼？
4. 哪些資訊不能直接變成任務？
5. 哪些地方需要人工確認？
6. 哪些內容是你可能想補完、但原文其實沒有說的？

請先只輸出分析與建議，不要修改檔案。
```

## Prompt 2：實作最小工作台

```text
請根據剛才的分析，幫我們實作一個最小可展示的第一階段災害資訊整理工作台。

請先閱讀 docs/output-paths.md。可展示成果必須能從 GitHub Pages 首頁看到或操作。

限制：
- 只處理 src/fixtures/phase-0/messy-reports.json
- 不新增後端
- 不使用 localStorage
- 不呼叫外部 API
- 不使用 runtime LLM
- 不修改 CommonRecord
- 不把未整理資料放進 src/fixtures/shared
- 不把 needs_review / unverified 顯示成 verified / confirmed

目標：
1. 顯示所有原始資訊列表
2. 每筆顯示 rawText、sourceType、verificationStatus、updatedAt
3. 顯示候選類型、信心程度、判斷依據
4. 顯示 blockers：為什麼不能直接使用
5. 顯示 suggested next step
6. 明顯標示 needs_review / unverified
7. 至少讓 6 筆資料有整理結果
8. 成果必須接進 src/app/App.tsx 或它匯入的 component

請先提出：
- 要修改哪些檔案
- UI 如何從 src/app/App.tsx 進入
- 會新增或更新什麼測試
- 哪些成果只屬於文件或觀察

等我們確認後再實作。
```

## Prompt 3：請 agent 自我審查

```text
請根據目前的第一階段整理工作台做自我審查。

請檢查：
1. 哪些整理結果可能是你根據常識補出來的，而不是原文有寫？
2. 哪些資料不能直接變成任務？
3. 哪些資料需要人工確認？
4. UI 哪些地方可能讓使用者誤會資料已經確認？
5. 如果真的用在災害現場，最危險的誤導是什麼？

請把結果整理到 docs/phase0-observations.md，並更新 docs/ai-log.md。不要把觀察寫成已確認事實。
```
