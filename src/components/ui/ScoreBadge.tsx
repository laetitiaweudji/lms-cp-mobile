import { Badge } from "./Badge";
import { colors } from "@/theme/tokens";

type ScoreBadgeProps = {
  score: number;
  maxScore: number;
};

export function ScoreBadge({ score, maxScore }: ScoreBadgeProps) {
  const pct = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
  const isPassing = pct >= 70;

  return (
    <Badge
      label={`${score}/${maxScore} (${pct}%)`}
      bgColor={isPassing ? colors.semantic.successLight : colors.semantic.dangerLight}
      textColor={isPassing ? colors.semantic.success : colors.semantic.danger}
    />
  );
}
