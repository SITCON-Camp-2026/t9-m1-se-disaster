import type {
  Phase0Confidence,
  Phase0MessyRecord,
  Phase0PossibleKind,
} from "./phase0-types";

export type WorkbenchDraft = {
  recordId: string;
  informationType: Phase0PossibleKind;
  neededSupplies: string;
  caseLocation: string;
  uncertainties: string[];
  neededPeople: string;
  approximatePeopleOnly: boolean;
  severity: Phase0Confidence;
  unsafeToActDirectly: boolean;
};

export const kindOptions: Array<{ value: Phase0PossibleKind; label: string }> =
  [
    { value: "unknown", label: "資訊類型待判斷" },
    { value: "help_request_candidate", label: "求助資訊" },
    { value: "resource_candidate", label: "物資或資源資訊" },
    { value: "site_status_candidate", label: "地點狀態資訊" },
    { value: "task_candidate", label: "可能的任務資訊" },
    { value: "assignment_candidate", label: "人力或指派資訊" },
    { value: "safety_or_road_candidate", label: "安全或道路資訊" },
    { value: "wellbeing_check_candidate", label: "安否或狀況確認資訊" },
    { value: "announcement_candidate", label: "公告或轉傳公告資訊" },
  ];

export const severityOptions: Array<{
  value: Phase0Confidence;
  label: string;
}> = [
  { value: "high", label: "高" },
  { value: "medium", label: "中" },
  { value: "low", label: "低" },
];

export function getInformationTypeLabel(kind: Phase0PossibleKind) {
  return kindOptions.find((option) => option.value === kind)?.label ?? kind;
}

export function severityLabel(severity: Phase0Confidence) {
  return (
    severityOptions.find((option) => option.value === severity)?.label ??
    severity
  );
}

export function severityRank(severity: Phase0Confidence) {
  const ranks: Record<Phase0Confidence, number> = {
    high: 3,
    medium: 2,
    low: 1,
  };

  return ranks[severity];
}

export function createEmptyDraft(record: Phase0MessyRecord): WorkbenchDraft {
  return {
    recordId: record.id,
    informationType: "unknown",
    neededSupplies: "",
    caseLocation: "",
    uncertainties: [""],
    neededPeople: "",
    approximatePeopleOnly: false,
    severity: "high",
    unsafeToActDirectly: true,
  };
}

export function createInitialDrafts(
  records: Phase0MessyRecord[],
): WorkbenchDraft[] {
  return records.slice(0, 6).map(createEmptyDraft);
}
