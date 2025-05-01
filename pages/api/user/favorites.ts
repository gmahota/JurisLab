import type { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import { storage } from '../../../server/storage';

const router = createRouter<NextApiRequest, NextApiResponse>();

// Get user favorites
router.get(async (req, res) => {
  try {
    // For now, we'll use a hardcoded user ID since authentication is not implemented
    const userId = 1;
    const favorites = await storage.getUserFavorites(userId);
    return res.status(200).json(favorites);
  } catch (error) {
    console.error('Error fetching user favorites:', error);
    return res.status(500).json({ error: 'Failed to fetch user favorites' });
  }
});

// Toggle a user favorite
router.post(async (req, res) => {
  try {
    // For now, we'll use a hardcoded user ID since authentication is not implemented
    const userId = 1;
    const { documentId, documentType } = req.body;
    
    if (!documentId || !documentType) {
      return res.status(400).json({ error: 'Missing required parameters: documentId or documentType' });
    }
    
    await storage.toggleUserFavorite({
      userId,
      documentId,
      documentType
    });
    
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error toggling user favorite:', error);
    return res.status(500).json({ error: 'Failed to toggle user favorite' });
  }
});

export default router.handler({
  onError: (err, req, res) => {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});