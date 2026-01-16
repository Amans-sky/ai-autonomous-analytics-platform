import { useState, useEffect } from "react";
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
import { useSettings } from "@/components/settings-provider";

// Helper function to get time range display text
const getTimeRangeDisplay = (timeRange: string) => {
  const timeRangeMap = {
    "1m": { period: "Last month", range: "Jun 2024 - Jun 2024", months: 1 },
    "3m": { period: "Last 3 months", range: "Apr 2024 - Jun 2024", months: 3 },
    "6m": { period: "Last 6 months", range: "Jan 2024 - Jun 2024", months: 6 },
    "1y": { period: "Last year", range: "Jul 2023 - Jun 2024", months: 12 },
    "2y": { period: "Last 2 years", range: "Jul 2022 - Jun 2024", months: 24 },
    "all": { period: "All time", range: "2018 - Jun 2024", months: 72 },
  };
  return timeRangeMap[timeRange as keyof typeof timeRangeMap] || timeRangeMap["6m"];
};

// Mock KPI data - structured for easy backend integration
const getMockKpis = (timeRange: string) => {
  const timeInfo = getTimeRangeDisplay(timeRange);

  // Scale values based on time range (rough approximation)
  const scaleFactor = Math.max(1, timeInfo.months / 6);

  return [
    {
      title: "Total Revenue",
      value: `$${(27.6 * scaleFactor).toFixed(1)}K`,
      subtitle: timeInfo.period,
      icon: DollarSign,
      trend: { value: "+12.5%", isPositive: true },
    },
    {
      title: "Total Orders",
      value: Math.round(1284 * scaleFactor).toLocaleString(),
      subtitle: timeInfo.period,
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
      value: timeInfo.period,
      subtitle: timeInfo.range,
      icon: Calendar,
    },
  ];
};

// Mock chart data - structured for easy backend integration
const getMockChartData = (timeRange: string) => {
  const timeInfo = getTimeRangeDisplay(timeRange);

  // Generate data points based on time range
  const dataPoints = [];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // For shorter periods, show more granular data (months)
  // For longer periods, show quarterly or yearly data
  if (timeInfo.months <= 6) {
    // Show monthly data for last 6 months or less
    const baseData = [4200, 4800, 3100, 4500, 5200, 5800];
    for (let i = 0; i < Math.min(timeInfo.months, 6); i++) {
      dataPoints.push({
        name: months[5 - timeInfo.months + 1 + i] + " 2024",
        value: baseData[i] || 4500
      });
    }
  } else if (timeInfo.months <= 12) {
    // Show quarterly data for 1 year
    dataPoints.push(
      { name: "Q1 2024", value: 12100 },
      { name: "Q2 2024", value: 15500 },
      { name: "Q3 2024", value: 13200 },
      { name: "Q4 2024", value: 16800 }
    );
  } else {
    // Show yearly data for longer periods
    const years = Math.min(Math.ceil(timeInfo.months / 12), 3);
    for (let i = 0; i < years; i++) {
      dataPoints.push({
        name: `${2024 - years + 1 + i}`,
        value: 45000 + (i * 5000)
      });
    }
  }

  return dataPoints;
};

const Dashboard = () => {
  const [activeView, setActiveView] = useState<SidebarView>("kpi-overview");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chartData, setChartData] = useState(getMockChartData("6m"));

  // API response state
  const [apiResponse, setApiResponse] = useState<AnalyzeResponse | null>(null);
  const [insight, setInsight] = useState<InsightData | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);

  // Legacy insight string for InsightPanel (for backward compatibility)
  const [insightText, setInsightText] = useState<string | null>(null);

  // Settings
  const { settings } = useSettings();

  // Re-fetch data when time range changes
  useEffect(() => {
    if (activeView === "kpi-overview" && !isLoading) {
      // Auto-refresh KPI data when time range changes
      handleQuerySubmit("revenue");
    }
    // Update chart data based on time range
    setChartData(getMockChartData(settings.defaultTimeRange));
  }, [settings.defaultTimeRange]);

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
    // Phase routing (Phase 1 vs Phase 2)
    const response =
      activeView === "kpi-overview"
        ? await analyzeQuery(query)
        : await analyzeView(activeView, query, settings.defaultTimeRange);

    setApiResponse(response);
    setConfidence(response.confidence);

    if (isSuccessResponse(response)) {
      // 🔑 NORMALIZE insight (THIS FIXES YOUR UI)
      const normalizedInsight: InsightData = {
        summary: response.insight.summary,
        rows:
          response.insight.data?.length ??
          response.insight.rows ??
          0,
        data: response.insight.data ?? [],
      };

      setInsight(normalizedInsight);
      setInsightText(normalizedInsight.summary);

      // Chart binding (optional but safe)
      if (normalizedInsight.data.length > 0) {
        const firstRow = normalizedInsight.data[0];
        const keys = Object.keys(firstRow);

        const nameKey = keys.find(
          (k) =>
            k.toLowerCase().includes("month") ||
            k.toLowerCase().includes("date") ||
            k.toLowerCase().includes("period") ||
            k.toLowerCase().includes("region")
        );

        const valueKey = keys.find(
          (k) =>
            typeof firstRow[k] === "number" ||
            k.toLowerCase().includes("revenue") ||
            k.toLowerCase().includes("amount") ||
            k.toLowerCase().includes("value")
        );

        if (nameKey && valueKey) {
          setChartData(
            normalizedInsight.data.map((row) => ({
              name: String(row[nameKey]),
              value: Number(row[valueKey]) || 0,
            }))
          );
        }
      }
    }
  } catch (err) {
    // Graceful UI-safe fallback
    setError(
      err instanceof Error ? err.message : "Unexpected error occurred"
    );
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
            <section className={settings.compactView ? "mb-3" : "mb-8"}>
              <QueryInput onSubmit={handleQuerySubmit} isLoading={isLoading} />
            </section>

            {/* KPI Summary Section */}
            <section className={settings.compactView ? "mb-3" : "mb-8"}>
              <h2 className={`text-sm font-medium uppercase tracking-wide text-muted-foreground ${settings.compactView ? "mb-2 text-xs" : "mb-4"}`}>
                Key Metrics
              </h2>
              <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 ${settings.compactView ? "gap-2" : "gap-4"}`}>
                {getMockKpis(settings.defaultTimeRange).map((kpi, index) => (
                  <KpiCard
                    key={index}
                    title={kpi.title}
                    value={kpi.value}
                    subtitle={kpi.subtitle}
                    icon={kpi.icon}
                    trend={kpi.trend}
                    compact={settings.compactView}
                  />
                ))}
              </div>
            </section>

            {/* Results Section */}
            {apiResponse && isRejectedResponse(apiResponse) && (
              <section className={settings.compactView ? "mb-3" : "mb-8"}>
                <RejectedQueryPanel
                  reason={apiResponse.reason}
                  suggestion={apiResponse.suggestion}
                  confidence={apiResponse.confidence}
                />
              </section>
            )}

            {insight && confidence !== null && (
              <section className={settings.compactView ? "mb-3" : "mb-8"}>
                <InsightSummary
                  summary={insight.summary}
                  rows={insight.rows}
                  confidence={confidence}
                />
              </section>
            )}

            {/* Data Table Section */}
            {insight && (
              <section className={settings.compactView ? "mb-3" : "mb-8"}>
                <DataTable data={insight.data} title="Query Results" />
              </section>
            )}

            {/* Chart and Legacy Insight Section */}
            <section className={`grid grid-cols-1 gap-6 lg:grid-cols-2 ${settings.compactView ? "gap-3" : "gap-6"}`}>
              <ChartPanel
                title="Metric Trend Analysis"
                data={chartData}
                chartType={settings.chartType}
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
          <div className={`container mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 ${settings.compactView ? "py-3 px-3" : "py-6 px-4 sm:px-6 lg:px-8"}`}>
            {renderMainContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
