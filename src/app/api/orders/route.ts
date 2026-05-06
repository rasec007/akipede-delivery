export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { OrderService } from "@/server/services/OrderService";
import { getAuthContext } from "@/lib/api-helpers";

export async function GET(req: Request) {
  try {
    const { tenantId } = getAuthContext();
    if (!tenantId) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || undefined;

    const orderService = new OrderService(tenantId);
    const orders = await orderService.listByStatus(status);

    // Mapeia para incluir o status virtual baseado nos timestamps e resolve BigInt
    const mappedOrders = orders.map((order: any) => {
      let virtualStatus = "PENDING";
      if (order.cancelado) virtualStatus = "CANCELLED";
      else if (order.entregue) virtualStatus = "COMPLETED";
      else if (order.saiu_entrega) virtualStatus = "DELIVERING";
      else if (order.preparo) virtualStatus = "PREPARING";
      
      return {
        ...order,
        status: virtualStatus,
        customerName: order.usuario_pedido_usuarioTousuario?.nome || "Cliente",
        address: order.endereco_pedido_enderecoToendereco ? 
          `${order.endereco_pedido_enderecoToendereco.logradouro}, ${order.endereco_pedido_enderecoToendereco.numero}` : 
          "Balcão / Retirada",
        num: order.num ? Number(order.num) : 0 // Converter BigInt para Number para o JSON
      };
    });

    return NextResponse.json(mappedOrders);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
