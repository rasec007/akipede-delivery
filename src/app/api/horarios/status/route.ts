import { NextResponse } from "next/server";
import { HorarioService } from "@/server/services/HorarioService";
import { getAuthContext } from "@/lib/api-helpers";

// GET - Verifica se o estabelecimento está aberto agora
export async function GET() {
  try {
    const { tenantId } = getAuthContext();
    if (!tenantId) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const service = new HorarioService(tenantId);
    const status = await service.checkAberto();
    return NextResponse.json(status);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
