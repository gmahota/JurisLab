import { db } from "@db";
import { eq, desc, and, like, asc, or, lt, gte, sql } from "drizzle-orm";
import * as schema from "@shared/schema";
import { formatISO, subDays, subMonths, subYears } from "date-fns";

type JudicialDecisionFilters = {
  dateRange?: string;
  jurisdictions?: string[];
  topics?: string[];
  sortOrder?: string;
  searchQuery?: string;
  page?: number;
  limit?: number;
};

type LaborContractFilters = {
  contractTypes?: string[];
  industries?: string[];
  sortOrder?: string;
  searchQuery?: string;
  page?: number;
  limit?: number;
};

export const storage = {
  // Judicial Decisions
  async getJudicialDecisions(filters: JudicialDecisionFilters = {}) {
    try {
      let query = db.select().from(schema.judicialDecisions);
      
      // Apply date range filter
      if (filters.dateRange) {
        const now = new Date();
        let startDate: Date;
        
        switch (filters.dateRange) {
          case 'year':
            startDate = subYears(now, 1);
            break;
          case 'month':
            startDate = subMonths(now, 1);
            break;
          case 'custom':
            // Would handle custom date range from UI
            startDate = subYears(now, 5); // Default to 5 years
            break;
          default: // 'all' or undefined
            startDate = new Date(0); // Beginning of time
        }
        
        query = query.where(gte(schema.judicialDecisions.date, formatISO(startDate, { representation: 'date' })));
      }
      
      // Apply jurisdiction filter
      if (filters.jurisdictions && filters.jurisdictions.length > 0) {
        const conditions = filters.jurisdictions.map(jurisdiction => 
          eq(schema.judicialDecisions.jurisdiction, jurisdiction)
        );
        query = query.where(or(...conditions));
      }
      
      // Apply topic (category) filter
      if (filters.topics && filters.topics.length > 0) {
        const conditions = filters.topics.map(topic => 
          eq(schema.judicialDecisions.category, topic)
        );
        query = query.where(or(...conditions));
      }
      
      // Apply search query
      if (filters.searchQuery) {
        query = query.where(
          or(
            like(schema.judicialDecisions.title, `%${filters.searchQuery}%`),
            like(schema.judicialDecisions.summary, `%${filters.searchQuery}%`),
            like(schema.judicialDecisions.caseNumber, `%${filters.searchQuery}%`),
            like(schema.judicialDecisions.parties, `%${filters.searchQuery}%`)
          )
        );
      }
      
      // Apply sorting
      if (filters.sortOrder) {
        switch (filters.sortOrder) {
          case 'date_asc':
            query = query.orderBy(asc(schema.judicialDecisions.date));
            break;
          case 'date_desc':
            query = query.orderBy(desc(schema.judicialDecisions.date));
            break;
          case 'relevant':
            // In a real app, this would implement relevance scoring
            query = query.orderBy(desc(schema.judicialDecisions.id));
            break;
          default: // 'recent' or undefined
            query = query.orderBy(desc(schema.judicialDecisions.updatedAt));
        }
      } else {
        // Default sort by most recent
        query = query.orderBy(desc(schema.judicialDecisions.updatedAt));
      }
      // Count total decisions for pagination
      const countQuery = db
        .select({ count: sql<number>`count(*)` })
        .from(schema.judicialDecisions);
      
      // Apply the same filters to count query
      if (filters.dateRange) {
        const now = new Date();
        let startDate: Date;
        
        switch (filters.dateRange) {
          case 'year':
            startDate = subYears(now, 1);
            break;
          case 'month':
            startDate = subMonths(now, 1);
            break;
          case 'custom':
            startDate = subYears(now, 5); // Default to 5 years
            break;
          default: // 'all' or undefined
            startDate = new Date(0); // Beginning of time
        }
        
        countQuery.where(gte(schema.judicialDecisions.date, formatISO(startDate, { representation: 'date' })));
      }
      
      if (filters.jurisdictions && filters.jurisdictions.length > 0) {
        const conditions = filters.jurisdictions.map(jurisdiction => 
          eq(schema.judicialDecisions.jurisdiction, jurisdiction)
        );
        countQuery.where(or(...conditions));
      }
      
      if (filters.topics && filters.topics.length > 0) {
        const conditions = filters.topics.map(topic => 
          eq(schema.judicialDecisions.category, topic)
        );
        countQuery.where(or(...conditions));
      }
      
      if (filters.searchQuery) {
        countQuery.where(
          or(
            like(schema.judicialDecisions.title, `%${filters.searchQuery}%`),
            like(schema.judicialDecisions.summary, `%${filters.searchQuery}%`),
            like(schema.judicialDecisions.caseNumber, `%${filters.searchQuery}%`),
            like(schema.judicialDecisions.parties, `%${filters.searchQuery}%`)
          )
        );
      }
      
      // Get total count
      const [{ count }] = await countQuery;
      
      // Apply pagination
      const page = filters.page || 1;
      const limit = filters.limit || 10;
      const offset = (page - 1) * limit;
      
      query = query.limit(limit).offset(offset);
      
      // Execute final query
      const decisions = await query;
      
      return {
        decisions,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        totalDecisions: count
      };
    } catch (error) {
      console.error("Error in getJudicialDecisions:", error);
      throw error;
    }
  },
  
  async getJudicialDecisionById(id: number) {
    try {
      const [decision] = await db
        .select()
        .from(schema.judicialDecisions)
        .where(eq(schema.judicialDecisions.id, id))
        .limit(1);
      
      return decision;
    } catch (error) {
      console.error("Error in getJudicialDecisionById:", error);
      throw error;
    }
  },
  
  async createJudicialDecision(data: schema.JudicialDecisionInsert) {
    try {
      const [newDecision] = await db
        .insert(schema.judicialDecisions)
        .values(data)
        .returning();
      
      return newDecision;
    } catch (error) {
      console.error("Error in createJudicialDecision:", error);
      throw error;
    }
  },
  
  // Labor Contracts
  async getLaborContracts(filters: LaborContractFilters = {}) {
    try {
      let query = db.select().from(schema.laborContracts);
      
      // Apply contract type filter
      if (filters.contractTypes && filters.contractTypes.length > 0) {
        const conditions = filters.contractTypes.map(type => 
          eq(schema.laborContracts.contractType, type)
        );
        query = query.where(or(...conditions));
      }
      
      // Apply industry filter
      if (filters.industries && filters.industries.length > 0 && !filters.industries.includes('All Industries')) {
        const conditions = filters.industries.map(industry => 
          eq(schema.laborContracts.industry, industry)
        );
        query = query.where(or(...conditions));
      }
      
      // Apply search query
      if (filters.searchQuery) {
        query = query.where(
          or(
            like(schema.laborContracts.title, `%${filters.searchQuery}%`),
            like(schema.laborContracts.description, `%${filters.searchQuery}%`),
            like(schema.laborContracts.industry, `%${filters.searchQuery}%`)
          )
        );
      }
      
      // Apply sorting
      if (filters.sortOrder) {
        switch (filters.sortOrder) {
          case 'popular':
            query = query.orderBy(desc(schema.laborContracts.downloads));
            break;
          case 'a-z':
            query = query.orderBy(asc(schema.laborContracts.title));
            break;
          default: // 'recent' or undefined
            query = query.orderBy(desc(schema.laborContracts.updatedAt));
        }
      } else {
        // Default sort by most recent
        query = query.orderBy(desc(schema.laborContracts.updatedAt));
      }
      
      // Count total contracts for pagination
      const countQuery = db
        .select({ count: sql<number>`count(*)` })
        .from(schema.laborContracts);
      
      // Apply the same filters to count query
      if (filters.contractTypes && filters.contractTypes.length > 0) {
        const conditions = filters.contractTypes.map(type => 
          eq(schema.laborContracts.contractType, type)
        );
        countQuery.where(or(...conditions));
      }
      
      if (filters.industries && filters.industries.length > 0 && !filters.industries.includes('All Industries')) {
        const conditions = filters.industries.map(industry => 
          eq(schema.laborContracts.industry, industry)
        );
        countQuery.where(or(...conditions));
      }
      
      if (filters.searchQuery) {
        countQuery.where(
          or(
            like(schema.laborContracts.title, `%${filters.searchQuery}%`),
            like(schema.laborContracts.description, `%${filters.searchQuery}%`),
            like(schema.laborContracts.industry, `%${filters.searchQuery}%`)
          )
        );
      }
      
      // Get total count
      const [{ count }] = await countQuery;
      
      // Apply pagination
      const page = filters.page || 1;
      const limit = filters.limit || 6;
      const offset = (page - 1) * limit;
      
      query = query.limit(limit).offset(offset);
      
      // Execute final query
      const contracts = await query;
      
      return {
        contracts,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        totalContracts: count
      };
    } catch (error) {
      console.error("Error in getLaborContracts:", error);
      throw error;
    }
  },
  
  async getLaborContractById(id: number) {
    try {
      const [contract] = await db
        .select()
        .from(schema.laborContracts)
        .where(eq(schema.laborContracts.id, id))
        .limit(1);
      
      return contract;
    } catch (error) {
      console.error("Error in getLaborContractById:", error);
      throw error;
    }
  },
  
  async createLaborContract(data: schema.LaborContractInsert) {
    try {
      const [newContract] = await db
        .insert(schema.laborContracts)
        .values(data)
        .returning();
      
      return newContract;
    } catch (error) {
      console.error("Error in createLaborContract:", error);
      throw error;
    }
  },
  
  async incrementContractDownloads(id: number) {
    try {
      await db
        .update(schema.laborContracts)
        .set({
          downloads: sql`${schema.laborContracts.downloads} + 1`
        })
        .where(eq(schema.laborContracts.id, id));
    } catch (error) {
      console.error("Error in incrementContractDownloads:", error);
      throw error;
    }
  },
  
  // Recent Documents
  async getRecentDocuments() {
    try {
      // Get 5 most recent judicial decisions
      const judicialDecisions = await db
        .select()
        .from(schema.judicialDecisions)
        .orderBy(desc(schema.judicialDecisions.updatedAt))
        .limit(5);
      
      // Get 5 most recent labor contracts
      const laborContracts = await db
        .select()
        .from(schema.laborContracts)
        .orderBy(desc(schema.laborContracts.updatedAt))
        .limit(5);
      
      return {
        judicialDecisions,
        laborContracts
      };
    } catch (error) {
      console.error("Error in getRecentDocuments:", error);
      throw error;
    }
  },
  
  // Dashboard Stats
  async getDashboardStats() {
    try {
      // Count judicial decisions
      const [judicialCount] = await db
        .select({ count: sql<number>`count(*)` })
        .from(schema.judicialDecisions);
      
      // Count labor contracts
      const [contractCount] = await db
        .select({ count: sql<number>`count(*)` })
        .from(schema.laborContracts);
      
      // Count saved documents (favorites)
      const [savedCount] = await db
        .select({ count: sql<number>`count(*)` })
        .from(schema.userFavorites);
      
      // Count recent searches (from history)
      const [searchCount] = await db
        .select({ count: sql<number>`count(*)` })
        .from(schema.userHistory)
        .where(eq(schema.userHistory.action, 'searched'));
      
      return {
        judicialDecisions: judicialCount.count,
        laborContracts: contractCount.count,
        savedDocuments: savedCount.count,
        recentSearches: searchCount.count
      };
    } catch (error) {
      console.error("Error in getDashboardStats:", error);
      throw error;
    }
  },
  
  // Dashboard Insights
  async getDashboardInsights() {
    try {
      const insights = await db
        .select()
        .from(schema.aiInsights)
        .where(eq(schema.aiInsights.insightType, 'dashboard'))
        .orderBy(desc(schema.aiInsights.createdAt))
        .limit(3);
      
      return insights;
    } catch (error) {
      console.error("Error in getDashboardInsights:", error);
      throw error;
    }
  },
  
  // AI Insights
  async getRecentAiInsights() {
    try {
      const insights = await db
        .select()
        .from(schema.aiInsights)
        .orderBy(desc(schema.aiInsights.createdAt))
        .limit(10);
      
      return insights;
    } catch (error) {
      console.error("Error in getRecentAiInsights:", error);
      throw error;
    }
  },
  
  async getAiTrends() {
    // In a real application, this would query from a database
    // For now, return mock data that matches the expected structure
    try {
      return {
        topTopics: [
          { name: "Remote Work Regulations", percentage: 28 },
          { name: "Workplace Discrimination", percentage: 23 },
          { name: "Employee Classification", percentage: 18 },
          { name: "Overtime & Compensation", percentage: 15 },
          { name: "Privacy & Data Protection", percentage: 10 }
        ],
        outcomesByIndustry: [
          { industry: "Tech", employeeFavorable: 62, employerFavorable: 38 },
          { industry: "Healthcare", employeeFavorable: 43, employerFavorable: 57 },
          { industry: "Retail", employeeFavorable: 38, employerFavorable: 62 },
          { industry: "Finance", employeeFavorable: 51, employerFavorable: 49 },
          { industry: "Manufacturing", employeeFavorable: 47, employerFavorable: 53 }
        ],
        emergingTrends: [
          { 
            title: "AI Workplace Monitoring Regulations", 
            content: "Cases involving AI monitoring tools in the workplace have increased by 47% in the last quarter.",
            trend: "up" 
          },
          { 
            title: "Cross-Border Remote Work Legal Challenges", 
            content: "International remote work arrangements are creating new jurisdictional challenges in employment law.",
            trend: "up" 
          },
          { 
            title: "Traditional Non-Compete Enforcement", 
            content: "Courts are increasingly limiting the scope and enforceability of traditional non-compete agreements.",
            trend: "down" 
          }
        ]
      };
    } catch (error) {
      console.error("Error in getAiTrends:", error);
      throw error;
    }
  },
  
  // User Favorites
  async getUserFavorites(userId: number) {
    try {
      // Get judicial decision favorites
      const judicialFavorites = await db
        .select({
          favorite: schema.userFavorites,
          decision: schema.judicialDecisions
        })
        .from(schema.userFavorites)
        .innerJoin(
          schema.judicialDecisions,
          and(
            eq(schema.userFavorites.documentId, schema.judicialDecisions.id),
            eq(schema.userFavorites.documentType, 'judicial')
          )
        )
        .where(eq(schema.userFavorites.userId, userId));
      
      // Get labor contract favorites
      const contractFavorites = await db
        .select({
          favorite: schema.userFavorites,
          contract: schema.laborContracts
        })
        .from(schema.userFavorites)
        .innerJoin(
          schema.laborContracts,
          and(
            eq(schema.userFavorites.documentId, schema.laborContracts.id),
            eq(schema.userFavorites.documentType, 'contract')
          )
        )
        .where(eq(schema.userFavorites.userId, userId));
      
      return {
        judicialDecisions: judicialFavorites.map(item => item.decision),
        laborContracts: contractFavorites.map(item => item.contract)
      };
    } catch (error) {
      console.error("Error in getUserFavorites:", error);
      throw error;
    }
  },
  
  async toggleUserFavorite(data: schema.UserFavoriteInsert) {
    try {
      // Check if favorite already exists
      const [existingFavorite] = await db
        .select()
        .from(schema.userFavorites)
        .where(
          and(
            eq(schema.userFavorites.userId, data.userId),
            eq(schema.userFavorites.documentType, data.documentType),
            eq(schema.userFavorites.documentId, data.documentId)
          )
        )
        .limit(1);
      
      if (existingFavorite) {
        // Remove favorite
        await db
          .delete(schema.userFavorites)
          .where(eq(schema.userFavorites.id, existingFavorite.id));
      } else {
        // Add favorite
        await db
          .insert(schema.userFavorites)
          .values(data);
      }
    } catch (error) {
      console.error("Error in toggleUserFavorite:", error);
      throw error;
    }
  },
  
  // User History
  async getUserHistory(userId: number, type?: string) {
    try {
      // Group activities by date
      const today = new Date();
      const yesterday = subDays(today, 1);
      const lastWeek = subDays(today, 7);
      
      // Format dates for comparison
      const todayStr = formatISO(today, { representation: 'date' });
      const yesterdayStr = formatISO(yesterday, { representation: 'date' });
      const lastWeekStr = formatISO(lastWeek, { representation: 'date' });
      
      // Get user history with document details
      let historyQuery = db
        .select({
          history: schema.userHistory
        })
        .from(schema.userHistory)
        .where(eq(schema.userHistory.userId, userId))
        .orderBy(desc(schema.userHistory.createdAt));
      
      // Filter by document type if specified
      if (type && type !== 'all') {
        historyQuery = historyQuery.where(eq(schema.userHistory.documentType, type === 'judicial' ? 'judicial' : 'contract'));
      }
      
      const historyItems = await historyQuery;
      
      // Fetch document details for each history item
      const activities = [];
      for (const item of historyItems) {
        let document;
        
        if (item.history.documentType === 'judicial') {
          [document] = await db
            .select()
            .from(schema.judicialDecisions)
            .where(eq(schema.judicialDecisions.id, item.history.documentId))
            .limit(1);
        } else {
          [document] = await db
            .select()
            .from(schema.laborContracts)
            .where(eq(schema.laborContracts.id, item.history.documentId))
            .limit(1);
        }
        
        if (document) {
          activities.push({
            ...item.history,
            document
          });
        }
      }
      
      // Group by date
      const todayActivities = activities.filter(activity => {
        const activityDate = formatISO(new Date(activity.createdAt), { representation: 'date' });
        return activityDate === todayStr;
      });
      
      const yesterdayActivities = activities.filter(activity => {
        const activityDate = formatISO(new Date(activity.createdAt), { representation: 'date' });
        return activityDate === yesterdayStr;
      });
      
      const olderActivities = activities.filter(activity => {
        const activityDate = formatISO(new Date(activity.createdAt), { representation: 'date' });
        return activityDate < yesterdayStr && activityDate >= lastWeekStr;
      });
      
      const evenOlderActivities = activities.filter(activity => {
        const activityDate = formatISO(new Date(activity.createdAt), { representation: 'date' });
        return activityDate < lastWeekStr;
      });
      
      // Create activity groups
      const result = [];
      
      if (todayActivities.length > 0) {
        result.push({
          date: "Today",
          activities: todayActivities
        });
      }
      
      if (yesterdayActivities.length > 0) {
        result.push({
          date: "Yesterday",
          activities: yesterdayActivities
        });
      }
      
      if (olderActivities.length > 0) {
        result.push({
          date: "Last 7 Days",
          activities: olderActivities
        });
      }
      
      if (evenOlderActivities.length > 0) {
        result.push({
          date: "Older",
          activities: evenOlderActivities
        });
      }
      
      return result;
    } catch (error) {
      console.error("Error in getUserHistory:", error);
      throw error;
    }
  },
  
  async addUserHistory(data: schema.UserHistoryInsert) {
    try {
      await db
        .insert(schema.userHistory)
        .values(data);
    } catch (error) {
      console.error("Error in addUserHistory:", error);
      throw error;
    }
  },
  
  // Notifications
  async getUserNotifications(userId: number) {
    try {
      const notifications = await db
        .select()
        .from(schema.notifications)
        .where(eq(schema.notifications.userId, userId))
        .orderBy(desc(schema.notifications.createdAt));
      
      return notifications;
    } catch (error) {
      console.error("Error in getUserNotifications:", error);
      throw error;
    }
  },
};
