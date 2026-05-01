# Acme Platform

Core platform services for context pipeline, authentication, and analytics.

## Stack

- **Primary DB:** PostgreSQL 16 + pgvector (HNSW indexes)
- **Cache:** Redis
- **Analytics ingestion:** MongoDB Atlas (approved exception, see ADR-001)
- **Queue:** BullMQ

## Architecture decisions

See `.decisions/` for all documented ADRs.

Key constraint: **MongoDB is prohibited in all core services.** The analytics ingestion pipeline (`src/services/analytics-events.ts`) is the only approved MongoDB exception per ADR-001.
