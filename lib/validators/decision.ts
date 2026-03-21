import { z } from 'zod'

export const decisionSearchSchema = z.object({
  query: z.string().optional(),
  jurisdiction: z.string().optional(),
  category: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
})

export const createDecisionSchema = z.object({
  title: z.string().min(3, 'Título deve ter pelo menos 3 caracteres'),
  caseNumber: z.string().min(1, 'Número do processo é obrigatório'),
  jurisdiction: z.string().min(1, 'Jurisdição é obrigatória'),
  category: z.string().min(1, 'Categoria é obrigatória'),
  date: z.string().min(1, 'Data é obrigatória'),
  judge: z.string().min(1, 'Juiz é obrigatório'),
  parties: z.string().min(1, 'Partes são obrigatórias'),
  summary: z.string().min(10, 'Resumo deve ter pelo menos 10 caracteres'),
  content: z.string().min(10, 'Conteúdo deve ter pelo menos 10 caracteres'),
  tags: z.array(z.string()).default([]),
})

export const updateDecisionSchema = createDecisionSchema.partial()

export type DecisionSearchInput = z.infer<typeof decisionSearchSchema>
export type CreateDecisionInput = z.infer<typeof createDecisionSchema>
export type UpdateDecisionInput = z.infer<typeof updateDecisionSchema>
