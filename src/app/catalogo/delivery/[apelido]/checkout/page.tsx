"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Search, Plus, Navigation, ChevronRight, ArrowLeft, Home, Briefcase, Heart, Check, ShoppingBag, User, LogIn, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import Cookies from "js-cookie";

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const apelido = params.apelido as string;

  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAddress, setSelectedAddress] = useState<any>(null);

  // Carregar carrinho para mostrar resumo
  const cartData = Cookies.get(`cart_${apelido}`);
  const cart = cartData ? JSON.parse(cartData) : [];
  const total = cart.reduce((sum: number, item: any) => sum + item.valor_total, 0);

  // Número do pedido temporário (para referência do cliente)
  const orderNumber = useMemo(() => {
    return Math.floor(100000 + Math.random() * 900000);
  }, []);

  // Verificar sessão do usuário
  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (e) {
        console.error("Erro ao verificar sessão:", e);
      } finally {
        setIsLoading(false);
      }
    }
    checkSession();
  }, []);

  const getAddressIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case "casa": return Home;
      case "trabalho": return Briefcase;
      default: return Heart;
    }
  };

  const getAddressColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case "casa": return "bg-blue-500";
      case "trabalho": return "bg-orange-500";
      default: return "bg-pink-500";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#f45145] animate-spin mb-4" />
        <p className="text-gray-500 font-medium italic">Preparando seu checkout...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans pb-32">
      {/* HEADER PREMIUM */}
      <header className="sticky top-0 z-50 bg-[#f45145] p-6 shadow-lg">
        <div className="max-w-2xl mx-auto flex items-center gap-4 text-white">
          <button 
            onClick={() => router.back()}
            className="p-2 hover:bg-white/10 rounded-2xl transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl font-black tracking-tight uppercase">Entrega</h1>
            <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest">Onde você quer receber?</p>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-4 space-y-8 mt-4">
        {/* RESUMO DO PEDIDO */}
        {cart.length > 0 && (
          <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-[#f45145]" />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pedido #{orderNumber}</p>
                <p className="font-black text-gray-800 uppercase tracking-tight text-sm">{cart.length} item(s)</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total</p>
              <p className="font-black text-[#f45145] text-lg leading-none">R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            </div>
          </div>
        )}

        {!user ? (
          /* ESTADO DESLOGADO (Fig 33 modificado) */
          <div className="space-y-6">
            <div className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-xl shadow-gray-200/50 text-center space-y-6">
              <div className="w-20 h-20 bg-orange-50 rounded-3xl flex items-center justify-center mx-auto">
                <User className="w-10 h-10 text-[#f45145]" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-gray-800 tracking-tight">Identifique-se para continuar</h2>
                <p className="text-sm text-gray-400 font-medium px-4">Para carregar seus endereços e finalizar o pedido, você precisa estar logado.</p>
              </div>
              <div className="pt-4 flex flex-col gap-3">
                <button 
                  onClick={() => router.push(`/auth/login?callbackUrl=/catalogo/delivery/${apelido}/checkout`)}
                  className="w-full bg-[#f45145] text-white font-black py-5 rounded-[24px] shadow-lg shadow-[#f45145]/20 flex items-center justify-center gap-3 hover:bg-[#d43f35] transition-all active:scale-95 border-b-4 border-black/10"
                >
                  <LogIn className="w-5 h-5" />
                  FAZER LOGIN AGORA
                </button>
                <button 
                  onClick={() => router.push(`/auth/register?callbackUrl=/catalogo/delivery/${apelido}/checkout`)}
                  className="w-full bg-white text-gray-500 font-bold py-5 rounded-[24px] border-2 border-gray-100 hover:bg-gray-50 transition-all active:scale-95"
                >
                  NÃO TENHO CONTA
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* ESTADO LOGADO - SELEÇÃO DE ENDEREÇO */
          <div className="space-y-8">
            {/* BUSCA DE NOVO ENDEREÇO */}
            <div className="relative group">
              <div className="absolute left-6 top-1/2 -translate-y-1/2">
                <Search className="w-5 h-5 text-gray-300" />
              </div>
              <input 
                type="text" 
                placeholder="Buscar novo endereço e número..." 
                className="w-full bg-white border border-gray-200 rounded-[32px] pl-16 pr-8 py-6 text-sm shadow-sm focus:outline-none focus:ring-4 focus:ring-[#f45145]/5 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* USAR MINHA LOCALIZAÇÃO */}
            <button className="w-full bg-white border border-gray-100 rounded-[32px] p-6 flex items-center justify-between hover:bg-gray-50 transition-all shadow-sm active:scale-[0.99] group">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Navigation className="w-6 h-6 text-blue-500 fill-blue-500/10" />
                </div>
                <div className="text-left">
                  <p className="font-black text-gray-800 uppercase tracking-tight text-sm">Usar minha localização</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Ativar GPS do celular</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300" />
            </button>

            {/* ENDEREÇOS SALVOS */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 px-4">
                <MapPin className="w-4 h-4 text-[#f45145]" />
                <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Endereços Salvos</h2>
              </div>

              <div className="space-y-4">
                {user.enderecos?.length > 0 ? (
                  user.enderecos.map((addr: any) => {
                    const Icon = getAddressIcon(addr.tipo);
                    const color = getAddressColor(addr.tipo);
                    return (
                      <button 
                        key={addr.id_endereco}
                        onClick={() => setSelectedAddress(addr.id_endereco)}
                        className={`w-full text-left bg-white rounded-[32px] p-6 flex items-center justify-between transition-all border-2 ${selectedAddress === addr.id_endereco ? "border-[#f45145] shadow-lg shadow-[#f45145]/5 scale-[1.02]" : "border-transparent shadow-sm hover:border-gray-100"}`}
                      >
                        <div className="flex items-center gap-5">
                          <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                            <Icon className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="font-black text-gray-800 uppercase tracking-tight text-base">{addr.tipo || "Endereço"}</h4>
                            <p className="text-xs text-gray-400 font-medium mt-1">{addr.lograduro}, {addr.num}</p>
                            <p className="text-[10px] text-gray-300 font-bold uppercase mt-0.5 tracking-tighter">{addr.complemento}</p>
                          </div>
                        </div>
                        {selectedAddress === addr.id_endereco && (
                          <div className="bg-[#f45145] p-2 rounded-full text-white">
                            <Check className="w-4 h-4" />
                          </div>
                        )}
                      </button>
                    );
                  })
                ) : (
                  <div className="text-center py-10 bg-white rounded-[32px] border border-dashed border-gray-200">
                    <p className="text-sm text-gray-400 font-medium italic">Nenhum endereço salvo ainda.</p>
                  </div>
                )}
              </div>
            </div>

            {/* ADICIONAR NOVO */}
            <button className="w-full bg-gray-100/50 border border-dashed border-gray-200 rounded-[32px] p-8 flex flex-col items-center justify-center gap-3 hover:bg-gray-100 transition-all active:scale-95 group">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:rotate-90 transition-transform duration-500">
                <Plus className="w-6 h-6 text-gray-400" />
              </div>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Cadastrar novo endereço</span>
            </button>
          </div>
        )}
      </main>

      {/* FOOTER FIXO PARA PROSSEGUIR */}
      <AnimatePresence>
        {selectedAddress && (
          <motion.div 
            initial={{ y: 100 }} 
            animate={{ y: 0 }} 
            exit={{ y: 100 }}
            className="fixed bottom-0 inset-x-0 bg-white border-t border-gray-100 p-8 z-50 shadow-[0_-20px_40px_rgba(0,0,0,0.05)]"
          >
            <button 
              className="w-full bg-[#f45145] text-white font-black py-6 rounded-[32px] shadow-2xl shadow-[#f45145]/30 flex justify-between px-10 items-center transition-all hover:scale-[1.02] active:scale-95 group border-b-4 border-black/10"
            >
              <span className="text-lg tracking-widest uppercase italic">IR PARA O PAGAMENTO</span>
              <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
