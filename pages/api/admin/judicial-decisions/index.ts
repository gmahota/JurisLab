import type { NextApiRequest, NextApiResponse } from 'next';
import { storage } from '../../../../server/storage';
import { judicialDecisionInsertSchema } from '../../../../shared/schema';
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
 * Create a new judicial decision
 */
async function handleCreate(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Validate the request body
    const validatedData = judicialDecisionInsertSchema.parse(req.body);
    
    // Create the new judicial decision in the database
    const newDecision = await storage.createJudicialDecision(validatedData);
    
    return res.status(201).json(newDecision);
  } catch (error) {
    console.error('Error creating judicial decision:', error);
    
    // Handle validation errors specifically
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: error.errors 
      });
    }
    
    return res.status(500).json({ message: 'Failed to create judicial decision' });
  }
}