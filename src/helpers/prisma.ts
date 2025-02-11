import { PrismaClient } from '@prisma/client';

// initialized prisma client for DRY database operations.
const prisma = new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'error',
    },
  ],
});
// logging database connection status
async function main() {
  try {
    await prisma.$connect();
    console.log('Database connected successfully...');
  } catch (e) {
    console.error('Failed to connect to the database:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();

// logging any error related to prisma operations
prisma.$on('error', (e: any) => {
  console.log(e);
});

export default prisma;
