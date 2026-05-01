"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ShoppingBasket, Search, Plus, Minus, X, Loader2, ShoppingBag, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type ItemType = { id_complemento_item: string; nome: string; descricao?: string; valor?: number };
type ComplementoType = { id_complemento_tipo: string; nome: string; quantidade_minima?: number; quantidade_maxima?: number; complemento_item_complemento_item_complemento_tipoTocomplemento_tipo: ItemType[] };
type ProdutoType = { id_produto: string; nome: string; descricao?: string; valor_total?: number; foto?: string; visibilidade?: string; complemento_tipo_complemento_tipo_produtoToproduto: ComplementoType[] };
type CategoriaType = { id_categoria: string; nome: string; produto_produto_categoriaTocategoria: ProdutoType[] };

export default function VitrinePage() {
  const [categorias, setCategorias] = useState<CategoriaType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProd, setSelectedProd] = useState<ProdutoType | null>(null);
  const [cart, setCart] = useState<any[]>([]);

  const fetchCatalogo = useCallback(async () => {
    try {
      const params = new URLSearchParams(window.location.search);
      const tId = params.get("tenantId");

      if (!tId) {
        console.warn("Nenhum tenantId fornecido na URL.");
        setLoading(false);
        return;
      }

      const res = await fetch(`/api/catalogo/categorias?tenantId=${tId}`);
      const data = await res.json();
      if (Array.isArray(data)) setCategorias(data);
    } catch (err) {
      console.error("Erro ao carregar catálogo:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCatalogo(); }, [fetchCatalogo]);

  const filteredCategorias = categorias.map(cat => ({
    ...cat,
    produto_produto_categoriaTocategoria: cat.produto_produto_categoriaTocategoria.filter(p => 
      p.nome.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(cat => cat.produto_produto_categoriaTocategoria.length > 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#f45145] animate-spin mb-4" />
        <p className="text-gray-500 font-medium italic">Preparando cardápio...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans pb-20">
      {/* HEADER (Fig 30) */}
      <header className="sticky top-0 z-50 bg-[#f45145] p-6 shadow-lg">
        <div className="max-w-4xl mx-auto flex justify-between items-center text-white">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-inner overflow-hidden">
               <img src="/logo.png" alt="" className="w-8 h-8 object-contain" onError={(e) => e.currentTarget.src = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"} />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight">Akipede Sushi</h1>
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-400 rounded-full" /> Aberto Agora
              </p>
            </div>
          </div>
          <div className="flex items-center gap-5">
            <div className="relative cursor-pointer hover:scale-110 transition-transform">
              <ShoppingBasket className="w-8 h-8" />
              <span className="absolute -top-1 -right-1 bg-white text-[#f45145] text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                {cart.length}
              </span>
            </div>
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 cursor-pointer transition-colors">
              <Search className="w-5 h-5" />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 space-y-8">
        {/* BUSCA E STATUS */}
        <div className="text-center py-6">
          <p className="text-[#f45145] font-black text-sm uppercase tracking-wider">Sinto muito estamos fechados</p>
          <p className="text-gray-400 text-xs mt-1">Clique e veja os horários do estabelecimento:</p>
          
          <div className="mt-6 relative">
            <input 
              type="text" 
              placeholder="O que você deseja comer hoje?" 
              className="w-full bg-white border border-gray-200 rounded-2xl px-6 py-4 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#f45145]/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
          </div>
        </div>

        {/* CATEGORIAS E PRODUTOS (Grid) */}
        <div className="space-y-12">
          {filteredCategorias.map(cat => (
            <div key={cat.id_categoria} className="space-y-6">
              <div className="bg-[#f45145] text-white px-6 py-3 rounded-xl shadow-md inline-block">
                <h3 className="text-lg font-black uppercase tracking-widest">{cat.nome} ({cat.produto_produto_categoriaTocategoria.length})</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                {cat.produto_produto_categoriaTocategoria.map(prod => (
                  <motion.div 
                    key={prod.id_produto}
                    whileHover={{ y: -5 }}
                    onClick={() => setSelectedProd(prod)}
                    className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer group"
                  >
                    <div className="h-64 overflow-hidden relative">
                      {prod.foto ? (
                        <img src={prod.foto} alt={prod.nome} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center"><ShoppingBag className="w-12 h-12 text-gray-200" /></div>
                      )}
                    </div>
                    <div className="p-6 text-center space-y-4">
                      <h4 className="text-xl font-black text-gray-800">{prod.nome}</h4>
                      <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed h-10">{prod.descricao || "Descrição indisponível."}</p>
                      <button className="w-full bg-[#f45145] text-white font-black py-4 rounded-2xl shadow-lg shadow-[#f45145]/20 hover:bg-[#d43f35] transition-all">
                        R$ {Number(prod.valor_total).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* MODAL DETALHE (Fig 31) */}
      <AnimatePresence>
        {selectedProd && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedProd(null)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            
            <motion.div 
              initial={{ y: "100%" }} 
              animate={{ y: 0 }} 
              exit={{ y: "100%" }} 
              className="relative w-full max-w-xl bg-white rounded-t-[40px] sm:rounded-[40px] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              <button onClick={() => setSelectedProd(null)} className="absolute top-6 right-6 z-10 bg-black/20 hover:bg-black/40 p-2 rounded-full text-white backdrop-blur-md transition-all">
                <X className="w-6 h-6" />
              </button>

              <div className="overflow-y-auto pb-32">
                <div className="h-64 sm:h-80 relative">
                  {selectedProd.foto ? (
                    <img src={selectedProd.foto} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-100" />
                  )}
                </div>

                <div className="p-8 space-y-6">
                  <div>
                    <h3 className="text-2xl font-black text-gray-800">{selectedProd.nome}</h3>
                    <p className="text-sm text-gray-400 mt-2">{selectedProd.descricao || "Sem descrição disponível."}</p>
                    <p className="text-xl font-bold text-blue-800 mt-4">R$ {Number(selectedProd.valor_total).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  </div>

                  {/* COMPLEMENTOS */}
                  {selectedProd.complemento_tipo_complemento_tipo_produtoToproduto.map(comp => (
                    <div key={comp.id_complemento_tipo} className="space-y-4">
                      <div className="bg-gray-50 px-6 py-4 flex justify-between items-center rounded-xl border border-gray-100">
                        <div>
                          <p className="font-bold text-gray-700">{comp.nome}</p>
                          <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Escolha de {comp.quantidade_minima || 0} a {comp.quantidade_maxima || 10} opções</p>
                        </div>
                        <div className="flex gap-2">
                           <span className="bg-gray-400 text-white text-[10px] px-2 py-1 rounded font-bold">0/{comp.quantidade_maxima}</span>
                           <span className="bg-gray-600 text-white text-[10px] px-2 py-1 rounded font-bold uppercase">{Number(comp.quantidade_minima) > 0 ? "Obrigatório" : "Opcional"}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {comp.complemento_item_complemento_item_complemento_tipoTocomplemento_tipo.map(item => (
                          <div key={item.id_complemento_item} className="flex items-center justify-between p-4 border-b border-gray-50 last:border-0 group">
                            <div>
                              <p className="font-bold text-gray-700">{item.nome}</p>
                              <p className="text-sm text-blue-600 font-medium">+ R$ {Number(item.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                            </div>
                            <div className="flex items-center gap-6">
                               <Minus className="w-6 h-6 text-blue-400 cursor-pointer hover:scale-125 transition-transform" />
                               <Plus className="w-6 h-6 text-blue-400 cursor-pointer hover:scale-125 transition-transform" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  {/* OBSERVAÇÃO */}
                  <div className="pt-4">
                    <p className="text-sm font-bold text-gray-600 flex items-center gap-2 mb-3">
                       <input type="checkbox" className="w-4 h-4 rounded accent-blue-600" /> Deseja fazer alguma mudança?
                    </p>
                    <textarea placeholder="Ex: Sem cebola, tirar o arroz..." className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/10 min-h-[100px]" />
                  </div>
                </div>
              </div>

              {/* RODAPÉ DO MODAL (BOTAO ADICIONAR) */}
              <div className="absolute bottom-0 left-0 right-0 p-8 bg-white border-t border-gray-100 flex items-center justify-between gap-6 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
                <div className="flex items-center gap-6 bg-gray-50 px-6 py-4 rounded-2xl border border-gray-100">
                  <Minus className="w-6 h-6 text-gray-300" />
                  <span className="text-xl font-black">1</span>
                  <Plus className="w-6 h-6 text-blue-600 cursor-pointer" />
                </div>
                <button className="flex-1 bg-blue-700 hover:bg-blue-800 text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-700/20 flex justify-between px-8 items-center transition-all">
                  <span className="flex items-center gap-2 tracking-wide text-lg"><Plus className="w-5 h-5" /> ADICIONAR</span>
                  <span className="text-lg">R$ {Number(selectedProd.valor_total).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
