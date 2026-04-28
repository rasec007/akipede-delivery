"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, ChevronDown, ChevronRight, Edit2, Trash2, ShoppingBag, Loader2, Package, Layers, Truck, UtensilsCrossed } from "lucide-react";
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

  // ── CRUD Handlers ──
  // Handler centralizado de erros da API
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white">Meus Produtos</h2>
          <p className="text-white/40">Gerencie seu cardápio com categorias, produtos, complementos e itens.</p>
        </div>
        <button onClick={() => setModalCat({ open: true, edit: null })}
          className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)]">
          <Plus className="w-5 h-5" /> Categoria
        </button>
      </div>

      {/* Empty State */}
      {categorias.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 glass rounded-3xl border-2 border-dashed border-white/5">
          <Package className="w-12 h-12 text-white/10 mb-4" />
          <p className="text-white/20">Nenhuma categoria cadastrada. Comece criando uma!</p>
        </div>
      )}

      {/* Accordion Hierárquico */}
      {categorias.map(cat => (
        <div key={cat.id_categoria} className="glass rounded-2xl border border-white/5 overflow-hidden">
          {/* CATEGORIA HEADER */}
          <div className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-white/5 transition-colors" onClick={() => toggleCat(cat.id_categoria)}>
            <div className="flex items-center gap-3">
              {expandedCats.has(cat.id_categoria) ? <ChevronDown className="w-5 h-5 text-blue-400" /> : <ChevronRight className="w-5 h-5 text-white/30" />}
              <Layers className="w-5 h-5 text-blue-400" />
              <span className="text-lg font-bold text-white">{cat.nome}</span>
              <span className="text-xs text-white/30 bg-white/5 px-2 py-0.5 rounded-lg">{cat.produto_produto_categoriaTocategoria.length} produtos</span>
            </div>
            <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
              <button onClick={() => setModalProd({ open: true, edit: null, catId: cat.id_categoria, catNome: cat.nome })}
                className="bg-orange-500 hover:bg-orange-400 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1"><Plus className="w-3.5 h-3.5" /> Produto</button>
              <button onClick={() => setModalCat({ open: true, edit: cat })} className="p-2 text-white/20 hover:text-blue-400"><Edit2 className="w-4 h-4" /></button>
              <button onClick={() => handleDeleteCategoria(cat.id_categoria)} className="p-2 text-white/20 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>

          {/* PRODUTOS */}
          <AnimatePresence>
            {expandedCats.has(cat.id_categoria) && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                {cat.produto_produto_categoriaTocategoria.map(prod => (
                  <div key={prod.id_produto} className="border-t border-white/5">
                    {/* PRODUTO HEADER */}
                    <div className="flex items-center justify-between px-6 py-4 pl-12 cursor-pointer hover:bg-white/[0.03] transition-colors" onClick={() => toggleProd(prod.id_produto)}>
                      <div className="flex items-center gap-4">
                        {expandedProds.has(prod.id_produto) ? <ChevronDown className="w-4 h-4 text-orange-400" /> : <ChevronRight className="w-4 h-4 text-white/20" />}
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-white/5 flex-shrink-0">
                          {prod.foto ? <img src={prod.foto} alt="" className="w-full h-full object-cover" />
                            : <div className="w-full h-full flex items-center justify-center"><ShoppingBag className="w-5 h-5 text-white/10" /></div>}
                        </div>
                        <div>
                          <p className="font-bold text-white">{prod.nome}</p>
                          <p className="text-xs text-white/30">{prod.descricao || "Sem descrição"}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-sm font-bold text-green-400">R$ {Number(prod.valor_total || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                            <div className="flex items-center gap-1">
                              {(prod.visibilidade || "delivery,mesa").includes("delivery") && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-lg bg-blue-500/15 text-blue-400 border border-blue-500/20">
                                  <Truck className="w-3 h-3" /> Delivery
                                </span>
                              )}
                              {(prod.visibilidade || "delivery,mesa").includes("mesa") && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/20">
                                  <UtensilsCrossed className="w-3 h-3" /> Mesa
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                        <button onClick={() => setModalComp({ open: true, edit: null, prodId: prod.id_produto, prodNome: prod.nome })}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1"><Plus className="w-3.5 h-3.5" /> Complemento</button>
                        <button onClick={() => setModalProd({ open: true, edit: prod, catId: cat.id_categoria, catNome: cat.nome })} className="p-2 text-white/20 hover:text-blue-400"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => handleDeleteProduto(prod.id_produto)} className="p-2 text-white/20 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>

                    {/* COMPLEMENTOS */}
                    <AnimatePresence>
                      {expandedProds.has(prod.id_produto) && prod.complemento_tipo_complemento_tipo_produtoToproduto.length > 0 && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden bg-white/[0.02]">
                          <div className="px-6 pl-20 py-3">
                            <p className="text-xs font-bold text-white/30 uppercase mb-3">Complementos</p>
                            <div className="space-y-3">
                              {prod.complemento_tipo_complemento_tipo_produtoToproduto.map(comp => (
                                <div key={comp.id_complemento_tipo} className="bg-white/[0.03] rounded-xl p-4 border border-white/5">
                                  <div className="flex items-center justify-between mb-2">
                                    <div>
                                      <span className="font-bold text-white text-sm">{comp.nome}</span>
                                      <span className="text-xs text-white/30 ml-2">{Number(comp.quantidade_minima) > 0 ? "Obrigatório" : "Opcional"} · Mín: {String(comp.quantidade_minima ?? 0)} - Máx: {String(comp.quantidade_maxima ?? 10)}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <button onClick={() => setModalItem({ open: true, edit: null, compId: comp.id_complemento_tipo, compNome: comp.nome })}
                                        className="bg-amber-700 hover:bg-amber-600 text-white px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1"><Plus className="w-3 h-3" /> Item</button>
                                      <button onClick={() => setModalComp({ open: true, edit: comp, prodId: prod.id_produto, prodNome: prod.nome })} className="p-1.5 text-white/20 hover:text-blue-400"><Edit2 className="w-3.5 h-3.5" /></button>
                                      <button onClick={() => handleDeleteComplemento(comp.id_complemento_tipo)} className="p-1.5 text-white/20 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                                    </div>
                                  </div>
                                  {/* ITENS */}
                                  {comp.complemento_item_complemento_item_complemento_tipoTocomplemento_tipo.length > 0 && (
                                    <div className="mt-2 space-y-1 pl-4 border-l-2 border-white/5">
                                      {comp.complemento_item_complemento_item_complemento_tipoTocomplemento_tipo.map(item => (
                                        <div key={item.id_complemento_item} className="flex items-center justify-between py-1.5">
                                          <div>
                                            <span className="text-sm text-white/70">{item.nome}</span>
                                            {item.valor ? <span className="text-xs text-green-400 ml-2">R$ {Number(item.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span> : null}
                                          </div>
                                          <div className="flex items-center gap-1">
                                            <button onClick={() => setModalItem({ open: true, edit: item, compId: comp.id_complemento_tipo, compNome: comp.nome })} className="p-1 text-white/20 hover:text-blue-400"><Edit2 className="w-3 h-3" /></button>
                                            <button onClick={() => handleDeleteItem(item.id_complemento_item)} className="p-1 text-white/20 hover:text-red-400"><Trash2 className="w-3 h-3" /></button>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
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

      {/* MODAIS */}
      <ModalCategoria open={modalCat.open} onClose={() => setModalCat({ open: false, edit: null })} onSave={handleSaveCategoria} editData={modalCat.edit} />
      <ModalProduto open={modalProd.open} onClose={() => setModalProd({ open: false, edit: null, catId: "", catNome: "" })} onSave={handleSaveProduto} editData={modalProd.edit} categoriaNome={modalProd.catNome} />
      <ModalComplemento open={modalComp.open} onClose={() => setModalComp({ open: false, edit: null, prodId: "", prodNome: "" })} onSave={handleSaveComplemento} editData={modalComp.edit} produtoNome={modalComp.prodNome} />
      <ModalItem open={modalItem.open} onClose={() => setModalItem({ open: false, edit: null, compId: "", compNome: "" })} onSave={handleSaveItem} editData={modalItem.edit} complementoNome={modalItem.compNome} />
    </div>
  );
}
