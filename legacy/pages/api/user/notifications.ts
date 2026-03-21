import type { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import { storage } from '../../../server/storage';

const router = createRouter<NextApiRequest, NextApiResponse>();

// Get user notifications
router.get(async (req, res) => {
  try {
    // For now, we'll use a hardcoded user ID since authentication is not implemented
    const userId = 1;
    const notifications = await storage.getUserNotifications(userId);
    return res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching user notifications:', error);
    return res.status(500).json({ error: 'Failed to fetch user notifications' });
  }
});

export default router.handler({
  onError: (err, req, res) => {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});