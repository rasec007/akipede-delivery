import { BaseService } from "./BaseService";
import { StorageService, StorageFolder } from "./StorageService";

export class CatalogoService extends BaseService {

  // ═══════════════════════════════════════
  // CATEGORIAS
  // ═══════════════════════════════════════

  async listCategorias() {
    return await this.db.categoria.findMany({
      where: { estabelecimento: this.tenantId, deletado: null },
      include: {
        produto_produto_categoriaTocategoria: {
          where: { deletado: null },
          include: {
            complemento_tipo_complemento_tipo_produtoToproduto: {
              where: { deletado: null },
              include: {
                complemento_item_complemento_item_complemento_tipoTocomplemento_tipo: {
                  where: { deletado: null },
                }
              }
            }
          }
        }
      },
      orderBy: { nome: "asc" },
    });
  }

  async createCategoria(nome: string) {
    return await this.db.categoria.create({
      data: {
        nome,
        estabelecimento: this.tenantId,
      }
    });
  }

  async updateCategoria(id: string, nome: string) {
    const cat = await this.db.categoria.findFirst({
      where: { id_categoria: id, estabelecimento: this.tenantId }
    });
    if (!cat) throw new Error("Categoria não encontrada");

    return await this.db.categoria.update({
      where: { id_categoria: id },
      data: { nome }
    });
  }

  async deleteCategoria(id: string) {
    const cat = await this.db.categoria.findFirst({
      where: { id_categoria: id, estabelecimento: this.tenantId },
      include: { produto_produto_categoriaTocategoria: { where: { deletado: null }, select: { nome: true } } }
    });
    if (!cat) throw new Error("Categoria não encontrada");

    const produtos = cat.produto_produto_categoriaTocategoria;
    if (produtos.length > 0) {
      const nomes = produtos.map((p: any) => p.nome).join(", ");
      throw new Error(`Não é possível excluir. Existem ${produtos.length} produto(s) associado(s): ${nomes}`);
    }

    await this.db.categoria.delete({ where: { id_categoria: id } });
    return { success: true };
  }

  // ═══════════════════════════════════════
  // PRODUTOS
  // ═══════════════════════════════════════

  async createProduto(data: {
    nome: string;
    descricao?: string;
    valor: number;
    categoriaId: string;
    foto?: string;
    visibilidade?: string;
  }) {
    let fotoUrl = data.foto;
    if (data.foto && data.foto.startsWith("data:")) {
      const url = await StorageService.uploadBase64(data.foto, StorageFolder.PRODUTOS);
      if (url) fotoUrl = url;
    }

    return await this.db.produto.create({
      data: {
        nome: data.nome,
        descricao: data.descricao,
        valor_total: data.valor,
        categoria: data.categoriaId,
        foto: fotoUrl,
        visibilidade: data.visibilidade ?? "delivery,mesa",
      }
    });
  }

  async updateProduto(id: string, data: {
    nome?: string;
    descricao?: string;
    valor?: number;
    foto?: string;
    visibilidade?: string;
  }) {
    const prod = await this.db.produto.findFirst({
      where: {
        id_produto: id,
        categoria_produto_categoriaTocategoria: { estabelecimento: this.tenantId }
      }
    });
    if (!prod) throw new Error("Produto não encontrado");

    let fotoUrl = data.foto;
    if (data.foto && data.foto.startsWith("data:")) {
      const url = await StorageService.uploadBase64(data.foto, StorageFolder.PRODUTOS);
      if (url) fotoUrl = url;
    }

    return await this.db.produto.update({
      where: { id_produto: id },
      data: {
        nome: data.nome,
        descricao: data.descricao,
        valor_total: data.valor,
        foto: fotoUrl,
        visibilidade: data.visibilidade,
      }
    });
  }

  async deleteProduto(id: string) {
    const prod = await this.db.produto.findFirst({
      where: {
        id_produto: id,
        categoria_produto_categoriaTocategoria: { estabelecimento: this.tenantId }
      },
      include: { complemento_tipo_complemento_tipo_produtoToproduto: { where: { deletado: null }, select: { nome: true } } }
    });
    if (!prod) throw new Error("Produto não encontrado");

    const comps = prod.complemento_tipo_complemento_tipo_produtoToproduto;
    if (comps.length > 0) {
      const nomes = comps.map((c: any) => c.nome).join(", ");
      throw new Error(`Não é possível excluir. Existem ${comps.length} complemento(s) associado(s): ${nomes}`);
    }

    await this.db.produto.delete({ where: { id_produto: id } });
    return { success: true };
  }

  // ═══════════════════════════════════════
  // COMPLEMENTOS (complemento_tipo)
  // ═══════════════════════════════════════

  async createComplemento(data: {
    nome: string;
    produtoId: string;
    qtdMinima?: number;
    qtdMaxima?: number;
  }) {
    return await this.db.complemento_tipo.create({
      data: {
        nome: data.nome,
        produto: data.produtoId,
        quantidade_minima: BigInt(data.qtdMinima ?? 0),
        quantidade_maxima: BigInt(data.qtdMaxima ?? 10),
      }
    });
  }

  async updateComplemento(id: string, data: {
    nome?: string;
    qtdMinima?: number;
    qtdMaxima?: number;
  }) {
    return await this.db.complemento_tipo.update({
      where: { id_complemento_tipo: id },
      data: {
        nome: data.nome,
        quantidade_minima: data.qtdMinima != null ? BigInt(data.qtdMinima) : undefined,
        quantidade_maxima: data.qtdMaxima != null ? BigInt(data.qtdMaxima) : undefined,
      }
    });
  }

  async deleteComplemento(id: string) {
    const comp = await this.db.complemento_tipo.findFirst({
      where: { id_complemento_tipo: id },
      include: { complemento_item_complemento_item_complemento_tipoTocomplemento_tipo: { where: { deletado: null }, select: { nome: true } } }
    });
    if (!comp) throw new Error("Complemento não encontrado");

    const itens = comp.complemento_item_complemento_item_complemento_tipoTocomplemento_tipo;
    if (itens.length > 0) {
      const nomes = itens.map((i: any) => i.nome).join(", ");
      throw new Error(`Não é possível excluir. Existem ${itens.length} item(ns) associado(s): ${nomes}`);
    }

    await this.db.complemento_tipo.delete({ where: { id_complemento_tipo: id } });
    return { success: true };
  }

  // ═══════════════════════════════════════
  // ITENS (complemento_item)
  // ═══════════════════════════════════════

  async createItem(data: {
    nome: string;
    descricao?: string;
    valor?: number;
    complementoTipoId: string;
  }) {
    return await this.db.complemento_item.create({
      data: {
        nome: data.nome,
        descricao: data.descricao,
        valor: data.valor ?? 0,
        complemento_tipo: data.complementoTipoId,
      }
    });
  }

  async updateItem(id: string, data: {
    nome?: string;
    descricao?: string;
    valor?: number;
  }) {
    return await this.db.complemento_item.update({
      where: { id_complemento_item: id },
      data: {
        nome: data.nome,
        descricao: data.descricao,
        valor: data.valor,
      }
    });
  }

  async deleteItem(id: string) {
    await this.db.complemento_item.delete({ where: { id_complemento_item: id } });
    return { success: true };
  }
}
