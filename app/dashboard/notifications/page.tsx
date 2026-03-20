import { Topbar } from '@/components/dashboard/topbar'
import { listNotifications } from '@/actions/notifications'
import { Bell, CheckCircle, AlertTriangle, Info, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import type { NotificationType } from '@/types'

const typeConfig: Record<NotificationType, { icon: React.ElementType; color: string; bg: string; border: string }> = {
  INFO: { icon: Info, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
  SUCCESS: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
  WARNING: { icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' },
}

export default async function NotificationsPage() {
  const notifications = await listNotifications()

  return (
    <div>
      <Topbar title="Notificações" />
      <div className="p-6 space-y-4">
        {notifications.length === 0 ? (
          <div className="text-center py-16">
            <Bell className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-600 mb-2">Nenhuma notificação</h3>
            <p className="text-slate-400 text-sm">Você está em dia com todas as notificações.</p>
          </div>
        ) : (
          notifications.map((notification) => {
            const config = typeConfig[notification.type]
            const Icon = config.icon
            return (
              <div
                key={notification.id}
                className={`bg-white rounded-xl border p-4 ${notification.read ? 'border-slate-200 opacity-70' : `${config.border} border`}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg flex-shrink-0 ${config.bg}`}>
                    <Icon className={`h-5 w-5 ${config.color}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-slate-800 text-sm">{notification.title}</h3>
                      {!notification.read && (
                        <span className="h-2 w-2 bg-blue-500 rounded-full flex-shrink-0 mt-1" />
                      )}
                    </div>
                    <p className="text-sm text-slate-600 mt-1">{notification.message}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs text-slate-400">{formatDate(notification.createdAt)}</span>
                      {notification.link && (
                        <Link
                          href={notification.link}
                          className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                        >
                          Ver documento
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
