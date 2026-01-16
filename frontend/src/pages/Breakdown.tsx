import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PieChart, BarChart3, MapPin, Users, DollarSign, TrendingUp, CheckCircle, AlertTriangle, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import ChartPanel from "@/components/dashboard/ChartPanel";
import { analyzeView } from "@/lib/api";
import { useSettings } from "@/components/settings-provider";

interface RegionData {
  region: string;
  revenue: number;
  percentage: number;
  customers: number;
  growth: number;
  status: 'high' | 'medium' | 'low';
}

interface CategoryData {
  category: string;
  revenue: number;
  units: number;
  margin: number;
}

const Breakdown = () => {
  const navigate = useNavigate();
  const [regionData, setRegionData] = useState<RegionData[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const { settings } = useSettings();

  useEffect(() => {
    const loadBreakdownAnalysis = async () => {
      try {
        const response = await analyzeView("breakdown", "revenue", settings.defaultTimeRange);

        // Mock detailed breakdown data
        const mockRegionData: RegionData[] = [
          { region: "West", revenue: 28500, percentage: 35.2, customers: 1250, growth: 12.5, status: 'high' },
          { region: "East", revenue: 21800, percentage: 26.9, customers: 980, growth: 8.3, status: 'high' },
          { region: "North", revenue: 15600, percentage: 19.3, customers: 720, growth: -2.1, status: 'medium' },
          { region: "South", revenue: 15200, percentage: 18.6, customers: 650, growth: 15.7, status: 'medium' },
        ];

        const mockCategoryData: CategoryData[] = [
          { category: "Electronics", revenue: 32400, units: 2850, margin: 28.5 },
          { category: "Clothing", revenue: 21800, units: 4200, margin: 35.2 },
          { category: "Home & Garden", revenue: 18600, units: 1650, margin: 22.8 },
          { category: "Sports", revenue: 8300, units: 920, margin: 31.7 },
        ];

        setRegionData(mockRegionData);
        setCategoryData(mockCategoryData);

      } catch (error) {
        console.error("Failed to load breakdown analysis:", error);
      } finally {
        setLoading(false);
      }
    };

    loadBreakdownAnalysis();
  }, []);

  const regionChartData = regionData.map(item => ({
    name: item.region,
    value: item.revenue
  }));

  const categoryChartData = categoryData.map(item => ({
    name: item.category,
    value: item.revenue
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <PieChart className="h-12 w-12 animate-pulse mx-auto mb-4 text-primary" />
          <p className="text-lg">Analyzing breakdown...</p>
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
            <PieChart className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Revenue Breakdown Analysis</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl mt-2">
            Step-by-step analysis of revenue distribution across regions, categories, and customer segments
            with actionable insights for optimization.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="regional">Regional Analysis</TabsTrigger>
            <TabsTrigger value="categorical">Category Analysis</TabsTrigger>
            <TabsTrigger value="insights">Key Insights</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Regional Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartPanel
                    title=""
                    data={regionChartData}
                    chartType="bar"
                    xAxisLabel="Region"
                    yAxisLabel="Revenue ($)"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Category Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartPanel
                    title=""
                    data={categoryChartData}
                    chartType="pie"
                    xAxisLabel="Category"
                    yAxisLabel="Revenue ($)"
                  />
                </CardContent>
              </Card>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Total Revenue</p>
                      <p className="text-lg font-bold">${regionData.reduce((sum, r) => sum + r.revenue, 0).toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Top Region</p>
                      <p className="text-lg font-bold">{regionData[0]?.region}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Total Customers</p>
                      <p className="text-lg font-bold">{regionData.reduce((sum, r) => sum + r.customers, 0).toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Avg Growth</p>
                      <p className="text-lg font-bold">+{((regionData.reduce((sum, r) => sum + r.growth, 0) / regionData.length)).toFixed(1)}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Regional Analysis Tab */}
          <TabsContent value="regional" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Step-by-Step Regional Analysis</CardTitle>
                <CardDescription>
                  Detailed breakdown of performance by geographic region
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {regionData.map((region, index) => (
                  <div key={region.region} className="border border-border rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                            {index + 1}
                          </span>
                          {region.region} Region
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Step {index + 1} of {regionData.length}: Regional Performance Assessment
                        </p>
                      </div>
                      <Badge variant={
                        region.status === 'high' ? 'default' :
                        region.status === 'medium' ? 'secondary' : 'destructive'
                      }>
                        {region.status.toUpperCase()} PERFORMER
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <p className="text-sm text-muted-foreground">Revenue</p>
                        <p className="text-xl font-bold">${region.revenue.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">{region.percentage}% of total</p>
                      </div>
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <p className="text-sm text-muted-foreground">Customers</p>
                        <p className="text-xl font-bold">{region.customers.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Active users</p>
                      </div>
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <p className="text-sm text-muted-foreground">Growth</p>
                        <p className={`text-xl font-bold ${region.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {region.growth >= 0 ? '+' : ''}{region.growth}%
                        </p>
                        <p className="text-xs text-muted-foreground">YoY change</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Market Share</span>
                        <span className="font-medium">{region.percentage}%</span>
                      </div>
                      <Progress value={region.percentage} className="h-2" />
                    </div>

                    <div className="mt-4 p-3 bg-muted/30 rounded-lg">
                      <h4 className="font-medium mb-2">Key Findings:</h4>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>• Revenue contribution: {region.percentage}% of total company revenue</li>
                        <li>• Customer base: {region.customers} active customers ({(region.customers / regionData.reduce((sum, r) => sum + r.customers, 0) * 100).toFixed(1)}% of total)</li>
                        <li>• Growth trend: {region.growth >= 0 ? 'Positive' : 'Negative'} growth of {Math.abs(region.growth)}%</li>
                        <li>• Performance status: {region.status === 'high' ? 'Strong performer with above-average metrics' : region.status === 'medium' ? 'Moderate performance requiring attention' : 'Underperforming region needing improvement'}</li>
                      </ul>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Category Analysis Tab */}
          <TabsContent value="categorical" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Category Breakdown</CardTitle>
                <CardDescription>
                  Analysis of revenue and performance by product categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categoryData.map((category, index) => (
                    <div key={category.category} className="border border-border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold">{category.category}</h3>
                        <Badge variant="outline">${category.revenue.toLocaleString()}</Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Units Sold</p>
                          <p className="font-medium">{category.units.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Avg Price</p>
                          <p className="font-medium">${(category.revenue / category.units).toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Margin</p>
                          <p className="font-medium">{category.margin}%</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Key Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Strengths & Opportunities
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                    <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">Top Performing Region</h4>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      West region leads with 35.2% market share and strong 12.5% growth, indicating successful market penetration.
                    </p>
                  </div>

                  <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">High-Margin Category</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Clothing category shows 35.2% margin, suggesting premium positioning and strong brand value.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                    Areas for Improvement
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
                    <h4 className="font-medium text-orange-800 dark:text-orange-200 mb-2">Underperforming Region</h4>
                    <p className="text-sm text-orange-700 dark:text-orange-300">
                      North region shows -2.1% growth, requiring immediate attention to market strategy and customer engagement.
                    </p>
                  </div>

                  <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                    <h4 className="font-medium text-red-800 dark:text-red-200 mb-2">Low-Margin Category</h4>
                    <p className="text-sm text-red-700 dark:text-red-300">
                      Home & Garden category has only 22.8% margin, suggesting pricing strategy review or cost optimization.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Strategic Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                      1
                    </div>
                    <div>
                      <h4 className="font-medium">Focus on West Region Expansion</h4>
                      <p className="text-sm text-muted-foreground">
                        Allocate additional marketing budget to West region to capitalize on strong performance and expand market share.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                      2
                    </div>
                    <div>
                      <h4 className="font-medium">North Region Recovery Plan</h4>
                      <p className="text-sm text-muted-foreground">
                        Develop targeted initiatives to reverse negative growth in North region, including local market research and competitive analysis.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                      2
                    </div>
                    <div>
                      <h4 className="font-medium">Category Optimization</h4>
                      <p className="text-sm text-muted-foreground">
                        Review pricing strategy for Home & Garden category and explore cross-selling opportunities with high-margin categories.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Breakdown;