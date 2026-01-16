import { useState } from "react";
import { DollarSign, ShoppingCart, Globe, Calendar } from "lucide-react";
import Navbar from "./Navbar";
import Sidebar, { SidebarView } from "./Sidebar";
import QueryInput from "./QueryInput";
import KpiCard from "./KpiCard";
import ChartPanel from "./ChartPanel";
import InsightPanel from "./InsightPanel";
import DataTable from "./DataTable";
import InsightSummary from "./InsightSummary";
import RejectedQueryPanel from "./RejectedQueryPanel";
import SettingsPanel from "./SettingsPanel";
import SavedInsightsPanel from "./SavedInsightsPanel";
import {
  analyzeQuery,
  analyzeView,
  isSuccessResponse,
  isRejectedResponse,
  type AnalyzeResponse,
  type InsightData,
} from "@/lib/api";

// Mock KPI data - structured for easy backend integration
const mockKpis = [
  {
    title: "Total Revenue",
    value: "$27.6K",
    subtitle: "Last 6 months",
    icon: DollarSign,
    trend: { value: "+12.5%", isPositive: true },
  },
  {
    title: "Total Orders",
    value: "1,284",
    subtitle: "Last 6 months",
    icon: ShoppingCart,
    trend: { value: "+8.2%", isPositive: true },
  },
  {
    title: "Regions Analyzed",
    value: "4",
    subtitle: "North, South, East, West",
    icon: Globe,
  },
  {
    title: "Time Range",
    value: "6 Months",
    subtitle: "Jan 2024 - Jun 2024",
    icon: Calendar,
  },
];

// Mock chart data - structured for easy backend integration
const mockChartData = [
  { name: "Jan", value: 4200 },
  { name: "Feb", value: 4800 },
  { name: "Mar", value: 3100 },
  { name: "Apr", value: 4500 },
  { name: "May", value: 5200 },
  { name: "Jun", value: 5800 },
];

const Dashboard = () => {
  const [activeView, setActiveView] = useState<SidebarView>("kpi-overview");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chartData, setChartData] = useState(mockChartData);

  // API response state
  const [apiResponse, setApiResponse] = useState<AnalyzeResponse | null>(null);
  const [insight, setInsight] = useState<InsightData | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);

  // Legacy insight string for InsightPanel (for backward compatibility)
  const [insightText, setInsightText] = useState<string | null>(null);

  /**
   * Handles query submission and calls the backend API
   * API endpoint: GET /analyze?query=<natural_language_question>
   */
  const handleQuerySubmit = async (query: string) => {
  setIsLoading(true);
  setError(null);
  setApiResponse(null);
  setInsight(null);
  setConfidence(null);
  setInsightText(null);

  try {
    // 🔥 KEY FIX: route based on sidebar view
    const response =
      activeView === "kpi-overview"
        ? await analyzeQuery(query) // Phase 1
        : await analyzeView(activeView, query); // Phase 2

    setApiResponse(response);
    setConfidence(response.confidence);

    if (isSuccessResponse(response)) {
      setInsight(response.insight);
      setInsightText(response.insight.summary);

      // Update chart data if possible
      if (response.insight.data && response.insight.data.length > 0) {
        const firstRow = response.insight.data[0];
        const keys = Object.keys(firstRow);

        const nameKey = keys.find(
          (k) =>
            k.toLowerCase().includes("name") ||
            k.toLowerCase().includes("month") ||
            k.toLowerCase().includes("date") ||
            k.toLowerCase().includes("period")
        );

        const valueKey = keys.find(
          (k) =>
            typeof firstRow[k] === "number" ||
            k.toLowerCase().includes("value") ||
            k.toLowerCase().includes("revenue") ||
            k.toLowerCase().includes("amount")
        );

        if (nameKey && valueKey) {
          setChartData(
            response.insight.data.map((row) => ({
              name: String(row[nameKey]),
              value: Number(row[valueKey]) || 0,
            }))
          );
        }
      }
    }
  } catch (err) {
    if (err instanceof TypeError && err.message.includes("fetch")) {
      // fallback mock (unchanged)
      const mockResponse: AnalyzeResponse = {
        status: "success",
        confidence: 0.87,
        insight: {
          summary: `Analysis for: "${query}"`,
          rows: 0,
          data: [],
        },
      };
      setApiResponse(mockResponse);
      setConfidence(mockResponse.confidence);
      setInsight(mockResponse.insight);
      setInsightText(mockResponse.insight.summary);
    } else {
      setError(err instanceof Error ? err.message : "Unexpected error");
    }
  } finally {
    setIsLoading(false);
  }
};


  const renderMainContent = () => {
    switch (activeView) {
      case "settings":
        return <SettingsPanel />;

      case "saved-insights":
        return <SavedInsightsPanel />;

      case "kpi-overview":
      case "trend-analysis":
      case "breakdown":
      default:
        return (
          <>
            {/* Query Input Section */}
            <section className="mb-8">
              <QueryInput onSubmit={handleQuerySubmit} isLoading={isLoading} />
            </section>

            {/* KPI Summary Section */}
            <section className="mb-8">
              <h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-muted-foreground">
                Key Metrics
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {mockKpis.map((kpi, index) => (
                  <KpiCard
                    key={index}
                    title={kpi.title}
                    value={kpi.value}
                    subtitle={kpi.subtitle}
                    icon={kpi.icon}
                    trend={kpi.trend}
                  />
                ))}
              </div>
            </section>

            {/* Results Section */}
            {apiResponse && isRejectedResponse(apiResponse) && (
              <section className="mb-8">
                <RejectedQueryPanel
                  reason={apiResponse.reason}
                  suggestion={apiResponse.suggestion}
                  confidence={apiResponse.confidence}
                />
              </section>
            )}

            {insight && confidence !== null && (
              <section className="mb-8">
                <InsightSummary
                  summary={insight.summary}
                  rows={insight.rows}
                  confidence={confidence}
                />
              </section>
            )}

            {/* Data Table Section */}
            {insight && (
              <section className="mb-8">
                <DataTable data={insight.data} title="Query Results" />
              </section>
            )}

            {/* Chart and Legacy Insight Section */}
            <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <ChartPanel
                title="Metric Trend Analysis"
                data={chartData}
                chartType={activeView === "trend-analysis" ? "line" : "bar"}
                xAxisLabel="Time"
                yAxisLabel="Value"
              />
              <InsightPanel
                insight={insightText}
                isLoading={isLoading}
                error={error}
              />
            </section>
          </>
        );
    }
  };

  return (
    <div className="flex h-screen flex-col bg-background">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeView={activeView} onViewChange={setActiveView} />

        <main className="flex-1 overflow-auto">
          <div className="container mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            {renderMainContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
