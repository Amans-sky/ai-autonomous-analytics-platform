# AI Autonomous Analytics Platform

**MCP-Governed, Agent-Driven Enterprise Analytics System**

---

## Overview

Modern analytics systems often suffer from slow turnaround times, fragile SQL pipelines, inconsistent metric definitions, and heavy dependence on manual BI workflows. While AI-powered analytics tools promise automation, most fail to meet enterprise standards due to the lack of governance, schema awareness, and execution safety.

The **AI Autonomous Analytics Platform** is a full-stack, enterprise-inspired analytics system that combines **autonomous agent orchestration**, **strict analytics guardrails**, and **MCP-style governance** to deliver reliable, explainable, and deterministic insights from structured data.

This project is a **system design and engineering implementation**, not a chatbot demo.

---

## Key Objectives

* Demonstrate real-world AI system architecture
* Implement autonomous, multi-agent analytics workflows
* Enforce analytics governance and execution safety
* Integrate AI reasoning with a modern analytics dashboard
* Simulate enterprise-grade analytics behavior
* Deliver a settings-driven, multi-view analytics experience

---

## System Architecture

### Frontend (React + TypeScript + Vite)

* Natural language query interface
* Sidebar-driven analytics modes
* Dedicated analytics pages
* Interactive settings and preferences
* Dynamic time range filtering
* Dark/Light theme with persistence

### Backend (FastAPI + SQLite)

```
User Request
   ↓
AgentRouter
   ├── PlannerAgent        → Interprets intent
   ├── DataAnalystAgent    → Builds governed analytics
   ├── DatabaseAgent      → Validates execution results
   └── NarratorAgent      → Produces explainable insights
   ↓
MCP-Governed Data Layer
```

### MCP-Style Data Governance Layer

* BigQueryMCP (DuckDB-based analytics engine)
* LookerMCP (metric validation)
* CatalogMCP (schema governance)

Each agent has **one clear responsibility**, ensuring traceable, maintainable execution.

---

## Core Features

### Natural Language Analytics

Users can ask questions such as:

* *Total revenue last month*
* *Breakdown of revenue by region*
* *Trend of orders over the last six months*
* *Why did revenue drop in March in the West region?*

No SQL knowledge is required.

---

### Autonomous Agent Orchestration

Every query follows a deterministic pipeline:

1. Intent planning
2. Metric and schema validation
3. Time-range aware query construction
4. Safe execution
5. Result approval
6. Human-readable narration

Failures are handled gracefully without crashing the system.

---

### MCP-Governed Data Access

* No direct database access from AI logic
* Destructive SQL is blocked
* Schema and metric consistency enforced
* Time range parameters injected safely
* Deterministic and explainable outputs

This mirrors real enterprise analytics governance patterns.

---

## Interactive Dashboard Features

### Settings Panel

* Time Range Selection: 1 month, 3 months, 6 months, 1 year
* Chart Types: Line, Bar, Area, Pie
* Display Mode: Compact view toggle
* Theme: Dark / Light mode with persistence
* Notifications: Insight notifications and email alerts
* Privacy Controls: Usage analytics and query history

### Dynamic Data Updates

* Automatic dashboard refresh on setting changes
* KPIs and charts scale dynamically with time range
* User preferences persisted in backend and restored on reload

---

## Dedicated Analytics Pages

* **KPI Overview** – High-level metrics dashboard
* **Trend Analysis** – Dedicated trend analysis page with detailed charts
* **Breakdown Analysis** – Step-by-step regional breakdown insights
* **Saved Insights** – Persisted insight history

Navigation is seamless and state-aware.

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
│   ├── routes/
│   │   ├── settings.py
│   │   └── insights.py
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
│   │   ├── pages/
│   │   │   ├── TrendAnalysis.tsx
│   │   │   ├── Breakdown.tsx
│   │   │   └── Index.tsx
│   │   ├── lib/api.ts
│   │   └── App.tsx
│   └── index.html
│
├── .gitignore
└── README.md
```

---

## Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# or
source venv/bin/activate    # macOS/Linux

pip install -r requirements.txt
uvicorn backend.api:app --host 127.0.0.1 --port 8000 --reload
```

API available at:

* [http://127.0.0.1:8000](http://127.0.0.1:8000)
* Swagger Docs: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## What This Project Demonstrates

* Enterprise-grade AI system design
* Autonomous multi-agent workflows
* Analytics governance and safety
* Deterministic and explainable AI behavior
* Frontend–backend AI integration
* Settings-driven analytics dashboards
* Persistent user preferences
* Multi-page analytics application

---

## Future Enhancements

* Advanced drill-down and filtering
* Real-time data streaming
* Custom dashboard layouts
* Export functionality (PDF, CSV)
* Authentication and role-based access
* Cloud data warehouse integration
* Advanced visualizations
* Collaboration and insight sharing
* Mobile responsiveness
* Performance monitoring

---

## Contributing

1. Fork the repository
2. Create a feature branch

   ```bash
   git checkout -b feature/your-feature
   ```
3. Commit your changes

   ```bash
   git commit -m "Add new feature"
   ```
4. Push to your branch

   ```bash
   git push origin feature/your-feature
   ```
5. Open a Pull Request

---

## License

This project is licensed under the **MIT License**.

---

## Author

**Aman N Shah**
AI and Data Analytics Engineer

* GitHub: [https://github.com/Amans-sky](https://github.com/Amans-sky)
* LinkedIn: [www.linkedin.com/in/aman-n-shah-601a30266]

