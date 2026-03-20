import { pgTable, text, serial, integer, boolean, date, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  role: text("role").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Judicial Decisions table
export const judicialDecisions = pgTable("judicial_decisions", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  caseNumber: text("case_number").notNull(),
  jurisdiction: text("jurisdiction").notNull(), // Supreme Court, Federal Court, State Court, Administrative
  category: text("category").notNull(), // Labor Law, Constitutional Law, etc.
  date: date("date").notNull(),
  judge: text("judge").notNull(),
  parties: text("parties").notNull(),
  summary: text("summary").notNull(),
  content: text("content").notNull(),
  tags: jsonb("tags").$type<string[]>().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Labor Contracts table
export const laborContracts = pgTable("labor_contracts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  contractType: text("contract_type").notNull(), // Employment, Consulting, Termination, etc.
  industry: text("industry").notNull(),
  pages: integer("pages").notNull(),
  description: text("description").notNull(),
  content: text("content").notNull(),
  tags: jsonb("tags").$type<string[]>().default([]),
  downloads: integer("downloads").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// User Favorites table - for saving documents and contracts
export const userFavorites = pgTable("user_favorites", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  documentType: text("document_type").notNull(), // "judicial" or "contract"
  documentId: integer("document_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// User History table - to track recent activity
export const userHistory = pgTable("user_history", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  documentType: text("document_type").notNull(), // "judicial" or "contract"
  documentId: integer("document_id").notNull(),
  action: text("action").notNull(), // viewed, downloaded, etc.
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// AI Insights table
export const aiInsights = pgTable("ai_insights", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  documentType: text("document_type"), // could be null for general insights
  documentId: integer("document_id"), // could be null for general insights
  insightType: text("insight_type").notNull(), // summary, analysis, trend
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Notifications
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  read: boolean("read").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Define relations
export const usersRelations = relations(users, ({ many }) => ({
  favorites: many(userFavorites),
  history: many(userHistory),
  notifications: many(notifications),
}));

export const judicialDecisionsRelations = relations(judicialDecisions, ({ many }) => ({
  favorites: many(userFavorites, { relationName: "decision_favorites" }),
  history: many(userHistory, { relationName: "decision_history" }),
  insights: many(aiInsights, { relationName: "decision_insights" }),
}));

export const laborContractsRelations = relations(laborContracts, ({ many }) => ({
  favorites: many(userFavorites, { relationName: "contract_favorites" }),
  history: many(userHistory, { relationName: "contract_history" }),
  insights: many(aiInsights, { relationName: "contract_insights" }),
}));

// Schema for inserting new judicial decision
export const judicialDecisionInsertSchema = createInsertSchema(judicialDecisions, {
  title: (schema) => schema.min(3, "Title must be at least 3 characters"),
  summary: (schema) => schema.min(10, "Summary must be at least 10 characters"),
});
export type JudicialDecisionInsert = z.infer<typeof judicialDecisionInsertSchema>;
export type JudicialDecision = typeof judicialDecisions.$inferSelect;

// Schema for inserting new labor contract
export const laborContractInsertSchema = createInsertSchema(laborContracts, {
  title: (schema) => schema.min(3, "Title must be at least 3 characters"),
  description: (schema) => schema.min(10, "Description must be at least 10 characters"),
});
export type LaborContractInsert = z.infer<typeof laborContractInsertSchema>;
export type LaborContract = typeof laborContracts.$inferSelect;

// Schema for user insert
export const userInsertSchema = createInsertSchema(users, {
  username: (schema) => schema.min(3, "Username must be at least 3 characters"),
  password: (schema) => schema.min(6, "Password must be at least 6 characters"),
});
export type UserInsert = z.infer<typeof userInsertSchema>;
export type User = typeof users.$inferSelect;

// Schema for user favorites
export const userFavoriteInsertSchema = createInsertSchema(userFavorites);
export type UserFavoriteInsert = z.infer<typeof userFavoriteInsertSchema>;
export type UserFavorite = typeof userFavorites.$inferSelect;

// Schema for user history
export const userHistoryInsertSchema = createInsertSchema(userHistory);
export type UserHistoryInsert = z.infer<typeof userHistoryInsertSchema>;
export type UserHistory = typeof userHistory.$inferSelect;

// Schema for AI insights
export const aiInsightInsertSchema = createInsertSchema(aiInsights, {
  title: (schema) => schema.min(3, "Title must be at least 3 characters"),
  content: (schema) => schema.min(10, "Content must be at least 10 characters"),
});
export type AiInsightInsert = z.infer<typeof aiInsightInsertSchema>;
export type AiInsight = typeof aiInsights.$inferSelect;

// Schema for notifications
export const notificationInsertSchema = createInsertSchema(notifications);
export type NotificationInsert = z.infer<typeof notificationInsertSchema>;
export type Notification = typeof notifications.$inferSelect;
