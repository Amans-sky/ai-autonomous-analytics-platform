import { useEffect, useState } from "react";
import { Bookmark, Clock, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchSavedInsights } from "@/lib/api";

interface SavedInsight {
  id: number;
  query: string;
  view: string;
  insight: string;
  confidence: number;
  created_at: string;
}

const SavedInsightsPanel = () => {
  const [savedInsights, setSavedInsights] = useState<SavedInsight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSavedInsights()
      .then((res) => {
        if (res.status === "success") {
          setSavedInsights(res.data);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Bookmark className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-semibold text-foreground">
          Saved Insights
        </h2>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">
          Loading saved insights...
        </p>
      ) : savedInsights.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-muted/30 p-8 text-center">
          <Bookmark className="mx-auto mb-3 h-10 w-10 text-muted-foreground/50" />
          <h3 className="text-sm font-medium text-foreground">
            No saved insights
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Run analyses to automatically persist insights
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {savedInsights.map((insight) => (
            <div
              key={insight.id}
              className="group rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/30"
            >
              <div className="mb-2 flex items-start justify-between">
                <h3 className="text-sm font-medium text-foreground">
                  {insight.query}
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
                  disabled
                >
                  <Trash2 className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>

              <p className="mb-2 text-sm text-muted-foreground line-clamp-2">
                {insight.insight}
              </p>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {new Date(insight.created_at).toLocaleString()}
                </div>
                <span>Confidence: {insight.confidence}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedInsightsPanel;
