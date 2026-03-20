import { apiRequest } from "./queryClient";
import { JudicialDecision, LaborContract } from "@shared/schema";

interface AnalysisResult {
  summary: string;
  keyPoints: string[];
  citations: string[];
  recommendations: string[];
}

interface KeywordResult {
  keywords: string[];
  summary: string;
}

interface TrendsResult {
  emergingTrends: Array<{ title: string; content: string; trend: "up" | "down" | "neutral" }>;
  topTopics: Array<{ name: string; percentage: number }>;
  industrySummary: string;
}

interface SearchResult {
  id: number;
  title: string;
  relevanceScore: number;
  documentType: "judicial" | "contract";
}

export const aiService = {
  /**
   * Analyze a judicial decision
   */
  async analyzeJudicialDecision(id: number): Promise<AnalysisResult> {
    const response = await apiRequest<AnalysisResult>("POST", `/api/ai/analyze/judicial/${id}`);
    return response;
  },

  /**
   * Analyze a labor contract
   */
  async analyzeLaborContract(id: number): Promise<AnalysisResult> {
    const response = await apiRequest<AnalysisResult>("POST", `/api/ai/analyze/contract/${id}`);
    return response;
  },

  /**
   * Generate comparative analysis between documents
   */
  async compareDocuments(
    documentId: number,
    documentType: "judicial" | "contract",
    relatedDocumentIds: number[]
  ): Promise<{ analysis: string }> {
    const response = await apiRequest<{ analysis: string }>("POST", "/api/ai/compare", {
      documentId,
      documentType,
      relatedDocumentIds
    });
    return response;
  },

  /**
   * Get legal trends analysis
   */
  async getLegalTrends(): Promise<TrendsResult> {
    const response = await apiRequest<TrendsResult>("GET", "/api/ai/trends");
    return response;
  },

  /**
   * Get personalized insights for the user
   */
  async getPersonalizedInsights(): Promise<Array<{ title: string; content: string }>> {
    const response = await apiRequest<Array<{ title: string; content: string }>>("POST", "/api/ai/personalized-insights");
    return response;
  },

  /**
   * Extract keywords from document text
   */
  async extractKeywords(
    text: string,
    documentType: "judicial" | "contract"
  ): Promise<KeywordResult> {
    const response = await apiRequest<KeywordResult>("POST", "/api/ai/extract-keywords", {
      text,
      documentType
    });
    return response;
  },

  /**
   * AI-powered search for documents
   */
  async searchDocuments(query: string): Promise<{ results: SearchResult[] }> {
    const response = await apiRequest<{ results: SearchResult[] }>("POST", "/api/ai/search", { query });
    return response;
  }
};