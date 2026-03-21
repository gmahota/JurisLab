import { Topbar } from '@/components/dashboard/topbar'
import { listDecisions } from '@/actions/decisions'
import { listContracts } from '@/actions/contracts'
import { listInsights } from '@/actions/insights'
import { Settings, Scale, FileText, Brain, Users, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default async function AdminPage() {
  const [decisions, contracts, insights] = await Promise.all([
    listDecisions({ page: 1, limit: 1 }),
    listContracts({ page: 1, limit: 1 }),
    listInsights(),
  ])

  const stats = [
    { label: 'Total de Decisões', value: decisions.total, icon: Scale, color: 'text-blue-600', bg: 'bg-blue-50', href: '/dashboard/decisions' },
    { label: 'Total de Contratos', value: contracts.total, icon: FileText, color: 'text-emerald-600', bg: 'bg-emerald-50', href: '/dashboard/contracts' },
    { label: 'Insights de IA', value: insights.length, icon: Brain, color: 'text-purple-600', bg: 'bg-purple-50', href: '/dashboard/insights' },
    { label: 'Usuários Ativos', value: 1, icon: Users, color: 'text-orange-600', bg: 'bg-orange-50', href: '/admin/users' },
  ]

  return (
    <div>
      <Topbar title="Administração" />
      <div className="p-6 space-y-8">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <Settings className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-amber-700">
            Painel de administração. Apenas administradores têm acesso a esta área.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Link
              key={stat.label}
              href={stat.href}
              className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-slate-800">{stat.value}</p>
                </div>
                <div className={`p-2 rounded-lg ${stat.bg}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Ações Rápidas
            </h2>
            <div className="space-y-2">
              {[
                { href: '/admin/users', label: 'Gerenciar Usuários', icon: Users },
                { href: '/dashboard/decisions', label: 'Ver Decisões', icon: Scale },
                { href: '/dashboard/contracts', label: 'Ver Contratos', icon: FileText },
                { href: '/dashboard/insights', label: 'Ver Insights', icon: Brain },
              ].map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors text-sm text-slate-700"
                >
                  <action.icon className="h-4 w-4 text-slate-400" />
                  {action.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="font-semibold text-slate-800 mb-4">Informações do Sistema</h2>
            <dl className="space-y-3">
              {[
                { label: 'Versão', value: '1.0.0' },
                { label: 'Framework', value: 'Next.js 15 App Router' },
                { label: 'Banco de Dados', value: 'Mock (desenvolvimento)' },
                { label: 'Status', value: 'Operacional' },
              ].map((info) => (
                <div key={info.label} className="flex justify-between text-sm">
                  <dt className="text-slate-500">{info.label}</dt>
                  <dd className="font-medium text-slate-700">{info.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}
