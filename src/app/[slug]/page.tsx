"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { 
  ShoppingBag, Clock, Info, Search, ChevronRight, 
  Plus, Minus, MapPin, Phone, AlertCircle 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Produto = {
  id_produto: string;
  nome: string;
  descricao?: string;
  valor_total: number;
  foto?: string;
};

type Categoria = {
  id_categoria: string;
  nome: string;
  produto_produto_categoriaTocategoria: Produto[];
};

type Estabelecimento = {
  razao_social: string;
  apelido: string;
  logo?: string;
  descricao?: string;
  celular?: string;
};

export default function CatalogoPage({ params }: { params: { slug: string } }) {
  const [data, setData] = useState<{
    estabelecimento: Estabelecimento;
    categorias: Categoria[];
    status: { aberto: boolean; mensagem: string };
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    fetch(`/api/public/catalogo/${params.slug}`)
      .then(res => res.json())
      .then(json => {
        setData(json);
        if (json.categorias?.length > 0) setActiveCategory(json.categorias[0].id_categoria);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [params.slug]);

  const scrollToCategory = (id: string) => {
    setActiveCategory(id);
    categoryRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
        <Clock className="w-8 h-8 text-blue-500" />
      </motion.div>
    </div>
  );

  if (!data || !data.estabelecimento) return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center text-white/40 flex-col gap-4">
      <AlertCircle className="w-12 h-12 opacity-20" />
      <p className="font-bold">Estabelecimento não encontrado.</p>
      <button onClick={() => window.location.href = "/"} className="text-blue-400 text-sm hover:underline">Voltar para o início</button>
    </div>
  );

  const { estabelecimento, categorias, status } = data;

  return (
    <div className="min-h-screen bg-[#0F172A] text-white pb-24">
      {/* HEADER / BANNER */}
      <div className="relative h-48 bg-gradient-to-b from-blue-600/20 to-[#0F172A] border-b border-white/5">
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center">
          <div className="w-24 h-24 rounded-3xl overflow-hidden border-4 border-[#0F172A] bg-white/5 shadow-2xl">
            {estabelecimento.logo ? (
              <img src={estabelecimento.logo} alt={estabelecimento.razao_social} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-blue-600">
                <ShoppingBag className="w-10 h-10 text-white" />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-12 text-center px-4">
        <h1 className="text-2xl font-bold">{estabelecimento.razao_social}</h1>
        <p className="text-white/40 text-sm mt-1">{estabelecimento.descricao || "Seja bem-vindo!"}</p>
        
        <div className="flex items-center justify-center gap-4 mt-4 text-xs font-medium text-white/60">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>30-45 min</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-white/10" />
          <div className="flex items-center gap-1">
            <Phone className="w-3.5 h-3.5" />
            <span>{estabelecimento.celular || "Sem telefone"}</span>
          </div>
        </div>
      </div>

      {/* STATUS BANNER */}
      <AnimatePresence>
        {!status.aberto && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-4 mt-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-red-400">Estabelecimento Fechado</p>
              <p className="text-xs text-red-400/70">{status.mensagem}</p>
              <p className="text-[10px] text-red-400/50 mt-1 uppercase font-bold tracking-wider">Você pode ver o cardápio, mas não poderá fazer pedidos.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CATEGORIES NAV (STICKY) */}
      <div className="sticky top-0 z-40 bg-[#0F172A]/80 backdrop-blur-xl border-b border-white/5 mt-6">
        <div className="flex overflow-x-auto no-scrollbar py-4 px-4 gap-2">
          {categorias.map(cat => (
            <button
              key={cat.id_categoria}
              onClick={() => scrollToCategory(cat.id_categoria)}
              className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                activeCategory === cat.id_categoria
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                  : "bg-white/5 text-white/40 hover:bg-white/10"
              }`}
            >
              {cat.nome}
            </button>
          ))}
        </div>
      </div>

      {/* SEARCH */}
      <div className="px-4 mt-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
          <input 
            type="text" 
            placeholder="O que você está procurando?"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
          />
        </div>
      </div>

      {/* PRODUCTS LIST */}
      <div className="px-4 mt-8 space-y-10">
        {categorias.map(cat => {
          const filteredProducts = cat.produto_produto_categoriaTocategoria.filter(p => 
            p.nome.toLowerCase().includes(search.toLowerCase())
          );
          if (filteredProducts.length === 0) return null;

          return (
            <div key={cat.id_categoria} ref={(el) => { categoryRefs.current[cat.id_categoria] = el; }} className="scroll-mt-32">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <div className="w-1 h-5 bg-blue-600 rounded-full" />
                {cat.nome}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredProducts.map(prod => (
                  <div key={prod.id_produto} className="glass p-3 rounded-2xl flex gap-4 hover:bg-white/[0.08] transition-all group">
                    <div className="w-24 h-24 rounded-xl overflow-hidden bg-white/5 flex-shrink-0">
                      {prod.foto ? (
                        <img src={prod.foto} alt={prod.nome} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag className="w-6 h-6 text-white/10" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col justify-between flex-1">
                      <div>
                        <p className="font-bold text-sm">{prod.nome}</p>
                        <p className="text-xs text-white/30 line-clamp-2 mt-1">{prod.descricao}</p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-blue-400 font-bold">
                          R$ {Number(prod.valor_total).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                        
                        <button
                          disabled={!status.aberto}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                            status.aberto
                              ? "bg-blue-600 text-white hover:bg-blue-500"
                              : "bg-white/10 text-white/20 cursor-not-allowed"
                          }`}
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* FLOAT CART BUTTON (PREVIEW) */}
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-6 left-4 right-4 z-50"
      >
        <button className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-2xl font-bold shadow-2xl flex items-center justify-between px-6 transition-all">
          <div className="flex items-center gap-3">
            <div className="relative">
              <ShoppingBag className="w-6 h-6" />
              <span className="absolute -top-2 -right-2 bg-white text-blue-600 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">0</span>
            </div>
            <span>Ver Carrinho</span>
          </div>
          <span className="text-white/80">R$ 0,00</span>
        </button>
      </motion.div>
    </div>
  );
}
