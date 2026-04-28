import { prisma } from "@/lib/prisma";
import { createAccessToken, createRefreshToken } from "@/lib/auth";
import bcrypt from "bcrypt";
import { StorageService, StorageFolder } from "./StorageService";

export class AuthService {
  /**
   * Realiza o login do usuário
   */
  static async login(email: string, senhaPlana: string) {
    const user = await prisma.usuario.findUnique({
      where: { email },
      include: { estabelecimento_usuario_estabelecimentoToestabelecimento: true }
    });

    if (!user || !user.senha) {
      throw new Error("Credenciais inválidas");
    }

    const passwordMatch = await bcrypt.compare(senhaPlana, user.senha);
    if (!passwordMatch) {
      throw new Error("Credenciais inválidas");
    }

    const payload = {
      userId: user.id_usuario,
      tenantId: user.estabelecimento || "",
      role: user.adm ? "ADMIN" : "OPERATOR",
    };

    const accessToken = await createAccessToken(payload);
    const refreshToken = await createRefreshToken(payload);

    return {
      user: {
        id: user.id_usuario,
        name: user.nome,
        email: user.email,
        role: payload.role,
        tenantId: payload.tenantId,
      },
      accessToken,
      refreshToken,
    };
  }

  /**
   * Registra um novo usuário (e opcionalmente um estabelecimento)
   */
  static async register(data: {
    nome: string;
    email: string;
    celular?: string;
    senhaPlana: string;
    nomeEstabelecimento?: string;
    cpf_cnpj?: string;
    apelido?: string;
    descricao?: string;
    tipo_categoria?: string;
    enderecoCompleto?: string;
    lat?: string;
    lng?: string;
    num?: string;
    complemento?: string;
    ponto_referencia?: string;
    logo?: string;
  }) {
    const hashedParams = await bcrypt.hash(data.senhaPlana, 10);

    // Se tiver nome do estabelecimento, cria ele primeiro
    let establishmentId = null;
    let finalLogoUrl = data.logo;

    if (data.logo && data.logo.startsWith("data:")) {
      const url = await StorageService.uploadBase64(data.logo, StorageFolder.LOGOS);
      if (url) finalLogoUrl = url;
    }

    if (data.nomeEstabelecimento) {
      const newEstab = await prisma.estabelecimento.create({
        data: {
          razao_social: data.nomeEstabelecimento,
          email: data.email,
          celular: data.celular,
          cpf_cnpj: data.cpf_cnpj,
          apelido: data.apelido,
          descricao: data.descricao,
          tipo_categoria: data.tipo_categoria,
          logo: finalLogoUrl
        }
      });
      establishmentId = newEstab.id_estabelecimento;

      // Se houver endereço fornecido, salva na tabela endereco vinculando ao estabelecimento
      if (data.enderecoCompleto) {
        await prisma.endereco.create({
          data: {
            lograduro: data.enderecoCompleto,
            latitude: data.lat,
            longitude: data.lng,
            vinculo: establishmentId,
            num: data.num,
            complemento: data.complemento,
            ponto_referencia: data.ponto_referencia,
            padrao: true
          }
        });
      }
    }

    const newUser = await prisma.usuario.create({
      data: {
        nome: data.nome,
        email: data.email,
        celular: data.celular,
        cpf_cnpj: data.cpf_cnpj,
        apelido: data.apelido,
        senha: hashedParams,
        estabelecimento: establishmentId,
        adm: true,
      }
    });

    // VINCULO CRITICO: Atualiza o estabelecimento para definir o usuário como responsável
    if (establishmentId) {
      await prisma.estabelecimento.update({
        where: { id_estabelecimento: establishmentId },
        data: { responsavel: newUser.id_usuario }
      });
    }

    return newUser;
  }
}
