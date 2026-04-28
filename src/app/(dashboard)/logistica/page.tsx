"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { 
  Truck, Plus, Trash2, Loader2, Search, Edit3, X, CheckCircle2, MapPin, DollarSign, Clock, Navigation 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import Autocomplete from "react-google-autocomplete";

type AreaEntrega = {
  id_area_entrega: string;
  nome: string;
  valor_entrega: number;
  tempo_entrega?: string;
  distancia_max?: number;
};

export default function LogisticaPage() {
  const router = useRouter();
  const [areas, setAreas] = useState<AreaEntrega[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState<AreaEntrega | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/logistica");
      if (res.status === 401) return router.push("/auth/login");
      const data = await res.json();
      if (Array.isArray(data)) setAreas(data);
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
    if (!confirm("Deseja remover esta área de entrega?")) return;
    try {
      const res = await fetch(`/api/logistica?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Área removida!");
        fetchData();
      }
    } catch {
      toast.error("Erro ao remover");
    }
  };

  const filtered = areas.filter(a => 
    a.nome?.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h2 className="text-3xl font-bold text-white">Logística</h2>
          <p className="text-white/40">Configure suas taxas e prazos de entrega por região.</p>
        </div>
        <button
          onClick={() => { setEditData(null); setModalOpen(true); }}
          className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)]"
        >
          <Plus className="w-5 h-5" /> Nova Área
        </button>
      </div>

      {/* Search */}
      <div className="flex gap-4 items-center glass p-4 rounded-2xl border border-white/5">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
          <input
            type="text"
            placeholder="Buscar por nome da região..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-12 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filtered.map((area) => (
            <motion.div
              key={area.id_area_entrega}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass p-6 rounded-3xl border border-white/5 relative group hover:border-blue-500/30 transition-all"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                  <MapPin className="w-7 h-7" />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => { setEditData(area); setModalOpen(true); }}
                    className="p-2 bg-white/5 hover:bg-blue-500/20 text-white/40 hover:text-blue-400 rounded-xl transition-all"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(area.id_area_entrega)}
                    className="p-2 bg-white/5 hover:bg-red-500/20 text-white/40 hover:text-red-400 rounded-xl transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-white leading-tight">{area.nome}</h3>
                  <p className="text-sm text-blue-400 font-bold">R$ {Number(area.valor_entrega).toFixed(2).replace(".", ",")}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                    <div className="flex items-center gap-2 text-[10px] text-white/30 uppercase font-bold mb-1">
                      <Clock className="w-3 h-3" /> Tempo
                    </div>
                    <p className="text-sm text-white font-medium">{area.tempo_entrega || "--"} min</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                    <div className="flex items-center gap-2 text-[10px] text-white/30 uppercase font-bold mb-1">
                      <Navigation className="w-3 h-3" /> Distância
                    </div>
                    <p className="text-sm text-white font-medium">{area.distancia_max || "--"} km</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <ModalArea
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={() => { setModalOpen(false); fetchData(); }}
        editData={editData}
      />
    </div>
  );
}

function ModalArea({ open, onClose, onSave, editData }: {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  editData: AreaEntrega | null;
}) {
  const [nome, setNome] = useState("");
  const [valor, setValor] = useState("");
  const [tempo, setTempo] = useState("");
  const [distancia, setDistancia] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editData) {
      setNome(editData.nome || "");
      setValor(String(editData.valor_entrega || "0"));
      setTempo(editData.tempo_entrega || "");
      setDistancia(String(editData.distancia_max || ""));
    } else {
      setNome("");
      setValor("");
      setTempo("");
      setDistancia("");
    }
  }, [editData, open]);

  const handleConfirm = async () => {
    if (!nome || !valor) return toast.error("Nome e Valor são obrigatórios");
    
    setLoading(true);
    try {
      const url = "/api/logistica";
      const method = editData ? "PUT" : "POST";
      const body = {
        id: editData?.id_area_entrega,
        nome,
        valor_entrega: parseFloat(valor.replace(",", ".")),
        tempo_entrega: tempo,
        distancia_max: distancia ? parseFloat(distancia) : null
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        toast.success(editData ? "Área atualizada!" : "Área cadastrada!");
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
        className="bg-[#0F172A] border border-white/10 rounded-[2.5rem] p-8 w-full max-w-lg shadow-2xl relative my-8"
      >
        <button onClick={onClose} className="absolute top-8 right-8 text-white/30 hover:text-white transition-colors">
          <X className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-5 mb-10">
          <div className="w-16 h-16 rounded-2xl bg-blue-600/20 flex items-center justify-center text-blue-500">
            <Truck className="w-9 h-9" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">{editData ? "Editar Área" : "Nova Área"}</h2>
            <p className="text-white/40">Defina os parâmetros de entrega para esta região.</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="text-xs font-bold text-white/40 uppercase ml-1 tracking-wider">Nome da Região / Bairro</label>
            <div className="relative mt-2">
              <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 z-10" />
              <Autocomplete
                apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
                onPlaceSelected={(place) => setNome(place.formatted_address || "")}
                defaultValue={nome}
                onChange={(e: any) => setNome(e.target.value)}
                options={{
                  types: ["(regions)"],
                  componentRestrictions: { country: "br" },
                }}
                placeholder="Ex: Centro, Zona Sul..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-bold text-white/40 uppercase ml-1 tracking-wider">Taxa de Entrega (R$)</label>
              <div className="relative mt-2">
                <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input
                  type="text"
                  placeholder="0,00"
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-white/40 uppercase ml-1 tracking-wider">Tempo Estimado (min)</label>
              <div className="relative mt-2">
                <Clock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input
                  type="text"
                  placeholder="Ex: 30-45"
                  value={tempo}
                  onChange={(e) => setTempo(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-bold text-white/40 uppercase ml-1 tracking-wider">Distância Máxima (km)</label>
              <div className="relative mt-2">
                <Navigation className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input
                  type="number"
                  placeholder="Ex: 10"
                  value={distancia}
                  onChange={(e) => setDistancia(e.target.value)}
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
              {editData ? "Salvar Alterações" : "Criar Área"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
