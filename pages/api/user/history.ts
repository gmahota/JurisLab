import type { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import { storage } from '../../../server/storage';

const router = createRouter<NextApiRequest, NextApiResponse>();

// Get user history
router.get(async (req, res) => {
  try {
    // For now, we'll use a hardcoded user ID since authentication is not implemented
    const userId = 1;
    const { type } = req.query;
    
    const history = await storage.getUserHistory(userId, type as string);
    return res.status(200).json(history);
  } catch (error) {
    console.error('Error fetching user history:', error);
    return res.status(500).json({ error: 'Failed to fetch user history' });
  }
});

// Add user history entry
router.post(async (req, res) => {
  try {
    // For now, we'll use a hardcoded user ID since authentication is not implemented
    const userId = 1;
    const { documentId, documentType, action } = req.body;
    
    if (!documentId || !documentType || !action) {
      return res.status(400).json({ 
        error: 'Missing required parameters: documentId, documentType, or action' 
      });
    }
    
    await storage.addUserHistory({
      userId,
      documentId,
      documentType,
      action
    });
    
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error adding user history:', error);
    return res.status(500).json({ error: 'Failed to add user history' });
  }
});

export default router.handler({
  onError: (err, req, res) => {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});