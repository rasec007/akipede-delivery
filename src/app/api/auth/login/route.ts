import { NextResponse } from "next/server";
import { AuthService } from "@/server/services/AuthService";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email e senha são obrigatórios" },
        { status: 400 }
      );
    }

    const { accessToken, refreshToken, user } = await AuthService.login(email, password);

    // Configura o Refresh Token em um Cookie HttpOnly para segurança (Anti-XSS)
    const response = NextResponse.json({ 
      accessToken, 
      user: { nome: user.name, email: user.email } 
    });

    // Salva o Refresh Token em um cookie seguro
    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 dias
    });

    // Salva o Access Token em um cookie (para o Middleware)
    response.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60, // 15 minutos
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Erro interno no servidor" },
      { status: 401 }
    );
  }
}
