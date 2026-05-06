export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
import { CatalogoService } from "@/server/services/CatalogoService";
import { getAuthContext } from "@/lib/api-helpers";

function serialize(obj: any): any {
  return JSON.parse(JSON.stringify(obj, (_, v) => typeof v === "bigint" ? Number(v) : v));
}

// POST - Cria um novo complemento
export async function POST(req: NextRequest) {
  try {
    const { tenantId } = getAuthContext();
    if (!tenantId) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const body = await req.json();
    const { nome, produtoId, qtdMinima, qtdMaxima } = body;

    if (!nome || !produtoId) return NextResponse.json({ error: "Nome e Produto obrigatórios" }, { status: 400 });

    const service = new CatalogoService(tenantId);
    const complemento = await service.createComplemento({
      nome,
      produtoId,
      qtdMinima: Number(qtdMinima) || 0,
      qtdMaxima: Number(qtdMaxima) || 10,
    });
    return NextResponse.json(serialize(complemento), { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT - Atualiza um complemento
export async function PUT(req: NextRequest) {
  try {
    const { tenantId } = getAuthContext();
    if (!tenantId) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const body = await req.json();
    const { id, nome, qtdMinima, qtdMaxima } = body;

    if (!id) return NextResponse.json({ error: "ID obrigatório" }, { status: 400 });

    const service = new CatalogoService(tenantId);
    const complemento = await service.updateComplemento(id, {
      nome,
      qtdMinima: qtdMinima != null ? Number(qtdMinima) : undefined,
      qtdMaxima: qtdMaxima != null ? Number(qtdMaxima) : undefined,
    });
    return NextResponse.json(serialize(complemento));
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE - Remove um complemento
export async function DELETE(req: NextRequest) {
  try {
    const { tenantId } = getAuthContext();
    if (!tenantId) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID obrigatório" }, { status: 400 });

    const service = new CatalogoService(tenantId);
    const result = await service.deleteComplemento(id);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
