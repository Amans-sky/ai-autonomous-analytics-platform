import { Bookmark, Clock, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Saved Insights panel (UI only - placeholder for future functionality)
 */
const SavedInsightsPanel = () => {
  // Placeholder saved insights for UI demonstration
  const savedInsights = [
    {
      id: 1,
      query: "Why did revenue drop in March?",
      timestamp: "2 hours ago",
      summary: "Revenue decline attributed to seasonal patterns...",
    },
    {
      id: 2,
      query: "Top performing regions Q1",
      timestamp: "Yesterday",
      summary: "North region led with 34% market share...",
    },
    {
      id: 3,
      query: "Product category breakdown",
      timestamp: "3 days ago",
      summary: "Electronics dominated with 45% of total sales...",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Bookmark className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-semibold text-foreground">Saved Insights</h2>
      </div>

      {savedInsights.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-muted/30 p-8 text-center">
          <Bookmark className="mx-auto mb-3 h-10 w-10 text-muted-foreground/50" />
          <h3 className="text-sm font-medium text-foreground">No saved insights</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Save insights from your analyses to access them later
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
                >
                  <Trash2 className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
              <p className="mb-2 text-sm text-muted-foreground line-clamp-2">
                {insight.summary}
              </p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {insight.timestamp}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedInsightsPanel;
