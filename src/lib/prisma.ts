import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/**
 * Função para criar um cliente Prisma com RLS configurado
 * @param tenantId ID da empresa atual
 */
export function getTenantPrisma(tenantId: string) {
  return prisma.$extends({
    query: {
      $allModels: {
        async $allOperations({ args, query }) {
          // Injeta o tenant_id na sessão do Postgres para o RLS
          await prisma.$executeRawUnsafe(`SET LOCAL app.current_tenant_id = '${tenantId}'`);
          return query(args);
        },
      },
    },
  });
}
