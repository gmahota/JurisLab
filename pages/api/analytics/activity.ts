import { NextApiRequest, NextApiResponse } from 'next';
import { analyticsService } from '../../../server/services/analytics-service';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { timeperiod } = req.query;
    const validTimeperiods = ['week', 'month', 'year'];
    
    const validatedTimeperiod = typeof timeperiod === 'string' && validTimeperiods.includes(timeperiod) 
      ? timeperiod 
      : 'week';
    
    const activityMetrics = await analyticsService.getActivityMetrics(validatedTimeperiod);
    
    res.status(200).json(activityMetrics);
  } catch (error) {
    console.error('Error getting activity metrics:', error);
    res.status(500).json({ 
      message: 'Error fetching activity metrics',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}