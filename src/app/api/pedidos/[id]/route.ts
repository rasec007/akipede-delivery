export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAccessToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function GET(req: Request, { params }: { params: { id: string } }) {
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

    const pedido = await prisma.pedido.findUnique({
      where: { id_pedido: params.id },
      include: {
        estabelecimento_pedido_estabelecimentoToestabelecimento: true,
        endereco_pedido_enderecoToendereco: true,
        dominio_pedido_forma_pagamentoTodominio: true,
        lista_carrinho_produto_lista_carrinho_produto_pedidoTopedido: {
          include: {
            carrinho_produto_lista_carrinho_produto_carrinho_produtoTocarrinho_produto: {
              include: {
                produto_carrinho_produto_produtoToproduto: true,
                carrinho_complemento_carrinho_complemento_carrinho_produtoTocarrinho_produto: {
                  include: {
                    complemento_item_carrinho_complemento_complemento_itemTocomplemento_item: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!pedido) {
      return NextResponse.json({ error: "Pedido não encontrado" }, { status: 404 });
    }

    // Verifica se o pedido pertence ao usuário
    if (pedido.usuario !== payload.userId) {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }

    return NextResponse.json(JSON.parse(JSON.stringify(pedido, (_, v) => typeof v === "bigint" ? Number(v) : v)));
  } catch (error: any) {
    console.error("Erro ao buscar pedido:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
