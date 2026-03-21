'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Scale,
  FileText,
  Brain,
  Heart,
  History,
  Bell,
  Settings,
  Users,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', label: 'Painel', icon: LayoutDashboard, exact: true },
  { href: '/dashboard/decisions', label: 'Decisões Judiciais', icon: Scale },
  { href: '/dashboard/contracts', label: 'Contratos', icon: FileText },
  { href: '/dashboard/insights', label: 'Insights de IA', icon: Brain },
  { href: '/dashboard/favorites', label: 'Favoritos', icon: Heart },
  { href: '/dashboard/history', label: 'Histórico', icon: History },
  { href: '/dashboard/notifications', label: 'Notificações', icon: Bell },
]

const adminItems = [
  { href: '/admin', label: 'Administração', icon: Settings, exact: true },
  { href: '/admin/users', label: 'Usuários', icon: Users },
]

export function DashboardSidebar() {
  const pathname = usePathname()

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-white flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-slate-700">
        <Link href="/" className="flex items-center gap-2">
          <Scale className="h-7 w-7 text-blue-400" />
          <span className="text-xl font-bold">JurisLab</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
              isActive(item.href, item.exact)
                ? 'bg-blue-600 text-white'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            )}
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            {item.label}
            {isActive(item.href, item.exact) && (
              <ChevronRight className="h-4 w-4 ml-auto" />
            )}
          </Link>
        ))}

        <div className="pt-4 mt-4 border-t border-slate-700">
          <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Admin
          </p>
          {adminItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive(item.href, item.exact)
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* User info */}
      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-semibold">
            A
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">Administrador</p>
            <p className="text-xs text-slate-400 truncate">admin@jurislab.com.br</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
