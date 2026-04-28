import { prisma } from "@/lib/prisma";

export class PagamentoService {
  private tenantId: string;

  constructor(tenantId: string) {
    this.tenantId = tenantId;
  }

  async getFormasPagamento() {
    return await prisma.lista_forma_pagamento.findMany({
      where: { estabelecimento: this.tenantId },
      include: {
        dominio: {
          select: {
            id_dominio: true,
            nome: true,
            tipo: true
          }
        }
      }
    });
  }

  async addFormaPagamento(idDominio: string) {
    // Verifica se já existe
    const exists = await prisma.lista_forma_pagamento.findFirst({
      where: {
        estabelecimento: this.tenantId,
        forma_pagamento: idDominio
      }
    });

    if (exists) return exists;

    return await prisma.lista_forma_pagamento.create({
      data: {
        estabelecimento: this.tenantId,
        forma_pagamento: idDominio
      }
    });
  }

  async removeFormaPagamento(id: string) {
    return await prisma.lista_forma_pagamento.delete({
      where: { 
        id_lista_forma_pagamento: id,
        estabelecimento: this.tenantId 
      }
    });
  }

  // Busca as opções globais de pagamento disponíveis no sistema
  static async getOpcoesGlobais() {
    return await prisma.dominio.findMany({
      where: { tipo: "Forma de Pagamento" },
      orderBy: { nome: "asc" }
    });
  }
}
