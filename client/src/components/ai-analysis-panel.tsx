import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, BookOpen, List, Lightbulb, TrendingUp, Scale } from "lucide-react";
import { aiService } from "@/lib/ai-service";
import { JudicialDecision, LaborContract } from "@shared/schema";
import { cn } from "@/lib/utils";

interface AIAnalysisPanelProps {
  document: JudicialDecision | LaborContract;
  documentType: "judicial" | "contract";
  className?: string;
}

export function AIAnalysisPanel({ document, documentType, className }: AIAnalysisPanelProps) {
  const [activeTab, setActiveTab] = useState("summary");
  
  const { 
    data: analysis, 
    isLoading, 
    isError,
    refetch
  } = useQuery({
    queryKey: [`/api/ai/analyze/${documentType}/${document.id}`],
    queryFn: async () => {
      if (documentType === "judicial") {
        return aiService.analyzeJudicialDecision(document.id);
      } else {
        return aiService.analyzeLaborContract(document.id);
      }
    },
    enabled: false, // Don't run this query on page load - wait for user to click button
  });

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center gap-2">
            <Scale className="h-5 w-5 text-primary" /> 
            AI Analysis
          </CardTitle>
          {!analysis && !isLoading && (
            <Button 
              onClick={() => refetch()} 
              size="sm" 
              variant="default"
              className="gap-2"
            >
              <Lightbulb className="h-4 w-4" />
              Generate AI Analysis
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-60">
            <div className="flex flex-col items-center space-y-2">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
              <p className="text-sm text-muted-foreground">Analyzing document...</p>
            </div>
          </div>
        ) : isError ? (
          <div className="p-4 border border-red-200 rounded-md bg-red-50 dark:bg-red-900/20 dark:border-red-800 text-center">
            <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <h3 className="font-medium text-red-800 dark:text-red-400">Analysis Error</h3>
            <p className="text-sm text-red-600 dark:text-red-300 mt-1">
              Unable to generate AI analysis. Please try again later.
            </p>
            <Button onClick={() => refetch()} variant="outline" size="sm" className="mt-3">
              Try Again
            </Button>
          </div>
        ) : analysis ? (
          <Tabs defaultValue="summary" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full mb-4">
              <TabsTrigger value="summary" className="flex-1">
                <BookOpen className="h-4 w-4 mr-2" /> Summary
              </TabsTrigger>
              <TabsTrigger value="keyPoints" className="flex-1">
                <List className="h-4 w-4 mr-2" /> Key Points
              </TabsTrigger>
              <TabsTrigger value="recommendations" className="flex-1">
                <TrendingUp className="h-4 w-4 mr-2" /> Recommendations
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="summary" className="mt-0">
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <p>{analysis.summary}</p>
                
                {analysis.citations && analysis.citations.length > 0 && (
                  <>
                    <h4 className="text-sm font-medium mt-4">Citations & References</h4>
                    <ul className="mt-2">
                      {analysis.citations.map((citation, index) => (
                        <li key={index} className="text-sm">
                          {citation}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="keyPoints" className="mt-0 space-y-4">
              {analysis.keyPoints.map((point, index) => (
                <div key={index} className="flex gap-3">
                  <Badge variant="outline" className="h-6 flex items-center justify-center">
                    {index + 1}
                  </Badge>
                  <p className="text-sm">{point}</p>
                </div>
              ))}
            </TabsContent>
            
            <TabsContent value="recommendations" className="mt-0">
              <div className="space-y-3">
                {analysis.recommendations.map((recommendation, index) => (
                  <div key={index} className="p-3 bg-muted/50 rounded-md">
                    <p className="text-sm">{recommendation}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="text-center py-8">
            <Lightbulb className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-lg font-medium text-muted-foreground">AI Analysis</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-4">
              Generate an AI-powered analysis to better understand this {documentType === "judicial" ? "judicial decision" : "labor contract"}.
            </p>
            <Button 
              onClick={() => refetch()} 
              variant="default"
              className="gap-2"
            >
              <Lightbulb className="h-4 w-4" />
              Generate Analysis
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}