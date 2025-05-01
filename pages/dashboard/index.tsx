import React from 'react';
import { useQuery } from '@tanstack/react-query';
import MainLayout from '../../client/src/components/layout/main-layout';
import { StatsCard } from '../../client/src/components/stats-card';
import { AiInsightCard } from '../../client/src/components/ai-insight-card';
import { DocumentCard } from '../../client/src/components/document-card';
import { apiRequest } from '../../client/src/lib/queryClient';
import { JudicialDecision, LaborContract } from '../../shared/schema';
import { CircleUser, FileText, GraduationCap, Scale } from 'lucide-react';

export default function Dashboard() {
  // Fetch dashboard stats
  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['/api/dashboard/stats'],
    queryFn: async () => apiRequest<{
      judicialDecisions: string;
      laborContracts: string;
      users: string;
      interactions: string;
    }>('GET', '/api/dashboard/stats')
  });

  // Fetch dashboard insights
  const { data: insights, isLoading: isLoadingInsights } = useQuery({
    queryKey: ['/api/dashboard/insights'],
    queryFn: async () => apiRequest<Array<{
      id: number;
      title: string;
      content: string;
      insightType: string;
    }>>('GET', '/api/dashboard/insights')
  });

  // Fetch recent documents
  const { data: recentDocs, isLoading: isLoadingRecent } = useQuery({
    queryKey: ['/api/recent-documents'],
    queryFn: async () => apiRequest<{
      judicialDecisions: JudicialDecision[];
      laborContracts: LaborContract[];
    }>('GET', '/api/recent-documents')
  });

  // Placeholder until document detail is implemented
  const handleDocumentClick = (doc: JudicialDecision | LaborContract) => {
    console.log('Document clicked:', doc);
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">Dashboard</h1>
        
        {/* Stats section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="Judicial Decisions"
            value={isLoadingStats ? 0 : parseInt(stats?.judicialDecisions || '0')}
            icon={<Scale className="h-5 w-5" />}
            iconBgClass="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
          />
          <StatsCard
            title="Labor Contracts"
            value={isLoadingStats ? 0 : parseInt(stats?.laborContracts || '0')}
            icon={<FileText className="h-5 w-5" />}
            iconBgClass="bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
          />
          <StatsCard
            title="Users"
            value={isLoadingStats ? 0 : parseInt(stats?.users || '0')}
            icon={<CircleUser className="h-5 w-5" />}
            iconBgClass="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
          />
          <StatsCard
            title="AI Interactions"
            value={isLoadingStats ? 0 : parseInt(stats?.interactions || '0')}
            icon={<GraduationCap className="h-5 w-5" />}
            iconBgClass="bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
          />
        </div>
        
        {/* AI Insights section */}
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">AI Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {isLoadingInsights ? (
            Array(3).fill(0).map((_, index) => (
              <div 
                key={index} 
                className="bg-slate-100 dark:bg-slate-800 animate-pulse h-40 rounded-lg"
              ></div>
            ))
          ) : insights && insights.length > 0 ? (
            insights.slice(0, 3).map((insight) => (
              <AiInsightCard
                key={insight.id}
                title={insight.title}
                content={insight.content}
                icon={<GraduationCap className="h-5 w-5" />}
                iconBgClass="bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400"
              />
            ))
          ) : (
            <div className="col-span-full text-center py-8 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
              <p className="text-slate-500 dark:text-slate-400">No insights available yet. Check back later.</p>
            </div>
          )}
        </div>
        
        {/* Recent Documents section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Recent Judicial Decisions</h2>
            {isLoadingRecent ? (
              Array(3).fill(0).map((_, index) => (
                <div 
                  key={index} 
                  className="bg-slate-100 dark:bg-slate-800 animate-pulse h-28 rounded-lg mb-3"
                ></div>
              ))
            ) : recentDocs?.judicialDecisions && recentDocs.judicialDecisions.length > 0 ? (
              <div className="space-y-3">
                {recentDocs.judicialDecisions.slice(0, 3).map((decision) => (
                  <DocumentCard
                    key={decision.id}
                    document={decision}
                    documentType="judicial"
                    onClick={() => handleDocumentClick(decision)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                <p className="text-slate-500 dark:text-slate-400">No recent judicial decisions.</p>
              </div>
            )}
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Recent Labor Contracts</h2>
            {isLoadingRecent ? (
              Array(3).fill(0).map((_, index) => (
                <div 
                  key={index} 
                  className="bg-slate-100 dark:bg-slate-800 animate-pulse h-28 rounded-lg mb-3"
                ></div>
              ))
            ) : recentDocs?.laborContracts && recentDocs.laborContracts.length > 0 ? (
              <div className="space-y-3">
                {recentDocs.laborContracts.slice(0, 3).map((contract) => (
                  <DocumentCard
                    key={contract.id}
                    document={contract}
                    documentType="contract"
                    onClick={() => handleDocumentClick(contract)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                <p className="text-slate-500 dark:text-slate-400">No recent labor contracts.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}