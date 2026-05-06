export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { AuthService } from "@/server/services/AuthService";
import { NotificationService } from "@/server/services/NotificationService";
import { createAccessToken, createRefreshToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { nome, email, password, nomeEstabelecimento, celular, cpf_cnpj, apelido, descricao, tipo_categoria, enderecoCompleto, lat, lng, num, complemento, ponto_referencia, logo } = await req.json();

    if (!nome || !email || !password) {
      return NextResponse.json(
        { error: "Todos os campos obrigatórios devem ser preenchidos" },
        { status: 400 }
      );
    }

    const newUser = await AuthService.register({
      nome,
      email,
      celular,
      senhaPlana: password,
      nomeEstabelecimento,
      cpf_cnpj,
      apelido,
      descricao,
      tipo_categoria,
      enderecoCompleto,
      lat,
      lng,
      num,
      complemento,
      ponto_referencia,
      logo
    });

    // Dispara as notificações de boas-vindas (assíncrono para não travar o response)
    const isEstabelecimento = !!nomeEstabelecimento;
    NotificationService.sendWelcomeCredentials(nome, email, password, celular, isEstabelecimento).catch(err => {
      console.error("Erro ao enviar notificações de boas-vindas:", err);
    });

    // AUTO-LOGIN: Gera os tokens imediatamente após o cadastro
    const payload = {
      userId: newUser.id_usuario,
      tenantId: newUser.estabelecimento || "",
      role: newUser.adm ? "ADMIN" : "OPERATOR",
    };

    const accessToken = await createAccessToken(payload);
    const refreshToken = await createRefreshToken(payload);

    return NextResponse.json({ 
      message: "Usuário cadastrado com sucesso",
      userId: newUser.id_usuario,
      accessToken,
      refreshToken
    }, { status: 201 });
    
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: "Este e-mail já está cadastrado" }, { status: 409 });
    }
    return NextResponse.json(
      { error: error.message || "Erro interno no servidor" },
      { status: 500 }
    );
  }
}
