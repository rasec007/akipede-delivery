import { prisma } from "@/lib/prisma";
import { NotificationService } from "./NotificationService";

export class ClienteService {
  private tenantId: string;

  constructor(tenantId: string) {
    this.tenantId = tenantId;
  }

  async getClientes() {
    // Busca o ID do perfil "Cliente" no domínio
    const perfilCliente = await prisma.dominio.findFirst({
      where: { tipo: "Perfil", nome: "Cliente" }
    });

    if (!perfilCliente) return [];

    return await prisma.usuario.findMany({
      where: { 
        estabelecimento: this.tenantId,
        perfil: perfilCliente.id_dominio
      },
      orderBy: { nome: "asc" }
    });
  }

  async createCliente(data: {
    nome: string;
    cpf_cnpj?: string;
    celular?: string;
    email?: string;
    apelido?: string;
    senha?: string;
    foto?: string;
  }) {
    // Busca o ID do perfil "Cliente"
    const perfilCliente = await prisma.dominio.findFirst({
      where: { tipo: "Perfil", nome: "Cliente" }
    });

    if (!perfilCliente) throw new Error("Perfil Cliente não encontrado no sistema.");

    const cliente = await prisma.usuario.create({
      data: {
        nome: data.nome,
        cpf_cnpj: data.cpf_cnpj,
        celular: data.celular,
        email: data.email,
        apelido: data.apelido,
        senha: data.senha,
        foto: data.foto,
        estabelecimento: this.tenantId,
        perfil: perfilCliente.id_dominio
      }
    });

    // Enviar credenciais se houver email e senha
    if (cliente.email && data.senha) {
      try {
        await NotificationService.sendWelcomeCredentials(
          cliente.nome || "",
          cliente.email,
          data.senha,
          cliente.celular || undefined,
          false // isEstabelecimento = false
        );
      } catch (err) {
        console.error("Erro ao enviar notificações para o cliente:", err);
      }
    }

    return cliente;
  }

  async updateCliente(id: string, data: {
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

  async deleteCliente(id: string) {
    return await prisma.usuario.delete({
      where: { id_usuario: id, estabelecimento: this.tenantId }
    });
  }
}
