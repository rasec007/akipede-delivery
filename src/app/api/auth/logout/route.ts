export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Logout realizado com sucesso" });

  // Apaga os cookies enviando-os com data de expiração no passado
  response.cookies.set("accessToken", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });

  response.cookies.set("refreshToken", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });

  return response;
}
