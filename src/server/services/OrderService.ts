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
}
