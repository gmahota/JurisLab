import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AiInsightCard } from "@/components/ai-insight-card";
import { 
  Upload, 
  BookOpen, 
  FileSpreadsheet, 
  CheckCircle, 
  Brain, 
  FileText, 
  GitCompare
} from "lucide-react";

export default function AiInsights() {
  const { data: insights, isLoading: isLoadingInsights } = useQuery<any[]>({
    queryKey: ['/api/ai-insights/recent'],
  });

  const { data: trendsData, isLoading: isLoadingTrends } = useQuery<{
    topTopics: { name: string; percentage: number }[];
    outcomesByIndustry: { industry: string; employeeFavorable: number; employerFavorable: number }[];
    emergingTrends: { title: string; content: string; trend: 'up' | 'down' }[];
  }>({
    queryKey: ['/api/ai-insights/trends'],
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">AI Insights</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-lg shadow">
          <CardHeader>
            <CardTitle>Document Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-64 bg-slate-50 dark:bg-slate-900 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-700">
              <div className="text-center px-6">
                <Upload className="h-10 w-10 text-slate-400 dark:text-slate-500 mx-auto mb-2" />
                <h3 className="text-sm font-medium text-slate-900 dark:text-white mb-1">
                  Upload a document for AI analysis
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                  Supports PDF, DOCX, and TXT formats up to 20MB
                </p>
                <Button>Upload Document</Button>
              </div>
            </div>
            
            <div className="mt-6 bg-primary-50 dark:bg-primary-900/20 rounded-lg p-4">
              <h3 className="font-medium text-slate-900 dark:text-white mb-2">What our AI can analyze:</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2" />
                  <span className="text-slate-600 dark:text-slate-300">Summarize lengthy legal documents</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2" />
                  <span className="text-slate-600 dark:text-slate-300">Extract key clauses and provisions</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2" />
                  <span className="text-slate-600 dark:text-slate-300">Identify potential compliance issues</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2" />
                  <span className="text-slate-600 dark:text-slate-300">Compare against legal standards</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2" />
                  <span className="text-slate-600 dark:text-slate-300">Find relevant case precedents</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2" />
                  <span className="text-slate-600 dark:text-slate-300">Predict potential legal outcomes</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </div>
        
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow">
          <CardHeader>
            <CardTitle>Recent AI Insights</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingInsights ? (
              <div className="flex justify-center p-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
              </div>
            ) : (
              <div className="space-y-4">
                <a href="#" className="block p-4 bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg transition-colors">
                  <div className="flex items-start">
                    <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-slate-900 dark:text-white">Acme Corp. Employment Contract Analysis</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">3 potential compliance issues found</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Generated 2 hours ago</p>
                    </div>
                  </div>
                </a>
                
                <a href="#" className="block p-4 bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg transition-colors">
                  <div className="flex items-start">
                    <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300">
                      <BookOpen className="h-4 w-4" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-slate-900 dark:text-white">Smith v. Medical Center Case Summary</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">5 relevant precedents identified</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Generated yesterday</p>
                    </div>
                  </div>
                </a>
                
                <a href="#" className="block p-4 bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg transition-colors">
                  <div className="flex items-start">
                    <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-300">
                      <GitCompare className="h-4 w-4" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-slate-900 dark:text-white">NDA Compliance Analysis</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Compared against 3 legal standards</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Generated 3 days ago</p>
                    </div>
                  </div>
                </a>
              </div>
            )}
            
            <div className="mt-4">
              <a href="#insights-list" className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300">
                View all insights →
              </a>
            </div>
          </CardContent>
        </div>
      </div>
      
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow">
        <CardHeader>
          <CardTitle>Legal Trends Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingTrends ? (
            <div className="flex justify-center p-6">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-slate-900 dark:text-white mb-3">Top Legal Topics in Recent Decisions</h3>
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4">
                  <div className="space-y-3">
                    {trendsData?.topTopics.map((topic, index) => (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{topic.name}</span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">{topic.percentage}%</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                          <div 
                            className="bg-primary-600 h-2 rounded-full" 
                            style={{ width: `${topic.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-slate-900 dark:text-white mb-3">Case Outcome Predictions by Industry</h3>
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4">
                  <div className="space-y-4">
                    {trendsData?.outcomesByIndustry.map((item, index) => (
                      <div key={index} className="flex items-center">
                        <div className="w-20 text-xs text-slate-600 dark:text-slate-400">{item.industry}</div>
                        <div className="flex-1 flex items-center">
                          <div 
                            className="h-4 bg-green-500 rounded-l-sm" 
                            style={{ width: `${item.employeeFavorable}%` }}
                          ></div>
                          <div 
                            className="h-4 bg-red-500 rounded-r-sm" 
                            style={{ width: `${item.employerFavorable}%` }}
                          ></div>
                        </div>
                        <div className="w-16 text-right text-xs text-slate-600 dark:text-slate-400">
                          <span className="text-green-600 dark:text-green-400">{item.employeeFavorable}%</span> / 
                          <span className="text-red-600 dark:text-red-400">{item.employerFavorable}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex justify-between text-xs text-slate-500 dark:text-slate-400">
                    <div>Favorable to Employee</div>
                    <div>Favorable to Employer</div>
                  </div>
                </div>
              </div>
              
              <div className="md:col-span-2">
                <h3 className="text-sm font-medium text-slate-900 dark:text-white mb-3">Emerging Legal Trends</h3>
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4">
                  <ul className="space-y-3">
                    {trendsData?.emergingTrends.map((trend, index) => (
                      <li key={index} className="flex items-start">
                        <div className={`p-1.5 rounded-full ${
                          trend.trend === 'up' 
                            ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-300' 
                            : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-300'
                        } mt-0.5`}>
                          {trend.trend === 'up' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-up"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-down"><path d="m19 12-7 7-7-7"/><path d="M12 5v14"/></svg>
                          )}
                        </div>
                        <div className="ml-3">
                          <h4 className="text-sm font-medium text-slate-900 dark:text-white">{trend.title}</h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{trend.content}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </div>
    </div>
  );
}
