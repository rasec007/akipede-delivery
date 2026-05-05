import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAccessToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const estabelecimentoId = searchParams.get("estabelecimentoId");

    const cookieStore = cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token || !estabelecimentoId) {
      return NextResponse.json({ error: "Parâmetros inválidos" }, { status: 400 });
    }

    const payload = await verifyAccessToken(token);
    if (!payload || !payload.userId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Busca o pedido mais recente "não concluído" para este usuário e estabelecimento
    const lastActiveOrder = await prisma.pedido.findFirst({
      where: {
        usuario: payload.userId,
        estabelecimento: estabelecimentoId,
        entregue: null,
        cancelado: null,
      },
      orderBy: {
        recebido: 'desc' // Assume que o mais recente recebido é o atual
      },
      select: {
        endereco: true,
        forma_pagamento: true,
        troco: true,
      }
    });

    if (!lastActiveOrder) {
      // Se não houver pedido ativo, busca o ÚLTIMO pedido finalizado para sugerir preferências
      const lastFinalizedOrder = await prisma.pedido.findFirst({
        where: {
          usuario: payload.userId,
          estabelecimento: estabelecimentoId,
        },
        orderBy: {
          recebido: 'desc'
        },
        select: {
          endereco: true,
          forma_pagamento: true,
          troco: true,
        }
      });
      return NextResponse.json(lastFinalizedOrder || {});
    }

    return NextResponse.json(lastActiveOrder);
  } catch (error) {
    console.error("Erro ao buscar preferências de checkout:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
