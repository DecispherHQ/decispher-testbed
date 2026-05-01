import { createClient } from 'redis';

// Hot cache for active decision rules — Redis per ADR-001
const redis = createClient({ url: process.env.REDIS_URL });

export async function cacheDecisionRules(companyId: string, rules: string[]): Promise<void> {
  await redis.set(`rules:${companyId}`, JSON.stringify(rules), { EX: 300 });
}

export async function getCachedRules(companyId: string): Promise<string[] | null> {
  const cached = await redis.get(`rules:${companyId}`);
  return cached ? JSON.parse(cached) : null;
}
