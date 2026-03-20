import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { StatsCard } from "@/components/stats-card";
import { AiInsightCard } from "@/components/ai-insight-card";
import { 
  BookOpenText, 
  FileText, 
  Bookmark, 
  Search,
  Brain, 
  FileSearch,
  BarChart
} from "lucide-react";
import { JudicialDecision, LaborContract } from "@shared/schema";

export default function Dashboard() {
  const { data: recentDocuments, isLoading: isLoadingDocuments } = useQuery<{ 
    judicialDecisions: JudicialDecision[], 
    laborContracts: LaborContract[] 
  }>({
    queryKey: ['/api/recent-documents'],
  });

  const { data: stats, isLoading: isLoadingStats } = useQuery<{
    judicialDecisions: number,
    laborContracts: number,
    savedDocuments: number,
    recentSearches: number
  }>({
    queryKey: ['/api/dashboard/stats'],
  });

  const { data: insights, isLoading: isLoadingInsights } = useQuery<any[]>({
    queryKey: ['/api/dashboard/insights'],
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard 
          title="Judicial Decisions"
          value={stats?.judicialDecisions || 0}
          icon={<BookOpenText className="h-5 w-5" />}
          iconBgClass="bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300"
        />
        
        <StatsCard 
          title="Contract Templates"
          value={stats?.laborContracts || 0}
          icon={<FileText className="h-5 w-5" />}
          iconBgClass="bg-secondary-100 dark:bg-secondary-900/30 text-secondary-800 dark:text-secondary-300"
        />
        
        <StatsCard 
          title="Saved Documents"
          value={stats?.savedDocuments || 0}
          icon={<Bookmark className="h-5 w-5" />}
          iconBgClass="bg-accent-100 dark:bg-accent-900/30 text-accent-800 dark:text-accent-300"
        />
        
        <StatsCard 
          title="Recent Searches"
          value={stats?.recentSearches || 0}
          icon={<Search className="h-5 w-5" />}
          iconBgClass="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Documents */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-lg shadow">
          <div className="border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900 dark:text-white">Recent Documents</h2>
            <select className="text-sm border-0 bg-transparent text-slate-600 dark:text-slate-300 focus:ring-0">
              <option>All types</option>
              <option>Judicial Decisions</option>
              <option>Labor Contracts</option>
            </select>
          </div>
          <div className="p-6">
            {isLoadingDocuments ? (
              <div className="flex justify-center p-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
              </div>
            ) : (
              <ul className="divide-y divide-slate-200 dark:divide-slate-700">
                {recentDocuments && [...recentDocuments.judicialDecisions, ...recentDocuments.laborContracts]
                  .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                  .slice(0, 5)
                  .map((doc, index) => {
                    const isJudicial = 'caseNumber' in doc;
                    return (
                      <li key={`${isJudicial ? 'judicial' : 'contract'}-${doc.id}`} className="py-3 flex items-start">
                        <div className="flex-shrink-0 pt-1">
                          {isJudicial ? (
                            <BookOpenText className="h-4 w-4 text-primary-600 dark:text-primary-500" />
                          ) : (
                            <FileText className="h-4 w-4 text-secondary-600 dark:text-secondary-500" />
                          )}
                        </div>
                        <div className="ml-3 flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium text-slate-900 dark:text-white">{doc.title}</h3>
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                              {new Date(doc.updatedAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            {isJudicial 
                              ? `${doc.category} - ${doc.jurisdiction}`
                              : `Template - ${doc.industry}`}
                          </p>
                        </div>
                      </li>
                    );
                  })}
              </ul>
            )}
            <div className="mt-4">
              <a href="/judicial-decisions" className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300">
                View all documents →
              </a>
            </div>
          </div>
        </div>
        
        {/* AI Insights */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow">
          <div className="border-b border-slate-200 dark:border-slate-700 px-6 py-4">
            <h2 className="font-semibold text-slate-900 dark:text-white">AI Insights</h2>
          </div>
          <div className="p-6">
            {isLoadingInsights ? (
              <div className="flex justify-center p-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
              </div>
            ) : (
              <>
                <AiInsightCard 
                  title="Trending Legal Topic"
                  content="Remote work regulations show increased litigation in the past quarter."
                  icon={<Brain className="h-4 w-4" />}
                  iconBgClass="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300"
                  className="mb-6 pb-6 border-b border-slate-200 dark:border-slate-700"
                />
                
                <AiInsightCard 
                  title="Document Recommendation"
                  content="Based on your recent searches, you might be interested in 'Healthcare Industry Labor Agreements'."
                  icon={<FileSearch className="h-4 w-4" />}
                  iconBgClass="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300"
                  className="mb-6 pb-6 border-b border-slate-200 dark:border-slate-700"
                />
                
                <AiInsightCard 
                  title="Case Outcome Prediction"
                  content="Similar cases to 'Smith v. Acme Corp' have a 73% favorable outcome rate for employees."
                  icon={<BarChart className="h-4 w-4" />}
                  iconBgClass="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-300"
                />
              </>
            )}
            
            <div className="mt-4">
              <a href="/ai-insights" className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300">
                View all insights →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
