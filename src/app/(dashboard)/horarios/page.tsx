"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Clock, Plus, Edit2, Trash2, Loader2, Sun, Moon, AlertCircle, X, CalendarDays,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

type DiaSemana = { id_dominio: string; nome: string };

type HorarioType = {
  id_horario_funcionamento: string;
  diaSemana: string | null;
  horaAbre: string | null;
  horaFecha: string | null;
  dominio: { id_dominio: string; nome: string } | null;
};

const DIAS_ORDEM: Record<string, number> = {
  segunda: 1, terça: 2, terca: 2, quarta: 3, quinta: 4, sexta: 5, sábado: 6, sabado: 6, domingo: 7
};

function getDiaOrdem(nome: string | null | undefined): number {
  if (!nome) return 99;
  const lower = nome.toLowerCase();
  for (const [key, val] of Object.entries(DIAS_ORDEM)) {
    if (lower.includes(key)) return val;
  }
  return 99;
}

function formatTime(isoTime: string | null): string {
  if (!isoTime) return "--:--";
  try {
    const d = new Date(isoTime);
    return `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`;
  } catch {
    return "--:--";
  }
}

function getDiaColor(nome: string | null | undefined): string {
  if (!nome) return "bg-white/10 text-white/40";
  const lower = nome.toLowerCase();
  if (lower.includes("domingo")) return "bg-red-500/15 text-red-400 border-red-500/20";
  if (lower.includes("sábado") || lower.includes("sabado")) return "bg-amber-500/15 text-amber-400 border-amber-500/20";
  return "bg-blue-500/15 text-blue-400 border-blue-500/20";
}

export default function HorariosPage() {
  const router = useRouter();
  const [horarios, setHorarios] = useState<HorarioType[]>([]);
  const [diasSemana, setDiasSemana] = useState<DiaSemana[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState<HorarioType | null>(null);

  const fetchHorarios = useCallback(async () => {
    try {
      const res = await fetch("/api/horarios");
      if (res.status === 401) return router.push("/auth/login");
      const data = await res.json();
      if (Array.isArray(data)) {
        const sorted = data.sort((a: HorarioType, b: HorarioType) =>
          getDiaOrdem(a.dominio?.nome) - getDiaOrdem(b.dominio?.nome)
        );
        setHorarios(sorted);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [router]);

  const fetchDias = useCallback(async () => {
    try {
      const res = await fetch(`/api/dominios?tipo=${encodeURIComponent("Dia da Semana")}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        const sorted = data.sort((a: DiaSemana, b: DiaSemana) => 
          getDiaOrdem(a.nome) - getDiaOrdem(b.nome)
        );
        setDiasSemana(sorted);
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchHorarios();
    fetchDias();
  }, [fetchHorarios, fetchDias]);

  const handleSave = async (data: { id?: string; diasSelecionados: string[]; horaAbre: string; horaFecha: string }) => {
    const isEdit = !!data.id;
    const bodyBase = { horaAbre: data.horaAbre, horaFecha: data.horaFecha };

    try {
      if (isEdit) {
        // Modo Edição: Apenas um dia
        const res = await fetch("/api/horarios", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...bodyBase, id: data.id, diaSemana: data.diasSelecionados[0] }),
        });
        if (!res.ok) throw new Error(await res.text());
      } else {
        // Modo Cadastro: Loop para múltiplos dias
        const promises = data.diasSelecionados.map(diaId => 
          fetch("/api/horarios", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...bodyBase, diaSemana: diaId }),
          })
        );
        await Promise.all(promises);
      }

      toast.success(isEdit ? "Horário atualizado!" : "Horários criados!");
      setModalOpen(false);
      setEditData(null);
      fetchHorarios();
    } catch (err: any) {
      toast.error("Erro ao salvar: " + err.message);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/horarios?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Horário excluído!");
        fetchHorarios();
      } else {
        if (res.status === 401) return router.push("/auth/login");
        const err = await res.json();
        toast.error(err.error || "Erro ao excluir horário");
      }
    } catch {
      toast.error("Erro de conexão");
    }
  };

  // Group horarios by day
  const groupedByDay = horarios.reduce<Record<string, HorarioType[]>>((acc, h) => {
    const dia = h.dominio?.nome || "Indefinido";
    if (!acc[dia]) acc[dia] = [];
    acc[dia].push(h);
    return acc;
  }, {});

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
          <h2 className="text-3xl font-bold text-white">Horários de Funcionamento</h2>
          <p className="text-white/40">
            Defina quando seu estabelecimento está aberto para pedidos.
          </p>
        </div>
        <button
          onClick={() => { setEditData(null); setModalOpen(true); }}
          className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)]"
        >
          <Plus className="w-5 h-5" /> Novo Horário
        </button>
      </div>

      {/* Info Banner */}
      <div className="glass rounded-2xl border border-blue-500/10 p-4 flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
          <AlertCircle className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <p className="text-sm text-white/70">
            Os horários configurados aqui serão exibidos no catálogo do seu estabelecimento.
            Fora do horário de funcionamento, o cliente poderá visualizar o cardápio, mas
            <strong className="text-white"> não conseguirá finalizar pedidos</strong>.
          </p>
        </div>
      </div>

      {/* Empty State */}
      {horarios.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 glass rounded-3xl border-2 border-dashed border-white/5">
          <CalendarDays className="w-12 h-12 text-white/10 mb-4" />
          <p className="text-white/20 mb-2">Nenhum horário cadastrado.</p>
          <p className="text-white/15 text-sm">Seu estabelecimento ficará como "Fechado" até configurar os horários.</p>
        </div>
      )}

      {/* Schedule Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <AnimatePresence mode="popLayout">
          {Object.entries(groupedByDay).map(([dia, slots]) => (
            <motion.div
              key={dia}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass rounded-2xl border border-white/5 overflow-hidden"
            >
              {/* Day Header */}
              <div className={`px-5 py-3 flex items-center gap-2 border-b border-white/5 ${getDiaColor(dia)}`}>
                <CalendarDays className="w-4 h-4" />
                <span className="font-bold text-sm uppercase tracking-wider">{dia}</span>
                <span className="ml-auto text-xs opacity-60">{slots.length} turno{slots.length > 1 ? "s" : ""}</span>
              </div>

              {/* Time Slots */}
              <div className="p-4 space-y-3">
                {slots.map((slot) => (
                  <div
                    key={slot.id_horario_funcionamento}
                    className="flex items-center justify-between bg-white/[0.03] rounded-xl px-4 py-3 border border-white/5 group hover:bg-white/[0.06] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <Sun className="w-3.5 h-3.5 text-amber-400" />
                        <span className="text-white font-bold text-sm">{formatTime(slot.horaAbre)}</span>
                      </div>
                      <span className="text-white/20 text-xs">até</span>
                      <div className="flex items-center gap-1.5">
                        <Moon className="w-3.5 h-3.5 text-indigo-400" />
                        <span className="text-white font-bold text-sm">{formatTime(slot.horaFecha)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => { setEditData(slot); setModalOpen(true); }}
                        className="p-1.5 text-white/30 hover:text-blue-400 transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(slot.id_horario_funcionamento)}
                        className="p-1.5 text-white/30 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Modal */}
      <ModalHorario
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditData(null); }}
        onSave={handleSave}
        editData={editData}
        diasSemana={diasSemana}
      />
    </div>
  );
}

// ── MODAL HORÁRIO ──
function ModalHorario({ open, onClose, onSave, editData, diasSemana }: {
  open: boolean;
  onClose: () => void;
  onSave: (data: { id?: string; diasSelecionados: string[]; horaAbre: string; horaFecha: string }) => void;
  editData: HorarioType | null;
  diasSemana: DiaSemana[];
}) {
  const [diasSelecionados, setDiasSelecionados] = useState<string[]>([]);
  const [horaAbre, setHoraAbre] = useState("");
  const [horaFecha, setHoraFecha] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    if (editData) {
      setDiasSelecionados([editData.diaSemana || ""]);
      setHoraAbre(editData.horaAbre ? formatTime(editData.horaAbre) : "");
      setHoraFecha(editData.horaFecha ? formatTime(editData.horaFecha) : "");
    } else {
      setDiasSelecionados([]);
      setHoraAbre("");
      setHoraFecha("");
    }
    setErrors([]);
  }, [editData, open]);

  const toggleDia = (id: string) => {
    setDiasSelecionados(prev => {
      if (editData) return [id]; // Modo edição: sempre substitui
      if (prev.includes(id)) return prev.filter(d => d !== id); // Remove se já existe
      return [...prev, id]; // Adiciona se não existe
    });
  };

  const handleSave = () => {
    const errs: string[] = [];
    if (diasSelecionados.length === 0) errs.push("Selecione pelo menos um dia da semana.");
    if (!horaAbre) errs.push("Informe o horário de abertura.");
    if (!horaFecha) errs.push("Informe o horário de fechamento.");
    if (horaAbre && horaFecha && horaAbre >= horaFecha) {
      errs.push("O horário de abertura deve ser anterior ao de fechamento.");
    }
    if (errs.length > 0) { setErrors(errs); return; }
    setErrors([]);
    onSave({
      id: editData?.id_horario_funcionamento,
      diasSelecionados,
      horaAbre,
      horaFecha,
    });
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-[#0F172A] border border-white/10 rounded-3xl p-8 w-full max-w-md shadow-2xl relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button onClick={onClose} className="absolute top-4 right-4 text-white/30 hover:text-white">
            <X className="w-5 h-5" />
          </button>

          <h2 className="text-lg font-bold text-white mb-6">
            {editData ? "Editar" : "Novo"} Horário de Funcionamento
          </h2>

          {/* Validation Alert */}
          {errors.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20"
            >
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                <div className="space-y-0.5">
                  {errors.map((err, i) => (
                    <p key={i} className="text-xs text-red-400 font-medium">{err}</p>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Seleção de Dias (Grid de Chips) */}
          <div className="mb-6">
            <label className={`text-xs font-bold uppercase ml-1 ${diasSelecionados.length === 0 && errors.length > 0 ? "text-red-400" : "text-white/40"}`}>
              {editData ? "Dia da Semana" : "Selecione os Dias"}
            </label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {diasSemana.map((d) => {
                const isSelected = diasSelecionados.includes(d.id_dominio);
                return (
                  <button
                    key={d.id_dominio}
                    type="button"
                    onClick={() => toggleDia(d.id_dominio)}
                    className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all border text-left flex items-center justify-between ${
                      isSelected
                        ? "bg-blue-600 border-blue-500 text-white shadow-[0_0_12px_rgba(37,99,235,0.3)]"
                        : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10 hover:text-white/60"
                    }`}
                  >
                    {d.nome.split("-")[0]}
                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Inputs */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className={`text-xs font-bold uppercase ml-1 ${!horaAbre && errors.length > 0 ? "text-red-400" : "text-white/40"}`}>
                Horário de Abertura
              </label>
              <div className="relative">
                <Sun className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400/50 mt-0.5" />
                <input
                  type="time"
                  value={horaAbre}
                  onChange={(e) => setHoraAbre(e.target.value)}
                  className={`w-full bg-white/5 rounded-xl py-3 pl-10 pr-4 text-white mt-1 focus:outline-none focus:ring-2 transition-colors border [color-scheme:dark] ${
                    !horaAbre && errors.length > 0
                      ? "border-red-500/50 focus:ring-red-500/30 bg-red-500/5"
                      : "border-white/10 focus:ring-blue-500/50"
                  }`}
                />
              </div>
            </div>
            <div>
              <label className={`text-xs font-bold uppercase ml-1 ${!horaFecha && errors.length > 0 ? "text-red-400" : "text-white/40"}`}>
                Horário de Fechamento
              </label>
              <div className="relative">
                <Moon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400/50 mt-0.5" />
                <input
                  type="time"
                  value={horaFecha}
                  onChange={(e) => setHoraFecha(e.target.value)}
                  className={`w-full bg-white/5 rounded-xl py-3 pl-10 pr-4 text-white mt-1 focus:outline-none focus:ring-2 transition-colors border [color-scheme:dark] ${
                    !horaFecha && errors.length > 0
                      ? "border-red-500/50 focus:ring-red-500/30 bg-red-500/5"
                      : "border-white/10 focus:ring-blue-500/50"
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Preview */}
          {horaAbre && horaFecha && horaAbre < horaFecha && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20"
            >
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                <p className="text-xs text-emerald-400 font-medium">
                  Funcionamento: {horaAbre} às {horaFecha}
                  {" "}({calcDuration(horaAbre, horaFecha)})
                </p>
              </div>
            </motion.div>
          )}

          {/* Actions */}
          <div className="flex gap-3 justify-end mt-6">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-white/10 text-white/60 hover:bg-white/20 font-bold text-sm"
            >
              Fechar
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm"
            >
              Salvar
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function calcDuration(start: string, end: string): string {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  let diff = (eh * 60 + em) - (sh * 60 + sm);
  if (diff < 0) diff += 24 * 60;
  const hours = Math.floor(diff / 60);
  const mins = diff % 60;
  if (hours === 0) return `${mins}min`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h${mins}min`;
}
