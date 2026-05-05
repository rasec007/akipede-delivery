import { BaseService } from "./BaseService";
import { triggerRealtime } from "@/lib/pusher";
import { NotificationService } from "./NotificationService";

export class OrderService extends BaseService {
  /**
   * Lista pedidos do estabelecimento com filtros de status mapeados para colunas de data
   */
  async listByStatus(status?: string) {
    let statusFilter: any = {};
    
    if (status === "PENDING") {
      // Recebido mas ainda não em preparo
      statusFilter = { recebido: { not: null }, preparo: null, cancelado: null };
    } else if (status === "PREPARING") {
      // Em preparo mas ainda não saiu para entrega
      statusFilter = { preparo: { not: null }, saiu_entrega: null, cancelado: null };
    } else if (status === "DELIVERING") {
      // Saiu para entrega mas ainda não foi entregue
      statusFilter = { saiu_entrega: { not: null }, entregue: null, cancelado: null };
    } else if (status === "COMPLETED") {
      // Já foi entregue
      statusFilter = { entregue: { not: null } };
    } else if (status === "CANCELLED") {
      // Pedido cancelado
      statusFilter = { cancelado: { not: null } };
    }

    return await this.db.pedido.findMany({
      where: {
        estabelecimento: this.tenantId,
        ...statusFilter,
      },
      include: {
        endereco_pedido_enderecoToendereco: true,
        usuario_pedido_usuarioTousuario: true,
      },
      orderBy: { recebido: "desc" },
    });
  }

  /**
   * Atualiza o status de um pedido marcando a respectiva coluna de data
   */
  async updateStatus(orderId: string, newStatus: string) {
    const dataUpdate: any = {};
    let message = "";

    switch (newStatus) {
      case "PREPARING":
        dataUpdate.preparo = new Date();
        message = "Seu pedido está sendo preparado!";
        break;
      case "DELIVERING":
        dataUpdate.saiu_entrega = new Date();
        message = "Seu pedido saiu para entrega!";
        break;
      case "COMPLETED":
        dataUpdate.entregue = new Date();
        message = "Seu pedido foi entregue! Bom apetite.";
        break;
      case "CANCELLED":
        dataUpdate.cancelado = new Date();
        message = "Seu pedido foi cancelado.";
        break;
    }

    const order = await this.db.pedido.update({
      where: { 
        id_pedido: orderId,
        estabelecimento: this.tenantId 
      },
      data: dataUpdate,
      include: { usuario_pedido_usuarioTousuario: true }
    });

    // 1. Notifica via Pusher (para o painel administrativo)
    await triggerRealtime(this.tenantId, "order_updated", { ...order, status: newStatus });

    // 2. Notifica via WhatsApp
    if (order.usuario_pedido_usuarioTousuario?.celular && message) {
      await NotificationService.sendWhatsApp(
        order.usuario_pedido_usuarioTousuario.celular, 
        message
      );
    }

    return order;
  }

  /**
   * Gera um número de pedido no formato AAAAMMDD + sequencial (Ex: 20260503001)
   */
  async generateOrderNumber() {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const datePart = `${yyyy}${mm}${dd}`;

    // Busca o último pedido do dia para este estabelecimento
    // Precisamos de um filtro que cubra o dia inteiro (UTC ou local, aqui usamos o início do dia)
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const lastOrder = await this.db.pedido.findFirst({
      where: {
        estabelecimento: this.tenantId,
        recebido: {
          gte: startOfDay,
          lte: endOfDay
        }
      },
      orderBy: { num: "desc" }
    });

    let nextSeq = 1;
    if (lastOrder && lastOrder.num) {
      const lastNumStr = lastOrder.num.toString();
      // Se o número começar com a data de hoje, extraímos o sequencial final
      if (lastNumStr.startsWith(datePart)) {
        const seqStr = lastNumStr.slice(8);
        nextSeq = parseInt(seqStr) + 1;
      }
    }

    // Formata o sequencial com no mínimo 3 dígitos (001, 002...)
    // Se ultrapassar 999, ele naturalmente cresce (1000, 1001...)
    const sequentialPart = String(nextSeq).padStart(3, '0');
    
    return BigInt(`${datePart}${sequentialPart}`);
  }
}
