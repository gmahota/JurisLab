import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@jurislab.com.br' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@jurislab.com.br',
      passwordHash: 'hashed_password_placeholder',
      fullName: 'Administrador JurisLab',
      role: 'ADMIN',
      slug: 'admin',
    },
  })

  console.log('Created admin user:', admin.email)

  // Create sample judicial decision
  await prisma.judicialDecision.upsert({
    where: { caseNumber: 'RR-1000-12.2023.5.01.0001' },
    update: {},
    create: {
      title: 'Recurso de Revista - Horas Extras e Adicional Noturno',
      caseNumber: 'RR-1000-12.2023.5.01.0001',
      jurisdiction: 'Tribunal Superior do Trabalho',
      category: 'Direito do Trabalho',
      date: new Date('2024-03-15'),
      judge: 'Min. Alexandre de Souza Agra Belmonte',
      parties: 'João Silva vs. Empresa XYZ Ltda',
      summary: 'Recurso de revista em que se discute o pagamento de horas extras e adicional noturno.',
      content: 'ACÓRDÃO\n\nO Tribunal Superior do Trabalho, por unanimidade, conheceu do recurso...',
      tags: ['horas extras', 'adicional noturno', 'TST'],
      slug: 'rr-1000-12-2023-5-01-0001',
    },
  })

  // Create sample labor contract
  await prisma.laborContract.upsert({
    where: { slug: 'contrato-trabalho-tempo-indeterminado-analista-ti' },
    update: {},
    create: {
      title: 'Contrato de Trabalho por Tempo Indeterminado - Analista de TI',
      contractType: 'Contrato de Emprego',
      industry: 'Tecnologia da Informação',
      pages: 8,
      description: 'Modelo padrão de contrato de trabalho por tempo indeterminado para profissionais de TI.',
      content: 'CONTRATO DE TRABALHO POR TEMPO INDETERMINADO\n\nPelo presente instrumento...',
      tags: ['TI', 'tempo indeterminado', 'analista', 'CLT'],
      slug: 'contrato-trabalho-tempo-indeterminado-analista-ti',
    },
  })

  console.log('Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
