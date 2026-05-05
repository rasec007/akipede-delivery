"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronLeft, ShoppingBasket, ClipboardCheck, Clock, Check, AlertCircle, Loader2, ChevronRight } from "lucide-react";

export default function MyOrdersPage() {
  const { apelido } = useParams();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`/api/pedidos?apelido=${apelido}`);
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } catch (e) {
        console.error("Erro ao carregar pedidos:", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [apelido]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#f45145] animate-spin mb-4" />
        <p className="text-gray-500 font-medium italic">Carregando seus pedidos...</p>
      </div>
    );
  }

  const getStatusInfo = (order: any) => {
    if (order.cancelado) return { label: 'Cancelado', color: 'text-red-500', bg: 'bg-red-50', icon: AlertCircle };
    if (order.entregue) return { label: 'Entregue', color: 'text-green-500', bg: 'bg-green-50', icon: Check };
    if (order.saiu_entrega) return { label: 'Em Rota', color: 'text-blue-500', bg: 'bg-blue-50', icon: Clock };
    if (order.preparo) return { label: 'Preparando', color: 'text-orange-500', bg: 'bg-orange-50', icon: Clock };
    return { label: 'Recebido', color: 'text-[#f45145]', bg: 'bg-[#f45145]/5', icon: ShoppingBasket };
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white p-6 sticky top-0 z-40 border-b border-gray-100 flex items-center gap-4">
        <button 
          onClick={() => router.push(`/catalogo/delivery/${apelido}`)}
          className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-800 transition-all"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-sm font-black text-gray-800 uppercase tracking-tight">Meus Pedidos</h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Histórico em {apelido}</p>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-4 space-y-4">
        {orders.length > 0 ? (
          orders.map((order) => {
            const status = getStatusInfo(order);
            return (
              <motion.div 
                key={order.id_pedido}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => router.push(`/catalogo/delivery/${apelido}/pedido/${order.id_pedido}`)}
                className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 flex items-center justify-between group cursor-pointer hover:shadow-lg transition-all active:scale-[0.98]"
              >
                <div className="flex items-center gap-5">
                  <div className={`w-14 h-14 ${status.bg} rounded-2xl flex items-center justify-center ${status.color}`}>
                    <status.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                       <h4 className="font-black text-gray-800 uppercase tracking-tight text-sm">Pedido #{order.num || order.id_pedido.slice(-6).toUpperCase()}</h4>
                       <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${status.bg} ${status.color}`}>
                          {status.label}
                       </span>
                    </div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">
                      {new Date(order.recebido || order.pago || new Date()).toLocaleDateString('pt-BR')} • {parseFloat(order.valor_votal || "0").toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </p>
                  </div>
                </div>
                <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 group-hover:text-[#f45145] group-hover:bg-[#f45145]/5 transition-all">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="py-20 text-center space-y-4">
            <div className="w-20 h-20 bg-gray-100 rounded-[32px] flex items-center justify-center mx-auto text-gray-300">
               <ShoppingBasket className="w-10 h-10" />
            </div>
            <div>
               <h3 className="text-lg font-black text-gray-800 uppercase">Nenhum pedido ainda</h3>
               <p className="text-xs text-gray-400 px-10">Você ainda não realizou pedidos neste estabelecimento.</p>
            </div>
            <button 
              onClick={() => router.push(`/catalogo/delivery/${apelido}`)}
              className="bg-[#f45145] text-white px-8 py-4 rounded-2xl font-black uppercase tracking-tight shadow-lg shadow-[#f45145]/30"
            >
              Começar a Comprar
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
