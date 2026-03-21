import { Topbar } from '@/components/dashboard/topbar'
import { Users, User, Shield } from 'lucide-react'
import type { User as UserType } from '@/types'
import { formatDate } from '@/lib/utils'

const mockUsers: UserType[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@jurislab.com.br',
    fullName: 'Administrador JurisLab',
    role: 'ADMIN',
    slug: 'admin',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    username: 'joao.silva',
    email: 'joao.silva@example.com',
    fullName: 'João Silva',
    role: 'USER',
    slug: 'joao-silva',
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-10'),
  },
  {
    id: '3',
    username: 'maria.santos',
    email: 'maria.santos@advocacia.com',
    fullName: 'Maria Santos',
    role: 'USER',
    slug: 'maria-santos',
    createdAt: new Date('2024-03-05'),
    updatedAt: new Date('2024-03-05'),
  },
]

export default function UsersPage() {
  return (
    <div>
      <Topbar title="Gerenciar Usuários" />
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-slate-500 text-sm">{mockUsers.length} usuários cadastrados</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Usuário
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">
                  Email
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Papel
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">
                  Criado em
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center">
                        <User className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-800 text-sm">{user.fullName}</p>
                        <p className="text-xs text-slate-500">@{user.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-slate-600 hidden md:table-cell">{user.email}</td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium ${
                        user.role === 'ADMIN'
                          ? 'bg-purple-50 text-purple-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {user.role === 'ADMIN' && <Shield className="h-3 w-3" />}
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm text-slate-500 hidden lg:table-cell">
                    {formatDate(user.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <Users className="h-5 w-5 text-slate-400" />
          <p className="text-sm text-slate-500">
            O gerenciamento completo de usuários estará disponível quando o banco de dados for configurado.
          </p>
        </div>
      </div>
    </div>
  )
}
