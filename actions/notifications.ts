'use server'

import type { Notification } from '@/types'

const mockNotifications: Notification[] = [
  {
    id: '1',
    userId: '1',
    title: 'Nova decisão disponível',
    message: 'Uma nova decisão do STF foi adicionada ao banco de dados: ADI-6890 sobre reforma tributária.',
    type: 'INFO',
    read: false,
    link: '/dashboard/decisions/2',
    createdAt: new Date('2024-04-10T09:00:00'),
  },
  {
    id: '2',
    userId: '1',
    title: 'Insight de IA gerado',
    message: 'Um novo insight sobre tendências em direito digital foi gerado com base nas suas buscas recentes.',
    type: 'SUCCESS',
    read: false,
    link: '/dashboard/insights',
    createdAt: new Date('2024-04-09T15:30:00'),
  },
  {
    id: '3',
    userId: '1',
    title: 'Contrato atualizado',
    message: 'O modelo de Acordo Coletivo do Setor Metalúrgico foi atualizado com as alterações da Convenção 2024.',
    type: 'WARNING',
    read: true,
    link: '/dashboard/contracts/4',
    createdAt: new Date('2024-04-08T11:00:00'),
  },
  {
    id: '4',
    userId: '1',
    title: 'Bem-vindo ao JurisLab',
    message: 'Seu acesso ao JurisLab foi configurado com sucesso. Explore nossa base de dados jurídica completa.',
    type: 'SUCCESS',
    read: true,
    createdAt: new Date('2024-04-01T08:00:00'),
  },
]

export async function listNotifications(userId: string = '1'): Promise<Notification[]> {
  return mockNotifications
    .filter(n => n.userId === userId)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}

export async function markRead(id: string): Promise<boolean> {
  const notification = mockNotifications.find(n => n.id === id)
  if (!notification) return false
  notification.read = true
  return true
}

export async function markAllRead(userId: string = '1'): Promise<boolean> {
  mockNotifications
    .filter(n => n.userId === userId)
    .forEach(n => { n.read = true })
  return true
}

export async function countUnread(userId: string = '1'): Promise<number> {
  return mockNotifications.filter(n => n.userId === userId && !n.read).length
}
