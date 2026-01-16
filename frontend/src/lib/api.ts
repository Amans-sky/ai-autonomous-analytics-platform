/**
 * API Helper for Analytics Dashboard
 * All backend communication goes through this file
 */

const API_BASE_URL = "http://127.0.0.1:8000";

// API Response Types
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

/**
 * Analyzes a natural language query using the backend API
 * @param query - The natural language question to analyze
 * @returns Promise<AnalyzeResponse>
 */
export async function analyzeQuery(query: string): Promise<AnalyzeResponse> {
  const url = `${API_BASE_URL}/analyze?query=${encodeURIComponent(query)}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  const data: AnalyzeResponse = await response.json();
  return data;
}

/**
 * Type guard to check if response is successful
 */
export function isSuccessResponse(
  response: AnalyzeResponse
): response is SuccessResponse {
  return response.status === "success";
}

/**
 * Type guard to check if response is rejected
 */
export function isRejectedResponse(
  response: AnalyzeResponse
): response is RejectedResponse {
  return response.status === "rejected";
}

export async function analyzeView(
  view: string,
  query: string
): Promise<AnalyzeResponse> {
  const res = await fetch("http://127.0.0.1:8000/analyze-view", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ view, query }),
  });

  if (!res.ok) {
    throw new Error("Failed to analyze view");
  }

  return res.json();
}

