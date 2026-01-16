import { Sparkles, AlertCircle, Loader2 } from "lucide-react";

interface InsightPanelProps {
  insight: string | null;
  isLoading: boolean;
  error: string | null;
}

const InsightPanel = ({ insight, isLoading, error }: InsightPanelProps) => {
  if (error) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-4 w-4 text-destructive" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-destructive">
              Analysis Error
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-destructive/80">
              {error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">
            Analyzing your query with AI...
          </p>
        </div>
      </div>
    );
  }

  if (!insight) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-muted/30 p-6">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Sparkles className="h-5 w-5" />
          <p className="text-sm">
            Enter a question above to receive AI-powered insights
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-lg border border-primary/20 bg-accent p-6"
      style={{ boxShadow: "var(--shadow-insight)" }}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
          <Sparkles className="h-4 w-4 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="text-base font-semibold text-foreground">
            AI Insight Explanation
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-foreground/80 whitespace-pre-wrap">
            {insight}
          </p>
        </div>
      </div>
    </div>
  );
};

export default InsightPanel;
