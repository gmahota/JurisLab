import type { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import { storage } from '../../../server/storage';
import { aiService } from '../../../server/services/ai';

const router = createRouter<NextApiRequest, NextApiResponse>();

// Analyze a labor contract
router.post(async (req, res) => {
  try {
    const { id } = req.body;
    
    if (!id) {
      return res.status(400).json({ error: 'Missing required parameter: id' });
    }
    
    // Fetch the labor contract
    const contract = await storage.getLaborContractById(parseInt(id));
    
    if (!contract) {
      return res.status(404).json({ error: 'Labor contract not found' });
    }
    
    // Generate AI analysis
    const analysis = await aiService.analyzeLaborContract(contract);
    
    return res.status(200).json(analysis);
  } catch (error) {
    console.error('Error analyzing labor contract:', error);
    return res.status(500).json({ error: 'Failed to analyze labor contract' });
  }
});

export default router.handler({
  onError: (err, req, res) => {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});