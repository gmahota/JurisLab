import { Topbar } from '@/components/dashboard/topbar'
import { listInsights } from '@/actions/insights'
import { Brain, TrendingUp, BarChart2, FileText } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { InsightType } from '@/types'

const insightTypeConfig: Record<InsightType, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  TREND: { label: 'Tendência', icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50' },
  ANALYSIS: { label: 'Análise', icon: BarChart2, color: 'text-blue-600', bg: 'bg-blue-50' },
  SUMMARY: { label: 'Resumo', icon: FileText, color: 'text-purple-600', bg: 'bg-purple-50' },
}

export default async function InsightsPage() {
  const insights = await listInsights()

  return (
    <div>
      <Topbar title="Insights de IA" />
      <div className="p-6 space-y-6">
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 flex items-start gap-3">
          <Brain className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-purple-700">
            Os insights são gerados automaticamente por inteligência artificial com base nas decisões
            judiciais e contratos da plataforma. A confiança indica a precisão estimada da análise.
          </p>
        </div>

        <div className="space-y-4">
          {insights.map((insight) => {
            const config = insightTypeConfig[insight.insightType]
            const Icon = config.icon
            return (
              <div key={insight.id} className="bg-white rounded-xl border border-slate-200 p-6">
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg flex-shrink-0 ${config.bg}`}>
                    <Icon className={`h-5 w-5 ${config.color}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className="font-semibold text-slate-800">{insight.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ${config.bg} ${config.color}`}>
                        {config.label}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed mb-4">{insight.content}</p>
                    <div className="flex items-center gap-4 text-xs text-slate-400">
                      <span>{formatDate(insight.createdAt)}</span>
                      <span className="flex items-center gap-1">
                        Confiança:{' '}
                        <span className="font-medium text-slate-600">
                          {Math.round(insight.confidence * 100)}%
                        </span>
                      </span>
                      {insight.documentType && (
                        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                          {insight.documentType === 'JUDICIAL_DECISION' ? 'Decisões' : 'Contratos'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
