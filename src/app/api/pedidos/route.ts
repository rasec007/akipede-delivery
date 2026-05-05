import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAccessToken } from "@/lib/auth";
import { cookies } from "next/headers";

// Converte BigInt para Number para serialização JSON
function serialize(obj: any): any {
  return JSON.parse(JSON.stringify(obj, (_, v) => typeof v === "bigint" ? Number(v) : v));
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const apelido = searchParams.get("apelido");

    const cookieStore = cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const payload = await verifyAccessToken(token);
    if (!payload || !payload.userId) {
      return NextResponse.json({ error: "Sessão inválida" }, { status: 401 });
    }

    // Busca todos os pedidos do usuário para este estabelecimento
    const orders = await prisma.pedido.findMany({
      where: {
        usuario: payload.userId,
        ...(apelido ? { 
          estabelecimento_pedido_estabelecimentoToestabelecimento: {
            apelido: apelido
          }
        } : {})
      },
      orderBy: {
        recebido: 'desc'
      },
      include: {
        estabelecimento_pedido_estabelecimentoToestabelecimento: {
          select: {
            razao_social: true,
            apelido: true,
            logo: true
          }
        },
        dominio_pedido_forma_pagamentoTodominio: true
      }
    });

    return NextResponse.json(serialize(orders));
  } catch (error: any) {
    console.error("Erro ao listar pedidos:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const payload = await verifyAccessToken(token);
    if (!payload || !payload.userId) {
      return NextResponse.json({ error: "Sessão inválida" }, { status: 401 });
    }

    const body = await req.json();
    const { 
      cart, 
      estabelecimentoId, 
      enderecoId, 
      orderType, 
      paymentMethodId, 
      needsChange, 
      changeFor,
      subtotal,
      taxaEntrega,
      total
    } = body;

    // Inicia transação para garantir integridade
    const result = await prisma.$transaction(async (tx) => {
      // Procura por rascunho existente
      const draft = await tx.pedido.findFirst({
        where: {
          usuario: payload.userId,
          estabelecimento: estabelecimentoId,
          recebido: null,
          cancelado: null
        }
      });

      const orderData: any = {
        usuario: payload.userId,
        estabelecimento: estabelecimentoId,
        endereco: orderType === 'delivery' ? enderecoId : null,
        forma_pagamento: paymentMethodId,
        valor_produto: subtotal,
        taxa_entrega: taxaEntrega,
        valor_votal: total,
        troco: needsChange ? parseFloat(changeFor || "0") : null,
        recebido: new Date(), // Ativa o pedido definindo a data de recebimento
      };

      // Gera o número do pedido se ainda não tiver (ou se for novo)
      if (!draft || !draft.num) {
        const now = new Date();
        const datePart = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
        
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const lastOrder = await tx.pedido.findFirst({
          where: {
            estabelecimento: estabelecimentoId,
            recebido: { gte: startOfDay, lte: endOfDay }
          },
          orderBy: { num: "desc" }
        });

        let nextSeq = 1;
        if (lastOrder && lastOrder.num) {
          const lastNumStr = lastOrder.num.toString();
          if (lastNumStr.startsWith(datePart)) {
            nextSeq = parseInt(lastNumStr.slice(8)) + 1;
          }
        }
        
        orderData.num = BigInt(`${datePart}${String(nextSeq).padStart(3, '0')}`);
      }

      let pedido;
      if (draft) {
        // Converte o rascunho em pedido real
        pedido = await tx.pedido.update({
          where: { id_pedido: draft.id_pedido },
          data: orderData
        });

        // Limpa itens antigos do rascunho para garantir que o carrinho final esteja correto
        await tx.lista_carrinho_produto.deleteMany({
          where: { pedido: pedido.id_pedido }
        });
      } else {
        // Cria novo se não houver rascunho
        pedido = await tx.pedido.create({
          data: orderData
        });
      }

      // 2. Criar itens do carrinho e vinculá-los
      for (const item of cart) {
        const carrinhoProduto = await tx.carrinho_produto.create({
          data: {
            atendente: payload.userId, 
            produto: item.produto_id,
            quantidade: BigInt(item.quantidade),
            valor_produto: item.valor_unitario,
            valor_total: item.valor_total,
            obs: item.observacao || "",
          }
        });

        // Vincular ao pedido via lista_carrinho_produto
        await tx.lista_carrinho_produto.create({
          data: {
            pedido: pedido.id_pedido,
            carrinho_produto: carrinhoProduto.id_carrinho_produto
          }
        });

        // 3. Criar complementos se houver
        if (item.itens && item.itens.length > 0) {
          for (const comp of item.itens) {
             await tx.carrinho_complemento.create({
               data: {
                 carrinho_produto: carrinhoProduto.id_carrinho_produto,
                 complemento_item: comp.id_item,
                 complemento_tipo: comp.id_tipo,
                 quantidade: BigInt(comp.quantidade),
                 valor: comp.valor
               }
             });
          }
        }
      }

      return pedido;
    });

    return NextResponse.json(serialize(result));
  } catch (error: any) {
    console.error("Erro ao processar pedido:", error);
    return NextResponse.json({ error: error.message || "Erro interno" }, { status: 500 });
  }
}
