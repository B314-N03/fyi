// prisma/seed.js
import { PrismaClient } from '@prisma/client'
import influencers from './influencer_liste.json' assert { type: 'json' }

const prisma = new PrismaClient()

async function main() {
  for (const influencer of influencers) {
    await prisma.influencer.upsert({
      where: { id: influencer.id },
      update: {},
      create: influencer,
    })
  }
  console.log('Seeded successfully')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
