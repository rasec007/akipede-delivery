"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Lock, Loader2, ArrowRight, Eye, EyeOff, ShoppingBag, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

function LoginContent() {
  const [email, setEmail] = useState("rasec007+delivery@gmail.com");
  const [password, setPassword] = useState("Rasec007k9.,.,");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const isFromCheckout = !!callbackUrl;

  const validateEmail = (val: string) => {
    if (!val) return;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(val)) {
      setError("Por favor, insira um e-mail válido");
    } else {
      setError("");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Por favor, insira um e-mail válido");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Erro ao fazer login");

      // Salva o Access Token no localStorage (para o client)
      localStorage.setItem("accessToken", data.accessToken);
      
      // Salva o Access Token no Cookie (para o Middleware/Server)
      document.cookie = `accessToken=${data.accessToken}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
      
      toast.success("Bem-vindo de volta!");
      
      // Redireciona para o checkout ou dashboard dependendo da origem
      if (callbackUrl) {
        router.push(callbackUrl);
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#f45145]/10 rounded-full blur-[120px]" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md z-10"
      >
        <div className="glass p-8 rounded-[40px] border border-white/10 shadow-2xl">
          <div className="text-center mb-10 flex flex-col items-center space-y-4">
            <div className={`w-16 h-16 ${isFromCheckout ? 'bg-[#f45145]' : 'bg-blue-600'} rounded-2xl flex items-center justify-center shadow-lg shadow-black/20`}>
              {isFromCheckout ? <ShoppingBag className="text-white w-8 h-8" /> : <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain" />}
            </div>
            <div>
              <h1 className="text-3xl font-black text-white tracking-tight">Akipede - Delivery</h1>
              <p className="text-[#9CA3AF] text-sm mt-1">
                {isFromCheckout ? 'Faça login para finalizar seu pedido' : 'Entre na sua conta para gerenciar seu delivery'}
              </p>
            </div>
          </div>

          <form onSubmit={handleLogin} noValidate className="space-y-6">
            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl text-xs font-bold text-center"
              >
                {error}
              </motion.div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-2">Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-blue-400 transition-colors" />
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError("");
                  }}
                  onBlur={() => validateEmail(email)}
                  placeholder="seu@email.com"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-2">Senha</label>
                <a href="#" className="text-[10px] font-black text-blue-400 uppercase tracking-widest hover:underline">Esqueceu?</a>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-blue-400 transition-colors" />
                <input 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-white placeholder:text-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
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
            </div>

            <button 
              disabled={loading}
              className={`w-full ${isFromCheckout ? 'bg-[#f45145] hover:bg-[#d43f35]' : 'bg-blue-600 hover:bg-blue-500'} text-white font-black py-5 rounded-2xl shadow-xl shadow-black/20 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 border-b-4 border-black/10`}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {isFromCheckout ? 'ENTRAR E CONTINUAR' : 'ENTRAR NO PAINEL'}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
          
          {/* Dados de Acesso Temporário */}
          <div className="mt-8 pt-6 border-t border-white/5">
            <div className="bg-blue-500/5 border border-blue-500/10 rounded-2xl p-4">
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2 opacity-50 text-center">Acesso Rápido (Temporário)</p>
              <div className="space-y-2">
                <div className="flex justify-between items-center bg-white/5 p-2 rounded-lg border border-white/5">
                  <span className="text-[10px] text-white/30 uppercase font-bold">Email</span>
                  <span className="text-xs text-white/70 font-medium select-all">rasec007+delivery@gmail.com</span>
                </div>
                <div className="flex justify-between items-center bg-white/5 p-2 rounded-lg border border-white/5">
                  <span className="text-[10px] text-white/30 uppercase font-bold">Senha</span>
                  <span className="text-xs text-white/70 font-medium select-all">Rasec007k9.,.,</span>
                </div>
              </div>
            </div>
          </div>


          <div className="mt-10 text-center space-y-4">
            <p className="text-white/40 text-xs font-medium">
              Não tem uma conta? <a href={`/auth/register${callbackUrl ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ''}`} className="text-blue-400 font-bold hover:underline ml-1">NÃO TENHO CONTA</a>
            </p>
            {isFromCheckout && (
              <button 
                onClick={() => router.back()}
                className="text-white/20 text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 mx-auto hover:text-white transition-colors"
              >
                <ArrowLeft className="w-3 h-3" /> Voltar ao Pedido
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0F172A] flex items-center justify-center"><Loader2 className="w-8 h-8 text-blue-500 animate-spin" /></div>}>
      <LoginContent />
    </Suspense>
  );
}
