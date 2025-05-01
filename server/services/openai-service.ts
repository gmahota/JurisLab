import OpenAI from "openai";
import { JudicialDecision, LaborContract } from "@shared/schema";

// Initialize OpenAI client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// The newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const MODEL = "gpt-4o";

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

function safeJsonParse<T>(jsonString: string | null, defaultValue: T): T {
  if (!jsonString) return defaultValue;
  
  try {
    return JSON.parse(jsonString) as T;
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return defaultValue;
  }
}

export const openaiService = {
  /**
   * Analyze a judicial decision document
   */
  async analyzeJudicialDecision(decision: JudicialDecision): Promise<AnalysisResult> {
    try {
      const prompt = `
        Analyze this judicial decision and provide a detailed analysis in JSON format:
        
        Title: ${decision.title}
        Court: ${decision.court}
        Date: ${decision.date}
        Jurisdiction: ${decision.jurisdiction}
        Case Number: ${decision.caseNumber}
        Judges: ${decision.judges}
        Parties: ${decision.parties}
        Content: ${decision.content.substring(0, 4000)}
        
        Provide your analysis in the following JSON format:
        {
          "summary": "A concise summary of the decision in 3-4 sentences",
          "keyPoints": ["list of 3-5 key legal points from the decision"],
          "citations": ["list of significant legal precedents or statutes cited"],
          "recommendations": ["list of 2-3 actionable insights or implications for legal practitioners"]
        }
      `;

      const response = await openai.chat.completions.create({
        model: MODEL,
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
      });

      const content = response.choices[0].message.content;
      const defaultResult: AnalysisResult = {
        summary: "Could not generate summary.",
        keyPoints: ["No key points could be extracted."],
        citations: ["No citations could be extracted."],
        recommendations: ["No recommendations could be generated."]
      };
      
      return safeJsonParse<AnalysisResult>(content, defaultResult);
    } catch (error) {
      console.error("Error analyzing judicial decision:", error);
      return {
        summary: "Error analyzing decision.",
        keyPoints: ["Analysis failed."],
        citations: [],
        recommendations: ["Try again later."]
      };
    }
  },

  /**
   * Analyze a labor contract document
   */
  async analyzeLaborContract(contract: LaborContract): Promise<AnalysisResult> {
    try {
      const prompt = `
        Analyze this labor contract and provide a detailed analysis in JSON format:
        
        Title: ${contract.title}
        Type: ${contract.contractType}
        Employer: ${contract.company}
        Industry: ${contract.industry}
        Effective Date: ${contract.effectiveDate}
        Expiration Date: ${contract.expirationDate}
        Content: ${contract.content.substring(0, 4000)}
        
        Provide your analysis in the following JSON format:
        {
          "summary": "A concise summary of the contract in 3-4 sentences",
          "keyPoints": ["list of 3-5 key clauses or provisions"],
          "citations": ["list of any laws or regulations referenced"],
          "recommendations": ["list of 2-3 considerations or potential issues to be aware of"]
        }
      `;

      const response = await openai.chat.completions.create({
        model: MODEL,
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
      });

      const content = response.choices[0].message.content;
      const defaultResult: AnalysisResult = {
        summary: "Could not generate summary.",
        keyPoints: ["No key points could be extracted."],
        citations: ["No citations could be extracted."],
        recommendations: ["No recommendations could be generated."]
      };
      
      return safeJsonParse<AnalysisResult>(content, defaultResult);
    } catch (error) {
      console.error("Error analyzing labor contract:", error);
      return {
        summary: "Error analyzing contract.",
        keyPoints: ["Analysis failed."],
        citations: [],
        recommendations: ["Try again later."]
      };
    }
  },

  /**
   * Compare multiple documents and generate comparative analysis
   */
  async compareDocuments(
    primaryDoc: JudicialDecision | LaborContract,
    relatedDocs: Array<JudicialDecision | LaborContract>,
    documentType: "judicial" | "contract"
  ): Promise<{ summary: string; similarities: string[]; differences: string[]; insights: string[] }> {
    try {
      // Prepare document summaries for comparison
      const primarySummary = `
        Title: ${primaryDoc.title}
        ${documentType === "judicial" 
          ? `Court: ${(primaryDoc as JudicialDecision).court}, Jurisdiction: ${(primaryDoc as JudicialDecision).jurisdiction}`
          : `Type: ${(primaryDoc as LaborContract).contractType}, Industry: ${(primaryDoc as LaborContract).industry}`
        }
        Content excerpt: ${primaryDoc.content.substring(0, 500)}...
      `;
      
      const relatedSummaries = relatedDocs.map((doc, index) => `
        Related Document ${index + 1}:
        Title: ${doc.title}
        ${documentType === "judicial" 
          ? `Court: ${(doc as JudicialDecision).court}, Jurisdiction: ${(doc as JudicialDecision).jurisdiction}`
          : `Type: ${(doc as LaborContract).contractType}, Industry: ${(doc as LaborContract).industry}`
        }
        Content excerpt: ${doc.content.substring(0, 300)}...
      `).join("\n\n");

      const prompt = `
        Compare the primary ${documentType === "judicial" ? "judicial decision" : "labor contract"} with the related documents.
        
        Primary Document:
        ${primarySummary}
        
        Related Documents:
        ${relatedSummaries}
        
        Provide a comparative analysis in the following JSON format:
        {
          "summary": "A concise summary of the comparison",
          "similarities": ["list of key similarities between the documents"],
          "differences": ["list of important differences between the documents"],
          "insights": ["list of insights or conclusions from this comparison"]
        }
      `;

      const response = await openai.chat.completions.create({
        model: MODEL,
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
      });

      const content = response.choices[0].message.content;
      const defaultResult = {
        summary: "Could not generate comparison.",
        similarities: ["No similarities could be found."],
        differences: ["No differences could be found."],
        insights: ["No insights could be generated."]
      };
      
      return safeJsonParse(content, defaultResult);
    } catch (error) {
      console.error("Error comparing documents:", error);
      return {
        summary: "Error generating comparison.",
        similarities: ["Comparison failed."],
        differences: ["Comparison failed."],
        insights: ["Try again later."]
      };
    }
  },

  /**
   * Extract keywords from document text
   */
  async extractKeywords(text: string, documentType: "judicial" | "contract"): Promise<KeywordResult> {
    try {
      const prompt = `
        Extract important keywords and provide a brief summary from this ${
          documentType === "judicial" ? "judicial decision" : "labor contract"
        } text excerpt:
        
        ${text.substring(0, 3000)}
        
        Provide your analysis in the following JSON format:
        {
          "keywords": ["list of 10-15 important keywords or phrases from the text"],
          "summary": "A concise 2-3 sentence summary of the main points"
        }
      `;

      const response = await openai.chat.completions.create({
        model: MODEL,
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
      });

      const content = response.choices[0].message.content;
      const defaultResult: KeywordResult = {
        keywords: ["No keywords could be extracted."],
        summary: "Could not generate summary."
      };
      
      return safeJsonParse<KeywordResult>(content, defaultResult);
    } catch (error) {
      console.error("Error extracting keywords:", error);
      return {
        keywords: ["Error extracting keywords."],
        summary: "Keyword extraction failed."
      };
    }
  },

  /**
   * Identify legal trends from a collection of documents
   */
  async identifyLegalTrends(
    recentDecisions: JudicialDecision[],
    recentContracts: LaborContract[]
  ): Promise<TrendsResult> {
    try {
      // Prepare summaries of recent documents
      const decisionSummaries = recentDecisions.slice(0, 5).map((decision, i) => `
        Decision ${i + 1}: ${decision.title}
        Jurisdiction: ${decision.jurisdiction}
        Date: ${decision.date}
        Topics: ${decision.topics ? decision.topics.join(", ") : "N/A"}
      `).join("\n");
      
      const contractSummaries = recentContracts.slice(0, 5).map((contract, i) => `
        Contract ${i + 1}: ${contract.title}
        Industry: ${contract.industry}
        Type: ${contract.contractType}
        Effective Date: ${contract.effectiveDate}
      `).join("\n");

      const prompt = `
        Based on these recent judicial decisions and labor contracts, identify current legal trends:
        
        Recent Judicial Decisions:
        ${decisionSummaries}
        
        Recent Labor Contracts:
        ${contractSummaries}
        
        Provide your analysis in the following JSON format:
        {
          "emergingTrends": [
            {"title": "Trend Title 1", "content": "Description of trend", "trend": "up"}, 
            {"title": "Trend Title 2", "content": "Description of trend", "trend": "down"},
            {"title": "Trend Title 3", "content": "Description of trend", "trend": "neutral"}
          ],
          "topTopics": [
            {"name": "Topic 1", "percentage": 35}, 
            {"name": "Topic 2", "percentage": 25},
            {"name": "Topic 3", "percentage": 20},
            {"name": "Topic 4", "percentage": 15},
            {"name": "Other", "percentage": 5}
          ],
          "industrySummary": "A paragraph summarizing overall industry and legal environment"
        }
      `;

      const response = await openai.chat.completions.create({
        model: MODEL,
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
      });

      const content = response.choices[0].message.content;
      const defaultResult: TrendsResult = {
        emergingTrends: [
          { title: "No trend data", content: "Could not analyze trends", trend: "neutral" }
        ],
        topTopics: [
          { name: "No data", percentage: 100 }
        ],
        industrySummary: "Could not generate industry summary."
      };
      
      return safeJsonParse<TrendsResult>(content, defaultResult);
    } catch (error) {
      console.error("Error identifying legal trends:", error);
      return {
        emergingTrends: [
          { title: "Error", content: "Error analyzing trends", trend: "neutral" }
        ],
        topTopics: [
          { name: "Error", percentage: 100 }
        ],
        industrySummary: "Error generating industry summary."
      };
    }
  },

  /**
   * Generate personalized insights based on user history
   */
  async generatePersonalizedInsights(
    viewHistory: { documentType: string; documentId: number; title: string; action: string; createdAt: Date }[]
  ): Promise<Array<{ title: string; content: string }>> {
    try {
      // Format history for the prompt
      const historyText = viewHistory.slice(0, 10).map((item, i) => `
        Item ${i + 1}:
        Type: ${item.documentType}
        Title: ${item.title}
        Action: ${item.action}
        Date: ${item.createdAt.toISOString().split('T')[0]}
      `).join("\n");

      const prompt = `
        Based on this user's viewing history, generate personalized insights:
        
        User History:
        ${historyText}
        
        Generate 3 personalized insights in the following JSON format:
        [
          {"title": "Insight Title 1", "content": "Detailed content for insight 1"},
          {"title": "Insight Title 2", "content": "Detailed content for insight 2"},
          {"title": "Insight Title 3", "content": "Detailed content for insight 3"}
        ]
      `;

      const response = await openai.chat.completions.create({
        model: MODEL,
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
      });

      const content = response.choices[0].message.content;
      const defaultResult = [
        { title: "No insights available", content: "We don't have enough data to generate personalized insights yet." }
      ];
      
      return safeJsonParse(content, defaultResult);
    } catch (error) {
      console.error("Error generating personalized insights:", error);
      return [
        { title: "Error generating insights", content: "There was a problem generating your personalized insights." }
      ];
    }
  },

  /**
   * AI-powered search for documents
   */
  async searchDocuments(query: string): Promise<{ results: SearchResult[] }> {
    try {
      // In a real implementation, this would use embeddings or semantic search
      // For now, we'll simulate this with a request to OpenAI
      const prompt = `
        You are a legal research assistant. Given the user's search query, generate 5 hypothetical search results
        that might match. Create plausible document IDs, titles, and calculate a relevance score.
        
        Search query: "${query}"
        
        Respond in the following JSON format:
        {
          "results": [
            {"id": 123, "title": "Document Title 1", "relevanceScore": 0.95, "documentType": "judicial"},
            {"id": 456, "title": "Document Title 2", "relevanceScore": 0.82, "documentType": "contract"},
            {"id": 789, "title": "Document Title 3", "relevanceScore": 0.78, "documentType": "judicial"},
            {"id": 101, "title": "Document Title 4", "relevanceScore": 0.75, "documentType": "contract"},
            {"id": 112, "title": "Document Title 5", "relevanceScore": 0.70, "documentType": "judicial"}
          ]
        }
        
        Ensure the document titles sound like realistic legal documents and that they clearly relate to the search query.
        The documentType should be either "judicial" or "contract".
        Relevance scores should be between 0 and 1.
      `;

      const response = await openai.chat.completions.create({
        model: MODEL,
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
      });

      const content = response.choices[0].message.content;
      const defaultResult = {
        results: [
          { 
            id: 0, 
            title: "No search results found", 
            relevanceScore: 0, 
            documentType: "judicial" as const
          }
        ]
      };
      
      return safeJsonParse(content, defaultResult);
    } catch (error) {
      console.error("Error searching documents:", error);
      return {
        results: [
          { 
            id: 0, 
            title: "Search error occurred", 
            relevanceScore: 0, 
            documentType: "judicial" as const
          }
        ]
      };
    }
  }
};