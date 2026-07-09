import { SourceLabel } from "../../components/SourceLabel";
import { StatusBadge } from "../../components/StatusBadge";
import type { Phase0MessyRecord } from "./phase0-types";
import {
  getInformationTypeLabel,
  severityLabel,
  severityRank,
  type WorkbenchDraft,
} from "./phase0-drafts";

export function Phase0ArrangedDataPanel({
  records,
  drafts,
}: {
  records: Phase0MessyRecord[];
  drafts: WorkbenchDraft[];
}) {
  const arrangedDrafts = drafts
    .map((draft) => ({
      draft,
      record: records.find((record) => record.id === draft.recordId),
    }))
    .filter(
      (item): item is { draft: WorkbenchDraft; record: Phase0MessyRecord } =>
        item.record !== undefined,
    )
    .sort(
      (first, second) =>
        severityRank(second.draft.severity) -
        severityRank(first.draft.severity),
    );

  return (
    <div className="arranged-data">
      <div className="panel__header">
        <div>
          <h2>已整理資料</h2>
          <p>
            這裡顯示人工整理草稿，仍不是已確認資料，也不能直接當成志工任務。
          </p>
        </div>
        <p>{arrangedDrafts.length} 筆草稿</p>
      </div>

      <div className="arranged-data__grid">
        {arrangedDrafts.map(({ draft, record }) => {
          const filledUncertainties = draft.uncertainties.filter(
            (uncertainty) => uncertainty.trim().length > 0,
          );

          return (
            <article className="arranged-card" key={draft.recordId}>
              <div className="arranged-card__header">
                <div>
                  <p className="eyebrow">{record.id}</p>
                  <h3>{getInformationTypeLabel(draft.informationType)}</h3>
                </div>
                <span className={`severity-badge severity-${draft.severity}`}>
                  嚴重程度：{severityLabel(draft.severity)}
                </span>
              </div>

              <dl className="arranged-card__details">
                <div>
                  <dt>所需物資</dt>
                  <dd>{draft.neededSupplies.trim() || "未填寫"}</dd>
                </div>
                <div>
                  <dt>案件地點</dt>
                  <dd>{draft.caseLocation.trim() || "未填寫"}</dd>
                </div>
                <div>
                  <dt>所需人力</dt>
                  <dd>
                    {draft.neededPeople.trim()
                      ? `${draft.approximatePeopleOnly ? "約 " : ""}${draft.neededPeople} 人`
                      : "未填寫"}
                  </dd>
                </div>
              </dl>

              <div className="arranged-card__meta">
                <SourceLabel sourceType={record.sourceType} />
                <StatusBadge status={record.verificationStatus} />
                {draft.unsafeToActDirectly ? (
                  <span className="warning-label">不能直接變成任務</span>
                ) : null}
              </div>

              <section>
                <h4>不確定的事</h4>
                {filledUncertainties.length > 0 ? (
                  <ul>
                    {filledUncertainties.map((uncertainty, index) => (
                      <li key={`${draft.recordId}-${index}`}>{uncertainty}</li>
                    ))}
                  </ul>
                ) : (
                  <p>尚未填寫不確定事項。</p>
                )}
              </section>
            </article>
          );
        })}
      </div>
    </div>
  );
}
