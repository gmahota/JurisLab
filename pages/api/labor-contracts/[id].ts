import type { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import { storage } from '../../../server/storage';

const router = createRouter<NextApiRequest, NextApiResponse>();

// Get a specific labor contract by ID
router.get(async (req, res) => {
  try {
    const id = req.query.id as string;
    const contract = await storage.getLaborContractById(parseInt(id));
    
    if (!contract) {
      return res.status(404).json({ error: 'Labor contract not found' });
    }
    
    return res.status(200).json(contract);
  } catch (error) {
    console.error('Error fetching labor contract:', error);
    return res.status(500).json({ error: 'Failed to fetch labor contract' });
  }
});

export default router.handler({
  onError: (err, req, res) => {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});