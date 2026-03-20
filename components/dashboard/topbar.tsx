'use client'

import { Bell, Search, Menu } from 'lucide-react'
import Link from 'next/link'

interface TopbarProps {
  title: string
}

export function Topbar({ title }: TopbarProps) {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <button className="md:hidden p-2 rounded-lg hover:bg-slate-100" aria-label="Menu">
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-semibold text-slate-800">{title}</h1>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-2 w-64">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar..."
            className="bg-transparent text-sm outline-none flex-1 text-slate-600 placeholder:text-slate-400"
          />
        </div>
        <Link
          href="/dashboard/notifications"
          className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors"
          aria-label="Notificações"
        >
          <Bell className="h-5 w-5 text-slate-600" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
        </Link>
      </div>
    </header>
  )
}
