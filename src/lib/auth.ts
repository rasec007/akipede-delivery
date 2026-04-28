import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);
const JWT_REFRESH_SECRET = new TextEncoder().encode(process.env.JWT_REFRESH_SECRET);

export type TokenPayload = {
  userId: string;
  tenantId: string;
  role: string;
};

/**
 * Gera um Access Token (curta duração)
 */
export async function createAccessToken(payload: TokenPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("15m") // 15 minutos
    .sign(JWT_SECRET);
}

/**
 * Gera um Refresh Token (longa duração)
 */
export async function createRefreshToken(payload: TokenPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d") // 7 dias
    .sign(JWT_REFRESH_SECRET);
}

/**
 * Verifica um Access Token
 */
export async function verifyAccessToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as TokenPayload;
  } catch (error) {
    return null;
  }
}

/**
 * Verifica um Refresh Token
 */
export async function verifyRefreshToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_REFRESH_SECRET);
    return payload as TokenPayload;
  } catch (error) {
    return null;
  }
}
