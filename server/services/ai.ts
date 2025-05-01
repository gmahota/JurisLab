import OpenAI from "openai";
import { aiInsights, JudicialDecision, LaborContract } from "@shared/schema";
import { db } from "@db";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Utility function to safely parse JSON
function safeJsonParse<T>(jsonString: string | null, defaultValue: T): T {
  if (!jsonString) return defaultValue;
  
  try {
    return JSON.parse(jsonString) as T;
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return defaultValue;
  }
}

interface AnalysisResult {
  summary: string;
  keyPoints: string[];
  citations: string[];
  recommendations: string[];
}

export const aiService = {
  /**
   * Analyzes a judicial decision and generates insights
   */
  async analyzeJudicialDecision(decision: JudicialDecision): Promise<AnalysisResult> {
    try {
      const prompt = `
        Analyze this judicial decision in detail and provide insights on it:
        
        Title: ${decision.title}
        Case Number: ${decision.caseNumber}
        Jurisdiction: ${decision.jurisdiction}
        Date: ${decision.date}
        Judge: ${decision.judge}
        Parties: ${decision.parties}
        
        Summary: ${decision.summary}
        
        Please provide a comprehensive analysis with the following structure:
        1. A thorough summary of the decision (2-3 paragraphs)
        2. 3-5 key points or takeaways from the decision
        3. Identification of important legal precedents or citations referenced
        4. Potential implications for future labor cases or contracts
        
        Format your response as JSON with the fields: summary, keyPoints (array), citations (array), and recommendations (array).
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
      });
      
      const defaultResult: AnalysisResult = {
        summary: "Analysis could not be generated",
        keyPoints: ["No analysis available"],
        citations: [],
        recommendations: []
      };
      const result = safeJsonParse(response.choices[0].message.content, defaultResult);
      
      // Save the analysis as an AI insight
      await db.insert(aiInsights).values({
        title: `Analysis of ${decision.title}`,
        content: result.summary,
        documentType: "judicial",
        documentId: decision.id,
        insightType: "analysis",
        createdAt: new Date()
      });
      
      return result;
    } catch (error) {
      console.error("Error analyzing judicial decision:", error);
      throw new Error("Failed to analyze judicial decision");
    }
  },
  
  /**
   * Analyzes a labor contract and generates insights
   */
  async analyzeLaborContract(contract: LaborContract): Promise<AnalysisResult> {
    try {
      const prompt = `
        Analyze this labor contract in detail and provide insights on it:
        
        Title: ${contract.title}
        Contract Type: ${contract.contractType}
        Industry: ${contract.industry}
        
        Description: ${contract.description}
        
        Please provide a comprehensive analysis with the following structure:
        1. A summary of the contract and its key provisions (2-3 paragraphs)
        2. 3-5 key points or notable clauses
        3. Potential legal considerations or compliance issues
        4. Recommendations for improvements or modifications
        
        Format your response as JSON with the fields: summary, keyPoints (array), citations (array), and recommendations (array).
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
      });
      
      const defaultResult: AnalysisResult = {
        summary: "Analysis could not be generated",
        keyPoints: ["No analysis available"],
        citations: [],
        recommendations: []
      };
      const result = safeJsonParse(response.choices[0].message.content, defaultResult);
      
      // Save the analysis as an AI insight
      await db.insert(aiInsights).values({
        title: `Analysis of ${contract.title}`,
        content: result.summary,
        documentType: "contract",
        documentId: contract.id,
        insightType: "analysis",
        createdAt: new Date()
      });
      
      return result;
    } catch (error) {
      console.error("Error analyzing labor contract:", error);
      throw new Error("Failed to analyze labor contract");
    }
  },
  
  /**
   * Compares a document with related documents and generates insights
   */
  async generateComparativeAnalysis(
    document: JudicialDecision | LaborContract, 
    relatedDocuments: Array<JudicialDecision | LaborContract>,
    documentType: "judicial" | "contract"
  ): Promise<string> {
    try {
      const docTitle = document.title;
      const relatedTitles = relatedDocuments.map(doc => doc.title).join(", ");
      
      const prompt = `
        Compare this ${documentType === "judicial" ? "judicial decision" : "labor contract"}: "${docTitle}"
        with these related ${documentType === "judicial" ? "decisions" : "contracts"}: ${relatedTitles}.
        
        Based on your analysis, provide insights on:
        1. Common themes or principles across these documents
        2. Notable differences in approach or outcomes
        3. Trends that are evident from comparing these documents
        4. How this document fits within the broader legal context
        
        Provide a concise but insightful comparative analysis.
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }]
      });
      
      return response.choices[0].message.content || "No analysis could be generated.";
    } catch (error) {
      console.error("Error generating comparative analysis:", error);
      throw new Error("Failed to generate comparative analysis");
    }
  },
  
  /**
   * Identifies legal trends based on a collection of documents
   */
  async identifyLegalTrends(
    recentDecisions: JudicialDecision[],
    recentContracts: LaborContract[]
  ): Promise<{
    emergingTrends: Array<{ title: string; content: string; trend: "up" | "down" | "neutral" }>;
    topTopics: Array<{ name: string; percentage: number }>;
    industrySummary: string;
  }> {
    try {
      // Prepare data for the trends analysis
      const decisionTitles = recentDecisions.map(d => d.title).join(", ");
      const decisionCategories = recentDecisions.map(d => d.category);
      const contractTypes = recentContracts.map(c => c.contractType);
      const industries = recentContracts.map(c => c.industry);
      
      const prompt = `
        Based on the following recent judicial decisions and labor contracts, identify emerging legal trends in labor law:
        
        Recent judicial decisions: ${decisionTitles}
        
        Decision categories: ${decisionCategories.join(", ")}
        Contract types: ${contractTypes.join(", ")}
        Industries: ${industries.join(", ")}
        
        Please analyze this data and provide:
        1. Three emerging trends in labor law, including a title, brief description, and trend direction (up/down/neutral)
        2. The top 5 legal topics by frequency, with approximate percentage
        3. A brief summary of industry-specific patterns
        
        Format your response as JSON with the fields: 
        - emergingTrends (array with objects containing title, content, and trend fields)
        - topTopics (array with objects containing name and percentage fields)
        - industrySummary (string)
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
      });
      
      const defaultResult = {
        emergingTrends: [{ title: "No data", content: "Insufficient data to determine trends", trend: "neutral" as const }],
        topTopics: [{ name: "No data", percentage: 0 }],
        industrySummary: "Insufficient data to generate summary"
      };
      
      return safeJsonParse(response.choices[0].message.content, defaultResult);
    } catch (error) {
      console.error("Error identifying legal trends:", error);
      throw new Error("Failed to identify legal trends");
    }
  },
  
  /**
   * Generates custom insights for a user based on their history
   */
  async generatePersonalizedInsights(
    favoriteDecisions: JudicialDecision[],
    favoriteContracts: LaborContract[],
    viewHistory: { documentType: string; documentId: number; action: string; createdAt: Date }[]
  ): Promise<Array<{ title: string; content: string }>> {
    try {
      // Prepare data for personalized insights
      const favDecisionTitles = favoriteDecisions.map(d => d.title).join(", ");
      const favContractTitles = favoriteContracts.map(c => c.title).join(", ");
      const recentActions = viewHistory
        .slice(0, 10)
        .map(h => `${h.action} a ${h.documentType} document`)
        .join(", ");
      
      const prompt = `
        Based on a user's favorites and history, generate personalized insights and recommendations.
        
        Favorite judicial decisions: ${favDecisionTitles}
        Favorite labor contracts: ${favContractTitles}
        Recent activity: ${recentActions}
        
        Please provide 3 personalized insights that would be valuable to this user, such as:
        - Recommendations for documents they might find interesting
        - Patterns in their viewing or download behavior
        - Suggestions related to their favorite topics
        - Recent developments in areas they've shown interest in
        
        Format your response as JSON with an array of objects, each having title and content fields.
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
      });
      
      const insights = JSON.parse(response.choices[0].message.content) as Array<{ title: string; content: string }>;
      
      // Save the personalized insights
      for (const insight of insights) {
        await db.insert(aiInsights).values({
          title: insight.title,
          content: insight.content,
          documentType: null,
          documentId: null,
          insightType: "personalized",
          createdAt: new Date()
        });
      }
      
      return insights;
    } catch (error) {
      console.error("Error generating personalized insights:", error);
      throw new Error("Failed to generate personalized insights");
    }
  },
  
  /**
   * Extracts keywords and summarizes a document
   */
  async extractDocumentKeywords(text: string, documentType: "judicial" | "contract"): Promise<{
    keywords: string[];
    summary: string;
  }> {
    try {
      const prompt = `
        Analyze this ${documentType === "judicial" ? "judicial decision" : "labor contract"} text and extract:
        1. A list of 5-10 relevant keywords or phrases that capture the main topics
        2. A concise summary (no more than 100 words)
        
        Text: ${text.substring(0, 4000)} ${text.length > 4000 ? '[text truncated]' : ''}
        
        Format your response as JSON with the fields: keywords (array) and summary (string).
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
      });
      
      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error("Error extracting document keywords:", error);
      throw new Error("Failed to extract document keywords");
    }
  },
  
  /**
   * Suggests relevant documents based on user query
   */
  async suggestRelevantDocuments(
    query: string,
    allDocuments: Array<JudicialDecision | LaborContract>,
  ): Promise<Array<{ id: number; title: string; relevanceScore: number; documentType: "judicial" | "contract" }>> {
    try {
      // Create a list of document titles with IDs and types
      const documentList = allDocuments.map(doc => {
        const isJudicial = 'caseNumber' in doc;
        return {
          id: doc.id,
          title: doc.title,
          description: isJudicial ? (doc as JudicialDecision).summary : (doc as LaborContract).description,
          type: isJudicial ? "judicial" : "contract"
        };
      });
      
      const prompt = `
        A user is searching for: "${query}"
        
        Here are available documents:
        ${documentList.map(doc => `ID ${doc.id} (${doc.type}): ${doc.title} - ${doc.description.substring(0, 100)}...`).join('\n')}
        
        Determine the 5 most relevant documents to this query. For each document, assign a relevance score from 0-100.
        
        Format your response as JSON with an array of objects, each containing id, title, relevanceScore, and documentType.
        Sort the results by relevanceScore in descending order.
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
      });
      
      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error("Error suggesting relevant documents:", error);
      throw new Error("Failed to suggest relevant documents");
    }
  }
};