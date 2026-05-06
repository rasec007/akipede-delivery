export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const apelido = searchParams.get("apelido");

    if (!apelido) {
      return NextResponse.json({ error: "Parâmetro apelido obrigatório" }, { status: 400 });
    }

    const existe = await prisma.estabelecimento.findFirst({
      where: { apelido: apelido },
      select: { id_estabelecimento: true }
    });

    return NextResponse.json({ available: !existe });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Erro interno ao verificar apelido" },
      { status: 500 }
    );
  }
}
