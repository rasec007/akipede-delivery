"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Ticket, Plus, Trash2, Loader2, Search, Filter, Edit3, X, CheckCircle2, ChevronDown, AlertCircle, Percent, DollarSign, Calendar, Hash
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

type Cupom = {
  id_cupom: string;
  titulo: string;
  descricao: string;
  desconto: number;
  tipo_cupom: string;
  quantidade?: number;
  validade?: string;
  dominio: {
    id_dominio: string;
    nome: string;
  };
};

type TipoCupom = {
  id_dominio: string;
  nome: string;
};

export default function CuponsPage() {
  const router = useRouter();
  const [cupons, setCupons] = useState<Cupom[]>([]);
  const [tiposCupom, setTiposCupom] = useState<TipoCupom[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState<Cupom | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = useCallback(async () => {
    try {
      const [resCupons, resTipos] = await Promise.all([
        fetch("/api/cupons"),
        fetch(`/api/dominios?tipo=${encodeURIComponent("Tipo de Cupom")}`)
      ]);

      if (resCupons.status === 401) return router.push("/auth/login");
      
      const dataCupons = await resCupons.json();
      const dataTipos = await resTipos.json();

      if (Array.isArray(dataCupons)) setCupons(dataCupons);
      if (Array.isArray(dataTipos)) setTiposCupom(dataTipos);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async (id: string) => {
    if (!confirm("Deseja excluir este cupom?")) return;
    try {
      const res = await fetch(`/api/cupons?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Cupom removido!");
        fetchData();
      }
    } catch {
      toast.error("Erro ao remover");
    }
  };

  const filteredCupons = cupons.filter(c => 
    c.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.descricao?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white">Meus Cupons</h2>
          <p className="text-white/40">Crie e gerencie campanhas de desconto.</p>
        </div>
        <button
          onClick={() => { setEditData(null); setModalOpen(true); }}
          className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)]"
        >
          <Plus className="w-5 h-5" /> Novo Cupom
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center glass p-4 rounded-2xl border border-white/5">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
          <input
            type="text"
            placeholder="Buscar por nome ou descrição..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-12 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>
      </div>

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredCupons.map((cupom) => (
            <motion.div
              key={cupom.id_cupom}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass p-6 rounded-3xl border border-white/5 relative overflow-hidden group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                  <Ticket className="w-6 h-6" />
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => { setEditData(cupom); setModalOpen(true); }}
                    className="p-2 bg-white/5 hover:bg-blue-500/20 text-white/40 hover:text-blue-400 rounded-xl transition-all"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(cupom.id_cupom)}
                    className="p-2 bg-white/5 hover:bg-red-500/20 text-white/40 hover:text-red-400 rounded-xl transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white mb-1">{cupom.titulo}</h3>
                <p className="text-xs text-white/40 line-clamp-2 mb-2">{cupom.descricao || "Sem descrição"}</p>
                
                <div className="flex flex-wrap gap-3 mt-2">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-white/30 uppercase tracking-wider bg-white/5 px-2 py-1 rounded-lg">
                    <Hash className="w-3 h-3" />
                    {cupom.quantidade ? `${cupom.quantidade} UN` : "Ilimitado"}
                  </div>
                  {cupom.validade && (
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-white/30 uppercase tracking-wider bg-white/5 px-2 py-1 rounded-lg">
                      <Calendar className="w-3 h-3" />
                      {new Date(cupom.validade).toLocaleString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div className="flex flex-col">
                  <span className="text-[10px] text-white/20 uppercase font-bold tracking-wider">Desconto</span>
                  <span className="text-xl font-black text-blue-400">
                    {cupom.dominio?.nome === "Porcentagem" ? `${cupom.desconto}%` : `R$ ${cupom.desconto}`}
                  </span>
                </div>
                <div className="bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                  <span className="text-[10px] font-bold text-white/60">{cupom.dominio?.nome}</span>
                </div>
              </div>

              {/* Decoração de "Cupom" */}
              <div className="absolute -right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-[#0F172A] rounded-full border border-white/5" />
              <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-[#0F172A] rounded-full border border-white/5" />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <ModalCupom
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={() => { setModalOpen(false); fetchData(); }}
        tipos={tiposCupom}
        editData={editData}
      />
    </div>
  );
}

function ModalCupom({ open, onClose, onSave, tipos, editData }: {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  tipos: TipoCupom[];
  editData: any | null;
}) {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [desconto, setDesconto] = useState("");
  const [idTipo, setIdTipo] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [validade, setValidade] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editData) {
      setTitulo(editData.titulo || "");
      setDescricao(editData.descricao || "");
      setDesconto(editData.desconto.toString());
      setIdTipo(editData.tipo_cupom || "");
      setQuantidade(editData.quantidade?.toString() || "");
      setValidade(editData.validade ? new Date(editData.validade).toISOString().slice(0, 16) : "");
    } else {
      setTitulo("");
      setDescricao("");
      setDesconto("");
      setIdTipo("");
      setQuantidade("");
      setValidade("");
    }
  }, [editData, open]);

  const handleConfirm = async () => {
    if (!titulo || !desconto || !idTipo) return toast.error("Preencha os campos obrigatórios");
    
    setLoading(true);
    try {
      const url = "/api/cupons";
      const method = editData ? "PUT" : "POST";
      const body = {
        id: editData?.id_cupom,
        titulo,
        descricao,
        desconto: Number(desconto),
        idTipoCupom: idTipo,
        quantidade: quantidade ? Number(quantidade) : null,
        validade: validade || null
      };

      console.log("Enviando Cupom:", { method, body });

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        toast.success(editData ? "Cupom atualizado!" : "Cupom criado!");
        onSave();
      } else {
        const err = await res.json();
        toast.error(err.error || "Erro ao salvar cupom");
      }
    } catch {
      toast.error("Erro de conexão");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#0F172A] border border-white/10 rounded-[2rem] p-8 w-full max-w-lg shadow-2xl relative my-8"
      >
        <button onClick={onClose} className="absolute top-6 right-6 text-white/30 hover:text-white">
          <X className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-blue-600/20 flex items-center justify-center text-blue-500">
            <Ticket className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{editData ? "Editar Cupom" : "Novo Cupom"}</h2>
            <p className="text-white/40 text-sm">Configure as regras do desconto.</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Título */}
            <div className="md:col-span-12">
              <label className="text-xs font-bold text-white/40 uppercase ml-1">Título do Cupom (Código)</label>
              <input
                type="text"
                placeholder="Ex: BEMVINDO10"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value.toUpperCase())}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              />
            </div>

            {/* Descrição */}
            <div className="md:col-span-12">
              <label className="text-xs font-bold text-white/40 uppercase ml-1">Descrição</label>
              <textarea
                placeholder="Ex: Desconto para primeira compra"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                rows={2}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none"
              />
            </div>

            {/* Tipo de Desconto */}
            <div className="md:col-span-6">
              <label className="text-xs font-bold text-white/40 uppercase ml-1">Tipo de Desconto</label>
              <div className="relative">
                <select
                  value={idTipo}
                  onChange={(e) => setIdTipo(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none cursor-pointer pr-12"
                >
                  <option value="" className="bg-[#0F172A]">Selecione...</option>
                  {tipos.map((t) => (
                    <option key={t.id_dominio} value={t.id_dominio} className="bg-[#0F172A]">{t.nome}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 mt-1 w-5 h-5 text-white/20 pointer-events-none" />
              </div>
            </div>

            {/* Valor do Desconto */}
            <div className="md:col-span-6">
              <label className="text-xs font-bold text-white/40 uppercase ml-1">Valor do Desconto</label>
              <div className="relative mt-2">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-white/40 font-bold">
                  {tipos.find(t => t.id_dominio === idTipo)?.nome === "Porcentagem" ? <Percent className="w-4 h-4" /> : <DollarSign className="w-4 h-4" />}
                </div>
                <input
                  type="number"
                  placeholder="0,00"
                  value={desconto}
                  onChange={(e) => setDesconto(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                />
              </div>
            </div>

            {/* Quantidade (4 colunas) */}
            <div className="md:col-span-4">
              <label className="text-xs font-bold text-white/40 uppercase ml-1">Qtd. Disponível</label>
              <div className="relative mt-2">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-white/40 font-bold">
                  <Hash className="w-4 h-4" />
                </div>
                <input
                  type="number"
                  placeholder="Ilimitado"
                  value={quantidade}
                  onChange={(e) => setQuantidade(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                />
              </div>
            </div>

            {/* Validade (8 colunas) */}
            <div className="md:col-span-8">
              <label className="text-xs font-bold text-white/40 uppercase ml-1">Data/Hora de Validade</label>
              <div className="relative mt-2">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-white/40 font-bold">
                  <Calendar className="w-4 h-4" />
                </div>
                <input
                  type="datetime-local"
                  value={validade}
                  onChange={(e) => setValidade(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all [color-scheme:dark]"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              onClick={onClose}
              className="flex-1 bg-white/5 hover:bg-white/10 text-white py-4 rounded-2xl font-bold transition-all text-sm md:text-base"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              disabled={loading}
              className="flex-[2] bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-2xl font-bold transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2 text-sm md:text-base"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
              {editData ? "Salvar" : "Criar Cupom"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
