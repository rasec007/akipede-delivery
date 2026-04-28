const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.dominio.findMany({ where: { tipo: 'Ramo de Atividade' } })
  .then(console.log)
  .finally(() => prisma.$disconnect());
