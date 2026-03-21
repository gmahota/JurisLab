import type { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import { storage } from '../../../../server/storage';

const router = createRouter<NextApiRequest, NextApiResponse>();

// Increment download count for a labor contract
router.post(async (req, res) => {
  try {
    const id = req.query.id as string;
    await storage.incrementContractDownloads(parseInt(id));
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error incrementing downloads:', error);
    return res.status(500).json({ error: 'Failed to increment downloads' });
  }
});

export default router.handler({
  onError: (err, req, res) => {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});