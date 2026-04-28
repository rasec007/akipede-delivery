import axios from "axios";
import nodemailer from "nodemailer";

export class NotificationService {
  private static readonly evoUrl = process.env.EVO_URL!;
  private static readonly evoApiKey = process.env.EVO_APIKEY!;
  
  private static readonly smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
  private static readonly smtpPort = Number(process.env.SMTP_PORT) || 587;
  private static readonly smtpUser = process.env.SMTP_USER!;
  private static readonly smtpPass = process.env.SMTP_PASS!;

  /**
   * Envia uma mensagem de texto via WhatsApp (EvolutionAPI)
   */
  static async sendWhatsApp(phone: string, message: string) {
    if (!this.evoUrl || !this.evoApiKey) {
      console.warn("EvolutionAPI não configurada.");
      return null;
    }

    try {
      // Limpa o número para garantir formato correto
      const cleanPhone = phone.replace(/\D/g, "");
      const formattedPhone = cleanPhone.startsWith("55") ? cleanPhone : `55${cleanPhone}`;

      const response = await axios.post(
        this.evoUrl,
        {
          number: formattedPhone,
          options: {
            delay: 1200,
            presence: "composing",
            linkPreview: false,
          },
          text: message,
        },
        {
          headers: {
            "Content-Type": "application/json",
            apikey: this.evoApiKey,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao enviar WhatsApp via EvolutionAPI:", error);
      return null;
    }
  }

  /**
   * Envia um e-mail via SMTP (Google/Nodemailer)
   */
  static async sendEmail(to: string, subject: string, html: string) {
    if (!this.smtpUser || !this.smtpPass) {
      console.warn("SMTP não configurado.");
      return null;
    }

    try {
      const transporter = nodemailer.createTransport({
        host: this.smtpHost,
        port: this.smtpPort,
        secure: this.smtpPort === 465,
        auth: {
          user: this.smtpUser,
          pass: this.smtpPass,
        },
      });

      const info = await transporter.sendMail({
        from: `"Akipede - Delivery" <${this.smtpUser}>`,
        to,
        subject,
        html,
      });

      return info;
    } catch (error) {
      console.error("Erro ao enviar E-mail:", error);
      return null;
    }
  }

  /**
   * Envia credenciais de boas-vindas (WhatsApp + Email)
   */
  static async sendWelcomeCredentials(nome: string, email: string, senha: string, celular?: string, isEstabelecimento: boolean = true) {
    const subject = "Bem-vindo ao Akipede - Delivery! 🚀";
    
    const textoContexto = isEstabelecimento 
      ? "Seu estabelecimento foi cadastrado com sucesso no <b>Akipede - Delivery</b>."
      : "Seu cadastro de usuário foi realizado com sucesso no <b>Akipede - Delivery</b>.";

    const message = `
      <h1>Olá, ${nome}!</h1>
      <p>${textoContexto}</p>
      <p>Aqui estão suas credenciais de acesso:</p>
      <ul>
        <li><b>URL:</b> dashboard.akipede.com.br</li>
        <li><b>E-mail:</b> ${email}</li>
        <li><b>Senha:</b> ${senha}</li>
      </ul>
      <p>Recomendamos trocar sua senha no primeiro acesso.</p>
      <br/>
      <p>Atenciosamente,<br/>Equipe Akipede</p>
    `;

    // 1. Enviar E-mail
    await this.sendEmail(email, subject, message);

    // 2. Enviar WhatsApp (se disponível)
    if (celular) {
      const contextoWa = isEstabelecimento 
        ? "seu estabelecimento foi cadastrado" 
        : "seu cadastro foi concluído";

      const waMessage = `🚀 *Bem-vindo ao Akipede!*\n\nOlá ${nome}, ${contextoWa} com sucesso.\n\n*Suas Credenciais:*\n📧 Email: ${email}\n🔑 Senha: ${senha}\n\nAcesse: dashboard.akipede.com.br`;
      await this.sendWhatsApp(celular, waMessage);
    }
  }

  /**
   * Alerta de Novo Pedido
   */
  static async notifyNewOrder(phone: string, orderNumber: string, total: string) {
    const message = `🔔 *Novo Pedido no Akipede!*\n\nPedido: #${orderNumber}\nTotal: R$ ${total}\n\nAcesse o painel para gerenciar.`;
    return this.sendWhatsApp(phone, message);
  }
}
