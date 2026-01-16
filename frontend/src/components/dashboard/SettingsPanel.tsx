import { Settings, Moon, Sun, Bell, Database, Shield } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/**
 * Settings panel (UI only - no backend integration)
 */
const SettingsPanel = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Settings className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-semibold text-foreground">Settings</h2>
      </div>

      <div className="space-y-4">
        {/* Appearance */}
        <div className="rounded-lg border border-border bg-card p-4">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-medium text-foreground">
            <Sun className="h-4 w-4" />
            Appearance
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="dark-mode" className="text-sm text-muted-foreground">
                Dark Mode
              </Label>
              <Switch id="dark-mode" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="compact-view" className="text-sm text-muted-foreground">
                Compact View
              </Label>
              <Switch id="compact-view" />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="rounded-lg border border-border bg-card p-4">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-medium text-foreground">
            <Bell className="h-4 w-4" />
            Notifications
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="email-alerts" className="text-sm text-muted-foreground">
                Email Alerts
              </Label>
              <Switch id="email-alerts" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="insight-notifications" className="text-sm text-muted-foreground">
                Insight Notifications
              </Label>
              <Switch id="insight-notifications" defaultChecked />
            </div>
          </div>
        </div>

        {/* Data Preferences */}
        <div className="rounded-lg border border-border bg-card p-4">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-medium text-foreground">
            <Database className="h-4 w-4" />
            Data Preferences
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm text-muted-foreground">Default Time Range</Label>
              <Select defaultValue="6m">
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1m">1 Month</SelectItem>
                  <SelectItem value="3m">3 Months</SelectItem>
                  <SelectItem value="6m">6 Months</SelectItem>
                  <SelectItem value="1y">1 Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-sm text-muted-foreground">Chart Type</Label>
              <Select defaultValue="line">
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="line">Line</SelectItem>
                  <SelectItem value="bar">Bar</SelectItem>
                  <SelectItem value="area">Area</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Privacy */}
        <div className="rounded-lg border border-border bg-card p-4">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-medium text-foreground">
            <Shield className="h-4 w-4" />
            Privacy & Security
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="analytics-sharing" className="text-sm text-muted-foreground">
                Share Usage Analytics
              </Label>
              <Switch id="analytics-sharing" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="query-history" className="text-sm text-muted-foreground">
                Save Query History
              </Label>
              <Switch id="query-history" defaultChecked />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
