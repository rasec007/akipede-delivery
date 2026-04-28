import { NextRequest, NextResponse } from "next/server";
import { CupomService } from "@/server/services/CupomService";

export async function GET(req: NextRequest) {
  try {
    const tenantId = req.headers.get("x-tenant-id");
    if (!tenantId) return NextResponse.json({ error: "Tenant not found" }, { status: 401 });

    const service = new CupomService(tenantId);
    const cupons = await service.getCupons();
    
    // Serializar BigInt
    const serialized = cupons.map(c => ({
      ...c,
      desconto: Number(c.desconto)
    }));

    return NextResponse.json(serialized);
  } catch (error: any) {
    console.error("ERRO API CUPONS:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const tenantId = req.headers.get("x-tenant-id");
    if (!tenantId) return NextResponse.json({ error: "Tenant not found" }, { status: 401 });

    const data = await req.json();
    const service = new CupomService(tenantId);
    const novo = await service.createCupom(data);
    
    return NextResponse.json({ ...novo, desconto: Number(novo.desconto) });
  } catch (error: any) {
    console.error("ERRO API CUPONS:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const tenantId = req.headers.get("x-tenant-id");
    if (!tenantId) return NextResponse.json({ error: "Tenant not found" }, { status: 401 });

    const data = await req.json();
    const { id, ...rest } = data;

    if (!id) return NextResponse.json({ error: "ID do cupom não fornecido" }, { status: 400 });

    const service = new CupomService(tenantId);
    const atualizado = await service.updateCupom(id, rest);
    
    return NextResponse.json({ ...atualizado, desconto: Number(atualizado.desconto) });
  } catch (error: any) {
    console.error("ERRO API CUPONS:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const tenantId = req.headers.get("x-tenant-id");
    if (!tenantId) return NextResponse.json({ error: "Tenant not found" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID missing" }, { status: 400 });

    const service = new CupomService(tenantId);
    await service.deleteCupom(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
