import React, { useState, useEffect } from "react";
import { Lightbulb, Loader2, CheckSquare, BookOpen, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { JudicialDecision, LaborContract } from "@shared/schema";
import { aiService } from "@/lib/ai-service";

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
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<"summary" | "keyPoints" | "citations" | "recommendations">("summary");

  const fetchAnalysis = async () => {
    if (!document?.id) return;
    
    setIsAnalyzing(true);
    
    try {
      let result;
      
      if (documentType === "judicial") {
        result = await aiService.analyzeJudicialDecision(document.id);
      } else {
        result = await aiService.analyzeLaborContract(document.id);
      }
      
      setAnalysis(result);
    } catch (error) {
      console.error("Error analyzing document:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    // Reset analysis when document changes
    setAnalysis(null);
  }, [document.id]);

  const analysisData: AnalysisResult = analysis || {
    summary: "",
    keyPoints: [],
    citations: [],
    recommendations: []
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          <span>AI Document Analysis</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!analysis && !isAnalyzing ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-4">
              Let AI analyze this {documentType === "judicial" ? "judicial decision" : "labor contract"} to extract key insights.
            </p>
            <Button onClick={fetchAnalysis}>
              Analyze Document
            </Button>
          </div>
        ) : isAnalyzing ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">
              AI is analyzing this document...
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              This may take a moment.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex gap-1 overflow-x-auto pb-2">
              <Button
                variant={activeTab === "summary" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab("summary")}
              >
                Summary
              </Button>
              <Button
                variant={activeTab === "keyPoints" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab("keyPoints")}
              >
                Key Points
              </Button>
              <Button
                variant={activeTab === "citations" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab("citations")}
              >
                {documentType === "judicial" ? "Citations" : "Important Clauses"}
              </Button>
              <Button
                variant={activeTab === "recommendations" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab("recommendations")}
              >
                Recommendations
              </Button>
            </div>

            <div className="min-h-[200px]">
              {activeTab === "summary" && (
                <div>
                  <p className="text-sm">{analysisData.summary}</p>
                </div>
              )}
              
              {activeTab === "keyPoints" && (
                <ul className="space-y-2">
                  {analysisData.keyPoints.map((point, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckSquare className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{point}</span>
                    </li>
                  ))}
                </ul>
              )}
              
              {activeTab === "citations" && (
                <ul className="space-y-2">
                  {analysisData.citations.map((citation, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <BookOpen className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{citation}</span>
                    </li>
                  ))}
                </ul>
              )}
              
              {activeTab === "recommendations" && (
                <ul className="space-y-2">
                  {analysisData.recommendations.map((recommendation, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{recommendation}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            
            <div className="flex items-center justify-between border-t border-border pt-3 mt-2">
              <Button
                variant="outline" 
                size="sm"
                onClick={fetchAnalysis}
              >
                Regenerate Analysis
              </Button>
              <Badge variant="outline" className="text-xs">
                AI-powered
              </Badge>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}