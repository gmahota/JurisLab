import type { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import { storage } from '../../../server/storage';
import { aiService } from '../../../server/services/ai';

const router = createRouter<NextApiRequest, NextApiResponse>();

// Analyze a judicial decision
router.post(async (req, res) => {
  try {
    const { id } = req.body;
    
    if (!id) {
      return res.status(400).json({ error: 'Missing required parameter: id' });
    }
    
    // Fetch the judicial decision
    const decision = await storage.getJudicialDecisionById(parseInt(id));
    
    if (!decision) {
      return res.status(404).json({ error: 'Judicial decision not found' });
    }
    
    // Generate AI analysis
    const analysis = await aiService.analyzeJudicialDecision(decision);
    
    return res.status(200).json(analysis);
  } catch (error) {
    console.error('Error analyzing judicial decision:', error);
    return res.status(500).json({ error: 'Failed to analyze judicial decision' });
  }
});

export default router.handler({
  onError: (err, req, res) => {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});