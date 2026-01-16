/**
 * API Helper for Analytics Dashboard
 * All backend communication goes through this file
 */

const API_BASE_URL = "http://127.0.0.1:8000";

// --------------------------------------------------
// Types
// --------------------------------------------------

export interface InsightData {
  summary: string;
  rows: number;
  data: Record<string, unknown>[];
}

export interface SuccessResponse {
  status: "success";
  confidence: number;
  insight: InsightData;
}

export interface RejectedResponse {
  status: "rejected";
  reason: string;
  confidence: number;
  suggestion: string;
}

export type AnalyzeResponse = SuccessResponse | RejectedResponse;

// --------------------------------------------------
// Phase 1: Natural Language Analytics
// --------------------------------------------------

export async function analyzeQuery(
  query: string
): Promise<AnalyzeResponse> {
  const url = `${API_BASE_URL}/analyze?query=${encodeURIComponent(query)}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// --------------------------------------------------
// Phase 2: Sidebar-driven Analytics
// --------------------------------------------------

export async function analyzeView(
  view: string,
  query: string,
  timeRange?: string
): Promise<AnalyzeResponse> {
  const res = await fetch(`${API_BASE_URL}/analyze-view`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ view, query, timeRange }),
  });

  if (!res.ok) {
    throw new Error("Failed to analyze view");
  }

  return res.json();
}

// --------------------------------------------------
// Phase 3: Persistence APIs
// --------------------------------------------------

export async function fetchSavedInsights() {
  const res = await fetch(`${API_BASE_URL}/saved-insights`);

  if (!res.ok) {
    throw new Error("Failed to fetch saved insights");
  }

  return res.json();
}

export async function fetchSettings() {
  const res = await fetch(`${API_BASE_URL}/settings`);

  if (!res.ok) {
    throw new Error("Failed to fetch settings");
  }

  return res.json();
}

export async function saveSettings(settings: Record<string, any>) {
  const res = await fetch(`${API_BASE_URL}/settings/set`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(settings),
  });

  if (!res.ok) {
    throw new Error("Failed to save settings");
  }

  return res.json();
}

// --------------------------------------------------
// Type Guards
// --------------------------------------------------

export function isSuccessResponse(
  response: AnalyzeResponse
): response is SuccessResponse {
  return response.status === "success";
}

export function isRejectedResponse(
  response: AnalyzeResponse
): response is RejectedResponse {
  return response.status === "rejected";
}
