import React from "react";
import { JudicialDecision, LaborContract } from "@shared/schema";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate, getJurisdictionColor } from "@/lib/utils";
import { X, Bookmark, Download, Share, Brain, BarChart2 } from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import { AIAnalysisPanel } from "@/components/ai-analysis-panel";
import { DocumentAnalytics } from "@/components/analytics/document-analytics";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DocumentDetailProps {
  document: JudicialDecision | LaborContract;
  onClose: () => void;
  documentType: "judicial" | "contract";
}

export function DocumentDetail({ document, onClose, documentType }: DocumentDetailProps) {
  const isJudicial = documentType === "judicial";
  const judicialDoc = document as JudicialDecision;
  const contractDoc = document as LaborContract;

  // Mutation to track document view
  const { mutate: trackView } = useMutation({
    mutationFn: async () => {
      return apiRequest('POST', '/api/history', {
        documentType,
        documentId: document.id,
        action: 'viewed'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/history'] });
    }
  });

  // Track view on component mount
  React.useEffect(() => {
    trackView();
  }, [document.id]);

  // Generate badges for document
  const renderBadges = () => {
    const badges = [];
    
    if (isJudicial) {
      const jurisdictionColors = getJurisdictionColor(judicialDoc.jurisdiction);
      
      badges.push(
        <Badge 
          key="jurisdiction"
          className={`${jurisdictionColors.bg} ${jurisdictionColors.text} ${jurisdictionColors.darkBg} ${jurisdictionColors.darkText}`}
        >
          {judicialDoc.jurisdiction}
        </Badge>
      );
      
      badges.push(
        <Badge 
          key="category"
          className="bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300"
        >
          {judicialDoc.category}
        </Badge>
      );
      
      badges.push(
        <Badge 
          key="caseNumber"
          className="bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300"
        >
          Case #{judicialDoc.caseNumber}
        </Badge>
      );
    } else {
      badges.push(
        <Badge 
          key="contractType"
          className="bg-secondary-100 text-secondary-800 dark:bg-secondary-900/50 dark:text-secondary-300"
        >
          {contractDoc.contractType}
        </Badge>
      );
      
      badges.push(
        <Badge 
          key="industry"
          className="bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300"
        >
          {contractDoc.industry}
        </Badge>
      );
    }
    
    return badges;
  };

  return (
    <div className="w-full md:w-2/5 lg:w-1/3 border-l border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex flex-col overflow-hidden">
      <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 p-4">
        <h2 className="font-semibold text-slate-900 dark:text-white">Document Details</h2>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onClose} 
          className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{document.title}</h1>
          <div className="flex flex-wrap gap-2 mb-4">
            {renderBadges()}
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400 space-y-2">
            <p>
              <span className="font-medium text-slate-700 dark:text-slate-300">Date:</span>{" "}
              {formatDate(isJudicial ? judicialDoc.date : contractDoc.updatedAt)}
            </p>
            
            {isJudicial ? (
              <>
                <p>
                  <span className="font-medium text-slate-700 dark:text-slate-300">Judge/Relator:</span>{" "}
                  {judicialDoc.judge}
                </p>
                <p>
                  <span className="font-medium text-slate-700 dark:text-slate-300">Parties:</span>{" "}
                  {judicialDoc.parties}
                </p>
              </>
            ) : (
              <>
                <p>
                  <span className="font-medium text-slate-700 dark:text-slate-300">Pages:</span>{" "}
                  {contractDoc.pages}
                </p>
                <p>
                  <span className="font-medium text-slate-700 dark:text-slate-300">Downloads:</span>{" "}
                  {contractDoc.downloads}
                </p>
              </>
            )}
          </div>
        </div>
        
        {isJudicial && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Summary</h2>
            <div className="text-sm text-slate-600 dark:text-slate-400 space-y-2 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-md border border-slate-200 dark:border-slate-700">
              <p>{judicialDoc.summary}</p>
            </div>
          </div>
        )}
        
        {/* Document Details Tabs */}
        <div className="mb-6">
          <Tabs defaultValue="content" className="w-full">
            <TabsList className="mb-4 grid grid-cols-3 h-auto">
              <TabsTrigger value="content" className="py-2">Content</TabsTrigger>
              <TabsTrigger value="ai-analysis" className="py-2">AI Analysis</TabsTrigger>
              <TabsTrigger value="analytics" className="py-2">Analytics</TabsTrigger>
            </TabsList>
            
            {/* Content Tab */}
            <TabsContent value="content" className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                  {isJudicial ? "Key Sections" : "Document Preview"}
                </h2>
                
                {isJudicial ? (
                  <div className="space-y-3">
                    <div className="p-3 border border-slate-200 dark:border-slate-700 rounded-md">
                      <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-1">Majority Opinion</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Pages 1-24 · Judge {judicialDoc.judge}</p>
                    </div>
                    <div className="p-3 border border-slate-200 dark:border-slate-700 rounded-md">
                      <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-1">Concurring Opinion</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Pages 25-31 · Additional Justice</p>
                    </div>
                    <div className="p-3 border border-slate-200 dark:border-slate-700 rounded-md">
                      <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-1">Dissenting Opinion</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Pages 32-45 · Dissenting Justice</p>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-md border border-slate-200 dark:border-slate-700">
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {contractDoc.description}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-500 mt-4">
                      Preview of the first page. Download the full document to view all {contractDoc.pages} pages.
                    </p>
                  </div>
                )}
              </div>
              
              {/* Related Documents Section */}
              {isJudicial && (
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Related Cases</h2>
                  <div className="space-y-3">
                    <a href="#" className="block p-3 bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-md transition-colors">
                      <h4 className="text-sm font-medium text-slate-900 dark:text-white">Similar Case Example</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Federal Court · Recent Date</p>
                    </a>
                    <a href="#" className="block p-3 bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-md transition-colors">
                      <h4 className="text-sm font-medium text-slate-900 dark:text-white">Related Precedent</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Supreme Court · Past Date</p>
                    </a>
                    <a href="#" className="block p-3 bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-md transition-colors">
                      <h4 className="text-sm font-medium text-slate-900 dark:text-white">Influential Case</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Supreme Court · Historical Case</p>
                    </a>
                  </div>
                </div>
              )}
            </TabsContent>
            
            {/* AI Analysis Tab */}
            <TabsContent value="ai-analysis">
              <AIAnalysisPanel 
                document={document} 
                documentType={documentType} 
              />
            </TabsContent>
            
            {/* Analytics Tab */}
            <TabsContent value="analytics">
              <DocumentAnalytics
                document={document}
                documentType={documentType}
              />
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
      
      <div className="border-t border-slate-200 dark:border-slate-700 p-4 flex space-x-2">
        <Button className="flex-1">
          View Full Document
        </Button>
        <Button variant="outline" size="icon">
          <Bookmark className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon">
          <Download className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon">
          <Share className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
