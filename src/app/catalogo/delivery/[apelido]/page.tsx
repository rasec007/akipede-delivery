"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { ShoppingBasket, Search, Plus, Minus, X, Loader2, ShoppingBag, Clock, ChevronDown, ChevronUp, Trash2, ArrowRight, Edit3 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { useRealtime } from "@/client/hooks/useRealtime";
import Cookies from "js-cookie";

type ItemType = { id_complemento_item: string; nome: string; descricao?: string; valor?: number };
type ComplementoType = { id_complemento_tipo: string; nome: string; quantidade_minima?: number; quantidade_maxima?: number; complemento_item_complemento_item_complemento_tipoTocomplemento_tipo: ItemType[] };
type ProdutoType = { id_produto: string; nome: string; descricao?: string; valor_total?: number; foto?: string; visibilidade?: string; complemento_tipo_complemento_tipo_produtoToproduto: ComplementoType[] };
type CategoriaType = { id_categoria: string; nome: string; produto_produto_categoriaTocategoria: ProdutoType[] };

const getButtonText = (prod: ProdutoType) => {
  const valTotal = Number(prod.valor_total) || 0;
  if (valTotal > 0) return `R$ ${valTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  
  let minVal = Infinity;
  let hasItems = false;
  
  if (prod.complemento_tipo_complemento_tipo_produtoToproduto) {
    for (const comp of prod.complemento_tipo_complemento_tipo_produtoToproduto) {
      if (comp.complemento_item_complemento_item_complemento_tipoTocomplemento_tipo) {
        for (const item of comp.complemento_item_complemento_item_complemento_tipoTocomplemento_tipo) {
          const v = Number(item.valor) || 0;
          if (v < minVal) {
            minVal = v;
            hasItems = true;
          }
        }
      }
    }
  }
  
  if (hasItems && minVal !== Infinity) {
    return `A partir de R$ ${minVal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  }
  
  return "Montar Pedido";
};

export default function CatalogoDeliveryPage() {
  const params = useParams();
  const router = useRouter();
  const apelido = params.apelido as string;
  
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProd, setSelectedProd] = useState<ProdutoType | null>(null);
  const [cart, setCart] = useState<any[]>([]);
  const [expandedCats, setExpandedCats] = useState<Record<string, boolean>>({});
  const [showHorariosModal, setShowHorariosModal] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [editingCartItem, setEditingCartItem] = useState<string | null>(null); // id_unico do item sendo editado

  // Estados para o Modal de Detalhes
  const [selectedItems, setSelectedItems] = useState<Record<string, number>>({}); // id_item -> quantidade
  const [observation, setObservation] = useState("");
  const [mainQuantity, setMainQuantity] = useState(1);

  // Resetar estados quando abrir novo produto (exceto se for edição)
  useEffect(() => {
    if (selectedProd && !editingCartItem) {
      setSelectedItems({});
      setObservation("");
      setMainQuantity(1);
    }
  }, [selectedProd, editingCartItem]);

  // Carregar carrinho dos cookies ao iniciar
  useEffect(() => {
    const savedCart = Cookies.get(`cart_${apelido}`);
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Erro ao carregar carrinho:", e);
      }
    }
  }, [apelido]);

  // Salvar carrinho nos cookies sempre que mudar
  useEffect(() => {
    if (cart.length > 0) {
      Cookies.set(`cart_${apelido}`, JSON.stringify(cart), { expires: 7 }); // Expira em 7 dias
    } else {
      Cookies.remove(`cart_${apelido}`);
    }
  }, [cart, apelido]);

  const toggleCat = (id: string) => setExpandedCats(prev => ({ ...prev, [id]: !prev[id] }));

  // Funções para manipular seleção de itens dentro do modal
  const handleItemQuantity = (itemId: string, comp: ComplementoType, delta: number) => {
    const currentQty = selectedItems[itemId] || 0;
    const newQty = Math.max(0, currentQty + delta);

    // Se estiver diminuindo, ok. Se estiver aumentando, verificar limite máximo do grupo (Sabor/Complemento)
    if (delta > 0) {
      const groupItems = comp.complemento_item_complemento_item_complemento_tipoTocomplemento_tipo.map(i => i.id_complemento_item);
      const groupTotalQty = Object.entries(selectedItems)
        .filter(([id]) => groupItems.includes(id))
        .reduce((sum, [, qty]) => sum + qty, 0);

      if (groupTotalQty >= (comp.quantidade_maxima || 99)) {
        toast.error(`Limite de ${comp.quantidade_maxima} itens atingido para ${comp.nome}`);
        return;
      }
    }

    setSelectedItems(prev => {
      const next = { ...prev };
      if (newQty === 0) delete next[itemId];
      else next[itemId] = newQty;
      return next;
    });
  };

  // Calcular valor total do item selecionado (Produto base + Complementos selecionados)
  const calculateModalTotal = () => {
    if (!selectedProd) return 0;
    const baseValue = Number(selectedProd.valor_total) || 0;
    
    let itemsValue = 0;
    selectedProd.complemento_tipo_complemento_tipo_produtoToproduto.forEach(comp => {
      comp.complemento_item_complemento_item_complemento_tipoTocomplemento_tipo.forEach(item => {
        const qty = selectedItems[item.id_complemento_item] || 0;
        itemsValue += (Number(item.valor) || 0) * qty;
      });
    });

    return (baseValue + itemsValue) * mainQuantity;
  };

  const addToCart = () => {
    if (!selectedProd) return;

    // Validar se todos os itens obrigatórios foram selecionados
    for (const comp of selectedProd.complemento_tipo_complemento_tipo_produtoToproduto) {
      const min = Number(comp.quantidade_minima) || 0;
      if (min > 0) {
        const groupItems = comp.complemento_item_complemento_item_complemento_tipoTocomplemento_tipo.map(i => i.id_complemento_item);
        const groupTotalQty = Object.entries(selectedItems)
          .filter(([id]) => groupItems.includes(id))
          .reduce((sum, [, qty]) => sum + qty, 0);

        if (groupTotalQty < min) {
          toast.error(`Por favor, selecione pelo menos ${min} itens em "${comp.nome}"`);
          return;
        }
      }
    }

    if (editingCartItem) {
      // Atualizar item existente
      setCart(prev => prev.map(item => {
        if (item.id_unico === editingCartItem) {
          return {
            ...item,
            quantidade: mainQuantity,
            valor_unitario: calculateModalTotal() / mainQuantity,
            valor_total: calculateModalTotal(),
            observacao: observation,
            itens: Object.entries(selectedItems).map(([id, qty]) => {
              let itemInfo: any = null;
              selectedProd.complemento_tipo_complemento_tipo_produtoToproduto.forEach(c => {
                const found = c.complemento_item_complemento_item_complemento_tipoTocomplemento_tipo.find(i => i.id_complemento_item === id);
                if (found) itemInfo = { ...found, tipo_id: c.id_complemento_tipo };
              });
              return {
                id_item: id,
                id_tipo: itemInfo?.tipo_id,
                nome: itemInfo?.nome,
                quantidade: qty,
                valor: itemInfo?.valor
              };
            })
          };
        }
        return item;
      }));
      setEditingCartItem(null);
      setShowCart(true); // Volta para o detalhamento do pedido
      toast.success("Item atualizado!", { icon: '🔄' });
    } else {
      // Adicionar novo item
      const cartItem = {
        id_unico: Math.random().toString(36).substr(2, 9),
        produto_id: selectedProd.id_produto,
        nome: selectedProd.nome,
        quantidade: mainQuantity,
        valor_unitario: calculateModalTotal() / mainQuantity,
        valor_total: calculateModalTotal(),
        observacao: observation,
        itens: Object.entries(selectedItems).map(([id, qty]) => {
          let itemInfo: any = null;
          selectedProd.complemento_tipo_complemento_tipo_produtoToproduto.forEach(c => {
            const found = c.complemento_item_complemento_item_complemento_tipoTocomplemento_tipo.find(i => i.id_complemento_item === id);
            if (found) itemInfo = { ...found, tipo_id: c.id_complemento_tipo };
          });
          return {
            id_item: id,
            id_tipo: itemInfo?.tipo_id,
            nome: itemInfo?.nome,
            quantidade: qty,
            valor: itemInfo?.valor
          };
        })
      };
      setCart(prev => [...prev, cartItem]);
      toast.success(`${selectedProd.nome} adicionado ao carrinho!`, {
        icon: '🛒',
        style: {
          borderRadius: '20px',
          background: '#333',
          color: '#fff',
          fontWeight: 'bold'
        }
      });
    }

    setSelectedProd(null);
  };

  const handleEditCartItem = (id_unico: string) => {
    const item = cart.find(i => i.id_unico === id_unico);
    if (!item) return;

    // Achar o produto original no data.categorias
    let originalProd: ProdutoType | null = null;
    for (const cat of data.categorias) {
      const p = cat.produto_produto_categoriaTocategoria.find((p: any) => p.id_produto === item.produto_id);
      if (p) {
        originalProd = p;
        break;
      }
    }

    if (originalProd) {
      // Preencher estados do modal
      const itemsMap: Record<string, number> = {};
      item.itens.forEach((i: any) => {
        itemsMap[i.id_item] = i.quantidade;
      });

      setEditingCartItem(id_unico);
      setSelectedItems(itemsMap);
      setObservation(item.observacao);
      setMainQuantity(item.quantidade);
      setSelectedProd(originalProd);
      setShowCart(false); // Fecha o carrinho para abrir o modal do produto
    }
  };

  const removeFromCart = (id_unico: string) => {
    setCart(prev => prev.filter(item => item.id_unico !== id_unico));
    toast.success("Item removido do carrinho", { icon: '🗑️' });
  };

  const updateCartItemQty = (id_unico: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id_unico === id_unico) {
        const newQty = Math.max(1, item.quantidade + delta);
        return { ...item, quantidade: newQty, valor_total: item.valor_unitario * newQty };
      }
      return item;
    }));
  };

  const calculateCartTotal = () => cart.reduce((sum, item) => sum + item.valor_total, 0);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`/api/catalogo/publico/${apelido}?tipo=delivery&t=${Date.now()}`, {
        cache: 'no-store'
      });
      const result = await res.json();
      if (res.ok) setData(result);
    } catch (err) {
      console.error("Erro ao carregar catálogo:", err);
    } finally {
      setLoading(false);
    }
  }, [apelido]);

  useEffect(() => { if (apelido) fetchData(); }, [apelido, fetchData]);

  // Atualização em tempo real (Pusher)
  const tenantId = data?.estabelecimento?.id_estabelecimento;
  useRealtime(
    tenantId ? `catalog-${tenantId}` : "",
    "catalog-updated",
    () => {
      // Re-fetch silencioso (sem recarregar o loading = true principal)
      if (apelido) fetchData();
    }
  );

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

  // Sincroniza o modal aberto se o produto for atualizado em tempo real
  useEffect(() => {
    if (selectedProd && data?.categorias) {
      for (const cat of data.categorias) {
        const prod = cat.produto_produto_categoriaTocategoria.find((p: any) => p.id_produto === selectedProd.id_produto);
        if (prod) {
          // Apenas atualiza o estado se houver alguma diferença que valha a re-renderização
          // Uma checagem simples de stringify funciona bem aqui pois é ativado poucas vezes
          if (JSON.stringify(prod) !== JSON.stringify(selectedProd)) {
            setSelectedProd(prod);
          }
          break;
        }
      }
    }
  }, [data, selectedProd]);

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
            <div 
              onClick={() => cart.length > 0 && setShowCart(true)}
              className={`relative cursor-pointer transition-all duration-500 active:scale-90 ${cart.length > 0 ? "scale-110" : "hover:scale-105"}`}
            >
              {cart.length > 0 ? (
                <div className="bg-white/20 p-2.5 rounded-2xl backdrop-blur-md border border-white/30 animate-in zoom-in-50 duration-300">
                  <ShoppingBasket className="w-9 h-9 text-white fill-white/20" />
                </div>
              ) : (
                <ShoppingBasket className="w-9 h-9 text-white/40" />
              )}
              
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-[#f45145] text-[11px] font-black w-6 h-6 rounded-full flex items-center justify-center shadow-2xl border-2 border-[#f45145] animate-bounce">
                  {cart.reduce((sum, item) => sum + item.quantidade, 0)}
                </span>
              )}
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
                                {getButtonText(prod)}
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

              <div className="overflow-y-auto flex-1 custom-scrollbar">
                <div className="h-64 sm:h-72 relative">
                  {selectedProd.foto ? (
                    <img src={selectedProd.foto} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-50 flex items-center justify-center"><ShoppingBag className="w-16 h-16 text-gray-200" /></div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-white/5 to-transparent" />
                </div>

                <div className="px-6 sm:px-10 -mt-10 relative z-10 space-y-6">
                  <div className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100">
                    <h3 className="text-2xl sm:text-3xl font-black text-gray-800 tracking-tight">{selectedProd.nome}</h3>
                    <p className="text-sm text-gray-400 mt-2 font-medium leading-relaxed">{selectedProd.descricao || "Preparado com os melhores ingredientes da casa."}</p>
                    <div className="flex items-center gap-2 mt-4">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">A partir de</span>
                      <p className="text-xl font-black text-[#f45145]">
                        R$ {Number(selectedProd.valor_total || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>

                  {/* COMPLEMENTOS */}
                  {selectedProd.complemento_tipo_complemento_tipo_produtoToproduto.map(comp => {
                    const groupItems = comp.complemento_item_complemento_item_complemento_tipoTocomplemento_tipo.map(i => i.id_complemento_item);
                    const groupTotalQty = Object.entries(selectedItems)
                      .filter(([id]) => groupItems.includes(id))
                      .reduce((sum, [, qty]) => sum + qty, 0);

                    return (
                      <div key={comp.id_complemento_tipo} className="space-y-3">
                        <div className="px-4 py-1 flex justify-between items-center">
                          <div>
                            <p className="font-black text-gray-800 text-sm uppercase tracking-tight">{comp.nome}</p>
                            <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-0.5 font-bold">
                              Escolha {comp.quantidade_minima || 0} a {comp.quantidade_maxima || 10} opções
                            </p>
                          </div>
                          <div className="flex gap-2">
                             <span className="bg-gray-100 text-gray-500 text-[10px] px-2.5 py-1 rounded-lg font-black tracking-tighter uppercase italic">
                               {groupTotalQty}/{comp.quantidade_maxima}
                             </span>
                             {Number(comp.quantidade_minima) > 0 && (
                               <span className="bg-[#f45145]/10 text-[#f45145] text-[9px] px-2.5 py-1 rounded-lg font-black uppercase tracking-widest">
                                 Obrigatório
                               </span>
                             )}
                          </div>
                        </div>

                        <div className="space-y-1">
                          {comp.complemento_item_complemento_item_complemento_tipoTocomplemento_tipo.map(item => {
                            const qty = selectedItems[item.id_complemento_item] || 0;
                            return (
                              <div key={item.id_complemento_item} className="flex items-center justify-between p-5 rounded-3xl border border-gray-50 hover:bg-gray-50/30 transition-all">
                                <div className="flex-1 pr-4">
                                  <p className="font-bold text-gray-700 text-sm">{item.nome}</p>
                                  {Number(item.valor) > 0 && (
                                    <p className="text-xs text-blue-600 font-black mt-0.5">+ R$ {Number(item.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                                  )}
                                </div>
                                <div className="flex items-center gap-3 bg-white rounded-2xl p-1 shadow-sm border border-gray-100">
                                   <button 
                                     onClick={() => handleItemQuantity(item.id_complemento_item, comp, -1)}
                                     className={`p-2 rounded-xl transition-all active:scale-90 ${qty > 0 ? "bg-red-50 text-red-500 hover:bg-red-100" : "bg-gray-100 text-gray-400"}`}
                                   >
                                     <Minus className="w-4 h-4" />
                                   </button>
                                   <span className={`text-sm font-black w-4 text-center ${qty > 0 ? "text-gray-800" : "text-gray-300"}`}>{qty}</span>
                                   <button 
                                     onClick={() => handleItemQuantity(item.id_complemento_item, comp, 1)}
                                     className="p-2 bg-blue-50 rounded-xl text-blue-600 hover:bg-blue-100 transition-all active:scale-90 shadow-sm"
                                   >
                                     <Plus className="w-4 h-4" />
                                   </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}

                  {/* OBSERVAÇÃO */}
                  <div className="pt-2 space-y-3">
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-4">Alguma observação?</h4>
                    <textarea 
                      placeholder="Ex: Sem cebola, retirar tomate..." 
                      className="w-full bg-gray-50 border border-gray-100 rounded-[32px] p-6 text-sm focus:outline-none focus:ring-4 focus:ring-[#f45145]/5 min-h-[100px] transition-all resize-none"
                      value={observation}
                      onChange={(e) => setObservation(e.target.value)}
                    />
                  </div>

                  {/* BOTAO ADICIONAR (DENTRO DO SCROLL, POR ÚLTIMO) */}
                  <div className="pt-6 pb-16 space-y-4">
                    <div className="flex items-center justify-between bg-gray-50 p-5 rounded-[32px] border border-gray-100">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-3">Quantidade</span>
                      <div className="flex items-center gap-6 bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100">
                        <button onClick={() => setMainQuantity(q => Math.max(1, q - 1))} className="text-gray-400 hover:text-red-500 active:scale-90 transition-all"><Minus className="w-5 h-5" /></button>
                        <span className="text-xl font-black w-6 text-center text-gray-800">{mainQuantity}</span>
                        <button onClick={() => setMainQuantity(q => q + 1)} className="text-blue-600 hover:scale-110 active:scale-90 transition-all"><Plus className="w-5 h-5" /></button>
                      </div>
                    </div>

                    <button 
                      onClick={addToCart}
                      className="w-full bg-[#f45145] hover:bg-[#d43f35] text-white font-black py-6 rounded-[32px] shadow-xl shadow-[#f45145]/20 flex justify-between px-10 items-center transition-all hover:scale-[1.01] active:scale-95 group border-b-4 border-black/10"
                    >
                      <span className="flex items-center gap-3 tracking-wide text-lg">{editingCartItem ? "ATUALIZAR ITEM" : "ADICIONAR"}</span>
                      <span className="text-xl font-bold border-l border-white/20 pl-8">
                        R$ {calculateModalTotal().toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </button>
                  </div>
                </div>
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

      {/* MODAL CARRINHO (FIG 32) */}
      <AnimatePresence>
        {showCart && (
          <div className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowCart(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            
            <motion.div 
              initial={{ y: "100%" }} 
              animate={{ y: 0 }} 
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-2xl bg-white rounded-t-[40px] sm:rounded-[40px] overflow-hidden shadow-2xl flex flex-col max-h-[90vh] z-10"
            >
              {/* HEADER DO CESTO */}
              <div className="bg-[#f45145] p-6 text-white relative">
                <button onClick={() => setShowCart(false)} className="absolute top-6 left-6 bg-white/20 p-2 rounded-2xl hover:bg-white/30 transition-all active:scale-90">
                  <X className="w-5 h-5" />
                </button>
                <div className="text-center">
                  <h3 className="font-black text-xl uppercase tracking-widest">Meu Pedido</h3>
                  <p className="text-[10px] font-bold opacity-70 uppercase tracking-tighter mt-1">Você tem {cart.length} item(s) no carrinho</p>
                </div>
              </div>

              {/* LISTA DE PRODUTOS NO CESTO */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                {cart.map((item) => (
                  <div key={item.id_unico} className="bg-gray-50/50 rounded-[32px] p-5 border border-gray-100/50 space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-black text-gray-800 text-lg leading-tight uppercase">{item.nome}</h4>
                        {item.itens.length > 0 && (
                          <p className="text-[10px] text-gray-400 font-bold mt-1 leading-relaxed">
                            {item.itens.map((i: any) => `${i.quantidade}x ${i.nome}`).join(", ")}
                          </p>
                        )}
                        {item.observacao && (
                          <div className="mt-3 bg-white/50 p-3 rounded-2xl border border-dashed border-gray-200">
                             <p className="text-[10px] text-gray-500 font-medium italic">Obs: {item.observacao}</p>
                          </div>
                        )}
                      </div>
                      <div className="text-right ml-4 flex flex-col items-end">
                         <p className="font-black text-[#f45145] text-lg">R$ {item.valor_total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                         <div className="flex gap-1 mt-2">
                            <button onClick={() => handleEditCartItem(item.id_unico)} className="text-blue-500 hover:bg-blue-50 transition-colors p-2 rounded-xl">
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button onClick={() => removeFromCart(item.id_unico)} className="text-gray-300 hover:text-red-500 transition-colors p-2 rounded-xl">
                              <Trash2 className="w-4 h-4" />
                            </button>
                         </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Quantidade</span>
                      <div className="flex items-center gap-5 bg-white px-4 py-2 rounded-2xl shadow-sm border border-gray-100">
                        <button onClick={() => updateCartItemQty(item.id_unico, -1)} className="text-gray-400 hover:text-red-500 transition-all"><Minus className="w-4 h-4" /></button>
                        <span className="text-sm font-black w-4 text-center text-gray-700">{item.quantidade}</span>
                        <button onClick={() => updateCartItemQty(item.id_unico, 1)} className="text-blue-600 hover:scale-110 transition-all"><Plus className="w-4 h-4" /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* RODAPÉ DO CESTO - TOTAL E FINALIZAR */}
              <div className="p-8 bg-gray-50 border-t border-gray-100 space-y-6">
                <div className="flex justify-between items-center px-4">
                  <span className="text-sm font-black text-gray-400 uppercase tracking-[0.2em]">Total do Pedido</span>
                  <span className="text-3xl font-black text-gray-800">
                    R$ {calculateCartTotal().toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <button 
                  onClick={() => router.push(`/catalogo/delivery/${apelido}/checkout`)}
                  className="w-full bg-[#f45145] hover:bg-[#d43f35] text-white font-black py-6 rounded-[32px] shadow-2xl shadow-[#f45145]/30 flex justify-between px-10 items-center transition-all hover:scale-[1.02] active:scale-95 group border-b-4 border-black/10"
                >
                  <span className="text-lg tracking-widest uppercase italic">FECHAR PEDIDO</span>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </button>
                
                <button 
                  onClick={() => setShowCart(false)}
                  className="w-full text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] hover:text-gray-600 transition-colors py-2"
                >
                  Continuar Comprando
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>

  );
}
