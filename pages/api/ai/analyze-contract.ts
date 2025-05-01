import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@db';
import { laborContracts } from '@shared/schema';
import { eq } from 'drizzle-orm';
import { openaiService } from '../../../server/services/openai-service';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { id } = req.query;
    
    if (!id || Array.isArray(id)) {
      return res.status(400).json({ message: 'Invalid contract ID' });
    }

    const contractId = parseInt(id, 10);
    
    if (isNaN(contractId)) {
      return res.status(400).json({ message: 'Invalid contract ID format' });
    }

    // Fetch the labor contract
    const contract = await db.query.laborContracts.findFirst({
      where: eq(laborContracts.id, contractId)
    });

    if (!contract) {
      return res.status(404).json({ message: 'Labor contract not found' });
    }

    // Use OpenAI service to analyze the contract
    const analysis = await openaiService.analyzeLaborContract(contract);

    // Return the analysis
    return res.status(200).json(analysis);
  } catch (error) {
    console.error('Error analyzing labor contract:', error);
    return res.status(500).json({ 
      message: 'An error occurred while analyzing the labor contract',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}