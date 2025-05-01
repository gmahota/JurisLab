import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DocumentDetail } from "@/components/document-detail";
import { JudicialDecision, LaborContract, UserHistory } from "@shared/schema";
import { formatDate } from "@/lib/utils";
import { 
  BookOpenText, 
  FileText, 
  Eye, 
  Download, 
  Clock
} from "lucide-react";

type ActivityGroup = {
  date: string;
  activities: (UserHistory & { 
    document: JudicialDecision | LaborContract 
  })[];
};

export default function RecentActivity() {
  const [selectedDocument, setSelectedDocument] = useState<JudicialDecision | LaborContract | null>(null);
  const [documentPanelOpen, setDocumentPanelOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("all");

  const { data: activityData, isLoading } = useQuery<{
    activities: ActivityGroup[]
  }>({
    queryKey: ['/api/history', selectedTab],
  });

  const handleDocumentClick = (document: JudicialDecision | LaborContract) => {
    setSelectedDocument(document);
    setDocumentPanelOpen(true);
  };

  function getActionIcon(action: string) {
    switch (action) {
      case "viewed":
        return <Eye className="h-4 w-4" />;
      case "downloaded":
        return <Download className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto p-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Recent Activity</h1>
        
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Activity History</CardTitle>
              <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-auto">
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="judicial">Judicial Decisions</TabsTrigger>
                  <TabsTrigger value="contracts">Labor Contracts</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center p-6">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
              </div>
            ) : activityData?.activities.length === 0 ? (
              <div className="text-center py-10">
                <Clock className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">No activity yet</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Your recent document activity will appear here
                </p>
              </div>
            ) : (
              <div>
                {activityData?.activities.map((group, groupIndex) => (
                  <div key={groupIndex} className="mb-8">
                    <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-4">
                      {group.date}
                    </h3>
                    <div className="space-y-3">
                      {group.activities.map((activity, activityIndex) => {
                        const isJudicial = activity.documentType === "judicial";
                        return (
                          <div 
                            key={activityIndex}
                            className="flex p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 cursor-pointer transition-colors"
                            onClick={() => handleDocumentClick(activity.document)}
                          >
                            <div className="mr-4 mt-1">
                              {isJudicial ? (
                                <BookOpenText className="h-5 w-5 text-primary-600 dark:text-primary-500" />
                              ) : (
                                <FileText className="h-5 w-5 text-secondary-600 dark:text-secondary-500" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h4 className="text-sm font-medium text-slate-900 dark:text-white">
                                    {activity.document.title}
                                  </h4>
                                  <div className="flex items-center mt-1">
                                    <span className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                                      {getActionIcon(activity.action)}
                                      <span className="ml-1 capitalize">{activity.action}</span>
                                    </span>
                                    <span className="mx-2 text-slate-300 dark:text-slate-700">•</span>
                                    <span className="text-xs text-slate-500 dark:text-slate-400">
                                      {new Date(activity.createdAt).toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                      })}
                                    </span>
                                  </div>
                                </div>
                                <span className="px-2 py-1 text-xs font-medium rounded
                                  ${isJudicial 
                                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'
                                    : 'bg-secondary-100 text-secondary-800 dark:bg-secondary-900/50 dark:text-secondary-300'
                                  }"
                                >
                                  {isJudicial 
                                    ? (activity.document as JudicialDecision).jurisdiction 
                                    : (activity.document as LaborContract).contractType}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {documentPanelOpen && selectedDocument && (
        <DocumentDetail 
          document={selectedDocument}
          onClose={() => setDocumentPanelOpen(false)}
          documentType={'caseNumber' in selectedDocument ? 'judicial' : 'contract'}
        />
      )}
    </div>
  );
}
