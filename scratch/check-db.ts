import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const estabelecimentos = await prisma.estabelecimento.findMany({
    select: {
      id_estabelecimento: true,
      razao_social: true,
      apelido: true,
    },
  });
  console.log("=== ESTABELECIMENTOS NO BANCO ===");
  console.table(estabelecimentos);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
