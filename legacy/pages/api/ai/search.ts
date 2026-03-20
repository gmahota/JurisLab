import { NextApiRequest, NextApiResponse } from 'next';
import { openaiService } from '../../../server/services/openai-service';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { q } = req.query;
    
    if (!q || Array.isArray(q)) {
      return res.status(400).json({ message: 'Missing search query parameter "q"' });
    }

    if (q.trim().length === 0) {
      return res.status(400).json({ message: 'Search query cannot be empty' });
    }

    // Use OpenAI service to search documents
    const searchResults = await openaiService.searchDocuments(q);

    // Return the search results
    return res.status(200).json(searchResults);
  } catch (error) {
    console.error('Error searching documents:', error);
    return res.status(500).json({ 
      message: 'An error occurred while searching documents',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}