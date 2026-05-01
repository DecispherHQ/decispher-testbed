import { Pool } from 'pg';

// Core context storage — PostgreSQL + pgvector per ADR-001
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export interface ContextUnit {
  id: string;
  type: string;
  content: string;
  embedding: number[];
  metadata: Record<string, unknown>;
}

export async function storeContext(unit: ContextUnit): Promise<void> {
  await pool.query(
    `INSERT INTO context_units (id, type, content, embedding, metadata)
     VALUES ($1, $2, $3, $4::vector, $5)
     ON CONFLICT (id) DO UPDATE SET content = EXCLUDED.content`,
    [unit.id, unit.type, unit.content, JSON.stringify(unit.embedding), JSON.stringify(unit.metadata)]
  );
}

export async function searchSimilar(embedding: number[], limit = 10): Promise<ContextUnit[]> {
  const result = await pool.query(
    `SELECT id, type, content, metadata
     FROM context_units
     ORDER BY embedding <=> $1::vector
     LIMIT $2`,
    [JSON.stringify(embedding), limit]
  );
  return result.rows;
}
