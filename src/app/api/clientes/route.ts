export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
import { ClienteService } from "@/server/services/ClienteService";

export async function GET(req: NextRequest) {
  try {
    const tenantId = req.headers.get("x-tenant-id");
    if (!tenantId) return NextResponse.json({ error: "Tenant not found" }, { status: 401 });

    const service = new ClienteService(tenantId);
    const clientes = await service.getClientes();
    
    return NextResponse.json(clientes);
  } catch (error: any) {
    console.error("ERRO API CLIENTES:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const tenantId = req.headers.get("x-tenant-id");
    if (!tenantId) return NextResponse.json({ error: "Tenant not found" }, { status: 401 });

    const data = await req.json();
    const service = new ClienteService(tenantId);
    const novo = await service.createCliente(data);
    
    return NextResponse.json(novo);
  } catch (error: any) {
    console.error("ERRO API CLIENTES:", error);
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

    const service = new ClienteService(tenantId);
    const atualizado = await service.updateCliente(id, rest);
    
    return NextResponse.json(atualizado);
  } catch (error: any) {
    console.error("ERRO API CLIENTES:", error);
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

    const service = new ClienteService(tenantId);
    await service.deleteCliente(id);
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("ERRO API CLIENTES:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
