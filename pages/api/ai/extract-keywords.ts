import { NextApiRequest, NextApiResponse } from 'next';
import { openaiService } from '../../../server/services/openai-service';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { text, documentType } = req.body;
    
    if (!text || !documentType) {
      return res.status(400).json({ 
        message: 'Missing required fields: text and documentType' 
      });
    }

    if (documentType !== 'judicial' && documentType !== 'contract') {
      return res.status(400).json({ 
        message: 'Invalid documentType. Must be either "judicial" or "contract"' 
      });
    }

    // Use OpenAI service to extract keywords
    const result = await openaiService.extractKeywords(
      text,
      documentType as "judicial" | "contract"
    );

    // Return the keywords and summary
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error extracting keywords:', error);
    return res.status(500).json({ 
      message: 'An error occurred while extracting keywords',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}