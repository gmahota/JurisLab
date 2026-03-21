import Link from 'next/link'
import { Scale, FileText, Brain, Shield, ArrowRight, CheckCircle } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white">
      {/* Header */}
      <header className="container mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Scale className="h-8 w-8 text-blue-400" />
          <span className="text-2xl font-bold">JurisLab</span>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <Link href="#features" className="text-slate-300 hover:text-white transition-colors">
            Funcionalidades
          </Link>
          <Link href="#about" className="text-slate-300 hover:text-white transition-colors">
            Sobre
          </Link>
          <Link
            href="/dashboard"
            className="bg-blue-600 hover:bg-blue-500 px-5 py-2 rounded-lg font-medium transition-colors"
          >
            Acessar Plataforma
          </Link>
        </nav>
        <Link
          href="/dashboard"
          className="md:hidden bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg font-medium transition-colors text-sm"
        >
          Entrar
        </Link>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-900/40 border border-blue-700/50 rounded-full px-4 py-1.5 text-sm text-blue-300 mb-8">
          <Brain className="h-4 w-4" />
          Inteligência Artificial Jurídica
        </div>
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          O futuro do
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
            {' '}Direito Moçambicano
          </span>
        </h1>
        <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-10">
          Acesse milhares de decisões judiciais, modelos de contratos e insights gerados
          por IA. Pesquise, analise e tome decisões com mais segurança jurídica.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-8 py-4 rounded-xl font-semibold text-lg transition-colors w-full sm:w-auto justify-center"
          >
            Começar agora
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link
            href="/dashboard/decisions"
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 px-8 py-4 rounded-xl font-semibold text-lg transition-colors w-full sm:w-auto justify-center"
          >
            Ver decisões
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: '50.000+', label: 'Decisões Judiciais' },
            { value: '2.000+', label: 'Modelos de Contratos' },
            { value: '98%', label: 'Precisão da IA' },
            { value: '15.000+', label: 'Profissionais Ativos' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center"
            >
              <div className="text-3xl font-bold text-blue-400 mb-1">{stat.value}</div>
              <div className="text-slate-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="container mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Tudo que você precisa</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Uma plataforma completa para profissionais do direito, com ferramentas inteligentes
            para acelerar seu trabalho.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Scale,
              title: 'Decisões Judiciais',
              description:
                'Pesquise e consulte decisões do STF, STJ, TST e tribunais de todo o Brasil. Filtros avançados por jurisdição, categoria e período.',
              color: 'text-blue-400',
              bg: 'bg-blue-900/20 border-blue-800/30',
            },
            {
              icon: FileText,
              title: 'Contratos Trabalhistas',
              description:
                'Acesse modelos completos de contratos, acordos coletivos e documentos trabalhistas. Adapte e baixe com um clique.',
              color: 'text-emerald-400',
              bg: 'bg-emerald-900/20 border-emerald-800/30',
            },
            {
              icon: Brain,
              title: 'Insights de IA',
              description:
                'Análises automatizadas de tendências jurídicas, resumos de jurisprudência e alertas sobre mudanças legislativas.',
              color: 'text-purple-400',
              bg: 'bg-purple-900/20 border-purple-800/30',
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className={`border rounded-2xl p-8 ${feature.bg} hover:scale-[1.02] transition-transform`}
            >
              <feature.icon className={`h-10 w-10 ${feature.color} mb-4`} />
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section id="about" className="container mx-auto px-6 py-24">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6">
              Por que escolher o JurisLab?
            </h2>
            <p className="text-slate-400 text-lg mb-8">
              Desenvolvido especificamente para o mercado jurídico brasileiro, o JurisLab
              combina tecnologia de ponta com profundo conhecimento do direito nacional.
            </p>
            <ul className="space-y-4">
              {[
                'Base de dados atualizada diariamente',
                'Busca semântica com IA avançada',
                'Interface intuitiva e responsiva',
                'Exportação em múltiplos formatos',
                'Histórico completo de pesquisas',
                'Alertas personalizados por área do direito',
              ].map((benefit) => (
                <li key={benefit} className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                  <span className="text-slate-300">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 border border-white/10 rounded-3xl p-8">
            <Shield className="h-12 w-12 text-blue-400 mb-4" />
            <h3 className="text-2xl font-bold mb-4">Segurança e Confiabilidade</h3>
            <p className="text-slate-400 mb-6">
              Todos os dados são armazenados com criptografia de nível empresarial.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Acessar a plataforma
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Scale className="h-6 w-6 text-blue-400" />
            <span className="text-lg font-semibold">JurisLab</span>
          </div>
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} JurisLab. Todos os direitos reservados.
          </p>
          <nav className="flex items-center gap-6 text-sm text-slate-400">
            <Link href="#" className="hover:text-white transition-colors">Privacidade</Link>
            <Link href="#" className="hover:text-white transition-colors">Termos</Link>
            <Link href="#" className="hover:text-white transition-colors">Contato</Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}
