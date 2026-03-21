import { Topbar } from '@/components/dashboard/topbar'
import { listFavorites } from '@/actions/favorites'
import { getDecisionById } from '@/actions/decisions'
import { getContractById } from '@/actions/contracts'
import { Heart, Scale, FileText } from 'lucide-react'
import Link from 'next/link'

export default async function FavoritesPage() {
  const favorites = await listFavorites()

  const enriched = await Promise.all(
    favorites.map(async (fav) => {
      if (fav.documentType === 'JUDICIAL_DECISION') {
        const doc = await getDecisionById(fav.documentId)
        return { ...fav, doc, href: `/dashboard/decisions/${doc?.slug ?? fav.documentId}` }
      } else {
        const doc = await getContractById(fav.documentId)
        return { ...fav, doc, href: `/dashboard/contracts/${doc?.slug ?? fav.documentId}` }
      }
    })
  )

  return (
    <div>
      <Topbar title="Favoritos" />
      <div className="p-6 space-y-6">
        {enriched.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-600 mb-2">Nenhum favorito ainda</h3>
            <p className="text-slate-400 text-sm">
              Adicione decisões e contratos aos seus favoritos para acessá-los rapidamente.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {enriched.map((fav) => (
              <Link
                key={fav.id}
                href={fav.href}
                className="flex items-center gap-4 bg-white rounded-xl border border-slate-200 p-4 hover:border-red-200 hover:shadow-sm transition-all"
              >
                <div className={`p-2 rounded-lg flex-shrink-0 ${fav.documentType === 'JUDICIAL_DECISION' ? 'bg-blue-50' : 'bg-emerald-50'}`}>
                  {fav.documentType === 'JUDICIAL_DECISION'
                    ? <Scale className="h-5 w-5 text-blue-600" />
                    : <FileText className="h-5 w-5 text-emerald-600" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-800 line-clamp-1">
                    {fav.doc ? ('title' in fav.doc ? fav.doc.title : '') : 'Documento não encontrado'}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {fav.documentType === 'JUDICIAL_DECISION' ? 'Decisão Judicial' : 'Contrato Trabalhista'}
                  </p>
                </div>
                <Heart className="h-5 w-5 text-red-400 fill-red-400 flex-shrink-0" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
