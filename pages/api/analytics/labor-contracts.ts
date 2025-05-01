import { NextApiRequest, NextApiResponse } from 'next';
import { analyticsService } from '../../../server/services/analytics-service';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { timeframe } = req.query;
    const validTimeframes = ['week', 'month', 'year', 'all'];
    
    const validatedTimeframe = typeof timeframe === 'string' && validTimeframes.includes(timeframe) 
      ? timeframe 
      : 'all';
    
    const stats = await analyticsService.getLaborContractStats(validatedTimeframe);
    
    res.status(200).json(stats);
  } catch (error) {
    console.error('Error getting labor contract analytics:', error);
    res.status(500).json({ 
      message: 'Error fetching analytics data',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}