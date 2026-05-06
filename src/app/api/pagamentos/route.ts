export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
import { PagamentoService } from "@/server/services/PagamentoService";

export async function GET(req: NextRequest) {
  try {
    const tenantId = req.headers.get("x-tenant-id");
    if (!tenantId) return NextResponse.json({ error: "Tenant not found" }, { status: 401 });

    const service = new PagamentoService(tenantId);
    const formas = await service.getFormasPagamento();
    return NextResponse.json(formas);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const tenantId = req.headers.get("x-tenant-id");
    if (!tenantId) return NextResponse.json({ error: "Tenant not found" }, { status: 401 });

    const { idDominio } = await req.json();
    const service = new PagamentoService(tenantId);
    const nova = await service.addFormaPagamento(idDominio);
    return NextResponse.json(nova);
  } catch (error: any) {
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

    const service = new PagamentoService(tenantId);
    await service.removeFormaPagamento(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
