import { Topbar } from '@/components/dashboard/topbar'
import { listDecisions } from '@/actions/decisions'
import { Scale, Calendar, Tag } from 'lucide-react'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

interface SearchParams {
  query?: string
  jurisdiction?: string
  category?: string
  page?: string
}

export default async function DecisionsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const result = await listDecisions({
    query: params.query,
    jurisdiction: params.jurisdiction,
    category: params.category,
    page: params.page ? parseInt(params.page) : 1,
  })

  return (
    <div>
      <Topbar title="Decisões Judiciais" />
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <p className="text-slate-500 text-sm">
            {result.total} decisão{result.total !== 1 ? 'ões' : ''} encontrada{result.total !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Search */}
        <form className="flex gap-3">
          <input
            name="query"
            defaultValue={params.query}
            placeholder="Buscar por título, número ou tema..."
            className="flex-1 border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-500 transition-colors"
          >
            Buscar
          </button>
        </form>

        {/* Results */}
        <div className="space-y-4">
          {result.data.map((decision) => (
            <Link
              key={decision.id}
              href={`/dashboard/decisions/${decision.slug}`}
              className="block bg-white rounded-xl border border-slate-200 p-6 hover:border-blue-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Scale className="h-4 w-4 text-blue-600 flex-shrink-0" />
                    <span className="text-xs font-mono text-slate-500">{decision.caseNumber}</span>
                  </div>
                  <h3 className="font-semibold text-slate-800 mb-2">{decision.title}</h3>
                  <p className="text-sm text-slate-600 line-clamp-2 mb-3">{decision.summary}</p>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(decision.date)}
                    </span>
                    <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                      {decision.jurisdiction}
                    </span>
                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                      {decision.category}
                    </span>
                  </div>
                </div>
              </div>
              {decision.tags.length > 0 && (
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
                  <Tag className="h-3 w-3 text-slate-400" />
                  <div className="flex flex-wrap gap-1">
                    {decision.tags.slice(0, 4).map((tag) => (
                      <span key={tag} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </Link>
          ))}
        </div>

        {/* Pagination */}
        {result.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            {Array.from({ length: result.totalPages }, (_, i) => i + 1).map((page) => (
              <Link
                key={page}
                href={`?page=${page}${params.query ? `&query=${params.query}` : ''}`}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  page === result.page
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {page}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
