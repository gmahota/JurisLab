'use server'

import type { UserHistory, DocumentType } from '@/types'

const mockHistory: UserHistory[] = [
  {
    id: '1',
    userId: '1',
    documentType: 'JUDICIAL_DECISION',
    documentId: '1',
    action: 'visualizou',
    createdAt: new Date('2024-04-10T10:30:00'),
  },
  {
    id: '2',
    userId: '1',
    documentType: 'LABOR_CONTRACT',
    documentId: '1',
    action: 'baixou',
    createdAt: new Date('2024-04-10T11:00:00'),
  },
  {
    id: '3',
    userId: '1',
    documentType: 'JUDICIAL_DECISION',
    documentId: '3',
    action: 'visualizou',
    createdAt: new Date('2024-04-09T14:20:00'),
  },
]

export async function listHistory(userId: string = '1', limit: number = 20): Promise<UserHistory[]> {
  return mockHistory
    .filter(h => h.userId === userId)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, limit)
}

export async function addHistory(
  userId: string = '1',
  documentType: DocumentType,
  documentId: string,
  action: string = 'visualizou'
): Promise<UserHistory> {
  const newHistory: UserHistory = {
    id: String(mockHistory.length + 1),
    userId,
    documentType,
    documentId,
    action,
    createdAt: new Date(),
  }
  mockHistory.unshift(newHistory)
  return newHistory
}
