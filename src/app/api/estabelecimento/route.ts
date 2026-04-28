import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const tenantId = req.headers.get("x-tenant-id");
    const userId = req.headers.get("x-user-id");

    console.log("DEBUG GET ESTABELECIMENTO:", { tenantId, userId });

    if (!tenantId && !userId) {
      return NextResponse.json({ error: "Identificação não encontrada" }, { status: 401 });
    }

    // Tentar buscar pelo ID da loja ou pelo ID do Responsável
    const loja = await prisma.estabelecimento.findFirst({
      where: {
        OR: [
          { id_estabelecimento: (tenantId && tenantId !== "null" && tenantId !== "") ? tenantId : undefined },
          { responsavel: (userId && userId !== "null" && userId !== "") ? userId : undefined }
        ]
      },
      include: {
        endereco_endereco_vinculoToestabelecimento: {
          where: { padrao: true },
          take: 1
        }
      }
    });
    
    if (!loja) {
      console.log(" - Nenhuma loja encontrada para este vínculo.");
      return NextResponse.json({ error: "Estabelecimento não encontrado" }, { status: 404 });
    }

    // FALLBACK DE APELIDO: Se a loja não tiver apelido, busca o do usuário
    if (!loja.apelido && userId) {
      const usuario = await prisma.usuario.findUnique({
        where: { id_usuario: userId },
        select: { apelido: true }
      });
      if (usuario?.apelido) {
        (loja as any).apelido = usuario.apelido;
        console.log(" - Usando apelido do usuário como fallback:", usuario.apelido);
      }
    }

    console.log(" - Loja carregada com sucesso:", loja.razao_social);

    // Converter BigInt para string para o JSON não quebrar
    const response = JSON.parse(JSON.stringify(loja, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    ));

    return NextResponse.json(response);
  } catch (error: any) {
    console.error("ERRO GET ESTABELECIMENTO:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
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
          pix_nome: data.pix_nome
        }
      });
      
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
