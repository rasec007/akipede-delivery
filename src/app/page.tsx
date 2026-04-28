"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { 
  ShoppingBag, 
  ArrowRight, 
  CheckCircle2, 
  Zap, 
  Shield, 
  Smartphone, 
  ChevronLeft, 
  ChevronRight,
  Clock,
  TrendingUp,
  Store
} from "lucide-react";

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1517248135467-4c7ed9d42177?q=80&w=2070&auto=format&fit=crop", // Restaurante Geral
  "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2070&auto=format&fit=crop", // Pizzaria
  "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1899&auto=format&fit=crop", // Hamburgueria
  "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=2070&auto=format&fit=crop", // Sushi
  "https://images.unsplash.com/photo-1590301157890-4810ed352733?q=80&w=1936&auto=format&fit=crop", // Açaí
];

export default function LandingPage() {
  const [showCookies, setShowCookies] = React.useState(false);
  const [heroImage, setHeroImage] = React.useState(HERO_IMAGES[0]);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    // Escolhe uma imagem aleatória no load
    const randomImage = HERO_IMAGES[Math.floor(Math.random() * HERO_IMAGES.length)];
    setHeroImage(randomImage);

    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setShowCookies(true);
    }
  }, []);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -scrollRef.current.offsetWidth, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: scrollRef.current.offsetWidth, behavior: 'smooth' });
    }
  };

  const handleAcceptCookies = () => {
    localStorage.setItem("cookie-consent", "accepted");
    toast.success("Obrigado por aceitar nossos cookies! Sua experiência agora será completa.");
    setShowCookies(false);
    console.log("Opt-in to cookies: Authorized");
  };

  const handleDeclineCookies = () => {
    toast.error("Você recusou os cookies. Algumas funcionalidades podem não funcionar corretamente.");
    localStorage.setItem("cookie-consent", "declined");
    setShowCookies(false);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white overflow-x-hidden">
      {/* Navbar Minimalista */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-8 py-6 backdrop-blur-xl bg-black/20 border-b border-white/5">
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Akipede Logo" className="w-10 h-10 object-contain" />
            <span className="text-2xl font-bold tracking-tight">Akipede - Delivery</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/60">
            <a href="#features" className="hover:text-white transition-colors">Recursos</a>
            <a href="#categories" className="hover:text-white transition-colors">Segmentos</a>
            <a href="#pricing" className="hover:text-white transition-colors">Preços</a>
            <Link href="/auth/login" className="hover:text-white transition-colors">Entrar</Link>
            <Link href="/auth/register" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-full transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] font-bold">
              Começar Agora
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section com Background Imersivo */}
      <section className="relative min-h-screen flex items-center pt-20 px-8">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/80 via-[#020617]/40 to-[#020617] z-10" />
          <img 
            src={heroImage} 
            alt="Segmento de Delivery" 
            className="w-full h-full object-cover opacity-30 scale-105 transition-all duration-1000"
          />
        </div>

        <div className="relative z-20 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="px-4 py-1.5 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-widest mb-6 inline-block">
              Delivery direto do seu estabelecimento
            </span>
            <h1 className="text-5xl md:text-8xl font-bold leading-[1.1] mb-8">
              O ERP que seu <br />
              <span className="text-blue-500">Delivery</span> Merece.
            </h1>
            <p className="text-white/60 text-lg md:text-xl max-w-xl mb-10 leading-relaxed">
              Precinho bom que cabe no seu bolso. Gestão completa, pedidos em tempo real e notificações via WhatsApp.
            </p>
            
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                const emailInput = (e.currentTarget.elements.namedItem('hero-email') as HTMLInputElement).value;
                if(emailInput) {
                  window.location.href = `/auth/register?email=${encodeURIComponent(emailInput)}`;
                } else {
                  window.location.href = '/auth/register';
                }
              }}
              className="flex flex-col sm:flex-row gap-4 p-2 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 max-w-md"
            >
              <input 
                type="email" 
                name="hero-email"
                placeholder="Seu melhor e-mail" 
                required
                className="bg-transparent px-4 py-3 outline-none flex-1 text-white placeholder:text-white/20"
              />
              <button type="submit" className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] whitespace-nowrap">
                Cadastre-se
              </button>
            </form>
            <p className="mt-4 text-sm text-white/30">
              Já tem uma conta? <Link href="/auth/login" className="text-blue-400 hover:underline">Entrar agora</Link>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:block relative"
          >
            <div className="absolute -inset-4 bg-blue-600/20 rounded-[40px] blur-3xl animate-pulse" />
            <div className="glass rounded-[40px] border border-white/10 p-4 shadow-2xl overflow-hidden aspect-[4/3] relative">
               <img 
                 src="/dashboard-mockup.png" 
                 alt="Dashboard Preview"
                 className="w-full h-full object-cover rounded-3xl"
               />
               <div className="absolute bottom-10 right-10 glass p-6 rounded-2xl border border-white/20 animate-bounce">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-ping" />
                    <span className="text-lg font-bold">Novo Pedido!</span>
                  </div>
               </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Seção de Destaques Ilustrados */}
      <section id="features" className="py-32 px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <motion.div whileHover={{ y: -10 }} className="text-center group">
            <div className="w-24 h-24 bg-blue-600/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-blue-600/20 group-hover:bg-blue-600 transition-all duration-500">
               <Clock className="w-10 h-10 text-blue-500 group-hover:text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Entregue na hora certa</h3>
            <p className="text-white/40 leading-relaxed">Otimize suas rotas e tempos de preparo para garantir a melhor experincia ao cliente.</p>
          </motion.div>

          <motion.div whileHover={{ y: -10 }} className="text-center group">
            <div className="w-24 h-24 bg-blue-600/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-blue-600/20 group-hover:bg-blue-600 transition-all duration-500">
               <TrendingUp className="w-10 h-10 text-blue-500 group-hover:text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Alcance novos clientes</h3>
            <p className="text-white/40 leading-relaxed">Ferramentas de marketing e fidelizao integradas para fazer seu faturamento decolar.</p>
          </motion.div>

          <motion.div whileHover={{ y: -10 }} className="text-center group">
            <div className="w-24 h-24 bg-blue-600/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-blue-600/20 group-hover:bg-blue-600 transition-all duration-500">
               <Smartphone className="w-10 h-10 text-blue-500 group-hover:text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Seu Delivery no Bolso</h3>
            <p className="text-white/40 leading-relaxed">Gesto mvel completa. Acompanhe tudo em tempo real, de onde quer que voc esteja.</p>
          </motion.div>
        </div>
      </section>

      {/* Slider de Categorias (Segmentos) */}
      <section id="categories" className="py-32 bg-white/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 mb-16 flex justify-between items-end">
          <div>
            <h2 className="text-4xl font-bold mb-4">Para todos os tipos de fome</h2>
            <p className="text-white/40 text-lg">Nossa plataforma se adapta perfeitamente ao seu modelo de negócio.</p>
          </div>
          <div className="flex gap-4">
            <button onClick={scrollLeft} className="p-4 rounded-full border border-white/10 hover:bg-white/10 transition-all">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button onClick={scrollRight} className="p-4 rounded-full border border-white/10 hover:bg-white/10 transition-all">
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div 
          ref={scrollRef}
          className="flex gap-6 px-8 max-w-7xl mx-auto overflow-x-hidden snap-x snap-mandatory pb-12"
        >
          <CategoryCard title="Rasec Sushi" type="Japonesa" img="https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=2070&auto=format&fit=crop" />
          <CategoryCard title="Bella Pizza" type="Pizzaria" img="https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2070&auto=format&fit=crop" />
          <CategoryCard title="Monster Burguer" type="Hamburgueria" img="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1899&auto=format&fit=crop" />
          <CategoryCard title="Açaí do Porto" type="Sobremesas" img="https://images.unsplash.com/photo-1590301157890-4810ed352733?q=80&w=1936&auto=format&fit=crop" />
          {/* Itens extras para simular o carrossel avançando */}
          <CategoryCard title="Cozinha da Vovó" type="Marmitas" img="https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=2071&auto=format&fit=crop" />
          <CategoryCard title="Bebidas Express" type="Conveniência" img="https://images.unsplash.com/photo-1572688049615-dceee188e423?q=80&w=1887&auto=format&fit=crop" />
          <CategoryCard title="Vegan Life" type="Saudável" img="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070&auto=format&fit=crop" />
          <CategoryCard title="Doce Encanto" type="Doceria" img="https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=1964&auto=format&fit=crop" />
        </div>

        <div className="text-center mt-12">
          <a href="#" className="text-blue-400 font-bold hover:underline">Acessar nosso MENU completo</a>
        </div>
      </section>

      {/* Seção de Confiança / Stats */}
      <section className="py-32 px-8 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 text-center">
        <div>
          <h4 className="text-5xl font-bold text-blue-500 mb-2">500+</h4>
          <p className="text-white/40 uppercase tracking-widest text-sm">Estabelecimentos</p>
        </div>
        <div>
          <h4 className="text-5xl font-bold text-blue-500 mb-2">1M+</h4>
          <p className="text-white/40 uppercase tracking-widest text-sm">Pedidos Entregues</p>
        </div>
        <div>
          <h4 className="text-5xl font-bold text-blue-500 mb-2">99.9%</h4>
          <p className="text-white/40 uppercase tracking-widest text-sm">Uptime</p>
        </div>
        <div>
          <h4 className="text-5xl font-bold text-blue-500 mb-2">24/7</h4>
          <p className="text-white/40 uppercase tracking-widest text-sm">Suporte Ativo</p>
        </div>
      </section>

      {/* Rodapé (Footer) inspirado no mockup */}
      <footer className="bg-[#DE3E56]/20 border-t border-[#DE3E56]/30 pt-20 pb-10 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 border-b border-white/10 pb-16">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Akipede Logo" className="w-10 h-10 object-contain" />
            <span className="text-2xl font-bold tracking-tight">Akipede - Delivery</span>
          </div>
          <p className="text-white/60 text-center md:text-right max-w-md">
            Akipede - Delivery. A melhor plataforma de delivery para seu estabelecimento.
          </p>
        </div>
        
        <div className="max-w-7xl mx-auto mt-10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/30 uppercase tracking-widest">
          <p>© 2024 Akipede ERP. Todos os direitos reservados.</p>
          <div className="flex gap-6">
            <a href="/politica-de-privacidade" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Política de Privacidade</a>
            <a href="/politica-de-privacidade" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Termos de Uso</a>
          </div>
        </div>

        {/* Banner de Cookies LGPD */}
        {showCookies && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 glass px-6 py-4 rounded-2xl border border-white/10 flex flex-col md:flex-row items-center gap-6 z-[100] shadow-2xl max-w-[90vw] w-full md:w-auto"
          >
             <p className="text-sm text-white/60">
               Nós utilizamos cookies e outras tecnologias para melhorar sua experiência, de acordo com nossa 
               <a href="/politica-de-privacidade" target="_blank" rel="noopener noreferrer" className="text-white underline ml-1">Política de Privacidade</a> e as normas da <b>LGPD</b>.
             </p>
             <div className="flex gap-3 whitespace-nowrap">
               <button 
                 onClick={handleDeclineCookies}
                 className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-sm font-bold transition-all"
               >
                 RECUSAR
               </button>
               <button 
                 onClick={handleAcceptCookies}
                 className="bg-white text-black hover:bg-white/90 px-4 py-2 rounded-xl text-sm font-bold transition-all"
               >
                 CONCORDAR E FECHAR
               </button>
             </div>
          </motion.div>
        )}
      </footer>
    </div>
  );
}

function CategoryCard({ title, type, img }: { title: string, type: string, img: string }) {
  return (
    <motion.div 
      whileHover={{ scale: 1.05 }}
      className="flex-shrink-0 w-[calc(25%-1.125rem)] min-w-[260px] h-80 rounded-[40px] overflow-hidden relative group cursor-pointer snap-start"
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
      <img src={img} alt={title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
      <div className="absolute bottom-8 left-8 z-20">
        <span className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-2 block">{type}</span>
        <h4 className="text-2xl font-bold mb-4">{title}</h4>
        <button className="text-sm font-bold bg-white/10 backdrop-blur-md px-6 py-2 rounded-full border border-white/20 hover:bg-white hover:text-black transition-all">
          Pedir Agora
        </button>
      </div>
    </motion.div>
  );
}
