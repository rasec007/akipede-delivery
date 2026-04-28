import { NextRequest, NextResponse } from "next/server";
import { EntregadorService } from "@/server/services/EntregadorService";

export async function GET(req: NextRequest) {
  try {
    const tenantId = req.headers.get("x-tenant-id");
    if (!tenantId) return NextResponse.json({ error: "Tenant not found" }, { status: 401 });

    const service = new EntregadorService(tenantId);
    const entregadores = await service.getEntregadores();
    
    return NextResponse.json(entregadores);
  } catch (error: any) {
    console.error("ERRO API ENTREGADORES:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const tenantId = req.headers.get("x-tenant-id");
    if (!tenantId) return NextResponse.json({ error: "Tenant not found" }, { status: 401 });

    const data = await req.json();
    const service = new EntregadorService(tenantId);
    const novo = await service.createEntregador(data);
    
    return NextResponse.json(novo);
  } catch (error: any) {
    console.error("ERRO API ENTREGADORES:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const tenantId = req.headers.get("x-tenant-id");
    if (!tenantId) return NextResponse.json({ error: "Tenant not found" }, { status: 401 });

    const data = await req.json();
    const { id, ...rest } = data;

    if (!id) return NextResponse.json({ error: "ID não fornecido" }, { status: 400 });

    const service = new EntregadorService(tenantId);
    const atualizado = await service.updateEntregador(id, rest);
    
    return NextResponse.json(atualizado);
  } catch (error: any) {
    console.error("ERRO API ENTREGADORES:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const tenantId = req.headers.get("x-tenant-id");
    if (!tenantId) return NextResponse.json({ error: "Tenant not found" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "ID não fornecido" }, { status: 400 });

    const service = new EntregadorService(tenantId);
    await service.deleteEntregador(id);
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("ERRO API ENTREGADORES:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
