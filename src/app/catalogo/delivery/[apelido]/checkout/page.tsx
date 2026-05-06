"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Search, Plus, Navigation, ChevronRight, ArrowLeft, Home, Briefcase, Heart, Check, ShoppingBasket, User, LogIn, Loader2, Clock, Info, Store, Truck, AlertTriangle, CreditCard, QrCode, Banknote, Edit3, ClipboardCheck } from "lucide-react";
import Script from "next/script";
import { toast } from "react-hot-toast";
import { useRealtime } from "@/client/hooks/useRealtime";
import { useCallback } from "react";
import Cookies from "js-cookie";

declare global {
  interface Window {
    google: any;
  }
}

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const apelido = params.apelido as string;

  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [data, setData] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [orderType, setOrderType] = useState<'delivery' | 'pickup'>('delivery');
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);
  const [deliveryFee, setDeliveryFee] = useState<number | null>(null);
  const [isOutOfRange, setIsOutOfRange] = useState(false);
  const [storeCoords, setStoreCoords] = useState<{lat: number, lng: number} | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [needsChange, setNeedsChange] = useState<boolean>(false);
  const [changeFor, setChangeFor] = useState<string>('');
  const [showOrderReview, setShowOrderReview] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);
  const [newAddress, setNewAddress] = useState({
    lograduro: '',
    num: '',
    complemento: '',
    bairro: '',
    cidade: '',
    uf: '',
    cep: '',
    latitude: '',
    longitude: '',
    tipo: 'Casa',
    ponto_referencia: ''
  });

  // Refs para o Google Autocomplete
  const autocompleteRef = React.useRef<any>(null);
  const modalAutocompleteRef = React.useRef<any>(null);
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const modalInputRef = React.useRef<HTMLInputElement | null>(null);

  const initAutocomplete = () => {
    if (!window.google) return;

    // Autocomplete da busca principal
    if (inputRef.current && !autocompleteRef.current) {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
        componentRestrictions: { country: "br" },
        fields: ["address_components", "geometry", "formatted_address"],
      });

      autocompleteRef.current.addListener("place_changed", () => {
        const place = autocompleteRef.current?.getPlace();
        handlePlaceSelect(place);
      });
    }

    // Autocomplete do modal (se estiver aberto e o ref existir)
    if (modalInputRef.current && !modalAutocompleteRef.current) {
      modalAutocompleteRef.current = new window.google.maps.places.Autocomplete(modalInputRef.current, {
        componentRestrictions: { country: "br" },
        fields: ["address_components", "geometry", "formatted_address"],
      });

      modalAutocompleteRef.current.addListener("place_changed", () => {
        const place = modalAutocompleteRef.current?.getPlace();
        handlePlaceSelect(place);
      });
    }
  };

  const handlePlaceSelect = (place: any) => {
    if (!place?.geometry || !place.address_components) return;

    // Pega o nome formatado que o usuário viu na pesquisa (ex: Rua X, 123 - Bairro)
    // Remove o ", Brasil" do final para ficar mais limpo
    const formattedName = (place.formatted_address || "").replace(", Brasil", "").replace(", Brazil", "");

    const addressData: any = {};
    place.address_components.forEach((comp: any) => {
      const type = comp.types[0];
      if (type === "route") addressData.lograduro = comp.long_name;
      if (type === "street_number") addressData.num = comp.long_name;
      if (type === "sublocality_level_1") addressData.bairro = comp.long_name;
      if (type === "administrative_area_level_2") addressData.cidade = comp.long_name;
      if (type === "administrative_area_level_1") addressData.uf = comp.short_name;
      if (type === "postal_code") addressData.cep = comp.long_name;
    });

    setNewAddress(prev => ({
      ...prev,
      // Usamos o nome formatado para o campo visual "Endereço"
      lograduro: formattedName || addressData.lograduro || "",
      num: addressData.num || prev.num,
      bairro: addressData.bairro || "",
      cidade: addressData.cidade || "",
      uf: addressData.uf || "",
      cep: addressData.cep || "",
      latitude: String(place.geometry?.location?.lat() || ""),
      longitude: String(place.geometry?.location?.lng() || "")
    }));

    setShowAddressModal(true);
  };

  const handleAddAddress = async () => {
    if (!newAddress.lograduro || !newAddress.num) {
      toast.error("Por favor, preencha pelo menos o logradouro e número.");
      return;
    }

    setAddressLoading(true);
    try {
      const res = await fetch("/api/usuario/enderecos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAddress)
      });

      if (!res.ok) throw new Error("Erro ao salvar endereço");

      const saved = await res.json();
      toast.success("Endereço adicionado com sucesso!");
      
      // Atualiza lista local
      if (user) {
        setUser({
          ...user,
          enderecos: [...(user.enderecos || []), saved]
        });
      }
      
      setSelectedAddress(saved.id_endereco);
      setShowAddressModal(false);
      setSearchTerm("");
    } catch (error) {
      toast.error("Erro ao salvar endereço");
    } finally {
      setAddressLoading(false);
    }
  };

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocalização não suportada pelo seu navegador.");
      return;
    }

    const toastId = toast.loading("Obtendo sua localização...");
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`);
          const data = await res.json();
          
          if (data.results && data.results[0]) {
            const place = data.results[0];
            const addressData: any = {};
            place.address_components.forEach((comp: any) => {
              const type = comp.types[0];
              if (type === "route") addressData.lograduro = comp.long_name;
              if (type === "street_number") addressData.num = comp.long_name;
              if (type === "sublocality_level_1") addressData.bairro = comp.long_name;
              if (type === "administrative_area_level_2") addressData.cidade = comp.long_name;
              if (type === "administrative_area_level_1") addressData.uf = comp.short_name;
              if (type === "postal_code") addressData.cep = comp.long_name;
            });

            // Nome formatado para o campo visual (removendo Brasil)
            const formattedName = (place.formatted_address || "").replace(", Brasil", "").replace(", Brazil", "");

            setNewAddress(prev => ({
              ...prev,
              lograduro: formattedName || addressData.lograduro || "",
              num: addressData.num || "",
              bairro: addressData.bairro || "",
              cidade: addressData.cidade || "",
              uf: addressData.uf || "",
              cep: addressData.cep || "",
              latitude: String(latitude),
              longitude: String(longitude)
            }));
            setShowAddressModal(true);
            toast.success("Localização obtida!", { id: toastId });
          }
        } catch (error) {
          toast.error("Erro ao identificar endereço", { id: toastId });
        }
      },
      (error) => {
        toast.error("Erro ao obter localização. Verifique as permissões.", { id: toastId });
      }
    );
  };

  // Carregar carrinho para mostrar resumo
  const cartData = Cookies.get(`cart_${apelido}`);
  const cart = cartData ? JSON.parse(cartData) : [];
  const total = cart.reduce((sum: number, item: any) => sum + item.valor_total, 0);

  // Número do pedido no formato AAAAMMDD + sequencial (Ex: 20260503001)
  const orderNumber = useMemo(() => {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const datePart = `${yyyy}${mm}${dd}`;
    
    // Como ainda não temos o contador real do banco aqui, 
    // geramos um sufixo que simula o sequencial de 3 dígitos (ou mais se necessário)
    const sequential = "001"; 
    return `${datePart}${sequential}`;
  }, []);

  // Carregar estados do checkout (DB + Cookies fallback)
  useEffect(() => {
    async function loadCheckoutPrefs() {
      if (!data?.estabelecimento?.id_estabelecimento) return;

      try {
        const res = await fetch(`/api/pedidos/active?estabelecimentoId=${data.estabelecimento.id_estabelecimento}`);
        if (res.ok) {
          const prefs = await res.json();
          if (prefs.endereco) setSelectedAddress(prefs.endereco);
          if (prefs.forma_pagamento) setPaymentMethod(prefs.forma_pagamento);
          if (prefs.troco) {
            setNeedsChange(true);
            setChangeFor(prefs.troco.toString());
          }
          
          // Se recuperou algo do banco, não precisa olhar os cookies
          if (prefs.endereco || prefs.forma_pagamento) return;
        }
      } catch (e) {
        console.error("Erro ao carregar preferências do banco:", e);
      }

      // Fallback para Cookies se não houver nada no banco ou erro
      const savedAddress = Cookies.get(`checkout_addr_${apelido}`);
      const savedPayment = Cookies.get(`checkout_pay_${apelido}`);
      const savedOrderType = Cookies.get(`checkout_type_${apelido}`);
      
      if (savedAddress) setSelectedAddress(savedAddress);
      if (savedPayment) setPaymentMethod(savedPayment);
      if (savedOrderType) setOrderType(savedOrderType as any);
    }

    loadCheckoutPrefs();
  }, [data?.estabelecimento?.id_estabelecimento, apelido]);

  // Persistir mudanças nos cookies
  useEffect(() => {
    if (selectedAddress) Cookies.set(`checkout_addr_${apelido}`, selectedAddress, { expires: 1 });
  }, [selectedAddress, apelido]);

  useEffect(() => {
    if (paymentMethod) Cookies.set(`checkout_pay_${apelido}`, paymentMethod, { expires: 1 });
  }, [paymentMethod, apelido]);

  useEffect(() => {
    Cookies.set(`checkout_type_${apelido}`, orderType, { expires: 1 });
  }, [orderType, apelido]);

  // Salvar progresso no Banco de Dados (Draft) em tempo real
  useEffect(() => {
    const saveDraft = async () => {
      if (!data?.estabelecimento?.id_estabelecimento || !user?.id) return;

      try {
        await fetch("/api/pedidos/draft", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            estabelecimentoId: data.estabelecimento.id_estabelecimento,
            enderecoId: selectedAddress,
            paymentMethodId: paymentMethod,
            needsChange,
            changeFor,
            subtotal: total,
            taxaEntrega: deliveryFee || 0,
            total: (total || 0) + (deliveryFee || 0)
          })
        });
      } catch (e) {
        console.error("Erro ao salvar rascunho:", e);
      }
    };

    // Pequeno delay para evitar excesso de requisições enquanto o usuário digita troco etc
    const timeout = setTimeout(saveDraft, 1000);
    return () => clearTimeout(timeout);
  }, [selectedAddress, paymentMethod, needsChange, changeFor, total, deliveryFee, data?.estabelecimento?.id_estabelecimento, user?.id]);

  // Inicializa se o script já estiver carregado (ex: navegação entre páginas)
  useEffect(() => {
    if (typeof window !== "undefined" && window.google) {
      initAutocomplete();
    }
  }, [user, orderType, showAddressModal]);

  // Obter coordenadas da loja
  useEffect(() => {
    if (typeof window !== "undefined" && window.google && data?.estabelecimento && !storeCoords) {
      const geocoder = new window.google.maps.Geocoder();
      const addr = `${data.estabelecimento.endereco}, ${data.estabelecimento.numero}`;
      geocoder.geocode({ address: addr }, (results: any, status: any) => {
        if (status === "OK" && results[0]) {
          const loc = results[0].geometry.location;
          setStoreCoords({ lat: loc.lat(), lng: loc.lng() });
        } else {
          console.warn("Não foi possível geocodificar o endereço da loja. A validação de distância será desativada temporariamente.", status);
          // Fallback para não travar o fluxo se a API falhar
          setStoreCoords(null); 
        }
      });
    }
  }, [data?.estabelecimento, storeCoords]);

  const checkDeliveryRange = (clientLat: string, clientLng: string) => {
    // Se não temos as coordenadas da loja (erro de API), não bloqueamos o cliente
    if (!storeCoords) {
      console.log("Validação de distância pulada: Coordenadas da loja não disponíveis.");
      setIsOutOfRange(false);
      setDeliveryFee(0); // Ou uma taxa padrão
      return;
    }

    if (!clientLat || !clientLng || !data?.estabelecimento?.area_entrega_area_entrega_estabelecimentoToestabelecimento) return;

    const lat1 = storeCoords.lat;
    const lng1 = storeCoords.lng;
    const lat2 = parseFloat(clientLat);
    const lng2 = parseFloat(clientLng);

    // Distância radial simples (Haversine) em KM
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              (Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2));
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;

    console.log("Distância calculada:", distance.toFixed(2), "km");

    // Procura uma área que atenda essa distância
    const areas = data.estabelecimento.area_entrega_area_entrega_estabelecimentoToestabelecimento;
    const matchingArea = areas.find((area: any) => {
      const min = parseFloat(area.distancia_minima || "0");
      const max = parseFloat(area.distancia_max || "999");
      return distance >= min && distance <= max;
    });

    if (matchingArea) {
      setDeliveryFee(parseFloat(matchingArea.valor_entrega || "0"));
      setIsOutOfRange(false);
    } else {
      setDeliveryFee(null);
      setIsOutOfRange(true);
      // Removido toast.error daqui para evitar erro de ciclo de renderização
    }
  };

  // Validar distância sempre que mudar endereço selecionado
  useEffect(() => {
    if (selectedAddress && user?.enderecos && orderType === 'delivery') {
      const addr = user.enderecos.find((a: any) => a.id_endereco === selectedAddress);
      if (addr && addr.latitude && addr.longitude) {
        checkDeliveryRange(addr.latitude, addr.longitude);
      }
    } else if (orderType === 'pickup') {
      setIsOutOfRange(false);
      setDeliveryFee(0);
    }
  }, [selectedAddress, storeCoords, orderType, user?.enderecos]);

  const handleConfirmOrder = async () => {
    if (orderLoading) return;

    setOrderLoading(true);
    try {
      const payload = {
        cart,
        estabelecimentoId: data?.estabelecimento?.id_estabelecimento,
        enderecoId: selectedAddress,
        orderType,
        paymentMethodId: paymentMethod,
        needsChange,
        changeFor,
        subtotal: total,
        taxaEntrega: deliveryFee || 0,
        total: (total || 0) + (deliveryFee || 0)
      };

      const res = await fetch("/api/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Erro ao processar pedido");
      }

      const result = await res.json();
      toast.success("Pedido realizado com sucesso!");
      
      // Limpa o carrinho e estados do checkout
      Cookies.remove(`cart_${apelido}`);
      Cookies.remove(`checkout_addr_${apelido}`);
      Cookies.remove(`checkout_pay_${apelido}`);
      Cookies.remove(`checkout_type_${apelido}`);
      
      // Redireciona para acompanhamento
      router.push(`/catalogo/delivery/${apelido}/pedido/${result.id_pedido}`);
    } catch (error: any) {
      toast.error(error.message);
      setOrderLoading(false);
    }
  };

  // Verificar sessão do usuário
  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (e) {
        console.error("Erro ao verificar sessão:", e);
      } finally {
        setIsLoading(false);
      }
    }
    checkSession();
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`/api/catalogo/publico/${apelido}?tipo=delivery&t=${Date.now()}`, {
        cache: 'no-store'
      });
      const result = await res.json();
      if (res.ok) setData(result);
    } catch (err) {
      console.error("Erro ao carregar dados do estabelecimento:", err);
    }
  }, [apelido]);

  useEffect(() => {
    if (apelido) fetchData();
  }, [apelido, fetchData]);

  // Atualização em tempo real no Checkout
  const tenantId = data?.estabelecimento?.id_estabelecimento;
  useRealtime(
    tenantId ? `catalog-${tenantId}` : "",
    "catalog-updated",
    fetchData
  );

  const getAddressIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case "casa": return Home;
      case "trabalho": return Briefcase;
      default: return Heart;
    }
  };

  const getAddressColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case "casa": return "bg-blue-500";
      case "trabalho": return "bg-orange-500";
      default: return "bg-pink-500";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#f45145] animate-spin mb-4" />
        <p className="text-gray-500 font-medium italic">Preparando seu checkout...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans pb-32">
      {/* HEADER PREMIUM REPLICADO DO CARDÁPIO (IDENTIDADE TOTAL) */}
      <header className="sticky top-0 z-50 bg-[#f45145] p-6 shadow-xl shadow-[#f45145]/10 rounded-b-[40px]">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4">
          <div className="flex items-center gap-4">
             <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
                <ShoppingBasket className="w-8 h-8 text-white fill-white/20" />
             </div>
             <div>
                <h1 className="text-lg font-black text-white tracking-tighter uppercase leading-tight">
                  {data?.estabelecimento?.razao_social || 'Akipede Delivery'}
                </h1>
                {user && (
                  <p className="text-[10px] font-bold text-white/90 uppercase tracking-widest -mt-1">
                    Olá, {user.nome}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-1">
                   <div className={`w-2 h-2 rounded-full ${data?.status?.aberto ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
                   <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest">
                     {data?.status?.aberto ? 'Aberto agora' : 'Fechado'}
                   </p>
                   <span className="text-white/20">|</span>
                   <p className="text-[10px] font-black text-white uppercase tracking-widest">
                     PEDIDO #{orderNumber}
                   </p>
                </div>
             </div>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="relative">
              <button 
                onClick={() => router.push(`/catalogo/delivery/${apelido}`)}
                className={`p-3 rounded-2xl transition-all backdrop-blur-md ${cart.length > 0 ? "bg-white text-[#f45145]" : "bg-white/20 text-white"}`}
              >
                <ShoppingBasket className={`w-6 h-6 ${cart.length > 0 ? "fill-[#f45145]/20" : "text-white/40"}`} />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#f45145] text-white text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-lg animate-bounce">
                    {cart.length}
                  </span>
                )}
              </button>
             </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-2xl mx-auto p-4 space-y-8 mt-4">
        {/* AVISO DE ESTABELECIMENTO FECHADO */}
        {data && !data.status?.aberto && (
          <div className="bg-red-50 p-4 rounded-2xl text-center text-red-600 font-bold">
            Estabelecimento fechado no momento.
          </div>
        )}

        {!user ? (
          /* ESTADO DESLOGADO (Fig 33 modificado) */
          <div className="space-y-6">
            <div className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-xl shadow-gray-200/50 text-center space-y-6">
              <div className="w-20 h-20 bg-orange-50 rounded-3xl flex items-center justify-center mx-auto">
                <User className="w-10 h-10 text-[#f45145]" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-gray-800 tracking-tight">Identifique-se para continuar</h2>
                <p className="text-[#39404A] text-sm font-medium px-4">Para carregar seus endereços e finalizar o pedido, você precisa estar logado.</p>
              </div>
              <div className="pt-4 flex flex-col gap-3">
                <button 
                  onClick={() => router.push(`/auth/login?callbackUrl=/catalogo/delivery/${apelido}/checkout`)}
                  className="w-full bg-[#f45145] text-white font-black py-5 rounded-[24px] shadow-lg shadow-[#f45145]/20 flex items-center justify-center gap-3 hover:bg-[#d43f35] transition-all active:scale-95 border-b-4 border-black/10"
                >
                  <LogIn className="w-5 h-5" />
                  FAZER LOGIN AGORA
                </button>
                <button 
                  onClick={() => router.push(`/auth/register?callbackUrl=/catalogo/delivery/${apelido}/checkout`)}
                  className="w-full bg-white text-[#9CA3AF] font-bold py-5 rounded-[24px] border-2 border-gray-100 hover:bg-gray-50 transition-all active:scale-95"
                >
                  NÃO TENHO CONTA
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* ESTADO LOGADO - SELEÇÃO DE ENDEREÇO */
          <div className="space-y-8">
            {/* TOGGLE ENTREGA / RETIRADA */}
            <div className="bg-white p-2 rounded-[32px] flex gap-2 border border-gray-100 shadow-sm">
              <button 
                onClick={() => setOrderType('delivery')}
                className={`flex-1 py-4 rounded-[26px] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${orderType === 'delivery' ? 'bg-[#f45145] text-white shadow-lg shadow-[#f45145]/20' : 'text-gray-400 hover:bg-gray-50'}`}
              >
                <Truck className="w-5 h-5" />
                Entrega
              </button>
              <button 
                onClick={() => setOrderType('pickup')}
                className={`flex-1 py-4 rounded-[26px] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${orderType === 'pickup' ? 'bg-black text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50'}`}
              >
                <Store className="w-5 h-5" />
                Retirada
              </button>
            </div>

            {orderType === 'delivery' ? (
              <>
                {/* BUSCA DE NOVO ENDEREÇO (Google Places) */}
                <div className="relative group">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2">
                    <Search className="w-5 h-5 text-gray-300" />
                  </div>
                  <input 
                    ref={inputRef}
                    type="text" 
                    placeholder="Buscar novo endereço e número..." 
                    className="w-full bg-white border border-gray-200 rounded-[32px] pl-16 pr-8 py-6 text-sm shadow-sm focus:outline-none focus:ring-4 focus:ring-[#f45145]/5 transition-all"
                  />
                  <Script
                    src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
                    onLoad={initAutocomplete}
                    strategy="afterInteractive"
                  />
                </div>

                {/* ADICIONAR NOVO (MANUAL) - MOVIDO PARA CIMA */}
                <button 
                  onClick={() => {
                    setNewAddress({
                      lograduro: '', num: '', complemento: '', bairro: '', cidade: '', uf: '', cep: '', latitude: '', longitude: '', tipo: 'Casa', ponto_referencia: ''
                    });
                    setShowAddressModal(true);
                  }}
                  className="w-full bg-transparent py-4 px-2 flex items-center justify-start gap-4 hover:bg-gray-100/50 transition-all active:scale-95 group rounded-2xl"
                >
                  <div className="w-10 h-10 bg-[#f45145]/10 rounded-xl flex items-center justify-center group-hover:bg-[#f45145] group-hover:text-white transition-all duration-300">
                    <Plus className="w-5 h-5 text-[#f45145] group-hover:text-white" />
                  </div>
                  <div className="text-left">
                    <span className="block text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] leading-none mb-1">Não encontrou o endereço?</span>
                    <span className="block text-xs font-black text-[#f45145] uppercase tracking-tight">Cadastrar Manualmente</span>
                  </div>
                </button>

                {/* ENDEREÇOS SALVOS */}
                <div className="space-y-4">
                  {isOutOfRange && orderType === 'delivery' && (
                    <div className="bg-red-50 border border-red-100 rounded-2xl p-4 mb-4">
                      <div className="flex gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
                        <div>
                          <p className="text-xs font-black text-red-800 uppercase tracking-tight">Região Não Atendida</p>
                          <p className="text-[10px] text-red-600 font-medium mt-1 leading-relaxed">
                            O endereço selecionado está fora do nosso raio de entrega. 
                            Você pode <strong className="cursor-pointer underline" onClick={() => setOrderType('pickup')}>escolher a opção de Retirada</strong> para continuar seu pedido.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3 px-4">
                    <MapPin className="w-4 h-4 text-[#f45145]" />
                    <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Endereços Salvos</h2>
                  </div>

                  <div className="space-y-4">
                    {user.enderecos?.length > 0 ? (
                      user.enderecos.map((addr: any) => {
                        const Icon = getAddressIcon(addr.tipo);
                        const color = getAddressColor(addr.tipo);
                        return (
                          <button 
                            key={addr.id_endereco}
                            onClick={() => setSelectedAddress(addr.id_endereco)}
                            className={`w-full text-left bg-white rounded-[32px] p-6 flex items-center justify-between transition-all border-2 ${selectedAddress === addr.id_endereco ? "border-[#f45145] shadow-lg shadow-[#f45145]/5 scale-[1.02]" : "border-transparent shadow-sm hover:border-gray-100"}`}
                          >
                            <div className="flex items-center gap-5">
                              <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                                <Icon className="w-6 h-6" />
                              </div>
                              <div>
                                <h4 className="font-black text-gray-800 uppercase tracking-tight text-base">{addr.tipo || "Endereço"}</h4>
                                <p className="text-xs text-gray-400 font-medium mt-1">
                                  {addr.lograduro}, {addr.num}
                                </p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight opacity-70">
                                  {addr.bairro} - {addr.cidade}/{addr.uf}
                                </p>
                                {addr.complemento && (
                                  <p className="text-[10px] text-[#39404A] font-medium leading-relaxed italic opacity-80 mt-1">{addr.complemento}</p>
                                )}
                              </div>
                            </div>
                            {selectedAddress === addr.id_endereco && (
                              <div className="bg-[#f45145] p-2 rounded-full text-white">
                                <Check className="w-4 h-4" />
                              </div>
                            )}
                          </button>
                        );
                      })
                    ) : (
                      <div className="text-center py-10 bg-white rounded-[32px] border border-dashed border-gray-200">
                        <p className="text-sm text-gray-400 font-medium italic">Nenhum endereço salvo ainda.</p>
                      </div>
                    )}
                  </div>
                </div>

               </>
            ) : (
              /* INFO PARA RETIRADA */
              <div className="bg-black text-white rounded-[40px] p-8 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                    <Store className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-black uppercase tracking-tight">Retirar na Loja</h3>
                    <p className="text-xs text-white/50">Você retira seu pedido diretamente com a gente.</p>
                  </div>
                </div>
                <div className="p-6 bg-white/5 rounded-3xl space-y-2 border border-white/10">
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Endereço da Loja</p>
                  <p className="text-sm font-medium">{data?.estabelecimento?.endereco}, {data?.estabelecimento?.numero}</p>
                  {data?.estabelecimento?.complemento && (
                    <p className="text-xs text-white/60 italic">{data?.estabelecimento?.complemento}</p>
                  )}
                  <div className="flex gap-2 mt-4">
                    <button 
                      onClick={() => {
                        const addr = `${data?.estabelecimento?.endereco}, ${data?.estabelecimento?.numero}`;
                        window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addr)}`, '_blank');
                      }}
                      className="flex-1 bg-white/10 hover:bg-white/20 text-white text-[10px] font-black py-3 rounded-xl border border-white/10 transition-all flex items-center justify-center gap-2"
                    >
                      <MapPin className="w-3 h-3" />
                      MAPS
                    </button>
                    <button 
                      onClick={() => {
                        const addr = `${data?.estabelecimento?.endereco}, ${data?.estabelecimento?.numero}`;
                        window.open(`https://m.uber.com/ul/?action=setPickup&pickup=my_location&dropoff[formatted_address]=${encodeURIComponent(addr)}`, '_blank');
                      }}
                      className="flex-1 bg-white/10 hover:bg-white/20 text-white text-[10px] font-black py-3 rounded-xl border border-white/10 transition-all flex items-center justify-center gap-2"
                    >
                      <Navigation className="w-3 h-3" />
                      UBER
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        {/* FORMA DE PAGAMENTO */}
        {(selectedAddress || orderType === 'pickup') && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 pb-20"
          >
            <div className="flex items-center gap-3 px-4">
              <CreditCard className="w-4 h-4 text-[#f45145]" />
              <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Forma de Pagamento</h2>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {data?.estabelecimento?.lista_forma_pagamento_lista_forma_pagamento_estabelecimentoToestabelecimento?.map((item: any) => {
                const method = item.dominio;
                const isSelected = paymentMethod === method.id_dominio;
                const isPix = method.nome?.toLowerCase().includes('pix') || method.codigo === 'PIX';
                const isCash = method.nome?.toLowerCase().includes('dinheiro') || method.codigo === 'DIN';
                
                let Icon = CreditCard;
                if (isPix) Icon = QrCode;
                if (isCash) Icon = Banknote;

                return (
                  <div key={item.id_lista_forma_pagamento} className="space-y-3">
                    <button
                      onClick={() => setPaymentMethod(method.id_dominio)}
                      className={`w-full text-left bg-white rounded-[32px] p-6 flex items-center justify-between transition-all border-2 ${isSelected ? "border-[#f45145] shadow-lg shadow-[#f45145]/5 scale-[1.01]" : "border-transparent shadow-sm hover:border-gray-100"}`}
                    >
                      <div className="flex items-center gap-5">
                        <div className={`w-14 h-14 ${isSelected ? 'bg-[#f45145]' : 'bg-gray-100'} rounded-2xl flex items-center justify-center ${isSelected ? 'text-white' : 'text-gray-400'} shadow-lg transition-colors`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-black text-gray-800 uppercase tracking-tight text-base">{method.nome}</h4>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight opacity-70">
                            {isPix ? 'Pague na entrega via PIX' : isCash ? 'Pague em dinheiro na entrega' : 'Pague com cartão na entrega'}
                          </p>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="bg-[#f45145] p-2 rounded-full text-white">
                          <Check className="w-4 h-4" />
                        </div>
                      )}
                    </button>

                    {/* DETALHES PIX */}
                    <AnimatePresence>
                      {isSelected && isPix && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="bg-orange-50 border border-orange-100 rounded-[24px] p-6 mx-2 space-y-4">
                            <div className="flex items-start gap-4">
                               <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0">
                                  <QrCode className="w-5 h-5 text-orange-500" />
                               </div>
                               <div>
                                  <p className="text-[10px] font-black text-orange-800 uppercase tracking-tight">Chave PIX da Loja</p>
                                  <p className="text-sm font-black text-orange-900 break-all">{data?.estabelecimento?.pix_chave || 'Não informada'}</p>
                                  {data?.estabelecimento?.pix_nome && (
                                    <p className="text-[9px] text-orange-600 font-bold uppercase mt-1">Favorecido: {data?.estabelecimento?.pix_nome}</p>
                                  )}
                               </div>
                            </div>
                            <p className="text-[10px] text-orange-600 font-medium leading-relaxed italic">
                              Realize o pagamento no momento da entrega apontando a câmera do seu celular para o QR Code do entregador ou usando a chave acima.
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* DETALHES DINHEIRO (TROCO) */}
                    <AnimatePresence>
                      {isSelected && isCash && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="bg-green-50 border border-green-100 rounded-[24px] p-6 mx-2 space-y-4">
                            <div className="flex items-center justify-between">
                               <p className="text-xs font-black text-green-800 uppercase tracking-tight">Precisa de troco?</p>
                               <div className="flex bg-white rounded-xl p-1 shadow-sm">
                                  <button 
                                    onClick={() => setNeedsChange(true)}
                                    className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${needsChange ? 'bg-green-500 text-white' : 'text-gray-400'}`}
                                  >
                                    SIM
                                  </button>
                                  <button 
                                    onClick={() => {
                                      setNeedsChange(false);
                                      setChangeFor('');
                                    }}
                                    className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${!needsChange ? 'bg-gray-200 text-gray-700' : 'text-gray-400'}`}
                                  >
                                    NÃO
                                  </button>
                               </div>
                            </div>
                            
                            {needsChange && (
                              <motion.div 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-2 pt-2"
                              >
                                <label className="text-[9px] font-black text-green-700 uppercase ml-2">Troco para quanto?</label>
                                <div className="relative">
                                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-green-700 font-black text-sm">R$</span>
                                  <input 
                                    type="text"
                                    value={changeFor}
                                    onChange={(e) => setChangeFor(e.target.value)}
                                    placeholder="Ex: 50,00"
                                    className="w-full bg-white border-2 border-green-200 rounded-2xl p-4 pl-10 text-sm font-black text-green-900 focus:outline-none focus:border-green-500 transition-all"
                                  />
                                </div>
                              </motion.div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}

              {(!data?.estabelecimento?.lista_forma_pagamento_lista_forma_pagamento_estabelecimentoToestabelecimento || data?.estabelecimento?.lista_forma_pagamento_lista_forma_pagamento_estabelecimentoToestabelecimento.length === 0) && (
                <div className="bg-yellow-50 border border-yellow-100 rounded-[32px] p-8 text-center space-y-2">
                  <Info className="w-8 h-8 text-yellow-500 mx-auto" />
                  <p className="text-sm font-black text-yellow-800 uppercase tracking-tight">Formas de Pagamento Indisponíveis</p>
                  <p className="text-[10px] text-yellow-600 font-medium italic">O estabelecimento ainda não configurou as formas de pagamento aceitas.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </main>

      {/* MODAL DE NOVO ENDEREÇO */}
      <AnimatePresence>
        {showAddressModal && (
          <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddressModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="bg-white w-full max-w-lg rounded-[40px] p-8 relative z-10 space-y-6 shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black uppercase tracking-tight">Confirmar Endereço</h3>
                <button onClick={() => setShowAddressModal(false)} className="p-2 bg-gray-100 rounded-full">
                  <Plus className="w-5 h-5 rotate-45" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex justify-end">
                  <button 
                    type="button"
                    onClick={handleUseLocation}
                    className="flex items-center gap-2 text-[#f45145] hover:opacity-80 transition-all group"
                  >
                    <Navigation className="w-3 h-3" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Usar minha localização atual</span>
                  </button>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black text-gray-400 uppercase ml-2">Endereço (Busque o endereço)</label>
                  <input 
                    ref={modalInputRef}
                    type="text" 
                    value={newAddress.lograduro} 
                    onChange={(e) => setNewAddress({...newAddress, lograduro: e.target.value})}
                    className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-medium"
                    placeholder="Ex: Rua das Flores..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                   <div className="space-y-1">
                      <label className="text-[9px] font-black text-gray-400 uppercase ml-2">Nº</label>
                      <input 
                        type="text" 
                        value={newAddress.num} 
                        onChange={(e) => setNewAddress({...newAddress, num: e.target.value})}
                        className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-medium"
                      />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[9px] font-black text-gray-400 uppercase ml-2">Complemento</label>
                      <input 
                        type="text" 
                        value={newAddress.complemento} 
                        onChange={(e) => setNewAddress({...newAddress, complemento: e.target.value})}
                        className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-medium"
                        placeholder="Ex: Bloco A, Apt 10..."
                      />
                   </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black text-gray-400 uppercase ml-2">Ponto de Referência</label>
                  <input 
                    type="text" 
                    value={newAddress.ponto_referencia} 
                    onChange={(e) => setNewAddress({...newAddress, ponto_referencia: e.target.value})}
                    className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-medium"
                    placeholder="Ex: Próximo ao mercado..."
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black text-gray-400 uppercase ml-2">Tipo de Local</label>
                  <select 
                    value={newAddress.tipo}
                    onChange={(e) => setNewAddress({...newAddress, tipo: e.target.value})}
                    className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-medium appearance-none"
                  >
                    <option value="Casa">Casa</option>
                    <option value="Trabalho">Trabalho</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>
              </div>

              <button 
                onClick={handleAddAddress}
                disabled={addressLoading}
                className="w-full bg-black text-white font-black py-5 rounded-[24px] shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50"
              >
                {addressLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'SALVAR ENDEREÇO'}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FOOTER FIXO PARA PROSSEGUIR */}
      <AnimatePresence>
        {(selectedAddress || orderType === 'pickup') && (
          <motion.div 
            initial={{ y: 100 }} 
            animate={{ y: 0 }} 
            exit={{ y: 100 }}
            className="fixed bottom-0 inset-x-0 bg-white border-t border-gray-100 p-6 z-50 shadow-[0_-20px_40px_rgba(0,0,0,0.05)] rounded-t-[32px]"
          >
             <div className="max-w-2xl mx-auto space-y-4">
                {/* Resumo de Valores */}
                <div className="flex flex-col gap-2 px-6 pb-2">
                   <div className="flex justify-between items-center text-xs text-gray-400 font-bold uppercase tracking-widest">
                      <span>Subtotal</span>
                      <span>{total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                   </div>
                   {orderType === 'delivery' && (
                     <div className="flex justify-between items-center text-xs text-gray-400 font-bold uppercase tracking-widest">
                        <span>Taxa de Entrega</span>
                        <span className={deliveryFee === 0 ? "text-green-500" : ""}>
                          {deliveryFee === null ? '--' : deliveryFee === 0 ? 'Grátis' : deliveryFee.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </span>
                     </div>
                   )}
                   <div className="flex justify-between items-center pt-2 border-t border-gray-50">
                      <span className="text-sm font-black text-gray-800 uppercase tracking-tight">Total Geral</span>
                      <span className="text-xl font-black text-[#f45145]">
                        {((total || 0) + (deliveryFee || 0)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </span>
                   </div>
                </div>

                <button 
                  onClick={() => setShowOrderReview(true)}
                  disabled={(orderType === 'delivery' && (!selectedAddress || isOutOfRange)) || !paymentMethod}
                  className={`w-full text-white font-black py-6 rounded-[24px] shadow-2xl flex justify-between px-10 items-center transition-all hover:scale-[1.01] active:scale-95 group border-b-4 border-black/10 ${
                    ((orderType === 'delivery' && isOutOfRange) || !paymentMethod) ? 'bg-gray-400 cursor-not-allowed shadow-none' : 'bg-[#f45145] shadow-[#f45145]/30'
                  }`}
                >
                  <span className="text-sm tracking-widest uppercase italic">
                    {isOutOfRange && orderType === 'delivery' ? 'REGIÃO NÃO ATENDIDA' : !paymentMethod ? 'ESCOLHA O PAGAMENTO' : 'FINALIZAR PEDIDO'}
                  </span>
                  <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* DETALHAMENTO COMPLETO DO PEDIDO (REVIEW) */}
      <AnimatePresence>
        {showOrderReview && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
             <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowOrderReview(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="bg-white w-full max-w-2xl h-[90vh] sm:h-auto sm:max-h-[85vh] rounded-t-[40px] sm:rounded-[40px] overflow-hidden flex flex-col relative z-10 shadow-2xl"
            >
               {/* Header do Review */}
               <div className="bg-[#f45145] p-8 text-white flex justify-between items-center">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                        <ClipboardCheck className="w-6 h-6" />
                     </div>
                     <div>
                        <h2 className="text-xl font-black uppercase tracking-tight">Revise seu Pedido</h2>
                        <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest">Confirme os detalhes antes de enviar</p>
                     </div>
                  </div>
                  <button 
                    onClick={() => setShowOrderReview(false)}
                    className="w-10 h-10 bg-black/20 rounded-full flex items-center justify-center hover:bg-black/40 transition-all"
                  >
                    <Plus className="w-6 h-6 rotate-45" />
                  </button>
               </div>

               <div className="flex-1 overflow-y-auto p-8 space-y-8">
                  {/* ITENS DO CARRINHO */}
                  <div className="space-y-4">
                     <div className="flex items-center gap-3">
                        <ShoppingBasket className="w-4 h-4 text-[#f45145]" />
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Itens do Pedido</h3>
                     </div>
                     <div className="space-y-3">
                        {cart.map((item: any, idx: number) => (
                           <div key={idx} className="bg-gray-50 rounded-2xl p-4 flex justify-between items-start">
                              <div className="space-y-1">
                                 <div className="flex items-center gap-2">
                                    <span className="w-6 h-6 bg-[#f45145] text-white text-[10px] font-black rounded-lg flex items-center justify-center">
                                       {item.quantidade}x
                                    </span>
                                    <p className="font-black text-gray-800 text-sm uppercase">{item.nome}</p>
                                 </div>
                                 {item.complements?.map((c: any) => (
                                    <p key={c.id} className="text-[10px] text-gray-500 font-medium ml-8">
                                       + {c.nome} {c.quantidade > 1 ? `(${c.quantidade}x)` : ''}
                                    </p>
                                 ))}
                                 {item.observacao && (
                                    <p className="text-[10px] text-[#f45145] font-bold italic ml-8 mt-1">
                                       Obs: {item.observacao}
                                    </p>
                                 )}
                              </div>
                              <p className="font-black text-gray-800 text-sm">
                                 {item.valor_total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                              </p>
                           </div>
                        ))}
                     </div>
                  </div>

                  {/* ENDEREÇO / ENTREGA */}
                  <div className="space-y-4">
                     <div className="flex items-center gap-3">
                        {orderType === 'delivery' ? <Truck className="w-4 h-4 text-[#f45145]" /> : <Store className="w-4 h-4 text-[#f45145]" />}
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                           {orderType === 'delivery' ? 'Endereço de Entrega' : 'Retirada na Loja'}
                        </h3>
                     </div>
                     <div className="bg-gray-50 rounded-2xl p-5 flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                           {orderType === 'delivery' ? <MapPin className="w-6 h-6 text-[#f45145]" /> : <Store className="w-6 h-6 text-[#f45145]" />}
                        </div>
                        <div>
                           {orderType === 'delivery' ? (
                              <>
                                 <p className="font-black text-gray-800 text-sm uppercase">
                                    {user.enderecos?.find((a: any) => a.id_endereco === selectedAddress)?.lograduro}, {user.enderecos?.find((a: any) => a.id_endereco === selectedAddress)?.num}
                                 </p>
                                 <p className="text-[10px] text-gray-500 font-bold uppercase">
                                    {user.enderecos?.find((a: any) => a.id_endereco === selectedAddress)?.bairro} - {user.enderecos?.find((a: any) => a.id_endereco === selectedAddress)?.cidade}/{user.enderecos?.find((a: any) => a.id_endereco === selectedAddress)?.uf}
                                 </p>
                              </>
                           ) : (
                              <>
                                 <p className="font-black text-gray-800 text-sm uppercase">Retirada no Balcão</p>
                                 <p className="text-[10px] text-gray-500 font-bold uppercase">{data?.estabelecimento?.razao_social}</p>
                              </>
                           )}
                        </div>
                     </div>
                  </div>

                  {/* FORMA DE PAGAMENTO */}
                  <div className="space-y-4">
                     <div className="flex items-center gap-3">
                        <CreditCard className="w-4 h-4 text-[#f45145]" />
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Forma de Pagamento</h3>
                     </div>
                     <div className="bg-gray-50 rounded-2xl p-5 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                              {(() => {
                                 const method = data?.estabelecimento?.lista_forma_pagamento_lista_forma_pagamento_estabelecimentoToestabelecimento?.find((i: any) => i.dominio.id_dominio === paymentMethod)?.dominio;
                                 if (method?.nome?.toLowerCase().includes('pix')) return <QrCode className="w-6 h-6 text-[#f45145]" />;
                                 if (method?.nome?.toLowerCase().includes('dinheiro')) return <Banknote className="w-6 h-6 text-[#f45145]" />;
                                 return <CreditCard className="w-6 h-6 text-[#f45145]" />;
                              })()}
                           </div>
                           <div>
                              <p className="font-black text-gray-800 text-sm uppercase">
                                 {data?.estabelecimento?.lista_forma_pagamento_lista_forma_pagamento_estabelecimentoToestabelecimento?.find((i: any) => i.dominio.id_dominio === paymentMethod)?.dominio?.nome || 'Não selecionado'}
                              </p>
                              {needsChange && (
                                 <p className="text-[10px] text-green-600 font-bold uppercase">Troco para {parseFloat(changeFor || "0").toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                              )}
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Footer do Review */}
               <div className="p-8 bg-gray-50 border-t border-gray-100 space-y-6">
                  <div className="space-y-2">
                     <div className="flex justify-between items-center text-xs text-gray-400 font-bold uppercase tracking-widest">
                        <span>Subtotal</span>
                        <span>{total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                     </div>
                     {orderType === 'delivery' && (
                        <div className="flex justify-between items-center text-xs text-gray-400 font-bold uppercase tracking-widest">
                           <span>Taxa de Entrega</span>
                           <span>{deliveryFee === 0 ? 'Grátis' : deliveryFee?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                        </div>
                     )}
                     <div className="flex justify-between items-center pt-2">
                        <span className="text-base font-black text-gray-800 uppercase tracking-tight">Total a Pagar</span>
                        <span className="text-2xl font-black text-[#f45145]">
                           {((total || 0) + (deliveryFee || 0)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </span>
                     </div>
                  </div>

                  <button 
                    onClick={handleConfirmOrder}
                    disabled={orderLoading}
                    className="w-full bg-[#f45145] text-white font-black py-6 rounded-[24px] shadow-2xl shadow-[#f45145]/30 flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-95 transition-all border-b-4 border-black/10 disabled:opacity-50"
                  >
                    {orderLoading ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <>
                        <Check className="w-6 h-6" />
                        CONFIRMAR E ENVIAR PEDIDO
                      </>
                    )}
                  </button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
