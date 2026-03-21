'use server'

import type { UserFavorite, DocumentType } from '@/types'

const mockFavorites: UserFavorite[] = [
  {
    id: '1',
    userId: '1',
    documentType: 'JUDICIAL_DECISION',
    documentId: '1',
    createdAt: new Date('2024-03-16'),
  },
  {
    id: '2',
    userId: '1',
    documentType: 'LABOR_CONTRACT',
    documentId: '2',
    createdAt: new Date('2024-03-17'),
  },
]

export async function listFavorites(userId: string = '1'): Promise<UserFavorite[]> {
  return mockFavorites.filter(f => f.userId === userId)
}

export async function addFavorite(
  userId: string = '1',
  documentType: DocumentType,
  documentId: string
): Promise<UserFavorite> {
  const existing = mockFavorites.find(
    f => f.userId === userId && f.documentType === documentType && f.documentId === documentId
  )
  if (existing) return existing

  const newFavorite: UserFavorite = {
    id: String(mockFavorites.length + 1),
    userId,
    documentType,
    documentId,
    createdAt: new Date(),
  }
  mockFavorites.push(newFavorite)
  return newFavorite
}

export async function removeFavorite(
  userId: string = '1',
  documentType: DocumentType,
  documentId: string
): Promise<boolean> {
  const index = mockFavorites.findIndex(
    f => f.userId === userId && f.documentType === documentType && f.documentId === documentId
  )
  if (index === -1) return false
  mockFavorites.splice(index, 1)
  return true
}
