import { NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const payload = await verifyAccessToken(token);

    if (!payload) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    // Busca dados básicos do usuário e seus endereços
    const user = await prisma.usuario.findUnique({
      where: { id_usuario: payload.userId },
      select: {
        id_usuario: true,
        nome: true,
        email: true,
        estabelecimento: true,
        usuario_enderecos: {
          select: {
            endereco: {
              select: {
                id_endereco: true,
                lograduro: true,
                num: true,
                complemento: true,
                bairro: true,
                cidade: true,
                uf: true,
                ponto_referencia: true,
                nome: true,
                latitude: true,
                longitude: true,
                padrao: true
              }
            }
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id_usuario,
        nome: user.nome,
        email: user.email,
        tenantId: user.estabelecimento,
        enderecos: user.usuario_enderecos.map(ue => ({
          ...ue.endereco,
          tipo: ue.endereco.nome // Mapeia nome (Casa/Trabalho) para tipo
        }))
      }
    });
  } catch (error) {
    console.error("Erro em /api/auth/me:", error);
    return NextResponse.json({ authenticated: false, error: "Internal Server Error" }, { status: 500 });
  }
}
