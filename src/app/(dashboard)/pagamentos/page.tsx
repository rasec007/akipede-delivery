"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  CreditCard, Plus, Trash2, Loader2, AlertCircle, X, DollarSign, QrCode, CheckCircle2, ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

type FormaPagamento = {
  id_lista_forma_pagamento: string;
  forma_pagamento: string;
  dominio: {
    id_dominio: string;
    nome: string;
    codigo: string;
  };
};

type OpcaoGlobal = {
  id_dominio: string;
  nome: string;
  codigo: string;
};

export default function PagamentosPage() {
  const router = useRouter();
  const [formas, setFormas] = useState<FormaPagamento[]>([]);
  const [opcoesGlobais, setOpcoesGlobais] = useState<OpcaoGlobal[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [resFormas, resOpcoes] = await Promise.all([
        fetch("/api/pagamentos"),
        fetch(`/api/dominios?tipo=${encodeURIComponent("Forma de Pagamento")}`)
      ]);

      if (resFormas.status === 401) return router.push("/auth/login");
      
      const dataFormas = await resFormas.json();
      const dataOpcoes = await resOpcoes.json();

      if (Array.isArray(dataFormas)) setFormas(dataFormas);
      if (Array.isArray(dataOpcoes)) setOpcoesGlobais(dataOpcoes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAdd = async (idDominio: string) => {
    try {
      const res = await fetch("/api/pagamentos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idDominio }),
      });

      if (res.ok) {
        toast.success("Forma de pagamento adicionada!");
        setModalOpen(false);
        fetchData();
      } else {
        const errData = await res.json();
        console.error("Erro API:", errData);
        toast.error(errData.error || "Erro ao adicionar");
      }
    } catch {
      toast.error("Erro de conexão");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Deseja remover esta forma de pagamento?")) return;
    try {
      const res = await fetch(`/api/pagamentos?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Removida com sucesso!");
        fetchData();
      }
    } catch {
      toast.error("Erro ao remover");
    }
  };

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
          <h2 className="text-3xl font-bold text-white">Formas de Pagamento</h2>
          <p className="text-white/40">
            Configure como seus clientes podem pagar pelos pedidos.
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)]"
        >
          <Plus className="w-5 h-5" /> Adicionar Forma
        </button>
      </div>

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {formas.map((forma) => (
            <motion.div
              key={forma.id_lista_forma_pagamento}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass p-5 rounded-3xl border border-white/5 group hover:bg-white/[0.08] transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-blue-400">
                    {(forma.dominio?.codigo?.toLowerCase().includes("pix") || forma.dominio?.nome?.toLowerCase().includes("pix")) ? (
                      <QrCode className="w-6 h-6" />
                    ) : (
                      <CreditCard className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{forma.dominio?.nome || "Forma s/ nome"}</h3>
                    <p className="text-xs text-white/40">Ativo para catálogo</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(forma.id_lista_forma_pagamento)}
                  className="p-2 text-white/10 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              
              {(forma.dominio?.codigo?.toLowerCase().includes("pix") || forma.dominio?.nome?.toLowerCase().includes("pix")) && (
                <div className="mt-4 p-3 rounded-xl bg-blue-500/5 border border-blue-500/10 text-[10px] text-blue-400 font-medium flex items-center gap-2">
                   <AlertCircle className="w-3.5 h-3.5" />
                   Configuração de chave PIX disponível nas configurações da loja.
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {formas.length === 0 && (
          <div className="col-span-full py-20 glass rounded-3xl border-2 border-dashed border-white/5 flex flex-col items-center justify-center">
             <DollarSign className="w-12 h-12 text-white/10 mb-4" />
             <p className="text-white/20">Nenhuma forma de pagamento configurada.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      <ModalPagamento
        open={modalOpen}
        onClose={() => setModalOpen(true)}
        onSave={handleAdd}
        opcoes={opcoesGlobais.filter(opt => !formas.some(f => f.forma_pagamento === opt.id_dominio))}
        closeModal={() => setModalOpen(false)}
      />
    </div>
  );
}

function ModalPagamento({ open, onClose, onSave, opcoes, closeModal }: {
  open: boolean;
  onClose: () => void;
  onSave: (id: string) => void;
  opcoes: OpcaoGlobal[];
  closeModal: () => void;
}) {
  const [selected, setSelected] = useState("");
  const [pixType, setPixType] = useState("");
  const [pixKey, setPixKey] = useState("");

  // Busca a opção selecionada para verificar se é PIX (pelo nome ou código)
  const selectedOpt = opcoes.find(o => o.id_dominio === selected);
  const isPix = !!(selectedOpt?.nome?.toLowerCase().includes("pix") || 
                  selectedOpt?.codigo?.toLowerCase().includes("pix"));

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={closeModal}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-[#0F172A] border border-white/10 rounded-3xl p-8 w-full max-w-md shadow-2xl relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button onClick={closeModal} className="absolute top-4 right-4 text-white/30 hover:text-white">
            <X className="w-5 h-5" />
          </button>

          <h2 className="text-lg font-bold text-white mb-6">Configurar Pagamento</h2>

          <div className="space-y-4">
            <div className="relative">
              <label className="text-xs font-bold text-white/40 uppercase ml-1">Forma de Pagamento</label>
              <div className="relative">
                <select
                  value={selected}
                  onChange={(e) => setSelected(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-sm text-white mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none cursor-pointer pr-10"
                >
                  <option value="" className="bg-[#0F172A]">Selecione uma forma...</option>
                  {opcoes.map((opt) => (
                    <option key={opt.id_dominio} value={opt.id_dominio} className="bg-[#0F172A]">
                      {opt.nome}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 mt-1 pointer-events-none text-white/20">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Campos Condicionais para PIX */}
            <AnimatePresence>
              {isPix && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 pt-2 overflow-hidden"
                >
                  <div className="h-px bg-white/5 w-full my-2" />
                  <div>
                    <label className="text-xs font-bold text-white/40 uppercase ml-1">Tipo de Chave</label>
                    <select 
                      value={pixType}
                      onChange={(e) => setPixType(e.target.value)}
                      className="w-full bg-[#0F172A] border border-white/10 rounded-xl py-3 px-4 text-sm text-white mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    >
                      <option value="">Selecione...</option>
                      <option value="cpf">CPF</option>
                      <option value="cnpj">CNPJ</option>
                      <option value="email">E-mail</option>
                      <option value="phone">Celular</option>
                      <option value="random">Chave Aleatória</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-white/40 uppercase ml-1">Chave PIX</label>
                    <input 
                      type="text"
                      placeholder="Digite sua chave aqui"
                      value={pixKey}
                      onChange={(e) => setPixKey(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              onClick={() => onSave(selected)}
              disabled={!selected || (!!isPix && (!pixType || !pixKey))}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-2xl font-bold mt-4 transition-all shadow-lg shadow-blue-600/20"
            >
              Confirmar e Salvar
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
