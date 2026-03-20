'use server'

import { z } from 'zod'
import { decisionSearchSchema, createDecisionSchema, updateDecisionSchema } from '@/lib/validators/decision'
import type { JudicialDecision, PaginatedResult } from '@/types'

const mockDecisions: JudicialDecision[] = [
  {
    id: '1',
    title: 'Recurso de Revista - Horas Extras e Adicional Noturno',
    caseNumber: 'RR-1000-12.2023.5.01.0001',
    jurisdiction: 'Tribunal Superior do Trabalho',
    category: 'Direito do Trabalho',
    date: new Date('2024-03-15'),
    judge: 'Min. Alexandre de Souza Agra Belmonte',
    parties: 'João Silva vs. Empresa XYZ Ltda',
    summary: 'Recurso de revista em que se discute o pagamento de horas extras e adicional noturno. O TST decidiu que a empregadora deve pagar as horas extras com acréscimo de 50% e o adicional noturno de 20% sobre as horas trabalhadas entre 22h e 5h.',
    content: 'ACÓRDÃO\n\nVISTO, relatado e discutido este processo...\n\nO Tribunal Superior do Trabalho, por unanimidade, conheceu do recurso de revista e, no mérito, deu-lhe provimento para condenar a reclamada ao pagamento das horas extras e adicional noturno devidos ao reclamante, conforme fundamentação.',
    tags: ['horas extras', 'adicional noturno', 'TST', 'direito trabalhista'],
    slug: 'rr-1000-12-2023-5-01-0001',
    createdAt: new Date('2024-03-15'),
    updatedAt: new Date('2024-03-15'),
  },
  {
    id: '2',
    title: 'Ação Direta de Inconstitucionalidade - Reforma Previdenciária',
    caseNumber: 'ADI-6587',
    jurisdiction: 'Supremo Tribunal Federal',
    category: 'Direito Constitucional',
    date: new Date('2024-02-20'),
    judge: 'Min. Rosa Weber',
    parties: 'Partido dos Trabalhadores vs. União Federal',
    summary: 'ADI questionando dispositivos da Reforma Previdenciária. O STF, por maioria, julgou improcedente a ação, mantendo a constitucionalidade das normas impugnadas.',
    content: 'ACÓRDÃO\n\nDecisão: O Tribunal, por maioria, julgou improcedente a ação direta de inconstitucionalidade...',
    tags: ['previdência social', 'reforma previdenciária', 'STF', 'constitucional'],
    slug: 'adi-6587',
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2024-02-20'),
  },
  {
    id: '3',
    title: 'Habeas Corpus - Tráfico de Drogas - Aplicação do Princípio da Insignificância',
    caseNumber: 'HC-189543',
    jurisdiction: 'Superior Tribunal de Justiça',
    category: 'Direito Penal',
    date: new Date('2024-01-10'),
    judge: 'Min. Rogério Schietti Cruz',
    parties: 'José Almeida (Paciente) vs. Estado de São Paulo (Impetrado)',
    summary: 'Habeas corpus em que se discute a aplicação do princípio da insignificância em caso de tráfico de drogas com pequena quantidade. O STJ negou a ordem, afirmando que o princípio não se aplica a crimes de tráfico.',
    content: 'ACÓRDÃO\n\nO Superior Tribunal de Justiça, por unanimidade, denegou a ordem de habeas corpus...',
    tags: ['habeas corpus', 'tráfico de drogas', 'princípio da insignificância', 'STJ'],
    slug: 'hc-189543',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
  },
  {
    id: '4',
    title: 'Recurso Especial - Responsabilidade Civil - Dano Moral Digital',
    caseNumber: 'REsp-2058691',
    jurisdiction: 'Superior Tribunal de Justiça',
    category: 'Direito Civil',
    date: new Date('2024-04-05'),
    judge: 'Min. Nancy Andrighi',
    parties: 'Maria Santos vs. Plataforma Digital Corp',
    summary: 'Recurso especial discutindo dano moral decorrente de exposição indevida de dados pessoais em plataforma digital. O STJ fixou indenização de R$ 15.000,00 a título de danos morais.',
    content: 'ACÓRDÃO\n\nTrata-se de recurso especial interposto por Maria Santos contra acórdão que julgou improcedente o pedido de indenização por danos morais decorrente de violação de dados pessoais...',
    tags: ['dano moral', 'dados pessoais', 'LGPD', 'responsabilidade civil', 'STJ'],
    slug: 'resp-2058691',
    createdAt: new Date('2024-04-05'),
    updatedAt: new Date('2024-04-05'),
  },
  {
    id: '5',
    title: 'Mandado de Segurança - Licitação - Irregularidade no Processo',
    caseNumber: 'MS-37421',
    jurisdiction: 'Tribunal de Contas da União',
    category: 'Direito Administrativo',
    date: new Date('2024-03-28'),
    judge: 'Min. Bruno Dantas',
    parties: 'Construtora ABC Ltda vs. Ministério das Obras',
    summary: 'Mandado de segurança questionando irregularidades em processo licitatório. O TCU suspendeu o processo e determinou a realização de nova licitação.',
    content: 'ACÓRDÃO\n\nO Plenário do Tribunal de Contas da União, por unanimidade, decidiu suspender cautelarmente o procedimento licitatório...',
    tags: ['licitação', 'TCU', 'direito administrativo', 'mandado de segurança'],
    slug: 'ms-37421',
    createdAt: new Date('2024-03-28'),
    updatedAt: new Date('2024-03-28'),
  },
  {
    id: '6',
    title: 'Apelação Cível - Direito do Consumidor - Recall de Produto',
    caseNumber: 'APL-0123456-78.2023.8.26.0100',
    jurisdiction: 'Tribunal de Justiça de São Paulo',
    category: 'Direito do Consumidor',
    date: new Date('2024-02-14'),
    judge: 'Des. Carlos Roberto Gonçalves',
    parties: 'Pedro Costa vs. Montadora Veículos S.A.',
    summary: 'Apelação em ação de indenização por danos materiais e morais decorrentes de recall de veículo. O TJSP condenou a montadora ao pagamento de indenização.',
    content: 'ACÓRDÃO\n\nVistos, relatados e discutidos estes autos de Apelação Cível...',
    tags: ['recall', 'direito do consumidor', 'TJSP', 'indenização', 'automóvel'],
    slug: 'apl-0123456-78-2023-8-26-0100',
    createdAt: new Date('2024-02-14'),
    updatedAt: new Date('2024-02-14'),
  },
]

export async function listDecisions(params?: Partial<z.infer<typeof decisionSearchSchema>>): Promise<PaginatedResult<JudicialDecision>> {
  const validated = decisionSearchSchema.parse(params ?? {})
  const { query, jurisdiction, category, page, limit } = validated

  let filtered = [...mockDecisions]

  if (query) {
    const q = query.toLowerCase()
    filtered = filtered.filter(d =>
      d.title.toLowerCase().includes(q) ||
      d.caseNumber.toLowerCase().includes(q) ||
      d.summary.toLowerCase().includes(q) ||
      d.tags.some(t => t.toLowerCase().includes(q))
    )
  }
  if (jurisdiction) {
    filtered = filtered.filter(d => d.jurisdiction === jurisdiction)
  }
  if (category) {
    filtered = filtered.filter(d => d.category === category)
  }

  const total = filtered.length
  const totalPages = Math.ceil(total / limit)
  const data = filtered.slice((page - 1) * limit, page * limit)

  return { data, total, page, limit, totalPages }
}

export async function getDecisionById(id: string): Promise<JudicialDecision | null> {
  return mockDecisions.find(d => d.id === id || d.slug === id) ?? null
}

export async function searchDecisions(query: string): Promise<JudicialDecision[]> {
  const q = query.toLowerCase()
  return mockDecisions.filter(d =>
    d.title.toLowerCase().includes(q) ||
    d.caseNumber.toLowerCase().includes(q) ||
    d.tags.some(t => t.toLowerCase().includes(q))
  )
}

export async function createDecision(data: z.infer<typeof createDecisionSchema>): Promise<JudicialDecision> {
  const validated = createDecisionSchema.parse(data)
  const newDecision: JudicialDecision = {
    id: String(mockDecisions.length + 1),
    ...validated,
    date: new Date(validated.date),
    slug: validated.caseNumber.toLowerCase().replace(/[^a-z0-9]/g, '-'),
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  mockDecisions.push(newDecision)
  return newDecision
}

export async function updateDecision(id: string, data: z.infer<typeof updateDecisionSchema>): Promise<JudicialDecision | null> {
  const validated = updateDecisionSchema.parse(data)
  const index = mockDecisions.findIndex(d => d.id === id)
  if (index === -1) return null
  mockDecisions[index] = {
    ...mockDecisions[index],
    ...validated,
    date: validated.date ? new Date(validated.date) : mockDecisions[index].date,
    updatedAt: new Date(),
  }
  return mockDecisions[index]
}

export async function deleteDecision(id: string): Promise<boolean> {
  const index = mockDecisions.findIndex(d => d.id === id)
  if (index === -1) return false
  mockDecisions.splice(index, 1)
  return true
}
