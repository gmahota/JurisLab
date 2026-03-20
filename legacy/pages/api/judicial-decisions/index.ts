import type { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import { storage } from '../../../server/storage';

const router = createRouter<NextApiRequest, NextApiResponse>();

// Get all judicial decisions with optional filtering
router.get(async (req, res) => {
  try {
    const { 
      dateRange, 
      jurisdictions, 
      topics, 
      sortOrder, 
      searchQuery,
      page = '1',
      limit = '10'
    } = req.query;
    
    const decisions = await storage.getJudicialDecisions({
      dateRange: dateRange as string,
      jurisdictions: jurisdictions ? (jurisdictions as string).split(',') : undefined,
      topics: topics ? (topics as string).split(',') : undefined,
      sortOrder: sortOrder as string,
      searchQuery: searchQuery as string,
      page: parseInt(page as string),
      limit: parseInt(limit as string)
    });
    
    return res.status(200).json(decisions);
  } catch (error) {
    console.error('Error fetching judicial decisions:', error);
    return res.status(500).json({ error: 'Failed to fetch judicial decisions' });
  }
});

// Create a new judicial decision
router.post(async (req, res) => {
  try {
    const newDecision = await storage.createJudicialDecision(req.body);
    return res.status(201).json(newDecision);
  } catch (error) {
    console.error('Error creating judicial decision:', error);
    return res.status(500).json({ error: 'Failed to create judicial decision' });
  }
});

export default router.handler({
  onError: (err, req, res) => {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});