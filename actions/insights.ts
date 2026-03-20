'use server'

import type { AiInsight } from '@/types'

const mockInsights: AiInsight[] = [
  {
    id: '1',
    title: 'Tendência: Aumento de Ações por Danos Morais Digitais',
    content: 'Análise dos últimos 6 meses indica crescimento de 34% nas ações por danos morais relacionados a violações de dados pessoais e privacidade digital. A entrada em vigor plena da LGPD tem impulsionado este fenômeno, com empresas de tecnologia como principais rés.',
    documentType: 'JUDICIAL_DECISION',
    insightType: 'TREND',
    confidence: 0.92,
    createdAt: new Date('2024-04-01'),
  },
  {
    id: '2',
    title: 'Análise: Impacto da Reforma Trabalhista nos Acordos Coletivos',
    content: 'Desde a Reforma Trabalhista de 2017, observa-se tendência consolidada do TST em dar prevalência ao negociado sobre o legislado em matérias como jornada de trabalho flexível e benefícios. Esta análise examina 127 acórdãos recentes que consolidam este entendimento.',
    documentType: 'LABOR_CONTRACT',
    insightType: 'ANALYSIS',
    confidence: 0.88,
    createdAt: new Date('2024-03-25'),
  },
  {
    id: '3',
    title: 'Resumo Jurisprudencial: STF e o Marco Civil da Internet',
    content: 'Compilação das principais decisões do STF sobre responsabilidade civil de plataformas digitais com base no Marco Civil da Internet. O tribunal tem adotado posição de responsabilidade subjetiva, exigindo notificação prévia para remoção de conteúdo.',
    insightType: 'SUMMARY',
    confidence: 0.95,
    createdAt: new Date('2024-03-20'),
  },
  {
    id: '4',
    title: 'Tendência: Contratos de Trabalho Remoto Pós-Pandemia',
    content: 'Identificamos padrão crescente de litígios relacionados ao teletrabalho, especialmente sobre custeio de despesas e controle de jornada. As empresas que não adequaram seus contratos à Portaria 671/2021 enfrentam maior volume de ações trabalhistas.',
    documentType: 'LABOR_CONTRACT',
    insightType: 'TREND',
    confidence: 0.85,
    createdAt: new Date('2024-03-15'),
  },
  {
    id: '5',
    title: 'Análise de Precedentes: Revisão de Contratos por Onerosidade Excessiva',
    content: 'Estudo de 89 decisões do STJ sobre revisão contratual por onerosidade excessiva pós-pandemia revela que os tribunais têm sido cautelosos em aplicar a teoria da imprevisão, exigindo demonstração robusta do desequilíbrio contratual.',
    documentType: 'JUDICIAL_DECISION',
    insightType: 'ANALYSIS',
    confidence: 0.91,
    createdAt: new Date('2024-03-10'),
  },
]

export async function listInsights(limit?: number): Promise<AiInsight[]> {
  const result = [...mockInsights].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  return limit ? result.slice(0, limit) : result
}

export async function getInsightById(id: string): Promise<AiInsight | null> {
  return mockInsights.find(i => i.id === id) ?? null
}
