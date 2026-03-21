import type { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import { storage } from '../../../server/storage';

const router = createRouter<NextApiRequest, NextApiResponse>();

// Get dashboard statistics
router.get(async (req, res) => {
  try {
    const stats = await storage.getDashboardStats();
    return res.status(200).json(stats);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

export default router.handler({
  onError: (err, req, res) => {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});