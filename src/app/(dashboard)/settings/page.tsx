"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Store, Clock, MapPin, Save, Globe, Phone, Mail, Image as ImageIcon, 
  Loader2, CheckCircle2, AlignLeft, DollarSign, Camera, CreditCard, Ticket,
  Sun, Moon, AlertCircle, CalendarDays, Edit2, Plus, Filter, Edit3, X, 
  ChevronDown, Percent, Hash, Calendar, QrCode, Trash2, ExternalLink, Download
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { maskPhone, unmask, maskCPFOrCNPJ } from "@/client/utils/masks";
import { usePlacesWidget } from "react-google-autocomplete";

// --- COMPONENTES AUXILIARES ---

function ModalConfirm({ open, onClose, onConfirm, title, message }: any) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#0F172A] border border-white/10 rounded-3xl p-8 w-full max-w-md shadow-2xl"
      >
        <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500 mb-6">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h4 className="text-xl font-bold text-white mb-2">{title}</h4>
        <p className="text-white/40 mb-8">{message}</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 px-6 py-3 rounded-xl font-bold text-white/40 hover:bg-white/5 transition-all">Cancelar</button>
          <button onClick={onConfirm} className="flex-1 bg-red-600 hover:bg-red-500 text-white py-3 rounded-xl font-bold shadow-lg shadow-red-600/20 transition-all">Excluir</button>
        </div>
      </motion.div>
    </div>
  );
}

function ModalConflict({ open, onClose, message }: any) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#0F172A] border border-amber-500/20 rounded-3xl p-8 w-full max-w-md shadow-2xl shadow-amber-500/10"
      >
        <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500 mb-6">
          <Clock className="w-8 h-8" />
        </div>
        <h4 className="text-xl font-bold text-white mb-2">Conflito de Horário</h4>
        <p className="text-white/60 leading-relaxed mb-8">{message}</p>
        <button onClick={onClose} className="w-full bg-amber-500 hover:bg-amber-400 text-[#0F172A] py-4 rounded-xl font-bold transition-all">
          Entendi, vou ajustar
        </button>
      </motion.div>
    </div>
  );
}

// --- PERFIL ---
function PerfilSettings({ formData, setFormData }: any) {
  const { ref } = usePlacesWidget({
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    onPlaceSelected: (place) => {
      const address = place.formatted_address;
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      
      setFormData({
        ...formData,
        endereco: address,
        lat: lat.toString(),
        lng: lng.toString()
      });
      toast.success("Endereço localizado!");
    },
    options: {
      types: ["address"],
      componentRestrictions: { country: "br" },
    }
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Razão Social</label>
          <div className="relative">
            <Store className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
            <input 
              type="text" 
              value={formData.razao_social}
              onChange={e => setFormData({...formData, razao_social: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all" 
              placeholder="Nome oficial da empresa"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Apelido (Nome Fantasia)</label>
          <div className="relative">
            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
            <input 
              type="text" 
              value={formData.apelido}
              onChange={e => setFormData({...formData, apelido: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all" 
              placeholder="Como os clientes te conhecem"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">CPF ou CNPJ</label>
          <div className="relative">
            <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
            <input 
              type="text" 
              value={formData.cpf_cnpj}
              onChange={e => setFormData({...formData, cpf_cnpj: maskCPFOrCNPJ(e.target.value)})}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all" 
              placeholder="000.000.000-00"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Celular / WhatsApp</label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
            <input 
              type="text" 
              value={formData.celular}
              onChange={e => setFormData({...formData, celular: maskPhone(e.target.value)})}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all" 
              placeholder="(00) 00000-0000"
            />
          </div>
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Endereço Completo (Google Maps)</label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
            <input 
              ref={ref as any}
              type="text" 
              value={formData.endereco}
              onChange={e => setFormData({...formData, endereco: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all" 
              placeholder="Comece a digitar seu endereço..."
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Número</label>
          <div className="relative">
            <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
            <input 
              type="text" 
              value={formData.numero}
              onChange={e => setFormData({...formData, numero: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all" 
              placeholder="Ex: 123"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Complemento</label>
          <div className="relative">
            <Plus className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
            <input 
              type="text" 
              value={formData.complemento}
              onChange={e => setFormData({...formData, complemento: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all" 
              placeholder="Apto, Sala, Bloco..."
            />
          </div>
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Ponto de Referência</label>
          <div className="relative">
            <AlertCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
            <input 
              type="text" 
              value={formData.ponto_referencia}
              onChange={e => setFormData({...formData, ponto_referencia: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all" 
              placeholder="Próximo a..."
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Email de Contato</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
            <input 
              type="email" 
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all" 
              placeholder="contato@empresa.com"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Pedido Mínimo (R$)</label>
          <div className="relative">
            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
            <input 
              type="text" 
              value={formData.pedido_minimo}
              onChange={e => setFormData({...formData, pedido_minimo: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all" 
              placeholder="0,00"
            />
          </div>
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Descrição do Estabelecimento</label>
          <div className="relative">
            <AlignLeft className="absolute left-4 top-4 w-4 h-4 text-white/20" />
            <textarea 
              rows={4}
              value={formData.descricao}
              onChange={e => setFormData({...formData, descricao: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none" 
              placeholder="Conte um pouco sobre sua loja..."
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// --- IDENTIDADE ---
function IdentidadeSettings({ formData, handleUpload }: any) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Camera className="w-5 h-5 text-blue-400" />
            <h4 className="text-white font-bold">Logotipo da Loja</h4>
          </div>
          <div className="relative group w-48 h-48 mx-auto md:mx-0">
            <div className="w-full h-full rounded-[40px] bg-white/5 border-2 border-dashed border-white/10 flex items-center justify-center overflow-hidden group-hover:border-blue-500/50 transition-all">
              {formData.logo ? (
                <img src={formData.logo} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <ImageIcon className="w-12 h-12 text-white/10" />
              )}
            </div>
            <label className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 cursor-pointer transition-all rounded-[40px]">
              <div className="text-center">
                <Plus className="w-8 h-8 text-white mx-auto mb-1" />
                <span className="text-[10px] text-white font-bold uppercase tracking-widest">Alterar</span>
              </div>
              <input type="file" className="hidden" onChange={e => handleUpload(e, "logo")} accept="image/*" />
            </label>
          </div>
          <p className="text-white/20 text-xs text-center md:text-left">Recomendado: 512x512px (PNG ou JPG)</p>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <ImageIcon className="w-5 h-5 text-blue-400" />
            <h4 className="text-white font-bold">Banner de Destaque</h4>
          </div>
          <div className="relative group aspect-video rounded-[40px] bg-white/5 border-2 border-dashed border-white/10 flex items-center justify-center overflow-hidden group-hover:border-blue-500/50 transition-all">
            {formData.banner ? (
              <img src={formData.banner} alt="Banner" className="w-full h-full object-cover" />
            ) : (
              <ImageIcon className="w-12 h-12 text-white/10" />
            )}
            <label className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 cursor-pointer transition-all">
              <div className="text-center">
                <Plus className="w-8 h-8 text-white mx-auto mb-1" />
                <span className="text-[10px] text-white font-bold uppercase tracking-widest">Alterar Banner</span>
              </div>
              <input type="file" className="hidden" onChange={e => handleUpload(e, "banner")} accept="image/*" />
            </label>
          </div>
          <p className="text-white/20 text-xs">Recomendado: 1920x600px (Imagens horizontais)</p>
        </div>
      </div>
    </motion.div>
  );
}

// --- HORÁRIOS ---
function getDiaColor(nome: string | null | undefined): string {
  if (!nome) return "bg-white/10 text-white/40";
  const lower = nome.toLowerCase();
  if (lower.includes("domingo")) return "bg-red-500/15 text-red-400 border-red-500/20";
  if (lower.includes("sábado") || lower.includes("sabado")) return "bg-amber-500/15 text-amber-400 border-amber-500/20";
  return "bg-blue-500/15 text-blue-400 border-blue-500/20";
}

function HorariosSettings() {
  const [horarios, setHorarios] = useState<any[]>([]);
  const [diasSemana, setDiasSemana] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ id: string, type: 'horario' | 'pagamento' } | null>(null);
  const [conflictError, setConflictError] = useState<string | null>(null);

  const fetchHorarios = async () => {
    try {
      const res = await fetch("/api/horarios");
      const data = await res.json();
      if (Array.isArray(data)) setHorarios(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchDias = async () => {
    const res = await fetch(`/api/dominios?tipo=${encodeURIComponent("Dia da Semana")}`);
    const data = await res.json();
    if (Array.isArray(data)) setDiasSemana(data);
  };

  useEffect(() => { fetchHorarios(); fetchDias(); }, []);

  const handleDeleteHorario = async (id: string) => {
    const res = await fetch(`/api/horarios?id=${id}`, { method: "DELETE" });
    if (res.ok) { 
      toast.success("Horário removido!"); 
      fetchHorarios(); 
    }
    setConfirmDelete(null);
  };

  const handleSave = async (data: any) => {
    try {
      let res;
      if (data.id) {
        res = await fetch("/api/horarios", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: data.id,
            diaSemana: data.diaSemana,
            horaAbre: data.horaAbre,
            horaFecha: data.horaFecha
          }),
        });
      } else {
        // Para novos horários, envia um por um para cada dia selecionado
        for (const diaId of data.diasSelecionados) {
          const postRes = await fetch("/api/horarios", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ diaSemana: diaId, horaAbre: data.horaAbre, horaFecha: data.horaFecha }),
          });
          
          if (!postRes.ok) {
            const errorData = await postRes.json();
            const msg = errorData.details || errorData.error || "Erro ao salvar";
            if (msg.includes("Conflito")) {
              setConflictError(msg);
              return;
            }
            throw new Error(msg);
          }
        }
        res = { ok: true } as any; 
      }

      if (res && !res.ok) {
        const errorData = await res.json();
        const msg = errorData.details || errorData.error || "Erro desconhecido";
        if (msg.includes("Conflito")) {
          setConflictError(msg);
          return;
        }
        throw new Error(msg);
      }

      toast.success("Tudo pronto! Horário salvo.");
      setModalOpen(false);
      fetchHorarios();
    } catch (err: any) { 
      console.error("ERRO AO SALVAR HORARIO:", err);
      if (err.message.includes("Não autorizado")) {
        toast.error("Sua sessão expirou. Por favor, entre novamente.");
      } else {
        toast.error(`Ops! Tivemos um problema: ${err.message}`); 
      }
    }
  };

  const formatTime = (iso: string) => {
    if (!iso) return "--:--";
    const d = new Date(iso);
    return `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`;
  };

  const calculateDuration = (start: string, end: string) => {
    const s = new Date(start);
    const e = new Date(end);
    let diff = (e.getTime() - s.getTime()) / 1000 / 60 / 60;
    if (diff < 0) diff += 24;
    return diff.toFixed(1).replace(".0", "") + "h";
  };

  const grouped = horarios.reduce<Record<string, any[]>>((acc, h) => {
    const dia = h.dominio?.nome || "Outros";
    if (!acc[dia]) acc[dia] = [];
    acc[dia].push(h);
    return acc;
  }, {});

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-white">Horários de Funcionamento</h3>
        </div>
        <button onClick={() => { setEditData(null); setModalOpen(true); }} className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all">
          <Plus className="w-4 h-4" /> Novo Horário
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Object.entries(grouped).map(([dia, slots]) => (
          <div key={dia} className="glass rounded-2xl border border-white/5 overflow-hidden">
            <div className={`px-4 py-2 flex items-center gap-2 border-b border-white/5 ${getDiaColor(dia)}`}>
              <CalendarDays className="w-3.5 h-3.5" />
              <span className="font-bold text-[10px] uppercase tracking-widest">{dia}</span>
            </div>
            <div className="p-3 space-y-2">
              {slots.map((slot: any) => (
                <div key={slot.id_horario_funcionamento} className="bg-white/5 rounded-xl px-3 py-2 flex items-center justify-between group">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-white text-xs font-bold">{formatTime(slot.horaAbre)}</span>
                      <span className="text-white/20 text-[10px]">até</span>
                      <span className="text-white text-xs font-bold">{formatTime(slot.horaFecha)}</span>
                    </div>
                    <span className="text-[9px] text-blue-400/60 font-medium mt-0.5">Duração: {calculateDuration(slot.horaAbre, slot.horaFecha)}</span>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                    <button onClick={() => { setEditData(slot); setModalOpen(true); }} className="p-1 text-white/30 hover:text-blue-400"><Edit2 className="w-3 h-3" /></button>
                    <button onClick={() => setConfirmDelete({ id: slot.id_horario_funcionamento, type: 'horario' })} className="p-1 text-white/30 hover:text-red-400"><Trash2 className="w-3 h-3" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <ModalHorarioSimple open={modalOpen} onClose={() => setModalOpen(false)} onSave={handleSave} editData={editData} diasSemana={diasSemana} />
      
      <ModalConflict 
        open={!!conflictError} 
        onClose={() => setConflictError(null)} 
        message={conflictError}
      />

      <ModalConfirm 
        open={!!confirmDelete} 
        onClose={() => setConfirmDelete(null)} 
        onConfirm={() => {
          if (confirmDelete?.type === 'horario') handleDeleteHorario(confirmDelete.id);
          if (confirmDelete?.type === 'pagamento') handleDeletePagamento(confirmDelete.id);
        }}
        title={confirmDelete?.type === 'horario' ? "Excluir Horário?" : "Remover Pagamento?"}
        message="Esta ação não pode ser desfeita. Tem certeza que deseja continuar?"
      />
    </motion.div>
  );
}

// --- PAGAMENTOS ---
function PagamentosSettings({ formData, setFormData }: any) {
  const [formas, setFormas] = useState<any[]>([]);
  const [opcoes, setOpcoes] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<any>(null);

  const fetchData = async () => {
    const [rf, ro] = await Promise.all([
      fetch("/api/pagamentos"),
      fetch(`/api/dominios?tipo=${encodeURIComponent("Forma de Pagamento")}`)
    ]);
    setFormas(await rf.json());
    setOpcoes(await ro.json());
  };

  useEffect(() => { fetchData(); }, []);

  const handleAdd = async (id: string) => {
    const res = await fetch("/api/pagamentos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idDominio: id }),
    });
    if (res.ok) { toast.success("Forma de pagamento adicionada!"); setModalOpen(false); fetchData(); }
  };

  const handleDeletePagamento = async (id: string) => {
    const res = await fetch(`/api/pagamentos?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Forma de pagamento removida!");
      fetchData();
    }
    setConfirmDelete(null);
  };

  const temPix = formas.some(f => f.dominio?.nome?.toUpperCase() === "PIX");

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-white">Formas de Pagamento</h3>
          <button onClick={() => setModalOpen(true)} className="bg-blue-600/20 text-blue-400 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-blue-600/30 transition-all">
            <Plus className="w-4 h-4" /> Adicionar Forma
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {formas.map((f) => (
            <div key={f.id_lista_forma_pagamento} className="bg-white/5 border border-white/5 rounded-2xl p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-blue-400">
                  <CreditCard className="w-5 h-5" />
                </div>
                <span className="font-bold text-white">{f.dominio?.nome}</span>
              </div>
              <button onClick={() => setConfirmDelete({ id: f.id_lista_forma_pagamento, type: 'pagamento' })} className="p-2 text-white/10 hover:text-red-400"><Trash2 className="w-5 h-5" /></button>
            </div>
          ))}
        </div>
      </div>

      {temPix && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 p-8 rounded-3xl bg-blue-500/5 border border-blue-500/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold">Configuração do PIX</h4>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Tipo de Chave</label>
              <select 
                value={formData.pix_tipo}
                onChange={e => setFormData({...formData, pix_tipo: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none"
              >
                <option value="" className="bg-[#0F172A]">Selecione...</option>
                <option value="CPF/CNPJ" className="bg-[#0F172A]">CPF/CNPJ</option>
                <option value="E-mail" className="bg-[#0F172A]">E-mail</option>
                <option value="Celular" className="bg-[#0F172A]">Celular</option>
                <option value="Chave Aleatória" className="bg-[#0F172A]">Chave Aleatória</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Chave PIX</label>
              <input 
                type="text" 
                value={formData.pix_chave}
                onChange={e => setFormData({...formData, pix_chave: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50" 
                placeholder="Sua chave aqui"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Nome do Titular</label>
              <input 
                type="text" 
                value={formData.pix_nome}
                onChange={e => setFormData({...formData, pix_nome: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50" 
                placeholder="Nome completo"
              />
            </div>
          </div>
        </motion.div>
      )}

      <ModalPagamentoSimple open={modalOpen} onClose={() => setModalOpen(false)} onSave={handleAdd} opcoes={opcoes.filter(o => !formas.some(f => f.forma_pagamento === o.id_dominio))} />
      
      <ModalConfirm 
        open={!!confirmDelete} 
        onClose={() => setConfirmDelete(null)} 
        onConfirm={() => {
          if (confirmDelete?.type === 'pagamento') handleDeletePagamento(confirmDelete.id);
        }}
        title="Remover Forma de Pagamento?"
        message="Esta ação não pode ser desfeita. Tem certeza que deseja continuar?"
      />
    </motion.div>
  );
}

// --- CUPONS ---
function CuponsSettings() {
  const [cupons, setCupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const fetchCupons = async () => {
    try {
      const res = await fetch("/api/cupons");
      const data = await res.json();
      if (Array.isArray(data)) setCupons(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCupons(); }, []);

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/cupons?id=${id}`, { method: "DELETE" });
    if (res.ok) { toast.success("Cupom removido!"); fetchCupons(); }
    setConfirmDelete(null);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-white">Cupons de Desconto</h3>
        <button onClick={() => setModalOpen(true)} className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all">
          <Plus className="w-4 h-4" /> Novo Cupom
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cupons.map((c) => (
          <div key={c.id_cupom} className="glass rounded-2xl border border-white/5 p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/5 rounded-full blur-2xl -mr-12 -mt-12 group-hover:bg-blue-600/10 transition-all" />
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-400">
                <Ticket className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-bold text-lg">{c.codigo}</h4>
                <p className="text-blue-400 text-sm font-bold">{c.tipo === 'FIXO' ? `R$ ${c.valor}` : `${c.valor}%`} OFF</p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <span className="text-[10px] text-white/40 uppercase tracking-widest">Ativo</span>
              <button onClick={() => setConfirmDelete(c.id_cupom)} className="p-2 text-white/10 hover:text-red-400 transition-all">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <ModalConfirm 
        open={!!confirmDelete} 
        onClose={() => setConfirmDelete(null)} 
        onConfirm={() => handleDelete(confirmDelete!)}
        title="Excluir Cupom?"
        message="Tem certeza que deseja remover este cupom de desconto?"
      />
    </motion.div>
  );
}

// --- MODAIS SIMPLES ---

function ModalHorarioSimple({ open, onClose, onSave, editData, diasSemana }: any) {
  const [data, setData] = useState({
    diaSemana: editData?.diaSemana || "",
    horaAbre: editData?.horaAbre || new Date(0).toISOString(),
    horaFecha: editData?.horaFecha || new Date(0).toISOString(),
    diasSelecionados: [] as string[]
  });

  useEffect(() => {
    if (editData) {
      setData({
        diaSemana: editData.diaSemana,
        horaAbre: editData.horaAbre,
        horaFecha: editData.horaFecha,
        diasSelecionados: []
      });
    } else {
      setData({
        diaSemana: "",
        horaAbre: new Date(0).toISOString(),
        horaFecha: new Date(0).toISOString(),
        diasSelecionados: []
      });
    }
  }, [editData, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#0F172A] border border-white/10 rounded-3xl p-8 w-full max-w-lg shadow-2xl">
        <h4 className="text-xl font-bold text-white mb-6">
          {editData ? "Editar Horário" : "Novo Horário de Funcionamento"}
        </h4>
        
        {!editData && (
          <div className="mb-6">
            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1 block mb-3">Dias da Semana</label>
            <div className="flex flex-wrap gap-2">
              {diasSemana.map((d: any) => (
                <button 
                  key={d.id_dominio}
                  onClick={() => {
                    const exists = data.diasSelecionados.includes(d.id_dominio);
                    setData({
                      ...data,
                      diasSelecionados: exists 
                        ? data.diasSelecionados.filter(id => id !== d.id_dominio)
                        : [...data.diasSelecionados, d.id_dominio]
                    });
                  }}
                  className={`px-3 py-2 rounded-xl text-[10px] font-bold transition-all border ${
                    data.diasSelecionados.includes(d.id_dominio)
                    ? "bg-blue-600 border-blue-500 text-white"
                    : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10"
                  }`}
                >
                  {d.nome}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Abre às</label>
            <input 
              type="time" 
              value={new Date(data.horaAbre).getUTCHours().toString().padStart(2, "0") + ":" + new Date(data.horaAbre).getUTCMinutes().toString().padStart(2, "0")}
              onChange={e => {
                const [h, m] = e.target.value.split(":");
                const nd = new Date(0);
                nd.setUTCHours(parseInt(h), parseInt(m), 0, 0);
                setData({...data, horaAbre: nd.toISOString()});
              }}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Fecha às</label>
            <input 
              type="time" 
              value={new Date(data.horaFecha).getUTCHours().toString().padStart(2, "0") + ":" + new Date(data.horaFecha).getUTCMinutes().toString().padStart(2, "0")}
              onChange={e => {
                const [h, m] = e.target.value.split(":");
                const nd = new Date(0);
                nd.setUTCHours(parseInt(h), parseInt(m), 0, 0);
                setData({...data, horaFecha: nd.toISOString()});
              }}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <button onClick={onClose} className="flex-1 text-white/40 font-bold">Cancelar</button>
          <button 
            onClick={() => onSave({ ...data, id: editData?.id_horario_funcionamento })} 
            className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-blue-600/20"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}

function ModalPagamentoSimple({ open, onClose, onSave, opcoes }: any) {
  const [selected, setSelected] = useState("");
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#0F172A] border border-white/10 rounded-3xl p-8 w-full max-w-md shadow-2xl">
        <h4 className="text-white font-bold mb-6">Nova Forma de Pagamento</h4>
        <select value={selected} onChange={e => setSelected(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white appearance-none">
          <option value="" className="bg-[#0F172A]">Selecione...</option>
          {opcoes.map((o: any) => <option key={o.id_dominio} value={o.id_dominio} className="bg-[#0F172A]">{o.nome}</option>)}
        </select>
        <div className="flex gap-3 mt-8">
          <button onClick={onClose} className="flex-1 text-white/40 font-bold">Cancelar</button>
          <button onClick={() => { onSave(selected); setSelected(""); }} className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold">Adicionar</button>
        </div>
      </div>
    </div>
  );
}

// --- MAIN PAGE ---
export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("perfil");
  const [loja, setLoja] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    razao_social: "",
    apelido: "",
    cpf_cnpj: "",
    celular: "",
    email: "",
    descricao: "",
    pedido_minimo: "",
    logo: "",
    banner: "",
    pix_tipo: "",
    pix_chave: "",
    pix_nome: "",
    endereco: "",
    numero: "",
    complemento: "",
    ponto_referencia: "",
    lat: "",
    lng: ""
  });

  useEffect(() => {
    fetchLoja();
  }, []);

  const fetchLoja = async () => {
    try {
      const res = await fetch("/api/estabelecimento");
      const data = await res.json();
      setLoja(data);
      
      setFormData({
        razao_social: data.razao_social || "",
        apelido: data.apelido || "",
        cpf_cnpj: maskCPFOrCNPJ(data.cpf_cnpj || ""),
        celular: maskPhone(data.celular || ""),
        email: data.email || "",
        descricao: data.descricao || "",
        pedido_minimo: data.pedido_minimo || "0",
        logo: data.logo || "",
        banner: data.banner || "",
        pix_tipo: data.pix_tipo || "",
        pix_chave: data.pix_chave || "",
        pix_nome: data.pix_nome || "",
        endereco: data.endereco || "",
        numero: data.numero || "",
        complemento: data.complemento || "",
        ponto_referencia: data.ponto_referencia || "",
        lat: data.lat || "",
        lng: data.lng || ""
      });
    } catch (error) {
      toast.error("Ops! Não conseguimos carregar as informações agora.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/estabelecimento", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          celular: unmask(formData.celular),
          cpf_cnpj: unmask(formData.cpf_cnpj)
        }),
      });

      if (res.ok) {
        toast.success("Tudo certo! Suas alterações foram salvas.");
        fetchLoja();
      } else {
        const error = await res.json();
        toast.error(error.details || "Não conseguimos salvar. Verifique os dados e tente de novo.");
      }
    } catch (error) {
      toast.error("Parece que estamos com um problema de conexão.");
    } finally {
      setSaving(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: "logo" | "banner") => {
    const file = e.target.files?.[0];
    if (!file) return;

    const loadingToast = toast.loading("Preparando sua imagem...");
    try {
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload,
      });

      const data = await res.json();
      if (data.url) {
        setFormData(prev => ({ ...prev, [field]: data.url }));
        toast.success("Imagem atualizada com sucesso!");
      }
    } catch (error) {
      toast.error("Ops! O upload da imagem falhou.");
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  const tabs = [
    { id: "perfil", label: "Perfil", icon: Store },
    { id: "identidade", label: "Identidade", icon: ImageIcon },
    { id: "horarios", label: "Horários", icon: Clock },
    { id: "pagamentos", label: "Pagamentos", icon: DollarSign },
    { id: "cupons", label: "Cupons", icon: Ticket },
  ];

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-[#0F172A]">
      <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0F172A] p-4 md:p-8 space-y-8 pb-20">
      {/* Header Fixo */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            Configurações do <span className="text-blue-500">Akipede</span>
          </h2>
          <p className="text-white/40 text-sm">Gerencie todos os detalhes do seu negócio.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white px-8 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 transition-all"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          Salvar Alterações
        </button>
      </div>

      {/* Tabs Layout */}
      <div className="space-y-6">
        <div className="flex flex-wrap gap-2 bg-white/5 p-2 rounded-2xl border border-white/5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all text-sm ${
                activeTab === tab.id 
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
                : "bg-white/0 text-white/40 hover:bg-white/5"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="bg-white/5 rounded-[40px] border border-white/5 p-8 md:p-12 backdrop-blur-xl min-h-[600px] shadow-2xl relative overflow-hidden">
          {/* Decorative effect inside content */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-[100px] -mr-32 -mt-32" />
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="relative z-10"
            >
              {activeTab === "perfil" && <PerfilSettings formData={formData} setFormData={setFormData} />}
              {activeTab === "identidade" && <IdentidadeSettings formData={formData} handleUpload={handleUpload} />}
              {activeTab === "horarios" && <HorariosSettings />}
              {activeTab === "pagamentos" && <PagamentosSettings formData={formData} setFormData={setFormData} />}
              {activeTab === "cupons" && <CuponsSettings />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
