import { NextRequest, NextResponse } from "next/server";
import { CatalogoService } from "@/server/services/CatalogoService";
import { getAuthContext } from "@/lib/api-helpers";

// Converte BigInt para Number em objetos aninhados para serialização JSON
function serialize(obj: any): any {
  return JSON.parse(JSON.stringify(obj, (_, v) => typeof v === "bigint" ? Number(v) : v));
}

// GET - Lista todas as categorias com produtos, complementos e itens
export async function GET(req: NextRequest) {
  try {
    const { tenantId: authTenantId } = getAuthContext();
    const { searchParams } = new URL(req.url);
    const queryTenantId = searchParams.get("tenantId");

    // Usa o tenantId do contexto (logado) ou da query (público)
    const tenantId = authTenantId || queryTenantId;

    if (!tenantId) {
      return NextResponse.json({ error: "Não autorizado ou Tenant ID ausente" }, { status: 401 });
    }

    const service = new CatalogoService(tenantId);
    const categorias = await service.listCategorias();
    return NextResponse.json(serialize(categorias));
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - Cria uma nova categoria
export async function POST(req: NextRequest) {
  try {
    const { tenantId } = getAuthContext();
    if (!tenantId) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const body = await req.json();
    const { nome } = body;

    if (!nome) return NextResponse.json({ error: "Nome obrigatório" }, { status: 400 });

    const service = new CatalogoService(tenantId);
    const categoria = await service.createCategoria(nome);
    return NextResponse.json(serialize(categoria), { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT - Atualiza uma categoria
export async function PUT(req: NextRequest) {
  try {
    const { tenantId } = getAuthContext();
    if (!tenantId) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const body = await req.json();
    const { id, nome } = body;

    if (!id || !nome) return NextResponse.json({ error: "ID e Nome obrigatórios" }, { status: 400 });

    const service = new CatalogoService(tenantId);
    const categoria = await service.updateCategoria(id, nome);
    return NextResponse.json(serialize(categoria));
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE - Remove uma categoria
export async function DELETE(req: NextRequest) {
  try {
    const { tenantId } = getAuthContext();
    if (!tenantId) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID obrigatório" }, { status: 400 });

    const service = new CatalogoService(tenantId);
    const result = await service.deleteCategoria(id);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
