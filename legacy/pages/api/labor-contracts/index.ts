import type { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import { storage } from '../../../server/storage';

const router = createRouter<NextApiRequest, NextApiResponse>();

// Get all labor contracts with optional filtering
router.get(async (req, res) => {
  try {
    const { 
      contractTypes, 
      industries, 
      sortOrder, 
      searchQuery, 
      page = '1', 
      limit = '10' 
    } = req.query;
    
    const contracts = await storage.getLaborContracts({
      contractTypes: contractTypes ? (contractTypes as string).split(',') : undefined,
      industries: industries ? (industries as string).split(',') : undefined,
      sortOrder: sortOrder as string,
      searchQuery: searchQuery as string,
      page: parseInt(page as string),
      limit: parseInt(limit as string)
    });
    
    return res.status(200).json(contracts);
  } catch (error) {
    console.error('Error fetching labor contracts:', error);
    return res.status(500).json({ error: 'Failed to fetch labor contracts' });
  }
});

// Create a new labor contract
router.post(async (req, res) => {
  try {
    const newContract = await storage.createLaborContract(req.body);
    return res.status(201).json(newContract);
  } catch (error) {
    console.error('Error creating labor contract:', error);
    return res.status(500).json({ error: 'Failed to create labor contract' });
  }
});

export default router.handler({
  onError: (err, req, res) => {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});