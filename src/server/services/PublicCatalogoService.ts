import { prisma } from "@/lib/prisma";
import { HorarioService } from "./HorarioService";

export class PublicCatalogoService {
  private slug: string;

  constructor(slug: string) {
    this.slug = slug;
  }

  async getEstabelecimento() {
    const est = await prisma.estabelecimento.findFirst({
      where: { apelido: this.slug },
      select: {
        id_estabelecimento: true,
        razao_social: true,
        apelido: true,
        logo: true,
        descricao: true,
        celular: true,
      }
    });
    return est;
  }

  async getCatalogo(tipo: "delivery" | "mesa" = "delivery") {
    const est = await this.getEstabelecimento();
    if (!est) return null;

    // Busca categorias e produtos visíveis para o tipo (delivery/mesa)
    const categorias = await prisma.categoria.findMany({
      where: { 
        estabelecimento: est.id_estabelecimento,
        deletado: null // Assumindo que null significa não deletado
      },
      include: {
        produto_produto_categoriaTocategoria: {
          where: {
            visibilidade: { contains: tipo }
          },
          include: {
            complemento_tipo_complemento_tipo_produtoToproduto: {
              include: {
                complemento_item_complemento_item_complemento_tipoTocomplemento_tipo: true
              }
            }
          },
          orderBy: { nome: "asc" }
        }
      },
      orderBy: { nome: "asc" }
    });

    // Verifica status de funcionamento
    const horarioService = new HorarioService(est.id_estabelecimento);
    const status = await horarioService.checkAberto();
    const horarios = await horarioService.listHorarios();

    return {
      estabelecimento: est,
      categorias,
      status,
      horarios
    };
  }
}
