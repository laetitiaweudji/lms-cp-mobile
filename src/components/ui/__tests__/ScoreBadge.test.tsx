import { render, screen } from "@testing-library/react-native";
import { ScoreBadge } from "../ScoreBadge";

describe("ScoreBadge", () => {
  it("renders the score/max/percent label", async () => {
    await render(<ScoreBadge score={8} maxScore={10} />);
    expect(screen.getByText("8/10 (80%)")).toBeTruthy();
  });

  it("rounds the percentage", async () => {
    await render(<ScoreBadge score={1} maxScore={3} />);
    expect(screen.getByText("1/3 (33%)")).toBeTruthy();
  });

  it("treats exactly 70% as passing (green)", async () => {
    await render(<ScoreBadge score={7} maxScore={10} />);
    const label = screen.getByText("7/10 (70%)");
    expect(label.props.style.color).toBe("#10b981");
  });

  it("treats 69% as failing (red)", async () => {
    await render(<ScoreBadge score={69} maxScore={100} />);
    const label = screen.getByText("69/100 (69%)");
    expect(label.props.style.color).toBe("#ef4444");
  });

  it("treats a zero max score as 0% without dividing by zero", async () => {
    await render(<ScoreBadge score={0} maxScore={0} />);
    expect(screen.getByText("0/0 (0%)")).toBeTruthy();
  });
});
