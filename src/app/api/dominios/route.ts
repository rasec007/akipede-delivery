import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const tipo = searchParams.get("tipo");

    if (!tipo) {
      return NextResponse.json({ error: "O parâmetro 'tipo' é obrigatório" }, { status: 400 });
    }

    const dominios = await prisma.dominio.findMany({
      where: {
        tipo: tipo
      },
      orderBy: {
        nome: 'asc'
      }
    });

    return NextResponse.json(dominios, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Erro ao buscar domínios" },
      { status: 500 }
    );
  }
}
