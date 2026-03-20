import type { Role } from '@/types'

export const PERMISSIONS = {
  decisions: {
    read: ['USER', 'ADMIN'] as Role[],
    create: ['ADMIN'] as Role[],
    update: ['ADMIN'] as Role[],
    delete: ['ADMIN'] as Role[],
  },
  contracts: {
    read: ['USER', 'ADMIN'] as Role[],
    create: ['ADMIN'] as Role[],
    update: ['ADMIN'] as Role[],
    delete: ['ADMIN'] as Role[],
  },
  users: {
    read: ['ADMIN'] as Role[],
    create: ['ADMIN'] as Role[],
    update: ['ADMIN'] as Role[],
    delete: ['ADMIN'] as Role[],
  },
  insights: {
    read: ['USER', 'ADMIN'] as Role[],
  },
} as const

export function canAccess(role: Role, resource: keyof typeof PERMISSIONS, action: string): boolean {
  const resourcePerms = PERMISSIONS[resource]
  const actionPerms = (resourcePerms as Record<string, Role[]>)[action]
  if (!actionPerms) return false
  return actionPerms.includes(role)
}
