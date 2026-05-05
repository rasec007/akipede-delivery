"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBasket, Clock, CheckCircle2, Truck, XCircle, Search, MapPin, Bell } from "lucide-react";
import { toast } from "react-hot-toast";
import { useRealtime } from "@/client/hooks/useRealtime";

// Tipos baseados no Schema
type Order = {
  id_pedido: string;
  num: number;
  status: string;
  valor_votal: number;
  customerName: string;
  address: string;
  paymentMethod: string;
  recebido: string;
};

const statusTabs = [
  { id: "PENDING", label: "Pendentes", icon: Clock, color: "text-yellow-400" },
  { id: "CONFIRMED", label: "Confirmados", icon: CheckCircle2, color: "text-blue-400" },
  { id: "PREPARING", label: "Em Preparo", icon: ShoppingBasket, color: "text-purple-400" },
  { id: "DELIVERING", label: "Em Entrega", icon: Truck, color: "text-orange-400" },
  { id: "COMPLETED", label: "Finalizados", icon: CheckCircle2, color: "text-green-400" },
];

export default function PedidosPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeStatus, setActiveStatus] = useState("PENDING");
  const [loading, setLoading] = useState(true);
  const [tenantId, setTenantId] = useState<string>("");

  // Busca sessão para pegar o tenantId real
  useEffect(() => {
    fetch("/api/auth/me")
      .then(res => res.json())
      .then(data => {
        if (data.user?.tenantId) {
          setTenantId(data.user.tenantId);
        }
      });
  }, []);

  // Escuta atualizações em tempo real
  useRealtime(tenantId ? `orders-${tenantId}` : "", "order_updated", (updatedOrder) => {
    setOrders(prev => Array.isArray(prev) ? prev.map(o => o.id_pedido === updatedOrder.id_pedido ? updatedOrder : o) : []);
  });

  useRealtime(tenantId ? `orders-${tenantId}` : "", "order_new", (newOrder) => {
    setOrders(prev => Array.isArray(prev) ? [newOrder, ...prev] : [newOrder]);
    toast.success("Novo pedido recebido!", { icon: '🔔' });
  });

  useEffect(() => {
    // Busca inicial de pedidos
    fetchOrders();
  }, [activeStatus]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/orders?status=${activeStatus}`);
      const data = await res.json();
      
      if (Array.isArray(data)) {
        setOrders(data);
      } else {
        console.error("Erro na API de pedidos:", data.error);
        setOrders([]);
        if (res.status === 401) router.push("/auth/login");
      }
    } catch (err) {
      console.error("Erro ao buscar pedidos:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white">Gestão de Pedidos</h2>
          <p className="text-[#9CA3AF]">Gerencie e acompanhe as entregas em tempo real.</p>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
          <input 
            type="text" 
            placeholder="Buscar pedido..." 
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>
      </div>

      {/* Tabs de Status */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {statusTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveStatus(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl transition-all whitespace-nowrap border",
              activeStatus === tab.id 
                ? "bg-white/10 border-white/20 text-white" 
                : "bg-transparent border-transparent text-white/40 hover:text-white"
            )}
          >
            <tab.icon className={cn("w-4 h-4", activeStatus === tab.id ? tab.color : "")} />
            <span className="text-sm font-medium">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Lista de Pedidos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {loading ? (
            <p className="text-white/20 col-span-full text-center py-20">Carregando pedidos...</p>
          ) : orders.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-20 glass rounded-3xl border-2 border-dashed border-white/5">
               <ShoppingBasket className="w-12 h-12 text-[#9CA3AF]/20 mb-4" />
               <p className="text-[#9CA3AF]">Nenhum pedido encontrado nesta categoria.</p>
            </div>
          ) : (
            orders.map((order) => (
              <OrderCard key={order.id_pedido} order={order} />
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function OrderCard({ order }: { order: Order }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="glass p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-all flex flex-col gap-4 relative overflow-hidden group"
    >
      <div className="flex justify-between items-start">
        <div>
          <span className="text-xs font-bold text-blue-400 uppercase tracking-tighter">#{order.num}</span>
          <h3 className="text-lg font-bold text-white truncate max-w-[150px]">{order.customerName || "Cliente"}</h3>
        </div>
        <div className="text-right">
          <p className="text-xs text-white/40">Total</p>
          <p className="text-lg font-bold text-green-400">R$ {Number(order.valor_votal || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
      </div>

      <div className="space-y-2 text-sm text-white/60">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-white/20" />
          <span>Recebido às 19:45</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-white/20" />
          <span className="truncate">{order.address || "Balcão / Retirada"}</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-white/5 flex gap-2">
        <button className="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2.5 rounded-xl transition-all">
          Detalhes
        </button>
        <button className="flex-1 bg-white/5 hover:bg-white/10 text-white text-xs font-bold py-2.5 rounded-xl border border-white/10 transition-all">
          Avançar
        </button>
      </div>
    </motion.div>
  );
}

// Utilitário de CSS helper
function cn(...inputs: any[]) {
  const { clsx } = require("clsx");
  const { twMerge } = require("tailwind-merge");
  return twMerge(clsx(inputs));
}
