import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@db';
import { judicialDecisions } from '@shared/schema';
import { eq } from 'drizzle-orm';
import { openaiService } from '../../../server/services/openai-service';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { id } = req.query;
    
    if (!id || Array.isArray(id)) {
      return res.status(400).json({ message: 'Invalid decision ID' });
    }

    const decisionId = parseInt(id, 10);
    
    if (isNaN(decisionId)) {
      return res.status(400).json({ message: 'Invalid decision ID format' });
    }

    // Fetch the judicial decision
    const decision = await db.query.judicialDecisions.findFirst({
      where: eq(judicialDecisions.id, decisionId)
    });

    if (!decision) {
      return res.status(404).json({ message: 'Judicial decision not found' });
    }

    // Use OpenAI service to analyze the decision
    const analysis = await openaiService.analyzeJudicialDecision(decision);

    // Return the analysis
    return res.status(200).json(analysis);
  } catch (error) {
    console.error('Error analyzing judicial decision:', error);
    return res.status(500).json({ 
      message: 'An error occurred while analyzing the judicial decision',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}