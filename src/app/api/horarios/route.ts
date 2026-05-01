import { NextRequest, NextResponse } from "next/server";
import { HorarioService } from "@/server/services/HorarioService";
import { getAuthContext } from "@/lib/api-helpers";

function serialize(obj: any): any {
  return JSON.parse(JSON.stringify(obj, (_, v) => typeof v === "bigint" ? Number(v) : v));
}

// GET - Lista horários do estabelecimento
export async function GET() {
  try {
    const { tenantId } = getAuthContext();
    if (!tenantId) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const service = new HorarioService(tenantId);
    const horarios = await service.listHorarios();
    return NextResponse.json(serialize(horarios));
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - Cria um novo horário
export async function POST(req: NextRequest) {
  try {
    const { tenantId } = getAuthContext();
    if (!tenantId) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const body = await req.json();
    const { diaSemana, horaAbre, horaFecha } = body;

    if (!diaSemana || !horaAbre || !horaFecha) {
      return NextResponse.json({ error: "Dia da semana, horário de abertura e fechamento são obrigatórios" }, { status: 400 });
    }

    const service = new HorarioService(tenantId);
    const horario = await service.createHorario({ diaSemana, horaAbre, horaFecha });
    return NextResponse.json(serialize(horario), { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT - Atualiza um horário
export async function PUT(req: NextRequest) {
  try {
    const { tenantId } = getAuthContext();
    if (!tenantId) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const body = await req.json();
    console.log("📥 API HORARIOS - RECEBIDO PARA UPDATE:", body);
    
    const { id, diaSemana, horaAbre, horaFecha } = body;

    if (!id) {
      console.error("❌ ERRO: ID do horário não fornecido.");
      return NextResponse.json({ error: "ID obrigatório" }, { status: 400 });
    }

    const service = new HorarioService(tenantId);
    const horario = await service.updateHorario(id, { diaSemana, horaAbre, horaFecha });
    
    console.log("✅ API HORARIOS - UPDATE SUCESSO");
    return NextResponse.json(serialize(horario));
  } catch (error: any) {
    console.error("🔥 ERRO CRÍTICO NO PUT /api/horarios:", error);
    return NextResponse.json({ 
      error: "Erro ao atualizar horário", 
      details: error.message 
    }, { status: 500 });
  }
}

// DELETE - Remove um horário
export async function DELETE(req: NextRequest) {
  try {
    const { tenantId } = getAuthContext();
    if (!tenantId) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID obrigatório" }, { status: 400 });

    const service = new HorarioService(tenantId);
    const result = await service.deleteHorario(id);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
