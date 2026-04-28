import { NextRequest, NextResponse } from "next/server";
import { CatalogoService } from "@/server/services/CatalogoService";
import { getAuthContext } from "@/lib/api-helpers";

function serialize(obj: any): any {
  return JSON.parse(JSON.stringify(obj, (_, v) => typeof v === "bigint" ? Number(v) : v));
}

// POST - Cria um novo item
export async function POST(req: NextRequest) {
  try {
    const { tenantId } = getAuthContext();
    if (!tenantId) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const body = await req.json();
    const { nome, descricao, valor, complementoTipoId } = body;

    if (!nome || !complementoTipoId) return NextResponse.json({ error: "Nome e Complemento obrigatórios" }, { status: 400 });

    const service = new CatalogoService(tenantId);
    const item = await service.createItem({
      nome,
      descricao,
      valor: Number(valor) || 0,
      complementoTipoId,
    });
    return NextResponse.json(serialize(item), { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT - Atualiza um item
export async function PUT(req: NextRequest) {
  try {
    const { tenantId } = getAuthContext();
    if (!tenantId) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const body = await req.json();
    const { id, nome, descricao, valor } = body;

    if (!id) return NextResponse.json({ error: "ID obrigatório" }, { status: 400 });

    const service = new CatalogoService(tenantId);
    const item = await service.updateItem(id, {
      nome,
      descricao,
      valor: valor != null ? Number(valor) : undefined,
    });
    return NextResponse.json(serialize(item));
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE - Remove um item
export async function DELETE(req: NextRequest) {
  try {
    const { tenantId } = getAuthContext();
    if (!tenantId) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID obrigatório" }, { status: 400 });

    const service = new CatalogoService(tenantId);
    const result = await service.deleteItem(id);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
