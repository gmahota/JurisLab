import type { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import { storage } from '../../server/storage';

const router = createRouter<NextApiRequest, NextApiResponse>();

// Get recent documents
router.get(async (req, res) => {
  try {
    const recentDocuments = await storage.getRecentDocuments();
    return res.status(200).json(recentDocuments);
  } catch (error) {
    console.error('Error fetching recent documents:', error);
    return res.status(500).json({ error: 'Failed to fetch recent documents' });
  }
});

export default router.handler({
  onError: (err, req, res) => {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});