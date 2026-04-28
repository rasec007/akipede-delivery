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
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all" 
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
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Descrição / Sobre a Loja</label>
        <div className="relative">
          <AlignLeft className="absolute left-4 top-4 w-4 h-4 text-white/20" />
          <textarea 
            rows={4}
            value={formData.descricao}
            onChange={e => setFormData({...formData, descricao: e.target.value})}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none transition-all" 
            placeholder="Conte um pouco sobre sua loja para seus clientes..."
          />
        </div>
      </div>
    </motion.div>
  );
}

// --- IDENTIDADE VISUAL ---
function IdentidadeSettings({ formData, handleUpload }: any) {
  const [qrModal, setQrModal] = useState<{open: boolean, type: 'delivery' | 'mesa'}>({open: false, type: 'delivery'});
  const [mesaNum, setMesaNum] = useState("");

  const finalUrl = qrModal.type === 'delivery' 
    ? `https://akipede-delivery.com.br/delivery/${formData.apelido}` 
    : `https://akipede-delivery.com.br/mesa/${formData.apelido}${mesaNum ? `?mesa=${mesaNum}` : ''}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(finalUrl)}`;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1 text-center block">Logo da Loja</label>
          <div className="flex flex-col items-center gap-4 p-8 rounded-3xl bg-white/5 border-2 border-dashed border-white/10 hover:border-blue-500/50 transition-all group relative overflow-hidden">
            {formData.logo ? (
              <div className="relative w-40 h-40 rounded-2xl overflow-hidden shadow-2xl">
                <img src={formData.logo} alt="Logo" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                  <label className="cursor-pointer bg-white text-black px-4 py-2 rounded-xl text-xs font-bold">Trocar Logo</label>
                </div>
              </div>
            ) : (
              <div className="w-40 h-40 rounded-2xl bg-white/5 flex flex-col items-center justify-center gap-2 group-hover:bg-blue-500/10 transition-all">
                <Camera className="w-8 h-8 text-white/20 group-hover:text-blue-400" />
                <span className="text-[10px] text-white/20 font-bold uppercase tracking-wider">Subir Logo</span>
              </div>
            )}
            <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleUpload(e, "logo")} />
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1 text-center block">Banner Promocional</label>
          <div className="flex flex-col items-center gap-4 p-8 rounded-3xl bg-white/5 border-2 border-dashed border-white/10 hover:border-blue-500/50 transition-all group relative overflow-hidden">
            {formData.banner ? (
              <div className="relative w-full h-40 rounded-2xl overflow-hidden shadow-2xl">
                <img src={formData.banner} alt="Banner" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                  <label className="cursor-pointer bg-white text-black px-4 py-2 rounded-xl text-xs font-bold">Trocar Banner</label>
                </div>
              </div>
            ) : (
              <div className="w-full h-40 rounded-2xl bg-white/5 flex flex-col items-center justify-center gap-2 group-hover:bg-blue-500/10 transition-all">
                <ImageIcon className="w-8 h-8 text-white/20 group-hover:text-blue-400" />
                <span className="text-[10px] text-white/20 font-bold uppercase tracking-wider">Subir Banner</span>
              </div>
            )}
            <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleUpload(e, "banner")} />
          </div>
        </div>
      </div>

      <div className="p-8 rounded-3xl bg-white/5 border border-white/10 space-y-6">
        <div className="flex items-center gap-3">
          <QrCode className="w-6 h-6 text-blue-400" />
          <h3 className="text-xl font-bold text-white">Divulgação & QRCodes</h3>
        </div>
        <p className="text-white/40 text-sm">Gere códigos QR para facilitar o acesso dos seus clientes.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button 
            onClick={() => setQrModal({open: true, type: 'delivery'})}
            className="flex items-center justify-between p-6 rounded-2xl bg-blue-600/10 border border-blue-600/20 hover:bg-blue-600/20 transition-all group"
          >
            <div className="flex flex-col items-start">
              <span className="text-white font-bold">QR Code Delivery</span>
              <span className="text-blue-400/60 text-xs">Acesso direto ao catálogo</span>
            </div>
            <ExternalLink className="w-5 h-5 text-blue-400 group-hover:translate-x-1 transition-all" />
          </button>

          <button 
            onClick={() => setQrModal({open: true, type: 'mesa'})}
            className="flex items-center justify-between p-6 rounded-2xl bg-purple-600/10 border border-purple-600/20 hover:bg-purple-600/20 transition-all group"
          >
            <div className="flex flex-col items-start">
              <span className="text-white font-bold">QR Code Mesa</span>
              <span className="text-purple-400/60 text-xs">Identificação automática da mesa</span>
            </div>
            <ExternalLink className="w-5 h-5 text-purple-400 group-hover:translate-x-1 transition-all" />
          </button>
        </div>
      </div>

      {/* Modal QR Code */}
      <AnimatePresence>
        {qrModal.open && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#0F172A] border border-white/10 rounded-[40px] p-10 w-full max-w-md shadow-2xl relative"
            >
              <button onClick={() => {setQrModal({...qrModal, open: false}); setMesaNum("");}} className="absolute right-6 top-6 p-2 text-white/20 hover:text-white"><X className="w-6 h-6" /></button>
              
              <div className="text-center space-y-6">
                <div className="flex flex-col items-center gap-2">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${qrModal.type === 'delivery' ? 'bg-blue-600/20 text-blue-400' : 'bg-purple-600/20 text-purple-400'}`}>
                    <QrCode className="w-6 h-6" />
                  </div>
                  <h4 className="text-2xl font-bold text-white">QR Code {qrModal.type === 'delivery' ? 'Delivery' : 'Mesa'}</h4>
                </div>

                {qrModal.type === 'mesa' && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Número da Mesa</label>
                    <input 
                      type="number" 
                      value={mesaNum}
                      onChange={(e) => setMesaNum(e.target.value)}
                      placeholder="Ex: 05"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 text-center text-2xl font-bold text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    />
                  </div>
                )}

                <div className="p-4 bg-white rounded-3xl shadow-inner mx-auto w-fit">
                  <img src={qrCodeUrl} alt="QR Code" className="w-56 h-56" />
                </div>

                <div className="space-y-4">
                  <p className="text-white/40 text-xs break-all px-4">{finalUrl}</p>
                  <div className="flex flex-col gap-3">
                    <a 
                      href={finalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"
                    >
                      <ExternalLink className="w-5 h-5" /> Visualizar Catálogo
                    </a>
                    
                    <a 
                      href={qrCodeUrl} 
                      download="qrcode-akipede.png"
                      className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-white shadow-lg transition-all ${qrModal.type === 'delivery' ? 'bg-blue-600 shadow-blue-600/20' : 'bg-purple-600 shadow-purple-600/20'}`}
                    >
                      <Download className="w-5 h-5" /> Baixar QR Code
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
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

  const handleDelete = async (id: string) => {
    if (!confirm("Excluir horário?")) return;
    const res = await fetch(`/api/horarios?id=${id}`, { method: "DELETE" });
    if (res.ok) { toast.success("Excluído!"); fetchHorarios(); }
  };

  const handleSave = async (data: any) => {
    try {
      if (data.id) {
        await fetch("/api/horarios", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...data, diaSemana: data.diasSelecionados[0] }),
        });
      } else {
        await Promise.all(data.diasSelecionados.map((diaId: string) => 
          fetch("/api/horarios", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ diaSemana: diaId, horaAbre: data.horaAbre, horaFecha: data.horaFecha }),
          })
        ));
      }
      toast.success("Horário salvo!");
      setModalOpen(false);
      fetchHorarios();
    } catch (err) { toast.error("Erro ao salvar"); }
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
                    <button onClick={() => handleDelete(slot.id_horario_funcionamento)} className="p-1 text-white/30 hover:text-red-400"><Trash2 className="w-3 h-3" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <ModalHorarioSimple open={modalOpen} onClose={() => setModalOpen(false)} onSave={handleSave} editData={editData} diasSemana={diasSemana} />
    </motion.div>
  );
}

// --- PAGAMENTOS ---
function PagamentosSettings({ formData, setFormData }: any) {
  const [formas, setFormas] = useState<any[]>([]);
  const [opcoes, setOpcoes] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

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
    if (res.ok) { toast.success("Adicionado!"); setModalOpen(false); fetchData(); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remover forma?")) return;
    await fetch(`/api/pagamentos?id=${id}`, { method: "DELETE" });
    fetchData();
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
              <button onClick={() => handleDelete(f.id_lista_forma_pagamento)} className="p-2 text-white/10 hover:text-red-400"><Trash2 className="w-5 h-5" /></button>
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
    </motion.div>
  );
}

// --- CUPONS ---
function CuponsSettings() {
  const [cupons, setCupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
    if (!confirm("Excluir cupom?")) return;
    await fetch(`/api/cupons?id=${id}`, { method: "DELETE" });
    fetchCupons();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-white">Meus Cupons</h3>
        <button className="bg-blue-600/20 text-blue-400 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-blue-600/30 transition-all">
          <Plus className="w-4 h-4" /> Novo Cupom
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cupons.map((c) => (
          <div key={c.id_cupom} className="bg-white/5 border border-white/5 rounded-2xl p-5 group relative overflow-hidden">
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-400">
                  <Ticket className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white font-bold">{c.titulo}</h4>
                  <p className="text-blue-400 text-xs font-bold uppercase tracking-tighter">{c.desconto}% OFF</p>
                </div>
              </div>
              <button onClick={() => handleDelete(c.id_cupom)} className="p-2 text-white/10 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"><Trash2 className="w-5 h-5" /></button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// --- MODALS ---
function ModalHorarioSimple({ open, onClose, onSave, editData, diasSemana }: any) {
  const [data, setData] = useState({
    diasSelecionados: [] as string[],
    horaAbre: "2024-01-01T08:00:00.000Z",
    horaFecha: "2024-01-01T18:00:00.000Z"
  });

  useEffect(() => {
    if (editData) {
      setData({
        diasSelecionados: [editData.diaSemana],
        horaAbre: editData.horaAbre,
        horaFecha: editData.horaFecha
      });
    } else {
      setData({
        diasSelecionados: [],
        horaAbre: "2024-01-01T08:00:00.000Z",
        horaFecha: "2024-01-01T18:00:00.000Z"
      });
    }
  }, [editData, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#0F172A] border border-white/10 rounded-3xl p-8 w-full max-w-md shadow-2xl">
        <h4 className="text-white font-bold mb-6">{editData ? "Editar" : "Novo"} Horário</h4>
        
        {!editData && (
          <div className="space-y-2 mb-6">
            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Dias da Semana</label>
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
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                    data.diasSelecionados.includes(d.id_dominio) ? "bg-blue-600 text-white" : "bg-white/5 text-white/40 hover:bg-white/10"
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
                const nd = new Date(data.horaAbre);
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
                const nd = new Date(data.horaFecha);
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
      console.log("API DATA (LOJA):", data);
      setLoja(data);
      
      const enderecoObj = data.endereco_endereco_vinculoToestabelecimento?.[0];

      setFormData({
        razao_social: data.razao_social || "",
        apelido: data.apelido || "",
        cpf_cnpj: maskCPFOrCNPJ(data.cpf_cnpj || ""),
        celular: maskPhone(data.celular || ""),
        email: data.email || "",
        descricao: data.descricao || "",
        pedido_minimo: data.pedido_minimo?.toString() || "0",
        logo: data.logo || "",
        banner: data.banner || "",
        pix_tipo: data.pix_tipo || "",
        pix_chave: data.pix_chave || "",
        pix_nome: data.pix_nome || "",
        endereco: enderecoObj?.lograduro || "",
        lat: enderecoObj?.latitude || "",
        lng: enderecoObj?.longitude || ""
      });
    } catch (error) {
      toast.error("Erro ao carregar dados");
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
        toast.success("Configurações salvas!");
        fetchLoja();
      } else {
        const error = await res.json();
        toast.error(error.details || "Erro ao salvar");
      }
    } catch (error) {
      toast.error("Erro na conexão");
    } finally {
      setSaving(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: "logo" | "banner") => {
    const file = e.target.files?.[0];
    if (!file) return;

    const loadingToast = toast.loading("Subindo imagem...");
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
        toast.success("Imagem atualizada!");
      }
    } catch (error) {
      toast.error("Erro no upload");
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
