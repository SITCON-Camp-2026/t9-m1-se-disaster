import { useMemo } from "react";
import type { Dispatch, SetStateAction } from "react";
import { RecordCard } from "../../components/RecordCard";
import { SourceLabel } from "../../components/SourceLabel";
import { StatusBadge } from "../../components/StatusBadge";
import { Phase0JudgementCard } from "./Phase0JudgementCard";
import { createPhase0Judgement } from "./phase0-heuristics";
import type { Phase0Confidence, Phase0MessyRecord } from "./phase0-types";
import {
  createEmptyDraft,
  createInitialDrafts,
  kindOptions,
  severityOptions,
  type WorkbenchDraft,
} from "./phase0-drafts";

const confidenceOptions: Array<{ value: Phase0Confidence; label: string }> = [
  { value: "low", label: "低" },
  { value: "medium", label: "中" },
  { value: "high", label: "高" },
];

function getReviewReasons(record: Phase0MessyRecord): string[] {
  const reasons = new Set<string>();

  if (record.verificationStatus === "needs_review") {
    reasons.add("需要人工確認");
  }

  if (record.verificationStatus === "unverified") {
    reasons.add("尚未確認");
  }

  if (["social_post", "phone_call"].includes(record.sourceType)) {
    reasons.add("來源可能不是現場當事人");
  }

  if (/有人|轉述|代|家屬|留言|群組/.test(record.rawText)) {
    reasons.add("原文包含轉述或二手資訊");
  }

  if (/不知道|不確定|可能|疑似|尚未|沒有說|不明/.test(record.rawText)) {
    reasons.add("原文自己留下不確定處");
  }

  if (/地址只有|附近|那邊|A 區|第二排/.test(record.rawText)) {
    reasons.add("地點描述還不夠可行動");
  }

  if (/不要再派人|道路封閉|淹水|藥品|不同意|同意公開/.test(record.rawText)) {
    reasons.add("可能涉及安全、健康或同意問題");
  }

  return Array.from(reasons);
}

function getAiReliability(
  record: Phase0MessyRecord,
  draft: WorkbenchDraft | undefined,
  reviewReasons: string[],
): { confidence: Phase0Confidence; reasons: string[] } {
  if (!draft) {
    return {
      confidence: "low",
      reasons: ["尚未建立人工整理草稿，AI 不能判斷草稿內容是否可靠。"],
    };
  }

  const reasons = new Set<string>();
  let missingFieldCount = 0;
  let highRiskSignalCount = 0;
  const filledUncertainties = draft.uncertainties.filter(
    (uncertainty) => uncertainty.trim().length > 0,
  );

  if (record.verificationStatus !== "verified") {
    reasons.add("原始資訊仍不是已確認狀態。");
  }

  if (draft.informationType === "unknown") {
    missingFieldCount += 1;
    reasons.add("資訊類型仍待判斷。");
  }

  if (draft.caseLocation.trim().length === 0) {
    missingFieldCount += 1;
    reasons.add("案件地點尚未填寫或仍不清楚。");
  }

  if (filledUncertainties.length === 0) {
    missingFieldCount += 1;
    reasons.add("沒有列出不確定的事，可能漏掉人工確認點。");
  }

  if (draft.severity === "high") {
    reasons.add("人工標示嚴重程度為高，建議優先人工確認。");
  }

  if (draft.approximatePeopleOnly) {
    reasons.add("所需人力只有大致數字，不能當成精確派工依據。");
  }

  if (reviewReasons.length >= 3) {
    highRiskSignalCount += 1;
    reasons.add("原文同時包含多個需要人工確認的風險。");
  }

  if (/藥品|同意公開|道路封閉|淹水|不要再派人/.test(record.rawText)) {
    highRiskSignalCount += 1;
    reasons.add("原文可能涉及健康、安全或個資同意。");
  }

  if (missingFieldCount >= 3 && highRiskSignalCount >= 1) {
    return { confidence: "low", reasons: Array.from(reasons) };
  }

  if (
    draft.severity !== "high" &&
    draft.informationType !== "unknown" &&
    draft.caseLocation.trim().length > 0 &&
    filledUncertainties.length > 0 &&
    highRiskSignalCount === 0
  ) {
    return {
      confidence: "high",
      reasons: [
        "人工草稿已填入類型、地點與不確定事項，但仍只能作為待確認建議。",
      ],
    };
  }

  return {
    confidence: "medium",
    reasons:
      reasons.size > 0
        ? Array.from(reasons)
        : ["人工草稿欄位較完整，但仍需人工確認原始資訊。"],
  };
}

function confidenceLabel(confidence: Phase0Confidence) {
  return (
    confidenceOptions.find((option) => option.value === confidence)?.label ??
    confidence
  );
}

function countRecordsWithTaskBlockers(
  records: Phase0MessyRecord[],
  drafts: WorkbenchDraft[],
) {
  return records.filter((record) => {
    const hasDraftBlocker = drafts.some(
      (draft) => draft.recordId === record.id && draft.unsafeToActDirectly,
    );

    return hasDraftBlocker || getReviewReasons(record).length > 0;
  }).length;
}

export function Phase0Workbench({
  records,
  selectedRecordId,
  onSelect,
  drafts,
  setDrafts,
}: {
  records: Phase0MessyRecord[];
  selectedRecordId: string;
  onSelect: (recordId: string) => void;
  drafts: WorkbenchDraft[];
  setDrafts: Dispatch<SetStateAction<WorkbenchDraft[]>>;
}) {
  const selectedRecord =
    records.find((record) => record.id === selectedRecordId) ?? records[0];
  const safetyBoundary = createPhase0Judgement(selectedRecord);
  const selectedDraft = drafts.find(
    (draft) => draft.recordId === selectedRecord.id,
  );
  const reviewReasons = getReviewReasons(selectedRecord);
  const aiReliability = getAiReliability(
    selectedRecord,
    selectedDraft,
    reviewReasons,
  );
  const needsHumanReview = records.filter(
    (record) =>
      record.verificationStatus === "needs_review" ||
      record.verificationStatus === "unverified",
  );
  const taskBlockerCount = countRecordsWithTaskBlockers(records, drafts);
  const draftByRecordId = useMemo(
    () => new Set(drafts.map((draft) => draft.recordId)),
    [drafts],
  );

  function createDraftForSelectedRecord() {
    if (selectedDraft) {
      return;
    }

    setDrafts((currentDrafts) => [
      ...currentDrafts,
      createEmptyDraft(selectedRecord),
    ]);
  }

  function updateSelectedDraft(
    field: keyof WorkbenchDraft,
    value: string | boolean,
  ) {
    setDrafts((currentDrafts) =>
      currentDrafts.map((draft) =>
        draft.recordId === selectedRecord.id
          ? { ...draft, [field]: value }
          : draft,
      ),
    );
  }

  function updateSelectedUncertainty(index: number, value: string) {
    setDrafts((currentDrafts) =>
      currentDrafts.map((draft) =>
        draft.recordId === selectedRecord.id
          ? {
              ...draft,
              uncertainties: draft.uncertainties.map(
                (uncertainty, itemIndex) =>
                  itemIndex === index ? value : uncertainty,
              ),
            }
          : draft,
      ),
    );
  }

  function addSelectedUncertainty() {
    setDrafts((currentDrafts) =>
      currentDrafts.map((draft) =>
        draft.recordId === selectedRecord.id
          ? { ...draft, uncertainties: [...draft.uncertainties, ""] }
          : draft,
      ),
    );
  }

  function removeSelectedUncertainty(index: number) {
    setDrafts((currentDrafts) =>
      currentDrafts.map((draft) =>
        draft.recordId === selectedRecord.id
          ? {
              ...draft,
              uncertainties:
                draft.uncertainties.length > 1
                  ? draft.uncertainties.filter(
                      (_, itemIndex) => itemIndex !== index,
                    )
                  : [""],
            }
          : draft,
      ),
    );
  }

  function deleteSelectedDraft() {
    setDrafts((currentDrafts) =>
      currentDrafts.filter((draft) => draft.recordId !== selectedRecord.id),
    );
  }

  function resetDrafts() {
    setDrafts(createInitialDrafts(records));
  }

  return (
    <div className="workbench">
      <div className="workbench__intro">
        <p className="eyebrow">整理工作台</p>
        <h2>第一階段的成功不是分類正確，而是把為什麼現在還不能判斷說清楚。</h2>
        <p>
          這裡先只標示安全邊界，真正的候選判斷要由小組和 coding agent
          補上；這不是 runtime LLM 分析，也不是正式資料模型。
        </p>
      </div>

      <div className="workbench__layout">
        <aside className="workbench__queue" aria-label="選擇原始資訊">
          {records.map((record) => (
            <button
              className={record.id === selectedRecord.id ? "active" : ""}
              key={record.id}
              type="button"
              onClick={() => onSelect(record.id)}
            >
              <span>{record.id}</span>
              <StatusBadge status={record.verificationStatus} />
              {draftByRecordId.has(record.id) ? (
                <small>已有草稿</small>
              ) : (
                <small>尚未草稿</small>
              )}
            </button>
          ))}
        </aside>

        <div className="workbench__main">
          <RecordCard record={selectedRecord} />

          <Phase0JudgementCard
            judgement={safetyBoundary}
            record={selectedRecord}
          />

          <article className="draft-card">
            <div className="draft-card__header">
              <div>
                <p className="eyebrow">人工整理草稿</p>
                <h3>{selectedRecord.id} 的候選整理</h3>
              </div>
              {selectedDraft ? (
                <button type="button" onClick={deleteSelectedDraft}>
                  刪除草稿
                </button>
              ) : (
                <button type="button" onClick={createDraftForSelectedRecord}>
                  建立草稿
                </button>
              )}
            </div>

            <div className="risk-list" aria-label="需要再檢查的原因">
              {reviewReasons.map((reason) => (
                <span key={reason}>{reason}</span>
              ))}
            </div>

            {selectedDraft ? (
              <form className="draft-form">
                <label>
                  資訊類型
                  <select
                    value={selectedDraft.informationType}
                    onChange={(event) =>
                      updateSelectedDraft("informationType", event.target.value)
                    }
                  >
                    {kindOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  所需物資
                  <input
                    value={selectedDraft.neededSupplies}
                    onChange={(event) =>
                      updateSelectedDraft("neededSupplies", event.target.value)
                    }
                    placeholder="只填原文有提到的物資；沒有就留空。"
                  />
                </label>

                <label>
                  案件地點
                  <input
                    value={selectedDraft.caseLocation}
                    onChange={(event) =>
                      updateSelectedDraft("caseLocation", event.target.value)
                    }
                    placeholder="只填原文出現的地點描述，不補真實地址。"
                  />
                </label>

                <div className="readonly-field">
                  <span>資料來源</span>
                  <SourceLabel sourceType={selectedRecord.sourceType} />
                </div>

                <fieldset className="uncertainty-list">
                  <legend>不確定的事</legend>
                  {selectedDraft.uncertainties.map((uncertainty, index) => (
                    <div className="uncertainty-item" key={index}>
                      <input
                        aria-label={`不確定的事 ${index + 1}`}
                        value={uncertainty}
                        onChange={(event) =>
                          updateSelectedUncertainty(index, event.target.value)
                        }
                        placeholder="例如：地點不完整、時間可能過期、來源是轉述。"
                      />
                      <button
                        type="button"
                        onClick={() => removeSelectedUncertainty(index)}
                      >
                        刪除
                      </button>
                    </div>
                  ))}
                  <button type="button" onClick={addSelectedUncertainty}>
                    新增不確定事項
                  </button>
                </fieldset>

                <div className="people-fields">
                  <label>
                    所需人力
                    <input
                      min="0"
                      type="number"
                      value={selectedDraft.neededPeople}
                      onChange={(event) =>
                        updateSelectedDraft("neededPeople", event.target.value)
                      }
                      placeholder="只能輸入數字"
                    />
                  </label>
                  <label className="checkbox-field">
                    <input
                      checked={selectedDraft.approximatePeopleOnly}
                      type="checkbox"
                      onChange={(event) =>
                        updateSelectedDraft(
                          "approximatePeopleOnly",
                          event.target.checked,
                        )
                      }
                    />
                    只知道大致人數
                  </label>
                </div>

                <label>
                  嚴重程度
                  <select
                    value={selectedDraft.severity}
                    onChange={(event) =>
                      updateSelectedDraft("severity", event.target.value)
                    }
                  >
                    {severityOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

                <section
                  className="ai-reliability"
                  aria-label="AI 可信賴度建議"
                >
                  <div>
                    <span>AI 可信賴度</span>
                    <strong>{confidenceLabel(aiReliability.confidence)}</strong>
                  </div>
                  <ul>
                    {aiReliability.reasons.map((reason) => (
                      <li key={reason}>{reason}</li>
                    ))}
                  </ul>
                </section>

                <label className="checkbox-field">
                  <input
                    checked={selectedDraft.unsafeToActDirectly}
                    type="checkbox"
                    onChange={(event) =>
                      updateSelectedDraft(
                        "unsafeToActDirectly",
                        event.target.checked,
                      )
                    }
                  />
                  仍標示為不能直接變成志工任務
                </label>
              </form>
            ) : (
              <p className="draft-card__empty">
                這筆還沒有整理草稿。建立草稿後，請只填原文可支持的內容，並把推測留在待確認欄位。
              </p>
            )}
          </article>
        </div>

        <aside className="workbench__checklist">
          <h3>第一階段完成檢查</h3>
          <ul>
            <li>Starter 已載入 {records.length} 筆原始資訊</li>
            <li>已產生 {drafts.length} 筆可編輯整理草稿</li>
            <li>{needsHumanReview.length} 筆仍標示為需要人工確認或尚未確認</li>
            <li>{taskBlockerCount} 筆被保守標示為不能直接變成任務</li>
            <li>
              把資料品質問題寫進 observations，並記錄 agent 哪裡不能直接相信
            </li>
          </ul>
          <button type="button" onClick={resetDrafts}>
            重設整理草稿
          </button>
        </aside>
      </div>
    </div>
  );
}
