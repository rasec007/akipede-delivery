export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAccessToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyAccessToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const body = await req.json();
    const { 
      lograduro, 
      num, 
      complemento, 
      bairro, 
      cidade, 
      uf, 
      cep, 
      latitude, 
      longitude, 
      tipo, 
      ponto_referencia 
    } = body;

    // 1. Cria o endereço na tabela 'endereco'
    const newEndereco = await prisma.endereco.create({
      data: {
        lograduro,
        num,
        complemento,
        bairro,
        cidade,
        uf,
        cep,
        latitude: latitude ? String(latitude) : null,
        longitude: longitude ? String(longitude) : null,
        nome: tipo || "Casa",
        ponto_referencia,
        padrao: true
      }
    });

    // 2. Vincula ao usuário na tabela 'usuario_enderecos'
    await prisma.usuario_enderecos.create({
      data: {
        usuario_id: payload.userId,
        endereco_id: newEndereco.id_endereco
      }
    });

    return NextResponse.json({
      ...newEndereco,
      tipo: newEndereco.nome
    });
  } catch (error) {
    console.error("Erro ao salvar endereço:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
