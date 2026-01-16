import { Sparkles, FileText } from "lucide-react";
import ConfidenceBadge from "./ConfidenceBadge";

interface InsightSummaryProps {
  summary: string;
  rows: number;
  confidence: number;
}

/**
 * Displays the AI insight summary with confidence badge
 */
const InsightSummary = ({ summary, rows, confidence }: InsightSummaryProps) => {
  return (
    <div
      className="rounded-lg border border-primary/20 bg-accent p-6"
      style={{ boxShadow: "var(--shadow-insight)" }}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
          <Sparkles className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1">
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <h3 className="text-base font-semibold text-foreground">
              AI Insight Summary
            </h3>
            <ConfidenceBadge confidence={confidence} />
          </div>

          <p className="text-sm leading-relaxed text-foreground/80 whitespace-pre-wrap">
            {summary}
          </p>

          <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <FileText className="h-3.5 w-3.5" />
            <span>
              {rows} {rows === 1 ? "row" : "rows"} analyzed
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsightSummary;
