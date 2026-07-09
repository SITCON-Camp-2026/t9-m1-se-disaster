import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { App } from "../src/app/App";

describe("App", () => {
  it("renders starter title", () => {
    render(<App />);
    expect(screen.getByText("災害資訊整理工作台")).toBeInTheDocument();
  });

  it("keeps the home page focused on phase 0 tabs", () => {
    render(<App />);

    expect(
      screen.getByRole("button", { name: "原始資訊" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "整理工作台" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "已整理資料" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "通報" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "地點" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "志工任務" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "人員指派" }),
    ).not.toBeInTheDocument();
  });

  it("shows review states in the phase 0 workbench", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "整理工作台" }));

    expect(
      screen.getByText(
        "第一階段的成功不是分類正確，而是把為什麼現在還不能判斷說清楚。",
      ),
    ).toBeInTheDocument();
    expect(screen.getAllByText("待人工確認").length).toBeGreaterThan(0);
    expect(screen.getAllByText("未查核").length).toBeGreaterThan(0);
  });

  it("supports minimal editable phase 0 drafts", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "整理工作台" }));

    expect(screen.getByText("M-001 的候選整理")).toBeInTheDocument();
    expect(screen.getByText(/已產生 6 筆可編輯整理草稿/)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("案件地點"), {
      target: { value: "老雜貨店後面" },
    });

    expect(screen.getByDisplayValue("老雜貨店後面")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("所需人力"), {
      target: { value: "10" },
    });
    fireEvent.click(screen.getByLabelText("只知道大致人數"));

    expect(screen.getByDisplayValue("10")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("嚴重程度"), {
      target: { value: "high" },
    });

    expect(screen.getByText("AI 可信賴度")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "刪除草稿" }));
    expect(
      screen.getByRole("button", { name: "建立草稿" }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "重設整理草稿" }));
    expect(
      screen.getByRole("button", { name: "刪除草稿" }),
    ).toBeInTheDocument();
  });

  it("shows arranged draft data with high severity by default", () => {
    const { container } = render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "整理工作台" }));
    fireEvent.change(screen.getByLabelText("嚴重程度"), {
      target: { value: "low" },
    });

    fireEvent.click(screen.getByRole("button", { name: /M-002/ }));
    fireEvent.change(screen.getByLabelText("嚴重程度"), {
      target: { value: "medium" },
    });

    fireEvent.click(screen.getByRole("button", { name: "已整理資料" }));

    expect(
      screen.getByRole("heading", { name: "已整理資料" }),
    ).toBeInTheDocument();
    expect(screen.getByText("6 筆草稿")).toBeInTheDocument();
    expect(screen.getAllByText("嚴重程度：高").length).toBeGreaterThan(0);
    expect(screen.getAllByText("不能直接變成任務").length).toBeGreaterThan(0);

    const severityLabels = Array.from(
      container.querySelectorAll(".severity-badge"),
    ).map((item) => item.textContent);

    expect(severityLabels).toEqual([
      "嚴重程度：高",
      "嚴重程度：高",
      "嚴重程度：高",
      "嚴重程度：高",
      "嚴重程度：中",
      "嚴重程度：低",
    ]);
  });
});
