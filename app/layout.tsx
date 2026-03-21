import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'JurisLab - Plataforma Jurídica Inteligente',
  description: 'Acesse decisões judiciais, contratos trabalhistas e insights de IA para o universo jurídico brasileiro.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>{children}</body>
    </html>
  )
}
