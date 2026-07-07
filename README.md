# 災害資訊積木 Starter

SITCON Camp 2026 軟體工程工作坊 starter repo。

這是一個前端-only 的學習原型專案，用於練習：

- SDD-lite
- schema / data contract
- mock data
- event injection
- adapter
- handoff
- AI-assisted development

第一階段學員起始入口：

1. [`docs/student-context.md`](docs/student-context.md)
2. [`docs/brief.md`](docs/brief.md)
3. [`docs/output-paths.md`](docs/output-paths.md)
4. [`docs/tasks/00-how-to-use-task-cards.md`](docs/tasks/00-how-to-use-task-cards.md)
5. [`docs/tasks/01-phase-0-messy-sprint.md`](docs/tasks/01-phase-0-messy-sprint.md)

完整課程脈絡請講師、助教、repo 維護者或後續階段再讀：[`docs/course-context.md`](docs/course-context.md)。

## 快速開始

```bash
pnpm install
pnpm dev
```

## 常用指令

```bash
pnpm validate:data
pnpm test
pnpm build
pnpm check
```

## GitHub Pages 展示規則

本 repo 會被 build 成 GitHub Pages 網頁。學員的前端成果必須能從部署後的首頁看到或操作。

主要入口：

```text
src/main.tsx
src/app/App.tsx
```

請把可展示成果接進 `src/app/App.tsx`，或由 `App.tsx` 匯入的 component。只新增 `docs/`、`tests/`、`events/` 或未被匯入的 component，不算完成前端 demo。

詳細規則請看 [`docs/output-paths.md`](docs/output-paths.md)。

## 今日任務導航

上課時請依照目前階段閱讀對應任務卡。任務卡會明確寫出來源、要做什麼、不做什麼、成果放置位置、可用 prompt、交付成果與停止條件。

| 階段                     | 任務卡                                                                             |
| ------------------------ | ---------------------------------------------------------------------------------- |
| 任務卡使用方式           | [`docs/tasks/00-how-to-use-task-cards.md`](docs/tasks/00-how-to-use-task-cards.md) |
| 第一階段 AI 快速原型衝刺 | [`docs/tasks/01-phase-0-messy-sprint.md`](docs/tasks/01-phase-0-messy-sprint.md)   |
| 第一階段復盤             | [`docs/tasks/02-phase-0-debrief.md`](docs/tasks/02-phase-0-debrief.md)             |
| SDD-lite Spec            | [`docs/tasks/03-sdd-lite-spec.md`](docs/tasks/03-sdd-lite-spec.md)                 |
| Spec 市集                | [`docs/tasks/04-spec-market.md`](docs/tasks/04-spec-market.md)                     |
| Scope Lock               | [`docs/tasks/05-scope-lock.md`](docs/tasks/05-scope-lock.md)                       |
| Build Sprint 1           | [`docs/tasks/06-build-sprint-1.md`](docs/tasks/06-build-sprint-1.md)               |
| Event Injection          | [`docs/tasks/07-event-injection.md`](docs/tasks/07-event-injection.md)             |
| Build Sprint 2           | [`docs/tasks/08-build-sprint-2.md`](docs/tasks/08-build-sprint-2.md)               |
| Handoff Prep             | [`docs/tasks/09-handoff-prep.md`](docs/tasks/09-handoff-prep.md)                   |
| Handoff Challenge        | [`docs/tasks/10-handoff-challenge.md`](docs/tasks/10-handoff-challenge.md)         |
| 成果交流                 | [`docs/tasks/11-showcase.md`](docs/tasks/11-showcase.md)                           |

可複製的 Coding Agent prompts 放在 [`docs/prompts/`](docs/prompts/)。

## 課程限制

- 不做後端服務
- 不使用真實個資
- 不呼叫真實 LLM runtime API
- `events/**` 是外部 dirty data
- `src/fixtures/**` 是 normalized internal data，必須通過 validation
- starter repo 不放 team-specific brief、hidden event data、mentor guide 或 expected answer

## 資料資料夾語意

```text
src/fixtures/phase-0/     # 初始混亂資料，Phase 0 使用
src/fixtures/shared/      # starter 內建 normalized data，必須通過 validation
src/fixtures/released/    # staff 課中釋出後可放入的 normalized data
src/fixtures/workspace/   # 小組自行轉換後的 normalized data
events/                   # 課中 event injection 的外部 dirty input
```

## 授權

- 程式碼：MIT
- 教案與文件：CC BY-SA
- mock data：CC0
