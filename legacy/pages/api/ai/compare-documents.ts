import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@db';
import { judicialDecisions, laborContracts } from '@shared/schema';
import { eq } from 'drizzle-orm';
import { openaiService } from '../../../server/services/openai-service';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { primaryId, relatedIds, documentType } = req.query;
    
    if (!primaryId || Array.isArray(primaryId) || !relatedIds || !documentType) {
      return res.status(400).json({ 
        message: 'Invalid request parameters. Required: primaryId, relatedIds, documentType' 
      });
    }

    if (documentType !== 'judicial' && documentType !== 'contract') {
      return res.status(400).json({ 
        message: 'Invalid documentType. Must be either "judicial" or "contract"' 
      });
    }

    const parsedPrimaryId = parseInt(primaryId, 10);
    const parsedRelatedIds = Array.isArray(relatedIds) 
      ? relatedIds.map(id => parseInt(id, 10)) 
      : relatedIds.split(',').map(id => parseInt(id.trim(), 10));
    
    if (isNaN(parsedPrimaryId) || parsedRelatedIds.some(isNaN)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    let primaryDoc;
    let relatedDocs = [];

    // Fetch the primary document
    if (documentType === 'judicial') {
      primaryDoc = await db.query.judicialDecisions.findFirst({
        where: eq(judicialDecisions.id, parsedPrimaryId)
      });

      // Fetch related documents
      if (parsedRelatedIds.length > 0) {
        for (const id of parsedRelatedIds) {
          const doc = await db.query.judicialDecisions.findFirst({
            where: eq(judicialDecisions.id, id)
          });
          if (doc) relatedDocs.push(doc);
        }
      }
    } else {
      primaryDoc = await db.query.laborContracts.findFirst({
        where: eq(laborContracts.id, parsedPrimaryId)
      });

      // Fetch related documents
      if (parsedRelatedIds.length > 0) {
        for (const id of parsedRelatedIds) {
          const doc = await db.query.laborContracts.findFirst({
            where: eq(laborContracts.id, id)
          });
          if (doc) relatedDocs.push(doc);
        }
      }
    }

    if (!primaryDoc) {
      return res.status(404).json({ message: 'Primary document not found' });
    }

    if (relatedDocs.length === 0) {
      return res.status(404).json({ message: 'No related documents found' });
    }

    // Use OpenAI service to compare documents
    const comparison = await openaiService.compareDocuments(
      primaryDoc, 
      relatedDocs,
      documentType as "judicial" | "contract"
    );

    // Return the comparison
    return res.status(200).json(comparison);
  } catch (error) {
    console.error('Error comparing documents:', error);
    return res.status(500).json({ 
      message: 'An error occurred while comparing documents',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}