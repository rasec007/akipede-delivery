"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { 
  Bike, Plus, Trash2, Loader2, Search, Edit3, X, CheckCircle2, User, Phone, Mail, Fingerprint, Lock, Camera
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { maskCPFOrCNPJ, maskPhone, unmask } from "@/client/utils/masks";

type Entregador = {
  id_usuario: string;
  nome: string;
  cpf_cnpj?: string;
  celular?: string;
  email?: string;
  apelido?: string;
};

export default function EntregadoresPage() {
  const router = useRouter();
  const [entregadores, setEntregadores] = useState<Entregador[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState<Entregador | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/entregadores");
      if (res.status === 401) return router.push("/auth/login");
      const data = await res.json();
      if (Array.isArray(data)) setEntregadores(data);
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
    if (!confirm("Deseja remover este entregador?")) return;
    try {
      const res = await fetch(`/api/entregadores?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Entregador removido!");
        fetchData();
      }
    } catch {
      toast.error("Erro ao remover");
    }
  };

  const filtered = entregadores.filter(e => 
    e.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.apelido?.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h2 className="text-3xl font-bold text-white">Entregadores</h2>
          <p className="text-white/40">Gerencie sua equipe de entregas.</p>
        </div>
        <button
          onClick={() => { setEditData(null); setModalOpen(true); }}
          className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)]"
        >
          <Plus className="w-5 h-5" /> Novo Entregador
        </button>
      </div>

      {/* Search */}
      <div className="flex gap-4 items-center glass p-4 rounded-2xl border border-white/5">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
          <input
            type="text"
            placeholder="Buscar por nome ou apelido..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-12 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filtered.map((entregador) => (
            <motion.div
              key={entregador.id_usuario}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass p-6 rounded-3xl border border-white/5 relative group hover:border-blue-500/30 transition-all"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 overflow-hidden border border-white/5">
                  {entregador.foto ? (
                    <img src={entregador.foto} alt={entregador.nome} className="w-full h-full object-cover" />
                  ) : (
                    <Bike className="w-7 h-7" />
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => { setEditData(entregador); setModalOpen(true); }}
                    className="p-2 bg-white/5 hover:bg-blue-500/20 text-white/40 hover:text-blue-400 rounded-xl transition-all"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(entregador.id_usuario)}
                    className="p-2 bg-white/5 hover:bg-red-500/20 text-white/40 hover:text-red-400 rounded-xl transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <h3 className="text-xl font-bold text-white leading-tight">{entregador.nome}</h3>
                  {entregador.apelido && <p className="text-sm text-blue-400/60 font-medium">@{entregador.apelido}</p>}
                </div>
                
                <div className="pt-4 space-y-2">
                  {entregador.celular && (
                    <div className="flex items-center gap-2 text-xs text-white/40">
                      <Phone className="w-3 h-3" /> {entregador.celular}
                    </div>
                  )}
                  {entregador.email && (
                    <div className="flex items-center gap-2 text-xs text-white/40">
                      <Mail className="w-3 h-3" /> {entregador.email}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <ModalEntregador
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={() => { setModalOpen(false); fetchData(); }}
        editData={editData}
      />
    </div>
  );
}

function ModalEntregador({ open, onClose, onSave, editData }: {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  editData: Entregador | null;
}) {
  const [nome, setNome] = useState("");
  const [apelido, setApelido] = useState("");
  const [cpf, setCpf] = useState("");
  const [celular, setCelular] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [foto, setFoto] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (editData) {
      setNome(editData.nome || "");
      setApelido(editData.apelido || "");
      setCpf(editData.cpf_cnpj || "");
      setCelular(editData.celular || "");
      setEmail(editData.email || "");
      setFoto(editData.foto || "");
      setSenha("");
    } else {
      setNome("");
      setApelido("");
      setCpf("");
      setCelular("");
      setEmail("");
      setFoto("");
      setSenha("");
    }
  }, [editData, open]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      
      const data = await res.json();
      if (data.url) setFoto(data.url);
    } catch {
      toast.error("Erro no upload");
    } finally {
      setUploading(false);
    }
  };

  const handleConfirm = async () => {
    if (!nome) return toast.error("Nome é obrigatório");
    
    setLoading(true);
    try {
      const url = "/api/entregadores";
      const method = editData ? "PUT" : "POST";
      const body = {
        id: editData?.id_usuario,
        nome,
        apelido,
        cpf_cnpj: unmask(cpf),
        celular: unmask(celular),
        email,
        senha: senha || undefined,
        foto
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        toast.success(editData ? "Atualizado!" : "Cadastrado!");
        onSave();
      } else {
        const err = await res.json();
        toast.error(err.error || "Erro ao salvar");
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
        className="bg-[#0F172A] border border-white/10 rounded-[2.5rem] p-8 w-full max-w-xl shadow-2xl relative my-8"
      >
        <button onClick={onClose} className="absolute top-8 right-8 text-white/30 hover:text-white transition-colors">
          <X className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-5 mb-10">
          <div className="relative group">
            <div className="w-20 h-20 rounded-3xl bg-blue-600/20 flex items-center justify-center text-blue-500 overflow-hidden border-2 border-white/5 group-hover:border-blue-500/50 transition-all">
              {foto ? (
                <img src={foto} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <Bike className="w-10 h-10" />
              )}
            </div>
            <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center cursor-pointer hover:bg-blue-500 transition-all shadow-lg border-2 border-[#0F172A]">
              <input type="file" className="hidden" onChange={handleUpload} accept="image/*" />
              {uploading ? <Loader2 className="w-4 h-4 text-white animate-spin" /> : <Camera className="w-4 h-4 text-white" />}
            </label>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">{editData ? "Editar Perfil" : "Novo Entregador"}</h2>
            <p className="text-white/40">Preencha os dados do colaborador.</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="text-xs font-bold text-white/40 uppercase ml-1 tracking-wider">Nome Completo</label>
              <div className="relative mt-2">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-white/40 uppercase ml-1 tracking-wider">CPF / CNPJ</label>
              <div className="relative mt-2">
                <Fingerprint className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input
                  type="text"
                  value={cpf}
                  onChange={(e) => setCpf(maskCPFOrCNPJ(e.target.value))}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-white/40 uppercase ml-1 tracking-wider">Celular</label>
              <div className="relative mt-2">
                <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input
                  type="text"
                  value={celular}
                  onChange={(e) => setCelular(maskPhone(e.target.value))}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <div className="h-px bg-white/5 w-full my-2" />
            </div>

            <div>
              <label className="text-xs font-bold text-white/40 uppercase ml-1 tracking-wider">Email (Login)</label>
              <div className="relative mt-2">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-white/40 uppercase ml-1 tracking-wider">Senha</label>
              <div className="relative mt-2">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input
                  type="password"
                  placeholder={editData ? "•••••• (Manter)" : "••••••"}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-6">
            <button
              onClick={onClose}
              className="flex-1 bg-white/5 hover:bg-white/10 text-white py-4 rounded-2xl font-bold transition-all"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              disabled={loading}
              className="flex-[2] bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-2xl font-bold transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
              {editData ? "Salvar Alterações" : "Concluir Cadastro"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
