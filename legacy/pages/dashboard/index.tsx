import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { apiRequest } from '../../client/src/lib/queryClient';
import { StatsCard } from '../../client/src/components/stats-card';
import { AiInsightCard } from '../../client/src/components/ai-insight-card';
import { DocumentCard } from '../../client/src/components/document-card';
import { 
  FileText, 
  Briefcase, 
  Bookmark, 
  Search,
  TrendingUp,
  Users,
  BarChart2
} from 'lucide-react';

export default function Dashboard() {
  // Fetch dashboard stats
  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['/api/dashboard/stats'],
    queryFn: () => apiRequest('/api/dashboard/stats')
  });

  // Fetch dashboard insights
  const { data: insights, isLoading: isLoadingInsights } = useQuery({
    queryKey: ['/api/dashboard/insights'],
    queryFn: () => apiRequest('/api/dashboard/insights')
  });

  // Fetch recent documents
  const { data: recentDocuments, isLoading: isLoadingDocuments } = useQuery({
    queryKey: ['/api/recent-documents'],
    queryFn: () => apiRequest('/api/recent-documents')
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Overview of your legal documents and insights
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatsCard
          title="Judicial Decisions"
          value={isLoadingStats ? 0 : Number(stats?.judicialDecisions || 0)}
          icon={<FileText className="w-5 h-5" />}
          iconBgClass="bg-blue-100 dark:bg-blue-800"
        />
        <StatsCard
          title="Labor Contracts"
          value={isLoadingStats ? 0 : Number(stats?.laborContracts || 0)}
          icon={<Briefcase className="w-5 h-5" />}
          iconBgClass="bg-green-100 dark:bg-green-800"
        />
        <StatsCard
          title="Saved Documents"
          value={isLoadingStats ? 0 : Number(stats?.savedDocuments || 0)}
          icon={<Bookmark className="w-5 h-5" />}
          iconBgClass="bg-purple-100 dark:bg-purple-800"
        />
        <StatsCard
          title="Recent Searches"
          value={isLoadingStats ? 0 : Number(stats?.recentSearches || 0)}
          icon={<Search className="w-5 h-5" />}
          iconBgClass="bg-yellow-100 dark:bg-yellow-800"
        />
      </div>

      {/* AI Insights */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">AI Insights</h2>
          <Link href="/ai-insights">
            <span className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 cursor-pointer">
              View all
            </span>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {isLoadingInsights ? (
            <div className="col-span-full flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
          ) : insights?.length === 0 ? (
            <div className="col-span-full bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
              <p className="text-gray-500 dark:text-gray-400">No insights available yet</p>
            </div>
          ) : (
            insights?.map((insight: any) => (
              <AiInsightCard
                key={insight.id}
                title={insight.title}
                content={insight.content}
                icon={
                  insight.insightType === 'trend' ? (
                    <TrendingUp className="w-5 h-5" />
                  ) : insight.insightType === 'user' ? (
                    <Users className="w-5 h-5" />
                  ) : (
                    <BarChart2 className="w-5 h-5" />
                  )
                }
                iconBgClass={
                  insight.insightType === 'trend'
                    ? 'bg-blue-100 dark:bg-blue-800'
                    : insight.insightType === 'user'
                    ? 'bg-green-100 dark:bg-green-800'
                    : 'bg-purple-100 dark:bg-purple-800'
                }
              />
            ))
          )}
        </div>
      </div>

      {/* Recent Documents */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Judicial Decisions</h2>
          <Link href="/judicial-decisions">
            <span className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 cursor-pointer">
              View all
            </span>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {isLoadingDocuments ? (
            <div className="col-span-full flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
          ) : recentDocuments?.judicialDecisions?.length === 0 ? (
            <div className="col-span-full bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
              <p className="text-gray-500 dark:text-gray-400">No recent judicial decisions</p>
            </div>
          ) : (
            recentDocuments?.judicialDecisions?.slice(0, 3).map((decision: any) => (
              <DocumentCard
                key={decision.id}
                document={decision}
                documentType="judicial"
                onClick={() => {}}
              />
            ))
          )}
        </div>
      </div>

      {/* Recent Labor Contracts */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Labor Contracts</h2>
          <Link href="/labor-contracts">
            <span className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 cursor-pointer">
              View all
            </span>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {isLoadingDocuments ? (
            <div className="col-span-full flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
          ) : recentDocuments?.laborContracts?.length === 0 ? (
            <div className="col-span-full bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
              <p className="text-gray-500 dark:text-gray-400">No recent labor contracts</p>
            </div>
          ) : (
            recentDocuments?.laborContracts?.slice(0, 3).map((contract: any) => (
              <DocumentCard
                key={contract.id}
                document={contract}
                documentType="contract"
                onClick={() => {}}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}