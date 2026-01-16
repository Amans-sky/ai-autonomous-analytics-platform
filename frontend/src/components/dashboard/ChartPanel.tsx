import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface ChartData {
  name: string;
  value: number;
  secondaryValue?: number;
}

interface ChartPanelProps {
  title: string;
  data: ChartData[];
  chartType?: "line" | "bar" | "area" | "pie";
  xAxisLabel?: string;
  yAxisLabel?: string;
}

const ChartPanel = ({
  title,
  data,
  chartType = "line",
  xAxisLabel = "Period",
  yAxisLabel = "Value",
}: ChartPanelProps) => {
  const getChartComponent = () => {
    switch (chartType) {
      case "bar":
        return BarChart;
      case "area":
        return AreaChart;
      case "pie":
        return PieChart;
      default:
        return LineChart;
    }
  };

  const Chart = getChartComponent();

  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {xAxisLabel} vs {yAxisLabel}
        </p>
      </div>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "pie" ? (
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={`hsl(${(index * 360) / data.length}, 70%, 50%)`} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          ) : (
            <Chart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                dx={-10}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                  boxShadow: "var(--shadow-elevated)",
                }}
                labelStyle={{ color: "hsl(var(--foreground))", fontWeight: 500 }}
                itemStyle={{ color: "hsl(var(--muted-foreground))" }}
              />
              {chartType === "bar" ? (
                <Bar
                  dataKey="value"
                  fill="hsl(var(--chart-1))"
                  radius={[4, 4, 0, 0]}
                />
              ) : chartType === "area" ? (
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--chart-1))"
                  fill="hsl(var(--chart-1))"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              ) : (
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--chart-1))", strokeWidth: 0, r: 4 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              )}
            </Chart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartPanel;
