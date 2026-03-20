import { Topbar } from '@/components/dashboard/topbar'
import { listHistory } from '@/actions/history'
import { History, Scale, FileText, Clock } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default async function HistoryPage() {
  const history = await listHistory()

  return (
    <div>
      <Topbar title="Histórico" />
      <div className="p-6 space-y-6">
        {history.length === 0 ? (
          <div className="text-center py-16">
            <History className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-600 mb-2">Nenhuma atividade ainda</h3>
            <p className="text-slate-400 text-sm">
              Seu histórico de acesso a documentos aparecerá aqui.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
            {history.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-4">
                <div className={`p-2 rounded-lg flex-shrink-0 ${item.documentType === 'JUDICIAL_DECISION' ? 'bg-blue-50' : 'bg-emerald-50'}`}>
                  {item.documentType === 'JUDICIAL_DECISION'
                    ? <Scale className="h-5 w-5 text-blue-600" />
                    : <FileText className="h-5 w-5 text-emerald-600" />
                  }
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-800">
                    Você {item.action} o documento #{item.documentId}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {item.documentType === 'JUDICIAL_DECISION' ? 'Decisão Judicial' : 'Contrato Trabalhista'}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-400 flex-shrink-0">
                  <Clock className="h-3 w-3" />
                  {formatDate(item.createdAt)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
