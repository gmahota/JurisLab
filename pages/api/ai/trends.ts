import type { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import { storage } from '../../../server/storage';

const router = createRouter<NextApiRequest, NextApiResponse>();

// Get AI-driven legal trends analysis
router.get(async (req, res) => {
  try {
    const trends = await storage.getAiTrends();
    return res.status(200).json(trends);
  } catch (error) {
    console.error('Error fetching AI trends:', error);
    return res.status(500).json({ error: 'Failed to fetch AI trends' });
  }
});

export default router.handler({
  onError: (err, req, res) => {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});