import { cookies } from 'next/headers'
import type { User } from '@/types'

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('session-token')

  if (!sessionToken) return null

  // Mock user for development
  return {
    id: '1',
    username: 'admin',
    email: 'admin@jurislab.com.br',
    fullName: 'Administrador JurisLab',
    role: 'ADMIN',
    slug: 'admin',
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}

export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('Não autorizado')
  }
  return user
}

export async function requireAdmin(): Promise<User> {
  const user = await requireAuth()
  if (user.role !== 'ADMIN') {
    throw new Error('Acesso negado: requer privilégios de administrador')
  }
  return user
}
