"use client";

import React, { useState, useEffect } from "react";
import { ShoppingBag, TrendingUp, Users, DollarSign, Clock, AlertCircle } from "lucide-react";

const stats = [
  { name: "Pedidos Hoje", value: "24", icon: ShoppingBag, color: "text-blue-400" },
  { name: "Vendas Brutas", value: "R$ 1.250,00", icon: DollarSign, color: "text-green-400" },
  { name: "Novos Clientes", value: "8", icon: Users, color: "text-purple-400" },
  { name: "Ticket Médio", value: "R$ 52,00", icon: TrendingUp, color: "text-orange-400" },
];

export default function DashboardPage() {
  const [status, setStatus] = useState<{ aberto: boolean; mensagem: string } | null>(null);

  useEffect(() => {
    fetch("/api/horarios/status")
      .then(res => res.json())
      .then(data => setStatus(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white">Bem-vindo ao Akipede</h2>
          <p className="text-white/40 mt-1">Aqui está o resumo do seu estabelecimento hoje.</p>
        </div>

        {status && (
          <div className={`flex items-center gap-3 px-4 py-2 rounded-2xl border transition-all ${
            status.aberto 
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
              : "bg-red-500/10 border-red-500/20 text-red-400"
          }`}>
            <div className={`w-2 h-2 rounded-full animate-pulse ${status.aberto ? "bg-emerald-400" : "bg-red-400"}`} />
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase tracking-wider">
                Status: {status.aberto ? "Aberto" : "Fechado"}
              </span>
              <span className="text-[10px] opacity-70 leading-none">{status.mensagem}</span>
            </div>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="glass p-6 rounded-2xl hover:bg-white/10 transition-all border border-white/5">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded-full">+12%</span>
            </div>
            <p className="text-white/40 text-sm font-medium">{stat.name}</p>
            <h3 className="text-2xl font-bold text-white mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Placeholder para Gráficos/Listas Recentes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass rounded-2xl p-6 min-h-[300px]">
          <h3 className="text-lg font-bold text-white mb-4">Pedidos Recentes</h3>
          <div className="text-white/20 flex flex-col items-center justify-center h-full border-2 border-dashed border-white/5 rounded-xl">
             Nenhum pedido recente.
          </div>
        </div>
        <div className="glass rounded-2xl p-6 min-h-[300px]">
          <h3 className="text-lg font-bold text-white mb-4">Top Produtos</h3>
          <div className="text-white/20 flex flex-col items-center justify-center h-full border-2 border-dashed border-white/5 rounded-xl">
             Sem dados disponíveis.
          </div>
        </div>
      </div>
    </div>
  );
}
