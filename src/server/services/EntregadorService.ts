import { prisma } from "@/lib/prisma";
import { NotificationService } from "./NotificationService";

export class EntregadorService {
  private tenantId: string;

  constructor(tenantId: string) {
    this.tenantId = tenantId;
  }

  async getEntregadores() {
    // Busca o ID do perfil "Entregador" no domínio
    const perfilEntregador = await prisma.dominio.findFirst({
      where: { tipo: "Perfil", nome: "Entregador" }
    });

    if (!perfilEntregador) return [];

    return await prisma.usuario.findMany({
      where: { 
        estabelecimento: this.tenantId,
        perfil: perfilEntregador.id_dominio
      },
      orderBy: { nome: "asc" }
    });
  }

  async createEntregador(data: {
    nome: string;
    cpf_cnpj?: string;
    celular?: string;
    email?: string;
    apelido?: string;
    senha?: string;
  }) {
    // Busca o ID do perfil "Entregador"
    const perfilEntregador = await prisma.dominio.findFirst({
      where: { tipo: "Perfil", nome: "Entregador" }
    });

    if (!perfilEntregador) throw new Error("Perfil Entregador não encontrado no sistema.");

    const entregador = await prisma.usuario.create({
      data: {
        nome: data.nome,
        cpf_cnpj: data.cpf_cnpj,
        celular: data.celular,
        email: data.email,
        apelido: data.apelido,
        senha: data.senha,
        estabelecimento: this.tenantId,
        perfil: perfilEntregador.id_dominio
      }
    });

    // Enviar credenciais se houver email e senha
    if (entregador.email && data.senha) {
      try {
        await NotificationService.sendWelcomeCredentials(
          entregador.nome || "",
          entregador.email,
          data.senha,
          entregador.celular || undefined,
          false // isEstabelecimento = false
        );
      } catch (err) {
        console.error("Erro ao enviar notificações para o entregador:", err);
      }
    }

    return entregador;
  }

  async updateEntregador(id: string, data: {
    nome: string;
    cpf_cnpj?: string;
    celular?: string;
    email?: string;
    apelido?: string;
    senha?: string;
    foto?: string;
  }) {
    return await prisma.usuario.update({
      where: { id_usuario: id, estabelecimento: this.tenantId },
      data: {
        nome: data.nome,
        cpf_cnpj: data.cpf_cnpj,
        celular: data.celular,
        email: data.email,
        apelido: data.apelido,
        senha: data.senha || undefined,
        foto: data.foto
      }
    });
  }

  async deleteEntregador(id: string) {
    return await prisma.usuario.delete({
      where: { id_usuario: id, estabelecimento: this.tenantId }
    });
  }
}
