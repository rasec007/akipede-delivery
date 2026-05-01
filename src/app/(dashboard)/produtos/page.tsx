"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, ChevronDown, ChevronRight, Edit2, Trash2, ShoppingBag, Loader2, Package, Layers, Truck, UtensilsCrossed, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { ModalCategoria, ModalProduto, ModalComplemento, ModalItem } from "@/client/components/catalogo/CatalogoModals";

type ItemType = { id_complemento_item: string; nome: string; descricao?: string; valor?: number };
type ComplementoType = { id_complemento_tipo: string; nome: string; quantidade_minima?: number; quantidade_maxima?: number; complemento_item_complemento_item_complemento_tipoTocomplemento_tipo: ItemType[] };
type ProdutoType = { id_produto: string; nome: string; descricao?: string; valor_total?: number; foto?: string; visibilidade?: string; complemento_tipo_complemento_tipo_produtoToproduto: ComplementoType[] };
type CategoriaType = { id_categoria: string; nome: string; produto_produto_categoriaTocategoria: ProdutoType[] };

export default function ProdutosPage() {
  const router = useRouter();
  const [categorias, setCategorias] = useState<CategoriaType[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCats, setExpandedCats] = useState<Set<string>>(new Set());
  const [expandedProds, setExpandedProds] = useState<Set<string>>(new Set());

  // Modal states
  const [modalCat, setModalCat] = useState<{ open: boolean; edit: any }>({ open: false, edit: null });
  const [modalProd, setModalProd] = useState<{ open: boolean; edit: any; catId: string; catNome: string }>({ open: false, edit: null, catId: "", catNome: "" });
  const [modalComp, setModalComp] = useState<{ open: boolean; edit: any; prodId: string; prodNome: string }>({ open: false, edit: null, prodId: "", prodNome: "" });
  const [modalItem, setModalItem] = useState<{ open: boolean; edit: any; compId: string; compNome: string }>({ open: false, edit: null, compId: "", compNome: "" });

  const fetchCatalogo = useCallback(async () => {
    try {
      const res = await fetch("/api/catalogo/categorias");
      const data = await res.json();
      if (res.status === 401) return router.push("/auth/login");
      if (Array.isArray(data)) setCategorias(data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  }, [router]);

  useEffect(() => { fetchCatalogo(); }, [fetchCatalogo]);

  const toggleCat = (id: string) => { setExpandedCats(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; }); };
  const toggleProd = (id: string) => { setExpandedProds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; }); };

  const handleApiError = async (res: Response) => {
    if (res.status === 401) {
      toast.error("Sessão expirada. Faça login novamente.");
      router.push("/auth/login");
      return;
    }
    const err = await res.json();
    toast.error(err.error || "Erro inesperado");
  };

  const handleSaveCategoria = async (data: { id?: string; nome: string }) => {
    const method = data.id ? "PUT" : "POST";
    const body = data.id ? { id: data.id, nome: data.nome } : { nome: data.nome };
    const res = await fetch("/api/catalogo/categorias", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (res.ok) { toast.success(data.id ? "Categoria atualizada!" : "Categoria criada!"); setModalCat({ open: false, edit: null }); fetchCatalogo(); }
    else { await handleApiError(res); }
  };

  const handleDeleteCategoria = async (id: string) => {
    const res = await fetch(`/api/catalogo/categorias?id=${id}`, { method: "DELETE" });
    if (res.ok) { toast.success("Categoria excluída!"); fetchCatalogo(); }
    else { await handleApiError(res); }
  };

  const handleSaveProduto = async (data: any) => {
    const method = data.id ? "PUT" : "POST";
    const body = data.id ? data : { ...data, categoriaId: modalProd.catId };
    const res = await fetch("/api/catalogo/produtos", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (res.ok) { toast.success(data.id ? "Produto atualizado!" : "Produto criado!"); setModalProd({ open: false, edit: null, catId: "", catNome: "" }); fetchCatalogo(); }
    else { await handleApiError(res); }
  };

  const handleDeleteProduto = async (id: string) => {
    const res = await fetch(`/api/catalogo/produtos?id=${id}`, { method: "DELETE" });
    if (res.ok) { toast.success("Produto excluído!"); fetchCatalogo(); }
    else { await handleApiError(res); }
  };

  const handleSaveComplemento = async (data: any) => {
    const method = data.id ? "PUT" : "POST";
    const body = data.id ? data : { ...data, produtoId: modalComp.prodId };
    const res = await fetch("/api/catalogo/complementos", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (res.ok) { toast.success(data.id ? "Complemento atualizado!" : "Complemento criado!"); setModalComp({ open: false, edit: null, prodId: "", prodNome: "" }); fetchCatalogo(); }
    else { await handleApiError(res); }
  };

  const handleDeleteComplemento = async (id: string) => {
    const res = await fetch(`/api/catalogo/complementos?id=${id}`, { method: "DELETE" });
    if (res.ok) { toast.success("Complemento excluído!"); fetchCatalogo(); }
    else { await handleApiError(res); }
  };

  const handleSaveItem = async (data: any) => {
    const method = data.id ? "PUT" : "POST";
    const body = data.id ? data : { ...data, complementoTipoId: modalItem.compId };
    const res = await fetch("/api/catalogo/itens", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (res.ok) { toast.success(data.id ? "Item atualizado!" : "Item criado!"); setModalItem({ open: false, edit: null, compId: "", compNome: "" }); fetchCatalogo(); }
    else { await handleApiError(res); }
  };

  const handleDeleteItem = async (id: string) => {
    const res = await fetch(`/api/catalogo/itens?id=${id}`, { method: "DELETE" });
    if (res.ok) { toast.success("Item excluído!"); fetchCatalogo(); }
    else { await handleApiError(res); }
  };

  if (loading) return <div className="flex items-center justify-center py-32"><Loader2 className="w-8 h-8 text-blue-400 animate-spin" /></div>;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-24 px-4">
      {/* Header Proporcional */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 glass p-6 rounded-[32px] border border-white/10 shadow-xl relative overflow-hidden group">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold text-white tracking-tight">Meus <span className="text-blue-400 font-semibold">Produtos</span></h2>
          <p className="text-white/40 text-sm mt-0.5">Gerencie o catálogo do seu estabelecimento.</p>
        </div>
        <div className="relative z-10">
          <button onClick={() => setModalCat({ open: true, edit: null })}
            className="bg-gradient-to-br from-[#415CC1] to-[#304699] hover:opacity-90 active:scale-95 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all text-xs border border-white/10 shadow-lg shadow-blue-900/20">
            <Layers className="w-4 h-4" /> Nova Categoria
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {categorias.map(cat => (
          <div key={cat.id_categoria} className="glass rounded-[32px] border border-white/5 overflow-hidden shadow-lg transition-all duration-300">
            {/* CATEGORIA HEADER */}
            <div className="flex items-center justify-between px-8 py-4 cursor-pointer hover:bg-white/[0.02] transition-colors group" onClick={() => toggleCat(cat.id_categoria)}>
              <div className="flex items-center gap-4">
                <div className="p-2 bg-white/5 rounded-xl hover:bg-blue-600/20 transition-all border border-white/5" onClick={(e) => { e.stopPropagation(); setModalCat({ open: true, edit: cat }); }}>
                  <Edit2 className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <span className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">{cat.nome}</span>
                  <span className="ml-3 text-[10px] font-bold text-white/20 uppercase tracking-widest">{cat.produto_produto_categoriaTocategoria.length} Itens</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button onClick={(e) => { e.stopPropagation(); setModalProd({ open: true, edit: null, catId: cat.id_categoria, catNome: cat.nome }); }}
                  className="bg-gradient-to-br from-[#FFA500] to-[#E69500] hover:opacity-90 active:scale-95 text-white px-4 py-2 rounded-xl text-[10px] font-bold flex items-center gap-1 border border-white/10">
                  <Plus className="w-3.5 h-3.5" /> PRODUTO
                </button>
                <div className={`transition-transform duration-300 ${expandedCats.has(cat.id_categoria) ? "rotate-180" : ""}`}>
                  <ChevronDown className="w-5 h-5 text-white/20" />
                </div>
              </div>
            </div>

            {/* PRODUTOS */}
            <AnimatePresence>
              {expandedCats.has(cat.id_categoria) && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-white/5 bg-black/20">
                  {cat.produto_produto_categoriaTocategoria.map(prod => (
                    <div key={prod.id_produto} className="border-b border-white/5 last:border-b-0">
                      <div className="flex flex-col md:flex-row items-start md:items-center justify-between px-10 py-6 cursor-pointer hover:bg-white/[0.02] transition-all group/prod" onClick={() => toggleProd(prod.id_produto)}>
                        <div className="flex items-start gap-6">
                          <div className="p-2 bg-white/5 rounded-xl hover:bg-orange-600/20 transition-all mt-1 border border-white/5" onClick={(e) => { e.stopPropagation(); setModalProd({ open: true, edit: prod, catId: cat.id_categoria, catNome: cat.nome }); }}>
                            <Edit2 className="w-4 h-4 text-orange-400" />
                          </div>
                          <div className="w-20 h-20 rounded-2xl overflow-hidden bg-white/5 flex-shrink-0 border border-white/10">
                            {prod.foto ? <img src={prod.foto} alt="" className="w-full h-full object-cover" />
                              : <div className="w-full h-full flex items-center justify-center"><ShoppingBag className="w-8 h-8 text-white/5" /></div>}
                          </div>
                          <div className="space-y-1">
                            <p className="text-lg font-bold text-white/90">
                              Produto: <span className="text-blue-400 font-semibold">{prod.nome}</span>
                            </p>
                            <p className="text-xs text-white/40 leading-relaxed max-w-lg line-clamp-1">{prod.descricao || "Sem descrição disponível."}</p>
                            <div className="flex items-center gap-4 mt-2">
                              <div>
                                <span className="text-[10px] text-white/20 uppercase tracking-widest block mb-0.5">Valor</span>
                                <p className="text-base font-bold text-green-400">R$ {Number(prod.valor_total || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                              </div>
                              <div className="h-6 w-px bg-white/10" />
                              <div>
                                <span className="text-[10px] text-white/20 uppercase tracking-widest block mb-0.5">Visibilidade</span>
                                <span className="text-[10px] font-bold text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded-lg border border-blue-400/20">{prod.visibilidade || "Geral"}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className={`transition-transform duration-300 mr-2 ${expandedProds.has(prod.id_produto) ? "rotate-180" : ""}`}>
                          <ChevronDown className="w-5 h-5 text-white/10" />
                        </div>
                      </div>

                      {/* COMPLEMENTOS */}
                      <AnimatePresence>
                        {expandedProds.has(prod.id_produto) && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden bg-white/[0.01] border-t border-white/5 p-8 pt-4">
                            <div className="flex justify-between items-center mb-6">
                              <h4 className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">Complementos</h4>
                              <button onClick={(e) => { e.stopPropagation(); setModalComp({ open: true, edit: null, prodId: prod.id_produto, prodNome: prod.nome }); }}
                                className="bg-[#4CAF50] hover:opacity-90 text-white px-4 py-2 rounded-xl text-[10px] font-bold flex items-center gap-2 border border-white/10">
                                <Plus className="w-3.5 h-3.5" /> COMPLEMENTO
                              </button>
                            </div>

                            <div className="space-y-6">
                              <div className="grid grid-cols-12 gap-6 text-[9px] font-bold text-white/10 uppercase tracking-widest border-b border-white/5 pb-2">
                                <div className="col-span-5">Tipo</div>
                                <div className="col-span-7">Itens Disponíveis</div>
                              </div>

                              {prod.complemento_tipo_complemento_tipo_produtoToproduto.map(comp => (
                                <div key={comp.id_complemento_tipo} className="grid grid-cols-12 gap-6 items-start">
                                  <div className="col-span-5 flex items-start gap-4">
                                    <div className="p-2 bg-white/5 rounded-xl hover:bg-green-600/20 transition-all border border-white/5" onClick={() => setModalComp({ open: true, edit: comp, prodId: prod.id_produto, prodNome: prod.nome })}>
                                      <Edit2 className="w-3.5 h-3.5 text-green-400" />
                                    </div>
                                    <div>
                                      <p className="font-bold text-white/90 text-sm">{comp.nome}</p>
                                      <div className="flex gap-2 mt-1">
                                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-white/5 text-white/30 border border-white/10 uppercase tracking-tighter">
                                          {Number(comp.quantidade_minima) > 0 ? "Obrigatório" : "Opcional"}
                                        </span>
                                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-white/5 text-white/30 border border-white/10">
                                          {String(comp.quantidade_minima ?? 0)}-{String(comp.quantidade_maxima ?? 10)}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-span-7 space-y-4">
                                    <div className="flex justify-end">
                                      <button onClick={() => setModalItem({ open: true, edit: null, compId: comp.id_complemento_tipo, compNome: comp.nome })}
                                        className="bg-[#795548] hover:opacity-90 text-white px-3 py-1.5 rounded-lg text-[9px] font-bold flex items-center gap-1 border border-white/10 uppercase">
                                        <Plus className="w-3 h-3" /> Adicionar Item
                                      </button>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                      {comp.complemento_item_complemento_item_complemento_tipoTocomplemento_tipo.map(item => (
                                        <div key={item.id_complemento_item} className="flex items-center justify-between bg-white/5 p-3 rounded-2xl border border-white/5 hover:border-white/10 transition-all group/item">
                                          <div className="flex items-center gap-3">
                                            <div className="p-1.5 bg-white/5 rounded-lg opacity-40 group-hover/item:opacity-100 transition-all border border-white/5" onClick={() => setModalItem({ open: true, edit: item, compId: comp.id_complemento_tipo, compNome: comp.nome })}>
                                              <Edit2 className="w-3 h-3 text-amber-500" />
                                            </div>
                                            <div>
                                              <p className="text-xs font-bold text-white/80">{item.nome}</p>
                                              <p className="text-[10px] font-bold text-green-400">R$ {Number(item.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                                            </div>
                                          </div>
                                          <button onClick={() => handleDeleteItem(item.id_complemento_item)} className="p-1.5 text-white/10 hover:text-red-400 transition-colors">
                                            <Trash2 className="w-3.5 h-3.5" />
                                          </button>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              ))}
                              {prod.complemento_tipo_complemento_tipo_produtoToproduto.length === 0 && (
                                <div className="col-span-12 py-10 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[32px]">
                                  <Package className="w-8 h-8 text-white/5 mb-2" />
                                  <p className="text-xs text-white/20 italic">Nenhum complemento cadastrado.</p>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* MODAIS */}
      <ModalCategoria open={modalCat.open} onClose={() => setModalCat({ open: false, edit: null })} onSave={handleSaveCategoria} editData={modalCat.edit} />
      <ModalProduto open={modalProd.open} onClose={() => setModalProd({ open: false, edit: null, catId: "", catNome: "" })} onSave={handleSaveProduto} editData={modalProd.edit} categoriaNome={modalProd.catNome} />
      <ModalComplemento open={modalComp.open} onClose={() => setModalComp({ open: false, edit: null, prodId: "", prodNome: "" })} onSave={handleSaveComplemento} editData={modalComp.edit} produtoNome={modalComp.prodNome} />
      <ModalItem open={modalItem.open} onClose={() => setModalItem({ open: false, edit: null, compId: "", compNome: "" })} onSave={handleSaveItem} editData={modalItem.edit} complementoNome={modalItem.compNome} />
    </div>
  );
}
