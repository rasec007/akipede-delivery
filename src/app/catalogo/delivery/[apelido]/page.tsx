"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { ShoppingBasket, Search, Plus, Minus, X, Loader2, ShoppingBag, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type ItemType = { id_complemento_item: string; nome: string; descricao?: string; valor?: number };
type ComplementoType = { id_complemento_tipo: string; nome: string; quantidade_minima?: number; quantidade_maxima?: number; complemento_item_complemento_item_complemento_tipoTocomplemento_tipo: ItemType[] };
type ProdutoType = { id_produto: string; nome: string; descricao?: string; valor_total?: number; foto?: string; visibilidade?: string; complemento_tipo_complemento_tipo_produtoToproduto: ComplementoType[] };
type CategoriaType = { id_categoria: string; nome: string; produto_produto_categoriaTocategoria: ProdutoType[] };

export default function CatalogoDeliveryPage() {
  const params = useParams();
  const apelido = params.apelido as string;
  
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProd, setSelectedProd] = useState<ProdutoType | null>(null);
  const [cart, setCart] = useState<any[]>([]);
  const [expandedCats, setExpandedCats] = useState<Record<string, boolean>>({});
  const [showHorariosModal, setShowHorariosModal] = useState(false);

  const toggleCat = (id: string) => setExpandedCats(prev => ({ ...prev, [id]: !prev[id] }));

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`/api/catalogo/publico/${apelido}?tipo=delivery`);
      const result = await res.json();
      if (res.ok) setData(result);
    } catch (err) {
      console.error("Erro ao carregar catálogo:", err);
    } finally {
      setLoading(false);
    }
  }, [apelido]);

  useEffect(() => { if (apelido) fetchData(); }, [apelido, fetchData]);

  // Abre automaticamente as categorias que contêm os produtos pesquisados
  useEffect(() => {
    if (searchTerm.trim() !== "" && data?.categorias) {
      const matches = data.categorias.filter((cat: any) => 
        cat.produto_produto_categoriaTocategoria.some((p: any) => p.nome.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      if (matches.length > 0) {
        setExpandedCats(prev => {
          const next = { ...prev };
          let changed = false;
          matches.forEach((cat: any) => { 
            if (!next[cat.id_categoria]) {
              next[cat.id_categoria] = true; 
              changed = true;
            }
          });
          return changed ? next : prev;
        });
      }
    }
  }, [searchTerm, data]);

  const filteredCategorias = data?.categorias?.map((cat: any) => ({
    ...cat,
    produto_produto_categoriaTocategoria: cat.produto_produto_categoriaTocategoria.filter((p: any) => 
      p.nome.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter((cat: any) => cat.produto_produto_categoriaTocategoria.length > 0) || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#f45145] animate-spin mb-4" />
        <p className="text-gray-500 font-medium italic">Carregando cardápio de {apelido}...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8 text-center">
        <ShoppingBag className="w-16 h-16 text-gray-200 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800">Estabelecimento não encontrado</h2>
        <p className="text-gray-400 mt-2">O link que você acessou pode estar incorreto ou o estabelecimento não existe.</p>
      </div>
    );
  }

  const { estabelecimento, status } = data;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans pb-20">
      {/* HEADER DINÂMICO */}
      <header className="sticky top-0 z-50 bg-[#f45145] p-6 shadow-lg transition-all duration-300">
        <div className="max-w-4xl mx-auto flex justify-between items-center text-white">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-inner overflow-hidden border-2 border-white/20">
               <img src={estabelecimento.logo || "/logo.png"} alt={estabelecimento.razao_social} className="w-10 h-10 object-contain" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight uppercase">{estabelecimento.razao_social}</h1>
              <div className="flex flex-col items-start mt-0.5">
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 flex items-center gap-1.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${status?.aberto ? "bg-green-400 animate-pulse" : "bg-red-400"}`} />
                  {status?.aberto ? "Aberto Agora" : "Fechado no momento"}
                </p>
                <button onClick={() => setShowHorariosModal(true)} className="text-[10px] text-white/80 hover:text-white mt-1 flex items-center gap-1 underline decoration-white/30 underline-offset-2 transition-colors">
                  <Clock className="w-3 h-3" /> Ver horários
                </button>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-5">
            <div className="relative cursor-pointer hover:scale-110 transition-transform active:scale-95">
              <ShoppingBasket className="w-9 h-9" />
              <span className="absolute -top-1 -right-1 bg-white text-[#f45145] text-[10px] font-black w-5.5 h-5.5 rounded-full flex items-center justify-center shadow-lg border-2 border-[#f45145]">
                {cart.length}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 space-y-8 mt-2">
        {/* STATUS DE FUNCIONAMENTO (Fig 30) */}
        {!status?.aberto && (
          <div className="text-center bg-orange-50 border border-orange-100 p-6 rounded-[32px] shadow-sm">
            <p className="text-[#f45145] font-black text-sm uppercase tracking-widest">{status?.mensagem || "Sinto muito, estamos fechados"}</p>
          </div>
        )}

        {/* BUSCA PREMIUM */}
        <div className="relative group">
          <input 
            type="text" 
            placeholder="O que você deseja comer hoje?" 
            className="w-full bg-white border border-gray-200 rounded-[24px] px-8 py-5 text-sm shadow-sm focus:outline-none focus:ring-4 focus:ring-[#f45145]/5 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute right-6 top-1/2 -translate-y-1/2 p-2 bg-gray-50 rounded-xl">
            <Search className="w-5 h-5 text-gray-300 group-focus-within:text-[#f45145] transition-colors" />
          </div>
        </div>

        {/* LISTAGEM DE PRODUTOS - MODO SANFONA */}
        <div className="space-y-6 pt-4">
          {filteredCategorias.map((cat: any) => (
            <div key={cat.id_categoria} className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">
              {/* HEADER DA CATEGORIA (Clicável) */}
              <button 
                onClick={() => toggleCat(cat.id_categoria)}
                className="w-full bg-[#f45145] text-white px-8 py-5 flex items-center justify-between shadow-md transition-all active:scale-[0.99]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-white rounded-full" />
                  <h3 className="text-lg font-black uppercase tracking-[0.1em]">{cat.nome}</h3>
                  <span className="bg-white/20 px-2 py-0.5 rounded-lg text-[10px] font-bold">{cat.produto_produto_categoriaTocategoria.length}</span>
                </div>
                {expandedCats[cat.id_categoria] ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
              </button>

              <AnimatePresence>
                {expandedCats[cat.id_categoria] && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 bg-gray-50/50">
                      {cat.produto_produto_categoriaTocategoria.map((prod: any) => (
                        <motion.div 
                          key={prod.id_produto}
                          whileHover={{ y: -4 }}
                          onClick={() => setSelectedProd(prod)}
                          className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-gray-100 cursor-pointer group flex flex-col h-full hover:shadow-xl hover:border-orange-100 transition-all duration-300"
                        >
                          {/* IMAGEM PREMIUM - Tamanho ideal, nítida e com cantos arredondados */}
                          <div className="h-60 w-full p-4 pb-0">
                            <div className="w-full h-full relative rounded-[24px] overflow-hidden shadow-sm border border-gray-100">
                              {prod.foto ? (
                                <img src={prod.foto} alt={prod.nome} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                              ) : (
                                <div className="w-full h-full bg-gray-50 flex items-center justify-center group-hover:bg-orange-50 transition-colors">
                                  <ShoppingBag className="w-16 h-16 text-gray-200 group-hover:text-orange-200 transition-colors" />
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="p-6 text-center flex flex-col flex-1 justify-between gap-4">
                            <div className="space-y-2">
                              <h4 className="text-xl font-black text-gray-800 tracking-tight group-hover:text-[#f45145] transition-colors">{prod.nome}</h4>
                              <p className="text-xs text-gray-400 font-medium leading-relaxed line-clamp-2 h-8">{prod.descricao || "Um sabor irresistível preparado com ingredientes selecionados."}</p>
                            </div>
                            <div className="pt-2">
                              <button className="w-full bg-[#f45145] text-white font-black py-4 rounded-[20px] shadow-md shadow-[#f45145]/20 hover:bg-[#d43f35] active:scale-95 transition-all text-base tracking-wide border-b-4 border-black/10">
                                {Number(prod.valor_total) > 0 ? `R$ ${Number(prod.valor_total).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : "Montar Pedido"}
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </main>

      {/* MODAL DETALHE (Fig 31) */}
      <AnimatePresence>
        {selectedProd && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedProd(null)} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            
            <motion.div 
              initial={{ y: "100%" }} 
              animate={{ y: 0 }} 
              exit={{ y: "100%" }} 
              className="relative w-full max-w-2xl bg-white rounded-t-[48px] sm:rounded-[48px] overflow-hidden shadow-2xl flex flex-col max-h-[95vh]"
            >
              <button onClick={() => setSelectedProd(null)} className="absolute top-8 right-8 z-20 bg-black/40 hover:bg-black/60 p-2.5 rounded-full text-white backdrop-blur-lg transition-all active:scale-90">
                <X className="w-6 h-6" />
              </button>

              <div className="overflow-y-auto pb-36">
                <div className="h-80 sm:h-[400px] relative">
                  {selectedProd.foto ? (
                    <img src={selectedProd.foto} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center"><ShoppingBag className="w-20 h-20 text-gray-200" /></div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                </div>

                <div className="px-10 -mt-16 relative z-10 space-y-8">
                  <div className="bg-white rounded-[32px] p-8 shadow-xl border border-gray-50">
                    <h3 className="text-3xl font-black text-gray-800 tracking-tight">{selectedProd.nome}</h3>
                    <p className="text-base text-gray-400 mt-3 font-medium leading-relaxed">{selectedProd.descricao || "Preparado com os melhores ingredientes da casa para você."}</p>
                    <p className="text-2xl font-black text-blue-800 mt-6 bg-blue-50 inline-block px-6 py-2 rounded-2xl border border-blue-100">
                      {Number(selectedProd.valor_total) > 0 ? `R$ ${Number(selectedProd.valor_total).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : "Montar Pedido"}
                    </p>
                  </div>

                  {/* COMPLEMENTOS */}
                  {selectedProd.complemento_tipo_complemento_tipo_produtoToproduto.map(comp => (
                    <div key={comp.id_complemento_tipo} className="space-y-6">
                      <div className="bg-gray-50 px-8 py-5 flex justify-between items-center rounded-3xl border border-gray-100">
                        <div>
                          <p className="font-black text-gray-800 text-lg uppercase tracking-tight">{comp.nome}</p>
                          <p className="text-[11px] text-gray-400 uppercase tracking-widest mt-1 font-bold">Escolha de {comp.quantidade_minima || 0} a {comp.quantidade_maxima || 10} opções</p>
                        </div>
                        <div className="flex gap-2">
                           <span className="bg-white shadow-sm text-gray-400 text-[11px] px-3 py-1.5 rounded-xl font-black border border-gray-100 tracking-tighter uppercase italic">0/{comp.quantidade_maxima}</span>
                           <span className={`text-white text-[10px] px-3 py-1.5 rounded-xl font-black uppercase tracking-widest ${Number(comp.quantidade_minima) > 0 ? "bg-red-500 shadow-lg shadow-red-500/20" : "bg-gray-800"}`}>
                             {Number(comp.quantidade_minima) > 0 ? "Obrigatório" : "Opcional"}
                           </span>
                        </div>
                      </div>

                      <div className="space-y-3 px-2">
                        {comp.complemento_item_complemento_item_complemento_tipoTocomplemento_tipo.map(item => (
                          <div key={item.id_complemento_item} className="flex items-center justify-between p-6 rounded-[28px] border border-gray-50 hover:bg-gray-50 transition-colors group">
                            <div>
                              <p className="font-black text-gray-700 text-base">{item.nome}</p>
                              <p className="text-sm text-blue-600 font-black mt-0.5">+ R$ {Number(item.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                            </div>
                            <div className="flex items-center gap-6 bg-white rounded-2xl p-1.5 shadow-sm border border-gray-100">
                               <div className="p-2.5 bg-gray-50 rounded-xl text-gray-300 hover:text-red-400 transition-colors cursor-pointer active:scale-90"><Minus className="w-5 h-5" /></div>
                               <span className="text-lg font-black w-4 text-center">0</span>
                               <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600 hover:bg-blue-100 transition-all cursor-pointer active:scale-90 shadow-md"><Plus className="w-5 h-5" /></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  {/* OBSERVAÇÃO */}
                  <div className="pt-4 pb-10">
                    <label className="text-sm font-black text-gray-500 flex items-center gap-3 mb-4 cursor-pointer hover:text-gray-800 transition-colors">
                       <input type="checkbox" className="w-5 h-5 rounded-lg accent-blue-600 cursor-pointer" /> Deseja fazer alguma mudança?
                    </label>
                    <textarea placeholder="Ex: Sem cebola, caprichar no molho..." className="w-full bg-gray-50 border border-gray-200 rounded-[32px] p-6 text-sm focus:outline-none focus:ring-4 focus:ring-blue-600/5 min-h-[120px] transition-all" />
                  </div>
                </div>
              </div>

              {/* RODAPÉ DO MODAL (BOTAO ADICIONAR) */}
              <div className="absolute bottom-0 left-0 right-0 p-8 bg-white/80 backdrop-blur-xl border-t border-gray-100 flex items-center justify-between gap-6 shadow-[0_-15px_40px_rgba(0,0,0,0.06)]">
                <div className="flex items-center gap-8 bg-gray-50 px-8 py-5 rounded-[24px] border border-gray-100">
                  <Minus className="w-6 h-6 text-gray-300 cursor-pointer hover:text-gray-500" />
                  <span className="text-2xl font-black w-6 text-center">1</span>
                  <Plus className="w-6 h-6 text-blue-600 cursor-pointer hover:scale-110 active:scale-90 transition-transform" />
                </div>
                <button className="flex-1 bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white font-black py-5 rounded-[24px] shadow-2xl shadow-blue-700/30 flex justify-between px-10 items-center transition-all hover:scale-[1.02] active:scale-95 group">
                  <span className="flex items-center gap-3 tracking-wide text-lg"><Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-500" /> ADICIONAR</span>
                  <span className="text-xl font-bold border-l border-white/20 pl-8 ml-4">
                    {Number(selectedProd.valor_total) > 0 ? `R$ ${Number(selectedProd.valor_total).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : "Montar Pedido"}
                  </span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL HORÁRIOS */}
      <AnimatePresence>
        {showHorariosModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowHorariosModal(false)} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.9, opacity: 0 }} 
              className="relative w-full max-w-sm bg-white rounded-[32px] overflow-hidden shadow-2xl flex flex-col z-10"
            >
              <div className="bg-[#f45145] p-6 text-center relative">
                <button onClick={() => setShowHorariosModal(false)} className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 p-1.5 rounded-full text-white transition-all active:scale-90">
                  <X className="w-5 h-5" />
                </button>
                <Clock className="w-8 h-8 text-white mx-auto mb-2 opacity-80" />
                <h3 className="text-white font-black text-xl tracking-wide uppercase">Horários</h3>
              </div>
              
              <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                {data?.horarios?.length > 0 ? (
                  data.horarios.map((h: any) => (
                    <div key={h.id_horario_funcionamento} className="flex justify-between items-center border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                      <span className="font-bold text-gray-700">{h.dominio?.nome}</span>
                      <div className="text-sm font-black text-gray-500 bg-gray-50 px-3 py-1 rounded-lg tracking-widest border border-gray-100">
                        {new Date(h.horaAbre).toLocaleTimeString('pt-BR', {timeZone: 'UTC', hour: '2-digit', minute:'2-digit'})} - {new Date(h.horaFecha).toLocaleTimeString('pt-BR', {timeZone: 'UTC', hour: '2-digit', minute:'2-digit'})}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-400 text-sm py-4">Nenhum horário cadastrado.</p>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
