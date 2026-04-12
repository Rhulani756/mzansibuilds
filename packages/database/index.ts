import { PrismaClient } from '@prisma/client';

// 1. Create a factory function for the Prisma Client
const prismaClientSingleton = () => {
  return new PrismaClient();
};

// 2. Extract the exact type from the factory
type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

// 3. Strongly type the global object
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

// 4. Instantiate or reuse the Singleton
export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

// 5. Cache it in development to survive hot-reloads
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export * from '@prisma/client';