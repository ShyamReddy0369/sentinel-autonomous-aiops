# Sentinel AI Ops



Enterprise Agentic AI Platform
for Autonomous Infrastructure Monitoring,
Incident Detection, Root Cause Analysis,
and Intelligent Remediation

## Why this project is different

- **Real chaos engineering, not a toy demo.** A fault-injection engine
  simulates realistic failure modes (memory leaks, bad deploys, DB pool
  exhaustion, cascading errors), so the agents have to diagnose something
  genuinely non-trivial — not just answer a canned prompt.
- **Transparent multi-agent reasoning.** Every agent's decision, confidence,
  and handoff is visible live in the console, not hidden behind a single
  chat response.
- **Tunable autonomy.** A "trust" setting controls which risk tiers the
  system can act on automatically vs. route to a human — a real AI
  governance design decision, not a gimmick.
- **Genuine PL/SQL engineering.** Incident state transitions, the audit
  trail, and reporting views are enforced in the database itself via
  stored procedures and triggers — not just app-side logic wrapped around
  a plain CRUD table.
- **Auto-generated blameless postmortems.** A tangible output with real
  engineering-org value, not just a demo artifact.



---

# Why Sentinel AI Ops?

Unlike traditional monitoring dashboards or simple chatbot demonstrations, Sentinel AI Ops is designed as a realistic software engineering project.

### Key Features

* Simulates real infrastructure telemetry across multiple enterprise services.
* Injects realistic failures including CPU spikes, memory leaks, and cascading failures.
* Continuously evaluates system health using a configurable health engine.
* Automatically creates, tracks, and resolves operational incidents.
* Provides REST APIs for external applications and dashboards.
* Uses a repository architecture that supports both in-memory and Oracle persistence.
* Supports multi-agent AI workflows for diagnosis, planning, remediation, and reporting.
* Generates operational insights suitable for enterprise incident management.

---

# Architecture

```text
                 Sentinel AI Ops

                +-------------------+
                | Infrastructure    |
                |   Simulator       |
                +-------------------+
                          |
                          v
                +-------------------+
                | Telemetry Engine  |
                +-------------------+
                          |
                          v
                +-------------------+
                | Health Engine     |
                +-------------------+
                          |
                          v
                +-------------------+
                | Incident Service  |
                +-------------------+
                          |
                          v
                +-------------------+
                | Repository Layer  |
                +-------------------+
                    |           |
                    |           |
                    v           v
             Memory Repository  Oracle Repository
                    |
                    v
                +-------------------+
                | Flask REST API    |
                +-------------------+
                          |
                          v
                +-------------------+
                | AI Agent Layer    |
                +-------------------+
                          |
                          v
                +-------------------+
                | Dashboard / UI    |
                +-------------------+
```

---

# Current Features

## Infrastructure Simulation

* Digital infrastructure simulator
* Live telemetry generation
* Multi-service simulation
* Configurable simulation cycles

## Chaos Engineering

* CPU spike simulation
* Memory leak simulation
* Service degradation
* Fault injection engine

## Health Monitoring

* Health score calculation
* Healthy / Warning / Critical classification
* Configurable evaluation logic

## Incident Management

* Automatic incident detection
* Duplicate prevention
* Incident lifecycle management
* Active incident tracking
* Automatic incident resolution

## Backend Services

* Flask REST API
* Shared service architecture
* Repository pattern implementation
* JSON-based API responses

## Database

* Oracle Database schema
* PL/SQL procedures
* Triggers
* Views
* Seed data
* Smoke tests

---

# Technology Stack

## Backend

* Python 3.11+
* Flask

## Database

* Oracle Database
* PL/SQL
* python-oracledb (planned integration)

## AI

* Anthropic Claude API
* Multi-Agent Architecture

## Frontend

* HTML
* CSS
* JavaScript
* Streamlit

## DevOps

* Git
* GitHub
* Docker (planned)

---

# Project Structure

```text
backend/
│
├── agents/
├── api/
├── chaos_engine/
├── core/
├── repository/
├── db/
├── services/
├── tests/
│
database/
│
docs/
```

---

# Current Progress

| Module                 | Status |
| ---------------------- | :----: |
| Project Structure      |    ✅   |
| Telemetry Engine       |    ✅   |
| Chaos Engine           |    ✅   |
| Health Engine          |    ✅   |
| Incident Lifecycle     |    ✅   |
| Repository Layer       |    ✅   |
| Flask REST API         |    ✅   |
| Oracle Database Schema |    ✅   |
| AI Agent Framework     |   🚧   |
| Streamlit Dashboard    |   🚧   |
| Mission Control UI     |   🚧   |
| Oracle Integration     |   🚧   |
| Docker Deployment      |   🚧   |

---

# Running the Project

## Clone the Repository

```bash
git clone https://github.com/<your-username>/Sentinel-incident-commander.git
cd Sentinel-incident-commander
```

## Create Virtual Environment

```bash
python -m venv venv
```

### Windows

```bash
venv\Scripts\activate
```

### Linux / macOS

```bash
source venv/bin/activate
```

## Install Dependencies

```bash
pip install -r requirements.txt
```

## Start the Backend

```bash
python -m backend.api.app
```

The backend will start on:

```
http://127.0.0.1:5000/
```

Available endpoints:

```
GET /
GET /incidents
GET /incidents/open
```

---

# Development Roadmap

* ✅ Phase 0 — Project Setup
* ✅ Phase 1 — Core Infrastructure Simulation
* ✅ Phase 2 — Health Monitoring & Incident Management
* 🚧 Phase 3 — Shared Services & Flask API
* 🚧 Phase 4 — Oracle Database Integration
* 🚧 Phase 5 — AI Multi-Agent Orchestration
* 🚧 Phase 6 — Mission Control Dashboard
* 🚧 Phase 7 — Streamlit Operations Dashboard
* 🚧 Phase 8 — Docker Deployment & Production Readiness

---

# Future Enhancements

* Root Cause Analysis Agent
* Intelligent Remediation Agent
* Incident Summarization Agent
* Automatic Postmortem Generation
* Real-time Event Streaming (SSE)
* Slack / Teams Integration
* Kubernetes Deployment
* Grafana Integration

---

# License

This project is developed for educational and portfolio purposes.

---

**Sentinel AI Ops** demonstrates modern software engineering principles including clean architecture, repository pattern, RESTful APIs, chaos engineering, observability, and agentic AI orchestration.
