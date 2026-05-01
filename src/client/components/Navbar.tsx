"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  UtensilsCrossed, 
  Clock, 
  CreditCard, 
  Ticket, 
  Truck, 
  MapPin, 
  Settings,
  LogOut,
  User,
  Users,
  Bike,
  UserCircle,
  ChevronDown,
  Store,
  MessageSquare,
  AlertCircle,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { name: "Produtos", icon: UtensilsCrossed, href: "/produtos" },
  { name: "Pedidos", icon: ShoppingBag, href: "/pedidos" },
  { 
    name: "Usuários", 
    icon: Users, 
    href: "/usuarios",
    subItems: [
      { name: "Entregadores", icon: Bike, href: "/usuarios/entregadores" },
      { name: "Meus Clientes", icon: UserCircle, href: "/usuarios/clientes" },
    ]
  },
  { name: "Logística", icon: Truck, href: "/logistica" },
  { name: "Chat", icon: MessageSquare, href: "/chat" },
  { name: "Configurações", icon: Settings, href: "/settings" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = async () => {
    try {
      // 1. Chama a API de logout no servidor para apagar os cookies HttpOnly
      await fetch("/api/auth/logout", { method: "POST" });
      
      // 2. Limpa LocalStorage (client side)
      localStorage.clear();
      
      // 3. Redireciona com Refresh total
      window.location.href = "/auth/login";
    } catch (error) {
      console.error("Erro ao deslogar:", error);
      // Fallback em caso de erro na rede
      window.location.href = "/auth/login";
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 h-20 glass-dark border-b border-white/5 flex items-center px-8">
        {/* Logo */}
        <div className="flex items-center gap-2 mr-12">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)]">
            <ShoppingBag className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white leading-none">Akipede</h1>
            <span className="text-[10px] text-white/40 uppercase tracking-widest">Delivery</span>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex items-center gap-1">
          {menuItems.map((item) => (
            <NavItem key={item.name} item={item} pathname={pathname} />
          ))}
        </nav>

        {/* Profile / Actions */}
        <div className="ml-auto flex items-center gap-4">
          <div className="h-8 w-[1px] bg-white/10 mx-2" />
          
          <div className="flex items-center gap-3 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
              <User className="w-4 h-4 text-blue-400" />
            </div>
            <div className="hidden md:block">
              <p className="text-xs font-bold text-white">Admin Estabelecimento</p>
              <p className="text-[10px] text-white/40">Plano Premium</p>
            </div>
          </div>

          <button 
            onClick={() => setShowLogoutModal(true)}
            className="p-2.5 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all group"
          >
            <LogOut className="w-5 h-5 transition-transform group-hover:scale-110" />
          </button>
        </div>
      </header>

      {/* Modal de Logout */}
      <AnimatePresence>
        {showLogoutModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#0F172A] border border-white/10 rounded-[32px] p-8 w-full max-w-sm shadow-2xl relative"
            >
              <button 
                onClick={() => setShowLogoutModal(false)}
                className="absolute right-6 top-6 p-2 text-white/20 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center space-y-6">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500">
                    <LogOut className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-white">Deseja sair?</h3>
                    <p className="text-white/40 text-sm">Você precisará fazer login novamente para acessar o dashboard.</p>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <button 
                    onClick={handleLogout}
                    className="w-full bg-red-500 hover:bg-red-400 text-white font-bold py-4 rounded-2xl shadow-lg shadow-red-500/20 transition-all flex items-center justify-center gap-2"
                  >
                    Confirmar e Sair
                  </button>
                  <button 
                    onClick={() => setShowLogoutModal(false)}
                    className="w-full bg-white/5 hover:bg-white/10 text-white/60 font-bold py-4 rounded-2xl transition-all"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

function NavItem({ item, pathname }: { item: any; pathname: string }) {
  const [isHovered, setIsHovered] = React.useState(false);
  const isActive = pathname.startsWith(item.href);

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={item.subItems ? "#" : item.href}>
        <div className={cn(
          "relative px-4 py-2 rounded-xl transition-all duration-300 group flex items-center gap-2",
          isActive 
            ? "text-blue-400" 
            : "text-white/60 hover:text-white hover:bg-white/5"
        )}>
          <item.icon className={cn("w-4 h-4", isActive ? "text-blue-400" : "text-white/40")} />
          <span className="text-sm font-medium">{item.name}</span>
          {item.subItems && <ChevronDown className={cn("w-3 h-3 transition-transform", isHovered && "rotate-180")} />}
          
          {isActive && (
            <motion.div 
              layoutId="active-nav"
              className="absolute bottom-[-12px] left-4 right-4 h-1 bg-blue-500 rounded-full shadow-[0_0_15px_#3b82f6]"
            />
          )}
        </div>
      </Link>

      <AnimatePresence>
        {item.subItems && isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-2 w-48 glass-dark border border-white/10 rounded-2xl p-2 shadow-2xl"
          >
            {item.subItems.map((sub: any) => {
              const isSubActive = pathname === sub.href;
              return (
                <Link key={sub.name} href={sub.href}>
                  <div className={cn(
                    "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all",
                    isSubActive 
                      ? "bg-blue-600/10 text-blue-400" 
                      : "text-white/40 hover:text-white hover:bg-white/5"
                  )}>
                    <sub.icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{sub.name}</span>
                  </div>
                </Link>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
