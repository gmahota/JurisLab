import { Topbar } from '@/components/dashboard/topbar'
import { getContractById } from '@/actions/contracts'
import { notFound } from 'next/navigation'
import { FileText, Download, Tag, ArrowLeft, Building } from 'lucide-react'
import Link from 'next/link'

export default async function ContractDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const contract = await getContractById(slug)

  if (!contract) {
    notFound()
  }

  return (
    <div>
      <Topbar title="Detalhes do Contrato" />
      <div className="p-6 max-w-4xl">
        <Link
          href="/dashboard/contracts"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 text-sm mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para contratos
        </Link>

        <div className="bg-white rounded-xl border border-slate-200 p-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-emerald-50 rounded-xl">
              <FileText className="h-8 w-8 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800 mb-2">{contract.title}</h1>
              <div className="flex flex-wrap gap-2">
                <span className="bg-emerald-50 text-emerald-700 text-sm px-3 py-1 rounded-full">
                  {contract.contractType}
                </span>
                <span className="bg-slate-100 text-slate-700 text-sm px-3 py-1 rounded-full flex items-center gap-1">
                  <Building className="h-3 w-3" />
                  {contract.industry}
                </span>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-lg mb-6">
            <div>
              <p className="text-xs text-slate-500 mb-1">Páginas</p>
              <p className="text-sm font-medium text-slate-700">{contract.pages} páginas</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Downloads</p>
              <p className="text-sm font-medium text-slate-700 flex items-center gap-1">
                <Download className="h-4 w-4" />
                {contract.downloads.toLocaleString('pt-BR')}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Setor</p>
              <p className="text-sm font-medium text-slate-700">{contract.industry}</p>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-3">Descrição</h2>
            <p className="text-slate-600 leading-relaxed">{contract.description}</p>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-3">Conteúdo do Contrato</h2>
            <pre className="whitespace-pre-wrap font-sans text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-200">
              {contract.content}
            </pre>
          </div>

          {contract.tags.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Tag className="h-4 w-4 text-slate-400" />
                <h3 className="text-sm font-medium text-slate-700">Tags</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {contract.tags.map((tag) => (
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
