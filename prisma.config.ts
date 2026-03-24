import { defineConfig } from 'prisma/config'

export default defineConfig({
  earlyAccess: true,
  schema: 'prisma/schema.prisma',
  migrate: {
    url: 'postgresql://postgres:2ailG3Pf2xMfl4cy@db.nkzqojeidxbauewsdhzu.supabase.co:5432/postgres',
  },
})