import Pusher from "pusher";

export const pusherServer = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.PUSHER_CLUSTER!,
  useTLS: true,
});

/**
 * Dispara um evento em tempo real para um canal específico
 * @param channel Nome do canal (ex: tenant_ID)
 * @param event Nome do evento (ex: order_new)
 * @param data Dados a serem enviados
 */
export async function triggerRealtime(channel: string, event: string, data: any) {
  try {
    await pusherServer.trigger(channel, event, data);
  } catch (error) {
    console.error("Erro ao disparar evento Pusher:", error);
  }
}
