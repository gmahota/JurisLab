import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { apiRequest } from '../../client/src/lib/queryClient';
import { formatDate } from '../../client/src/lib/utils';
import { 
  Eye, 
  Download, 
  Star, 
  Search, 
  File, 
  ExternalLink 
} from 'lucide-react';

type ActivityGroup = {
  date: string;
  activities: (any & { 
    document: any 
  })[];
};

export default function RecentActivity() {
  // Fetch user activity history
  const { data: history, isLoading } = useQuery({
    queryKey: ['/api/user/history'],
    queryFn: () => apiRequest('/api/user/history')
  });

  // Group activities by date
  const groupedActivities: ActivityGroup[] = React.useMemo(() => {
    if (!history?.length) return [];

    const groups: Record<string, any[]> = {};
    
    history.forEach((activity: any) => {
      const date = formatDate(activity.createdAt).split('T')[0];
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(activity);
    });

    return Object.keys(groups).map(date => ({
      date,
      activities: groups[date]
    }));
  }, [history]);

  // Get action icon based on activity type
  function getActionIcon(action: string) {
    switch (action) {
      case 'viewed':
        return <Eye className="w-5 h-5" />;
      case 'downloaded':
        return <Download className="w-5 h-5" />;
      case 'favorited':
        return <Star className="w-5 h-5" />;
      case 'searched':
        return <Search className="w-5 h-5" />;
      default:
        return <File className="w-5 h-5" />;
    }
  }

  // Get activity label
  function getActivityLabel(activity: any) {
    const documentType = activity.documentType === 'judicial' ? 'judicial decision' : 'labor contract';
    const documentTitle = activity.document?.title || 'Unknown document';
    
    switch (activity.action) {
      case 'viewed':
        return <>Viewed the {documentType} <span className="font-medium">{documentTitle}</span></>;
      case 'downloaded':
        return <>Downloaded the {documentType} <span className="font-medium">{documentTitle}</span></>;
      case 'favorited':
        return <>Added the {documentType} <span className="font-medium">{documentTitle}</span> to favorites</>;
      case 'searched':
        return <>Searched for "<span className="font-medium">{activity.searchQuery || 'unknown query'}</span>"</>;
      default:
        return <>Interacted with {documentType} <span className="font-medium">{documentTitle}</span></>;
    }
  }

  function getActivityLink(activity: any) {
    if (activity.action === 'searched') {
      return null;
    }
    
    return activity.documentType === 'judicial'
      ? `/judicial-decisions/${activity.documentId}`
      : `/labor-contracts/${activity.documentId}`;
  }

  function formatActivityTime(dateString: string) {
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return '';
    }
  }

  function formatDateHeading(dateString: string) {
    try {
      const date = new Date(dateString);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (date.toDateString() === today.toDateString()) {
        return 'Today';
      } else if (date.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
      } else {
        return date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
      }
    } catch (e) {
      return dateString;
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Recent Activity</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Your recent interactions with judicial decisions and labor contracts
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      ) : !groupedActivities.length ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No recent activity</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            You haven't interacted with any judicial decisions or labor contracts yet.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/judicial-decisions">
              <span className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer">
                Browse Judicial Decisions
              </span>
            </Link>
            <Link href="/labor-contracts">
              <span className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer">
                Browse Labor Contracts
              </span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {groupedActivities.map((group) => (
            <div key={group.date}>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {formatDateHeading(group.date)}
              </h2>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {group.activities.map((activity) => {
                    const activityLink = getActivityLink(activity);
                    
                    return (
                      <li key={activity.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 mt-1">
                            <div className="p-2 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300">
                              {getActionIcon(activity.action)}
                            </div>
                          </div>
                          <div className="ml-4 flex-1">
                            <div className="flex justify-between">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {getActivityLabel(activity)}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {formatActivityTime(activity.createdAt)}
                              </p>
                            </div>
                            {activityLink && (
                              <div className="mt-1">
                                <Link href={activityLink}>
                                  <span className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 hover:underline flex items-center cursor-pointer">
                                    View details <ExternalLink className="ml-1 w-3 h-3" />
                                  </span>
                                </Link>
                              </div>
                            )}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}