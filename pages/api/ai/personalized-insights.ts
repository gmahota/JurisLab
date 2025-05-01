import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@db';
import { userHistory } from '@shared/schema';
import { desc } from 'drizzle-orm';
import { openaiService } from '../../../server/services/openai-service';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { userId } = req.query;
    
    if (!userId || Array.isArray(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const parsedUserId = parseInt(userId, 10);
    
    if (isNaN(parsedUserId)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }

    // Fetch user history with document titles
    // In a real implementation, you might want to join with judicial_decisions and labor_contracts
    // to get the actual titles rather than relying on storing them in the history
    const history = await db.query.userHistory.findMany({
      where: (userHistory, { eq }) => eq(userHistory.userId, parsedUserId),
      orderBy: [desc(userHistory.createdAt)],
      limit: 30
    });

    // If no history, return a basic response
    if (history.length === 0) {
      return res.status(200).json([
        { 
          title: "No Insights Available", 
          content: "We don't have enough data about your usage to generate personalized insights yet. Try exploring more documents." 
        }
      ]);
    }

    // Format history to include titles for AI processing
    const formattedHistory = history.map(item => ({
      documentType: item.documentType,
      documentId: item.documentId,
      title: item.documentTitle || `Document #${item.documentId}`,
      action: item.action,
      createdAt: item.createdAt
    }));

    // Use OpenAI service to generate personalized insights
    const insights = await openaiService.generatePersonalizedInsights(formattedHistory);

    // Return the personalized insights
    return res.status(200).json(insights);
  } catch (error) {
    console.error('Error generating personalized insights:', error);
    return res.status(500).json({ 
      message: 'An error occurred while generating personalized insights',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}