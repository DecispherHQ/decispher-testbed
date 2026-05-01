// Analytics event ingestion — MongoDB Atlas exception approved per ADR-001
// ONLY this service is permitted to use MongoDB.
// Do NOT use this pattern in any other service.
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_ATLAS_URI!);

export async function ingestEvent(event: Record<string, unknown>): Promise<void> {
  const db = client.db('analytics');
  await db.collection('events').insertOne({ ...event, _ts: new Date() });
}
