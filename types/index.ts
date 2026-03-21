export type Role = 'USER' | 'ADMIN'
export type DocumentType = 'JUDICIAL_DECISION' | 'LABOR_CONTRACT'
export type InsightType = 'SUMMARY' | 'ANALYSIS' | 'TREND'
export type NotificationType = 'INFO' | 'WARNING' | 'SUCCESS'

export interface User {
  id: string
  username: string
  email: string
  fullName: string
  role: Role
  slug: string
  createdAt: Date
  updatedAt: Date
}

export interface JudicialDecision {
  id: string
  title: string
  caseNumber: string
  jurisdiction: string
  category: string
  date: Date
  judge: string
  parties: string
  summary: string
  content: string
  tags: string[]
  slug: string
  createdAt: Date
  updatedAt: Date
}

export interface LaborContract {
  id: string
  title: string
  contractType: string
  industry: string
  pages: number
  description: string
  content: string
  tags: string[]
  downloads: number
  slug: string
  createdAt: Date
  updatedAt: Date
}

export interface UserFavorite {
  id: string
  userId: string
  documentType: DocumentType
  documentId: string
  createdAt: Date
}

export interface UserHistory {
  id: string
  userId: string
  documentType: DocumentType
  documentId: string
  action: string
  createdAt: Date
}

export interface AiInsight {
  id: string
  title: string
  content: string
  documentType?: DocumentType
  documentId?: string
  insightType: InsightType
  confidence: number
  createdAt: Date
}

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: NotificationType
  read: boolean
  link?: string
  createdAt: Date
}

export interface DashboardStats {
  totalDecisions: number
  totalContracts: number
  totalInsights: number
  unreadNotifications: number
}

export interface SearchParams {
  query?: string
  page?: number
  limit?: number
  category?: string
  jurisdiction?: string
  contractType?: string
  industry?: string
}

export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}
