import type { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import { storage } from '../../../server/storage';

const router = createRouter<NextApiRequest, NextApiResponse>();

// Get AI-driven insights
router.get(async (req, res) => {
  try {
    const insights = await storage.getRecentAiInsights();
    return res.status(200).json(insights);
  } catch (error) {
    console.error('Error fetching AI insights:', error);
    return res.status(500).json({ error: 'Failed to fetch AI insights' });
  }
});

export default router.handler({
  onError: (err, req, res) => {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});