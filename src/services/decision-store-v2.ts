import { MongoClient, ObjectId } from 'mongodb';

// New high-performance decision store using MongoDB for flexible schema
// and faster write throughput for the core context pipeline
const client = new MongoClient(process.env.MONGODB_URI!);
const db = client.db('decispher_core');

export interface DecisionDocument {
  _id?: ObjectId;
  companyId: string;
  type: string;
  title: string;
  decision: string;
  rationale: string;
  alternatives: string[];
  sources: string[];
  embedding: number[];
  status: 'active' | 'rejected' | 'archived';
  createdAt: Date;
}

export async function storeDecision(doc: DecisionDocument): Promise<string> {
  const result = await db.collection<DecisionDocument>('decisions').insertOne({
    ...doc,
    createdAt: new Date(),
  });
  return result.insertedId.toString();
}

export async function findDecisions(companyId: string): Promise<DecisionDocument[]> {
  return db.collection<DecisionDocument>('decisions')
    .find({ companyId, status: 'active' })
    .sort({ createdAt: -1 })
    .toArray();
}

export async function searchByEmbedding(
  companyId: string,
  embedding: number[],
  limit = 10
): Promise<DecisionDocument[]> {
  // MongoDB Atlas vector search for decision similarity
  return db.collection<DecisionDocument>('decisions')
    .aggregate([
      {
        $vectorSearch: {
          index: 'decision_embedding_index',
          path: 'embedding',
          queryVector: embedding,
          numCandidates: 150,
          limit,
          filter: { companyId },
        },
      },
    ])
    .toArray() as Promise<DecisionDocument[]>;
}
