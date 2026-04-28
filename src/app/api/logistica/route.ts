import { NextRequest, NextResponse } from "next/server";
import { LogisticaService } from "@/server/services/LogisticaService";

export async function GET(req: NextRequest) {
  try {
    const tenantId = req.headers.get("x-tenant-id");
    if (!tenantId) return NextResponse.json({ error: "Tenant not found" }, { status: 401 });

    const service = new LogisticaService(tenantId);
    const areas = await service.getAreasEntrega();
    
    return NextResponse.json(areas);
  } catch (error: any) {
    console.error("ERRO API LOGISTICA:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const tenantId = req.headers.get("x-tenant-id");
    if (!tenantId) return NextResponse.json({ error: "Tenant not found" }, { status: 401 });

    const data = await req.json();
    const service = new LogisticaService(tenantId);
    const novo = await service.createArea(data);
    
    return NextResponse.json(novo);
  } catch (error: any) {
    console.error("ERRO API LOGISTICA:", error);
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

    const service = new LogisticaService(tenantId);
    const atualizado = await service.updateArea(id, rest);
    
    return NextResponse.json(atualizado);
  } catch (error: any) {
    console.error("ERRO API LOGISTICA:", error);
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

    const service = new LogisticaService(tenantId);
    await service.deleteArea(id);
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("ERRO API LOGISTICA:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
