import { z } from 'zod'

export const contractSearchSchema = z.object({
  query: z.string().optional(),
  contractType: z.string().optional(),
  industry: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
})

export const createContractSchema = z.object({
  title: z.string().min(3, 'Título deve ter pelo menos 3 caracteres'),
  contractType: z.string().min(1, 'Tipo de contrato é obrigatório'),
  industry: z.string().min(1, 'Indústria é obrigatória'),
  pages: z.coerce.number().min(1, 'Número de páginas deve ser pelo menos 1'),
  description: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
  content: z.string().min(10, 'Conteúdo deve ter pelo menos 10 caracteres'),
  tags: z.array(z.string()).default([]),
})

export const updateContractSchema = createContractSchema.partial()

export type ContractSearchInput = z.infer<typeof contractSearchSchema>
export type CreateContractInput = z.infer<typeof createContractSchema>
export type UpdateContractInput = z.infer<typeof updateContractSchema>
