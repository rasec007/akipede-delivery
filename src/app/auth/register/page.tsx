"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, Store, Loader2, ArrowRight, Smartphone, FileText, MapPin, Tag, Eye, EyeOff, ImagePlus } from "lucide-react";
import { motion } from "framer-motion";
import Autocomplete from "react-google-autocomplete";

export default function RegisterPage() {
  const [tipoPessoa, setTipoPessoa] = useState<"PF" | "PJ">("PF");
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    celular: "",
    password: "",
    nomeEstabelecimento: "",
    cpf_cnpj: "",
    apelido: "",
    descricao: "",
    tipo_categoria: "",
    enderecoCompleto: "",
    lat: "",
    lng: "",
    num: "",
    complemento: "",
    ponto_referencia: "",
    logo: ""
  });
  const [dominiosRamo, setDominiosRamo] = useState<any[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [apelidoMessage, setApelidoMessage] = useState({ text: "", isError: false });
  const [isCheckingApelido, setIsCheckingApelido] = useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get("email");
    if (emailParam) {
      setFormData((prev) => ({ ...prev, email: emailParam }));
    }

    // Busca os ramos de atividade do banco de dados (tabela dominio onde tipo="Ramo de Atividade")
    fetch("/api/dominios?tipo=" + encodeURIComponent("Ramo de Atividade"))
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setDominiosRamo(data);
      })
      .catch(err => console.error("Erro ao buscar domínios", err));
  }, []);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, logo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const normalizeString = (str: string) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9 ]/g, "").trim().toLowerCase();
  };

  const generateApelido = async () => {
    if (!formData.nomeEstabelecimento || formData.apelido) return; // Só gera se tiver nome e apelido estiver vazio
    
    setIsCheckingApelido(true);
    setApelidoMessage({ text: "Verificando sugestões de apelido...", isError: false });

    const rawWords = normalizeString(formData.nomeEstabelecimento).split(/\s+/).filter(w => w.length > 0);
    if (rawWords.length === 0) {
      setIsCheckingApelido(false);
      setApelidoMessage({ text: "", isError: false });
      return;
    }

    let candidates: string[] = [];
    
    if (rawWords.length === 1) {
      candidates.push(rawWords[0]);
    } else {
      // 1ª Tentativa: Primeiro + Último
      candidates.push(`${rawWords[0]}-${rawWords[rawWords.length - 1]}`);
      
      // Tentativas sequenciais: Primeiro + Segundo, Primeiro + Terceiro...
      for (let i = 1; i < rawWords.length - 1; i++) {
        const combo = `${rawWords[0]}-${rawWords[i]}`;
        if (!candidates.includes(combo)) candidates.push(combo);
      }
    }

    let finalApelido = "";
    
    for (const candidate of candidates) {
      try {
        const res = await fetch(`/api/estabelecimentos/check-apelido?apelido=${encodeURIComponent(candidate)}`);
        const data = await res.json();
        
        if (data.available) {
          finalApelido = candidate;
          break;
        } else {
          setApelidoMessage({ text: `O apelido "${candidate}" já existe, tentando outro...`, isError: true });
          await new Promise(r => setTimeout(r, 800)); // Pequena pausa visual
        }
      } catch (err) {
        console.error(err);
      }
    }

    // Se nenhuma combinação de nome funcionou, apelar pro número do celular
    if (!finalApelido) {
      const base = rawWords.length > 1 ? `${rawWords[0]}-${rawWords[rawWords.length - 1]}` : rawWords[0];
      const celNums = formData.celular.replace(/\D/g, "");
      const suffix = celNums.length >= 4 ? celNums.slice(-4) : Math.floor(1000 + Math.random() * 9000).toString();
      finalApelido = `${base}-${suffix}`;
      setApelidoMessage({ text: "Apelidos indisponíveis. Sufixo adicionado para garantir exclusividade.", isError: false });
    } else {
      setApelidoMessage({ text: "✓ Apelido único gerado com sucesso!", isError: false });
    }

    setFormData(prev => ({ ...prev, apelido: finalApelido }));
    setIsCheckingApelido(false);
    
    setTimeout(() => {
      setApelidoMessage({ text: "", isError: false });
    }, 4000);
  };

  const handleCpfCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/\D/g, "");
    if (tipoPessoa === "PF") {
      v = v.replace(/(\d{3})(\d)/, "$1.$2");
      v = v.replace(/(\d{3})(\d)/, "$1.$2");
      v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    } else {
      v = v.replace(/^(\d{2})(\d)/, "$1.$2");
      v = v.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
      v = v.replace(/\.(\d{3})(\d)/, ".$1/$2");
      v = v.replace(/(\d{4})(\d)/, "$1-$2");
    }
    setFormData({ ...formData, cpf_cnpj: v });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate Password
    const hasLength = formData.password.length >= 8;
    const hasNumber = /\d/.test(formData.password);
    const hasUpper = /[A-Z]/.test(formData.password);
    const hasSpecial = /[#$*&@!%]/.test(formData.password);

    if (!hasLength || !hasNumber || !hasUpper || !hasSpecial) {
      setError("A senha não cumpre todos os requisitos de segurança.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao cadastrar");

      router.push("/auth/login?registered=true");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Regras de Senha
  const pwdRules = {
    length: formData.password.length >= 8,
    number: /\d/.test(formData.password),
    uppercase: /[A-Z]/.test(formData.password),
    special: /[#$*&@!%]/.test(formData.password)
  };

  return (
    <main className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden py-12">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl z-10"
      >
        <div className="glass p-8 rounded-3xl border border-white/10 shadow-2xl">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-white mb-2">Configure seu Delivery</h1>
            <p className="text-white/40">Preencha os dados abaixo para criar sua loja e começar a vender.</p>
          </div>

          <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {error && (
              <div className="md:col-span-2 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm font-bold text-center">
                {error}
              </div>
            )}

            {/* SEÇÃO: DADOS DO USUÁRIO E ACESSO */}
            <div className="md:col-span-2 text-blue-400 font-bold uppercase text-sm border-b border-white/10 pb-2 mt-4">
              Dados de Acesso e Contato
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-white/40 uppercase ml-1">Seu Nome</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-blue-400 transition-colors" />
                <input 
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData({...formData, nome: e.target.value})}
                  placeholder="Nome Completo"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-white/40 uppercase ml-1">Email Profissional</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-blue-400 transition-colors" />
                <input 
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="seu@email.com"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-white/40 uppercase ml-1">WhatsApp para Contato</label>
              <div className="relative group">
                <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-blue-400 transition-colors" />
                <input 
                  type="tel"
                  value={formData.celular}
                  onChange={(e) => setFormData({...formData, celular: e.target.value})}
                  placeholder="(00) 00000-0000"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-white/40 uppercase ml-1">Senha de Acesso</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-blue-400 transition-colors" />
                <input 
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  placeholder="Crie uma senha forte"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <div className="mt-2 text-[11px] grid grid-cols-2 gap-1 p-2 bg-black/20 rounded-xl border border-white/5">
                 <span className={pwdRules.length ? "text-green-400" : "text-white/30"}>✓ Mínimo de 8 caracteres</span>
                 <span className={pwdRules.number ? "text-green-400" : "text-white/30"}>✓ Pelo menos 1 número (0-9)</span>
                 <span className={pwdRules.uppercase ? "text-green-400" : "text-white/30"}>✓ Pelo menos 1 maiúscula (A-Z)</span>
                 <span className={pwdRules.special ? "text-green-400" : "text-white/30"}>✓ Pelo menos 1 especial (#$*&...)</span>
              </div>
            </div>

            {/* SEÇÃO: DADOS DO ESTABELECIMENTO */}
            <div className="md:col-span-2 text-blue-400 font-bold uppercase text-sm border-b border-white/10 pb-2 mt-6">
              Dados do Estabelecimento
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-white/40 uppercase ml-1">Nome do Delivery</label>
              <div className="relative group">
                <Store className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-blue-400 transition-colors" />
                <input 
                  type="text"
                  value={formData.nomeEstabelecimento}
                  onChange={(e) => setFormData({...formData, nomeEstabelecimento: e.target.value})}
                  onBlur={generateApelido}
                  placeholder="Razão Social ou Nome Fantasia"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-white/40 uppercase ml-1">Apelido (Para o link do catálogo)</label>
              <div className="relative group">
                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-blue-400 transition-colors" />
                <input 
                  type="text"
                  value={formData.apelido}
                  onChange={(e) => setFormData({...formData, apelido: normalizeString(e.target.value)})}
                  placeholder="ex: minha-pizzaria"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  required
                />
                {isCheckingApelido && (
                  <div className="absolute inset-y-0 right-4 flex items-center">
                    <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
                  </div>
                )}
              </div>
              {apelidoMessage.text && (
                <p className={`text-xs ml-2 mt-1 ${apelidoMessage.isError ? "text-orange-400 animate-pulse" : "text-green-400"}`}>
                  {apelidoMessage.text}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex gap-4 mb-2 ml-1">
                <label className="flex items-center gap-2 text-sm text-white/70 cursor-pointer">
                  <input type="radio" checked={tipoPessoa === "PF"} onChange={() => { setTipoPessoa("PF"); setFormData({...formData, cpf_cnpj: ""}) }} className="text-blue-600 focus:ring-blue-500 bg-white/10 border-white/20" /> Pessoa Física
                </label>
                <label className="flex items-center gap-2 text-sm text-white/70 cursor-pointer">
                  <input type="radio" checked={tipoPessoa === "PJ"} onChange={() => { setTipoPessoa("PJ"); setFormData({...formData, cpf_cnpj: ""}) }} className="text-blue-600 focus:ring-blue-500 bg-white/10 border-white/20" /> Pessoa Jurídica
                </label>
              </div>
              <div className="relative group">
                <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-blue-400 transition-colors" />
                <input 
                  type="text"
                  value={formData.cpf_cnpj}
                  onChange={handleCpfCnpjChange}
                  maxLength={tipoPessoa === "PF" ? 14 : 18}
                  placeholder={tipoPessoa === "PF" ? "000.000.000-00" : "00.000.000/0000-00"}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-white/40 uppercase ml-1">Logo do Delivery</label>
              <div className="relative group">
                <input 
                  type="file"
                  accept="image/*"
                  id="logo-upload"
                  className="hidden"
                  onChange={handleLogoUpload}
                />
                <label 
                  htmlFor="logo-upload"
                  className="w-full flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white hover:bg-white/10 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  {formData.logo ? (
                    <>
                      <img src={formData.logo} alt="Logo" className="w-6 h-6 object-cover rounded-full" />
                      <span className="text-sm text-green-400">Logo carregada com sucesso</span>
                    </>
                  ) : (
                    <>
                      <ImagePlus className="w-5 h-5 text-white/40 group-hover:text-blue-400 transition-colors" />
                      <span className="text-sm text-white/40 group-hover:text-white transition-colors">Clique para enviar sua logo</span>
                    </>
                  )}
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-white/40 uppercase ml-1">Ramo de Atividade</label>
              <select 
                value={formData.tipo_categoria}
                onChange={(e) => setFormData({...formData, tipo_categoria: e.target.value})}
                className="w-full bg-[#111827] border border-white/10 rounded-2xl py-4 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none"
                required
              >
                <option value="" disabled>Selecione o Ramo</option>
                {dominiosRamo.map((dominio) => (
                  <option key={dominio.id_dominio} value={dominio.id_dominio}>
                    {dominio.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-bold text-white/40 uppercase ml-1">Endereço (Pesquise como no Uber)</label>
              <div className="relative group">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-blue-400 transition-colors" />
                <Autocomplete
                  apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
                  onPlaceSelected={(place) => {
                    if (place.formatted_address) {
                      setFormData({
                        ...formData, 
                        enderecoCompleto: place.formatted_address,
                        lat: place.geometry?.location?.lat()?.toString() || "",
                        lng: place.geometry?.location?.lng()?.toString() || ""
                      });
                    }
                  }}
                  options={{
                    types: ["address"],
                    componentRestrictions: { country: "br" },
                  }}
                  defaultValue={formData.enderecoCompleto}
                  placeholder="Digite sua rua, número e cidade..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
              {formData.enderecoCompleto && (
                <p className="text-xs text-green-400 ml-2 mt-1">✓ Endereço localizado com sucesso.</p>
              )}
            </div>

            <div className="md:col-span-2 grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-white/40 uppercase ml-1">Número</label>
                <input 
                  type="text"
                  value={formData.num}
                  onChange={(e) => setFormData({...formData, num: e.target.value})}
                  placeholder="Ex: 123"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-white/40 uppercase ml-1">Complemento</label>
                <input 
                  type="text"
                  value={formData.complemento}
                  onChange={(e) => setFormData({...formData, complemento: e.target.value})}
                  placeholder="Apto, Lote, Sala..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-white/40 uppercase ml-1">Ponto de Ref.</label>
                <input 
                  type="text"
                  value={formData.ponto_referencia}
                  onChange={(e) => setFormData({...formData, ponto_referencia: e.target.value})}
                  placeholder="Ex: Próximo ao..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-bold text-white/40 uppercase ml-1">Breve Descrição do Negócio</label>
              <textarea 
                value={formData.descricao}
                onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                placeholder="Conte um pouco sobre o que você vende, diferenciais..."
                rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
              />
            </div>

            <div className="md:col-span-2 flex items-start gap-3 p-4 bg-white/5 rounded-2xl border border-white/5 mt-4">
              <input 
                type="checkbox" 
                id="lgpd"
                className="mt-1 w-5 h-5 rounded border-white/10 bg-white/5 text-blue-600 focus:ring-blue-500"
                required
              />
              <label htmlFor="lgpd" className="text-sm text-white/40 leading-relaxed">
                Estou de acordo com os <a href="/politica-de-privacidade" target="_blank" rel="noopener noreferrer" className="text-white underline">Termos de Uso</a> e 
                <a href="/politica-de-privacidade" target="_blank" rel="noopener noreferrer" className="text-white underline ml-1">Política de Privacidade</a> (LGPD). 
                Autorizo o <b>Akipede - Delivery</b> a me contatar via WhatsApp e E-mail para envio de credenciais e suporte.
              </label>
            </div>

            <button 
              disabled={loading || !pwdRules.length || !pwdRules.number || !pwdRules.uppercase || !pwdRules.special}
              className="md:col-span-2 w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>Criar minha conta <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-white/40 text-sm">
              Já tem conta? <a href="/auth/login" className="text-blue-400 font-bold hover:underline">Fazer login</a>
            </p>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
