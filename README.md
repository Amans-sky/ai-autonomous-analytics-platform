# AI Autonomous Analytics Platform

### MCP-Governed, Agent-Driven Enterprise Analytics System

## Overview

Modern analytics workflows remain slow, fragile, and error-prone due to manual SQL authoring, inconsistent metric definitions, and heavy reliance on BI tooling. At the same time, most AI-based analytics solutions fail to deliver real enterprise value because they operate without governance, schema awareness, or execution safety.

This project presents an **autonomous AI-powered analytics platform** that combines **agent orchestration**, **strict data guardrails**, and **MCP-inspired governance** to deliver **reliable, explainable, and enterprise-ready analytics** from structured data.

The system allows users to ask **natural-language business questions** while ensuring:

* Metric correctness
* Schema validation
* Controlled query execution
* Deterministic, explainable outputs

This is a **system design and engineering project**, not a chatbot demo.

---

## Key Objectives

* Demonstrate real-world AI system architecture
* Implement autonomous, multi-agent workflows
* Enforce analytics governance and safety
* Integrate frontend analytics UX with AI reasoning
* Simulate enterprise-grade analytics execution

---

## System Architecture

```
Frontend (React + TypeScript)
│
│  Natural language queries
│  Sidebar-driven analytics views
│
▼
FastAPI Backend
│
├── AgentRouter
│   ├── PlannerAgent        → Interprets user intent
│   ├── DataAnalystAgent    → Constructs governed analytics
│   ├── DatabaseAgent      → Validates execution results
│   └── NarratorAgent      → Produces human-readable insights
│
└── MCP-Style Data Layer
    ├── BigQueryMCP (DuckDB-based analytical engine)
    ├── LookerMCP (metric validation)
    └── CatalogMCP (schema governance)
```

Each agent has a **single, clearly defined responsibility**, enabling traceable and maintainable execution.

---

## Core Features

### Natural Language Analytics

Users can ask questions such as:

* “Total revenue last month”
* “Breakdown of revenue by region”
* “Trend of orders over the last six months”

No SQL knowledge is required from the user.

---

### Autonomous Agent Orchestration

Every request follows a deterministic pipeline:

1. Intent planning
2. Metric and schema validation
3. Query construction
4. Safe execution
5. Result approval
6. Insight narration

Failures are handled gracefully without crashing the system.

---

### MCP-Governed Data Access

* No direct database access from AI logic
* Queries validated before execution
* Destructive SQL blocked
* Schema and metric consistency enforced

This mimics real enterprise analytics governance patterns.

---

### Sidebar-Driven Analytics (Phase 2)

The frontend sidebar enables predefined analytical modes:

* KPI Overview
* Trend Analysis
* Regional Breakdown
* Saved Insights

Each view maps to a controlled backend prompt, ensuring predictable behavior.

---

### Explainable Insights

Every response includes:

* Structured data output
* A textual analytical summary
* Confidence score
* Table and chart-ready data

---

## Technology Stack

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* Component-driven architecture

### Backend

* Python
* FastAPI
* DuckDB
* Pandas
* Agent-based system design

---

## Project Structure

```
ai-autonomous-analytics-platform/
│
├── backend/
│   ├── api.py
│   ├── agent_router.py
│   ├── guardrails.py
│   ├── agents/
│   │   ├── planner_agent.py
│   │   ├── data_analyst_agent.py
│   │   ├── database_agent.py
│   │   └── narrator_agent.py
│   ├── mcp/
│   │   ├── base_mcp.py
│   │   ├── bigquery_mcp.py
│   │   ├── looker_mcp.py
│   │   └── catalog_mcp.py
│   └── data/
│       └── sales_sample.csv
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── lib/api.ts
│   │   ├── pages/Dashboard.tsx
│   │   └── main.tsx
│   └── index.html
│
├── .gitignore
└── README.md
```

---

## Running the Project Locally

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn backend.api:app --reload
```

API available at:

```
http://127.0.0.1:8000
```

Swagger documentation:

```
http://127.0.0.1:8000/docs
```

---

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend available at:

```
http://localhost:5173
```

---

## API Endpoints

### Health Check

```
GET /
```

```json
{ "status": "ok" }
```

---

### Natural Language Analytics

```
GET /analyze?query=<business_question>
```

---

### Sidebar-Driven Analytics

```
POST /analyze-view
```

```json
{
  "view": "trend-analysis",
  "query": "revenue"
}
```

---

## Safety and Guardrails

* Metric validation enforced
* Schema validation enforced
* Destructive queries blocked
* Low-confidence queries rejected
* Errors handled without server crashes

This mirrors enterprise AI risk-control practices.

---

## Example Response

```json
{
  "status": "success",
  "confidence": 0.8,
  "insight": {
    "summary": "Analysis completed successfully",
    "rows": 4,
    "data": [
      { "region": "North", "revenue": 54000 },
      { "region": "South", "revenue": 47000 },
      { "region": "East", "revenue": 62000 },
      { "region": "West", "revenue": 39000 }
    ]
  }
}
```

---

## What This Project Demonstrates

* Enterprise-grade AI system design
* Autonomous agent workflows
* Analytics governance and safety
* Frontend–backend AI integration
* Explainable and deterministic AI behavior

---

## Future Enhancements

* Persistent agent memory
* Anomaly detection and alerts
* Role-based access control
* Integration with real cloud data warehouses
* Insight versioning and history
* Production deployment pipelines

---

## Author

**Aman N Shah**
AI and Data Analytics Engineer
GitHub: [https://github.com/Amans-sky](https://github.com/Amans-sky)

---


