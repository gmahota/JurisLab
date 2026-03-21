import { Topbar } from '@/components/dashboard/topbar'
import { listContracts } from '@/actions/contracts'
import { FileText, Download, Tag } from 'lucide-react'
import Link from 'next/link'

interface SearchParams {
  query?: string
  contractType?: string
  industry?: string
  page?: string
}

export default async function ContractsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const result = await listContracts({
    query: params.query,
    contractType: params.contractType,
    industry: params.industry,
    page: params.page ? parseInt(params.page) : 1,
  })

  return (
    <div>
      <Topbar title="Contratos Trabalhistas" />
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-slate-500 text-sm">
            {result.total} contrato{result.total !== 1 ? 's' : ''} encontrado{result.total !== 1 ? 's' : ''}
          </p>
        </div>

        <form className="flex gap-3">
          <input
            name="query"
            defaultValue={params.query}
            placeholder="Buscar por título, tipo ou setor..."
            className="flex-1 border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-500 transition-colors"
          >
            Buscar
          </button>
        </form>

        <div className="grid md:grid-cols-2 gap-4">
          {result.data.map((contract) => (
            <Link
              key={contract.id}
              href={`/dashboard/contracts/${contract.slug}`}
              className="block bg-white rounded-xl border border-slate-200 p-6 hover:border-emerald-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-emerald-50 rounded-lg flex-shrink-0">
                  <FileText className="h-5 w-5 text-emerald-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-800 mb-1 line-clamp-2">{contract.title}</h3>
                  <p className="text-sm text-slate-500 line-clamp-2 mb-3">{contract.description}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="bg-emerald-50 text-emerald-700 text-xs px-2 py-0.5 rounded">
                      {contract.contractType}
                    </span>
                    <span className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded">
                      {contract.industry}
                    </span>
                    <span className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded">
                      {contract.pages} págs.
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <Download className="h-3 w-3" />
                    {contract.downloads.toLocaleString('pt-BR')} downloads
                  </div>
                </div>
              </div>
              {contract.tags.length > 0 && (
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
                  <Tag className="h-3 w-3 text-slate-400" />
                  <div className="flex flex-wrap gap-1">
                    {contract.tags.slice(0, 3).map((tag) => (
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
