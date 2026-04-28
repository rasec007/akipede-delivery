"use client";
import React, { useState, useEffect } from "react";
import { X, ImagePlus, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ── MODAL CATEGORIA ──
// Regra: nome obrigatório
export function ModalCategoria({ open, onClose, onSave, editData }: {
  open: boolean; onClose: () => void;
  onSave: (data: { id?: string; nome: string }) => void;
  editData?: { id_categoria: string; nome: string } | null;
}) {
  const [nome, setNome] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => { setNome(editData?.nome || ""); setErrors([]); }, [editData, open]);

  const handleSave = () => {
    const errs: string[] = [];
    if (!nome.trim()) errs.push("O nome da categoria é obrigatório.");
    if (errs.length > 0) { setErrors(errs); return; }
    setErrors([]);
    onSave({ id: editData?.id_categoria, nome });
  };

  if (!open) return null;
  return (
    <Overlay onClose={onClose}>
      <h2 className="text-lg font-bold text-white mb-6">{editData ? "Editar" : "Adicionar"} Categoria</h2>
      <ValidationAlert errors={errors} />
      <Field label="Nome da Categoria" value={nome} onChange={setNome} placeholder="Nome da Categoria" error={!nome.trim() && errors.length > 0} />
      <div className="flex gap-3 justify-end mt-2">
        <button onClick={onClose} className="px-5 py-2.5 rounded-xl bg-white/10 text-white/60 hover:bg-white/20 font-bold text-sm">Fechar</button>
        <button onClick={handleSave}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm">Salvar</button>
      </div>
    </Overlay>
  );
}

// ── MODAL PRODUTO ──
// Regra: nome, valor, foto obrigatórios. Descrição opcional.
const VISIBILIDADE_OPTIONS = [
  { value: "delivery,mesa", label: "Delivery e Mesa" },
  { value: "delivery", label: "Somente Delivery" },
  { value: "mesa", label: "Somente Mesa" },
];

export function ModalProduto({ open, onClose, onSave, editData, categoriaNome }: {
  open: boolean; onClose: () => void;
  onSave: (data: any) => void;
  editData?: any; categoriaNome: string;
}) {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [foto, setFoto] = useState<string | null>(null);
  const [visibilidade, setVisibilidade] = useState("delivery,mesa");
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    setNome(editData?.nome || "");
    setDescricao(editData?.descricao || "");
    setValor(editData?.valor_total ? formatBRL(editData.valor_total) : "");
    setFoto(editData?.foto || null);
    setVisibilidade(editData?.visibilidade || "delivery,mesa");
    setErrors([]);
  }, [editData, open]);

  const handleFoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFoto(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    const errs: string[] = [];
    if (!nome.trim()) errs.push("O nome do produto é obrigatório.");
    if (!valor.trim() || parseBRL(valor) <= 0) errs.push("O valor do produto é obrigatório e deve ser maior que zero.");
    if (!foto) errs.push("A foto do produto é obrigatória.");
    if (errs.length > 0) { setErrors(errs); return; }
    setErrors([]);
    onSave({ id: editData?.id_produto, nome, descricao, valor: parseBRL(valor), foto, visibilidade });
  };

  if (!open) return null;
  return (
    <Overlay onClose={onClose}>
      <h2 className="text-lg font-bold text-white mb-6">{editData ? "Editar" : "Adicionar"} Produto</h2>
      <ValidationAlert errors={errors} />

      <label onClick={() => document.getElementById("foto-input")?.click()}
        className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-2xl cursor-pointer hover:border-blue-500/40 transition-colors mb-4 overflow-hidden ${
          !foto && errors.length > 0 && errors.some(e => e.includes("foto"))
            ? "border-red-500/60 bg-red-500/5"
            : "border-white/10"
        }`}>
        {foto ? <img src={foto} alt="" className="w-full h-full object-cover" />
          : <><ImagePlus className="w-8 h-8 text-white/20 mb-2" /><span className="text-white/30 text-sm">Clique para adicionar foto</span></>}
      </label>
      <input id="foto-input" type="file" accept="image/*" onChange={handleFoto} className="hidden" />

      <div className="mb-3">
        <label className="text-xs font-bold text-white/40 uppercase ml-1">Categoria associada</label>
        <div className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white/50 mt-1">{categoriaNome}</div>
      </div>

      <Field label="Nome do Produto" value={nome} onChange={setNome} placeholder="Nome do Produto" error={!nome.trim() && errors.length > 0} />
      <div className="mb-3">
        <label className="text-xs font-bold text-white/40 uppercase ml-1">Descrição <span className="text-white/20">(opcional)</span></label>
        <textarea value={descricao} onChange={e => setDescricao(e.target.value)} placeholder="Descreva o Produto" rows={3}
          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none" />
      </div>
      <CurrencyField label="Valor (R$)" value={valor} onChange={setValor} error={(!valor.trim() || parseBRL(valor) <= 0) && errors.length > 0} />

      {/* Visibilidade no Catálogo */}
      <div className="mb-3">
        <label className="text-xs font-bold text-white/40 uppercase ml-1">Exibir no catálogo de</label>
        <div className="flex gap-2 mt-2">
          {VISIBILIDADE_OPTIONS.map(opt => (
            <button key={opt.value} type="button"
              onClick={() => setVisibilidade(opt.value)}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all border ${
                visibilidade === opt.value
                  ? "bg-blue-600 border-blue-500 text-white shadow-[0_0_12px_rgba(37,99,235,0.3)]"
                  : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10 hover:text-white/60"
              }`}>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3 justify-end mt-4">
        <button onClick={onClose} className="px-5 py-2.5 rounded-xl bg-white/10 text-white/60 hover:bg-white/20 font-bold text-sm">Fechar</button>
        <button onClick={handleSave}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm">Salvar</button>
      </div>
    </Overlay>
  );
}


// ── MODAL COMPLEMENTO ──
// Regra: nome e qtd máxima obrigatórios (qtdMax > 0)
export function ModalComplemento({ open, onClose, onSave, editData, produtoNome }: {
  open: boolean; onClose: () => void;
  onSave: (data: any) => void;
  editData?: any; produtoNome: string;
}) {
  const [nome, setNome] = useState("");
  const [qtdMin, setQtdMin] = useState(0);
  const [qtdMax, setQtdMax] = useState(10);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    setNome(editData?.nome || "");
    setQtdMin(Number(editData?.quantidade_minima) || 0);
    setQtdMax(Number(editData?.quantidade_maxima) || 10);
    setErrors([]);
  }, [editData, open]);

  const handleSave = () => {
    const errs: string[] = [];
    if (!nome.trim()) errs.push("O nome do complemento é obrigatório.");
    if (qtdMax <= 0) errs.push("A quantidade máxima deve ser maior que zero.");
    if (errs.length > 0) { setErrors(errs); return; }
    setErrors([]);
    onSave({ id: editData?.id_complemento_tipo, nome, qtdMinima: qtdMin, qtdMaxima: qtdMax });
  };

  if (!open) return null;
  return (
    <Overlay onClose={onClose}>
      <h2 className="text-lg font-bold text-white mb-6">{editData ? "Editar" : "Adicionar"} Complemento</h2>
      <ValidationAlert errors={errors} />
      <div className="mb-3">
        <label className="text-xs font-bold text-white/40 uppercase ml-1">Produto associado</label>
        <div className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white/50 mt-1">{produtoNome}</div>
      </div>
      <Field label="Nome do Complemento" value={nome} onChange={setNome} placeholder="Ex: Sabor, Borda, Tamanho" error={!nome.trim() && errors.length > 0} />
      <div className="mb-3">
        <label className="text-xs font-bold text-white/40 uppercase ml-1">Qtd. Mínima: {qtdMin}</label>
        <input type="range" min={0} max={20} value={qtdMin} onChange={e => setQtdMin(Number(e.target.value))}
          className="w-full mt-1 accent-blue-500" />
      </div>
      <div className="mb-3">
        <label className={`text-xs font-bold uppercase ml-1 ${qtdMax <= 0 && errors.length > 0 ? "text-red-400" : "text-white/40"}`}>Qtd. Máxima: {qtdMax}</label>
        <input type="range" min={1} max={20} value={qtdMax} onChange={e => setQtdMax(Number(e.target.value))}
          className="w-full mt-1 accent-blue-500" />
      </div>
      <div className="flex gap-3 justify-end mt-4">
        <button onClick={onClose} className="px-5 py-2.5 rounded-xl bg-white/10 text-white/60 hover:bg-white/20 font-bold text-sm">Fechar</button>
        <button onClick={handleSave}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm">Salvar</button>
      </div>
    </Overlay>
  );
}

// ── MODAL ITEM ──
// Regra: nome e valor obrigatórios
export function ModalItem({ open, onClose, onSave, editData, complementoNome }: {
  open: boolean; onClose: () => void;
  onSave: (data: any) => void;
  editData?: any; complementoNome: string;
}) {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    setNome(editData?.nome || "");
    setDescricao(editData?.descricao || "");
    setValor(editData?.valor ? formatBRL(editData.valor) : "");
    setErrors([]);
  }, [editData, open]);

  const handleSave = () => {
    const errs: string[] = [];
    if (!nome.trim()) errs.push("O nome do item é obrigatório.");
    if (!valor.trim() || parseBRL(valor) <= 0) errs.push("O valor do item é obrigatório e deve ser maior que zero.");
    if (errs.length > 0) { setErrors(errs); return; }
    setErrors([]);
    onSave({ id: editData?.id_complemento_item, nome, descricao, valor: parseBRL(valor) });
  };

  if (!open) return null;
  return (
    <Overlay onClose={onClose}>
      <h2 className="text-lg font-bold text-white mb-6">{editData ? "Editar" : "Adicionar"} Item</h2>
      <ValidationAlert errors={errors} />
      <div className="mb-3">
        <label className="text-xs font-bold text-white/40 uppercase ml-1">Complemento associado</label>
        <div className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white/50 mt-1">{complementoNome}</div>
      </div>
      <Field label="Nome do Item" value={nome} onChange={setNome} placeholder="Nome do Item" error={!nome.trim() && errors.length > 0} />
      <Field label="Descrição" value={descricao} onChange={setDescricao} placeholder="Descrição do Item (opcional)" />
      <CurrencyField label="Valor (R$)" value={valor} onChange={setValor} error={(!valor.trim() || parseBRL(valor) <= 0) && errors.length > 0} />
      <div className="flex gap-3 justify-end mt-4">
        <button onClick={onClose} className="px-5 py-2.5 rounded-xl bg-white/10 text-white/60 hover:bg-white/20 font-bold text-sm">Fechar</button>
        <button onClick={handleSave}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm">Salvar</button>
      </div>
    </Overlay>
  );
}

// ── Helpers ──
function Overlay({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="bg-[#0F172A] border border-white/10 rounded-3xl p-8 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl relative"
          onClick={e => e.stopPropagation()}>
          <button onClick={onClose} className="absolute top-4 right-4 text-white/30 hover:text-white"><X className="w-5 h-5" /></button>
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function ValidationAlert({ errors }: { errors: string[] }) {
  if (errors.length === 0) return null;
  return (
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
  );
}

function Field({ label, value, onChange, placeholder, type = "text", error }: {
  label: string; value: string; onChange: (v: string) => void; placeholder: string; type?: string; error?: boolean;
}) {
  return (
    <div className="mb-3">
      <label className={`text-xs font-bold uppercase ml-1 ${error ? "text-red-400" : "text-white/40"}`}>{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className={`w-full bg-white/5 rounded-xl py-3 px-4 text-white mt-1 focus:outline-none focus:ring-2 transition-colors border ${
          error
            ? "border-red-500/50 focus:ring-red-500/30 bg-red-500/5"
            : "border-white/10 focus:ring-blue-500/50"
        }`} />
    </div>
  );
}

// ── Helpers de moeda brasileira ──
function formatBRL(value: number | string): string {
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return "";
  return num.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function parseBRL(value: string): number {
  if (!value) return 0;
  const cleaned = value.replace(/\./g, "").replace(",", ".");
  return parseFloat(cleaned) || 0;
}

function CurrencyField({ label, value, onChange, error }: {
  label: string; value: string; onChange: (v: string) => void; error?: boolean;
}) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value;
    // Allow only digits, comma, and dot (as thousand separator)
    raw = raw.replace(/[^0-9.,]/g, "");
    onChange(raw);
  };

  const handleBlur = () => {
    // On blur, format the value properly
    const num = parseBRL(value);
    onChange(formatBRL(num));
  };

  return (
    <div className="mb-3">
      <label className={`text-xs font-bold uppercase ml-1 ${error ? "text-red-400" : "text-white/40"}`}>{label}</label>
      <div className="relative">
        <span className={`absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold ${error ? "text-red-400/50" : "text-white/30"}`}>R$</span>
        <input
          type="text"
          inputMode="decimal"
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="0,00"
          className={`w-full bg-white/5 rounded-xl py-3 pl-12 pr-4 text-white mt-1 focus:outline-none focus:ring-2 transition-colors border ${
            error
              ? "border-red-500/50 focus:ring-red-500/30 bg-red-500/5"
              : "border-white/10 focus:ring-blue-500/50"
          }`}
        />
      </div>
    </div>
  );
}
