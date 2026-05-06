export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { triggerRealtime } from "@/lib/pusher";

export async function GET(req: NextRequest) {
  try {
    const rawTenantId = req.headers.get("x-tenant-id");
    const rawUserId = req.headers.get("x-user-id");

    const tenantId = (rawTenantId && rawTenantId !== "null" && rawTenantId !== "undefined" && rawTenantId !== "") ? rawTenantId.trim() : null;
    const userId = (rawUserId && rawUserId !== "null" && rawUserId !== "undefined" && rawUserId !== "") ? rawUserId.trim() : null;

    if (!tenantId && !userId) {
      return NextResponse.json({ error: "Identificação não encontrada" }, { status: 401 });
    }

    const orFilter = [];
    if (userId) orFilter.push({ responsavel: userId });
    if (tenantId) orFilter.push({ id_estabelecimento: tenantId });

    // Buscar a Loja
    const loja = await prisma.estabelecimento.findFirst({
      where: {
        OR: orFilter
      }
    });
    
    if (!loja) {
      return NextResponse.json({ error: "Estabelecimento não encontrado" }, { status: 404 });
    }

    // FALLBACK DE APELIDO
    if (!loja.apelido && userId && userId.length > 10) {
      try {
        const usuario = await prisma.usuario.findUnique({
          where: { id_usuario: userId },
          select: { apelido: true }
        });
        if (usuario?.apelido) {
          (loja as any).apelido = usuario.apelido;
        }
      } catch (err) {}
    }

    const response = JSON.parse(JSON.stringify(loja, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    ));

    return NextResponse.json(response);
  } catch (error: any) {
    console.error(" 🔥 ERRO 500 NA API:", error);
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const tenantId = req.headers.get("x-tenant-id");
    if (!tenantId) return NextResponse.json({ error: "Tenant not found" }, { status: 401 });

    const data = await req.json();
    console.log("DADOS RECEBIDOS PARA UPDATE:", data);

    // Limpar pedido_minimo para garantir que seja apenas números
    const cleanPedidoMinimo = data.pedido_minimo?.toString().replace(/\D/g, "");

    console.log(`🚀 INICIANDO UPDATE PARA LOJA [${tenantId}]`);
    console.log("📦 DADOS ENVIADOS:", { 
      razao_social: data.razao_social, 
      endereco: data.endereco,
      numero: data.numero 
    });

    try {
      const atualizado = await prisma.estabelecimento.update({
        where: { id_estabelecimento: tenantId },
        data: {
          razao_social: data.razao_social,
          apelido: data.apelido,
          cpf_cnpj: data.cpf_cnpj,
          celular: data.celular ? data.celular.replace(/\D/g, "") : null,
          email: data.email,
          descricao: data.descricao,
          pedido_minimo: cleanPedidoMinimo ? BigInt(cleanPedidoMinimo) : null,
          logo: data.logo,
          banner: data.banner,
          pix_tipo: data.pix_tipo,
          pix_chave: data.pix_chave,
          pix_nome: data.pix_nome,
          endereco: data.endereco,
          numero: data.numero,
          complemento: data.complemento,
          ponto_referencia: data.ponto_referencia
        }
      });
      
      console.log("✅ UPDATE CONCLUÍDO COM SUCESSO NO BANCO!");
      
      // Notificar catálogo em tempo real
      try {
        await triggerRealtime(`catalog-${tenantId}`, "catalog-updated", { timestamp: Date.now() });
      } catch (pusherErr) {
        console.error("Erro ao notificar Pusher:", pusherErr);
      }

      const response = JSON.parse(JSON.stringify(atualizado, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value
      ));

      return NextResponse.json(response);
    } catch (dbError: any) {
      console.error("ERRO NO PRISMA UPDATE:", dbError);
      return NextResponse.json({ 
        error: "Erro no banco de dados", 
        details: dbError.message,
        code: dbError.code 
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error("ERRO API ESTABELECIMENTO (GERAL):", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
