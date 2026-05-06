export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAccessToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function PATCH(req: Request) {
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
      estabelecimentoId, 
      enderecoId, 
      paymentMethodId, 
      needsChange, 
      changeFor,
      subtotal,
      taxaEntrega,
      total
    } = body;

    // Procura por um rascunho existente (pedido onde 'recebido' é NULL)
    const draft = await prisma.pedido.findFirst({
      where: {
        usuario: payload.userId,
        estabelecimento: estabelecimentoId,
        recebido: null,
        cancelado: null,
      }
    });

    const dataToSave = {
      usuario: payload.userId,
      estabelecimento: estabelecimentoId,
      endereco: enderecoId || null,
      forma_pagamento: paymentMethodId || null,
      valor_produto: subtotal || 0,
      taxa_entrega: taxaEntrega || 0,
      valor_votal: total || 0,
      troco: needsChange ? parseFloat(changeFor || "0") : null,
      // recebido continua NULL para indicar rascunho
    };

    let result;
    if (draft) {
      result = await prisma.pedido.update({
        where: { id_pedido: draft.id_pedido },
        data: dataToSave
      });
    } else {
      result = await prisma.pedido.create({
        data: dataToSave
      });
    }

    return NextResponse.json(JSON.parse(JSON.stringify(result, (_, v) => typeof v === "bigint" ? Number(v) : v)));
  } catch (error: any) {
    console.error("Erro ao salvar rascunho do pedido:", error);
    return NextResponse.json({ error: "Erro interno ao salvar progresso" }, { status: 500 });
  }
}
