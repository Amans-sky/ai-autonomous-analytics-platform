import { LucideIcon } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  compact?: boolean;
}

const KpiCard = ({ title, value, subtitle, icon: Icon, trend, compact = false }: KpiCardProps) => {
  return (
    <div className={`rounded-lg border border-border bg-card shadow-sm transition-shadow hover:shadow-md ${compact ? "p-3" : "p-5"}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className={`font-medium text-muted-foreground ${compact ? "text-xs" : "text-sm"}`}>{title}</p>
          <p className={`font-semibold text-foreground ${compact ? "mt-1 text-xl" : "mt-2 text-2xl"}`}>{value}</p>
          {subtitle && (
            <p className={`text-muted-foreground ${compact ? "mt-0.5 text-xs" : "mt-1 text-sm"}`}>{subtitle}</p>
          )}
          {trend && (
            <p
              className={`font-medium ${
                trend.isPositive ? "text-[hsl(var(--success))]" : "text-destructive"
              } ${compact ? "mt-1 text-xs" : "mt-2 text-sm"}`}
            >
              {trend.isPositive ? "↑" : "↓"} {trend.value}
            </p>
          )}
        </div>
        <div className={`flex items-center justify-center rounded-lg bg-accent ${compact ? "h-8 w-8" : "h-10 w-10"}`}>
          <Icon className={`text-accent-foreground ${compact ? "h-4 w-4" : "h-5 w-5"}`} />
        </div>
      </div>
    </div>
  );
};

export default KpiCard;
