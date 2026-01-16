import { AlertTriangle, Lightbulb } from "lucide-react";
import ConfidenceBadge from "./ConfidenceBadge";

interface RejectedQueryPanelProps {
  reason: string;
  suggestion: string;
  confidence: number;
}

/**
 * Displays a friendly message when a query is rejected
 * No red error screens - uses muted, informative styling
 */
const RejectedQueryPanel = ({
  reason,
  suggestion,
  confidence,
}: RejectedQueryPanelProps) => {
  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
          <AlertTriangle className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="flex-1">
          <div className="mb-3 flex items-center gap-3">
            <h3 className="text-base font-semibold text-foreground">
              Query Could Not Be Processed
            </h3>
            <ConfidenceBadge confidence={confidence} />
          </div>

          <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
            {reason}
          </p>

          <div className="rounded-md border border-primary/20 bg-primary/5 p-4">
            <div className="flex items-start gap-2">
              <Lightbulb className="mt-0.5 h-4 w-4 text-primary" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  Suggestion
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {suggestion}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RejectedQueryPanel;
