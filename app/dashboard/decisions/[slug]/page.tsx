import { Topbar } from '@/components/dashboard/topbar'
import { getDecisionById } from '@/actions/decisions'
import { notFound } from 'next/navigation'
import { Scale, Calendar, User, Users, Tag, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

export default async function DecisionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const decision = await getDecisionById(slug)

  if (!decision) {
    notFound()
  }

  return (
    <div>
      <Topbar title="Detalhes da Decisão" />
      <div className="p-6 max-w-4xl">
        <Link
          href="/dashboard/decisions"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 text-sm mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para decisões
        </Link>

        <div className="bg-white rounded-xl border border-slate-200 p-8">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Scale className="h-5 w-5 text-blue-600" />
              <span className="font-mono text-sm text-slate-500">{decision.caseNumber}</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-800 mb-4">{decision.title}</h1>
            <div className="flex flex-wrap gap-2">
              <span className="bg-blue-50 text-blue-700 text-sm px-3 py-1 rounded-full">
                {decision.jurisdiction}
              </span>
              <span className="bg-slate-100 text-slate-700 text-sm px-3 py-1 rounded-full">
                {decision.category}
              </span>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-lg mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-slate-400" />
              <div>
                <p className="text-xs text-slate-500">Data</p>
                <p className="text-sm font-medium text-slate-700">{formatDate(decision.date)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-slate-400" />
              <div>
                <p className="text-xs text-slate-500">Relator</p>
                <p className="text-sm font-medium text-slate-700">{decision.judge}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-slate-400" />
              <div>
                <p className="text-xs text-slate-500">Partes</p>
                <p className="text-sm font-medium text-slate-700 line-clamp-1">{decision.parties}</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-3">Ementa / Resumo</h2>
            <p className="text-slate-600 leading-relaxed bg-blue-50/50 p-4 rounded-lg border-l-4 border-blue-400">
              {decision.summary}
            </p>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-3">Acórdão Completo</h2>
            <pre className="whitespace-pre-wrap font-sans text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-200">
              {decision.content}
            </pre>
          </div>

          {decision.tags.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Tag className="h-4 w-4 text-slate-400" />
                <h3 className="text-sm font-medium text-slate-700">Tags</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {decision.tags.map((tag) => (
                  <span key={tag} className="bg-slate-100 text-slate-600 text-sm px-3 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
