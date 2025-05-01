import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@db';
import { judicialDecisions, laborContracts } from '@shared/schema';
import { desc } from 'drizzle-orm';
import { openaiService } from '../../../server/services/openai-service';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Fetch recent judicial decisions (last 20)
    const recentDecisions = await db.query.judicialDecisions.findMany({
      orderBy: [desc(judicialDecisions.createdAt)],
      limit: 20
    });

    // Fetch recent labor contracts (last 20)
    const recentContracts = await db.query.laborContracts.findMany({
      orderBy: [desc(laborContracts.createdAt)],
      limit: 20
    });

    // If no recent documents, return a basic response
    if (recentDecisions.length === 0 && recentContracts.length === 0) {
      return res.status(200).json({
        emergingTrends: [
          { title: "No Data Available", content: "There are no recent documents to analyze for trends.", trend: "neutral" as const }
        ],
        topTopics: [
          { name: "No Data", percentage: 100 }
        ],
        industrySummary: "Insufficient data to generate industry summary. Please add more documents to the system."
      });
    }

    // Use OpenAI service to identify legal trends
    const trends = await openaiService.identifyLegalTrends(recentDecisions, recentContracts);

    // Return the trends analysis
    return res.status(200).json(trends);
  } catch (error) {
    console.error('Error analyzing legal trends:', error);
    return res.status(500).json({ 
      message: 'An error occurred while analyzing legal trends',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}