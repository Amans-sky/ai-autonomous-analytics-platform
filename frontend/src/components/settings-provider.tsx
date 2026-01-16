import { createContext, useContext, useEffect, useState } from "react";
import { fetchSettings, saveSettings } from "@/lib/api";

type Settings = {
  compactView: boolean;
  chartType: "line" | "bar" | "area";
  defaultTimeRange: string;
  emailAlerts: boolean;
  insightNotifications: boolean;
  shareUsageAnalytics: boolean;
  saveQueryHistory: boolean;
};

type SettingsProviderProps = {
  children: React.ReactNode;
};

type SettingsProviderState = {
  settings: Settings;
  updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
  saveSettingsToBackend: () => Promise<void>;
  isLoading: boolean;
};

const defaultSettings: Settings = {
  compactView: false,
  chartType: "line",
  defaultTimeRange: "6m",
  emailAlerts: false,
  insightNotifications: true,
  shareUsageAnalytics: false,
  saveQueryHistory: true,
};

const SettingsProviderContext = createContext<SettingsProviderState | undefined>(undefined);

export function SettingsProvider({ children }: SettingsProviderProps) {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  // Load settings from backend on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const backendSettings = await fetchSettings();
        setSettings(prev => ({
          ...prev,
          ...backendSettings,
          // Convert string values to appropriate types
          compactView: backendSettings.compactView === "true" || backendSettings.compactView === true,
          emailAlerts: backendSettings.emailAlerts === "true" || backendSettings.emailAlerts === true,
          insightNotifications: backendSettings.insightNotifications === "true" || backendSettings.insightNotifications === true,
          shareUsageAnalytics: backendSettings.shareUsageAnalytics === "true" || backendSettings.shareUsageAnalytics === true,
          saveQueryHistory: backendSettings.saveQueryHistory === "true" || backendSettings.saveQueryHistory === true,
        }));
      } catch (error) {
        console.warn("Failed to load settings from backend:", error);
        // Continue with default settings
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveSettingsToBackend = async () => {
    try {
      await saveSettings(settings);
    } catch (error) {
      console.error("Failed to save settings:", error);
      throw error;
    }
  };

  return (
    <SettingsProviderContext.Provider
      value={{
        settings,
        updateSetting,
        saveSettingsToBackend,
        isLoading,
      }}
    >
      {children}
    </SettingsProviderContext.Provider>
  );
}

export const useSettings = () => {
  const context = useContext(SettingsProviderContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};