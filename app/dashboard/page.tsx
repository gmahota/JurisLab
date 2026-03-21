import { Topbar } from '@/components/dashboard/topbar'
import { listDecisions } from '@/actions/decisions'
import { listContracts } from '@/actions/contracts'
import { listInsights } from '@/actions/insights'
import { countUnread } from '@/actions/notifications'
import { Scale, FileText, Brain, Bell, TrendingUp, Clock } from 'lucide-react'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

export default async function DashboardPage() {
  const [decisions, contracts, insights, unread] = await Promise.all([
    listDecisions({ page: 1, limit: 5 }),
    listContracts({ page: 1, limit: 5 }),
    listInsights(3),
    countUnread(),
  ])

  const stats = [
    { label: 'Decisões Judiciais', value: decisions.total, icon: Scale, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Contratos', value: contracts.total, icon: FileText, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Insights de IA', value: insights.length, icon: Brain, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Notificações', value: unread, icon: Bell, color: 'text-orange-600', bg: 'bg-orange-50' },
  ]

  return (
    <div>
      <Topbar title="Painel" />
      <div className="p-6 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-slate-800">{stat.value}</p>
                </div>
                <div className={`p-2 rounded-lg ${stat.bg}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Decisions */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-slate-800 flex items-center gap-2">
                <Scale className="h-5 w-5 text-blue-600" />
                Decisões Recentes
              </h2>
              <Link href="/dashboard/decisions" className="text-sm text-blue-600 hover:underline">
                Ver todas
              </Link>
            </div>
            <div className="space-y-3">
              {decisions.data.map((d) => (
                <Link
                  key={d.id}
                  href={`/dashboard/decisions/${d.slug}`}
                  className="block p-3 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <p className="text-sm font-medium text-slate-800 line-clamp-1">{d.title}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-slate-500">{d.jurisdiction}</span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDate(d.date)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* AI Insights */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-slate-800 flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-600" />
                Insights de IA
              </h2>
              <Link href="/dashboard/insights" className="text-sm text-blue-600 hover:underline">
                Ver todos
              </Link>
            </div>
            <div className="space-y-3">
              {insights.map((insight) => (
                <div key={insight.id} className="p-3 rounded-lg bg-slate-50">
                  <div className="flex items-start gap-2">
                    <TrendingUp className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-slate-800 line-clamp-2">{insight.title}</p>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{insight.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Contracts */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-800 flex items-center gap-2">
              <FileText className="h-5 w-5 text-emerald-600" />
              Contratos Populares
            </h2>
            <Link href="/dashboard/contracts" className="text-sm text-blue-600 hover:underline">
              Ver todos
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {contracts.data.map((c) => (
              <Link
                key={c.id}
                href={`/dashboard/contracts/${c.slug}`}
                className="p-4 rounded-lg border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition-colors"
              >
                <p className="text-sm font-medium text-slate-800 line-clamp-2 mb-2">{c.title}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded">
                    {c.contractType}
                  </span>
                  <span className="text-xs text-slate-400">{c.downloads} downloads</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
