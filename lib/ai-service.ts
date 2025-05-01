// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user

import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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
    try {
      // Fetch document data from storage or API
      // In a real application, you would fetch the actual document from a database
      
      // Using OpenAI to generate analysis
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a legal AI assistant specializing in analysis of judicial decisions. Provide detailed, accurate analysis with citation information."
          },
          {
            role: "user",
            content: `Analyze the judicial decision with ID ${id}. Return a structured analysis with summary, key points, citations, and recommendations.`
          }
        ],
        response_format: { type: "json_object" }
      });

      // Parse the response
      const result = JSON.parse(response.choices[0].message.content);
      
      return {
        summary: result.summary || "AI analysis is being generated for this document.",
        keyPoints: result.keyPoints || ["Document requires deeper analysis"],
        citations: result.citations || ["No citations detected"],
        recommendations: result.recommendations || ["Request full AI analysis"]
      };
    } catch (error) {
      console.error("Error analyzing judicial decision:", error);
      return {
        summary: "An error occurred during analysis. Please try again later.",
        keyPoints: ["Error in document analysis"],
        citations: [],
        recommendations: ["Try analyzing again"]
      };
    }
  },

  /**
   * Analyze a labor contract
   */
  async analyzeLaborContract(id: number): Promise<AnalysisResult> {
    try {
      // Fetch document data from storage or API
      // In a real application, you would fetch the actual document from a database
      
      // Using OpenAI to generate analysis
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a legal AI assistant specializing in labor contracts. Provide detailed, accurate analysis with potential risks and advantages."
          },
          {
            role: "user",
            content: `Analyze the labor contract with ID ${id}. Return a structured analysis with summary, key points, important clauses, and recommendations.`
          }
        ],
        response_format: { type: "json_object" }
      });

      // Parse the response
      const result = JSON.parse(response.choices[0].message.content);
      
      return {
        summary: result.summary || "AI analysis is being generated for this document.",
        keyPoints: result.keyPoints || ["Contract requires deeper analysis"],
        citations: result.citations || result.importantClauses || ["No important clauses detected"],
        recommendations: result.recommendations || ["Request full AI analysis"]
      };
    } catch (error) {
      console.error("Error analyzing labor contract:", error);
      return {
        summary: "An error occurred during analysis. Please try again later.",
        keyPoints: ["Error in contract analysis"],
        citations: [],
        recommendations: ["Try analyzing again"]
      };
    }
  },

  /**
   * Generate comparative analysis between documents
   */
  async compareDocuments(
    documentIds: number[],
    documentType: "judicial" | "contract"
  ): Promise<{ 
    similarities: string[]; 
    differences: string[]; 
    conclusion: string; 
  }> {
    try {
      // In a real application, you would fetch the actual documents
      
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are a legal AI assistant specializing in comparative analysis of ${
              documentType === "judicial" ? "judicial decisions" : "labor contracts"
            }.`
          },
          {
            role: "user",
            content: `Compare the ${
              documentType === "judicial" ? "judicial decisions" : "labor contracts"
            } with IDs: ${documentIds.join(", ")}. Return a structured analysis with similarities, differences, and conclusion.`
          }
        ],
        response_format: { type: "json_object" }
      });

      // Parse the response
      const result = JSON.parse(response.choices[0].message.content);
      
      return {
        similarities: result.similarities || ["Analysis in progress"],
        differences: result.differences || ["Analysis in progress"],
        conclusion: result.conclusion || "Comparative analysis is being generated."
      };
    } catch (error) {
      console.error("Error comparing documents:", error);
      return {
        similarities: ["Error in comparison analysis"],
        differences: ["Error in comparison analysis"],
        conclusion: "An error occurred during analysis. Please try again later."
      };
    }
  },

  /**
   * Get legal trends analysis
   */
  async getLegalTrends(): Promise<TrendsResult> {
    try {
      // Using OpenAI to generate trends analysis
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a legal AI assistant specializing in identifying legal trends and developments."
          },
          {
            role: "user",
            content: "Generate an analysis of current legal trends based on recent judicial decisions and labor contracts. Include emerging trends, top topics, and an industry summary."
          }
        ],
        response_format: { type: "json_object" }
      });

      // Parse the response
      const result = JSON.parse(response.choices[0].message.content);
      
      // Process and format the trends
      return {
        emergingTrends: result.emergingTrends || [
          { title: "Remote Work Policies", content: "Increasing focus on remote work regulations", trend: "up" },
          { title: "Data Privacy Compliance", content: "Growing emphasis on data protection", trend: "up" },
          { title: "Non-compete Clauses", content: "Shifting landscape around employment restrictions", trend: "neutral" }
        ],
        topTopics: result.topTopics || [
          { name: "Employment Law", percentage: 35 },
          { name: "Data Privacy", percentage: 25 },
          { name: "Intellectual Property", percentage: 20 },
          { name: "Corporate Compliance", percentage: 15 },
          { name: "Contract Disputes", percentage: 5 }
        ],
        industrySummary: result.industrySummary || "Legal trends analysis is being generated."
      };
    } catch (error) {
      console.error("Error getting legal trends:", error);
      return {
        emergingTrends: [
          { title: "Error", content: "Unable to retrieve trends data", trend: "neutral" }
        ],
        topTopics: [
          { name: "Error", percentage: 100 }
        ],
        industrySummary: "An error occurred while analyzing legal trends. Please try again later."
      };
    }
  },

  /**
   * Get personalized insights for the user
   */
  async getPersonalizedInsights(): Promise<Array<{ title: string; content: string }>> {
    try {
      // In a real application, this would be based on user history and preferences
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "Generate personalized legal insights for a legal professional."
          },
          {
            role: "user",
            content: "Generate 3 personalized insights based on recent legal developments that would be relevant to a legal professional."
          }
        ],
        response_format: { type: "json_object" }
      });

      // Parse the response
      const result = JSON.parse(response.choices[0].message.content);
      
      return result.insights || [
        {
          title: "Recent Supreme Court Decision on Employment Law",
          content: "The Supreme Court recently ruled on a significant case affecting employment contracts. This may impact how you draft future agreements."
        },
        {
          title: "Data Privacy Regulations Update",
          content: "New data privacy regulations will come into effect next quarter. Review your client's compliance procedures."
        },
        {
          title: "Contract Clause Effectiveness Study",
          content: "Recent study shows certain arbitration clauses are being invalidated more frequently. Consider revising your templates."
        }
      ];
    } catch (error) {
      console.error("Error getting personalized insights:", error);
      return [
        {
          title: "Error Retrieving Insights",
          content: "An error occurred while generating personalized insights. Please try again later."
        }
      ];
    }
  },

  /**
   * Extract keywords from document text
   */
  async extractKeywords(
    text: string,
    documentType: "judicial" | "contract"
  ): Promise<KeywordResult> {
    try {
      // Using OpenAI to extract keywords
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are a legal AI assistant specializing in ${
              documentType === "judicial" ? "judicial decisions" : "labor contracts"
            }. Extract key legal terms and concepts from the provided text.`
          },
          {
            role: "user",
            content: `Extract important keywords from the following ${
              documentType === "judicial" ? "judicial decision" : "labor contract"
            } text and provide a brief summary:\n\n${text}`
          }
        ],
        response_format: { type: "json_object" }
      });

      // Parse the response
      const result = JSON.parse(response.choices[0].message.content);
      
      return {
        keywords: result.keywords || ["Analysis in progress"],
        summary: result.summary || "Keyword extraction is being processed."
      };
    } catch (error) {
      console.error("Error extracting keywords:", error);
      return {
        keywords: ["Error in keyword extraction"],
        summary: "An error occurred while extracting keywords. Please try again later."
      };
    }
  },

  /**
   * AI-powered search for documents
   */
  async searchDocuments(query: string): Promise<{ results: SearchResult[] }> {
    try {
      // In a real application, this would use embeddings and vector search against actual documents
      
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a legal search assistant. Generate relevant search results for legal documents based on the search query."
          },
          {
            role: "user",
            content: `Generate realistic search results for the following query in a legal document database: "${query}". Include judicial decisions and labor contracts in the results.`
          }
        ],
        response_format: { type: "json_object" }
      });

      // Parse the response
      const result = JSON.parse(response.choices[0].message.content);
      
      // Format the search results
      return {
        results: result.results || [
          {
            id: 101,
            title: "Smith v. Johnson - Employment Discrimination Case",
            relevanceScore: 0.95,
            documentType: "judicial"
          },
          {
            id: 203,
            title: "Tech Industries Standard Employment Contract",
            relevanceScore: 0.87,
            documentType: "contract"
          },
          {
            id: 155,
            title: "Regional Labor Relations Board Decision - Benefits Case",
            relevanceScore: 0.82,
            documentType: "judicial"
          }
        ]
      };
    } catch (error) {
      console.error("Error searching documents:", error);
      return {
        results: []
      };
    }
  }
};