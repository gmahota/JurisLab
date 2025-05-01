import type { NextApiRequest, NextApiResponse } from 'next';
import { storage } from '../../../../server/storage';
import { judicialDecisionInsertSchema } from '../../../../shared/schema';
import { z } from 'zod';
import { db } from '../../../../db';
import { judicialDecisions } from '../../../../shared/schema';
import { eq } from 'drizzle-orm';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  
  // Validate id parameter
  if (!id || Array.isArray(id)) {
    return res.status(400).json({ message: 'Invalid ID parameter' });
  }
  
  const decisionId = parseInt(id, 10);
  
  if (isNaN(decisionId)) {
    return res.status(400).json({ message: 'ID must be a number' });
  }
  
  // Handle different HTTP methods
  switch (req.method) {
    case 'PUT':
      return handleUpdate(req, res, decisionId);
    case 'DELETE':
      return handleDelete(req, res, decisionId);
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}

/**
 * Update an existing judicial decision
 */
async function handleUpdate(req: NextApiRequest, res: NextApiResponse, id: number) {
  try {
    // First check if the decision exists
    const existingDecision = await storage.getJudicialDecisionById(id);
    
    if (!existingDecision) {
      return res.status(404).json({ message: 'Judicial decision not found' });
    }
    
    // Validate the request body
    const validatedData = judicialDecisionInsertSchema.parse(req.body);
    
    // Update the judicial decision in the database
    const [updatedDecision] = await db
      .update(judicialDecisions)
      .set({
        ...validatedData,
        updatedAt: new Date()
      })
      .where(eq(judicialDecisions.id, id))
      .returning();
    
    if (!updatedDecision) {
      return res.status(404).json({ message: 'Failed to update judicial decision' });
    }
    
    return res.status(200).json(updatedDecision);
  } catch (error) {
    console.error('Error updating judicial decision:', error);
    
    // Handle validation errors specifically
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: error.errors 
      });
    }
    
    return res.status(500).json({ message: 'Failed to update judicial decision' });
  }
}

/**
 * Delete a judicial decision
 */
async function handleDelete(req: NextApiRequest, res: NextApiResponse, id: number) {
  try {
    // First check if the decision exists
    const existingDecision = await storage.getJudicialDecisionById(id);
    
    if (!existingDecision) {
      return res.status(404).json({ message: 'Judicial decision not found' });
    }
    
    // Delete the judicial decision from the database
    const [deletedDecision] = await db
      .delete(judicialDecisions)
      .where(eq(judicialDecisions.id, id))
      .returning();
    
    if (!deletedDecision) {
      return res.status(404).json({ message: 'Failed to delete judicial decision' });
    }
    
    return res.status(200).json({ message: 'Judicial decision deleted successfully' });
  } catch (error) {
    console.error('Error deleting judicial decision:', error);
    return res.status(500).json({ message: 'Failed to delete judicial decision' });
  }
}