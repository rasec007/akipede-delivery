import { NextRequest, NextResponse } from "next/server";
import { StorageService, StorageFolder } from "@/server/services/StorageService";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 });
    }

    // Converte o arquivo para Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Salva usando o StorageService na pasta de perfis
    const url = await StorageService.uploadFile(buffer, file.type, StorageFolder.PERFIS);

    if (!url) {
      return NextResponse.json({ error: "Erro ao processar upload" }, { status: 500 });
    }

    return NextResponse.json({ url });
  } catch (error: any) {
    console.error("ERRO API UPLOAD:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
