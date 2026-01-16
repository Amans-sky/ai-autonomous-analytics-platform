import { useEffect } from "react";
import {
  Settings,
  Sun,
  Bell,
  Database,
  Shield,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTheme } from "@/components/theme-provider";
import { useSettings } from "@/components/settings-provider";

/**
 * Settings Panel
 *
 * Phase 3:
 * - Settings are now persisted to backend
 * - Real-time UI updates
 */
const SettingsPanel = () => {
  const { theme, setTheme } = useTheme();
  const { settings, updateSetting, saveSettingsToBackend } = useSettings();

  // Auto-save settings when they change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveSettingsToBackend().catch(console.error);
    }, 500); // Debounce saves

    return () => clearTimeout(timeoutId);
  }, [settings, saveSettingsToBackend]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Settings className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-semibold text-foreground">
          Settings
        </h2>
      </div>

      {/* Phase Notice */}
      <p className="text-sm text-muted-foreground">
        Settings are automatically saved and will persist across sessions.
      </p>

      <div className="space-y-4">
        {/* Appearance */}
        <div className="rounded-lg border border-border bg-card p-4">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-medium">
            <Sun className="h-4 w-4" />
            Appearance
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="dark-mode" className="text-sm">
                Dark Mode
              </Label>
              <Switch
                id="dark-mode"
                checked={theme === "dark"}
                onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="compact-view" className="text-sm">
                Compact View
              </Label>
              <Switch
                id="compact-view"
                checked={settings.compactView}
                onCheckedChange={(checked) => updateSetting("compactView", checked)}
              />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="rounded-lg border border-border bg-card p-4">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-medium">
            <Bell className="h-4 w-4" />
            Notifications
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="email-alerts" className="text-sm">
                Email Alerts
              </Label>
              <Switch
                id="email-alerts"
                checked={settings.emailAlerts}
                onCheckedChange={(checked) => updateSetting("emailAlerts", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="insight-notifications" className="text-sm">
                Insight Notifications
              </Label>
              <Switch
                id="insight-notifications"
                checked={settings.insightNotifications}
                onCheckedChange={(checked) => updateSetting("insightNotifications", checked)}
              />
            </div>
          </div>
        </div>

        {/* Data Preferences */}
        <div className="rounded-lg border border-border bg-card p-4">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-medium">
            <Database className="h-4 w-4" />
            Data Preferences
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm">
                Default Time Range
              </Label>
              <Select value={settings.defaultTimeRange} onValueChange={(value) => updateSetting("defaultTimeRange", value)}>
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
              <Label className="text-sm">
                Chart Type
              </Label>
              <Select value={settings.chartType} onValueChange={(value: "line" | "bar" | "area") => updateSetting("chartType", value)}>
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
          <h3 className="mb-4 flex items-center gap-2 text-sm font-medium">
            <Shield className="h-4 w-4" />
            Privacy & Security
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="share-analytics" className="text-sm">
                Share Usage Analytics
              </Label>
              <Switch
                id="share-analytics"
                checked={settings.shareUsageAnalytics}
                onCheckedChange={(checked) => updateSetting("shareUsageAnalytics", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="save-history" className="text-sm">
                Save Query History
              </Label>
              <Switch
                id="save-history"
                checked={settings.saveQueryHistory}
                onCheckedChange={(checked) => updateSetting("saveQueryHistory", checked)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
