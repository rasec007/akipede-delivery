import { BaseService } from "./BaseService";

export class ProductService extends BaseService {
  /**
   * Lista todos os produtos do estabelecimento atual
   */
  async listAll() {
    return await this.db.produto.findMany({
      where: {
        categoria_produto_categoriaTocategoria: {
          estabelecimento: this.tenantId
        }
      },
      include: {
        categoria_produto_categoriaTocategoria: true,
      },
      orderBy: { nome: "asc" },
    });
  }

  /**
   * Cria um novo produto
   */
  async create(data: {
    nome: string;
    descricao?: string;
    preco: number;
    categoriaId: string;
  }) {
    return await this.db.produto.create({
      data: {
        nome: data.nome,
        descricao: data.descricao,
        valor_total: data.preco,
        categoria: data.categoriaId,
      },
    });
  }

  /**
   * Busca um produto por ID (Garante que pertence ao tenant)
   */
  async getById(id: string) {
    const product = await this.db.produto.findFirst({
      where: {
        id_produto: id,
        categoria_produto_categoriaTocategoria: {
          estabelecimento: this.tenantId
        }
      },
    });

    if (!product) throw new Error("Produto não encontrado");
    return product;
  }
}
