import { prisma } from "@/lib/prisma";

export class CupomService {
  private tenantId: string;

  constructor(tenantId: string) {
    this.tenantId = tenantId;
  }

  async getCupons() {
    return await prisma.cupom.findMany({
      where: { estabelecimento: this.tenantId },
      include: {
        dominio: true
      },
      orderBy: { titulo: "asc" }
    });
  }

  async createCupom(data: {
    titulo: string;
    descricao?: string;
    desconto: number;
    idTipoCupom: string;
    quantidade?: number;
    validade?: string;
  }) {
    return await prisma.cupom.create({
      data: {
        titulo: data.titulo,
        descricao: data.descricao,
        desconto: BigInt(Math.round(data.desconto)),
        estabelecimento: this.tenantId,
        tipo_cupom: data.idTipoCupom,
        quantidade: data.quantidade,
        validade: (data.validade && data.validade !== "") ? new Date(data.validade) : null
      }
    });
  }

  async updateCupom(id: string, data: {
    titulo: string;
    descricao?: string;
    desconto: number;
    idTipoCupom: string;
    quantidade?: number;
    validade?: string;
  }) {
    return await prisma.cupom.update({
      where: { id_cupom: id, estabelecimento: this.tenantId },
      data: {
        titulo: data.titulo,
        descricao: data.descricao,
        desconto: BigInt(Math.round(data.desconto)),
        tipo_cupom: data.idTipoCupom,
        quantidade: data.quantidade,
        validade: (data.validade && data.validade !== "") ? new Date(data.validade) : null
      }
    });
  }

  async deleteCupom(id: string) {
    return await prisma.cupom.delete({
      where: { id_cupom: id, estabelecimento: this.tenantId }
    });
  }
}
