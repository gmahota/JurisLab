'use server'

import { z } from 'zod'
import { contractSearchSchema, createContractSchema, updateContractSchema } from '@/lib/validators/contract'
import type { LaborContract, PaginatedResult } from '@/types'

const mockContracts: LaborContract[] = [
  {
    id: '1',
    title: 'Contrato de Trabalho por Tempo Indeterminado - Analista de TI',
    contractType: 'Contrato de Emprego',
    industry: 'Tecnologia da Informação',
    pages: 8,
    description: 'Modelo padrão de contrato de trabalho por tempo indeterminado para profissionais de TI, incluindo cláusulas sobre jornada de trabalho, remuneração, benefícios e confidencialidade.',
    content: 'CONTRATO DE TRABALHO POR TEMPO INDETERMINADO\n\nPelo presente instrumento particular, as partes abaixo qualificadas acordam celebrar o presente Contrato de Trabalho...',
    tags: ['TI', 'tempo indeterminado', 'analista', 'CLT'],
    downloads: 1247,
    slug: 'contrato-trabalho-tempo-indeterminado-analista-ti',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    title: 'Acordo de Confidencialidade (NDA) - Modelo Empresarial',
    contractType: 'NDA / Confidencialidade',
    industry: 'Geral',
    pages: 4,
    description: 'Modelo de Acordo de Não-Divulgação (NDA) para uso empresarial, protegendo informações confidenciais e segredos comerciais entre as partes contratantes.',
    content: 'ACORDO DE CONFIDENCIALIDADE E NÃO-DIVULGAÇÃO\n\nEste Acordo de Confidencialidade e Não-Divulgação é celebrado entre as partes...',
    tags: ['NDA', 'confidencialidade', 'segredo comercial', 'empresarial'],
    downloads: 2891,
    slug: 'acordo-confidencialidade-nda-modelo-empresarial',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: '3',
    title: 'Contrato de Prestação de Serviços - Consultoria Jurídica',
    contractType: 'Prestação de Serviços',
    industry: 'Serviços Jurídicos',
    pages: 6,
    description: 'Contrato para prestação de serviços de consultoria jurídica, definindo escopo dos serviços, honorários, prazo e condições de rescisão.',
    content: 'CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE CONSULTORIA JURÍDICA\n\nAs partes identificadas ao final deste instrumento acordam entre si o seguinte...',
    tags: ['consultoria', 'jurídico', 'prestação de serviços', 'honorários'],
    downloads: 856,
    slug: 'contrato-prestacao-servicos-consultoria-juridica',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
  },
  {
    id: '4',
    title: 'Acordo Coletivo de Trabalho - Setor Metalúrgico',
    contractType: 'Acordo Coletivo',
    industry: 'Metalurgia',
    pages: 15,
    description: 'Modelo de Acordo Coletivo de Trabalho para o setor metalúrgico, abrangendo jornada, remuneração, benefícios, saúde e segurança no trabalho.',
    content: 'ACORDO COLETIVO DE TRABALHO\n\nO SINDICATO DOS TRABALHADORES METALÚRGICOS e a ASSOCIAÇÃO DAS INDÚSTRIAS METALÚRGICAS celebram o presente Acordo Coletivo...',
    tags: ['acordo coletivo', 'metalurgia', 'sindicato', 'CLT', 'negociação coletiva'],
    downloads: 423,
    slug: 'acordo-coletivo-trabalho-setor-metalurgico',
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-02-15'),
  },
  {
    id: '5',
    title: 'Termo de Rescisão Contratual com Quitação',
    contractType: 'Rescisão Contratual',
    industry: 'Geral',
    pages: 3,
    description: 'Modelo de termo de rescisão contratual com cláusula de quitação geral de verbas trabalhistas, adequado à legislação trabalhista brasileira.',
    content: 'TERMO DE RESCISÃO DO CONTRATO DE TRABALHO\n\nAo(s) ___ dias do mês de ___ de 20___, na sede da empresa RAZÃO SOCIAL DA EMPRESA...',
    tags: ['rescisão', 'demissão', 'quitação', 'TRCT', 'verbas rescisórias'],
    downloads: 3156,
    slug: 'termo-rescisao-contratual-quitacao',
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-01'),
  },
  {
    id: '6',
    title: 'Contrato de Trabalho Temporário - Lei 6.019/74',
    contractType: 'Contrato Temporário',
    industry: 'Geral',
    pages: 5,
    description: 'Contrato de trabalho temporário conforme disposto na Lei 6.019/74, para atender necessidade transitória de substituição de pessoal regular ou acréscimo extraordinário de serviços.',
    content: 'CONTRATO DE TRABALHO TEMPORÁRIO\n\nPelo presente instrumento, nos termos da Lei nº 6.019, de 3 de janeiro de 1974...',
    tags: ['temporário', 'Lei 6.019', 'trabalho temporário', 'substituição'],
    downloads: 678,
    slug: 'contrato-trabalho-temporario-lei-6019',
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-03-10'),
  },
]

export async function listContracts(params?: Partial<z.infer<typeof contractSearchSchema>>): Promise<PaginatedResult<LaborContract>> {
  const validated = contractSearchSchema.parse(params ?? {})
  const { query, contractType, industry, page, limit } = validated

  let filtered = [...mockContracts]

  if (query) {
    const q = query.toLowerCase()
    filtered = filtered.filter(c =>
      c.title.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.tags.some(t => t.toLowerCase().includes(q))
    )
  }
  if (contractType) {
    filtered = filtered.filter(c => c.contractType === contractType)
  }
  if (industry) {
    filtered = filtered.filter(c => c.industry === industry)
  }

  const total = filtered.length
  const totalPages = Math.ceil(total / limit)
  const data = filtered.slice((page - 1) * limit, page * limit)

  return { data, total, page, limit, totalPages }
}

export async function getContractById(id: string): Promise<LaborContract | null> {
  return mockContracts.find(c => c.id === id || c.slug === id) ?? null
}

export async function searchContracts(query: string): Promise<LaborContract[]> {
  const q = query.toLowerCase()
  return mockContracts.filter(c =>
    c.title.toLowerCase().includes(q) ||
    c.tags.some(t => t.toLowerCase().includes(q))
  )
}

export async function createContract(data: z.infer<typeof createContractSchema>): Promise<LaborContract> {
  const validated = createContractSchema.parse(data)
  const newContract: LaborContract = {
    id: String(mockContracts.length + 1),
    ...validated,
    downloads: 0,
    slug: validated.title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-'),
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  mockContracts.push(newContract)
  return newContract
}

export async function updateContract(id: string, data: z.infer<typeof updateContractSchema>): Promise<LaborContract | null> {
  const validated = updateContractSchema.parse(data)
  const index = mockContracts.findIndex(c => c.id === id)
  if (index === -1) return null
  mockContracts[index] = { ...mockContracts[index], ...validated, updatedAt: new Date() }
  return mockContracts[index]
}

export async function deleteContract(id: string): Promise<boolean> {
  const index = mockContracts.findIndex(c => c.id === id)
  if (index === -1) return false
  mockContracts.splice(index, 1)
  return true
}
