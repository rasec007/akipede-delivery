"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, ShoppingBasket, Truck, Check, Clock, ChevronLeft, Store, Info, Phone, AlertCircle, Loader2, ClipboardCheck, QrCode, Banknote, CreditCard } from "lucide-react";
import { useRealtime } from "@/client/hooks/useRealtime";

export default function OrderTrackingPage() {
  const { apelido, id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/pedidos/${id}`);
      if (res.ok) {
        const data = await res.json();
        setOrder(data);
      }
    } catch (e) {
      console.error("Erro ao carregar pedido:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  // Atualização em tempo real do status do pedido
  useRealtime(`order-${id}`, "order-updated", fetchOrder);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#f45145] animate-spin mb-4" />
        <p className="text-gray-500 font-medium italic">Localizando seu pedido...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8 text-center">
        <AlertCircle className="w-16 h-16 text-gray-300 mb-4" />
        <h2 className="text-xl font-black text-gray-800 uppercase">Pedido não encontrado</h2>
        <p className="text-sm text-gray-500 mt-2">Não conseguimos localizar os detalhes deste pedido.</p>
        <button 
          onClick={() => router.push(`/catalogo/delivery/${apelido}`)}
          className="mt-8 bg-[#f45145] text-white px-8 py-4 rounded-2xl font-black uppercase tracking-tight shadow-lg"
        >
          Voltar para a Loja
        </button>
      </div>
    );
  }

  // Lógica de status
  const getStatus = () => {
    if (order.cancelado) return { label: 'Cancelado', color: 'bg-red-500', icon: AlertCircle, step: 0 };
    if (order.entregue) return { label: 'Entregue', color: 'bg-green-500', icon: Check, step: 4 };
    if (order.saiu_entrega) return { label: 'Saiu para Entrega', color: 'bg-blue-500', icon: Truck, step: 3 };
    if (order.preparo) return { label: 'Em Preparo', color: 'bg-orange-500', icon: Clock, step: 2 };
    return { label: 'Recebido', color: 'bg-[#f45145]', icon: ShoppingBasket, step: 1 };
  };

  const status = getStatus();

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header Premium */}
      <header className="bg-white p-6 sticky top-0 z-40 border-b border-gray-100 flex items-center gap-4">
        <button 
          onClick={() => router.push(`/catalogo/delivery/${apelido}`)}
          className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-800 transition-all"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-sm font-black text-gray-800 uppercase tracking-tight">Acompanhar Pedido</h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">#{order.num || id?.toString().slice(-8).toUpperCase()}</p>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-4 space-y-6">
        {/* Card de Status Principal (Figura 36 Inspirado) */}
        <div className="bg-white rounded-[40px] p-10 shadow-xl shadow-gray-200/50 border border-gray-50 text-center space-y-8">
           <div className="relative">
              <div className={`w-24 h-24 ${status.color} rounded-[32px] flex items-center justify-center mx-auto text-white shadow-2xl ${status.step < 4 && !order.cancelado ? 'animate-pulse' : ''}`}>
                 <status.icon className="w-10 h-10" />
              </div>
              <div className="mt-6 space-y-1">
                 <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">{status.label}</h2>
                 <p className="text-xs text-gray-400 font-medium">Última atualização: {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
           </div>

           {/* Progress Bar */}
           <div className="relative pt-4">
              <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 rounded-full overflow-hidden">
                 <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: `${(status.step / 4) * 100}%` }}
                   className={`h-full ${status.color} transition-all duration-1000`}
                 />
              </div>
              <div className="relative flex justify-between">
                 {[1, 2, 3, 4].map((s) => (
                    <div key={s} className={`w-8 h-8 rounded-full border-4 border-white flex items-center justify-center text-xs font-black transition-all ${status.step >= s ? status.color + ' text-white scale-110 shadow-lg' : 'bg-gray-100 text-gray-300'}`}>
                       {status.step > s ? <Check className="w-4 h-4" /> : s}
                    </div>
                 ))}
              </div>
              <div className="flex justify-between mt-2 px-1">
                 <span className="text-[8px] font-black text-gray-400 uppercase">Recebido</span>
                 <span className="text-[8px] font-black text-gray-400 uppercase">Preparo</span>
                 <span className="text-[8px] font-black text-gray-400 uppercase">Rota</span>
                 <span className="text-[8px] font-black text-gray-400 uppercase">Entregue</span>
              </div>
           </div>
        </div>

        {/* Detalhes da Entrega */}
        <div className="bg-white rounded-[32px] p-8 shadow-lg shadow-gray-200/40 border border-gray-50 space-y-6">
           <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-[#f45145]" />
              <h3 className="text-xs font-black text-gray-800 uppercase tracking-tight">Onde Entregar</h3>
           </div>
           <div className="bg-gray-50 rounded-2xl p-6">
              <p className="font-black text-gray-800 text-sm uppercase">{order.endereco_pedido_enderecoToendereco?.lograduro}, {order.endereco_pedido_enderecoToendereco?.num}</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">
                {order.endereco_pedido_enderecoToendereco?.bairro} - {order.endereco_pedido_enderecoToendereco?.cidade}/{order.endereco_pedido_enderecoToendereco?.uf}
              </p>
              {order.endereco_pedido_enderecoToendereco?.ponto_referencia && (
                <p className="text-[10px] text-[#f45145] font-medium italic mt-2">Ref: {order.endereco_pedido_enderecoToendereco.ponto_referencia}</p>
              )}
           </div>
        </div>
        
        {/* Itens do Pedido */}
        <div className="bg-white rounded-[32px] p-8 shadow-lg shadow-gray-200/40 border border-gray-50 space-y-6">
           <div className="flex items-center gap-3">
              <ClipboardCheck className="w-5 h-5 text-[#f45145]" />
              <h3 className="text-xs font-black text-gray-800 uppercase tracking-tight">O que você pediu</h3>
           </div>
           <div className="space-y-4">
              {order.lista_carrinho_produto_lista_carrinho_produto_pedidoTopedido?.map((link: any, idx: number) => {
                 const item = link.carrinho_produto_lista_carrinho_produto_carrinho_produtoTocarrinho_produto;
                 if (!item) return null;
                 return (
                    <div key={idx} className="flex justify-between items-start gap-3 pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                       <div className="flex items-start gap-3">
                          <div className="min-w-[24px] h-5 px-1 bg-gray-100 rounded flex items-center justify-center font-black text-[#f45145] text-[10px] shrink-0">
                             {item.quantidade}x
                          </div>
                          <div>
                             <p className="text-sm font-black text-gray-800 uppercase leading-5">{item.produto_carrinho_produto_produtoToproduto?.nome}</p>
                             {item.carrinho_complemento_carrinho_complemento_carrinho_produtoTocarrinho_produto?.map((c: any, cIdx: number) => (
                                <p key={cIdx} className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">
                                   + {c.complemento_item_carrinho_complemento_complemento_itemTocomplemento_item?.nome}
                                </p>
                             ))}
                             {item.obs && (
                                <p className="text-[10px] text-[#f45145] font-bold italic mt-1">Obs: {item.obs}</p>
                             )}
                          </div>
                       </div>
                       <p className="text-sm font-black text-gray-800 whitespace-nowrap leading-5">
                          {parseFloat(item.valor_total || "0").toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                       </p>
                    </div>
                 );
              })}
           </div>
        </div>

        {/* Resumo Financeiro */}
        <div className="bg-white rounded-[32px] p-8 shadow-lg shadow-gray-200/40 border border-gray-50 space-y-6">
           <div className="flex items-center gap-3">
              <ShoppingBasket className="w-5 h-5 text-[#f45145]" />
              <h3 className="text-xs font-black text-gray-800 uppercase tracking-tight">Resumo Financeiro</h3>
           </div>
           <div className="space-y-3">
              <div className="flex justify-between text-xs text-gray-400 font-bold uppercase">
                 <span>Subtotal</span>
                 <span>{parseFloat(order.valor_produto || "0").toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-400 font-bold uppercase">
                 <span>Taxa de Entrega</span>
                 <span>{parseFloat(order.taxa_entrega || "0") === 0 ? 'Grátis' : parseFloat(order.taxa_entrega || "0").toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-gray-50">
                 <span className="text-sm font-black text-gray-800 uppercase">Total Pago</span>
                 <span className="text-xl font-black text-[#f45145]">{parseFloat(order.valor_votal || "0").toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
              </div>
              <div className="pt-2">
                 <div className="bg-gray-50 p-3 rounded-xl flex items-center justify-between">
                    <span className="text-[10px] font-black text-gray-400 uppercase">Forma de Pagamento</span>
                    <span className="text-[10px] font-black text-gray-800 uppercase">{order.dominio_pedido_forma_pagamentoTodominio?.nome}</span>
                 </div>
              </div>

              {/* Dados do PIX se for o caso */}
              {order.dominio_pedido_forma_pagamentoTodominio?.nome?.toLowerCase().includes('pix') && (
                <div className="mt-4 p-6 bg-[#f45145]/5 rounded-3xl border border-[#f45145]/10 space-y-4">
                   <div className="flex items-center gap-3">
                      <QrCode className="w-5 h-5 text-[#f45145]" />
                      <p className="text-[10px] font-black text-[#f45145] uppercase tracking-widest">Pague via PIX</p>
                   </div>
                   <div className="space-y-1">
                      <p className="text-[10px] text-gray-400 font-bold uppercase leading-none">Chave PIX</p>
                      <p className="text-sm font-black text-gray-800 break-all select-all">{order.estabelecimento_pedido_estabelecimentoToestabelecimento?.pix_chave || 'Chave não cadastrada'}</p>
                   </div>
                   <div className="space-y-1">
                      <p className="text-[10px] text-gray-400 font-bold uppercase leading-none">Favorecido</p>
                      <p className="text-xs font-bold text-gray-600 uppercase tracking-tight">{order.estabelecimento_pedido_estabelecimentoToestabelecimento?.pix_nome || 'Estabelecimento'}</p>
                   </div>
                   <p className="text-[9px] text-gray-400 font-medium italic">* Após realizar o pagamento, você pode enviar o comprovante pelo WhatsApp do estabelecimento abaixo.</p>
                </div>
              )}
           </div>
        </div>

        {/* Ações de Navegação */}
        <div className="grid grid-cols-2 gap-4">
           <button 
             onClick={() => router.push(`/catalogo/delivery/${apelido}`)}
             className="bg-white border-2 border-gray-100 text-gray-800 py-6 rounded-[24px] shadow-lg flex flex-col items-center justify-center gap-2 hover:border-[#f45145]/20 hover:bg-gray-50 transition-all active:scale-95 group"
           >
              <ShoppingBasket className="w-6 h-6 text-[#f45145]" />
              <span className="text-[10px] font-black uppercase tracking-widest">Novo Pedido</span>
           </button>
           
           <button 
             onClick={() => router.push(`/catalogo/delivery/${apelido}/pedido`)}
             className="bg-white border-2 border-gray-100 text-gray-800 py-6 rounded-[24px] shadow-lg flex flex-col items-center justify-center gap-2 hover:border-[#f45145]/20 hover:bg-gray-50 transition-all active:scale-95 group"
           >
              <ClipboardCheck className="w-6 h-6 text-[#f45145]" />
              <span className="text-[10px] font-black uppercase tracking-widest">Meus Pedidos</span>
           </button>
        </div>

        {/* Precisa de Ajuda? */}
        <button 
          onClick={() => window.open(`https://wa.me/${order.estabelecimento_pedido_estabelecimentoToestabelecimento?.celular}`, '_blank')}
          className="w-full bg-black text-white py-6 rounded-[24px] shadow-xl flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-95 transition-all group border-b-4 border-white/10"
        >
           <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-green-500 transition-all">
              <Phone className="w-5 h-5" />
           </div>
           <div className="text-left">
              <span className="block text-[9px] font-black text-white/40 uppercase tracking-widest leading-none mb-1">Dúvidas sobre o pedido?</span>
              <span className="block text-sm font-black uppercase tracking-tight">Falar com o Estabelecimento</span>
           </div>
        </button>
      </main>
    </div>
  );
}
