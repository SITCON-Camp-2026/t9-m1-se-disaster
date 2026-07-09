import { StatusBadge } from "../../components/StatusBadge";
import type { Phase0JudgementDraft, Phase0MessyRecord } from "./phase0-types";

const kindLabels: Record<Phase0JudgementDraft["possibleKind"], string> = {
  help_request_candidate: "求助資訊",
  resource_candidate: "物資或資源資訊",
  site_status_candidate: "地點狀態資訊",
  task_candidate: "可能的任務資訊",
  assignment_candidate: "人力或指派資訊",
  safety_or_road_candidate: "安全或道路資訊",
  wellbeing_check_candidate: "安否或狀況確認資訊",
  announcement_candidate: "公告或轉傳公告資訊",
  unknown: "資訊類型待判斷",
};

const confidenceLabels: Record<Phase0JudgementDraft["confidence"], string> = {
  low: "低",
  medium: "中",
  high: "高",
};

const nextStepLabels: Record<
  Phase0JudgementDraft["suggestedNextStep"],
  string
> = {
  keep_raw: "先保留原始資訊",
  ask_for_more_info: "補問來源或現場資訊",
  send_to_human_review: "交給人工確認",
  create_candidate_report: "建立候選通報",
  create_site_update_suggestion: "建立地點更新建議",
  do_not_use_yet: "暫時不要使用",
};

export function Phase0JudgementCard({
  judgement,
  record,
}: {
  judgement: Phase0JudgementDraft;
  record: Phase0MessyRecord;
}) {
  return (
    <article className="judgement-card">
      <div className="judgement-card__header">
        <div>
          <p className="eyebrow">Starter 安全預設</p>
          <h3>尚未建立整理草稿</h3>
        </div>
        <StatusBadge status={record.verificationStatus} />
      </div>

      <p>
        這張卡只保留保守的安全邊界，不是 agent
        對這筆資料的整理答案；下方草稿仍需人工確認。
      </p>

      <dl className="judgement-summary">
        <div>
          <dt>資訊類型</dt>
          <dd>{kindLabels[judgement.possibleKind]}</dd>
        </div>
        <div>
          <dt>信心程度</dt>
          <dd>{confidenceLabels[judgement.confidence]}</dd>
        </div>
        <div>
          <dt>下一步</dt>
          <dd>{nextStepLabels[judgement.suggestedNextStep]}</dd>
        </div>
      </dl>

      <p>
        能否直接行動：
        <strong>
          {judgement.unsafeToActDirectly ? "不可直接行動" : "仍需確認情境"}
        </strong>
      </p>

      <section>
        <h4>目前只有安全預設</h4>
        <ul>
          {judgement.evidence.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section>
        <h4>目前卡住的地方</h4>
        <ul>
          {judgement.blockers.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </article>
  );
}
