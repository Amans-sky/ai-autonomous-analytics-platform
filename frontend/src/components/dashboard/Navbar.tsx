import { Activity } from "lucide-react";

const Navbar = () => {
  return (
    <header className="border-b border-border bg-card px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
          <Activity className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-foreground">
            AI-Powered Analytics Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Autonomous, MCP-Governed Insights
          </p>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
