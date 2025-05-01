import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { JudicialDecision, LaborContract } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen, Lightbulb, Link, CheckSquare, AlertTriangle } from 'lucide-react';

interface AIAnalysisPanelProps {
  document: JudicialDecision | LaborContract;
  documentType: "judicial" | "contract";
  className?: string;
}

interface AnalysisResult {
  summary: string;
  keyPoints: string[];
  citations: string[];
  recommendations: string[];
}

export function AIAnalysisPanel({ document, documentType, className }: AIAnalysisPanelProps) {
  const [activeTab, setActiveTab] = useState('analysis');

  const { data: analysis, isLoading, error } = useQuery({
    queryKey: [
      documentType === 'judicial' 
        ? `/api/ai/analyze-judicial?id=${document.id}` 
        : `/api/ai/analyze-contract?id=${document.id}`
    ],
    queryFn: ({ queryKey }) => apiRequest<AnalysisResult>(queryKey[0])
  });

  if (error) {
    return (
      <Card className={cn("w-full", className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            AI Analysis Error
          </CardTitle>
          <CardDescription>
            There was a problem generating the AI analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {error instanceof Error ? error.message : "Unknown error occurred. Please try again later."}
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-primary" />
          AI Document Analysis
        </CardTitle>
        <CardDescription>
          Generated insights and analysis for this {documentType === 'judicial' ? 'judicial decision' : 'labor contract'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="analysis">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="analysis">Analysis & Key Points</TabsTrigger>
            <TabsTrigger value="citations">Citations & Recommendations</TabsTrigger>
          </TabsList>
          <TabsContent value="analysis" className="mt-4 space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                <BookOpen className="h-4 w-4 text-primary" /> Summary
              </h4>
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-[80%]" />
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">{analysis?.summary}</p>
              )}
            </div>
            
            <Separator />
            
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                <CheckSquare className="h-4 w-4 text-primary" /> Key Points
              </h4>
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-[90%]" />
                  <Skeleton className="h-4 w-[70%]" />
                </div>
              ) : (
                <ul className="text-sm text-muted-foreground space-y-1 pl-5 list-disc">
                  {analysis?.keyPoints.map((point, index) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="citations" className="mt-4 space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                <Link className="h-4 w-4 text-primary" /> Citations
              </h4>
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-[85%]" />
                  <Skeleton className="h-4 w-[75%]" />
                </div>
              ) : (
                <ul className="text-sm text-muted-foreground space-y-1 pl-5 list-disc">
                  {analysis?.citations.map((citation, index) => (
                    <li key={index}>{citation}</li>
                  ))}
                </ul>
              )}
            </div>
            
            <Separator />
            
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                <Lightbulb className="h-4 w-4 text-primary" /> Recommendations
              </h4>
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-[80%]" />
                </div>
              ) : (
                <ul className="text-sm text-muted-foreground space-y-1 pl-5 list-disc">
                  {analysis?.recommendations.map((recommendation, index) => (
                    <li key={index}>{recommendation}</li>
                  ))}
                </ul>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}