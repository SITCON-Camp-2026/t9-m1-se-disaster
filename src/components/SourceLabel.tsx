const labels: Record<string, string> = {
  field_report: "現場回報",
  phone_call: "電話轉述",
  social_post: "社群貼文",
  official_notice: "公告截圖或公告來源待確認",
  volunteer_update: "志工現場更新",
  mock: "模擬資料",
};

export function SourceLabel({ sourceType }: { sourceType: string }) {
  return (
    <span className="source-label">
      來源：{labels[sourceType] ?? sourceType}
    </span>
  );
}
