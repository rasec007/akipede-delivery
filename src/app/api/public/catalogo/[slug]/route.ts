import { NextRequest, NextResponse } from "next/server";
import { PublicCatalogoService } from "@/server/services/PublicCatalogoService";

function serialize(obj: any): any {
  return JSON.parse(JSON.stringify(obj, (_, v) => typeof v === "bigint" ? Number(v) : v));
}

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;
    const { searchParams } = new URL(req.url);
    const tipo = (searchParams.get("tipo") as "delivery" | "mesa") || "delivery";

    const service = new PublicCatalogoService(slug);
    const data = await service.getCatalogo(tipo);

    if (!data) {
      return NextResponse.json({ error: "Estabelecimento não encontrado" }, { status: 404 });
    }

    return NextResponse.json(serialize(data));
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
