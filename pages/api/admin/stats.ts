import type { NextApiRequest, NextApiResponse } from 'next';
import { storage } from '../../../server/storage';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Get total documents count
    const judicialDecisions = await storage.getJudicialDecisions();
    const laborContracts = await storage.getLaborContracts();
    
    const totalDocuments = (judicialDecisions?.decisions?.length || 0) + 
                          (laborContracts?.contracts?.length || 0);
    
    // Mock data for other stats that would be implemented later
    const activeUsers = 42;
    const pendingApprovals = 7;
    
    // Recent activity data
    const recentActivity = [
      {
        action: "Judicial decision added",
        user: "Admin User",
        time: "2 hours ago"
      },
      {
        action: "User account created",
        user: "System",
        time: "5 hours ago"
      },
      {
        action: "Labor contract updated",
        user: "Content Editor",
        time: "Yesterday"
      },
      {
        action: "Document approved",
        user: "Senior Reviewer",
        time: "2 days ago"
      },
      {
        action: "System backup completed",
        user: "System",
        time: "3 days ago"
      }
    ];

    res.status(200).json({
      totalDocuments,
      activeUsers,
      pendingApprovals,
      recentActivity
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ message: 'Failed to fetch admin statistics' });
  }
}