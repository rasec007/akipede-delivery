import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAccessToken } from "@/lib/auth";

// Rotas que não precisam de autenticação
const publicRoutes = ["/api/auth/login", "/api/auth/register", "/api/auth/recovery", "/api/dominios", "/api/estabelecimentos/check-apelido", "/api/public", "/api/catalogo/publico", "/catalogo"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  console.log(`🛡️ MIDDLEWARE: Verificando acesso para: ${pathname}`);

  // 1. Pular validação para rotas públicas
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // 2. Tentar obter o token (Header ou Cookie)
  const authHeader = req.headers.get("authorization");
  let token = authHeader?.split(" ")[1];

  if (!token) {
    token = req.cookies.get("accessToken")?.value;
  }

  // Se não houver token
  if (!token) {
    // Se for uma rota de API, retorna 401
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }
    // Se for uma página, redireciona para o login
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // 3. Verificar o Token
  const payload = await verifyAccessToken(token);

  // Se o token for inválido ou expirado
  if (!payload) {
    const response = pathname.startsWith("/api/") 
      ? NextResponse.json({ error: "Token inválido ou expirado" }, { status: 401 })
      : NextResponse.redirect(new URL("/auth/login", req.url));
    
    // Limpa o cookie se estiver inválido
    if (req.cookies.has("accessToken")) {
      response.cookies.delete("accessToken");
    }
    return response;
  }

  // 4. Injetar informações do tenant no header para o backend
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-user-id", payload.userId);
  requestHeaders.set("x-tenant-id", payload.tenantId);
  requestHeaders.set("x-user-role", payload.role);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    "/api/:path*", 
    "/dashboard", "/dashboard/:path*",
    "/produtos", "/produtos/:path*",
    "/pedidos", "/pedidos/:path*",
    "/usuarios", "/usuarios/:path*",
    "/logistica", "/logistica/:path*",
    "/chat", "/chat/:path*",
    "/settings", "/settings/:path*",
    "/horarios", "/horarios/:path*",
    "/pagamentos", "/pagamentos/:path*",
    "/cupons", "/cupons/:path*"
  ],
};
