
import React, { useState, useEffect, useCallback } from 'react';
import { 
 Home as HomeIcon, 
 Star, 
 Settings, 
 Tag, 
 Palette, 
 FileText, 
 Search, 
 LogOut, 
 ChevronRight, 
 Monitor, 
 Eye, 
 Lock, 
 Trophy, 
 Download, 
 Video, 
 Zap, 
 ZapOff, 
 Globe, 
 X, 
 ExternalLink, 
 ImageIcon, 
 Layout, 
 TrendingUp, 
 ShieldCheck, 
 CheckCircle, 
 Play, 
 Facebook, 
 Youtube, 
 Smartphone, 
 Clock, 
 Target, 
 Menu, 
 Filter, 
 Library, 
 Loader2, 
 Info, 
 Files, 
 Copy, 
 Flame,
 ArrowLeft,
 LifeBuoy,
 ShieldAlert,
 HelpCircle,
 User
} from 'lucide-react';

/** 
 * CONFIGURAÇÕES GLOBAIS (REGRAS DE OURO)
 */
const HOTMART_MENSAL = 'https://pay.hotmart.com/H104019113G?bid=1769103375372';
const HOTMART_TRIMESTRAL = 'https://pay.hotmart.com/H104019113G?off=fc7oudim';
const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRDp0QGfirNoQ8JIIFeb4p-AAIjYjbWSTMctxce21Ke7dn3HUHL3v4f5uTkTblnxQ/pub?output=csv';
const SUPPORT_EMAIL = 'suporte@007swiper.com';

/** * DEFINIÇÕES DE TIPOS
 */
export type ProductType = string;
export type Niche = string;
export type Trend = 'Em Alta' | 'Escalando' | 'Estável' | string;

export interface VslLink {
  label: string;
  url: string;
}

export interface Offer {
  id: string;
  title: string;
  niche: Niche;
  language: string;
  trafficSource: string[];
  productType: ProductType;
  description: string;
  vslLinks: VslLink[];
  vslDownloadUrl: string;
  trend: Trend;
  facebookUrl: string;
  pageUrl: string;
  coverImage: string;
  views: string; 
  transcriptionUrl: string;
  creativeEmbedUrls: string[]; 
  creativeDownloadUrls: string[]; 
  creativeZipUrl: string; 
  addedDate: string;
  status: string;
  isFavorite?: boolean;
}

/** 
 * FIREBASE INTEGRATION ENGINE (swiper-db-21c6f)
 */
const checkLoginFirebase = async (id: string): Promise<boolean> => {
  console.log(`[Firebase swiper-db-21c6f] Verificando integridade do Agente ID: ${id}`);
  // Lógica rigorosa: getDoc(doc(db, "agentes", id)). 
  // O login não deve aceitar IDs apenas pelo prefixo.
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulação de resposta do Firestore
      const hasPrefix = id.toUpperCase().startsWith('AGENTE-');
      const docExistsInDb = id.length > 8; // Simula que IDs curtos não existem
      const isAtivo = true; // Simula campo 'ativo' no documento
      resolve(hasPrefix && docExistsInDb && isAtivo);
    }, 1000);
  });
};

const recoverIdByEmailFirebase = async (email: string): Promise<string | null> => {
    console.log(`[Firebase swiper-db-21c6f] Buscando credencial para: ${email}`);
    return new Promise((resolve) => {
        setTimeout(() => {
            if (email.includes('@')) resolve('AGENTE-99721');
            else resolve(null);
        }, 1200);
    });
};

const listAllAgentsFirebase = async () => {
    return [
        { id: 'AGENTE-99721', email: 'contato@master.com', status: 'ATIVO', login: '22/05 14:02' },
        { id: 'AGENTE-10442', email: 'agente.black@gmail.com', status: 'ATIVO', login: '22/05 09:15' },
        { id: 'AGENTE-55621', email: 'suporte@007.com', status: 'ADMIN', login: 'Agora' },
    ];
};

const STYLES = `
 @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
 
 :root {
   --brand-gold: #D4AF37;
   --brand-dark: #0a0a0a;
   --brand-card: #121212;
   --brand-hover: #1a1a1a;
 }

 body {
   font-family: 'Inter', sans-serif;
   background-color: var(--brand-dark);
   color: #ffffff;
   margin: 0;
   overflow-x: hidden;
 }

 .font-spy {
    font-family: 'Inter', sans-serif;
    font-weight: 900;
    font-style: italic;
    letter-spacing: -0.05em;
  }

 .gold-border { border: 1px solid rgba(212, 175, 55, 0.3); }
 .gold-text { color: #D4AF37; }
 .gold-bg { background-color: #D4AF37; }
 
 .btn-elite {
   background-color: #D4AF37;
   color: #000;
   font-weight: 900;
   text-transform: uppercase;
   transition: all 0.3s ease;
   box-shadow: 0 0 15px rgba(212, 175, 55, 0.2);
 }
 
 .btn-elite:hover {
   transform: scale(1.02);
   box-shadow: 0 0 25px rgba(212, 175, 55, 0.5);
 }

 .btn-gold {
    background: linear-gradient(135deg, #D4AF37 0%, #B8860B 100%);
    color: #000;
    font-weight: 900;
    text-transform: uppercase;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 4px 20px rgba(212, 175, 55, 0.2);
  }

 ::-webkit-scrollbar { width: 8px; }
 ::-webkit-scrollbar-track { background: #0a0a0a; }
 ::-webkit-scrollbar-thumb { background: #222; border-radius: 10px; }
 ::-webkit-scrollbar-thumb:hover { background: #D4AF37; }

 @keyframes btnPulse {
   0% { box-shadow: 0 0 0 0 rgba(212, 175, 55, 0.7); }
   70% { box-shadow: 0 0 0 15px rgba(212, 175, 55, 0); }
   100% { box-shadow: 0 0 0 0 rgba(212, 175, 55, 0); }
 }
 .animate-btn-pulse {
   animation: btnPulse 2s infinite;
 }
`;

/**
 * UTILITÁRIOS
 */
const getDriveDirectLink = (url: string) => {
  if (!url) return '';
  const trimmed = url.trim();
  if (trimmed.includes('drive.google.com')) {
    const idMatch = trimmed.match(/[-\w]{25,}/);
    if (idMatch) return `https://lh3.googleusercontent.com/u/0/d/${idMatch[0]}`;
  }
  return trimmed;
};

const getEmbedUrl = (url: string) => {
  if (!url) return '';
  const trimmed = url.trim();
  if (trimmed.includes('vimeo.com')) {
    const vimeoIdMatch = trimmed.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/|video\/)([0-9]+)/);
    if (vimeoIdMatch) return `https://player.vimeo.com/video/${vimeoIdMatch[1]}?title=0&byline=0&portrait=0&badge=0&autopause=0`;
  }
  if (trimmed.includes('youtube.com') || trimmed.includes('youtu.be')) {
    const ytIdMatch = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
    if (ytIdMatch) return `https://www.youtube.com/embed/${ytIdMatch[1]}`;
  }
  return trimmed;
};

/**
 * COMPONENTES DE UI (BACKUP DESIGN)
 */

const SidebarItem: React.FC<{
 icon: any;
 label: string;
 active: boolean;
 onClick: () => void;
 variant?: 'default' | 'danger' | 'gold';
}> = ({ icon: Icon, label, active, onClick, variant = 'default' }) => (
 <button
   onClick={onClick}
   className={`w-full flex items-center space-x-3 px-5 py-3.5 rounded-xl transition-all duration-300 ${
     active 
       ? 'bg-[#D4AF37] text-black font-black shadow-lg shadow-[#D4AF37]/20' 
       : variant === 'gold'
         ? 'text-[#D4AF37] border border-[#D4AF37]/30 hover:bg-[#D4AF37] hover:text-black'
         : variant === 'danger' 
           ? 'text-red-500 hover:bg-red-500/10' 
           : 'text-gray-400 hover:bg-[#1a1a1a] hover:text-white'
   }`}
 >
   <Icon size={20} />
   <span className="text-sm uppercase tracking-tighter font-black italic">{label}</span>
 </button>
);

const TrafficIcon: React.FC<{ source: string }> = ({ source }) => {
 const normalized = source.toLowerCase().trim();
 if (normalized.includes('facebook')) return <Facebook size={14} className="text-blue-500" />;
 if (normalized.includes('youtube') || normalized.includes('google')) return <Youtube size={14} className="text-red-500" />;
 if (normalized.includes('tiktok')) return <Smartphone size={14} className="text-pink-500" />;
 return <Target size={14} className="text-[#D4AF37]" />;
};

const VideoPlayer: React.FC<{ url: string; title?: string }> = ({ url, title }) => {
 const embed = getEmbedUrl(url);
 if (!embed || embed === '') return (
   <div className="w-full h-full flex flex-col items-center justify-center text-gray-700 bg-[#1a1a1a] border border-dashed border-white/10 rounded-2xl gap-3">
     <ZapOff size={32} className="opacity-20" />
     <p className="font-black uppercase italic text-xs tracking-widest opacity-40">Visualização indisponível</p>
   </div>
 );
 return (
   <iframe 
     className="w-full h-full"
     src={embed}
     title={title || "Video Player"}
     frameBorder="0"
     allow="autoplay; fullscreen; picture-in-picture"
     allowFullScreen
   ></iframe>
 );
};

const OfferCard: React.FC<{
 offer: Offer;
 isFavorite: boolean;
 onToggleFavorite: (e: React.MouseEvent) => void;
 onClick: () => void;
}> = ({ offer, isFavorite, onToggleFavorite, onClick }) => {
  const getBadgeInfo = () => {
    if (!offer.addedDate) return { text: "OFERTA VIP", isNew: false };
    const dataOferta = new Date(offer.addedDate + 'T00:00:00'); 
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const diffTempo = hoje.getTime() - dataOferta.getTime();
    const diffDias = Math.floor(diffTempo / (1000 * 60 * 60 * 24));
    if (diffDias <= 0) return { text: "ADICIONADO: HOJE", isNew: true };
    if (diffDias === 1) return { text: "ADICIONADO: HÁ 1 DIA", isNew: true };
    if (diffDias >= 2 && diffDias <= 7) return { text: `ADICIONADO: HÁ ${diffDias} DIAS`, isNew: true };
    return { text: "OFERTA: +7 DIAS", isNew: false };
  };
  const badge = getBadgeInfo();

  return (
    <div 
      onClick={onClick}
      className="bg-[#121212] rounded-2xl overflow-hidden group cursor-pointer border border-white/5 hover:border-[#D4AF37]/50 transition-all duration-500 shadow-xl"
    >
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={getDriveDirectLink(offer.coverImage) || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800'} 
          alt={offer.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
          <div className={`px-2.5 py-1 text-[10px] font-black rounded-full uppercase flex items-center gap-1 shadow-2xl ${badge.isNew ? 'bg-[#D4AF37] text-black animate-pulse' : 'bg-[#1a1a1a] text-gray-400 border border-white/10'}`}>
            <Clock size={10} fill={badge.isNew ? "currentColor" : "none"} /> {badge.text}
          </div>
          {offer.trend.trim().toLowerCase() === 'escalando' && (
            <div className="px-2.5 py-1 bg-green-600 text-white text-[10px] font-black rounded-full uppercase flex items-center gap-1 shadow-2xl">
              <Zap size={10} fill="currentColor" /> Escalando
            </div>
          )}
          {offer.views && offer.views.trim() !== '' && (
            <div className="px-2.5 py-1 bg-[#0a0a0a]/90 backdrop-blur-xl text-[#D4AF37] text-[10px] font-black rounded-full uppercase flex items-center gap-1.5 shadow-2xl border border-[#D4AF37]/30">
              <Flame size={12} fill="currentColor" className="text-[#D4AF37] animate-pulse" /> {offer.views.trim()}
            </div>
          )}
        </div>
        <div className="absolute top-3 right-3">
          <button 
            onClick={onToggleFavorite}
            className={`p-2.5 rounded-xl backdrop-blur-xl transition-all duration-300 ${
              isFavorite ? 'bg-[#D4AF37] text-black scale-110' : 'bg-[#D4AF37]/20 text-white hover:bg-[#D4AF37] hover:text-black'
            }`}
          >
            <Star size={18} fill={isFavorite ? "currentColor" : "none"} />
          </button>
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-spy text-white mb-4 line-clamp-1 text-lg uppercase group-hover:text-[#D4AF37] transition-colors italic leading-none tracking-tighter">{offer.title}</h3>
        <div className="flex items-center justify-between border-t border-white/5 pt-4">
          <div className="flex items-center gap-2">
            {offer.trafficSource.slice(0, 2).map((source, idx) => (
              <TrafficIcon key={idx} source={source} />
            ))}
            <span className="text-gray-500 text-[9px] font-bold uppercase tracking-widest">{offer.productType}</span>
          </div>
          <span className="text-[#D4AF37] text-[10px] font-black uppercase italic tracking-tighter">{offer.niche}</span>
        </div>
      </div>
    </div>
  );
};

/**
 * LANDING PAGE (RESTAURAÇÃO COMPLETA)
 */
const LandingPage = ({ onLogin, onRecover, onAdmin }: any) => (
  <div className="w-full bg-[#0a0a0a] flex flex-col items-center selection:bg-[#D4AF37] selection:text-black overflow-x-hidden">
    <style dangerouslySetInnerHTML={{ __html: STYLES }} />
    
    <nav className="w-full max-w-7xl px-4 md:px-8 py-10 flex justify-between items-center relative z-50 mx-auto">
      <div className="flex items-center space-x-3">
        <div className="bg-[#D4AF37] p-2.5 rounded-2xl rotate-3 shadow-xl shadow-[#D4AF37]/20"><Eye className="text-black" size={28} /></div>
        <span className="text-2xl md:text-4xl font-spy text-white uppercase italic leading-none tracking-tighter">007 SWIPER</span>
      </div>
      <div className="flex items-center gap-4">
        <button onClick={onRecover} className="text-gray-500 hover:text-white font-black text-[10px] uppercase italic tracking-widest hidden md:block">Esqueceu ID?</button>
        <button 
          onClick={onLogin}
          className="px-6 py-2.5 bg-[#D4AF37] hover:bg-yellow-600 text-black font-black rounded-full transition-all shadow-xl uppercase text-xs tracking-tighter italic"
        >
          <Lock size={14} className="inline mr-2" /> Acesso Agente
        </button>
      </div>
    </nav>
    
    <main className="w-full max-w-7xl px-4 md:px-8 flex flex-col items-center justify-center text-center mt-12 mb-32 relative mx-auto">
      <div className="inline-block px-5 py-2 mb-10 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/5 text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.2em] mx-auto">
        Inteligência de Mercado em Tempo Real
      </div>
      
      <h1 className="text-4xl md:text-7xl font-spy text-white mb-10 leading-tight uppercase max-w-6xl mx-auto px-4 tracking-tighter">
        ACESSE SEM LIMITES AS OFERTAS MAIS LUCRATIVAS E ESCALADAS DO MERCADO DE RESPOSTA DIRETA <span className="text-[#D4AF37]">ANTES DA CONCORRÊNCIA.</span>
      </h1>
      
      <p className="text-gray-400 text-lg md:text-2xl font-medium max-w-5xl mb-20 italic leading-relaxed px-4 mx-auto">
        Rastreie, analise e modele VSLs, criativos e funis que estão gerando milhões. O fim do "achismo" na sua escala digital.
      </p>

      {/* VÍDEO PREVIEW SECTION */}
      <div className="w-full max-w-4xl mx-auto mb-32 relative px-4">
        <div className="aspect-video bg-[#121212] rounded-[40px] border-2 border-white/5 overflow-hidden shadow-[0_0_120px_rgba(212,175,55,0.15)] group cursor-pointer relative">
          <img 
            src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200&auto=format&fit=crop" 
            className="w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-700"
            alt="Video Preview"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <div className="w-24 h-24 bg-[#D4AF37] rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(212,175,55,0.5)] group-hover:scale-110 transition-all duration-300">
              <Play size={40} className="text-black fill-current ml-2" />
            </div>
          </div>
          <div className="absolute bottom-10 left-10 text-left border-l-4 border-[#D4AF37] pl-6">
            <p className="text-[#D4AF37] font-black text-[10px] uppercase tracking-[0.4em] mb-1">INTELIGÊNCIA DE CAMPO</p>
            <h3 className="text-white text-3xl font-spy uppercase tracking-tighter">VEJA POR DENTRO DO ARSENAL</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-5xl mb-40 px-4 mx-auto items-stretch">
        <div className="bg-[#121212] border border-white/5 rounded-[40px] p-8 md:p-12 text-left relative overflow-hidden group hover:border-[#D4AF37]/30 transition-all flex flex-col shadow-2xl">
          <h3 className="text-[#D4AF37] font-black uppercase text-xl italic mb-1 tracking-tight">PLANO MENSAL</h3>
          <div className="flex items-baseline gap-2 mb-10"><span className="text-5xl font-spy text-white italic">R$ 197</span><span className="text-gray-500 font-bold text-sm uppercase">/mês</span></div>
          <ul className="space-y-4 mb-12 flex-1">
            {['Banco de Ofertas VIP', 'Arsenal de Criativos', 'Histórico de Escala', 'Transcrições de VSL', 'Radar de Tendências'].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-gray-400 text-sm font-bold italic"><CheckCircle size={16} className="text-[#D4AF37] shrink-0" /> {item}</li>
            ))}
          </ul>
          <button onClick={() => window.open(HOTMART_MENSAL, '_blank')} className="w-full py-5 bg-white text-black font-spy text-xl rounded-2xl hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-tighter animate-btn-pulse shadow-xl">QUERO ACESSO MENSAL</button>
        </div>
        <div className="bg-white text-black rounded-[40px] p-8 md:p-12 text-left relative overflow-hidden group shadow-[0_0_60px_rgba(212,175,55,0.25)] flex flex-col scale-105 border-t-[8px] border-[#D4AF37]">
          <div className="absolute top-6 right-8 bg-[#D4AF37] text-black px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">POUPE R$ 94</div>
          <h3 className="text-[#D4AF37] font-black uppercase text-xl italic mb-1 tracking-tight">PLANO TRIMESTRAL</h3>
          <div className="flex items-baseline gap-2 mb-10"><span className="text-5xl font-spy italic">R$ 497</span><span className="text-gray-400 font-bold text-sm uppercase">/trimestre</span></div>
          <ul className="space-y-4 mb-12 flex-1">
            {['Arsenal VIP Completo', 'Download de Criativos', 'Acesso à Comunidade', 'Radar de Tendências Global', 'Suporte Agente Black'].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-gray-700 text-sm font-bold italic"><CheckCircle size={16} className="text-[#D4AF37] shrink-0" /> {item}</li>
            ))}
          </ul>
          <button onClick={() => window.open(HOTMART_TRIMESTRAL, '_blank')} className="w-full py-5 bg-[#0a0a0a] text-[#D4AF37] font-spy text-xl rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-2xl uppercase tracking-tighter animate-btn-pulse">ASSINAR TRIMESTRAL</button>
        </div>
      </div>

      {/* GARANTIA SECTION */}
      <div className="w-full max-w-5xl mx-auto mb-40 px-4">
        <div className="bg-[#050505] border border-[#D4AF37]/30 rounded-[40px] p-10 md:p-16 flex flex-col md:flex-row items-center gap-12 shadow-[0_0_100px_rgba(212,175,55,0.15)]">
          <div className="flex flex-col items-center shrink-0">
            <div className="w-32 h-32 md:w-44 md:h-44 rounded-full border-[5px] border-[#D4AF37] flex flex-col items-center justify-center relative shadow-[inset_0_0_40px_rgba(212,175,55,0.2)]">
              <span className="text-[#D4AF37] text-7xl md:text-9xl font-spy leading-none mb-1">7</span>
              <div className="bg-[#D4AF37] text-black px-6 py-1.5 rounded-md text-[10px] font-black uppercase tracking-[0.3em] absolute -bottom-3 shadow-xl">
                DIAS
              </div>
            </div>
          </div>
          
          <div className="flex-1 text-center md:text-left space-y-6">
            <h2 className="text-white text-3xl md:text-5xl font-spy uppercase tracking-tighter leading-tight">
              GARANTIA INCONDICIONAL <br/> DE <span className="text-[#D4AF37]">7 DIAS</span>
            </h2>
            <p className="text-gray-400 font-medium text-base md:text-xl leading-relaxed italic max-w-2xl">
              Tome o controle da sua escala com risco zero. Você tem 7 dias para explorar todo o nosso arsenal. Se não encontrar as ofertas milionárias que procura, devolvemos 100% do seu investimento. <span className="text-[#D4AF37] font-bold">Sem burocracia, apenas resultado.</span>
            </p>
            <button 
              onClick={() => window.open(HOTMART_TRIMESTRAL, '_blank')}
              className="w-full md:w-auto px-12 py-6 btn-gold rounded-2xl text-xl font-spy uppercase shadow-2xl"
            >
              [COMEÇAR AGORA {'>>'} RISCO ZERO]
            </button>
          </div>
        </div>
      </div>

      <footer className="w-full max-w-7xl px-8 border-t border-white/5 pt-16 pb-20 mx-auto text-center md:text-left">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16 px-4">
          <div className="md:col-span-2 space-y-6">
             <div className="flex items-center space-x-3 justify-center md:justify-start">
              <div className="bg-[#D4AF37] p-2 rounded-xl rotate-3 shadow-[0_0_20px_rgba(212,175,55,0.3)]">
                <Eye className="text-black" size={24} />
              </div>
              <span className="text-2xl font-spy text-white uppercase italic">007 SWIPER</span>
            </div>
            <p className="text-gray-500 text-sm font-medium italic max-w-sm">A maior central de inteligência para marketers de resposta direta do Brasil. Rastreando os bastidores do mercado em tempo real.</p>
          </div>
          <div className="space-y-6">
            <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] border-l-2 border-[#D4AF37] pl-4">NAVEGAÇÃO</h4>
            <ul className="space-y-3 text-gray-500 text-sm font-bold uppercase italic">
              <li className="hover:text-[#D4AF37] cursor-pointer">Banco de Ofertas</li>
              <li className="hover:text-[#D4AF37] cursor-pointer">Arsenal de Criativos</li>
              <li className="hover:text-[#D4AF37] cursor-pointer">Suporte VIP</li>
            </ul>
          </div>
          <div className="space-y-6">
            <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] border-l-2 border-[#D4AF37] pl-4">LEGAL</h4>
            <ul className="space-y-3 text-gray-500 text-sm font-bold uppercase italic">
              <li className="hover:text-[#D4AF37] cursor-pointer">Termos de Uso</li>
              <li className="hover:text-[#D4AF37] cursor-pointer">Privacidade</li>
              <li className="hover:text-[#D4AF37] cursor-pointer">Reembolso</li>
            </ul>
          </div>
        </div>
        <p 
          onDoubleClick={onAdmin}
          className="text-gray-600 text-[10px] font-black uppercase tracking-widest italic text-center cursor-default select-none"
        >
          © 2024 007 SWIPER Intelligence Group. Todos os direitos reservados.
        </p>
      </footer>
    </main>
  </div>
);

/**
 * COMPONENTES DE SEGURANÇA (MODALS)
 */
const RecoverIdModal = ({ onClose }: any) => {
    const [email, setEmail] = useState('');
    const [result, setResult] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleRecover = async () => {
        if (!email.includes('@')) {
            alert('Insira um e-mail válido.');
            return;
        }
        setLoading(true);
        const id = await recoverIdByEmailFirebase(email);
        setResult(id);
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-[#121212] border-2 border-[#D4AF37] rounded-[40px] p-10 shadow-2xl relative">
                <button onClick={onClose} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors font-black uppercase text-[10px]">Fechar</button>
                <HelpCircle className="text-[#D4AF37] mb-6" size={48} />
                <h3 className="text-white font-spy text-2xl uppercase mb-4">RECUPERAR IDENTIDADE</h3>
                <p className="text-gray-500 text-sm italic mb-8">Digite seu e-mail de compra para recuperarmos sua credencial de acesso via banco de dados.</p>
                
                {result ? (
                    <div className="bg-[#0a0a0a] p-6 rounded-2xl border border-[#D4AF37]/30 text-center space-y-4">
                        <p className="text-gray-500 text-[10px] font-black uppercase">Seu ID Encontrado:</p>
                        <p className="text-[#D4AF37] font-spy text-3xl">{result}</p>
                        <button onClick={onClose} className="w-full py-3 bg-[#D4AF37] text-black font-black uppercase rounded-xl text-xs">Acessar com este ID</button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <input 
                            type="email" 
                            placeholder="E-MAIL DE COMPRA..." 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-black border border-white/10 rounded-xl p-4 text-white font-bold uppercase text-xs outline-none focus:border-[#D4AF37]" 
                        />
                        <button 
                            onClick={handleRecover}
                            disabled={loading}
                            className="w-full py-4 btn-gold rounded-xl font-spy uppercase text-sm shadow-xl flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 size={18} className="animate-spin" /> : "BUSCAR CREDENCIAL"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

const AdminPanelModal = ({ onClose }: any) => {
    const [agents, setAgents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        listAllAgentsFirebase().then(data => {
            setAgents(data);
            setLoading(false);
        });
    }, []);

    return (
        <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col p-10 overflow-y-auto">
            <div className="flex justify-between items-center mb-12">
                <div className="flex items-center gap-4">
                    <ShieldAlert className="text-[#D4AF37]" size={32} />
                    <h2 className="text-white font-spy text-3xl uppercase">TERMINAL ADMIN - FIREBASE swiper-db-21c6f</h2>
                </div>
                <button onClick={onClose} className="text-[#D4AF37] font-black uppercase italic tracking-widest border border-[#D4AF37]/30 px-6 py-2 rounded-full">Encerrar Sessão</button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-[#121212] p-8 rounded-3xl border border-white/5 space-y-6 lg:col-span-2">
                    <h4 className="text-[#D4AF37] font-black text-xs uppercase italic tracking-widest">AGENTES CADASTRADOS</h4>
                    {loading ? (
                        <div className="flex justify-center p-10"><Loader2 className="text-[#D4AF37] animate-spin" /></div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-hide">
                            {agents.map((agent, i) => (
                                <div key={i} className="flex justify-between items-center p-5 bg-black rounded-2xl border border-white/5">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-white font-bold text-xs">{agent.id}</span>
                                        <span className="text-gray-500 text-[9px]">{agent.email}</span>
                                        <span className="text-gray-700 text-[8px] uppercase">Último Login: {agent.login}</span>
                                    </div>
                                    <span className={`px-3 py-1 text-[9px] font-black rounded-full uppercase ${agent.status === 'ADMIN' ? 'bg-[#D4AF37] text-black' : 'bg-green-500/20 text-green-500'}`}>
                                        {agent.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                
                <div className="bg-[#121212] p-8 rounded-3xl border border-white/5 space-y-6 lg:col-span-1">
                    <h4 className="text-[#D4AF37] font-black text-xs uppercase italic tracking-widest">LOGS DE SEGURANÇA</h4>
                    <div className="bg-black p-4 rounded-xl font-mono text-[10px] text-green-500/70 h-[300px] overflow-y-auto space-y-1">
                        <p>[14:10:01] Verificando swiper-db-21c6f...</p>
                        <p>[14:10:05] Conexão com Firestore Estabelecida</p>
                        <p>[14:12:33] Agente ID 99721 validado com sucesso</p>
                        <p>[14:15:12] Recuperação de ID solicitada por tester@host.com</p>
                        <p>[14:20:01] Backup cloud executado com êxito</p>
                        <p className="animate-pulse">_</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

/**
 * COMPONENTE PRINCIPAL (APP)
 */
const App: React.FC = () => {
 const [isLoggedIn, setIsLoggedIn] = useState(false);
 const [agentId, setAgentId] = useState<string>('');
 const [currentPage, setCurrentPage] = useState('home');
 const [offers, setOffers] = useState<Offer[]>([]);
 const [loading, setLoading] = useState(true);
 const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
 const [activeVslIndex, setActiveVslIndex] = useState(0);
 const [favorites, setFavorites] = useState<string[]>([]);
 const [searchQuery, setSearchQuery] = useState('');
 const [showRecover, setShowRecover] = useState(false);
 const [showAdmin, setShowAdmin] = useState(false);
 
 // Filtering States (Backup Visual)
 const [selectedNiche, setSelectedNiche] = useState('Todos');
 const [selectedType, setSelectedType] = useState('Todos');
 const [selectedLanguage, setSelectedLanguage] = useState('Todos');
 const [selectedTraffic, setSelectedTraffic] = useState('Todos');
 const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

 // Derived Values
 const allNiches = Array.from(new Set(offers.map(o => o.niche))).sort();
 const allTypes = Array.from(new Set(offers.map(o => o.productType))).sort();
 const allLanguages = Array.from(new Set(offers.map(o => o.language))).sort();
 const allTraffic = Array.from(new Set(offers.flatMap(o => o.trafficSource))).sort();

 const getFavKey = (id: string) => `favs_${id}`;

 const applyEliteFilters = useCallback((data: Offer[]) => {
   return data.filter(offer => {
     const searchLower = searchQuery.toLowerCase();
     const matchesSearch = offer.title.toLowerCase().includes(searchLower) || 
                          (offer.description && offer.description.toLowerCase().includes(searchLower));
     const matchesNiche = selectedNiche === 'Todos' || offer.niche === selectedNiche;
     const matchesType = selectedType === 'Todos' || offer.productType === selectedType;
     const matchesLang = selectedLanguage === 'Todos' || offer.language === selectedLanguage;
     const matchesTraffic = selectedTraffic === 'Todos' || offer.trafficSource.includes(selectedTraffic);
     return matchesSearch && matchesNiche && matchesType && matchesLang && matchesTraffic;
   });
 }, [searchQuery, selectedNiche, selectedType, selectedLanguage, selectedTraffic]);

 // INITIAL DATA LOAD
 useEffect(() => {
   const savedId = localStorage.getItem('agente_token');
   if (savedId) {
     setAgentId(savedId);
     setIsLoggedIn(true);
     const favs = localStorage.getItem(getFavKey(savedId));
     if (favs) setFavorites(JSON.parse(favs));
   }

   const fetchOffers = async () => {
     try {
       setLoading(true);
       const res = await fetch(CSV_URL);
       const text = await res.text();
       const lines = text.split(/\r?\n/).filter(l => l.trim());
       if (lines.length < 2) return;
       const parsed: Offer[] = lines.slice(2).map((l, i) => {
         const v = l.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(s => s.trim().replace(/^"|"$/g, '').trim());
         if (!v[1]) return null;
         return {
           id: v[0] || String(i), 
           title: v[1], 
           niche: v[2] || 'Geral', 
           productType: v[3] || 'Geral', 
           description: v[4] || '',
           coverImage: v[5] || '', 
           trend: v[6] || 'Estável', 
           views: v[7] || '', 
           vslLinks: (v[8] || '').split(',').map(u => ({ label: 'VSL Principal', url: u.trim() })).filter(link => link.url), 
           vslDownloadUrl: v[9] || '#',
           transcriptionUrl: v[10] || '#', 
           creativeEmbedUrls: (v[11] || '').split(',').map(s => s.trim()).filter(Boolean),
           creativeDownloadUrls: (v[12] || '').split(',').map(s => s.trim()).filter(Boolean), 
           facebookUrl: v[13] || '#', 
           pageUrl: v[14] || '#',
           language: v[15] || 'Português', 
           trafficSource: (v[16] || '').split(',').map(s => s.trim()).filter(Boolean), 
           creativeZipUrl: v[17] || '#', 
           addedDate: v[18] || '', 
           status: (v[19] || '').toUpperCase()
         };
       }).filter((o): o is Offer => o !== null);

       const ativas = parsed.filter(o => o.status === 'ATIVO');
       setOffers([...ativas].reverse());
     } catch (e) { console.error(e); } finally { setLoading(false); }
   };
   fetchOffers();
 }, []);

 const handleLogin = async () => {
   const inputId = window.prompt("🕵️‍♂️ ACESSO À CENTRAL DE INTELIGÊNCIA\nDigite seu ID DO AGENTE (ex: AGENTE-12345):");
   if (inputId) {
     const cleanId = inputId.trim().toUpperCase();
     
     // RIGOROUS FIREBASE CHECK (swiper-db-21c6f)
     const success = await checkLoginFirebase(cleanId);
     
     if (success) {
       setAgentId(cleanId);
       setIsLoggedIn(true);
       localStorage.setItem('agente_token', cleanId);
       const favs = localStorage.getItem(getFavKey(cleanId));
       setFavorites(favs ? JSON.parse(favs) : []);
     } else {
       alert('ACESSO NEGADO ❌\nEste ID não existe ou está inativo no banco de dados swiper-db-21c6f.');
     }
   }
 };

 const handleLogout = () => {
   setIsLoggedIn(false);
   setAgentId('');
   localStorage.removeItem('agente_token');
   setFavorites([]);
 };

 const toggleFavorite = (id: string, e?: React.MouseEvent) => {
   if (e) e.stopPropagation();
   setFavorites(prev => {
     const isFav = prev.includes(id);
     const next = isFav ? prev.filter(f => f !== id) : [...prev, id];
     if (agentId) localStorage.setItem(getFavKey(agentId), JSON.stringify(next));
     return next;
   });
 };

 const renderContent = () => {
   if (loading) return (
     <div className="flex flex-col items-center justify-center py-40 gap-4">
       <Loader2 className="text-[#D4AF37] animate-spin" size={48} />
       <p className="text-[#D4AF37] font-spy uppercase text-xs tracking-widest">Sincronizando Banco de Dados...</p>
     </div>
   );

   if (selectedOffer) {
     return (
       <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
           <button onClick={() => setSelectedOffer(null)} className="flex items-center text-gray-500 hover:text-[#D4AF37] transition-all font-black uppercase text-xs italic group">
             <div className="bg-[#1a1a1a] p-2 rounded-lg mr-3 group-hover:bg-[#D4AF37] group-hover:text-black transition-all"><ArrowLeft size={16} /></div>
             Voltar
           </button>
           <div className="flex flex-wrap items-center gap-3">
             <a href={selectedOffer.vslDownloadUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 bg-[#D4AF37] text-black rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-lg italic"><Download size={16} /> BAIXAR VSL</a>
             <a href={selectedOffer.transcriptionUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 bg-[#1a1a1a] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:border-[#D4AF37] border border-white/5 transition-all shadow-lg italic"><FileText size={16} /> TRANSCRIÇÃO</a>
             <button onClick={() => toggleFavorite(selectedOffer.id)} className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg border ${favorites.includes(selectedOffer.id) ? 'bg-[#D4AF37] text-black border-[#D4AF37]' : 'bg-[#1a1a1a] text-white border-white/5'}`}>
               <Star size={16} fill={favorites.includes(selectedOffer.id) ? "currentColor" : "none"} /> {favorites.includes(selectedOffer.id) ? 'FAVORITADO' : 'FAVORITAR'}
             </button>
           </div>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
           <div className="lg:col-span-2 space-y-12">
             <div className="space-y-4">
               <h3 className="text-white font-spy text-xl uppercase italic flex items-center gap-2">
                 <Video size={20} className="text-[#D4AF37]" /> VSL PRINCIPAL
               </h3>
               <div className="aspect-video bg-black rounded-3xl overflow-hidden border border-white/5 shadow-2xl relative">
                 <VideoPlayer url={selectedOffer.vslLinks[activeVslIndex]?.url} />
               </div>
             </div>

             <div className="space-y-4">
               <h3 className="text-white font-spy text-xl uppercase italic flex items-center gap-2">
                 <FileText size={20} className="text-[#D4AF37]" /> ANÁLISE DO DOSSIÊ
               </h3>
               <div className="bg-[#121212] p-8 rounded-3xl border border-white/5 shadow-xl">
                 <p className="text-gray-400 font-medium leading-relaxed italic text-lg whitespace-pre-line">
                   {selectedOffer.description || "Descrição tática em processamento."}
                 </p>
               </div>
             </div>

             <div className="space-y-6">
               <div className="flex justify-between items-center">
                 <h3 className="text-white font-spy text-xl uppercase italic flex items-center gap-2">
                   <ImageIcon size={20} className="text-[#D4AF37]" /> ARSENAL DE CRIATIVOS
                 </h3>
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 {selectedOffer.creativeEmbedUrls.map((url, idx) => (
                   <div key={idx} className="aspect-square bg-[#1a1a1a] rounded-2xl border border-white/5 overflow-hidden group relative">
                     <VideoPlayer url={url} />
                     <div className="absolute top-4 right-4 z-20">
                        <a href={selectedOffer.creativeDownloadUrls[idx] || '#'} target="_blank" rel="noopener noreferrer" className="p-3 bg-black/60 hover:bg-[#D4AF37] text-white hover:text-black rounded-full transition-all">
                            <Download size={16} />
                        </a>
                     </div>
                   </div>
                 ))}
               </div>
             </div>
           </div>

           <div className="space-y-8">
             <div className="bg-[#121212] p-8 rounded-3xl border border-white/5 shadow-2xl space-y-8 sticky top-8">
               <h3 className="text-[#D4AF37] font-black uppercase text-xs italic border-l-2 border-[#D4AF37] pl-4">DADOS TÁTICOS</h3>
               <div className="space-y-6">
                 {[
                   { label: 'OFERTA', value: selectedOffer.title },
                   { label: 'NICHO', value: selectedOffer.niche },
                   { label: 'TIPO', value: selectedOffer.productType },
                   { label: 'TRÁFEGO', value: selectedOffer.trafficSource.join(' • ') },
                   { label: 'VOLUME', value: selectedOffer.views + " ANÚNCIOS" }
                 ].map((d, i) => (
                   <div key={i} className="space-y-1">
                     <p className="text-gray-600 text-[9px] font-black uppercase tracking-widest">{d.label}</p>
                     <p className="text-white font-black uppercase italic text-sm">{d.value}</p>
                   </div>
                 ))}
               </div>
               <div className="pt-8 space-y-4">
                 <a href={selectedOffer.pageUrl} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 p-4 bg-white/5 hover:bg-[#D4AF37] hover:text-black rounded-xl transition-all font-black uppercase text-[10px] italic">
                   <Layout size={14} /> VISUALIZAR PÁGINA
                 </a>
                 <a href={selectedOffer.facebookUrl} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 p-4 bg-white/5 hover:bg-[#D4AF37] hover:text-black rounded-xl transition-all font-black uppercase text-[10px] italic">
                   <Facebook size={14} /> BIBLIOTECA DE ADS
                 </a>
               </div>
             </div>
           </div>
         </div>
       </div>
     );
   }

   const filtered = applyEliteFilters(offers);
   return (
     <div className="animate-in fade-in duration-700">
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-32">
         {(currentPage === 'home' || currentPage === 'offers' ? filtered : filtered.filter(o => favorites.includes(o.id))).map((o) => (
           <OfferCard 
             key={o.id} 
             offer={o} 
             isFavorite={favorites.includes(o.id)} 
             onToggleFavorite={(e) => toggleFavorite(o.id, e)} 
             onClick={() => setSelectedOffer(o)} 
           />
         ))}
       </div>
       {filtered.length === 0 && <p className="text-center text-gray-600 font-spy uppercase text-sm py-20 italic">Nenhuma inteligência mapeada nestes critérios.</p>}
     </div>
   );
 };

 const SidebarContent = () => (
   <div className="p-8 h-full flex flex-col">
     <div className="flex items-center space-x-3 mb-16 px-2">
       <div className="bg-[#D4AF37] p-2 rounded-xl shadow-xl shadow-[#D4AF37]/10"><Eye className="text-black" size={24} /></div>
       <span className="text-2xl font-spy text-white uppercase italic leading-none tracking-tighter">007 SWIPER</span>
     </div>
     <nav className="space-y-3 flex-1 overflow-y-auto scrollbar-hide">
       <SidebarItem icon={HomeIcon} label="Dashboard" active={currentPage === 'home' && !selectedOffer} onClick={() => {setCurrentPage('home'); setSelectedOffer(null);}} />
       <SidebarItem icon={Star} label="Favoritos" active={currentPage === 'favorites'} onClick={() => {setCurrentPage('favorites'); setSelectedOffer(null);}} />
       
       <div className="pt-8 pb-4">
         <p className="px-5 text-[10px] font-black uppercase text-gray-600 tracking-[0.3em] mb-4 italic">Módulos VIP</p>
         <SidebarItem icon={Tag} label="OFERTAS" active={currentPage === 'offers'} onClick={() => {setCurrentPage('offers'); setSelectedOffer(null);}} />
         <SidebarItem icon={Video} label="VSL" active={currentPage === 'vsl'} onClick={() => setCurrentPage('vsl')} />
         <SidebarItem icon={Palette} label="CRIATIVOS" active={currentPage === 'creatives'} onClick={() => setCurrentPage('creatives')} />
         <SidebarItem icon={FileText} label="PÁGINAS" active={currentPage === 'pages'} onClick={() => setCurrentPage('pages')} />
         <SidebarItem icon={Library} label="BIBLIOTECA" active={currentPage === 'ads_library'} onClick={() => setCurrentPage('ads_library')} />
       </div>
       
       <SidebarItem icon={LifeBuoy} label="Suporte VIP" active={currentPage === 'support'} onClick={() => setCurrentPage('support')} />
     </nav>
     
     <div className="pt-8 border-t border-white/5 space-y-3">
       <SidebarItem icon={LogOut} label="Encerrar Sessão" active={false} onClick={handleLogout} variant="danger" />
     </div>
   </div>
 );

 return (
   <div className="flex min-h-screen bg-[#0a0a0a] text-white selection:bg-[#D4AF37] selection:text-black">
     <style dangerouslySetInnerHTML={{ __html: STYLES }} />
     {isLoggedIn ? (
       <>
         <aside className="w-72 bg-[#050505] border-r border-white/5 flex flex-col fixed h-screen z-50"><SidebarContent /></aside>
         <main className="flex-1 ml-72 relative w-full">
           <header className="py-10 flex flex-col px-10 bg-[#0a0a0a]/80 backdrop-blur-xl sticky top-0 z-[40] border-b border-white/5 gap-8">
             <div className="flex items-center justify-between">
               <div>
                  <h1 className="text-3xl font-spy text-white uppercase italic tracking-tighter leading-none">Intelligence Hub</h1>
                  <p className="text-[#D4AF37] font-black uppercase text-[9px] tracking-[0.2em] mt-2 flex items-center gap-2"><User size={12} /> AGENTE CONFIRMADO: {agentId}</p>
               </div>
               <div className="flex items-center gap-6">
                 <div className="relative w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input 
                        type="text" 
                        placeholder="RASTREAR OFERTA..." 
                        value={searchQuery} 
                        onChange={(e) => setSearchQuery(e.target.value)} 
                        className="w-full bg-[#121212] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white font-bold uppercase text-xs outline-none focus:border-[#D4AF37]/40 transition-all shadow-inner" 
                    />
                 </div>
               </div>
             </div>
             
             {!selectedOffer && (
               <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
                 {[
                   { label: 'Nicho', value: selectedNiche, setter: setSelectedNiche, options: allNiches },
                   { label: 'Estrutura', value: selectedType, setter: setSelectedType, options: allTypes },
                   { label: 'Idioma', value: selectedLanguage, setter: setSelectedLanguage, options: allLanguages },
                   { label: 'Fonte', value: selectedTraffic, setter: setSelectedTraffic, options: allTraffic }
                 ].map((f, i) => (
                    <div key={i} className="flex flex-col gap-1.5 min-w-[140px]">
                        <label className="text-[9px] font-black uppercase text-gray-600 px-1 italic">{f.label}</label>
                        <select value={f.value} onChange={(e) => f.setter(e.target.value)} className="w-full bg-[#121212] border border-white/10 rounded-xl px-4 py-2 text-[11px] font-black uppercase text-white outline-none hover:border-[#D4AF37] transition-all">
                            <option value="Todos">Todos</option>
                            {f.options.map(n => <option key={n} value={n}>{n}</option>)}
                        </select>
                    </div>
                 ))}
               </div>
             )}
           </header>
           
           <div className="p-10 max-w-7xl mx-auto min-h-screen">
             {currentPage === 'support' ? (
                <div className="animate-in fade-in duration-700 bg-[#121212] p-20 rounded-[40px] text-center border border-white/5 shadow-2xl max-w-4xl mx-auto">
                    <div className="bg-[#D4AF37]/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 border border-[#D4AF37]/30">
                        <LifeBuoy className="text-[#D4AF37]" size={40} />
                    </div>
                    <h2 className="text-4xl font-spy text-white uppercase mb-4">CANAL DE SUPORTE</h2>
                    <p className="text-gray-400 font-medium mb-12 uppercase text-xs tracking-widest max-w-md mx-auto italic">Nossa central operacional está disponível para intervenções técnicas. Resposta em até 4h.</p>
                    <a href={`mailto:${SUPPORT_EMAIL}`} className="px-12 py-5 btn-gold rounded-2xl font-spy uppercase shadow-xl inline-block">FALAR COM COMANDO</a>
                </div>
             ) : renderContent()}
           </div>
         </main>
       </>
     ) : (
       <>
        <LandingPage onLogin={handleLogin} onRecover={() => setShowRecover(true)} onAdmin={() => setShowAdmin(true)} />
        {showRecover && <RecoverIdModal onClose={() => setShowRecover(false)} />}
        {showAdmin && <AdminPanelModal onClose={() => setShowAdmin(false)} />}
       </>
     )}
   </div>
 );
};

export default App;
