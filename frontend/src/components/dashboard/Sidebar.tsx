import { useNavigate } from "react-router-dom";
import {
  BarChart3,
  TrendingUp,
  PieChart,
  Bookmark,
  Settings,
  LayoutDashboard,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type SidebarView =
  | "kpi-overview"
  | "trend-analysis"
  | "breakdown"
  | "saved-insights"
  | "settings";

interface SidebarProps {
  activeView: SidebarView;
  onViewChange: (view: SidebarView) => void;
}

const menuItems: { id: SidebarView; label: string; icon: React.ElementType; route?: string }[] =
  [
    { id: "kpi-overview", label: "KPI Overview", icon: LayoutDashboard },
    { id: "trend-analysis", label: "Trend Analysis", icon: TrendingUp, route: "/trend-analysis" },
    { id: "breakdown", label: "Breakdown", icon: PieChart, route: "/breakdown" },
    { id: "saved-insights", label: "Saved Insights", icon: Bookmark },
    { id: "settings", label: "Settings", icon: Settings },
  ];

const Sidebar = ({ activeView, onViewChange }: SidebarProps) => {
  const navigate = useNavigate();

  const handleClick = (item: typeof menuItems[0]) => {
    if (item.route) {
      navigate(item.route);
    } else {
      onViewChange(item.id);
    }
  };
  return (
    <aside className="flex h-full w-64 flex-col border-r border-border bg-card">
      {/* Logo / Brand */}
      <div className="flex h-16 items-center gap-2 border-b border-border px-4">
        <BarChart3 className="h-6 w-6 text-primary" />
        <span className="text-lg font-semibold text-foreground">Analytics</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleClick(item)}
              className={cn(
                "flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-border p-4">
        <p className="text-xs text-muted-foreground">
          AI-Powered Analytics v2.0
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
