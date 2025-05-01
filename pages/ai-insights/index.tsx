import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import MainLayout from '../../client/src/components/layout/main-layout';
import { Card, CardContent, CardHeader, CardTitle } from '../../client/src/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../client/src/components/ui/tabs';
import { apiRequest } from '../../client/src/lib/queryClient';
import { Badge } from '../../client/src/components/ui/badge';
import { AiInsightCard } from '../../client/src/components/ai-insight-card';
import { 
  BrainCircuit, 
  BarChart, 
  TrendingUp, 
  ArrowUp, 
  ArrowDown,
  ArrowRight,
  SparkleIcon
} from 'lucide-react';

export default function AiInsights() {
  const [activeTab, setActiveTab] = useState('trends');
  
  const { data: recentInsights, isLoading: isLoadingRecent } = useQuery({
    queryKey: ['/api/ai-insights/recent'],
    queryFn: ({ queryKey }) => apiRequest<{
      id: number;
      title: string;
      content: string;
      documentType: string | null;
      documentId: number | null;
      insightType: string;
      createdAt: string;
    }[]>(queryKey[0])
  });
  
  const { data: trends, isLoading: isLoadingTrends } = useQuery({
    queryKey: ['/api/ai/legal-trends'],
    queryFn: ({ queryKey }) => apiRequest<{
      emergingTrends: Array<{ title: string; content: string; trend: "up" | "down" | "neutral" }>;
      topTopics: Array<{ name: string; percentage: number }>;
      industrySummary: string;
    }>(queryKey[0])
  });
  
  const { data: personalizedInsights, isLoading: isLoadingPersonalized } = useQuery({
    queryKey: ['/api/ai/personalized-insights?userId=1'], // Default user ID
    queryFn: ({ queryKey }) => apiRequest<Array<{ title: string; content: string }>>(queryKey[0]),
    enabled: activeTab === 'personalized'
  });
  
  const getTrendIcon = (trend: string) => {
    switch(trend) {
      case 'up':
        return <ArrowUp className="text-green-500 h-5 w-5" />;
      case 'down':
        return <ArrowDown className="text-red-500 h-5 w-5" />;
      default:
        return <ArrowRight className="text-amber-500 h-5 w-5" />;
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto p-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">AI Insights</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              AI-powered analytics and trends about legal documents
            </p>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="trends" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Legal Trends</span>
              <span className="sm:hidden">Trends</span>
            </TabsTrigger>
            <TabsTrigger value="recent" className="flex items-center gap-2">
              <SparkleIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Recent Insights</span>
              <span className="sm:hidden">Recent</span>
            </TabsTrigger>
            <TabsTrigger value="personalized" className="flex items-center gap-2">
              <BrainCircuit className="h-4 w-4" />
              <span className="hidden sm:inline">Personalized</span>
              <span className="sm:hidden">For You</span>
            </TabsTrigger>
          </TabsList>
          
          {/* Legal Trends Tab */}
          <TabsContent value="trends" className="space-y-6">
            {isLoadingTrends ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array(3).fill(0).map((_, i) => (
                  <div key={i} className="h-64 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse"></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trends?.emergingTrends?.map((trend, i) => (
                  <Card key={i} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">{trend.title}</CardTitle>
                        {getTrendIcon(trend.trend)}
                      </div>
                    </CardHeader>
                    <CardContent className="text-sm text-slate-600 dark:text-slate-300">
                      {trend.content}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Top Legal Topics */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg gap-2">
                    <BarChart className="h-5 w-5 text-primary" /> 
                    Top Legal Topics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoadingTrends ? (
                    <div className="space-y-4">
                      {Array(5).fill(0).map((_, i) => (
                        <div key={i} className="h-8 bg-slate-100 dark:bg-slate-800 rounded animate-pulse"></div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {trends?.topTopics?.map((topic, i) => (
                        <div key={i} className="flex items-center">
                          <div className="w-36 text-sm text-slate-600 dark:text-slate-300 font-medium">
                            {topic.name}
                          </div>
                          <div className="relative flex-1 h-7">
                            <div className="absolute inset-0 bg-slate-100 dark:bg-slate-800 rounded"></div>
                            <div 
                              className="absolute inset-y-0 left-0 bg-primary/20 rounded"
                              style={{ width: `${topic.percentage}%` }}
                            ></div>
                            <div className="absolute inset-y-0 flex items-center justify-end right-2 text-xs font-medium">
                              {topic.percentage}%
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Industry Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg gap-2">
                    <BrainCircuit className="h-5 w-5 text-primary" /> 
                    Industry Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoadingTrends ? (
                    <div className="h-40 bg-slate-100 dark:bg-slate-800 rounded animate-pulse"></div>
                  ) : (
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      {trends?.industrySummary}
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Recent Insights Tab */}
          <TabsContent value="recent">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {isLoadingRecent ? (
                Array(6).fill(0).map((_, i) => (
                  <div key={i} className="h-56 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse"></div>
                ))
              ) : recentInsights && recentInsights.length > 0 ? (
                recentInsights.map((insight) => (
                  <Card key={insight.id} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between">
                        <CardTitle className="text-lg">{insight.title}</CardTitle>
                        {insight.documentType && (
                          <Badge variant="outline">
                            {insight.documentType === 'judicial' ? 'Judicial' : 'Contract'}
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="text-sm text-slate-600 dark:text-slate-300">
                      {insight.content}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full flex items-center justify-center py-12 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                  <p className="text-slate-500 dark:text-slate-400">No insights available yet.</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* Personalized Insights Tab */}
          <TabsContent value="personalized">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {isLoadingPersonalized ? (
                Array(3).fill(0).map((_, i) => (
                  <div key={i} className="h-56 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse"></div>
                ))
              ) : personalizedInsights && personalizedInsights.length > 0 ? (
                personalizedInsights.map((insight, index) => (
                  <AiInsightCard
                    key={index}
                    title={insight.title}
                    content={insight.content}
                    icon={<BrainCircuit className="h-5 w-5" />}
                    iconBgClass="bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400"
                  />
                ))
              ) : (
                <div className="col-span-full flex items-center justify-center py-12 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                  <p className="text-slate-500 dark:text-slate-400">
                    No personalized insights available yet. Browse more documents to get tailored recommendations.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}