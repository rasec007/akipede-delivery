"use client";

import { useEffect } from "react";
import Pusher from "pusher-js";

const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY!;
const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER!;

let pusherInstance: Pusher | null = null;

function getPusher() {
  if (!pusherInstance) {
    pusherInstance = new Pusher(pusherKey, {
      cluster: pusherCluster,
    });
  }
  return pusherInstance;
}

export function useRealtime(channelName: string, eventName: string, callback: (data: any) => void) {
  useEffect(() => {
    if (!channelName || !eventName) return;

    const pusher = getPusher();
    const channel = pusher.subscribe(channelName);
    
    channel.bind(eventName, callback);

    return () => {
      channel.unbind(eventName, callback);
      // Não desconectamos o Pusher aqui para manter a conexão global ativa
      // Apenas desinscrevemos do canal se necessário ou deixamos o singleton gerenciar
      pusher.unsubscribe(channelName);
    };
  }, [channelName, eventName, callback]);
}
