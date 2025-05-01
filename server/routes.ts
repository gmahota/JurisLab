import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { aiService } from "./services/ai-service";
import { z } from "zod";
import { judicialDecisionInsertSchema, laborContractInsertSchema, userFavoriteInsertSchema, userHistoryInsertSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // All routes are prefixed with /api
  const apiPrefix = "/api";

  // Judicial Decisions
  app.get(`${apiPrefix}/judicial-decisions`, async (req, res) => {
    try {
      const { dateRange, jurisdictions, topics, sortOrder, searchQuery } = req.query;
      
      const decisions = await storage.getJudicialDecisions({
        dateRange: dateRange as string,
        jurisdictions: jurisdictions ? (jurisdictions as string).split(',') : undefined,
        topics: topics ? (topics as string).split(',') : undefined,
        sortOrder: sortOrder as string,
        searchQuery: searchQuery as string
      });
      
      return res.json(decisions);
    } catch (error) {
      console.error('Error fetching judicial decisions:', error);
      return res.status(500).json({ error: 'Failed to fetch judicial decisions' });
    }
  });

  app.get(`${apiPrefix}/judicial-decisions/:id`, async (req, res) => {
    try {
      const { id } = req.params;
      const decision = await storage.getJudicialDecisionById(parseInt(id));
      
      if (!decision) {
        return res.status(404).json({ error: 'Judicial decision not found' });
      }
      
      return res.json(decision);
    } catch (error) {
      console.error('Error fetching judicial decision:', error);
      return res.status(500).json({ error: 'Failed to fetch judicial decision' });
    }
  });

  app.post(`${apiPrefix}/judicial-decisions`, async (req, res) => {
    try {
      const validatedData = judicialDecisionInsertSchema.parse(req.body);
      const newDecision = await storage.createJudicialDecision(validatedData);
      return res.status(201).json(newDecision);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      console.error('Error creating judicial decision:', error);
      return res.status(500).json({ error: 'Failed to create judicial decision' });
    }
  });

  // Labor Contracts
  app.get(`${apiPrefix}/labor-contracts`, async (req, res) => {
    try {
      const { contractTypes, industries, sortOrder, searchQuery, page = '1', limit = '6' } = req.query;
      
      const pageNumber = parseInt(page as string);
      const limitNumber = parseInt(limit as string);
      
      const result = await storage.getLaborContracts({
        contractTypes: contractTypes ? (contractTypes as string).split(',') : undefined,
        industries: industries ? (industries as string).split(',') : undefined,
        sortOrder: sortOrder as string,
        searchQuery: searchQuery as string,
        page: pageNumber,
        limit: limitNumber
      });
      
      return res.json(result);
    } catch (error) {
      console.error('Error fetching labor contracts:', error);
      return res.status(500).json({ error: 'Failed to fetch labor contracts' });
    }
  });

  app.get(`${apiPrefix}/labor-contracts/:id`, async (req, res) => {
    try {
      const { id } = req.params;
      const contract = await storage.getLaborContractById(parseInt(id));
      
      if (!contract) {
        return res.status(404).json({ error: 'Labor contract not found' });
      }
      
      return res.json(contract);
    } catch (error) {
      console.error('Error fetching labor contract:', error);
      return res.status(500).json({ error: 'Failed to fetch labor contract' });
    }
  });

  app.post(`${apiPrefix}/labor-contracts`, async (req, res) => {
    try {
      const validatedData = laborContractInsertSchema.parse(req.body);
      const newContract = await storage.createLaborContract(validatedData);
      return res.status(201).json(newContract);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      console.error('Error creating labor contract:', error);
      return res.status(500).json({ error: 'Failed to create labor contract' });
    }
  });

  app.post(`${apiPrefix}/labor-contracts/:id/download`, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.incrementContractDownloads(parseInt(id));
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error incrementing downloads:', error);
      return res.status(500).json({ error: 'Failed to increment downloads' });
    }
  });

  // Recent Documents
  app.get(`${apiPrefix}/recent-documents`, async (req, res) => {
    try {
      const recentDocuments = await storage.getRecentDocuments();
      return res.json(recentDocuments);
    } catch (error) {
      console.error('Error fetching recent documents:', error);
      return res.status(500).json({ error: 'Failed to fetch recent documents' });
    }
  });

  // Dashboard Stats
  app.get(`${apiPrefix}/dashboard/stats`, async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      return res.json(stats);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return res.status(500).json({ error: 'Failed to fetch dashboard stats' });
    }
  });

  // AI Insights
  app.get(`${apiPrefix}/dashboard/insights`, async (req, res) => {
    try {
      const insights = await storage.getDashboardInsights();
      return res.json(insights);
    } catch (error) {
      console.error('Error fetching dashboard insights:', error);
      return res.status(500).json({ error: 'Failed to fetch dashboard insights' });
    }
  });

  app.get(`${apiPrefix}/ai-insights/recent`, async (req, res) => {
    try {
      const insights = await storage.getRecentAiInsights();
      return res.json(insights);
    } catch (error) {
      console.error('Error fetching recent AI insights:', error);
      return res.status(500).json({ error: 'Failed to fetch recent AI insights' });
    }
  });

  app.get(`${apiPrefix}/ai-insights/trends`, async (req, res) => {
    try {
      const trends = await storage.getAiTrends();
      return res.json(trends);
    } catch (error) {
      console.error('Error fetching AI trends:', error);
      return res.status(500).json({ error: 'Failed to fetch AI trends' });
    }
  });

  // User Favorites
  app.get(`${apiPrefix}/favorites`, async (req, res) => {
    try {
      // In a real app, this would use the authenticated user ID
      const userId = 1; // Mocked user ID
      const favorites = await storage.getUserFavorites(userId);
      return res.json(favorites);
    } catch (error) {
      console.error('Error fetching user favorites:', error);
      return res.status(500).json({ error: 'Failed to fetch user favorites' });
    }
  });

  app.post(`${apiPrefix}/favorites`, async (req, res) => {
    try {
      // In a real app, this would use the authenticated user ID
      const userId = 1; // Mocked user ID
      
      const validatedData = userFavoriteInsertSchema.parse({
        ...req.body,
        userId
      });
      
      await storage.toggleUserFavorite(validatedData);
      return res.status(200).json({ success: true });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      console.error('Error toggling favorite:', error);
      return res.status(500).json({ error: 'Failed to toggle favorite' });
    }
  });

  // User History
  app.get(`${apiPrefix}/history`, async (req, res) => {
    try {
      // In a real app, this would use the authenticated user ID
      const userId = 1; // Mocked user ID
      const type = req.query.type as string | undefined;
      
      const history = await storage.getUserHistory(userId, type);
      return res.json({ activities: history });
    } catch (error) {
      console.error('Error fetching user history:', error);
      return res.status(500).json({ error: 'Failed to fetch user history' });
    }
  });

  app.post(`${apiPrefix}/history`, async (req, res) => {
    try {
      // In a real app, this would use the authenticated user ID
      const userId = 1; // Mocked user ID
      
      const validatedData = userHistoryInsertSchema.parse({
        ...req.body,
        userId
      });
      
      await storage.addUserHistory(validatedData);
      return res.status(200).json({ success: true });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      console.error('Error adding history:', error);
      return res.status(500).json({ error: 'Failed to add history' });
    }
  });

  // Notifications
  app.get(`${apiPrefix}/notifications`, async (req, res) => {
    try {
      // In a real app, this would use the authenticated user ID
      const userId = 1; // Mocked user ID
      
      const notifications = await storage.getUserNotifications(userId);
      return res.json(notifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return res.status(500).json({ error: 'Failed to fetch notifications' });
    }
  });

  // AI Analysis Routes
  app.post(`${apiPrefix}/ai/analyze/judicial/:id`, async (req, res) => {
    try {
      const { id } = req.params;
      const decision = await storage.getJudicialDecisionById(parseInt(id));
      
      if (!decision) {
        return res.status(404).json({ error: 'Judicial decision not found' });
      }
      
      const analysis = await aiService.analyzeJudicialDecision(decision);
      return res.json(analysis);
    } catch (error) {
      console.error('Error analyzing judicial decision:', error);
      return res.status(500).json({ error: 'Failed to analyze judicial decision' });
    }
  });

  app.post(`${apiPrefix}/ai/analyze/contract/:id`, async (req, res) => {
    try {
      const { id } = req.params;
      const contract = await storage.getLaborContractById(parseInt(id));
      
      if (!contract) {
        return res.status(404).json({ error: 'Labor contract not found' });
      }
      
      const analysis = await aiService.analyzeLaborContract(contract);
      return res.json(analysis);
    } catch (error) {
      console.error('Error analyzing labor contract:', error);
      return res.status(500).json({ error: 'Failed to analyze labor contract' });
    }
  });

  app.post(`${apiPrefix}/ai/compare`, async (req, res) => {
    try {
      const { documentId, documentType, relatedDocumentIds } = req.body;
      
      if (!documentId || !documentType || !relatedDocumentIds || !Array.isArray(relatedDocumentIds)) {
        return res.status(400).json({ error: 'Invalid request parameters' });
      }

      // Get the main document
      let document;
      if (documentType === 'judicial') {
        document = await storage.getJudicialDecisionById(documentId);
      } else if (documentType === 'contract') {
        document = await storage.getLaborContractById(documentId);
      }
      
      if (!document) {
        return res.status(404).json({ error: 'Main document not found' });
      }
      
      // Get related documents
      const relatedDocuments = [];
      for (const id of relatedDocumentIds) {
        let relatedDoc;
        if (documentType === 'judicial') {
          relatedDoc = await storage.getJudicialDecisionById(id);
        } else if (documentType === 'contract') {
          relatedDoc = await storage.getLaborContractById(id);
        }
        
        if (relatedDoc) {
          relatedDocuments.push(relatedDoc);
        }
      }
      
      if (relatedDocuments.length === 0) {
        return res.status(404).json({ error: 'No related documents found' });
      }
      
      const analysis = await aiService.generateComparativeAnalysis(
        document, 
        relatedDocuments, 
        documentType as 'judicial' | 'contract'
      );
      
      return res.json({ analysis });
    } catch (error) {
      console.error('Error generating comparative analysis:', error);
      return res.status(500).json({ error: 'Failed to generate comparative analysis' });
    }
  });

  app.get(`${apiPrefix}/ai/trends`, async (req, res) => {
    try {
      // Get recent documents for trend analysis
      const recentDecisions = await storage.getJudicialDecisions({ 
        dateRange: 'year',
        sortOrder: 'date_desc'
      });
      
      const recentContractsResult = await storage.getLaborContracts({
        sortOrder: 'recent',
        limit: 20
      });
      
      const trends = await aiService.identifyLegalTrends(recentDecisions, recentContractsResult.contracts);
      return res.json(trends);
    } catch (error) {
      console.error('Error identifying legal trends:', error);
      return res.status(500).json({ error: 'Failed to identify legal trends' });
    }
  });

  app.post(`${apiPrefix}/ai/personalized-insights`, async (req, res) => {
    try {
      // In a real app, this would use the authenticated user ID
      const userId = 1; // Mocked user ID
      
      // Get user favorites and history
      const favorites = await storage.getUserFavorites(userId);
      const history = await storage.getUserHistory(userId);
      
      const insights = await aiService.generatePersonalizedInsights(
        favorites.judicialDecisions,
        favorites.laborContracts,
        history
      );
      
      return res.json(insights);
    } catch (error) {
      console.error('Error generating personalized insights:', error);
      return res.status(500).json({ error: 'Failed to generate personalized insights' });
    }
  });

  app.post(`${apiPrefix}/ai/extract-keywords`, async (req, res) => {
    try {
      const { text, documentType } = req.body;
      
      if (!text || !documentType) {
        return res.status(400).json({ error: 'Text and document type are required' });
      }
      
      const result = await aiService.extractDocumentKeywords(
        text,
        documentType as 'judicial' | 'contract'
      );
      
      return res.json(result);
    } catch (error) {
      console.error('Error extracting keywords:', error);
      return res.status(500).json({ error: 'Failed to extract keywords' });
    }
  });

  app.post(`${apiPrefix}/ai/search`, async (req, res) => {
    try {
      const { query } = req.body;
      
      if (!query) {
        return res.status(400).json({ error: 'Search query is required' });
      }
      
      // Get all documents
      const decisions = await storage.getJudicialDecisions({});
      const contractsResult = await storage.getLaborContracts({
        limit: 100 // Get a larger number of contracts for search
      });
      
      const allDocuments = [...decisions, ...contractsResult.contracts];
      
      const results = await aiService.suggestRelevantDocuments(query, allDocuments);
      
      return res.json({ results });
    } catch (error) {
      console.error('Error performing AI search:', error);
      return res.status(500).json({ error: 'Failed to perform AI search' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
