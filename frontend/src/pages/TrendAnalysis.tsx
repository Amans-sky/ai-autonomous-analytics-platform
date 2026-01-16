import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TrendingUp, Calendar, BarChart3, ArrowUp, ArrowDown, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import ChartPanel from "@/components/dashboard/ChartPanel";
import { analyzeView } from "@/lib/api";
import { useSettings } from "@/components/settings-provider";

interface TrendData {
  period: string;
  value: number;
  change: number;
  growth: string;
}

const TrendAnalysis = () => {
  const navigate = useNavigate();
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [insights, setInsights] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { settings } = useSettings();

  useEffect(() => {
    const loadTrendAnalysis = async () => {
      try {
        const response = await analyzeView("trend-analysis", "revenue", settings.defaultTimeRange);

        // Mock detailed trend data - in real app, this would come from the analysis
        const mockTrendData: TrendData[] = [
          { period: "Jan 2024", value: 4200, change: 0, growth: "0%" },
          { period: "Feb 2024", value: 4800, change: 14.3, growth: "+14.3%" },
          { period: "Mar 2024", value: 3100, change: -35.4, growth: "-35.4%" },
          { period: "Apr 2024", value: 4500, change: 45.2, growth: "+45.2%" },
          { period: "May 2024", value: 5200, change: 15.6, growth: "+15.6%" },
          { period: "Jun 2024", value: 5800, change: 11.5, growth: "+11.5%" },
        ];

        setTrendData(mockTrendData);

        // Detailed insights
        setInsights([
          "Revenue showed strong growth in Q2 2024 with a 45.2% increase in April following a significant dip in March",
          "March's -35.4% decline suggests seasonal factors or external market pressures that need investigation",
          "Overall 6-month trend indicates +38.1% growth, with Q2 performing significantly better than Q1",
          "Key drivers: April's strong performance likely due to new product launches or marketing campaigns",
          "Projections: If current growth rate continues, Q3 could see 25-30% increase over Q2 average",
          "Recommendations: Focus on stabilizing March-level performance and replicating April's success factors"
        ]);

      } catch (error) {
        console.error("Failed to load trend analysis:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTrendAnalysis();
  }, []);

  const chartData = trendData.map(item => ({
    name: item.period,
    value: item.value
  }));

  const totalGrowth = trendData.length > 1 ?
    ((trendData[trendData.length - 1].value - trendData[0].value) / trendData[0].value * 100) : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <TrendingUp className="h-12 w-12 animate-pulse mx-auto mb-4 text-primary" />
          <p className="text-lg">Analyzing trends...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <TrendingUp className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Trend Analysis</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl mt-2">
            Comprehensive analysis of revenue trends over the past 6 months, including growth patterns,
            seasonal variations, and actionable insights for future performance.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                {totalGrowth >= 0 ? (
                  <ArrowUp className="h-5 w-5 text-green-500" />
                ) : (
                  <ArrowDown className="h-5 w-5 text-red-500" />
                )}
                <span className={`text-2xl font-bold ${totalGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {totalGrowth >= 0 ? '+' : ''}{totalGrowth.toFixed(1)}%
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">6-month period</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Best Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                ${Math.max(...trendData.map(d => d.value)).toLocaleString()}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {trendData.find(d => d.value === Math.max(...trendData.map(x => x.value)))?.period}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Average Monthly</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                ${(trendData.reduce((sum, d) => sum + d.value, 0) / trendData.length).toLocaleString()}
              </div>
              <p className="text-sm text-muted-foreground mt-1">Revenue per month</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Revenue Trend (6 Months)
            </CardTitle>
            <CardDescription>
              Monthly revenue performance with growth indicators
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartPanel
              title=""
              data={chartData}
              chartType="area"
              xAxisLabel="Month"
              yAxisLabel="Revenue ($)"
            />
          </CardContent>
        </Card>

        {/* Monthly Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Performance Breakdown</CardTitle>
            <CardDescription>
              Detailed analysis of each month's performance and growth factors
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trendData.map((month, index) => (
                <div key={month.period} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="text-sm font-medium text-muted-foreground w-20">
                      {month.period}
                    </div>
                    <div className="text-lg font-semibold">
                      ${month.value.toLocaleString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant={month.change >= 0 ? "default" : "destructive"}>
                      {month.growth}
                    </Badge>
                    <Progress
                      value={Math.abs(month.change)}
                      className="w-24"
                      // You might want to adjust this based on your data range
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Detailed Insights */}
        <Card>
          <CardHeader>
            <CardTitle>Key Insights & Analysis</CardTitle>
            <CardDescription>
              Comprehensive analysis of trends, patterns, and recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {insights.map((insight, index) => (
                <div key={index} className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                    {index + 1}
                  </div>
                  <p className="text-sm leading-relaxed">{insight}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Seasonal Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Seasonal Patterns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Q1 Average</span>
                  <span className="font-medium">${(trendData.slice(0, 3).reduce((sum, d) => sum + d.value, 0) / 3).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Q2 Average</span>
                  <span className="font-medium">${(trendData.slice(3).reduce((sum, d) => sum + d.value, 0) / 3).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Q2 vs Q1 Growth</span>
                  <Badge variant="secondary">
                    +{(((trendData.slice(3).reduce((sum, d) => sum + d.value, 0) / 3) /
                        (trendData.slice(0, 3).reduce((sum, d) => sum + d.value, 0) / 3) - 1) * 100).toFixed(1)}%
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Performance Forecast</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm font-medium">Next Quarter Projection</p>
                  <p className="text-lg font-bold text-primary">
                    ${(trendData[trendData.length - 1].value * 1.25).toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">Based on current growth rate</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm font-medium">Risk Factors</p>
                  <p className="text-sm text-muted-foreground">Seasonal dip in March suggests monitoring external factors</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TrendAnalysis;