import { NextApiRequest, NextApiResponse } from 'next';
import { analyticsService } from '../../../server/services/analytics-service';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const comparativeStats = await analyticsService.getComparativeAnalytics();
    
    res.status(200).json(comparativeStats);
  } catch (error) {
    console.error('Error getting comparative analytics:', error);
    res.status(500).json({ 
      message: 'Error fetching comparative analytics data',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}