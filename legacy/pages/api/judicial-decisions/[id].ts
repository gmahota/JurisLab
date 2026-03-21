import type { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import { storage } from '../../../server/storage';

const router = createRouter<NextApiRequest, NextApiResponse>();

// Get a specific judicial decision by ID
router.get(async (req, res) => {
  try {
    const id = req.query.id as string;
    const decision = await storage.getJudicialDecisionById(parseInt(id));
    
    if (!decision) {
      return res.status(404).json({ error: 'Judicial decision not found' });
    }
    
    return res.status(200).json(decision);
  } catch (error) {
    console.error('Error fetching judicial decision:', error);
    return res.status(500).json({ error: 'Failed to fetch judicial decision' });
  }
});

export default router.handler({
  onError: (err, req, res) => {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});