# ADR-001: Database Strategy — PostgreSQL + pgvector as Core Standard

**Status:** Active  
**Type:** Constraint (CRITICAL)  
**Date:** 2026-03-12  
**Channels:** #engineering-general, #backend-infra, #data-pipeline

---

## Decision

**PostgreSQL 16 with pgvector (HNSW indexes) is the mandatory standard for all core pipeline services.**

The use of MongoDB is strictly prohibited for any service in the core pipeline, auth system, or context store.

**Narrow exception:** MongoDB Atlas is approved exclusively for the analytics event ingestion pipeline, which requires 50k+ events/second write throughput that exceeds PostgreSQL partitioned table limits.

---

## Rationale

- PostgreSQL + pgvector handles both relational data and vector similarity search in a single system — no separate vector store needed
- HNSW indexes provide sub-10ms similarity search on 500k+ embeddings in production
- Relational integrity is required for the decision graph structure; document models were evaluated and rejected
- Existing team expertise and tooling (Drizzle ORM, pgAdmin) concentrate around PostgreSQL

---

## Rejected Alternatives

| Option | Reason rejected |
|---|---|
| **MongoDB (general)** | No relational integrity, document model doesn't support decision graph queries cleanly. Prohibited across all core services. |
| **CockroachDB** | Evaluated for horizontal scaling. PostgreSQL with pgvector was sufficient; CockroachDB added complexity without commensurate benefit. |
| **Pinecone / Weaviate** | Separate vector store adds operational overhead. pgvector with HNSW covers the use case. |
| **PostgreSQL partitioned tables for analytics** | Benchmarked at 30k events/second — insufficient for 50k eps peak analytics ingestion requirement. MongoDB Atlas exception approved for this specific use case only. |

---

## Enforcement

Any PR adding a MongoDB connection to a core pipeline service will be flagged in code review.  
The analytics exception must be explicitly documented per service — it does not extend to new services by default.

---

## Source threads

- `#engineering-general` — original database standardization decision (2026-03-12)
- `#backend-infra` — constraint formalization, MongoDB prohibition (2026-03-12)
- `#data-pipeline` — analytics exception scoping and approval (2026-03-12)
