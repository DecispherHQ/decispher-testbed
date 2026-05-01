<!-- DECISION-DEC-E90978 -->
## Decision: Migrate email service to Zoho and update SMTP infrastructure

**Status**: Active  
**Date**: 2026-04-28  
**Severity**: Critical

**Files**:
- `infrastructure/mail`
- `services/smtp`
- `config/email_routing`

**Rules**:
```json
{
  "conditions": [
    {
      "type": "file",
      "pattern": "{infrastructure/mail/**,services/smtp/**,config/email_routing/**}",
      "content_rules": [
        {
          "mode": "regex",
          "pattern": "(legacy_smtp|smtp_old|old_mail_server)",
          "patterns": [
            "legacy_smtp",
            "smtp_old"
          ]
        }
      ]
    }
  ],
  "match_mode": "any"
}
```

### Context

**Problem:** Need to replace the existing webmaster mailing service and transition away from the current SMTP server.

**Decision:** Migrate all email services to Zoho and update the SMTP server infrastructure, including the implementation of new routing rules to block any traffic to the legacy SMTP server.

**Rationale:** The team decided to move to Zoho to consolidate mailing services and address the limitations or overhead associated with the existing legacy SMTP infrastructure.

---

<!-- DECISION-DEC-BD1748 -->
## Decision: Migrate from Shipsy to in-house mapping event system

**Status**: Active  
**Date**: 2026-04-26  
**Severity**: Critical

**Files**:
- `services/shipping-integration`
- `infrastructure/event-bus`

### Context

**Problem:** Dependency on third-party provider Shipsy is causing scalability issues.

**Decision:** Switch from the third-party Shipsy provider to an in-house developed mapping event system.

**Rationale:** The team identified that the Shipsy service was negatively impacting the platform's scalability, and moving to an internal solution reduces external dependencies.

**Alternatives Considered:**
- **Continue using Shipsy**: It acts as a bottleneck for system scalability.

---

<!-- DECISION-DEC-D01A8D -->
## Decision: Abandon RFC 7807 for error responses

**Status**: Active  
**Date**: 2026-04-22  
**Severity**: Critical

**Files**:
- `api/responses`
- `api/error-handling`

**Rules**:
```json
{
  "conditions": [
    {
      "type": "file",
      "pattern": "api/responses/**/*",
      "content_rules": [
        {
          "mode": "string",
          "patterns": [
            "application/problem+json",
            "type",
            "title",
            "status",
            "detail",
            "instance"
          ]
        }
      ]
    },
    {
      "type": "file",
      "pattern": "api/error-handling/**/*",
      "content_rules": [
        {
          "mode": "string",
          "patterns": [
            "application/problem+json",
            "type",
            "title",
            "status",
            "detail",
            "instance"
          ]
        }
      ]
    }
  ],
  "match_mode": "any"
}
```

### Context

**Problem:** The current API error handling standard (RFC 7807) is considered outdated for the team's needs.

**Decision:** We have decided to officially discontinue the use of RFC 7807 (Problem Details for HTTP APIs) for all API error responses moving forward.

**Rationale:** The team determined that the RFC 7807 specification is outdated and no longer aligns with the current requirements and standards of the API architecture.

---

<!-- DECISION-DEC-F3DB51 -->
## Decision: Standardize on HNSW for new vector indexes

**Status**: Active  
**Date**: 2026-04-22  
**Severity**: Warning

**Files**:
- `db/schema/vector_indexes`
- `db/migrations/sprint_16/migrate_llm_cache_to_hnsw`

**Rules**:
```json
{
  "conditions": [
    {
      "type": "file",
      "pattern": "db/schema/vector_indexes",
      "content_rules": [
        {
          "mode": "regex",
          "start": 0,
          "pattern": "USING\\s+(IVFFLAT|IVFFLAT\\s+)"
        }
      ]
    },
    {
      "type": "file",
      "pattern": "db/migrations/sprint_16/migrate_llm_cache_to_hnsw",
      "content_rules": [
        {
          "mode": "regex",
          "start": 0,
          "pattern": "CREATE\\s+INDEX.*USING\\s+IVFFLAT"
        }
      ]
    }
  ],
  "match_mode": "any"
}
```

### Context

**Problem:** Uncertainty regarding whether the rejection of IVFFlat to HNSW migration applied to the index technology choice or the migration process itself.

**Decision:** All new vector indexes must be created using the HNSW algorithm. Existing IVFFlat indexes (specifically in the llm_cache table) are to be migrated to HNSW in Sprint 16.

**Rationale:** HNSW is the current architectural standard for vector indexing. The previous rejection of the migration to HNSW was due to operational risks in production, not a lack of performance or technical suitability of HNSW.

**Alternatives Considered:**
- **IVFFlat**: The team has standardized on HNSW for new indexes to maintain architectural consistency, despite potential performance profiles for specific query patterns.

---

<!-- DECISION-CONV-17F772 -->
## Decision: Establish authoritative RFC 7807 error format convention

**Status**: Active  
**Date**: 2026-04-22  
**Severity**: Warning

**Files**:
- `packages/api/src/plugins/error-handler.ts`

**Rules**:
```json
{
  "conditions": [
    {
      "type": "file",
      "pattern": "packages/api/src/plugins/error-handler.ts",
      "content_rules": [
        {
          "mode": "regex",
          "start": 0,
          "pattern": "(?s)^(?!.*(type|title|status|detail|instance)).*$"
        }
      ]
    }
  ],
  "match_mode": "all"
}
```

### Context

**Problem:** Duplicate and conflicting conventions regarding RFC 7807 error format severity were documented in the Decispher system.

**Decision:** Adopt the HIGH severity specification as the authoritative version for the RFC 7807 error format, which includes fields: type, title, status, detail, and instance.

**Rationale:** The team identified that two existing conventions were redundant. Designating the HIGH severity entry as canonical while allowing the fusion engine to merge duplicate references ensures consistency across documentation and API implementations.

**Alternatives Considered:**
- **MEDIUM severity specification**: The HIGH severity version was explicitly selected as the authoritative and canonical standard.

---

<!-- DECISION-OWN-08631B -->
## Decision: Establish ownership and modification constraints for credits and billing system

**Status**: Active  
**Date**: 2026-04-22  
**Severity**: Critical

**Files**:
- `packages/api/src/routes/credits.ts`
- `packages/decision-store/src/repositories/credit-repository.ts`
- `packages/common/src/types/credits.ts`

**Rules**:
```json
{
  "conditions": [
    {
      "type": "file",
      "pattern": "packages/{api/src/routes/credits.ts,decision-store/src/repositories/credit-repository.ts,common/src/types/credits.ts}",
      "content_rules": [
        {
          "mode": "regex",
          "start": 1,
          "pattern": "(credit_ledger|DrizzleCreditRepository|EFFORT_MODE_CONFIGS)"
        }
      ]
    }
  ],
  "match_mode": "all"
}
```

### Context

**Problem:** Uncertainty regarding ownership of the billing module and the requirements for implementing new effort modes.

**Decision:** Sara is the primary owner of the billing module; all changes to the credit_ledger schema, DrizzleCreditRepository, and the EFFORT_MODE_CONFIGS require specific approvals from Sara and Ali. Furthermore, the system must strictly adhere to the append-only ledger constraint per ADR-019 and maintain SERIALIZABLE transaction requirements.

**Rationale:** To ensure accountability and maintain architectural integrity of the financial ledger and billing configuration, specific code ownership and structural constraints have been formalized.

---

<!-- DECISION-DEC-AC87F0 -->
## Decision: Define Model Fallback Ordering Strategy for API Rate Limits

**Status**: Active  
**Date**: 2026-04-22  
**Severity**: Critical

**Files**:
- `src/llm/client_factory.py`
- `src/llm/fallback_logic.py`

**Rules**:
```json
{
  "conditions": [
    {
      "type": "file",
      "pattern": "src/llm/{client_factory,fallback_logic}.py",
      "content_rules": [
        {
          "mode": "regex",
          "start": 0,
          "pattern": "(?i)fallback"
        }
      ],
      "content_match_mode": "all"
    }
  ],
  "match_mode": "all"
}
```

### Context

**Problem:** Handling 429 rate limit errors from LLM providers during extraction and detection tasks.

**Decision:** Establish explicit provider fallback orderings: For extraction, use Anthropic → DeepSeek → OpenAI. For detection, use Google → OpenAI → DeepSeek.

**Rationale:** To maintain system reliability and avoid task failure when individual LLM providers hit rate limits, a hierarchical fallback mechanism ensures work is diverted to alternative models before resorting to the Dead Letter Queue (DLQ) after retries.

---

<!-- DECISION-DEC-ADD28E -->
## Decision: Migrate infrastructure orchestration from AWS ECS to AWS EKS

**Status**: Active  
**Date**: 2026-04-22  
**Severity**: Critical

**Files**:
- `infrastructure/terraform`
- `infrastructure/k8s`

**Rules**:
```json
{
  "conditions": [
    {
      "type": "file",
      "pattern": "infrastructure/terraform/**/*",
      "content_rules": [
        {
          "mode": "string",
          "patterns": [
            "aws_ecs_cluster",
            "aws_ecs_service",
            "aws_ecs_task_definition"
          ]
        }
      ],
      "content_match_mode": "any"
    }
  ],
  "match_mode": "any"
}
```

### Context

**Problem:** AWS ECS lacks built-in support for multi-region failover without complex custom routing and requires additional tooling for advanced scaling capabilities.

**Decision:** The team will migrate from AWS ECS to AWS EKS for container orchestration.

**Rationale:** EKS provides superior orchestration flexibility, including native Horizontal Pod Autoscaler and improved multi-AZ/multi-region failover capabilities, which are necessary for the current scale, outweighing the operational overhead of Kubernetes.

**Alternatives Considered:**
- **AWS ECS**: Lacks sufficient multi-region failover support and requires custom routing implementations.
- **Railway**: Retained only as a temporary fallback, deemed insufficient for long-term production orchestration.

---

<!-- DECISION-DEC-75490C -->
## Decision: Use cosine distance for pgvector similarity searches

**Status**: Active  
**Date**: 2026-04-22  
**Severity**: Warning

**Rules**:
```json
{
  "conditions": [
    {
      "type": "file",
      "pattern": "**/*.sql",
      "content_rules": [
        {
          "mode": "regex",
          "start": 0,
          "pattern": "<->"
        }
      ]
    }
  ],
  "match_mode": "all"
}
```

### Context

**Problem:** Determine the optimal distance metric for embedding similarity search in pgvector to maximize recall.

**Decision:** We have standardized on cosine distance (using the <=> operator in pgvector) for all similarity search operations.

**Rationale:** Cosine distance provides significantly better recall (12% improvement) on normalized text embeddings compared to L2 distance. Furthermore, L2 distance is overly sensitive to embedding magnitude, making it less reliable for our specific use case.

**Alternatives Considered:**
- **L2 distance**: It is sensitive to embedding magnitude and demonstrated poorer recall compared to cosine distance for our data.

---

<!-- DECISION-DEC-A06BAC -->
## Decision: Use MongoDB Atlas for analytics event ingestion

**Status**: Active  
**Date**: 2026-04-22  
**Severity**: Warning

**Files**:
- `analytics/storage`
- `infrastructure/database-policy`

**Rules**:
```json
{
  "conditions": [
    {
      "type": "file",
      "pattern": "{analytics/storage/**,infrastructure/database-policy/**}",
      "content_rules": [
        {
          "mode": "regex",
          "start": 0,
          "pattern": "mongodb|mongoclient|mongodb-driver"
        }
      ],
      "content_match_mode": "any"
    }
  ],
  "match_mode": "any"
}
```

### Context

**Problem:** The team needs a high-throughput storage solution for analytics event ingestion, but is restricted to PostgreSQL and Redis for general data storage.

**Decision:** MongoDB is strictly prohibited for use in core pipeline services (including the core decision pipeline, authentication, and the context store). These services must exclusively use PostgreSQL 16 and Redis. Any deviation requires a formal ADR.

**Rationale:** To maintain architectural integrity and prevent fragmentation in the core tech stack. Previous attempts to introduce MongoDB for event queues nearly caused instability, highlighting the need for a hard, enforceable constraint.

**Alternatives Considered:**
- **PostgreSQL partitioned tables**: The team expressed concern that it may struggle with the required write throughput of 50k events per second.

---

<!-- DECISION-CNST-8D7300 -->
## Decision: Prohibit MongoDB and mandate PostgreSQL for core pipelines

**Status**: Active  
**Date**: 2026-04-22  
**Severity**: Critical

**Files**:
- `infrastructure/database`
- `src/db/config.ts`

**Rules**:
```json
{
  "conditions": [
    {
      "type": "file",
      "pattern": "{infrastructure/database/**,src/db/config.ts}",
      "content_rules": [
        {
          "mode": "string",
          "patterns": [
            "mongodb",
            "mongoose",
            "mongo"
          ]
        }
      ]
    }
  ],
  "match_mode": "all"
}
```

### Context

**Problem:** Need to define and enforce the database technology stack to ensure system consistency and data integrity.

**Decision:** The core pipeline must exclusively use PostgreSQL 16 with pgvector and Redis; the use of MongoDB is strictly prohibited.

**Rationale:** Enforcing a specific database stack ensures architectural consistency, simplifies maintenance, and leverages existing infrastructure and expertise with PostgreSQL and pgvector.

**Alternatives Considered:**
- **MongoDB**: Prohibited to maintain stack consistency and data integrity requirements.

---

<!-- DECISION-DEC-811451 -->
## Decision: Standardize on PostgreSQL with pgvector for primary storage and vector search

**Status**: Active  
**Date**: 2026-04-22  
**Severity**: Critical

**Rules**:
```json
{
  "conditions": [
    {
      "type": "file",
      "pattern": "**/*",
      "content_rules": [
        {
          "mode": "regex",
          "start": 1,
          "pattern": "(?i)(mongodb|cockroachdb|elasticsearch|pinecone)",
          "patterns": [
            "mongodb",
            "cockroachdb",
            "elasticsearch",
            "pinecone"
          ]
        }
      ]
    }
  ],
  "match_mode": "all"
}
```

### Context

**Problem:** Selecting the primary datastore to handle both standard relational data and vector search requirements efficiently.

**Decision:** Use PostgreSQL with pgvector and HNSW indexes as the standard solution for primary datastore and vector search operations.

**Rationale:** PostgreSQL with pgvector provides the ability to manage both SQL-based relational data and vector search capabilities within a single system, simplifying the architecture compared to managing separate databases.

**Alternatives Considered:**
- **MongoDB**: The team preferred the relational capabilities of PostgreSQL and the unified support for vector search provided by pgvector.
- **CockroachDB**: The team decided that PostgreSQL with pgvector was sufficient and preferred over the complexity or features offered by CockroachDB.

---

<!-- DECISION-DEC-3213C5 -->
## Decision: Use MongoDB Atlas for schemaless analytics webhook storage

**Status**: Active  
**Date**: 2026-04-19  
**Severity**: Critical

**Files**:
- `services/analytics-webhook-handler`
- `infrastructure/database-clusters`

**Rules**:
```json
{
  "conditions": [
    {
      "type": "file",
      "pattern": "services/analytics-webhook-handler/**",
      "content_rules": [
        {
          "mode": "string",
          "patterns": [
            "INSERT INTO",
            "UPDATE ",
            "pg_query"
          ]
        }
      ]
    },
    {
      "type": "file",
      "pattern": "infrastructure/database-clusters/**",
      "content_rules": [
        {
          "mode": "regex",
          "start": 0,
          "pattern": "postgresql"
        }
      ]
    }
  ],
  "match_mode": "any"
}
```

### Context

**Decision:** Use MongoDB Atlas specifically for the analytics event ingestion pipeline, while keeping all other core application data in PostgreSQL.

**Rationale:** MongoDB Atlas provides the necessary horizontal sharding and schemaless structure to handle the required 50k write operations per second, whereas PostgreSQL performance degrades under this load.

**Alternatives Considered:**
- **PostgreSQL JSONB**: Proved too difficult and inefficient to index effectively for schemaless event data.

---

<!-- DECISION-HIST-7B6D8F -->
## Decision: Abandoning EventStoreDB for monorepo event handling

**Status**: Active  
**Date**: 2026-04-19  
**Severity**: Warning

**Rules**:
```json
{
  "conditions": [
    {
      "type": "file",
      "pattern": "**/*",
      "content_rules": [
        {
          "mode": "string",
          "patterns": [
            "EventStoreDB",
            "EventStore",
            "event-sourcing"
          ]
        }
      ]
    }
  ],
  "match_mode": "any"
}
```

### Context

**Problem:** The team was experiencing excessive operational overhead and complexity managing EventStoreDB for event sourcing, which did not provide enough value regarding auditability at their current scale.

**Decision:** The team decided to discontinue the use of EventStoreDB and removed event sourcing as an architectural pattern following the migration back to a monorepo.

**Rationale:** The complexity of maintaining three separate runbooks for EventStoreDB operations outweighed the benefits of its auditability features for the current team size and system scale.

**Alternatives Considered:**
- **Retaining EventStoreDB for event sourcing**: The operational complexity was too high and not justified by the benefits gained.

---

<!-- DECISION-CONV-D17917 -->
## Decision: Enforce RFC 7807 for Internal API Error Formats

**Status**: Active  
**Date**: 2026-04-18  
**Severity**: Warning

**Files**:
- `packages/api/src/routes/internal/`

### Context

**Problem:** Internal API routes are returning plain strings instead of adhering to the RFC 7807 error format, which breaks AI tools that parse our errors due to inconsistent formats.

**Decision:** All internal API routes must adhere to the RFC 7807 error format, consistent with public-facing API routes.

**Rationale:** Inconsistent error formats, specifically plain strings from internal routes, prevent AI tools from reliably parsing and analyzing errors, leading to broken analysis workflows.

---

<!-- DECISION-DEC-465C1E -->
## Decision: Use MongoDB for Analytics Events Pipeline

**Status**: Active  
**Date**: 2026-04-18  
**Severity**: Critical

**Files**:
- `packages/api/src/analytics/`

**Rules**:
```json
{
  "conditions": [
    {
      "type": "file",
      "exclude": [
        "packages/api/src/analytics/**/*.test.{ts,js,go,py}",
        "packages/api/src/analytics/migrations/**/*"
      ],
      "pattern": "packages/api/src/analytics/**/*.{ts,js,go,py}",
      "content_rules": [
        {
          "mode": "string",
          "patterns": [
            "pg",
            "postgres",
            "postgresql",
            "new Client(",
            "createPool(",
            "sequelize",
            "typeorm",
            "knex"
          ]
        }
      ],
      "content_match_mode": "any"
    }
  ],
  "match_mode": "any"
}
```

### Context

**Problem:** PostgreSQL's write throughput is insufficient for high-cardinality analytics event data, failing to meet new scale requirements.

**Decision:** We will use MongoDB for the analytics events pipeline, provisioning a MongoDB Atlas cluster to handle the data.

**Rationale:** MongoDB offers 10x the write throughput compared to PostgreSQL for high-cardinality event data, which is essential to meet the current scale requirements. The previous constraint was established before these new scale demands emerged.

**Alternatives Considered:**
- **PostgreSQL**: PostgreSQL's write throughput is 10x lower than MongoDB for high-cardinality event data, making it unsuitable for the new scale requirements of the analytics pipeline.

---

<!-- DECISION-DEC-3B0624 -->
## Decision: LLM Provider Strategy by Pipeline Step and Effort Mode

**Status**: Active  
**Date**: 2026-04-18  
**Severity**: Critical

**Files**:
- `packages/analyzer/`

### Context

**Decision:** Each LLM pipeline step (detection, extraction, formatting) has its own provider configuration managed via environment variables. An 'effort mode' concept allows overriding these configurations per company at request time, defining specific LLM models for different quality/cost tiers: Saver uses gemini-flash, Balanced mixes gemini-flash, claude-haiku, and gpt-4o-mini, Pro uses claude-sonnet for extraction, and Super uses claude-opus.

**Rationale:** The strategy is designed to provide flexibility and optimization across different pipeline steps and 'effort modes'. By configuring providers per step and allowing overrides based on company effort modes, the system can balance cost, performance, and model quality according to specific requirements, from 'Saver' (likely cost-optimized) to 'Super' (likely highest quality/cost). The multi-provider abstraction facilitates this dynamic selection.

---

<!-- DECISION-DEC-F27705 -->
## Decision: Implementation details for text embeddings in PostgreSQL using OpenAI's text-embedding-3-small and HNSW indexing

**Status**: Active  
**Date**: 2026-04-18  
**Severity**: Warning

**Files**:
- `packages/decision-store/src/schema.ts`

**Rules**:
```json
{
  "conditions": [
    {
      "type": "file",
      "pattern": "packages/decision-store/src/schema.ts",
      "content_rules": [
        {
          "mode": "string",
          "pattern": "text-embedding-3-small"
        },
        {
          "mode": "string",
          "pattern": "1536"
        },
        {
          "mode": "string",
          "pattern": "knowledge_chunks"
        },
        {
          "mode": "string",
          "pattern": "ef_construction=200"
        },
        {
          "mode": "string",
          "pattern": "m=16"
        }
      ],
      "content_match_mode": "all"
    }
  ],
  "match_mode": "all"
}
```

### Context

**Decision:** We will use the `text-embedding-3-small` OpenAI model to generate 1536-dimension embeddings. These embeddings will be stored in the `knowledge_chunks` table within PostgreSQL. The HNSW index used for vector search will be configured with `ef_construction=200` and `m=16`.

**Rationale:** The chosen HNSW parameters (`ef_construction=200` and `m=16`) are set to provide an optimal tradeoff between recall accuracy and search speed. The `text-embedding-3-small` model is selected for generating the text embeddings.

---

<!-- DECISION-DEC-C7CE09 -->
## Decision: We use PostgreSQL with pgvector for all data storage

**Status**: Active  
**Date**: 2026-04-18  
**Severity**: Critical

**Rules**:
```json
{
  "conditions": [
    {
      "type": "file",
      "pattern": "**/*",
      "content_rules": [
        {
          "mode": "regex",
          "start": 0,
          "pattern": "(?i)(mongodb|dynamodb|mongo client|aws dynamodb|cosmosdb)",
          "patterns": []
        }
      ],
      "content_match_mode": "any"
    }
  ],
  "match_mode": "any"
}
```

### Context

**Decision:** After evaluating MongoDB, DynamoDB, and PostgreSQL, we chose PostgreSQL 16 with pgvector HNSW indexes. Reason: vector similarity search, ACID guarantees, and single DB for both structured data and embeddings. 

**Rationale:** After evaluating MongoDB, DynamoDB, and PostgreSQL, we chose PostgreSQL 16 with pgvector HNSW indexes. Reason: vector similarity search, ACID guarantees, and single DB for both structured data and embeddings. 

---

<!-- DECISION-DEC-E14083 -->
## Decision: Use cosine distance over L2 for semantic text embedding similarity with pgvector HNSW

**Status**: Active  
**Date**: 2026-04-18  
**Severity**: Warning

**Rules**:
```json
{
  "conditions": [
    {
      "type": "file",
      "pattern": "**/*",
      "content_rules": [
        {
          "mode": "regex",
          "pattern": "(?i)pgvector|HNSW"
        },
        {
          "mode": "regex",
          "pattern": "(?i)L2_DISTANCE|EUCLIDEAN_DISTANCE|l2_distance|euclidean_distance|distance_type\\s*=\\s*['\\\"]l2['\\\"]|metric\\s*=\\s*['\\\"]l2['\\\"]"
        }
      ],
      "content_match_mode": "all"
    }
  ],
  "match_mode": "all"
}
```

### Context

**Problem:** How to accurately measure semantic similarity of text embeddings for deduplication search using pgvector HNSW?

**Decision:** We decided to use cosine distance for semantic similarity search of text embeddings with pgvector HNSW for deduplication.

**Rationale:** Cosine distance is invariant to vector magnitude, meaning it only considers the direction of vectors. This property is precisely what is desired for semantic similarity of text embeddings, as it allows for accurate comparison of semantic meaning regardless of variations in embedding vector norms. L2 (Euclidean) distance, on the other hand, would incorrectly penalize vectors with different magnitudes, even if they share the same semantic direction.

**Alternatives Considered:**
- **L2 (Euclidean) distance**: L2 distance penalizes vectors with different norms (magnitudes) even if they point in the same semantic direction, which is not suitable for accurately measuring semantic similarity of text embeddings.

---

<!-- DECISION-DEC-FDB948 -->
## Decision: Implement Redis Semantic Caching for LLM Embedding Calls

**Status**: Active  
**Date**: 2026-04-18  
**Severity**: Warning

**Files**:
- `**/*`

### Context

**Problem:** Redundant and inefficient LLM embedding calls were occurring.

**Decision:** Implemented Redis semantic caching for LLM embedding calls. The cache key is a hash of the input text, model, and provider. The cache entries have a Time-To-Live (TTL) of 1 hour.

**Rationale:** Redis was a natural extension since it is already in use for BullMQ and session caching. This implementation reduced redundant embedding calls by approximately 40% in tests.

---

<!-- DECISION-CNST-393329 -->
## Decision: Prohibition of MongoDB in the Tech Stack for Analytics Events

**Status**: Active  
**Date**: 2026-04-18  
**Severity**: Critical

**Rules**:
```json
{
  "conditions": [
    {
      "type": "file",
      "pattern": "**/*",
      "content_rules": [
        {
          "mode": "regex",
          "start": 0,
          "pattern": "(?i)mongo(?:db)?",
          "patterns": []
        }
      ]
    }
  ],
  "match_mode": "all"
}
```

### Context

**Problem:** Considering MongoDB for analytics events due to perceived better write throughput for time-series data and high cardinality event logs.

**Decision:** MongoDB is strictly prohibited from being integrated into the current technology stack, including for analytics events.

**Rationale:** There is an active and non-negotiable architectural constraint against MongoDB in the stack due to the critical requirement for ACID compliance across all billing and user data. MongoDB does not satisfy this fundamental requirement.

**Alternatives Considered:**
- **MongoDB for analytics events**: It violates an active architectural constraint due to its lack of native ACID compliance, which is non-negotiable for billing and user data within our stack.

---

<!-- DECISION-PLAN-71727A -->
## Decision: Plan to Migrate Application Infrastructure from Railway to AWS ECS

**Status**: Active  
**Date**: 2026-04-18  
**Severity**: Critical

**Rules**:
```json
{
  "conditions": [
    {
      "type": "file",
      "pattern": "**/*",
      "content_rules": [
        {
          "mode": "regex",
          "start": 0,
          "pattern": "(?i)(migrate|aws|ecs|railway)"
        }
      ]
    }
  ],
  "match_mode": "any"
}
```

### Context

**Problem:** The current hosting platform, Railway, becomes cost-prohibitive at scale (exceeding $500/month) and lacks the VPC isolation capabilities required for enterprise customers.

**Decision:** The trigger metric for initiating the AWS migration has been adjusted from 20 paying customers to 30 paying customers. The Q3 2026 timeline for the migration still holds.

**Rationale:** This adjustment is due to Railway costs being more predictable than initially expected. Additionally, the VPC isolation requirement, which was a significant factor, only applies to enterprise customers, a segment we are targeting at a later stage.

---

<!-- DECISION-DEC-670907 -->
## Decision: Defer Microservices Adoption, Maintain Monorepo Architecture

**Status**: Active  
**Date**: 2026-04-18  
**Severity**: Critical

**Rules**:
```json
{
  "conditions": [
    {
      "type": "file",
      "pattern": "**/*.{proto,go,ts,js,py,java,cs,yaml,yml,json,Dockerfile}",
      "content_rules": [
        {
          "mode": "regex",
          "start": 0,
          "pattern": "(^|\\W)(new|separate|standalone)\\s+(grpc|microservice|distributed)\\s+(service|api|component|deployment)($|\\W)",
          "patterns": []
        },
        {
          "mode": "regex",
          "start": 0,
          "pattern": "(^|\\W)(recorder|analyzer)\\s+service\\s+(definition|interface|deployment)($|\\W)",
          "patterns": []
        },
        {
          "mode": "string",
          "patterns": [
            "GrpcServiceBuilder",
            "MicroserviceClient",
            "ServiceDiscoveryRegistration",
            "ApiGatewayConfiguration"
          ]
        }
      ],
      "content_match_mode": "any"
    }
  ],
  "match_mode": "any"
}
```

### Context

**Problem:** The team considered adopting a microservices architecture for the recorder and analyzer components but faced challenges.

**Decision:** To defer the adoption of a microservices architecture and continue with a monorepo architecture utilizing shared packages. The decision to revisit microservices will be made when the team size reaches 8 or more members.

**Rationale:** An earlier attempt (Phase 1) to split the recorder and analyzer into separate gRPC services resulted in brutal deployment complexity for a 3-person team. This led to approximately 40% of the team's time being spent debugging inter-service authentication and network failures, making it unmanageable for the current team size.

**Alternatives Considered:**
- **Adopt a microservices architecture by splitting recorder and analyzer into separate gRPC services.**: The previous attempt in Phase 1 led to brutal deployment complexity for a 3-person team, consuming 40% of their time debugging inter-service authentication and network failures.

---

<!-- DECISION-OWN-43A78D -->
## Decision: Ownership of Billing Module

**Status**: Active  
**Date**: 2026-04-18  
**Severity**: Warning

**Files**:
- `packages/api/src/billing/`

**Rules**:
```json
{
  "conditions": [
    {
      "type": "file",
      "pattern": "packages/api/src/billing/**",
      "content_rules": [
        {
          "mode": "string",
          "patterns": [
            "stripe",
            "credit",
            "ledger",
            "invoice",
            "payment",
            "billing"
          ]
        }
      ],
      "content_match_mode": "any"
    }
  ],
  "match_mode": "any"
}
```

### Context

**Decision:** The billing module, including Stripe integration, credit ledger, credit deduction logic, and Stripe webhook handlers, is owned by U05F9P78LTG. All changes to billing flows require their review.

**Rationale:** This statement clarifies responsibility for the billing module and its components to ensure proper review and maintenance.

---

<!-- DECISION-CNST-3998D8 -->
## Decision: Standardize on PostgreSQL and Redis; Prohibit MongoDB

**Status**: Active  
**Date**: 2026-04-18  
**Severity**: Critical

**Rules**:
```json
{
  "conditions": [
    {
      "type": "file",
      "exclude": [
        "**/node_modules/**",
        "**/vendor/**",
        "**/*.lock",
        "**/*.md"
      ],
      "pattern": "**/*",
      "content_rules": [
        {
          "mode": "string",
          "patterns": [
            "mongodb",
            "mongo",
            "mongoose"
          ]
        }
      ],
      "content_match_mode": "any"
    }
  ],
  "match_mode": "any"
}
```

### Context

**Problem:** Ensure ACID compliance for critical billing and user data, and standardize data storage technologies to maintain data integrity and consistency.

**Decision:** MongoDB is strictly prohibited in this stack due to its lack of ACID compliance. PostgreSQL will be used as the primary datastore for all persistent data, especially critical billing and user data. Redis will be used exclusively for caching purposes.

**Rationale:** ACID compliance is a non-negotiable requirement for billing and user data to guarantee data integrity and consistency. PostgreSQL provides robust ACID transaction support. Adopting a standardized approach with PostgreSQL and Redis simplifies the technology stack and enforces critical data integrity requirements.

**Alternatives Considered:**
- **MongoDB**: MongoDB was rejected because it does not provide the necessary ACID compliance required for critical billing and user data, which is a non-negotiable architectural requirement for data integrity.

---

<!-- DECISION-DEC-B6869B -->
## Decision: Define LLM Model Combinations for Saver, Balanced, Pro, and Super Effort Modes

**Status**: Active  
**Date**: 2026-04-18  
**Severity**: Critical

**Files**:
- `**/*`

### Context

**Problem:** We need to lock down exactly which model combination maps to which effort mode.

**Decision:** The specific LLM model combinations for the multi-provider effort modes were finalized: Saver mode uses `gemini-flash` for detection, extraction, and format. Balanced mode uses `gemini-flash` for detection, `claude-haiku` for extraction, and `gpt-4o-mini` for format. Pro mode uses `gemini-flash` for detection, `claude-sonnet` for extraction, and `gpt-4o-mini` for format. Super mode uses `gemini-flash` for detection, `claude-opus` for extraction, and `claude-sonnet` for format.

**Rationale:** The chosen LLM model combinations for each effort mode (Saver, Balanced, Pro, Super) were selected to provide different performance and cost profiles, aligning with the multi-provider strategy. Cost analysis confirmed that the proposed combinations, ranging from ~$0.08/1M tokens for Saver to ~$4.50/1M tokens for Super, ensure fine margins at current credit pricing.

---

<!-- DECISION-DEC-6ACD06 -->
## Decision: Implement Multi-Provider LLM Abstraction for Pipeline Steps with Per-Company Overrides

**Status**: Active  
**Date**: 2026-04-18  
**Severity**: Critical

**Rules**:
```json
{
  "conditions": [
    {
      "type": "file",
      "exclude": [
        "**/*test*",
        "**/*doc*"
      ],
      "pattern": "**/*.(ts|js|py|go|java|cs|yml|yaml|env|ini|properties|json)",
      "content_rules": [
        {
          "mode": "regex",
          "start": 0,
          "pattern": "(new|import|from)[^;\\n]*?(Anthropic|OpenAI|GoogleCloud|AzureOpenAI|Claude|Gemini|GPT-4o)",
          "patterns": []
        },
        {
          "mode": "regex",
          "start": 0,
          "pattern": "(LLM_PROVIDER|LLM_MODEL)[^=\\n]*?=(?!.*(config|abstraction|env))[^\\n]*(Claude-Sonnet|Gemini-Flash|GPT-4o-mini)",
          "patterns": []
        }
      ],
      "content_match_mode": "any"
    }
  ],
  "match_mode": "any"
}
```

### Context

**Problem:** The current LLM provider strategy is unmaintainable, using different providers (Gemini-Flash, Claude-Sonnet, GPT-4o-mini) for different pipeline steps, leading to high costs (Claude-Sonnet is 60% of the bill) and inconsistent availability (Sonnet outages).

**Decision:** We will implement a multi-provider abstraction where each pipeline step (detection, extraction, enrichment, formatting) has its own LLM provider configuration via environment variables. At request time, an 'effort mode' can override the provider selection on a per-company basis.

**Rationale:** This approach allows companies with high context volume (Tier 3+) to pay extra for Claude-Sonnet's accuracy where needed, while companies with tighter budgets can use more cost-effective options like Gemini-Flash for all steps. It also decouples our infrastructure from individual LLM vendor stability and enables independent contract negotiations with different providers (Anthropic, OpenAI, Google).

**Alternatives Considered:**
- **Continue with current fragmented multi-provider setup (Gemini-Flash for detection, Claude-Sonnet for extraction, GPT-4o-mini for formatting).**: This approach is unmaintainable, costly (Claude-Sonnet accounts for 60% of the LLM bill), and suffers from inconsistent provider availability issues.
- **Consolidate to a single LLM provider for all pipeline steps.**: This would limit flexibility, potentially sacrificing accuracy for high-tier companies or forcing budget-conscious companies to pay for more expensive models than necessary. It would also lead to vendor lock-in and a single point of failure for LLM stability.
