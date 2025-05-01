import type { NextApiRequest, NextApiResponse } from 'next';
import { storage } from '../../../../server/storage';
import { laborContractInsertSchema } from '../../../../shared/schema';
import { z } from 'zod';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Handle different HTTP methods
  switch (req.method) {
    case 'POST':
      return handleCreate(req, res);
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}

/**
 * Create a new labor contract
 */
async function handleCreate(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Validate the request body
    const validatedData = laborContractInsertSchema.parse(req.body);
    
    // Create the new labor contract in the database
    const newContract = await storage.createLaborContract(validatedData);
    
    return res.status(201).json(newContract);
  } catch (error) {
    console.error('Error creating labor contract:', error);
    
    // Handle validation errors specifically
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: error.errors 
      });
    }
    
    return res.status(500).json({ message: 'Failed to create labor contract' });
  }
}