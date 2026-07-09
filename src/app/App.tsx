import { useState } from "react";
import messyReports from "../fixtures/phase-0/messy-reports.json";
import { EmptyState } from "../components/EmptyState";
import { Phase0ArrangedDataPanel } from "../features/phase-0/Phase0ArrangedDataPanel";
import { createInitialDrafts } from "../features/phase-0/phase0-drafts";
import { Phase0RawInfoPanel } from "../features/phase-0/Phase0RawInfoPanel";
import { Phase0Workbench } from "../features/phase-0/Phase0Workbench";
import type { Phase0MessyRecord } from "../features/phase-0/phase0-types";

type TabKey = "raw" | "workbench" | "arranged";

const tabs: Array<{ key: TabKey; label: string }> = [
  { key: "raw", label: "原始資訊" },
  { key: "workbench", label: "整理工作台" },
  { key: "arranged", label: "已整理資料" },
];

const phase0Records = messyReports satisfies Phase0MessyRecord[];

export function App() {
  const [activeTab, setActiveTab] = useState<TabKey>("raw");
  const [selectedRecordId, setSelectedRecordId] = useState(
    phase0Records[0]?.id ?? "",
  );
  const [drafts, setDrafts] = useState(() =>
    createInitialDrafts(phase0Records),
  );

  function selectForWorkbench(recordId: string) {
    setSelectedRecordId(recordId);
    setActiveTab("workbench");
  }

  return (
    <main className="layout">
      <header className="hero">
        <p className="eyebrow">SITCON Camp 2026</p>
        <h1>災害資訊整理工作台</h1>
        <p>
          第一階段先用 coding agent
          做出可展示的前端原型，再從成果中看見資料品質、角色、狀態與來源的限制。
        </p>
      </header>

      <nav className="tabs" aria-label="第一階段工作區">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={activeTab === tab.key ? "active" : ""}
            type="button"
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <section className="panel">
        {phase0Records.length === 0 ? (
          <EmptyState message="目前沒有資料" />
        ) : activeTab === "raw" ? (
          <Phase0RawInfoPanel
            records={phase0Records}
            selectedRecordId={selectedRecordId}
            onSelect={selectForWorkbench}
          />
        ) : activeTab === "workbench" ? (
          <Phase0Workbench
            records={phase0Records}
            selectedRecordId={selectedRecordId}
            onSelect={setSelectedRecordId}
            drafts={drafts}
            setDrafts={setDrafts}
          />
        ) : (
          <Phase0ArrangedDataPanel records={phase0Records} drafts={drafts} />
        )}
      </section>
    </main>
  );
}
