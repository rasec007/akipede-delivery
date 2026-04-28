import { prisma } from "@/lib/prisma";

export class LogisticaService {
  private tenantId: string;

  constructor(tenantId: string) {
    this.tenantId = tenantId;
  }

  async getAreasEntrega() {
    try {
      return await prisma.area_entrega.findMany({
        where: { estabelecimento: this.tenantId },
        orderBy: { nome: "asc" }
      });
    } catch (error) {
      console.error("ERRO NO PRISMA LOGISTICA:", error);
      throw error;
    }
  }

  async createArea(data: {
    nome: string;
    valor_entrega: number;
    tempo_entrega?: string;
    distancia_max?: number;
  }) {
    return await prisma.area_entrega.create({
      data: {
        ...data,
        estabelecimento: this.tenantId
      }
    });
  }

  async updateArea(id: string, data: {
    nome: string;
    valor_entrega: number;
    tempo_entrega?: string;
    distancia_max?: number;
  }) {
    return await prisma.area_entrega.update({
      where: { id_area_entrega: id, estabelecimento: this.tenantId },
      data
    });
  }

  async deleteArea(id: string) {
    return await prisma.area_entrega.delete({
      where: { id_area_entrega: id, estabelecimento: this.tenantId }
    });
  }
}
